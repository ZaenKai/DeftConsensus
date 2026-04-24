# Landing Page Context — Run 3

## Purpose of this revision
Finalize landing-page information architecture and MVP content details after iterative discuss refinement.

## Locked Decisions

### 1) Section order
- **Decision**: Landing page order is **Hero → Value-props (3 cards) → How it works (3 steps)**.
- **Why**: Establishes narrative flow from problem framing to product value to process clarity.
- **Alternatives considered**:
  - Hero-only MVP
  - Hero + How it works directly
  - Inserting trust/FAQ before process section

### 2) Hero messaging and CTAs
- **Decision**:
  - Headline direction: **Align every team before code gets written**
  - Subheadline direction: **Capture stakeholder input, synthesize consensus with swarms, and track verified execution from brief to delivery**
  - Primary CTA label: **Explore how it works** (opens explainer modal)
  - Secondary CTA label: **Sign in to dashboard** (routes to `/login`)
- **Why**: Keeps cross-functional alignment front-and-center while preserving a direct returning-user path.
- **Alternatives considered**:
  - Execution-speed-first headline
  - Product-jargon-first headline
  - Alternate sign-in labeling

### 3) Value-props section
- **Decision**: Use three cards with title + one-sentence description each:
  1. **Cross-functional voice**
  2. **Swarm-assisted planning**
  3. **Transparent roadmap progress**
- **Why**: Reinforces business-wide stakeholder value in concise, scannable form.
- **Alternatives considered**:
  - Title-only cards
  - Bulleted cards
  - Metrics placeholders

### 4) How it works section
- **Decision**:
  - Placed after the value-props section
  - Narrative: **Discuss → Swarm synthesis → Verified implementation**
  - Step titles:
    1. **Discuss needs**
    2. **Synthesize consensus**
    3. **Verify delivery**
  - Each step includes a mini visual using **simple line icon + connector pattern**
  - Section includes CTA: **Explore how it works** (opens explainer modal)
- **Why**: Provides operational clarity without overwhelming MVP scope.
- **Alternatives considered**:
  - Title-only steps
  - Heavier per-step copy
  - Modal-only process flow

### 5) Explainer modal content
- **Decision**: Modal contains **expanded detail for the three value-prop benefits**, not a duplicate full process walkthrough.
- **Why**: Avoids redundant content while deepening benefit comprehension from the primary CTA.
- **Alternatives considered**:
  - Modal showing only 3-step flow
  - Modal showing both flow and benefit deep-dive
  - Replacing modal with dedicated route

## Continuity note
This revision supersedes any conflicting placement/content decisions from prior discuss runs while preserving unchanged constraints (public `/`, static-first MVP state model, centralized mock content, responsive split behavior, WCAG 2.1 AA baseline, and brand-guide-first implementation sequencing).
