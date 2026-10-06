-- ============================================================================
-- Rollback：移除短網址功能的資料庫物件
-- 只刪除本次新增的物件，不會動到 clicks 或其他既有資料表。
-- 注意：會永久刪除所有短網址資料。執行前請確認。
-- ============================================================================

drop function if exists public.short_link_rate_limit_hit(text, integer, integer);
drop table if exists public.short_link_rate_limits;
drop table if exists public.short_links;
