import { memoHist, workoutDay, getState, save, finishedWorkouts, localISODate, exById, appendPlanSegment, sameDays, planDays, cleanPlanName, clampName, deleteTemplate, SAVED_PLANS_MAX, PLAN_NAME_MAX } from './store';
import { uid, type SavedPlan, type PlanSegment, type Workout } from './seed';
import { t, locale } from './i18n';

/*
 * Plan tygodnia i kalendarz (priorytet właściciela 08.10.2026, docs/18; docs/21 „Priorytet”). Same dane użytkownika — bez twierdzeń dziedzinowych
 * (reguły regeneracji partii dojdą osobno, ze źródłami: docs/research/23).
 *
 * Model: stały plan tygodnia `State.weekPlan.days` (pon…nd: id szablonu albo null = dzień wolny) + zmiany pojedynczych dni
 * `State.planOverrides` (data RRRR-MM-DD → id szablonu albo null). Trening zaplanowany na dzień = zmiana tego dnia, a bez niej — plan tygodnia.
 * Zmiana równa planowi tygodnia jest usuwana — po wyrównaniu kalendarz sam wraca do rutyny.
 *
 * Historia planu (schemat 18; audyt 0.10 A1, decyzja właściciela 08.10.2026 — wariant B): `State.planHistory` — odcinki „od dnia”; każda zmiana
 * planu tygodnia (dzień planu, aktywacja innego planu, generator) dopisuje odcinek od dziś. Miniony dzień liczy się wg odcinka, który go obejmował,
 * a dzień sprzed pierwszego planu nie ma planu (nie jest „opuszczony”). Dziś i dalej — aktywny plan (`weekPlan`, równy ostatniemu odcinkowi).
 * Miniony dzień czyta surowe id (szablon usunięty albo w archiwum później nie zmienia statusu przeszłości); dziś i dalej — tylko żywe szablony.
 *
 * Przesuwanie (decyzja właściciela 08.10.2026):
 * - „przesuń plan o 1 dzień” (shiftPlan): trening idzie na następny dzień, a trening, który tam był, o jeden dalej — i tak tylko do pierwszego
 *   dnia wolnego (np. dziś FBW A, jutro FBW B, potem wolne → A jutro, B pojutrze, nic więcej); dla minionego dnia — „od dziś” (audyt 0.10 A4);
 * - „przesuń tylko ten trening” (moveOnly): na wskazany dzień, ale nigdy na dzień z innym treningiem bez wyraźnego polecenia
 *   (wynik `conflict` — ekran pyta; `swapDays` zamienia miejscami na wyraźne polecenie, tylko między dniami od dziś).
 * Dzień z zakończonym treningiem albo z treningiem w toku jest zajęty: nic się na niego nie przenosi i łańcuch go omija (audyt 0.10 A3).
 */
export type PlanDays = (string | null)[];
/** Najdłuższe przesunięcie łańcuchowe — plan bez dni wolnych nie przesuwa się w nieskończoność. */
export const SHIFT_MAX_DAYS = 14;

export const dayKeyOf = (ts: number) => localISODate(new Date(ts));
const parseKey = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
export const addDays = (k: string, n: number) => { const d = parseKey(k); return localISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); };
/** Indeks dnia tygodnia od poniedziałku (0 = pon., 6 = nd.). */
export const weekdayIdx = (k: string) => (parseKey(k).getDay() + 6) % 7;
const todayKey = () => dayKeyOf(Date.now());

const exists = (id: string | null | undefined) => !!id && getState().templates.some(t => t.id === id);
const liveTemplate = (id: string | null | undefined) => !!id && getState().templates.some(t => t.id === id && !t.archived);
export const weekPlanDays = (): PlanDays => planDays(getState().weekPlan?.days);
export const planHistory = (): PlanSegment[] => getState().planHistory ?? [];

/** Plan tygodnia w dniu `k` (bez zmian pojedynczych dni), surowe id: od ostatniego odcinka historii — aktywny plan; wcześniej — odcinek, który
 * wtedy obowiązywał; przed pierwszym planem — brak (audyt 0.10 A1). */
