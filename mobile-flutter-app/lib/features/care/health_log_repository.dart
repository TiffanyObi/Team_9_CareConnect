import 'package:careconnect_flutter/core/database/app_database.dart';

import 'health_log.dart';

abstract interface class HealthLogRepository {
  Future<List<HealthLog>> loadLogs({int userId = 0});
  Future<HealthLog> addLog(HealthLog log, {int userId = 0});
}

class SqliteHealthLogRepository implements HealthLogRepository {
  SqliteHealthLogRepository(this.database);
  final AppDatabase database;

  @override
  Future<List<HealthLog>> loadLogs({int userId = 0}) async {
    final rows = await (await database.instance).query(
      'health_logs',
      where: 'user_id = ?',
      whereArgs: [userId],
      orderBy: 'recorded_at DESC',
    );
    return rows.map(HealthLog.fromMap).toList();
  }

  @override
  Future<HealthLog> addLog(HealthLog log, {int userId = 0}) async {
    final id = await (await database.instance).insert('health_logs', {
      ...log.toMap(),
      'user_id': userId,
    });
    return HealthLog(
      id: id,
      symptom: log.symptom,
      notes: log.notes,
      recordedAt: log.recordedAt,
    );
  }
}

class MemoryHealthLogRepository implements HealthLogRepository {
  final Map<int, List<HealthLog>> _byUser = {};
  int _nextId = 1;

  @override
  Future<List<HealthLog>> loadLogs({int userId = 0}) async =>
      List.unmodifiable(_byUser[userId] ?? []);

  @override
  Future<HealthLog> addLog(HealthLog log, {int userId = 0}) async {
    final saved = HealthLog(
      id: _nextId++,
      symptom: log.symptom,
      notes: log.notes,
      recordedAt: log.recordedAt,
    );
    (_byUser[userId] ??= []).insert(0, saved);
    return saved;
  }
}
