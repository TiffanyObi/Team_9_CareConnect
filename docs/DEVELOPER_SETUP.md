# Developer Setup and Troubleshooting

This guide verifies that a new developer can obtain the Team 9 repository and begin working with each required project.

## Clean-Checkout Verification

1. Clone the repository and enter its root folder.
2. Confirm the five expected top-level folders are present.
3. Install each application's dependencies using the commands in the root `README.md`.
4. Build the React application with `npm run build`.
5. Launch Electron with `npm start` and confirm the CareConnect starter window appears.
6. Launch React Native through Expo and confirm the starter appears in an iOS or Android simulator.
7. Run `flutter analyze` and `flutter test`.
8. Launch Flutter with `flutter run` and confirm the starter appears on a connected device or emulator.

## Expected Starter Result

Each application should display:

- the CareConnect name;
- `Hello, SWEN 661!`;
- confirmation that the Team 9 starter is running; and
- a visual-safety message stating that animation, autoplay, and flashing effects are not used.

## Dependency Files

- Electron, React/Vite, and React Native use `package.json` plus `package-lock.json`.
- Flutter uses `pubspec.yaml` plus `pubspec.lock`.
- Generated dependency folders such as `node_modules/`, `.dart_tool/`, and `build/` are intentionally excluded from Git.

## Common Problems

### `npm` reports an unsupported Node.js version

Install Node.js 22.13 or newer, reopen the terminal, and confirm with `node --version`.

### Expo cannot open a simulator

Start the simulator first, then run `npm start` again. Confirm Xcode is installed for iOS or that an Android Virtual Device is configured for Android.

### Flutter cannot find Android or iOS tools

Run `flutter doctor -v` and complete the reported platform setup. On Android, accept licenses with `flutter doctor --android-licenses`.

### Port already in use

Stop the older Vite or Expo development server, then rerun the command. Do not run two copies of the same starter on the same default port.

### First build is slow

The first native build may download platform artifacts and compile dependencies. Later builds should be faster because those files are cached locally.

### Flutter reports an SDK XML version warning

The current Android debug build completes despite this warning. If it becomes an error, update Android Studio and the Android command-line tools so they use compatible releases.

### Expo dependency audit reports transitive advisories

The current Expo SDK passes all Expo Doctor checks and produces an iOS bundle. `npm audit` still reports advisories inherited through Expo/Metro tooling. Do not use `npm audit fix --force` without team review because the proposed fix changes the Expo SDK to an incompatible major version.

## Accessibility Guardrails

- Do not introduce flashing or strobing content.
- Avoid autoplay and unnecessary motion.
- Respect reduced-motion preferences where the platform exposes them.
- Communicate status with text or semantics, not animation alone.
- Test new screens with keyboard navigation, screen readers, and accessibility-analysis tools where applicable.
