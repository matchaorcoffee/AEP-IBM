# IBM Client Vantage – AEP IBM React SPA Recreation Plan

## Top-Level Overview

Recreate the **IBM Client Vantage – AEP IBM** portal as a standalone React SPA.
The app boots directly to the authenticated Home experience (no login screen).
It uses React 18, React Router v6, plain CSS Modules (SCSS), and IBM Carbon design tokens
implemented as CSS custom properties — no heavy UI framework, no Carbon React package.
The result is a lightweight, fast SPA that runs locally via `npm run dev`.

### Tech Stack
| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 (Vite scaffold) | Lightweight, fast HMR, minimal boilerplate |
| Routing | React Router v6 | Standard, code-split ready |
| Styling | CSS Modules + global SCSS tokens | Zero runtime CSS-in-JS cost |
| Icons | Inline SVG files in `src/assets/icons/` | No npm icon package needed |
| State | React `useState` / `useContext` | No Redux needed for this scope |
| Mock data | TypeScript `.ts` data files | Easy to swap for API later |
| Build | Vite | Fast dev server, small bundles |

### Key Visual Reference (from screenshot)
The reference site uses a **two-row horizontal header** with a **horizontal tab navigation bar** —
NOT a left sidebar. The header is light/white in tone, not IBM Blue.

| Element | Observed Detail |
|---|---|
| Top utility row | Light gray `#f4f4f4` bg, IBM Client Vantage branding with circular icon, right icons: Search, Heart, Share, Chat, Calendar-badge, Bell, User avatar |
| Nav tab row | White bg, "AEP IBM" label with red flag emblem on left, then tabs: **Home · Portfolios ▾ · Projects · IBM Holidays · Partnership · IBM CICs** |
| Active tab indicator | **Purple bottom border** `3px solid #6929c4` on current tab |
| Hero | Full-width **cityscape photograph** — no blue gradient |

---

## Architecture Overview

```
App (main.tsx)
├── <TopBar />          ← fixed utility row, light gray, IBM branding + icon buttons
├── <NavTabs />         ← fixed tab row, white, AEP IBM label + 6 nav tabs with active purple underline
└── <Routes>            ← main content, padding-top: 96px (two header rows)
    ├── /           → redirect → /home
    ├── /home       → <HomePage />
    ├── /portfolios → <PortfoliosPage />
    ├── /projects   → <ProjectsPage />
    ├── /ibm-holidays → <IbmHolidaysPage />
    ├── /partnership → <PartnershipPage />
    └── /ibm-cics   → <IbmCicsPage />
```

> **No sidebar.** Navigation is entirely horizontal via the tab bar.

```
src/
├── assets/
│   ├── icons/          ← inline SVG icon files
│   └── images/         ← hero-cityscape.jpg (or gradient fallback)
├── components/
│   ├── layout/
│   │   ├── TopBar/
│   │   └── NavTabs/
│   └── shared/
│       ├── ContentCard/
│       ├── TagChip/
│       └── SectionHeader/
├── pages/
│   ├── Home/
│   │   ├── components/
│   │   │   ├── Hero/
│   │   │   ├── WelcomeSection/
│   │   │   ├── QuickLinks/
│   │   │   ├── FeaturedResources/
│   │   │   └── EventsPreview/
│   │   └── HomePage.tsx
│   ├── Portfolios/
│   ├── Projects/
│   ├── IbmHolidays/
│   ├── Partnership/
│   └── IbmCics/
├── data/
│   ├── mock-content.ts
│   ├── mock-events.ts
│   ├── mock-portfolios.ts
│   ├── mock-holidays.ts
│   └── mock-quick-links.ts
├── models/
│   ├── ContentCard.ts
│   ├── Event.ts
│   ├── Portfolio.ts
│   └── Holiday.ts
├── context/
│   └── ContentContext.tsx  ← bookmark state, search state
├── styles/
│   ├── _tokens.scss        ← CSS custom properties (design tokens)
│   ├── _reset.scss         ← browser normalisation
│   └── global.scss         ← imports tokens + reset + Google Fonts
├── App.tsx
├── main.tsx
└── vite.config.ts
```

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffold & Design Tokens

**Status:** `[ ] pending`

**Intent**
Bootstrap a Vite + React + TypeScript project in the current workspace directory, configure SCSS,
set up IBM Plex Sans via Google Fonts, and establish global CSS custom property token files that
every component imports. No visible UI yet — just a clean blank app at `localhost:5173`.

