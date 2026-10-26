// Wspólne narzędzia generatorów póz DOLNEJ części ciała (wersja 1.1, 26.10.2026): wykroki, wspięcia, mostki, maszyny nóg, prostowanie tułowia, ćwiczenia na pośladki, noszenie, zwis, rotacje, dipy, thruster.
// Pozy liczone z modelu: długości kości z BODY, odległość biodro–kostka z prawa cosinusów (kolano wynika z IK silnika), sprzęt z kontraktu (gear.ts). Wejście: wyłącznie liczby z modelu i wskazówki z katalogu (docs/53, bramka 11).
import { v2, BODY, R, r1, up, front, klatka, bladZTrajektorii, zbuduj, barki, przeciecie, kostkaNaPalcach, delta } from './model.mjs';
export { v2, BODY, R, r1, up, front, klatka, bladZTrajektorii, zbuduj, barki, przeciecie, kostkaNaPalcach, delta };

import { wczytajTeksty } from '../v2-jakosc.mjs';
/** Błędy z katalogu wskazówek, które mają opis w lib/cues/text/pl.json (reguła jakości etykieta_bledu); pozostałe nie są rysowane, powód trafia do `rejestr` (ćwiczenie → powód). */
export function bledyZOpisem(cw, bledy, rejestr = {}) { const t = wczytajTeksty(); return bledy.filter((b) => { if (t[b.cue]) return true; rejestr[cw] = `błąd „${b.cue}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu); generator narysuje go po wdrożeniu tekstu`; return false; }); }
export const lerp = (a, b, t) => a + (b - a) * t;
export const lerp3 = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
/** Łagodny start i koniec ruchu (0–1). */
export const ease = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
/** Równomierna siatka u (n klatek), zaokrąglona do 3 miejsc. */
export const siatka = (n) => Array.from({ length: n }, (_, i) => Math.round((i / (n - 1)) * 1000) / 1000);
export const sum = (a, b) => a.map((x, i) => x + b[i]);
export const HIP = () => BODY().hipHalf;
export const SH = () => BODY().shHalf;
/** Cały zasięg ramienia (bark → środek chwytu, prosto) i nogi (biodro → kostka, prosto). */
export const ZASIEG_R = () => { const b = BODY(); return b.uarm + b.farm + b.hand; };
export const ZASIEG_N = () => { const b = BODY(); return b.thigh + b.shank; };

/** Odległość biodro–kostka (3D) dla zgięcia kolana k (0 = noga prosta). */
export const dNogi = (k) => { const b = BODY(); return Math.sqrt(b.thigh ** 2 + b.shank ** 2 + 2 * b.thigh * b.shank * Math.cos(k * R)); };
/** Zgięcie kolana (stopnie) dla odległości biodro–kostka d. */
export const kolanoZD = (d) => { const b = BODY(); const c = (d * d - b.thigh ** 2 - b.shank ** 2) / (2 * b.thigh * b.shank); return Math.acos(clamp(c, -1, 1)) / R; };
/** Promień w płaszczyźnie strzałkowej (x, y) dla odległości 3D d i różnicy bocznej dz między biodrem a kostką. */
export const rPlan = (d, dz) => Math.sqrt(Math.max(1, d * d - dz * dz));
/** Wysokość stawu biodrowego nad kostką `a` ([x, y, z]) dla biodra w x = hx, z = hz i zgięcia kolana k. */
export const hipY = (a, hx, hz, k) => a[1] + Math.sqrt(Math.max(0, dNogi(k) ** 2 - (hx - a[0]) ** 2 - (hz - a[2]) ** 2));
/** Miednica z dwóch nóg: oba biodra w jednej płaszczyźnie (x, y); noga R: kostka aR, zgięcie kR; noga L: aL, kL. Zwraca [x, y] (biodro „nad” kostkami). */
export function miednicaZNog(aR, kR, aL, kL, wybor = 'gora') {
  const hz = HIP();
  const rr = rPlan(dNogi(kR), hz - aR[2]), rl = rPlan(dNogi(kL), -hz - aL[2]);
  const p = przeciecie([aR[0], aR[1]], rr, [aL[0], aL[1]], rl, wybor);
  if (!p) throw new Error(`miednicaZNog: brak przecięcia (kR=${kR}, kL=${kL}, aR=${aR}, aL=${aL})`);
  return p;
}
/** Punkt w układzie tułowia (jak trunkPoint w rigach): a cm od miednicy wzdłuż tułowia, b cm do przodu klatki, z boczne. */
export function tp(m, pitch, a, b, z = 0) { const u = up(pitch), f = front(pitch); return [m[0] + u[0] * a + f[0] * b, m[1] + u[1] * a + f[1] * b, z]; }
/** Barki (środek, [x, y]) dla miednicy. */
export const S = (m, pitch, bend = 0) => barki([m[0], m[1]], pitch, bend);