export function baseRaw(k: string, today = todayKey()): string | null {
  const h = planHistory(); const wd = weekdayIdx(k);
  if (!h.length) return k >= today ? weekPlanDays()[wd] : null;
  if (k >= h[h.length - 1].from) return weekPlanDays()[wd];
  for (let i = h.length - 2; i >= 0; i--) if (h[i].from <= k) return h[i].days[wd] ?? null;
  return null;
}
/** Miniony dzień — surowe id (późniejsze usunięcie albo archiwizacja szablonu nie przepisuje przeszłości); dziś i dalej — tylko żywy szablon. */
const resolve = (id: string | null | undefined, k: string, today: string): string | null => (k < today ? id || null : liveTemplate(id) ? id! : null);
const rawOn = (k: string, today: string) => { const ov = getState().planOverrides; return ov && k in ov ? ov[k] : baseRaw(k, today); };
/** Trening zaplanowany na dzień (id szablonu; null — dzień wolny, przed pierwszym planem albo — od dziś — szablon usunięty / w archiwum). */
export function plannedOn(k: string, today = todayKey()): string | null { return resolve(rawOn(k, today), k, today); }
const baseOn = (k: string, today = todayKey()) => resolve(baseRaw(k, today), k, today);
/** Czy dzień ma zmianę względem planu tygodnia. */
export const isChanged = (k: string, today = todayKey()) => { const ov = getState().planOverrides; return !!ov && k in ov && resolve(ov[k], k, today) !== baseOn(k, today); };
/** Czy jest plan: żywy szablon w planie tygodnia albo w zmianie dnia od dziś (audyt 0.10 A6 — same „wolne” i martwe id to nie plan). */
export const hasPlan = (today = todayKey()) => weekPlanDays().some(liveTemplate) || Object.entries(getState().planOverrides ?? {}).some(([k, v]) => k >= today && liveTemplate(v));
/** Nazwa szablonu z planu do wyświetlenia (usunięty — „usunięty szablon”; dotyczy minionych dni). */
export const planTplName = (id: string | null | undefined) => (!id ? '' : getState().templates.find(x => x.id === id)?.name ?? t('usunięty szablon'));

const putOv = (ov: Record<string, string | null>) => { const st = getState(); if (Object.keys(ov).length) st.planOverrides = ov; else delete st.planOverrides; };
/** Zmiana dnia; równa planowi tygodnia (surowo — także szablon w archiwum: jawne „wolne” zostaje po jego przywróceniu, audyt 0.10 X-06) znika. */
function setDay(k: string, id: string | null, today = todayKey()) {
  const ov = { ...(getState().planOverrides ?? {}) };
  if (id === baseRaw(k, today)) delete ov[k]; else ov[k] = id;
  putOv(ov);
}
const commit = () => { getState().userTouched = true; save(); };

/** Dni zajęte: z zakończonym treningiem albo z treningiem w toku — na nie nic się nie przenosi (audyt 0.10 A3 / LOG-01). */
export function busyDays(): Set<string> { const s = new Set(byDay().keys()); const a = getState().active; if (a) s.add(workoutDay(a)); /* J3: dzień w strefie startu */ return s; }

/** Aktywny plan: dni i nazwa; zmiana dni dopisuje odcinek historii od dziś (audyt 0.10 A1). */
function putActive(days: PlanDays, name: string, today = todayKey()) {
  const st = getState(); const h = planHistory(); const last = h[h.length - 1];
  if (last ? !sameDays(last.days, days) : days.some(Boolean)) { const nh = appendPlanSegment(h, today, days); if (nh.length) st.planHistory = nh; else delete st.planHistory; }
  if (days.some(Boolean) || name) st.weekPlan = { days: [...days], ...(name ? { name } : {}) }; else delete st.weekPlan;
}

/** Ustawienie planu tygodnia (pon…nd) — obowiązuje od dziś; minione dni bez zmian (audyt 0.10 A1). */
export function setWeekDay(i: number, id: string | null) {
  const today = todayKey(); const days = weekPlanDays(); days[i] = id && liveTemplate(id) ? id : null; putActive(days, planName(), today); tidy(today); commit();
}

/* ---------- kilka planów tygodnia, jeden aktywny (decyzja właściciela 08.10.2026, docs/24 sekcja 1) ----------
 * Audyt 0.10 (decyzje właściciela 08.10.2026 wieczór — wariant lepszy, nie tańszy): B2 A — „Nowy plan” to osobny wpis w „Inne plany”, który
 * edytujesz przed ustawieniem jako aktywny; oryginał zachowuje nazwę, plan bez nazwy dostaje nazwę z datą („Plan do 8.10”); nazwy bez powtórzeń;
 * B1 (DAT-02 B) — zmiany pojedynczych dni od dziś wędrują razem z planem: przy wyłączeniu zapisują się w nim, przy ponownej aktywacji wracają. */
