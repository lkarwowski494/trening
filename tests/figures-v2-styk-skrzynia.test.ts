/*
 * Poprawki z niezależnej recenzji ruchu (01.11.2026, wariant X właściciela; wady ŚREDNIE):
 * 1. styk „plecy” (back) tylko gdy powierzchni dotyka górna połowa kapsuły tułowia (ławka, mata, oparcie) — w przysiadzie na skrzynię przy u 0,90–1 dotyka jej tylko dolny koniec
 *    tułowia (to samo co „seat”), więc „plecy” nie świecą, a poświata nie wisi ok. 30 cm przed skrzynią;
 * 2. ślad toru z góry (info.load) w wyciskaniu z kettlebellem leży przy ciężarze (z = chwyt), jak przy hantlu.
 */
import { figureSpec, frameAt, contactsOf, glowShapes } from '@/lib/figures/v2';

const ids = (k: string, u: number) => contactsOf(frameAt(figureSpec(k)!, u)).map(c => c.id);
const BOX = ['Box Squat', 'Box Squat with Bands', 'Box Squat with Chains', 'Reverse Band Box Squat'];

describe('styk „plecy” a przysiad na skrzynię (01.11.2026)', () => {
  test.each(BOX)('%s: na skrzyni (u 0,9 i 1) jest styk siedzenia, ale nie pleców', (k) => {
    for (const u of [0.9, 1]) { const have = ids(k, u); expect([k, u, have.includes('seat')]).toEqual([k, u, true]); expect([k, u, have.includes('back')]).toEqual([k, u, false]); }
  });
  test.each(BOX)('%s: żaden styk ciała nie ma poświaty ok. 30 cm przed skrzynią (miejsce styku = miejsce poświaty)', (k) => {
    const f = frameAt(figureSpec(k)!, 1); const box = f.props.find(p => p.k === 'box') as { x0: number; x1: number; top: number };
    for (const c of contactsOf(f).filter(c => c.kind === 'body')) { expect([k, c.id, c.p[0] >= box.x0 - 12 && c.p[0] <= box.x1 + 12]).toEqual([k, c.id, true]); }
    expect(glowShapes({ id: 'seat', kind: 'body', p: f.sk.pelvis }, 'side', 'contactOk', f.sk.up).length).toBe(2);
  });
  test.each([['Bench Press (sztanga)', 0], ['Bench Press (sztanga)', 1], ['One Arm Dumbbell Bench Press', 0.5], ['One-Arm Kettlebell Floor Press', 0.5]])('%s u=%s: plecy nadal opierają się o ławkę lub matę', (k, u) => {
    expect([k, ids(k, u as number).includes('back')]).toEqual([k, true]);
  });
});

describe('ślad toru z góry przy kettlebellu (01.11.2026)', () => {
  test('One-Arm Kettlebell Floor Press: load.z = chwyt kettlebella, nie oś ciała', () => {
    const f = frameAt(figureSpec('One-Arm Kettlebell Floor Press')!, 0.5); const kb = f.props.find(p => p.k === 'kettlebell') as { c: [number, number, number] };
    expect(kb.c[2]).toBeGreaterThan(20); expect(f.info.load![2]).toBeCloseTo(kb.c[2], 6); expect(f.info.load![0]).toBeCloseTo(kb.c[0], 6);
  });
  test('One Arm Dumbbell Bench Press: ślad nadal przy hantlu (bez zmiany)', () => {
    const f = frameAt(figureSpec('One Arm Dumbbell Bench Press')!, 0.5); const db = f.props.find(p => p.k === 'dumbbell') as { c: [number, number, number] };
    expect(f.info.load![2]).toBeCloseTo(db.c[2], 6);
  });
});
