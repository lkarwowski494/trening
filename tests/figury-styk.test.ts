/*
 * A1 (zadanie 1.0.1 pakiet A, 29.10.2026; L-056 A, decyzja właściciela): miara styku ciężar–ciało (odstęp i przenikanie) na kadrach co 0,05 oraz pomocnik „dwie miary”
 * (tests/helpers/styk-figur.ts) — dla rodzin squat, bench_press i hinge.
 * 101-02, 101-03, 101-04, 101-12 (hinge): kolano jako osobna krzywa (`knees` w rigu hinge), strażnik odstępu ciężar–noga obok strażnika toru; w teście każdej poprawki dwie miary
 * (naprawiana cecha + styk). Stan „przed” odtwarza ten sam rig bez krzywej kolan (wariant z `knees: undefined`) — strażnik musi na nim paść.
 */
import { figureSpec, frameAt, hingeFrame, proj, EQUIP, VARIANTS, V2_WSTRZYMANE, HINGE, type HingeParams } from '@/lib/figures/v2';
import { KADRY_STYKU, PROG_STYKU, stykKlatki, stykTora, podsumujStyk, dwieMiary, elementyCiezaru } from './helpers/styk-figur';

describe('A1: kadry i miara potrafi paść', () => {
  test('kadry co 0,05: 21 wartości od 0 do 1', () => {
    expect(KADRY_STYKU).toHaveLength(21); expect(KADRY_STYKU[0]).toBe(0); expect(KADRY_STYKU[1]).toBe(0.05); expect(KADRY_STYKU[20]).toBe(1);
  });
  test('gryf odsunięty od nóg o X cm zwiększa odstęp o X, a wsunięty w nogę daje przenikanie równe wsunięciu', () => {
    const f = frameAt(figureSpec('Deadlift (sztanga)')!, 0); const s0 = stykKlatki(f);
    expect(s0.przenikanie).toBe(0); expect(s0.odstep).toBeGreaterThan(0); expect(s0.czesc).toMatch(/podudzie/);
    const przesun = (dx: number) => ({ ...f, props: f.props.map(p => p.k === 'barbell' ? { ...p, c: [p.c[0] + dx, p.c[1], p.c[2]] as [number, number, number] } : p) });
    expect(stykKlatki(przesun(10)).odstep - s0.odstep).toBeCloseTo(10, 0);
    const wsuniety = stykKlatki(przesun(-(s0.odstep + 3)));
    expect(wsuniety.przenikanie).toBeCloseTo(3, 0); expect(wsuniety.odstep).toBeLessThan(0);
  });
  test('elementy ciężaru: gryf = 1 kapsuła o promieniu gryfu, hantle = 2, kettlebell = 1, linka (uchwyt) = odcinek między dłońmi, promień 2 cm', () => {
    const el = (k: string) => elementyCiezaru(frameAt(figureSpec(k)!, 0.5));
    expect(el('Deadlift (sztanga)')).toHaveLength(1); expect(el('Deadlift (sztanga)')[0].r).toBe(EQUIP.barR);
    expect(el('Deadlift (hantle)')).toHaveLength(2); expect(el('Sumo Deadlift (kettlebell)')).toHaveLength(1);
    expect(el('Single Leg RDL (linki)')).toEqual([{ a: expect.any(Array), b: expect.any(Array), r: expect.any(Number) }]);
  });
});

describe('A1: pomocnik działa dla wszystkich trzech gotowych rodzin (squat, bench_press, hinge), bez zależności od rigu hinge', () => {
  test.each([['Back Squat', 'squat'], ['Bench Press (sztanga)', 'bench_press'], ['Deadlift (sztanga)', 'hinge']])('%s (%s): 21 kadrów, skończone liczby, przenikanie ≤ 0,5 cm', k => {
    const s = stykTora(k); expect(s).toHaveLength(21);
    for (const x of s) expect([k, x.u, Number.isFinite(x.odstep)]).toEqual([k, x.u, true]);
    expect(podsumujStyk(s).maxPrzenikanie).toBeLessThanOrEqual(0.5);
  });
  test('dwieMiary: zwraca naprawianą cechę i styk razem (cecha = wysokość gryfu na końcu)', () => {
    const m = dwieMiary('Back Squat', (k, kadry) => frameAt(figureSpec(k)!, kadry[kadry.length - 1]).info.load[1]);
    expect(m.cecha).toBeGreaterThan(0); expect(m.styk.maxOdstep).toBeGreaterThanOrEqual(m.styk.minOdstep); expect(m.styk.maxPrzenikanie).toBeGreaterThanOrEqual(0);
  });
});


