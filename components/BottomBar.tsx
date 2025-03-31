//import styles from '@/app/StyleSheets/StyleSheet2';
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

interface CardButtonProps {
    label: string;
    onPress: () => void;
    imageSrc: ImageSourcePropType;
  }
  

  const CardButton: React.FC<CardButtonProps> = ({ label, onPress, imageSrc }) => {
    return(
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source = {imageSrc} style={styles.icon}/>
            <Text style={styles.cardLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const ButtonBar = () => {
    return(
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.title}></Text> */}
            <View style={styles.gridContainer}>
                <CardButton 
                label="Detection Logs" 
                onPress={() => console.log('Detection Logs pressed')} 
                imageSrc={require('../assets/images/detectionLogo.png')} // Replace with your image path
                /> 
                <CardButton 
                label="Event Logs" 
                onPress={() => console.log('Event Logs pressed')} 
                imageSrc={require('../assets/images/eventLogo.png')} // Replace with your image path
                />   
                <CardButton 
                label="Observation Log" 
                onPress={() => console.log('Observation Log pressed')} 
                imageSrc={require('../assets/images/observationLogo.png')} // Replace with your image path
                />     
                <CardButton 
                label="Questionare" 
                onPress={() => console.log('Questionare pressed')} 
                imageSrc={require('../assets/images/questionareLogo.png')} // Replace with your image path
                />                           
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Log Out pressed')}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            
        </SafeAreaView>
    );
}

export default ButtonBar;


const styles = StyleSheet.create({
    card: {
      width: '44%',
      aspectRatio: 1,         // Keeps the card roughly square
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
      width: 36,    // Adjust to your image dimensions
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
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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


