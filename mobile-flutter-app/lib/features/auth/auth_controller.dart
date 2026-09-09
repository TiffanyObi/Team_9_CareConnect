import 'package:flutter/foundation.dart';

import 'auth_repository.dart';
import 'patient_account.dart';

class AuthController extends ChangeNotifier {
  AuthController({required this.repository});
  final AuthRepository repository;
  PatientAccount? _account;
  bool _isBusy = false;

  PatientAccount? get account => _account;
  bool get isBusy => _isBusy;

  Future<String?> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    _setBusy(true);
    try {
      final result = await repository.register(
        fullName: fullName,
        email: email,
        password: password,
      );
      if (result == RegistrationResult.emailAlreadyExists) {
        return 'An account already exists for this email.';
      }
      _account = await repository.authenticate(
        email: email,
        password: password,
      );
      notifyListeners();
      return null;
    } finally {
      _setBusy(false);
    }
  }

  Future<String?> signIn({
    required String email,
    required String password,
  }) async {
    _setBusy(true);
    try {
      _account = await repository.authenticate(
        email: email,
        password: password,
      );
      if (_account == null) return 'Email or password is incorrect.';
      notifyListeners();
      return null;
    } finally {
      _setBusy(false);
    }
  }

  void logout() {
    _account = null;
    notifyListeners();
  }

  void _setBusy(bool value) {
    _isBusy = value;
    notifyListeners();
  }
}
