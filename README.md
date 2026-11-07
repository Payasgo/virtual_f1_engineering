# APEX / LAB — F1 Engineering Academy

An interactive learning platform for people who want to understand Formula 1 through engineering. The academy starts with accessible explanations of the sport, then lets learners explore telemetry, aerodynamics, vehicle dynamics and race strategy through hands-on experiments.

## Audience
- F1 fans who want to understand the engineering behind the race
- School, college and university engineering students
- Aspiring motorsport engineers and race strategists
- Educators introducing data-driven engineering concepts

## Run locally
~~~bash
npm install
npm run dev
npm run build
~~~

## Learning journey
1. **F1 fundamentals** — race weekends, teams, car systems and engineering roles.
2. **Telemetry analysis** — how teams collect sensor data; import CSV data and explore speed, throttle and brake traces; compare laps.
3. **Aerodynamics** — downforce, drag, airflow and the performance trade-off through an interactive conceptual experiment.
4. **Vehicle dynamics** — tyre grip, load transfer, braking and cornering relationships.
5. **Race strategy** — tyre degradation and stint-length scenarios.
6. **Learning platform** — lessons, knowledge checks, challenges and session progress.

## Telemetry CSV
The Telemetry Lab accepts local CSV files up to 20 MB. Required columns: `speed`, `throttle`, `brake`. Optional: `lap`, `distance`, `time`. Common variants include `speed_kmh`, `throttle_pct`, `brake_pct`, `distance_m` and `time_s`. Files are parsed in the browser. For accurate overlays, use matching sampling and distance references. The demo trace is illustrative, not official F1 data.

## Existing engineering research
The repository's original CAD, CFD and Python vehicle-dynamics work is retained. This academy UI is designed to connect those assets in later iterations; the current aerodynamic and vehicle-dynamics experiments are simplified teaching models, not live CAD/CFD or a validated F1 vehicle simulator.

## Educational and data disclaimer
This is an independent educational project and is not affiliated with Formula 1, FIA or any F1 team. Sample data and simplified models are for learning only, not official telemetry, engineering design validation or race predictions. Real F1 technical regulations, car designs, sensor channels and operating limits are complex and change over time.
