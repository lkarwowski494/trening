import React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse, Path, G, Defs, Pattern, Rect, Line, Circle, Polygon, Text as SvgText } from 'react-native-svg';
import { useTheme, type Theme, FW } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { PARTS, mixHex, type View as Side } from '@/lib/musclemap';
import { guardWord, type GuardDir, type GuardPart } from '@/lib/guard';
import { Muted } from '@/components/ui';

/*
 * Strażnik progresji — wspólne elementy graficzne (specyfikacja 14.10.2026): sylwetka w kolorach PROGRESU per partia, znak stanu i legenda.
 * Każdy stan ma znak i słowo, nie tylko kolor: więcej ▲ (akcent) · tyle samo = (przygaszony) · mniej ▼ (pomarańcz neutralny `less`, kreskowanie 45°) ·
 * bez porównania ? (kropkowanie) · bez serii ○ (obrys przerywany) · nowe + (kropki w odcieniu akcentu) · deload (poziome paski). Kolory neutralne — bez „ostrzeżenia”.
 */
/** Znak stanu jako tekst (w zdaniach i wierszach). */
export const SIGN_CHAR = { up: '▲', same: '=', down: '▼' } as const;

type Fill = { fill: string; stroke?: string; dash?: string };
/** Kolor wypełnienia stanu (bez wzorów): znak (SignChip) i legenda. */
const flat = (d: GuardDir, th: Theme): Fill => {
  switch (d) {
    case 'up': return { fill: th.accent };
    case 'same': return { fill: mixHex(th.surface2, th.muted, 0.4) };
    case 'down': return { fill: th.less };
    case 'new': return { fill: mixHex(th.surface2, th.accent, 0.5) };
    case 'unknown': case 'deload': return { fill: th.surface2, stroke: th.muted };
    default: return { fill: 'none', stroke: th.muted, dash: '2.5 2' };
  }
};

/** Mały znak stanu (kwadrat ze znakiem) — rysowany w SVG, więc nie zależy od krojów pisma; ukryty przed VoiceOver (stan czyta słowo obok). */
export function SignChip({ dir, size = 18 }: { dir: GuardDir; size?: number }) {
  const th = useTheme(); const f = flat(dir, th); const ink = th.accentInk; const line = th.text;
  const glyph = dir === 'up' ? <Polygon points="9,4.5 13.5,12.5 4.5,12.5" fill={ink} />
    : dir === 'down' ? <Polygon points="9,13.5 4.5,5.5 13.5,5.5" fill={ink} />
    : dir === 'same' ? <G><Line x1="4.5" y1="7.5" x2="13.5" y2="7.5" stroke={line} strokeWidth="1.6" /><Line x1="4.5" y1="10.5" x2="13.5" y2="10.5" stroke={line} strokeWidth="1.6" /></G>
    : dir === 'unknown' ? <SvgText x="9" y="13" textAnchor="middle" fontFamily={FW.semibold.fontFamily} fontWeight={FW.semibold.fontWeight} fontSize="12" fill={line}>?</SvgText>
    : dir === 'new' ? <G><Line x1="9" y1="5" x2="9" y2="13" stroke={line} strokeWidth="1.6" /><Line x1="5" y1="9" x2="13" y2="9" stroke={line} strokeWidth="1.6" /></G>
    : dir === 'deload' ? <G><Line x1="4.5" y1="6.5" x2="13.5" y2="6.5" stroke={th.muted} strokeWidth="1.4" /><Line x1="4.5" y1="9" x2="13.5" y2="9" stroke={th.muted} strokeWidth="1.4" /><Line x1="4.5" y1="11.5" x2="13.5" y2="11.5" stroke={th.muted} strokeWidth="1.4" /></G>
    : <Circle cx="9" cy="9" r="3.4" fill="none" stroke={th.muted} strokeWidth="1.3" />;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 18 18"><Rect x=".75" y=".75" width="16.5" height="16.5" rx="4.5" fill={f.fill} stroke={f.stroke} strokeWidth={f.stroke ? 1 : 0} strokeDasharray={f.dash} />{glyph}</Svg>
    </View>);
}

