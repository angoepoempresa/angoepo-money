'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Profile } from '@/lib/types';
import { isValidAngolanPhone, formatAngolanPhone } from '@/lib/finance-engine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: Profile) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('manuel.pedro@angoepo.ao');
  const [loginPassword, setLoginPassword] = useState('Angola2026!');

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');
  const [regAgeAccepted, setRegAgeAccepted] = useState(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);

  // Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Error / Success state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate real auth check
      if (!loginEmail || !loginPassword) {
        setError('Por favor, preencha o e-mail/telefone e a palavra-passe.');
        return;
      }

      const mockLoggedUser: Profile = {
        id: 'usr_manuel_001',
        fullName: 'Manuel Domingos Pedro',
        username: 'manuel_angola',
        phoneNumber: '+244 923 884 102',
        email: loginEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        age: 26,
        status: 'active',
        invitationCode: 'ANGO-PEDRO24',
        role: 'user',
        createdAt: '2026-08-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
      };

      onAuthSuccess(mockLoggedUser);
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim() || regFullName.trim().length < 3) {
      setError('Por favor, informe o seu nome completo.');
      return;
    }

    if (!regUsername.trim()) {
      setError('Por favor, escolha um nome de utilizador.');
      return;
    }

    if (!isValidAngolanPhone(regPhone)) {
      setError('Número de telefone angolano inválido. Exemplo: 923 884 102 ou +244 923 884 102.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (regPassword.length < 6) {
      setError('A palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    if (!regAgeAccepted) {
      setError('É obrigatório ter pelo menos 18 anos de idade para se cadastrar na Angoepo Rewards.');
      return;
    }

    if (!regTermsAccepted) {
      setError('Deve aceitar os Termos de Utilização e a Política de Privacidade.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: Profile = {
        id: `usr_${Date.now()}`,
        fullName: regFullName,
        username: regUsername.toLowerCase().trim(),
        phoneNumber: formatAngolanPhone(regPhone),
        email: regEmail.toLowerCase().trim(),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        age: 21,
        status: 'active',
        invitationCode: `ANGO-${regUsername.slice(0, 4).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`,
        invitedBy: regInviteCode.trim() || undefined,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAuthSuccess(newUser);
      onClose();
    }, 800);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setError('Insira um e-mail válido para recuperação.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecoverySent(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-900/40 mb-3">
            AR
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login' && 'Entrar na Angoepo Rewards'}
            {mode === 'register' && 'Criar Conta Gratuita'}
            {mode === 'recovery' && 'Recuperar Palavra-passe'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Aceda à sua carteira em Kwanza e continue a ganhar.'}
            {mode === 'register' && 'Registe-se em 1 minuto e comece a ganhar Kz hoje.'}
            {mode === 'recovery' && 'Enviaremos um link de recuperação para o seu e-mail.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                E-mail ou Telefone Multicaixa
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ex: manuel@angoepo.ao ou 923 884 102"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('recovery');
                  }}
                  className="text-[11px] text-blue-400 hover:text-blue-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/50 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'A validar sessão...' : 'Entrar na Plataforma'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="pt-3 text-center text-xs text-slate-400">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Criar conta gratuita
              </button>
            </div>
          </form>
        )}

        {/* --- REGISTER FORM --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Ex: João Baptista Silva"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome de Utilizador</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="joao_ao"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone Angolano</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="923 000 000"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="joao@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Palavra-passe</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mín. 6 caracteres"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Código de Convite (Opcional)
              </label>
              <input
                type="text"
                value={regInviteCode}
                onChange={(e) => setRegInviteCode(e.target.value.toUpperCase())}
                placeholder="Ex: ANGO-PEDRO24"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Checkboxes for 18+ and Terms */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={regAgeAccepted}
                  onChange={(e) => setRegAgeAccepted(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>
                  Declaro que tenho <strong>18 anos de idade ou mais</strong>, conforme exigido para a recepção de valores em Kwanza.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={regTermsAccepted}
                  onChange={(e) => setRegTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>
                  Aceito os <strong>Termos e Condições</strong> e a <strong>Política de Privacidade</strong> da Angoepo Rewards.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/50 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
            >
              {loading ? 'A registar conta...' : 'Concluir Cadastro Gratuito'}
              {!loading && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <div className="text-center text-xs text-slate-400 pt-2">
              Já possui conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-blue-400 font-bold hover:underline"
              >
                Entrar
              </button>
            </div>
          </form>
        )}

        {/* --- RECOVERY FORM --- */}
        {mode === 'recovery' && (
          <div className="space-y-4">
            {recoverySent ? (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Instruções Enviadas!</h4>
                <p className="text-xs text-slate-300">
                  Enviámos um link com instruções para redefinir a sua palavra-passe para{' '}
                  <span className="font-semibold text-emerald-400">{recoveryEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRecoverySent(false);
                    setMode('login');
                  }}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail Registado
                  </label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="seuemail@angoepo.ao"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  {loading ? 'A enviar...' : 'Enviar Link de Recuperação'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode('login');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Voltar ao ecrã de login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
