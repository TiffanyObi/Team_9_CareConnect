import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, Card, Notice, Screen, useAction } from '../components/UI';
import { useApp } from '../context/AppContext';
import { medications } from '../utils/data';
import { formatTime } from '../utils/theme';
import { RootParams, TabParams } from '../navigation/RootNavigator';

export function MedicationsScreen({ navigation }: BottomTabScreenProps<TabParams, 'Medications'>) {
  const { data } = useApp();
  return <Screen><AppText heading>Medications</AppText><AppText>Your sample medication schedule</AppText>
    {medications.map(medication => <Card key={medication.id}><AppText heading>{medication.name}</AppText><AppText>{medication.dosage} • {medication.schedule}</AppText><Button label={'View ' + medication.name} secondary onPress={() => navigation.getParent()?.navigate('MedicationDetail', { medication })} /></Card>)}
    <AppText heading>Medication logs</AppText>
    {data.doses.length === 0 ? <AppText>No doses logged yet.</AppText> : data.doses.map(log => <Card key={log.id}>
      <AppText>{medications.find(medication => medication.id === log.medicationId)?.name} • {log.scheduledTime} dose</AppText>
      <AppText>Scheduled date: {log.date}</AppText><AppText>Recorded taken: {formatTime(log.takenAt)}</AppText>
    </Card>)}
  </Screen>;
}
export function MedicationDetailScreen({ route }: NativeStackScreenProps<RootParams, 'MedicationDetail'>) {
  const { medication } = route.params;
  const { data, markDose, busy, today } = useApp(); const action = useAction();
  return <Screen><AppText heading>{medication.name}</AppText><AppText>{medication.dosage} • {medication.schedule}</AppText>
    <Card><AppText heading>Instructions</AppText><AppText>{medication.instructions}</AppText></Card>
    <AppText heading>Doses for {today}</AppText>
    {medication.doses.map(time => {
      const log = data.doses.find(dose => dose.medicationId === medication.id && dose.scheduledTime === time && dose.date === today);
      return <Card key={time} tone="warning"><AppText>{time} scheduled dose</AppText><AppText>{log ? 'Recorded taken: ' + formatTime(log.takenAt) : 'Not logged'}</AppText>
        <Button label={log ? time + ' dose taken' : 'Mark ' + time + ' dose as taken'} disabled={busy || !!log} onPress={() => { void action.run(() => markDose(medication.id, time), time + ' dose saved.'); }} />
      </Card>;
    })}
    <Notice message={action.notice} error={action.error} />
    <Card tone="safety"><AppText>These are fictional demo medications. Recording a dose does not send information to a caregiver.</AppText></Card>
  </Screen>;
}
