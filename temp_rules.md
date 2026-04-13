# deftConsensus Temporary Ruleset (v0.1)

## 1) Local-only Git operations (temporary policy)
- Allowed: local git actions only (`status`, `diff`, `add`, `commit`, `branch`, `log`, etc.).
- Disallowed: any remote interaction (`push`, `pull`, `fetch`, remote rebase/merge from origin).
- This rule remains active until explicitly revoked by the user.

## 2) Phase 1 is frontend-only and isolated from external systems
- No live integrations in Phase 1 (no APIs, servers, databases, auth providers, or external services).
- Use mock data only.
- All mock data must be kept in one centralized location.

## 3) Brand guide gate before frontend implementation
- No frontend feature implementation begins until a comprehensive brand guide is drafted and approved with user input.
- The brand guide must define at minimum: color system, typography, spacing, component style principles, tone/voice, and accessibility baseline.

## 4) Semantic design tokens are required
- Frontend styling must use semantic tokens by default.
- Hard-coded visual values in feature code are discouraged and require explicit justification.
- Token definitions must be centralized and reusable.

## 5) Route/Page Planning Gate before frontend development
- No frontend page or route implementation starts until all Phase 1 routes/pages are reviewed and approved with the user.
- A route/page is only approved when its page spec is complete and signed off.
- Each page spec must include:
  - Route path and route name
  - Page goal and primary user action
  - Required sections/components
  - Navigation entry points and exits
  - UI states: default, loading, empty, error
  - Required mock data shape
  - Responsive behavior (mobile/tablet/desktop)
  - Accessibility expectations