**Expected Outcomes**
- `package.json`, `vite.config.ts`, `tsconfig.json` present; `npm run dev` starts with no errors.
- `src/styles/_tokens.scss` defines all CSS custom properties for colors, spacing, layout, typography.
- `src/styles/_reset.scss` normalises browser defaults.
- `src/styles/global.scss` imports Google Fonts (IBM Plex Sans 300/400/600) + tokens + reset.
- `src/main.tsx` imports `global.scss`.
- App renders a blank white page at `localhost:5173`.

**Todo List**
1. Scaffold project: `npm create vite@latest . -- --template react-ts` (or create files manually).
   Dependencies to install: `react`, `react-dom`, `react-router-dom`, `sass`.
   Dev dependencies: `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`.
2. Create `src/styles/_tokens.scss` with CSS custom properties:
   ```
   --top-bar-height: 48px
   --nav-tabs-height: 48px
   --header-total-height: 96px
   --color-top-bar-bg: #f4f4f4
   --color-nav-tabs-bg: #ffffff
   --color-active-tab: #6929c4        (purple active tab underline)
   --color-active-tab-dark: #491d8b
   --color-brand-blue: #0f62fe
   --color-page-bg: #f4f4f4
   --color-card-bg: #ffffff
   --color-text-primary: #161616
   --color-text-secondary: #525252
   --color-text-link: #0f62fe
   --color-border: #e0e0e0
   --color-hover: #e8e8e8
   --color-aep-emblem: #da1e28        (red AEP IBM badge)
   --color-success: #198038
   --color-focus: #0f62fe
   --spacing-01 … --spacing-10        (2px → 64px Carbon scale)
   --font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif
   --font-size-base: 16px
   --font-size-sm: 14px
   --font-size-xs: 12px
   --font-size-h1: 42px
   --font-size-h2: 28px
   --font-size-h3: 20px
   --transition-fast: 110ms ease
   --transition-medium: 200ms ease
   ```
3. Create `src/styles/_reset.scss`: `box-sizing: border-box` on `*`, margin/padding 0, remove
   list styles, `font-family: var(--font-family)` on `body`.
4. Create `src/styles/global.scss`: `@import` Google Fonts URL for IBM Plex Sans, then
   `@use '_tokens'`, `@use '_reset'`.
5. Update `src/main.tsx` to `import './styles/global.scss'`.
6. Create `src/assets/icons/` directory with SVG files:
   `ibm-logo.svg`, `icon-search.svg`, `icon-heart.svg`, `icon-share.svg`, `icon-chat.svg`,
   `icon-calendar-badge.svg`, `icon-notification.svg`, `icon-user.svg`, `icon-chevron-down.svg`,
   `icon-arrow-right.svg`, `icon-filter.svg`, `icon-grid.svg`, `icon-list.svg`,
   `icon-bookmark.svg`, `icon-document.svg`, `icon-play.svg`, `icon-launch.svg`, `icon-close.svg`.
   Use Carbon Icons SVG path data.
7. Create `src/assets/images/` and place `hero-cityscape.jpg` (or note that the Hero component
   will use a CSS purple gradient fallback when no photo is present).
8. Verify `npm run dev` starts and renders a blank page with no console errors.

**Relevant Context**
- Vite serves from `localhost:5173` by default.
- SCSS is enabled in Vite by installing `sass` — no extra config needed.
- CSS Modules file convention: `ComponentName.module.scss`.

---

### Sub-Task 2 — App Shell: Two-Row Header

**Status:** `[ ] pending`

**Intent**
Build the two fixed header rows that persist on every page. Row 1 is the light gray utility bar
with IBM branding and icon buttons. Row 2 is the white nav tab bar with the AEP IBM identity
and 6 horizontal navigation tabs. No sidebar exists.

**Expected Outcomes**
- **`<TopBar />`** (Row 1): light gray `#f4f4f4` bg, 48 px, `position: fixed; top: 0; z-index: 200`.
  - Left: `ibm-logo.svg` + "**IBM** Client Vantage" text.
  - Right: 7 icon buttons — Search, Heart, Share, Chat, Calendar-badge, Bell, User avatar.
  - Search icon click expands an inline `<input>` animating from the right; Escape collapses it.
  - User avatar click opens a dropdown panel: Profile / Settings / Sign Out (mock, closes on
    click-outside or Escape).
  - All icon buttons have `aria-label` and visible focus ring.
