import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, View, Linking } from 'react-native';
import { Screen, Field, NumInput, Btn, Muted, SwitchRow, Segmented, SectionTitle, Item } from '@/components/ui';
import { useRouter } from 'expo-router';
import { getState, useTick, save, resetAll, applyPrefs, useForegroundTick } from '@/lib/store';
import { DEFAULT_REST, type ThemeSetting, type WorkoutView } from '@/lib/seed';
import * as timer from '@/lib/timer';
import { PLAN_REMINDER_HOUR, reminderPermission, type ReminderPermission } from '@/lib/planReminder';
import { safetyBackup, safetyRecoveryNote, AUTO_KEEP } from '@/lib/backup';
import * as health from '@/lib/health';
import { t, LANG_NAME, type Lang, appName } from '@/lib/i18n';
import { type Unit } from '@/lib/units';


export default function SettingsScreen() {
  useTick(); const s = getState().settings; const router = useRouter(); const mainLoc = s.locations.find(l => l.id === s.mainLocationId);
  /* audyt 0.10 I1: stan zgody na powiadomienia przy przełączniku przypomnienia (odświeżany po powrocie z Ustawień iOS) */
  const [perm, setPerm] = useState<ReminderPermission | null>(null); const fg = useForegroundTick(); const refreshPerm = () => { reminderPermission().then(setPerm).catch(() => {}); };
  useEffect(refreshPerm, [fg]);
  const openIos = () => { Linking.openSettings().catch(() => {}); };
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <SectionTitle>{t('Ogólne')}</SectionTitle>
      <Item title={t('Język')} sub={s.language && s.language !== 'auto' ? LANG_NAME[s.language as Lang] : t('Jak w telefonie')} onPress={() => router.push('/more/language')} /* 05.10.2026: 16 języków — osobna lista */ />
      <Field label={t('Wygląd')}><Segmented label={t('Wygląd')} options={[['light', t('Jasny')], ['dark', t('Ciemny')], ['auto', t('Jak w telefonie')]] as [ThemeSetting, string][]} value={s.theme ?? 'light'} onChange={v => { s.theme = v; applyPrefs(); save(); }} /></Field>
      <Field label={t('Jednostka ciężaru')}><Segmented label={t('Jednostka ciężaru')} options={[['kg', 'kg'], ['lb', 'lb']] as [Unit, string][]} value={(s.unit ?? 'kg') as Unit} onChange={u => { s.unit = u; applyPrefs(); save(); }} /></Field>

      <SectionTitle>{t('Trening')}</SectionTitle>
      <Field label={t('Widok treningu')}><Segmented label={t('Widok treningu')} options={[['focus', t('Skupiony')], ['list', t('Lista')]] as [WorkoutView, string][]} value={s.workoutView ?? 'focus'} onChange={v => { s.workoutView = v; save(); }} /></Field>
      <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{s.workoutView === 'list' ? t('Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty.') : t('Skupiony: bieżąca seria dużymi cyframi i talerze na stronę nad listą ćwiczeń.')}</Muted>
      <Field label={t('Domyślna przerwa (sekundy)')}><NumInput value={s.defaultRest} onNum={v => { if (v === '') return; s.defaultRest = Math.min(1800, Math.max(0, Math.round(v))); save(); }} placeholder={String(DEFAULT_REST)} /></Field>
      <SwitchRow label={t('Dźwięk i wibracja na koniec przerwy')} value={s.sound} onChange={v => { s.sound = v; save(); timer.refreshScheduled().catch(() => {}); }} />
      <SwitchRow label={t('Ekran włączony podczas treningu')} value={s.wakeLock} onChange={v => { s.wakeLock = v; save(); }} />
      <SwitchRow label={t('RPE / RIR przy serii')} detail={t('opcjonalne pole, nie wpływa na objętość')} value={s.showRpe} onChange={v => { s.showRpe = v; save(); }} />
      {s.showRpe ? <>
        <Field label={t('Skala wysiłku')}><Segmented label={t('Skala wysiłku')} options={[['rpe', 'RPE'], ['rir', 'RIR']] as ['rpe' | 'rir', string][]} value={s.effortScale ?? 'rpe'} onChange={v => { if (v === 'rir') s.effortScale = v; else delete s.effortScale; save(); }} /></Field>
        <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{t('RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali.')}</Muted>
      </> : null}
      <Item title={t('Miejsca treningu')} sub={s.locations.length ? t('{n}, główne: {m}', { n: s.locations.length, m: mainLoc?.name ?? '—' }) : t('sprzęt w domu, na siłowni, w hotelu…')} onPress={() => router.push('/more/locations')} /* P-003 E1 */ />
      <SwitchRow label={t('Podpowiedź progresji')} detail={t('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń')} value={s.progressHint} onChange={v => { s.progressHint = v; save(); }} />

      <SectionTitle>{t('Dane i kopie')}</SectionTitle>
      <SwitchRow label={t('Zapisuj zakończone treningi do Apple Health')} value={s.healthSync} onChange={async v => { if (!v) { s.healthSync = false; save(); return; } const ok = await health.ensureAuthorization(); if (ok) { s.healthSync = true; save(); } else Alert.alert(t('Apple Health niedostępne'), t('Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); }} />
      <SwitchRow label={t('Automatyczna kopia po każdym treningu')} detail={t('Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}', { app: appName(), n: AUTO_KEEP })} value={s.autoBackup} onChange={v => { s.autoBackup = v; save(); }} />

      <SectionTitle>{t('Powiadomienia')}</SectionTitle>
      <SwitchRow label={t('Przypomnienie o treningu z planu')} detail={t('rano o {h}:00 w dniu zaplanowanego treningu', { h: PLAN_REMINDER_HOUR })} value={s.planReminder !== false} onChange={v => { if (v) { delete s.planReminder; timer.ensurePermission().then(refreshPerm).catch(() => {}); } else s.planReminder = false; save(); }} />{/* 08.10.2026 (decyzja właściciela) */}
      {s.planReminder !== false && perm === 'denied' ? <View testID="perm-denied" style={{ gap: 6, marginTop: 4 }}>
        <Muted style={{ fontSize: 13 }}>{t('Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.')}</Muted>
        <Btn small title={t('Otwórz Ustawienia iOS')} onPress={openIos} style={{ alignSelf: 'flex-start' }} />
      </View> : s.planReminder !== false && perm === 'undetermined' ? <Muted style={{ fontSize: 13, marginTop: 4 }}>{t('Zgody na powiadomienia jeszcze nie ma — „Sprawdź zgodę na powiadomienia” poprosi o nią.')}</Muted> : null}{/* audyt 0.10 I1 */}
      <Btn title={t('Sprawdź zgodę na powiadomienia')} style={{ marginTop: 12 }} onPress={async () => { const ok = await timer.ensurePermission(); refreshPerm(); if (ok) Alert.alert(t('Powiadomienia działają'), t('Koniec przerwy i przypomnienie o treningu z planu przyjdą także przy zablokowanym ekranie.')); else Alert.alert(t('Brak zgody'), t('Włącz powiadomienia dla {app} w Ustawieniach iOS.', { app: appName() }), [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Otwórz Ustawienia iOS'), onPress: openIos }]); }} />
      <Muted style={{ fontSize: 13, marginVertical: 12 }}>{t('Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.')}</Muted>

      {/* Moduły schowane (decyzja właściciela 05.10.2026: „Na razie schowaj moduły”) — ustawienia modułów zostają w danych */}
      <SectionTitle>{t('Dane w telefonie')}</SectionTitle>
      <Btn title={t('Wyczyść wszystkie dane')} kind="danger" onPress={() => Alert.alert(t('Na pewno?'), t('Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować).', { app: appName() }) + safetyRecoveryNote(), [{ text: t('Nie') }, { text: t('Wyczyść'), style: 'destructive', onPress: () => { safetyBackup('reset').then(() => { timer.resetAll().catch(() => {}); resetAll(); timer.scheduleWeighReminder().catch(() => {}); /* runda 75 (audyt T14): po wyczyszczeniu domyślne ustawienia — bez przypomnienia */ }).catch((e: unknown) => Alert.alert(t('Dane nie zostały wyczyszczone'), e instanceof Error ? e.message : undefined)); /* Q-019: najpierw kopia bezpieczeństwa w Backup/ */ } }])} />
    </ScrollView></Screen>
  );
}
