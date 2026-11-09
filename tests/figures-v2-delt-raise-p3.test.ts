/*
 * Rodzina delt_raise — poprawki po recenzji ruchu r3 (04.11.2026): r3-W1 (łokieć Alternating Deltoid Raise nie pulsuje; reguła lokiec_staly wraca), r3-W2 (własny czas pętli 2 × [1 s w górę + 2 s w dół],
 * etykieta fazy zgodna z ruchem), r3-N1 (bez przeskoku przy restarcie pętli, drugie powtórzenie czysto bokiem), r3-Ś1 (próg toru łukowego w rzucie na płaszczyznę widoku), decyzja koordynatora 04.11.2026
 * (Car Drivers: wysokość rąk, nie stały łokieć). Każda miara ma negatyw: dane okaleczone do stanu sprzed poprawki albo inne ćwiczenie.
 */
import { keyframeFrame, jointAngles, validatePose, CONTRACT, ONE_WAY, oneWayAt, oneWayLength, oneWayRepMs, ONE_WAY_REP_MS, TEMPO, DATA_UI, type PoseData, type View } from '@/lib/figures/v2';
import { progLukuRamienia, DODATEK_SKRETU } from './helpers/tor-luk-ramienia';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/delt_raise.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const SENS = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')).rodziny.delt_raise;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/delt_raise.mjs'), 'utf8');
const kopia = (d: PoseData) => JSON.parse(JSON.stringify(d)) as PoseData;
const K = 'Alternating Deltoid Raise';
const UU = Array.from({ length: 601 }, (_, i) => i / 600);
const lokcie = (d: PoseData, side: 'R' | 'L') => UU.map(u => jointAngles(keyframeFrame(d, u).sk, side).elbow);
const zakres = (a: number[]) => ({ span: Math.max(...a) - Math.min(...a), max: Math.max(...a) });
const poz = (d: PoseData, u: number) => { const a = keyframeFrame(d, u).sk.arms.R; return { h: a.grip[1] - a.shoulder[1], x: a.grip[0] - a.shoulder[0], z: Math.abs(a.grip[2] - a.shoulder[2]) }; };

describe('r3-W1 Alternating Deltoid Raise: łokieć stały (front.elbows) — reguła lokiec_staly wraca', () => {
  test('zmiana kąta łokcia obu rąk ≤ 12° i kąt ≤ 40° w 601 ułamkach ruchu (parametry reguły z danych sensu)', () => {
    const q = SENS.reguly.lokiec_staly.parametry;
    for (const s of ['R', 'L'] as const) { const r = zakres(lokcie(DATA[K], s)); expect([s, r.span <= q.max_zmiana_deg, r.max <= q.max_deg]).toEqual([s, true, true]); }
  });
  test('dane sensu: Alternating ma regułę lokiec_staly (bez lokcie_na_wysokosci_barkow_u1 i ramie_unosi_sie), a puste warianty [] zniknęły', () => {
    expect(SENS.warianty[K]).toEqual(['lokiec_staly']);
  });
  test('negatyw: ta sama pętla z co trzecią klatką (długie cięciwy łuku, stan sprzed poprawki) łamie regułę — zmiana kąta łokcia > 12°', () => {
    const rzadka = kopia(DATA[K]); rzadka.klatki = rzadka.klatki.filter((_, i, a) => i % 3 === 0 || i === a.length - 1);
    expect(zakres(lokcie(rzadka, 'R')).span).toBeGreaterThan(12);
  });
  test('negatyw: Lateral Raise o stałym zgięciu 5–13° nie jest miarą zapasu — Alternating ma zgięcie ≈ 25–37°, ale tylko 12° zmiany', () => {
    const r = zakres(lokcie(DATA[K], 'R')); expect(r.span).toBeLessThanOrEqual(12); expect(Math.min(...lokcie(DATA[K], 'R'))).toBeGreaterThan(20);
  });
  test('Car Drivers (decyzja koordynatora 04.11.2026, wariant 1): bez lokiec_staly, z lokcie_na_wysokosci_barkow_u1, a zdanie cdr.move mapuje na tę regułę', () => {
    expect(SENS.warianty['Car Drivers']).toEqual(['lokcie_na_wysokosci_barkow_u1']);
    expect(SENS.wskazowki_na_reguly['cdr.move']).toEqual(['lokcie_na_wysokosci_barkow_u1']);
    expect(SENS.reguly.lokcie_na_wysokosci_barkow_u1.cue).toBe('lat.height'); /* reguła ma własne zdanie w lat.height; Car Drivers dostaje ją przez cdr.move */
  });
  test('negatyw: Lateral Raise nie ma wariantu — domyślne reguły rodziny; wariantów ze zdjętą regułą stałego łokcia jest dokładnie jeden (Car Drivers)', () => {
    expect(SENS.warianty['Lateral Raise (hantle)']).toBeUndefined();
    expect(Object.entries(SENS.warianty).filter(([, v]) => Array.isArray(v) && v.length > 0 && !(v as string[]).includes('lokiec_staly')).map(([k]) => k)).toEqual(['Car Drivers']);
  });
});

