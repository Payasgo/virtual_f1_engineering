# Virtual F1 Race Car — Engineering Design and Simulation Report

**Author:**  
**Date:**  
**CAD software/version:**  
**CFD platform/solver/version:**  
**Python version:**  

## 1. Abstract
Summarise the design, methods, key numerical results, and main limitations.

## 2. Objectives
- Build a parametric F1-inspired CAD concept.
- Estimate external aerodynamic forces using CFD.
- Calculate first-order tyre grip and cornering limits.
- Identify design changes for a second iteration.

## 3. Design definition
Insert overall dimensions, mass assumptions, wheelbase, track, tyre size, wing geometry, reference area, and coordinate convention.

## 4. CAD model
Insert isometric, front, side, and top views. Explain simplifications and geometry cleanup for CFD.

## 5. Analytical aerodynamic estimates
Show dynamic pressure, drag, downforce, and drag power using the equations in `ENGINEERING_NOTES.md`.

## 6. CFD methodology
Document fluid properties, domain size, boundary conditions, turbulence model, mesh settings, mesh count, and convergence criteria.

## 7. CFD results
Include velocity contours, pressure contours, streamlines, drag and vertical-force monitors, and calculated coefficients.

| Mesh | Cell count | Drag (N) | Downforce (N) | CD | |CL| |
|---|---:|---:|---:|---:|---:|
| Coarse | | | | | |
| Medium | | | | | |
| Fine | | | | | |

## 8. Tyre and vehicle-dynamics calculations
Report the assumed friction coefficient, normal load, estimated lateral-force ceiling, lateral acceleration, and corner radius. Explicitly discuss why a constant-mu tyre approximation is limited.

## 9. Design study
Change one variable at a time: front-wing angle/size, rear-wing size, ride height, or diffuser geometry. Plot drag versus downforce and discuss the trade-off.

## 10. Conclusions
State what was learned, what is supported by evidence, and what needs further work.

## 11. References
List software documentation, CFD theory references, tyre-model references, and any external data used.
