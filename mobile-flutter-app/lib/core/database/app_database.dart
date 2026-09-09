import 'package:path/path.dart' as path;
import 'package:sqflite/sqflite.dart';

class AppDatabase {
  AppDatabase({Future<Database> Function()? openDatabase})
    : _openDatabaseOverride = openDatabase;

  final Future<Database> Function()? _openDatabaseOverride;
  Database? _database;

  Future<Database> get instance async =>
      _database ??= await (_openDatabaseOverride?.call() ?? _open());

  Future<Database> _open() async {
    final databasePath = path.join(
      await getDatabasesPath(),
      'careconnect_safeview.db',
    );
    return openDatabase(
      databasePath,
      version: 2,
      onCreate: (database, _) async {
        await _createUsersTable(database);
        await database.execute('''
          CREATE TABLE medication_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medication_name TEXT NOT NULL,
            taken_at TEXT NOT NULL
          )
        ''');
        await database.execute('''
          CREATE TABLE health_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symptom TEXT NOT NULL,
            notes TEXT NOT NULL,
            recorded_at TEXT NOT NULL
          )
        ''');
      },
      onUpgrade: (database, oldVersion, _) async {
        if (oldVersion < 2) await _createUsersTable(database);
      },
    );
  }

  Future<void> _createUsersTable(Database database) => database.execute('''
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  ''');

  Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}
