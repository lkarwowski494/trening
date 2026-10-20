/**
 * Regresja po przebiegu E2E 39427683836 (audyt-m1, próba 17): trzy przyczyny po stronie scenariuszy.
 * Interpreter Jest nie odtwarza ich wprost (działa na bieżącym UI i szacuje układ), więc pilnujemy ich strażnikami na treści scenariuszy.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const yaml = (f: string) => readFileSync(join(__dirname, '..', '.maestro', f), 'utf8');
const bezKomentarzy = (s: string) => s.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');

describe('scenariusz 33 działa na POPRZEDNIEJ wersji (v0.20.0-b1018)', () => {
  const s33 = bezKomentarzy(yaml('33-aktualizacja-przygotuj.yaml'));
  it('nie używa selektora id unit-system-* (stara wersja nie ma testID segmentu jednostki)', () => {
    expect(s33).not.toMatch(/unit-system/);
  });
  it('pole jednostki rozpoznaje po etykiecie starej („Weight unit”) i nowej („Measurement system”)', () => {
    expect(s33).toMatch(/visible: "Weight unit\|Measurement system"/);
  });
  it('segment kg: stary „kg” albo nowy „metric (kg, km, m)”', () => {
    expect(s33).toContain('tapOn: "kg|metric \\\\(kg, km, m\\\\)"');
  });
  it('bieżąca wersja ma etykietę nowego pola (druga gałąź alternatywy nadal trafia)', () => {
    const en = readFileSync(join(__dirname, '..', 'lib', 'i18n.en.ts'), 'utf8');
    expect(en).toContain("'metryczny (kg, km, m)': 'metric (kg, km, m)'");
  });
});

describe('scenariusz 09 — zdjęcie fokusu po wpisaniu dystansu', () => {
  it('stuka nazwę ćwiczenia „Running” (nad klawiaturą; nagłówki kolumn są poza drzewem dostępności), nie tekst karty skupionej (pod klawiaturą przy dwóch ćwiczeniach)', () => {
    const s = bezKomentarzy(yaml('09-jezyk-wyglad.yaml'));
    const i = s.indexOf('inputText: "100"');
    expect(i).toBeGreaterThan(0);
    const po = s.slice(i, i + 200);
    expect(po).toContain('tapOn: "Running"');
    expect(po).not.toContain('Change the values');
  });
});

describe('podprzepływ szablon-testowy — zakładka „More” po starcie', () => {
  it('powtarza stuknięcie zakładki do pojawienia się „Templates” (stuknięcie tuż po starcie bywa gubione)', () => {
    const s = bezKomentarzy(yaml('subflows/szablon-testowy.yaml'));
    expect(s).toMatch(/retry:[\s\S]*?tapOn: "More, tab\.\*"[\s\S]*?visible: "Templates"/);
  });
});
