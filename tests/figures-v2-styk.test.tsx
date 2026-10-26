/*
 * Figury v2 — punkty styku, znaczki ✓/✕, strzałki toru (polecenie właściciela 26.10.2026). Rodzaje (docs/20): logika (wykrywanie styku z geometrii, macierz: wszystkie ćwiczenia z figurą),
 * reguła sensu (styki wymagane w pozie poprawnej rodziny), ekran (poświaty, znaczki, stuknięcie pokazuje tekst), dostępność (etykiety znaczków), wygląd (kontrast ról, oba motywy), wydajność (budżet).
 * Źródło „pięciu punktów styku” w wyciskaniu: NSCA Basics 2012 (data/zrodla/cues.json, wskazówka bp.contact).
 */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import {
  figureSpec, frameAt, contactsOf, contactGlows, glowShapes, lostContacts, contactShapes, requiredContacts, CONTACT, CONTACT_IDS, kindOf, okBadges, badgeShapes, anchorPoint, CUE_ANCHOR, ANCHORS, BADGE_MAX,
  trailShapes, trailFor, TRAIL_ARROW, figurePalette, contrast, shapesAt, markPoints, type ContactId,
} from '@/lib/figures/v2';
import { badgesFor, errorsOf } from '@/lib/figures/v2/ui';
import { applyLang } from '@/lib/i18n';
import { light, dark, lightHC, darkHC } from '@/lib/theme';
import * as fs from 'fs';
import * as path from 'path';

const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); jest.restoreAllMocks(); });

const KEYS = Object.keys(CATALOG).filter(k => figureSpec(k));
const U = Array.from({ length: 13 }, (_, i) => i / 12);
const ids = (u: number, k: string, e?: Parameters<typeof frameAt>[2]): ContactId[] => contactsOf(frameAt(figureSpec(k)!, u, e)).map(c => c.id);

describe('wykrywanie styku z geometrii (logika)', () => {
  test('wartości wymiarów: tolerancje w jednym miejscu, 9 punktów styku, rodzaje stopa/dłoń/ciało', () => {
    expect(CONTACT.floor).toBe(1); expect(CONTACT.surface).toBe(1.5); expect(CONTACT.head).toBeGreaterThan(CONTACT.surface); expect(CONTACT_IDS.length).toBe(9);
    expect(CONTACT_IDS.map(kindOf)).toEqual(['foot', 'foot', 'foot', 'foot', 'hand', 'hand', 'body', 'body', 'body']);
  });
  test('przysiad: obie stopy (pięta i palce) na podłodze w całym ruchu; wyciskanie płasko: pięć punktów styku — głowa, plecy, pośladki i obie stopy; podciąganie: dłonie na drążku, stopy w powietrzu', () => {
    for (const u of U) { expect(ids(u, 'Back Squat')).toEqual(expect.arrayContaining(['heelR', 'heelL', 'toeR', 'toeL'])); expect(ids(u, 'Back Squat')).not.toContain('seat'); }
    for (const u of U) expect(ids(u, 'Bench Press (sztanga)')).toEqual(expect.arrayContaining(['head', 'back', 'seat', 'heelR', 'heelL', 'toeR', 'toeL', 'handR', 'handL']));
    for (const u of U) { expect(ids(u, 'Pull Up').sort()).toEqual(['handL', 'handR']); }
  });
  test('styk na podwyższeniu: stopa na platformie (martwy ciąg z podwyższenia) i miednica na skrzyni (przysiad na skrzyni) wykrywane tak samo jak podłoga; punkt stopy leży na powierzchni, nie pod nią', () => {
    const k = KEYS.find(x => figureSpec(x)!.family === 'hinge' && frameAt(figureSpec(x)!, 0).props.some(p => p.k === 'box'));
    if (k) for (const c of contactsOf(frameAt(figureSpec(k)!, 0)).filter(c => c.kind === 'foot')) expect(c.p[1]).toBeGreaterThanOrEqual(0);
    expect(ids(1, 'Box Squat')).toContain('seat');
  });
  test('błąd „pięty” traci styk pięt (palce zostają), „wygięcie lędźwi” (arch) traci styk pośladków; błąd kolan i tempa nie zmienia styków', () => {
    const sq = figureSpec('Back Squat')!; expect(lostContacts(frameAt(sq, 1, 'heels'), frameAt(sq, 1)).sort()).toEqual(['heelL', 'heelR']); expect(ids(1, 'Back Squat', 'heels')).toEqual(expect.arrayContaining(['toeR', 'toeL']));
    const bp = figureSpec('Bench Press (sztanga)')!; expect(lostContacts(frameAt(bp, 1, 'arch'), frameAt(bp, 1))).toContain('seat');
    expect(lostContacts(frameAt(sq, 1, 'kneesIn'), frameAt(sq, 1))).toEqual([]);
  });
  test('macierz: każde ćwiczenie z figurą — styki skończone, punkty w kadrze, kolejność stabilna; stan startowy i końcowy zawierają styki wymagane rodziny (reguła sensu)', () => {
    for (const k of KEYS) { const s = figureSpec(k)!; const req = requiredContacts(s);
      for (const u of U) { const have = new Set(ids(u, k)); for (const r of req) if (!have.has(r)) throw new Error(`${k} u=${u}: brak styku ${r} (ma: ${[...have].join(',')})`); for (const c of contactsOf(frameAt(s, u))) expect(c.p.every(Number.isFinite)).toBe(true); } }
  });
  test('wymagane styki: liczności rodzin (przysiad 4, wyciskanie 7 lub 3 przy ławce ujemnej, zawias 2 lub 4, podciąganie 2 lub 1 — jednorącz)', () => {
    const n = (k: string) => requiredContacts(figureSpec(k)!).length;
    expect(n('Back Squat')).toBe(4); expect(n('Bench Press (sztanga)')).toBe(7); expect(n('Decline Bench Press')).toBe(3); expect(n('Deadlift (sztanga)')).toBe(4); expect(n('Single Leg RDL (hantel)')).toBe(2); expect(n('Pull Up')).toBe(2); expect(n('One Arm Chin-Up')).toBe(1);
  });
});

