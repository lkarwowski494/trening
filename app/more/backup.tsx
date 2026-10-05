import React, { useRef } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Screen, Btn, Muted } from '@/components/ui';
import { exportBackup, importBackup, exportCsv, isSafetyError, safetyRecoveryNote } from '@/lib/backup';
import { t } from '@/lib/i18n';
import { wu } from '@/lib/units';
import { usePrefsTick, getState } from '@/lib/store';
import * as timer from '@/lib/timer';

export default function Backup() {
  usePrefsTick(); // runda 30: po imporcie język i jednostka ekranu jak w zaimportowanych danych
  const fail = () => Alert.alert(t('Nie udało się'), t('Spróbuj ponownie.')); const busy = useRef(false); // runda 11: jeden import naraz
  return (
    <Screen><ScrollView contentContainerStyle={{ paddingVertical: 10, gap: 12 }}>
      <Muted>{t('Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.')}</Muted>
      <Btn title={t('Eksportuj backup (plik JSON)')} kind="primary" block onPress={() => exportBackup().catch(fail)} />
      <Btn title={t('Eksportuj historię do CSV')} block onPress={() => exportCsv().catch(fail)} />
      <Muted style={{ fontSize: 13 }}>{t('CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach.', { u: wu() })}</Muted>
      <Btn title={t('Importuj backup')} block onPress={() => Alert.alert(t('Nadpisać dane?'), t('Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: Trening → Backup.') + safetyRecoveryNote(), [{ text: t('Nie') }, { text: t('Importuj'), style: 'destructive', onPress: () => { if (busy.current) return; busy.current = true; importBackup().finally(() => { busy.current = false; }).then(ok => { if (!ok) return; timer.resetAll().catch(() => {}); Alert.alert(t('Zaimportowano')); }).catch((e: unknown) => isSafetyError(e) ? Alert.alert(t('Import przerwany'), e.message) /* Q-019 */ : Alert.alert(e instanceof Error && e.message.includes('schem') ? t('Backup z nowszej wersji aplikacji') : t('To nie wygląda na backup z tej apki'), e instanceof Error && e.message.includes('schem') ? e.message : undefined)); } }])} />
      <Muted style={{ fontSize: 13 }}>{getState().settings.autoBackup ? t('Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → Trening → Backup, ostatnie 10). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz.') : t('Kopia automatyczna po treningu jest wyłączona (Ustawienia).')}</Muted>
    </ScrollView></Screen>
  );
}
