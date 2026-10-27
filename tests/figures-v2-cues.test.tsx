/*
 * Figury v2 — wskazówki przypisane przez zestawy na wzorzec ruchu (badacz, 25.10.2026; decyzja właściciela 25.10.2026, wariant A: wskazówki ogólne z dopiskiem
 * „Ogólne wskazówki dla tego ruchu”, przy ćwiczeniach opisanych w źródłach wprost bez dopisku). Rodzaje (docs/20): dane (709 wpisów, liczby trybów, spójność z lib/cues),
 * logika (przełącznik CUE_POLICY), tekst (dopisek PL/EN), strażnik „wskazówka nie przeczy ruchowi” (CUE_REQUIRES dla rodzin gotowych).
 * Uwaga badacza: wskazówkę `mis.jerk` („szarpanie zamiast kontroli”) przy ćwiczeniach-analogiach przejrzeć przy podłączaniu — test pilnuje, że nie trafia do izometrii.
 */
import { CATALOG } from '@/lib/catalog.generated';
import { CUE_DATA } from '@/lib/cues';
import { assignAll, FAMILIES, VARIANTS } from '@/lib/figures/v2';
import { CUE_SETS, CUE_POLICY, CUE_REQUIRES, cueSelection, cueTextGaps, generalCueNote } from '@/lib/figures/v2/cueSets';
import { applyLang, t } from '@/lib/i18n';

const PL: Record<string, string> = require('@/lib/cues/text/pl.json');
const EN: Record<string, string> = require('@/lib/cues/text/en.json');
const KEYS = Object.keys(CATALOG);
afterEach(() => applyLang('pl'));

describe('dane zestawów wskazówek (cue-sets.json)', () => {
  test('709 ćwiczeń: 102 własne, 538 ogólnych (wariant A), 69 otwartych (grafika bez tekstu); własne = dokładnie ćwiczenia z lib/cues/data.json', () => {
    expect(Object.keys(CUE_SETS.items).sort()).toEqual([...KEYS].sort());
    const n = (b: string) => Object.values(CUE_SETS.items).filter(e => e.b === b).length;
    expect([n('own'), n('general'), n('open')]).toEqual([102, 538, 69]);
    expect(Object.keys(CUE_SETS.items).filter(k => CUE_SETS.items[k].b === 'own').sort()).toEqual(Object.keys(CUE_DATA.exercises).sort());
  });
  test('każdy zestaw ogólny ma ≥ 1 zalecenie i rodzinę; identyfikatory istnieją w pl.json albo są na liście newIds (wstrzymane); newIds = identyfikatory bez tekstu', () => {
    const used = new Set<string>();
    for (const [k, e] of Object.entries(CUE_SETS.items)) if (e.b === 'general') { expect([k, (e.ok ?? []).length >= 1, !!e.f]).toEqual([k, true, true]); [...(e.ok ?? []), ...(e.err ?? [])].forEach(i => used.add(i)); }
    const missing = [...used].filter(i => !PL[i]).sort(); expect(missing).toEqual([...CUE_SETS.meta.newIds].sort()); expect(CUE_SETS.meta.newIds).toEqual(['st.tension']); /* 27.10.2026: reszta wdrożona (PL i EN); st.tension wstrzymane — powód w data/zrodla/cues-zestawy.json */
  });
});

describe('przełącznik w danych (CUE_POLICY) i dopisek', () => {
  test('wariant A (decyzja właściciela 25.10.2026): ogólne przy analogiach, własne bez zestawu ogólnego, otwarte bez wskazówek; wariant B: tylko własne', () => {
    expect(CUE_POLICY).toBe('A');
    const g = cueSelection('Box Squat'); expect(g.mode).toBe('general'); expect(g.ok).toEqual(['sq.back', 'sq.kneesToes', 'sq.down']); expect(g.err).toContain('sq.mis.kneesIn');
    expect(cueSelection('Back Squat').mode).toBe('own'); expect(cueSelection('Back Squat').ok).toEqual([]);
    const open = KEYS.find(k => CUE_SETS.items[k].b === 'open')!; expect(cueSelection(open).mode).toBe('none');
    expect(cueSelection('Box Squat', 'B').mode).toBe('none'); expect(cueSelection('Back Squat', 'B').mode).toBe('own'); expect(cueSelection('Nie ma takiego').mode).toBe('none');
  });
  test('dopisek „Ogólne wskazówki dla tego ruchu” tylko przy zestawie ogólnym; PL i EN', () => {
    expect(generalCueNote(cueSelection('Box Squat'))).toBe('Ogólne wskazówki dla tego ruchu');
    expect(generalCueNote(cueSelection('Back Squat'))).toBeNull(); expect(generalCueNote(cueSelection('Nie ma takiego'))).toBeNull();
    applyLang('en'); expect(t('Ogólne wskazówki dla tego ruchu')).toBe('General tips for this movement');
  });
});

