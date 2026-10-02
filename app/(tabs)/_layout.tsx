import React, { useEffect, useState } from 'react';
import * as timer from '@/lib/timer';
import { fmtDur } from '@/lib/store';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/lib/theme';
import { t as tr } from '@/lib/i18n';
import { usePrefsTick } from '@/lib/store';

const icon = (ch: string) => ({ color }: { color: string }) => <Text style={{ fontSize: 20, color }}>{ch}</Text>;

export default function TabsLayout() {
  const t = useTheme(); usePrefsTick();
  // Pozostały czas przerwy jako plakietka na zakładce Trening — widoczny, gdy użytkownik jest na innej zakładce (audyt r1).
  const [, force] = useState(0);
  useEffect(() => { const u = timer.subscribe(() => force(x => x + 1)); const i = setInterval(() => { if (timer.T.on || timer.S.on) timer.tick(); /* runda 67: koniec przerwy (Live Activity, wibracja) także, gdy zakładka Trening nie jest zamontowana */ if (timer.T.on) force(x => x + 1); }, 1000); return () => { u(); clearInterval(i); }; }, []);
  const left = timer.T.on ? Math.round((timer.T.endAt - Date.now()) / 1000) : null;
  const badge = left == null ? undefined : left > 0 ? fmtDur(left) : '+' + fmtDur(-left); // po czasie: nadwyżka jak na pasku
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.line }, tabBarActiveTintColor: t.accent, tabBarInactiveTintColor: t.muted, sceneStyle: { backgroundColor: t.bg } }}>
      <Tabs.Screen name="index" options={{ title: tr('Trening'), tabBarIcon: icon('🏋️'), tabBarBadge: badge, tabBarAccessibilityLabel: badge ? `${tr('Trening')}, ${tr('przerwa {s}', { s: badge })}` : undefined /* runda 30: VoiceOver czyta przerwę */, tabBarBadgeStyle: { backgroundColor: t.accent, color: t.accentInk, fontSize: 11 } }} />
      <Tabs.Screen name="templates" options={{ title: tr('Szablony'), tabBarIcon: icon('📋') }} />
      <Tabs.Screen name="exercises" options={{ title: tr('Ćwiczenia'), tabBarIcon: icon('📚') }} />
      <Tabs.Screen name="history" options={{ title: tr('Historia'), tabBarIcon: icon('📈') }} />
      <Tabs.Screen name="more" options={{ title: tr('Więcej'), tabBarIcon: icon('⋯') }} />
    </Tabs>
  );
}
