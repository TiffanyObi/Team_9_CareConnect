import 'package:flutter/material.dart';

import 'care_recipient.dart';

class CareRecipientDetailScreen extends StatelessWidget {
  const CareRecipientDetailScreen({required this.recipient, super.key});

  final CareRecipient recipient;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Care details')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Semantics(
            header: true,
            child: Text(
              recipient.name,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          const SizedBox(height: 24),
          Text('Relationship', style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: 4),
          Text(recipient.relationship),
          const SizedBox(height: 20),
          Text(
            'Support permissions',
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 4),
          Text(recipient.supportNote),
        ],
      ),
    );
  }
}
