// Generator póz rodziny core_standing po stronie agenta (wersja 1.1, 26.10.2026): brzuch i skos w staniu, siedzeniu i na piłce — skłony boczne, skręty, wiatrak, Pallof, wyciąg po skosie (woodchop, judo flip), landmine.
// Pozy WYLICZONE z modelu: układ klatki piersiowej z silnika (trunkAxes: skłon boczny, skręt, obrót), chwyty rąk wyrażone w tym układzie (ciężar podąża za klatką), miednica i nogi nieruchome (nogi z hipY).
// Błędów katalogu rodzina nie ma (mis.jerk to tempo, bez animacji): bledy: [].
import { v2, BODY, R, r1, lerp, ease, HIP, K, poza, PODLOGA, hipY, klatkaPiersiowa, kolano2D } from './dol.mjs';

export const RODZINA = 'core_standing';
const US = [0, 0.25, 0.5, 0.75, 1];
const a01 = ease;
export const WYJATKI = {
  'Seated Barbell Twist': 'sztanga w modelu leży zawsze wzdłuż osi z (dłonie na jej osi, ±0,6 cm), a skręt tułowia ze sztangą na plecach obraca sztangę wokół osi pionowej — sprzęt „sztanga” nie ma obrotu w poziomie, więc chwyt zeszłby z osi sztangi',
};
export const PRZYBLIZENIA = {};
const D = 63.4;
const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
const sub = (a, b) => a.map((x, i) => x - b[i]);

/** Stanie: kostki (0, 7, ±zs), miednica nad nimi (hipY, zgięcie kolan k). Zwraca { m, R, L } do K. */
function stanie(zs = 12, k = 4, rot = 10) {
  const aL = [0, 7, -zs]; const y = hipY(aL, 0, -HIP(), k); const m = [0, y];
  return { m, R: { a: [0, 7, zs], pod: 0, rot, pole: [0.15, 0.2, 0.1] }, L: { a: aL, pod: 0, rot, pole: [0.15, 0.2, -0.1] } };
}
/** Chwyt z odległością: ręka od barku S do punktu g (z dowolnym kierunkiem) skrócona do długości ramienia D, jeśli trzeba. */
const nieDalej = (S, g, d = D) => { const v = sub(g, S); const l = Math.hypot(...v); if (l <= d) return g; return S.map((x, i) => x + v[i] * d / l); };
const rekaWisi = (S, z, d = D) => { const dz = z - S[2]; const ly = Math.sqrt(Math.max(1, d * d - dz * dz)); return [S[0], S[1] - ly, z]; };
const biodro = (st, sg) => ({ g: [st.m[0] + 2, st.m[1] + 2, sg * (HIP() + 11)], pole: [0, -0.3, sg] });
const sprzetBaza = () => [PODLOGA(-130, 150)];

/** Pozy z funkcji klatek: fr(u) → klatka kontraktu. */
const zloz = (cw, sprzet, fr, us = US) => poza(RODZINA, cw, sprzet, us.map(fr), []);

