import React, { useState } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Chip, Muted, Txt, H2 } from '@/components/ui';
import { workoutDay, getState, useTick, isDeloadWeek, toggleDeloadWeek, fmtDayKey, newTemplate } from '@/lib/store';
import { useTheme, F } from '@/lib/theme';
import { plannedOn, isChanged, setDayPlan, resetDay, addDays, dayKeyOf, suggest, applySuggestion, dayStatus, doneOn, pending, planTplName, hasPlan, assignTarget, RETURN_DAYS, type Suggestion } from '@/lib/plan';
import { askReminderPermission } from '@/lib/planReminder';
import { t, locale, lang } from '@/lib/i18n';
import { startTemplate } from '@/lib/start';

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
const longDay = (k: string) => dateOf(k).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
/** Najwyżej tyle pozycji listy „Przesuń albo pomiń” od razu; reszta po „Więcej możliwości”. */
const LIST_FIRST = 4;
/** Najwyżej tyle głównych akcji panelu (UX-13 A). */
const PRIMARY_MAX = 3;

type Act = { key: string; el: React.ReactElement };

export function DayPanel({ day }: { day: string }) {
  useTick(); const router = useRouter(); const th = useTheme(); const today = dayKeyOf(Date.now()); const past = day < today;
  const st = dayStatus(day, today); const id = st.templateId; const tpl = id ? getState().templates.find(x => x.id === id && !x.archived) : undefined;
  const act = getState().active; const activeHere = !!act && workoutDay(act) === day; const changed = isChanged(day, today);
  const waiting = (pending(st) || st.status === 'missed') && !activeHere; /* zaplanowany trening czeka (albo minął) — można go przesunąć / pominąć */
  const movable = waiting && !!tpl;
  const [mode, setMode] = useState<'none' | 'move' | 'pick'>('none'); const [more, setMore] = useState(false);
  const live = getState().templates.filter(x => !x.archived);
  const close = () => { setMode('none'); setMore(false); };
  const pickTpl = (x: string) => { const had = hasPlan(); setDayPlan(day, x); close(); if (!had) askReminderPermission().catch(() => {}); /* I1: pierwszy trening w planie */ };

  /* ---- stan dnia ---- */
  const lines: React.ReactElement[] = [];
  const link = (key: string, text: string, wid: string) => <Pressable accessibilityLanguage={lang()} key={key} accessibilityRole="link" accessibilityLabel={text} onPress={() => router.push(`/history/${wid}`)} hitSlop={6} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 2 })}><Txt style={{ fontSize: 15, color: th.accent, fontFamily: F.semibold }}>{`${text} ›`}</Txt></Pressable>;
  const ch = changed ? ` · ${t('zmiana planu')}` : '';
  if (st.status === 'done' || st.status === 'other') doneOn(day).forEach(w => lines.push(link(w.id, st.status === 'done' ? t('Zrobione: {name}', { name: w.templateName || t('Trening') }) : t('Zrobiony inny trening: {name}', { name: w.templateName || t('Trening') }), w.id)));
  if (st.status === 'other' || st.status === 'planned' || st.status === 'missed') lines.push(<Txt key="plan" style={{ fontSize: 15 }}>{(past ? t('Opuszczony: {name}', { name: tplName(id) }) : t('Zaplanowany: {name}', { name: tplName(id) })) + ch}</Txt>);
  else if (st.status === 'rest') lines.push(<Txt key="plan" style={{ fontSize: 15 }}>{t('Wolne') + ch}</Txt>);
  else if (changed) lines.push(<Muted key="plan" style={{ fontSize: 13 }}>{t('zmiana planu')}</Muted>);
  if (activeHere) lines.push(<Muted key="active" style={{ fontSize: 13 }}>{t('Trening w toku')}</Muted>);
  const empty = !!tpl && !tpl.items.length && pending(st);
  if (empty) lines.push(<Pressable accessibilityLanguage={lang()} key="empty" accessibilityRole="link" onPress={() => router.push(`/template/${tpl!.id}?edit=1`)}><Muted style={{ fontSize: 13 }}>{t('Szablon jest pusty — dodaj ćwiczenia')}</Muted></Pressable>);

  /* ---- akcje: główne (najwyżej 3) i „Więcej opcji” ---- */
  const primary: Act[] = []; const extra: Act[] = [];
  if (tpl && day === today && pending(st) && !act && tpl.items.length) primary.push({ key: 'start', el: <Btn small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tpl.name })} onPress={() => startTemplate(tpl, () => router.navigate('/'))} /> });
  /* UI-18 (audyt 0.10, G5): przy treningu w toku Start nie znika bez słowa — ta sama informacja co w podglądzie szablonu */
  else if (tpl && day === today && pending(st) && act && tpl.items.length) primary.push({ key: 'start', el: <Btn small kind="ghost" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tpl.name })} accessibilityHint={t('Trening w toku')} onPress={() => Alert.alert(t('Trening w toku'), t('Najpierw zakończ albo anuluj bieżący trening.'))} /> });
  if (movable) primary.push({ key: 'move', el: <Btn small title={t('Przesuń albo pomiń')} accessibilityHint={t('Lista możliwości: przesunięcie planu, przeniesienie tylko tego treningu, zamiana albo wolne — z uwzględnieniem regeneracji partii.')} onPress={() => setMode(mode === 'move' ? 'none' : 'move')} /> });
  if (!past && !activeHere && st.status !== 'done') primary.push({ key: 'pick', el: <Btn small title={id ? t('Inny trening') : t('Dodaj trening')} onPress={() => setMode(mode === 'pick' ? 'none' : 'pick')} /> });
  if (past && st.status !== 'done') primary.push({ key: 'past', el: <Btn nav small title={t('Zapisz trening z tego dnia')} accessibilityHint={t('Trening wstecz z datą tego dnia.')} onPress={() => router.push(`/history/add?date=${day}${tpl ? `&tpl=${tpl.id}` : ''}`)} /> });
  const deload = isDeloadWeek(keyTs(day));
  const secondary: Act[] = [
    ...(changed && !activeHere ? [{ key: 'reset', el: <Btn small kind="ghost" title={t('Przywróć z planu')} onPress={() => { resetDay(day); close(); }} /> }] : []),
    { key: 'deload', el: <Btn small kind="ghost" title={deload ? t('Zdejmij oznaczenie deload') : t('Oznacz tydzień jako deload')} onPress={() => toggleDeloadWeek(keyTs(day))} /> },
  ];
  extra.push(...primary.splice(PRIMARY_MAX), ...secondary);

  return (
    <View testID="day-panel" style={{ marginBottom: 10 }}>
      <H2>{longDay(day)}</H2>
      <View style={{ gap: 2 }}>{lines}</View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {primary.map(a => <React.Fragment key={a.key}>{a.el}</React.Fragment>)}
        {extra.length ? <Btn small kind="ghost" title={more ? t('Mniej opcji') : t('Więcej opcji')} accessibilityLabel={t('Więcej opcji')} accessibilityHint={t('Pozostałe akcje dla tego dnia.')} onPress={() => setMore(v => !v)} /> : null}
      </View>
      {more ? <View testID="day-more" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{extra.map(a => <React.Fragment key={a.key}>{a.el}</React.Fragment>)}</View> : null}
      {mode === 'move' && movable ? <MoveList day={day} onDone={close} /> : null}
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
  const [all, setAll] = useState(false); const list = suggest(day); const shown = all ? list : list.slice(0, LIST_FIRST);
  return (
    <View testID="suggestions" style={{ marginTop: 8, gap: 8 }}>
      <Muted style={{ fontSize: 12 }}>{t('Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu {n} dni, potem bez utraty treningów, bez nowych par dzień po dniu z tymi samymi partiami i z najmniejszą liczbą zmienionych dni.', { n: RETURN_DAYS })}</Muted>
      {shown.map((sg, i) => { const { title, details } = suggestionTexts(day, sg); return (
        <View key={`${sg.kind}-${sg.to ?? ''}`} style={{ gap: 2 }}>
          <Txt style={{ fontSize: 14 }}>{i === 0 && list.length > 1 ? `${title} · ${t('polecane')}` : title}</Txt>
          {details.map((d, j) => <Muted key={j} style={{ fontSize: 12 }}>{d}</Muted>)}
          <Btn small title={t('Zastosuj')} accessibilityLabel={t('Zastosuj: {title}', { title })} onPress={() => { applySuggestion(sg); onDone(); }} style={{ alignSelf: 'flex-start', marginTop: 2 }} />
        </View>); })}
      {!all && list.length > LIST_FIRST ? <Btn small kind="ghost" title={t('Więcej możliwości ({n})', { n: list.length - LIST_FIRST })} onPress={() => setAll(true)} style={{ alignSelf: 'flex-start' }} /> : null}
      <Muted style={{ fontSize: 12 }}>{[t('Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM).'), ...(list.every(x => x.returns) ? [t('Każda z tych możliwości wraca do rutyny w ciągu {n} dni.', { n: RETURN_DAYS })] : [])].join(' ')}</Muted>
    </View>
  );
}
