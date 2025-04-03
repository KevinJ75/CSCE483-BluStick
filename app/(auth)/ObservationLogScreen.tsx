import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomBar from '@/components/BottomBar';

const sampleData = [
  { id: '1', observation: 'Observation A', detail: 'Detail A' },
  { id: '2', observation: 'Observation B', detail: 'Detail B' },
  { id: '3', observation: 'Observation C', detail: 'Detail C' },
  { id: '4', observation: 'Observation D', detail: 'Detail D' },
];

const ObservationLogScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Observation Log Screen</Text>
      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Observation</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Detail</Text>
          </View>
          {/* Table Rows */}
          {sampleData.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.id}</Text>
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
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '40%', // Adjust as needed if content is tall
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default ObservationLogScreen;