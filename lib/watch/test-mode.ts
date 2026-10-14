import Constants from 'expo-constants';
import { isFakeStoreBuild } from '@/lib/products';
import { FakeWatch } from './fake';
import { startWatchLink, stopWatchLink } from './link';

/*
 * Tryb „udawanego zegarka” — TYLKO build E2E na symulatorze (decyzja właściciela 14.10.2026, docs/18; wzór: sztuczny sklep, lib/products.ts isFakeStoreBuild).
 * Symulator iPhone’a nie ma sparowanego zegarka, więc Maestro nie wywoła zdarzeń „zrobione inaczej” ani „pomiń” z zegarka. W tym trybie łącze z zegarkiem
 * (lib/watch/link.ts) dostaje atrapę z modelu referencyjnego (lib/watch/fake.ts), a panel „Test watch” (components/TestWatchPanel.tsx, ekran treningu) naciska
 * jej przyciski — dokładnie te same zdarzenia, które wysłałby zegarek (lib/watch/apply.ts stosuje je jak prawdziwe).
 *
 * Zamek podwójny: tryb włącza dopiero EXPO_PUBLIC_WATCH_FAKE=1 RAZEM z EXPO_PUBLIC_STORE_FAKE=1. Obie zmienne ustawia wyłącznie e2e-ios.yml; testflight.yml odrzuca
 * build ze STORE_FAKE (a z patchem do workflowów także z WATCH_FAKE), więc nawet pominięcie tamtej kontroli nie włączy trybu w TestFlight ani App Store.
 * Strażnik: tests/watch-test-mode.test.ts. Zmienna jest czytana tylko w tym pliku (Metro wstawia wartość przy budowaniu paczki JS).
 */
export const isFakeWatchBuild = (): boolean => process.env.EXPO_PUBLIC_WATCH_FAKE === '1' && isFakeStoreBuild();

/** Przyciski panelu → zdarzenia zegarka: „done” = przycisk główny „Seria zrobiona”, „differ” = „Zrobione inaczej”, „skip” = „Pomiń” z potwierdzeniem na zegarku. */
export type TestWatchEvent = 'done' | 'differ' | 'skip';

let fake: FakeWatch | null = null;
/** Bieżąca atrapa (null poza trybem testowym albo przed startem). */
export const testWatch = (): FakeWatch | null => fake;

/** Uruchamia atrapę jako transport łącza z zegarkiem (zamiast Apple Watch) i zgłasza ją jak start aplikacji na zegarku. Zwraca funkcję zatrzymującą. */
export function startTestWatch(): () => void {
  const fw = new FakeWatch({ client: 'apple', app: String(Constants.expoConfig?.version ?? '0'), session: false }, () => Date.now());
  fake = fw; startWatchLink(fw); fw.input({ t: 'launch' });
  return () => { stopWatchLink(); if (fake === fw) fake = null; };
}

/** Wysyła zdarzenie z atrapy zegarka do telefonu; zwraca false poza trybem testowym. */
export function pressTestWatch(ev: TestWatchEvent): boolean {
  const fw = fake; if (!fw || !isFakeWatchBuild()) return false;
  if (ev === 'done') fw.input({ t: 'press', button: 'main' });
  else if (ev === 'differ') fw.input({ t: 'press', button: 'differ' });
  else { fw.input({ t: 'press', button: 'skip' }); fw.input({ t: 'press', button: 'confirmSkip' }); }
  return true;
}