- **`<NavTabs />`** (Row 2): white bg, 48 px, `position: fixed; top: 48px; z-index: 199`,
  `border-bottom: 1px solid #e0e0e0`.
  - Left: CSS-only AEP IBM emblem (red `#da1e28` rectangle + white "AEP" text) + bold "AEP IBM"
    label + vertical divider.
  - Tab list: Home, Portfolios ▾, Projects, IBM Holidays, Partnership, IBM CICs.
  - Active tab: `border-bottom: 3px solid #6929c4; color: #161616; font-weight: 600`.
  - Active state driven by `useLocation()` (React Router) comparing `pathname` to each tab route.
  - Portfolios tab shows `icon-chevron-down.svg`; click opens a floating dropdown panel
    (All Portfolios / Active / Archived / Favourites); closes on click-outside or Escape.
  - Hover state: `background: #f4f4f4`.
- `<App />` main content wrapper has `padding-top: var(--header-total-height)` (96 px).
- Responsive (<768 px): tab labels hidden, hamburger button shown; clicking opens a full-height
  slide-over drawer listing all tabs vertically; semi-transparent backdrop closes it.

**Todo List**
1. Create `src/components/layout/TopBar/TopBar.tsx` + `TopBar.module.scss`.
2. In `TopBar.tsx`: left section JSX (logo + text), right section icon buttons, search expand
   state (`useState<boolean>`), user dropdown state (`useState<boolean>`).
3. Search expand: `{searchOpen && <input className={styles.searchInput} ... />}` — animate
   width with CSS `transition: width var(--transition-medium)`.
4. Click-outside for user dropdown: `useEffect` adds `mousedown` listener to `document`;
   checks if click target is outside the dropdown ref; closes if so.
5. Create `src/components/layout/NavTabs/NavTabs.tsx` + `NavTabs.module.scss`.
6. Define nav items array in `NavTabs.tsx`:
   ```ts
   const NAV_ITEMS = [
     { label: 'Home', path: '/home', hasDropdown: false },
     { label: 'Portfolios', path: '/portfolios', hasDropdown: true },
     { label: 'Projects', path: '/projects', hasDropdown: false },
     { label: 'IBM Holidays', path: '/ibm-holidays', hasDropdown: false },
     { label: 'Partnership', path: '/partnership', hasDropdown: false },
     { label: 'IBM CICs', path: '/ibm-cics', hasDropdown: false },
   ]
   ```
7. Use `useLocation()` to derive active tab: `location.pathname.startsWith(item.path)`.
8. Render tabs as `<Link>` from `react-router-dom` — NOT `<a href>` (prevents page reload).
9. Portfolios dropdown: `useState<boolean>` + `useEffect` click-outside listener.
   Dropdown panel: `position: absolute; top: 48px; background: #fff; border: 1px solid #e0e0e0;
   box-shadow: 0 4px 16px rgba(0,0,0,0.16)`.
10. Mobile drawer: `useState<boolean> mobileNavOpen`, `@media (max-width: 768px)` hides tab list
    shows hamburger icon; drawer slides in from left with `transform: translateX`.
11. Export both components; import into `App.tsx`.
12. Set `.main-content { padding-top: var(--header-total-height); }` in `App.module.scss`.

**Relevant Context**
- React Router `<Link to="/path">` handles SPA navigation — never use `<a href>`.
- `useLocation` hook from `react-router-dom` gives current pathname for active tab detection.
- CSS Modules: `className={styles.tabItem}` or combined active: `${styles.tabItem} ${isActive ? styles.active : ''}`.

---

### Sub-Task 3 — Routing & Page Shells

**Status:** `[ ] pending`

**Intent**
Wire React Router with all six routes and create bare-bones page shell components so tab
active-state highlighting works end-to-end before any page content is built.

**Expected Outcomes**
- `App.tsx` uses `<BrowserRouter>` + `<Routes>` from `react-router-dom`.
- Routes: `/` → redirect to `/home`, `/home`, `/portfolios`, `/projects`, `/ibm-holidays`,
  `/partnership`, `/ibm-cics`, `*` → redirect to `/home`.
- Each route renders a lazy-loaded page component via `React.lazy` + `<Suspense>`.
- Navigating between tabs updates the URL and active tab underline without a page reload.
- Browser back/forward buttons work correctly.

