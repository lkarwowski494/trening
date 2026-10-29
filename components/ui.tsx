import React from 'react';
import { ActivityIndicator, Pressable, Switch, TextInput, View, StyleSheet, useWindowDimensions, type ViewStyle, type TextStyle, type TextInputProps, type StyleProp } from 'react-native';
import { Text } from '@/components/AppText';
import { useTheme, FW, font, maxScale, titleMaxScale, TEXT_SCALE_MAX, NUM_SCALE_MAX, GLYPH_SCALE_MAX, RADIUS, SIZE, SPACE, HEADER } from '@/lib/theme';
import { decimalComma, lang, upper, LOCALE_UPPER, t as tr, type Lang } from '@/lib/i18n';
import { useRouter } from 'expo-router';
import { wu } from '@/lib/units';
import { EmptyBarArt } from '@/components/EmptyBarArt';
import { InfoTip, InfoButton, InfoBox, useInfoOpen } from '@/components/InfoTip';
import { Icon, type IconName } from '@/components/Icon';

/** Styl roli bez interlinii — dla tekstów, których rozmiar ekrany nadpisują stylem (Muted, Txt, Field): interlinia z roli zostałaby przy innym rozmiarze. */
const plain = (role: Parameters<typeof font>[0]): TextStyle => { const f = font(role); delete f.lineHeight; return f; };

/** Zwykły tekst nagłówka (etykieta ⓘ dla VoiceOver; bez wersalików). */
const plainOf = (c: React.ReactNode): string => React.Children.toArray(c).map(x => typeof x === 'string' || typeof x === 'number' ? String(x) : '').join('');

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ flex: 1, backgroundColor: t.bg, paddingHorizontal: SPACE.l }, style]}>{children}</View>;
}
/** Duży tytuł (M3: Barlow Condensed 700, 34/38; rośnie z tekstem systemu najwyżej do 13% szerokości ekranu — titleMaxScale). */
export function H1({ children, a11yLang }: { children: React.ReactNode; /** M1-038: język wymowy (nazwa ćwiczenia z biblioteki → en) */ a11yLang?: Lang }) { const t = useTheme(); const { width } = useWindowDimensions(); return <Text accessibilityLanguage={a11yLang ?? lang()} accessibilityRole="header" /* runda 68 */ maxFontSizeMultiplier={titleMaxScale(width)} style={{ color: t.text, ...font('largeTitle') }}>{children}</Text>; }
/**
 * Nagłówek ekranu zakładki (Trening, Plan, Postępy, Więcej; właściciel 22.10.2026, docs/32 wzorzec 31): jeden odstęp pod bezpiecznym obszarem (HEADER.top) i pod
 * nagłówkiem (HEADER.bottom) — poprawka we wspólnym miejscu, nie w jednym ekranie. `row` — tytuł z przyciskiem w jednej linii (np. „Planowanie”).
 */
export function TabHeader({ children, row, style, testID = 'tab-header' }: { children: React.ReactNode; row?: boolean; style?: StyleProp<ViewStyle>; testID?: string }) {
  return <View testID={testID} style={[{ marginTop: HEADER.top, marginBottom: HEADER.bottom }, row ? { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } : null, style]}>{children}</View>;
}
/** `info` = objaśnienie pod ⓘ przy nagłówku (docs/32 wzorzec 27): wymaga `infoId` (testID i scenariusze Maestro); etykieta VoiceOver z tekstu nagłówka. */
export function H2({ children, style, info, infoId }: { children: React.ReactNode; style?: StyleProp<TextStyle>; info?: React.ReactNode | string[]; infoId?: string }) {
  const t = useTheme();
  const head = (bare: boolean) => <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={maxScale('sectionTitle')} style={[{ color: t.text, ...font('sectionTitle') }, bare ? null : { marginBottom: SPACE.s }, style]}>{children}</Text>;
  return info && infoId ? <InfoTip id={infoId} label={plainOf(children)} info={info} style={{ marginBottom: SPACE.s }}>{head(true)}</InfoTip> : head(false);
}
export function Muted({ children, style, numberOfLines, accessibilityRole, accessibilityLabel, maxFontSizeMultiplier = TEXT_SCALE_MAX, adjustsFontSizeToFit, selectable, testID }: { /** tekst do zaznaczenia i skopiowania (np. adres wsparcia po nieudanym otwarciu poczty) */ selectable?: boolean; testID?: string; children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; /** A11-19: nagłówek kolumny jednej linii zmniejsza krój zamiast „…” */ adjustsFontSizeToFit?: boolean; accessibilityRole?: 'header'; accessibilityLabel?: string; /** A11-07: NUM_SCALE_MAX w kolumnach o stałej szerokości */ maxFontSizeMultiplier?: number }) { const t = useTheme(); return <Text accessibilityLanguage={lang()} selectable={selectable} testID={testID} numberOfLines={numberOfLines} adjustsFontSizeToFit={adjustsFontSizeToFit} minimumFontScale={adjustsFontSizeToFit ? 0.7 : undefined} accessibilityRole={accessibilityRole} accessibilityLabel={accessibilityLabel} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[{ color: t.muted, ...plain('callout') }, style]}>{children}</Text>; }
export function Txt({ children, style, accessibilityRole, maxFontSizeMultiplier, testID, a11yLang }: { /** M1-038: język wymowy (nazwa ćwiczenia z biblioteki → en) */ a11yLang?: Lang; children: React.ReactNode; style?: StyleProp<TextStyle>; accessibilityRole?: 'header'; maxFontSizeMultiplier?: number; testID?: string }) { const t = useTheme(); return <Text testID={testID} accessibilityLanguage={a11yLang ?? lang()} accessibilityRole={accessibilityRole} maxFontSizeMultiplier={maxFontSizeMultiplier} style={[{ color: t.text, ...plain('body') }, style]}>{children}</Text>; }

