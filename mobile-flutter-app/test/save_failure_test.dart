import 'dart:async';

import 'package:careconnect_flutter/features/medications/medication_detail_screen.dart';
import 'package:careconnect_flutter/features/medications/medication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets(
    'dose stays unsaved while storage is pending and can retry on failure',
    (tester) async {
      final pending = Completer<void>();
      var attempts = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: MedicationDetailScreen(
            medication: const MedicationRepository().loadMedications().first,
            onMarkedTaken: (_) {
              attempts++;
              return attempts == 1 ? pending.future : Future.value();
            },
          ),
        ),
      );
      await tester.tap(find.text('Mark as taken'));
      await tester.pump();
      expect(find.text('Saving…'), findsOneWidget);
      expect(find.text('Taken today • Logged'), findsNothing);
      pending.completeError(StateError('disk full'));
      await tester.pumpAndSettle();
      expect(
        find.text('Medication not saved. Please try again.'),
        findsOneWidget,
      );
      expect(find.text('Mark as taken'), findsOneWidget);
      await tester.tap(find.text('Mark as taken'));
      await tester.pumpAndSettle();
      expect(find.text('Taken today • Logged'), findsOneWidget);
      expect(attempts, 2);
    },
  );
}
