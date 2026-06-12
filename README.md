# Edtech Learning Platform

Welcome to the Edtech Learning Platform, a comprehensive learning management system built with a dual-interface architecture tailored for **Students** and **Faculty**. The platform uses a serverless backend powered by Google Apps Script (GAS) with Google Sheets acting as the primary database.

## 🚀 Key Features

### For Students (`/student`)
- **Dashboard**: A personalized view of enrolled subjects, progress, and quick access to modules.
- **Interactive Modules**: Step-by-step learning modules with rich text, embedded videos, notes, and resources.
- **Quizzes**: Timed assessments mapped to specific subtopics or entire modules.
- **Flashcards**: Interactive study tools generated manually or parsed from documents (DOCX/CSV).
- **Simulations**: Interactive sandbox environments to practice complex theories.
- **Mind Maps**: Visual representation of subject topologies.

### For Faculty (`/faculty`)
- **Curriculum Builder**: Drag-and-drop/form-based interface to structure subjects, modules, and subtopics.
- **Resource Management**: Upload links, documents, and interactive assets.
- **Assessment Creator**: Intuitive forms for creating quizzes and interactive flashcards.
- **Analytics & Control**: Oversee student metrics and subject deployments.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.x (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI + Radix UI Primitives
- **Icons**: Lucide React
- **Document Parsers**: Mammoth (DOCX), pdf2json, and custom CSV parsers for flashcard/resource generation.

### Backend (Serverless)
- **Compute**: Google Apps Script (GAS) deployed as a Web App.
- **Database**: Google Sheets.
- **Caching**: Google Apps Script `CacheService` to optimize read heavy operations.
- **Communication**: JSON over HTTPS POST requests via `fetchGAS` utility.

---

## 🏁 Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd UI_NEW_Learning_Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# The URL of your deployed Google Apps Script Web App
NEXT_PUBLIC_GAS_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"

# Set to true to use local data.json fallbacks (if applicable)
NEXT_PUBLIC_IS_DEPLOYED="false"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Backend Setup (Google Apps Script)

Since this project uses Google Sheets as a database, you must set up the GAS backend:

1. Create a new Google Sheet.
2. Open **Extensions > Apps Script**.
3. Copy the entire contents of `GAS_Backend_Code.js` from the project root and paste it into the script editor.
4. Replace `SPREADSHEET_ID` at the top of the script with your actual Google Sheet ID (found in the Sheet's URL).
5. Run the `setupDatabase` function from the script editor once to initialize the sheet schemas.
6. Click **Deploy > New deployment**.
   - Select **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
7. Copy the generated Web App URL and place it in your frontend's `.env.local` as `NEXT_PUBLIC_GAS_URL`.

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── faculty/       # Faculty dashboard and management tools
│   │   ├── student/       # Student learning portal
│   │   ├── layout.tsx     # Global layout and providers
│   │   └── page.tsx       # Marketing/Landing page
│   ├── components/        # Reusable UI components (Shadcn, layouts, etc)
│   ├── lib/
│   │   ├── apiClient.ts   # fetchGAS utility bridging frontend to GAS
│   │   └── utils.ts       # Tailwind and formatting utilities
├── scripts/               # Build/sync scripts for static data generation
├── public/                # Static assets
└── GAS_Backend_Code.js    # The complete Google Apps Script backend code
```

---

## 📜 Architecture Documentation

For a detailed breakdown of the Client-Serverless pattern, data flow, and database schemas, please read [ARCHITECTURE.md](./ARCHITECTURE.md).
