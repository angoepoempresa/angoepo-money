// In-Memory & LocalStorage Synchronized Repository for Angoepo Rewards
// Provides seamless offline-first execution, deterministic demo data,
// and ready connectivity to Supabase client when configured.

import {
  Profile,
  Wallet,
  WalletTransaction,
  RewardTask,
  TaskCompletion,
  VideoItem,
  MusicTrackItem,
  CampaignItem,
  ReferralItem,
  WithdrawalRequest,
  NotificationItem,
  SupportTicket,
  SupportMessage,
  SystemSettings,
  AdminAuditLog,
  UserRole,
} from './types';
import {
  DEFAULT_SETTINGS,
  reserveWithdrawalBalance,
  settleWithdrawal,
  refundWithdrawal,
  creditReward,
  generateReferenceCode,
  convertPointsToKwanza,
} from './finance-engine';

// --- SEED DATA (Angola Contextualized) ---

export const INITIAL_USER: Profile = {
  id: 'usr_manuel_001',
  fullName: 'Manuel Domingos Pedro',
  username: 'manuel_angola',
  phoneNumber: '+244 923 884 102',
  email: 'manuel.pedro@angoepo.ao',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 26,
  status: 'active',
  invitationCode: 'ANGO-PEDRO24',
  role: 'user',
  createdAt: '2026-08-15T10:00:00Z',
  updatedAt: '2026-10-30T09:00:00Z',
};

export const INITIAL_ADMIN: Profile = {
  id: 'usr_admin_master',
  fullName: 'Dra. Luísa Gaspar (Super Admin)',
  username: 'luisa_angoepo_admin',
  phoneNumber: '+244 944 550 001',
  email: 'admin@angoepo.ao',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  age: 34,
  status: 'active',
  invitationCode: 'ANGO-DIRECT',
  role: 'super_admin',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-10-30T09:00:00Z',
};

export const INITIAL_WALLET: Wallet = {
  id: 'wal_manuel_001',
  userId: 'usr_manuel_001',
  balanceAOA: 4250, // 4.250 Kz available
  pendingBalanceAOA: 1500, // 1.500 Kz in pending withdrawal
  points: 1250, // 1.250 points
  totalEarnedAOA: 18750,
  totalWithdrawnAOA: 13000,
  totalBonusAOA: 1500,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid_001',
    title: 'Inovação e Tecnologia em Angola: O Futuro dos Pagamentos Digitais',
    channelName: 'Angola Inovação TV',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationSeconds: 90,
    minWatchSeconds: 30,
    rewardPoints: 100,
    rewardAOA: 10,
    category: 'Finanças & Tecnologia',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    viewsCount: 3420,
    active: true,
    createdAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'vid_002',
    title: 'Guia Prático: Como Poupar e Investir em Kwanza em 2026',
    channelName: 'Economia AO',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationSeconds: 120,
    minWatchSeconds: 40,
    rewardPoints: 150,
    rewardAOA: 15,
    category: 'Educação Financeira',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    viewsCount: 5120,
    active: true,
    createdAt: '2026-10-15T14:30:00Z',
  },
  {
    id: 'vid_003',
    title: 'Turismo em Angola: As Maravilhas das Quedas de Kalandula',
    channelName: 'Descubra Angola',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationSeconds: 60,
    minWatchSeconds: 25,
    rewardPoints: 80,
    rewardAOA: 8,
    category: 'Cultura & Turismo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    viewsCount: 8940,
    active: true,
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'vid_004',
    title: 'Empreendedorismo Jovem em Luanda: Histórias de Sucesso',
    channelName: 'Angola Startups',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationSeconds: 110,
    minWatchSeconds: 35,
    rewardPoints: 120,
    rewardAOA: 12,
    category: 'Negócios',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    viewsCount: 2450,
    active: true,
    createdAt: '2026-10-25T11:00:00Z',
  },
];

