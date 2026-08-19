# MapleNails

## Milestone 5 — Stripe Checkout (current)
Clicking "Place Order" now redirects to a real Stripe-hosted checkout page.
Orders are only saved to the database after Stripe confirms payment
succeeded. Everything runs in Stripe **test mode**, so no real money moves.

## One-time setup

### 1. Create the database tables
In your Supabase project dashboard: **SQL Editor → New query**, paste the
contents of `server/schema.sql`, and click **Run**. This creates the
`products`, `orders`, and `order_items` tables.

If you already ran `schema.sql` before (from Milestone 4) and just need to
add the new `stripe_session_id` column, run `server/migrations_milestone5.sql`
instead — it only adds what's missing.

### 2. Configure the backend
```bash
cd server
npm install
copy .env.example .env
```
Open `server/.env` and fill in:
- `DATABASE_URL` — Settings → Database → Connect → **Session pooler** tab (not
  "Direct connection" — that one only resolves over IPv6 and fails on many
  home networks)
- `SUPABASE_URL` — Settings → Data API → Project URL (just the bare URL,
  nothing appended after `.co`)
- `SUPABASE_ANON_KEY` — Settings → API Keys → Legacy → anon public
- `STRIPE_SECRET_KEY` — Stripe Dashboard → Developers → API keys → Secret key
  (starts with `sk_test_`)
- `FRONTEND_URL` — leave as `http://localhost:5173` for local dev

Then seed the product catalog into the database:
```bash
npm run seed
```

### 3. Configure the frontend
Back in the project root:
```bash
copy .env.example .env
```
Open `.env` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (same
values as above, `VITE_API_URL` can stay as the default for local dev).

## Running it locally
Two terminals, same as before.

**Terminal 1 — backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — frontend:**
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`.

## Testing a real (fake) payment
On Stripe's checkout page, use one of Stripe's official test cards:
- Card number: `4242 4242 4242 4242`
- Expiry: any future date (e.g. `12/34`)
- CVC: any 3 digits (e.g. `123`)
- ZIP: any 5 digits

This will succeed and land you back on the order confirmation page. To test
a declined card instead, use `4000 0000 0000 0002`.

## Project structure
```
src/                React frontend
  components/       Header, Footer, Layout, ProductCard, FilterBar
  context/          CartContext (cart state), AuthContext (login state)
  lib/               api.js (talks to the backend), supabaseClient.js (auth)
  pages/            Home, ProductPage, Cart, Login, OrderConfirmation, ComingSoon
  data/products.js  No longer used by the app — kept only as a reference for
                     what got seeded into the database. Safe to ignore/delete.

server/             Express backend
  index.js          App entry point
  db.js             Postgres connection
  schema.sql         Run this once in Supabase's SQL editor
  migrations_milestone5.sql  Adds stripe_session_id to an existing database
  seed.js           Loads placeholder products into the database
  routes/
    products.js     Public product listing
    orders.js       Order history (read-only)
    checkout.js     Creates Stripe sessions, confirms payment, saves orders
  middleware/       requireAuth.js (verifies Supabase login tokens)
```

## Adding a product
Right now, add rows directly in Supabase: **Table Editor → products → Insert
row**. (A proper admin UI for this can be a future milestone.)

## Roadmap
- [x] Milestone 1 — Project scaffold, ported design to React
- [x] Milestone 2 — Filters (style/price) on the homepage, 6 placeholder products
- [x] Milestone 3 — Cart quantities, merged line items, shipping/subtotal summary
- [x] Milestone 4 — Express + Postgres backend, Supabase Auth accounts, real orders table
- [x] Milestone 5 — Stripe Checkout (test-mode real payments)
- [ ] Milestone 6 — Deploy (Vercel/Netlify + Render/Railway)

