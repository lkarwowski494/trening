/*
 * Strażnik toru ruchu (skan torów; lekcja w docs/40; decyzja właściciela 28.10.2026, wariant A — naprawa torów przed 1.0): ślad ciężaru (trailFor, ten sam punkt `info.load`)
 * każdego ćwiczenia z gotowych rodzin v2, w każdym pokazywanym widoku — bez wybrzuszeń „S”: najwyżej jedna zmiana kierunku w poziomie i odchylenie od prostej
 * między końcami ≤ 4 cm (kalibracja na ocenach właściciela z telefonu, build 1032: hantle 1,7 cm „dobrze”, sztanga 4,2 cm i 2 zawrócenia „źle”).
 * Maszyna Smitha: szyna stoi w miejscu, gryf na szynie (było: szyna rysowana w bieżącym x gryfu, tor ukośny 15–18 cm).
 * Wyjątki: tests/tor-wyjatki.json („ćwiczenie|widok” → powód); lista tylko maleje — wyjątek, który już spełnia progi, trzeba usunąć.
 */
import { FAMILIES, figureSpec, frameAt, assignAll, proj, legRadius, contactX, EQUIP, GIRTH, HINGE, type View, type HingeParams } from '@/lib/figures/v2';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const WYJATKI: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, 'tor-wyjatki.json'), 'utf8'));
const PROG = { odchylenie: 4, zawrocenia: 1 };
const ready = new Set(FAMILIES.filter(f => f.status === 'ready').map(f => f.id));
const CASES: [string, View][] = Object.entries(assignAll()).filter(([k, fam]) => ready.has(fam as never) && !!figureSpec(k) /* rodzina z danych pozy (pull_up, 1.1): ćwiczenia bez wpisu w pliku póz nie mają figury */ && !figureSpec(k)!.static)
  .flatMap(([k, fam]) => FAMILIES.find(f => f.id === fam)!.views.map(v => [k, v] as [string, View]));

/** Odchylenie łamanej od prostej między końcami (cm) i liczba zmian kierunku w poziomie (ruchy < 0,05 cm pomijane). */
export function ksztaltToru(pts: [number, number][]): { odchylenie: number; zawrocenia: number } {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odchylenie = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L));
  let zawrocenia = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) zawrocenia++; sg = s; }
  return { odchylenie, zawrocenia };
}
/* rodziny z danych póz (curl) podają ślad w info.trail (W1: ślad = chwyt), nie info.load */
const tor = (k: string, v: View) => ksztaltToru(Array.from({ length: 25 }, (_, i) => { const f = frameAt(figureSpec(k)!, i / 24); return f.info.load ?? f.info.trail; }).filter(Boolean).map(p => proj(p!, v) as [number, number]));
/* Ruch po łuku wokół stawu (curl, 03.11.2026): chwyt kreśli łuk o promieniu przedramienia (ok. 15–24 cm odchylenia od cięciwy — fizycznie poprawne), więc próg 4 cm (tor prostoliniowy gryfu) go nie dotyczy;
   dla łuku obowiązuje: najwyżej jedna zmiana kierunku w poziomie (bez „S”) i odchylenie ≤ PROG_LUK cm (ochrona przed ucieczką toru). Do potwierdzenia przez recenzenta niezależnego razem z arkuszem śladu. */
const LUKOWE = new Set(['curl']); const PROG_LUK = 26; /* C1 (recenzja niezależna 03.11.2026): geometria — strzałka łuku r·(1 − cos(Δθ/2)) ≈ 21 cm + dryf łokcia ≈ 4 cm; pomiar max 23,8 cm; 30 cm dawało ok. 6 cm luzu */ const FAM = assignAll() as Record<string, string>;
const ok = (t: { odchylenie: number; zawrocenia: number }, k?: string) => (k && LUKOWE.has(FAM[k]) ? t.odchylenie <= PROG_LUK : t.odchylenie <= PROG.odchylenie) && t.zawrocenia <= PROG.zawrocenia;

