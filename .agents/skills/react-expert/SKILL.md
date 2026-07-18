---
name: react-expert
description: Guidelines for React 19 state management, hooks optimizations, and client boundaries.
---

# React Expert Skill

Use this skill when optimizing page-level state management, writing hooks, or refactoring client pages.

## React 19 Rules

### 1. Client-Server Separation
* Define `"use client"` ONLY when state hooks, browser event listeners, or client-side storage keys are referenced.
* Keep server component data fetching separate from client component interactivity.

### 2. State & Effect Hooks Optimization
* Avoid putting state modifications directly in the render sequence or inside uncontrolled `useEffect` blocks (which triggers linter warnings like `react-hooks/set-state-in-effect`).
* Restructure layouts so state is updated on specific action events (e.g. `onClick`, `onChange`).
* Always define complete hook dependency arrays for `useEffect`, `useCallback`, and `useMemo` hooks.

### 3. State Scoping
* local state: Keep flags (like `isOpen`, `isLoading`) within the component block that uses them.
* Prop drilling: Lift state to common ancestor components or wrap inside context providers if state is shared globally.
