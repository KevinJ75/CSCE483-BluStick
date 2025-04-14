import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60, // push content down
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  tableContainer: {
    width: '100%',
    marginTop: 16,
    maxHeight: screenHeight * 0.4,
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
    color: '#000',
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

export default styles;
