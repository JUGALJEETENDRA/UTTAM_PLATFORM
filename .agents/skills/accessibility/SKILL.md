---
name: accessibility
description: Rules for ARIA attributes, semantic HTML tags, keyboard navigation, and color contrast.
---

# Accessibility Skill

Use this skill when auditing page controls, adding buttons/modals, or checking contrast rules.

## Accessibility Guidelines

### 1. Semantic HTML Structure
* Use correct structural landmark wrappers (`<main>`, `<header>`, `<footer>`, `<nav>`, `<aside>`).
* Ensure headings follow a correct hierarchical order (`<h1>` down to `<h6>`). Do not jump levels.

### 2. Focus Rings & Keyboard Navigation
* Avoid hiding default outline styles without declaring alternatives. Focus indicators must be clearly visible.
* Add focus visibility classes to interactive elements:
  ```tailwind
  focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]
  ```
* Ensure dialog structures incorporate focus trapping and escape hooks (e.g., standard Shadcn Dialog handling).

### 3. Screen Reader Attributes
* Apply descriptive tags (`aria-label`) on pure icon buttons (like generic edit or delete trashcans).
* Define state indicators (`aria-expanded`, `aria-selected`, `aria-checked`) to describe changing interface components.
