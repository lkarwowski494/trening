import React, { useEffect, useRef, useState } from 'react';
import * as timer from '@/lib/timer';
import { fmtDur } from '@/lib/store';
import { Tabs } from 'expo-router/js-tabs';
import { PlatformPressable } from 'expo-router/react-navigation'; // router 57: `Tabs` z głównego 'expo-router' przestarzałe (ten sam komponent)
import { AccessibilityInfo, type ColorValue } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { TabIcon, TabLabel, type TabIconName } from '@/components/TabIcon';
import { t as tr, lang } from '@/lib/i18n';
import { usePrefsTick } from '@/lib/store';
import { PlanReminderSync } from '@/components/PlanReminderSync';

// SDK 56: zakładki expo-router (fork React Navigation) podają kolor jako ColorValue, nie string — Text przyjmuje oba.
const icon = (name: TabIconName) => ({ color }: { color: ColorValue }) => <TabIcon name={name} color={color} />;
const label = ({ color, position, children }: { focused: boolean; color: ColorValue; position: 'beside-icon' | 'below-icon'; children: string }) => <TabLabel color={color} position={position}>{children}</TabLabel>;

/** Plakietka i etykieta VoiceOver pozostałej przerwy. Test na symulatorze iOS (02.10.2026): plakietka mieści ok. 2–3 znaki — „2:28” było ucinane
 * do „2:…”. Na plakietce skrót (2′ / 45″, po czasie +1′; A11-17), pełny czas czyta VoiceOver i pokazuje pasek przerwy na ekranie treningu.
 * `key` — to, co widać (PERF-06): plakietka, a przy VoiceOver także pełny czas. */
function restBadge(screenReader: boolean): { badge?: string; full?: string; key: string } {
  const left = timer.T.on ? Math.round((timer.T.endAt - Date.now()) / 1000) : null; if (left == null) return { key: '' };
  /* A11-17: znaki minuty ′ i sekundy ″ (2′, 45″) — bez liter, więc bez tłumaczenia; „2m” czytało się też jak metry */
  const short = (sec: number) => sec >= 60 ? `${Math.floor(sec / 60)}′` : `${sec}″`;
  const full = left > 0 ? fmtDur(left) : '+' + fmtDur(-left); // po czasie: nadwyżka jak na pasku
  const badge = left > 0 ? short(left) : '+' + short(-left);
  return { badge, full, key: screenReader ? `${badge}|${full}` : badge };
}

export default function TabsLayout() {
  const t = useTheme(); usePrefsTick();
  // Pozostały czas przerwy jako plakietka na zakładce Trening — widoczny, gdy użytkownik jest na innej zakładce (audyt r1).
  /* Audyt 0.10 (PERF-06): całe zakładki przerysowują się tylko wtedy, gdy zmienia się to, co widać — tekst plakietki (raz na minutę, w ostatniej minucie
   * co sekundę), a przy włączonym VoiceOver także pełny czas w etykiecie zakładki (co sekundę, jak dotąd). Wcześniej — co sekundę zawsze. */
  const [, force] = useState(0); const shown = useRef(''); const sr = useRef(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(v => { sr.current = !!v; }).catch(() => {}); const a11y = AccessibilityInfo.addEventListener('screenReaderChanged', v => { sr.current = !!v; force(x => x + 1); });
    const u = timer.subscribe(() => force(x => x + 1));
    const i = setInterval(() => { if (timer.T.on || timer.S.on) timer.tick(); /* runda 67: koniec przerwy (Live Activity, wibracja) także, gdy zakładka Trening nie jest zamontowana */ if (timer.T.on && restBadge(sr.current).key !== shown.current) force(x => x + 1); }, 1000);
    return () => { u(); clearInterval(i); a11y?.remove?.(); };
  }, []);
  const { badge, full, key } = restBadge(sr.current); shown.current = key;
  return (<>
    <PlanReminderSync />{/* 08.10.2026: przypomnienie o treningu z planu */}
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.line }, tabBarActiveTintColor: t.accent, tabBarInactiveTintColor: t.muted, tabBarLabel: label /* A11-03 */, tabBarButton: p => <PlatformPressable {...p} accessibilityLanguage={lang()} /> /* A11-09: przycisk zakładki czytany głosem języka aplikacji */, sceneStyle: { backgroundColor: t.bg } }}>
      <Tabs.Screen name="index" options={{ title: tr('Trening'), tabBarIcon: icon('workout'), tabBarBadge: badge, tabBarAccessibilityLabel: full ? `${tr('Trening')}, ${tr('przerwa {s}', { s: full })}` : undefined /* runda 30: VoiceOver czyta przerwę */, tabBarBadgeStyle: { backgroundColor: t.accent, color: t.accentInk, fontSize: 11, fontFamily: F.semibold /* audyt 0.10 (UI-11) */ } }} />
      <Tabs.Screen name="templates" options={{ title: tr('Szablony'), tabBarIcon: icon('templates') }} />
      <Tabs.Screen name="exercises" options={{ title: tr('Ćwiczenia'), tabBarIcon: icon('exercises') }} />
      <Tabs.Screen name="history" options={{ title: tr('Kalendarz') /* 08.10.2026: Historia → Kalendarz (decyzja 1A) */, tabBarIcon: icon('history') }} />
      <Tabs.Screen name="more" options={{ title: tr('Więcej'), tabBarIcon: icon('more') }} />
    </Tabs>
  </>);
}
