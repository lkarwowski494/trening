/* Audyt 8f0f935..ac5d764 (05.10.2026, niezależny subagent): poprawki z testami odtwarzającymi. */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { applyLang, locale } from '@/lib/i18n';
import { NumInput } from '@/components/ui';

const device = (tag: string) => { global.__locales = [{ languageCode: tag.split('-')[0], languageTag: tag }]; };
afterEach(() => { device('pl-PL'); applyLang('pl'); });

test('MEDIUM 1: pole liczbowe z przecinkiem dziesiętnym w językach, które go używają (cs, es…), z kropką po angielsku', () => {
  for (const [l, want] of [['pl', '12,5'], ['cs', '12,5'], ['es', '12,5'], ['uk', '12,5'], ['en', '12.5']] as const) {
    device(l === 'en' ? 'en-US' : `${l}-XX`); applyLang(l);
    const r = render(<NumInput value={12.5} onNum={() => {}} decimal accessibilityLabel="w" />);
    expect([l, screen.getByLabelText('w').props.value]).toEqual([l, want]); r.unmount();
  }
});

test('LOW 2: serbski interfejs cyrylicą → daty też cyrylicą, nawet gdy telefon ma sr-Latn; porównanie po podtagu języka', () => {
  device('sr-Latn-RS'); applyLang('sr'); expect(locale()).toBe('sr-Cyrl-RS');
  device('sr-RS'); applyLang('sr'); expect(locale()).toBe('sr-Cyrl-RS');
  device('en-GB'); applyLang('en'); expect(locale()).toBe('en-GB');
  device('pt-BR'); applyLang('pt'); expect(locale()).toBe('pt-BR');
  device('es-MX'); applyLang('es'); expect(locale()).toBe('es-MX');
  device('cs-CZ'); applyLang('es'); expect(locale()).toBe('es-ES');
});
