class MedicationLog {
  const MedicationLog({
    required this.medicationName,
    required this.takenAt,
    this.id,
  });

  final int? id;
  final String medicationName;
  final DateTime takenAt;

  Map<String, Object?> toMap() => {
    'medication_name': medicationName,
    'taken_at': takenAt.toIso8601String(),
  };

  factory MedicationLog.fromMap(Map<String, Object?> map) => MedicationLog(
    id: map['id'] as int?,
    medicationName: map['medication_name']! as String,
    takenAt: DateTime.parse(map['taken_at']! as String),
  );
}
