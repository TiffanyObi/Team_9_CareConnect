class HealthLog {
  const HealthLog({
    required this.symptom,
    required this.notes,
    required this.recordedAt,
    this.id,
  });

  final int? id;
  final String symptom;
  final String notes;
  final DateTime recordedAt;

  Map<String, Object?> toMap() => {
    'symptom': symptom,
    'notes': notes,
    'recorded_at': recordedAt.toIso8601String(),
  };

  factory HealthLog.fromMap(Map<String, Object?> map) => HealthLog(
    id: map['id'] as int?,
    symptom: map['symptom']! as String,
    notes: map['notes']! as String,
    recordedAt: DateTime.parse(map['recorded_at']! as String),
  );
}
