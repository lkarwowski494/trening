import { MedicalNote } from '@/components/MedicalNote';
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Field, Chip, Segmented, Muted, Txt, H2, Btn, SectionTitle } from '@/components/ui';
import { getState, useTick, exById, fmtDur } from '@/lib/store';
import {
  generate, saveGenerated, replaceable, previewWarnings, genFolder, GEN_SESSIONS, GEN_MINUTES, MAJOR, WARMUP_MIN, SET_WORK_SEC, SETS_PER_EX, ACSM_MIN_SETS,
  MIN_EXERCISES, CARDIO_SESSIONS, REPS, REST, HEAVY_PCT, RIR, RIR_ACSM, MIN_DAYS, SECONDARY_SHARE, WHO_MODERATE, WHO_VIGOROUS, type Goal, type GenInput,
} from '@/lib/generator';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { activationNote, plansFull } from '@/lib/plan';
import { t, locale, exName } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';
import { SAVED_PLANS_MAX } from '@/lib/store';

/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026, wariant A; docs/24). Na wyraźne polecenie: założenia → podgląd → zapis po
 * zatwierdzeniu (szablony w folderze „Wygenerowane”, plan obok innych, pytanie o aktywację, potwierdzenie zapisu). Opisy mówią, co wynika ze źródeł,
 * a co jest konwencją albo uproszczeniem (docs/research/22 sekcja 3). Audyt 0.10 (grupa C, B1): wszystkie liczby ze stałych lib/generator.ts,
 * siła bez obciążenia z ostrzeżeniem, braki partii i dni w tygodniu, „+ Dodaj miejsce”, zastąpienie nieużywanych, tekst aktywacji jak na ekranie Plan.
 */
const wd = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' });
const min = (sec: number) => fmtNum(sec / 60, 1);

