import React from 'react';
import { Muted } from '@/components/ui';
import { t } from '@/lib/i18n';

/** L1 (audyt 0.10, MER-11, wariant A): jedno ostrożne zdanie — aplikacja nie udziela porad medycznych i odsyła do specjalisty. Przy notatce treningu
 * (podpowiedź „ból”), w edycji sesji, w generatorze (pełne plany z cardio) i w Ustawieniach. Bez porad i bez ocen objawów. */
export function MedicalNote({ style }: { style?: React.ComponentProps<typeof Muted>['style'] }) {
  return <Muted style={[{ fontSize: 12, marginTop: 4 }, style]}>{t('Aplikacja nie udziela porad medycznych. Przy bólu, urazie albo chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')}</Muted>;
}