**Todo List**
1. Create bare page components (placeholder `<h1>Page Name</h1>`) in `src/pages/`:
   - `Home/HomePage.tsx`
   - `Portfolios/PortfoliosPage.tsx`
   - `Projects/ProjectsPage.tsx`
   - `IbmHolidays/IbmHolidaysPage.tsx`
   - `Partnership/PartnershipPage.tsx`
   - `IbmCics/IbmCicsPage.tsx`
2. In `App.tsx`:
   ```tsx
   const HomePage = React.lazy(() => import('./pages/Home/HomePage'));
   // ... repeat for each page
   ```
3. Render structure:
   ```tsx
   <BrowserRouter>
     <TopBar />
     <NavTabs />
     <main id="main-content" className={styles.mainContent}>
       <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
         <Routes>
           <Route path="/" element={<Navigate to="/home" replace />} />
           <Route path="/home" element={<HomePage />} />
           {/* ... */}
           <Route path="*" element={<Navigate to="/home" replace />} />
         </Routes>
       </Suspense>
     </main>
   </BrowserRouter>
   ```
4. Add a minimal loading state style (centered spinner or skeleton bar) for the `<Suspense>` fallback.
5. Test all 6 routes in the browser; confirm tab active state updates, no full page reloads.

**Relevant Context**
- `React.lazy` + `<Suspense>` gives automatic code splitting per route — each page JS chunk
  is loaded only when first visited.
- `<Navigate replace>` avoids adding redirect entries to browser history.

---

### Sub-Task 4 — Shared Components & Data Models

**Status:** `[ ] pending`

**Intent**
Build the reusable `<ContentCard>`, `<TagChip>`, and `<SectionHeader>` components plus TypeScript
interfaces and mock data that all pages consume. Establish the `ContentContext` for bookmark state.

**Expected Outcomes**
- TypeScript interfaces defined in `src/models/`.
- Mock data arrays in `src/data/` covering 8–12 content cards, 4–6 events, 6–8 quick links,
  4–6 portfolios, IBM holiday list.
- `ContentContext` provides `cards`, `toggleBookmark(id)` across all pages.
- `<ContentCard>` renders correctly with all fields, bookmark toggle, hover shadow.
- `<TagChip>` renders pill badge with color variants.
- `<SectionHeader>` renders title + optional "View All" link.

**Todo List**
1. Create interfaces in `src/models/`:
   - `ContentCard.ts`: `{ id, title, description, imageUrl?, category, contentType, date, productTag, link, isBookmarked }`
   - `Event.ts`: `{ id, title, description, date, location, type, imageUrl?, link }`
   - `Portfolio.ts`: `{ id, name, description, status, date, cardCount, link }`
   - `Holiday.ts`: `{ name, date, day, observed }`
   - `QuickLink.ts`: `{ id, label, icon, path, description }`
2. Create mock data files in `src/data/`:
   - `mock-content.ts` — 10 cards across IBM Watson, IBM Cloud, AEP program, IBM Security, Think conf
   - `mock-events.ts` — 5 events with realistic IBM dates/titles
   - `mock-portfolios.ts` — 5 portfolios
   - `mock-holidays.ts` — full IBM US holiday list for current year
   - `mock-quick-links.ts` — 6 tiles linking to each main nav section
3. Create `src/context/ContentContext.tsx`:
   - `useState<ContentCard[]>` seeded from `mock-content`.
   - `toggleBookmark(id: string)`: immutably flips `isBookmarked` on the matching card.
   - Export `useContent()` custom hook.
4. Wrap `<App>` in `<ContentProvider>` in `main.tsx`.
5. Create `src/components/shared/ContentCard/ContentCard.tsx` + `.module.scss`:
   - Props: `card: ContentCard`, `onBookmarkToggle: (id: string) => void`
   - Template: category chip, image/placeholder, product tag + date row, title (H3),
     description (3-line CSS clamp), divider, CTA link + bookmark icon button.
   - Hover: `box-shadow: 0 4px 16px rgba(0,0,0,0.16); border-color: #0f62fe`.
   - No border-radius — Carbon sharp corners.
6. Create `src/components/shared/TagChip/TagChip.tsx` + `.module.scss`:
   - Props: `label: string`, `variant?: 'default' | 'blue' | 'purple' | 'green'`
7. Create `src/components/shared/SectionHeader/SectionHeader.tsx` + `.module.scss`:
   - Props: `title: string`, `viewAllPath?: string`

