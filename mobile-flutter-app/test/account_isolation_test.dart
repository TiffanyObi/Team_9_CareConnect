import 'dart:async';

import 'package:careconnect_flutter/features/medications/medication_controller.dart';
import 'package:careconnect_flutter/features/medications/medication_log.dart';
import 'package:careconnect_flutter/features/medications/medication_log_repository.dart';
import 'package:careconnect_flutter/features/care/health_log_controller.dart';
import 'package:careconnect_flutter/features/care/health_log_repository.dart';
import 'package:flutter_test/flutter_test.dart';

class DelayedLogs extends MemoryMedicationLogRepository {
  final pending = Completer<List<MedicationLog>>();
  @override
  Future<List<MedicationLog>> loadLogs({int userId = 0}) =>
      userId == 1 ? pending.future : super.loadLogs(userId: userId);
}

void main() {
  test(
    'medication and health logs stay with their owner across account switches',
    () async {
      final meds = MedicationController(
        logRepository: MemoryMedicationLogRepository(),
      );
      final health = HealthLogController(
        repository: MemoryHealthLogRepository(),
      );
      await meds.setUser(1);
      await health.setUser(1);
      await meds.markTaken(meds.medications.first);
      await health.add(
        symptom: 'Test fatigue',
        notes: 'Private account one note',
      );
      await meds.setUser(2);
      await health.setUser(2);
      expect(meds.logs, isEmpty);
      expect(health.logs, isEmpty);
      await meds.markTaken(meds.medications.last);
      await health.add(symptom: 'Test headache', notes: 'Account two');
      await meds.setUser(1);
      await health.setUser(1);
      expect(meds.logs.single.medicationName, meds.medications.first.name);
      expect(health.logs.single.notes, 'Private account one note');
      await meds.setUser(null);
      await health.setUser(null);
      expect(meds.logs, isEmpty);
      expect(health.logs, isEmpty);
      await expectLater(
        meds.markTaken(meds.medications.first),
        throwsStateError,
      );
      await expectLater(
        health.add(symptom: 'Test', notes: ''),
        throwsStateError,
      );
      meds.dispose();
      health.dispose();
    },
  );
  test(
    'a slow previous-account read cannot repopulate the new account',
    () async {
      final repo = DelayedLogs();
      final controller = MedicationController(logRepository: repo);
      final oldLoad = controller.setUser(1);
      await controller.setUser(2);
      repo.pending.complete([
        MedicationLog(
          id: 1,
          medicationName: 'Other account',
          takenAt: DateTime(2026),
        ),
      ]);
      await oldLoad;
      expect(controller.logs, isEmpty);
      controller.dispose();
    },
  );
}
