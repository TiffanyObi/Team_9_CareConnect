import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:flutter/material.dart';

import 'health_log_controller.dart';
import 'health_log_repository.dart';

class HealthLogScreen extends StatefulWidget {
  const HealthLogScreen({this.controller, super.key});
  final HealthLogController? controller;
  @override
  State<HealthLogScreen> createState() => _HealthLogScreenState();
}

class _HealthLogScreenState extends State<HealthLogScreen> {
  static const _symptoms = [
    'Knee pain',
    'Fatigue',
    'Headache',
    'Dizziness',
    'Seizure activity',
  ];
  final _notesController = TextEditingController();
  late final HealthLogController _controller;
  late final bool _ownsController;
  String? _symptom;

  @override
  void initState() {
    super.initState();
    _ownsController = widget.controller == null;
    _controller =
        widget.controller ??
        HealthLogController(repository: MemoryHealthLogRepository());
    _controller.addListener(_refresh);
    _controller.load();
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _notesController.dispose();
    _controller.removeListener(_refresh);
    if (_ownsController) _controller.dispose();
    super.dispose();
  }

  void _save() {
    if (_symptom == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Choose a symptom to continue.')),
      );
      return;
    }
    _controller.add(symptom: _symptom!, notes: _notesController.text.trim());
    setState(() {
      _symptom = null;
      _notesController.clear();
    });
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Health log saved.')));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Health log')),
    body: ListView(
      key: const Key('health-log-scroll-view'),
      padding: const EdgeInsets.all(20),
      children: [
        Semantics(
          header: true,
          child: Text(
            'How are you feeling?',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
        ),
        const SizedBox(height: 4),
        const Text('Record symptoms without animation or pressure'),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          initialValue: _symptom,
          isExpanded: true,
          decoration: const InputDecoration(
            labelText: 'Symptom',
            border: OutlineInputBorder(),
          ),
          items: _symptoms
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: (value) => setState(() => _symptom = value),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _notesController,
          minLines: 3,
          maxLines: 5,
          decoration: const InputDecoration(
            labelText: 'Private notes (optional)',
            hintText: 'Add details about how you feel',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        AppButton(label: 'Save today’s log', onPressed: _save),
        const SizedBox(height: 24),
        Text(
          'Recent health logs',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        if (_controller.logs.isEmpty)
          const Text('No symptoms logged yet.')
        else
          ..._controller.logs.map(
            (entry) => Card(
              child: ListTile(
                title: Text(entry.symptom),
                subtitle: Text(
                  entry.notes.isEmpty ? 'No note added' : entry.notes,
                ),
                trailing: Text(_time(entry.recordedAt)),
              ),
            ),
          ),
      ],
    ),
  );

  String _time(DateTime value) {
    final hour = value.hour % 12 == 0 ? 12 : value.hour % 12;
    return '$hour:${value.minute.toString().padLeft(2, '0')} ${value.hour >= 12 ? 'PM' : 'AM'}';
  }
}
