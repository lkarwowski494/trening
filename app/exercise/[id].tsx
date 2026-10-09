import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, NumInput, Btn, Muted, Chip } from '@/components/ui';
import { getState, useTick, exById, previousFor, save, deleteExercise, setSummary, fmtDate, setEquipment, exerciseInHistory, exerciseUsed, usesBand } from '@/lib/store';
import { GROUPS, GROUP_TO_MUSCLE, METRICS, METRIC_LABEL, LOAD_MODE_LABEL, MUSCLES, REGION_LABEL, muscleLoadOf, musclesSourced, hasWeight, type Equipment, type LoadMode } from '@/lib/seed';
import { BW_SHARE } from '@/lib/stats';
import { t, exName, lang } from '@/lib/i18n';
import { ExerciseCues } from '@/components/ExerciseCues';

const EQ: Equipment[] = ['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'];

export default function ExerciseEdit() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter();
  // Nowe, nietknięte ćwiczenie bez historii znika po wyjściu (runda 2).
  useEffect(() => { const created = exById(id!)?.createdAt ?? 0; return () => { const x = exById(id!); if (x && x.name === t('Nowe ćwiczenie') && !x.lib && x.updatedAt === created && !exerciseUsed(x.id) && !getState().templates.some(tp => tp.items.some(i => i.exerciseId === x.id))) { /* runda 42: ćwiczenie z szablonu zostaje */ const st = getState(); st.exercises = st.exercises.filter(y => y.id !== x.id); save(); } }; }, [id]);
  const initialName = useRef(exById(id!)?.name ?? '');
  const e = exById(id!); if (!e) return <Screen><Muted>{t('Nie ma takiego ćwiczenia.')}</Muted></Screen>;
  const p = previousFor(e.id);
  const translated = lang() !== 'pl' && exName(e) !== e.name;
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Field label={t('Nazwa')}><Input selectTextOnFocus maxLength={80} value={e.name} onChangeText={v => { e.name = v; save(e); }} onEndEditing={() => { const n = e.name.replace(/\s+/g, ' ').trim(); if (!n) { e.name = initialName.current || t('Nowe ćwiczenie'); save(e); } else { if (n !== e.name) { e.name = n; save(e); } initialName.current = n; /* runda 49 */ } }} /></Field>
      {translated ? <Muted style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>{t('Wyświetlane jako: {n}', { n: exName(e) })}</Muted> : null}
      <ExerciseCues exercise={e} />{/* wskazówki techniki, etap 1 (docs/18 08.10.2026 ok. 23:50) */}
      <Field label={t('Partia')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{GROUPS.map(g => <Chip key={g} label={t(g)} on={e.group === g} onPress={() => { const old = e.group; const auto = old ? GROUP_TO_MUSCLE[old] : undefined; const cur = e.muscles ?? []; e.group = g; const mu = GROUP_TO_MUSCLE[g]; /* runda 5: automatyczna partia z poprzedniej grupy jest podmieniana, a nowa znika z pomocniczych */ if (!cur.length || (cur.length === 1 && cur[0] === auto)) { e.muscles = mu ? [mu] : []; if (mu) e.secondaryMuscles = (e.secondaryMuscles ?? []).filter(x => x !== mu); } save(e); }} />)}</ScrollView></Field>
      <Field label={t('Sprzęt')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{EQ.map(g => <Chip key={g} label={t(g)} on={e.equipment === g} onPress={() => setEquipment(e, g)} />)}</ScrollView></Field>
      <Field label={t('Co logujesz w serii')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{METRICS.map(m => <Chip key={m} label={t(METRIC_LABEL[m])} on={(e.metric ?? 'weight_reps') === m} onPress={() => { e.metric = m; save(e); }} />)}</ScrollView></Field>
      {hasWeight(e.metric ?? 'weight_reps') && e.equipment !== 'masa ciała' ? <Field label={t('Jak liczyć ciężar w objętości')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{(Object.keys(LOAD_MODE_LABEL) as LoadMode[]).map(m => <Chip key={m} label={t(LOAD_MODE_LABEL[m])} on={(e.loadMode ?? 'total') === m} onPress={() => { e.loadMode = m; save(e); }} />)}</ScrollView></Field> : null}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Field label={t('Przerwa robocza (s)')}><NumInput value={e.restSec ?? ''} onNum={v => { e.restSec = v === '' ? null : Math.min(1800, Math.max(0, Math.round(v))); save(e); }} placeholder={t('domyślna {s}', { s: getState().settings.defaultRest })} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('Przerwa po rozgrzewce (s)')}><NumInput value={e.restWarmupSec ?? ''} onNum={v => { e.restWarmupSec = v === '' ? null : Math.min(1800, Math.max(0, Math.round(v))); save(e); }} placeholder={t('jak robocza')} /></Field></View>
      </View>
      <Field label={t('Partie główne (1 seria)')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{MUSCLES.map(mu => <Chip key={mu} label={t(mu)} on={(e.muscles ?? []).includes(mu)} onPress={() => { const has = (e.muscles ?? []).includes(mu); e.muscles = has ? e.muscles.filter(x => x !== mu) : [...(e.muscles ?? []), mu]; if (!has) e.secondaryMuscles = (e.secondaryMuscles ?? []).filter(x => x !== mu); save(e); }} />)}</View></Field>
      <Field label={t('Partie pomocnicze (0,5 serii)')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{MUSCLES.map(mu => <Chip key={mu} label={t(mu)} on={(e.secondaryMuscles ?? []).includes(mu)} onPress={() => { const has = (e.secondaryMuscles ?? []).includes(mu); e.secondaryMuscles = has ? e.secondaryMuscles.filter(x => x !== mu) : [...(e.secondaryMuscles ?? []), mu]; if (!has) e.muscles = (e.muscles ?? []).filter(x => x !== mu); save(e); }} />)}</View></Field>
      {!musclesSourced(e) ? <Muted style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>{t('Przypisanie partii mięśniowych — uproszczenie, nie wynik badań. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu.')}</Muted> : null /* E4 (audyt 0.10, MER-10): do czasu źródeł dla tego ćwiczenia (seed.MUSCLE_SOURCES) */}
      {muscleLoadOf(e).length ? <Field label={t('Obciążenie partii (z katalogu)')}><Muted style={{ fontSize: 13 }} accessibilityLabel={muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])}: ${w === 1 ? t('główna') : w === 0.5 ? t('pomocnicza') : t('stabilizacja')}`).join(', ')}>{muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])} ${w === 1 ? '●●●' : w === 0.5 ? '●●' : '●'}`).join(' · ')}</Muted><Muted style={{ fontSize: 11, marginTop: 2 }}>{t('●●● główna · ●● pomocnicza · ● stabilizacja')}</Muted></Field> : null}
      <Field label={t('Asysta gumą')}><Chip toggle label={e.bandAssistable ? t('tak — przy serii wybierasz gumę') : t('nie')} on={e.bandAssistable} onPress={() => { e.bandAssistable = !e.bandAssistable; save(e); }} />{!e.bandAssistable && usesBand(e) ? <Muted style={{ fontSize: 12, marginTop: 4 }}>{t('Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą.')}</Muted> : null /* przegląd 06.10: 34 ćwiczenia z oporem gumy */}</Field>
      <Field label={t('Tempo (opcjonalnie, np. 3-1-1)')}><Input maxLength={20} value={e.tempo} onChangeText={v => { e.tempo = v; save(e); }} /></Field>
      <Field label={t('Notatki techniczne')}><Input maxLength={2000} value={e.notes} onChangeText={v => { e.notes = v; save(e); }} multiline style={{ minHeight: 80 }} /></Field>
      {exerciseInHistory(e.id) ? <Muted style={{ fontSize: 12, marginBottom: 10 }}>{t('Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy).')}</Muted> : null}
      {p ? <Muted style={{ fontSize: 13, marginBottom: 10 }}>{t('Ostatnio {d}:', { d: fmtDate(p.workout.startedAt) })} {p.sets.map(x => setSummary(e, x)).join(', ')}</Muted> : null}
      {/* E1 (audyt 0.10): e1RM w ćwiczeniach z masą ciała — tylko z masą ciała z Ustawień i udziałem ze źródeł (stats.BW_SHARE) */}
      <Muted style={{ fontSize: 13, marginBottom: 16 }}>{[t('Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Rekord to suma powtórzeń bez asysty, a objętość liczy się tylko z dociążenia.'), t('e1RM w ćwiczeniach z masą ciała liczy się tylko z masą ciała wpisaną w Ustawieniach i tylko tam, gdzie wiadomo, jaką jej część podnosisz: podciąganie (cała — uproszczenie), pompki (ok. {p}% — badania z platformą siłową).', { p: Math.round(BW_SHARE['Push Up'] * 100) }), t('Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia.')].join(' ')}</Muted>
      <View style={{ flexDirection: 'row', gap: 8 }}><Btn title={t('Postępy')} onPress={() => router.push(`/more/progress?ex=${e.id}`)} /></View>
    </ScrollView></Screen>
  );
}
