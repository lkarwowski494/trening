import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui';
import { save, bandColor, getState } from '@/lib/store';
import { cleanName } from '@/lib/draft';
import { t } from '@/lib/i18n';
import type { Band } from '@/lib/seed';

/** Pole koloru gumy — JEDNA zasada dla ekranu Gumy i poziomów gum w miejscu (G2, audyt 0.10 UI-05): wpis zapisuje się od razu (ekran konfiguracji),
 * a przy końcu edycji i przy wyjściu z ekranu spacje się porządkują, a pusty kolor wraca do ostatniego zapisanego (bez niego — „nowa”). */
export function BandColorInput({ band, accessibilityLabel, a11y }: { band: Band; accessibilityLabel: string; a11y?: object }) {
  const last = useRef(band.color); const id = band.id;
  const commit = () => { const b = getState().bands.find(x => x.id === id); if (!b) return; const c = cleanName(b.color, last.current, t('nowa')); if (c !== b.color) { b.color = c; save(b); } last.current = c; };
  useEffect(() => () => { try { commit(); } catch { /* stan wyzerowany (koniec testu / restart) */ } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Input {...a11y} maxLength={30} selectTextOnFocus placeholder={t('kolor')} accessibilityLabel={accessibilityLabel} value={band.color ? bandColor(band) : ''} onChangeText={v => { band.color = v; save(band); }} onEndEditing={commit} />;
}
