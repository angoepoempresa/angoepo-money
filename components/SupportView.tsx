'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Profile, SupportTicket, SupportMessage } from '@/lib/types';

interface SupportViewProps {
  user: Profile;
  tickets: SupportTicket[];
  onCreateTicket: (
    subject: string,
    category: SupportTicket['category'],
    priority: SupportTicket['priority'],
    message: string
  ) => SupportTicket;
  onGetMessages: (ticketId: string) => SupportMessage[];
  onReplyTicket: (ticketId: string, message: string, senderRole: 'user' | 'support' | 'admin') => SupportMessage;
}

export function SupportView({
  user,
  tickets,
  onCreateTicket,
  onGetMessages,
  onReplyTicket,
}: SupportViewProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    tickets.length > 0 ? tickets[0] : null
  );
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New ticket state
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<SupportTicket['category']>('withdrawal');
  const [priority, setPriority] = useState<SupportTicket['priority']>('normal');
  const [initialMsg, setInitialMsg] = useState<string>('');
  const [newError, setNewError] = useState<string | null>(null);

  // Chat reply state
  const [replyText, setReplyText] = useState<string>('');

  const activeMessages = selectedTicket ? onGetMessages(selectedTicket.id) : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewError(null);

    if (!subject.trim() || subject.trim().length < 5) {
      setNewError('O assunto deve ter pelo menos 5 caracteres.');
      return;
    }
    if (!initialMsg.trim() || initialMsg.trim().length < 10) {
      setNewError('Por favor, descreva a sua dúvida em pelo menos 10 caracteres.');
      return;
    }

    const created = onCreateTicket(subject, category, priority, initialMsg);
    setSelectedTicket(created);
    setShowNewModal(false);
    setSubject('');
    setInitialMsg('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    onReplyTicket(selectedTicket.id, replyText.trim(), user.role === 'user' ? 'user' : 'support');
    setReplyText('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#162044] to-[#0b1329] p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-2">
            <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
            <span>Central de Atendimento ao Cliente</span>
          </span>
          <h2 className="text-2xl font-black tracking-tight">Suporte Técnico & Financeiro</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            A nossa equipa em Luanda está disponível para esclarecer dúvidas sobre levantamentos Multicaixa Express, validação de tarefas e segurança da conta.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Abrir Novo Chamado</span>
        </button>
      </div>

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List Column */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">Os Seus Chamados ({tickets.length})</h3>
            <span className="text-[11px] text-slate-400">Tempo de resposta: &lt; 2h</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                Nenhum chamado de suporte aberto.
              </p>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {t.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'answered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status === 'answered' ? 'Respondido' : t.status === 'open' ? 'Aberto' : 'Resolvido'}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">
                      {t.subject}
                    </h4>

                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{new Date(t.createdAt).toLocaleDateString('pt-AO')}</span>
                      <span className="capitalize font-semibold text-slate-500">Prioridade: {t.priority}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat / Conversation Column */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <>
              {/* Ticket Top Info */}
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{selectedTicket.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {selectedTicket.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {selectedTicket.subject}
                  </h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTicket.status === 'answered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedTicket.status === 'answered' ? 'Respondido pelo Suporte' : 'Aguardando Atendimento'}
                </span>
              </div>

              {/* Messages Thread */}
              <div className="my-4 flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-2">
                {activeMessages.map((msg) => {
                  const isUser = msg.senderRole === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600">{msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva a sua resposta para a equipa técnica..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Seleccione um chamado para ver a conversa</p>
              <p className="text-xs text-slate-400 mt-1">Ou abra um novo chamado para falar com o nosso suporte em Luanda</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Novo Chamado de Suporte</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {newError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                {newError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assunto do Chamado</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre levantamento pendente"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="withdrawal">Levantamentos MCX</option>
                    <option value="reward">Recompensas / Tarefas</option>
                    <option value="account">Minha Conta</option>
                    <option value="technical">Problema Técnico</option>
                    <option value="other">Outros Assuntos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descreva o Problema / Dúvida</label>
                <textarea
                  rows={4}
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  placeholder="Explique detalhadamente o que ocorreu..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Submeter Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
