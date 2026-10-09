import React, { useMemo, useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Field, Chip, Muted, Txt, Btn, SectionTitle } from '@/components/ui';
import { DayPicker, daysOk } from '@/components/DayPicker';
import { getState, useTick, newTemplate, SAVED_PLANS_MAX } from '@/lib/store';
import { ownTemplates, ownSessionsFor, ownPlan, ownProposal, ownWarnings, ownCounts, saveOwnPlan, OWN_MAX, MAJOR, MIN_DAYS, SECONDARY_SHARE } from '@/lib/generator';
import { activationNote, plansFull } from '@/lib/plan';
import { t, locale } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';

/*
 * „Plan z moich szablonów” (decyzja właściciela 09.10.2026, wariant B — wyjątek od zamrożenia; docs/18 ok. 14:55): wybór własnych szablonów
 * (niezarchiwizowanych, z ćwiczeniami) i dni tygodnia (components/DayPicker) → rozkład na tydzień według reguł generatora (lib/generator.ts ownPlan: te same dni, przerwy
 * i ostrzeżenia) → podgląd → zapis po zatwierdzeniu jako nowy plan albo od razu aktywny (to samo pytanie i ten sam tekst co generator — activationNote).
 * Szablony zostają bez zmian (zasada 03.10.2026). Wejścia: generator („Plan z moich szablonów”), edytor planu, „Pierwsze kroki”.
 */
const wd = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' }); /* 1.01.2024 = poniedziałek */
const nameOf = (id: string) => getState().templates.find(x => x.id === id)?.name ?? '';

/** UI2-06 (audyt kontrolny 1): „Plan tygodnia” w oknie „Zapisano” (generator i „Plan z moich szablonów”). Gdy pod generatorem jest ekran aktywnego
 * planu (/plan bez ?id) — powrót do niego (bez drugiego ekranu planu na stosie); inaczej generator zastępuje ekran planu. */
export function usePlanReturn() {
  const router = useRouter(); const nav = useNavigation();
  return () => {
    const st = nav.getState(); const prev = st && st.index > 0 ? st.routes[st.index - 1] : undefined;
    if (prev?.name === 'plan' && !(prev.params as { id?: string } | undefined)?.id) router.back(); else router.replace('/plan');
  };
}

