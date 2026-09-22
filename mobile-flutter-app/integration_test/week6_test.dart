import 'package:careconnect_flutter/app/app.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/core/database/app_database.dart';
import 'package:careconnect_flutter/features/care/health_log.dart';
import 'package:careconnect_flutter/features/care/health_log_repository.dart';
import 'package:careconnect_flutter/features/medications/medication_log.dart';
import 'package:careconnect_flutter/features/medications/medication_log_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:path/path.dart' as path;
import 'package:sqflite/sqflite.dart';

class SettingsStore implements AccessibilitySettingsStore {
  AccessibilitySettings value = const AccessibilitySettings();
  @override
  Future<AccessibilitySettings> load() async => value;
  @override
  Future<void> save(AccessibilitySettings settings) async {
    value = settings;
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('native SQLite keeps both log types per account after reopen', (
    tester,
  ) async {
    final name = 'week6_isolation_${DateTime.now().microsecondsSinceEpoch}.db';
    var database = AppDatabase(databaseName: name);
    final meds = SqliteMedicationLogRepository(database);
    final health = SqliteHealthLogRepository(database);
    await meds.addLog(
      MedicationLog(
        medicationName: 'Test dose',
        takenAt: DateTime(2026, 9, 20),
      ),
      userId: 101,
    );
    await health.addLog(
      HealthLog(
        symptom: 'Test fatigue',
        notes: 'Account 101 only',
        recordedAt: DateTime(2026, 9, 20),
      ),
      userId: 101,
    );
    expect(await meds.loadLogs(userId: 202), isEmpty);
    expect(await health.loadLogs(userId: 202), isEmpty);
    await database.close();
    database = AppDatabase(databaseName: name);
    expect(
      (await SqliteMedicationLogRepository(database).loadLogs(userId: 101))
          .single
          .medicationName,
      'Test dose',
    );
    expect(
      (await SqliteHealthLogRepository(database).loadLogs(userId: 101))
          .single
          .notes,
      'Account 101 only',
    );
    await database.close();
  });

  testWidgets(
    'version 2 migration retains unowned rows without exposing them',
    (tester) async {
      final name =
          'week6_migration_${DateTime.now().microsecondsSinceEpoch}.db';
      final old = await openDatabase(
        path.join(await getDatabasesPath(), name),
        version: 2,
        onCreate: (db, _) async {
          await db.execute(
            'CREATE TABLE medication_logs(id INTEGER PRIMARY KEY, medication_name TEXT NOT NULL, taken_at TEXT NOT NULL)',
          );
          await db.execute(
            'CREATE TABLE health_logs(id INTEGER PRIMARY KEY, symptom TEXT NOT NULL, notes TEXT NOT NULL, recorded_at TEXT NOT NULL)',
          );
        },
      );
      await old.insert('medication_logs', {
        'medication_name': 'Unowned legacy dose',
        'taken_at': DateTime(2026).toIso8601String(),
      });
      await old.insert('health_logs', {
        'symptom': 'Legacy symptom',
        'notes': 'Unknown owner',
        'recorded_at': DateTime(2026).toIso8601String(),
      });
      await old.close();
      final upgraded = AppDatabase(databaseName: name);
      expect(
        await SqliteMedicationLogRepository(upgraded).loadLogs(userId: 1),
        isEmpty,
      );
      expect(
        await SqliteHealthLogRepository(upgraded).loadLogs(userId: 1),
        isEmpty,
      );
      expect(
        (await (await upgraded.instance).query('medication_logs'))
            .single['user_id'],
        isNull,
      );
      expect(
        (await (await upgraded.instance).query('health_logs')).single['notes'],
        'Unknown owner',
      );
      await upgraded.close();
    },
  );

  testWidgets('sign in and medication flow use native storage', (tester) async {
    final database = AppDatabase(
      databaseName: 'week6_flow_${DateTime.now().microsecondsSinceEpoch}.db',
    );
    await tester.pumpWidget(
      CareConnectApp(
        store: SettingsStore(),
        startAuthenticated: false,
        medicationLogRepository: SqliteMedicationLogRepository(database),
        healthLogRepository: SqliteHealthLogRepository(database),
      ),
    );
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byType(EditableText).at(0),
      'olivia@example.com',
    );
    await tester.enterText(find.byType(EditableText).at(1), 'password');
    await tester.tap(find.text('Sign in').last);
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Olivia'), findsOneWidget);
    await tester.tap(find.text('Log medication'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Levetiracetam'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Mark as taken'));
    await tester.pumpAndSettle();
    expect(find.text('Taken today • Logged'), findsOneWidget);
    expect(
      (await SqliteMedicationLogRepository(database).loadLogs(userId: 0))
          .single
          .medicationName,
      'Levetiracetam',
    );
    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pumpAndSettle();
    await database.close();
  });

  testWidgets('large-text settings save and message cancel remain reachable', (
    tester,
  ) async {
    final store = SettingsStore()
      ..value = const AccessibilitySettings(
        textScale: 2,
        themePreference: AppThemePreference.dark,
      );
    await tester.pumpWidget(CareConnectApp(store: store));
    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.settings_outlined));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Save changes'),
      250,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('Save changes'));
    await tester.pumpAndSettle();
    expect(store.value.textScale, 2);
    expect(tester.takeException(), isNull);
    await tester.tap(find.byIcon(Icons.message_outlined));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('New message'),
      200,
      scrollable: find.byType(Scrollable).last,
    );
    await tester.tap(find.text('New message'));
    await tester.pumpAndSettle();
    expect(find.text('Send'), findsOneWidget);
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    expect(find.text('Send'), findsNothing);
  });
}
