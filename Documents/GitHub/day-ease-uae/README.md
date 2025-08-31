DayEase UAE — Offline Helper PWA (MVP)

Overview
- Mobile-first PWA built with vanilla HTML/CSS/JS (no backend).
- Bilingual Arabic/English toggle, offline caching, localStorage state.
- Modules: Parking Genius, Nol Second-Tap Guard, Salik Shield, Address & Delivery Fix, Clean Cashless Tipping, Onboarding Concierge.

Run locally
1) From this folder run a static server (service worker needs http/localhost):
   - Python: python3 -m http.server 5173
   - Node (if installed): npx serve -l 5173
2) Open http://localhost:5173

Files
- index.html — app shell and navigation
- style.css — accessible, mobile-first styles
- app.js — SPA router, i18n, and all modules
- sw.js — service worker for offline cache
- manifest.webmanifest — PWA manifest

Data & deep links (stubs)
- WhatsApp Mahboub (Dubai): 971588009090
- SMS Parking: 7275
- RTA/Nol pages linked in Nol Guard
- Salik Top-up and FAQ linked in Salik Shield
- what3words link format used when user provides words

Notes & limitations
- Parking renewal reminder uses Notifications API while app is active. Background scheduled notifications without a server are not guaranteed on the web.
- Tip QR uses a public QR image API; it requires network when rendering the QR. The tip link itself works offline once cached.
- No IDs or payment details are stored unless the user creates a tip link. Even then, data is encoded in the shared URL only; nothing is persisted remotely.

Test scenarios mapping
- Sharjah plate → Parking Genius: select SHJ, enter plate/zone, choose WhatsApp → 2 taps to open message. Start timer for renewal reminder.
- Nol top-up → Nol Guard: set top-up time, see checklist and countdown until synced.
- New plate → Salik Shield: URP note and warning selector for common routes; low balance warning.
- Share delivery card → Address: get location, optional what3words, bilingual note, share via system share.
- Staff tip QR → Tip: enter name/note, generate link & QR, payer opens link, selects amount and pays in bank app in under 10s.
- Tourist onboarding → Onboarding: eSIM 24h flow, bank approvals checklist and links.

