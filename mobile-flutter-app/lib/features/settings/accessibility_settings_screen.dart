import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';
import 'package:flutter/material.dart';

class AccessibilitySettingsScreen extends StatefulWidget {
  const AccessibilitySettingsScreen({required this.controller, super.key});
  final AccessibilityController controller;

  @override
  State<AccessibilitySettingsScreen> createState() =>
      _AccessibilitySettingsScreenState();
}

class _AccessibilitySettingsScreenState
    extends State<AccessibilitySettingsScreen> {
  var _saved = false;
  AccessibilitySettings get _settings => widget.controller.settings;

  void _update(AccessibilitySettings settings) {
    setState(() => _saved = false);
    widget.controller.preview(settings);
  }

  Future<void> _save() async {
    await widget.controller.save();
    if (mounted) setState(() => _saved = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Accessibility settings')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          children: [
            Text(
              'Changes preview immediately without animation.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (_saved) ...[
              const SizedBox(height: 12),
              Semantics(
                liveRegion: true,
                label: 'Accessibility settings saved. Your preferences will be used on this device.',
                child: const AppCard(
                  color: Color(0xFFEAF7EE),
                  child: Row(
                    children: [
                      Icon(
                        Icons.check_circle_outline,
                        color: AppColors.success,
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Accessibility settings saved. Your preferences will be used on this device.',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Visual preferences',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Text size',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Slider(
                    value: _settings.textScale,
                    min: 1,
                    max: 2,
                    divisions: 4,
                    label: '${(_settings.textScale * 100).round()}%',
                    semanticFormatterCallback: (value) =>
                        '${(value * 100).round()} percent',
                    onChanged: (value) =>
                        _update(_settings.copyWith(textScale: value)),
                  ),
                  SegmentedButton<AppThemePreference>(
                    showSelectedIcon: false,
                    segments: const [
                      ButtonSegment(
                        value: AppThemePreference.light,
                        label: Text('Light'),
                      ),
                      ButtonSegment(
                        value: AppThemePreference.dark,
                        label: Text('Dark'),
                      ),
                      ButtonSegment(
                        value: AppThemePreference.system,
                        label: Text('Device'),
                      ),
                    ],
                    selected: {_settings.themePreference},
                    onSelectionChanged: (value) => _update(
                      _settings.copyWith(themePreference: value.single),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Safety and motion',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  _SettingSwitch(
                    title: 'Reduced motion',
                    subtitle: 'Recommended for seizure safety',
                    value: _settings.reducedMotion,
                    onChanged: (value) =>
                        _update(_settings.copyWith(reducedMotion: value)),
                  ),
                  _SettingSwitch(
                    title: 'Static visual alerts',
                    subtitle: 'No flashing or pulsing',
                    value: _settings.staticAlerts,
                    onChanged: (value) =>
                        _update(_settings.copyWith(staticAlerts: value)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Alerts and touch',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  _SettingSwitch(
                    title: 'Haptic reminders',
                    subtitle: 'Paired with readable text',
                    value: _settings.hapticReminders,
                    onChanged: (value) =>
                        _update(_settings.copyWith(hapticReminders: value)),
                  ),
                  _SettingSwitch(
                    title: 'Larger touch targets',
                    subtitle: 'Minimum 48 × 48 logical pixels',
                    value: _settings.largeTouchTargets,
                    onChanged: (value) =>
                        _update(_settings.copyWith(largeTouchTargets: value)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const AppCard(
              color: AppColors.darkBackground,
              semanticLabel:
                  'Static preview. Medication due. Levetiracetam at 8 AM.',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Preview: Medication due',
                    style: TextStyle(
                      color: AppColors.darkText,
                      fontSize: 18,
                      height: 1.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    'Levetiracetam • 8:00 AM',
                    style: TextStyle(
                      color: AppColors.darkTextSecondary,
                      fontSize: 16,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            AppButton(label: 'Save changes', onPressed: _save),
            const SizedBox(height: 8),
            AppButton(
              label: 'Reset to recommended safe settings',
              secondary: true,
              onPressed: () {
                widget.controller.resetToSafeDefaults();
                setState(() => _saved = false);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingSwitch extends StatelessWidget {
  const _SettingSwitch({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => SwitchListTile.adaptive(
    contentPadding: EdgeInsets.zero,
    title: Text(title, style: Theme.of(context).textTheme.titleMedium),
    subtitle: Text(subtitle),
    value: value,
    onChanged: onChanged,
  );
}
