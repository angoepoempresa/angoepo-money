'use client';

import React, { useState } from 'react';
import {
  Users,
  Copy,
  CheckCircle2,
  Share2,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Profile, ReferralItem } from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface ReferralsViewProps {
  user: Profile;
  referrals: ReferralItem[];
}

export function ReferralsView({ user, referrals }: ReferralsViewProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inviteCode = user.invitationCode || 'ANGO-PEDRO24';
  const inviteLink = `https://angoepo.ao/registo?ref=${inviteCode}`;

  const qualifiedCount = referrals.filter((r) => r.status === 'rewarded').length;
  const totalEarnedAOA = referrals
    .filter((r) => r.status === 'rewarded')
    .reduce((acc, r) => acc + r.rewardAOA, 0);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Estou a ganhar Kwanza na Angoepo Rewards assistindo a vídeos e ouvindo músicas em Angola! Regista-te gratuitamente com o meu código ${inviteCode} e começa a ganhar: ${inviteLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-[#162044] to-emerald-950 p-6 sm:p-8 text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Programa Oficial de Indicação</span>
          </span>
          <h2 className="text-2xl font-black tracking-tight">Convide Amigos & Ganhe 250 Kz</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Partilhe o seu código exclusivo. Quando o seu amigo se registar e concluir as primeiras 3 actividades legítimas, ambos recebem bonificações na carteira.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl text-right shrink-0">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
            Ganhos Totais com Convites
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">
            {formatKwanza(totalEarnedAOA)}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {qualifiedCount} amigos qualificados
          </span>
        </div>
      </div>

      {/* Code & Link Sharing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invite Code Box */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">O Seu Código de Convite</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Exclusivo
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="font-mono font-black text-xl text-blue-700 tracking-wider">
              {inviteCode}
            </span>
            <button
              onClick={() => copyToClipboard(inviteCode, 'code')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Os seus amigos podem inserir este código durante o formulário de cadastro gratuito.
          </p>
        </div>

        {/* Direct Link & WhatsApp Share */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Link Direto & Redes</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
              1-Clique
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-xs text-slate-600 truncate font-mono">
              {inviteLink}
            </span>
            <button
              onClick={() => copyToClipboard(inviteLink, 'link')}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          <button
            onClick={shareOnWhatsApp}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Partilhar Imediatamente no WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Lista de Amigos Convidados ({referrals.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhe o estado de validação de cada pessoa que se cadastrou com o seu código
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            Taxa de Qualificação: {referrals.length > 0 ? Math.round((qualifiedCount / referrals.length) * 100) : 0}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3">Data de Registo</th>
                <th className="py-3 px-3">Amigo Convidado</th>
                <th className="py-3 px-3">Código Usado</th>
                <th className="py-3 px-3">Bónus em Kz</th>
                <th className="py-3 px-3 text-center">Estado da Indicação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    Ainda não possui convidados. Partilhe o seu link acima para começar!
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {new Date(ref.createdAt).toLocaleDateString('pt-AO')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{ref.refereeName}</div>
                      <div className="text-[11px] text-slate-500">{ref.refereeEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {ref.codeUsed}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-600">
                      +{formatKwanza(ref.rewardAOA)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ref.status === 'rewarded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ref.status === 'rewarded' ? 'Qualificado & Pago' : 'Pendente (Faltam tarefas)'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
