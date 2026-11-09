// Generator póz rodziny overhead_press po stronie agenta (26.10.2026): wyciskanie nad głowę (sztanga, hantle, kettlebell, guma, wyciągi; stojąc i siedząc), zza karku, push press, Arnold, see-saw, landmine, pompka w pozycji pike.
// Wyciskanie: dłonie od barków (≤ 20 cm nad barkiem, łokieć pod dłonią ≤ 10 cm) do wyprostu nad głową (łokieć ≤ 20°, dłoń ≥ 10 cm nad głową i ≤ 10 cm przed/za barkiem), tułów −15…10° od pionu.
// Push press: krótkie ugięcie kolan (15–60°) z tułowiem −15…20°, nogi pracują. Landmine: gryf sztywny wokół osi przy podłodze, łokieć ≥ 70° i ≤ 20° w ruchu.
// Błąd katalogu push.mis.partial (pike): płytki ruch. ohp.mis.lock i mis.jerk to cechy tempa, nie pozy (bledy: []).
import { dChwytu } from './model.mjs';
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, naLawce, buduj, wyc, U9, U12 } from './gora.mjs';

export const RODZINA = 'overhead_press';
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const sm = (t) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
const X0 = 12; const DY0 = 9; /* chwyt na dole względem barku (cm): przód, góra; szerokość chwytu zr patrz wyciskanie() */
const WOLNA = (S, sg) => ({ g: [S[0] + 3, S[1] - 46, sg * 23], pole: [0.2, -1, sg * 0.3] });
const sprzJ = (sprzet, s) => sprzet.map((g) => (s && ['hantel', 'wyciag', 'kettlebell'].includes(g.rodzaj) ? { ...g, trzyma: s } : g));


/** Łokieć pod chwytem (W1, recenzja r1 09.11.2026): dla dłoni h = [x, y, dz] względem barku (dz = |z| chwytu − |z| barku; y — wysokość nad barkiem) szuka położenia łokcia (kość ramienia i przedramię+dłoń z BODY), które
 * leży poniżej dłoni i ma najmniejsze odchylenie od niej w poziomie (x, z) — obrót punktu po okręgu wokół osi bark–dłoń, co 0,5°. Zwraca { m (odchylenie w poziomie, cm), E (łokieć względem barku) } albo null, gdy dłoń jest bliżej barku niż pozwala zgięcie łokcia silnika (149°) albo dalej niż zasięg.
 * Bez tego chwyt blisko barku kończył w walidatorze: albo łokieć > 149°, albo łokieć dalej niż 10 cm w poziomie od chwytu (reguła lokcie_pod_dlonmi). */
const LOK_MAX = 149;
export function lokiecPodChwytem(h) {
  const b = BODY(); const U = b.uarm; const L = b.farm + b.hand; const d = Math.hypot(h[0], h[1], h[2]); const dMin = dChwytu(LOK_MAX);
  if (d < dMin || d > U + L) return null;
  const a = (U * U - L * L + d * d) / (2 * d); const r = Math.sqrt(Math.max(0, U * U - a * a)); const ax = h.map((c) => c / d);
  const cr = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; const t = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let e1 = cr(ax, t); const n = Math.hypot(...e1); e1 = e1.map((c) => c / n); const e2 = cr(ax, e1); let m = Infinity; let E = null;
  for (let k = 0; k < 720; k++) { const ph = k * Math.PI / 360; const Ek = ax.map((c, i) => c * a + r * (Math.cos(ph) * e1[i] + Math.sin(ph) * e2[i]));
    if (Ek[1] > h[1]) continue; const o = Math.hypot(Ek[0] - h[0], Ek[2] - h[2]); if (o < m) { m = o; E = Ek; } }
  return E ? { m, E } : null;
}
/** Najmniejsze x chwytu (względem barku) na wysokości y, przy którym łokieć pod chwytem mieści się w m_max cm (zbiór dopuszczalnych x jest przedziałem). */
export function xMinPodLokciem(y, dz, mMax = 7.5) { for (let x = -4; x <= 40; x += 0.25) { const r = lokiecPodChwytem([x, y, dz]); if (r && r.m <= mMax) return x; } return null; }

