"""Simple speed sweep. Run: py analysis\\design_sweep.py"""
from pathlib import Path
import csv

ROOT = Path(__file__).resolve().parents[1]
rows = []
with (ROOT / "data" / "design_inputs.csv").open(newline="", encoding="utf-8") as f:
    p = {r["parameter"]: float(r["value"]) for r in csv.DictReader(f)}
rho, area, cd, cl = p["air_density"], p["reference_area"], p["cd"], p["cl_downforce"]
for kmh in range(60, 301, 20):
    v = kmh / 3.6
    q = 0.5 * rho * v * v
    rows.append({
        "speed_kmh": kmh,
        "drag_N": q * area * cd,
        "downforce_N": q * area * cl,
        "drag_power_kW": q * area * cd * v / 1000
    })
out = ROOT / "data" / "speed_sweep_results.csv"
with out.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
print(f"Wrote {out}")
for r in rows:
    print(f'{r["speed_kmh"]:>3} km/h | drag {r["drag_N"]:>7.0f} N | downforce {r["downforce_N"]:>7.0f} N | power {r["drag_power_kW"]:>6.1f} kW')
