import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, NumInput, Btn, Muted, Chip, H1, Txt, useOnce } from '@/components/ui';
import { DraftHeader, confirmDiscard } from '@/components/DraftHeader';
import { Stack } from 'expo-router';
import { getState, useTick, exById, previousFor, save, setSummary, fmtDate, fmtSec, setEquipment, exerciseInHistory, usesBand, finishedWorkouts, wallTs, REST_MAX } from '@/lib/store';
import { beginObjDraft, objDraft, objDirty, discardObjDraft, commitObjDraft, dropUnsavedNew } from '@/lib/draft';
import type { Exercise } from '@/lib/seed';
import { GROUPS, GROUP_TO_MUSCLE, METRICS, METRIC_LABEL, LOAD_MODE_LABEL, MUSCLES, REGION_LABEL, muscleLoadOf, musclesSourced, muscleConfidence, unmappedMuscleOf, hasWeight, type Equipment, type LoadMode } from '@/lib/seed';
import { BW_SHARE } from '@/lib/stats';
import { t, exName, lang } from '@/lib/i18n';
import { ExerciseCues } from '@/components/ExerciseCues';

const EQ: Equipment[] = ['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'];

/*
 * Ekran ćwiczenia (decyzja właściciela 08.10.2026 ok. 21:30, docs/18): najpierw PODGLĄD (nazwa, partie, sprzęt, sposób logowania, przerwy,
 * notatka, historia i postępy); „Edytuj” otwiera edycję na szkicu (lib/draft.ts) z „Anuluj” / „Zapisz” w nagłówku — ten sam wzór co edycja
 * sesji w historii (components/DraftHeader). „+ Nowe” otwiera od razu edycję (`?edit=1&new=1`); „Anuluj” nowego, niezapisanego ćwiczenia je usuwa.
 */
export default function ExerciseScreen() {
  const p = useLocalSearchParams<{ id: string; edit?: string; new?: string }>(); const id = typeof p.id === 'string' ? p.id : ''; useTick(); const router = useRouter();
  const isNew = useRef(p.new === '1'); const once = useOnce();
  const [editing, setEditing] = useState(() => p.edit === '1' && !!beginObjDraft('exercise', id, { isNew: p.new === '1' }) /* UX2-12: nowy obiekt w zapisanym szkicu */);
  /* zamknięcie ekranu w jakikolwiek sposób wyrzuca szkic; nowe ćwiczenie, którego nigdy nie zapisano (albo nietknięte „Nowe ćwiczenie”), znika — runda 2 */
  useEffect(() => () => { discardObjDraft('exercise', id); const x = exById(id); if (x && (isNew.current || x.name === t('Nowe ćwiczenie'))) dropUnsavedNew('exercise', id); }, [id]);
  const real = exById(id); const d = editing ? objDraft<Exercise>('exercise', id) : undefined;
  if (!real) return <Screen><Muted>{t('Nie ma takiego ćwiczenia.')}</Muted></Screen>;
  const close = () => { if (router.canGoBack()) router.back(); else router.replace('/exercises'); };
  if (editing && d) {
    const cancel = () => confirmDiscard(objDirty('exercise', id), isNew.current ? t('Nowe ćwiczenie nie zostanie zapisane.') : t('Ćwiczenie zostanie bez zmian.'), () => {
      discardObjDraft('exercise', id); setEditing(false); if (isNew.current) { dropUnsavedNew('exercise', id); close(); } }, () => objDraft('exercise', id) === d);
    const commit = () => { commitObjDraft('exercise', id, { keepNew: isNew.current }); isNew.current = false; setEditing(false); };
    return <><DraftHeader title={isNew.current ? t('Nowe ćwiczenie') : t('Edycja ćwiczenia')} onCancel={cancel} onSave={commit} cancelLabel={t('Anuluj edycję ćwiczenia')} saveLabel={t('Zapisz ćwiczenie')} /><EditForm e={d} /></>;
  }
  return <><Stack.Screen options={{ title: t('Ćwiczenie'), headerBackVisible: true, gestureEnabled: true, headerLeft: undefined, headerRight: undefined }} /><Preview e={real} onEdit={() => { if (beginObjDraft('exercise', id)) setEditing(true); } /* podwójne tapnięcie — ten sam szkic */} onOpen={(wid: string) => router.push(`/history/${wid}`)} onProgress={once(() => router.push(`/more/progress?ex=${real.id}`))} /></>;
}

