import 'package:careconnect_flutter/app/app_routes.dart';
import 'package:careconnect_flutter/app/app_shell.dart';
import 'package:careconnect_flutter/features/auth/auth_screen.dart';
import 'package:careconnect_flutter/features/auth/auth_controller.dart';
import 'package:careconnect_flutter/features/care/appointment_detail_screen.dart';
import 'package:careconnect_flutter/features/care/emergency_assistance_screen.dart';
import 'package:careconnect_flutter/features/care/health_log_screen.dart';
import 'package:careconnect_flutter/features/care/health_log_controller.dart';
import 'package:careconnect_flutter/features/medications/medication_detail_screen.dart';
import 'package:careconnect_flutter/features/messages/message_detail_screen.dart';
import 'package:careconnect_flutter/features/settings/accessibility_settings_screen.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

GoRouter createAppRouter({
  required bool startAuthenticated,
  required AuthController authController,
}) => GoRouter(
  initialLocation: startAuthenticated ? AppRoutes.today : AppRoutes.signIn,
  routes: [
    GoRoute(
      path: AppRoutes.signIn,
      builder: (context, state) => AuthScreen(
        controller: authController,
        onSignedIn: () => context.go(AppRoutes.today),
        onSignedUp: () => context.go(AppRoutes.accessibilitySetup),
      ),
    ),
    GoRoute(
      path: AppRoutes.accessibilitySetup,
      builder: (context, state) => AccessibilitySettingsScreen(
        onboarding: true,
        onSaved: () => context.go(AppRoutes.today),
      ),
    ),
    GoRoute(
      path: '/workspace/:section',
      builder: (context, state) {
        final path = '/workspace/${state.pathParameters['section']}';
        final selectedIndex = AppRoutes.workspacePaths.indexOf(path);
        return AppShell(selectedIndex: selectedIndex < 0 ? 0 : selectedIndex);
      },
    ),
    GoRoute(
      path: AppRoutes.medicationDetail,
      builder: (context, state) {
        final arguments = state.extra;
        if (arguments is! MedicationRouteArguments) {
          return const _MissingRouteDataScreen(label: 'medication');
        }
        return MedicationDetailScreen(
          medication: arguments.medication,
          onMarkedTaken: arguments.onMarkedTaken,
        );
      },
    ),
    GoRoute(
      path: AppRoutes.appointmentDetail,
      builder: (context, state) {
        final arguments = state.extra;
        if (arguments is! AppointmentRouteArguments) {
          return const _MissingRouteDataScreen(label: 'appointment');
        }
        return AppointmentDetailScreen(appointment: arguments.appointment);
      },
    ),
    GoRoute(
      path: AppRoutes.messageDetail,
      builder: (context, state) {
        final arguments = state.extra;
        if (arguments is! MessageRouteArguments) {
          return const _MissingRouteDataScreen(label: 'message');
        }
        return MessageDetailScreen(message: arguments.message);
      },
    ),
    GoRoute(
      path: AppRoutes.healthLog,
      builder: (context, state) =>
          HealthLogScreen(controller: context.read<HealthLogController>()),
    ),
    GoRoute(
      path: AppRoutes.emergency,
      builder: (context, state) => const EmergencyAssistanceScreen(),
    ),
  ],
  errorBuilder: (context, state) =>
      const _MissingRouteDataScreen(label: 'page'),
);

class _MissingRouteDataScreen extends StatelessWidget {
  const _MissingRouteDataScreen({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Page unavailable')),
    body: Center(child: Text('The requested $label is unavailable.')),
  );
}
