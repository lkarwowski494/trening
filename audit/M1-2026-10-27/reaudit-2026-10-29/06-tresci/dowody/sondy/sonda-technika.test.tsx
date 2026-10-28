import React from 'react';
import { render } from '@testing-library/react-native';
import { ExerciseCues, TechniqueLink } from '@/components/ExerciseCues';
import { hasTechnique } from '@/lib/figures/v2/ui';
import { CATALOG } from '@/lib/catalog.generated';
import { CUE_DATA } from '@/lib/cues';
import { applyLang } from '@/lib/i18n';
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
beforeAll(() => applyLang('pl'));
test('sonda: hasTechnique ⇒ sekcja Technika', () => {
  const zle: string[] = [];
  for (const k of Object.keys(CATALOG)) {
    const e = { lib: true as const, libKey: k };
    if (!hasTechnique(e)) continue;
    const r = render(<ExerciseCues exercise={e} initialOpen />);
    if (!r.queryByTestId('exercise-cues')) zle.push(`${k} | safety=${!!r.queryByTestId('exercise-safety')}`);
    r.unmount();
  }
  console.log('hasTechnique bez sekcji Technika:\n' + zle.join('\n'));
  for (const k of ['JM Press', 'Decline Close-Grip Bench To Skull Crusher', 'Hack Squat']) {
    const r = render(<TechniqueLink exercise={{ id: 'x', lib: true, libKey: k } as never} name={k} />);
    console.log(`TechniqueLink ${k}: przycisk=${!!r.queryByLabelText(`Technika: ${k}`)}`);
    r.unmount();
  }
  console.log('hidden: ' + JSON.stringify((CUE_DATA as unknown as { hidden: string[] }).hidden));
});
