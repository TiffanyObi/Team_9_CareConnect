import React from 'react';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render, cleanupAsync } from '@testing-library/react-native';
import { safeSettings, useApp } from '../context/AppContext';
import { SignInScreen } from '../screens/SignInScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { MedicationsScreen, MedicationDetailScreen } from '../screens/MedicationScreens';
import { CareScreen, AppointmentDetailScreen, HealthLogScreen, EmergencyScreen } from '../screens/CareScreens';
import { MessagesScreen, MessageDetailScreen } from '../screens/MessageScreens';
import { SettingsScreen } from '../screens/SettingsScreen';
import { medications, appointments, messages } from '../utils/data';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '../navigation/RootNavigator';
import { Button, Screen } from '../components/UI';
import { writeFileSync } from 'fs';
type ReactTestInstance = ReturnType<typeof render>['UNSAFE_root'];

jest.mock('../context/AppContext', () => ({ ...jest.requireActual('../context/AppContext'), useApp: jest.fn() }));
const navigation = { navigate: jest.fn(), getParent: () => ({ navigate: jest.fn() }) };
function props<T>(extra = {}) { return { navigation, ...extra } as T; }
function luminance(hex: string) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[\da-f]{6}$/i.test(h)) throw new Error(`Unresolved color: ${hex}`);
  const c = h.match(/../g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
}
function ratio(a: string, b: string) { const x = [luminance(a), luminance(b)].sort((a,b) => b-a); return (x[0]+.05)/(x[1]+.05); }
type Row = { theme: string; screen: string; text: string; kind: string; foreground: string; background: string; ratio: number; minimum: number; exempt: boolean };
const rows: Row[] = [];
function inspect(root: ReactTestInstance, theme: string, name: string, iconsOnly = false) {
  // Host nodes only: composite nodes repeat the same style and must not be counted twice.
  for (const node of root.findAll((n: ReactTestInstance) => typeof n.type === 'string' && ['Text', 'TextInput'].includes(n.type))) {
    let parent: ReactTestInstance | null = node;
    let bg: string | undefined;
    let disabled = false;
    let hidden = false;
    const opacities: number[] = [];
    while (parent) {
      if (typeof parent.type === 'string') {
        const style = StyleSheet.flatten(parent.props.style) || {};
        if (style.backgroundColor && style.backgroundColor !== 'transparent') bg ??= style.backgroundColor;
        disabled ||= !!parent.props.accessibilityState?.disabled;
        hidden ||= parent.props.accessibilityElementsHidden === true || parent.props.importantForAccessibility === 'no-hide-descendants';
        // Enabled opacity changes need compositing; fail rather than report a false pass.
        hidden ||= style.opacity === 0 || style.display === 'none';
        if (style.opacity !== undefined) opacities.push(style.opacity);
      }
      parent = parent.parent;
    }
    if (hidden) continue;
    if (!disabled) for (const opacity of opacities) expect(opacity).toBe(1);
    const style = StyleSheet.flatten(node.props.style) || {};
    const text = node.props.accessibilityLabel || node.children.filter((c: unknown) => typeof c === 'string').join('');
    if (iconsOnly && !['⌂','✚','▦','✉','⚙'].includes(text)) continue;
    expect(bg).toBeTruthy();
    expect(style.color).toBeTruthy();
    const add = (kind: string, fg: string, minimum: number) => {
      const value = ratio(fg, bg!);
      rows.push({theme,screen:name,text,kind,foreground:fg,background:bg!,ratio:+value.toFixed(3),minimum,exempt:disabled});
      if (!disabled) expect({screen:name,text,kind,passes:value >= minimum}).toEqual({screen:name,text,kind,passes:true});
    };
    // Use the stricter normal-text threshold even for headings.
    add('text', style.color, 4.5);
    if (node.type === 'TextInput') {
      add('placeholder', node.props.placeholderTextColor, 4.5);
      add('input border against input fill', style.borderColor, 3);
    }
  }
}
afterAll(() => {
  if (process.env.CONTRAST_REPORT) writeFileSync(process.env.CONTRAST_REPORT, JSON.stringify({method:'RNTL host-tree styles; not native screenshot pixel sampling',rows}, null, 2)+'\n');
});
test.each(['light','dark'] as const)('%s rendered screen text, placeholders and input boundaries meet contrast thresholds', async theme => {
  jest.mocked(useApp).mockReturnValue({ settings:{...safeSettings,theme}, userName:'Olivia', logs:[], medicationLogs:[], isReady:true, isBusy:false, sessionStage:'signedIn', saveSettings:jest.fn(async () => {}), updateSettings:jest.fn(), signOut:jest.fn() } as unknown as ReturnType<typeof useApp>);
  const cases: [string, React.ReactElement, string?][] = [
    ['Sign in',<SignInScreen key="Sign in" />], ['Sign up',<SignInScreen key="Sign up" />,'Create a new account'],
    ['Today',<TodayScreen key="Today" {...props<React.ComponentProps<typeof TodayScreen>>()} />],
    ['Medications',<MedicationsScreen key="Medications" {...props<React.ComponentProps<typeof MedicationsScreen>>()} />],
    ['Medication detail',<MedicationDetailScreen key="Medication detail" {...props<React.ComponentProps<typeof MedicationDetailScreen>>({route:{params:{medication:medications[0]}}})} />],
    ['Care',<CareScreen key="Care" {...props<React.ComponentProps<typeof CareScreen>>()} />],
    ['Appointment dialog',<CareScreen key="Appointment dialog" {...props<React.ComponentProps<typeof CareScreen>>()} />,'Add appointment'],
    ['Appointment detail',<AppointmentDetailScreen key="Appointment detail" {...props<React.ComponentProps<typeof AppointmentDetailScreen>>({route:{params:{appointment:appointments[0]}}})} />],
    ['Health log',<HealthLogScreen key="Health log" />], ['Emergency',<EmergencyScreen key="Emergency" />],
    ['Messages',<MessagesScreen key="Messages" {...props<React.ComponentProps<typeof MessagesScreen>>()} />],
    ['Message dialog',<MessagesScreen key="Message dialog" {...props<React.ComponentProps<typeof MessagesScreen>>()} />,'New message'],
    ['Message detail',<MessageDetailScreen key="Message detail" {...props<React.ComponentProps<typeof MessageDetailScreen>>({route:{params:{message:messages[0]}}})} />],
    ['Settings',<SettingsScreen key="Settings" />],
    ['Onboarding',<SettingsScreen key="Onboarding" onboarding />],
    ['Saved confirmation',<SettingsScreen key="Saved confirmation" />,'Save changes'],
    ['Button states',<Screen key="Button states"><Button label="Primary" /><Button label="Secondary" secondary /><Button label="Selected" selected /><Button label="Danger" danger /><Button label="Disabled" disabled /></Screen>],
  ];
  for (const [name, element, open] of cases) {
    const view = render(element);
    await act(async () => {});
    if (open) { fireEvent.press(view.getByRole('button',{name:open})); await act(async () => {}); }
    inspect(view.UNSAFE_root,theme,name);
    if (name === 'Button states') {
      const buttons = view.UNSAFE_root.findAll((n: ReactTestInstance) => typeof n.props.style === 'function');
      expect(buttons).toHaveLength(5);
      for (const button of buttons) {
        const pressed = StyleSheet.flatten(button.props.style({pressed:true}));
        const text = button.findAll((n: ReactTestInstance) => n.type === 'Text')[0];
        const style = StyleSheet.flatten(text.props.style);
        const disabled = button.props.accessibilityState.disabled;
        const value = ratio(style.color, pressed.backgroundColor);
        rows.push({theme,screen:name,text:button.props.accessibilityLabel,kind:'pressed text (style callback)',foreground:style.color,background:pressed.backgroundColor,ratio:+value.toFixed(3),minimum:4.5,exempt:disabled});
        if (!disabled) { expect(pressed.opacity).toBe(1); expect(value).toBeGreaterThanOrEqual(4.5); }
      }
    }
    await cleanupAsync();
  }
  const nav = render(<NavigationContainer><RootNavigator /></NavigationContainer>);
  await act(async () => {});
  inspect(nav.UNSAFE_root,theme,'Selected and inactive tab icons',true);
  expect(rows.filter(r => r.theme === theme && r.screen === 'Selected and inactive tab icons')).toHaveLength(5);
  await cleanupAsync();
});