/** Chwyty rąk zwisających wzdłuż ciała: ramię pod kątem `odchyl` do przodu od pionu (cm od barku: odległość d), boczne z; łokieć lekko ugięty (d ≤ zasięg − 1,5). */
export function reka(Sx, o = {}) {
  const { z = 24, d = ZASIEG_R() - 1.5, dx = 0, pole } = o; const dz = z - SH(); const ly = Math.sqrt(Math.max(1, d * d - dz * dz - dx * dx));
  return (sg) => ({ g: [Sx[0] + dx, Sx[1] - ly, sg * z], pole: pole ?? [0, 0, sg] });
}
/** Zbiera klatkę z opisu: { u, m:[x,y,z?], p, bend, head, R:{a,pod,rot,pole,odch}, L:{...}, hr:{g,pole}, hl:{g,pole} }. */
export function K({ u, m, p, bend = 0, head, R: nr, L: nl, hr, hl, roll, twist, lean, tilt, boczne }) {
  const noga = (n) => ({ k: n.a, pod: n.pod === null ? undefined : (n.pod ?? 0), rot: n.rot, pole: n.pole, odchylenie: n.odch });
  const k = klatka({ u, miednica: [m[0], m[1], boczne !== undefined ? 0 : (m[2] ?? 0)], pitch: p, bend, glowa: head ?? p * 0.5, nogi: { R: noga(nr), L: noga(nl) }, rece: { R: hr, L: hl }, boczne });
  if (roll !== undefined) k.obrotTulowia = r1(roll); if (twist !== undefined) k.skretTulowia = r1(twist); if (lean !== undefined) k.przechylTulowia = r1(lean); if (tilt !== undefined) k.przechylMiednicy = r1(tilt);
  return k;
}
/** Kąt kostki „stopa płasko na skrzyni”: wysokość kostki nad powierzchnią o `top`. */
export const kostkaPlasko = (top = 0) => top + BODY().ankleH;
/** Poza z gotowych klatek i błędów (rodzina, sprzęt). */
export const poza = (rodzina, cw, sprzet, klatki, bledy = []) => zbuduj({ rodzina, cwiczenie: cw, sprzet, klatki, bledy });
export const PODLOGA = (x0 = -160, x1 = 160) => ({ rodzaj: 'podloga', x0, x1 });
/** Dodaje do `dotyczy` błędu dodatkowe wielkości (np. kneeLat — kontrakt nie wylicza jej z kątów). */
export function dodajDotyczy(poza_, cue, ...ety) { const b = poza_.bledy.find((x) => x.cue === cue); if (b) for (const e of ety) if (!b.dotyczy.includes(e)) b.dotyczy.push(e); return poza_; }
/** Błąd „kolana do środka”: odchylenie kolana (stopnie od wartości bazowej) rośnie liniowo do `dosrodka` w u = 1 (wszystkie nogi z listy `strony`). Pole `postawa`: widoczne od u = 0. */
export function bladKolanaDoSrodka({ cue, us, dosrodka = 30, strony = ['R', 'L'], znacznik = 'knees', postawa = false }) {
  const klatki = us.map((u) => { if (u === 0 && !postawa) return { u: 0 }; const w = postawa ? 1 : u; const nogi = {}; for (const s of strony) nogi[s] = { odchylenieKolana: r1(-dosrodka * w) }; return { u, nogi }; });
  return { cue, znacznik, dotyczy: ['kneeLat'], klatki };
}
/** Opis wybranego ćwiczenia do podglądu: szkielet w danej fazie (kontrola ręczna). */
export const szkielet = (poza_, u) => v2().keyframeFrame(poza_, u).sk;

