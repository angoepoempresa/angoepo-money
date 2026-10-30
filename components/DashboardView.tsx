'use client';

import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Video,
  Music,
  Share2,
  CalendarCheck,
  Users,
  Megaphone,
  ArrowUpRight,
  History,
  User,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Profile, Wallet, RewardTask, VideoItem, MusicTrackItem } from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface DashboardViewProps {
  user: Profile;
  wallet: Wallet;
  tasks: RewardTask[];
  videos: VideoItem[];
  music: MusicTrackItem[];
  completedCount: number;
  referralsCount: number;
  onNavigate: (tab: string, subCategory?: string) => void;
  onClaimDailyBonus: () => void;
}

export function DashboardView({
  user,
  wallet,
  tasks,
  videos,
  music,
  completedCount,
  referralsCount,
  onNavigate,
  onClaimDailyBonus,
}: DashboardViewProps) {
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const handleDailyClick = () => {
    try {
      onClaimDailyBonus();
      setDailyClaimed(true);
    } catch {
      setDailyClaimed(true);
    }
  };

  const quickActions = [
    {
      id: 'videos',
      tab: 'rewards',
      sub: 'videos',
      label: 'Assistir a Vídeos',
      desc: 'Ganhe Kz por visualizações autorizadas',
      icon: Video,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Disponível',
    },
    {
      id: 'music',
      tab: 'rewards',
      sub: 'music',
      label: 'Ouvir Músicas',
      desc: 'Semba, Kizomba, Kuduro e Afro House',
      icon: Music,
      color: 'from-purple-600 to-pink-600',
      badge: 'Licenciado',
    },
    {
      id: 'share',
      tab: 'rewards',
      sub: 'share',
      label: 'Partilhar Conteúdos',
      desc: 'Divulgue no WhatsApp e redes sociais',
      icon: Share2,
      color: 'from-emerald-600 to-teal-600',
      badge: '200 Pts',
    },
    {
      id: 'daily',
      tab: 'rewards',
      sub: 'daily',
      label: 'Tarefas Diárias',
      desc: 'Check-in e questionários remunerados',
      icon: CalendarCheck,
      color: 'from-amber-600 to-orange-600',
      badge: 'Bónus',
    },
    {
      id: 'referrals',
      tab: 'referrals',
      sub: undefined,
      label: 'Convidar Amigos',
      desc: 'Receba 250 Kz por cada indicação activa',
      icon: Users,
      color: 'from-cyan-600 to-blue-600',
      badge: '250 Kz',
    },
    {
      id: 'campaigns',
      tab: 'rewards',
      sub: 'campaigns',
      label: 'Campanhas',
      desc: 'Marcas patrocinadoras de Angola',
      icon: Megaphone,
      color: 'from-rose-600 to-red-600',
      badge: 'Destaque',
    },
    {
      id: 'wallet',
      tab: 'wallet',
      sub: undefined,
      label: 'Minha Carteira',
      desc: 'Extrato digital e conversor de pontos',
      icon: WalletIcon,
      color: 'from-slate-700 to-slate-900',
      badge: 'Saldo',
    },
    {
      id: 'withdrawals',
      tab: 'withdrawals',
      sub: undefined,
      label: 'Levantamentos MCX',
      desc: 'Transferência rápida Multicaixa Express',
      icon: ArrowUpRight,
      color: 'from-emerald-700 to-green-900',
      badge: 'Mín 1.000 Kz',
    },
    {
      id: 'history',
      tab: 'wallet',
      sub: 'history',
      label: 'Histórico Financeiro',
      desc: 'Livro razão imutável de transacções',
      icon: History,
      color: 'from-blue-800 to-slate-900',
      badge: 'Auditado',
    },
    {
      id: 'profile',
      tab: 'profile',
      sub: undefined,
      label: 'Meu Perfil',
      desc: 'Dados cadastrais e telefone verificado',
      icon: User,
      color: 'from-indigo-800 to-slate-900',
      badge: '18+ Verificado',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Greeting & Daily Bonus Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#162044] to-[#1e3a8a] text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 ring-2 ring-emerald-500/60 overflow-hidden flex items-center justify-center font-bold text-xl text-white shadow-lg">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="Conta Verificada">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 font-bold" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Membro Angoepo Activo
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-400 text-xs">Luanda, AO</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                Olá, {user.fullName.split(' ')[0]} {user.fullName.split(' ')[1] || ''}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Hoje tem <strong className="text-emerald-400">{videos.length + music.length + tasks.length} actividades disponíveis</strong> para acumular saldo em Kwanza.
              </p>
            </div>
          </div>

          {/* Daily Streak & Fast Claim */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Ofensiva Diária</span>
                <span className="font-extrabold text-sm text-amber-400">5 Dias Seguidos</span>
              </div>
            </div>

            <button
              onClick={handleDailyClick}
              disabled={dailyClaimed}
              className={`px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                dailyClaimed
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-900/40 hover:scale-102 cursor-pointer'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{dailyClaimed ? 'Bónus de Hoje Reclamado (+5 Kz)' : 'Reclamar Bónus Diário (+5 Kz)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Balances & Statistics) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Resumo da Sua Carteira & Ganhos</span>
          </h2>
          <button
            onClick={() => onNavigate('wallet')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Ver Extrato Detalhado <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Saldo Disponível */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-slate-600">Saldo Disponível</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                Kz
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
              {formatKwanza(wallet.balanceAOA)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Pronto para levantar via MCX</span>
            </div>
          </div>

          {/* Saldo Pendente */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-slate-600">Saldo Reservado / Pendente</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
              {formatKwanza(wallet.pendingBalanceAOA)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Em validação / levantamento</span>
            </div>
          </div>

          {/* Pontos Acumulados */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-slate-600">Pontos Acumulados</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">
              {wallet.points} <span className="text-xs text-slate-500 font-semibold">pts</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Equivale a {Math.floor(wallet.points / 10)} Kz</span>
            </div>
          </div>

          {/* Total Ganho na Plataforma */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold text-slate-600">Total Histórico Ganho</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatKwanza(wallet.totalEarnedAOA)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {completedCount} tarefas concluídas
            </div>
          </div>
        </div>
      </div>

      {/* 10 Quick Action Cards Requested in Section 6 */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Menu de Acesso Rápido
          </h2>
          <p className="text-xs text-slate-500">
            Aceda directamente às principais áreas da plataforma Angoepo Rewards
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.tab, action.sub)}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition text-left group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                    {action.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {action.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Tasks Carousel / Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Actividades Recomendadas para Si
            </h2>
            <p className="text-xs text-slate-500">
              Conclua estas actividades hoje para aumentar o seu saldo em Kwanza
            </p>
          </div>
          <button
            onClick={() => onNavigate('rewards')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Ver Todas ({videos.length + music.length + tasks.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Video Pick */}
          {videos[0] && (
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-36 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={videos[0].thumbnailUrl}
                  alt={videos[0].title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
                  Vídeo Remunerado
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[11px] font-mono">
                  {videos[0].durationSeconds}s
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    {videos[0].category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">
                    {videos[0].title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Canal: {videos[0].channelName}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-emerald-600">
                      +{formatKwanza(videos[0].rewardAOA)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({videos[0].rewardPoints} pts)
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('rewards', 'videos')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Assistir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Music Pick */}
          {music[0] && (
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-36 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={music[0].coverArtUrl}
                  alt={music[0].title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">
                  Música: {music[0].genre}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[11px] font-mono">
                  {music[0].durationSeconds}s
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                    {music[0].genre} Angolano
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                    {music[0].title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Artista: {music[0].artist}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-emerald-600">
                      +{formatKwanza(music[0].rewardAOA)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({music[0].rewardPoints} pts)
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('rewards', 'music')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ouvir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Share Pick */}
          {tasks[1] && (
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Partilha Social
                  </span>
                  <span className="text-[10px] text-slate-400">Rápido</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">
                  {tasks[1].title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {tasks[1].description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-600">
                    +{formatKwanza(tasks[1].rewardAOA)}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({tasks[1].rewardPoints} pts)
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('rewards', 'share')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Partilhar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multicaixa Express Direct Call to Action */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-700/40">
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
            Levantamentos Sem Complicações
          </span>
          <h3 className="text-lg font-bold mt-1">
            Transfira os seus ganhos em Kz para a sua conta bancária via Multicaixa Express
          </h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Mínimo de levantamento: 1.000 Kz. Sem taxas abusivas, processamento seguro e validado.
          </p>
        </div>
        <button
          onClick={() => onNavigate('withdrawals')}
          className="whitespace-nowrap px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs shadow-lg transition cursor-pointer"
        >
          Pedir Levantamento Agora
        </button>
      </div>
    </div>
  );
}
