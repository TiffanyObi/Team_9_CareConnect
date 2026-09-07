class Medication {
  const Medication({
    required this.name,
    required this.dosage,
    required this.schedule,
    required this.instructions,
  });

  final String name;
  final String dosage;
  final String schedule;
  final String instructions;

  bool get isValid =>
      name.trim().isNotEmpty &&
      dosage.trim().isNotEmpty &&
      schedule.trim().isNotEmpty &&
      instructions.trim().isNotEmpty;
}
