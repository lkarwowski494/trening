/*
 * Pełne dane źródeł (nazwy organizacji, tytuły, adresy, powody otwartych pozycji, granice zakresu stawów ze źródłami) — JEDNO miejsce: katalog data/zrodla
 * (decyzja właściciela 25.10.2026: nazwy źródeł nie trafiają do paczki aplikacji; z tego katalogu generuje się plik runtime bez nazw — scripts/zrodla-runtime.mjs).
 * Tylko testy `tests/zrodla-pelne-*.test.ts` czytają ten plik; po ewentualnym przeniesieniu data/zrodla poza repozytorium publiczne przenosi się je razem z nim.
 */
import * as fs from 'fs';
import * as path from 'path';

export const ZRODLA_DIR = path.join(__dirname, '..', 'data', 'zrodla');
export type FullRef = [string, string] | [string, string, 'analogia'];
export type FullCueRef = { c: string; s: FullRef[] };
export type CueFull = {
  orgs: Record<string, { name: string; level: 2 | 3 | 4; kind: 'org' | 'site' | 'maker' | 'study' }>;
  sources: Record<string, { org: string; title: string; url: string; archive?: string; level: 2 | 3 | 4 }>;
  exercises: Record<string, Record<'setup' | 'move' | 'tips' | 'mistakes', FullCueRef[]>>;
  open: Record<string, string>; partial?: string[]; partialNote?: string;
};
export type FigFull = { rom: { note: string; side: Record<string, { min: number; max: number; src: string }>; front: Record<string, { min: number; max: number; src: string }> }; exercises: Record<string, unknown>; open: Record<string, string> };
export const CUE_FULL: CueFull = JSON.parse(fs.readFileSync(path.join(ZRODLA_DIR, 'cues.json'), 'utf8'));
export const FIG_FULL: FigFull = JSON.parse(fs.readFileSync(path.join(ZRODLA_DIR, 'figures.json'), 'utf8'));
