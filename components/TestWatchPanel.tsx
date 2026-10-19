import React from 'react';
import { View } from 'react-native';
import { Btn, SectionTitle } from '@/components/ui';
import { isFakeWatchBuild, pressTestWatch } from '@/lib/watch/test-mode';

/** Panel „Test watch” — tylko build E2E (EXPO_PUBLIC_WATCH_FAKE=1 razem ze sztucznym sklepem; lib/watch/test-mode.ts): Maestro wysyła zdarzenia „zegarka”
 * (symulator iPhone’a nie ma sparowanego zegarka). Bez t(): nie trafia do TestFlight ani App Store (tests/watch-test-mode.test.ts). Wzór: panel „Test store” (app/paywall.tsx). */
export function TestWatchPanel() {
  if (!isFakeWatchBuild()) return null;
  return (
    <View testID="fake-watch-panel" style={{ marginTop: 24, gap: 8 }}>
      <SectionTitle>Test watch</SectionTitle>
      <Btn small title="Test watch: done" onPress={() => pressTestWatch('done')} />
      <Btn small title="Test watch: differ" onPress={() => pressTestWatch('differ')} />
      <Btn small title="Test watch: skip" onPress={() => pressTestWatch('skip')} />
    </View>
  );
}
