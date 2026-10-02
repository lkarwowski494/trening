import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Item, Btn, Muted, Empty, SectionTitle, useOnce } from '@/components/ui';
import { getState, useTick } from '@/lib/store';
import { addLocation } from '@/lib/locations';
import { LOCATION_PRESETS, LOCATION_PRESET_LABEL, LOCATION_PRESET_HINT, equipLabel } from '@/lib/equipment';
import { t, tp } from '@/lib/i18n';

/* P-003 E1: Ustawienia → Miejsca treningu (docs/10, sekcja 5). Lista miejsc (główne oznaczone) i „+ Dodaj miejsce” z presetami. */
export default function Locations() {
  useTick(); const s = getState().settings; const router = useRouter(); const [adding, setAdding] = useState(false); const once = useOnce();
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}>
      <Muted style={{ marginBottom: 8 }}>{t('Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu.')}</Muted>
      {s.locations.map(l => { const main = l.id === s.mainLocationId; const n = l.equipment.length;
        return <Item key={l.id} title={(main ? '★ ' : '') + l.name} sub={[main ? t('główne') : '', `${n} ${tp(n, 'pozycja sprzętu|pozycje sprzętu|pozycji sprzętu')}`].filter(Boolean).join(' · ')} onPress={() => router.push(`/more/location/${l.id}`)} />; })}
      {s.locations.length ? null : <Empty>{t('Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd.')}</Empty>}
      {adding ? <>
        <SectionTitle>{t('Nowe miejsce')}</SectionTitle>
        {LOCATION_PRESETS.map(p => <Item key={p} title={equipLabel(LOCATION_PRESET_LABEL[p])} sub={equipLabel(LOCATION_PRESET_HINT[p])} icon="+" onPress={once(() => { const l = addLocation(p); setAdding(false); router.push(`/more/location/${l.id}`); })} />)}
        <Btn title={t('Anuluj')} kind="ghost" style={{ marginTop: 8 }} onPress={() => setAdding(false)} />
      </> : <Btn title={t('+ Dodaj miejsce')} block style={{ marginTop: 14 }} onPress={() => setAdding(true)} />}
    </ScrollView></Screen>
  );
}
