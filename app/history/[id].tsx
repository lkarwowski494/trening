import React from 'react';
import { View, Alert } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, H1, Muted, Btn, Txt, useOnce, monoSafe, Missing } from '@/components/ui';
import { DeleteButton } from '@/components/DeleteButton';
import { sessionDelete } from '@/components/sessionDelete';
import { beginEdit } from '@/lib/edit';
import { templateFromWorkout, pendingTemplateUpdate, applyPendingTemplateUpdate, templateDiffText } from '@/lib/tplsync';
import { effortLabel, effortText, workoutDurSec, noClock, whenText, getState, useTick, exById, isBW, bandById, loadLabel, loadOf, fmtDur, fmtSec, fmtDist, volume, deleteWorkout, groupLabels, ssTag, shortBand, bandA11y, loadLabelShort, blockImpl, shownLoad } from '@/lib/store';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL } from '@/lib/seed';
import { setMarkOf } from '@/lib/live';
import { earlyNote } from '@/lib/plan';
import { prMap, workoutPRs, prCountOf } from '@/lib/stats';
import { onSummaryShown } from '@/lib/review-run';
import { RecordsCard } from '@/components/RecordsCard';
import { IdeaLink } from '@/components/IdeaLink';
import { FairRulesSheet } from '@/components/FairRulesSheet';
import { SessionHealth } from '@/components/HealthLines';
import { useTheme, font, FW } from '@/lib/theme';
import { locationLabel } from '@/lib/locations';
import { t, exName, exNameLang, lang } from '@/lib/i18n';
import { fmtW, fmtVol, fmtNum } from '@/lib/units';
import { useAnnounce } from '@/lib/announce';

/** Brak wyniku w komórce serii (04-studio-projektowe-010): „—”, nigdy domyślne „0” — ten sam znak co przy RPE i przerwie. */
const NO_RESULT = '—';

