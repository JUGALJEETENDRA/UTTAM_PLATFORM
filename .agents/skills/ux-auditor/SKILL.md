---
name: ux-auditor
description: Instructions for audits on visual hierarchy, layout alignment, typography, information density, and user workflows.
---

# UX Auditor Skill

Use this skill when auditing a page's layout, interactive elements, reading flow, and usability.

## Audit Workflow

### 1. Information Density & Whitespace Control
* Check if text blocks are overwhelming. Introduce vertical whitespace (`py-4` or `space-y-6`) where needed.
* Ensure adequate gutter space: standard desktop page layouts must have at least `px-6` or `px-8` side margins.

### 2. Reading Flow & Hierarchy Check
* Highlight sections where visual hierarchy is missing (e.g., subtitles having the same color/size as normal body text).
* Verify that primary actions (buttons like "Start Quiz" or "Create Module") are visually distinct from utility actions (like "Go Back" or "Download CSV").

### 3. Interactive Feedback Check
* Audit active, focus, and hover behaviors on all buttons and cards.
* Ensure text input fields have clear helper messages and form validation cues.
