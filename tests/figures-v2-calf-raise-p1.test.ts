/*
 * Rodzina v2 calf_raise (wspięcia na palce), partia 1 linii 1.1, 09.11.2026 — podłączenie, DATA_UI, nakładka, zakres stawów z tekstu karty i tor ciężaru.
 * Progi z karty i geometrii, nie z bieżących danych (K5): zakres kostki z reguł `wspiecie` (zgięcie podeszwowe ≥ 15° na górze, data/zrodla/figury-sens.json),
 * kolana stojąc ≤ 20° (`kolana_proste`), w siadzie ≥ 60° (`kolana_zgiete_siad`); ślad ciężaru ≤ 3 cm od chwytu (wzór tests/figures-v2-tor.test.ts).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza dobór elementów i rysunek, nie recenzję rodziny */
import { FAMILIES, assignAll, figureSpec, frameAt, keyframeFrame, jointAngles, poseKeys, hasPoseFile, overlayShapes, measuredJoint, angleLineShown, phaseNames, phasesFor } from '@/lib/figures/v2';
import { DATA_UI, MIN_MEASURED_ROM } from '@/lib/figures/v2/poseData';
import { poseFile } from '@/lib/figures/v2/poseData';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { V2_WSTRZYMANE, shownFigureSpec } from '@/lib/figures/v2/figure';
import { stykTora, PROG_STYKU } from './helpers/styk-figur';
import { CALF_RAISE_TECHNIQUE } from '@/lib/figures/v2/overlay/calf_raise';

const FAM = 'calf_raise';
const KEYS = poseKeys(FAM);
const SIEDZACE = ['Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Barbell Seated Calf Raise', 'Dumbbell Seated One-Leg Calf Raise'];
const JEDNONOZ = ['Single Leg Calf Raise', 'Dumbbell Seated One-Leg Calf Raise'];
const data = (k: string) => poseFile(FAM)!.cwiczenia[k];
const us = Array.from({ length: 21 }, (_, i) => i / 20);
const ang = (k: string, u: number, s: 'R' | 'L', err?: number) => jointAngles(keyframeFrame(data(k), u, err).sk, s);
const range = (a: number[]) => Math.max(...a) - Math.min(...a);

describe('calf_raise p1: podłączenie (09.11.2026)', () => {
  test('rodzina ready, ma plik póz, 12 ćwiczeń — wszystkie z figurą v2 z danych i przypisane do rodziny', () => {
    expect(FAMILIES.find(f => f.id === FAM)!.status).toBe('ready'); expect(hasPoseFile(FAM)).toBe(true);
    expect(KEYS.length).toBe(12);
    const all = assignAll(); for (const k of KEYS) { expect([k, all[k]]).toEqual([k, FAM]); const s = figureSpec(k); expect([k, !!s, s && 'data' in s.variant]).toEqual([k, true, true]); }
  });
  test('DATA_UI: Unoszenie/Opuszczanie (u 0 = pięty na dole), linia „Kąt na rysunku” ukryta w każdym ćwiczeniu (kostka nie jest mierzonym stawem, kolano < 15°)', () => {
    expect(DATA_UI[FAM].names).toEqual({ first: 'Unoszenie', second: 'Opuszczanie' }); expect(DATA_UI[FAM].lowerFirst).toBe(false);
    for (const k of KEYS) { const s = figureSpec(k)!; expect([k, phaseNames(s)]).toEqual([k, { first: 'Unoszenie', second: 'Opuszczanie' }]); expect([k, angleLineShown(s)]).toEqual([k, false]); expect([k, phasesFor(s)[0].name]).toEqual([k, 'Unoszenie']); void measuredJoint(s); }
    for (const k of KEYS) for (const s of ['R', 'L'] as const) expect([k, s, range(us.map(u => ang(k, u, s).knee)) <= MIN_MEASURED_ROM.deg]).toEqual([k, s, true]);
  });
});

describe('calf_raise p1: zakres stawów z tekstu karty', () => {
  test('wspięcie: na górze zgięcie podeszwowe ≥ 15° (reguła wspiecie), na dole pięta niżej niż na górze o ≥ 30°; jednonóż — noga pracująca', () => {
    for (const k of KEYS) { const s = JEDNONOZ.includes(k) ? ['R' as const] : ['R' as const, 'L' as const];
      for (const x of s) { const top = ang(k, 1, x).ankle, bot = ang(k, 0, x).ankle; expect([k, x, top <= -15]).toEqual([k, x, true]); expect([k, x, bot - top >= 30]).toEqual([k, x, true]); expect([k, x, bot >= 0]).toEqual([k, x, true]); } }
  });
  test('stojąc kolana ≤ 20° (kolana_proste; w jednonogu noga podporowa), w siadzie ≥ 60° (kolana_zgiete_siad) w każdej klatce', () => {
    for (const k of KEYS) for (const u of us) {
      const kn = ang(k, u, 'R').knee; expect([k, u, SIEDZACE.includes(k) ? kn >= 60 : kn <= 20]).toEqual([k, u, true]);
      if (!JEDNONOZ.includes(k)) expect([k, u, SIEDZACE.includes(k) ? ang(k, u, 'L').knee >= 60 : ang(k, u, 'L').knee <= 20]).toEqual([k, u, true]);
    }
  });
  test('błąd „skrócony zakres” (calf.mis.partial) łamie regułę: na górze zgięcie podeszwowe > −15° (dane poprawne ją spełniają — przypadek negatywny)', () => {
    const z = KEYS.filter(k => data(k).bledy.some(b => b.cue === 'calf.mis.partial')); expect(z.length).toBe(10); /* wszystkie poza „Łydki na stopniu” i „Seated Calf Raise” (bez tekstu błędu na karcie) */
    for (const k of z) { const i = data(k).bledy.findIndex(b => b.cue === 'calf.mis.partial'); expect([k, ang(k, 1, 'R', i).ankle > -15, ang(k, 1, 'R').ankle <= -15]).toEqual([k, true, true]); }
  });
});

