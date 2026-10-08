/*
 * Audyt 0.10 — języki (docs/25 grupa K, docs/audyt-0.10/A11.md). Logika i słowniki; ekrany: tests/audit-0.10-lang-ui.test.tsx.
 * K1 (A11-01): „Przerwa” (odpoczynek między seriami) i „Pauza” (zatrzymanie zegara treningu) to różne słowa w każdym języku.
 */
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LANGS, type Lang } from '@/lib/i18n';

const dictOf = (l: Lang): Record<string, string> => l === 'en' ? EN : (LOCALES[l] ?? {});
const tr = (l: Lang, k: string) => l === 'pl' ? k : dictOf(l)[k] ?? EN[k] ?? k;
type NonPl = Exclude<Lang, 'pl'>;
const NON_PL = LANGS.filter(l => l !== 'pl') as NonPl[];

/**
 * Termin przerwy (rest) i pauzy (pause) w każdym języku — rdzenie (wyrażenia regularne, bez wielkości liter). Wybór 09.10.2026 (A11-01):
 * tam, gdzie słowo „pauza” jest zwykłym terminem przerwy między seriami w ~30 tekstach (cs, sk, ro, et, de), pauza treningu dostaje
 * czasownik jak w iOS (cs/sk „Pozastavit”, ro „Întrerupe”, et „Peata”, de „Anhalten”); w da/nb przerwa = „hvile” (już w tekstach),
 * pauza zostaje „pause”; fi przerwa = „palautus”, pauza = „tauko”. Pozostałe języki miały już dwa różne słowa.
 */
export const TERMS: Record<NonPl, { rest: RegExp; pause: RegExp }> = {
  en: { rest: /\brest/i, pause: /paus/i },
  cs: { rest: /pauz/i, pause: /pozastav/i }, sk: { rest: /pauz/i, pause: /pozastav/i },
  hu: { rest: /pihen/i, pause: /szünet/i }, ro: { rest: /pauz/i, pause: /întrerup/i },
  bg: { rest: /почив/i, pause: /пауз/i }, hr: { rest: /odmor/i, pause: /pauz/i }, sl: { rest: /počit/i, pause: /premor|ustav/i },
  sr: { rest: /одмор/i, pause: /пауз/i }, lt: { rest: /poils/i, pause: /pauz|pristabd/i }, lv: { rest: /atpūt/i, pause: /pauz|aptur/i },
  et: { rest: /paus/i, pause: /peat/i }, uk: { rest: /відп/i /* także skrót „відп.” w nagłówku kolumny */, pause: /пауз|призупин/i },
  es: { rest: /descans/i, pause: /paus/i }, pt: { rest: /descans/i, pause: /paus/i },
  de: { rest: /pause/i, pause: /anhalt|angehalten/i }, fr: { rest: /repos/i, pause: /pause/i }, it: { rest: /recuper/i, pause: /paus/i },
  nl: { rest: /rust/i, pause: /pauz/i }, sv: { rest: /vil[ao]/i, pause: /paus/i }, da: { rest: /hvil/i, pause: /pause/i }, nb: { rest: /hvil/i, pause: /pause/i },
  fi: { rest: /palaut/i, pause: /tauk|tauo|keskeyt/i }, tr: { rest: /dinlen/i, pause: /durakla/i }, el: { rest: /δι[άα]λε[ίι]μμ/i, pause: /παύσ|παυσ/i },
};
const KEYS = Object.keys(EN);
/** Przerwa między seriami (bez „Import przerwany”, „przerwie pomiar” i „dzień przerwy” — dzień odpoczynku między treningami). */
const REST_DAY = /dzie[ńn] przerwy|dniem przerwy/;
const REST_KEYS = KEYS.filter(k => /przerw/i.test(k) && !/przerwan|przerwie pomiar/i.test(k) && !REST_DAY.test(k) && !/pauz/i.test(k));
const PAUSE_KEYS = KEYS.filter(k => /pauz/i.test(k) && !/przerw/i.test(k));
const MIXED_KEYS = KEYS.filter(k => /pauz/i.test(k) && /przerw/i.test(k));
const words = (s: string) => new Set(s.toLowerCase().match(/\p{L}+/gu) ?? []);

describe('K1 (A11-01): przerwa ≠ pauza w każdym języku', () => {
  test('zestawy kluczy nie są puste (kontrola filtra)', () => {
    expect(REST_KEYS.length).toBeGreaterThanOrEqual(25); expect(PAUSE_KEYS.length).toBeGreaterThanOrEqual(5); expect(MIXED_KEYS.length).toBeGreaterThanOrEqual(1);
    expect(REST_KEYS).toEqual(expect.arrayContaining(['Przerwa', 'przerwa', 'przerwa {s}', 'Wydłuż przerwę o 15 sekund']));
    expect(PAUSE_KEYS).toEqual(expect.arrayContaining(['⏸ Pauza', 'pauza', 'Pauza treningu']));
  });
  test('słownik terminów obejmuje każdy język poza polskim', () => { expect(Object.keys(TERMS).sort()).toEqual([...NON_PL].sort()); });
  test.each(NON_PL)('%s: wyrazy „Przerwa” i „⏸ Pauza” / „pauza” / „Pauza treningu” są rozłączne', l => {
    const rest = new Set([...words(tr(l, 'Przerwa')), ...words(tr(l, 'przerwa'))]);
    const clash = ['⏸ Pauza', 'pauza', 'Pauza treningu'].flatMap(k => [...words(tr(l, k))].filter(w => rest.has(w)));
    expect([l, clash]).toEqual([l, []]);
  });
  test.each(NON_PL)('%s: każdy tekst o przerwie ma termin przerwy i nie ma terminu pauzy; każdy tekst o pauzie odwrotnie', l => {
    const { rest, pause } = TERMS[l]; const bad: string[] = [];
    for (const k of REST_KEYS) { const v = tr(l, k); if (!rest.test(v) || pause.test(v)) bad.push(`R ${k} → ${v}`); }
    for (const k of PAUSE_KEYS) { const v = tr(l, k); if (!pause.test(v) || rest.test(v)) bad.push(`P ${k} → ${v}`); }
    for (const k of MIXED_KEYS) { const v = tr(l, k); if (!pause.test(v) || !rest.test(v)) bad.push(`M ${k} → ${v}`); }
    for (const k of KEYS.filter(x => REST_DAY.test(x))) { const v = tr(l, k); if (pause.test(v)) bad.push(`D ${k} → ${v}`); }
    expect([l, bad]).toEqual([l, []]);
  });
});
