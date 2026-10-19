import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { H2, Muted, Txt, monoSafe } from '@/components/ui';
import { SignChip, SIGN_CHAR, GuardMap, GuardLegend } from '@/components/Guard';
import { useTheme, F, NUM_SCALE_MAX, TEXT_SCALE_MAX } from '@/lib/theme';
import { useTick, exById } from '@/lib/store';
import { guardCached, guardTexts, guardWord, type Guard, type GuardPart, type GuardDir, type SkipReason } from '@/lib/guard';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { SECONDARY_SHARE, type SetSplit } from '@/lib/setSplit';
import { mixHex } from '@/lib/musclemap';
import { fmtVol, fmtW, fmtNum } from '@/lib/units';
import { fmtWeekdayShort } from '@/lib/calendar';
import { t, tp, lang, exName, upper } from '@/lib/i18n';

/*
 * Postępy → „Strażnik progresji” (strażnik progresji, specyfikacja 14.10.2026): sylwetka jak na ekranie Trening i lista partii od problemów:
 * poniżej celu (największa luka pierwsza), mniej, bez porównania, tyle samo, nowe, więcej; na końcu „Bez serii”. Wiersz: znak + nazwa, serie / cel, tonaż na sesję
 * z poprzednim, pasek serii (wykonane pełnym akcentem, plan jaśniejszym, kreska celu, skala do 2× cel, nadmiar „»” z liczbą — bez koloru ostrzegawczego).
 * Stuknięcie rozwija szczegóły (wzorzec 20, ▸/▾ + expanded; po wyjściu z ekranu zwinięte). Serie pośrednie pokazujemy tylko tutaj.
 */
const n1 = (v: number) => fmtNum(v, 1);
const REASON: Record<SkipReason, () => string> = { onlyNow: () => t('nowe w tym tygodniu'), onlyBefore: () => t('nierobione w tym tygodniu'), noWeight: () => t('bez ciężaru'), unknownPlan: () => t('plan bez ciężaru lub powtórzeń') };
const dayOf = (k: string) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const exLabel = (id: string) => { const e = exById(id); return e ? exName(e) : id; };
/** „6 + 1,5 pośrednio (3 serie po 0,5)”; bez serii pośrednich — samo „6”. */
const setsText = (s: SetSplit) => { const n = s.indirectSets; /* nazwa `n`: test liczby mnogiej (tests/matrix-i18n) zna argumenty tp() */ return n > 0 ? t('{d} + {w} pośrednio ({n} {s} po {share})', { d: n1(s.direct), w: n1(s.indirectWeighted), n, s: tp(n, 'seria|serie|serii'), share: n1(SECONDARY_SHARE) }) : n1(s.direct); };

function GuardBar({ p }: { p: GuardPart }) {
  const th = useTheme(); const max = 2 * p.goal; const pc = (v: number) => Math.max(0, Math.min(100, (100 * v) / max)); const dw = pc(p.done.total); const pw = Math.max(0, pc(p.total) - dw);
  return (
    <View testID={`gbar-${p.part}`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ marginTop: 7, marginRight: 46 }}>
      <View style={{ height: 8, backgroundColor: th.line, borderRadius: 4 }}>
        <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' }}>
          <View testID={`gbar-${p.part}-done`} style={{ width: `${dw}%`, backgroundColor: th.accent }} />
          {pw > 0 ? <View testID={`gbar-${p.part}-planned`} style={{ width: `${pw}%`, backgroundColor: mixHex(th.surface, th.accent, 0.38) }} /> : null}
        </View>
        <View testID={`gbar-${p.part}-mark`} style={{ position: 'absolute', left: '50%', top: -3, width: 2, height: 14, marginLeft: -1, backgroundColor: th.text }} />
        {p.total > max ? <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ position: 'absolute', left: '100%', top: -6, paddingLeft: 4, fontSize: 11, fontFamily: F.monoBold, color: th.muted }}>{`» ${n1(p.total)}`}</Txt> : null}
      </View>
    </View>);
}

