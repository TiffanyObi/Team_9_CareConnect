import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function CareConnect(): React.JSX.Element {
  const { settings } = useApp();
  const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: '#245FCB', background: '#101A26', card: '#182536', text: '#E8EEF7', border: '#34465C', notification: '#8D153A' } };
  return <NavigationContainer theme={settings.theme === 'dark' ? theme : undefined}><RootNavigator /></NavigationContainer>;
}

export default function App(): React.JSX.Element {
  return <SafeAreaProvider><AppProvider><CareConnect /></AppProvider></SafeAreaProvider>;
}
