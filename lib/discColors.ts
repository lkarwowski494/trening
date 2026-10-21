/*
 * Kolory talerzy na ikonie aplikacji, w animacji startowej i w grafikach motywu (lib/motif.ts, lib/brandIcon.ts) — styl „Tuleja”, decyzja właściciela 07.10.2026.
 * Kolory: IWF Technical and Competition Rules & Regulations, pkt 3.3.3.6 „Competition discs” (wyd. 2019, kopia PZPC:
 * https://pzpc.pl/download/file/3354): 25 kg czerwony, 20 niebieski, 15 żółty, 10 zielony, 5 biały. Wydanie IWF 2025 nieprzeczytane (docs/21: [NIEZWERYFIKOWANE]).
 * Kolor nigdy nie jest jedyną informacją (WCAG 1.4.1).
 * 20.10.2026 (DEC-06, audyt M1): pasek talerzy „na każdą stronę” (PlateBar) i jego kalkulator usunięte z aplikacji — zostaje tylko paleta marki.
 */
export const PLATE_COLORS = { red: '#D7263D', blue: '#1F5FD1', yellow: '#F2C230', green: '#2E9E5B', white: '#FFFFFF' } as const;
export type PlateColor = keyof typeof PLATE_COLORS;
