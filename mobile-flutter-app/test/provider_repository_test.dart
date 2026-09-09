import 'package:careconnect_flutter/features/auth/auth_controller.dart';
import 'package:careconnect_flutter/features/auth/auth_repository.dart';
import 'package:careconnect_flutter/features/care/health_log_controller.dart';
import 'package:careconnect_flutter/features/care/health_log_repository.dart';
import 'package:careconnect_flutter/features/medications/medication_controller.dart';
import 'package:careconnect_flutter/features/medications/medication_log_repository.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('AuthController registers, logs out, and signs in again', () async {
    final controller = AuthController(repository: MemoryAuthRepository());
    expect(
      await controller.register(
        fullName: 'Test Patient',
        email: 'patient@example.com',
        password: 'secure-pass',
      ),
      isNull,
    );
    expect(controller.account?.fullName, 'Test Patient');
    controller.logout();
    expect(controller.account, isNull);
    expect(
      await controller.signIn(
        email: 'patient@example.com',
        password: 'secure-pass',
      ),
      isNull,
    );
    expect(controller.account?.email, 'patient@example.com');
    controller.logout();
    expect(
      await controller.signIn(email: 'patient@example.com', password: 'wrong'),
      isNotNull,
    );
  });

  test('MedicationController persists and exposes newest logs first', () async {
    final repository = MemoryMedicationLogRepository();
    final controller = MedicationController(logRepository: repository);
    await controller.load();
    final first = DateTime(2026, 9, 8, 8);
    final second = DateTime(2026, 9, 8, 20);
    await controller.markTaken(controller.medications.first, at: first);
    await controller.markTaken(controller.medications.last, at: second);

    expect(controller.logs, hasLength(2));
    expect(controller.logs.first.takenAt, second);
    final reloaded = MedicationController(logRepository: repository);
    await reloaded.load();
    expect(reloaded.logs.map((item) => item.takenAt), [second, first]);
  });

  test('HealthLogController persists symptom and optional notes', () async {
    final repository = MemoryHealthLogRepository();
    final controller = HealthLogController(repository: repository);
    await controller.load();
    await controller.add(symptom: 'Knee pain', notes: 'After walking');

    expect(controller.logs.single.symptom, 'Knee pain');
    expect(controller.logs.single.notes, 'After walking');
    final reloaded = HealthLogController(repository: repository);
    await reloaded.load();
    expect(reloaded.logs.single.notes, 'After walking');
  });
}
