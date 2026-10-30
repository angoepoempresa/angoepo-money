// Pure Financial Logic & Verification Engine for Angoepo Rewards
// Ensures strict integer accounting in Kwanza (AOA), immutable ledger logic,
// points-to-kwanza conversions, and Multicaixa Express validation.

import { Wallet, WalletTransaction, SystemSettings } from './types';

export const DEFAULT_SETTINGS: SystemSettings = {
  pointsToKwanzaRatio: 10, // 10 points = 1 Kz (so 100 points = 10 Kz)
  minWithdrawalAOA: 1000, // 1.000 Kz minimum withdrawal
  withdrawalFeePercent: 0, // 0% fee default for Multicaixa Express
  referralBonusAOA: 250, // 250 Kz per qualified friend
  dailyLoginRewardPoints: 50, // 50 points daily check-in
  maintenanceMode: false,
  requirePhoneOtpVerification: true,
};

/**
 * Validates an Angolan phone number for Multicaixa Express.
 * Accepts formats: "+244 923 123 456", "244923123456", "923123456", "9xx xxx xxx"
 */
export function isValidAngolanPhone(phone: string): boolean {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  // Format with country code: 244 followed by 9 digits starting with 9 (total 12 digits)
  if (digitsOnly.length === 12 && digitsOnly.startsWith('2449')) {
    return true;
  }
  // Local 9-digit format starting with 9
  if (digitsOnly.length === 9 && digitsOnly.startsWith('9')) {
    return true;
  }
  return false;
}

/**
 * Formats a raw phone into standard Angolan format: +244 9XX XXX XXX
 */
export function formatAngolanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  let localNine = digits;
  if (digits.startsWith('244') && digits.length === 12) {
    localNine = digits.slice(3);
  }
  if (localNine.length === 9) {
    return `+244 ${localNine.slice(0, 3)} ${localNine.slice(3, 6)} ${localNine.slice(6)}`;
  }
  return phone;
}

/**
 * Formats a monetary integer value into Kwanza string: "1.500 Kz"
 */
export function formatKwanza(amountAOA: number): string {
  const rounded = Math.floor(amountAOA || 0);
  return `${new Intl.NumberFormat('pt-AO').format(rounded)} Kz`;
}

/**
 * Converts points to Kwanza using integer calculation.
 * Formula: points / pointsToKwanzaRatio
 */
export function convertPointsToKwanza(
  points: number,
  pointsToKwanzaRatio: number = DEFAULT_SETTINGS.pointsToKwanzaRatio
): number {
  if (points <= 0 || pointsToKwanzaRatio <= 0) return 0;
  return Math.floor(points / pointsToKwanzaRatio);
}

/**
 * Calculates net withdrawal amount and fee based on integer values.
 */
export function calculateWithdrawal(
  amountAOA: number,
  feePercent: number = DEFAULT_SETTINGS.withdrawalFeePercent
): { feeAOA: number; netAmountAOA: number } {
  const safeAmount = Math.max(0, Math.floor(amountAOA));
  const feeAOA = Math.floor((safeAmount * feePercent) / 100);
  const netAmountAOA = safeAmount - feeAOA;
  return { feeAOA, netAmountAOA };
}

/**
 * Checks if a withdrawal request is valid according to business rules.
 */
export function validateWithdrawalRequest(params: {
  amountAOA: number;
  availableBalanceAOA: number;
  minWithdrawalAOA?: number;
  accountHolderName: string;
  mcxPhoneNumber: string;
}): { valid: boolean; error?: string } {
  const min = params.minWithdrawalAOA ?? DEFAULT_SETTINGS.minWithdrawalAOA;

  if (!params.accountHolderName || params.accountHolderName.trim().length < 3) {
    return { valid: false, error: 'O nome do titular deve ter pelo menos 3 caracteres.' };
  }

  if (!isValidAngolanPhone(params.mcxPhoneNumber)) {
    return {
      valid: false,
      error: 'Número Multicaixa Express inválido. Insira um número angolano válido (ex: 923 000 000).',
    };
  }

  if (params.amountAOA < min) {
    return {
      valid: false,
      error: `O valor mínimo para levantamento é de ${formatKwanza(min)}.`,
    };
  }

  if (params.amountAOA > params.availableBalanceAOA) {
    return {
      valid: false,
      error: `Saldo disponível insuficiente (${formatKwanza(params.availableBalanceAOA)}).`,
    };
  }

  return { valid: true };
}

/**
 * State Transition: Reserve balance for withdrawal.
 * Decreases available balance, increases pending balance.
 */
