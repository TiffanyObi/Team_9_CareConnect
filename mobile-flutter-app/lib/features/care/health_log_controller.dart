import 'package:flutter/foundation.dart';

import 'health_log.dart';
import 'health_log_repository.dart';

class HealthLogController extends ChangeNotifier {
  HealthLogController({required this.repository});
  final HealthLogRepository repository;
  List<HealthLog> _logs = [];

  List<HealthLog> get logs => List.unmodifiable(_logs);

  Future<void> load() async {
    _logs = await repository.loadLogs();
    notifyListeners();
  }

  Future<void> add({required String symptom, required String notes}) async {
    final saved = await repository.addLog(
      HealthLog(symptom: symptom, notes: notes, recordedAt: DateTime.now()),
    );
    _logs = [saved, ..._logs];
    notifyListeners();
  }
}