function GuardRow({ p }: { p: GuardPart }) {
  const th = useTheme(); const [open, setOpen] = useState(false); const name = t(p.part);
  const series = t('{n} / {goal} serii', { n: n1(p.total), goal: n1(p.goal) });
  const wf = p.compared.find(c => c.byWeight || c.fromZero); /* progres ciężarem: tonaż↓ przy ciężarze↑ albo poprzednio 0 kg (19.10.2026) */
  const tonn = (words: boolean) => p.tonnage ? t('tonaż/sesję {sign} {now} (poprz. {prev})', { sign: words ? guardWord(p.tonnage.dir) : SIGN_CHAR[p.tonnage.dir], now: fmtVol(p.tonnage.now), prev: fmtVol(p.tonnage.before) }) : '';
  const wline = (words: boolean) => wf ? t('ciężar roboczy {sign} {now} (poprz. {prev})', { sign: words ? guardWord('up') : SIGN_CHAR.up, now: fmtW(wf.now.weight), prev: fmtW(wf.before.weight) }) : '';
  const why = [...new Set(p.skipped.map(s => REASON[s.reason]()))].join(', ');
  const line = (words: boolean): string => p.dir === 'deload' ? '' : p.dir === 'new' ? t('brak poprzedniego tygodnia') : p.dir === 'unknown' ? (why ? `${guardWord('unknown')} — ${why}` : guardWord('unknown')) : [tonn(words), wline(words)].filter(Boolean).join(' · ');
  const label = [name + ': ' + (p.dir === 'deload' ? t('Tydzień deloadu — bez porównania') : guardWord(p.dir as Exclude<GuardDir, 'deload'>)), series, line(true)].filter(Boolean).join('. ');
  /* 19.10.2026: powody pominięcia osobno — „bez punktu odniesienia” tylko dla ćwiczeń z jednego tygodnia; „bez ciężaru” i „plan bez wartości” to inne powody (dawniej jeden sprzeczny napis) */
  const refItems = p.skipped.filter(s => s.reason === 'onlyNow' || s.reason === 'onlyBefore').map(s => `${exLabel(s.exerciseId)} — ${REASON[s.reason]()}`);
  const noWeightItems = p.skipped.filter(s => s.reason === 'noWeight').map(s => exLabel(s.exerciseId));
  const planItems = p.skipped.filter(s => s.reason === 'unknownPlan').map(s => exLabel(s.exerciseId));
  return (
    <View testID={`grow-${p.part}`} style={{ paddingHorizontal: 12, paddingVertical: 4, borderTopWidth: 1, borderTopColor: th.line }}>
      <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={({ pressed }) => ({ minHeight: 44, justifyContent: 'center', paddingVertical: 6, opacity: pressed ? 0.7 : 1 })}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', columnGap: 8, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1 }}><SignChip dir={p.dir} /><Txt style={{ fontFamily: F.semibold, fontSize: 15, flexShrink: 1 }}>{name}</Txt><Muted style={{ fontSize: 13 }}>{open ? '▾' : '▸'}</Muted></View>
          <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ fontFamily: F.mono, fontSize: 13 }}>{monoSafe(series)}</Txt>
        </View>
        {line(false) ? <Muted style={{ fontSize: 12, marginTop: 2 }}>{line(false)}</Muted> : null}
        <GuardBar p={p} />
      </Pressable>
      {open ? (
        <View testID={`gdet-${p.part}`} style={{ marginBottom: 8, padding: 10, borderRadius: 8, backgroundColor: th.bg, gap: 6 }}>
          <Muted style={{ fontSize: 13 }}>{t('Wykonane: {text}', { text: setsText(p.done) })}</Muted>
          {p.planned.total > 0 ? <Muted style={{ fontSize: 13 }}>{t('Zaplanowane: {text} ({days})', { text: setsText(p.planned), days: p.plannedDays.map(k => fmtWeekdayShort(dayOf(k))).join(', ') })}</Muted> : null}
          {p.compared.length ? (
            <View style={{ gap: 4 }}>
              <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{t('Porównywane ćwiczenia: tonaż/sesję i ciężar roboczy')}</Muted>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}><Muted style={{ fontSize: 11, minWidth: 74, textAlign: 'right' }}>{t('teraz')}</Muted><Muted style={{ fontSize: 11, minWidth: 74, textAlign: 'right' }}>{t('wcześniej')}</Muted></View>
              {p.compared.map(c => (
                <View key={c.exerciseId} testID={`gex-${p.part}-${c.exerciseId}`} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, borderTopWidth: 1, borderTopColor: th.line, paddingTop: 3 }}>
                  <Txt style={{ fontSize: 13, flexShrink: 1 }}>{exLabel(c.exerciseId)}</Txt>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ minWidth: 74, alignItems: 'flex-end' }}><Txt maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ fontFamily: F.mono, fontSize: 12 }}>{monoSafe(fmtVol(c.now.perSession))}</Txt><Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ fontSize: 11 }}>{fmtW(c.now.weight)}</Muted></View>
                    <View style={{ minWidth: 74, alignItems: 'flex-end' }}><Txt maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ fontFamily: F.mono, fontSize: 12 }}>{monoSafe(fmtVol(c.before.perSession))}</Txt><Muted maxFontSizeMultiplier={NUM_SCALE_MAX} style={{ fontSize: 11 }}>{fmtW(c.before.weight)}</Muted></View>
                  </View>
                </View>))}
            </View>) : null}
          {refItems.length ? <Muted testID={`gskip-ref-${p.part}`} style={{ fontSize: 12 }}>{t('Pominięte (bez punktu odniesienia): {list}', { list: refItems.join('; ') })}</Muted> : null}
          {noWeightItems.length ? <Muted testID={`gskip-noweight-${p.part}`} style={{ fontSize: 12 }}>{t('Pominięte (bez ciężaru): {list}', { list: noWeightItems.join(', ') })}</Muted> : null}
          {planItems.length ? <Muted testID={`gskip-plan-${p.part}`} style={{ fontSize: 12 }}>{t('Pominięte (plan bez ciężaru lub powtórzeń): {list}', { list: planItems.join(', ') })}</Muted> : null}
        </View>) : null}
    </View>);
}