/** Nazwa aktywnego planu ('' — ekran pokazuje „Mój plan”). */
export const planName = () => getState().weekPlan?.name ?? '';
export const savedPlans = (): SavedPlan[] => getState().savedPlans ?? [];
const putSaved = (list: SavedPlan[]) => { const st = getState(); if (list.length) st.savedPlans = list; else delete st.savedPlans; };
/** „Inne plany” pełne — nowego planu (także z generatora) nie da się dodać (ten sam limit co w migrate — audyt 0.10 B3 / DAT-03). */
export const plansFull = () => savedPlans().length >= SAVED_PLANS_MAX;
/** Nazwa bez powtórzeń wśród planów (audyt 0.10 B2 / X-14): „Masa, 3× w tygodniu (2)”. `taken` — nazwy zajęte. */
function uniqueIn(taken: string[], name: string): string {
  const has = new Set(taken); if (!has.has(name)) return name; const stem = name.replace(/ \(\d+\)$/, '') || name; /* „X (2)” zajęte → „X (3)”, nie „X (2) (2)” */
  for (let i = 2; ; i++) { const suf = ` (${i})`; const c = clampName(stem, PLAN_NAME_MAX - suf.length) + suf; if (!has.has(c)) return c; }
}
/** Nazwy zajęte: aktywny plan (chyba że `skipActive`) i zapisane (bez `skipId`). */
const takenNames = (skipActive = false, skipId?: string) => [...(skipActive ? [] : [cleanPlanName(planName())]), ...savedPlans().filter(p => p.id !== skipId).map(p => p.name)].filter(Boolean);
const clampTyped = (n: string) => { let v = n.slice(0, PLAN_NAME_MAX); if (/[\uD800-\uDBFF]$/.test(v)) v = v.slice(0, -1); return v; };
/** Nazwa aktywnego planu po zakończeniu edycji: porządkowana (spacje, długość, emoji — audyt 0.10 B4), bez powtórzeń z zapisanymi (B2). */
export function setPlanName(n: string) { const c = cleanPlanName(n); putActive(weekPlanDays(), c ? uniqueIn(takenNames(true), c) : ''); commit(); }
/** Nazwa przy każdej zmianie pola (audyt 0.10 B4 / UI-05 — jak inne nazwy: zapis od razu, porządkowanie przy końcu edycji). */
export function typePlanName(n: string) { putActive(weekPlanDays(), clampTyped(n)); commit(); }
/** Nazwa planu bez nazwy, gdy przestaje obowiązywać: „Plan do 8.10” (audyt 0.10 B2 A — ten sam plan nie nazywa się raz „Mój plan”, raz „Poprzedni plan”). */
const datedName = (today: string) => t('Plan do {date}', { date: parseKey(today).toLocaleDateString(locale(), { day: 'numeric', month: 'numeric' }) });
/** „Nowy plan” (audyt 0.10 B2 A): osobny wpis w „Inne plany” — kopia aktywnego planu (dni) do edycji przed aktywacją; aktywny plan i jego
 * nazwa bez zmian. Zwraca id nowego planu; null — „Inne plany” pełne. */
export function newPlan(name = ''): string | null {
  if (plansFull()) return null;
  const id = uid(); putSaved([...savedPlans(), { id, name: uniqueIn(takenNames(), cleanPlanName(name) || t('Nowy plan')), days: weekPlanDays() }]); commit(); return id;
}
/** Dzień zapisanego planu (edycja przed aktywacją, audyt 0.10 B2 A). */
export function setSavedDay(id: string, i: number, tpl: string | null) {
  if (i < 0 || i > 6) return; putSaved(savedPlans().map(p => (p.id === id ? { ...p, days: planDays(p.days).map((x, j) => (j === i ? (tpl && liveTemplate(tpl) ? tpl : null) : x)) } : p))); commit();
}
/** Nazwa zapisanego planu przy każdej zmianie pola (porządkowana przy końcu edycji — renamePlan). */
export function typeSavedName(id: string, n: string) { putSaved(savedPlans().map(p => (p.id === id ? { ...p, name: clampTyped(n) } : p))); commit(); }
/** Zmiana nazwy zapisanego planu (audyt 0.10 B2): pusta — poprzednia (`fallback`) albo bez zmiany; bez powtórzeń. */
export function renamePlan(id: string, name: string, fallback = '') {
  const n = cleanPlanName(name) || cleanPlanName(fallback); if (!n || !savedPlans().some(p => p.id === id)) return;
  putSaved(savedPlans().map(p => (p.id === id ? { ...p, name: uniqueIn(takenNames(false, id), n) } : p))); commit();
}
/** Zmiany pojedynczych dni od dziś, które coś zmieniają — należą do aktywnego planu i przy zmianie planu zapisują się razem z nim (B1). */
export const futureChanges = (today = todayKey()) => Object.keys(getState().planOverrides ?? {}).filter(k => k >= today && isChanged(k, today)).length;
/** Zmiany dni zapisane z planem, które wrócą przy jego aktywacji (od dziś). */
export const savedChanges = (id: string, today = todayKey()) => Object.keys(savedPlans().find(p => p.id === id)?.overrides ?? {}).filter(k => k >= today).length;
/** Okno aktywacji (ekran planu i generator — jeden tekst, audyt 0.10 B1): co stanie się z obecnym planem i jego zmianami dni, co wróci z nowym. */
export function activationNote(id?: string, today = todayKey()): string {
  const n = futureChanges(today); const cur = weekPlanDays().some(Boolean) || !!cleanPlanName(planName()) || n > 0; /* sam plan ze zmianami dni też się zapisuje (B1) */ const m = id ? savedChanges(id, today) : 0;
  return [cur ? (n ? t('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś ({n}) — wrócą, gdy znów go ustawisz.', { n }) : t('Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.')) : '',
    m ? t('Wrócą zmiany pojedynczych dni zapisane z tym planem: {n}.', { n: m }) : ''].filter(Boolean).join(' ');
}
/** Ustawienie zapisanego planu jako aktywnego: poprzedni aktywny (z dniem, nazwą albo zmianami dni od dziś) trafia do zapisanych pod swoją nazwą (bez nazwy — „Plan do <data>”) razem ze
 * swoimi zmianami dni od dziś (B1); zmiany dni zapisane z nowym planem wracają (te od dziś); przeszłe zmiany zostają (historia); od dziś
 * obowiązuje nowy odcinek historii — minione dni bez zmian (A1). */
