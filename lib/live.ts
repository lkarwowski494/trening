import { exById, focusSet, isBW, fmtSec, fmtDist, occurrence, occurrences } from './store';
import { t, tp, exName, lang } from './i18n';
import { wu, unitLabel, distLabel, distLongLabel, wOut, fmtNum, isImperial, DIST_LONG_FROM_M, M_PER_MI, M_PER_YD } from './units';
import { hasWeight, hasReps, hasTime, hasDistance, SET_KIND_MARK, type Exercise, type SetKind, type WExercise, type WSet, type Workout } from './seed';

/*
 * Trening na żywo — teksty wyliczane z danych treningu w toku, wspólne dla ekranu (components/ActiveWorkout.tsx), timera (lib/timer.ts:
 * Live Activity i powiadomienie po restarcie) i testów. Audyt 0.10 (08.10.2026): LIVE-04 / LIVE-15 (podpis przerwy), UI-10 / LIVE-14 (karta).
 */

/**
 * Etykieta serii z listy typów — jedna numeracja w treningu, szablonie i szczegółach sesji: „W” dla rozgrzewki, numer serii roboczej z literą typu
 * („2F”), drop set — numer serii, po której jest („3D”; audyt 0.10, LIVE-14: drop set to część serii — runda 72 T6 — a nie kolejna seria; wcześniej
 * „4D”). Poza listą — numer pozycji.
 */
export function setMarkOf(kinds: readonly (SetKind | undefined)[], i: number): string {
  if (i < 0 || i >= kinds.length) return String(i + 1); const k = kinds[i] ?? 'normal'; if (k === 'warmup') return 'W';
  const n = kinds.slice(0, i + 1).filter(x => x !== 'warmup' && x !== 'drop').length; return `${Math.max(1, n)}${SET_KIND_MARK[k]}`;
}
/** Etykieta serii jak na ekranie — ta sama w dostępności, menu, podpisie przerwy i Live Activity (setMarkOf). */
export function setLabel(e: WExercise, si: number): string { return setMarkOf(e.sets.map(s => s.kind), si); }

/**
 * Zapowiedź po serii `setId` — JEDEN tekst dla głosu (lib/voice.ts), podpisu przerwy na ekranie, Live Activity, powiadomienia po restarcie i zegarków
 * (lib/watch/*; decyzje właściciela 13.10.2026): następna seria do zrobienia według tej samej reguły co karta „teraz” — store.focusSet w stanie PO
 * odhaczeniu tej serii, z pominięciem bloków „Pomiń dziś” i usuniętych ćwiczeń (audyt 0.10, LIVE-04) — wraz z ciężarem i liczbą powtórzeń
 * (`spokenLoad`; BEZ talerzy, każda siłownia ma inne). To samo ćwiczenie albo ten sam superset — „nazwa · seria n, 80 kg, 8 powtórzeń”, inne
 * ćwiczenie — „dalej: nazwa, 80 kg, 8 powtórzeń”. Pole puste = pominięte (nie zgadujemy liczby). Nic nie zostało (decyzja B: przerwa po ostatniej serii
 * zostaje) — „nic więcej do zrobienia” i `last` (powiadomienie bez „Następna seria.”, lib/timer.ts). `''` = brak takiej serii.
 */
