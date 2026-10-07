import React from 'react';
import { Pressable, Switch, Text, TextInput, View, StyleSheet, type ViewStyle, type TextStyle, type TextInputProps, type StyleProp } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { decimalComma, lang } from '@/lib/i18n';
import { wu } from '@/lib/units';

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ flex: 1, backgroundColor: t.bg, paddingHorizontal: 14 }, style]}>{children}</View>;
}
export function H1({ children }: { children: React.ReactNode }) { const t = useTheme(); return <Text accessibilityRole="header" /* runda 68 */ style={{ color: t.text, fontSize: 24, fontFamily: F.heavy }}>{children}</Text>; }
export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) { const t = useTheme(); return <Text accessibilityRole="header" style={[{ color: t.text, fontSize: 17, fontFamily: F.semibold, marginBottom: 8 }, style]}>{children}</Text>; }
export function Muted({ children, style, numberOfLines, accessibilityRole, accessibilityLabel }: { children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; accessibilityRole?: 'header'; accessibilityLabel?: string }) { const t = useTheme(); return <Text numberOfLines={numberOfLines} accessibilityRole={accessibilityRole} accessibilityLabel={accessibilityLabel} maxFontSizeMultiplier={1.4} style={[{ color: t.muted, fontSize: 14, fontFamily: F.regular }, style]}>{children}</Text>; }
export function Txt({ children, style, accessibilityRole, maxFontSizeMultiplier }: { children: React.ReactNode; style?: StyleProp<TextStyle>; accessibilityRole?: 'header'; maxFontSizeMultiplier?: number }) { const t = useTheme(); return <Text accessibilityRole={accessibilityRole} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[{ color: t.text, fontSize: 16, fontFamily: F.regular }, style]}>{children}</Text>; }

export function Btn({ title, onPress, kind = 'default', small, block, style, accessibilityLabel, accessibilityHint }: { title: string; onPress: () => void; kind?: 'default' | 'primary' | 'ghost' | 'danger'; small?: boolean; block?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string; accessibilityHint?: string }) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.accent : kind === 'ghost' || kind === 'danger' ? 'transparent' : t.surface2;
  const fg = kind === 'primary' ? t.accentInk : kind === 'danger' ? t.danger : t.text;
  const border = kind === 'primary' ? t.accent : kind === 'danger' ? t.danger : kind === 'ghost' ? 'transparent' : t.line;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} hitSlop={small ? 4 : 0} style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.7 : 1 }, small && { paddingVertical: 7, paddingHorizontal: 11, minHeight: 40 }, block && { alignSelf: 'stretch' }, style]}>
      <Text maxFontSizeMultiplier={1.4} style={{ color: fg, fontFamily: F.semibold, fontSize: small ? 14 : 16 }}>{title}</Text>
    </Pressable>
  );
}
/**
 * Wiersz listy. `icon` = ozdobny znak po prawej wewnątrz wiersza (domyślnie „›”; niewidoczny dla VoiceOver).
 * `right` = osobny element obok wiersza (np. przycisk Start) — nie jest „połykany” przez wiersz w VoiceOver (runda 6).
 * Runda 7: cały wiersz (z odstępami, min. 56 pt) jest polem dotyku, a znaki „+”/„↺” w pickerze są w środku wiersza.
 */
