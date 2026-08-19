-- Run this in the Supabase SQL Editor after schema.sql (or if you already
-- ran schema.sql before Milestone 5, run just this file to update it).

alter table orders
  add column if not exists stripe_session_id text unique;

alter table orders
  alter column status set default 'pending';

-- 'pending' = checkout session created but payment not confirmed yet
-- 'paid'    = Stripe confirmed the payment; this is when the order becomes real
