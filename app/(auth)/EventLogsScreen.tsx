import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import BottomBar from '@/components/BottomBar';
import styles from '@/app/Stylesheets/StyleSheet4';

const PAGE_SIZE = 20;

const EventLogsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [lastBeatDoc, setLastBeatDoc] = useState<any | null>(null);
  const [lastWeatDoc, setLastWeatDoc] = useState<any | null>(null);
  const [hasMoreBeat, setHasMoreBeat] = useState(true);
  const [hasMoreWeat, setHasMoreWeat] = useState(true);

  useEffect(() => {
    const fetchEventIds = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore()
          .collection('events')
          .orderBy('startTimestamp', 'desc')
          .get();

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
    if (loading || (!reset && !hasMoreBeat && !hasMoreWeat)) return;
    setLoading(true);

    try {
      let beatQuery = firestore()
        .collection('beat')
        .where('eventId', '==', eventId)
        .orderBy('detectedTimestamp', 'desc')
        .limit(PAGE_SIZE);

      let weatQuery = firestore()
        .collection('weat')
        .where('eventId', '==', eventId)
        .orderBy('detectedTimestamp', 'desc')
        .limit(PAGE_SIZE);

      if (lastBeatDoc && !reset) {
        beatQuery = beatQuery.startAfter(lastBeatDoc);
      }

      if (lastWeatDoc && !reset) {
        weatQuery = weatQuery.startAfter(lastWeatDoc);
      }

      const [beatSnap, weatSnap] = await Promise.all([beatQuery.get(), weatQuery.get()]);

      const beatLogs = beatSnap.docs.map(doc => ({
        id: doc.id,
        type: 'beat',
        device: doc.data().detectedBluStickId,
        address: doc.data().macAddress,
        time: doc.data().detectedTimestamp?.toDate().toLocaleString(),
      }));

      const weatLogs = weatSnap.docs.map(doc => ({
        id: doc.id,
        type: 'weat',
        device: doc.data().detectedBluStickId,
        address: doc.data().macAddress,
        time: doc.data().detectedTimestamp?.toDate().toLocaleString(),
      }));

      const combinedLogs = [...logs, ...beatLogs, ...weatLogs].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setLogs(reset ? [...beatLogs, ...weatLogs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) : combinedLogs);
      setLastBeatDoc(beatSnap.docs[beatSnap.docs.length - 1] || lastBeatDoc);
      setLastWeatDoc(weatSnap.docs[weatSnap.docs.length - 1] || lastWeatDoc);
      setHasMoreBeat(beatSnap.docs.length === PAGE_SIZE);
      setHasMoreWeat(weatSnap.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectEventId = (eventId: string) => {
    setSelectedEventId(eventId);
    setLastBeatDoc(null);
    setLastWeatDoc(null);
    setHasMoreBeat(true);
    setHasMoreWeat(true);
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
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
              <View style={styles.logCard}>
                <Text style={styles.logText}>Source: {item.type}</Text>
                <Text style={styles.logText}>Device ID: {item.device}</Text>
                <Text style={styles.logText}>Address: {item.address}</Text>
                <Text style={styles.logText}>Time: {item.time}</Text>
              </View>
            )}
            onEndReached={() => fetchLogsByEventId(selectedEventId!)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="small" />
              ) : (!hasMoreBeat && !hasMoreWeat) ? (
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

export default EventLogsScreen;