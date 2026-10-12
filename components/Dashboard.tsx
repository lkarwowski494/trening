import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt, SectionTitle, useOnce } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX } from '@/lib/theme';
import { useTick } from '@/lib/store';
import { weekTiles, lastWorkout, firstSteps } from '@/lib/dashboard';
import { compareCached, type CmpKind } from '@/lib/progress';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { fmtVol } from '@/lib/units';
import { WeekStacks } from '@/components/WeekStacks';
import { MuscleMap } from '@/components/MuscleMap';
import { MuscleRows, SegLegend, setBars } from '@/components/ProgressBars';
import { t, tp, lang } from '@/lib/i18n';

/* Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A) — dane: lib/dashboard.ts. */
function Tile({ label, value }: { label: string; value: string }) { /* 11.10.2026: bez „poprz.” — porównania są w Progresji */
  const th = useTheme();
  return (
    <View accessibilityLanguage={lang()} accessible accessibilityLabel={`${label}: ${value}`} style={{ flexGrow: 1, flexBasis: '45%' /* 2 × 2 — mieści się przy 320 pt i długich tłumaczeniach */, padding: 10, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 20 }}>{value}</Txt>
      <Muted style={{ fontSize: 12 }}>{label}</Muted>
    </View>);
}
const hm = (sec: number) => { const m = Math.round(sec / 60); return m >= 60 ? `${t('{n} h', { n: Math.floor(m / 60) })}${m % 60 ? ` ${t('{n} min', { n: m % 60 })}` : ''}` : t('{n} min', { n: m }); }; /* A11-17: jednostki przez t() */

/** „Ten tydzień” (od pierwszego zakończonego treningu), tylko bieżący tydzień (11.10.2026): cztery kafelki (treningi, serie, objętość, czas), przy planie
 * stosy talerzy tuż pod nimi, potem sylwetka z seriami tygodnia i pilnowanie liczby serii: wykonane + zaplanowane z szablonów vs kreska celu na jednej osi. */
export function WeekStats() {
  useTick(); const router = useRouter(); const once = useOnce(); /* UI2-02 */ const w = weekTiles(); const last = lastWorkout(); if (!last) return null;
  const c = compareCached('week'); const plannedSets = c.planned?.sets ?? 0;
  const tiles = [[t('Treningi'), String(w.workouts)], [t('Serie'), String(w.sets)], [t('Objętość'), fmtVol(w.volume)], [t('Czas'), hm(w.durationSec)]] as const;
  const map: Record<string, number> = {}; c.rows.forEach(r => { map[r.muscle] = r.doneSets + r.plannedSets; });
  return <>
    <SectionTitle>{t('Ten tydzień')}</SectionTitle>
    <Pressable testID="week-tiles" accessibilityRole="button" accessibilityLabel={tiles.map(([label, value]) => `${label}: ${value}`).join('; ')} accessibilityHint={t('Otwiera Postępy.')} onPress={once(() => router.navigate('/progress'))} style={({ pressed }: { pressed: boolean }) => ({ flexDirection: 'row', flexWrap: 'wrap', gap: 8, opacity: pressed ? 0.7 : 1 })} /* UX-16 A (audyt 0.10): te same definicje co Postępy */>
      {tiles.map(([label, value]) => <Tile key={label} label={label} value={value} />)}
    </Pressable>
    {w.planned ? <View style={{ marginTop: 10 }}><WeekStacks /></View> : null /* przy planie stosy talerzy i „60% planu tygodnia (3 z 5)” (korekta właściciela 09.10.2026 ok. 17:00; te same liczby, lib/motif.weekProgress) */}{/* audyt 0.10 A5/X-04: dni z planu zrobione zaplanowanym szablonem (ten sam stan dnia co kalendarz) — sesje i dni planu osobno */}
    {c.rows.length ? <View testID="week-muscles" style={{ marginTop: 6 }}>
      <MuscleMap sets={map} title={t('Sylwetka: serie w tym tygodniu')} height={170} legend={false} caption={t('Kolor względem partii z największą liczbą serii w tym tygodniu (wykonane + zaplanowane). Szare — bez serii.')} label={t('Sylwetka, serie w tym tygodniu: {list}', { list: c.rows.map(r => `${t(r.muscle)} ${r.doneSets + r.plannedSets}`).join(', ') })} />
      <Muted style={{ fontSize: 12, fontFamily: F.semibold, marginTop: 10, marginBottom: 6 }}>{t('Serie na partię — wykonane i zaplanowane')}</Muted>
      <MuscleRows rows={setBars(c.setRows, true)} metric="sets" showPrev={false} />
      <SegLegend planned={plannedSets > 0} />
      <Muted style={{ fontSize: 12, marginTop: 6 }}>{t('Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', { n: WEEKLY_SETS_MARK })} {t('Zaplanowane — z szablonów na pozostałe dni tygodnia.')} {t('Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; Pelland i in. 2026 — jedno źródło).')} {t('Barki i plecy są rozbite według katalogu ćwiczeń: przód, bok i tył barków; góra pleców, najszersze i prostowniki. Ćwiczenie bez takiego rozbicia (np. własne) liczy się w wierszu „bez rozbicia”.')}</Muted>
    </View> : null}
    {/* „Ostatni trening” usunięty z ekranu głównego (właściciel 09.10.2026 ok. 16:20): informacja zostaje w arkuszu „Inny trening” („Powtórz ostatni”: nazwa · data), w Historii i Kalendarzu */}
  </>;
}

