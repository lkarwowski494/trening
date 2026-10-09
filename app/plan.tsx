import React, { useRef, useState } from 'react';
import { ScrollView, View, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Screen, Chip, Muted, Txt, Btn, Item, Field, Input, SectionTitle } from '@/components/ui';
import { SwipeRow } from '@/components/SwipeRow';
import { getState, useTick, templateGroups, newTemplate, SAVED_PLANS_MAX } from '@/lib/store';
import { ownTemplates } from '@/lib/generator';
import { useTheme, F } from '@/lib/theme';
import { weekPlanDays, setWeekDay, planName, setPlanName, typePlanName, savedPlans, newPlan, setSavedDay, typeSavedName, renamePlan, activatePlan, deletePlan, plansFull, activationNote, savedChanges, hasPlan, assignTarget, type PlanDays } from '@/lib/plan';
import { askReminderPermission } from '@/lib/planReminder';
import { t, locale, lang } from '@/lib/i18n';

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
const weekdayName = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'long' }); /* 1.01.2024 = poniedziałek */
const weekdayShort = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' });
const tplName = (id: string | null) => (id ? getState().templates.find(x => x.id === id && !x.archived)?.name ?? '' : '');
/** „pon. Upper A · śr. Upper B” — dni z treningiem. */
export const planSummary = (days: PlanDays) => days.map((id, i) => (tplName(id) ? `${weekdayShort(i)} ${tplName(id)}` : '')).filter(Boolean).join(' · ') || t('bez treningów');
const nameOr = (n: string) => n || t('Poprzedni plan');
/** Ile zapisanych planów widać od razu (reszta po „Pokaż wszystkie”). */
const OTHER_FIRST = 3;

