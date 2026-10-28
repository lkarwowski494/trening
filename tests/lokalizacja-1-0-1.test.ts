/*
 * 1.0.1, przegląd lokalizacji Z-02 (pozycje nieblokujące): rejestr formalny na ekranach (el, lt, lv, cs, sk, tr, id, sr, hu, uk, pt, ro), słownictwo wariantów
 * (es-419, pt-BR), skróty w tekstach pomocy (da, de, nb). Strażnik: znane formy „ty” w tych tekstach nie wracają; wskazówki techniki (lib/cues, „ton trenera”) poza zakresem.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOCALES } from '@/lib/locales';
import type { Lang } from '@/lib/i18n';

const L = (l: string) => LOCALES[l as Lang] as Record<string, string>;
const vals = (l: string) => Object.values(L(l));
const FORBIDDEN: Record<string, RegExp> = {
  el: /αίρει το όριο|διάγραψέ|Κατέβασέ|Ενεργοποίησέ|πληρώσεις|ακυρώσεις|θα τη βρεις|έβαλες|κατέγραψες|να προσθέσεις|να επιλέξεις/i,
  lt: /nemokėtum(?!\p{L})|neatšauksi(?!\p{L})|atkursi(?!\p{L})|nepadarysi(?!\p{L})|pamatysi(?!\p{L})|neįvesi(?!\p{L})|nekeisi(?!\p{L})|pakeistum(?!\p{L})|pridėtum(?!\p{L})|išjungtum(?!\p{L})/u,
  lv: /atjaunosi\b|pievienosi\b|atkārtosi\b|sāksi tukšu/,
  cs: /\bmáš\b|\bjsi nezapsal|a začni\b/i,
  sk: /\bmáš\b|aby sa nezaplatilo/i,
  tr: /Verilerin değiştirilmedi|geçmişinde\.|zaten antrenmanın olduğu/,
  id: /\b[Kk]amu\b|(?:data|riwayat|latihan|milik|perangkat)mu\b/i,
  sr: /Твоји подаци|у твојој историји|са твојим/,
  hu: /előzményeidben/,
  uk: /проведи її|за твоїм/,
  pt: /desliza o nome|\bTreina em casa|Define a data/,
  ro: /setează alta|Atinge pentru|Verifică conexiunea|Introdu un număr/,
  da: /gent\.-interval/i, de: /Wdh\.-Bereich|Apple-Account/, nb: /rep\.-område/i,
  'es-419': /entrenos?(?![\p{L}])|copia de seguridad|copias de seguridad|\bAñade\b/u,
  'pt-BR': /demasiado|O relógio guarda/,
};

describe('lokalizacja 1.0.1: znane formy spoza rejestru/wariantu nie wracają', () => {
  test.each(Object.keys(FORBIDDEN))('%s: słownik UI bez zakazanych form', (l) => {
    /* skróty w krótkich etykietach przycisków (np. „+ gent.-interval”) są dozwolone; zakaz dotyczy zdań */
    const bad = Object.entries(L(l)).filter(([, v]) => (['da', 'de', 'nb'].includes(l) ? v.length > 30 : true) && FORBIDDEN[l].test(v)).map(([k, v]) => `${k.slice(0, 40)} -> ${v.slice(0, 80)}`);
    expect(bad).toEqual([]);
  });
  test('wymienione poprawki są na miejscu (wartości)', () => {
    const has = (l: string, s: string) => expect(vals(l).some(v => v.includes(s))).toBe(true);
    has('el', 'ακυρώστε την για να μην πληρώσετε διπλά'); has('el', 'διαγράψτε το στην εφαρμογή Υγεία'); has('lt', 'kad nemokėtumėte dukart');
    has('cs', 'Máte přístup navždy'); has('sk', 'Máte plnú verziu'); has('sk', 'aby ste neplatili dvakrát'); has('tr', 'Verileriniz değiştirilmedi'); has('id', 'Data Anda tidak diubah');
    has('sr', 'Ваши подаци нису промењени'); has('hu', 'előzményeiben'); has('uk', 'проведіть її назву'); has('pt', 'deslize o nome'); has('ro', 'setați alta');
    has('es-419', '¡Primer entrenamiento completado!'); has('es-419', 'desde un respaldo'); has('pt-BR', 'grande demais');
    has('de', 'Wiederholungsbereichs'); has('de', 'Apple Account'); has('el', 'Με το Pro δεν υπάρχει όριο'); has('es-419', 'Agrega entrenamientos desde CSV'); has('da', 'gentagelsesinterval'); has('nb', 'repetisjonsområdet');
  });
  test('es-419 i pt-BR: nakładka tylko z kluczami ze źródła i z tymi samymi parametrami', () => {
    const src = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/locales/_source.json'), 'utf8'));
    const keys = new Set<string>((src as { pl: string }[]).map(x => x.pl));
    for (const l of ['es-419', 'pt-BR']) for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(__dirname, '..', `lib/locales/${l}.json`), 'utf8')) as Record<string, string>)) {
      expect([l, keys.has(k)]).toEqual([l, true]); expect((v.match(/\{\w+\}/g) ?? []).sort()).toEqual((k.match(/\{\w+\}/g) ?? []).sort());
    }
  });
  test('InfoPlist: el w rejestrze formalnym, es-419 bez „copias de seguridad” i „sitio”', () => {
    const rd = (l: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', `locales/${l}.json`), 'utf8')) as Record<string, string>;
    expect(JSON.stringify(rd('el'))).not.toMatch(/σου/); expect(JSON.stringify(rd('es-419'))).not.toMatch(/copias de seguridad|ningún sitio/);
  });
});
