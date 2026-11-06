"""
Educational first-order F1-inspired aero and vehicle-dynamics calculator.
Uses only Python standard library. Run: py analysis/vehicle_dynamics.py
All results are estimates from deliberately simplified assumptions.
"""
from pathlib import Path
import csv
import math

ROOT = Path(__file__).resolve().parents[1]
INPUTS = ROOT / "data" / "design_inputs.csv"

def read_inputs():
    with INPUTS.open(newline="", encoding="utf-8") as f:
        return {row["parameter"]: float(row["value"]) for row in csv.DictReader(f)}

p = read_inputs()
m = p["mass"]
v = p["speed"]
rho = p["air_density"]
A = p["reference_area"]
Cd = p["cd"]
Cl = p["cl_downforce"]
g = 9.81
q = 0.5 * rho * v**2
drag = q * A * Cd
downforce = q * A * Cl
weight = m * g
total_normal = weight + downforce
mu = p["mu"]
friction_limit = mu * total_normal
idealized_lateral_accel = friction_limit / m
idealized_corner_radius_50ms = v**2 / idealized_lateral_accel
front_static = p["front_weight_fraction"] * weight
rear_static = (1 - p["front_weight_fraction"]) * weight
front_aero = p["front_weight_fraction"] * downforce
rear_aero = (1 - p["front_weight_fraction"]) * downforce

print("VIRTUAL F1 — FIRST-ORDER ENGINEERING ESTIMATES")
print("=" * 54)
print(f"Reference speed                 : {v:.2f} m/s ({v*3.6:.1f} km/h)")
print(f"Dynamic pressure                 : {q:.1f} Pa")
print(f"Aerodynamic drag                 : {drag:.1f} N")
print(f"Downforce magnitude              : {downforce:.1f} N")
print(f"Weight                           : {weight:.1f} N")
print(f"Total normal load (simple model) : {total_normal:.1f} N")
print(f"Drag power at this speed         : {drag*v/1000:.2f} kW")
print()
print("AXLE LOADS (assumed aero split follows static distribution)")
print(f"Front static load                : {front_static:.1f} N")
print(f"Rear static load                 : {rear_static:.1f} N")
print(f"Front aero load                  : {front_aero:.1f} N")
print(f"Rear aero load                   : {rear_aero:.1f} N")
print()
print("VERY SIMPLE TYRE GRIP CEILING")
print(f"Constant-mu lateral force limit  : {friction_limit:.1f} N")
print(f"Equivalent lateral acceleration : {idealized_lateral_accel/g:.2f} g")
print(f"Illustrative radius at {v:.0f} m/s      : {idealized_corner_radius_50ms:.1f} m")
print()
print("LIMITATIONS: no load-sensitive tyres, transient slip, aero balance shift,")
print("suspension kinematics, yaw dynamics, banking, camber, or thermal model.")
