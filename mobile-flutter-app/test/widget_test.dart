import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class MemorySettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async => value = settings;
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
}
