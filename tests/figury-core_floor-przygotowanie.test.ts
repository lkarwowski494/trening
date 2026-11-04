/*
 * Rodzina core_floor przed recenzją niezależną (fala F2, linia 1.1, 04.11.2026): dane póz czytane wprost z pliku (rodzina niepodłączona, status „planned”).
 * K2 pokrycie póz (7 dorobionych), K5 tor (ćwiczenia bez ciężaru: ślad = miednica, K4; kształt z geometrii), K7 styki z podłożem, K8 zakres stawów z tekstów kart.
 * Znaleziska wspólne H-A/H-B/H-C: tu dotyczą tylko Cable Crunch, Cable Reverse Crunch (wyciąg → `nosi`, ślad w miednicy) i Machine Crunch (dźwignia → `nosi`); reszta bez ciężaru.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { keyframeFrame, jointAngles, type PoseData } from '@/lib/figures/v2';

const P: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/core_floor.json'), 'utf8')).cwiczenia;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/core_floor.mjs'), 'utf8');
const KEYS = Object.keys(P);
const N = 160; const US = Array.from({ length: N + 1 }, (_, i) => i / N);
const frame = (k: string, u: number) => keyframeFrame(P[k], u);
const A = (k: string, u: number) => jointAngles(frame(k, u).sk, 'R');
const DORABIANE = ['Stability Ball Crunch', 'Crunch - Legs On Exercise Ball', 'Cable Reverse Crunch', 'Suspended Reverse Crunch', 'Cable Crunch', 'Machine Crunch'];

/** Zawrócenia pionowego ruchu miednicy poza klatkami kluczowymi (±0,02 u) = wybrzuszenie z interpolacji. */
function zawroceniaPoza(k: string, y: number[]): number {
  const kf = P[k].klatki.map(f => f.u); let sg = 0, n = 0;
  for (let i = 1; i < y.length; i++) { const dy = y[i] - y[i - 1]; if (Math.abs(dy) < 0.02) continue; const s = Math.sign(dy); if (sg && s !== sg && Math.min(...kf.map(x => Math.abs(x - i / N))) > 0.02) n++; sg = s; }
  return n;
}

describe('core_floor: pokrycie póz (K2)', () => {
  test('35 póz (04.11.2026, P5: + Decline Oblique Crunch, Weighted Sit-Ups - With Bands, Seated Flat Bench Leg Pull-In, Standing Rope Crunch; Decline Reverse Crunch i Stability Ball Knee Tuck wyjątki): 31 = 21 z poprzedniej wersji − Oblique Crunches - On The Floor (karta otwarta, rysunek niewyświetlany, 04.11.2026) + 6 dorobionych + 5 z fali R3 (Butt-Ups, Otis-Up, GHD Sit Up, Dragon Flag, Press Sit-Up; Side Jackknife wyjątek); Stability Ball Knee Tuck celowo bez pozy (kandydat K3: piłka toczy się, silnik ma piłkę nieruchomą)', () => {
    expect(KEYS).toHaveLength(35); for (const k of ['Decline Oblique Crunch', 'Weighted Sit-Ups - With Bands', 'Seated Flat Bench Leg Pull-In', 'Standing Rope Crunch']) expect(KEYS).toContain(k); expect(KEYS).not.toContain('Decline Reverse Crunch'); expect(KEYS).not.toContain('Oblique Crunches - On The Floor'); for (const k of DORABIANE) expect(P[k]).toBeDefined(); expect(KEYS).not.toContain('Stability Ball Knee Tuck');
    expect(GEN).toMatch(/Stability Ball Crunch/); expect(GEN).not.toMatch(/'Stability Ball Knee Tuck': \(\)/);
  });
  test('sprzęt: podłoga, piłka, wyciąg, zawieszenie, ławka, dźwignia, talerz (Otis-Up), sztanga (Press Sit-Up), rzymska (GHD Sit Up) — bez hantli', () => {
    for (const k of KEYS) for (const g of P[k].sprzet) expect([k, ['podloga', 'pilka_gimnastyczna', 'wyciag', 'zawieszenie', 'lawka', 'dzwignia', 'talerz', 'sztanga', 'rzymska', 'guma'].includes(g.rodzaj)]).toEqual([k, true]);
  });
});

describe('core_floor: tor (K5, ślad = miednica dla ćwiczeń bez ciężaru)', () => {
  test.each(KEYS)('%s: miednica nie ma zawróceń poza klatkami kluczowymi (bez wybrzuszeń z interpolacji)', k => { expect(zawroceniaPoza(k, US.map(u => frame(k, u).sk.pelvis[1]))).toBe(0); });
  test('miara potrafi paść: tor z falą między klatkami ma zawrócenia poza klatką', () => { expect(zawroceniaPoza('Crunch', US.map(u => frame('Crunch', u).sk.pelvis[1] + 3 * Math.sin(u * 60)))).toBeGreaterThan(0); });
  test.each(['Cable Crunch', 'Cable Reverse Crunch', 'Machine Crunch', 'Suspended Reverse Crunch'])('%s: kostki/dłonie pozostają w zasięgu sprzętu (przełożenie ślad = miednica, zasięg ramienia ≤ 64,5 cm od barku)', k => {
    for (const u of US) { const f = frame(k, u); for (const s of ['R', 'L'] as const) { const g = f.sk.arms[s].grip, sh = f.sk.arms[s].shoulder; expect([k, u, Math.hypot(g[0] - sh[0], g[1] - sh[1], g[2] - sh[2]) <= 64.5]).toEqual([k, u, true]); } }
  });
});

describe('core_floor: styki z podłożem (K7, co 0,0125 u)', () => {
  test.each(KEYS)('%s: stopy i dłonie nie pod podłogą > 1 cm', k => {
    for (const u of US) { const f = frame(k, u); for (const s of ['R', 'L'] as const) { const l = f.sk.legs[s]; expect([k, u, s, Math.min(l.toe[1], l.heel[1], l.ankle[1], f.sk.arms[s].grip[1]) >= -1]).toEqual([k, u, s, true]); } }
  });
  test('miara potrafi paść: stopy Dead Bug obniżone o 6 cm schodzą pod podłogę (najniższy punkt 3,6 cm)', () => { const m = Math.min(...US.map(u => { const f = frame('Dead Bug', u); return Math.min(...(['R', 'L'] as const).map(x => Math.min(f.sk.legs[x].toe[1], f.sk.legs[x].heel[1], f.sk.legs[x].ankle[1]))); })); expect(m - 6).toBeLessThan(-1); });
});

