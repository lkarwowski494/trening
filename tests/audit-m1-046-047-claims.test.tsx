/*
 * M1-audytor-generalny-046 (DEC-14): krok podpowiedzi progresji („↑ spróbuj …”, np. +2,5 kg) jest konwencją — nazwany tak przy ustawieniu podpowiedzi; docs/10 pkt 4.4 cytuje
 * ACSM 2026 (adres, data odczytu), nie próg 2–10% z ACSM 2009.
 * M1-audytor-generalny-047 (DEC-15): zdanie R1 o częstotliwości nie twierdzi „siła rośnie przy …” (ACSM 2026: częstotliwość wpływa na siłę, brak dowodu zależności dawka–odpowiedź,
 * wpływ słabnie przy równej objętości); opis celu „Siła” i ostrzeżenie loadcap podają tę samą granicę z jednej stałej (HEAVY_PCT).
 */
import * as fs from 'fs';
import * as path from 'path';
import { t, applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { HEAVY_PCT } from '@/lib/generator';
import { renderApp, flushAll, screen, go } from './app';

jest.setTimeout(60000);
afterEach(() => applyLang('pl'));
const root = path.join(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
const CONV = 'Krok zmiany (np. +2,5 kg) to nasz wybór, a nie wynik badań.';

describe('046: krok podpowiedzi to konwencja (od 23.10.2026 bez oznaczenia w interfejsie — decyzja właściciela, docs/18; konwencja zostaje w docs/10 i rejestrze twierdzeń)', () => {
  test('Ustawienia: przy „Podpowiedź progresji” tylko opis działania, bez zdania o konwencji / „naszym wyborze” (PL i EN)', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.getByText('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń')).toBeTruthy();
    expect(screen.queryByText(/Krok zmiany|nasz wybór/)).toBeNull();
    expect(EN[CONV]).toBeUndefined();
  });
  test('zdanie usunięte ze słowników wszystkich języków', () => {
    for (const [l, d] of Object.entries(LOCALES)) expect([l, (d as Record<string, string>)[CONV]]).toEqual([l, undefined]);
  });
  test('docs/10 pkt 4.4: ACSM 2026 z adresem i datą odczytu; nie ma progu 2–10% przypisanego ACSM 2009', () => {
    const d = read('docs/10-miejsca-i-sprzet.md'); const i = d.indexOf('4. **Podpowiedź progresji'); const sec = d.slice(i, d.indexOf('\n\n', i) > i ? d.indexOf('\n## ', i) : undefined);
    expect(sec).toMatch(/PMC12965823/); expect(sec).toMatch(/odczyt/i); expect(sec).not.toMatch(/ACSM 2009: 2–10%/); expect(sec).toMatch(/konwencj/);
  });
});

describe('047: brzmienie zgodne ze źródłem', () => {
  test('zdanie R1 (generator i własny plan): bez „siła rośnie przy”; mówi o braku dowodu dawka–odpowiedź', () => {
    for (const f of ['app/generator.tsx', 'components/OwnPlan.tsx']) { const s = read(f); expect(s).not.toMatch(/siła rośnie przy/); expect(s).toMatch(/więcej dni nie musi dawać proporcjonalnie więcej/); }
    expect(Object.keys(EN).some(k => /siła rośnie przy/.test(k))).toBe(false);
  });
  test('opis celu „Siła” i ostrzeżenie loadcap podają granicę z HEAVY_PCT (jedna stała, bez liczby wpisanej obok)', () => {
    const g = read('app/generator.tsx'), l = read('lib/loadcap.ts');
    expect(g).toMatch(/Siła: bój główny[^']*\{p\}%/); expect(l).toMatch(/\(ok\. \{p\}% maksimum\)/); expect(g).toMatch(/p: HEAVY_PCT/); expect(l).toMatch(/p: HEAVY_PCT/);
    expect(HEAVY_PCT).toBe(80);
  });
});
