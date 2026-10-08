import React from 'react';
import { Pressable, Switch, Text, TextInput, View, StyleSheet, useWindowDimensions, type ViewStyle, type TextStyle, type TextInputProps, type StyleProp } from 'react-native';
import { useTheme, F, TEXT_SCALE_MAX, NUM_SCALE_MAX } from '@/lib/theme';
import { decimalComma, lang, upper, LOCALE_UPPER } from '@/lib/i18n';
import { wu } from '@/lib/units';

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ flex: 1, backgroundColor: t.bg, paddingHorizontal: 14 }, style]}>{children}</View>;
}
export function H1({ children }: { children: React.ReactNode }) { const t = useTheme(); return <Text accessibilityLanguage={lang()} accessibilityRole="header" /* runda 68 */ style={{ color: t.text, fontSize: 24, fontFamily: F.heavy }}>{children}</Text>; }
export function H2({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) { const t = useTheme(); return <Text accessibilityLanguage={lang()} accessibilityRole="header" style={[{ color: t.text, fontSize: 17, fontFamily: F.semibold, marginBottom: 8 }, style]}>{children}</Text>; }
export function Muted({ children, style, numberOfLines, accessibilityRole, accessibilityLabel, maxFontSizeMultiplier = TEXT_SCALE_MAX }: { children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; accessibilityRole?: 'header'; accessibilityLabel?: string; /** A11-07: NUM_SCALE_MAX w kolumnach o stałej szerokości */ maxFontSizeMultiplier?: number }) { const t = useTheme(); return <Text accessibilityLanguage={lang()} numberOfLines={numberOfLines} accessibilityRole={accessibilityRole} accessibilityLabel={accessibilityLabel} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[{ color: t.muted, fontSize: 14, fontFamily: F.regular }, style]}>{children}</Text>; }
export function Txt({ children, style, accessibilityRole, maxFontSizeMultiplier }: { children: React.ReactNode; style?: StyleProp<TextStyle>; accessibilityRole?: 'header'; maxFontSizeMultiplier?: number }) { const t = useTheme(); return <Text accessibilityLanguage={lang()} accessibilityRole={accessibilityRole} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[{ color: t.text, fontSize: 16, fontFamily: F.regular }, style]}>{children}</Text>; }

export function Btn({ title, onPress, kind = 'default', small, block, style, accessibilityLabel, accessibilityHint }: { title: string; onPress: () => void; kind?: 'default' | 'primary' | 'ghost' | 'danger'; small?: boolean; block?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string; accessibilityHint?: string }) {
  const t = useTheme();
  const bg = kind === 'primary' ? t.accent : kind === 'ghost' || kind === 'danger' ? 'transparent' : t.surface2;
  const fg = kind === 'primary' ? t.accentInk : kind === 'danger' ? t.danger : t.text;
  const border = kind === 'primary' ? t.accent : kind === 'danger' ? t.danger : kind === 'ghost' ? 'transparent' : t.line;
  return (
    <Pressable accessibilityLanguage={lang()} onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} hitSlop={small ? 4 : 0} style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.7 : 1 }, small && { paddingVertical: 7, paddingHorizontal: 11, minHeight: 40 }, block && { alignSelf: 'stretch' }, style]}>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: fg, fontFamily: F.semibold, fontSize: small ? 14 : 16 }}>{title}</Text>
    </Pressable>
  );
}
/**
 * Wiersz listy. `icon` = ozdobny znak po prawej wewnątrz wiersza (domyślnie „›”; niewidoczny dla VoiceOver).
 * `right` = osobny element obok wiersza (np. przycisk Start) — nie jest „połykany” przez wiersz w VoiceOver (runda 6).
 * Runda 7: cały wiersz (z odstępami, min. 56 pt) jest polem dotyku, a znaki „+”/„↺” w pickerze są w środku wiersza.
 */
