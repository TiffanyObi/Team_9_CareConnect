import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_routes.dart';
import 'medication_repository.dart';
import 'medication_controller.dart';
import 'medication_log_repository.dart';

class MedicationsScreen extends StatefulWidget {
  const MedicationsScreen({
    this.repository = const MedicationRepository(),
    this.controller,
    super.key,
  });
  final MedicationRepository repository;
  final MedicationController? controller;

  @override
  State<MedicationsScreen> createState() => _MedicationsScreenState();
}

class _MedicationsScreenState extends State<MedicationsScreen> {
  late final MedicationController _controller;
  late final bool _ownsController;

  @override
  void initState() {
    super.initState();
    _ownsController = widget.controller == null;
    _controller =
        widget.controller ??
        MedicationController(
          logRepository: MemoryMedicationLogRepository(),
          medicationRepository: widget.repository,
        );
    _controller.addListener(_refresh);
    _controller.load();
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _controller.removeListener(_refresh);
    if (_ownsController) _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final medications = _controller.medications;
    return CustomScrollView(
      key: const Key('medications-scroll-view'),
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
          sliver: SliverList.list(
            children: [
              Semantics(
                header: true,
                child: Text(
                  'Medications',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your current medication schedule',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 20),
              if (medications.isEmpty)
                const Text('No medications have been added yet.')
              else
                ...medications.map(
                  (medication) => Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      title: Text(medication.name),
                      subtitle: Text(
                        '${medication.dosage} • ${medication.schedule}',
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.push(
                        AppRoutes.medicationDetail,
                        extra: MedicationRouteArguments(
                          medication: medication,
                          onMarkedTaken: (time) =>
                              _controller.markTaken(medication, at: time),
                        ),
                      ),
                    ),
                  ),
                ),
              const SizedBox(height: 12),
              Text(
                'Medication logs',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              if (_controller.logs.isEmpty)
                const Text('No doses logged yet.')
              else
                ..._controller.logs.map(
                  (log) => Card(
                    child: ListTile(
                      leading: const Icon(Icons.check_circle_outline),
                      title: Text('${log.medicationName} taken'),
                      subtitle: Text(_formatTime(log.takenAt)),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime value) {
    final hour = value.hour % 12 == 0 ? 12 : value.hour % 12;
    final minute = value.minute.toString().padLeft(2, '0');
    final period = value.hour >= 12 ? 'PM' : 'AM';
    return 'Today at $hour:$minute $period';
  }
}
