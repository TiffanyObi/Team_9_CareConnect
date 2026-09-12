# CareConnect Expo application

This is the React Native **mobile app**. The separate `../web-react-app` folder is the React website.

## Run on your Mac

Use Node 22.13 or newer. From this folder:

```sh
npm ci
npm start
```

Press `i` to open the iPhone simulator, or scan the QR code with a compatible Expo Go app on your phone. The simulator needs Xcode. A browser showing Expo JSON at port 8081 is showing the development manifest, not the mobile interface. This app currently targets iOS and Android.

Choose **Create a new account**, enter a made-up name and email, and use a password of at least eight characters. Accounts exist only on that device. Sign out and sign in with the same details to reopen saved data. Use fictional coursework data only.

## Terence's branch contributions

- Local accounts now check a salted PBKDF2-SHA256 password hash instead of accepting any password. SQLite keeps separate data for each account across app restarts.
- Each scheduled medication dose can be recorded once per local day. History shows the actual saved time.
- Health logs and appointments have editable fields, input checks, and saved records. Failed saves retain input and show an error.
- Messages can be saved as local drafts. They are not sent to caregivers.
- Settings support light, dark, and device themes; larger text and touch targets; device reduced-motion settings; and optional feedback on successful saves. Save changes stores preferences. Reset previews defaults until saved.
- Emergency assistance explains its limits and asks before opening the phone app. It does not place a call, share location, or notify anyone.
- Jest and React Native Testing Library cover storage, authentication, forms, failures, accessibility preferences, and dose history.

## Verify and view coverage

```sh
npm run verify
open coverage/lcov-report/index.html
```

`verify` runs TypeScript checks, ESLint, and all tests with coverage. Coverage includes `App.tsx` and all source modules; test fixtures and type-only declarations are excluded. The enforced minimum is 75% statements, lines, and functions, and 65% branches. Native modules use test doubles, so test results do not replace checks on a real device.

Build both mobile JavaScript bundles without publishing:

```sh
npx expo export --platform all --output-dir /tmp/careconnect-mobile-export
```

Use npm and `package-lock.json` for this branch. The existing Yarn lockfile is retained from the user's prior setup and is not the install source for these changes.

## Manual checks still needed

On both iOS and Android, create a fictional account, save a log and settings, close the app, and confirm the data after signing in again. Check large device text, dark mode, reduced motion, screen-reader focus, keyboard access to forms, and smaller screens. Cancel the emergency prompt during routine tests. A simulator may not have a phone app.

The app has no intentional flashing or autoplay media. Reduced motion alone does not prove that content passes flash thresholds. Review any future animation or video separately, using recordings and a suitable flash-analysis tool. Reference: [Photosensitive epilepsy testing in game development](https://salivity.github.io/game-development/article/photosensitive-epilepsy-testing-in-game-development).

## Prototype limits

SQLite data is local and unencrypted. A password hash protects stored password values; it does not encrypt care records or make this production authentication. There is no server, password recovery, cloud backup, remote messaging, caregiver sharing, emergency dispatch, or scheduled reminders. Uninstalling the app or clearing its data can remove saved records. Production use needs a separate security and privacy design.

Run `npm run security` to inspect dependency advisories. Do not apply a forced dependency downgrade without checking Expo compatibility.

## Mobile releases

An Expo account and EAS project are needed for cloud builds. After configuring those, use `npx eas build --platform android` or `npx eas build --platform ios`. No release, store submission, or deployment is included in this branch work.
