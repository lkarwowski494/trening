/* W-04 (docs/49), 11.11.2026: to, czego nie sprawdzi automat dla ZB-039 (głos zapowiedzi — wariant A, decyzja właściciela 03.11.2026)
 * i ZB-056 (marka RepsGoat, decyzja właściciela 09.11.2026), jest na liście „tylko telefon” (tests/przeplywy.json → docs/39).
 * Mowa AVSpeechSynthesizer i nazwa pod ikoną istnieją dopiero na prawdziwym telefonie z buildem 1.1. */
import * as fs from 'fs';
import * as path from 'path';
import { BRAND_NAME } from '@/lib/brand';

const root = path.join(__dirname, '..');
type Flow = { id: string; wyjatek?: { typ: string; kontrola?: string; zastepnik: string[] } };
const flows: Flow[] = JSON.parse(fs.readFileSync(path.join(root, 'tests/przeplywy.json'), 'utf8')).przeplywy;
const telefon = (id: string) => {
  const f = flows.find(x => x.id === id);
  expect([id, f?.wyjatek?.typ]).toEqual([id, 'telefon']);
  return f!.wyjatek!;
};
const lista = fs.readFileSync(path.join(root, 'docs/39-lista-kontrolna-wydania.md'), 'utf8');

test('ZB-039 (11.11.2026): W2-04 każe odsłuchać jakość głosu i sprawdzić wskazówkę „lepszy głos” tylko przy głosie podstawowym', () => {
  const w = telefon('W2-04');
  const k = (w.kontrola ?? '').toLowerCase();
  for (const s of ['głosie podstawowym', 'rozszerzon', 'wskazówk', 'zb-039']) expect([s, k.includes(s)]).toEqual([s, true]);
  expect(w.zastepnik).toEqual(expect.arrayContaining(['tests/voice.test.ts', 'tests/voice-native.test.ts']));
  expect(lista).toContain('ZB-039');
});

test('ZB-056 (11.11.2026): ZD-02 każe sprawdzić nazwę marki pod ikoną (iPhone i zegarek)', () => {
  const k = telefon('ZD-02').kontrola ?? '';
  expect(k).toContain(BRAND_NAME);
  expect(k.toLowerCase()).toContain('zegark');
  expect(lista).toContain(`„${BRAND_NAME}”`);
});
