/*
 * Fala 1 nowych języków (docs/18, 09.10.2026): portugalski brazylijski (pt-BR) i hiszpański Ameryki Łacińskiej (es-419) jako warianty regionalne
 * (wariant B: słownik różnic nakładany na pt / es — lib/locales/index.ts, lib/cues/index.ts).
 * Rodzaje (docs/20): logika (resolveLang, detectLang, locale, liczba mnoga), dane (nakładka: tylko różnice, klucze ze źródła, parametry;
 * ustawienie języka przeżywa migrację, import i restart), języki (słownictwo wariantu: bez słów europejskich, nazwy aplikacji iOS),
 * regresja (pt-PT i es-ES bez zmian). Ekran: tests/i18n-variants-ui.test.tsx; 320 pt / 200 % i jakość — testy z pętlą po LANGS (matrix-i18n,
 * i18n-locales, gen-general-ui…) obejmują nowe kody automatycznie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, BASE_LANG, ES_419_REGIONS, baseLang, resolveLang, applyLang, lang, locale, decimalComma, tp, t, detectLang, LANG_NAME, APP_NAME, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cueDict } from '@/lib/cues';

const VARIANTS = Object.keys(BASE_LANG) as Lang[];
const read = (f: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', f), 'utf8'));
const params = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');

describe('resolveLang: tag języka telefonu → język aplikacji (CLDR parentLocales / likelySubtags)', () => {
  test.each([
    ['pt-BR', 'pt-BR'], ['pt_BR', 'pt-BR'], ['pt', 'pt-BR'] /* CLDR: pt → pt_Latn_BR */, ['pt-Latn-BR', 'pt-BR'],
    ['pt-PT', 'pt'], ['pt-AO', 'pt'], ['pt-MZ', 'pt'], ['pt-CV', 'pt'], ['pt-CH', 'pt'], ['pt-PL', 'pt'],
    ['es-419', 'es-419'], ['es-MX', 'es-419'], ['es-AR', 'es-419'], ['es-CO', 'es-419'], ['es-CL', 'es-419'], ['es-PE', 'es-419'], ['es-US', 'es-419'],
    ['es-PR', 'es-419'], ['es_VE', 'es-419'], ['es-Latn-MX', 'es-419'],
    ['es-ES', 'es'], ['es', 'es'] /* CLDR: es → es_Latn_ES */, ['es-GQ', 'es'], ['es-PH', 'es'], ['es-IC', 'es'], ['es-PL', 'es'],
    ['pl-PL', 'pl'], ['en-US', 'en'], ['sr-Latn-RS', 'sr'], ['nb-NO', 'nb'], ['ja-JP', 'en'], ['zh-Hant-TW', 'en'], ['', 'en'],
  ] as const)('%s → %s', (tag, want) => { expect(resolveLang(tag)).toBe(want); });
  test('kod języka z expo-localization ma pierwszeństwo przed tagiem (tag może mieć inny język tylko w testach), region z tagu', () => {
    expect(resolveLang('en-GB', 'pt')).toBe('pt'); expect(resolveLang('pt-BR', 'pt')).toBe('pt-BR'); expect(resolveLang(null, 'es')).toBe('es');
    expect(resolveLang(undefined, null)).toBe('en');
  });
  test('każdy region z ES_419_REGIONS (CLDR parentLocales es_419) → es-419; ten sam region z innym językiem bez wpływu', () => {
    for (const r of ES_419_REGIONS) expect([r, resolveLang(`es-${r}`), resolveLang(`en-${r}`)]).toEqual([r, 'es-419', 'en']);
  });
  test('każdy język aplikacji rozpoznany z własnego kodu (wariant — z kodu z regionem)', () => {
    for (const l of LANGS) expect([l, resolveLang(l)]).toEqual([l, l === 'pt' ? 'pt-BR' /* sam „pt” = Brazylia (CLDR); pt-PT → pt */ : l]);
    expect(resolveLang('pt-PT')).toBe('pt');
  });
});

