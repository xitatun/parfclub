import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Beaker,
  BellRing,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  DatabaseBackup,
  ExternalLink,
  FileCode2,
  FileDown,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  FolderKanban,
  FolderOpen,
  Globe,
  Home,
  LayoutGrid,
  Moon,
  NotebookPen,
  Palette,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sun,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CURRENCY_OPTIONS,
  formatUnit,
  getJournalVerdictLabel,
  getProjectStatusLabel,
} from '../data/constants';
import { LANGUAGE_OPTIONS, THEME_COLOR_OPTIONS, tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  ColorMode,
  HomeSectionsSettings,
  Ingredient,
  LibraryIngredient,
  MacerationBatch,
  MacerationStage,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectTab,
  PurchaseRecord,
  SaleRecord,
  ThemeColorKey,
} from '../types/perfume';
import {
  formatCurrencyRub,
  getIngredientStockGrams,
  getMacerationStatus,
} from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';
import { BudgetEstimate } from './BudgetEstimate';
import { IngredientDilutionCalculator } from './IngredientDilutionCalculator';
import { IngredientLibrary } from './IngredientLibrary';
import { OfflineStatusCard } from './PWAInstallButton';
import { SalesStatistics } from './SalesStatistics';
import { StudioStatistics } from './StudioStatistics';

export type BackstageTab =
  | 'home'
  | 'ingredients'
  | 'library'
  | 'budget'
  | 'statistics'
  | 'sales'
  | 'dilution'
  | 'manage'
  | 'backup'
  | 'settings';

