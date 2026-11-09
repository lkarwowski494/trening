/*
 * Przykładowe wpisy „Co nowego” dla testów ekranu (1.0.0: historia była pusta — decyzja właściciela 14.10.2026; od 1.0.1 ma jeden wpis, docs/18 06.11.2026).
 * Komponent zostaje gotowy na pierwszy wpis 1.1, więc jego zachowanie (kropka, rozwijanie, tytuły, VoiceOver) sprawdzamy na tych próbkach.
 * Teksty nie przechodzą przez t() — to dane testowe, nie teksty aplikacji.
 */
import { WHATS_NEW, type WhatsNewEntry } from '@/lib/whatsnew';

export const PROBKI: WhatsNewEntry[] = [
  { id: 'probka-3', build: 1018, date: '2026-10-19', items: () => ['Pierwszy punkt bieżącego wpisu.', 'Drugi punkt bieżącego wpisu.'] },
  { id: 'probka-2', build: 1005, date: '2026-10-10', items: () => ['Punkt starszego wpisu.', 'Drugi punkt starszego wpisu.'] },
  { id: 'probka-1', build: 1002, date: '2026-10-07', items: () => ['Najstarszy punkt.', 'Drugi najstarszy punkt.'] },
];

/** Wstawia próbki do WHATS_NEW przed każdym testem bloku i usuwa je po nim (po teście wraca wpis z kodu). */
export function zProbkami() {
  const zapis: WhatsNewEntry[] = [];
  beforeEach(() => { zapis.splice(0, zapis.length, ...WHATS_NEW); WHATS_NEW.splice(0, WHATS_NEW.length, ...PROBKI); });
  afterEach(() => { WHATS_NEW.splice(0, WHATS_NEW.length, ...zapis); });
}