/** Wyciskanie nad głowę. o: { zr (|z| chwytu), x0/dy0 (dłoń na dole względem barku), xTop, reach, pole, obrot (u → °), T (tułów {m,p,nogi,bend}), dod (sprzęt dodatkowy), sprzet, jedna ('R'/'L'), alt (see-saw), nad (przed głową: ruch x), us,
 * mLok (największy poziomy odstęp łokcia od chwytu w cm, domyślnie 7,5), odchyl (odchył tułowia w tył przy mijaniu twarzy — patrz niżej; domyślnie włączony, gdy tułów nie jest podparty ławką) }.
 * Odchył tułowia (W1-r2, recenzja 09.11.2026): łokieć pod chwytem (reguła ≤ 10 cm) wymusza przy twarzy chwyt ok. 22 cm przed barkami (xMinPodLokciem), ale ciężar ma iść w górę blisko twarzy: tułów odchyla się więc w tył o tyle, ile chwyt wychodzi przed barki
 * (bark cofa się, chwyt w świecie stoi w miejscu), a na górze wraca przed chwyt ("głowa przez okno"). Dla ruchu obu rąk w przeciwfazie (see-saw) odchył liczy się ze średniej obu rąk, więc każda ręka ma po ok. 4 cm odchylenia zamiast jednej 12. */