**Relevant Context**
- `useContext` + `useState` in `ContentContext` is sufficient — no Redux needed.
- CSS clamp for description: `display: -webkit-box; -webkit-line-clamp: 3; overflow: hidden`.
- Card border: `1px solid var(--color-border)`; hover: `1px solid var(--color-brand-blue)`.

---

### Sub-Task 5 — Home Page

**Status:** `[ ] pending`

**Intent**
Build the full Home page matching the reference screenshot: full-width cityscape hero photo,
welcome section below it, quick links row, featured resources card grid, and events preview strip.

**Expected Outcomes**
- **Hero:** Full-width `<img>` or `background-image` at `height: 320px`, `object-fit: cover`,
  edge-to-edge. Fallback: purple gradient `linear-gradient(135deg, #6929c4, #491d8b)`.
- **Welcome section:** white bg, `padding: 40px 48px`, H1 "Welcome to AEP IBM", subtitle, body.
- **Quick Links:** light gray bg, 4-tile row on desktop (icon + label), links to main nav routes.
- **Featured Resources:** 3-column `<ContentCard>` grid, `SectionHeader` with "View All → /portfolios".
- **Events Preview:** horizontal strip of 3 event cards (date badge, title, desc, "Learn More").
- Alternating section backgrounds `#ffffff` / `#f4f4f4`.
- Responsive: 3-col → 2-col → 1-col at 1056px / 672px.

**Todo List**
1. Create `src/pages/Home/components/Hero/Hero.tsx` + `.module.scss`:
   - `background-image: url('/src/assets/images/hero-cityscape.jpg')` on a div,
     `height: 320px; background-size: cover; background-position: center`.
   - Purple gradient CSS fallback via `background-color` if image missing.
2. Create `src/pages/Home/components/WelcomeSection/WelcomeSection.tsx` + `.module.scss`:
   - Static content: H1, subtitle H2, paragraph, optional CTA `<button>`.
3. Create `src/pages/Home/components/QuickLinks/QuickLinks.tsx` + `.module.scss`:
   - Receives `quickLinks: QuickLink[]` prop.
   - Grid of `<Link to={item.path}>` tiles, each with SVG icon + label.
   - `grid-template-columns: repeat(4, 1fr)` → `repeat(2, 1fr)` on mobile.
4. Create `src/pages/Home/components/FeaturedResources/FeaturedResources.tsx` + `.module.scss`:
   - Receives `cards: ContentCard[]` (first 3 from context).
   - `<SectionHeader title="Featured Resources" viewAllPath="/portfolios" />` + card grid.
5. Create `src/pages/Home/components/EventsPreview/EventsPreview.tsx` + `.module.scss`:
   - Receives `events: Event[]` (first 3).
   - Each event card: large date badge (day number + abbreviated month), title, desc, "Learn More →" link.
6. Assemble in `src/pages/Home/HomePage.tsx`: `<Hero>` → `<WelcomeSection>` → `<QuickLinks>` →
   `<FeaturedResources>` → `<EventsPreview>`.
7. Use `useContent()` in `HomePage` to get cards; pass slices down as props.
8. Verify responsive layout at 1440px, 1024px, 768px, 375px in browser DevTools.

**Relevant Context**
- Hero photo is edge-to-edge (no horizontal padding on its container).
- Content sections inside have `max-width: 1200px; margin: 0 auto; padding: 0 48px`.
- Purple gradient fallback color: `#6929c4` → `#491d8b` (matches active tab accent).

---

### Sub-Task 6 — Portfolios Page (with Nav Dropdown)

**Status:** `[ ] pending`

**Intent**
Build the `/portfolios` page and complete the Portfolios dropdown in `<NavTabs>`. The page lists
portfolio cards; the dropdown from the nav tab provides sub-category filtering.

**Expected Outcomes**
- **Portfolios nav dropdown** (wired in `NavTabs`): clicking ▾ opens floating panel with items
  "All Portfolios", "Active", "Archived", "Favourites"; click-outside or Escape closes it;
  clicking an item navigates to `/portfolios?filter=active` etc.
- **Page:** section header "Portfolios", filter bar (text search input + status dropdown),
  3-column `ContentCard`-style grid of portfolio cards.
- Each portfolio card: name H3, description (2-line clamp), status chip, date, "View Details →" link.
- Filter bar filters the displayed list client-side.
- Responsive: 3 → 2 → 1 columns.

