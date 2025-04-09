import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export const findCommonAddresses = async (eventIDs: string[]) => {
  if (!eventIDs || eventIDs.length === 0) return [];

  try {
    const addressMap: Record<string, { eventID: string; data: any }[]> = {};

    // Break eventIDs into chunks of 10 for Firestore `in` queries
    const chunks = [];
    for (let i = 0; i < eventIDs.length; i += 10) {
      chunks.push(eventIDs.slice(i, i + 10));
    }

    for (const chunk of chunks) {
      const q = query(
        collection(db, 'mac_address_ex'),
        where('eventID', 'in', chunk)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const mac = data.mac_address;
        const eventID = data.eventID;
        if (mac && eventID) {
          if (!addressMap[mac]) addressMap[mac] = [];
          addressMap[mac].push({ eventID, data });
        }
      });
    }

    // Filter to only MAC addresses present in ALL selected events
    const commonAddresses = Object.entries(addressMap)
      .filter(([_, entries]) => {
        const uniqueEventIDs = new Set(entries.map(e => e.eventID));
        return uniqueEventIDs.size === eventIDs.length;
      })
      .map(([mac_address, entries]) => ({
        mac_address,
        occurrences: entries.map(e => e.data),
      }));

    console.log('Common MAC addresses across all events:', commonAddresses);
    return commonAddresses;
  } catch (error) {
    console.error('Error retrieving common MAC addresses:', error);
    return [];
  }
};