# Workflow: Component Refactor

This workflow coordinates the extraction of duplicated or oversized JSX chunks into reusable React components.

## Workflow Triggers & Execution Order
* **Trigger:** Triggered when the `ui-audit` identifies duplicated UI patterns, or when a file exceeds size limits (e.g. `ClientPage.tsx` splitting).
* **Responsible Agent Role:** `component-architect` and `react-expert`.

---

## Component Extraction Guidelines

### Step 1: Identify Code Duplication
1. Scan the targeted page files for matching JSX element clusters.
2. Group duplicates by context:
   * **Base UI Elements:** Button variants, status lights, specific badges. Extract to `src/components/ui/`.
   * **Data Card Layouts:** Standard list items, visual boxes. Extract to `src/components/cards/`.
   * **Section Panels:** Accordion lists, navigation sidebars, forms. Extract to `src/components/student/` or `src/components/faculty/`.

### Step 2: Define strict TypeScript interfaces
1. Create a clear interface block for the new component's props.
2. Avoid generic types or `any`.
3. Annotate callback event arguments explicitly (e.g., `onSelect: (id: string) => void`).

### Step 3: Extract and Refactor
1. Move the component block into a separate file under `src/components/`.
2. Clean up styling to use theme tokens from [DESIGN_SYSTEM.md](file:///c:/Users/ADITYA/OneDrive/Desktop/pROJECT/PS-3-Pages-Client-Only/.agents/DESIGN_SYSTEM.md).
3. Import the newly extracted component back into the parent layout.

### Step 4: Validate Component Integration
1. Run local compilation check using `.\node_modules\.bin\tsc.cmd --noEmit` to ensure types resolve.
2. Verify all parent state values load and callbacks fire successfully.
