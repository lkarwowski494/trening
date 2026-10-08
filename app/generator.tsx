import React, { useMemo, useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Field, Chip, Segmented, Muted, Txt, H2, Btn, SectionTitle } from '@/components/ui';
import { getState, useTick, exById, fmtDur } from '@/lib/store';
import { generate, saveGenerated, GEN_SESSIONS, GEN_MINUTES, MAJOR, WARMUP_MIN, SET_WORK_SEC, type Goal, type GenInput } from '@/lib/generator';
import { t, locale, exName } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';
import { plansFull } from '@/lib/plan';
import { SAVED_PLANS_MAX } from '@/lib/store';

/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026, wariant A; docs/24). Na wyraźne polecenie: założenia → podgląd → zapis po
 * zatwierdzeniu (szablony w folderze „Wygenerowane”, plan obok innych, pytanie o aktywację). Opisy mówią, co wynika ze źródeł, a co jest
 * konwencją albo uproszczeniem (docs/research/22 sekcja 3).
 */
const wd = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' });

export default function GeneratorScreen() {
  useTick(); const router = useRouter(); const s = getState().settings;
  const [inp, setInp] = useState<GenInput>(() => ({ goal: 'hypertrophy', locationId: s.mainLocationId && s.locations.some(l => l.id === s.mainLocationId) ? s.mainLocationId : null, sessions: 3, minutes: 60 }));
  const set = (p: Partial<GenInput>) => setInp(x => { const n = { ...x, ...p }; if (!GEN_SESSIONS[n.goal].includes(n.sessions)) n.sessions = GEN_SESSIONS[n.goal][0]; return n; });
  const r = useMemo(() => generate(inp), [inp]);
  const goalNote = inp.goal === 'strength' ? t('Siła: bój główny na początku, 3 serie po 4–6 powtórzeń (ciężko, ok. 80% maksimum i więcej), pozostałe ćwiczenia 6–10.')
    : inp.goal === 'hypertrophy' ? t('Masa: co najmniej 10 serii na partię w tygodniu, 8–12 powtórzeń (w domu 12–20), zwykle 1–3 powtórzenia w zapasie.')
      : t('Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio.');
  const save = () => plansFull() ? Alert.alert(t('Za dużo zapisanych planów'), t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })) /* audyt 0.10 B3: limit jak w migrate */ : Alert.alert(t('Ustawić nowy plan jako aktywny?'), t('Szablony trafią do folderu „Wygenerowane”. Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.'), [
    { text: t('Anuluj'), style: 'cancel' },
    { text: t('Tylko zapisz'), onPress: () => { saveGenerated(r, inp, false); router.replace('/plan'); } },
    { text: t('Ustaw jako aktywny'), onPress: () => { saveGenerated(r, inp, true); router.replace('/plan'); } },
  ]);
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań; części oznaczone jako konwencja albo uproszczenie nie wynikają z badań.')}</Muted>
      <Field label={t('Cel')}><Segmented label={t('Cel')} options={[['strength', t('Siła')], ['hypertrophy', t('Masa')], ['cut', t('Redukcja')]] as [Goal, string][]} value={inp.goal} onChange={g => set({ goal: g })} /></Field>
      <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{goalNote}</Muted>
      <Field label={t('Miejsce')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {s.locations.map(l => <Chip key={l.id} label={l.name} on={inp.locationId === l.id} onPress={() => set({ locationId: l.id })} />)}
        <Chip label={t('Bez ograniczeń sprzętu')} on={inp.locationId === null} onPress={() => set({ locationId: null })} />
      </View></Field>
      <Field label={inp.goal === 'cut' ? t('Sesje w tygodniu (w tym 1 cardio)') : t('Sesje w tygodniu')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
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
      <Muted style={{ fontSize: 13 }}>{t('Serie na partię w tygodniu: {list}', { list: MAJOR.map(m => `${t(m)} ${fmtNum(r.weeklySets[m] ?? 0, 1)}`).join(', ') })}</Muted>
      {r.below10.length ? <Txt style={{ fontSize: 13, marginTop: 6 }}>{t('Poniżej 10 serii tygodniowo: {list}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu.', { list: r.below10.map(m => t(m)).join(', ') })}</Txt> : null}
      {r.backToBack.length ? <Txt style={{ fontSize: 13, marginTop: 6 }}>{t('Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku.', { list: r.backToBack.map(([a, b]) => `${wd(a)}–${wd(b)}`).join(', ') })}</Txt> : null}
      {inp.goal === 'cut' ? <Muted style={{ fontSize: 13, marginTop: 6 }}>{t('Cardio w planie: {n} min tygodniowo. Ruch w ciągu dnia też się liczy — razem zwykle 150–300 min tygodniowo (WHO, ACSM).', { n: r.cardioMin })}</Muted> : null}

      <SectionTitle>{t('Na czym to oparte')}</SectionTitle>
      {[t('Każda partia co najmniej 2 razy w tygodniu (ACSM, przeglądy badań). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.'),
        t('Liczba ćwiczeń z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + przerwa) — uproszczenie, nie wynik badań.', { w: WARMUP_MIN, s: SET_WORK_SEC }),
        t('Zakresy powtórzeń (masa 8–12, w domu 12–20; przy sile dodatkowe 6–10) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań).'),
        t('Wysiłek: zwykle 1–3 powtórzenia w zapasie; do upadku nie trzeba.'),
        t('Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja.')].map(x => <Muted key={x} style={{ fontSize: 12, marginBottom: 4 }}>{`• ${x}`}</Muted>)}
      <Btn title={t('Zapisz szablony i plan')} kind="primary" block onPress={save} style={{ marginTop: 14 }} />
    </ScrollView></Screen>
  );
}
