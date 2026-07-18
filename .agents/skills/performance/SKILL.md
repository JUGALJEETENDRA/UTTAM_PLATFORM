---
name: performance
description: Guidelines on minimizing bundle sizes, splitting large page segments, and reducing layout shifts.
---

# Performance Skill

Use this skill when refactoring bulky page modules, optimizing asset calls, or fixing cumulative layout shifts (CLS).

## Optimization Guidelines

### 1. Code Splitting & Large File Management
* Split extremely large client component scripts (like [ClientPage.tsx](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/app/student/subjects/subject/ClientPage.tsx) which is currently ~180KB) into dedicated sub-directories and individual component files.
* Dynamically load components that contain heavy logic or libraries (such as pdf extraction, text editing or rendering modules) that are not needed during initial page load.

### 2. Layout Shifts & Loading Placeholders
* Pre-define dimensions for containers to avoid cumulative layout shifts when dynamic state loads.
* Use skeleton screens or content placeholders matching the approximate final element layout size during hydration delays.

### 3. State Optimization
* Keep re-render bounds narrow. Do not put global contextual values on standard component roots if simple local hooks are sufficient.
* Memoize expensive calculation outcomes using `useMemo` where appropriate.
