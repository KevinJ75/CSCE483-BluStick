import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export interface MACAddressEntry {
  mac_address: string;
  occurrences: any[]; // Replace `any` with your actual type if known
  observations?: any[]; // Observations related to this MAC
}

/**
 * Finds MAC addresses that appear in all given eventIDs and includes related observations if available.
 *
 * @param eventIDs - Array of event IDs to filter MAC addresses by.
 * @returns An array of MACAddressEntry objects with common MACs and their related data.
 */
export const findCommonAddresses = async (
  eventIDs: string[]
): Promise<MACAddressEntry[]> => {
  if (!eventIDs || eventIDs.length === 0) return [];

  try {
    const addressMap: Record<string, { eventID: string; data: any }[]> = {};
    const chunks: string[][] = [];

    for (let i = 0; i < eventIDs.length; i += 10) {
      chunks.push(eventIDs.slice(i, i + 10));
    }

    // Get MAC address documents
    for (const chunk of chunks) {
      const q = query(
        collection(db, 'mac_address_ex'),
        where('eventID', 'in', chunk)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const mac = data.mac_address?.toLowerCase();
        const eventID = data.eventID;
        if (mac && eventID) {
          if (!addressMap[mac]) addressMap[mac] = [];
          addressMap[mac].push({ eventID, data });
        }
      });
    }

    const commonAddresses: MACAddressEntry[] = [];

    for (const [mac_address, entries] of Object.entries(addressMap)) {
      const uniqueEventIDs = new Set(entries.map(e => e.eventID));
      if (uniqueEventIDs.size === eventIDs.length) {
        // 🔎 Optional: Lookup related observations if mac_address is stored there too
        const observationQuery = query(
          collection(db, 'observations'),
          where('mac_address', '==', mac_address)
        );
        const observationSnapshot = await getDocs(observationQuery);
        const relatedObservations = observationSnapshot.docs.map(doc => doc.data());

        commonAddresses.push({
          mac_address,
          occurrences: entries.map(e => e.data),
          observations: relatedObservations,
        });
      }
    }

    console.log('Common MAC addresses with observations:', commonAddresses);
    return commonAddresses;
  } catch (error) {
    console.error('Error retrieving common MAC addresses:', error);
    return [];
  }
};
