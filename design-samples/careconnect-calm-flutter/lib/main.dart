import 'package:flutter/material.dart';

void main() {
  runApp(const CareConnectSafeApp());
}

class CareConnectSafeApp extends StatelessWidget {
  const CareConnectSafeApp({super.key});

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF176B65);
    final colors = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: Brightness.light,
    );

    return MaterialApp(
      title: 'CareConnect Calm Design Samples',
      debugShowCheckedModeBanner: false,
      themeAnimationDuration: Duration.zero,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colors,
        scaffoldBackgroundColor: const Color(0xFFF7F9F8),
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: NoMotionPageTransitionsBuilder(),
            TargetPlatform.iOS: NoMotionPageTransitionsBuilder(),
            TargetPlatform.macOS: NoMotionPageTransitionsBuilder(),
            TargetPlatform.windows: NoMotionPageTransitionsBuilder(),
            TargetPlatform.linux: NoMotionPageTransitionsBuilder(),
          },
        ),
        cardTheme: const CardThemeData(
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
            side: BorderSide(color: Color(0xFFD7E2DF)),
          ),
        ),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(12)),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            minimumSize: const Size(48, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(48, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      home: const DesignSampleGallery(),
    );
  }
}

class NoMotionPageTransitionsBuilder extends PageTransitionsBuilder {
  const NoMotionPageTransitionsBuilder();

  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child;
  }
}

class DesignSampleGallery extends StatefulWidget {
  const DesignSampleGallery({super.key});

  @override
  State<DesignSampleGallery> createState() => _DesignSampleGalleryState();
}

class _DesignSampleGalleryState extends State<DesignSampleGallery> {
  int selectedIndex = 0;

  static const samples = <_SampleDestination>[
    _SampleDestination('Home', Icons.home_outlined),
    _SampleDestination('Appointments', Icons.calendar_today_outlined),
    _SampleDestination('Medications', Icons.medication_outlined),
    _SampleDestination('Media', Icons.play_circle_outline),
    _SampleDestination('Safety', Icons.shield_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    final reduceMotion = MediaQuery.maybeDisableAnimationsOf(context) ?? false;

    return Scaffold(
      appBar: AppBar(
        title: const Text('CareConnect'),
        centerTitle: false,
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Center(
              child: Semantics(
                label: 'Calm mode is active',
                child: Chip(
                  avatar: Icon(Icons.shield_outlined, size: 18),
                  label: Text('Calm mode'),
                ),
              ),
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: selectedIndex,
        children: [
          CalmHomeSample(systemReduceMotion: reduceMotion),
          const AppointmentSample(),
          const MedicationSample(),
          const MediaSafetySample(),
          SafetyPreferencesSample(systemReduceMotion: reduceMotion),
        ],
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        child: DecoratedBox(
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: Color(0xFFD7E2DF))),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              child: Row(
                children: List.generate(samples.length, (index) {
                  final item = samples[index];
                  final selected = selectedIndex == index;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    child: Semantics(
                      selected: selected,
                      button: true,
                      label: '${item.label} design sample',
                      child: TextButton.icon(
                        onPressed: () => setState(() => selectedIndex = index),
                        icon: Icon(item.icon),
                        label: Text(item.label),
                        style: TextButton.styleFrom(
                          minimumSize: const Size(48, 48),
                          foregroundColor: selected
                              ? Theme.of(context).colorScheme.onPrimaryContainer
                              : Theme.of(context).colorScheme.onSurfaceVariant,
                          backgroundColor: selected
                              ? Theme.of(context).colorScheme.primaryContainer
                              : Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SampleDestination {
  const _SampleDestination(this.label, this.icon);

  final String label;
  final IconData icon;
}

class SamplePage extends StatelessWidget {
  const SamplePage({
    required this.eyebrow,
    required this.title,
    required this.description,
    required this.children,
    super.key,
  });

  final String eyebrow;
  final String title;
  final String description;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Text(
          eyebrow.toUpperCase(),
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 4),
        Text(title, style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 8),
        Text(description, style: Theme.of(context).textTheme.bodyLarge),
        const SizedBox(height: 24),
        ...children,
      ],
    );
  }
}

class CareCard extends StatelessWidget {
  const CareCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(padding: padding, child: child),
    );
  }
}

class SectionHeading extends StatelessWidget {
  const SectionHeading(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24, bottom: 10),
      child: Text(
        text,
        style: Theme.of(context).textTheme.titleLarge
            ?.copyWith(fontWeight: FontWeight.w700),
      ),
    );
  }
}

class CalmStatus extends StatelessWidget {
  const CalmStatus({required this.icon, required this.message, super.key});

  final IconData icon;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      liveRegion: true,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.secondaryContainer,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon),
            const SizedBox(width: 10),
            Expanded(child: Text(message)),
          ],
        ),
      ),
    );
  }
}

