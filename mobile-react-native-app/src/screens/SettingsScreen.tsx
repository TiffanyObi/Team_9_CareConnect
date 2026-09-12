import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { AppText, Button, Card, Screen } from '../components/UI';
import { useApp } from '../context/AppContext';

export function SettingsScreen({ onboarding = false }: { onboarding?: boolean }): React.JSX.Element {
  const { settings, updateSettings, resetSettings, completeOnboarding } = useApp();
  const [saved, setSaved] = useState(false);
  const update = (change: Partial<typeof settings>) => { setSaved(false); updateSettings(change); };
  const save = () => { if (onboarding) completeOnboarding(); else setSaved(true); };
  return <Screen><ScrollView contentContainerStyle={s.content}>
    <AppText heading>{onboarding ? 'Make Safeview comfortable' : 'Accessibility settings'}</AppText>
    <AppText secondary>{onboarding ? 'Choose a safe starting environment. You can change it later.' : 'Changes preview immediately without animation.'}</AppText>
    {saved && <Card tone="success" label="Accessibility settings saved"><AppText style={s.darkText}>✓ Accessibility settings saved. Your preferences will be used on this device.</AppText></Card>}
    <Card>
      <AppText style={s.title}>Visual preferences</AppText>
      <AppText>Text size: {Math.round(settings.textScale * 100)}%</AppText>
      <View style={s.row}>
        <Button label="Smaller text" secondary disabled={settings.textScale <= 1} onPress={() => update({ textScale: Math.max(1, settings.textScale - .25) })} />
        <Button label="Larger text" secondary disabled={settings.textScale >= 2} onPress={() => update({ textScale: Math.min(2, settings.textScale + .25) })} />
      </View>
      <View style={s.row}>
        <Button label="Light" secondary selected={settings.theme === 'light'} onPress={() => update({ theme: 'light' })} />
        <Button label="Dark" secondary selected={settings.theme === 'dark'} onPress={() => update({ theme: 'dark' })} />
        <Button label="Device" secondary selected={settings.theme === 'system'} onPress={() => update({ theme: 'system' })} />
      </View>
    </Card>
    <Card><AppText style={s.title}>Safety and motion</AppText>
      <Setting title="Reduced motion" subtitle="Recommended for seizure safety" value={settings.reducedMotion} onChange={value => update({ reducedMotion: value })} />
      <Setting title="Static visual alerts" subtitle="No flashing or pulsing" value={settings.staticAlerts} onChange={value => update({ staticAlerts: value })} />
    </Card>
    <Card><AppText style={s.title}>Alerts and touch</AppText>
      <Setting title="Haptic reminders" subtitle="Paired with readable text" value={settings.hapticReminders} onChange={value => update({ hapticReminders: value })} />
      <Setting title="Larger touch targets" subtitle="Minimum 48 × 48 logical pixels" value={settings.largeTouchTargets} onChange={value => update({ largeTouchTargets: value })} />
    </Card>
    <Card style={s.preview}><AppText style={s.previewTitle}>Preview: Medication due</AppText><AppText style={s.previewText}>Levetiracetam • 8:00 AM</AppText></Card>
    <Button label={onboarding ? 'Save my preferences' : 'Save changes'} onPress={save} />
    <Button label="Reset to recommended safe settings" secondary onPress={() => { resetSettings(); setSaved(false); }} />
  </ScrollView></Screen>;
}

function Setting({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }): React.JSX.Element {
  return <View accessible accessibilityLabel={`${title}. ${subtitle}`} style={s.setting}><View style={s.settingText}><AppText style={s.settingTitle}>{title}</AppText><AppText secondary>{subtitle}</AppText></View><Switch accessibilityLabel={title} value={value} onValueChange={onChange} /></View>;
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, gap: 12, maxWidth: 760, width: '100%', alignSelf: 'center' },
  title: { fontWeight: '800', fontSize: 20, marginBottom: 8 },
  setting: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  settingText: { flex: 1 }, settingTitle: { fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  preview: { backgroundColor: '#101A26' }, previewTitle: { color: '#E8EEF7', fontWeight: '700' }, previewText: { color: '#AFC1D6' }, darkText: { color: '#10233F' },
});
