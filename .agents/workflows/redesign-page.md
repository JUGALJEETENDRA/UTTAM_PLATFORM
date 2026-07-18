# Workflow: Redesign Page

This workflow guides the structured refactoring and visual redesign of an existing page.

## Workflow Triggers & Execution Order
* **Trigger:** Initiated after a `ui-audit` report has been generated.
* **Responsible Agent Role:** `ui-designer` and `react-expert` / `nextjs-expert`.

---

## Redesign Execution Steps

### Step 1: Establish Constraints & Setup Safety Nets
1. Review [agents.md](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/.agents/agents.md) constraints.
2. Confirm that **NO** business logic, routing, auth, database proxies, or GAS API calls will be modified.
3. Keep the original states and callbacks intact (e.g., maintain `onSubmit`, `fetchGAS` triggers, and component hooks structure).

### Step 2: Refactor Layout & Grid Structure
1. Apply the standard container grids defined in [DESIGN_SYSTEM.md](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/.agents/DESIGN_SYSTEM.md).
2. Replace static heights or hard-coded padding with uniform Tailwind classes matching the spacing scale.
3. Structure panels using flexboxes and responsive grid breakpoints.

### Step 3: Standardize Interface Components
1. Replace ad-hoc elements with standard UI components from [src/components/ui/](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/src/components/ui):
   * Standardize custom buttons to use `<Button variant="..." size="...">`.
   * Use `<Card>` panels for containers.
   * Standardize tags and labels to `<Badge>`.
2. Apply consistent font weight properties to headings and labels.

### Step 4: Refine Aesthetics & Motion
1. Set up subject-specific theme variables mapping to custom visual styling (UI programming sleek slate vs Python terminal neo-brutalism).
2. Integrate subtle Framer Motion enter animations for lists and card grids.
3. Configure hover states (`hover:bg-...`, `hover:scale-...`) and focus outlines.
