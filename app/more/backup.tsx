import React, { useRef, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Screen, Btn, Muted } from '@/components/ui';
import { InfoTip } from '@/components/InfoTip';
import { exportBackup, importBackup, exportCsv, isSafetyError, isPersistError, safetyRecoveryNote, AUTO_KEEP } from '@/lib/backup';
import { t, appName } from '@/lib/i18n';
import { wu } from '@/lib/units';
import { usePrefsTick, getState } from '@/lib/store';
import * as timer from '@/lib/timer';
import { useRouter } from 'expo-router';
import { cancelButton } from '@/lib/confirm';
import { font } from '@/lib/theme';

export default function Backup() {
  const router = useRouter(); usePrefsTick(); // runda 30: po imporcie język i jednostka ekranu jak w zaimportowanych danych
  const fail = () => Alert.alert(t('Nie udało się wyeksportować kopii'), t('Spróbuj ponownie.')); const busy = useRef(false); const [working, setWorking] = useState<'json' | 'csv' | 'import' | null>(null); const run = (k: 'json' | 'csv', f: () => Promise<unknown>) => { if (working) return; setWorking(k); f().catch(fail).finally(() => setWorking(null)); }; // runda 11: jeden import naraz
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, gap: 12 }}>
      <InfoTip id="backup-intro" label={t('Plik JSON z całą historią i szablonami. Import przyjmuje ten sam format.')} info={t('Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.')}>
        <Muted>{t('Plik JSON z całą historią i szablonami. Import przyjmuje ten sam format.')}</Muted>
      </InfoTip>
      <Btn title={t('Eksportuj backup (plik JSON)')} kind="primary" block loading={working === 'json'} onPress={() => run('json', exportBackup)} />
      <Btn title={t('Eksportuj historię do CSV')} block loading={working === 'csv'} onPress={() => run('csv', exportCsv)} />
      <Muted style={font('footnote')}>{t('CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach.', { u: wu() })}</Muted>
      <Btn title={t('Importuj backup')} block loading={working === 'import'} onPress={() => Alert.alert(t('Nadpisać dane?'), t('Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: {app} → Backup.', { app: appName() }) + safetyRecoveryNote(), [{ ...cancelButton() }, { text: t('Importuj'), style: 'destructive', onPress: () => { if (busy.current) return; busy.current = true; setWorking('import'); importBackup().finally(() => { busy.current = false; setWorking(null); }).then(ok => { if (!ok) return; timer.resetAll().catch(() => {}); Alert.alert(t('Zaimportowano')); }).catch((e: unknown) => isSafetyError(e) ? Alert.alert(t('Import przerwany'), e.message) /* Q-019 */ : isPersistError(e) ? Alert.alert(t('Nie udało się zapisać danych'), t('Spróbuj ponownie.')) /* M1-audytor-generalny-006 */ : Alert.alert(e instanceof Error && e.message.includes('schem') ? t('Backup z nowszej wersji aplikacji') : t('To nie wygląda na backup z tej apki'), e instanceof Error && e.message.includes('schem') ? e.message : undefined)); } }])} />
      <Btn title={t('Importuj historię z pliku CSV')} block nav onPress={() => router.push('/more/import')} />
      <InfoTip id="backup-csv" label={t('Dopisuje treningi z CSV — bez usuwania danych, z podglądem.')} info={t('Dopisuje treningi z plików CSV popularnych dzienników treningowych — bez usuwania obecnych danych, z podglądem przed zapisem.')}>
        <Muted style={font('footnote')}>{t('Dopisuje treningi z CSV — bez usuwania danych, z podglądem.')}</Muted>
      </InfoTip>
      {getState().settings.autoBackup
        ? <InfoTip id="backup-auto" label={t('Kopie automatyczne znikają razem z aplikacją — przed jej usunięciem wyeksportuj backup.')} info={t('Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → {app} → Backup, ostatnie {n}). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz.', { app: appName(), n: AUTO_KEEP })}>
          <Muted style={font('footnote')}>{t('Kopie automatyczne znikają razem z aplikacją — przed jej usunięciem wyeksportuj backup.')}</Muted>
        </InfoTip>
        : <Muted style={font('footnote')}>{t('Kopia automatyczna po treningu jest wyłączona (Ustawienia).')}</Muted>}
    </ScrollView></Screen>
  );
}