const ODCH_A = 2.5; /* cm: lekki wysuw chwytu w świecie przy mijaniu brody (o.odchA); na górze chwyt cofa się tak, by tułów wrócił do pionu (ramię nad głową ≤ limit zgięcia barku 171°) */
const dChwytuOdBarku = (e, o, sg) => { void sg; const zrr = typeof o.zr === 'function' ? o.zr(e) : (o.zr ?? 26); const dz = zrr - 19; return { zrr, dz }; };
function ruchReki(o, e, dopasuj) {
  const { zrr, dz } = dChwytuOdBarku(e, o);
  const yTop = Math.sqrt(Math.max(1, (o.reach ?? 63.4) ** 2 - (o.xTop ?? -2) ** 2 - dz * dz));
  const yy = lerp(o.dy0 ?? (dopasuj ? DY0 : 14), yTop, e); let hxRel = lerp(o.x0 ?? (dopasuj ? X0 : 22), o.xTop ?? 6, sm((yy - (o.ys ?? 48)) / (yTop - (o.ys ?? 45))));
  if (dopasuj) { const xm = xMinPodLokciem(yy, dz, o.mLok ?? 7.5); if (xm !== null) hxRel = Math.max(hxRel, xm + 0.25); }
  return { zrr, dz, yy, hxRel };
}
export function wyciskanie(cw, o) {
  const T = o.T ?? { m: [0, Y_STOJ], p: 0, nogi: nogiStoj(0, 14) };
  const dopasuj = o.fit !== false && !('pole' in o) && !('pdz' in o); /* W1: domyślny start przy przedniej części barków (x0/dy0 poniżej), tor chwytu nigdzie bliżej barku niż pozwala łokieć pod chwytem (xMinPodLokciem) */
  const odchyl = (o.odchyl ?? !o.T) && dopasuj; const eOf = (s, u) => { const e0 = o.alt && s === 'L' ? 1 - u : u; return o.rytm ? o.rytm(e0) : e0; };
  const prac = (s) => !o.jedna || o.jedna === s;
  const srednia = (f) => { const l = SIDES.filter(prac).map(f); return l.reduce((a, b) => a + b, 0) / l.length; };
  const rel0 = srednia((s) => ruchReki(o, eOf(s, 0), dopasuj).hxRel); const relK = srednia((s) => ruchReki(o, eOf(s, 1), dopasuj).hxRel);
  const delta = (e) => (o.odchA ?? ODCH_A) * Math.sin(Math.PI * Math.min(1, e / 0.8)) - (rel0 - relK) * sm(e);
  const fr = (u) => {
    const tu = o.tulowu ? o.tulowu(u) : {}; const m = tu.m ?? T.m; let p = tu.p ?? T.p ?? 0; const nogi = tu.nogi ?? T.nogi; const rece = {};
    let pOdch = 0; if (odchyl) { const przes = rel0 - srednia((s) => ruchReki(o, eOf(s, u), dopasuj).hxRel) + srednia((s) => delta(eOf(s, u))); pOdch = Math.asin(Math.max(-0.9, Math.min(0.9, przes / BODY().trunk))) / R; }
    p += pOdch;
    for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg);
      if (!prac(s)) { rece[s] = o.wolna ? o.wolna(S, sg) : WOLNA(S, sg); continue; }
      const e = eOf(s, u); const { zrr, dz, yy, hxRel } = ruchReki(o, e, dopasuj); const hy = S[1] + yy; const hx = S[0] + hxRel;
      const ob = typeof o.obrot === 'function' ? o.obrot(e) : o.obrot ?? 0; const gz = sg * zrr; const pdz = typeof o.pdz === 'function' ? o.pdz(e) : (o.pdz ?? 0);
      /* biegun łokcia: punkt pod chwytem (przedramię pionowo) — łokieć pod dłonią (ohp.elbowsUnder) */
      const ep = dopasuj ? lokiecPodChwytem([hx - S[0], yy, dz]) : null; /* biegun = kierunek łokcia o najmniejszym odchyleniu od chwytu */
      const pv = o.pole ? [o.pole[0], o.pole[1], o.pole[2] * sg] : ep ? [ep.E[0], ep.E[1], sg * ep.E[2]] : [hx - S[0] + (o.pdx ?? 0), hy - 33 - S[1], gz - sg * 19 + sg * pdz]; const pl = Math.hypot(...pv) || 1; const pole = pv.map((c) => r1(c / pl * 3) );
      rece[s] = { g: [hx, hy, gz], pole, obrot: ob }; }
    return poza({ u, tulow: { m, p, glowa: tu.glowa ?? (T.p ?? 0), bend: 0 }, nogi, rece }); };
  const sprz = o.jedna ? sprzJ(o.sprzet, o.jedna) : o.sprzet;
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), ...(o.dod ?? []), ...sprz], fr, us: o.us ?? (odchyl ? U12 : U9) });
}
/** Siedząc na ławce (kat oparcia) — tułów wg oparcia. */
function siedzac(kat = 85, top = 45) { const B = naLawce(kat, top, { zr: 24 }); return { T: { m: B.m, p: B.p, nogi: B.nogi }, lawka: { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, siedzisko: 40 } }; }


/** Landmine: gryf sztywny o długości L wokół osi P przy podłodze (przed osobą); dłonie (jedna lub obie, |z| = zh) na łuku od klatki do wyprostu przed sobą i w górę.
 * o: { jedna, zh, dip (głębokość ugięcia nóg na dole, cm), lean (pochylenie tułowia na dole, °), el1 (docelowe zgięcie łokcia na górze nie jest wpisywane — wynika z zasięgu) }. */
