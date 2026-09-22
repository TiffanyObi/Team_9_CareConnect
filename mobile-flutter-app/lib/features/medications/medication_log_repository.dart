import 'package:careconnect_flutter/core/database/app_database.dart';

import 'medication_log.dart';

abstract interface class MedicationLogRepository {
  Future<List<MedicationLog>> loadLogs({int userId = 0});
  Future<MedicationLog> addLog(MedicationLog log, {int userId = 0});
}

class SqliteMedicationLogRepository implements MedicationLogRepository {
  SqliteMedicationLogRepository(this.database);

  final AppDatabase database;

  @override
  Future<List<MedicationLog>> loadLogs({int userId = 0}) async {
    final rows = await (await database.instance).query(
      'medication_logs',
      where: 'user_id = ?',
      whereArgs: [userId],
      orderBy: 'taken_at DESC',
    );
    return rows.map(MedicationLog.fromMap).toList();
  }

  @override
  Future<MedicationLog> addLog(MedicationLog log, {int userId = 0}) async {
    final id = await (await database.instance).insert('medication_logs', {
      ...log.toMap(),
      'user_id': userId,
    });
    return MedicationLog(
      id: id,
      medicationName: log.medicationName,
      takenAt: log.takenAt,
    );
  }
}

class MemoryMedicationLogRepository implements MedicationLogRepository {
  final Map<int, List<MedicationLog>> _byUser = {};
  int _nextId = 1;

  @override
  Future<List<MedicationLog>> loadLogs({int userId = 0}) async =>
      List.unmodifiable(_byUser[userId] ?? []);

  @override
  Future<MedicationLog> addLog(MedicationLog log, {int userId = 0}) async {
    final saved = MedicationLog(
      id: _nextId++,
      medicationName: log.medicationName,
      takenAt: log.takenAt,
    );
    (_byUser[userId] ??= []).insert(0, saved);
    return saved;
  }
}
