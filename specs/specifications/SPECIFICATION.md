# deftConsensus Feature Page SPECIFICATION
## Overview
Implement the Phase 1 feature detail experience for deftConsensus using mock data only. The page centers on collaborative brief evolution and decision making with a two-pane brief/chat workflow, immutable original brief retention, governed AI-assisted updates, and section-level voting.
## Requirements
### Functional Requirements
- FR-1: Provide nested feature detail route `companies/[companyId]/projects/[projectId]/features/[featureId]`.
- FR-2: Feature page header must expose context hierarchy and explicit back navigation to the project dashboard.
- FR-3: Desktop layout must be two-pane (`Brief` left, `Chat` right) with accessible stacked/tabbed adaptation for smaller breakpoints.
- FR-4: Chat header must display participant avatars, compact overflow after three users, and provide participant list + invite action.
- FR-5: Chat messages must render others left/current user right and support threaded replies.
- FR-6: Brief pane must have exactly two views: `Original` and `In Progress`.
- FR-7: `Original` brief must be immutable and permanently persisted as baseline snapshot.
- FR-8: `In Progress` brief must surface AI provenance markers for updated sections with timestamp context.
- FR-9: AI brief updates must use hybrid governance: auto-apply low-risk wording/clarity edits; require explicit approval for structural/scope-changing edits.
- FR-10: Chat composer must provide a `Propose Vote` shortcut that opens a concise brief-change completion request flow.
- FR-11: Voting must support section-level targets and outcomes.
- FR-12: Voting thresholds/models must be configurable in settings with company defaults and project-level overrides.
- FR-13: Parent features must support subfeature decomposition, with system-suggested splitting at complexity thresholds requiring human confirmation.
- FR-14: Parent feature completion requires all required subfeatures complete; optional subfeatures may remain open.
- FR-15: Out-of-scope content must trigger forked-brief suggestions requiring user confirmation to create the fork.
- FR-16: Feature page must provide explicit default/loading/empty/error states across brief/chat/vote/fork interactions.
- FR-17: Centralize all feature-page data/state fixtures in typed mock modules for Phase 1.
### Non-Functional Requirements
- NFR-1: Meet WCAG 2.1 AA baseline for keyboard navigation, focus visibility, semantic landmarks, and contrast.
- NFR-2: Preserve collaboration usability across mobile/tablet/desktop responsive states.
- NFR-3: Use semantic design tokens for styling; avoid unjustified hard-coded visual values.
- NFR-4: Add automated coverage for route context resolution, governance gating, section-level votes, subfeature logic, and fork suggestion flows.
## Page Specification
### Route: `companies/[companyId]/projects/[projectId]/features/[featureId]`
- Goal and primary action: Move a feature brief from discussion toward approved scope with transparent evolution tracking.
- Required sections/components:
  - Context header (breadcrumb + back action + feature metadata)
  - Brief pane (`Original`, `In Progress`)
  - Chat pane (participant row, message list, composer, threaded replies)
  - Vote shortcut and vote-request modal
  - Fork suggestion prompt
- Navigation entry/exit:
  - Entry from project dashboard feature list
  - Exits to project dashboard, Inbox references, and related subfeature routes
- UI states:
  - Default/loading/empty/error for brief pane, chat pane, vote requests, and fork prompts
- Required mock data shape:
  - Feature identity, hierarchy, participants, section list, brief versions, AI update events, vote rules, vote outcomes, subfeature links, fork candidates
- Responsive behavior:
  - Desktop persistent two-pane
  - Tablet/mobile stacked or tabbed pane switcher
- Accessibility expectations:
  - Keyboard access for pane toggles, message reply actions, vote modal controls, and provenance navigation
## Settings Touchpoints
### Company Settings (default governance)
- Configure voting model, quorum/threshold defaults, and section-vote behavior defaults.
### Project Settings (override governance)
- Override company defaults for project-specific vote models and threshold rules.
## Architecture
- Framework: Next.js App Router with authenticated shell and nested context route.
- Component domains:
  - `src/components/feature-page/header/*`
  - `src/components/feature-page/brief/*`
  - `src/components/feature-page/chat/*`
  - `src/components/feature-page/voting/*`
  - `src/components/feature-page/subfeatures/*`
- Data model:
  - Centralized typed mocks for:
    - route context (company/project/feature)
    - brief versions (`original`, `inProgress`)
    - section provenance and AI update logs
    - vote policy settings and outcomes
    - parent/subfeature relationships and completion roll-up
    - fork suggestion candidates
- State model:
  - Active brief view state
  - Thread/reply context state
  - Vote request workflow state
  - Governance resolution state (company default → project override)
## Implementation Plan
### Phase 1: Data contracts and governance baselines
#### Subphase 1.1: Route and feature-domain contracts
- Task 1.1.1: Define route context and typed feature entities in centralized mock modules (traces: FR-1, FR-17, NFR-3)
  - Dependencies: none
  - Acceptance: Mock contracts represent company/project/feature identity, participants, brief sections, and chat threads.
- Task 1.1.2: Model brief versions and section provenance for `Original` and `In Progress` (traces: FR-6, FR-7, FR-8)
  - Dependencies: 1.1.1
  - Acceptance: Original snapshot is immutable; In Progress supports section-level provenance metadata.
