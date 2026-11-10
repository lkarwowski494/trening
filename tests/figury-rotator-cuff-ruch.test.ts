/*
 * rotator_cuff (10.11.2026, partia 5, samokontrola ruchu K4–K8): regresja wady z arkusza śladu — w rotacjach z gumą (External/Internal Rotation with Band) guma biegła z zaczepu
 * do OBU dłoni, więc drugi pasek przecinał tułów do wiszącej ręki lewej (jedna ręka pracuje, tak jak przy uchwycie wyciągu). Poprawka w generatorze: guma z zaczepem
 * trzymana tylko ręką roboczą R (pole `trzyma`). Dla całej rodziny: rotacje mają zakres obrotu ≥ 60°, a łokieć roboczy nie odchodzi od tułowia w pozie poprawnej.
 */
import { stykTora, podsumujStyk, PROG_STYKU } from './helpers/styk-figur';
import { figureSpec, measuredAngle, poseFile, poseKeys, type FigureSpec } from '@/lib/figures/v2';

const ROTACJE = poseKeys('rotator_cuff').filter(k => /Rotation/.test(k) && k !== 'Reverse Flyes With External Rotation');
describe('rotator_cuff: sprzęt jednej ręki i zakres rotacji', () => {
  test('jest 5 rotacji z rysunkiem (hantel, linki, taśma ×2, wyciąg)', () => { expect(ROTACJE).toHaveLength(5); });
  test.each(['External Rotation with Band', 'Internal Rotation with Band'])('%s: guma z zaczepem trzymana jedną ręką (R), nie dwiema', k => {
    const g = (poseFile('rotator_cuff')!.cwiczenia[k].sprzet as { rodzaj: string; trzyma?: string }[]).find(x => x.rodzaj === 'guma');
    expect([k, g?.trzyma]).toEqual([k, 'R']);
  });
  test.each(ROTACJE)('%s: zakres obrotu w barku ≥ 60° między skrajnymi klatkami', k => {
    const s = figureSpec(k) as FigureSpec; const a = Array.from({ length: 21 }, (_, i) => measuredAngle(s, i / 20).deg);
    expect(Math.max(...a) - Math.min(...a)).toBeGreaterThanOrEqual(60);
  });
  test.each(poseKeys('rotator_cuff'))('%s: ciężar/guma nie przenika ciała (≤ PROG_STYKU.przenikanieCm)', k => { expect(podsumujStyk(stykTora(k)).maxPrzenikanie).toBeLessThanOrEqual(PROG_STYKU.przenikanieCm); });
  test('Band Pull Apart: guma między dłońmi przez cały ruch ≥ 1 cm od tułowia (przed poprawką −10,6 cm: ręce 100° od przodu, guma przez klatkę); zakres rozsunięcia ≥ 65° (poprawka: ręce kończą 76° od przodu, tam guma dotyka klatki)', () => {
    expect(podsumujStyk(stykTora('Band Pull Apart')).minOdstep).toBeGreaterThanOrEqual(1);
    const s = figureSpec('Band Pull Apart') as FigureSpec; const a = Array.from({ length: 21 }, (_, i) => measuredAngle(s, i / 20).deg);
    expect(Math.max(...a) - Math.min(...a)).toBeGreaterThanOrEqual(65);
  });
});
