/*
 * Wyjątki bramki 4 w linii 1.1 (scalenie main 28.10.2026, decyzja agenta G6g z 29.10.2026 w docs/18; CLAUDE.md „Animacje i karty ćwiczeń — audyt dogłębny”): tests/recenzja-wyjatki-1-1.json wymienia rysunki i zestawy
 * wskazówek, których wpis recenzji z 1.0 nie pasuje do 1.1 albo nie istnieje. Strażnik pilnuje trzech rzeczy: (1) wyjątek jest prawdziwy (skrót niezgodny albo brak wpisu —
 * po nowej recenzji pozycja musi zniknąć z listy), (2) pozycja jest NIEWIDOCZNA w aplikacji (fail-closed: lista v2 i figury v1 w lib/figures/data.json, lista general w lib/cues/data.json),
 * (3) żadna rodzina v2 rysowana w aplikacji nie jest na liście wyjątków. Rodzaje (docs/20): dane (wykaz), niezmienniki (wyjątek ⇒ ukryte), regresja (wyjątek nieaktualny — czerwony).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { FIG_DATA } from '@/lib/figures';
import { CUE_DATA } from '@/lib/cues';
import { FAMILIES, assignAll, figureSpec, shownFigureSpec } from '@/lib/figures/v2';
import { familyReviewed, figureWithheld } from '@/lib/figures/v2/figure';

const root = path.join(__dirname, '..');
const WYJ = JSON.parse(fs.readFileSync(path.join(root, 'tests/recenzja-wyjatki-1-1.json'), 'utf8')) as { powod: string; v1: string[]; v2: string[]; zestawy_zmienione: string[]; zestawy_bez_wpisu: string[]; karty_zmienione?: string[]; karty_nowe?: string[] };
const REC = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8')) as { v1: Record<string, { sha: string }>; v2: Record<string, { sha: string }>; zestawy?: Record<string, { sha: string }>; karty?: Record<string, { sha: string }> };
const NOW = JSON.parse(execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--skroty'], { encoding: 'utf8' })) as { v1: Record<string, string>; v2: Record<string, string>; zestawy: Record<string, string>; karty: Record<string, string> };

describe('wyjątki bramki 4 linii 1.1 (recenzja-wyjatki-1-1.json)', () => {
  test('powód zapisany; listy bez duplikatów', () => {
    expect(WYJ.powod).toMatch(/scalenie main 28\.10\.2026/);
    for (const l of [WYJ.v1, WYJ.v2, WYJ.zestawy_zmienione, WYJ.zestawy_bez_wpisu]) expect(new Set(l).size).toBe(l.length);
  });
  test('figury v1: wyjątek = wpis ze skrótem niezgodnym z bieżącym; figury nie ma w pliku runtime (nie renderuje się)', () => {
    for (const k of WYJ.v1) expect([k, !!REC.v1[k], REC.v1[k]?.sha !== NOW.v1[k], k in FIG_DATA.exercises]).toEqual([k, true, true, false]);
  });
  test('rodziny v2: wyjątek = brak wpisu albo skrót niezgodny; rodziny nie ma na liście rysowanych, a jej ćwiczenia nie mają pokazywanej figury', () => {
    const all = assignAll();
    for (const f of WYJ.v2) {
      expect([f, FAMILIES.some(x => x.id === f && x.status === 'ready'), !REC.v2[f] || REC.v2[f].sha !== NOW.v2[f], FIG_DATA.v2.includes(f)]).toEqual([f, true, true, false]);
      for (const [k, fam] of Object.entries(all)) if (fam === f) expect([k, shownFigureSpec(k)]).toEqual([k, null]);
    }
  });
  test('rodziny rysowane w aplikacji (lista v2) nie są wyjątkami i mają aktualny wpis', () => {
    for (const f of FIG_DATA.v2) expect([f, WYJ.v2.includes(f), REC.v2[f]?.sha === NOW.v2[f]]).toEqual([f, false, true]);
  });
  test('zestawy ogólne: zmienione po recenzji i bez wpisu — poza listą general (ekran ich nie pokazuje)', () => {
    for (const k of WYJ.zestawy_zmienione) expect([k, !!REC.zestawy?.[k], REC.zestawy?.[k]?.sha !== NOW.zestawy[k], CUE_DATA.general.includes(k)]).toEqual([k, true, true, false]);
    for (const k of WYJ.zestawy_bez_wpisu) expect([k, !!REC.zestawy?.[k], CUE_DATA.general.includes(k)]).toEqual([k, false, false]);
  });
  test('karty własne zmienione po recenzji (04.11.2026, spójność karty z rysunkiem): wyjątek = wpis ze skrótem niezgodnym z bieżącym; karta na liście „hidden” (ekran jej nie pokazuje do recenzji niezależnej)', () => {
    for (const k of WYJ.karty_zmienione ?? []) expect([k, !!REC.karty?.[k], REC.karty?.[k]?.sha !== NOW.karty[k], (CUE_DATA as typeof CUE_DATA & { hidden: string[] }).hidden.includes(k), k in CUE_DATA.exercises]).toEqual([k, true, true, true, false]);
  });
  /* 08.11.2026 (decyzja koordynatora w nocy 08/09.11 z upoważnienia właściciela — do weta rano; partie A1 i A2): karta własna ukryta czeka na recenzję niezależną (L-047) albo, po recenzji, na przekład zdań */
  const kartaNowaOk = (k: string, full: Record<string, unknown>, rec: typeof REC, hidden: string[], runtime: Record<string, unknown>) =>
    [!!rec.karty?.[k] && (rec.karty[k] as { werdykt?: string }).werdykt === 'wyswietlana', k in full, hidden.includes(k), k in runtime];
  test('karty_nowe (08.11.2026): karta w pełnych danych, na liście „hidden”, nie w runtime i bez wpisu „wyswietlana” (powód: czeka na recenzję albo po recenzji na przekład); wpis „wyswietlana” ⇒ pozycję usunąć', () => {
    const full = (JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/cues.json'), 'utf8')) as { exercises: Record<string, unknown> }).exercises;
    const l = WYJ.karty_nowe ?? [], hidden = (CUE_DATA as typeof CUE_DATA & { hidden: string[] }).hidden;
    expect(new Set(l).size).toBe(l.length);
    for (const k of l) expect([k, ...kartaNowaOk(k, full, REC, hidden, CUE_DATA.exercises)]).toEqual([k, false, true, true, false]);
  });
  test('karty_nowe — zapadka (08.11.2026): symulowany wpis „wyswietlana” albo karta widoczna w runtime czerwieni warunek', () => {
    const rec = { ...REC, karty: { X: { werdykt: 'wyswietlana', sha: 'a' } } } as unknown as typeof REC;
    expect(kartaNowaOk('X', { X: {} }, rec, ['X'], {})).toEqual([true, true, true, false]);
    expect(kartaNowaOk('X', { X: {} }, { ...REC, karty: { X: { werdykt: 'czeka na przekład', sha: 'a' } } } as unknown as typeof REC, ['X'], {})).toEqual([false, true, true, false]);
    expect(kartaNowaOk('X', { X: {} }, REC, [], { X: {} })).toEqual([false, true, false, true]);
  });
  test('familyReviewed / shownFigureSpec: rodzina bez aktualnej recenzji — silnik liczy figurę (figureSpec), aplikacja jej nie pokazuje', () => {
    for (const f of WYJ.v2) expect([f, familyReviewed(f)]).toEqual([f, false]);
    expect(familyReviewed('rodzina_nieistniejaca')).toBe(false);
    expect(figureSpec('Chin Up')).not.toBeNull();
    expect(shownFigureSpec('Chin Up')).not.toBeNull(); /* pull_up z aktualnym wpisem od 02.11.2026 (decyzja właściciela C) */
    /* rodzina bez aktualnego wpisu (symulacja: pull_up zdjęta z listy runtime) — silnik nadal liczy figurę, aplikacja jej nie pokazuje */
    const lista = FIG_DATA.v2 as string[];
    const spy = jest.spyOn(lista, 'includes').mockImplementation((x: string) => x !== 'pull_up' && Array.prototype.indexOf.call(lista, x) >= 0);
    try { expect(familyReviewed('pull_up')).toBe(false); expect(figureSpec('Chin Up')).not.toBeNull(); expect(shownFigureSpec('Chin Up')).toBeNull(); }
    finally { spy.mockRestore(); }
    /* squat po recenzji różnicy 01.11.2026 (decyzja właściciela X); 09.11.2026 (koordynator, wariant A, partia P1): squat i hinge na liście v2 do recenzji różnicy doboru — figura ukryta, po zdjęciu wyjątku znów pokazana */
    expect([WYJ.v2.includes('squat'), shownFigureSpec('Back Squat') === null]).toEqual([WYJ.v2.includes('squat'), WYJ.v2.includes('squat')]);
  });
  test('figureWithheld: figura v1 „zastąpiona” wstrzymana dokładnie wtedy, gdy jej rodzina v2 nie ma aktualnej recenzji; od 01.11.2026 (squat, bench_press, hinge zrecenzowane) Back Squat i Deadlift pokazują v2; v1 „wyswietlana” (Pull Up) i ćwiczenie bez v2 (Crunch) — bez wstrzymania', () => {
    expect(FIG_DATA.replaced).toContain('Back Squat');
    for (const k of FIG_DATA.replaced) expect([k, figureWithheld(k)]).toEqual([k, !familyReviewed(figureSpec(k)!.family)]);
    expect([figureWithheld('Back Squat'), figureWithheld('Deadlift (sztanga)')]).toEqual([WYJ.v2.includes('squat'), WYJ.v2.includes('hinge')]); /* 09.11.2026 (P1): wstrzymane, dopóki squat/hinge są na liście v2 (recenzja różnicy doboru) */
    expect([figureWithheld('Pull Up'), figureWithheld('Crunch'), figureWithheld('Ćwiczenie własne')]).toEqual([false, false, false]);
  });
});

