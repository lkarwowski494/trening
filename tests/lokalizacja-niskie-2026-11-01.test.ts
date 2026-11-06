/*
 * Średnie (wskazówki techniki) i niskie uwagi przeglądu API 31.10.2026 spoza ACG-003: decyzje tłumacza z 01.11.2026
 * (docs/lokalizacja/niskie-2026-11-01/decyzje.json). Rodzaje (docs/20): dane (każda naniesiona decyzja jest w słowniku UI albo we wskazówkach),
 * regresja (odrzucone i odłożone nie wróciły: stare brzmienie zostaje; skull.depth we wszystkich językach zachowuje „albo wcześniej”),
 * nakładki (pt-BR i es-419 tylko z tekstami różnymi od bazowych).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import type { Lang } from '@/lib/i18n';

type Poz = { grupa: string; jezyk: string; klucz: string; decyzja: string; nowe: string | null; powod: string };
const root = path.join(__dirname, '..');
const poz: Poz[] = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/niskie-2026-11-01/decyzje.json'), 'utf8')).pozycje;
const cueFile = (l: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text', `${l}.json`), 'utf8'));
const BAZA: Record<string, string> = { 'es-419': 'es', 'pt-BR': 'pt' };
const ui = (l: string, k: string): string | undefined => {
  const own = (LOCALES[l as Lang] as Record<string, string>)[k];
  if (own !== undefined) return own;
  if (BAZA[l]) return (LOCALES[BAZA[l] as Lang] as Record<string, string>)[k];
  return l === 'en' ? (EN as Record<string, string>)[k] : undefined;
};
const cue = (l: string, id: string): string | undefined => cueFile(l)[id] ?? (BAZA[l] ? cueFile(BAZA[l])[id] : undefined);
const jestUI = (p: Poz) => p.grupa.startsWith('UI');
/** Klucze UI usunięte decyzją właściciela 05.11.2026 (docs/18, ekran nowej osoby 1.1: karta „Pierwsze kroki” zastąpiona tablicą i kafelkami) — naniesione 01.11.2026 tłumaczenie nie ma już czego pokazywać; test niżej pilnuje, że klucza NIE MA w słownikach. */
const USUNIETE_05_11_2026 = new Set(['Pierwszy trening: duży przycisk „Pusty trening” u góry.']);

