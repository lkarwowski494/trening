/*
 * 1.0.1 (decyzja właściciela 28.10.2026, docs/18 „003 → 1.0.1”): „Standing Gastrocnemius Calf Stretch” przedefiniowane na wariant na stopniu.
 * Rodzaje (docs/20): dane (mięśnie bez dwugłowych uda, pewność i źródła w katalogu), źródła (≥ 2 organizacje szczebla 4, brak dawnego jedynego źródła),
 * języki (4 nowe zdania w każdym języku wskazówek), niezmiennik (zestaw ogólny rozciągania z własnymi zdaniami, sprzęt bez zmian, poprawka przypisu calf.step),
 * regresja (test pada na dawnych danych). Ćwiczenie spoza listy podstawowej nie może mieć karty własnej (tests/cues.test.tsx) — zdania idą przez zestaw ogólny.
 * Recenzja niezależna (bramka 4) jest osobnym wpisem w docs/research/figury-recenzja.json — ten test jej nie zastępuje ani nie podrabia.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG, CATALOG_RESEARCH, MUSCLE_LOAD } from '@/lib/catalog.generated';
import { MUSCLE_DATA } from '@/lib/figures/v2/muscles.generated';
import { cueDict } from '@/lib/cues';
import { LANGS } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const KEY = 'Standing Gastrocnemius Calf Stretch';
const IDS = ['gcalf.set', 'gcalf.move', 'gcalf.support', 'gcalf.knee'];
type Full = { orgs: Record<string, { level: number }>; sources: Record<string, { org: string; level: number; url: string }>; exercises: Record<string, Record<string, { c: string; s: string[][] }[]>> };
const FULL: Full = read('data/zrodla/cues.json');

describe('Standing Gastrocnemius Calf Stretch (wariant na stopniu) — dane katalogu', () => {
  test('mięśnie: tylko łydki (bez dwugłowych uda, które nie mają podstawy w żadnym źródle), w katalogu i w danych figur', () => {
    expect(MUSCLE_LOAD[KEY]).toEqual({ calves: 0.25 });
    expect(MUSCLE_DATA[KEY].load).toEqual({ calves: 0.25 });
    expect(Object.keys(MUSCLE_DATA[KEY].load)).not.toContain('hamstrings');
  });
  test('pewność „mocne”, a źródła to nowe wpisy (L3-S36…S39), bez dawnego jedynego źródła L3-S17', () => {
    const [, conf, src] = CATALOG_RESEARCH[KEY];
    expect(conf).toBe('mocne');
    expect(src).toEqual(expect.arrayContaining(['L3-S36', 'L3-S37', 'L3-S38', 'L3-S39']));
    expect(src).not.toContain('L3-S17');
    const doc = fs.readFileSync(path.join(root, 'docs/research/25-biblioteka/L3-zrodla.md'), 'utf8');
    for (const id of ['L3-S36', 'L3-S37', 'L3-S38', 'L3-S39']) expect(doc).toContain(`**${id}**`);
  });
  test('sprzęt bez zmian (wariant A, docs/18 28.10.2026): bez wymagań, skrzynia polecana', () => {
    expect(CATALOG[KEY].requires).toEqual([]);
    expect(CATALOG[KEY].recommended).toEqual(['box']);
  });
});

describe('Standing Gastrocnemius Calf Stretch — zdania karty (zestaw ogólny rozciągania, źródła w wewnętrznym rejestrze)', () => {
  const sets = read('lib/figures/v2/cue-sets.json').items[KEY];
  const ogolne = read('data/zrodla/wskazowki-ogolne.json');
  const org = (adres: string) => new URL(adres).hostname.replace(/^(www|us)\./, '').split('.').slice(-3, -1).join('.') || new URL(adres).hostname;
  test('zestaw: rodzina rozciągania, 4 zdania własne ćwiczenia (id gcalf.*), przypisanie z opisem sprawdzenia', () => {
    expect(sets).toEqual({ b: 'general', f: 'stretch', ok: IDS, err: [] });
    expect(ogolne.przypisania[KEY].rodzina).toBe('stretch');
    expect(ogolne.przypisania[KEY].sprawdzenie).toMatch(/28\.10\.2026/);
  });
  test('każde zdanie ma ≥ 2 źródła z adresem https i miejscem, z ≥ 2 różnych organizacji (szczebel 4)', () => {
    for (const id of IDS) {
      const z: { adres: string; miejsce: string }[] = ogolne.wskazowki[id].zrodla;
      expect(z.length).toBeGreaterThanOrEqual(2);
      for (const x of z) { expect(x.adres).toMatch(/^https:\/\//); expect(x.miejsce.length).toBeGreaterThan(10); }
      expect([id, new Set(z.map(x => org(x.adres))).size >= 2]).toEqual([id, true]);
    }
  });
  test('całość: ≥ 4 organizacje szczebla 4 (Physitrack, ACE, NHS, producent sprzętu), zdanie o ugiętym kolanie ma 3', () => {
    const all: { adres: string }[] = IDS.flatMap(id => ogolne.wskazowki[id].zrodla);
    expect(new Set(all.map(x => org(x.adres))).size).toBeGreaterThanOrEqual(4);
    expect(new Set(ogolne.wskazowki['gcalf.knee'].zrodla.map((x: { adres: string }) => org(x.adres))).size).toBe(3);
  });
  test('bez liczby czasu przytrzymania w tekście (źródła się różnią: 10–15 / 15–30 / 30 s — otwarte)', () => {
    for (const id of IDS) expect(cueDict('pl')[id]).not.toMatch(/\d/);
  });
  test('4 zdania w każdym języku wskazówek, niepuste i różne między sobą', () => {
    expect(LANGS.length).toBeGreaterThanOrEqual(34);
    for (const l of LANGS) {
      const d = cueDict(l);
      const texts = IDS.map(id => d[id]);
      for (const x of texts) expect([l, typeof x === 'string' && x.length > 8]).toEqual([l, true]);
      expect(new Set(texts).size).toBe(4);
    }
  });
  test('en: brzmienie zgodne z propozycją badacza; bez nazw źródeł w tekstach aplikacji', () => {
    const en = cueDict('en');
    expect(en['gcalf.set']).toMatch(/ball of your foot on the edge of a step/);
    expect(en['gcalf.move']).toMatch(/knee straight/);
    for (const id of IDS) expect(en[id]).not.toMatch(/Physitrack|ACE|NHS|Powerline/);
  });
  test('zestaw nie jest pokazywany bez recenzji niezależnej (bramka 4): brak wpisu „zestawy” ⇒ ćwiczenie poza listą general w runtime', () => {
    expect(read('docs/research/figury-recenzja.json').zestawy[KEY]).toBeUndefined();
    expect(read('lib/cues/data.json').general).not.toContain(KEY);
  });
});

describe('calf.step — przypis (ACE #73 opisuje wspięcie z podłogi, nie stopień)', () => {
  test('zdanie ustawienia w „Łydki na stopniu” nie opiera się na ACE #73; ma ≥ 2 organizacje z opisem stopnia/krawędzi', () => {
    const r = FULL.exercises['Łydki na stopniu'].setup.find(x => x.c === 'calf.step')!;
    expect(r.s.map(x => x[0])).not.toContain('ace-73');
    expect(new Set(r.s.map(([sid]) => FULL.sources[sid].org)).size).toBeGreaterThanOrEqual(2);
  });
});
