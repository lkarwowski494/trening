import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { F } from '@/lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen, H1, Item, Btn, Input, Muted, Empty, useOnce } from '@/components/ui';
import { useExercisesTick, useCfgTick, newExercise, visibleExercises, getState, exerciseInHistory, usesBand, restoreExercise, deleteExercise, exercisesInUse, inCoreList, libShowAll, setLibShowAll } from '@/lib/store';
import { LibScopeChip } from '@/components/LibScope';
import { SwipeRow } from '@/components/SwipeRow';
import { GROUPS, formerMatch, type Exercise } from '@/lib/seed';
import { t, exName, fold, collator, lang } from '@/lib/i18n';

/*
 * Audyt 0.10 N3 / PERF-01: 854+ ćwiczeń — lista wirtualizowana (FlatList, jak wybór ćwiczenia), sortowanie raz na zmianę listy (jeden Intl.Collator),
 * zakładka odświeża się tylko przy zmianie tego, co pokazuje (useExercisesTick: nazwa, grupa, sprzęt, tempo, guma) — znak w notatce ćwiczenia
 * albo w szablonie jej nie przelicza. Komunikat przy usuwaniu („historia zostanie”) liczony dopiero przy pytaniu (przegląd historii), nie w każdym wierszu.
 */
type Row = { kind: 'group'; key: string; group: string } | { kind: 'ex'; key: string; e: Exercise; was?: string } | { kind: 'arch'; key: string; e: Exercise };
const EXERCISES_FIRST_RENDER = 30;

export default function ExercisesScreen() {
  const sig = useExercisesTick(); const hist = useCfgTick() /* treningi i szablony */; const router = useRouter(); const once = useOnce(); const [q, setQ] = useState('');
  const ql = fold(q.trim()); const L = lang();
  /* research biblioteki (decyzja 09.10.2026, wariant B): domyślnie podstawowe + własne + użyte; niszowe — wyszukiwaniem albo po zdjęciu filtra */
  const [libAll, setLibAll] = useState(libShowAll());
  /* „już użyte” zależą od treningów i szablonów; lista przelicza się tylko, gdy zmieni się sam zbiór (znak w notatce nie — PERF-01) */
  const usedKey = useMemo(() => [...exercisesInUse()].sort().join(','), [hist]); // eslint-disable-line react-hooks/exhaustive-deps
  const { rows, count, nicheHidden } = useMemo(() => {
    const all = visibleExercises(); const c = collator(); const usedAll = libAll ? null : new Set(usedKey ? usedKey.split(',') : []); const used = ql ? null : usedAll; let hid = 0;
    /* UX2-01 (audyt kontrolny 1, wariant a): dawna nazwa z katalogu (seed.formerMatch) znajduje obecne ćwiczenie — „dawniej: …” zamiast „Utwórz …” */
    const keyed = all.map(e => { const n = exName(e); const hit = !ql || fold(e.name).includes(ql) || fold(n).includes(ql); return { e, n, hit, was: hit ? undefined : formerMatch(e, ql) }; }).filter(x => x.hit || !!x.was).filter(x => { if (!used || inCoreList(x.e, used)) return true; hid++; return false; })
      .sort((a, b) => GROUPS.indexOf(a.e.group) - GROUPS.indexOf(b.e.group) || c.compare(a.n, b.n));
    // Runda 7: usunięte ćwiczenie z historią można tu przywrócić zamiast tworzyć duplikat (jak w pickerze).
    const out: Row[] = ql ? getState().exercises.filter(e => e.archived && (fold(e.name).includes(ql) || fold(exName(e)).includes(ql))).map(e => ({ kind: 'arch' as const, key: 'a' + e.id, e })) : [];
    let last = ''; for (const { e, was } of keyed) { if (e.group !== last) { last = e.group; out.push({ kind: 'group', key: 'g' + e.group, group: e.group }); } out.push({ kind: 'ex', key: e.id, e, ...(was ? { was } : {}) }); }
    return { rows: out, count: usedAll ? all.filter(e => inCoreList(e, usedAll)).length : all.length, nicheHidden: hid }; /* licznik = ćwiczenia w bieżącym zakresie (domyślnie bez niszowych), niezależnie od szukania */
  }, [sig, usedKey, ql, L, libAll]); // eslint-disable-line react-hooks/exhaustive-deps
  const render = ({ item: r }: { item: Row }) => {
    if (r.kind === 'group') return <Muted accessibilityRole="header" style={{ fontSize: 12, fontFamily: F.semibold, paddingTop: 14, paddingBottom: 2 }}>{t(r.group)}</Muted>;
    const e = r.e;
    if (r.kind === 'arch') return <Item title={t('Przywróć „{name}”', { name: exName(e) })} sub={exerciseInHistory(e.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} icon="↺" onPress={() => { restoreExercise(e); setQ(''); router.push(`/exercise/${e.id}`); }} />;
    /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo (z ekranu ćwiczenia przycisk zniknął); treść potwierdzenia jak wcześniej (runda 40) */
    return <SwipeRow label={t('Usuń z biblioteki: {name}', { name: exName(e) })} title={t('Usunąć ćwiczenie?')} message={() => [exerciseInHistory(e.id) ? t('Zniknie z list i szablonów; historia, wykresy i eksport zostaną.') : t('Zniknie z list i szablonów.'), getState().active?.exercises.some(x => x.exerciseId === e.id) ? t('W trwającym treningu zostanie oznaczone jako usunięte.') : ''].filter(Boolean).join(' ')} onDelete={() => { const cur = getState().exercises.find(x => x.id === e.id); if (cur && !cur.archived) deleteExercise(e.id); }}>{a11y => <Item a11y={a11y} title={exName(e)} sub={`${t(e.equipment)}${usesBand(e) ? ' · ' + t('guma') : ''}${e.tempo ? ' · ' + t('tempo') + ' ' + e.tempo : ''}${r.kind === 'ex' && r.was ? ' · ' + t('dawniej: {n}', { n: exName({ name: r.was, lib: true }) }) : ''}`} onPress={() => router.push(`/exercise/${e.id}`)} />}</SwipeRow>;
  };
  const empty = <><Empty>{t('Nic nie pasuje.')}</Empty>{ql ? <Btn title={t('Utwórz „{name}”', { name: q.trim() })} block onPress={once(() => { const e = newExercise(q.replace(/\s+/g, ' ').trim()); setQ(''); router.push(`/exercise/${e.id}?edit=1&new=1`); })} /> : null}</>;
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}><Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}><H1>{t('Ćwiczenia')} <Muted>{count}</Muted></H1><Btn title={t('+ Nowe')} small onPress={once(() => { const e = newExercise(); router.push(`/exercise/${e.id}?edit=1&new=1`); })} /></View>
      <Input value={q} onChangeText={setQ} placeholder={t('Szukaj…')} maxLength={80} autoCorrect={false} />
      <LibScopeChip all={libAll} hidden={nicheHidden} searching={!!ql} onToggle={() => { const v = !libAll; setLibAll(v); setLibShowAll(v); }} />
      <FlatList testID="exercises-list" data={rows} renderItem={render} keyExtractor={r => r.key} initialNumToRender={EXERCISES_FIRST_RENDER} maxToRenderPerBatch={30} windowSize={11}
        keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: 40 }} ListEmptyComponent={empty} />
    </Screen></SafeAreaView>
  );
}
