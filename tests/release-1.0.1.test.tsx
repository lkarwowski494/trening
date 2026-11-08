/**
 * Wersja 1.0.1 — wersja testowa TestFlight TYLKO dla właściciela (decyzja 06.11.2026, wariant B; docs/18): obecny stan integracja-1-1 (prace linii 1.1) z numerem 1.0.1,
 * bo 1.0.0 jest wydana w App Store (05.11.2026). Odrzucone: A — 1.1.0. Wyjątek (wariant A): ten build bez audytu zmian; kontrola zastępcza w docs/18 i docs/zobowiazania.md (ZB-043).
 * Wersja w app.json, package.json i package-lock.json; wpis „Co nowego” (lib/whatsnew.ts) — przycisk ✦ wraca; zachowanie: tests/whats-new.test.tsx.
 */
import { WHATS_NEW } from '@/lib/whatsnew';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const R = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const J = (f: string) => JSON.parse(R(f));

describe('wersja 1.0.1 (TestFlight dla właściciela, 06.11.2026)', () => {
  test('app.json, package.json i package-lock.json (projekt) — 1.0.1', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['1.0.1', '1.0.1', '1.0.1', '1.0.1']);
  });
  test('historia „Co nowego” ma jeden wpis 1.0.1 (id 2026-11-06, 4 punkty, bez numeru buildu do czasu przebiegu testflight.yml)', () => {
    expect(WHATS_NEW.map(e => e.id)).toEqual(['2026-11-06']); expect(WHATS_NEW[0].items()).toEqual([
      'Nowe rysunki ruchu w ćwiczeniach na triceps oraz w podrzutach, rwaniach i ich odmianach.',
      'Nowe i dopracowane wskazówki techniki, m.in. dla barków, ćwiczeń mocy i mobilności.',
      'Zapowiedzi głosowe używają najlepszego głosu zainstalowanego w telefonie.',
      'Nowa osoba zaczyna na ekranie Trening od przycisku „Zacznij pierwszy trening” i tablicy „Pierwszy trening”.',
    ]);
  });
  test('numer buildu liczy testflight.yml (BUILD_BASE + numer przebiegu), nie plik w repo', () => {
    expect(R('.github/workflows/testflight.yml')).toMatch(/BUILD_NUMBER=\$\(\(BUILD_BASE \+ GITHUB_RUN_NUMBER\)\)/);
  });
  test('docs/18: wpis decyzji 06.11.2026 (B wersja 1.0.1, A wyjątek od audytu) i ZB-043 w zobowiązaniach', () => {
    expect(R('docs/18-przekazanie.md')).toMatch(/06\.11\.2026[^\n]*wersja 1\.0\.1 TestFlight dla właściciela/);
    // 08.11.2026 (właściciel, docs/18): ZB-043 zmienione — zamiast audytu zmian przed następnym buildem pełny głęboki audyt na kandydacie 1.1;
    // build pośredni tylko dla właściciela z kontrolą zastępczą jak 06.11.2026.
    expect(R('docs/zobowiazania.md')).toMatch(/\| ZB-043 \| przed wydaniem 1\.1 — na kandydacie[^\n]*Pełny głęboki audyt całości[^\n]*zmiana 08\.11\.2026/);
  });
  test('dziennik wydań (docs/09) ma wiersz 1.0.1 (TestFlight dla właściciela)', () => {
    expect(R('docs/09-plan-testow.md')).toMatch(/\| Wydanie 1\.0\.1 \(TestFlight dla właściciela/);
  });
});
