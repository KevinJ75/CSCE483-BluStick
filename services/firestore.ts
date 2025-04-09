import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // Ensure the correct path

export const findDuplicateAddresses = async () => {
  try {
    const q = query(collection(db, "mac_address_ex"), where("eventID", "==", 464)); // Ensure eventID is queried as a number
    const querySnapshot = await getDocs(q);
    console.log("Query executed successfully, found documents:", querySnapshot.size);

    const addressMap: Record<string, any[]> = {}; // Store full document data

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.mac_address) {
        if (!addressMap[data.mac_address]) {
          addressMap[data.mac_address] = [];
        }
        addressMap[data.mac_address].push(data);
      }
    });

    // Extract duplicate entries
    const duplicates = Object.entries(addressMap)
      .filter(([_, docs]) => docs.length > 1)
      .map(([mac_address, docs]) => ({ mac_address, occurrences: docs }));

    console.log("Duplicate MAC addresses with full details:", duplicates);
    return duplicates;
  } catch (error) {
    console.error("Error retrieving duplicate MAC addresses:", error);
    return [];
  }
};
