import 'dart:io';

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
  setUpAll(() async {
    await _loadFont('Ahem', 'test/fonts/Roboto-Regular.ttf');
    await _loadFont('MaterialIcons', 'test/fonts/MaterialIcons-Regular.otf');
  });

  void configurePhoneView(WidgetTester tester) {
    tester.view.physicalSize = const Size(412, 915);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  Future<void> expectAutomatedGuidelines(WidgetTester tester) async {
    await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
    await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
    await expectLater(tester, meetsGuideline(textContrastGuideline));
  }

  testWidgets('Today meets automated accessibility guidelines', (tester) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(store: _MemorySettingsStore(), fontFamily: 'Roboto'),
      );
      await tester.pumpAndSettle();

      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('Accessibility Settings meets automated guidelines', (
    tester,
  ) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(store: _MemorySettingsStore(), fontFamily: 'Roboto'),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.settings_outlined));
      await tester.pumpAndSettle();

      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('Week 4 list and detail screens meet automated guidelines', (
    tester,
  ) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(store: _MemorySettingsStore(), fontFamily: 'Roboto'),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.medication_outlined));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Levetiracetam'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.pageBack();
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.calendar_month_outlined));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Physical therapy'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Check in'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.pageBack();
      await tester.pumpAndSettle();
      await tester.pageBack();
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.message_outlined));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Checking in'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('authentication modes and validation meet guidelines', (
    tester,
  ) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(
          store: _MemorySettingsStore(),
          fontFamily: 'Roboto',
          startAuthenticated: false,
        ),
      );
      await tester.pumpAndSettle();

      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Sign in').last);
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);

      await tester.tap(find.text('Create a new account'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('first-time accessibility onboarding meets guidelines', (
    tester,
  ) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(
          store: _MemorySettingsStore(),
          fontFamily: 'Roboto',
          startAuthenticated: false,
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('Create a new account'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(EditableText).at(0), 'Test Patient');
      await tester.enterText(
        find.byType(EditableText).at(1),
        'accessibility@example.com',
      );
      await tester.enterText(find.byType(EditableText).at(2), 'password1');
      await tester.enterText(find.byType(EditableText).at(3), 'password1');
      await tester.tap(find.text('Create account and continue'));
      await tester.pumpAndSettle();

      expect(find.text('Make Safeview comfortable'), findsOneWidget);
      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('emergency and dialog states meet guidelines', (tester) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(store: _MemorySettingsStore(), fontFamily: 'Roboto'),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.calendar_month_outlined));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Emergency'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);

      await tester.tap(find.text('Call emergency services'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('message composer and logout dialogs meet guidelines', (
    tester,
  ) async {
    configurePhoneView(tester);
    final semantics = tester.ensureSemantics();
    try {
      await tester.pumpWidget(
        CareConnectApp(store: _MemorySettingsStore(), fontFamily: 'Roboto'),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.message_outlined));
      await tester.pumpAndSettle();
      await tester.tap(find.text('New message'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.home_outlined));
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip('Log out'));
      await tester.pumpAndSettle();
      await expectAutomatedGuidelines(tester);
    } finally {
      semantics.dispose();
    }
  });
}

Future<void> _loadFont(String family, String path) async {
  final bytes = File(path).readAsBytesSync();
  final loader = FontLoader(family)
    ..addFont(Future<ByteData>.value(ByteData.sublistView(bytes)));
  await loader.load();
}
