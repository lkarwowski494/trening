/*
 * „Strażnik progresji” — logika (lib/guard.ts; specyfikacja zatwierdzona przez właściciela 14.10.2026, docs/18). Rodzaje (docs/20): logika (każdy stan kierunku,
 * deload bieżący i poprzedni, z planem i bez, „≥”, masa ciała, FBW raz vs dwa razy, tonaż↓ ciężar↑, ćwiczenie nowe), niezmienniki (zgodność serii z compare('week'),
 * serie pośrednie po SECONDARY_SHARE), dane (usunięte ćwiczenie, rozgrzewki, drop set, kg/lb, ręczny cel), teksty (zdania na ekranie Trening i etykieta VoiceOver).
 * Tydzień bieżący: czwartek 8.10.2026 (pon 5 … nd 11); poprzedni: 28.09–4.10; sprzed dwóch tygodni: 21–27.09.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { progressGuard, guardCached, guardTexts, guardWord, GUARD_DELOAD_LOOKBACK_WEEKS, type Guard, type GuardPart } from '@/lib/guard';
import { applyLang, LANGS } from '@/lib/i18n';
import { compare } from '@/lib/progress';
import { SECONDARY_SHARE } from '@/lib/setSplit';
import { thisMonday } from '@/lib/stats';
import { MUSCLES, uid, type Template, type TRow, type SetKind } from '@/lib/seed';
import { applyUnit } from '@/lib/units';
import { fresh, addWorkout, ex } from './helpers';

const NOW = new Date(2026, 9, 8, 9); /* czwartek */
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const SQ = 'Back Squat'; const BP = 'Bench Press (sztanga)'; const CURL = 'Barbell Curl'; const LC = 'Leg Curl'; const HA = 'Hip Adduction'; const PU = 'Push Up'; const PL = 'Plank';
const sets = (n: number, weight: number, reps: number) => Array.from({ length: n }, () => ({ weight, reps }));
const row = (reps: number | '', weight: number | '', kind: SetKind = 'normal'): TRow => ({ id: uid(), kind, reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, ...blocks: [string, TRow[]][]): Template {
  const t = store.newTemplate(); t.name = name;
  t.items = blocks.map(([n, rows]) => ({ id: uid(), exerciseId: ex(n).id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }));
  store.save(); return t;
}
const setPlan = (days: Record<number, Template>) => { jest.setSystemTime(at(9, 5, 6)); for (const [i, t] of Object.entries(days)) plan.setWeekDay(Number(i), t.id); jest.setSystemTime(NOW); };
const G = (offset = 0) => progressGuard(NOW.getTime(), offset);
const part = (g: Guard, p: string): GuardPart => g.parts.find(x => x.part === p)!;
/* poprzedni tydzień: wt 29.09 / czw 1.10; bieżący: wt 6.10 */
const PREV = (ename: string, s: { weight: number; reps: number }[], day = 1) => addWorkout(at(9, day), [[ename, s]], 'p');
const CUR = (ename: string, s: { weight: number; reps: number }[], day = 6) => addWorkout(at(9, day), [[ename, s]], 'c');
const mondayTs = (offset: number) => thisMonday(offset, NOW);

beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); applyUnit('kg'); });
afterEach(() => { jest.useRealTimers(); applyUnit('kg'); });

