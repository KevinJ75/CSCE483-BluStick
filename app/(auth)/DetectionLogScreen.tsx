import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { collection, getDocs } from 'firebase/firestore';
import { findCommonAddresses } from '../services/firestoreServices'; // Updated import
import firestore from '@react-native-firebase/firestore';
import BottomBar from '@/components/BottomBar';

const DetectionLogsScreen: React.FC = () => {
  const [duplicates, setDuplicates] = useState<
    { mac_address: string; occurrences: any[] }[]
  >([]);
  const [eventOptions, setEventOptions] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Load event options on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await firestore()
        .collection('events')
        .get();
      const events = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.eventID, // Use eventID instead of Firestore document ID
          name: `EventID: ${data.eventID || 'Unknown'} Device ID: (${data.sensorID}) Time: ${data.timestamp}`,
        };
      });
      setEventOptions(events);
    };
  
    fetchEvents();
  }, []);

  // Fetch duplicates for selected eventIDs
  useEffect(() => {
    const fetchData = async () => {
      const result = await findCommonAddresses(selectedEvents);
      setDuplicates(result);
    };
  
    if (selectedEvents.length > 0) {
      fetchData();
    } else {
      setDuplicates([]);
    }
  }, [selectedEvents]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duplicate MAC Addresses</Text>

      <MultiSelect
        items={eventOptions}
        uniqueKey="id"
        onSelectedItemsChange={setSelectedEvents}
        selectedItems={selectedEvents}
        selectText="Filter by Event"
        searchInputPlaceholderText="Search Events..."
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#000' }}
        submitButtonColor="#48d22b"
        submitButtonText="Apply"
        styleMainWrapper={styles.multiSelect}
      />

      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>MAC Address</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Sensor ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Signal</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Signal Type</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Timestamp</Text>
          </View>

          {/* Table Rows */}
          {duplicates.length > 0 ? (
            duplicates.map((entry) =>
              entry.occurrences.map((doc, index) => (
                <View key={`${entry.mac_address}-${index}`} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableEntry]}>{entry.mac_address}</Text>
                  <Text style={[styles.tableCell, styles.tableEntry]}>{doc.sensorID}</Text>
                  <Text style={[styles.tableCell, styles.tableEntry]}>{doc.signal}</Text>
                  <Text style={[styles.tableCell, styles.tableEntry]}>{doc.signal_type}</Text>
                  <Text style={[styles.tableCell, styles.tableEntry]}>
                    {doc.timestamp?.toDate ? doc.timestamp.toDate().toLocaleString() : doc.timestamp}
                  </Text>
                </View>
              ))
            )
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>No duplicate MAC addresses found.</Text>
            </View>
          )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  tableContainer: {
    width: '100%',
    marginTop: 16,
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
    color: '#000',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  tableEntry: {
    color: '#fff',
  },
  multiSelect: {
    width: '100%',
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

export default DetectionLogsScreen;