describe('r3-W2 Alternating Deltoid Raise: czas pętli 2 × (1 s w górę + 2 s w dół), etykieta fazy', () => {
  test('ONE_WAY_REP_MS: Alternating = 2 × (upMs + downMs) = 6000 ms; skoki i rzuty (inne ćwiczenia) zostają przy ONE_WAY.repMs', () => {
    expect(ONE_WAY_REP_MS[K]).toBe(2 * (TEMPO.upMs + TEMPO.downMs)); expect(oneWayRepMs(K)).toBe(6000);
    for (const k of ['Jump Squat', 'Box Jump', 'Wall Ball', undefined]) expect([k, oneWayRepMs(k)]).toEqual([k, ONE_WAY.repMs]);
  });
  test('oneWayAt/oneWayLength: bez parametru jak dotąd (1500 ms), z repMs 6000 pętla trwa 500 + 6000 + 500 ms i u rośnie liniowo w czasie', () => {
    expect(oneWayLength()).toBe(2500); expect(oneWayLength(6000)).toBe(7000);
    expect(oneWayAt(500 + 750)).toBeCloseTo(0.5, 6); expect(oneWayAt(500 + 3000, 6000)).toBeCloseTo(0.5, 6); expect(oneWayAt(500 + 1000, 6000)).toBeCloseTo(1 / 6, 6); expect(oneWayAt(250, 6000)).toBe(0); expect(oneWayAt(6900, 6000)).toBe(1);
    expect(oneWayAt(7000 + 500 + 3000, 6000)).toBeCloseTo(0.5, 6); /* zawinięcie pętli */
  });
  test('ruch w czasie: szczyt przodem po 1 s, zwis po 3 s (opuszczanie 2 s), szczyt bokiem po 4 s, zwis po 6 s — czas = u × 6000 ms', () => {
    const t = (u: number) => u * oneWayRepMs(K); const h = (u: number) => poz(DATA[K], u).h;
    const maks = (a: number, b: number) => UU.filter(u => u >= a && u <= b).reduce((m, u) => (h(u) > h(m) ? u : m));
    expect(t(maks(0, 0.4))).toBeGreaterThan(900); expect(t(maks(0, 0.4))).toBeLessThan(1100); /* pierwszy szczyt ≈ 1000 ms */
    expect(t(maks(0.5, 1))).toBeGreaterThan(3900); expect(t(maks(0.5, 1))).toBeLessThan(4100); /* drugi szczyt ≈ 4000 ms */
    expect(h(0.5)).toBeLessThanOrEqual(-50); /* zwis po 3 s */
    const zw = (a: number, b: number, pr: (x: number) => boolean) => UU.filter(u => u >= a && u <= b && pr(h(u)))[0];
    expect(t(zw(1 / 6, 0.5, x => x <= -55)!) - 1000).toBeGreaterThan(1700); /* od szczytu do zwisu ≈ 2 s (≥ 1,7 s) */
    expect(t(zw(0, 1 / 6, x => x >= -10)!)).toBeGreaterThan(300); /* podnoszenie ≈ 1 s: dłoń dochodzi do wysokości barków dopiero w drugiej połowie sekundy */
  });
  test('negatyw: czas z ONE_WAY.repMs (1500 ms) dawałby 0,4 s na unoszenie i opuszczanie — poniżej 1 s zalecanego tempa', () => {
    expect(ONE_WAY.repMs / 4).toBeLessThan(TEMPO.upMs); expect(oneWayRepMs(K) / 6).toBeGreaterThanOrEqual(TEMPO.upMs); /* 6000 ms: ruch w górę 1/6 pętli = 1000 ms */
  });
  test('etykieta fazy: „Naprzemiennie” zamiast „Unoszenie” (pętla zawiera też opuszczanie); reszta rodziny bez zmian', () => {
    expect(DATA[K].petla).toBe('jednokierunkowa'); expect(DATA_UI.delt_raise.exceptions?.[K]?.names).toEqual({ first: 'Naprzemiennie', second: 'Naprzemiennie' });
    expect(DATA_UI.delt_raise.names).toEqual({ first: 'Unoszenie', second: 'Opuszczanie' }); expect(Object.keys(DATA_UI.delt_raise.exceptions ?? {})).toEqual(['Car Drivers', K]);
  });
  test('komponent przekazuje czas pętli ćwiczenia do oneWayAt (a nie stałą ONE_WAY.repMs)', () => {
    const C = fs.readFileSync(path.join(__dirname, '../components/ExerciseFigureV2.tsx'), 'utf8'); expect(C).toMatch(/oneWayAt\(ms, oneWayRepMs\(spec\.key\)\)/);
  });
});