describe('progressGuard: kierunek partii (każdy stan)', () => {
  test('więcej / tyle samo / mniej według tonażu ćwiczenia powtórzonego w obu tygodniach (cel 3×5: 100 → 110 / 100 / 90 kg)', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 110, 5)); const up = part(G(), 'czworogłowe');
    expect(up.dir).toBe('up'); expect(up.tonnage).toEqual({ now: 1650, before: 1500, dir: 'up' }); expect(up.byWeight).toBe(false); expect(up.compared).toHaveLength(1); expect(up.skipped).toEqual([]);
  });
  test('tyle samo: ten sam tonaż; mniej: niższy tonaż bez wzrostu ciężaru', async () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 100, 5)); expect(part(G(), 'czworogłowe')).toMatchObject({ dir: 'same', tonnage: { now: 1500, before: 1500, dir: 'same' } });
    await fresh(); PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 90, 5)); expect(part(G(), 'czworogłowe')).toMatchObject({ dir: 'down', byWeight: false, tonnage: { now: 1350, before: 1500, dir: 'down' } });
    await fresh(); PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(2, 100, 5)); expect(part(G(), 'czworogłowe').dir).toBe('down'); /* mniej serii przy tym samym ciężarze */
  });
  test('„tyle samo” = równe po zaokrągleniu do wyświetlanej liczby (kg całe): 1500 kg vs 1500,4 kg tak, 1500 vs 1501 nie', async () => {
    PREV(SQ, [{ weight: 100, reps: 15 }]); CUR(SQ, [{ weight: 100.02, reps: 15 }]); expect(part(G(), 'czworogłowe').dir).toBe('same'); /* 1500,3 kg */
    await fresh(); PREV(SQ, [{ weight: 100, reps: 15 }]); CUR(SQ, [{ weight: 100.2, reps: 15 }]); expect(part(G(), 'czworogłowe').dir).toBe('up'); /* 1503 kg */
  });
  test('lb: ciężary 100 i 100,02 kg pokazują się tak samo (220,5 lb) → tyle samo; 100,5 kg (221,6 lb) → więcej', async () => {
    applyUnit('lb'); PREV(SQ, [{ weight: 100, reps: 10 }]); CUR(SQ, [{ weight: 100.02, reps: 10 }]); expect(part(G(), 'czworogłowe').dir).toBe('same');
    await fresh(); applyUnit('lb'); PREV(SQ, [{ weight: 100, reps: 10 }]); CUR(SQ, [{ weight: 100.5, reps: 10 }]); expect(part(G(), 'czworogłowe').dir).toBe('up'); applyUnit('kg');
  });
  test('bez serii: partia bez serii i bez planu (łydki) → none, nie wchodzi do listy braków; trenowana bez poprzedniego tygodnia → new', () => {
    CUR(SQ, sets(3, 100, 5)); const g = G(); expect(part(g, 'łydki').dir).toBe('none'); expect(part(g, 'łydki').belowGoal).toBe(false); expect(g.below.map(p => p.part)).not.toContain('łydki');
    expect(g.hasPrev).toBe(false); expect(part(g, 'czworogłowe').dir).toBe('new'); expect(part(g, 'czworogłowe').tonnage).toBeNull(); expect(g.less).toEqual([]);
  });
  test('partia z seriami tylko w poprzednim tygodniu (nic teraz, nic w planie) → none (○), nie „mniej”', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(BP, sets(3, 60, 8)); expect(part(G(), 'czworogłowe')).toMatchObject({ dir: 'none', total: 0 });
  });
  test('brak wspólnych ćwiczeń (inne ćwiczenie na tę samą partię) → ? (unknown)', () => {
    PREV(SQ, sets(3, 100, 5)); CUR('Hip Thrust (sztanga)', sets(3, 100, 8)); const p = part(G(), 'pośladki'); /* squat: pośladki pomocnicze, hip thrust: główne */
    expect(p.dir).toBe('unknown'); expect(p.compared).toEqual([]); expect(p.skipped.map(s => s.reason).sort()).toEqual(['onlyBefore', 'onlyNow']);
  });
});

