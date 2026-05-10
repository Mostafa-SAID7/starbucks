/**
 * PWA Hooks
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
