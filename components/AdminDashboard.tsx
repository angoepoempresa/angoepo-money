'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Video,
  Music,
  PlusCircle,
  FileText,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lock,
  Search,
} from 'lucide-react';
import {
  Profile,
  WithdrawalRequest,
  RewardTask,
  VideoItem,
  SystemSettings,
  AdminAuditLog,
} from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface AdminDashboardProps {
  adminUser: Profile;
  withdrawals: WithdrawalRequest[];
  tasks: RewardTask[];
  videos: VideoItem[];
  settings: SystemSettings;
  auditLogs: AdminAuditLog[];
  onApproveWithdrawal: (id: string, notes?: string) => void;
  onRejectWithdrawal: (id: string, reason: string) => void;
  onAddVideo: (video: Omit<VideoItem, 'id' | 'viewsCount' | 'createdAt'>) => void;
  onAddTask: (task: Omit<RewardTask, 'id' | 'totalCompletions' | 'createdAt'>) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
}

export function AdminDashboard({
  adminUser,
  withdrawals,
  tasks,
  videos,
  settings,
  auditLogs,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onAddVideo,
  onAddTask,
  onUpdateSettings,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'withdrawals' | 'content' | 'settings' | 'audit'
  >('overview');

  // Withdrawal action state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Telefone Multicaixa divergente');

  // New Video Form state
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidChannel, setNewVidChannel] = useState('');
  const [newVidDuration, setNewVidDuration] = useState('90');
  const [newVidMinWatch, setNewVidMinWatch] = useState('30');
  const [newVidRewardAOA, setNewVidRewardAOA] = useState('15');
  const [newVidRewardPts, setNewVidRewardPts] = useState('150');
  const [newVidThumb, setNewVidThumb] = useState(
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80'
  );
  const [videoCreatedSuccess, setVideoCreatedSuccess] = useState(false);

  // Settings state
  const [editablePointsRatio, setEditablePointsRatio] = useState(settings.pointsToKwanzaRatio);
  const [editableMinWithdrawal, setEditableMinWithdrawal] = useState(settings.minWithdrawalAOA);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending' || w.status === 'reviewing');
  const paidWithdrawals = withdrawals.filter((w) => w.status === 'paid');
  const totalPaidVolumeAOA = paidWithdrawals.reduce((acc, w) => acc + w.amountAOA, 0);

  const handleApprove = (id: string) => {
    onApproveWithdrawal(id, 'Aprovado pelo operador financeiro com liquidação autorizada.');
  };

  const handleConfirmReject = (id: string) => {
    if (!rejectReason.trim()) return;
    onRejectWithdrawal(id, rejectReason);
    setRejectingId(null);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle || !newVidChannel) return;

    onAddVideo({
      title: newVidTitle,
      channelName: newVidChannel,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationSeconds: parseInt(newVidDuration) || 60,
      minWatchSeconds: parseInt(newVidMinWatch) || 30,
      rewardAOA: parseInt(newVidRewardAOA) || 10,
      rewardPoints: parseInt(newVidRewardPts) || 100,
      category: 'Tecnologia & Economia',
      thumbnailUrl: newVidThumb,
      active: true,
    });

    setVideoCreatedSuccess(true);
    setNewVidTitle('');
    setNewVidChannel('');
    setTimeout(() => setVideoCreatedSuccess(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      pointsToKwanzaRatio: Number(editablePointsRatio),
      minWithdrawalAOA: Number(editableMinWithdrawal),
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Top Header Banner */}
      <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Painel Administrativo Angoepo</span>
            </span>
            <span className="text-xs text-slate-400">Papel: {adminUser.role.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Centro de Operações & Controlo de Risco
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão operacional de levantamentos Multicaixa Express, sustentabilidade financeira e auditoria.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSection === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection('withdrawals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition relative ${
              activeSection === 'withdrawals' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Levantamentos ({pendingWithdrawals.length})
            {pendingWithdrawals.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-[10px] text-white">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('content')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSection === 'content' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tarefas & Conteúdos
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSection === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Configurações
          </button>
          <button
            onClick={() => setActiveSection('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSection === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Auditoria ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* --- SECTION 1: OVERVIEW METRICS --- */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Total de Utilizadores Activos
              </span>
              <div className="text-2xl font-black text-slate-900">28.450</div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                +142 novos registos hoje
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Levantamentos Pagos (Volume)
              </span>
              <div className="text-2xl font-black text-emerald-600">
                {formatKwanza(totalPaidVolumeAOA)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {paidWithdrawals.length} liquidados via MCX
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Fila Pendente Multicaixa
              </span>
              <div className="text-2xl font-black text-amber-600">
                {pendingWithdrawals.length} pedidos
              </div>
              <span className="text-[11px] text-amber-700 font-bold mt-1 block">
                A necessitar de aprovação
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Orçamento de Campanhas
              </span>
              <div className="text-2xl font-black text-blue-600">1.300.000 Kz</div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Fundos reais 100% garantidos
              </span>
            </div>
          </div>

          {/* Quick Pending Withdrawals Priority Box */}
          {pendingWithdrawals.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-amber-900">
                    Atenção: Existem {pendingWithdrawals.length} pedidos de levantamento pendentes
                  </h4>
                  <p className="text-xs text-amber-800">
                    Valide a titularidade do Multicaixa Express e aprove os pagamentos para os clientes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('withdrawals')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Rever Fila Imediatamente
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- SECTION 2: WITHDRAWAL MANAGEMENT (Section 10 & 12) --- */}
      {activeSection === 'withdrawals' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Fila Operacional de Levantamentos Multicaixa Express
              </h3>
              <p className="text-xs text-slate-500">
                Aprovação, estorno atómico e simulação autorizada de pagamentos
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {withdrawals.length} pedidos no histórico
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Referência</th>
                  <th className="py-3 px-3">Beneficiário</th>
                  <th className="py-3 px-3">Telefone MCX</th>
                  <th className="py-3 px-3 text-right">Valor em Kz</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-3 text-center">Ações Operacionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('pt-AO')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {req.referenceCode}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {req.accountHolderName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {req.mcxPhoneNumber}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatKwanza(req.amountAOA)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'reviewing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status === 'paid'
                          ? 'Pago ✓'
                          : req.status === 'pending'
                          ? 'Pendente'
                          : req.status === 'reviewing'
                          ? 'Em Análise'
                          : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {req.status === 'pending' || req.status === 'reviewing' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                            title="Aprovar e Liquidar"
                          >
                            Aprovar & Pagar
                          </button>
                          <button
                            onClick={() => setRejectingId(req.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] transition cursor-pointer"
                            title="Rejeitar e Estornar Saldo"
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rejection Modal with Reason */}
          {rejectingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm text-red-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>Rejeitar Pedido de Levantamento</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Ao rejeitar, o montante reservado será imediatamente estornado de volta para o saldo disponível do cliente.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Motivo da Recusa (visível ao cliente)
                  </label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingId(null)}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleConfirmReject(rejectingId)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Confirmar Estorno
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SECTION 3: CONTENT & TASKS --- */}
      {activeSection === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Video Form */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              <span>Publicar Novo Vídeo Remunerado</span>
            </h3>

            {videoCreatedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ Novo vídeo adicionado com sucesso à plataforma!
              </div>
            )}

            <form onSubmit={handleCreateVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Vídeo</label>
                <input
                  type="text"
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  placeholder="Ex: Como Abrir Conta Bancária em Angola"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Canal</label>
                <input
                  type="text"
                  value={newVidChannel}
                  onChange={(e) => setNewVidChannel(e.target.value)}
                  placeholder="Ex: Finanças Angola TV"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recompensa em Kz</label>
                  <input
                    type="number"
                    value={newVidRewardAOA}
                    onChange={(e) => setNewVidRewardAOA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempo Mínimo (seg)</label>
                  <input
                    type="number"
                    value={newVidMinWatch}
                    onChange={(e) => setNewVidMinWatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Adicionar Vídeo ao Catálogo
              </button>
            </form>
          </div>

          {/* Active Tasks List */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Tarefas Activas no Sistema</span>
            </h3>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{task.title}</span>
                    <span className="text-[11px] text-slate-500">
                      Categoria: {task.category} • {task.totalCompletions} conclusões
                    </span>
                  </div>
                  <span className="font-black text-emerald-600">
                    +{formatKwanza(task.rewardAOA)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 4: SYSTEM SETTINGS --- */}
      {activeSection === 'settings' && (
        <div className="max-w-xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-slate-700" />
            <span>Configurações Globais da Plataforma</span>
          </h3>

          {settingsSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              ✓ Configurações actualizadas com sucesso no servidor!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Taxa de Conversão de Pontos (Quantos pontos valem 1 Kz)
              </label>
              <input
                type="number"
                value={editablePointsRatio}
                onChange={(e) => setEditablePointsRatio(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Padrão: 10 (ou seja, 100 pontos = 10 Kz).
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Montante Mínimo para Levantamento Multicaixa Express (Kz)
              </label>
              <input
                type="number"
                value={editableMinWithdrawal}
                onChange={(e) => setEditableMinWithdrawal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Padrão: 1.000 Kz.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Guardar Configurações
            </button>
          </form>
        </div>
      )}

      {/* --- SECTION 5: AUDIT LOGS --- */}
      {activeSection === 'audit' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <span>Registos Imutáveis de Auditoria Administrativa</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Operador Admin</th>
                  <th className="py-2.5 px-3">Ação</th>
                  <th className="py-2.5 px-3">Entidade</th>
                  <th className="py-2.5 px-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('pt-AO')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.adminEmail}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {log.entityType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
