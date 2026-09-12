import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppText, Button, Card, Input, Notice, Screen, useAction } from '../components/UI';

export function SignInScreen() {
  const { signIn, register, busy } = useApp();
  const [create, setCreate] = useState(false);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const action = useAction();
  const submit = () => action.run(async () => {
    if (create) await register(name, email, password); else await signIn(email, password);
    setPassword('');
  }, '');
  return <Screen>
    <AppText heading>CareConnect</AppText>
    <AppText heading>{create ? 'Create your account' : 'Sign in'}</AppText>
    <Card tone="safety"><AppText>Coursework demo. Use fictional details only. Accounts and records stay on this device; no care team is connected.</AppText></Card>
    {create && <Input label="Full name" value={name} onChangeText={setName} maxLength={100} editable={!busy} />}
    <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} />
    <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" maxLength={128} editable={!busy} />
    {create && <AppText>Use 8 to 128 characters. After setup, open Settings to choose your preferences.</AppText>}
    <Notice message={action.notice} error={action.error} />
    <Button label={busy ? 'Please wait…' : create ? 'Create account and continue' : 'Sign in'} disabled={busy} onPress={() => { void submit(); }} />
    <Button label={create ? 'I already have an account' : 'Create a new account'} secondary disabled={busy} onPress={() => { setCreate(!create); setPassword(''); action.clear(); }} />
  </Screen>;
}
