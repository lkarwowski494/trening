import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Alert, Pressable, ActionSheetIOS, useWindowDimensions } from 'react-native';
import { SetBadge, kindLabel } from '@/components/SetBadge';
import { rowLayout } from '@/components/ActiveWorkout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, NumInput, Btn, Muted, Txt, FieldLabel, FieldHint, useOnce, Chip } from '@/components/ui';
import { ScrollView as HScroll } from 'react-native';
import { locationLabel } from '@/lib/locations';
import { availability } from '@/lib/equipment';
import { implLabel } from '@/lib/swap';
import { getState, useTick, exById, save, dupTemplate, deleteTemplate, groupLabels, linkWithNext, unlink, moveItem, removeItem, restFor, isBW, startFromTemplate, loadLabel, loadLabelShort, occurrence, occurrences, implAtLoc, startLocationId, locationById, tplRows, tplAddRow, tplRemoveRow, tplSetRow, tplSetKind, previousBlockFor, srcSetAt, setSummary, reps, usesBand, tplCycleBand, bandA11y, shortBand } from '@/lib/store';
import { useTheme, F } from '@/lib/theme';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type Template, type TemplateItem } from '@/lib/seed';
import { t, tp, exName } from '@/lib/i18n';
import { wu, wField, wInKeep } from '@/lib/units';

/*
 * Edycja szablonu. Audyt 0.8.1: wiersze kluczowane po id pozycji (przesuwanie nie przenosi wpisywanego pola na inny
 * wiersz), puste pole nie jest od razu zamieniane na domyślną liczbę (można skasować i wpisać nową), usunięcie pozycji
 * pyta o potwierdzenie, a grupy supersetów porządkują się po każdej zmianie.
 */
