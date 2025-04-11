// import React from 'react';
// import { Alert, StyleSheet, View, Text, Image, Pressable } from 'react-native';
// import MapView, { Callout, Marker, Circle } from 'react-native-maps';
// import { useNavigation } from '@react-navigation/native';
// import BottomBar from '@/components/BottomBar';

// export const markers = [
//   {
//     latitude: 30.6210,
//     longitude: -96.3255,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//     name: '449',
//   },
//   {
//     latitude: 30.55,
//     longitude: -96.35,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//     name: '450',
//   },
//   {
//     latitude: 30.68,
//     longitude: -96.33,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//     name: '451',
//   },
//   {
//     latitude: 30.62,
//     longitude: -96.25,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//     name: '452',
//   }
// ];

// const onMarkerSelected = (marker: any) => {
//   Alert.alert(marker.name);
// };

// const INITIAL_REGION = {
//   latitude: 30.6210,
//   longitude: -96.3255,
//   latitudeDelta: 2,
//   longitudeDelta: 2,
// };

// export default function AppMain() {
//   const navigation = useNavigation(); // Get the navigation object


//   return (
//     <View style={{ flex: 1 }}>
//       <MapView 
//         style={StyleSheet.absoluteFill}
//         initialRegion={INITIAL_REGION}
//         mapType={'hybrid'}
//       >
//         {markers.map((marker, index) => (
//           <React.Fragment key={index}>
//             <Marker coordinate={marker} onPress={() => onMarkerSelected(marker)}>
//               <Image
//                 source={require('../../assets/images/BlueFind.png')}
//                 style={{ width: 30, height: 30, borderRadius: 5 }}
//               />
//               <Callout>
//                 <View style={{ padding: 0 }}>
//                   <Text>{marker.name}</Text>
//                 </View>
//               </Callout>
//             </Marker>
//             <Circle
//               center={{
//                 latitude: marker.latitude,
//                 longitude: marker.longitude,
//               }}
//               radius={500} // Radius in meters
//               strokeColor="rgba(250, 251, 252, 0.7)"
//               fillColor="rgba(248, 249, 250, 0.3)"
//               strokeWidth={2}
//             />
//           </React.Fragment>
//         ))}
//       </MapView>
//       <View style={styles.bottomBarContainer}>
//         <BottomBar />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bottomBarContainer: {
//     position: 'absolute',
//     bottom: -32,
//     left: 0,
//     right: 0,
//     maxHeight: '40%', // Adjust as needed if content is tall
//     padding: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   },
//   container: {
//     flex: 1,
//     padding: 24, 
//     backgroundColor: 'grey',
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//   }
// });



import React, { useState, useEffect } from 'react';
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';
import { collection, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import * as Location from 'expo-location';
import firestore from '@react-native-firebase/firestore';

const INITIAL_REGION = {
  latitude: 30.6210,
  longitude: -96.3255,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

const DEVICE_BLU_STICK_ID = 100;

export default function App() {
  const [liveMarkers, setLiveMarkers] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchMarkers = async () => {
      const q = firestore()
        .collection('bluStickDevices');
      const snapshot = await q.get();
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
      const q = firestore()
        .collection('bluStickDevices')
      const snapshot = await q.get();
      // console.log('Updating own location:', latitude, longitude);
      snapshot.forEach(async (docSnap) => {
        const snapshot = await q.get();
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (data.bluStickId === DEVICE_BLU_STICK_ID) {
            const docRef = firestore().collection('bluStickDevices').doc(docSnap.id)
            // doc(db, 'bluStickDevices', docSnap.id);
            try {
              await docRef.set({ lat: latitude, long: longitude}, { merge: false });
              
              // updateDoc(docRef, {
              //   lat: latitude,
              //   long: longitude,
              // });
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