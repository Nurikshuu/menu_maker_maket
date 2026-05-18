# Menumaker — Food Delivery Marketplace

ChatFood.ru-style food delivery platform built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Zustand**, and **shadcn/ui**.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (webpack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (radix-nova) |
| State | Zustand with `persist` middleware |
| Icons | lucide-react |
| Fonts | Inter (Google Fonts) |

---

## Project Structure

```
app/                        # Next.js App Router pages
  page.tsx                  # / — Homepage: hero + category filter + restaurant grid
  [city]/page.tsx           # /[city] — City-filtered restaurant list
  r/[slug]/page.tsx         # /r/[slug] — Restaurant menu page
  checkout/page.tsx         # /checkout — Order form + summary
  order/[id]/page.tsx       # /order/[id] — Confirmation + status stepper

components/
  ui/                       # Dumb reusable: Badge, Skeleton, Toast, Modal
  layout/                   # App shell: Header, Footer, CartDrawer, CitySelectModal
  restaurant/               # Domain: RestaurantCard, CategoryFilter, MenuItemCard
  checkout/                 # Domain: CheckoutForm, OrderSummary, DeliveryToggle, PromoInput

store/
  cart.store.ts             # Zustand cart slice (persisted to localStorage)
  ui.store.ts               # Zustand UI slice: drawer, city, toasts (persisted)

hooks/
  use-cart.ts               # Cart actions + toast/drawer side-effects
  use-restaurant.ts         # Fetch restaurant list with loading state
  use-order.ts              # Checkout form state, validation, order submission

services/
  restaurant.service.ts     # getRestaurants(), getRestaurantBySlug()
  order.service.ts          # placeOrder(), getOrderById()
  mock-data.ts              # Dev mock data (12 restaurants across 5 Kazakh cities)

types/                      # restaurant.types.ts, order.types.ts, cart.types.ts
constants/                  # delivery.constants.ts, routes.constants.ts
utils/                      # format-price.ts, validate-address.ts
```

---

## Key Features

- **Multi-restaurant cart** — add items from multiple restaurants in a single session; the cart groups items per restaurant with independent promo codes and totals
- **Cart persisted** to `localStorage` via Zustand `persist` middleware
- **Per-restaurant / per-category promo codes** — codes can be scoped to a specific restaurant slug, a category, or apply globally
- **Checkout flow**: delivery/pickup toggle, ASAP/scheduled time, cash/card payment
- **Order confirmation** with 5-step status stepper
- **Skeleton loaders** on all async content
- **Toast notifications** for add/remove/promo/order events
- **City selector** modal — 5 Kazakh cities (Астана, Алматы, Тараз, Шымкент, Қарағанды)
- **Prices in KZT** (tenge); stored as integers in tiyn (100 tiyn = 1 ₸)
- **Responsive grid**: 1 → 2 → 3 → 4 columns; sidebar hidden on mobile

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `--webpack` flag is set in scripts to work around a Turbopack panic
> caused by Cyrillic characters in the project path.

---

## Available Scripts

```bash
npm run dev      # Start dev server (webpack)
npm run build    # Production build (webpack)
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Promo Codes (dev)

| Code | Discount | Scope |
|---|---|---|
| `ALMATY15` | 15% | Global |
| `WELCOME10` | 10% | Global |
| `ASTANA20` | 20% | Global |
| `BURGER10` | 10% | Category: Burgers only |
| `SUSHI20` | 20% | Category: Sushi only |
| `PIZZA15` | 15% | Category: Pizza only |
| `LAGMAN10` | 10% | Restaurant: lagman-house only |
| `KHINKALI10` | 10% | Restaurant: khinkali-house only |

Category-scoped codes apply the discount only to items in the matching category within that restaurant's cart entry. Restaurant-scoped codes only work when ordering from the specific restaurant.

---

## Mock Data

12 restaurants across 5 Kazakh cities with full menus for 5 restaurants:

| City | Restaurants |
|---|---|
| Астана | Pizza House, Sushi Bar, Burger Joint, Green Bowl |
| Алматы | Khinkali House, Lagman House, Shawarma King |
| Тараз | Wok Asia, Plov House |
| Шымкент | Georgian Bistro, Korean BBQ |
| Қарағанды | Kebab Palace |

---

## Next Steps

- Replace `services/mock-data.ts` with real API calls via `NEXT_PUBLIC_API_URL`
- Add authentication (phone OTP flow)
- Add order history page
- Add map integration for delivery address


ChatFood.ru-style food delivery platform built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Zustand**, and **shadcn/ui**.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router (webpack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (radix-nova) |
| State | Zustand with `persist` middleware |
| Icons | lucide-react |
| Fonts | Inter (Google Fonts) |

---

## Project Structure

```
app/                        # Next.js App Router pages
  page.tsx                  # / — Homepage: hero + category filter + restaurant grid
  [city]/page.tsx           # /[city] — City-filtered restaurant list
  r/[slug]/page.tsx         # /r/[slug] — Restaurant menu page
  checkout/page.tsx         # /checkout — Order form + summary
  order/[id]/page.tsx       # /order/[id] — Confirmation + status stepper

components/
  ui/                       # Dumb reusable: Badge, Skeleton, Toast, Modal
  layout/                   # App shell: Header, Footer, CartDrawer, CitySelectModal
  restaurant/               # Domain: RestaurantCard, CategoryFilter, MenuItemCard, CartWarningModal
  checkout/                 # Domain: CheckoutForm, OrderSummary, DeliveryToggle, PromoInput

store/
  cart.store.ts             # Zustand cart slice (persisted to localStorage)
  ui.store.ts               # Zustand UI slice: drawer, city, toasts (persisted)

hooks/
  use-cart.ts               # Cart actions + toast/drawer side-effects
  use-restaurant.ts         # Fetch restaurant list with loading state
  use-order.ts              # Checkout form state, validation, order submission

services/
  restaurant.service.ts     # getRestaurants(), getRestaurantBySlug()
  order.service.ts          # placeOrder(), getOrderById()
  mock-data.ts              # Dev mock data (6 restaurants, full menus)

types/                      # restaurant.types.ts, order.types.ts, cart.types.ts
constants/                  # delivery.constants.ts, routes.constants.ts
utils/                      # format-price.ts, validate-address.ts
```

---

## Key Features

- **Per-restaurant cart** — adding items from a different restaurant triggers `CartWarningModal`
- **Cart persisted** to `localStorage` via Zustand `persist` middleware
- **Promo codes**: `FOOD10`, `WELCOME15`, `SAVE20`
- **Checkout flow**: delivery/pickup toggle, ASAP/scheduled time, cash/card/SBP payment
- **Order confirmation** with 5-step status stepper
- **Skeleton loaders** on all async content
- **Toast notifications** for add/remove/promo/order events
- **City selector** modal with localStorage persistence
- **Responsive grid**: 1 → 2 → 3 → 4 columns; sidebar hidden on mobile

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `--webpack` flag is set in scripts to work around a Turbopack panic
> caused by Cyrillic characters in the project path.

---

## Available Scripts

```bash
npm run dev      # Start dev server (webpack)
npm run build    # Production build (webpack)
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Promo Codes (dev)

| Code | Discount |
|---|---|
| `FOOD10` | 10% |
| `WELCOME15` | 15% |
| `SAVE20` | 20% |

---

## Next Steps

- Replace `services/mock-data.ts` with real API calls via `NEXT_PUBLIC_API_URL`
- Add authentication (phone OTP flow)
- Add order history page
- Add map integration for delivery address