export function reserveWithdrawalBalance(
  wallet: Wallet,
  amountAOA: number,
  referenceCode: string
): { updatedWallet: Wallet; transaction: WalletTransaction } {
  if (amountAOA > wallet.balanceAOA) {
    throw new Error('Saldo insuficiente para reserva de levantamento.');
  }

  const updatedWallet: Wallet = {
    ...wallet,
    balanceAOA: wallet.balanceAOA - amountAOA,
    pendingBalanceAOA: wallet.pendingBalanceAOA + amountAOA,
    updatedAt: new Date().toISOString(),
  };

  const transaction: WalletTransaction = {
    id: `tx_res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    walletId: wallet.id,
    userId: wallet.userId,
    type: 'withdrawal_reserve',
    amountAOA: -amountAOA,
    status: 'pending',
    referenceCode,
    description: `Reserva para levantamento Multicaixa Express #${referenceCode}`,
    createdAt: new Date().toISOString(),
  };

  return { updatedWallet, transaction };
}

/**
 * State Transition: Approve & Pay withdrawal.
 * Clears pending balance and increments totalWithdrawn.
 */
export function settleWithdrawal(
  wallet: Wallet,
  amountAOA: number,
  referenceCode: string
): { updatedWallet: Wallet; transaction: WalletTransaction } {
  const updatedWallet: Wallet = {
    ...wallet,
    pendingBalanceAOA: Math.max(0, wallet.pendingBalanceAOA - amountAOA),
    totalWithdrawnAOA: wallet.totalWithdrawnAOA + amountAOA,
    updatedAt: new Date().toISOString(),
  };

  const transaction: WalletTransaction = {
    id: `tx_set_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    walletId: wallet.id,
    userId: wallet.userId,
    type: 'withdrawal_settle',
    amountAOA: -amountAOA,
    status: 'completed',
    referenceCode,
    description: `Pagamento Multicaixa Express confirmado #${referenceCode}`,
    createdAt: new Date().toISOString(),
  };

  return { updatedWallet, transaction };
}

/**
 * State Transition: Reject or cancel withdrawal.
 * Releases reserved pending balance back to available balance.
 */
export function refundWithdrawal(
  wallet: Wallet,
  amountAOA: number,
  referenceCode: string,
  reason: string
): { updatedWallet: Wallet; transaction: WalletTransaction } {
  const updatedWallet: Wallet = {
    ...wallet,
    pendingBalanceAOA: Math.max(0, wallet.pendingBalanceAOA - amountAOA),
    balanceAOA: wallet.balanceAOA + amountAOA,
    updatedAt: new Date().toISOString(),
  };

  const transaction: WalletTransaction = {
    id: `tx_ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    walletId: wallet.id,
    userId: wallet.userId,
    type: 'withdrawal_refund',
    amountAOA: amountAOA,
    status: 'completed',
    referenceCode,
    description: `Estorno de levantamento #${referenceCode}: ${reason}`,
    createdAt: new Date().toISOString(),
  };

  return { updatedWallet, transaction };
}

/**
 * State Transition: Credit reward to wallet.
 * Increases balance, points, and totalEarned.
 */
export function creditReward(
  wallet: Wallet,
  params: {
    rewardPoints: number;
    rewardAOA: number;
    sourceType: 'task' | 'video' | 'music' | 'share' | 'campaign' | 'daily' | 'referral';
    referenceTitle: string;
  }
): { updatedWallet: Wallet; transaction: WalletTransaction } {
  const updatedWallet: Wallet = {
    ...wallet,
    balanceAOA: wallet.balanceAOA + params.rewardAOA,
    points: wallet.points + params.rewardPoints,
    totalEarnedAOA: wallet.totalEarnedAOA + params.rewardAOA,
    updatedAt: new Date().toISOString(),
  };

  const referenceCode = `REW_${Date.now().toString(36).toUpperCase()}`;

  const transaction: WalletTransaction = {
    id: `tx_rew_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    walletId: wallet.id,
    userId: wallet.userId,
    type: params.sourceType === 'referral' ? 'referral' : 'reward',
    amountAOA: params.rewardAOA,
    points: params.rewardPoints,
    status: 'completed',
    referenceCode,
    description: `Recompensa: ${params.referenceTitle}`,
    metadata: { sourceType: params.sourceType },
    createdAt: new Date().toISOString(),
  };

  return { updatedWallet, transaction };
}

/**
 * Validate that user completed the minimum duration for video/music.
 */
export function validateMediaDuration(
  durationWatched: number,
  minRequiredDuration: number
): boolean {
  return durationWatched >= minRequiredDuration;
}

/**
 * Generate unique Angolan Multicaixa Express reference code
 */
export function generateReferenceCode(prefix: string = 'MCX'): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${randomPart}`;
}
