# Feature Page Context
## Scope
Define and lock the Phase 1 feature detail page information architecture and collaboration flow for deftConsensus, including brief comparison, chat interaction, voting affordances, and parent/subfeature structure.
## Locked Decisions
### 1) Canonical route structure
- **Decision**: Feature detail route includes full tenancy hierarchy: `companies/[companyId]/projects/[projectId]/features/[featureId]`.
- **Why**: Keeps access context explicit, improves shareability, and supports scoped permissions.
- **Alternatives considered**:
  - Flat `/features/[featureId]` route
  - Project-only nested route without company
### 2) Primary layout
- **Decision**: Use a two-pane desktop layout with Brief on the left and Chat on the right; use stacked/tabbed behavior on smaller screens.
- **Why**: Preserves side-by-side context for discussion and brief evolution without sacrificing mobile usability.
- **Alternatives considered**:
  - Single-column feed only
  - Chat-first full-screen layout
### 3) Header and navigation affordances
- **Decision**: Include explicit back navigation to project dashboard plus contextual hierarchy awareness in page header.
- **Why**: Reduces disorientation and keeps users anchored to project context.
- **Alternatives considered**:
  - Browser-back only
  - No explicit return affordance
### 4) Chat participant presence row
- **Decision**: Show participant avatars at top of chat, stack/compact after three users, and provide participant list reveal + invite affordance.
- **Why**: Keeps active-collaborator awareness visible without excessive header density.
- **Alternatives considered**:
  - Full participant list always visible
  - Hidden participants in secondary menu
### 5) Chat message structure
- **Decision**: Use conversational alignment model (other users left, current user right) and support replies/threads.
- **Why**: Improves scanability and keeps conversation structure familiar.
- **Alternatives considered**:
  - Uniform left-aligned feed
  - Thread-only conversation model
### 6) Brief view model
- **Decision**: Keep exactly two views: `Original` and `In Progress`; no dedicated third diff tab.
- **Why**: Balances clarity with simplicity while avoiding extra navigation complexity.
- **Alternatives considered**:
  - Separate `Diff` tab
  - Single mutable brief view only
### 7) Original brief persistence
- **Decision**: Original brief is immutable and always retained as baseline snapshot.
- **Why**: Enables transparent comparison and supports drift/scope analytics.
- **Alternatives considered**:
  - Overwrite original with merged working draft
  - Keep only latest revision
### 8) In-progress update behavior
- **Decision**: AI continuously proposes and applies in-progress text updates with visible provenance markers for what changed and when.
- **Why**: Increases trust and keeps collaboration auditable without requiring a separate diff view.
- **Alternatives considered**:
  - Batched hidden AI updates
  - Manual-only brief edits
### 9) Voting initiation shortcut
- **Decision**: Chat composer includes a fast `Propose vote` shortcut that captures a concise brief-change completion request.
- **Why**: Reduces friction for transitioning from discussion to decision.
- **Alternatives considered**:
  - Vote initiation only from brief pane
  - Dedicated vote management page only
### 10) Section-level review intent
- **Decision**: Voting and review should support granular section targeting rather than whole-document-only approval.
- **Why**: Encourages precise consensus and reduces all-or-nothing voting bottlenecks.
- **Alternatives considered**:
  - Whole-brief vote only
  - Comment-only with no vote semantics
### 11) Parent/subfeature decomposition
- **Decision**: Support decomposition of long parent features into subfeatures (e.g., Dashboard → Nav, Chat, etc.) with ability to combine outcomes at parent level.
- **Why**: Improves tractability, ownership clarity, and discussion focus for complex initiatives.
- **Alternatives considered**:
  - Single giant feature brief only
  - Independent unrelated feature set with no parent roll-up
### 12) AI update governance
- **Decision**: Use a hybrid update policy in `In Progress`: auto-apply low-risk wording/clarity edits, require human approval for structural or scope-changing edits.
- **Why**: Maintains collaboration speed while guarding against silent scope drift.
- **Alternatives considered**:
  - Full auto-apply for all AI changes
  - Proposal-only with manual acceptance for every change
  - Human-only direct edits
### 13) Subfeature split trigger rule
- **Decision**: Use a system-suggested split model when complexity thresholds are crossed (e.g., brief length, section count, repeated unresolved vote cycles), with human confirmation to proceed.
- **Why**: Encourages decomposition before coordination debt grows while preserving user control over structure.
- **Alternatives considered**:
  - Manual-only splitting
  - Hard-enforced automatic splitting
  - Split only after blocked consensus
### 14) Parent feature completion semantics
- **Decision**: Parent features complete when all required subfeatures are complete; optional subfeatures may remain open.
- **Why**: Ensures delivery of core scope while allowing optional extensions to continue without blocking closure.
- **Alternatives considered**:
  - All subfeatures mandatory for completion
  - Percentage-only weighted completion
  - Fully manual completion override
### 15) Voting governance configurability
- **Decision**: Voting threshold and approval model are configurable in settings at company level with project-level override support.
- **Why**: Supports different governance styles across organizations/projects without hard-coding one policy.
- **Alternatives considered**:
  - Single global immutable voting model
  - Project-only configuration with no company default
  - Hard-coded quorum+majority model
### 16) Forked brief trigger policy
- **Decision**: Auto-suggest a forked brief request when AI detects out-of-scope content, with explicit user confirmation required to create the fork.
- **Why**: Surfaces scope drift early while preserving human control over new workstream creation.
- **Alternatives considered**:
  - Manual-only fork creation
  - Immediate automatic fork creation
  - Fork only after failed vote events
## Open Decisions for Next Rounds
- None for this discuss pass.
## Continuity Note
These locked decisions should be inherited by subsequent specification work unless explicitly unlocked with justification.
