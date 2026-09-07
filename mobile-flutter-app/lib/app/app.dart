import 'package:careconnect_flutter/app/app_shell.dart';
import 'package:careconnect_flutter/app/theme/app_theme.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/auth/auth_screen.dart';
import 'package:flutter/material.dart';

class CareConnectApp extends StatefulWidget {
  const CareConnectApp({
    super.key,
    this.store,
    this.fontFamily,
    this.startAuthenticated = true,
  });

  final AccessibilitySettingsStore? store;
  final String? fontFamily;

  /// Keeps feature tests focused on the signed-in workspace. The production
  /// entry point opts into the sign-in screen.
  final bool startAuthenticated;

  @override
  State<CareConnectApp> createState() => _CareConnectAppState();
}

class _CareConnectAppState extends State<CareConnectApp> {
  late final AccessibilityController _controller;
  late bool _isAuthenticated;

  @override
  void initState() {
    super.initState();
    _controller = AccessibilityController(
      store: widget.store ?? SharedPreferencesAccessibilitySettingsStore(),
    )..load();
    _isAuthenticated = widget.startAuthenticated;
  }

  @override
  void dispose() {
    _controller.dispose();
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

    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        final settings = _controller.settings;
        return MaterialApp(
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
          home: _isAuthenticated
              ? AppShell(controller: _controller)
              : AuthScreen(
                  onAuthenticated: () =>
                      setState(() => _isAuthenticated = true),
                ),
        );
      },
    );
  }
}
