import React, { useState, useEffect } from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';
import { collection, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import * as Location from 'expo-location';

const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

const DEVICE_BLU_STICK_ID = 100;

export default function App() {
  const [liveMarkers, setLiveMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchMarkers = async () => {
      const q = query(collection(db, 'bluStickDevices'));
      const snapshot = await getDocs(q);
      const newMarkers: any[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.lat && data.long) {
          // console.log('Marker data:', data);
          newMarkers.push({
            latitude: data.lat,
            longitude: data.long,
            name: `${data.bluStickId}`,
            id: docSnap.id,
            bluStickId: data.bluStickId,
          });
        }
      });

      setLiveMarkers(newMarkers);
    };

    const updateOwnLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      // console.log('Current location:', location);
      const { latitude, longitude } = location.coords;

      // Update Firestore doc with this device's ID
      const q = query(collection(db, 'bluStickDevices'));
      const snapshot = await getDocs(q);
      // console.log('Updating own location:', latitude, longitude);
      snapshot.forEach(async (docSnap) => {
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (data.bluStickId === DEVICE_BLU_STICK_ID) {
            const docRef = doc(db, 'bluStickDevices', docSnap.id);
            try {
              await updateDoc(docRef, {
                lat: latitude,
                long: longitude,
              });
              console.log(`✅ Updated device ${DEVICE_BLU_STICK_ID} with lat: ${latitude}, long: ${longitude}`);
            } catch (error) {
              console.error(`❌ Failed to update device ${DEVICE_BLU_STICK_ID}:`, error);
            }
          }
        }
      });
    };

    fetchMarkers();
    updateOwnLocation();

    interval = setInterval(() => {
      fetchMarkers();
      updateOwnLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        mapType="hybrid"
      >
        {liveMarkers.map((marker, index) => (
          <React.Fragment key={index}>
            <Marker
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={() => setSelectedMarker(index)}
            >
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
              center={{ latitude: marker.latitude, longitude: marker.longitude }}
              radius={500}
              strokeColor={selectedMarker === index ? "red" : "rgba(250, 251, 252, 0.7)"}
              fillColor={selectedMarker === index ? "rgba(255, 0, 0, 0.3)" : "rgba(248, 249, 250, 0.3)"}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>
    </View>
  );
}
