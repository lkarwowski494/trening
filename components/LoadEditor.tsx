import React, { useState } from 'react';
import { View } from 'react-native';
import { Btn, Chip, Field, Muted, NumInput, Segmented, FieldHint } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { save } from '@/lib/store';
import { LOAD_PRESETS, equipLabel, type EquipItem } from '@/lib/equipment';
import { achievable, fillRange, type LoadSpec, type LoadUnit } from '@/lib/loads';
import { fmtNum } from '@/lib/units';
import { t } from '@/lib/i18n';
import type { Location, LocEquip } from '@/lib/seed';

/*
 * P-003 E1: edytor dostępnych ciężarów pozycji sprzętu (docs/10, sekcja 3.2). Wartości w jednostce sprzętu (kg albo lb — talerz
 * 45 lb ≠ 20 kg); każda zmiana zapisuje się od razu. Lista: ciężary z przełącznikiem (odznaczasz kg, których nie masz) i skrót
 * „wypełnij zakresem”; uchwyt/gryf + talerze w sztukach; stacja elektryczna: zakres na stronę + krok.
 */
const n = (v: number) => fmtNum(v, 3);
const span = (vals: number[], u: string) => vals.length ? `${n(vals[0])}–${n(vals[vals.length - 1])} ${u}` : '';
/** Podsumowanie osiągalnych ciężarów w jednostce sprzętu (bez przeliczania). */
export function loadSummary(item: EquipItem, spec: LoadSpec): string {
  const u = spec.unit; const vals = (o: Parameters<typeof achievable>[1] = {}) => achievable({ ...spec, unit: 'kg' }, o); /* liczba sztuk i zakres w jednostce sprzętu */
  if (spec.kind === 'electric') { const v = vals(); return v.length ? t('{n} ustawień na stronę: {r}', { n: v.length, r: span(v, u) }) : t('wpisz zakres na stronę i krok'); }
  if (item.id === 'db_plate') { const p = vals({ perStep: 4 }), one = vals({ perStep: 2 }); return p.length ? t('para: {a} ({r}); jeden hantel: {b} ({r1})', { a: p.length, r: span(p, u), b: one.length, r1: span(one, u) }) : t('wpisz uchwyt i talerze'); }
  const v = vals(); return v.length ? t('dostępne: {n} ({r})', { n: v.length, r: span(v, u) }) : t('brak ciężarów — podpowiedź „↑” jak bez miejsca');
}

export default function LoadEditor({ loc, entry, item }: { loc: Location; entry: LocEquip; item: EquipItem }) {
  const th = useTheme(); const spec = entry.load; const [rng, setRng] = useState<{ min: number | ''; max: number | ''; step: number | '' }>({ min: '', max: '', step: '' }); const [add, setAdd] = useState<number | ''>('');
  if (!spec) return null;
  const upd = () => save(loc); const name = equipLabel(item);
  const presets = LOAD_PRESETS.filter(p => p.item === item.id);
  return (
    <FieldHint.Provider value={name}><View style={{ marginLeft: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: th.line, marginVertical: 6, gap: 6 }}>
      <Muted style={{ fontSize: 13 }}>{loadSummary(item, spec)}</Muted>
      <Segmented label={t('Jednostka sprzętu')} options={[['kg', 'kg'], ['lb', 'lb']] as [LoadUnit, string][]} value={spec.unit} onChange={u => { spec.unit = u; upd(); }} />
      {presets.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{presets.map(p => <Chip key={p.id} label={p.label} on={false} a11yHint={t('Wstaw ciężary modelu')} onPress={() => { entry.load = p.spec(); upd(); }} />)}</View> : null}
      {spec.kind === 'list' ? <>
        {spec.items.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{[...spec.items].sort((a, b) => a.w - b.w).map((x, i) => <Chip key={x.w + ':' + i} label={`${n(x.w)}`} on={x.on} a11yLabel={`${n(x.w)} ${spec.unit}`} a11yHint={x.on ? t('Tapnij, by odznaczyć (nie mam)') : t('Tapnij, by zaznaczyć')} onPress={() => { x.on = !x.on; upd(); }} />)}</View> : null}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Field label={t('od')}><NumInput decimal value={rng.min} onNum={v => setRng({ ...rng, min: v })} /></Field></View>
          <View style={{ flex: 1 }}><Field label={t('do')}><NumInput decimal value={rng.max} onNum={v => setRng({ ...rng, max: v })} /></Field></View>
          <View style={{ flex: 1 }}><Field label={t('co')}><NumInput decimal value={rng.step} onNum={v => setRng({ ...rng, step: v })} /></Field></View>
          <View style={{ marginBottom: 12 }}><Btn small title={t('Wypełnij')} accessibilityLabel={t('Wypełnij zakresem')} onPress={() => { if (rng.min === '' || rng.max === '' || rng.step === '') return; const items = fillRange(spec.items, rng.min, rng.max, rng.step); if (!items.length) return; spec.items = items; upd(); }} /></View>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Field label={t('dodaj ciężar')}><NumInput decimal value={add} onNum={setAdd} /></Field></View>
          <View style={{ marginBottom: 12 }}><Btn small title="+" accessibilityLabel={t('Dodaj ciężar')} onPress={() => { if (add === '' || !(add > 0) || add > 1000) return; if (!spec.items.some(x => Math.abs(x.w - add) < 1e-9)) spec.items.push({ w: Math.round(add * 1000) / 1000, on: true }); setAdd(''); upd(); }} /></View>
          {spec.items.some(x => !x.on) ? <View style={{ marginBottom: 12 }}><Btn small kind="ghost" title={t('Usuń odznaczone')} onPress={() => { spec.items = spec.items.filter(x => x.on); upd(); }} /></View> : null}
        </View>
      </> : null}
      {spec.kind === 'plates' ? <>
        <Field label={item.id === 'db_plate' ? t('Uchwyt (jeden, {u})', { u: spec.unit }) : t('Gryf ({u})', { u: spec.unit })}><NumInput decimal value={spec.base} onNum={v => { spec.base = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field>
        <Muted style={{ fontSize: 12 }}>{item.id === 'db_plate' ? t('Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem).') : t('Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem).')}</Muted>
        {spec.plates.map((p, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}><Field label={t('talerz ({u})', { u: spec.unit })}><NumInput decimal value={p.w} onNum={v => { p.w = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
            <View style={{ flex: 1 }}><Field label={t('sztuk')}><NumInput value={p.n} onNum={v => { p.n = v === '' ? 0 : Math.max(0, Math.min(100, Math.round(v))); upd(); }} /></Field></View>
            <View style={{ marginBottom: 12 }}><Btn small kind="ghost" title="✕" accessibilityLabel={t('Usuń talerz')} onPress={() => { spec.plates.splice(i, 1); upd(); }} /></View>
          </View>))}
        <Btn small title={t('+ talerz')} onPress={() => { spec.plates.push({ w: 0, n: 2 }); upd(); }} />
      </> : null}
      {spec.kind === 'electric' ? <View style={{ flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1 }}><Field label={t('min na stronę')}><NumInput decimal value={spec.min} onNum={v => { spec.min = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('max na stronę')}><NumInput decimal value={spec.max} onNum={v => { spec.max = v === '' ? 0 : Math.max(0, Math.min(1000, v)); upd(); }} /></Field></View>
        <View style={{ flex: 1 }}><Field label={t('krok')}><NumInput decimal value={spec.step} onNum={v => { if (v === '' || !(v > 0)) return; spec.step = Math.min(100, v); upd(); }} /></Field></View>
      </View> : null}
    </View></FieldHint.Provider>
  );
}