describe('progressGuard: ćwiczenia wykluczone z obu tygodni (decyzja właściciela)', () => {
  test('ćwiczenie nowe w tym tygodniu i ćwiczenie nierobione teraz są pominięte; kierunek liczy tylko wspólne', () => {
    PREV(BP, sets(3, 60, 8)); PREV('Seated Cable Chest Press', sets(3, 40, 10), 3); /* poprzednio: sztanga + wyciąg */
    CUR(BP, sets(3, 65, 8)); CUR('Bench Press (hantle)', sets(3, 30, 10), 7); /* teraz: sztanga + hantle (nowe) */
    const k = part(G(), 'klatka'); expect(k.dir).toBe('up'); expect(k.compared.map(c => c.exerciseId)).toEqual([ex(BP).id]);
    expect(k.skipped).toEqual(expect.arrayContaining([{ exerciseId: ex('Bench Press (hantle)').id, reason: 'onlyNow' }, { exerciseId: ex('Seated Cable Chest Press').id, reason: 'onlyBefore' }]));
    expect(k.tonnage).toEqual({ now: 3 * 65 * 8, before: 3 * 60 * 8, dir: 'up' }); /* hantle i wyciąg nie zawyżają ani nie zaniżają */
  });
  test('masa ciała bez dociążenia (tonaż 0) → pominięte jako noWeight; sama pompka na klatkę → ?; z wyciskaniem → liczy się tylko wyciskanie', () => {
    PREV(PU, sets(3, 0, 12)); CUR(PU, sets(3, 0, 15)); const p = part(G(), 'klatka'); expect(p.dir).toBe('unknown'); expect(p.skipped).toEqual([{ exerciseId: ex(PU).id, reason: 'noWeight' }]);
  });
  test('masa ciała bez dociążenia obok wyciskania: wyciskanie decyduje, pompki pominięte', () => {
    PREV(PU, sets(3, 0, 12)); PREV(BP, sets(3, 60, 8), 3); CUR(PU, sets(3, 0, 15)); CUR(BP, sets(3, 50, 8), 7); const p = part(G(), 'klatka');
    expect(p.dir).toBe('down'); expect(p.compared).toHaveLength(1); expect(p.skipped).toEqual([{ exerciseId: ex(PU).id, reason: 'noWeight' }]);
  });
  test('masa ciała z dociążeniem (addKg) ma tonaż i jest porównywana; ćwiczenie na czas (plank) bez tonażu → noWeight', () => {
    const pu = (kg: number) => [{ addKg: kg, reps: 10 }]; addWorkout(at(9, 1), [[PU, pu(5)]], 'p'); addWorkout(at(9, 6), [[PU, pu(10)]], 'c');
    expect(part(G(), 'klatka')).toMatchObject({ dir: 'up', tonnage: { now: 100, before: 50 } });
  });
  test('ćwiczenie na czas: serie liczą się do celu, ale kierunek partii core → ? (noWeight)', () => {
    addWorkout(at(9, 1), [[PL, [{ durationSec: 60 }, { durationSec: 60 }]]], 'p'); addWorkout(at(9, 6), [[PL, [{ durationSec: 90 }]]], 'c'); const c = part(G(), 'core');
    expect(c.total).toBe(1); expect(c.dir).toBe('unknown'); expect(c.skipped).toEqual([{ exerciseId: ex(PL).id, reason: 'noWeight' }]);
  });
  test('plan bez ciężaru i powtórzeń („≥”, brak „Poprzednio”) → ćwiczenie pominięte jako unknownPlan, partia ?', () => {
    addWorkout(at(9, 1), [[LC, [{ weight: '', reps: 10 }]]], 'p'); /* poprzednio bez ciężaru — „Poprzednio” nic nie podpowie */ const t = tpl('A', [LC, [row('', ''), row('', '')]]); setPlan({ 3: t }); /* czwartek dziś */
    const p = part(G(), 'dwugłowe'); expect(p.dir).toBe('unknown'); expect(p.skipped).toEqual([{ exerciseId: ex(LC).id, reason: 'unknownPlan' }]); expect(p.planned.total).toBe(2);
  });
  test('plan bez wartości w szablonie, ale z „Poprzednio” — nie jest nieznany: liczy się tonaż z poprzedniego wykonania', () => {
    PREV(LC, sets(2, 40, 10)); const t = tpl('A', [LC, [row('', ''), row('', '')]]); setPlan({ 3: t });
    const p = part(G(), 'dwugłowe'); expect(p.dir).toBe('same'); expect(p.tonnage).toEqual({ now: 800, before: 800, dir: 'same' });
  });
});

describe('progressGuard: tonaż średnio na sesję ćwiczenia', () => {
  test('FBW raz vs dwa razy: ten sam tonaż na sesję → tyle samo (nie fałszywy progres), mimo dwukrotnego tonażu tygodnia', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 100, 5), 5); CUR(SQ, sets(3, 100, 5), 7);
    const p = part(G(), 'czworogłowe'); expect(p.dir).toBe('same'); expect(p.tonnage).toEqual({ now: 1500, before: 1500, dir: 'same' }); expect(p.compared[0].now.sessions).toBe(2); expect(p.compared[0].before.sessions).toBe(1);
  });
  test('FBW dwa razy w poprzednim, raz teraz: ten sam tonaż na sesję → tyle samo (nie fałszywy spadek)', () => {
    PREV(SQ, sets(3, 100, 5), 0); PREV(SQ, sets(3, 100, 5), 2); CUR(SQ, sets(3, 100, 5)); expect(part(G(), 'czworogłowe').dir).toBe('same');
  });
  test('dwie sesje o różnym tonażu: średnia (1650 + 1350) / 2 = 1500 vs 1500 → tyle samo; słabsza druga sesja → mniej', async () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 110, 5), 5); CUR(SQ, sets(3, 90, 5), 7); expect(part(G(), 'czworogłowe').dir).toBe('same');
    await fresh(); PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 100, 5), 5); CUR(SQ, sets(3, 80, 5), 7); expect(part(G(), 'czworogłowe').dir).toBe('down');
  });
  test('wykonane + plan: jedna sesja zrobiona i jedna zaplanowana liczą się jako dwie sesje', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 100, 5), 6); setPlan({ 3: tpl('A', [SQ, [row(5, 100), row(5, 100), row(5, 100)]]) });
    const c = part(G(), 'czworogłowe').compared[0]; expect(c.now.sessions).toBe(2); expect(c.now.perSession).toBe(1500); expect(part(G(), 'czworogłowe').dir).toBe('same');
  });
  test('dwa bloki tego samego ćwiczenia w jednym treningu to jedna sesja', () => {
    PREV(SQ, sets(3, 100, 5)); addWorkout(at(9, 6), [[SQ, sets(3, 100, 5)], [SQ, sets(3, 100, 5)]], 'c'); const c = part(G(), 'czworogłowe').compared[0];
    expect(c.now.sessions).toBe(1); expect(c.now.perSession).toBe(3000); expect(part(G(), 'czworogłowe').dir).toBe('up');
  });
});

