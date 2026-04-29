# portfol.io

A portfolio web application built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Setup

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

## If you get a Vite error

If you see errors like:

```
Cannot find module ... vite/dist/node/chunks/...
```

or the app will not start, run these EXACT commands in PowerShell:

```
Ctrl + C

Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

npm cache clean --force
npm install
npm install -D vite@6.3.5 vitest@3.2.4

npm run test
```

Then start the app again:

```bash
npm run dev
```

## Notes

* If the UI looks unstyled, make sure Tailwind is included in `styles/index.css`
* If dark mode does not persist, make sure it is saved and loaded from `localStorage`


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
