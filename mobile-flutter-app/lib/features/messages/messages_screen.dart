import 'package:flutter/material.dart';

import 'message_detail_screen.dart';
import 'message_repository.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({
    this.repository = const MessageRepository(),
    super.key,
  });

  final MessageRepository repository;

  @override
  Widget build(BuildContext context) {
    final messages = repository.loadMessages();
    return CustomScrollView(
      key: const Key('messages-scroll-view'),
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
          sliver: SliverList.list(
            children: [
              Semantics(
                header: true,
                child: Text(
                  'Messages',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              const SizedBox(height: 8),
              const Text('Private updates from your care team'),
              const SizedBox(height: 20),
              if (messages.isEmpty)
                const Text('No messages right now.')
              else
                ...messages.map(
                  (message) => Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      title: Text(message.subject),
                      subtitle: Text(message.sender),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => MessageDetailScreen(message: message),
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
