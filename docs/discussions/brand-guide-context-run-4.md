# Brand Guide Context — Run 4

## Purpose
Define and lock the comprehensive brand guide baseline required before frontend feature implementation.

## Locked Brand Decisions

### 1) Visual personality
- **Decision**: Bold, futuristic, high-contrast AI-forward.
- **Why**: Matches product ambition while maintaining a distinctive enterprise-tech identity.
- **Alternatives considered**:
  - Professional/trust-first conservative style
  - Minimal neutral utilitarian style
  - Warm collaborative style

### 2) Theme strategy
- **Decision**: Dual-theme parity from day one (light + dark), with **adaptive/system setting as default** and explicit user override.
- **Why**: Supports accessibility/user preference flexibility while preserving first-class dark-theme intent.
- **Alternatives considered**:
  - Dark-first only
  - Light-first only
  - Adaptive-only with no user override

### 3) Color system (semantic core)
- **Background anchor**: `#302F2F` (dark baseline)
- **Semantic tokens**:
  - `primary`: `#4DA3FF`
  - `secondary`: `#7C6CFF`
  - `accent` (copper): `#C87941`
  - `success`: `#3DDC97`
  - `danger`: `#FF5C7A`
- **Why**: Preserves copper signature while keeping legible, high-energy contrast accents.
- **Alternatives considered**:
  - Blue/cyan-led palettes
  - Purple/magenta-led palettes
  - Other copper variants

### 4) Typography
- **Decision**:
  - Headings: **Domine**
  - Body/UI text: **IBM Plex Sans**
- **Why**: Combines distinctive serif authority for titles with practical, readable sans-serif body text.
- **Alternatives considered**:
  - Space Grotesk + Inter
  - Sora + Inter
  - Orbitron + Manrope

### 5) Spacing system
- **Decision**: 4px base spacing scale (`4, 8, 12, 16, 24, 32, 48, 64`).
- **Why**: Fine control for dense UI details while preserving rhythmic layout spacing.
- **Alternatives considered**:
  - 8px-only scale
  - Mixed ad-hoc scale

### 6) Component style principles
- **Decision**: Soft neumorphic surfaces with low-contrast edges.
- **Why**: Supports the futuristic direction with tactile depth and distinct visual identity.
- **Alternatives considered**:
  - Crisp bordered cards + subtle glow
  - Heavy glassmorphism
  - Ultra-flat minimal

### 7) Tone and voice
- **Decision**: Confident, precise, enterprise-professional.
- **Why**: Fits cross-functional business audiences and trust-sensitive workflow messaging.
- **Alternatives considered**:
  - Friendly/collaborative plain-language
  - Technical detail-heavy authority
  - Provocative challenger tone

### 8) Accessibility baseline
- **Decision**: WCAG 2.1 AA baseline with:
  - `4.5:1` contrast for body text
  - `3:1` contrast for large text and UI components
  - Keyboard-visible focus states
  - Semantic landmark usage
- **Why**: Strong, practical accessibility floor aligned to MVP delivery.
- **Alternatives considered**:
  - WCAG 2.2 AA day-one target
  - AA + AAA selective enhancement

## Implementation note
All visual styling in feature code should reference centralized semantic design tokens derived from this guide; avoid hard-coded values except where explicitly justified.