export function Item({ title, sub, right, icon, onPress, dim, accessibilityLabel, a11y }: { /** usuwanie przesunięciem: akcja VoiceOver „usuń” (components/SwipeRow.tsx) */ a11y?: import('@/components/SwipeRow').DeleteA11y; title: string; sub?: string; right?: React.ReactNode; icon?: string; onPress?: () => void; /** P-003: wiersz wyszarzony (np. ćwiczenie niedostępne w miejscu) */ dim?: boolean; /** E2: opis dla VoiceOver inny niż „tytuł, podtytuł” (np. „Propozycja 1: …”) */ accessibilityLabel?: string }) {
  const t = useTheme(); const glyph = icon ?? (onPress && !right ? '›' : null); const once = useOnce(700); // runda 18: podwójne tapnięcie nie otwiera ekranu dwa razy
  return (
    <View style={[s.item, { borderBottomColor: t.line }]}>
      <Pressable {...a11y} onPress={onPress ? once(onPress) : undefined} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel ?? (sub ? `${title}, ${sub}` : title)} style={({ pressed }) => [s.itemPress, { opacity: pressed ? 0.6 : dim ? 0.5 : 1 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.text, fontFamily: F.semibold, fontSize: 16 }}>{title}</Text>
          {sub ? <Text style={{ color: t.muted, fontSize: 14, marginTop: 2, fontFamily: F.regular }}>{sub}</Text> : null}
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
  return <View style={{ marginBottom: 12 }}><Text style={{ color: t.muted, fontSize: 14, marginBottom: 5, fontFamily: F.regular }}>{label}</Text><FieldLabel.Provider value={label}>{children}</FieldLabel.Provider></View>;
}
export function Input(props: TextInputProps & { center?: boolean }) {
  const t = useTheme(); const label = React.useContext(FieldLabel); const hint = React.useContext(FieldHint);
  return <TextInput placeholderTextColor={t.muted} maxFontSizeMultiplier={1.3} accessibilityLabel={label ?? (typeof props.placeholder === 'string' ? props.placeholder : undefined)} accessibilityHint={hint} {...props} style={[s.input, { backgroundColor: t.surface2, borderColor: t.line, color: t.text, fontFamily: F.regular }, props.center && { textAlign: 'center', paddingHorizontal: 4 }, props.style]} />;
}
/** Audyt cd60eec MEDIUM: wąskie pola (ciężar 56 pt, RPE 40 pt) — krój mono (0,6 em na znak) ucinał „102,5”; krój tekstu z cyframi tabelarycznymi. */
export const NUM_FONT = { fontFamily: F.regular, fontVariant: ['tabular-nums' as const] };
/** Liczba z tekstu pola (przecinek dziesiętny), bez przycinania; null = tekst niedokończony/nieliczbowy. */
const parseRaw = (v: string): number | '' | null => { const n = v.trim().replace(',', '.'); if (n === '') return ''; const x = Number(n); return Number.isFinite(x) ? x : null; };
/** Do zapisu: ta sama granica co przy wczytaniu (runda 54: |v| ≤ 1e6, także po przeliczeniu z lb). */
const parseNum = (v: string): number | '' | null => { const x = parseRaw(v); return typeof x === 'number' ? Math.max(-1e6, Math.min(1e6, x)) : x; };
/**
 * Pole liczbowe. Trzyma własny tekst, a z wartością z danych synchronizuje się tylko wtedy, gdy liczbowo się różnią.
 * Do 0.7.1 pole było w pełni sterowane liczbą, więc „12,” zamieniało się od razu w „12” i nie dało się wpisać 12,5 kg
 * (T-039). Teraz przecinek/kropka zostają w trakcie pisania, a śmieci (np. samo „.”) nie trafiają do danych.
 */
export function NumInput(props: Omit<TextInputProps, 'value'> & { value: number | '' | undefined; onNum: (v: number | '', keep?: number | '') => void; decimal?: boolean; allowNegative?: boolean; /** pole ciężaru: w lb wyświetlamy 0,1, więc różnica < 0,06 to ta sama wartość */ weightTol?: boolean; /** Q-021: zapisana wartość (kg) za wyświetlaną `value` — gdy wpis kończy się liczbą, którą pole pokazywało na początku edycji, onNum dostaje ją jako `keep` (units.wInKeep) */ stored?: number | '' }) {
  const { value, onNum, decimal, allowNegative, weightTol, stored, ...rest } = props;
  // Q-021: stan na początku edycji (pierwsza zmiana tekstu — także bez zdarzenia focus); koniec edycji go zeruje.
  const start = React.useRef<{ shown: number | '' | undefined; stored: number | '' | undefined } | null>(null);
  // Po polsku przecinek dziesiętny także w wartościach wstawionych przez apkę (np. „12,5” z szablonu) — audyt r1.
  const raw = value === '' || value == null ? '' : /e/i.test(String(value)) ? String(Number(Number(value).toFixed(6))) : String(value); /* runda 55: bez zapisu wykładniczego */ const ext = decimalComma() ? raw.replace('.', ',') : raw;
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
  return <Input center keyboardType={allowNegative ? 'numbers-and-punctuation' : decimal ? 'decimal-pad' : 'number-pad'} value={txt} onChangeText={v => { setTxt(v); if (!start.current) start.current = { shown: value, stored }; const p = parseNum(v); if (p !== null) onNum(p, stored !== undefined && typeof p === 'number' && p === start.current.shown ? start.current.stored : undefined); }} onEndEditing={() => { start.current = null; setTxt(ext); }} selectTextOnFocus {...rest} style={[NUM_FONT, rest.style]} />;
}
/** Chip wyboru. `toggle` = przełącznik ustawienia: VoiceOver czyta nazwę pola (z Field) jako etykietę i stan włączenia (runda 6). */
export function Chip({ label, on, onPress, toggle, a11yLabel, a11yHint, disabled }: { label: string; on: boolean; onPress: () => void; toggle?: boolean; a11yLabel?: string; a11yHint?: string; disabled?: boolean }) {
  const t = useTheme(); const field = React.useContext(FieldLabel);
  // Runda 49: własna etykieta/podpowiedź (np. chip „✕” wyboru) i stan nieaktywny (chip, który nic nie zmienia).
  const a11y = toggle ? { accessibilityRole: 'switch' as const, accessibilityHint: a11yHint, accessibilityLabel: a11yLabel ?? field ?? label, accessibilityValue: { text: label }, accessibilityState: { checked: on, disabled: !!disabled } } : { accessibilityRole: 'button' as const, accessibilityLabel: a11yLabel ?? label, accessibilityHint: a11yHint ?? field, accessibilityState: { selected: on, disabled: !!disabled } };
  return <Pressable onPress={disabled ? undefined : onPress} {...a11y} hitSlop={4} style={[s.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.line }, disabled && !on && { opacity: 0.5 }]}><Text style={{ color: on ? t.accentInk : t.muted, fontFamily: F.semibold, fontSize: 13 }}>{label}</Text></Pressable>;
}
/**
 * P-002 (02.10.2026): ustawienia jak w Ustawieniach iOS (Apple HIG: przełącznik dla wł./wył., kontrolka segmentowa dla 1 z 2–4).
 * Wiersz z opisem po lewej i systemowym przełącznikiem po prawej — zamiast przycisku na całą szerokość.
 */
