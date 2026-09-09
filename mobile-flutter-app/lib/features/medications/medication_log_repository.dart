import 'package:careconnect_flutter/core/database/app_database.dart';

import 'medication_log.dart';

abstract interface class MedicationLogRepository {
  Future<List<MedicationLog>> loadLogs();
  Future<MedicationLog> addLog(MedicationLog log);
}

class SqliteMedicationLogRepository implements MedicationLogRepository {
  SqliteMedicationLogRepository(this.database);

  final AppDatabase database;

  @override
  Future<List<MedicationLog>> loadLogs() async {
    final rows = await (await database.instance).query(
      'medication_logs',
      orderBy: 'taken_at DESC',
    );
    return rows.map(MedicationLog.fromMap).toList();
  }

  @override
  Future<MedicationLog> addLog(MedicationLog log) async {
    final id = await (await database.instance).insert(
      'medication_logs',
      log.toMap(),
    );
    return MedicationLog(
      id: id,
      medicationName: log.medicationName,
      takenAt: log.takenAt,
    );
  }
}

class MemoryMedicationLogRepository implements MedicationLogRepository {
  final List<MedicationLog> _logs = [];

  @override
  Future<List<MedicationLog>> loadLogs() async => List.unmodifiable(_logs);

  @override
  Future<MedicationLog> addLog(MedicationLog log) async {
    final saved = MedicationLog(
      id: _logs.length + 1,
      medicationName: log.medicationName,
      takenAt: log.takenAt,
    );
    _logs.insert(0, saved);
    return saved;
  }
}
