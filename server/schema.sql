-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- to create the tables the backend expects.

create table if not exists products (
  id text primary key,
  name text not null,
  price numeric(10, 2) not null,
  style text not null,
  image text not null,
  thumbnails text[] not null default '{}',
  description text not null,
  sizes text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Orders belong to a Supabase Auth user (auth.users is managed by Supabase
-- automatically once someone signs up).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  status text not null default 'pending', -- pending | paid | shipped | cancelled
  stripe_session_id text unique,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  product_name text not null, -- snapshot at time of purchase
  price numeric(10, 2) not null, -- snapshot at time of purchase
  size text not null,
  quantity integer not null check (quantity > 0)
);

-- Row Level Security: users can only see their own orders.
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Products are public to read; writes only happen from the backend via the
-- direct DATABASE_URL connection, which bypasses RLS.
alter table products enable row level security;

create policy "Anyone can view products"
  on products for select
  using (true);
