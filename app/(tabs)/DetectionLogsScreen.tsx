import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const sampleData = [
  { id: '1', name: 'Record 1', value: 'Value 1' },
  { id: '2', name: 'Record 2', value: 'Value 2' },
  { id: '3', name: 'Record 3', value: 'Value 3' },
  { id: '4', name: 'Record 4', value: 'Value 4' },
];

const DetectionLogsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection Logs Screen</Text>
      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>ID</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Name</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Value</Text>
          </View>
          {/* Table Rows */}
          {sampleData.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.id}</Text>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.value}</Text>
            </View>
          ))}
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
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
});

export default DetectionLogsScreen;
