import 'package:flutter_test/flutter_test.dart';

import 'package:careconnect_flutter/main.dart';

void main() {
  testWidgets('CareConnect starter renders key content', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const CareConnectApp());

    expect(find.text('Hello, SWEN 661!'), findsOneWidget);
    expect(find.textContaining('Flutter starter'), findsOneWidget);
    expect(find.textContaining('no animation'), findsOneWidget);
  });
}
