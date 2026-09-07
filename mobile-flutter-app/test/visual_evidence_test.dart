import 'dart:io';

import 'package:careconnect_flutter/app/theme/app_theme.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/care/care_recipient.dart';
import 'package:careconnect_flutter/features/care/care_recipient_detail_screen.dart';
import 'package:careconnect_flutter/features/care/care_screen.dart';
import 'package:careconnect_flutter/features/dashboard/today_screen.dart';
import 'package:careconnect_flutter/features/medications/medication.dart';
import 'package:careconnect_flutter/features/medications/medication_detail_screen.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:careconnect_flutter/features/messages/message.dart';
import 'package:careconnect_flutter/features/messages/message_detail_screen.dart';
import 'package:careconnect_flutter/features/messages/messages_screen.dart';
import 'package:careconnect_flutter/features/settings/accessibility_settings_screen.dart';
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
  late AccessibilityController controller;

  setUpAll(() async {
    await _loadFont('Roboto', 'test/fonts/Roboto-Regular.ttf');
    await _loadFont('MaterialIcons', 'test/fonts/MaterialIcons-Regular.otf');
  });

  setUp(() {
    controller = AccessibilityController(store: _MemorySettingsStore());
  });

  tearDown(() => controller.dispose());

  final screens = <(String, Widget Function())>[
    ('01-today.png', () => TodayScreen(controller: controller)),
    (
      '02-accessibility-settings.png',
      () => AccessibilitySettingsScreen(controller: controller),
    ),
    ('03-medications.png', () => const MedicationsScreen()),
    (
      '04-medication-details.png',
      () => const MedicationDetailScreen(
        medication: Medication(
          name: 'Levetiracetam',
          dosage: '500 mg',
          schedule: '8:00 AM and 8:00 PM',
          instructions: 'Take with water.',
        ),
      ),
    ),
    ('05-care-team.png', () => const CareScreen()),
    (
      '06-care-details.png',
      () => const CareRecipientDetailScreen(
        recipient: CareRecipient(
          name: 'Maya Johnson',
          relationship: 'Caregiver',
          supportNote: 'Can view medication status and appointments.',
        ),
      ),
    ),
    ('07-messages.png', () => const MessagesScreen()),
    (
      '08-message-details.png',
      () => const MessageDetailScreen(
        message: Message(
          sender: 'Maya Johnson',
          subject: 'Checking in',
          body: 'Hope your appointment went smoothly today. I am here if you need anything.',
        ),
      ),
    ),
  ];

  for (final (filename, buildScreen) in screens) {
    testWidgets('captures $filename visual evidence', (tester) async {
      tester.view.physicalSize = const Size(412, 915);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      final screen = buildScreen();
      await tester.pumpWidget(
        MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: _visualEvidenceTheme(),
          home: screen is Scaffold ? screen : Scaffold(body: screen),
        ),
      );
      await tester.pumpAndSettle();

      await expectLater(
        find.byType(MaterialApp),
        matchesGoldenFile('goldens/week4/$filename'),
      );
    });
  }
}

ThemeData _visualEvidenceTheme() {
  final baseTheme = AppTheme.light();
  final materialText = ThemeData.light(useMaterial3: true).textTheme;
  final textTheme = materialText
      .merge(baseTheme.textTheme)
      .apply(fontFamily: 'Roboto');
  return baseTheme.copyWith(
    textTheme: textTheme,
    primaryTextTheme: textTheme,
    filledButtonTheme: FilledButtonThemeData(
      style: baseTheme.filledButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll(textTheme.labelLarge),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: baseTheme.outlinedButtonTheme.style?.copyWith(
        textStyle: WidgetStatePropertyAll(textTheme.labelLarge),
      ),
    ),
    navigationBarTheme: baseTheme.navigationBarTheme.copyWith(
      labelTextStyle: WidgetStatePropertyAll(textTheme.bodyMedium),
    ),
  );
}

Future<void> _loadFont(String family, String path) async {
  final bytes = File(path).readAsBytesSync();
  final loader = FontLoader(family)
    ..addFont(Future<ByteData>.value(ByteData.sublistView(bytes)));
  await loader.load();
}