/** Kąt (stopnie od +x) wektora; do kierunku goleni. */
export const katXY = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
/** Wysokość kostki, gdy palce stopy (podbicie pod ≤ 0) stoją na powierzchni o wysokości top. */
export const kostkaPalceY = (top, pod) => { const f = pod * R; return top + BODY().ankleH * Math.cos(f) - BODY().toeFwd * Math.sin(f) + 0.3 - 0.3; };
/**
 * Podbicie tylnej stopy na palcach: stopa „zgięta podeszwowo” o tyle, by kąt kostki zmieścił się w zakresie (≤ 37° zgięcia grzbietowego; margines `zapas`).
 * Kolano z przecięcia okręgów (udo wokół biodra, goleń wokół kostki) po stronie `strona` ('dol' = kolano ku podłodze). Zwraca { pod, y }.
 */
export function podbiciePalcow(hip, ax, top = 0, strona = 'dol', zapas = 4, start = -55) {
  const b = BODY(); let pod = start;
  for (let i = 0; i < 12; i++) {
    const y = kostkaPalceY(top, pod); const kn = przeciecie([hip[0], hip[1]], b.thigh, [ax, y], b.shank, strona); if (!kn) break;
    const ang = katXY([ax, y], kn); /* kierunek kostka → kolano */
    const need = Math.min(start, ang - (53 + zapas)); if (Math.abs(need - pod) < 0.05) break; pod = Math.max(-80, need);
  }
  return { pod: r1(pod), y: r1(kostkaPalceY(top, pod)) };
}
/** Największe y miednicy ≤ ymax, przy którym warunek `ok(sk)` jest spełniony (skan co 0,5 cm w dół); `ramkaF(y)` zwraca klatkę kontraktu (u = 0). */
export function znajdzY(ramkaF, ok, ymax, ymin) {
  const E = v2(); for (let y = ymax; y >= ymin; y -= 0.5) {
    const k0 = ramkaF(y); const p = { kontrakt: E.CONTRACT.id, rodzina: 'x', cwiczenie: 'x', sprzet: [{ rodzaj: 'podloga' }], klatki: [{ ...k0, u: 0 }, { ...k0, u: 1 }], bledy: [] };
    try { const sk = E.keyframeFrame(p, 0).sk; if (ok(sk, (s) => E.jointAngles(sk, s))) return y; } catch { /* poza zasięgiem — niżej */ }
  }
  return ymin;
}

/** Kolano w płaszczyźnie (x, y): przecięcie okręgów udo/goleń; z dwóch rozwiązań to, które leży po stronie wektora `pole` względem prostej biodro–kostka. */
export function kolano2D(hip, ankle, pole = [0.15, -1]) {
  const b = BODY(); const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1]; const d = Math.hypot(dx, dy) || 1e-6; const dd = Math.min(Math.max(d, Math.abs(b.thigh - b.shank) + 1e-6), b.thigh + b.shank - 1e-6);
  const a = (b.thigh ** 2 - b.shank ** 2 + dd * dd) / (2 * dd); const h = Math.sqrt(Math.max(0, b.thigh ** 2 - a * a)); const ux = dx / d, uy = dy / d;
  const n = [-uy, ux]; const sg = n[0] * pole[0] + n[1] * pole[1] >= 0 ? 1 : -1;
  return [hip[0] + ux * a + sg * n[0] * h, hip[1] + uy * a + sg * n[1] * h];
}
/** Wysokość kostki, gdy stopa o podbiciu pod stoi (najniższy punkt podeszwy) na powierzchni o wysokości top. */
export const kostkaStopyY = (top, pod) => { const f = pod * R, b = BODY(); return top + Math.max(b.ankleH * Math.cos(f) - b.toeFwd * Math.sin(f), b.ankleH * Math.cos(f) + b.heelBack * Math.sin(f)); };
/**
 * Podbicie stopy stojącej na podporze o wysokości `top`, gdy tułów/goleń zmieniają ułożenie: możliwie płasko (0), ale tak, by kąt kostki nie przekroczył zakresu
 * (kąt między goleniem a stopą ≥ 53° + zapas, czyli zgięcie grzbietowe ≤ 37° − zapas). Kolano po stronie `pole` w płaszczyźnie (x, y). Zwraca { pod, y } (y = wysokość kostki).
 */
