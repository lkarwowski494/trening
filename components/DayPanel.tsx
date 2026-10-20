import React, { useState } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Chip, Muted, Txt, H2, useOnce } from '@/components/ui';
import { IconRow } from '@/components/Icon';
import { InfoTip } from '@/components/InfoTip';
import { workoutDay, getState, useTick, isDeloadWeek, toggleDeloadWeek, fmtDayKey, newTemplate, visibleLocations, PLAN_PLACE_RANGE_MAX } from '@/lib/store';
import { useTheme, F } from '@/lib/theme';
import { plannedOn, isChanged, setDayPlan, resetDay, addDays, dayKeyOf, suggest, suggestionOrder, SUGGEST_FIRST, applySuggestion, dayStatus, doneOn, pending, planTplName, hasPlan, assignTarget, RETURN_DAYS, earlyWorkout, undoDoneEarly, plannedPlace, plannedPlaceName, setPlanPlace, clearPlanPlace, placeRun, type Suggestion } from '@/lib/plan';
import { askReminderPermission } from '@/lib/planReminder';
import { t, locale, lang } from '@/lib/i18n';
import { startTemplate, workoutInProgressNotice } from '@/lib/start';
import { DayHealth } from '@/components/HealthLines';
import { fmtWeekdayDayMonth } from '@/lib/calendar';

/*
 * Panel wybranego dnia w Kalendarzu (priorytet właściciela 08.10.2026): co jest zaplanowane i co z tym zrobić.
 * Dwa tryby przesuwania (decyzja właściciela): „Przesuń plan o 1 dzień” — łańcuch tylko do pierwszego wolnego dnia; „Przesuń tylko ten trening”
 * — na wybrany dzień, a na dzień z innym treningiem tylko po wyraźnym poleceniu („Zamień z …”).
 * Audyt 0.10 (08.10.2026):
 * - A2: stan dnia z jednej funkcji (dayStatus) — dzień zrobiony: „Zrobione: <sesja> ›” (link do sesji), bez przesuwania; trening w toku — bez przesuwania;
 * - A5 (decyzja wieczór — dopasowanie po szablonie): zrobiony inny trening — „Zrobiony inny trening: <sesja> ›”, zaplanowany czeka (przesuń albo pomiń);
 * - A4: miniony dzień — „Przesuń plan od dziś”, przeniesienie od dziś, „Wolne w tym dniu”, „Zapisz trening z tego dnia”; zamiana tylko od dziś;
 * - A8: pusty szablon — bez Startu, „Szablon jest pusty — dodaj ćwiczenia”;
 * - UX-13 A (decyzja wieczór): najwyżej 3 główne akcje stanu dnia, reszta pod „Więcej opcji”; przesunięcia i pominięcie w JEDNEJ liście
 *   („Przesuń albo pomiń”, uszeregowanej jak dawne „Propozycje”) — bez powielonych akcji; D4: „Oznacz tydzień jako deload” dla każdego tygodnia.
 */
const tplName = planTplName;
const dateOf = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const keyTs = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), 12).getTime();
export const shortDay = (k: string) => fmtDayKey(k); /* H3 (audyt 0.10): jeden format daty dnia */
const longDay = (k: string) => fmtWeekdayDayMonth(dateOf(k));
/** Najwyżej tyle głównych akcji panelu (UX-13 A). */
const PRIMARY_MAX = 3;

type Act = { key: string; el: React.ReactElement };

