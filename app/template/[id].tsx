import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Alert, Pressable, ActionSheetIOS, useWindowDimensions } from 'react-native';
import { SetBadge, kindLabel } from '@/components/SetBadge';
import { SwipeRow, lastSetBlock } from '@/components/SwipeRow';
import { rowLayout } from '@/components/ActiveWorkout';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { DraftHeader, confirmDiscard } from '@/components/DraftHeader';
import { Screen, Field, Input, NumInput, Btn, Muted, Txt, H1, Empty, FieldLabel, FieldHint, useOnce, Chip } from '@/components/ui';
import { ScrollView as HScroll } from 'react-native';
import { locationLabel } from '@/lib/locations';
import { availability } from '@/lib/equipment';
import { implLabel } from '@/lib/swap';
import { getState, useTick, exById, save, dupTemplate, templateFolders, setTemplateFolder, setTemplateArchived, TEMPLATE_NOTE_MAX, groupLabels, linkWithNext, unlink, removeItem, restFor, isBW, loadLabel, loadLabelShort, occurrence, occurrences, implAtLoc, startLocationId, locationById, tplRows, tplAddRow, tplRemoveRow, tplSetRow, tplSetKind, previousBlockFor, srcSetAt, setSummary, reps, usesBand, tplCycleBand, bandA11y, shortBand, workCount, tplWorkSets, fmtSec , REPS_MAX , REST_MAX } from '@/lib/store';
import { beginObjDraft, objDraft, objDirty, discardObjDraft, commitObjDraft, dropUnsavedNew } from '@/lib/draft';
import { nowParts } from '@/lib/live';
import { useTheme, F } from '@/lib/theme';
import { hasTime, hasReps, hasWeight, hasDistance, SET_KIND_LABEL, type Template, type TemplateItem, type TRow, type Exercise, type WSet } from '@/lib/seed';
import { t, tp, exName, lang } from '@/lib/i18n';
import { startTemplate } from '@/lib/start';
import { templateUsageText } from '@/lib/plan';
import { wu, wField, wInKeep } from '@/lib/units';

/*
 * Szablon (decyzja właściciela 08.10.2026 ok. 21:30, docs/18): najpierw PODGLĄD „jak trening” ze „Start”; zmiany dopiero po „Edytuj” — edycja
 * na szkicu (lib/draft.ts) z „Anuluj” / „Zapisz” w nagłówku i pytaniem przy wyjściu ze zmianami (ten sam wzór co edycja sesji, components/DraftHeader).
 * „+ Nowy” otwiera od razu edycję (`?edit=1&new=1`); „Anuluj” nowego, niezapisanego szablonu go usuwa. W podglądzie zostają akcje na całym
 * szablonie: Start, Duplikuj, Archiwizuj / Przywróć (z pytaniem o skutki dla planu — audyt 0.10 A7).
 * Audyt 0.8.1 (edycja): wiersze kluczowane po id pozycji, puste pole nie jest od razu zamieniane na domyślną liczbę, usunięcie pozycji pyta
 * o potwierdzenie, a grupy supersetów porządkują się po każdej zmianie.
 */
export default function TemplateScreen() {
  const p = useLocalSearchParams<{ id: string; edit?: string; new?: string }>(); const id = typeof p.id === 'string' ? p.id : ''; useTick(); const router = useRouter();
  const isNew = useRef(p.new === '1');
  const [editing, setEditing] = useState(() => p.edit === '1' && !!beginObjDraft('template', id));
  // Nowy, nietknięty szablon znika po wyjściu — „+ Nowy” i „Wróć” nie zostawiają śmieci (runda 2); zapisane szablony bez ćwiczeń zostają (runda 3).
  useEffect(() => () => { discardObjDraft('template', id); const x = getState().templates.find(y => y.id === id); if (x && (isNew.current || x.name === t('Nowy szablon'))) dropUnsavedNew('template', id); }, [id]);
  const real = getState().templates.find(x => x.id === id); const d = editing ? objDraft<Template>('template', id) : undefined;
  if (!real) return <Screen><Muted>{t('Nie ma takiego szablonu.')}</Muted></Screen>;
  const close = () => { if (router.canGoBack()) router.back(); else router.replace('/templates'); };
  if (editing && d) {
    const cancel = () => confirmDiscard(objDirty('template', id), isNew.current ? t('Nowy szablon nie zostanie zapisany.') : t('Szablon zostanie bez zmian.'), () => {
      discardObjDraft('template', id); setEditing(false); if (isNew.current) { dropUnsavedNew('template', id); close(); } }, () => objDraft('template', id) === d);
    const commit = () => { commitObjDraft('template', id); isNew.current = false; setEditing(false); };
    return <><DraftHeader title={isNew.current ? t('Nowy szablon') : t('Edycja szablonu')} onCancel={cancel} onSave={commit} cancelLabel={t('Anuluj edycję szablonu')} saveLabel={t('Zapisz szablon')} /><TemplateEditor tpl={d} /></>;
  }
  return <><Stack.Screen options={{ title: t('Szablon'), headerBackVisible: true, gestureEnabled: true, headerLeft: undefined, headerRight: undefined }} /><TemplatePreview tpl={real} onEdit={() => { if (beginObjDraft('template', id)) setEditing(true); } /* podwójne tapnięcie — ten sam szkic (beginObjDraft) */} /></>;
}

