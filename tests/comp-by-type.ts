/**
 * ZB-010 (RNTL 14, grupa A, 02.11.2026): odpowiednik dawnego `UNSAFE_getAllByType(Komponent)` / `findAllByType` dla komponentów złożonych
 * (np. `FlatList`, `Circle` z react-native-svg, komponenty aplikacji). Drzewo test-renderera ma tylko elementy natywne — komponenty złożone
 * odczytujemy z `unstable_fiber` (między elementem natywnym a jego natywnym rodzicem, jak `compPropsAll` w tests/app.tsx).
 * Dla elementów natywnych (View, Text, TextInput, RCTScrollView, RNSVG*) wystarczy `hostRoot().queryAll(n => n.type === '…')`.
 * Ograniczenie: komponent, który nie renderuje żadnego elementu natywnego (zwraca null), nie zostanie znaleziony.
 */
type Fiber = { type: unknown; elementType?: unknown; tag?: number; memoizedProps: Record<string, any>; return: Fiber | null };
type Host = { queryAll: (f: (n: any) => boolean, o?: { includeSelf?: boolean }) => any[] };

const matches = (f: Fiber, T: unknown) => f.type === T || f.elementType === T || (f.type as { render?: unknown } | null)?.render === T;

/** Wszystkie instancje komponentu `T` pod `root` (w kolejności drzewa, bez powtórzeń) jako `{ props, type }`. */
export const compByType = (root: Host, T: unknown): { props: Record<string, any>; type: unknown }[] => {
  const seen = new Set<Fiber>(); const out: { props: Record<string, any>; type: unknown }[] = [];
  for (const h of root.queryAll(() => true, { includeSelf: true })) {
    const chain: Fiber[] = [];
    for (let f = (h as { unstable_fiber?: Fiber }).unstable_fiber?.return ?? null; f && typeof f.type !== 'string' && f.tag !== 3; f = f.return) chain.unshift(f);
    for (const f of chain) if (matches(f, T) && !seen.has(f)) { seen.add(f); out.push({ props: f.memoizedProps, type: f.type }); }
  }
  return out;
};