/* ================= skłony boczne ================= */
/** Skłon boczny w staniu z hantlem w prawej ręce (zwisa pionowo), skłon w prawo (w stronę ciężaru). */
function sklonHantel(cw, o = {}) {
  const { lean1 = 28, kettlebell = false } = o; const st = stanie(14);
  const fr = (u) => { const lean = lean1 * a01(u); const c = klatkaPiersiowa(st.m, 0, { lean }); const sR = c.sh(1);
    const g = rekaWisi(sR, 27); return K({ u, m: st.m, p: 0, head: 0, lean, R: st.R, L: st.L, hr: { g, pole: [0, 0, 1] }, hl: biodro(st, -1) }); };
  return zloz(cw, [...sprzetBaza(), kettlebell ? { rodzaj: 'kettlebell', trzyma: 'R', dzwon: 'dol' } : { rodzaj: 'hantel', trzyma: 'R' }], fr);
}
/** Skłon boczny ze sztangą na barkach (chwyt szeroko), skłon w prawo. */
function sklonSztanga(cw) {
  const st = stanie(14);
  const fr = (u) => { const lean = 28 * a01(u); const c = klatkaPiersiowa(st.m, 0, { lean }); const y0 = c.pt(2, -12.8, 0)[1]; const g = (sg) => { const q = c.pt(2, -12.8, sg * 32); return { g: [q[0], y0, q[2]], pole: [-0.7, -1, sg * 0.5] }; }; /* sztanga pozostaje pozioma (chwyt ±0,6 cm od osi), tułów się pochyla */
    return K({ u, m: st.m, p: 0, head: 0, lean, R: st.R, L: st.L, hr: g(1), hl: g(-1) }); };
  return zloz(cw, [...sprzetBaza(), { rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }], fr);
}
/** Skłon boczny jednorącz przy wysokim wyciągu: prawa ręka trzyma uchwyt nad głową (ramię wzdłuż osi tułowia), skłon w lewo (od kolumny). */
function sklonWyciag(cw) {
  const st = stanie(14);
  const fr = (u) => { const lean = -26 * a01(u); const c = klatkaPiersiowa(st.m, 0, { lean }); const g = nieDalej(c.sh(1), c.pt(61, 16, 19)); return K({ u, m: st.m, p: 0, head: 0, lean, R: st.R, L: st.L, hr: { g, pole: [0.1, 0.3, 1] }, hl: biodro(st, -1) }); };
  return zloz(cw, [...sprzetBaza(), { rodzaj: 'wyciag', x: 0, y: 210, z: 52, chwyt: 'uchwyt', trzyma: 'R' }], fr);
}

/** Siad na piłce gimnastycznej (promień 32,5): miednica na szczycie, stopy na podłodze. */
function siadPilka() {
  const m = [0, 64.5]; const ak = (sg) => ({ a: [40, 7, sg * 28], pod: 0, rot: 10, pole: [0.8, 0.3, sg * 0.7] }); /* piłka 55 cm (promień 27,5), kolana szeroko po bokach */
  return { m, R: ak(1), L: ak(-1), sprzet: [{ rodzaj: 'pilka_gimnastyczna', x: 0, promien: 27.5 }] };
}
/** Skłon boczny na piłce z hantlem w prawej ręce, skłon w prawo. */
function sklonPilka(cw) {
  const st = siadPilka();
  const fr = (u) => { const lean = 26 * a01(u); const c = klatkaPiersiowa(st.m, 0, { lean }); const g = rekaWisi(c.sh(1), 31);
    return K({ u, m: st.m, p: 0, head: 0, lean, R: st.R, L: st.L, hr: { g, pole: [0, 0, 1] }, hl: { g: [st.m[0] + 2, st.m[1] + 4, -(HIP() + 11)], pole: [0, -0.3, -1] } }); };
  return zloz(cw, [PODLOGA(-80, 120), ...st.sprzet, { rodzaj: 'hantel', trzyma: 'R' }], fr);
}
/** Cable crunch na półkuli balansowej ze skłonem bocznym: siad na półkuli (promień 30), dłonie przy głowie z linkami od niskich bloczków za plecami; zgięcie do przodu i skłon w prawo. */
function bosuCrunch(cw) {
  const m = [0, 41]; const ak = (sg) => ({ a: [36, 7, sg * 16], pod: 0, rot: 10, pole: [1, 0.4, sg * 0.1] });
  const fr = (u) => { const a = a01(u); const p = lerp(-8, 24, a), lean = 24 * a; const c = klatkaPiersiowa(m, p, { lean });
    const g = (sg) => ({ g: c.pt(21, -6, sg * 16), pole: [0, 0, sg] }); return K({ u, m, p, head: p * 0.5, lean, R: ak(1), L: ak(-1), hr: g(1), hl: g(-1) }); };
  return zloz(cw, [PODLOGA(-110, 100), { rodzaj: 'bosu', x: 0, z: 0 }, { rodzaj: 'wyciag', dwa: true, x: -85, y: 25, z: 55, chwyt: 'uchwyt' }], fr);
}

/* ================= skręty ================= */
/** Skręt w obie strony: twist od −t do +t. ramiona: funkcja (c, u) → { hr, hl } w układzie klatki. */
function skret(cw, { m, nogi, p = 0, bend = 0, t = 36, rece, sprzet }) {
  const fr = (u) => { const tw = lerp(-t, t, a01(u)); const c = klatkaPiersiowa(m, p, { twist: tw, bend }); const g = rece(c, u);
    return K({ u, m, p, bend, head: p * 0.5, twist: tw, R: nogi.R, L: nogi.L, hr: g.hr, hl: g.hl }); };
  return zloz(cw, sprzet, fr);
}
const rekiPrzed = (a, b, rozst = 3, pole = [0.2, -0.6, 0]) => (c) => ({ hr: { g: c.pt(a, b, rozst), pole: [pole[0], pole[1], 1] }, hl: { g: c.pt(a, b, -rozst), pole: [pole[0], pole[1], -1] } });

