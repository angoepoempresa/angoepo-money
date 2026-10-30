'use client';

import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Filter,
  CreditCard,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Wallet, WalletTransaction } from '@/lib/types';
import { formatKwanza } from '@/lib/finance-engine';

interface WalletViewProps {
  wallet: Wallet;
  transactions: WalletTransaction[];
  onConvertPoints: (points: number) => { kwanzaGained: number; remainingPoints: number };
  onNavigateToWithdrawals: () => void;
}

export function WalletView({
  wallet,
  transactions,
  onConvertPoints,
  onNavigateToWithdrawals,
}: WalletViewProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [pointsInput, setPointsInput] = useState<number>(100);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<WalletTransaction | null>(null);
  const [convertSuccess, setConvertSuccess] = useState<string | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  const filteredTxs = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    if (filterType === 'reward') return tx.type === 'reward';
    if (filterType === 'withdrawal') return tx.type.startsWith('withdrawal');
    if (filterType === 'bonus') return tx.type === 'bonus' || tx.type === 'referral';
    if (filterType === 'conversion') return tx.type === 'points_conversion';
    return true;
  });

  const handleConversionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConvertSuccess(null);
    setConvertError(null);
    try {
      const res = onConvertPoints(Number(pointsInput));
      setConvertSuccess(
        `Conversão concluída! Recebeu ${formatKwanza(res.kwanzaGained)} no seu saldo disponível.`
      );
    } catch (err: any) {
      setConvertError(err.message || 'Erro ao converter pontos.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Virtual Card & Quick Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Angoepo Virtual Black Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1329] p-7 text-white shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-600/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Card Top */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white text-base shadow-md">
                AR
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-slate-200">
                  CARTEIRA DIGITAL ANGOEPO
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono">
                  MULTICAIXA EXPRESS READY
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conta Auditada</span>
            </div>
          </div>

          {/* Card Center: Balances */}
          <div className="relative z-10 my-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                Saldo Disponível
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                {formatKwanza(wallet.balanceAOA)}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                Saldo Reservado / Pendente
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight mt-0.5">
                {formatKwanza(wallet.pendingBalanceAOA)}
              </div>
            </div>
          </div>

          {/* Card Bottom: Actions */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Levantado</span>
                <span className="font-bold text-slate-200">{formatKwanza(wallet.totalWithdrawnAOA)}</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] text-slate-500 block">Bónus Recebidos</span>
                <span className="font-bold text-emerald-400">{formatKwanza(wallet.totalBonusAOA)}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToWithdrawals}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Pedir Levantamento MCX</span>
            </button>
          </div>
        </div>

        {/* Points Converter Widget (Section 8) */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                Conversor de Pontos
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                10 Pts = 1 Kz
              </span>
            </div>

            <h3 className="font-black text-base text-slate-900">
              Transforme pontos em Kwanza
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Possui actualmente <strong className="text-blue-700">{wallet.points} pontos</strong> na sua conta.
            </p>

            {convertSuccess && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                {convertSuccess}
              </div>
            )}

            {convertError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[11px] font-semibold">
                {convertError}
              </div>
            )}

            <form onSubmit={handleConversionSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Quantidade de Pontos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="10"
                    min="10"
                    max={wallet.points}
                    value={pointsInput}
                    onChange={(e) => setPointsInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPointsInput(wallet.points)}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Máx
                  </button>
                </div>
              </div>

              {/* Conversion Result Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Irá receber:</span>
                <span className="font-black text-emerald-600 text-sm">
                  {formatKwanza(Math.floor(pointsInput / 10))}
                </span>
              </div>

              <button
                type="submit"
                disabled={pointsInput <= 0 || pointsInput > wallet.points}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Converter para Kwanza</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Immutable Financial Ledger (Section 9) */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Livro Razão Imutável de Transacções</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registo criptográfico e auditado de todos os créditos, reservas e levantamentos
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'reward', label: 'Recompensas' },
              { id: 'withdrawal', label: 'Levantamentos' },
              { id: 'bonus', label: 'Bónus' },
              { id: 'conversion', label: 'Conversões' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3">Data & Hora</th>
                <th className="py-3 px-3">Referência</th>
                <th className="py-3 px-3">Tipo de Operação</th>
                <th className="py-3 px-3">Descrição</th>
                <th className="py-3 px-3 text-right">Valor em Kz</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Comprovativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Nenhuma transacção encontrada para este filtro.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => {
                  const isPositive = tx.amountAOA > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString('pt-AO')}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-700">
                        {tx.referenceCode}
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize font-semibold text-slate-800">
                          {tx.type === 'reward'
                            ? 'Recompensa'
                            : tx.type === 'withdrawal_reserve'
                            ? 'Reserva de Levantamento'
                            : tx.type === 'withdrawal_settle'
                            ? 'Pagamento Multicaixa'
                            : tx.type === 'withdrawal_refund'
                            ? 'Estorno de Levantamento'
                            : tx.type === 'points_conversion'
                            ? 'Conversão de Pontos'
                            : 'Bónus de Convite'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className={`py-3 px-3 text-right font-black whitespace-nowrap ${
                        isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isPositive ? `+${formatKwanza(tx.amountAOA)}` : formatKwanza(tx.amountAOA)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status === 'completed' ? 'Liquidado' : tx.status === 'pending' ? 'Reservado' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
                          title="Visualizar Comprovativo"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedTxForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Comprovativo de Operação</h4>
                  <p className="text-[10px] text-slate-500">Angoepo Rewards • República de Angola</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxForReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Referência Única:</span>
                <span className="font-mono font-bold text-slate-900">{selectedTxForReceipt.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data e Hora:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedTxForReceipt.createdAt).toLocaleString('pt-AO')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipo de Movimento:</span>
                <span className="font-semibold text-slate-800 capitalize">{selectedTxForReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Descrição:</span>
                <span className="font-semibold text-slate-800 text-right">{selectedTxForReceipt.description}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Montante:</span>
                <span className="font-black text-base text-emerald-600">
                  {formatKwanza(Math.abs(selectedTxForReceipt.amountAOA))}
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Registo Auditado no Livro Razão
              </span>
            </div>

            <button
              onClick={() => setSelectedTxForReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Fechar Comprovativo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
