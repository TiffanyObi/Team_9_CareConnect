import 'package:careconnect_calm_samples_v3/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows five CareConnect design destinations', (tester) async {
    await tester.pumpWidget(const CareConnectSafeApp());

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Appointments'), findsOneWidget);
    expect(find.text('Medications'), findsOneWidget);
    expect(find.text('Media'), findsOneWidget);
    expect(find.text('Safety'), findsOneWidget);
    expect(find.text('Calm action-first home'), findsOneWidget);
  });

  testWidgets('opens the static media safety sample', (tester) async {
    await tester.pumpWidget(
      const MediaQuery(
        data: MediaQueryData(disableAnimations: true),
        child: CareConnectSafeApp(),
      ),
    );

    await tester.tap(find.widgetWithText(TextButton, 'Media'));
    await tester.pump();

    expect(find.text('Tap-to-preview media gate'), findsOneWidget);
    expect(find.text('Static preview image'), findsOneWidget);
    expect(find.text('Read transcript instead'), findsOneWidget);
  });
}
