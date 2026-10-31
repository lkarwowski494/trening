/*
 * Figury v2, rodzina mobility_stand (planned) — ACG-013 (audyt ćwiczeń 31.10.2026, zadanie ACG-T-017).
 * Standing Gastrocnemius Calf Stretch miał dane identyczne z Wall Calf Stretch (wykrok przy ścianie, wszystkie pięty i palce na podłodze), a zestaw gcalf.* opisuje rozciąganie na stopniu:
 * „stań przednią częścią stopy na krawędzi stopnia”, „opuść piętę poniżej krawędzi”. Miara: keyframeFrame na obu klatkach; stopień = wpis sprzętu `skrzynia`, noga rozciągana = ta z mniejszym zgięciem kolana.
 * Konwencje testowe: pięta ≥ 2 cm poniżej krawędzi stopnia, palce na stopniu (±1,5 cm od blatu), pięta poza krawędzią (x pięty < x0), kolano rozciąganej nogi ≤ 10°.
 */
import * as fs from 'fs';
import * as path from 'path';
import { SIDES, jointAngles, keyframeFrame, type PoseData } from '@/lib/figures/v2';

const CW: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/mobility_stand.json'), 'utf8')).cwiczenia;
const K = 'Standing Gastrocnemius Calf Stretch';
type Gear = { rodzaj: string; x0?: number; x1?: number; top?: number };
const stopien = (d: PoseData): Gear | undefined => (d.sprzet as Gear[]).find(g => g.rodzaj === 'skrzynia');

describe('ACG-013 (31.10.2026): Standing Gastrocnemius Calf Stretch — na stopniu, nie kopia Wall Calf Stretch', () => {
  test('sprzęt zawiera stopień (skrzynia) z blatem i krawędzią', () => {
    const g = stopien(CW[K]); expect(g).toBeDefined(); expect(g!.top).toBeGreaterThan(3); expect(g!.top).toBeLessThanOrEqual(15);
  });
  test.each([0, 1])('u = %s: rozciągana noga ma palce na stopniu i piętę poniżej krawędzi, kolano proste', u => {
    const g = stopien(CW[K]); if (!g) throw new Error('brak stopnia');
    const sk = keyframeFrame(CW[K], u).sk; const side = SIDES.reduce((a, b) => jointAngles(sk, a).knee <= jointAngles(sk, b).knee ? a : b); const L = sk.legs[side];
    expect(jointAngles(sk, side).knee).toBeLessThanOrEqual(10);
    expect(L.heel[1]).toBeLessThanOrEqual(g.top! - 2);
    expect(Math.abs(L.toe[1] - g.top!)).toBeLessThanOrEqual(1.5);
    expect(L.heel[0]).toBeLessThan(g.x0!); expect(L.toe[0]).toBeGreaterThan(g.x0!);
  });
  test('druga noga (z zgiętym kolanem) stoi na podłodze, nie na stopniu', () => {
    const g = stopien(CW[K]); if (!g) throw new Error('brak stopnia');
    const sk = keyframeFrame(CW[K], 0).sk; const side = SIDES.reduce((a, b) => jointAngles(sk, a).knee >= jointAngles(sk, b).knee ? a : b); const L = sk.legs[side];
    expect(Math.max(L.heel[1], L.toe[1])).toBeLessThan(g.top!); expect(Math.min(L.heel[1], L.toe[1])).toBeLessThanOrEqual(1.5);
  });
  test('Wall Calf Stretch zostaje przy ścianie, bez stopnia (wariant różny od Gastrocnemius)', () => {
    expect(stopien(CW['Wall Calf Stretch'])).toBeUndefined();
    expect(JSON.stringify(CW[K].klatki)).not.toEqual(JSON.stringify(CW['Wall Calf Stretch'].klatki));
  });
});