export const INITIAL_MUSIC: MusicTrackItem[] = [
  {
    id: 'mus_001',
    title: 'Luanda Minha Terra Encantada',
    artist: 'António & Os Astros',
    album: 'Raízes de Semba 2026',
    genre: 'Semba',
    durationSeconds: 180,
    minListenSeconds: 30,
    rewardPoints: 70,
    rewardAOA: 7,
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
    playsCount: 14200,
    licenseDetails: 'Licença oficial concedida para streaming remunerado Angoepo Records AO-2026',
    active: true,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'mus_002',
    title: 'Kizomba Doce Sentimento',
    artist: 'Sara Carvalho feat. Djeff',
    album: 'Noites Tropicais',
    genre: 'Kizomba',
    durationSeconds: 210,
    minListenSeconds: 35,
    rewardPoints: 80,
    rewardAOA: 8,
    coverArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3',
    playsCount: 22800,
    licenseDetails: 'Direitos autorais pagos via Sociedade Angolana de Autores (SADIA)',
    active: true,
    createdAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'mus_003',
    title: 'Kuduro do Povo',
    artist: 'Os Tigres do Sambizanga',
    album: 'Batida de Rua',
    genre: 'Kuduro',
    durationSeconds: 150,
    minListenSeconds: 25,
    rewardPoints: 60,
    rewardAOA: 6,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
    playsCount: 31000,
    licenseDetails: 'Acordo de distribuição digital exclusiva para Angola',
    active: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'mus_004',
    title: 'Alma de Benguela (Afro House Mix)',
    artist: 'DJ Paulo Kanza',
    album: 'Baía Farta Sessions',
    genre: 'Afro House',
    durationSeconds: 240,
    minListenSeconds: 40,
    rewardPoints: 90,
    rewardAOA: 9,
    coverArtUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80',
    audioPreviewUrl: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3',
    playsCount: 19500,
    licenseDetails: 'Licença promocional remunerada para utilizadores Angoepo',
    active: true,
    createdAt: '2026-10-10T00:00:00Z',
  },
];

export const INITIAL_TASKS: RewardTask[] = [
  {
    id: 'tsk_001',
    title: 'Acesso Diário Consecutivo',
    description: 'Faça login hoje e reclame a sua bonificação diária de fidelidade.',
    category: 'daily',
    rewardPoints: 50,
    rewardAOA: 5,
    minDurationSeconds: 5,
    dailyLimit: 1,
    active: true,
    budgetAOA: 500000,
    totalCompletions: 4890,
    instructions: [
      'Visite o painel Angoepo Rewards uma vez por dia',
      'Clique em Reclamar Bónus Diário',
      'Os pontos entram imediatamente na sua carteira',
    ],
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'tsk_002',
    title: 'Partilha no WhatsApp: Conheça a Angoepo',
    description: 'Partilhe a plataforma oficial com o seu grupo ou estado do WhatsApp com o seu link exclusivo.',
    category: 'share',
    rewardPoints: 200,
    rewardAOA: 20,
    minDurationSeconds: 15,
    dailyLimit: 2,
    active: true,
    budgetAOA: 300000,
    totalCompletions: 1940,
    instructions: [
      'Gere o seu link oficial de partilha',
      'Abra o WhatsApp e publique no seu estado ou envie a amigos',
      'Confirme a partilha e aguarde a validação de segurança',
    ],
    actionUrl: 'https://angoepo.ao/rewards',
    createdAt: '2026-10-05T00:00:00Z',
  },
  {
    id: 'tsk_003',
    title: 'Questionário de Satisfação sobre Serviços Móveis',
    description: 'Responda a 4 perguntas rápidas sobre a qualidade de rede e internet no seu município.',
    category: 'campaign',
    rewardPoints: 350,
    rewardAOA: 35,
    minDurationSeconds: 60,
    dailyLimit: 1,
    active: true,
    budgetAOA: 200000,
    totalCompletions: 890,
    sponsorName: 'Observatório Telecom AO',
    instructions: [
      'Abra o questionário autorizado',
      'Indique a sua província e operadora principal',
      'Conclua para receber a recompensa aprovada',
    ],
    createdAt: '2026-10-18T00:00:00Z',
  },
  {
    id: 'tsk_004',
    title: 'Siga a Página Oficial no Facebook',
    description: 'Acompanhe as novidades e campanhas oficiais da Angoepo nas redes sociais.',
    category: 'share',
    rewardPoints: 150,
    rewardAOA: 15,
    minDurationSeconds: 20,
    dailyLimit: 1,
    active: true,
    budgetAOA: 150000,
    totalCompletions: 3410,
    instructions: [
      'Acesse a página oficial da Angoepo',
      'Curta a página para receber avisos de novas campanhas patrocinadas',
      'Valide a participação para desbloquear o saldo',
    ],
    actionUrl: 'https://facebook.com/angoepo',
    createdAt: '2026-10-22T00:00:00Z',
  },
];

