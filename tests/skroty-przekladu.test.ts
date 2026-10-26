/**
 * L-038: skróty (hash) źródła i przekładu dla treści o STAŁYM kluczu — wskazówki techniki (lib/cues/text) i opisy uprawnień (locales/*.json).
 * Dlaczego: zestaw przekładu i strażniki słowników śledzą klucze UI (`_source.json`). Wskazówka ma stałe id (`lunge.torso`), więc zmiana
 * polskiego/angielskiego brzmienia nie tworzy nowego klucza i przestarzałe przekłady w 33 językach nikogo nie czerwieniły (25.10.2026).
 * Mechanizm: docs/lokalizacja/skroty-przekladu.json trzyma dla każdego zdania skrót PL+EN („s”) i skrót przekładu w każdym języku („t”) z chwili
 * ostatniego przekładu. Gdy źródło się zmieniło, a przekład w jakimś języku jest taki sam jak wtedy — test jest czerwony.
 * Po przekładzie (albo po uzasadnionym wyjątku w `wyjatki`): UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts — zapis jest
 * odrzucany, dopóki któryś przekład stoi w miejscu bez wyjątku.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { LANGS } from '@/lib/i18n';
import { cueDict } from '@/lib/cues';

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'docs/lokalizacja/skroty-przekladu.json');
const h = (s: string): string => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
type Wpis = { s: string; t: Record<string, string> };
type Plik = { wyjatki: Record<string, string>; wskazowki: Record<string, Wpis>; uprawnienia: Record<string, Wpis> };
const TARGET = LANGS.filter((l) => l !== 'pl' && l !== 'en');

function aktualne(): { wskazowki: Record<string, Wpis>; uprawnienia: Record<string, Wpis> } {
  const wskazowki: Record<string, Wpis> = {};
  const pl = cueDict('pl'), en = cueDict('en');
  for (const id of Object.keys(pl).sort()) {
    wskazowki[id] = { s: h(pl[id] + '\n' + (en[id] ?? '')), t: Object.fromEntries(TARGET.map((l) => [l, h(cueDict(l)[id] ?? '')])) };
  }
  const loc = (l: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', l + '.json'), 'utf8'));
  const uprawnienia: Record<string, Wpis> = {};
  for (const k of Object.keys(loc('pl')).sort()) {
    if (k === 'CFBundleDisplayName') continue; // nazwa aplikacji: nie przekładana wprost
    uprawnienia[k] = { s: h(loc('pl')[k] + '\n' + loc('en')[k]), t: Object.fromEntries(TARGET.filter((l) => fs.existsSync(path.join(ROOT, 'locales', l + '.json'))).map((l) => [l, h(loc(l)[k] ?? '')])) };
  }
  return { wskazowki, uprawnienia };
}

/** Zdania, których źródło zmieniono, a przekład w danym języku stoi w miejscu (i brak wyjątku). */
function zastoje(zapis: Record<string, Wpis>, teraz: Record<string, Wpis>, wyjatki: Record<string, string>, grupa: string): string[] {
  const out: string[] = [];
  for (const [id, now] of Object.entries(teraz)) {
    const was = zapis[id];
    if (!was || was.s === now.s || wyjatki[`${grupa}:${id}`]) continue;
    const stoja = Object.keys(now.t).filter((l) => was.t[l] === now.t[l]);
    if (stoja.length) out.push(`${grupa}:${id} — źródło PL/EN zmienione, przekład bez zmiany w: ${stoja.join(', ')}`);
  }
  return out;
}

describe('L-038: skróty źródła i przekładu (wskazówki techniki, opisy uprawnień)', () => {
  const plik: Plik = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { wyjatki: {}, wskazowki: {}, uprawnienia: {} };
  const teraz = aktualne();

  if (process.env.UPDATE_SKROTY) {
    test('zapis skrótów (UPDATE_SKROTY=1) — tylko gdy żaden przekład nie stoi w miejscu', () => {
      const bad = [...zastoje(plik.wskazowki, teraz.wskazowki, plik.wyjatki, 'wskazowki'), ...zastoje(plik.uprawnienia, teraz.uprawnienia, plik.wyjatki, 'uprawnienia')];
      expect(bad).toEqual([]);
      fs.writeFileSync(FILE, JSON.stringify({ wyjatki: plik.wyjatki, ...teraz }, null, 1) + '\n');
    });
    return;
  }

  test('wskazówki: źródło PL/EN zmienione => przekład we wszystkich językach też zmieniony', () => {
    expect(zastoje(plik.wskazowki, teraz.wskazowki, plik.wyjatki, 'wskazowki')).toEqual([]);
  });
  test('opisy uprawnień (locales/*.json): źródło PL/EN zmienione => przekład we wszystkich językach też zmieniony', () => {
    expect(zastoje(plik.uprawnienia, teraz.uprawnienia, plik.wyjatki, 'uprawnienia')).toEqual([]);
  });
  test('plik skrótów jest aktualny i obejmuje każde zdanie (nowe zdanie => UPDATE_SKROTY=1)', () => {
    expect(Object.keys(plik.wskazowki).sort()).toEqual(Object.keys(teraz.wskazowki).sort());
    expect(Object.keys(plik.uprawnienia).sort()).toEqual(Object.keys(teraz.uprawnienia).sort());
    for (const g of ['wskazowki', 'uprawnienia'] as const) for (const id of Object.keys(teraz[g])) expect({ id, ...plik[g][id] }).toEqual({ id, ...teraz[g][id] });
  });
  test('każdy wyjątek ma powód i wskazuje istniejące zdanie', () => {
    for (const [k, why] of Object.entries(plik.wyjatki)) {
      const [g, id] = k.split(':') as ['wskazowki' | 'uprawnienia', string];
      expect(teraz[g]?.[id]).toBeTruthy();
      expect(why.length).toBeGreaterThan(10);
    }
  });
  test('wykrywa zastój: zmiana źródła bez zmiany przekładu jest czerwona (atrapa)', () => {
    const was: Record<string, Wpis> = { x: { s: 'a', t: { de: '1', fr: '2' } } };
    expect(zastoje(was, { x: { s: 'b', t: { de: '1', fr: '9' } } }, {}, 'wskazowki')).toHaveLength(1);
    expect(zastoje(was, { x: { s: 'b', t: { de: '8', fr: '9' } } }, {}, 'wskazowki')).toHaveLength(0);
    expect(zastoje(was, { x: { s: 'b', t: { de: '1', fr: '2' } } }, { 'wskazowki:x': 'literówka w źródle, sens bez zmiany' }, 'wskazowki')).toHaveLength(0);
  });
});
