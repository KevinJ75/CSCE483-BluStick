// import React, { useRef } from 'react';
// import { Animated, PanResponder, StyleSheet, View } from 'react-native';
// import BottomBar from '@/components/BottomBar';

// interface DraggableBottomSheetProps {
//   navigation: any; // Replace with your proper navigation type if available
// }

// const DraggableBottomSheet: React.FC<DraggableBottomSheetProps> = ({ navigation }) => {
//   // Height of the bottom sheet when fully open.
//   const sheetHeight = 200; // adjust as needed

//   // Define the closed (hidden) and open positions.
//   const CLOSED_POSITION = sheetHeight; // off-screen (only a small handle might be visible)
//   const OPEN_POSITION = 0;

//   // Animated value for vertical translation.
//   const translateY = useRef(new Animated.Value(CLOSED_POSITION)).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (evt, gestureState) => {
//         // Only start pan if user is moving vertically enough
//         return Math.abs(gestureState.dy) > 10;
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         // Calculate the new position
//         let newY = gestureState.dy + CLOSED_POSITION;
//         // Limit the dragging between open and closed positions.
//         if (newY < OPEN_POSITION) newY = OPEN_POSITION;
//         if (newY > CLOSED_POSITION) newY = CLOSED_POSITION;
//         translateY.setValue(newY);
//       },
//       onPanResponderRelease: (evt, gestureState) => {
//         // If the user swiped up enough, open the sheet, otherwise close it.
//         if (gestureState.dy < -50) {
//           Animated.spring(translateY, {
//             toValue: OPEN_POSITION,
//             useNativeDriver: true,
//           }).start();
//         } else {
//           Animated.spring(translateY, {
//             toValue: CLOSED_POSITION,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   return (
//     <Animated.View
//       style={[styles.bottomSheet, { transform: [{ translateY }] }]}
//       {...panResponder.panHandlers}
//     >
//       {/* Optional: A small handle indicator */}
//       <View style={styles.handle} />
//       <BottomBar navigation={navigation} />
//     </Animated.View>
//   );
// };

// export default DraggableBottomSheet;

// const styles = StyleSheet.create({
//   bottomSheet: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 200, // fixed height of the bottom sheet
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     overflow: 'hidden',
//   },
//   handle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginVertical: 8,
//   },
// });
