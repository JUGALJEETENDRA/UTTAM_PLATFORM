# Workflow: Design & Code Review

This workflow acts as the final quality assurance gate after any design refactoring or component extraction.

## Workflow Triggers & Execution Order
* **Trigger:** Initiated once a page redesign or component refactoring is complete.
* **Responsible Agent Role:** `code-review` and `accessibility` / `performance` modules.

---

## Review & Audit Checklist

### Step 1: Design System Consistency Review
Check:
* Are all typography styles mapped to tokens in [DESIGN_SYSTEM.md](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/.agents/DESIGN_SYSTEM.md)?
* Are buttons and input elements matching standard UI libraries?
* Are margins and padding values aligned to the 4px grid?

### Step 2: Code Quality & Type Safety Review
Check:
* Run the typescript compiler:
  ```powershell
  .\node_modules\.bin\tsc.cmd --noEmit
  ```
  Ensure **zero** compile errors.
* Check for TypeScript lints:
  Ensure no `any` types are introduced and no unused variables/imports remain.
* Verify import paths are structured using the path alias prefix `@/`.

### Step 3: Responsive & Interaction Check
Check:
* Scale viewport size to check layout transitions (from `320px` to `1280px`).
* Ensure hover transitions easing feel premium.
* Verify scroll behavior on mobile screens.

### Step 4: Build Verification
Run:
```powershell
npm.cmd run build
```
Verify the Next.js static site compiles successfully without build warnings.
