# Week 4 Visual Evidence

These screenshots were generated from the canonical Flutter source on September 4, 2026 with fictional data. Each image uses a 412 x 915 logical-pixel phone viewport, the app's light theme, Roboto text, Material icons, and disabled debug banner.

The source-of-truth golden images are under `mobile-flutter-app/test/goldens/week4/`. The copies in this folder are the reviewable submission evidence.

## Screen inventory

1. [`01-today.png`](screenshots/01-today.png) - Today dashboard and entry to Accessibility Settings.
2. [`02-accessibility-settings.png`](screenshots/02-accessibility-settings.png) - persistent text, theme, motion, static-alert, haptic, and touch-target preferences.
3. [`03-medications.png`](screenshots/03-medications.png) - medication list.
4. [`04-medication-details.png`](screenshots/04-medication-details.png) - selected medication data passed to its detail screen.
5. [`05-care-team.png`](screenshots/05-care-team.png) - care-recipient list.
6. [`06-care-details.png`](screenshots/06-care-details.png) - selected care-recipient data passed to its detail screen.
7. [`07-messages.png`](screenshots/07-messages.png) - message list.
8. [`08-message-details.png`](screenshots/08-message-details.png) - selected message data passed to its detail screen.

## Visual review result

- All eight images were inspected at their original 412 x 915 resolution.
- Text and icons are readable.
- No debug banner, private information, flashing content, clipping, overlap, or layout overflow is visible.
- All names, messages, medication data, and appointment details are fictional course fixtures.
- The Accessibility Settings screen is vertically scrollable; the screenshot records its initial viewport, and automated tests verify the complete screen remains operable.

## Evidence boundary

These deterministic screenshots prove the current widget output at the stated viewport. They do not replace physical-device, TalkBack/VoiceOver, external-keyboard, or user testing.
