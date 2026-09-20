import 'dart:async';

import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';
import 'package:flutter/material.dart';

import 'medication.dart';

class MedicationDetailScreen extends StatefulWidget {
  const MedicationDetailScreen({
    required this.medication,
    this.onMarkedTaken,
    super.key,
  });
  final Medication medication;
  final FutureOr<void> Function(DateTime)? onMarkedTaken;

  @override
  State<MedicationDetailScreen> createState() => _MedicationDetailScreenState();
}

class _MedicationDetailScreenState extends State<MedicationDetailScreen> {
  DateTime? _takenAt;

  bool _saving = false;
  Future<void> _markTaken() async {
    if (_saving) return;
    setState(() => _saving = true);
    final time = DateTime.now();
    try {
      await widget.onMarkedTaken?.call(time);
      if (!mounted) return;
      setState(() => _takenAt = time);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Medication marked as taken.')),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Medication not saved. Please try again.'),
        ),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final medication = widget.medication;
    return Scaffold(
      appBar: AppBar(title: const Text('Medication details')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Semantics(
            header: true,
            child: Text(
              medication.name,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${medication.dosage} • ${medication.schedule}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 16),
          AppCard(
            color: Theme.of(context).brightness == Brightness.light
                ? const Color(0xFFFFF8E6)
                : null,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Today’s dose",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(
                  _takenAt == null
                      ? 'Scheduled for 8:00 AM • Not logged'
                      : 'Taken today • Logged',
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Instructions',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(medication.instructions),
              ],
            ),
          ),
          const SizedBox(height: 12),
          AppButton(
            label: _saving
                ? 'Saving…'
                : _takenAt == null
                ? 'Mark as taken'
                : 'Taken',
            onPressed: _takenAt == null && !_saving ? _markTaken : null,
          ),
          const SizedBox(height: 12),
          const AppCard(
            color: Color(0xFFEAF2FF),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Sharing preview',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.lightText,
                  ),
                ),
                Text(
                  'Caregiver sees: taken/missed status only.',
                  style: TextStyle(color: AppColors.lightTextSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