describe('tor ciężaru bez wybrzuszeń (gotowe rodziny v2, 28.10.2026)', () => {
  test('miara potrafi paść: „S” jak w buildzie 1032 (4,2 cm, 2 zawrócenia) — źle; łuk 1,7 cm — dobrze', () => {
    const S: [number, number][] = [[9.6, 23], [12, 30], [13.6, 49], [11.5, 56], [4.8, 66], [6.5, 72], [8.6, 76]];
    expect(ok(ksztaltToru(S))).toBe(false);
    expect(ok(ksztaltToru([[6, 20], [7, 40], [7.7, 60], [6.5, 80]]))).toBe(true);
  });
  test('każde ćwiczenie i widok spełnia progi albo ma wyjątek z powodem', () => {
    const zle = CASES.filter(([k, v]) => !WYJATKI[`${k}|${v}`]).map(([k, v]) => ({ k, v, ...tor(k, v) })).filter(t => !ok(t, t.k))
      .map(t => `${t.k}|${t.v}: ${t.odchylenie.toFixed(1)} cm, ${t.zawrocenia} zawr.`);
    expect(zle).toEqual([]);
  });
  test('lista wyjątków tylko maleje: każdy wyjątek nadal przekracza próg, ma powód i istnieje', () => {
    const keys = new Set(CASES.map(([k, v]) => `${k}|${v}`));
    for (const [id, powod] of Object.entries(WYJATKI)) {
      expect([id, keys.has(id)]).toEqual([id, true]); expect(powod.length).toBeGreaterThan(20);
      const [k, v] = id.split('|') as [string, View]; expect([id, ok(tor(k, v), k)]).toEqual([id, false]);
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
    expect(n).toBeGreaterThanOrEqual(6); /* było 7: Band Bench Press (101-05, 29.10.2026) nie ma już gumy sztangi — guma przy uchwytach, pętla pod ławką stoi w miejscu (tests/figury-pakiet-b.test.ts) */
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

describe('101-12 (29.10.2026, hinge): wyjątki toru po krzywej kolan (`knees` w rigu hinge)', () => {
  test('hantle w RDL i na jednej nodze prowadzone tuż przy udach: wyjątki usunięte; zostaje tylko Cable Pull Through (łuk zamierzony, z powodem)', () => {
    const hinge = new Set(CASES.filter(([k]) => assignAll()[k] === 'hinge').map(([k, v]) => `${k}|${v}`));
    const wyjatkiHinge = Object.keys(WYJATKI).filter(id => hinge.has(id));
    expect(wyjatkiHinge).toEqual(['Cable Pull Through|side']);
    for (const k of ['RDL (hantle/linki)', 'Single Leg RDL (hantel)']) { expect([k, WYJATKI[`${k}|side`]]).toEqual([k, undefined]); expect([k, ok(tor(k, 'side'))]).toEqual([k, true]); }
  });
  test('gryf z krzywą kolan: tor schodzi najwyżej HINGE.dev (3,5 cm) pod prostą między końcami — poniżej progu strażnika (4 cm)', () => {
    expect(HINGE.dev).toBeLessThan(PROG.odchylenie);
    for (const k of ['Deadlift (sztanga)', 'Snatch Deadlift', 'Sumo Deadlift', 'RDL (sztanga)']) expect([k, tor(k, 'side').odchylenie <= HINGE.dev + 0.01, tor(k, 'side').zawrocenia <= PROG.zawrocenia]).toEqual([k, true, true]);
  });
});

describe('C1 (recenzja niezależna 03.11.2026): ślad ciężaru w dłoni leży przy chwycie, nie w osi ciała (rodziny z danych póz)', () => {
  /* ćwiczenia z danych póz z ciężarem w dłoni bez sztangi (hantel, wyciąg, dźwignia): ślad ≤ MAX_OD_CHWYTU cm od chwytu R/L albo — przy jednym uchwycie/linie/dźwigni — od środka między chwytami */
  const MAX_OD_CHWYTU = 3;
  const dir = path.join(__dirname, '../lib/figures/v2/poses');
  const DATA: [string, PoseData][] = fs.readdirSync(dir).filter(f => f.endsWith('.json')).flatMap(f => Object.entries(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).cwiczenia as Record<string, PoseData>).map(([k, d]) => [`${f.replace('.json', '')}|${k}`, d] as [string, PoseData]));
  const nosi = (d: PoseData) => d.sprzet.find(g => g.rodzaj === 'hantel' || g.rodzaj === 'wyciag' || g.rodzaj === 'dzwignia') as (PoseData['sprzet'][number] & { pionowo?: boolean; dwa?: boolean; trzyma?: string }) | undefined;
  const dwa = (g: NonNullable<ReturnType<typeof nosi>>) => !g.trzyma && ((g.rodzaj === 'hantel' && !g.pionowo) || (g.rodzaj === 'wyciag' && g.dwa === true));
  const dist3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  /** Odległość śladu od najbliższego dopuszczalnego punktu: chwyt R/L; środek między chwytami tylko dla jednego uchwytu (nie dla dwóch osobnych ciężarów). */
  const odChwytu = (tr: number[], R: number[], L: number[], dwaCiezary: boolean) => Math.min(dist3(tr, R), dist3(tr, L), dwaCiezary ? Infinity : dist3(tr, [0, 1, 2].map(i => (R[i] + L[i]) / 2)));
  const ZESTAW = DATA.filter(([, d]) => { const g = nosi(d); return !!g && !d.sprzet.some(x => x.rodzaj === 'sztanga'); });

  test('zestaw jest niepusty i obejmuje curl: ćwiczenia z dwoma ciężarami i z jednym uchwytem', () => {
    expect(ZESTAW.length).toBeGreaterThanOrEqual(30);
    expect(ZESTAW.filter(([k, d]) => k.startsWith('curl|') && dwa(nosi(d)!)).length).toBeGreaterThanOrEqual(10);
    expect(ZESTAW.filter(([k, d]) => k.startsWith('curl|') && !dwa(nosi(d)!)).length).toBeGreaterThanOrEqual(5);
  });
  test.each(ZESTAW.map(([k]) => k))('%s: ślad w każdej klatce ≤ 3 cm od chwytu (u = 0…1)', key => {
    const d = ZESTAW.find(([k]) => k === key)![1]; const dw = dwa(nosi(d)!);
    for (let i = 0; i <= 12; i++) { const f = keyframeFrame(d, i / 12); if (!f.info.trail) continue; /* drążek nieruchomy: ślad = miednica, inna zasada */
      const o = odChwytu(f.info.trail, f.sk.arms.R.grip, f.sk.arms.L.grip, dw); expect([key, i, o <= MAX_OD_CHWYTU]).toEqual([key, i, true]); }
  });
  test('warunek potrafi paść (przypadek negatywny): ślad w osi ciała przy parze hantli (stara reguła W1) ma ok. połowę rozstawu od chwytu', () => {
    const d = DATA.find(([k]) => k === 'curl|Hammer Curl')![1]; const f = keyframeFrame(d, 0.5);
    const srodek = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2);
    expect(odChwytu(srodek, f.sk.arms.R.grip, f.sk.arms.L.grip, true)).toBeGreaterThan(MAX_OD_CHWYTU * 3);
    expect(odChwytu(srodek, f.sk.arms.R.grip, f.sk.arms.L.grip, false)).toBeLessThan(1e-6); /* a dla jednego uchwytu środek jest poprawny */
    expect(odChwytu(f.info.trail!, f.sk.arms.R.grip, f.sk.arms.L.grip, true)).toBeLessThanOrEqual(MAX_OD_CHWYTU);
  });
});
