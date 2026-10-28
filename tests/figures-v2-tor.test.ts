/*
 * Strażnik toru ruchu (skan torów; lekcja w docs/40; decyzja właściciela 28.10.2026, wariant A — naprawa torów przed 1.0): ślad ciężaru (trailFor, ten sam punkt `info.load`)
 * każdego ćwiczenia z gotowych rodzin v2, w każdym pokazywanym widoku — bez wybrzuszeń „S”: najwyżej jedna zmiana kierunku w poziomie i odchylenie od prostej
 * między końcami ≤ 4 cm (kalibracja na ocenach właściciela z telefonu, build 1032: hantle 1,7 cm „dobrze”, sztanga 4,2 cm i 2 zawrócenia „źle”).
 * Maszyna Smitha: szyna stoi w miejscu, gryf na szynie (było: szyna rysowana w bieżącym x gryfu, tor ukośny 15–18 cm).
 * Wyjątki: tests/tor-wyjatki.json („ćwiczenie|widok” → powód); lista tylko maleje — wyjątek, który już spełnia progi, trzeba usunąć.
 */
import { FAMILIES, figureSpec, frameAt, assignAll, proj, legRadius, contactX, EQUIP, GIRTH, type View, type HingeParams } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const WYJATKI: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, 'tor-wyjatki.json'), 'utf8'));
const PROG = { odchylenie: 4, zawrocenia: 1 };
const ready = new Set(FAMILIES.filter(f => f.status === 'ready').map(f => f.id));
const CASES: [string, View][] = Object.entries(assignAll()).filter(([k, fam]) => ready.has(fam as never) && !figureSpec(k)!.static)
  .flatMap(([k, fam]) => FAMILIES.find(f => f.id === fam)!.views.map(v => [k, v] as [string, View]));

/** Odchylenie łamanej od prostej między końcami (cm) i liczba zmian kierunku w poziomie (ruchy < 0,05 cm pomijane). */
export function ksztaltToru(pts: [number, number][]): { odchylenie: number; zawrocenia: number } {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odchylenie = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L));
  let zawrocenia = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) zawrocenia++; sg = s; }
  return { odchylenie, zawrocenia };
}
const tor = (k: string, v: View) => ksztaltToru(Array.from({ length: 25 }, (_, i) => frameAt(figureSpec(k)!, i / 24).info.load).filter(Boolean).map(p => proj(p!, v) as [number, number]));
const ok = (t: { odchylenie: number; zawrocenia: number }) => t.odchylenie <= PROG.odchylenie && t.zawrocenia <= PROG.zawrocenia;

describe('tor ciężaru bez wybrzuszeń (gotowe rodziny v2, 28.10.2026)', () => {
  test('miara potrafi paść: „S” jak w buildzie 1032 (4,2 cm, 2 zawrócenia) — źle; łuk 1,7 cm — dobrze', () => {
    const S: [number, number][] = [[9.6, 23], [12, 30], [13.6, 49], [11.5, 56], [4.8, 66], [6.5, 72], [8.6, 76]];
    expect(ok(ksztaltToru(S))).toBe(false);
    expect(ok(ksztaltToru([[6, 20], [7, 40], [7.7, 60], [6.5, 80]]))).toBe(true);
  });
  test('każde ćwiczenie i widok spełnia progi albo ma wyjątek z powodem', () => {
    const zle = CASES.filter(([k, v]) => !WYJATKI[`${k}|${v}`]).map(([k, v]) => ({ k, v, ...tor(k, v) })).filter(t => !ok(t))
      .map(t => `${t.k}|${t.v}: ${t.odchylenie.toFixed(1)} cm, ${t.zawrocenia} zawr.`);
    expect(zle).toEqual([]);
  });
  test('lista wyjątków tylko maleje: każdy wyjątek nadal przekracza próg, ma powód i istnieje', () => {
    const keys = new Set(CASES.map(([k, v]) => `${k}|${v}`));
    for (const [id, powod] of Object.entries(WYJATKI)) {
      expect([id, keys.has(id)]).toEqual([id, true]); expect(powod.length).toBeGreaterThan(20);
      const [k, v] = id.split('|') as [string, View]; expect([id, ok(tor(k, v))]).toEqual([id, false]);
    }
  });
  test('martwe ciągi ze sztangą (skan 28.10.2026: 11 ćwiczeń z torem „S”) nie mają wyjątku', () => {
    for (const k of ['Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Reverse Band Deadlift', 'Clean Deadlift', 'Deficit Deadlift', 'Snatch Deadlift', 'Cable Deadlift', 'Rack Pull', 'Rack Pull with Bands', 'Smith Machine Stiff-Legged Deadlift'])
      expect([k, WYJATKI[`${k}|side`]]).toEqual([k, undefined]);
  });
  test('maszyna Smitha: szyna stoi w miejscu, gryf na szynie w każdej klatce', () => {
    const smith = CASES.map(([k]) => k).filter((k, i, a) => a.indexOf(k) === i && /Smith/.test(k));
    expect(smith.length).toBeGreaterThanOrEqual(6);
    for (const k of smith) {
      const xs = Array.from({ length: 13 }, (_, i) => frameAt(figureSpec(k)!, i / 12)).map(f => { const r = f.props.find(p => p.k === 'rail') as { x: number } | undefined; return { rail: r?.x, bar: f.info.load[0] }; });
      expect([k, xs.every(x => x.rail !== undefined)]).toEqual([k, true]);
      expect([k, +(Math.max(...xs.map(x => x.rail!)) - Math.min(...xs.map(x => x.rail!))).toFixed(2)]).toEqual([k, 0]);
      for (const x of xs) expect([k, +Math.abs(x.bar - x.rail!).toFixed(2)]).toEqual([k, 0]);
    }
  });
});