describe('progressGuard: tonaż w dół, ciężar roboczy w górę = progres (decyzja właściciela)', () => {
  test('3×10×100 → 3×5×110: tonaż spadł (3000 → 1650), ciężar wzrósł → partia „więcej”, wiersz tonażu nadal pokazuje spadek', () => {
    PREV(CURL, sets(3, 100, 10)); CUR(CURL, sets(3, 110, 5)); const p = part(G(), 'biceps');
    expect(p.dir).toBe('up'); expect(p.byWeight).toBe(true); expect(p.tonnage).toEqual({ now: 1650, before: 3000, dir: 'down' });
    expect(p.compared[0]).toMatchObject({ dir: 'down', byWeight: true, now: { weight: 110 }, before: { weight: 100 } });
  });
  test('tonaż spadł, ciężar bez zmiany albo niższy → mniej (brak progresu)', async () => {
    PREV(CURL, sets(3, 100, 10)); CUR(CURL, sets(3, 100, 5)); expect(part(G(), 'biceps')).toMatchObject({ dir: 'down', byWeight: false });
    await fresh(); PREV(CURL, sets(3, 100, 10)); CUR(CURL, sets(3, 90, 5)); expect(part(G(), 'biceps')).toMatchObject({ dir: 'down', byWeight: false });
  });
  test('ciężar roboczy = najwyższy ciężar serii roboczych (rozgrzewka nie liczy się)', () => {
    PREV(CURL, sets(3, 100, 10)); addWorkout(at(9, 6), [[CURL, [{ weight: 150, reps: 5, kind: 'warmup', warmup: true }, ...sets(3, 90, 5)]]], 'c'); const p = part(G(), 'biceps');
    expect(p.dir).toBe('down'); expect(p.compared[0].now.weight).toBe(90);
  });
  test('wzrost ciężaru w jednym ćwiczeniu nie ratuje spadku w drugim (partia klatka: wyciskanie ↓ bez wzrostu ciężaru, drugie ćwiczenie ↑ ciężar a ↓ tonaż)', () => {
    PREV(BP, sets(3, 100, 10)); PREV('Bench Press (hantle)', sets(3, 40, 10), 3);
    CUR(BP, sets(3, 100, 5)); CUR('Bench Press (hantle)', sets(3, 45, 5), 7); /* sztanga: −1500 kg bez zmiany ciężaru; hantle: −525 kg, ale ciężar ↑ (efekt 0) */
    expect(part(G(), 'klatka')).toMatchObject({ dir: 'down', byWeight: true });
  });
  test('ćwiczenie z progresem ciężaru + drugie bez zmian → więcej; + drugie wyraźnie w górę → więcej', () => {
    PREV(BP, sets(3, 100, 10)); PREV('Bench Press (hantle)', sets(3, 40, 10), 3);
    CUR(BP, sets(3, 110, 5)); CUR('Bench Press (hantle)', sets(3, 40, 10), 7); expect(part(G(), 'klatka').dir).toBe('up');
  });
});

describe('progressGuard: agregacja ćwiczeń partii (główna 1, pomocnicza 0,5)', () => {
  test('ćwiczenie pomocnicze liczy się z wagą SECONDARY_SHARE: spadek tonażu głównego 100 kg vs wzrost pomocniczego 150 kg (×0,5) → wzrost sumy ważonej', () => {
    PREV(BP, sets(1, 100, 10)); PREV('Overhead Press (sztanga)', sets(1, 100, 10), 3); /* triceps: pomocniczy w obu; barki: główne w OHP */
    CUR(BP, sets(1, 100, 10)); CUR('Overhead Press (sztanga)', sets(1, 130, 10), 7); const t = part(G(), 'triceps');
    expect(t.tonnage).toEqual({ now: SECONDARY_SHARE * 1000 + SECONDARY_SHARE * 1300, before: SECONDARY_SHARE * 2000, dir: 'up' }); expect(t.compared.every(c => c.share === SECONDARY_SHARE)).toBe(true);
  });
  test('partia z jednym ćwiczeniem głównym i jednym pomocniczym: share 1 i 0,5', () => {
    PREV(BP, sets(1, 100, 10)); PREV('Overhead Press (sztanga)', sets(1, 60, 10), 3); CUR(BP, sets(1, 100, 10)); CUR('Overhead Press (sztanga)', sets(1, 60, 10), 7);
    const b = part(G(), 'barki'); expect(b.compared.map(c => [c.exerciseId, c.share]).sort()).toEqual([[ex(BP).id, SECONDARY_SHARE], [ex('Overhead Press (sztanga)').id, 1]].sort());
  });
  test('ćwiczenie usunięte (nie ma w katalogu) z historii nie psuje liczenia i nie jest porównywane', () => {
    PREV(SQ, sets(3, 100, 5)); const w = CUR(SQ, sets(3, 100, 5)); w.exercises.push({ ...w.exercises[0], exerciseId: 'nie-ma-takiego' }); store.save();
    expect(part(G(), 'czworogłowe').dir).toBe('same');
  });
});

