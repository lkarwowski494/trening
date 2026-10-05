import React from 'react';
import { ScrollView, Alert, View } from 'react-native';
import { Screen, Field, NumInput, Chip, Btn, Muted, SwitchRow, Segmented, SectionTitle, Item } from '@/components/ui';
import { useRouter } from 'expo-router';
import { getState, useTick, save, resetAll, setModule, applyPrefs } from '@/lib/store';
import { DEFAULT_REST } from '@/lib/seed';
import { MODULES, MODULE_LABEL, MODULES_AVAILABLE, SCHEMA_VERSION } from '@/lib/seed';
import * as timer from '@/lib/timer';
import { safetyBackup, safetyRecoveryNote } from '@/lib/backup';
import * as health from '@/lib/health';
import { t, type LangSetting } from '@/lib/i18n';
import { type Unit } from '@/lib/units';

const LANGS: [LangSetting, string][] = [['auto', 'Jak w telefonie'], ['pl', 'Polski'], ['en', 'English']];

export default function SettingsScreen() {
  useTick(); const s = getState().settings; const router = useRouter(); const mainLoc = s.locations.find(l => l.id === s.mainLocationId);
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <SectionTitle>{t('Ogólne')}</SectionTitle>
      <Field label={t('Język')}><Segmented label={t('Język')} options={LANGS.map(([k, label]) => [k, k === 'auto' ? t(label) : label] as [LangSetting, string])} value={(s.language ?? 'auto') as LangSetting} onChange={k => { s.language = k; applyPrefs(); save(); timer.refreshScheduled().catch(() => {}); /* T4b: zaplanowane powiadomienia w nowym języku */ }} /></Field>
      <Field label={t('Jednostka ciężaru')}><Segmented label={t('Jednostka ciężaru')} options={[['kg', 'kg'], ['lb', 'lb']] as [Unit, string][]} value={(s.unit ?? 'kg') as Unit} onChange={u => { s.unit = u; applyPrefs(); save(); }} /></Field>

      <SectionTitle>{t('Trening')}</SectionTitle>
      <Field label={t('Domyślna przerwa (sekundy)')}><NumInput value={s.defaultRest} onNum={v => { if (v === '') return; s.defaultRest = Math.min(1800, Math.max(0, Math.round(v))); save(); }} placeholder={String(DEFAULT_REST)} /></Field>
      <SwitchRow label={t('Dźwięk i wibracja na koniec przerwy')} value={s.sound} onChange={v => { s.sound = v; save(); timer.refreshScheduled().catch(() => {}); }} />
      <SwitchRow label={t('Ekran włączony podczas treningu')} value={s.wakeLock} onChange={v => { s.wakeLock = v; save(); }} />
      <SwitchRow label={t('RPE / RIR przy serii')} detail={t('opcjonalne pole, nie wpływa na objętość')} value={s.showRpe} onChange={v => { s.showRpe = v; save(); }} />
      <Item title={t('Miejsca treningu')} sub={s.locations.length ? t('{n}, główne: {m}', { n: s.locations.length, m: mainLoc?.name ?? '—' }) : t('sprzęt w domu, na siłowni, w hotelu…')} onPress={() => router.push('/more/locations')} /* P-003 E1 */ />
      <SwitchRow label={t('Podpowiedź progresji')} detail={t('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń')} value={s.progressHint} onChange={v => { s.progressHint = v; save(); }} />

      <SectionTitle>{t('Dane i kopie')}</SectionTitle>
      <SwitchRow label={t('Zapisuj zakończone treningi do Apple Health')} value={s.healthSync} onChange={async v => { if (!v) { s.healthSync = false; save(); return; } const ok = await health.ensureAuthorization(); if (ok) { s.healthSync = true; save(); } else Alert.alert(t('Apple Health niedostępne'), t('Brak zgody albo moduł HealthKit nie jest w tej wersji aplikacji (Expo Go go nie ma — potrzebny build IPA).')); }} />
      <SwitchRow label={t('Automatyczna kopia po każdym treningu')} detail={t('Pliki → Na moim iPhonie → Trening → Backup, ostatnie 10')} value={s.autoBackup} onChange={v => { s.autoBackup = v; save(); }} />

      <SectionTitle>{t('Powiadomienia')}</SectionTitle>
      <Btn title={t('Sprawdź zgodę na powiadomienia')} style={{ marginTop: 12 }} onPress={async () => { const ok = await timer.ensurePermission(); Alert.alert(ok ? t('Powiadomienia działają') : t('Brak zgody'), ok ? t('Koniec przerwy da znać nawet na zablokowanym ekranie.') : t('Włącz powiadomienia dla Trening w Ustawieniach iOS.')); }} />
      <Muted style={{ fontSize: 13, marginVertical: 12 }}>{t('Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.')}</Muted>

      <SectionTitle>{t('Moduły')}</SectionTitle>
      <Field label={t('Ukryj to, czego nie używasz')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {MODULES.map(m => { const avail = MODULES_AVAILABLE.has(m); const on = !!s.modules?.[m]; return (
            <Chip key={m} label={t(MODULE_LABEL[m]) + (avail ? '' : ' — ' + t('wkrótce'))} on={avail && on} disabled={!avail || m === 'training'} onPress={() => { if (avail && m !== 'training') setModule(m, !on); }} />); })}
        </View>
      </Field>
      <Muted style={{ fontSize: 12, marginBottom: 16 }}>{t('Trening jest zawsze włączony. Pozostałe moduły pojawią się w kolejnych wersjach — przełącznik już czeka. Schemat danych: v{v}.', { v: SCHEMA_VERSION })}</Muted>
      <SectionTitle>{t('Dane w telefonie')}</SectionTitle>
      <Btn title={t('Wyczyść wszystkie dane')} kind="danger" onPress={() => Alert.alert(t('Na pewno?'), t('Usunie ćwiczenia, szablony i całą historię. Przedtem obecne dane zapiszą się jako kopia w Plikach: Trening → Backup (można ją zaimportować).') + safetyRecoveryNote(), [{ text: t('Nie') }, { text: t('Wyczyść'), style: 'destructive', onPress: () => { safetyBackup('reset').then(() => { timer.resetAll().catch(() => {}); resetAll(); timer.scheduleWeighReminder().catch(() => {}); /* runda 75 (audyt T14): po wyczyszczeniu domyślne ustawienia — bez przypomnienia */ }).catch((e: unknown) => Alert.alert(t('Dane nie zostały wyczyszczone'), e instanceof Error ? e.message : undefined)); /* Q-019: najpierw kopia bezpieczeństwa w Backup/ */ } }])} />
    </ScrollView></Screen>
  );
}
