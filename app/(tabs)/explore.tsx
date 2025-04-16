import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, updateDoc, doc, getDoc, setDoc, where } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import * as Location from 'expo-location';
import BottomBar from '@/components/BottomBar';
import type { Region } from 'react-native-maps';
import { writeBatch, Timestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const DEVICE_BLU_STICK_ID = 300;

export default function App() {
  const [liveMarkers, setLiveMarkers] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [highlightedMarkers, setHighlightedMarkers] = useState<any[]>([]);
  const [blackPins, setBlackPins] = useState<any[]>([]);
  const [suspectPins, setSuspectPins] = useState<any[]>([]);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView | null>(null);

    // Generate a random coordinate nearby within ~25 meters
  const getRandomNearbyLocation = (lat: number, lon: number): { latitude: number; longitude: number } => {
    const radiusInMeters = 25;
    const radiusInDegrees = radiusInMeters / 111320; // approx conversion

    const randomLat = lat + (Math.random() - 0.5) * radiusInDegrees;
    const randomLon = lon + (Math.random() - 0.5) * radiusInDegrees;

    return {
      latitude: randomLat,
      longitude: randomLon,
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchMarkersAndCheckEvents = async () => {
      const q = query(collection(db, 'bluStickDevices'));
      const snapshot = await getDocs(q);
      const newMarkers: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.lat && data.long) {
          const isTriggered = data.eventTrigger === true;
          // console.log(`Device ${data.bluStickId} eventTrigger: ${isTriggered}`);

          newMarkers.push({
            latitude: data.lat,
            longitude: data.long,
            name: `${data.bluStickId}`,
            id: docSnap.id,
            bluStickId: data.bluStickId,
            eventTrigger: isTriggered,
          });

          if (isTriggered && data.lastUpdated) {
            // ✅ All apps: Visual indicators
            setHighlightedMarkers(prev => [
              ...prev,
              { id: docSnap.id, expiresAt: Date.now() + 60_000 }
            ]);
          
            setBlackPins(prev => [
              ...prev,
              {
                latitude: data.lat,
                longitude: data.long,
                id: `black-${Date.now()}`,
                expiresAt: Date.now() + 120_000
              }
            ]);
          
            // 🔒 Only this app handles event reset & database querying
            if (data.bluStickId === DEVICE_BLU_STICK_ID) {
              const docRef = doc(db, 'bluStickDevices', docSnap.id);

              setTimeout(async () => {
                await updateDoc(docRef, { eventTrigger: false });
              }, 4500); // Wait 4.5 seconds
              
            }
          }  
        }
      }
      // Clear expired visual effects
      const now = Date.now();
      setHighlightedMarkers(prev => prev.filter(m => m.expiresAt > now));
      setBlackPins(prev => prev.filter(p => p.expiresAt > now));

      setLiveMarkers(newMarkers);
      // Query beat and weat for suspect detection
      const handleDetectionQuery = async (collectionName: 'beat' | 'weat') => {
        const snap = await getDocs(collection(db, collectionName));

        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          if (data.isDetected && (data.originalBluStickId !== data.detectedBluStickId)) {
            const detectedId = data.detectedBluStickId;

            const matchingMarker = newMarkers.find(m => m.bluStickId === detectedId);
            if (matchingMarker) {
              const nearby = getRandomNearbyLocation(matchingMarker.latitude, matchingMarker.longitude);
              console.log(detectedId);
              setSuspectPins(prev => [
                ...prev,
                {
                  id: `${collectionName}-${docSnap.id}-${Date.now()}`,
                  latitude: nearby.latitude,
                  longitude: nearby.longitude,
                  expiresAt: Date.now() + 90_000 // show for 90 seconds
                }
              ]);

              // Reset isDetected after 5 seconds
              const ref = doc(db, collectionName, docSnap.id);
              setTimeout(async () => {
                await updateDoc(ref, { isDetected: false });
              }, 4500);
            }
          }
        }
      };

      await Promise.all([handleDetectionQuery('beat'), handleDetectionQuery('weat')]);

      // Clean up expired suspect pins
      // const now = Date.now();
      setSuspectPins(prev => prev.filter(p => p.expiresAt > now));

    };

    const updateOwnLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setInitialRegion(prev => prev ?? {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const q = query(collection(db, 'bluStickDevices'));
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
          } catch (error) {
            console.error(`❌ Failed to update device ${DEVICE_BLU_STICK_ID}:`, error);
          }
        }
      }
    };

    fetchMarkersAndCheckEvents();
    updateOwnLocation();

    interval = setInterval(() => {
      fetchMarkersAndCheckEvents();
      updateOwnLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const centerMapOnUser = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission not granted');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const region: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(region, 1000); // 1000 ms animation
  };

  return (
    <View style={{ flex: 1 }}>
      {initialRegion && (
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        mapType="hybrid"
      >
        {liveMarkers.map((marker, index) => {
          const isHighlighted = highlightedMarkers.some(h => h.id === marker.id);
          return (
            <React.Fragment key={index}>
              <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                // onPress={() => setSelectedMarker(index)}
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
                radius={250}
                strokeColor={isHighlighted || selectedMarker === index ? "red" : "rgba(250, 251, 252, 0.7)"}
                fillColor={isHighlighted || selectedMarker === index ? "rgba(255, 0, 0, 0.3)" : "rgba(248, 249, 250, 0.3)"}
                strokeWidth={2}
              />
            </React.Fragment>
          );
        })}

        {blackPins.map(pin => (
          <Marker
          key={pin.id}
          coordinate={{
            latitude: pin.latitude,
            longitude: pin.longitude
          }}
        >
          <Image
            source={require('@/assets/images/eventIcon.png')}
            style={{ width: 35, height: 35 }}
          />
        </Marker>
        ))}
        
        {suspectPins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          >
            <Image
              source={require('@/assets/images/suspectLogo.png')}
              style={{ width: 35, height: 35 }}
            />
          </Marker>
        ))}

      </MapView>
      )}
      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
        <Ionicons name="locate" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: -32,
    left: 0,
    right: 0,
    maxHeight: '40%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  centerButton: {
    position: 'absolute',
    bottom: 830,
    right: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    zIndex: 100,
  },
});