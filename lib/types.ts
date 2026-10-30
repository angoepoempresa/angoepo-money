// Angoepo Rewards - Type Definitions
// Platform tailored for Angola (AOA Currency, Multicaixa Express, Strict Ledger)

export type UserRole = 'user' | 'admin' | 'finance' | 'support' | 'super_admin';

export interface Profile {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string; // Angola +244 format
  email: string;
  avatarUrl: string;
  age: number; // Must be >= 18
  status: 'active' | 'suspended' | 'pending_verification';
  invitationCode: string;
  invitedBy?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balanceAOA: number; // Integer (in Kwanza)
  pendingBalanceAOA: number; // Reserved or pending tasks
  points: number; // Rewarded points convertible to Kwanza
  totalEarnedAOA: number;
  totalWithdrawnAOA: number;
  totalBonusAOA: number;
  updatedAt: string;
}

export type TransactionType =
  | 'reward'
  | 'bonus'
  | 'referral'
  | 'withdrawal_reserve'
  | 'withdrawal_settle'
  | 'withdrawal_refund'
  | 'points_conversion';

export type TransactionStatus = 'pending' | 'completed' | 'rejected';

export interface WalletTransaction {
  id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amountAOA: number; // Positive or negative integer
  points?: number;
  status: TransactionStatus;
  referenceCode: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type TaskCategory = 'video' | 'music' | 'share' | 'daily' | 'campaign';

export interface RewardTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  rewardPoints: number;
  rewardAOA: number; // In Kz
  minDurationSeconds: number; // Time user must stay / listen / watch
  dailyLimit: number;
  active: boolean;
  budgetAOA: number;
  totalCompletions: number;
  maxParticipants?: number;
  instructions: string[];
  actionUrl?: string;
  thumbnailUrl?: string;
  sponsorName?: string;
  createdAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  rewardPoints: number;
  rewardAOA: number;
  durationWatchedSeconds: number;
  status: 'completed' | 'pending' | 'rejected';
  verifiedAt: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface VideoItem {
  id: string;
  title: string;
  channelName: string;
  videoUrl: string;
  durationSeconds: number;
  minWatchSeconds: number;
  rewardPoints: number;
  rewardAOA: number;
  category: string;
  thumbnailUrl: string;
  viewsCount: number;
  active: boolean;
  createdAt: string;
}

export interface MusicTrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string; // e.g. Semba, Kizomba, Kuduro, Afro House, R&B
  durationSeconds: number;
  minListenSeconds: number;
  rewardPoints: number;
  rewardAOA: number;
  coverArtUrl: string;
  audioPreviewUrl: string; // Audio simulation/stream
  playsCount: number;
  licenseDetails: string;
  active: boolean;
  createdAt: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  sponsorName: string;
  sponsorLogoUrl: string;
  description: string;
  totalBudgetAOA: number;
  remainingBudgetAOA: number;
  rewardPerUserAOA: number;
  maxParticipants: number;
  currentParticipants: number;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface ReferralItem {
  id: string;
  referrerId: string;
  refereeId: string;
  refereeName: string;
  refereeEmail: string;
  codeUsed: string;
  rewardAOA: number;
  status: 'pending' | 'qualified' | 'rewarded';
  qualifiedAt?: string;
  createdAt: string;
}

export type WithdrawalStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountAOA: number; // Gross amount requested in Kz
  feeAOA: number; // Platform or banking fee
  netAmountAOA: number; // What user receives on Multicaixa Express
  accountHolderName: string;
  mcxPhoneNumber: string; // 9XX XXX XXX
  paymentMethod: 'MULTICAIXA_EXPRESS';
  status: WithdrawalStatus;
  referenceCode: string;
  idempotencyKey: string;
  adminNotes?: string;
  rejectionReason?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'withdrawal' | 'referral' | 'system' | 'campaign';
  read: boolean;
  actionLink?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'withdrawal' | 'reward' | 'account' | 'technical' | 'other';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'answered' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'support' | 'admin';
  message: string;
  createdAt: string;
}

export interface SystemSettings {
  pointsToKwanzaRatio: number; // e.g., 100 points = 10 Kz -> 10 points = 1 Kz
  minWithdrawalAOA: number; // e.g. 1000 Kz
  withdrawalFeePercent: number; // e.g. 0% or 1%
  referralBonusAOA: number; // e.g. 250 Kz upon first 3 tasks
  dailyLoginRewardPoints: number; // e.g. 50 points
  maintenanceMode: boolean;
  requirePhoneOtpVerification: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}
