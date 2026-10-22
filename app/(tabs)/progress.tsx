import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Muted, Chip, Empty, H2, Btn, SearchField } from '@/components/ui';
import { isDeloadWeek, useTick, exById, finishedWorkouts, fmtDate, getState, bodyMassLog, latestBodyMass, localDateTs } from '@/lib/store';
import { hasHistory, weeklyTotals, hasAnyHistory, weeklySplitByMuscle, weeklyVolumeByMuscle, thisMonday, WEEKLY_SETS_MARK, setsGoal, type ChartKey } from '@/lib/stats';

import { SET_PARTS } from '@/lib/setParts';

import { IndirectLegend } from '@/components/ProgressBars';
import { LineChart, BarChart } from '@/components/Chart';
import { exerciseParts } from '@/components/ExerciseProgress';
import { MuscleCompare } from '@/components/MuscleCompare';
import { PeriodSummary } from '@/components/PeriodSummary';
import { ProgressTiles } from '@/components/Dashboard';
import { GuardSection } from '@/components/GuardSection';
import { useTheme, font, SPACE } from '@/lib/theme';

import { t, exName, fold, collator } from '@/lib/i18n';
import { fmtW, volOut, wu, fmtNum, KG_PER_LB } from '@/lib/units';
import { fmtDayMonth, fmtDayMonthYear } from '@/lib/calendar';

/*
 * Postępy (T-030): bez wybranego ćwiczenia — tygodniowa objętość i serie; z ćwiczeniem — wykres wybranej
 * metryki per sesja (max ciężar / e1RM Epley / objętość / max pow. / czas / dystans), rekordy i lista sesji.
 * 11.10.2026 (docs/22, wariant A; P5 A): osobna zakładka (dawniej Więcej → Postępy); dochodzą „Progresja” (te same kafelki co na ekranie Trening)
 * i sekcja „Masa ciała” (wykres + wejście do pomiarów — dawniej Ustawienia → Masa ciała). Wejście z ćwiczenia: /progress?ex=<id>.
 */
export default function ProgressTab() {
  /* Zakładka zostaje zamontowana po pierwszym otwarciu, a Postępy słuchają każdej zmiany stanu (useTick) — poza zakładką nie renderujemy treści,
   * żeby wpisy serii w treningu nie przeliczały wykresów w tle (jak R13-04 dla pozostałych zakładek). Stan widoku (wybrane ćwiczenie, szukanie, wykres,
   * przewinięcie) trzyma sama zakładka, a nie odmontowywana treść — po powrocie z ekranu stosu (np. „Masa ciała — pomiary”) wszystko jest jak było
   * (audyt 0.13, 0.14.0).
 * M3 p3 (ZM-06, DEC-09, M1-026; design-spec §10 wiersz 7): wykres i rekordy wybranego ćwiczenia są NA GÓRZE (bez wyboru — ostatnio trenowane ćwiczenie z danymi), pod nimi wybór:
 * chipy tylko ćwiczeń z danymi, reszta przez wyszukiwanie; potem sesje ćwiczenia i ogólny przegląd (okres vs okres, strażnik, serie per partia). Bez historii — sam
 * pusty stan z motywem A2 i przyciskiem „Zacznij trening”. */
  const focused = useIsFocused(); const { ex: exParam } = useLocalSearchParams<{ ex?: string }>();
  const [exId, setExId] = useState(exParam ?? ''); const [q, setQ] = useState(''); const [key, setKey] = useState<ChartKey | ''>('');
  const scrollY = useRef(0);
  useEffect(() => { if (exParam) { setExId(exParam); setKey(''); scrollY.current = 0; } }, [exParam]); /* runda 54: link przy otwartym ekranie */
  const view: View_ = { exId, setExId: (id: string) => { scrollY.current = 0; setExId(id); }, q, setQ, chartKey: key, setKey, scrollY }; /* uwaga: `key` jest zarezerwowaną nazwą propsa w React */
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ marginVertical: 10 }}><H1>{t('Postępy')}</H1></View>
      {focused ? <Progress {...view} /> : null}
    </Screen></SafeAreaView>
  );
}
type View_ = { exId: string; setExId: (id: string) => void; q: string; setQ: (q: string) => void; chartKey: ChartKey | ''; setKey: (k: ChartKey | '') => void; scrollY: React.MutableRefObject<number> };

