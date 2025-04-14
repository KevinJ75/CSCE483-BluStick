// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import BottomBar from '@/components/BottomBar';
// import styles from '@/app/Stylesheets/StyleSheet6'

// const sampleData = [
//   { id: '1', question: 'How does the person look like?', response: 'wearing black clothes with a hat and glasses.' },
//   { id: '2', question: 'Was the person with someone?', response: 'Yes' },
//   { id: '3', question: 'Any suggestions?', response: 'More features' },
//   { id: '4', question: 'OTHER INFORMATION:', response: 'N/A' },
// ];

// const QuestionnaireScreen: React.FC = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Questionnaire Screen</Text>
//       <ScrollView horizontal style={styles.tableContainer}>
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, styles.tableHeader]}>ID</Text>
//             <Text style={[styles.tableCell, styles.tableHeader]}>Question</Text>
//             <Text style={[styles.tableCell, styles.tableHeader]}>Response</Text>
//           </View>
//           {/* Table Rows */}
//           {sampleData.map((item) => (
//             <View key={item.id} style={styles.tableRow}>
//               <Text style={styles.tableCell}>{item.id}</Text>
//               <Text style={styles.tableCell}>{item.question}</Text>
//               <Text style={styles.tableCell}>{item.response}</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//       <View style={styles.bottomBarContainer}>
//         <BottomBar />
//       </View>
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     justifyContent: 'flex-start',
// //     alignItems: 'center',
// //   },
// //   title: {
// //     fontSize: 20,
// //     marginBottom: 16,
// //   },
// //   tableContainer: {
// //     width: '100%',
// //   },
// //   table: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //   },
// //   tableRow: {
// //     flexDirection: 'row',
// //   },
// //   tableCell: {
// //     flex: 1,
// //     padding: 8,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     textAlign: 'center',
// //   },
// //   tableHeader: {
// //     fontWeight: 'bold',
// //     backgroundColor: '#f0f0f0',
// //   },
// //   bottomBarContainer: {
// //     position: 'absolute',
// //     bottom: -32,
// //     left: 0,
// //     right: 0,
// //     maxHeight: '40%', // Adjust as needed if content is tall
// //     padding: 16,
// //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //   },
// // });

// export default QuestionnaireScreen;




import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BottomBar from '@/components/BottomBar';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from '@/app/Stylesheets/StyleSheet6';
import firestore from '@react-native-firebase/firestore';

const questions = [
  { id: '1', question: 'How does the person look like?' },
  { id: '2', question: 'Was the person with someone?' },
  { id: '3', question: 'Any suggestions?' },
  { id: '4', question: 'OTHER INFORMATION:' },
];

const QuestionnaireScreen: React.FC = () => {
  const [responses, setResponses] = useState<{ [id: string]: string }>({});
  const user = auth().currentUser;

  const handleChange = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const incomplete = questions.some(q => !responses[q.id]?.trim());
    if (incomplete) {
      Alert.alert('Please answer all the questions.');
      return;
    }

    try {
      await firestore().collection('questionnaire_responses').add({
        responses,
        user: user?.email || 'Unknown',
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    
      Alert.alert('Submission successful!');
      setResponses({});
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      Alert.alert('Submission failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questionnaire</Text>

      <ScrollView style={{ width: '100%' }}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.question}</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your answer..."
              placeholderTextColor="#aaa"
              value={responses[q.id] || ''}
              onChangeText={(text) => handleChange(q.id, text)}
              multiline
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar />
      </View>
    </View>
  );
};

export default QuestionnaireScreen;