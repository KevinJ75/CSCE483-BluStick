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
import { auth } from '@/FirebaseConfig';
import { signOut } from 'firebase/auth';

interface CardButtonProps {
  label: string;
  onPress: () => void;
  imageSrc: ImageSourcePropType;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = 0.42 * SCREEN_HEIGHT;

const CardButton: React.FC<CardButtonProps> = ({ label, onPress, imageSrc }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={imageSrc} style={styles.icon} />
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

const ButtonBar = () => {
  const router = useRouter();

  // 0 => panel fully shown at bottom, 1 => panel fully hidden (slid off screen).
  const [currentSnap, setCurrentSnap] = useState(1);
  // Animated value tracking the current fraction (0 .. 1)
  const panY = useRef(new Animated.Value(currentSnap)).current;
  // We'll store the fraction when the user first touches.
  const baseFraction = useRef(currentSnap);

  // Interpolate fraction to a pixel offset.
  const translateY = panY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PANEL_HEIGHT],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Stop any running animation and record the current fraction.
        panY.stopAnimation((val: number) => {
          baseFraction.current = val;
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        let newFraction = baseFraction.current + gestureState.dy / PANEL_HEIGHT;
        if (newFraction < 0) newFraction = 0;
        if (newFraction > 1) newFraction = 1;
        panY.setValue(newFraction);
      },
      onPanResponderRelease: () => {
        panY.stopAnimation((finalVal: number) => {
          const snapTarget = finalVal > 0.5 ? 1 : 0;
          Animated.spring(panY, {
            toValue: snapTarget,
            useNativeDriver: false,
            friction: 7,
            tension: 30,
          }).start(() => {
            setCurrentSnap(snapTarget);
          });
        });
      },
    })
  ).current;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <Animated.View
        style={[
          styles.panelContainer,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => {
              const target = currentSnap === 1 ? 0 : 1;
              Animated.spring(panY, {
                toValue: target,
                useNativeDriver: false,
                friction: 7,
                tension: 30,
              }).start(() => {
                setCurrentSnap(target);
              });
            }}
          >
            <Text style={styles.fabText}>
              {currentSnap === 0 ? '↓' : '↑'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          <CardButton
            label="Detection Logs"
            onPress={() => router.push('/(tabs)/DetectionLogsScreen')}
            imageSrc={require('../assets/images/detectionLogo.png')}
          />
          <CardButton
            label="Event Logs"
            onPress={() => router.push('/(tabs)/EventLogsScreen')}
            imageSrc={require('../assets/images/eventLogo.png')}
          />
          <CardButton
            label="Observation Log"
            onPress={() => router.push('/(tabs)/ObservationLogScreen')}
            imageSrc={require('../assets/images/observationLogo.png')}
          />
          <CardButton
            label="Questionare"
            onPress={() => router.push('/(tabs)/QuestionnaireScreen')}
            imageSrc={require('../assets/images/questionareLogo.png')}
          />
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Text style={styles.mapText}>Map</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ButtonBar;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  panelContainer: {
    position: 'absolute',
    left: -16,
    right: -16,
    bottom: -5,
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
    bottom: 30,
    left: 16,
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
  mapButton: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mapText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
