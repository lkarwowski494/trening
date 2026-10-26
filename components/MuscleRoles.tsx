import React from 'react';
import { View } from 'react-native';
import { Field, Muted, Txt } from '@/components/ui';
import { MuscleMap } from '@/components/MuscleMap';
import { muscleRoleRows } from '@/lib/muscleRoles';
import { REGION_LABEL, type Exercise } from '@/lib/seed';
import { exerciseMapSets } from '@/lib/musclemap';
import { t, lang } from '@/lib/i18n';
import { font } from '@/lib/theme';

/*
 * Mięśnie ćwiczenia (decyzja właściciela 26.10.2026): mapa mięśni (sylwetka przód/tył, lib/musclemap — partia główna ciemniejszym stopniem, pomocnicza słabszym)
 * i przy każdym podświetlonym mięśniu jedno zdanie o jego roli w ruchu (lib/muscleRoles). Mięsień bez pewnej roli (brak reguły, uproszczenie, jedno źródło,
 * szyja) ma tylko zabarwienie na mapie — bez wiersza i bez dopisków. Ćwiczenie własne (bez wpisu w katalogu) — sekcji nie ma.
 */
export function MuscleRoles({ e }: { e: Pick<Exercise, 'lib' | 'libKey'> & Partial<Pick<Exercise, 'muscles' | 'secondaryMuscles'>> }) {
  const rows = muscleRoleRows(e); if (!rows.length) return null;
  const sets = exerciseMapSets(rows); if (!Object.keys(sets).length) return null; /* tylko szyja — poza mapą partii, bez zdania */
  const withRole = rows.filter(r => r.role);
  const kind = (w: number) => (w === 1 ? t('główna') : t('pomocnicza'));
  const mapLabel = t('Mapa mięśni ćwiczenia: {list}', { list: rows.map(r => `${t(REGION_LABEL[r.region])} ${kind(r.load)}`).join(', ') });
  return (
    <Field label={t('Co robią mięśnie')}>
      <MuscleMap sets={sets} legend={false} title={t('Mapa mięśni')} label={mapLabel} caption={t('Mocniejszy kolor: partia główna, słabszy: pomocnicza.')} height={200} />
      {withRole.length ? <View testID="muscle-roles" style={{ marginTop: 10, rowGap: 8 }}>
        {withRole.map(r => (
          <View key={r.region} accessibilityLanguage={lang()} accessible accessibilityLabel={`${t(REGION_LABEL[r.region])}, ${kind(r.load)}: ${r.role}`}>
            <Txt>{t(REGION_LABEL[r.region])}</Txt>
            <Muted style={{ ...font('footnote') }}>{r.role}</Muted>
          </View>
        ))}
      </View> : null}
    </Field>
  );
}
