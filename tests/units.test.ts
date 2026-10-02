/* Runda 73 — testy jednostek dopisane po testach mutacyjnych (Stryker): każdy przypadek zabija mutanta, który wcześniej przeżył. */
import * as units from '@/lib/units';
import { applyLang } from '@/lib/i18n';

afterEach(() => { units.applyUnit('kg'); jest.restoreAllMocks(); });

describe('units — przypadki z testów mutacyjnych', () => {
  test('domyślna jednostka to kg (zanim Ustawienia cokolwiek ustawią)', () => {
    jest.isolateModules(() => { const u = require('@/lib/units'); expect(u.wu()).toBe('kg'); expect(u.fmtW(10, false)).toBe('10'); });
  });
  test('wField: brak wartości zostaje pustym polem, liczba idzie do jednostki wyświetlania', () => {
    expect(units.wField('')).toBe(''); expect(units.wField(null)).toBe(''); expect(units.wField(undefined)).toBe('');
    expect(units.wField(12.345)).toBe(12.35);
    units.applyUnit('lb'); expect(units.wField(45.359237)).toBe(100);
  });
  test('wIn: puste pole zostaje puste; kg na siatce 0,01; lb przyciągane do siatki kg, lustrzanie dla asysty', () => {
    expect(units.wIn('')).toBe(''); expect(units.wIn(100.004)).toBe(100);
    units.applyUnit('lb'); expect(units.wIn('')).toBe('');
    expect(units.wIn(100)).toBe(45.35); expect(units.wIn(-100)).toBe(-45.35);
    expect(Object.is(units.wIn(-0), 0)).toBe(true); /* bez „−0” w danych */
  });
  test('snapLegacyLb: tylko stare zapisy z funtów; kg i wartości nieliczbowe bez zmian', () => {
    expect(units.snapLegacyLb('x')).toBe('x'); expect(units.snapLegacyLb(NaN)).toBeNaN(); expect(units.snapLegacyLb(Infinity)).toBe(Infinity); expect(units.snapLegacyLb(0)).toBe(0);
    expect(units.snapLegacyLb(45.36)).toBe(45.36); /* na siatce 0,01 kg */
    expect(units.snapLegacyLb(681.518)).toBe(681.518); /* kg z 3 miejscami — nie funty */
    expect(units.snapLegacyLb(100 * units.KG_PER_LB)).toBe(45.35); /* surowe 100 lb */
    expect(units.snapLegacyLb(-100 * units.KG_PER_LB)).toBe(-45.35);
    expect(units.snapLegacyLb(135.5 * units.KG_PER_LB)).toBe(61.45); /* 135,5 lb */
    expect(units.snapLegacyLb(453592.37)).toBe(453592.37); /* na siatce kg i jednocześnie równe 1 000 000 lb — wpis w kg wygrywa */
  });
  test('fmtNum: bez grupowania tysięcy, do podanej liczby miejsc; awaryjnie zwykłe zaokrąglenie', () => {
    applyLang('pl'); expect(units.fmtNum(12345.678, 2)).toBe('12345,68'); expect(units.fmtNum(2.5)).toBe('2,5');
    applyLang('en'); expect(units.fmtNum(12345.678, 2)).toBe('12345.68');
    jest.spyOn(Number.prototype, 'toLocaleString').mockImplementation(() => { throw new Error('brak Intl'); });
    expect(units.fmtNum(1.2345, 2)).toBe('1.23'); applyLang('pl');
  });
  test('volOut / fmtVol / fmtW w lb i kg', () => {
    expect(units.volOut(1000.4)).toBe(1000); expect(units.fmtW(62.5)).toMatch(/^62[,.]5 kg$/);
    units.applyUnit('lb'); expect(units.volOut(453.59237)).toBe(1000); expect(units.fmtVol(453.59237)).toBe('1000 lb'); expect(units.fmtW(45.359237, false)).toBe('100');
  });
});
