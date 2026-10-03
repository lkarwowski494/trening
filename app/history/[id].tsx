import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Muted, Btn, Txt, useOnce } from '@/components/ui';
import { beginEdit } from '@/lib/edit';
import { getState, useTick, exById, isBW, bandById, loadLabel, fmtDate, fmtTime, fmtDur, fmtSec, fmtDist, volume, deleteWorkout, groupLabels, shortBand, bandA11y, loadLabelShort, blockImpl, shownLoad } from '@/lib/store';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_MARK, SET_KIND_LABEL } from '@/lib/seed';
import { prMap } from '@/lib/stats';
import { useTheme } from '@/lib/theme';
import { t, exName } from '@/lib/i18n';
import { fmtW, fmtVol, fmtNum } from '@/lib/units';

export default function HistoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const th = useTheme(); const once = useOnce(); /* audyt (LOW): podwójne „Edytuj” nie otwiera dwóch edytorów */
  const w = getState().workouts.find(x => x.id === id); if (!w) return <Screen><Muted>{t('Brak sesji.')}</Muted></Screen>;
  const labels = groupLabels(w.exercises); const prs = prMap(w); let wn = 0; // numer serii roboczej
  const cell = (v: React.ReactNode, flex = 1) => <Txt style={{ flex, fontSize: 14, fontVariant: ['tabular-nums'] }}>{v}</Txt>;
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><H1>{w.templateName || t('Trening')}</H1></View><Btn title={t('Edytuj')} small accessibilityLabel={t('Edytuj sesję')} onPress={once(() => { if (beginEdit(w.id)) router.push(`/history/edit/${encodeURIComponent(w.id)}`); })} /></View>
      <Muted style={{ marginBottom: 14 }}>{fmtDate(w.startedAt)} {fmtTime(w.startedAt)} · {fmtDur(((w.finishedAt ?? w.startedAt) - w.startedAt) / 1000)}{volume(w) > 0 ? ` · ${t('objętość')} ${fmtVol(volume(w))}` : ''}</Muted>
      {w.note ? <Muted style={{ marginBottom: 10 }}>{w.note}</Muted> : null}
      {w.exercises.map((e, i) => { const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const rpe = getState().settings.showRpe; const anyBand = e.sets.some(s => s.bandId);
        // Nagłówki i komórki z tych samych warunków (wcześniej dla usuniętego ćwiczenia kolumny się rozjeżdżały).
        const showW = hasWeight(m);
        const impl = blockImpl(e, w.locationId); /* MEDIUM 2: blok na stacji — „kg/str.” (na stronę); runda 82b (LOW 4): zakończona sesja — zapisany przyrząd także bez miejsc (prawdziwy zapis wpisu na stronę; docs/10) */
        const heads = ['#', ...(showW ? [ex ? loadLabelShort(ex, impl) : t('ciężar')] : []), ...(hasReps(m) ? [t('pow.')] : []), ...(hasDistance(m) ? [t('dystans')] : []), ...(hasTime(m) ? [t('czas')] : []), ...(rpe ? ['RPE'] : []), ...(anyBand ? [t('guma')] : []), t('przerwa')];
        return (
        <View key={e.id ?? i} style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: th.line, paddingBottom: 8 }}>
          <Txt accessibilityRole="header" style={{ fontWeight: '600', fontSize: 17, marginBottom: 6 }}>{e.groupId ? <Txt style={{ color: th.band, fontWeight: '700' }}>{`SS ${labels[e.groupId]} · `}</Txt> : null}{exName(ex)}</Txt>
          <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{heads.map((h, k) => <Muted key={k} numberOfLines={1} style={{ flex: k === 0 ? 0.5 : 1, fontSize: 13, paddingRight: 6 }}>{h}</Muted>)}</View>
          {(() => { wn = 0; return null; })()}
          {e.sets.map((s) => { const vals: (string | number)[] = [s.kind === 'warmup' || s.warmup ? 'W' : `${++wn}${SET_KIND_MARK[s.kind ?? 'normal']}`, ...(showW ? [fmtW(shownLoad(ex, s), false)] : []) /* Q-018/83b: widok jak CSV i edytor (store.loadOf) — po zmianie sprzętu nie 0 */, ...(hasReps(m) ? [s.reps || 0] : []), ...(hasDistance(m) ? [fmtDist(Number(s.distanceM) || 0)] : []), ...(hasTime(m) ? [fmtSec(Number(s.durationSec) || 0)] : []), ...(rpe ? [s.rpe !== '' && s.rpe != null ? fmtNum(Number(s.rpe), 1) : '—'] : []), ...(anyBand ? [s.bandId ? (bandById(s.bandId) ? shortBand(bandById(s.bandId)) : '?') : '—'] : []), s.actualRest ? fmtDur(s.actualRest) : '—'];
            const kindK = s.kind === 'warmup' || s.warmup ? 'warmup' : (s.kind ?? 'normal'); const spoken = vals.map((v, k) => k === 0 && kindK !== 'normal' ? (kindK === 'warmup' ? t(SET_KIND_LABEL.warmup) : `${wn} ${t(SET_KIND_LABEL[kindK])}`) /* runda 59: litera W/D/F słownie */ : anyBand && k === vals.length - 2 && s.bandId && bandById(s.bandId) ? bandA11y(bandById(s.bandId)) : v); /* runda 52: pełna nazwa gumy */
            return (
            <View key={s.id}>
              {/* Runda 50: wiersz czytany przez VoiceOver jako całość „nagłówek: wartość” (wcześniej same liczby). */}
              <View accessible accessibilityLabel={heads.map((h, k) => `${k === 1 && showW && ex ? loadLabel(ex, impl) : h}: ${spoken[k]}`).join(', ')} style={{ flexDirection: 'row', paddingVertical: 4 }}>{vals.map((v, k) => <React.Fragment key={k}>{cell(v, k === 0 ? 0.5 : undefined)}</React.Fragment>)}</View>
              {prs.get(s.id) ? <Muted style={{ fontSize: 12, color: th.band, fontWeight: '700' }}>PR: {prs.get(s.id)!.map(k => t(k)).join(', ')}</Muted> : null}
              {s.note ? <Muted style={{ fontSize: 13 }}>{s.note}</Muted> : null}
            </View>); })}
        </View>); })}
      <Btn title={t('Usuń sesję')} kind="danger" onPress={() => Alert.alert(t('Usunąć tę sesję z historii?'), undefined, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { if (!getState().workouts.some(x => x.id === w.id)) return; /* runda 11: drugie potwierdzenie */ deleteWorkout(w.id); if (router.canGoBack()) router.back(); else router.replace('/history'); } }])} />
    </ScrollView></Screen>
  );
}
