# DeftConsensus
DeftConsensus is a **Consensus-as-Code** platform: it turns product discussion into structured, reviewable, and trackable delivery decisions before implementation starts.
Instead of jumping from chat to code with missing context, teams use DeftConsensus to align on scope, rationale, ownership, and verification signals first.

---

## Why this exists
Most projects break down in the handoff between:
- what stakeholders mean,
- what teams document,
- and what engineering actually builds.

DeftConsensus was created to close that gap.
It gives teams a shared surface where scope, discussion, voting, and change intent stay connected all the way from idea to build-ready agreement.

---

## What the platform is
At a product level, DeftConsensus is a workspace for:
- **Multi-company / multi-project collaboration**
- **Feature-level decision workflows**
- **Traceable brief evolution**
- **Governed, section-level agreement**
- **Operational triage (inbox + quick replies + notifications)**

At a system level (current repo), this is a **frontend-first Next.js implementation** with centralized typed mock data and no live integrations yet.

---

## Core capabilities (implemented)
### 1) Landing and product positioning
- Marketing/intro landing page at `/`
- Light/dark/system theme toggle
- Modal-based explainer and value proposition sections

### 2) Dashboard shell for day-to-day operations
- Persistent sidebar + topbar layout
- Context-aware navigation for work surfaces
- Role-gated Admin entry in navigation
- Persistent inbox quick-reply widget

### 3) My Work triage
- Structured work buckets:
  - Action Required
  - Mentions
  - Waiting on Me
  - Recently Updated
- Summary counters and empty/loading/error states

### 4) Companies & Projects explorer
- Search, sort, filter, and grouped/flat project views
- Company-grouped project expansion
- Project drill-down entry points

### 5) Project summary dashboards
- Features grouped by lifecycle status
- Status metrics and lightweight feature actions
- Fast link into detailed feature collaboration routes

### 6) Feature collaboration workspace (key differentiator)
- Canonical route shape:
  - `/companies/[companyId]/projects/[projectId]/features/[featureId]`
- Two-pane desktop layout (brief + chat) with responsive adaptation
- `Original` vs `In Progress` brief views
- Immutable original brief baseline
- AI update provenance and risk-aware governance behavior:
  - low-risk updates auto-apply
  - high-risk updates require explicit approval
- Section-level vote modeling and evaluation
- Subfeature decomposition panel and parent completion logic
- Fork suggestion flow for out-of-scope discussion

### 7) Inbox operations
- Global inbox page with filters
- Notification stream with read-state handling
- Quick reply workflow
- Recent comment visibility

### 8) Settings and admin foundations
- Profile/preferences surface
- Session/security placeholders
- Company admin settings and policy placeholders

---

## Product workflow concept
DeftConsensus is designed around a deliberate flow:
1. **Discuss** a feature in context
2. **Refine** the brief while preserving the original baseline
3. **Govern** scope changes with explicit policy and section-level voting
4. **Lock consensus** before implementation
5. **Carry intent forward** into build and verification

This reduces ambiguity, silent scope drift, and rework from unclear approvals.

---

## Current lifecycle model
The dashboard and mocks encode a feature status sequence:
- Proposed
- In Discussion
- Consensus Locked
- In Build
- In Verification
- Blocked
- Done

---

## Route map
### Public
- `/` → Landing page
- `/login` → Redirects to dashboard

### Authenticated dashboard surfaces
- `/dashboard` → My Work
- `/projects` → Companies & Projects Explorer
- `/projects/[projectId]` → Project Summary
- `/projects/[projectId]/features/[featureId]` → Feature detail compatibility route
- `/companies/[companyId]/projects/[projectId]/features/[featureId]` → Canonical feature workspace
- `/inbox` → Global inbox
- `/settings/profile` → User profile/preferences
- `/admin/company` → Company admin page (role-gated)

---

## Tech stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS
- **Testing**: Vitest + Testing Library
- **UI utilities**: Radix UI primitives (dialog)

---

## Architecture snapshot
```text
src/
  app/
    (dashboard)/...         # Route surfaces
    login/
    page.tsx                # Landing
  components/
    dashboard/              # Shell, explorer, project summary, inbox, settings, admin
    feature-page/           # Brief/chat/voting/subfeature workflows
    landing/                # Public marketing surface
  mocks/
    dashboard.ts            # Dashboard domain fixtures + selectors/helpers
    feature-page.ts         # Collaboration fixtures + governance logic
    landing.ts              # Landing content fixtures
specs/
  discussions/              # Decision context artifacts
  specifications/           # Product specification
```

---

## Local development
### Prerequisites
- Node.js (modern LTS recommended)
- npm

### Install
```bash
npm install
```

### Run dev server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start production build
```bash
npm run start
```

### Lint
```bash
npm run lint
```

### Test
```bash
npm run test
```

---

## Working with UI states (demo/testing)
Several routes support query-param state simulation for UI hardening:
- `?state=loading`
- `?state=empty`
- `?state=error`

Feature workspace also supports pane-specific state params:
- `briefState`
- `chatState`
- `voteState`
- `forkState`

Example:
`/companies/acme/projects/apollo/features/feat-consensus?briefState=loading&voteState=error`

---

## Current project constraints
This repository is currently operating in a **Phase 1 frontend-isolated mode**:
- No live APIs or external integrations
- Mock data is the source of truth
- Focus is interaction model, governance behavior, and UX/state coverage

---

## Roadmap direction
Near-term evolution includes:
- Full backend persistence and auth
- Real workflow orchestration for consensus events
- Verification/reporting surfaces tied to delivery outcomes
- Slack integration track (planned revisit), including channel lifecycle, brief publishing, and policy-aware automation

---

## Who this is for
- Product + engineering teams with high coordination overhead
- Teams that need explicit consensus checkpoints
- Organizations that want better traceability from idea to implementation
- Multi-team programs where scope clarity is critical

---

## Contributing
Contributions are welcome.
When contributing:
- keep feature behavior aligned with `specs/specifications/SPECIFICATION.md`
- preserve mock-driven behavior unless integration scope is explicitly opened
- include tests for behavior and state handling when possible

---

## TL;DR
DeftConsensus helps teams move from “we talked about it” to “we agreed on it, we can prove it, and now we can build it.”