/** Tekst wiersza szablonu w podglądzie: wartości jak na karcie „teraz” (lib/live.nowParts — „60 kg × 8”); puste powtórzenia — zakres pozycji. */
export function tplRowText(ex: Exercise | undefined, r: TRow, it: TemplateItem): string {
  if (!ex) return '—'; const bw = isBW(ex);
  const set = { weight: bw ? '' : r.weight, addKg: bw ? r.weight : '', reps: r.reps, durationSec: r.durationSec, distanceM: r.distanceM } as unknown as WSet;
  const P = nowParts(ex, set); let txt = `${P.num}${P.unit ? ' ' + P.unit : ''}${P.tail}`;
  if (hasReps(ex.metric ?? 'weight_reps') && r.reps === '' && it.repMin != null) { const i = txt.lastIndexOf('—'); if (i >= 0) txt = txt.slice(0, i) + reps(it.repMin, it.repMax) + txt.slice(i + 1); }
  return txt;
}
function TemplatePreview({ tpl, onEdit }: { tpl: Template; onEdit: () => void }) {
  const router = useRouter(); const th = useTheme(); const once = useOnce(); const busy = useRef(false);
  // Runda 9: start z ekranu otwartego z zakładki Szablony — zamykamy cały stos i przechodzimy na zakładkę główną.
  const goHome = () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/'); };
  const act = getState().active; const labels = groupLabels(tpl.items); const sets = tplWorkSets(tpl);
  const meta = [tpl.folder ? `${t('Folder')}: ${tpl.folder}` : '', getState().settings.locations.length ? `📍 ${locationLabel(tpl.locationId)}` : '', `${tpl.items.length} ${t('ćw.')} · ${sets} ${tp(sets, 'seria|serie|serii')}`, tpl.archived ? t('w archiwum') : ''].filter(Boolean).join(' · ');
  const start = once(() => { const a = getState().active; if (a && a.templateId === tpl.id) { goHome(); return; } if (a) { Alert.alert(t('Trening w toku'), t('Najpierw zakończ albo anuluj bieżący trening.')); return; } startTemplate(tpl, goHome); });
  const archive = () => { const use = tpl.archived ? '' : templateUsageText(tpl.id, true); /* audyt 0.10 A7: szablon w planie — pytanie ze skutkami */ if (!use) { setTemplateArchived(tpl, !tpl.archived); return; } Alert.alert(t('Archiwizować szablon?'), `${tpl.name}\n\n${use}`, [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Archiwizuj'), onPress: () => setTemplateArchived(tpl, true) }]); };
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><H1>{tpl.name}</H1></View><Btn title={t('Edytuj')} small accessibilityLabel={t('Edytuj szablon')} onPress={onEdit} /></View>
      <Muted style={{ marginTop: 2, marginBottom: 10 }}>{meta}</Muted>
      {tpl.note ? <View accessible accessibilityLabel={`${t('Notatka')}: ${tpl.note}`} style={{ borderLeftWidth: 3, borderLeftColor: th.accent, paddingLeft: 10, marginBottom: 12 }}><Txt style={{ fontSize: 15 }}>{tpl.note}</Txt></View> : null /* audyt 0.10 UX-10: notatka (z generatora — linijka wysiłku) */}
      {tpl.items.length ? <Btn title={act ? (act.templateId === tpl.id ? t('Wróć do treningu') : t('Trening w toku')) : t('Start')} kind={act && act.templateId !== tpl.id ? 'ghost' : 'primary'} block style={{ minHeight: 52, marginBottom: 12 }} accessibilityLabel={act ? undefined : t('Start: {name}', { name: tpl.name })} onPress={start} />
        : <Empty>{t('Szablon jest pusty — „Edytuj”, by dodać ćwiczenia.')}</Empty>}
      {tpl.items.map(it => { const ex = exById(it.exerciseId); const rows = tplRows(it); const kinds = rows.map(r => r.kind); const nm = exName(ex);
        const foot = [it.repMin != null ? `${t('zakres')} ${reps(it.repMin, it.repMax)}` : '', `${t('przerwa')} ${fmtSec(it.restSec ?? restFor(ex))}`].filter(Boolean).join(' · ');
        return <View key={it.id} style={{ borderBottomWidth: 1, borderBottomColor: th.line, paddingVertical: 8 }}>
          <Txt accessibilityRole="header" style={{ fontFamily: F.semibold, marginBottom: 4 }}>{it.groupId ? <Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[it.groupId]} · `}</Txt> : null}{nm}</Txt>
          {rows.map((r, k) => { const lbl = kindLabel(kinds, k); const txt = tplRowText(ex, r, it); return <View key={r.id} accessible accessibilityLabel={`${t('Seria {n}', { n: lbl })}${r.kind !== 'normal' ? ` (${t(SET_KIND_LABEL[r.kind])})` : ''}: ${txt}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 28 }}><View style={{ width: 32 }}><SetBadge kind={r.kind} label={lbl} /></View><Txt style={{ fontSize: 15 }}>{txt}</Txt></View>; })}
          <Muted style={{ fontSize: 13, marginTop: 2 }}>{foot}</Muted>
          {it.alternates?.length ? <Muted style={{ fontSize: 12, marginTop: 2 }}>{`${t('Zamienniki')}: ${it.alternates.map(a => `📍 ${locationLabel(a.locationId)}: ${exName(exById(a.exerciseId))}${a.impl ? ` — ${implLabel(a.impl)}` : ''}`).join(', ')}`}</Muted> : null}
        </View>; })}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {tpl.items.length ? <Btn title={t('Duplikuj')} small onPress={() => { if (busy.current) return; busy.current = true; const c = dupTemplate(tpl.id); router.replace(`/template/${c.id}`); }} /> : null}
        <Btn title={tpl.archived ? t('Przywróć z archiwum') : t('Archiwizuj')} small kind="ghost" onPress={archive} />
      </View>
    </ScrollView></Screen>
  );
}