export default function TemplateEdit() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const th = useTheme();
  const tpl = getState().templates.find(x => x.id === id);
  // Nowy, nietknięty szablon (bez ćwiczeń, z nazwą domyślną) znika po wyjściu — „+ Nowy” i „Wróć” nie zostawiają śmieci (runda 2).
  // Tylko szablon utworzony i niezmieniony (updatedAt = createdAt) — nie usuwamy zapisanych szablonów bez ćwiczeń (runda 3).
  useEffect(() => () => { const x = getState().templates.find(y => y.id === id); if (x && !x.items.length && x.name === t('Nowy szablon') && x.updatedAt === x.createdAt) deleteTemplate(x.id); }, [id]);
  const initialName = useRef(tpl?.name ?? ''); const busy = useRef(false); const once = useOnce();
  /* decyzja właściciela 06.10.2026: zwijane karty ćwiczeń, otwarta jedna; nowo dodane ćwiczenie otwiera się samo */
  const [open, setOpen] = useState<string | null>(null); const known = useRef<Set<string> | null>(null);
  useEffect(() => { const ids = tpl?.items.map(x => x.id) ?? []; if (!known.current) { known.current = new Set(ids); return; } const fresh = ids.filter(x => !known.current!.has(x)); ids.forEach(x => known.current!.add(x)); if (fresh.length) setOpen(fresh[fresh.length - 1]); }); // runda 6: podwójne „Duplikuj” robiło dwie kopie
  if (!tpl) return <Screen><Muted>{t('Nie ma takiego szablonu.')}</Muted></Screen>;
  // Runda 9: dismissTo('/') nie działał, gdy edytor otwarto z zakładki Szablony (POP_TO 'index' spoza stosu) — trening
  // startował, a ekran zostawał w edytorze. Zamykamy cały stos i przechodzimy na zakładkę główną.
  const goHome = () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/'); };
  // Runda 35: porządkowanie nazwy także przed Start/Duplikuj (przyciski działają przy otwartej klawiaturze, zanim pole straci fokus).
  const commitName = () => { const n = tpl.name.replace(/\s+/g, ' ').trim(); if (!n) { tpl.name = initialName.current || t('Nowy szablon'); save(tpl); } else { if (n !== tpl.name) { tpl.name = n; save(tpl); } initialName.current = n; /* runda 49: pusta nazwa wraca do ostatniej zapisanej */ } };
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/templates'); };
  const labels = groupLabels(tpl.items);
  const int = (v: number | '', min: number, max: number) => v === '' ? null : Math.min(max, Math.max(min, Math.round(v)));
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Field label={t('Nazwa')}><Input selectTextOnFocus maxLength={80} value={tpl.name} onChangeText={v => { tpl.name = v; save(tpl); }} onEndEditing={commitName} /></Field>
      {getState().settings.locations.length ? <Field label={t('Miejsce domyślne')} /* P-003 E1: start treningu z tego szablonu — to miejsce (zmiana na starcie: „📍”) */><HScroll horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        <Chip label={t('główne')} on={!tpl.locationId} onPress={() => { if (!tpl.locationId) return; delete tpl.locationId; save(tpl); }} />
        {getState().settings.locations.map(l => <Chip key={l.id} label={l.name} on={tpl.locationId === l.id} onPress={() => { if (tpl.locationId === l.id) return; tpl.locationId = l.id; save(tpl); }} />)}
        {tpl.locationId && !getState().settings.locations.some(l => l.id === tpl.locationId) ? <Chip label={locationLabel(tpl.locationId)} on onPress={() => {}} /> : null}
      </HScroll></Field> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>{tpl.items.length ? <Btn title={getState().active ? t('Trening w toku') : t('Start')} kind={getState().active ? 'ghost' : 'primary'} small onPress={once(() => { commitName(); const act = getState().active; if (act && act.templateId === tpl.id) { goHome(); return; } if (act) { Alert.alert(t('Trening w toku'), t('Najpierw zakończ albo anuluj bieżący trening.')); return; } startFromTemplate(tpl); goHome(); })} /> : null}{tpl.items.length > 1 ? <Btn title={t('≡ Kolejność')} small accessibilityLabel={t('Zmień kolejność ćwiczeń')} onPress={() => { commitName(); router.push(`/reorder?target=template:${tpl.id}`); }} /> : null}{tpl.items.length ? <Btn title={t('Duplikuj')} small onPress={() => { if (busy.current) return; busy.current = true; commitName(); const c = dupTemplate(tpl.id); router.replace(`/template/${c.id}`); }} /> : null}<Btn title={t('Usuń')} small kind="danger" onPress={() => Alert.alert(t('Usunąć szablon?'), undefined, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { if (!getState().templates.some(x => x.id === tpl.id)) return; deleteTemplate(tpl.id); back(); } }])} /></View>
      {tpl.items.map((it, i) => { const ex = exById(it.exerciseId); const m = ex?.metric ?? 'weight_reps'; const next = tpl.items[i + 1]; const nOcc = occurrences(tpl.items, it.exerciseId); const nm = nOcc > 1 ? `${exName(ex)} (${occurrence(tpl.items, i) + 1})` : exName(ex); /* runda 67: dwie pozycje tego samego ćwiczenia rozróżnialne dla VoiceOver */ const impl = implAtLoc(ex, startLocationId(tpl.locationId)); /* MEDIUM 2: przyrząd w miejscu startu szablonu (jak blok po starcie) */ return (
        <View key={it.id} style={{ borderBottomWidth: 1, borderBottomColor: th.line, paddingVertical: 6, gap: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={nm} accessibilityValue={{ text: tplSummary(it) }} accessibilityState={{ expanded: open === it.id }} onPress={() => setOpen(o => o === it.id ? null : it.id)}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 8, opacity: pressed ? 0.6 : 1 })}>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontFamily: F.semibold }}>{it.groupId ? <Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[it.groupId]} · `}</Txt> : null}{exName(ex)}</Txt>
              {open !== it.id ? <Muted style={{ fontSize: 13 }}>{tplSummary(it)}</Muted> : null}
            </View>
            <Muted style={{ fontSize: 16 }}>{open === it.id ? '▾' : '▸'}</Muted>
          </Pressable>
          {open === it.id ? <>
            <TplRows tpl={tpl} it={it} ii={i} nm={nm} />
            {it.alternates?.length ? <Alternates tplId={tpl.id} itemId={it.id} /> : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 6 }}>
              {next && (!it.groupId || next.groupId !== it.groupId) ? <Btn title="⇅ SS" small kind="ghost" accessibilityLabel={t('Połącz z następnym w superset')} accessibilityHint={nm} onPress={() => linkWithNext(tpl.items, i, tpl)} /> : null}
              {it.groupId ? <Btn title="✂ SS" small kind="ghost" accessibilityLabel={t('Wyjmij z supersetu')} accessibilityHint={nm} onPress={() => unlink(tpl.items, i, tpl)} /> : null}
              <View style={{ flex: 1 }} />
              <Btn title={t('Usuń ćwiczenie')} small kind="danger" accessibilityLabel={t('Usuń z szablonu')} accessibilityHint={nm} onPress={() => Alert.alert(t('Usunąć z szablonu?'), nm, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { const j = tpl.items.findIndex(x => x.id === it.id); if (j >= 0) removeItem(tpl.items, j, tpl); } }])} />
            </View>
          </> : null}
        </View>); })}
      <Btn title={t('+ Dodaj ćwiczenie')} block style={{ marginTop: 12 }} onPress={() => router.push(`/picker?target=template:${tpl.id}`)} />
      <Muted style={{ fontSize: 13, marginTop: 10 }}>{t('Dotknij etykiety serii, by zmienić typ albo usunąć serię. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✂ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”.')}</Muted>
    </ScrollView></Screen>
  );
}
/** E2 W3 (docs/14 pkt 4.4, P6 a): zamienniki pozycji per miejsce — podgląd, przerwa zamiennika i usuwanie (dodawanie tylko z treningu: „Zawsze w”).
 * Wpis z usuniętym miejscem: „(usunięte miejsce)”; z ćwiczeniem niedostępnym w miejscu: „brak sprzętu w: …”. */
function Alternates({ tplId, itemId }: { tplId: string; itemId: string }) {
  const th = useTheme(); const tpl = getState().templates.find(x => x.id === tplId); const it = tpl?.items.find(x => x.id === itemId); if (!tpl || !it?.alternates?.length) return null;
  const itEx = exById(it.exerciseId);
  return <View style={{ gap: 4 }}>
    <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{t('Zamienniki')}</Muted>
    {it.alternates.map(a => { const B = exById(a.exerciseId); const place = locationById(a.locationId); const av = B && place ? availability(B, place) : null;
      const name = `${locationLabel(a.locationId)}: ${exName(B)}${a.impl ? ` — ${implLabel(a.impl)}` : ''}`; const key = `${locationLabel(a.locationId)} — ${exName(B)}`;
      return <View key={a.locationId} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ flex: 1 }}><Txt style={{ fontSize: 14 }}>{`📍 ${name}`}</Txt>{av && !av.ok ? <Muted style={{ fontSize: 12, color: th.danger }}>{t('brak sprzętu w: {l}', { l: place!.name })}</Muted> : null}</View>
        <View style={{ width: 72 }}><NumInput value={a.restSec ?? ''} onNum={v => { a.restSec = v === '' ? null : Math.min(1800, Math.max(0, Math.round(v))); save(tpl); }} placeholder={String(it.restSec ?? restFor(itEx))} accessibilityLabel={t('Przerwa zamiennika (s): {name}', { name: key })} /></View>
        <Btn title="✕" small kind="ghost" accessibilityLabel={t('Usuń zamiennik: {name}', { name: key })} onPress={() => Alert.alert(t('Usunąć zamiennik?'), name, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { if (!it.alternates) return; it.alternates = it.alternates.filter(x => x !== a); if (!it.alternates.length) delete it.alternates; save(tpl); } }])} />
      </View>; })}
  </View>;
}
function Col({ label, a11y, children }: { label: string; /** runda 71: pełna nazwa dla VoiceOver, gdy etykieta jest skrócona */ a11y?: string; children: React.ReactNode }) { return <View style={{ flex: 1, justifyContent: 'flex-end' }} /* runda 69: pola w jednej linii, gdy etykieta zawija się */><Muted style={{ fontSize: 11, marginBottom: 3 }} accessibilityLabel={a11y !== label ? a11y : undefined}>{label}</Muted><FieldLabel.Provider value={a11y ?? label}>{children}</FieldLabel.Provider></View>; }

/**
 * Decyzja właściciela 05.10.2026 (docs/17): „Tworzenie szablonu to po prostu nieaktywny trening” — wiersze serii jak w treningu (typ, ostatnio,
 * powtórzenia, ciężar/czas), te same przyciski typów; zakres powtórzeń opcjonalny („i wtedy będą podpowiedzi”).
 */
function TplRows({ tpl, it, ii, nm }: { tpl: Template; it: TemplateItem; ii: number; nm: string }) {
  const th = useTheme(); const { width } = useWindowDimensions(); const ex = exById(it.exerciseId); const m = ex?.metric ?? 'weight_reps';
  const [range, setRange] = useState(it.repMin != null || it.repMax != null);
  const impl = implAtLoc(ex, startLocationId(tpl.locationId)); const band = usesBand(ex); const L = rowLayout(m, band, false, width); const W = L.W; const bands = getState().bands;
  const prev = ex ? previousBlockFor(it.exerciseId, occurrence(tpl.items, ii), occurrences(tpl.items, it.exerciseId), it.id, tpl.id, impl) : null;
  const src = prev ? prev.sets.filter(x => x.kind !== 'drop') : []; const rows = tplRows(it); const kinds = rows.map(r => r.kind);
  const int = (v: number | '', min: number, max: number) => v === '' ? null : Math.min(max, Math.max(min, Math.round(v)));
  let j = 0;
  const menu = (rowId: string, lbl: string) => {
    const labels = [t('Seria normalna'), t('Rozgrzewka (W)'), t('Drop set (D)'), t('Do upadku (F)'), t('Usuń serię'), t('Anuluj')]; const ks = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: labels, cancelButtonIndex: 5, destructiveButtonIndex: 4, title: t('Seria {n}', { n: lbl }) }, i => { if (i < 4) tplSetKind(tpl, it.id, rowId, ks[i]); else if (i === 4) tplRemoveRow(tpl, it.id, rowId); });
  };
  return (
    <FieldHint.Provider value={nm}><View style={{ gap: 2 }}>
      {rows.map((r, k) => { const lbl = kindLabel(kinds, k); const work = r.kind !== 'warmup' && r.kind !== 'drop'; const p = work ? srcSetAt(src, j++) : null; const prevTxt = p && ex ? setSummary(ex, p, 'calc') : '—';
        return (
          <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: W.gap, minHeight: 48 }}>
            <Pressable onPress={() => menu(r.id, lbl)} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('Seria {n}, typ: {k}. Tapnij, by zmienić typ lub usunąć serię.', { n: lbl, k: t(SET_KIND_LABEL[r.kind]) })} style={{ width: W.idx, minHeight: 44, justifyContent: 'center' }}><SetBadge kind={r.kind} label={lbl} /></Pressable>
            <View style={{ flex: 1 }}>{L.prevInline ? <Muted numberOfLines={1} style={{ fontSize: 13 }}>{prevTxt}</Muted> : null}</View>
            {hasWeight(m) ? <View style={{ width: W.w }}><NumInput weightTol decimal allowNegative={!!ex && isBW(ex)} value={wField(r.weight)} stored={r.weight} placeholder={ex ? loadLabelShort(ex, impl) : wu()} accessibilityLabel={ex ? loadLabel(ex, impl) : wu()} onNum={(v, keep) => tplSetRow(tpl, it.id, r.id, { weight: v === '' ? '' : wInKeep(ex && isBW(ex) ? v : Math.max(0, v), keep) })} /></View> : null}
            {hasReps(m) ? <View style={{ width: W.reps }}><NumInput value={r.reps} placeholder={it.repMin != null ? reps(it.repMin, it.repMax) : t('pow.')} accessibilityLabel={t('Powtórzenia')} onNum={v => tplSetRow(tpl, it.id, r.id, { reps: v === '' ? '' : Math.max(0, Math.floor(v)) })} /></View> : null}
            {hasDistance(m) ? <View style={{ width: W.dist }}><NumInput value={r.distanceM} placeholder="m" accessibilityLabel={t('dystans')} onNum={v => tplSetRow(tpl, it.id, r.id, { distanceM: v === '' ? '' : Math.max(0, Math.round(v)) })} /></View> : null}
            {band ? <Pressable accessibilityRole="button" accessibilityHint={nm} accessibilityLabel={t('Guma: {b}. Tapnij, by zmienić.', { b: r.bandId ? bandA11y(bands.find(b => b.id === r.bandId)) : t('brak') })} onPress={() => tplCycleBand(tpl, it.id, r.id)} style={{ width: W.band, minHeight: 40, borderRadius: 8, borderWidth: 1, borderColor: th.line, backgroundColor: th.surface2, alignItems: 'center', justifyContent: 'center' }}><Txt style={{ color: r.bandId ? th.band : th.muted, fontSize: 13, fontFamily: F.semibold }}>{r.bandId ? shortBand(bands.find(b => b.id === r.bandId)) : '—'}</Txt></Pressable> : null}
            {hasTime(m) ? <View style={{ width: W.time }}><NumInput value={r.durationSec} placeholder={t('cel s')} accessibilityLabel={t('cel s')} onNum={v => tplSetRow(tpl, it.id, r.id, { durationSec: v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))) })} /></View> : null}
          </View>); })}
      {!L.prevInline && src.length ? <Muted style={{ fontSize: 12 }}>{t('Poprzednio')}: {src.map(x => ex ? setSummary(ex, x, 'calc') : '').join(', ')}</Muted> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
        <Btn title={t('+ seria')} small accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id)} />
        <Btn title={t('+ rozgrzewka')} small kind="ghost" accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id, 'warmup')} />
        <Btn title={t('+ drop set')} small kind="ghost" accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id, 'drop')} />
        {rows.length > 1 ? <Btn title={t('− seria')} small kind="ghost" accessibilityHint={nm} onPress={() => tplRemoveRow(tpl, it.id)} /> : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', marginTop: 4 }}>
        <View style={{ width: 96 }}><Field label={t('przerwa s')}><NumInput value={it.restSec ?? ''} onNum={v => { it.restSec = int(v, 0, 1800); save(tpl); }} placeholder={String(restFor(ex))} /></Field></View>
        {hasReps(m) && !range ? <Btn title={t('+ zakres powtórzeń')} small kind="ghost" accessibilityHint={nm} style={{ marginBottom: 12 }} onPress={() => setRange(true)} /> : null}
        {hasReps(m) && range ? <>
          <View style={{ width: 72 }}><Field label={t('pow. od')}><NumInput value={it.repMin ?? ''} accessibilityLabel={`${t('powtórzenia od')} — ${nm}`} onNum={v => { it.repMin = int(v, 1, 100); save(tpl); }} /></Field></View>
          <View style={{ width: 72 }}><Field label={t('do')}><NumInput value={it.repMax ?? ''} accessibilityLabel={`${t('powtórzenia do')} — ${nm}`} onNum={v => { it.repMax = int(v, 1, 100); save(tpl); }} /></Field></View>
          <Btn title="✕" small kind="ghost" accessibilityLabel={t('Usuń zakres powtórzeń')} accessibilityHint={nm} style={{ marginBottom: 12 }} onPress={() => { it.repMin = null; it.repMax = null; save(tpl); setRange(false); }} />
        </> : null}
      </View>
      {hasReps(m) && it.repMin != null ? <Muted style={{ fontSize: 12 }}>{t('Zakres powtórzeń: {r} — po osiągnięciu górnej granicy podpowiedź „↑ więcej {u}”.', { r: reps(it.repMin, it.repMax), u: wu() })}</Muted> : null}
      {hasReps(m) && it.repMin != null && it.repMax != null && it.repMax < it.repMin ? <Muted style={{ fontSize: 12, color: th.danger }}>{t('„do” jest mniejsze niż „od” — zakres pokaże się jako {n}+', { n: it.repMin })}</Muted> : null}
    </View></FieldHint.Provider>
  );
}

/** Linijka zwiniętej karty: liczba serii (rozgrzewki osobno), zakres, przerwa. */
function tplSummary(it: TemplateItem): string {
  const rows = tplRows(it); const w = rows.filter(r => r.kind !== 'warmup').length, wu = rows.length - w; const ex = exById(it.exerciseId);
  return [`${w} ${tp(w, 'seria|serie|serii')}`, wu ? t('{n} rozgrz.', { n: wu }) : '', it.repMin != null ? reps(it.repMin, it.repMax) : '', `${it.restSec ?? restFor(ex)} s`].filter(Boolean).join(' · ');
}
