# React Native manual accessibility checklist

Use the final release APK or the matching iOS build. Record the tester, date, device, OS version, assistive technology, build commit, result, exact announcement, and evidence filename. Automated checks are listed as supporting evidence only; they do not replace the manual items below.

## Completed emulator checks

| Check | Result | Evidence |
| --- | --- | --- |
| Release APK installs and launches | Pass | Final verification report |
| Seeded-user sign-in | Pass | `screenshots/01-today.png` |
| New-account accessibility onboarding | Pass | `screenshots/05-accessibility-onboarding.png` |
| Saved settings screen renders | Pass | `screenshots/02-settings.png` |
| Medication list and details | Pass | `screenshots/03-medications.png` |
| Medication status and timestamp | Pass | `screenshots/04-medication-logged.png` |
| Medication log persists after relaunch and sign-in | Pass | Native emulator verification |
| Native accessibility tree exposes meaningful labels | Pass | Native emulator inspection |

## Human assistive-technology checks

Mark each item only after a person performs it on the final build.

### Screen reader

- [ ] Enable TalkBack on Android or VoiceOver on iOS.
- [ ] Confirm the sign-in fields announce visible label, control type, value state, and purpose.
- [ ] Confirm validation errors and save confirmations are announced once and at the correct time.
- [ ] Confirm tab labels and selected states are announced.
- [ ] Confirm buttons, switches, dialogs, and native Back controls have meaningful names and roles.
- [ ] Confirm reading order follows the visual order on Today, Medications, Care, Messages, and Settings.
- [ ] Confirm focus enters a confirmation dialog, remains in the dialog, and returns to the invoking control after dismissal.
- [ ] Confirm headings allow efficient screen-reader navigation where supported.
- [ ] Confirm no decorative icon is announced as an unexplained character.

### Keyboard and switch navigation

- [ ] Connect a hardware keyboard or enable full keyboard access.
- [ ] Traverse all interactive controls with Tab and Shift+Tab.
- [ ] Activate controls with Enter and Space.
- [ ] Dismiss dialogs and return with Escape or the platform Back command.
- [ ] Confirm focus order is logical and no keyboard trap occurs.
- [ ] Confirm every focused control has a clearly visible focus indicator in light and dark themes.
- [ ] Confirm focus returns to the invoking control after a dialog closes.

### Display, motion, and target checks

- [ ] Set text scaling to 200% and inspect every primary workflow for clipping, overlap, hidden controls, or horizontal scrolling.
- [ ] Rotate between portrait and landscape where supported and confirm content remains usable.
- [ ] Verify all interactive targets are comfortably usable and at least 44 points on iOS or 48 logical pixels on Android.
- [ ] Enable reduced motion and confirm nonessential transitions are removed or shortened.
- [ ] Enable high contrast or the app's high-contrast setting and confirm text, controls, focus indicators, and status cues remain understandable.
- [ ] Confirm status is never conveyed by color, sound, or animation alone.
- [ ] Confirm no flashing, pulsing, or autoplay behavior is present.

## Final sign-off

Do not mark this checklist complete until all unchecked items have a manual result. Record any failure as a known limitation in the combined Mobile VPAT and include a workaround when one exists.
