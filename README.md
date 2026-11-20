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

Set `API_BASE_URL` in `.env` to the development API base URL:

```sh
API_BASE_URL=https://railgrid.vensar.in/api/v1
AUTH_LOGIN_CHANNEL=web
```

The app appends `/v1` when the URL does not include it. Restart Metro after changing `.env`.

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

- A photo-led welcome screen appears on the first launch. Its completion is stored in AsyncStorage, so later launches and sign-outs open sign-in directly.
- Sign-in, email verification, and password recovery share a responsive photo fade layout. The welcome and auth photos and RailGrid logo are in `assets/images/`.
- Sign in uses mobile number and password, followed by an email OTP. The account needs a registered email. The current dev API requires `AUTH_LOGIN_CHANNEL=web`, which also requires the account's web login permission. After the backend change is deployed, set `AUTH_LOGIN_CHANNEL=mobile-otp` for field users. Access and refresh tokens are stored in Keychain; refresh rotation and sign out are handled by the API client.
- Dashboard and Projects read the authenticated `/dashboard/summary` endpoint. Dashboard shows portfolio track progress in a photo cover with a translucent summary panel. Civil, S&T, and Electrical metrics appear in a swipeable module carousel that advances every five seconds and has a play/pause control. It also shows module averages, recent activity, and each project. Tap a project's info icon on either page for detailed progress and quantities in a bottom sheet. Bottom navigation contains Dashboard, Projects, and Profile; work forms will be added in later pages.
- Theme preference supports system, light, and dark modes and persists in AsyncStorage.
- API and Query clients are centralized in `src/services/api.ts` and `App.tsx`; dashboard fetching is in `src/services/dashboardApi.ts` and `src/hooks/useDashboardQuery.ts`.
- Local Inter font files and the SIL Open Font License are in `assets/fonts/`.
- Replace the placeholder API URL and Android release signing configuration before distributing the app.

## Native identifiers

- Android: `com.railgrid`
- iOS: `com.railgrid`

These identifiers are placeholders and can be changed in the native project settings when the organization’s production identifiers are known.

The React Native 0.88 CLI template requested Android API 37, but that platform package was not available from the configured SDK repository during setup. The project is set to the installed API 36 platform and Build Tools 36.0.0; update `android/build.gradle` when API 37 is available in your SDK manager.
