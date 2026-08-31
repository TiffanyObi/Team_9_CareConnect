import 'package:flutter/material.dart';

class AppCard extends StatelessWidget {
  const AppCard({
    required this.child,
    this.semanticLabel,
    this.color,
    super.key,
  });

  final Widget child;
  final String? semanticLabel;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final card = Card(
      color: color,
      margin: EdgeInsets.zero,
      child: Padding(padding: const EdgeInsets.all(16), child: child),
    );
    return semanticLabel == null
        ? card
        : Semantics(container: true, label: semanticLabel, child: card);
  }
}
