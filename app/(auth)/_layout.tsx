import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
          <Stack>
            <Stack.Screen name="map" options={{ headerShown: false }} />
            <Stack.Screen name="DetectionLogScreen" options={{ headerShown: false }} />
            <Stack.Screen name="EventLogsScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ObservationLogScreen" options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnaireScreen" options={{ headerShown: false }} />
          </Stack>
  );
}
