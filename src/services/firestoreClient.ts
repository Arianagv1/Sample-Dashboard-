import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from './firebase';
import { GROUND_TRUTH_TOUCHPOINTS } from '../data/groundTruthP2C';
import { FirestoreStatus, TouchpointRecord } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const COLLECTION_NAME = 'cm360_p2c_touchpoints';
const LOCAL_BACKUP_KEY = 'cm360_p2c_touchpoints_backup';

// Initial status using live Cloud Firestore parameters
export function getInitialFirestoreStatus(): FirestoreStatus {
  return {
    connected: true,
    databaseId: firebaseConfig.firestoreDatabaseId || 'default',
    collectionName: COLLECTION_NAME,
    documentCount: GROUND_TRUTH_TOUCHPOINTS.length,
    lastSynced: new Date().toISOString(),
    mode: 'cloud',
  };
}

/**
 * Loads touchpoint records from live Cloud Firestore collection.
 * If Firestore collection is empty, automatically seeds with ground truth records.
 */
export async function loadTouchpointsFromFirestore(): Promise<{
  records: TouchpointRecord[];
  status: FirestoreStatus;
}> {
  // Test connection first
  await testFirestoreConnection();

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const records: TouchpointRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as TouchpointRecord;
        if (data && data.conversion_id && data.interaction_number) {
          records.push(data);
        }
      });

      // Sort by conversion_id and interaction_number
      records.sort((a, b) => {
        const cmp = a.conversion_id.localeCompare(b.conversion_id);
        if (cmp !== 0) return cmp;
        return a.interaction_number - b.interaction_number;
      });

      const status: FirestoreStatus = {
        connected: true,
        databaseId: firebaseConfig.firestoreDatabaseId,
        collectionName: COLLECTION_NAME,
        documentCount: records.length,
        lastSynced: new Date().toISOString(),
        mode: 'cloud',
      };

      try {
        localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(records));
      } catch (e) {
        // ignore storage errors
      }

      return { records, status };
    }

    // If live Firestore collection is empty, seed it with ground truth data
    console.log('Live Firestore collection empty, seeding initial ground truth...');
    await saveTouchpointsToFirestore(GROUND_TRUTH_TOUCHPOINTS);

    return {
      records: GROUND_TRUTH_TOUCHPOINTS,
      status: {
        connected: true,
        databaseId: firebaseConfig.firestoreDatabaseId,
        collectionName: COLLECTION_NAME,
        documentCount: GROUND_TRUTH_TOUCHPOINTS.length,
        lastSynced: new Date().toISOString(),
        mode: 'cloud',
      },
    };
  } catch (error) {
    console.warn('Could not read from Cloud Firestore, falling back to local replica:', error);
    try {
      const cached = localStorage.getItem(LOCAL_BACKUP_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            records: parsed,
            status: {
              connected: false,
              databaseId: firebaseConfig.firestoreDatabaseId,
              collectionName: COLLECTION_NAME,
              documentCount: parsed.length,
              lastSynced: new Date().toISOString(),
              mode: 'local_replicated',
            },
          };
        }
      }
    } catch (e) {
      // ignore
    }

    return {
      records: GROUND_TRUTH_TOUCHPOINTS,
      status: {
        connected: false,
        databaseId: firebaseConfig.firestoreDatabaseId,
        collectionName: COLLECTION_NAME,
        documentCount: GROUND_TRUTH_TOUCHPOINTS.length,
        lastSynced: new Date().toISOString(),
        mode: 'local_replicated',
      },
    };
  }
}

function sanitizeRecordForFirestore(record: TouchpointRecord): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Saves touchpoint records to live Cloud Firestore batch.
 */
export async function saveTouchpointsToFirestore(
  records: TouchpointRecord[]
): Promise<{ success: boolean; status: FirestoreStatus }> {
  try {
    // Write in batch to Cloud Firestore
    const batch = writeBatch(db);

    records.forEach((record) => {
      // Unique document ID per touchpoint: {conversion_id}_{step}
      const docId = `${record.conversion_id}_step${record.interaction_number}`;
      const docRef = doc(db, COLLECTION_NAME, docId);
      const cleanData = sanitizeRecordForFirestore(record);
      batch.set(docRef, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    try {
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(records));
    } catch (e) {
      // ignore
    }

    const status: FirestoreStatus = {
      connected: true,
      databaseId: firebaseConfig.firestoreDatabaseId,
      collectionName: COLLECTION_NAME,
      documentCount: records.length,
      lastSynced: new Date().toISOString(),
      mode: 'cloud',
    };

    return { success: true, status };
  } catch (error) {
    console.error('Failed to write to Cloud Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    } catch (e) {
      // logged
    }

    // Fallback save to local backup
    try {
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(records));
    } catch (e) {
      // ignore
    }

    return {
      success: false,
      status: {
        connected: false,
        databaseId: firebaseConfig.firestoreDatabaseId,
        collectionName: COLLECTION_NAME,
        documentCount: records.length,
        lastSynced: new Date().toISOString(),
        mode: 'local_replicated',
      },
    };
  }
}

/**
 * Synchronous initial getter for React useState initialization
 */
export function getInitialTouchpoints(): TouchpointRecord[] {
  try {
    const cached = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return GROUND_TRUTH_TOUCHPOINTS;
}

/**
 * Resets Firestore collection to ground truth records
 */
export async function resetToGroundTruth(): Promise<{
  records: TouchpointRecord[];
  status: FirestoreStatus;
}> {
  const result = await saveTouchpointsToFirestore(GROUND_TRUTH_TOUCHPOINTS);
  return {
    records: GROUND_TRUTH_TOUCHPOINTS,
    status: result.status,
  };
}
