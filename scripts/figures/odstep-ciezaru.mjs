// Odstęp ciężaru od ciała w klatce — wspólne dla scripts/figures/arkusz-slad.mjs i testów (tests/figures-v2-fala-wspolna-1.test.ts). v2 = moduły z loadV2().

/** Odstęp ciężaru od nóg (powierzchnia jak na rysunku) i tułowia, cm; ujemny = przenikanie. */
export function odstepCiezaru(v2, f) {
  const eq = v2.equipColliders(f.props).filter(c => c.k === 'capsule' && /^(bar|db|kb)/.test(c.id));
  const konce = f.props.flatMap(p => (p.k === 'cable' && Array.isArray(p.ends) ? p.ends : []));
  const items = eq.length ? eq.map(c => ({ a: c.a, b: c.b, r: c.r })) : (konce.length && !f.info.load) ? konce.map(c => ({ a: c, b: c, r: 2 })) : (() => { const c = f.info.load ?? f.info.trail; if (!c) return []; /* FW1 (04.11.2026): guma, talerz, łańcuchy w dłoniach nie mają info.load */ const h = Math.min(Math.abs(f.sk.arms.R.grip[2]), Math.abs(f.sk.arms.L.grip[2])); return [{ a: [c[0], c[1], -h], b: [c[0], c[1], h], r: 2 }]; })();
  let m = Infinity;
  for (const it of items) {
    for (const s of v2.SIDES) { const L = f.sk.legs[s]; for (const [seg, a, b] of [['thigh', L.hip, L.knee], ['shank', L.knee, L.ankle]])
      for (let i = 0; i <= 40; i++) { const t = i / 40; const q = [0, 1, 2].map(j => a[j] + (b[j] - a[j]) * t); m = Math.min(m, v2.distSegSeg(q, q, it.a, it.b) - it.r - v2.legRadius(seg, t)); } }
    m = Math.min(m, v2.distSegSeg(f.sk.pelvis, f.sk.shoulderC, it.a, it.b) - it.r - v2.GIRTH.trunkCollide, v2.distSegSeg(f.sk.pelvis, f.sk.pelvis, it.a, it.b) - it.r - v2.GIRTH.pelvis);
  }
  return m;
}

