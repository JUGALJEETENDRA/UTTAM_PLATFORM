---
name: nextjs-expert
description: Guidelines for App Router page layout designs, metadata, routing optimizations, and dynamic imports.
---

# Next.js Expert Skill

Use this skill when designing page layouts, optimizing route segments, or configuring App Router endpoints.

## App Router Rules

### 1. File Structure & Routing
* Follow directory-based page mapping (e.g. `src/app/student/subjects/subject/page.tsx` maps to path `/student/subjects/subject`).
* Use sub-folders like `/item/` or dynamic segments like `/[id]/` to separate list dashboards from individual detail views.

### 2. Static Site Optimization (SSG)
* For static pages deployed via GitHub Actions, ensure data is hydrated correctly from static assets like `data.json` at build time.
* Add static metadata headers on pages using the Next.js `Metadata` type block to optimize SEO structures.

### 3. Build optimizations
* Use standard dynamic imports (`next/dynamic`) to split loading weights for bulky client libraries (like `tiptap` or `pdfjs-dist`).
* Avoid using external server imports inside files containing the `"use client"` directive.
