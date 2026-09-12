# CareConnect Expo application

This Expo/React Native implementation ports the CareConnect Flutter care-recipient experience. It uses React Navigation for tabs and detail flows, React Context for application state, SQLite repositories for accounts and user-scoped health/medication logs, user-scoped AsyncStorage keys for accessibility preferences, and TypeScript in an organized `src/` structure.

The local demonstration account is `omartinez@careconnect.com` with password `password`. This account is seeded at database initialization. New accounts are stored locally with normalized email addresses, random salts, and PBKDF2-derived password hashes; plaintext passwords are not stored.

## Run and validate

Use Node 22 LTS or a working npm installation, then run:

```sh
npm install
npm run lint
npm run typecheck
npm run security
npx expo start
```

The sign-in form validates credentials against the local account database. The Olivia demonstration credentials are prefilled so the app can be explored immediately. Creating an account saves it locally and opens the required first-time accessibility setup; signing in to an existing account opens Today with the device's saved accessibility preferences.

## Mobile builds

Configure an Expo account and EAS project, then run `npx eas build --platform android` or `npx eas build --platform ios`. The app configuration supplies Android and iOS bundle identifiers.

## Security notes

This prototype uses on-device persistence rather than a remote clinical backend. Passwords are salted and hashed locally, and no device location, contacts, or notification permissions are requested. The current npm audit reports moderate transitive advisories in React Navigation and Expo tooling; npm offers no non-breaking complete fix for the current Expo version. Before production use, move authentication and protected health information to an approved server over TLS, store session tokens with `expo-secure-store`, validate all backend inputs, and configure platform privacy disclosures.
