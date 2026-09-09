import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_routes.dart';
import 'appointment.dart';

class AppointmentDetailScreen extends StatelessWidget {
  const AppointmentDetailScreen({required this.appointment, super.key});
  final Appointment appointment;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Appointment details')),
    body: ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Semantics(
          header: true,
          child: Text(
            appointment.title,
            style: Theme.of(context).textTheme.headlineMedium,
          ),
        ),
        const SizedBox(height: 4),
        Text('${appointment.dateAndTime} • ${appointment.location}'),
        const SizedBox(height: 16),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Before you go',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const Text('Bring insurance card • Arrive 10 minutes early'),
            ],
          ),
        ),
        const SizedBox(height: 12),
        AppCard(
          color: const Color(0xFFEAF2FF),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Questions for the therapist',
                style: Theme.of(context).textTheme.titleLarge
                    ?.copyWith(color: AppColors.lightText),
              ),
              const Text(
                '• Is my knee pain improving?\n• Which home exercises are safest?',
                style: TextStyle(color: AppColors.lightTextSecondary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        AppButton(
          label: 'Check in',
          onPressed: () => context.push(AppRoutes.healthLog),
        ),
        const SizedBox(height: 12),
        AppButton(
          label: 'Message caregiver',
          secondary: true,
          onPressed: () => context.go(AppRoutes.messages),
        ),
      ],
    ),
  );
}
