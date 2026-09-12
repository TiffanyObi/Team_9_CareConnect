# CareConnect Expo application

This Expo/React Native implementation ports the CareConnect Flutter care-recipient experience. It uses React Navigation for tabs and detail flows, React Context for local session, medication, health-log, and accessibility state, and TypeScript in an organized `src/` structure.

## Run and validate

Use Node 22 LTS or a working npm installation, then run:

```sh
npm install
npm run lint
npm run typecheck
npm run security
npx expo start
```

The demo sign-in accepts any valid email and non-empty password. The initial values are prefilled so the app can be explored immediately.

## Mobile builds

Configure an Expo account and EAS project, then run `npx eas build --platform android` or `npx eas build --platform ios`. The app configuration supplies Android and iOS bundle identifiers.

## Security notes

This prototype intentionally keeps only local, in-memory demo state. It neither stores credentials nor requests device location, contacts, or notification permissions. Before production use, connect authentication only over TLS, store tokens using `expo-secure-store`, validate all backend inputs, and configure platform privacy disclosures.
