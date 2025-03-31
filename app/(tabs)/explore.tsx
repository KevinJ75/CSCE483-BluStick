import React from 'react';
import { Alert, StyleSheet, View, Text, Image, Pressable } from 'react-native';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import BottomBar from '@/components/BottomBar';

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
};

const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function AppMain() {
  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={{ flex: 1 }}>
      {/* MapView */}
      <MapView 
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        mapType={'hybrid'}
      >
        {markers.map((marker, index) => (
          <React.Fragment key={index}>
            <Marker coordinate={marker} onPress={() => onMarkerSelected(marker)}>
              <Image
                source={require('../../assets/images/BlueFind.png')}
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

      {/* Bottom Bar */}
      <View style={styles.bottomBarContainer}>
        <BottomBar /> {/* Pass navigation prop */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '40%', // Adjust as needed if content is tall
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});