describe('detectLang / applyLang("auto") z języka telefonu', () => {
  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  const dev = (code: string, tag: string) => { global.__locales = [{ languageCode: code, languageTag: tag }]; };
  test('Brazylia → pt-BR, Portugalia → pt; Meksyk/Ameryka Łacińska/USA → es-419, Hiszpania → es', () => {
    dev('pt', 'pt-BR'); expect(detectLang()).toBe('pt-BR'); applyLang('auto'); expect([lang(), locale()]).toEqual(['pt-BR', 'pt-BR']);
    dev('pt', 'pt-PT'); expect(detectLang()).toBe('pt');
    dev('es', 'es-419'); applyLang('auto'); expect([lang(), locale()]).toEqual(['es-419', 'es-419']);
    dev('es', 'es-MX'); applyLang('auto'); expect([lang(), locale()]).toEqual(['es-419', 'es-MX']);
    dev('es', 'es-AR'); applyLang('auto'); expect([lang(), locale()]).toEqual(['es-419', 'es-AR']);
    dev('es', 'es-ES'); applyLang('auto'); expect([lang(), locale()]).toEqual(['es', 'es-ES']);
  });
  test('locale do dat i liczb: region telefonu, gdy pasuje język bazowy; inaczej domyślny region wariantu', () => {
    dev('pl', 'pl-PL'); applyLang('pt-BR'); expect(locale()).toBe('pt-BR'); applyLang('es-419'); expect(locale()).toBe('es-419');
    dev('pt', 'pt-PT'); applyLang('pt-BR'); expect(locale()).toBe('pt-PT'); /* wymuszony wariant, telefon w Portugalii — daty jak w telefonie */
    dev('es', 'es-CO'); applyLang('es'); expect(locale()).toBe('es-CO');
  });
  test('separator dziesiętny: pt-BR przecinek, es-419 kropka (CLDR), es-AR przecinek', () => {
    dev('pl', 'pl-PL'); applyLang('pt-BR'); expect(decimalComma()).toBe(true);
    applyLang('es-419'); expect(decimalComma()).toBe(false);
    dev('es', 'es-AR'); applyLang('es-419'); expect(decimalComma()).toBe(true);
  });
});

describe('liczba mnoga wariantów (CLDR plurals.xml)', () => {
  afterEach(() => applyLang('pl'));
  test('pt-BR: 0 i 1 w liczbie pojedynczej (locales="fr pt", i = 0..1); pt-PT i es-419: tylko 1', () => {
    applyLang('pt-BR'); expect([tp(0, 'sesja|sesje|sesji'), tp(1, 'sesja|sesje|sesji'), tp(2, 'sesja|sesje|sesji')]).toEqual(['sessão', 'sessão', 'sessões']);
    applyLang('pt'); expect([tp(0, 'sesja|sesje|sesji'), tp(1, 'sesja|sesje|sesji')]).toEqual(['sessões', 'sessão']);
    applyLang('es-419'); expect([tp(0, 'sesja|sesje|sesji'), tp(1, 'sesja|sesje|sesji'), tp(5, 'sesja|sesje|sesji')]).toEqual(['sesiones', 'sesión', 'sesiones']);
  });
});

describe.each(VARIANTS)('nakładka %s (tylko różnice względem języka bazowego)', v => {
  const base = BASE_LANG[v]!;
  const overlay = read(`locales/${v}.json`); const baseDict = read(`locales/${base}.json`);
  const cueOverlay = read(`cues/text/${v}.json`); const cueBase = read(`cues/text/${base}.json`);
  test('słownik UI: klucze ze źródła, każdy wpis różny od bazowego, niepusty, te same {parametry}', () => {
    const keys = new Set((JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'locales', '_source.json'), 'utf8')) as { pl: string }[]).map(s => s.pl)); /* aktualność pliku: tests/i18n-locales.test.ts */
    expect(Object.keys(overlay).filter(k => !keys.has(k))).toEqual([]);
    expect(Object.keys(overlay).filter(k => overlay[k] === baseDict[k])).toEqual([]);
    expect(Object.keys(overlay).filter(k => !overlay[k].trim() || params(overlay[k]) !== params(k))).toEqual([]);
  });
  test('wskazówki techniki: klucze z bazowego, każdy wpis różny, niepusty', () => {
    expect(Object.keys(cueOverlay).filter(k => !(k in cueBase))).toEqual([]);
    expect(Object.keys(cueOverlay).filter(k => cueOverlay[k] === cueBase[k] || !cueOverlay[k].trim())).toEqual([]);
  });
  test('słownik wariantu = bazowy + nakładka (komplet kluczy jak w bazowym)', () => {
    expect(LOCALES[v]).toEqual({ ...baseDict, ...overlay }); expect(Object.keys(LOCALES[v]!).length).toBe(Object.keys(baseDict).length);
    expect(cueDict(v)).toEqual({ ...cueBase, ...cueOverlay });
  });
  test('nazwa aplikacji jak w języku bazowym; nazwa języka z regionem', () => {
    expect(APP_NAME[v]).toBe(APP_NAME[base]); expect(baseLang(v)).toBe(base);
    expect(LANG_NAME[v]).not.toBe(LANG_NAME[base]); expect(LANG_NAME[v].startsWith(LANG_NAME[base].split(' ')[0])).toBe(true);
  });
});

