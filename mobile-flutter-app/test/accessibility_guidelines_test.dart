import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class _MemorySettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async => value = settings;
}

void main() {
  Future<void> expectAutomatedGuidelines(WidgetTester tester) async {
    await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
    await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
    await expectLater(tester, meetsGuideline(textContrastGuideline));
  }

  testWidgets('Today meets automated accessibility guidelines', (tester) async {
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(CareConnectApp(store: _MemorySettingsStore()));
      await tester.pumpAndSettle();

      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('Accessibility Settings meets automated guidelines', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(CareConnectApp(store: _MemorySettingsStore()));
      await tester.pumpAndSettle();
      await tester.drag(
        find.byKey(const Key('today-scroll-view')),
        const Offset(0, -300),
      );
      await tester.pumpAndSettle();
      await tester.tap(
        find.widgetWithText(OutlinedButton, 'Accessibility settings'),
      );
      await tester.pumpAndSettle();

      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });
}
