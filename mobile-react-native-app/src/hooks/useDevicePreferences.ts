import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, useColorScheme } from 'react-native';
import { Settings } from '../types/models';
import { localDay } from '../utils/theme';

export function useDevicePreferences(settings: Settings) {
  const scheme = useColorScheme();
  // Start with motion off until the platform preference has been read.
  const [deviceReducedMotion, setDeviceReducedMotion] = useState(true);
  const [today, setToday] = useState(() => localDay(new Date()));
  useEffect(() => {
    let active = true;
    const read = () => { void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (active) setDeviceReducedMotion(value);
    }).catch(() => { if (active) setDeviceReducedMotion(true); }); };
    read();
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setDeviceReducedMotion);
    const foreground = AppState.addEventListener('change', state => {
      if (state === 'active') { setToday(localDay(new Date())); read(); }
    });
    const timer = setInterval(() => setToday(localDay(new Date())), 30000);
    return () => { active = false; motion.remove(); foreground.remove(); clearInterval(timer); };
  }, []);
  return {
    dark: settings.theme === 'dark' || (settings.theme === 'system' && scheme === 'dark'),
    reducedMotion: settings.reducedMotion || deviceReducedMotion,
    today,
  };
}