/** Odchylenie łamanej od prostej między końcami (cm) i liczba zmian kierunku w poziomie — jak `ksztaltToru` w tests/figures-v2-tor.test.ts (ruchy < 0,05 cm pomijane). */
function ksztaltToru(pts: [number, number][]): { odchylenie: number; zawrocenia: number } {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odchylenie = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L));
  let zawrocenia = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) zawrocenia++; sg = s; }
  return { odchylenie, zawrocenia };
}
const torKlucza = (k: string) => ksztaltToru(Array.from({ length: 25 }, (_, i) => proj(frameAt(figureSpec(k)!, i / 24).info.load, 'side') as [number, number]));
const odchylenieToru = (k: string): number => torKlucza(k).odchylenie;
const hingeP = (k: string): HingeParams => { const v = VARIANTS[k]; if (v.family !== 'hinge') throw new Error(k); return v.p; };
/** Ten sam wariant w stanie sprzed 101-02/03: bez krzywej kolan (kolano ze zgięcia, tor z obwiedni wypukłej), kierunek kolana 2 × rotacja stóp, bark −9 cm za gryfem na wyproście jak dawniej. */
const staryStan = (k: string, sx: [number, number]): HingeParams => ({ ...hingeP(k), knees: undefined, kneeOut: undefined, sx });
const maxOdstepPrzed = (p: HingeParams): number => Math.max(...KADRY_STYKU.map(u => stykKlatki(hingeFrame(p, u), u).odstep));
const kat = (a: readonly number[], b: readonly number[]): number => Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI;

/** Pomiar na commicie A1 (0ab5a7db), rig bez krzywej kolan: największy odstęp ciężaru od nóg/tułowia (cm), powierzchnia jak na rysunku; kadry co 0,05. */
const PRZED: Record<string, number> = {
  'Deadlift (sztanga)': 7.2, 'Axle Deadlift': 7.2, 'Deadlift with Bands': 7.2, 'Deadlift with Chains': 7.2, 'Deficit Deadlift': 7.6, 'Rack Pull': 6.9, 'Rack Pull with Bands': 6.9,
  'Reverse Band Deadlift': 7.2, 'Cable Deadlift': 7.4, 'Clean Deadlift': 7.2, 'Snatch Deadlift': 9.2,
  'Sumo Deadlift': 7.0, 'Sumo Deadlift with Bands': 7.0, 'Sumo Deadlift with Chains': 7.0, 'Reverse Band Sumo Deadlift': 7.0,
  'Stiff-Legged Barbell Deadlift': 5.5, 'RDL (sztanga)': 4.1, 'Single Leg RDL (linki)': 4.0,
};
const DL_ODSTEP_KLUCZE = ['Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull', 'Rack Pull with Bands',
  'Reverse Band Deadlift', 'Cable Deadlift', 'Clean Deadlift', 'Snatch Deadlift'];
const SUMO_KLUCZE = ['Sumo Deadlift', 'Sumo Deadlift with Bands', 'Sumo Deadlift with Chains', 'Reverse Band Sumo Deadlift'];
const RDL_KLUCZE = ['Stiff-Legged Barbell Deadlift', 'RDL (sztanga)', 'Single Leg RDL (linki)'];

