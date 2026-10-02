import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { Screen, Input, Chip, Item, Muted, Empty } from '@/components/ui';
import { getState, addExerciseToActive, newExercise, save, visibleExercises, exerciseInHistory } from '@/lib/store';
import { uid } from '@/lib/seed';
import { draftAddExercise } from '@/lib/edit';
import { GROUPS, GROUP_TO_MUSCLE, hasReps, type Exercise } from '@/lib/seed';
import { t, exName, locale, fold } from '@/lib/i18n';

/** target = 'active' (dodaj do treningu) | 'template:<id>' (dodaj do szablonu) | 'edit:<klucz szkicu>' (edytor historii, docs/12) */
export default function PickerScreen() {
  // Runda 26: parametr z linku może być tablicą (powtórzony ?target=) — tylko tekst, inaczej nic nie dodajemy.
  const raw = useLocalSearchParams<{ target?: string | string[] }>().target; const target = typeof raw === 'string' ? raw : ''; const router = useRouter();
  const th = useTheme(); const [q, setQ] = useState(''); const [g, setG] = useState(''); const st = getState(); const chosen = useRef(false);
  const headerOpts = useMemo(() => ({ headerRight: () => <Pressable accessibilityRole="button" hitSlop={10} onPress={() => { if (chosen.current) return; chosen.current = true; /* weryfikacja: podwójne „Anuluj” zamykało też ekran pod spodem */ if (router.canGoBack()) router.back(); else router.replace('/'); }}><Text style={{ color: th.accent, fontSize: 17 }}>{t('Anuluj')}</Text></Pressable> }), [th, router]); // eslint-disable-line react-hooks/exhaustive-deps
  const ql = fold(q.trim());
  // Runda 6: dokładne trafienie nazwy pokazujemy mimo filtra partii — inaczej picker proponował utworzenie duplikatu.
  const exact = (e: Exercise) => !!ql && (fold(e.name) === ql || fold(exName(e)) === ql);
  const list = visibleExercises().filter(e => (!g || e.group === g || exact(e)) && (!ql || fold(e.name).includes(ql) || fold(exName(e)).includes(ql))).sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || exName(a).localeCompare(exName(b), locale()));
  const choose = (ex: Exercise) => {
    if (chosen.current) return; chosen.current = true; // podwójne tapnięcie nie doda ćwiczenia dwa razy ani nie cofnie o dwa ekrany
    if (target === 'active') addExerciseToActive(ex);
    else if (target.startsWith('edit:')) draftAddExercise(target.slice(5), ex);
    else if (target?.startsWith('template:')) { const tpl = st.templates.find(x => x.id === target.slice(9)); tpl?.items.push({ id: uid(), exerciseId: ex.id, sets: 3, repMin: hasReps(ex.metric ?? 'weight_reps') ? 8 : null, repMax: hasReps(ex.metric ?? 'weight_reps') ? 10 : null, restSec: null, startWeight: '', targetSec: '', groupId: null }); save(tpl); }
    if (router.canGoBack()) router.back(); else router.replace('/');
  };
  let last = ''; const rows: React.ReactNode[] = [];
  list.forEach(e => { if (!g && !ql && e.group !== last) { last = e.group; rows.push(<Muted key={'g' + e.group} accessibilityRole="header" style={{ fontSize: 12, fontWeight: '600', paddingTop: 12, paddingBottom: 2 }}>{t(e.group)}</Muted>); }
    rows.push(<Item key={e.id} title={exName(e)} sub={`${t(e.equipment)}${e.bandAssistable ? ' · ' + t('guma') : ''}`} onPress={() => choose(e)} icon="+" />); });
  // Usunięte ćwiczenie o pasującej nazwie można przywrócić razem z historią, zamiast tworzyć puste nowe (runda 4).
  const archived = ql ? st.exercises.filter(e => e.archived && (fold(e.name).includes(ql) || fold(exName(e)).includes(ql))) : [];
  archived.forEach(e => rows.push(<Item key={'a' + e.id} title={t('Przywróć „{name}”', { name: exName(e) })} sub={exerciseInHistory(e.id) ? t('usunięte ćwiczenie z historią') : t('usunięte ćwiczenie (w bieżącym treningu)')} onPress={() => { if (chosen.current) return; e.archived = false; save(e); choose(e); }} icon="↺" />));
  if (ql && !list.some(e => fold(e.name) === ql || fold(exName(e)) === ql) && !archived.some(e => fold(e.name) === ql || fold(exName(e)) === ql)) rows.push(<Item key="new" title={t('Utwórz „{name}”', { name: q.trim() })} sub={t('nowe ćwiczenie własne')} onPress={() => { if (chosen.current) return; const e = newExercise(q.replace(/\s+/g, ' ').trim()); if (g) { e.group = g as Exercise['group']; const mu = GROUP_TO_MUSCLE[e.group]; e.muscles = mu ? [mu] : []; save(e); } /* runda 6: partia jak przy zmianie grupy w edycji */ choose(e); }} icon="+" />);
  return (
    <Screen style={{ paddingTop: 10 }}>
      {/* Audyt przed telefonem: okno zamykało się tylko gestem w dół (niedostępnym dla VoiceOver) — przycisk w nagłówku */}
      <Stack.Screen options={headerOpts} />
      <Input value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} maxLength={80} autoFocus autoCorrect={false} />
      <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0, marginVertical: 8 }} /* runda 69: chipy nie są ściskane do zera */>
        <Chip label={t('Wszystkie')} on={g === ''} onPress={() => setG('')} />{GROUPS.map(x => <Chip key={x} label={t(x)} on={g === x} onPress={() => setG(x)} />)}
      </ScrollView>
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: 40 }}>{rows.length ? rows : <Empty>{t('Nic nie pasuje.')}</Empty>}</ScrollView>
    </Screen>
  );
}
