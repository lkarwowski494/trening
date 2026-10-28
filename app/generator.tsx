import { MedicalNote } from '@/components/MedicalNote';
import React, { useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { OwnPlan, usePlanReturn, useActivatedReturn } from '@/components/OwnPlan';
import { DayPicker, daysOk } from '@/components/DayPicker';
import { Screen, Field, Chip, Muted, Txt, H2, Btn, SectionTitle, SwitchRow, Segmented } from '@/components/ui';
import { InfoTip } from '@/components/InfoTip';
import { getState, useTick, exById, fmtSec, visibleLocations } from '@/lib/store';
import {
  generate, genProposal, weeklySetsList, saveGenerated, replaceable, previewWarnings, genFolder, goalLabel, GOALS, GEN_SESSIONS, GEN_MINUTES, WARMUP_MIN, SET_WORK_SEC, SETS_PER_EX, MIN_SETS_PER_EX,
  MIN_EXERCISES, CUT_CARDIO_FROM, cardioCount, cardioSwitch, genCount, setsFor, REPS, REST, HEAVY_PCT, RIR, RIR_NEAR_FAILURE, MIN_DAYS, SECONDARY_SHARE, CARDIO_WEEK_MODERATE, CARDIO_WEEK_VIGOROUS,
  GENERAL_SETS_RANGE, GENERAL_LIFT_MAX, GENERAL_CARDIO_FROM, type GenInput,
} from '@/lib/generator';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { activationNote, plansFull, planName, hasActivePlan } from '@/lib/plan';
import { t, locale, exName, glue } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';
import { SAVED_PLANS_MAX } from '@/lib/store';
import { cancelButton } from '@/lib/confirm';
import { weekdayLabels } from '@/lib/calendar';
import { lacksSafety } from '@/lib/equipment';
import { font } from '@/lib/theme';

/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026, wariant A; docs/24). Na wyraźne polecenie: założenia → podgląd → zapis po
 * zatwierdzeniu (szablony w folderze „Wygenerowane”, plan obok innych, pytanie o aktywację, potwierdzenie zapisu). Opisy mówią, co wynika ze źródeł,
 * a co jest konwencją albo uproszczeniem (docs/research/22 sekcja 3). Audyt 0.10 (grupa C, B1): wszystkie liczby ze stałych lib/generator.ts,
 * siła bez obciążenia z ostrzeżeniem, braki partii i dni w tygodniu, „+ Dodaj miejsce”, zastąpienie nieużywanych, tekst aktywacji jak na ekranie Plan.
 */
const wd = (i: number) => weekdayLabels()[i];
const min = (sec: number) => fmtNum(sec / 60, 1);

/** Ekran generatora: dwa tryby (decyzja właściciela 09.10.2026, B) — „Nowe szablony i plan” (generator) i „Plan z moich szablonów” (components/OwnPlan);
 * `?mode=own` — od razu drugi tryb (wejścia z edytora planu i „Pierwszych kroków”). M3 ZM-03 (21.10.2026) usunął przełącznik; DEC-03 (c, 23.10.2026) przywraca go
 * przed 1.0 (docs/design/to-be.md ZM-03 pkt 5). Reszta ZM-03 zostaje: zapis bez okien, gdy nie ma aktywnego planu. */
export default function GeneratorScreen() {
  const p = useLocalSearchParams<{ mode?: string }>(); const [mode, setMode] = useState<'gen' | 'own'>(p.mode === 'own' ? 'own' : 'gen');
  const header = <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
    <Segmented label={t('Generator szablonów i planu')} value={mode} onChange={setMode} options={[['gen', t('Nowe szablony i plan')], ['own', t('Plan z moich szablonów')]]} />
  </View>;
  if (mode === 'own') return <Screen><Stack.Screen options={{ title: t('Plan z moich szablonów') }} /><OwnPlan header={header} /></Screen>;
  return <><Stack.Screen options={{ title: t('Generator szablonów i planu') }} /><NewTemplatesPlan header={header} /></>;
}

