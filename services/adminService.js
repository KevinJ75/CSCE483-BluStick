// Import Firestore functions from Firebase Web SDK
import { doc, getDoc, setDoc } from "firebase/firestore";
// Import the db instance from your FirebaseConfig file
import { db } from "../FirebaseConfig";

// Make a user an admin
export const makeAdmin = async (userId) => {
  try {
    await setDoc(doc(db, "users", userId), { admin: true }, { merge: true });
    console.log("User is now an admin");
  } catch (error) {
    console.error("Error making admin:", error);
  }
};

// Remove admin status from a user
export const makeNotAdmin = async (userId) => {
  try {
    await setDoc(doc(db, "users", userId), { admin: false }, { merge: true });
    console.log("User is no longer an admin");
  } catch (error) {
    console.error("Error removing admin status:", error);
  }
};

// Check if a user is an admin
export const checkAdminStatus = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && docSnap.data().admin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
