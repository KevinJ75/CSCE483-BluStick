import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BottomBar from '@/components/BottomBar';
import { auth, db } from '@/FirebaseConfig'; // adjust path as needed
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

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

      <TextInput
        style={styles.input}
        placeholder="Enter Observation"
        value={observation}
        onChangeText={setObservation}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Detail"
        value={detail}
        onChangeText={setDetail}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableContainer: {
    width: '100%',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: -32,
    left: 0,
    right: 0,
    maxHeight: '40%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default ObservationLogScreen;