export const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'cmp_001',
    title: 'Campanha FinTech Angola 2026: Pagamentos Seguros',
    sponsorName: 'Consórcio de Serviços Digitais AO',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    description: 'Conheça as novas vantagens de transferências instantâneas e receba 50 Kz ao interagir com o conteúdo educativo.',
    totalBudgetAOA: 500000,
    remainingBudgetAOA: 385000,
    rewardPerUserAOA: 50,
    maxParticipants: 10000,
    currentParticipants: 2300,
    bannerUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-30T23:59:59Z',
    active: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'cmp_002',
    title: 'Campanha Voz & Dados: Conectando Angola',
    sponsorName: 'Telecomunicações de Angola',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    description: 'Campanha de sensibilização digital sobre consumo sustentável de dados e recargas inteligentes.',
    totalBudgetAOA: 800000,
    remainingBudgetAOA: 620000,
    rewardPerUserAOA: 40,
    maxParticipants: 20000,
    currentParticipants: 4500,
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-10-10T00:00:00Z',
    endDate: '2026-12-15T23:59:59Z',
    active: true,
    createdAt: '2026-10-10T00:00:00Z',
  },
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_init_001',
    walletId: 'wal_manuel_001',
    userId: 'usr_manuel_001',
    type: 'reward',
    amountAOA: 10,
    points: 100,
    status: 'completed',
    referenceCode: 'REW-20261028-A4B92C',
    description: 'Vídeo: Inovação e Tecnologia em Angola',
    createdAt: '2026-10-28T14:32:00Z',
  },
  {
    id: 'tx_init_002',
    walletId: 'wal_manuel_001',
    userId: 'usr_manuel_001',
    type: 'reward',
    amountAOA: 7,
    points: 70,
    status: 'completed',
    referenceCode: 'REW-20261028-98FC31',
    description: 'Música: Luanda Minha Terra Encantada',
    createdAt: '2026-10-28T16:15:00Z',
  },
  {
    id: 'tx_init_003',
    walletId: 'wal_manuel_001',
    userId: 'usr_manuel_001',
    type: 'bonus',
    amountAOA: 250,
    points: 0,
    status: 'completed',
    referenceCode: 'BONUS-REF-7712',
    description: 'Bónus de indicação: Amigo Paulo Silva atingiu 3 tarefas',
    createdAt: '2026-10-29T11:20:00Z',
  },
  {
    id: 'tx_init_004',
    walletId: 'wal_manuel_001',
    userId: 'usr_manuel_001',
    type: 'withdrawal_settle',
    amountAOA: -5000,
    points: 0,
    status: 'completed',
    referenceCode: 'MCX-20261020-8841',
    description: 'Pagamento Multicaixa Express recebido #MCX-20261020-8841',
    createdAt: '2026-10-20T18:00:00Z',
  },
  {
    id: 'tx_init_005',
    walletId: 'wal_manuel_001',
    userId: 'usr_manuel_001',
    type: 'withdrawal_reserve',
    amountAOA: -1500,
    points: 0,
    status: 'pending',
    referenceCode: 'MCX-20261029-4102',
    description: 'Reserva para levantamento Multicaixa Express #MCX-20261029-4102',
    createdAt: '2026-10-29T19:40:00Z',
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wdr_001',
    userId: 'usr_manuel_001',
    amountAOA: 5000,
    feeAOA: 0,
    netAmountAOA: 5000,
    accountHolderName: 'Manuel Domingos Pedro',
    mcxPhoneNumber: '+244 923 884 102',
    paymentMethod: 'MULTICAIXA_EXPRESS',
    status: 'paid',
    referenceCode: 'MCX-20261020-8841',
    idempotencyKey: 'idem_wdr_001_paid',
    adminNotes: 'Processado via Multicaixa Express com sucesso. Comprovativo EMIS #994821',
    receiptUrl: 'https://example.com/receipt-001.pdf',
    createdAt: '2026-10-20T17:15:00Z',
    updatedAt: '2026-10-20T18:00:00Z',
  },
  {
    id: 'wdr_002',
    userId: 'usr_manuel_001',
    amountAOA: 1500,
    feeAOA: 0,
    netAmountAOA: 1500,
    accountHolderName: 'Manuel Domingos Pedro',
    mcxPhoneNumber: '+244 923 884 102',
    paymentMethod: 'MULTICAIXA_EXPRESS',
    status: 'pending',
    referenceCode: 'MCX-20261029-4102',
    idempotencyKey: 'idem_wdr_002_pend',
    adminNotes: 'Aguardando validação do operador financeiro.',
    createdAt: '2026-10-29T19:40:00Z',
    updatedAt: '2026-10-29T19:40:00Z',
  },
  {
    id: 'wdr_003',
    userId: 'usr_paulo_002',
    amountAOA: 2500,
    feeAOA: 0,
    netAmountAOA: 2500,
    accountHolderName: 'Paulo Silva Ndongala',
    mcxPhoneNumber: '+244 931 229 004',
    paymentMethod: 'MULTICAIXA_EXPRESS',
    status: 'reviewing',
    referenceCode: 'MCX-20261029-9932',
    idempotencyKey: 'idem_wdr_003_rev',
    adminNotes: 'Verificação antifraude de IP em conformidade.',
    createdAt: '2026-10-29T21:10:00Z',
    updatedAt: '2026-10-30T07:20:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    userId: 'usr_manuel_001',
    title: 'Bem-vindo ao Angoepo Rewards!',
    message: 'A sua conta foi registada com sucesso. Comece por assistir aos vídeos da secção Ganhar.',
    type: 'system',
    read: true,
    actionLink: '/ganhar',
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'notif_002',
    userId: 'usr_manuel_001',
    title: 'Levantamento de 5.000 Kz Pago',
    message: 'O seu levantamento via Multicaixa Express #MCX-20261020-8841 foi enviado com sucesso.',
    type: 'withdrawal',
    read: true,
    actionLink: '/levantamentos',
    createdAt: '2026-10-20T18:05:00Z',
  },
  {
    id: 'notif_003',
    userId: 'usr_manuel_001',
    title: 'Bónus de Convidado Atribuído!',
    message: 'O seu convidado Paulo Silva concluiu 3 actividades e você recebeu 250 Kz.',
    type: 'referral',
    read: false,
    actionLink: '/convites',
    createdAt: '2026-10-29T11:21:00Z',
  },
  {
    id: 'notif_004',
    userId: 'usr_manuel_001',
    title: 'Pedido de Levantamento em Análise',
    message: 'O seu pedido de 1.500 Kz foi registado e está a ser verificado pela equipa financeira.',
    type: 'withdrawal',
    read: false,
    actionLink: '/levantamentos',
    createdAt: '2026-10-29T19:40:00Z',
  },
];

