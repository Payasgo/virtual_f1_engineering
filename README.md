# KMAutos Diagnostics Lab

A dark, interactive learning environment for automotive diagnostics. Designed for beginners, automotive students and technicians who want to understand OBD-II scanning, live engine data, sensor operation, electrical testing and structured fault-finding.

## Run locally
```bash
npm install
npm run dev
```
Build for production with `npm run build`.

## Learning workspaces
- OBD-II diagnostics and diagnostic trouble codes
- Live engine sensor data and parameter interpretation
- Engine systems: air, fuel, ignition, cooling and compression
- Electrical diagnostics: power, ground, signal and continuity
- Workshop workflow: confirm, scan, inspect, test, repair and verify
- Learning modules and practical challenges

## Important safety and accuracy notes
This is an educational training interface. Sample values are simulated and must not be treated as readings from a real vehicle. Diagnostic trouble codes do not identify a failed part by themselves. Always consult vehicle-specific OEM service information, wiring diagrams, test specifications and safety procedures. Do not perform repairs based only on an app suggestion.

## Existing engineering assets
The original repository's CAD, CFD and Python vehicle-dynamics materials are retained as legacy research assets. They are not presented as automotive diagnostic data.

## Phase 2 — CSV diagnostic analysis
The Live Data Lab supports local CSV imports (up to 15 MB per file), header detection, common PID aliases, numeric validation, charting, a second-capture overlay and JSON diagnostic summaries. Supported channels include RPM, coolant temperature, vehicle speed, throttle position, MAP, system voltage, STFT, LTFT, MAF and calculated engine load. Files are processed in the browser and are not uploaded to a server.

### Example CSV
See `examples/sample-obd-session.csv`. Use the sample to try the importer. Exported scan-tool CSV formats vary; rename or normalize headers if a column is not detected.

### CSV format and limitations
- First row must contain column headers.
- At least two rows with numeric values in one supported channel are required.
- Blank cells are retained as missing values; invalid rows are excluded if every supported channel is blank.
- Comparison overlays align by row index, not by synchronized timestamps. Use captures with matching sample intervals for meaningful comparisons.
- JSON summary contains per-channel min, max and average; it is a data summary, not a diagnosis.
- The browser importer does not connect to an OBD-II adapter and cannot validate readings against OEM specifications.

## Motorsport telemetry analysis
The Telemetry Analysis workspace accepts local CSV exports and plots speed, throttle and brake channels for selected laps. Upload a reference dataset and optionally a comparison dataset. If a file contains a `lap` column, select which lap to display from the dropdown.

### Supported CSV structure
Required columns: `speed`, `throttle`, `brake`.
Optional columns: `lap`, `time`, `distance`.
Common aliases are accepted, including `speed_kmh`, `speed_mph`, `throttle_pct`, `brake_pct`, `lap_number`, `time_s` and `distance_m`. Throttle and brake are expected as percentages from 0–100. Speed unit is inferred from a header containing `mph`; otherwise the display defaults to km/h.

Example: `examples/sample-telemetry.csv`.

### Comparison method and limitations
- Both datasets are parsed in the browser and are not uploaded to a server.
- Lap traces are overlaid by sample row index. For a meaningful direct comparison, use aligned sampling intervals and a common distance reference.
- This first telemetry iteration does not interpolate or time-align laps, identify braking points automatically, calculate sector deltas, or connect to a live logger.
- CSV channel names and units vary by logger; normalize headers and values before import if needed.
- The graphs are educational visualizations, not official timing or telemetry data.
