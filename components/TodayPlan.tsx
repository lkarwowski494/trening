import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt, upperText } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX } from '@/lib/theme';
import { getState, finishedWorkouts, useForegroundTick, isDeloadWeek } from '@/lib/store';
import { hasPlan, dayKeyOf, doneOn, upcoming, pending, planTplName, addDays, type DayStatus } from '@/lib/plan';
import { weekStrip } from '@/lib/dashboard';
import { startTemplate } from '@/lib/start';
import { t, locale, lang } from '@/lib/i18n';

/*
 * Karta „Dziś” na ekranie treningu (decyzje właściciela 08.10.2026: 1A, potem dashboard wariant A): „Dziś: X” ze startem i pasek bieżącego
 * tygodnia pon…nd — zrobione (wypełnione), zaplanowane (obwódka), opuszczone (szara kropka), wolne.
 * Bez planu: tydzień z odbytymi treningami i zachęta do ustawienia planu. Nowa osoba bez treningów i planu — karty nie ma (są „Pierwsze kroki”).
 * Audyt 0.10: stan dnia z jednej funkcji (dayStatus — A2); A5 — nazwa faktycznie zrobionej sesji, zrobiony inny trening: zaplanowany czeka
 * (kropka pod kółkiem); A8 — pusty szablon bez Startu; A9 — pod paskiem 2–3 najbliższe treningi z nazwą, tapnięcie dnia otwiera ten dzień
 * w Kalendarzu; A11-05 — „dziś” i „tydzień deload” w etykiecie dnia; D4 — „Tydzień deload” na karcie w tygodniu deload.
 */
/** Ile najbliższych treningów pod paskiem (A9) i w ilu dniach ich szukać. */
const NEXT_COUNT = 3; const NEXT_DAYS = 14;
const dateOf = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const names = (k: string) => doneOn(k).map(w => w.templateName || t('Trening')).join(', ');

export function TodayPlan() {
  useForegroundTick(); const th = useTheme(); const router = useRouter();
  const plan = hasPlan(); if (!plan && !finishedWorkouts().length) return null;
  const today = dayKeyOf(Date.now()); const days = weekStrip(); const name = planTplName;
  const cur = days.find(d => d.today)!; const id = cur.templateId; const tpl = id ? getState().templates.find(x => x.id === id && !x.archived) : undefined;
  const wd = (k: string) => dateOf(k).toLocaleDateString(locale(), { weekday: 'short' });
  const word = (d: (typeof days)[number]): string => {
    const plannedWord = d.date < today ? t('opuszczony: {name}', { name: name(d.templateId) }) : t('zaplanowany: {name}', { name: name(d.templateId) });
    const m: Record<DayStatus, () => string> = { done: () => t('zrobione: {name}', { name: names(d.date) }), other: () => `${t('zrobiony inny trening: {name}', { name: names(d.date) })}, ${plannedWord}`,
      planned: () => plannedWord, missed: () => plannedWord, rest: () => t('wolne') };
    return m[d.status]();
  };
  const deload = isDeloadWeek(Date.now());
  const title = !plan && cur.status !== 'done' ? t('Bez planu tygodnia') : cur.status === 'done' ? t('Dziś zrobione: {name}', { name: names(today) }) : id ? t('Dziś: {name}', { name: name(id) }) : t('Dziś wolne');
  const canStart = !!tpl && pending(cur) && tpl.items.length > 0;
  const next = plan ? upcoming(NEXT_DAYS, today).filter(x => x.date > today && x.templateId).slice(0, NEXT_COUNT) : [];
  const nextLabel = (k: string) => (k === addDays(today, 1) ? t('jutro') : dateOf(k).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'numeric' }));
  return (
    <View testID="today-plan" style={{ marginTop: 6, padding: 14, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flexShrink: 1 }}>
          {(() => { const u = upperText(deload ? `${t('Dziś')} · ${t('Tydzień deload')}` : t('Dziś')); /* A11-02: wersaliki z regułami języka */ return <Muted accessibilityLabel={u.label} style={[{ fontSize: 12, fontFamily: F.semibold, letterSpacing: 0.5 }, u.style]}>{u.text}</Muted>; })()}
          <Txt style={{ fontFamily: F.semibold, fontSize: 18 }}>{title}</Txt>
          {cur.status === 'other' ? <Muted style={{ fontSize: 13 }}>{t('Zrobiony inny trening: {name}', { name: names(today) })}</Muted> : null}
          {tpl && pending(cur) && !tpl.items.length ? <Pressable accessibilityLanguage={lang()} accessibilityRole="link" onPress={() => router.push(`/template/${tpl.id}`)}><Muted style={{ fontSize: 13 }}>{t('Szablon jest pusty — dodaj ćwiczenia')}</Muted></Pressable> : null}
        </View>
        {canStart ? <Btn small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tpl!.name })} onPress={() => startTemplate(tpl!)} />
          : !plan ? <Btn small title={t('Plan tygodnia')} onPress={() => router.push('/plan')} /> : null}
      </View>
      <View testID="week-strip" style={{ flexDirection: 'row' }}>
        {days.map(d => {
          const label = [dateOf(d.date).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }), ...(d.today ? [t('dziś')] : []), word(d), ...(deload ? [t('tydzień deload')] : [])].join(', ');
          const filled = d.status === 'done' || d.status === 'other';
          return (
            <Pressable accessibilityLanguage={lang()} key={d.date} testID={`strip-${d.date}`} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={t('Otwiera ten dzień w Kalendarzu.')} onPress={() => router.push(`/history?day=${d.date}`)} style={({ pressed }) => ({ flex: 1, minHeight: 44 /* A11-15 */, alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1 })}>
              <Muted style={{ fontSize: 11, fontFamily: d.today ? F.semibold : F.regular, color: d.today ? th.text : th.muted }}>{wd(d.date)}</Muted>
              <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: filled ? th.accent : 'transparent', borderWidth: d.status === 'planned' || (d.today && !filled) ? 2 : 0, borderColor: d.today ? th.text : th.accent }}>
                {d.status === 'missed' ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: th.muted }} /> : filled ? <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} /* A11-07: znak w kółku 22–24 pt */ style={{ color: th.accentInk, fontSize: 12, fontFamily: F.semibold }}>✓</Txt> : null}
              </View>
              {d.status === 'other' ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: d.date < today ? th.muted : th.accent }} /> : null}
            </Pressable>); })}
      </View>
      {next.length ? <Muted style={{ fontSize: 13 }}>{t('Następne: {list}', { list: next.map(x => `${nextLabel(x.date)} — ${name(x.templateId)}`).join(' · ') })}</Muted> : null}
      {!plan ? <Muted style={{ fontSize: 12 }}>{t('Ustaw plan tygodnia, by widzieć tu dzisiejszy trening i dostawać przypomnienie.')}</Muted> : null}
    </View>
  );
}
