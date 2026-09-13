-- 在 Supabase SQL Editor 執行一次，讓新版 city_uploader.js 可以寫入新欄位。
alter table public.cities
  add column if not exists infiltration text,
  add column if not exists penetration_value integer,
  add column if not exists king_id bigint,
  add column if not exists king_name text,
  add column if not exists workstation_remaining_seconds integer,
  add column if not exists workstation_details text;