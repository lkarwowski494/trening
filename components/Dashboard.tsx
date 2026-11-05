import { WeekHealthLine } from '@/components/HealthLines';
import { fullValueProps } from '@/components/FullValue'; /* DEC-01 a */
import React from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { Muted, Txt, SectionTitle, useOnce } from '@/components/ui';
import { Icon, type IconName } from '@/components/Icon';
import { useTheme, FONT, TYPE, TEXT_SIZE, RADIUS_PRZEJSCIOWE, SPACE, SIZE, TEXT_SCALE_MAX, GLYPH_SCALE_MAX, FW, font } from '@/lib/theme';
import { useTick } from '@/lib/store';
import { weekTiles, lastWorkout, firstSteps, setupTileColumns, SETUP_TILE_GAP } from '@/lib/dashboard';
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
    <View accessibilityLanguage={lang()} accessible accessibilityLabel={`${label}: ${value}`} {...fullValueProps(label, value)} /* DEC-01 a: podgląd po przytrzymaniu */ style={{ flexGrow: 1, flexBasis: '45%' /* 2 × 2 — mieści się przy 320 pt i długich tłumaczeniach */, padding: 10, borderRadius: RADIUS_PRZEJSCIOWE.tile, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: FONT.title700, fontSize: TYPE.navTitle.size }}>{value}</Txt>
      <Muted style={{ fontSize: TEXT_SIZE.small }}>{label}</Muted>
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
      {x.compared ? <Muted testID="guard-compared" style={{ fontSize: TEXT_SIZE.small, textAlign: 'center', marginTop: 6 }}>{x.compared}</Muted> : null}
      {x.short || x.less ? <View style={{ marginTop: 10, gap: 4 }}>
        {x.short ? <Text testID="guard-short" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...FW.regular, fontSize: 13, lineHeight: 19 }}>{x.short}</Text> : null}
        {x.less ? <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}><View style={{ marginTop: 2 }}><SignChip dir="down" size={16} /></View><Text testID="guard-less" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...FW.regular, fontSize: 13, lineHeight: 19, flexShrink: 1 }}>{x.less}</Text></View> : null}
      </View> : null}
      <Pressable testID="guard-more" accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Szczegóły w Postępach')} accessibilityHint={t('Otwiera Postępy.')} onPress={open} style={({ pressed }: { pressed: boolean }) => ({ minHeight: 44, marginTop: 10, borderTopWidth: 1, borderTopColor: th.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: pressed ? 0.7 : 1 })}>
        <Txt maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...FW.semibold, fontSize: TYPE.callout.size, color: th.accent }}>{t('Szczegóły w Postępach')}</Txt><Txt maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.accent, fontSize: TYPE.navTitle.size }}>›</Txt>
      </Pressable>
    </View> : <Muted testID="week-muscles" style={{ fontSize: TYPE.footnote.size, marginTop: 8 }}>{t('Brak serii w tym tygodniu.')}</Muted>}
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
            {...fullValueProps(title, `${vol} ${vp}; ${sets} ${tp(sets, 'seria|serie|serii')} ${sp}`)} /* DEC-01 a: podgląd po przytrzymaniu */
            accessibilityLabel={t('{title} ({sub}): objętość {v}, {p}; serie {s}, {d}', { title, sub, v: volA11y, p: vp, s: c.total.sets, d: sp })}
            onPress={once(() => router.push(`/progression?c=${kind}`))} style={({ pressed }) => ({ padding: 12, borderRadius: RADIUS_PRZEJSCIOWE.tile, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, opacity: pressed ? 0.7 : 1, gap: 2 })}>
            <Muted style={{ fontSize: TEXT_SIZE.small, ...FW.semibold }}>{title}</Muted>
            <Muted style={{ fontSize: TYPE.caption.size }}>{sub}</Muted>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 16, rowGap: 2, marginTop: 4 }}>
              {/* osobne teksty: „brak poprzedniego okresu” to zdanie — limit powiększenia TEXT_SCALE_MAX (A11N-04), liczby 1,4 */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}><Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: FONT.title700, fontSize: TYPE.stepLabel.size }}>{vol}</Txt><Muted style={{ fontSize: TYPE.footnote.size }}>{vp}</Muted></View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}><Txt maxFontSizeMultiplier={1.4} style={{ ...FW.semibold, fontSize: TYPE.callout.size }}>{sets} {tp(sets, 'seria|serie|serii')}</Txt><Muted style={{ fontSize: TEXT_SIZE.small }}>{sp}</Muted></View>
            </View>
          </Pressable>); })}
    </View>
  </>;
}