/** Kolejność grup (decyzja właściciela 14.10.2026): poniżej celu (największa luka pierwsza), mniej, bez porównania, tyle samo, nowe, więcej; w deloadzie jedna grupa. */
export function guardGroups(g: Guard): { key: string; dir: GuardDir | null; title: string; parts: GuardPart[] }[] {
  if (g.deload) return [{ key: 'deload', dir: 'deload', title: t('Tydzień deloadu — bez porównania'), parts: g.parts.filter(p => p.total > 0) }];
  const used = new Set<string>(g.below.map(p => p.part));
  const out: { key: string; dir: GuardDir | null; title: string; parts: GuardPart[] }[] = [{ key: 'below', dir: null, title: g.hasPlan ? t('Poniżej celu nawet z planem') : t('Poniżej celu'), parts: g.below }];
  for (const d of ['down', 'unknown', 'same', 'new', 'up'] as const) { const l = g.parts.filter(p => p.dir === d && !used.has(p.part)); l.forEach(p => used.add(p.part)); out.push({ key: d, dir: d, title: guardWord(d), parts: l }); }
  return out.filter(x => x.parts.length);
}

/** Sekcja „Strażnik progresji” w Postępach (zakładka bez wybranego ćwiczenia). `onLayoutY` — pozycja sekcji (przewinięcie z ekranu Trening). */
export function GuardSection({ onLayoutY }: { onLayoutY?: (y: number) => void }) {
  useTick(); const th = useTheme(); const g = guardCached(); const x = guardTexts(g); const trained = g.parts.some(p => p.total > 0); const none = g.parts.filter(p => p.dir === 'none');
  return (
    <View testID="guard-section" onLayout={e => onLayoutY?.(e.nativeEvent.layout.y)} style={{ marginBottom: 6 }}>
      <H2 style={{ marginTop: 14 }} infoId="guard-method" info={[
        t('Kierunek dla partii liczymy tylko na ćwiczeniach, które były w obu tygodniach. Ćwiczenia bez punktu odniesienia — nowe w tym tygodniu albo nierobione teraz — pomijamy w obu tygodniach.'),
        t('Miara: tonaż (serie × powtórzenia × ciężar) średnio na sesję ćwiczenia, więc inna liczba sesji nie zawyża wyniku. Gdy tonaż spadł, a ciężar roboczy wzrósł — albo poprzednio ciężar wynosił 0, a teraz nie — liczymy to jako więcej.'),
        t('Ten tydzień = wykonane + plan. Plan bez ciężarów (≥) — bez porównania. Tydzień deloadu nie jest porównywany.'),
        [t('Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', { n: WEEKLY_SETS_MARK }), t('Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; metaanaliza Pelland i in. 2026).')].join(' '),
      ]}>{t('Strażnik progresji')}</H2>
      {!trained ? <Muted style={{ fontSize: 13 }}>{t('Brak serii w tym tygodniu.')}</Muted> : <>
        <GuardMap parts={g.parts} label={x.label} testID="guard-map-pg" />
        {x.deload ? <Muted style={{ textAlign: 'center', fontFamily: F.semibold, marginTop: 8 }}>{x.deload}</Muted> : <GuardLegend parts={g.parts} testID="guard-legend-pg" />}
        {x.compared ? <Muted testID="guard-compared-pg" style={{ fontSize: 12, textAlign: 'center', marginTop: 6 }}>{x.compared}</Muted> : null}
        <View style={{ marginTop: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, borderRadius: 12, overflow: 'hidden' }}>
          {guardGroups(g).map(grp => (
            <View key={grp.key} testID={`ggrp-${grp.key}`}>
              <View accessible accessibilityLanguage={lang()} accessibilityRole="header" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 2 }}>
                {grp.dir ? <SignChip dir={grp.dir} size={14} /> : null}<Muted maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ fontSize: 11, fontFamily: F.semibold, letterSpacing: 0.4, flexShrink: 1 }}>{upper(grp.title)}</Muted>
              </View>
              {grp.parts.map(p => <GuardRow key={p.part} p={p} />)}
            </View>))}
          {none.length ? (
            <View testID="grow-none" accessible accessibilityLanguage={lang()} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: th.line }}>
              <SignChip dir="none" /><Muted style={{ fontSize: 14, flexShrink: 1 }}>{t('Bez serii: {list}', { list: none.map(p => t(p.part)).join(', ') })}</Muted>
            </View>) : null}
        </View>
        <View testID="guard-bar-legend" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 2, marginTop: 8, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: th.accent }} /><Muted style={{ fontSize: 12 }}>{t('wykonane')}</Muted></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: mixHex(th.surface, th.accent, 0.38) }} /><Muted style={{ fontSize: 12 }}>{t('zaplanowane')}</Muted></View>
          <Muted style={{ fontSize: 12 }}>{t('Skala do dwukrotności celu, » — więcej.')}</Muted>
        </View>
      </>}
    </View>);
}
