// // import auth from '@react-native-firebase/auth'
// // import { View, Text, Button} from 'react-native'

// const Page = () => {
//     const user = auth().currentUser;

//     return (
//         <View>
//             <Text>Welcome back {user?.email}</Text>
//             <Button title='Sign Out' onPress={() => auth().signOut()} />
//         </View>
//     );
// };
// export default Page;

import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import { checkAdminStatus, makeAdmin, makeNotAdmin } from "../services/adminService";
import { Link } from 'expo-router'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Page = () => {
  const user = auth().currentUser;
  const [isAdmin, setIsAdmin] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    if (user) {
      checkAdminStatus(user.uid).then(setIsAdmin);
    }
  }, [user]);

  return (
    <ThemedView>
      <ThemedText style={styles.text}>Welcome {user?.displayName}</ThemedText>
      {isAdmin && <ThemedText>You are an admin! 🎉</ThemedText>}
      <Button title='Sign Out' onPress={() => auth().signOut()} />
      {isAdmin || (
        <>
        <Button
          title="Make Me Admin"
          onPress={() => makeAdmin(user?.uid)}
        />
        {/* <Link href="/(tabs)/explore">Go to Explore Page</Link> */}
        </>
      )}

      {isAdmin ? (
            // <ActivityIndicator size={'small'} style={{ margin: 28 }} />
            <>
                <Button onPress={() => makeNotAdmin(user?.uid)} title="Remove admin Status" />
            </>
        ) : (
            <>
                <ThemedText><Link href="/(tabs)/explore">Go to Explore Page</Link></ThemedText>
            </>
        )}
    </ThemedView>
  );
};

export default Page;

const styles = StyleSheet.create({
  text: {
    padding: 'auto',
  },

});