function landmine(cw, o) {
  const L = 200; /* jedna ręka: dłoń 2 cm od osi ciała, na końcu gryfu (rig rysuje gryf zawsze na osi z = 0, długość 20 cm w poprzek): przy 12 cm dłoń była 2 cm za końcem gryfu, a ślad (środek gryfu) 12 cm od chwytu (własna recenzja 09.11.2026) */
  const zh = o.zh ?? (o.jedna ? 2 : 6); const dz = zh - 19; const reach = o.reach ?? 63.4; const rIn = Math.sqrt(reach * reach - dz * dz);
  const S0 = bark([0, Y_STOJ], 0, 1); const H0x = S0[0] + (o.h0x ?? 16); const H0y = S0[1] + (o.h0y ?? -6);
  /* oś P: dłoń na dole H0 leży na sferze; wyznacz γ1 tak, by dłoń na górze miała odległość rIn od barku */
  const Py = 5; const g0 = Math.asin((H0y - Py) / L); const Px = H0x + L * Math.cos(g0); let lo = g0, hi = 1.45;
  const H1 = (g) => [Px - L * Math.cos(g), Py + L * Math.sin(g)]; const dist = (g) => { const h = H1(g); return Math.hypot(h[0] - S0[0], h[1] - S0[1]); };
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (dist(mid) < rIn) lo = mid; else hi = mid; } const g1 = (lo + hi) / 2;
  const dip = o.dip ?? 0; const lean = o.lean ?? 0;
  const nog = nogiStoj(o.stopaX ?? 0, 16);
  const fr = (u) => { const g = lerp(g0, g1, u); const h = H1(g); const k = o.dip ? Math.max(0, 1 - u / (o.dipDo ?? 0.55)) : 0; const m = [-0.3 * dip * k, Y_STOJ - dip * k]; const p = lean * k;
    const rece = {}; for (const s of SIDES) { const sg = POL(s); const S = bark(m, p, sg);
      if (o.jedna && o.jedna !== s) { rece[s] = WOLNA(S, sg); continue; }
      const gz = sg * zh; const pv = [h[0] - S[0], h[1] - 33 - S[1], gz - sg * 19]; const pl = Math.hypot(...pv) || 1; rece[s] = { g: [h[0], h[1], gz], pole: pv.map((c) => r1(c / pl * 3)), obrot: 0 }; }
    return poza({ u, tulow: { m, p, glowa: p, bend: 0 }, nogi: nog, rece }); };
  const lm = { rodzaj: 'landmine', x: r1(Px), y: Py, z: 0, dlugosc: L, trzyma: o.jedna ?? 'obie' };
  const sz = SPRZET.sztanga({ dlugosc: 20, talerze: false, ...(o.jedna ? { trzyma: o.jedna } : {}) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 300), lm, sz], fr, us: o.us ?? U12 });
}

/** Push press: ugięcie kolan (dip) przy dłoniach przy barkach, potem wyprost nóg i wyciskanie. */
function pushPress(cw, o) {
  const dip = o.dip ?? 9; const lean = o.lean ?? 10;
  const tulowu = (u) => { const d = u < 0.12 ? sm(u / 0.12) : u < 0.34 ? 1 - sm((u - 0.12) / 0.22) : 0; return { m: [-BODY().trunk * Math.sin(lean * d * R), Y_STOJ - dip * d], p: lean * d, glowa: lean * d }; }; /* bark nie przesuwa się w poziomie w ugięciu (biodra cofają się o tyle, o ile tułów pochyla się do przodu): sztanga w ugięciu idzie pionowo (N3/W1-r2: dawne 3 zawrócenia toru) */
  const rytm = (u) => (u < 0.2 ? 0 : sm((u - 0.2) / 0.8));
  return wyciskanie(cw, { ...o, tulowu, rytm, us: o.us ?? [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.38, 0.48, 0.6, 0.72, 0.85, 1] });
}


