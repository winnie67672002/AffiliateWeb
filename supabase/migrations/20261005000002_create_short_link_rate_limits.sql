-- ============================================================================
-- Migration: 20261005000002_create_short_link_rate_limits
-- 短網址 API 的 rate limit（固定時間窗計數器）
--
-- 為什麼放在資料庫：
--   專案部署在 Vercel serverless，多個 instance 之間不共享記憶體，
--   process 內的 Map 擋不住暴力破解。專案沒有 KV / Redis，
--   既有的 Supabase 是唯一可共享的狀態，所以沿用它。
--
-- bucket_key 內容：
--   "<action>:ip:<HMAC-SHA256(IP)>" 或 "unlock:code:<short_code>"
--   IP 只以「加密金鑰 HMAC 後的雜湊」形式存在，不存明文 IP，
--   且 1 天後會被自動清掉。用途僅限 rate limit。
-- ============================================================================

create table if not exists public.short_link_rate_limits (
  bucket_key    text        primary key,
  window_start  timestamptz not null default now(),
  hit_count     integer     not null default 0,
  constraint short_link_rate_limits_key_length check (char_length(bucket_key) <= 200)
);

create index if not exists short_link_rate_limits_window_start_idx
  on public.short_link_rate_limits (window_start);

alter table public.short_link_rate_limits enable row level security;
revoke all on table public.short_link_rate_limits from anon, authenticated;
grant select, insert, update, delete on table public.short_link_rate_limits to service_role;

-- ----------------------------------------------------------------------------
-- 記錄一次請求，回傳 true = 允許、false = 超過上限。
-- 原子操作（INSERT ... ON CONFLICT），多個 serverless instance 同時呼叫也正確。
-- ----------------------------------------------------------------------------
create or replace function public.short_link_rate_limit_hit(
  p_bucket_key     text,
  p_window_seconds integer,
  p_max_hits       integer
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_bucket_key is null or char_length(p_bucket_key) > 200
     or p_window_seconds is null or p_window_seconds <= 0
     or p_max_hits is null or p_max_hits <= 0 then
    raise exception 'invalid rate limit arguments';
  end if;

  insert into public.short_link_rate_limits as r (bucket_key, window_start, hit_count)
  values (p_bucket_key, now(), 1)
  on conflict (bucket_key) do update
    set hit_count = case
          when r.window_start <= now() - make_interval(secs => p_window_seconds) then 1
          else r.hit_count + 1
        end,
        window_start = case
          when r.window_start <= now() - make_interval(secs => p_window_seconds) then now()
          else r.window_start
        end
  returning hit_count into v_count;

  -- 約 1% 的呼叫順手清掉一天以前的計數器，避免表無限長大
  if random() < 0.01 then
    delete from public.short_link_rate_limits
    where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_max_hits;
end;
$$;

revoke all on function public.short_link_rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.short_link_rate_limit_hit(text, integer, integer) to service_role;
