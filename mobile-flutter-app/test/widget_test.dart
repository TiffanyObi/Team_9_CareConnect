import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/app/app_routes.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/medications/medication.dart';
import 'package:careconnect_flutter/features/medications/medication_repository.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class MemorySettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async => value = settings;
}

class EmptyMedicationRepository extends MedicationRepository {
  const EmptyMedicationRepository();

  @override
  List<Medication> loadMedications() => const [];
}

void main() {
  testWidgets('renders the Today foundation and labeled navigation', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    expect(find.text('Good morning, Olivia'), findsOneWidget);
    expect(find.text('Medication due at 8:00 AM'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);
    expect(find.byType(NavigationBar), findsOneWidget);
  });

  testWidgets('Provider supplies state and GoRouter tracks workspace routes', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    var context = tester.element(find.text('Good morning, Olivia'));
    expect(context.read<AccessibilityController>(), isNotNull);
    expect(GoRouterState.of(context).uri.path, AppRoutes.today);

    await tester.tap(find.byIcon(Icons.medication_outlined));
    await tester.pumpAndSettle();
    context = tester.element(find.text('Medications'));
    expect(GoRouterState.of(context).uri.path, AppRoutes.medications);
  });

  testWidgets('opens, edits, saves, and announces accessibility settings', (
    tester,
  ) async {
    final store = MemorySettingsStore();
    await tester.pumpWidget(CareConnectApp(store: store));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.settings_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Safety and motion'), findsOneWidget);
    await tester.tap(find.text('Dark'));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Save changes'),
      400,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('Save changes'));
    await tester.pumpAndSettle();

    expect(store.value.themePreference, AppThemePreference.dark);
    const confirmation =
        'Accessibility settings saved. Your preferences will be used on this device.';
    await tester.scrollUntilVisible(
      find.text(confirmation),
      -400,
      scrollable: find.byType(Scrollable).last,
    );
    expect(find.text(confirmation), findsOneWidget);
  });

  testWidgets('logout requires confirmation and returns to sign in', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.byTooltip('Log out'));
    await tester.pumpAndSettle();
    expect(find.text('Log out?'), findsOneWidget);

    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Olivia'), findsOneWidget);

    await tester.tap(find.byTooltip('Log out'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Log out'));
    await tester.pumpAndSettle();
    expect(find.text('Use your existing CareConnect account.'), findsOneWidget);
  });

  testWidgets('supports 200 percent text without horizontal overflow', (
    tester,
  ) async {
    final store = MemorySettingsStore()
      ..value = const AccessibilitySettings(textScale: 2);
    await tester.pumpWidget(CareConnectApp(store: store));
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.byKey(const Key('today-scroll-view')), findsOneWidget);
  });

  testWidgets('opens the selected medication detail and returns with Back', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.medication_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Levetiracetam'), findsOneWidget);

    await tester.tap(find.text('Levetiracetam'));
    await tester.pumpAndSettle();
    expect(find.text('Medication details'), findsOneWidget);
    expect(find.textContaining('500 mg'), findsOneWidget);
    expect(find.textContaining('Take with water.'), findsOneWidget);

    await tester.tap(find.text('Mark as taken'));
    await tester.pumpAndSettle();
    expect(find.text('Taken'), findsOneWidget);

    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.text('Medications'), findsOneWidget);
    expect(find.text('Levetiracetam taken'), findsOneWidget);
  });

  testWidgets('shows an empty medication recovery state', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: MedicationsScreen(
            repository: const EmptyMedicationRepository(),
          ),
        ),
      ),
    );

    expect(find.text('No medications have been added yet.'), findsOneWidget);
  });

  testWidgets('appointment check-in logs health and messaging changes tabs', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.calendar_month_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Physical therapy'));
    await tester.pumpAndSettle();
    expect(find.text('Appointment details'), findsOneWidget);
    await tester.tap(find.text('Check in'));
    await tester.pumpAndSettle();
    expect(find.text('How are you feeling?'), findsOneWidget);
    await tester.tap(find.text('Symptom'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Knee pain').last);
    await tester.enterText(
      find.byType(TextField),
      'Pain increased after walking.',
    );
    await tester.tap(find.text('Save today’s log'));
    await tester.pumpAndSettle();
    expect(find.text('Pain increased after walking.'), findsOneWidget);
    await tester.pageBack();
    await tester.pumpAndSettle();
    await tester.tap(find.text('Message caregiver'));
    await tester.pumpAndSettle();
    expect(find.text('Care team messages'), findsOneWidget);
    await tester.tap(find.text('Checking in'));
    await tester.pumpAndSettle();
    expect(find.text('From Maya Johnson'), findsOneWidget);
    expect(find.textContaining('Hope your appointment'), findsOneWidget);
  });

  testWidgets('unfinished form actions are disabled', (tester) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.calendar_month_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Add appointment'));
    await tester.pumpAndSettle();
    final saveAppointment = tester.widget<FilledButton>(
      find.widgetWithText(FilledButton, 'Save appointment'),
    );
    expect(saveAppointment.onPressed, isNull);
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.message_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.text('New message'));
    await tester.pumpAndSettle();
    final send = tester.widget<FilledButton>(
      find.widgetWithText(FilledButton, 'Send'),
    );
    expect(send.onPressed, isNull);
  });

  testWidgets('Care emergency action opens assistance and confirms call', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    Visibility emergencyVisibility() => tester.widget<Visibility>(
      find.ancestor(
        of: find.text('Emergency'),
        matching: find.byType(Visibility),
      ),
    );
    expect(emergencyVisibility().visible, isFalse);
    await tester.tap(find.byIcon(Icons.calendar_month_outlined));
    await tester.pumpAndSettle();
    expect(emergencyVisibility().visible, isTrue);
    await tester.tap(find.text('Emergency'));
    await tester.pumpAndSettle();
    expect(find.text('Call emergency services'), findsOneWidget);

    await tester.tap(find.text('Call emergency services'));
    await tester.pumpAndSettle();
    expect(find.text('Emergency services called'), findsOneWidget);
    expect(find.text('Emergency services have been called.'), findsOneWidget);
  });
}