export function Btn({ title, onPress, kind = 'default', small, block, style, accessibilityLabel, accessibilityHint, nav, expanded, loading, testID, icon }: { testID?: string; /** M1-029: własna ikona (components/Icon) przed tekstem zamiast emoji w tytule; kolor jak tekst przycisku */ icon?: IconName; /** wzorzec „długa akcja” (docs/32 wzorzec 16; HIG Buttons): wskaźnik w przycisku, przycisk nieaktywny */ loading?: boolean; /** wzorzec „rozwijanie” (docs/32): stan rozwinięcia dla VoiceOver, etykieta zostaje stała */ expanded?: boolean; title: string; onPress: () => void; kind?: 'default' | 'primary' | 'ghost' | 'danger'; small?: boolean; block?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string; accessibilityHint?: string; /** F7 (audyt 0.10, UI-08): przycisk przejścia do innego ekranu — podwójne tapnięcie otwiera jeden ekran (jak Item, useOnce) */ nav?: boolean }) {
  const t = useTheme(); const once = useOnce(NAV_LOCK_MS); const press = loading ? () => {} : nav ? once(onPress) : onPress;
  const bg = kind === 'primary' ? t.accent : kind === 'ghost' || kind === 'danger' ? 'transparent' : t.surface2;
  const fg = kind === 'primary' ? t.accentInk : kind === 'danger' ? t.danger : t.text;
  const border = kind === 'primary' ? t.accent : kind === 'danger' ? t.danger : kind === 'ghost' ? 'transparent' : t.line;
  return (
    <Pressable testID={testID} accessibilityLanguage={lang()} onPress={press} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} accessibilityState={expanded === undefined && !loading ? undefined : { ...(expanded === undefined ? {} : { expanded }), ...(loading ? { busy: true, disabled: true } : {}) }} hitSlop={small ? 4 : 0} style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.7 : 1, minHeight: small ? SIZE.hit : kind === 'primary' ? SIZE.buttonPrimary : SIZE.buttonSecondary }, small && { paddingVertical: SPACE.s, paddingHorizontal: SPACE.m }, block && { alignSelf: 'stretch' }, style]}>
      {icon ? <View style={{ marginRight: SPACE.s - 2 }}><Icon name={icon} color={fg} size={small ? SIZE.iconInline : SIZE.iconInline + 1} /></View> : null}
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: fg, ...(small ? { ...font('callout'), ...FW.semibold } : font(kind === 'primary' ? 'buttonPrimary' : 'button')) }}>{title}</Text>
      {loading ? <ActivityIndicator color={fg} style={{ marginLeft: SPACE.s }} /> : null}
    </Pressable>
  );
}
/**
 * Wiersz listy. `icon` = ozdobny znak po prawej wewnątrz wiersza (domyślnie „›”; niewidoczny dla VoiceOver).
 * `right` = osobny element obok wiersza (np. przycisk Start) — nie jest „połykany” przez wiersz w VoiceOver (runda 6).
 * Runda 7: cały wiersz (z odstępami, min. 56 pt) jest polem dotyku, a znaki „+”/„↺” w pickerze są w środku wiersza.
 */