#### Subphase 1.2: Governance and decomposition contracts
- Task 1.2.1: Define governance settings model with company defaults and project overrides (traces: FR-12, NFR-4)
  - Dependencies: 1.1.1
  - Acceptance: Vote model and threshold resolution is deterministic and testable.
- Task 1.2.2: Define subfeature split-threshold and required/optional completion models (traces: FR-13, FR-14, NFR-4)
  - Dependencies: 1.1.1
  - Acceptance: Parent/subfeature contracts encode split suggestions and completion semantics.
### Phase 2: Feature page shell and interaction layout
#### Subphase 2.1: Header and pane composition
- Task 2.1.1: Implement context header with hierarchy and back navigation (traces: FR-2, FR-1)
  - Dependencies: 1.1.1
  - Acceptance: Header consistently anchors users to company/project/feature context.
- Task 2.1.2: Implement two-pane desktop layout with accessible stacked/tabbed responsive behavior (traces: FR-3, NFR-1, NFR-2)
  - Dependencies: 2.1.1
  - Acceptance: Brief/chat workflows remain usable across breakpoints.
#### Subphase 2.2: Participant and chat structure
- Task 2.2.1: Implement participant avatar row with compact overflow and invite/list actions (traces: FR-4, NFR-2)
  - Dependencies: 2.1.2
  - Acceptance: Participants are visible and manageable without clutter.
- Task 2.2.2: Implement aligned chat message rendering with threaded replies (traces: FR-5, NFR-1)
  - Dependencies: 2.1.2
  - Acceptance: Message flow is clear and reply context remains traceable.
### Phase 3: Brief workspace and decision flows
#### Subphase 3.1: Brief behavior and provenance
- Task 3.1.1: Implement dual-view brief workspace with immutable original and governed in-progress updates (traces: FR-6, FR-7, FR-9)
  - Dependencies: 1.1.2, 2.1.2
  - Acceptance: Users can inspect original baseline and in-progress content without overwriting baseline.
- Task 3.1.2: Render section-level AI provenance and update metadata in In Progress (traces: FR-8, NFR-4)
  - Dependencies: 3.1.1
  - Acceptance: AI-touched sections display origin and timestamp details.
#### Subphase 3.2: Voting workflows
- Task 3.2.1: Implement `Propose Vote` shortcut and minimal request modal in chat composer (traces: FR-10, FR-16)
  - Dependencies: 2.2.2
  - Acceptance: Users can initiate vote flow directly from conversation context.
- Task 3.2.2: Implement section-targeted voting with governance rule resolution (traces: FR-11, FR-12, NFR-4)
  - Dependencies: 1.2.1, 3.1.2, 3.2.1
  - Acceptance: Section vote outcomes follow effective company/project configuration.
### Phase 4: Scope control and decomposition behavior
#### Subphase 4.1: Out-of-scope fork handling
- Task 4.1.1: Implement fork suggestion prompts with explicit user confirmation (traces: FR-15, FR-16)
  - Dependencies: 3.1.2
  - Acceptance: Forks are suggested proactively but never auto-created.
#### Subphase 4.2: Parent/subfeature orchestration
- Task 4.2.1: Implement system-suggested split prompts at complexity thresholds with human confirmation (traces: FR-13, NFR-4)
  - Dependencies: 1.2.2
  - Acceptance: Complex parent features prompt decomposition without forced splitting.
- Task 4.2.2: Implement required/optional subfeature completion roll-up for parent status (traces: FR-14, NFR-4)
  - Dependencies: 1.2.2, 4.2.1
  - Acceptance: Parent completion aligns with required-subfeature semantics.
### Phase 5: Accessibility, state hardening, and verification
#### Subphase 5.1: UI states and accessibility
- Task 5.1.1: Add explicit default/loading/empty/error states across brief/chat/vote/fork flows (traces: FR-16, NFR-2)
  - Dependencies: 4.2.2
  - Acceptance: All primary interactions include resilient fallback states.
- Task 5.1.2: Validate keyboard navigation, focus management, semantics, and contrast (traces: NFR-1, NFR-3)
  - Dependencies: 5.1.1
  - Acceptance: Implemented surfaces satisfy WCAG 2.1 AA baseline checks.
#### Subphase 5.2: Automated tests and quality gate
- Task 5.2.1: Add tests for route context, AI governance gating, section votes, decomposition logic, and fork suggestions (traces: FR-1, FR-9, FR-11, FR-12, FR-13, FR-14, FR-15, NFR-4)
  - Dependencies: 5.1.2
  - Acceptance: Tests enforce locked feature-page collaboration/governance behavior.
- Task 5.2.2: Run lint/test/build quality gate and requirement traceability review (traces: FR-1..FR-17, NFR-1..NFR-4)
  - Dependencies: 5.2.1
  - Acceptance: Quality checks pass and implementation maps to all requirements.
## Testing Strategy
- Unit tests for governance rule resolution, subfeature completion logic, and fork-suggestion triggers.
- Component tests for header context controls, brief views, provenance markers, chat threading, and vote modal interactions.
- Route integration tests for nested context resolution and project-dashboard return flows.
- Accessibility tests for pane navigation, modals, keyboard shortcuts, and focus behavior.
## Deployment
- Phase 1 remains mock-data-only with no live API/database/auth provider integrations.
- Ship implementation changes only after passing the project quality gate (`task check`).
