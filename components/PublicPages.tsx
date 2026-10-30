'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Play,
  ArrowRight,
  HelpCircle,
  Lock,
  Award,
  Sparkles,
  Users,
  Building,
} from 'lucide-react';
import { formatKwanza } from '@/lib/finance-engine';

interface PublicPagesProps {
  pageType: 'how_it_works' | 'faq' | 'terms' | 'privacy' | 'contacts' | 'compliance' | 'copyright';
  onNavigateToRegister: () => void;
  onNavigateToEarn: () => void;
}

export function PublicPages({ pageType, onNavigateToRegister, onNavigateToEarn }: PublicPagesProps) {
  if (pageType === 'how_it_works') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-6 animate-in fade-in">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Guia Completo
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Como Funciona a Angoepo Rewards?
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Ganhar Kwanza (AOA) na internet de forma legal e segura é simples através do nosso modelo sustentável financiado por marcas de Angola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Registe a sua Conta</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O registo é 100% gratuito. Exigimos apenas o seu nome, e-mail e número de telefone angolano válido para confirmação.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Complete Actividades</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assista a vídeos educativos, ouça faixas de música autorizadas de artistas angolanos ou participe de campanhas patrocinadas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Receba no Multicaixa</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ao atingir 1.000 Kz, solicite o levantamento. O saldo entra directamente na sua conta bancária sem taxas escondidas.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Pronto para começar a acumular Kwanza?</h3>
            <p className="text-xs text-slate-300 mt-1">Crie a sua conta agora mesmo sem custos.</p>
          </div>
          <button
            onClick={onNavigateToRegister}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer"
          >
            Cadastrar Gratuitamente
          </button>
        </div>
      </div>
    );
  }

  if (pageType === 'faq') {
    const faqs = [
      {
        q: 'A Angoepo Rewards é legal em Angola?',
        a: 'Sim, a Angoepo opera com transparência e em estrita conformidade com a legislação da República de Angola e diretrizes de pagamentos do Banco Nacional de Angola (BNA). Não somos esquema de pirâmide nem prometemos rendimentos fixos irreais.',
      },
      {
        q: 'Preciso pagar para me registar ou para desbloquear saldo?',
        a: 'NUNCA! A criação de conta e o uso da plataforma são 100% gratuitos. Repudiamos qualquer cobrança aos utilizadores para libertar ganhos.',
      },
      {
        q: 'Como funciona o levantamento via Multicaixa Express?',
        a: 'Basta ter no mínimo 1.000 Kz de saldo disponível, informar o seu número de telefone angolano associado ao Multicaixa Express e o nome do titular. O valor é liquidado de forma segura na sua conta.',
      },
      {
        q: 'Quantas vezes posso assistir ao mesmo vídeo?',
        a: 'Para garantir integridade com os patrocinadores, cada vídeo e faixa musical remunera 1 vez ao dia por utilizador validado.',
      },
    ];

    return (
      <div className="space-y-8 max-w-4xl mx-auto py-6 animate-in fade-in">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Dúvidas Frequentes
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Perguntas Frequentes (FAQ)
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Esclareça rapidamente as principais questões sobre remuneração, pagamentos e regras da plataforma.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Terms and Privacy View
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6 animate-in fade-in">
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <div className="pb-4 border-b border-slate-100">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
            Documento Oficial • Angola
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Termos de Uso, Privacidade & Conformidade Legal
          </h1>
          <p className="text-xs text-slate-500 mt-1">Última actualização: Outubro de 2026</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">1. Elegibilidade e Idade Mínima</h3>
          <p>
            O acesso à plataforma Angoepo Rewards é restrito a indivíduos com 18 (dezoito) anos de idade completos ou emancipados legalmente, com capacidade civil plena para celebração de actos jurídicos na República de Angola.
          </p>

          <h3 className="text-sm font-bold text-slate-900">2. Natureza das Recompensas em Kwanza (AOA)</h3>
          <p>
            As recompensas em Kwanza são incentivos promocionais decorrentes da conclusão com êxito de tarefas digitais reais (assistir a vídeos informativos, streaming de músicas licenciadas, partilhas autênticas e preenchimento de pesquisas de opinião de patrocinadores autorizados). Não constituem remuneração salarial nem garantia de investimento financeiro.
          </p>

          <h3 className="text-sm font-bold text-slate-900">3. Política Antifraude e Livro Razão Imutável</h3>
          <p>
            É estritamente proibida a utilização de bots, simuladores de cliques, múltiplas contas por utilizador, manipulação de tráfego ou scripts maliciosos. Qualquer tentativa de fraude resultará no bloqueio imediato da conta e estorno de valores obtidos de forma ilegítima. Todas as transacções financeiras são auditadas e registradas em livro razão imutável com PostgreSQL.
          </p>

          <h3 className="text-sm font-bold text-slate-900">4. Pagamentos via Multicaixa Express</h3>
          <p>
            Os pagamentos são processados mediante integração com serviços autorizados em Angola. A Angoepo Rewards nunca solicitará o PIN confidencial do cartão ou senhas de acesso bancário do cliente.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-slate-500 text-[11px]">
          Grupo Angoepo Digital Lda. • Luanda, Angola. Contato: legal@angoepo.ao
        </div>
      </div>
    </div>
  );
}
