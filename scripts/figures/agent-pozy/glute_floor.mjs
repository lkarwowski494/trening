// Generator póz rodziny glute_floor po stronie agenta (wersja 1.1, 26.10.2026): ćwiczenia pośladków i bioder z małym ruchem nogi — klęk podparty (donkey kick, fire hydrant),
// leżenie bokiem (clamshell), stanie przy wyciągu / z gumą / na maszynie (kickback), leżenie przodem na ławce (flutter kicks).
// Pozy WYLICZONE z modelu: noga z FK w 3D (kierunki uda i goleni → kolano i kostka, biegun kolana z położenia kolana), biodra wg kontraktu poza@2 (przechył miednicy, obrót ciała 90° przy leżeniu bokiem).
// Błędy z cue: hext.mis.arch (przeprost lędźwi, grupa plecy) i hab.mis.high (miednica ucieka: przechył albo skręt, grupa miednica) — każdy łamie tylko swoją grupę reguł.
import { v2, BODY, R, r1, lerp, ease, HIP, SH, K, poza, PODLOGA, hipY, dNogi, bledyZOpisem, bladZTrajektorii, delta, dodajDotyczy, tp, S } from './dol.mjs';
import { bokKlatka, bokSonda, bokDolnaReka, bokNogiUlozone } from './mob.mjs';

export const RODZINA = 'glute_floor';
const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };
/** Noga z FK w 3D: biodro, kierunek uda d, kierunek goleni e (wektory dowolnej długości). Zwraca kolano, kostkę i biegun kolana. */
function fk3(hip, d, e) {
  const b = BODY(); const dn = nrm(d), en = nrm(e); const knee = hip.map((v, i) => v + b.thigh * dn[i]); const ankle = knee.map((v, i) => v + b.shank * en[i]);
  return { knee, ankle, pole: poleKolana(hip, ankle, knee) };
}
const rotX = (v, a) => { const c = Math.cos(a * R), s = Math.sin(a * R); return [v[0], v[1] * c + v[2] * s, -v[1] * s + v[2] * c]; }; /* obrót wokół osi x: dół (0,−1,0) → bok (0,−cos,sin) */
const a01 = (u) => ease(u);
const US = [0, 0.25, 0.5, 0.75, 1];
const UCHWYT_MASZYNY_Z = 15; /* połowa rozstawu uchwytów maszyny (cm): dolna granica kontraktu dla poręczy */
export const PRZYBLIZENIA = {
  'Hip Extension with Bands': 'przybliżenie: guma w pętli na kostkach (model gumy nie ma zaczepu do kostki), opór rośnie, gdy kostka ucieka do tyłu; ręce na biodrach',
  'Machine Glute Kickback': 'przybliżenie: maszyna schematyczna — uchwyty rysowane jako dwie równoległe poręcze przed klatką (dłonie na nich), bez oparcia klatki i poduszki; dźwignia obraca się wokół biodra i prowadzi kostkę',
  'Clamshell': 'przybliżenie: leżenie na lewym boku jak w rozciąganiu na boku (obrót tułowia −75°, nie −90°: dolny bark nie wchodzi pod podłogę; w widoku z boku odchylenia nie widać, w widoku z przodu tak); głowa na dłoni dolnej ręki; stopa górna idzie za goleniem (podbicie do 30° przy unoszeniu kolana), obie stopy palcami w stronę kolan; zgięcie bioder do przodu (od kamery) jest skrócone w widoku z boku; odwodzenie widać jako uniesienie górnego kolana',
  'Prone Flutter Kicks': 'przybliżenie: nogi poza końcem ławki (ławka płaska), ruch naprzemienny pokazują dwie fazy skrajne',
};
/** Składanie pozy: błędy bez opisu w pl.json odpadają (z powodem w PRZYBLIZENIA), `dod` = etykiety `dotyczy` dla pól spoza delta() (skręt, przechył). */
function zloz(cw, sprzet, klatki, bledy) { const b = bledyZOpisem(cw, bledy, PRZYBLIZENIA); const p = poza(RODZINA, cw, sprzet, klatki, b); for (const x of b) if (x.dod) dodajDotyczy(p, x.cue, ...x.dod); return p; }