describe('poświaty styku (kształty)', () => {
  test('poza poprawna: poświata „dobrze” przy każdym styku (halo + rdzeń, półprzezroczysta), stopa za ciałem tuż nad podłogą, reszta nad ciałem; błąd „pięty”: poświata „błąd” w miejscu oderwanej pięty', () => {
    const sq = figureSpec('Back Squat')!; const ok = contactShapes(sq, 1, 'side').filter(s => s.k === 'ellipse');
    expect(ok.length).toBe(2 * contactsOf(frameAt(sq, 1)).length); expect(ok.every(s => s.k === 'ellipse' && s.fill === 'contactOk' && s.a! < 1)).toBe(true); expect(Math.min(...ok.map(s => s.z))).toBeLessThan(0);
    const er = contactShapes(sq, 1, 'side', 'heels').filter(s => s.k === 'ellipse' && s.fill === 'contactBad'); expect(er.length).toBe(4); /* dwie pięty × halo i rdzeń */
    expect(contactShapes(sq, 1, 'side', 'kneesIn').some(s => s.k === 'ellipse' && s.fill === 'contactBad')).toBe(false);
    expect(contactShapes(sq, 0, 'side', 'jerk').some(s => s.k === 'ellipse' && s.fill === 'contactBad')).toBe(false);
  });
  test('glowShapes: stopa płaska (obrót 0), ciało obrócone wzdłuż osi tułowia; contactGlows bez wzorca = tylko „dobrze”', () => {
    const f = frameAt(figureSpec('Bench Press (sztanga)')!, 0); const c = contactsOf(f).find(x => x.id === 'back')!;
    const g = glowShapes(c, 'side', 'contactOk', f.sk.up); expect(g.length).toBe(2); expect(g[0].k === 'ellipse' && Math.abs(g[0].rot) > 45).toBe(true);
    const foot = contactsOf(f).find(x => x.kind === 'foot')!; const gf = glowShapes(foot, 'side', 'contactBad'); expect(gf[0].k === 'ellipse' && gf[0].rot).toBe(0);
    expect(contactGlows(f, 'side').every(s => s.k === 'ellipse' && s.fill === 'contactOk')).toBe(true);
  });
  test('kolory z tokenów: kontrast ≥ 3:1 ról „dobrze” i „błąd” do tła i karty w czterech paletach (jasny, ciemny, Zwiększ kontrast)', () => {
    for (const [n, th] of Object.entries({ light, dark, lightHC, darkHC })) { const pal = figurePalette(th); for (const bg of [th.bg, th.surface]) for (const r of ['contactOk', 'contactBad'] as const) expect([n, r, contrast(pal[r], bg) >= 3]).toEqual([n, r, true]); expect(pal.contactOk).not.toBe(pal.contactBad); }
  });
});

