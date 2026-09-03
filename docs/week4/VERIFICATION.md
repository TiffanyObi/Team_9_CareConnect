# Week 4 Verification

## Automated gate

From `mobile-flutter-app/` run:

```bash
./tool/verify_week4.sh
```

The script checks the Flutter environment, formatting, static analysis, all tests, and aggregate line coverage. A passing script does not replace manual accessibility, responsive-layout, interaction, screenshot, or submission review.

## Functional checks

- [ ] Inventory 7-10 meaningful screens with purpose, primary interaction, route, and test/screenshot evidence.
- [ ] Launch and reach every counted screen; exclude placeholder-only screens.
- [ ] Exercise every bottom-navigation destination.
- [ ] Verify each list opens the matching selected detail and Back returns correctly.
- [ ] Verify shared state survives relevant navigation.
- [ ] Exercise at least one empty, invalid, disabled, or recovery behavior.

## Manual accessibility and responsive checks

For every result record target/device, OS, orientation, text scale, assistive technology/tool, steps, result, and evidence path.

- [ ] Measure normal text (target 4.5:1), large text (3:1), and essential UI boundaries/states (3:1) with a named contrast tool.
- [ ] Test core flows with TalkBack on Android or VoiceOver on iOS.
- [ ] Verify labels, roles, values, status announcements, logical reading order, and absence of focus traps.
- [ ] Verify external-keyboard focus order where supported.
- [ ] Test representative phone/tablet layouts in portrait and landscape at 100% and 200% text scale.
- [ ] Confirm no clipping, overlap, lost content, unreachable controls, or workflow-blocking horizontal scrolling.
- [ ] Confirm no flashing/strobing, unsafe autoplay, looping decorative motion, or motion-only feedback.
- [ ] Confirm reduced-motion/static-alert settings preserve the strictest safe behavior.

## Evidence and delivery checks

- [ ] Capture current screenshots using fictional data and inspect them for private data, debug banners, clipping, and inconsistent content.
- [ ] Record analyzer result, test count, coverage lines hit/found, percentage, and failures.
- [ ] Review `git diff --check`, `git diff`, and `git status` before staging or committing.
- [ ] State local files, commit state, remote push/PR state, and course submission state separately.
