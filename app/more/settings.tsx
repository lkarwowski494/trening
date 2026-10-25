import { MedicalNote } from '@/components/MedicalNote';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { paywallOn } from '@/lib/entitlement';
import React, { useEffect, useState } from 'react';
import { Alert, View, Linking } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { Screen, Field, NumInput, Btn, Muted, SwitchRow, Segmented, SectionTitle, Item } from '@/components/ui';
import { useRouter } from 'expo-router';
import { getState, useTick, save, saveCfg, resetAll, applyPrefs, useForegroundTick, REST_MAX, RIR_MAX, RPE_LIGHT } from '@/lib/store';
import { DEFAULT_REST, type ThemeSetting, type WorkoutView } from '@/lib/seed';
import * as timer from '@/lib/timer';
import { hapticsEnabled } from '@/lib/haptics';
import { sampleVoice, voiceAvailable, voiceSetting, setVoiceSetting, voiceSettingLabel, VOICE_SETTINGS, type VoiceSetting } from '@/lib/voice';
import { PLAN_REMINDER_HOUR, reminderPermission, type ReminderPermission } from '@/lib/planReminder';
import { safetyBackup, safetyRecoveryNote, AUTO_KEEP } from '@/lib/backup';
import * as health from '@/lib/health';
import { t, LANG_NAME, type Lang, appName } from '@/lib/i18n';
import { type Unit } from '@/lib/units';
import { WEEKLY_SETS_MARK, manualSetsGoal } from '@/lib/stats';
import { SET_PARTS, SETS_GOAL_MIN, SETS_GOAL_MAX, clampGoal, type SetPart } from '@/lib/setParts';
import { cancelButton } from '@/lib/confirm';