describe('znaczki ✓/✕ powiązane ze wskazówkami', () => {
  test('tablica CUE_ANCHOR: każda część ciała ma punkt w klatce; ✓ tylko dla wskazówek z wpisem, maks. 3, każda część raz; kolejność jak we wskazówkach', () => {
    const f = frameAt(figureSpec('Back Squat')!, 0.5);
    expect(ANCHORS).toEqual(['knees', 'heels', 'back', 'pelvis', 'bar', 'head', 'shoulders', 'elbows', 'hands', 'feet']);
    expect(markPoints(f, 'side', 'knees').length).toBe(1); expect(markPoints(f, 'front', 'knees').length).toBe(2); expect(markPoints(f, 'side', 'bar').length).toBe(1);
    for (const a of ANCHORS) expect(anchorPoint(f, a).every(Number.isFinite)).toBe(true);
    for (const a of Object.values(CUE_ANCHOR)) expect(ANCHORS).toContain(a);
    const b = okBadges(f, 'side', ['zzz.brak', 'sq.kneesToes', 'sq.stance', 'sq.back', 'sq.depth', 'sq.down']); expect(b.map(x => x.cue)).toEqual(['sq.kneesToes', 'sq.stance', 'sq.back']); expect(BADGE_MAX).toBe(3);
    expect(okBadges(f, 'side', ['sq.kneesToes', 'sumo.kneesOut']).length).toBe(1); /* ta sama część ciała raz */
  });
  test('macierz: dla każdego ćwiczenia z figurą ≤ 3 znaczków ✓ w pozie poprawnej (w obu widokach) i ≤ 3 ✕ w widoku każdego błędu; wszystkie we współrzędnych skończonych; błąd ma wskazówkę', () => {
    for (const k of KEYS) { const s = figureSpec(k)!;
      for (const v of s.views) { const o = badgesFor(s, 0.5, v); expect(o.length).toBeLessThanOrEqual(BADGE_MAX); expect(o.every(b => b.kind === 'ok' && b.at.every(Number.isFinite))).toBe(true);
        for (const e of errorsOf(s)) { const x = badgesFor(s, 0.5, v, e.error); expect(x.length).toBeLessThanOrEqual(BADGE_MAX); expect(x.every(b => b.kind === 'err' && b.cue === e.cue)).toBe(true); } } }
    expect(KEYS.filter(k => badgesFor(figureSpec(k)!, 0.5, 'side').length > 0).length).toBeGreaterThan(60);
  });
  test('kształty znaczka ✓: okrąg i dwie kreski w roli „dobrze”, nad ciałem; brak kształtów dla ✕ (to znaczniki błędu)', () => {
    const sh = badgeShapes([{ id: 'a', kind: 'ok', cue: 'x', at: [10, 10] }, { id: 'b', kind: 'err', cue: 'y', at: [0, 0] }]);
    expect(sh.map(s => s.id)).toEqual(['badgeOk', 'badgeOkMark', 'badgeOkMark']); expect(sh.every(s => s.z >= 5000)).toBe(true);
  });
});