export function Item({ title, sub, right, icon, onPress, dim, accessibilityLabel, a11y, a11yLang }: { /** A11-09: język, którym VoiceOver czyta wiersz (domyślnie język aplikacji) */ a11yLang?: string; /** usuwanie przesunięciem: akcja VoiceOver „usuń” (components/SwipeRow.tsx) */ a11y?: import('@/components/SwipeRow').DeleteA11y; title: string; sub?: string; right?: React.ReactNode; icon?: string; onPress?: () => void; /** P-003: wiersz wyszarzony (np. ćwiczenie niedostępne w miejscu) */ dim?: boolean; /** E2: opis dla VoiceOver inny niż „tytuł, podtytuł” (np. „Propozycja 1: …”) */ accessibilityLabel?: string }) {
  const t = useTheme(); const glyph = icon ?? (onPress && !right ? '›' : null); const once = useOnce(700); // runda 18: podwójne tapnięcie nie otwiera ekranu dwa razy
  return (
    <View style={[s.item, { borderBottomColor: t.line }]}>
      <Pressable accessibilityLanguage={a11yLang ?? lang()} {...a11y} onPress={onPress ? once(onPress) : undefined} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel ?? (sub ? `${title}, ${sub}` : title)} style={({ pressed }) => [s.itemPress, { opacity: pressed ? 0.6 : 1 }]}>
        <View style={{ flex: 1 }}>
          <Text accessibilityLanguage={a11yLang ?? lang()} style={{ color: dim ? t.muted : t.text /* A11-16: wyszarzenie kolorem muted (≥ 4,5:1) zamiast przezroczystości 0,5 — wiersz zostaje aktywny */, fontFamily: F.semibold, fontSize: 16 }}>{title}</Text>
          {sub ? <Text accessibilityLanguage={a11yLang ?? lang()} style={{ color: t.muted, fontSize: 14, marginTop: 2, fontFamily: F.regular }}>{sub}</Text> : null}
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
/* Audyt 0.10 (A11-09): każdy element tych komponentów ma accessibilityLanguage = język aplikacji — VoiceOver czyta głosem wybranego języka,
 * nie języka systemu (język wybrany w aplikacji nie zmienia języka widzianego przez iOS). Lista języków: app/more/language.tsx (kod wiersza). */
/** Etykieta pola przekazywana polom tekstowym jako opis dla VoiceOver (runda 3: pola czytały tylko „4” albo „90”). */
export const FieldLabel = React.createContext<string | undefined>(undefined);
/** Runda 49: kontekst pola w wierszu listy (np. nazwa ćwiczenia w szablonie) — podpowiedź VoiceOver dla pól bez własnej. */
export const FieldHint = React.createContext<string | undefined>(undefined);
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const t = useTheme();
  return <View style={{ marginBottom: 12 }}><Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 14, marginBottom: 5, fontFamily: F.regular }}>{label}</Text><FieldLabel.Provider value={label}>{children}</FieldLabel.Provider></View>;
}
export function Input(props: TextInputProps & { center?: boolean }) {
  const t = useTheme(); const label = React.useContext(FieldLabel); const hint = React.useContext(FieldHint);
  return <TextInput accessibilityLanguage={lang()} placeholderTextColor={t.muted} maxFontSizeMultiplier={NUM_SCALE_MAX} accessibilityLabel={label ?? (typeof props.placeholder === 'string' ? props.placeholder : undefined)} accessibilityHint={hint} {...props} style={[s.input, { backgroundColor: t.surface2, borderColor: t.ctrlLine /* A11-06 */, color: t.text, fontFamily: F.regular }, props.center && { textAlign: 'center', paddingHorizontal: 4 }, props.style]} />;
}
/** Audyt cd60eec MEDIUM: wąskie pola (ciężar 56 pt, RPE 40 pt) — krój mono (0,6 em na znak) ucinał „102,5”; krój tekstu z cyframi tabelarycznymi. */
export const NUM_FONT = { fontFamily: F.regular, fontVariant: ['tabular-nums' as const] };
/**
 * Audyt 0.10 (A11-11): IBM Plex Mono nie ma liter greckich (ma łacinę, cyrylicę i cyfry) — w tekście krojem mono litery greckie (np. el „προηγ.”,
 * „σωματικό βάρος”, skrót koloru gumy) dostają krój tekstu Plex Sans (`bold` — SemiBold), zamiast kroju zastępczego iOS w środku liczby.
 * Test: tests/audit-0.10-lang-ui (ekrany w el bez liter greckich krojem mono) i matrix-i18n (litery w mono ⊂ znaki Plex Mono).
 */
