# IBM Client Vantage – AEP IBM (React SPA Recreation)

A standalone React 18 single-page application recreating the visual experience and functionality
of the IBM Client Vantage AEP IBM partner portal.

> **Note:** This is a UI/UX recreation for personal/internal development purposes only.
> It uses entirely mock/local data. No IBM systems are accessed or bypassed.

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

---

## Install

```bash
npm install
```

---

## Run (development)

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Build (production)

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

---

## Routes

| URL | Page |
|---|---|
| `/home` | Home (hero, quick links, resources, events) |
| `/portfolios` | Portfolios (filterable card grid + nav dropdown) |
| `/projects` | Projects (status-filtered card grid) |
| `/ibm-holidays` | IBM Holidays 2025 (month-grouped table) |
| `/partnership` | Partnership programme (benefits + CTA) |
| `/ibm-cics` | IBM CICs (description + resources + contact) |
| `/search?q=...` | Search (full-text filter + type chips) |

Any unknown URL redirects to `/home`.

---

## Architecture

```
src/
├── assets/icons/           SVG icons (Carbon icon paths)
├── assets/images/          Hero image placeholder
├── components/
│   ├── layout/
│   │   ├── TopBar/         Fixed utility bar (IBM branding, search, user menu)
│   │   ├── NavTabs/        Fixed tab navigation bar (AEP IBM + 6 tabs)
│   │   └── Footer/         Dark footer with links and copyright
│   └── shared/
│       ├── ContentCard/    Reusable content card component
│       ├── TagChip/        Pill tag with color variants
│       └── SectionHeader/  Section title + "View all" link
├── context/
│   └── ContentContext.tsx  Global state (cards, bookmarks, events, etc.)
├── data/                   Static TypeScript mock data arrays
├── models/                 TypeScript interfaces
├── pages/
│   ├── Home/               Home page + Hero, WelcomeSection, QuickLinks, FeaturedResources, EventsPreview
│   ├── Portfolios/         Portfolios page
│   ├── Projects/           Projects page
│   ├── IbmHolidays/        IBM Holidays page
│   ├── Partnership/        Partnership page
│   ├── IbmCics/            IBM CICs page
│   └── Search/             Search page
├── styles/
│   ├── _tokens.scss        CSS custom properties (design tokens)
│   ├── _reset.scss         Browser normalisation
│   └── global.scss         IBM Plex Sans + tokens + reset
├── App.tsx                 Router + layout shell
└── main.tsx                Entry point
```

---

## Design System

Recreates IBM Carbon Design System visual language:

- **Font:** IBM Plex Sans (300 / 400 / 600)
- **Active tab:** Purple `#6929c4` bottom border underline
- **IBM Blue:** `#0f62fe` for links and buttons
- **Top bar:** Light gray `#f4f4f4`
- **Nav tabs:** White `#ffffff`
- **Cards:** Sharp corners (no border-radius), `#e0e0e0` border, hover shadow
- **Spacing:** Carbon 8px-base scale
