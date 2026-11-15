import { X } from 'lucide-react';
import { useEffect } from 'react';
import { tr } from '../data/i18n';
import type { AppLanguage } from '../types/perfume';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  language?: AppLanguage;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  language = 'ru',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const resolvedConfirmLabel =
    confirmLabel ??
    tr(language, {
      ru: 'Подтвердить',
      en: 'Confirm',
      it: 'Conferma',
      es: 'Confirmar',
      de: 'Bestätigen',
    });
  const resolvedCancelLabel =
    cancelLabel ??
    tr(language, {
      ru: 'Отмена',
      en: 'Cancel',
      it: 'Annulla',
      es: 'Cancelar',
      de: 'Abbrechen',
    });

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#181917]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#E4E4E0] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="confirm-modal-title" className="text-lg font-semibold text-[#181917]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-[#575955] transition-colors hover:bg-[#F1F1EE] hover:text-[#181917]"
            aria-label={tr(language, {
              ru: 'Закрыть окно',
              en: 'Close window',
              it: 'Chiudi finestra',
              es: 'Cerrar ventana',
              de: 'Fenster schließen',
            })}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#575955]">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#E4E4E0] bg-white px-4 py-2 text-sm font-medium text-[#181917] transition-colors hover:bg-[#F7F7F5] whitespace-nowrap shrink-0"
          >
            {resolvedCancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors whitespace-nowrap shrink-0 ${
              destructive
                ? 'bg-[#B91C1C] hover:bg-[#991B1B]'
                : 'bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)]'
            }`}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
