import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  Copy,
  Droplets,
  Eye,
  FileCode2,
  FileDown,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  History,
  Home,
  Layers,
  Maximize2,
  Moon,
  NotebookPen,
  Pencil,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  Save,
  Scale,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CONCENTRATION_TARGET_PERCENT,
  DEFAULT_BOTTLE_VOLUMES_ML,
  PROJECT_STATUS_LABELS,
  formatUnit,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getNoteTierShort,
  getOlfactoryFamilyShort,
  getProjectStatusLabel,
} from '../data/constants';
import {
  FRATERWORKS_REFERENCE_MATERIALS,
  getLocalizedFacetName,
} from '../data/fraterworksProfiles';
import { UI_TEXT, tr } from '../data/i18n';
import type {
  AppSection,
  AppSettings,
  ConcentrationType,
  FormulaComponent,
  Ingredient,
  LibraryIngredient,
  MacerationBatch,
  NoteTier,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectStatus,
  ProjectTab,
  ViewSettings,
} from '../types/perfume';
import {
  formatGrams,
  getEffectiveConcentrateGrams,
  getIngredientStockGrams,
  getMacerationStatus,
  scaleProjectByConcentrateWeight,
} from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';
import { CartAddPayload, SuggestedComponentsModal } from './SuggestedComponentsModal';

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
  onOpenHistoryTab?: (tab: 'history' | 'variants') => void;
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
  onOpenBottleSettings?: () => void;
  onOpenQuickSearch: () => void;
  projectEstimatesCount?: number;
  ingredients?: Ingredient[];
  library?: LibraryIngredient[];
  estimates?: ProjectEstimateItem[];
  selectedVariantId?: string | null;
  onAddComponentToFormula?: (comp: FormulaComponent) => void;
  onRequestClearAllComponents?: () => void;
  onAddToCart?: (payload: CartAddPayload, projectId?: string) => void;
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
  onOpenHistoryTab,
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
  onOpenBottleSettings,
  onOpenQuickSearch,
  projectEstimatesCount = 0,
  ingredients = [],
  library = [],
  estimates = [],
  selectedVariantId = null,
  onAddComponentToFormula,
  onRequestClearAllComponents,
  onAddToCart,
}: WordRibbonProps) {
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [concMenuOpen, setConcMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [concTypeMenuOpen, setConcTypeMenuOpen] = useState(false);
  const [bottleMenuOpen, setBottleMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddQuery, setQuickAddQuery] = useState('');
  const [quickAddPct, setQuickAddPct] = useState('5');
  const [quickAddCustomTier, setQuickAddCustomTier] = useState<NoteTier>('heart');
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
  const [ribbonMode, setRibbonMode] = useState<'context' | 'view'>('context');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameCode, setRenameCode] = useState('');
  const defaultConcGrams = appSettings.defaultConcentrateGrams ?? 10;
  const bottlePresetsMl =
    appSettings.bottleVolumesMl && appSettings.bottleVolumesMl.length > 0
      ? appSettings.bottleVolumesMl
      : DEFAULT_BOTTLE_VOLUMES_ML;
  const activeVariant =
    selectedProject && selectedVariantId
      ? (selectedProject.variants || []).find((v) => v.id === selectedVariantId) || null
      : null;
  const activeComponents = activeVariant ? activeVariant.components : selectedProject?.components || [];
  const activeTotalWeightGrams = useMemo(
    () => activeComponents.reduce((sum, c) => sum + (Number(c.weightGrams) || 0), 0),
    [activeComponents]
  );
  const effectiveConcGrams = selectedProject
    ? getEffectiveConcentrateGrams(
        {
          components: activeComponents,
          targetConcentrateGrams: selectedProject.targetConcentrateGrams,
        },
        defaultConcGrams
      )
    : defaultConcGrams;
  const [concDraft, setConcDraft] = useState(String(effectiveConcGrams));
  const [bottleDraft, setBottleDraft] = useState(String(selectedProject?.targetBottleMl ?? 30));
  const [scaleDraft, setScaleDraft] = useState(
    activeTotalWeightGrams > 0 ? String(Number(activeTotalWeightGrams.toFixed(1))) : '30'
  );
  const saveMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const concMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const concTypeMenuRef = useRef<HTMLDivElement>(null);
  const bottleMenuRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const openInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedProject) {
      setRenameTitle(selectedProject.title);
      setRenameCode(selectedProject.code);
      setConcDraft(String(effectiveConcGrams));
      setBottleDraft(String(selectedProject.targetBottleMl));
      setScaleDraft(
        activeTotalWeightGrams > 0 ? String(Number(activeTotalWeightGrams.toFixed(1))) : '30'
      );
    }
  }, [selectedProject, effectiveConcGrams, activeTotalWeightGrams]);

  const t = UI_TEXT[appSettings.language];
  const language = appSettings.language;
  const effectiveMacerationCount =
    readyMacerations.length > 0 ? readyMacerations.length : macerationReadyCount;
  const totalNotificationsCount = effectiveMacerationCount + criticalStockItems.length;

  useEffect(() => {
    if (
      !saveMenuOpen &&
      !notificationsOpen &&
      !concMenuOpen &&
      !statusMenuOpen &&
      !concTypeMenuOpen &&
      !bottleMenuOpen &&
      !quickAddOpen
    )
      return;
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
      if (concMenuOpen && concMenuRef.current && !concMenuRef.current.contains(target)) {
        setConcMenuOpen(false);
      }
      if (statusMenuOpen && statusMenuRef.current && !statusMenuRef.current.contains(target)) {
        setStatusMenuOpen(false);
      }
      if (concTypeMenuOpen && concTypeMenuRef.current && !concTypeMenuRef.current.contains(target)) {
        setConcTypeMenuOpen(false);
      }
      if (bottleMenuOpen && bottleMenuRef.current && !bottleMenuRef.current.contains(target)) {
        setBottleMenuOpen(false);
      }
      if (quickAddOpen && quickAddRef.current && !quickAddRef.current.contains(target)) {
        setQuickAddOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSaveMenuOpen(false);
        setNotificationsOpen(false);
        setConcMenuOpen(false);
        setStatusMenuOpen(false);
        setConcTypeMenuOpen(false);
        setBottleMenuOpen(false);
        setQuickAddOpen(false);
        quickAddInputRef.current?.blur();
      }
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [
    saveMenuOpen,
    notificationsOpen,
    concMenuOpen,
    statusMenuOpen,
    concTypeMenuOpen,
    bottleMenuOpen,
    quickAddOpen,
  ]);

  const applyConcentrateWeight = (nextGrams: number) => {
    if (!selectedProject || !onUpdateProject) return;
    const clamped = Math.max(0.1, Math.min(5000, nextGrams));
    if (activeVariant) {
      const prevBase = effectiveConcGrams > 0 ? effectiveConcGrams : defaultConcGrams;
      const ratio = clamped / prevBase;
      const hasAromatic = activeVariant.components.some(
        (c) => c.tier !== 'solvent' && (Number(c.weightGrams) || 0) > 0
      );
      const scaledComponents = hasAromatic
        ? activeVariant.components.map((c) =>
            c.tier === 'solvent'
              ? c
              : { ...c, weightGrams: Number((Math.max(0, c.weightGrams) * ratio).toFixed(3)) }
          )
        : activeVariant.components;
      onUpdateProject({
        ...selectedProject,
        targetConcentrateGrams: Number(clamped.toFixed(2)),
        variants: (selectedProject.variants || []).map((v) =>
          v.id === activeVariant.id ? { ...v, components: scaledComponents } : v
        ),
        updatedAt: todayIsoDate(),
      });
      setConcDraft(String(Number(clamped.toFixed(2))));
      return;
    }
    const scaled = scaleProjectByConcentrateWeight(
      selectedProject,
      clamped,
      defaultConcGrams,
      todayIsoDate()
    );
    onUpdateProject(scaled);
    setConcDraft(String(scaled.targetConcentrateGrams ?? clamped));
  };

  const applyBottleVolume = (nextMl: number) => {
    if (!selectedProject || !onUpdateProject) return;
    const clamped = Math.max(1, Math.min(2000, Math.round(nextMl)));
    onUpdateProject({
      ...selectedProject,
      targetBottleMl: clamped,
      updatedAt: todayIsoDate(),
    });
    setBottleDraft(String(clamped));
  };

  const applyScaleFormula = () => {
    if (!selectedProject || !onUpdateProject) return;
    const target = Number(scaleDraft);
    if (!Number.isFinite(target) || target <= 0 || activeTotalWeightGrams <= 0) return;
    const ratio = target / activeTotalWeightGrams;
    if (activeVariant) {
      onUpdateProject({
        ...selectedProject,
        variants: (selectedProject.variants || []).map((v) =>
          v.id === activeVariant.id
            ? {
                ...v,
                components: v.components.map((c) => ({
                  ...c,
                  weightGrams: Number((c.weightGrams * ratio).toFixed(3)),
                })),
              }
            : v
        ),
        updatedAt: todayIsoDate(),
      });
      return;
    }
    onUpdateProject({
      ...selectedProject,
      components: selectedProject.components.map((c) => ({
        ...c,
        weightGrams: Number((c.weightGrams * ratio).toFixed(3)),
      })),
      updatedAt: todayIsoDate(),
    });
  };

  const updateActiveFormulaComponents = (
    updater: (comps: FormulaComponent[]) => FormulaComponent[]
  ) => {
    if (!selectedProject || !onUpdateProject) return;
    if (activeVariant) {
      onUpdateProject({
        ...selectedProject,
        variants: (selectedProject.variants || []).map((v) =>
          v.id === activeVariant.id ? { ...v, components: updater(v.components) } : v
        ),
        updatedAt: todayIsoDate(),
      });
      return;
    }
    onUpdateProject({
      ...selectedProject,
      components: updater(selectedProject.components),
      updatedAt: todayIsoDate(),
    });
  };

  const quickAddMatches = useMemo(() => {
    if (!quickAddOpen) {
      return { ingMatches: [] as Ingredient[], libMatches: [] as LibraryIngredient[], fwMatches: [] as typeof FRATERWORKS_REFERENCE_MATERIALS };
    }
    const q = quickAddQuery.trim().toLowerCase();
    const studioNames = new Set(ingredients.map((i) => i.name.trim().toLowerCase()));
    const ingMatches = (
      q
        ? ingredients.filter(
            (ing) =>
              ing.name.toLowerCase().includes(q) ||
              (ing.bottleLabel || '').toLowerCase().includes(q) ||
              (ing.inciOrCas || '').toLowerCase().includes(q) ||
              (ing.olfactoryNotes || '').toLowerCase().includes(q)
          )
        : ingredients.filter((ing) => ing.status === 'in_stock')
    ).slice(0, q ? 12 : 8);

    const libMatches = q
      ? library
          .filter(
            (l) =>
              !studioNames.has(l.name.trim().toLowerCase()) &&
              (l.name.toLowerCase().includes(q) ||
                (l.inciOrCas || '').toLowerCase().includes(q) ||
                l.scentDescription.toLowerCase().includes(q))
          )
          .slice(0, 12)
      : library.filter((l) => !studioNames.has(l.name.trim().toLowerCase())).slice(0, 5);

    const fwMatches = q
      ? FRATERWORKS_REFERENCE_MATERIALS.filter(
          (fw) =>
            fw.name.toLowerCase().includes(q) ||
            (fw.inciOrCas || '').toLowerCase().includes(q) ||
            fw.synonyms.some((s) => s.toLowerCase().includes(q)) ||
            fw.scentBreakdown.some((b) => b.facet.toLowerCase().includes(q))
        ).slice(0, 8)
      : [];

    return { ingMatches, libMatches, fwMatches };
  }, [quickAddOpen, quickAddQuery, ingredients, library]);

  const parsedQuickAddPct = Math.max(0.01, Math.min(100, Number(quickAddPct) || 5));
  const quickAddComputedGrams = Number(((effectiveConcGrams * parsedQuickAddPct) / 100).toFixed(2));

  const submitQuickAddFromIngredient = (ing: Ingredient) => {
    if (!onAddComponentToFormula) return;
    const unitCost = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    onAddComponentToFormula({
      id: generateId('fc'),
      ingredientId: ing.id,
      name: ing.name,
      tier: ing.tier,
      family: ing.family,
      dilutionPercent: Math.min(100, Math.max(0.01, ing.dilutionPercent || 100)),
      weightGrams: Math.max(0.01, quickAddComputedGrams),
      costPerGram: Number(unitCost.toFixed(2)),
      odorImpact: ing.odorImpact,
      substantivityHours: ing.substantivityHours,
      scentBreakdown: ing.scentBreakdown,
      note: ing.olfactoryNotes ? ing.olfactoryNotes.slice(0, 70) : undefined,
    });
    setQuickAddQuery('');
    setQuickAddOpen(false);
  };

  const submitQuickAddFromLibrary = (libItem: LibraryIngredient) => {
    if (!onAddComponentToFormula) return;
    onAddComponentToFormula({
      id: generateId('fc'),
      name: libItem.name,
      tier: libItem.tier,
      family: libItem.family,
      dilutionPercent: 100,
      weightGrams: Math.max(0.01, quickAddComputedGrams),
      costPerGram: 0,
      odorImpact: libItem.odorImpact,
      substantivityHours: libItem.substantivityHours,
      scentBreakdown: libItem.scentBreakdown,
      note: libItem.scentDescription ? libItem.scentDescription.slice(0, 70) : undefined,
    });
    setQuickAddQuery('');
    setQuickAddOpen(false);
  };

  const submitQuickAddFromFraterworks = (fw: (typeof FRATERWORKS_REFERENCE_MATERIALS)[number]) => {
    if (!onAddComponentToFormula) return;
    onAddComponentToFormula({
      id: generateId('fc'),
      name: fw.name,
      tier: fw.tier,
      family: fw.family,
      dilutionPercent: 100,
      weightGrams: Math.max(0.01, quickAddComputedGrams),
      costPerGram: 0,
      odorImpact: fw.odorImpact,
      substantivityHours: fw.substantivityHours,
      scentBreakdown: fw.scentBreakdown,
      note: fw.scentBreakdown.map((b) => `${b.facet} ${b.percent}%`).join(', '),
    });
    setQuickAddQuery('');
    setQuickAddOpen(false);
  };

  const submitQuickAddCustom = () => {
    const clean = quickAddQuery.trim();
    if (!clean || !onAddComponentToFormula) return;
    onAddComponentToFormula({
      id: generateId('fc'),
      name: clean,
      tier: quickAddCustomTier,
      family: quickAddCustomTier === 'solvent' ? 'aquatic' : 'woody',
      dilutionPercent: 100,
      weightGrams: Math.max(0.01, quickAddComputedGrams),
      costPerGram: 0,
    });
    setQuickAddQuery('');
    setQuickAddOpen(false);
  };

  const tabBtnClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t-md border-t-2 border-x transition-colors whitespace-nowrap ${
      isActive
        ? 'border-t-[var(--theme-accent)] border-x-[#D2D0CE] bg-white text-[var(--theme-accent)] font-semibold -mb-px pb-[7px] relative z-10'
        : 'border-transparent text-[#323130] font-medium hover:bg-white/75 hover:text-[#181917]'
    }`;

  const level3BtnClass =
    'w-[96px] h-[48px] flex flex-col items-center justify-center rounded px-1.5 py-1 text-[11px] leading-tight transition-colors shrink-0';

  const iconOnlyBtnClass =
    'group relative w-[40px] h-[40px] flex items-center justify-center rounded border border-transparent transition-colors shrink-0';

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
                    : selectedProject && activeProjectTab === 'cost'
                      ? 'cost'
                      : selectedProject && activeProjectTab === 'management'
                        ? 'management'
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

      {/* Ribbon Tab Strip (Level 2 — Unified Word Ribbon Tabs) */}
      <div className="flex items-end gap-0.5 bg-[#F3F2F1] px-3 pt-1.5 border-b border-[#E1DFDD] overflow-x-auto overflow-y-hidden no-scrollbar">
        <button
          type="button"
          onClick={() => {
            setRibbonMode('context');
            onSelectSection('projects');
          }}
          className={tabBtnClass(ribbonMode === 'context' && activeSection === 'projects' && !selectedProject)}
        >
          <Home className="h-3.5 w-3.5 shrink-0 opacity-80" />
          <span>{t.ribbonHome}</span>
        </button>

        {selectedProject && (
          <>
            <span className="mx-1 mb-1.5 h-4 w-px bg-[#D2D0CE] shrink-0" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('formula');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'formula')}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Главное',
                  en: 'Home',
                  it: 'Principale',
                  es: 'Principal',
                  de: 'Start',
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('ingredients');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'ingredients')}
            >
              <FlaskConical className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Ингредиенты',
                  en: 'Ingredients',
                  it: 'Ingredienti',
                  es: 'Ingredientes',
                  de: 'Rohstoffe',
                })}
              </span>
              <span className="rounded bg-[#EDEBE9] px-1.5 py-0.2 font-mono text-[10px] tabular-nums text-[#605E5C]">
                {selectedProject.components.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('olfactory');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'olfactory')}
            >
              <Compass className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Ольфакторная карта',
                  en: 'Olfactory Map',
                  it: 'Mappa Olfattiva',
                  es: 'Mapa Olfativo',
                  de: 'Duftpyramide',
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('journal');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'journal')}
            >
              <NotebookPen className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Записи',
                  en: 'Notes',
                  it: 'Note',
                  es: 'Notas',
                  de: 'Notizen',
                })}
              </span>
              <span className="rounded bg-[#EDEBE9] px-1.5 py-0.2 font-mono text-[10px] tabular-nums text-[#605E5C]">
                {selectedProject.journal.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('cost');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'cost')}
            >
              <Coins className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Смета проекта',
                  en: 'Project Budget',
                  it: 'Budget Progetto',
                  es: 'Presupuesto',
                  de: 'Projektbudget',
                })}
              </span>
              <span className="rounded bg-[#EDEBE9] px-1.5 py-0.2 font-mono text-[10px] tabular-nums text-[#605E5C]">
                {projectEstimatesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('dilution');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'dilution')}
            >
              <Droplets className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Разбавление',
                  en: 'Dilution',
                  it: 'Diluizione',
                  es: 'Dilución',
                  de: 'Verdünnung',
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRibbonMode('context');
                onSelectProjectTab('management');
              }}
              className={tabBtnClass(ribbonMode === 'context' && activeProjectTab === 'management')}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>
                {tr(appSettings.language, {
                  ru: 'Управление',
                  en: 'Management',
                  it: 'Gestione',
                  es: 'Gestión',
                  de: 'Verwaltung',
                })}
              </span>
            </button>
          </>
        )}

        <span className="mx-1 mb-1.5 h-4 w-px bg-[#D2D0CE] shrink-0" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setRibbonMode('view')}
          className={tabBtnClass(activeRibbonTab === 'view')}
        >
          <Eye className="h-3.5 w-3.5 shrink-0 opacity-80" />
          <span>{t.ribbonView}</span>
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
                className={`${level3BtnClass} hover:bg-[#F3F2F1] ${
                  historyPaneOpen
                    ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                    : 'text-[#323130]'
                }`}
              >
                <History className="h-4 w-4 text-[var(--theme-accent)]" />
                <span className="mt-0.5 whitespace-nowrap truncate max-w-full">{t.projectHistoryPane}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleFocusMode}
              className={`${level3BtnClass} hover:bg-[#F3F2F1] ${
                isFocusMode
                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                  : 'text-[#323130]'
              }`}
            >
              <Eye className="h-4 w-4 text-[var(--theme-accent)]" />
              <span className="mt-0.5 whitespace-nowrap truncate max-w-full">{t.viewCleanSheet}</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeViewSettings({ widePageLayout: !viewSettings.widePageLayout })}
              className={`${level3BtnClass} hover:bg-[#F3F2F1] ${
                viewSettings.widePageLayout
                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                  : 'text-[#323130]'
              }`}
            >
              <Maximize2 className="h-4 w-4 text-[#605E5C]" />
              <span className="mt-0.5 whitespace-nowrap truncate max-w-full">{t.viewFullWidth}</span>
            </button>

            <button
              type="button"
              onClick={onResetViewSettings}
              className={`${level3BtnClass} hover:bg-[#F3F2F1] text-[#323130]`}
            >
              <RotateCcw className="h-4 w-4 text-[#605E5C]" />
              <span className="mt-0.5 whitespace-nowrap truncate max-w-full">{t.viewReset}</span>
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
      ) : selectedProject ? (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-1.5 text-[#323130]">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Standard Document & Project Operations (compact square icon-only buttons with tooltips) */}
            <div className="flex flex-wrap items-center gap-1">
              {/* Document & File Operations */}
              <div className="flex items-center gap-1">
                  {/* Сохранить (with Export Dropdown) */}
                  <div className="relative" ref={saveMenuRef}>
                    <button
                      type="button"
                      onClick={() => setSaveMenuOpen((v) => !v)}
                      className={`${iconOnlyBtnClass} hover:bg-[#F3F2F1] hover:border-[#E1DFDD] text-[#323130]`}
                      title={`${t.save}: ${selectedProject.title}`}
                      aria-label={t.save}
                      aria-expanded={saveMenuOpen}
                    >
                      <Save className="h-4 w-4 text-[var(--theme-accent)]" />
                      <ChevronDown className="h-2.5 w-2.5 text-[#605E5C] ml-0.5" />
                      {!saveMenuOpen && (
                        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded bg-[#181917] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                          {t.save}
                        </span>
                      )}
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
                    className={`${iconOnlyBtnClass} hover:bg-[#F3F2F1] hover:border-[#E1DFDD] text-[#323130] disabled:opacity-50`}
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
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded bg-[#181917] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                      {t.print}
                    </span>
                  </button>
                </div>

                {/* Divider between document operations and project management */}
                <div className="h-7 w-px bg-[#E1DFDD] mx-0.5 shrink-0 self-center" aria-hidden="true" />

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
                    className={`${iconOnlyBtnClass} hover:bg-[#F3F2F1] hover:border-[#E1DFDD] text-[#323130]`}
                    title={tr(appSettings.language, {
                      ru: 'Переименовать проект',
                      en: 'Rename project',
                      it: 'Rinomina progetto',
                      es: 'Renombrar proyecto',
                      de: 'Projekt umbenennen',
                    })}
                    aria-label={tr(appSettings.language, {
                      ru: 'Переименовать',
                      en: 'Rename',
                      it: 'Rinomina',
                      es: 'Renombrar',
                      de: 'Umbenennen',
                    })}
                  >
                    <Pencil className="h-4 w-4 text-[#605E5C]" />
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded bg-[#181917] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
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
                    className={`${iconOnlyBtnClass} hover:bg-[#F3F2F1] hover:border-[#E1DFDD] text-[#323130]`}
                    title={t.copyProject}
                    aria-label={t.copyProject}
                  >
                    <Copy className="h-4 w-4 text-[#605E5C]" />
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded bg-[#181917] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                      {t.copyProject}
                    </span>
                  </button>

                  {/* Удалить */}
                  <button
                    type="button"
                    onClick={onDeleteActiveProject}
                    className={`${iconOnlyBtnClass} text-[#B91C1C] hover:bg-[#FEF2F2] hover:border-[#FECACA]`}
                    title={t.deleteProject}
                    aria-label={t.deleteProject}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded bg-[#991B1B] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                      {t.deleteProject}
                    </span>
                  </button>
                </div>
            </div>

            {/* Level 3 Project Parameters: Code, Status (e.g. Мацерация), Concentration & Target Bottle Volume (ONLY on «Главное» tab) */}
            {activeProjectTab === 'formula' && (
              <>
                <div className="h-7 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Код проекта */}
                  <div className="flex flex-col items-center justify-center rounded px-1.5 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors">
                    <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white px-2 focus-within:border-[var(--theme-accent)] focus-within:ring-1 focus-within:ring-[var(--theme-accent)]">
                      <input
                        type="text"
                        value={selectedProject.code}
                        onChange={(e) =>
                          onUpdateProject?.({
                            ...selectedProject,
                            code: e.target.value,
                            updatedAt: todayIsoDate(),
                          })
                        }
                        aria-label={tr(appSettings.language, {
                          ru: 'Код проекта',
                          en: 'Project code',
                          it: 'Codice progetto',
                          es: 'Código del proyecto',
                          de: 'Projektcode',
                        })}
                        className="w-16 bg-transparent text-center font-mono text-xs font-semibold text-[#181917] focus:outline-none"
                      />
                    </div>
                    <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                      {tr(appSettings.language, {
                        ru: 'Код проекта',
                        en: 'Code',
                        it: 'Codice',
                        es: 'Código',
                        de: 'Code',
                      })}
                    </span>
                  </div>

                  {/* Статус (Мацерация / стадия проекта) — Word Font-Size style combobox */}
                  <div
                    ref={statusMenuRef}
                    className="relative flex flex-col items-center justify-center rounded px-1.5 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors"
                  >
                    <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white focus-within:border-[var(--theme-accent)]">
                      <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)] ml-2 shrink-0" />
                      <button
                        type="button"
                        onClick={() => {
                          setStatusMenuOpen((v) => !v);
                          setConcTypeMenuOpen(false);
                          setBottleMenuOpen(false);
                        }}
                        className="px-2 text-xs font-semibold text-[#181917] whitespace-nowrap min-w-[96px] text-left"
                        aria-label={tr(appSettings.language, {
                          ru: 'Статус проекта',
                          en: 'Project status',
                          it: 'Stato progetto',
                          es: 'Estado del proyecto',
                          de: 'Projektstatus',
                        })}
                        aria-expanded={statusMenuOpen}
                      >
                        {getProjectStatusLabel(selectedProject.status, appSettings.language)}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStatusMenuOpen((v) => !v);
                          setConcTypeMenuOpen(false);
                          setBottleMenuOpen(false);
                        }}
                        className="flex h-full items-center border-l border-[#E1DFDD] px-1.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                        aria-expanded={statusMenuOpen}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                      {tr(appSettings.language, {
                        ru: 'Статус',
                        en: 'Status',
                        it: 'Stato',
                        es: 'Estado',
                        de: 'Status',
                      })}
                    </span>

                    {statusMenuOpen && (
                      <div
                        data-capture-ignore="true"
                        className="absolute left-0 top-full z-50 mt-1 w-44 rounded-lg border border-[#D2D0CE] bg-white py-1 shadow-lg text-[#252423]"
                      >
                        {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((st) => {
                          const isActive = selectedProject.status === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                onUpdateProject?.({
                                  ...selectedProject,
                                  status: st,
                                  updatedAt: todayIsoDate(),
                                });
                                setStatusMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1] ${
                                isActive
                                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                                  : ''
                              }`}
                            >
                              <span>{getProjectStatusLabel(st, appSettings.language)}</span>
                              {isActive && <Check className="h-3 w-3 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Концентрация — Word Font-Size style combobox */}
                  <div
                    ref={concTypeMenuRef}
                    className="relative flex flex-col items-center justify-center rounded px-1.5 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors"
                  >
                    <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white focus-within:border-[var(--theme-accent)]">
                      <Droplets className="h-3.5 w-3.5 text-[var(--theme-accent)] ml-2 shrink-0" />
                      <button
                        type="button"
                        onClick={() => {
                          setConcTypeMenuOpen((v) => !v);
                          setStatusMenuOpen(false);
                          setBottleMenuOpen(false);
                        }}
                        className="px-2 text-xs font-semibold text-[#181917] whitespace-nowrap min-w-[104px] text-left tabular-nums"
                        aria-label={tr(appSettings.language, {
                          ru: 'Целевая концентрация',
                          en: 'Target concentration',
                          it: 'Concentrazione target',
                          es: 'Concentración objetivo',
                          de: 'Zielkonzentration',
                        })}
                        aria-expanded={concTypeMenuOpen}
                      >
                        {selectedProject.targetConcentration} (
                        {CONCENTRATION_TARGET_PERCENT[selectedProject.targetConcentration].range})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConcTypeMenuOpen((v) => !v);
                          setStatusMenuOpen(false);
                          setBottleMenuOpen(false);
                        }}
                        className="flex h-full items-center border-l border-[#E1DFDD] px-1.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                        aria-expanded={concTypeMenuOpen}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                      {tr(appSettings.language, {
                        ru: 'Концентрация',
                        en: 'Concentration',
                        it: 'Concentrazione',
                        es: 'Concentración',
                        de: 'Konzentration',
                      })}
                    </span>

                    {concTypeMenuOpen && (
                      <div
                        data-capture-ignore="true"
                        className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#D2D0CE] bg-white py-1 shadow-lg text-[#252423]"
                      >
                        {(Object.keys(CONCENTRATION_TARGET_PERCENT) as ConcentrationType[]).map((c) => {
                          const isActive = selectedProject.targetConcentration === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                onUpdateProject?.({
                                  ...selectedProject,
                                  targetConcentration: c,
                                  updatedAt: todayIsoDate(),
                                });
                                setConcTypeMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1] ${
                                isActive
                                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                                  : ''
                              }`}
                            >
                              <span className="font-medium">{c}</span>
                              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#605E5C] tabular-nums">
                                <span>{CONCENTRATION_TARGET_PERCENT[c].range}</span>
                                {isActive && <Check className="h-3 w-3 text-[var(--theme-accent)]" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Расчётный объём флакона — Word Font-Size style combobox (из Настроек флаконов) */}
                  <div
                    ref={bottleMenuRef}
                    className="relative flex flex-col items-center justify-center rounded px-1.5 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors"
                  >
                    <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white focus-within:border-[var(--theme-accent)] focus-within:ring-1 focus-within:ring-[var(--theme-accent)]">
                      <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)] ml-2 shrink-0" />
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        step="1"
                        value={bottleDraft}
                        onChange={(e) => setBottleDraft(e.target.value)}
                        onBlur={() => {
                          const val = Number(bottleDraft);
                          if (
                            Number.isFinite(val) &&
                            val > 0 &&
                            Math.round(val) !== selectedProject.targetBottleMl
                          ) {
                            applyBottleVolume(val);
                          } else {
                            setBottleDraft(String(selectedProject.targetBottleMl));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = Number(bottleDraft);
                            if (Number.isFinite(val) && val > 0) {
                              applyBottleVolume(val);
                            } else {
                              setBottleDraft(String(selectedProject.targetBottleMl));
                            }
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        aria-label={tr(appSettings.language, {
                          ru: 'Расчётный объём флакона',
                          en: 'Target bottle volume',
                          it: 'Volume flacone',
                          es: 'Volumen del frasco',
                          de: 'Flakonvolumen',
                        })}
                        className="w-12 bg-transparent px-1 text-center font-mono text-xs font-semibold tabular-nums text-[#181917] focus:outline-none"
                      />
                      <span className="pr-1.5 text-[11px] font-medium text-[#605E5C] select-none">
                        {formatUnit('мл', appSettings.language)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setBottleMenuOpen((v) => !v);
                          setStatusMenuOpen(false);
                          setConcTypeMenuOpen(false);
                        }}
                        className="flex h-full items-center border-l border-[#E1DFDD] px-1.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                        title={tr(appSettings.language, {
                          ru: 'Выбрать объём флакона',
                          en: 'Choose bottle volume',
                          it: 'Seleziona volume flacone',
                          es: 'Elegir volumen del frasco',
                          de: 'Flakonvolumen wählen',
                        })}
                        aria-expanded={bottleMenuOpen}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                      {tr(appSettings.language, {
                        ru: 'Объём флакона',
                        en: 'Bottle Vol.',
                        it: 'Volume Flacone',
                        es: 'Vol. Frasco',
                        de: 'Flakonvol.',
                      })}
                    </span>

                    {bottleMenuOpen && (
                      <div
                        data-capture-ignore="true"
                        className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#D2D0CE] bg-white py-1 shadow-lg text-[#252423]"
                      >
                        {bottlePresetsMl.map((vol) => {
                          const isActive = selectedProject.targetBottleMl === vol;
                          return (
                            <button
                              key={vol}
                              type="button"
                              onClick={() => {
                                applyBottleVolume(vol);
                                setBottleMenuOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-xs hover:bg-[#F3F2F1] ${
                                isActive
                                  ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                                  : ''
                              }`}
                            >
                              <span>
                                {vol} {formatUnit('мл', appSettings.language)}
                              </span>
                              {isActive && <Check className="h-3 w-3" />}
                            </button>
                          );
                        })}
                        {onOpenBottleSettings && (
                          <button
                            type="button"
                            onClick={() => {
                              setBottleMenuOpen(false);
                              onOpenBottleSettings();
                            }}
                            className="mt-1 flex w-full items-center gap-1.5 border-t border-[#EDEBE9] px-3 py-1.5 text-left text-[11px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1]"
                          >
                            <SlidersHorizontal className="h-3 w-3 shrink-0" />
                            <span>
                              {tr(appSettings.language, {
                                ru: 'Настроить флаконы...',
                                en: 'Configure bottles...',
                                it: 'Configura flaconi...',
                                es: 'Configurar frascos...',
                                de: 'Flakons verwalten...',
                              })}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Redesigned Perfume Concentrate Weight Control (ONLY on «Ингредиенты» tab, styled like Word Font Size) */}
            {activeProjectTab === 'ingredients' && (
              <>
                <div className="h-8 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />
                <div
                  ref={concMenuRef}
                  className="relative flex flex-col items-center justify-center rounded px-2 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors"
                >
                  <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white focus-within:border-[var(--theme-accent)] focus-within:ring-1 focus-within:ring-[var(--theme-accent)]">
                    <Scale className="h-3.5 w-3.5 text-[var(--theme-accent)] ml-2 shrink-0" />
                    <input
                      type="number"
                      min={0.1}
                      max={5000}
                      step="0.5"
                      value={concDraft}
                      onChange={(e) => setConcDraft(e.target.value)}
                      onBlur={() => {
                        const val = Number(concDraft);
                        if (Number.isFinite(val) && val > 0 && Math.abs(val - effectiveConcGrams) > 0.001) {
                          applyConcentrateWeight(val);
                        } else {
                          setConcDraft(String(effectiveConcGrams));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = Number(concDraft);
                          if (Number.isFinite(val) && val > 0) {
                            applyConcentrateWeight(val);
                          } else {
                            setConcDraft(String(effectiveConcGrams));
                          }
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-16 bg-transparent px-1.5 text-center font-mono text-xs font-semibold text-[#181917] focus:outline-none tabular-nums"
                      aria-label={tr(appSettings.language, {
                        ru: 'Вес парфюмерного концентрата',
                        en: 'Perfume Concentrate Weight',
                        it: 'Peso del Concentrato',
                        es: 'Peso del Concentrado',
                        de: 'Parfüm-Konzentratgewicht',
                      })}
                    />
                    <span className="pr-1.5 text-[11px] font-medium text-[#605E5C] select-none">
                      {formatUnit('г', appSettings.language)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setConcMenuOpen((v) => !v)}
                      className="flex h-full items-center border-l border-[#E1DFDD] px-1.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                      title={tr(appSettings.language, {
                        ru: 'Выбрать вес концентрата',
                        en: 'Choose concentrate weight',
                        it: 'Seleziona peso concentrato',
                        es: 'Elegir peso del concentrado',
                        de: 'Konzentratgewicht wählen',
                      })}
                      aria-expanded={concMenuOpen}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                    {tr(appSettings.language, {
                      ru: 'Вес парфюмерного концентрата',
                      en: 'Perfume Concentrate Weight',
                      it: 'Peso del Concentrato',
                      es: 'Peso del Concentrado',
                      de: 'Konzentratgewicht',
                    })}
                  </span>

                  {concMenuOpen && (
                    <div
                      data-capture-ignore="true"
                      className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#D2D0CE] bg-white py-1 shadow-lg text-[#252423]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          applyConcentrateWeight(defaultConcGrams);
                          setConcMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1] border-b border-[#EDEBE9]"
                      >
                        <span className="font-medium text-[var(--theme-accent)]">
                          {tr(appSettings.language, {
                            ru: 'Базовый (настройки)',
                            en: 'Default (Settings)',
                            it: 'Base (Impostazioni)',
                            es: 'Base (Ajustes)',
                            de: 'Standard (Einst.)',
                          })}
                        </span>
                        <span className="font-mono font-semibold tabular-nums">
                          {defaultConcGrams} {formatUnit('г', appSettings.language)}
                        </span>
                      </button>
                      {[5, 10, 15, 20, 30, 50, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            applyConcentrateWeight(preset);
                            setConcMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-xs hover:bg-[#F3F2F1] ${
                            Math.abs(effectiveConcGrams - preset) < 0.01
                              ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                              : ''
                          }`}
                        >
                          <span>
                            {preset} {formatUnit('г', appSettings.language)}
                          </span>
                          {Math.abs(effectiveConcGrams - preset) < 0.01 && (
                            <Check className="h-3 w-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-7 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />

                {/* Quick Add Ingredient (+ button + inline library/stock search combobox) */}
                <div ref={quickAddRef} className="relative flex flex-col justify-center">
                  <div
                    className={`flex h-8 items-center rounded border transition-colors ${
                      quickAddOpen || quickAddQuery.trim().length > 0
                        ? 'border-[var(--theme-accent)] bg-white ring-1 ring-[var(--theme-accent)]'
                        : 'border-[#E1DFDD] bg-[#FAF9F8] hover:border-[#D2D0CE] hover:bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuickAddOpen(true);
                        setTimeout(() => quickAddInputRef.current?.focus(), 0);
                      }}
                      className="flex h-full items-center justify-center gap-1 border-r border-[#E1DFDD] px-2.5 text-xs font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)] transition-colors rounded-l"
                      title={tr(appSettings.language, {
                        ru: 'Добавить ингредиент из библиотеки или склада',
                        en: 'Add ingredient from library or stock',
                        it: 'Aggiungi ingrediente dalla libreria o magazzino',
                        es: 'Añadir ingrediente desde librería o stock',
                        de: 'Rohstoff aus Bibliothek oder Lager hinzufügen',
                      })}
                      aria-label={tr(appSettings.language, {
                        ru: 'Добавить ингредиент',
                        en: 'Add ingredient',
                        it: 'Aggiungi ingrediente',
                        es: 'Añadir ingrediente',
                        de: 'Rohstoff hinzufügen',
                      })}
                    >
                      <Plus className="h-3.5 w-3.5 shrink-0" />
                    </button>
                    <div className="relative flex items-center">
                      <input
                        id="ribbon-quick-add-input"
                        ref={quickAddInputRef}
                        type="text"
                        value={quickAddQuery}
                        onFocus={() => setQuickAddOpen(true)}
                        onChange={(e) => {
                          setQuickAddQuery(e.target.value);
                          if (!quickAddOpen) setQuickAddOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && quickAddQuery.trim()) {
                            e.preventDefault();
                            if (quickAddMatches.ingMatches.length > 0) {
                              submitQuickAddFromIngredient(quickAddMatches.ingMatches[0]);
                            } else if (quickAddMatches.libMatches.length > 0) {
                              submitQuickAddFromLibrary(quickAddMatches.libMatches[0]);
                            } else if (quickAddMatches.fwMatches.length > 0) {
                              submitQuickAddFromFraterworks(quickAddMatches.fwMatches[0]);
                            } else {
                              submitQuickAddCustom();
                            }
                          }
                        }}
                        placeholder={tr(appSettings.language, {
                          ru: 'Добавить ингредиент (поиск)...',
                          en: 'Add ingredient (search)...',
                          it: 'Aggiungi ingrediente (cerca)...',
                          es: 'Añadir ingrediente (buscar)...',
                          de: 'Rohstoff hinzufügen (Suche)...',
                        })}
                        aria-label={tr(appSettings.language, {
                          ru: 'Поиск и добавление ингредиента',
                          en: 'Search and add ingredient',
                          it: 'Cerca e aggiungi ingrediente',
                          es: 'Buscar y añadir ingrediente',
                          de: 'Rohstoff suchen und hinzufügen',
                        })}
                        className="w-52 sm:w-60 bg-transparent px-2.5 py-1 text-xs text-[#181917] placeholder:text-[#797775] focus:outline-none"
                      />
                      {quickAddQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddQuery('');
                            quickAddInputRef.current?.focus();
                          }}
                          className="pr-2 text-[#8A8886] hover:text-[#181917]"
                          aria-label="Clear search"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {quickAddOpen && (
                    <div
                      data-capture-ignore="true"
                      className="absolute left-0 top-full z-50 mt-1.5 w-[440px] max-w-[92vw] rounded-lg border border-[#D2D0CE] bg-white shadow-xl text-[#252423] overflow-hidden"
                    >
                      {/* Dosage preset bar */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#EDEBE9] bg-[#FAF9F8] px-3 py-2 text-[11px]">
                        <span className="font-medium text-[#605E5C]">
                          {tr(appSettings.language, {
                            ru: 'Дозировка при добавлении:',
                            en: 'Default dosage:',
                            it: 'Dosaggio:',
                            es: 'Dosis al añadir:',
                            de: 'Startdosierung:',
                          })}
                        </span>
                        <div className="flex items-center gap-1.5 tabular-nums">
                          <input
                            type="number"
                            min={0.1}
                            max={100}
                            step="0.5"
                            value={quickAddPct}
                            onChange={(e) => setQuickAddPct(e.target.value)}
                            className="w-14 rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 text-right font-mono text-xs font-semibold text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                            aria-label="% concentrate"
                          />
                          <span className="text-[#605E5C]">%</span>
                          <span className="font-mono font-semibold text-[var(--theme-accent)]">
                            = {formatGrams(quickAddComputedGrams, 2, appSettings.language)}
                          </span>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[#EDEBE9]">
                        {/* Studio Stock / Catalog Results */}
                        {quickAddMatches.ingMatches.length > 0 && (
                          <div>
                            <div className="bg-[#FAF9F8]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#605E5C]">
                              {tr(appSettings.language, {
                                ru: 'Склад и каталог мастерской',
                                en: 'Workshop Stock & Catalog',
                                it: 'Magazzino e Catalogo',
                                es: 'Stock y Catálogo',
                                de: 'Atelier-Lager & Katalog',
                              })}
                            </div>
                            {quickAddMatches.ingMatches.map((ing) => {
                              const stockVal = getIngredientStockGrams(ing);
                              return (
                                <button
                                  key={`qa-ing-${ing.id}`}
                                  type="button"
                                  onClick={() => submitQuickAddFromIngredient(ing)}
                                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-[#F3F2F1] transition-colors"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-[#181917] truncate">
                                      {ing.name}
                                      {ing.bottleLabel ? (
                                        <span className="ml-1.5 font-mono text-[11px] text-[var(--theme-accent)]">
                                          [{ing.bottleLabel}]
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="text-[10.5px] text-[#605E5C] truncate">
                                      {getNoteTierShort(ing.tier, appSettings.language)} ·{' '}
                                      {getOlfactoryFamilyShort(ing.family, appSettings.language)} ·{' '}
                                      {ing.dilutionPercent}%
                                    </div>
                                  </div>
                                  <div className="shrink-0 text-right font-mono text-[11px] tabular-nums">
                                    {ing.status === 'in_stock' && stockVal !== null ? (
                                      <span
                                        className={
                                          stockVal <= 15
                                            ? 'font-semibold text-[#B45309]'
                                            : 'font-semibold text-[#15803D]'
                                        }
                                      >
                                        {stockVal} {formatUnit(ing.unit, appSettings.language)}
                                      </span>
                                    ) : (
                                      <span className="text-[#797775]">
                                        {getIngredientStatusLabel(ing.status, appSettings.language)}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Library Essences */}
                        {quickAddMatches.libMatches.length > 0 && (
                          <div>
                            <div className="bg-[#FAF9F8]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#605E5C]">
                              {tr(appSettings.language, {
                                ru: 'Библиотека эссенций',
                                en: 'Essence Library',
                                it: 'Libreria Essenze',
                                es: 'Librería de Esencias',
                                de: 'Duftbibliothek',
                              })}
                            </div>
                            {quickAddMatches.libMatches.map((libItem) => (
                              <div
                                key={`qa-lib-${libItem.id}`}
                                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-[#F3F2F1] transition-colors"
                              >
                                <button
                                  type="button"
                                  onClick={() => submitQuickAddFromLibrary(libItem)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <div className="font-medium text-[#181917] truncate">
                                    {libItem.name}
                                    {libItem.inciOrCas ? (
                                      <span className="ml-1.5 font-mono text-[10.5px] text-[#605E5C]">
                                        ({libItem.inciOrCas})
                                      </span>
                                    ) : null}
                                  </div>
                                  {libItem.scentDescription && (
                                    <div className="text-[10.5px] text-[#605E5C] truncate">
                                      {libItem.scentDescription}
                                    </div>
                                  )}
                                </button>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10.5px] font-medium text-[var(--theme-accent)]">
                                    {getNoteTierShort(libItem.tier, appSettings.language)} ·{' '}
                                    {getOlfactoryFamilyShort(libItem.family, appSettings.language)}
                                  </span>
                                  {onAddToCart && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onAddToCart(
                                          {
                                            name: libItem.name,
                                            inciOrCas: libItem.inciOrCas,
                                            family: libItem.family,
                                            tier: libItem.tier,
                                            origin: libItem.origin,
                                            dilutionPercent: 100,
                                            requiredGrams: Math.max(1, quickAddComputedGrams),
                                            olfactoryNotes: libItem.scentDescription || libItem.properties,
                                            odorImpact: libItem.odorImpact,
                                            substantivityHours: libItem.substantivityHours,
                                            scentBreakdown: libItem.scentBreakdown,
                                          },
                                          selectedProject?.id
                                        )
                                      }
                                      className="rounded p-1 text-[#B45309] hover:bg-[#FFFBEB]"
                                      title={tr(appSettings.language, {
                                        ru: 'Добавить в корзину',
                                        en: 'Add to cart',
                                        it: 'Aggiungi al carrello',
                                        es: 'Añadir al carrito',
                                        de: 'In den Warenkorb',
                                      })}
                                      aria-label={libItem.name}
                                    >
                                      <ShoppingCart className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Fraterworks Reference Matches */}
                        {quickAddMatches.fwMatches.length > 0 && (
                          <div>
                            <div className="bg-[#FAF9F8]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B45309]">
                              Fraterworks
                            </div>
                            {quickAddMatches.fwMatches.map((fw) => (
                              <div
                                key={`qa-fw-${fw.id}`}
                                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-[#F3F2F1] transition-colors"
                              >
                                <button
                                  type="button"
                                  onClick={() => submitQuickAddFromFraterworks(fw)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <div className="font-medium text-[#181917] truncate">{fw.name}</div>
                                  <div className="text-[10.5px] text-[#605E5C] truncate">
                                    {fw.scentBreakdown.map((b) => `${getLocalizedFacetName(b.facet, language)} ${b.percent}%`).join(' · ')}
                                  </div>
                                </button>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="font-mono text-[10.5px] font-medium text-[#B45309] tabular-nums">
                                    {tr(language, { ru: 'Импакт', en: 'Impact', it: 'Impatto', es: 'Impacto', de: 'Impact' })} {fw.odorImpact} · {fw.substantivityHours}{tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })}
                                  </span>
                                  {onAddToCart && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onAddToCart(
                                          {
                                            name: fw.name,
                                            inciOrCas: fw.inciOrCas,
                                            family: fw.family,
                                            tier: fw.tier,
                                            origin: fw.origin,
                                            dilutionPercent: 100,
                                            requiredGrams: Math.max(1, quickAddComputedGrams),
                                            olfactoryNotes: fw.scentDescription,
                                            odorImpact: fw.odorImpact,
                                            substantivityHours: fw.substantivityHours,
                                            scentBreakdown: fw.scentBreakdown,
                                          },
                                          selectedProject?.id
                                        )
                                      }
                                      className="rounded p-1 text-[#B45309] hover:bg-[#FFFBEB]"
                                      title={tr(appSettings.language, {
                                        ru: 'Добавить в корзину',
                                        en: 'Add to cart',
                                        it: 'Aggiungi al carrello',
                                        es: 'Añadir al carrito',
                                        de: 'In den Warenkorb',
                                      })}
                                      aria-label={fw.name}
                                    >
                                      <ShoppingCart className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Manual Create Option */}
                        {quickAddQuery.trim().length > 0 && (
                          <div className="flex items-center justify-between gap-2 bg-[#FAF9F8] px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <select
                                value={quickAddCustomTier}
                                onChange={(e) => setQuickAddCustomTier(e.target.value as NoteTier)}
                                className="rounded border border-[#D2D0CE] bg-white px-1.5 py-1 text-[11px] text-[#181917] focus:outline-none"
                              >
                                {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((tk) => (
                                  <option key={tk} value={tk}>
                                    {getNoteTierLabel(tk, appSettings.language)}
                                  </option>
                                ))}
                              </select>
                              <span className="text-xs text-[#323130] truncate">
                                «{quickAddQuery.trim()}»
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={submitQuickAddCustom}
                              className="inline-flex items-center gap-1 rounded bg-[var(--theme-accent)] px-2.5 py-1 text-[11px] font-medium text-white hover:opacity-95 shrink-0"
                            >
                              <Plus className="h-3 w-3" />
                              <span>
                                {tr(appSettings.language, {
                                  ru: 'Создать',
                                  en: 'Create',
                                  it: 'Crea',
                                  es: 'Crear',
                                  de: 'Erstellen',
                                })}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Level 3 Scale Formula Control (ONLY on «Ингредиенты» tab) */}
                <div className="h-7 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />
                <div className="flex flex-col items-center justify-center rounded px-1.5 py-0.5 hover:bg-[#F3F2F1]/70 transition-colors">
                  <div className="flex h-7 items-center rounded border border-[#D2D0CE] bg-white focus-within:border-[var(--theme-accent)] focus-within:ring-1 focus-within:ring-[var(--theme-accent)]">
                    <Scale className="h-3.5 w-3.5 text-[var(--theme-accent)] ml-2 shrink-0" />
                    <input
                      type="number"
                      min={0.5}
                      step="0.5"
                      value={scaleDraft}
                      onChange={(e) => setScaleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyScaleFormula();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      disabled={activeTotalWeightGrams <= 0}
                      className="w-14 bg-transparent px-1 text-right font-mono text-xs font-semibold text-[#181917] focus:outline-none tabular-nums disabled:opacity-40"
                      aria-label={tr(appSettings.language, {
                        ru: 'Целевой вес формулы в граммах',
                        en: 'Target formula weight in grams',
                        it: 'Peso target formula in grammi',
                        es: 'Peso objetivo de fórmula en gramos',
                        de: 'Zielgewicht der Formel in Gramm',
                      })}
                    />
                    <span className="pr-1.5 text-[11px] font-medium text-[#605E5C] select-none">
                      {formatUnit('г', appSettings.language)}
                    </span>
                    <button
                      type="button"
                      disabled={activeTotalWeightGrams <= 0}
                      onClick={applyScaleFormula}
                      className="flex h-full items-center border-l border-[#E1DFDD] bg-[#FAF9F8] px-2 text-[11px] font-semibold text-[#181917] hover:bg-[var(--theme-accent-soft)] hover:text-[var(--theme-accent)] transition-colors rounded-r disabled:opacity-40"
                      title={tr(appSettings.language, {
                        ru: 'Пропорционально масштабировать всю формулу к указанному весу',
                        en: 'Scale entire formula proportionally to target weight',
                        it: 'Scala proporzionalmente l’intera formula al peso target',
                        es: 'Escalar toda la fórmula al peso objetivo',
                        de: 'Gesamte Formel proportional skalieren',
                      })}
                    >
                      OK
                    </button>
                  </div>
                  <span className="mt-0.5 text-[10.5px] leading-tight text-[#605E5C] whitespace-nowrap">
                    {tr(appSettings.language, {
                      ru: 'Масштабировать',
                      en: 'Scale formula',
                      it: 'Scala formula',
                      es: 'Escalar fórmula',
                      de: 'Skalieren',
                    })}
                  </span>
                </div>

                <div className="h-7 w-px bg-[#E1DFDD] mx-1 shrink-0 self-center" aria-hidden="true" />

                {/* Suggested Components & Dosages Button (ONLY on «Ингредиенты» tab, directly BEFORE «Удалить все») */}
                <button
                  type="button"
                  onClick={() => setSuggestionsModalOpen(true)}
                  className="w-[116px] h-[48px] flex flex-col items-center justify-center rounded px-1.5 py-1 text-[10.5px] leading-[1.12] font-medium text-[#323130] hover:bg-[#F3F2F1] transition-colors shrink-0"
                  title={tr(appSettings.language, {
                    ru: 'Предлагаемые компоненты по идее проекта и рекомендуемые дозировки',
                    en: 'Suggested ingredients by project concept & recommended dosages',
                    it: 'Componenti suggeriti dal concept e dosaggi consigliati',
                    es: 'Componentes sugeridos según idea y dosis recomendadas',
                    de: 'Vorgeschlagene Rohstoffe & empfohlene Dosierungen',
                  })}
                >
                  <Sparkles className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
                  <span className="mt-0.5 text-center whitespace-normal">
                    {tr(appSettings.language, {
                      ru: 'Компоненты и дозировки',
                      en: 'Suggested & doses',
                      it: 'Suggeriti e dosi',
                      es: 'Sugeridos y dosis',
                      de: 'Vorschläge & Dosis',
                    })}
                  </span>
                </button>

                {/* Clear All Ingredients (ONLY on «Ингредиенты» tab) */}
                {onRequestClearAllComponents && (
                  <button
                    type="button"
                    disabled={activeComponents.length === 0}
                    onClick={onRequestClearAllComponents}
                    className={`${level3BtnClass} text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-40 disabled:hover:bg-transparent`}
                    title={tr(appSettings.language, {
                      ru: 'Удалить все ингредиенты из формулы',
                      en: 'Delete all ingredients from formula',
                      it: 'Elimina tutti gli ingredienti dalla formula',
                      es: 'Eliminar todos los ingredientes de la fórmula',
                      de: 'Alle Rohstoffe aus der Formel löschen',
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="mt-0.5 whitespace-nowrap truncate max-w-full">
                      {tr(appSettings.language, {
                        ru: 'Удалить все',
                        en: 'Delete all',
                        it: 'Elimina tutto',
                        es: 'Borrar todo',
                        de: 'Alle löschen',
                      })}
                    </span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right-aligned Revision History & Variants (available on ANY open tab of the project) */}
          <div className="ml-auto flex items-center gap-0.5 pl-3 border-l border-[#E1DFDD]">
            <button
              type="button"
              onClick={() => {
                if (onOpenHistoryTab) onOpenHistoryTab('history');
                else if (onToggleHistoryPane) onToggleHistoryPane();
              }}
              className={`${level3BtnClass} hover:bg-[#F3F2F1] ${
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
              <span className="mt-0.5 whitespace-nowrap truncate max-w-full">
                {tr(appSettings.language, {
                  ru: 'История правок',
                  en: 'Edit History',
                  it: 'Cronologia',
                  es: 'Historial',
                  de: 'Verlauf',
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenHistoryTab) onOpenHistoryTab('variants');
                else if (onToggleHistoryPane) onToggleHistoryPane();
              }}
              className={`${level3BtnClass} hover:bg-[#F3F2F1] ${
                historyPaneOpen
                  ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] font-semibold'
                  : 'text-[#323130]'
              }`}
              title={tr(appSettings.language, {
                ru: 'Варианты',
                en: 'Variants',
                it: 'Varianti',
                es: 'Variantes',
                de: 'Varianten',
              })}
            >
              <Layers className="h-4 w-4 text-[var(--theme-accent)]" />
              <span className="mt-0.5 whitespace-nowrap truncate max-w-full">
                {tr(appSettings.language, {
                  ru: 'Варианты',
                  en: 'Variants',
                  it: 'Varianti',
                  es: 'Variantes',
                  de: 'Varianten',
                })}
              </span>
            </button>
          </div>
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

      {selectedProject && onAddComponentToFormula && (
        <SuggestedComponentsModal
          open={suggestionsModalOpen}
          onClose={() => setSuggestionsModalOpen(false)}
          language={appSettings.language}
          project={selectedProject}
          activeComponents={activeComponents}
          effectiveConcGrams={effectiveConcGrams}
          ingredients={ingredients}
          library={library}
          estimates={estimates}
          onAddComponentToFormula={onAddComponentToFormula}
          onApplyComponentDosage={(componentId, weightGrams) =>
            updateActiveFormulaComponents((comps) =>
              comps.map((c) => (c.id === componentId ? { ...c, weightGrams } : c))
            )
          }
          onApplyAllDosages={(updates) => {
            const byId = new Map(updates.map((u) => [u.id, u.weightGrams]));
            updateActiveFormulaComponents((comps) =>
              comps.map((c) => (byId.has(c.id) ? { ...c, weightGrams: byId.get(c.id)! } : c))
            );
          }}
          onAddToCart={(payload) => onAddToCart?.(payload, selectedProject.id)}
          onOpenProjectTab={(tab) => onSelectProjectTab(tab)}
        />
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
