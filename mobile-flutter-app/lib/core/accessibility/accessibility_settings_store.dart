import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract interface class AccessibilitySettingsStore {
  Future<AccessibilitySettings> load();
  Future<void> save(AccessibilitySettings settings);
}

class SharedPreferencesAccessibilitySettingsStore
    implements AccessibilitySettingsStore {
  SharedPreferencesAccessibilitySettingsStore({
    SharedPreferencesAsync? preferences,
  }) : _preferences = preferences ?? SharedPreferencesAsync();

  final SharedPreferencesAsync _preferences;

  @override
  Future<AccessibilitySettings> load() async {
    final themeName = await _preferences.getString('accessibility.theme');
    return AccessibilitySettings(
      themePreference: AppThemePreference.values.firstWhere(
        (value) => value.name == themeName,
        orElse: () => AppThemePreference.system,
      ),
      textScale: await _preferences.getDouble('accessibility.textScale') ?? 1.0,
      reducedMotion:
          await _preferences.getBool('accessibility.reducedMotion') ?? true,
      staticAlerts:
          await _preferences.getBool('accessibility.staticAlerts') ?? true,
      hapticReminders:
          await _preferences.getBool('accessibility.hapticReminders') ?? true,
      largeTouchTargets:
          await _preferences.getBool('accessibility.largeTouchTargets') ?? true,
    );
  }

  @override
  Future<void> save(AccessibilitySettings settings) async {
    await Future.wait([
      _preferences.setString(
        'accessibility.theme',
        settings.themePreference.name,
      ),
      _preferences.setDouble('accessibility.textScale', settings.textScale),
      _preferences.setBool(
        'accessibility.reducedMotion',
        settings.reducedMotion,
      ),
      _preferences.setBool('accessibility.staticAlerts', settings.staticAlerts),
      _preferences.setBool(
        'accessibility.hapticReminders',
        settings.hapticReminders,
      ),
      _preferences.setBool(
        'accessibility.largeTouchTargets',
        settings.largeTouchTargets,
      ),
    ]);
  }
}
