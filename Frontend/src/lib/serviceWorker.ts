/**
 * Service Worker Registration and Management
 */

export interface ServiceWorkerConfig {
  enabled?: boolean;
  scope?: string;
  updateCheckInterval?: number;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: number;

  constructor(config: ServiceWorkerConfig = {}) {
    this.updateCheckInterval = config.updateCheckInterval || 1000 * 60 * 60; // 1 hour
  }

  /**
   * Register service worker
   */
  async register(config: ServiceWorkerConfig = {}): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return;
    }

    if (config.enabled === false) {
      return;
    }

    try {
      const scope = config.scope || '/';
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope,
      });

      console.log('Service Worker registered:', this.registration);

      // Check for updates periodically
      this.startUpdateCheck();

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.handleControllerChange();
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.unregister();
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
      }
    }
  }

  /**
   * Check for updates
   */
  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
      } catch (error) {
        console.error('Service Worker update check failed:', error);
      }
    }
  }

  /**
   * Start periodic update checks
   */
  private startUpdateCheck(): void {
    setInterval(() => {
      this.checkForUpdates();
    }, this.updateCheckInterval);
  }

  /**
   * Handle update found
   */
  private handleUpdateFound(): void {
    const newWorker = this.registration?.installing;

    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New service worker available
        this.notifyUpdate();
      }
    });
  }

  /**
   * Handle controller change
   */
  private handleControllerChange(): void {
    console.log('Service Worker controller changed');
    // Reload page to use new service worker
    window.location.reload();
  }

  /**
   * Notify user of update
   */
  private notifyUpdate(): void {
    // Dispatch custom event for app to handle
    window.dispatchEvent(
      new CustomEvent('sw-update-available', {
        detail: { registration: this.registration },
      })
    );
  }

  /**
   * Skip waiting (activate new service worker immediately)
   */
  async skipWaiting(): Promise<void> {
    const newWorker = this.registration?.waiting;
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  /**
   * Get registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * Check if service worker is active
   */
  isActive(): boolean {
    return this.registration?.active !== undefined;
  }
}

// Singleton instance
let manager: ServiceWorkerManager | null = null;

/**
 * Initialize service worker
 */
export const initServiceWorker = (config: ServiceWorkerConfig = {}): ServiceWorkerManager => {
  if (!manager) {
    manager = new ServiceWorkerManager(config);
    manager.register(config);
  }
  return manager;
};

/**
 * Get service worker manager
 */
export const getServiceWorkerManager = (): ServiceWorkerManager | null => {
  return manager;
};

/**
 * Register mutation for background sync
 */
export const registerMutation = async (
  url: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): Promise<void> => {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync not supported');
    return;
  }

  try {
    // Store mutation in IndexedDB
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

    // Register background sync
    const registration = await navigator.serviceWorker.ready;
    const syncManager = registration as any;
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

function saveMutation(db: IDBDatabase, mutation: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['mutations'], 'readwrite');
    const store = transaction.objectStore('mutations');
    const request = store.add(mutation);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Listen for service worker updates
 */
export const onServiceWorkerUpdate = (
  callback: (registration: ServiceWorkerRegistration) => void
): (() => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.registration);
  };

  window.addEventListener('sw-update-available', handler);

  return () => {
    window.removeEventListener('sw-update-available', handler);
  };
};
