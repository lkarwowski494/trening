import React, { useRef, useState } from 'react';
import { ScrollView, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, H2, Muted, Item } from '@/components/ui';
import { WhenFields } from '@/components/WhenFields';
import { getState, useTick, exById } from '@/lib/store';
import { beginPast, defaultPastWhen, parseWhen, activeOverlapError } from '@/lib/edit';
import { t, tp } from '@/lib/i18n';

/*
 * Docs/12: trening wstecz (jak „Log a past workout” w Strong/Hevy, „Add as Past Workout” w Fitbod). Najpierw termin
 * (domyślnie wczoraj 18:00, 60 min) i szablon albo pusty trening, potem ten sam edytor co przy edycji sesji z historii.
 */
export default function AddPastWorkout() {
  useTick(); const router = useRouter(); const [when, setWhen] = useState(defaultPastWhen); const busy = useRef(false);
  const start = (tplId: string | null) => {
    if (busy.current) return; Keyboard.dismiss();
    const r = parseWhen(when.date, when.time, when.min);
    const err = 'error' in r ? r.error : activeOverlapError(r.start, r.end);
    if (err || 'error' in r) { Alert.alert(t('Sprawdź datę i godzinę'), err ?? ''); return; }
    busy.current = true; const d = beginPast(tplId, r.start, r.end);
    router.replace(`/history/edit/${encodeURIComponent(d.key)}`);
  };
  const tpls = getState().templates.filter(x => x.items.some(it => { const e = exById(it.exerciseId); return e && !e.archived; }));
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Muted style={{ fontSize: 13, marginBottom: 12 }}>{t('Trening, którego nie zapisałeś na bieżąco. Ustaw termin i wybierz szablon — serie uzupełnisz w następnym kroku (wartości z ostatniego treningu przed tą datą).')}</Muted>
      <WhenFields date={when.date} time={when.time} min={when.min} onChange={p => setWhen(x => ({ ...x, ...p }))} />
      <H2 style={{ marginTop: 16 }}>{t('Z szablonu')}</H2>
      {tpls.map(tpl => { const sets = tpl.items.reduce((a, i) => a + i.sets, 0); return <Item key={tpl.id} title={tpl.name} sub={`${tpl.items.length} ${t('ćw.')} · ${sets} ${tp(sets, 'seria|serie|serii')}`} onPress={() => start(tpl.id)} />; })}
      {!tpls.length ? <Muted style={{ fontSize: 13 }}>{t('Brak szablonów z ćwiczeniami — utworzysz je w zakładce Szablony. Możesz też zacząć od pustego treningu.')}</Muted> : null}
      <Item title={t('Pusty trening')} sub={t('ćwiczenia dodasz w następnym kroku')} onPress={() => start(null)} />
    </ScrollView></Screen>
  );
}