const pctText = (p: number | null) => (p === null ? '—' : p > 0 ? `+${p}%` : p < 0 ? `−${Math.abs(p)}%` : '0%');
const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
/** Kafelki „Progresji” na ekranie głównym (docs/22 krok 3 pkt 5; P8 B): bardzo podstawowe liczby — objętość (najpierw) i serie, z różnicą względem
 * porównywanego okresu; tydzień bieżący = wykonane + zaplanowane z szablonów (przy nieznanej objętości „+?”). Stuknięcie → ekran szczegółów. */
export function ProgressTiles() {
  useTick(); const th = useTheme(); const router = useRouter(); const once = useOnce(); if (!lastWorkout()) return null;
  const items: [CmpKind, string, string][] = [['week', t('Ten tydzień vs poprzedni'), t('wykonane + zaplanowane')], ['prevWeek', t('Poprzedni tydzień vs 2 tyg. temu'), t('wykonane')], ['month', t('Miesiąc do miesiąca'), '']];
  return <>
    <SectionTitle>{t('Progresja')}</SectionTitle>
    <View style={{ gap: 8 }}>
      {items.map(([kind, title, sub0]) => {
        const c = compareCached(kind); const sets = c.total.sets; const sub = kind === 'month' ? t('dni 1–{n} miesiąca vs poprzedni miesiąc', { n: new Date(c.cur.end - 1).getDate() }) : sub0;
        const vol = `${fmtVol(c.total.volume)}${c.unknown ? '+?' : ''}`; const vp = pctText(c.volumePct);
        return (
          <Pressable key={kind} testID={`progress-tile-${kind}`} accessibilityRole="button" accessibilityLanguage={lang()} accessibilityHint={t('Otwiera szczegóły Progresji.')}
            accessibilityLabel={t('{title} ({sub}): objętość {v}, {p}; serie {s}, {d}', { title, sub, v: vol, p: vp, s: c.total.sets, d: signed(c.setsDelta) })}
            onPress={once(() => router.push(`/progression?c=${kind}`))} style={({ pressed }) => ({ padding: 12, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, opacity: pressed ? 0.7 : 1, gap: 2 })}>
            <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{title}</Muted>
            <Muted style={{ fontSize: 11 }}>{sub}</Muted>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 16, rowGap: 2, marginTop: 4 }}>
              <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 18 }}>{vol} <Muted style={{ fontSize: 13 }}>{vp}</Muted></Txt>
              <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.semibold, fontSize: 15 }}>{sets} {tp(sets, 'seria|serie|serii')} <Muted style={{ fontSize: 12 }}>{signed(c.setsDelta)}</Muted></Txt>
            </View>
          </Pressable>); })}
    </View>
  </>;
}

/** Nowa osoba: kroki do pierwszego treningu (znikają po pierwszym zakończonym treningu). P4 A (decyzja właściciela 11.10.2026, docs/22): trzy kroki, każdy
 * z jednym przyciskiem — „Planowanie” (szablony i plan są w jednym miejscu: + Nowy szablon, Plan z moich szablonów, Wygeneruj) albo „Przewodnik”.
 * P6 B (import z innego dziennika jako czwarty, pomijalny krok „Masz historię z innej aplikacji?”) — po wdrożeniu importu (dziś go nie ma). */
export function FirstSteps() {
  useTick(); const router = useRouter(); const once = useOnce(); const th = useTheme(); const f = firstSteps(); if (!f) return null;
  const step = (done: boolean, n: number, text: string, action?: React.ReactNode) => (
    <View accessibilityLanguage={lang()} key={n} accessible={!action} accessibilityLabel={`${n}. ${text} ${done ? t('zrobione') : t('do zrobienia')}`} style={{ flexDirection: 'row', gap: 10, paddingVertical: 8 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? th.accent : 'transparent', borderWidth: done ? 0 : 1.5, borderColor: th.line }}>
        <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} /* A11-07: znak w kółku 22–24 pt */ style={{ fontSize: 12, fontFamily: F.semibold, color: done ? th.accentInk : th.muted }}>{done ? '✓' : String(n)}</Txt>
      </View>
      <View style={{ flex: 1, gap: 6 }}><Txt style={{ fontSize: 14, color: done ? th.muted : th.text }}>{text}</Txt>{action}</View>
    </View>);
  const planning = <Btn nav small title={t('Planowanie')} onPress={() => router.push('/plan')} style={{ alignSelf: 'flex-start' }} />;
  return (
    <View testID="first-steps" style={{ marginTop: 6, padding: 12, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt accessibilityRole="header" style={{ fontFamily: F.semibold, fontSize: 17 }}>{t('Pierwsze kroki')}</Txt>
      {step(f.template, 1, t('Utwórz pierwszy szablon albo wygeneruj szablony i plan.'), !f.template ? planning : undefined)}
      {step(f.plan, 2, t('Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.'), !f.plan ? planning : undefined)}
      {step(false, 3, t('Pierwszy trening: duży przycisk „Start” u góry albo „Pusty trening”.'), <Btn nav small kind="ghost" title={t('Przewodnik')} accessibilityLabel={t('Przewodnik po funkcjach')} onPress={() => router.push('/guide?topic=workout')} style={{ alignSelf: 'flex-start' }} />)}
      {/* 11.10.2026: „Miejsca i sprzęt” — jedno zdanie z odnośnikiem (nie osobny krok); z Ustawień wejście zniknęło */}
      <Pressable accessibilityLanguage={lang()} accessibilityRole="link" accessibilityLabel={t('Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.')} onPress={once(() => router.push('/more/locations'))} hitSlop={8} style={{ paddingVertical: 4 }}>
        <Muted style={{ fontSize: 13 }}>{t('Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.')}</Muted>
      </Pressable>
    </View>);
}
