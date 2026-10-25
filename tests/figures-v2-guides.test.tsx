/*
 * Figury v2 — tor ruchu, linie odniesienia (bez liczb, tylko przy wskazówkach ze źródłem), fazy i tempo, legenda mięśni. Decyzja właściciela 25.10.2026.
 * Rodzaje (docs/20): dane (linie związane z id wskazówek ćwiczenia), logika (fazy, indeks fazy w czasie), niezmienniki (linie bez tekstu, tor = droga środka ciężaru).
 */
import {
  GUIDES, guidesFor, trailShapes, phasesOf, phaseIndexAt, phaseNames, phasesFor, trailFor, guideShapes, figureSpec, frameAt, shapesAt, TEMPO, type GuideId, type FigureSpec,
} from '@/lib/figures/v2';
import { cueIdsOf, guidesOf, errorsOf, legendOf } from '@/lib/figures/v2/ui';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;

describe('linie odniesienia tylko ze źródłem', () => {
  test('każda linia ma wskazówkę (id), widok i budowę; guidesFor zwraca tylko linie, których wskazówka jest w zestawie', () => {
    for (const g of Object.values(GUIDES)) { expect([g.id, g.cue.length > 0, g.views.length > 0]).toEqual([g.id, true, true]); }
    expect(guidesFor(['sq.depth'])).toEqual(['thighParallel']); expect(guidesFor(['xx'])).toEqual([]); expect(guidesFor(['sq.kneesToes', 'hinge.back', 'dl.feet']).sort()).toEqual(['backLine', 'kneeToe', 'plumbMidfoot']);
  });
  test('przypisanie ćwiczeniom: martwy ciąg (własne wskazówki) ma linię nad środkiem stopy; przysiad własny — uda równolegle; zestaw ogólny — kolana w linii palców; zawias ogólny — plecy', () => {
    expect(guidesOf('Deadlift (sztanga)')).toContain('plumbMidfoot'); expect(guidesOf('Back Squat')).toContain('thighParallel');
    expect(guidesOf('Box Squat')).toContain('kneeToe'); expect(guidesOf('Rack Pull')).toContain('backLine'); expect(guidesOf('Wall Sit')).not.toContain('thighParallel');
    expect(guidesOf('Nie ma takiego')).toEqual([]);
  });
  test('linie nie mają liczb ani tekstu (same kształty), leżą w warstwie nad ciałem i są przerywane; w odpowiednich widokach', () => {
    const s = spec('Back Squat'); const f = frameAt(s, 1);
    for (const id of ['thighParallel', 'kneeToe', 'backLine', 'plumbMidfoot'] as GuideId[]) for (const v of ['side', 'front'] as const) {
      const sh = GUIDES[id].views.includes(v) ? GUIDES[id].build(f, v) : []; for (const x of sh) { expect(x.k).toBe('line'); expect((x as { dash?: unknown }).dash).toBeTruthy(); expect(x.z).toBeGreaterThan(3000); }
    }
    expect(guideShapes(s, 1, 'side', ['kneeToe']).length).toBe(0); expect(guideShapes(s, 1, 'front', ['kneeToe']).length).toBe(2); expect(guideShapes(s, 1, 'side', ['thighParallel']).length).toBe(1);
    expect(guideShapes(spec('Deadlift (sztanga)'), 0, 'side', ['plumbMidfoot', 'backLine']).length).toBe(2);
  });
  test('uda równolegle: na dole przysiadu linia na wysokości kolana przechodzi przez udo (kolano ≈ biodro ± 6 cm)', () => {
    const f = frameAt(spec('Back Squat'), 1); const l = guideShapes(spec('Back Squat'), 1, 'side', ['thighParallel'])[0] as { a: [number, number] };
    expect(Math.abs(l.a[1] - f.sk.legs.R.knee[1])).toBeLessThan(0.01); expect(Math.abs(f.sk.legs.R.hip[1] - f.sk.legs.R.knee[1])).toBeLessThan(8);
  });
});

describe('tor ruchu', () => {
  test('tor = droga środka ciężaru: łamana z 24 odcinków i znacznik startu; w widoku z boku zaczyna się w pozycji wyjściowej; izometria bez toru', () => {
    const t = trailFor(spec('Back Squat'), 'side'); expect(t.filter(x => x.id === 'trail').length).toBe(24); expect(t.some(x => x.id === 'trailStart')).toBe(true);
    const f0 = frameAt(spec('Back Squat'), 0); const st = t.find(x => x.id === 'trailStart') as { c: [number, number] }; expect(st.c).toEqual([f0.info.load[0], f0.info.load[1]]);
    expect(trailFor(spec('Wall Sit'), 'side')).toEqual([]); expect(trailFor(spec('Back Squat'), 'side')).toBe(t);
    expect(trailShapes([frameAt(spec('Back Squat'), 0)], 'side')).toEqual([]);
  });
  test('sztanga w wyciskaniu idzie pionowo (tor z boku: zmiana x ≤ 20 cm przy zmianie y ≥ 40 cm)', () => {
    const pts = trailFor(spec('Bench Press (sztanga)'), 'side').filter(x => x.id === 'trail') as { a: [number, number]; b: [number, number] }[];
    const xs = pts.flatMap(p => [p.a[0], p.b[0]]), ys = pts.flatMap(p => [p.a[1], p.b[1]]); expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(20); expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(40);
  });
  test('kształty klatki z mięśniami i błędem zawierają więcej niż samo ciało', () => {
    expect(shapesAt(spec('Back Squat'), 0.5, 'side', true).length).toBeGreaterThan(shapesAt(spec('Back Squat'), 0.5, 'side').length);
  });
});

