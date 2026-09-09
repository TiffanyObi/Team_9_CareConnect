# Week 4 Routing and State - September 8, 2026

## Current design

Provider supplies shared accessibility state above `MaterialApp.router`. GoRouter is the single app-level routing system.

```text
/sign-in
├── /accessibility-setup
└── /workspace/:section
    ├── today
    ├── medications ──> /medication-details
    ├── care ─────────> /appointment-details ──> /health-log
    │                   └───────────────────────> /workspace/messages
    ├── messages ─────> /message-details
    └── settings

/workspace/care ──────> /emergency-assistance
```

## Rules and evidence

- `AppRoutes` stores route paths in one file.
- `createAppRouter` maps app paths to screens.
- Typed arguments carry `Medication`, `Appointment`, and `Message` data.
- Workspace tabs use `context.go`; detail and task screens use `context.push`.
- Back returns through the router stack.
- Dialog dismissal still uses the dialog navigator because dialogs are not app routes.
- `AccessibilityController` remains a `ChangeNotifier`, but Provider supplies it across routes.
- `SharedPreferences` stores only accessibility preferences.
- Tests confirm Provider access and the Today and Medications route locations.
- The full test suite verifies authentication, onboarding, tabs, details, Back behavior, Health Log, Messages, and Emergency Assistance.

Privacy & Sharing remains informational, and approved disabled form actions remain disabled.
