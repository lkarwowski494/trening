import React, { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, PanResponder, Platform, ScrollView, Text, View, type PanResponderInstance, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';

/*
 * T-010 (02.10.2026): lista z przeciąganiem za uchwyt „≡”. Bez nowych modułów natywnych — PanResponder + Animated z RN
 * (transformacje na natywnym sterowniku, JS liczy tylko indeks docelowy). Wiersze mogą mieć różną wysokość (superset to
 * jeden wysoki wiersz). VoiceOver nie przeciąga — uchwyt ma akcje „Przesuń wyżej / niżej”. Lista w DragScroll przewija się
 * sama, gdy palec z przeciąganym wierszem dojdzie do krawędzi ekranu.
 */
const NATIVE = Platform.OS !== 'web';
const EDGE = 56; const STEP = 10;

/** Indeks, na który trafi wiersz `from` przesunięty o `dy`: zamiana, gdy przednia krawędź przeciąganego wiersza minie
 * połowę sąsiada (niezależnie od wysokości przeciąganego — wysoki superset nie przeskakuje od razu ani zbyt późno). */
export function dropIndex(heights: number[], from: number, dy: number): number {
  if (from < 0 || from >= heights.length || !Number.isFinite(dy)) return from;
  let to = from;
  if (dy > 0) { let acc = 0; for (let k = from + 1; k < heights.length; k++) { if (dy > acc + heights[k] / 2) to = k; else break; acc += heights[k]; } }
  else if (dy < 0) { let acc = 0; for (let k = from - 1; k >= 0; k--) { if (-dy > acc + heights[k] / 2) to = k; else break; acc += heights[k]; } }
  return to;
}

type ScrollApi = { offset: () => number; lock: (on: boolean) => void; edge: (pageY: number) => -1 | 0 | 1; step: (dir: number) => number };
const ScrollCtx = createContext<ScrollApi | null>(null);

/** ScrollView, który przewija się podczas przeciągania przy krawędzi i nie przewija się pod palcem trzymającym wiersz. */
export function DragScroll({ children, contentContainerStyle }: { children: React.ReactNode; contentContainerStyle?: StyleProp<ViewStyle> }) {
  const ref = useRef<ScrollView>(null); const y = useRef(0); const box = useRef({ top: 0, h: 0 }); const content = useRef(0); const [locked, setLocked] = useState(false);
  const api = useMemo<ScrollApi>(() => ({
    offset: () => y.current,
    lock: on => { setLocked(on); if (on) (ref.current as any)?.measureInWindow?.((_x: number, top: number, _w: number, h: number) => { if (h > 0) box.current = { top, h }; }); },
    edge: pageY => { const { top, h } = box.current; if (!(h > 2 * EDGE)) return 0; return pageY < top + EDGE ? -1 : pageY > top + h - EDGE ? 1 : 0; },
    step: dir => { const max = Math.max(0, content.current - box.current.h); const ny = Math.max(0, Math.min(max, y.current + dir * STEP)); const d = ny - y.current; if (d) { y.current = ny; ref.current?.scrollTo({ y: ny, animated: false }); } return d; },
  }), []);
  return <ScrollCtx.Provider value={api}>
    <ScrollView ref={ref} scrollEnabled={!locked} scrollEventThrottle={16} onScroll={e => { y.current = e.nativeEvent.contentOffset.y; }} onContentSizeChange={(_w, h) => { content.current = h; }}
      onLayout={e => { box.current = { ...box.current, h: e.nativeEvent.layout.height }; }} contentContainerStyle={contentContainerStyle}>{children}</ScrollView>
  </ScrollCtx.Provider>;
}

const haptic = (kind: 'pick' | 'tick') => { if (Platform.OS === 'web') return; (kind === 'pick' ? Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle?.Light) : Haptics.selectionAsync?.())?.catch?.(() => {}); };

