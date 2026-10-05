import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, NumInput, Btn, Muted, Txt, FieldLabel, FieldHint, useOnce, Chip } from '@/components/ui';
import { ScrollView as HScroll } from 'react-native';
import { locationLabel } from '@/lib/locations';
import { availability } from '@/lib/equipment';
import { implLabel } from '@/lib/swap';
import { getState, useTick, exById, save, dupTemplate, deleteTemplate, groupLabels, linkWithNext, unlink, moveItem, removeItem, restFor, isBW, startFromTemplate, loadLabel, loadLabelShort, occurrence, occurrences, implAtLoc, startLocationId, locationById } from '@/lib/store';
import { useTheme, F } from '@/lib/theme';
import { hasTime, hasReps, hasWeight } from '@/lib/seed';
import { t, exName } from '@/lib/i18n';
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
  const initialName = useRef(tpl?.name ?? ''); const busy = useRef(false); const once = useOnce(); // runda 6: podwójne „Duplikuj” robiło dwie kopie
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
        <View key={it.id} style={{ borderBottomWidth: 1, borderBottomColor: th.line, paddingVertical: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Txt style={{ fontFamily: F.semibold, flex: 1 }}>{it.groupId ? <Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[it.groupId]} · `}</Txt> : null}{exName(ex)}</Txt>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {next && (!it.groupId || next.groupId !== it.groupId) ? <Btn title="⇅ SS" small kind="ghost" accessibilityLabel={t('Połącz z następnym w superset')} accessibilityHint={nm} onPress={() => linkWithNext(tpl.items, i, tpl)} /> : null}
              {it.groupId ? <Btn title="✂" small kind="ghost" accessibilityLabel={t('Wyjmij z supersetu')} accessibilityHint={nm} onPress={() => unlink(tpl.items, i, tpl)} /> : null}
              {i > 0 ? <Btn title="↑" small kind="ghost" accessibilityLabel={t('Przesuń wyżej')} accessibilityHint={nm} onPress={() => moveItem(tpl.items, i, -1, tpl)} /> : null}
              {next ? <Btn title="↓" small kind="ghost" accessibilityLabel={t('Przesuń niżej')} accessibilityHint={nm} onPress={() => moveItem(tpl.items, i, 1, tpl)} /> : null}
              <Btn title="✕" small kind="ghost" accessibilityLabel={t('Usuń z szablonu')} accessibilityHint={nm} onPress={() => Alert.alert(t('Usunąć z szablonu?'), nm, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { const j = tpl.items.findIndex(x => x.id === it.id); if (j >= 0) removeItem(tpl.items, j, tpl); } }])} />
            </View>
          </View>
          <FieldHint.Provider value={nm}><View style={{ flexDirection: 'row', gap: 6 }}>
            <Col label={t('serie')}><NumInput value={it.sets} onNum={v => { const n = int(v, 1, 50); /* runda 63: ten sam limit co wczytanie i start */ if (n != null) { it.sets = n; save(tpl); } }} /></Col>
            {hasReps(m) ? <><Col label={t('pow. od')}><NumInput value={it.repMin ?? ''} onNum={v => { it.repMin = int(v, 1, 100); save(tpl); }} placeholder="max" /></Col>
            <Col label={t('do')}><NumInput value={it.repMax ?? ''} onNum={v => { it.repMax = int(v, 1, 100); save(tpl); }} /></Col></> : null}
            {hasTime(m) ? <Col label={t('cel s')}><NumInput value={it.targetSec} onNum={v => { it.targetSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))); save(tpl); }} placeholder={t('np. 60')} /></Col> : null}
            <Col label={t('przerwa s')}><NumInput value={it.restSec ?? ''} onNum={v => { it.restSec = int(v, 0, 1800); save(tpl); }} placeholder={String(restFor(ex))} /></Col>
            {hasWeight(m) ? <Col label={t('start {u}', { u: ex ? loadLabelShort(ex, impl) : wu() }) /* runda 63/71: jak nagłówek kolumny w treningu (kg/hant.; MEDIUM 2: stacja — kg/str.) */} a11y={t('start {u}', { u: ex ? loadLabel(ex, impl) : wu() })}><NumInput weightTol decimal allowNegative={!!ex && isBW(ex)} value={wField(it.startWeight)} stored={it.startWeight} onNum={(v, keep) => { it.startWeight = v === '' ? '' : wInKeep(ex && isBW(ex) ? v : Math.max(0, v), keep); /* Q-021 */ save(tpl); }} /></Col> : null}
          </View></FieldHint.Provider>
          {it.alternates?.length ? <Alternates tplId={tpl.id} itemId={it.id} /> : null}
          {hasReps(m) && it.repMin != null && it.repMax != null && it.repMax < it.repMin ? <Muted style={{ fontSize: 12, color: th.danger }}>{t('„do” jest mniejsze niż „od” — zakres pokaże się jako {n}+', { n: it.repMin })}</Muted> : null}
        </View>); })}
      <Btn title={t('+ Dodaj ćwiczenie')} block style={{ marginTop: 12 }} onPress={() => router.push(`/picker?target=template:${tpl.id}`)} />
      <Muted style={{ fontSize: 13, marginTop: 10 }}>{t('Puste „pow. od” = seria do maksimum. „⇅ SS” łączy ćwiczenie z następnym w superset (wspólna przerwa po ostatnim z grupy), „✂” wyjmuje z grupy.')}</Muted>
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
