import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import BottomBar from '@/components/BottomBar';
import { collection, getDocs, getFirestore, query, where, orderBy, limit, startAfter, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const PAGE_SIZE = 20;

const EventLogsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchEventIds = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'eventIdTest'), orderBy('eventId', 'asc'));
        const snapshot = await getDocs(q);
    
        const idsSet = new Set<string>();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.eventId) idsSet.add(data.eventId);
        });
    
        setEventIds(Array.from(idsSet));
      } catch (error) {
        console.error('Error fetching event IDs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchEventIds();
  }, []);

  const fetchLogsByEventId = async (eventId: string, reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    setLoading(true);
  
    try {
      let q = query(
        collection(db, 'signals'),
        where('eventId', '==', eventId),
        orderBy('time', 'desc'),
        limit(PAGE_SIZE)
      );
  
      if (lastDoc && !reset) {
        q = query(
          collection(db, 'signals'),
          where('eventId', '==', eventId),
          orderBy('time', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }
  
      const querySnapshot = await getDocs(q);
      const newLogs: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newLogs.push({
          id: doc.id,
          device: data.DeviceId,
          address: data.Address,
          signalStrength: data.signalStrength,
          time: data.time?.toDate().toLocaleString(),
        });
      });
  
      setLogs(reset ? newLogs : [...logs, ...newLogs]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const onSelectEventId = (eventId: string) => {
    setSelectedEventId(eventId);
    setLastDoc(null);
    setHasMore(true);
    setLogs([]);
    fetchLogsByEventId(eventId, true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Logs</Text>

      {!selectedEventId ? (
        <FlatList
          data={eventIds}
          keyExtractor={(id) => id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectEventId(item)} style={styles.eventButton}>
              <Text style={styles.eventButtonText}>Event {item}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noData}>No Event IDs found</Text>}
        />
      ) : (
        <View style={styles.logContainer}>
          <Text style={styles.subTitle}>Logs for event {selectedEventId}</Text>

          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.logCard}>
                <Text style={styles.logText}>Device ID: {item.device}</Text>
                <Text style={styles.logText}>Address: {item.address}</Text>
                <Text style={styles.logText}>Signal Strength: {item.signalStrength}</Text>
                <Text style={styles.logText}>Time: {item.time}</Text>
              </View>
            )}
            onEndReached={() => fetchLogsByEventId(selectedEventId)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="small" />
              ) : !hasMore ? (
                <Text style={styles.endText}>No more logs</Text>
              ) : null
            }
          />

          <TouchableOpacity onPress={() => setSelectedEventId(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Event List</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: 'white', marginTop: 16 },
  subTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10, color: 'white' },
  eventButton: {
    backgroundColor: '#007bff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  eventButtonText: { color: 'white', fontSize: 16 },
  noData: { textAlign: 'center', marginTop: 20 },
  logContainer: { flex: 1 },
  logCard: {
    backgroundColor: '#333',
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
  },
  logText: { color: 'white' },
  endText: { textAlign: 'center', marginVertical: 12, color: '#888' },
  backButton: { marginTop: 12, alignItems: 'center' },
  backButtonText: { color: '#007bff', fontSize: 16 },
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