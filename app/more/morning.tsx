import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen, Field, NumInput, Muted, Txt, H2 } from '@/components/ui';
import { getState, useTick, todayMorning, peekTodayMorning, localISODate, save } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { t, locale } from '@/lib/i18n';
import { wu, wField, wInKeep, fmtW, fmtNum } from '@/lib/units';

export default function Morning() {
  useTick(); const st = getState(); const th = useTheme();
  // Wpis powstaje dopiero przy pierwszej edycji (wcześniej samo wejście tworzyło pusty rekord).
  const cur = peekTodayMorning(); const today = localISODate(); const edit = (f: (m: ReturnType<typeof todayMorning>) => void) => { const m = todayMorning(); f(m); save(m); };
  const m = cur ?? { date: today, bb: '' as const, sleepScore: '' as const, sleepH: '' as const, weight: '' as const };
  const hist = [...st.mornings].filter(x => x.date !== today && [x.bb, x.weight, x.sleepScore, x.sleepH].some(v => v !== '' && v != null)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);
  const day = (iso: string) => { const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString(locale(), { day: 'numeric', month: 'short', ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' as const } : {}) }); }; // rok dla wpisów z poprzednich lat
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 10 }}>
      <Muted style={{ marginBottom: 10 }}>{new Date(m.date + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })}</Muted>
      <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Field label="Body Battery"><NumInput value={m.bb} onNum={v => edit(x => { x.bb = v === '' ? '' : Math.min(100, Math.max(0, Math.round(v))); })} /></Field></View><View style={{ flex: 1 }}><Field label={t('Sen (wynik)')}><NumInput value={m.sleepScore} onNum={v => edit(x => { x.sleepScore = v === '' ? '' : Math.min(100, Math.max(0, Math.round(v))); })} /></Field></View></View>
      <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Field label={t('Sen (godziny)')}><NumInput decimal value={m.sleepH} onNum={v => edit(x => { x.sleepH = v === '' ? '' : Math.min(24, Math.max(0, Math.round(v * 100) / 100)); })} /></Field></View><View style={{ flex: 1 }}><Field label={t('Waga ({u})', { u: wu() })}><NumInput weightTol decimal value={wField(m.weight)} stored={m.weight} onNum={(v, keep) => edit(x => { { const kg = v === '' ? 0 : Number(wInKeep(v, keep)); /* Q-021 */ x.weight = kg > 0 ? Math.min(1000, kg) : ''; } /* runda 54/55: limit i zero po przeliczeniu z lb */ /* runda 39: 0 = brak (jak w Ustawieniach) */ })} /></Field></View></View>
      {hist.length ? <><H2 style={{ marginTop: 16 }}>{t('Ostatnie')}</H2>{hist.map(x => <View key={x.date} style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: th.line }}><Txt style={{ flex: 1 }}>{day(x.date)}</Txt><Txt style={{ flex: 1 }}>BB {x.bb !== '' ? x.bb : '—'}</Txt><Txt style={{ flex: 1 }}>{t('sen')} {x.sleepScore !== '' ? x.sleepScore : (x.sleepH !== '' ? `${fmtNum(Number(x.sleepH), 1)} h` : '—')}</Txt><Txt style={{ flex: 1 }}>{x.weight !== '' ? fmtW(Number(x.weight)) : '—'}</Txt></View>)}</> : null}
    </ScrollView></Screen>
  );
}