/* Ślad dźwigni poza dłońmi (Donkey Calf Raise: miednica) jest zły (contract.ts:330–332 bierze dłoń z `trzyma`) — test toru dla niego czeka na figury/slad-dzwignia (decyzja koordynatora 09.11.2026); nie zatwierdzamy złego śladu.
   Standing Calf Raise i Seated Calf Raise są wstrzymane w V2_WSTRZYMANE (recenzja r1 W1/W2, decyzja koordynatora A 09.11.2026) i nie biorą udziału w testach toru i styku (poza przypadkiem negatywnym styku). */
export const CZEKA_NA_SLAD_DZWIGNI = ['Donkey Calf Raise'];
export const WSTRZYMANE = ['Standing Calf Raise', 'Seated Calf Raise'];
const ZRYSUNKIEM = KEYS.filter(k => !WSTRZYMANE.includes(k));
/** Odległość śladu od najbliższego chwytu albo środka między chwytami (cm). */
const odlSladu = (f: ReturnType<typeof frameAt>, t: number[]): number => {
  const d = (g: number[]) => Math.hypot(t[0] - g[0], t[1] - g[1], t[2] - g[2]); const R = f.sk.arms.R.grip, L = f.sk.arms.L.grip;
  return Math.min(d(R), d(L), d([0, 1, 2].map(i => (R[i] + L[i]) / 2)));
};

describe('calf_raise p1: wstrzymanie maszyn (09.11.2026)', () => {
  test('Standing Calf Raise i Seated Calf Raise: poza aplikacją (V2_WSTRZYMANE z powodem), pozy zostają w silniku; 10 z 12 ćwiczeń z rysunkiem; wstrzymane nie są pokazywane', () => {
    for (const k of WSTRZYMANE) { expect([k, k in V2_WSTRZYMANE, V2_WSTRZYMANE[k].length > 30, figureSpec(k) !== null, shownFigureSpec(k)]).toEqual([k, true, true, true, null]); }
    expect(ZRYSUNKIEM.length).toBe(10); for (const k of ZRYSUNKIEM) expect([k, k in V2_WSTRZYMANE]).toEqual([k, false]);
  });
});

describe('calf_raise p1: tor ciężaru', () => {
  test('lista ćwiczeń z torem czekającym na poprawkę silnika to dokładnie ćwiczenie z dźwignią poza dłońmi spoza wstrzymanych', () => {
    const z = ZRYSUNKIEM.filter(k => data(k).sprzet.some(g => g.rodzaj === 'dzwignia' && g.punkt !== 'dlonie')).sort(); expect(z).toEqual([...CZEKA_NA_SLAD_DZWIGNI].sort());
  });
  test('ćwiczenia z ciężarem w rękach (sztanga, Smith, linki, guma, hantle, sztanga siedząc): ślad ≤ 3 cm od chwytu w każdej klatce; stojąc ślad rośnie razem z wspięciem', () => {
    for (const k of ['Calf Raise (sztanga)', 'Smith Machine Calf Raise', 'Calf Raise (linki)', 'Band Calf Raise', 'Barbell Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Dumbbell Seated One-Leg Calf Raise']) {
      const s = figureSpec(k)!; let prevY = -1e9;
      for (const u of us) { const f = frameAt(s, u); const t = (f.info.trail ?? f.info.load)!; expect([k, u, !!t]).toEqual([k, u, true]);
        expect([k, u, odlSladu(f, t) <= 3]).toEqual([k, u, true]); if (!k.includes('Seated')) { expect([k, u, t[1] >= prevY - 1e-6]).toEqual([k, u, true]); prevY = t[1]; } }
    }
  });
  test('przypadek negatywny miary (na danych): ślad z klatki sztangi przesunięty o 5 cm w poziomie od chwytu przekracza 3 cm, a ślad z danych mieści się', () => {
    const f = frameAt(figureSpec('Calf Raise (sztanga)')!, 0.5); const t = (f.info.trail ?? f.info.load)!;
    expect(odlSladu(f, t)).toBeLessThanOrEqual(3); expect(odlSladu(f, [t[0] + 5, t[1], t[2]])).toBeGreaterThan(3);
  });
  test('Łydki na stopniu i Single Leg Calf Raise bez ciężaru: ślad = miednica (nie chwyt), poza testem toru ciężaru; Donkey czeka na figury/slad-dzwignia', () => {
    for (const k of ['Łydki na stopniu', 'Single Leg Calf Raise']) { const f = frameAt(figureSpec(k)!, 0.5); expect([k, f.info.trail]).toEqual([k, f.sk.pelvis]); }
  });
});

