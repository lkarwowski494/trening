import { renderRouter, screen } from 'expo-router/testing-library';
import { act } from '@testing-library/react-native';

test('app starts on Train tab', async () => {
  renderRouter('./app', { initialUrl: '/' });
  expect(await screen.findByText('Zacznij z szablonu')).toBeTruthy();
});
