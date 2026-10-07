# DCRAFTCART — Project explanation

## State and multi-step flow

The application is an SPA: React swaps views without a browser page reload. `App.jsx` holds the configuration, cart, shipping data, and selected view. Because the shipping data lives above the checkout form, moving away from the form does not erase it.

## Derived pricing

The total is deliberately **not** held in `useState`. `priceFor(config)` is a pure function: it starts with `$120`, then adds the selected options and add-ons. This prevents two competing sources of truth and means every visible price updates immediately from the configuration.

## Persistence and effects

`useLocalStorage` uses lazy state initialization to safely read saved JSON once. A `useEffect` writes the changed value back to localStorage. If JSON is malformed or storage is unavailable, it uses the given safe default instead. Cart, design, shipping information, and the current view all use this hook.

## Controlled form and validation

Each shipping input reads its value from React state and writes changes back through `onChange`; this is a controlled input. `validateShipping` is reusable and returns an object of field errors. It runs on blur and before submission, checks required values, email format, and a reasonable phone pattern, and renders inline accessible errors.

## Cart and customizations

Adding a pair creates a unique browser ID and stores a snapshot of the configuration plus its per-pair price. Quantity can change without losing that snapshot. This avoids incorrectly merging different custom pairs. The cart provides empty, remove, clear, quantity, and checkout states.

## Assistant, checkout, and UI states

D-CraftBot is a local fallback assistant using keyword matching, so it works with no API key. A real model should be called through a secure server, never directly with a frontend secret. Checkout waits approximately two seconds with its button disabled, then generates a demo order number and success screen. Empty cart, form error, processing, and success states are each explicit UI states.

## Components

`ProductPreview`, `Customizer`, and `CartDrawer` have focused responsibilities. Product options are rendered with `map()` from `productData.js`, avoiding repetitive JSX. CSS handles the responsive mobile/desktop layouts, keyboard focus, and `prefers-reduced-motion`.
