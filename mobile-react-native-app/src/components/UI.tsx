import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, useColorScheme, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, darkColors } from '../utils/theme';

export type CardTone = 'default' | 'info' | 'warning' | 'success';
export function useColors() { const { settings } = useApp(); const deviceTheme = useColorScheme(); const useDark = settings.theme === 'dark' || (settings.theme === 'system' && deviceTheme === 'dark'); return useDark ? darkColors : colors; }
export function Screen({ children }: { children: React.ReactNode }): React.JSX.Element { const c = useColors(); return <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, { backgroundColor: c.background }]}>{children}</SafeAreaView>; }
export function Card({ children, style, label, tone = 'default' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; label?: string; tone?: CardTone }): React.JSX.Element {
  const c = useColors(); const backgroundColor = { default: c.surface, info: c.safety, warning: c.warning, success: c.successSurface }[tone];
  return <View accessible={Boolean(label)} accessibilityLabel={label} style={[styles.card, { backgroundColor, borderColor: c.border }, style]}>{children}</View>;
}
export function AppText({ children, style, heading = false, secondary = false }: { children: React.ReactNode; style?: StyleProp<TextStyle>; heading?: boolean; secondary?: boolean }): React.JSX.Element {
  const { settings } = useApp(); const c = useColors(); const size = heading ? 28 : 16;
  return <Text accessibilityRole={heading ? 'header' : undefined} maxFontSizeMultiplier={2} style={[{ color: secondary ? c.secondaryText : c.text, fontSize: size * settings.textScale, lineHeight: size * 1.5 * settings.textScale }, heading && styles.heading, style]}>{children}</Text>;
}
export function Button({ label, onPress, secondary = false, danger = false, disabled = false, selected = false }: { label: string; onPress?: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean; selected?: boolean }): React.JSX.Element {
  const { settings } = useApp(); const c = useColors(); const backgroundColor = danger ? colors.emergency : selected ? c.accent : secondary ? c.surface : c.primary;
  return <Pressable accessible accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { minHeight: settings.largeTouchTargets ? 52 : 48, backgroundColor, borderColor: secondary && !selected ? c.primary : backgroundColor, opacity: disabled ? .42 : pressed ? .7 : 1 }]}><Text maxFontSizeMultiplier={2} style={{ color: selected ? '#FFFFFF' : secondary ? c.primary : '#FFFFFF', fontWeight: '700', fontSize: 16 * settings.textScale, lineHeight: 24 * settings.textScale }}>{label}</Text></Pressable>;
}
export const layout = StyleSheet.create({ content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 12, maxWidth: 760, width: '100%', alignSelf: 'center' }, title: { fontWeight: '700', fontSize: 18 }, section: { fontWeight: '800', fontSize: 20, marginTop: 8 } });
const styles = StyleSheet.create({ screen: { flex: 1 }, card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 4 }, heading: { fontWeight: '800' }, button: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, marginVertical: 4 } });
