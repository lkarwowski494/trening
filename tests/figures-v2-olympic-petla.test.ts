/*
 * Figury v2 — olympic: tryb pętli i prezentacja faz (decyzja właściciela 05.11.2026: „olympic naprawić teraz — tryb jednokierunkowy i kierunek faz przed wypchnięciem”).
 * Ćwiczenia z lotem albo wyrzutem (miednica nie monotoniczna: Clean, Snatch, Jerk i ich odmiany, Muscle Snatch, Clean and Jerk, Jerk Balance) mają petla = jednokierunkowa jak plyo i sled_throw:
 * u 0 → 1 to całe powtórzenie, licznik pokazuje jedną fazę „Podnoszenie” bez sekund (wyjątki w DATA_UI.olympic — wpis rodziny jest jeden, skróty recenzji innych rodzin się nie zmieniają). Bez lotu (Clean Pull, Snatch Pull, wzruszenia, Jerk Dip Squat, Snatch Balance) zostają wahadłem z DATA_UI.olympic;
 * Jerk Dip Squat i Snatch Balance mają u 0 → 1 = opuszczanie (wyjątek lowerFirst). Ruch (pozy) bez zmian — zmienia się tylko odtwarzanie.
 */
import { figureSpec, phasesFor, measuredJoint, angleLineShown, loopOf, DATA_UI, poseFile, poseKeys } from '@/lib/figures/v2';

const JEDNOKIERUNKOWE = ['Power Clean', 'Clean', 'Split Clean', 'Hang Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch',
  'Power Jerk', 'Split Jerk', 'Squat Jerk', 'Muscle Snatch', 'Clean and Jerk', 'Jerk Balance', 'Snatch Balance'];
const WAHADLO_WYSILEK = ['Clean Pull', 'Snatch Pull', 'Clean Shrug', 'Snatch Shrug'];
const WAHADLO_OPUSZCZANIE = ['Jerk Dip Squat'];

describe('olympic: tryb pętli (05.11.2026, dane)', () => {
  test('24 pozy = 19 jednokierunkowych + 5 wahadeł (r6-W1, 05.11.2026: Snatch Balance przeszedł na tryb jednokierunkowy); lista jednokierunkowych dokładnie jak w teście strażnika lotu', () => {
    const z = poseKeys('olympic'); expect(z.length).toBe(24);
    const petla = (k: string) => poseFile('olympic')!.cwiczenia[k].petla;
    expect(z.filter(k => petla(k) === 'jednokierunkowa').sort()).toEqual([...JEDNOKIERUNKOWE].sort());
    expect(z.filter(k => petla(k) === undefined).sort()).toEqual([...WAHADLO_WYSILEK, ...WAHADLO_OPUSZCZANIE].sort());
  });
});

/** Staw mierzony na rysunku (ten z knee/hip, który rusza się najbardziej — wynik geometrii póz 05.11.2026) i widoczność linii „Kąt na rysunku”. */
const STAW: Record<string, 'knee' | 'hip'> = { 'Power Clean': 'hip', 'Clean': 'hip', 'Split Clean': 'hip', 'Hang Clean': 'knee', 'Block Clean': 'knee', 'Block Power Clean': 'hip', 'Barbell Snatch': 'knee', 'Power Snatch': 'hip', 'Split Snatch': 'hip',
  'Hang Snatch': 'knee', 'Block Snatch': 'knee', 'Block Power Snatch': 'hip', 'Clean Pull': 'hip', 'Snatch Pull': 'hip', 'Clean Shrug': 'hip', 'Snatch Shrug': 'hip', 'Power Jerk': 'knee', 'Split Jerk': 'knee', 'Squat Jerk': 'knee',
  'Jerk Dip Squat': 'knee', 'Snatch Balance': 'knee', 'Muscle Snatch': 'hip', 'Clean and Jerk': 'hip', 'Jerk Balance': 'knee' };