/* ---------- klęk podparty (jak Bird Dog): ręce pod barkami, kolana pod biodrami ---------- */
function czworak() {
  const B = BODY(); const hx = 60; const Sy = 63.5; const Py = 8.8 + B.thigh; const phi = Math.asin((Sy - Py) / B.trunk) / R;
  return { P: [hx - B.trunk * Math.cos(phi * R), Py], p: 90 - phi, hx, Sy };
}
const kleczacaPodpora = (P, strona) => { /* noga podporowa: udo pionowo w dół, goleń na podłodze do tyłu (jak w klęku podpartym) */
  const sg = strona === 'R' ? 1 : -1; const hip = [P[0], P[1], sg * HIP()]; const f = fk3(hip, [0, -1, 0], [Math.cos(165 * R), Math.sin(165 * R), 0]);
  return { a: [f.ankle[0], f.ankle[1], sg * 10], pod: -90, rot: 10, pole: [f.pole[0], f.pole[1], sg * 0.1] };
};
function czworakRamka({ u, noga, bend = 0, tilt }) { /* noga robocza: prawa; noga: { d, e } kierunki uda i goleni */
  const { P, p, hx } = czworak(); const hipR = [P[0], P[1], HIP()]; const f = fk3(hipR, noga.d, noga.e);
  const hr = { g: [hx, 2, 19], pole: [-0.5, -1, 0.3] }, hl = { g: [hx, 2, -19], pole: [-0.5, -1, -0.3] };
  return K({ u, m: P, p, bend, head: p, R: { a: f.ankle, pod: noga.pod ?? null, rot: noga.rot ?? 10, pole: f.pole }, L: kleczacaPodpora(P, 'L'), hr, hl, tilt });
}

/** Donkey Kick: noga ugięta w kolanie 90° unosi się do tyłu (udo do poziomu tułowia, biodro prawie 0°), podeszwa do sufitu. */
function donkey(cw, o = {}) {
  const { tGora = 200, kGora = 90 } = o; const nogaU = (u) => { const a = a01(u); const t = lerp(270, tGora, a), k = lerp(105, kGora, a); const d = [Math.cos(t * R), Math.sin(t * R), 0]; const sd = t - k; return { d, e: [Math.cos(sd * R), Math.sin(sd * R), 0] }; };
  const ok = (u) => czworakRamka({ u, noga: nogaU(u) }); const zle = (u) => czworakRamka({ u, noga: nogaU(u), bend: -32 * a01(u) });
  const bl = bladZTrajektorii({ cue: 'hext.mis.arch', znacznik: 'back', us: US, ok, zle });
  return zloz(cw, [PODLOGA(-120, 120)], US.map(ok), [bl]);
}

