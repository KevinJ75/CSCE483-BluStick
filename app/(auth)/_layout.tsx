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
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarBackground: TabBarBackground,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',
    //       },
    //       default: {},
    //     }),
    //   }}>
    //   <Tabs.Screen
    //     name="home"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="map"
    //     options={{
    //       title: 'Map',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="map" color={color} />,
    //     }}
    //   />
    // </Tabs>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="map" options={{ headerShown: false }} />
            <Stack.Screen name="DetectionLogScreen" options={{ headerShown: false }} />
            <Stack.Screen name="EventLogsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ObservationLogScreen" options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnaireScreen" options={{ headerShown: false }} />
            {/* <Stack.Screen name="login" options={{ headerShown: false }}/> */}
          </Stack>
        </GestureHandlerRootView>
  );
}