export function activatePlan(id: string) {
  const today = todayKey(); const p = savedPlans().find(x => x.id === id); if (!p) return;
  const rest = savedPlans().filter(x => x.id !== id); const cur = weekPlanDays(); const nm = cleanPlanName(planName());
  const ov = getState().planOverrides ?? {}; const past = Object.fromEntries(Object.entries(ov).filter(([k]) => k < today));
  const mine = Object.fromEntries(Object.entries(ov).filter(([k]) => k >= today && isChanged(k, today)));
  putSaved(cur.some(Boolean) || nm || Object.keys(mine).length ? [...rest, { id: uid(), name: uniqueIn(rest.map(x => x.name), nm || datedName(today)), days: cur, ...(Object.keys(mine).length ? { overrides: mine } : {}) }] : rest);
  putActive(planDays(p.days).map(x => (exists(x) ? x : null)) /* audyt 0.10 A7: usunięty szablon — dzień wolny */, p.name, today);
  putOv({ ...past, ...Object.fromEntries(Object.entries(p.overrides ?? {}).filter(([k]) => k >= today)) });
  tidy(today); commit();
}
/** Nowy plan z dniami (np. z generatora; nazwa bez powtórzeń); `activate` — od razu obowiązuje. '' — „Inne plany” pełne (ekran sprawdza plansFull). */
export function addPlan(name: string, days: PlanDays, activate: boolean): string {
  if (plansFull()) return '';
  const id = uid(); putSaved([...savedPlans(), { id, name: uniqueIn(takenNames(), cleanPlanName(name) || t('Nowy plan')), days: planDays(days) }]);
  if (activate) activatePlan(id); else commit(); return id;
}
export function deletePlan(id: string) { if (!savedPlans().some(p => p.id === id)) return; putSaved(savedPlans().filter(p => p.id !== id)); commit(); }
/** Pojedynczy dzień: inny trening albo wolne (null). */
export function setDayPlan(k: string, id: string | null) { setDay(k, id && liveTemplate(id) ? id : null); commit(); }
/** Powrót dnia do planu tygodnia. */
export function resetDay(k: string) { const st = getState(); if (st.planOverrides && k in st.planOverrides) { const ov = { ...st.planOverrides }; delete ov[k]; putOv(ov); commit(); } }

export type ShiftResult = { moved: { from: string; to: string; id: string }[]; dropped?: string };
type IO = { get: (k: string) => string | null; set: (k: string, id: string | null) => void };
/** Łańcuch przesunięcia (wspólny dla planu i symulacji propozycji): trening z dnia `k` idzie na następny wolny od zajętości dzień (dla minionego
 * dnia — od dziś), a trening, który tam był, dalej — do pierwszego dnia wolnego (najwyżej SHIFT_MAX_DAYS dni; dalej trening wypada). */
function chain(k: string, today: string, io: IO, busy: Set<string>): ShiftResult {
  let carry = io.get(k); const moved: ShiftResult['moved'] = []; if (!carry || !liveTemplate(carry)) return { moved };
  io.set(k, null); let src = k; let d = k < today ? addDays(today, -1) : k;
  for (let i = 0; i < SHIFT_MAX_DAYS && carry; i++) {
    d = addDays(d, 1); if (busy.has(d)) continue;
    const there = io.get(d); io.set(d, carry); moved.push({ from: src, to: d, id: carry }); carry = there; src = d;
  }
  return carry ? { moved, dropped: carry } : { moved };
}
/** Przesunięcie planu o 1 dzień od dnia `k` (dla minionego dnia — „od dziś”, audyt 0.10 A4); dni zajęte łańcuch omija (A3). */
export function shiftPlan(k: string, today = todayKey()): ShiftResult {
  const r = chain(k, today, { get: d => plannedOn(d, today), set: (d, id) => setDay(d, id, today) }, busyDays()); if (r.moved.length) commit(); return r;
}

