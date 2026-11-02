/**
 * ZB-010 (SDK 58 / RNTL 14), grupa B, 02.11.2026: drzewo w kształcie dawnego `UNSAFE_root` z react-test-renderer — komponenty złożone
 * (np. `Pressable`, `TextInput`, `Rect` z react-native-svg) i elementy natywne, z `type`, `props`, `children`, `parent` i `findAll` (z samym węzłem).
 * RNTL 14 pokazuje tylko elementy natywne (`screen.container`); testy, których asercje dotyczą komponentów złożonych, budują to drzewo
 * z włókien Reacta (`unstable_fiber`) — zmiana tylko API testu, asercje bez zmian. Zasady pomijania jak w react-test-renderer:
 * węzłem są komponenty funkcyjne, klasowe, forwardRef, memo i elementy natywne; tekst to napis; pozostałe włókna (Fragment, kontekst,
 * Suspense itd.) są przezroczyste.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from '@testing-library/react-native';

export type FNode = {
  type: any;
  props: Record<string, any>;
  children: (FNode | string)[];
  parent: FNode | null;
  findAll: (pred: (n: FNode) => boolean) => FNode[];
};

/* znaczniki włókien React 19 (ReactWorkTags) */
const FUNCTION = 0, CLASS = 1, HOST_ROOT = 3, HOST = 5, HOST_TEXT = 6, FORWARD_REF = 11, MEMO = 14, SIMPLE_MEMO = 15;
const NODE_TAGS = new Set([FUNCTION, CLASS, HOST, FORWARD_REF, MEMO, SIMPLE_MEMO]);

function findAll(this: FNode, pred: (n: FNode) => boolean): FNode[] {
  const out: FNode[] = [];
  const walk = (n: FNode | string) => { if (typeof n === 'string') return; if (pred(n)) out.push(n); n.children.forEach(walk); };
  walk(this);
  return out;
}

/** Dzieci włókna jako węzły (włókna przezroczyste rozwinięte). */
function kids(fiber: any, parent: FNode | null): (FNode | string)[] {
  const out: (FNode | string)[] = [];
  for (let c = fiber?.child; c; c = c.sibling) {
    if (c.tag === HOST_TEXT) out.push(String(c.memoizedProps));
    else if (NODE_TAGS.has(c.tag)) out.push(build(c, parent));
    else out.push(...kids(c, parent));
  }
  return out;
}

function build(fiber: any, parent: FNode | null): FNode {
  const n: FNode = { type: fiber.type, props: fiber.memoizedProps ?? {}, children: [], parent, findAll };
  n.children = kids(fiber, n);
  return n;
}

/** Bieżące włókno (nie `alternate` sprzed ostatniego zatwierdzenia). */
const current = (fiber: any): any => {
  let r = fiber; while (r && r.tag !== HOST_ROOT) r = r.return;
  if (!r) return fiber;
  const cur = r.stateNode?.current;
  if (cur === r) return fiber;
  return fiber.alternate ?? fiber;
};

/** Korzeń całego drzewa (odpowiednik `screen.UNSAFE_root` / `render(...).UNSAFE_root`). */
export function fiberRoot(container: { queryAll: (f: (n: any) => boolean) => any[] } = screen.container as any): FNode {
  const host = container.queryAll(() => true).find((h: any) => h.unstable_fiber);
  if (!host) throw new Error('fiberRoot: puste drzewo');
  let r = host.unstable_fiber; while (r && r.tag !== HOST_ROOT) r = r.return;
  const root = r.stateNode.current;
  const n: FNode = { type: null, props: {}, children: [], parent: null, findAll };
  n.children = kids(root, n);
  return n.children.length === 1 && typeof n.children[0] !== 'string' ? Object.assign(n.children[0], { parent: null }) : n;
}

/** Węzeł elementu natywnego z RNTL 14 (np. wynik `getByTestId`) w drzewie włókien — z poddrzewem komponentów złożonych. */
export function fiberOf(host: { unstable_fiber?: any }): FNode {
  const f = current(host.unstable_fiber);
  if (!f) throw new Error('fiberOf: element bez unstable_fiber');
  /* przodkowie (bez rodzeństwa) — `parent` sięga do korzenia jak w react-test-renderer */
  let parent: FNode | null = null; const chain: FNode[] = [];
  for (let a = f.return; a && a.tag !== HOST_ROOT; a = a.return) if (NODE_TAGS.has(a.tag)) chain.push({ type: a.type, props: a.memoizedProps ?? {}, children: [], parent: null, findAll });
  for (let i = chain.length - 1; i >= 0; i--) { chain[i].parent = parent; parent = chain[i]; }
  return build(f, parent);
}

/** Element natywny RNTL 14 → węzeł drzewa włókien; węzeł drzewa włókien zostaje bez zmian. */
export const asFiber = (n: any): FNode => (n && 'unstable_fiber' in n ? fiberOf(n) : n);
