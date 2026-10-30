// Supabase Client Initialization & Fallback Handler
// Pre-configured for PostgreSQL, Auth, and RLS

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Returns connection diagnostic status for UI/Admin overview.
 */
export function getDatabaseStatus(): {
  provider: 'SUPABASE_POSTGRESQL' | 'LOCAL_PERSISTENT_STORE';
  isLive: boolean;
  message: string;
} {
  if (isSupabaseConfigured) {
    return {
      provider: 'SUPABASE_POSTGRESQL',
      isLive: true,
      message: 'Conectado à instância de produção Supabase PostgreSQL.',
    };
  }
  return {
    provider: 'LOCAL_PERSISTENT_STORE',
    isLive: true,
    message: 'Operando em modo Sandbox reativo com armazenamento local imutável.',
  };
}
