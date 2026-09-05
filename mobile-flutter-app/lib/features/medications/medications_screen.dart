import 'package:flutter/material.dart';

import 'medication_detail_screen.dart';
import 'medication_repository.dart';

class MedicationsScreen extends StatelessWidget {
  const MedicationsScreen({
    this.repository = const MedicationRepository(),
    super.key,
  });

  final MedicationRepository repository;

  @override
  Widget build(BuildContext context) {
    final medications = repository.loadMedications();
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
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) =>
                              MedicationDetailScreen(medication: medication),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
