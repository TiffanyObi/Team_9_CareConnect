import 'package:flutter/material.dart';

import 'care_recipient_detail_screen.dart';
import 'care_repository.dart';

class CareScreen extends StatelessWidget {
  const CareScreen({this.repository = const CareRepository(), super.key});

  final CareRepository repository;

  @override
  Widget build(BuildContext context) {
    final recipients = repository.loadRecipients();
    return CustomScrollView(
      key: const Key('care-scroll-view'),
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
          sliver: SliverList.list(
            children: [
              Semantics(
                header: true,
                child: Text(
                  'Care team',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              const SizedBox(height: 8),
              const Text('People connected to your care plan'),
              const SizedBox(height: 20),
              if (recipients.isEmpty)
                const Text('No care team members have been added yet.')
              else
                ...recipients.map(
                  (recipient) => Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      title: Text(recipient.name),
                      subtitle: Text(recipient.relationship),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) =>
                              CareRecipientDetailScreen(recipient: recipient),
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
