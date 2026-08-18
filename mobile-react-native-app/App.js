import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#eef6ff" />
      <View style={styles.header}>
        <Text style={styles.logo}><Text style={styles.logoAccent}>Care</Text>Connect</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.platform}>REACT NATIVE + EXPO</Text>
        <Text accessibilityRole="header" style={styles.title}>Hello, SWEN 661!</Text>
        <Text style={styles.lead}>The Team 9 React Native starter is running successfully.</Text>
        <View accessibilityRole="alert" style={styles.status}>
          <Text style={styles.check}>✓</Text>
          <Text style={styles.statusText}>Visual safety: no animation, autoplay, or flashing effects.</Text>
        </View>
      </View>
      <Text style={styles.footer}>Team 9 · Care Recipient UI{`\n`}Photosensitive Epilepsy</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#eef6ff', paddingVertical: 34, paddingHorizontal: 18, alignItems: 'center' },
  logo: { color: '#082b5f', fontSize: 42, fontWeight: '800', letterSpacing: -2 },
  logoAccent: { color: '#0b9f9a' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 30 },
  platform: { color: '#3e5d7d', fontSize: 13, fontWeight: '700', letterSpacing: 1.4, textAlign: 'center', marginBottom: 14 },
  title: { color: '#082b5f', fontSize: 43, fontWeight: '800', letterSpacing: -1.7, lineHeight: 49, textAlign: 'center' },
  lead: { color: '#082b5f', fontSize: 21, fontWeight: '600', lineHeight: 30, textAlign: 'center', marginTop: 24, marginBottom: 38 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 18, borderWidth: 3, borderColor: '#0b9f9a', borderRadius: 20, backgroundColor: '#f2fbfb', padding: 22 },
  check: { color: '#0b9f9a', fontSize: 36, fontWeight: '900' },
  statusText: { flex: 1, color: '#082b5f', fontSize: 17, fontWeight: '700', lineHeight: 24 },
  footer: { color: '#516b85', fontSize: 13, lineHeight: 19, textAlign: 'center', paddingBottom: 22 },
});
