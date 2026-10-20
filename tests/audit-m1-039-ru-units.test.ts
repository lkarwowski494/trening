/*
 * M1-audytor-generalny-039: w rosyjskim 5 tekstów miało „кг”, a liczby w aplikacji (fmtW, wu()) zawsze „kg” — dwa zapisy jednostki masy obok siebie. Zasada: jeden zapis
 * jednostki w całym języku — tu „kg” jak przy liczbach (alternatywa: lokalna jednostka „кг” także w fmtW — większa zmiana, nie w tej partii).
 */
import { LOCALES } from '@/lib/locales';
import { applyLang } from '@/lib/i18n';
import { applyUnit, fmtW } from '@/lib/units';

afterEach(() => { applyLang('pl'); applyUnit('kg'); });
const CYR_KG = /(?<![А-Яа-яЁёA-Za-z])кг(?![А-Яа-яЁё])/;
describe('rosyjski: jeden zapis jednostki masy', () => {
  test('żaden tekst ru nie ma „кг” (liczby w aplikacji są w „kg”)', () => {
    const bad = Object.entries((LOCALES as Record<string, Record<string, string>>).ru).filter(([, v]) => CYR_KG.test(v)).map(([k, v]) => `${k.slice(0, 50)} → ${v.slice(0, 60)}`);
    expect(bad).toEqual([]);
  });
  test('fmtW w ru: „80 kg” — ta sama jednostka co w tekstach; teksty z kg w ru używają „kg”', () => {
    applyLang('ru'); applyUnit('kg'); expect(fmtW(80)).toMatch(/80\s?kg$/);
    const ru = (LOCALES as Record<string, Record<string, string>>).ru; const withKg = Object.values(ru).filter(v => /\bkg\b/.test(v));
    expect(withKg.length).toBeGreaterThanOrEqual(5);
  });
});
