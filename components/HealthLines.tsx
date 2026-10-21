import React from 'react';
import { View } from 'react-native';
import { Muted, Txt } from '@/components/ui';
import { getState, useTick, noClock, mondayKey } from '@/lib/store';
import { t, lang, appName } from '@/lib/i18n';
import { dayKeyOf } from '@/lib/plan';
import { readEnabled, loadDay, loadWeek, loadWatchStats } from '@/lib/healthQuery';
import { stepsText, activityText, dayBlockSpoken, weekLineText, watchLineText, watchSpoken, hasWatchStats } from '@/lib/healthRead';
import { useHealthLoad } from '@/lib/healthUse';
import type { Workout } from '@/lib/seed';
import { font } from '@/lib/theme';

/*
 * Odczyt z Apple Health na ekranach (0.16.0, decyzje właściciela 12.10.2026 — docs/29): blok dnia w panelu dnia, linia pod „Ten tydzień”, linia przy sesji.
 * Tylko do wglądu: bez akcji i stuknięć, bez wpływu na plan, cele, Progresję i deload. Przy wyłączonym odczycie (domyślnie) komponenty nic nie renderują i nie pytają
 * Zdrowia. Wartości żyją tylko w pamięci komponentu (lib/healthUse). Błąd zapytania albo brak danych = neutralny stan pusty, bez alertu.
 */
const sig = () => getState().workouts.length; /* zmiana liczby sesji (np. właśnie zakończona) odświeża dopasowanie */

/** Blok „Apple Health” w panelu dnia (dzień minionego lub dzisiejszy; dni przyszłych nie ma): kroki i inne aktywności albo neutralna linia „Brak danych”. */
export function DayHealth({ day }: { day: string }) {
  useTick(); const today = dayKeyOf(Date.now()); const on = readEnabled() && day <= today;
  const r = useHealthLoad(on, `${day}|${sig()}`, () => loadDay(day));
  if (r.status === 'off') return null;
  if (r.status === 'loading') return <View testID="health-day-loading" style={{ marginTop: 4 }}><Muted style={{ ...font('footnote') }}>{t('Apple Health…')}</Muted></View>;
  const d = r.data; const acts = d?.activities ?? [];
  /* B14: „Kroki: 0” tylko w dniu minionym z innymi danymi; brak pomiaru (null) — bez linii */
  const steps = d && d.steps != null && (d.steps > 0 || (day < today && acts.length > 0)) ? d.steps : null;
  if (steps == null && !acts.length) return <View testID="health-day-empty" style={{ marginTop: 4 }}><Muted style={{ ...font('footnote') }}>{t('Brak danych z Apple Health dla tego dnia. Jeśli dane powinny być, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })}</Muted></View>;
  return (
    <View testID="health-day" accessible accessibilityLanguage={lang()} accessibilityLabel={dayBlockSpoken(steps, acts)} style={{ marginTop: 6, gap: 2 }}>
      <Muted style={{ ...font('footnote') }}>{t('Apple Health')}</Muted>
      {steps != null ? <Txt style={{ ...font('callout') }}>{stepsText(steps)}</Txt> : null}
      {acts.map(a => <Txt key={a.uuid} style={{ ...font('callout') }}>{activityText(a)}</Txt>)}
    </View>
  );
}

/** Linia pod kafelkami „Ten tydzień”: średnia dzienna kroków z ostatnich 7 dni i liczba innych aktywności tygodnia; bez danych linia znika. */
export function WeekHealthLine() {
  useTick(); const on = readEnabled(); const r = useHealthLoad(on, `${mondayKey(Date.now())}|${sig()}`, () => loadWeek());
  if (r.status === 'off') return null;
  if (r.status === 'loading') return <View testID="week-health-loading" style={{ marginTop: 6 }}><Muted style={{ ...font('footnote') }}>{t('Apple Health…')}</Muted></View>;
  const text = r.data ? weekLineText(r.data.avgSteps, r.data.others) : '';
  return text ? <View testID="week-health" style={{ marginTop: 6 }}><Muted style={{ ...font('footnote') }}>{text}</Muted></View> : null;
}

/** Linia przy sesji: tętno śr./maks. i aktywne kcal z dopasowanego treningu z zegarka; bez dopasowania i bez wartości — nic (sesja bez zegarka to normalny przypadek). */
export function SessionHealth({ w }: { w: Workout }) {
  useTick(); const on = readEnabled() && w.finishedAt != null && !noClock(w); const r = useHealthLoad(on, `${w.id}|${w.startedAt}|${w.finishedAt}|${sig()}`, () => loadWatchStats(w));
  if (r.status === 'off') return null;
  if (r.status === 'loading') return <View testID="session-health-loading" style={{ marginBottom: 10 }}><Muted style={{ ...font('footnote') }}>{t('Apple Health…')}</Muted></View>;
  if (!hasWatchStats(r.data)) return null;
  return <View testID="session-health" style={{ marginBottom: 10 }}><Muted style={{ ...font('footnote') }} accessibilityLabel={watchSpoken(r.data)}>{watchLineText(r.data)}</Muted></View>;
}