describe('101-02 (L-056): martwe ciągi z podłogi — strażnik odstępu ciężar–noga obok strażnika toru, kadry co 0,05', () => {
  test('próg: odstęp ≤ 3,5 cm i przenikanie ≤ 0,3 cm (komentarz przy PROG_STYKU: wskazówka dl.close „blisko nóg”, średnica gryfu 3,2 cm)', () => {
    expect(PROG_STYKU).toEqual({ odstepCm: 3.5, przenikanieCm: 0.3 });
    expect(EQUIP.barR * 2).toBeCloseTo(3.2, 5);
  });
  test('strażnik potrafi paść: ten sam wariant bez krzywej kolan (stan sprzed 101-02) przekracza próg w każdym z 11 ćwiczeń (7–9 cm) — czerwony przed, zielony po', () => {
    for (const k of DL_ODSTEP_KLUCZE) { const przed = maxOdstepPrzed(staryStan(k, [3, -9])); expect([k, przed > PROG_STYKU.odstepCm + 3]).toEqual([k, true]); expect([k, +przed.toFixed(1)]).toEqual([k, PRZED[k]]); }
  });
  test.each(DL_ODSTEP_KLUCZE)('%s: dwie miary — tor (≤ 1 zmiana kierunku, ≤ 4 cm od prostej) i styk (odstęp ≤ 3,5 cm, przenikanie ≤ 0,3 cm), 21 kadrów co 0,05', k => {
    const m = dwieMiary(k, odchylenieToru);
    expect([k, m.cecha <= 4]).toEqual([k, true]); expect([k, torKlucza(k).zawrocenia <= 1]).toEqual([k, true]);
    expect([k, m.styk.maxOdstep <= PROG_STYKU.odstepCm, +m.styk.maxOdstep.toFixed(1)]).toEqual([k, true, +m.styk.maxOdstep.toFixed(1)]);
    expect([k, m.styk.maxPrzenikanie <= PROG_STYKU.przenikanieCm]).toEqual([k, true]);
    expect([k, m.styk.maxOdstep < PRZED[k] - 3]).toEqual([k, true]); /* poprawa o ponad 3 cm względem stanu sprzed */
  });
  test('Deadlift (sztanga): liczby po zmianie — największy odstęp 2,8 cm przy u = 0,70 (było 7,2 cm przy u = 0,75), tor 3,5 cm od prostej, 1 zmiana kierunku', () => {
    const p = podsumujStyk(stykTora('Deadlift (sztanga)')); expect([+p.maxOdstep.toFixed(1), p.uMaxOdstep]).toEqual([2.8, 0.7]);
    const t = torKlucza('Deadlift (sztanga)'); expect(+t.odchylenie.toFixed(1)).toBe(3.5); expect(t.zawrocenia).toBe(1);
  });
  test('kolano jako osobna krzywa (nie z położenia gryfu — L-056 pkt 3): pochylenie podudzia ≈ 8,5° (σ 10° w rigu) na starcie, 0° na wyproście, nie rośnie; błąd „gryf odjeżdża” zmienia gryf, nie kolano', () => {
    const sp = figureSpec('Deadlift (sztanga)')!; expect(hingeP('Deadlift (sztanga)').knees?.s).toEqual([10, 0]);
    const shin = (u: number, err?: 'barAway') => { const L = frameAt(sp, u, err).sk.legs.R; return kat(L.ankle, L.knee); };
    expect(shin(0)).toBeGreaterThan(7); expect(shin(0)).toBeLessThan(10); expect(Math.abs(shin(1))).toBeLessThan(1); /* rzut kolana z IK 3D: 8,5° przy σ = 10° w rigu */
    for (let i = 1; i <= 20; i++) expect(shin(i / 20)).toBeLessThanOrEqual(shin((i - 1) / 20) + 0.5);
    for (const u of [0.25, 0.5, 0.75]) { expect(frameAt(sp, u, 'barAway').info.load[0] - frameAt(sp, u).info.load[0]).toBeGreaterThan(5); expect(Math.abs(shin(u, 'barAway') - shin(u))).toBeLessThan(1); } /* gryf +12 cm, podudzie najwyżej o ułamek stopnia (IK 3D) */
  });
  test('rack pull startuje z bolców na wysokości kolan: kolano proste od początku (σ 3° → 0°), tor nadal z jedną zmianą kierunku', () => {
    for (const k of ['Rack Pull', 'Rack Pull with Bands']) { expect(hingeP(k).knees?.s).toEqual([3, 0]); expect(torKlucza(k).zawrocenia).toBeLessThanOrEqual(1); }
  });
  test('zasada koordynatora: wpisy zostają w V2_WSTRZYMANE do zdjęcia przez koordynatora (zgłoszenie „do zdjęcia”: 11 martwych ciągów z DL_ODSTEP)', () => {
    for (const k of DL_ODSTEP_KLUCZE) expect([k, k in V2_WSTRZYMANE]).toEqual([k, true]);
  });
});