describe('r3-N1 Alternating Deltoid Raise: bez przeskoku przy restarcie, drugie powtórzenie czysto bokiem', () => {
  test('koniec pętli = początek: obie dłonie w tym samym miejscu (≤ 0,5 cm), więc restart (u = 1 → 0) nie ma skoku', () => {
    for (const s of ['R', 'L'] as const) { const a = keyframeFrame(DATA[K], 0).sk.arms[s].grip, b = keyframeFrame(DATA[K], 1).sk.arms[s].grip; expect([s, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) <= 0.5]).toEqual([s, true]); }
  });
  test('największy skok dłoni R między sąsiednimi ułamkami 1/600 pętli ≤ 2 cm (w tym na złączu u = 1 → 0 i w zwisie między powtórzeniami)', () => {
    const g = (u: number) => keyframeFrame(DATA[K], u).sk.arms.R.grip; let m = 0;
    for (let i = 0; i < 600; i++) { const a = g(i / 600), b = g(((i + 1) % 600) / 600); m = Math.max(m, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])); }
    expect(m).toBeLessThanOrEqual(2.5);
  });
  test('drugie powtórzenie (od pierwszej klatki po zwisie do powrotu) leży w płaszczyźnie bocznej: dłoń ≤ 15 cm przed barkiem; pierwsze — w strzałkowej: ≤ 28 cm w poprzek', () => {
    for (const u of UU.filter(u => u >= 3.5 / 6 && u <= 5.0 / 6)) { const p = poz(DATA[K], u); expect([u, p.x <= 15 && p.z >= 19]).toEqual([u, true]); }
    for (const u of UU.filter(u => u >= 0.3 / 6 && u <= 2.7 / 6)) { const p = poz(DATA[K], u); expect([u, p.z <= 28, p.x >= 0]).toEqual([u, true, true]); }
  });
  test('negatyw: stan sprzed poprawki (ostatnia klatka = zwis przy bokach, pierwsza = przed udami) ma skok ≥ 20 cm na złączu', () => {
    const stare = kopia(DATA[K]); const o = stare.klatki[stare.klatki.length - 1]; const p = stare.klatki[0];
    for (const s of ['R', 'L'] as const) { const g = (o.rece as any)[s].chwyt as number[]; const g0 = (p.rece as any)[s].chwyt as number[]; g[0] = g0[0] - 20; g[2] = g0[2] + (g0[2] >= 0 ? 12 : -12); }
    const a = keyframeFrame(stare, 0).sk.arms.R.grip, b = keyframeFrame(stare, 1).sk.arms.R.grip; expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeGreaterThanOrEqual(20);
  });
  test('generator: jedna funkcja alternating() buduje pętlę (parametry jawne), zwis N wspólny dla początku, środka i końca', () => {
    expect(GEN).toMatch(/export function alternating\(/); expect(GEN).toMatch(/\[6, \.\.\.N\]/); expect(GEN).toMatch(/\[0, \.\.\.N\]/);
  });
});

