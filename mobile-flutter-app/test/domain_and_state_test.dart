import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings.dart';
import 'package:careconnect_flutter/core/accessibility/accessibility_settings_store.dart';
import 'package:careconnect_flutter/features/care/care_recipient.dart';
import 'package:careconnect_flutter/features/care/care_repository.dart';
import 'package:careconnect_flutter/features/medications/medication.dart';
import 'package:careconnect_flutter/features/medications/medication_repository.dart';
import 'package:careconnect_flutter/features/messages/message.dart';
import 'package:careconnect_flutter/features/messages/message_repository.dart';
import 'package:flutter_test/flutter_test.dart';

class _MemorySettingsStore implements AccessibilitySettingsStore {
  _MemorySettingsStore(this.value);

  AccessibilitySettings value;
  var saveCount = 0;

  @override
  Future<AccessibilitySettings> load() async => value;

  @override
  Future<void> save(AccessibilitySettings settings) async {
    value = settings;
    saveCount += 1;
  }
}

void main() {
  group('domain repositories and model validation', () {
    test('medication repository returns valid fictional records', () {
      final medications = const MedicationRepository().loadMedications();

      expect(medications, hasLength(2));
      expect(medications, everyElement(isA<Medication>()));
      expect(medications.every((item) => item.isValid), isTrue);
    });

    test('care repository returns valid fictional recipients', () {
      final recipients = const CareRepository().loadRecipients();

      expect(recipients, hasLength(2));
      expect(recipients, everyElement(isA<CareRecipient>()));
      expect(recipients.every((item) => item.isValid), isTrue);
    });

    test('message repository returns valid fictional messages', () {
      final messages = const MessageRepository().loadMessages();

      expect(messages, hasLength(2));
      expect(messages, everyElement(isA<Message>()));
      expect(messages.every((item) => item.isValid), isTrue);
    });

    test('models reject empty required values', () {
      expect(
        const Medication(
          name: '',
          dosage: '500 mg',
          schedule: '8:00 AM',
          instructions: 'Take with water.',
        ).isValid,
        isFalse,
      );
      expect(
        const CareRecipient(
          name: 'Maya Johnson',
          relationship: '',
          supportNote: 'Can view medication status.',
        ).isValid,
        isFalse,
      );
      expect(
        const Message(sender: 'Clinic', subject: 'Reminder', body: '').isValid,
        isFalse,
      );
    });
  });

  group('shared accessibility state', () {
    test('controller loads, previews, saves, and resets settings', () async {
      final store = _MemorySettingsStore(
        const AccessibilitySettings(
          themePreference: AppThemePreference.dark,
          textScale: 1.5,
          reducedMotion: false,
        ),
      );
      final controller = AccessibilityController(store: store);
      var notifications = 0;
      controller.addListener(() => notifications += 1);

      await controller.load();
      expect(controller.isLoaded, isTrue);
      expect(controller.settings.themePreference, AppThemePreference.dark);
      expect(controller.settings.textScale, 1.5);

      controller.preview(
        controller.settings.copyWith(
          textScale: 2,
          reducedMotion: true,
          staticAlerts: false,
        ),
      );
      await controller.save();
      expect(store.saveCount, 1);
      expect(store.value.textScale, 2);
      expect(store.value.reducedMotion, isTrue);
      expect(store.value.staticAlerts, isFalse);

      controller.resetToSafeDefaults();
      expect(controller.settings, isA<AccessibilitySettings>());
      expect(controller.settings.reducedMotion, isTrue);
      expect(controller.settings.staticAlerts, isTrue);
      expect(notifications, 3);

      controller.dispose();
    });
  });
}
