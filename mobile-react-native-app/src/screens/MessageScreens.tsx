import React, { useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, Card, Input, Notice, Screen, useAction } from '../components/UI';
import { useApp } from '../context/AppContext';
import { RootParams, TabParams } from '../navigation/RootNavigator';
import { formatTime } from '../utils/theme';

export function MessagesScreen({ navigation }: BottomTabScreenProps<TabParams, 'Messages'>) {
  const { data, addMessage, busy } = useApp(); const action = useAction();
  const [compose, setCompose] = useState(false); const [subject, setSubject] = useState(''); const [body, setBody] = useState('');
  const save = async () => {
    if (await action.run(() => addMessage(subject, body), 'Draft saved on this device. It has not been sent.')) {
      setCompose(false); setSubject(''); setBody('');
    }
  };
  return <Screen><AppText heading>Care team messages</AppText>
    <Card tone="safety"><AppText>Sample messages and your local drafts. No messages or notifications are sent to a care team.</AppText></Card>
    {data.messages.map(message => <Card key={message.id}><AppText heading>{message.subject}</AppText><AppText>{message.sender}</AppText>
      <Button label={'Open ' + message.subject} secondary onPress={() => navigation.getParent()?.navigate('MessageDetail', { message })} />
    </Card>)}
    {compose ? <Card><AppText heading>New local draft</AppText>
      <Input label="Subject" value={subject} onChangeText={setSubject} maxLength={120} editable={!busy} />
      <Input label="Message" value={body} onChangeText={setBody} maxLength={2000} multiline editable={!busy} />
      <Button label="Save draft" disabled={busy} onPress={() => { void save(); }} />
      <Button label="Cancel draft" secondary disabled={busy} onPress={() => { setCompose(false); action.clear(); }} />
    </Card> : <Button label="New message" onPress={() => { action.clear(); setCompose(true); }} />}
    <Notice message={action.notice} error={action.error} />
  </Screen>;
}
export function MessageDetailScreen({ route }: NativeStackScreenProps<RootParams, 'MessageDetail'>) {
  const { message } = route.params;
  return <Screen><AppText heading>{message.subject}</AppText><AppText>From {message.sender}</AppText>
    {message.localOnly && <Notice message="Local draft only. This message has not been sent." />}
    {message.createdAt && <AppText>{formatTime(message.createdAt)}</AppText>}<AppText>{message.body}</AppText>
  </Screen>;
}
