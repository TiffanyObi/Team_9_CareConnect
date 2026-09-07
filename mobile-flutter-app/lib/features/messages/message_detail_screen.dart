import 'package:flutter/material.dart';

import 'message.dart';

class MessageDetailScreen extends StatelessWidget {
  const MessageDetailScreen({required this.message, super.key});

  final Message message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Message')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Semantics(
            header: true,
            child: Text(
              message.subject,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'From ${message.sender}',
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 24),
          Text(message.body, style: Theme.of(context).textTheme.bodyLarge),
        ],
      ),
    );
  }
}