export function OwnPlan({ header }: { header?: React.ReactNode }) {
  const rev = useTick(); const router = useRouter(); const toPlan = usePlanReturn(); const all = ownTemplates();
  const [sel, setSel] = useState<string[]>(() => (all.length <= OWN_MAX ? all.map(x => x.id) : []));
  /* wybór dni (09.10.2026 B): na starcie propozycja rozkładu dla 3 dni (albo najbliższej dozwolonej liczby — ownProposal) */
  const [days, setDays] = useState<number[]>(() => ownProposal({ templateIds: sel, sessions: 3 }));
  const known = (ids: string[]) => ids.filter(id => all.some(x => x.id === id));
  const chosen = known(sel); const allowed = ownSessionsFor(Math.max(1, chosen.length)); const min = allowed[0] ?? OWN_MAX;
  const ok = daysOk(days, min, OWN_MAX);
  const r = useMemo(() => (ok ? ownPlan({ templateIds: chosen, sessions: days.length, days }) : null), [chosen.join(','), days.join(','), ok, rev]); // eslint-disable-line react-hooks/exhaustive-deps
  /* zmiana szablonów, przy której zaznaczonych dni jest mniej niż szablonów — zaznaczenie = propozycja dla najbliższej dozwolonej liczby (jak zmiana celu w generatorze) */
  const toggle = (id: string) => { const next = sel.includes(id) ? sel.filter(x => x !== id) : sel.length >= OWN_MAX ? sel : [...sel, id]; setSel(next);
    const k = known(next).length; if (k && days.length < k) setDays(ownProposal({ templateIds: next, sessions: days.length })); };
  const done = (activate: boolean) => {
    if (!r) return; const res = saveOwnPlan(r, activate);
    Alert.alert(t('Zapisano'), activate ? t('Plan „{name}” jest teraz aktywny.', { name: res.planName }) : t('Plan „{name}” jest w „Inne plany”.', { name: res.planName }), [
      { text: t('Plan tygodnia'), onPress: toPlan }, { text: t('OK') }, /* UI2-06: „OK” — zostaje tutaj */
    ]);
  };
  const save = () => {
    if (!r) return;
    if (plansFull()) { Alert.alert(t('Za dużo zapisanych planów'), t('W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy.', { n: SAVED_PLANS_MAX })); return; }
    /* to samo pytanie co generator: zmiany pojedynczych dni od dziś zostają z obecnym planem w „Inne plany” (activatePlan, audyt 0.10 B1) */
    Alert.alert(t('Ustawić nowy plan jako aktywny?'), [t('Szablony zostają bez zmian. Plan trafi do „Inne plany” albo od razu jako aktywny.'), activationNote()].filter(Boolean).join('\n\n'), [
      { text: t('Anuluj'), style: 'cancel' },
      { text: t('Tylko zapisz'), onPress: () => done(false) },
      { text: t('Ustaw jako aktywny'), onPress: () => done(true) },
    ]);
  };
  const warn = r ? ownWarnings(r) : [];
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      {header}
      <Muted style={{ fontSize: 13, marginBottom: 8 }}>{t('Plan tygodnia z Twoich szablonów według tych samych reguł co generator — przejrzysz go przed zapisem. Szablony zostają bez zmian.')}</Muted>
      {!all.length ? <View style={{ gap: 8 }}>
        <Txt style={{ fontSize: 14 }}>{t('Nie masz szablonów z ćwiczeniami. Utwórz szablon albo wybierz „Nowe szablony i plan”.')}</Txt>
        <Btn nav small title={t('+ Nowy szablon')} onPress={() => { const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1`); }} style={{ alignSelf: 'flex-start' }} />
      </View> : <>
        <Field label={t('Szablony')}><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {all.map(x => <Chip key={x.id} toggle label={x.name} a11yLabel={t('Szablon w planie: {name}', { name: x.name })} on={chosen.includes(x.id)} onPress={() => toggle(x.id)} />)}
        </View></Field>
        {all.length > OWN_MAX ? <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{t('Najwyżej {n} szablonów — każdy dostaje co najmniej jeden dzień.', { n: OWN_MAX })}</Muted> : null}
        <DayPicker label={t('Dni treningowe w tygodniu')} value={days} min={min} max={OWN_MAX} onChange={setDays} />
        {chosen.length > 1 ? <Muted style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>{t('Dni co najmniej tyle, ile wybranych szablonów.')}</Muted> : null}

        {r || !chosen.length ? <SectionTitle>{t('Podgląd')}</SectionTitle> : null}
        {!chosen.length ? <Muted style={{ fontSize: 13 }}>{t('Wybierz co najmniej jeden szablon.')}</Muted> : !r ? null /* liczba dni spoza zakresu — komunikat pod wyborem dni */ : <>
          <Txt accessibilityRole="header" style={{ fontSize: 15, marginBottom: 6 }}>{r.days.map((id, i) => (id ? `${wd(i)} ${nameOf(id)}` : null)).filter(Boolean).join(' · ')}</Txt>
          {r.seq.length > chosen.length ? <Muted style={{ fontSize: 13, marginBottom: 6 }}>{t('Dni: {n}, szablony: {k} — szablony powtarzają się po kolei: {seq}. Co tydzień od początku.', { n: r.sessions, k: chosen.length, seq: r.seq.map(nameOf).join(' → ') })}</Muted> : null}
          {ownCounts(r).map(c => <Muted key={c.id} style={{ fontSize: 13 }}>{t('{name}: {n}× w tygodniu', { name: nameOf(c.id), n: c.n })}</Muted>)}
          <Muted style={{ fontSize: 13, marginTop: 6 }}>{t('Serie na partię w tygodniu (pomocnicza = {h} serii — uproszczenie, jedno źródło): {list}', { h: fmtNum(SECONDARY_SHARE, 1), list: MAJOR.map(m => `${t(m)} ${fmtNum(r.weeklySets[m] ?? 0, 1)}`).join(', ') })}</Muted>
          {warn.map(w => <Txt key={w.kind} style={{ fontSize: 13, marginTop: 6 }}>{w.text}</Txt>)}
          <SectionTitle>{t('Na czym to oparte')}</SectionTitle>
          {[t('Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM).') /* ten sam tekst co lista przesunięć w Kalendarzu (docs/research/23) */,
            t('Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: siła rośnie przy co najmniej {n} sesjach tygodniowo). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h} — uproszczenie (jedno źródło). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.', { n: MIN_DAYS, h: fmtNum(SECONDARY_SHARE, 1) }) /* ten sam tekst co generator (R1) */,
            t('Więcej dni niż szablonów: szablony po kolei (A, B, A…), jak w generatorze — konwencja.'),
          ].map(x => <Muted key={x} style={{ fontSize: 12, marginBottom: 4 }}>{`• ${x}`}</Muted>)}
          <Btn title={t('Zapisz plan')} kind="primary" block onPress={save} style={{ marginTop: 14 }} />
        </>}
      </>}
    </ScrollView>
  );
}
