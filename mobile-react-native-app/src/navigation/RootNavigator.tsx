import React from 'react';
import { Text } from 'react-native';
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
export type TabParams = { Today: undefined; Medications: undefined; Care: undefined; Messages: undefined; Settings: undefined };
export type RootParams = { Tabs: NavigatorScreenParams<TabParams>; MedicationDetail: { medication: Medication }; AppointmentDetail: { appointment: Appointment }; MessageDetail: { message: CareMessage }; HealthLog: undefined; Emergency: undefined };
const Stack = createNativeStackNavigator<RootParams>(); const Tabs = createBottomTabNavigator<TabParams>();
function TabIcon({ symbol, color }: { symbol: string; color: string }): React.JSX.Element { return <Text accessible={false} style={{ color, fontSize: 20 }}>{symbol}</Text>; }
function Workspace(): React.JSX.Element { return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarAccessibilityLabel: `${route.name} tab`, tabBarIcon: ({ color }) => <TabIcon color={color} symbol={({ Today: '⌂', Medications: '▣', Care: '▦', Messages: '✉', Settings: '⚙' } as Record<string, string>)[route.name]} /> })}><Tabs.Screen name="Today" component={TodayScreen} /><Tabs.Screen name="Medications" component={MedicationsScreen} options={{ title: 'Meds' }} /><Tabs.Screen name="Care" component={CareScreen} /><Tabs.Screen name="Messages" component={MessagesScreen} /><Tabs.Screen name="Settings" component={SettingsScreen} /></Tabs.Navigator>; }
export function RootNavigator(): React.JSX.Element { const { signedIn } = useApp(); if (!signedIn) return <SignInScreen />; return <Stack.Navigator><Stack.Screen name="Tabs" component={Workspace} options={{ headerShown: false }} /><Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} options={{ title: 'Medication details' }} /><Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ title: 'Appointment details' }} /><Stack.Screen name="MessageDetail" component={MessageDetailScreen} options={{ title: 'Message' }} /><Stack.Screen name="HealthLog" component={HealthLogScreen} options={{ title: 'Health log' }} /><Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency assistance' }} /></Stack.Navigator>; }
