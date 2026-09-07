# Week 4 Risk Register

| Risk | Why it matters | Safeguard |
| --- | --- | --- |
| Replacing the canonical Flutter app | Loses the merged foundation and violates the continuation requirement | Work only in `mobile-flutter-app/`; do not copy a second app into the repository |
| Diverged `feature/new-designs` branch | Merging it directly would remove newer foundation files | Port selected patterns through small reviewed changes based on current `main`; do not merge or wholesale-copy that branch |
| Counting placeholders | Could falsely satisfy the 7-10 screen requirement | Keep a screen inventory with purpose, interaction, route, and test/screenshot evidence |
| Broad architecture rewrite | Can break working shared accessibility state | Extend current feature/core/app structure one slice at a time and keep tests green |
| Accessibility inferred from code | Does not prove real assistive-technology behavior | Combine automated tests with manual screen-reader, keyboard, device, orientation, text-scale, and contrast checks |
| Coverage gaming | High coverage may miss important behavior | Map tests to acceptance criteria and include empty, invalid, disabled, and data-passing cases |
| Golden updates conceal regressions | New baselines can normalize defects | Do not regenerate goldens until the change is intentional and visually reviewed |
| Sensitive or copyrighted source material | Instructor handouts, book PDFs, or health data may be inappropriate to publish | Keep source documents and personal data local; commit only original summaries, code, and fictional fixtures unless permission is confirmed |
| Generated files bloat or leak local state | Caches, coverage, IDE files, and platform-local files are not portable evidence | Review ignored/untracked files before staging; do not force-add generated artifacts |
| Delivery overclaim | Local changes do not prove commit, push, PR, or submission | Report each boundary separately and verify remote/submission state live |
