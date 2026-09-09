import 'package:careconnect_flutter/core/database/app_database.dart';

import 'health_log.dart';

abstract interface class HealthLogRepository {
  Future<List<HealthLog>> loadLogs();
  Future<HealthLog> addLog(HealthLog log);
}

class SqliteHealthLogRepository implements HealthLogRepository {
  SqliteHealthLogRepository(this.database);
  final AppDatabase database;

  @override
  Future<List<HealthLog>> loadLogs() async {
    final rows = await (await database.instance).query(
      'health_logs',
      orderBy: 'recorded_at DESC',
    );
    return rows.map(HealthLog.fromMap).toList();
  }

  @override
  Future<HealthLog> addLog(HealthLog log) async {
    final id = await (await database.instance).insert(
      'health_logs',
      log.toMap(),
    );
    return HealthLog(
      id: id,
      symptom: log.symptom,
      notes: log.notes,
      recordedAt: log.recordedAt,
    );
  }
}

class MemoryHealthLogRepository implements HealthLogRepository {
  final List<HealthLog> _logs = [];

  @override
  Future<List<HealthLog>> loadLogs() async => List.unmodifiable(_logs);

  @override
  Future<HealthLog> addLog(HealthLog log) async {
    final saved = HealthLog(
      id: _logs.length + 1,
      symptom: log.symptom,
      notes: log.notes,
      recordedAt: log.recordedAt,
    );
    _logs.insert(0, saved);
    return saved;
  }
}