/** Wynik przeniesienia: `conflict` — trening na dniu docelowym; `done` — dzień docelowy z treningiem zrobionym albo w toku (audyt 0.10 A3). */
export type MoveResult = { ok: true } | { ok: false; conflict: string; done?: true };
/** Przesunięcie tylko tego treningu na dzień `to` (od dziś) — bez wyraźnego polecenia nigdy na dzień z innym treningiem ani na dzień zajęty. */
export function moveOnly(from: string, to: string, today = todayKey()): MoveResult {
  const id = plannedOn(from, today); if (!id || !liveTemplate(id) || from === to || to < today) return { ok: true };
  const there = plannedOn(to, today); if (busyDays().has(to)) return { ok: false, conflict: there ?? '', done: true };
  if (there) return { ok: false, conflict: there };
  setDay(from, null, today); setDay(to, id, today); commit(); return { ok: true };
}
/** Wyraźne polecenie: zamiana treningów dwóch dni miejscami — tylko między dniami od dziś, bez dni zajętych (audyt 0.10 A4 / X-09). */
export function swapDays(a: string, b: string, today = todayKey()) {
  if (a < today || b < today) return; const busy = busyDays(); if (busy.has(a) || busy.has(b)) return;
  const x = plannedOn(a, today), y = plannedOn(b, today); setDay(a, y, today); setDay(b, x, today); commit();
}

/** Porządek zmian dni (audyt 0.10 A1, A6): zmiana równa planowi tygodnia z tego dnia znika (bez zmiany statusu); od dziś — usunięty szablon
 * to dzień wolny. Minione zmiany dni zostają (bez kasowania po 60 dniach — „wolne” sprzed miesięcy nie wraca jako „opuszczony”). */
function tidy(today = todayKey()) {
  const ov = { ...(getState().planOverrides ?? {}) };
  for (const [k, v] of Object.entries(ov)) {
    const b = baseRaw(k, today);
    if (v === b) { delete ov[k]; continue; }
    if (k >= today && v !== null && !exists(v)) { if (b === null || !exists(b)) delete ov[k]; else ov[k] = null; }
  }
  putOv(ov);
}

/* ---------- szablony a plan (audyt 0.10 A7) ---------- */
const weekdayShort = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' }); /* 1.01.2024 = poniedziałek */
const shortDate = (k: string) => parseKey(k).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'numeric' });
/** Gdzie plan używa szablonu: dni planu tygodnia, zmiany dni od dziś, zapisane plany, trening w toku. */
export function templateUsage(id: string, today = todayKey()) {
  return {
    weekDays: weekPlanDays().map((x, i) => (x === id ? i : -1)).filter(i => i >= 0),
    dates: Object.entries(getState().planOverrides ?? {}).filter(([k, v]) => k >= today && v === id).map(([k]) => k).sort(),
    saved: savedPlans().filter(p => p.days.includes(id) || Object.entries(p.overrides ?? {}).some(([k, v]) => k >= today && v === id)).map(p => p.name || t('Poprzedni plan')),
    active: getState().active?.templateId === id,
  };
}
/** Skutki usunięcia / archiwizacji szablonu dla planu — do okna potwierdzenia ('' — szablon nie jest w planie ani w treningu w toku). */
export function templateUsageText(id: string, archive = false): string {
  const u = templateUsage(id); const out: string[] = [];
  if (u.weekDays.length) out.push(t('W planie tygodnia: {days} — te dni będą wolne.', { days: u.weekDays.map(weekdayShort).join(', ') }));
  if (u.dates.length) out.push(t('Zaplanowany też na: {days} — te dni będą wolne.', { days: u.dates.map(shortDate).join(', ') }));
  if (u.saved.length) out.push(t('W zapisanych planach: {names}.', { names: u.saved.join(', ') }));
  if (archive && out.length) out.push(t('Po przywróceniu z archiwum szablon wróci do planu.'));
  if (u.active) out.push(t('Trwa trening z tego szablonu — zostanie bez zmian.'));
  return out.join('\n');
}
/** Usunięcie szablonu razem z porządkiem planu (audyt 0.10 A7): znika z aktywnego planu (od dziś — nowy odcinek historii), z zapisanych planów
 * i ze zmian dni od dziś; przeszłość (odcinki historii, minione zmiany dni) zostaje — statusy minionych dni się nie zmieniają. */
