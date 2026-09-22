import React from 'react';
import { render } from '@testing-library/react-native';
import { RootNavigator } from '../navigation/RootNavigator';
import { safeSettings, useApp } from '../context/AppContext';
import { colors, darkColors } from '../utils/theme';

const mockNavigator = jest.fn(({ children }) => children);
jest.mock('@react-navigation/native-stack', () => ({ createNativeStackNavigator: () => ({ Navigator: (props: unknown) => mockNavigator(props), Screen: () => null }) }));
jest.mock('../context/AppContext', () => ({ ...jest.requireActual('../context/AppContext'), useApp: jest.fn() }));

test('reduced motion disables actual native stack animation options', () => {
  const state = { sessionStage: 'signedIn', isReady: true, settings: { ...safeSettings, reducedMotion: true } };
  jest.mocked(useApp).mockReturnValue(state as ReturnType<typeof useApp>);
  const view = render(<RootNavigator />);
  expect(mockNavigator.mock.calls.at(-1)?.[0].screenOptions.animation).toBe('none');
  jest.mocked(useApp).mockReturnValue({ ...state, settings: { ...state.settings, reducedMotion: false } } as ReturnType<typeof useApp>);
  view.rerender(<RootNavigator />);
  expect(mockNavigator.mock.calls.at(-1)?.[0].screenOptions.animation).toBe('default');
});

function luminance(hex: string): number {
  const rgb = hex.slice(1).match(/../g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
function ratio(a: string, b: string): number {
  const l = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l[0] + .05) / (l[1] + .05);
}
test.each([['light', colors], ['dark', darkColors]] as const)('%s text and enabled action colors meet normal-text contrast', (_name, c) => {
  for (const [fg, bg] of [[c.text, c.surface], [c.secondaryText, c.surface], [c.onPrimary, c.primary], [c.onAccent, c.accent], ['#FFFFFF', c.emergency]]) {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  }
});