**Todo List**
1. Complete Portfolios dropdown in `NavTabs.tsx` (started in Sub-Task 2 but left as stub).
   Dropdown panel items as `<Link>` navigating to `/portfolios?filter=value`.
2. Create `src/pages/Portfolios/PortfoliosPage.tsx` + `.module.scss`.
3. Read `filter` query param with `useSearchParams()` from `react-router-dom`; default to "all".
4. Filter `portfolios` array from `mock-portfolios.ts` by status matching the query param.
5. Build filter bar: `<input>` for text search + `<select>` for status.
6. Render filtered array in a CSS grid with portfolio cards.
7. Portfolio card: extract as `src/pages/Portfolios/components/PortfolioCard/PortfolioCard.tsx`.

**Relevant Context**
- `useSearchParams` reads/writes URL query params without full reload.
- Portfolio card follows same visual spec as `ContentCard` (sharp corners, white bg, border,
  hover shadow) but has slightly different fields.

---

### Sub-Task 7 — Remaining Pages: Projects, IBM Holidays, Partnership, IBM CICs

**Status:** `[ ] pending`

**Intent**
Build the four remaining page routes to complete full navigation coverage.

**Expected Outcomes**
- **Projects (`/projects`):** Page header, card grid of project items (same card pattern as
  Portfolios). Status tags: In Progress / Completed / Planned.
- **IBM Holidays (`/ibm-holidays`):** Page header, full-year IBM US holiday list in a clean
  table — month-grouped, alternating row bg, date + holiday name + observed date columns.
- **Partnership (`/partnership`):** Welcome/intro banner (light purple tint `#f6f2ff`),
  3-column benefit tiles (icon + title + description), "Learn More" CTA button.
- **IBM CICs (`/ibm-cics`):** Description banner, `ContentCard` resource grid, contact/links
  section at bottom.
- All pages use `SectionHeader`, consistent `padding: 32px 48px` content padding, heading
  hierarchy H1 → H2 → H3, SCSS token variables throughout.

**Todo List**
1. Build `src/pages/Projects/ProjectsPage.tsx`:
   - Reuse portfolio card pattern; mock data in `mock-projects.ts` (or extend `mock-portfolios.ts`).
   - Status chips: In Progress (blue), Completed (green), Planned (gray).
2. Build `src/pages/IbmHolidays/IbmHolidaysPage.tsx`:
   - Import `mock-holidays.ts`.
   - Group holidays by month: `Array.from(Map<month, Holiday[]>)`.
   - Render each month as a `<section>` with `<h2>` month heading + `<table>`.
   - Table CSS: `border-collapse: collapse`, `tr:nth-child(even) { background: #f4f4f4 }`.
3. Build `src/pages/Partnership/PartnershipPage.tsx`:
   - Intro banner: `background: #f6f2ff; padding: 48px`.
   - Benefit tiles in a 3-column grid using inline SVG icons from `assets/icons/`.
   - CTA button: styled with `background: var(--color-brand-blue); color: #fff`.
4. Build `src/pages/IbmCics/IbmCicsPage.tsx`:
   - Description `<section>` + `ContentCard` grid (use filtered subset of mock content).
   - Contact section: name, email link, external link icon.
5. All pages: `<SectionHeader>` for each major section, consistent spacing.

**Relevant Context**
- `Array.prototype.reduce` can group holidays by month string.
- Use `var(--color-active-tab)` (`#6929c4`) for in-page accent elements (section borders,
  CTA button active state, benefit tile icon fill) to match the purple tab indicator.

---

### Sub-Task 8 — Footer

**Status:** `[ ] pending`

**Intent**
Add the persistent footer rendered below main content on all pages.

**Expected Outcomes**
- Dark footer: `background: #161616; color: #f4f4f4; height: 64px`.
- Left: small `ibm-logo.svg`.
- Center: Privacy | Terms | Accessibility | Contact links (color `#78a9ff` — blue-40 on dark bg).
- Right: "© Copyright IBM Corporation 2024".
- Responsive: on mobile (`<672px`) stacks vertically, centered, height auto.

**Todo List**
1. Create `src/components/layout/Footer/Footer.tsx` + `Footer.module.scss`.
2. Template: `<footer>` with three sections (logo / links / copyright).
3. Links: `color: #78a9ff; text-decoration: none; :hover { text-decoration: underline }`.
4. Import `<Footer>` into `App.tsx`, placed after `<main>` wrapper.

