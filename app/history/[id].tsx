import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Muted, Btn, Txt, useOnce, monoSafe } from '@/components/ui';
import { beginEdit } from '@/lib/edit';
import { templateFromWorkout } from '@/lib/tplsync';
import { wallTs, effortLabel, effortOut, workoutDurSec, getState, useTick, exById, isBW, bandById, loadLabel, fmtDate, fmtTime, fmtDur, fmtSec, fmtDist, volume, deleteWorkout, groupLabels, shortBand, bandA11y, loadLabelShort, blockImpl, shownLoad } from '@/lib/store';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL } from '@/lib/seed';
import { setMarkOf } from '@/lib/live';
import { prMap } from '@/lib/stats';
import { useTheme, F } from '@/lib/theme';
import { t, exName, lang } from '@/lib/i18n';
import { fmtW, fmtVol, fmtNum } from '@/lib/units';

export default function HistoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const th = useTheme(); const once = useOnce(); /* audyt (LOW): podwójne „Edytuj” nie otwiera dwóch edytorów */
  const w = getState().workouts.find(x => x.id === id); if (!w) return <Screen><Muted>{t('Brak sesji.')}</Muted></Screen>;
  const labels = groupLabels(w.exercises); const prs = prMap(w); let wn = 0; // numer serii roboczej
  const cell = (v: React.ReactNode, flex = 1) => <Txt maxFontSizeMultiplier={1.3} /* jak wiersze serii w treningu (matrix-a11y, 06.10) */ style={{ flex, fontSize: 14, fontFamily: F.mono }}>{monoSafe(v) /* A11-11 */}</Txt>;
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><H1>{w.templateName || t('Trening')}</H1></View><Btn title={t('Edytuj')} small accessibilityLabel={t('Edytuj sesję')} onPress={once(() => { if (beginEdit(w.id)) router.push(`/history/edit/${encodeURIComponent(w.id)}`); })} /></View>
      <Muted style={{ marginBottom: 14 }}>{fmtDate(wallTs(w))} {fmtTime(wallTs(w))} · {fmtDur(workoutDurSec(w))}{volume(w) > 0 ? ` · ${t('objętość')} ${fmtVol(volume(w))}` : ''}{w.deload ? ` · ${t('deload — mniej serii')}` /* audyt 0.10 (D1+) */ : ''}</Muted>
      {w.healthPending && !w.healthUUID ? <Muted style={{ marginBottom: 10, fontSize: 13 }}>{t('Nie zapisano jeszcze w Apple Health — ponowię przy następnym uruchomieniu aplikacji.')}</Muted> : null}{/* audyt 0.10 J2 */}
      {w.note ? <Muted style={{ marginBottom: 10 }}>{w.note}</Muted> : null}
      {/* H5 (audyt 0.10, wariant B): nowy szablon ze składu sesji — tylko na polecenie użytkownika (decyzja 03.10.2026: aplikacja sama szablonów nie tworzy) */}
      {w.exercises.some(e => { const x = exById(e.exerciseId); return x && !x.archived; }) ? <Btn title={t('Zapisz jako szablon')} small kind="ghost" accessibilityHint={t('Nowy szablon z ćwiczeniami i seriami tej sesji.')} style={{ alignSelf: 'flex-start', marginBottom: 12 }} onPress={once(() => { const tpl = templateFromWorkout(w); router.push(`/template/${tpl.id}`); })} /> : null}
      {w.exercises.map((e, i) => { const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const rpe = getState().settings.showRpe; const anyBand = e.sets.some(s => s.bandId);
        // Nagłówki i komórki z tych samych warunków (wcześniej dla usuniętego ćwiczenia kolumny się rozjeżdżały).
        const showW = hasWeight(m);
        const impl = blockImpl(e, w.locationId); /* MEDIUM 2: blok na stacji — „kg/str.” (na stronę); runda 82b (LOW 4): zakończona sesja — zapisany przyrząd także bez miejsc (prawdziwy zapis wpisu na stronę; docs/10) */
        const heads = ['#', ...(showW ? [ex ? loadLabelShort(ex, impl) : t('ciężar')] : []), ...(hasReps(m) ? [t('pow.')] : []), ...(hasDistance(m) ? [t('dystans')] : []), ...(hasTime(m) ? [t('czas')] : []), ...(rpe ? [effortLabel()] : []), ...(anyBand ? [t('guma')] : []), t('przerwa')];
        return (
        <View key={e.id ?? i} style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: th.line, paddingBottom: 8 }}>
          <Txt accessibilityRole="header" style={{ fontFamily: F.semibold, fontSize: 17, marginBottom: 6 }}>{e.groupId ? <Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[e.groupId]} · `}</Txt> : null}{exName(ex)}</Txt>
          <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{heads.map((h, k) => <Muted key={k} numberOfLines={1} adjustsFontSizeToFit style={{ flex: k === 0 ? 0.5 : 1, fontSize: 13, paddingRight: 6 }}>{h}</Muted>)}</View>
          {e.sets.map((s, si) => { const mk = setMarkOf(e.sets.map(x => x.kind === 'warmup' || x.warmup ? 'warmup' : x.kind), si); wn = parseInt(mk, 10) || 0; /* audyt 0.10 (LIVE-14): numeracja jak w treningu — drop set z numerem swojej serii */ const vals: (string | number)[] = [mk, ...(showW ? [fmtW(shownLoad(ex, s), false)] : []) /* Q-018/83b: widok jak CSV i edytor (store.loadOf) — po zmianie sprzętu nie 0 */, ...(hasReps(m) ? [s.reps || 0] : []), ...(hasDistance(m) ? [fmtDist(Number(s.distanceM) || 0)] : []), ...(hasTime(m) ? [fmtSec(Number(s.durationSec) || 0)] : []), ...(rpe ? [s.rpe !== '' && s.rpe != null ? fmtNum(effortOut(Number(s.rpe)), 1) : '—'] : []), ...(anyBand ? [s.bandId ? (bandById(s.bandId) ? shortBand(bandById(s.bandId)) : '?') : '—'] : []), s.actualRest ? fmtDur(s.actualRest) : '—'];
            const kindK = s.kind === 'warmup' || s.warmup ? 'warmup' : (s.kind ?? 'normal'); const spoken = vals.map((v, k) => k === 0 && kindK !== 'normal' ? (kindK === 'warmup' ? t(SET_KIND_LABEL.warmup) : `${wn} ${t(SET_KIND_LABEL[kindK])}`) /* runda 59: litera W/D/F słownie */ : anyBand && k === vals.length - 2 && s.bandId && bandById(s.bandId) ? bandA11y(bandById(s.bandId)) : v); /* runda 52: pełna nazwa gumy */
            return (
            <View key={s.id}>
              {/* Runda 50: wiersz czytany przez VoiceOver jako całość „nagłówek: wartość” (wcześniej same liczby). */}
              <View accessibilityLanguage={lang()} accessible accessibilityLabel={heads.map((h, k) => `${k === 1 && showW && ex ? loadLabel(ex, impl) : h}: ${spoken[k]}`).join(', ')} style={{ flexDirection: 'row', paddingVertical: 4 }}>{vals.map((v, k) => <React.Fragment key={k}>{cell(v, k === 0 ? 0.5 : undefined)}</React.Fragment>)}</View>
              {prs.get(s.id) ? <Muted style={{ fontSize: 12, color: th.band, fontFamily: F.semibold }}>PR: {prs.get(s.id)!.map(k => t(k)).join(', ')}</Muted> : null}
              {s.note ? <Muted style={{ fontSize: 13 }}>{s.note}</Muted> : null}
            </View>); })}
        </View>); })}
    </ScrollView></Screen>
  );
}