/** Pike push-up: stopy płasko na podłodze (kostka A), nogi proste (80 cm miednica–kostka), dłonie na podłodze w x = hx; łokieć θ(u) wyznacza odległość bark–dłoń, kierunek φ barku względem dłoni; miednica = przecięcie okręgów (A, 80) i (bark, tułów 50), wyżej. */
function pike(cw, o = {}) {
  const A = [0, BODY().ankleH]; const hx = o.hx ?? 66; const hy = 2; const T = BODY().trunk; const Lg = 82.2;
  const thTop = o.thTop ?? 15, thDol = o.thDol ?? 115, thPlytko = o.thPlytko ?? 68; const phiTop = o.phiTop ?? 100, phiDol = o.phiDol ?? 90;
  const fr = (u, zle) => { const th = lerp(thTop, zle ? thPlytko : thDol, u); const phi = lerp(phiTop, zle ? lerp(phiTop, phiDol, 0.95) : phiDol, u);
    const d = Math.sqrt(Math.max(1, dChwytu(th) ** 2)); const S = [hx + d * Math.cos(phi * R), hy + d * Math.sin(phi * R)];
    const dx = S[0] - A[0], dy = S[1] - A[1]; const D = Math.hypot(dx, dy); const a = (Lg * Lg - T * T + D * D) / (2 * D); const h = Math.sqrt(Math.max(0, Lg * Lg - a * a));
    const c = [A[0] + a * dx / D, A[1] + a * dy / D]; const c1 = [c[0] - h * dy / D, c[1] + h * dx / D], c2 = [c[0] + h * dy / D, c[1] - h * dx / D]; const P = c1[1] > c2[1] ? c1 : c2;
    const p = Math.atan2(S[0] - P[0], S[1] - P[1]) / R; const rece = {}; for (const sd of SIDES) { const sg = POL(sd); rece[sd] = { g: [hx, hy, sg * 19], pole: [-1, -0.3, 0.9 * sg], obrot: 0 }; }
    const nog = (sd) => ({ k: [0, A[1] + (o.heel ?? 0), POL(sd) * 10], pod: o.pod ?? 0, rot: 0, pole: [1, 0.2, POL(sd) * 0.1] });
    return poza({ u, tulow: { m: [r1(P[0]), r1(P[1])], p, glowa: p * 0.95 }, nogi: { R: nog('R'), L: nog('L') }, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-60, 200)], fr, us: o.us ?? U9, blad: { cue: 'push.mis.partial', postawa: false, znacznik: 'pelvis' } });
}

export const WYJATKI = {
  'Bradford Press': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; figury-sens.json → overhead_press.otwarte); wstrzymane do czasu źródła',
  'Handstand Push Up': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”, nie badane; figury-sens.json → overhead_press.otwarte); wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {};

/** Arnold Press (recenzja ruchu 27.10.2026): start — ciężary przed twarzą/klatką, dłonie do siebie (supinacja), łokcie przed klatką blisko siebie (chwyt |z| 12); w trakcie łokcie rozchodzą się na boki (pdz > 0), a przedramię obraca się do nachwytu; na górze chwyt jak w zwykłym wyciskaniu. */
const ARNOLD = { x0: 22, dy0: 14, zr: (e) => lerp(12, 24, sm(e / 0.85)), pdz: (e) => 26 * Math.sin(Math.PI * Math.min(1, e / 0.85)) ** 1.2, obrot: (e) => lerp(80, -75, sm(e / 0.7)) };

/** Hantle w wyciskaniu: chwyt nachwytem (dłonie do przodu) — obrót przedramienia −80° (granica zakresu; 0 = młotkowy): oś hantla stale w poprzek ciała (recenzja własna 09.11.2026: przy 0 oś skakała z przodu–tyłu w poprzek i z powrotem w trakcie ruchu). */
const HW = -80;