export function restCue(a: Workout, setId: string): { text: string; speech: string; last: boolean } {
  const text = buildCue(a, setId, false); const speech = buildCue(a, setId, true);
  return { text: text.text, speech: speech.text, last: text.last };
}
/** Składa zapowiedź; `spoken` = ciężar z pełną nazwą jednostki (głos), inaczej ze skrótem (ekran, Live Activity, zegarek). Jedno miejsce składania obu wersji. */
function buildCue(a: Workout, setId: string, spoken: boolean): { text: string; last: boolean } {
  let ei = -1, si = -1;
  for (let i = 0; i < a.exercises.length && ei < 0; i++) { const j = a.exercises[i].sets.findIndex(s => s.id === setId); if (j >= 0) { ei = i; si = j; } }
  if (ei < 0) return { text: '', last: false };
  const e = a.exercises[ei];
  const pos = focusSet(a, setId); if (!pos) return { text: t('nic więcej do zrobienia'), last: true };
  const x = a.exercises[pos.ei]; const xe = exById(x.exerciseId); const nm = exName(xe); const same = pos.ei === ei || (!!e.groupId && x.groupId === e.groupId);
  const head = same ? `${nm} · ${spoken ? spokenSetLabel(x, pos.si) : t('seria {n}', { n: setLabel(x, pos.si) })}` : t('dalej: {name}', { name: nm });
  const load = xe ? loadText(xe, x.sets[pos.si], spoken) : '';
  return { text: load ? `${head}, ${load}` : head, last: false };
}
/**
 * Podpis przerwy po serii (ei, si) — `restCue` dla serii na tej pozycji. Wspólny dla odhaczenia, ponownego pomiaru, zamiany, „Pomiń dziś” i odtworzenia
 * przerwy po restarcie (LIVE-15). Pozycja poza treningiem — pusty podpis.
 */
export function restLabel(a: Workout, ei: number, si: number): { sub: string; last: boolean } {
  const s = a.exercises[ei]?.sets[si]; if (!s) return { sub: '', last: false };
  const c = restCue(a, s.id); return { sub: c.text, last: c.last };
}
/**
 * Pełna, odmieniona nazwa jednostki ciężaru dla głosu (syntezator mowy literuje skróty „kg”, „lb”): „kilogram|kilogramy|kilogramów”, „funt|funty|funtów”
 * wg liczby mnogiej `tp()`. Ułamek (62,5) ma w wielu językach własną formę (CLDR, v ≠ 0: pl „62,5 kilograma”, cs/sk „kilogramu”, lt „kilogramo”,
 * ru/uk „килограмма/кілограма”) — klucze „kilograma” / „funta”; fr i pt-BR czytają ułamek poniżej 2 w liczbie pojedynczej (CLDR: one = i 0..1).
 * Uproszczenie: hr/sr/lv mają „one” także dla ułamków kończących się na 1 (62,1) — tu forma „other”. `n` = wartość w jednostce aplikacji.
 */
