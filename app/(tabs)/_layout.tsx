import React, { useEffect, useState } from 'react';
import * as timer from '@/lib/timer';
import { fmtDur } from '@/lib/store';
import { Tabs } from 'expo-router/js-tabs'; // router 57: `Tabs` z głównego 'expo-router' przestarzałe (ten sam komponent)
import { type ColorValue } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { t as tr } from '@/lib/i18n';
import { usePrefsTick } from '@/lib/store';

// SDK 56: zakładki expo-router (fork React Navigation) podają kolor jako ColorValue, nie string — Text przyjmuje oba.
const icon = (name: TabIconName) => ({ color }: { color: ColorValue }) => <TabIcon name={name} color={color} />;

export default function TabsLayout() {
  const t = useTheme(); usePrefsTick();
  // Pozostały czas przerwy jako plakietka na zakładce Trening — widoczny, gdy użytkownik jest na innej zakładce (audyt r1).
  const [, force] = useState(0);
  useEffect(() => { const u = timer.subscribe(() => force(x => x + 1)); const i = setInterval(() => { if (timer.T.on || timer.S.on) timer.tick(); /* runda 67: koniec przerwy (Live Activity, wibracja) także, gdy zakładka Trening nie jest zamontowana */ if (timer.T.on) force(x => x + 1); }, 1000); return () => { u(); clearInterval(i); }; }, []);
  const left = timer.T.on ? Math.round((timer.T.endAt - Date.now()) / 1000) : null;
  // Test na symulatorze iOS (02.10.2026): plakietka mieści ok. 2–3 znaki — „2:28” było ucinane do „2:…”. Na plakietce skrót
  // (2m / 45s, po czasie +1m), pełny czas czyta VoiceOver i pokazuje pasek przerwy na ekranie treningu.
  const short = (sec: number) => sec >= 60 ? `${Math.floor(sec / 60)}m` : `${sec}s`;
  const full = left == null ? undefined : left > 0 ? fmtDur(left) : '+' + fmtDur(-left); // po czasie: nadwyżka jak na pasku
  const badge = left == null ? undefined : left > 0 ? short(left) : '+' + short(-left);
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.line }, tabBarActiveTintColor: t.accent, tabBarInactiveTintColor: t.muted, tabBarLabelStyle: { fontFamily: F.semibold }, sceneStyle: { backgroundColor: t.bg } }}>
      <Tabs.Screen name="index" options={{ title: tr('Trening'), tabBarIcon: icon('workout'), tabBarBadge: badge, tabBarAccessibilityLabel: full ? `${tr('Trening')}, ${tr('przerwa {s}', { s: full })}` : undefined /* runda 30: VoiceOver czyta przerwę */, tabBarBadgeStyle: { backgroundColor: t.accent, color: t.accentInk, fontSize: 11 } }} />
      <Tabs.Screen name="templates" options={{ title: tr('Szablony'), tabBarIcon: icon('templates') }} />
      <Tabs.Screen name="exercises" options={{ title: tr('Ćwiczenia'), tabBarIcon: icon('exercises') }} />
      <Tabs.Screen name="history" options={{ title: tr('Historia'), tabBarIcon: icon('history') }} />
      <Tabs.Screen name="more" options={{ title: tr('Więcej'), tabBarIcon: icon('more') }} />
    </Tabs>
  );
}
