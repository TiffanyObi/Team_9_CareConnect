import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/auth/auth_repository.dart';
import 'package:careconnect_flutter/features/care/health_log_repository.dart';
import 'package:careconnect_flutter/features/medications/medication_log_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

class _MemorySettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async => value = settings;
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('new user completes accessibility onboarding', (tester) async {
    await tester.pumpWidget(
      CareConnectApp(
        store: _MemorySettingsStore(),
        startAuthenticated: false,
        authRepository: MemoryAuthRepository(),
        medicationLogRepository: MemoryMedicationLogRepository(),
        healthLogRepository: MemoryHealthLogRepository(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Create a new account'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(EditableText).at(0), 'Jordan Lee');
    await tester.enterText(
      find.byType(EditableText).at(1),
      'jordan.lee@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(2), 'safe-pass-123');
    await tester.enterText(find.byType(EditableText).at(3), 'safe-pass-123');
    await tester.tap(find.text('Create account and continue'));
    await tester.pumpAndSettle();

    expect(find.text('Make Safeview comfortable'), findsOneWidget);
    expect(find.text('Reduced motion'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Save my preferences'),
      350,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('Save my preferences'));
    await tester.pumpAndSettle();

    expect(find.text('Good morning, Jordan'), findsOneWidget);
  });

  testWidgets('returning user logs medication and securely logs out', (
    tester,
  ) async {
    await tester.pumpWidget(
      CareConnectApp(
        store: _MemorySettingsStore(),
        startAuthenticated: false,
        authRepository: MemoryAuthRepository(),
        medicationLogRepository: MemoryMedicationLogRepository(),
        healthLogRepository: MemoryHealthLogRepository(),
      ),
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
    await tester.tap(find.text('Log medication'));
    await tester.pumpAndSettle();
    expect(find.text('Medications'), findsOneWidget);

    await tester.tap(find.text('Levetiracetam'));
    await tester.pumpAndSettle();
    expect(find.text('Medication details'), findsOneWidget);
    await tester.tap(find.text('Mark as taken'));
    await tester.pumpAndSettle();
    expect(find.text('Taken today • Logged'), findsOneWidget);

    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.text('Levetiracetam taken'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.home_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Log out'));
    await tester.pumpAndSettle();
    expect(find.text('Log out?'), findsOneWidget);
    await tester.tap(find.widgetWithText(FilledButton, 'Log out'));
    await tester.pumpAndSettle();
    expect(find.text('Use your existing CareConnect account.'), findsOneWidget);
  });
}
