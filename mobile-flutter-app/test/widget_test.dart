import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/medications/medication.dart';
import 'package:careconnect_flutter/features/medications/medication_repository.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

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
    expect(find.text('Accessibility settings'), findsOneWidget);
    expect(find.byType(NavigationBar), findsOneWidget);
  });

  testWidgets('opens, edits, saves, and announces accessibility settings', (
    tester,
  ) async {
    final store = MemorySettingsStore();
    await tester.pumpWidget(CareConnectApp(store: store));
    await tester.pumpAndSettle();

    final settingsButton = find.widgetWithText(
      OutlinedButton,
      'Accessibility settings',
    );
    await tester.drag(
      find.byKey(const Key('today-scroll-view')),
      const Offset(0, -300),
    );
    await tester.pumpAndSettle();
    await tester.tap(settingsButton);
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

    await tester.tap(find.text('Meds'));
    await tester.pumpAndSettle();
    expect(find.text('Levetiracetam'), findsOneWidget);

    await tester.tap(find.text('Levetiracetam'));
    await tester.pumpAndSettle();
    expect(find.text('Medication details'), findsOneWidget);
    expect(find.text('500 mg'), findsOneWidget);
    expect(find.text('Take with water.'), findsOneWidget);

    await tester.pageBack();
    await tester.pumpAndSettle();
    expect(find.text('Medications'), findsOneWidget);
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

  testWidgets('opens care and message details from their destinations', (
    tester,
  ) async {
    await tester.pumpWidget(CareConnectApp(store: MemorySettingsStore()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Care'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Maya Johnson'));
    await tester.pumpAndSettle();
    expect(find.text('Support permissions'), findsOneWidget);
    expect(
      find.text('Can view medication status and appointments.'),
      findsOneWidget,
    );
    await tester.pageBack();
    await tester.pumpAndSettle();

    await tester.tap(find.text('Messages'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Checking in'));
    await tester.pumpAndSettle();
    expect(find.text('From Maya Johnson'), findsOneWidget);
    expect(find.textContaining('Hope your appointment'), findsOneWidget);
  });
}