function NewTemplatesPlan({ header }: { header: React.ReactNode }) {
  const rev = useTick(); const router = useRouter(); const toPlan = usePlanReturn(); const afterActivated = useActivatedReturn(); const s = getState().settings;
  /* wybór dni (09.10.2026 B): na starcie zaznaczona propozycja generatora dla domyślnej liczby sesji (genProposal) */
  const [inp, setInp] = useState<GenInput>(() => { const i: GenInput = { goal: 'hypertrophy', locationId: s.mainLocationId && visibleLocations().some(l => l.id === s.mainLocationId) ? s.mainLocationId : null, sessions: 3, minutes: 60 }; return { ...i, days: genProposal(i) }; });
  /* zmiana celu, przy której liczba zaznaczonych dni wypada poza zakres (redukcja: od 3) — zaznaczenie = propozycja dla najbliższej dozwolonej liczby;
   * w zakresie — wybór użytkownika zostaje (miejsce i czas go nie zmieniają) */
  const set = (p: Partial<GenInput>) => setInp(x => { const n = { ...x, ...p }; const al = GEN_SESSIONS[n.goal]; const k = (n.days ?? []).length;
    if (p.goal && p.goal !== x.goal && !al.includes(k)) { n.sessions = al.find(v => v >= k) ?? al[al.length - 1]; n.days = genProposal(n); } return n; });
  const lim = GEN_SESSIONS[inp.goal]; const ok = daysOk(inp.days ?? [], lim[0], lim[lim.length - 1]);
  const genPlace = visibleLocations().find(l => l.id === inp.locationId) ?? null; const nLoc = visibleLocations().length; const r = useMemo(() => generate(inp), [inp, rev]); /* rev: miejsca i sprzęt zmienione po „+ Dodaj miejsce” */ const warn = previewWarnings(r, inp);
  const unloaded = warn.find(w => w.kind === 'unloaded');
  /* uwaga pod celem przy zbyt małej liczbie dni (decyzja właściciela 09.10.2026 B, docs/18): ostrzeżenie „oneday” (1 dzień siłowy) stoi pod celem,
   * a nie w podglądzie — jedno miejsce, bez powtórzenia; przy celu „Ogólny” ma tekst dla zdrowia (WHO/PAG, docs/research/30) */
  const dayNote = ok ? warn.find(w => w.kind === 'oneday') : undefined;
  /* redukcja przy 1–2 dniach (opcja A, docs/research/29 sekcja 3): bez sesji cardio w planie — cardio poza planem z zaleceniem WHO;
   * „Ogólny” przy 4–6 dniach: przełącznik „Dni cardio w planie” (domyślnie wyłączony) — dni powyżej GENERAL_LIFT_MAX to cardio */
  const nDays = genCount(inp); const cardioN = cardioCount(inp.goal, nDays, inp.cardio); const sets = setsFor(inp.goal); const general = inp.goal === 'general';
  const goalNote = inp.goal === 'strength' ? t('Siła: bój główny na początku, {s} × {a}–{b} powtórzeń (ciężko, ok. {p}% maksimum i więcej), pozostałe ćwiczenia {s} × {c}–{d}.', { s: SETS_PER_EX, a: REPS.heavy[0], b: REPS.heavy[1], p: HEAVY_PCT, c: REPS.strength[0], d: REPS.strength[1] })
    : inp.goal === 'hypertrophy' ? t('Masa: serie na partię w tygodniu do celu z Ustawień (automatycznie {m}), {a}–{b} powtórzeń (w domu {c}–{d}), zwykle {r1}–{r2} powtórzenia w zapasie.', { m: WEEKLY_SETS_MARK, a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1], r1: RIR[0], r2: RIR[1] })
      : general ? t('Ogólny (dla zdrowia i sprawności): {s} serie na ćwiczenie, {a}–{b} powtórzeń (w domu {c}–{d}), do chwili, gdy kolejne powtórzenie byłoby trudne. Dla zdrowia warto ćwiczyć wszystkie główne partie co najmniej {n} dni w tygodniu.', { s: sets, a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1], n: MIN_DAYS })
        : cardioN ? t('Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.')
          : t('Redukcja: trening jak na masę (chroni mięśnie); sesja cardio w planie od {k} dni w tygodniu.', { k: CUT_CARDIO_FROM });
  /* potwierdzenie zapisu: co i gdzie (UX-10) */
  const done = (activate: boolean, replace: boolean) => {
    const hadActive = hasActivePlan(); const res = saveGenerated(r, inp, activate, replace);
    if (activate && !hadActive) { afterActivated(res.planName); return; } /* ZM-03: pierwszy plan — aktywny bez pytania, Planowanie ze zdaniem potwierdzenia, bez okna „Zapisano” */
    const names = res.templateIds.map(id => getState().templates.find(x => x.id === id)?.name ?? '').join(', ');
    Alert.alert(t('Zapisano'), [t('Szablony: {list} — w folderze „{folder}” na liście Szablony.', { list: names, folder: res.folder }), activate ? t('Plan „{name}” jest teraz aktywny.', { name: res.planName }) : t('Plan „{name}” jest w „Inne plany”.', { name: res.planName })].join('\n'), [
      { text: t('Pokaż szablony'), onPress: () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/templates'); } },
      { text: t('Planowanie'), onPress: toPlan }, /* UI2-06: z Planu tygodnia — powrót do niego, bez drugiego ekranu planu */
      { text: t('OK') }, /* UI2-06: zostaje na generatorze */
    ]);
  };
  /* B1: ten sam tekst co na ekranie Plan (lib/plan.ts activationNote) — zmiany dni od dziś zapisują się z obecnym planem */
  const ask = (replace: boolean) => {
    if (!hasActivePlan()) { done(true, replace); return; } /* ZM-03: nie ma aktywnego planu do zastąpienia — bez pytania */
    Alert.alert(t('Ustawić nowy plan jako aktywny?'), [t('Szablony trafią do folderu „{folder}”, a plan — do „Inne plany” albo od razu jako aktywny.', { folder: genFolder() }), activationNote()].filter(Boolean).join('\n\n'), [
      { ...cancelButton() },
      { text: t('Tylko zapisz'), onPress: () => done(false, replace) },
      { text: t('Ustaw jako aktywny'), onPress: () => done(true, replace) },
    ]); };
  /* UX-10: ponowne generowanie — zastąpić poprzednio wygenerowane, nieużywane szablony (i plan zrobiony tylko z nich)? */
  const save = () => {
    if (plansFull()) { Alert.alert(t('Za dużo zapisanych planów'), t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })); return; } /* audyt 0.10 B3: limit jak w migrate */
    const old = replaceable(); if (!old.templateIds.length) { ask(false); return; }
    const st = getState(); const list = [...st.templates.filter(x => old.templateIds.includes(x.id)).map(x => x.name), ...(st.savedPlans ?? []).filter(p => old.planIds.includes(p.id)).map(p => p.name || t('Poprzedni plan'))].join(', ');
    /* UX2-08: aktywny plan z samych tych szablonów — okno mówi to wprost; „Zastąp” ustawia nowy plan w jego miejsce (bez pytania „Tylko zapisz”) */
    Alert.alert(t('Zastąpić poprzednio wygenerowane, nieużywane szablony?'), old.activePlan
      ? t('Bez treningów: {list}. To zastąpi też aktywny plan „{plan}”, zrobiony tylko z tych szablonów — „Zastąp” je usunie i ustawi nowy plan jako aktywny w jego miejsce, „Zostaw” doda nowe obok.', { list, plan: planName() || t('Mój plan') })
      : t('Bez treningów i poza aktywnym planem: {list}. „Zastąp” je usunie, „Zostaw” doda nowe obok.', { list }), [
      { ...cancelButton() }, { text: t('Zostaw'), onPress: () => ask(false) }, { text: t('Zastąp'), style: 'destructive', onPress: () => (old.activePlan ? done(true, true) : ask(true)) },
    ]);
  };
  const basis = [
    t('Każda główna partia co najmniej {n} dni w tygodniu — tyle zalecane jest dla zdrowia. Częstotliwość wpływa na siłę, ale więcej dni nie musi dawać proporcjonalnie więcej; przy tej samej liczbie serii różnice są małe. Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h}. Podział na sesje (całe ciało, góra/dół) możesz wybrać dowolnie — przy tej samej liczbie serii daje podobne efekty.', { n: MIN_DAYS, h: fmtNum(SECONDARY_SHARE, 1) }),
    general ? t('Serie: {s} na ćwiczenie — dla zdrowia zwykle {s}–{b}. Warto zrobić co najmniej {m}. Jedna seria już działa, {s}–{b} mogą działać lepiej; u początkujących i starszych jedna seria może wystarczyć. {s} to dolna granica.', { s: sets, b: GENERAL_SETS_RANGE[1], m: MIN_SETS_PER_EX }) /* A11B-2: źródła rozdzielone — „jedna seria” = PAG 2018 (c8) i ACSM 2011 (c4), ACSM 2026 = co najmniej 2 (docs/research/22 7g) */
      : t('Serie: {s} na ćwiczenie — warto zrobić co najmniej {m}; więcej serii zwykle daje trochę więcej, z malejącym zyskiem.', { s: SETS_PER_EX, m: MIN_SETS_PER_EX }),
    t('Liczba serii z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + średnia przerwa {r} s) = {n}; ćwiczeń = serie / {k} (co najmniej {e}). To szacunek.', { w: WARMUP_MIN, s: SET_WORK_SEC, r: r.avgRest, n: r.budget, k: sets, e: MIN_EXERCISES }),
    general ? t('Powtórzenia: {a}–{b}; w domu i bez obciążenia {c}–{d} — lżejszy ciężar, więcej powtórzeń.', { a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1] })
      : t('Zakresy powtórzeń (masa {a}–{b}, w domu i bez obciążenia {c}–{d}; przy sile dodatkowe {e}–{f}): mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku.', { a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1], e: REPS.strength[0], f: REPS.strength[1] }),
    general ? t('Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne — zmęczenie, ale nie wyczerpanie. Do upadku nie trzeba.')
      : t('Wysiłek: zwykle {a}–{b} powtórzenia w zapasie — blisko upadku albo {c}–{d}; dokładna liczba nie jest ustalona. Do upadku nie trzeba.', { a: RIR[0], b: RIR[1], c: RIR_NEAR_FAILURE[0], d: RIR_NEAR_FAILURE[1] }),
    general ? t('Przerwy: {b} min po wielostawowych, {c} min po jednostawowych i core; dokładna długość przerwy nie jest ustalona.', { b: min(REST.multi), c: min(REST.iso) })
      : t('Przerwy: {a} min po ciężkich seriach boju głównego, {b} min po innych wielostawowych, {c} min po jednostawowych i core; dokładna długość przerwy nie jest ustalona.', { a: min(REST.heavy), b: min(REST.multi), c: min(REST.iso) }),
    ...(inp.goal === 'cut' ? [cardioN ? t('Cardio: jedna sesja umiarkowanego wysiłku w osobny dzień; jej długość = czas sesji.')
      : t('Cardio: od {k} dni w tygodniu jedna sesja w osobny dzień; przy mniejszej liczbie dni wszystkie są siłowe, żeby cardio nie zabierało dni treningowi siłowemu (każda główna partia co najmniej {n} dni).', { k: CUT_CARDIO_FROM, n: MIN_DAYS })] : []),
    ...(general ? [t('Cardio: przy {k}–{m} dniach możesz zamienić dni powyżej {j} na sesje umiarkowanego cardio („Dni cardio w planie”, domyślnie wyłączone). Więcej ćwiczeń wzmacniających nie musi dawać więcej korzyści dla zdrowia, a ruch aerobowy warto rozłożyć na kilka dni. Długość sesji cardio = czas sesji.', { k: GENERAL_CARDIO_FROM, m: GEN_SESSIONS.general[GEN_SESSIONS.general.length - 1], j: GENERAL_LIFT_MAX })] : []),
    t('Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar. Stopniowe zwiększanie obciążenia to podstawa dalszych postępów.'),
  ];
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      {header}
      <InfoTip id="gen-intro" label={t('Propozycja do przejrzenia przed zapisem.')} info={t('Propozycja według Twoich założeń — przejrzysz ją przed zapisem.')} style={{ marginBottom: 8 }}>
        <Muted style={{ ...font('footnote') }}>{t('Propozycja do przejrzenia przed zapisem.')}</Muted>
      </InfoTip>
      {/* kolejność (decyzja właściciela 09.10.2026 B): najpierw dni, potem cel — każdy cel przy każdej liczbie dni, przy 1 dniu uwaga pod celem */}
      <DayPicker label={cardioN ? t('Dni treningowe w tygodniu (w tym {n} cardio)', { n: cardioN }) : t('Dni treningowe w tygodniu')} value={inp.days ?? []} min={lim[0]} max={lim[lim.length - 1]} onChange={days => set({ days })} />
      {/* cel: chipy z zawijaniem (4 cele nie mieszczą się w kontrolce segmentowej na 320 pt w każdym języku — tests/matrix-i18n) */}
      <Field label={t('Cel')} infoId="gen-goal" info={unloaded ? undefined : goalNote}><View testID="gen-goals" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {GOALS.map(g => <Chip key={g} label={goalLabel(g)} on={inp.goal === g} onPress={() => { if (inp.goal !== g) set({ goal: g }); }} />)}
      </View></Field>
      {unloaded ? <Txt style={{ ...font('footnote'), marginTop: -4, marginBottom: 8 }}>{unloaded.text}</Txt> : null}
      {dayNote ? <View testID="gen-day-note"><Txt style={{ ...font('footnote'), marginTop: -2, marginBottom: 8 }}>{dayNote.text}</Txt></View> : null}
      {cardioSwitch(inp.goal, nDays) ? <SwitchRow label={t('Dni cardio w planie')} detail={t('Dni powyżej {k} to sesje umiarkowanego cardio zamiast siłowych.', { k: GENERAL_LIFT_MAX })} value={!!inp.cardio} onChange={v => set({ cardio: v })} /> : null}
      <Field label={t('Miejsce')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {visibleLocations().map(l => <Chip key={l.id} label={l.name} on={inp.locationId === l.id} onPress={() => set({ locationId: l.id })} />)}
        <Chip label={t('Bez ograniczeń sprzętu')} on={inp.locationId === null} onPress={() => set({ locationId: null })} />
        <Chip nav label={t('+ Dodaj miejsce')} on={false} onPress={() => router.push('/more/locations')} />
      </View></Field>
      {inp.locationId === null ? (nLoc ? <Muted style={{ ...font('footnote'), marginTop: -4, marginBottom: 8 }}>{t('„Bez ograniczeń sprzętu” = pełna siłownia (sztanga, hantle, maszyny i wyciągi).')}</Muted>
        : <InfoTip id="gen-no-places" label={t('Bez miejsc plan zakłada pełną siłownię. W domu? „+ Dodaj miejsce”.')} info={t('Nie masz jeszcze miejsc treningu, więc plan zakłada pełną siłownię (sztanga, hantle, maszyny i wyciągi). Trenujesz w domu albo w hotelu? Stuknij „+ Dodaj miejsce” i zaznacz sprzęt — generator dobierze ćwiczenia.')} style={{ marginTop: -4, marginBottom: 8 }}>
          <Muted style={{ ...font('footnote') }}>{t('Bez miejsc plan zakłada pełną siłownię. W domu? „+ Dodaj miejsce”.')}</Muted>
        </InfoTip>) : null}
      <Field label={t('Czas sesji')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {GEN_MINUTES.map(n => <Chip key={n} label={t('{n} min', { n })} on={inp.minutes === n} onPress={() => set({ minutes: n })} />)}
      </View></Field>

      {ok ? <>{/* liczba dni spoza zakresu — bez podglądu i zapisu (komunikat pod wyborem dni, components/DayPicker) */}
      <SectionTitle>{t('Podgląd')}</SectionTitle>
      <Txt accessibilityRole="header" style={{ ...font('callout'), marginBottom: 6 }}>{r.days.map((ti, i) => (ti == null ? null : `${wd(i)} ${r.templates[ti].name}`)).filter(Boolean).join(', ') /* M1-audytor-generalny-029: lista dni — przecinek (wz. 28) */}</Txt>
      {r.templates.map(tp => (
        <View key={tp.key} testID={`gen-${tp.key}`} style={{ marginBottom: 10 }}>
          <H2 style={{ marginBottom: 4 }}>{tp.name}</H2>
          {tp.items.length ? tp.items.map(it => { const e = exById(it.exerciseId); const noSafe = !!e && lacksSafety(e, genPlace); return (
            <Muted key={it.exerciseId} style={{ ...font('footnote') }}>{glue(it.targetSec ? t('{ex} — {n} min, umiarkowane tempo', { ex: exName(e), n: Math.round(Number(it.targetSec) / 60) }) : t('{ex} — {s} × {a}–{b}, przerwa {r}', { ex: exName(e), s: it.sets, a: it.repMin ?? '', b: it.repMax ?? '', r: fmtSec(it.restSec) })) /* A11-19: „8–12” bez złamania */}{noSafe ? ' · ' + t('bez asekuracji w stojakach') : ''}</Muted>); }) /* audyt M1-015: miejsce bez ramion asekuracyjnych */
            : <Muted style={{ ...font('footnote') }}>{t('Brak ćwiczeń dostępnych w tym miejscu.')}</Muted>}
        </View>))}
      <Muted style={{ ...font('footnote') }}>{t('Serie na partię w tygodniu (pomocnicza = {h} serii): {list}', { h: fmtNum(SECONDARY_SHARE, 1), list: weeklySetsList(r, inp.goal === 'hypertrophy' || inp.goal === 'cut') })}</Muted>
      {warn.filter(w => w.kind !== 'unloaded' && w.kind !== 'oneday' /* pod celem */).map(w => <Txt key={w.kind} style={{ ...font('footnote'), marginTop: 6 }}>{w.text}</Txt>)}
      {inp.goal === 'cut' && !cardioN ? <InfoTip id="gen-cardio-out" label={t('Cardio poza planem: przy tej liczbie dni wszystkie sesje są siłowe.')} info={t('Cardio poza planem: sesja cardio jest w planie od {k} dni w tygodniu, przy mniejszej liczbie wszystkie dni są siłowe. Dla zdrowia warto mieć co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.', { k: CUT_CARDIO_FROM, a: CARDIO_WEEK_MODERATE[0], b: CARDIO_WEEK_MODERATE[1], c: CARDIO_WEEK_VIGOROUS[0], d: CARDIO_WEEK_VIGOROUS[1] })} style={{ marginTop: 6 }}>
        <Muted style={{ ...font('footnote') }}>{t('Cardio poza planem: przy tej liczbie dni wszystkie sesje są siłowe.')}</Muted>
      </InfoTip> : null}
      {(inp.goal === 'cut' && cardioN) || general ? <InfoTip id="gen-cardio-in" label={t('Cardio w planie: {n} min tygodniowo.', { n: r.cardioMin })} info={t('Cardio w planie: {n} min tygodniowo. Dla zdrowia warto mieć co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.', { n: r.cardioMin, a: CARDIO_WEEK_MODERATE[0], b: CARDIO_WEEK_MODERATE[1], c: CARDIO_WEEK_VIGOROUS[0], d: CARDIO_WEEK_VIGOROUS[1] })} style={{ marginTop: 6 }}>
        <Muted style={{ ...font('footnote') }}>{t('Cardio w planie: {n} min tygodniowo.', { n: r.cardioMin })}</Muted>
      </InfoTip> : null}</> : null}

      <SectionTitle infoId="gen-basis" info={basis.map(x => `• ${x}`)}>{t('Zasady planu')}</SectionTitle>
      <MedicalNote style={{ marginTop: 6 }} /* L1 (audyt 0.10, MER-11 A): plan z cardio — bez porad medycznych, odesłanie do specjalisty */ />
      {ok && r.templates.some(tp => tp.items.length) ? <Btn title={t('Zapisz szablony i plan')} kind="primary" block onPress={save} style={{ marginTop: 14 }} /> : null}
    </ScrollView></Screen>
  );
}