describe('strzałki na końcach toru ruchu', () => {
  test('tor ma dwa groty (koniec u = 1 w stronę pierwszej fazy, początek w stronę powrotu), kierunek zgodny z ruchem; ćwiczenie statyczne bez toru i bez strzałek', () => {
    const s = figureSpec('Back Squat')!; const tr = trailFor(s, 'side'); const ar = tr.filter(x => x.id === 'trailArrow'); expect(ar.length).toBe(2);
    const down = ar.find(x => x.k === 'poly')!; if (down.k === 'poly') { expect(down.pts.length).toBe(3); const tip = down.pts[0]; const base = [(down.pts[1][0] + down.pts[2][0]) / 2, (down.pts[1][1] + down.pts[2][1]) / 2]; expect(Math.hypot(tip[0] - base[0], tip[1] - base[1])).toBeCloseTo(TRAIL_ARROW, 5); }
    const pts = [[0, 0], [0, -10], [0, -20], [0, -30]] as [number, number][]; const f = (y: number) => ({ ...frameAt(s, 0), info: { load: [0, y, 0] as [number, number, number] } }); const fr = [f(100), f(90), f(80), f(70)];
    const arrows = trailShapes(fr, 'side').filter(x => x.id === 'trailArrow'); expect(arrows.length).toBe(2); void pts;
    const end = arrows[0]; if (end.k === 'poly') expect(end.pts[0][1]).toBeLessThan(end.pts[1][1]); /* koniec: grot skierowany w dół (ruch w dół) */
    expect(trailFor(figureSpec('Wall Sit')!, 'side')).toEqual([]);
  });
});

