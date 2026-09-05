import 'care_recipient.dart';

class CareRepository {
  const CareRepository();

  List<CareRecipient> loadRecipients() => const [
    CareRecipient(
      name: 'Maya Johnson',
      relationship: 'Caregiver',
      supportNote: 'Can view medication status and appointments.',
    ),
    CareRecipient(
      name: 'Eli Johnson',
      relationship: 'Family member',
      supportNote: 'Receives weekly wellbeing updates.',
    ),
  ];
}
