import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import BottomBar from '@/components/BottomBar';
import firestore from '@react-native-firebase/firestore';

// const sampleData = [
//   { id: '1', event: 'Login', time: '10:00 AM' },
//   { id: '2', event: 'Logout', time: '10:30 AM' },
//   { id: '3', event: 'Data Sync', time: '11:00 AM' },
//   { id: '4', event: 'Error', time: '11:15 AM' },
// ];
// const sensorsDb = firestore().collection('signals');

const EventLogsScreen: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const querySnapshot = await firestore().collection('signals').get();
        const logData: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          logData.push({
            id: doc.id,
            event: data.eventId,
            device: data.DeviceId,
            address: data.Address,
            signalStrength: data.signalStrength,
            time: data.time?.toDate().toLocaleString(),
          });
        });
        setLogs(logData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Event Logs</Text>
    {loading ? (
      <ActivityIndicator size="large" />
    ) : (
      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Event ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Device ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Address</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Signal Strength</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Time</Text>
          </View>
          {/* Table Rows */}
          {logs.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.id.slice(0, 6)}</Text>
              <Text style={styles.tableCell}>{item.event}</Text>
              <Text style={styles.tableCell}>{item.device}</Text>
              <Text style={styles.tableCell}>{item.address}</Text>
              <Text style={styles.tableCell}>{item.signalStrength}</Text>
              <Text style={styles.tableCell}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
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
    color: 'white',
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
    maxHeight: '40%', // Adjust as needed if content is tall
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default EventLogsScreen;