export function removeTemplate(id: string) {
  deleteTemplate(id); const today = todayKey();
  const days = weekPlanDays(); if (days.includes(id)) putActive(days.map(x => (x === id ? null : x)), planName(), today);
  /* zapisane plany: dzień planu → wolne; zapisana zmiana dnia z tym szablonem → wolne (a gdy plan i tak ma ten dzień wolny — znika) */
  putSaved(savedPlans().map(p => { if (!p.days.includes(id) && !Object.values(p.overrides ?? {}).includes(id)) return p;
    const days = p.days.map(x => (x === id ? null : x)); const ov: Record<string, string | null> = {};
    for (const [k, v] of Object.entries(p.overrides ?? {})) { if (v !== id) ov[k] = v; else if (days[weekdayIdx(k)] !== null) ov[k] = null; }
    const { overrides: _o, ...rest } = p; void _o; return Object.keys(ov).length ? { ...rest, days, overrides: ov } : { ...rest, days }; }));
  tidy(today); commit();
}

export type DayStatus = 'done' | 'other' | 'planned' | 'missed' | 'rest';
export type DayState = { status: DayStatus; templateId: string | null; workoutIds: string[] };
/**
 * Stan dnia — JEDNA funkcja dla kalendarza (kropki i etykiety), paska tygodnia, karty „Dziś”, panelu dnia, liczników na ekranie Trening
 * i przypomnień (audyt 0.10 A2; A5 — decyzja właściciela 08.10.2026 wieczór: dopasowanie po szablonie, X-04 A):
 * - 'done'   — zrobiony zaplanowany szablon (albo trening w dniu bez planu);
 * - 'other'  — zrobiony inny trening; zaplanowany czeka (dziś i dalej — do zrobienia, przeniesienia albo pominięcia; miniony — nie zrobiony);
 * - 'planned' / 'missed' — zaplanowany bez treningu: dziś i dalej / wcześniej (wg planu, który wtedy obowiązywał — A1);
 * - 'rest'   — bez planu i bez treningu.
 * `ws` — zakończone treningi tego dnia (kalendarz podaje je z gotowej mapy dni).
 */
export function dayStatusFrom(k: string, ws: readonly Workout[], today = todayKey()): DayState {
  const id = plannedOn(k, today); const ids = ws.map(w => w.id);
  if (ws.length) return { status: !id || ws.some(w => w.templateId === id) ? 'done' : 'other', templateId: id, workoutIds: ids };
  if (!id) return { status: 'rest', templateId: null, workoutIds: [] };
  return { status: k < today ? 'missed' : 'planned', templateId: id, workoutIds: [] };
}
/** Sesje zakończone w dniu `k` (od najwcześniejszej) — nazwy na karcie, pasku i w panelu (audyt 0.10 A5). */
/** PERF-04 (audyt 0.10): mapa dzień → zakończone treningi (od najwcześniejszego), budowana raz na zmianę historii — wcześniej każdy dzień
 * kalendarza i paska tygodnia przeglądał całą historię (42 dni × 2000 treningów). */
const byDay = memoHist(() => { const m = new Map<string, Workout[]>(); for (const w of finishedWorkouts()) { const k = workoutDay(w); const a = m.get(k); if (a) a.push(w); else m.set(k, [w]); } for (const a of m.values()) a.sort((x, y) => x.startedAt - y.startedAt); return m; });
const NONE: readonly Workout[] = [];
export const doneOn = (k: string): Workout[] => [...(byDay().get(k) ?? NONE)];
export const dayStatus = (k: string, today = todayKey()): DayState => dayStatusFrom(k, doneOn(k), today);
/** Zaplanowany trening dnia czeka (planned albo other) — można go zacząć, przenieść albo pominąć. */
export const pending = (st: Pick<DayState, 'status'>) => st.status === 'planned' || st.status === 'other';
/** Najbliższe dni z planem (dziś i dalej) — do podglądu na ekranie treningu. */
export const upcoming = (days = 7, today = todayKey()) => Array.from({ length: days }, (_, i) => addDays(today, i)).map(k => ({ date: k, templateId: plannedOn(k, today) }));

/* ---------- sugestie z regeneracją partii (decyzja właściciela 08.10.2026; reguły i źródła: docs/research/23) ----------
 * Uproszczenie (nazwane): sesje z tymi samymi głównymi partiami dzień po dniu — ostrzeżenie, nie blokada. Podstawa: przebieg regeneracji 24–48 h
 * (Morán-Navarro 2017 / Pareja-Blanco 2019–2020 — jeden zespół; Soares 2015; Paulsen 2012), ACSM „48 h” tylko z cytatu wtórnego (Cuthbert 2021);
 * dzień po dniu przy równej objętości tygodnia nie szkodzi (Schoenfeld 2019, Grgic 2018, Cuthbert 2021, Pedersen 2024) — dlatego ostrzeżenie.
 * Kolejność (score niżej): zmiany w oknie powrotu RETURN_DAYS → bez utraty sesji → bez nowych par pod rząd → najmniej zmian. */
