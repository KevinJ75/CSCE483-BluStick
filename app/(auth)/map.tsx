// import React from 'react';
// import MapView, { Callout, Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
// import { Alert, StyleSheet, View, Text, Image } from 'react-native';

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
// }

// const INITIAL_REGION = {
//   latitude: 30.6210,
//   longitude: -96.3255,
//   latitudeDelta: 2,
//   longitudeDelta: 2,
// };

// export default function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <MapView 
//         style={StyleSheet.absoluteFill}
//         initialRegion={INITIAL_REGION}
//         mapType={'hybrid'}
//         provider={PROVIDER_DEFAULT}
//       >
//         {markers.map((marker, index) => (
//           <React.Fragment key={index}>
//             <Marker coordinate={marker}>
//               <Image
//                 source={require('@/assets/images/BlueFind.png')}
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
//     </View>
//   );
// }
// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <MapView style={StyleSheet.absoluteFill} />
//     </View>
//   );
// }
// import { AppleMaps, GoogleMaps } from 'expo-maps';
// import { Platform } from 'react-native';

// export default function App() {
//   if (Platform.OS === 'ios') {
//     return <AppleMaps.View style={{ flex: 1 }} />;
//   } else if (Platform.OS === 'android') {
//     return <GoogleMaps.View style={{ flex: 1 }} />;
//   } else {
//     return <Text>Maps are only available on Android and iOS</Text>;
//   }
// }

import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MyMap = () => {
  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} title="San Francisco" />
      </MapView> */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} title="San Francisco" />
      </MapView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MyMap;
