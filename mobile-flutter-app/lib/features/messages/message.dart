class Message {
  const Message({
    required this.sender,
    required this.subject,
    required this.body,
  });

  final String sender;
  final String subject;
  final String body;

  bool get isValid =>
      sender.trim().isNotEmpty &&
      subject.trim().isNotEmpty &&
      body.trim().isNotEmpty;
}
