import React, { useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import { AppText, Button, Card, Input, Notice, Screen, useAction } from '../components/UI';
import { RootParams, TabParams } from '../navigation/RootNavigator';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/theme';

export function CareScreen({ navigation }: BottomTabScreenProps<TabParams, 'Care'>) {
  const { data, addAppointment, busy } = useApp(); const action = useAction();
  const [showAdd, setShowAdd] = useState(false); const [title, setTitle] = useState(''); const [date, setDate] = useState(''); const [location, setLocation] = useState('');
  const save = async () => {
    if (await action.run(() => addAppointment(title, date, location), 'Appointment saved on this device.')) {
      setShowAdd(false); setTitle(''); setDate(''); setLocation('');
    }
  };
  return <Screen><AppText heading>Your appointments</AppText><AppText>Sample visits and appointments saved on this device</AppText>
    {data.appointments.map(appointment => <Card key={appointment.id}><AppText heading>{appointment.title}</AppText><AppText>{Number.isFinite(Date.parse(appointment.dateAndTime)) ? formatTime(appointment.dateAndTime) : appointment.dateAndTime}</AppText><AppText>{appointment.location}</AppText>
      <Button label={'View ' + appointment.title} secondary onPress={() => navigation.getParent()?.navigate('AppointmentDetail', { appointment })} />
    </Card>)}
    {showAdd ? <Card><AppText heading>Add appointment</AppText>
      <Input label="Appointment name" value={title} onChangeText={setTitle} maxLength={120} editable={!busy} />
      <Input label="Local date and time (YYYY-MM-DD HH:mm)" value={date} onChangeText={setDate} placeholder="2026-10-15 14:30" editable={!busy} />
      <Input label="Location" value={location} onChangeText={setLocation} maxLength={200} editable={!busy} />
      <Button label="Save appointment" disabled={busy} onPress={() => { void save(); }} />
      <Button label="Cancel appointment" secondary disabled={busy} onPress={() => { setShowAdd(false); action.clear(); }} />
    </Card> : <Button label="Add appointment" onPress={() => { action.clear(); setShowAdd(true); }} />}
    <Notice message={action.notice} error={action.error} />
    <Button label="Health log" secondary onPress={() => navigation.getParent()?.navigate('HealthLog')} />
    <Button label="Emergency assistance" danger onPress={() => navigation.getParent()?.navigate('Emergency')} />
  </Screen>;
}
export function AppointmentDetailScreen({ route, navigation }: NativeStackScreenProps<RootParams, 'AppointmentDetail'>) {
  const { appointment } = route.params;
  return <Screen><AppText heading>{appointment.title}</AppText><AppText>{appointment.dateAndTime}</AppText><AppText>{appointment.location}</AppText>
    <Card><AppText heading>Before you go</AppText><AppText>Review the time, location, and any instructions from your care team.</AppText></Card>
    <Button label="Record a health note" onPress={() => navigation.navigate('HealthLog')} />
    <Button label="Open messages" secondary onPress={() => navigation.navigate('Tabs', { screen: 'Messages' })} />
  </Screen>;
}
export function HealthLogScreen() {
  const { data, addLog, busy } = useApp(); const action = useAction();
  const [symptom, setSymptom] = useState(''); const [notes, setNotes] = useState('');
  const save = async () => {
    if (await action.run(() => addLog(symptom, notes), 'Health log saved on this device.')) { setSymptom(''); setNotes(''); }
  };
  return <Screen><AppText heading>How are you feeling?</AppText><AppText>Use fictional health information for this demo.</AppText>
    <Input label="Symptom" value={symptom} onChangeText={setSymptom} maxLength={120} editable={!busy} />
    <Input label="Notes (optional)" value={notes} onChangeText={setNotes} maxLength={2000} multiline editable={!busy} />
    <Button label="Save today’s log" disabled={busy} onPress={() => { void save(); }} /><Notice message={action.notice} error={action.error} />
    <AppText heading>Recent health logs</AppText>
    {data.logs.length === 0 ? <AppText>No symptoms logged yet.</AppText> : data.logs.map(log => <Card key={log.id}><AppText heading>{log.symptom}</AppText><AppText>{log.notes || 'No note added'}</AppText><AppText>{formatTime(log.recordedAt)}</AppText></Card>)}
  </Screen>;
}
export function EmergencyScreen() {
  const [confirm, setConfirm] = useState(false); const action = useAction();
  const openPhone = () => action.run(async () => {
    if (!await Linking.canOpenURL('tel:')) throw new Error('Phone dialing is unavailable here. Use a phone to contact your local emergency service.');
    await Linking.openURL('tel:');
    setConfirm(false);
  }, 'Phone app requested. No call has been placed or confirmed by CareConnect.');
  return <Screen><AppText heading>Emergency assistance</AppText>
    <Card tone="warning"><AppText>This demo cannot dispatch help or track a response. If you need urgent help, use your phone to contact your local emergency service.</AppText></Card>
    <Card><AppText>No location is collected or shared. No caregiver alert service is connected.</AppText></Card>
    {confirm ? <Card tone="safety"><AppText>Open your phone app? You must enter the number and place the call yourself.</AppText>
      <Button label="Confirm open phone" danger onPress={() => { void openPhone(); }} />
      <Button label="Cancel" secondary onPress={() => setConfirm(false)} />
    </Card> : <Button label="Open phone app" danger onPress={() => { action.clear(); setConfirm(true); }} />}
    <Notice message={action.notice} error={action.error} />
  </Screen>;
}