describe('progressGuard: serie, cel i braki (z planem i bez)', () => {
  test('serie = wykonane + zaplanowane; pośrednie po 0,5; luka do celu i dni planu (cel automatyczny 10)', () => {
    CUR(SQ, sets(4, 100, 5), 6); /* czworogłowe 4 bezpośrednio, pośladki 2, przywodziciele 2 */
    setPlan({ 3: tpl('A', [SQ, [row(5, 100), row(5, 100), row(5, 100)]]), 5: tpl('B', [HA, [row(10, 30), row(10, 30)]]) }); /* czw: 3 serie przysiadu, sob: 2 serie przywodzenia */
    const g = G(); const cz = part(g, 'czworogłowe'); expect(cz).toMatchObject({ total: 7, gap: 3, goal: 10, belowGoal: true, over: 0 }); expect(cz.done.direct).toBe(4); expect(cz.planned.direct).toBe(3); expect(cz.plannedDays).toEqual(['2026-10-08']);
    const po = part(g, 'pośladki'); expect(po.done.indirectWeighted).toBe(2); expect(po.planned.indirectWeighted).toBe(1.5); expect(po.total).toBe(3.5);
    const pr = part(g, 'przywodziciele'); expect(pr.total).toBe(2 + 1.5 + 2); expect(pr.plannedDays).toEqual(['2026-10-08', '2026-10-10']);
  });
  test('partia dociągająca do celu planem nie jest brakiem; nadmiar ponad cel', () => {
    CUR(BP, sets(6, 60, 8), 6); setPlan({ 3: tpl('A', [BP, [row(8, 60), row(8, 60), row(8, 60), row(8, 60), row(8, 60), row(8, 60)]]) });
    const k = part(G(), 'klatka'); expect(k).toMatchObject({ total: 12, goal: 10, gap: 0, over: 2, belowGoal: false }); expect(G().below.map(p => p.part)).not.toContain('klatka');
  });
  test('cel dokładnie osiągnięty nie jest brakiem (granica: total = cel)', () => {
    CUR(BP, sets(10, 60, 8), 6); expect(part(G(), 'klatka')).toMatchObject({ total: 10, gap: 0, belowGoal: false });
  });
  test('ręczny cel partii z Ustawień zastępuje 10', () => {
    store.getState().settings.weeklySetGoals = { 'dwugłowe': 4 }; store.save(); CUR(LC, sets(3, 40, 10), 6); expect(part(G(), 'dwugłowe')).toMatchObject({ goal: 4, gap: 1, belowGoal: true });
  });
  test('lista braków: największa luka pierwsza, remis wg kolejności MUSCLES; bez planu dalej liczone, hasPlan=false', () => {
    CUR(SQ, sets(4, 100, 5), 6); CUR(LC, sets(3, 40, 10), 5); CUR(CURL, sets(6, 30, 10), 7); const g = G(); /* luki: pośladki 8, przywodziciele 8, dwugłowe 7, czworogłowe 6, biceps 4 */
    expect(g.below.map(p => p.part)).toEqual(['pośladki', 'przywodziciele', 'dwugłowe', 'czworogłowe', 'biceps']); expect(g.below.map(p => p.gap)).toEqual([8, 8, 7, 6, 4]); expect(g.hasPlan).toBe(false);
  });
  test('zgodność z compare(week): serie wykonane i zaplanowane każdej partii takie same jak setRows (jedno źródło liczenia)', () => {
    CUR(SQ, sets(4, 100, 5), 6); PREV(BP, sets(3, 60, 8)); setPlan({ 3: tpl('A', [SQ, [row(5, 100), row(5, 100)]]), 5: tpl('B', [BP, [row(8, 60)]]) });
    const g = G(); const c = compare('week', NOW.getTime());
    for (const m of MUSCLES) { const r = c.setRows.find(x => x.part === m); expect(part(g, m).done.total).toBe(r?.doneSets ?? 0); expect(part(g, m).planned.total).toBe(r?.plannedSets ?? 0); expect(part(g, m).goal).toBe(r?.goal ?? part(g, m).goal); }
    expect(g.parts.map(p => p.part)).toEqual([...MUSCLES]);
  });
  test('rozgrzewki nie liczą się do serii ani tonażu; drop set liczy się razem z serią', () => {
    addWorkout(at(9, 6), [[SQ, [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }, { weight: 100, reps: 5 }, { weight: 70, reps: 8, kind: 'drop' }]]], 'c'); PREV(SQ, [{ weight: 100, reps: 5 }]);
    const p = part(G(), 'czworogłowe'); expect(p.done.direct).toBe(1); expect(p.tonnage).toEqual({ now: 500 + 560, before: 500, dir: 'up' });
  });
});

