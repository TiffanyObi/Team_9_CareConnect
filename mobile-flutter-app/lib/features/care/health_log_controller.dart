import 'package:flutter/foundation.dart';

import 'health_log.dart';
import 'health_log_repository.dart';

class HealthLogController extends ChangeNotifier {
  HealthLogController({required this.repository});
  final HealthLogRepository repository;
  List<HealthLog> _logs = [];
  int? _userId = 0; // Standalone previews/tests use an isolated demo scope.
  int _generation = 0;

  Future<void> setUser(int? userId) async {
    _userId = userId;
    _generation++;
    _logs = [];
    notifyListeners();
    await load();
  }

  List<HealthLog> get logs => List.unmodifiable(_logs);

  Future<void> load() async {
    final userId = _userId;
    final generation = _generation;
    if (userId == null) return;
    final loaded = await repository.loadLogs(userId: userId);
    if (generation != _generation) return;
    _logs = loaded;
    notifyListeners();
  }

  Future<void> add({required String symptom, required String notes}) async {
    final userId = _userId;
    final generation = _generation;
    if (userId == null) throw StateError('Sign in before saving a log.');
    final saved = await repository.addLog(
      HealthLog(symptom: symptom, notes: notes, recordedAt: DateTime.now()),
      userId: userId,
    );
    if (generation != _generation) return;
    _logs = [saved, ..._logs];
    notifyListeners();
  }
}