export function Item({ title, sub, right, icon, onPress, dim, accessibilityLabel, accessibilityHint, a11y, a11yLang, titleLang, expanded, selected }: { /** M1-038: język wymowy tytułu (nazwa ćwiczenia z biblioteki → en); element dostępności jest jeden, więc przejmuje go cały wiersz, gdy a11yLang nie podano */ titleLang?: Lang; /** podpowiedź VoiceOver (np. „Otwiera aplikację Mail”) */ accessibilityHint?: string; /** wzorce „rozwijanie” i „wybór” (docs/32): stan dla VoiceOver zamiast dopisku w etykiecie */ expanded?: boolean; selected?: boolean; /** A11-09: język, którym VoiceOver czyta wiersz (domyślnie język aplikacji) */ a11yLang?: string; /** usuwanie przesunięciem: akcja VoiceOver „usuń” (components/SwipeRow.tsx) */ a11y?: import('@/components/SwipeRow').DeleteA11y; title: string; sub?: string; right?: React.ReactNode; icon?: string; onPress?: () => void; /** P-003: wiersz wyszarzony (np. ćwiczenie niedostępne w miejscu) */ dim?: boolean; /** E2: opis dla VoiceOver inny niż „tytuł, podtytuł” (np. „Propozycja 1: …”) */ accessibilityLabel?: string }) {
  const t = useTheme(); const glyph = icon ?? (onPress && !right ? '›' : null); const once = useOnce(NAV_LOCK_MS); // runda 18: podwójne tapnięcie nie otwiera ekranu dwa razy
  return (
    <View style={[s.item, { borderBottomColor: t.line }]}>
      <Pressable accessibilityLanguage={a11yLang ?? titleLang ?? lang()} {...a11y} onPress={onPress ? once(onPress) : undefined} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityState={expanded !== undefined || selected !== undefined ? { ...(expanded !== undefined ? { expanded } : {}), ...(selected !== undefined ? { selected } : {}) } : undefined} accessibilityLabel={accessibilityLabel ?? (sub ? `${title}, ${sub}` : title)} accessibilityHint={accessibilityHint} style={({ pressed }) => [s.itemPress, { opacity: pressed ? 0.6 : 1 }]}>
        <View style={{ flex: 1 }}>
          <Text accessibilityLanguage={a11yLang ?? titleLang ?? lang()} style={{ color: dim ? t.muted : t.text /* A11-16: wyszarzenie kolorem muted (≥ 4,5:1) zamiast przezroczystości 0,5 — wiersz zostaje aktywny */, ...font('bodyStrong') }}>{title}</Text>
          {sub ? <Text accessibilityLanguage={a11yLang ?? lang()} style={{ color: t.muted, ...font('callout'), marginTop: 2 }}>{sub}</Text> : null}
        </View>
        {glyph ? <Text accessible={false} importantForAccessibility="no" maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: t.muted, ...font('body') }}>{glyph}</Text> : null}
      </Pressable>
      {right ?? null}
    </View>
  );
}
/**
 * Runda 9: blokada podwójnego tapnięcia dla przycisków, które tworzą coś i przechodzą dalej. Drugie wywołanie
 * w ciągu `ms` jest ignorowane; potem przycisk znów działa (np. po powrocie na ekran).
 */
/** UI2-02 (audyt kontrolny 1): jedno miejsce czasu blokady przejść — Btn/Chip `nav` i wiersz Item; strażnik: tests/audit-k1-fala2b.test.tsx
 * (każdy przycisk, chip i Pressable z router.push/navigate/replace ma blokadę). */
export const NAV_LOCK_MS = 700;
export function useOnce(ms = 1000) { const last = React.useRef(0); return (fn: () => void) => () => { const now = Date.now(); if (now >= last.current && now - last.current < ms) return; /* zegar cofnięty wstecz nie blokuje przycisku */ last.current = now; fn(); }; }
/* Audyt 0.10 (A11-09): każdy element tych komponentów ma accessibilityLanguage = język aplikacji — VoiceOver czyta głosem wybranego języka,
 * nie języka systemu (język wybrany w aplikacji nie zmienia języka widzianego przez iOS). Lista języków: app/more/language.tsx (kod wiersza). */