describe('generator (scripts/zrodla-runtime.mjs): lista rodzin v2 i figury „zastąpione” zależą od aktualnej recenzji', () => {
  const run = (mutate: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { buildFigures, rodzinyZAktualnaRecenzja, rodzinaSkrot, recenzja } from ${JSON.stringify(path.join(root, 'scripts/zrodla-runtime.mjs'))};
    import { readFileSync } from 'node:fs';
    const full = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'data/zrodla/figures.json'))}, 'utf8'));
    const rec = recenzja();
    ${mutate}
    const out = buildFigures(full, rec);
    console.log(JSON.stringify({ v2: out.v2, deadlift: 'Deadlift (sztanga)' in out.exercises, fam: rodzinyZAktualnaRecenzja(rec) }));`], { encoding: 'utf8' }));
  test('bieżący stan (02.11.2026): squat, bench_press, hinge (recenzja różnicy po poprawce styków, decyzja X) i pull_up (decyzja właściciela C) z aktualnym wpisem; figura v1 „zastąpiona” (Deadlift (sztanga)) zostaje w pliku runtime (testy silnika v1); 09.11.2026: + calf_raise (partia 1, recenzja r2 audytora)', () => {
    /* 03.11.2026: curl ma wpis r3 (audytor) ze skrótem niepodłączonej rodziny (status planned, bez poseData) — lista runtime go zawiera, ale ćwiczenia curl nie mają figury, dopóki rodzina nie zostanie podłączona (podłączenie zmienia pliki wspólne, więc skróty i recenzje wszystkich rodzin) */
    /* 05.11.2026: olympic z wpisem r5 (audytor); triceps — wpis r5 (audytor, potwierdzenie po scaleniu T1b z integracją) */
    /* 09.11.2026: calf_raise z wpisem r2 (audytor, partia 1; docs/research/recenzje/partia1-calf_raise-r2.json); 10.11.2026 (scalenie): hip_bridge — wpis r2 (audytor, partia 2; Machine Hip Thrust wstrzymany) i cable_row — wpis r2 (audytor, partia 2); 10.11.2026: + overhead_press — wpis r3 (audytor, partia 1); kolejność = kolejność wpisów v2 w figury-recenzja.json po scaleniu */ /* 10.11.2026 (scalenie z integracją): suma — partia 3 (shrug, pulldown, hip_abd_add, leg_machine) + partia 1 (calf_raise, row, chest_fly, overhead_press); lunge i leg_isolation (B2) bez skrótu runtime */
    /* 09.11.2026: delt_raise z wpisem v2 (audytor, Car Drivers po r5-W1/r5-Ś1) ze skrótem niepodłączonej rodziny (status planned, bez poseData) — jak curl: na liście runtime, bez figur, dopóki rodzina nie zostanie podłączona; hip_bridge — wpis r2 (audytor, partia 2; Machine Hip Thrust wstrzymany); cable_row — wpis r2 (audytor, partia 2); kolejność = kolejność wpisów v2 w figury-recenzja.json po scaleniu partii 2 z integracją */
    /* 09.11.2026: lunge i leg_isolation — wpisy audytora (partia B2) są w pliku recenzji, ale rodziny planned bez rysunku nie mają skrótu z wyniku rysunku (decyzja właściciela 09.11.2026, wariant A), więc nie ma ich na liście runtime do czasu podłączenia (osobna decyzja) */
    /* 09.11.2026 (partia 3): shrug, pulldown, hip_abd_add, leg_machine z wpisami v2 po recenzjach niezależnych; 10.11.2026 (partia 2): pushup_plank, mobility_floor i mobility_stand — wpisy r2 (audytor); 10.11.2026 (partia 7): core_floor i glute_floor — wpisy r2 (audytor) */
    /* 10.11.2026 (partia 4): dip (recenzja r4), chest_press_machine (r2), cable_press, back_extension, thruster (r2) — wpisy v2 audytora, rodziny podłączone */
    expect(run('')).toEqual({ v2: ['squat', 'bench_press', 'hinge', 'pull_up', 'curl', 'olympic', 'triceps', 'hip_bridge', 'cable_row', 'delt_raise', 'carry', 'core_hang', 'forearm', 'kneeling_hinge', 'shrug', 'pulldown', 'hip_abd_add', 'leg_machine', 'rotator_cuff', 'calf_raise', 'row', 'chest_fly', 'overhead_press', 'kb_ballistic', 'dip', 'chest_press_machine', 'cable_press', 'back_extension', 'thruster', 'pushup_plank', 'mobility_floor', 'mobility_stand', 'core_floor', 'glute_floor'], deadlift: true, fam: ['squat', 'bench_press', 'hinge', 'pull_up', 'curl', 'olympic', 'triceps', 'hip_bridge', 'cable_row', 'delt_raise', 'carry', 'core_hang', 'forearm', 'kneeling_hinge', 'shrug', 'pulldown', 'hip_abd_add', 'leg_machine', 'rotator_cuff', 'calf_raise', 'row', 'chest_fly', 'overhead_press', 'kb_ballistic', 'dip', 'chest_press_machine', 'cable_press', 'back_extension', 'thruster', 'pushup_plank', 'mobility_floor', 'mobility_stand', 'core_floor', 'glute_floor'] }); /* 10.11.2026: + kb_ballistic — wpis r4 (audytor, partia 1); 10.11.2026 (sesja B, scalenie partii 5): + carry, core_hang, forearm, kneeling_hinge, rotator_cuff — kolejność = kolejność kluczy v2 w figury-recenzja.json */ /* 10.11.2026 (partia 7, scalenie integracji 649b0504): + core_floor, glute_floor (recenzja r2 wyswietlana) */
  });
  test('wpis rodziny hinge z bieżącym skrótem: rodzina na liście, figura v1 „zastąpiona” zostaje w pliku runtime; zły skrót — rodzina znika', () => {
    const tylko = "for (const f of Object.keys(rec.v2)) if (f !== 'hinge') delete rec.v2[f];";
    expect(run(tylko + "rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'wyswietlana', sha: rodzinaSkrot('hinge') };")).toEqual({ v2: ['hinge'], deadlift: true, fam: ['hinge'] });
    expect(run(tylko + "rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'wyswietlana', sha: '000000000000' };").v2).toEqual([]);
    expect(run(tylko + "rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'ukryta', sha: rodzinaSkrot('hinge') };").v2).toEqual([]);
  });
});