export default function SettingsScreen() {
  useTick(); const s = getState().settings; const router = useRouter();
  /* audyt 0.10 I1: stan zgody na powiadomienia przy przełączniku przypomnienia (odświeżany po powrocie z Ustawień iOS) */
  const [perm, setPerm] = useState<ReminderPermission | null>(null); const fg = useForegroundTick(); const refreshPerm = () => { reminderPermission().then(setPerm).catch(() => {}); };
  useEffect(refreshPerm, [fg]);
  const openIos = () => { Linking.openSettings().catch(() => {}); };
  const [goalsOpen, setGoalsOpen] = useState(false);
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      {paywallOn() ? <SubscriptionCard /> /* 0.17.0 (docs/27): karta tylko przy PAYWALL.ENABLED */ : null}
      <SectionTitle>{t('Ogólne')}</SectionTitle>
      <Item title={t('Język')} sub={s.language && s.language !== 'auto' ? LANG_NAME[s.language as Lang] : t('Jak w telefonie')} onPress={() => router.push('/more/language')} /* 05.10.2026: 16 języków — osobna lista */ />
      <Field label={t('Wygląd')}><Segmented label={t('Wygląd')} options={[['light', t('Jasny')], ['dark', t('Ciemny')], ['auto', t('Jak w telefonie')]] as [ThemeSetting, string][]} value={s.theme ?? 'light'} onChange={v => { s.theme = v; applyPrefs(); saveCfg(); }} /></Field>
      <Field label={t('System miar')}><Segmented testID="unit-system" label={t('System miar')} options={[['kg', t('metryczny (kg, km, m)')], ['lb', t('imperialny (lb, mi, yd)')]] as [Unit, string][]} value={(s.unit ?? 'kg') as Unit} onChange={u => { s.unit = u; applyPrefs(); save(); }} /></Field>

      <SectionTitle>{t('Trening')}</SectionTitle>
      <Field label={t('Widok treningu')} infoId="workout-view" info={s.workoutView === 'list' ? t('Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty.') : t('Skupiony: bieżąca seria dużymi cyframi nad listą ćwiczeń.')}><Segmented label={t('Widok treningu')} options={[['focus', t('Skupiony')], ['list', t('Lista')]] as [WorkoutView, string][]} value={s.workoutView ?? 'focus'} onChange={v => { s.workoutView = v; saveCfg(); }} /></Field>
      <Field label={t('Domyślna przerwa (s)')}><NumInput value={s.defaultRest} onNum={v => { if (v === '') return; s.defaultRest = Math.min(REST_MAX, Math.max(0, Math.round(v))) /* UI2-09: limit z jednego miejsca */; saveCfg(); }} placeholder={String(DEFAULT_REST)} /></Field>
      {/* ZM-07 (p5d, 21.10.2026): dwa przełączniki. „Wibracje” (s.haptics) — brak pola = jak dźwięk (lib/haptics hapticsEnabled), więc po aktualizacji nic się nie zmienia;
          pierwsze przełączenie „Dźwięku” utrwala dotychczasowy stan wibracji, żeby przełączniki były od tej chwili niezależne (nie przełącza ich po cichu). */}
      <SwitchRow label={t('Dźwięk na koniec przerwy')} detail={t('W trybie cichym telefon tylko wibruje')} /* decyzja właściciela 23.10.2026 (wariant A): zachowanie systemu, tylko wskazówka */ value={s.sound} onChange={v => { if (s.haptics === undefined) s.haptics = hapticsEnabled(s); s.sound = v; saveCfg(); timer.refreshScheduled().catch(() => {}); timer.refreshStale().catch(() => {}); }} />
      <SwitchRow label={t('Wibracje')} value={hapticsEnabled(s)} onChange={v => { s.haptics = v; saveCfg(); }} />
      {/* 19.10.2026 (decyzja właściciela): jeden wybór zamiast przełącznika „Głos także przez głośnik telefonu”; to samo zmienia pozycja „Zapowiedzi głosowe” w menu „⋯” na ekranie treningu */}
      <Field label={t('Zapowiedzi głosowe')} infoId="voice-mode" info={[t('Na początku przerwy telefon zapowiada następne ćwiczenie, ciężar i powtórzenia. W słuchawkach — tylko przy podłączonych słuchawkach; Także przez głośnik — również bez słuchawek, przez głośnik telefonu (także w trybie cichym); Wyłączone — bez zapowiedzi.'), t('Zapowiedzi działają, gdy włączony jest „Dźwięk na koniec przerwy”. To samo ustawienie zmienisz w menu „⋯” na ekranie treningu.')]}>
        <Segmented testID="voice-mode" label={t('Zapowiedzi głosowe')} options={VOICE_SETTINGS.map(v => [v, voiceSettingLabel(v)] as [VoiceSetting, string])} value={voiceSetting(s)} onChange={setVoiceSetting} />
      </Field>
      <Btn title={t('Posłuchaj przykładu')} small onPress={() => { sampleVoice().catch(() => {}); }} />
      {!voiceAvailable() ? <Muted style={{ fontSize: 13, marginTop: 4, marginBottom: 8 }}>{t('Brak głosu dla języka aplikacji w tym telefonie. Pobierz go w Ustawieniach iOS (Dostępność).')}</Muted> : null}
      <SwitchRow label={t('Ekran włączony podczas treningu')} value={s.wakeLock} onChange={v => { s.wakeLock = v; saveCfg(); }} />
      <SwitchRow label={t('RPE / RIR przy serii')} detail={t('opcjonalne pole, nie wpływa na objętość')} value={s.showRpe} onChange={v => { s.showRpe = v; saveCfg(); }} />
      {s.showRpe ? <>
        <Field label={t('Skala wysiłku')} infoId="effort-scale" info={[t('RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali.'), t('RIR wpisuje się w zakresie 0–{max}; więcej niż {max} powtórzeń w zapasie zapisuje się jako „lekko” (RPE {light}), bo poniżej RPE {min} skala opisuje wysiłek słowami, a nie powtórzeniami w zapasie (Helms i in. 2016).', { max: RIR_MAX, light: RPE_LIGHT, min: 10 - RIR_MAX })]}><Segmented label={t('Skala wysiłku')} testID="effort-scale" options={[['rpe', 'RPE'], ['rir', 'RIR']] as ['rpe' | 'rir', string][]} value={s.effortScale ?? 'rpe'} onChange={v => { if (v === 'rir') s.effortScale = v; else delete s.effortScale; saveCfg(); }} /></Field>
      </> : null}
      <SwitchRow label={t('Podpowiedź progresji')} detail={t('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń') + ' ' + t('Krok zmiany (np. +2,5 kg) to konwencja, a nie wynik badań.')} value={s.progressHint} onChange={v => { s.progressHint = v; saveCfg(); }} />
      {/* 11.10.2026 (docs/22, P5 A): „Masa ciała” przeniesiona do zakładki Postępy (sekcja „Masa ciała”) — z Ustawień wejście zniknęło */}

      <SectionTitle infoId="sets-goal" info={t('Kreska w „Ten tydzień” i w Postępach. Automatycznie: {n} serii (stanowisko ACSM 2026). Ręcznie: własna liczba od {min} do {max}.', { n: WEEKLY_SETS_MARK, min: SETS_GOAL_MIN, max: SETS_GOAL_MAX })}>{t('Cel serii na partię w tygodniu')}</SectionTitle>{/* 12.10.2026 (decyzja właściciela, docs/research/32): cel osobno dla każdej partii; automat = jedna liczba ze źródłami; ⓘ 14.10.2026 */}
      <Btn small expanded={goalsOpen} accessibilityLabel={t('Cele partii')} title={goalsOpen ? t('Ukryj cele partii') : t('Pokaż cele partii')} style={{ alignSelf: 'flex-start', marginBottom: 8 }} onPress={() => setGoalsOpen(o => !o)} />
      {goalsOpen ? <View testID="set-goals">{SET_PARTS.map(p => <SetGoalRow key={p} part={p} />)}</View> : null}

      <MedicalNote style={{ marginTop: 18, marginBottom: 10 }} /* L1 (audyt 0.10, MER-11 A); UI2-09: w sekcji „Trening”, nie nad „Wyczyść wszystkie dane” */ />
      <SectionTitle>{t('Dane i kopie')}</SectionTitle>
      <SwitchRow label={t('Zapisuj zakończone treningi do Apple Health')} value={s.healthSync} onChange={async v => { if (!v) { s.healthSync = false; save(); return; } const ok = await health.ensureAuthorization(); if (ok) { s.healthSync = true; save(); } else Alert.alert(t('Apple Health niedostępne'), t('Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); }} />
      {s.healthSync && health.healthPending().length ? <View testID="health-pending-count" style={{ gap: 6, marginTop: -2, marginBottom: 8 }}>{/* audyt 0.10 J2 (DAT-04 B): licznik i ponowienie */}
        <Muted style={{ fontSize: 13 }}>{t('Czeka na zapis w Apple Health: {n}. Zapis zostanie ponowiony przy uruchomieniu i powrocie do aplikacji.', { n: health.healthPending().length })}</Muted>
        <Btn small title={t('Ponów teraz')} style={{ alignSelf: 'flex-start' }} onPress={() => { health.retryHealth().then(() => { if (health.healthPending().length) Alert.alert(t('Nie udało się zapisać w Apple Health'), t('Treningi nadal czekają na zapis w Apple Health. Sprawdź zgodę w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); }).catch(() => {}); }} />
      </View> : null}
      <SwitchRow label={t('Pokazuj dane z Apple Health')} detail={t('Kroki, inne aktywności oraz tętno i kcal z zegarka — tylko do wglądu, dane zostają w Zdrowiu.')} value={s.healthRead === true} onChange={async v => {
        if (!v) { delete s.healthRead; save(); return; } /* 0.16.0 (P2 A): wyłączenie = aplikacja przestaje pytać Zdrowie; zgoda w iOS zostaje */
        const r = await health.ensureReadAuthorization();
        if (r === 'unavailable') Alert.alert(t('Apple Health niedostępne'), t('Apple Health nie jest dostępne na tym urządzeniu.'));
        else if (r === 'failed') Alert.alert(t('Nie udało się włączyć Apple Health'), t('Spróbuj ponownie.'));
        else { s.healthRead = true; save(); Alert.alert(t('Gotowe'), t('Jeśli dane się nie pokażą, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })); } /* iOS nie mówi, czy odmówiono odczytu — przełącznik włączony niezależnie od wyborów w arkuszu */
      }} />
      {s.healthRead ? <View testID="health-read-note" style={{ marginTop: -2, marginBottom: 8 }}><Muted style={{ fontSize: 13 }}>{t('Zgodę cofniesz w aplikacji Zdrowie: profil → Aplikacje → {app}.', { app: appName() })}</Muted></View> : null}
      <SwitchRow label={t('Automatyczna kopia po każdym treningu')} detail={t('Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}', { app: appName(), n: AUTO_KEEP })} value={s.autoBackup} onChange={v => { s.autoBackup = v; saveCfg(); }} />

      <SectionTitle infoId="notifications" info={t('Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.')}>{t('Powiadomienia')}</SectionTitle>
      <SwitchRow label={t('Przypomnienie o treningu z planu')} detail={t('rano o {h}:00 w dniu zaplanowanego treningu', { h: PLAN_REMINDER_HOUR })} value={s.planReminder !== false} onChange={v => { if (v) { delete s.planReminder; timer.ensurePermission().then(refreshPerm).catch(() => {}); } else s.planReminder = false; save(); }} />{/* 08.10.2026 (decyzja właściciela) */}
      {s.planReminder !== false && perm === 'denied' ? <View testID="perm-denied" style={{ gap: 6, marginTop: 4 }}>
        <Muted style={{ fontSize: 13 }}>{t('Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.')}</Muted>
        <Btn small title={t('Otwórz Ustawienia iOS')} onPress={openIos} style={{ alignSelf: 'flex-start' }} />
      </View> : s.planReminder !== false && perm === 'undetermined' ? <Muted style={{ fontSize: 13, marginTop: 4 }}>{t('Zgody na powiadomienia jeszcze nie ma — „Sprawdź zgodę na powiadomienia” poprosi o nią.')}</Muted> : null}{/* audyt 0.10 I1 */}
      <Btn title={t('Sprawdź zgodę na powiadomienia')} style={{ marginTop: 12 }} onPress={async () => { const ok = await timer.ensurePermission(); refreshPerm(); if (ok) Alert.alert(t('Powiadomienia działają'), t('Koniec przerwy i przypomnienie o treningu z planu przyjdą także przy zablokowanym ekranie.')); else Alert.alert(t('Brak zgody'), t('Włącz powiadomienia dla {app} w Ustawieniach iOS.', { app: appName() }), [{ ...cancelButton() }, { text: t('Otwórz Ustawienia iOS'), onPress: openIos }]); }} />

      {/* Moduły schowane (decyzja właściciela 05.10.2026: „Na razie schowaj moduły”) — ustawienia modułów zostają w danych */}
      <SectionTitle>{t('Dane w telefonie')}</SectionTitle>
      <Btn title={t('Wyczyść wszystkie dane')} kind="danger" onPress={() => Alert.alert(t('Wyczyścić wszystkie dane?') /* G5 (audyt 0.10 UI-14): konkretne pytanie zamiast „Na pewno?” */, t('Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować).', { app: appName() }) + (getState().active ? ' ' + t('Trening w toku też zostanie usunięty.') : '') /* G3 (audyt 0.10 UI-06) */ + safetyRecoveryNote(), [{ ...cancelButton() }, { text: t('Wyczyść'), style: 'destructive', onPress: () => { safetyBackup('reset').then(() => { timer.resetAll().catch(() => {}); resetAll(); timer.scheduleWeighReminder().catch(() => {}); /* runda 75 (audyt T14): po wyczyszczeniu domyślne ustawienia — bez przypomnienia */ }).catch((e: unknown) => Alert.alert(t('Dane nie zostały wyczyszczone'), e instanceof Error ? e.message : undefined)); /* Q-019: najpierw kopia bezpieczeństwa w Backup/ */ } }])} />
    </ScrollView></Screen>
  );
}

/** Cel serii jednej części: „Automatycznie” (WEEKLY_SETS_MARK) albo „Ręcznie” z własną liczbą; w danych zostaje tylko odstępstwo (Settings.weeklySetGoals). */
function SetGoalRow({ part }: { part: SetPart }) {
  const s = getState().settings; const manual = manualSetsGoal(part); const label = t(part);
  const put = (n: number | null) => {
    const g = { ...(s.weeklySetGoals ?? {}) };
    if (n === null) delete g[part]; else g[part] = clampGoal(n);
    if (Object.keys(g).length) s.weeklySetGoals = g; else delete s.weeklySetGoals; save();
  };
  return (
    <Field label={label}>
      <Segmented label={t('Cel serii: {part}', { part: label })} options={[['auto', t('Automatycznie ({n})', { n: WEEKLY_SETS_MARK })], ['manual', t('Ręcznie')]] as ['auto' | 'manual', string][]}
        value={manual === undefined ? 'auto' : 'manual'} onChange={v => put(v === 'auto' ? null : WEEKLY_SETS_MARK)} />
      {manual !== undefined ? <NumInput testID={`set-goal-${part}`} accessibilityLabel={t('Cel serii: {part}', { part: label })} value={manual} onNum={v => { if (v === '') return; put(v); }} placeholder={String(WEEKLY_SETS_MARK)} style={{ marginTop: 6 }} /> : null}
    </Field>);
}