describe('fazy i tempo', () => {
  test('nazwy faz: przysiad Opuszczanie/Wstawanie, wyciskanie Opuszczanie/Wypychanie, martwy z podłogi Podnoszenie/Opuszczanie, RDL Opuszczanie/Prostowanie', () => {
    expect(phaseNames(spec('Back Squat'))).toEqual({ first: 'Opuszczanie', second: 'Wstawanie' }); expect(phaseNames(spec('Bench Press (sztanga)'))).toEqual({ first: 'Opuszczanie', second: 'Wypychanie' });
    expect(phaseNames(spec('Deadlift (sztanga)'))).toEqual({ first: 'Podnoszenie', second: 'Opuszczanie' }); expect(phaseNames(spec('RDL (sztanga)'))).toEqual({ first: 'Opuszczanie', second: 'Prostowanie' });
  });
  test('czasy: opuszczanie 2 s, wypychanie 1 s, pauza 0,5 s; martwy ciąg z podłogi odwrotnie; błąd tempa podaje własne czasy', () => {
    expect(phasesFor(spec('Back Squat')).map(p => p.ms)).toEqual([TEMPO.downMs, TEMPO.holdMs, TEMPO.upMs, TEMPO.holdMs]);
    expect(phasesFor(spec('Deadlift (sztanga)')).map(p => [p.name, p.ms])).toEqual([['Podnoszenie', TEMPO.upMs], ['Pauza', TEMPO.holdMs], ['Opuszczanie', TEMPO.downMs], ['Pauza', TEMPO.holdMs]]);
    expect(phasesFor(spec('Back Squat'), { downMs: 450, upMs: 350 })[0].ms).toBe(450); expect(phasesOf({ first: 'Opuszczanie', second: 'Wstawanie' }, true)[2].name).toBe('Wstawanie');
  });
  test('phaseIndexAt: wskazuje fazę zgodną z uAt (opuszczanie gdy u rośnie, wstawanie gdy maleje, pauzy na końcach)', () => {
    const ph = phasesFor(spec('Back Squat')); const h = TEMPO.holdMs;
    expect(phaseIndexAt(h + 100, ph)).toBe(0); expect(phaseIndexAt(h + TEMPO.downMs + 100, ph)).toBe(1); expect(phaseIndexAt(h + TEMPO.downMs + h + 100, ph)).toBe(2); expect(phaseIndexAt(10, ph)).toBe(3);
    expect(phaseIndexAt(ph.reduce((s, p) => s + p.ms, 0) + h + 5, ph)).toBe(0);
  });
});

describe('dane dla ekranu: wskazówki, błędy, legenda mięśni', () => {
  test('cueIdsOf: własne (lib/cues) albo zestaw ogólny; ćwiczenie otwarte bez wskazówek', () => {
    expect(cueIdsOf('Back Squat').errs).toEqual(expect.arrayContaining(['sq.mis.kneesIn', 'sq.mis.heels'])); expect(cueIdsOf('Box Squat').ids).toContain('sq.kneesToes'); expect(cueIdsOf('Box Squat').errs).toContain('sq.mis.kneesIn');
    expect(cueIdsOf('Nie ma takiego')).toEqual({ ids: [], errs: [] });
  });
  test('errorsOf: błędy pokazywalne pozą (bez powtórzeń); siad przy ścianie bez błędów; sztanga odjeżdżająca od ciała w martwym ciągu', () => {
    expect(errorsOf(spec('Back Squat')).map(e => e.error)).toEqual(['kneesIn', 'heels']); expect(errorsOf(spec('Wall Sit'))).toEqual([]); expect(errorsOf(spec('Deadlift (sztanga)')).map(e => e.error)).toEqual(['roundBack', 'barAway']);
    expect(errorsOf(spec('RDL (sztanga)')).map(e => e.error)).toEqual(['roundBack', 'kneesBent']); expect(errorsOf(spec('Bench Press (sztanga)')).map(e => e.error)).toEqual(['arch']);
  });
  test('legendOf: główne i pomocnicze z katalogu, uproszczenie wg pewności; brak danych → null', () => {
    const l = legendOf('Back Squat')!; expect(l.main).toEqual(['quads']); expect(l.aux).toEqual(expect.arrayContaining(['glutes', 'hamstrings'])); expect(l.simplified).toBe(false); expect(l.label('quads')).toBe('czworogłowe');
    expect(legendOf('Nie ma takiego')).toBeNull();
  });
});