describe('Alternating Deltoid Raise: liczba klatek ponad zalecane 12 jest wyjątkiem deklarowanym (CONTRACT.frames.maxDynamic)', () => {
  const ctx = (dynamic: boolean) => ({ family: 'delt_raise', exercise: K, errorCues: [] as string[], rom: JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/data.json'), 'utf8')).rom, dynamic });
  test('dane: 17 klatek, więcej niż CONTRACT.frames.max (12), nie więcej niż maxDynamic; wszystkie inne pozy rodziny mają ≤ 12', () => {
    expect(DATA[K].klatki.length).toBe(17); expect(CONTRACT.frames.maxDynamic).toBeGreaterThan(CONTRACT.frames.max); expect(DATA[K].klatki.length).toBeLessThanOrEqual(CONTRACT.frames.maxDynamic);
    for (const [k, d] of Object.entries(DATA)) if (k !== K) expect([k, d.klatki.length <= CONTRACT.frames.max]).toEqual([k, true]);
  });
  test('walidator: z deklaracją dynamiczne 17 klatek nie daje błędu schematu; bez deklaracji — „za dużo elementów”; 21 klatek odpada także z deklaracją', () => {
    const sch = (dyn: boolean, d: PoseData) => validatePose(d, ctx(dyn)).filter(i => i.kod === 'schemat').map(i => i.szczegol);
    expect(sch(true, DATA[K] as PoseData)).toEqual([]); expect(sch(false, DATA[K] as PoseData).join()).toMatch(/za dużo elementów/);
    const dluga = kopia(DATA[K]); while (dluga.klatki.length < 21) dluga.klatki.push({ ...dluga.klatki[dluga.klatki.length - 1] }); expect(sch(true, dluga).join()).toMatch(/za dużo elementów/);
  });
  test('walidator: pętla jednokierunkowa zamknięta (u = 1 = u = 0) przechodzi bramkę ruchu, a ta sama pętla jako wahadło — nie', () => {
    const r = (d: PoseData) => validatePose(d, ctx(true)).filter(i => i.kod === 'ruch');
    const zamknieta = DATA[K]; const wahadlo = kopia(DATA[K]); delete (wahadlo as { petla?: string }).petla;
    expect(r(zamknieta as PoseData)).toEqual([]); expect(r(wahadlo).length).toBeGreaterThan(0);
  });
});

describe('r3-Ś1 próg toru łukowego w rzucie na płaszczyznę widoku', () => {
  const dev = (d: PoseData, v: View) => { const P = Array.from({ length: 49 }, (_, i) => keyframeFrame(d, i / 48).sk.arms.R.grip).map(g => (v === 'side' ? [g[0], g[1]] : [-g[2], g[1]])); const a = P[0], b = P[P.length - 1]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return Math.max(...P.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L)); };
  test('Lateral Raise: z boku (łuku nie widać) próg ≈ minimum 4 cm, z przodu ≈ 15 cm; Reverse Fly odwrotnie', () => {
    expect(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'side')).toBeLessThanOrEqual(5); expect(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'front')).toBeGreaterThan(14);
    expect(progLukuRamienia(DATA['Reverse Fly (hantle)'], 'side')).toBeLessThanOrEqual(5); expect(progLukuRamienia(DATA['Reverse Fly (hantle)'], 'front')).toBeGreaterThan(13);
  });
  test('luz progu nad pomiarem ≤ 4 cm w obu widokach dla ćwiczeń bez dodatku (Y Raise: było ok. 8 cm), próg nigdy poniżej pomiaru', () => {
    for (const k of ['Lateral Raise (hantle)', 'Reverse Fly (hantle)', 'Machine Lateral Raise', 'Y Raise (hantle)', 'Cable Y Raise', 'Front Raise', 'Dumbbell Front Raise to Overhead'])
      for (const v of ['front', 'side'] as View[]) { const p = progLukuRamienia(DATA[k], v), m = dev(DATA[k], v); expect([k, v, p >= m, p - m <= 4.6]).toEqual([k, v, true, true]); }
  });
  test('negatyw: próg 3D sprzed poprawki (jeden dla obu widoków) przepuszczałby 13 cm wybrzuszenia z boku: Lateral Raise z boku ma pomiar < 3 cm przy progu 3D ≈ 15 cm', () => {
    expect(dev(DATA['Lateral Raise (hantle)'], 'side')).toBeLessThan(3); expect(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'front')).toBeGreaterThan(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'side') + 9);
  });
  test('dodatki skrętu płaszczyzny (Scaption, Front Incline) są nadal potrzebne: bez nich próg byłby poniżej pomiaru', () => {
    for (const [id, add] of Object.entries(DODATEK_SKRETU)) { const [k, v] = id.split('|') as [string, View]; expect([id, add > 0, progLukuRamienia(DATA[k], v, 0) < dev(DATA[k], v), progLukuRamienia(DATA[k], v, add) >= dev(DATA[k], v)]).toEqual([id, true, true, true]); }
  });
});
