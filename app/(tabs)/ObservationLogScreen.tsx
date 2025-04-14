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
import { auth, db } from '@/FirebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import styles from '@/app/StyleSheets/StyleSheet5';

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
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'observations'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
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
      const docRef = await addDoc(collection(db, 'observations'), {
        observation,
        detail,
        user: user?.email || 'Unknown',
        timestamp: Timestamp.now(),
      });

      setObservations([
        {
          id: docRef.id,
          observation,
          detail,
          user: user?.email || 'Unknown',
          timestamp: Timestamp.now(),
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

export default ObservationLogScreen;
