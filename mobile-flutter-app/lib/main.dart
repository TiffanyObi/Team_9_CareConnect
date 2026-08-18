import 'package:flutter/material.dart';

void main() => runApp(const CareConnectApp());

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CareConnect Flutter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B9F9A)),
        useMaterial3: true,
      ),
      home: const StarterScreen(),
    );
  }
}

class StarterScreen extends StatelessWidget {
  const StarterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              color: const Color(0xFFEEF6FF),
              padding: const EdgeInsets.symmetric(vertical: 34),
              child: const Text.rich(
                TextSpan(
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF082B5F),
                  ),
                  children: [
                    TextSpan(
                      text: 'Care',
                      style: TextStyle(color: Color(0xFF0B9F9A)),
                    ),
                    TextSpan(text: 'Connect'),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    children: [
                      const Text(
                        'FLUTTER MOBILE APPLICATION',
                        style: TextStyle(
                          color: Color(0xFF3E5D7D),
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.4,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Semantics(
                        header: true,
                        child: const Text(
                          'Hello, SWEN 661!',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Color(0xFF082B5F),
                            fontSize: 42,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),
                      const Text(
                        'The Team 9 Flutter starter is running successfully.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Color(0xFF082B5F),
                          fontSize: 21,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 38),
                      Semantics(
                        liveRegion: true,
                        label: 'Visual safety: no animation, autoplay, or flashing effects.',
                        child: Container(
                          padding: const EdgeInsets.all(22),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF2FBFB),
                            border: Border.all(
                              color: const Color(0xFF0B9F9A),
                              width: 3,
                            ),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            children: [
                              Icon(
                                Icons.verified_user_outlined,
                                color: Color(0xFF0B9F9A),
                                size: 46,
                              ),
                              SizedBox(width: 18),
                              Expanded(
                                child: Text(
                                  'Visual safety: no animation, autoplay, or flashing effects.',
                                  style: TextStyle(
                                    color: Color(0xFF082B5F),
                                    fontSize: 17,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(bottom: 22),
              child: Text(
                'Team 9 · Care Recipient UI\nPhotosensitive Epilepsy',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFF516B85)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
