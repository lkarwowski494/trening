import React from 'react';
import { Pressable, Switch, Text, TextInput, View, StyleSheet, type ViewStyle, type TextStyle, type TextInputProps, type StyleProp } from 'react-native';
import { useTheme } from '@/lib/theme';
import { lang } from '@/lib/i18n';
import { wu } from '@/lib/units';

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ flex: 1, backgroundColor: t.bg, paddingHorizontal: 14 }, style]}>{children}</View>;
}
export function H1({ children }: { children: React.ReactNode }) { const t = useTheme(); return <Text accessibilityRole="header" /* runda 68 */ style={{ color: t.text, fontSize: 22, fontWeight: '600' }}>{children}</Text>; }
export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) { const t = useTheme(); return <Text accessibilityRole="header" style={[{ color: t.text, fontSize: 17, fontWeight: '600', marginBottom: 8 }, style]}>{children}</Text>; }
export function Muted({ children, style, numberOfLines, accessibilityRole, accessibilityLabel }: { children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; accessibilityRole?: 'header'; accessibilityLabel?: string }) { const t = useTheme(); return <Text numberOfLines={numberOfLines} accessibilityRole={accessibilityRole} accessibilityLabel={accessibilityLabel} maxFontSizeMultiplier={1.4} style={[{ color: t.muted, fontSize: 14 }, style]}>{children}</Text>; }
export function Txt({ children, style, accessibilityRole }: { children: React.ReactNode; style?: StyleProp<TextStyle>; accessibilityRole?: 'header' }) { const t = useTheme(); return <Text accessibilityRole={accessibilityRole} style={[{ color: t.text, fontSize: 16 }, style]}>{children}</Text>; }

export function Btn({ title, onPress, kind = 'default', small, block, style, accessibilityLabel, accessibilityHint }: { title: string; onPress: () => void; kind?: 'default' | 'primary' | 'ghost' | 'danger'; small?: boolean; block?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string; accessibilityHint?: string }) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.accent : kind === 'ghost' || kind === 'danger' ? 'transparent' : t.surface2;
  const fg = kind === 'primary' ? t.accentInk : kind === 'danger' ? t.danger : t.text;
  const border = kind === 'primary' ? t.accent : kind === 'danger' ? t.danger : kind === 'ghost' ? 'transparent' : t.line;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} hitSlop={small ? 4 : 0} style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.7 : 1 }, small && { paddingVertical: 7, paddingHorizontal: 11, minHeight: 40 }, block && { alignSelf: 'stretch' }, style]}>
      <Text maxFontSizeMultiplier={1.4} style={{ color: fg, fontWeight: '600', fontSize: small ? 14 : 16 }}>{title}</Text>
    </Pressable>
  );
}
/**
 * Wiersz listy. `icon` = ozdobny znak po prawej wewnątrz wiersza (domyślnie „›”; niewidoczny dla VoiceOver).
 * `right` = osobny element obok wiersza (np. przycisk Start) — nie jest „połykany” przez wiersz w VoiceOver (runda 6).
 * Runda 7: cały wiersz (z odstępami, min. 56 pt) jest polem dotyku, a znaki „+”/„↺” w pickerze są w środku wiersza.
 */