describe('core_floor: zakres stawów zgodny z tekstem (K8)', () => {
  test('Superman: wyprost biodra w granicach ruchu (≥ −17°), nogi i ręce proste (kolano, łokieć ≤ 15°)', () => { expect(A('Superman', 1).hip).toBeGreaterThanOrEqual(-17); expect(A('Superman', 1).knee).toBeLessThanOrEqual(15); expect(A('Superman', 1).elbow).toBeLessThanOrEqual(15); });
  test('Dead Bug i Hollow Hold: ręce proste (łokieć ≤ 15°); Hollow Hold nogi proste (kolano ≤ 15°); Lying Leg Raise nogi proste i biodro kończy ≥ 85°', () => {
    expect(A('Dead Bug', 1).elbow).toBeLessThanOrEqual(15); expect(A('Hollow Hold', 0).elbow).toBeLessThanOrEqual(15); expect(A('Hollow Hold', 0).knee).toBeLessThanOrEqual(15);
    expect(A('Lying Leg Raise', 1).knee).toBeLessThanOrEqual(15); expect(A('Lying Leg Raise', 1).hip).toBeGreaterThanOrEqual(85);
  });
  test('V-Up, Cocoons, Leg Pull-In: na końcu biodro zgięte ≥ 110° (kolana/nogi blisko klatki)', () => { for (const k of ['V-Up', 'Cocoons', 'Leg Pull-In', 'Reverse Crunch', 'Cable Reverse Crunch', 'Suspended Reverse Crunch']) expect([k, A(k, 1).hip >= 110]).toEqual([k, true]); });
  test('Reverse Crunch i wariant na wyciągu: biodro rośnie ≥ 25° (miednica prowadzi ruch)', () => { for (const k of ['Reverse Crunch', 'Cable Reverse Crunch']) expect([k, A(k, 1).hip - A(k, 0).hip >= 25]).toEqual([k, true]); });
  test('Crunch z łydkami na piłce: kolano ≈ 90–100° (łydki na piłce), biodro zgięte 85–120°', () => { const k = 'Crunch - Legs On Exercise Ball'; for (const u of [0, 1]) { expect(A(k, u).knee).toBeGreaterThanOrEqual(85); expect(A(k, u).knee).toBeLessThanOrEqual(100); expect(A(k, u).hip).toBeGreaterThanOrEqual(85); expect(A(k, u).hip).toBeLessThanOrEqual(120); } });
  test('Stability Ball Crunch: kolana zgięte 70–100° (stopy płasko), tułów unosi się (biodro rośnie ≥ 15°)', () => { const k = 'Stability Ball Crunch'; expect(A(k, 0).knee).toBeGreaterThanOrEqual(70); expect(A(k, 0).knee).toBeLessThanOrEqual(100); expect(A(k, 1).hip - A(k, 0).hip).toBeGreaterThanOrEqual(15); });
  test('Cable Crunch (klęk): biodro rośnie ≥ 45° (zwijanie do przodu), kolano 105° przez cały ruch; Machine Crunch: biodro rośnie ≥ 25°', () => {
    expect(A('Cable Crunch', 1).hip - A('Cable Crunch', 0).hip).toBeGreaterThanOrEqual(45); expect(A('Cable Crunch', 0.5).knee).toBeCloseTo(A('Cable Crunch', 0).knee, 0); expect(A('Machine Crunch', 1).hip - A('Machine Crunch', 0).hip).toBeGreaterThanOrEqual(25);
  });
  test('Suspended Reverse Crunch: ręce proste (łokieć ≤ 20°), kolano na końcu ≥ 110° (kolana do klatki)', () => { expect(A('Suspended Reverse Crunch', 0).elbow).toBeLessThanOrEqual(20); expect(A('Suspended Reverse Crunch', 1).knee).toBeGreaterThanOrEqual(110); });
  test('miara potrafi paść: Dead Bug nie kończy ruchu z biodrem ≥ 110°', () => { expect(A('Dead Bug', 1).hip).toBeLessThan(110); });
});

