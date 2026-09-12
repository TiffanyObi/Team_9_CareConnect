import React from 'react';
import { Switch, View } from 'react-native';
import { AppText, Button, Card, Notice, Screen, useAction } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Settings } from '../types/models';

export function SettingsScreen() {
  const { settings, updateSettings, resetSettings, saveSettings, busy, reducedMotion } = useApp(); const action = useAction();
  const update = (change: Partial<Settings>) => { action.clear(); updateSettings(change); };
  return <Screen><AppText heading>Accessibility settings</AppText>
    <AppText>Preview changes, then save them for this account. No flashing or autoplay is used in any mode.</AppText>
    <Card><AppText heading>Visual preferences</AppText><AppText>Text size: {Math.round(settings.textScale * 100)}%</AppText>
      <Button label="Smaller text" secondary disabled={busy || settings.textScale <= 1} onPress={() => update({ textScale: Math.max(1, settings.textScale - 0.25) })} />
      <Button label="Larger text" secondary disabled={busy || settings.textScale >= 2} onPress={() => update({ textScale: Math.min(2, settings.textScale + 0.25) })} />
      <AppText>Theme: {settings.theme}</AppText>
      <Button label="Light" secondary disabled={busy} onPress={() => update({ theme: 'light' })} />
      <Button label="Dark" secondary disabled={busy} onPress={() => update({ theme: 'dark' })} />
      <Button label="Device" secondary disabled={busy} onPress={() => update({ theme: 'system' })} />
    </Card>
    <Card><AppText heading>Motion and feedback</AppText>
      <Setting title="Reduced motion" value={settings.reducedMotion} onChange={value => update({ reducedMotion: value })} />
      <AppText>{reducedMotion ? 'Screen transitions are off. Your phone’s motion preference is also respected.' : 'Standard screen transitions are enabled.'}</AppText>
      <AppText>All alerts remain static. Flashing alerts cannot be enabled.</AppText>
      <Setting title="Haptic feedback on successful saves" value={settings.hapticReminders} onChange={value => update({ hapticReminders: value })} />
      <AppText>Optional touch feedback; no scheduled reminders are sent.</AppText>
      <Setting title="Larger touch targets" value={settings.largeTouchTargets} onChange={value => update({ largeTouchTargets: value })} />
      <AppText>Buttons are at least 48 × 48 logical pixels in either mode.</AppText>
    </Card>
    <Card tone="warning"><AppText heading>Preview</AppText><AppText>Medication status will stay visible as plain text.</AppText></Card>
    <Notice message={action.notice} error={action.error} />
    <Button label={busy ? 'Saving…' : 'Save changes'} disabled={busy} onPress={() => { void action.run(saveSettings, 'Settings saved for this account.'); }} />
    <Button label="Reset to recommended settings" secondary disabled={busy} onPress={() => { resetSettings(); action.clear(); }} />
    <AppText>Reset changes the preview. Choose Save changes to keep it.</AppText>
  </Screen>;
}
function Setting({ title, value, onChange }: { title: string; value: boolean; onChange(value: boolean): void }) {
  const { busy } = useApp();
  return <View style={{ gap: 8 }}><AppText>{title}</AppText><Switch accessibilityLabel={title} value={value} onValueChange={onChange} disabled={busy} /></View>;
}
