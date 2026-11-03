/*
 * Partia P2 integracji badań (G3 moc: olympic, kb_ballistic, plyo, sled_throw, thruster; linia 1.1, 03.11.2026): karty własne 36 ćwiczeń z fali W1 G3
 * (41 z przeliczenia szczebli 02.11.2026 minus 3 ze zrecenzowanym zestawem ogólnym i 2 do decyzji koordynatora).
 * Źródło danych: docs/research/wskazowki-fala-w1 (gałąź badania/g3-moc, commit e40da114 — przeliczenie szczebli ma pierwszeństwo); lista ćwiczeń i zdań — tests/fixtures/cues-p2-moc.json.
 * Zakres strażnika źródeł (L-089): scripts/cues/gen.mjs `validate` (check:cues) — ten plik sprawdza, że dane P2 spełniają reguły i że pominięte ćwiczenia/zdania nie weszły.
 * Rodzaje (docs/20): dane (karty, źródła), logika (≥ 2 niezależne organizacje szczebla ≤ 4), niezmienniki (szczebel 5 poza danymi, brak kolizji id między rwaniem a podrzutem),
 * języki (PL i EN w słownikach, reszta czeka na przekład — zestaw-przekladu-2026-11-03-p2-wskazowki.json), regresja (cue-sets: własne karty, pominięte zostają ogólne).
 * Ocena realności: błąd „karta techniki podnoszenia/skoków z jednego źródła, ze źródła marketingowego albo z zestawu ogólnego niepasującego do ruchu” — realny (treść w aplikacji i na stronie z ćwiczeniami);
 * karty po recenzji niezależnej (bramka 4, L-047; wpisy 03.11.2026): 35 wyświetlanych, Hang Clean „do poprawy” i ukryta do ponownej recenzji po poprawce (tests/karty-recenzja.test.tsx).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA, CUE_SECTIONS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';
import P2 from './fixtures/cues-p2-moc.json';

const root = path.join(__dirname, '..');
const json = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const pl: Record<string, string> = json('lib/cues/text/pl.json'), en: Record<string, string> = json('lib/cues/text/en.json');
const sets = json('lib/figures/v2/cue-sets.json').items as Record<string, { b: string }>;
const REC = json('docs/research/figury-recenzja.json') as { zestawy: Record<string, unknown>; karty: Record<string, { werdykt: string; autor: string; recenzent: string }> };

describe('P2 moc: karty własne', () => {
  test('36 ćwiczeń ma komplet ustawienie + ruch w pełnych danych i w runtime (widoczne albo ukryte do recenzji); nie są w otwartych; 23 niepełne są na liście partial', () => {
    expect(P2.cwiczenia.length).toBe(36);
    for (const k of P2.cwiczenia) {
      const x = CUE_FULL.exercises[k];
      expect([k, x.setup.length >= 1, x.move.length >= 1, k in CUE_FULL.open]).toEqual([k, true, true, false]);
      expect(CUE_DATA.exercises[k] ?? CUE_DATA.hidden.includes(k)).toBeTruthy();
      expect([k, (CUE_FULL.partial ?? []).includes(k)]).toEqual([k, x.tips.length < 2]);
      for (const s of CUE_SECTIONS) expect([k, s, CUE_FULL.exercises[k][s].length <= 4]).toEqual([k, s, true]);
    }
    expect(P2.partial.length).toBe(23);
    expect([...P2.partial].sort()).toEqual(P2.cwiczenia.filter(k => CUE_FULL.exercises[k].tips.length < 2).sort());
  });

  test('cue-sets: 36 ćwiczeń ma własne karty (b = own); 3 ze zrecenzowanym zestawem ogólnym i 2 do decyzji zostają przy zestawie ogólnym, bez karty własnej', () => {
    for (const k of P2.cwiczenia) expect([k, sets[k].b]).toEqual([k, 'own']);
    expect(Object.keys(P2.wylaczone_zestaw_ogolny).sort()).toEqual(['Block Power Snatch', 'One-Arm Kettlebell Jerk', 'Split Jump']);
    for (const k of Object.keys(P2.wylaczone_zestaw_ogolny)) expect([k, sets[k].b, k in CUE_FULL.exercises, k in REC.zestawy]).toEqual([k, 'general', false, true]);
    expect(Object.keys(P2.pominiete_do_decyzji).sort()).toEqual(['Depth Jump', 'Turkish Get Up']);
    for (const k of Object.keys(P2.pominiete_do_decyzji)) expect([k, sets[k].b, k in CUE_FULL.exercises]).toEqual([k, 'general', false]);
    expect(Object.keys(P2.wylaczone_zestaw_ogolny).concat(Object.keys(P2.pominiete_do_decyzji)).some(k => P2.cwiczenia.includes(k))).toBe(false);
  });

  test('klucz „Snatch (hantel)” (katalog) ma kartę, a nazwa „Snatch” bez dopisku nie trafiła do danych', () => {
    expect(P2.cwiczenia).toContain('Snatch (hantel)');
    expect('Snatch' in CUE_FULL.exercises).toBe(false);
  });
});

describe('P2 moc: źródła i reguły szczebli', () => {
  test('każda wskazówka ma ≥ 2 organizacje szczebla ≤ 4; szczebel 5 nie wszedł do danych tych kart', () => {
    for (const k of P2.cwiczenia) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) {
      const orgs = new Set(r.s.map(([sid]) => CUE_FULL.sources[sid]).filter(x => x.level <= 4).map(x => x.org));
      expect([k, r.c, orgs.size >= 2]).toEqual([k, r.c, true]);
      for (const [sid] of r.s) expect([k, r.c, sid, CUE_FULL.sources[sid].level <= 4]).toEqual([k, r.c, sid, true]);
    }
  });

  test('źródła szczebla 5 i książka bez identyfikatora (decyzje 02.11.2026) nie weszły: Eleiko inspire360, Onnit, Physitrack, Breaking Muscle, Dangerously Fit, blog wydawcy książki', () => {
    for (const bad of ['eleiko-659c5689', 'eleiko-659c5377', 'hk-blob-throw']) expect([bad, bad in CUE_FULL.sources]).toEqual([bad, false]);
    for (const k of P2.cwiczenia) for (const s of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][s]) for (const [sid] of r.s)
      expect([k, sid, /^(onnit|physitrack|breakingmuscle|df-|dangerously|eleiko)/.test(sid)]).toEqual([k, sid, false]);
    for (const o of Object.keys(CUE_FULL.orgs)) expect(o).not.toMatch(/Onnit|Dangerously/);
  });

  test('jedna organizacja = jeden klucz: Rogue Fitness, REP Fitness i Experience Life (Life Time) nie są rozbite na warianty nazw', () => {
    const orgs = Object.keys(CUE_FULL.orgs);
    expect(orgs.filter(o => /^Rogue/.test(o))).toEqual(['Rogue Fitness']);
    expect(orgs.filter(o => /^rep fitness$/i.test(o))).toEqual(['REP Fitness']);
    expect(orgs.filter(o => /^(Life Time|Experience Life)$/.test(o))).toEqual(['Experience Life']);
    expect(Object.values(CUE_FULL.sources).filter(s => /^(Rogue|Rep Fitness|Life Time)$/.test(s.org))).toEqual([]);
  });
});

describe('P2 moc: bramka 4 i poprawki po recenzjach (03.11.2026)', () => {
  test('35 kart ma recenzję niezależną (wyświetlane), Hang Clean „do poprawy” zostaje ukryta do ponownej recenzji po poprawce (decyzja koordynatora 03.11.2026)', () => {
    const DO_POPRAWY = 'Hang Clean';
    for (const k of P2.cwiczenia) {
      const rec = REC.karty[k];
      expect([k, rec.werdykt, rec.autor !== rec.recenzent]).toEqual([k, k === DO_POPRAWY ? 'do poprawy' : 'wyswietlana', true]);
      expect([k, CUE_DATA.hidden.includes(k), k in CUE_DATA.exercises]).toEqual(k === DO_POPRAWY ? [k, true, false] : [k, false, true]);
    }
  });

  test('Hang Clean: zwis nad kolanami bez zdania „gdy sztanga minie kolana” — olympic.hangExtend zamiast olympic.extend (źródła zostają na karcie)', () => {
    const move = CUE_FULL.exercises['Hang Clean'].move;
    expect(move.map(r => r.c)).toEqual(['olympic.legsFirst', 'olympic.hangExtend', 'olympic.under', 'olympic.catchLow']);
    expect(pl['olympic.hangExtend']).toBe('Ze zwisu mocno wyprostuj biodra i nogi.'); expect(en['olympic.hangExtend']).toBe('From the hang, drive your hips and legs to full extension.');
    expect(pl['olympic.hangExtend']).not.toMatch(/kolan/);
    const src = move.find(r => r.c === 'olympic.hangExtend')!.s.map(([sid]) => sid);
    expect(src).toEqual(expect.arrayContaining(['catalyst-68', 'rogue-hang-squat-clean']));
    expect(pl['olympic.extend']).toMatch(/minie kolana/); // zdanie ogólne zostaje przy zarzucie z ziemi
    expect(CUE_FULL.exercises['Clean'].move.map(r => r.c)).toContain('olympic.extend');
  });

  test('jedno brzmienie błędu ramion w zarzucie i rwaniu: olympic.mis.arms (olympic.mis.armsEarly usunięte ze słowników i kart)', () => {
    expect(pl['olympic.mis.arms']).toBe('Ciągnięcie rękami, zanim nogi i biodra skończą wyprost.');
    expect(en['olympic.mis.arms']).toBe('Pulling with your arms before your legs and hips finish the extension.');
    expect(['olympic.mis.armsEarly' in pl, 'olympic.mis.armsEarly' in en]).toEqual([false, false]);
    for (const k of ['Barbell Snatch', 'Power Snatch', 'Hang Snatch', 'Snatch Pull', 'Block Snatch', 'Split Snatch']) expect([k, CUE_FULL.exercises[k].mistakes.map(r => r.c)]).toEqual([k, expect.arrayContaining(['olympic.mis.arms'])]);
    expect(JSON.stringify(CUE_FULL.exercises)).not.toContain('armsEarly');
  });

  test('zdania ruchu: najdłuższe skrócone, treść merytoryczna bez zmian ("nie niżej niż do równoległego ud", "biodra nad kolanami"), "po kontakcie z biodrami", ugięte łokcie', () => {
    expect(pl['olympic.powerMove'].length).toBeLessThanOrEqual(170); expect(pl['olympic.powerMove']).toMatch(/nie niżej niż do równoległego ud/);
    expect(en['olympic.powerMove']).toMatch(/no lower than thighs parallel/); expect(en['olympic.powerMove'].length).toBeLessThanOrEqual(170);
    expect(pl['olympic.snatchPowerMove'].length).toBeLessThanOrEqual(170); expect(pl['olympic.snatchPowerMove']).toMatch(/wyżej niż w przysiadzie równoległym, biodra nad kolanami/);
    expect(pl['olympic.mis.away']).toMatch(/po kontakcie z biodrami/); expect(pl['olympic.mis.softLockout']).toMatch(/^Ugięte łokcie/);
    expect(pl['olympic.under']).toMatch(/przerzuć łokcie do przodu pod sztangą/);
    for (const c of ['olympic.snatchMove', 'olympic.pullMove']) expect(pl[c]).toMatch(/gdy sztanga dojdzie do bioder/);
    for (const c of ['olympic.snatchMove', 'olympic.pullMove', 'olympic.snatchPowerMove', 'olympic.splitMove', 'olympic.powerMove', 'olympic.squatMove']) expect([c, /i wypychając|przy biodrach wyprostuj/.test(pl[c])]).toEqual([c, false]);
  });
});

describe('P2 moc: zdania', () => {
  test('79 nowych zdań ma tekst PL i EN; pominięte nie istnieją w słownikach', () => {
    expect(idyP2Nowe().size).toBe(79);
    for (const c of P2.zdania) expect([c, typeof pl[c], typeof en[c], pl[c].trim().length > 0, en[c].trim().length > 0]).toEqual([c, 'string', 'string', true, true]);
    for (const c of ['olympic.recover']) expect([c, c in pl]).toEqual([c, true]); // zostaje w Squat Jerk
    for (const c of ['bmbt.armsStraight', 'tgu.setup', 'tgu.move', 'tgu.eyesLow', 'tgu.mis.bentArm']) expect([c, c in pl, c in en]).toEqual([c, false, false]);
    expect(Object.keys(P2.pominiete_zdania).length).toBe(2);
  });

  test('rwanie i podrzut mają osobne id tam, gdzie brzmienie się różni (STAN-g3-moc, rozstrzygnięcie 5): olympic.splitMove/powerMove = podrzut, olympic.snatch* = rwanie', () => {
    expect(pl['olympic.splitMove']).toMatch(/wskocz pod nią w nożyce/);
    expect(pl['olympic.snatchSplitMove']).toMatch(/Ciągnij jak w rwaniu/);
    expect(pl['olympic.powerMove']).toMatch(/nad głowę/);
    expect(pl['olympic.snatchPowerMove']).toMatch(/wyżej niż w przysiadzie równoległym/);
    expect(CUE_FULL.exercises['Split Snatch'].move.map(r => r.c)).toContain('olympic.snatchSplitMove');
    expect(CUE_FULL.exercises['Split Jerk'].move.map(r => r.c)).toContain('olympic.splitMove');
    expect(CUE_FULL.exercises['Power Snatch'].move.map(r => r.c)).toContain('olympic.snatchPowerMove');
    expect(CUE_FULL.exercises['Power Jerk'].move.map(r => r.c)).toContain('olympic.powerMove');
  });

  test('zdania nowe czekają na przekład w zestawie zestaw-przekladu-2026-11-03-p2-wskazowki.json (rodzaj „nowy”) i nie mają tekstu w innych językach', () => {
    const z = json('docs/lokalizacja/zestaw-przekladu-2026-11-03-p2-wskazowki.json').klucze as { rodzaj: string; id: string; pl: string; en: string }[];
    expect(z.map(k => k.id).sort()).toEqual([...idyP2Nowe()].sort());
    for (const k of z) expect([k.id, k.rodzaj, k.pl, k.en]).toEqual([k.id, 'nowy', pl[k.id], en[k.id]]);
    for (const l of ['de', 'fr', 'ja']) { const d = json(`lib/cues/text/${l}.json`); for (const k of z) expect([l, k.id, d[k.id]]).toEqual([l, k.id, undefined]); }
  });

  test('teksty nowych zdań: bez cyfr (liczby wymagają osobnych źródeł), bez twierdzeń o bólu i zdrowiu, bez nazw źródeł i marek', () => {
    for (const c of idyP2Nowe()) for (const t of [pl[c], en[c]]) {
      expect([c, /\d/.test(t)]).toEqual([c, false]);
      expect([c, /\b(boli|ból|bólu|kontuzj|pain|injur)/i.test(t)]).toEqual([c, false]);
      expect([c, /NASM|\bACE\b|CrossFit|Catalyst|BarBend|Rogue|IronMind|Torokhtiy|StrongFirst|Onnit|NSCA/i.test(t)]).toEqual([c, false]);
    }
  });
});

/** Zdania dodane w P2: id z fixture, których nie było przed partią (zdania ogólne `oly.*`, `pp.*`, `sq.*`, `ohp.*`, `jump.*`, `mis.*` istnieją w 35 słownikach). */
function idyP2Nowe(): Set<string> {
  const de = json('lib/cues/text/de.json') as Record<string, string>;
  return new Set(P2.zdania.filter(c => !(c in de)));
}
