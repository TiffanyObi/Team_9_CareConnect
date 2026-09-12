import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export function CareConnect() {
  const { palette } = useApp();
  const dark = palette.background === '#101A26';
  const base = dark ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, primary: palette.primary, background: palette.background, card: palette.surface, text: palette.text, border: palette.border, notification: palette.emergency } };
  return <NavigationContainer theme={theme}><StatusBar barStyle={dark ? 'light-content' : 'dark-content'} animated={false} /><RootNavigator /></NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><AppProvider><CareConnect /></AppProvider></SafeAreaProvider>;
}
