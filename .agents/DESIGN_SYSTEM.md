# Design System: Edtech Learning Platform

This document defines the core tokens, structural guidelines, and component standards for the platform. The design system is implemented using **Tailwind CSS v4** styling tokens defined in [globals.css](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/app/globals.css).

---

## 1. Core Tokens & Constants

### 1.1 Color Palette
The platform utilizes a hybrid design approach that matches distinct visual themes based on the academic subject. 

#### Root CSS Variables (Default Light Theme)
* `--background`: `#ffffff` (Base canvas)
* `--foreground`: `#18181b` (Secondary body text)
* `--card`: `#ffffff` (Surface containers)
* `--primary`: `#9b0000` (Core brand/accent color)
* `--secondary`: `#f4f4f5` (Subtle UI panels)
* `--muted-foreground`: `#71717a` (Caption/Muted labels)
* `--border`: `#e4e4e7` (Divider lines)
* `--radius`: `0.625rem` (`10px` base radius)

#### Subject-Specific Custom Themes
1. **UI Programming (Sleek Clean Slate):**
   * High-contrast indigo offsets, clean rounded borders, minimal subtle drop shadows.
   * Background: `#f8fafc`, Button primary: `#4f46e5`, Cards: `#ffffff`.
2. **Python Programming (Neo-Brutalist Terminal):**
   * Flat thick borders, sharp edges, dark console background, vibrant retro accents.
   * Background: `#0C0A09`, Button primary: `#FFD43B` (yellow), Border: `4px border-[#3776AB]`.

---

### 1.2 Typography & Hierarchy
All text sizing is driven by the base sans-serif stack. Font-weights map to standard weights:

| Class | CSS Equivalent | Use Case |
|---|---|---|
| `font-sans` | `System Sans-Serif` | Main layout, body copy, form fields. |
| `font-mono` | `Geist Mono` | Code blocks, metadata, status logs. |
| `tracking-tight` | `-0.025em` | Headers, page titles, card headers. |
| `tracking-wide` | `0.025em` | Badges, buttons, micro-navigation. |

#### Size Scale
* `text-xs`: `0.75rem` (Micro-labels, badge metadata)
* `text-sm`: `0.875rem` (Body copy, table elements, list items)
* `text-base`: `1rem` (Primary card descriptions, input labels)
* `text-lg`: `1.125rem` (Sub-headings, quiz question text)
* `text-xl`: `1.25rem` (Card titles)
* `text-2xl` to `text-4xl`: `1.5rem` to `2.25rem` (Page headers, dashboard title cards)

---

### 1.3 Spacing Scale & Grid System
We enforce a strict 4-pixel grid system to maintain vertical and horizontal alignment:

* **Micro-padding:** `p-1` (`4px`), `p-2` (`8px`), `p-3` (`12px`)
* **Standard-padding:** `p-4` (`16px`), `p-6` (`24px`), `p-8` (`32px`)
* **Container Margins:** `gap-4` or `gap-6` for grid items.

#### Grids
Use Tailwind standard layout grids:
* Dashboard Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
* Split Page: `grid grid-cols-1 lg:grid-cols-4 gap-8` (where main content takes `col-span-3`, sidebar takes `col-span-1`).

---

### 1.4 Border Radius & Shadows
* `rounded-sm`: `0.375rem` (`6px`) - Used for small badges, tags, and check boxes.
* `rounded-md`: `0.5rem` (`8px`) - Used for buttons, input fields, dropdown menus.
* `rounded-xl` or `rounded-2xl`: `0.625rem` to `1rem` - Standard card containers.
* **Shadows:** Standard modern shadow system uses elevation levels:
  * `shadow-xs`: Subtle card highlight borders.
  * `shadow-sm`: Interactive component states (e.g. button hover).
  * `shadow-md`: Modal overlays, dropdowns, floating menus.

---

## 2. Component Guidelines & Styling Standards

### 2.1 Buttons (`Button`)
Use the base [button.tsx](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/ui/button.tsx) component. Never define ad-hoc buttons:
* **Primary:** Brand-accented background (`bg-primary text-primary-foreground`). Use for high-priority operations.
* **Secondary:** Subtle slate paneling (`bg-secondary text-secondary-foreground`). Use for utility options.
* **Outline:** Thin border (`border border-input bg-background`). Use for pagination and filters.
* **Ghost:** Completely transparent. Use for icon triggers.

### 2.2 Cards (`Card`)
Standard container element built using the `Card` component from [card.tsx](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/ui/card.tsx).
* Always group inside a grid.
* Must include a distinct `<CardHeader>` containing a `<CardTitle>` and optional `<CardDescription>`.

### 2.3 Navigation (`MainNavbar`)
The main menu structure in [MainNavbar.tsx](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/layout/MainNavbar.tsx):
* Strictly layout-responsive (shrinks to a burger icon on mobile screens).
* Displays current user status (Student vs Faculty credentials).

### 2.4 Empty & Loading States
* **Loading:** Use `Skeleton` blocks from [skeleton.tsx](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/ui/skeleton.tsx) rather than full page blocking load screens to avoid visual jumps.
* **Empty States:** Render a centered container with:
  * A faded Lucide icon.
  * A clear headline (e.g., "No simulations found").
  * A call-to-action button to create or refresh data.

---

## 3. Motion & Interaction Rules

### 3.1 Animations
Animations should feel lightweight and modern.
* Use **Framer Motion** for state transitions (e.g., `<motion.div>` for card entries or expanding accordion panels).
* Always apply `layout` attributes to list items to animate re-ordering.
* Apply subtle scale modifications on hover: `whileHover={{ scale: 1.02 }}`.

### 3.2 Transitions
For simple layout highlights, use Tailwind's native transitions:
* Transition duration must be `duration-200` (`200ms`).
* Standard easing: `cubic-bezier(0.16, 1, 0.3, 1)` (out-quintic).

---

## 4. Accessibility (a11y) & Dark Mode

### 4.1 Accessibility Standards
* **Color Contrast:** Foreground text must meet WCAG AA standards against card backgrounds.
* **Interactive Elements:** Ensure focus visible boundaries are visible when navigating via keyboard (`focus-visible:ring-2`).
* **ARIA Roles:** Assign proper descriptive values (e.g., `role="dialog"` on modals, `aria-expanded` on accordion menus).

### 4.2 Dark Mode Guidelines
* Dark mode is managed by applying the `.dark` class to the `<html>` or `<body>` element.
* Avoid absolute dark values (use `--background: #18181b` and `--card: #27272a` from [globals.css](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/app/globals.css)).
* Use Tailwind utility patterns prefixed with `dark:` or mapped centrally to CSS variable overrides.