/** Legenda stanów: pełne słowa, zawija się do drugiej linii (i dalej przy dużej czcionce); „nowe” tylko, gdy jakaś partia jest nowa. */
export function GuardLegend({ parts, testID = 'guard-legend' }: { parts: readonly GuardPart[]; testID?: string }) {
  const items: Exclude<GuardDir, 'deload'>[] = ['up', 'same', 'down', 'unknown', 'none']; if (parts.some(p => p.dir === 'new')) items.splice(4, 0, 'new');
  return (
    <View testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 12, rowGap: 4, marginTop: 8 }}>
      {items.map(d => <View key={d} testID={`${testID}-${d}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><SignChip dir={d} size={14} /><Muted style={{ fontSize: 12 }}>{guardWord(d)}</Muted></View>)}
    </View>);
}

/** Sylwetka przód + tył (kształty z lib/musclemap.ts) w kolorach progresu per partia. Obraz z jedną etykietą dla VoiceOver (`label`). */
export function GuardMap({ parts, label, height = 170, testID = 'guard-map' }: { parts: readonly GuardPart[]; label: string; height?: number; testID?: string }) {
  const th = useTheme(); const uid = React.useId().replace(/\W/g, ''); const dir = (m: string): GuardDir => parts.find(p => p.part === m)?.dir ?? 'none';
  const same = mixHex(th.surface2, th.muted, 0.4); const fillOf = (d: GuardDir): Fill => d === 'up' ? { fill: th.accent } : d === 'same' ? { fill: same } : d === 'down' ? { fill: `url(#h${uid})` } : d === 'unknown' ? { fill: `url(#o${uid})` }
    : d === 'new' ? { fill: `url(#n${uid})` } : d === 'deload' ? { fill: `url(#d${uid})` } : { fill: th.surface2, stroke: th.muted, dash: '2.5 2' };
  const side = (view: Side, dx: number) => (
    <G key={view}>{PARTS.filter(p => p.view === view).map((p, i) => {
      const f: Fill = p.muscle == null ? { fill: th.surface2, stroke: th.line } : fillOf(dir(p.muscle)); const common = { fill: f.fill, stroke: f.stroke, strokeWidth: f.stroke ? (p.muscle == null ? 0.8 : 1) : 0, strokeDasharray: f.dash, testID: p.muscle ? `${testID}-${p.muscle}-${dir(p.muscle)}` : undefined };
      return p.shapes.map((s, j) => 'e' in s
        ? <Ellipse key={`${i}-${j}`} cx={s.e[0] + dx} cy={s.e[1]} rx={s.e[2]} ry={s.e[3]} {...common} />
        : <Path key={`${i}-${j}`} d={s.d} translateX={dx} {...common} />);
    })}</G>);
  return (
    <View accessibilityLanguage={lang()} testID={testID} accessible accessibilityRole="image" accessibilityLabel={label} style={{ marginTop: 12 }}>
      <View style={{ alignItems: 'center' }}>
        <Svg width="100%" height={height} viewBox="0 0 250 260" preserveAspectRatio="xMidYMid meet">
          <Defs>
            <Pattern id={`h${uid}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><Rect width="6" height="6" fill={th.less} /><Line x1="0" y1="0" x2="0" y2="6" stroke={th.surface} strokeWidth="2.4" strokeOpacity="0.75" /></Pattern>
            <Pattern id={`o${uid}`} patternUnits="userSpaceOnUse" width="5" height="5"><Rect width="5" height="5" fill={th.surface2} /><Circle cx="2.5" cy="2.5" r="1" fill={th.muted} /></Pattern>
            <Pattern id={`n${uid}`} patternUnits="userSpaceOnUse" width="5" height="5"><Rect width="5" height="5" fill={mixHex(th.surface2, th.accent, 0.5)} /><Circle cx="2.5" cy="2.5" r="1" fill={th.bg} /></Pattern>
            <Pattern id={`d${uid}`} patternUnits="userSpaceOnUse" width="6" height="5"><Rect width="6" height="5" fill={th.surface2} /><Line x1="0" y1="2.5" x2="6" y2="2.5" stroke={th.muted} strokeWidth="1.2" /></Pattern>
          </Defs>
          {side('front', 0)}{side('back', 130)}
        </Svg>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 2 }}>
        <Muted style={{ fontSize: 12 }}>{t('Przód')}</Muted><Muted style={{ fontSize: 12 }}>{t('Tył')}</Muted>
      </View>
    </View>);
}
