import { configure } from '@testing-library/react-native';

// Native navigation and state updates may take longer on simulator hosts.
configure({ asyncUtilTimeout: 5000 });
// Jest factories load the native mock after module initialization.
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('expo-haptics', () => ({ notificationAsync: jest.fn(() => Promise.resolve()), NotificationFeedbackType: { Success: 'success' } }));
jest.mock('expo-crypto', () => ({ getRandomBytesAsync: jest.fn(async (length: number) => new Uint8Array(length).fill(7)) }));
jest.mock('expo-sqlite', () => ({ openDatabaseAsync: jest.fn() }));
