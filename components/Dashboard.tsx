import { WeekHealthLine } from '@/components/HealthLines';
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt, SectionTitle, useOnce } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX, TEXT_SCALE_MAX, GLYPH_SCALE_MAX, FW } from '@/lib/theme';
import { useTick } from '@/lib/store';
import { weekTiles, lastWorkout, firstSteps } from '@/lib/dashboard';
import { compareCached, pctText, type CmpKind } from '@/lib/progress';
import { guardCached, guardTexts } from '@/lib/guard';
import { fmtVol } from '@/lib/units';
import { WeekStacks } from '@/components/WeekStacks';
import { GuardMap, GuardLegend, SignChip } from '@/components/Guard';
import { t, tp, lang } from '@/lib/i18n';

/* Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A) — dane: lib/dashboard.ts. */
function Tile({ label, value }: { label: string; value: string }) { /* 11.10.2026: bez „poprz.” — porównania są w Progresji (w Postępach) */
  const th = useTheme();
  return (
    <View accessibilityLanguage={lang()} accessible accessibilityLabel={`${label}: ${value}`} style={{ flexGrow: 1, flexBasis: '45%' /* 2 × 2 — mieści się przy 320 pt i długich tłumaczeniach */, padding: 10, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 20 }}>{value}</Txt>
      <Muted style={{ fontSize: 12 }}>{label}</Muted>
    </View>);
}
const hm = (sec: number) => { const m = Math.round(sec / 60); return m >= 60 ? `${t('{n} h', { n: Math.floor(m / 60) })}${m % 60 ? ` ${t('{n} min', { n: m % 60 })}` : ''}` : t('{n} min', { n: m }); }; /* A11-17: jednostki przez t() */

/** „Ten tydzień” (od pierwszego zakończonego treningu), tylko bieżący tydzień (11.10.2026): cztery kafelki (treningi, serie, objętość, czas), przy planie
 * stosy talerzy tuż pod nimi, potem „strażnik progresji” (wariant C, 14.10.2026): sylwetka w kolorach PROGRESU per partia (więcej / tyle samo / mniej / bez porównania /
 * bez serii), legenda, najwyżej dwa zdania (braki celu nawet z planem; spadki) i jeden przycisk do Postępów. Listy pasków i serii pośrednich tu nie ma — są w Postępach. */
export function WeekStats() {
  useTick(); const th = useTheme(); const router = useRouter(); const once = useOnce(); /* UI2-02 */ const w = weekTiles(); const last = lastWorkout(); if (!last) return null;
  const g = guardCached(); const x = guardTexts(g); const trained = g.parts.some(p => p.total > 0); const open = once(() => router.navigate('/progress?s=guard'));
  const tiles = [[t('Treningi'), String(w.workouts)], [t('Serie'), String(w.sets)], [t('Objętość'), fmtVol(w.volume)], [t('Czas'), hm(w.durationSec)]] as const;
  return <>
    <SectionTitle>{t('Ten tydzień')}</SectionTitle>
    <Pressable testID="week-tiles" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={tiles.map(([label, value]) => `${label}: ${value}`).join('; ')} accessibilityHint={t('Otwiera Postępy.')} onPress={once(() => router.navigate('/progress'))} style={({ pressed }: { pressed: boolean }) => ({ flexDirection: 'row', flexWrap: 'wrap', gap: 8, opacity: pressed ? 0.7 : 1 })} /* UX-16 A (audyt 0.10): te same definicje co Postępy */>
      {tiles.map(([label, value]) => <Tile key={label} label={label} value={value} />)}
    </Pressable>
    <WeekHealthLine />{/* 0.16.0 (P3): średnia dzienna kroków z 7 dni + inne aktywności tygodnia (Apple Health) */}
    {w.planned ? <View style={{ marginTop: 10 }}><WeekStacks /></View> : null /* przy planie stosy talerzy i „60% planu tygodnia (3 z 5)” (korekta właściciela 09.10.2026 ok. 17:00; te same liczby, lib/motif.weekProgress) */}{/* audyt 0.10 A5/X-04: dni z planu zrobione zaplanowanym szablonem (ten sam stan dnia co kalendarz) — sesje i dni planu osobno */}
    {trained ? <View testID="week-muscles" style={{ marginTop: 6 }} /* jeden przycisk „Szczegóły w Postępach” (≥ 44 pt) prowadzi do Postępów */>
      <GuardMap parts={g.parts} label={x.label} height={170} />
      {x.deload ? <Muted testID="guard-deload" style={{ textAlign: 'center', ...FW.semibold, marginTop: 8 }}>{x.deload}</Muted> : <GuardLegend parts={g.parts} />}
      {x.compared ? <Muted testID="guard-compared" style={{ fontSize: 12, textAlign: 'center', marginTop: 6 }}>{x.compared}</Muted> : null}
      {x.short || x.less ? <View style={{ marginTop: 10, gap: 4 }}>
        {x.short ? <Text testID="guard-short" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...FW.regular, fontSize: 13, lineHeight: 19 }}>{x.short}</Text> : null}
        {x.less ? <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}><View style={{ marginTop: 2 }}><SignChip dir="down" size={16} /></View><Text testID="guard-less" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...FW.regular, fontSize: 13, lineHeight: 19, flexShrink: 1 }}>{x.less}</Text></View> : null}
      </View> : null}
      <Pressable testID="guard-more" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Szczegóły w Postępach')} accessibilityHint={t('Otwiera Postępy.')} onPress={open} style={({ pressed }: { pressed: boolean }) => ({ minHeight: 44, marginTop: 10, borderTopWidth: 1, borderTopColor: th.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: pressed ? 0.7 : 1 })}>
        <Txt maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...FW.semibold, fontSize: 15, color: th.accent }}>{t('Szczegóły w Postępach')}</Txt><Txt maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.accent, fontSize: 20 }}>›</Txt>
      </Pressable>
    </View> : <Muted testID="week-muscles" style={{ fontSize: 13, marginTop: 8 }}>{t('Brak serii w tym tygodniu.')}</Muted>}
    {/* „Ostatni trening” usunięty z ekranu głównego (właściciel 09.10.2026 ok. 16:20): informacja zostaje w arkuszu „Inny trening” („Powtórz ostatni”: nazwa · data), w Historii i Kalendarzu */}
  </>;
}

