import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Btn, Chip, Field, Muted, NumInput, Segmented, FieldHint } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { locationEdited } from '@/lib/locations';
import { LOAD_PRESETS, equipLabel, type EquipItem } from '@/lib/equipment';
import { achievable, fillRange, convertSpec, validateSpec, rangeCount, LOAD_LIMITS, W_MIN, W_MAX, type LoadSpec, type LoadUnit, type SpecProblem } from '@/lib/loads';
import { fmtNum } from '@/lib/units';
import { t } from '@/lib/i18n';
import type { Location, LocEquip } from '@/lib/seed';

/*
 * P-003 E1: edytor dostępnych ciężarów pozycji sprzętu (docs/10, sekcja 3.2). Wartości w jednostce sprzętu (kg albo lb — talerz
 * 45 lb ≠ 20 kg); każda zmiana zapisuje się od razu. Lista: ciężary z przełącznikiem (odznaczasz kg, których nie masz) i skrót
 * „wypełnij zakresem”; uchwyt/gryf + talerze w sztukach; stacja elektryczna: zakres na stronę + krok.
 * Audyt E1: limity wspólne z sanityzacją (LOAD_LIMITS) widoczne w edytorze, nic nie jest ucinane po cichu (H1, M11); zmiana jednostki
 * przelicza wartości (M4); preset modelu nie nadpisuje wpisanych ciężarów bez pytania (M5); przyciski i ciężary z nazwą pozycji (M7).
 */
const n = (v: number) => fmtNum(v, 3);
/** Weryfikacja 3 (L4): wartości w polach do 3 miejsc po przecinku (po zmianie jednostki zapis ma dokładny współczynnik, np. 2,755778 lb). */
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const span = (vals: number[], u: string) => vals.length ? `${n(vals[0])}–${n(vals[vals.length - 1])} ${u}` : '';
const PROBLEM: Record<SpecProblem, () => string> = {
  list_too_long: () => t('Za dużo ciężarów (najwyżej {n}).', { n: LOAD_LIMITS.listItems }),
  plates_too_many_rows: () => t('Za dużo rodzajów talerzy (najwyżej {n}).', { n: LOAD_LIMITS.plateRows }),
  plates_too_many_combos: () => t('Za dużo kombinacji talerzy — ciężary nie są liczone. Usuń nietypowe talerze.'),
  range_invalid: () => t('Zakres jest niepoprawny: „max” musi być ≥ „min”, krok > 0. Ciężary nie są liczone.'),
  range_too_many: () => t('Za dużo ustawień (najwyżej {n}) — zwiększ krok.', { n: LOAD_LIMITS.rangeValues }),
};
/** Podsumowanie osiągalnych ciężarów w jednostce sprzętu (bez przeliczania). */
export function loadSummary(item: EquipItem, spec: LoadSpec): string {
  const bad = validateSpec(spec); if (bad) return PROBLEM[bad]();
  const u = spec.unit; const vals = (o: Parameters<typeof achievable>[1] = {}) => achievable({ ...spec, unit: 'kg' }, o); /* liczba sztuk i zakres w jednostce sprzętu */
  if (spec.kind === 'electric') { const v = vals(); return v.length ? t('Ustawienia na stronę: {n} ({r})', { n: v.length, r: span(v, u) }) : t('wpisz zakres na stronę i krok'); }
  if (item.id === 'db_plate') { const p = vals({ perStep: 4 }), one = vals({ perStep: 2 }); return p.length ? t('para: {a} ({r}); jeden hantel: {b} ({r1})', { a: p.length, r: span(p, u), b: one.length, r1: span(one, u) }) : t('wpisz uchwyt i talerze'); }
  const v = vals(); return v.length ? t('dostępne: {n} ({r})', { n: v.length, r: span(v, u) }) : t('brak ciężarów — podpowiedź „↑” jak bez miejsca');
}
/** Czy opis ma już wpisane wartości (preset modelu pyta przed nadpisaniem). */
const filled = (s: LoadSpec) => s.kind === 'list' ? s.items.length > 0 : s.kind === 'plates' ? s.plates.length > 0 : s.max > 0 || s.min > 0;

