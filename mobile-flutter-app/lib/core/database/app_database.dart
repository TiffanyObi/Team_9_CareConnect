import 'package:path/path.dart' as path;
import 'package:sqflite/sqflite.dart';

class AppDatabase {
  AppDatabase({
    Future<Database> Function()? openDatabase,
    this.databaseName = 'careconnect_safeview.db',
  }) : _openDatabaseOverride = openDatabase;

  final String databaseName;
  final Future<Database> Function()? _openDatabaseOverride;
  Database? _database;

  Future<Database> get instance async =>
      _database ??= await (_openDatabaseOverride?.call() ?? _open());

  Future<Database> _open() async {
    final databasePath = path.join(await getDatabasesPath(), databaseName);
    return openDatabase(
      databasePath,
      version: 3,
      onCreate: (database, _) async {
        await _createUsersTable(database);
        await database.execute('''
          CREATE TABLE medication_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            medication_name TEXT NOT NULL,
            taken_at TEXT NOT NULL
          )
        ''');
        await database.execute('''
          CREATE TABLE health_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            symptom TEXT NOT NULL,
            notes TEXT NOT NULL,
            recorded_at TEXT NOT NULL
          )
        ''');
      },
      onUpgrade: (database, oldVersion, _) async {
        if (oldVersion < 2) await _createUsersTable(database);
        if (oldVersion < 3) {
          // Old rows have no known owner. Retain them, but never assign them
          // to whichever account next signs in.
          await database.execute(
            'ALTER TABLE medication_logs ADD COLUMN user_id INTEGER',
          );
          await database.execute(
            'ALTER TABLE health_logs ADD COLUMN user_id INTEGER',
          );
        }
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
