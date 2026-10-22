/*
 * M1-audytor-generalny-037: skróty „SS” (superset) i „PR” (rekord) były wpisane na sztywno w 6 miejscach, poza słownikiem — nie dało się ich
 * przetłumaczyć. Teraz idą przez t(): 'SS {g}' (etykieta grupy), 'SS' (przyciski „⇅ SS”, „✕ SS”), 'PR'. Obecnie we wszystkich językach zapis
 * zostaje „SS” / „PR” (decyzja, czy któryś język dostaje własny skrót — do tłumacza; patrz raport).
 */
import fs from 'fs';
import path from 'path';
import { LOCALES } from '@/lib/locales';
import { applyLang } from '@/lib/i18n';
import { ssTag, ssBtn } from '@/lib/state/groups';

afterEach(() => { applyLang('pl'); });
const KEYS = ['SS {g}', 'SS', 'PR'] as const;
describe('słownik: SS i PR są kluczami', () => {
  test.each(Object.keys(LOCALES))('język %s ma wszystkie trzy klucze', l => {
    const d = (LOCALES as Record<string, Record<string, string>>)[l]; for (const k of KEYS) expect(typeof d[k]).toBe('string');
  });
  test('ssTag / ssBtn: pl i en bez zmian wyglądu (SS A, ⇅ SS)', () => {
    for (const l of ['pl', 'en']) { applyLang(l as 'pl'); expect(ssTag('A')).toBe('SS A'); expect(ssBtn('link')).toBe('⇅ SS'); expect(ssBtn('unlink')).toBe('✕ SS'); }
  });
  test('wartość ze słownika trafia na ekran: podmieniony wpis de zmienia etykietę (nie ma sztywnego „SS”)', () => {
    const de = (LOCALES as Record<string, Record<string, string>>).de; const old = { ...de };
    try { de['SS {g}'] = 'Sup {g}'; de['SS'] = 'Sup'; applyLang('de'); expect(ssTag('B')).toBe('Sup B'); expect(ssBtn('link')).toBe('⇅ Sup'); }
    finally { Object.assign(de, old); }
  });
});
describe('skan kodu: brak sztywnych „SS …” i „PR” w tekstach interfejsu', () => {
  const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(tsx?|ts)$/.test(e.name) ? [path.join(d, e.name)] : []);
  const files = ['app', 'components', 'lib'].flatMap(d => walk(path.join(__dirname, '..', d))).filter(f => !/lib[\\/](locales|i18n\.en)/.test(f));
  const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  test('żaden plik nie składa „SS ${…}” ani „⇅ SS” / „✕ SS” ani <…>PR</…> ręcznie', () => {
    const bad: string[] = [];
    for (const f of files) { const s = strip(fs.readFileSync(f, 'utf8')); for (const re of [/`SS \$\{/, /['"]⇅ SS['"]/, /['"]✕ SS['"]/, /\}>PR<\/Text>/, /['"`]SS \$\{/]) if (re.test(s)) bad.push(path.relative(path.join(__dirname, '..'), f) + ' ' + re); }
    expect(bad).toEqual([]);
  });
});
