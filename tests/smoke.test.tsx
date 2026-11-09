import { renderRouter, screen } from 'expo-router/testing-library';
import { act } from '@testing-library/react-native';

/* SDK 56: przy zimnej pamięci podręcznej Jesta (CI, `jest --clearCache`) pierwsze renderRouter kompiluje w treści testu ekrany
 * aplikacji i rozwidlenie React Navigation wewnątrz expo-router (źródła TS z expo-router/src) — na 2 rdzeniach ok. 5,3 s, czyli
 * ponad domyślne 5 s Jesta. Z ciepłą pamięcią test trwa ok. 0,6 s. Dłuższy limit czasu tylko tutaj; asercja bez zmian. */
test('app starts on Train tab', async () => {
  await renderRouter('./app', { initialUrl: '/' });
  expect(await screen.findByLabelText('Zacznij pierwszy trening')).toBeTruthy(); /* 11.10.2026: świeża instalacja ma duży przycisk startu; 05.11.2026 (docs/18, ekran nowej osoby 1.1): nowa osoba widzi „Zacznij pierwszy trening” zamiast „Pusty trening” */
}, 30000);
