import 'package:careconnect_flutter/features/care/appointment.dart';
import 'package:careconnect_flutter/features/medications/medication.dart';
import 'package:careconnect_flutter/features/messages/message.dart';

abstract final class AppRoutes {
  static const signIn = '/sign-in';
  static const accessibilitySetup = '/accessibility-setup';
  static const today = '/workspace/today';
  static const medications = '/workspace/medications';
  static const care = '/workspace/care';
  static const messages = '/workspace/messages';
  static const settings = '/workspace/settings';
  static const medicationDetail = '/medication-details';
  static const appointmentDetail = '/appointment-details';
  static const messageDetail = '/message-details';
  static const healthLog = '/health-log';
  static const emergency = '/emergency-assistance';

  static const workspacePaths = [today, medications, care, messages, settings];
}

class MedicationRouteArguments {
  const MedicationRouteArguments({
    required this.medication,
    this.onMarkedTaken,
  });

  final Medication medication;
  final void Function(DateTime)? onMarkedTaken;
}

class AppointmentRouteArguments {
  const AppointmentRouteArguments({required this.appointment});

  final Appointment appointment;
}

class MessageRouteArguments {
  const MessageRouteArguments({required this.message});

  final Message message;
}