export function Item({ title, sub, right, icon, onPress }: { title: string; sub?: string; right?: React.ReactNode; icon?: string; onPress?: () => void }) {
  const t = useTheme(); const glyph = icon ?? (onPress && !right ? '›' : null); const once = useOnce(700); // runda 18: podwójne tapnięcie nie otwiera ekranu dwa razy
  return (
    <View style={[s.item, { borderBottomColor: t.line }]}>
      <Pressable onPress={onPress ? once(onPress) : undefined} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={sub ? `${title}, ${sub}` : title} style={({ pressed }) => [s.itemPress, { opacity: pressed ? 0.6 : 1 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.text, fontWeight: '600', fontSize: 16 }}>{title}</Text>
          {sub ? <Text style={{ color: t.muted, fontSize: 14, marginTop: 2 }}>{sub}</Text> : null}
        </View>
        {glyph ? <Text accessible={false} importantForAccessibility="no" style={{ color: t.muted, fontSize: 20 }}>{glyph}</Text> : null}
      </Pressable>
      {right ?? null}
    </View>
  );
}
/**
 * Runda 9: blokada podwójnego tapnięcia dla przycisków, które tworzą coś i przechodzą dalej. Drugie wywołanie
 * w ciągu `ms` jest ignorowane; potem przycisk znów działa (np. po powrocie na ekran).
 */
export function useOnce(ms = 1000) { const last = React.useRef(0); return (fn: () => void) => () => { const now = Date.now(); if (now >= last.current && now - last.current < ms) return; /* zegar cofnięty wstecz nie blokuje przycisku */ last.current = now; fn(); }; }
/** Etykieta pola przekazywana polom tekstowym jako opis dla VoiceOver (runda 3: pola czytały tylko „4” albo „90”). */
export const FieldLabel = React.createContext<string | undefined>(undefined);
/** Runda 49: kontekst pola w wierszu listy (np. nazwa ćwiczenia w szablonie) — podpowiedź VoiceOver dla pól bez własnej. */
export const FieldHint = React.createContext<string | undefined>(undefined);
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const t = useTheme();
  return <View style={{ marginBottom: 12 }}><Text style={{ color: t.muted, fontSize: 14, marginBottom: 5 }}>{label}</Text><FieldLabel.Provider value={label}>{children}</FieldLabel.Provider></View>;
}
export function Input(props: TextInputProps & { center?: boolean }) {
  const t = useTheme(); const label = React.useContext(FieldLabel); const hint = React.useContext(FieldHint);
  return <TextInput placeholderTextColor={t.muted} maxFontSizeMultiplier={1.3} accessibilityLabel={label ?? (typeof props.placeholder === 'string' ? props.placeholder : undefined)} accessibilityHint={hint} {...props} style={[s.input, { backgroundColor: t.surface2, borderColor: t.line, color: t.text }, props.center && { textAlign: 'center', paddingHorizontal: 4 }, props.style]} />;
}
/** Liczba z tekstu pola (przecinek dziesiętny), bez przycinania; null = tekst niedokończony/nieliczbowy. */
const parseRaw = (v: string): number | '' | null => { const n = v.trim().replace(',', '.'); if (n === '') return ''; const x = Number(n); return Number.isFinite(x) ? x : null; };
/** Do zapisu: ta sama granica co przy wczytaniu (runda 54: |v| ≤ 1e6, także po przeliczeniu z lb). */
const parseNum = (v: string): number | '' | null => { const x = parseRaw(v); return typeof x === 'number' ? Math.max(-1e6, Math.min(1e6, x)) : x; };
/**
 * Pole liczbowe. Trzyma własny tekst, a z wartością z danych synchronizuje się tylko wtedy, gdy liczbowo się różnią.
 * Do 0.7.1 pole było w pełni sterowane liczbą, więc „12,” zamieniało się od razu w „12” i nie dało się wpisać 12,5 kg
 * (T-039). Teraz przecinek/kropka zostają w trakcie pisania, a śmieci (np. samo „.”) nie trafiają do danych.
 */
export function NumInput(props: Omit<TextInputProps, 'value'> & { value: number | '' | undefined; onNum: (v: number | '') => void; decimal?: boolean; allowNegative?: boolean; /** pole ciężaru: w lb wyświetlamy 0,1, więc różnica < 0,06 to ta sama wartość */ weightTol?: boolean }) {
  const { value, onNum, decimal, allowNegative, weightTol, ...rest } = props;
  // Po polsku przecinek dziesiętny także w wartościach wstawionych przez apkę (np. „12,5” z szablonu) — audyt r1.
  const raw = value === '' || value == null ? '' : /e/i.test(String(value)) ? String(Number(Number(value).toFixed(6))) : String(value); /* runda 55: bez zapisu wykładniczego */ const ext = lang() === 'pl' ? raw.replace('.', ',') : raw;
  const [txt, setTxt] = React.useState(ext);
  // Tolerancja 0,06: przy funtach wyświetlamy 0,1 — wpisane 45,25 nie „przeskakuje” na 45,3 w trakcie pisania.
  // Runda 56: także po wpisaniu wartości przyciętej do tej samej liczby (10 → „100” → 10) pole pokazuje zapisaną wartość od razu.
  // Zmiana wartości z danych (podpowiedź, przeliczenie) synchronizuje jak dotąd; zmiana samego tekstu — tylko gdy tekst jest pełną liczbą
  // (puste pole, „12,”, „-” zostają w trakcie pisania).
  const lastVal = React.useRef(value);
  React.useEffect(() => { const byValue = lastVal.current !== value; lastVal.current = value; const p = parseRaw(txt); /* runda 57: bez przycięcia — „2000000” różni się od zapisanego 1000000 */ if (!byValue && (p === null || p === '' || (p === 0 && (value === '' || value == null)))) return; /* „0” zaczyna „0,5” */ const v = value ?? ''; const tol = weightTol ? (wu() === 'lb' ? 0.06 : 0.005) : 1e-9; /* runda 58: w kg pole pokazuje 0,01 */ const same = p === v || (typeof p === 'number' && typeof v === 'number' && Math.abs(p - v) <= tol + 1e-9); /* runda 60: 62,555 → 62,56 to ta sama wartość (szum zmiennoprzecinkowy) */ if (!same) setTxt(ext); }, [value, txt]); // eslint-disable-line react-hooks/exhaustive-deps
  // Klawiatura numeryczna iOS nie ma minusa — pola ±kg (asysta) dostają klawiaturę z interpunkcją.
  // Zmiana języka przeformatowuje separator (12,5 ↔ 12.5); po zakończeniu edycji pole pokazuje to, co naprawdę zapisano
  // (np. wartość przyciętą do limitu) — runda 2.
  const L = lang(); React.useEffect(() => { setTxt(ext); }, [L]); // eslint-disable-line react-hooks/exhaustive-deps
  return <Input center keyboardType={allowNegative ? 'numbers-and-punctuation' : decimal ? 'decimal-pad' : 'number-pad'} value={txt} onChangeText={v => { setTxt(v); const p = parseNum(v); if (p !== null) onNum(p); }} onEndEditing={() => setTxt(ext)} selectTextOnFocus {...rest} />;
}
/** Chip wyboru. `toggle` = przełącznik ustawienia: VoiceOver czyta nazwę pola (z Field) jako etykietę i stan włączenia (runda 6). */
export function Chip({ label, on, onPress, toggle, a11yLabel, a11yHint, disabled }: { label: string; on: boolean; onPress: () => void; toggle?: boolean; a11yLabel?: string; a11yHint?: string; disabled?: boolean }) {
  const t = useTheme(); const field = React.useContext(FieldLabel);
  // Runda 49: własna etykieta/podpowiedź (np. chip „✕” wyboru) i stan nieaktywny (chip, który nic nie zmienia).
  const a11y = toggle ? { accessibilityRole: 'switch' as const, accessibilityLabel: field ?? label, accessibilityValue: { text: label }, accessibilityState: { checked: on, disabled: !!disabled } } : { accessibilityRole: 'button' as const, accessibilityLabel: a11yLabel ?? label, accessibilityHint: a11yHint ?? field, accessibilityState: { selected: on, disabled: !!disabled } };
  return <Pressable onPress={disabled ? undefined : onPress} {...a11y} hitSlop={4} style={[s.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.line }, disabled && !on && { opacity: 0.5 }]}><Text style={{ color: on ? t.accentInk : t.muted, fontWeight: '600', fontSize: 13 }}>{label}</Text></Pressable>;
}
/**
 * P-002 (02.10.2026): ustawienia jak w Ustawieniach iOS (Apple HIG: przełącznik dla wł./wył., kontrolka segmentowa dla 1 z 2–4).
 * Wiersz z opisem po lewej i systemowym przełącznikiem po prawej — zamiast przycisku na całą szerokość.
 */
