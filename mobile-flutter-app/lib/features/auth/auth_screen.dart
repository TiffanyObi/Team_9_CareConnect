import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:careconnect_flutter/core/widgets/app_button.dart';
import 'package:flutter/material.dart';

enum _AuthMode { signIn, signUp }

/// The entry screen for returning and new CareConnect members.
///
/// This local-only flow intentionally does not persist credentials. It provides
/// a complete, accessible interaction path until a backend is connected.
class AuthScreen extends StatefulWidget {
  const AuthScreen({
    required this.onSignedIn,
    required this.onSignedUp,
    super.key,
  });

  final VoidCallback onSignedIn;
  final VoidCallback onSignedUp;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmationController = TextEditingController();
  var _mode = _AuthMode.signIn;
  var _obscurePassword = true;
  var _obscureConfirmation = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmationController.dispose();
    super.dispose();
  }

  void _changeMode(_AuthMode mode) {
    setState(() {
      _mode = mode;
      _formKey.currentState?.reset();
    });
  }

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    switch (_mode) {
      case _AuthMode.signIn:
        widget.onSignedIn();
      case _AuthMode.signUp:
        widget.onSignedUp();
    }
  }

  String? _required(String? value, String label) {
    if (value == null || value.trim().isEmpty) return 'Enter your $label.';
    return null;
  }

  String? _emailValidator(String? value) {
    final required = _required(value, 'email address');
    if (required != null) return required;
    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value!.trim())) {
      return 'Enter a valid email address.';
    }
    return null;
  }

  String? _passwordValidator(String? value) {
    final required = _required(value, 'password');
    if (required != null) return required;
    if (_mode == _AuthMode.signUp && value!.length < 8) {
      return 'Use at least 8 characters.';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final isSignUp = _mode == _AuthMode.signUp;
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: ListView(
                padding: EdgeInsets.fromLTRB(
                  20,
                  24,
                  20,
                  constraints.maxHeight < 560 ? 24 : 48,
                ),
                children: [
                  Wrap(
                    alignment: WrapAlignment.spaceBetween,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        'CareConnect',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: scheme.secondary,
                        ),
                      ),
                      TextButton(
                        onPressed: () => ScaffoldMessenger.of(context)
                            .showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Help is available from your care team.',
                                ),
                              ),
                            ),
                        child: const Text('Help'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Semantics(
                    header: true,
                    child: Text(
                      isSignUp ? 'Create your account' : 'Sign in',
                      style: theme.textTheme.displayMedium,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isSignUp
                        ? 'Set up secure access, then personalize Safeview.'
                        : 'Use your existing CareConnect account.',
                    style: theme.textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 20),
                  Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (isSignUp) ...[
                          _AuthField(
                            controller: _nameController,
                            label: 'Full name',
                            hint: 'Olivia Martinez',
                            textCapitalization: TextCapitalization.words,
                            validator: (value) => _required(value, 'full name'),
                          ),
                          const SizedBox(height: 12),
                        ],
                        _AuthField(
                          controller: _emailController,
                          label: 'Email',
                          hint: 'olivia@example.com',
                          keyboardType: TextInputType.emailAddress,
                          autofillHints: const [AutofillHints.email],
                          validator: _emailValidator,
                        ),
                        const SizedBox(height: 12),
                        _AuthField(
                          controller: _passwordController,
                          label: isSignUp ? 'Create password' : 'Password',
                          obscureText: _obscurePassword,
                          autofillHints: [
                            isSignUp
                                ? AutofillHints.newPassword
                                : AutofillHints.password,
                          ],
                          validator: _passwordValidator,
                          suffixIcon: IconButton(
                            tooltip: _obscurePassword
                                ? 'Show password'
                                : 'Hide password',
                            onPressed: () => setState(
                              () => _obscurePassword = !_obscurePassword,
                            ),
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                          ),
                        ),
                        if (!isSignUp) ...[
                          Align(
                            alignment: Alignment.centerLeft,
                            child: TextButton(
                              onPressed: () => ScaffoldMessenger.of(context)
                                  .showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Password recovery will be available soon.',
                                      ),
                                    ),
                                  ),
                              child: const Text('Forgot password?'),
                            ),
                          ),
                        ],
                        if (isSignUp) ...[
                          const SizedBox(height: 12),
                          _AuthField(
                            controller: _confirmationController,
                            label: 'Confirm password',
                            obscureText: _obscureConfirmation,
                            autofillHints: const [AutofillHints.newPassword],
                            validator: (value) {
                              final required = _required(
                                value,
                                'password confirmation',
                              );
                              if (required != null) return required;
                              return value == _passwordController.text
                                  ? null
                                  : 'Passwords do not match.';
                            },
                            suffixIcon: IconButton(
                              tooltip: _obscureConfirmation
                                  ? 'Show password confirmation'
                                  : 'Hide password confirmation',
                              onPressed: () => setState(
                                () => _obscureConfirmation =
                                    !_obscureConfirmation,
                              ),
                              icon: Icon(
                                _obscureConfirmation
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          _PrivacyNotice(
                            color: scheme.brightness == Brightness.dark
                                ? AppColors.darkSafetySurface
                                : const Color(0xFFE8EDFF),
                          ),
                          const SizedBox(height: 12),
                        ],
                        AppButton(
                          label: isSignUp
                              ? 'Create account and continue'
                              : 'Sign in',
                          onPressed: _submit,
                        ),
                        const SizedBox(height: 12),
                        if (!isSignUp) ...[
                          _SignedInNotice(
                            color: scheme.brightness == Brightness.dark
                                ? AppColors.darkSafetySurface
                                : const Color(0xFFEAF7EE),
                          ),
                          const SizedBox(height: 12),
                        ],
                        AppButton(
                          label: isSignUp
                              ? 'I already have an account'
                              : 'Create a new account',
                          secondary: true,
                          onPressed: () => _changeMode(
                            isSignUp ? _AuthMode.signIn : _AuthMode.signUp,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AuthField extends StatelessWidget {
  const _AuthField({
    required this.controller,
    required this.label,
    required this.validator,
    this.hint,
    this.keyboardType,
    this.textCapitalization = TextCapitalization.none,
    this.autofillHints,
    this.obscureText = false,
    this.suffixIcon,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final TextInputType? keyboardType;
  final TextCapitalization textCapitalization;
  final Iterable<String>? autofillHints;
  final bool obscureText;
  final Widget? suffixIcon;
  final FormFieldValidator<String> validator;

  @override
  Widget build(BuildContext context) => TextFormField(
    controller: controller,
    keyboardType: keyboardType,
    textCapitalization: textCapitalization,
    autofillHints: autofillHints,
    obscureText: obscureText,
    validator: validator,
    decoration: InputDecoration(
      labelText: label,
      hintText: hint,
      suffixIcon: suffixIcon,
      border: const OutlineInputBorder(),
    ),
  );
}

class _SignedInNotice extends StatelessWidget {
  const _SignedInNotice({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    label: 'After sign in, your saved text size, motion, alert, privacy, and sharing settings load automatically.',
    child: DecoratedBox(
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: AppColors.success),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'After sign in',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 4),
            Text(
              'Your saved text size, motion, alert, privacy, and sharing settings load automatically. You’ll continue to Today.',
            ),
          ],
        ),
      ),
    ),
  );
}

class _PrivacyNotice extends StatelessWidget {
  const _PrivacyNotice({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    label: 'Privacy. Your accessibility preferences and health information are private. Sharing is controlled separately.',
    child: DecoratedBox(
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: AppColors.accent),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Privacy', style: TextStyle(fontWeight: FontWeight.w600)),
            SizedBox(height: 4),
            Text(
              'Your accessibility preferences and health information are private. Sharing is controlled separately.',
            ),
          ],
        ),
      ),
    ),
  );
}
