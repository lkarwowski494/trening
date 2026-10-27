import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url'; import { v2 } from './model.mjs';
const [rodzina, cw, u0] = process.argv.slice(2); const mod = await import(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), `${rodzina}.mjs`)).href);
const poza = mod.generuj()[cw](); const E = v2(); const f = E.keyframeFrame(poza, Number(u0), process.env.BL === undefined ? undefined : Number(process.env.BL)); const sk = f.sk; const r = (v) => v.map((x) => +x.toFixed(1));
console.log('pelvis', r(sk.pelvis), 'shoulderC', r(sk.shoulderC)); for (const s of ['R', 'L']) console.log(s, 'hip', r(sk.legs[s].hip), 'knee', r(sk.legs[s].knee), 'ankle', r(sk.legs[s].ankle), 'sh', r(sk.arms[s].shoulder), 'el', r(sk.arms[s].elbow), 'grip', r(sk.arms[s].grip));
console.log(JSON.stringify(poza.klatki.find((k) => Math.abs(k.u - Number(u0)) < 0.02) ?? poza.klatki[5]).slice(0, 700));
