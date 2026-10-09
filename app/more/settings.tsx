import { MedicalNote } from '@/components/MedicalNote';
import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, View, Linking } from 'react-native';
import { Screen, Field, NumInput, Btn, Muted, SwitchRow, Segmented, SectionTitle, Item } from '@/components/ui';
import { useRouter } from 'expo-router';
import { getState, useTick, save, saveCfg, resetAll, applyPrefs, useForegroundTick, latestBodyMass, fmtDate, localDateTs, REST_MAX, setPlanHintHidden, RIR_MAX, RPE_LIGHT } from '@/lib/store';
import { DEFAULT_REST, type ThemeSetting, type WorkoutView } from '@/lib/seed';
import * as timer from '@/lib/timer';
import { PLAN_REMINDER_HOUR, reminderPermission, type ReminderPermission } from '@/lib/planReminder';
import { safetyBackup, safetyRecoveryNote, AUTO_KEEP } from '@/lib/backup';
import * as health from '@/lib/health';
import { t, LANG_NAME, type Lang, appName } from '@/lib/i18n';
import { type Unit, fmtW } from '@/lib/units';


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
      <Field label={t('Wygląd')}><Segmented label={t('Wygląd')} options={[['light', t('Jasny')], ['dark', t('Ciemny')], ['auto', t('Jak w telefonie')]] as [ThemeSetting, string][]} value={s.theme ?? 'light'} onChange={v => { s.theme = v; applyPrefs(); saveCfg(); }} /></Field>
      <Field label={t('Jednostka ciężaru')}><Segmented label={t('Jednostka ciężaru')} options={[['kg', 'kg'], ['lb', 'lb']] as [Unit, string][]} value={(s.unit ?? 'kg') as Unit} onChange={u => { s.unit = u; applyPrefs(); save(); }} /></Field>

      <SectionTitle>{t('Trening')}</SectionTitle>
      <Field label={t('Widok treningu')}><Segmented label={t('Widok treningu')} options={[['focus', t('Skupiony')], ['list', t('Lista')]] as [WorkoutView, string][]} value={s.workoutView ?? 'focus'} onChange={v => { s.workoutView = v; saveCfg(); }} /></Field>
      <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{s.workoutView === 'list' ? t('Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty.') : t('Skupiony: bieżąca seria dużymi cyframi i talerze na stronę nad listą ćwiczeń.')}</Muted>
      <Field label={t('Domyślna przerwa (sekundy)')}><NumInput value={s.defaultRest} onNum={v => { if (v === '') return; s.defaultRest = Math.min(REST_MAX, Math.max(0, Math.round(v))) /* UI2-09: limit z jednego miejsca */; saveCfg(); }} placeholder={String(DEFAULT_REST)} /></Field>
      <SwitchRow label={t('Dźwięk i wibracja na koniec przerwy')} value={s.sound} onChange={v => { s.sound = v; saveCfg(); timer.refreshScheduled().catch(() => {}); }} />
      <SwitchRow label={t('Ekran włączony podczas treningu')} value={s.wakeLock} onChange={v => { s.wakeLock = v; saveCfg(); }} />
      <SwitchRow label={t('RPE / RIR przy serii')} detail={t('opcjonalne pole, nie wpływa na objętość')} value={s.showRpe} onChange={v => { s.showRpe = v; saveCfg(); }} />
      {s.showRpe ? <>
        <Field label={t('Skala wysiłku')}><Segmented label={t('Skala wysiłku')} options={[['rpe', 'RPE'], ['rir', 'RIR']] as ['rpe' | 'rir', string][]} value={s.effortScale ?? 'rpe'} onChange={v => { if (v === 'rir') s.effortScale = v; else delete s.effortScale; saveCfg(); }} /></Field>
        <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{t('RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali.')}</Muted>
        <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{t('RIR wpisuje się w zakresie 0–{max}; więcej niż {max} powtórzeń w zapasie zapisuje się jako „lekko” (RPE {light}), bo poniżej RPE {min} skala opisuje wysiłek słowami, a nie powtórzeniami w zapasie (Helms i in. 2016).', { max: RIR_MAX, light: RPE_LIGHT, min: 10 - RIR_MAX })}</Muted>{/* audyt kontrolny 1 MER2-08 */}
      </> : null}
      <Item title={t('Miejsca i sprzęt')} /* H2 (audyt 0.10): jedna nazwa (Więcej, Ustawienia, nagłówek, przewodnik) */ sub={s.locations.length ? t('{n}, główne: {m}', { n: s.locations.length, m: mainLoc?.name ?? '—' }) : t('sprzęt w domu, na siłowni, w hotelu…')} onPress={() => router.push('/more/locations')} /* P-003 E1 */ />
      <SwitchRow label={t('Podpowiedź progresji')} detail={t('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń')} value={s.progressHint} onChange={v => { s.progressHint = v; saveCfg(); }} />
      <SwitchRow label={t('Zachęta do planu tygodnia')} detail={t('tekst na karcie „Dziś” i w Kalendarzu, gdy nie ma planu')} value={!getState().planHintHidden} onChange={v => setPlanHintHidden(!v)} />{/* B1 (09.10.2026): powrót po „Ukryj” */}
      {/* audyt 0.10 (E1, wariant B; fala 2 — masa ciała z datą): pomiary na osobnym ekranie (historia, data pomiaru), tu ostatni */}
      <Item title={t('Masa ciała')} sub={(b => b ? t('{v} · pomiar z {d}', { v: fmtW(b.kg), d: fmtDate(localDateTs(b.date)) }) : t('nie podano — e1RM podciągania i pompek'))(latestBodyMass())} onPress={() => router.push('/more/bodymass')} />

      <MedicalNote style={{ marginTop: 18, marginBottom: 10 }} /* L1 (audyt 0.10, MER-11 A); UI2-09: w sekcji „Trening”, nie nad „Wyczyść wszystkie dane” */ />
      <SectionTitle>{t('Dane i kopie')}</SectionTitle>
      <SwitchRow label={t('Zapisuj zakończone treningi do Apple Health')} value={s.healthSync} onChange={async v => { if (!v) { s.healthSync = false; save(); return; } const ok = await health.ensureAuthorization(); if (ok) { s.healthSync = true; save(); } else Alert.alert(t('Apple Health niedostępne'), t('Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); }} />
      {s.healthSync && health.healthPending().length ? <View testID="health-pending-count" style={{ gap: 6, marginTop: -2, marginBottom: 8 }}>{/* audyt 0.10 J2 (DAT-04 B): licznik i ponowienie */}
        <Muted style={{ fontSize: 13 }}>{t('Czeka na zapis w Apple Health: {n}. Ponawiam przy uruchomieniu i powrocie do aplikacji.', { n: health.healthPending().length })}</Muted>
        <Btn small title={t('Ponów teraz')} style={{ alignSelf: 'flex-start' }} onPress={() => { health.retryHealth().then(() => { if (health.healthPending().length) Alert.alert(t('Nie udało się'), t('Treningi nadal czekają na zapis w Apple Health. Sprawdź zgodę w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); }).catch(() => {}); }} />
      </View> : null}
      <SwitchRow label={t('Automatyczna kopia po każdym treningu')} detail={t('Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}', { app: appName(), n: AUTO_KEEP })} value={s.autoBackup} onChange={v => { s.autoBackup = v; saveCfg(); }} />

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
      <Btn title={t('Wyczyść wszystkie dane')} kind="danger" onPress={() => Alert.alert(t('Wyczyścić wszystkie dane?') /* G5 (audyt 0.10 UI-14): konkretne pytanie zamiast „Na pewno?” */, t('Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować).', { app: appName() }) + (getState().active ? ' ' + t('Trening w toku też zostanie usunięty.') : '') /* G3 (audyt 0.10 UI-06) */ + safetyRecoveryNote(), [{ text: t('Nie'), style: 'cancel' }, { text: t('Wyczyść'), style: 'destructive', onPress: () => { safetyBackup('reset').then(() => { timer.resetAll().catch(() => {}); resetAll(); timer.scheduleWeighReminder().catch(() => {}); /* runda 75 (audyt T14): po wyczyszczeniu domyślne ustawienia — bez przypomnienia */ }).catch((e: unknown) => Alert.alert(t('Dane nie zostały wyczyszczone'), e instanceof Error ? e.message : undefined)); /* Q-019: najpierw kopia bezpieczeństwa w Backup/ */ } }])} />
    </ScrollView></Screen>
  );
}
