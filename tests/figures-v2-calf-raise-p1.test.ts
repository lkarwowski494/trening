/*
 * Rodzina v2 calf_raise (wspięcia na palce), partia 1 linii 1.1, 09.11.2026 — podłączenie, DATA_UI, nakładka, zakres stawów z tekstu karty i tor ciężaru.
 * Progi z karty i geometrii, nie z bieżących danych (K5): zakres kostki z reguł `wspiecie` (zgięcie podeszwowe ≥ 15° na górze, data/zrodla/figury-sens.json),
 * kolana stojąc ≤ 20° (`kolana_proste`), w siadzie ≥ 60° (`kolana_zgiete_siad`); ślad ciężaru ≤ 3 cm od chwytu (wzór tests/figures-v2-tor.test.ts).
 */
import { FAMILIES, assignAll, figureSpec, frameAt, keyframeFrame, jointAngles, poseKeys, hasPoseFile, overlayShapes, measuredJoint, angleLineShown, phaseNames, phasesFor } from '@/lib/figures/v2';
import { DATA_UI, MIN_MEASURED_ROM } from '@/lib/figures/v2/poseData';
import { poseFile } from '@/lib/figures/v2/poseData';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
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

/* Ślad dźwigni poza dłońmi (Standing Calf Raise: punkt miednica, Donkey Calf Raise: miednica, Seated Calf Raise: kostki) jest zły (contract.ts:330–332 bierze dłoń z `trzyma`) — test toru dla tych 3 ćwiczeń czeka na figury/slad-dzwignia (decyzja koordynatora 09.11.2026); nie zatwierdzamy złego śladu. */
export const CZEKA_NA_SLAD_DZWIGNI = ['Standing Calf Raise', 'Donkey Calf Raise', 'Seated Calf Raise'];
describe('calf_raise p1: tor ciężaru', () => {
  test('lista ćwiczeń z torem czekającym na poprawkę silnika to dokładnie 3 ćwiczenia z dźwignią poza dłońmi i nie zawiera ćwiczeń z ciężarem w rękach', () => {
    const z = KEYS.filter(k => data(k).sprzet.some(g => g.rodzaj === 'dzwignia' && g.punkt !== 'dlonie')).sort(); expect(z).toEqual([...CZEKA_NA_SLAD_DZWIGNI].sort());
  });
  test('ćwiczenia z ciężarem w rękach (sztanga, hantle): ślad ≤ 3 cm od chwytu w każdej klatce; ślad rośnie w górę razem z wspięciem', () => {
    for (const k of ['Calf Raise (sztanga)', 'Smith Machine Calf Raise', 'Barbell Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Dumbbell Seated One-Leg Calf Raise']) {
      const s = figureSpec(k)!; let prevY = -1e9;
      for (const u of us) { const f = frameAt(s, u); const t = (f.info.trail ?? f.info.load)!; expect([k, u, !!t]).toEqual([k, u, true]);
        const d = Math.min(...(['R', 'L'] as const).map(x => Math.hypot(...[0, 1, 2].map(i => (t[i] - f.sk.arms[x].grip[i])) as [number, number, number]))); const dm = Math.hypot(...[0, 1, 2].map(i => t[i] - (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2) as [number, number, number]);
        expect([k, u, Math.min(d, dm) <= 3]).toEqual([k, u, true]); if (!k.includes('Seated')) { expect([k, u, t[1] >= prevY - 1e-6]).toEqual([k, u, true]); prevY = t[1]; } }
    }
  });
  test('przypadek negatywny miary: ślad przesunięty o 5 cm od chwytu nie mieści się w 3 cm', () => {
    const f = frameAt(figureSpec('Calf Raise (sztanga)')!, 0.5); const g = f.sk.arms.R.grip; expect(Math.hypot(5, 0, 0) <= 3).toBe(false); expect(g.length).toBe(3);
  });
});

describe('calf_raise p1: nakładka techniki', () => {
  test('rejestr: jeden element (ref segment biodro → kolano, reguła kolana_proste, cue calf.knees); dostają go tylko ćwiczenia z regułą „ustalone” kolana_proste, nie jednonóż ani siad', () => {
    expect(Object.prototype.hasOwnProperty.call(TECHNIQUE, FAM)).toBe(true); expect(TECHNIQUE[FAM]).toBe(CALF_RAISE_TECHNIQUE);
    expect(CALF_RAISE_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.cue, d.views])).toEqual([['calfKneeStraightRef', 'ref', 'kolana_proste', ['calf.knees'], ['side']]]);
    for (const d of CALF_RAISE_TECHNIQUE) expect(['limb', 'abduction', 'ref']).toContain(d.kind);
    const z = (k: string) => techniquesFor(FAM, ['calf.knees', 'calf.move'], k).map(d => d.id);
    for (const k of KEYS) expect([k, z(k)]).toEqual([k, [...JEDNONOZ, ...SIEDZACE].includes(k) ? [] : ['calfKneeStraightRef']]);
  });
  test('element rysuje się w rzucie z boku (linia uda przedłużona poniżej kolana) w każdej klatce stojących ćwiczeń; goleń leży na tej linii z dokładnością do kąta kolana ≤ 20° (przypadek negatywny: siad 90° nie leży)', () => {
    for (const k of KEYS.filter(x => ![...JEDNONOZ, ...SIEDZACE].includes(x))) { const s = figureSpec(k)!;
      for (const u of [0, 0.5, 1]) expect([k, u, overlayShapes(s, u, 'side', ['calfKneeStraightRef']).length > 0]).toEqual([k, u, true]);
      for (const u of us) expect([k, u, ang(k, u, 'R').knee <= 20]).toEqual([k, u, true]); }
    expect(ang('Seated Calf Raise', 0, 'R').knee <= 20).toBe(false);
  });
});