describe('calf_raise p1: odstęp ciężaru od nóg (K7)', () => {
  const ZCIEZAREM = ['Calf Raise (sztanga)', 'Smith Machine Calf Raise', 'Calf Raise (linki)', 'Barbell Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Dumbbell Seated One-Leg Calf Raise'];
  /* Band (uchwyt między dłońmi przechodzi przez tułów — miara odcinka nie dotyczy), Łydki na stopniu i Single Leg (brak ciężaru), Donkey (ciężar na miednicy — poprawka silnika) pominięte. */
  test('wnikanie ciężaru w nogi i tułów ≤ 1 cm w każdej klatce co 0,05 (K7)', () => {
    for (const k of ZCIEZAREM) { const m = Math.max(...stykTora(k).map(x => x.przenikanie)); expect([k, m <= 1]).toEqual([k, true]); }
    expect(PROG_STYKU.przenikanieCm).toBeLessThan(1);
  });
  test('przypadek negatywny: Seated Calf Raise (maszyna, pręt przy kostkach, wstrzymana) przenika stopy o > 5 cm — miara potrafi paść', () => {
    expect(Math.max(...stykTora('Seated Calf Raise').map(x => x.przenikanie))).toBeGreaterThan(5);
  });
});

describe('calf_raise p1: nakładka techniki', () => {
  test('rejestr: jeden element (ref segment biodro → kolano, reguła kolana_proste, cue calf.knees); element dostają 4 pokazywane ćwiczenia, których karta ma calf.knees i reguła „ustalone” kolana_proste (Standing Calf Raise ma je na karcie, ale jest wstrzymane)', () => {
    expect(Object.prototype.hasOwnProperty.call(TECHNIQUE, FAM)).toBe(true); expect(TECHNIQUE[FAM]).toBe(CALF_RAISE_TECHNIQUE);
    expect(CALF_RAISE_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.cue, d.views])).toEqual([['calfKneeStraightRef', 'ref', 'kolana_proste', ['calf.knees'], ['side']]]);
    for (const d of CALF_RAISE_TECHNIQUE) expect(['limb', 'abduction', 'ref']).toContain(d.kind);
    expect(KEYS.filter(k => techniquesOf(k).includes('calfKneeStraightRef')).sort()).toEqual(['Calf Raise (linki)', 'Calf Raise (sztanga)', 'Smith Machine Calf Raise', 'Łydki na stopniu'].sort());
    const z = (k: string) => techniquesFor(FAM, ['calf.knees', 'calf.move'], k).map(d => d.id); /* z wymuszonym cue: reguły wykluczają jednonóż i siad */
    for (const k of [...JEDNONOZ, ...SIEDZACE]) expect([k, z(k)]).toEqual([k, []]);
  });
  test('element rysuje się w rzucie z boku w ćwiczeniach stojących; kolano ≤ 20° w każdej klatce (przypadek negatywny: siad 90° nie)', () => {
    for (const k of ['Łydki na stopniu', 'Smith Machine Calf Raise', 'Calf Raise (sztanga)', 'Calf Raise (linki)']) { const s = figureSpec(k)!;
      for (const u of [0, 0.5, 1]) expect([k, u, overlayShapes(s, u, 'side', ['calfKneeStraightRef']).length > 0]).toEqual([k, u, true]);
      for (const u of us) expect([k, u, ang(k, u, 'R').knee <= 20]).toEqual([k, u, true]); }
    expect(ang('Seated Calf Raise', 0, 'R').knee <= 20).toBe(false);
  });
});

describe('calf_raise p1: poprawki recenzji r1 (09.11.2026)', () => {
  test('W3 Calf Raise (linki): wyciąg niski (bloczek przy stopach), linka do dłoni prawie pionowo (≤ 25° od pionu; było 28° pod poziomem = 62° od pionu)', () => {
    const g = data('Calf Raise (linki)').sprzet.find(x => x.rodzaj === 'wyciag')!; expect([g.x <= 30, g.y <= 30]).toEqual([true, true]);
    for (const u of [0, 0.5, 1]) { const f = keyframeFrame(data('Calf Raise (linki)'), u); const h = f.sk.arms.R.grip; const dx = Math.abs(g.x - h[0]), dy = h[1] - g.y; expect([u, Math.atan2(dx, dy) * 180 / Math.PI <= 25]).toEqual([u, true]); }
  });
  test('N1 Łydki na stopniu: dłonie na ścianie przed osobą (karta: „przytrzymaj się czegoś”)', () => {
    expect(data('Łydki na stopniu').sprzet.some(g => g.rodzaj === 'sciana')).toBe(true);
  });
});
