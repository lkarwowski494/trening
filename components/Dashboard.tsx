import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt, SectionTitle, useOnce } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX } from '@/lib/theme';
import { getState, useTick, newTemplate } from '@/lib/store';
import { weekTiles, lastWorkout, firstSteps, emptyTemplates } from '@/lib/dashboard';
import { WeekStacks } from '@/components/WeekStacks';
import { t, lang } from '@/lib/i18n';

/* Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A) — dane: lib/dashboard.ts. */
function Tile({ label, value, prev }: { label: string; value: string; prev: string }) {
  const th = useTheme();
  return (
    <View accessibilityLanguage={lang()} accessible accessibilityLabel={t('{label}: {v}, poprzedni tydzień {p}', { label, v: value, p: prev })} style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 20 }}>{value}</Txt>
      <Muted style={{ fontSize: 12 }}>{label}</Muted>
      <Muted style={{ fontSize: 11, marginTop: 2 }}>{t('poprz.: {v}', { v: prev })}</Muted>
    </View>);
}
const hm = (sec: number) => { const m = Math.round(sec / 60); return m >= 60 ? `${t('{n} h', { n: Math.floor(m / 60) })}${m % 60 ? ` ${t('{n} min', { n: m % 60 })}` : ''}` : t('{n} min', { n: m }); }; /* A11-17: jednostki przez t() */

/** Kafelki tygodnia (od pierwszego zakończonego treningu); przy planie postęp tygodnia (stosy talerzy). */
export function WeekStats() {
  useTick(); const router = useRouter(); const once = useOnce(); /* UI2-02 */ const w = weekTiles(); const last = lastWorkout(); if (!last) return null;
  return <>
    <SectionTitle>{t('Ten tydzień')}</SectionTitle>
    <Pressable testID="week-tiles" accessibilityRole="button" accessibilityLabel={([[t('Treningi'), String(w.workouts), String(w.prev.workouts)], [t('Serie'), String(w.sets), String(w.prev.sets)], [t('Czas'), hm(w.durationSec), hm(w.prev.durationSec)]] as const).map(([label, value, prev]) => t('{label}: {v}, poprzedni tydzień {p}', { label, v: value, p: prev })).join('; ')} accessibilityHint={t('Otwiera Postępy.')} onPress={once(() => router.push('/more/progress'))} style={({ pressed }: { pressed: boolean }) => ({ flexDirection: 'row', gap: 8, opacity: pressed ? 0.7 : 1 })} /* UX-16 A (audyt 0.10): te same definicje co Postępy */>
      <Tile label={t('Treningi')} value={String(w.workouts)} prev={String(w.prev.workouts)} />
      <Tile label={t('Serie')} value={String(w.sets)} prev={String(w.prev.sets)} />
      <Tile label={t('Czas')} value={hm(w.durationSec)} prev={hm(w.prev.durationSec)} />
    </Pressable>
    {w.planned ? <View style={{ marginTop: 10 }}><WeekStacks /></View> : null /* przy planie stosy talerzy i „60% planu tygodnia (3 z 5)” (korekta właściciela 09.10.2026 ok. 17:00; te same liczby, lib/motif.weekProgress) */}{/* audyt 0.10 A5/X-04: dni z planu zrobione zaplanowanym szablonem (ten sam stan dnia co kalendarz) — sesje i dni planu osobno */}
    {/* „Ostatni trening” usunięty z ekranu głównego (właściciel 09.10.2026 ok. 16:20): informacja zostaje w arkuszu „Inny trening” („Powtórz ostatni”: nazwa · data), w Historii i Kalendarzu */}
  </>;
}

/** Krok 2 bez szablonu z ćwiczeniami (decyzja właściciela 09.10.2026): są puste szablony — „Dodaj ćwiczenia do szablonu „…”” z przejściem do edycji
 * ostatnio zmienianego; kilka pustych — dodatkowo liczba i lista Szablony; brak szablonów — „Najpierw utwórz szablon.” jak dotąd. */
