import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';


const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MapView style={StyleSheet.absoluteFill} 
      initialRegion={INITIAL_REGION}
      mapType={'hybrid'}
      />

    </View>
  );
}



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });
