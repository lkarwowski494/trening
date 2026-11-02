/** M1-017 (DEC-01, DEC-10): kalendarz miesiąca w Historii rośnie z tekstem systemu do progu 130% (TEXT_SCALE.num), nie 120%; komórka dnia rośnie razem z liczbą. */
import React from 'react';
import { render } from '@testing-library/react-native';
import { HistoryCalendar, CAL_FACE } from '@/components/HistoryCalendar';
import { TEXT_SCALE } from '@/lib/theme';
import { fresh } from './helpers';

const flat = (s: unknown): Record<string, unknown> => Object.assign({}, ...[s].flat(Infinity).filter(Boolean) as object[]);

describe('M1-017: kalendarz do progu 130%', () => {
  const mount = async () => { await fresh(undefined, 'pl'); const ui = await render(<HistoryCalendar byDay={new Map()} selected={null} onSelect={() => {}} />); return { ui, texts: ui.container.queryAll((n: any) => n.type === 'Text') }; }; /* RNTL 14: render — obietnica; drzewo tylko natywne */
  test('próg liczb w tokenach to 130%', () => { expect(TEXT_SCALE.num).toBe(1.3); });
  test('numery dni i nagłówki dni tygodnia: maxFontSizeMultiplier = 1,3 (nie 1,2)', async () => {
    const { texts } = await mount();
    const days = texts.filter((x: any) => /^\d{1,2}$/.test(String(x.props.children)));
    expect(days.length).toBeGreaterThanOrEqual(28);
    for (const d of days) expect(d.props.maxFontSizeMultiplier).toBe(TEXT_SCALE.num);
    const heads = texts.filter((x: any) => x.props.adjustsFontSizeToFit);
    expect(heads).toHaveLength(7);
    for (const h of heads) expect(h.props.maxFontSizeMultiplier).toBe(TEXT_SCALE.num);
  });
  test('komórka dnia ma wysokość minimalną, nie stałą — mieści numer 130% i ikonę dnia', async () => {
    const { ui } = await mount();
    const faces = ui.container.queryAll((n: any) => n.type === 'View').map((v: any) => flat(v.props.style)).filter(s => s.width === CAL_FACE.w);
    expect(faces.length).toBeGreaterThanOrEqual(28);
    for (const s of faces) { expect(s.height).toBeUndefined(); expect(s.minHeight).toBe(CAL_FACE.h); }
  });
});