---

### Sub-Task 9 — Search (Top Bar Expansion + Search Results)

**Status:** `[ ] pending`

**Intent**
Wire the top bar search icon into a functional search experience. The search expands inline
in the top bar and navigates to `/search` with `?q=` query param showing filtered results.
Add `/search` as a route.

**Expected Outcomes**
- Clicking the Search icon in `<TopBar>` expands an input field.
- Typing and pressing Enter (or clicking search icon) navigates to `/search?q=query`.
- `<SearchPage>` reads `?q=` via `useSearchParams`, filters mock content cards by title/
  description/category match (case-insensitive), and renders the results grid.
- Result count: "X results for 'query'".
- Empty state: centered message "No results found. Try different keywords." + Clear button.
- Clear button resets `q` param and shows all cards.
- Filter chips: All / Document / Video / Tool / Guide — toggle to further filter results.
- Reactive: chips re-filter immediately on click.

**Todo List**
1. Add `/search` to routes in `App.tsx`: `<Route path="/search" element={<SearchPage />} />`.
2. Create `src/pages/Search/SearchPage.tsx` + `.module.scss`.
3. In `SearchPage`: `useSearchParams` reads `q`; `useMemo` computes filtered results from
   `useContent().cards`.
4. Filter logic: `cards.filter(c => [c.title, c.description, c.category].some(f => f.toLowerCase().includes(q.toLowerCase())))`.
5. Add content type filter chips using `useState<string>` (`activeFilter`).
6. Empty state: `{results.length === 0 && <EmptyState />}` — centered SVG + message.
7. In `TopBar.tsx`: on Enter keydown in the search input, call
   `navigate('/search?q=' + encodeURIComponent(value))` using `useNavigate()`.
8. Add Search icon `<NavItem>` to `NavTabs` or keep it only in `TopBar` (top-bar icon only).

---

### Sub-Task 10 — Responsive Polish & Accessibility

**Status:** `[ ] pending`

**Intent**
Full responsive pass at all target breakpoints and an accessibility audit.

**Expected Outcomes**
- No horizontal scroll at 375px, 480px, 768px, 1024px, 1280px, 1440px+.
- Mobile (<768px): horizontal nav tabs replaced by hamburger → slide-over drawer listing all tabs.
- Hero photo scales correctly at all widths.
- Cards stack to 1 column at 672px and below.
- All icon-only buttons have `aria-label`.
- `<main id="main-content">` is the landmark for skip link.
- Skip-to-content link at top of `App.tsx`: `<a href="#main-content" className={styles.skipLink}>`.
- Active tab has `aria-current="page"`.
- All `<img>` elements have `alt` text.
- Color contrast ≥ 4.5:1 for all normal text (WCAG AA).
- Keyboard navigation: Tab moves through interactive elements in logical order; Enter/Space
  activates buttons; Escape closes dropdowns/drawers.

**Todo List**
1. In `TopBar.module.scss` and `NavTabs.module.scss`: add `@media (max-width: 768px)` rules.
2. Mobile drawer in `NavTabs`: `transform: translateX(-100%)` → `translateX(0)` when open;
   `transition: transform var(--transition-medium)`. Semi-transparent backdrop `div` with
   `onClick` closes drawer.
3. Add `aria-label` to every icon button in `TopBar`.
4. Add `aria-current="page"` to the active `<Link>` in `NavTabs`.
5. Add `role="dialog"` + `aria-label="Navigation menu"` to mobile drawer.
6. Review all pages for heading hierarchy — each page must have exactly one `<h1>`.
7. Test at 375px, 768px, 1024px in Chrome DevTools. Fix any overflow issues found.
8. Add skip-link CSS to `global.scss`:
   ```css
   .skip-link { position: absolute; left: -9999px; }
   .skip-link:focus { left: 16px; top: 8px; z-index: 9999; }
   ```

---

### Sub-Task 11 — README & Final Verification

**Status:** `[ ] pending`

**Intent**
Write the project README and do a final end-to-end visual + functional verification pass.