export function generuj() {
  const G = {}; const B = SPRZET.sztanga(); const H = SPRZET.hantle(); const KB = (x = {}) => ({ rodzaj: 'kettlebell', dzwon: 'tyl', ...x });
  /* Kettlebell w racku (W2-r2, recenzja 09.11.2026): łokieć jak najbliżej żeber przy dzwonie 'tyl' (jedyny tryb dzwonu wokół rączki w silniku): dzwon za rączką przenika ramię, gdy rączka jest bliżej tułowia albo bliżej osi barku w z — przeszukanie siatki
   * (zr 20–36, dy0 0–15, x0 8–18): poprawne (walidator geometrii 0,3 cm) są tylko starty z rączką 16,9 cm przed barkiem, 9 cm nad nim i |z| 30 (11 cm na zewnątrz od stawu barkowego); łokieć ok. 16 cm przed barkiem, zgięcie barku ok. 35° (było 52°, łokieć 23 cm przed).
   * Chwyt schodzi do |z| 26 do końca ruchu (nad głową tak samo jak w pozostałych wyciskaniach). */
  const KB_DOL = { x0: 16.9, dy0: 9, zr: (e) => lerp(30, 26, sm(e / 0.35)) };
  const RACK = { rodzaj: 'slupek', x: -45, h: 210, hak: 140 };
  G['Overhead Press (sztanga)'] = () => wyciskanie('Overhead Press (sztanga)', { sprzet: [B] });
  G['Overhead Press (hantle)'] = () => wyciskanie('Overhead Press (hantle)', { sprzet: [H], obrot: HW });
  G['Band Shoulder Press'] = () => wyciskanie('Band Shoulder Press', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy', trzyma: 'obie' }] });
  G['Double Kettlebell Press'] = () => wyciskanie('Double Kettlebell Press', { sprzet: [KB({ trzyma: 'R' }), KB({ trzyma: 'L' })], ...KB_DOL });
  G['Kettlebell Press'] = () => wyciskanie('Kettlebell Press', { sprzet: [KB()], jedna: 'R', ...KB_DOL });
  G['Single Arm Overhead Press (hantel)'] = () => wyciskanie('Single Arm Overhead Press (hantel)', { sprzet: [H], jedna: 'R', obrot: HW });
  G['See-Saw Press (Alternating Side Press)'] = () => wyciskanie('See-Saw Press (Alternating Side Press)', { sprzet: [{ ...H, trzyma: 'R' }, { ...H, trzyma: 'L' }], alt: true, us: U12, obrot: HW, odchA: 1 });
  G['Arnold Press'] = () => wyciskanie('Arnold Press', { sprzet: [H], ...ARNOLD });
  G['Kettlebell Arnold Press'] = () => wyciskanie('Kettlebell Arnold Press', { sprzet: [KB()], jedna: 'R', ...ARNOLD, zr: (e) => lerp(16, 24, sm(e / 0.85)) });
  const sd = siedzac(85, 45);
  G['Seated Shoulder Press (hantle)'] = () => wyciskanie('Seated Shoulder Press (hantle)', { T: sd.T, dod: [sd.lawka], sprzet: [H], obrot: HW });
  G['Kettlebell Seated Press'] = () => wyciskanie('Kettlebell Seated Press', { T: sd.T, dod: [sd.lawka], sprzet: [KB()], jedna: 'R', ...KB_DOL });
  G['Seated Barbell Military Press'] = () => wyciskanie('Seated Barbell Military Press', { T: sd.T, dod: [sd.lawka, RACK], sprzet: [B] });
  G['Seated Cable Shoulder Press'] = () => wyciskanie('Seated Cable Shoulder Press', { T: sd.T, dod: [sd.lawka], sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -25, y: 15, z: 90, h: 100 })] });
  G['Wyciskanie nad głowę (linki)'] = () => wyciskanie('Wyciskanie nad głowę (linki)', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -25, y: 15, z: 90, h: 100 })] });
  /* zza karku: chwyt szeroki, sztanga za głową */
  G['Standing Barbell Press Behind Neck'] = () => wyciskanie('Standing Barbell Press Behind Neck', { dod: [RACK], sprzet: [B], zr: 46, fit: false, x0: -13, dy0: 8, xTop: -9, ys: 40 });
  G['Push Press'] = () => pushPress('Push Press', { sprzet: [B] });
  G['Push Press - Behind the Neck'] = () => pushPress('Push Press - Behind the Neck', { dod: [RACK], sprzet: [B], zr: 46, fit: false, x0: -13, dy0: 8, xTop: -9, ys: 40 });
  G['Landmine Press'] = () => landmine('Landmine Press', {});
  G['Landmine Linear Jammer'] = () => landmine('Landmine Linear Jammer', { dip: 14, lean: 12 });
  G['Single-Arm Linear Jammer'] = () => landmine('Single-Arm Linear Jammer', { jedna: 'R', dip: 14, lean: 12, h0x: 22, h0y: -4 });
  G['Pike Push Up'] = () => pike('Pike Push Up');
  return G;
}
