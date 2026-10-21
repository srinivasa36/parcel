# Parcel – React + Firebase storefront

A polished, responsive e-commerce site with almost no backend code to write.

- **Frontend:** React 18 (JavaScript), Vite, Tailwind CSS v4, React Router
- **Backend:** Firebase – *Authentication* (email/password + Google) and *Firestore* (carts, wishlists, orders)
- **Products:** the public [DummyJSON](https://dummyjson.com) API, loaded straight from the browser

There is no server to run or deploy. `npm run dev` is all you need.

## 1. Run it

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Browsing, search, filters, wishlist and a guest bag work immediately, **before** you add Firebase.
Sign-in and placing orders need the Firebase setup below.

## 2. Set up Firebase (about 5 minutes)

1. Go to https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started**. Enable **Email/Password** and **Google**.
3. **Build → Firestore Database → Create database** (start in production mode, pick any region).
4. In Firestore, open the **Rules** tab and paste the contents of `firestore.rules`, then **Publish**.
5. **Project settings (gear icon) → Your apps → Web (`</>`)**. Register an app and copy the config values.
6. Copy `.env.example` to `.env` and paste the values:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
7. Restart `npm run dev`.

Firebase's web config is not a secret. Your security comes from the Firestore rules in step 4.

## Features

| Area | Details |
|------|---------|
| Browse | Home with hero, category tiles, deals row, top rated; shop page with category / price / rating / stock filters, 6 sort orders, pagination. All state lives in the URL, so every view is shareable |
| Search | Instant suggestions as you type, full results page |
| Product page | Gallery with thumbnails, savings badge, stock status, quantity, wishlist, delivery & returns info, specs, reviews, related products, sticky add-to-bag bar on mobile |
| Bag | Slide-out drawer after every add, full bag page, free-delivery progress bar, discount codes |
| Checkout | Contact, address (remembered for next time), delivery method, payment (card UI is a demo, cash on delivery) |
| Account | Email/password and Google sign-in, password reset, order history with a status tracker, wishlist |
| Guests | A bag and wishlist saved in the browser are merged into your account when you sign in |

Discount codes to try: `WELCOME10` (10% off), `FREESHIP` (free standard delivery).

## How the data is stored

| Data | Where |
|------|-------|
| Products, categories | DummyJSON (read-only, fetched once and cached in memory) |
| Bag and wishlist | `localStorage` for guests, `users/{uid}` in Firestore when signed in. Only product ids and quantities are saved; prices are always read from the live catalog |
| Orders | `orders/{id}` in Firestore, with a snapshot of items and prices. Rules let you create and read only your own |

## Project structure

```
src/
  config/        site settings (tax, shipping, sort options) and Firebase init
  api/           catalog.js – the only file that talks to DummyJSON
  services/      orders.js – Firestore reads/writes for orders
  context/       Auth, Catalog, Cart, Wishlist, UI (drawers), Toast
  hooks/         usePersistedField (guest ↔ Firestore sync), useFetch, useDocumentTitle
  utils/         filtering/search, pricing + coupons, formatting, validators
  components/
    ui/          Button, Input, Select, Drawer, Accordion, Rating, Price, Pagination ...
    layout/      Header, search box, category nav, footer, mobile menu
    product/     ProductCard, ProductGrid, ProductRow, gallery, filters, reviews
    cart/        cart drawer, cart line, order summary, coupon form
    checkout/    radio cards, card fields
    auth/        protected route, auth layout, Google button
  pages/         one file per route
```

## Design system

- **Type:** *Fraunces* (soft, high-contrast serif) for headlines, *Hanken Grotesk* for product names, prices and UI.
  The scale lives in `src/index.css` as `.display`, `.title`, `.heading`, `.lede` and `.caption`, so changing the look of the whole site is a one-file edit.
- **Colour:** near-black ink, soft grey surfaces and a single ultramarine accent. Sale prices use red. All tokens are defined in the `@theme` block of `src/index.css`.
- **Behaviour:** mobile-first layouts, visible focus states, reduced-motion support, and keyboard-friendly drawers and accordions.

## Things to know

- The card form is a **demo**. No payment is taken and card details are never stored or sent. To take real payments you will need a server (for example Stripe Checkout with a Cloud Function).
- Prices and order totals are calculated in the browser. That is fine for a portfolio or learning project, but a real shop should recalculate totals on a server before charging.
- Orders are sorted in the browser, so no Firestore index is required.
- Currency, tax rate, shipping fees and the free-delivery threshold are in `src/config/site.js`.
- Deploy with `npm run build` and host the `dist` folder on Firebase Hosting, Netlify or Vercel. Add your live domain under **Authentication → Settings → Authorized domains**.