/** Podbicie i rotacja stopy strony R dla kierunku pięta → palce w (wektor jednostkowy świata): kontrakt opisuje kierunek jako (cos p cos r, sin p, cos p sin r); p ∈ [−90, 270] (91…270 = palce do tyłu), r ∈ [−90, 90]. */
function stopaZKierunku(w) {
  const wy = Math.max(-1, Math.min(1, w[1])); const c = (w[0] < 0 ? -1 : 1) * Math.sqrt(1 - wy * wy) || 1e-9; let p = Math.atan2(wy, c) / R; if (p < -90) p += 360;
  return { pod: r1(p), rot: r1(Math.atan2(w[2] / c, w[0] / c) / R) };
}
/** Fire Hydrant: udo odwodzi się bokiem (kolano w górę i na zewnątrz), kolano zgięte 90°, miednica nieruchoma. Stopa idzie za goleniem (R11: oś stopy w płaszczyźnie biodro–kolano–kostka): kierunek stopy z klatki u = 0 obracany razem z nogą wokół osi x. */
function hydrant(cw, o = {}) {
  const { alfa = 55 } = o; const nogaU = (u) => { const a = alfa * a01(u); return { d: rotX([0, -1, 0], a), e: rotX([Math.cos(165 * R), Math.sin(165 * R), 0], a) }; };
  const E = v2(); const f0 = (() => { const k = czworakRamka({ u: 0, noga: nogaU(0) }); const sk = E.keyframeFrame({ kontrakt: E.CONTRACT.id, rodzina: RODZINA, cwiczenie: cw, sprzet: [PODLOGA(-120, 120)], klatki: [k, { ...k, u: 1 }], bledy: [] }, 0).sk.legs.R; const v = nrm(sk.toe.map((x, i) => x - sk.heel[i])); return v; })();
  const stopa = (u) => stopaZKierunku(rotX(f0, alfa * a01(u)));
  const ok = (u) => czworakRamka({ u, noga: { ...nogaU(u), ...stopa(u) } }); const zle = (u) => czworakRamka({ u, noga: { ...nogaU(u), ...stopa(u) }, tilt: 12 * a01(u) });
  const bl = bladZTrajektorii({ cue: 'hab.mis.high', znacznik: 'pelvis', us: US, ok, zle });
  /* delta przechyłu miednicy (pole poza@2) nie jest liczona przez delta(): dopisana ręcznie */
  bl.klatki = US.map((u) => (u === 0 ? { u: 0 } : { u, przechylMiednicy: r1(12 * a01(u)) }));
  bl.dod = ['pelvis']; return zloz(cw, [PODLOGA(-120, 120)], US.map(ok), [bl]);
}

/* ---------- leżenie bokiem (clamshell): LEWY bok na podłodze, klatka ku −z (od kamery), głowa ku −x; górna noga R po stronie kamery ----------
 * Jak Side-Lying Quad (mob.mjs BOK): obrys tułowia i spodenek ≤ 2 cm nad podłogą, dolna ręka leży pod głową (głowa podparta), dolna noga ugięta (biodro ≈ 45°, kolano ≈ 90°) leży na podłodze. Górna noga: kolano unosi się o 45° ku górze i przodowi, stopy razem. */
export const LEZY_BOK_UWAGA = 'leżenie na lewym boku (jak w mobilności, backlog figur 28.10.2026: poprzednia poza wisiała 4–8 cm nad podłogą i miała głowę bez podparcia)';
const BLAD_SKRET = 25, BLAD_KOLANO = 40; /* błąd Clamshell: skręt tułowia i przechył miednicy (stopnie) w ostatniej klatce */
const PODBICIE_GORA = 30; /* stopa górna idzie za goleniem, gdy kolano się unosi (oś stopy w płaszczyźnie biodro–kolano–kostka ±30°) */
function clamshell(cw, o = {}) {
  const { kolanoGora = 45 } = o; const T = bokSonda();
  const poleU = (u) => nrm([0.15, Math.sin(kolanoGora * a01(u) * R), -Math.cos(kolanoGora * a01(u) * R)]).map((v) => r1(v * 100) / 100);
  const rece = { L: bokDolnaReka(T), R: { g: [r1(T.sh.R[0] + 22), 3.5, -22], pole: [0, 0.6, 0.4] } };
  const fr = (u, ext = {}) => bokKlatka(u, bokNogiUlozone(T, poleU(u), r1(PODBICIE_GORA * a01(u))), rece, ext);
  /* błąd „noga za wysoko — biodro zaczyna się przechylać”: górne kolano unosi się wyżej (odchylenieKolana > 0 obraca kierunek zgięcia ku górze), a tułów odchyla się do tyłu względem miednicy (skretTulowia) */
  const bl = bladZTrajektorii({ cue: 'hab.mis.high', znacznik: 'pelvis', us: US, ok: (u) => fr(u), zle: (u) => fr(u, { twist: r1(BLAD_SKRET * a01(u)) }) });
  bl.klatki = bl.klatki.map((k) => (k.u === 0 ? k : { ...k, nogi: { R: { odchylenieKolana: r1(BLAD_KOLANO * a01(k.u)) } } }));
  bl.dod = ['spine']; return zloz(cw, [PODLOGA(-120, 120)], US.map((u) => fr(u)), [bl]);
}