export const MONO_MISSING = /(\p{Script=Greek}+)/u;
export function monoSafe(v: React.ReactNode, bold = false): React.ReactNode {
  if (typeof v !== 'string' || !MONO_MISSING.test(v)) return v;
  return v.split(MONO_MISSING).map((part, i) => i % 2 ? <Text key={i} accessibilityLanguage={lang()} style={{ fontFamily: bold ? F.semibold : F.regular }}>{part}</Text> : part);
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
  const swName = a11yLabel ?? field ?? label;
  /* A11-14: wartość (tekst chipa) tylko wtedy, gdy różni się od nazwy — inaczej VoiceOver czyta „Tydzień deload, Tydzień deload” */
  const a11y = toggle ? { accessibilityRole: 'switch' as const, accessibilityHint: a11yHint, accessibilityLabel: swName, ...(swName !== label ? { accessibilityValue: { text: label } } : {}), accessibilityState: { checked: on, disabled: !!disabled } } : { accessibilityRole: 'button' as const, accessibilityLabel: a11yLabel ?? label, accessibilityHint: a11yHint ?? field, accessibilityState: { selected: on, disabled: !!disabled } };
  return <Pressable accessibilityLanguage={lang()} onPress={disabled ? undefined : onPress} {...a11y} hitSlop={4} style={[s.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.line }, disabled && !on && { opacity: 0.5 }]}><Text accessibilityLanguage={lang()} style={{ color: on ? t.accentInk : t.muted, fontFamily: F.semibold, fontSize: 13 }}>{label}</Text></Pressable>;
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
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.text, fontSize: 16, fontFamily: F.regular }}>{label}</Text>
        {detail ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, fontSize: 13, marginTop: 2, fontFamily: F.regular }}>{detail}</Text> : null}
      </View>
      <Switch accessibilityLanguage={lang()} testID={'sw-' + label} /* E2E (Maestro): przełącznik po id, nie po kolejności tekstu i przełącznika */ value={value} disabled={disabled} onValueChange={onChange} trackColor={{ true: t.accent, false: t.ctrlLine }} ios_backgroundColor={t.ctrlLine} /* A11-06: tor wyłączonego ≥ 3:1 */
        accessibilityRole="switch" accessibilityLabel={a11yLabel ?? label} accessibilityHint={detail} accessibilityState={{ checked: value, disabled: !!disabled }} />
    </View>
  );
}
/** Kontrolka segmentowa: jedna z kilku opcji w jednym wąskim pasku (język, jednostka).
 * Audyt 0.10 (A11-12): na 320 pt długie jednowyrazowe opcje (de „Muskelaufbau”, sv „Fettförbränning”) łamały się w środku wyrazu — opcja z jednym
 * wyrazem ma jedną linię, a krój zmniejsza się do SEG_MIN_SCALE; opcja z kilku wyrazów — 2 linie (też ze zmniejszaniem zamiast „…”).
 * Przy powiększonym tekście (Dynamic Type > 100%) opcje układają się jedna pod drugą na pełnej szerokości (rosną do 200%); w poziomie krój
 * się nie powiększa (jak UISegmentedControl — iOS pokazuje wtedy Large Content Viewer). A11-15: pole dotyku opcji ≥ 44 pt (HIG). Test szerokości: tests/matrix-i18n (W = 320). */
