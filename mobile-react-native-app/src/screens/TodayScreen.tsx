import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AppText, Button, Card, Screen } from '../components/UI';
import { useApp } from '../context/AppContext';
import { TabParams } from '../navigation/RootNavigator';
import { medications } from '../utils/data';

export function TodayScreen({ navigation }: BottomTabScreenProps<TabParams, 'Today'>) {
  const { userName, signOut, busy, data, today } = useApp();
  const taken = data.doses.filter(dose => dose.date === today).length;
  const total = medications.reduce((count, medication) => count + medication.doses.length, 0);
  return <Screen>
    <AppText heading>CareConnect</AppText><Button label="Log out" secondary disabled={busy} onPress={signOut} />
    <AppText heading>Hello, {userName}</AppText>
    <AppText>{today} • {taken} of {total} scheduled doses logged</AppText>
    <Card tone="warning"><AppText heading>Today’s medication</AppText><AppText>Review each scheduled dose before recording it.</AppText></Card>
    <Button label="Log medication" onPress={() => navigation.navigate('Medications')} />
    <Card><AppText heading>Care visits</AppText><AppText>{data.appointments.length} appointments in your local list.</AppText><Button label="View appointments" secondary onPress={() => navigation.navigate('Care')} /></Card>
    <Card tone="safety"><AppText>No caregiver sharing is active. Your saved demo records are available on this device only.</AppText></Card>
  </Screen>;
}
