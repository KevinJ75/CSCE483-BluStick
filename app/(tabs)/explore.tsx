import React from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { Alert, StyleSheet, View, Text, Image } from 'react-native';

export const markers = [
  {
    latitude: 30.6210,
    longitude: -96.3255,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: '449',
  },
  {
    latitude: 30.55,
    longitude: -96.35,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: '450',
  },
  {
    latitude: 30.68,
    longitude: -96.33,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: '451',
  },
  {
    latitude: 30.62,
    longitude: -96.25,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: '452',
  }
];

const onMarkerSelected = (marker: any) => {
  Alert.alert(marker.name);
}

const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MapView 
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        mapType={'hybrid'}
      >
        {markers.map((marker, index) => (
          <React.Fragment key={index}>
            <Marker coordinate={marker}>
              <Image
                source={require('@/assets/images/BlueFind.png')}
                style={{ width: 30, height: 30, borderRadius: 5 }}
              />
              <Callout>
                <View style={{ padding: 0 }}>
                  <Text>{marker.name}</Text>
                </View>
              </Callout>
            </Marker>

            <Circle
              center={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              radius={500} // Radius in meters
              strokeColor="rgba(250, 251, 252, 0.7)"
              fillColor="rgba(248, 249, 250, 0.3)"
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>
    </View>
  );
}