/** Etykieta pola przekazywana polom tekstowym jako opis dla VoiceOver (runda 3: pola czytały tylko „4” albo „90”). */
export const FieldLabel = React.createContext<string | undefined>(undefined);
/** Runda 49: kontekst pola w wierszu listy (np. nazwa ćwiczenia w szablonie) — podpowiedź VoiceOver dla pól bez własnej. */
export const FieldHint = React.createContext<string | undefined>(undefined);
/** `info` = objaśnienie pod ⓘ przy etykiecie pola (docs/32 wzorzec 27); wymaga `infoId`. */
export function Field({ label, children, info, infoId }: { label: string; children: React.ReactNode; info?: React.ReactNode | string[]; infoId?: string }) {
  const t = useTheme();
  const head = (bare: boolean) => <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={[{ color: t.muted, ...plain('callout') }, bare ? null : { marginBottom: SPACE.xs }]}>{label}</Text>;
  return <View style={{ marginBottom: SPACE.m }}>{info && infoId ? <InfoTip id={infoId} label={label} info={info} style={{ marginBottom: SPACE.xs }}>{head(true)}</InfoTip> : head(false)}<FieldLabel.Provider value={label}>{children}</FieldLabel.Provider></View>;
}
export function Input(props: TextInputProps & { center?: boolean }) {
  const t = useTheme(); const label = React.useContext(FieldLabel); const hint = React.useContext(FieldHint);
  return <TextInput accessibilityLanguage={lang()} placeholderTextColor={t.muted} maxFontSizeMultiplier={props.multiline ? TEXT_SCALE_MAX : NUM_SCALE_MAX} /* A11N-04: notatki (wiele wierszy) zawijają się — do 200% */ accessibilityLabel={label ?? (typeof props.placeholder === 'string' ? props.placeholder : undefined)} accessibilityHint={hint} {...props} style={[s.input, { backgroundColor: t.surface2, borderColor: t.ctrlLine /* A11-06 */, color: t.text, ...plain('body') }, props.center && { textAlign: 'center', paddingHorizontal: 4 }, props.style]} />;
}
/** Wzorzec „wyszukiwanie” (docs/32 wzorzec 21; HIG Text fields — przycisk czyszczenia): jedyne pole wyszukiwania w aplikacji — placeholder „Szukaj {czego}…”,
 * przycisk czyszczenia podczas pisania, limit 80 znaków, bez autokorekty; autoFocus tylko w oknach wyboru. Pilnuje tests/interaction-guards.test.ts. */
export function SearchField({ placeholder, value, onChangeText, autoFocus }: { placeholder: string; value: string; onChangeText: (v: string) => void; autoFocus?: boolean }) {
  return <Input value={value} onChangeText={onChangeText} placeholder={placeholder} accessibilityLabel={placeholder} maxLength={80} autoCorrect={false} autoFocus={autoFocus} clearButtonMode="while-editing" returnKeyType="search" />;
}
/** Audyt cd60eec MEDIUM: wąskie pola (ciężar 56 pt, RPE 40 pt) — krój mono (0,6 em na znak) ucinał „102,5”; krój tekstu z cyframi tabelarycznymi. */
export const NUM_FONT = { get fontFamily() { return FW.regular.fontFamily; }, get fontWeight() { return FW.regular.fontWeight; } /* M1-024: waga zależy od „Pogrubiony tekst” w chwili renderu */, fontVariant: ['tabular-nums' as const] };
/**
 * Audyt 0.10 (A11-11): krój liczb (od M3 Barlow Condensed; wcześniej IBM Plex Mono) nie ma liter greckich — w tekście tym krojem litery greckie (np. el „προηγ.”,
 * „σωματικό βάρος”, skrót koloru gumy) dostają krój tekstu (systemowy, `bold` — 600), zamiast kroju zastępczego iOS w środku liczby.
 * Test: tests/audit-0.10-lang-ui (ekrany w el bez liter greckich krojem liczb) i matrix-i18n (litery spoza Barlow ⊂ FALLBACK_SCRIPTS).
 */
