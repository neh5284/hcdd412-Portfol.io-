 Portfol.io

## How to Run the Project

1. Open the project folder in Intellij IDEA IDE
2. Open the terminal
3. Install dependencies:

```bash
npm install
npm run dev
```

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
