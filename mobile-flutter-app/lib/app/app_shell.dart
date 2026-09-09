import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/features/dashboard/today_screen.dart';
import 'package:careconnect_flutter/features/care/care_screen.dart';
import 'package:careconnect_flutter/features/care/emergency_assistance_screen.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:careconnect_flutter/features/messages/messages_screen.dart';
import 'package:careconnect_flutter/features/settings/accessibility_settings_screen.dart';
import 'package:flutter/material.dart';

class AppShell extends StatefulWidget {
  const AppShell({required this.controller, required this.onLogout, super.key});

  final AccessibilityController controller;
  final VoidCallback onLogout;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  var _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _selectedIndex,
          children: [
            TodayScreen(
              controller: widget.controller,
              onLogout: widget.onLogout,
              onShowMedications: () => setState(() => _selectedIndex = 1),
            ),
            const MedicationsScreen(),
            CareScreen(
              onMessageCaregiver: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
                setState(() => _selectedIndex = 3);
              },
            ),
            const MessagesScreen(),
            AccessibilitySettingsScreen(controller: widget.controller),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
        selectedIndex: _selectedIndex,
        onDestinationSelected: (value) =>
            setState(() => _selectedIndex = value),
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
        visible: _selectedIndex == 2,
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
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => const EmergencyAssistanceScreen(),
              ),
            ),
          ),
        ),
      ),
      floatingActionButtonAnimator: FloatingActionButtonAnimator.noAnimation,
    );
  }
}