function Progress({ exId, setExId, q, setQ, chartKey: key, setKey, scrollY }: View_) {
  const { s: sParam } = useLocalSearchParams<{ s?: string }>(); useTick(); const th = useTheme(); const router = useRouter();
  /* „Szczegóły w Postępach ›” z ekranu Trening (/progress?s=guard): przewinięcie do sekcji „Strażnik progresji” (strażnik progresji, 14.10.2026); pozycję podaje onLayout sekcji */
  const listRef = useRef<ScrollView>(null); const guardY = useRef<number | null>(null); const wantGuard = useRef(false);
  const toGuard = () => { if (wantGuard.current && guardY.current != null) { wantGuard.current = false; listRef.current?.scrollTo({ y: guardY.current, animated: false }); scrollY.current = guardY.current; } };
  useEffect(() => { if (sParam === 'guard') { wantGuard.current = true; toGuard(); router.setParams({ s: '' }); /* inaczej powrót do zakładki znów przewijałby */ } }, [sParam]); // eslint-disable-line react-hooks/exhaustive-deps
  /* przewinięcie (audyt 0.13): zapamiętywane w zakładce, przywracane przy ponownym zamontowaniu treści */
  /* E2E-05: pozycja startowa tylko raz (przy montażu treści) — contentOffset zmieniany w każdym renderze cofał przewinięcie po stuknięciu ⓘ; późniejsze przewinięcia robi scrollTo */
  const initialOffset = useRef({ x: 0, y: scrollY.current }).current;
  const scroll = { onScroll: (e: { nativeEvent: { contentOffset: { y: number } } }) => { scrollY.current = e.nativeEvent.contentOffset.y; }, scrollEventThrottle: 32, contentOffset: initialOffset };
  const any = hasAnyHistory();
  const shownEx = useRef(exId); useEffect(() => { if (shownEx.current !== exId) { shownEx.current = exId; listRef.current?.scrollTo({ y: 0, animated: true }); /* nowy wykres jest na górze — pokazujemy go (tylko przy zmianie ćwiczenia) */ } }, [exId]);
  /* ZM-06: bez wyboru na górze jest ostatnio trenowane ćwiczenie z danymi (finishedWorkouts — od najnowszego) */
  const lastTrained = () => { for (const w of finishedWorkouts()) for (const e of w.exercises) { const x = exById(e.exerciseId); if (x && hasHistory(x.id)) return x; } return undefined; };
  const ex = (exId ? exById(exId) : undefined) ?? (any ? lastTrained() : undefined);
  // Ćwiczenia z historią najpierw (runda 2: wcześniej 30 pierwszych alfabetycznie, bez informacji o reszcie).
  const withHist = (e: { id: string }) => hasHistory(e.id); /* runda 74: bez liczenia sesji każdego ćwiczenia */
  // Także usunięte (zarchiwizowane) ćwiczenia z historią — okno usuwania obiecuje, że wykresy zostają (runda 4).
  const pool = getState().exercises.filter(e => !e.archived || withHist(e));
  const ql = fold(q.trim()); // runda 6: spacja na końcu nie gubi wyników
  /* ZM-06: bez wpisanego tekstu chipy tylko ćwiczeń z danymi; reszta biblioteki — przez wyszukiwanie (wyniki: z danymi najpierw) */
  const all = pool.filter(e => ql ? fold(e.name).includes(ql) || fold(exName(e)).includes(ql) : withHist(e)).sort((a, b) => Number(withHist(b)) - Number(withHist(a)) || collator().compare(exName(a), exName(b)));
  const opts = all.slice(0, 40); if (ex && !opts.some(o => o.id === ex.id)) opts.unshift(ex); /* wybrane ćwiczenie zawsze widać wśród chipów */
  const short = (ts: number) => fmtDayMonth(ts);
  // Runda 14: etykiety osi wykresu z rokiem, gdy nie bieżący (wykres ponad rok: „29 wrz 2025 … 29 wrz”).
  const shortY = (ts: number) => new Date(ts).getFullYear() !== new Date().getFullYear() ? fmtDayMonthYear(ts) : short(ts);

  /* ---------- góra ekranu: wykres i rekordy wybranego ćwiczenia (ZM-06, DEC-09) ---------- */
  const weeks = weeklyTotals(8);
  const parts = ex ? exerciseParts({ ex, key, setKey, th, shortY }) : null;
  const chooser = (
    <View testID="progress-chooser">
      <H2 style={{ marginTop: SPACE.xl }}>{t('Ćwiczenie')}</H2>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.s - 2, marginBottom: SPACE.s }}>{opts.map(e => <Chip key={e.id} label={exName(e) + (e.archived ? ` (${t('usunięte')})` : '')} on={e.id === ex?.id} a11yHint={e.id === ex?.id ? undefined : t('Tapnij, by wybrać inne ćwiczenie.')} onPress={() => { if (e.id !== ex?.id) { setExId(e.id); setKey(''); } }} />)}</View>
      <SearchField value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} />
      {!all.length ? <Muted style={{ ...font('footnote'), marginTop: SPACE.s - 2 }}>{t('Nic nie pasuje.')}</Muted> : null}
      {all.length > 40 ? <Muted style={{ ...font('footnote'), marginTop: SPACE.s - 2 }}>{t('Pokazano {n} z {m} — wpisz nazwę, by zawęzić.', { n: 40, m: all.length })}</Muted> : null}
    </View>);
  /* bez historii: pusty stan z motywem A2 i akcją „Zacznij trening” (ZM-06); bez wykresu, wyszukiwania i chipów */
  if (!any) return (
    <ScrollView ref={listRef} testID="progress-scroll" {...scroll} contentContainerStyle={{ paddingBottom: SPACE.xxxl }}>
      <Empty>{t('Wykresy pojawią się po pierwszym zakończonym treningu.')}</Empty>
      <Btn nav kind="primary" block testID="progress-start" title={t('Zacznij trening')} style={{ marginTop: SPACE.m }} onPress={() => router.navigate('/')} />
      <BodyMassSection />{/* odstępstwo od „samego pustego stanu” (ZM-06): masa ciała to jedyne wejście do pomiarów i bywa wpisywana przed pierwszym treningiem (e1RM podciągania) */}
    </ScrollView>
  );
  return (
    <ScrollView ref={listRef} testID="progress-scroll" {...scroll} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: SPACE.xxxl }}>
      {!parts || parts.empty ? <Empty>{t('Brak zapisanych sesji z tym ćwiczeniem.')}</Empty> : parts.top}
      {chooser}
      {parts?.sessions}
      {/* znacznik początku ogólnego przeglądu; sekcje są bezpośrednio w ScrollView, żeby onLayout strażnika dawał pozycję w treści (przewinięcie z ekranu Trening) */}
      <View testID="progress-overview" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height: 0 }} />
      <PeriodSummary />
      <GuardSection onLayoutY={y => { guardY.current = y; toGuard(); }} />{/* 14.10.2026: strażnik progresji — „Strażnik progresji” */}
      <ProgressTiles />{/* 11.10.2026: „Progresja” także tu — to samo wejście co z ekranu Trening (/progression) */}
      <H2 infoId="vol-week" info={[t('Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza.'), ...(weeks.some(w => isDeloadWeek(w.weekStart)) ? [t('D — tydzień oznaczony jako deload.')] : [])]}>{t('Objętość tygodniowo ({u})', { u: wu() })}</H2>
      <BarChart bars={weeks.map(w => ({ label: short(w.weekStart) + (isDeloadWeek(w.weekStart) ? ' D' : ''), value: volOut(w.volume) }))} fmt={v => v >= 1000 ? `${fmtNum(v / 1000, 1)}k` : `${v}`} />
      <H2 style={{ marginTop: 14 }}>{t('Serie robocze tygodniowo')}</H2>
      <BarChart bars={weeks.map(w => ({ label: short(w.weekStart) + (isDeloadWeek(w.weekStart) ? ' D' : ''), value: w.sets }))} fmt={v => `${v}`} height={110} />
      {weeks.some(w => isDeloadWeek(w.weekStart)) ? <Muted style={{ ...font('footnote'), marginTop: SPACE.xs, marginBottom: SPACE.l }}>{t('D — tydzień deload')}</Muted> : null}
      <H2 infoId="sets-part" info={[t('Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', { n: WEEKLY_SETS_MARK }), t('Stanowisko ACSM 2026: przy co najmniej {n} seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; trening siłowy w różnych formach daje przyrost w porównaniu z brakiem treningu.', { n: WEEKLY_SETS_MARK }), t('Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; metaanaliza Pelland i in. 2026).'), t('Uproszczenie: drop set liczy się razem z serią, po której jest.'), t('Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia.')]}>{t('Serie per partia — ten tydzień vs poprzedni')}</H2>
      <MuscleCompare parts={SET_PARTS} curSplit={weeklySplitByMuscle(thisMonday())} prevSplit={weeklySplitByMuscle(thisMonday(-1))} fmt={v => fmtNum(v, 1)} markOf={setsGoal} />
      {Object.values(weeklySplitByMuscle(thisMonday())).some(x => x.indirectSets > 0) ? <IndirectLegend /> : null}
      <H2 infoId="vol-part" info={t('Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą.')}>{t('Objętość per partia ({u}) — ten tydzień vs poprzedni', { u: wu() })}</H2>
      <MuscleCompare cur={weeklyVolumeByMuscle(thisMonday())} prev={weeklyVolumeByMuscle(thisMonday(-1))} fmt={v => { const x = volOut(v); return x >= 10000 ? `${fmtNum(x / 1000, 1)}k` : fmtNum(Math.round(x)); }} />
      <BodyMassSection />
    </ScrollView>
  );
}

