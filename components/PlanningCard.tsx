import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, useOnce, upperText } from '@/components/ui';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { newTemplate, fmtDayKey } from '@/lib/store';
import { planSummary } from '@/lib/home';
import { planTplName } from '@/lib/plan';
import { firstSteps } from '@/lib/dashboard';
import { t, tp, lang } from '@/lib/i18n';

/*
 * Karta Planowania na ekranie głównym (układ B, decyzja właściciela 09.10.2026; docs/18): „+ Nowy szablon”, „Plan z moich szablonów”, generator.
 * Przy planie — zwinięta do jednego wiersza „Plan: <nazwa> · N dni · następny: …”; tapnięcie rozwija akcje („Plan tygodnia” jest na karcie „Dziś”). Bez planu — rozwinięta
 * (ekran główny stawia ją wyżej, zaraz pod przyciskiem startu). Dopóki widać „Pierwsze kroki” (nowa osoba) — karty nie ma: kroki mają te same akcje.
 * Samodzielny komponent — można go przenieść bez zmian.
 */
export function PlanningCard({ when }: { /** 'plan' — pokaż tylko przy planie (miejsce niżej), 'noPlan' — tylko bez planu (miejsce wyżej) */ when: 'plan' | 'noPlan' }) {
  const th = useTheme(); const router = useRouter(); const once = useOnce(); const sum = planSummary(); const [open, setOpen] = useState(false);
  if (firstSteps() || (when === 'plan') !== !!sum) return null;
  const days = sum?.days ?? 0;
  const head = upperText(t('Planowanie'));
  const actions = <View style={{ gap: 8 }}>
    <Btn block title={t('+ Nowy szablon')} onPress={once(() => { const x = newTemplate(); router.push(`/template/${x.id}?edit=1&new=1`); })} />
    {/* „Plan z moich szablonów” (decyzja właściciela 09.10.2026 ok. 14:55, feat-plan-moje): generator w trybie własnych szablonów */}
    <Btn nav block title={t('Plan z moich szablonów')} onPress={() => router.push('/generator?mode=own')} />
    <Btn nav block kind="ghost" title={t('Wygeneruj szablony i plan')} onPress={() => router.push('/generator')} />
  </View>;
  return (
    <View testID="planning-card" style={{ marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: th.surface, borderWidth: 1, borderColor: th.line, gap: 10 }}>
      {sum ? <Pressable accessibilityLanguage={lang()} testID="planning-row" accessibilityRole="button" accessibilityState={{ expanded: open }}
        accessibilityLabel={t('Plan: {name} · {n} {d} · następny: {next}', { name: sum.name || t('Plan tygodnia'), n: sum.days, d: tp(days, 'dzień|dni|dni'), next: sum.next ? `${fmtDayKey(sum.next.date)} ${planTplName(sum.next.templateId)}` : '—' })}
        accessibilityHint={t('Rozwija planowanie.')} onPress={() => setOpen(!open)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, opacity: pressed ? 0.6 : 1 })}>
        <View style={{ flex: 1 }}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.semibold, fontSize: 16 }}>{t('Plan: {name}', { name: sum.name || t('Plan tygodnia') })}</Text>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, fontFamily: F.regular, fontSize: 13 }}>{`${sum.days} ${tp(days, 'dzień|dni|dni')} · ${t('następny: {next}', { next: sum.next ? `${fmtDayKey(sum.next.date)} ${planTplName(sum.next.templateId)}` : '—' })}`}</Text>
        </View>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accent, fontFamily: F.semibold, fontSize: 14 }}>{t('Planowanie')} {open ? '▾' : '›'}</Text>
      </Pressable>
        : <Text accessibilityLanguage={lang()} accessibilityRole="header" accessibilityLabel={head.label} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={[{ color: th.muted, fontSize: 13, fontFamily: F.semibold, letterSpacing: 0.5 }, head.style]}>{head.text}</Text>}
      {!sum || open ? actions : null}
    </View>);
}