export const INITIAL_REFERRALS: ReferralItem[] = [
  {
    id: 'ref_001',
    referrerId: 'usr_manuel_001',
    refereeId: 'usr_paulo_002',
    refereeName: 'Paulo Silva Ndongala',
    refereeEmail: 'paulo.ndongala@gmail.com',
    codeUsed: 'ANGO-PEDRO24',
    rewardAOA: 250,
    status: 'rewarded',
    qualifiedAt: '2026-10-29T11:20:00Z',
    createdAt: '2026-10-18T15:00:00Z',
  },
  {
    id: 'ref_002',
    referrerId: 'usr_manuel_001',
    refereeId: 'usr_ines_003',
    refereeName: 'Inês Kutala',
    refereeEmail: 'ines.kutala@gmail.com',
    codeUsed: 'ANGO-PEDRO24',
    rewardAOA: 250,
    status: 'pending',
    createdAt: '2026-10-28T09:30:00Z',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_001',
    userId: 'usr_manuel_001',
    userName: 'Manuel Domingos Pedro',
    userEmail: 'manuel.pedro@angoepo.ao',
    subject: 'Dúvida sobre horário de processamento Multicaixa Express',
    category: 'withdrawal',
    priority: 'normal',
    status: 'answered',
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T11:15:00Z',
  },
];

export const INITIAL_TICKET_MESSAGES: SupportMessage[] = [
  {
    id: 'msg_001',
    ticketId: 'tkt_001',
    senderId: 'usr_manuel_001',
    senderName: 'Manuel Domingos Pedro',
    senderRole: 'user',
    message: 'Olá suporte Angoepo! Gostaria de saber quanto tempo demora normalmente um levantamento via Multicaixa Express após aprovação.',
    createdAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'msg_002',
    ticketId: 'tkt_001',
    senderId: 'usr_admin_master',
    senderName: 'Suporte Oficial Angoepo',
    senderRole: 'support',
    message: 'Olá Sr. Manuel! O processamento ocorre em dias úteis das 08h às 18h. Uma vez aprovado pelo departamento financeiro, o saldo entra habitualmente em menos de 15 minutos na sua conta Multicaixa Express.',
    createdAt: '2026-10-29T11:15:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_001',
    adminId: 'usr_admin_master',
    adminEmail: 'admin@angoepo.ao',
    action: 'APPROVE_WITHDRAWAL',
    entityType: 'WITHDRAWAL_REQUEST',
    entityId: 'wdr_001',
    details: 'Aprovado levantamento de 5.000 Kz para Manuel Domingos Pedro via Multicaixa Express.',
    createdAt: '2026-10-20T18:00:00Z',
  },
  {
    id: 'log_002',
    adminId: 'usr_admin_master',
    adminEmail: 'admin@angoepo.ao',
    action: 'UPDATE_SETTINGS',
    entityType: 'SYSTEM_SETTINGS',
    entityId: 'global',
    details: 'Configurado rácio de conversão de pontos: 10 pontos = 1 Kz.',
    createdAt: '2026-10-25T09:30:00Z',
  },
];

// --- STORAGE HELPER ---

