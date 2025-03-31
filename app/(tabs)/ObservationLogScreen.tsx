// ObservationLogScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ObservationLogScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Observation Log Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ObservationLogScreen;
