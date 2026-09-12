import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, AppState, AppStateStatus } from 'react-native';
import { Settings } from '../types/models';
import { useDevicePreferences } from '../hooks/useDevicePreferences';
import { safeSettings } from '../storage/appRepository';

afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });
test('honors app and system motion settings and removes native listeners', async () => {
  let onMotion: (value: boolean) => void = () => undefined;
  let onState: (value: AppStateStatus) => void = () => undefined;
  const removeMotion = jest.fn(); const removeState = jest.fn();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, callback) => { onMotion = callback as unknown as typeof onMotion; return { remove: removeMotion } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>; });
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => { onState = callback; return { remove: removeState }; });
  const view = renderHook<ReturnType<typeof useDevicePreferences>, { settings: Settings }>(({ settings }) => useDevicePreferences(settings), { initialProps: { settings: { ...safeSettings, reducedMotion: false } } });
  await waitFor(() => expect(view.result.current.reducedMotion).toBe(false));
  act(() => onMotion(true)); expect(view.result.current.reducedMotion).toBe(true);
  view.rerender({ settings: { ...safeSettings, theme: 'dark', reducedMotion: true } });
  expect(view.result.current.dark).toBe(true);
  act(() => onState('active'));
  await waitFor(() => expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalledTimes(2));
  expect(view.result.current.reducedMotion).toBe(true);
  view.unmount(); expect(removeMotion).toHaveBeenCalled(); expect(removeState).toHaveBeenCalled();
});
test('failed platform lookup retains motion-off behavior', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockRejectedValue(new Error('unavailable'));
  const view = renderHook(() => useDevicePreferences({ ...safeSettings, reducedMotion: false }));
  await act(async () => {}); expect(view.result.current.reducedMotion).toBe(true);
});