/* R2 (04.11.2026): poprawki po recenzji ruchu R1 — miary tożsamości ćwiczenia (W1, Ś1, Ś2, Ś3), każda z przypadkiem negatywnym na danych sprzed poprawki. */
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));
const dlonDoGlowy = (k: string, u: number) => { const f = frame(k, u); return Math.max(...(['R', 'L'] as const).map(s => dist(f.sk.arms[s].grip, f.sk.head))); };
describe('core_floor R2: tożsamość poprawionych ćwiczeń', () => {
  test('Bicycle Crunch: dłonie przy głowie, obie stopy nad podłogą, jedna noga zgięta, druga prosta, skręt tułowia ku zgiętemu kolanu, role nóg się zamieniają', () => {
    const k = 'Bicycle Crunch';
    for (const u of [0, 0.5, 1]) { expect([u, dlonDoGlowy(k, u) <= 16]).toEqual([u, true]); }
    for (const u of [0, 1]) { const f = frame(k, u); const l = f.sk.legs; expect(Math.min(l.R.heel[1], l.L.heel[1])).toBeGreaterThan(8); }
    const kn = (u: number, s: 'R' | 'L') => jointAngles(frame(k, u).sk, s).knee;
    expect(kn(0, 'R')).toBeGreaterThan(70); expect(kn(0, 'L')).toBeLessThan(20); expect(kn(1, 'L')).toBeGreaterThan(70); expect(kn(1, 'R')).toBeLessThan(20);
    expect(frame(k, 0).sk.twist).toBeGreaterThan(15); expect(frame(k, 1).sk.twist).toBeLessThan(-15);
  });
  const k0 = 'Bicycle Crunch';
  test('miara potrafi paść: Bicycle Crunch sprzed poprawki miał dłonie 39 cm od głowy i nieruchomą prawą stopę na podłodze', () => { const stara = JSON.parse(JSON.stringify(P[k0])); for (const kl of stara.klatki) { kl.rece.R.chwyt = [-30, 32, 24]; kl.rece.L.chwyt = [-30, 32, -24]; kl.nogi.R.kostka = [35, 7, 15]; } const f = keyframeFrame(stara as PoseData, 0); expect(dist(f.sk.arms.R.grip, f.sk.head)).toBeGreaterThan(16); expect(f.sk.legs.R.heel[1]).toBeLessThan(8); });
  test('Cross-Body Crunch: dłonie przy głowie, skręt tułowia ≥ 20° na końcu, jedno kolano unosi się w trakcie ruchu', () => {
    const k = 'Cross-Body Crunch'; for (const u of [0, 1]) expect(dlonDoGlowy(k, u)).toBeLessThanOrEqual(16);
    expect(Math.abs(frame(k, 1).sk.twist)).toBeGreaterThanOrEqual(20); expect(Math.abs(frame(k, 0).sk.twist)).toBeLessThan(1);
    expect(Math.abs(frame(k, 1).sk.legs.L.knee[0] - frame(k, 1).sk.legs.R.knee[0])).toBeGreaterThan(20); expect(Math.abs(frame(k, 0).sk.legs.L.knee[0] - frame(k, 0).sk.legs.R.knee[0])).toBeLessThan(3);
  });
  test('Toe Touchers: uda pionowo (kolano nad biodrem ±8 cm), kolana ≤ 20°, dłonie zbliżają się do kostek', () => {
    const k = 'Toe Touchers'; for (const u of [0, 0.5, 1]) { const f = frame(k, u); expect(Math.abs(f.sk.legs.R.knee[0] - f.sk.legs.R.hip[0])).toBeLessThan(8); expect(A(k, u).knee).toBeLessThanOrEqual(20); }
    const d = (u: number) => dist(frame(k, u).sk.arms.R.grip, frame(k, u).sk.legs.R.ankle); expect(d(1)).toBeLessThan(d(0) - 10);
  });
  test('Stability Ball Crunch: piłka 55 cm pod lędźwiami i środkiem pleców (środek pleców ≤ 3 cm od styku), miednica niżej od barków', () => {
    const k = 'Stability Ball Crunch'; const b = P[k].sprzet.find(g => g.rodzaj === 'pilka_gimnastyczna')!; expect(b.promien).toBe(27.5);
    for (const u of [0, 0.5]) { const f = frame(k, u); const c = [b.x as number, b.promien as number, 0]; expect(dist(f.sk.spineMid, c) - (b.promien as number) - 9.5).toBeLessThan(3); expect(f.sk.pelvis[1]).toBeLessThan(f.sk.shoulderC[1]); }
  });
  test('miara potrafi paść: środek pleców 6,5–7,8 cm od piłki (stan sprzed poprawki) przekracza 3 cm', () => { const b = P['Stability Ball Crunch'].sprzet.find(g => g.rodzaj === 'pilka_gimnastyczna')!; const f = frame('Stability Ball Crunch', 0); const c = [(b.x as number) - 25, b.promien as number, 0]; expect(dist(f.sk.spineMid, c) - (b.promien as number) - 9.5).toBeGreaterThan(3); });
});

/* T-1 (R1): MIEJSCE śladu toru z info.trail — nie tylko kształt miednicy. Bez sprzętu nośnego: ślad = miednica; wyciąg/dźwignia z chwytem: ślad = środek chwytów; wyciąg z linką na kostkach: ślad = kostka. */
describe('core_floor R2: miejsce śladu toru (T-1)', () => {
  const trail = (k: string, u: number) => frame(k, u) as unknown as { info: { trail?: number[]; load?: number[] }; sk: ReturnType<typeof frame>['sk'] };
  const ślad = (k: string, u: number) => (trail(k, u).info.trail ?? trail(k, u).info.load) as number[] | undefined;
  const ZASOBY: Record<string, (sk: ReturnType<typeof frame>['sk']) => number[]> = {
    'Cable Crunch': sk => [0, 1, 2].map(i => (sk.arms.R.grip[i] + sk.arms.L.grip[i]) / 2), 'Machine Crunch': sk => [0, 1, 2].map(i => (sk.arms.R.grip[i] + sk.arms.L.grip[i]) / 2),
    'Cable Reverse Crunch': sk => sk.legs.R.ankle, 'Otis-Up': sk => [0, 1, 2].map(i => (sk.arms.R.grip[i] + sk.arms.L.grip[i]) / 2), 'Press Sit-Up': sk => [0, 1, 2].map(i => (sk.arms.R.grip[i] + sk.arms.L.grip[i]) / 2),
    'Weighted Sit-Ups - With Bands': sk => sk.arms.R.grip /* guma w dłoniach: ślad = chwyt R (kontrakt FW1) */, 'Standing Rope Crunch': sk => [0, 1, 2].map(i => (sk.arms.R.grip[i] + sk.arms.L.grip[i]) / 2),
  };
  test.each(KEYS)('%s: ślad istnieje i leży w miejscu wynikającym ze sprzętu (≤ 3 cm; miednica, środek chwytów albo kostka)', k => {
    for (const u of [0, 0.5, 1]) { const f = trail(k, u); const t = ślad(k, u); expect([k, u, !!t]).toEqual([k, u, true]); const cel = ZASOBY[k] ? ZASOBY[k](f.sk) : f.sk.pelvis; expect([k, u, dist(t!, cel) <= 3]).toEqual([k, u, true]); }
  });
  test('miara potrafi paść: dla Cable Reverse Crunch ślad nie leży w miednicy, a dla Cable Crunch — nie w miednicy (miejsce różne od przypadku bez sprzętu)', () => {
    for (const k of ['Cable Reverse Crunch', 'Cable Crunch']) { const f = trail(k, 0.5); expect(dist(ślad(k, 0.5)!, f.sk.pelvis)).toBeGreaterThan(3); }
  });
});

