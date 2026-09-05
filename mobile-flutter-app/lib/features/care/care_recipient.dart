class CareRecipient {
  const CareRecipient({
    required this.name,
    required this.relationship,
    required this.supportNote,
  });

  final String name;
  final String relationship;
  final String supportNote;

  bool get isValid =>
      name.trim().isNotEmpty &&
      relationship.trim().isNotEmpty &&
      supportNote.trim().isNotEmpty;
}
