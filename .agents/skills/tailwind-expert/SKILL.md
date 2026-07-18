---
name: tailwind-expert
description: Specialized rules for writing clean, performant, and maintainable Tailwind CSS v4 code.
---

# Tailwind Expert Skill

Use this skill when writing layout styles, responsive adjustments, dynamic colors, or transition animations.

## Tailwind CSS v4 Guidelines

### 1. Unified v4 Utility Structure
* Standard utility grouping: Layout structure -> Spacing -> Typography -> Visual styling (colors, borders) -> Easing/Transitions.
* Example: `flex items-center gap-2 p-4 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-xl shadow-xs transition-all duration-200`

### 2. Easing and Dynamic Effects
* Apply standard hover transitions on buttons and cards using utility selectors: `transition-all duration-200 ease-out hover:-translate-y-0.5`.
* Use CSS theme variables inside class parameters for flexible styling: `bg-[var(--primary)] text-[var(--primary-foreground)]`.

### 3. Responsive Styling
* Follow mobile-first utility styling. Default styling rules apply to small displays, while larger viewport sizes override values using prefix tags:
  * `w-full md:w-1/2 lg:w-1/3`
  * `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