function russianTwist(cw) {
  const m = [0, 9.5]; const p = -45; const ak = (sg) => ({ a: [34, 7, sg * 12], pod: 0, rot: 10, pole: [0.2, 1, sg * 0.1] });
  return skret(cw, { m, nogi: { R: ak(1), L: ak(-1) }, p, t: 38, rece: rekiPrzed(-10, 30), sprzet: [PODLOGA(-110, 110)] });
}
function skretSztanga(cw) {
  const top = 46; const m = [0, top + 11.8]; const ak = (sg) => ({ a: [40, 7, sg * 10], pod: 0, rot: 10, pole: [1, 0.4, sg * 0.05] });
  const fr = (u) => { const tw = lerp(-36, 36, a01(u)); const c = klatkaPiersiowa(m, 0, { twist: tw }); const g = (sg) => ({ g: c.pt(2, -12.8, sg * 32), pole: [-0.7, -1, sg * 0.5] });
    return K({ u, m, p: 0, head: 0, twist: tw, R: ak(1), L: ak(-1), hr: g(1), hl: g(-1) }); };
  return zloz(cw, [PODLOGA(-120, 140), { rodzaj: 'skrzynia', x0: -30, x1: 8, top }, { rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }], fr);
}
function skretPilkaLekarska(cw) {
  const st = stanie(16, 8);
  return skret(cw, { m: st.m, nogi: { R: st.R, L: st.L }, t: 40, rece: (c) => ({ hr: { g: c.pt(-10, 24, 11), pole: [-0.2, -1, 0.6] }, hl: { g: c.pt(-10, 24, -11), pole: [-0.2, -1, -0.6] } }), sprzet: [PODLOGA(-110, 110), { rodzaj: 'pilka_lekarska' }] });
}
function cableRussianTwist(cw) {
  const st = siadPilka();
  return skret(cw, { m: st.m, nogi: { R: st.R, L: st.L }, t: 36, rece: rekiPrzed(-8, 30, 3), sprzet: [PODLOGA(-110, 140), ...st.sprzet, { rodzaj: 'wyciag', x: 60, y: 110, z: 85, chwyt: 'uchwyt', trzyma: 'obie' }] });
}

/* ================= Pallof ================= */
function pallof(cw, { rot = false }) {
  const st = stanie(16, 10); const m = st.m;
  const fr = (u) => { const a = a01(u); const tw = rot ? -30 * a : 0; const c = klatkaPiersiowa(m, 0, { twist: tw }); const b = lerp(16, 58, a); const lok = (sg) => ({ g: c.pt(-22, b, sg * 3), pole: [0, -1, sg * 0.5] });
    return K({ u, m, p: 0, head: 0, twist: rot ? tw : undefined, R: st.R, L: st.L, hr: lok(1), hl: lok(-1) }); };
  return zloz(cw, [PODLOGA(-100, 140), { rodzaj: 'wyciag', x: 36, y: 118, z: 75, chwyt: 'uchwyt', trzyma: 'obie' }], fr);
}

