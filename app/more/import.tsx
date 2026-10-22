import React, { useMemo, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { Screen, Btn, Muted, Segmented, SectionTitle, Item, Input, SearchField } from '@/components/ui';
import { InfoTip } from '@/components/InfoTip';
import { getState, useTick, fmtDayKey } from '@/lib/store';
import { isSafetyError, isPersistError } from '@/lib/backup';
import { pickCsv, commitCsvImport } from '@/lib/csvimport';
import { analyze, normName, isImportError, type ParsedFile, type ImportErrorCode } from '@/lib/csvparse';
import { t, exName, exNameLang } from '@/lib/i18n';
import type { Unit } from '@/lib/units';
import { font } from '@/lib/theme';

/** Import historii z CSV (decyzja właściciela 11.10.2026): podgląd przed zapisem jest obowiązkowy; nic się nie zmienia, dopóki nie „Importuj”. */
const ERR: Record<ImportErrorCode, () => string> = {
  format: () => t('To nie wygląda na obsługiwany plik CSV z historią treningów. Dane nie zostały zmienione.'),
  rows: () => t('Plik nie zawiera żadnych poprawnych treningów. Dane nie zostały zmienione.'),
  empty: () => t('Plik jest pusty. Dane nie zostały zmienione.'),
  toolarge: () => t('Plik jest za duży. Dane nie zostały zmienione.'),
};
const SHOWN = 6; /* podpowiedzi przy zmianie dopasowania */

export default function ImportCsv() {
  useTick(); const st = getState(); const busy = useRef(false); const [working, setWorking] = useState(false);
  const [file, setFile] = useState<ParsedFile | null>(null);
  const [unit, setUnit] = useState<Unit>(st.settings.unit === 'lb' ? 'lb' : 'kg'); /* domyślnie jednostka z Ustawień */
  const [mapping, setMapping] = useState<Record<string, string | 'new'>>({});
  const [editing, setEditing] = useState<string | null>(null); const [q, setQ] = useState('');
  const a = useMemo(() => file ? analyze(file, st, mapping) : null, [file, st, mapping]);
  const fail = (e: unknown) => isImportError(e) ? Alert.alert(t('Nie udało się zaimportować pliku'), ERR[e.code]()) : Alert.alert(t('Nie udało się zaimportować pliku'), t('Spróbuj ponownie.'));
  const pick = () => { if (busy.current) return; busy.current = true;
    pickCsv().then(f => { if (f) { setFile(f); setMapping({}); setEditing(null); setQ(''); } }).catch(fail).finally(() => { busy.current = false; }); };
  const run = () => { if (busy.current || !file) return; busy.current = true; setWorking(true);
    commitCsvImport(file, { unit, mapping }).then(r => { setFile(null); Alert.alert(t('Zaimportowano'), t('Dodano treningi: {n}, nowe ćwiczenia: {m}.', { n: r.workouts, m: r.exercises })); })
      .catch((e: unknown) => isSafetyError(e) ? Alert.alert(t('Import przerwany'), e.message) : isPersistError(e) ? Alert.alert(t('Nie udało się zapisać danych'), t('Spróbuj ponownie.')) /* M1-audytor-generalny-006 */ : fail(e)).finally(() => { busy.current = false; setWorking(false); }); };
  const targetOf = (name: string) => { const m = mapping[name]; const auto = a?.names.find(r => r.name === name)?.auto ?? null;
    const ex = m && m !== 'new' ? st.exercises.find(e => e.id === m) ?? null : m === 'new' ? null : auto; return ex; };
  const hits = useMemo(() => { const k = normName(q); const l = st.exercises.filter(e => !e.archived && (!k || normName(exName(e)).includes(k) || normName(e.name).includes(k)));
    return l.slice(0, SHOWN); }, [q, st.exercises]);
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, gap: 12 }} keyboardShouldPersistTaps="handled">
      <InfoTip id="import-intro" label={t('Dopisuje treningi z CSV. Obecnych danych nie zmienia. Przed zapisem — podgląd.')} info={t('Dopisuje treningi z plików CSV popularnych dzienników treningowych. Obecnych danych nie zmienia ani nie usuwa. Przed zapisem zobaczysz podgląd.')}>
        <Muted>{t('Dopisuje treningi z CSV. Obecnych danych nie zmienia. Przed zapisem — podgląd.')}</Muted>
      </InfoTip>
      <Btn title={t('Wybierz plik CSV')} kind={file ? 'default' : 'primary'} block onPress={pick} />
      {a && file ? (
        <View style={{ gap: 10 }}>
          <SectionTitle>{t('Podgląd importu')}</SectionTitle>
          <Muted>{t('Treningi do dodania: {n}', { n: a.fresh.length })}</Muted>
          {a.firstDay && a.lastDay ? <Muted>{t('Zakres dat: {a} – {b}', { a: fmtDayKey(a.firstDay), b: fmtDayKey(a.lastDay) })}</Muted> : null}
          <Muted>{t('Pominięte jako duplikaty: {n}', { n: a.duplicates })}</Muted>
          {a.badRows ? <Muted>{t('Pominięte wiersze (błędne dane): {n}', { n: a.badRows })}</Muted> : null}
          <Muted>{t('Ćwiczenia dopasowane do Twoich: {n}', { n: a.matched })}</Muted>
          <Muted>{t('Nowe ćwiczenia: {n}', { n: a.created })}</Muted>
          {file.weightUnit == null ? <View style={{ gap: 6 }}>
            <Segmented label={t('Jednostka ciężaru w pliku')} options={[['kg', 'kg'], ['lb', 'lb']]} value={unit} onChange={setUnit} />
            <Muted style={font('footnote')}>{t('Plik nie podaje, czy ciężary są w kg, czy w lb. Domyślnie: jednostka z Ustawień.')}</Muted></View> : null}
          {file.sessions.some(s => s.dateOnly) ? <Muted style={font('footnote')}>{t('Plik nie podaje godzin treningów — dzień, w którym masz już trening, zostanie pominięty jako duplikat.')}</Muted> : null}
          {file.hasDistance ? <Muted style={font('footnote')}>{t('Dystans w pliku przyjęto jako metry.')}</Muted> : null}
          {a.names.length ? <SectionTitle>{t('Ćwiczenia z pliku')}</SectionTitle> : null}
          {a.names.map(r => { const ex = targetOf(r.name); const open = editing === r.name;
            return (<View key={r.name}>
              <Item title={r.name} sub={`${t('Serie: {n}', { n: r.sets })} · ${ex ? `→ ${exName(ex)}` : t('Nowe ćwiczenie')}`} icon={open ? '▾' : '▸'} expanded={open} accessibilityLabel={`${r.name}, ${ex ? exName(ex) : t('Nowe ćwiczenie')}, ${t('Zmień dopasowanie')}`}
                onPress={() => { setEditing(open ? null : r.name); setQ(''); }} />
              {open ? <View style={{ gap: 6, paddingVertical: 6 }}>
                <Item title={t('Nowe ćwiczenie')} selected={!ex} icon={!ex ? '✓' : undefined} onPress={() => { setMapping(m => ({ ...m, [r.name]: 'new' })); setEditing(null); }} />
                <SearchField value={q} onChangeText={setQ} placeholder={t('Szukaj ćwiczenia…')} />
                {hits.map(e => <Item key={e.id} titleLang={exNameLang(e)} title={exName(e)} selected={ex?.id === e.id} icon={ex?.id === e.id ? '✓' : undefined} onPress={() => { setMapping(m => ({ ...m, [r.name]: e.id })); setEditing(null); }} />)}
              </View> : null}
            </View>); })}
          {a.fresh.length ? <Btn title={t('Importuj')} kind="primary" block loading={working} onPress={run} /> : <Muted>{t('Nie ma nowych treningów do dodania — wszystkie są już w historii.')}</Muted>}
          <Btn title={t('Anuluj')} block onPress={() => { setFile(null); setEditing(null); }} />
        </View>
      ) : null}
    </ScrollView></Screen>
  );
}
