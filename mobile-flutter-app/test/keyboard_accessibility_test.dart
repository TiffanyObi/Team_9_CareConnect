import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

class _MemorySettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async => value = settings;
}

void main() {
  void configureTablet(WidgetTester tester) {
    tester.view.physicalSize = const Size(1024, 768);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  testWidgets('auth fields follow reading order with Tab and Shift Tab', (
    tester,
  ) async {
    configureTablet(tester);
    await tester.pumpWidget(
      CareConnectApp(store: _MemorySettingsStore(), startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    final fields = find.byType(EditableText);
    await tester.tap(fields.at(0));
    expect(
      tester.widget<EditableText>(fields.at(0)).focusNode.hasFocus,
      isTrue,
    );

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(
      tester.widget<EditableText>(fields.at(1)).focusNode.hasFocus,
      isTrue,
    );

    await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
    await tester.pump();
    expect(
      tester.widget<EditableText>(fields.at(0)).focusNode.hasFocus,
      isTrue,
    );
  });

  testWidgets('keyboard traversal enters and leaves a modal without trapping', (
    tester,
  ) async {
    configureTablet(tester);
    await tester.pumpWidget(CareConnectApp(store: _MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.message_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.text('New message'));
    await tester.pumpAndSettle();

    final messageField = find.byType(EditableText);
    await tester.tap(messageField);
    expect(
      tester.widget<EditableText>(messageField).focusNode.hasFocus,
      isTrue,
    );

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('New message'), findsOneWidget);
    expect(find.text('Care team messages'), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    expect(FocusManager.instance.primaryFocus, isNotNull);
  });
}
