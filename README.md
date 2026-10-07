# DCRAFTCART

A premium React single-page product configurator for custom sneakers. Users can design a pair, see an immediate derived price, save it to a persistent cart, and walk through a validated client-side checkout.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Highlights

- Data-driven base color, material, sole, lace, hardware, and add-on choices
- CSS/SVG sneaker visual with live configuration updates; no copyrighted assets
- Cart and in-progress checkout persisted in localStorage
- Responsive navigation, cart drawer, design studio, assistant and checkout
- Accessible controls, labels, focus states, validation messages, reduced-motion support
- D-CraftBot: a local keyword-based assistant designed to be replaced with a secure backend AI integration later

## Architecture

`src/data` contains product data, `src/utils` contains pure pricing and validation logic, `src/hooks` contains safe persistent state, and `src/components` contains focused UI pieces. `App.jsx` owns page-level coordination. Prices are derived with `priceFor()` rather than stored in state.

No environment variables are required. Checkout and the assistant are intentionally client-side demonstrations; no payment, fulfillment, or external AI request is made.