/** 7 wierszy dni (UX-15 A): wiersz pokazuje dzień i szablon, tapnięcie rozwija wybór (szablony bez folderu, potem foldery). */
function DayRows({ days, onSet, target }: { days: PlanDays; onSet: (i: number, id: string | null) => void; target: (i: number) => string }) {
  const th = useTheme(); const router = useRouter(); const [open, setOpen] = useState<number | null>(null); const groups = templateGroups();
  /* docs/18 09.10.2026 (B): „+ Nowy szablon” — edycja nowego szablonu; po „Zapisz” trafia na ten dzień tego planu (lib/plan assignNewTemplate) */
  const create = (i: number) => { setOpen(null); const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1&assign=${encodeURIComponent(target(i))}`); };
  return <>{days.map((id, i) => { const nm = tplName(id) || t('Wolne'); const isOpen = open === i; return (
    <View key={i} testID={`plan-day-${i}`} style={{ borderBottomWidth: 1, borderBottomColor: th.line }}>
      <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={`${weekdayName(i)}, ${nm}`} accessibilityHint={t('Wybierz szablon na ten dzień.')} accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(isOpen ? null : i)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, gap: 8, opacity: pressed ? 0.6 : 1 })}>
        <Txt style={{ fontFamily: F.semibold }}>{weekdayName(i)}</Txt>
        <Txt style={{ flexShrink: 1, textAlign: 'right', color: tplName(id) ? th.text : th.muted }}>{`${nm} ${isOpen ? '▾' : '›'}`}</Txt>
      </Pressable>
      {isOpen ? <View style={{ paddingBottom: 10, gap: 6 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}><Chip label={t('Wolne')} on={!tplName(id)} a11yLabel={`${weekdayName(i)}: ${t('Wolne')}`} onPress={() => { onSet(i, null); setOpen(null); }} /></View>
        {groups.map(g => <View key={g.folder ?? ''} style={{ gap: 4 }}>
          {g.folder ? <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{g.folder}</Muted> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{g.items.map(x => <Chip key={x.id} label={x.name} on={x.id === id} a11yLabel={`${weekdayName(i)}: ${x.name}`} onPress={() => { onSet(i, x.id); setOpen(null); }} />)}</View>
        </View>)}
        {!groups.length ? <Muted style={{ fontSize: 13 }}>{t('Nie masz jeszcze szablonów.')}</Muted> : null}
        <Btn nav small kind="ghost" title={t('+ Nowy szablon')} accessibilityLabel={`${weekdayName(i)}: ${t('+ Nowy szablon')}`} accessibilityHint={t('Po zapisie szablon trafi na ten dzień.')} onPress={() => create(i)} style={{ alignSelf: 'flex-start' }} />
      </View> : null}
    </View>); })}</>;
}

export default function PlanScreen() {
  useTick(); const router = useRouter(); const { id } = useLocalSearchParams<{ id?: string }>();
  const saved = id ? savedPlans().find(p => p.id === id) : undefined; const initial = useRef(saved?.name ?? '');
  const activate = (pid: string, name: string, after?: () => void) => {
    Alert.alert(t('Ustawić „{name}” jako aktywny plan?', { name: nameOr(name) }), activationNote(pid) || undefined, [
      { text: t('Anuluj'), style: 'cancel' }, { text: t('Ustaw'), onPress: () => { activatePlan(pid); after?.(); } },
    ]); };
  if (id && !saved) return <Screen><Muted style={{ marginTop: 12 }}>{t('Nie ma takiego planu.')}</Muted></Screen>;
  if (saved) return ( /* B2 A: zapisany plan edytowany przed aktywacją */
    <Screen><Stack.Screen options={{ title: saved.name || t('Inny plan') }} />{/* UI2-08: nie „Plan tygodnia” — to nie aktywny plan */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”.')}</Muted>
      <Field label={t('Nazwa planu')}><Input value={saved.name} maxLength={40} accessibilityLabel={t('Nazwa planu')} onChangeText={v => typeSavedName(saved.id, v)} onEndEditing={() => { renamePlan(saved.id, savedPlans().find(p => p.id === saved.id)?.name ?? '', initial.current); initial.current = savedPlans().find(p => p.id === saved.id)?.name ?? initial.current; }} /></Field>
      {savedChanges(saved.id) ? <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Zmiany pojedynczych dni zapisane z tym planem: {n} — wrócą po aktywacji.', { n: savedChanges(saved.id) })}</Muted> : null}
      <Btn title={t('Ustaw jako aktywny')} kind="primary" small accessibilityLabel={t('Ustaw jako aktywny: {name}', { name: nameOr(saved.name) })} onPress={() => activate(saved.id, saved.name, () => { if (router.canGoBack()) router.back(); else router.replace('/plan'); })} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />
      <SectionTitle>{t('Dni tygodnia')}</SectionTitle>
      <DayRows days={saved.days} onSet={(i, x) => setSavedDay(saved.id, i, x)} target={i => assignTarget.saved(saved.id, i)} />
    </ScrollView></Screen>);
  return <ActivePlan activate={activate} />;
}

function ActivePlan({ activate }: { activate: (id: string, name: string) => void }) {
  const router = useRouter(); const days = weekPlanDays(); const other = savedPlans(); const [all, setAll] = useState(false); const shown = all ? other : other.slice(0, OTHER_FIRST);
  const setDay = (i: number, x: string | null) => { const had = hasPlan(); setWeekDay(i, x); if (!had && hasPlan()) askReminderPermission().catch(() => {}); };
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <Field label={t('Nazwa planu')}><Input value={planName()} placeholder={t('Mój plan')} maxLength={40} accessibilityLabel={t('Nazwa planu')} onChangeText={typePlanName} onEndEditing={() => setPlanName(planName())} /></Field>
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')}</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        {!plansFull() ? <Btn title={t('+ Nowy plan')} small accessibilityHint={t('Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny.')} onPress={() => { const nid = newPlan(); if (nid) router.push(`/plan?id=${nid}`); }} /> : null}
        <Btn nav title={t('Wygeneruj szablony i plan')} small onPress={() => router.push('/generator')} />{/* 08.10.2026: generator (docs/24) */}
        {ownTemplates().length ? <Btn nav title={t('Plan z moich szablonów')} small onPress={() => router.push('/generator?mode=own')} /> : null}{/* 09.10.2026 (B) */}
      </View>
      {plansFull() ? <Muted style={{ fontSize: 13 }}>{t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })}</Muted> : null}
      {other.length ? <>
        <SectionTitle>{t('Inne plany')}</SectionTitle>
        <Muted style={{ fontSize: 13, marginBottom: 6 }}>{t('Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem. Tapnij plan, by zmienić jego nazwę i dni.')}</Muted>
        {shown.map(p => { const n = savedChanges(p.id); return <SwipeRow key={p.id} label={t('Usuń plan: {name}', { name: nameOr(p.name) })} title={t('Usunąć ten plan?')} message={nameOr(p.name)} onDelete={() => deletePlan(p.id)}>
          {a11y => <Item a11y={a11y} title={nameOr(p.name)} sub={planSummary(p.days) + (n ? ` · ${t('zmiany dni: {n}', { n })}` : '')} onPress={() => router.push(`/plan?id=${p.id}`)} right={<Btn small title={t('Ustaw jako aktywny')} accessibilityLabel={t('Ustaw jako aktywny: {name}', { name: nameOr(p.name) })} onPress={() => activate(p.id, p.name)} />} />}
        </SwipeRow>; })}
        {!all && other.length > OTHER_FIRST ? <Btn small kind="ghost" title={t('Pokaż wszystkie ({n})', { n: other.length })} onPress={() => setAll(true)} style={{ alignSelf: 'flex-start' }} /> : null}
      </> : null}
      <SectionTitle>{t('Dni tygodnia')}</SectionTitle>
      <DayRows days={days} onSet={setDay} target={assignTarget.week} />
    </ScrollView></Screen>
  );
}