describe('101-03 (L-056): ten sam pomiar — sumo ×4, martwy na prostych nogach, RDL sztanga, jedna noga z linką; stałe wyjątki z powodem', () => {
  test.each([...SUMO_KLUCZE, ...RDL_KLUCZE])('%s: dwie miary — tor (≤ 1 zmiana kierunku, ≤ 4 cm) i styk (odstęp ≤ 3,5 cm, przenikanie ≤ 0,3 cm); lepiej niż przed', k => {
    const m = dwieMiary(k, odchylenieToru);
    expect([k, m.cecha <= 4, torKlucza(k).zawrocenia <= 1]).toEqual([k, true, true]);
    expect([k, m.styk.maxOdstep <= PROG_STYKU.odstepCm, m.styk.maxPrzenikanie <= PROG_STYKU.przenikanieCm]).toEqual([k, true, true]);
    expect([k, m.styk.maxOdstep < PRZED[k]]).toEqual([k, true]);
  });
  test('liczby po zmianie (cm): sumo ×4 2,7 (było 7,0); SLDL 3,0 (5,5); RDL sztanga 1,6 (4,1); jedna noga z linką 1,5 (4,0)', () => {
    const po = (k: string) => +podsumujStyk(stykTora(k)).maxOdstep.toFixed(1);
    for (const k of SUMO_KLUCZE) expect([k, po(k)]).toEqual([k, 2.7]);
    expect(po('Stiff-Legged Barbell Deadlift')).toBe(3.0); expect(po('RDL (sztanga)')).toBe(1.6); expect(po('Single Leg RDL (linki)')).toBe(1.5);
  });
  test('sumo: kolana idą nad palcami (kierunek kolana = rotacja stóp 40°, było 2 × = 80°, czyli w bok), stopy bez zmian', () => {
    for (const k of SUMO_KLUCZE) { const p = hingeP(k); expect([k, p.kneeOut, p.toeOut, p.stance]).toEqual([k, 40, 40, 34]); }
  });
  /* Stałe wyjątki (powód w teście; muszą nadal przekraczać próg — inaczej wyjątek jest zbędny). */
  const WYJATKI: Record<string, string> = {
    'Smith Machine Stiff-Legged Deadlift': 'maszyna Smitha: szyna stoi w miejscu i prowadzi gryf po pionie (tests/figures-v2-tor.test.ts), więc gryf nie podąża za cofającym się udem — odstęp wynika z konstrukcji maszyny, nie z ruchu kolan',
    'Sumo Deadlift (kettlebell)': 'kettlebell wisi między nogami (stopy ±34 cm), a nie przed udami — odstęp od uda mierzony w poprzek ruchu, nie „blisko nóg” w sensie wskazówki dl.close',
  };
  test('wyjątki: Smith SL i Sumo z kettlebellem nadal przekraczają próg (6,2 i 23,7 cm), mają powód i istnieją w katalogu', () => {
    for (const [k, powod] of Object.entries(WYJATKI)) { expect([k, powod.length > 40]).toEqual([k, true]); expect([k, VARIANTS[k]?.family]).toEqual([k, 'hinge']); expect([k, podsumujStyk(stykTora(k)).maxOdstep > PROG_STYKU.odstepCm]).toEqual([k, true]); }
    expect(+podsumujStyk(stykTora('Smith Machine Stiff-Legged Deadlift')).maxOdstep.toFixed(1)).toBe(6.2); expect(+podsumujStyk(stykTora('Sumo Deadlift (kettlebell)')).maxOdstep.toFixed(1)).toBe(23.7);
  });
  test('ciężar obok nóg (hantle, drążek sześciokątny, gryf z boku) nie podlega progowi „przed udami” — odstęp boczny z konstrukcji (5–8 cm), bez przenikania', () => {
    for (const k of ['Deadlift (hantle)', 'Trap Bar Deadlift', 'Leverage Deadlift', 'Rickshaw Deadlift', 'One-Arm Side Deadlift']) expect([k, podsumujStyk(stykTora(k)).maxPrzenikanie <= PROG_STYKU.przenikanieCm]).toEqual([k, true]);
  });
});

