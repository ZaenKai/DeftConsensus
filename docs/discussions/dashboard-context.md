# Dashboard Context
## Scope
Define and lock Phase 1 dashboard information architecture and interaction boundaries for deftConsensus, with feature authoring/collaboration workflows delegated to feature detail pages.
## Locked Decisions
### 1) App shell pattern
- **Decision**: Use a **persistent left sidebar + compact top bar**.
- **Why**: Scales better for multi-tenant navigation and keeps high-frequency actions visible without overcrowding a top-only nav.
- **Alternatives considered**:
  - Top navigation only
  - Collapsible sidebar + mobile bottom tabs
  - User-toggle layout modes
### 2) Context switching location
- **Decision**: Place **company switcher + project picker in the sidebar header**.
- **Why**: Keeps company/project context persistent and discoverable during navigation.
- **Alternatives considered**:
  - Top-bar-only global switcher
  - Selection only on explorer page
  - Company in sidebar + project in top bar
### 3) Default post-login landing (non-admin)
- **Decision**: Default to **My Work**.
- **Why**: Minimizes time-to-action by prioritizing user-specific triage over passive overview.
- **Alternatives considered**:
  - Last viewed project
  - Company overview
  - Companies & Projects explorer
### 4) Companies & Projects explorer structure
- **Decision**: Use **company-grouped explorer with expandable project rows**.
- **Why**: Matches multi-tenant mental models and improves organization-level scanning.
- **Alternatives considered**:
  - Flat project list
  - Separate Companies/Projects tabs
  - Card/grid-first by status
### 5) Dashboard vs detail-page editing boundary
- **Decision**: Keep project dashboard **read-first with lightweight actions only**.
- **Why**: Preserves dashboard speed for triage/routing and prevents complex editing sprawl.
- **Alternatives considered**:
  - Strictly read-only dashboard
  - Full inline editing in dashboard
  - Role-based inline editing
### 6) Status taxonomy
- **Decision**: Use consensus pipeline statuses: `Proposed`, `In Discussion`, `Consensus Locked`, `In Build`, `In Verification`, `Blocked`, `Done`.
- **Why**: Reflects product workflow and supports consistent cross-project reporting.
- **Alternatives considered**:
  - Generic delivery statuses
  - Minimal open/blocked/complete statuses
  - Admin-configurable per tenant
### 7) Notifications and comments interaction model
- **Decision**: Implement **Global Inbox page + top-bar bell dropdown**.
- **Why**: Provides one reliable communication clearinghouse while preserving quick triage.
- **Alternatives considered**:
  - Persistent right panel only
  - Per-project activity only
  - Notification center without reply
### 8) Persistent communication widget
- **Decision**: Add **bottom-right persistent inbox/chat widget** to support ongoing exploration + lightweight conversations.
- **Why**: Reduces context switching and keeps communication available during navigation.
- **Alternatives considered**:
  - No persistent widget
  - Full communication center in widget
  - AI-only widget
  - Read-only widget tabs
### 9) Widget v1 capability boundary
- **Decision**: Widget is **lightweight triage only**: unread notifications, recent threads, quick text reply, and "Open full inbox" escape hatch.
- **Why**: Prevents duplication of full Inbox workflows and keeps widget performance predictable.
- **Alternatives considered**:
  - Full-featured communication center
  - AI-only assistant widget
  - Read-only split widget
### 10) My Work default sections
- **Decision**: Include `Action Required`, `Mentions`, `Waiting on Me`, `Recently Updated`.
- **Why**: Covers highest-frequency triage lanes without requiring day-one customization.
- **Alternatives considered**:
  - Assigned-only list
  - Assigned + watched list
  - Fully customizable widgets from day one
### 11) Admin controls placement
- **Decision**: Show a **role-gated `Admin` section in left sidebar**, scoped to selected company.
- **Why**: Keeps admin tools discoverable but separated from contributor daily flow.
- **Alternatives considered**:
  - Company menu entry only
  - Separate external `/admin` surface
  - Hybrid quick links + full section
## Scope Boundary
- Feature authoring, deep collaboration workflows, and full thread management remain in **feature detail pages** and full Inbox surfaces, not in the project dashboard cards.
## Continuity Note
This context locks dashboard IA and interaction boundaries for subsequent specification work; downstream planning should inherit these decisions unless explicitly unlocked.
