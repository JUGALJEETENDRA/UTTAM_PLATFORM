# Project Architecture

This document describes the structural and architectural design of the Edtech Learning Platform.

## 1. System Overview

The application follows a **Client-Serverless** architecture. 
- **Frontend**: A Next.js (App Router) application hosted (e.g., on Vercel or GitHub Pages) that acts as the primary interface for both Students and Faculty.
- **Backend API**: A single-endpoint Google Apps Script (GAS) Web App.
- **Database**: Google Sheets.

This architecture was chosen to minimize hosting costs, simplify database management for administrators (who can view raw data in Google Sheets), and allow rapid iteration.

---

## 2. Frontend Architecture (Next.js)

The frontend is built on **Next.js 16+** using the modern **App Router** (`src/app`). 

### 2.1 Routing Structure
The application is strictly separated by roles at the routing level:
- `/src/app/student/*`: Only accessible/relevant to students. Deals heavily in reading data, attempting quizzes, and viewing content.
- `/src/app/faculty/*`: The CMS and administrative portal. Deals with creating, updating, and deleting content.

### 2.2 Component Library & Styling
- **Tailwind CSS v4** is used for utility-first styling.
- **Shadcn UI** acts as the foundational component library (e.g., `Card`, `Button`, `Input`, `Dialog`). These components are highly customizable and reside in `src/components/ui/`.
- Icons are provided by **Lucide React**.

### 2.3 Data Fetching (`fetchGAS`)
All network requests to the backend are routed through a single utility function located in `src/lib/apiClient.ts`: `fetchGAS(action, payload)`.

**Key features of `fetchGAS`:**
1. **Action Dispatching**: Takes a string `action` (e.g., `getModules`) and a JSON `payload`.
2. **Offline/Static Fallback**: If `process.env.NEXT_PUBLIC_IS_DEPLOYED` is true and the user is NOT on a `/faculty` path, `fetchGAS` attempts to read from a local `data.json` file generated at build time. This allows the student dashboard to remain lightning-fast and functional even if the backend is slow or offline.
3. **POST Requests**: When communicating with GAS, all requests are sent as `POST` to avoid URL length limits, with `Content-Type: text/plain` to satisfy CORS requirements for Google Apps Script.

---

## 3. Backend Architecture (Google Apps Script)

The backend logic resides entirely within `GAS_Backend_Code.js`. When deployed as a Web App, it exposes `doGet` and `doPost` methods.

### 3.1 Request Handling (`doPost`)
The entry point parses the incoming payload, extracts the `action` string, and uses a `switch` statement to route to the appropriate controller function (e.g., `handleGetModules`, `handleSaveFlashcardDeck`).

### 3.2 Database Schema (Google Sheets)
The platform uses an auto-initializing database system. Running `setupDatabase()` creates the following sheets if they do not exist:

| Sheet Name | Purpose |
|------------|---------|
| **Subjects** | Top-level containers for courses. |
| **Modules** | Chapters or units belonging to a Subject. |
| **Subtopics** | Individual lessons, videos, or resources within a Module. |
| **Quizzes** | Timed assessments containing JSON arrays of questions. |
| **FlashcardDecks** | Collections of flashcards (Front/Back) stored as JSON. |
| **Simulations** | Metadata and URLs for interactive sandbox environments. |
| **MindMaps** | Visual topology URLs and data. |
| **Resources** | General links and documents. |

*Note: Complex nested data (like arrays of flashcards or quiz questions) are stringified to JSON and stored in a single cell.*

### 3.3 Caching Mechanism
Google Sheets API calls are notoriously slow. To resolve this, the backend uses `CacheService` (Google's built-in Memcached equivalent). 
- When a sheet is read (e.g., via `getSheetData(sheetName)`), the result is serialized and cached for up to 6 hours.
- When any write operation occurs (`writeRow`, `updateRow`, `deleteRow`), the `invalidateCache(sheetName)` function is immediately called for that specific sheet, ensuring subsequent reads fetch the freshest data.

### 3.4 GitHub Dispatch (triggerDeploy)
The backend includes a `handleTriggerDeploy` action. This uses a GitHub Personal Access Token (`GITHUB_PAT`) stored in GAS Script Properties to trigger a `repository_dispatch` event on GitHub. This allows faculty members to manually trigger a static site rebuild of the Next.js frontend once they've finished updating curriculum data.

---

## 4. Workflows

### 4.1 Creating a Flashcard Deck (Example Data Flow)
1. **Frontend**: Faculty user uploads a `.csv` file. The frontend native JS parser reads the CSV and updates the React state `cards`.
2. **Frontend**: User clicks "Create Deck". `fetchGAS("saveFlashcardDeck", { title, cards, ... })` is called.
3. **Backend**: `doPost` receives the payload, dispatches to `handleSaveFlashcardDeck`.
4. **Backend**: Checks if an `id` is present. If not, it generates a new ID. The `cards` array is JSON-stringified.
5. **Backend**: `writeRow("FlashcardDecks", data)` is called. The `FlashcardDecks` cache is invalidated, and the new row is appended to the Sheet.
6. **Frontend**: Receives `{ success: true, deckId: "..." }` and shows a toast notification.
