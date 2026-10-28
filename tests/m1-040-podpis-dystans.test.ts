/*
 * M1-audytor-generalny-040 (regresja od M1-031, reaudyt 28.10.2026; 08-programista-601): podpis przerwy (ekran i zegarek, `cueLoad`) pokazywał dystans
 * łacińskim „m” obok lokalnego symbolu masy („40 кг, 30 m”) w ru, uk, bg, sr i el — gałąź metryczna w lib/live.ts miała jednostkę na sztywno.
 * Test: (1) w tych językach podpis serii z ciężarem i dystansem ma lokalny symbol dystansu (ten sam co słownik „{n} m”), a nie łaciński „m”;
 * (2) strażnik: w napisach w app/, components/ i lib/ nie ma szablonu z jednostką dystansu lub masy na sztywno („${x} m`”, „${x} kg`”…).
 */
import * as fs from 'fs';
import * as path from 'path';
import { cueLoad } from '@/lib/live';
import { applyLang, t, type Lang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { type Exercise, type WSet } from '@/lib/seed';
import { ex } from './helpers';
import { world, teardownWorld } from './watch-world';

const blank = (p: Partial<WSet> = {}): WSet => ({ id: 'x', weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: false, completedAt: null, actualRest: null, ...p });
const carry = (): Exercise => ({ ...ex('Plank'), metric: 'weight_distance', equipment: 'hantle' as Exercise['equipment'] });

describe('M1-040: podpis przerwy — lokalny symbol dystansu obok lokalnego symbolu masy', () => {
  beforeEach(async () => { await world(); });
  afterEach(() => { applyLang('pl'); applyUnit('kg'); teardownWorld(); });
  test.each(['ru', 'uk', 'bg', 'sr', 'el'] as Lang[])('%s: „40 <masa>, 30 <dystans>” w piśmie języka', (l) => {
    applyLang(l); applyUnit('kg');
    const s = cueLoad(carry(), blank({ weight: 40, distanceM: 30 }));
    expect(s).toBe(`${t('{n} kg', { n: 40 })}, ${t('{n} m', { n: 30 })}`);
    expect(s).not.toMatch(/30 m$/);
  });
  test('pl i en bez zmian: „40 kg, 30 m”', () => {
    for (const l of ['pl', 'en'] as Lang[]) { applyLang(l); applyUnit('kg'); expect(cueLoad(carry(), blank({ weight: 40, distanceM: 30 }))).toBe('40 kg, 30 m'); }
  });
});

describe('M1-040: strażnik jednostek na sztywno w napisach', () => {
  const ROOT = path.join(__dirname, '..');
  const files = (d: string): string[] => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(d, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []);
  test('brak szablonu „${…} m|kg|lb|km|yd|mi`” w app/, components/, lib/', () => {
    const hits = ['app', 'components', 'lib'].flatMap(files).flatMap((f) => fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n')
      .flatMap((line, i) => (/\$\{[^}]+\} (m|kg|lb|km|yd|mi)`/.test(line) ? [`${f}:${i + 1}`] : [])));
    expect(hits).toEqual([]);
  });
});