/** Kafelki „Progresji” w Postępach (14.10.2026: z ekranu Trening usunięte; docs/22 krok 3 pkt 5; P8 B): bardzo podstawowe liczby — objętość (najpierw) i serie, z różnicą względem
 * porównywanego okresu; tydzień bieżący = wykonane + zaplanowane z szablonów (przy nieznanej objętości „+?”). Stuknięcie → ekran szczegółów. */
export function ProgressTiles() {
  useTick(); const th = useTheme(); const router = useRouter(); const once = useOnce(); if (!lastWorkout()) return null;
  const items: [CmpKind, string, string][] = [['week', t('Ten tydzień vs poprzedni'), t('wykonane + zaplanowane')], ['prevWeek', t('Poprzedni tydzień vs 2 tyg. temu'), t('wykonane')], ['month', t('Miesiąc do miesiąca'), '']];
  return <>
    <SectionTitle>{t('Progresja')}</SectionTitle>
    <View style={{ gap: 8 }}>
      {items.map(([kind, title, sub0]) => {
        const c = compareCached(kind); const sets = c.total.sets; const sub = kind === 'month' ? t('dni 1–{n} miesiąca vs poprzedni miesiąc', { n: new Date(c.cur.end - 1).getDate() }) : sub0;
        const vol = `${c.unknown ? '≥ ' : ''}${fmtVol(c.total.volume)}`; const vp = pctText(c.volumePct); const sp = pctText(c.setsPct); /* 14.10.2026: oba w procentach; „≥” = część zaplanowanych serii bez ciężaru */
        const volA11y = c.unknown ? `${t('co najmniej {n}', { n: fmtVol(c.total.volume) })} (${t('część zaplanowanych serii nie ma ciężaru')})` : vol;
        return (
          <Pressable key={kind} testID={`progress-tile-${kind}`} accessibilityRole="button" accessibilityLanguage={lang()} accessibilityHint={t('Otwiera szczegóły Progresji.')}
            accessibilityLabel={t('{title} ({sub}): objętość {v}, {p}; serie {s}, {d}', { title, sub, v: volA11y, p: vp, s: c.total.sets, d: sp })}
            onPress={once(() => router.push(`/progression?c=${kind}`))} style={({ pressed }) => ({ padding: 12, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, opacity: pressed ? 0.7 : 1, gap: 2 })}>
            <Muted style={{ fontSize: 12, ...FW.semibold }}>{title}</Muted>
            <Muted style={{ fontSize: 11 }}>{sub}</Muted>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 16, rowGap: 2, marginTop: 4 }}>
              {/* osobne teksty: „brak poprzedniego okresu” to zdanie — limit powiększenia TEXT_SCALE_MAX (A11N-04), liczby 1,4 */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}><Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 18 }}>{vol}</Txt><Muted style={{ fontSize: 13 }}>{vp}</Muted></View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}><Txt maxFontSizeMultiplier={1.4} style={{ ...FW.semibold, fontSize: 15 }}>{sets} {tp(sets, 'seria|serie|serii')}</Txt><Muted style={{ fontSize: 12 }}>{sp}</Muted></View>
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
        <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} /* A11-07: znak w kółku 22–24 pt */ style={{ fontSize: 12, ...FW.semibold, color: done ? th.accentInk : th.muted }}>{done ? '✓' : String(n)}</Txt>
      </View>
      <View style={{ flex: 1, gap: 6 }}><Txt style={{ fontSize: 14, color: done ? th.muted : th.text }}>{text}</Txt>{action}</View>
    </View>);
  const planning = <Btn nav small title={t('Planowanie')} onPress={() => router.push('/plan')} style={{ alignSelf: 'flex-start' }} />;
  return (
    <View testID="first-steps" style={{ marginTop: 6, padding: 12, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt accessibilityRole="header" style={{ ...FW.semibold, fontSize: 17 }}>{t('Pierwsze kroki')}</Txt>
      {step(f.template, 1, t('Utwórz pierwszy szablon albo wygeneruj szablony i plan.'), !f.template ? planning : undefined)}
      {step(f.plan, 2, t('Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.'), !f.plan ? planning : undefined)}
      {step(false, 3, t('Pierwszy trening: duży przycisk „Start” u góry albo „Pusty trening”.'), <Btn nav small kind="ghost" title={t('Przewodnik')} accessibilityLabel={t('Przewodnik po funkcjach')} onPress={() => router.push('/guide?topic=workout')} style={{ alignSelf: 'flex-start' }} />)}
      {/* 11.10.2026: „Miejsca i sprzęt” — jedno zdanie z odnośnikiem (nie osobny krok); z Ustawień wejście zniknęło */}
      <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.')} onPress={once(() => router.push('/more/locations'))} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}>
        <Muted style={{ fontSize: 13 }}>{t('Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.')}</Muted>
      </Pressable>
    </View>);
}
