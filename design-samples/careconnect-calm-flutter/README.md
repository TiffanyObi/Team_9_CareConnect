# CareConnect Calm Design Samples v3

This project is intentionally separate from the repository's `mobile-flutter-app/` starter. It can be run, reviewed, and modified independently while the team decides which designs to integrate.

This is a complete Flutter project containing five CareConnect interface samples designed to reduce known risks for people with photosensitive epilepsy:

1. Calm action-first home
2. Predictable appointment flow
3. Stable medication check-in
4. Tap-to-preview media gate
5. Motion and media safety center

The prototype contains no intentional flashing, autoplay, looping animation, animated media, or third-party packages. It also removes page transitions and reads the operating system's reduced-motion preference.

This prototype is design guidance, not medical advice. A production application and all encoded media still require accessibility-specialist, affected-user, and flash-risk testing.

## Open correctly in Cursor

Open the **project folder**, not the individual Dart file:

```text
careconnect_calm_samples_v3/
```

The folder contains `pubspec.yaml`, which lets Cursor recognize it as a Flutter project.

In Cursor:

1. Select **File > Open Folder**.
2. Choose the `careconnect_calm_samples_v3` folder.
3. If prompted, install or enable the recommended **Flutter** extension. It also installs the Dart extension.
4. Select **Developer: Reload Window** from the Command Palette.
5. Open `lib/main.dart`.
6. Select **Run > Start Debugging**, or press `F5`.

## Run from Terminal

```bash
flutter pub get
flutter analyze
flutter test
flutter run -d chrome
```

To view available targets:

```bash
flutter devices
```

Then run a specific target:

```bash
flutter run -d <device-id>
```

## Project layout

```text
lib/main.dart              Five runnable design samples
test/widget_test.dart      Basic project and navigation verification
.vscode/extensions.json    Flutter and Dart extension recommendations
.vscode/launch.json        Cursor debug profiles
.vscode/settings.json      Portable formatting preferences
pubspec.yaml               Flutter project manifest
```

## Troubleshooting the extension popup

If Cursor still says it cannot find a Dart debugging extension:

1. Open Extensions with `Cmd+Shift+X`.
2. Search for `Flutter` by Dart Code.
3. Confirm both **Flutter** and **Dart** are enabled for this workspace.
4. Reload Cursor.
5. Confirm the opened folder contains `pubspec.yaml` at its top level.
6. Run `Flutter: Run Flutter Doctor` from the Command Palette.