/** Nowa osoba (do pierwszego zakończonego treningu): „Przygotuj się do pierwszej serii” — cztery osobne kafelki W1 (decyzja właściciela 05.11.2026, docs/18; makieta docs/design/kierunki/start-1-1-r4.html),
 * w stylu kafelków „Ten tydzień” (promień, obwódka, ikona przy tytule), „›” w prawym dolnym rogu (docs/32 wzorzec 17); całe kafelki są przyciskami ≥ 44 pt.
 * 2 × 2, a przy wąskim ekranie, dużym tekście i dłuższych językach jedna kolumna (lib/dashboard.setupTileColumns). Zastępuje kartę „Pierwsze kroki” (08.10.2026, P4 A 11.10.2026,
 * DEC-04 a 23.10.2026): te same wejścia — Szablony i plan, Miejsca i sprzęt, import CSV (testID first-steps-import), Przewodnik; kroki „zrobione” i zdanie o dużym przycisku zniknęły. */
export function FirstSteps() {
  useTick(); const router = useRouter(); const once = useOnce(); const th = useTheme(); const f = firstSteps(); const win = useWindowDimensions(); if (!f) return null;
  const cols = setupTileColumns(win.width - 2 * SPACE.l, win.fontScale || 1);
  const tiles: { id: string; icon: IconName; title: string; text: string; go: () => void }[] = [
    { id: 'first-tile-plan', icon: 'calendar', title: t('Szablony i plan'), text: t('Utwórz pierwszy szablon albo wygeneruj szablony i plan.'), go: () => router.push('/plan') },
    { id: 'first-tile-places', icon: 'pin', title: t('Miejsca i sprzęt'), text: t('Dom albo siłownia — ustaw swój sprzęt.'), go: () => router.push('/more/locations') },
    { id: 'first-steps-import', icon: 'download', title: t('Historia z CSV'), text: t('Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.'), go: () => router.push('/more/import') },
    { id: 'first-tile-guide', icon: 'book', title: t('Przewodnik'), text: t('Co gdzie jest i jak działa.'), go: () => router.push('/guide?topic=workout') },
  ];
  return (
    <View testID="first-steps">
      <SectionTitle>{t('Przygotuj się do pierwszej serii')}</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SETUP_TILE_GAP }}>
        {tiles.map(x => (
          <Pressable key={x.id} testID={x.id} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={`${x.title}. ${x.text}`} onPress={once(x.go)}
            style={({ pressed }: { pressed: boolean }) => ({ width: cols === 2 ? (win.width - 2 * SPACE.l - SETUP_TILE_GAP) / 2 : '100%', minHeight: SIZE.hit, gap: SPACE.xs, padding: SPACE.m, borderRadius: RADIUS_PRZEJSCIOWE.tile, borderWidth: 1, borderColor: th.line, opacity: pressed ? 0.7 : 1 })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACE.s }}>
              <Icon name={x.icon} color={th.text} size={SIZE.icon} />
              <View style={{ flex: 1 }}><Txt maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ ...FW.semibold, fontSize: TYPE.body.size - 1 }}>{x.title}</Txt></View>
            </View>
            <View style={{ paddingRight: SPACE.m + SPACE.xs }}><Muted maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ fontSize: TYPE.footnote.size }}>{x.text}</Muted></View>
            <Text accessibilityElementsHidden importantForAccessibility="no" maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ position: 'absolute', right: SPACE.m, bottom: SPACE.s, color: th.muted, ...font('callout') }}>›</Text>
          </Pressable>))}
      </View>
    </View>);
}
