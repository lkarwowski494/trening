import React from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { Muted, Txt, upperText, useOnce } from '@/components/ui';
import { IconRow } from '@/components/Icon';
import { useTheme, NUM_SCALE_MAX, FW, font, maxScale, RADIUS, SIZE, SPACE } from '@/lib/theme';
import { getState, finishedWorkouts, useForegroundTick, isDeloadWeek, fmtDayKey, exById, reps } from '@/lib/store';
import { plannedPlaceName, hasPlan, dayKeyOf, doneOn, upcoming, pending, planTplName, planName, addDays, type DayStatus } from '@/lib/plan';
import { weekStrip } from '@/lib/dashboard';
import { DayIcon } from '@/components/Motif';
import { dayMark } from '@/lib/motif';
import { t, tp, lang, exName } from '@/lib/i18n';
import { fmtWeekdayShort, fmtWeekdayNarrow, fmtWeekdayDayMonth, fmtDayNum, stripColumnPt, stripLabelsFit, STRIP_GAP, STRIP_PAD, STRIP_BORDER } from '@/lib/calendar';

/*
 * Karta „Dziś” na ekranie treningu (decyzje właściciela 08.10.2026: 1A, potem dashboard wariant A): „Dziś: X” ze startem i pasek bieżącego
 * tygodnia pon…nd — pod dniem mała ikona aplikacji: zrobione (pełna), zaplanowane (obwódka), opuszczone (obwódka wyszarzona), wolne (nic)
 * — korekta właściciela 09.10.2026 ok. 17:00; „dziś” — ramka wokół kolumny dnia (data i ikona), jak w Kalendarzu.
 * Bez planu: tydzień z odbytymi treningami i zachęta do ustawienia planu. Nowa osoba bez treningów i planu — karty nie ma (są „Pierwsze kroki”).
 * Audyt 0.10: stan dnia z jednej funkcji (dayStatus — A2); A5 — nazwa faktycznie zrobionej sesji, zrobiony inny trening: zaplanowany czeka
 * (kropka pod kółkiem); A8 — pusty szablon bez Startu; A9 — pod paskiem 2–3 najbliższe treningi z nazwą, tapnięcie dnia otwiera ten dzień
 * w Kalendarzu; A11-05 — „dziś” i „tydzień deload” w etykiecie dnia; D4 — „Tydzień deload” na karcie w tygodniu deload.
 */
/** Ile najbliższych treningów pod paskiem (A9) i w ilu dniach ich szukać. */
const NEXT_COUNT = 3; const NEXT_DAYS = 14;
const dateOf = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const names = (k: string) => doneOn(k).map(w => w.templateName || t('Trening')).join(', ');

