# Engineering notes and equations

## Aerodynamics

Dynamic pressure:

\[
q = \frac{1}{2}\rho V^2
\]

Drag magnitude:

\[
D = q A C_D
\]

Downforce magnitude:

\[
F_z = q A |C_L|
\]

Drag power:

\[
P_D = D V
\]

where `rho` is air density, `V` is freestream speed, `A` is the chosen reference area, and `CD` / `CL` are dimensionless coefficients.

**Important coefficient convention:** Many CFD tools report a signed lift coefficient. A race car's downforce may appear as negative lift depending on the vertical axis. In this starter pack, `cl_downforce` is entered as a positive magnitude.

## Tyre force (first approximation)

A simple friction-circle upper bound is:

\[
\sqrt{F_x^2 + F_y^2} \leq \mu F_z
\]

For pure lateral force, the crude ceiling is `Fy,max = mu * Fz`.

This is not a tyre model. Real tyres exhibit load sensitivity, a nonlinear force-versus-slip-angle curve, relaxation length, camber thrust, temperature effects, pressure effects, and combined-slip behaviour. A constant `mu` often overpredicts grip, especially when loads become large.

## Cornering and load transfer

Lateral acceleration:

\[
a_y = \frac{V^2}{R}
\]

A simplified total lateral load-transfer estimate is:

\[
\Delta F \approx \frac{m a_y h_{CG}}{t}
\]

This estimates the amount of load shifted across the vehicle at a simplified whole-car level. Actual front/rear distribution depends on roll-centre geometry, roll stiffness distribution, suspension geometry, and unsprung mass.

## Bicycle-model foundation

For a later upgrade, use a linear bicycle model with front and rear axle cornering stiffnesses `Cf` and `Cr`. At small slip angles:

\[
F_{yf} \approx C_f \alpha_f,\quad F_{yr} \approx C_r \alpha_r
\]

This linear model is only valid near small slip angles and before tyre saturation. The first script deliberately avoids pretending that a constant-mu estimate is a full vehicle dynamics simulation.

## CFD quantities to extract

- Integrated drag force along the vehicle longitudinal axis.
- Integrated vertical force on the car (check sign convention).
- `CD = D / (q A_ref)`.
- `CL = L / (q A_ref)` or downforce magnitude using a clearly stated sign convention.
- Pressure coefficient: `Cp = (p - p_inf) / q`.
- Velocity magnitude and streamlines around front wing, wheels, floor, diffuser, and rear wing.

Always record the exact reference area and freestream speed used for coefficient calculations.
