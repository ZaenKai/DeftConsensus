# Deft Directive — AI Development Framework

Deft Directive is installed in `deft/`. Full guidelines: `deft/main.md`.

This project uses the **v0.20 vBRIEF document model** — structured JSON under
`vbrief/` is the source of truth; `PROJECT.md`, `SPECIFICATION.md`, `PRD.md`, and
`ROADMAP.md` at the repo root are auto-generated rendered reports. Do not edit
them by hand.

## Session start

1. Read this file (you are here).
2. Read `vbrief/PROJECT-DEFINITION.vbrief.json` for project identity, strategy,
   and project-specific rules.
3. Read the user preferences at `%APPDATA%\deft\USER.md` (Windows) or
   `~/.config/deft/USER.md` (Unix) if present — these override everything else.
4. If you are unsure about framework conventions, consult `deft/main.md` and
   `deft/REFERENCES.md` on demand (do not read the whole framework upfront).
5. Before every commit, run `task check`.

If `vbrief/` is missing or the repo is in a pre-v0.20 state, run
`task migrate:vbrief -- --dry-run` first, then `task migrate:vbrief`.

## Source-of-truth workflow

| Artifact                          | Source                                    | Regenerate with        |
|-----------------------------------|-------------------------------------------|------------------------|
| `PROJECT.md`                      | `vbrief/PROJECT-DEFINITION.vbrief.json`   | `task project:render`  |
| `SPECIFICATION.md`                | `vbrief/specification.vbrief.json`        | `task spec:render`     |
| `PRD.md`                          | `vbrief/specification.vbrief.json`        | `task prd:render`      |
| `ROADMAP.md`                      | `vbrief/pending/*.vbrief.json`            | `task roadmap:render`  |
| Scoped work items                 | `vbrief/{proposed,pending,active,completed,cancelled}/*.vbrief.json` | scope:* tasks below |

## Common tasks

```bash
task --list                       # All available tasks
task check                        # Pre-commit quality gate
task vbrief:validate              # Validate vBRIEF lifecycle + cross-file consistency
task scope:promote -- <name>      # proposed/ -> pending/
task scope:activate -- <name>     # pending/  -> active/
task scope:complete -- <name>     # active/   -> completed/
task issue:ingest -- <N>          # GitHub issue -> scope vBRIEF
task reconcile:issues             # Diff GitHub issues vs vBRIEF references
```

## Skills

Skills live under `deft/skills/deft-directive-*`. Invoke them by name when the
user's intent matches a skill's `description` frontmatter.

- `deft-directive-setup`       — bootstrap or reconfigure a project
- `deft-directive-interview`   — structured spec interview
- `deft-directive-refinement`  — prepare/refine a scope before build
- `deft-directive-build`       — implement a scope
- `deft-directive-pre-pr`      — pre-PR verification checklist
- `deft-directive-review-cycle` — post-PR review iteration
- `deft-directive-swarm`       — multi-agent parallel workflow
- `deft-directive-sync`        — session-start sync + legacy review

## Project-specific rules

See the `Requirements` and `ProjectRules` narratives in
`vbrief/PROJECT-DEFINITION.vbrief.json` for the current, authoritative list.
