-- ============================================================================
-- ANGOEPO REWARDS - SUPABASE / POSTGRESQL PRODUCTION SCHEMA
-- Complete Schema, RLS Policies, Indexes, and Atomic Financial Procedures
-- Currency: Kwanza (AOA, Kz) | Multicaixa Express Integration Ready
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    phone_number TEXT NOT NULL, -- Angola +244 format
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '',
    age INTEGER NOT NULL CHECK (age >= 18),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    invitation_code TEXT UNIQUE NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'finance', 'support', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER ROLES (Separated for fine-grained role control)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'finance', 'support', 'super_admin')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. WALLETS (Strict Integer Accounting in Kwanza)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance_aoa BIGINT NOT NULL DEFAULT 0 CHECK (balance_aoa >= 0),
    pending_balance_aoa BIGINT NOT NULL DEFAULT 0 CHECK (pending_balance_aoa >= 0),
    points BIGINT NOT NULL DEFAULT 0 CHECK (points >= 0),
    total_earned_aoa BIGINT NOT NULL DEFAULT 0 CHECK (total_earned_aoa >= 0),
    total_withdrawn_aoa BIGINT NOT NULL DEFAULT 0 CHECK (total_withdrawn_aoa >= 0),
    total_bonus_aoa BIGINT NOT NULL DEFAULT 0 CHECK (total_bonus_aoa >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WALLET TRANSACTIONS (Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reward', 'bonus', 'referral', 'withdrawal_reserve', 'withdrawal_settle', 'withdrawal_refund', 'points_conversion')),
    amount_aoa BIGINT NOT NULL,
    points BIGINT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'rejected')),
    reference_code TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. REWARD TASKS
CREATE TABLE IF NOT EXISTS public.reward_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('video', 'music', 'share', 'daily', 'campaign')),
    reward_points INTEGER NOT NULL DEFAULT 0,
    reward_aoa BIGINT NOT NULL DEFAULT 0,
    min_duration_seconds INTEGER NOT NULL DEFAULT 30,
    daily_limit INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    budget_aoa BIGINT NOT NULL DEFAULT 100000,
    total_completions INTEGER NOT NULL DEFAULT 0,
    max_participants INTEGER DEFAULT NULL,
    instructions JSONB DEFAULT '[]'::jsonb,
    action_url TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    sponsor_name TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TASK COMPLETIONS
CREATE TABLE IF NOT EXISTS public.task_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.reward_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_points INTEGER NOT NULL DEFAULT 0,
    reward_aoa BIGINT NOT NULL DEFAULT 0,
    duration_watched_seconds INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'rejected')),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(task_id, user_id, created_at)
);

-- 7. VIDEOS
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    min_watch_seconds INTEGER NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 50,
    reward_aoa BIGINT NOT NULL DEFAULT 5,
    category TEXT NOT NULL DEFAULT 'Geral',
    thumbnail_url TEXT NOT NULL,
    views_count INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MUSIC TRACKS (Authorized Angolan & International Music)
CREATE TABLE IF NOT EXISTS public.music_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    genre TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    min_listen_seconds INTEGER NOT NULL,
    reward_points INTEGER NOT NULL DEFAULT 40,
    reward_aoa BIGINT NOT NULL DEFAULT 4,
    cover_art_url TEXT NOT NULL,
    preview_audio_url TEXT NOT NULL,
    plays_count INTEGER NOT NULL DEFAULT 0,
    license_details TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CAMPAIGNS (Sponsored Brand Campaigns)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    sponsor_name TEXT NOT NULL,
    sponsor_logo_url TEXT NOT NULL,
    description TEXT NOT NULL,
    total_budget_aoa BIGINT NOT NULL,
    remaining_budget_aoa BIGINT NOT NULL,
    reward_per_user_aoa BIGINT NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER NOT NULL DEFAULT 0,
    banner_url TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CAMPAIGN PARTICIPATIONS
CREATE TABLE IF NOT EXISTS public.campaign_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_aoa BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'rejected')),
    proof_url TEXT DEFAULT '',
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(campaign_id, user_id)
);

-- 11. REFERRALS (Invitation Relations)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code_used TEXT NOT NULL,
    reward_aoa BIGINT NOT NULL DEFAULT 250,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'rewarded')),
    qualified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(referrer_id, referee_id)
);

-- 12. WITHDRAWAL REQUESTS (Multicaixa Express)
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_aoa BIGINT NOT NULL CHECK (amount_aoa > 0),
    fee_aoa BIGINT NOT NULL DEFAULT 0 CHECK (fee_aoa >= 0),
    net_amount_aoa BIGINT NOT NULL CHECK (net_amount_aoa > 0),
    account_holder_name TEXT NOT NULL,
    mcx_phone_number TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'MULTICAIXA_EXPRESS',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'processing', 'paid', 'rejected', 'cancelled')),
    reference_code TEXT UNIQUE NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    admin_notes TEXT DEFAULT '',
    rejection_reason TEXT DEFAULT '',
    receipt_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PAYMENT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    withdrawal_id UUID NOT NULL REFERENCES public.withdrawal_requests(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'MULTICAIXA_EXPRESS',
    provider_tx_id TEXT DEFAULT '',
    amount_aoa BIGINT NOT NULL,
    status TEXT NOT NULL,
    raw_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. PAYMENT WEBHOOKS
CREATE TABLE IF NOT EXISTS public.payment_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    event_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    signature TEXT NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reward', 'withdrawal', 'referral', 'system', 'campaign')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    action_link TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('withdrawal', 'reward', 'account', 'technical', 'other')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'answered', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. SUPPORT MESSAGES
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'support', 'admin')),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value_json JSONB NOT NULL,
    description TEXT NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. FRAUD FLAGS