export function DayPanel({ day }: { day: string }) {
  useTick(); const router = useRouter(); const once = useOnce(); /* UI2-02: przejścia z blokadą podwójnego tapnięcia */ const th = useTheme(); const today = dayKeyOf(Date.now()); const past = day < today;
  const st = dayStatus(day, today); const id = st.templateId; const tpl = id ? getState().templates.find(x => x.id === id && !x.archived) : undefined;
  const act = getState().active; const activeHere = !!act && workoutDay(act) === day; const changed = isChanged(day, today);
  const waiting = (pending(st) || st.status === 'missed') && !activeHere; /* zaplanowany trening czeka (albo minął) — można go przesunąć / pominąć */
  const movable = waiting && !!tpl;
  const [mode, setMode] = useState<'none' | 'move' | 'pick' | 'place'>('none'); const [more, setMore] = useState(false);
  const live = getState().templates.filter(x => !x.archived);
  const close = () => { setMode('none'); setMore(false); };
  const pickTpl = (x: string) => { const had = hasPlan(); setDayPlan(day, x); close(); if (!had) askReminderPermission().catch(() => {}); /* I1: pierwszy trening w planie */ };

  /* ---- stan dnia ---- */
  const lines: React.ReactElement[] = [];
  const link = (key: string, text: string, wid: string) => <Pressable accessibilityLanguage={lang()} key={key} accessibilityRole="button" accessibilityLabel={text} onPress={once(() => router.push(`/history/${wid}`))} hitSlop={6} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, minHeight: 44, justifyContent: 'center' })}><Txt style={{ fontSize: 15, color: th.accent, fontFamily: F.semibold }}>{`${text} ›`}</Txt></Pressable>;
  const ch = changed ? ` · ${t('zmiana planu')}` : '';
  if (st.early) { const w = earlyWorkout(day, today); lines.push(w ? link(w.id, t('Zrobiony wcześniej: {name}', { name: tplName(id) }), w.id) : <Txt key="early" style={{ fontSize: 15 }}>{t('Zrobiony wcześniej: {name}', { name: tplName(id) })}</Txt>); lines.push(<Muted key="early-free" style={{ fontSize: 13 }}>{t('Trening z tego dnia zrobiony wcześniej — dzień wolny.')}</Muted>); }
  else if (st.status === 'done' || st.status === 'other') doneOn(day).forEach(w => lines.push(link(w.id, st.status === 'done' ? t('Zrobione: {name}', { name: w.templateName || t('Trening') }) : t('Zrobiony inny trening: {name}', { name: w.templateName || t('Trening') }), w.id)));
  if (st.status === 'other' || st.status === 'planned' || st.status === 'missed') lines.push(<Txt key="plan" style={{ fontSize: 15 }}>{(past ? t('Opuszczony: {name}', { name: tplName(id) }) : t('Zaplanowany: {name}', { name: tplName(id) })) + ch}</Txt>);
  else if (st.status === 'rest') lines.push(<Txt key="plan" style={{ fontSize: 15 }}>{t('Wolne') + ch}</Txt>);
  else if (changed) lines.push(<Muted key="plan" style={{ fontSize: 13 }}>{t('zmiana planu')}</Muted>);
  if (activeHere) lines.push(<Muted key="active" style={{ fontSize: 13 }}>{t('Trening w toku')}</Muted>);
  const placeName = plannedPlaceName(day); /* 0.19 (docs/33 B): miejsce zapisane w planie na ten dzień */
  if (placeName) lines.push(<IconRow key="place" icon="pin" color={th.muted} size={15}><Muted testID="day-place" accessibilityLabel={t('Miejsce treningu: {l}', { l: placeName })} style={{ fontSize: 15 }}>{placeName}</Muted></IconRow>);
  const empty = !!tpl && !tpl.items.length && pending(st);
  if (empty) lines.push(<Pressable accessibilityLanguage={lang()} key="empty" accessibilityRole="button" onPress={once(() => router.push(`/template/${tpl!.id}?edit=1`))} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Muted style={{ fontSize: 13 }}>{t('Szablon jest pusty — dodaj ćwiczenia')}</Muted></Pressable>);

  /* ---- akcje: główne (najwyżej 3) i „Więcej opcji” ---- */
  const primary: Act[] = []; const extra: Act[] = [];
  if (tpl && day === today && pending(st) && !act && tpl.items.length) primary.push({ key: 'start', el: <Btn nav small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tpl.name })} onPress={() => startTemplate(tpl, () => router.navigate('/'), 'calendar')} /> });
  /* UI-18 (audyt 0.10, G5): przy treningu w toku Start nie znika bez słowa — ta sama informacja co w podglądzie szablonu */
  else if (tpl && day === today && pending(st) && act && tpl.items.length) primary.push({ key: 'start', el: <Btn small kind="ghost" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tpl.name })} accessibilityHint={t('Trening w toku')} onPress={workoutInProgressNotice} /> });
  if (movable) primary.push({ key: 'move', el: <Btn small title={t('Przesuń albo pomiń')} accessibilityHint={t('Lista możliwości: przesunięcie planu, przeniesienie tylko tego treningu, zamiana albo wolne — z uwzględnieniem regeneracji partii.')} onPress={() => setMode(mode === 'move' ? 'none' : 'move')} /> });
  if (!past && !activeHere && st.status !== 'done') primary.push({ key: 'pick', el: <Btn small title={id ? t('Zmień szablon') : t('Dodaj do planu')} onPress={() => setMode(mode === 'pick' ? 'none' : 'pick')} /> });
  if (past && st.status !== 'done') primary.push({ key: 'past', el: <Btn nav small title={t('Dopisz trening wstecz')} accessibilityHint={t('Trening wstecz z datą tego dnia.')} onPress={() => router.push(`/history/add?date=${day}${tpl ? `&tpl=${tpl.id}` : ''}`)} /> });
  if (st.early) primary.push({ key: 'undo-early', el: <Btn small title={t('Cofnij')} accessibilityLabel={t('Cofnij: {name} znów zaplanowany na ten dzień', { name: tplName(id) })} accessibilityHint={t('Dzień wraca do planu — trening nie liczy się już jako zrobiony.')} onPress={() => { undoDoneEarly(day); close(); }} /> });
  const deload = isDeloadWeek(keyTs(day));
  const secondary: Act[] = [
    ...(changed && !activeHere ? [{ key: 'reset', el: <Btn small kind="ghost" title={t('Przywróć z planu')} onPress={() => { resetDay(day); close(); }} /> }] : []),
    { key: 'deload', el: <Btn small kind="ghost" title={deload ? t('Zdejmij oznaczenie deload') : t('Oznacz tydzień jako deload')} onPress={() => toggleDeloadWeek(keyTs(day))} /> },
  ];
  const canPlace = !past && visibleLocations().length > 0; /* 0.19: miejsce na dni — od dziś, gdy są miejsca (bez miejsc nie ma z czego wybierać) */
  if (canPlace) secondary.push({ key: 'place', el: <Btn small kind="ghost" expanded={mode === 'place'} icon="pin" title={t('Miejsce na te dni')} onPress={() => setMode(mode === 'place' ? 'none' : 'place')} /> });
  extra.push(...primary.splice(PRIMARY_MAX), ...secondary);

  return (
    <View testID="day-panel" style={{ marginBottom: 10 }}>
      <H2>{longDay(day)}</H2>
      <View style={{ gap: 2 }}>{lines}</View>
      <DayHealth day={day} />{/* 0.16.0 (docs/29 5.5): Apple Health — kroki i inne aktywności dnia, tylko do wglądu */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {primary.map(a => <React.Fragment key={a.key}>{a.el}</React.Fragment>)}
        {extra.length ? <Btn small kind="ghost" expanded={more} title={more ? t('Mniej opcji') : t('Więcej opcji')} accessibilityLabel={t('Więcej opcji')} accessibilityHint={t('Pozostałe akcje dla tego dnia.')} onPress={() => setMore(v => !v)} /> : null}
      </View>
      {more ? <View testID="day-more" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{extra.map(a => <React.Fragment key={a.key}>{a.el}</React.Fragment>)}</View> : null}
      {mode === 'move' && movable ? <MoveList day={day} onDone={close} /> : null}
      {mode === 'place' && canPlace ? <PlaceRange day={day} onDone={close} /> : null}
      {mode === 'pick' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {live.length ? live.map(x => <Chip key={x.id} label={x.name} on={x.id === id} onPress={() => pickTpl(x.id)} />) : <Muted style={{ fontSize: 13 }}>{t('Nie masz jeszcze szablonów.')}</Muted>}
        {/* docs/18 09.10.2026 (B): nowy szablon — po „Zapisz” trafia na ten dzień (zmiana pojedynczego dnia) */}
        <Btn nav small kind="ghost" title={t('+ Nowy szablon')} accessibilityHint={t('Po zapisie szablon trafi na ten dzień.')} onPress={() => { close(); const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1&assign=${encodeURIComponent(assignTarget.day(day))}`); }} />
      </View> : null}
    </View>
  );
}

/** Opis pozycji listy: co się zmienia, ile dni, ostrzeżenia o parach dzień po dniu (docs/research/23 — uproszczenie, ostrzeżenie zamiast blokady). */
export function suggestionTexts(day: string, sg: Suggestion, today = dayKeyOf(Date.now())): { title: string; details: string[] } {
  const title = sg.kind === 'shift' ? (day < today ? t('Przesuń plan od dziś') : t('Przesuń plan o 1 dzień')) : sg.kind === 'move' ? t('Przenieś na {day}', { day: shortDay(sg.to!) })
    : sg.kind === 'swap' ? t('Zamień z {day} ({name})', { day: shortDay(sg.to!), name: tplName(plannedOn(sg.to!)) }) : t('Wolne w tym dniu');
  const details: string[] = [];
  if (sg.kind === 'shift' && sg.placed.length) details.push(sg.placed.map(p => `${tplName(p.id)} → ${shortDay(p.to)}`).join(', '));
  details.push(t('Zmienione dni: {n}', { n: sg.changes }));
  if (sg.dropped) details.push(t('Wypada treningów: {n}', { n: sg.dropped }));
  sg.newBackToBack.forEach(p => details.push(t('Uwaga: {a} i {b} dzień po dniu — te same główne partie.', { a: shortDay(p.a), b: shortDay(p.b) })));
  if (!sg.returns) details.push(t('Zmiany sięgają dalej niż {n} dni.', { n: RETURN_DAYS }));
  return { title, details };
}

/** „Przesuń albo pomiń” (audyt 0.10 UX-13 A, MER-16): jedna lista możliwości, uszeregowana; pierwsza — „polecane”. */
function MoveList({ day, onDone }: { day: string; onDone: () => void }) {
  const [all, setAll] = useState(false); const list = suggestionOrder(suggest(day), day) /* UX2-09: miniony dzień — przesunięcie i wolne od razu */; const shown = all ? list : list.slice(0, SUGGEST_FIRST);
  /* UX2-09: przy widocznym ostrzeżeniu „dzień po dniu” bez zdania „dwa dni pod rząd … też są w porządku” (sprzeczność na jednym ekranie) — zostaje objaśnienie uproszczenia; ⓘ (14.10.2026): kolejność i uproszczenie pod ⓘ */
  const simplification = [shown.some(x => x.newBackToBack.length) ? t('Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami.') : t('Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM).'), ...(list.every(x => x.returns) ? [t('Każda z tych możliwości wraca do rutyny w ciągu {n} dni.', { n: RETURN_DAYS })] : [])].join(' ');
  return (
    <View testID="suggestions" style={{ marginTop: 8, gap: 8 }}>
      <InfoTip id="move-list" label={t('Możliwości w kolejności')} info={[t('Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu {n} dni, potem bez utraty treningów, bez nowych par dzień po dniu z tymi samymi partiami i z najmniejszą liczbą zmienionych dni.', { n: RETURN_DAYS }), simplification]}>
        <Muted style={{ fontSize: 12 }}>{t('Możliwości w kolejności')}</Muted>
      </InfoTip>
      {shown.map((sg, i) => { const { title, details } = suggestionTexts(day, sg); return (
        <View key={`${sg.kind}-${sg.to ?? ''}`} style={{ gap: 2 }}>
          <Txt style={{ fontSize: 14 }}>{i === 0 && list.length > 1 ? `${title} · ${t('polecane')}` : title}</Txt>
          {details.map((d, j) => <Muted key={j} style={{ fontSize: 12 }}>{d}</Muted>)}
          <Btn small title={t('Zastosuj')} accessibilityLabel={t('Zastosuj: {title}', { title })} onPress={() => { applySuggestion(sg); onDone(); }} style={{ alignSelf: 'flex-start', marginTop: 2 }} />
        </View>); })}
      {!all && list.length > SUGGEST_FIRST ? <Btn small kind="ghost" title={t('Więcej możliwości ({n})', { n: list.length - SUGGEST_FIRST })} onPress={() => setAll(true)} style={{ alignSelf: 'flex-start' }} /> : null}
    </View>
  );
}

/** 0.19 (docs/33 B, P6 B): „📍 Miejsce na te dni” — miejsce (z listy albo „Inne miejsce…”) i zakres od–do: „Od” to wybrany dzień, „Do” przesuwa się o dzień (−/+, najwyżej
 * PLAN_PLACE_RANGE_MAX dni). „Ustaw miejsce” zapisuje State.planPlaces; „Usuń miejsce” zdejmuje je z całego zakresu wokół dnia. */
function PlaceRange({ day, onDone }: { day: string; onDone: () => void }) {
  const router = useRouter(); const locs = visibleLocations(); const run = placeRun(day);
  const [pick, setPick] = useState<string | null>(run?.locationId && locs.some(l => l.id === run.locationId) ? run.locationId : null);
  const [to, setTo] = useState(run?.to ?? day); const last = addDays(day, PLAN_PLACE_RANGE_MAX - 1);
  const setPlace = () => { if (pick && setPlanPlace(day, to, pick)) onDone(); };
  return (
    <View testID="place-range" style={{ marginTop: 8, gap: 8 }}>
      <InfoTip id="place-range" label={t('Start w tych dniach weźmie to miejsce. Nic nie zmienia się samo.')} info={t('Start treningu w tych dniach weźmie to miejsce przed miejscem szablonu, a okno „Dostosuj” zaproponuje zamiany. Nic nie zmienia się samo.')}>
        <Muted style={{ fontSize: 12 }}>{t('Start w tych dniach weźmie to miejsce. Nic nie zmienia się samo.')}</Muted>
      </InfoTip>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {locs.map(l => <Chip key={l.id} label={l.name} on={pick === l.id} onPress={() => setPick(l.id)} />)}
        <Btn nav small kind="ghost" title={t('Inne miejsce…')} onPress={() => router.push(`/place-once?from=${day}&to=${to}`)} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Txt style={{ fontSize: 14 }}>{t('Od: {day}', { day: shortDay(day) })}</Txt>
        <Muted testID="place-to" style={{ fontSize: 14 }}>{t('Do: {day}', { day: shortDay(to) })}</Muted>
        <Btn small kind="ghost" title="−" accessibilityLabel={t('Dzień wcześniej')} accessibilityHint={t('Do: {day}', { day: shortDay(to) })} onPress={() => { if (to > day) setTo(addDays(to, -1)); }} />
        <Btn small kind="ghost" title="+" accessibilityLabel={t('Dzień później')} accessibilityHint={t('Do: {day}', { day: shortDay(to) })} onPress={() => { if (to < last) setTo(addDays(to, 1)); }} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {pick ? <Btn small title={t('Ustaw miejsce')} onPress={setPlace} /> : null}
        {plannedPlace(day) ? <Btn small kind="ghost" title={t('Usuń miejsce')} accessibilityLabel={run && run.from !== run.to ? t('Usuń miejsce: {a} – {b}', { a: shortDay(run.from), b: shortDay(run.to) }) : t('Usuń miejsce')} onPress={() => { clearPlanPlace(day); onDone(); }} /> : null}
      </View>
    </View>
  );
}
