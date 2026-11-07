# APEX / LAB Repository Audit

Audit date: 2026-11-07
Repository reviewed: `Payasgo/virtual_f1_engineering`
Default branch at review: `master`

## Overall assessment
The repository has evolved into a working React/Vite learning prototype with a dark engineering-workstation UI, F1 lesson content, CSV telemetry viewing, an OpenF1 live/historical data page, and simplified aero, dynamics and strategy experiments. The original FreeCAD, CFD workflow, Python analysis scripts and design inputs are still present.

This is a promising educational prototype, but it is not yet a validated engineering simulator or a production-grade live race telemetry platform.

## Inventory
| Area | Files | Current role |
|---|---|---|
| Frontend | `src/App.jsx`, `src/main.jsx`, `src/styles.css` | Single-page React learning app |
| Build | `package.json`, `vite.config.js`, `index.html` | Vite build, vendor chunking |
| CI | `.github/workflows/build.yml` | Build + Python syntax checks after this audit branch |
| Lessons | Embedded in `src/App.jsx` | Six lessons, quiz and session progress |
| Telemetry | Embedded in `src/App.jsx` | Demo CSV, sample traces, OpenF1 requests |
| Engineering models | `analysis/*.py`, `data/design_inputs.csv` | First-order calculations |
| CAD | `cad/f1_starter_car.FCMacro` | Primitive concept car |
| CFD | `cfd/CFD_FIRST_RUN.md` | CFD setup instructions |
| Reports | `report/*.md` | Equations and report template |

## Findings and priorities
### Critical / high
1. **Large monolithic React component.** App state, data parsing, OpenF1 fetching, charts, lessons and engineering formulas live in one file. Split into `features/`, `components/`, `services/` and `lib/` so tests and changes are safer.
2. **Live-feed semantics and resilience.** Provider access, off-session responses, CORS, rate limits and subscription requirements can interrupt a live feed. Add AbortController, request timeout, exponential backoff, stale data indicators and robust session-state classification. Validate status against sample timestamps and session data.
3. **Telemetry comparison alignment.** Current comparison uses sample index; traces with different sample rates can be visually misleading. Normalize distance units, interpolate onto a shared distance grid, and compute sector deltas only when the source supports reliable lap-distance and timing.
4. **No application tests.** Add unit tests for CSV parsers, channel aliases, unit conversion, distance interpolation and equation outputs, plus smoke tests for page rendering.

### Medium
5. **No persistent learner progress.** Current React state is session-local. Persist to localStorage first, add export/import, and only then introduce account/database support.
6. **Python scripts are command-line scripts, not an API.** Refactor pure functions, validate parameter ranges, return typed results, add tests, then wrap with FastAPI.
7. **CAD / CFD not integrated.** Add documented exports, CFD force/coefficients CSV schema and solver metadata. Show results only when mesh and convergence information accompanies them.
8. **Engineering teaching models require clear boundaries.** Maintain visible assumptions, units, sign convention, valid operating range and "not CFD/not validated" notes.
9. **Accessibility and UX.** Add empty/loading/error states consistently, keyboard focus, accessible names, chart table alternatives and responsive visual checks.
10. **Dependencies.** Use lockfile installs in CI, review npm audit and update dependencies deliberately; do not blindly force major upgrades.

## Recommended target structure
```
src/
  app/                app shell, routes, navigation
  components/         shared cards, charts, controls, status
  features/
    academy/          lesson catalogue, quizzes, progress
    telemetry/        imports, normalization, lap comparison
    live-session/     provider adapter, polling and freshness
    aerodynamics/     input controls and result views
    vehicle-dynamics/ model controls and result views
    strategy/         tyre and pit strategy experiments
  services/            OpenF1 client, storage, report export
  domain/              types, units, validation and equations
analysis/
  models/               pure Python engineering functions (future refactor)
tests/
  frontend/             parser and model tests
  python/                calculation tests
docs/
  architecture/
  data-dictionary/
  validation/
```

## Proposed delivery plan
- **P0 Reliability:** clean CI, parsers and calculation tests, no syntax regressions.
- **P1 Telemetry:** units, timestamps, live/historical distinction, distance-aligned laps, sector deltas and track map.
- **P2 Aerodynamics:** parameterized model interface, connect Python sweeps, import CFD results with convergence metadata.
- **P3 Vehicle dynamics:** Python functions exposed as tested API, tyre/load sensitivity model upgrades.
- **P4 Strategy:** stint simulation, pit loss, traffic and safety-car scenarios with transparent assumptions.
- **P5 Learning:** persistent progress, structured diagrams, worked examples, challenges, reports and certificates.

## Scope of this audit PR
- Corrects the architecture document so it describes the actual APEX / LAB F1 application, not the abandoned KMAutos diagnostics concept.
- Makes CI use `npm ci`, checks the production frontend build and syntax-compiles existing Python analysis code.
- Adds this audit and prioritized roadmap.
