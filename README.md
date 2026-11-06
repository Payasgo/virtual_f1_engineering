# Virtual F1 Engineering Project — Beginner Starter Pack

**Project type:** F1-inspired single-seat open-wheel research model  
**Scope:** Parametric CAD, external-aerodynamics CFD workflow, tyre-force model, and steady-state cornering calculations  
**Important:** This is an educational concept model, not an FIA-compliant or race-ready F1 car. The simplified CAD is suitable for learning geometry and setting up a first external-flow study; it is not a validated aerodynamic representation.

## Recommended beginner toolchain (Windows)

1. **FreeCAD** — free, open-source parametric CAD. Use the included macro to generate the starter geometry.
2. **SimScale** — browser-based CFD is the gentlest first route because it avoids installing and configuring a Linux CFD stack. Create an account and check current community-plan and project-sharing limits before relying on it.
3. **Python 3** — run the included calculations with the standard library only. Optional: install Jupyter later for notebooks and plots.
4. **ParaView** — optional, for inspecting exported CFD fields if you later use OpenFOAM.

A practical path is **FreeCAD → export STEP → SimScale external aerodynamics → compare CFD coefficients with the hand calculations → tyre/vehicle dynamics script**.

## Folder map

- `cad/f1_starter_car.FCMacro` — creates a simplified, editable FreeCAD assembly-like model.
- `cad/README_CAD.md` — how to run the macro and export STEP.
- `cfd/CFD_FIRST_RUN.md` — first external-aerodynamics setup and mesh/convergence checklist.
- `analysis/vehicle_dynamics.py` — aerodynamic forces, tyre friction limit, load transfer, and bicycle-model cornering calculations.
- `analysis/design_sweep.py` — small parameter sweep for wing/downforce sensitivity.
- `data/design_inputs.csv` — baseline assumptions; edit these for your own design.
- `report/FINAL_REPORT_TEMPLATE.md` — report structure and required evidence.
- `report/ENGINEERING_NOTES.md` — equations, assumptions, and interpretation guide.

## Suggested first-week sequence

1. Run the FreeCAD macro and inspect the geometry.
2. Export `F1_Starter.step`.
3. Read `cfd/CFD_FIRST_RUN.md`; run one baseline CFD case.
4. Run `python analysis/vehicle_dynamics.py`.
5. Change one input at a time and record the effect.
6. Complete the report template using your own screenshots, mesh statistics, and solver outputs.

## Run the Python calculations

Open PowerShell in this project folder:

```powershell
py analysis\vehicle_dynamics.py
py analysis\design_sweep.py
```

No third-party Python packages are required.

## Baseline design assumptions

These are deliberately transparent starting assumptions, not claimed F1 specifications:

- Mass with driver: 800 kg
- Reference speed: 50 m/s (180 km/h)
- Air density: 1.225 kg/m³
- Frontal/reference area: 1.5 m²
- Drag coefficient: 0.90
- Downforce coefficient magnitude: 2.50
- Wheelbase: 3.60 m
- Static front weight distribution: 45%
- Tyre-road friction coefficient: 1.6 (illustrative constant)
- Centre-of-gravity height: 0.30 m

Real tyre behaviour is nonlinear and depends on load, temperature, pressure, camber, wear, compound, surface, and transient slip. The constant-friction model here is only a first learning model.

## Safety and engineering caveats

- Do not use this model to design or operate a real vehicle.
- Do not interpret a single CFD run as validated truth. Check domain size, mesh independence, boundary conditions, turbulence model, convergence, and force balance.
- A simplified CAD model omits many important details: rotating wheels, suspension kinematics, cooling flow, tyre deformation, moving ground, realistic wing sections, and the complex underfloor.
- CFD drag/downforce coefficients are only comparable when reference area, reference velocity, axes, and force sign conventions match.
