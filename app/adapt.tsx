import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Screen, Item, Muted, Empty, SectionTitle, SwitchRow, Missing } from '@/components/ui';
import { getState, useTick, exById, locationById, adaptActive } from '@/lib/store';
import { useCloseHeader, useDismiss } from '@/components/CloseButton';
import { afterSwap } from '@/components/ActiveWorkout';
import { adaptCandidates, restoreCandidates, type AdaptRow, type AdaptChoice } from '@/lib/adapt';
import { onAdaptPick } from '@/lib/adaptPick';
import { missingLabel } from '@/lib/equipment';
import { implLabel, reasonText } from '@/lib/swap';
import { confirm, confirmSkipTimedSet } from '@/lib/confirm';
import * as timer from '@/lib/timer';
import { announce } from '@/lib/announce';
import { t, tp, exName } from '@/lib/i18n';

/**
 * 0.18 „Dostosuj do miejsca” (docs/33, decyzje właściciela P2 A, P3 A, P5 A): okno z propozycjami zamian ćwiczeń niedostępnych w miejscu treningu.
 * Otwiera się samo po zmianie „📍” na miejsce z brakami lub z ćwiczeniami do przywrócenia i z wiersza „N ćwiczeń bez sprzętu · Dostosuj” pod chipem.
 * Tylko propozycje do przejrzenia: „Anuluj” (po lewej, wzorzec docs/32) nic nie zmienia; „Zastosuj (n)” (po prawej) → `adaptActive` (lib/state/swap.ts) —
 * jeden zapis; szablon i plan bez zmian. Stuknięcie wiersza → arkusz zamiany `swap?target=adapt:<id bloku>` (zwraca wybór, nie zapisuje).
 */
export default function AdaptScreen() {
  useTick(); const dismiss = useDismiss(); const router = useRouter(); const busy = useRef(false);
  /* wybory ręczne (null = „Bez zmian”); brak wpisu = propozycja domyślna wiersza */
  const [over, setOver] = useState<Record<string, AdaptChoice | null>>({}); const [off, setOff] = useState<Record<string, boolean>>({});
  useEffect(() => onAdaptPick(p => setOver(o => ({ ...o, [p.blockId]: p.choice }))), []);
  const a = getState().active; const loc = locationById(a?.locationId);
  const rows = a && loc ? adaptCandidates(a, loc.id) : []; const back = a && loc ? restoreCandidates(a, loc.id) : [];
  const chosenOf = (r: AdaptRow): AdaptChoice | null => (r.blockId in over ? over[r.blockId] : r.choice);
  const choices: AdaptChoice[] = [...rows.map(chosenOf).filter((c): c is AdaptChoice => !!c), ...back.filter(r => !off[r.blockId]).map(r => r.choice)];
  const n = choices.length;
  const apply = () => {
    if (busy.current || !n) return;
    const go = () => {
      if (busy.current) return; busy.current = true; const r = adaptActive(choices);
      if (r) { afterSwap([...r.goneSetIds, ...r.skippedSetIds]); const k = r.swapped + r.restored + r.skipped; announce(t('Zamieniono {n} {w}', { n: k, w: tp(k, 'ćwiczenie|ćwiczenia|ćwiczeń') })); }
      dismiss();
    };
    /* docs/32: jak pojedyncze „Pomiń dziś” — blok z trwającym stoperem serii pomijany przy „Zastosuj” pyta „Trwa pomiar serii” (Anuluj → nic nie zastosowano) */
    const timedSkip = timer.S.on && choices.some(c => c.kind === 'skip' && a?.exercises.find(x => x.id === c.blockId)?.sets.some(x => x.id === timer.S.setId));
    const next = () => { if (back.some(r => !off[r.blockId] && r.edited)) confirm({ title: t('Cofnąć zamianę?'), message: t('Wpisane wartości zamiennika przepadną.'), action: t('Cofnij'), destructive: true, onConfirm: go }); /* C7 */ else go(); };
    if (timedSkip) confirmSkipTimedSet(next); else next();
  };
  const headerOpts = useCloseHeader(undefined, n ? { title: t('Zastosuj ({n})', { n }), onPress: apply, testID: 'adapt-apply' } : null);
  const title = loc ? t('Dostosuj do: {l}', { l: loc.name }) : t('Dostosuj do miejsca');
  if (!a || !loc) return <Screen style={{ paddingTop: 10 }}><Stack.Screen options={headerOpts} /><Missing>{t('Nie ma treningu w toku.')}</Missing></Screen>;

  const nameOfBlock = (blockId: string) => { const e = a.exercises.find(x => x.id === blockId); const ex = e ? exById(e.exerciseId) : undefined; return ex ? exName(ex) : t('Usunięte ćwiczenie'); };
  const rowView = (r: AdaptRow) => {
    const c = chosenOf(r); const from = nameOfBlock(r.blockId); const def = c === r.choice;
    let to = t('Bez zmian'); let why = '';
    if (c?.kind === 'swap') { const b = exById(c.toExId); to = b ? exName(b) : to; why = def && r.source === 'alternate' ? t('zamiennik z szablonu dla tego miejsca') : def && r.candidate ? reasonText(r.candidate) : t('wybrane ręcznie'); }
    else if (c?.kind === 'impl') { const cur = exById(r.curExId); to = `${cur ? exName(cur) : from} — ${implLabel(c.impl)}`; why = t('Ten sam ruch, inny przyrząd'); }
    else if (c?.kind === 'skip') { to = t('Pomiń dziś'); why = t('szablon bez zmian'); }
    const note = def && r.shifted ? t('następna propozycja — pierwsza jest już zajęta przez inne ćwiczenie') : def && r.duplicate ? t('ta sama propozycja co przy innym ćwiczeniu — możesz zmienić') : ''; /* P3 A */
    const sub = [t('brak: {m}', { m: missingLabel(r.missing) }), why, note].filter(Boolean).join('\n'); /* wz. 28: powód i uwagi to zdania — osobne linie, nie „·” */
    return <Item key={r.blockId} title={`${from} → ${to}`} sub={sub} accessibilityHint={t('Otwiera wybór zamiennika.')} onPress={() => router.push(`/swap?target=adapt:${r.blockId}`)} />;
  };
  return (
    <Screen style={{ paddingTop: 10 }}>
      <Stack.Screen options={{ ...headerOpts, title }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Muted style={{ marginBottom: 4 }}>{t('Zamiany tylko w tym treningu — szablon i plan bez zmian.')}</Muted>
        {rows.length ? <><SectionTitle>{t('Ćwiczenia bez sprzętu')}</SectionTitle>{rows.map(rowView)}</> : null}
        {back.length ? <><SectionTitle>{t('Wraca z planu')}</SectionTitle>
          {back.map(r => { const cur = exById(r.curExId); const plan = exById(r.planExId); const label = `${cur ? exName(cur) : ''} → ${plan ? exName(plan) : ''}`;
            return <SwitchRow key={r.blockId} label={label} detail={r.edited ? t('wpisane wartości zamiennika przepadną') : t('wraca do ćwiczenia z planu')} value={!off[r.blockId]} onChange={v => setOff(o => ({ ...o, [r.blockId]: !v }))} />; })}</> : null}
        {!rows.length && !back.length ? <Empty>{t('Wszystkie ćwiczenia są dostępne w: {l}', { l: loc.name })}</Empty> : null}
      </ScrollView>
    </Screen>
  );
}
