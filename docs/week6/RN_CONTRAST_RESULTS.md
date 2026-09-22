# React Native rendered contrast results

September 21, 2026 (ET). See [audit and limits](RN_ACCESSIBILITY_AUDIT.md).

| Theme | Check | Observations | Exempt inactive | Lowest non-exempt ratio | Required ratio |
| --- | --- | ---: | ---: | ---: | ---: |
| light | text | 198 | 7 | 4.548:1 | 4.5:1 |
| light | placeholder | 10 | 0 | 7.847:1 | 4.5:1 |
| light | input border against input fill | 10 | 0 | 4.716:1 | 3:1 |
| light | pressed text (style callback) | 5 | 1 | 4.548:1 | 4.5:1 |
| dark | text | 198 | 7 | 5.875:1 | 4.5:1 |
| dark | placeholder | 10 | 0 | 7.847:1 | 4.5:1 |
| dark | input border against input fill | 10 | 0 | 4.716:1 | 3:1 |
| dark | pressed text (style callback) | 5 | 1 | 6.444:1 | 4.5:1 |

All non-exempt rows pass. Raw ratios are rounded to three decimals; assertions use full precision. Results use resolved rendered styles, not device pixels.

Inactive controls are excluded from pass claims. Native focus indicators, switches, system alerts, and Back controls remain unverified. Decorative card outlines are outside the required-control-boundary measurements.
