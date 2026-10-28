import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from '@/components/AppText';
import Svg, { Path } from 'react-native-svg';
import { useTheme, font, RADIUS, SIZE, type Theme } from '@/lib/theme';
import { NumInput, monoSafe } from '@/components/ui';
import { exById, typeSetValue, fmtSec, REPS_MAX, DURATION_MAX_SEC } from '@/lib/store';
import { type BoardKey, type Eff } from '@/lib/board';
import { type Exercise, type Workout } from '@/lib/seed';
import { t as tr, lang } from '@/lib/i18n';
import { wu, wField, wInKeep, wOut, dOut, dIn, distLabel, unitLabel, fmtNum } from '@/lib/units';

/* Elementy sterujące tablicy „teraz” (M3 p2): przyciski ±, liczba z wpisem na miejscu, etykiety i teksty liczb — wydzielone z components/NowBoard.tsx. */
function PlusMinus({ plus, color }: { plus: boolean; color: string }) {
  return <Svg width={SIZE.icon} height={SIZE.icon} viewBox="0 0 24 24" accessible={false}><Path d={plus ? 'M12 6v12M6 12h12' : 'M6 12h12'} stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" /></Svg>;
}
export function StepBtn({ plus, label, disabled, onPress, testID, th }: { plus: boolean; label: string; disabled: boolean; onPress: () => void; testID: string; th: Theme }) {
  return <Pressable testID={testID} accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} onPress={disabled ? undefined : onPress} hitSlop={4}
    style={({ pressed }) => ({ width: SIZE.stepButton, height: SIZE.stepButton, borderRadius: RADIUS.round, backgroundColor: th.boardField, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : pressed ? 0.7 : 1 })}><PlusMinus plus={plus} color={th.boardText} /></Pressable>;
}

/** Jednostka pola (etykieta między ±). */
export const unitOf = (k: BoardKey): string => k === 'weight' || k === 'addKg' ? unitLabel() : k === 'reps' ? tr('pow.') : k === 'durationSec' ? tr('sek.') : distLabel();
export const stepLabelKey = (k: BoardKey, plus: boolean, amount: string): string => k === 'reps' ? tr(plus ? 'Zwiększ powtórzenia o 1' : 'Zmniejsz powtórzenia o 1')
  : k === 'durationSec' ? tr(plus ? 'Zwiększ czas o {n}' : 'Zmniejsz czas o {n}', { n: amount }) : k === 'distanceM' ? tr(plus ? 'Zwiększ dystans o {n}' : 'Zmniejsz dystans o {n}', { n: amount })
  : tr(plus ? 'Zwiększ ciężar o {n}' : 'Zmniejsz ciężar o {n}', { n: amount });
/** Tekst liczby na tablicy: „—” gdy brak wartości (nie „0”, 04-studio-projektowe-010); czas jak w polu serii (1:30); masa ciała bez dociążenia — „masa ciała”. */
export function shownValue(ex: Exercise, k: BoardKey, v: number | ''): string {
  if (v === '') return k === 'addKg' ? tr('masa ciała') : '—';
  if (k === 'weight') return fmtNum(wOut(v), wu() === 'lb' ? 1 : 2);
  if (k === 'addKg') return v === 0 ? tr('masa ciała') : `${v > 0 ? '+' : ''}${fmtNum(wOut(v), wu() === 'lb' ? 1 : 2)}`;
  if (k === 'durationSec') return fmtSec(v);
  if (k === 'distanceM') return String(dOut(v));
  return String(v);
}

/** Jedna liczba tablicy: stuknięcie otwiera wpis (NumInput) w tym samym miejscu; `req` — programowe przejście kursora do pola („Seria zrobiona” bez wyniku). */
export function BoardNum({ w, ei, si, k, eff, size, req }: { w: Workout; ei: number; si: number; k: BoardKey; eff: Eff; size: number; req: { setId: string; key: BoardKey; n: number } | null }) {
  const th = useTheme(); const e = w.exercises[ei]; const ex = exById(e.exerciseId)!; const set = e.sets[si]; const v = eff[k] ?? '';
  const [edit, setEdit] = useState(false); const seen = useRef(0);
  useEffect(() => { if (req && req.setId === set.id && req.key === k && req.n !== seen.current) { seen.current = req.n; setEdit(true); } }, [req, set.id, k]);
  const label = k === 'weight' || k === 'addKg' ? tr('ciężar') : k === 'reps' ? tr('powtórzenia') : k === 'durationSec' ? tr('czas') : tr('dystans');
  const sty = { ...font('boardNumber'), fontSize: size, lineHeight: Math.round(size * 0.95), color: th.boardText };
  const word = k === 'addKg' && (v === '' || v === 0); /* „masa ciała” słowem — mniejszym krojem, żeby mieściło się w wierszu */
  if (edit) {
    const common = { autoFocus: true, onBlur: () => setEdit(false), testID: `board-input-${k}`, accessibilityLabel: label, maxFontSizeMultiplier: 1, placeholder: '—', placeholderTextColor: th.boardMuted,
      style: { ...sty, backgroundColor: 'transparent', borderWidth: 0, paddingVertical: 0, paddingHorizontal: 0, minHeight: 0, minWidth: Math.round(size * 0.9), textAlign: 'center' as const } };
    if (k === 'weight' || k === 'addKg') return <NumInput {...common} weightTol decimal allowNegative={k === 'addKg'} value={wField(v)} stored={v} onNum={(x, keep) => { typeSetValue(ei, si, 'load', wInKeep(x, keep)); }} />;
    if (k === 'reps') return <NumInput {...common} value={v} onNum={x => { typeSetValue(ei, si, 'reps', x === '' ? '' : Math.min(REPS_MAX, Math.max(0, Math.floor(x)))); }} />;
    if (k === 'distanceM') return <NumInput {...common} value={dOut(v)} stored={v} onNum={(x, keep) => { typeSetValue(ei, si, 'distanceM', dIn(x, keep)); }} />;
    return <NumInput {...common} value={v} onNum={x => { typeSetValue(ei, si, 'durationSec', x === '' ? '' : Math.min(DURATION_MAX_SEC, Math.max(0, Math.round(x)))); }} />;
  }
  return <Pressable testID={`board-value-${k}`} onPress={() => setEdit(true)} hitSlop={6} accessible={false} accessibilityRole="button" accessibilityLabel={label} accessibilityShowsLargeContentViewer accessibilityLargeContentTitle={`${label}: ${shownValue(ex, k, v)}`}>{/* DEC-10: podgląd liczby po przytrzymaniu (Large Content Viewer) */}
    <Text accessibilityLanguage={lang()} accessible={false} maxFontSizeMultiplier={1} style={word ? { ...font('boardName'), color: th.boardText } : sty}>{monoSafe(shownValue(ex, k, v), true)}</Text>
  </Pressable>;
}