/* R3 (04.11.2026): pięć póz dla ćwiczeń z tekstem bez pozy — miary tożsamości ruchu, każda z prawdziwym negatywem (sklonowane dane z mutacją). */
const klon = (k: string, zmien: (kl: any[]) => void): PoseData => { const c = JSON.parse(JSON.stringify(P[k])); zmien(c.klatki); return c as PoseData; };
const fr2 = (d: PoseData, u: number) => keyframeFrame(d, u);
const mid = (f: ReturnType<typeof frame>) => [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2);
const sprz = (k: string, r: string) => P[k].sprzet.find(g => g.rodzaj === r);
describe('core_floor R3: tożsamość nowych póz', () => {
  test('Butt-Ups: start = podpór na przedramionach (biodra nisko, ciało w linii), koniec = odwrócone V (biodra ≥ 55 cm, biodro zgięte ≥ 70°, czyli kąt w biodrze ≤ 110°), dłonie nieruchome, nogi proste', () => {
    const k = 'Butt-Ups'; expect(frame(k, 0).sk.pelvis[1]).toBeLessThan(35); expect(A(k, 0).hip).toBeLessThan(20); expect(frame(k, 1).sk.pelvis[1]).toBeGreaterThanOrEqual(55); expect(A(k, 1).hip).toBeGreaterThanOrEqual(70);
    expect(dist(frame(k, 0).sk.arms.R.grip, frame(k, 1).sk.arms.R.grip)).toBeLessThan(0.5); for (const u of [0, 0.5, 1]) expect(A(k, u).knee).toBeLessThanOrEqual(20);
  });
  /* R3-W1 (recenzja r3, 04.11.2026): źródło ruchu — „butt up and back”, łokcie pod barkami, stopy stoją; poprzedni rysunek pchał miednicę do przodu i przesuwał stopy o 44 cm. */
  const wTyl = (d: PoseData) => frame0x(d, 0, 'pelvis') - frame0x(d, 1, 'pelvis');
  const frame0x = (d: PoseData, u: number, j: 'pelvis' | 'shoulderC') => fr2(d, u).sk[j][0];
  const stopyRuch = (d: PoseData) => Math.max(...[0.25, 0.5, 0.75, 1].map(u => Math.max(dist(fr2(d, 0).sk.legs.R.toe, fr2(d, u).sk.legs.R.toe), dist(fr2(d, 0).sk.legs.R.ankle, fr2(d, u).sk.legs.R.ankle))));
  test('Butt-Ups (R3-W1): miednica idzie w górę I DO TYŁU (w stronę stóp ≥ 5 cm), bark cofa się wokół łokcia (≥ 15 cm do tyłu), łokcie na podłodze w miejscu (x ≤ 3 cm, y ≤ 6 cm), stopy stoją (palce i kostki ≤ 0,5 cm)', () => {
    const d = P['Butt-Ups']; expect(wTyl(d)).toBeGreaterThanOrEqual(5); expect(frame0x(d, 0, 'shoulderC') - frame0x(d, 1, 'shoulderC')).toBeGreaterThanOrEqual(15);
    for (const u of [0, 0.5, 1]) { expect(Math.abs(fr2(d, u).sk.arms.R.elbow[0] - fr2(d, 0).sk.arms.R.elbow[0])).toBeLessThanOrEqual(3); expect(fr2(d, u).sk.arms.R.elbow[1]).toBeLessThanOrEqual(6); } expect(stopyRuch(d)).toBeLessThanOrEqual(0.5);
  });
  test('miara potrafi paść (R3-W1): miednica pchana do przodu (jak przed poprawką: x 81,6 → 108,7) nie spełnia „do tyłu”; stopy przesunięte o 44 cm nie spełniają „stopy stoją”', () => {
    const przod = klon('Butt-Ups', kl => { kl[kl.length - 1].miednica = [108.7, 68.2, 0]; }); expect(wTyl(przod)).toBeLessThan(0);
    const marsz = klon('Butt-Ups', kl => { for (const s of ['R', 'L']) { const k = kl[kl.length - 1].nogi[s].kostka; kl[kl.length - 1].nogi[s].kostka = [k[0] + 44, k[1], k[2]]; } }); expect(stopyRuch(marsz)).toBeGreaterThan(40);
  });
  test('miara potrafi paść: Butt-Ups bez ruchu biodrami (koniec = start) ma biodra < 35 cm', () => { const d = klon('Butt-Ups', kl => { kl[kl.length - 1] = { ...JSON.parse(JSON.stringify(kl[0])), u: 1 }; }); expect(fr2(d, 1).sk.pelvis[1]).toBeLessThan(35); });
  test('Otis-Up: talerz w dłoniach, leżenie z kolanami ugiętymi (≥ 90° przez cały ruch), siad (barki ≥ 40 cm nad miednicą), talerz z klatki (≤ 50 cm) nad głowę (≥ 110 cm)', () => {
    const k = 'Otis-Up'; expect(sprz(k, 'talerz')).toBeDefined(); for (const u of [0, 0.5, 1]) expect(A(k, u).knee).toBeGreaterThanOrEqual(90);
    expect(frame(k, 0).sk.shoulderC[1] - frame(k, 0).sk.pelvis[1]).toBeLessThan(5); expect(frame(k, 1).sk.shoulderC[1] - frame(k, 1).sk.pelvis[1]).toBeGreaterThan(40); expect(mid(frame(k, 0))[1]).toBeLessThan(50); expect(mid(frame(k, 1))[1]).toBeGreaterThanOrEqual(110);
  });
  test('miara potrafi paść: Otis-Up z talerzem zostającym przy klatce (chwyty końca = chwyty startu) nie sięga 110 cm', () => { const d = klon('Otis-Up', kl => { kl[kl.length - 1].rece = JSON.parse(JSON.stringify(kl[0].rece)); }); expect(mid(fr2(d, 1))[1]).toBeLessThan(110); });
  test('GHD Sit Up: ławka rzymska z wałkami, miednica prawie w miejscu (ślizg po poduszce ≤ 4 cm), nogi prawie proste na górze (kolano ≤ 20°), stopy pod wałkiem (≤ 12 cm), start tułów poziomo w tył, koniec siad (barki ≥ 40 cm nad miednicą)', () => {
    const k = 'GHD Sit Up'; const g = sprz(k, 'rzymska')!; expect(g).toBeDefined(); expect(dist(frame(k, 0).sk.pelvis, frame(k, 1).sk.pelvis)).toBeLessThanOrEqual(4);
    expect(A(k, 1).knee).toBeLessThanOrEqual(20); for (const u of [0, 1]) { expect(dist([(g.x as number) + (g.dlugosc as number), g.y as number, 0], [frame(k, u).sk.legs.R.ankle[0], frame(k, u).sk.legs.R.ankle[1], 0])).toBeLessThanOrEqual(12); }
    expect(frame(k, 0).sk.shoulderC[1] - frame(k, 0).sk.pelvis[1]).toBeLessThan(12); expect(frame(k, 1).sk.shoulderC[1] - frame(k, 1).sk.pelvis[1]).toBeGreaterThan(40);
  });
  /* R3-Ś3 (recenzja r3, 04.11.2026): biodra na tylnym skraju poduszki (nie na środku) i kolana prostują się w siadzie („wróć do siadu, mocno prostując nogi”). Poduszka: środek [x, top], długość 30 cm (EQUIP.hyperLen) wzdłuż kierunku opadania `kat`; tylna krawędź = −15 cm od środka. */
  const odTylnejKrawedzi = (d: PoseData, u: number) => { const g = sprz('GHD Sit Up', 'rzymska')!; const th = (g.kat as number) * Math.PI / 180; const P = fr2(d, u).sk.pelvis; return (P[0] - (g.x as number)) * Math.cos(th) - (P[1] - (g.top as number)) * Math.sin(th) + 15; };
  const kolanoGhd = (d: PoseData, u: number) => jointAngles(fr2(d, u).sk, 'R').knee;
  test('GHD Sit Up (R3-Ś3): środek miednicy ≤ 8 cm od tylnej krawędzi poduszki w każdym kadrze; kolano zgięte ≥ 25° na dole i prostuje się o ≥ 15° w siadzie', () => {
    const d = P['GHD Sit Up']; for (const u of [0, 0.5, 1]) { expect(odTylnejKrawedzi(d, u)).toBeLessThanOrEqual(8); expect(odTylnejKrawedzi(d, u)).toBeGreaterThanOrEqual(0); }
    expect(kolanoGhd(d, 0)).toBeGreaterThanOrEqual(25); expect(kolanoGhd(d, 0) - kolanoGhd(d, 1)).toBeGreaterThanOrEqual(15);
  });
  test('miara potrafi paść (R3-Ś3): miednica na środku poduszki (jak przed poprawką: x 3,0, y 86,1) jest 15 cm od tylnej krawędzi; kolano stałe 10° nie prostuje się', () => {
    const srodek = klon('GHD Sit Up', kl => { for (const k of kl) k.miednica = [3.0, 86.1, 0]; }); expect(odTylnejKrawedzi(srodek, 1)).toBeGreaterThan(8);
    const stale = klon('GHD Sit Up', kl => { for (const k of kl) k.miednica = JSON.parse(JSON.stringify(kl[kl.length - 1].miednica)); }); expect(kolanoGhd(stale, 0) - kolanoGhd(stale, 1)).toBeLessThan(15);
  });
  test('miara potrafi paść: GHD Sit Up z tułowiem końca ułożonym poziomo (pochylenie −90) nie siada (< 12 cm)', () => { const d = klon('GHD Sit Up', kl => { kl[kl.length - 1].pochylenieTulowia = -90; kl[kl.length - 1].zgiecieKregoslupa = 0; kl[kl.length - 1].pochylenieGlowy = -90; }); expect(fr2(d, 1).sk.shoulderC[1] - fr2(d, 1).sk.pelvis[1]).toBeLessThan(12); });
  test('Dragon Flag: ławka płaska, barki nieruchome na ławce, ciało proste (biodro i kolano ≤ 20°), dłonie nieruchome za głową, kąt ciała nad ławką ≥ 70° na starcie i ≤ 30° na końcu', () => {
    const k = 'Dragon Flag'; const b = sprz(k, 'lawka')!; expect(b.kat).toBe(0); const ang = (u: number) => { const f = frame(k, u); return Math.atan2(f.sk.pelvis[1] - f.sk.shoulderC[1], f.sk.pelvis[0] - f.sk.shoulderC[0]) * 180 / Math.PI; };
    expect(dist(frame(k, 0).sk.shoulderC, frame(k, 1).sk.shoulderC)).toBeLessThan(0.5); expect(frame(k, 0).sk.shoulderC[1] - (b.top as number)).toBeLessThan(14); for (const u of [0, 1]) { expect(Math.abs(A(k, u).hip)).toBeLessThanOrEqual(20); expect(A(k, u).knee).toBeLessThanOrEqual(20); }
    expect(dist(frame(k, 0).sk.arms.R.grip, frame(k, 1).sk.arms.R.grip)).toBeLessThan(0.5); expect(ang(0)).toBeGreaterThanOrEqual(70); expect(ang(1)).toBeLessThanOrEqual(30);
  });
  /* R3-W2 / R3-Ś1 (recenzja r3, 04.11.2026): źródło — dłonie chwytają zewnętrzne krawędzie ławki przy głowie, na dole pośladki „prawie na ławce”. Ławka: x od (x − dlugosc) do x, y od top − 8 (EQUIP.benchPad) do top, z = ±15 (EQUIP.benchW/2).
   Styk dłoni = odległość chwytu od bryły ławki ≤ 3 cm (promień dłoni). „Prawie na ławce”: środek miednicy leży 10,2 cm (BENCH.padBack) nad powierzchnią, gdy pośladki na niej leżą, więc luz pośladków = y miednicy − top − 10,2; próg 5 cm = połowa promienia miednicy (ok. 10 cm), czyli pośladki w zasięgu ręki od ławki. */
  const doLawki = (d: PoseData, u: number, s: 'R' | 'L') => { const b = d.sprzet.find(g => g.rodzaj === 'lawka')!; const G = fr2(d, u).sk.arms[s].grip; const x0 = (b.x as number) - (b.dlugosc as number), x1 = b.x as number, y0 = (b.top as number) - 8, y1 = b.top as number;
    return Math.hypot(Math.max(x0 - G[0], 0, G[0] - x1), Math.max(y0 - G[1], 0, G[1] - y1), Math.max(Math.abs(G[2]) - 15, 0)); };
  const luzPosladkow = (d: PoseData, u: number) => fr2(d, u).sk.pelvis[1] - (sprz('Dragon Flag', 'lawka')!.top as number) - 10.2;
  test('Dragon Flag (R3-W2): obie dłonie stykają się z ławką (≤ 3 cm) w każdym kadrze, głowa nie wystaje poza koniec ławki', () => {
    const d = P['Dragon Flag']; const b = sprz('Dragon Flag', 'lawka')!; for (const u of US.filter((_, i) => i % 20 === 0)) for (const s of ['R', 'L'] as const) expect([u, s, doLawki(d, u, s) <= 3]).toEqual([u, s, true]);
    expect(fr2(d, 0).sk.head[0]).toBeGreaterThanOrEqual((b.x as number) - (b.dlugosc as number));
  });
  test('Dragon Flag (R3-Ś1): na dole pośladki ≤ 5 cm nad ławką', () => { expect(luzPosladkow(P['Dragon Flag'], 1)).toBeLessThanOrEqual(5); });
  test('miara potrafi paść (R3-W2, R3-Ś1): dłonie w x = −88, y = 49 (jak przed poprawką: 18 cm za końcem ławki) nie stykają się; dół ciała pod kątem 24° ma pośladki 21 cm nad ławką', () => {
    const wolne = klon('Dragon Flag', kl => { for (const k of kl) { k.rece.R.chwyt = [-88, 49, 17]; k.rece.L.chwyt = [-88, 49, -17]; } }); expect(doLawki(wolne, 0.5, 'R')).toBeGreaterThan(3);
    const wysoko = klon('Dragon Flag', kl => { kl[kl.length - 1].miednica = [-10.3, 74.5, 0]; }); expect(luzPosladkow(wysoko, 1)).toBeGreaterThan(5);
  });
  test('miara potrafi paść: Dragon Flag z ciałem końca ustawionym jak na starcie ma kąt ≥ 70° (brak opuszczania)', () => { const d = klon('Dragon Flag', kl => { kl[kl.length - 1] = { ...JSON.parse(JSON.stringify(kl[0])), u: 1 }; }); const f = fr2(d, 1); expect(Math.atan2(f.sk.pelvis[1] - f.sk.shoulderC[1], f.sk.pelvis[0] - f.sk.shoulderC[0]) * 180 / Math.PI).toBeGreaterThanOrEqual(70); });
  test('Press Sit-Up: ławka ujemna z wałkami, sztanga za dłońmi, stopy nieruchome, siad (biodro rośnie ≥ 70°), sztanga z klatki (≤ 85 cm) ≥ 100 cm wyżej', () => {
    const k = 'Press Sit-Up'; const b = sprz(k, 'lawka')!; expect(b.kat as number).toBeLessThan(-5); expect(b.walki).toBe(true); expect(sprz(k, 'sztanga')).toBeDefined();
    expect(dist(frame(k, 0).sk.legs.R.ankle, frame(k, 1).sk.legs.R.ankle)).toBeLessThan(0.5); expect(A(k, 1).hip - A(k, 0).hip).toBeGreaterThanOrEqual(70); expect(mid(frame(k, 1))[1] - mid(frame(k, 0))[1]).toBeGreaterThanOrEqual(100);
  });
  test('miara potrafi paść: Press Sit-Up ze sztangą zostającą na klatce (chwyty końca = chwyty startu) unosi ją < 100 cm', () => { const d = klon('Press Sit-Up', kl => { const r = JSON.parse(JSON.stringify(kl[0].rece)); kl[kl.length - 1].rece = r; }); expect(mid(fr2(d, 1))[1] - mid(fr2(d, 0))[1]).toBeLessThan(100); });
  test('Side Jackknife: wyjątek z powodem w generatorze (dwie próby R3 padły na zakresach silnika), brak pozy w danych', () => {
    expect(KEYS).not.toContain('Side Jackknife'); expect(GEN).toMatch(/export const WYJATKI = \{[\s\S]*?'Side Jackknife': '[^']{40,}/); expect(GEN).not.toMatch(/'Side Jackknife': \(\) =>/);
  });
});

