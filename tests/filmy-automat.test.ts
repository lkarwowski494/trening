/*
 * Automat krótkich filmów o technice (ZB-047; decyzje właściciela 07.11.2026 ~20:30, ~21:45, ~23:00 w docs/18): test dymny bez przeglądarki i ffmpeg.
 * Sprawdza plan klatek i stronę klatki z prawdziwych danych (scripts/filmy/filmy.json) oraz odmowę dla rodziny bez recenzji (L-047) i wskazówki spoza ćwiczenia.
 * Obraz rysunku z eksportu web aplikacji (właściciel 08.11.2026: grafika jak w aplikacji, scenariusz 1, pełna nazwa ze sklepu na końcu) — render MP4:
 * node scripts/filmy/render.mjs --film <id> --jezyk pl,en (Chromium + ffmpeg + expo export web) — przebieg dowodowy w docs/18 08.11.2026.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts/filmy/render.mjs');
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/filmy/filmy.json'), 'utf8'));
const run = (args: string[]) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
const FILM = CFG.filmy[0];

describe('automat filmów o technice (ZB-047, 07.11.2026)', () => {
  const r = run(['--film', FILM.id, '--jezyk', 'pl,en', '--plan']);
  const plan = r.status === 0 ? JSON.parse(r.stdout) : [];

  test('definicje filmów zgodne z danymi aplikacji (plan bez odmowy)', () => {
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    expect(plan).toHaveLength(2);
  });

  test.each(['pl', 'en'])('[%s] scenariusz 1 (08.11.2026): błąd od 0 s, napis od 0,5 s, poprawnie od 5 s, koniec na ostatnich 1,5 s animacji', jezyk => {
    const p = plan.find((x: { jezyk: string }) => x.jezyk === jezyk);
    const d = CFG.domyslne;
    expect(p.klatek).toBe(Math.round(d.sekundy * d.fps));
    expect(p.fazy).toEqual(['blad', 'poprawnie']);
    expect(p.klatki_bez_napisu).toBe(Math.round(d.napis_od_s * d.fps));
    expect(Math.abs(p.zmianaMs - d.blad_do_s * 1000)).toBeLessThanOrEqual(1000);
    expect(p.waga_bledu_klatka0).toBeGreaterThanOrEqual(0.6);
    expect(p.klatki_koniec).toBe(Math.round(d.koniec_s * d.fps));
    expect(p.zmianaMs).toBeLessThan(p.koniecOdMs);
  });

  test('wszystkie widoki ćwiczenia (profil i przód — właściciel 08.11.2026), bez pola „widoki” w definicji', () => {
    expect(CFG.filmy.every((f: object) => !('widoki' in f))).toBe(true);
    expect(plan[0].widoki).toEqual(['side', 'front']); /* Back Squat: render bierze wszystkie svg karty, tu kontrola, że rysunek ma oba widoki */
  });

  test('teksty z danych: wskazówki z lib/cues/text, nazwa aplikacji ze sklepu, plansza bez „apps4brew” i bez „pobierz”', () => {
    const pl = plan.find((x: { jezyk: string }) => x.jezyk === 'pl').teksty;
    const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/cues/text/pl.json'), 'utf8'));
    expect(pl.blad).toBe(cues[FILM.wskazowka_bledu]);
    expect(pl.poprawnie).toBe(cues[FILM.wskazowka_poprawna]);
    expect(pl.podpis).toBe('Animacja: aplikacja Trening');
    /* koniec filmu: pełna nazwa ze sklepu, żeby widz znalazł aplikację (właściciel 08.11.2026) */
    const nazwy = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/app-store-names.json'), 'utf8')).names;
    expect(pl.nazwaSklepu).toBe(nazwy.pl);
    expect(plan.find((x: { jezyk: string }) => x.jezyk === 'en').teksty.nazwaSklepu).toBe(nazwy['en-US']);
    const html = run(['--film', FILM.id, '--jezyk', 'pl', '--strona', '0']).stdout;
    expect(html.includes('<div class="en">Back Squat</div>')).toBe(true);
    expect(html.includes('<body class="blad">')).toBe(true);
    expect(/apps4brew|pobierz/i.test(html.replace(/data:[^)"]+/g, ''))).toBe(false);
    const koniec = run(['--film', FILM.id, '--jezyk', 'pl', '--strona', String(plan[0].klatek - 1)]).stdout;
    expect(koniec.includes('<body class="poprawnie napis na-koncu">')).toBe(true);
    expect(koniec.includes(`<div class="sklep-nazwa">${nazwy.pl}</div>`)).toBe(true);
  });

  test('odmowa: rodzina bez recenzji (L-047) i wskazówka spoza ćwiczenia', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'filmy-test-'));
    const zly = { ...CFG, filmy: [
      { ...FILM, id: 'bez-recenzji', cwiczenie: 'Clean Shrug' },
      { ...FILM, id: 'obca-wskazowka', wskazowka_poprawna: 'splank.noSag' },
      { ...FILM, id: 'jeden-widok', widoki: ['front'] },
    ] };
    const f = path.join(tmp, 'filmy.json'); fs.writeFileSync(f, JSON.stringify(zly));
    const out = run(['--wszystkie', '--jezyk', 'pl', '--plan', '--konfig', f]);
    fs.rmSync(tmp, { recursive: true, force: true });
    expect(out.status).toBe(1);
    expect(out.stderr).toMatch(/bez-recenzji \[pl\]: (rodzina .* bez aktualnej recenzji|ćwiczenie „Clean Shrug” nie ma figury v2)/);
    expect(out.stderr).toMatch(/jeden-widok \[pl\]: pole „widoki” niedozwolone/);
    expect(out.stderr).toMatch(/obca-wskazowka \[pl\]: wskazówka „splank.noSag” nie należy do wskazówek „Back Squat”/);
  });
});