export function SwitchRow({ label, detail, value, onChange, disabled, a11yLabel }: { label: string; detail?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; /** P-003 (audyt M7): pełna etykieta dla VoiceOver, np. „Ławka regulowana: ze skosem w dół” */ a11yLabel?: string }) {
  const t = useTheme();
  return (
    <View style={[s.switchRow, { borderBottomColor: t.line }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text maxFontSizeMultiplier={1.4} style={{ color: t.text, fontSize: 16, fontFamily: F.regular }}>{label}</Text>
        {detail ? <Text maxFontSizeMultiplier={1.4} style={{ color: t.muted, fontSize: 13, marginTop: 2, fontFamily: F.regular }}>{detail}</Text> : null}
      </View>
      <Switch testID={'sw-' + label} /* E2E (Maestro): przełącznik po id, nie po kolejności tekstu i przełącznika */ value={value} disabled={disabled} onValueChange={onChange} trackColor={{ true: t.accent, false: t.surface2 }} ios_backgroundColor={t.surface2}
        accessibilityRole="switch" accessibilityLabel={a11yLabel ?? label} accessibilityHint={detail} accessibilityState={{ checked: value, disabled: !!disabled }} />
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
          <Text maxFontSizeMultiplier={1.3} numberOfLines={2} style={{ color: on ? t.accentInk : t.text, fontFamily: on ? F.semibold : F.regular, fontSize: 14, textAlign: 'center' }}>{l}</Text>
        </Pressable>); })}
    </View>
  );
}
/** Nagłówek grupy ustawień (jak sekcje w Ustawieniach iOS). */
export function SectionTitle({ children }: { children: React.ReactNode }) { const t = useTheme(); return <Text accessibilityRole="header" maxFontSizeMultiplier={1.4} style={{ color: t.muted, fontSize: 13, fontFamily: F.semibold, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 22, marginBottom: 4 }}>{children}</Text>; }
export function Empty({ children }: { children: React.ReactNode }) { const t = useTheme(); return <View style={[s.empty, { borderColor: t.line }]}><Text style={{ color: t.muted, textAlign: 'center', fontFamily: F.regular }}>{children}</Text></View>; }

const s = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: 9, padding: 2, alignSelf: 'stretch' },
  segItem: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 7, paddingHorizontal: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, minHeight: 44 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 4, borderBottomWidth: 1 },
  itemPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 4, minHeight: 56 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, minHeight: 44 }, /* krój przy renderze (F zależy od języka, 06.10.2026) */
  chip: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', borderRadius: 999, borderWidth: 1, marginRight: 6 },
  empty: { padding: 28, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10 },
});
