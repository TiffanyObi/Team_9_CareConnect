import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';

import '../../app/app_routes.dart';
import 'message_repository.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({
    this.repository = const MessageRepository(),
    super.key,
  });

  final MessageRepository repository;

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  Future<void> _newMessage() => showDialog<void>(
    context: context,
    builder: (_) => const _NewMessageDialog(),
  );

  @override
  Widget build(BuildContext context) {
    final messages = widget.repository.loadMessages();
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
                  'Care team messages',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              const SizedBox(height: 8),
              const Text('Private conversations with clear sharing'),
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
                      onTap: () => context.push(
                        AppRoutes.messageDetail,
                        extra: MessageRouteArguments(message: message),
                      ),
                    ),
                  ),
                ),
              const SizedBox(height: 8),
              AppButton(label: 'New message', onPressed: _newMessage),
              const SizedBox(height: 12),
              const AppCard(
                color: Color(0xFFEAF7EE),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Privacy note',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.lightText,
                      ),
                    ),
                    Text(
                      'Messages show only the sender’s name on the lock screen.',
                      style: TextStyle(color: AppColors.lightTextSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _NewMessageDialog extends StatefulWidget {
  const _NewMessageDialog();

  @override
  State<_NewMessageDialog> createState() => _NewMessageDialogState();
}

class _NewMessageDialogState extends State<_NewMessageDialog> {
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: const Text('New message'),
    content: TextField(
      controller: _messageController,
      minLines: 3,
      maxLines: 5,
      decoration: const InputDecoration(
        labelText: 'Message caregiver',
        border: OutlineInputBorder(),
      ),
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      const FilledButton(onPressed: null, child: Text('Send')),
    ],
  );
}
