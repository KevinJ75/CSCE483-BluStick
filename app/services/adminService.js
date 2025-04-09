import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'react-native';

export const makeAdmin = async (userId) => {

  try {
    const userRef = firestore().collection('users').doc(userId);
    await userRef.set({ admin: true }, { merge: true });

    console.log('User is now an admin');
  } catch (error) {
    console.error('Error making admin:', error);
  }
};

export const makeNotAdmin = async (userId) => {
    try {
      const userRef = firestore().collection('users').doc(userId);
      await userRef.set({ admin: false }, { merge: false });
      console.log('User is no longer an admin');
    } catch (error) {
      console.error('Error removing admin status:', error);
    }
  };

export const checkAdminStatus = async (userId) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        return userDoc.data().admin || false; // Returns true if admin
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };
  