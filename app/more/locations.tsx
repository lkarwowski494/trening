import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Item, Btn, Muted, Empty, SectionTitle, useOnce } from '@/components/ui';
import { getState, useTick } from '@/lib/store';
import { addLocation, canDeleteLocation, deleteLocation } from '@/lib/locations';
import { SwipeRow } from '@/components/SwipeRow';
import { LOCATION_PRESETS, LOCATION_PRESET_LABEL, presetHint, equipLabel } from '@/lib/equipment';
import { t, tp } from '@/lib/i18n';

/* P-003 E1: Ustawienia → Miejsca treningu (docs/10, sekcja 5). Lista miejsc (główne oznaczone) i „+ Dodaj miejsce” z presetami. */
export default function Locations() {
  useTick(); const s = getState().settings; const router = useRouter(); const [adding, setAdding] = useState(false); const once = useOnce();
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}>
      <Muted style={{ marginBottom: 8 }}>{t('Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu.')}</Muted>
      {s.locations.map(l => { const main = l.id === s.mainLocationId; const n = l.equipment.filter(e => !e.off).length;
        /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo (z ekranu miejsca przycisk zniknął); miejsca głównego się nie usuwa — bez gestu */
        const used = getState().workouts.some(w => w.locationId === l.id) || getState().templates.some(x => x.locationId === l.id);
        return <SwipeRow key={l.id} disabled={!canDeleteLocation(l.id)} blocked={{ title: t('To miejsce główne'), message: t('Miejsca głównego nie usuniesz — najpierw ustaw inne miejsce jako główne.') }} label={t('Usuń miejsce: {name}', { name: l.name })} title={t('Usunąć miejsce?')} message={[used ? t('Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”.') : '', getState().active?.locationId === l.id ? t('Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”.') : ''].filter(Boolean).join(' ') || undefined /* G3 (audyt 0.10 UI-06): skutki także dla treningu w toku */} onDelete={() => deleteLocation(l.id)}>{a11y => <Item a11y={a11y} title={(main ? '★ ' : '') + l.name} sub={[main ? t('główne') : '', `${n} ${tp(n, 'pozycja sprzętu|pozycje sprzętu|pozycji sprzętu')}`].filter(Boolean).join(' · ')} onPress={() => router.push(`/more/location/${l.id}`)} />}</SwipeRow>; })}
      {s.locations.length ? null : <Empty>{t('Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd.')}</Empty>}
      {adding ? <>
        <SectionTitle>{t('Nowe miejsce')}</SectionTitle>
        {LOCATION_PRESETS.map(p => <Item key={p} title={equipLabel(LOCATION_PRESET_LABEL[p])} sub={presetHint(p, s.unit)} /* audyt 0.10 LOG-08: opis z danych presetu, w jednostce aplikacji */ icon="+" onPress={once(() => { const l = addLocation(p); setAdding(false); router.push(`/more/location/${l.id}`); })} />)}
        <Btn title={t('Anuluj')} kind="ghost" style={{ marginTop: 8 }} onPress={() => setAdding(false)} />
      </> : <Btn title={t('+ Dodaj miejsce')} block style={{ marginTop: 14 }} onPress={() => setAdding(true)} />}
    </ScrollView></Screen>
  );
}
