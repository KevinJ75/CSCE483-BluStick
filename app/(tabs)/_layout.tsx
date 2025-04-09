// import { Stack } from "expo-router";
// const Layout = () => {
//     return <Stack />;
// };
// export default Layout

import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="DetectionLogsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="EventLogsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ObservationLogScreen" options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnaireScreen" options={{ headerShown: false }} />
            {/* <Stack.Screen name="login" options={{ headerShown: false }}/> */}
          </Stack>
        </GestureHandlerRootView>
  );
}