describe('progressGuard: deload', () => {
  test('tydzień bieżący oznaczony jako deload: trenowane partie → deload, brak listy braków i spadków, nieoznaczone → none', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(1, 60, 5)); store.toggleDeloadWeek(NOW.getTime()); const g = G();
    expect(g.deload).toBe(true); expect(part(g, 'czworogłowe').dir).toBe('deload'); expect(part(g, 'łydki').dir).toBe('none'); expect(g.below).toEqual([]); expect(g.less).toEqual([]); expect(part(g, 'czworogłowe').belowGoal).toBe(false);
  });
  test('tydzień po deloadzie: porównanie z ostatnim tygodniem bez deloadu (przeskakuje deload), adjacent = false i znany tydzień porównawczy', () => {
    addWorkout(at(8, 22), [[SQ, sets(3, 100, 5)]], '2tyg'); /* 22.09 (tydzień 21–27.09) */ addWorkout(at(9, 1), [[SQ, sets(1, 50, 5)]], 'deload'); /* 1.10 w deloadzie */
    store.toggleDeloadWeek(at(9, 1)); CUR(SQ, sets(3, 110, 5)); const g = G();
    expect(g.adjacent).toBe(false); expect(g.comparedStart).toBe(thisMonday(-2, NOW)); expect(g.hasPrev).toBe(true); expect(part(g, 'czworogłowe')).toMatchObject({ dir: 'up', tonnage: { now: 1650, before: 1500 } });
  });
  test('poprzedni tydzień bez deloadu: adjacent = true, comparedStart = poniedziałek poprzedniego tygodnia', () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 100, 5)); const g = G(); expect(g.adjacent).toBe(true); expect(g.comparedStart).toBe(mondayTs(-1));
  });
  test('kilka deloadów z rzędu: cofa się do pierwszego tygodnia bez deloadu', () => {
    addWorkout(at(8, 15), [[SQ, sets(3, 100, 5)]], 'x'); /* tydzień 14–20.09 */ store.toggleDeloadWeek(at(8, 22)); store.toggleDeloadWeek(at(9, 1)); CUR(SQ, sets(3, 100, 5));
    const g = G(); expect(g.comparedStart).toBe(thisMonday(-3, NOW)); expect(part(g, 'czworogłowe').dir).toBe('same');
  });
  test('same deloady w całym zasięgu wstecz → brak tygodnia porównawczego (comparedStart null), trenowane partie „nowe”', () => {
    for (let i = 1; i <= GUARD_DELOAD_LOOKBACK_WEEKS; i++) store.toggleDeloadWeek(thisMonday(-i, NOW)); CUR(SQ, sets(3, 100, 5)); const g = G();
    expect(g.comparedStart).toBeNull(); expect(g.hasPrev).toBe(false); expect(part(g, 'czworogłowe').dir).toBe('new');
  });
  test('tydzień deload poprzedni, a wcześniejszy bez treningów → nowe (brak danych do porównania)', () => {
    store.toggleDeloadWeek(at(9, 1)); CUR(SQ, sets(3, 100, 5)); const g = G(); expect(g.hasPrev).toBe(false); expect(part(g, 'czworogłowe').dir).toBe('new');
  });
});

describe('progressGuard: tydzień zamknięty (offset −1): tylko wykonane', () => {
  test('poprzedni tydzień bez planu: current=false, serie tylko wykonane; porównanie z tygodniem sprzed dwóch tygodni', () => {
    addWorkout(at(8, 22), [[SQ, sets(3, 100, 5)]], 'a'); PREV(SQ, sets(3, 90, 5)); setPlan({ 3: tpl('A', [SQ, [row(5, 100)]]) }); const g = G(-1);
    expect(g.current).toBe(false); expect(g.weekStart).toBe(mondayTs(-1)); expect(part(g, 'czworogłowe')).toMatchObject({ dir: 'down', total: 3, planned: { total: 0 }, plannedDays: [] }); expect(g.hasPlan).toBe(false);
  });
});

describe('progressGuard: cache i kolejność', () => {
  test('guardCached zwraca ten sam obiekt do zmiany stanu, potem nowy', () => {
    CUR(SQ, sets(3, 100, 5)); const a = guardCached(NOW.getTime()); expect(guardCached(NOW.getTime())).toBe(a); CUR(BP, sets(3, 60, 8), 7); const b = guardCached(NOW.getTime()); expect(b).not.toBe(a); expect(part(b, 'klatka').total).toBe(3);
  });
  test('bez żadnych treningów: wszystkie partie none, puste listy', () => {
    const g = G(); expect(g.parts.every(p => p.dir === 'none')).toBe(true); expect(g.below).toEqual([]); expect(g.less).toEqual([]); expect(g.hasPrev).toBe(false);
  });
});

