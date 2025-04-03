import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

interface CardButtonProps {
  label: string;
  onPress: () => void;
  imageSrc: ImageSourcePropType;
}

// 35% of screen height for the panel
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = 0.35 * SCREEN_HEIGHT;

const CardButton: React.FC<CardButtonProps> = ({ label, onPress, imageSrc }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={imageSrc} style={styles.icon} />
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

const ButtonBar = () => {
  const router = useRouter();

  /**
   * 0 => panel fully shown at bottom,
   * 1 => panel fully hidden (slid off screen).
   */
  const [currentSnap, setCurrentSnap] = useState(1);

  // The animated fraction from 0..1
  const panY = useRef(new Animated.Value(currentSnap)).current;

  // We'll store the fraction that the panel is at when the user first touches down
  // so the drag movement adds on top of that fraction.
  const baseFraction = useRef(currentSnap);

  // Interpolate fraction => actual pixel offset
  const translateY = panY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PANEL_HEIGHT],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      // Called when the user first touches
      onPanResponderGrant: () => {
        // Stop any running animation & record the current fraction
        panY.stopAnimation((val: number) => {
          baseFraction.current = val; 
          // e.g. if the panel is half open, val might be 0.5
        });
      },

      // Called as user drags
      onPanResponderMove: (evt, gestureState) => {
        // newFraction = fraction at the start of gesture + how far they've dragged / total height
        let newFraction = baseFraction.current + gestureState.dy / PANEL_HEIGHT;
        // clamp 0..1
        if (newFraction < 0) newFraction = 0;
        if (newFraction > 1) newFraction = 1;
        // Update animated value
        panY.setValue(newFraction);
      },

      // User lets go
      onPanResponderRelease: () => {
        // We read the final fraction from stopAnimation callback
        panY.stopAnimation((finalVal: number) => {
          const snapTarget = finalVal > 0.5 ? 1 : 0;
          Animated.spring(panY, {
            toValue: snapTarget,
            useNativeDriver: false,
            // Tweak friction/tension to slow the animation
            friction: 7,
            tension: 30, 
          }).start(() => {
            setCurrentSnap(snapTarget);
          });
        });
      },
    })
  ).current;

  return (
    <View style={styles.rootContainer}>
      <Animated.View
        style={[
          styles.panelContainer,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.gridContainer}>
          <CardButton
            label="Detection Logs"
            onPress={() => router.push('/(auth)/DetectionLogScreen')}
            imageSrc={require('../assets/images/detectionLogo.png')}
          />
          <CardButton
            label="Event Logs"
            onPress={() => router.push('/(auth)/EventLogsScreen')}
            imageSrc={require('../assets/images/eventLogo.png')}
          />
          <CardButton
            label="Observation Log"
            onPress={() => router.push('/(auth)/ObservationLogScreen')}
            imageSrc={require('../assets/images/observationLogo.png')}
          />
          <CardButton
            label="Questionare"
            onPress={() => router.push('/(auth)/QuestionnaireScreen')}
            imageSrc={require('../assets/images/questionareLogo.png')}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ButtonBar;

const styles = StyleSheet.create({
  // The main screen container
  rootContainer: {
    flex: 1,
    backgroundColor: '#EAEAEA', 
  },

  // The entire bottom panel
  panelContainer: {
    position: 'absolute',
    // anchor at bottom so it can slide up
    left: -16,
    right: -16,
    bottom: -5,
    // The panel’s max height
    height: PANEL_HEIGHT,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    paddingTop: 16,
    paddingHorizontal: 16,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 66,
    height: 33,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    color: '#333',
  },

  logoutButton: {
    position: 'absolute',
    bottom: 1,
    right: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});