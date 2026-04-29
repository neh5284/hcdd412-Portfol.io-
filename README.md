# portfol.io

A portfolio web application built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## Setup

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

---

## If you get a Vite error

If you see errors like:

```
Cannot find module ... vite/dist/node/chunks/...
```

Run the following in PowerShell:

```powershell
Ctrl + C

Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

npm cache clean --force
npm install
npm install -D vite@6.3.5 vitest@3.2.4

npm run test
```

Then restart:

```bash
npm run dev
```

---

## Test Account (Required for Grading)

Use the following credentials:

- Email: neh5284@psu.edu  
- Password: test123  

---

## Team Contributions

| Team Member ID | Team Member Name           | % Effort | Contribution |
|----------------|---------------------------|----------|-------------|
| neh5284        | Nathan Edward Hinkle      | 25%      | Frontend development, dashboard UI, dark mode implementation, Supabase integration, Backend logic |
| pmb5775        | Prageethraj Bharaneedharan| 25%      | Frontend development, Backend logic, API integration, testing support |
| ssh5490        | Syed Sharjeel Hussain     | 25%      | Feature development, debugging, UI improvements, testing support |
| cfw5511        | Jasper Chengtian Wang     | 25%      | Testing, validation, UI refinement and Creation, project support |

---

## Notes

- If the UI appears unstyled, ensure Tailwind is included in `styles/index.css`
- Dark mode is stored in `localStorage` and applied globally on app load
- Public portfolio links are dynamically generated per user


## Team-Member Design Pattern Implementation Ledger

| Team-Member ID | Team-Member Name           | Design Pattern Implemented      | Classes / Interfaces implementing the Design Pattern |
|:---------------|:---------------------------|:--------------------------------| :--- |
| **pmb5775**    | Prageethraj Bharaneedharan | **Factory Method** (Creational) | `Notification.java` (Interface), `NotificationFactory.java`, `EmailNotification.java`, `PushNotification.java` |
| **pmb5775**    | Prageethraj Bharaneedharan | **Sort by Column** (UI Pattern) | `app/pages/Dashboard.tsx` (Logic: `sortData` function; UI: Clickable `<h2>` header with state indicators) |
| **ssh5490**    | Syed Jeel Hussain          | **Facade** (Creational)         | `ImportFacade`, `ImportReport`, `syncService` (Subsystem), `projectService` (Subsystem) |
| **ssh5490**    | Syed Jeel Hussain          | **Search Filters** (UI Pattern) | `SearchFilters.tsx`, `PublicPortfolio.tsx`, `ProjectCard.tsx`, `mockData.ts`             |
| **neh5284**    | Nathan Hinkle              | **....** (Creational)           |  |
| **neh5284**    | Nathan Hinkle              | **....** (UI Pattern)           |                                                                                                                |
| **cfw5511**    | Jasper Chengtian Wang      | **Strategy** (Creational)       |  `app/strategies/projectSortStrategy.ts` , `app/pages/PublicPortfolio.tsx`  |
| **cfw5511**    | Jasper Chengtian Wang      | **Tagging** (UI Pattern)        |  `app/components/ProjectCard.tsx`, `app/pages/PublicPortfolio.tsx`, `app/components/SearchFilters.tsx`   |

---
