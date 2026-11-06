# CFD first run — external aerodynamics

## Learning objective

Obtain a first estimate of drag and vertical aerodynamic force for the simplified starter car at 50 m/s. Treat the first result as a workflow exercise, not a design-quality prediction.

## Recommended first route: browser-based CFD

Use a browser-based platform such as SimScale. The platform interface and available solver features can change, so follow its current external-aerodynamics tutorial and confirm current plan limits.

### 1. Prepare geometry

- Export `F1_Starter.step` from FreeCAD.
- Work on a copy.
- Remove cockpit proxy, hubs, suspension rods, and other small details for the first external-flow run if they create poor-quality sliver faces.
- Check that the vehicle is a closed solid and that there are no unintended gaps.
- Keep all four tyres in the first model, but note that they are stationary unless you explicitly configure rotating-wall / moving-ground conditions.

### 2. Create the flow domain

Use a rectangular enclosure around the car. A reasonable initial learning domain, measured from the car bounding box, is:
- Upstream: 3 car lengths ahead of the nose.
- Downstream: 6 car lengths behind the rear.
- Side clearance: at least 3 car widths on each side.
- Top clearance: at least 3 car heights above the car.
- Ground: use a ground wall. For a more realistic moving-ground study, set ground velocity to match freestream speed if the solver supports it.

These are starting values, not universal rules. Increase the domain if blockage or boundary effects are suspected.

### 3. Boundary conditions

- Inlet: uniform velocity 50 m/s in the vehicle longitudinal direction.
- Outlet: static pressure / pressure outlet, 0 Pa gauge relative to the chosen reference.
- Side and top: symmetry or slip boundaries for a first external-flow approximation.
- Ground: no-slip stationary wall for a simple first case; later use moving ground.
- Car surface: no-slip wall.
- Fluid: air, density 1.225 kg/m³, dynamic viscosity approximately 1.81e-5 Pa·s at 15°C.

### 4. Solver and turbulence

- Use a steady incompressible RANS external-aerodynamics setup for the first case.
- If available, start with k-omega SST as a common engineering turbulence-model choice for separated external flow.
- Use second-order spatial discretisation after the solution is stable, if supported.
- Do not assume the steady solution captures unsteady vortex shedding or transient wake behaviour.

### 5. Mesh plan

Start with a moderate mesh and local refinement:
- Refine around front wing leading/trailing edges.
- Refine around tyres and wheel wakes.
- Refine beneath the floor and through the diffuser.
- Refine in the rear-wing wake.
- Add boundary-layer inflation layers if available.
- Inspect cell quality and ensure the smallest gaps are adequately resolved.

Run at least three systematically refined meshes. Compare drag and downforce, not just residuals. A change under roughly 3–5% between the two finest meshes is a useful initial learning target, not a formal certification threshold.

### 6. Convergence checks

Monitor:
- Residual reduction and stability.
- Drag force history.
- Vertical force history.
- Mass-flow imbalance.
- Whether force monitors have flattened rather than merely residuals decreasing.

### 7. Post-processing

Create:
- Velocity magnitude slice through the car centreline.
- Static-pressure contour on the car surface.
- Streamlines around front wing and rear wing.
- Underfloor/diffuser velocity and pressure views.
- Force reports for drag and vertical force.

Calculate coefficients using the same reference area and freestream speed as in `data/design_inputs.csv`:

`CD = Drag / (0.5 * rho * V^2 * A_ref)`

`|CL| = |Vertical force| / (0.5 * rho * V^2 * A_ref)`

### 8. Validation and interpretation

- Compare the CFD coefficients with the illustrative input coefficients. They will not necessarily match because the geometry is crude.
- Check whether the force direction is physically sensible.
- Check domain sensitivity and mesh sensitivity.
- Record solver, turbulence model, mesh count, boundary conditions, reference area, and convergence history.
- Never tune geometry based on a single unconverged result.

## Second-stage realism upgrades

1. Rotating wheels and moving ground.
2. Better airfoil sections for wings.
3. Underfloor tunnels and a more realistic diffuser.
4. Ride-height sensitivity.
5. Yaw-angle cases (0°, 2°, 4°).
6. Transient simulation only after a stable baseline is established.
