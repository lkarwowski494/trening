import React from 'react';
import { ScrollView } from '@/components/Scroll';
import { Screen, Item, Muted, SectionTitle } from '@/components/ui';
import { InfoTip } from '@/components/InfoTip';
import { MedicalNote } from '@/components/MedicalNote';
import { SOURCE_GROUPS, CUE_SOURCE_LINES } from '@/lib/sources';
import { t } from '@/lib/i18n';
import { font } from '@/lib/theme';

/*
 * Ustawienia → „Źródła wiedzy” (decyzja właściciela 23.10.2026, docs/18): jedyne miejsce w aplikacji ze źródłami liczb i zaleceń; reszta aplikacji mówi zwykłym językiem,
 * bez przypisów. Lista: lib/sources.ts (offline, same teksty — bez adresów i bez połączeń z siecią). Wzorzec ekranu informacyjnego jak „Licencje open source”
 * (docs/32 wzorce 2, 19, 27): tytuł i powrót daje nagłówek nawigacji, wiersze bez akcji, nagłówki sekcji dla VoiceOver, dłuższe objaśnienia pod ⓘ.
 */
export default function SourcesScreen() {
  return (
    <Screen><ScrollView testID="sources-screen" contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <InfoTip id="sources-intro" label={t('Na czym opierają się liczby i zalecenia w aplikacji.')} info={t('Liczby i zalecenia w aplikacji opierają się na stanowiskach organizacji naukowych, przeglądach badań i badaniach z recenzowanych czasopism. Tu są wszystkie źródła w jednym miejscu — w pozostałych miejscach aplikacji piszemy zwykłym językiem.')}>
        <Muted style={font('footnote')}>{t('Na czym opierają się liczby i zalecenia w aplikacji.')}</Muted>
      </InfoTip>
      {SOURCE_GROUPS.map(g => <React.Fragment key={g.id}>
        <SectionTitle>{g.title()}</SectionTitle>
        {g.items.map(i => <Item key={i.id} title={i.cite} sub={`${i.use()}\n${i.detail}`} />)}
      </React.Fragment>)}
      <SectionTitle>{t('Technika ćwiczeń')}</SectionTitle>
      <Muted style={{ ...font('callout'), marginBottom: 4 }}>{t('Opisy techniki są napisane własnymi słowami, na podstawie:')}</Muted>
      {CUE_SOURCE_LINES.map((line, i) => <Item key={i} title={line()} />)}
      <SectionTitle infoId="sources-muscles" info={t('Gdy opieramy się na jednym źródle albo na uproszczeniu, mówi o tym opis ćwiczenia.')}>{t('Partie mięśniowe w ćwiczeniach')}</SectionTitle>
      <Muted style={{ ...font('callout') }}>{t('Partie pracujące w ćwiczeniach ustalamy z przeglądów badań i badań aktywności mięśni.')}</Muted>
      <SectionTitle infoId="sources-ours" info={t('Nie wszystko da się wyczytać z badań. Przykłady: długość przerw w planie, krok zmiany ciężaru.')}>{t('Nasze uproszczenia i wybory')}</SectionTitle>
      <Muted style={{ ...font('callout') }}>{t('Gdy reguła jest naszym uproszczeniem albo wyborem, piszemy o tym wprost przy niej.')}</Muted>
      <MedicalNote style={{ marginTop: 18 }} />
    </ScrollView></Screen>
  );
}