describe('guardTexts: zdania ekranu Trening i etykieta VoiceOver', () => {
  const texts = () => guardTexts(G());
  /** plan na miniony poniedziałek (dzień „opuszczony”, nie liczy się do serii) — jest plan tygodnia, ale nic nie dochodzi */
  const planMissed = () => setPlan({ 0: tpl('X', [PL, [{ ...row('', ''), durationSec: 30 }]]) });
  test('dane z makiety: „Poniżej celu nawet z planem: dwugłowe (3/10), przywodziciele (4,5/10).” — pośladki dochodzą do celu, więc nie ma ich w zdaniu', () => {
    addWorkout(at(9, 6), [['Leg Extension', sets(10, 40, 10)], ['Hip Thrust (sztanga)', sets(10, 80, 8)], [LC, sets(1, 40, 10)], [HA, sets(2, 30, 10)], [SQ, sets(1, 100, 5)]], 'c');
    setPlan({ 3: tpl('A', [LC, [row(10, 40), row(10, 40)]]), 5: tpl('B', [HA, [row(10, 30), row(10, 30)]]) });
    const g = G(); const x = guardTexts(g); expect(x.short).toBe('Poniżej celu nawet z planem: dwugłowe (3/10), przywodziciele (4,5/10).'); expect(x.short).not.toContain('pośladki');
    expect(g.below.map(p => p.part)).toEqual(['dwugłowe', 'przywodziciele']); expect(part(g, 'pośladki').belowGoal).toBe(false);
  });
  test('liczba z przecinkiem w formacie języka (4,5/10) i kolejność od największej luki; trzy partie wymienione wszystkie', () => {
    CUR(SQ, sets(9, 100, 5), 6); planMissed(); const x = texts(); /* czworogłowe 9, pośladki 4,5, przywodziciele 4,5 */
    expect(x.short).toBe('Poniżej celu nawet z planem: pośladki (4,5/10), przywodziciele (4,5/10), czworogłowe (9/10).'); expect(x.short).not.toContain('jeszcze');
  });
  test('więcej niż 3 partie: dwie największe luki i „i jeszcze N”', () => {
    CUR(SQ, sets(2, 100, 5), 6); CUR(LC, sets(2, 40, 10), 6); CUR(CURL, sets(2, 30, 10), 7); CUR(BP, sets(2, 60, 8), 7); planMissed();
    const g = G(); const x = guardTexts(g); expect(g.below.length).toBeGreaterThan(3);
    expect(x.short).toBe(`Poniżej celu nawet z planem: ${g.below.slice(0, 2).map(p => `${p.part} (${String(p.total).replace('.', ',')}/10)`).join(', ')} i jeszcze ${g.below.length - 2}.`);
  });
  test('wszystkie trenowane partie dochodzą do celu: „Z planem wszystkie trenowane partie dojdą do celu.”; bez planu tygodnia wariant z dopiskiem', () => {
    CUR(CURL, sets(10, 30, 10), 6); expect(texts().short).toBe('Wszystkie trenowane partie są na celu (bez planu tygodnia).'); expect(G().below).toEqual([]);
    planMissed(); expect(texts().short).toBe('Z planem wszystkie trenowane partie dojdą do celu.');
  });
  test('bez planu tygodnia: „Poniżej celu (bez planu tygodnia): dwugłowe (3/10).”', () => {
    CUR(LC, sets(3, 40, 10), 6); expect(texts().short).toBe('Poniżej celu (bez planu tygodnia): dwugłowe (3/10).'); expect(G().hasPlan).toBe(false);
  });
  test('brak jakichkolwiek serii: bez zdania o brakach (short = null)', () => { expect(texts().short).toBeNull(); expect(texts().less).toBeNull(); });
  test('zdanie o spadkach tylko gdy są spadki: „Mniej niż przed tygodniem: czworogłowe, pośladki, przywodziciele.”; bez spadków null', async () => {
    PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 80, 5)); expect(texts().less).toBe('Mniej niż przed tygodniem: czworogłowe, pośladki, przywodziciele.');
    await fresh(); PREV(SQ, sets(3, 100, 5)); CUR(SQ, sets(3, 110, 5)); expect(texts().less).toBeNull();
  });
  test('po deloadzie: „Wobec tygodnia 21 wrz (poprzedni był deloadem)” i zdanie o spadkach z tym tygodniem; w tygodniu deloadu „Tydzień deloadu — bez porównania” zamiast zdań', () => {
    addWorkout(at(8, 22), [[SQ, sets(3, 100, 5)]], 'a'); store.toggleDeloadWeek(at(9, 1)); CUR(SQ, sets(3, 80, 5)); const x = texts();
    expect(x.compared).toBe('Wobec tygodnia 21 wrz (poprzedni był deloadem)'); expect(x.less).toBe('Mniej niż w tygodniu 21 wrz: czworogłowe, pośladki, przywodziciele.'); expect(x.deload).toBeNull();
    store.toggleDeloadWeek(NOW.getTime()); const d = texts(); expect(d.deload).toBe('Tydzień deloadu — bez porównania'); expect(d.short).toBeNull(); expect(d.less).toBeNull(); expect(d.compared).toBeNull();
  });
  test('etykieta VoiceOver: „Ten tydzień wobec poprzedniego: więcej — …; mniej — …; bez porównania — ….” (pomija puste stany i partie bez serii)', () => {
    PREV(SQ, sets(3, 100, 5)); PREV(BP, sets(3, 60, 8), 3); CUR(SQ, sets(3, 110, 5)); CUR(BP, sets(3, 50, 8), 7); CUR(LC, sets(2, 40, 10), 7);
    expect(texts().label).toBe('Ten tydzień wobec poprzedniego: więcej — czworogłowe, pośladki, przywodziciele; mniej — klatka, barki, triceps; bez porównania — dwugłowe.');
  });
  test('etykieta: pierwszy tydzień („nowe”), tyle samo, tydzień deload, po deloadzie z dopiskiem tygodnia', () => {
    CUR(SQ, sets(3, 110, 5)); expect(texts().label).toBe('Ten tydzień wobec poprzedniego: nowe — czworogłowe, pośladki, przywodziciele.');
    PREV(SQ, sets(3, 110, 5)); expect(texts().label).toBe('Ten tydzień wobec poprzedniego: tyle samo — czworogłowe, pośladki, przywodziciele.');
    store.toggleDeloadWeek(NOW.getTime()); expect(texts().label).toBe('Tydzień deloadu — bez porównania');
  });
});