export default function GeneratorScreen() {
  const rev = useTick(); const router = useRouter(); const s = getState().settings;
  const [inp, setInp] = useState<GenInput>(() => ({ goal: 'hypertrophy', locationId: s.mainLocationId && s.locations.some(l => l.id === s.mainLocationId) ? s.mainLocationId : null, sessions: 3, minutes: 60 }));
  const set = (p: Partial<GenInput>) => setInp(x => { const n = { ...x, ...p }; if (!GEN_SESSIONS[n.goal].includes(n.sessions)) n.sessions = GEN_SESSIONS[n.goal][0]; return n; });
  const nLoc = s.locations.length; const r = useMemo(() => generate(inp), [inp, rev]); /* rev: miejsca i sprzęt zmienione po „+ Dodaj miejsce” */ const warn = previewWarnings(r, inp);
  const unloaded = warn.find(w => w.kind === 'unloaded');
  const goalNote = inp.goal === 'strength' ? t('Siła: bój główny na początku, {s} × {a}–{b} powtórzeń (ciężko, ok. {p}% maksimum i więcej), pozostałe ćwiczenia {s} × {c}–{d}.', { s: SETS_PER_EX, a: REPS.heavy[0], b: REPS.heavy[1], p: HEAVY_PCT, c: REPS.strength[0], d: REPS.strength[1] })
    : inp.goal === 'hypertrophy' ? t('Masa: co najmniej {m} serii na partię w tygodniu, {a}–{b} powtórzeń (w domu {c}–{d}), zwykle {r1}–{r2} powtórzenia w zapasie.', { m: WEEKLY_SETS_MARK, a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1], r1: RIR[0], r2: RIR[1] })
      : t('Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.');
  /* potwierdzenie zapisu: co i gdzie (UX-10) */
  const done = (activate: boolean, replace: boolean) => {
    const res = saveGenerated(r, inp, activate, replace); const names = res.templateIds.map(id => getState().templates.find(x => x.id === id)?.name ?? '').join(', ');
    Alert.alert(t('Zapisano'), [t('Szablony: {list} — w folderze „{folder}” na liście Szablony.', { list: names, folder: res.folder }), activate ? t('Plan „{name}” jest teraz aktywny.', { name: res.planName }) : t('Plan „{name}” jest w „Inne plany”.', { name: res.planName })].join('\n'), [
      { text: t('Pokaż szablony'), onPress: () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/templates'); } },
      { text: t('Plan tygodnia'), onPress: () => router.replace('/plan') },
    ]);
  };
  /* B1: ten sam tekst co na ekranie Plan (lib/plan.ts activationNote) — zmiany dni od dziś zapisują się z obecnym planem */
  const ask = (replace: boolean) => {
    Alert.alert(t('Ustawić nowy plan jako aktywny?'), [t('Szablony trafią do folderu „{folder}”, a plan — do „Inne plany” albo od razu jako aktywny.', { folder: genFolder() }), activationNote()].filter(Boolean).join('\n\n'), [
      { text: t('Anuluj'), style: 'cancel' },
      { text: t('Tylko zapisz'), onPress: () => done(false, replace) },
      { text: t('Ustaw jako aktywny'), onPress: () => done(true, replace) },
    ]); };
  /* UX-10: ponowne generowanie — zastąpić poprzednio wygenerowane, nieużywane szablony (i plan zrobiony tylko z nich)? */
  const save = () => {
    if (plansFull()) { Alert.alert(t('Za dużo zapisanych planów'), t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })); return; } /* audyt 0.10 B3: limit jak w migrate */
    const old = replaceable(); if (!old.templateIds.length) { ask(false); return; }
    const st = getState(); const list = [...st.templates.filter(x => old.templateIds.includes(x.id)).map(x => x.name), ...(st.savedPlans ?? []).filter(p => old.planIds.includes(p.id)).map(p => p.name || t('Poprzedni plan'))].join(', ');
    Alert.alert(t('Zastąpić poprzednio wygenerowane, nieużywane szablony?'), t('Bez treningów i poza aktywnym planem: {list}. „Zastąp” je usunie, „Zostaw” doda nowe obok.', { list }), [
      { text: t('Anuluj'), style: 'cancel' }, { text: t('Zostaw'), onPress: () => ask(false) }, { text: t('Zastąp'), style: 'destructive', onPress: () => ask(true) },
    ]);
  };
  const basis = [
    t('Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: siła rośnie przy co najmniej {n} sesjach tygodniowo). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h} — uproszczenie (jedno źródło). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.', { n: MIN_DAYS, h: fmtNum(SECONDARY_SHARE, 1) }),
    t('Serie: {s} na ćwiczenie — ACSM 2026 zaleca co najmniej {m}; więcej serii zwykle daje trochę więcej, z malejącym zyskiem. Liczba {s} to uproszczenie.', { s: SETS_PER_EX, m: ACSM_MIN_SETS }),
    t('Liczba serii z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + średnia przerwa {r} s) = {n}; ćwiczeń = serie / {k} (co najmniej {e}) — uproszczenie, nie wynik badań.', { w: WARMUP_MIN, s: SET_WORK_SEC, r: r.avgRest, n: r.budget, k: SETS_PER_EX, e: MIN_EXERCISES }),
    t('Zakresy powtórzeń (masa {a}–{b}, w domu i bez obciążenia {c}–{d}; przy sile dodatkowe {e}–{f}) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań).', { a: REPS.gym[0], b: REPS.gym[1], c: REPS.home[0], d: REPS.home[1], e: REPS.strength[0], f: REPS.strength[1] }),
    t('Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (ACSM 2026: blisko upadku albo {c}–{d}; dokładnej liczby nie ustalono); do upadku nie trzeba.', { a: RIR[0], b: RIR[1], c: RIR_ACSM[0], d: RIR_ACSM[1] }),
    t('Przerwy: {a} min po ciężkich seriach boju głównego, {b} min po innych wielostawowych, {c} min po jednostawowych i core — uproszczenie; przeglądy są niejednoznaczne (ACSM 2026: długość przerwy nie zmieniała przyrostu siły).', { a: min(REST.heavy), b: min(REST.multi), c: min(REST.iso) }),
    ...(inp.goal === 'cut' ? [t('Cardio: jedna sesja umiarkowanego wysiłku w osobny dzień; jej długość = czas sesji — konwencja.')] : []),
    t('Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja.'),
  ];
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań; części oznaczone jako konwencja albo uproszczenie nie wynikają z badań.')}</Muted>
      <Field label={t('Cel')}><Segmented label={t('Cel')} options={[['strength', t('Siła')], ['hypertrophy', t('Masa')], ['cut', t('Redukcja')]] as [Goal, string][]} value={inp.goal} onChange={g => set({ goal: g })} /></Field>
      {unloaded ? <Txt style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{unloaded.text}</Txt> : <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{goalNote}</Muted>}
      <Field label={t('Miejsce')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {s.locations.map(l => <Chip key={l.id} label={l.name} on={inp.locationId === l.id} onPress={() => set({ locationId: l.id })} />)}
        <Chip label={t('Bez ograniczeń sprzętu')} on={inp.locationId === null} onPress={() => set({ locationId: null })} />
        <Chip label={t('+ Dodaj miejsce')} on={false} onPress={() => router.push('/more/locations')} />
      </View></Field>
      {inp.locationId === null ? <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{nLoc ? t('„Bez ograniczeń sprzętu” = pełna siłownia (sztanga, hantle, maszyny i wyciągi).') : t('Nie masz jeszcze miejsc treningu, więc plan zakłada pełną siłownię (sztanga, hantle, maszyny i wyciągi). Trenujesz w domu albo w hotelu? Stuknij „+ Dodaj miejsce” i zaznacz sprzęt — generator dobierze ćwiczenia.')}</Muted> : null}
      <Field label={inp.goal === 'cut' ? t('Sesje w tygodniu (w tym {n} cardio)', { n: CARDIO_SESSIONS }) : t('Sesje w tygodniu')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {GEN_SESSIONS[inp.goal].map(n => <Chip key={n} label={String(n)} a11yLabel={t('Sesje w tygodniu: {n}', { n })} on={inp.sessions === n} onPress={() => set({ sessions: n })} />)}
      </View></Field>
      <Field label={t('Czas sesji')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {GEN_MINUTES.map(n => <Chip key={n} label={t('{n} min', { n })} on={inp.minutes === n} onPress={() => set({ minutes: n })} />)}
      </View></Field>

      <SectionTitle>{t('Podgląd')}</SectionTitle>
      <Txt accessibilityRole="header" style={{ fontSize: 15, marginBottom: 6 }}>{r.days.map((ti, i) => (ti == null ? null : `${wd(i)} ${r.templates[ti].name}`)).filter(Boolean).join(' · ')}</Txt>
      {r.templates.map(tp => (
        <View key={tp.key} testID={`gen-${tp.key}`} style={{ marginBottom: 10 }}>
          <H2 style={{ marginBottom: 4 }}>{tp.name}</H2>
          {tp.items.length ? tp.items.map(it => { const e = exById(it.exerciseId); return (
            <Muted key={it.exerciseId} style={{ fontSize: 13 }}>{it.targetSec ? t('{ex} — {n} min, umiarkowane tempo', { ex: exName(e), n: Math.round(Number(it.targetSec) / 60) }) : t('{ex} — {s} × {a}–{b}, przerwa {r}', { ex: exName(e), s: it.sets, a: it.repMin ?? '', b: it.repMax ?? '', r: fmtDur(it.restSec) })}</Muted>); })
            : <Muted style={{ fontSize: 13 }}>{t('Brak ćwiczeń dostępnych w tym miejscu.')}</Muted>}
        </View>))}
      <Muted style={{ fontSize: 13 }}>{t('Serie na partię w tygodniu (pomocnicza = {h} serii — uproszczenie, jedno źródło): {list}', { h: fmtNum(SECONDARY_SHARE, 1), list: MAJOR.map(m => `${t(m)} ${fmtNum(r.weeklySets[m] ?? 0, 1)}`).join(', ') })}</Muted>
      {warn.filter(w => w.kind !== 'unloaded').map(w => <Txt key={w.kind} style={{ fontSize: 13, marginTop: 6 }}>{w.text}</Txt>)}
      {inp.goal === 'cut' ? <Muted style={{ fontSize: 13, marginTop: 6 }}>{t('Cardio w planie: {n} min tygodniowo. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.', { n: r.cardioMin, a: WHO_MODERATE[0], b: WHO_MODERATE[1], c: WHO_VIGOROUS[0], d: WHO_VIGOROUS[1] })}</Muted> : null}

      <SectionTitle>{t('Na czym to oparte')}</SectionTitle>
      {basis.map(x => <Muted key={x} style={{ fontSize: 12, marginBottom: 4 }}>{`• ${x}`}</Muted>)}
      <MedicalNote style={{ marginTop: 6 }} /* L1 (audyt 0.10, MER-11 A): plan z cardio — bez porad medycznych, odesłanie do specjalisty */ />
      {r.templates.some(tp => tp.items.length) ? <Btn title={t('Zapisz szablony i plan')} kind="primary" block onPress={save} style={{ marginTop: 14 }} /> : null}
    </ScrollView></Screen>
  );
}