export function spokenUnit(n: number): string {
  return wu() === 'lb' ? spokenNoun(n, 'funt|funty|funtów', 'funta') : spokenNoun(n, 'kilogram|kilogramy|kilogramów', 'kilograma');
}
/** Nazwa jednostki przy liczbie `n` do głosu: całkowita — `tp(many)`, ułamek — osobna forma `frac` (CLDR, v ≠ 0); fr i pt-BR: ułamek poniżej 2 w liczbie pojedynczej. */
function spokenNoun(n: number, many: string, frac: string): string {
  const a = Math.abs(n);
  if (Number.isInteger(a)) return tp(a, many);
  if ((lang() === 'fr' || lang() === 'pt-BR') && a < 2) return tp(1, many);
  return t(frac);
}
/** Dystans w metrach do głosu: „400 metrów”, „1 metr”, „12,5 metra” (zamiast „400 m”, które syntezator literuje). */
export const spokenMeters = (m: number): string => `${Number.isInteger(m) ? m : fmtNum(m, 2)} ${spokenNoun(m, 'metr|metry|metrów', 'metra')}`;
/** Dystans do głosu w systemie użytkownika (M2-LOK07-01): metryczny jak `spokenMeters`; imperialny pełne jardy („100 jardów”) albo mile (od 1 mi, do 2 miejsc). */
export function spokenDist(m: number): string {
  if (!isImperial()) return spokenMeters(m);
  if (m >= DIST_LONG_FROM_M.imperial) { const v = Math.round(m / M_PER_MI * 100) / 100; return `${Number.isInteger(v) ? v : fmtNum(v, 2)} ${spokenNoun(v, 'mila|mile|mil', 'mili')}`; }
  const y = Math.round(m / M_PER_YD); return `${y} ${spokenNoun(y, 'jard|jardy|jardów', 'jarda')}`;
}
/** Dystans na ekran blokady / do wiersza serii: metryczny jak dotąd (liczba i „m”), imperialny yd albo mi (próg 1 mi). */
export function distParts(m: number): { num: string; unit: string } {
  if (!isImperial()) return { num: String(m), unit: distLabel() };
  return m >= DIST_LONG_FROM_M.imperial ? { num: fmtNum(m / M_PER_MI, 2), unit: distLongLabel() } : { num: String(Math.round(m / M_PER_YD)), unit: distLabel() };
}
/** Czas do głosu słowami: „45 sekund”, „1 minuta 30 sekund”, „25 minut”, „1 godzina 5 minut” (zamiast „45 s” i zegarowego „25:00”, które syntezator czyta jak skrót lub godzinę). */
export function spokenDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60; const out: string[] = [];
  const part = (n: number, forms: string) => `${n} ${tp(n, forms)}`;
  if (h) out.push(part(h, 'godzina|godziny|godzin')); if (m) out.push(part(m, 'minuta|minuty|minut')); if (r || !out.length) out.push(part(r, 'sekunda|sekundy|sekund'));
  return out.join(' ');
}
/** Etykieta serii do głosu bez liter typu („2F”, „W”, „3D” syntezator literuje): rozgrzewka, „seria 3, drop set”, „seria 2, do upadku”, „seria 2”. */
function spokenSetLabel(e: WExercise, si: number): string {
  const k = e.sets[si]?.kind ?? 'normal'; const mark = setLabel(e, si);
  if (k === 'warmup') return t('rozgrzewka');
  const base = t('seria {n}', { n: mark.replace(/[A-Z]$/, '') });
  return k === 'drop' ? `${base}, ${t('drop set')}` : k === 'failure' ? `${base}, ${t('do upadku')}` : base;
}
/** Ciężar, dystans, powtórzenia i czas serii w kolejnych polach; `spoken` = jednostka ciężaru pełnym słowem (głos), inaczej skrót jak na karcie „teraz”. */
function loadText(ex: Exercise, set: WSet, spoken: boolean): string {
  const m = ex.metric ?? 'weight_reps'; const out: string[] = [];
  if (hasWeight(m)) {
    const p = nowParts(ex, set);
    if (p.num !== '—') {
      const v = isBW(ex) ? Number(set.addKg) : Number(set.weight);
      out.push(p.num + (p.unit ? ' ' + (spoken ? spokenUnit(wOut(v)) : p.unit) : ''));
    }
  }
  if (hasDistance(m) && Number(set.distanceM) > 0) out.push(spoken ? spokenDist(Number(set.distanceM)) : isImperial() ? fmtDist(Number(set.distanceM)) : `${set.distanceM} m`);
  { const n = Number(set.reps); if (hasReps(m) && n > 0) out.push(`${n} ${tp(n, 'powtórzenie|powtórzenia|powtórzeń')}`); }
  if (hasTime(m) && Number(set.durationSec) > 0) out.push(spoken ? spokenDuration(Number(set.durationSec)) : fmtSec(Number(set.durationSec)));
  return out.join(', ');
}
/**
 * Ciężar i powtórzenia serii słowami DO GŁOSU: „80 kilogramów, 8 powtórzeń”, „+10 kilogramów, 8 powtórzeń”, „masa ciała, 12 powtórzeń”, „45 sekund”,
 * „5000 metrów, 25 minut”. Pole puste (albo 0) jest pomijane — zapowiedź nie zgaduje liczby. Ciężar w jednostce aplikacji (kg/lb) jak karta „teraz”
 * (`nowParts`), ale z pełną nazwą jednostki (`spokenUnit`). Dystans i czas też pełnymi słowami (`spokenMeters`, `spokenDuration`).
 */
export const spokenLoad = (ex: Exercise, set: WSet): string => loadText(ex, set, true);
/** Ten sam tekst ze skrótem jednostki (kg/lb) — ekran, Live Activity, powiadomienie i zegarek. */
export const cueLoad = (ex: Exercise, set: WSet): string => loadText(ex, set, false);
/** Licznik na karcie „teraz” jako tekst (jedno źródło dla karty i zegarka): „seria 2 z 4”, „rozgrzewka”, „seria 2 z 4 · drop set”. */
export function counterLabel(e: WExercise, si: number): string {
  const c = focusCounter(e, si);
  return c.kind === 'warmup' ? t('rozgrzewka') : c.kind === 'drop' ? t('seria {n} z {all} · drop set', { n: c.n, all: c.all }) : t('seria {n} z {all}', { n: c.n, all: c.all });
}

