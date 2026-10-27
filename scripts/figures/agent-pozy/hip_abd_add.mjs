// Generator póz rodziny hip_abd_add po stronie agenta (wersja 1.1, 26.10.2026): odwodzenie i przywodzenie bioder na maszynie (siad) i na wyciągu (stanie), kroki bokiem i „potwora” z gumą na kostkach.
// Pozy WYLICZONE z modelu: noga z FK w 3D (kierunek uda i goleni → kolano, kostka; biegun kolana z położenia kolana), miednica i tułów nieruchome; ruch = kąt odwiedzenia uda alfa.
// Błędy katalogu: mis.jerk (tempo, bez animacji — bledy: []) i hab.mis.high na wyciągu (miednica przechyla się w stronę ruchu: przechył > 5°, grupa miednica; rysowany dopiero po wdrożeniu opisu w pl.json).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, K, poza, PODLOGA, hipY, dNogi, bledyZOpisem, dodajDotyczy, S, kolano2D } from './dol.mjs';

export const RODZINA = 'hip_abd_add';
const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };
function fk3(hip, d, e) { const b = BODY(); const dn = nrm(d), en = nrm(e); const knee = hip.map((v, i) => v + b.thigh * dn[i]); const ankle = knee.map((v, i) => v + b.shank * en[i]); return { knee, ankle, pole: poleKolana(hip, ankle, knee) }; }
const US = [0, 0.25, 0.5, 0.75, 1];
const a01 = ease;
export const PRZYBLIZENIA = {
  'Hip Abduction': 'przybliżenie: dźwignia maszyny (punkt: kostki) obraca się wokół pionowej osi biodra, schematycznie — nakładki na uda niemodelowane',
  'Hip Adduction': 'przybliżenie: dźwignia maszyny (punkt: kostki) obraca się wokół pionowej osi biodra, schematycznie — nakładki na uda niemodelowane',
  'Lateral Band Walk': 'pokazany jeden krok w bok (noga prawa wychodzi na zewnątrz, lewa dostawia się poza kadrem): miednica nie przesuwa się w poziomie (model nie przesuwa miednicy w bok)',
  'Monster Walk': 'pokazany jeden krok po skosie w przód (noga prawa), druga dostawia się poza kadrem; miednica nie przesuwa się w poziomie (model nie przesuwa miednicy w bok)',
};
export const WYJATKI = {
  'Band Hip Adduction': 'guma ma w modelu tylko pętlę między kostkami (opór rośnie, gdy kostki się oddalają) albo linię do dłoni; przywodzenie (zbliżanie nóg) przeciw gumie zaczepionej do kostki wymaga zaczepu na kostce, którego model gumy nie ma — pętla między kostkami pomagałaby ruchowi zamiast mu przeciwdziałać',
};
function zloz(cw, sprzet, klatki, bledy = []) { const b = bledyZOpisem(cw, bledy, PRZYBLIZENIA); const p = poza(RODZINA, cw, sprzet, klatki, b); for (const x of b) if (x.dod) dodajDotyczy(p, x.cue, ...x.dod); return p; }

/** Maszyna do odwodzenia/przywodzenia: siad, uda poziomo odchylone o alfa od osi przód–tył, goleń prawie pionowo; dźwignia pod kostką R obraca się wokół pionowej osi biodra. */
function maszyna(cw, { a0, a1 }) {
  const E = v2(); const kat = 80; const top = 37.8; const hp = E.benchHip(kat, top); const m = [hp[0], hp[1]]; const p = kat - 90;
  const hip = (s) => [m[0], m[1], s * HIP()];
  const noga = (s, alfa) => { const d = [Math.cos(alfa * R), 0, s * Math.sin(alfa * R)]; return fk3(hip(s), d, [0.1, -1, s * 0.25]); };
  const fr = (u) => { const alfa = lerp(a0, a1, a01(u)); const fR = noga(1, alfa), fL = noga(-1, alfa); const grip = (sg) => ({ g: [m[0] + 18, top + 5, sg * 24], pole: [-0.2, -0.5, sg] });
    return K({ u, m, p, head: p, R: { a: fR.ankle, pod: null, rot: 10, pole: fR.pole }, L: { a: fL.ankle, pod: null, rot: 10, pole: fL.pole }, hr: grip(1), hl: grip(-1) }); };
  const f0 = noga(1, a0); const P = [r1(hip(1)[0] + 0.1 * BODY().shank), r1(f0.ankle[1]), r1(HIP() + 0.25 * BODY().shank)]; const dl = r1(Math.hypot(f0.ankle[0] - P[0], f0.ankle[1] - P[1], f0.ankle[2] - P[2]));
  const spr = [PODLOGA(-60, 140), { rodzaj: 'lawka', x: r1(m[0] - 8.5), top, kat, siedzisko: 40, dlugosc: 75 }, { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'kostki', trzyma: 'R', x: P[0], y: P[1], z: P[2], dlugosc: dl }];
  return zloz(cw, spr, US.map(fr));
}

