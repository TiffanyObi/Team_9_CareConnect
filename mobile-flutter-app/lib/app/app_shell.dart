import 'package:careconnect_flutter/core/accessibility/accessibility_controller.dart';
import 'package:careconnect_flutter/features/dashboard/today_screen.dart';
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
            const _PlaceholderScreen(title: 'Medications'),
            const _PlaceholderScreen(title: 'Care'),
            const _PlaceholderScreen(title: 'Messages'),
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

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) => Center(
    child: Semantics(
      header: true,
      child: Text(title, style: Theme.of(context).textTheme.displayMedium),
    ),
  );
}