/* ---------- stanie: kickback przy wyciągu, z gumą, na maszynie ---------- */
function stojacaRamka({ u, lean, ax = 0, kHip, tBack, kKolano = 6, sprzet, reka }) {
  const k0 = 6; const aS = [ax, 7, -8]; const pelY = hipY(aS, ax, -HIP(), k0); const m = [ax, pelY]; const hipR = [m[0], m[1], HIP()];
  const t = tBack; const d = [Math.cos(t * R), Math.sin(t * R), 0]; const sd = t - kKolano; const e = [Math.cos(sd * R), Math.sin(sd * R), 0]; const f = fk3(hipR, d, e);
  const Sx = S(m, lean); const g = reka(Sx, m);
  return { f: K({ u, m, p: lean, head: lean * 0.4, R: { a: [f.ankle[0], f.ankle[1], 6], pod: null, rot: 10, pole: f.pole }, L: { a: aS, pod: 0, rot: 10, pole: [0.15, 0.2, -0.1] }, hr: g.R, hl: g.L }), ankle: [f.ankle[0], f.ankle[1], 6], hip: hipR };
}
function kickback(cw, o = {}) {
  const { wariant = 'wyciag', lean = wariant === 'maszyna' ? 32 : wariant === 'guma' ? 8 : 24, t0 = 282, t1 = wariant === 'guma' ? 252 : 238, bladK = -30 } = o;
  const ax = 0;
  const reka = (Sx) => { if (wariant === 'guma') return { R: { g: [Sx[0] + 6, Sx[1] - 22, 19], pole: [-0.3, 0, 1] }, L: { g: [Sx[0] + 6, Sx[1] - 22, -19], pole: [-0.3, 0, -1] } };
    const gx = Sx[0] + 56; const gz = wariant === 'maszyna' ? UCHWYT_MASZYNY_Z : 14; return { R: { g: [gx, Sx[1] - 12, gz], pole: [0, -0.4, 1] }, L: { g: [gx, Sx[1] - 12, -gz], pole: [0, -0.4, -1] } }; };
  const fr = (u, bend = 0) => { const r = stojacaRamka({ u, lean, ax, tBack: lerp(t0, t1, a01(u)), reka }); if (bend) { const m = r.f.miednica; const f2 = K({ u, m, p: lean, bend, head: lean * 0.4, R: { a: r.ankle, pod: null, rot: 10, pole: r.f.nogi.R.biegunKolana }, L: { a: [ax, 7, -8], pod: 0, rot: 10, pole: [0.15, 0.2, -0.1] }, hr: r.f.rece.R, hl: r.f.rece.L }); void f2; } return r; };
  const ok = US.map((u) => fr(u)); const sprzet = [PODLOGA(-130, 140)];
  const m0 = ok[0].f.miednica; const Sx0 = S([m0[0], m0[1]], lean); const Xc = Sx0[0] + 56 + 10;
  if (wariant === 'wyciag') sprzet.push({ rodzaj: 'wyciag', x: r1(Xc), y: 22, z: 0, chwyt: 'kostka', trzyma: 'R' });
  if (wariant === 'guma') sprzet.push({ rodzaj: 'guma', mocowanie: 'kostki' });
  if (wariant === 'maszyna') { /* uchwyty maszyny: dwie równoległe poręcze na wysokości chwytu (rozstaw ≥ 30 cm wg kontraktu), dłonie na nich w każdej klatce (recenzja 1.1, partia 2, nr 5) */
    const hg = ok[0].f.rece.R.chwyt; sprzet.push({ rodzaj: 'poreczy', x0: r1(hg[0] - 15), x1: r1(hg[0] + 15), h: hg[1], z: UCHWYT_MASZYNY_Z }); }
  if (wariant === 'maszyna') { const P = [ok[0].hip[0], ok[0].hip[1], 38]; const a0 = ok[0].ankle; sprzet.push({ rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'kostki', trzyma: 'R', x: r1(P[0]), y: r1(P[1]), z: P[2], dlugosc: r1(Math.hypot(a0[0] - P[0], a0[1] - P[1], a0[2] - P[2])) }); }
  /* błąd: przeprost lędźwi na końcu ruchu (kręgosłup zgięty ku tyłowi) */
  const zleKl = US.map((u) => { const r = fr(u).f; return r; });
  const bl = { cue: 'hext.mis.arch', znacznik: 'back', dod: ['spine'], klatki: US.map((u) => (u === 0 ? { u: 0 } : { u, zgiecieKregoslupa: r1(bladK * a01(u)) })) }; void zleKl;
  return zloz(cw, sprzet, ok.map((r) => r.f), [bl]);
}

