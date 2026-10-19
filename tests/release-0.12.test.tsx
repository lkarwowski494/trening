/**
 * Wydanie 0.12.0 (decyzja właściciela 10.10.2026, wariant A, docs/18): języki fal 1–4 (pt-BR, es-419, id, ms, vi, ru, ja, ko, zh-Hant).
 * Wersja projektu i wpis „Co nowego” 0.12: jeden punkt z listą nowych języków (nazwy z LANG_NAME — każdy we własnym brzmieniu) i punkt
 * o liczbie języków. Wpis jest historyczny: liczby 9 i 35 to stan tego wydania.
 */
import * as store from '@/lib/store';
import { WHATS_NEW, LANGS_012 } from '@/lib/whatsnew';
import { LANGS, LANG_NAME, applyLang, tIn } from '@/lib/i18n';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const NOW = new Date(2026, 9, 10, 18, 0);
afterEach(() => { applyLang('pl'); });

describe('wydanie 0.12.0', () => {
  test('wpis 0.12 jest historyczny: build 1008 z 12.10.2026 (1006 i 1007 nie powstały), pod nim 0.11 z buildem 1005; dwa punkty po polsku (wersja bieżąca: release-0.13.test.tsx)', () => {
    const e12 = WHATS_NEW.find(e => e.id === '2026-10-10')!; const i12 = WHATS_NEW.indexOf(e12); /* od 11.10.2026 nad nim wpis o nowym układzie (tests/tabs-four.test.tsx) */
    expect([e12.id, e12.build, e12.date, WHATS_NEW[i12 + 1].build]).toEqual(['2026-10-10', 1008, '2026-10-12', 1005]);
    expect(e12.items()).toEqual([
      '9 nowych języków: Português (Brasil), Español (Latinoamérica), Bahasa Indonesia, Bahasa Melayu, Tiếng Việt, Русский, 日本語, 한국어, 繁體中文.',
      '35 języków; język zmienisz w Ustawieniach.',
    ]);
  });
  test('liczby we wpisie zgodne z kodem przy wydaniu: 9 nowych (LANGS_012, bez powtórzeń, wszystkie w LANGS), razem 35', () => {
    expect(new Set(LANGS_012).size).toBe(9); expect(LANGS_012.every(l => (LANGS as readonly string[]).includes(l))).toBe(true);
    expect(LANGS.length).toBe(35); /* przy kolejnych językach (kk, uz, az, arabski) wpis 0.12 zostaje bez zmian — popraw tylko ten warunek */
  });
  test('wszystkie języki: oba punkty przetłumaczone, bez „{”, zakończone kropką („。” w ja/zh-Hant), lista z nazwami z LANG_NAME', () => {
    const E = () => WHATS_NEW.find(e => e.id === '2026-10-10')!; const pl = E().items(); const names = LANGS_012.map(l => LANG_NAME[l]);
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l); const it = E().items();
      expect([l, it.filter((x, i) => x === pl[i] || /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      expect([l, names.filter(n => !it[0].includes(n))]).toEqual([l, []]);
      expect([l, /35/.test(it[1]), /9/.test(it[0])]).toEqual([l, true, true]); }
  });
  test('nakładki wariantów: pt-BR „Ajustes”, es-419 „Configuración” (nazwa Ustawień iOS w regionie)', () => {
    const k = '35 języków; język zmienisz w Ustawieniach.';
    expect(tIn('pt-BR', k)).toContain(tIn('pt-BR', 'Ustawienia')); expect(tIn('es-419', k)).toContain(tIn('es-419', 'Ustawienia'));
  });
});

describe('ekran Trening: wpis 0.12 po otwarciu „i”', () => {
  beforeEach(async () => { jest.useFakeTimers({ now: NOW }); });
  const boot = async (locale: 'pl' | 'en') => {
    await fresh(undefined, locale); addWorkout(new Date(2026, 9, 9, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' });
    jest.setSystemTime(NOW.getTime()); await flushAll(10);
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
  };
  test('po polsku: wpis 0.12 (build 1008, zwinięty pod bieżącym wpisem) po rozwinięciu — oba punkty; 0.11 zwinięte pod „Wersja testowa 1005”', async () => {
    await boot('pl');
    expect(screen.getByText(/^Wersja testowa 1018 · 19 paź 2026$/)).toBeTruthy(); /* bieżący wpis 0.20 — build 1018 */ await tap(screen.getByText(/^▸ Wersja testowa 1008 · 12 paź 2026$/)); await flushAll(5);
    for (const x of WHATS_NEW.find(e => e.id === '2026-10-10')!.items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    expect(screen.getByText(/^▸ Wersja testowa 1005 · 10 paź 2026$/)).toBeTruthy();
  });
  test('English: “In this version” and both points', async () => {
    await boot('en');
    expect(screen.getByText(/^Test build 1018 · 19 Oct 2026$/)).toBeTruthy(); await tap(screen.getByText(/^▸ Test build 1008 · 12 Oct 2026$/)); await flushAll(5);
    expect(screen.getByText(/^• 9 new languages: Português \(Brasil\), .*, 繁體中文\.$/)).toBeTruthy();
    expect(screen.getByText('• 35 languages; change the language in Settings.')).toBeTruthy();
  });
});