export default function HistoryDetail() {
  const [tplSaved, setTplSaved] = React.useState(false); /* po „Zapisz zmiany w szablonie” — potwierdzenie zamiast przycisku */
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const th = useTheme(); const once = useOnce(); /* audyt (LOW): podwójne „Edytuj” nie otwiera dwóch edytorów */
  const w = getState().workouts.find(x => x.id === id); useAnnounce(tplSaved ? t('Szablon zaktualizowany.') : null);
  const [fairRules, setFairRules] = React.useState(false); /* 1.0: okno „Uczciwe zasady” po pierwszym treningu na żywo (raz, tylko free) */
  const [ideaLink, setIdeaLink] = React.useState(false); /* 0.20 (docs/34): link „Poproś o funkcję” co N-ty trening, tylko na podsumowaniu świeżo zakończonego treningu */
  React.useEffect(() => { const cur = getState().workouts.find(x => x.id === id); return cur ? onSummaryShown(cur, () => setIdeaLink(true), () => setFairRules(true)) : undefined; }, [id]); /* 0.17.0: tylko świeżo zakończony trening (markJustFinished) */
  /* karta rekordów (11.10.2026, pkt 7): liczba i statystyki z jednego workoutPRs (E3: prCountOf); liczone przy każdym renderze, jak prMap niżej */
  const wprs = w ? workoutPRs(w) : []; const nPR = prCountOf(wprs);
  if (!w) return <Screen><Missing>{t('Brak sesji.')}</Missing></Screen>;
  const labels = groupLabels(w.exercises); const prs = prMap(w); let wn = 0; // numer serii roboczej
  const cell = (v: React.ReactNode, flex = 1) => <Txt maxFontSizeMultiplier={1.3} /* jak wiersze serii w treningu (matrix-a11y, 06.10) */ style={{ flex, ...font('callout'), fontVariant: ['tabular-nums'] /* M3: kolumny liczb — callout + cyfry tabelaryczne */ }}>{monoSafe(v) /* A11-11 */}</Txt>;
  /* M3 p3 (układ 320 pt): kolumny „Guma” i „Przerwa” są szersze — „Διάλειμμα”, „Λάστιχο”, „Przerwa” nie są ucinane; te same szerokości w nagłówku i w komórkach */
  const colFlex = (k: number, n: number, band: boolean) => k === 0 ? 0.5 : k === n - 1 ? 1.5 : band && k === n - 2 ? 1.3 : 1;
  const del = sessionDelete(w);
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><H1>{w.templateName || t('Trening')}</H1></View><Btn title={t('Edytuj')} small accessibilityLabel={t('Edytuj sesję')} onPress={once(() => { if (beginEdit(w.id)) router.push(`/history/edit/${encodeURIComponent(w.id)}`); })} /></View>
      <Muted style={{ marginBottom: 14 }}>{whenText(w)} · {noClock(w) ? t('godzina nieznana') /* audyt 0.13: import bez godzin */ : fmtDur(workoutDurSec(w))}{volume(w) > 0 ? ` · ${t('objętość')} ${fmtVol(volume(w))}` : ''}{w.locationId ? ` · ${locationLabel(w.locationId)}` /* T-057 */ : ''}{w.deload ? ` · ${t('deload — mniej serii')}` /* audyt 0.10 (D1+) */ : ''}</Muted>
      <SessionHealth w={w} />{/* 0.16.0 (docs/29 5.7): tętno i aktywne kcal z treningu z zegarka (Apple Health) */}
      {nPR > 0 ? <RecordsCard count={nPR} prs={wprs} /> : null}
      {ideaLink ? <IdeaLink /> : null}
      <FairRulesSheet visible={fairRules} onClose={() => setFairRules(false)} />
      {earlyNote(w.id) ? <Muted style={{ marginBottom: 10, ...font('footnote') }}>{earlyNote(w.id)}</Muted> : null}{/* docs/18 pkt 4 (11.10.2026): trening policzony do wcześniejszego dnia planu */}
      {w.healthPending && !w.healthUUID ? <Muted style={{ marginBottom: 10, ...font('footnote') }}>{t('Nie zapisano jeszcze w Apple Health — zapis zostanie ponowiony przy następnym uruchomieniu aplikacji.')}</Muted> : null}{/* audyt 0.10 J2 */}
      {w.note ? <Muted style={{ marginBottom: 10 }}>{w.note}</Muted> : null}
      {/* 8A (11.10.2026): zamiast okna „Zaktualizować szablon?” po „Zakończ” — przycisk, tylko gdy trening różnił się od szablonu i szablon istnieje */}
      {(() => { const pu = pendingTemplateUpdate(w.id); if (pu) return <View style={{ marginBottom: 10 }}><Btn title={t('Zapisz zmiany w szablonie')} small accessibilityHint={templateDiffText(pu.diff)} style={{ alignSelf: 'flex-start' }} onPress={once(() => { if (applyPendingTemplateUpdate(w.id)) setTplSaved(true); })} /><Muted style={{ ...font('footnote'), marginTop: 4 }}>{templateDiffText(pu.diff)}</Muted></View>; return tplSaved ? <Muted style={{ marginBottom: 10, ...font('footnote') }}>{t('Szablon zaktualizowany.')}</Muted> : null; })()}
      {/* H5 (audyt 0.10, wariant B): nowy szablon ze składu sesji — tylko na polecenie użytkownika (decyzja 03.10.2026: aplikacja sama szablonów nie tworzy) */}
      {w.exercises.some(e => { const x = exById(e.exerciseId); return x && !x.archived; }) ? <Btn title={t('Zapisz jako szablon')} small kind="ghost" accessibilityHint={t('Nowy szablon z ćwiczeniami i seriami tej sesji.')} style={{ alignSelf: 'flex-start', marginBottom: 12 }} onPress={once(() => { const tpl = templateFromWorkout(w); router.push(`/template/${tpl.id}`); })} /> : null}
      {w.exercises.map((e, i) => { const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const rpe = getState().settings.showRpe; const anyBand = e.sets.some(s => s.bandId);
        // Nagłówki i komórki z tych samych warunków (wcześniej dla usuniętego ćwiczenia kolumny się rozjeżdżały).
        const showW = hasWeight(m);
        const impl = blockImpl(e, w.locationId); /* MEDIUM 2: blok na stacji — „kg/str.” (na stronę); runda 82b (LOW 4): zakończona sesja — zapisany przyrząd także bez miejsc (prawdziwy zapis wpisu na stronę; docs/10) */
        const heads = ['#', ...(showW ? [ex ? loadLabelShort(ex, impl) : t('ciężar')] : []), ...(hasReps(m) ? [t('Pow.')] : []), ...(hasDistance(m) ? ['m'] : []), ...(hasTime(m) ? [t('Czas')] : []), ...(rpe ? [effortLabel()] : []), ...(anyBand ? [t('Guma')] : []), t('Przerwa')];
        return (
        <View key={e.id ?? i} style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: th.line, paddingBottom: 8 }}>
          <Txt a11yLang={exNameLang(ex)} accessibilityRole="header" style={{ ...font('sectionTitle'), marginBottom: 6 }}>{e.groupId ? <Txt style={{ color: th.band, ...font('sectionTitle') }}>{`${ssTag(labels[e.groupId])} · `}</Txt> : null}{exName(ex)}</Txt>
          <View style={{ flexDirection: 'row' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{heads.map((h, k) => <Muted key={k} numberOfLines={1} adjustsFontSizeToFit style={{ flex: colFlex(k, heads.length, anyBand), ...font('caption'), paddingRight: 6 }}>{h}</Muted>)}</View>
          {e.sets.map((s, si) => { const mk = setMarkOf(e.sets.map(x => x.kind === 'warmup' || x.warmup ? 'warmup' : x.kind), si); wn = parseInt(mk, 10) || 0; /* audyt 0.10 (LIVE-14): numeracja jak w treningu — drop set z numerem swojej serii */ const vals: (string | number)[] = [mk, ...(showW ? [loadOf(ex, s).raw === '' ? NO_RESULT : fmtW(shownLoad(ex, s), false)] : []) /* Q-018/83b: widok jak CSV i edytor (store.loadOf) — po zmianie sprzętu nie 0 */, ...(hasReps(m) ? [s.reps || NO_RESULT] : []), ...(hasDistance(m) ? [Number(s.distanceM) ? fmtDist(Number(s.distanceM)) : NO_RESULT] : []), ...(hasTime(m) ? [Number(s.durationSec) ? fmtSec(Number(s.durationSec)) : NO_RESULT] : []), ...(rpe ? [s.rpe !== '' && s.rpe != null ? effortText(Number(s.rpe)) : NO_RESULT] : []), ...(anyBand ? [s.bandId ? (bandById(s.bandId) ? shortBand(bandById(s.bandId)) : '?') : NO_RESULT] : []), s.actualRest ? fmtSec(s.actualRest) : NO_RESULT];
            const kindK = s.kind === 'warmup' || s.warmup ? 'warmup' : (s.kind ?? 'normal'); const spoken = vals.map((v, k) => k === 0 && kindK !== 'normal' ? (kindK === 'warmup' ? t(SET_KIND_LABEL.warmup) : `${wn} ${t(SET_KIND_LABEL[kindK])}`) /* runda 59: litera W/D/F słownie */ : anyBand && k === vals.length - 2 && s.bandId && bandById(s.bandId) ? bandA11y(bandById(s.bandId)) : v); /* runda 52: pełna nazwa gumy */
            return (
            <View key={s.id}>
              {/* Runda 50: wiersz czytany przez VoiceOver jako całość „nagłówek: wartość” (wcześniej same liczby). */}
              <View accessibilityLanguage={lang()} accessible accessibilityLabel={heads.map((h, k) => `${k === 1 && showW && ex ? loadLabel(ex, impl) : h}: ${spoken[k]}`).join(', ')} style={{ flexDirection: 'row', paddingVertical: 4 }}>{vals.map((v, k) => <React.Fragment key={k}>{cell(v, colFlex(k, vals.length, anyBand))}</React.Fragment>)}</View>
              {prs.get(s.id) ? <Muted style={{ ...font('footnote'), color: th.band, ...FW.semibold }}>PR: {prs.get(s.id)!.map(k => t(k)).join(', ')}</Muted> : null}
              {s.note ? <Muted style={font('footnote')}>{s.note}</Muted> : null}
            </View>); })}
        </View>); })}
      {/* M3 p3 (ZM-04, W2): „Usuń sesję” na dole — to samo okno co gest przesunięcia na liście, z dopiskiem o kopii w Zdrowiu; po usunięciu wracamy do listy */}
      <DeleteButton label={t('Usuń sesję')} title={del.title} message={del.message} onDelete={() => { deleteWorkout(w.id); if (router.canGoBack()) router.back(); else router.replace('/history'); }} />
    </ScrollView></Screen>
  );
}
