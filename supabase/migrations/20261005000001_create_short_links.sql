-- ============================================================================
-- Migration: 20261005000001_create_short_links
-- 短網址功能（URL Shortener）主資料表
--
-- 只「新增」資料表，不修改既有的 clicks 或任何其他資料表。
-- 執行方式（擇一）：
--   A. Supabase Dashboard → SQL Editor → 貼上整份 → Run
--   B. npx supabase db push（已用 supabase link 綁定專案時）
--
-- 安全設計：
--   - 開啟 RLS 且「不建立任何 policy」→ anon / authenticated 角色完全無法讀寫。
--   - 只有 server 端使用 SUPABASE_SERVICE_ROLE_KEY（service_role 會略過 RLS）才能存取。
--   - created_at / expires_at 由資料庫時間 now() 產生，不信任 client 時間。
-- ============================================================================

create table if not exists public.short_links (
  id                 bigint generated always as identity primary key,
  short_code         text        not null,
  original_url       text        not null,
  password_hash      text,                      -- null = 沒有設定密碼
  delete_token_hash  text        not null,      -- SHA-256(delete token) hex，不存明文
  created_at         timestamptz not null default now(),
  expires_at         timestamptz not null default (now() + interval '30 days'),

  constraint short_links_short_code_format
    check (short_code ~ '^[A-Za-z0-9]{7}$'),
  constraint short_links_original_url_scheme
    check (original_url ~* '^https?://'),
  constraint short_links_original_url_length
    check (char_length(original_url) <= 2048),
  constraint short_links_password_hash_format
    check (password_hash is null or password_hash like 'scrypt$%'),
  constraint short_links_delete_token_hash_format
    check (delete_token_hash ~ '^[0-9a-f]{64}$'),
  constraint short_links_expires_after_created
    check (expires_at > created_at)
);

-- short_code 唯一（大小寫敏感，Ab3xK9 與 ab3xk9 是不同代碼）
create unique index if not exists short_links_short_code_key
  on public.short_links (short_code);

-- 用 delete token hash 查找要刪除的那一筆
create unique index if not exists short_links_delete_token_hash_key
  on public.short_links (delete_token_hash);

-- 方便日後清理過期資料
create index if not exists short_links_expires_at_idx
  on public.short_links (expires_at);

alter table public.short_links enable row level security;

-- Supabase 預設會把 public schema 新表的權限給 anon / authenticated，這裡收回。
revoke all on table public.short_links from anon, authenticated;
grant select, insert, delete on table public.short_links to service_role;

comment on table public.short_links is
  'URL shortener links. Server-only access via service_role. Links expire 30 days after creation.';
