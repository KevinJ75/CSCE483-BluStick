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
import { auth, db } from '@/FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// List of questions
const questions = [
  { id: '1', question: 'How does the person look like?' },
  { id: '2', question: 'Was the person with someone?' },
  { id: '3', question: 'Any suggestions?' },
  { id: '4', question: 'OTHER INFORMATION:' },
];

const QuestionnaireScreen: React.FC = () => {
  const [responses, setResponses] = useState<{ [id: string]: string }>({});
  const user = auth.currentUser;

  // Update state when text input changes
  const handleChange = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  // Submit to Firestore
  const handleSubmit = async () => {
    const incomplete = questions.some(q => !responses[q.id]?.trim());
    if (incomplete) {
      Alert.alert('Please answer all the questions.');
      return;
    }

    try {
      await addDoc(collection(db, 'questionnaire_responses'), {
        responses,
        user: user?.email || 'Unknown',
        timestamp: Timestamp.now(),
      });

      Alert.alert('Submission successful!');
      console.log('Form content:', responses);
      setResponses({}); // Clear form
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2f2f2f',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: -32,
    left: 0,
    right: 0,
    maxHeight: '40%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default QuestionnaireScreen;