describe('101-04: sumo — tor ukośny (D2 = A: zostaje, ponowny pomiar z nowym ruchem kolan); RDL — ramiona pionowo (D3 = B: pomiar niewykonalności)', () => {
  test('D2: przesunięcie gryfu w poziomie od startu do wyprostu — było 8,0 cm (4,5 → 12,5) w sumo ×4, jest 2,4 cm (7,0 → 9,0); sumo z kettlebellem bez zmian 6,1 cm', () => {
    const dx = (k: string) => frameAt(figureSpec(k)!, 1).info.load[0] - frameAt(figureSpec(k)!, 0).info.load[0];
    for (const k of SUMO_KLUCZE) { expect(+dx(k).toFixed(1)).toBe(2.4); const st = staryStan(k, [3, -9]); expect(+(hingeFrame(st, 1).info.load[0] - hingeFrame(st, 0).info.load[0]).toFixed(1)).toBeGreaterThanOrEqual(6); }
    expect(+dx('Sumo Deadlift (kettlebell)').toFixed(1)).toBe(6.1);
  });
  test('D3: RDL (sztanga) na dole — ramię 23° od pionu przy kolanie 17° i tułowiu 60° (progi figury-1-0-recenzja: kolano ≤ 27°, tułów 50–80°)', () => {
    const f = frameAt(figureSpec('RDL (sztanga)')!, 1); const A = f.sk.arms.R;
    expect(Math.round(Math.abs(Math.atan2(A.grip[0] - A.shoulder[0], A.shoulder[1] - A.grip[1]) * 180 / Math.PI))).toBe(23);
    expect(Math.round(f.pose!.trunkPitch)).toBe(60);
  });
  test('D3: ramiona pionowo pod barkami (sx 0 na dole) przy gryfie na wysokości z 1.0 wymuszają kolano ≈ 43° i tułów ≈ 40° — poza progami (kolano ≤ 27°, tułów ≥ 50°); wdrożenie wymaga nowej decyzji', () => {
    const p: HingeParams = { ...hingeP('RDL (sztanga)'), sx: [-2, 0] }; const f = hingeFrame(p, 1); const L = f.sk.legs.R;
    const a = [L.hip[0] - L.knee[0], L.hip[1] - L.knee[1], L.hip[2] - L.knee[2]], b = [L.ankle[0] - L.knee[0], L.ankle[1] - L.knee[1], L.ankle[2] - L.knee[2]];
    const kolano = 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI;
    expect(Math.round(kolano)).toBeGreaterThan(27); expect(Math.round(f.pose!.trunkPitch)).toBeLessThan(50);
    expect(HINGE.rdlSxEnd).toBe(25);
  });
});

describe('101-12 (hinge): wyjątki toru po zmianie — hantle w RDL i na jednej nodze prowadzone tuż przy udach (wyjątek zbędny), Cable Pull Through zostaje (łuk zamierzony)', () => {
  test('RDL (hantle/linki) i Single Leg RDL (hantel): tor ≤ 4 cm i 1 zmiana kierunku, bez przenikania uda (było 1,9 cm), odstęp ≤ 3,5 cm; dwie miary', () => {
    for (const k of ['RDL (hantle/linki)', 'Single Leg RDL (hantel)']) {
      const m = dwieMiary(k, odchylenieToru); expect([k, m.cecha <= 4, torKlucza(k).zawrocenia <= 1]).toEqual([k, true, true]);
      expect([k, m.styk.maxPrzenikanie <= PROG_STYKU.przenikanieCm, m.styk.maxOdstep <= PROG_STYKU.odstepCm]).toEqual([k, true, true]);
      const przed = podsumujStyk(Array.from(KADRY_STYKU, u => stykKlatki(hingeFrame({ ...hingeP(k), knees: undefined }, u), u))); expect([k, przed.maxPrzenikanie > 1.5]).toEqual([k, true]);
    }
  });
});
