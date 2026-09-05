import 'package:careconnect_flutter/features/medications/medication_repository.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('repository returns the fictional medication schedule', () {
    final medications = const MedicationRepository().loadMedications();

    expect(medications, hasLength(2));
    expect(medications.first.name, 'Levetiracetam');
    expect(medications.first.instructions, 'Take with water.');
  });
}
