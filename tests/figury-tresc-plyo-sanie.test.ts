/*
 * Recenzja treści kart rodzin plyo i sled_throw (28.10.2026, sesja tresc-plyo-sanie; raporty recenzja-tresci-p4b i recenzja-tresci-sanie).
 * Z1: Weighted Jump Squat — zestaw ogólny nie może mówić o zamachu rąk (sztanga leży na barkach, dłonie trzymają gryf).
 * Z3: błąd z `kneeLat` (kolana do środka) jest widoczny tylko z przodu — każde ćwiczenie z takim błędem ma widok „front” (Wall Ball nie miał).
 * Z5: sled.lean i sled.legs — podstawy osobno dla pchania (Sled Push) i ciągnięcia w pasie (Sled Drag (Harness)): ≥ 2 przeczytane źródła o TYM ćwiczeniu albo oznaczenie.
 * N1: Yoke Walk — jarzmo leży symetrycznie na barkach, więc „w stronę ciężaru” (carry.noLean) nie ma sensu.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_SETS } from '@/lib/figures/v2/cueSets';
import { viewsOf, type FamilyId } from '@/lib/figures/v2';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
type Item = { b: string; f?: string; ok?: string[]; err?: string[] };
const item = (k: string): Item => (CUE_SETS.items as Record<string, Item>)[k];

describe('Z1: Weighted Jump Squat — zestaw ogólny zgodny z rysunkiem (sztanga na barkach)', () => {
  test('zestaw nie ma jump.drive („z zamachem rąk”), zostaje lądowanie i błąd sztywnych nóg', () => {
    expect(item('Weighted Jump Squat').ok).toEqual(['jump.land']); expect(item('Weighted Jump Squat').err).toEqual(['jump.mis.stiff']);
  });
  test('Dumbbell Seated Box Jump zostaje z jump.drive (rysunek pokazuje zamach rąk z hantlami)', () => {
    expect(item('Dumbbell Seated Box Jump').ok).toContain('jump.drive');
  });
  test('tekst jump.drive w słownikach bez zmian (tylko przypisanie, nie brzmienie)', () => {
    expect(json('lib/cues/text/pl.json')['jump.drive']).toBe('Wybij się, prostując biodra, kolana i kostki, z zamachem rąk.');
  });
  test('niezmiennik: ćwiczenie z pozy, w którym sztanga leży na barkach (sprzet sztanga + slupek) i ręce nie zamachują, nie ma wskazówki o zamachu rąk', () => {
    const d = json('lib/figures/v2/poses/plyo.json').cwiczenia as Record<string, { sprzet: { rodzaj: string }[] }>;
    for (const [k, p] of Object.entries(d)) if (p.sprzet.some(g => g.rodzaj === 'sztanga') && item(k)?.ok) expect([k, item(k).ok!.includes('jump.drive')]).toEqual([k, false]);
  });
});

describe('N1: Yoke Walk — bez wskazówki o przechylaniu „w stronę ciężaru”', () => {
  test('zestaw Yoke Walk ma carry.walk, nie ma carry.noLean; tekst carry.noLean (1.0) bez zmian', () => {
    expect(item('Yoke Walk').ok).toEqual(['carry.walk']);
    expect(json('lib/cues/text/pl.json')['carry.noLean']).toBe('Nie przechylaj się ani w stronę ciężaru, ani od niego — idź wyprostowany.');
  });
});

describe('Z3: błąd kolan do środka (kneeLat) wymaga widoku z przodu', () => {
  const POSES = path.join(root, 'lib/figures/v2/poses');
  const kneeLat: [string, string, string][] = [];
  for (const f of fs.readdirSync(POSES).filter(x => x.endsWith('.json'))) {
    const j = json(`lib/figures/v2/poses/${f}`) as { rodzina: string; cwiczenia: Record<string, { bledy: { cue: string; dotyczy: string[] }[] }> };
    for (const [k, p] of Object.entries(j.cwiczenia)) for (const b of p.bledy) if (b.dotyczy.includes('kneeLat')) kneeLat.push([j.rodzina, k, b.cue]);
  }
  test('są ćwiczenia z takim błędem (w tym Wall Ball)', () => { expect(kneeLat.length).toBeGreaterThan(3); expect(kneeLat.some(([, k]) => k === 'Wall Ball')).toBe(true); });
  test.each(kneeLat)('%s / %s (%s): widoki ćwiczenia zawierają „front”', (f, k) => { expect([k, viewsOf(k, f as FamilyId).includes('front')]).toEqual([k, true]); });
  test('Wall Ball: widok z boku zostaje (ruch przysiadu), z przodu dochodzi', () => { expect(viewsOf('Wall Ball', 'sled_throw')).toEqual(['side', 'front']); });
  test('reszta sled_throw bez zmian: tylko z boku', () => { for (const k of ['Sled Push', 'Medicine Ball Slam', 'Standing Two-Arm Overhead Throw']) expect(viewsOf(k, 'sled_throw')).toEqual(['side']); });
});

describe('Z5: sled.lean i sled.legs — podstawy per ćwiczenie (pchanie i ciągnięcie w pasie)', () => {
  type Per = { claim: string; pewnosc: string; src: [string, string][]; analogia?: [string, string][] };
  const W = json('data/zrodla/cues-zestawy.json').wskazowki as Record<string, { claim: string; src: [string, string][]; cwiczenia?: Record<string, Per> }>;
  const CW = ['Sled Push', 'Sled Drag (Harness)'];
  const sentences = (s: string) => (s.match(/[.!?…](\s|$)/g) ?? []).length;
  test.each(['sled.lean', 'sled.legs'])('%s: osobny wpis dla pchania i ciągnięcia, ≥ 2 źródła o tym ćwiczeniu albo oznaczenie; cytat ≤ 2 zdania z adresem', (id) => {
    expect(Object.keys(W[id].cwiczenia ?? {}).sort()).toEqual([...CW].sort());
    for (const k of CW) {
      const p = W[id].cwiczenia![k]; expect([k, p.claim.length > 20]).toEqual([k, true]);
      expect(['ustalone', 'jedno źródło', 'uproszczenie (analogia)']).toContain(p.pewnosc);
      for (const [url, quote] of [...p.src, ...(p.analogia ?? [])]) { expect(url).toMatch(/^https:\/\//); expect([k, sentences(quote) <= 2]).toEqual([k, true]); }
      if (p.pewnosc === 'ustalone') expect([id, k, new Set(p.src.map(x => x[0])).size >= 2]).toEqual([id, k, true]); /* analogia nie liczy się do minimum 2 */
      if (p.pewnosc === 'jedno źródło') expect(p.src.length).toBe(1);
      if (p.pewnosc === 'uproszczenie (analogia)') expect([p.src.length, (p.analogia ?? []).length > 0]).toEqual([0, true]);
    }
  });
  test('claim wpisu mówi o pchaniu i o ciągnięciu (nie tylko o pchaniu); claimy per ćwiczenie nazywają właściwy ruch', () => {
    for (const id of ['sled.lean', 'sled.legs']) { expect(W[id].claim).toMatch(/pch/i); expect(W[id].claim).toMatch(/ci[aą]gni/i); expect(W[id].cwiczenia!['Sled Push'].claim).toMatch(/pch/i); expect(W[id].cwiczenia!['Sled Drag (Harness)'].claim).toMatch(/ci[aą]gni/i); }
  });
  test('reguła sensu sanki_plecy: Sled Push = jedno źródło (BarBend), Sled Drag (Harness) = uproszczenie (analogia z pchania); nie „ustalone”', () => {
    const r = json('data/zrodla/figury-sens.json').rodziny.sled_throw.reguly.sanki_plecy as { pewnosc: string; zrodlo: string };
    expect(r.pewnosc).not.toMatch(/^ustalone/);
    expect(r.pewnosc).toMatch(/Sled Push: jedno źródło/);
    expect(r.pewnosc).toMatch(/Sled Drag \(Harness\): uproszczenie \(analogia/);
    expect(r.zrodlo).toMatch(/Sled Drag/);
  });
  test('28.10.2026: sled.lean bez „lekko” i bez „tułów sztywny” (sprzeczność źródeł co do stopnia; sztywny tułów bez 2 źródeł szczebla 4) — PL, EN, claim', () => {
    const pl = json('lib/cues/text/pl.json')['sled.lean'] as string, en = json('lib/cues/text/en.json')['sled.lean'] as string;
    expect(pl).not.toMatch(/lekk|sztywn|napi/i); expect(en).not.toMatch(/slight|tight|brace|stiff|rigid/i);
    expect(pl).toMatch(/Pochyl się w przód/); expect(en).toMatch(/Lean forward/);
    const w = W['sled.lean']; for (const t of [w.claim, w.cwiczenia!['Sled Push'].claim, w.cwiczenia!['Sled Drag (Harness)'].claim]) expect(t).not.toMatch(/lekk|sztywn|płask|kręgosłup|rdzeń|brzuch/i);
  });
  test('28.10.2026: szczebel 5 (The Gym Group, Motra, FitMetrics) tylko jako „pomocnicze”, nigdy w src/analogia; ACE „stiff, stable spine” nie opisuje ciągnięcia', () => {
    const slabe = /thegymgroup\.com|motra\.com|fitmetrics\.ch/;
    for (const id of ['sled.lean', 'sled.legs']) {
      const w = W[id] as unknown as { src: [string, string][]; uwaga: string; cwiczenia: Record<string, Per & { pomocnicze?: [string, string][] }> };
      for (const [u] of w.src) expect(u).not.toMatch(slabe);
      for (const k of CW) { const p = w.cwiczenia[k]; for (const [u] of [...p.src, ...(p.analogia ?? [])]) expect([id, k, u.match(slabe)]).toEqual([id, k, null]); for (const [u] of p.pomocnicze ?? []) expect(u).toMatch(slabe); }
      expect(w.uwaga).toMatch(/rozstrzygnięte 28\.10\.2026/); expect(w.uwaga).not.toMatch(/do potwierdzenia przez badacza/);
    }
    const txt = JSON.stringify([W['sled.lean'], json('data/zrodla/figury-sens.json').rodziny.sled_throw.reguly]);
    expect(txt).not.toMatch(/ciągnięcie sanek: „forward-leaning body position”; „stiff, stable spine”/);
    expect(txt).not.toMatch(/ciągnięcie[^"]{0,40}stiff, stable spine/);
  });
});