export const SEG_MIN_SCALE = 0.75;
export function Segmented<T extends string>({ options, value, onChange, label }: { options: [T, string][]; value: T; onChange: (v: T) => void; label: string }) {
  const t = useTheme(); const stacked = useWindowDimensions().fontScale > 1; /* A11-07/A11-12: przy powiększonym tekście opcje jedna pod drugą (pełna szerokość, rosną do 200%) — jak układy iOS przy rozmiarach dostępności */
  return (
    <View accessibilityLanguage={lang()} accessibilityRole="radiogroup" accessibilityLabel={label} style={[s.seg, stacked && { flexDirection: 'column' }, { backgroundColor: t.surface2, borderColor: t.line }]}>
      {options.map(([k, l]) => { const on = k === value; return (
        <Pressable accessibilityLanguage={lang()} key={k} onPress={() => { if (!on) onChange(k); }} accessibilityRole="button" accessibilityLabel={l} accessibilityHint={label} accessibilityState={{ selected: on }} style={[s.segItem, stacked && { flex: 0, alignSelf: 'stretch' }, on && { backgroundColor: t.accent }]}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={stacked ? TEXT_SCALE_MAX : 1} numberOfLines={stacked ? undefined : /\s/.test(l.trim()) ? 2 : 1} adjustsFontSizeToFit={!stacked} minimumFontScale={SEG_MIN_SCALE} style={{ color: on ? t.accentInk : t.text, fontFamily: on ? F.semibold : F.regular, fontSize: 14, textAlign: 'center' }}>{l}</Text>
        </Pressable>); })}
    </View>
  );
}
/** Nagłówek grupy ustawień (jak sekcje w Ustawieniach iOS). */
/** Audyt 0.10 (A11-02): wersaliki. iOS robi textTransform 'uppercase' bez języka ([NSString uppercaseString]) — w el (tonos) i tr (i → İ)
 * to błąd, więc tam tekst zamienia `upper()` z regułami języka, a VoiceOver czyta zwykły zapis (słowo wersalikami bywa czytane jak skrót).
 * W pozostałych językach systemowe wersaliki = reguły CLDR (test: tests/audit-0.10-lang.test.ts), więc zostaje textTransform. */
export function upperText(children: React.ReactNode): { text: React.ReactNode; label?: string; style: TextStyle } {
  const parts = React.Children.toArray(children);
  if (!LOCALE_UPPER.includes(lang()) || !parts.every(x => typeof x === 'string' || typeof x === 'number')) return { text: children, style: { textTransform: 'uppercase' } };
  const plain = parts.join(''); return { text: upper(plain), label: plain, style: {} };
}
export function SectionTitle({ children }: { children: React.ReactNode }) { const t = useTheme(); const u = upperText(children); return <Text accessibilityLanguage={lang()} accessibilityRole="header" accessibilityLabel={u.label} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={[{ color: t.muted, fontSize: 13, fontFamily: F.semibold, letterSpacing: 0.5, marginTop: 22, marginBottom: 4 }, u.style]}>{u.text}</Text>; }
export function Empty({ children }: { children: React.ReactNode }) { const t = useTheme(); return <View style={[s.empty, { borderColor: t.line }]}><Text accessibilityLanguage={lang()} style={{ color: t.muted, textAlign: 'center', fontFamily: F.regular }}>{children}</Text></View>; }

const s = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  seg: { flexDirection: 'row', borderWidth: 1, borderRadius: 9, padding: 2, alignSelf: 'stretch' },
  segItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 7, paddingHorizontal: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, minHeight: 44 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 4, borderBottomWidth: 1 },
  itemPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 4, minHeight: 56 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, minHeight: 44 }, /* krój przy renderze (F zależy od języka, 06.10.2026) */
  chip: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', borderRadius: 999, borderWidth: 1, marginRight: 6 },
  empty: { padding: 28, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10 },
});
