import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { SignInScreen } from '../screens/SignInScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { MedicationsScreen, MedicationDetailScreen } from '../screens/MedicationScreens';
import { CareScreen, AppointmentDetailScreen, HealthLogScreen, EmergencyScreen } from '../screens/CareScreens';
import { MessagesScreen, MessageDetailScreen } from '../screens/MessageScreens';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Appointment, CareMessage, Medication } from '../types/models';
import { colors, darkColors } from '../utils/theme';
export type TabParams = { Today: undefined; Medications: undefined; Care: undefined; Messages: undefined; Settings: undefined };
export type RootParams = { Tabs: NavigatorScreenParams<TabParams>; MedicationDetail: { medication: Medication }; AppointmentDetail: { appointment: Appointment }; MessageDetail: { message: CareMessage }; HealthLog: undefined; Emergency: undefined };
const Stack = createNativeStackNavigator<RootParams>(); const Tabs = createBottomTabNavigator<TabParams>();
function TabIcon({ symbol, color, focused }: { symbol: string; color: string; focused: boolean }): React.JSX.Element { return <View style={[styles.iconTarget, focused && styles.selectedIcon]}><Text accessible={false} style={{ color, fontSize: 23, fontWeight: focused ? '800' : '500' }}>{symbol}</Text></View>; }
function Workspace(): React.JSX.Element { const { settings } = useApp(); const c = settings.theme === 'dark' ? darkColors : colors; return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarShowLabel: false, tabBarActiveTintColor: '#FFFFFF', tabBarInactiveTintColor: c.secondaryText, tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, minHeight: 68 }, tabBarAccessibilityLabel: `${route.name} tab`, tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} symbol={({ Today: '⌂', Medications: '✚', Care: '▦', Messages: '✉', Settings: '⚙' } as Record<string, string>)[route.name]} /> })}><Tabs.Screen name="Today" component={TodayScreen} /><Tabs.Screen name="Medications" component={MedicationsScreen} options={{ title: 'Meds' }} /><Tabs.Screen name="Care" component={CareScreen} /><Tabs.Screen name="Messages" component={MessagesScreen} /><Tabs.Screen name="Settings" component={SettingsScreen} /></Tabs.Navigator>; }
export function RootNavigator(): React.JSX.Element { const { sessionStage } = useApp(); if (sessionStage === 'signedOut') return <SignInScreen />; if (sessionStage === 'accessibilitySetup') return <SettingsScreen onboarding />; return <Stack.Navigator><Stack.Screen name="Tabs" component={Workspace} options={{ headerShown: false }} /><Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} options={{ title: 'Medication details' }} /><Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ title: 'Appointment details' }} /><Stack.Screen name="MessageDetail" component={MessageDetailScreen} options={{ title: 'Message' }} /><Stack.Screen name="HealthLog" component={HealthLogScreen} options={{ title: 'Health log' }} /><Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency assistance' }} /></Stack.Navigator>; }
const styles = StyleSheet.create({ iconTarget: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, selectedIcon: { backgroundColor: '#245FCB' } });
