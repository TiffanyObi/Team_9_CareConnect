import 'package:flutter/foundation.dart';

import 'medication.dart';
import 'medication_log.dart';
import 'medication_log_repository.dart';
import 'medication_repository.dart';

class MedicationController extends ChangeNotifier {
  MedicationController({
    required this.logRepository,
    this.medicationRepository = const MedicationRepository(),
  });

  final MedicationLogRepository logRepository;
  final MedicationRepository medicationRepository;
  List<MedicationLog> _logs = [];
  int? _userId = 0; // Standalone previews/tests use an isolated demo scope.
  int _generation = 0;

  Future<void> setUser(int? userId) async {
    _userId = userId;
    _generation++;
    _logs = [];
    notifyListeners();
    await load();
  }

  List<Medication> get medications => medicationRepository.loadMedications();
  List<MedicationLog> get logs => List.unmodifiable(_logs);

  Future<void> load() async {
    final userId = _userId;
    final generation = _generation;
    if (userId == null) return;
    final loaded = await logRepository.loadLogs(userId: userId);
    if (generation != _generation) return;
    _logs = loaded;
    notifyListeners();
  }

  Future<void> markTaken(Medication medication, {DateTime? at}) async {
    final userId = _userId;
    final generation = _generation;
    if (userId == null) throw StateError('Sign in before saving a log.');
    final saved = await logRepository.addLog(
      MedicationLog(
        medicationName: medication.name,
        takenAt: at ?? DateTime.now(),
      ),
      userId: userId,
    );
    if (generation != _generation) return;
    _logs = [saved, ..._logs];
    notifyListeners();
  }
}