**Expected Outcomes**
- `README.md` with project description, prerequisites, install + run instructions, route map.
- `npm install` and `npm run dev` work cleanly with no errors or warnings.
- App loads at `localhost:5173`, redirects to `/home`.
- All 6 tab routes navigate without page reload; active tab underline is purple `#6929c4`.
- Portfolios tab dropdown opens/closes; filtering works.
- Home page: cityscape hero (or gradient), welcome section, quick links, resource cards, events.
- Search expands in top bar; `/search?q=` filters results correctly.
- Bookmark toggle persists within session via `ContentContext`.
- No console errors.
- No horizontal scroll at 375px.
- `npm run build` completes without errors.

**Todo List**
1. Write `README.md`:
   ```markdown
   # IBM Client Vantage – AEP IBM (React SPA Recreation)
   ## Prerequisites
   Node 18+, npm 9+
   ## Install
   npm install
   ## Run
   npm run dev
   ## Access
   http://localhost:5173
   ## Routes
   /home · /portfolios · /projects · /ibm-holidays · /partnership · /ibm-cics · /search
   ```
2. Run `npm run build` and fix any TypeScript or import errors.
3. Run `npm run dev`, open browser, navigate every route.
4. Check visual fidelity: two-row header, purple active tab, hero photo/gradient, card grids.
5. Test responsive at 375px and 768px in DevTools.
6. Fix any remaining issues found during the review.

---

## Design Token Reference

```scss
// Colors — from reference screenshot
--color-active-tab:       #6929c4;   // Purple — active tab underline
--color-active-tab-dark:  #491d8b;   // Purple hover
--color-brand-blue:       #0f62fe;   // IBM Blue 60 — links, buttons
--color-brand-blue-dark:  #0043ce;   // IBM Blue 70 — hover
--color-top-bar-bg:       #f4f4f4;   // Light gray utility bar
--color-nav-tabs-bg:      #ffffff;   // White tab row
--color-page-bg:          #f4f4f4;   // Main content background
--color-card-bg:          #ffffff;
--color-text-primary:     #161616;
--color-text-secondary:   #525252;
--color-text-link:        #0f62fe;
--color-border:           #e0e0e0;
--color-hover:            #e8e8e8;
--color-aep-emblem:       #da1e28;   // Red AEP IBM badge
--color-success:          #198038;
--color-focus:            #0f62fe;

// Layout — two-row header, no sidebar
--top-bar-height:         48px;
--nav-tabs-height:        48px;
--header-total-height:    96px;

// Spacing (Carbon scale)
--spacing-01:  2px;
--spacing-02:  4px;
--spacing-03:  8px;
--spacing-04:  12px;
--spacing-05:  16px;
--spacing-06:  24px;
--spacing-07:  32px;
--spacing-08:  40px;
--spacing-09:  48px;
--spacing-10:  64px;

// Typography
--font-family:           'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
--font-size-base:         16px;
--font-size-sm:           14px;
--font-size-xs:           12px;
--font-size-h1:           42px;
--font-size-h2:           28px;
--font-size-h3:           20px;
--font-size-h4:           18px;
--font-weight-light:      300;
--font-weight-regular:    400;
--font-weight-semibold:   600;

// Motion
--transition-fast:        110ms ease;
--transition-medium:      200ms ease;
```

---

## Implementation Notes

- **React 18 + Vite** — `npm create vite@latest . -- --template react-ts`.
- **Routing** — `react-router-dom` v6 with `<BrowserRouter>`, `<Routes>`, `<Route>`.
- **Lazy loading** — `React.lazy()` + `<Suspense>` for each page component.
- **State** — `useState` + `useContext` only. No Redux, no Zustand.
- **Styling** — CSS Modules (`.module.scss`) per component + global tokens in `global.scss`.
- **Icons** — `<img src="/src/assets/icons/icon-name.svg" alt="" />` inline in JSX.
- **No sidebar** — navigation is entirely horizontal.
- **No border-radius** — Carbon uses sharp corners (`border-radius: 0`).
- **Active tab color** — purple `#6929c4`, NOT IBM Blue 60.
- **Hero** — full-width photo `object-fit: cover; height: 320px`. Fallback: purple gradient.
- **AEP IBM emblem** — CSS-only: `background: #da1e28; color: #fff; padding: 2px 6px; font-size: 11px; font-weight: 700`.
- **Click-outside pattern** — `useEffect` adding `mousedown` listener on `document`; checks
  `ref.current.contains(event.target)`; clears on cleanup.
- **Mock data** — static TypeScript `.ts` files exporting typed arrays. No HTTP calls.
- **Content state** — `ContentContext` holds `cards` array; `toggleBookmark` mutates in-memory.