export function SwitchRow({ label, detail, value, onChange, disabled }: { label: string; detail?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const t = useTheme();
  return (
    <View style={[s.switchRow, { borderBottomColor: t.line }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text maxFontSizeMultiplier={1.4} style={{ color: t.text, fontSize: 16 }}>{label}</Text>
        {detail ? <Text maxFontSizeMultiplier={1.4} style={{ color: t.muted, fontSize: 13, marginTop: 2 }}>{detail}</Text> : null}
      </View>
      <Switch value={value} disabled={disabled} onValueChange={onChange} trackColor={{ true: t.accent, false: t.surface2 }} ios_backgroundColor={t.surface2}
        accessibilityRole="switch" accessibilityLabel={label} accessibilityHint={detail} accessibilityState={{ checked: value, disabled: !!disabled }} />
    </View>
  );
}
/** Kontrolka segmentowa: jedna z kilku opcji w jednym wąskim pasku (język, jednostka). */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: [T, string][]; value: T; onChange: (v: T) => void; label: string }) {
  const t = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[s.seg, { backgroundColor: t.surface2, borderColor: t.line }]}>
      {options.map(([k, l]) => { const on = k === value; return (
        <Pressable key={k} onPress={() => { if (!on) onChange(k); }} accessibilityRole="button" accessibilityLabel={l} accessibilityHint={label} accessibilityState={{ selected: on }} style={[s.segItem, on && { backgroundColor: t.accent }]}>
          <Text maxFontSizeMultiplier={1.3} numberOfLines={2} style={{ color: on ? t.accentInk : t.text, fontWeight: on ? '700' : '500', fontSize: 14, textAlign: 'center' }}>{l}</Text>
        </Pressable>); })}
    </View>
  );
}
/** Nagłówek grupy ustawień (jak sekcje w Ustawieniach iOS). */
export function SectionTitle({ children }: { children: React.ReactNode }) { const t = useTheme(); return <Text accessibilityRole="header" maxFontSizeMultiplier={1.4} style={{ color: t.muted, fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 22, marginBottom: 4 }}>{children}</Text>; }
export function Empty({ children }: { children: React.ReactNode }) { const t = useTheme(); return <View style={[s.empty, { borderColor: t.line }]}><Text style={{ color: t.muted, textAlign: 'center' }}>{children}</Text></View>; }

const s = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: 9, padding: 2, alignSelf: 'stretch' },
  segItem: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 7, paddingHorizontal: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, minHeight: 44 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 4, borderBottomWidth: 1 },
  itemPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 4, minHeight: 56 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, minHeight: 44 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', borderRadius: 999, borderWidth: 1, marginRight: 6 },
  empty: { padding: 28, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10 },
});
