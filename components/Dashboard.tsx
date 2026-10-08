import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Muted, Txt, SectionTitle, Item } from '@/components/ui';
import { useTheme, F } from '@/lib/theme';
import { fmtDate, fmtDur, getState, useTick } from '@/lib/store';
import { weekTiles, lastWorkout, firstSteps } from '@/lib/dashboard';
import { fmtVol } from '@/lib/units';
import { t, tp } from '@/lib/i18n';

/* Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A) — dane: lib/dashboard.ts. */
function Tile({ label, value, prev }: { label: string; value: string; prev: string }) {
  const th = useTheme();
  return (
    <View accessible accessibilityLabel={t('{label}: {v}, poprzedni tydzień {p}', { label, v: value, p: prev })} style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt maxFontSizeMultiplier={1.4} style={{ fontFamily: F.heavy, fontSize: 20 }}>{value}</Txt>
      <Muted style={{ fontSize: 12 }}>{label}</Muted>
      <Muted style={{ fontSize: 11, marginTop: 2 }}>{t('poprz.: {v}', { v: prev })}</Muted>
    </View>);
}
const hm = (sec: number) => { const m = Math.round(sec / 60); return m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`; };

/** Kafelki tygodnia i ostatni trening (od pierwszego zakończonego treningu). */
export function WeekStats() {
  useTick(); const router = useRouter(); const w = weekTiles(); const last = lastWorkout(); if (!last) return null;
  return <>
    <SectionTitle>{t('Ten tydzień')}</SectionTitle>
    <View testID="week-tiles" style={{ flexDirection: 'row', gap: 8 }}>
      <Tile label={t('Treningi')} value={w.planned != null ? `${w.workouts} / ${w.planned}` : String(w.workouts)} prev={String(w.prev.workouts)} />
      <Tile label={t('Serie')} value={String(w.sets)} prev={String(w.prev.sets)} />
      <Tile label={t('Czas')} value={hm(w.durationSec)} prev={hm(w.prev.durationSec)} />
    </View>
    {w.planned != null ? <Muted style={{ fontSize: 11, marginTop: 4 }}>{t('Treningi: zrobione / zaplanowane w tym tygodniu.')}</Muted> : null}
    <SectionTitle>{t('Ostatni trening')}</SectionTitle>
    <Item title={last.name || t('Trening')} sub={[fmtDate(last.startedAt), fmtDur(last.durationSec), `${last.sets} ${tp(last.sets, 'seria|serie|serii')}`, fmtVol(last.volume), ...(last.prs ? [`${last.prs} ${tp(last.prs, 'rekord|rekordy|rekordów')}`] : [])].join(' · ')} onPress={() => router.push(`/history/${last.id}`)} />
  </>;
}

/** Nowa osoba: trzy kroki do pierwszego treningu (znikają po pierwszym zakończonym treningu). */
export function FirstSteps() {
  useTick(); const router = useRouter(); const th = useTheme(); const f = firstSteps(); if (!f) return null;
  const live = getState().templates.some(x => !x.archived);
  const step = (done: boolean, n: number, text: string, actions?: React.ReactNode) => (
    <View key={n} accessible={!actions} accessibilityLabel={`${n}. ${text} ${done ? t('zrobione') : t('do zrobienia')}`} style={{ flexDirection: 'row', gap: 10, paddingVertical: 8 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? th.accent : 'transparent', borderWidth: done ? 0 : 1.5, borderColor: th.line }}>
        <Txt style={{ fontSize: 12, fontFamily: F.semibold, color: done ? th.accentInk : th.muted }}>{done ? '✓' : String(n)}</Txt>
      </View>
      <View style={{ flex: 1, gap: 6 }}><Txt style={{ fontSize: 14, color: done ? th.muted : th.text }}>{text}</Txt>{actions}</View>
    </View>);
  return (
    <View testID="first-steps" style={{ marginTop: 6, padding: 12, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line }}>
      <Txt accessibilityRole="header" style={{ fontFamily: F.semibold, fontSize: 17 }}>{t('Pierwsze kroki')}</Txt>
      {step(f.template, 1, t('Utwórz szablon („+ Nowy szablon” niżej) albo wygeneruj szablony i plan.'), !f.template ? <Btn small title={t('Wygeneruj szablony i plan')} onPress={() => router.push('/generator')} style={{ alignSelf: 'flex-start' }} /> : undefined)}
      {step(f.plan, 2, t('Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.'), !f.plan ? <Btn small title={t('Plan tygodnia')} onPress={() => router.push('/plan')} style={{ alignSelf: 'flex-start' }} /> : undefined)}
      {step(false, 3, live ? t('Pierwszy raz? Wybierz szablon niżej, wpisz ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. Szablony i ćwiczenia zmienisz w zakładkach obok.') : t('Pierwszy raz? Utwórz swój szablon („+ Nowy szablon” niżej) albo zacznij pusty trening. Wpisuj ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”.'))}
    </View>);
}
