import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTheme } from './src/hooks/useTheme';
import { navigationThemes } from './src/theme';
import { AppLoader } from './src/components/AppLoader';
import { useThemeStore } from './src/store/themeStore';
import { useAuthStore } from './src/store/authStore';
import { useOnboardingStore } from './src/store/onboardingStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

export default function App() {
  const theme = useTheme();
  const hydrated = useThemeStore((state) => state.hydrated);
  const hydrate = useThemeStore((state) => state.hydrate);
  const authHydrated = useAuthStore((state) => state.hydrated);
  const hydrateAuth = useAuthStore((state) => state.restore);
  const onboardingHydrated = useOnboardingStore((state) => state.hydrated);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrate);
  useEffect(() => {
    Promise.all([hydrate(), hydrateAuth(), hydrateOnboarding()]).catch(() => undefined);
  }, [hydrate, hydrateAuth, hydrateOnboarding]);
  if (!hydrated || !authHydrated || !onboardingHydrated)
    return (
      <SafeAreaProvider>
        <AppLoader label="Loading RailGrid" />
      </SafeAreaProvider>
    );
  const navTheme = theme.mode === 'dark' ? navigationThemes.dark : navigationThemes.light;
  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer theme={navTheme}>
            <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