const STORAGE_KEYS = {
  CURRENT_USER: 'angoepo_current_user',
  ALL_USERS: 'angoepo_all_users',
  WALLET: 'angoepo_wallet',
  TRANSACTIONS: 'angoepo_transactions',
  WITHDRAWALS: 'angoepo_withdrawals',
  TASKS: 'angoepo_tasks',
  VIDEOS: 'angoepo_videos',
  MUSIC: 'angoepo_music',
  CAMPAIGNS: 'angoepo_campaigns',
  COMPLETIONS: 'angoepo_completions',
  NOTIFICATIONS: 'angoepo_notifications',
  REFERRALS: 'angoepo_referrals',
  TICKETS: 'angoepo_tickets',
  TICKET_MESSAGES: 'angoepo_ticket_messages',
  SETTINGS: 'angoepo_settings',
  AUDIT_LOGS: 'angoepo_audit_logs',
};

// --- STORAGE HELPER (LocalStorage in Browser, MemoryStore in Node/SSR) ---

const memoryStore: Record<string, string> = {};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    }
    const mem = memoryStore[key];
    return mem ? JSON.parse(mem) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
    } else {
      memoryStore[key] = serialized;
    }
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

// Global Repository Interface
export class AngoepoRepository {
  private static instance: AngoepoRepository;

  public static getInstance(): AngoepoRepository {
    if (!AngoepoRepository.instance) {
      AngoepoRepository.instance = new AngoepoRepository();
    }
    return AngoepoRepository.instance;
  }

  // Current User Session
  getCurrentUser(): Profile {
    return getStorageItem<Profile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
  }

  setCurrentUser(user: Profile): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Switch between user roles (for comprehensive demo & audit)
  switchUserRole(role: UserRole): Profile {
    const current = this.getCurrentUser();
    let updated: Profile;
    if (role === 'super_admin' || role === 'admin' || role === 'finance' || role === 'support') {
      updated = {
        ...INITIAL_ADMIN,
        role,
      };
    } else {
      updated = {
        ...INITIAL_USER,
        role: 'user',
      };
    }
    this.setCurrentUser(updated);
    return updated;
  }

  // Wallet
  getWallet(): Wallet {
    return getStorageItem<Wallet>(STORAGE_KEYS.WALLET, INITIAL_WALLET);
  }

  setWallet(wallet: Wallet): void {
    setStorageItem(STORAGE_KEYS.WALLET, wallet);
  }

  // Transactions
  getTransactions(): WalletTransaction[] {
    return getStorageItem<WalletTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  addTransaction(tx: WalletTransaction): void {
    const list = this.getTransactions();
    setStorageItem(STORAGE_KEYS.TRANSACTIONS, [tx, ...list]);
  }

  // Withdrawals
  getWithdrawals(): WithdrawalRequest[] {
    return getStorageItem<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, INITIAL_WITHDRAWALS);
  }

  setWithdrawals(list: WithdrawalRequest[]): void {
    setStorageItem(STORAGE_KEYS.WITHDRAWALS, list);
  }

  // Tasks, Videos, Music, Campaigns
  getTasks(): RewardTask[] {
    return getStorageItem<RewardTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }

  getVideos(): VideoItem[] {
    return getStorageItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  }

  getMusic(): MusicTrackItem[] {
    return getStorageItem<MusicTrackItem[]>(STORAGE_KEYS.MUSIC, INITIAL_MUSIC);
  }

