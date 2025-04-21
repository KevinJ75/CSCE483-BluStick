import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { collection, getDocs } from 'firebase/firestore';
import { CommonAddress, findCommonAddresses } from '../services/firestoreServices'; // Updated import
import firestore from '@react-native-firebase/firestore';
import BottomBar from '@/components/BottomBar';
// import styles from '@/app/Stylesheets/StyleSheet3'

interface EventOption { id: string; name: string; }

const DetectionLogsScreen: React.FC = () => {
  const [commonAddrs, setCommonAddrs] = useState<CommonAddress[]>([]);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Load events
  useEffect(() => {
    (async () => {
      const snap = await firestore()
        .collection('events')
        .get();
  
      const events = snap.docs
        .map(docSnap => {
          const d = docSnap.data();
          const time = d.startTimestamp?.toDate();
          return {
            id: d.eventId,
            name: `Event ${d.eventId} @ ${time?.toLocaleString() ?? 'Unknown'}`,
            timestamp: time?.getTime() ?? 0 // used for sorting
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp); // sort newest first
  
      setEventOptions(events);
    })();
  }, []);
  
  

  // Fetch common addresses when selection changes
  useEffect(() => {
    if (!selectedEvents.length) {
      setCommonAddrs([]);
      return;
    }
    (async () => {
      setCommonAddrs(await findCommonAddresses(selectedEvents));
    })();
  }, [selectedEvents]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common MAC Addresses</Text>

      <MultiSelect
        items={eventOptions}
        uniqueKey="id"
        onSelectedItemsChange={setSelectedEvents}
        selectedItems={selectedEvents}
        selectText="Select Events..."
        searchInputPlaceholderText="Search Events..."
        displayKey="name"
        submitButtonText="Apply"
        styleMainWrapper={styles.multiSelect}
      />

<View style={styles.tableWrapper}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellMac]}>MAC</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellSource]}>Source</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellDetectedBy]}>Detected By</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellEventId]}>Event ID</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellTimestamp]}>Detected At</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellOriginal]}>Original By</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.cellTimestamp]}>Original At</Text>
              </View>

              {/* Rows */}
              {commonAddrs.length ? (
                commonAddrs.map(entry =>
                  entry.occurrences.map((doc, i) => (
                    <View key={`${entry.macAddress}-${i}`} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.cellMac]}>{entry.macAddress}</Text>
                      <Text style={[styles.tableCell, styles.cellSource]}>{doc.source}</Text>
                      <Text style={[styles.tableCell, styles.cellDetectedBy]}>{doc.detectedBluStickId}</Text>
                      <Text style={[styles.tableCell, styles.cellEventId]}>{doc.eventId}</Text>
                      <Text style={[styles.tableCell, styles.cellTimestamp]}>
                        {doc.detectedTimestamp?.toDate().toLocaleString() ?? '—'}
                      </Text>
                      <Text style={[styles.tableCell, styles.cellOriginal]}>{doc.originalBluStickId}</Text>
                      <Text style={[styles.tableCell, styles.cellTimestamp]}>
                        {doc.originalTimestamp?.toDate().toLocaleString() ?? '—'}
                      </Text>
                    </View>
                  ))
                )
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>No common addresses found.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {/* BottomBar */}
      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 8 },
  multiSelect: { width: '100%' },

  // Wraps both scrollviews and gives vertical space
  tableWrapper: {
    flex: 1,
    width: '100%',
    marginTop: 12,
  },

  table: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
  },

  // Base cell style, smaller padding & font
  tableCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#fff',
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },
  headerCell: {
    backgroundColor: '#000',
    fontWeight: 'bold',
  },

  // New, tighter minWidths and flex ratios
  cellMac:        { flex: 2, minWidth: 90  },
  cellSource:     { flex: 1, minWidth: 60  },
  cellDetectedBy: { flex: 1, minWidth: 60  },
  cellEventId:    { flex: 2, minWidth: 120 },
  cellTimestamp:  { flex: 2, minWidth: 120 },
  cellOriginal:   { flex: 1, minWidth: 60  },

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