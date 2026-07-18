# Workflow: UI/UX Audit

This workflow defines the steps to conduct a professional UI/UX audit of an existing page before applying any design modifications.

## Workflow Triggers & Execution Order
* **Trigger:** Initiated before planning any component rewrite or layout redesign.
* **Responsible Agent Role:** `ux-auditor` (with assistance from `accessibility` and `performance` modules).

---

## Audit Checklist & Steps

### Step 1: Document Current Page State
1. Open the page file to audit.
2. Document the total file size and count of lines (check if the file is excessively large, such as `ClientPage.tsx`).
3. Identify all external dependencies and sub-component imports.

### Step 2: visual & Layout Hierarchy Audit
Evaluate:
* **Visual Hierarchy:** Is the most important action/information visible first? Are headings styled distinct from body copy?
* **Spacing Consistency:** Do elements align to the 4px grid? Are margins and padding uniform?
* **Alignment:** Are labels and inputs correctly aligned? Do layout columns adjust on responsive viewports?

### Step 3: Interactive elements & Forms Audit
Evaluate:
* **Interactive States:** Do buttons, links, and list entries have defined hover, active, and focus states?
* **Input Fields:** Are forms clear and labels readable? Are error validation states styled?

### Step 4: Accessibility (a11y) & Responsiveness Audit
Evaluate:
* **Keyboard Nav:** Can all inputs, tabs, and buttons be reached via keyboard `Tab` sequences? Is there a focus outline?
* **Contrast Ratios:** Do texts have sufficient contrast against page containers?
* **Responsive Breakpoints:** Does the layout break or overflow when scaled down to mobile viewports (`320px` to `768px`)?

---

## Output Report Format
Generate an audit log containing:
1. **Identified Issues:** Grouped by category (Visual Hierarchy, Spacing, Accessibility, Responsiveness).
2. **Impact Score:** Critical (blocks user), Medium (visual bug), Low (polish opportunity).
3. **Proposed Redesign Actions:** Direct items mapping to the `redesign-page` workflow.