/** Edycja szablonu na szkicu (pola jak dotąd); zmiany trafiają do szablonu dopiero po „Zapisz”. */
function TemplateEditor({ tpl }: { tpl: Template }) {
  const router = useRouter(); const th = useTheme(); const once = useOnce();
  /* decyzja właściciela 06.10.2026: zwijane karty ćwiczeń, otwarta jedna; nowo dodane ćwiczenie otwiera się samo */
  const [open, setOpen] = useState<string | null>(null); const known = useRef<Set<string> | null>(null);
  useEffect(() => { const ids = tpl.items.map(x => x.id); if (!known.current) { known.current = new Set(ids); return; } const fresh = ids.filter(x => !known.current!.has(x)); ids.forEach(x => known.current!.add(x)); if (fresh.length) setOpen(fresh[fresh.length - 1]); });
  const labels = groupLabels(tpl.items);
  const folders = [...new Set([...templateFolders(), ...(tpl.folder ? [tpl.folder] : [])])]; /* folder nowy w szkicu — widoczny przed zapisem */
  const newFolder = () => Alert.prompt?.(t('Nazwa folderu'), undefined, [{ text: t('Anuluj'), style: 'cancel' }, { text: t('Zapisz'), onPress: (v?: string) => { if ((v ?? '').trim()) setTemplateFolder(tpl, v ?? ''); else Alert.alert(t('Pusta nazwa folderu'), t('Folder nie został utworzony.')); /* UI-16 (audyt 0.10): odrzucony wpis nie znika po cichu */ } }], 'plain-text', '');
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Field label={t('Nazwa')}><Input selectTextOnFocus maxLength={80} value={tpl.name} onChangeText={v => { tpl.name = v; save(tpl); }} /* G2 (audyt 0.10): pusta nazwa przy „Zapisz” wraca do poprzedniej (lib/draft.cleanName) */ /></Field>
      {getState().settings.locations.length ? <Field label={t('Miejsce domyślne')} /* P-003 E1: start treningu z tego szablonu — to miejsce (zmiana na starcie: „📍”) */><HScroll horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        <Chip label={t('główne')} on={!tpl.locationId} onPress={() => { if (!tpl.locationId) return; delete tpl.locationId; save(tpl); }} />
        {getState().settings.locations.map(l => <Chip key={l.id} label={l.name} on={tpl.locationId === l.id} onPress={() => { if (tpl.locationId === l.id) return; tpl.locationId = l.id; save(tpl); }} />)}
        {tpl.locationId && !getState().settings.locations.some(l => l.id === tpl.locationId) ? <Chip label={locationLabel(tpl.locationId)} on onPress={() => {}} /> : null}
      </HScroll></Field> : null}
      {/* 07.10.2026 wieczór (docs/21 4a): folder — zmienia tylko użytkownik */}
      <Field label={t('Folder')}><HScroll horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        <Chip label={t('bez folderu')} a11yLabel={`${t('Folder')}: ${t('bez folderu')}`} on={!tpl.folder} onPress={() => setTemplateFolder(tpl, null)} />
        {folders.map(f => <Chip key={f} label={f} a11yLabel={`${t('Folder')}: ${f}`} on={tpl.folder === f} onPress={() => setTemplateFolder(tpl, f)} />)}
        <Btn title={t('+ Nowy folder')} small kind="ghost" onPress={newFolder} />
      </HScroll></Field>
      {/* audyt 0.10 UX-10: notatka szablonu (generator wpisuje linijkę wysiłku — RIR); zmienia i usuwa tylko użytkownik */}
      <Field label={t('Notatka')}><Input value={tpl.note ?? ''} maxLength={TEMPLATE_NOTE_MAX} multiline onChangeText={v => { tpl.note = v; save(tpl); }} /></Field>
      {tpl.items.length > 1 ? <View style={{ flexDirection: 'row', marginBottom: 10 }}><Btn title={t('≡ Kolejność')} small accessibilityLabel={t('Zmień kolejność ćwiczeń')} onPress={once(() => router.push(`/reorder?target=template:${tpl.id}`))} /></View> : null}
      {tpl.items.map((it, i) => { const ex = exById(it.exerciseId); const next = tpl.items[i + 1]; const nOcc = occurrences(tpl.items, it.exerciseId); const nm = nOcc > 1 ? `${exName(ex)} (${occurrence(tpl.items, i) + 1})` : exName(ex); /* runda 67: dwie pozycje tego samego ćwiczenia rozróżnialne dla VoiceOver */ return (
        <View key={it.id} style={{ borderBottomWidth: 1, borderBottomColor: th.line, paddingVertical: 6, gap: 8 }}>
          {/* 07.10.2026 wieczór: usuwanie przesunięciem nagłówka w lewo (components/SwipeRow.tsx), bez przycisku */}
          <SwipeRow testID={`tpl-item-${i}`} /* E2E 08 */ label={t('Usuń ćwiczenie: {name}', { name: nm })} title={t('Usunąć z szablonu?')} message={nm} onDelete={() => { const j = tpl.items.findIndex(x => x.id === it.id); if (j >= 0) removeItem(tpl.items, j, tpl); }}>{a11y => <Pressable accessibilityLanguage={lang()} {...a11y} accessibilityRole="button" accessibilityLabel={nm} accessibilityValue={{ text: tplSummary(it) }} accessibilityState={{ expanded: open === it.id }} onPress={() => setOpen(o => o === it.id ? null : it.id)}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 8, opacity: pressed ? 0.6 : 1 })}>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontFamily: F.semibold }}>{it.groupId ? <Txt style={{ color: th.band, fontFamily: F.semibold }}>{`SS ${labels[it.groupId]} · `}</Txt> : null}{exName(ex)}</Txt>
              {open !== it.id ? <Muted style={{ fontSize: 13 }}>{tplSummary(it)}</Muted> : null}
            </View>
            <Muted style={{ fontSize: 16 }}>{open === it.id ? '▾' : '▸'}</Muted>
          </Pressable>}</SwipeRow>
          {open === it.id ? <>
            <TplRows tpl={tpl} it={it} ii={i} nm={nm} />
            {it.alternates?.length ? <Alternates tpl={tpl} itemId={it.id} /> : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 6 }}>
              {next && (!it.groupId || next.groupId !== it.groupId) ? <Btn title="⇅ SS" small kind="ghost" accessibilityLabel={t('Połącz z następnym w superset')} accessibilityHint={nm} onPress={() => linkWithNext(tpl.items, i, tpl)} /> : null}
              {it.groupId ? <Btn title="✂ SS" small kind="ghost" accessibilityLabel={t('Wyjmij z supersetu')} accessibilityHint={nm} onPress={() => unlink(tpl.items, i, tpl)} /> : null}
            </View>
          </> : null}
        </View>); })}
      <Btn title={t('+ Dodaj ćwiczenie')} block style={{ marginTop: 12 }} onPress={once(() => router.push(`/picker?target=template:${tpl.id}`))} />
      <Muted style={{ fontSize: 13, marginTop: 10 }}>{t('Dotknij etykiety serii, by zmienić typ; przesuń wiersz w lewo, by go usunąć. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✂ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”.')}</Muted>
    </ScrollView></Screen>
  );
}
/** E2 W3 (docs/14 pkt 4.4, P6 a): zamienniki pozycji per miejsce — podgląd, przerwa zamiennika i usuwanie (dodawanie tylko z treningu: „Zawsze w”).
 * Wpis z usuniętym miejscem: „(usunięte miejsce)”; z ćwiczeniem niedostępnym w miejscu: „brak sprzętu w: …”. */
