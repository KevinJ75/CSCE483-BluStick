import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  SafeAreaView, 
  ImageSourcePropType
} from 'react-native';
import { useRouter } from 'expo-router';

interface CardButtonProps {
  label: string;
  onPress: () => void;
  imageSrc: ImageSourcePropType;
}

const CardButton: React.FC<CardButtonProps> = ({ label, onPress, imageSrc }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={imageSrc} style={styles.icon} />
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const ButtonBar = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
        onPress={() => router.push('/(tabs)')}
        >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ButtonBar;

const styles = StyleSheet.create({
  card: {
    width: '44%',
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
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 16,
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