function EmptyHint() {
  const router = useRouter(); const empty = emptyTemplates(); const x = empty[0];
  if (!x) return <Muted style={{ fontSize: 12 }}>{t('Najpierw utwórz szablon.')}</Muted>;
  return <View style={{ gap: 6 }}>
    <Muted style={{ fontSize: 12 }}>{t('Dodaj ćwiczenia do szablonu „{name}”.', { name: x.name })}</Muted>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      <Btn nav small title={t('Dodaj ćwiczenia')} accessibilityLabel={t('Dodaj ćwiczenia do szablonu „{name}”.', { name: x.name })} onPress={() => router.push(`/template/${x.id}?edit=1`)} />
      {empty.length > 1 ? <Btn nav small kind="ghost" title={t('Puste szablony: {n}', { n: empty.length })} accessibilityHint={t('Lista szablonów.')} onPress={() => router.navigate('/templates')} /> : null}
    </View>
  </View>;
}

/** Nowa osoba: kroki do pierwszego treningu (znikają po pierwszym zakończonym treningu). Audyt 0.10 UX-12 (wariant A): krok 1 z dwoma równorzędnymi
 * przyciskami (bez odsyłania do przycisku poza ekranem), krok 2 nieaktywny bez szablonu, opcjonalny krok „Miejsca i sprzęt”, krok pierwszego treningu
 * jednym zdaniem z odesłaniem do tematu przewodnika „Trening i serie”; pusty stan pod spodem znika, gdy widać „Pierwsze kroki” (ekran Trening). */
export function FirstSteps() {
  useTick(); const router = useRouter(); const th = useTheme(); const f = firstSteps(); if (!f) return null;
  const places = getState().settings.locations.length > 0;
  const step = (done: boolean, n: number, text: string, actions?: React.ReactNode) => (
    <View accessibilityLanguage={lang()} key={n} accessible={!actions} accessibilityLabel={`${n}. ${text} ${done ? t('zrobione') : t('do zrobienia')}`} style={{ flexDirection: 'row', gap: 10, paddingVertical: 8 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? th.accent : 'transparent', borderWidth: done ? 0 : 1.5, borderColor: th.line }}>
        <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} /* A11-07: znak w kółku 22–24 pt */ style={{ fontSize: 12, fontFamily: F.semibold, color: done ? th.accentInk : th.muted }}>{done ? '✓' : String(n)}</Txt>
      </View>
      <View style={{ flex: 1, gap: 6 }}><Txt style={{ fontSize: 14, color: done ? th.muted : th.text }}>{text}</Txt>{actions}</View>
    </View>);
  const row = (...b: React.ReactNode[]) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{b}</View>;
  return (
    <View testID="first-steps" style={{ marginTop: 6, padding: 12, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Txt accessibilityRole="header" style={{ fontFamily: F.semibold, fontSize: 17 }}>{t('Pierwsze kroki')}</Txt>
        <Btn nav small kind="ghost" title={t('Przewodnik')} accessibilityLabel={t('Przewodnik po funkcjach')} onPress={() => router.push('/guide')} />{/* 08.10.2026 */}
      </View>
      {step(f.template, 1, t('Utwórz pierwszy szablon albo wygeneruj szablony i plan.'), !f.template ? row(
        <Btn nav key="new" small title={t('+ Nowy szablon')} onPress={() => { const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1`); }} />,
        <Btn nav key="gen" small title={t('Wygeneruj szablony i plan')} onPress={() => router.push('/generator')} />) : undefined)}
      {step(f.plan, 2, t('Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.'), !f.plan ? (f.template ? row(<Btn nav key="plan" small title={t('Plan tygodnia')} onPress={() => router.push('/plan')} />,
        <Btn nav key="own" small title={t('Plan z moich szablonów')} onPress={() => router.push('/generator?mode=own')} />) /* 09.10.2026 (B) */ : <EmptyHint />) : undefined)}
      {step(places, 3, t('Opcjonalnie: dodaj miejsce i sprzęt — wybór ćwiczeń i podpowiedzi ciężarów dopasują się do niego.'), !places ? <Btn nav small kind="ghost" title={t('Miejsca i sprzęt')} onPress={() => router.push('/more/locations')} style={{ alignSelf: 'flex-start' }} /> : undefined)}
      {step(false, 4, t('Pierwszy trening: „Start” przy szablonie niżej albo „Pusty trening”.'), <Btn nav small kind="ghost" title={t('Jak to działa')} accessibilityLabel={t('Przewodnik: {name}', { name: t('Trening i serie') })} onPress={() => router.push('/guide?topic=workout')} style={{ alignSelf: 'flex-start' }} />)}
    </View>);
}
