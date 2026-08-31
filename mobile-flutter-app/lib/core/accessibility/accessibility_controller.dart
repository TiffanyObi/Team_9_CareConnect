import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:flutter/foundation.dart';

class AccessibilityController extends ChangeNotifier {
  AccessibilityController({
    required this.store,
    AccessibilitySettings initialSettings = const AccessibilitySettings(),
  }) : _settings = initialSettings;

  final AccessibilitySettingsStore store;
  AccessibilitySettings _settings;
  bool _isLoaded = false;

  AccessibilitySettings get settings => _settings;
  bool get isLoaded => _isLoaded;

  Future<void> load() async {
    _settings = await store.load();
    _isLoaded = true;
    notifyListeners();
  }

  void preview(AccessibilitySettings settings) {
    _settings = settings;
    notifyListeners();
  }

  Future<void> save() => store.save(_settings);

  void resetToSafeDefaults() {
    _settings = const AccessibilitySettings();
    notifyListeners();
  }
}
