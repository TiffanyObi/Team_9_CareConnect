import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:careconnect_flutter/core/widgets/app_card.dart';
import 'package:flutter/material.dart';

class TodayScreen extends StatelessWidget {
  const TodayScreen({this.onLogout, this.onShowMedications, super.key});
  final VoidCallback? onLogout;
  final VoidCallback? onShowMedications;

  Future<void> _confirmLogout(BuildContext context) async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Log out?'),
        content: const Text('Are you sure you want to log out of CareConnect?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Log out'),
          ),
        ],
      ),
    );
    if (shouldLogout == true) onLogout?.call();
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      key: const Key('today-scroll-view'),
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
          sliver: SliverList.list(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'CareConnect',
                      softWrap: true,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.secondary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  SizedBox(
                    width: 48,
                    height: 48,
                    child: IconButton(
                      tooltip: 'Log out',
                      onPressed: onLogout == null
                          ? null
                          : () => _confirmLogout(context),
                      icon: const Icon(Icons.logout),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Semantics(
                header: true,
                child: Text(
                  'Good morning, Olivia',
                  style: Theme.of(context).textTheme.displayLarge,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Tuesday, August 31 • 2 tasks remaining',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 16),
              AppCard(
                semanticLabel:
                    'Medication due at 8 AM. Levetiracetam. Take with water.',
                color: Theme.of(context).brightness == Brightness.light
                    ? const Color(0xFFFFF8E6)
                    : null,
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Medication due at 8:00 AM',
                      style: TextStyle(
                        fontSize: 18,
                        height: 1.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text('Levetiracetam • Take with water'),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: 'Log medication',
                  onPressed: onShowMedications,
                ),
              ),
              const SizedBox(height: 16),
              const AppCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Physical therapy',
                      style: TextStyle(
                        fontSize: 18,
                        height: 1.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text('3:30 PM • Northside Clinic'),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const AppCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Caregiver connection',
                      style: TextStyle(
                        fontSize: 18,
                        height: 1.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text('Mom can view medication status, not private notes.'),
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