export const MONO_MISSING = /(\p{Script=Greek}+)/u;
export function monoSafe(v: React.ReactNode, bold = false): React.ReactNode {
  if (typeof v !== 'string' || !MONO_MISSING.test(v)) return v;
  return v.split(MONO_MISSING).map((part, i) => i % 2 ? <Text key={i} accessibilityLanguage={lang()} style={bold ? FW.semibold : FW.regular}>{part}</Text> : part);
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
export function Chip({ label, on, onPress, toggle, a11yLabel, a11yHint, disabled, nav, icon, lead }: { /** M1-029: ikona przed etykietą (zamiast emoji) i opcjonalny tekst przed ikoną (np. „+”) */ icon?: IconName; lead?: string; label: string; on: boolean; onPress: () => void; toggle?: boolean; a11yLabel?: string; a11yHint?: string; disabled?: boolean; /** UI2-02: chip przejścia do innego ekranu — blokada podwójnego tapnięcia jak Btn `nav` */ nav?: boolean }) {
  const t = useTheme(); const field = React.useContext(FieldLabel); const once = useOnce(NAV_LOCK_MS); const press = nav ? once(onPress) : onPress;
  // Runda 49: własna etykieta/podpowiedź (np. chip „✕” wyboru) i stan nieaktywny (chip, który nic nie zmienia).
  const swName = a11yLabel ?? field ?? label;
  /* A11-14: wartość (tekst chipa) tylko wtedy, gdy różni się od nazwy — inaczej VoiceOver czyta „Tydzień deload, Tydzień deload” */
  const a11y = toggle ? { accessibilityRole: 'switch' as const, accessibilityHint: a11yHint, accessibilityLabel: swName, ...(swName !== label ? { accessibilityValue: { text: label } } : {}), accessibilityState: { checked: on, disabled: !!disabled } } : { accessibilityRole: 'button' as const, accessibilityLabel: a11yLabel ?? label, accessibilityHint: a11yHint ?? field, accessibilityState: { selected: on, disabled: !!disabled } };
  return <Pressable accessibilityLanguage={lang()} onPress={disabled ? undefined : press} {...a11y} hitSlop={4} style={[s.chip, { backgroundColor: on ? t.accent : t.surface2, borderColor: on ? t.accent : t.line }, (icon || lead) && { flexDirection: 'row', alignItems: 'center', gap: SPACE.xs }, disabled && !on && { opacity: 0.5 }]}>{lead ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: on ? t.accentInk : t.muted, ...font('footnote'), ...FW.semibold }}>{lead}</Text> : null}{icon ? <Icon name={icon} color={on ? t.accentInk : t.muted} size={SIZE.iconInline} /> : null}<Text accessibilityLanguage={lang()} style={{ color: on ? t.accentInk : t.muted, ...font('footnote'), ...FW.semibold }}>{label}</Text></Pressable>;
}
/**
 * P-002 (02.10.2026): ustawienia jak w Ustawieniach iOS (Apple HIG: przełącznik dla wł./wył., kontrolka segmentowa dla 1 z 2–4).
 * Wiersz z opisem po lewej i systemowym przełącznikiem po prawej — zamiast przycisku na całą szerokość.
 */
export function SwitchRow({ label, detail, value, onChange, disabled, a11yLabel, info, infoId }: { label: string; detail?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; /** P-003 (audyt M7): pełna etykieta dla VoiceOver, np. „Ławka regulowana: ze skosem w dół” */ a11yLabel?: string; /** objaśnienie pod ⓘ przy etykiecie (docs/32 wzorzec 27; wymaga `infoId`); rozwija się pod całym wierszem */ info?: React.ReactNode | string[]; infoId?: string }) {
  const t = useTheme(); const [open, toggle] = useInfoOpen(); const hasInfo = !!(info && infoId);
  const labelEl = <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.text, ...font('body'), flexShrink: 1 }}>{label}</Text>;
  const row = (
    <View style={[s.switchRow, { borderBottomColor: t.line }, hasInfo && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        {hasInfo ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>{labelEl}<InfoButton id={infoId!} label={label} open={open} onToggle={toggle} /></View> : labelEl}
        {detail ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: t.muted, ...font('footnote'), marginTop: 2 }}>{detail}</Text> : null}
      </View>
      <Switch accessibilityLanguage={lang()} testID={'sw-' + label} /* E2E (Maestro): przełącznik po id, nie po kolejności tekstu i przełącznika */ value={value} disabled={disabled} onValueChange={onChange} trackColor={{ true: t.accent, false: t.ctrlLine }} ios_backgroundColor={t.ctrlLine} /* A11-06: tor wyłączonego ≥ 3:1 */
        accessibilityRole="switch" accessibilityLabel={a11yLabel ?? label} accessibilityHint={detail} accessibilityState={{ checked: value, disabled: !!disabled }} />
    </View>
  );
  return hasInfo ? <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line }}>{row}{open ? <InfoBox id={infoId!} info={info} /> : null}</View> : row;
}
export { Segmented, SEG_MIN_SCALE, SEG_FIT_SCALE, SEG_PAD, segEm, segWeight, segLayout } from '@/components/Segmented'; /* strukturalnie (p5d): kontrolka segmentowa w osobnym pliku — limit rozmiaru components/ui.tsx (M1-054) */
/** Nagłówek grupy ustawień (jak sekcje w Ustawieniach iOS). */
/** Audyt 0.10 (A11-02): wersaliki. iOS robi textTransform 'uppercase' bez języka ([NSString uppercaseString]) — w el (tonos) i tr (i → İ)
 * to błąd, więc tam tekst zamienia `upper()` z regułami języka, a VoiceOver czyta zwykły zapis (słowo wersalikami bywa czytane jak skrót).
 * W pozostałych językach systemowe wersaliki = reguły CLDR (test: tests/audit-0.10-lang.test.ts), więc zostaje textTransform. */
