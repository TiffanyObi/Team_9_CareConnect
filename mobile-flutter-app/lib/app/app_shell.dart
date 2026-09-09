import 'package:careconnect_flutter/app/app_routes.dart';
import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/features/dashboard/today_screen.dart';
import 'package:careconnect_flutter/features/care/care_screen.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:careconnect_flutter/features/messages/messages_screen.dart';
import 'package:careconnect_flutter/features/settings/accessibility_settings_screen.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppShell extends StatefulWidget {
  const AppShell({required this.selectedIndex, super.key});

  final int selectedIndex;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  @override
  Widget build(BuildContext context) {
    final selectedIndex = widget.selectedIndex;
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: selectedIndex,
          children: [
            TodayScreen(
              onLogout: () => context.go(AppRoutes.signIn),
              onShowMedications: () => context.go(AppRoutes.medications),
            ),
            const MedicationsScreen(),
            const CareScreen(),
            const MessagesScreen(),
            const AccessibilitySettingsScreen(),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
        selectedIndex: selectedIndex,
        onDestinationSelected: (value) =>
            context.go(AppRoutes.workspacePaths[value]),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Today',
          ),
          NavigationDestination(
            icon: Icon(Icons.medication_outlined),
            label: 'Meds',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month),
            label: 'Care',
          ),
          NavigationDestination(
            icon: Icon(Icons.message_outlined),
            label: 'Messages',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
      floatingActionButton: Visibility(
        visible: selectedIndex == 2,
        maintainState: true,
        maintainAnimation: true,
        maintainSize: true,
        child: Semantics(
          button: true,
          label: 'Emergency assistance',
          child: FloatingActionButton.extended(
            heroTag: 'emergency-assistance',
            backgroundColor: AppColors.emergency,
            foregroundColor: Colors.white,
            icon: const Icon(Icons.emergency_outlined),
            label: const Text('Emergency'),
            onPressed: () => context.push(AppRoutes.emergency),
          ),
        ),
      ),
      floatingActionButtonAnimator: FloatingActionButtonAnimator.noAnimation,
    );
  }
}
