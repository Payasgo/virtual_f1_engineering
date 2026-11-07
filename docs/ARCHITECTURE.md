# KMAutos Diagnostics Lab — Architecture

## Product direction
A responsive dark automotive diagnostics learning platform for beginners, students and technicians.

## Current frontend
- React + Vite interface with responsive navigation.
- Learning path and local lesson progress.
- OBD-II diagnostic concepts and scan workflow.
- Simulated live-data chart and sensor interpretation.
- Engine systems, electrical diagnostics, workshop workflow and challenges.
- Clear training-data and safety caveats.

## Target architecture
```
React frontend
  ├── Learning modules and progress
  ├── OBD-II scan and DTC explorer
  ├── Live PID dashboard and charting
  ├── Electrical test guides
  └── Workshop reports
        |
Python FastAPI service
  ├── Vehicle / protocol capability registry
  ├── DTC lookup with licensed data sources
  ├── PID normalization and unit conversion
  ├── Diagnostic session and report API
  └── Training scenarios and quizzes
        |
Data layer
  ├── PostgreSQL: users, lessons, sessions and reports
  ├── Vehicle compatibility metadata
  └── Local/sample datasets
        |
Vehicle interface (future, opt-in)
  ├── Supported ELM327-compatible adapters
  ├── OBD-II over Bluetooth / USB where browser/OS permits
  └── Read-only live PIDs first; no control commands
```

## Diagnostic safety principles
- Clearly label simulated, user-supplied and vehicle-connected data.
- Never infer a failed component from a DTC alone.
- Show PID units, vehicle context, timestamp and data quality.
- Begin with read-only OBD-II access; do not issue actuator, coding or ECU-write commands.
- Require vehicle-specific service information for pinouts, test values and repair procedures.
- Do not promise universal compatibility: OBD-II coverage varies by vehicle, year, market and adapter.

## Roadmap
1. Rebrand and convert the learning interface to automotive diagnostics.
2. Implement robust CSV import and sample diagnostic sessions.
3. Add DTC explanation catalogue with source attribution.
4. Add OBD-II PID decoding and supported adapter connection.
5. Add guided electrical test workflows and wiring-diagram references.
6. Add report export, saved sessions and technician learning progress.

## Local development
```bash
npm install
npm run dev
npm run build
```
