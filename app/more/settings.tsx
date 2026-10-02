import React from 'react';
import { ScrollView, Alert, View } from 'react-native';
import { Screen, Field, NumInput, Chip, Btn, Muted } from '@/components/ui';
import { getState, useTick, save, resetAll, setModule, applyPrefs } from '@/lib/store';
import { DEFAULT_REST } from '@/lib/seed';
import { MODULES, MODULE_LABEL, MODULES_AVAILABLE, SCHEMA_VERSION } from '@/lib/seed';
import * as timer from '@/lib/timer';
import * as health from '@/lib/health';
import { t, type LangSetting } from '@/lib/i18n';
import { type Unit } from '@/lib/units';

const LANGS: [LangSetting, string][] = [['auto', 'Jak w telefonie'], ['pl', 'Polski'], ['en', 'English']];

export default function SettingsScreen() {
  useTick(); const s = getState().settings;
  const onOff = (v: boolean) => v ? t('włączone') : t('wyłączone');
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Field label={t('Język')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{LANGS.map(([k, label]) => <Chip key={k} label={k === 'auto' ? t(label) : label} on={(s.language ?? 'auto') === k} onPress={() => { s.language = k; applyPrefs(); save(); timer.refreshScheduled().catch(() => {}); /* T4b: zaplanowane powiadomienia w nowym języku */ }} />)}</View></Field>
      <Field label={t('Jednostka ciężaru')}><View style={{ flexDirection: 'row', gap: 6 }}>{(['kg', 'lb'] as Unit[]).map(u => <Chip key={u} label={u} on={(s.unit ?? 'kg') === u} onPress={() => { s.unit = u; applyPrefs(); save(); }} />)}</View></Field>
      <Field label={t('Domyślna przerwa (sekundy)')}><NumInput value={s.defaultRest} onNum={v => { if (v === '') return; s.defaultRest = Math.min(1800, Math.max(0, Math.round(v))); save(); }} placeholder={String(DEFAULT_REST)} /></Field>
      <Field label={t('Dźwięk i wibracja na koniec przerwy')}><Chip toggle label={onOff(s.sound)} on={s.sound} onPress={() => { s.sound = !s.sound; save(); timer.refreshScheduled().catch(() => {}); }} /></Field>
      <Field label={t('Zapisuj zakończone treningi do Apple Health')}><Chip toggle label={onOff(s.healthSync)} on={s.healthSync} onPress={async () => { if (s.healthSync) { s.healthSync = false; save(); return; } const ok = await health.ensureAuthorization(); if (ok) { s.healthSync = true; save(); } else Alert.alert(t('Apple Health niedostępne'), t('Brak zgody albo moduł HealthKit nie jest w tej wersji aplikacji (Expo Go go nie ma — potrzebny build IPA).')); }} /></Field>
      <Field label={t('RPE / RIR przy serii (opcjonalne pole, nie wpływa na objętość)')}><Chip toggle label={s.showRpe ? t('pokazuj') : t('ukryte')} on={s.showRpe} onPress={() => { s.showRpe = !s.showRpe; save(); }} /></Field>
      <Field label={t('Podpowiedź progresji (↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń)')}><Chip toggle label={onOff(s.progressHint)} on={s.progressHint} onPress={() => { s.progressHint = !s.progressHint; save(); }} /></Field>
      <Field label={t('Automatyczna kopia po każdym treningu (Pliki → Na moim iPhonie → Trening → Backup, ostatnie 10)')}><Chip toggle label={onOff(s.autoBackup)} on={s.autoBackup} onPress={() => { s.autoBackup = !s.autoBackup; save(); }} /></Field>
      <Field label={t('Przypomnienie o wadze w poniedziałek o 7:00')}><Chip toggle label={onOff(s.weighReminder)} on={s.weighReminder} onPress={async () => { if (!s.weighReminder && !(await timer.ensurePermission())) { Alert.alert(t('Brak zgody'), t('Włącz powiadomienia dla Trening w Ustawieniach iOS.')); return; } s.weighReminder = !s.weighReminder; save(); timer.scheduleWeighReminder().catch(() => {}); }} /></Field>
      <Field label={t('Ekran włączony podczas treningu')}><Chip toggle label={onOff(s.wakeLock)} on={s.wakeLock} onPress={() => { s.wakeLock = !s.wakeLock; save(); }} /></Field>
      <Btn title={t('Sprawdź zgodę na powiadomienia')} onPress={async () => { const ok = await timer.ensurePermission(); Alert.alert(ok ? t('Powiadomienia działają') : t('Brak zgody'), ok ? t('Koniec przerwy da znać nawet na zablokowanym ekranie.') : t('Włącz powiadomienia dla Trening w Ustawieniach iOS.')); }} />
      <Muted style={{ fontSize: 13, marginVertical: 16 }}>{t('Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.')}</Muted>
      <Field label={t('Moduły (ukryj to, czego nie używasz)')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {MODULES.map(m => { const avail = MODULES_AVAILABLE.has(m); const on = !!s.modules?.[m]; return (
            <Chip key={m} label={t(MODULE_LABEL[m]) + (avail ? '' : ' — ' + t('wkrótce'))} on={avail && on} disabled={!avail || m === 'training'} onPress={() => { if (avail && m !== 'training') setModule(m, !on); }} />); })}
        </View>
      </Field>
      <Muted style={{ fontSize: 12, marginBottom: 16 }}>{t('Trening jest zawsze włączony. Pozostałe moduły pojawią się w kolejnych wersjach — przełącznik już czeka. Schemat danych: v{v}.', { v: SCHEMA_VERSION })}</Muted>
      <Btn title={t('Wyczyść wszystkie dane')} kind="danger" onPress={() => Alert.alert(t('Na pewno?'), t('Usunie ćwiczenia, szablony i całą historię. Bez cofania.'), [{ text: t('Nie') }, { text: t('Wyczyść'), style: 'destructive', onPress: () => { timer.resetAll().catch(() => {}); resetAll(); timer.scheduleWeighReminder().catch(() => {}); /* runda 75 (audyt T14): po wyczyszczeniu domyślne ustawienia — bez przypomnienia */ } }])} />
    </ScrollView></Screen>
  );
}
