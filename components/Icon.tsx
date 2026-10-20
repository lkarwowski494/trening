/* Własne ikony zamiast emoji w etykietach (M1-029; decyzja właściciela DEC-11, 19.10.2026): ten sam język rysunku co ikony zakładek
 * (components/TabIcon: siatka 24, linia 1,8, zaokrąglone zakończenia), kolor zawsze z motywu przez `color` — nigdy z systemowej czcionki emoji,
 * więc ikona jest czytelna w jasnym i ciemnym wyglądzie i przy „Zwiększ kontrast”. Ikona jest ozdobna: nazwę akcji niesie etykieta VoiceOver
 * przycisku, nie ikona (bez nazw emoji w odczycie). Zakres (✂ wyjęcie z supersetu to znak „✕ SS”, bez ikony): 📍 miejsce, ⏸/▶ pauza i wznowienie, ⏱ przerwa, 🎧/🔊/🔇 głos, „⋯” menu. */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { View, type ColorValue } from 'react-native';

export const ICON_NAMES = ['pin', 'pause', 'play', 'timer', 'headphones', 'speaker', 'speakerOff', 'more'] as const;
export type IconName = typeof ICON_NAMES[number];
/** Rozmiar ikony obok tekstu 14–16 pt (przyciski, chipy). */
export const ICON_INLINE = 16;
export function Icon({ name, color, size = ICON_INLINE }: { name: IconName; color: ColorValue; size?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const solid = { fill: color };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false} testID={`icon-${name}`}>
      {name === 'pin' ? <><Path {...p} d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><Circle {...p} cx={12} cy={10} r={2.3} /></> : null}
      {name === 'pause' ? <><Rect {...solid} x={6.5} y={4.5} width={3.8} height={15} rx={1.3} /><Rect {...solid} x={13.7} y={4.5} width={3.8} height={15} rx={1.3} /></> : null}
      {name === 'play' ? <Path {...solid} stroke={color} strokeWidth={1.8} strokeLinejoin="round" d="M8 5.5v13l10.5-6.5z" /> : null}
      {name === 'timer' ? <><Circle {...p} cx={12} cy={13.5} r={7} /><Path {...p} d="M12 13.5V9.5M9.5 3h5" /></> : null}
      {name === 'headphones' ? <><Path {...p} d="M4 15v-3a8 8 0 0 1 16 0v3" /><Rect {...p} x={3.5} y={14} width={4} height={6} rx={1.5} /><Rect {...p} x={16.5} y={14} width={4} height={6} rx={1.5} /></> : null}
      {name === 'speaker' || name === 'speakerOff' ? <Path {...p} d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /> : null}
      {name === 'speaker' ? <Path {...p} d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : null}
      {name === 'speakerOff' ? <Path {...p} d="M16 9.5l5 5M21 9.5l-5 5" /> : null}
      {name === 'more' ? <><Circle {...solid} cx={5.5} cy={12} r={1.8} /><Circle {...solid} cx={12} cy={12} r={1.8} /><Circle {...solid} cx={18.5} cy={12} r={1.8} /></> : null}
    </Svg>
  );
}

/** Ikona przed elementem tekstowym w jednym wierszu (np. „[pin] Dom”, „[pin] Siłownia”): zastępuje emoji wpisane w tekst. Ikona jest ozdobna;
 * nazwę elementu niesie jego własna etykieta VoiceOver. */
export function IconRow({ icon, color, size = ICON_INLINE, children, gap = 5 }: { icon: IconName; color: ColorValue; size?: number; children: React.ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap, flexShrink: 1 }}><Icon name={icon} color={color} size={size} />{children}</View>;
}
