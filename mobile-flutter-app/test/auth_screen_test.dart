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

  testWidgets('new account configures accessibility before Today', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(800, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final store = _MemorySettingsStore();
    await tester.pumpWidget(
      CareConnectApp(store: store, startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Create a new account'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(EditableText).at(0), 'Olivia Martinez');
    await tester.enterText(
      find.byType(EditableText).at(1),
      'olivia@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(2), 'password1');
    await tester.enterText(find.byType(EditableText).at(3), 'password1');
    await tester.tap(find.text('Create account and continue'));
    await tester.pumpAndSettle();

    expect(find.text('Make Safeview comfortable'), findsOneWidget);
    expect(find.text('Good morning, Olivia'), findsNothing);

    await tester.scrollUntilVisible(
      find.text('Save my preferences'),
      400,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('Save my preferences'));
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

  testWidgets('new account can log out and sign back in', (tester) async {
    tester.view.physicalSize = const Size(800, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      CareConnectApp(store: _MemorySettingsStore(), startAuthenticated: false),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Create a new account'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(EditableText).at(0), 'Jordan Patient');
    await tester.enterText(
      find.byType(EditableText).at(1),
      'jordan@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(2), 'password1');
    await tester.enterText(find.byType(EditableText).at(3), 'password1');
    await tester.tap(find.text('Create account and continue'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Save my preferences'),
      400,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('Save my preferences'));
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Jordan'), findsOneWidget);

    await tester.tap(find.byTooltip('Log out'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Log out'));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byType(EditableText).at(0),
      'jordan@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(1), 'password1');
    await tester.tap(find.text('Sign in').last);
    await tester.pumpAndSettle();

    expect(find.text('Good morning, Jordan'), findsOneWidget);
  });
}
