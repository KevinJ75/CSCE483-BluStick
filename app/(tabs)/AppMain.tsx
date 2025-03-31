// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import BottomBar from '@/components/BottomBar';
// import DetectionLogsScreen from '@/app/(tabs)/DetectionLogsScreen';
// import EventLogsScreen from '@/app/(tabs)/EventLogsScreen';
// import ObservationLogScreen from '@/app/(tabs)/ObservationLogScreen';
// import QuestionnaireScreen from '@/app/(tabs)/QuestionnaireScreen';
// import { useNavigation } from '@react-navigation/native';



// const Stack = createStackNavigator();
// // Cast the navigator to a valid React component type
// const Navigator = Stack.Navigator as unknown as React.ComponentType<any>;

// const HomeScreen: React.FC = () => {
//     const navigation = useNavigation();
//     return <BottomBar navigation={navigation} />;
//   };

//   export default HomeScreen;


// export default function App() {
//   return (
//     <NavigationContainer>
//       <Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Explore' }} />
//         <Stack.Screen name="DetectionLogs" component={DetectionLogsScreen} options={{ title: 'Detection Logs' }} />
//         <Stack.Screen name="EventLogs" component={EventLogsScreen} options={{ title: 'Event Logs' }} />
//         <Stack.Screen name="ObservationLog" component={ObservationLogScreen} options={{ title: 'Observation Log' }} />
//         <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} options={{ title: 'Questionnaire' }} />
//       </Navigator>
//     </NavigationContainer>
//   );
// }
