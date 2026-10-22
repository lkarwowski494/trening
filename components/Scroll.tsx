import React from 'react';
import { ScrollView as RNScrollView, FlatList as RNFlatList, SectionList as RNSectionList, type ScrollViewProps, type FlatListProps, type SectionListProps } from 'react-native';

/*
 * Wspólne przewijanie (właściciel, 22.10.2026; docs/32 wzorzec 31, strażnik S18): jedna zasada dla wszystkich przewijanych ekranów — wskaźnik przewijania
 * (pionowa kreska przy prawej krawędzi, a w ekranach z marginesem Screen widoczna „w treści”) jest ukryty wszędzie, nigdy tylko na części ekranów.
 * Ekrany importują ScrollView / FlatList / SectionList stąd, nie z react-native (pilnuje S18). Reszta właściwości przechodzi bez zmian (ref, onScroll, …).
 */
export const ScrollView = React.forwardRef<RNScrollView, ScrollViewProps>(function ScrollView(props, ref) {
  return <RNScrollView ref={ref} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} {...props} />;
});
export type ScrollView = RNScrollView;

export const FlatList = React.forwardRef(function FlatList(props: FlatListProps<never>, ref: React.Ref<RNFlatList<never>>) {
  return <RNFlatList ref={ref} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} {...props} />;
}) as unknown as <T>(props: FlatListProps<T> & { ref?: React.Ref<RNFlatList<T>> }) => React.ReactElement;
export type FlatList<T = unknown> = RNFlatList<T>;

export const SectionList = React.forwardRef(function SectionList(props: SectionListProps<never>, ref: React.Ref<RNSectionList<never>>) {
  return <RNSectionList ref={ref} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} {...props} />;
}) as unknown as <T, S = unknown>(props: SectionListProps<T, S> & { ref?: React.Ref<RNSectionList<T, S>> }) => React.ReactElement;
export type SectionList<T = unknown, S = unknown> = RNSectionList<T, S>;
