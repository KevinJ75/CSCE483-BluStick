import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { findDuplicateAddresses } from '@/services/firestore';

const DetectionLogsScreen: React.FC = () => {
  const [duplicates, setDuplicates] = useState<
    { mac_address: string; occurrences: any[] }[]
  >([]);

  useEffect(() => {
    findDuplicateAddresses().then((result) => {
      if (result) setDuplicates(result);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duplicate MAC Addresses</Text>
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
                  <Text style={[styles.tableCell, styles.tableEntry]}>{doc.timestamp}</Text>
                </View>
              ))
            )
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell} colSpan={5}>
                No duplicate MAC addresses found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    color: '#000',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  tableEntry: {
    color: '#FFF',
  }
});

export default DetectionLogsScreen;