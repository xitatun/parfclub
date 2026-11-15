import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  FileCode2,
  FileDown,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  FolderOpen,
  History,
  Maximize2,
  Moon,
  NotebookPen,
  PanelLeft,
  Printer,
  Redo2,
  RotateCcw,
  Save,
  Pencil,
  Search,
  Sun,
  Trash2,
  Undo2,
  X,
  Scale,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatUnit } from '../data/constants';
import { UI_TEXT, tr } from '../data/i18n';
import type {
  AppSettings,
  AppSection,
  Ingredient,
  MacerationBatch,
  PerfumeProject,
  ProjectTab,
  ViewSettings,
} from '../types/perfume';
import { getIngredientStockGrams, getMacerationStatus } from '../utils/calculations';
import { todayIsoDate } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface WordRibbonProps {
  activeSection: AppSection;
  activeProjectTab: ProjectTab;
  selectedProject: PerfumeProject | null;
  hasProjects: boolean;
  appSettings: AppSettings;
  onToggleColorMode: () => void;
  onOpenFileBackstage: () => void;
  onSelectSection: (section: AppSection) => void;
  onSelectProjectTab: (tab: ProjectTab) => void;
  onOpenProjectSectionTab: (tab: ProjectTab) => void;
  onCreateProject: () => void;
  onDuplicateActiveProject: () => void;
  onDeleteActiveProject: () => void;
  onUpdateProject?: (project: PerfumeProject) => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  onUndo: () => void;
  onRedo: () => void;
  historyPaneOpen?: boolean;
  onToggleHistoryPane?: () => void;
  viewSettings: ViewSettings;
  onChangeViewSettings: (patch: Partial<ViewSettings>) => void;
  onResetViewSettings: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  zoomPercent: number;
  onChangeZoom: (zoom: number) => void;
  onSaveCurrentProjectFile: () => void;
  onExportProjectPdf: () => void;
  onExportCurrentViewPdf?: () => void;
  onPrintCurrentView?: () => void;
  isCapturingExport?: boolean;
  onExportProjectWordDoc: () => void;
  onExportIngredientsExcel: () => void;
  onExportSalesExcel: () => void;
  onExportStudioBackup: () => void;
  onOpenFile: (file: File) => void;
  toastMessage: string | null;
  macerationReadyCount?: number;
  readyMacerations?: {
    project: PerfumeProject;
    batch: MacerationBatch;
    status: ReturnType<typeof getMacerationStatus>;
  }[];
  criticalStockItems?: Ingredient[];
  criticalStockGrams?: number;
  onOpenCriticalStock?: (ing?: Ingredient) => void;
  onOpenProject?: (projectId: string, tab?: ProjectTab) => void;
  onAcknowledgeMaceration?: (projectId: string, batchId: string) => void;
  onOpenFileHome?: () => void;
  onOpenQuickSearch: () => void;
  projectEstimatesCount?: number;
}

