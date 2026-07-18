---
name: component-architect
description: Rules for designing highly reusable, modular React components with clean props interfaces.
---

# Component Architect Skill

Use this skill to design reusable components, decoupling logic and interface layout.

## Design Patterns

### 1. Composition Over Inherited Properties
* Build flexible sub-containers that accept a React `children` prop rather than nesting layout styles inside static templates.
* Separate header text labels, card bodies, and footers as modular nested structures (e.g. `<CardHeader>`, `<CardContent>`).

### 2. Interface Prop Typing
* Annotate props with exact TypeScript type representations.
* Declare dynamic optional attributes with `?`.
* Type callback event handlers explicitly:
  ```typescript
  interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tabName: string) => void;
  }
  ```

### 3. Styling Isolation
* Components must manage their own internal layout but delegate external positioning (margins, alignments) to their parents via standard container styling classes.
* Merge incoming classes dynamically using the `cn(...)` utility helper.
