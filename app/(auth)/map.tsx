import React, { useState, useEffect } from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as Location from 'expo-location';
import BottomBar from '@/components/BottomBar';
import { writeBatch, Timestamp } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';

const getStartingRegion = async () => {
  const location = await Location.getCurrentPositionAsync({});
}
const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const DEVICE_BLU_STICK_ID = 200;

export default function App() {
  const [liveMarkers, setLiveMarkers] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [highlightedMarkers, setHighlightedMarkers] = useState<any[]>([]);
  const [blackPins, setBlackPins] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchMarkersAndCheckEvents = async () => {
      const q = firestore()
        .collection('bluStickDevices')
      const snapshot = await q.get();
      const newMarkers: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.lat && data.long) {
          const isTriggered = data.eventTrigger === true;
          newMarkers.push({
            latitude: data.lat,
            longitude: data.long,
            name: `${data.bluStickId}`,
            id: docSnap.id,
            bluStickId: data.bluStickId,
            eventTrigger: isTriggered,
          });

          // 🔥 Check and reset eventTrigger if needed
          if (isTriggered && data.lastUpdated && (data.bluStickId == DEVICE_BLU_STICK_ID)) {
            const docRef = firestore()
              .collection('bluStickDevices')
              .doc(docSnap.id);
            await docRef.set( {eventTrigger: false}, { merge: true} )
            const lastUpdated = data.lastUpdated.toDate();
            console.log('Last updated:', lastUpdated);
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
            
            const collectDocsFrom = async (
              source: 'ble' | 'wifi',
              bluStickId: number,
              lastUpdated: Timestamp
            ) => {
              const lastUpdatedDate = lastUpdated.toDate();
              const fiveMinsAgo = new Date(lastUpdatedDate.getTime() - 3 * 60 * 1000);
              
              const sourceQuery = firestore()
                .collection(source)
                .where('bluStickId', '==', bluStickId)
                .where('timestamp', '>=', Timestamp.fromDate(fiveMinsAgo))
                .where('timestamp', '<=', Timestamp.fromDate(lastUpdatedDate))
              console.log(`Querying ${source} for bluStickId ${bluStickId} between ${fiveMinsAgo} and ${lastUpdated}`);
            
              const sourceSnap = await sourceQuery.get();

              const uniqueDocsMap = new Map<string, any>();
            
              sourceSnap.forEach(doc => {
                const data = doc.data();
                const mac = data.macAddress;
                if (!uniqueDocsMap.has(mac)) {
                  uniqueDocsMap.set(mac, {
                    ...data,
                    wasDetected: false,
                    // parentBluStickId: bluStickId,
                    // triggeredAt: lastUpdated,
                  });
                }
              });
            
              return Array.from(uniqueDocsMap.values());
            };
            
            
            // inside for-loop for each triggered bluStick:
            const bleDocs = await collectDocsFrom('ble', data.bluStickId, data.lastUpdated);
            const wifiDocs = await collectDocsFrom('wifi', data.bluStickId, data.lastUpdated);
            
            
            // Batch write BLE docs to "beat"
            if (bleDocs.length > 0) {
              const batch = firestore().batch();
              bleDocs.forEach(docData => {
                const newRef = firestore().collection('beat').doc(); 
                batch.set(newRef, docData);
              });
              await batch.commit();
            }
            if (wifiDocs.length > 0) {
              const batch = firestore().batch();
            
              wifiDocs.forEach(docData => {
                const newRef = firestore().collection('weat').doc(); // auto-generated ID
                batch.set(newRef, docData);
              });
            
              await batch.commit();
            }
            
          }
        }
      }
        // Clear expired visual effects
      const now = Date.now();
      setHighlightedMarkers(prev => prev.filter(m => m.expiresAt > now));
      setBlackPins(prev => prev.filter(p => p.expiresAt > now));

      setLiveMarkers(newMarkers);
    };

    const updateOwnLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const q = firestore()
        .collection('bluStickDevices')
      const snapshot = await q.get();

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.bluStickId === DEVICE_BLU_STICK_ID) {
          const docRef = firestore().collection('bluStickDevices').doc(docSnap.id);
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
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
                radius={500}
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
      </MapView>

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
});