describe('olympic: licznik faz i staw mierzony (05.11.2026, logika)', () => {
  test('DATA_UI.olympic: wyjątek nazwy fazy „Podnoszenie” dla każdego z 19 jednokierunkowych (całe powtórzenie), staw z wpisu rodziny (kolano, biodro)', () => {
    expect(DATA_UI.olympic.joints).toEqual(['knee', 'hip']);
    for (const k of JEDNOKIERUNKOWE) expect([k, DATA_UI.olympic.exceptions![k]]).toEqual([k, { names: { first: 'Podnoszenie', second: 'Podnoszenie' } }]);
    expect(Object.keys(DATA_UI.olympic.exceptions!).sort()).toEqual([...JEDNOKIERUNKOWE, ...WAHADLO_OPUSZCZANIE].sort());
  });
  test.each(JEDNOKIERUNKOWE)('%s: tryb jednokierunkowy, jedna faza „Podnoszenie” bez sekund, staw kolano albo biodro', k => {
    const s = figureSpec(k)!; expect(loopOf(s)).toBe('jednokierunkowa');
    const ph = phasesFor(s); expect(ph.map(p => [p.name, p.untimed])).toEqual([['Podnoszenie', true]]);
    expect(['knee', 'hip']).toContain(measuredJoint(s));
  });
  test.each(WAHADLO_WYSILEK)('%s: wahadło, Podnoszenie 1 s, Pauza, Opuszczanie 2 s, Pauza', k => {
    const s = figureSpec(k)!; expect(loopOf(s)).toBe('wahadlo'); expect(s.lowerFirst).toBe(false);
    expect(phasesFor(s).map(p => [p.name, p.ms])).toEqual([['Podnoszenie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]);
  });
  test.each(WAHADLO_OPUSZCZANIE)('%s: wahadło, u 0 → 1 = Opuszczanie 2 s, potem Podnoszenie 1 s (wyjątek lowerFirst)', k => {
    const s = figureSpec(k)!; expect(loopOf(s)).toBe('wahadlo'); expect(s.lowerFirst).toBe(true);
    expect(phasesFor(s).map(p => p.name)).toEqual(['Opuszczanie', 'Pauza', 'Podnoszenie', 'Pauza']);
    expect(DATA_UI.olympic.exceptions![k]).toMatchObject({ lowerFirst: true, names: { first: 'Opuszczanie', second: 'Podnoszenie' } });
  });
  test.each(Object.entries(STAW))('%s: staw mierzony %s, linia kąta widoczna', (k, j) => { const s = figureSpec(k)!; expect(measuredJoint(s)).toBe(j); expect(angleLineShown(s)).toBe(true); });
  test('tabela stawów obejmuje wszystkie 24 ćwiczenia pliku', () => { expect(Object.keys(STAW).sort()).toEqual([...poseKeys('olympic')].sort()); });
  test('r6-W1 (05.11.2026): ćwiczenie z błędem karty „zbyt wolne zejście” (olympic.mis.slowDrop) nie ma fazy zejścia z sekundami ≥ 2 s — Snatch Balance: jedna faza bez sekund; negatyw: Jerk Dip Squat (bez tego błędu) zachowuje opuszczanie 2 s', () => {
    const cues = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'lib/cues/data.json'), 'utf8')).exercises as Record<string, { mistakes?: { c: string }[] }>;
    const zBledem = poseKeys('olympic').filter(k => (cues[k]?.mistakes ?? []).some(m => m.c === 'olympic.mis.slowDrop'));
    expect(zBledem).toContain('Snatch Balance');
    for (const k of zBledem) {
      const wolneZejscie = phasesFor(figureSpec(k)!).filter(p => p.ms >= 2000 && /Opuszczanie/.test(p.name));
      expect([k, wolneZejscie]).toEqual([k, []]);
    }
    expect(phasesFor(figureSpec('Jerk Dip Squat')!).some(p => p.name === 'Opuszczanie' && p.ms >= 2000)).toBe(true); /* negatyw: wykrywacz widzi 2 s */
  });
  test('negatyw: tylko ćwiczenia z trybem jednokierunkowym mają jedną fazę (Clean Pull dalej ma cztery fazy z sekundami)', () => {
    expect(phasesFor(figureSpec('Clean Pull')!).length).toBe(4); expect(phasesFor(figureSpec('Clean')!).length).toBe(1);
  });
});
