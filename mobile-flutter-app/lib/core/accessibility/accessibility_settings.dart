import 'package:flutter/material.dart';

enum AppThemePreference { system, light, dark }

@immutable
class AccessibilitySettings {
  const AccessibilitySettings({
    this.themePreference = AppThemePreference.system,
    this.textScale = 1.0,
    this.reducedMotion = true,
    this.staticAlerts = true,
    this.hapticReminders = true,
    this.largeTouchTargets = true,
  });

  final AppThemePreference themePreference;
  final double textScale;
  final bool reducedMotion;
  final bool staticAlerts;
  final bool hapticReminders;
  final bool largeTouchTargets;

  AccessibilitySettings copyWith({
    AppThemePreference? themePreference,
    double? textScale,
    bool? reducedMotion,
    bool? staticAlerts,
    bool? hapticReminders,
    bool? largeTouchTargets,
  }) => AccessibilitySettings(
    themePreference: themePreference ?? this.themePreference,
    textScale: textScale ?? this.textScale,
    reducedMotion: reducedMotion ?? this.reducedMotion,
    staticAlerts: staticAlerts ?? this.staticAlerts,
    hapticReminders: hapticReminders ?? this.hapticReminders,
    largeTouchTargets: largeTouchTargets ?? this.largeTouchTargets,
  );
}
