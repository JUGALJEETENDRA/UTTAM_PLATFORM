---
name: design-system
description: Consistency helper mapping spacing, colors, typography, buttons, and animations to the design system tokens.
---

# Design System Skill

Use this skill to enforce design token compliance with [DESIGN_SYSTEM.md](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/.agents/DESIGN_SYSTEM.md) and Tailwind CSS v4 configurations.

## Compliance Checklist

### 1. Spacing & Grids
* Validate that padding, margins, and gaps are mapped to standard Tailwind increments (e.g. `p-4`, `m-2`, `gap-6`).
* Avoid manual inline pixel paddings (like `style={{ paddingLeft: '11px' }}`).

### 2. Typographic Standard
* Headers must use sizes `text-xl`, `text-2xl`, or `text-3xl` with standard margins.
* Subtitle text must use `text-sm` or `text-xs` with `--muted-foreground` (or `text-zinc-550`).

### 3. Component Standardization
* Standardize custom buttons to use the core `<Button>` component variants.
* Ensure container cards match `<Card>` standard configurations.
* Replace local text tag bubbles with the standardized `<Badge>`.
