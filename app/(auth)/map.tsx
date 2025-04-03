// import React, { useMemo, useRef } from 'react';
// import { Alert, StyleSheet, View, Text, Image, Pressable } from 'react-native';
// import MapView, { Callout, Marker, Circle } from 'react-native-maps';
// import { useNavigation } from '@react-navigation/native';
// import BottomBar from '@/components/BottomBar';
// import BottomSheet from '@gorhom/bottom-sheet';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
//   const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
//   const bottomSheetRef = useRef<BottomSheet>(null);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
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
//       {/* <View style={styles.bottomBarContainer}>
//         <BottomBar />
//       </View> */}
//       <View style={styles.container}>
//         <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
//           <View style={styles.contentContainer}>
//             <Text>This is awesome</Text>
//           </View>
//         </BottomSheet>
//       </View>
//     </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   bottomBarContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     maxHeight: '40%', // Adjust as needed if content is tall
//     padding: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   },
//   container: {
//     // flex: 1,
//     padding: 24, 
//     backgroundColor: 'grey',
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//   }
// });


import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';

export default function AppMain() {
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Open Bottom Sheet" onPress={() => bottomSheetRef.current?.expand()} />
        <BottomSheet 
          ref={bottomSheetRef} 
          index={0} 
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: 'white' }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.sheetText}>Bottom Sheet is Working!</Text>
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
});
