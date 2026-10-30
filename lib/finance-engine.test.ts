import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidAngolanPhone,
  formatAngolanPhone,
  convertPointsToKwanza,
  calculateWithdrawal,
  validateWithdrawalRequest,
  reserveWithdrawalBalance,
  settleWithdrawal,
  refundWithdrawal,
  creditReward,
  validateMediaDuration,
  formatKwanza,
} from './finance-engine';
import { Wallet } from './types';

const mockWallet: Wallet = {
  id: 'wallet-001',
  userId: 'user-001',
  balanceAOA: 5000,
  pendingBalanceAOA: 0,
  points: 1200,
  totalEarnedAOA: 15000,
  totalWithdrawnAOA: 10000,
  totalBonusAOA: 500,
  updatedAt: new Date().toISOString(),
};

test('Angolan phone number validation', () => {
  assert.equal(isValidAngolanPhone('923456789'), true);
  assert.equal(isValidAngolanPhone('+244 923 456 789'), true);
  assert.equal(isValidAngolanPhone('244912345678'), true);
  assert.equal(isValidAngolanPhone('998000111'), true);

  // Invalid numbers
  assert.equal(isValidAngolanPhone('123456789'), false); // Doesn't start with 9
  assert.equal(isValidAngolanPhone('92345678'), false); // Too short
  assert.equal(isValidAngolanPhone(''), false);
  assert.equal(isValidAngolanPhone('+15551234567'), false);
});

test('Format Angolan phone number', () => {
  assert.equal(formatAngolanPhone('923456789'), '+244 923 456 789');
  assert.equal(formatAngolanPhone('244923456789'), '+244 923 456 789');
});

test('Points to Kwanza conversion', () => {
  // 100 points = 10 Kz (ratio = 10)
  assert.equal(convertPointsToKwanza(100, 10), 10);
  assert.equal(convertPointsToKwanza(150, 10), 15);
  assert.equal(convertPointsToKwanza(0, 10), 0);
  assert.equal(convertPointsToKwanza(95, 10), 9); // Integer truncation
});

test('Withdrawal calculations and fee structure', () => {
  const result0 = calculateWithdrawal(2000, 0);
  assert.equal(result0.feeAOA, 0);
  assert.equal(result0.netAmountAOA, 2000);

  const result1 = calculateWithdrawal(2000, 2); // 2% fee
  assert.equal(result1.feeAOA, 40);
  assert.equal(result1.netAmountAOA, 1960);
});

test('Withdrawal request validation rules', () => {
  // Valid request
  const validCheck = validateWithdrawalRequest({
    amountAOA: 2000,
    availableBalanceAOA: 5000,
    minWithdrawalAOA: 1000,
    accountHolderName: 'Manuel Domingos',
    mcxPhoneNumber: '923456789',
  });
  assert.equal(validCheck.valid, true);

  // Below minimum
  const belowMinCheck = validateWithdrawalRequest({
    amountAOA: 500,
    availableBalanceAOA: 5000,
    minWithdrawalAOA: 1000,
    accountHolderName: 'Manuel Domingos',
    mcxPhoneNumber: '923456789',
  });
  assert.equal(belowMinCheck.valid, false);

  // Insufficient balance
  const overCheck = validateWithdrawalRequest({
    amountAOA: 6000,
    availableBalanceAOA: 5000,
    minWithdrawalAOA: 1000,
    accountHolderName: 'Manuel Domingos',
    mcxPhoneNumber: '923456789',
  });
  assert.equal(overCheck.valid, false);

  // Invalid phone
  const badPhoneCheck = validateWithdrawalRequest({
    amountAOA: 2000,
    availableBalanceAOA: 5000,
    minWithdrawalAOA: 1000,
    accountHolderName: 'Manuel Domingos',
    mcxPhoneNumber: '123456',
  });
  assert.equal(badPhoneCheck.valid, false);
});

test('Atomic balance reservation for withdrawal', () => {
  const { updatedWallet, transaction } = reserveWithdrawalBalance(
    mockWallet,
    2000,
    'MCX-TEST-001'
  );

  assert.equal(updatedWallet.balanceAOA, 3000);
  assert.equal(updatedWallet.pendingBalanceAOA, 2000);
  assert.equal(transaction.type, 'withdrawal_reserve');
  assert.equal(transaction.amountAOA, -2000);
  assert.equal(transaction.status, 'pending');

  // Throws on insufficient balance
  assert.throws(() => {
    reserveWithdrawalBalance(mockWallet, 10000, 'MCX-FAIL');
  });
});

test('Settlement and refund operations', () => {
  // First reserve
  const { updatedWallet: reservedWallet } = reserveWithdrawalBalance(
    mockWallet,
    2000,
    'MCX-TEST-002'
  );

  // Settlement (Admin approves payment)
  const { updatedWallet: paidWallet, transaction: settleTx } = settleWithdrawal(
    reservedWallet,
    2000,
    'MCX-TEST-002'
  );
  assert.equal(paidWallet.balanceAOA, 3000);
  assert.equal(paidWallet.pendingBalanceAOA, 0);
  assert.equal(paidWallet.totalWithdrawnAOA, 12000); // 10000 + 2000
  assert.equal(settleTx.type, 'withdrawal_settle');

  // Refund (Admin rejects or cancels)
  const { updatedWallet: refundedWallet, transaction: refundTx } = refundWithdrawal(
    reservedWallet,
    2000,
    'MCX-TEST-002',
    'Telefone divergente'
  );
  assert.equal(refundedWallet.balanceAOA, 5000); // Returned to balance
  assert.equal(refundedWallet.pendingBalanceAOA, 0);
  assert.equal(refundTx.type, 'withdrawal_refund');
  assert.equal(refundTx.amountAOA, 2000);
});

test('Reward crediting increases balance and points', () => {
  const { updatedWallet, transaction } = creditReward(mockWallet, {
    rewardPoints: 100,
    rewardAOA: 10,
    sourceType: 'video',
    referenceTitle: 'Vídeo: Novidades FinTech Angola',
  });

  assert.equal(updatedWallet.balanceAOA, 5010);
  assert.equal(updatedWallet.points, 1300);
  assert.equal(updatedWallet.totalEarnedAOA, 15010);
  assert.equal(transaction.type, 'reward');
});

test('Media duration verification', () => {
  assert.equal(validateMediaDuration(30, 30), true);
  assert.equal(validateMediaDuration(45, 30), true);
  assert.equal(validateMediaDuration(29, 30), false);
});

test('Kwanza currency formatting', () => {
  const formatted = formatKwanza(1500);
  assert.ok(formatted.includes('Kz'));
  assert.ok(formatted.includes('1'));
});
