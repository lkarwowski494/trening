import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { lang, t } from '@/lib/i18n';

/*
 * Wzorzec „ⓘ” — teksty objaśniające schowane pod ikoną (docs/32 wzorzec 26, strażnik S17; decyzje właściciela 14.10.2026).
 * Jeden komponent we wszystkich ekranach (nagłówki przez parametr `info` w SectionTitle i H2 albo wprost InfoTip wokół nagłówka):
 *  - rozwinięcie w miejscu, pod nagłówkiem, w ramce surface2; drugie stuknięcie zwija; stan NIE jest zapamiętywany (każde wejście na ekran zaczyna od zwiniętego);
 *  - okrąg z literą „i” rysowany widokiem (nie znak U+24D8 — krój zastępczy iOS); obrys i znak muted, po rozwinięciu accent; pole dotyku ≥ 44 pt (hitSlop);
 *  - VoiceOver: rola button, accessibilityState.expanded, stała etykieta „Więcej informacji: {nagłówek}”, język aplikacji; tekst objaśnienia jest następnym elementem;
 *  - Dynamic Type: rozwinięty tekst rośnie do TEXT_SCALE_MAX bez ucinania, znak „i” ma niski limit; nagłówek i kółko zawijają się razem na wąskim ekranie (320 pt).
 * Do ⓘ trafiają objaśnienia i źródła (bez zmian w treści); na wierzchu zostają warunki subskrypcji, zastrzeżenia zdrowotne, ostrzeżenia o utracie danych,
 * błędy i prywatność. Nigdy pusty stan. Pilnuje tests/interaction-guards.test.ts (S17) i tests/info-tip.test.tsx.
 */
export const INFO_SIZE = 24;
/** 24 + 2 × 10 = 44 pt (HIG: minimalne pole dotyku). */
export const INFO_HIT_SLOP = 10;
/** Znak „i” nie rośnie z Dynamic Type bardziej niż to — kółko ma stały rozmiar. */
export const INFO_GLYPH_SCALE_MAX = 1.3;
export const infoTestId = (id: string) => `info-${id}`;
export const infoTextTestId = (id: string) => `info-text-${id}`;

/** Okrąg „i” (przycisk). Stan trzyma wywołujący (`useInfoOpen`), żeby objaśnienie mogło stać w innym miejscu układu niż przycisk (np. pod wierszem z przełącznikiem). */
export function InfoButton({ id, label, open, onToggle }: { id: string; label: string; open: boolean; onToggle: () => void }) {
  const th = useTheme();
  return (
    <Pressable testID={infoTestId(id)} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Więcej informacji: {name}', { name: label })}
      accessibilityHint={t('Pokazuje objaśnienie pod nagłówkiem.')} accessibilityState={{ expanded: open }} hitSlop={INFO_HIT_SLOP} onPress={onToggle}
      style={{ width: INFO_SIZE, height: INFO_SIZE, borderRadius: INFO_SIZE / 2, borderWidth: 1.5, borderColor: open ? th.accent : th.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text accessibilityElementsHidden importantForAccessibility="no" maxFontSizeMultiplier={INFO_GLYPH_SCALE_MAX} style={{ color: open ? th.accent : th.muted, fontSize: 14, lineHeight: 18, fontFamily: F.semibold }}>i</Text>
    </Pressable>
  );
}
/** Rozwinięte objaśnienie: ramka surface2, tekst bez ograniczenia linii (do TEXT_SCALE_MAX); tablica = osobne akapity. */
export function InfoBox({ id, info }: { id: string; info: React.ReactNode | string[] }) {
  const th = useTheme(); const paras = Array.isArray(info) ? info : null;
  const body = (x: React.ReactNode, k?: number) => typeof x === 'string'
    ? <Text key={k} accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, fontSize: 14, fontFamily: F.regular }}>{x}</Text>
    : <React.Fragment key={k}>{x}</React.Fragment>;
  return <View testID={infoTextTestId(id)} style={{ backgroundColor: th.surface2, borderRadius: 10, padding: 10, marginTop: 4, marginBottom: 6, gap: 6 }}>{paras ? paras.map((p, i) => body(p, i)) : body(info as React.ReactNode)}</View>;
}
/** Stan rozwinięcia: świadomie bez zapamiętywania (P4 A) — każde wejście na ekran zaczyna od zwiniętego. */
export function useInfoOpen() { const [open, setOpen] = React.useState(false); return [open, () => setOpen(v => !v)] as const; }

export function InfoTip({ id, label, info, children, style }: {
  /** stały identyfikator (testID `info-{id}` i `info-text-{id}`; scenariusze Maestro) */ id: string;
  /** tekst nagłówka — do etykiety VoiceOver „Więcej informacji: {label}” (zwykły zapis, nie wersaliki) */ label: string;
  /** objaśnienie; tablica tekstów = osobne akapity */ info: React.ReactNode | string[];
  /** nagłówek, przy którym stoi ⓘ */ children: React.ReactNode; style?: StyleProp<ViewStyle>;
}) {
  const [open, toggle] = useInfoOpen();
  return (
    <View style={style}>
      <View testID={`info-row-${id}`} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>
        <View testID={`info-head-${id}`} style={{ flexShrink: 1 }}>{children}</View>
        <InfoButton id={id} label={label} open={open} onToggle={toggle} />
      </View>
      {open ? <InfoBox id={id} info={info} /> : null}
    </View>
  );
}
