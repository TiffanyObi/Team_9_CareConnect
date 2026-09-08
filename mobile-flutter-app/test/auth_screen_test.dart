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
  testWidgets('sign-in and account creation flows are available', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      CareConnectApp(store: _MemorySettingsStore(), startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    expect(find.text('Sign in'), findsWidgets);
    expect(find.text('After sign in'), findsOneWidget);
    await tester.tap(find.text('Create a new account'));
    await tester.pumpAndSettle();

    expect(find.text('Create your account'), findsOneWidget);
    expect(find.text('Full name'), findsOneWidget);
    expect(find.text('Confirm password'), findsOneWidget);
    expect(find.text('Privacy'), findsOneWidget);
  });

  testWidgets('valid sign in opens the Today workspace', (tester) async {
    await tester.pumpWidget(
      CareConnectApp(store: _MemorySettingsStore(), startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(EditableText).at(0),
      'olivia@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(1), 'password');
    await tester.tap(find.text('Sign in').last);
    await tester.pumpAndSettle();

    expect(find.text('Good morning, Olivia'), findsOneWidget);
  });

  testWidgets('auth screens reflow at 200 percent text scale', (tester) async {
    tester.view.physicalSize = const Size(412, 915);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final store = _MemorySettingsStore()
      ..value = const AccessibilitySettings(textScale: 2);

    await tester.pumpWidget(
      CareConnectApp(store: store, startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.text('Sign in'), findsWidgets);
  });
}