describe('strażnik: wskazówka przypisana do ćwiczenia nie przeczy jego ruchowi', () => {
  const READY = Object.entries(assignAll()).filter(([, f]) => ['squat', 'bench_press', 'hinge'].includes(f)).map(([k]) => k);
  test('dla 87 ćwiczeń gotowych rodzin każda wskazówka z warunkiem (CUE_REQUIRES) pasuje do wariantu rysunku (np. „bar z podłogi” nie trafia do RDL, „stopy na podłodze” nie do ujemnej ławki)', () => {
    const bad: string[] = [];
    for (const k of READY) { const sel = cueSelection(k); for (const id of [...sel.ok, ...sel.err]) { const r = CUE_REQUIRES[id]; if (r && !r.ok(VARIANTS[k])) bad.push(`${k}: ${id} (${r.why})`); } }
    expect(bad).toEqual([]);
  });
  test('warunki mają powód i działają: wskazówka „z podłogi” odrzuca RDL, „kolana w linii palców” odrzuca siad przy ścianie, „głowa, łopatki, biodra na ławce” odrzuca wyciskanie z podłogi i ujemną', () => {
    for (const r of Object.values(CUE_REQUIRES)) expect(r.why.length).toBeGreaterThan(10);
    expect(CUE_REQUIRES['dl.lift'].ok(VARIANTS['RDL (sztanga)'])).toBe(false); expect(CUE_REQUIRES['dl.lift'].ok(VARIANTS['Deadlift (sztanga)'])).toBe(true);
    expect(CUE_REQUIRES['sq.kneesToes'].ok(VARIANTS['Wall Sit'])).toBe(false); expect(CUE_REQUIRES['bp.contact'].ok(VARIANTS['Floor Press (sztanga)'])).toBe(false);
    expect(CUE_REQUIRES['bp.contact'].ok(VARIANTS['Decline Bench Press'])).toBe(false); expect(CUE_REQUIRES['bp.contact'].ok(VARIANTS['Bench Press (sztanga)'])).toBe(true);
    expect(CUE_REQUIRES['sumo.kneesOut'].ok(VARIANTS['Deadlift (sztanga)'])).toBe(false); expect(CUE_REQUIRES['rdl.knees'].ok(VARIANTS['Single Leg RDL (hantel)'])).toBe(false);
    expect(CUE_REQUIRES['tb.lift'].ok(VARIANTS['Trap Bar Deadlift'])).toBe(true); expect(CUE_REQUIRES['dl.close'].ok(VARIANTS['Trap Bar Deadlift'])).toBe(false); expect(CUE_REQUIRES['gm.move'].ok(VARIANTS['Good Morning'])).toBe(true);
    expect(CUE_REQUIRES['rdl.move'].ok(VARIANTS['Cable Pull Through'])).toBe(true); expect(CUE_REQUIRES['rdl.depth'].ok(VARIANTS['Deadlift (sztanga)'])).toBe(false); expect(CUE_REQUIRES['sq.mis.heels'].ok(VARIANTS['Back Squat'])).toBe(true); expect(CUE_REQUIRES['sq.mis.kneesIn'].ok(VARIANTS['Bench Press (sztanga)'])).toBe(false);
  });
  test('„szarpanie zamiast kontroli” (mis.jerk) nie trafia do ćwiczeń statycznych (izometria) ani do wspomnianych w uwadze badacza bez przeglądu: lista ćwiczeń z mis.jerk w gotowych rodzinach jest znana', () => {
    const withJerk = READY.filter(k => [...cueSelection(k).err].includes('mis.jerk')).sort();
    expect(withJerk).toEqual(['Decline Close-Grip Bench To Skull Crusher', 'Floor Press (hantle)', 'Floor Press (sztanga)', 'Floor Press with Chains', 'One-Arm Kettlebell Floor Press']);
    expect(READY.filter(k => VARIANTS[k].family === 'squat' && (VARIANTS[k] as { static?: boolean }).static && cueSelection(k).err.includes('mis.jerk'))).toEqual([]);
  });
});

