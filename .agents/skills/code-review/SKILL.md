---
name: code-review
description: Code validation checks for lint issues, TypeScript type safety, compilation success, and syntax cleanliness.
---

# Code Review Skill

Use this skill when checking modified code files for compiler safety, type errors, lint issues, and syntax cleanliness.

## Quality Standards

### 1. TypeScript Strictness
* Ensure no `any` types are introduced in props, variables, or functions.
* Explicitly check type assertions when handling external JSON payloads.
* Fix any missing module type declarations or build errors.

### 2. Lint Compliance
* Do not leave unused imports or variables in files.
* Ensure code rules (e.g. Hooks dependency arrays, state changes inside useEffect) are strictly satisfied.

### 3. Verification Workflow
Verify any code changes using these commands:
* **TypeScript Check:**
  ```powershell
  .\node_modules\.bin\tsc.cmd --noEmit
  ```
* **Build Check:**
  ```powershell
  npm.cmd run build
  ```
* **Lint Check:**
  ```powershell
  npm.cmd run lint
  ```
Ensure all commands pass cleanly before declaring tasks finished.
