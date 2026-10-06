import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Muted, Txt, Chip, Input, Empty, H2 } from '@/components/ui';
import { useTick, exById, setSummary, fmtDate, fmtSec, fmtDist, isBW, getState } from '@/lib/store';
import { sessionsFor, recordsFor, hasHistory, chartKeysFor, totalKind, fmtTotal, weeklyTotals, hasAnyHistory, weeklySetsByMuscle, weeklyVolumeByMuscle, thisMonday, type ChartKey } from '@/lib/stats';
import { MUSCLES } from '@/lib/seed';
import { LineChart, BarChart, TIME_STEPS } from '@/components/Chart';
import { useTheme, F } from '@/lib/theme';
import { hasWeight, hasReps, hasTime, hasDistance } from '@/lib/seed';
import { t, exName, locale, fold } from '@/lib/i18n';
import { fmtW, fmtVol, volOut, wu, fmtNum } from '@/lib/units';

/*
 * Postępy (T-030): bez wybranego ćwiczenia — tygodniowa objętość i serie; z ćwiczeniem — wykres wybranej
 * metryki per sesja (max ciężar / e1RM Epley / objętość / max pow. / czas / dystans), rekordy i lista sesji.
 */
export default function Progress() {
  const { ex: exParam } = useLocalSearchParams<{ ex?: string }>(); useTick(); const th = useTheme();
  const [exId, setExId] = useState(exParam ?? ''); const [q, setQ] = useState(''); const [key, setKey] = useState<ChartKey | ''>('');
  useEffect(() => { if (exParam) { setExId(exParam); setKey(''); } }, [exParam]); /* runda 54: link przy otwartym ekranie */
  const ex = exId ? exById(exId) : undefined;
  // Ćwiczenia z historią najpierw (runda 2: wcześniej 30 pierwszych alfabetycznie, bez informacji o reszcie).
  const withHist = (e: { id: string }) => hasHistory(e.id); /* runda 74: bez liczenia sesji każdego ćwiczenia */
  // Także usunięte (zarchiwizowane) ćwiczenia z historią — okno usuwania obiecuje, że wykresy zostają (runda 4).
  const pool = getState().exercises.filter(e => !e.archived || withHist(e));
  const ql = fold(q.trim()); // runda 6: spacja na końcu nie gubi wyników
  const all = pool.filter(e => !ql || fold(e.name).includes(ql) || fold(exName(e)).includes(ql)).sort((a, b) => Number(withHist(b)) - Number(withHist(a)) || exName(a).localeCompare(exName(b), locale()));
  const opts = all.slice(0, 40);
  const short = (ts: number) => new Date(ts).toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
  // Runda 14: etykiety osi wykresu z rokiem, gdy nie bieżący (wykres ponad rok: „29 wrz 2025 … 29 wrz”).
  const shortY = (ts: number) => new Date(ts).getFullYear() !== new Date().getFullYear() ? new Date(ts).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : short(ts);

  if (!ex) {
    const weeks = weeklyTotals(8); const any = hasAnyHistory();
    return (
      <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
        {any ? <>
          <H2>{t('Objętość tygodniowo ({u})', { u: wu() })}</H2>
          <BarChart bars={weeks.map(w => ({ label: short(w.weekStart), value: volOut(w.volume) }))} fmt={v => v >= 1000 ? `${fmtNum(v / 1000, 1)}k` : `${v}`} />
          <H2 style={{ marginTop: 14 }}>{t('Serie robocze tygodniowo')}</H2>
          <BarChart bars={weeks.map(w => ({ label: short(w.weekStart), value: w.sets }))} fmt={v => `${v}`} height={110} />
          <Muted style={{ fontSize: 12, marginTop: 4, marginBottom: 14 }}>{t('Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza.')}</Muted>
          <H2>{t('Serie per partia — ten tydzień vs poprzedni')}</H2>
          <MuscleCompare cur={weeklySetsByMuscle(thisMonday())} prev={weeklySetsByMuscle(thisMonday(-1))} fmt={v => fmtNum(v, 1)} />
          <Muted style={{ fontSize: 12, marginTop: 4, marginBottom: 14 }}>{t('Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia.')}</Muted>
          <H2>{t('Objętość per partia ({u}) — ten tydzień vs poprzedni', { u: wu() })}</H2>
          <MuscleCompare cur={weeklyVolumeByMuscle(thisMonday())} prev={weeklyVolumeByMuscle(thisMonday(-1))} fmt={v => { const x = volOut(v); return x >= 10000 ? `${fmtNum(x / 1000, 1)}k` : fmtNum(Math.round(x)); }} />
          <Muted style={{ fontSize: 12, marginTop: 4, marginBottom: 14 }}>{t('Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą.')}</Muted>
        </> : <Empty>{t('Wykresy pojawią się po pierwszym zakończonym treningu.')}</Empty>}
        <H2 style={{ marginTop: 8 }}>{t('Ćwiczenie')}</H2>
        <Input value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} maxLength={80} autoCorrect={false} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>{opts.map(e => <Chip key={e.id} label={exName(e) + (e.archived ? ` (${t('usunięte')})` : '')} on={false} onPress={() => { setExId(e.id); setKey(''); }} />)}</View>
        {!opts.length ? <Muted style={{ fontSize: 13, marginTop: 6 }}>{t('Nic nie pasuje.')}</Muted> : null}
        {all.length > opts.length ? <Muted style={{ fontSize: 12, marginTop: 6 }}>{t('Pokazano {n} z {m} — wpisz nazwę, by zawęzić.', { n: opts.length, m: all.length })}</Muted> : null}
      </ScrollView></Screen>
    );
  }

  const sessions = sessionsFor(ex); const rec = recordsFor(ex); const keys = chartKeysFor(ex);
  // Runda 12: domyślnie pierwszy wykres, który ma dane (np. „max pow.” dla pompek bez dociążenia i bez masy ciała).
  const active = keys.find(k => k.key === key) ?? keys.find(k => sessions.some(s => s[k.key] !== 0)) ?? keys[0];
  const points = active ? sessions.filter(s => s[active.key] !== 0 || (active.key === 'maxLoad' && isBW(ex) && s.hasLoad)).map(s => ({ x: s.date, y: s[active.key], get label() { return shortY(s.date); } /* runda 74: data formatowana tylko dla punktów, które ją pokazują (pierwszy, ostatni, najlepszy) */ })) : []; /* runda 61/62: ±0 z wykonanej serii to wynik; sesja bez wykonanej serii — brak punktu */ /* runda 61: masa ciała bez asysty (±0) to wynik — dzień bez gumy */ // asysta (ujemne ±) też jest wynikiem
  const m = ex.metric ?? 'weight_reps'; const kg = (v: number) => fmtW(v);
  const recRows: [string, string][] = [];
  /* Runda 73: rekord = suma na treningu (pierwszy wiersz) + e1RM; pozostałe wiersze to maksima informacyjne */
  { const tk = totalKind(ex); if (tk && rec.bestTotal > 0) recRows.push([tk === 'objętość treningu' ? t('Najlepszy trening (objętość)') : tk === 'suma powtórzeń' ? t('Najwięcej powtórzeń na treningu') : tk === 'łączny czas' ? t('Najdłużej łącznie na treningu') : t('Najdłuższy dystans na treningu'), fmtTotal(ex, rec.bestTotal)]); }
  if (rec.bestE1rm) recRows.push([isBW(ex) ? t('e1RM (dociążenie)') : ex.loadMode === 'per_dumbbell' ? t('e1RM (Epley, per hantel)') : ex.loadMode === 'unilateral' ? t('e1RM (Epley, na stronę)') : 'e1RM (Epley)', kg(rec.bestE1rm)]); /* runda 59 */
  if (hasWeight(m) && rec.maxLoad) recRows.push([isBW(ex) ? t('Max dociążenie') : (ex.loadMode === 'per_dumbbell' ? t('Max ciężar (per hantel)') : ex.loadMode === 'unilateral' ? t('Max ciężar (na stronę)') : t('Max ciężar')), kg(rec.maxLoad)]);
  if (rec.bestSetVolume) recRows.push([t('Najlepsza seria (objętość)'), fmtVol(rec.bestSetVolume)]);
  if (hasReps(m) && isBW(ex)) { /* T7: jak próg rekordu — bez asysty osobno, z asystą tylko gdy więcej */ if (rec.maxRepsFree) recRows.push([t('Max powtórzeń bez asysty'), `${rec.maxRepsFree}`]); if (rec.maxReps > rec.maxRepsFree) recRows.push([t('Max powtórzeń z asystą'), `${rec.maxReps}`]); }
  else if (hasReps(m) && rec.maxReps) recRows.push([t('Max powtórzeń w serii'), `${rec.maxReps}`]);
  if (hasTime(m) && m !== 'distance_time' && rec.maxDuration) recRows.push([t('Najdłuższa seria'), fmtSec(rec.maxDuration)]);
  if (hasDistance(m) && rec.maxDistance) recRows.push([t('Najdłuższy dystans'), fmtDist(rec.maxDistance)]);

  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}>
      <Chip label={`${exName(ex)}  ✕`} a11yLabel={exName(ex)} a11yHint={t('Tapnij, by wybrać inne ćwiczenie.')} on onPress={() => setExId('')} />
      {sessions.length ? <>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>{keys.map(k => <Chip key={k.key} label={k.label} on={active?.key === k.key} onPress={() => setKey(k.key)} />)}</View>
        <View style={{ marginTop: 10 }}>{active ? <LineChart points={points} fmt={active.fmt} scale={active.scale} minStep={active.minStep} intOnly={active.intOnly} steps={active.time ? TIME_STEPS : undefined} /> : null}</View>
        {recRows.length ? <View style={{ marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: th.surface2, gap: 6 }}>
          <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{t('REKORDY')}</Muted>
          {recRows.map(([l, v]) => <View key={l} style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Muted>{l}</Muted><Txt style={{ fontFamily: F.monoBold }}>{v}</Txt></View>)}
        </View> : null}
        <H2 style={{ marginTop: 16 }}>{t('Sesje')}</H2>
        {[...sessions].reverse().slice(0, 20).map((s, i) => (
          <View key={i} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: th.line }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt style={{ fontFamily: F.semibold }}>{fmtDate(s.date)}</Txt><Muted>{t('najlepsza')} {setSummary(ex, s.bestSet)}{s.volume ? ` · ${t('obj.')} ${fmtVol(s.volume)}` : ''}{s.bestE1rm ? ` · e1RM ${fmtW(s.bestE1rm, false)}` : ''}</Muted></View>
            <Muted style={{ fontSize: 13 }}>{s.sets.map(x => setSummary(ex, x)).join(' · ')}</Muted>
          </View>))}
      </> : <Empty>{t('Brak zapisanych sesji z tym ćwiczeniem.')}</Empty>}
    </ScrollView></Screen>
  );
}

