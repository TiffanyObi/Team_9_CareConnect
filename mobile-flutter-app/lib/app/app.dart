import 'package:careconnect_flutter/app/app_router.dart';
import 'package:careconnect_flutter/app/theme/app_theme.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/core/database/app_database.dart';
import 'package:careconnect_flutter/features/auth/auth_controller.dart';
import 'package:careconnect_flutter/features/auth/auth_repository.dart';
import 'package:careconnect_flutter/features/care/health_log_controller.dart';
import 'package:careconnect_flutter/features/care/health_log_repository.dart';
import 'package:careconnect_flutter/features/medications/medication_controller.dart';
import 'package:careconnect_flutter/features/medications/medication_log_repository.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class CareConnectApp extends StatefulWidget {
  const CareConnectApp({
    super.key,
    this.store,
    this.fontFamily,
    this.startAuthenticated = true,
    this.authRepository,
    this.medicationLogRepository,
    this.healthLogRepository,
  });

  final AccessibilitySettingsStore? store;
  final String? fontFamily;

  /// Keeps feature tests focused on the signed-in workspace. The production
  /// entry point opts into the sign-in screen.
  final bool startAuthenticated;
  final AuthRepository? authRepository;
  final MedicationLogRepository? medicationLogRepository;
  final HealthLogRepository? healthLogRepository;

  @override
  State<CareConnectApp> createState() => _CareConnectAppState();
}

class _CareConnectAppState extends State<CareConnectApp> {
  late final AccessibilityController _controller;
  late final AuthController _authController;
  late final MedicationController _medicationController;
  late final HealthLogController _healthLogController;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _controller = AccessibilityController(
      store: widget.store ?? SharedPreferencesAccessibilitySettingsStore(),
    )..load();
    final database = AppDatabase();
    final useMemory = widget.store != null;
    _authController = AuthController(
      repository:
          widget.authRepository ??
          (useMemory ? MemoryAuthRepository() : SqliteAuthRepository(database)),
    );
    _medicationController = MedicationController(
      logRepository:
          widget.medicationLogRepository ??
          (useMemory
              ? MemoryMedicationLogRepository()
              : SqliteMedicationLogRepository(database)),
    )..load();
    _healthLogController = HealthLogController(
      repository:
          widget.healthLogRepository ??
          (useMemory
              ? MemoryHealthLogRepository()
              : SqliteHealthLogRepository(database)),
    )..load();
    _router = createAppRouter(
      startAuthenticated: widget.startAuthenticated,
      authController: _authController,
    );
  }

  @override
  void dispose() {
    _router.dispose();
    _controller.dispose();
    _authController.dispose();
    _medicationController.dispose();
    _healthLogController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ThemeData applyVerificationFont(ThemeData theme) {
      final fontFamily = widget.fontFamily;
      return fontFamily == null
          ? theme
          : theme.copyWith(
              textTheme: theme.textTheme.apply(fontFamily: fontFamily),
            );
    }

    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: _controller),
        ChangeNotifierProvider.value(value: _authController),
        ChangeNotifierProvider.value(value: _medicationController),
        ChangeNotifierProvider.value(value: _healthLogController),
      ],
      child: Consumer<AccessibilityController>(
        builder: (context, controller, _) {
          final settings = controller.settings;
          return MaterialApp.router(
            debugShowCheckedModeBanner: false,
            title: 'CareConnect Safeview',
            theme: applyVerificationFont(AppTheme.light()),
            darkTheme: applyVerificationFont(AppTheme.dark()),
            themeMode: switch (settings.themePreference) {
              AppThemePreference.light => ThemeMode.light,
              AppThemePreference.dark => ThemeMode.dark,
              AppThemePreference.system => ThemeMode.system,
            },
            builder: (context, child) {
              final media = MediaQuery.of(context);
              final platformScale = media.textScaler.scale(1);
              final requestedScale = settings.textScale.clamp(1.0, 2.0);
              return MediaQuery(
                data: media.copyWith(
                  textScaler: TextScaler.linear(
                    (platformScale * requestedScale).clamp(1.0, 2.0),
                  ),
                  disableAnimations:
                      media.disableAnimations || settings.reducedMotion,
                ),
                child: child!,
              );
            },
            routerConfig: _router,
          );
        },
      ),
    );
  }
}
