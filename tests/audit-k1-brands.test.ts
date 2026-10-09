/*
 * Audyt kontrolny 1 (przed 0.10.0), SEC2-01 (część na wydanie 1): nazwy producentów sprzętu w tekstach aplikacji (presety stacji i hantli, opis stacji
 * elektrycznej) — decyzja właściciela 09.10.2026 (3) A: marki innych firm → nazwa ogólna (CLAUDE.md „Treści cudze i nazwy innych firm”; wytyczne
 * Apple 2.3.7, 5.2.1). id presetów (gymtek24, hopsport2x10, vishape_pro, voltra1, vishape_lite) zostają — są w danych użytkownika.
 * Poza zakresem (backlog przed App Store — zmienia nazwy ćwiczeń katalogu): TRX, BOSU, Assault Bike, SkiErg.
 * Rodzaje (docs/20): niezmiennik (słowniki 26 języków, źródło tłumaczeń, etykiety presetów i sprzętu), języki, regresja (id presetów bez zmian).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOAD_PRESETS, EQUIPMENT, equipLabel } from '@/lib/equipment';
import { applyLang, LANGS } from '@/lib/i18n';

/** Marki producentów sprzętu usunięte z tekstów aplikacji (jedno miejsce). */
const BRANDS = ['ViShape', 'SmartGym', 'Speediance', 'Tonal', 'Gymtek', 'Hop-Sport', 'Voltra', 'Beyond Power'] as const;
const RX = new RegExp(`\\b(${BRANDS.map(b => b.replace(/[-]/g, '\\-')).join('|')})\\b`, 'i');
const ROOT = path.join(__dirname, '..');
afterEach(() => applyLang('pl'));

describe('SEC2-01: bez nazw producentów sprzętu w tekstach aplikacji', () => {
  test('słowniki: lib/locales/*.json (klucze i tłumaczenia, także _source.json) i lib/i18n.en.ts', () => {
    const dir = path.join(ROOT, 'lib/locales'); const hits: string[] = [];
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) for (const [i, line] of fs.readFileSync(path.join(dir, f), 'utf8').split('\n').entries()) if (RX.test(line)) hits.push(`${f}:${i + 1}: ${line.trim()}`);
    for (const [i, line] of fs.readFileSync(path.join(ROOT, 'lib/i18n.en.ts'), 'utf8').split('\n').entries()) if (RX.test(line)) hits.push(`i18n.en.ts:${i + 1}`);
    expect(hits).toEqual([]);
  });
  test('etykiety presetów ciężarów i sprzętu w każdym języku — bez marek; id presetów bez zmian', () => {
    expect(LOAD_PRESETS.map(p => p.id)).toEqual(['gymtek24', 'hopsport2x10', 'vishape_pro', 'voltra1', 'vishape_lite']);
    const hits: string[] = [];
    for (const lng of LANGS) { applyLang(lng);
      for (const p of LOAD_PRESETS) { const s = equipLabel(p.label); if (RX.test(s)) hits.push(`${lng} ${p.id}: ${s}`); }
      for (const e of EQUIPMENT) { const s = equipLabel(e); if (RX.test(s)) hits.push(`${lng} ${e.id}: ${s}`); } }
    expect(hits).toEqual([]);
  });
  test('nazwy ogólne, opisowe (PL i EN)', () => {
    const by = (id: string) => LOAD_PRESETS.find(p => p.id === id)!.label;
    expect(by('vishape_pro')).toEqual({ pl: 'Inteligentna stacja kablowa — pełna (1,5–65 kg/str.)', en: 'Smart cable machine — full (1.5–65 kg/side)' });
    expect(by('vishape_lite')).toEqual({ pl: 'Inteligentna stacja kablowa — kompaktowa (1,5–35 kg/str.)', en: 'Smart cable machine — compact (1.5–35 kg/side)' });
    applyLang('de'); expect(equipLabel(by('vishape_pro'))).not.toBe(by('vishape_pro').pl); expect(equipLabel(by('vishape_pro'))).not.toBe(by('vishape_pro').en);
  });
});
