import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_routes.dart';
import 'appointment.dart';

class CareScreen extends StatefulWidget {
  const CareScreen({super.key});
  @override
  State<CareScreen> createState() => _CareScreenState();
}

class _CareScreenState extends State<CareScreen> {
  final List<Appointment> _appointments = [
    const Appointment(
      title: 'Physical therapy',
      dateAndTime: 'Today • 3:30 PM',
      location: 'Northside Clinic • Room 204',
    ),
    const Appointment(
      title: 'Neurology follow-up',
      dateAndTime: 'September 14 • 10:00 AM',
      location: 'Video visit',
    ),
  ];

  Future<void> _addAppointment() => showDialog<void>(
    context: context,
    builder: (_) => const _AddAppointmentDialog(),
  );

  @override
  Widget build(BuildContext context) => CustomScrollView(
    key: const Key('care-scroll-view'),
    slivers: [
      SliverPadding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
        sliver: SliverList.list(
          children: [
            Semantics(
              header: true,
              child: Text(
                'Your appointments',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ),
            const SizedBox(height: 8),
            const Text('Upcoming visits and questions to ask'),
            const SizedBox(height: 20),
            ..._appointments.map(
              (appointment) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  title: Text(appointment.title),
                  subtitle: Text(
                    '${appointment.dateAndTime}\n${appointment.location}',
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.push(
                    AppRoutes.appointmentDetail,
                    extra: AppointmentRouteArguments(appointment: appointment),
                  ),
                ),
              ),
            ),
            AppButton(label: 'Add appointment', onPressed: _addAppointment),
            const SizedBox(height: 12),
            const AppButton(
              label: 'View calendar',
              secondary: true,
              onPressed: null,
            ),
          ],
        ),
      ),
    ],
  );
}

class _AddAppointmentDialog extends StatefulWidget {
  const _AddAppointmentDialog();

  @override
  State<_AddAppointmentDialog> createState() => _AddAppointmentDialogState();
}

class _AddAppointmentDialogState extends State<_AddAppointmentDialog> {
  final _titleController = TextEditingController();
  final _detailsController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: const Text('Add appointment'),
    content: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        TextField(
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Appointment name'),
        ),
        TextField(
          controller: _detailsController,
          decoration: const InputDecoration(labelText: 'Date and time'),
        ),
      ],
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      const FilledButton(onPressed: null, child: Text('Save appointment')),
    ],
  );
}