CREATE TABLE IF NOT EXISTS public.fraud_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_completions_user ON public.task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- ============================================================================
-- ATOMIC POSTGRESQL FUNCTIONS (IMMUTABLE LEDGER & BALANCE INTEGRITY)
-- ============================================================================

-- Function: Atomic Reward Crediting
CREATE OR REPLACE FUNCTION public.credit_task_reward(
    p_user_id UUID,
    p_task_id UUID,
    p_duration INTEGER,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_task RECORD;
    v_wallet RECORD;
    v_completion_id UUID;
    v_tx_id UUID;
    v_ref TEXT;
BEGIN
    SELECT * INTO v_task FROM public.reward_tasks WHERE id = p_task_id AND active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tarefa não encontrada ou inactiva.';
    END IF;

    IF p_duration < v_task.min_duration_seconds THEN
        RAISE EXCEPTION 'Duração mínima não atingida.';
    END IF;

    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Carteira do utilizador não encontrada.';
    END IF;

    v_ref := 'REW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 6);

    -- Update Wallet
    UPDATE public.wallets
    SET balance_aoa = balance_aoa + v_task.reward_aoa,
        points = points + v_task.reward_points,
        total_earned_aoa = total_earned_aoa + v_task.reward_aoa,
        updated_at = NOW()
    WHERE id = v_wallet.id;

    -- Record Task Completion
    INSERT INTO public.task_completions (task_id, user_id, reward_points, reward_aoa, duration_watched_seconds, status, metadata)
    VALUES (p_task_id, p_user_id, v_task.reward_points, v_task.reward_aoa, p_duration, 'completed', p_metadata)
    RETURNING id INTO v_completion_id;

    -- Record Ledger Transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount_aoa, points, status, reference_code, description, metadata)
    VALUES (v_wallet.id, p_user_id, 'reward', v_task.reward_aoa, v_task.reward_points, 'completed', v_ref, 'Recompensa de tarefa: ' || v_task.title, p_metadata)
    RETURNING id INTO v_tx_id;

    -- Send Notification
    INSERT INTO public.notifications (user_id, title, message, type, action_link)
    VALUES (p_user_id, 'Recompensa creditada!', 'Recebeu ' || v_task.reward_aoa || ' Kz e ' || v_task.reward_points || ' pontos pela conclusão de: ' || v_task.title, 'reward', '/carteira');

    RETURN jsonb_build_object(
        'success', TRUE,
        'reward_aoa', v_task.reward_aoa,
        'reward_points', v_task.reward_points,
        'reference_code', v_ref
    );
END;
$$;

-- Function: Atomic Withdrawal Balance Reservation
CREATE OR REPLACE FUNCTION public.reserve_withdrawal_request(
    p_user_id UUID,
    p_amount_aoa BIGINT,
    p_account_holder TEXT,
    p_mcx_phone TEXT,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet RECORD;
    v_ref TEXT;
    v_min_withdrawal BIGINT := 1000;
    v_request_id UUID;
BEGIN
    IF p_amount_aoa < v_min_withdrawal THEN
        RAISE EXCEPTION 'O valor mínimo para levantamento é de 1.000 Kz.';
    END IF;

    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Carteira não encontrada.';
    END IF;

    IF v_wallet.balance_aoa < p_amount_aoa THEN
        RAISE EXCEPTION 'Saldo disponível insuficiente para realizar o levantamento.';
    END IF;

    v_ref := 'MCX-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 6);

    -- Reserve balance
    UPDATE public.wallets
    SET balance_aoa = balance_aoa - p_amount_aoa,
        pending_balance_aoa = pending_balance_aoa + p_amount_aoa,
        updated_at = NOW()
    WHERE id = v_wallet.id;

    -- Create withdrawal request
    INSERT INTO public.withdrawal_requests (
        user_id, amount_aoa, fee_aoa, net_amount_aoa, account_holder_name, mcx_phone_number, payment_method, status, reference_code, idempotency_key
    )
    VALUES (
        p_user_id, p_amount_aoa, 0, p_amount_aoa, p_account_holder, p_mcx_phone, 'MULTICAIXA_EXPRESS', 'pending', v_ref, p_idempotency_key
    )
    RETURNING id INTO v_request_id;

    -- Record pending transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, user_id, type, amount_aoa, status, reference_code, description
    )
    VALUES (
        v_wallet.id, p_user_id, 'withdrawal_reserve', -p_amount_aoa, 'pending', v_ref, 'Reserva de saldo para levantamento Multicaixa Express #' || v_ref
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'request_id', v_request_id,
        'reference_code', v_ref
    );
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view own profile; Admins view all
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Wallets: Users can only read their own wallet
CREATE POLICY "Users read own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Users read own ledger
CREATE POLICY "Users read own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);

-- Content: Everyone can view active tasks, videos, music, campaigns
CREATE POLICY "Public view active tasks" ON public.reward_tasks FOR SELECT USING (active = TRUE);
CREATE POLICY "Public view active videos" ON public.videos FOR SELECT USING (active = TRUE);
CREATE POLICY "Public view active music" ON public.music_tracks FOR SELECT USING (active = TRUE);
CREATE POLICY "Public view active campaigns" ON public.campaigns FOR SELECT USING (active = TRUE);

-- Withdrawals: Users can view and insert their own requests
CREATE POLICY "Users view own withdrawals" ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert withdrawals" ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users manage own notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Support Tickets: Users view and create own tickets
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view ticket messages" ON public.support_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = support_messages.ticket_id AND user_id = auth.uid())
);