export function podAuto(hip, ax, top = 0, pole = [0.15, -1], { zapas = 3, min = -80 } = {}) {
  let pod = 0;
  for (let i = 0; i < 14; i++) {
    const y = kostkaStopyY(top, pod); const kn = kolano2D(hip, [ax, y], pole); const ang = katXY([ax, y], kn);
    const nowe = Math.max(min, Math.min(0, ang - (53 + zapas))); if (Math.abs(nowe - pod) < 0.05) { pod = nowe; break; } pod = nowe;
  }
  return { pod: r1(pod), y: r1(kostkaStopyY(top, pod)) };
}

/** Układ klatki piersiowej (bark, osie) dla miednicy m = [x, y], pochylenia p i opcjonalnych: obrót ciała (roll), skręt klatki (twist), skłon boczny (lean), zgięcie kręgosłupa (bend) — jak solveSkeleton.
 * Zwraca { up, front, right, sc (środek barków), sh(sg) (bark strony), pt(a, b, c) (punkt w układzie klatki: a w górę, b do przodu, c w prawo od środka barków) }. */
export function klatkaPiersiowa(m, p, { roll = 0, twist = 0, lean = 0, bend = 0 } = {}) {
  const ax = v2().trunkAxes({ trunkPitch: p, trunkRoll: roll, trunkTwist: twist, trunkLean: lean, pelvisTilt: 0 }); const b = BODY(); const ch = Math.cos(0.55 * bend * R);
  const sc = [m[0] + ax.up[0] * b.trunk * ch, m[1] + ax.up[1] * b.trunk * ch, ax.up[2] * b.trunk * ch];
  const sh = (sg) => [sc[0] + sg * b.shHalf * ax.right[0], sc[1] + sg * b.shHalf * ax.right[1], sc[2] + sg * b.shHalf * ax.right[2]];
  const pt = (a, bb, c) => [0, 1, 2].map((i) => sc[i] + ax.up[i] * a + ax.front[i] * bb + ax.right[i] * c);
  return { up: ax.up, front: ax.front, right: ax.right, sc, sh, pt };
}

/** Klatki kluczowe równomiernie co do DROGI najszybciej poruszającego się punktu (kontrakt: skok ≤ 6 cm na 1/48 ruchu; interpolacja klatek jest liniowa, więc przy ruchu o zmiennej prędkości
 * gęstsze klatki dają krótszy odcinek tam, gdzie ruch jest szybki). Zwraca n wartości u (0 … 1). ok(u) → klatka kontraktu; sprzęt i ćwiczenie są potrzebne do liczenia szkieletu. */
export function kluczeRownoDroznie(rodzina, cw, sprzet, ok, n = 12, N = 120) {
  const E = v2(); const us = Array.from({ length: N + 1 }, (_, i) => i / N);
  const p = { kontrakt: E.CONTRACT.id, rodzina, cwiczenie: cw, sprzet, klatki: us.map((u) => ok(u)), bledy: [] };
  const pts = (f) => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, f.sk.spineMid, ...['R', 'L'].flatMap((s) => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.legs[s].heel, f.sk.legs[s].toe, f.sk.arms[s].elbow, f.sk.arms[s].grip])];
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  let prev = pts(E.keyframeFrame(p, 0)); const cum = [0];
  for (let i = 1; i <= N; i++) { const cur = pts(E.keyframeFrame(p, us[i])); cum.push(cum[i - 1] + Math.max(...cur.map((q, j) => d(q, prev[j])))); prev = cur; }
  const tot = cum[N]; const out = [0];
  for (let k = 1; k < n - 1; k++) { const target = tot * k / (n - 1); let i = 1; while (i < N && cum[i] < target) i++; const t = (target - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); out.push(Math.round((us[i - 1] + t / N) * 1000) / 1000); }
  out.push(1); return out;
}
