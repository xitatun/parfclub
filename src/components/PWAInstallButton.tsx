import { CheckCircle2, Download, MonitorDown, RefreshCw, WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import { tr } from '../data/i18n';
import { useOfflineReadiness, useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import type { AppLanguage } from '../types/perfume';

const PWA_TEXT: Record<
  AppLanguage,
  {
    install: string;
    modalTitle: string;
    closeWindow: string;
    iosIntro: string;
    iosStep1: string;
    iosStep2Prefix: string;
    iosStep2Bold: string;
    iosStep2Suffix: string;
    iosStep3Prefix: string;
    iosStep3Bold1: string;
    iosStep3Mid: string;
    iosStep3Bold2: string;
    desktopIntroPrefix: string;
    desktopIntroBold: string;
    desktopStep1Prefix: string;
    desktopStep1Mid: string;
    desktopStep2Prefix: string;
    desktopStep2Em: string;
    gotIt: string;
    offline: string;
    offlineBadge: string;
    offlineSectionTitle: string;
    offlineSectionDesc: string;
    statusOnline: string;
    statusOffline: string;
    swReadyLabel: (count: number) => string;
    swPendingLabel: string;
    refreshCacheBtn: string;
    checkingCacheBtn: string;
    applyUpdateBtn: string;
  }
> = {
  ru: {
    install: 'Установить',
    modalTitle: 'Установка приложения на устройство',
    closeWindow: 'Закрыть окно',
    iosIntro: 'Чтобы установить «Ателье Эссенций» на iPhone или iPad как отдельное приложение:',
    iosStep1: 'Откройте ссылку приложения в браузере Safari (вне встроенного предпросмотра).',
    iosStep2Prefix: 'Нажмите кнопку ',
    iosStep2Bold: 'Поделиться',
    iosStep2Suffix: ' в нижней панели Safari.',
    iosStep3Prefix: 'Выберите ',
    iosStep3Bold1: 'На экран «Домой»',
    iosStep3Mid: ' и нажмите ',
    iosStep3Bold2: 'Добавить',
    desktopIntroPrefix: 'Приложение поддерживает установку как самостоятельная программа (PWA) с работой офлайн на ',
    desktopIntroBold: 'Windows, macOS, Linux и Android',
    desktopStep1Prefix: 'Откройте публичную ссылку приложения в отдельной вкладке ',
    desktopStep1Mid: ' или ',
    desktopStep2Prefix: 'Нажмите на значок установки в правой части адресной строки (или меню браузера → ',
    desktopStep2Em: 'Установить приложение «Ателье Эссенций»',
    gotIt: 'Понятно',
    offline: 'Автономный режим — все проекты и изменения сохраняются локально',
    offlineBadge: 'Офлайн',
    offlineSectionTitle: 'Работа офлайн и локальный кэш (PWA)',
    offlineSectionDesc:
      'Интерфейс, калькуляторы, экспорт PDF/Excel и ваша база сохраняются в браузере и продолжают работать без интернета.',
    statusOnline: 'Подключение к сети активно',
    statusOffline: 'Вы работаете в офлайн-режиме',
    swReadyLabel: (count) =>
      count > 0
        ? `Готово к работе без интернета (в кэше: ${count})`
        : 'Готово к работе без интернета',
    swPendingLabel: 'Кэш готовится — нажмите «Обновить кэш» для проверки',
    refreshCacheBtn: 'Обновить офлайн-кэш',
    checkingCacheBtn: 'Проверка...',
    applyUpdateBtn: 'Применить обновление',
  },
  en: {
    install: 'Install',
    modalTitle: 'Install App on Device',
    closeWindow: 'Close window',
    iosIntro: 'To install «Atelier Essences» on iPhone or iPad as a standalone app:',
    iosStep1: 'Open the app URL in Safari (outside embedded preview).',
    iosStep2Prefix: 'Tap the ',
    iosStep2Bold: 'Share',
    iosStep2Suffix: ' button in the bottom Safari bar.',
    iosStep3Prefix: 'Select ',
    iosStep3Bold1: 'Add to Home Screen',
    iosStep3Mid: ' and tap ',
    iosStep3Bold2: 'Add',
    desktopIntroPrefix: 'The app supports installation as a standalone Progressive Web App (PWA) with offline support on ',
    desktopIntroBold: 'Windows, macOS, Linux, and Android',
    desktopStep1Prefix: 'Open the public app URL in a separate ',
    desktopStep1Mid: ' or ',
    desktopStep2Prefix: 'Click the install icon in the right side of the address bar (or browser menu → ',
    desktopStep2Em: 'Install «Atelier Essences»',
    gotIt: 'Got it',
    offline: 'Offline mode — all projects and changes are saved locally',
    offlineBadge: 'Offline',
    offlineSectionTitle: 'Offline Mode & Local Cache (PWA)',
    offlineSectionDesc:
      'The workspace, calculators, PDF/Excel exports, and your studio data are cached in the browser and work without an internet connection.',
    statusOnline: 'Online connection active',
    statusOffline: 'Working in offline mode',
    swReadyLabel: (count) =>
      count > 0 ? `Ready for offline use (${count} cached assets)` : 'Ready for offline use',
    swPendingLabel: 'Cache warming up — click Refresh to verify',
    refreshCacheBtn: 'Refresh offline cache',
    checkingCacheBtn: 'Checking...',
    applyUpdateBtn: 'Apply app update',
  },
  it: {
    install: 'Installa',
    modalTitle: "Installa l'app sul dispositivo",
    closeWindow: 'Chiudi finestra',
    iosIntro: 'Per installare «Atelier Essenze» su iPhone o iPad come app autonoma:',
    iosStep1: "Apri l'URL dell'app in Safari (fuori dall'anteprima incorporata).",
    iosStep2Prefix: 'Tocca il pulsante ',
    iosStep2Bold: 'Condividi',
    iosStep2Suffix: ' nella barra inferiore di Safari.',
    iosStep3Prefix: 'Seleziona ',
    iosStep3Bold1: 'Aggiungi alla schermata Home',
    iosStep3Mid: ' e tocca ',
    iosStep3Bold2: 'Aggiungi',
    desktopIntroPrefix: "L'app supporta l'installazione come Progressive Web App (PWA) autonoma offline su ",
    desktopIntroBold: 'Windows, macOS, Linux e Android',
    desktopStep1Prefix: "Apri l'URL pubblico dell'app in una scheda separata di ",
    desktopStep1Mid: ' o ',
    desktopStep2Prefix: "Fai clic sull'icona di installazione nella barra degli indirizzi (o menu browser → ",
    desktopStep2Em: 'Installa «Atelier Essenze»',
    gotIt: 'Capito',
    offline: 'Modalità offline — tutte le modifiche sono salvate localmente',
    offlineBadge: 'Offline',
    offlineSectionTitle: 'Modalità Offline e Cache Locale (PWA)',
    offlineSectionDesc:
      'Interfaccia, calcolatori, esportazione PDF/Excel e dati dello studio restano salvati nel browser e funzionano senza internet.',
    statusOnline: 'Connessione di rete attiva',
    statusOffline: 'Lavoro in modalità offline',
    swReadyLabel: (count) =>
      count > 0 ? `Pronto per uso offline (${count} file in cache)` : 'Pronto per uso offline',
    swPendingLabel: 'Preparazione cache — premi Aggiorna per verificare',
    refreshCacheBtn: 'Aggiorna cache offline',
    checkingCacheBtn: 'Verifica...',
    applyUpdateBtn: 'Applica aggiornamento',
  },
  es: {
    install: 'Instalar',
    modalTitle: 'Instalar app en el dispositivo',
    closeWindow: 'Cerrar ventana',
    iosIntro: 'Para instalar «Atelier Esencias» en iPhone o iPad como app independiente:',
    iosStep1: 'Abre la URL de la app en Safari (fuera de la vista previa integrada).',
    iosStep2Prefix: 'Pulsa el botón ',
    iosStep2Bold: 'Compartir',
    iosStep2Suffix: ' en la barra inferior de Safari.',
    iosStep3Prefix: 'Selecciona ',
    iosStep3Bold1: 'Añadir a pantalla de inicio',
    iosStep3Mid: ' y pulsa ',
    iosStep3Bold2: 'Añadir',
    desktopIntroPrefix: 'La app admite instalación como Progressive Web App (PWA) independiente sin conexión en ',
    desktopIntroBold: 'Windows, macOS, Linux y Android',
    desktopStep1Prefix: 'Abre la URL pública de la app en una pestaña separada de ',
    desktopStep1Mid: ' o ',
    desktopStep2Prefix: 'Haz clic en el icono de instalar en la barra de direcciones (o menú del navegador → ',
    desktopStep2Em: 'Instalar «Atelier Esencias»',
    gotIt: 'Entendido',
    offline: 'Modo sin conexión — los cambios se guardan localmente',
    offlineBadge: 'Sin red',
    offlineSectionTitle: 'Modo Sin Conexión y Caché Local (PWA)',
    offlineSectionDesc:
      'La interfaz, calculadoras, exportación PDF/Excel y todos tus datos permanecen guardados y funcionan sin internet.',
    statusOnline: 'Conexión a internet activa',
    statusOffline: 'Trabajando sin conexión',
    swReadyLabel: (count) =>
      count > 0 ? `Listo para usar sin conexión (${count} archivos en caché)` : 'Listo sin conexión',
    swPendingLabel: 'Preparando caché — pulsa Actualizar para verificar',
    refreshCacheBtn: 'Actualizar caché offline',
    checkingCacheBtn: 'Verificando...',
    applyUpdateBtn: 'Aplicar actualización',
  },
  de: {
    install: 'Installieren',
    modalTitle: 'App auf Gerät installieren',
    closeWindow: 'Fenster schließen',
    iosIntro: 'So installierst du «Atelier Essenzen» auf iPhone oder iPad als eigenständige App:',
    iosStep1: 'Öffne die App-URL in Safari (außerhalb der eingebetteten Vorschau).',
    iosStep2Prefix: 'Tippe auf ',
    iosStep2Bold: 'Teilen',
    iosStep2Suffix: ' in der unteren Safari-Leiste.',
    iosStep3Prefix: 'Wähle ',
    iosStep3Bold1: 'Zum Home-Bildschirm',
    iosStep3Mid: ' und tippe auf ',
    iosStep3Bold2: 'Hinzufügen',
    desktopIntroPrefix: 'Die App lässt sich als eigenständige Progressive Web App (PWA) mit Offline-Unterstützung installieren auf ',
    desktopIntroBold: 'Windows, macOS, Linux und Android',
    desktopStep1Prefix: 'Öffne die öffentliche App-URL in einem separaten Tab von ',
    desktopStep1Mid: ' oder ',
    desktopStep2Prefix: 'Klicke auf das Installationssymbol in der Adressleiste (oder Browser-Menü → ',
    desktopStep2Em: '«Atelier Essenzen» installieren',
    gotIt: 'Verstanden',
    offline: 'Offline-Modus — alle Änderungen werden lokal gespeichert',
    offlineBadge: 'Offline',
    offlineSectionTitle: 'Offline-Betrieb & Lokaler Cache (PWA)',
    offlineSectionDesc:
      'Arbeitsbereich, Rechner, PDF/Excel-Exporte und Ihre Atelierdaten sind lokal gespeichert und funktionieren ohne Internet.',
    statusOnline: 'Netzwerkverbindung aktiv',
    statusOffline: 'Arbeitet im Offline-Modus',
    swReadyLabel: (count) =>
      count > 0 ? `Offline einsatzbereit (${count} Dateien im Cache)` : 'Offline einsatzbereit',
    swPendingLabel: 'Cache wird vorbereitet — zur Prüfung aktualisieren',
    refreshCacheBtn: 'Offline-Cache aktualisieren',
    checkingCacheBtn: 'Prüfe...',
    applyUpdateBtn: 'Update anwenden',
  },
};

export function PWAInstallButton({ language = 'ru' }: { language?: AppLanguage }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const t = tr(language, PWA_TEXT);

  if (isInstalled) {
    return !isOnline ? (
      <span className="inline-flex items-center gap-1 rounded bg-white/15 px-2 py-1 text-[11px] font-medium text-white whitespace-nowrap shrink-0">
        <WifiOff className="h-3 w-3" />
        <span>{t.offlineBadge}</span>
      </span>
    ) : null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] transition-colors hover:bg-[#F7F7F5] whitespace-nowrap shrink-0"
      >
        <MonitorDown className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
        <span>{t.install}</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181917]/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#E4E4E0] bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#181917]">{t.modalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg p-1 text-[#575955] hover:bg-[#F1F1EE]"
                aria-label={t.closeWindow}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-2 text-sm leading-relaxed text-[#3F413D]">
                <p>{t.iosIntro}</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>{t.iosStep1}</li>
                  <li>
                    {t.iosStep2Prefix}
                    <strong>{t.iosStep2Bold}</strong>
                    {t.iosStep2Suffix}
                  </li>
                  <li>
                    {t.iosStep3Prefix}
                    <strong>{t.iosStep3Bold1}</strong>
                    {t.iosStep3Mid}
                    <strong>{t.iosStep3Bold2}</strong>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2.5 text-sm leading-relaxed text-[#3F413D]">
                <p>
                  {t.desktopIntroPrefix}
                  <strong>{t.desktopIntroBold}</strong>:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    {t.desktopStep1Prefix}
                    <strong>Chrome</strong>
                    {t.desktopStep1Mid}
                    <strong>Edge</strong>.
                  </li>
                  <li>
                    {t.desktopStep2Prefix}
                    <em>{t.desktopStep2Em}</em>).
                  </li>
                </ol>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-[#EAEAE6] pt-3">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                {t.gotIt}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineStatusCard({ language = 'ru' }: { language?: AppLanguage }) {
  const {
    isOnline,
    isOfflineReady,
    needsRefresh,
    cachedFilesCount,
    isChecking,
    refreshOfflineCache,
    applyUpdate,
  } = useOfflineReadiness();
  const t = tr(language, PWA_TEXT);

  return (
    <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {isOnline ? (
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" />
          ) : (
            <WifiOff className="h-5 w-5 text-[#B45309] shrink-0 mt-0.5" />
          )}
          <div>
            <h2 className="text-base font-semibold text-[#181917]">{t.offlineSectionTitle}</h2>
            <p className="mt-0.5 text-xs text-[#605E5C]">{t.offlineSectionDesc}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <PWAInstallButton language={language} />
          <button
            type="button"
            onClick={() => void refreshOfflineCache()}
            disabled={isChecking || !isOnline}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-white disabled:opacity-40 whitespace-nowrap"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? t.checkingCacheBtn : t.refreshCacheBtn}</span>
          </button>
          {needsRefresh && (
            <button
              type="button"
              onClick={() => void applyUpdate()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t.applyUpdateBtn}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#EDEBE9] pt-3 text-xs">
        <span className={isOnline ? 'font-medium text-[#15803D]' : 'font-medium text-[#B45309]'}>
          {isOnline ? t.statusOnline : t.statusOffline}
        </span>
        <span aria-hidden="true" className="text-[#C8C8C2]">
          ·
        </span>
        <span className="text-[#605E5C] tabular-nums">
          {isOfflineReady ? t.swReadyLabel(cachedFilesCount) : t.swPendingLabel}
        </span>
      </div>
    </section>
  );
}

export function OfflineIndicator({ language = 'ru' }: { language?: AppLanguage }) {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      data-capture-ignore="true"
      className="print:hidden fixed bottom-10 left-4 z-40 flex items-center gap-2 rounded-lg border border-[#B45309]/30 bg-white px-3.5 py-2 text-xs font-medium text-[#B45309] shadow-md"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>{tr(language, PWA_TEXT).offline}</span>
    </div>
  );
}
