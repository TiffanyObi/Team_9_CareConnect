import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';
import 'package:flutter/material.dart';

class EmergencyAssistanceScreen extends StatelessWidget {
  const EmergencyAssistanceScreen({super.key});

  Future<void> _showCalledAlert(BuildContext context) => showDialog<void>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Emergency services called'),
      content: const Text('Emergency services have been called.'),
      actions: [
        FilledButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Emergency assistance')),
    body: SafeArea(
      child: ListView(
        key: const Key('emergency-assistance-scroll-view'),
        padding: const EdgeInsets.all(20),
        children: [
          Semantics(
            header: true,
            child: Text(
              'Emergency assistance',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          const SizedBox(height: 4),
          const Text('Use only when you or someone else may be in danger.'),
          const SizedBox(height: 16),
          const AppCard(
            color: Color(0xFFEAF2FF),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Your location',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.lightText,
                  ),
                ),
                Text(
                  'Ready to share only after confirmation.',
                  style: TextStyle(color: AppColors.lightTextSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Semantics(
            button: true,
            label: 'Call emergency services',
            child: FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.emergency,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(52),
              ),
              onPressed: () => _showCalledAlert(context),
              child: const Text('Call emergency services'),
            ),
          ),
          const SizedBox(height: 12),
          const AppButton(
            label: 'Alert caregiver',
            secondary: true,
            onPressed: null,
          ),
          const SizedBox(height: 12),
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'What happens next',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const Text(
                  '1. You confirm the action\n'
                  '2. A static status stays visible\n'
                  '3. Response acknowledgment is recorded',
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
