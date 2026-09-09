import 'package:careconnect_flutter/app/app_router.dart';
import 'package:careconnect_flutter/app/theme/app_theme.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

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
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _controller = AccessibilityController(
      store: widget.store ?? SharedPreferencesAccessibilitySettingsStore(),
    )..load();
    _router = createAppRouter(startAuthenticated: widget.startAuthenticated);
  }

  @override
  void dispose() {
    _router.dispose();
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

    return ChangeNotifierProvider.value(
      value: _controller,
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
