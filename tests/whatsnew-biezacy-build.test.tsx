/* Test na telefonie, build 1030 (23.10.2026): „Co nowego” pokazywało „Wersja testowa 1018” mimo zainstalowanego buildu 1030. Przyczyna: tytuł najnowszego wpisu brał
 * numer buildu z literału w lib/whatsnew.ts (dopisywanego ręcznie przy wydaniu — 1018 z 19.10.2026), a kolejne buildy tej samej wersji 0.20.0 nie miały wpisu.
 * Teraz tytuł najnowszego wpisu to wersja i numer URUCHOMIONEGO buildu (lib/version.ts, jak „O aplikacji”); starsze wpisy zostają historyczne. */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Constants from 'expo-constants';
import { fresh } from './helpers';
import { t } from '@/lib/i18n';
import { WHATS_NEW } from '@/lib/whatsnew';
import { versionLabel } from '@/lib/version';

let mockBuild: string | undefined;
jest.mock('@/lib/version', () => new Proxy(jest.requireActual('@/lib/version'), { get: (t, k) => (k === 'BUILD_NUMBER' ? mockBuild : t[k as string]) }));
jest.mock('expo-router', () => ({ ...jest.requireActual('expo-router'), useRouter: () => ({ push: jest.fn() }) }));

const open = async () => { await fresh(); const { WhatsNewPanel } = require('@/components/WhatsNew'); render(<WhatsNewPanel onClose={() => {}} />); };

describe('„Co nowego”: tytuł najnowszego wpisu = uruchomiony build', () => {
  test('build z CI (1030): „0.20.0 (1030)”, bez „1018” w tytule najnowszego wpisu', async () => {
    mockBuild = '1030'; await open();
    expect(screen.getByText(`${versionLabel(Constants.expoConfig?.version, "1030")}`)).toBeTruthy(); expect(screen.queryByText(/Wersja testowa 1018/)).toBeNull();
  });
  test('starsze wpisy zostają historyczne (własny numer buildu)', async () => {
    mockBuild = '1030'; await open(); expect(screen.getByLabelText(new RegExp(`${WHATS_NEW[1].build}`))).toBeTruthy();
  });
  test('poza CI (bez numeru buildu): jak dotąd — „Wersja testowa 1018 · data”', async () => {
    mockBuild = undefined; await open(); expect(screen.getByText(new RegExp(`Wersja testowa ${WHATS_NEW[0].build} · `))).toBeTruthy();
  });
  test('numer buildu starszy niż wpis (np. 1010) nie cofa tytułu: zostaje numer wpisu', async () => {
    mockBuild = '1010'; await open(); expect(screen.getByText(new RegExp(`Wersja testowa ${WHATS_NEW[0].build} · `))).toBeTruthy();
  });
  test('śmieciowy numer buildu ignorowany', async () => {
    mockBuild = 'abc'; await open(); expect(screen.getByText(new RegExp(`Wersja testowa ${WHATS_NEW[0].build} · `))).toBeTruthy(); void t;
  });
});
