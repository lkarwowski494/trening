import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { PlateBar } from '@/components/PlateBar';
import { bandHex, type EquipVis } from '@/lib/equipvis';
import { bandA11y } from '@/lib/store';
import { t as tr } from '@/lib/i18n';
import { fmtW } from '@/lib/units';

/*
 * Grafika sprzętu na karcie „teraz” (07.10.2026, docs/18; logika: lib/equipvis.ts). Każda grafika ma jeden podpis, który jest też etykietą
 * VoiceOver — liczba nigdy nie jest tylko na rysunku. Kolor gumy z nazwy (bandHex), nieznana nazwa — szary pasek z nazwą.
 */
export function EquipVisual({ v }: { v: EquipVis }) {
  const t = useTheme();
  const caption = (s: string) => <Text maxFontSizeMultiplier={1.3} style={{ color: t.muted, fontSize: 12, fontFamily: F.semibold }}>{s}</Text>;
  const box = (label: string, children: React.ReactNode) => <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ gap: 4 }}>{caption(label)}{children}</View>;
  switch (v.kind) {
    case 'plates': return <PlateBar plan={v.plan} />;
    case 'stack': {
      const label = tr('stos na {v}', { v: fmtW(v.kg) });
      return box(label, v.window ? (
        <View style={{ gap: 3, alignSelf: 'flex-start' }}>
          {v.window.map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 120, height: 18, borderRadius: 4, backgroundColor: r.pin ? t.text : t.surface2, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }}>
                <Text maxFontSizeMultiplier={1.2} style={{ color: r.pin ? t.bg : t.muted, fontSize: 11, fontFamily: F.monoBold }}>{fmtW(r.kg, false)}</Text>
              </View>
              {r.pin ? <View style={{ width: 22, height: 6, borderRadius: 3, backgroundColor: t.accent }} /> : null}
            </View>))}
        </View>) : <View style={{ width: 120, height: 18, borderRadius: 4, backgroundColor: t.text }} />);
    }
    case 'dumbbell': case 'kettlebell': {
      const each = fmtW(v.eachKg); const label = (v.kind === 'dumbbell' ? tr('hantle: {v}', { v: `${v.n} × ${each}` }) : tr('kettlebell: {v}', { v: `${v.n} × ${each}` }));
      return box(label, <View style={{ flexDirection: 'row', gap: 10 }}>{Array.from({ length: v.n }).map((_, i) => v.kind === 'dumbbell' ? (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: 12, height: 30, borderRadius: 3, backgroundColor: t.text }} /><View style={{ width: 26, height: 6, backgroundColor: t.muted }} /><View style={{ width: 12, height: 30, borderRadius: 3, backgroundColor: t.text }} /></View>
      ) : (
        <View key={i} style={{ alignItems: 'center' }}><View style={{ width: 22, height: 12, borderTopLeftRadius: 11, borderTopRightRadius: 11, borderWidth: 4, borderBottomWidth: 0, borderColor: t.text }} /><View style={{ width: 32, height: 30, borderRadius: 15, backgroundColor: t.text }} /></View>
      ))}</View>);
    }
    case 'electric': {
      const label = tr('na urządzeniu: {v}', { v: fmtW(v.kg) });
      return box(label, <View style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: t.text }}><Text maxFontSizeMultiplier={1.2} style={{ color: t.bg, fontSize: 20, fontFamily: F.monoBold }}>{fmtW(v.kg)}</Text></View>);
    }
    case 'band': {
      const name = bandA11y({ color: v.color, level: v.level }); const label = v.role === 'assist' ? tr('asysta gumą: {v}', { v: name }) : tr('guma: {v}', { v: name });
      const hex = bandHex(v.color);
      return box(label, <View style={{ height: 14, width: 60 + v.level * 18, borderRadius: 7, backgroundColor: hex ?? t.surface2, borderWidth: !hex || hex === '#FFFFFF' ? 1.5 : 0, borderColor: t.text }} />);
    }
    case 'noplates': { /* audyt 0.10 (LIVE-17) */
      const label = v.nearestKg != null ? tr('Nie da się ułożyć z talerzy ({l}) — najbliżej {v}', { l: v.place, v: fmtW(v.nearestKg) }) : tr('Nie da się ułożyć z talerzy ({l})', { l: v.place });
      return <View accessible accessibilityLabel={label}>{caption(label)}</View>; /* podpis, nie rysunek */
    }
    case 'bodyweight': {
      const label = v.addKg > 0 ? tr('dociążenie: {v}', { v: fmtW(v.addKg) }) : tr('asysta: {v}', { v: fmtW(-v.addKg) });
      return box(label, null);
    }
  }
}
