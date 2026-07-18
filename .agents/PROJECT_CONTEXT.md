# Project Context: Edtech Learning Platform

## 1. Purpose of the Application
The **Edtech Learning Platform** is a client-serverless web application designed to deliver an interactive educational curriculum to students while providing faculty members with a lightweight, low-overhead Content Management System (CMS).

Key educational features:
* **Interactive Modules:** Structured learning chapters with modular content.
* **Mind Maps & Infographics:** Visual aids to help students grasp conceptual topologies.
* **Flashcard Decks:** Active recall tools containing study card terms and descriptions.
* **Interactive Simulations:** Sandboxed environments for hands-on learning (e.g. running code or visual interactive demos).
* **Quizzes:** Timed assessments with immediate grading and performance results.

---

## 2. Target Users
* **Students:** Focus on distraction-free reading, interactive learning tools, study aids (flashcards, mind maps), code sandboxes, and quiz assessments. They expect high performance, responsiveness, and a premium educational experience.
* **Faculty / Administrators:** Focus on ease of content management. They require interfaces to create/edit/delete subjects, modules, subtopics, quizzes, and simulations, and to trigger site deploys.

---

## 3. Tech Stack
* **Frontend Framework:** Next.js 16+ (App Router, React 19)
* **Styling:** Tailwind CSS v4 (configured in `globals.css`)
* **Icons:** Lucide React
* **Backend API:** Single-endpoint Google Apps Script (GAS) Web App
* **Database:** Google Sheets (with an auto-initializing database system, sheet caching, and GitHub deploy dispatch)
* **Encryption:** AES-256 (CryptoJS) for secure, local client-side decryption of private course materials

---

## 4. Repository & Folder Structure
```
PS-3-Pages-Client-Only/
├── .agents/                 # AI workspace configuration and rules
├── public/                  # Public assets, images, and static data
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── faculty/         # Faculty administrative routes & pages
│   │   ├── student/         # Student study/learning routes & pages
│   │   ├── team/            # Development team credits page
│   │   ├── globals.css      # Styling rules and Tailwind v4 themes
│   │   ├── layout.tsx       # Root document structure and layout
│   │   └── page.tsx         # Main entry portal
│   ├── components/          # React components
│   │   ├── cards/           # Standardized content card templates
│   │   ├── faculty/         # Faculty-only components (modals, forms)
│   │   ├── layout/          # Global layout (navbars, footers, utility bars)
│   │   ├── student/         # Student-only interactive tools (decks, quizzes)
│   │   └── ui/              # Base UI library components (Shadcn)
│   ├── lib/                 # Shared helper libraries
│   │   ├── apiClient.ts     # GAS Web App client dispatcher
│   │   ├── crypto.ts        # In-browser decryption module
│   │   ├── prisma.ts        # Proxy stub for database compiling
│   │   └── utils.ts         # Utility class merging helper (cn)
│   └── types/               # Shared TypeScript typings
└── package.json             # Build configuration and dependency manifest
```

---

## 5. Application Architecture & Data Flow

### 5.1 Client-Serverless Data Hydration
1. **Dynamic Dev Mode:** Requests are routed directly to the Google Apps Script Web App using `fetchGAS(action, payload)`.
2. **Static Production Fallback:** For deployed student-facing views, `fetchGAS` retrieves a pre-compiled `data.json` file generated at build time. This ensures instant dashboard loading and offline durability.
3. **Decryption Layer:** Private subject payloads in `data.json` are encrypted using AES-256. Upon successful student Google Login, the access keys are stored in `localStorage` and used by `fetchGAS` to decrypt materials in memory.

### 5.2 Faculty Write Operations
1. Faculty users submit edits via administrative dashboards.
2. Requests are sent directly to the GAS Web App endpoint which updates Google Sheets.
3. The GAS Cache is invalidated for that sheet.
4. Faculty trigger a **Static Site Rebuild** using the "Trigger Deploy" feature, which uses a GitHub Repository Dispatch event to rebuild the static Next.js frontend with updated Google Sheets data.

---

## 6. Existing Reusable Components
Use these components as the standard building blocks for any layout additions or refactoring:

### 6.1 Base UI Components ([src/components/ui/](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/ui))
* `button.tsx`: Unified button styles with variant options.
* `card.tsx`: Base card boxes with content, header, description, and title wrappers.
* `badge.tsx`: Minimal badge tags for statuses, themes, and metadata.
* `input.tsx`: Standard text inputs with outline styling.
* `tabs.tsx`: Group tabs for content pagination.
* `table.tsx`: Structured data grids.
* `progress.tsx`: Visual feedback bars (e.g., quiz progress, module completion).

### 6.2 Application Cards ([src/components/cards/](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/cards))
* `ModuleCard.tsx`: Standardized container for educational modules.
* `SimulationCard.tsx`: Standardized card representing interactive simulations.
* `SubjectResourceCard.tsx`: Renders course-related files, links, and assets.

### 6.3 Global Layout ([src/components/layout/](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/layout))
* `MainNavbar.tsx`: Header navigation bar.
* `Footer.tsx`: Document footer links.
* `TopUtilityBar.tsx`: Upper utility row for breadcrumbs and theme controls.