function Alternates({ tpl, itemId }: { tpl: Template; itemId: string }) {
  const th = useTheme(); const it = tpl.items.find(x => x.id === itemId); if (!it?.alternates?.length) return null;
  const itEx = exById(it.exerciseId);
  return <View style={{ gap: 4 }}>
    <Muted style={{ fontSize: 12, fontFamily: F.semibold }}>{t('Zamienniki')}</Muted>
    {it.alternates.map(a => { const B = exById(a.exerciseId); const place = locationById(a.locationId); const av = B && place ? availability(B, place) : null;
      const name = `${locationLabel(a.locationId)}: ${exName(B)}${a.impl ? ` — ${implLabel(a.impl)}` : ''}`; const key = `${locationLabel(a.locationId)} — ${exName(B)}`;
      return <SwipeRow key={a.locationId} label={t('Usuń zamiennik: {name}', { name: key })} title={t('Usunąć zamiennik?')} message={name} onDelete={() => { if (!it.alternates) return; it.alternates = it.alternates.filter(x => x !== a); if (!it.alternates.length) delete it.alternates; save(tpl); }}>{a11y => <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ flex: 1 }}><View accessibilityLanguage={lang()} {...a11y} accessible accessibilityLabel={name}><Txt style={{ fontSize: 14 }}>{`📍 ${name}`}</Txt></View>{av && !av.ok ? <Muted style={{ fontSize: 12, color: th.danger }}>{t('brak sprzętu w: {l}', { l: place!.name })}</Muted> : null}</View>
        <View style={{ width: 72 }}><NumInput value={a.restSec ?? ''} onNum={v => { a.restSec = v === '' ? null : Math.min(REST_MAX, Math.max(0, Math.round(v))); save(tpl); }} placeholder={String(it.restSec ?? restFor(itEx))} accessibilityLabel={t('Przerwa zamiennika (s): {name}', { name: key })} /></View>
      </View>}</SwipeRow>; })}
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
    /* 07.10.2026 wieczór: usuwanie serii — przesunięciem wiersza w lewo, nie z menu */
    const labels = [t('Seria normalna'), t('Rozgrzewka (W)'), t('Drop set (D)'), t('Do upadku (F)'), t('Anuluj')]; const ks = ['normal', 'warmup', 'drop', 'failure'] as const;
    ActionSheetIOS.showActionSheetWithOptions({ options: labels, cancelButtonIndex: 4, title: t('Seria {n}', { n: lbl }) }, i => { if (i < 4) tplSetKind(tpl, it.id, rowId, ks[i]); });
  };
  return (
    <FieldHint.Provider value={nm}><View style={{ gap: 2 }}>
      {rows.map((r, k) => { const lbl = kindLabel(kinds, k); const work = r.kind !== 'warmup' && r.kind !== 'drop'; const p = work ? srcSetAt(src, j++) : null; const prevTxt = p && ex ? setSummary(ex, p, 'calc') : '—';
        return (
          <SwipeRow key={r.id} testID={`tpl-row-${ii}-${k}`} /* E2E 08 */ disabled={rows.length <= 1} blocked={lastSetBlock()} /* G4 */ label={t('Usuń serię {n} — {ex}', { n: lbl, ex: nm })} title={t('Usunąć serię?')} message={nm} onDelete={() => { if (tplRows(it).length > 1) tplRemoveRow(tpl, it.id, r.id); }}>{a11y => <View style={{ flexDirection: 'row', alignItems: 'center', gap: W.gap, minHeight: 48 }}>
            <Pressable accessibilityLanguage={lang()} {...a11y} onPress={() => menu(r.id, lbl)} hitSlop={8} accessibilityRole="button" accessibilityHint={t('Tapnij, by zmienić typ.')} /* A11-18 */ accessibilityLabel={t('Seria {n}, typ: {k}', { n: lbl, k: t(SET_KIND_LABEL[r.kind]) })} style={{ width: W.idx, minHeight: 44, justifyContent: 'center' }}><SetBadge kind={r.kind} label={lbl} /></Pressable>
            <View style={{ flex: 1 }}>{L.prevInline ? <Muted numberOfLines={1} style={{ fontSize: 13 }}>{prevTxt}</Muted> : null}</View>
            {hasWeight(m) ? <View style={{ width: W.w }}><NumInput weightTol decimal allowNegative={!!ex && isBW(ex)} value={wField(r.weight)} stored={r.weight} placeholder={ex ? loadLabelShort(ex, impl) : wu()} testID={`tpl-w-${ii}-${k}`} /* E2E (Maestro 08): pole ciężaru wiersza k pozycji ii */ accessibilityLabel={ex ? loadLabel(ex, impl) : wu()} onNum={(v, keep) => tplSetRow(tpl, it.id, r.id, { weight: v === '' ? '' : wInKeep(ex && isBW(ex) ? v : Math.max(0, v), keep) })} /></View> : null}
            {hasReps(m) ? <View style={{ width: W.reps }}><NumInput value={r.reps} placeholder={it.repMin != null ? reps(it.repMin, it.repMax) : t('pow.')} testID={`tpl-r-${ii}-${k}`} /* E2E (Maestro 08) */ accessibilityLabel={t('Powtórzenia')} onNum={v => tplSetRow(tpl, it.id, r.id, { reps: v === '' ? '' : Math.min(REPS_MAX, Math.max(0, Math.floor(v))) }) /* UI-16 */} /></View> : null}
            {hasDistance(m) ? <View style={{ width: W.dist }}><NumInput value={r.distanceM} placeholder="m" accessibilityLabel={t('dystans')} onNum={v => tplSetRow(tpl, it.id, r.id, { distanceM: v === '' ? '' : Math.max(0, Math.round(v)) })} /></View> : null}
            {hasTime(m) ? <View style={{ width: W.time }}><NumInput value={r.durationSec} placeholder={t('cel s')} accessibilityLabel={t('cel s')} onNum={v => tplSetRow(tpl, it.id, r.id, { durationSec: v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))) })} /></View> : null}
            {band ? <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityHint={`${nm}. ${t('Tapnij, by zmienić.')}`} /* A11-18 */ accessibilityLabel={t('Guma: {b}', { b: r.bandId ? bandA11y(bands.find(b => b.id === r.bandId)) : t('brak') })} onPress={() => tplCycleBand(tpl, it.id, r.id)} style={{ width: W.band, minHeight: 40, borderRadius: 8, borderWidth: 1, borderColor: th.line, backgroundColor: th.surface2, alignItems: 'center', justifyContent: 'center' }}><Txt style={{ color: r.bandId ? th.band : th.muted, fontSize: 13, fontFamily: F.semibold }}>{r.bandId ? shortBand(bands.find(b => b.id === r.bandId)) : '—'}</Txt></Pressable> : null}
          </View>}</SwipeRow>); })}
      {!L.prevInline && src.length ? <Muted style={{ fontSize: 12 }}>{t('Poprzednio')}: {src.map(x => ex ? setSummary(ex, x, 'calc') : '').join(', ')}</Muted> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
        <Btn title={t('+ seria')} small accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id)} />
        <Btn title={t('+ rozgrzewka')} small kind="ghost" accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id, 'warmup')} />
        <Btn title={t('+ drop set')} small kind="ghost" accessibilityHint={nm} onPress={() => tplAddRow(tpl, it.id, 'drop')} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', marginTop: 4 }}>
        <View style={{ width: 96 }}><Field label={t('przerwa s')}><NumInput value={it.restSec ?? ''} onNum={v => { it.restSec = int(v, 0, REST_MAX); save(tpl); }} placeholder={String(restFor(ex))} /></Field></View>
        {hasReps(m) && !range ? <Btn title={t('+ zakres powtórzeń')} small kind="ghost" accessibilityHint={nm} style={{ marginBottom: 12 }} onPress={() => setRange(true)} /> : null}
        {hasReps(m) && range ? <>
          <View style={{ width: 72 }}><Field label={t('pow. od')}><NumInput value={it.repMin ?? ''} accessibilityLabel={`${t('powtórzenia od')} — ${nm}`} onNum={v => { it.repMin = int(v, 1, 100); save(tpl); }} /></Field></View>
          <View style={{ width: 72 }}><Field label={t('do')}><NumInput value={it.repMax ?? ''} accessibilityLabel={`${t('powtórzenia do')} — ${nm}`} onNum={v => { it.repMax = int(v, 1, 100); save(tpl); }} /></Field></View>
          <Btn title="✕" small kind="ghost" accessibilityLabel={t('Usuń zakres powtórzeń')} accessibilityHint={nm} style={{ marginBottom: 12 }} onPress={() => { it.repMin = null; it.repMax = null; save(tpl); setRange(false); }} />
        </> : null}
      </View>
      {/* MER-13 (audyt 0.10): opis zgodny z podpowiedzią („↑ spróbuj 62,5”, „↑ spróbuj 9 pow.”) i tylko tam, gdzie ona się pojawia (store.progressionFor:
       * ciężar + powtórzenia, zamknięty zakres, włączona w Ustawieniach) — przy zakresie otwartym „8+” jej nie ma */}
      {m === 'weight_reps' && it.repMin != null && it.repMax != null && it.repMax >= it.repMin && getState().settings.progressHint ? <Muted style={{ fontSize: 12 }}>{t('Zakres powtórzeń: {r} — gdy ostatnio wszystkie serie robocze miały co najmniej {n} powt., przy ćwiczeniu pojawi się podpowiedź „↑ spróbuj …”: większy ciężar albo powtórzenie więcej (poza tygodniem deload).', { r: reps(it.repMin, it.repMax), n: it.repMax })}</Muted> : null}
      {hasReps(m) && it.repMin != null && it.repMax != null && it.repMax < it.repMin ? <Muted style={{ fontSize: 12, color: th.danger }}>{t('„do” jest mniejsze niż „od” — zakres pokaże się jako {n}+', { n: it.repMin })}</Muted> : null}
    </View></FieldHint.Provider>
  );
}

/** Linijka zwiniętej karty: liczba serii (rozgrzewki osobno), zakres, przerwa. */
function tplSummary(it: TemplateItem): string {
  const rows = tplRows(it); const w = workCount(rows.map(r => r.kind)), wu = rows.filter(r => r.kind === 'warmup').length; const ex = exById(it.exerciseId); /* D3 (audyt 0.10): drop razem z serią */
  return [`${w} ${tp(w, 'seria|serie|serii')}`, wu ? t('{n} rozgrz.', { n: wu }) : '', it.repMin != null ? reps(it.repMin, it.repMax) : '', fmtSec(it.restSec ?? restFor(ex)) /* H3 (audyt 0.10 UI-13): przerwa jak w treningu i historii (2:30) */].filter(Boolean).join(' · ');
}