/** „Masa ciała” w Postępach (P5 A, 11.10.2026): ostatni pomiar, wykres pomiarów (od 2 pomiarów) i wejście do ekranu z dodawaniem i listą pomiarów
 * (/more/bodymass). Bez nowych danych — te same pomiary co dotąd (store.bodyMassLog), tylko inne miejsce wejścia niż Ustawienia. */
function BodyMassSection() {
  const router = useRouter(); const log = bodyMassLog(); const b = latestBodyMass(); const lb = wu() === 'lb';
  const points = log.map(x => ({ x: localDateTs(x.date), y: x.kg, label: fmtDayMonthYear(localDateTs(x.date)) }));
  return <>
    <H2 style={{ marginTop: 14 }}>{t('Masa ciała')}</H2>
    <Muted style={{ ...font('footnote'), marginBottom: 6 }}>{b ? t('{v} · pomiar z {d}', { v: fmtW(b.kg), d: fmtDate(localDateTs(b.date)) }) : t('nie podano — e1RM podciągania i pompek')}</Muted>
    {log.length >= 2 ? <LineChart points={points} fmt={v => fmtW(v)} scale={lb ? 1 / KG_PER_LB : 1} minStep={lb ? 0.1 : 0.01} /> : null}
    <Btn nav small title={t('Masa ciała — pomiary')} style={{ alignSelf: 'flex-start', marginTop: 6 }} onPress={() => router.push('/more/bodymass')} />
  </>;
}
