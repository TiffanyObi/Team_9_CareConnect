import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/features/dashboard/today_screen.dart';
import 'package:careconnect_flutter/features/care/care_screen.dart';
import 'package:careconnect_flutter/features/medications/medications_screen.dart';
import 'package:careconnect_flutter/features/messages/messages_screen.dart';
import 'package:flutter/material.dart';

class AppShell extends StatefulWidget {
  const AppShell({required this.controller, super.key});

  final AccessibilityController controller;

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
            TodayScreen(controller: widget.controller),
            const MedicationsScreen(),
            const CareScreen(),
            const MessagesScreen(),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
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
            icon: Icon(Icons.favorite_outline),
            label: 'Care',
          ),
          NavigationDestination(
            icon: Icon(Icons.message_outlined),
            label: 'Messages',
          ),
        ],
      ),
    );
  }
}
