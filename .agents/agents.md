# Antigravity Workspace Rules

Welcome to the AI-driven workspace for the Edtech Learning Platform. This document outlines the fundamental rules, behavioral constraints, and quality standards for all development and UI/UX refactoring tasks in this repository.

## 1. Architectural Integrity & Constraints

Any modifications, refactoring, or visual redesigns must adhere strictly to these constraints.

> [!IMPORTANT]
> **Preserve Core Systems:**
> * **Zero API modifications:** Do not change how `fetchGAS` communicates with Google Apps Script. Keep the request parameters, dispatch actions, and payloads exactly as they are.
> * **Zero Database changes:** The Google Sheets database structure is fixed. Do not modify schema parsing, sheets setups, or caching in `GAS_Backend_Code.js`.
> * **Zero Authentication changes:** Do not touch the Google OAuth implementation (`@react-oauth/google`), the auth checking flows, or password hashing in `.env.local` / `src/lib/auth.ts`.
> * **Zero Routing changes:** Keep the directory-based App Router structure under `src/app/` intact.

> [!WARNING]
> **What You CAN and SHOULD Improve:**
> * Spacing, margins, padding, and layout grid alignment.
> * Typography hierarchy, font-weights, and sizing.
> * Visual consistency (standardizing buttons, input fields, tags, and cards).
> * Performance optimization (e.g., splitting massive components like `ClientPage.tsx`).
> * Accessibility compliance (e.g., proper ARIA attributes, contrast ratios, and focus ring styling).
> * Modern animations (using Framer Motion or Tailwind transitions) and responsive styling.

---

## 2. Coding Conventions & Preferred Style

### 2.1 Next.js 16+ & React 19 Standards
* **Client Boundaries:** Mark client-side components with `"use client"` at the very top. Keep client-side state hooks localized.
* **TypeScript & Safety:** Avoid using `any` types. Provide explicit interfaces or types for all components, helpers, and data structures.
* **Unused Variables:** Fix any unused imports or variables immediately to ensure compiler passes.

### 2.2 Tailwind CSS v4 Style Guide
* Tailwind v4 is configured in [globals.css](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/app/globals.css) using the `@import "tailwindcss";` syntax.
* Use CSS theme variables (e.g., `var(--background)`, `var(--primary)`) mapped under `@theme inline` in `globals.css` rather than static Tailwind classes where dynamic theme control is needed.
* Maintain clean class structures. Avoid mixing conflicting utilities; use `cn(...)` from `src/lib/utils.ts` for dynamic class merging.

---

## 3. UI/UX Refactoring Workflow

Every UI change must undergo the following automated/mental workflow:
1. **UX Audit (`ui-audit`):** Assess visual hierarchy, layout alignment, typography, information density, accessibility, and responsiveness.
2. **Implementation (`redesign-page`):** Modify structural classes, standardize buttons/inputs to existing Shadcn UI components, optimize layout grid, and add animations.
3. **Component Extraction (`component-refactor`):** Identify duplicated JSX/styles and extract them into clean, reusable React components in `src/components/` or `src/components/ui/`.
4. **Code & Visual Review (`design-review`):** Verify visual quality against premium benchmarks (Linear, Stripe, Vercel). Fix unused variables, type safety, and formatting issues.
