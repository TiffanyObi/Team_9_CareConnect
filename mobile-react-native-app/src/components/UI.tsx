import React, { useEffect } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleProp, StyleSheet, Text, TextStyle, TextProps, useColorScheme, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, darkColors } from '../utils/theme';

export const minimumTouchTarget = 44;
export const preferredTouchTarget = 48;

export type CardTone = 'default' | 'info' | 'warning' | 'success';
export function useColors() { const { settings } = useApp(); const deviceTheme = useColorScheme(); const useDark = settings.theme === 'dark' || (settings.theme === 'system' && deviceTheme === 'dark'); return useDark ? darkColors : colors; }
export function Screen({ children }: { children: React.ReactNode }): React.JSX.Element { const c = useColors(); return <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, { backgroundColor: c.background }]}>{children}</SafeAreaView>; }
export function Card({ children, style, tone = 'default' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; label?: string; tone?: CardTone }): React.JSX.Element {
  const c = useColors(); const backgroundColor = { default: c.surface, info: c.safety, warning: c.warning, success: c.successSurface }[tone];
  return <View style={[styles.card, { backgroundColor, borderColor: c.border }, style]}>{children}</View>;
}
export function AppText({ children, style, heading = false, secondary = false, ...accessibilityProps }: { children: React.ReactNode; style?: StyleProp<TextStyle>; heading?: boolean; secondary?: boolean } & Pick<TextProps, 'accessibilityLiveRegion' | 'accessibilityLabel' | 'accessibilityRole'>): React.JSX.Element {
  const { settings } = useApp(); const c = useColors(); const customStyle = StyleSheet.flatten(style) || {}; const size = customStyle.fontSize ?? (heading ? 28 : 16);
  return <Text {...accessibilityProps} accessibilityRole={heading ? 'header' : accessibilityProps.accessibilityRole} maxFontSizeMultiplier={2} style={[{ color: secondary ? c.secondaryText : c.text, fontSize: size * settings.textScale, lineHeight: size * 1.5 * settings.textScale }, heading && styles.heading, style, { fontSize: size * settings.textScale, lineHeight: (customStyle.lineHeight ?? size * 1.5) * settings.textScale }]}>{children}</Text>;
}
export function Button({ label, onPress, secondary = false, danger = false, disabled = false, selected = false, accessibilityLabel, accessibilityHint, buttonRef }: { label: string; onPress?: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean; selected?: boolean; accessibilityLabel?: string; accessibilityHint?: string; buttonRef?: React.Ref<React.ElementRef<typeof Pressable>> }): React.JSX.Element {
  const { settings } = useApp(); const c = useColors(); const backgroundColor = danger ? colors.emergency : selected ? c.accent : secondary ? c.surface : c.primary;
  return <Pressable ref={buttonRef} accessible focusable={!disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityHint={accessibilityHint} accessibilityState={{ disabled, selected }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { minHeight: settings.largeTouchTargets ? 52 : preferredTouchTarget, minWidth: minimumTouchTarget, backgroundColor, borderColor: secondary && !selected ? c.primary : backgroundColor, opacity: disabled ? .42 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}><Text maxFontSizeMultiplier={2} style={{ color: danger ? '#FFFFFF' : selected ? c.onAccent : secondary ? c.primary : c.onPrimary, fontWeight: '700', fontSize: 16 * settings.textScale, lineHeight: 24 * settings.textScale }}>{label}</Text></Pressable>;
}
export const layout = StyleSheet.create({ content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 12, maxWidth: 760, width: '100%', alignSelf: 'center' }, title: { fontWeight: '700', fontSize: 18 }, section: { fontWeight: '800', fontSize: 20, marginTop: 8 } });
const styles = StyleSheet.create({ screen: { flex: 1 }, card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 4 }, heading: { fontWeight: '800' }, button: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, marginVertical: 4 } });

// Android observes the live region; iOS receives one announcement when text changes.
export function StatusMessage({ message, style }: { message: string; style?: StyleProp<TextStyle> }): React.JSX.Element {
  useEffect(() => { if (message && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(message); }, [message]);
  return <AppText accessibilityLiveRegion="polite" style={style}>{message}</AppText>;
}
