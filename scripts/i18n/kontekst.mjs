// Kontekst ekranu dla przekładu i przeglądu przez API (lekcje L-030, L-052): model dostaje przy kluczu informację, CZYM jest tekst
// (przycisk, nagłówek, faza ruchu, nazwa sprzętu…) i gdzie się pokazuje. Źródło: docs/lokalizacja/konteksty.json
// (generuje scripts/i18n-context.mjs z miejsc użycia + docs/lokalizacja/konteksty-reczne.json). Bez zależności.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const PLIK_KONTEKSTOW = 'docs/lokalizacja/konteksty.json';
/** Najwięcej znaków kontekstu na pozycję (koszt tokenów): opis ręczny stoi na początku wpisu, miejsca użycia na końcu — ucinany jest koniec. */
export const KONTEKST_MAX = 200;

/** Wpisy klucz → kontekst; brak pliku (atrapy projektu w testach) → {}. */
export function wczytajKonteksty(root) {
  const p = join(root, PLIK_KONTEKSTOW);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}

/** Kontekst klucza skrócony do `max` znaków; null, gdy go nie ma albo jest tylko „dynamiczny” (bez informacji o znaczeniu). */
export function kontekstDla(konteksty, klucz, max = KONTEKST_MAX) {
  const v = konteksty && Object.prototype.hasOwnProperty.call(konteksty, klucz) ? konteksty[klucz] : null;
  if (typeof v !== 'string' || !v.trim() || v.startsWith('dynamiczny')) return null;
  const s = v.trim();
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;
}

/** Zdanie dla polecenia systemowego/użytkownika: jak użyć pola „kontekst”. */
export const OPIS_POLA_KONTEKST = 'Pole „kontekst” (jeśli jest) mówi, CZYM jest ten tekst i gdzie się pokazuje (przycisk, nagłówek, etykieta, faza ruchu, nazwa sprzętu, mięsień itp.; zapis plik:linia wskazuje miejsce w kodzie). Dobierz znaczenie i formę gramatyczną do tego użycia — krótki rzeczownik bez kontekstu bywa błędnie brany za nazwę ćwiczenia albo za coś z innej dziedziny (np. „przerwa” = odpoczynek między seriami na siłowni, nie przerwa w pracy; „Podciąganie” jako faza ruchu = nazwa fazy, nie ćwiczenia).';
