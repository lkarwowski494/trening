/*
 * Figury v2, rodzina leg_isolation (planned) — ACG-019 (audyt ćwiczeń 31.10.2026, zadanie ACG-T-022), część „Seated Band Hamstring Curl”.
 * Zestaw legCurl mówi „Uda i biodra nieruchomo — ruch tylko w kolanach”, a rysunek opuszczał udo przy wyproście (kolano y 49,6 → 31,1; biodro 92° → 67°).
 * Slider / Stability Ball Hamstring Curl: zestaw ht.rigid („Ruch tylko w biodrach”) i gb.move („Unieś biodra…”) przeczył rysunkowi (miednica stoi, biodro zgina się z kolanem).
 * Miara: jointAngles na siatce u = 0…1 co 0,125 (pętla), ruchoma noga (R). Konwencje testowe: zakres biodra ≤ 5° (zadanie), zakres kolana ≥ 45° (ruch to zgięcie kolana), kostka nie schodzi pod podłogę.
 */
import * as fs from 'fs';
import * as path from 'path';
import { jointAngles, keyframeFrame, type PoseData } from '@/lib/figures/v2';

const CW: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/leg_isolation.json'), 'utf8')).cwiczenia;
const GRID = Array.from({ length: 9 }, (_, i) => i / 8);
const zakres = (xs: number[]): number => Math.max(...xs) - Math.min(...xs);

describe('ACG-019 (31.10.2026): Seated Band Hamstring Curl — udo nieruchomo, ruch w kolanie', () => {
  const K = 'Seated Band Hamstring Curl';
  test('zakres biodra ruchomej nogi w całej pętli ≤ 5°', () => {
    expect(zakres(GRID.map(u => jointAngles(keyframeFrame(CW[K], u).sk, 'R').hip))).toBeLessThanOrEqual(5);
  });
  test('kolano ruchomej nogi zgina się o ≥ 45° (ruch zostaje)', () => {
    expect(zakres(GRID.map(u => jointAngles(keyframeFrame(CW[K], u).sk, 'R').knee))).toBeGreaterThanOrEqual(45);
  });
  test('kolano ruchomej nogi nie przesuwa się o więcej niż 3 cm (udo stoi)', () => {
    const kn = GRID.map(u => keyframeFrame(CW[K], u).sk.legs.R.knee); const d = Math.max(...kn.map(k => Math.hypot(k[0] - kn[0][0], k[1] - kn[0][1], k[2] - kn[0][2])));
    expect(d).toBeLessThanOrEqual(3);
  });
  test('kostka ruchomej nogi nie schodzi pod podłogę', () => {
    for (const u of GRID) expect(keyframeFrame(CW[K], u).sk.legs.R.ankle[1]).toBeGreaterThanOrEqual(6.9);
  });
});

describe('ACG-019 (31.10.2026): Slider / Stability Ball Hamstring Curl — zestaw zgodny z rysunkiem', () => {
  const SETS: Record<string, { ok?: string[]; err?: string[] }> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/cue-sets.json'), 'utf8')).items;
  const K = 'Slider Hamstring Curl';
  const miednica = GRID.map(u => keyframeFrame(CW[K], u).sk.pelvis[1]);
  const biodro = GRID.map(u => jointAngles(keyframeFrame(CW[K], u).sk, 'R').hip);
  test('rysunek: miednica stoi (≤ 2 cm), biodro zgina się z kolanem (zakres ≥ 30°), kolano zgina się ≥ 45°', () => {
    expect(zakres(miednica)).toBeLessThanOrEqual(2); expect(zakres(biodro)).toBeGreaterThanOrEqual(30);
    expect(zakres(GRID.map(u => jointAngles(keyframeFrame(CW[K], u).sk, 'R').knee))).toBeGreaterThanOrEqual(45);
  });
  test.each(['Stability Ball Hamstring Curl'])('%s: zestaw bez zdań o ruchu tylko w biodrach, unoszeniu bioder i nieruchomych udach; zostają zdania zgodne z rysunkiem', k => {
    const ok = SETS[k].ok ?? [];
    for (const id of ['ht.rigid', 'gb.move', 'lcurl.still']) expect([k, ok.includes(id), id]).toEqual([k, false, id]);
    expect(ok).toEqual(['llc.control']); /* lcurl.move pasowałoby lepiej, ale nie ma wpisu źródeł w wskazowki-ogolne.json — do badacza */
  });
  /* 09.11.2026 (partia B2): Slider Hamstring Curl ma kartę własną z badań (most: „biodra cały czas w górze”, błąd ballcurl.mis.sag), która PRZECZY rysunkowi
     (miednica nisko, biodro zgina się z kolanem). Karta zostaje ukryta (lista hidden, karty_nowe) do decyzji koordynatora: przebudowa rysunku na most albo powrót do zestawu ogólnego (STAN-B2.md). */
  test('Slider Hamstring Curl (B2, 09.11.2026): karta własna przeczy rysunkowi — jest ukryta, a zestaw ogólny nie wraca', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cues = require('../lib/cues/data.json') as { hidden: string[]; exercises: Record<string, unknown> };
    expect([SETS[K], cues.hidden.includes(K), K in cues.exercises]).toEqual([{ b: 'own' }, true, false]);
  });
  test('Stability Ball Hamstring Curl (recenzja 31.10.2026): bez gb.heels — pięty leżą na piłce, nie na podłodze', () => {
    expect(SETS['Stability Ball Hamstring Curl'].ok).not.toContain('gb.heels');
  });
});