export function WordRibbon({
  activeSection,
  activeProjectTab,
  selectedProject,
  hasProjects,
  appSettings,
  onToggleColorMode,
  onOpenFileBackstage,
  onSelectSection,
  onSelectProjectTab,
  onOpenProjectSectionTab,
  onCreateProject,
  onDuplicateActiveProject,
  onDeleteActiveProject,
  onUpdateProject,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  onUndo,
  onRedo,
  historyPaneOpen = false,
  onToggleHistoryPane,
  viewSettings,
  onChangeViewSettings,
  onResetViewSettings,
  isFocusMode,
  onToggleFocusMode,
  zoomPercent,
  onChangeZoom,
  onSaveCurrentProjectFile,
  onExportProjectPdf,
  onExportCurrentViewPdf,
  onPrintCurrentView,
  isCapturingExport = false,
  onExportProjectWordDoc,
  onExportIngredientsExcel,
  onExportSalesExcel,
  onExportStudioBackup,
  onOpenFile,
  toastMessage,
  macerationReadyCount = 0,
  readyMacerations = [],
  criticalStockItems = [],
  onOpenCriticalStock,
  onOpenProject,
  onAcknowledgeMaceration,
  onOpenFileHome,
  onOpenQuickSearch,
  projectEstimatesCount = 0,
}: WordRibbonProps) {
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ribbonMode, setRibbonMode] = useState<'context' | 'view'>('context');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameCode, setRenameCode] = useState('');
  const saveMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const openInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedProject) {
      setRenameTitle(selectedProject.title);
      setRenameCode(selectedProject.code);
    }
  }, [selectedProject]);

  const t = UI_TEXT[appSettings.language];
  const effectiveMacerationCount =
    readyMacerations.length > 0 ? readyMacerations.length : macerationReadyCount;
  const totalNotificationsCount = effectiveMacerationCount + criticalStockItems.length;

  useEffect(() => {
    if (!saveMenuOpen && !notificationsOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (saveMenuOpen && saveMenuRef.current && !saveMenuRef.current.contains(target)) {
        setSaveMenuOpen(false);
      }
      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSaveMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [saveMenuOpen, notificationsOpen]);

  const studioTitle = appSettings.studioName?.trim() || t.brand;

  const docTitle =
    activeSection === 'projects' && selectedProject
      ? `${selectedProject.code} · ${selectedProject.title || t.untitled} — ${studioTitle}`
      : activeSection === 'ingredients'
        ? `${t.ingredientsTitle} — ${studioTitle}`
        : activeSection === 'budget'
          ? `${t.budgetTitle} — ${studioTitle}`
          : activeSection === 'statistics'
            ? `${t.statisticsTitle} — ${studioTitle}`
            : activeSection === 'sales'
              ? `${t.salesTitle} — ${studioTitle}`
              : activeSection === 'dilution'
                ? `${t.dilutionTitle} — ${studioTitle}`
                : `${t.homeProjectsTitle} — ${studioTitle}`;

  const activeRibbonTab =
    ribbonMode === 'view'
      ? 'view'
      : activeSection === 'budget'
        ? 'budget'
        : activeSection === 'statistics'
          ? 'statistics'
          : activeSection === 'sales'
            ? 'sales'
            : activeSection === 'dilution' ||
                (activeSection === 'projects' && selectedProject && activeProjectTab === 'dilution')
              ? 'dilution'
              : selectedProject && activeProjectTab === 'ingredients'
                ? 'ingredients'
                : selectedProject && activeProjectTab === 'olfactory'
                  ? 'olfactory'
                  : selectedProject && activeProjectTab === 'journal'
                    ? 'journal'
                    : 'home';

  return (
    <header className="print:hidden relative z-30 shrink-0 select-none bg-[#F3F2F1] border-b border-[#D2D0CE]">
      {/* Word Top Title Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 bg-[var(--theme-accent)] px-3 py-1.5 text-white transition-colors">
        {/* Top File & Quick Access Controls: File, Undo, Redo */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenFileHome || onOpenFileBackstage}
            className="inline-flex items-center gap-1.5 rounded bg-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/30 whitespace-nowrap"
          >
            <span>{t.fileTab}</span>
          </button>

          <span className="mx-0.5 hidden sm:inline-block h-4 w-px bg-white/25" aria-hidden="true" />

          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex items-center gap-1.5 rounded bg-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/30 whitespace-nowrap"
            title={t.newProject}
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.newProject}</span>
          </button>

          <span className="mx-0.5 hidden sm:inline-block h-4 w-px bg-white/25" aria-hidden="true" />

          {/* Undo */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="inline-flex items-center justify-center rounded p-1.5 text-white transition-colors hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent"
            title={`${t.undo} (Ctrl+Z)${undoCount > 0 ? ` · ${undoCount}` : ''}`}
            aria-label={t.undo}
          >
            <Undo2 className="h-4 w-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="inline-flex items-center justify-center rounded p-1.5 text-white transition-colors hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent"
            title={`${t.redo} (Ctrl+Y)${redoCount > 0 ? ` · ${redoCount}` : ''}`}
            aria-label={t.redo}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Centered Document Title */}
        <div className="min-w-0 flex-1 text-center">
          <span className="hidden lg:block truncate text-xs font-medium text-white/95">{docTitle}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {toastMessage && (
            <span className="hidden xl:inline rounded bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white whitespace-nowrap">
              {toastMessage}
            </span>
          )}
          <button
            type="button"
            onClick={onOpenQuickSearch}
            className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25 whitespace-nowrap shrink-0"
            title={`${t.quickSearchIngredients} (Ctrl+K)`}
            aria-label={`${t.quickSearchIngredients} (Ctrl+K)`}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden md:inline">{t.quickSearchIngredients}</span>
            <kbd className="hidden sm:inline rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white/95">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Popover (Maceration) */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                totalNotificationsCount > 0
                  ? 'bg-white/25 text-white hover:bg-white/35'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
              aria-expanded={notificationsOpen}
              aria-label={tr(appSettings.language, {
                ru: 'Уведомления',
                en: 'Notifications',
                it: 'Notifiche',
                es: 'Notificaciones',
                de: 'Benachrichtigungen',
              })}
              title={tr(appSettings.language, {
                ru: 'Уведомления: мацерация партий',
                en: 'Notifications: batch maceration',
                it: 'Notifiche: macerazione lotti',
                es: 'Notificaciones: maceración de lotes',
                de: 'Benachrichtigungen: Chargen-Reifung',
              })}
            >
              <BellRing className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden lg:inline">
                {tr(appSettings.language, {
                  ru: 'Уведомления',
                  en: 'Notifications',
                  it: 'Notifiche',
                  es: 'Notificaciones',
                  de: 'Hinweise',
                })}
              </span>
              {totalNotificationsCount > 0 && (
                <span className="rounded bg-white/25 px-1.5 py-0.2 font-mono text-[10px] font-semibold tabular-nums">
                  {totalNotificationsCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                data-capture-ignore="true"
                className="absolute right-0 top-full z-50 mt-1.5 w-80 sm:w-96 rounded-xl border border-[#D2D0CE] bg-white shadow-xl text-[#252423] overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[#EDEBE9] bg-[#FAF9F8] px-4 py-2.5">
                  <span className="text-xs font-semibold text-[#181917]">
                    {tr(appSettings.language, {
                      ru: 'Уведомления мастерской',
                      en: 'Studio Notifications',
                      it: 'Notifiche dello Studio',
                      es: 'Notificaciones del Taller',
                      de: 'Atelier-Benachrichtigungen',
                    })}
                  </span>
                  {onOpenFileHome && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        onOpenFileHome();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                    >
                      <span>
                        {tr(appSettings.language, {
                          ru: 'На Главную',
                          en: 'Open Home',
                          it: 'Apri Home',
                          es: 'Ir a Inicio',
                          de: 'Zur Startseite',
                        })}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#EDEBE9]">
                  {totalNotificationsCount === 0 ? (
                    <div className="flex items-center gap-2.5 px-4 py-5 text-xs text-[#605E5C]">
                      <CheckCircle2 className="h-4 w-4 text-[#15803D] shrink-0" />
                      <span>
                        {tr(appSettings.language, {
                          ru: 'Новых уведомлений нет — все запасы в норме и мацерации под контролем.',
                          en: 'No active alerts — stock levels and macerations are on track.',
                          it: 'Nessun avviso attivo — scorte e macerazioni sono nella norma.',
                          es: 'Sin avisos activos — el stock y las maceraciones están al día.',
                          de: 'Keine Hinweise — Bestände und Reifungen sind im grünen Bereich.',
                        })}
                      </span>
                    </div>
                  ) : (
                    <>
                      {criticalStockItems.length > 0 && (
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B45309]">
                              <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {tr(appSettings.language, {
                                  ru: `Заканчиваются ингредиенты (${criticalStockItems.length})`,
                                  en: `Ingredients running low (${criticalStockItems.length})`,
                                  it: `Ingredienti in esaurimento (${criticalStockItems.length})`,
                                  es: `Ingredientes agotándose (${criticalStockItems.length})`,
                                  de: `Rohstoffe werden knapp (${criticalStockItems.length})`,
                                })}
                              </span>
                            </span>
                            {onOpenCriticalStock && (
                              <button
                                type="button"
                                onClick={() => {
                                  setNotificationsOpen(false);
                                  onOpenCriticalStock();
                                }}
                                className="text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                              >
                                {tr(appSettings.language, {
                                  ru: 'Фильтр в базе →',
                                  en: 'Filter in catalog →',
                                  it: 'Filtra nel catalogo →',
                                  es: 'Filtrar en catálogo →',
                                  de: 'Im Katalog filtern →',
                                })}
                              </button>
                            )}
                          </div>

                          <div className="space-y-1">
                            {criticalStockItems.slice(0, 6).map((ing) => {
                              const stockVal = getIngredientStockGrams(ing) ?? 0;
                              return (
                                <button
                                  key={ing.id}
                                  type="button"
                                  onClick={() => {
                                    setNotificationsOpen(false);
                                    onOpenCriticalStock?.(ing);
                                  }}
                                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#FDE68A] dark:border-[#D97706]/40 bg-[#FFFBEB] px-2.5 py-1.5 text-left text-xs hover:bg-[#FEF3C7] transition-colors"
                                >
                                  <span className="truncate font-medium text-[#181917]">
                                    {ing.name}
                                  </span>
                                  <span className="font-mono text-[11px] font-semibold text-[#B45309] tabular-nums shrink-0">
                                    {stockVal} {formatUnit(ing.unit, appSettings.language)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {readyMacerations.length > 0 && (
                        <div className="p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#15803D]">
                            {tr(appSettings.language, {
                              ru: `Мацерация завершена (${readyMacerations.length})`,
                              en: `Maceration ready (${readyMacerations.length})`,
                              it: `Macerazione pronta (${readyMacerations.length})`,
                              es: `Maceración lista (${readyMacerations.length})`,
                              de: `Reifung abgeschlossen (${readyMacerations.length})`,
                            })}
                          </div>
                          <div className="space-y-1.5">
                            {readyMacerations.map(({ project: proj, batch }) => (
                              <div
                                key={`${proj.id}-${batch.id}`}
                                className="rounded-lg border border-[#A7F3D0] dark:border-[#107C41]/50 bg-[#ECFDF5] p-2.5 space-y-1.5"
                              >
                                <div className="text-xs font-medium text-[#181917] truncate">
                                  <span className="font-mono font-semibold text-[var(--theme-accent)] mr-1">
                                    {proj.code}
                                  </span>
                                  <span>{proj.title}</span>
                                  <span className="text-[#605E5C]"> — {batch.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {onOpenProject && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNotificationsOpen(false);
                                        onOpenProject(proj.id, 'journal');
                                      }}
                                      className="inline-flex items-center gap-1 rounded bg-[var(--theme-accent)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                                    >
                                      <NotebookPen className="h-3 w-3" />
                                      <span>
                                        {tr(appSettings.language, {
                                          ru: 'Проба',
                                          en: 'Trial',
                                          it: 'Prova',
                                          es: 'Prueba',
                                          de: 'Probe',
                                        })}
                                      </span>
                                    </button>
                                  )}
                                  {onAcknowledgeMaceration && (
                                    <button
                                      type="button"
                                      onClick={() => onAcknowledgeMaceration(proj.id, batch.id)}
                                      className="inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[#181917] hover:bg-[#F3F2F1]"
                                    >
                                      <Check className="h-3 w-3 text-[#15803D]" />
                                      <span>
                                        {tr(appSettings.language, {
                                          ru: 'Проверено',
                                          en: 'Checked',
                                          it: 'Verificato',
                                          es: 'Revisado',
                                          de: 'Geprüft',
                                        })}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleColorMode}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-white/95 transition-colors hover:bg-white/15"
            title={t.toggleColorMode}
            aria-label={t.toggleColorMode}
          >
            {appSettings.colorMode === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
            <span className="hidden xl:inline">
              {appSettings.colorMode === 'dark' ? t.lightMode : t.darkMode}
            </span>
          </button>
          <div className="[&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:bg-white/20 [&_svg]:text-white">
            <PWAInstallButton language={appSettings.language} />
          </div>
        </div>
      </div>

      {/* Ribbon Tab Strip */}
      <div className="flex items-center gap-1 bg-[#F3F2F1] px-3 pt-1 border-b border-[#E1DFDD] overflow-x-auto overflow-y-hidden no-scrollbar">
        {/* Ribbon Tabs */}
        <button
          type="button"
          onClick={() => {
            setRibbonMode('context');
            onSelectSection('projects');
          }}
          className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'projects' && !selectedProject
              ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
              : 'border-transparent text-[#323130] hover:bg-white/60'
          }`}
        >
          {t.ribbonHome}
        </button>

        {selectedProject && (
          <>
            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('formula');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'formula'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: 'Главное',
                en: 'Home',
                it: 'Principale',
                es: 'Principal',
                de: 'Start',
              })}
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('ingredients');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'ingredients'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: `Ингредиенты (${selectedProject.components.length})`,
                en: `Ingredients (${selectedProject.components.length})`,
                it: `Ingredienti (${selectedProject.components.length})`,
                es: `Ingredientes (${selectedProject.components.length})`,
                de: `Rohstoffe (${selectedProject.components.length})`,
              })}
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('olfactory');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'olfactory'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: 'Ольфакторная карта',
                en: 'Olfactory Map',
                it: 'Mappa Olfattiva',
                es: 'Mapa Olfativo',
                de: 'Duftpyramide',
              })}
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('journal');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'journal'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: `Записи (${selectedProject.journal.length})`,
                en: `Notes (${selectedProject.journal.length})`,
                it: `Note (${selectedProject.journal.length})`,
                es: `Notas (${selectedProject.journal.length})`,
                de: `Notizen (${selectedProject.journal.length})`,
              })}
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('cost');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'cost'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: `Смета проекта (${projectEstimatesCount})`,
                en: `Project Budget (${projectEstimatesCount})`,
                it: `Budget Progetto (${projectEstimatesCount})`,
                es: `Presupuesto (${projectEstimatesCount})`,
                de: `Projektbudget (${projectEstimatesCount})`,
              })}
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('dilution');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                ribbonMode === 'context' && activeProjectTab === 'dilution'
                  ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)] font-semibold'
                  : 'border-transparent text-[#323130] hover:bg-white/60'
              }`}
            >
              {tr(appSettings.language, {
                ru: 'Разбавление',
                en: 'Dilution',
                it: 'Diluizione',
                es: 'Dilución',
                de: 'Verdünnung',
              })}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setRibbonMode('view')}
          className={`px-3.5 py-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeRibbonTab === 'view'
              ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)]'
              : 'border-transparent text-[#323130] hover:bg-white/60'
          }`}
        >
          {t.ribbonView}
        </button>
      </div>

      {/* Ribbon Command Strip (White Toolbar with Command Groups) */}
      {ribbonMode === 'view' ? (
        <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2 text-[#323130]">
          {/* View Group 1 */}
          <div className="flex items-center gap-1 pr-3 border-r border-[#E1DFDD]">


            {activeSection === 'projects' && selectedProject && onToggleHistoryPane && (
              <button
                type="button"
                onClick={onToggleHistoryPane}
                className={`flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] ${
                  historyPaneOpen
                    ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                    : ''
                }`}
              >
                <History className="h-4 w-4 text-[var(--theme-accent)]" />
                <span className="mt-0.5 whitespace-nowrap">{t.projectHistoryPane}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleFocusMode}
              className={`flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] ${
                isFocusMode
                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                  : ''
              }`}
            >
              <Eye className="h-4 w-4 text-[var(--theme-accent)]" />
              <span className="mt-0.5 whitespace-nowrap">{t.viewCleanSheet}</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeViewSettings({ widePageLayout: !viewSettings.widePageLayout })}
              className={`flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] ${
                viewSettings.widePageLayout
                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                  : ''
              }`}
            >
              <Maximize2 className="h-4 w-4 text-[#605E5C]" />
              <span className="mt-0.5 whitespace-nowrap">{t.viewFullWidth}</span>
            </button>

            <button
              type="button"
              onClick={onResetViewSettings}
              className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1]"
            >
              <RotateCcw className="h-4 w-4 text-[#605E5C]" />
              <span className="mt-0.5 whitespace-nowrap">{t.viewReset}</span>
            </button>
          </div>

          {/* View Group 2 */}
          <div className="flex flex-col gap-1 pr-3 border-r border-[#E1DFDD] text-xs">

            <label className="inline-flex items-center gap-2 cursor-pointer select-none hover:text-[var(--theme-accent)]">
              <input
                type="checkbox"
                checked={viewSettings.showStatusBar}
                onChange={(e) => onChangeViewSettings({ showStatusBar: e.target.checked })}
                className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
              />
              <span>{t.viewShowStatus}</span>
            </label>
          </div>

          {/* View Group 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none hover:text-[var(--theme-accent)]">
              <input
                type="checkbox"
                checked={viewSettings.showPageDescriptions}
                onChange={(e) => onChangeViewSettings({ showPageDescriptions: e.target.checked })}
                className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
              />
              <span>{t.viewShowDescriptions}</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none hover:text-[var(--theme-accent)]">
              <input
                type="checkbox"
                checked={viewSettings.showProjectMetrics}
                onChange={(e) => onChangeViewSettings({ showProjectMetrics: e.target.checked })}
                className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
              />
              <span>{t.viewShowMetrics}</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none hover:text-[var(--theme-accent)]">
              <input
                type="checkbox"
                checked={viewSettings.showIngredientSpecsExtra}
                onChange={(e) =>
                  onChangeViewSettings({ showIngredientSpecsExtra: e.target.checked })
                }
                className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
              />
              <span>{t.viewShowExtraCols}</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none hover:text-[var(--theme-accent)]">
              <input
                type="checkbox"
                checked={viewSettings.showIngredientPurchaseBar}
                onChange={(e) =>
                  onChangeViewSettings({ showIngredientPurchaseBar: e.target.checked })
                }
                className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
              />
              <span>{t.viewShowUrlBar}</span>
            </label>
          </div>
        </div>
      ) : selectedProject && activeProjectTab === 'ingredients' ? (
        <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2 text-[#323130]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('project-ingredients-metrics');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                  const fallback = document.querySelector('h2');
                  fallback?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="flex flex-col items-center justify-center rounded px-3 py-1 text-[11px] hover:bg-[#F3F2F1] text-[var(--theme-accent)] font-semibold transition-colors"
              title={tr(appSettings.language, {
                ru: 'Вес парфюмерной базы и спецификация сырья',
                en: 'Perfume base weight and raw material specs',
                it: 'Peso base profumo e specifiche materie prime',
                es: 'Peso base del perfume y especificaciones',
                de: 'Parfüm-Basisgewicht und Rohstoffspezifikation',
              })}
            >
              <Scale className="h-4 w-4 text-[var(--theme-accent)]" />
              <span className="mt-0.5 whitespace-nowrap">
                {tr(appSettings.language, {
                  ru: 'Вес парфюмерной базы',
                  en: 'Perfume Base Weight',
                  it: 'Peso Base Profumo',
                  es: 'Peso Base Perfume',
                  de: 'Parfüm-Basisgewicht',
                })}
              </span>
            </button>
          </div>
        </div>
      ) : selectedProject && activeProjectTab === 'formula' ? (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2 text-[#323130]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Document & File Operations */}
            <div className="flex items-center gap-1">
              {/* Сохранить (with Export Dropdown) */}
              <div className="relative" ref={saveMenuRef}>
                <button
                  type="button"
                  onClick={() => setSaveMenuOpen((v) => !v)}
                  className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] text-[#323130] transition-colors"
                  title={`${t.save}: ${selectedProject.title}`}
                  aria-label={t.save}
                  aria-expanded={saveMenuOpen}
                >
                  <div className="flex items-center gap-0.5">
                    <Save className="h-4 w-4 text-[var(--theme-accent)]" />
                    <ChevronDown className="h-2.5 w-2.5 text-[#605E5C]" />
                  </div>
                  <span className="mt-0.5 whitespace-nowrap">{t.save}</span>
                </button>

                {saveMenuOpen && (
                  <div
                    data-capture-ignore="true"
                    className="absolute left-0 top-full z-50 mt-1.5 w-76 rounded-lg border border-[#D2D0CE] bg-white py-1.5 shadow-lg text-[#252423]"
                  >
                    <button
                      type="button"
                      disabled={isCapturingExport}
                      onClick={() => {
                        if (onExportCurrentViewPdf) {
                          onExportCurrentViewPdf();
                        } else {
                          onExportProjectPdf();
                        }
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1] disabled:opacity-50"
                    >
                      <FileDown className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
                      <div>
                        <div className="font-medium">PDF (.pdf)</div>
                        <div className="text-[11px] text-[#605E5C]">
                          {tr(appSettings.language, {
                            ru: 'Чистый многолистовой документ без интерфейса',
                            en: 'Clean multi-sheet document without UI chrome',
                            it: 'Documento multipagina pulito senza interfaccia',
                            es: 'Documento multipágina limpio sin interfaz',
                            de: 'Sauberes mehrseitiges PDF-Dokument ohne UI',
                          })}
                        </div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-[#EDEBE9]" />

                    <button
                      type="button"
                      onClick={() => {
                        onSaveCurrentProjectFile();
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1]"
                    >
                      <Save className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
                      <div>
                        <div className="font-medium">JSON (.json)</div>
                        <div className="text-[11px] text-[#605E5C]">
                          {tr(appSettings.language, {
                            ru: 'Файл проекта для повторного открытия',
                            en: 'Portable project file',
                            it: 'File progetto portatile',
                            es: 'Archivo de proyecto portable',
                            de: 'Portierbare Projektdatei',
                          })}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onExportProjectWordDoc();
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1]"
                    >
                      <FileText className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
                      <div>
                        <div className="font-medium">Word (.doc)</div>
                        <div className="text-[11px] text-[#605E5C]">Microsoft Word</div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-[#EDEBE9]" />

                    <button
                      type="button"
                      onClick={() => {
                        onExportIngredientsExcel();
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1]"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-[#107C41] shrink-0" />
                      <div>
                        <div className="font-medium">Excel (.xlsx)</div>
                        <div className="text-[11px] text-[#605E5C]">{t.ingredientsTitle}</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onExportSalesExcel();
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1]"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-[#107C41] shrink-0" />
                      <div>
                        <div className="font-medium">Excel (.xlsx)</div>
                        <div className="text-[11px] text-[#605E5C]">{t.salesTitle}</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onExportStudioBackup();
                        setSaveMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-[#F3F2F1]"
                    >
                      <FileCode2 className="h-4 w-4 text-[#605E5C] shrink-0" />
                      <div>
                        <div className="font-medium">Backup (.json)</div>
                        <div className="text-[11px] text-[#605E5C]">{studioTitle}</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Печать */}
              <button
                type="button"
                disabled={isCapturingExport}
                onClick={() => (onPrintCurrentView ? onPrintCurrentView() : window.print())}
                className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] text-[#323130] disabled:opacity-50 transition-colors"
                title={tr(appSettings.language, {
                  ru: 'Печать открытой вкладки (как скриншот)',
                  en: 'Print active tab screenshot',
                  it: 'Stampa schermata della scheda attiva',
                  es: 'Imprimir captura de la pestaña activa',
                  de: 'Screenshot des aktiven Tabs drucken',
                })}
                aria-label={t.print}
              >
                <Printer className="h-4 w-4 text-[#605E5C]" />
                <span className="mt-0.5 whitespace-nowrap">{t.print}</span>
              </button>
            </div>

            {/* Divider between document operations and project management */}
            <div className="h-6 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />

            {/* Project Management Operations */}
            <div className="flex items-center gap-1">
              {/* Переименовать проект */}
              <button
                type="button"
                onClick={() => {
                  setRenameTitle(selectedProject.title);
                  setRenameCode(selectedProject.code);
                  setRenameModalOpen(true);
                }}
                className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] text-[#323130] transition-colors"
                title={tr(appSettings.language, {
                  ru: 'Переименовать проект',
                  en: 'Rename project',
                  it: 'Rinomina progetto',
                  es: 'Renombrar proyecto',
                  de: 'Projekt umbenennen',
                })}
              >
                <Pencil className="h-4 w-4 text-[#605E5C]" />
                <span className="mt-0.5 whitespace-nowrap">
                  {tr(appSettings.language, {
                    ru: 'Переименовать',
                    en: 'Rename',
                    it: 'Rinomina',
                    es: 'Renombrar',
                    de: 'Umbenennen',
                  })}
                </span>
              </button>

              {/* Копия */}
              <button
                type="button"
                onClick={onDuplicateActiveProject}
                className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] text-[#323130] transition-colors"
                title={t.copyProject}
              >
                <Copy className="h-4 w-4 text-[#605E5C]" />
                <span className="mt-0.5 whitespace-nowrap">{t.copyProject}</span>
              </button>

              {/* Удалить */}
              <button
                type="button"
                onClick={onDeleteActiveProject}
                className="flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                title={t.deleteProject}
              >
                <Trash2 className="h-4 w-4" />
                <span className="mt-0.5 whitespace-nowrap">{t.deleteProject}</span>
              </button>
            </div>
          </div>

          {/* Right-aligned Revision History */}
          {onToggleHistoryPane && (
            <div className="ml-auto flex items-center pl-3 border-l border-[#E1DFDD]">
              <button
                type="button"
                onClick={onToggleHistoryPane}
                className={`flex flex-col items-center justify-center rounded px-2.5 py-1 text-[11px] hover:bg-[#F3F2F1] transition-colors ${
                  historyPaneOpen
                    ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] font-semibold'
                    : 'text-[#323130]'
                }`}
                title={tr(appSettings.language, {
                  ru: 'История правок',
                  en: 'Edit History',
                  it: 'Cronologia',
                  es: 'Historial',
                  de: 'Verlauf',
                })}
              >
                <History className="h-4 w-4 text-[var(--theme-accent)]" />
                <span className="mt-0.5 whitespace-nowrap">
                  {tr(appSettings.language, {
                    ru: 'История правок',
                    en: 'Edit History',
                    it: 'Cronologia',
                    es: 'Historial',
                    de: 'Verlauf',
                  })}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Rename Project Modal */}
      {renameModalOpen && selectedProject && (
        <div
          data-capture-ignore="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRenameModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#D2D0CE] bg-white p-5 shadow-2xl text-[#252423]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setRenameModalOpen(false);
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEBE9]">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-[var(--theme-accent)]" />
                <h3 className="text-sm font-semibold text-[#181917]">
                  {tr(appSettings.language, {
                    ru: 'Переименовать проект',
                    en: 'Rename Project',
                    it: 'Rinomina Progetto',
                    es: 'Renombrar Proyecto',
                    de: 'Projekt umbenennen',
                  })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRenameModalOpen(false)}
                className="rounded p-1 text-[#797775] hover:bg-[#F3F2F1] hover:text-[#181917] transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmedTitle = renameTitle.trim();
                if (!trimmedTitle) return;
                if (onUpdateProject) {
                  onUpdateProject({
                    ...selectedProject,
                    title: trimmedTitle,
                    code: renameCode.trim() || selectedProject.code,
                    updatedAt: todayIsoDate(),
                  });
                }
                setRenameModalOpen(false);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-[#605E5C] mb-1">
                  {tr(appSettings.language, {
                    ru: 'Название проекта / аромата',
                    en: 'Project / Fragrance title',
                    it: 'Nome del progetto / fragranza',
                    es: 'Nombre del proyecto / fragancia',
                    de: 'Projekt- / Duftname',
                  })}
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full rounded border border-[#D2D0CE] px-3 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
                  placeholder={tr(appSettings.language, {
                    ru: 'Например, Розовый вечер, Santal 33...',
                    en: 'e.g., Rose Evening, Santal 33...',
                    it: 'es. Rose Evening, Santal 33...',
                    es: 'ej. Noche de Rosas, Santal 33...',
                    de: 'z.B. Rosenabend, Santal 33...',
                  })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#605E5C] mb-1">
                  {tr(appSettings.language, {
                    ru: 'Код / Артикул',
                    en: 'Code / Article',
                    it: 'Codice / Articolo',
                    es: 'Código / Artículo',
                    de: 'Code / Artikel',
                  })}
                </label>
                <input
                  type="text"
                  value={renameCode}
                  onChange={(e) => setRenameCode(e.target.value)}
                  className="w-full rounded border border-[#D2D0CE] px-3 py-1.5 text-xs font-mono text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
                  placeholder="AE-01"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEBE9]">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="rounded border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1] transition-colors"
                >
                  {tr(appSettings.language, {
                    ru: 'Отмена',
                    en: 'Cancel',
                    it: 'Annulla',
                    es: 'Cancelar',
                    de: 'Abbrechen',
                  })}
                </button>
                <button
                  type="submit"
                  disabled={!renameTitle.trim()}
                  className="rounded bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-95 disabled:opacity-50 transition-opacity"
                >
                  {tr(appSettings.language, {
                    ru: 'Сохранить',
                    en: 'Save',
                    it: 'Salva',
                    es: 'Guardar',
                    de: 'Speichern',
                  })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input
        ref={openInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onOpenFile(file);
            e.target.value = '';
          }
        }}
      />
    </header>
  );
}