/** Okno powrotu do rutyny (decyzja właściciela: „po 7–10 dniach wrócić do pierwotnej rutyny”). */
export const RETURN_DAYS = 10;
/** Główne partie szablonu (ćwiczenia z biblioteki: pole muscles). */
export function templateMuscles(id: string | null): Set<string> {
  const tpl = id ? getState().templates.find(x => x.id === id) : undefined; const out = new Set<string>();
  tpl?.items.forEach(it => (exById(it.exerciseId)?.muscles ?? []).forEach(m => out.add(m)));
  return out;
}
/** Dni z treningiem (zrobionym albo w toku) w oknie [from, from + n): partie z tych treningów i ich szablony (audyt 0.10 A3 — „zrobione”
 * liczą się w parach dzień po dniu i w utraconych sesjach; A5 — zaplanowany szablon tego dnia czeka, gdy zrobiono inny). */
export type DoneInfo = { muscles: Map<string, Set<string>>; tpls: Map<string, Set<string>> };
export function doneInfo(from: string, n: number): DoneInfo {
  const keys = new Set(Array.from({ length: n }, (_, i) => addDays(from, i))); const muscles = new Map<string, Set<string>>(); const tpls = new Map<string, Set<string>>();
  const add = (w: Workout) => { const k = workoutDay(w); if (!keys.has(k)) return; const s = muscles.get(k) ?? new Set<string>(); w.exercises.forEach(e => (exById(e.exerciseId)?.muscles ?? []).forEach(x => s.add(x))); muscles.set(k, s);
    const ts = tpls.get(k) ?? new Set<string>(); if (w.templateId) ts.add(w.templateId); tpls.set(k, ts); };
  finishedWorkouts().forEach(add); const a = getState().active; if (a) add(a);
  return { muscles, tpls };
}
/** Zaplanowany szablon dnia, który jeszcze czeka (dzień bez treningu albo zrobiony inny). */
const pendingOn = (k: string, on: (k: string) => string | null, done: DoneInfo) => { const id = on(k); return id && !done.tpls.get(k)?.has(id) ? id : null; };
/** Pary dni pod rząd z tymi samymi głównymi partiami w oknie [from, from + n) — partie dnia: zrobiony trening i czekający szablon. */
export function backToBack(from: string, n = RETURN_DAYS, on: (k: string) => string | null = plannedOn, done: DoneInfo = doneInfo(addDays(from, -1), n + 2)): { a: string; b: string }[] {
  const mus = (k: string) => { const d = done.muscles.get(k); const p = pendingOn(k, on, done); if (!p) return d ?? new Set<string>(); const m = templateMuscles(p); d?.forEach(x => m.add(x)); return m; };
  const out: { a: string; b: string }[] = [];
  for (let i = -1; i < n; i++) { const a = addDays(from, i), b = addDays(from, i + 1); const A = mus(a); if (!A.size) continue; for (const m of mus(b)) if (A.has(m)) { out.push({ a, b }); break; } }
  return out;
}

type Ov = Record<string, string | null>;
type Sim = { ov: Ov };

export type Suggestion = {
  kind: 'shift' | 'move' | 'swap' | 'skip'; to?: string;
  /** zmienione dni względem planu tygodnia w oknie powrotu */ changes: number;
  /** pary pod rząd z tymi samymi partiami, których nie ma w planie tygodnia */ newBackToBack: { a: string; b: string }[];
  /** sesje, które wypadają w oknie (dni z treningiem zrobionym liczą się jako sesje — audyt 0.10 A3) */ dropped: number;
  /** czy wszystkie zmiany mieszczą się w oknie powrotu */ returns: boolean;
  /** treningi na nowych dniach (opis „Upper A → pt. 9.10”) */ placed: { id: string; to: string }[];
  ov: Ov;
};
/**
 * Propozycje dla treningu z dnia `from` (przesunięty, opuszczony albo „nie dam rady”): przesunięcie planu, przeniesienie na wolny dzień,
 * zamiana z treningiem innego dnia (tylko od dziś), pominięcie. Dni z treningiem zrobionym albo w toku są zajęte (audyt 0.10 A3). To jedyna lista
 * przesunięć w panelu dnia („Przesuń albo pomiń”, audyt 0.10 UX-13 A) — oba tryby właściciela (łańcuch i tylko ten trening) są jej pozycjami.
 * Kolejność: zmiany w oknie powrotu → bez utraty sesji → bez nowych par pod rząd z tymi samymi partiami → najmniej zmian; te same zmiany
 * dni tylko raz (audyt 0.10 A10 / LOG-13). Dzień startu: `from`, a dla dnia sprzed dzisiaj — dziś (przeszłości nie przestawiamy).
 */
