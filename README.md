# Quote Calculator: Tidewater Cleaning Co.

A small web app for a (fictional) home-cleaning business. Customers pick a service, home size, extras and how often they want it cleaned, see the price update live, then send a quote request.

Built with plain HTML, CSS and JavaScript (no frameworks), accessible to WCAG 2.2 AA.

## Pricing rules

| Choice | Price |
|---|---|
| **Service** (pick one) | Standard clean $80 · Deep clean $140 · Move-out clean $200 |
| **Bedrooms** (1–6) | +$20 for each bedroom after the first |
| **Bathrooms** (1–4) | +$15 for each bathroom after the first |
| **Extras** (any) | Inside oven $25 · Inside fridge $20 · Interior windows $30 · Laundry $15 |
| **Frequency** (pick one) | One-off (no discount) · Fortnightly −10% · Weekly −15% |

Discount applies to the whole total. Example: deep clean, 3 bedrooms, 2 bathrooms, oven, weekly
= (140 + 40 + 15 + 25) × 0.85 = **$187.00**

## Build steps

- [x] **1. HTML structure:** the form, grouped with fieldsets, and a place to show the total
- [x] **2. CSS:** single-column layout, readable on phones, visible focus, dark mode
- [x] **3. JavaScript (calculate):** a function that reads the choices and returns the price
- [x] **4. JavaScript (live update):** recalculate whenever a choice changes
- [x] **5. Quote request:** name, email and preferred date, with friendly validation and a confirmation message
- [ ] **6. Test and publish:** keyboard, NVDA, Lighthouse/axe, mobile; publish on GitHub Pages; add to Upwork portfolio

## How it works

- `script.js` keeps every price in one `PRICING` object, and `calculateQuote()` is a pure function that works in cents to avoid rounding errors.
- The total is an `<output>` element, so screen readers announce the new price when it changes.
- Errors appear only after the customer has interacted with a field (`:user-invalid`), and `aria-invalid` is kept in sync for screen readers.
- After a successful request, focus moves to the confirmation heading.

## Running locally

No build step. Serve the folder with any static server, for example:

```bash
npx http-server quote-calculator -p 5173
```

Opening `index.html` directly also works in most browsers.
