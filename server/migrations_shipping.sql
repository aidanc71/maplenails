-- Run this in the Supabase SQL Editor (after migrations_milestone5.sql).

alter table orders
  add column if not exists shipping_address jsonb;
