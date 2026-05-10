/**
 * Service Worker Registration and Management
 */

export interface ServiceWorkerConfig {
  enabled?: boolean;
  scope?: string;
  updateCheckInterval?: number;
}

export class ServiceWorkerManager {
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
        this.notifyUpdate();
      }
    });
  }

  /**
   * Handle controller change
   */
  private handleControllerChange(): void {
    console.log('Service Worker controller changed');
    window.location.reload();
  }

  /**
   * Notify user of update
   */
  private notifyUpdate(): void {
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

let manager: ServiceWorkerManager | null = null;

export const initServiceWorker = (config: ServiceWorkerConfig = {}): ServiceWorkerManager => {
  if (!manager) {
    manager = new ServiceWorkerManager(config);
    manager.register(config);
  }
  return manager;
};

export const getServiceWorkerManager = (): ServiceWorkerManager | null => {
  return manager;
};
