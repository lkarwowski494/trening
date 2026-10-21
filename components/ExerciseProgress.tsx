import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Muted, Txt, Chip, H2, SectionTitle, monoSafe } from '@/components/ui';
import { setSummary, fmtDate, fmtSec, fmtDist, isBW, bodyMassLog, localDateTs } from '@/lib/store';
import { sessionsFor, recordsFor, chartKeysFor, totalKind, fmtTotal, fmtE1, bwShare, type ChartKey } from '@/lib/stats';
import { hasWeight, hasReps, hasTime, hasDistance, type Exercise } from '@/lib/seed';
import { LineChart, TIME_STEPS } from '@/components/Chart';
import { useTheme, FW, font, maxScale, RADIUS, SPACE } from '@/lib/theme';
import { t, exName, lang } from '@/lib/i18n';
import { fmtW, fmtVol } from '@/lib/units';

/** Wykres i rekordy jednego ćwiczenia (M3 p3, ZM-06): `top` — karta z nazwą, wyborem metryki, wartością ostatniej sesji i wykresem oraz grupa „REKORDY”;
 * `sessions` — lista ostatnich 20 sesji; `empty` — ćwiczenie bez zapisanych sesji (np. wybrane z wyszukiwania). Czysta funkcja widoku (bez hooków). */
