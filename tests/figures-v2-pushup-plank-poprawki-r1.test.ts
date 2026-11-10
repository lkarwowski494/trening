/*
 * Figury v2 pushup_plank — poprawki po recenzji niezależnej r1 (09.11.2026, audytor; W1, W2, W3). Progi z kart i z fizyki podparcia, nie z danych (K5):
 * - W1: noga „prosta” (karta: „nogi wyprostowane”, „ciało proste od głowy do pięt”) ma kolano zgięte ≤ 5° w całym ruchu (jak lockout w hinge: 4,5°); przed poprawką 17,2–20,1° (DL 82 < udo + podudzie 83 cm).
 * - W2: Plyo Push-Up — dłonie na podłodze (≤ 1 cm), dopóki łokieć nie jest prawie wyprostowany (zgięcie < PROSTY_LOKIEC = 20°, czyli kąt łokcia > 160°); lot dopiero po wyproście, a pętla jednokierunkowa kończy się lądowaniem (u = 1 na podłodze).
 * - W3: Plank Shoulder Taps — w każdej klatce co najmniej jedna dłoń na podłodze (≤ 1 cm).
 * Przypadek negatywny: dane sprzed poprawki (DL 82, dłonie Plyo 1 → 12 cm od u 0,45, obie dłonie w powietrzu w u 0,55–0,95) oblewają te testy.
 */
import { figureSpec, frameAt, jointAngles, type FigureSpec } from '@/lib/figures/v2';
import { poseDataFor } from '@/lib/figures/v2/poseData';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const PODLOGA_DLONI = 2; /* środek dłoni na podłodze: y = 2 cm (hy w generatorze) */
const KOLANO_PROSTE = 5, DLON_NA_PODLODZE = 1, PROSTY_LOKIEC = 20;
const proste = ['Push Up', 'Push-Up Wide', 'Close-Grip Push-Up', 'Diamond Push Up', 'Decline Push Up', 'Incline Push Up', 'Incline Push-Up Close-Grip', 'Single-Arm Push-Up', 'Plank', 'Plank Shoulder Taps', 'Plyo Push-Up',
  'Standing Barbell Rollout', 'Suspended Push-Up', 'Suspended Fallout', 'Inverted Row'];
const wys = (k: string, u: number, s: 'R' | 'L') => frameAt(spec(k), u).sk.arms[s].grip[1] - PODLOGA_DLONI;
const kolano = (k: string, u: number, s: 'R' | 'L') => jointAngles(frameAt(spec(k), u).sk, s).knee;
const zaokr = (x: number) => Math.round(x * 10) / 10;

describe('W1: noga prosta — kolano ≤ 5° w całym ruchu', () => {
  test.each(proste)('%s — obie nogi, 21 punktów ruchu', k => {
    const m = Math.max(...US.flatMap(u => (['R', 'L'] as const).map(s => kolano(k, u, s))));
    expect([k, m <= KOLANO_PROSTE, zaokr(m)]).toEqual([k, true, zaokr(m)]);
  });
  test('Mountain Climbers — noga wyprostowana (L w u = 0, R w u = 1) prosta ≤ 5°, druga zgięta wyraźnie (> 60°)', () => {
    const k = 'Mountain Climbers';
    expect([zaokr(kolano(k, 0, 'L')) <= KOLANO_PROSTE, zaokr(kolano(k, 1, 'R')) <= KOLANO_PROSTE]).toEqual([true, true]);
    expect([kolano(k, 0, 'R') > 60, kolano(k, 1, 'L') > 60]).toEqual([true, true]);
  });
  test('rollouty z klęku: kolano zgięte celowo (podparcie na kolanach) — nie dotyczy W1', () => {
    for (const k of ['Rollout (sztanga)', 'Barbell Rollout from Bench']) expect(kolano(k, 0, 'R')).toBeGreaterThan(60);
  });
});

describe('W2: Plyo Push-Up — wypychanie z podparciem, lot dopiero po wyproście łokci', () => {
  const k = 'Plyo Push-Up';
  test(`dłonie ≤ 1 cm od podłogi, dopóki zgięcie łokcia ≥ ${PROSTY_LOKIEC}° (łokieć < 160°)`, () => {
    for (const u of US) for (const s of ['R', 'L'] as const) {
      const el = jointAngles(frameAt(spec(k), u).sk, s).elbow; const h = wys(k, u, s);
      if (el >= PROSTY_LOKIEC) expect([u, s, h <= DLON_NA_PODLODZE]).toEqual([u, s, true]);
    }
  });
  test('są klatki lotu (dłonie > 3 cm nad podłogą) i występują dopiero po wyproście (zgięcie < 20°)', () => {
    const lot = US.filter(u => wys(k, u, 'R') > 3);
    expect(lot.length).toBeGreaterThan(0);
    for (const u of lot) expect([u, jointAngles(frameAt(spec(k), u).sk, 'R').elbow < PROSTY_LOKIEC]).toEqual([u, true]);
  });
  test('pętla jednokierunkowa kończy się lądowaniem: klatka końcowa z dłońmi na podłodze', () => {
    const d = poseDataFor(k, 'pushup_plank') as unknown as { petla?: string; klatki: Array<{ u: number }> };
    expect(d.petla).toBe('jednokierunkowa');
    expect([wys(k, 1, 'R') <= DLON_NA_PODLODZE, wys(k, 1, 'L') <= DLON_NA_PODLODZE]).toEqual([true, true]);
  });
});

describe('W3: Plank Shoulder Taps — zawsze przynajmniej jedna dłoń na podłodze', () => {
  const k = 'Plank Shoulder Taps';
  test('21 punktów ruchu: min(wysokość prawej, lewej) ≤ 1 cm', () => {
    for (const u of US) { const m = Math.min(wys(k, u, 'R'), wys(k, u, 'L')); expect([u, m <= DLON_NA_PODLODZE, zaokr(m)]).toEqual([u, true, zaokr(m)]); }
  });
  test('są dotknięcia barku: dłoń wyraźnie nad podłogą (> 15 cm) w którymś punkcie, osobno prawa i lewa', () => {
    expect(US.some(u => wys(k, u, 'R') > 15)).toBe(true); expect(US.some(u => wys(k, u, 'L') > 15)).toBe(true);
  });
});
