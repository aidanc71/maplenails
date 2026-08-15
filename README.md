# MapleNails

## Milestone 1 — done
React (Vite) + Tailwind scaffold. Your header/nav/footer are now shared components
instead of copy-pasted per HTML file, products live in one data file, and the cart
uses React context (persisted to localStorage) instead of a per-page `let bag = []`.

## Run it locally
```bash
npm install
npm run dev
```
Then open the URL it prints (usually http://localhost:5173).

## Project structure
```
src/
  components/   Header, Footer, Layout, ProductCard
  context/      CartContext (shared cart state)
  data/         products.js — add a product object here, it shows up everywhere
  pages/        Home, ProductPage, Cart
```

## Adding a product
Open `src/data/products.js` and add an object to the `products` array. No new
HTML/JSX file needed — the homepage grid and the `/product/:id` page pick it up
automatically.

## Roadmap
- [x] Milestone 1 — Project scaffold, ported design to React
- [x] Milestone 2 — Filters (style/price) on the homepage, 6 placeholder products
- [x] Milestone 3 — Cart quantities, merged line items, shipping/subtotal summary
- [ ] Milestone 4 — Express + Postgres backend (real product/order storage)
- [ ] Milestone 5 — Stripe Checkout (real payments)
- [ ] Milestone 6 — Deploy (Vercel/Netlify + Render/Railway)
