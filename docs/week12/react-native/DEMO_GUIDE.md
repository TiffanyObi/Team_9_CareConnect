# React Native final demo guide

This guide supports the mobile portion of the Week 12 presentation and the longer build-and-test evidence video.

## Two-to-three-minute application demonstration

1. **Sign in (20 seconds).** Show the Olivia Martinez demo account and explain that the credentials are local demonstration data. Sign in and point out the visible form labels and accessible control names.
2. **Today and navigation (20 seconds).** Show Today, the current date, upcoming care information, and the icon tabs. Explain that tab labels remain available to assistive technology even when visible text is hidden.
3. **Medication workflow (35 seconds).** Open Medications, select Levetiracetam, log a dose, and show “Logged today” with the timestamp. Explain that multiple doses and account-specific history are supported.
4. **Accessibility settings (35 seconds).** Open Settings and demonstrate text sizing, high contrast, reduced motion, static alerts, haptics, and larger targets. Explain that first-time accounts see accessibility setup before Today.
5. **Screen reader or keyboard (30–45 seconds).** Use TalkBack or VoiceOver to announce a heading, form field, selected tab, switch, and status message. If demonstrating a hardware keyboard, show the visible focus indicator and logical traversal.
6. **Safety statement (15 seconds).** Explain that alerts are static, the app has no flashing or autoplay content, and animation is never the only status cue.

## Build-and-test evidence segment

Show these commands from `mobile-react-native-app`:

```sh
npm ci
npm run lint
npm run typecheck
npm run test:coverage -- --runInBand
npx expo-doctor
```

Then open `coverage/lcov-report/index.html` and show the four coverage values. Show the APK filename and checksum from `FINAL_VERIFICATION.md`, followed by the installed application completing one core flow.

## Files to display

- `mobile-react-native-app/README.md`
- `mobile-react-native-app/TESTING.md`
- `mobile-react-native-app/coverage/lcov-report/index.html`
- `docs/week12/react-native/FINAL_VERIFICATION.md`
- `docs/week12/react-native/MANUAL_ACCESSIBILITY_CHECKLIST.md`
- `docs/week12/react-native/MOBILE_VPAT_EVIDENCE.md`
- `docs/week12/react-native/screenshots/`

## Honest limitations to state

- This is an educational on-device prototype, not a production medical backend.
- Authentication and private health data would require an approved server and secure token storage in production.
- The remaining transitive audit advisories require breaking toolchain changes and are documented.
- Only claim TalkBack, VoiceOver, or external-keyboard results that a person verified on the final build.
