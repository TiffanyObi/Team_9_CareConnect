import 'medication.dart';

class MedicationRepository {
  const MedicationRepository();

  List<Medication> loadMedications() => const [
    Medication(
      name: 'Levetiracetam',
      dosage: '500 mg',
      schedule: '8:00 AM and 8:00 PM',
      instructions: 'Take with water.',
    ),
    Medication(
      name: 'Vitamin D3',
      dosage: '1,000 IU',
      schedule: 'With breakfast',
      instructions: 'Take with food.',
    ),
  ];
}