describe('guardTexts i guardWord: języki (macierz 35 języków)', () => {
  /** scenariusz ze wszystkimi zdaniami: >3 partie poniżej celu, spadki, tydzień po deloadzie (data tygodnia porównawczego) */
  const rich = () => { addWorkout(at(8, 22), [[SQ, sets(3, 100, 5)]], 'a'); store.toggleDeloadWeek(at(9, 1)); CUR(SQ, sets(3, 80, 5)); CUR(BP, sets(2, 60, 8), 7); CUR(LC, sets(2, 40, 10), 7); };
  afterEach(() => { applyLang('pl'); });
  test('EN: słowa stanów i zdania po angielsku', () => {
    applyLang('en'); expect((['up', 'same', 'down', 'unknown', 'new', 'none'] as const).map(guardWord)).toEqual(['more', 'same', 'less', 'no comparison', 'new', 'no sets']);
    rich(); const x = guardTexts(G()); expect(x.short).toMatch(/^Below goal even with the plan: .+ and \d+ more\.$|^Below goal \(no weekly plan\): .+( and \d+ more)?\.$/);
    expect(x.compared).toMatch(/^Compared with the week of .+ \(the previous week was a deload\)$/); expect(x.less).toMatch(/^Less than in the week of .+: quads, glutes, adductors\.$/); expect(x.label).toMatch(/^This week compared with the previous one: /);
    store.toggleDeloadWeek(NOW.getTime()); expect(guardTexts(G()).deload).toBe('Deload week — no comparison');
  });
  test.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('%s: wszystkie zdania i słowa przetłumaczone — bez nierozwiniętych {parametrów} i bez liter tylko polskich', l => {
    applyLang(l); rich(); const g = G(); const x = guardTexts(g); const PL_ONLY = l === 'lt' ? /[łńśźżŁŃŚŹŻ]/ : /[ąęłńśźżĄĘŁŃŚŹŻ]/;
    const all = [x.compared, x.short, x.less, x.label, ...(['up', 'same', 'down', 'unknown', 'new', 'none'] as const).map(guardWord)];
    for (const v of all) { expect([l, typeof v]).toEqual([l, 'string']); expect([l, v, /[{}]/.test(v as string), PL_ONLY.test(v as string)]).toEqual([l, v, false, false]); }
    expect(x.short).not.toBe(guardTexts((applyLang('pl'), g)).short); /* inny niż polski */
    store.toggleDeloadWeek(NOW.getTime()); applyLang(l); const d = guardTexts(G()); expect([l, d.deload, /[{}]/.test(d.deload!), PL_ONLY.test(d.deload!)]).toEqual([l, d.deload, false, false]);
  });
});
