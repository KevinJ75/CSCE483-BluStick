// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import BottomBar from '@/components/BottomBar';

// const sampleData = [
//   { id: '1', observation: 'Observation A', detail: 'Detail A' },
//   { id: '2', observation: 'Observation B', detail: 'Detail B' },
//   { id: '3', observation: 'Observation C', detail: 'Detail C' },
//   { id: '4', observation: 'Observation D', detail: 'Detail D' },
// ];

// const ObservationLogScreen: React.FC = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Observation Log Screen</Text>
//       <ScrollView horizontal style={styles.tableContainer}>
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, styles.tableHeader]}>ID</Text>
//             <Text style={[styles.tableCell, styles.tableHeader]}>Observation</Text>
//             <Text style={[styles.tableCell, styles.tableHeader]}>Detail</Text>
//           </View>
//           {/* Table Rows */}
//           {sampleData.map((item) => (
//             <View key={item.id} style={styles.tableRow}>
//               <Text style={styles.tableCell}>{item.id}</Text>
//               <Text style={styles.tableCell}>{item.observation}</Text>
//               <Text style={styles.tableCell}>{item.detail}</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//       <View style={styles.bottomBarContainer}>
//         <BottomBar />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 16,
//   },
//   tableContainer: {
//     width: '100%',
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     textAlign: 'center',
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     backgroundColor: '#f0f0f0',
//   },
//   bottomBarContainer: {
//     position: 'absolute',
//     bottom: -32,
//     left: 0,
//     right: 0,
//     maxHeight: '40%', // Adjust as needed if content is tall
//     padding: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   },
// });

// export default ObservationLogScreen;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import BottomBar from '@/components/BottomBar';
import firestore from '@react-native-firebase/firestore';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import styles from '@/app/Stylesheets/StyleSheet5'
import auth from '@react-native-firebase/auth';

const screenHeight = Dimensions.get('window').height;

interface Observation {
  id: string;
  observation: string;
  detail: string;
  user: string;
  timestamp: any;
}

const ObservationLogScreen: React.FC = () => {
  const [observation, setObservation] = useState('');
  const [detail, setDetail] = useState('');
  const [observations, setObservations] = useState<Observation[]>([]);
  const user = auth().currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = firestore()
          .collection('observations')
          .orderBy('timestamp', 'desc')
        const querySnapshot = await q.get();
        const data: Observation[] = [];
        querySnapshot.forEach((doc) => {
          const { observation, detail, user, timestamp } = doc.data();
          data.push({
            id: doc.id,
            observation,
            detail,
            user,
            timestamp,
          });
        });
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!observation || !detail) {
      Alert.alert('Please fill in both fields');
      return;
    }

    try {
      const newObservation = {
        observation,
        detail,
        user: user?.email || 'Unknown',
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
    
      const docRef = await firestore().collection('observations').add(newObservation);
    
      setObservations([
        {
          id: docRef.id,
          ...newObservation,
        },
        ...observations,
      ]);
    
      setObservation('');
      setDetail('');
    } catch (error) {
      console.error('Error submitting observation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Observation Log</Text>

      <Text style={styles.label}>Observation:</Text>
      <TextInput
        style={styles.observationInput}
        placeholder="Enter Observation"
        value={observation}
        onChangeText={setObservation}
        multiline
        numberOfLines={10}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Full Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name"
        value={detail}
        onChangeText={setDetail}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>User</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Observation</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Detail</Text>
          </View>

          {/* Rows */}
          {observations.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.user}</Text>
              <Text style={styles.tableCell}>{item.observation}</Text>
              <Text style={styles.tableCell}>{item.detail}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//     color: '#000',
//   },
//   observationInput: {
//     backgroundColor: '#2f2f2f',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     color: '#fff',
//     width: '100%',
//     height: screenHeight / 2,
//     textAlignVertical: 'top',
//   },
//   input: {
//     backgroundColor: '#2f2f2f',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     color: '#fff',
//     width: '100%',
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   tableContainer: {
//     width: '100%',
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     textAlign: 'center',
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     backgroundColor: '#f0f0f0',
//   },
//   bottomBarContainer: {
//     position: 'absolute',
//     bottom: -32,
//     left: 0,
//     right: 0,
//     maxHeight: '40%',
//     padding: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//   },
// });

export default ObservationLogScreen;