/* Audyt 1.0 (B-05, B-06, Z-02 pkt 3): poprawki tekstów źródłowych — konto Apple zamiast Apple ID, App Store zamiast TestFlight, ścieżka do Miejsc i sprzętu,
 * liczba godzin autozapisu z STALE_AUTO_MS (jedno miejsce). Słowniki 33 języków mają nowe klucze (przekład API), starych kluczy nie ma. */
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LANGS } from '@/lib/i18n';
import { STALE_AUTO_MS } from '@/lib/store';

const NEW = {
  paywall: 'Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach konta Apple, kiedy zechcesz.',
  newer: 'Dane w telefonie zapisała nowsza wersja (schemat {a}); ta wersja obsługuje do {b}. Niczego nie zmieniam — zainstaluj najnowszą wersję z App Store. Dane możesz też wysłać jako plik.',
  backup: 'Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → {app} → Backup, ostatnie {n}). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego konta Apple wyeksportuj backup na zewnątrz.',
  stale: 'Trening z {d} {s} nie miał aktywności od {h} godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w zakładce Plan.',
  place: 'Miejsce trafi na listę miejsc (Więcej → Miejsca i sprzęt).',
} as const;
const OLD = ['ustawieniach Apple ID', 'najnowszą wersję (TestFlight)', 'innego Apple ID', 'od 6 godzin', '(Ustawienia → Miejsca i sprzęt)'];

describe('audyt 1.0: teksty źródłowe', () => {
  test.each(Object.entries(NEW))('klucz %s jest w EN i we wszystkich 33 językach', (_n, pl) => {
    expect(typeof EN[pl]).toBe('string');
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) expect([l, typeof LOCALES[l]?.[pl]]).toEqual([l, 'string']);
  });
  test('starych sformułowań nie ma w kluczach EN', () => {
    for (const k of Object.keys(EN)) for (const o of OLD) expect([k, k.includes(o)]).toEqual([k, false]);
  });
  test('EN: konto Apple (nie Apple ID), App Store (nie TestFlight), Więcej → Miejsca i sprzęt', () => {
    expect(EN[NEW.paywall]).toMatch(/Apple account settings/); expect(EN[NEW.paywall]).not.toMatch(/Apple ID/);
    expect(EN[NEW.newer]).toMatch(/App Store/); expect(EN[NEW.newer]).not.toMatch(/TestFlight/);
    expect(EN[NEW.backup]).toMatch(/different Apple account/); expect(EN[NEW.backup]).not.toMatch(/Apple ID/);
    expect(EN[NEW.place]).toBe('The place will be added to your places (More → Places and equipment).');
  });
  test('autozapis: liczba godzin w tekście pochodzi z STALE_AUTO_MS ({h}), nie jest wpisana na stałe', () => {
    expect(NEW.stale).toContain('{h}'); expect(EN[NEW.stale]).toContain('{h} hours');
    expect(STALE_AUTO_MS / 3600e3).toBe(6);
  });
});
