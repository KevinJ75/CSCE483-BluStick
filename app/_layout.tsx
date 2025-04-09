import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

import { auth } from "@/FirebaseConfig";
import { User } from "firebase/auth"; // For type safety

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: User | null) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // Hide the splash screen once initialization is complete.
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  // Redirect based on auth state and current route.
  useEffect(() => {
    if (initializing) return;

    // Check if we are in the protected (tabs) group.
    const inAuthGroup = segments[0] === '(tabs)';

    if (user && !inAuthGroup) {
      // If a user is authenticated but we're not in the (tabs) group,
      // navigate to the protected explore screen.
      router.replace('/(tabs)/explore');
    } else if (!user && inAuthGroup) {
      // If no user is present (signed out) and we're inside the (tabs) group,
      // redirect to the login page (index).
      router.replace('/');
    }
  }, [user, initializing, segments, router]);

  if (initializing) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        {/* The login page should be defined in app/index */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Protected routes */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
