import 'message.dart';

class MessageRepository {
  const MessageRepository();

  List<Message> loadMessages() => const [
    Message(
      sender: 'Maya Johnson',
      subject: 'Checking in',
      body: 'Hope your appointment went smoothly today. I am here if you need anything.',
    ),
    Message(
      sender: 'Northside Clinic',
      subject: 'Appointment reminder',
      body: 'Your physical therapy appointment is scheduled for Tuesday at 3:30 PM.',
    ),
  ];
}