describe('gumy kotwiczone na podłodze: dolny koniec stoi w miejscu (recenzja niezależna 28.10.2026, F3; było: jechał z gryfem — Band Bench Press 15 cm, Sumo with Bands 8 cm, Deadlift with Bands 3,3 cm, Rack Pull with Bands 2,5 cm)', () => {
  test('każda guma sztangi „do podłogi” (bar, bez hang) ma dolny koniec w tym samym x we wszystkich klatkach', () => {
    const keys = [...new Set(CASES.map(([k]) => k))]; let n = 0;
    for (const k of keys) { const to = Array.from({ length: 25 }, (_, i) => frameAt(figureSpec(k)!, i / 24).props.find(p => p.k === 'band' && p.bar && !p.hang) as { to: [number, number, number] } | undefined);
      if (!to[0]) continue; n++; const xs = to.map(b => b!.to[0]); expect([k, +(Math.max(...xs) - Math.min(...xs)).toFixed(2)]).toEqual([k, 0]); }
    expect(n).toBeGreaterThanOrEqual(7);
  });
});

describe('zawias: styk ciężaru z nogą (legRadius, contactX)', () => {
  test('promień nogi jak na rysunku, nie mniej niż promień kolizji: biodro ze spodenkami, kolano i kostka na promieniu kolizji, łydka grubsza', () => {
    expect(legRadius('thigh', 0)).toBeCloseTo(GIRTH.thigh[0] + 0.7, 5);
    expect(legRadius('thigh', 1)).toBeCloseTo((GIRTH.thigh[0] + GIRTH.thigh[2]) / 2, 5);
    expect(legRadius('shank', 0.3)).toBeCloseTo(GIRTH.shank[1], 5);
    expect(legRadius('shank', 1)).toBeCloseTo((GIRTH.shank[0] + GIRTH.shank[2]) / 2, 5);
  });
  test('gryf przed pionową golenią w połowie jej wysokości: x = oś nogi + promień nogi + promień gryfu; nad nogą bez ograniczenia', () => {
    const p = { style: 'floor', impl: 'barbell', stance: 15, toeOut: 0, grip: 25, shin: { stand: 0, perKnee: 0, max: 0 }, sx: [0, 0] } as HingeParams;
    const legs = [{ hip: [0, 90, 15], knee: [0, 50, 15], ankle: [0, 10, 15] }] as { hip: [number, number, number]; knee: [number, number, number]; ankle: [number, number, number] }[];
    expect(contactX(p, 30, legs)).toBeCloseTo(legRadius('shank', 0.5) + EQUIP.barR, 1);
    expect(contactX(p, 130, legs)).toBe(-Infinity);
  });
});

describe('L-050 A (właściciel 28.10.2026): recenzja ruchu z arkuszem śladu toru', () => {
  test('wpis recenzji v2 od 29.10.2026 ma pole „slad” (co obejrzano: arkusz z nałożonym śladem); CLAUDE.md zapisuje regułę', () => {
    const rec = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/research/figury-recenzja.json'), 'utf8')).v2 as Record<string, { data: string; slad?: string }>;
    const strazniK = (d: Record<string, { data: string; slad?: string }>) => Object.entries(d).filter(([, e]) => e.data >= '2026-10-29' && !(e.slad && e.slad.trim().length > 10)).map(([k]) => k);
    expect(strazniK(rec)).toEqual([]);
    expect(strazniK({ a: { data: '2026-10-29' }, b: { data: '2026-10-28' }, c: { data: '2026-11-02', slad: 'arkusz duze-po, ślad toru u 0–1' } })).toEqual(['a']);
    expect(fs.readFileSync(path.join(__dirname, '../CLAUDE.md'), 'utf8')).toMatch(/arkusz z nałożonym śladem toru[^\n]*tests\/figures-v2-tor\.test\.ts/);
  });
});
