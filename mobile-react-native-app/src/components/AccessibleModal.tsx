import React, { useRef } from 'react';
import { AccessibilityInfo, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, useColors } from './UI';
import { useApp } from '../context/AppContext';
export type TriggerRef = React.RefObject<React.ElementRef<typeof Pressable> | null>;
// Native Modal owns the window; callers also hide background descendants.
// Actual reader containment and focus timing still need device checks.
export function AccessibleModal({ visible, title, onClose, returnFocusRef, children }: {
  visible: boolean; title: string; onClose: () => void; returnFocusRef: TriggerRef; children: React.ReactNode;
}): React.JSX.Element {
  const heading = useRef<Text>(null); const c = useColors(); const { settings } = useApp();
  const restoreFocus = () => { if (returnFocusRef.current) AccessibilityInfo.sendAccessibilityEvent(returnFocusRef.current, 'focus'); };
  const close = () => { onClose(); if (Platform.OS === 'android') requestAnimationFrame(restoreFocus); };
  return <Modal visible={visible} transparent animationType="none" onRequestClose={close} onDismiss={restoreFocus}
    onShow={() => { if (heading.current) AccessibilityInfo.sendAccessibilityEvent(heading.current, 'focus'); }}>
    <View style={styles.overlay} accessibilityViewIsModal onAccessibilityEscape={close}>
      <Card><Text ref={heading} accessible accessibilityRole="header" maxFontSizeMultiplier={2}
        style={{ color: c.text, fontSize: 28 * settings.textScale, lineHeight: 42 * settings.textScale, fontWeight: '800' }}>{title}</Text>
        {children}<Button label="Cancel" accessibilityHint={`Closes ${title.toLowerCase()} without saving`} secondary onPress={close} />
      </Card>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({ overlay: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 24 } });