export function suggest(from: string, today = todayKey()): Suggestion[] {
  const id = plannedOn(from, today); if (!id || !liveTemplate(id)) return [];
  const busy = busyDays(); const start = from < today ? today : from; const base0 = { ...(getState().planOverrides ?? {}) };
  const winFrom = from < today ? from : start; const win = Array.from({ length: RETURN_DAYS + 1 }, (_, i) => addDays(winFrom, i));
  const done = doneInfo(addDays(winFrom, -1), RETURN_DAYS + 3);
  const baseOnly = (k: string) => baseOn(k, today);
  const simOn = (sim: Sim) => (k: string): string | null => resolve(k in sim.ov ? sim.ov[k] : baseRaw(k, today), k, today);
  const simSet = (sim: Sim, k: string, v: string | null) => { if (v === baseRaw(k, today)) delete sim.ov[k]; else sim.ov[k] = v; };
  const io = (sim: Sim): IO => ({ get: simOn(sim), set: (k, v) => simSet(sim, k, v) });
  const baseB2B = new Set(backToBack(winFrom, RETURN_DAYS, baseOnly, done).map(p => p.a + p.b));
  /* sesje w oknie: dzień z treningiem — 1, plus czekający zaplanowany szablon — 1 (audyt 0.10 A3, A5) */
  const count = (on: (k: string) => string | null) => win.reduce((a, k) => a + (busy.has(k) ? 1 : 0) + (pendingOn(k, on, done) ? 1 : 0), 0);
  const baseCount = count(baseOnly);
  const make = (kind: Suggestion['kind'], sim: Sim, to?: string): Suggestion => {
    const on = simOn(sim); const changed = win.filter(k => on(k) !== baseOnly(k));
    const lastChange = Object.keys(sim.ov).filter(k => k >= winFrom).sort().pop();
    const cur = simOn({ ov: base0 }); const placed = Array.from({ length: SHIFT_MAX_DAYS + 7 }, (_, i) => addDays(start, i)).filter(k => on(k) && on(k) !== cur(k)).map(k => ({ id: on(k)!, to: k }));
    return { kind, to, changes: changed.length, newBackToBack: backToBack(winFrom, RETURN_DAYS, on, done).filter(p => !baseB2B.has(p.a + p.b)), dropped: Math.max(0, baseCount - count(on)),
      returns: !lastChange || lastChange <= addDays(winFrom, RETURN_DAYS - 1), placed, ov: sim.ov };
  };
  const out: Suggestion[] = [];
  /* 1. przesunięcie planu (łańcuch do pierwszego wolnego dnia, z pominięciem dni zajętych) — od dnia startu */
  { const sim: Sim = { ov: { ...base0 } }; chain(from, today, io(sim), busy); out.push(make('shift', sim)); }
  /* 2. przeniesienie tylko tego treningu na wolny, niezajęty dzień (najbliższe 6 dni) */
  for (let i = from === start ? 1 : 0; i <= 6; i++) { const k = addDays(start, i); if (busy.has(k)) continue; const sim: Sim = { ov: { ...base0 } }; if (simOn(sim)(k)) continue; simSet(sim, from, null); simSet(sim, k, id); out.push(make('move', sim, k)); }
  /* 3. zamiana z treningiem innego dnia (najbliższe 6 dni) — wyraźne polecenie; tylko między dniami od dziś (A4: nigdy z przeszłością) i bez dni
   * zajętych; zamiana dzisiejszego treningu (wstawia inny trening na dziś) — na końcu przy tej samej liczbie sesji */
  if (from >= today && !busy.has(from)) for (let i = 1; i <= 6; i++) { const k = addDays(from, i); if (busy.has(k)) continue; const sim: Sim = { ov: { ...base0 } }; const there = simOn(sim)(k); if (!there || there === id) continue; simSet(sim, from, there); simSet(sim, k, id); out.push(make('swap', sim, k)); }
  /* 4. pominięcie */
  { const sim: Sim = { ov: { ...base0 } }; simSet(sim, from, null); out.push(make('skip', sim)); }
  /* docs/research/23 reguła 4: najpierw zachować sesje (objętość tygodnia), potem unikać nowych par pod rząd (reguła 1–2: ostrzeżenie), potem najmniej zmian */
  const score = (x: Suggestion) => [x.returns ? 0 : 1, x.dropped, x.kind === 'swap' && from === today ? 1 : 0, x.newBackToBack.length, x.changes];
  const sorted = out.sort((a, b) => { const sa = score(a), sb = score(b); for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sa[i] - sb[i]; return 0; });
  const seen = new Set<string>(); return sorted.filter(x => { const key = JSON.stringify(Object.entries(x.ov).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))); if (seen.has(key)) return false; seen.add(key); return true; });
}
/** Zastosowanie propozycji (na polecenie użytkownika). */
export function applySuggestion(sg: Suggestion) { putOv({ ...sg.ov }); tidy(); commit(); }
