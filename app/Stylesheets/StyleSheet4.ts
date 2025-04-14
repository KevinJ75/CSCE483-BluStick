import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60, // ensures content is pushed down below status bar
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
  },
  eventButton: {
    backgroundColor: '#007bff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  eventButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  logContainer: {
    flex: 1,
  },
  logCard: {
    backgroundColor: '#f0f0f0',
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
  },
  logText: {
    color: '#000',
  },
  endText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#888',
  },
  backButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
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