/* ================= skręt jednostronny: woodchop, judo flip, landmine ================= */
function woodchop(cw, { odGory = true, y = 190 }) {
  const st = stanie(18, 8);
  const fr = (u) => { const a = a01(u); const tw = odGory ? lerp(28, -30, a) : lerp(-28, 30, a); const p = lerp(0, odGory ? 18 : -2, a); const c = klatkaPiersiowa(st.m, p, { twist: tw });
    const aa = odGory ? lerp(8, -42, a) : lerp(-40, 14, a); const g = (sg) => ({ g: c.pt(aa, 36, sg * 3), pole: [0, -0.6, sg * 0.5] }); void sg0;
    return K({ u, m: st.m, p, head: p * 0.5, twist: tw, R: st.R, L: st.L, hr: g(1), hl: g(-1) }); };
  return zloz(cw, [PODLOGA(-100, 140), { rodzaj: 'wyciag', x: odGory ? 42 : 110, y, z: odGory ? 90 : -70, chwyt: 'lina', trzyma: 'obie' }], fr);
}
const sg0 = 0;
function landmine(cw) {
  const st = stanie(18, 8); const x0 = 30; const P = [x0 + 176, 5, 0];
  const fr = (u) => { const tw = lerp(-32, 32, a01(u)); const c = klatkaPiersiowa(st.m, 0, { twist: tw }); const y = P[1] + Math.sqrt(200 * 200 - (x0 - P[0]) ** 2 - 0); const zc = c.pt(-4, 32, 0)[2]; /* gryf sztywny: chwyt na sferze wokół osi obrotu, x stały */
    const g = (sg) => ({ g: [x0, y, zc + sg * 3], pole: [0, -0.6, sg * 0.5] }); return K({ u, m: st.m, p: 0, head: 0, twist: tw, R: st.R, L: st.L, hr: g(1), hl: g(-1) }); };
  return zloz(cw, [PODLOGA(-100, 240), { rodzaj: 'landmine', x: P[0], y: P[1], z: 0, dlugosc: 200 }, { rodzaj: 'sztanga', podazaZaChwytem: true, talerze: false, dlugosc: 40 }], fr);
}

/* ================= wiatrak i bent press ================= */
function wiatrak(cw, { lean1 = -34, podwojny = false, hantel = false, zs = 22 }) {
  const st = stanie(zs, 4, 30);
  const fr = (u) => { const lean = lean1 * a01(u); const c = klatkaPiersiowa(st.m, 0, { lean }); const sR = c.sh(1), sL = c.sh(-1);
    const gR = [sR[0] + 14, sR[1] + Math.sqrt(63.7 ** 2 - 14 * 14), sR[2]]; const hl = rekaWisi(sL, sL[2] - (podwojny ? 12 : 2), 56);
    return K({ u, m: st.m, p: 0, head: 0, lean, R: st.R, L: st.L, hr: { g: gR, pole: [0.2, 0, 1] }, hl: { g: hl, pole: [0, 0, -1] } }); };
  const sprzet = [PODLOGA(-110, 120)];
  if (hantel) sprzet.push({ rodzaj: 'hantel', trzyma: 'R' }); else sprzet.push({ rodzaj: 'kettlebell', trzyma: 'R', dzwon: 'tyl' });
  if (podwojny) sprzet.push({ rodzaj: 'kettlebell', trzyma: 'L', dzwon: 'dol' });
  return zloz(cw, sprzet, fr);
}

export function generuj() {
  return {
    'Barbell Side Bend': () => sklonSztanga('Barbell Side Bend'),
    'Side Bend (hantel)': () => sklonHantel('Side Bend (hantel)'),
    'One-Arm High-Pulley Cable Side Bends': () => sklonWyciag('One-Arm High-Pulley Cable Side Bends'),
    'Weighted Ball Side Bend': () => sklonPilka('Weighted Ball Side Bend'),
    'Bosu Ball Cable Crunch With Side Bends': () => bosuCrunch('Bosu Ball Cable Crunch With Side Bends'),
    'Russian Twist': () => russianTwist('Russian Twist'),
    'Medicine Ball Full Twist': () => skretPilkaLekarska('Medicine Ball Full Twist'),
    'Cable Russian Twists': () => cableRussianTwist('Cable Russian Twists'),
    'Pallof Press': () => pallof('Pallof Press', { rot: false }),
    'Pallof Press With Rotation': () => pallof('Pallof Press With Rotation', { rot: true }),
    'Cable Woodchop': () => woodchop('Cable Woodchop', { odGory: true, y: 190 }),
    'Cable Judo Flip': () => woodchop('Cable Judo Flip', { odGory: false, y: 55 }),
    'Landmine Rotation': () => landmine('Landmine Rotation'),
    'Kettlebell Windmill': () => wiatrak('Kettlebell Windmill', {}),
    'Double Kettlebell Windmill': () => wiatrak('Double Kettlebell Windmill', { podwojny: true }),
    'Bent Press': () => wiatrak('Bent Press', { lean1: -30, hantel: true, zs: 16 }),
  };
}
