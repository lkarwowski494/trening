import { useColorScheme } from 'react-native';

export const dark = { bg: '#12151c', surface: '#1a1e28', surface2: '#222736', line: '#2c3243', text: '#e9ebf1', muted: '#8b91a3', accent: '#f2b441', accentInk: '#1a1400', done: '#26301f', doneLine: '#4b6a2c', danger: '#ec7a72', band: '#5fc3c9' };
/** Jasny motyw: akcent, kolor gum/PR i „niebezpieczne” przyciemnione pod kontrast na jasnym tle (audyt 0.8.1 — wcześniej 1,7–2:1). */
export const light = { ...dark, bg: '#f5f6f8', surface: '#ffffff', surface2: '#eef0f4', line: '#d9dce3', text: '#171a21', muted: '#5f6577', accent: '#9a6200', accentInk: '#ffffff', done: '#eaf3df', doneLine: '#6e9a43', danger: '#b3261e', band: '#136f75' };
export type Theme = typeof dark;
export function useTheme(): Theme { return useColorScheme() === 'light' ? light : dark; }