/** Porównanie partii: ten tydzień (pasek) vs poprzedni (liczba w nawiasie) — serie albo objętość (06.10.2026). */
function MuscleCompare({ cur, prev, fmt }: { cur: Record<string, number>; prev: Record<string, number>; fmt: (v: number) => string }) {
  const th = useTheme(); const rows = MUSCLES.filter(mu => (cur[mu] ?? 0) > 0 || (prev[mu] ?? 0) > 0); const max = Math.max(1, ...rows.map(mu => Math.max(cur[mu] ?? 0, prev[mu] ?? 0)));
  if (!rows.length) return <Muted style={{ fontSize: 13 }}>{t('Brak serii w tym i poprzednim tygodniu.')}</Muted>;
  return <>{rows.map(mu => (
    <View key={mu} style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt style={{ fontSize: 14 }}>{t(mu)}</Txt><Muted style={{ fontSize: 13, fontFamily: F.mono }}>{fmt(cur[mu] ?? 0)} <Muted style={{ fontSize: 12 }}>({t('poprz.')} {fmt(prev[mu] ?? 0)})</Muted></Muted></View>
      <View style={{ height: 6, backgroundColor: th.line, borderRadius: 3, marginTop: 4 }}><View style={{ width: `${Math.round(100 * (cur[mu] ?? 0) / max)}%`, height: 6, backgroundColor: th.accent, borderRadius: 3 }} /></View>
    </View>))}</>;
}
