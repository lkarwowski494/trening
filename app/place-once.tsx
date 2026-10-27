import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, Muted, Chip, Field, Input, SectionTitle, SwitchRow, Missing } from '@/components/ui';
import { font, SPACE } from '@/lib/theme';
import { getState, useTick, setActiveLocation, pruneOneOff, NAME_MAX, fmtDayKey } from '@/lib/store';
import { useCloseHeader, useDismiss } from '@/components/CloseButton';
import { addOneOffLocation, ONE_OFF_DEFAULT_NAME, ONE_OFF_PRESETS } from '@/lib/locations';
import { adaptCandidates, restoreCandidates } from '@/lib/adapt';
import { setPlanPlace, placeDays } from '@/lib/plan';
import { EQUIPMENT, EQUIP_GROUPS, EQUIP_GROUP_LABEL, LOCATION_PRESET_LABEL, equipEntry, equipLabel, presetEquipment } from '@/lib/equipment';
import type { LocEquip } from '@/lib/seed';
import { t } from '@/lib/i18n';

/**
 * 0.19 (docs/33 A4 i B; decyzje właściciela P1 A, P6 B): „Inne miejsce” — szybka lista sprzętu zamiast pełnego edytora miejsca.
 *  - z chipa „📍” w treningu („Inne miejsce (tylko dziś)…”): „Użyj” zmienia miejsce tego treningu na ukryte miejsce jednorazowe (Location.oneOff) i — gdy są
 *    propozycje — otwiera okno „Dostosuj do: X”;
 *  - z panelu dnia w Kalendarzu (`?from=&to=`, „📍 Miejsce na te dni” → „Inne miejsce…”): „Użyj” ustawia to miejsce na dni od–do (State.planPlaces).
 * Sprzęt: gotowe zestawy (Hotel, Tylko masa ciała, Dom) i pozycje z grup — bez wpisywania ciężarów (uproszczenie: pozycje z pustym opisem ciężarów;
 * zestaw „Hotel” zachowuje swoje hantle). Nazwa domyślnie „Tylko dziś”; „Zapisz jako miejsce” robi zwykłe miejsce z listy (znacznik oneOff zdjęty).
 * „Anuluj” (po lewej, wzorzec docs/32) nic nie zmienia.
 */
const KEY = /^\d{4}-\d{2}-\d{2}$/;
const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : '');
export default function PlaceOnceScreen() {
  useTick(); const router = useRouter(); const dismiss = useDismiss(); const busy = useRef(false); const p = useLocalSearchParams<{ from?: string | string[]; to?: string | string[] }>();
  const from = one(p.from), to = one(p.to); const range = KEY.test(from) && KEY.test(to) && placeDays(from, to).length ? { from, to } : null;
  const unit = getState().settings.unit; const [name, setName] = useState(''); const [keep, setKeep] = useState(false);
  const [sel, setSel] = useState<Record<string, LocEquip>>({}); const [preset, setPreset] = useState<string | null>(null);
  const fallback = range ? t('Inne miejsce') : ONE_OFF_DEFAULT_NAME();
  const use = () => {
    if (busy.current) return; busy.current = true;
    const eq = EQUIPMENT.filter(x => sel[x.id]).map(x => sel[x.id]);
    const l = addOneOffLocation(name, eq, keep, fallback);
    if (range) { setPlanPlace(range.from, range.to, l.id); pruneOneOff(); dismiss(); return; }
    const a = getState().active; if (!a) { pruneOneOff(); dismiss(); return; }
    setActiveLocation(l.id); /* trening w toku: przyrządy bloków wg nowego miejsca (8c), nic nie jest zamieniane */
    const cur = getState().active; /* jak w arkuszu „📍”: propozycje do przejrzenia otwierają okno „Dostosuj” (P2 A) */
    if (cur && (adaptCandidates(cur, l.id).length || restoreCandidates(cur, l.id).length)) router.replace('/adapt'); else dismiss();
  };
  const ready = !!range || !!getState().active;
  const headerOpts = useCloseHeader(undefined, ready ? { title: t('Użyj'), onPress: use, testID: 'place-once-use' } : null);
  const toggle = (id: string, on: boolean) => { setPreset(null); setSel(s => { const n = { ...s }; if (on) n[id] = equipEntry(id, unit); else delete n[id]; return n; }); };
  const pick = (k: typeof ONE_OFF_PRESETS[number]) => { setPreset(k); setSel(Object.fromEntries(presetEquipment(k, unit).map(e => [e.item, e]))); };
  if (!ready) return <Screen style={{ paddingTop: 10 }}><Stack.Screen options={headerOpts} /><Missing>{t('Nie ma treningu w toku.')}</Missing></Screen>;
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={headerOpts} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Muted style={{ marginBottom: 8 }}>{range
          ? t('Miejsce na dni {a} – {b}. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać.', { a: fmtDayKey(range.from), b: fmtDayKey(range.to) })
          : t('Miejsce tylko na ten trening. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać.')}</Muted>
        <Field label={t('Nazwa')}><Input value={name} onChangeText={setName} placeholder={fallback} maxLength={NAME_MAX} returnKeyType="done" /></Field>
        <SwitchRow label={t('Zapisz jako miejsce')} detail={t('Miejsce trafi na listę miejsc (Więcej → Miejsca i sprzęt).')} value={keep} onChange={setKeep} />
        <SectionTitle>{t('Gotowe zestawy')}</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {ONE_OFF_PRESETS.map(k => <Chip key={k} label={equipLabel(LOCATION_PRESET_LABEL[k])} on={preset === k} onPress={() => pick(k)} />)}
        </View>
        <SectionTitle>{t('Sprzęt')}</SectionTitle>
        {EQUIP_GROUPS.map(g => <View key={g} style={{ marginBottom: 8 }}>
          <Muted style={{ ...font('footnote'), marginBottom: SPACE.xs }}>{equipLabel(EQUIP_GROUP_LABEL[g])}</Muted>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {EQUIPMENT.filter(x => x.group === g).map(x => <Chip key={x.id} toggle label={equipLabel(x)} on={!!sel[x.id]} onPress={() => toggle(x.id, !sel[x.id])} />)}
          </View>
        </View>)}
      </ScrollView>
    </Screen>
  );
}