/* Słownictwo wariantu (jakość językowa): słowa i formy typowe dla odmiany europejskiej nie mogą zostać w wariancie amerykańskim — także w tekstach
 * dziedziczonych z bazowego (nowy tekst dodany tylko do pt.json / es.json, który brzmi „po europejsku”, zatrzyma test). Nazwy aplikacji iOS
 * w wariancie (Apple Support, przewodnik iPhone pt-br / es-mx): pt-BR „Ajustes”, „Arquivos”, app „Saúde”; es-MX „Configuración”, „Archivos”, „Salud”. */
/** Całe słowo (granice wg liter Unicode — \b w JS zna tylko ASCII, więc „ecrã” by nie pasowało). */
const words = (alts: string) => new RegExp(`(?<!\\p{L})(?:${alts})(?!\\p{L})`, 'iu');
const EUROPEAN: Record<string, RegExp[]> = {
  'pt-BR': [
    words('ecrãs?|utilizador(es)?|telemóve(l|is)|ficheiros?|regist(ar|o|os|ado|ados|ada|adas|e|a|ou)|definições|ginásio|equipa|contigo|estás|podes|tens|queres|consegues|precisas|partilh\\p{L}*|carregue|guarde|guardar|guardad\\p{L}*|elimin\\p{L}*|teu|tua|teus|tuas'),
    /(?<!\p{L})(?:está|estão|estou|estiver|estar) a \p{L}+r(?!\p{L})/iu, /* „está a fazer” — w Brazylii „está fazendo” */
    /(?<!\p{L})\p{L}+-(?:o|a|os|as|lhe|lhes|me|te)(?!\p{L})/iu, /* enkliza w poleceniach („guarde-o”, „ative-a”) — w Brazylii proklityka */
  ],
  'es-419': [
    words('vosotr[oa]s|vuestr[oa]s?|ordenador(es)?|móvil(es)?|coger|ficheros?|ajustes|zumo|pulsa|pulsar'),
    /(?<!\p{L})\p{L}+(?:áis|éis)(?!\p{L})/iu, /* 2. os. l.mn. (vosotros) */
  ],
};
describe.each(VARIANTS)('słownictwo %s', v => {
  test('UI i wskazówki techniki bez słów i form odmiany europejskiej', () => {
    const hit = (s: string) => EUROPEAN[v].some(re => re.test(s));
    const ui = Object.entries(LOCALES[v]!).filter(([, s]) => hit(s)).map(([k, s]) => `${k} → ${s}`);
    const cues = Object.entries(cueDict(v)).filter(([, s]) => hit(s)).map(([k, s]) => `${k} → ${s}`);
    expect(ui).toEqual([]); expect(cues).toEqual([]);
  });
});
test('nazwy aplikacji iOS w wariantach: Ustawienia iOS i Pliki jak w iOS danego regionu', () => {
  const both = (v: Lang, pl: string) => { applyLang(v); const s = t(pl); applyLang('pl'); return s; };
  expect(both('pt-BR', 'Otwórz Ustawienia iOS')).toMatch(/Ajustes/); expect(both('es-419', 'Otwórz Ustawienia iOS')).toMatch(/Configuración/);
  expect(both('pt', 'Otwórz Ustawienia iOS')).toMatch(/Definições/); expect(both('es', 'Otwórz Ustawienia iOS')).toMatch(/Ajustes/); /* regresja */
  expect(both('pt-BR', 'Ustawienia')).toBe('Ajustes'); expect(both('es-419', 'Ustawienia')).toBe('Configuración');
});
test('iOS: opisy uprawnień w wariancie (locales/<kod>.json) z nazwą aplikacji Zdrowie regionu', () => {
  const f = (v: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', `${v}.json`), 'utf8'));
  expect(f('pt-BR').NSHealthUpdateUsageDescription).toMatch(/salva .*app Saúde/); expect(f('es-419').NSHealthUpdateUsageDescription).toMatch(/app Salud/);
});
