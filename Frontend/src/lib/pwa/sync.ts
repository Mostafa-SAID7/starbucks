/**
 * Background Sync and Offline Mutations
 */

export interface PendingMutation {
  id: string;
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  timestamp: number;
}

export const registerMutation = async (
  url: string,
  method: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<void> => {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync not supported');
    return;
  }

  try {
    const db = await openIndexedDB();
    const mutation = {
      id: `${Date.now()}-${Math.random()}`,
      url,
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
      timestamp: Date.now(),
    };

    await saveMutation(db, mutation);

    const registration = await navigator.serviceWorker.ready;
    const syncManager = registration as unknown as { sync?: { register: (name: string) => Promise<void> } };
    if (syncManager.sync) {
      await syncManager.sync.register('sync-mutations');
    }

    console.log('Mutation registered for background sync:', mutation);
  } catch (error) {
    console.error('Failed to register mutation:', error);
  }
};

/**
 * IndexedDB helpers
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('starbucks-db', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('mutations')) {
        db.createObjectStore('mutations', { keyPath: 'id' });
      }
    };
  });
}

function saveMutation(db: IDBDatabase, mutation: PendingMutation): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['mutations'], 'readwrite');
    const store = transaction.objectStore('mutations');
    const request = store.add(mutation);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
