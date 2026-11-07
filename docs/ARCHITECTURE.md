# APEX / LAB — F1 Engineering Academy Architecture

## Product purpose
APEX / LAB is an independent, learning-first Formula 1 engineering academy for F1 fans, students, educators and aspiring motorsport engineers. The learning path explains the sport from fundamentals through telemetry, aerodynamics, vehicle dynamics and race strategy. The interface must distinguish educational examples, user-imported datasets, public historical data and a genuinely live data feed.

## Current repository state
### Frontend
- React 18 + Vite.
- Dark responsive engineering-workstation interface.
- Learning modules with short explanations, knowledge checks and session-local completion state.
- Telemetry lab with sample traces and local CSV import.
- Live Race Data workspace using OpenF1 session, driver and car-data endpoints, with manual refresh and optional 5-second polling.
- Aerodynamics teaching model using dynamic pressure and illustrative coefficients.
- Vehicle-dynamics teaching calculation for constant-friction braking distance.
- Tyre degradation / stint-length illustration.

### Engineering assets
- `cad/f1_starter_car.FCMacro`: concept geometry built from simple FreeCAD primitives.
- `cfd/CFD_FIRST_RUN.md`: external-flow CFD setup guidance and post-processing plan.
- `analysis/vehicle_dynamics.py`: first-order aero, weight and constant-mu grip estimates driven by `data/design_inputs.csv`.
- `analysis/design_sweep.py`: speed sweep for drag, downforce and drag power.
- `report/ENGINEERING_NOTES.md`: equations, sign conventions and model limitations.

## Current architecture
```
React UI (src/App.jsx, src/styles.css)
  ├── Academy and lesson experience
  ├── Telemetry CSV viewer
  ├── OpenF1 browser data adapter (live/historical)
  ├── Simplified aero / vehicle dynamics / strategy demos
  └── Recharts visualisation
          |
          | next integration layer
          v
Typed domain modules / API client
  ├── Telemetry normalization and unit conversion
  ├── Session / driver / lap / sector domain types
  ├── Aerodynamics model adapter
  ├── Vehicle dynamics model adapter
  └── Race strategy model adapter
          |
          v
Python FastAPI service (future)
  ├── Existing analysis scripts exposed as tested functions
  ├── Parameter-sweep endpoints
  ├── CFD result metadata and import endpoints
  └── Experiment runs and provenance
          |
          v
CAD / CFD / engineering data
  ├── FreeCAD macro and exported STEP geometry
  ├── CFD meshes, solver setup and result exports
  └── Versioned design-input datasets
```

## Data provenance and trust model
Every displayed dataset must have a visible source label:
1. **LIVE** — only when the latest sample timestamp is recent and belongs to a session whose scheduled window is active; live API access can require a paid OpenF1 subscription.
2. **HISTORICAL / REPLAY** — a recorded session returned by a public data API.
3. **USER IMPORT** — a local CSV provided by the learner.
4. **SIMULATED** — generated sample values or educational model outputs.

Do not label historical data as live. Preserve timestamps, session keys, driver number, channel names, units and source/provider metadata. Do not fabricate missing channels. Do not present public data as confidential team telemetry or official FIA/F1 feeds.

## Engineering model boundaries
- Aero UI: steady dynamic-pressure relation `F = 0.5 rho V^2 C A` with illustrative coefficients. It is not CFD; no geometry, mesh, turbulence, ride-height or yaw effects are solved.
- Python model: first-order estimates with constant friction coefficient and simplified axle aero split. Not a validated tyre model or full vehicle dynamics model.
- Strategy UI: illustrative linear tyre degradation. Not a predictive race strategy optimiser.
- CAD: primitive concept geometry only; watertightness, dimensions and surface quality must be checked before CFD.
- CFD guide: a workflow tutorial, not evidence that a converged CFD result has been produced. Record mesh, solver, turbulence model, boundary conditions, force history and reference area for any result shown in the app.

## Main risks identified in the current implementation
- The single large `src/App.jsx` mixes content, state, API calls, parsing and visualisation. Split by feature after stabilising behavior.
- Browser-side OpenF1 requests depend on provider availability, CORS, API access level and rate limits. Handle loading, stale samples, errors, retries and abort-on-unmount; never imply guaranteed live service.
- The live feed fetches the latest session; during an off-session period it may return historical/replay data. The UI must label this accurately.
- Telemetry overlays by sample index can be misleading when sampling differs. Implement distance normalization/interpolation and sector timing before claiming precise lap deltas.
- CSV parsers should support quoted fields, delimiter detection, units and channel alias validation. Prefer a shared parser rather than duplicating implementations.
- Lesson progress currently lives only in React state; refresh loses it. Add local persistence first, then accounts/database if needed.
- The current CI workflow should use lockfile-based installation and validate both frontend and Python source.

## Recommended development sequence
### P0 — Reliability
- Make CI reproducible using `npm ci`.
- Run `npm run build`.
- Compile-check Python scripts with `python -m compileall analysis`.
- Add tests for CSV parsers, telemetry normalization and engineering equations.
- Resolve build warnings and verify on clean Node 20 environment.

### P1 — Data platform
- Extract OpenF1 client, CSV parser and telemetry domain model from App.jsx.
- Normalize timestamps and units (km/h vs mph, percentages, distance).
- Add session/driver selectors, explicit LIVE vs HISTORICAL status, stale-data banner and request cancellation.
- Add lap distance alignment, interpolation and sector delta computation.

### P2 — Engineering labs
- Wrap Python scripts into importable, parameterized functions with no top-level print/side effects.
- Expose model runs through FastAPI with typed input/output schemas.
- Add tests against hand-calculated reference cases and document assumptions/units.
- Import CFD force reports, coefficient data and solver metadata; show mesh/convergence quality with results.

### P3 — Learning platform
- Break lessons into structured modules, diagrams, glossary and worked examples.
- Persist lesson and quiz progress locally.
- Add engineering challenges with transparent scoring and explanations.
- Add downloadable experiment reports and learning certificates only after reliable progress persistence exists.

## Local development
```bash
npm ci
npm run dev
npm run build
python -m compileall analysis
```

## Non-goals / claims to avoid
- Do not claim access to private F1 team telemetry.
- Do not call a simplified formula a CFD simulation.
- Do not call the linear tyre example an actual F1 tyre degradation predictor.
- Do not describe the app as an official F1/FIA product.
