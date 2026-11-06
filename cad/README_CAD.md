# FreeCAD starter CAD instructions

## Install and run

1. Install FreeCAD from its official download page: https://www.freecad.org/downloads.php
2. Open FreeCAD.
3. Choose **Macro → Macros… → Create** (or open the macro file from the Macro dialog).
4. Select `f1_starter_car.FCMacro` and run it.
5. The macro creates a simple concept car from editable primitive solids in a document named `Virtual_F1_Starter`.
6. Save the document as `F1_Starter.FCStd`.

## Export STEP for CFD

1. In the model tree, select the bodies/solids you want to export. For the first external-flow test, export the overall car geometry as one STEP file if your CAD version supports selecting all visible solids.
2. Use **File → Export** and choose STEP (`.step` or `.stp`).
3. Save as `F1_Starter.step`.
4. For CFD, use a copy of the geometry and remove tiny details that do not affect the first learning objective.

## Geometry and coordinate convention

- X = vehicle longitudinal direction; positive toward the nose.
- Y = vehicle lateral direction.
- Z = vertical direction.
- Ground plane is at Z = 0.
- Overall concept dimensions are approximately 5.2 m long × 2.0 m wide × 1.1 m high.
- The model is intentionally simplified: body, nose, front/rear wings, floor, diffuser ramp, four tyres, and basic wheel hubs.

## Modelling tasks after the first run

- Replace the boxy body with lofted surfaces.
- Add front-wing and rear-wing airfoil sections.
- Add realistic tyre cross-sections and wheel rims.
- Add suspension wishbones and uprights.
- Make a clean watertight fluid-facing surface before meshing.

**Note:** FreeCAD Python API names can vary slightly by version. If a macro error occurs, check the line reported in the Python console and tell ChatGPT the error text.