/** Podpis stopera serii na Live Activity: „nazwa · seria n” (dwa bloki tego samego ćwiczenia — „nazwa (k)”). Wspólny dla startu pomiaru
 * (components/ActiveWorkout.tsx) i odświeżenia po zmianie języka (lib/timer.ts, Q-004). */
export function timedLabel(w: Workout, ei: number, si: number): string {
  const e = w.exercises[ei]; if (!e) return '';
  const nm = occurrences(w.exercises, e.exerciseId) > 1 ? `${exName(exById(e.exerciseId))} (${occurrence(w.exercises, ei) + 1})` : exName(exById(e.exerciseId));
  return `${nm} · ${t('seria {n}', { n: setLabel(e, si) })}`;
}

/**
 * Duża liczba na karcie „teraz” (audyt 0.10, UI-10 / LIVE-14, wariant A): jednostka zaraz po ciężarze — „80 kg × 8”, „20 kg × 45s”,
 * masa ciała „+10 kg × 8” / „masa ciała × 8”, dystans „5000 m · 25:00”; puste pole — „—”. `num` + `unit` (mniejszym krojem) + `tail`;
 * ta sama treść w etykiecie VoiceOver. Liczby w jednostce aplikacji (kg/lb), jak w polach serii.
 */
export function nowParts(ex: Exercise, set: WSet): { num: string; unit: string; tail: string } {
  const m = ex.metric ?? 'weight_reps'; const empty = (v: unknown) => v === '' || v == null; const dig = wu() === 'lb' ? 1 : 2;
  const reps = empty(set.reps) ? '—' : String(set.reps); const time = empty(set.durationSec) ? '—' : fmtSec(Number(set.durationSec));
  let num: string, unit = ''; const rest: string[] = []; let sep = ' × ';
  if (hasWeight(m)) {
    if (isBW(ex)) { const a = Number(set.addKg); if (empty(set.addKg) || !a) num = t('masa ciała'); else { num = (a > 0 ? '+' : '') + fmtNum(wOut(a), dig); unit = unitLabel(); } }
    else if (empty(set.weight)) num = '—'; else { num = fmtNum(wOut(Number(set.weight)), dig); unit = unitLabel(); }
    if (hasReps(m)) rest.push(reps); if (hasDistance(m)) rest.push(empty(set.distanceM) ? '—' : (d => `${d.num} ${d.unit}`)(distParts(Number(set.distanceM)))); /* ciężar + dystans (09.10.2026): „40 kg × 30 m” */ if (hasTime(m)) rest.push(time);
  } else if (hasDistance(m)) { if (empty(set.distanceM)) num = '—'; else { ({ num, unit } = distParts(Number(set.distanceM))); } sep = ' · '; if (hasTime(m)) rest.push(time); }
  else if (hasReps(m)) { num = reps; if (hasTime(m)) rest.push(time); }
  else num = hasTime(m) ? time : '—';
  return { num, unit, tail: rest.map(x => sep + x).join('') };
}

/**
 * Licznik na karcie „teraz” (audyt 0.10, LIVE-14): „seria k z n” bez drop setów — n = serie robocze (bez rozgrzewek i drop setów), k jak w etykiecie
 * wiersza (setLabel); drop set — „seria k z n · drop set” (drop serii k).
 */
export function focusCounter(e: WExercise, si: number): { kind: 'warmup' | 'normal' | 'drop'; n: string; all: number } {
  const all = e.sets.filter(x => x.kind !== 'warmup' && x.kind !== 'drop').length; const s = e.sets[si];
  if (!s || s.kind === 'warmup') return { kind: 'warmup', n: 'W', all };
  return s.kind === 'drop' ? { kind: 'drop', n: setLabel(e, si).replace(/D$/, ''), all } : { kind: 'normal', n: setLabel(e, si), all };
}
