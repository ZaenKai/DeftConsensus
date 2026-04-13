# Landing Page Context

## Scope
Define the Phase 1 landing page for `deftConsensus` with locked product and UX decisions before specification/implementation.

## Locked Decisions

### 1) Primary action
- **Decision**: Primary CTA intent is **Learn/explore product first**.
- **Why**: Reduces commitment friction on first contact and fits a discovery-first entry point.
- **Alternatives considered**:
  - Start new consensus flow
  - Join existing consensus flow
  - Sign in to dashboard

### 2) Secondary action
- **Decision**: Secondary CTA is **Sign in to dashboard**.
- **Why**: Preserves a direct path for returning users while keeping exploration as the main path.
- **Alternatives considered**:
  - Join existing consensus flow
  - Learn how it works
  - No secondary action

### 3) Route and access model
- **Decision**: Landing page is public at **`/`** for unauthenticated users.
- **Why**: Standard web-app entry pattern and lowest-friction acquisition path.
- **Alternatives considered**:
  - Public `/landing` route
  - Authenticated-only root route

### 4) Launch content scope
- **Decision**: Launch includes **hero section only**.
- **Why**: Keeps MVP surface minimal and focused.
- **Alternatives considered**:
  - Add how-it-works, feature, trust, FAQ, and broader marketing sections

### 5) Primary CTA behavior
- **Decision**: Primary CTA opens a **lightweight explainer modal** on the same page.
- **Why**: Supports exploration intent without route transition overhead.
- **Alternatives considered**:
  - Navigate to `/how-it-works`
  - Scroll to another section on page
  - Link to external docs/video

### 6) Secondary CTA route
- **Decision**: Secondary CTA routes to **`/login`**.
- **Why**: Conventional route naming and low ambiguity.
- **Alternatives considered**:
  - `/signin`
  - `/auth/sign-in`

### 7) UI state model
- **Decision**: **Static content** MVP with default state + global error boundary fallback.
- **Why**: No async dependency for initial hero experience; simpler implementation.
- **Alternatives considered**:
  - Async hero content with loading/error states
  - Async modal content with loading/empty/error states
  - Fully async sections

### 8) Mock data handling
- **Decision**: Centralize hero and modal copy in a **shared mock data module**.
- **Why**: Satisfies Phase 1 isolation rule and keeps mock content maintainable.
- **Alternatives considered**:
  - Hard-coded strings in component
  - Route-local JSON file
  - No abstraction

### 9) Responsive behavior
- **Decision**: Mobile-first single column; on medium+ breakpoints, split layout (content left, actions right).
- **Why**: Improves readability and CTA clarity across breakpoints.
- **Alternatives considered**:
  - Single-column everywhere
  - Desktop-first split, then collapse

### 10) Accessibility baseline
- **Decision**: Enforce **WCAG 2.1 AA** baseline (semantic landmarks, keyboard navigation, visible focus, sufficient contrast).
- **Why**: Strong default quality bar with broad compatibility.
- **Alternatives considered**:
  - Basic accessibility only
  - WCAG 2.2 AA

## Deferred Items
- Additional landing sections beyond hero (how-it-works, trust, FAQ, extended marketing content) are deferred.

