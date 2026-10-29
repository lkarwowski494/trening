import { DeleteButton } from '@/components/DeleteButton';
import React, { useCallback, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { View, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { takePlanNotice } from '@/components/OwnPlan';
import { Screen, Chip, Muted, Txt, Btn, Item, Field, Input, SectionTitle, Missing } from '@/components/ui';
import { SwipeRow } from '@/components/SwipeRow';
import { getState, useTick, templateGroups, newTemplate, SAVED_PLANS_MAX } from '@/lib/store';
import { ownTemplates } from '@/lib/generator';
import { useTheme, FONT, FW, font, GLYPH_SCALE_MAX } from '@/lib/theme';
import { weekPlanDays, setWeekDay, planName, setPlanName, typePlanName, savedPlans, newPlan, setSavedDay, typeSavedName, renamePlan, activatePlan, deactivatePlan, hasActivePlan, deletePlan, plansFull, activationNote, savedChanges, hasPlan, assignTarget, type PlanDays } from '@/lib/plan';
import { askReminderPermission } from '@/lib/planReminder';
import { t, locale, lang } from '@/lib/i18n';
import { cancelButton } from '@/lib/confirm';
import { useAddHeader } from '@/components/AddButton';
import { weekdayLabels, weekdayNames } from '@/lib/calendar';

/*
 * Plan tygodnia (kalendarz, decyzja właściciela 08.10.2026, wariant 2A): dla każdego dnia pon…nd szablon albo „Wolne”. Plan powtarza się co tydzień;
 * zmiany pojedynczych dni robi się w Kalendarzu (panel dnia). Szablony ustawia właściciel — tu tylko przypisanie do dni.
 * 08.10.2026 (docs/24): kilka planów, jeden aktywny — nazwa, „Inne plany” z „Ustaw jako aktywny”, usuwanie gestem.
 * Audyt 0.10 (decyzje właściciela 08.10.2026 wieczór):
 * - UX-15 A: 7 wierszy „poniedziałek — Upper A ›”, wybór szablonu po tapnięciu (grupy jak foldery szablonów); „Inne plany” na górze;
 * - B2 A: „+ Nowy plan” — osobny wpis (kopia aktywnego), edytowany tu przed „Ustaw jako aktywny” (/plan?id=…); oryginał bez zmian; nazwy bez powtórzeń;
 * - B1: okno aktywacji mówi, ile zmian dni przejdzie z obecnym planem i ile wróci z nowym (lib/plan activationNote);
 * - B3: najwyżej SAVED_PLANS_MAX planów w „Inne plany” (jak migrate); B4: nazwa zapisywana przy każdej zmianie pola, porządkowana przy końcu edycji;
 * - I1: pierwszy dzień w planie — prośba o zgodę na powiadomienia (przypomnienie rano).
 * - UI2-08 (audyt kontrolny 1): zapisany plan (/plan?id=…) ma w nagłówku swoją nazwę (bez nazwy — „Inny plan”), nie „Plan tygodnia”.
 */
/** Średnica znacznika stanu planu (koło ✓) — okrągły, więc promień to połowa. */
const TOGGLE = 26;
const weekdayName = (i: number) => weekdayNames()[i];
const weekdayShort = (i: number) => weekdayLabels()[i];
const tplName = (id: string | null) => (id ? getState().templates.find(x => x.id === id && !x.archived)?.name ?? '' : '');
/** „pon. Upper A · śr. Upper B” — dni z treningiem. */
export const planSummary = (days: PlanDays) => days.map((id, i) => (tplName(id) ? `${weekdayShort(i)} ${tplName(id)}` : '')).filter(Boolean).join(', ') /* M1-audytor-generalny-029: lista dni — przecinek (wz. 28) */ || t('bez treningów');
const nameOr = (n: string) => n || t('Poprzedni plan');
/** Ile zapisanych planów widać od razu (reszta po „Pokaż wszystkie”). */
const OTHER_FIRST = 3;

/** Ikona stanu planu na liście (decyzja właściciela 11.10.2026, docs/18 pkt 5): aktywny — wypełnione koło ze znakiem ✓, pozostałe — puste koło (kształt, nie tylko kolor).
 * Etykieta VoiceOver nazywa działanie, wartość — stan („aktywny” / „nieaktywny”). */
function PlanToggle({ name, active, onPress }: { name: string; active: boolean; onPress: () => void }) {
  const th = useTheme();
  return (
    <Pressable accessibilityLanguage={lang()} testID={active ? 'plan-toggle-on' : 'plan-toggle-off'} accessibilityRole="button" hitSlop={4}
      accessibilityLabel={active ? t('Wyłącz plan: {name}', { name }) : t('Ustaw jako aktywny: {name}', { name })} accessibilityValue={{ text: active ? t('aktywny') : t('nieaktywny') }}
      accessibilityHint={active ? t('Kalendarz od dziś będzie pusty.') : t('Pyta o potwierdzenie.')} onPress={onPress}
      style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
      <View style={{ width: TOGGLE, height: TOGGLE, borderRadius: TOGGLE / 2, borderWidth: 2, borderColor: active ? th.accent : th.text, backgroundColor: active ? th.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {active ? <Txt maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.bg, ...font('callout'), lineHeight: 20 /* ≥ 1,28 × fontSize — diakrytyki (test i18n-wave2) */, fontFamily: FONT.title700 }}>✓</Txt> : null}
      </View>
    </Pressable>);
}
/** docs/22 krok 3 pkt 1 (11.10.2026): z Planowania da się przejść do listy szablonów (zakładka Szablony — zamknięcie stosu i przejście, jak „Pokaż” w Przewodniku). */
const openTemplates = (router: ReturnType<typeof useRouter>) => router.push('/templates'); /* 11.10.2026: Szablony to ekran w stosie (Więcej → Szablony), nie zakładka — powrót wraca do planu */

/** 7 wierszy dni (UX-15 A): wiersz pokazuje dzień i szablon, tapnięcie rozwija wybór (szablony bez folderu, potem foldery). */
function DayRows({ days, onSet, target }: { days: PlanDays; onSet: (i: number, id: string | null) => void; target: (i: number) => string }) {
  const th = useTheme(); const router = useRouter(); const [open, setOpen] = useState<number | null>(null); const groups = templateGroups();
  /* docs/18 09.10.2026 (B): „+ Nowy szablon” — edycja nowego szablonu; po „Zapisz” trafia na ten dzień tego planu (lib/plan assignNewTemplate) */
  const create = (i: number) => { setOpen(null); const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1&assign=${encodeURIComponent(target(i))}`); };
  return <>{days.map((id, i) => { const nm = tplName(id) || t('Wolne'); const isOpen = open === i; return (
    <View key={i} testID={`plan-day-${i}`} style={{ borderBottomWidth: 1, borderBottomColor: th.line }}>
      <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={`${weekdayName(i)}, ${nm}`} accessibilityHint={t('Wybierz szablon na ten dzień.')} accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(isOpen ? null : i)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, gap: 8, opacity: pressed ? 0.6 : 1 })}>
        <Txt style={{ ...FW.semibold }}>{weekdayName(i)}</Txt>
        <Txt style={{ flexShrink: 1, textAlign: 'right', color: tplName(id) ? th.text : th.muted }}>{`${nm} ${isOpen ? '▾' : '▸'}`}</Txt>
      </Pressable>
      {isOpen ? <View style={{ paddingBottom: 10, gap: 6 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}><Chip label={t('Wolne')} on={!tplName(id)} a11yLabel={`${weekdayName(i)}: ${t('Wolne')}`} onPress={() => { onSet(i, null); setOpen(null); }} /></View>
        {groups.map(g => <View key={g.folder ?? ''} style={{ gap: 4 }}>
          {g.folder ? <Muted style={{ ...font('footnote'), ...FW.semibold }}>{g.folder}</Muted> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{g.items.map(x => <Chip key={x.id} label={x.name} on={x.id === id} a11yLabel={`${weekdayName(i)}: ${x.name}`} onPress={() => { onSet(i, x.id); setOpen(null); }} />)}</View>
        </View>)}
        {!groups.length ? <Muted style={{ ...font('footnote') }}>{t('Nie masz jeszcze szablonów.')}</Muted> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          <Btn nav small kind="ghost" title={t('+ Nowy szablon')} accessibilityLabel={`${weekdayName(i)}: ${t('+ Nowy szablon')}`} accessibilityHint={t('Po zapisie szablon trafi na ten dzień.')} onPress={() => create(i)} />
          <Btn nav small kind="ghost" title={t('Szablony ›')} accessibilityLabel={`${weekdayName(i)}: ${t('Szablony')}`} accessibilityHint={t('Otwiera listę szablonów.')} onPress={() => openTemplates(router)} />
        </View>
      </View> : null}
    </View>); })}</>;
}

export default function PlanScreen() {
  useTick(); const router = useRouter(); const { id } = useLocalSearchParams<{ id?: string }>();
  const saved = id ? savedPlans().find(p => p.id === id) : undefined; const initial = useRef(saved?.name ?? '');
  const activate = (pid: string, name: string, after?: () => void) => {
    Alert.alert(t('Ustawić „{name}” jako aktywny plan?', { name: nameOr(name) }), activationNote(pid) || undefined, [
      { ...cancelButton() }, { text: t('Ustaw'), onPress: () => { activatePlan(pid); after?.(); } },
    ]); };
  if (id && !saved) return <Screen><Missing>{t('Nie ma takiego planu.')}</Missing></Screen>;
  if (saved) return ( /* B2 A: zapisany plan edytowany przed aktywacją */
    <Screen><Stack.Screen options={{ title: saved.name || t('Inny plan') }} />{/* UI2-08: nie „Plan tygodnia” — to nie aktywny plan */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <Muted style={{ ...font('footnote'), marginBottom: 8 }}>{t('Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”.')}</Muted>
      <Field label={t('Nazwa planu')}><Input testID="plan-name" value={saved.name} maxLength={40} accessibilityLabel={t('Nazwa planu')} onChangeText={v => typeSavedName(saved.id, v)} onEndEditing={() => { renamePlan(saved.id, savedPlans().find(p => p.id === saved.id)?.name ?? '', initial.current); initial.current = savedPlans().find(p => p.id === saved.id)?.name ?? initial.current; }} /></Field>
      {savedChanges(saved.id) ? <Muted style={{ ...font('footnote'), marginBottom: 8 }}>{t('Zmiany pojedynczych dni zapisane z tym planem: {n} — wrócą po aktywacji.', { n: savedChanges(saved.id) })}</Muted> : null}
      <Btn nav title={t('Ustaw jako aktywny')} kind="primary" small accessibilityLabel={t('Ustaw jako aktywny: {name}', { name: nameOr(saved.name) })} onPress={() => activate(saved.id, saved.name, () => { if (router.canGoBack()) router.back(); else router.replace('/plan'); })} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />
      <Btn nav small kind="ghost" title={t('Szablony')} accessibilityHint={t('Otwiera listę szablonów.')} onPress={() => openTemplates(router)} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />
      <SectionTitle>{t('Dni tygodnia')}</SectionTitle>
      <DayRows days={saved.days} onSet={(i, x) => setSavedDay(saved.id, i, x)} target={i => assignTarget.saved(saved.id, i)} />
      {/* 04-studio-projektowe-003: widoczna droga bez gestu — to samo okno co przesunięcie wiersza na liście „Inne plany” */}
      <DeleteButton label={t('Usuń plan')} title={t('Usunąć ten plan?')} message={nameOr(saved.name)} onDelete={() => { deletePlan(saved.id); if (router.canGoBack()) router.back(); else router.replace('/plan'); }} />
    </ScrollView></Screen>);
  return <ActivePlan activate={activate} />;
}

function ActivePlan({ activate }: { activate: (id: string, name: string) => void }) {
  const router = useRouter(); const days = weekPlanDays(); const other = savedPlans(); const [all, setAll] = useState(false); const shown = all ? other : other.slice(0, OTHER_FIRST);
  const off = () => {
    /* docs/18 pkt 5 (11.10.2026): wyłączenie zawsze z potwierdzeniem; „Inne plany” pełne — plan nie miałby gdzie się zapisać */
    if (plansFull()) { Alert.alert(t('Nie można wyłączyć planu'), t('W „Inne plany” jest już {n} planów — usuń któryś, by wyłączyć obecny.', { n: SAVED_PLANS_MAX })); return; }
    Alert.alert(t('Wyłączyć plan?'), [t('Kalendarz od dziś będzie pusty.'), activationNote() ? activationNote() : ''].filter(Boolean).join('\n'), [{ ...cancelButton() }, { text: t('Wyłącz'), style: 'destructive', onPress: () => { deactivatePlan(); } }]); };
  const addHeader = useAddHeader(!plansFull() ? t('Dodaj plan') : null, () => { const nid = newPlan(); if (nid) router.push(`/plan?id=${nid}`); }, t('Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny.')); /* 13.10.2026: „+” w nagłówku; UI2-02: blokada podwójnego tapnięcia w AddButton */
  /* ZM-03: zdanie potwierdzenia po zapisie z generatora (istniejący klucz „jest teraz aktywny” — docs/design/teksty.md #23 proponuje „jest aktywny”, tłumacz może zmienić brzmienie) (pierwszy plan aktywny bez pytania) — tylko do opuszczenia ekranu, VoiceOver je ogłasza */
  const [notice, setNotice] = useState<string | null>(null);
  useFocusEffect(useCallback(() => { const n = takePlanNotice(); if (n) { const msg = t('Plan „{name}” jest teraz aktywny.', { name: n }); setNotice(msg); AccessibilityInfo.announceForAccessibility?.(msg); } return () => setNotice(null); }, []));
  const setDay = (i: number, x: string | null) => { const had = hasPlan(); setWeekDay(i, x); if (!had && hasPlan()) askReminderPermission().catch(() => {}); };
  return (
    <Screen><Stack.Screen options={addHeader} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      {notice ? <Txt testID="plan-notice" style={{ ...FW.semibold, marginBottom: 8 }}>{notice}</Txt> : null}
      {hasActivePlan() ? <View testID="active-plan-row" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><PlanToggle name={nameOr(planName() || t('Mój plan'))} active onPress={off} /><Txt style={{ flex: 1, ...FW.semibold }}>{t('Aktywny plan')}</Txt></View> : null}
      <Field label={t('Nazwa planu')}><Input testID="plan-name" value={planName()} placeholder={t('Mój plan')} maxLength={40} accessibilityLabel={t('Nazwa planu')} onChangeText={typePlanName} onEndEditing={() => setPlanName(planName())} /></Field>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <Btn nav title={t('Szablony')} small accessibilityHint={t('Otwiera listę szablonów.')} onPress={() => openTemplates(router)} />{/* 11.10.2026: z Planowania do szablonów (docs/22 problem 3) */}
        <Btn nav title={t('Wygeneruj szablony i plan')} small onPress={() => router.push('/generator')} style={{ maxWidth: '100%' }} />{/* 08.10.2026: generator (docs/24) */}
        {ownTemplates().length ? <Btn nav title={t('Plan z moich szablonów')} small onPress={() => router.push('/generator?mode=own')} /> : null}{/* 09.10.2026 (B) */}
      </View>
      {plansFull() ? <Muted style={{ ...font('footnote') }}>{t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })}</Muted> : null}
      {other.length ? <>
        <SectionTitle infoId="other-plans" info={t('Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem. Tapnij plan, by zmienić jego nazwę i dni.')}>{t('Inne plany')}</SectionTitle>
        {shown.map((p, pi) => { const n = savedChanges(p.id); return <SwipeRow key={p.id} testID={`plan-saved-${pi}`} /* E2E 26 */ label={t('Usuń plan: {name}', { name: nameOr(p.name) })} title={t('Usunąć ten plan?')} message={nameOr(p.name)} onDelete={() => deletePlan(p.id)}>
          {a11y => <Item a11y={a11y} title={nameOr(p.name)} sub={planSummary(p.days) + (n ? ` · ${t('zmiany dni: {n}', { n })}` : '')} onPress={() => router.push(`/plan?id=${p.id}`)} right={<PlanToggle name={nameOr(p.name)} active={false} onPress={() => activate(p.id, p.name)} />} />}
        </SwipeRow>; })}
        {!all && other.length > OTHER_FIRST ? <Btn small kind="ghost" title={t('Pokaż wszystkie ({n})', { n: other.length })} onPress={() => setAll(true)} style={{ alignSelf: 'flex-start' }} /> : null}
      </> : null}
      <SectionTitle infoId="plan-days" info={t('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w zakładce Plan.')}>{t('Dni tygodnia')}</SectionTitle>
      <DayRows days={days} onSet={setDay} target={assignTarget.week} />
    </ScrollView></Screen>
  );
}
