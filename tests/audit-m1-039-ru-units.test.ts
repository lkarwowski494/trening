/*
 * M1-audytor-generalny-039 (ZMIENIONE 28.10.2026, decyzja właściciela 10a, 09-lokalizacja-005): w rosyjskim 5 tekstów miało „кг”, a liczby w aplikacji (fmtW) zawsze „kg” —
 * dwa zapisy jednostki masy obok siebie. Pierwotna decyzja: wszędzie „kg”. Decyzja 10a odwraca ją: wszędzie LOKALNY symbol („кг”) w ru/uk/bg/sr i „κιλά” w el, a wartość
 * logiczna (wu(), CSV, kopia) zostaje „kg”/„lb”. Pełna macierz języków, CSV i strażnik wartości logicznej: tests/units-label.test.ts.
 */
import { LOCALES } from '@/lib/locales';
import { applyLang } from '@/lib/i18n';
import { applyUnit, fmtW, wu } from '@/lib/units';

afterEach(() => { applyLang('pl'); applyUnit('kg'); });
const LATIN_KG = /(?<![A-Za-z])kg(?![A-Za-z])/;
describe('rosyjski: jeden zapis jednostki masy — lokalny (decyzja 10a, 28.10.2026)', () => {
  test('żaden tekst ru nie ma „kg” łacinką (teksty i liczby używają „кг”)', () => {
    const bad = Object.entries((LOCALES as Record<string, Record<string, string>>).ru).filter(([, v]) => LATIN_KG.test(v)).map(([k, v]) => `${k.slice(0, 50)} → ${v.slice(0, 60)}`);
    expect(bad).toEqual([]);
  });
  test('fmtW w ru: „80 кг” — ta sama jednostka co w tekstach; wartość logiczna wu() zostaje „kg”', () => {
    applyLang('ru'); applyUnit('kg'); expect(fmtW(80)).toBe('80 кг'); expect(wu()).toBe('kg');
    const ru = (LOCALES as Record<string, Record<string, string>>).ru; const withKg = Object.values(ru).filter(v => /(?<![А-Яа-яЁёA-Za-z])кг(?![А-Яа-яЁё])/.test(v));
    expect(withKg.length).toBeGreaterThanOrEqual(5);
  });
});
