import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function useOfflineReadiness() {
  const isOnline = useOnlineStatus();
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [cachedFilesCount, setCachedFilesCount] = useState<number>(0);
  const [isChecking, setIsChecking] = useState(false);

  const inspectCaches = async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return 0;
    try {
      const names = await caches.keys();
      let total = 0;
      for (const name of names) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        total += keys.length;
      }
      setCachedFilesCount(total);
      if (total > 0) {
        setIsOfflineReady(true);
      }
      return total;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    let active = true;
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => {
          if (active) {
            setIsOfflineReady(true);
            void inspectCaches();
          }
        })
        .catch(() => {
          // ignore sw errors
        });
    }
    void inspectCaches();

    const handleOfflineReady = () => {
      setIsOfflineReady(true);
      void inspectCaches();
    };
    const handleNeedRefresh = () => setNeedsRefresh(true);
    const handleRegistered = () => {
      void inspectCaches();
    };

    window.addEventListener('atelier:pwa-offline-ready', handleOfflineReady);
    window.addEventListener('atelier:pwa-need-refresh', handleNeedRefresh);
    window.addEventListener('atelier:pwa-registered', handleRegistered);

    return () => {
      active = false;
      window.removeEventListener('atelier:pwa-offline-ready', handleOfflineReady);
      window.removeEventListener('atelier:pwa-need-refresh', handleNeedRefresh);
      window.removeEventListener('atelier:pwa-registered', handleRegistered);
    };
  }, []);

  const refreshOfflineCache = async () => {
    setIsChecking(true);
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      }
      if ('caches' in window) {
        const cache = await caches.open('atelier-offline-shell');
        await cache.addAll(['/', '/index.html']).catch(() => {});
      }
      const total = await inspectCaches();
      if (total > 0 || ('serviceWorker' in navigator && !!navigator.serviceWorker.controller)) {
        setIsOfflineReady(true);
      }
      return total;
    } finally {
      setIsChecking(false);
    }
  };

  const applyUpdate = async () => {
    const updater = (
      window as unknown as { __atelierUpdateSW?: (reloadPage?: boolean) => Promise<void> }
    ).__atelierUpdateSW;
    if (updater) {
      await updater(true);
    } else {
      window.location.reload();
    }
  };

  return {
    isOnline,
    isOfflineReady,
    needsRefresh,
    cachedFilesCount,
    isChecking,
    refreshOfflineCache,
    applyUpdate,
  };
}