/** Ile ćwiczeń szablonu widać na tablicy „Dziś” (reszta: „+ n ćwiczeń”). */
const PREVIEW = 2;
export function TodayPlan() {
  useForegroundTick(); const th = useTheme(); const router = useRouter(); const once = useOnce(); /* UI2-02 */
  const win = useWindowDimensions(); const [stripW, setStripW] = React.useState<number | null>(null);
  const plan = hasPlan(); if (!plan && !finishedWorkouts().length) return null;
  const today = dayKeyOf(Date.now()); const days = weekStrip(); const name = planTplName;
  const cur = days.find(d => d.today)!; const id = cur.templateId; const tpl = id ? getState().templates.find(x => x.id === id && !x.archived) : undefined;
  /* M1-audytor-generalny-027: skrót dnia w jednej linii; gdy najdłuższy nie mieści się w kolumnie nawet po zmniejszeniu (np. 320 pt i duży tekst — „NIEDZ.”),
   * skróty jednoliterowe (Intl 'narrow'; data dnia pod spodem, pełna nazwa w etykiecie VoiceOver). Szerokość paska z onLayout, przed pomiarem — z ekranu. */
  const col = stripColumnPt(stripW ?? win.width - 2 * SPACE.l); const capPt = (font('caption').fontSize ?? 11) * Math.min(win.fontScale || 1, NUM_SCALE_MAX);
  const narrow = !stripLabelsFit(days.map(d => fmtWeekdayShort(dateOf(d.date))), col, capPt);
  const wd = (k: string) => (narrow ? fmtWeekdayNarrow(dateOf(k)) : fmtWeekdayShort(dateOf(k)));
  const word = (d: (typeof days)[number]): string => {
    const plannedWord = d.date < today ? t('opuszczony: {name}', { name: name(d.templateId) }) : t('zaplanowany: {name}', { name: name(d.templateId) });
    const m: Record<DayStatus, () => string> = { done: () => (d.early ? t('zrobiony wcześniej: {name}', { name: name(d.templateId) }) : t('zrobione: {name}', { name: names(d.date) })), other: () => `${t('zrobiony inny trening: {name}', { name: names(d.date) })}, ${plannedWord}`,
      planned: () => plannedWord, missed: () => plannedWord, rest: () => (d.inPlan ? t('odpoczynek') : t('wolne')) /* odpoczynek w planie (ikona espresso) ≠ dzień bez planu */ };
    return m[d.status]();
  };
  const deload = isDeloadWeek(Date.now());
  /* 11.10.2026 (docs/22 krok 3 pkt 1): nazwa planu nad kalendarzem (bez planu: „Bez planu tygodnia”). M3 p2 (W1 c, STOP E3): „Planowanie” / „Ustaw plan” jest w nagłówku ekranu Start
   * (PlanningButton w app/(tabs)/index.tsx) — ta sama akcja w tym samym miejscu co w zakładce Plan; tu zostaje sama nazwa planu. */
  const planTitle = plan ? t('Plan: {name}', { name: planName() || t('Plan tygodnia') }) : t('Bez planu tygodnia');
  const showDay = plan || cur.status === 'done'; /* tablica „Dziś” — bez planu tylko gdy zrobiono trening */
  const title = cur.early ? t('Zrobiony wcześniej: {name}', { name: name(id) }) : cur.status === 'done' ? t('Dziś zrobione: {name}', { name: names(today) }) : id ? t('Dziś: {name}', { name: name(id) }) : t('Dziś wolne');
  const next = plan ? upcoming(NEXT_DAYS, today).filter(x => x.date > today && x.templateId).slice(0, NEXT_COUNT) : [];
  const nextLabel = (k: string) => (k === addDays(today, 1) ? t('jutro') : fmtDayKey(k)); /* H3 (audyt 0.10) */
  const showTpl = tpl && pending(cur) ? tpl : undefined; const shown = showTpl ? showTpl.items.slice(0, PREVIEW) : []; const n = showTpl ? showTpl.items.length - shown.length : 0; /* ile ćwiczeń ponad podgląd */
  const u = upperText(title); /* W3 (wz. 28 pkt 4): „Dziś: …” wersalikami jak nazwisko na tablicy podejść; A11-02: reguły języka */
  return (
    <View testID="today-plan" style={{ marginTop: SPACE.xs, gap: SPACE.m }}>
      <View testID="plan-header"><Txt accessibilityRole="header" style={{ ...font('callout'), color: th.muted }}>{planTitle}</Txt></View>
      <View testID="week-strip" onLayout={e => setStripW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', gap: STRIP_GAP, padding: STRIP_PAD, borderRadius: RADIUS.group, backgroundColor: th.surface }}>
        {days.map(d => {
          const place = plannedPlaceName(d.date); /* 0.19 (docs/33 B): miejsce zapisane w planie na ten dzień */
          const label = [fmtWeekdayDayMonth(dateOf(d.date)), ...(d.today ? [t('dziś')] : []), word(d), ...(place ? [t('Miejsce treningu: {l}', { l: place })] : []), ...(deload ? [t('tydzień deload')] : [])].join(', ');
          const mark = dayMark(d.status, d.inPlan);
          return (
            <Pressable accessibilityLanguage={lang()} key={d.date} testID={`strip-${d.date}`} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={t('Otwiera ten dzień w zakładce Plan.')} onPress={once(() => router.push(`/history?day=${d.date}`))} style={({ pressed }) => ({ flex: 1, minHeight: SIZE.hit /* A11-15 */, alignItems: 'center', gap: SPACE.xs, paddingVertical: 3, borderRadius: RADIUS.button, borderWidth: STRIP_BORDER, borderColor: d.today ? th.accent : 'transparent', opacity: pressed ? 0.6 : 1 })}>
              <View style={{ alignItems: 'center' }}>{(() => { const w = upperText(wd(d.date)); /* B1: skrót dnia wersalikami wg reguł języka (A11-02), pod nim numer dnia miesiąca */ return <Muted testID={`strip-label-${d.date}`} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={NUM_SCALE_MAX} style={[{ ...font('caption'), ...(d.today ? FW.semibold : FW.regular), color: d.today ? th.text : th.muted }, w.style]}>{w.text}</Muted>; })()}
              <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ ...font('sectionTitle'), color: d.today ? th.text : th.muted }}>{fmtDayNum(dateOf(d.date))}</Txt></View>
              {/* znacznik dnia — jedyny kod „zrobione / zaplanowane / odpoczynek” (lib/motif.dayMark; zrobiony inny trening = pełna ikona, że zaplanowany czeka — etykieta) */}
              <View testID={`strip-mark-${d.date}`} style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}>{mark ? <DayIcon mark={mark} bg={th.surface} th={th} /> : null}</View>
            </Pressable>); })}
      </View>
      {showDay ? <View testID="today-board" style={{ backgroundColor: th.board, borderColor: th.boardEdge, borderWidth: 1, borderRadius: RADIUS.board, padding: SPACE.l, gap: SPACE.s }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: SPACE.s }}>
          <Text accessibilityLanguage={lang()} accessibilityRole="header" accessibilityLabel={u.label} maxFontSizeMultiplier={maxScale('boardName')} style={[{ ...font('boardName'), color: th.boardText, flexShrink: 1 }, u.style]}>{u.text}</Text>
          {showTpl ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('boardMeta')} style={{ ...font('boardMeta'), color: th.boardMuted }}>{`${showTpl.items.length} ${t('ćw.')}`}</Text> : null}
        </View>
        {deload ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('footnote')} style={{ ...font('footnote'), ...FW.semibold, color: th.boardMuted }}>{t('Tydzień deload')}</Text> : null}
        {cur.status === 'other' ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('footnote')} style={{ ...font('footnote'), color: th.boardMuted }}>{t('Zrobiony inny trening: {name}', { name: names(today) })}</Text> : null}
        {shown.map(it => { const x = exById(it.exerciseId); return x ? <View key={it.id} testID="today-item" style={{ flexDirection: 'row', justifyContent: 'space-between', gap: SPACE.s, borderTopWidth: 1, borderTopColor: th.boardField, paddingTop: SPACE.s }}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('body')} style={{ ...font('body'), color: th.boardText, flexShrink: 1 }}>{exName(x)}</Text>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('callout')} style={{ ...font('callout'), color: th.boardMuted }}>{`${it.sets} × ${reps(it.repMin, it.repMax)}`}</Text></View> : null; })}
        {n > 0 ? <Text testID="today-more" accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('body')} style={{ ...font('body'), color: th.boardMuted, borderTopWidth: 1, borderTopColor: th.boardField, paddingTop: SPACE.s }}>{t('+ {n} {w}', { n, w: tp(n, 'ćwiczenie|ćwiczenia|ćwiczeń') })}</Text> : null}
        {plannedPlaceName(today) ? <IconRow icon="pin" color={th.boardMuted} size={14}><Text testID="today-place" accessibilityLanguage={lang()} accessibilityLabel={t('Miejsce treningu: {l}', { l: plannedPlaceName(today) })} maxFontSizeMultiplier={maxScale('footnote')} style={{ ...font('footnote'), color: th.boardMuted }}>{plannedPlaceName(today)}</Text></IconRow> : null}
        {tpl && pending(cur) && !tpl.items.length ? <Pressable accessibilityLanguage={lang()} accessibilityRole="button" onPress={once(() => router.push(`/template/${tpl.id}?edit=1`))} hitSlop={8} style={{ minHeight: SIZE.hit, justifyContent: 'center' }}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={maxScale('footnote')} style={{ ...font('footnote'), color: th.boardText }}>{t('Szablon jest pusty — dodaj ćwiczenia')}</Text></Pressable> : null}
      </View> : deload ? <Muted style={{ ...font('footnote'), ...FW.semibold }}>{t('Tydzień deload')}</Muted> : null}
      {next.length ? <Muted style={font('footnote')}>{t('Następne: {list}', { list: next.map(x => `${nextLabel(x.date)} — ${name(x.templateId)}`).join(', ') })}</Muted> : null}
    </View>
  );
}