export function exerciseParts({ ex, key, setKey, th, shortY }: { ex: Exercise; key: ChartKey | ''; setKey: (k: ChartKey | '') => void; th: ReturnType<typeof useTheme>; shortY: (ts: number) => string }): { top: React.ReactNode; sessions: React.ReactNode; empty: boolean } {
  const sessions = sessionsFor(ex); const rec = recordsFor(ex); const keys = chartKeysFor(ex);
  if (!sessions.length) return { top: null, sessions: null, empty: true };
  // Runda 12: domyślnie pierwszy wykres, który ma dane (np. „max pow.” dla pompek bez dociążenia i bez masy ciała).
  const active = keys.find(k => k.key === key) ?? keys.find(k => sessions.some(s => s[k.key] !== 0)) ?? keys[0];
  const points = active ? sessions.filter(s => s[active.key] !== 0 || (active.key === 'maxLoad' && isBW(ex) && s.hasLoad)).map(s => ({ x: s.date, y: s[active.key], get label() { return shortY(s.shown); /* X2-02: data na zegarze strefy startu */ } /* runda 74: data formatowana tylko dla punktów, które ją pokazują (pierwszy, ostatni, najlepszy) */ })) : []; /* runda 61/62: ±0 z wykonanej serii to wynik; sesja bez wykonanej serii — brak punktu */ /* runda 61: masa ciała bez asysty (±0) to wynik — dzień bez gumy */ // asysta (ujemne ±) też jest wynikiem
  const m = ex.metric ?? 'weight_reps'; const kg = (v: number) => fmtW(v);
  const recRows: [string, string][] = [];
  /* Runda 73: rekord = suma na treningu (pierwszy wiersz) + e1RM; pozostałe wiersze to maksima informacyjne */
  { const tk = totalKind(ex); if (tk && rec.bestTotal > 0) recRows.push([tk === 'objętość treningu' ? t('Najlepszy trening (objętość)') : tk === 'suma powtórzeń' ? t('Najwięcej powtórzeń na treningu') : tk === 'łączny czas' ? t('Najdłużej łącznie na treningu') : t('Najdłuższy dystans na treningu'), fmtTotal(ex, rec.bestTotal)]); }
  if (rec.bestE1rm) recRows.push([isBW(ex) ? 'e1RM (Epley)' : ex.loadMode === 'per_dumbbell' ? t('e1RM (Epley, per hantel)') : ex.loadMode === 'unilateral' ? t('e1RM (Epley, na stronę)') : 'e1RM (Epley)', fmtE1(ex, rec.bestE1rm, rec.bestE1rmBm)]); /* runda 59; E1 (audyt 0.10): masa ciała — „126,7 kg (masa ciała + 46,7)” */
  /* E1: dlaczego e1RM ćwiczenia z masą ciała jest albo go nie ma (masa ciała z Ustawień, udział masy ciała ze źródeł) */
  const sh = isBW(ex) && hasWeight(m) && hasReps(m) ? bwShare(ex) : undefined;
  const bwNote = !isBW(ex) || !hasWeight(m) || !hasReps(m) ? '' : !sh ? t('Bez e1RM: brak źródeł, jaką część masy ciała podnosisz w tym ćwiczeniu.') : !bodyMassLog().length ? t('e1RM pojawi się po wpisaniu masy ciała w Postępach.') : [t('e1RM: wzór Epleya na {p}% masy ciała z dnia treningu (ostatni pomiar z tego dnia lub wcześniejszy) plus dociążenie (uproszczenie).', { p: Math.round(sh * 100) }), ...(sessions.some(x => x.bodyMass == null) ? [t('Treningi sprzed pierwszego pomiaru ({d}) — bez e1RM.', { d: fmtDate(localDateTs(bodyMassLog()[0].date)) })] : [])].join(' '); /* fala 2: masa ciała z datą */
  if (hasWeight(m) && rec.maxLoad) recRows.push([isBW(ex) ? t('Max dociążenie') : (ex.loadMode === 'per_dumbbell' ? t('Max ciężar (per hantel)') : ex.loadMode === 'unilateral' ? t('Max ciężar (na stronę)') : t('Max ciężar')), kg(rec.maxLoad)]);
  if (rec.bestSetVolume) recRows.push([t('Najlepsza seria (objętość)'), fmtVol(rec.bestSetVolume)]);
  if (hasReps(m) && isBW(ex)) { /* T7: jak próg rekordu — bez asysty osobno, z asystą tylko gdy więcej */ if (rec.maxRepsFree) recRows.push([t('Max powtórzeń bez asysty'), `${rec.maxRepsFree}`]); if (rec.maxReps > rec.maxRepsFree) recRows.push([t('Max powtórzeń z asystą'), `${rec.maxReps}`]); }
  else if (hasReps(m) && rec.maxReps) recRows.push([t('Max powtórzeń w serii'), `${rec.maxReps}`]);
  if (hasTime(m) && m !== 'distance_time' && rec.maxDuration) recRows.push([t('Najdłuższa seria'), fmtSec(rec.maxDuration)]);
  if (hasDistance(m) && rec.maxDistance) recRows.push([t('Najdłuższy dystans'), fmtDist(rec.maxDistance)]);

  const last = points[points.length - 1];
  const top = <>
    <View testID="progress-hero" style={{ backgroundColor: th.surface, borderRadius: RADIUS.group, padding: SPACE.l, marginTop: SPACE.s }}>
      <Txt accessibilityRole="header" style={{ ...font('sectionTitle') }}>{exName(ex)}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.s - 2, marginTop: SPACE.s }}>{keys.map(k => <Chip key={k.key} label={k.label} on={active?.key === k.key} onPress={() => setKey(k.key)} />)}</View>
      {active && last ? <View accessible accessibilityLanguage={lang()} accessibilityLabel={`${active.label}: ${active.fmt(last.y)}`} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: SPACE.m }}><Txt maxFontSizeMultiplier={maxScale('stat')} style={{ ...font('stat'), flexShrink: 1, textAlign: 'right' }}>{monoSafe(active.fmt(last.y), true)}</Txt></View> : null}
      <View style={{ marginTop: SPACE.s }}>{active ? <LineChart points={points} fmt={active.fmt} scale={active.scale} minStep={active.minStep} intOnly={active.intOnly} steps={active.time ? TIME_STEPS : undefined} /> : null}</View>
    </View>
    {recRows.length ? <>
      <SectionTitle>{t('REKORDY')}</SectionTitle>
      <View testID="progress-records" style={{ backgroundColor: th.surface, borderRadius: RADIUS.group, paddingHorizontal: SPACE.l }}>
        {recRows.map(([l, v], i) => <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACE.m, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: th.line }}><Muted style={{ flexShrink: 1 }}>{l}</Muted><Txt maxFontSizeMultiplier={maxScale('stat')} style={{ ...font('sectionTitle'), fontVariant: ['tabular-nums'], flexShrink: 1, textAlign: 'right', marginLeft: SPACE.s }}>{monoSafe(v, true) /* A11-11 */}</Txt></View>)}
      </View></> : null}
    {bwNote ? <Muted style={{ ...font('footnote'), marginTop: SPACE.s - 2 }}>{bwNote}</Muted> : null}
    {/* wejście „Masa ciała — pomiary” jest raz na ekranie, w sekcji „Masa ciała” niżej (od ZM-06 wykres ćwiczenia i ta sekcja są na jednym ekranie) */}
  </>;
  const sessionsList = <>
        <H2 style={{ marginTop: SPACE.xl }}>{t('Sesje')}</H2>
        {[...sessions].reverse().slice(0, 20).map((s, i) => (
          <View key={i} testID={`session-row-${i}`} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: th.line }}>
            {/* M1-audytor-generalny-033: data w całości w pierwszym wierszu, podsumowanie pod nią (zawija się), odstęp 8 pt — zamiast rzędu „data | podsumowanie” */}
            <Txt testID={`session-date-${i}`} style={{ ...FW.semibold }}>{fmtDate(s.shown)}</Txt>
            <Muted testID={`session-summary-${i}`} style={{ marginTop: 8 }}>{t('najlepsza')} {setSummary(ex, s.bestSet)}{s.volume ? ` · ${t('obj.')} ${fmtVol(s.volume)}` : ''}{s.bestE1rm ? ` · e1RM ${fmtW(s.bestE1rm, false)}` : ''}</Muted>
            <Muted style={{ ...font('footnote'), marginTop: SPACE.xs }}>{s.sets.map(x => setSummary(ex, x)).join(' · ')}</Muted>
          </View>))}
      </>;
  return { top, sessions: sessionsList, empty: false };
}
