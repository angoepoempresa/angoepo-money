'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Building,
  Lock,
} from 'lucide-react';
import { Profile, Wallet, WithdrawalRequest } from '@/lib/types';
import {
  formatKwanza,
  validateWithdrawalRequest,
  formatAngolanPhone,
  calculateWithdrawal,
} from '@/lib/finance-engine';

interface WithdrawalViewProps {
  user: Profile;
  wallet: Wallet;
  withdrawals: WithdrawalRequest[];
  onRequestWithdrawal: (amount: number, accountHolder: string, mcxPhone: string) => WithdrawalRequest;
}

export function WithdrawalView({
  user,
  wallet,
  withdrawals,
  onRequestWithdrawal,
}: WithdrawalViewProps) {
  const [amount, setAmount] = useState<string>('1500');
  const [accountHolder, setAccountHolder] = useState<string>(user.fullName);
  const [mcxPhone, setMcxPhone] = useState<string>(user.phoneNumber);
  const [notes, setNotes] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<WithdrawalRequest | null>(null);

  const numericAmount = parseInt(amount) || 0;
  const { feeAOA, netAmountAOA } = calculateWithdrawal(numericAmount, 0);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateWithdrawalRequest({
      amountAOA: numericAmount,
      availableBalanceAOA: wallet.balanceAOA,
      accountHolderName: accountHolder,
      mcxPhoneNumber: mcxPhone,
    });

    if (!validation.valid) {
      setError(validation.error || 'Dados de levantamento inválidos.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const req = onRequestWithdrawal(numericAmount, accountHolder, mcxPhone);
        setLoading(false);
        setSuccess(
          `Pedido de levantamento de ${formatKwanza(numericAmount)} registado com sucesso! Referência: ${req.referenceCode}. O saldo foi reservado e está em verificação.`
        );
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Erro ao processar levantamento.');
      }
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Informative Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#0b1329] p-6 sm:p-8 text-white border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Processamento Exclusivo Multicaixa Express</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Levantar Dinheiro em Kwanza</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Transfira as suas recompensas directamente para a sua conta bancária de Angola associada ao seu número de telefone Multicaixa Express.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl text-right shrink-0">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
            Saldo Disponível para Levantamento
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">
            {formatKwanza(wallet.balanceAOA)}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Mínimo: {formatKwanza(1000)} • Taxa: 0 Kz
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">
              Formulário de Solicitação
            </h3>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Operação Criptografada
            </span>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Atenção no pedido:</strong>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Pedido Submetido com Sucesso!</strong>
                <p className="mt-0.5 leading-relaxed">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Valor a Levantar em Kwanza (Kz)
                </label>
                <div className="flex items-center gap-2">
                  {[1000, 2000, 5000].map((quickVal) => (
                    <button
                      key={quickVal}
                      type="button"
                      onClick={() => setAmount(String(quickVal))}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                    >
                      {formatKwanza(quickVal)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(String(wallet.balanceAOA))}
                    className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold"
                  >
                    Tudo
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="absolute right-4 top-3.5 font-bold text-slate-400 text-sm">
                  Kz
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Valor mínimo permitido: 1.000 Kz. Sem limites máximos para saldos acumulados legitimamente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Titular da Conta
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nome completo conforme registo bancário"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de Telefone Multicaixa Express
                </label>
                <input
                  type="tel"
                  value={mcxPhone}
                  onChange={(e) => setMcxPhone(e.target.value)}
                  placeholder="923 884 102"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Método de Pagamento
              </label>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    MCX
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Multicaixa Express (EMIS)</span>
                    <span className="text-[11px] text-slate-500">
                      Disponível para clientes BAI, BFA, BIC, BPC, Atlântico, Standard Bank e outros
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Activo
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observações Adicionais (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Conta principal no Banco BAI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Valor Solicitado:</span>
                <span className="font-bold text-slate-900">{formatKwanza(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxa da Plataforma Angoepo (0%):</span>
                <span className="font-bold text-emerald-600">0 Kz (Grátis)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Valor Líquido a Receber:</span>
                <span className="text-emerald-600">{formatKwanza(netAmountAOA)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || wallet.balanceAOA < 1000}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>{loading ? 'A processar reserva de saldo...' : 'Confirmar e Solicitar Levantamento'}</span>
            </button>
          </form>
        </div>

        {/* Security / Regulations Column */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Regras de Levantamento & Segurança</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong>Titularidade:</strong> O número do Multicaixa Express deve estar activo e pertencer ao titular cadastrado.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong>Reserva Atómica:</strong> O valor solicitado é reservado imediatamente no seu saldo pendente, impedindo levantamentos duplos.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong>Nunca Solicitamos PIN:</strong> A Angoepo Rewards nunca pedirá o seu PIN secreto do cartão ou código de confirmação confidencial.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  <strong>Estorno Garantido:</strong> Caso o pedido seja cancelado ou contenha dados divergentes, o saldo retorna 100% para a sua carteira disponível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests History Table */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <span>Histórico de Pedidos de Levantamento</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Referência</th>
                <th className="py-3 px-3">Titular / Telefone</th>
                <th className="py-3 px-3">Método</th>
                <th className="py-3 px-3 text-right">Valor em Kz</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Comprovativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    Nenhum pedido de levantamento registado até o momento.
                  </td>
                </tr>
              ) : (
                withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('pt-AO')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {req.referenceCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{req.accountHolderName}</div>
                      <div className="text-[11px] text-slate-500">{formatAngolanPhone(req.mcxPhoneNumber)}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {req.paymentMethod}
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
                      <button
                        onClick={() => setSelectedReceipt(req)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                        title="Ver Recibo Oficial"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  MCX
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">Comprovativo Multicaixa Express</h4>
                  <p className="text-[10px] text-slate-500">Angoepo Rewards • República de Angola</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Código de Referência:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Titular da Conta:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.accountHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Número Multicaixa:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatAngolanPhone(selectedReceipt.mcxPhoneNumber)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data de Solicitação:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedReceipt.createdAt).toLocaleString('pt-AO')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado Actual:</span>
                <span className="font-bold text-emerald-600 uppercase">{selectedReceipt.status}</span>
              </div>
              {selectedReceipt.adminNotes && (
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span className="font-bold text-slate-700 block">Notas de Operação:</span>
                  <p className="mt-0.5 text-[11px]">{selectedReceipt.adminNotes}</p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-800 font-extrabold">Montante Líquido:</span>
                <span className="font-black text-base text-emerald-600">
                  {formatKwanza(selectedReceipt.netAmountAOA)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
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
