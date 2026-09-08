import 'package:careconnect_flutter/app/theme/app_colors.dart';
import 'package:flutter/material.dart';

abstract final class AppTheme {
  static const _radius = 14.0;

  static ThemeData light() => _theme(
    brightness: Brightness.light,
    background: AppColors.lightBackground,
    surface: AppColors.lightSurface,
    foreground: AppColors.lightText,
    secondaryText: AppColors.lightTextSecondary,
    primary: AppColors.primary,
    border: const Color(0xFFD7E0EA),
  );

  static ThemeData dark() => _theme(
    brightness: Brightness.dark,
    background: AppColors.darkBackground,
    surface: AppColors.darkSurface,
    foreground: AppColors.darkText,
    secondaryText: AppColors.darkTextSecondary,
    primary: AppColors.darkAction,
    border: AppColors.darkBorder,
  );

  static ThemeData _theme({
    required Brightness brightness,
    required Color background,
    required Color surface,
    required Color foreground,
    required Color secondaryText,
    required Color primary,
    required Color border,
  }) {
    final scheme = ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: Colors.white,
      secondary: AppColors.secondary,
      onSecondary: Colors.white,
      error: AppColors.error,
      onError: Colors.white,
      surface: surface,
      onSurface: foreground,
    );
    final textTheme = TextTheme(
      displayLarge: TextStyle(
        fontSize: 32,
        height: 1.25,
        fontWeight: FontWeight.w700,
        color: foreground,
      ),
      displayMedium: TextStyle(
        fontSize: 28,
        height: 1.29,
        fontWeight: FontWeight.w700,
        color: foreground,
      ),
      headlineLarge: TextStyle(
        fontSize: 24,
        height: 1.33,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      headlineMedium: TextStyle(
        fontSize: 20,
        height: 1.4,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      titleLarge: TextStyle(
        fontSize: 18,
        height: 1.5,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      titleMedium: TextStyle(
        fontSize: 16,
        height: 1.5,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      bodyLarge: TextStyle(fontSize: 16, height: 1.5, color: foreground),
      bodyMedium: TextStyle(fontSize: 14, height: 1.5, color: secondaryText),
      labelLarge: TextStyle(
        fontSize: 16,
        height: 1.25,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
    );
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: background,
      textTheme: textTheme,
      focusColor: AppColors.focus,
      splashFactory: NoSplash.splashFactory,
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: border),
          borderRadius: BorderRadius.circular(_radius),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(48, 52),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(48, 52),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          side: BorderSide(
            color: brightness == Brightness.dark
                ? AppColors.darkBorder
                : AppColors.accent,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: textTheme.labelLarge,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: 64,
        backgroundColor: brightness == Brightness.dark
            ? AppColors.darkNavigation
            : surface,
        indicatorColor: brightness == Brightness.dark
            ? AppColors.darkAction
            : const Color(0xFFE3F3F2),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return IconThemeData(
              color: brightness == Brightness.dark
                  ? Colors.white
                  : AppColors.primary,
              size: 28,
            );
          }
          return IconThemeData(color: secondaryText, size: 25);
        }),
        labelTextStyle: WidgetStatePropertyAll(
          textTheme.bodyMedium?.copyWith(color: foreground),
        ),
      ),
    );
  }
}