describe('01.11.2026: średnie (wskazówki) i niskie uwagi API — decyzje', () => {
  test('zestaw: 166 pozycji (17 średnich wskazówek, 140 niskich, 9 dodatkowych skull.depth), każda z powodem', () => {
    expect(poz.length).toBe(166);
    expect(poz.filter(p => p.grupa === 'wskazówka-średnia').length).toBe(17);
    expect(poz.filter(p => p.grupa === 'UI-niska').length + poz.filter(p => p.grupa === 'wskazówka-niska').length).toBe(140);
    expect(poz.filter(p => p.grupa === 'wskazówka-dodatkowa').length).toBe(9);
    for (const p of poz) expect([p.jezyk, p.klucz, p.powod.length > 3]).toEqual([p.jezyk, p.klucz, true]);
    for (const p of poz) expect(['naniesione', 'odrzucone', 'odłożone', 'do decyzji (EN)']).toContain(p.decyzja);
  });
  test('każda naniesiona decyzja jest w tekstach (UI: słownik języka lub nakładki; wskazówki: lib/cues/text)', () => {
    const bad = poz.filter(p => p.decyzja === 'naniesione' && !USUNIETE_05_11_2026.has(p.klucz))
      .filter(p => (jestUI(p) ? ui(p.jezyk, p.klucz) : cue(p.jezyk, p.klucz)) !== p.nowe).map(p => `${p.jezyk}: ${p.klucz.slice(0, 40)}`);
    expect(bad).toEqual([]);
  });
  test('klucze usunięte 05.11.2026 (ekran nowej osoby 1.1) nie wróciły do żadnego słownika UI', () => {
    for (const k of USUNIETE_05_11_2026) for (const l of Object.keys(LOCALES)) expect([l, k, (LOCALES[l as Lang] as Record<string, string>)[k]]).toEqual([l, k, undefined]);
    for (const k of USUNIETE_05_11_2026) expect((EN as Record<string, string>)[k]).toBeUndefined();
  });
  test('skull.depth: we wszystkich językach zdanie ma polecenie „zatrzymaj się wcześniej”, nie dwa równorzędne cele ruchu', () => {
    const langs = Object.keys(LOCALES).filter(l => l !== 'es-419');
    const bez = langs.filter(l => !cueFile(l)['skull.depth'] || !/—|。|；|\. /.test(cueFile(l)['skull.depth']));
    expect(bez).toEqual([]);
    expect(cue('es-419', 'skull.depth')).toBe(cueFile('es')['skull.depth']);
  });
  test('odrzucone i odłożone: stare brzmienie nie zostało zmienione na propozycję API (słownik terminów, kontekst klucza)', () => {
    expect(ui('bg', '{n} mi')).toBe('{n} мили');
    expect(ui('sr', '{n} mi')).toBe('{n} миља');
    expect(ui('vi', '{n} mi')).toBe('{n} dặm');
    expect(ui('ko', 'Pauza')).toBe('일시정지');
    expect(ui('hr', 'Wypychanie')).toBe('Potisak');
    expect(ui('sr', 'Wypychanie')).toBe('Потисак');
    expect(ui('sl', 'jarda')).toBe('jarda');
    expect(ui('fr', '+ {n} {w}')).toBe('+ {n} {w} de plus');
    expect(ui('pt', '+ {n} {w}')).toBe('+ mais {n} {w}');
    expect(ui('ru', 'Menu ⋯ w nagłówku: „Pauza treningu” zatrzymuje zegar treningu; czas pauzy nie liczy się do czasu trwania.')).toMatch(/часы тренировки/);
    expect(cue('ko', 'pendlay.setup')).toContain('바벨');
    expect(ui('hu', 'Asekuracja')).toBe('Biztosítás');
    for (const p of poz.filter(p => p.decyzja !== 'naniesione')) expect(p.nowe).toBeNull();
  });
  test('nakładki: pt-BR bez wpisów równych pt, es-419 bez wpisów równych es; pt-BR bez «» w tekstach nakładki', () => {
    for (const [wariant, baza] of Object.entries(BAZA)) {
      const plik = (l: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(root, 'lib/locales', `${l}.json`), 'utf8'));
      const w = plik(wariant); const b = plik(baza);
      expect(Object.keys(w).filter(k => w[k] === b[k])).toEqual([]);
    }
    for (const p of poz.filter(p => p.jezyk === 'pt-BR' && p.decyzja === 'naniesione' && jestUI(p))) expect(p.nowe).not.toMatch(/[«»]/);
  });
  test('wybrane poprawki: pt-BR kettlebell rodzaju męskiego we wskazówkach kb.*, nl „maatstelsel”, zh-Hant etykiety w trybie rozkazującym', () => {
    for (const id of ['kb.hips', 'kb.move', 'kb.setup']) expect(cue('pt-BR', id)).not.toMatch(/\b(a|da|à|na) kettlebell/);
    expect(ui('nl', 'System miar')).toBe('Maatstelsel');
    expect(ui('zh-Hant', 'Zmniejsz ciężar o {n}')).toBe('減少重量 {n}');
    expect(ui('zh-Hant', 'Zwiększ powtórzenia o 1')).toBe('增加 1 次');
    expect(ui('es', 'Zmniejsz powtórzenia o 1')).toBe('Reducir las repeticiones en 1');
  });
  test('recenzja 01.11.2026: pt-BR jedna konwencja cudzysłowów, tgu.eyes w rodzaju męskim, bez wpisu „Empurrada”', () => {
    const pt = JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/pt-BR.json'), 'utf8')) as Record<string, string>;
    // „»” w kluczu „Skala do dwukrotności celu, »” to symbol z polskiego źródła, nie cudzysłów
    expect(Object.entries(pt).filter(([k, v]) => !k.includes('celu, »') && /[«»]/.test(v))).toEqual([]);
    expect(pt['Wypychanie']).toBeUndefined();
    expect(ui('pt-BR', 'Wypychanie')).toBe('Empurrão');
    expect(cueFile('pt-BR')['tgu.eyes']).toBe('Os olhos no kettlebell durante todo o movimento.');
    expect(cueFile('pt')['tgu.eyes']).toMatch(/na kettlebell/);
    expect(ui('ru', 'Płacisz raz i masz na zawsze.')).toBe('Один платёж — и приложение ваше навсегда.');
  });
  test('recenzja 01.11.2026: skull.depth spójne z skull.depthFree (ten sam czasownik i forma)', () => {
    expect(cueFile('tr')['skull.depth']).toContain('üst kollarınız geriye kaymaya başlarsa daha erken durun');
    expect(cueFile('ja')['skull.depth']).toContain('上腕が後ろに流れ始めたら、そこで止めます。');
    expect(cueFile('ja')['skull.depthFree']).toContain('上腕が後ろに流れ始めたら、そこで止めます。');
    expect(cueFile('ko')['skull.depth']).toBe('바가 이마 바로 위에 올 때까지 내리세요 — 위팔이 뒤로 밀리기 시작하면 그 전에 멈추세요.');
    expect(cueFile('zh-Hant')['skull.depth']).toContain('往後跑');
    expect(cueFile('sk')['skull.depth']).toContain('nadlaktie začne utekať dozadu');
    expect(cueFile('bg')['skull.depth']).toContain('мишниците започнат да бягат назад');
  });
  test('recenzja 01.11.2026: słownik terminów ma rodzaj kettlebell (pt-BR męski, pt żeński) i fazę „Wypychanie” (hr, sr, pt)', () => {
    const sl = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/slownik-terminow.json'), 'utf8')).pojecia as { id: string; jezyki: Record<string, { uwaga?: string }> }[];
    const kb = sl.find(x => x.id === 'kettlebell')!.jezyki;
    expect(kb['pt-BR'].uwaga).toMatch(/męski/);
    expect(kb['pt'].uwaga).toMatch(/żeński/);
    const faza = sl.find(x => x.id === 'faza_ruchu')!.jezyki;
    expect(faza['hr'].uwaga).toContain('Potisak');
    expect(faza['sr'].uwaga).toContain('Потисак');
    expect(faza['pt'].uwaga).toContain('Empurrão');
  });
});