type Props<T> = {
  items: T[]; keyOf: (x: T) => string; /** nazwa dla VoiceOver */ label: (x: T) => string;
  /** upuszczenie: klucz przesuniętego wiersza i jego nowy indeks; false = nic się nie zmieniło */ onMove: (key: string, to: number) => boolean | void;
  renderItem: (x: T, handle: React.ReactNode, dragging: boolean) => React.ReactNode;
};
export function DragList<T>({ items, keyOf, label, onMove, renderItem }: Props<T>) {
  const th = useTheme(); const sc = useContext(ScrollCtx);
  const keys = items.map(keyOf); const sig = keys.join('|');
  const heights = useRef(new Map<string, number>()); const anim = useRef(new Map<string, Animated.Value>());
  const av = (k: string) => { let v = anim.current.get(k); if (!v) { v = new Animated.Value(0); anim.current.set(k, v); } return v; };
  const [active, setActive] = useState<string | null>(null);
  const d = useRef({ key: null as string | null, from: -1, to: -1, keys: [] as string[], hs: [] as number[], dy: 0, scroll0: 0, dir: 0, timer: null as ReturnType<typeof setInterval> | null, reset: false });
  const latest = useRef({ keys, onMove, n: items.length }); latest.current = { keys, onMove, n: items.length };

  const shift = (to: number) => { const s = d.current; const h = s.hs[s.from] ?? 0;
    s.keys.forEach((k, i) => { if (i === s.from) return; const v = s.from < i && i <= to ? -h : to <= i && i < s.from ? h : 0; Animated.timing(av(k), { toValue: v, duration: 120, useNativeDriver: NATIVE }).start(); }); };
  const update = () => { const s = d.current; if (!s.key) return; const total = s.dy + (sc ? sc.offset() - s.scroll0 : 0); av(s.key).setValue(total);
    const to = dropIndex(s.hs, s.from, total); if (to !== s.to) { s.to = to; shift(to); haptic('tick'); } };
  const stopAuto = () => { const s = d.current; if (s.timer) clearInterval(s.timer); s.timer = null; s.dir = 0; };
  const fns = useRef({ begin: (_k: string) => {}, move: (_dy: number, _y: number) => {}, end: (_c: boolean) => {} });
  fns.current = {
    begin: k => { const s = d.current; if (s.key) return; const ks = latest.current.keys; const from = ks.indexOf(k); if (from < 0) return;
      Object.assign(s, { key: k, from, to: from, keys: ks, hs: ks.map(x => heights.current.get(x) ?? 0), dy: 0, scroll0: sc?.offset() ?? 0, reset: false });
      sc?.lock(true); setActive(k); haptic('pick'); },
    move: (dy, pageY) => { const s = d.current; if (!s.key) return; s.dy = dy; update();
      const dir = sc?.edge(pageY) ?? 0; s.dir = dir;
      if (dir && !s.timer && sc) s.timer = setInterval(() => { if (!d.current.dir) return; if (sc.step(d.current.dir)) update(); }, 16);
      else if (!dir) stopAuto(); },
    end: commit => { const s = d.current; stopAuto(); if (!s.key) return; const { key, from, to } = s; s.key = null; sc?.lock(false); setActive(null);
      if (commit && to !== from) { s.reset = true; if (latest.current.onMove(key, to) !== false) return; /* zera po przerysowaniu w nowej kolejności — bez mignięcia starej */ s.reset = false; }
      s.keys.forEach(k => av(k).setValue(0)); },
  };
  /* Po upuszczeniu (nowa kolejność już narysowana) albo gdy lista zmieniła się pod palcem — przesunięcia wracają do zera. */
  useLayoutEffect(() => { const s = d.current;
    if (s.key && s.keys.join('|') !== sig) fns.current.end(false);
    if (s.reset) { s.reset = false; anim.current.forEach(v => v.setValue(0)); } }, [sig]);
  useLayoutEffect(() => () => { stopAuto(); if (d.current.key) sc?.lock(false); /* audyt: lista znika pod palcem — przewijanie wraca */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const responders = useRef(new Map<string, PanResponderInstance>());
  const responder = (k: string) => { let r = responders.current.get(k); if (!r) { r = PanResponder.create({
    onStartShouldSetPanResponder: () => true, onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false, onShouldBlockNativeResponder: () => true,
    onPanResponderGrant: () => fns.current.begin(k), onPanResponderMove: (_e, g) => fns.current.move(g.dy, g.moveY),
    onPanResponderRelease: () => fns.current.end(true), onPanResponderTerminate: () => fns.current.end(false),
  }); responders.current.set(k, r); } return r; };

  return <View>{items.map((x, i) => { const k = keys[i]; const nm = label(x); const dragging = active === k;
    const acts = [i > 0 ? { name: 'up', label: t('Przesuń wyżej') } : null, i < items.length - 1 ? { name: 'down', label: t('Przesuń niżej') } : null].filter(Boolean) as { name: string; label: string }[];
    const handle = <View accessibilityLanguage={lang()} {...responder(k).panHandlers} testID={'drag-' + k} accessible accessibilityRole="adjustable" accessibilityLabel={t('Zmień kolejność: {name}', { name: nm })}
      accessibilityValue={{ text: t('{n} z {all}', { n: i + 1, all: items.length }) }} accessibilityActions={[...acts, ...acts.map(a => ({ name: a.name === 'up' ? 'decrement' : 'increment' }))]}
      onAccessibilityAction={e => { const n = e.nativeEvent.actionName; const to = n === 'up' || n === 'decrement' ? i - 1 : n === 'down' || n === 'increment' ? i + 1 : i; if (to !== i && to >= 0 && to < items.length && latest.current.onMove(k, to) !== false) AccessibilityInfo.announceForAccessibility?.(t('{n} z {all}', { n: to + 1, all: latest.current.n })); }}
      hitSlop={6} style={{ width: 40, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Text accessibilityLanguage={lang()} style={{ color: dragging ? th.accent : th.muted, fontSize: 22, lineHeight: 24 }} maxFontSizeMultiplier={1.3}>≡</Text></View>;
    return <Animated.View key={k} onLayout={e => { heights.current.set(k, e.nativeEvent.layout.height); }}
      style={{ transform: [{ translateY: av(k) }], zIndex: dragging ? 10 : 0, ...(dragging ? { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } : null) }}>
      {renderItem(x, handle, dragging)}</Animated.View>; })}</View>;
}
