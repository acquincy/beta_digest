-- Migration: update_users_preferences_columns
-- Adds send_time & last_sent_date, splits categories into news_categories & weather_categories, and drops categories on public.users

begin;

-- 1. Add send_time and last_sent_date columns
alter table public.users
  add column if not exists send_time text default '07:00',
  add column if not exists last_sent_date date;

-- 2. Add news_categories and weather_categories columns (matching existing jsonb structure)
alter table public.users
  add column if not exists news_categories jsonb default '[]'::jsonb,
  add column if not exists weather_categories jsonb default '[]'::jsonb;

-- 3. Backfill news_categories from existing categories column (normalizing any stringified json arrays) and drop categories
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'categories'
  ) then
    execute $sql$
      update public.users
      set news_categories = case
        when categories is null then '[]'::jsonb
        when jsonb_typeof(categories) = 'array' then categories
        when jsonb_typeof(categories) = 'string' and left(categories #>> '{}', 1) = '[' then (categories #>> '{}')::jsonb
        else '[]'::jsonb
      end
      where news_categories is null or news_categories = '[]'::jsonb
    $sql$;

    alter table public.users
      drop column categories;
  end if;
end
$$;

commit;