/** Opis zasad liczenia (masa ciała, e1RM, stoper, przerwa z szablonu) — ten sam w podglądzie i edycji. */
const bwNote = () => [t('Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Rekord to suma powtórzeń bez asysty, a objętość liczy się tylko z dociążenia.'), t('e1RM w ćwiczeniach z masą ciała liczy się tylko z masą ciała wpisaną w Ustawieniach i tylko tam, gdzie wiadomo, jaką jej część podnosisz: podciąganie (cała — uproszczenie), pompki (ok. {p}% — badania z platformą siłową).', { p: Math.round(BW_SHARE['Push Up'] * 100) }), t('Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia.')].join(' ');
/** Mięsień docelowy spoza mapy partii (lib/catalog.generated UNMAPPED_MUSCLES) — nazwa w UI. */
const UNMAPPED_LABEL: Record<string, () => string> = { rotator_cuff: () => t('stożek rotatorów'), serratus_anterior: () => t('zębaty przedni'), tibialis_anterior: () => t('piszczelowy przedni'), hip_flexors: () => t('zginacze biodra') };
/** E4 (audyt 0.10, MER-10) + research biblioteki (fix-catalog, 09.10.2026): dopisek o pewności przypisania partii — brak dopisku przy źródłach
 * „mocne”/„umiarkowane” (musclesSourced), „jedno źródło” albo „uproszczenie” wg seed.muscleConfidence; linijka o mięśniu docelowym spoza mapy. */
function MuscleNote({ e, style }: { e: Exercise; style?: object }) {
  const conf = muscleConfidence(e) ?? ''; const um = unmappedMuscleOf(e);
  const note = musclesSourced(e) ? '' : conf.startsWith('jedno źródło')
    ? t('Przypisanie partii mięśniowych — jedno źródło, nie ustalone. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu.')
    : t('Przypisanie partii mięśniowych — uproszczenie, nie wynik badań. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu.');
  return <>{note ? <Muted style={[{ fontSize: 12, marginBottom: 10 }, style]}>{note}</Muted> : null}
    {um ? <Muted style={{ fontSize: 12, marginBottom: 10 }}>{t('Mięsień docelowy spoza mapy partii: {m} — nie liczy się w seriach na partię ani na mapie mięśni.', { m: UNMAPPED_LABEL[um]?.() ?? um })}</Muted> : null}</>;
}
/** Wiersz podglądu: etykieta i wartość, czytane razem przez VoiceOver. */
function Row({ label, value }: { label: string; value: string }) {
  return <View accessible accessibilityLabel={`${label}: ${value}`} style={{ marginBottom: 10 }}><Muted style={{ fontSize: 13 }}>{label}</Muted><Txt>{value}</Txt></View>;
}
/** Ostatnie sesje z tym ćwiczeniem (najnowsze pierwsze). */
const HISTORY_ROWS = 5;
function Preview({ e, onEdit, onOpen, onProgress }: { e: Exercise; onEdit: () => void; onOpen: (id: string) => void; onProgress: () => void }) {
  const m = e.metric ?? 'weight_reps'; const def = getState().settings.defaultRest;
  const hist = finishedWorkouts().filter(w => w.exercises.some(x => x.exerciseId === e.id)).slice(0, HISTORY_ROWS);
  const mus = (xs: readonly string[] | undefined) => (xs ?? []).length ? (xs ?? []).map(x => t(x)).join(', ') : '—';
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}><View style={{ flex: 1 }}><H1>{exName(e)}</H1></View>{/* podgląd: tylko nazwa w języku aplikacji (nazwa katalogowa — w edycji, przy „Wyświetlane jako”) */}<Btn title={t('Edytuj')} small accessibilityLabel={t('Edytuj ćwiczenie')} onPress={onEdit} /></View>
      <Row label={t('Partia')} value={t(e.group)} />
      <Row label={t('Sprzęt')} value={t(e.equipment)} />
      <Row label={t('Co logujesz w serii')} value={t(METRIC_LABEL[m])} />
      {hasWeight(m) && e.equipment !== 'masa ciała' ? <Row label={t('Jak liczyć ciężar w objętości')} value={t(LOAD_MODE_LABEL[e.loadMode ?? 'total'])} /> : null}
      <Row label={t('Przerwa robocza')} value={e.restSec != null ? fmtSec(e.restSec) : t('domyślna {s}', { s: fmtSec(def) })} />
      <Row label={t('Przerwa po rozgrzewce')} value={e.restWarmupSec != null ? fmtSec(e.restWarmupSec) : t('jak robocza')} />
      <Row label={t('Partie główne (1 seria)')} value={mus(e.muscles)} />
      <Row label={t('Partie pomocnicze (0,5 serii)')} value={mus(e.secondaryMuscles)} />
      <MuscleNote e={e} style={{ marginTop: -4 }} />
      {muscleLoadOf(e).length ? <Field label={t('Obciążenie partii (z katalogu)')}><Muted style={{ fontSize: 13 }} accessibilityLabel={muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])}: ${w === 1 ? t('główna') : w === 0.5 ? t('pomocnicza') : t('stabilizacja')}`).join(', ')}>{muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])} ${w === 1 ? '●●●' : w === 0.5 ? '●●' : '●'}`).join(' · ')}</Muted><Muted style={{ fontSize: 11, marginTop: 2 }}>{t('●●● główna · ●● pomocnicza · ● stabilizacja')}</Muted></Field> : null}
      <Row label={t('Asysta gumą')} value={e.bandAssistable ? t('tak — przy serii wybierasz gumę') : t('nie')} />
      {!e.bandAssistable && usesBand(e) ? <Muted style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>{t('Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą.')}</Muted> : null}
      {e.tempo ? <Row label={t('Tempo')} value={e.tempo} /> : null}
      {e.notes ? <Row label={t('Notatki techniczne')} value={e.notes} /> : null}
      <ExerciseCues exercise={e} />{/* wskazówki techniki, etap 1 (docs/18 08.10.2026 ok. 23:50) — w podglądzie (edycja na żądanie) */}
      <Muted style={{ fontSize: 13, marginBottom: 12 }}>{bwNote()}</Muted>
      <Muted accessibilityRole="header" style={{ fontSize: 13, marginTop: 6, marginBottom: 4 }}>{t('Ostatnie treningi')}</Muted>
      {hist.length ? hist.map(w => { const sets = w.exercises.filter(x => x.exerciseId === e.id).flatMap(x => x.sets); const line = `${fmtDate(wallTs(w))} · ${sets.map(x => setSummary(e, x)).join(', ')}`;
        return <Btn key={w.id} kind="ghost" small title={line} accessibilityLabel={t('Sesja {d}: {s}', { d: fmtDate(wallTs(w)), s: sets.map(x => setSummary(e, x)).join(', ') })} style={{ justifyContent: 'flex-start', paddingHorizontal: 0 }} onPress={() => onOpen(w.id)} />; })
        : <Muted style={{ fontSize: 13, marginBottom: 6 }}>{t('Jeszcze nie było w treningu.')}</Muted>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}><Btn title={t('Postępy')} onPress={onProgress} /></View>
    </ScrollView></Screen>
  );
}

