'use client';

import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Bell,
  User,
  ShieldCheck,
  Menu,
  X,
  PlayCircle,
  Gift,
  ArrowUpRight,
  Share2,
  LifeBuoy,
  LogOut,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { Profile, Wallet, NotificationItem, UserRole } from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface NavbarProps {
  user: Profile;
  wallet: Wallet;
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  wallet,
  notifications,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onRoleSwitch,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const isAdmin = user.role !== 'user';

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: WalletIcon },
    { id: 'rewards', label: 'Ganhar Kz', icon: Gift },
    { id: 'wallet', label: 'Carteira', icon: WalletIcon },
    { id: 'withdrawals', label: 'Levantamentos', icon: ArrowUpRight },
    { id: 'referrals', label: 'Convites', icon: Share2 },
    { id: 'support', label: 'Suporte', icon: LifeBuoy },
    ...(isAdmin ? [{ id: 'admin', label: 'Administração', icon: ShieldCheck, badge: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b1329] border-b border-slate-800 text-white shadow-md">
      {/* Top Banner: Currency & Multicaixa Express Verification */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0b1329] to-emerald-950 px-4 py-1 text-xs text-slate-300 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-emerald-400">Plataforma Oficial Angola</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            Recompensas em Kwanza (AOA) com levantamentos via Multicaixa Express
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">100 Pts = 10 Kz</span>
          {/* Quick Role Switcher for seamless evaluation */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-300 text-[11px] font-semibold transition"
              title="Alternar perfil de demonstração"
            >
              <span>Papel: {user.role === 'user' ? 'Utilizador' : user.role === 'super_admin' ? 'Super Admin' : user.role}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md bg-slate-900 border border-slate-700 shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Alternar Papel
                </div>
                <button
                  onClick={() => {
                    onRoleSwitch('user');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                    user.role === 'user' ? 'text-emerald-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  <span>Utilizador (Manuel)</span>
                  {user.role === 'user' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch('super_admin');
                    setActiveTab('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                    user.role === 'super_admin' ? 'text-amber-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  <span>Super Admin</span>
                  {user.role === 'super_admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch('finance');
                    setActiveTab('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                    user.role === 'finance' ? 'text-cyan-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  <span>Financeiro</span>
                  {user.role === 'finance' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    onRoleSwitch('support');
                    setActiveTab('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between ${
                    user.role === 'support' ? 'text-indigo-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  <span>Suporte</span>
                  {user.role === 'support' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-900/40 group-hover:scale-105 transition transform">
            AR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                ANGOEPO
              </span>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-400">
                REWARDS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Assista, participe, partilhe e ganhe em Kwanza
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-700/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster: Wallet Capsule, Notifications, User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Wallet Capsule */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500/50 transition group shrink-0"
            title="Ver Carteira Digital"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping shrink-0" />
            <div className="text-left">
              <span className="hidden sm:block text-[10px] text-slate-400 leading-none">Saldo Kz</span>
              <span className="font-bold text-[11px] sm:text-xs text-emerald-400 leading-none whitespace-nowrap">
                {formatKwanza(wallet.balanceAOA)}
              </span>
            </div>
            <div className="hidden lg:block border-l border-slate-700 pl-2 ml-1 text-left">
              <span className="block text-[10px] text-slate-400 leading-none">Pontos</span>
              <span className="font-bold text-xs text-amber-400 leading-none">
                {wallet.points} pts
              </span>
            </div>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setNotifsOpen(!notifsOpen)}
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {notifsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    <span>Notificações Angoepo</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{notifications.length} no total</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Sem notificações.</p>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg text-xs border ${
                          notif.read
                            ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                            : 'bg-blue-950/40 border-blue-800/50 text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(notif.createdAt).toLocaleDateString('pt-AO')}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setNotifsOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Ver todas as actividades
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Capsule */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden ring-1 ring-blue-500 flex items-center justify-center font-bold text-xs text-white">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-white truncate max-w-[110px]">
                {user.fullName.split(' ')[0]}
              </span>
              <span className="block text-[10px] text-emerald-400 capitalize">
                {user.role === 'super_admin' ? 'Super Admin' : user.role === 'finance' ? 'Finanças' : 'Verificado'}
              </span>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Utilizador: {user.fullName}</span>
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
