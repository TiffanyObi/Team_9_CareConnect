# Flutter Web accessibility and browser verification

## Automated results

The Flutter Web app was built and served locally at `http://127.0.0.1:8766/`.
Axe Core 4.10.3 checked Sign in, Today, Meds, Care, Messages, and Settings
against WCAG 2.0/2.1/2.2 A/AA and best-practice rules in each browser below.
All 24 screen/browser scans reported **zero violations**.

| Browser | Result | Evidence |
| --- | --- | --- |
| Chrome | 0 violations on all six screens | [Sign in](./chrome-sign-in.png), [Settings](./chrome-settings.png) |
| Firefox | 0 violations on all six screens | [Sign in](./firefox-sign-in.png), [Settings](./firefox-settings.png) |
| WebKit (not Safari) | 0 violations on all six screens | [Sign in](./webkit-not-safari-sign-in.png), [Settings](./webkit-not-safari-settings.png) |
| Microsoft Edge | 0 violations on all six screens | [Sign in](./edge-sign-in.png), [Settings](./edge-settings.png) |

The [Axe Core results](./browser-axe-results.json) include per-screen scan
details. The screenshots display the audit result. The [Chrome keyboard focus
screenshot](./chrome-keyboard-focus.png) shows the visible focus state on Sign
in.

Lighthouse 12.8.2 reported an **accessibility score of 100**. See the [HTML
report](./lighthouse.report.html) or [JSON report](./lighthouse.report.json).

## Keyboard and semantic checks

A keyboard-only Chrome flow reached Help, Email, Password, Show password,
Forgot password, Sign in, and Create a new account in order, then activated
Meds, Care, Messages, and Settings with Tab/Enter. Each selected screen's
semantic content matched the expected page. The Chrome keyboard flow was
simulated with browser keyboard events; it is not a substitute for a human
keyboard review. Existing Flutter tests passed for sign-in-field order, dialog
traversal without a focus trap, accessibility guidelines, and responsive
layouts. The Settings text-size slider exposes a label and keyboard
increase/decrease actions.

Flutter's semantic tree is enabled on web startup. The duplicate rendered
canvas is hidden from assistive technology while the semantic tree is active,
and the generated range input receives the label of its Flutter semantic node.

## Manual review and tool limitations

- **NVDA/VoiceOver:** not tested. NVDA was not installed in this Windows
  environment, and VoiceOver requires macOS. Axe and Flutter widget checks do
  not replace a screen-reader review.
- **WAVE and axe DevTools:** their browser extensions were unavailable here.
  Axe Core was run as the available automated alternative; this is not a claim
  that WAVE or the axe DevTools extension was run.
- **Safari:** not tested. This environment is Windows. Playwright WebKit is
  reported separately and is **not Safari**.
- Axe reported `color-contrast` and `aria-prohibited-attr` as incomplete/manual
  review checks, not violations. Flutter's automated text-contrast guideline
  tests passed. Axe could not determine some rendered text backgrounds because
  Flutter's canvas overlaps the semantic DOM; the ARIA rule likewise requires
  manual review of the affected semantic node.

No violations were found in the tested browser screens. WebKit needed a short
delay after focusing text inputs before scripted typing; the final browser
matrix includes that wait. No other browser-specific issue was observed in
these checks.

## Flutter test status

`flutter analyze` passed. The full non-golden Flutter test set passed
(44 tests). A full `flutter test` run also exercised the visual evidence tests,
but all 10 existing golden comparisons failed their pixel-difference
thresholds (2.99%–4.69%). The screenshot baselines were not regenerated as part
of this accessibility work.