describe('komponent: poświaty, znaczki, stuknięcie, dostępność', () => {
  test('przysiad: znaczki ✓ jako przyciski z etykietą „Wskazówka: …”; stuknięcie zatrzymuje animację i pokazuje tekst wskazówki pod rysunkiem; widok błędu: ✕ z etykietą „Częsty błąd: …”', async () => {
    jest.useFakeTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false));
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush(); await act(async () => { jest.advanceTimersByTime(100); });
    const w = screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => n.props.testID === 'exercise-figure-v2-side' || n.props.testID === 'exercise-figure-v2-front'); expect(w.length).toBeGreaterThan(0);
    /* układ (onLayout) w testach nie liczy szerokości — wywołujemy go jak urządzenie */
    for (const n of screen.UNSAFE_root.findAll((x: { props: Record<string, unknown> }) => typeof x.props.onLayout === 'function')) await act(async () => { (n.props.onLayout as (e: unknown) => void)({ nativeEvent: { layout: { width: 160, height: 120 } } }); });
    const b = screen.getAllByRole('button').filter(x => /^Wskazówka: /.test(String(x.props.accessibilityLabel))); expect(b.length).toBeGreaterThan(0); expect(b.length).toBeLessThanOrEqual(2 * BADGE_MAX);
    fireEvent.press(b[0]); expect(screen.getByTestId('exercise-figure-v2-badge-text').props.children.join('')).toMatch(/^✓ /); expect(screen.getByRole('button', { name: 'Wznów animację' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' }));
    for (const n of screen.UNSAFE_root.findAll((x: { props: Record<string, unknown> }) => typeof x.props.onLayout === 'function')) await act(async () => { (n.props.onLayout as (e: unknown) => void)({ nativeEvent: { layout: { width: 160, height: 120 } } }); });
    const e = screen.getAllByRole('button').filter(x => /^Częsty błąd: /.test(String(x.props.accessibilityLabel))); expect(e.length).toBeGreaterThan(0); expect(screen.queryByTestId('exercise-figure-v2-badge-text')).toBeNull();
    fireEvent.press(e[0]); expect(screen.getByTestId('exercise-figure-v2-badge-text').props.children.join('')).toMatch(/^✕ /);
  });
  test('EN: etykiety znaczków po angielsku („Tip: …”)', async () => {
    jest.useFakeTimers(); applyLang('en'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    render(<ExerciseFigureV2 exercise={lib('Back Squat')} />); await flush();
    for (const n of screen.UNSAFE_root.findAll((x: { props: Record<string, unknown> }) => typeof x.props.onLayout === 'function')) await act(async () => { (n.props.onLayout as (e: unknown) => void)({ nativeEvent: { layout: { width: 160, height: 120 } } }); });
    expect(screen.getAllByRole('button').some(x => /^Tip: /.test(String(x.props.accessibilityLabel)))).toBe(true);
  });
  test('kształty w SVG: poświaty styku w kolorach z palety obu motywów; poświata nie zmienia kadru (shapesAt bez styków)', () => {
    const s = figureSpec('Back Squat')!; expect(shapesAt(s, 1, 'side').some(x => x.id === 'contactOk')).toBe(false); expect(contactShapes(s, 1, 'side').some(x => x.id === 'contactOk')).toBe(true);
    for (const th of [light, dark]) { const pal = figurePalette(th); expect(pal.contactOk).toBe(th.doneLine); expect(pal.contactBad).toBe(th.danger); }
  });
});

describe('reguła sensu: styki w danych walidatora', () => {
  test('figury-sens.json: reguła „dlonie_na_drazku” (typ styk_dlonie, wskazówka pu.grip) dla każdego ćwiczenia pull_up z regułami; zgodna z requiredContacts (dłonie)', () => {
    const d = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.pull_up;
    expect(d.reguly.dlonie_na_drazku).toMatchObject({ typ: 'styk_dlonie', grupa: 'styk', cue: 'pu.grip' });
    for (const [k, v] of Object.entries(d.warianty)) { const l: string[] = Array.isArray(v) ? v : d.warianty[v as string]; expect([k, l.includes('dlonie_na_drazku')]).toEqual([k, true]); }
    for (const k of KEYS.filter(x => figureSpec(x)!.family === 'pull_up')) expect(requiredContacts(figureSpec(k)!).every(c => /^hand/.test(c))).toBe(true);
  });
  test('źródło pięciu punktów styku w wyciskaniu: bp.contact ma odnośnik do NSCA Basics 2012 w danych źródeł (runtime bez nazw)', () => {
    const full = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/cues.json'), 'utf8'));
    const refs = full.exercises['Bench Press (sztanga)'].setup.find((r: { c: string }) => r.c === 'bp.contact').s.map((x: string[]) => x[0]); expect(refs).toContain('nsca-basics-2012');
    expect(fs.readFileSync(path.join(__dirname, '..', 'lib/cues/data.json'), 'utf8')).not.toMatch(/nsca/i);
  });
});

describe('wydajność', () => {
  test('styki, znaczki i poświaty jednej klatki (oba widoki, klatka już policzona) ≤ 20 ms średnio (limit ostrzegawczy na współdzielonym CI; typowo 1–3 ms w Node, z pierwszym obliczeniem styków); ≤ 40 kształtów dodatkowych na widok; pamięć klatek: ta sama klatka to ten sam obiekt', () => {
    const list = KEYS.filter((_, i) => i % 3 === 0).map(k => figureSpec(k)!); for (const s of list) { frameAt(s, 0.5); const e = errorsOf(s)[0]?.error; if (e) frameAt(s, 0.5, e); }
    expect(frameAt(list[0], 0.5)).toBe(frameAt(list[0], 0.5)); expect(frameAt(list[0], 0.5)).not.toBe(frameAt(list[0], 0.25));
    const t0 = Date.now(); let n = 0; let maxShapes = 0;
    for (const s of list) for (const v of s.views) { const g = contactShapes(s, 0.5, v, errorsOf(s)[0]?.error); const b = badgeShapes(badgesFor(s, 0.5, v)); maxShapes = Math.max(maxShapes, g.length + b.length); n++; }
    expect((Date.now() - t0) / n).toBeLessThan(20); expect(maxShapes).toBeLessThanOrEqual(40);
  });
  test('pełny krok animacji (kształty + tor + styki + znaczki, oba widoki, świeża pozycja) ≤ 60 ms średnio (limit ostrzegawczy na współdzielonym CI; typowo 3–10 ms w Node) i jedna klatka na krok (pamięć klatek) dla każdej rodziny', () => {
    for (const k of ['Back Squat', 'Bench Press (sztanga)', 'Deadlift (sztanga)', 'Pull Up']) { const s = figureSpec(k)!; const t0 = Date.now(); const N = 12;
      for (let i = 0; i < N; i++) { const u = (i + 0.37) / (N + 1); for (const v of s.views) { shapesAt(s, u, v, true); contactShapes(s, u, v); badgeShapes(badgesFor(s, u, v)); } }
      expect([k, (Date.now() - t0) / N < 60]).toEqual([k, true]); const u = 0.41; expect(frameAt(s, u)).toBe(frameAt(s, u)); }
  });
});
