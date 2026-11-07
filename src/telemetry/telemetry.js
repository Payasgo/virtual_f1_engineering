const API = 'https://api.openf1.org/v1';

async function request(endpoint, params, signal) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API}/${endpoint}?${query}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('This OpenF1 endpoint requires an access level that is not available to this request.');
    if (response.status === 429) throw new Error('OpenF1 rate limit reached. Wait briefly before retrying.');
    throw new Error(`OpenF1 ${endpoint} request failed (${response.status}).`);
  }
  const result = await response.json();
  if (!Array.isArray(result)) throw new Error(`Unexpected response from OpenF1 ${endpoint} endpoint.`);
  return result;
}

export const getSessions = (year, signal) => request('sessions', { year: String(year) }, signal);
export const getDrivers = (sessionKey, signal) => request('drivers', { session_key: String(sessionKey) }, signal);
export const getLaps = (sessionKey, driverNumber, signal) =>
  request('laps', { session_key: String(sessionKey), driver_number: String(driverNumber) }, signal);

export async function getLapSamples(sessionKey, driverNumber, lap, signal) {
  if (!lap?.date_start || !Number.isFinite(Number(lap.duration))) {
    throw new Error('This lap has no valid start timestamp or duration, so its telemetry cannot be queried reliably.');
  }
  const start = new Date(new Date(lap.date_start).getTime() - 250).toISOString();
  const end = new Date(new Date(lap.date_start).getTime() + Number(lap.duration) * 1000 + 500).toISOString();
  const params = {
    session_key: String(sessionKey),
    driver_number: String(driverNumber),
    'date>': start,
    'date<': end,
  };
  const [car, location] = await Promise.all([
    request('car_data', params, signal),
    request('location', params, signal).catch(() => []),
  ]);
  const samples = car
    .filter(row => Number.isFinite(Number(row.speed)) && row.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(row => ({
      date: row.date,
      t: (new Date(row.date) - new Date(lap.date_start)) / 1000,
      speed: Number(row.speed),
      throttle: Number(row.throttle),
      brake: Number(row.brake),
      rpm: Number(row.rpm),
      gear: Number(row.n_gear),
      drs: row.drs,
    }))
    .filter(row => row.t >= 0 && row.t <= Number(lap.duration) + 0.5);
  if (samples.length < 2) throw new Error('OpenF1 returned fewer than two car-data samples for this lap.');
  return {
    lap,
    samples: integrateDistance(samples),
    location: location.filter(p => Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(p => ({ x: Number(p.x), y: Number(p.y), date: p.date })),
    source: 'OpenF1',
  };
}

export function integrateDistance(samples) {
  let distance = 0;
  return samples.map((sample, index) => {
    if (index > 0) {
      const dt = Math.max(0, sample.t - samples[index - 1].t);
      const v0 = samples[index - 1].speed / 3.6;
      const v1 = sample.speed / 3.6;
      distance += ((v0 + v1) / 2) * dt;
    }
    return { ...sample, distance };
  });
}

export function interpolateAtDistance(samples, distance) {
  if (!samples.length) return null;
  if (distance <= samples[0].distance) return samples[0];
  const last = samples[samples.length - 1];
  if (distance >= last.distance) return last;
  let low = 0;
  let high = samples.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (samples[mid].distance <= distance) low = mid;
    else high = mid;
  }
  const a = samples[low];
  const b = samples[high];
  const span = b.distance - a.distance || 1;
  const ratio = (distance - a.distance) / span;
  const mix = key => Number.isFinite(a[key]) && Number.isFinite(b[key]) ? a[key] + (b[key] - a[key]) * ratio : null;
  return { distance, speed: mix('speed'), throttle: mix('throttle'), brake: mix('brake') };
}

export function alignLaps(lapA, lapB, points = 160) {
  const maxA = lapA.samples.at(-1)?.distance || 0;
  const maxB = lapB.samples.at(-1)?.distance || 0;
  const length = Math.min(maxA, maxB);
  if (length <= 0) throw new Error('Cannot align laps without valid integrated distance.');
  return Array.from({ length: points + 1 }, (_, i) => {
    const distance = length * i / points;
    const a = interpolateAtDistance(lapA.samples, distance);
    const b = interpolateAtDistance(lapB.samples, distance);
    return {
      distance: Math.round(distance),
      speedA: a?.speed, speedB: b?.speed,
      speedDelta: (b?.speed ?? 0) - (a?.speed ?? 0),
      throttleA: a?.throttle, throttleB: b?.throttle,
      brakeA: a?.brake, brakeB: b?.brake,
    };
  });
}

export function sectorComparison(lapA, lapB) {
  const fields = ['duration_sector_1', 'duration_sector_2', 'duration_sector_3'];
  return fields.map((field, index) => {
    const a = Number(lapA.lap[field]);
    const b = Number(lapB.lap[field]);
    return { sector: `S${index + 1}`, a: Number.isFinite(a) ? a : null, b: Number.isFinite(b) ? b : null,
      delta: Number.isFinite(a) && Number.isFinite(b) ? b - a : null };
  });
}

export function findBrakingZones(samples) {
  const events = [];
  let active = null;
  samples.forEach((sample, index) => {
    const previous = samples[index - 1];
    const dt = previous ? sample.t - previous.t : 0;
    const decel = previous && dt > 0 ? (previous.speed - sample.speed) / 3.6 / dt : 0;
    const braking = Number(sample.brake) >= 8 || (decel >= 2.2 && Number(sample.throttle) <= 15);
    if (braking && !active) active = { startDistance: sample.distance, startSpeed: previous?.speed ?? sample.speed, peakDecel: decel, minSpeed: sample.speed };
    if (active) {
      active.peakDecel = Math.max(active.peakDecel, decel);
      active.minSpeed = Math.min(active.minSpeed, sample.speed);
      active.endDistance = sample.distance;
      if (!braking || index === samples.length - 1) {
        if (active.endDistance - active.startDistance >= 8) events.push({ ...active, distance: Math.round(active.startDistance), speedDrop: Math.round(active.startSpeed - active.minSpeed) });
        active = null;
      }
    }
  });
  return events.slice(0, 12);
}

function parseCsvRows(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); cell = '';
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(value => value !== '')) rows.push(row);
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  return rows;
}

