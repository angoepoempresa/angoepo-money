'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DashboardView } from '@/components/DashboardView';
import { RewardsView } from '@/components/RewardsView';
import { WalletView } from '@/components/WalletView';
import { WithdrawalView } from '@/components/WithdrawalView';
import { ReferralsView } from '@/components/ReferralsView';
import { SupportView } from '@/components/SupportView';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PublicPages } from '@/components/PublicPages';
import { AuthModal } from '@/components/AuthModal';
import { repo } from '@/lib/repository';
import {
  Profile,
  Wallet,
  WalletTransaction,
  WithdrawalRequest,
  RewardTask,
  VideoItem,
  MusicTrackItem,
  CampaignItem,
  TaskCompletion,
  NotificationItem,
  ReferralItem,
  SupportTicket,
  SupportMessage,
  SystemSettings,
  AdminAuditLog,
  UserRole,
} from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

export default function Home() {
  // Reactive Core States loaded from repo
  const [user, setUser] = useState<Profile>(repo.getCurrentUser());
  const [wallet, setWallet] = useState<Wallet>(repo.getWallet());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(repo.getTransactions());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(repo.getWithdrawals());
  const [tasks, setTasks] = useState<RewardTask[]>(repo.getTasks());
  const [videos, setVideos] = useState<VideoItem[]>(repo.getVideos());
  const [music, setMusic] = useState<MusicTrackItem[]>(repo.getMusic());
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(repo.getCampaigns());
  const [completions, setCompletions] = useState<TaskCompletion[]>(repo.getCompletions());
  const [notifications, setNotifications] = useState<NotificationItem[]>(repo.getNotifications());
  const [referrals, setReferrals] = useState<ReferralItem[]>(repo.getReferrals());
  const [tickets, setTickets] = useState<SupportTicket[]>(repo.getTickets());
  const [settings, setSettings] = useState<SystemSettings>(repo.getSettings());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(repo.getAuditLogs());

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [subTab, setSubTab] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Sync state helper
  const refreshState = () => {
    setUser(repo.getCurrentUser());
    setWallet(repo.getWallet());
    setTransactions(repo.getTransactions());
    setWithdrawals(repo.getWithdrawals());
    setTasks(repo.getTasks());
    setVideos(repo.getVideos());
    setMusic(repo.getMusic());
    setCampaigns(repo.getCampaigns());
    setCompletions(repo.getCompletions());
    setNotifications(repo.getNotifications());
    setReferrals(repo.getReferrals());
    setTickets(repo.getTickets());
    setSettings(repo.getSettings());
    setAuditLogs(repo.getAuditLogs());
  };

  useEffect(() => {
    refreshState();
  }, []);

  // Handlers
  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = repo.switchUserRole(newRole);
    setUser(updated);
    refreshState();
  };

  const handleAuthSuccess = (loggedUser: Profile) => {
    repo.setCurrentUser(loggedUser);
    setUser(loggedUser);
    refreshState();
  };

  const handleLogout = () => {
    const defaultUser = repo.switchUserRole('user');
    setUser(defaultUser);
    setActiveTab('dashboard');
    refreshState();
  };

  const handleDailyBonus = () => {
    const res = repo.completeGenericTask('tsk_001');
    refreshState();
    return res;
  };

  const handleCompleteMedia = (type: 'video' | 'music', id: string, duration: number) => {
    const res = repo.completeMedia(type, id, duration);
    refreshState();
    return res;
  };

  const handleCompleteGenericTask = (taskId: string) => {
    const res = repo.completeGenericTask(taskId);
    refreshState();
    return res;
  };

  const handleConvertPoints = (points: number) => {
    const res = repo.convertPoints(points);
    refreshState();
    return res;
  };

  const handleRequestWithdrawal = (amount: number, accountHolder: string, mcxPhone: string) => {
    const req = repo.requestWithdrawal(amount, accountHolder, mcxPhone);
    refreshState();
    return req;
  };

  const handleAdminApproveWithdrawal = (id: string, notes?: string) => {
    repo.adminApproveWithdrawal(id, notes);
    refreshState();
  };

  const handleAdminRejectWithdrawal = (id: string, reason: string) => {
    repo.adminRejectWithdrawal(id, reason);
    refreshState();
  };

  const handleAddVideo = (videoData: Omit<VideoItem, 'id' | 'viewsCount' | 'createdAt'>) => {
    repo.addVideo(videoData);
    refreshState();
  };

  const handleAddTask = (taskData: Omit<RewardTask, 'id' | 'totalCompletions' | 'createdAt'>) => {
    repo.addTask(taskData);
    refreshState();
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    repo.setSettings(newSettings);
    refreshState();
  };

  const handleCreateTicket = (
    subj: string,
    cat: SupportTicket['category'],
    pri: SupportTicket['priority'],
    msg: string
  ) => {
    const t = repo.createTicket(subj, cat, pri, msg);
    refreshState();
    return t;
  };

  const handleReplyTicket = (
    ticketId: string,
    message: string,
    role: 'user' | 'support' | 'admin'
  ) => {
    const m = repo.replyTicket(ticketId, message, role);
    refreshState();
    return m;
  };

  const handleNavigation = (tab: string, subCategory?: string) => {
    setActiveTab(tab);
    setSubTab(subCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicPage = [
    'how_it_works',
    'faq',
    'terms',
    'privacy',
    'contacts',
    'compliance',
    'copyright',
  ].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        wallet={wallet}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigation(t)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Public Informational Pages */}
        {isPublicPage && (
          <PublicPages
            pageType={activeTab as any}
            onNavigateToRegister={() => setAuthModalOpen(true)}
            onNavigateToEarn={() => handleNavigation('rewards')}
          />
        )}

        {/* 1. Client Dashboard */}
        {!isPublicPage && activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            wallet={wallet}
            tasks={tasks}
            videos={videos}
            music={music}
            completedCount={completions.length}
            referralsCount={referrals.length}
            onNavigate={(t, s) => handleNavigation(t, s)}
            onClaimDailyBonus={handleDailyBonus}
          />
        )}

        {/* 2. Rewards Earning Center */}
        {!isPublicPage && activeTab === 'rewards' && (
          <RewardsView
            initialSubTab={subTab}
            videos={videos}
            music={music}
            tasks={tasks}
            campaigns={campaigns}
            completions={completions}
            onCompleteMedia={handleCompleteMedia}
            onCompleteGenericTask={handleCompleteGenericTask}
          />
        )}

        {/* 3. Digital Wallet */}
        {!isPublicPage && activeTab === 'wallet' && (
          <WalletView
            wallet={wallet}
            transactions={transactions}
            onConvertPoints={handleConvertPoints}
            onNavigateToWithdrawals={() => handleNavigation('withdrawals')}
          />
        )}

        {/* 4. Multicaixa Express Withdrawals */}
        {!isPublicPage && activeTab === 'withdrawals' && (
          <WithdrawalView
            user={user}
            wallet={wallet}
            withdrawals={withdrawals}
            onRequestWithdrawal={handleRequestWithdrawal}
          />
        )}

        {/* 5. Referrals / Invites */}
        {!isPublicPage && activeTab === 'referrals' && (
          <ReferralsView user={user} referrals={referrals} />
        )}

        {/* 6. Customer Support */}
        {!isPublicPage && activeTab === 'support' && (
          <SupportView
            user={user}
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onGetMessages={(ticketId) => repo.getTicketMessages(ticketId)}
            onReplyTicket={handleReplyTicket}
          />
        )}

        {/* 7. Comprehensive Admin Dashboard */}
        {!isPublicPage && activeTab === 'admin' && (
          <AdminDashboard
            adminUser={user}
            withdrawals={withdrawals}
            tasks={tasks}
            videos={videos}
            settings={settings}
            auditLogs={auditLogs}
            onApproveWithdrawal={handleAdminApproveWithdrawal}
            onRejectWithdrawal={handleAdminRejectWithdrawal}
            onAddVideo={handleAddVideo}
            onAddTask={handleAddTask}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* 8. User Profile View */}
        {!isPublicPage && activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {user.fullName[0]}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{user.fullName}</h2>
                <p className="text-xs text-slate-500 font-mono">@{user.username} • Membro desde 2026</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Conta Verificada 18+ (Angola)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Número de Telefone</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{user.phoneNumber}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">E-mail Cadastrado</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{user.email}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Código de Convite</span>
                <span className="font-mono font-bold text-blue-700 mt-0.5 block">{user.invitationCode}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Papel do Utilizador</span>
                <span className="font-bold text-slate-900 mt-0.5 block capitalize">{user.role}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Alternar Conta / Login
              </button>
              <button
                onClick={() => handleNavigation('wallet')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Aceder à Carteira
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onOpenPage={(p) => handleNavigation(p)} />

      {/* Auth Modal for Login / Registration / Recovery */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