  getCampaigns(): CampaignItem[] {
    return getStorageItem<CampaignItem[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  }

  getCompletions(): TaskCompletion[] {
    return getStorageItem<TaskCompletion[]>(STORAGE_KEYS.COMPLETIONS, []);
  }

  getNotifications(): NotificationItem[] {
    return getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  setNotifications(items: NotificationItem[]): void {
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, items);
  }

  getReferrals(): ReferralItem[] {
    return getStorageItem<ReferralItem[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  }

  getTickets(): SupportTicket[] {
    return getStorageItem<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  }

  getTicketMessages(ticketId: string): SupportMessage[] {
    const all = getStorageItem<SupportMessage[]>(STORAGE_KEYS.TICKET_MESSAGES, INITIAL_TICKET_MESSAGES);
    return all.filter((m) => m.ticketId === ticketId);
  }

  getSettings(): SystemSettings {
    return getStorageItem<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  setSettings(settings: SystemSettings): void {
    setStorageItem(STORAGE_KEYS.SETTINGS, settings);
  }

  getAuditLogs(): AdminAuditLog[] {
    return getStorageItem<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(action: string, entityType: string, entityId: string, details: string): void {
    const user = this.getCurrentUser();
    const log: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      adminId: user.id,
      adminEmail: user.email,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    const list = this.getAuditLogs();
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, [log, ...list]);
  }

  // --- ACTIONS ---

  // Complete Media Task (Video or Music)
  completeMedia(type: 'video' | 'music', mediaId: string, durationSeconds: number): {
    rewardAOA: number;
    rewardPoints: number;
    message: string;
  } {
    const user = this.getCurrentUser();
    const wallet = this.getWallet();
    const completions = this.getCompletions();

    // Check duplicate today
    const alreadyCompleted = completions.some(
      (c) => c.taskId === mediaId && c.userId === user.id
    );

    if (alreadyCompleted) {
      throw new Error('Esta actividade já foi concluída hoje. Volte amanhã para novas recompensas!');
    }

    let title = '';
    let rewardPoints = 0;
    let rewardAOA = 0;
    let minSeconds = 0;

    if (type === 'video') {
      const vid = this.getVideos().find((v) => v.id === mediaId);
      if (!vid) throw new Error('Vídeo não encontrado.');
      title = vid.title;
      rewardPoints = vid.rewardPoints;
      rewardAOA = vid.rewardAOA;
      minSeconds = vid.minWatchSeconds;
    } else {
      const mus = this.getMusic().find((m) => m.id === mediaId);
      if (!mus) throw new Error('Música não encontrada.');
      title = `${mus.title} - ${mus.artist}`;
      rewardPoints = mus.rewardPoints;
      rewardAOA = mus.rewardAOA;
      minSeconds = mus.minListenSeconds;
    }

    if (durationSeconds < minSeconds) {
      throw new Error(`Duração mínima não atingida. É necessário assistir/ouvir pelo menos ${minSeconds} segundos.`);
    }

    // Atomic credit to wallet
    const { updatedWallet, transaction } = creditReward(wallet, {
      rewardPoints,
      rewardAOA,
      sourceType: type,
      referenceTitle: title,
    });

    this.setWallet(updatedWallet);
    this.addTransaction(transaction);

    // Save completion
    const newCompletion: TaskCompletion = {
      id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      taskId: mediaId,
      userId: user.id,
      rewardPoints,
      rewardAOA,
      durationWatchedSeconds: durationSeconds,
      status: 'completed',
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setStorageItem(STORAGE_KEYS.COMPLETIONS, [newCompletion, ...completions]);

    // Notification
    this.addNotification({
      userId: user.id,
      title: 'Recompensa Recebida!',
      message: `Ganhou ${rewardAOA} Kz e ${rewardPoints} pontos por concluir "${title}".`,
      type: 'reward',
      actionLink: '/carteira',
    });

    return {
      rewardAOA,
      rewardPoints,
      message: `Parabéns! Recebeu ${rewardAOA} Kz e ${rewardPoints} pontos na sua carteira.`,
    };
  }

  // Complete Generic Task / Share / Daily
  completeGenericTask(taskId: string): { rewardAOA: number; rewardPoints: number; message: string } {
    const user = this.getCurrentUser();
    const wallet = this.getWallet();
    const task = this.getTasks().find((t) => t.id === taskId);
    if (!task) throw new Error('Tarefa não encontrada.');

    const completions = this.getCompletions();
    const alreadyDone = completions.some((c) => c.taskId === taskId && c.userId === user.id);
    if (alreadyDone && task.category === 'daily') {
      throw new Error('Já reclamou esta recompensa diária hoje. Volte amanhã!');
    }

    const { updatedWallet, transaction } = creditReward(wallet, {
      rewardPoints: task.rewardPoints,
      rewardAOA: task.rewardAOA,
      sourceType: task.category === 'daily' ? 'daily' : 'task',
      referenceTitle: task.title,
    });

    this.setWallet(updatedWallet);
    this.addTransaction(transaction);

    const newCompletion: TaskCompletion = {
      id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      taskId: task.id,
      userId: user.id,
      rewardPoints: task.rewardPoints,
      rewardAOA: task.rewardAOA,
      durationWatchedSeconds: task.minDurationSeconds,
      status: 'completed',
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setStorageItem(STORAGE_KEYS.COMPLETIONS, [newCompletion, ...completions]);

    this.addNotification({
      userId: user.id,
      title: 'Actividade Concluída!',
      message: `Recebeu ${task.rewardAOA} Kz e ${task.rewardPoints} pontos por "${task.title}".`,
      type: 'reward',
      actionLink: '/carteira',
    });

    return {
      rewardAOA: task.rewardAOA,
      rewardPoints: task.rewardPoints,
      message: `Sucesso! Foram creditados ${task.rewardAOA} Kz na sua carteira.`,
    };
  }

  // Request Withdrawal via Multicaixa Express
  requestWithdrawal(amountAOA: number, accountHolder: string, mcxPhone: string): WithdrawalRequest {
    const user = this.getCurrentUser();
    const wallet = this.getWallet();
    const settings = this.getSettings();

    if (amountAOA < settings.minWithdrawalAOA) {
      throw new Error(`O montante mínimo para levantamento é de ${settings.minWithdrawalAOA} Kz.`);
    }

    if (amountAOA > wallet.balanceAOA) {
      throw new Error('Saldo disponível insuficiente para realizar o levantamento solicitado.');
    }

    const referenceCode = generateReferenceCode('MCX');
    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Atomic balance reservation
    const { updatedWallet, transaction } = reserveWithdrawalBalance(
      wallet,
      amountAOA,
      referenceCode
    );

    this.setWallet(updatedWallet);
    this.addTransaction(transaction);

    const newRequest: WithdrawalRequest = {
      id: `wdr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: user.id,
      amountAOA,
      feeAOA: 0,
      netAmountAOA: amountAOA,
      accountHolderName: accountHolder,
      mcxPhoneNumber: mcxPhone,
      paymentMethod: 'MULTICAIXA_EXPRESS',
      status: 'pending',
      referenceCode,
      idempotencyKey,
      adminNotes: 'Pedido registado. A verificar conformidade pelo departamento financeiro.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const withdrawals = this.getWithdrawals();
    this.setWithdrawals([newRequest, ...withdrawals]);

    this.addNotification({
      userId: user.id,
      title: 'Levantamento Registado',
      message: `O seu pedido de ${amountAOA} Kz (Ref: ${referenceCode}) via Multicaixa Express foi enviado com sucesso.`,
      type: 'withdrawal',
      actionLink: '/levantamentos',
    });

    return newRequest;
  }

  // Admin: Approve & Settle Withdrawal (Simulate Multicaixa Express Payout)
  adminApproveWithdrawal(withdrawalId: string, notes?: string): WithdrawalRequest {
    const withdrawals = this.getWithdrawals();
    const req = withdrawals.find((w) => w.id === withdrawalId);
    if (!req) throw new Error('Pedido de levantamento não encontrado.');
    if (req.status === 'paid') throw new Error('Este pedido já foi pago anteriormente.');

    const wallet = this.getWallet();
    const { updatedWallet, transaction } = settleWithdrawal(wallet, req.amountAOA, req.referenceCode);

    this.setWallet(updatedWallet);
    this.addTransaction(transaction);

    const updatedWithdrawals = withdrawals.map((w) => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: 'paid' as const,
          adminNotes: notes || 'Pagamento concluído com sucesso via Multicaixa Express (Simulação Autorizada).',
          receiptUrl: `https://angoepo.ao/comprovativo/${w.referenceCode}.pdf`,
          updatedAt: new Date().toISOString(),
        };
      }
      return w;
    });

    this.setWithdrawals(updatedWithdrawals);

    this.addAuditLog(
      'APPROVE_WITHDRAWAL',
      'WITHDRAWAL_REQUEST',
      req.id,
      `Aprovado levantamento de ${req.amountAOA} Kz para ${req.accountHolderName} (${req.mcxPhoneNumber}) Ref: ${req.referenceCode}`
    );

    this.addNotification({
      userId: req.userId,
      title: 'Levantamento Pago!',
      message: `O seu levantamento de ${req.amountAOA} Kz (Ref: ${req.referenceCode}) foi liquidado com sucesso na sua conta Multicaixa Express.`,
      type: 'withdrawal',
      actionLink: '/levantamentos',
    });

    return updatedWithdrawals.find((w) => w.id === withdrawalId)!;
  }

  // Admin: Reject Withdrawal with Refund
  adminRejectWithdrawal(withdrawalId: string, reason: string): WithdrawalRequest {
    const withdrawals = this.getWithdrawals();
    const req = withdrawals.find((w) => w.id === withdrawalId);
    if (!req) throw new Error('Pedido de levantamento não encontrado.');
    if (req.status === 'paid') throw new Error('Não é possível rejeitar um pedido que já foi pago.');

    const wallet = this.getWallet();
    const { updatedWallet, transaction } = refundWithdrawal(
      wallet,
      req.amountAOA,
      req.referenceCode,
      reason
    );

    this.setWallet(updatedWallet);
    this.addTransaction(transaction);

    const updatedWithdrawals = withdrawals.map((w) => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: 'rejected' as const,
          rejectionReason: reason,
          adminNotes: `Rejeitado: ${reason}`,
          updatedAt: new Date().toISOString(),
        };
      }
      return w;
    });

