import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';
import BottomBar from '@/components/BottomBar';
import type { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const DEVICE_BLU_STICK_ID = 200;

export default function App() {
  const [liveMarkers, setLiveMarkers] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [highlightedMarkers, setHighlightedMarkers] = useState<any[]>([]);
  const [blackPins, setBlackPins] = useState<any[]>([]);
  const [suspectPins, setSuspectPins] = useState<any[]>([]);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [selectedSuspectInfo, setSelectedSuspectInfo] = useState<null | {
    id: string;
    latitude: number;
    longitude: number;
    macAddress: string;
    manufacturer: string;
  }> (null);
  
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
      const q = firestore()
        .collection('bluStickDevices');
      const snapshot = await q.get();
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
            // console.log("hi");
            // 🔒 Only this app handles event reset & database querying
            if (data.bluStickId === DEVICE_BLU_STICK_ID) {
              const docRef = firestore()
                .collection('bluStickDevices')
                .doc(docSnap.id)
              setTimeout(async () => {
                await docRef.set( { eventTrigger: false }, { merge: true });
              }, 4500); // Wait 4.5 seconds
              
          
              // const lastUpdated = data.lastUpdated.toDate();
          
              // const collectDocsFrom = async (
              //   source: 'ble' | 'wifi',
              //   bluStickId: number,
              //   lastUpdated: Timestamp
              // ) => {
              //   const lastUpdatedDate = lastUpdated.toDate();
              //   const fiveMinsAgo = new Date(lastUpdatedDate.getTime() - 3 * 60 * 1000);
          
              //   const sourceQuery = query(
              //     collection(db, source),
              //     where('bluStickId', '==', bluStickId),
              //     where('timestamp', '>=', Timestamp.fromDate(fiveMinsAgo)),
              //     where('timestamp', '<=', Timestamp.fromDate(lastUpdatedDate))
              //   );
          
              //   const sourceSnap = await getDocs(sourceQuery);
              //   const uniqueDocsMap = new Map<string, any>();
          
              //   sourceSnap.forEach(doc => {
              //     const data = doc.data();
              //     const mac = data.macAddress;
              //     if (!uniqueDocsMap.has(mac)) {
              //       uniqueDocsMap.set(mac, {
              //         ...data,
              //         wasDetected: false,
              //       });
              //     }
              //   });
          
              //   return Array.from(uniqueDocsMap.values());
              // };
          
              // const bleDocs = await collectDocsFrom('ble', data.bluStickId, data.lastUpdated);
              // const wifiDocs = await collectDocsFrom('wifi', data.bluStickId, data.lastUpdated);
          
              // if (bleDocs.length > 0) {
              //   const batch = writeBatch(db);
              //   bleDocs.forEach(docData => {
              //     const newRef = doc(collection(db, 'beat'));
              //     batch.set(newRef, docData);
              //   });
              //   await batch.commit();
              // }
          
              // if (wifiDocs.length > 0) {
              //   const batch = writeBatch(db);
              //   wifiDocs.forEach(docData => {
              //     const newRef = doc(collection(db, 'weat'));
              //     batch.set(newRef, docData);
              //   });
              //   await batch.commit();
              // } //comment to here
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
        const snap = await firestore().collection(collectionName).get();

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
                  macAddress: data.macAddress ?? 'Unknown', // add this
                  manufacturer: data.manufacturer ?? 'Unknown', // add this
                  expiresAt: Date.now() + 90_000 // show for 90 seconds
                }
              ]);
              

              // Reset isDetected after 5 seconds
              const ref = firestore()
                .collection(collectionName)
                .doc(docSnap.id);
              setTimeout(async () => {
                await ref.update({ isDetected: false });
              }, 4000);
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

      const snapshot = await firestore().collection('bluStickDevices').get();

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.bluStickId === DEVICE_BLU_STICK_ID) {
          const docRef = firestore()
            .collection('bluStickDevices')
            .doc(docSnap.id);
          try {
            await docRef.update({
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
              onPress={() => setSelectedSuspectInfo(pin)}
            >
              <Image
                source={require('@/assets/images/suspectLogo.png')}
                style={{ width: 35, height: 35 }}
              />
            </Marker>
          ))}

          {selectedSuspectInfo && (
            <View style={{
              position: 'absolute',
              bottom: 40,
              left: 20,
              right: 20,
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5
            }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Suspect Info</Text>
              <Text>MAC Address: {selectedSuspectInfo.macAddress}</Text>
              <Text>Manufacturer: {selectedSuspectInfo.manufacturer}</Text>
              <TouchableOpacity onPress={() => setSelectedSuspectInfo(null)} style={{ marginTop: 10 }}>
                <Text style={{ color: 'blue' }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}


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
    maxHeight: '40%', // Adjust as needed if content is tall
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  centerButton: {
    position: 'absolute',
    bottom: 750,
    right: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    zIndex: 100,
  },
});