const normalizeHeader = value => value.toLowerCase().replace(/[\\s_-]/g, '');
export function parseTelemetryCsv(text) {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ''));
  if (rows.length < 3) throw new Error('CSV needs a header and at least two data rows.');
  const headers = rows[0].map(normalizeHeader);
  const find = names => headers.findIndex(header => names.includes(header));
  const ix = {
    lap: find(['lap', 'lapnumber', 'lapid']),
    distance: find(['distance', 'distancem', 'lapdistance', 'distancemeters']),
    time: find(['time', 'times', 'timestamp', 'elapsedtime', 'timesec']),
    speed: find(['speed', 'speedkmh', 'speedkph', 'velocity', 'speedmph']),
    throttle: find(['throttle', 'throttlepct', 'throttleposition']),
    brake: find(['brake', 'brakepct', 'brakepressure']),
  };
  for (const key of ['speed', 'throttle', 'brake']) if (ix[key] < 0) throw new Error('Required columns: speed, throttle and brake. Optional: lap, distance or time.');
  const laps = new Map();
  rows.slice(1).forEach((row, index) => {
    const number = key => ix[key] < 0 ? null : Number(row[ix[key]]);
    const speed = number('speed') * (headers[ix.speed] === 'speedmph' ? 1.609344 : 1);
    const throttle = number('throttle');
    const brake = number('brake');
    if (![speed, throttle, brake].every(Number.isFinite)) return;
    const lapId = ix.lap < 0 ? '1' : (row[ix.lap] || '1');
    const distance = number('distance');
    const time = number('time');
    const sample = { speed, throttle, brake, distance: Number.isFinite(distance) ? distance : null,
      t: Number.isFinite(time) ? time : index, sourceIndex: index };
    if (!laps.has(lapId)) laps.set(lapId, []);
    laps.get(lapId).push(sample);
  });
  if (!laps.size) throw new Error('No valid numeric telemetry rows were found.');
  return [...laps.entries()].map(([id, samples]) => {
    const ordered = samples.sort((a, b) => (a.distance ?? a.t) - (b.distance ?? b.t));
    const hasDistance = ordered.every(sample => Number.isFinite(sample.distance));
    const prepared = hasDistance ? ordered : integrateDistance(ordered.map(sample => ({ ...sample, t: Number(sample.t) })));
    return { id: String(id), samples: prepared, duration: prepared.at(-1).t - prepared[0].t, distance: prepared.at(-1).distance,
      source: 'User CSV', lap: { lap_number: id, duration: null, duration_sector_1: null, duration_sector_2: null, duration_sector_3: null } };
  });
}

export function normalizeTrack(location) {
  if (!location?.length) return [];
  const minX = Math.min(...location.map(p => p.x)), maxX = Math.max(...location.map(p => p.x));
  const minY = Math.min(...location.map(p => p.y)), maxY = Math.max(...location.map(p => p.y));
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  return location.map(p => ({ x: 12 + ((p.x - minX) / span) * 276, y: 12 + ((maxY - p.y) / span) * 176 }));
}