/* R3-poprawki (04.11.2026, recenzja r2): R2-W1/R2-Ś1 styk miednicy i lędźwi z piłką w Stability Ball Crunch przez cały ruch; R2-N2 negatywy Cross-Body i Toe Touchers. */
const ODL_T = 9.5;
const stykPilki = (d: PoseData) => { const b = d.sprzet.find(g => g.rodzaj === 'pilka_gimnastyczna')!; const c = [b.x as number, b.promien as number]; const r = b.promien as number; let m = 0;
  for (const u of [0, 0.25, 0.5, 0.75, 1]) { const f = keyframeFrame(d, u); const P = f.sk.pelvis, S = f.sk.shoulderC; const l = Math.hypot(S[0] - P[0], S[1] - P[1]); const q = [P[0] + 25 * (S[0] - P[0]) / l, P[1] + 25 * (S[1] - P[1]) / l];
    const ab = [q[0] - P[0], q[1] - P[1]]; const t = Math.max(0, Math.min(1, ((c[0] - P[0]) * ab[0] + (c[1] - P[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2))); const dl = Math.hypot(c[0] - P[0] - t * ab[0], c[1] - P[1] - t * ab[1]);
    m = Math.max(m, Math.abs(Math.hypot(c[0] - P[0], c[1] - P[1]) - r - ODL_T), Math.abs(dl - r - ODL_T)); } return m; };
describe('core_floor R3-poprawki: Stability Ball Crunch styk miednicy z piłką, negatywy Cross-Body i Toe Touchers', () => {
  test('Stability Ball Crunch: miednica i lędźwie (25 cm od miednicy) leżą na piłce przez cały ruch (odchylenie od powierzchni ≤ 3 cm)', () => { expect(stykPilki(P['Stability Ball Crunch'])).toBeLessThanOrEqual(3); });
  /* R3-Ś2 (recenzja r3, 04.11.2026): start z plecami na piłce — punkt 35 cm od miednicy wzdłuż tułowia (górna część pleców; sam szczyt łopatek wystaje, bo tułów jest rysowany prosto) leży na piłce (≤ 3 cm od powierzchni), a na końcu ruchu jest oderwany (≥ 8 cm). */
  const gornaCzescPlecow = (d: PoseData, u: number) => { const b = d.sprzet.find(g => g.rodzaj === 'pilka_gimnastyczna')!; const f = keyframeFrame(d, u); const P = f.sk.pelvis, S = f.sk.shoulderC; const l = Math.hypot(S[0] - P[0], S[1] - P[1]); const q = [P[0] + 35 * (S[0] - P[0]) / l, P[1] + 35 * (S[1] - P[1]) / l]; return Math.hypot(q[0] - (b.x as number), q[1] - (b.promien as number)) - (b.promien as number) - ODL_T; };
  test('Stability Ball Crunch (R3-Ś2): górna część pleców (35 cm od miednicy) leży na piłce na starcie (≤ 3 cm od powierzchni) i odrywa się w ruchu (≥ 8 cm na końcu)', () => {
    const d = P['Stability Ball Crunch']; expect(Math.abs(gornaCzescPlecow(d, 0))).toBeLessThanOrEqual(3); expect(gornaCzescPlecow(d, 1)).toBeGreaterThanOrEqual(8);
  });
  test('miara potrafi paść (R3-Ś2): ruch od unoszonych pleców (kadr startu = kadr końca) nie ma pleców na piłce na starcie', () => {
    const d = klon('Stability Ball Crunch', kl => { kl[0] = { ...JSON.parse(JSON.stringify(kl[kl.length - 1])), u: 0 }; }); expect(gornaCzescPlecow(d, 0)).toBeGreaterThan(3);
  });
  test('miara potrafi paść: dane sprzed poprawki (piłka x = −41,5, miednica y = 44) — miednica wisi 7,7 cm przed piłką', () => {
    const d = klon('Stability Ball Crunch', kl => { for (const k of kl) k.miednica = [0, 44, 0]; }); (d.sprzet.find(g => g.rodzaj === 'pilka_gimnastyczna') as { x: number }).x = -41.5; expect(stykPilki(d)).toBeGreaterThan(7);
  });
  test('miara potrafi paść: Cross-Body Crunch bez skrętu i z dłońmi daleko od głowy nie spełnia miar tożsamości', () => {
    const d = klon('Cross-Body Crunch', kl => { const o = kl[kl.length - 1]; o.skretTulowia = 0; o.rece.R.chwyt = [-30, 32, 24]; o.rece.L.chwyt = [-30, 32, -24]; }); const f = fr2(d, 1);
    expect(Math.abs(f.sk.twist)).toBeLessThan(20); expect(Math.max(...(['R', 'L'] as const).map(s => dist(f.sk.arms[s].grip, f.sk.head)))).toBeGreaterThan(16);
  });
  test('miara potrafi paść: Toe Touchers z udami odchylonymi od pionu (kostki dalej w x) i prostymi rękami nie sięgającymi kostek', () => {
    const d = klon('Toe Touchers', kl => { for (const k of kl) { k.nogi.R.kostka = [70, 40, 12]; k.nogi.L.kostka = [70, 40, -12]; } kl[kl.length - 1].rece = JSON.parse(JSON.stringify(kl[0].rece)); }); const f = fr2(d, 1);
    expect(Math.abs(f.sk.legs.R.knee[0] - f.sk.legs.R.hip[0])).toBeGreaterThanOrEqual(8);
  });
});

/* P5 (04.11.2026): cztery nowe pozy (ławka ujemna, siad na ławce, wyciąg stojąc) + dwa wyjątki z powodem; ruch zgodny ze zdaniami kart (T2), każda miara z prawdziwym negatywem. */
describe('core_floor P5: tożsamość nowych póz', () => {
  const stoi = (k: string, s: 'R' | 'L' = 'R') => { const a = frame(k, 0).sk.legs[s].ankle; return Math.max(...US.map(u => dist(frame(k, u).sk.legs[s].ankle, a))); };
  const ławka = (k: string) => P[k].sprzet.find(g => g.rodzaj === 'lawka') as { kat: number; walki?: boolean; top: number };
  test('Decline Oblique Crunch: ławka −20° z wałkami, kostki i miednica nieruchome, tułów unosi się ≥ 15 cm, skręt ≥ 25° na końcu, dłonie przy głowie (≤ 16 cm)', () => {
    const k = 'Decline Oblique Crunch'; expect(ławka(k).kat).toBe(-20); expect(ławka(k).walki).toBe(true); expect(stoi(k)).toBeLessThanOrEqual(0.5);
    expect(dist(frame(k, 1).sk.pelvis, frame(k, 0).sk.pelvis)).toBeLessThanOrEqual(0.5); expect(frame(k, 1).sk.shoulderC[1] - frame(k, 0).sk.shoulderC[1]).toBeGreaterThanOrEqual(15);
    expect(Math.abs(frame(k, 1).sk.twist)).toBeGreaterThanOrEqual(25); for (const u of US) for (const s of ['R', 'L'] as const) expect([u, dist(frame(k, u).sk.arms[s].grip, frame(k, u).sk.head) <= 16]).toEqual([u, true]);
  });
  test('miara potrafi paść (Decline Oblique): bez skrętu i z miednicą unoszoną nie spełnia miar', () => {
    const d = klon('Decline Oblique Crunch', kl => { for (const f of kl) { f.skretTulowia = 0; f.miednica = [f.miednica[0], f.miednica[1] + 8 * f.u, 0]; } });
    expect(Math.abs(fr2(d, 1).sk.twist)).toBeLessThan(25); expect(dist(fr2(d, 1).sk.pelvis, fr2(d, 0).sk.pelvis)).toBeGreaterThan(0.5);
  });
  test('Weighted Sit-Ups - With Bands: ławka −20°, guma z zaczepem, dłonie stałe względem klatki (±2 cm), guma rozciąga się ≥ 25 cm, tułów siada (barki ≥ 30 cm wyżej), kostki stoją', () => {
    const k = 'Weighted Sit-Ups - With Bands'; expect(ławka(k).kat).toBe(-20); const g = P[k].sprzet.find(x => x.rodzaj === 'guma') as { mocowanie: string; x: number; y: number; z: number }; expect(g.mocowanie).toBe('zaczep'); expect(stoi(k)).toBeLessThanOrEqual(0.5);
    const rel = (u: number) => { const f = frame(k, u); return dist(mid(f), f.sk.shoulderC); }; for (const u of US) expect([u, Math.abs(rel(u) - rel(0)) <= 2]).toEqual([u, true]); /* odległość dłonie–bark stała = dłonie stałe względem klatki */
    const gd = (u: number) => dist(mid(frame(k, u)), [g.x, g.y, g.z]); expect(gd(1) - gd(0)).toBeGreaterThanOrEqual(25); expect(frame(k, 1).sk.shoulderC[1] - frame(k, 0).sk.shoulderC[1]).toBeGreaterThanOrEqual(30);
  });
  test('miara potrafi paść (Weighted Sit-Ups): dłonie zostające w miejscu w świecie (chwyty startu) oddalają się od klatki > 2 cm, a bez ruchu tułowia guma się nie rozciąga', () => {
    const k = 'Weighted Sit-Ups - With Bands'; const d = klon(k, kl => { for (const f of kl) f.rece = JSON.parse(JSON.stringify(kl[0].rece)); }); const f1 = fr2(d, 1);
    expect(dist(mid(f1), f1.sk.shoulderC) - dist(mid(frame(k, 0)), frame(k, 0).sk.shoulderC)).toBeGreaterThan(2);
  });
  test('Seated Flat Bench Leg Pull-In: miednica nieruchoma na ławce (≤ 0,5 cm), dłonie na ławce po bokach, nogi proste i nad podłogą na starcie, na końcu zgięte w biodrze ≥ 110° z kolanami ≥ 20 cm nad biodrem, tułów pochyla się o ≥ 20°', () => {
    const k = 'Seated Flat Bench Leg Pull-In'; const top = ławka(k).top; expect(ławka(k).kat).toBe(0);
    for (const u of US) { const f = frame(k, u); expect([u, dist(f.sk.pelvis, frame(k, 0).sk.pelvis) <= 0.5]).toEqual([u, true]); for (const s of ['R', 'L'] as const) expect([u, s, Math.abs(f.sk.arms[s].grip[1] - top) <= 3]).toEqual([u, s, true]); }
    expect(A(k, 0).knee).toBeLessThanOrEqual(15); expect(Math.min(...(['R', 'L'] as const).map(s => frame(k, 0).sk.legs[s].ankle[1]))).toBeGreaterThanOrEqual(20);
    expect(A(k, 1).hip).toBeGreaterThanOrEqual(110); expect(frame(k, 1).sk.legs.R.knee[1] - frame(k, 1).sk.pelvis[1]).toBeGreaterThanOrEqual(20);
    const lean = (u: number) => { const f = frame(k, u); return Math.atan2(f.sk.shoulderC[0] - f.sk.pelvis[0], f.sk.shoulderC[1] - f.sk.pelvis[1]) / (Math.PI / 180); }; expect(lean(1) - lean(0)).toBeGreaterThanOrEqual(20);
  });
  test('miara potrafi paść (Seated Leg Pull-In): miednica unoszona z ławki i nogi nieruszane nie spełniają miar', () => {
    const d = klon('Seated Flat Bench Leg Pull-In', kl => { for (const f of kl) { f.miednica = [f.miednica[0], f.miednica[1] + 12 * f.u, 0]; f.nogi.R.kostka = JSON.parse(JSON.stringify(kl[0].nogi.R.kostka)); f.nogi.L.kostka = JSON.parse(JSON.stringify(kl[0].nogi.L.kostka)); } });
    expect(dist(fr2(d, 1).sk.pelvis, fr2(d, 0).sk.pelvis)).toBeGreaterThan(0.5); expect(jointAngles(fr2(d, 1).sk, 'R').hip).toBeLessThan(110);
  });
  test('Standing Rope Crunch: wyciąg wysoki z liną za plecami (x < 0, y ≥ 150), stopy i miednica stoją, dłonie przy głowie (≤ 20 cm) w całym ruchu, tułów zwija się (głowa ≥ 15 cm do przodu), zgięcie biodra ≤ 45° (nie zginanie w biodrach)', () => {
    const k = 'Standing Rope Crunch'; const w = P[k].sprzet.find(g => g.rodzaj === 'wyciag') as { x: number; y: number; chwyt: string }; expect(w.chwyt).toBe('lina'); expect(w.x).toBeLessThan(0); expect(w.y).toBeGreaterThanOrEqual(150); expect(stoi(k)).toBeLessThanOrEqual(0.5);
    for (const u of US) { const f = frame(k, u); expect([u, dist(f.sk.pelvis, frame(k, 0).sk.pelvis) <= 0.5]).toEqual([u, true]); for (const s of ['R', 'L'] as const) expect([u, dist(f.sk.arms[s].grip, f.sk.head) <= 20]).toEqual([u, true]); expect([u, jointAngles(f.sk, 'R').hip <= 45]).toEqual([u, true]); }
    expect(frame(k, 1).sk.head[0] - frame(k, 0).sk.head[0]).toBeGreaterThanOrEqual(15);
  });
  test('miara potrafi paść (Standing Rope Crunch): zgięcie w biodrach (miednica cofnięta, tułów pochylony 60°) przekracza 45°', () => {
    const d = klon('Standing Rope Crunch', kl => { kl[kl.length - 1].pochylenieTulowia = 60; kl[kl.length - 1].zgiecieKregoslupa = 0; }); expect(jointAngles(fr2(d, 1).sk, 'R').hip).toBeGreaterThan(45);
  });
  test('wyjątki P5 z powodem: Decline Reverse Crunch (ławka głową wyżej przeczy modelowi ławki ujemnej) i Stability Ball Knee Tuck (toczenie piłki; decyzja właściciela 04.11.2026) — w generatorze i w figury-wyjatki.json, bez póz', () => {
    const W = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-wyjatki.json'), 'utf8')).cwiczenia as Record<string, string>;
    for (const k of ['Decline Reverse Crunch', 'Stability Ball Knee Tuck']) { expect(KEYS).not.toContain(k); expect(GEN).toMatch(new RegExp("'" + k + "': '[^']{60,}")); expect(GEN).not.toMatch(new RegExp("'" + k + "': \\(\\) =>")); expect(W[k].length).toBeGreaterThan(60); }
    expect(W['Stability Ball Knee Tuck']).toMatch(/toczeniu piłki.*decyzja właściciela 04\.11\.2026/); expect(W['Decline Reverse Crunch']).toMatch(/głowa na wyższym końcu.*niższym końcu/);
  });
  test('reguła „lędźwie przy podłodze” nie dotyczy ćwiczeń z podparciem na ławce (LOT): Decline Oblique Crunch (wskazówka o lędźwiach na karcie) jej nie ma, Crunch na podłodze — ma (negatyw)', () => {
    const root = path.join(__dirname, '..');
    const kod = `import * as J from ${JSON.stringify(path.join(root, 'scripts/figures/v2-jakosc.mjs'))}; import * as S from ${JSON.stringify(path.join(root, 'scripts/figures/v2-sens.mjs'))}; import { v2 } from ${JSON.stringify(path.join(root, 'scripts/figures/agent-pozy/model.mjs'))}; import fs from 'node:fs';
const P = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(root, 'lib/figures/v2/poses/core_floor.json'))}, 'utf8')).cwiczenia; const teksty = J.wczytajTeksty();
const c = (cw) => J.cechyRuchu(v2(), P[cw], { rodzina: 'core_floor', cwiczenie: cw, teksty, reguly: S.regulyDla('core_floor', cw, ${JSON.stringify(root)}) }).has('ledzwie_przy_podlodze');
console.log(JSON.stringify([J.maWskazowkeLedzwie('Decline Oblique Crunch', teksty, ${JSON.stringify(root)}), 'Decline Oblique Crunch' in J.LOT, c('Decline Oblique Crunch'), c('Crunch')]));`;
    expect(JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', kod], { cwd: root, encoding: 'utf8' }))).toEqual([true, true, false, true]);
  });
});
