'use client';

import React from 'react';
import { Shield, Lock, Award, Heart, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenPage: (page: string) => void;
}

export function Footer({ onOpenPage }: FooterProps) {
  return (
    <footer className="bg-[#070d1e] text-slate-400 border-t border-slate-800 text-xs mt-auto">
      {/* Security & Partner Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/50 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">100% Legal & Regulado</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Conforme a legislação da República de Angola
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">Multicaixa Express</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Levantamentos rápidos directamente para o seu telemóvel
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">Livro Razão Imutável</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Transacções auditadas com PostgreSQL e RLS
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">Música & Mídia Licenciada</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Respeito integral aos direitos autorais em Angola
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white text-sm">
                AR
              </div>
              <span className="font-black text-base text-white tracking-tight">
                ANGOEPO <span className="text-emerald-400">REWARDS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A maior e mais segura plataforma de remuneração por actividades digitais de Angola. Assista, participe, partilhe e receba os seus ganhos em Kwanza (AOA) via Multicaixa Express.
            </p>
            <div className="text-[11px] text-slate-500">
              Operado pelo Grupo Angoepo Digital Lda. | NIF: 5418902319 | Luanda, Angola.
            </div>
          </div>

          {/* Col 2: Plataforma */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPage('rewards')}
                  className="hover:text-emerald-400 transition"
                >
                  Ganhar Recompensas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('withdrawals')}
                  className="hover:text-emerald-400 transition"
                >
                  Levantamento Multicaixa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('wallet')}
                  className="hover:text-emerald-400 transition"
                >
                  Carteira Digital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('referrals')}
                  className="hover:text-emerald-400 transition"
                >
                  Programa de Convites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ajuda & Institucional */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Informações
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPage('how_it_works')}
                  className="hover:text-emerald-400 transition"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('faq')}
                  className="hover:text-emerald-400 transition"
                >
                  Perguntas Frequentes (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('support')}
                  className="hover:text-emerald-400 transition"
                >
                  Apoio ao Cliente
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('contacts')}
                  className="hover:text-emerald-400 transition"
                >
                  Contactos em Luanda
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Conformidade Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal & Segurança
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPage('terms')}
                  className="hover:text-emerald-400 transition"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('privacy')}
                  className="hover:text-emerald-400 transition"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('compliance')}
                  className="hover:text-emerald-400 transition"
                >
                  Política Antifraude & 18+
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('copyright')}
                  className="hover:text-emerald-400 transition"
                >
                  Licenciamento de Mídia
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Angoepo Rewards. Todos os direitos reservados. Feito com orgulho para Angola.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido para Web & Android PWA</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Moeda: Kwanza (AOA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
