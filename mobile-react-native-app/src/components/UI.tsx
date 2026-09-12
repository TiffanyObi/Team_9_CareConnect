import React, { useState } from 'react';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export function Screen({ children }: { children: React.ReactNode }) {
  const { palette } = useApp();
  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={[styles.screen, { backgroundColor: palette.background }]}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}</ScrollView>
  </SafeAreaView>;
}
export function Card({ children, tone = 'surface', style }: { children: React.ReactNode; tone?: 'surface' | 'safety' | 'warning'; style?: StyleProp<ViewStyle> }) {
  const { palette } = useApp();
  // Do not group nested buttons into a single accessible element.
  return <View style={[styles.card, { backgroundColor: palette[tone], borderColor: palette.border }, style]}>{children}</View>;
}
export function AppText({ children, style, heading = false }: { children: React.ReactNode; style?: StyleProp<TextStyle>; heading?: boolean }) {
  const { palette, settings } = useApp();
  const resolved = StyleSheet.flatten(style) ?? {};
  const fontSize = (resolved.fontSize ?? (heading ? 28 : 16)) * settings.textScale;
  const lineHeight = Math.max((resolved.lineHeight ?? (heading ? 36 : 24)) * settings.textScale, fontSize * 1.3);
  return <Text accessibilityRole={heading ? 'header' : undefined} style={[{ color: palette.text, fontWeight: heading ? '800' : '400' }, style, { fontSize, lineHeight }]}>{children}</Text>;
}
export function Button({ label, onPress, secondary = false, danger = false, disabled = false }: { label: string; onPress?: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean }) {
  const { settings, palette } = useApp();
  const backgroundColor = danger ? palette.emergency : secondary ? palette.surface : palette.primary;
  const foreground = danger ? '#FFFFFF' : secondary ? palette.primary : palette.background;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={[styles.button, { minHeight: settings.largeTouchTargets ? 56 : 48, minWidth: 48, backgroundColor, borderColor: palette.primary, opacity: disabled ? 0.6 : 1 }]}>
    <AppText style={{ color: foreground, fontWeight: '700', textAlign: 'center' }}>{label}</AppText>
  </Pressable>;
}
export function Input({ label, multiline, ...props }: TextInputProps & { label: string }) {
  const { settings, palette } = useApp();
  return <View style={styles.field}>
    <AppText style={{ fontWeight: '700' }}>{label}</AppText>
    <TextInput accessibilityLabel={label} placeholderTextColor={palette.secondaryText} multiline={multiline}
      style={[styles.input, { backgroundColor: palette.surface, color: palette.text, borderColor: palette.border, fontSize: 16 * settings.textScale }, multiline && { minHeight: 110, textAlignVertical: 'top' }]} {...props} />
  </View>;
}
export function Notice({ message, error = false }: { message: string; error?: boolean }) {
  return message ? <View accessibilityRole={error ? 'alert' : undefined} accessibilityLiveRegion="polite"><Card tone={error ? 'warning' : 'safety'}><AppText>{message}</AppText></Card></View> : null;
}
export function useAction() {
  const [notice, setNotice] = useState(''); const [error, setError] = useState(false);
  async function run(action: () => Promise<void>, success: string) {
    setNotice(''); setError(false);
    try { await action(); setNotice(success); return true; }
    catch (reason) { setError(true); setNotice(reason instanceof Error ? reason.message : 'Could not save. Please try again.'); return false; }
  }
  return { notice, error, run, clear: () => { setNotice(''); setError(false); } };
}
const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { flexGrow: 1, padding: 20, gap: 12, maxWidth: 760, width: '100%', alignSelf: 'center' },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 8 },
  button: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginVertical: 4 },
  field: { gap: 6 }, input: { borderWidth: 1, borderRadius: 10, minHeight: 52, padding: 12 },
});
