import 'dart:io';

import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

class _ScaledSettingsStore implements AccessibilitySettingsStore {
  _ScaledSettingsStore(double textScale)
    : value = AccessibilitySettings(textScale: textScale);

  AccessibilitySettings value;

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

  const surfaces = <(String, Size)>[
    ('phone portrait', Size(412, 915)),
    ('phone landscape', Size(915, 412)),
    ('tablet portrait', Size(800, 1280)),
    ('tablet landscape', Size(1280, 800)),
  ];

  for (final textScale in const [1.0, 2.0]) {
    final percentage = (textScale * 100).round();
    for (final (name, size) in surfaces) {
      testWidgets('all eight screens reflow at $percentage percent on $name', (
        tester,
      ) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);

        await tester.pumpWidget(
          CareConnectApp(
            store: _ScaledSettingsStore(textScale),
            fontFamily: 'Roboto',
          ),
        );
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Today');

        await tester.tap(find.byIcon(Icons.medication_outlined));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Medications');
        await tester.tap(find.text('Levetiracetam'));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Medication details');
        await tester.pageBack();
        await tester.pumpAndSettle();

        await tester.tap(find.byIcon(Icons.calendar_month_outlined));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Appointments');
        await tester.tap(find.text('Physical therapy'));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Appointment details');
        await tester.scrollUntilVisible(
          find.text('Check in'),
          300,
          scrollable: find.byType(Scrollable).last,
        );
        await tester.ensureVisible(find.text('Check in'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('Check in'));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Health log');
        await tester.pageBack();
        await tester.pumpAndSettle();
        await tester.pageBack();
        await tester.pumpAndSettle();

        await tester.tap(find.byIcon(Icons.message_outlined));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Messages');
        await tester.tap(find.text('Checking in'));
        await tester.pumpAndSettle();
        _expectNoLayoutException(tester, '$name Message details');
      });
    }
  }
}

void _expectNoLayoutException(WidgetTester tester, String screen) {
  expect(
    tester.takeException(),
    isNull,
    reason: '$screen must render without clipping or overflow exceptions.',
  );
}

Future<void> _loadFont(String family, String path) async {
  final bytes = File(path).readAsBytesSync();
  final loader = FontLoader(family)
    ..addFont(Future<ByteData>.value(ByteData.sublistView(bytes)));
  await loader.load();
}
