import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, H2, Muted, Txt } from '@/components/ui';
import { useTheme, F } from '@/lib/theme';
import { WHATS_NEW, whatsNewUnseen, markWhatsNewSeen, type WhatsNewEntry } from '@/lib/whatsnew';
import { t, locale } from '@/lib/i18n';

/* „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening, kropka po aktualizacji, sekcja rozwijana. */
const entryTitle = (e: WhatsNewEntry) => {
  const d = new Date(+e.date.slice(0, 4), +e.date.slice(5, 7) - 1, +e.date.slice(8, 10)).toLocaleDateString(locale(), { day: 'numeric', month: 'numeric', year: 'numeric' });
  return e.build ? t('Wersja testowa {n} · {date}', { n: e.build, date: d }) : t('W tej wersji');
};

export function WhatsNewButton({ open, onPress }: { open: boolean; onPress: () => void }) {
  const th = useTheme(); const dot = whatsNewUnseen();
  return (
    <Pressable testID="whats-new-i" onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityState={{ expanded: open }}
      accessibilityLabel={dot ? t('Co nowego — są nowe zmiany') : t('Co nowego')}
      style={({ pressed }) => ({ width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: open ? th.accent : th.line, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}>
      <Text maxFontSizeMultiplier={1.2} style={{ color: open ? th.accent : th.text, fontSize: 17, fontFamily: F.semibold }}>i</Text>
      {dot ? <View testID="whats-new-dot" style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: th.accent, borderWidth: 1.5, borderColor: th.bg }} /> : null}
    </Pressable>
  );
}

function Entry({ e }: { e: WhatsNewEntry }) {
  return <View style={{ gap: 4 }}>{e.items().map(x => <Txt key={x} style={{ fontSize: 14 }}>{`• ${x}`}</Txt>)}</View>;
}

export function WhatsNewPanel({ onClose }: { onClose: () => void }) {
  const th = useTheme(); const router = useRouter(); const [older, setOlder] = useState<string | null>(null);
  const [cur, ...rest] = WHATS_NEW;
  return (
    <View testID="whats-new" style={{ marginBottom: 10, padding: 12, borderRadius: 10, backgroundColor: th.surface2, gap: 8 }}>
      <H2 style={{ marginBottom: 0 }}>{t('Co nowego')}</H2>
      <Muted style={{ fontSize: 13 }}>{entryTitle(cur)}</Muted>
      <Entry e={cur} />
      {rest.map(e => { const on = older === e.id; return (
        <View key={e.id} style={{ gap: 4 }}>
          <Pressable onPress={() => setOlder(on ? null : e.id)} accessibilityRole="button" accessibilityState={{ expanded: on }} hitSlop={4} style={{ minHeight: 32, justifyContent: 'center' }}>
            <Muted style={{ fontSize: 13, fontFamily: F.semibold }}>{`${on ? '▾' : '▸'} ${entryTitle(e)}`}</Muted>
          </Pressable>
          {on ? <Entry e={e} /> : null}
        </View>); })}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Btn small title={t('Przewodnik po funkcjach')} onPress={() => { onClose(); router.push('/guide'); }} />{/* 08.10.2026: po aktualizacji — przewodnik */}
        <Btn small kind="ghost" title={t('Zamknij')} onPress={onClose} />
      </View>
    </View>
  );
}

/** Nagłówek ekranu Trening: „i” w lewym górnym rogu, tytuł i data; sekcja pod spodem. Otwarcie = przeczytane (kropka znika). */
export function WhatsNewHeader({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 10 }}>
      <WhatsNewButton open={open} onPress={() => { if (!open) markWhatsNewSeen(); setOpen(!open); }} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
    {open ? <WhatsNewPanel onClose={() => setOpen(false)} /> : null}
  </>;
}