export default function LoadEditor({ loc, entry, item }: { loc: Location; entry: LocEquip; item: EquipItem }) {
  const th = useTheme(); const spec = entry.load; const [rng, setRng] = useState<{ min: number | ''; max: number | ''; step: number | '' }>({ min: '', max: '', step: '' }); const [add, setAdd] = useState<number | ''>(''); const [msg, setMsg] = useState('');
  if (!spec) return null;
  const upd = () => { setMsg(''); locationEdited(loc); }; /* runda 82c (LOW 2): przyrządy bloków treningu w toku w tym miejscu od nowa */ const name = equipLabel(item); const lbl = (s: string) => `${s} — ${name}`;
  const presets = LOAD_PRESETS.filter(p => p.item === item.id);
  const applyPreset = (p: typeof presets[number]) => { const go = () => { entry.load = p.spec(); upd(); };
    if (!filled(spec)) { go(); return; }
    Alert.alert(t('Zastąpić wpisane ciężary?'), t('{p} zastąpi ciężary wpisane dla: {i}.', { p: equipLabel(p.label), i: name }), [{ text: t('Nie') }, { text: t('Zastąp'), style: 'destructive', onPress: go }]); };
  const problem = validateSpec(spec);
  return (
    <FieldHint.Provider value={name}><View style={{ marginLeft: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: th.line, marginVertical: 6, gap: 6 }}>
      <Muted style={{ fontSize: 13, color: problem ? th.danger : th.muted }}>{loadSummary(item, spec)}</Muted>
      <Segmented label={lbl(t('Jednostka sprzętu'))} options={[['kg', 'kg'], ['lb', 'lb']] as [LoadUnit, string][]} value={spec.unit} onChange={u => { entry.load = convertSpec(spec, u); upd(); }} />
      {presets.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{presets.map(p => <Chip key={p.id} label={equipLabel(p.label)} on={false} a11yHint={lbl(t('Wstaw ciężary modelu'))} onPress={() => applyPreset(p)} />)}</View> : null}
      {spec.kind === 'list' ? <>
        {spec.items.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{[...spec.items].sort((a, b) => a.w - b.w).map((x, i) => <Chip key={x.w + ':' + i} toggle label={`${n(x.w)}`} on={x.on} a11yLabel={`${n(x.w)} ${spec.unit}`} a11yHint={name} /* weryfikacja 2: nazwa pozycji */ onPress={() => { x.on = !x.on; upd(); }} />)}</View> : null}
        <Muted style={{ fontSize: 12 }}>{t('Odznacz ciężary, których nie masz. Najwyżej {n} ciężarów.', { n: LOAD_LIMITS.listItems })}</Muted>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Field label={t('od')}><NumInput decimal value={rng.min} onNum={v => setRng({ ...rng, min: v })} /></Field></View>
          <View style={{ flex: 1 }}><Field label={t('do')}><NumInput decimal value={rng.max} onNum={v => setRng({ ...rng, max: v })} /></Field></View>
          <View style={{ flex: 1 }}><Field label={t('co')}><NumInput decimal value={rng.step} onNum={v => setRng({ ...rng, step: v })} /></Field></View>
          <View style={{ marginBottom: 12 }}><Btn small title={t('Wypełnij')} accessibilityLabel={lbl(t('Wypełnij zakresem'))} onPress={() => { if (rng.min === '' || rng.max === '' || rng.step === '') return; const items = fillRange(spec.items, rng.min, rng.max, rng.step);
            if (!items) { const c = rangeCount(rng.min, rng.max, rng.step); setMsg(c == null || rng.min < W_MIN || rng.max > W_MAX || rng.step < W_MIN ? t('Zakres jest niepoprawny: „do” musi być ≥ „od”, krok > 0, wartości od {a} do {b}.', { a: fmtNum(W_MIN, 3), b: W_MAX }) : t('Ciężarów w tym zakresie: {c} — najwyżej {n}. Zwiększ krok.', { c, n: LOAD_LIMITS.listItems })); return; }
            spec.items = items; upd(); }} /></View>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Field label={t('dodaj ciężar')}><NumInput decimal value={add} onNum={setAdd} /></Field></View>
          <View style={{ marginBottom: 12 }}><Btn small title="+" accessibilityLabel={lbl(t('Dodaj ciężar'))} onPress={() => { if (add === '' || add < W_MIN || add > W_MAX) { if (add !== '') setMsg(t('Ciężar od {a} do {b}.', { a: fmtNum(W_MIN, 3), b: W_MAX })); return; } if (!spec.items.some(x => Math.abs(x.w - add) < 1e-9)) { if (spec.items.length >= LOAD_LIMITS.listItems) { setMsg(t('Za dużo ciężarów (najwyżej {n}).', { n: LOAD_LIMITS.listItems })); return; } spec.items.push({ w: Math.round(add * 1000) / 1000, on: true }); } setAdd(''); upd(); }} /></View>
          {spec.items.some(x => !x.on) ? <View style={{ marginBottom: 12 }}><Btn small kind="ghost" title={t('Usuń odznaczone')} accessibilityLabel={lbl(t('Usuń odznaczone'))} onPress={() => { spec.items = spec.items.filter(x => x.on); upd(); }} /></View> : null}
        </View>
      </> : null}
      {spec.kind === 'plates' ? <>
        <Field label={item.id === 'db_plate' ? t('Uchwyt (jeden, {u})', { u: spec.unit }) : t('Gryf ({u})', { u: spec.unit })}><NumInput decimal value={r3(spec.base)} onNum={v => { spec.base = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field>
        <Muted style={{ fontSize: 12 }}>{(item.id === 'db_plate' ? t('Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem).') : t('Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem).')) + ' ' + t('Najwyżej {n} rodzajów.', { n: LOAD_LIMITS.plateRows })}</Muted>
        {spec.plates.map((p, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}><Field label={t('talerz ({u})', { u: spec.unit })}><NumInput decimal value={r3(p.w)} onNum={v => { p.w = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
            <View style={{ flex: 1 }}><Field label={t('sztuk')}><NumInput value={p.n} onNum={v => { p.n = v === '' ? 0 : Math.max(0, Math.min(100, Math.round(v))); upd(); }} /></Field></View>
            <View style={{ marginBottom: 12 }}><Btn small kind="ghost" title="✕" accessibilityLabel={lbl(t('Usuń talerz'))} onPress={() => { spec.plates.splice(i, 1); upd(); }} /></View>
          </View>))}
        {spec.plates.length < LOAD_LIMITS.plateRows ? <Btn small title={t('+ talerz')} accessibilityLabel={lbl(t('+ talerz'))} onPress={() => { spec.plates.push({ w: 0, n: 2 }); upd(); }} /> : null}
      </> : null}
      {spec.kind === 'electric' ? <Muted style={{ fontSize: 12 }}>{t('Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie.')}</Muted> : null /* decyzja 03.10.2026: „ViShape na stronę” */}
      {spec.kind === 'electric' ? <View style={{ flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1 }}><Field label={t('min na stronę')}><NumInput decimal value={r3(spec.min)} onNum={v => { spec.min = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('max na stronę')}><NumInput decimal value={r3(spec.max)} onNum={v => { spec.max = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('krok')}><NumInput decimal value={r3(spec.step)} onNum={v => { if (v === '' || v < W_MIN) return; spec.step = Math.min(100, v); upd(); }} /></Field></View>
      </View> : null}
      {msg ? <Muted style={{ fontSize: 12, color: th.danger }}>{msg}</Muted> : null}
    </View></FieldHint.Provider>
  );
}