    this.setWithdrawals(updatedWithdrawals);

    this.addAuditLog(
      'REJECT_WITHDRAWAL',
      'WITHDRAWAL_REQUEST',
      req.id,
      `Rejeitado levantamento de ${req.amountAOA} Kz para ${req.accountHolderName}. Motivo: ${reason}`
    );

    this.addNotification({
      userId: req.userId,
      title: 'Levantamento Rejeitado',
      message: `O seu pedido de ${req.amountAOA} Kz (Ref: ${req.referenceCode}) foi recusado. O valor foi estornado para o seu saldo disponível. Motivo: ${reason}`,
      type: 'withdrawal',
      actionLink: '/levantamentos',
    });

    return updatedWithdrawals.find((w) => w.id === withdrawalId)!;
  }

  // Points conversion to Kwanza
  convertPoints(pointsToConvert: number): { kwanzaGained: number; remainingPoints: number } {
    const wallet = this.getWallet();
    const settings = this.getSettings();

    if (pointsToConvert <= 0) {
      throw new Error('Informe uma quantidade válida de pontos para converter.');
    }
    if (pointsToConvert > wallet.points) {
      throw new Error('Pontos insuficientes para realizar a conversão.');
    }

    const kwanzaGained = convertPointsToKwanza(pointsToConvert, settings.pointsToKwanzaRatio);
    if (kwanzaGained <= 0) {
      throw new Error(`São necessários pelo menos ${settings.pointsToKwanzaRatio} pontos para gerar 1 Kz.`);
    }

    const updatedWallet: Wallet = {
      ...wallet,
      points: wallet.points - pointsToConvert,
      balanceAOA: wallet.balanceAOA + kwanzaGained,
      totalEarnedAOA: wallet.totalEarnedAOA + kwanzaGained,
      updatedAt: new Date().toISOString(),
    };

    const tx: WalletTransaction = {
      id: `tx_conv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      walletId: wallet.id,
      userId: wallet.userId,
      type: 'points_conversion',
      amountAOA: kwanzaGained,
      points: -pointsToConvert,
      status: 'completed',
      referenceCode: generateReferenceCode('CONV'),
      description: `Conversão de ${pointsToConvert} pontos em ${kwanzaGained} Kz`,
      createdAt: new Date().toISOString(),
    };

    this.setWallet(updatedWallet);
    this.addTransaction(tx);

    this.addNotification({
      userId: wallet.userId,
      title: 'Pontos Convertidos em Kz',
      message: `Converteu ${pointsToConvert} pontos em ${kwanzaGained} Kz com sucesso.`,
      type: 'reward',
      actionLink: '/carteira',
    });

    return {
      kwanzaGained,
      remainingPoints: updatedWallet.points,
    };
  }

  // Support Tickets
  createTicket(subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], message: string): SupportTicket {
    const user = this.getCurrentUser();
    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tickets = this.getTickets();
    setStorageItem(STORAGE_KEYS.TICKETS, [newTicket, ...tickets]);

    const msg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ticketId,
      senderId: user.id,
      senderName: user.fullName,
      senderRole: 'user',
      message,
      createdAt: new Date().toISOString(),
    };
    const allMsgs = getStorageItem<SupportMessage[]>(STORAGE_KEYS.TICKET_MESSAGES, INITIAL_TICKET_MESSAGES);
    setStorageItem(STORAGE_KEYS.TICKET_MESSAGES, [...allMsgs, msg]);

    return newTicket;
  }

  replyTicket(ticketId: string, message: string, senderRole: 'user' | 'support' | 'admin'): SupportMessage {
    const user = this.getCurrentUser();
    const msg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ticketId,
      senderId: user.id,
      senderName: senderRole === 'user' ? user.fullName : 'Suporte Angoepo',
      senderRole,
      message,
      createdAt: new Date().toISOString(),
    };

    const allMsgs = getStorageItem<SupportMessage[]>(STORAGE_KEYS.TICKET_MESSAGES, INITIAL_TICKET_MESSAGES);
    setStorageItem(STORAGE_KEYS.TICKET_MESSAGES, [...allMsgs, msg]);

    // Update ticket status
    const tickets = this.getTickets();
    const updatedTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: senderRole === 'user' ? ('open' as const) : ('answered' as const),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);

    return msg;
  }

  // Notifications
  addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): void {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...item,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const current = this.getNotifications();
    this.setNotifications([newNotif, ...current]);
  }

  markAllNotificationsRead(): void {
    const updated = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.setNotifications(updated);
  }

  // Create Video (Admin)
  addVideo(video: Omit<VideoItem, 'id' | 'viewsCount' | 'createdAt'>): VideoItem {
    const newVid: VideoItem = {
      id: `vid_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...video,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    const list = this.getVideos();
    setStorageItem(STORAGE_KEYS.VIDEOS, [newVid, ...list]);
    this.addAuditLog('CREATE_VIDEO', 'VIDEO', newVid.id, `Criado vídeo: ${newVid.title}`);
    return newVid;
  }

  // Create Task (Admin)
  addTask(task: Omit<RewardTask, 'id' | 'totalCompletions' | 'createdAt'>): RewardTask {
    const newTask: RewardTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...task,
      totalCompletions: 0,
      createdAt: new Date().toISOString(),
    };
    const list = this.getTasks();
    setStorageItem(STORAGE_KEYS.TASKS, [newTask, ...list]);
    this.addAuditLog('CREATE_TASK', 'TASK', newTask.id, `Criada tarefa: ${newTask.title}`);
    return newTask;
  }
}

export const repo = AngoepoRepository.getInstance();
