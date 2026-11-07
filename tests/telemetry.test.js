import test from 'node:test';
import assert from 'node:assert/strict';
import { alignLaps, findBrakingZones, integrateDistance, normalizeTrack, parseTelemetryCsv, sectorComparison } from '../src/telemetry/telemetry.js';

test('integrates speed over elapsed time into distance metres', () => {
  const result = integrateDistance([
    { t: 0, speed: 36 }, { t: 1, speed: 36 }, { t: 2, speed: 72 },
  ]);
  assert.equal(result[1].distance, 10);
  assert.equal(result[2].distance, 25);
});

test('aligns two differently sampled laps onto a shared distance grid', () => {
  const a = { samples: [{ distance: 0, speed: 100, throttle: 20, brake: 0 }, { distance: 100, speed: 200, throttle: 100, brake: 0 }] };
  const b = { samples: [{ distance: 0, speed: 90, throttle: 10, brake: 0 }, { distance: 50, speed: 150, throttle: 70, brake: 0 }, { distance: 100, speed: 210, throttle: 100, brake: 0 }] };
  const aligned = alignLaps(a, b, 2);
  assert.equal(aligned.length, 3);
  assert.equal(aligned[1].distance, 50);
  assert.equal(aligned[1].speedA, 150);
  assert.equal(aligned[1].speedB, 150);
});

test('parses quoted CSV fields, lap groups and mph conversion', () => {
  const csv = 'lap,driver,speed_mph,throttle,brake,distance_m\n1,"Driver, A",100,80,0,0\n1,"Driver, A",110,90,0,100\n2,"Driver, A",105,70,10,0\n2,"Driver, A",115,85,0,100';
  const laps = parseTelemetryCsv(csv);
  assert.equal(laps.length, 2);
  assert.equal(laps[0].samples[0].speed, 160.9344);
  assert.equal(laps[0].samples.length, 2);
});

test('calculates sector deltas as comparison minus reference', () => {
  const sectors = sectorComparison(
    { lap: { duration_sector_1: 30, duration_sector_2: 40, duration_sector_3: 25 } },
    { lap: { duration_sector_1: 29.5, duration_sector_2: 41, duration_sector_3: 24 } },
  );
  assert.deepEqual(sectors.map(s => s.delta), [-0.5, 1, -1]);
});

test('detects a sustained braking event from brake channel', () => {
  const samples = [
    { t: 0, distance: 0, speed: 250, throttle: 100, brake: 0 },
    { t: 1, distance: 60, speed: 200, throttle: 0, brake: 50 },
    { t: 2, distance: 105, speed: 140, throttle: 0, brake: 70 },
    { t: 3, distance: 130, speed: 100, throttle: 0, brake: 0 },
  ];
  const events = findBrakingZones(samples);
  assert.equal(events.length, 1);
  assert.equal(events[0].distance, 60);
  assert.equal(events[0].minSpeed, 100);
});

test('normalizes GPS coordinates without distorting circuit proportions', () => {
  const track = normalizeTrack([
    { x: 0, y: 0 },
    { x: 50, y: 25 },
    { x: 100, y: 50 },
    { x: 100, y: 50 },
    { x: NaN, y: 10 },
  ]);
  assert.equal(track.length, 3);
  const width = Math.max(...track.map(p => p.x)) - Math.min(...track.map(p => p.x));
  const height = Math.max(...track.map(p => p.y)) - Math.min(...track.map(p => p.y));
  assert.ok(Math.abs(width / height - 2) < 0.01);
  assert.ok(track.every(p => p.x >= 18 && p.x <= 282 && p.y >= 18 && p.y <= 182));
});
