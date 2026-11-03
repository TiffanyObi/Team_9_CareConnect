Framework Comparison and Reflection

Team 9  |  November 3 2026  |  Review copy

Purpose and scope

CareConnect Safeview uses Flutter, React Native, Electron, and React web to explore accessible care tasks. The strongest choice depends on how users reach the app and which device features they need. The four apps share design goals, but they are separate implementations with separate local data. This comparison covers the merged source at 518683b and the retained test evidence. It does not claim that all four apps have the same feature set.

Flutter mobile

Flutter defines screens in Dart widgets. Provider holds shared state, GoRouter handles routes, and repositories separate local storage from the interface. This gives the mobile app a clear structure and makes it possible to substitute in-memory storage in tests. The same design can target Android and iOS, but the submitted installer is Android. A signed iOS release was not supplied.

React Native mobile

React Native uses TypeScript and React with native controls. React Navigation manages screens, while AppContext and SQLite repositories manage local data. The team can reuse React concepts from the web and desktop apps. That reduces the number of state and component concepts to learn, but HTML and CSS cannot simply be copied into native screens. Accessibility needs native roles, values, focus events, and device checks.

Recommendation

Use Flutter where a Dart team wants tight control of a consistent mobile design. Use React Native where React skills and native mobile controls are the main fit. Either choice still needs native assistive-technology checks, a device build, and platform-specific release work. An emulator launch or web preview alone cannot establish mobile accessibility.

Desktop and Web Tradeoffs

Electron desktop

Electron wraps the React interface in a desktop shell. Its main process owns native menus, window state, and privileged operations. A narrow preload bridge exposes only approved actions to the renderer. The source enables contextIsolation and disables nodeIntegration. The appointment-copy feature crosses this boundary through a named IPC channel rather than giving the interface unrestricted system access.

React web and PWA

The React web app uses Vite, hash routes, shared contexts, and browser storage. A service worker caches the app shell and supports documented offline use. Users can open a URL without installing an APK or DMG. Hash routing also lets nested screens reload on GitHub Pages. Browser storage and cache are local to a profile; they do not provide a shared medical record or server sync.

Shared concepts and limits

React component and state patterns can be carried between React Native, Electron, and web. Actual views, routing, storage adapters, permissions, and accessibility APIs differ. The source keeps these in separate application folders. The project shares a care-recipient design and calm feedback rather than one compiled UI library. The desktop app focuses on notes, appointments, settings, and local accounts; it does not include every mobile or web medication and messaging task.

Choice for delivery

A PWA offers the simplest link-based course review and cross-device access. Electron adds desktop menus, clipboard access, and a native installer, but it also adds packaging and a privilege boundary. The submitted DMG is unsigned and not notarized. Neither browser installability nor a universal Mac build proves support for every operating system listed in the top rubric band.

Accessibility and Testing Evidence

Different focus models

The web logout dialog uses an effect to focus Stay logged in. Its key handler wraps Tab and Shift+Tab between buttons and handles Escape. The mobile menu uses a similar pattern and asks the parent to restore trigger focus. These paths need a real keyboard and VoiceOver check. React Native instead uses Modal and AccessibilityInfo.sendAccessibilityEvent to move reader focus. Flutter exposes labels and traversal through its widget and semantics tree.

Code examples

Web example: if (event.key === "Escape") { event.preventDefault(); onCancel(); }. Native example: onShow calls AccessibilityInfo.sendAccessibilityEvent(heading.current, "focus"). Electron example: contextIsolation: true and nodeIntegration: false. These short excerpts show that the same user goal needs different platform code. They do not prove the runtime outcome without tests.

Measured quality results

The retained November 3 verification records Flutter line coverage of 83.97%, React Native 98.98%, Electron 95.77%, and web 89.82%. The JavaScript reports also record branches and functions. The fresh review run is recorded separately in the coverage ledger; it found ten Flutter golden-image mismatches. The earlier team report of 54/54 therefore must not be presented as the result of this review run.

Performance evidence and limits

The final verification records a Flutter APK of about 53.4 MB and successful Android, DMG, and web builds. Earlier web Lighthouse accessibility scores were 100 on four tested routes. Accessibility scores and coverage are not speed benchmarks. The team has no matched startup-time, memory, frame-rate, or network-load benchmark across all four apps. No claim that one framework is faster is supported. A fair benchmark would use the same tasks, hardware, data, build mode, and repeated timed runs.

Lessons and Next Steps

Lessons from the project

Local stores made it possible to test care tasks without a remote backend. Repository interfaces also helped isolate tests. The cost is that a user cannot expect records to sync across the four apps. Platform-specific focus handling and offline caching required separate checks. Code coverage helped find untested branches, but the manual focus recordings supplied evidence that line counts could not.

Team reflection for review

The proposed team lesson is to define evidence and ownership earlier. Keep one release commit, one report index, and clear labels for automated, manual, historical, and current results. The package review found that HTML files could be older than the figures quoted in the Word document. A shared release checklist would reduce this mismatch. Each member should confirm or revise this reflection before the team presents it as its own experience.

What to improve

First, resolve the Flutter screenshot mismatches without blindly replacing baseline images. Next, add a shared contract for supported workflows, label read-only drafts honestly, and retest the affected platform after each fix. Use one approved source for coverage numbers. Before clinical use, replace local demo identity with an approved service, add server authorization and secure storage, and complete a privacy and security review.

Evidence and references

Source: docs/week12/FINAL_REPOSITORY_VERIFICATION.md; each application README; web-react-app/src/components/LogoutDialog.jsx and MobileMenu.jsx; mobile-react-native-app/src/components/AccessibleModal.tsx; desktop-electron-app/src/main/main.js and src/preload/preload.js. Repository: https://github.com/TiffanyObi/Team_9_CareConnect/tree/518683b482999653dcf21358c6d892cb2323967b. Review-run logs and HTML reports accompany this package. No personal growth, runtime benchmark, or AI percentage has been invented.