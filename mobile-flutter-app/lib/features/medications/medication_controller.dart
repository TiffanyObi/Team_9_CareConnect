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

  List<Medication> get medications => medicationRepository.loadMedications();
  List<MedicationLog> get logs => List.unmodifiable(_logs);

  Future<void> load() async {
    _logs = await logRepository.loadLogs();
    notifyListeners();
  }

  Future<void> markTaken(Medication medication, {DateTime? at}) async {
    final saved = await logRepository.addLog(
      MedicationLog(
        medicationName: medication.name,
        takenAt: at ?? DateTime.now(),
      ),
    );
    _logs = [saved, ..._logs];
    notifyListeners();
  }
}
