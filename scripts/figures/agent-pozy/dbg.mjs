#!/usr/bin/env node
// Diagnostyka pozy: węzły szkieletu i kąty stawów dla ćwiczenia generatora rodziny w wybranych u. Użycie: node scripts/figures/agent-pozy/dbg.mjs <rodzina> "<ćwiczenie>" [u1,u2,...] [indeks błędu]
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { v2 } from './model.mjs';
const [rodzina, cw, us = '0,0.5,1', blad] = process.argv.slice(2);
const mod = await import(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), `${rodzina}.mjs`)).href);
const poza = mod.generuj()[cw](); const E = v2(); const f1 = (a) => a.map((x) => x.toFixed(1)).join(',');
for (const u of us.split(',').map(Number)) {
  const f = E.keyframeFrame(poza, u, blad === undefined ? undefined : Number(blad)); const s = f.sk; const a = E.jointAngles(s, 'R'); const b = E.jointAngles(s, 'L');
  console.log(`u=${u} pelvis[${f1(s.pelvis)}] shoulder[${f1(s.shoulderC)}] head[${f1(s.head)}]`);
  for (const k of ['R', 'L']) console.log(`  ${k}: knee[${f1(s.legs[k].knee)}] ankle[${f1(s.legs[k].ankle)}] toe[${f1(s.legs[k].toe)}] heel[${f1(s.legs[k].heel)}] elbow[${f1(s.arms[k].elbow)}] grip[${f1(s.arms[k].grip)}] errArm=${s.arms[k].err.toFixed(2)} errLeg=${s.legs[k].err.toFixed(2)}`);
  console.log(`  kąty R: hip ${a.hip.toFixed(0)} knee ${a.knee.toFixed(0)} ankle ${a.ankle.toFixed(0)} elbow ${a.elbow.toFixed(0)} shElev ${a.shElev.toFixed(0)} shSag ${a.shSag.toFixed(0)} | L: hip ${b.hip.toFixed(0)} knee ${b.knee.toFixed(0)} ankle ${b.ankle.toFixed(0)} elbow ${b.elbow.toFixed(0)}`);
}