describe('strażnik: rodzina gotowa (ready) nie używa identyfikatora wskazówki bez tekstu PL i EN (recenzja treści 1.1, S1: karta pomijała je po cichu albo pokazywała surowe id)', () => {
  test('rodziny ze statusem ready w kodzie: każde id zestawów (ok i err) ma tekst w pl.json i en.json', () => {
    expect(cueTextGaps(FAMILIES, PL, EN)).toEqual([]);
  });
  test('fixture: rodzina z brakami ustawiona na ready jest czerwona (lista „ćwiczenie: id (język)”), a po dopisaniu tekstów zielona', () => {
    const forearm = Object.entries(assignAll()).filter(([, f]) => f === 'forearm').map(([k]) => k);
    const ids = new Set<string>(); for (const k of forearm) { const c = cueSelection(k); [...c.ok, ...c.err].forEach(i => ids.add(i)); }
    const withoutWr = (d: Record<string, string>) => Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith('wr.')));
    const asReady = FAMILIES.map(f => (f.id === 'forearm' ? { ...f, status: 'ready' as const } : f));
    expect(ids.has('wr.forearms')).toBe(true);
    const red = cueTextGaps(asReady, withoutWr(PL), withoutWr(EN));
    expect(red.some(x => x.includes('wr.forearms (pl)')) && red.some(x => x.includes('wr.forearms (en)'))).toBe(true);
    expect(cueTextGaps(asReady, PL, withoutWr(EN)).every(x => x.endsWith('(en)'))).toBe(true);
    expect(cueTextGaps(asReady, PL, EN)).toEqual([]);
    /* rodzina planned z brakami nie blokuje (strażnik dotyczy tylko ready) */
    expect(cueTextGaps(FAMILIES.map(f => (f.id === 'forearm' ? { ...f, status: 'planned' as const } : f)), withoutWr(PL), withoutWr(EN)).filter(x => x.includes('wr.'))).toEqual([]);
  });
  test('id w zestawach ogólnych bez tekstu to wyłącznie lista newIds (nic nie znika po cichu): ids z pl.json + newIds = wszystkie użyte', () => {
    const used = new Set<string>(); for (const e of Object.values(CUE_SETS.items)) [...(e.ok ?? []), ...(e.err ?? [])].forEach(i => used.add(i));
    expect([...used].filter(i => !PL[i] && !CUE_SETS.meta.newIds.includes(i))).toEqual([]);
  });
});

describe('B3 (recenzja treści 1.1): wskazówka o zakresie opuszczania nie mówi „gryf” przy hantlach i gumie', () => {
  test('Skullcrusher (hantle), Decline Dumbbell Triceps Extension i Band Skull Crusher dostają zdanie neutralne sprzętowo (skull.depthFree: „dłonie”); ćwiczenia z gryfem zostają przy skull.depth', () => {
    for (const k of ['Skullcrusher (hantle)', 'Decline Dumbbell Triceps Extension', 'Band Skull Crusher']) { const c = cueSelection(k); expect([k, c.ok.includes('skull.depthFree'), c.ok.includes('skull.depth')]).toEqual([k, true, false]); }
    for (const k of ['Skullcrusher (sztanga)', 'Decline EZ Bar Triceps Extension']) expect([k, cueSelection(k).ok.includes('skull.depth')]).toEqual([k, true]);
    expect(PL['skull.depthFree']).not.toMatch(/gryf|sztang/i); expect(EN['skull.depthFree']).not.toMatch(/\bbar\b/i);
  });
});

describe('Upright Row (badacz 27.10.2026): wysokość dotyczy łokci (ur.height zamiast dwuznacznego lat.height)', () => {
  test('7 ćwiczeń rodziny uprightRow ma ur.elbows + ur.height, bez lat.height; Straight Raises on Incline Bench zachowuje lat.height', () => {
    const ur = Object.entries(CUE_SETS.items).filter(([, e]) => e.f === 'uprightRow'); expect(ur.length).toBe(7);
    for (const [k, e] of ur) expect([k, e.ok]).toEqual([k, ['ur.elbows', 'ur.height']]);
    expect(PL['ur.height']).toMatch(/łokci/); expect(EN['ur.height']).toMatch(/elbows/);
    expect(cueSelection('Straight Raises on Incline Bench').ok).toContain('lat.height');
  });
});
