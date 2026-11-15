import {
  BookOpen,
  Calculator,
  Check,
  FileDown,
  FileText,
  FlaskConical,
  History,
  Layers,
  Radar,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { tr } from '../data/i18n';
import type { AppLanguage, PerfumeProject, ProjectEstimateItem } from '../types/perfume';
import {
  ALL_PROJECT_PDF_SECTIONS,
  type ProjectPdfSectionKey,
} from './PdfDocumentSheets';

interface PdfProjectPagesModalProps {
  open: boolean;
  project: PerfumeProject | null;
  estimates: ProjectEstimateItem[];
  language: AppLanguage;
  onConfirm: (selectedSections: ProjectPdfSectionKey[]) => void;
  onCancel: () => void;
}

interface SectionOption {
  key: ProjectPdfSectionKey;
  title: string;
  description: string;
  sheetCount: number;
  emptyNote?: string;
  icon: typeof FileText;
}

export function PdfProjectPagesModal({
  open,
  project,
  estimates,
  language,
  onConfirm,
  onCancel,
}: PdfProjectPagesModalProps) {
  const options = useMemo<SectionOption[]>(() => {
    if (!project) return [];
    const formulaSheets = Math.max(1, Math.ceil(project.components.length / 14));
    const journalSheets = Math.ceil(project.journal.length / 4);
    const revCount = (project.revisions || []).length;
    const revSheets = Math.ceil(revCount / 4);
    const estCount = estimates.filter((e) => e.projectId === project.id).length;

    return [
      {
        key: 'passport',
        title: tr(language, {
          ru: 'Паспорт проекта и концепция',
          en: 'Project Passport & Concept',
          it: 'Passaporto Progetto e Concetto',
          es: 'Ficha de Proyecto y Concepto',
          de: 'Projektpass & Konzept',
        }),
        description: tr(language, {
          ru: 'Метрики, технические параметры, идея, вдохновение и мацерация',
          en: 'Metrics, technical parameters, idea, inspiration & maceration',
          it: 'Metriche, parametri tecnici, idea, ispirazione e macerazione',
          es: 'Métricas, parámetros técnicos, idea, inspiración y maceración',
          de: 'Kennzahlen, technische Parameter, Idee, Inspiration & Mazeration',
        }),
        sheetCount: 1,
        icon: FileText,
      },
      {
        key: 'formula',
        title: tr(language, {
          ru: 'Состав формулы',
          en: 'Formula Composition',
          it: 'Composizione Formula',
          es: 'Composición de Fórmula',
          de: 'Formelzusammensetzung',
        }),
        description: tr(language, {
          ru: `Таблица компонентов (${project.components.length}), разведение, доли % и стоимость`,
          en: `Components table (${project.components.length}), dilutions, % shares & cost`,
          it: `Tabella componenti (${project.components.length}), diluizioni, % e costi`,
          es: `Tabla de componentes (${project.components.length}), diluciones, % y coste`,
          de: `Komponententabelle (${project.components.length}), Verdünnung, % & Kosten`,
        }),
        sheetCount: formulaSheets,
        icon: FlaskConical,
      },
      {
        key: 'olfactory',
        title: tr(language, {
          ru: 'Ольфакторная пирамида и профиль аккордов',
          en: 'Olfactory Pyramid & Accord Profile',
          it: 'Piramide Olfattiva e Profilo Accordi',
          es: 'Pirámide Olfativa y Perfil de Acordes',
          de: 'Duftpyramide & Akkordprofil',
        }),
        description: tr(language, {
          ru: 'Схема пирамиды В/С/Б, радар аккордов и шкала семейств',
          en: 'T/H/B pyramid diagram, accord radar & family breakdown',
          it: 'Schema piramide T/C/F, radar accordi e famiglie olfattive',
          es: 'Esquema pirámide S/C/F, radar de acordes y familias olfativas',
          de: 'K/H/B-Pyramide, Akkord-Radar & Duftfamilien',
        }),
        sheetCount: 1,
        icon: Radar,
      },
      {
        key: 'notes',
        title: tr(language, {
          ru: 'Ноты композиции и раскрытие во времени',
          en: 'Composition Notes & Scent Evolution',
          it: 'Note della Composizione ed Evoluzione',
          es: 'Notas de Composición y Evolución',
          de: 'Duftnoten & Duftverlauf',
        }),
        description: tr(language, {
          ru: 'Верхние, средние и базовые ноты + кривая раскрытия',
          en: 'Top, heart & base notes + scent evolution curve',
          it: 'Note di testa, cuore e fondo + curva di evoluzione',
          es: 'Notas de salida, corazón y fondo + curva de evolución',
          de: 'Kopf-, Herz- und Basisnoten + Duftverlaufskurve',
        }),
        sheetCount: 1,
        icon: Layers,
      },
      {
        key: 'journal',
        title: tr(language, {
          ru: 'Лабораторный журнал испытаний',
          en: 'Laboratory Trials Journal',
          it: 'Giornale delle Prove di Laboratorio',
          es: 'Diario de Pruebas de Laboratorio',
          de: 'Labor-Versuchsjournal',
        }),
        description: tr(language, {
          ru: `Пробы на коже и блоттере, оценки и вердикты (${project.journal.length})`,
          en: `Blotter & skin trials, verdicts & notes (${project.journal.length})`,
          it: `Prove su mouillette e pelle, esiti e note (${project.journal.length})`,
          es: `Pruebas en secante y piel, veredictos (${project.journal.length})`,
          de: `Streifen- & Hauttests, Bewertungen (${project.journal.length})`,
        }),
        sheetCount: journalSheets,
        emptyNote:
          project.journal.length === 0
            ? tr(language, {
                ru: 'Нет записей',
                en: 'No entries',
                it: 'Nessuna nota',
                es: 'Sin notas',
                de: 'Keine Einträge',
              })
            : undefined,
        icon: BookOpen,
      },
      {
        key: 'revisions',
        title: tr(language, {
          ru: 'История правок и вариации состава',
          en: 'Revision History & Variations',
          it: 'Cronologia Revisioni e Varianti',
          es: 'Historial de Revisiones y Variaciones',
          de: 'Revisionsverlauf & Variationen',
        }),
        description: tr(language, {
          ru: `Зафиксированные версии формулы V1..Vn и изменения (${revCount})`,
          en: `Saved formula versions V1..Vn and weight deltas (${revCount})`,
          it: `Versioni salvate V1..Vn e variazioni (${revCount})`,
          es: `Versiones guardadas V1..Vn y cambios (${revCount})`,
          de: `Gespeicherte Versionen V1..Vn und Änderungen (${revCount})`,
        }),
        sheetCount: revSheets,
        emptyNote:
          revCount === 0
            ? tr(language, {
                ru: 'Нет правок',
                en: 'No revisions',
                it: 'Nessuna revisione',
                es: 'Sin revisiones',
                de: 'Keine Versionen',
              })
            : undefined,
        icon: History,
      },
      {
        key: 'budget',
        title: tr(language, {
          ru: 'Себестоимость флакона и бюджет проекта',
          en: 'Unit Economics & Project Budget',
          it: 'Costi per Flacone e Budget Progetto',
          es: 'Costos por Frasco y Presupuesto',
          de: 'Flakonkalkulation & Projektbudget',
        }),
        description: tr(language, {
          ru: `Экономика 1 флакона, упаковка и смета закупок (${estCount} поз.)`,
          en: `1-bottle COGS, packaging & procurement estimate (${estCount} items)`,
          it: `Costi per 1 flacone, packaging e preventivo (${estCount} voci)`,
          es: `Coste por 1 frasco, envase y presupuesto (${estCount} partidas)`,
          de: `Kosten pro Flakon, Verpackung & Budget (${estCount} Pos.)`,
        }),
        sheetCount: 1,
        icon: Calculator,
      },
    ];
  }, [project, estimates, language]);

  const [selected, setSelected] = useState<ProjectPdfSectionKey[]>(ALL_PROJECT_PDF_SECTIONS);

  useEffect(() => {
    if (!open || !project) return;
    setSelected(
      options.filter((o) => o.sheetCount > 0).map((o) => o.key)
    );
  }, [open, project, options]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open || !project) return null;

  const selectedSet = new Set(selected);
  const totalSheets = options
    .filter((o) => selectedSet.has(o.key))
    .reduce((sum, o) => sum + o.sheetCount, 0);

  const toggleKey = (key: ProjectPdfSectionKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const formatSheetLabel = (count: number) => {
    if (language === 'ru') {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} лист`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} листа`;
      return `${count} листов`;
    }
    if (language === 'it') return count === 1 ? '1 foglio' : `${count} fogli`;
    if (language === 'es') return count === 1 ? '1 hoja' : `${count} hojas`;
    if (language === 'de') return count === 1 ? '1 Blatt' : `${count} Blätter`;
    return count === 1 ? '1 sheet' : `${count} sheets`;
  };

  return (
    <div
      className="print:hidden fixed inset-0 z-[70] flex items-center justify-center bg-[#181917]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-pages-modal-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-[#E4E4E0] bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EAEAE6] px-6 py-4">
          <div className="min-w-0">
            <h3 id="pdf-pages-modal-title" className="text-base font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Выбор страниц проекта для PDF',
                en: 'Select Project Pages for PDF',
                it: 'Seleziona Pagine del Progetto per PDF',
                es: 'Seleccionar Páginas del Proyecto para PDF',
                de: 'Projektseiten für PDF auswählen',
              })}
            </h3>
            <p className="mt-0.5 text-xs text-[#6B6D68] truncate">
              {project.code} · {project.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-[#575955] transition-colors hover:bg-[#F1F1EE] hover:text-[#181917]"
            aria-label={tr(language, {
              ru: 'Закрыть',
              en: 'Close',
              it: 'Chiudi',
              es: 'Cerrar',
              de: 'Schließen',
            })}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#EAEAE6] bg-[#FAFBF9] px-6 py-2.5">
          <button
            type="button"
            onClick={() =>
              setSelected(options.filter((o) => o.sheetCount > 0).map((o) => o.key))
            }
            className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#181917] hover:bg-[#F3F2F1]"
          >
            {tr(language, {
              ru: 'Выбрать все',
              en: 'Select all',
              it: 'Seleziona tutto',
              es: 'Seleccionar todo',
              de: 'Alle auswählen',
            })}
          </button>
          <button
            type="button"
            onClick={() => setSelected(['passport', 'formula'])}
            className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:bg-[#F3F2F1]"
          >
            {tr(language, {
              ru: 'Паспорт и формула',
              en: 'Passport & Formula',
              it: 'Passaporto e Formula',
              es: 'Ficha y Fórmula',
              de: 'Pass & Formel',
            })}
          </button>
          <button
            type="button"
            onClick={() => setSelected(['passport', 'olfactory', 'notes'])}
            className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:bg-[#F3F2F1]"
          >
            {tr(language, {
              ru: 'Пирамида и ноты',
              en: 'Pyramid & Notes',
              it: 'Piramide e Note',
              es: 'Pirámide y Notas',
              de: 'Pyramide & Noten',
            })}
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="ml-auto rounded-md px-2 py-1 text-[11px] font-medium text-[#6B6D68] hover:bg-[#EEEEEC] hover:text-[#181917]"
          >
            {tr(language, {
              ru: 'Снять все',
              en: 'Clear all',
              it: 'Deseleziona',
              es: 'Limpiar',
              de: 'Keine',
            })}
          </button>
        </div>

        {/* Section Checkboxes */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            const disabled = opt.sheetCount === 0;
            const checked = !disabled && selectedSet.has(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                disabled={disabled}
                onClick={() => toggleKey(opt.key)}
                className={`w-full flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                  disabled
                    ? 'border-[#EAEAE6] bg-[#FAFBF9] opacity-55 cursor-not-allowed'
                    : checked
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                      : 'border-[#E4E4E0] bg-white hover:bg-[#FAFBF9]'
                }`}
              >
                <span
                  className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                    checked
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                      : 'border-[#C8C8C2] bg-white text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    checked ? 'text-[var(--theme-accent)]' : 'text-[#6B6D68]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#181917]">{opt.title}</div>
                  <div className="text-[11px] text-[#6B6D68] truncate">{opt.description}</div>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10.5px] font-medium tabular-nums ${
                    disabled
                      ? 'bg-[#EEEEEC] text-[#787A74]'
                      : checked
                        ? 'bg-white text-[var(--theme-accent)] border border-[var(--theme-accent)]/30'
                        : 'bg-[#F3F2F1] text-[#575955]'
                  }`}
                >
                  {opt.emptyNote || formatSheetLabel(opt.sheetCount)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAEAE6] bg-[#FAFBF9] px-6 py-3.5">
          <div className="text-xs text-[#575955]">
            {tr(language, {
              ru: 'Выбрано листов A4:',
              en: 'Selected A4 sheets:',
              it: 'Fogli A4 selezionati:',
              es: 'Hojas A4 seleccionadas:',
              de: 'Ausgewählte A4-Blätter:',
            })}{' '}
            <strong className="font-mono text-[#181917] tabular-nums">{totalSheets}</strong>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[#E4E4E0] bg-white px-4 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
            >
              {tr(language, {
                ru: 'Отмена',
                en: 'Cancel',
                it: 'Annulla',
                es: 'Cancelar',
                de: 'Abbrechen',
              })}
            </button>
            <button
              type="button"
              disabled={totalSheets === 0}
              onClick={() => onConfirm(selected)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] disabled:opacity-45"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Сохранить в PDF',
                  en: 'Save PDF',
                  it: 'Salva PDF',
                  es: 'Guardar PDF',
                  de: 'PDF speichern',
                })}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