/** Edycja na szkicu — pola jak dotąd; zmiany trafiają do ćwiczenia dopiero po „Zapisz”. */
function EditForm({ e }: { e: Exercise }) {
  const p = previousFor(e.id);
  const translated = lang() !== 'pl' && exName(e) !== e.name;
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Field label={t('Nazwa')}><Input selectTextOnFocus maxLength={80} value={e.name} onChangeText={v => { e.name = v; save(e); }} /* G2 (audyt 0.10): pusta nazwa przy „Zapisz” wraca do poprzedniej (lib/draft.cleanName) */ /></Field>
      {translated ? <Muted style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>{t('Wyświetlane jako: {n}', { n: exName(e) })}</Muted> : null}
      <Field label={t('Partia')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{GROUPS.map(g => <Chip key={g} label={t(g)} on={e.group === g} onPress={() => { const old = e.group; const auto = old ? GROUP_TO_MUSCLE[old] : undefined; const cur = e.muscles ?? []; e.group = g; const mu = GROUP_TO_MUSCLE[g]; /* runda 5: automatyczna partia z poprzedniej grupy jest podmieniana, a nowa znika z pomocniczych */ if (!cur.length || (cur.length === 1 && cur[0] === auto)) { e.muscles = mu ? [mu] : []; if (mu) e.secondaryMuscles = (e.secondaryMuscles ?? []).filter(x => x !== mu); } save(e); }} />)}</ScrollView></Field>
      <Field label={t('Sprzęt')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{EQ.map(g => <Chip key={g} label={t(g)} on={e.equipment === g} onPress={() => setEquipment(e, g)} />)}</ScrollView></Field>
      <Field label={t('Co logujesz w serii')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{METRICS.map(m => <Chip key={m} label={t(METRIC_LABEL[m])} on={(e.metric ?? 'weight_reps') === m} onPress={() => { e.metric = m; save(e); }} />)}</ScrollView></Field>
      {hasWeight(e.metric ?? 'weight_reps') && e.equipment !== 'masa ciała' ? <Field label={t('Jak liczyć ciężar w objętości')}><ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>{(Object.keys(LOAD_MODE_LABEL) as LoadMode[]).map(m => <Chip key={m} label={t(LOAD_MODE_LABEL[m])} on={(e.loadMode ?? 'total') === m} onPress={() => { e.loadMode = m; save(e); }} />)}</ScrollView></Field> : null}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Field label={t('Przerwa robocza (s)')}><NumInput value={e.restSec ?? ''} onNum={v => { e.restSec = v === '' ? null : Math.min(REST_MAX, Math.max(0, Math.round(v))); save(e); }} placeholder={t('domyślna {s}', { s: getState().settings.defaultRest })} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('Przerwa po rozgrzewce (s)')}><NumInput value={e.restWarmupSec ?? ''} onNum={v => { e.restWarmupSec = v === '' ? null : Math.min(REST_MAX, Math.max(0, Math.round(v))); save(e); }} placeholder={t('jak robocza')} /></Field></View>
      </View>
      <Field label={t('Partie główne (1 seria)')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{MUSCLES.map(mu => <Chip key={mu} label={t(mu)} on={(e.muscles ?? []).includes(mu)} onPress={() => { const has = (e.muscles ?? []).includes(mu); e.muscles = has ? e.muscles.filter(x => x !== mu) : [...(e.muscles ?? []), mu]; if (!has) e.secondaryMuscles = (e.secondaryMuscles ?? []).filter(x => x !== mu); save(e); }} />)}</View></Field>
      <Field label={t('Partie pomocnicze (0,5 serii)')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{MUSCLES.map(mu => <Chip key={mu} label={t(mu)} on={(e.secondaryMuscles ?? []).includes(mu)} onPress={() => { const has = (e.secondaryMuscles ?? []).includes(mu); e.secondaryMuscles = has ? e.secondaryMuscles.filter(x => x !== mu) : [...(e.secondaryMuscles ?? []), mu]; if (!has) e.muscles = (e.muscles ?? []).filter(x => x !== mu); save(e); }} />)}</View></Field>
      <MuscleNote e={e} style={{ marginTop: -6 }} />
      {muscleLoadOf(e).length ? <Field label={t('Obciążenie partii (z katalogu)')}><Muted style={{ fontSize: 13 }} accessibilityLabel={muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])}: ${w === 1 ? t('główna') : w === 0.5 ? t('pomocnicza') : t('stabilizacja')}`).join(', ')}>{muscleLoadOf(e).map(([r, w]) => `${t(REGION_LABEL[r])} ${w === 1 ? '●●●' : w === 0.5 ? '●●' : '●'}`).join(' · ')}</Muted><Muted style={{ fontSize: 11, marginTop: 2 }}>{t('●●● główna · ●● pomocnicza · ● stabilizacja')}</Muted></Field> : null}
      <Field label={t('Asysta gumą')}><Chip toggle label={e.bandAssistable ? t('tak — przy serii wybierasz gumę') : t('nie')} on={e.bandAssistable} onPress={() => { e.bandAssistable = !e.bandAssistable; save(e); }} />{!e.bandAssistable && usesBand(e) ? <Muted style={{ fontSize: 12, marginTop: 4 }}>{t('Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą.')}</Muted> : null /* przegląd 06.10: 34 ćwiczenia z oporem gumy */}</Field>
      <Field label={t('Tempo (opcjonalnie, np. 3-1-1)')}><Input maxLength={20} value={e.tempo} onChangeText={v => { e.tempo = v; save(e); }} /></Field>
      <Field label={t('Notatki techniczne')}><Input maxLength={2000} value={e.notes} onChangeText={v => { e.notes = v; save(e); }} multiline style={{ minHeight: 80 }} /></Field>
      {exerciseInHistory(e.id) ? <Muted style={{ fontSize: 12, marginBottom: 10 }}>{t('Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy).')}</Muted> : null}
      {p ? <Muted style={{ fontSize: 13, marginBottom: 10 }}>{t('Ostatnio {d}:', { d: fmtDate(wallTs(p.workout)) }) /* J3 (fix-data): data w strefie treningu */} {p.sets.map(x => setSummary(e, x)).join(', ')}</Muted> : null}
      {/* E1 (audyt 0.10): e1RM w ćwiczeniach z masą ciała — tylko z masą ciała z Ustawień i udziałem ze źródeł (stats.BW_SHARE) */}
      <Muted style={{ fontSize: 13, marginBottom: 16 }}>{bwNote()}</Muted>
    </ScrollView></Screen>
  );
}
