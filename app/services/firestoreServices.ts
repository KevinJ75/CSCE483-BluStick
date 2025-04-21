import firestore from '@react-native-firebase/firestore';

export interface CommonAddress {
  macAddress: string;
  occurrences: any[]; // each now has `.source` === 'BLE' | 'WiFi'
}

export const findCommonAddresses = async (eventIds: string[]): Promise<CommonAddress[]> => {
  if (!eventIds.length) return [];

  const addressMap: Record<string, { eventId: string; data: any }[]> = {};
  const chunks: string[][] = [];

  for (let i = 0; i < eventIds.length; i += 10) {
    chunks.push(eventIds.slice(i, i + 10));
  }

  for (const chunk of chunks) {
    for (const source of ['beat', 'weat'] as const) {
      const q = firestore()
        .collection(source)
        .where('eventID', 'in', chunk);

      const snap = await q.get();

      snap.docs.forEach(docSnap => {
        const d = docSnap.data();
        const mac = d.macAddress as string;
        const eid = d.eventId as string;
        if (!mac || !eid) return;

        if (!addressMap[mac]) addressMap[mac] = [];
        // Spread in `source` here:
        addressMap[mac].push({
          eventId: eid,
          data: { ...d, source: source === 'beat' ? 'BLE' : 'WiFi' }
        });
      });
    }
  }

  return Object.entries(addressMap)
    .filter(([_, entries]) => {
      const seen = new Set(entries.map(e => e.eventId));
      return seen.size === eventIds.length;
    })
    .map(([macAddress, entries]) => ({
      macAddress,
      occurrences: entries.map(e => e.data)
    }));
};