interface WordFileBackstageProps {
  open: boolean;
  initialTab?: BackstageTab;
  onClose: () => void;
  language: AppLanguage;
  onChangeLanguage: (language: AppLanguage) => void;
  currency: AppCurrency;
  onChangeCurrency: (currency: AppCurrency) => void;
  themeColor: ThemeColorKey;
  onChangeThemeColor: (color: ThemeColorKey) => void;
  colorMode: ColorMode;
  onChangeColorMode: (mode: ColorMode) => void;
  homeSections: HomeSectionsSettings;
  onChangeHomeSections: (patch: Partial<HomeSectionsSettings>) => void;
  criticalStockGrams: number;
  onChangeCriticalStockGrams: (grams: number) => void;
  lastBackupAt?: string;
  selectedProject: PerfumeProject | null;
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  library: LibraryIngredient[];
  counts: {
    projects: number;
    ingredients: number;
    estimates: number;
    purchases: number;
  };
  onAddLibraryItem: (item: LibraryIngredient) => void;
  onUpdateLibraryItem: (item: LibraryIngredient) => void;
  onDeleteLibraryItem: (id: string) => void;
  onAddLibraryItemToWishlist: (item: LibraryIngredient) => void;
  onAddSale: (sale: SaleRecord) => void;
  onImportSales: (records: SaleRecord[], mode: 'append' | 'replace') => void;
  onDeleteSale: (id: string) => void;
  onOpenProjectsOverview: () => void;
  onOpenProject: (projectId: string, tab?: ProjectTab) => void;
  onOpenIngredients: () => void;
  onOpenBudget: () => void;
  onAcknowledgeMaceration: (projectId: string, batchId: string) => void;
  onAddMaceration: (projectId: string, batch: MacerationBatch) => void;
  onDeleteMaceration: (projectId: string, batchId: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: () => void;
  onDeleteProject: () => void;
  onOpenFile: (file: File) => void;
  onSaveProjectJson: () => void;
  onExportProjectPdf: () => void;
  onExportProjectWordDoc: () => void;
  onExportIngredientsExcel: () => void;
  onExportSalesExcel: () => void;
  onCreateBackup: () => void;
  onRequestResetDemo: () => void;
  onPrint: () => void;
  onExportCurrentViewPdf: () => void;
  isCapturingExport?: boolean;
  onOpenCriticalStock: (ing?: Ingredient) => void;
  onOpenQuickSearch: () => void;
  onTabChange?: (tab: BackstageTab) => void;
  onUpdateIngredient?: (ing: Ingredient) => void;
  onAddEstimateItem?: (item: ProjectEstimateItem) => void;
  onDeleteEstimateItem?: (id: string) => void;
  onAddPurchaseRecord?: (record: PurchaseRecord) => void;
  onDeletePurchaseRecord?: (id: string) => void;
  onUpdateProject?: (project: PerfumeProject) => void;
  onToast?: (msg: string) => void;
  studioName?: string;
  onChangeStudioName?: (name: string) => void;
  renderIngredientsCatalog?: () => React.ReactNode;
}

const BACKSTAGE_TEXT: Record<
  AppLanguage,
  {
    back: string;
    brand: string;
    tabHome: string;
    tabLibrary: string;
    tabStatistics: string;
    tabSales: string;
    tabManage: string;
    tabBackup: string;
    tabSettings: string;
    homeTitle: string;
    homeSubtitle: string;
    returnToProject: string;
    macerationTitle: string;
    macerationSubtitle: string;
    addTimerBtn: string;
    noReadyMacerations: string;
    readyToday: string;
    readyDaysAgo: string;
    stageConcentrate: string;
    stagePerfume: string;
    logTrialBtn: string;
    markCheckedBtn: string;
    activeMacerationsLabel: string;
    daysLeftShort: string;
    quickAccessTitle: string;
    qaProjects: string;
    qaIngredients: string;
    qaNotes: string;
    qaBudget: string;
    inStockShort: string;
    wishlistShort: string;
    maceratingShort: string;
    actualShort: string;
    recentProjectsTitle: string;
    allProjectsLink: string;
    noProjectsYet: string;
    recentNotesTitle: string;
    noNotesYet: string;
    timerProjectLabel: string;
    timerStageLabel: string;
    timerNameLabel: string;
    timerStartLabel: string;
    timerDaysLabel: string;
    timerStartBtn: string;
    manageTitle: string;
    manageSubtitle: string;
    createOpenGroup: string;
    newProject: string;
    newProjectDesc: string;
    openJson: string;
    openJsonDesc: string;
    activeProjectGroup: string;
    noActiveProject: string;
    saveJson: string;
    saveJsonDesc: string;
    exportPdf: string;
    exportPdfDesc: string;
    exportDoc: string;
    exportDocDesc: string;
    duplicateProject: string;
    deleteProject: string;
    studioExportsGroup: string;
    exportExcel: string;
    exportExcelDesc: string;
    exportSalesExcel: string;
    exportSalesExcelDesc: string;
    printDoc: string;
    printDocDesc: string;
    backupTitle: string;
    backupSubtitle: string;
    statProjects: string;
    statIngredients: string;
    statEstimates: string;
    statPurchases: string;
    lastBackupLabel: string;
    neverBackedUp: string;
    createBackupBtn: string;
    createBackupDesc: string;
    restoreBackupBtn: string;
    restoreBackupDesc: string;
    resetTitle: string;
    resetDesc: string;
    resetBtn: string;
    settingsTitle: string;
    settingsSubtitle: string;
    languageLabel: string;
    languageDesc: string;
    currencyLabel: string;
    currencyDesc: string;
    themeLabel: string;
    themeDesc: string;
    appearanceLabel: string;
    appearanceDesc: string;
    lightTitle: string;
    lightDesc: string;
    darkTitle: string;
    darkDesc: string;
    homeSectionsLabel: string;
    homeSectionsDesc: string;
    homeSectionsShowAll: string;
    homeSectionsConfigureBtn: string;
    homeSectionsEmptyTitle: string;
    homeSectionsEmptyDesc: string;
    hsMacerationTitle: string;
    hsMacerationDesc: string;
    hsQuickAccessTitle: string;
    hsQuickAccessDesc: string;
    hsProjectsTitle: string;
    hsProjectsDesc: string;
    hsNotesTitle: string;
    hsNotesDesc: string;
    hsLowStockTitle: string;
    hsLowStockDesc: string;
    lowStockTitle: string;
    lowStockSubtitle: string;
    lowStockEmpty: string;
    openInCatalogBtn: string;
    allCriticalLink: string;
    criticalNotifTitle: string;
    criticalNotifNone: string;
    criticalBadge: string;
    runningLowBadge: string;
    printScreenshotBtn: string;
    saveScreenshotPdfBtn: string;
    activeBadge: string;
    componentsShort: string;
  }
> = {
  ru: {
    back: 'К рабочему листу',
    brand: 'Ателье Эссенций',
    tabHome: 'Главная',
    tabLibrary: 'Библиотека',
    tabStatistics: 'Статистика',
    tabSales: 'Статистика продаж',
    tabManage: 'Управление файлом',
    tabBackup: 'Резервная копия',
    tabSettings: 'Настройки',
    homeTitle: 'Главная страница мастерской',
    homeSubtitle:
      'Уведомления о завершении мацерации концентрата и духов, а также быстрый переход к проектам, ингредиентам, записям и смете.',
    returnToProject: 'Открыть текущий проект',
    macerationTitle: 'Уведомления мастерской',
    macerationSubtitle: 'Контроль созревания концентрата и духов, а также сигналы критического запаса сырья.',
    addTimerBtn: 'Запустить таймер',
    noReadyMacerations:
      'Сейчас нет непроверенных завершённых мацераций. Активные таймеры отображаются ниже.',
    readyToday: 'Мацерация окончена сегодня',
    readyDaysAgo: 'Окончена {n} дн. назад',
    stageConcentrate: 'Концентрат',
    stagePerfume: 'Сами духи',
    logTrialBtn: 'Записать пробу',
    markCheckedBtn: 'Отметить проверенным',
    activeMacerationsLabel: 'Идёт мацерация сейчас',
    daysLeftShort: 'осталось {n} дн.',
    quickAccessTitle: 'Быстрый доступ к разделам',
    qaProjects: 'Проекты',
    qaIngredients: 'Ингредиенты',
    qaNotes: 'Мои записи',
    qaBudget: 'Смета и закупки',
    inStockShort: 'в наличии',
    wishlistShort: 'к покупке',
    maceratingShort: 'на мацерации',
    actualShort: 'куплено',
    recentProjectsTitle: 'Мои проекты',
    allProjectsLink: 'Все проекты',
    noProjectsYet: 'Проектов пока нет. Создайте первый проект кнопкой выше.',
    recentNotesTitle: 'Мои последние записи',
    noNotesYet: 'Записей проб пока нет. Откройте любой проект и добавьте заметку.',
    timerProjectLabel: 'Проект',
    timerStageLabel: 'Что мацерируется',
    timerNameLabel: 'Партия / описание',
    timerStartLabel: 'Дата начала',
    timerDaysLabel: 'Срок (дней)',
    timerStartBtn: 'Добавить таймер',
    manageTitle: 'Управление файлом и экспорт',
    manageSubtitle: 'Создание, открытие, сохранение документов и экспорт таблиц мастерской.',
    createOpenGroup: 'Документы и проекты',
    newProject: 'Создать новый проект',
    newProjectDesc: 'Пустой лист аромата с формулой, картой и сметой',
    openJson: 'Открыть проект',
    openJsonDesc: 'Загрузить файл проекта (.json) или полную копию мастерской',
    activeProjectGroup: 'Текущий открытый проект',
    noActiveProject:
      'Сейчас не выбран проект. Откройте любой проект на вкладке «Главная» или «Все проекты», чтобы экспортировать его в PDF, Word или JSON.',
    saveJson: 'Сохранить проект (.json)',
    saveJsonDesc: 'Локальный файл проекта со сметой для повторного открытия',
    exportPdf: 'Сохранить в PDF (.pdf)',
    exportPdfDesc: 'Чистый многолистовой PDF-документ без элементов интерфейса',
    exportDoc: 'Документ Word (.doc)',
    exportDocDesc: 'Совместимый файл для редактирования в Microsoft Word',
    duplicateProject: 'Дублировать проект',
    deleteProject: 'Удалить проект',
    studioExportsGroup: 'Общий экспорт и печать',
    exportExcel: 'База ингредиентов в Excel (.xlsx)',
    exportExcelDesc: 'Полная таблица сырья с ценами, магазинами и ссылками',
    exportSalesExcel: 'Статистика продаж в Excel (.xlsx)',
    exportSalesExcelDesc: 'Журнал продаж, сводная аналитика и шаблон-инструкция',
    printDoc: 'Печать активной вкладки',
    printDocDesc: 'Печать точного скриншота открытого экрана программы',
    backupTitle: 'Резервная копия и данные',
    backupSubtitle:
      'Все данные хранятся локально в браузере и доступны офлайн. Регулярно сохраняйте полную копию на диск.',
    statProjects: 'Проектов',
    statIngredients: 'Ингредиентов',
    statEstimates: 'Позиций сметы',
    statPurchases: 'Записей закупок',
    lastBackupLabel: 'Последняя резервная копия:',
    neverBackedUp: 'ещё не создавалась в этой сессии',
    createBackupBtn: 'Создать полную резервную копию (.json)',
    createBackupDesc:
      'Сохраняет все проекты, формулы, ольфакторные карты, базу сырья, сметы и журнал покупок в один файл.',
    restoreBackupBtn: 'Восстановить данные из файла (.json)',
    restoreBackupDesc: 'Загрузить ранее сохранённую резервную копию мастерской.',
    resetTitle: 'Сброс к демонстрационным данным',
    resetDesc:
      'Удалит текущие локальные изменения и вернёт стартовые примеры проектов и ингредиентов.',
    resetBtn: 'Сбросить к демо-данным',
    settingsTitle: 'Настройки приложения',
    settingsSubtitle: 'Персонализация языка интерфейса, валюты и цветовой схемы ленты Word.',
    languageLabel: 'Язык интерфейса',
    languageDesc: 'Применяется к верхней ленте, навигации, панели «Файл» и основным заголовкам.',
    currencyLabel: 'Валюта расчётов',
    currencyDesc: 'Определяет символ и формат отображения цен в формулах, сырье, сметах и отчётах.',
    themeLabel: 'Цвет темы оформления',
    themeDesc: 'Изменяет акцентный цвет верхней панели, активных вкладок и кнопок.',
    appearanceLabel: 'Режим оформления (светлый / тёмный)',
    appearanceDesc: 'Переключает фон рабочего стола, документов и панелей между светлой и тёмной темой.',
    lightTitle: 'Светлая тема',
    lightDesc: 'Классический белый лист документа и светлая лента',
    darkTitle: 'Тёмная тема',
    darkDesc: 'Комфортные графитовые поверхности для работы вечером',
    homeSectionsLabel: 'Отображение разделов на главной странице',
    homeSectionsDesc:
      'Выберите блоки, которые будут показываться на вкладке «Файл → Главная».',
    homeSectionsShowAll: 'Показать все разделы',
    homeSectionsConfigureBtn: 'Настроить разделы',
    homeSectionsEmptyTitle: 'На главной странице скрыты все разделы',
    homeSectionsEmptyDesc:
      'Включите нужные блоки в настройках, чтобы видеть уведомления, ингредиенты на исходе, быстрый доступ, проекты и записи.',
    hsMacerationTitle: 'Уведомления (мацерация и запас)',
    hsMacerationDesc: 'Сигналы о завершении созревания, активные таймеры и критический остаток сырья',
    hsQuickAccessTitle: 'Быстрый доступ к разделам',
    hsQuickAccessDesc: 'Карточки перехода в проекты, ингредиенты, записи и смету',
    hsProjectsTitle: 'Список проектов мастерской',
    hsProjectsDesc: 'Лента недавних проектов для быстрого открытия формулы',
    hsNotesTitle: 'Мои последние записи',
    hsNotesDesc: 'Последние пробы и наблюдения со всех проектов',
    hsLowStockTitle: 'Ингредиенты, которые скоро закончатся',
    hsLowStockDesc: 'Список сырья с минимальным остатком для своевременного пополнения',
    lowStockTitle: 'Ингредиенты, которые скоро закончатся',
    lowStockSubtitle: 'Сырьё в наличии с минимальным остатком — нажмите на карточку, чтобы открыть в базе.',
    lowStockEmpty: 'Все ингредиенты в наличии с достаточным запасом.',
    openInCatalogBtn: 'Открыть в базе',
    allCriticalLink: 'Вся база сырья',
    criticalNotifTitle: 'Критический запас сырья',
    criticalNotifNone: 'Критических остатков нет — все материалы в наличии выше заданного порога.',
    criticalBadge: 'Критично',
    runningLowBadge: 'Заканчивается',
    printScreenshotBtn: 'Печать',
    saveScreenshotPdfBtn: 'PDF',
    activeBadge: 'Активно',
    componentsShort: 'комп.',
  },
  en: {
    back: 'Back to Workspace',
    brand: 'Atelier Essences',
    tabHome: 'Home',
    tabLibrary: 'Library',
    tabStatistics: 'Statistics',
    tabSales: 'Sales Statistics',
    tabManage: 'File Management',
    tabBackup: 'Backup & Data',
    tabSettings: 'App Settings',
    homeTitle: 'Studio Home',
    homeSubtitle:
      'Maceration completion alerts for concentrates and finished perfumes, plus quick access to projects, ingredients, trial notes, and budgets.',
    returnToProject: 'Resume project',
    macerationTitle: 'Studio Notifications',
    macerationSubtitle: 'Track concentrate and perfume aging plus critical raw material stock alerts.',
    addTimerBtn: 'Start Timer',
    noReadyMacerations:
      'No unacknowledged completed macerations right now. Active timers are listed below.',
    readyToday: 'Maceration finished today',
    readyDaysAgo: 'Finished {n} d ago',
    stageConcentrate: 'Concentrate',
    stagePerfume: 'Finished Perfume',
    logTrialBtn: 'Record Trial',
    markCheckedBtn: 'Mark Checked',
    activeMacerationsLabel: 'Currently macerating',
    daysLeftShort: '{n} d left',
    quickAccessTitle: 'Quick Access',
    qaProjects: 'Projects',
    qaIngredients: 'Ingredients',
    qaNotes: 'My Notes',
    qaBudget: 'Budget & Orders',
    inStockShort: 'in stock',
    wishlistShort: 'to buy',
    maceratingShort: 'macerating',
    actualShort: 'spent',
    recentProjectsTitle: 'Studio Projects',
    allProjectsLink: 'All Projects',
    noProjectsYet: 'No projects yet. Create your first project above.',
    recentNotesTitle: 'Recent Trial Notes',
    noNotesYet: 'No trial notes yet. Open any project to log your first observation.',
    timerProjectLabel: 'Project',
    timerStageLabel: 'Material Stage',
    timerNameLabel: 'Batch label',
    timerStartLabel: 'Start date',
    timerDaysLabel: 'Duration (days)',
    timerStartBtn: 'Add Timer',
    manageTitle: 'File Management & Export',
    manageSubtitle: 'Create, open, save perfume documents, and export studio spreadsheets.',
    createOpenGroup: 'Documents & Projects',
    newProject: 'Create New Project',
    newProjectDesc: 'Start a fresh fragrance sheet with formula, map, and budget',
    openJson: 'Open Project',
    openJsonDesc: 'Load a single project file (.json) or full studio backup',
    activeProjectGroup: 'Active Open Project',
    noActiveProject:
      'No project selected. Open any project from Home or All Projects to export PDF, Word (.doc), or JSON.',
    saveJson: 'Save Project (.json)',
    saveJsonDesc: 'Portable project file including budget items',
    exportPdf: 'Export PDF Dossier (.pdf)',
    exportPdfDesc: 'Clean multi-sheet PDF dossier without app interface',
    exportDoc: 'Export Word Document (.doc)',
    exportDocDesc: 'Compatible document for editing in Microsoft Word',
    duplicateProject: 'Duplicate Project',
    deleteProject: 'Delete Project',
    studioExportsGroup: 'Studio Exports & Print',
    exportExcel: 'Ingredients in Excel (.xlsx)',
    exportExcelDesc: 'Complete raw materials table with prices, stores, and links',
    exportSalesExcel: 'Sales Statistics in Excel (.xlsx)',
    exportSalesExcelDesc: 'Sales journal, summary analytics, and import guide',
    printDoc: 'Print Active Tab Screenshot',
    printDocDesc: 'Print a faithful screenshot of the currently open view',
    backupTitle: 'Backup & Studio Data',
    backupSubtitle:
      'All studio data is stored locally in your browser and works offline. Save a full backup regularly.',
    statProjects: 'Projects',
    statIngredients: 'Ingredients',
    statEstimates: 'Estimate Lines',
    statPurchases: 'Purchase Logs',
    lastBackupLabel: 'Last backup created:',
    neverBackedUp: 'not created yet',
    createBackupBtn: 'Create Full Studio Backup (.json)',
    createBackupDesc:
      'Exports all projects, formulas, olfactory maps, ingredients, budgets, and purchases into one file.',
    restoreBackupBtn: 'Restore Data from File (.json)',
    restoreBackupDesc: 'Load a previously saved studio backup or project file.',
    resetTitle: 'Reset to Demo Data',
    resetDesc: 'Replaces current local changes with the initial sample projects and raw materials.',
    resetBtn: 'Reset to Demo Data',
    settingsTitle: 'Application Settings',
    settingsSubtitle: 'Customize the interface language, currency, and Word-style ribbon theme.',
    languageLabel: 'Interface Language',
    languageDesc: 'Updates the Ribbon, Navigation Pane, File Backstage, and section headings.',
    currencyLabel: 'Display Currency',
    currencyDesc: 'Sets the currency symbol and price formatting across formulas, materials, budgets, and exports.',
    themeLabel: 'Theme Accent Color',
    themeDesc: 'Updates the top title bar, active tabs, and primary action buttons.',
    appearanceLabel: 'Appearance Mode (Light / Dark)',
    appearanceDesc: 'Switches the desk canvas, document sheets, and panes between Light and Dark mode.',
    lightTitle: 'Light Mode',
    lightDesc: 'Classic crisp white document sheet and light ribbon',
    darkTitle: 'Dark Mode',
    darkDesc: 'Low-glare charcoal surfaces for comfortable night work',
    homeSectionsLabel: 'Home Page Sections',
    homeSectionsDesc:
      'Choose which blocks are visible on the File → Home dashboard.',
    homeSectionsShowAll: 'Show all sections',
    homeSectionsConfigureBtn: 'Customize sections',
    homeSectionsEmptyTitle: 'All Home sections are hidden',
    homeSectionsEmptyDesc:
      'Enable sections in Settings to show notifications, running-low ingredients, quick access, projects, or notes.',
    hsMacerationTitle: 'Notifications (Maceration & Stock)',
    hsMacerationDesc: 'Maturation alerts, active timers, and critical ingredient stock warnings',
    hsQuickAccessTitle: 'Quick Access Cards',
    hsQuickAccessDesc: 'Direct navigation tiles to Projects, Ingredients, Notes, and Budget',
    hsProjectsTitle: 'Studio Projects List',
    hsProjectsDesc: 'Recent projects feed for quick formula access',
    hsNotesTitle: 'Recent Trial Notes',
    hsNotesDesc: 'Latest lab trials and observations across all projects',
    hsLowStockTitle: 'Ingredients Running Low',
    hsLowStockDesc: 'Stocked materials nearing depletion so you can reorder on time',
    lowStockTitle: 'Ingredients Running Low',
    lowStockSubtitle: 'In-stock raw materials with the lowest remaining balance — click to inspect in catalog.',
    lowStockEmpty: 'All stocked ingredients have healthy inventory levels.',
    openInCatalogBtn: 'Open in Catalog',
    allCriticalLink: 'All Ingredients',
    criticalNotifTitle: 'Critical Raw Material Stock',
    criticalNotifNone: 'No critical stock alerts — all stocked materials are above threshold.',
    criticalBadge: 'Critical',
    runningLowBadge: 'Running low',
    printScreenshotBtn: 'Print',
    saveScreenshotPdfBtn: 'PDF',
    activeBadge: 'Active',
    componentsShort: 'comp.',
  },
  it: {
    back: 'Torna all’area di lavoro',
    brand: 'Atelier Essences',
    tabHome: 'Home',
    tabLibrary: 'Libreria',
    tabStatistics: 'Statistiche',
    tabSales: 'Statistiche Vendite',
    tabManage: 'Gestione File',
    tabBackup: 'Backup e Dati',
    tabSettings: 'Impostazioni',
    homeTitle: 'Home dello Studio',
    homeSubtitle:
      'Avvisi di fine macerazione per concentrati e profumi finiti, oltre all’accesso rapido a progetti, ingredienti, note di prova e budget.',
    returnToProject: 'Torna al progetto',
    macerationTitle: 'Notifiche dello Studio',
    macerationSubtitle: 'Monitoraggio della macerazione e avvisi sulle scorte critiche di materie prime.',
    addTimerBtn: 'Avvia Timer',
    noReadyMacerations:
      'Nessuna macerazione completata da verificare al momento. I timer attivi sono elencati sotto.',
    readyToday: 'Macerazione completata oggi',
    readyDaysAgo: 'Completata {n} g fa',
    stageConcentrate: 'Concentrato',
    stagePerfume: 'Profumo finito',
    logTrialBtn: 'Registra Prova',
    markCheckedBtn: 'Segna verificato',
    activeMacerationsLabel: 'Macerazione in corso',
    daysLeftShort: 'mancano {n} g',
    quickAccessTitle: 'Accesso Rapido',
    qaProjects: 'Progetti',
    qaIngredients: 'Ingredienti',
    qaNotes: 'Le mie note',
    qaBudget: 'Preventivo e Acquisti',
    inStockShort: 'disponibili',
    wishlistShort: 'da acquistare',
    maceratingShort: 'in macerazione',
    actualShort: 'speso',
    recentProjectsTitle: 'Progetti dello Studio',
    allProjectsLink: 'Tutti i Progetti',
    noProjectsYet: 'Nessun progetto presente. Crea il primo progetto qui sopra.',
    recentNotesTitle: 'Note di Prova Recenti',
    noNotesYet: 'Nessuna nota di prova. Apri un progetto per registrare la prima osservazione.',
    timerProjectLabel: 'Progetto',
    timerStageLabel: 'Fase materiale',
    timerNameLabel: 'Etichetta lotto',
    timerStartLabel: 'Data di inizio',
    timerDaysLabel: 'Durata (giorni)',
    timerStartBtn: 'Aggiungi Timer',
    manageTitle: 'Gestione File ed Esportazione',
    manageSubtitle: 'Crea, apri, salva documenti di profumeria ed esporta le tabelle dello studio.',
    createOpenGroup: 'Documenti e Progetti',
    newProject: 'Crea Nuovo Progetto',
    newProjectDesc: 'Nuova scheda fragranza con formula, mappa olfattiva e preventivo',
    openJson: 'Apri progetto',
    openJsonDesc: 'Carica un singolo progetto (.json) o il backup completo dello studio',
    activeProjectGroup: 'Progetto Attivo Aperto',
    noActiveProject:
      'Nessun progetto selezionato. Apri un progetto da Home o Tutti i Progetti per esportarlo in PDF, Word (.doc) o JSON.',
    saveJson: 'Salva Progetto (.json)',
    saveJsonDesc: 'File locale del progetto con preventivo incluso',
    exportPdf: 'Esporta in PDF (.pdf)',
    exportPdfDesc: 'Documento PDF multipagina pulito senza interfaccia',
    exportDoc: 'Documento Word (.doc)',
    exportDocDesc: 'File compatibile per la modifica in Microsoft Word',
    duplicateProject: 'Duplica Progetto',
    deleteProject: 'Elimina Progetto',
    studioExportsGroup: 'Esportazioni Studio e Stampa',
    exportExcel: 'Ingredienti in Excel (.xlsx)',
    exportExcelDesc: 'Tabella completa delle materie prime con prezzi, negozi e link',
    exportSalesExcel: 'Statistiche Vendite in Excel (.xlsx)',
    exportSalesExcelDesc: 'Registro vendite, analisi riepilogativa e guida all’importazione',
    printDoc: 'Stampa Schermata Corrente',
    printDocDesc: 'Stampa la schermata esatta della vista attualmente aperta',
    backupTitle: 'Backup e Dati dello Studio',
    backupSubtitle:
      'Tutti i dati dello studio sono salvati localmente nel browser e disponibili offline. Salva regolarmente un backup completo.',
    statProjects: 'Progetti',
    statIngredients: 'Ingredienti',
    statEstimates: 'Voci di preventivo',
    statPurchases: 'Registri acquisti',
    lastBackupLabel: 'Ultimo backup creato:',
    neverBackedUp: 'non ancora creato in questa sessione',
    createBackupBtn: 'Crea Backup Completo (.json)',
    createBackupDesc:
      'Esporta tutti i progetti, formule, mappe olfattive, ingredienti, preventivi e acquisti in un unico file.',
    restoreBackupBtn: 'Ripristina Dati da File (.json)',
    restoreBackupDesc: 'Carica un backup dello studio o un file progetto salvato in precedenza.',
    resetTitle: 'Ripristina Dati Demo',
    resetDesc: 'Sostituisce le modifiche locali correnti con i progetti e le materie prime iniziali.',
    resetBtn: 'Ripristina Dati Demo',
    settingsTitle: 'Impostazioni Applicazione',
    settingsSubtitle: 'Personalizza lingua dell’interfaccia, valuta e tema cromatico stile Word.',
    languageLabel: 'Lingua dell’Interfaccia',
    languageDesc: 'Aggiorna barra multifunzione, pannello di navigazione, menu File e intestazioni.',
    currencyLabel: 'Valuta di Visualizzazione',
    currencyDesc: 'Imposta simbolo e formato dei prezzi in formule, materie prime, preventivi e report.',
    themeLabel: 'Colore Accento Tema',
    themeDesc: 'Modifica il colore della barra superiore, delle schede attive e dei pulsanti principali.',
    appearanceLabel: 'Modalità Aspetto (Chiaro / Scuro)',
    appearanceDesc: 'Alterna lo sfondo della scrivania, dei fogli e dei pannelli tra tema Chiaro e Scuro.',
    lightTitle: 'Tema Chiaro',
    lightDesc: 'Classico foglio bianco nitido e barra chiara',
    darkTitle: 'Tema Scuro',
    darkDesc: 'Superfici grafite antiriflesso per lavorare di sera',
    homeSectionsLabel: 'Sezioni della Pagina Home',
    homeSectionsDesc: 'Scegli quali blocchi mostrare nella dashboard File → Home.',
    homeSectionsShowAll: 'Mostra tutte le sezioni',
    homeSectionsConfigureBtn: 'Personalizza sezioni',
    homeSectionsEmptyTitle: 'Tutte le sezioni Home sono nascoste',
    homeSectionsEmptyDesc:
      'Attiva le sezioni nelle Impostazioni per vedere notifiche, ingredienti in esaurimento, accesso rapido, progetti e note.',
    hsMacerationTitle: 'Notifiche (Macerazione e Scorte)',
    hsMacerationDesc: 'Avvisi di fine maturazione, timer attivi e scorte critiche di materie prime',
    hsQuickAccessTitle: 'Accesso Rapido',
    hsQuickAccessDesc: 'Riquadri diretti verso Progetti, Ingredienti, Note e Preventivi',
    hsProjectsTitle: 'Elenco Progetti dello Studio',
    hsProjectsDesc: 'Progetti recenti per aprire subito la formula',
    hsNotesTitle: 'Note di Prova Recenti',
    hsNotesDesc: 'Ultime prove di laboratorio e osservazioni di tutti i progetti',
    hsLowStockTitle: 'Ingredienti in Esaurimento',
    hsLowStockDesc: 'Materie prime disponibili con residuo basso per riordinarle in tempo',
    lowStockTitle: 'Ingredienti in Esaurimento',
    lowStockSubtitle: 'Materie prime in magazzino con residuo minimo — clicca per aprire nel catalogo.',
    lowStockEmpty: 'Tutti gli ingredienti disponibili hanno una scorta sufficiente.',
    openInCatalogBtn: 'Apri nel catalogo',
    allCriticalLink: 'Catalogo completo',
    criticalNotifTitle: 'Scorta Critica Materie Prime',
    criticalNotifNone: 'Nessuna scorta critica — tutti gli ingredienti superano la soglia impostata.',
    criticalBadge: 'Critico',
    runningLowBadge: 'In esaurimento',
    printScreenshotBtn: 'Stampa',
    saveScreenshotPdfBtn: 'PDF',
    activeBadge: 'Attivo',
    componentsShort: 'comp.',
  },
  es: {
    back: 'Volver al espacio de trabajo',
    brand: 'Atelier Essences',
    tabHome: 'Inicio',
    tabLibrary: 'Biblioteca',
    tabStatistics: 'Estadísticas',
    tabSales: 'Estadísticas de Ventas',
    tabManage: 'Gestión de Archivos',
    tabBackup: 'Copia de Seguridad',
    tabSettings: 'Ajustes',
    homeTitle: 'Inicio del Taller',
    homeSubtitle:
      'Avisos de fin de maceración para concentrados y perfumes terminados, además de acceso rápido a proyectos, ingredientes, notas y presupuestos.',
    returnToProject: 'Volver al proyecto',
    macerationTitle: 'Notificaciones del Taller',
    macerationSubtitle: 'Control de maduración y alertas de stock crítico de materias primas.',
    addTimerBtn: 'Iniciar Temporizador',
    noReadyMacerations:
      'No hay maceraciones completadas pendientes de revisar. Los temporizadores activos figuran abajo.',
    readyToday: 'Maceración finalizada hoy',
    readyDaysAgo: 'Finalizada hace {n} d',
    stageConcentrate: 'Concentrado',
    stagePerfume: 'Perfume terminado',
    logTrialBtn: 'Registrar Prueba',
    markCheckedBtn: 'Marcar revisado',
    activeMacerationsLabel: 'Macerando ahora',
    daysLeftShort: 'quedan {n} d',
    quickAccessTitle: 'Acceso Rápido',
    qaProjects: 'Proyectos',
    qaIngredients: 'Ingredientes',
    qaNotes: 'Mis Notas',
    qaBudget: 'Presupuesto y Pedidos',
    inStockShort: 'en stock',
    wishlistShort: 'por comprar',
    maceratingShort: 'en maceración',
    actualShort: 'gastado',
    recentProjectsTitle: 'Proyectos del Taller',
    allProjectsLink: 'Todos los Proyectos',
    noProjectsYet: 'Aún no hay proyectos. Crea tu primer proyecto arriba.',
    recentNotesTitle: 'Notas de Prueba Recientes',
    noNotesYet: 'Aún no hay notas de prueba. Abre cualquier proyecto para registrar una observación.',
    timerProjectLabel: 'Proyecto',
    timerStageLabel: 'Etapa del material',
    timerNameLabel: 'Etiqueta de lote',
    timerStartLabel: 'Fecha de inicio',
    timerDaysLabel: 'Duración (días)',
    timerStartBtn: 'Añadir Temporizador',
    manageTitle: 'Gestión de Archivos y Exportación',
    manageSubtitle: 'Crea, abre, guarda documentos de perfumería y exporta hojas del taller.',
    createOpenGroup: 'Documentos y Proyectos',
    newProject: 'Crear Nuevo Proyecto',
    newProjectDesc: 'Nueva ficha de fragancia con fórmula, mapa olfativo y presupuesto',
    openJson: 'Abrir proyecto',
    openJsonDesc: 'Cargar un proyecto individual (.json) o la copia completa del taller',
    activeProjectGroup: 'Proyecto Activo Abierto',
    noActiveProject:
      'No hay ningún proyecto seleccionado. Abre un proyecto desde Inicio o Todos los Proyectos para exportarlo a PDF, Word (.doc) o JSON.',
    saveJson: 'Guardar Proyecto (.json)',
    saveJsonDesc: 'Archivo portátil del proyecto con presupuesto incluido',
    exportPdf: 'Exportar a PDF (.pdf)',
    exportPdfDesc: 'Documento PDF multipágina limpio sin interfaz',
    exportDoc: 'Documento Word (.doc)',
    exportDocDesc: 'Archivo compatible para editar en Microsoft Word',
    duplicateProject: 'Duplicar Proyecto',
    deleteProject: 'Eliminar Proyecto',
    studioExportsGroup: 'Exportaciones del Taller e Impresión',
    exportExcel: 'Ingredientes en Excel (.xlsx)',
    exportExcelDesc: 'Tabla completa de materias primas con precios, tiendas y enlaces',
    exportSalesExcel: 'Estadísticas de Ventas en Excel (.xlsx)',
    exportSalesExcelDesc: 'Registro de ventas, analítica resumida y guía de importación',
    printDoc: 'Imprimir Pestaña Actual',
    printDocDesc: 'Imprime una captura exacta de la vista abierta',
    backupTitle: 'Copia de Seguridad y Datos',
    backupSubtitle:
      'Todos los datos del taller se guardan localmente en el navegador y funcionan sin conexión. Guarda una copia completa con frecuencia.',
    statProjects: 'Proyectos',
    statIngredients: 'Ingredientes',
    statEstimates: 'Líneas de presupuesto',
    statPurchases: 'Registros de compra',
    lastBackupLabel: 'Última copia creada:',
    neverBackedUp: 'aún no creada en esta sesión',
    createBackupBtn: 'Crear Copia Completa (.json)',
    createBackupDesc:
      'Exporta todos los proyectos, fórmulas, mapas olfativos, ingredientes, presupuestos y compras en un solo archivo.',
    restoreBackupBtn: 'Restaurar Datos desde Archivo (.json)',
    restoreBackupDesc: 'Cargar una copia de seguridad del taller o un archivo de proyecto guardado.',
    resetTitle: 'Restablecer Datos de Demo',
    resetDesc: 'Reemplaza los cambios locales actuales con los proyectos e ingredientes de ejemplo iniciales.',
    resetBtn: 'Restablecer Datos Demo',
    settingsTitle: 'Ajustes de la Aplicación',
    settingsSubtitle: 'Personaliza el idioma de la interfaz, la moneda y el tema estilo Word.',
    languageLabel: 'Idioma de la Interfaz',
    languageDesc: 'Actualiza la cinta superior, navegación, panel Archivo y encabezados principales.',
    currencyLabel: 'Moneda de Visualización',
    currencyDesc: 'Define el símbolo y formato de precios en fórmulas, materias primas, presupuestos e informes.',
    themeLabel: 'Color de Acento del Tema',
    themeDesc: 'Cambia el color de la barra superior, pestañas activas y botones principales.',
    appearanceLabel: 'Modo de Apariencia (Claro / Oscuro)',
    appearanceDesc: 'Alterna el fondo del escritorio, hojas y paneles entre modo Claro y Oscuro.',
    lightTitle: 'Modo Claro',
    lightDesc: 'Hoja blanca clásica nítida y cinta clara',
    darkTitle: 'Modo Oscuro',
    darkDesc: 'Superficies grafito antirreflejo para trabajar de noche',
    homeSectionsLabel: 'Secciones de la Página Inicio',
    homeSectionsDesc: 'Elige qué bloques son visibles en el panel Archivo → Inicio.',
    homeSectionsShowAll: 'Mostrar todas las secciones',
    homeSectionsConfigureBtn: 'Configurar secciones',
    homeSectionsEmptyTitle: 'Todas las secciones de Inicio están ocultas',
    homeSectionsEmptyDesc:
      'Activa secciones en Ajustes para mostrar avisos, ingredientes por agotarse, acceso rápido, proyectos y notas.',
    hsMacerationTitle: 'Notificaciones (Maceración y Stock)',
    hsMacerationDesc: 'Avisos de maduración, temporizadores activos y alertas de stock crítico',
    hsQuickAccessTitle: 'Acceso Rápido',
    hsQuickAccessDesc: 'Tarjetas directas a Proyectos, Ingredientes, Notas y Presupuestos',
    hsProjectsTitle: 'Lista de Proyectos del Taller',
    hsProjectsDesc: 'Proyectos recientes para abrir fórmulas al instante',
    hsNotesTitle: 'Notas de Prueba Recientes',
    hsNotesDesc: 'Últimas pruebas de laboratorio y observaciones de todos los proyectos',
    hsLowStockTitle: 'Ingredientes por Agotarse',
    hsLowStockDesc: 'Materias primas en stock con poco remanente para reponer a tiempo',
    lowStockTitle: 'Ingredientes por Agotarse',
    lowStockSubtitle: 'Materias primas disponibles con menor saldo — haz clic para abrir en el catálogo.',
    lowStockEmpty: 'Todos los ingredientes en stock tienen reservas suficientes.',
    openInCatalogBtn: 'Abrir en catálogo',
    allCriticalLink: 'Todo el catálogo',
    criticalNotifTitle: 'Stock Crítico de Materias Primas',
    criticalNotifNone: 'Sin alertas críticas — todas las existencias superan el umbral.',
    criticalBadge: 'Crítico',
    runningLowBadge: 'Por agotarse',
    printScreenshotBtn: 'Imprimir',
    saveScreenshotPdfBtn: 'PDF',
    activeBadge: 'Activo',
    componentsShort: 'comp.',
  },
  de: {
    back: 'Zurück zum Arbeitsbereich',
    brand: 'Atelier Essences',
    tabHome: 'Startseite',
    tabLibrary: 'Bibliothek',
    tabStatistics: 'Statistik',
    tabSales: 'Verkaufsstatistik',
    tabManage: 'Dateiverwaltung',
    tabBackup: 'Sicherung & Daten',
    tabSettings: 'Einstellungen',
    homeTitle: 'Atelier-Startseite',
    homeSubtitle:
      'Mazerations-Benachrichtigungen für Konzentrate und fertige Parfüms sowie Schnellzugriff auf Projekte, Rohstoffe, Notizen und Budget.',
    returnToProject: 'Zurück zum Projekt',
    macerationTitle: 'Atelier-Benachrichtigungen',
    macerationSubtitle: 'Reifungskontrolle und Hinweise bei kritischem Rohstoffbestand.',
    addTimerBtn: 'Timer starten',
    noReadyMacerations:
      'Derzeit keine ungeprüften abgeschlossenen Mazerationen. Laufende Timer stehen unten.',
    readyToday: 'Mazeration heute abgeschlossen',
    readyDaysAgo: 'Vor {n} Tagen abgeschlossen',
    stageConcentrate: 'Konzentrat',
    stagePerfume: 'Fertiges Parfüm',
    logTrialBtn: 'Probe erfassen',
    markCheckedBtn: 'Als geprüft markieren',
    activeMacerationsLabel: 'Aktive Mazerationen',
    daysLeftShort: 'noch {n} T.',
    quickAccessTitle: 'Schnellzugriff',
    qaProjects: 'Projekte',
    qaIngredients: 'Rohstoffe',
    qaNotes: 'Meine Notizen',
    qaBudget: 'Budget & Einkäufe',
    inStockShort: 'auf Lager',
    wishlistShort: 'zu kaufen',
    maceratingShort: 'in Mazeration',
    actualShort: 'ausgegeben',
    recentProjectsTitle: 'Atelier-Projekte',
    allProjectsLink: 'Alle Projekte',
    noProjectsYet: 'Noch keine Projekte. Erstellen Sie oben Ihr erstes Projekt.',
    recentNotesTitle: 'Aktuelle Testnotizen',
    noNotesYet: 'Noch keine Testnotizen. Öffnen Sie ein Projekt für Ihre erste Beobachtung.',
    timerProjectLabel: 'Projekt',
    timerStageLabel: 'Reifungsphase',
    timerNameLabel: 'Charge / Bezeichnung',
    timerStartLabel: 'Startdatum',
    timerDaysLabel: 'Dauer (Tage)',
    timerStartBtn: 'Timer hinzufügen',
    manageTitle: 'Dateiverwaltung & Export',
    manageSubtitle: 'Parfümdokumente erstellen, öffnen, speichern und Atelier-Tabellen exportieren.',
    createOpenGroup: 'Dokumente & Projekte',
    newProject: 'Neues Projekt erstellen',
    newProjectDesc: 'Neues Duftblatt mit Rezeptur, Duftpyramide und Budget',
    openJson: 'Projekt öffnen',
    openJsonDesc: 'Einzelnes Projekt (.json) oder vollständige Atelier-Sicherung laden',
    activeProjectGroup: 'Aktuell geöffnetes Projekt',
    noActiveProject:
      'Kein Projekt ausgewählt. Öffnen Sie ein Projekt über Startseite oder Alle Projekte für den Export als PDF, Word (.doc) oder JSON.',
    saveJson: 'Projekt speichern (.json)',
    saveJsonDesc: 'Portable Projektdatei inklusive Budgetpositionen',
    exportPdf: 'Als PDF speichern (.pdf)',
    exportPdfDesc: 'Sauberes mehrseitiges PDF-Dokument ohne Oberfläche',
    exportDoc: 'Word-Dokument (.doc)',
    exportDocDesc: 'Kompatible Datei zur Bearbeitung in Microsoft Word',
    duplicateProject: 'Projekt duplizieren',
    deleteProject: 'Projekt löschen',
    studioExportsGroup: 'Atelier-Exporte & Druck',
    exportExcel: 'Rohstoffe in Excel (.xlsx)',
    exportExcelDesc: 'Vollständige Rohstofftabelle mit Preisen, Shops und Links',
    exportSalesExcel: 'Verkaufsstatistik in Excel (.xlsx)',
    exportSalesExcelDesc: 'Verkaufsjournal, Auswertung und Importanleitung',
    printDoc: 'Aktiven Tab drucken',
    printDocDesc: 'Druckt einen exakten Screenshot der geöffneten Ansicht',
    backupTitle: 'Sicherung & Atelierdaten',
    backupSubtitle:
      'Alle Daten werden lokal im Browser gespeichert und funktionieren offline. Sichern Sie regelmäßig eine vollständige Kopie.',
    statProjects: 'Projekte',
    statIngredients: 'Rohstoffe',
    statEstimates: 'Budgetposten',
    statPurchases: 'Einkaufsbelege',
    lastBackupLabel: 'Letzte Sicherung erstellt:',
    neverBackedUp: 'in dieser Sitzung noch nicht erstellt',
    createBackupBtn: 'Vollständige Sicherung erstellen (.json)',
    createBackupDesc:
      'Exportiert alle Projekte, Rezepturen, Duftpyramiden, Rohstoffe, Budgets und Einkäufe in eine Datei.',
    restoreBackupBtn: 'Daten aus Datei wiederherstellen (.json)',
    restoreBackupDesc: 'Zuvor gespeicherte Atelier-Sicherung oder Projektdatei laden.',
    resetTitle: 'Auf Demodaten zurücksetzen',
    resetDesc: 'Ersetzt aktuelle lokale Änderungen durch die anfänglichen Beispielprojekte und Rohstoffe.',
    resetBtn: 'Demodaten wiederherstellen',
    settingsTitle: 'Anwendungseinstellungen',
    settingsSubtitle: 'Oberflächensprache, Währung und Akzentfarbe im Word-Stil anpassen.',
    languageLabel: 'Oberflächensprache',
    languageDesc: 'Gilt für Menüband, Navigation, Datei-Ansicht und Hauptüberschriften.',
    currencyLabel: 'Anzeigewährung',
    currencyDesc: 'Legt Währungssymbol und Zahlenformat in Rezepturen, Rohstoffen, Budgets und Berichten fest.',
    themeLabel: 'Akzentfarbe des Designs',
    themeDesc: 'Ändert die Farbe von Titelleiste, aktiven Tabs und primären Aktionsschaltflächen.',
    appearanceLabel: 'Erscheinungsbild (Hell / Dunkel)',
    appearanceDesc: 'Schaltet Arbeitsfläche, Dokumentblätter und Leisten zwischen Hell- und Dunkelmodus um.',
    lightTitle: 'Helles Design',
    lightDesc: 'Klassisches weißes Dokumentblatt und helles Menüband',
    darkTitle: 'Dunkles Design',
    darkDesc: 'Blendfreie Graphitoberflächen für angenehmes Arbeiten am Abend',
    homeSectionsLabel: 'Bereiche auf der Startseite',
    homeSectionsDesc: 'Wählen Sie aus, welche Blöcke unter Datei → Startseite angezeigt werden.',
    homeSectionsShowAll: 'Alle Bereiche anzeigen',
    homeSectionsConfigureBtn: 'Bereiche anpassen',
    homeSectionsEmptyTitle: 'Alle Startseiten-Bereiche sind ausgeblendet',
    homeSectionsEmptyDesc:
      'Aktivieren Sie Bereiche in den Einstellungen für Hinweise, knappe Rohstoffe, Schnellzugriff, Projekte und Notizen.',
    hsMacerationTitle: 'Benachrichtigungen (Reifung & Bestand)',
    hsMacerationDesc: 'Reifungshinweise, aktive Timer und Warnungen bei kritischem Rohstoffbestand',
    hsQuickAccessTitle: 'Schnellzugriff',
    hsQuickAccessDesc: 'Direkte Kacheln zu Projekten, Rohstoffen, Notizen und Budget',
    hsProjectsTitle: 'Atelier-Projektliste',
    hsProjectsDesc: 'Aktuelle Projekte für den schnellen Zugriff auf Rezepturen',
    hsNotesTitle: 'Aktuelle Testnotizen',
    hsNotesDesc: 'Neueste Laborproben und Beobachtungen aus allen Projekten',
    hsLowStockTitle: 'Rohstoffe mit niedrigem Bestand',
    hsLowStockDesc: 'Vorrätige Materialien mit geringer Restmenge zum rechtzeitigen Nachbestellen',
    lowStockTitle: 'Rohstoffe, die bald ausgehen',
    lowStockSubtitle: 'Vorrätige Rohstoffe mit dem geringsten Restbestand — klicken zum Öffnen im Katalog.',
    lowStockEmpty: 'Alle vorrätigen Rohstoffe haben ausreichende Bestände.',
    openInCatalogBtn: 'Im Katalog öffnen',
    allCriticalLink: 'Gesamter Katalog',
    criticalNotifTitle: 'Kritischer Rohstoffbestand',
    criticalNotifNone: 'Keine kritischen Bestände — alle Materialien liegen über dem Schwellenwert.',
    criticalBadge: 'Kritisch',
    runningLowBadge: 'Wird knapp',
    printScreenshotBtn: 'Drucken',
    saveScreenshotPdfBtn: 'PDF',
    activeBadge: 'Aktiv',
    componentsShort: 'Komp.',
  },
};

export function WordFileBackstage({
  open,
  initialTab = 'home',
  onClose,
  language,
  onChangeLanguage,
  currency,
  onChangeCurrency,
  themeColor,
  onChangeThemeColor,
  colorMode,
  onChangeColorMode,
  homeSections,
  onChangeHomeSections,
  lastBackupAt,
  selectedProject,
  projects,
  ingredients,
  estimates,
  purchases,
  sales,
  library,
  counts,
  onAddLibraryItem,
  onUpdateLibraryItem,
  onDeleteLibraryItem,
  onAddLibraryItemToWishlist,
  onAddSale,
  onImportSales,
  onDeleteSale,
  onOpenProjectsOverview,
  onOpenProject,
  onOpenIngredients,
  onOpenBudget,
  onAcknowledgeMaceration,
  onAddMaceration,
  onDeleteMaceration,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onOpenFile,
  onSaveProjectJson,
  onExportProjectPdf,
  onExportProjectWordDoc,
  onExportIngredientsExcel,
  onExportSalesExcel,
  onCreateBackup,
  onRequestResetDemo,
  onPrint,
  onExportCurrentViewPdf,
  isCapturingExport = false,
  onOpenCriticalStock,
  onOpenQuickSearch,
  onTabChange,
  onUpdateIngredient,
  onAddEstimateItem,
  onDeleteEstimateItem,
  onAddPurchaseRecord,
  onDeletePurchaseRecord,
  onUpdateProject,
  onToast,
  studioName,
  onChangeStudioName,
  renderIngredientsCatalog,
}: WordFileBackstageProps) {
  const [activeTab, setActiveTab] = useState<BackstageTab>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick add maceration timer state on Home tab
  const [showNewTimer, setShowNewTimer] = useState(false);
  const [timerProjectId, setTimerProjectId] = useState<string>(projects[0]?.id || '');
  const [timerStage, setTimerStage] = useState<MacerationStage>('concentrate');
  const [timerLabel, setTimerLabel] = useState('');
  const [timerStartDate, setTimerStartDate] = useState(todayIsoDate());
  const [timerDays, setTimerDays] = useState('14');

  useEffect(() => {
    if (projects.length > 0 && !projects.some((p) => p.id === timerProjectId)) {
      setTimerProjectId(projects[0].id);
    }
  }, [projects, timerProjectId]);

  const handleSelectTab = (tab: BackstageTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if (open && initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab, activeTab]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const todayIso = todayIsoDate();

  const { readyAlerts, activeTimers } = useMemo(() => {
    const ready: {
      project: PerfumeProject;
      batch: MacerationBatch;
      status: ReturnType<typeof getMacerationStatus>;
    }[] = [];
    const active: {
      project: PerfumeProject;
      batch: MacerationBatch;
      status: ReturnType<typeof getMacerationStatus>;
    }[] = [];

    for (const proj of projects) {
      for (const batch of proj.macerations || []) {
        const status = getMacerationStatus(batch, todayIso);
        if (status.isComplete && !batch.acknowledged) {
          ready.push({ project: proj, batch, status });
        } else if (!status.isComplete) {
          active.push({ project: proj, batch, status });
        }
      }
    }

    ready.sort((a, b) => b.status.overdueDays - a.status.overdueDays);
    active.sort((a, b) => a.status.remainingDays - b.status.remainingDays);
    return { readyAlerts: ready, activeTimers: active };
  }, [projects, todayIso]);

  const recentNotes = useMemo(() => {
    const entries = projects.flatMap((proj) =>
      proj.journal.map((entry) => ({
        project: proj,
        entry,
      }))
    );
    return entries.sort((a, b) => b.entry.date.localeCompare(a.entry.date));
  }, [projects]);

  const recentProjects = useMemo(
    () => [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [projects]
  );

  const studioMetrics = useMemo(() => {
    const inStockCount = ingredients.filter((i) => i.status === 'in_stock').length;
    const wishlistCount = ingredients.filter((i) => i.status === 'wishlist').length;
    const maceratingProjects = projects.filter((p) => p.status === 'macerating').length;
    const plannedBudget = estimates.reduce(
      (s, e) => s + e.requiredQuantity * e.estimatedUnitPrice,
      0
    );
    const actualSpent = purchases.reduce((s, p) => s + p.totalCost, 0);
    return {
      inStockCount,
      wishlistCount,
      maceratingProjects,
      plannedBudget,
      actualSpent,
    };
  }, [ingredients, projects, estimates, purchases]);

  const runningLowIngredients = useMemo(() => {
    const lowThreshold = 15;
    return ingredients
      .filter((ing) => ing.status === 'in_stock')
      .map((ing) => {
        const remaining = getIngredientStockGrams(ing) ?? 0;
        const total = ing.quantityGrams > 0 ? ing.quantityGrams : remaining || 1;
        const ratio = Math.max(0, Math.min(1, remaining / total));
        const isDepleting = remaining <= lowThreshold || ratio <= 0.35;
        return { ing, remaining, total, ratio, isDepleting };
      })
      .filter((item) => item.isDepleting)
      .sort((a, b) => {
        if (a.remaining !== b.remaining) return a.remaining - b.remaining;
        return a.ratio - b.ratio;
      });
  }, [ingredients]);

  if (!open) return null;

  const t = BACKSTAGE_TEXT[language];

  const triggerOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleOpenMyNotes = () => {
    const targetProjectId = recentNotes[0]?.project.id || selectedProject?.id || projects[0]?.id;
    if (targetProjectId) {
      onOpenProject(targetProjectId, 'journal');
    } else {
      onOpenProjectsOverview();
    }
    onClose();
  };

  const handleCreateQuickTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProj = projects.find((p) => p.id === timerProjectId) || projects[0];
    if (!targetProj) return;
    const defaultLabel =
      timerStage === 'concentrate'
        ? tr(language, {
            ru: 'Мацерация концентрата',
            en: 'Concentrate maturation',
            it: 'Maturazione del concentrato',
            es: 'Maduración del concentrado',
            de: 'Konzentrat-Reifung',
          })
        : tr(language, {
            ru: `Мацерация духов (${targetProj.targetConcentration})`,
            en: `${targetProj.targetConcentration} bottle maceration`,
            it: `Macerazione profumo (${targetProj.targetConcentration})`,
            es: `Maceración de perfume (${targetProj.targetConcentration})`,
            de: `Parfüm-Mazeration (${targetProj.targetConcentration})`,
          });

    onAddMaceration(targetProj.id, {
      id: generateId('mac'),
      stage: timerStage,
      label: timerLabel.trim() || defaultLabel,
      startDate: timerStartDate || todayIsoDate(),
      durationDays: Math.max(1, Math.min(365, Math.round(Number(timerDays) || 14))),
      acknowledged: false,
    });
    setTimerLabel('');
    setShowNewTimer(false);
  };

  const totalNotificationsCount = readyAlerts.length + runningLowIngredients.length;

  return (
    <div
      id="backstage-capture-root"
      data-capture-expand="fixed"
      className="print:hidden fixed inset-0 z-50 flex flex-col md:flex-row bg-[#FAF9F8] text-[#252423]"
      role="dialog"
      aria-modal="true"
      aria-label={t.tabHome}
    >
      {/* Left Accent Rail (Microsoft Word Backstage Style) */}
      <aside className="w-full md:w-64 shrink-0 bg-[var(--theme-accent)] text-white flex flex-col justify-between">
        <div>
          <div className="px-4 pt-4 pb-3 border-b border-white/15 space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-white/95 hover:bg-white/15 transition-colors w-full text-left"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/50">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
              <span>{t.back}</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                disabled={isCapturingExport}
                onClick={onPrint}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-colors disabled:opacity-50"
              >
                <Printer className="h-3.5 w-3.5 shrink-0" />
                <span>{t.printScreenshotBtn}</span>
              </button>
              <button
                type="button"
                disabled={isCapturingExport}
                onClick={onExportCurrentViewPdf}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-colors disabled:opacity-50"
              >
                <FileDown className="h-3.5 w-3.5 shrink-0" />
                <span>{t.saveScreenshotPdfBtn}</span>
              </button>
            </div>
          </div>

          <nav className="p-2.5 flex md:flex-col gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={onOpenQuickSearch}
              className="flex items-center justify-between gap-2 rounded-md bg-white/15 px-3.5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/25 whitespace-nowrap text-left md:mb-1"
            >
              <span className="flex items-center gap-2.5">
                <Search className="h-4 w-4 shrink-0" />
                <span>
                  {tr(language, {
                    ru: 'Поиск ингредиентов',
                    en: 'Search Ingredients',
                    it: 'Cerca Ingredienti',
                    es: 'Buscar Ingredientes',
                    de: 'Rohstoffe suchen',
                  })}
                </span>
              </span>
              <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white/95">
                Ctrl+K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('home')}
              className={`flex items-center justify-between gap-2 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'home'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Home className="h-4 w-4 shrink-0" />
                <span>{t.tabHome}</span>
              </span>
              {totalNotificationsCount > 0 && (
                <span className="rounded px-1.5 py-0.5 bg-white/25 font-mono text-[10px] font-semibold tabular-nums text-white">
                  {totalNotificationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('ingredients')}
              className={`flex items-center justify-between gap-2 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'ingredients'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <FlaskConical className="h-4 w-4 shrink-0" />
                <span>{t.qaIngredients}</span>
              </span>
              {counts.ingredients > 0 && (
                <span className="rounded px-1.5 py-0.5 bg-white/15 font-mono text-[10px] tabular-nums text-white/95">
                  {counts.ingredients}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('library')}
              className={`flex items-center justify-between gap-2 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'library'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{t.tabLibrary}</span>
              </span>
              {library.length > 0 && (
                <span className="rounded px-1.5 py-0.5 bg-white/15 font-mono text-[10px] tabular-nums text-white/95">
                  {library.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('budget')}
              className={`flex items-center justify-between gap-2 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'budget'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Calculator className="h-4 w-4 shrink-0" />
                <span>{t.qaBudget}</span>
              </span>
              {counts.estimates > 0 && (
                <span className="rounded px-1.5 py-0.5 bg-white/15 font-mono text-[10px] tabular-nums text-white/95">
                  {counts.estimates}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('statistics')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'statistics'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>{t.tabStatistics}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('sales')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'sales'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>{t.tabSales}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('dilution')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'dilution'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Beaker className="h-4 w-4 shrink-0" />
              <span>
                {tr(language, {
                  ru: 'Калькулятор разбавления',
                  en: 'Dilution Calculator',
                  it: 'Calcolatore Diluizione',
                  es: 'Calculadora de Dilución',
                  de: 'Verdünnungsrechner',
                })}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('manage')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'manage'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FolderOpen className="h-4 w-4 shrink-0" />
              <span>{t.tabManage}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('backup')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'backup'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <DatabaseBackup className="h-4 w-4 shrink-0" />
              <span>{t.tabBackup}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('settings')}
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap text-left ${
                activeTab === 'settings'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>{t.tabSettings}</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:block px-5 py-4 border-t border-white/15 text-[11px] text-white/75">
          <div className="font-medium text-white/95 truncate">{studioName?.trim() || t.brand}</div>
          <div className="mt-0.5 tabular-nums">
            {counts.projects} · {counts.ingredients} · {counts.purchases}
          </div>
        </div>
      </aside>

      {/* Main Backstage Workspace */}
      <div data-capture-scroll="true" className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 lg:px-10">
        <div className="w-full max-w-none space-y-6">
          {/* TAB 0: HOME DASHBOARD */}
          {activeTab === 'home' && (
            <>
              <div className="flex flex-col gap-3 border-b border-[#E1DFDD] pb-4">
                <div className="min-w-0 overflow-x-auto no-scrollbar">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#181917] whitespace-nowrap">
                    {studioName?.trim() ? `${studioName.trim()} — ${t.homeTitle}` : t.homeTitle}
                  </h1>
                  <p className="mt-1 text-sm text-[#605E5C] whitespace-nowrap">{t.homeSubtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedProject && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                      <span>
                        {t.returnToProject} ({selectedProject.code})
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('settings')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#605E5C] hover:text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>{t.homeSectionsConfigureBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={triggerOpenFilePicker}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3.5 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    <span>{t.openJson}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCreateProject();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                  >
                    <FilePlus2 className="h-3.5 w-3.5" />
                    <span>{t.newProject}</span>
                  </button>
                </div>
              </div>

              {!homeSections.showMacerationNotifications &&
                !homeSections.showLowStockIngredients &&
                !homeSections.showQuickAccess &&
                !homeSections.showRecentProjects &&
                !homeSections.showRecentNotes && (
                  <div className="rounded-xl border border-dashed border-[#D2D0CE] bg-white p-8 text-center space-y-3">
                    <div className="text-sm font-semibold text-[#181917]">
                      {t.homeSectionsEmptyTitle}
                    </div>
                    <p className="text-xs text-[#605E5C] max-w-md mx-auto">
                      {t.homeSectionsEmptyDesc}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('settings')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>{t.homeSectionsConfigureBtn}</span>
                    </button>
                  </div>
                )}

              {/* Notifications Section: Maceration */}
              {homeSections.showMacerationNotifications && (
                <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDEBE9] pb-3.5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                        readyAlerts.length > 0
                          ? 'bg-[#ECFDF5] text-[#15803D]'
                          : 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                      }`}
                    >
                      <BellRing className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-[#181917]">
                        {t.macerationTitle}
                        {totalNotificationsCount > 0 && (
                          <span className="ml-2 font-mono text-xs font-semibold text-[var(--theme-accent)] tabular-nums">
                            ({totalNotificationsCount})
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-[#605E5C]">{t.macerationSubtitle}</p>
                    </div>
                  </div>
                  {projects.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewTimer((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-white shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                      <span>{t.addTimerBtn}</span>
                    </button>
                  )}
                </div>

                {/* Running Low Ingredients Notification Block inside Home Notifications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#605E5C]">
                      <FlaskConical
                        className={`h-3.5 w-3.5 ${
                          runningLowIngredients.length > 0 ? 'text-[#B45309]' : 'text-[#15803D]'
                        }`}
                      />
                      <span>
                        {tr(language, {
                          ru: 'Уведомления о заканчивающихся ингредиентах',
                          en: 'Ingredients Running Low Alerts',
                          it: 'Avvisi ingredienti in esaurimento',
                          es: 'Avisos de ingredientes agotándose',
                          de: 'Hinweise zu knappen Rohstoffen',
                        })}
                      </span>
                    </div>
                    {runningLowIngredients.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenCriticalStock();
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-accent)] hover:underline"
                      >
                        <span>
                          {tr(language, {
                            ru: `Фильтр «Заканчивается» в базе (${runningLowIngredients.length})`,
                            en: `Filter "Running low" in catalog (${runningLowIngredients.length})`,
                            it: `Filtra nel catalogo (${runningLowIngredients.length})`,
                            es: `Filtrar en catálogo (${runningLowIngredients.length})`,
                            de: `Im Katalog filtern (${runningLowIngredients.length})`,
                          })}
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {runningLowIngredients.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {runningLowIngredients.slice(0, 6).map(({ ing, remaining }) => {
                        const unitLabel = formatUnit(ing.unit, language);
                        return (
                          <button
                            key={ing.id}
                            type="button"
                            onClick={() => {
                              onOpenCriticalStock(ing);
                              onClose();
                            }}
                            className="flex items-center justify-between gap-3 rounded-lg border border-[#FDE68A] dark:border-[#D97706]/40 bg-[#FFFBEB] px-3.5 py-2.5 text-left transition-colors hover:bg-[#FEF3C7]"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-[#181917]">
                                {ing.name}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-[#605E5C]">
                                {ing.supplier || t.openInCatalogBtn}
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#B45309] tabular-nums shrink-0">
                              {remaining} {unitLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] px-4 py-2.5 text-xs text-[#605E5C]">
                      <CheckCircle2 className="h-4 w-4 text-[#15803D] shrink-0" />
                      <span>{t.lowStockEmpty}</span>
                    </div>
                  )}
                </div>

                {/* Ready Notifications List */}
                {readyAlerts.length > 0 ? (
                  <div className="space-y-2.5">
                    {readyAlerts.map(({ project: proj, batch, status }) => {
                      const stageLabel =
                        batch.stage === 'concentrate' ? t.stageConcentrate : t.stagePerfume;
                      const whenText =
                        status.overdueDays === 0
                          ? t.readyToday
                          : t.readyDaysAgo.replace('{n}', String(status.overdueDays));
                      return (
                        <div
                          key={`${proj.id}-${batch.id}`}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-[#A7F3D0] dark:border-[#107C41]/50 bg-[#ECFDF5] p-4"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#15803D] font-medium">
                              <span>{stageLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span>{whenText}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-[11px] tabular-nums">
                                {batch.startDate} → {status.endDate} ({status.totalDays}{' '}
                                {tr(language, { ru: 'дн.', en: 'd', it: 'g', es: 'd', de: 'T.' })})
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-[#181917]">
                              <span className="font-mono text-[var(--theme-accent)] mr-1.5">
                                {proj.code}
                              </span>
                              <span>{proj.title}</span>
                              <span className="font-normal text-[#605E5C]"> — {batch.label}</span>
                            </div>
                            {batch.notes && (
                              <p className="text-xs text-[#575955]">{batch.notes}</p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onOpenProject(proj.id, 'journal');
                                onClose();
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                            >
                              <NotebookPen className="h-3.5 w-3.5" />
                              <span>{t.logTrialBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAcknowledgeMaceration(proj.id, batch.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
                            >
                              <Check className="h-3.5 w-3.5 text-[#15803D]" />
                              <span>{t.markCheckedBtn}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] px-4 py-3 text-xs text-[#605E5C]">
                    <CheckCircle2 className="h-4 w-4 text-[#15803D] shrink-0" />
                    <span>{t.noReadyMacerations}</span>
                  </div>
                )}

                {/* Active In-Progress Timers */}
                {activeTimers.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#605E5C]">
                      {t.activeMacerationsLabel}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeTimers.map(({ project: proj, batch, status }) => {
                        const stageLabel =
                          batch.stage === 'concentrate' ? t.stageConcentrate : t.stagePerfume;
                        return (
                          <div
                            key={`${proj.id}-${batch.id}`}
                            className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#605E5C]">
                                  <Clock className="h-3 w-3 text-[var(--theme-accent)]" />
                                  <span className="font-semibold text-[var(--theme-accent)]">
                                    {stageLabel}
                                  </span>
                                  <span>·</span>
                                  <span className="font-mono tabular-nums">
                                    {proj.code} · {status.endDate}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onOpenProject(proj.id, 'journal');
                                    onClose();
                                  }}
                                  className="mt-0.5 block truncate text-left text-xs font-semibold text-[#181917] hover:text-[var(--theme-accent)]"
                                >
                                  {proj.title} — {batch.label}
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => onDeleteMaceration(proj.id, batch.id)}
                                className="rounded p-1 text-[#797775] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                                aria-label={tr(language, {
                                  ru: 'Удалить таймер',
                                  en: 'Delete timer',
                                  it: 'Elimina timer',
                                  es: 'Eliminar temporizador',
                                  de: 'Timer löschen',
                                })}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between font-mono text-[11px] tabular-nums text-[#605E5C]">
                                <span>
                                  {t.daysLeftShort.replace('{n}', String(status.remainingDays))}
                                </span>
                                <span>
                                  {status.elapsedDays}/{status.totalDays}{' '}
                                  {tr(language, { ru: 'дн.', en: 'd', it: 'g', es: 'd', de: 'T.' })}
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                                <div
                                  style={{ width: `${status.progressPercent}%` }}
                                  className="h-full bg-[var(--theme-accent)]"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Collapsible Quick New Maceration Timer Form */}
                {showNewTimer && projects.length > 0 && (
                  <form
                    onSubmit={handleCreateQuickTimer}
                    className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
                  >
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] text-[#605E5C] mb-1">
                        {t.timerProjectLabel}
                      </label>
                      <select
                        value={timerProjectId}
                        onChange={(e) => setTimerProjectId(e.target.value)}
                        className="w-full rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} · {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] text-[#605E5C] mb-1">
                        {t.timerStageLabel}
                      </label>
                      <select
                        value={timerStage}
                        onChange={(e) => setTimerStage(e.target.value as MacerationStage)}
                        className="w-full rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      >
                        <option value="concentrate">{t.stageConcentrate}</option>
                        <option value="perfume">{t.stagePerfume}</option>
                      </select>
                    </div>
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] text-[#605E5C] mb-1">
                        {t.timerNameLabel}
                      </label>
                      <input
                        type="text"
                        value={timerLabel}
                        onChange={(e) => setTimerLabel(e.target.value)}
                        placeholder={
                          timerStage === 'concentrate'
                            ? tr(language, {
                                ru: 'Напр.: Концентрат №1',
                                en: 'e.g., Neat base #1',
                                it: 'Es.: Base pura n. 1',
                                es: 'Ej.: Base pura n.º 1',
                                de: 'Z. B.: Konzentrat Nr. 1',
                              })
                            : tr(language, {
                                ru: 'Напр.: Духи 30 мл',
                                en: 'e.g., EDP bottle 30 ml',
                                it: 'Es.: Flacone EDP 30 ml',
                                es: 'Ej.: Frasco EDP 30 ml',
                                de: 'Z. B.: EDP Flakon 30 ml',
                              })
                        }
                        className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] text-[#605E5C] mb-1">
                        {t.timerStartLabel}
                      </label>
                      <input
                        type="date"
                        value={timerStartDate}
                        onChange={(e) => setTimerStartDate(e.target.value)}
                        className="w-full rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-2 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      />
                    </div>
                    <div className="lg:col-span-2 flex items-end gap-2">
                      <div className="w-20">
                        <label className="block text-[11px] text-[#605E5C] mb-1">
                          {t.timerDaysLabel}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={timerDays}
                          onChange={(e) => setTimerDays(e.target.value)}
                          className="w-full rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-2 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                      >
                        {t.timerStartBtn}
                      </button>
                    </div>
                  </form>
                )}
              </section>
              )}

              {/* Ingredients Running Low Section */}
              {homeSections.showLowStockIngredients && (
                <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDEBE9] pb-3.5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg shrink-0 bg-[#FFFBEB] text-[#B45309]">
                        <FlaskConical className="h-4 w-4" />
                      </span>
                      <div>
                        <h2 className="text-base font-semibold text-[#181917]">
                          {t.lowStockTitle}
                          {runningLowIngredients.length > 0 && (
                            <span className="ml-2 font-mono text-xs font-semibold text-[#B45309] tabular-nums">
                              ({runningLowIngredients.length})
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-[#605E5C]">{t.lowStockSubtitle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (runningLowIngredients.length > 0) {
                          onOpenCriticalStock();
                        } else {
                          onOpenIngredients();
                        }
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-accent)] hover:underline shrink-0"
                    >
                      <span>{t.allCriticalLink}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {runningLowIngredients.length === 0 ? (
                    <div className="flex items-center gap-2.5 rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] px-4 py-3 text-xs text-[#605E5C]">
                      <CheckCircle2 className="h-4 w-4 text-[#15803D] shrink-0" />
                      <span>{t.lowStockEmpty}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {runningLowIngredients.slice(0, 9).map(({ ing, remaining, total, ratio }) => {
                        const unitLabel = formatUnit(ing.unit, language);
                        const pct = Math.round(ratio * 100);
                        return (
                          <div
                            key={ing.id}
                            className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 flex flex-col justify-between gap-2.5 transition-colors"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onOpenCriticalStock(ing);
                                    onClose();
                                  }}
                                  className="text-left text-xs font-semibold text-[#181917] hover:text-[var(--theme-accent)] leading-snug line-clamp-1"
                                >
                                  {ing.name}
                                </button>
                                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                                  {t.runningLowBadge}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between gap-2 font-mono text-xs tabular-nums">
                                <span className="font-bold text-[#181917]">
                                  {remaining} {unitLabel}
                                </span>
                                <span className="text-[11px] text-[#605E5C]">
                                  / {total} {unitLabel} ({pct}%)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                              <span className="truncate text-[#605E5C]">
                                {ing.supplier || t.openInCatalogBtn}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {ing.purchaseUrl && (
                                  <a
                                    href={ing.purchaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#605E5C] hover:text-[var(--theme-accent)]"
                                    title={ing.purchaseUrl}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    onOpenCriticalStock(ing);
                                    handleSelectTab('ingredients');
                                  }}
                                  className="font-medium text-[var(--theme-accent)] hover:underline"
                                >
                                  {t.openInCatalogBtn}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* Quick Access Navigation Tiles */}
              {homeSections.showQuickAccess && (
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                    {t.quickAccessTitle}
                  </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProjectsOverview();
                      onClose();
                    }}
                    className="rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2 text-[var(--theme-accent)]">
                        <FolderKanban className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#797775]" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#181917]">{t.qaProjects}</div>
                    <div className="mt-1 font-mono text-xs text-[#605E5C] tabular-nums">
                      {projects.length} · {studioMetrics.maceratingProjects} {t.maceratingShort}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectTab('ingredients');
                    }}
                    className="rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2 text-[var(--theme-accent)]">
                        <FlaskConical className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#797775]" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#181917]">{t.qaIngredients}</div>
                    <div className="mt-1 font-mono text-xs text-[#605E5C] tabular-nums">
                      {studioMetrics.inStockCount} {t.inStockShort} · {studioMetrics.wishlistCount}{' '}
                      {t.wishlistShort}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMyNotes}
                    className="rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2 text-[var(--theme-accent)]">
                        <NotebookPen className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#797775]" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#181917]">{t.qaNotes}</div>
                    <div className="mt-1 font-mono text-xs text-[#605E5C] tabular-nums">
                      {recentNotes.length}{' '}
                      {tr(language, {
                        ru: 'записей',
                        en: 'entries',
                        it: 'note',
                        es: 'notas',
                        de: 'Einträge',
                      })}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenBudget();
                      onClose();
                    }}
                    className="rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2 text-[var(--theme-accent)]">
                        <Calculator className="h-4 w-4" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#797775]" />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-[#181917]">{t.qaBudget}</div>
                    <div className="mt-1 font-mono text-xs text-[#605E5C] tabular-nums">
                      {formatCurrencyRub(studioMetrics.actualSpent, language, currency)}{' '}
                      {t.actualShort}
                    </div>
                  </button>
                </div>
              </section>
              )}

              {/* 2-Column Studio Overview: Projects & Recent Notes */}
              {(homeSections.showRecentProjects || homeSections.showRecentNotes) && (
                <div
                  className={`grid grid-cols-1 gap-4 ${
                    homeSections.showRecentProjects && homeSections.showRecentNotes
                      ? 'lg:grid-cols-2'
                      : 'lg:grid-cols-1'
                  }`}
                >
                  {/* Projects List */}
                  {homeSections.showRecentProjects && (
                    <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3">
                        <h2 className="text-sm font-semibold text-[#181917]">
                          {t.recentProjectsTitle}
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenProjectsOverview();
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-accent)] hover:underline"
                        >
                          <span>{t.allProjectsLink}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>

                      {recentProjects.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#797775]">{t.noProjectsYet}</p>
                      ) : (
                        <div className="divide-y divide-[#EDEBE9]">
                          {recentProjects.slice(0, 6).map((proj) => (
                            <button
                              key={proj.id}
                              type="button"
                              onClick={() => {
                                onOpenProject(proj.id, 'formula');
                                onClose();
                              }}
                              className="w-full py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-left group"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-[11px] text-[#605E5C] tabular-nums">
                                  <span className="font-mono font-semibold text-[var(--theme-accent)]">
                                    {proj.code}
                                  </span>
                                  <span>·</span>
                                  <span>{getProjectStatusLabel(proj.status, language)}</span>
                                  <span>·</span>
                                  <span>
                                    {proj.targetConcentration} · {proj.targetBottleMl}{' '}
                                    {tr(language, { ru: 'мл', en: 'ml', it: 'ml', es: 'ml', de: 'ml' })}
                                  </span>
                                </div>
                                <div className="truncate text-sm font-medium text-[#181917] group-hover:text-[var(--theme-accent)]">
                                  {proj.title}
                                </div>
                              </div>
                              <span className="font-mono text-[11px] text-[#797775] tabular-nums shrink-0">
                                {proj.updatedAt}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Recent Trial Notes Feed */}
                  {homeSections.showRecentNotes && (
                    <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3">
                        <h2 className="text-sm font-semibold text-[#181917]">
                          {t.recentNotesTitle}
                        </h2>
                        {recentNotes.length > 0 && (
                          <button
                            type="button"
                            onClick={handleOpenMyNotes}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-accent)] hover:underline"
                          >
                            <span>{t.qaNotes}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {recentNotes.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[#797775]">{t.noNotesYet}</p>
                      ) : (
                        <div className="divide-y divide-[#EDEBE9]">
                          {recentNotes.slice(0, 5).map(({ project: proj, entry }) => (
                            <button
                              key={entry.id}
                              type="button"
                              onClick={() => {
                                onOpenProject(proj.id, 'journal');
                                onClose();
                              }}
                              className="w-full py-2.5 first:pt-1 last:pb-1 text-left group space-y-0.5"
                            >
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#605E5C] tabular-nums">
                                <span className="font-mono">{entry.date}</span>
                                <span>·</span>
                                <span className="font-mono font-semibold text-[var(--theme-accent)]">
                                  {proj.code}
                                </span>
                                <span>·</span>
                                <span>{getJournalVerdictLabel(entry.verdict, language)}</span>
                              </div>
                              <div className="truncate text-sm font-medium text-[#181917] group-hover:text-[var(--theme-accent)]">
                                {entry.trialLabel}
                              </div>
                              <p className="line-clamp-2 text-xs text-[#605E5C] leading-relaxed">
                                {entry.content}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 0.15: STUDIO INGREDIENTS CATALOG */}
          {activeTab === 'ingredients' && renderIngredientsCatalog?.()}

          {/* TAB 0.18: DILUTION CALCULATOR */}
          {activeTab === 'dilution' && (
            <div className="p-6">
              <IngredientDilutionCalculator
                ingredients={ingredients}
                projects={projects}
                language={language}
                currency={currency}
                onAddToProjectFormula={(projectId, comp) => {
                  const proj = projects.find((p) => p.id === projectId);
                  if (proj && onUpdateProject) {
                    onUpdateProject({
                      ...proj,
                      components: [...proj.components, comp],
                      updatedAt: todayIsoDate(),
                    });
                    onToast?.(
                      tr(language, {
                        ru: `Ингредиент добавлен в формулу ${proj.code}`,
                        en: `Ingredient added to ${proj.code}`,
                        it: `Ingrediente aggiunto a ${proj.code}`,
                        es: `Ingrediente añadido a ${proj.code}`,
                        de: `Rohstoff zu ${proj.code} hinzugefügt`,
                      })
                    );
                  }
                }}
                onSaveDilutedIngredient={(ing) => {
                  onUpdateIngredient?.(ing);
                  onToast?.(
                    tr(language, {
                      ru: 'Разведённый ингредиент сохранён в базу',
                      en: 'Diluted ingredient saved to catalog',
                      it: 'Ingrediente diluito salvato',
                      es: 'Ingrediente diluido guardado',
                      de: 'Verdünnter Rohstoff gespeichert',
                    })
                  );
                }}
                onToast={onToast}
              />
            </div>
          )}

          {/* TAB 0.25: INGREDIENT LIBRARY */}
          {activeTab === 'library' && (
            <IngredientLibrary
              library={library}
              studioIngredients={ingredients}
              language={language}
              onAddLibraryItem={onAddLibraryItem}
              onUpdateLibraryItem={onUpdateLibraryItem}
              onDeleteLibraryItem={onDeleteLibraryItem}
              onAddToStudioWishlist={onAddLibraryItemToWishlist}
            />
          )}

          {/* TAB 0.35: BUDGET ESTIMATE IN FILE SECTION */}
          {activeTab === 'budget' && (
            <BudgetEstimate
              projects={projects}
              ingredients={ingredients}
              estimates={estimates}
              purchases={purchases}
              language={language}
              currency={currency}
              onAddEstimateItem={(item) => onAddEstimateItem?.(item)}
              onDeleteEstimateItem={(id) => onDeleteEstimateItem?.(id)}
              onAddPurchaseRecord={(record) => onAddPurchaseRecord?.(record)}
              onDeletePurchaseRecord={(id) => onDeletePurchaseRecord?.(id)}
              onUpdateProject={(proj) => onUpdateProject?.(proj)}
              onToast={onToast}
            />
          )}

          {/* TAB 0.5: STUDIO STATISTICS */}
          {activeTab === 'statistics' && (
            <StudioStatistics
              projects={projects}
              ingredients={ingredients}
              estimates={estimates}
              purchases={purchases}
              language={language}
              currency={currency}
              onOpenProject={(projectId, tab) => {
                onOpenProject(projectId, tab);
                onClose();
              }}
              onOpenIngredients={() => {
                onOpenIngredients();
                onClose();
              }}
              onOpenBudget={() => {
                onOpenBudget();
                onClose();
              }}
              onOpenProjectsOverview={() => {
                onOpenProjectsOverview();
                onClose();
              }}
            />
          )}

          {/* TAB 0.75: SALES STATISTICS */}
          {activeTab === 'sales' && (
            <SalesStatistics
              projects={projects}
              sales={sales}
              language={language}
              currency={currency}
              onAddSale={onAddSale}
              onImportSales={onImportSales}
              onDeleteSale={onDeleteSale}
              onOpenProject={(projectId, tab) => {
                onOpenProject(projectId, tab);
                onClose();
              }}
            />
          )}

          {/* TAB 1: FILE MANAGEMENT */}
          {activeTab === 'manage' && (
            <>
              <div className="border-b border-[#E1DFDD] pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">{t.manageTitle}</h1>
                <p className="mt-1 text-sm text-[#605E5C]">{t.manageSubtitle}</p>
              </div>

              {/* Create & Open */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                  {t.createOpenGroup}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCreateProject();
                      onClose();
                    }}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)]/50"
                  >
                    <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2.5 text-[var(--theme-accent)] shrink-0">
                      <FilePlus2 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.newProject}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.newProjectDesc}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={triggerOpenFilePicker}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)]/50"
                  >
                    <span className="rounded-lg bg-[#F3F2F1] p-2.5 text-[#323130] shrink-0">
                      <FolderOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.openJson}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.openJsonDesc}</div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Active Project Operations */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                  {t.activeProjectGroup}
                </h2>
                {selectedProject ? (
                  <div className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEBE9] pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#605E5C]">
                          <span className="font-mono font-semibold text-[var(--theme-accent)]">
                            {selectedProject.code}
                          </span>
                          <span>·</span>
                          <span>{selectedProject.targetConcentration}</span>
                          <span>·</span>
                          <span className="tabular-nums">
                            {selectedProject.components.length} {t.componentsShort}
                          </span>
                        </div>
                        <div className="mt-0.5 text-lg font-bold text-[#181917]">
                          {selectedProject.title || '—'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onDuplicateProject();
                            onClose();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-1.5 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1]"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>{t.duplicateProject}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onDeleteProject();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{t.deleteProject}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onExportCurrentViewPdf();
                        }}
                        className="flex items-start gap-3 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 text-left hover:border-[var(--theme-accent)] hover:bg-white"
                      >
                        <FileDown className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-[#181917]">{t.exportPdf}</div>
                          <div className="mt-0.5 text-[11px] text-[#605E5C]">{t.exportPdfDesc}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSaveProjectJson();
                          onClose();
                        }}
                        className="flex items-start gap-3 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 text-left hover:border-[var(--theme-accent)] hover:bg-white"
                      >
                        <Save className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-[#181917]">{t.saveJson}</div>
                          <div className="mt-0.5 text-[11px] text-[#605E5C]">{t.saveJsonDesc}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onExportProjectWordDoc();
                          onClose();
                        }}
                        className="flex items-start gap-3 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 text-left hover:border-[var(--theme-accent)] hover:bg-white"
                      >
                        <FileText className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-[#181917]">{t.exportDoc}</div>
                          <div className="mt-0.5 text-[11px] text-[#605E5C]">{t.exportDocDesc}</div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#D2D0CE] bg-white p-5 text-xs text-[#605E5C]">
                    {t.noActiveProject}
                  </div>
                )}
              </section>

              {/* Studio Exports */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                  {t.studioExportsGroup}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onExportIngredientsExcel();
                      onClose();
                    }}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[#107C41]"
                  >
                    <span className="rounded-lg bg-[#ECFDF5] p-2.5 text-[#107C41] shrink-0">
                      <FileSpreadsheet className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.exportExcel}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.exportExcelDesc}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onExportSalesExcel();
                      onClose();
                    }}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[#107C41]"
                  >
                    <span className="rounded-lg bg-[#ECFDF5] p-2.5 text-[#107C41] shrink-0">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.exportSalesExcel}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.exportSalesExcelDesc}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={isCapturingExport}
                    onClick={() => {
                      onExportCurrentViewPdf();
                    }}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[var(--theme-accent)] disabled:opacity-50"
                  >
                    <span className="rounded-lg bg-[var(--theme-accent-soft)] p-2.5 text-[var(--theme-accent)] shrink-0">
                      <FileDown className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.exportPdf}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.exportPdfDesc}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={isCapturingExport}
                    onClick={() => {
                      onPrint();
                    }}
                    className="flex items-start gap-3.5 rounded-xl border border-[#E1DFDD] bg-white p-4 text-left transition-colors hover:border-[#8A8886] disabled:opacity-50"
                  >
                    <span className="rounded-lg bg-[#F3F2F1] p-2.5 text-[#323130] shrink-0">
                      <Printer className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#181917]">{t.printDoc}</div>
                      <div className="mt-0.5 text-xs text-[#605E5C]">{t.printDocDesc}</div>
                    </div>
                  </button>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: BACKUP & DATA */}
          {activeTab === 'backup' && (
            <>
              <div className="border-b border-[#E1DFDD] pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">{t.backupTitle}</h1>
                <p className="mt-1 text-sm text-[#605E5C]">{t.backupSubtitle}</p>
              </div>

              {/* Studio Data Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
                  <div className="text-xs text-[#605E5C]">{t.statProjects}</div>
                  <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
                    {counts.projects}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
                  <div className="text-xs text-[#605E5C]">{t.statIngredients}</div>
                  <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
                    {counts.ingredients}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
                  <div className="text-xs text-[#605E5C]">{t.statEstimates}</div>
                  <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
                    {counts.estimates}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
                  <div className="text-xs text-[#605E5C]">{t.statPurchases}</div>
                  <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
                    {counts.purchases}
                  </div>
                </div>
              </div>

              {/* Create & Restore Backup */}
              <div className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-5">
                <div className="text-xs text-[#605E5C]">
                  {t.lastBackupLabel}{' '}
                  <strong className="font-mono text-[#181917]">
                    {lastBackupAt || t.neverBackedUp}
                  </strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-4 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#181917]">
                        <FileCode2 className="h-4 w-4 text-[var(--theme-accent)]" />
                        <span>{t.createBackupBtn}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#605E5C]">
                        {t.createBackupDesc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onCreateBackup}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>{t.createBackupBtn}</span>
                    </button>
                  </div>

                  <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-4 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#181917]">
                        <Upload className="h-4 w-4 text-[#323130]" />
                        <span>{t.restoreBackupBtn}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#605E5C]">
                        {t.restoreBackupDesc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerOpenFilePicker}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D2D0CE] bg-white px-4 py-2.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] transition-colors"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span>{t.restoreBackupBtn}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Offline Readiness & Local Cache Status */}
              <OfflineStatusCard language={language} />

              {/* Reset Demo Data */}
              <div className="rounded-xl border border-[#FECACA] bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#991B1B]">{t.resetTitle}</h2>
                  <p className="mt-0.5 text-xs text-[#605E5C]">{t.resetDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestResetDemo();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.resetBtn}</span>
                </button>
              </div>
            </>
          )}

          {/* TAB 3: APPLICATION SETTINGS */}
          {activeTab === 'settings' && (
            <>
              <div className="border-b border-[#E1DFDD] pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">{t.settingsTitle}</h1>
                <p className="mt-1 text-sm text-[#605E5C]">{t.settingsSubtitle}</p>
              </div>

              {/* Studio Name Setting */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <FlaskConical className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-[#181917]">
                      {tr(language, {
                        ru: 'Название мастерской',
                        en: 'Workshop / Studio Name',
                        it: 'Nome del laboratorio',
                        es: 'Nombre del taller',
                        de: 'Name der Werkstatt / des Ateliers',
                      })}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#605E5C]">
                      {tr(language, {
                        ru: 'Отображается в заголовке программы, боковой панели раздела «Файл» и при экспорте.',
                        en: 'Displayed in the app header, File sidebar, and exported documents.',
                        it: 'Mostrato nell’intestazione dell’app, nella barra laterale File e nei documenti esportati.',
                        es: 'Se muestra en el encabezado de la aplicación, en la barra lateral Archivo y al exportar.',
                        de: 'Wird in der Kopfzeile, in der Datei-Seitenleiste und beim Export angezeigt.',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
                  <input
                    type="text"
                    value={studioName ?? ''}
                    onChange={(e) => onChangeStudioName?.(e.target.value)}
                    placeholder={t.brand}
                    className="flex-1 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-3.5 py-2 text-sm font-medium text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                  {studioName?.trim() && (
                    <button
                      type="button"
                      onClick={() => onChangeStudioName?.('')}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>
                        {tr(language, {
                          ru: 'По умолчанию',
                          en: 'Reset default',
                          it: 'Predefinito',
                          es: 'Por defecto',
                          de: 'Standard',
                        })}
                      </span>
                    </button>
                  )}
                </div>
              </section>

              {/* Language Switcher */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-[#181917]">{t.languageLabel}</h2>
                    <p className="mt-0.5 text-xs text-[#605E5C]">{t.languageDesc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LANGUAGE_OPTIONS.map((item) => {
                    const active = language === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onChangeLanguage(item.key)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                            : 'border-[#E1DFDD] bg-[#FAF9F8] hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#181917]">{item.title}</div>
                          <div className="mt-0.5 text-xs text-[#605E5C]">
                            {item.sub[language]}
                          </div>
                        </div>
                        {active && (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-accent)] text-white shrink-0">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Currency Switcher */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Coins className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-[#181917]">{t.currencyLabel}</h2>
                    <p className="mt-0.5 text-xs text-[#605E5C]">{t.currencyDesc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CURRENCY_OPTIONS.map((opt) => {
                    const active = currency === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => onChangeCurrency(opt.code)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                            : 'border-[#E1DFDD] bg-[#FAF9F8] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E1DFDD] bg-white font-mono text-sm font-bold text-[var(--theme-accent)] shrink-0">
                            {opt.symbol}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-semibold text-[#181917]">
                              {opt.labels[language]}
                            </div>
                            <div className="font-mono text-[11px] text-[#605E5C]">{opt.code}</div>
                          </div>
                        </div>
                        {active && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--theme-accent)] text-white shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Appearance Mode (Light / Dark) */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  {colorMode === 'dark' ? (
                    <Moon className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  ) : (
                    <Sun className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-[#181917]">{t.appearanceLabel}</h2>
                    <p className="mt-0.5 text-xs text-[#605E5C]">{t.appearanceDesc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        key: 'light',
                        title: t.lightTitle,
                        sub: t.lightDesc,
                        Icon: Sun,
                      },
                      {
                        key: 'dark',
                        title: t.darkTitle,
                        sub: t.darkDesc,
                        Icon: Moon,
                      },
                    ] as { key: ColorMode; title: string; sub: string; Icon: typeof Sun }[]
                  ).map(({ key, title, sub, Icon }) => {
                    const active = colorMode === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onChangeColorMode(key)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                            : 'border-[#E1DFDD] bg-[#FAF9F8] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
                              key === 'dark'
                                ? 'border-[#3F3F46] bg-[#18181B] text-[#FBBF24]'
                                : 'border-[#E4E4E0] bg-[#FFFFFF] text-[#D97706]'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#181917]">{title}</div>
                            <div className="mt-0.5 text-xs text-[#605E5C]">{sub}</div>
                          </div>
                        </div>
                        {active && (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-accent)] text-white shrink-0">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Theme Color Switcher */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-[#181917]">{t.themeLabel}</h2>
                    <p className="mt-0.5 text-xs text-[#605E5C]">{t.themeDesc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {THEME_COLOR_OPTIONS.map((opt) => {
                    const active = themeColor === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => onChangeThemeColor(opt.key)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                            : 'border-[#E1DFDD] bg-[#FAF9F8] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`h-7 w-7 rounded-full shrink-0 border border-black/10 dark:border-white/20 ${opt.swatchClass}`}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-xs font-semibold text-[#181917]">
                              {opt.labels[language]}
                            </div>
                            <div className="font-mono text-[11px] text-[#605E5C]">{opt.hex}</div>
                          </div>
                        </div>
                        {active && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--theme-accent)] text-white shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Home Page Sections Visibility */}
              <section className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <LayoutGrid className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-base font-semibold text-[#181917]">
                        {t.homeSectionsLabel}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#605E5C]">{t.homeSectionsDesc}</p>
                    </div>
                  </div>
                  {(!homeSections.showMacerationNotifications ||
                    !homeSections.showLowStockIngredients ||
                    !homeSections.showQuickAccess ||
                    !homeSections.showRecentProjects ||
                    !homeSections.showRecentNotes) && (
                    <button
                      type="button"
                      onClick={() =>
                        onChangeHomeSections({
                          showMacerationNotifications: true,
                          showLowStockIngredients: true,
                          showQuickAccess: true,
                          showRecentProjects: true,
                          showRecentNotes: true,
                        })
                      }
                      className="text-xs font-medium text-[var(--theme-accent)] hover:underline whitespace-nowrap shrink-0"
                    >
                      {t.homeSectionsShowAll}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        key: 'showMacerationNotifications',
                        title: t.hsMacerationTitle,
                        sub: t.hsMacerationDesc,
                        Icon: BellRing,
                      },
                      {
                        key: 'showLowStockIngredients',
                        title: t.hsLowStockTitle,
                        sub: t.hsLowStockDesc,
                        Icon: FlaskConical,
                      },
                      {
                        key: 'showQuickAccess',
                        title: t.hsQuickAccessTitle,
                        sub: t.hsQuickAccessDesc,
                        Icon: FolderKanban,
                      },
                      {
                        key: 'showRecentProjects',
                        title: t.hsProjectsTitle,
                        sub: t.hsProjectsDesc,
                        Icon: FileText,
                      },
                      {
                        key: 'showRecentNotes',
                        title: t.hsNotesTitle,
                        sub: t.hsNotesDesc,
                        Icon: NotebookPen,
                      },
                    ] as {
                      key: keyof HomeSectionsSettings;
                      title: string;
                      sub: string;
                      Icon: typeof BellRing;
                    }[]
                  ).map(({ key, title, sub, Icon }) => {
                    const active = homeSections[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        role="switch"
                        aria-checked={active}
                        onClick={() => onChangeHomeSections({ [key]: !active })}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]'
                            : 'border-[#E1DFDD] bg-[#FAF9F8] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
                              active
                                ? 'border-[var(--theme-accent)] bg-white text-[var(--theme-accent)]'
                                : 'border-[#E1DFDD] bg-white text-[#797775]'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#181917]">{title}</div>
                            <div className="mt-0.5 text-[11px] leading-relaxed text-[#605E5C]">
                              {sub}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors shrink-0 ${
                            active ? 'bg-[var(--theme-accent)] justify-end' : 'bg-[#D2D0CE] justify-start'
                          }`}
                        >
                          <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Offline Mode & Cache Management */}
              <OfflineStatusCard language={language} />
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onOpenFile(file);
            e.target.value = '';
            onClose();
          }
        }}
      />
    </div>
  );
}
