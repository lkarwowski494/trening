import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Appearance, Easing, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ICON_BAR, ICON_VIEWBOX, iconColors, type IconRect, type IconScheme } from '@/lib/brandIcon';
import { INTRO, INTRO_MOVE_MS, introMode, introPieces, pieceOffset } from '@/lib/intro';

/**
 * Animacja przy zimnym starcie (decyzja właściciela 09.10.2026; liczby i reguły — lib/intro.ts): na gryf z ekranu startowego wsuwają się
 * talerze i zacisk, aż powstanie ikona aplikacji; potem nakładka znika i widać aplikację.
 * - Bez mignięcia: ekran startowy iOS (expo-splash-screen, tryb pełnoekranowy „contain”) to obraz 120 × 120 jednostek rozciągnięty na
 *   szerokość ekranu i wyśrodkowany w pionie, na tle w kolorze motywu systemu. Nakładka rysuje ten sam kwadrat w tym samym miejscu, w tym samym
 *   motywie (motyw SYSTEMU z chwili startu — jak ekran startowy, nie z ustawień aplikacji), a pierwsza klatka to sam gryf. Ekran startowy
 *   chowamy dopiero dwie klatki po zamontowaniu nakładki, a ruch rusza po schowaniu.
 * - Ruch w wątku natywnym (useNativeDriver) — ładowanie danych w JS go nie przycina; dane ładują się równolegle (app/_layout.tsx).
 * - Koniec: ruch trwa INTRO_MOVE_MS; gdy dane gotowe — zniknięcie (INTRO.fadeMs); gdy nie — ostatnia klatka (ikona) zostaje do końca ładowania.
 * - Tapnięcie pomija: od razu ikona, a gdy dane gotowe — od razu aplikacja.
 * - „Ogranicz ruch” (albo brak odpowiedzi systemu): bez animacji — nakładka znika od razu, ekran startowy chowa expo-router z aplikacją.
 * - VoiceOver: grafika dekoracyjna, ukryta (accessibilityElementsHidden); pominięcie tapnięciem bez etykiety — animacja trwa ok. 1 s, a treść
 *   pod spodem jest w tym czasie ukryta dla VoiceOver (app/_layout.tsx), więc nie ma czego czytać ani w co trafić.
 * `frame` — statyczna klatka w chwili `frame` ms (bez ruchu i bez chowania ekranu startowego): podgląd klatek i testy.
 */
export function Intro({ ready, onDone, scheme, frame }: { ready: boolean; onDone: () => void; scheme?: IconScheme; frame?: number }) {
  const [sch] = useState<IconScheme>(() => scheme ?? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'));
  const win = useWindowDimensions(); const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const W = box?.w ?? win.width; const H = box?.h ?? win.height; const s = W / ICON_VIEWBOX;
  const pieces = useRef(introPieces()).current;
  /* postęp elementu 0 → 1 (już po krzywej), przesunięcie = interpolacja liniowa — w klatce statycznej ta sama wartość co pieceOffset */
  const prog = useRef(pieces.map(p => new Animated.Value(1 - pieceOffset(p, frame ?? 0) / INTRO.fromRight))).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [moved, setMoved] = useState(false); const [skipped, setSkipped] = useState(false);
  const doneRef = useRef(false); const onDoneRef = useRef(onDone); onDoneRef.current = onDone;
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDoneRef.current(); } };

  useEffect(() => {
    if (frame != null) return;
    let alive = true; let raf = 0; const timers: ReturnType<typeof setTimeout>[] = [];
    new Promise<boolean | null>(res => {
      timers.push(setTimeout(() => res(null), INTRO.reduceMotionWaitMs));
      AccessibilityInfo.isReduceMotionEnabled().then(v => res(!!v), () => res(null));
    }).then(rm => {
      if (!alive) return;
      if (introMode(rm) === 'none') { finish(); return; }
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => {
        if (!alive) return;
        SplashScreen.hideAsync().catch(() => {});
        Animated.parallel(prog.map((v, i) => Animated.timing(v, { toValue: 1, duration: INTRO.slideMs, delay: pieces[i].delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }))).start();
        timers.push(setTimeout(() => { if (!alive) return; prog.forEach(v => v.setValue(1)); /* dokładnie ostatnia klatka (ikona), nawet gdy ruch się spóźnił */ setMoved(true); }, INTRO_MOVE_MS));
      }); });
    });
    return () => { alive = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (frame != null || !ready || !(moved || skipped)) return;
    if (skipped) { finish(); return; }
    Animated.timing(opacity, { toValue: 0, duration: INTRO.fadeMs, useNativeDriver: true }).start();
    const t = setTimeout(finish, INTRO.fadeMs); return () => clearTimeout(t);
  }, [ready, moved, skipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const skip = () => { if (frame != null || skipped) return; prog.forEach(v => { v.stopAnimation(); v.setValue(1); }); setSkipped(true); };
  const c = iconColors(sch);
  const rect = (r: IconRect) => ({ position: 'absolute' as const, left: r.x * s, top: r.y * s, width: r.w * s, height: r.h * s, borderRadius: r.rx * s });
  return (
    <Animated.View testID="intro" accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      onLayout={e => { const { width, height } = e.nativeEvent.layout; if (width > 0 && height > 0) setBox({ w: width, h: height }); }}
      style={[StyleSheet.absoluteFill, { backgroundColor: c.bg, opacity, overflow: 'hidden' }]}>
      <Pressable testID="intro-skip" accessible={false} onPressIn={skip} style={StyleSheet.absoluteFill}>
        <View testID="intro-icon" style={{ position: 'absolute', left: 0, top: (H - W) / 2, width: W, height: W }}>
          <View testID="intro-bar" style={[rect(ICON_BAR), { backgroundColor: c.ink }]} />
          {pieces.map((p, i) => <Animated.View key={i} testID={`intro-piece-${i}`}
            style={[rect(p), { backgroundColor: p.fill === 'ink' ? c.ink : c.plate[p.fill], transform: [{ translateX: prog[i].interpolate({ inputRange: [0, 1], outputRange: [INTRO.fromRight * s, 0] }) }] }]} />)}
        </View>
      </Pressable>
    </Animated.View>
  );
}
