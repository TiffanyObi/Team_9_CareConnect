import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function CareConnect(): React.JSX.Element {
  const { settings } = useApp();
  const deviceTheme = useColorScheme();
  const useDark = settings.theme === 'dark' || (settings.theme === 'system' && deviceTheme === 'dark');
  const darkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: '#7DA7F7', background: '#101A26', card: '#182536', text: '#E8EEF7', border: '#647991', notification: '#8D153A' } };
  const lightTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: '#082B5F', background: '#F5F8FC', card: '#FFFFFF', text: '#10233F', border: '#A9B9CA', notification: '#8D153A' } };
  return <NavigationContainer theme={useDark ? darkTheme : lightTheme}><RootNavigator /></NavigationContainer>;
}

export default function App(): React.JSX.Element {
  return <SafeAreaProvider><AppProvider><CareConnect /></AppProvider></SafeAreaProvider>;
}