export function upperText(children: React.ReactNode): { text: React.ReactNode; label?: string; style: TextStyle } {
  const parts = React.Children.toArray(children);
  if (!LOCALE_UPPER.includes(lang()) || !parts.every(x => typeof x === 'string' || typeof x === 'number')) return { text: children, style: { textTransform: 'uppercase' } };
  const plain = parts.join(''); return { text: upper(plain), label: plain, style: {} };
}
export function SectionTitle({ children, info, infoId }: { children: React.ReactNode; info?: React.ReactNode | string[]; infoId?: string }) {
  const t = useTheme(); const u = upperText(children);
  const head = (bare: boolean) => <Text accessibilityLanguage={lang()} accessibilityRole="header" accessibilityLabel={u.label} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={[{ color: t.muted, ...plain('footnote'), ...FW.semibold, letterSpacing: 0.5 }, bare ? null : { marginTop: SPACE.xl, marginBottom: SPACE.xs }, u.style]}>{u.text}</Text>;
  return info && infoId ? <InfoTip id={infoId} label={plainOf(children)} info={info} style={{ marginTop: SPACE.xl, marginBottom: SPACE.xs }}>{head(true)}</InfoTip> : head(false);
}
/** Pusty stan: gryf z talerzami w barwach motywu A2 (M3, STOP E3; dekoracja ukryta przed VoiceOver, znika przy „Zwiększ kontrast” i dużym tekście) i tekst. */
export function Empty({ children }: { children: React.ReactNode }) { const t = useTheme(); return <View testID="empty" style={[s.empty, { borderColor: t.line }]}><EmptyBarArt /><Text accessibilityLanguage={lang()} style={{ color: t.muted, textAlign: 'center', ...font('callout') }}>{children}</Text></View>; }
/** Wzorzec „nie ma takiego …” (docs/32 wzorzec 15): obiekt z adresu nie istnieje (usunięty, stary link) — pusty stan z grafiką i przyciskiem „Wróć”. */
export function Missing({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <><Empty>{children}</Empty><Btn nav title={tr('Wróć')} block style={{ marginTop: SPACE.m }} onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/'); }} /></>;
}

const s = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: SPACE.m, paddingVertical: SPACE.s, minHeight: SIZE.rowMin, borderBottomWidth: StyleSheet.hairlineWidth },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACE.m, paddingHorizontal: SPACE.l, borderRadius: RADIUS.button, borderWidth: 1, minHeight: SIZE.hit },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACE.s, paddingRight: SPACE.xs, borderBottomWidth: 1 },
  itemPress: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACE.s, paddingVertical: 10 /* wiersz z podpisem: 20 + 22 + 20 = 62 pt (dotąd 64) — układ ekranów z klawiaturą (E2E) bez przesunięć w dół */, paddingHorizontal: SPACE.xs, minHeight: SIZE.rowMin },
  input: { borderWidth: 1, borderRadius: RADIUS.field, paddingVertical: SPACE.s, paddingHorizontal: SPACE.m, minHeight: SIZE.hit }, /* rozmiar i waga: plain('body') w komponencie Input */
  chip: { paddingVertical: SPACE.s, paddingHorizontal: SPACE.m, minHeight: 36, justifyContent: 'center', borderRadius: RADIUS.round, borderWidth: 1, marginRight: 6 },
  empty: { padding: SPACE.xl, borderWidth: 1, borderStyle: 'dashed', borderRadius: RADIUS.group },
});