/* ---------- leżenie przodem na ławce płaskiej: flutter kicks (nogi poza końcem ławki) ---------- */
function flutter(cw) {
  const top = 43; const xp = -66; const m = [xp, top + 10.2]; const p = 90; const Sx = [m[0] + BODY().trunk, m[1]];
  const kat = (u, s) => { const a = Math.sin(2 * Math.PI * u * 0.5) ; return s * lerp(0, 1, 1) * 0 + (s * (12 - 24 * a01(u)) ); };
  const noga = (s, u) => { const ang = kat(u, s) ; const hip = [m[0], m[1], s * HIP()]; const dx = -Math.cos(ang * R), dy = Math.sin(ang * R); const f = fk3(hip, [dx, dy, 0], [dx, dy, 0]); return { a: [f.ankle[0], f.ankle[1], s * 8], pod: null, rot: 10, pole: [0, -1, s * 0.1] }; }; /* leżenie przodem: kolano ku przodowi uda (w dół), nie do tyłu — przy nodze prawie prostej drobne skrócenie cięciwy w fazach pośrednich nie wygina kolana wstecz (recenzja 1.1, partia 2, uwaga C) */
  const fr = (u) => K({ u, m, p, head: 78, R: noga(1, u), L: noga(-1, u), hr: { g: [Sx[0] + 48, top + 3, 19], pole: [0, 0.4, 1] }, hl: { g: [Sx[0] + 48, top + 3, -19], pole: [0, 0.4, -1] } });
  const bl = { cue: 'hext.mis.arch', znacznik: 'back', dod: ['spine'], klatki: US.map((u) => (u === 0 ? { u: 0 } : { u, zgiecieKregoslupa: r1(-30 * a01(u)) })) };
  return zloz(cw, [PODLOGA(-170, 120), { rodzaj: 'lawka', x: 0, top, kat: 0, dlugosc: 75, siedzisko: 55 }], US.map(fr), [bl]);
}

export const WYJATKI = {};
export function generuj() {
  return {
    'Donkey Kick': () => donkey('Donkey Kick'),
    'Fire Hydrant': () => hydrant('Fire Hydrant'),
    'Clamshell': () => clamshell('Clamshell'),
    'Cable Kickback': () => kickback('Cable Kickback', { wariant: 'wyciag' }),
    'Hip Extension with Bands': () => kickback('Hip Extension with Bands', { wariant: 'guma' }),
    'Machine Glute Kickback': () => kickback('Machine Glute Kickback', { wariant: 'maszyna' }),
    'Prone Flutter Kicks': () => flutter('Prone Flutter Kicks'),
  };
}
