# RailGrid

RailGrid is a bare React Native 0.88 application foundation for railway project and infrastructure operations. It uses TypeScript, React Navigation, Zustand, TanStack Query, Axios, React Hook Form, Zod, Reanimated, Gesture Handler, Lucide icons, locally bundled Inter, AsyncStorage, and Keychain. The Android and iOS native projects are checked in and use the New Architecture.

## Requirements

- Node.js 22.11 or newer
- Xcode and CocoaPods for iOS
- Android Studio, Android SDK, and JDK 17 or newer for Android

## Setup

```sh
npm install
cp .env.example .env
cd ios && bundle install && bundle exec pod install && cd ..
```

Edit `API_BASE_URL` in `.env` to point to your API. The default falls back to `https://api.example.com`.

## Run

```sh
npm start
npm run ios
npm run android
```

Release builds can be launched with `npm run ios:release` and `npm run android:release`. Configure your own distribution signing credentials before publishing a release build. Android debug is ready to use with the template debug key.

## Quality checks

```sh
npm run typecheck
npm run lint
npx react-native doctor
```

## App foundation

- The login preview accepts any valid email and password of at least eight characters; it saves a demo session token in Keychain. The demo screens are labeled as sample data.
- Theme preference supports system, light, and dark modes and persists in AsyncStorage.
- API and Query clients are centralized in `src/services/api.ts` and `App.tsx`; feature screens currently use local demo data.
- Local Inter font files and the SIL Open Font License are in `assets/fonts/`.
- Replace the placeholder API URL, demo authentication flow, and Android release signing configuration before connecting a production service or distributing the app.

## Native identifiers

- Android: `com.railgrid`
- iOS: `com.railgrid`

These identifiers are placeholders and can be changed in the native project settings when the organization’s production identifiers are known.

The React Native 0.88 CLI template requested Android API 37, but that platform package was not available from the configured SDK repository during setup. The project is set to the installed API 36 platform and Build Tools 36.0.0; update `android/build.gradle` when API 37 is available in your SDK manager.
