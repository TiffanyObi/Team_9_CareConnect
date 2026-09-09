import 'dart:convert';
import 'dart:math';

import 'package:careconnect_flutter/core/database/app_database.dart';
import 'package:cryptography/cryptography.dart';
import 'package:sqflite/sqflite.dart';

import 'patient_account.dart';

enum RegistrationResult { created, emailAlreadyExists }

abstract interface class AuthRepository {
  Future<RegistrationResult> register({
    required String fullName,
    required String email,
    required String password,
  });
  Future<PatientAccount?> authenticate({
    required String email,
    required String password,
  });
}

class SqliteAuthRepository implements AuthRepository {
  SqliteAuthRepository(this.database);
  final AppDatabase database;
  final _algorithm = Pbkdf2(
    macAlgorithm: Hmac.sha256(),
    iterations: 120000,
    bits: 256,
  );

  @override
  Future<RegistrationResult> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    await _ensureDemoAccount();
    final normalizedEmail = email.trim().toLowerCase();
    final existing = await (await database.instance).query(
      'users',
      columns: ['id'],
      where: 'email = ?',
      whereArgs: [normalizedEmail],
      limit: 1,
    );
    if (existing.isNotEmpty) return RegistrationResult.emailAlreadyExists;
    final salt = List<int>.generate(16, (_) => Random.secure().nextInt(256));
    final hash = await _derive(password, salt);
    await (await database.instance).insert('users', {
      'full_name': fullName.trim(),
      'email': normalizedEmail,
      'password_salt': base64Encode(salt),
      'password_hash': base64Encode(hash),
      'created_at': DateTime.now().toIso8601String(),
    });
    return RegistrationResult.created;
  }

  @override
  Future<PatientAccount?> authenticate({
    required String email,
    required String password,
  }) async {
    await _ensureDemoAccount();
    final rows = await (await database.instance).query(
      'users',
      where: 'email = ?',
      whereArgs: [email.trim().toLowerCase()],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    final row = rows.single;
    final expected = base64Decode(row['password_hash']! as String);
    final actual = await _derive(
      password,
      base64Decode(row['password_salt']! as String),
    );
    if (!_constantTimeEquals(expected, actual)) return null;
    return PatientAccount(
      id: row['id']! as int,
      fullName: row['full_name']! as String,
      email: row['email']! as String,
    );
  }

  Future<List<int>> _derive(String password, List<int> salt) async =>
      (await _algorithm.deriveKey(
        secretKey: SecretKey(utf8.encode(password)),
        nonce: salt,
      )).extractBytes();

  bool _constantTimeEquals(List<int> left, List<int> right) {
    if (left.length != right.length) return false;
    var difference = 0;
    for (var index = 0; index < left.length; index++) {
      difference |= left[index] ^ right[index];
    }
    return difference == 0;
  }

  Future<void> _ensureDemoAccount() async {
    await (await database.instance).insert('users', const {
      'full_name': 'Olivia Martinez',
      'email': 'omartinez@careconnect.com',
      'password_salt': 'Q2FyZUNvbm5lY3REZW1vMQ==',
      'password_hash': 'QoEirPSDZvTszKaU4sdmHfzEM3ziALsJbgB17xqB3jU=',
      'created_at': '2026-09-08T00:00:00.000',
    }, conflictAlgorithm: ConflictAlgorithm.ignore);
  }
}

class MemoryAuthRepository implements AuthRepository {
  final Map<String, ({PatientAccount account, String password})> _accounts = {};

  @override
  Future<RegistrationResult> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final key = email.trim().toLowerCase();
    if (_accounts.containsKey(key)) {
      return RegistrationResult.emailAlreadyExists;
    }
    _accounts[key] = (
      account: PatientAccount(
        id: _accounts.length + 1,
        fullName: fullName.trim(),
        email: key,
      ),
      password: password,
    );
    return RegistrationResult.created;
  }

  @override
  Future<PatientAccount?> authenticate({
    required String email,
    required String password,
  }) async {
    final key = email.trim().toLowerCase();
    final record = _accounts[key];
    if (record == null &&
        key == 'olivia@example.com' &&
        password == 'password') {
      return const PatientAccount(
        id: 0,
        fullName: 'Olivia Martinez',
        email: 'olivia@example.com',
      );
    }
    return record?.password == password ? record?.account : null;
  }
}
