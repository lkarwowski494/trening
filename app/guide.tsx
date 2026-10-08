import React, { useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Muted, Txt, Btn } from '@/components/ui';
import { useTheme, F, NUM_SCALE_MAX } from '@/lib/theme';
import { useTick } from '@/lib/store';
import { GUIDE, guideSeen, guideProgress, markGuideSeen } from '@/lib/guide';
import { t, lang } from '@/lib/i18n';

/* Przewodnik (decyzja właściciela 08.10.2026, wariant A): tematy rozwijane w miejscu, kroki, „Pokaż” otwiera ekran; przeczytane — ✓. Treść: lib/guide.ts. */
export default function GuideScreen() {
  useTick(); const router = useRouter(); const th = useTheme(); const [open, setOpen] = useState<string | null>(null);
  const seen = guideSeen(); const p = guideProgress();
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Muted style={{ fontSize: 13, marginBottom: 4 }}>{t('Najważniejsze funkcje w kilku krokach. „Pokaż” otwiera opisany ekran.')}</Muted>
      <Muted style={{ fontSize: 13, marginBottom: 10 }}>{t('Przeczytane: {n} z {m}', { n: p.seen, m: p.total })}</Muted>
      {GUIDE.map(g => { const on = open === g.id; const done = seen.includes(g.id); return (
        <View key={g.id} testID={`guide-${g.id}`} style={{ marginBottom: 8, borderRadius: 10, borderWidth: 1, borderColor: th.line, backgroundColor: th.surface }}>
          <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityState={{ expanded: on }} accessibilityLabel={`${g.title()}, ${done ? t('przeczytane') : t('nieprzeczytane')}`}
            onPress={() => { if (!on) markGuideSeen(g.id); setOpen(on ? null : g.id); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, minHeight: 48 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? th.accent : 'transparent', borderWidth: done ? 0 : 1.5, borderColor: th.line }}>
              {done ? <Txt maxFontSizeMultiplier={NUM_SCALE_MAX} /* A11-07: znak w kółku 22–24 pt */ style={{ color: th.accentInk, fontSize: 12, fontFamily: F.semibold }}>✓</Txt> : null}
            </View>
            <Txt style={{ flex: 1, fontFamily: F.semibold }}>{g.title()}</Txt>
            <Muted>{on ? '▾' : '▸'}</Muted>
          </Pressable>
          {on ? <View style={{ paddingHorizontal: 12, paddingBottom: 12, gap: 6 }}>
            {g.steps().map((s, i) => <Txt key={i} style={{ fontSize: 14 }}>{`${i + 1}. ${s}`}</Txt>)}
            <Btn small kind="primary" title={t('Pokaż')} accessibilityLabel={t('Pokaż: {name}', { name: g.title() })} onPress={() => router.push(g.route as never)} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          </View> : null}
        </View>); })}
    </ScrollView></Screen>
  );
}