/* ---------- stanie: noga podporowa L (prosta), pracująca R ---------- */
const stoj = (ax = 0) => { const a = [ax, 7, -10]; const pelY = hipY(a, ax, -HIP(), 4); return { m: [ax, pelY], aL: a }; };
const nogaProsta = (hip, d) => { const dn = nrm(d); return fk3(hip, d, [dn[0] - 0.25, dn[1], dn[2]]); };

/** Odwodzenie / przywodzenie na wyciągu: stoję bokiem do kolumny (po stronie nogi podporowej L), kostka R w opasce; alfa = odwiedzenie uda, f = wyprzedzenie uda (przywodzenie przed nogą podporową). */
function wyciag(cw, { dir }) {
  const { m, aL } = stoj(0); const hipR = [m[0], m[1], HIP()];
  const par = dir === 'abd' ? { al0: 0, al1: 32, f0: 0, f1: 0 } : { al0: 28, al1: -6, f0: 0, f1: 14 };
  const noga = (u) => { const al = lerp(par.al0, par.al1, a01(u)), f = lerp(par.f0, par.f1, a01(u)); const d = [Math.sin(f * R), -Math.cos(f * R) * Math.cos(al * R), Math.cos(f * R) * Math.sin(al * R)]; return nogaProsta(hipR, d); };
  const fr = (u, tilt) => { const f = noga(u); const ak = [f.ankle[0], f.ankle[1], f.ankle[2]]; return { f: K({ u, m, p: 2, head: 2, tilt, R: { a: ak, pod: null, rot: 10, pole: f.pole }, L: { a: aL, pod: 0, rot: 10, pole: [0.15, 0.2, -0.1] }, hr: { g: [m[0] + 2, m[1] + 3, HIP() + 11], pole: [0, -0.2, 1] }, hl: { g: [m[0] + 2, m[1] + 3, -HIP() - 11], pole: [0, -0.2, -1] } }), ankle: ak }; };
  const ok = US.map((u) => fr(u)); const zc = dir === 'abd' ? -50 : 85; const sprzet = [PODLOGA(-80, 120), { rodzaj: 'wyciag', x: 46, y: 30, z: zc, chwyt: 'kostka', trzyma: 'R' }];
  const bl = dir === 'abd' ? { cue: 'hab.mis.high', znacznik: 'pelvis', dod: ['pelvis'], klatki: US.map((u) => (u === 0 ? { u: 0 } : { u, przechylMiednicy: r1(10 * a01(u)) })) } : null;
  return zloz(cw, sprzet, ok.map((r) => r.f), bl ? [bl] : []);
}

/** Kroki z gumą na kostkach w półprzysiadzie (kolana 40–50°, tułów pochylony 20°): krok = prawa kostka wychodzi na bok (bok) albo po skosie w przód (potwor). */
function krok(cw, { tryb }) {
  const lean = 20; const ax = 0; const zs = 14; const kn = 58; const aL = [ax, 7, -zs]; const pelY = hipY(aL, ax - 6, -HIP(), kn); const m = [ax - 6, pelY];
  const stopa = (u) => { const a = a01(u); const lift = Math.sin(Math.PI * Math.min(1, u * 1.25)) * 6; return tryb === 'bok' ? [ax, 7 + lift, lerp(zs, 40, a)] : [lerp(ax, 26, a), 7 + lift, lerp(zs, 28, a)]; };
  const fr = (u) => { const aR = stopa(u); const Sx = S(m, lean); const hipR = [m[0], m[1], HIP()]; const kneeDir = nrm([0.7, 0.1, 0.35]);
    return K({ u, m, p: lean, head: lean * 0.5, R: { a: aR, pod: u > 0.99 ? 0 : 0, rot: 10, odch: 6, pole: [kneeDir[0], kneeDir[1], kneeDir[2]] }, L: { a: aL, pod: 0, rot: 10, odch: 6, pole: [0.7, 0.1, -0.2] }, hr: { g: [Sx[0] + 26, Sx[1] - 16, 9], pole: [-0.3, -0.2, 1] }, hl: { g: [Sx[0] + 26, Sx[1] - 16, -9], pole: [-0.3, -0.2, -1] } }); };
  return zloz(cw, [PODLOGA(-80, 120), { rodzaj: 'guma', mocowanie: 'kostki' }], US.map(fr));
}

export function generuj() {
  return {
    'Hip Abduction': () => maszyna('Hip Abduction', { a0: 8, a1: 38 }),
    'Hip Adduction': () => maszyna('Hip Adduction', { a0: 38, a1: 8 }),
    'Cable Hip Abduction': () => wyciag('Cable Hip Abduction', { dir: 'abd' }),
    'Cable Hip Adduction': () => wyciag('Cable Hip Adduction', { dir: 'add' }),
    'Lateral Band Walk': () => krok('Lateral Band Walk', { tryb: 'bok' }),
    'Monster Walk': () => krok('Monster Walk', { tryb: 'potwor' }),
  };
}