class CalmHomeSample extends StatefulWidget {
  const CalmHomeSample({required this.systemReduceMotion, super.key});

  final bool systemReduceMotion;

  @override
  State<CalmHomeSample> createState() => _CalmHomeSampleState();
}

class _CalmHomeSampleState extends State<CalmHomeSample> {
  String status =
      'No new urgent items. Your information is shown without animation.';

  @override
  Widget build(BuildContext context) {
    return SamplePage(
      eyebrow: 'Design 1',
      title: 'Calm action-first home',
      description: 'A stable dashboard prioritizes care tasks without carousels, pulsing controls, shimmer, or autoplay.',
      children: [
        CalmStatus(
          icon: Icons.shield_outlined,
          message: widget.systemReduceMotion
              ? 'The operating system requested reduced motion. CareConnect is honoring it.'
              : status,
        ),
        const SectionHeading('Today'),
        CareCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Next appointment',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(height: 6),
              Text(
                'Primary care check-in',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 4),
              const Text('Thursday at 10:30 AM • Video visit'),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: () => setState(() {
                  status = 'Appointment details selected. No motion was used.';
                }),
                icon: const Icon(Icons.calendar_today_outlined),
                label: const Text('View appointment'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  status =
                      'Medication list selected. No flashing alert was used.';
                }),
                icon: const Icon(Icons.medication_outlined),
                label: const Text('Medications'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  status =
                      'Messages selected. Updates stay still until refreshed.';
                }),
                icon: const Icon(Icons.chat_bubble_outline),
                label: const Text('Messages'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class AppointmentSample extends StatefulWidget {
  const AppointmentSample({super.key});

  @override
  State<AppointmentSample> createState() => _AppointmentSampleState();
}

class _AppointmentSampleState extends State<AppointmentSample> {
  String status = 'Select a time, then review it before confirming.';
  String? selectedTime;

  @override
  Widget build(BuildContext context) {
    return SamplePage(
      eyebrow: 'Design 2',
      title: 'Predictable appointment flow',
      description: 'One decision per section, persistent selection states, and a review step reduce surprise and visual overload.',
      children: [
        CalmStatus(icon: Icons.info_outline, message: status),
        const SectionHeading('Choose a time'),
        ...['9:00 AM', '11:30 AM', '2:00 PM'].map((time) {
          final selected = selectedTime == time;
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: OutlinedButton(
              onPressed: () => setState(() {
                selectedTime = time;
                status = '$time selected. Review the choice below.';
              }),
              style: OutlinedButton.styleFrom(
                alignment: Alignment.centerLeft,
                backgroundColor: selected
                    ? Theme.of(context).colorScheme.primaryContainer
                    : Colors.white,
              ),
              child: Row(
                children: [
                  Icon(selected ? Icons.check_circle : Icons.circle_outlined),
                  const SizedBox(width: 12),
                  Text(time),
                ],
              ),
            ),
          );
        }),
        const SectionHeading('Review'),
        CareCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Primary care video visit'),
              const SizedBox(height: 4),
              Text(
                selectedTime == null
                    ? 'No time selected'
                    : 'Thursday at $selectedTime',
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: selectedTime == null
                    ? null
                    : () => setState(() {
                        status =
                            'Appointment confirmed for Thursday at $selectedTime.';
                      }),
                child: const Text('Confirm appointment'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class MedicationSample extends StatefulWidget {
  const MedicationSample({super.key});

  @override
  State<MedicationSample> createState() => _MedicationSampleState();
}

class _MedicationSampleState extends State<MedicationSample> {
  bool morningRecorded = false;

  @override
  Widget build(BuildContext context) {
    return SamplePage(
      eyebrow: 'Design 3',
      title: 'Stable medication check-in',
      description: 'A persistent status and explicit confirmation replace pulsing reminders, flashing warnings, and celebratory animation.',
      children: [
        CalmStatus(
          icon: morningRecorded ? Icons.check_circle_outline : Icons.schedule,
          message: morningRecorded
              ? 'Morning dose recorded at 8:00 AM.'
              : 'Morning dose is scheduled for 8:00 AM.',
        ),
        const SectionHeading('Today’s medication'),
        CareCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Sample medication',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 4),
              const Text(
                'One tablet • Follow the directions from your care team',
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: morningRecorded
                    ? null
                    : () => setState(() => morningRecorded = true),
                icon: const Icon(Icons.check),
                label: Text(morningRecorded ? 'Dose recorded' : 'Record dose'),
              ),
              const SizedBox(height: 8),
              OutlinedButton(
                onPressed: () {},
                child: const Text('I need help'),
              ),
            ],
          ),
        ),
        const SectionHeading('Safety pattern'),
        const Text(
          'Medication information is illustrative only. Real medication instructions must come from verified clinical data and the user’s care team.',
        ),
      ],
    );
  }
}

class MediaSafetySample extends StatefulWidget {
  const MediaSafetySample({super.key});

  @override
  State<MediaSafetySample> createState() => _MediaSafetySampleState();
}

class _MediaSafetySampleState extends State<MediaSafetySample> {
  bool reviewedWarning = false;
  String status = 'Playback is stopped. No animated preview is running.';

  @override
  Widget build(BuildContext context) {
    return SamplePage(
      eyebrow: 'Design 4',
      title: 'Tap-to-preview media gate',
      description: 'Every video, animated image, advertisement, and user upload begins behind a static poster and an explicit warning.',
      children: [
        CalmStatus(icon: Icons.pause_circle_outline, message: status),
        const SectionHeading('Education video'),
        CareCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                height: 190,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5ECEA),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF9BAEAA)),
                ),
                child: const Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.image_outlined, size: 48),
                    SizedBox(height: 8),
                    Text('Static preview image'),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Content notice: This media has not been certified free of flashing imagery.',
              ),
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: reviewedWarning,
                onChanged: (value) =>
                    setState(() => reviewedWarning = value ?? false),
                title: const Text('I reviewed the content notice'),
                controlAffinity: ListTileControlAffinity.leading,
              ),
              FilledButton.icon(
                onPressed: reviewedWarning
                    ? () => setState(() {
                        status = 'Sample playback remains disabled; the safety gate was demonstrated.';
                      })
                    : null,
                icon: const Icon(Icons.play_arrow),
                label: const Text('Play media'),
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                onPressed: () => setState(() {
                  status =
                      'Transcript selected as the nonanimated alternative.';
                }),
                icon: const Icon(Icons.article_outlined),
                label: const Text('Read transcript instead'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class SafetyPreferencesSample extends StatefulWidget {
  const SafetyPreferencesSample({required this.systemReduceMotion, super.key});

  final bool systemReduceMotion;

  @override
  State<SafetyPreferencesSample> createState() =>
      _SafetyPreferencesSampleState();
}

class _SafetyPreferencesSampleState extends State<SafetyPreferencesSample> {
  bool calmMode = true;
  bool autoplay = false;
  bool animatedImages = false;
  bool warnings = true;

  @override
  Widget build(BuildContext context) {
    return SamplePage(
      eyebrow: 'Design 5',
      title: 'Motion and media safety center',
      description: 'A single preference center controls motion, autoplay, animated images, warnings, and update behavior.',
      children: [
        CalmStatus(
          icon: Icons.settings_accessibility,
          message: widget.systemReduceMotion
              ? 'System reduced motion is on. The strictest safety setting takes priority.'
              : 'System reduced motion is not currently requested. In-app Calm mode remains on by default.',
        ),
        const SectionHeading('Safety preferences'),
        CareCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              CheckboxListTile(
                value: calmMode,
                onChanged: (value) => setState(() => calmMode = value ?? true),
                title: const Text('Calm mode'),
                subtitle: const Text('Removes nonessential motion'),
                controlAffinity: ListTileControlAffinity.leading,
              ),
              const Divider(height: 1),
              CheckboxListTile(
                value: autoplay,
                onChanged: (value) => setState(() => autoplay = value ?? false),
                title: const Text('Autoplay media'),
                subtitle: const Text('Recommended: Off'),
                controlAffinity: ListTileControlAffinity.leading,
              ),
              const Divider(height: 1),
              CheckboxListTile(
                value: animatedImages,
                onChanged: (value) =>
                    setState(() => animatedImages = value ?? false),
                title: const Text('Play animated images'),
                subtitle: const Text('Recommended: Off'),
                controlAffinity: ListTileControlAffinity.leading,
              ),
              const Divider(height: 1),
              CheckboxListTile(
                value: warnings,
                onChanged: (value) => setState(() => warnings = value ?? true),
                title: const Text('Show media safety warnings'),
                subtitle: const Text('Recommended: On'),
                controlAffinity: ListTileControlAffinity.leading,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Effective state: ${calmMode || widget.systemReduceMotion ? 'Reduced motion' : 'Standard motion'} • '
          '${autoplay ? 'Autoplay allowed' : 'Autoplay blocked'} • '
          '${animatedImages ? 'Animated images allowed' : 'Animated images blocked'}',
        ),
      ],
    );
  }
}
