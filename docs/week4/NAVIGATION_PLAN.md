# Week 4 Screen Navigation Plan

## Purpose

This plan covers the eight current CareConnect screens. It records the working flow and lists small improvements. The app will keep Flutter `Navigator` and `MaterialPageRoute`. A new routing package is not needed for this scope.

## Current screen map

```text
App launch
└── AppShell
    ├── Today
    │   └── Accessibility Settings
    ├── Medications
    │   └── Medication Details
    ├── Care Team
    │   └── Care Details
    └── Messages
        └── Message Details
```

The bottom bar opens Today, Medications, Care, and Messages. An `IndexedStack` keeps each main tab in memory. Detail and settings screens open above the shell with `Navigator.push`. The system Back action returns to the prior screen.

## Route inventory

| Starting screen | User action | Destination | Data passed | Return path |
| --- | --- | --- | --- | --- |
| App launch | Start the app | Today | Shared accessibility controller | Exit or system navigation |
| Any main tab | Select Today | Today | Existing shared state | Select another tab |
| Any main tab | Select Meds | Medications | None | Select another tab |
| Any main tab | Select Care | Care Team | None | Select another tab |
| Any main tab | Select Messages | Messages | None | Select another tab |
| Today | Select Accessibility settings | Accessibility Settings | `AccessibilityController` | Back to Today |
| Medications | Select a medication | Medication Details | Selected `Medication` | Back to Medications |
| Care Team | Select a person | Care Details | Selected `CareRecipient` | Back to Care Team |
| Messages | Select a message | Message Details | Selected `Message` | Back to Messages |

## Navigation rules

- Keep the four main destinations in `AppShell`.
- Keep the selected bottom-bar item as local shell state.
- Use `Navigator.push` for settings and detail screens.
- Pass the selected model through the destination constructor.
- Do not read the selected item again from a global variable.
- Use the standard AppBar Back control on pushed screens.
- Keep shared accessibility settings in `AccessibilityController`.
- Preserve the active tab when a detail screen closes.
- Do not count dialogs, sheets, or empty states as core screens.
- Do not add a screen unless it supports a clear user task.

## Recommended improvements

### Phase 1: Complete dashboard actions

- Give **Log medication** a real result.
- A tap should update the medication status and show a clear text message.
- Keep the result static. Do not use flashing or pulsing feedback.
- Add a disabled or recovery state when the action cannot be saved.
- Give **Help** a working destination or remove the disabled control.
- Keep these changes within the current screen count unless a new screen adds a full workflow.

### Phase 2: Make route creation consistent

- Add a small route helper, such as `app_routes.dart`.
- Keep route names and builders in one place.
- Continue to use `MaterialPageRoute` unless deep links become a course need.
- Use typed helper methods for medication, care, and message details.
- Do not add Provider, Riverpod, or `go_router` only for route cleanup.

### Phase 3: Improve Back and state behavior

- Confirm Back returns to the correct list from every detail screen.
- Confirm Back returns from Accessibility Settings to Today.
- Keep the selected main tab after a detail screen closes.
- Keep saved accessibility settings when users move between tabs.
- Decide whether tapping an active bottom-bar item should return its list to the top.
- Record the expected Android system Back behavior.

### Phase 4: Improve navigation accessibility

- Give every destination a short and clear label.
- Move screen-reader focus to the new screen heading after navigation.
- Announce saved, failed, and completed actions with text and a live region.
- Confirm the selected bottom-bar item is announced.
- Confirm Back controls have clear names.
- Test the full path with TalkBack or VoiceOver.
- Test keyboard Tab, Shift+Tab, Enter, Space, and Escape or Back actions.
- Avoid motion-only page changes and long animated transitions.

### Phase 5: Add navigation tests

- Test each bottom-bar destination.
- Test Today to Accessibility Settings and Back.
- Test Medication selection, passed data, and Back.
- Test Care selection, passed data, and Back.
- Test Message selection, passed data, and Back.
- Add a direct Message Back assertion.
- Test that shared settings remain after tab and route changes.
- Test the Log medication success and recovery paths after they are built.
- Run all routes at 100% and 200% text size.

## Acceptance checks

- [ ] All four bottom-bar destinations open the correct screen.
- [ ] Every list opens the detail screen for the selected item.
- [ ] Every detail screen shows the selected model data.
- [ ] Back returns to the correct starting screen.
- [ ] The active main tab remains selected after Back.
- [ ] Accessibility settings remain shared across routes.
- [ ] Log medication gives a visible and accessible result.
- [ ] Help is functional or is removed.
- [ ] New screen headings receive screen-reader focus.
- [ ] TalkBack or VoiceOver can complete one core route.
- [ ] Keyboard focus follows a clear order.
- [ ] Navigation works at 100% and 200% text size.
- [ ] No route adds flashing, autoplay, or motion-only feedback.
- [ ] Widget tests and the full Week 4 gate pass.

## Completion evidence

Record the following after each navigation change:

- Route or control changed
- Starting screen and destination
- Data passed to the destination
- Expected Back result
- Automated test name and result
- Device, orientation, and text size
- TalkBack, VoiceOver, or keyboard result
- Screenshot path when the screen changed
- Known limits or follow-up work

## Delivery boundary

The current navigation already supports the eight-screen Week 4 flow. The phases above improve weak actions and add stronger proof. Update screenshots and verification records only after a visible change. Do not commit, push, or mark device testing complete until those actions are performed and checked.
