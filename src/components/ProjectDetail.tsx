import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Droplets,
  FlaskConical,
  Layers,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  BUDGET_CATEGORY_LABELS,
  CONCENTRATION_TARGET_PERCENT,
  DEFAULT_VIEW_SETTINGS,
  formatUnit,
  getBudgetCategoryLabel,
  getCurrencySymbol,
  getIngredientStatusLabel,
  getJournalVerdictLabel,
  getNoteTierShort,
  getOlfactoryFamilyShort,
  getProjectStatusLabel,
  JOURNAL_VERDICT_LABELS,
  OLFACTORY_FAMILIES,
  PROJECT_STATUS_LABELS,
} from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  BudgetCategory,
  ConcentrationType,
  FormulaComponent,
  Ingredient,
  JournalEntry,
  JournalVerdict,
  LibraryIngredient,
  MacerationBatch,
  MacerationStage,
  MeasurementUnit,
  NoteTier,
  OlfactoryFamilyKey,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectStatus,
  ProjectTab,
  PurchaseRecord,
  ScentEvolutionPoint,
  ViewSettings,
} from '../types/perfume';
import {
  FAMILY_HEX_MAP,
} from '../data/constants';
import {
  calculateFormulaSummary,
  calculatePerceivedFormulaImpact,
  formatCurrencyDecimal,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
  getEffectiveConcentrateGrams,
  getIngredientStockGrams,
  getMacerationStatus,
} from '../utils/calculations';
import { tr } from '../data/i18n';
import { getLocalizedFacetName } from '../data/fraterworksProfiles';
import { resolveIfraStandard } from '../data/ifraStandards';
import { generateId, todayIsoDate } from '../utils/storage';
import { BottleCostCalculator } from './BottleCostCalculator';
import { IngredientDilutionCalculator } from './IngredientDilutionCalculator';
import { OlfactoryMapBuilder } from './OlfactoryMapBuilder';
import {
  createDefaultEvolutionCheckpoints,
  ScentEvolutionEditor,
  ScentEvolutionMiniPreview,
  ScentEvolutionVisualizer,
} from './ScentEvolutionPanel';
import { SolventDilutionCalculator } from './SolventDilutionCalculator';
import type { CartAddPayload } from './SuggestedComponentsModal';

interface ProjectDetailProps {
  project: PerfumeProject;
  allProjects: PerfumeProject[];
  onSwitchProject: (projectId: string) => void;
  activeTab: ProjectTab;
  onChangeTab: (tab: ProjectTab) => void;
  onUpdateProject: (updated: PerfumeProject) => void;
  ingredients: Ingredient[];
  library?: LibraryIngredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  onAddEstimateItem: (item: ProjectEstimateItem) => void;
  onDeleteEstimateItem: (id: string) => void;
  onAddPurchaseRecord: (record: PurchaseRecord) => void;
  onSaveDilutedIngredient?: (ingredient: Ingredient) => void;
  onUpdateIngredient?: (ingredient: Ingredient) => void;
  onAddToCart?: (payload: CartAddPayload, projectId?: string) => void;
  onToast?: (message: string) => void;
  viewSettings?: ViewSettings;
  language?: AppLanguage;
  currency?: AppCurrency;
  defaultConcentrateGrams?: number;
  selectedVariantId?: string | null;
  onSelectVariantId?: (variantId: string | null) => void;
}

interface ProjectDetailText {
  trialPrefix: string;
  defaultEthanolName: string;
  autoCalculatedNote: (conc: string, pct: number) => string;
  snapshotSummary: (grams: string, pct: string, count: number) => string;
  macConcentrateDefault: string;
  macPerfumeDefault: (conc: string) => string;
  macCheckConcentrate: string;
  macCheckPerfume: string;
  fromFormula: string;
  importedFromFormula: string;
  notSpecified: string;
  allProjectsBack: string;
  updatedLabel: string;
  saveAsPdf: string;
  historyBtn: (n: number) => string;
  deleteCurrentProjectTitle: string;
  deleteProjectBtn: string;
  projectCodeAria: string;
  projectStatusAria: string;
  targetConcAria: string;
  bottleLabel: string;
  fragranceTitlePlaceholder: string;
  projectTitleAria: string;
  batchWeightLabel: string;
  pureConcentrateLabel: string;
  materialCostLabel: string;
  tabFormula: string;
  tabIngredients: (n: number) => string;
  tabOlfactory: string;
  tabJournal: (n: number) => string;
  tabCost: (n: number) => string;
  tabDilution: string;
  macerationFinishedAlert: (n: number) => string;
  macerationTimersCount: (n: number) => string;
  ideaConceptLabel: string;
  ideaPlaceholder: string;
  inspirationLabel: string;
  inspirationPlaceholder: string;
  formulaSectionTitle: string;
  pureAromaticBaseLabel: string;
  solventLabel: string;
  pyramidBalanceLabel: string;
  targetMassAria: string;
  scaleBtn: string;
  matchAlcoholTitle: (pct: number) => string;
  matchAlcoholBtn: (conc: string, pct: number) => string;
  topLabel: string;
  heartLabel: string;
  baseLabel: string;
  colComponent: string;
  colTier: string;
  colFamily: string;
  colDilution: string;
  colMassG: (unit: string) => string;
  colPureMat: string;
  colPctFormula: string;
  colPctConc: string;
  colCost: string;
  exceedsIfra: (limit: number | undefined) => string;
  deleteComponentAria: (name: string) => string;
  emptyFormula: string;
  addComponentTitle: string;
  chooseFromCatalogAria: string;
  chooseFromCatalogOption: string;
  manualNamePlaceholder: string;
  massGLabel: (unit: string) => string;
  dilutionPctLabel: string;
  pricePerGramLabel: (unit: string, sym: string) => string;
  noteLabel: string;
  roleInFormulaPlaceholder: string;
  addBtn: string;
  macSectionTitle: string;
  macSectionDesc: string;
  readyForTrial: (n: number) => string;
  macStageConcentrate: string;
  macStagePerfume: string;
  daysShort: string;
  deleteTimerAria: string;
  macFinishedToday: string;
  macFinishedDaysAgo: (d: number) => string;
  macCheckedCompleted: string;
  macDaysLeft: (rem: number, el: number, tot: number) => string;
  logTrialNoteBtn: string;
  markCheckedBtn: string;
  stageLabel: string;
  finishedPerfumeOption: string;
  batchLabel: string;
  batchPlaceholderConcentrate: string;
  batchPlaceholderPerfume: string;
  startDateLabel: string;
  daysLabel: string;
  storageNotePlaceholder: string;
  startTimerBtn: string;
  newNoteTitle: string;
  dateLabel: string;
  verdictLabel: string;
  trialTitleLabel: string;
  trialPlaceholder: string;
  observationsLabel: string;
  observationsPlaceholder: string;
  attachSnapshotLabel: (grams: string) => string;
  recordEvolutionLabel: string;
  ptsShort: string;
  optionalLabel: string;
  saveEntryBtn: string;
  labJournalTitle: string;
  allFilter: string;
  noJournalEntries: string;
  focusChartBtn: string;
  addEvolutionBtn: string;
  deleteEntryAria: (label: string) => string;
  batchRawCostLabel: string;
  perMassPrefix: string;
  oneBottleLabel: (ml: number, mlUnit: string) => string;
  packagingLabel: string;
  plannedEstimateCard: string;
  itemsWord: string;
  actuallyPurchasedCard: string;
  variancePrefix: string;
  procurementTitle: string;
  procurementDesc: string;
  pullFromFormulaBtn: string;
  colItemIngredient: string;
  colCategory: string;
  colRequiredPlan: string;
  colUnitPrice: string;
  colPlanCurrency: (sym: string) => string;
  colBoughtActual: string;
  colStatus: string;
  colActions: string;
  statusCovered: string;
  statusPartial: string;
  statusNotBought: string;
  buyBtn: string;
  deleteItemAria: (name: string) => string;
  emptyProjectEstimate: string;
  logActualPurchaseTitle: string;
  cancelBtn: string;
  qtyWithUnit: (unit: string) => string;
  pricePerUnit: (unit: string, sym: string) => string;
  supplierLabel: string;
  storeNamePlaceholder: string;
  savePurchaseBtn: string;
  addEstimateItemTitle: string;
  ingOrBottlePlaceholder: string;
  noteShortPlaceholder: string;
  requiredLabel: string;
  unitLabel: string;
  estPricePerUnit: (sym: string) => string;
  addToEstimateBtn: string;
}

const PROJECT_DETAIL_TEXT: Record<AppLanguage, ProjectDetailText> = {
  ru: {
    trialPrefix: 'Проба №',
    defaultEthanolName: 'Этанол парфюмерный 96%',
    autoCalculatedNote: (conc, pct) => `Авторасчёт под ${conc} (${pct}%)`,
    snapshotSummary: (grams, pct, count) => `${grams} · ${pct} чистого концентрата · ${count} комп.`,
    macConcentrateDefault: 'Мацерация концентрата',
    macPerfumeDefault: (conc) => `Мацерация духов (${conc})`,
    macCheckConcentrate: 'Проба концентрата',
    macCheckPerfume: 'Проба духов',
    fromFormula: 'Из формулы',
    importedFromFormula: 'Импортировано из формулы',
    notSpecified: 'Не указан',
    allProjectsBack: 'Ко всем проектам',
    updatedLabel: 'Обновлён',
    saveAsPdf: 'Сохранить в PDF',
    historyBtn: (n) => (n > 0 ? `История правок (${n})` : 'История правок'),
    deleteCurrentProjectTitle: 'Удалить текущий проект',
    deleteProjectBtn: 'Удалить проект',
    projectCodeAria: 'Код проекта',
    projectStatusAria: 'Статус проекта',
    targetConcAria: 'Целевая концентрация',
    bottleLabel: 'Флакон:',
    fragranceTitlePlaceholder: 'Название аромата...',
    projectTitleAria: 'Название проекта',
    batchWeightLabel: 'Масса партии',
    pureConcentrateLabel: 'Чистый концентрат',
    materialCostLabel: 'Стоимость сырья',
    tabFormula: 'Идея и формула',
    tabIngredients: (n) => `Ингредиенты (${n})`,
    tabOlfactory: 'Ольфакторная карта',
    tabJournal: (n) => `Записи (${n})`,
    tabCost: (n) => `Смета проекта (${n})`,
    tabDilution: 'Разбавление',
    macerationFinishedAlert: (n) => `Мацерация завершена (${n}) — перейти к проверке`,
    macerationTimersCount: (n) => `Таймеры мацерации: ${n}`,
    ideaConceptLabel: 'Идея и концепция аромата',
    ideaPlaceholder: 'Опишите образ, характер звучания, какую задачу решает композиция...',
    inspirationLabel: 'Вдохновение, сезон и референсы',
    inspirationPlaceholder: 'Ассоциации, материалы, погодные условия, настроение...',
    formulaSectionTitle: 'Состав и соотношение компонентов',
    pureAromaticBaseLabel: 'Чистая ароматическая база:',
    solventLabel: 'Растворитель:',
    pyramidBalanceLabel: 'Баланс пирамиды (В/С/Б):',
    targetMassAria: 'Целевая масса в граммах',
    scaleBtn: 'Масштабировать',
    matchAlcoholTitle: (pct) => `Рассчитать массу спирта для концентрации ${pct}%`,
    matchAlcoholBtn: (conc, pct) => `Подогнать спирт под ${conc} (${pct}%)`,
    topLabel: 'Верхние:',
    heartLabel: 'Сердце:',
    baseLabel: 'База:',
    colComponent: 'Компонент',
    colTier: 'Уровень',
    colFamily: 'Семейство',
    colDilution: 'Развед. %',
    colMassG: (unit) => `Масса (${unit})`,
    colPureMat: 'Чист. в-во',
    colPctFormula: '% формулы',
    colPctConc: '% конц.',
    colCost: 'Стоим.',
    exceedsIfra: (limit) => `Превышен лимит IFRA (${limit}%)`,
    deleteComponentAria: (name) => `Удалить компонент ${name}`,
    emptyFormula: 'Формула пока пуста. Добавьте первый ингредиент ниже.',
    addComponentTitle: 'Добавить компонент в формулу',
    chooseFromCatalogAria: 'Выбрать из базы ингредиентов',
    chooseFromCatalogOption: 'Выбрать из моей базы ингредиентов...',
    manualNamePlaceholder: 'Или введите название вручную...',
    massGLabel: (unit) => `Масса (${unit})`,
    dilutionPctLabel: 'Разведение (%)',
    pricePerGramLabel: (unit, sym) => `Цена за 1 ${unit} (${sym})`,
    noteLabel: 'Заметка',
    roleInFormulaPlaceholder: 'Роль в формуле...',
    addBtn: 'Добавить',
    macSectionTitle: 'Мацерация концентрата и готовых духов',
    macSectionDesc: 'Когда срок мацерации заканчивается, программа показывает уведомление на главной странице во вкладке «Файл».',
    readyForTrial: (n) => `${n} готово к пробе`,
    macStageConcentrate: 'Концентрат',
    macStagePerfume: 'Сами духи',
    daysShort: 'дн.',
    deleteTimerAria: 'Удалить таймер',
    macFinishedToday: 'Мацерация окончена сегодня!',
    macFinishedDaysAgo: (d) => `Мацерация окончена ${d} дн. назад`,
    macCheckedCompleted: 'Проверено · завершена',
    macDaysLeft: (rem, el, tot) => `Осталось ${rem} дн. (${el}/${tot} дн.)`,
    logTrialNoteBtn: 'Заполнить пробу',
    markCheckedBtn: 'Отметить проверенным',
    stageLabel: 'Этап',
    finishedPerfumeOption: 'Сами духи',
    batchLabel: 'Название партии',
    batchPlaceholderConcentrate: 'Напр.: Концентрат №2',
    batchPlaceholderPerfume: 'Напр.: Духи EDP 15%',
    startDateLabel: 'Дата начала',
    daysLabel: 'Срок (дней)',
    storageNotePlaceholder: 'Условия хранения...',
    startTimerBtn: 'Запустить',
    newNoteTitle: 'Новая запись по проекту',
    dateLabel: 'Дата',
    verdictLabel: 'Оценка / итог',
    trialTitleLabel: 'Название пробы / этапа',
    trialPlaceholder: 'Напр.: Проба №2 (день 7 мацерации)',
    observationsLabel: 'Наблюдения с блоттера и кожи',
    observationsPlaceholder: 'Как звучит старт через 15 минут, баланс сердца, что изменить в следующей пробе...',
    attachSnapshotLabel: (grams) => `Зафиксировать параметры текущей формулы (${grams})`,
    recordEvolutionLabel: 'Записать динамику раскрытия (верх / сердце / база)',
    ptsShort: 'точ.',
    optionalLabel: 'Опция',
    saveEntryBtn: 'Сохранить запись',
    labJournalTitle: 'Дневник лабораторных проб',
    allFilter: 'Все',
    noJournalEntries: 'Записей пока нет. Добавьте первую лабораторную заметку слева.',
    focusChartBtn: 'На график',
    addEvolutionBtn: '+ Кривая',
    deleteEntryAria: (label) => `Удалить запись ${label}`,
    batchRawCostLabel: 'Себестоимость замеса',
    perMassPrefix: 'за',
    oneBottleLabel: (ml, mlUnit) => `1 флакон (${ml} ${mlUnit} + тара)`,
    packagingLabel: 'Упаковка:',
    plannedEstimateCard: 'Смета закупок (План)',
    itemsWord: 'позиций',
    actuallyPurchasedCard: 'Фактически закуплено',
    variancePrefix: 'Отклонение:',
    procurementTitle: 'Смета закупок проекта и сверка факта',
    procurementDesc: 'Планируйте требуемое сырьё и фиксируйте реальные покупки прямо по позициям сметы',
    pullFromFormulaBtn: 'Подтянуть компоненты из формулы',
    colItemIngredient: 'Позиция / Ингредиент',
    colCategory: 'Категория',
    colRequiredPlan: 'Нужно (План)',
    colUnitPrice: 'Цена/ед.',
    colPlanCurrency: (sym) => `План (${sym})`,
    colBoughtActual: 'Куплено (Факт)',
    colStatus: 'Статус',
    colActions: 'Действия',
    statusCovered: 'Закрыто',
    statusPartial: 'Частично',
    statusNotBought: 'Не куплено',
    buyBtn: 'Купить',
    deleteItemAria: (name) => `Удалить позицию ${name}`,
    emptyProjectEstimate: 'Смета этого проекта пуста. Добавьте нужные ингредиенты или нажмите «Подтянуть компоненты из формулы».',
    logActualPurchaseTitle: 'Зафиксировать фактическую покупку:',
    cancelBtn: 'Отмена',
    qtyWithUnit: (unit) => `Количество (${unit})`,
    pricePerUnit: (unit, sym) => `Цена за 1 ${unit} (${sym})`,
    supplierLabel: 'Поставщик',
    storeNamePlaceholder: 'Название магазина...',
    savePurchaseBtn: 'Сохранить покупку',
    addEstimateItemTitle: 'Добавить позицию в смету проекта',
    ingOrBottlePlaceholder: 'Название ингредиента или тары...',
    noteShortPlaceholder: 'Примечание...',
    requiredLabel: 'Требуется',
    unitLabel: 'Ед. изм.',
    estPricePerUnit: (sym) => `Предполагаемая цена/ед. (${sym})`,
    addToEstimateBtn: 'В смету проекта',
  },
  en: {
    trialPrefix: 'Trial #',
    defaultEthanolName: 'Perfumer’s Ethanol 96%',
    autoCalculatedNote: (conc, pct) => `Auto-calculated for ${conc} (${pct}%)`,
    snapshotSummary: (grams, pct, count) => `${grams} · ${pct} pure conc. · ${count} comp.`,
    macConcentrateDefault: 'Concentrate maturation',
    macPerfumeDefault: (conc) => `${conc} bottle maceration`,
    macCheckConcentrate: 'Concentrate check',
    macCheckPerfume: 'Perfume check',
    fromFormula: 'From formula',
    importedFromFormula: 'Imported from formula',
    notSpecified: 'Not specified',
    allProjectsBack: 'All projects',
    updatedLabel: 'Updated',
    saveAsPdf: 'Save as PDF',
    historyBtn: (n) => (n > 0 ? `Revision History (${n})` : 'Revision History'),
    deleteCurrentProjectTitle: 'Delete current project',
    deleteProjectBtn: 'Delete project',
    projectCodeAria: 'Project code',
    projectStatusAria: 'Project status',
    targetConcAria: 'Target concentration',
    bottleLabel: 'Bottle:',
    fragranceTitlePlaceholder: 'Fragrance title...',
    projectTitleAria: 'Project title',
    batchWeightLabel: 'Batch weight',
    pureConcentrateLabel: 'Pure concentrate',
    materialCostLabel: 'Material cost',
    tabFormula: 'Idea & Formula',
    tabIngredients: (n) => `Ingredients (${n})`,
    tabOlfactory: 'Olfactory Map',
    tabJournal: (n) => `Notes (${n})`,
    tabCost: (n) => `Project Estimate (${n})`,
    tabDilution: 'Dilution',
    macerationFinishedAlert: (n) => `Maceration finished (${n}) — click to review`,
    macerationTimersCount: (n) => `Maceration timers: ${n}`,
    ideaConceptLabel: 'Fragrance Idea & Concept',
    ideaPlaceholder: 'Describe the imagery, character, and goal of the composition...',
    inspirationLabel: 'Inspiration, Season & References',
    inspirationPlaceholder: 'Associations, materials, weather, mood...',
    formulaSectionTitle: 'Formula Composition & Ratios',
    pureAromaticBaseLabel: 'Pure aromatic base:',
    solventLabel: 'Solvent:',
    pyramidBalanceLabel: 'Pyramid balance (T/H/B):',
    targetMassAria: 'Target mass in grams',
    scaleBtn: 'Scale',
    matchAlcoholTitle: (pct) => `Calculate ethanol weight for ${pct}% concentration`,
    matchAlcoholBtn: (conc, pct) => `Match alcohol to ${conc} (${pct}%)`,
    topLabel: 'Top:',
    heartLabel: 'Heart:',
    baseLabel: 'Base:',
    colComponent: 'Component',
    colTier: 'Tier',
    colFamily: 'Family',
    colDilution: 'Dil. %',
    colMassG: (unit) => `Mass (${unit})`,
    colPureMat: 'Pure mat.',
    colPctFormula: '% formula',
    colPctConc: '% conc.',
    colCost: 'Cost',
    exceedsIfra: (limit) => `Exceeds IFRA limit (${limit}%)`,
    deleteComponentAria: (name) => `Delete component ${name}`,
    emptyFormula: 'Formula is empty. Add the first ingredient below.',
    addComponentTitle: 'Add component to formula',
    chooseFromCatalogAria: 'Choose from ingredient catalog',
    chooseFromCatalogOption: 'Choose from ingredient catalog...',
    manualNamePlaceholder: 'Or enter name manually...',
    massGLabel: (unit) => `Mass (${unit})`,
    dilutionPctLabel: 'Dilution (%)',
    pricePerGramLabel: (unit, sym) => `Price per 1 ${unit} (${sym})`,
    noteLabel: 'Note',
    roleInFormulaPlaceholder: 'Role in formula...',
    addBtn: 'Add',
    macSectionTitle: 'Concentrate & Perfume Maceration Timers',
    macSectionDesc: 'When a timer finishes, the program shows a notification on File → Home and at the top ribbon.',
    readyForTrial: (n) => `${n} ready for trial`,
    macStageConcentrate: 'Concentrate',
    macStagePerfume: 'Perfume',
    daysShort: 'd',
    deleteTimerAria: 'Delete timer',
    macFinishedToday: 'Finished today!',
    macFinishedDaysAgo: (d) => `Finished ${d} d ago`,
    macCheckedCompleted: 'Checked & completed',
    macDaysLeft: (rem, el, tot) => `${rem} d left (${el}/${tot} d)`,
    logTrialNoteBtn: 'Log Trial Note',
    markCheckedBtn: 'Mark Checked',
    stageLabel: 'Stage',
    finishedPerfumeOption: 'Finished Perfume',
    batchLabel: 'Batch label',
    batchPlaceholderConcentrate: 'e.g., Neat base #2',
    batchPlaceholderPerfume: 'e.g., EDP 15% bottle',
    startDateLabel: 'Start date',
    daysLabel: 'Days',
    storageNotePlaceholder: 'Storage note...',
    startTimerBtn: 'Start Timer',
    newNoteTitle: 'New Project Note',
    dateLabel: 'Date',
    verdictLabel: 'Verdict / outcome',
    trialTitleLabel: 'Trial / stage title',
    trialPlaceholder: 'e.g., Trial #2 (maceration day 7)',
    observationsLabel: 'Blotter & skin observations',
    observationsPlaceholder: 'Opening after 15 mins, heart balance, adjustments for next trial...',
    attachSnapshotLabel: (grams) => `Attach current formula metrics (${grams})`,
    recordEvolutionLabel: 'Record scent evolution over time (top / heart / base)',
    ptsShort: 'pts',
    optionalLabel: 'Optional',
    saveEntryBtn: 'Save Entry',
    labJournalTitle: 'Lab Trials Journal',
    allFilter: 'All',
    noJournalEntries: 'No entries yet. Add your first lab note on the left.',
    focusChartBtn: 'Focus chart',
    addEvolutionBtn: '+ Evolution',
    deleteEntryAria: (label) => `Delete entry ${label}`,
    batchRawCostLabel: 'Batch raw cost',
    perMassPrefix: 'per',
    oneBottleLabel: (ml, mlUnit) => `1 bottle (${ml} ${mlUnit} + packaging)`,
    packagingLabel: 'Packaging:',
    plannedEstimateCard: 'Planned estimate',
    itemsWord: 'items',
    actuallyPurchasedCard: 'Actually purchased',
    variancePrefix: 'Variance:',
    procurementTitle: 'Project Procurement Estimate & Reconciliation',
    procurementDesc: 'Plan required raw materials and record actual purchases directly against estimate lines',
    pullFromFormulaBtn: 'Pull components from formula',
    colItemIngredient: 'Item / Ingredient',
    colCategory: 'Category',
    colRequiredPlan: 'Required (Plan)',
    colUnitPrice: 'Unit price',
    colPlanCurrency: (sym) => `Plan (${sym})`,
    colBoughtActual: 'Bought (Actual)',
    colStatus: 'Status',
    colActions: 'Actions',
    statusCovered: 'Covered',
    statusPartial: 'Partial',
    statusNotBought: 'Not bought',
    buyBtn: 'Buy',
    deleteItemAria: (name) => `Delete item ${name}`,
    emptyProjectEstimate: 'This project estimate is empty. Add needed materials below or click «Pull components from formula».',
    logActualPurchaseTitle: 'Log actual purchase:',
    cancelBtn: 'Cancel',
    qtyWithUnit: (unit) => `Quantity (${unit})`,
    pricePerUnit: (unit, sym) => `Price per 1 ${unit} (${sym})`,
    supplierLabel: 'Supplier',
    storeNamePlaceholder: 'Store name...',
    savePurchaseBtn: 'Save purchase',
    addEstimateItemTitle: 'Add item to project estimate',
    ingOrBottlePlaceholder: 'Ingredient or bottle name...',
    noteShortPlaceholder: 'Note...',
    requiredLabel: 'Required',
    unitLabel: 'Unit',
    estPricePerUnit: (sym) => `Estimated price/unit (${sym})`,
    addToEstimateBtn: 'Add to Estimate',
  },
  it: {
    trialPrefix: 'Prova n.',
    defaultEthanolName: 'Etanolo per profumeria 96%',
    autoCalculatedNote: (conc, pct) => `Calcolo automatico per ${conc} (${pct}%)`,
    snapshotSummary: (grams, pct, count) => `${grams} · ${pct} conc. puro · ${count} comp.`,
    macConcentrateDefault: 'Maturazione concentrato',
    macPerfumeDefault: (conc) => `Macerazione profumo (${conc})`,
    macCheckConcentrate: 'Verifica concentrato',
    macCheckPerfume: 'Verifica profumo',
    fromFormula: 'Dalla formula',
    importedFromFormula: 'Importato dalla formula',
    notSpecified: 'Non specificato',
    allProjectsBack: 'Tutti i progetti',
    updatedLabel: 'Aggiornato',
    saveAsPdf: 'Salva in PDF',
    historyBtn: (n) => (n > 0 ? `Cronologia (${n})` : 'Cronologia'),
    deleteCurrentProjectTitle: 'Elimina progetto corrente',
    deleteProjectBtn: 'Elimina progetto',
    projectCodeAria: 'Codice progetto',
    projectStatusAria: 'Stato progetto',
    targetConcAria: 'Concentrazione target',
    bottleLabel: 'Flacone:',
    fragranceTitlePlaceholder: 'Nome della fragranza...',
    projectTitleAria: 'Titolo progetto',
    batchWeightLabel: 'Peso lotto',
    pureConcentrateLabel: 'Concentrato puro',
    materialCostLabel: 'Costo materie',
    tabFormula: 'Idea e Formula',
    tabIngredients: (n) => `Ingredienti (${n})`,
    tabOlfactory: 'Mappa Olfattiva',
    tabJournal: (n) => `Note (${n})`,
    tabCost: (n) => `Preventivo Progetto (${n})`,
    tabDilution: 'Diluizione',
    macerationFinishedAlert: (n) => `Macerazione terminata (${n}) — clicca per verificare`,
    macerationTimersCount: (n) => `Timer macerazione: ${n}`,
    ideaConceptLabel: 'Idea e Concetto della Fragranza',
    ideaPlaceholder: 'Descrivi immaginario, carattere e obiettivo della composizione...',
    inspirationLabel: 'Ispirazione, Stagione e Riferimenti',
    inspirationPlaceholder: 'Associazioni, materiali, clima, atmosfera...',
    formulaSectionTitle: 'Composizione e Rapporti della Formula',
    pureAromaticBaseLabel: 'Base aromatica pura:',
    solventLabel: 'Solvente:',
    pyramidBalanceLabel: 'Equilibrio piramide (T/C/F):',
    targetMassAria: 'Massa target in grammi',
    scaleBtn: 'Scala',
    matchAlcoholTitle: (pct) => `Calcola peso alcol per concentrazione ${pct}%`,
    matchAlcoholBtn: (conc, pct) => `Adatta alcol a ${conc} (${pct}%)`,
    topLabel: 'Testa:',
    heartLabel: 'Cuore:',
    baseLabel: 'Fondo:',
    colComponent: 'Componente',
    colTier: 'Nota',
    colFamily: 'Famiglia',
    colDilution: 'Dil. %',
    colMassG: (unit) => `Massa (${unit})`,
    colPureMat: 'Mat. pura',
    colPctFormula: '% formula',
    colPctConc: '% conc.',
    colCost: 'Costo',
    exceedsIfra: (limit) => `Supera limite IFRA (${limit}%)`,
    deleteComponentAria: (name) => `Elimina componente ${name}`,
    emptyFormula: 'La formula è vuota. Aggiungi il primo ingrediente qui sotto.',
    addComponentTitle: 'Aggiungi componente alla formula',
    chooseFromCatalogAria: 'Scegli dal catalogo ingredienti',
    chooseFromCatalogOption: 'Scegli dal catalogo ingredienti...',
    manualNamePlaceholder: 'Oppure inserisci nome manualmente...',
    massGLabel: (unit) => `Massa (${unit})`,
    dilutionPctLabel: 'Diluizione (%)',
    pricePerGramLabel: (unit, sym) => `Prezzo per 1 ${unit} (${sym})`,
    noteLabel: 'Nota',
    roleInFormulaPlaceholder: 'Ruolo nella formula...',
    addBtn: 'Aggiungi',
    macSectionTitle: 'Timer Macerazione Concentrato e Profumo',
    macSectionDesc: 'Al termine del timer, appare una notifica in File → Home e nella barra superiore.',
    readyForTrial: (n) => `${n} pronti per prova`,
    macStageConcentrate: 'Concentrato',
    macStagePerfume: 'Profumo',
    daysShort: 'gg',
    deleteTimerAria: 'Elimina timer',
    macFinishedToday: 'Terminata oggi!',
    macFinishedDaysAgo: (d) => `Terminata ${d} gg fa`,
    macCheckedCompleted: 'Verificata e completata',
    macDaysLeft: (rem, el, tot) => `${rem} gg rimasti (${el}/${tot} gg)`,
    logTrialNoteBtn: 'Registra Prova',
    markCheckedBtn: 'Segna Verificato',
    stageLabel: 'Fase',
    finishedPerfumeOption: 'Profumo Finito',
    batchLabel: 'Nome lotto',
    batchPlaceholderConcentrate: 'Es. Base pura #2',
    batchPlaceholderPerfume: 'Es. Flacone EDP 15%',
    startDateLabel: 'Data inizio',
    daysLabel: 'Giorni',
    storageNotePlaceholder: 'Note conservazione...',
    startTimerBtn: 'Avvia Timer',
    newNoteTitle: 'Nuova Nota Progetto',
    dateLabel: 'Data',
    verdictLabel: 'Valutazione / esito',
    trialTitleLabel: 'Titolo prova / fase',
    trialPlaceholder: 'Es. Prova n.2 (giorno 7 macerazione)',
    observationsLabel: 'Osservazioni su mouillette e pelle',
    observationsPlaceholder: 'Apertura dopo 15 min, equilibrio del cuore, modifiche per la prossima prova...',
    attachSnapshotLabel: (grams) => `Allega metriche formula attuale (${grams})`,
    recordEvolutionLabel: 'Registra evoluzione olfattiva nel tempo (testa / cuore / fondo)',
    ptsShort: 'pt',
    optionalLabel: 'Opzionale',
    saveEntryBtn: 'Salva Nota',
    labJournalTitle: 'Diario Prove di Laboratorio',
    allFilter: 'Tutti',
    noJournalEntries: 'Nessuna nota ancora. Aggiungi la prima nota a sinistra.',
    focusChartBtn: 'Mostra grafico',
    addEvolutionBtn: '+ Evoluzione',
    deleteEntryAria: (label) => `Elimina nota ${label}`,
    batchRawCostLabel: 'Costo materie lotto',
    perMassPrefix: 'per',
    oneBottleLabel: (ml, mlUnit) => `1 flacone (${ml} ${mlUnit} + packaging)`,
    packagingLabel: 'Packaging:',
    plannedEstimateCard: 'Preventivo pianificato',
    itemsWord: 'voci',
    actuallyPurchasedCard: 'Effettivamente acquistato',
    variancePrefix: 'Scostamento:',
    procurementTitle: 'Preventivo Acquisti Progetto e Riconciliazione',
    procurementDesc: 'Pianifica le materie prime necessarie e registra gli acquisti reali sulle voci di preventivo',
    pullFromFormulaBtn: 'Importa componenti dalla formula',
    colItemIngredient: 'Voce / Ingrediente',
    colCategory: 'Categoria',
    colRequiredPlan: 'Richiesto (Piano)',
    colUnitPrice: 'Prezzo u.',
    colPlanCurrency: (sym) => `Piano (${sym})`,
    colBoughtActual: 'Acquistato (Reale)',
    colStatus: 'Stato',
    colActions: 'Azioni',
    statusCovered: 'Coperto',
    statusPartial: 'Parziale',
    statusNotBought: 'Non acquistato',
    buyBtn: 'Acquista',
    deleteItemAria: (name) => `Elimina voce ${name}`,
    emptyProjectEstimate: 'Il preventivo è vuoto. Aggiungi materiali sotto o clicca «Importa componenti dalla formula».',
    logActualPurchaseTitle: 'Registra acquisto effettivo:',
    cancelBtn: 'Annulla',
    qtyWithUnit: (unit) => `Quantità (${unit})`,
    pricePerUnit: (unit, sym) => `Prezzo per 1 ${unit} (${sym})`,
    supplierLabel: 'Fornitore',
    storeNamePlaceholder: 'Nome negozio...',
    savePurchaseBtn: 'Salva acquisto',
    addEstimateItemTitle: 'Aggiungi voce al preventivo',
    ingOrBottlePlaceholder: 'Nome ingrediente o flacone...',
    noteShortPlaceholder: 'Nota...',
    requiredLabel: 'Richiesto',
    unitLabel: 'Unità',
    estPricePerUnit: (sym) => `Prezzo stimato/u. (${sym})`,
    addToEstimateBtn: 'Aggiungi al Preventivo',
  },
  es: {
    trialPrefix: 'Prueba n.º ',
    defaultEthanolName: 'Etanol de perfumería 96%',
    autoCalculatedNote: (conc, pct) => `Cálculo automático para ${conc} (${pct}%)`,
    snapshotSummary: (grams, pct, count) => `${grams} · ${pct} conc. puro · ${count} comp.`,
    macConcentrateDefault: 'Maduración de concentrado',
    macPerfumeDefault: (conc) => `Maceración de perfume (${conc})`,
    macCheckConcentrate: 'Revisión de concentrado',
    macCheckPerfume: 'Revisión de perfume',
    fromFormula: 'De la fórmula',
    importedFromFormula: 'Importado de la fórmula',
    notSpecified: 'No especificado',
    allProjectsBack: 'Todos los proyectos',
    updatedLabel: 'Actualizado',
    saveAsPdf: 'Guardar en PDF',
    historyBtn: (n) => (n > 0 ? `Historial (${n})` : 'Historial'),
    deleteCurrentProjectTitle: 'Eliminar proyecto actual',
    deleteProjectBtn: 'Eliminar proyecto',
    projectCodeAria: 'Código del proyecto',
    projectStatusAria: 'Estado del proyecto',
    targetConcAria: 'Concentración objetivo',
    bottleLabel: 'Frasco:',
    fragranceTitlePlaceholder: 'Nombre de la fragancia...',
    projectTitleAria: 'Título del proyecto',
    batchWeightLabel: 'Peso del lote',
    pureConcentrateLabel: 'Concentrado puro',
    materialCostLabel: 'Coste de materias',
    tabFormula: 'Idea y Fórmula',
    tabIngredients: (n) => `Ingredientes (${n})`,
    tabOlfactory: 'Mapa Olfativo',
    tabJournal: (n) => `Notas (${n})`,
    tabCost: (n) => `Presupuesto (${n})`,
    tabDilution: 'Dilución',
    macerationFinishedAlert: (n) => `Maceración terminada (${n}) — clic para revisar`,
    macerationTimersCount: (n) => `Temporizadores de maceración: ${n}`,
    ideaConceptLabel: 'Idea y Concepto de la Fragancia',
    ideaPlaceholder: 'Describe el imaginario, carácter y objetivo de la composición...',
    inspirationLabel: 'Inspiración, Temporada y Referencias',
    inspirationPlaceholder: 'Asociaciones, materiales, clima, estado de ánimo...',
    formulaSectionTitle: 'Composición y Proporciones de la Fórmula',
    pureAromaticBaseLabel: 'Base aromática pura:',
    solventLabel: 'Solvente:',
    pyramidBalanceLabel: 'Balance pirámide (S/C/F):',
    targetMassAria: 'Masa objetivo en gramos',
    scaleBtn: 'Escalar',
    matchAlcoholTitle: (pct) => `Calcular peso de alcohol para concentración del ${pct}%`,
    matchAlcoholBtn: (conc, pct) => `Ajustar alcohol a ${conc} (${pct}%)`,
    topLabel: 'Salida:',
    heartLabel: 'Corazón:',
    baseLabel: 'Fondo:',
    colComponent: 'Componente',
    colTier: 'Nivel',
    colFamily: 'Familia',
    colDilution: 'Dil. %',
    colMassG: (unit) => `Masa (${unit})`,
    colPureMat: 'Mat. pura',
    colPctFormula: '% fórmula',
    colPctConc: '% conc.',
    colCost: 'Coste',
    exceedsIfra: (limit) => `Supera límite IFRA (${limit}%)`,
    deleteComponentAria: (name) => `Eliminar componente ${name}`,
    emptyFormula: 'La fórmula está vacía. Añade el primer ingrediente abajo.',
    addComponentTitle: 'Añadir componente a la fórmula',
    chooseFromCatalogAria: 'Elegir del catálogo de ingredientes',
    chooseFromCatalogOption: 'Elegir del catálogo de ingredientes...',
    manualNamePlaceholder: 'O escribe el nombre manualmente...',
    massGLabel: (unit) => `Masa (${unit})`,
    dilutionPctLabel: 'Dilución (%)',
    pricePerGramLabel: (unit, sym) => `Precio por 1 ${unit} (${sym})`,
    noteLabel: 'Nota',
    roleInFormulaPlaceholder: 'Rol en la fórmula...',
    addBtn: 'Añadir',
    macSectionTitle: 'Temporizadores de Maceración de Concentrado y Perfume',
    macSectionDesc: 'Cuando termina un temporizador, aparece una notificación en Archivo → Inicio y en la barra superior.',
    readyForTrial: (n) => `${n} listos para prueba`,
    macStageConcentrate: 'Concentrado',
    macStagePerfume: 'Perfume',
    daysShort: 'd',
    deleteTimerAria: 'Eliminar temporizador',
    macFinishedToday: '¡Terminó hoy!',
    macFinishedDaysAgo: (d) => `Terminó hace ${d} d`,
    macCheckedCompleted: 'Revisado y completado',
    macDaysLeft: (rem, el, tot) => `${rem} d restantes (${el}/${tot} d)`,
    logTrialNoteBtn: 'Registrar Prueba',
    markCheckedBtn: 'Marcar Revisado',
    stageLabel: 'Etapa',
    finishedPerfumeOption: 'Perfume Terminado',
    batchLabel: 'Etiqueta del lote',
    batchPlaceholderConcentrate: 'Ej. Base pura n.º 2',
    batchPlaceholderPerfume: 'Ej. Frasco EDP 15%',
    startDateLabel: 'Fecha inicio',
    daysLabel: 'Días',
    storageNotePlaceholder: 'Nota de almacenamiento...',
    startTimerBtn: 'Iniciar',
    newNoteTitle: 'Nueva Nota del Proyecto',
    dateLabel: 'Fecha',
    verdictLabel: 'Veredicto / resultado',
    trialTitleLabel: 'Título de prueba / etapa',
    trialPlaceholder: 'Ej. Prueba n.º 2 (día 7 maceración)',
    observationsLabel: 'Observaciones en secante y piel',
    observationsPlaceholder: 'Apertura tras 15 min, equilibrio del corazón, ajustes para la próxima prueba...',
    attachSnapshotLabel: (grams) => `Adjuntar métricas actuales (${grams})`,
    recordEvolutionLabel: 'Registrar evolución del aroma en el tiempo (salida / corazón / fondo)',
    ptsShort: 'pts',
    optionalLabel: 'Opcional',
    saveEntryBtn: 'Guardar Nota',
    labJournalTitle: 'Diario de Pruebas de Laboratorio',
    allFilter: 'Todos',
    noJournalEntries: 'Aún no hay notas. Añade la primera nota a la izquierda.',
    focusChartBtn: 'Ver gráfico',
    addEvolutionBtn: '+ Evolución',
    deleteEntryAria: (label) => `Eliminar nota ${label}`,
    batchRawCostLabel: 'Coste materias del lote',
    perMassPrefix: 'por',
    oneBottleLabel: (ml, mlUnit) => `1 frasco (${ml} ${mlUnit} + envase)`,
    packagingLabel: 'Envase:',
    plannedEstimateCard: 'Presupuesto planificado',
    itemsWord: 'partidas',
    actuallyPurchasedCard: 'Comprado realmente',
    variancePrefix: 'Desviación:',
    procurementTitle: 'Presupuesto del Proyecto y Conciliación de Compras',
    procurementDesc: 'Planifica materias primas requeridas y registra compras reales sobre las partidas',
    pullFromFormulaBtn: 'Importar componentes de la fórmula',
    colItemIngredient: 'Artículo / Ingrediente',
    colCategory: 'Categoría',
    colRequiredPlan: 'Requerido (Plan)',
    colUnitPrice: 'Precio u.',
    colPlanCurrency: (sym) => `Plan (${sym})`,
    colBoughtActual: 'Comprado (Real)',
    colStatus: 'Estado',
    colActions: 'Acciones',
    statusCovered: 'Cubierto',
    statusPartial: 'Parcial',
    statusNotBought: 'No comprado',
    buyBtn: 'Comprar',
    deleteItemAria: (name) => `Eliminar partida ${name}`,
    emptyProjectEstimate: 'Este presupuesto está vacío. Añade materiales abajo o pulsa «Importar componentes de la fórmula».',
    logActualPurchaseTitle: 'Registrar compra real:',
    cancelBtn: 'Cancelar',
    qtyWithUnit: (unit) => `Cantidad (${unit})`,
    pricePerUnit: (unit, sym) => `Precio por 1 ${unit} (${sym})`,
    supplierLabel: 'Proveedor',
    storeNamePlaceholder: 'Nombre de tienda...',
    savePurchaseBtn: 'Guardar compra',
    addEstimateItemTitle: 'Añadir partida al presupuesto',
    ingOrBottlePlaceholder: 'Nombre de ingrediente o frasco...',
    noteShortPlaceholder: 'Nota...',
    requiredLabel: 'Requerido',
    unitLabel: 'Unidad',
    estPricePerUnit: (sym) => `Precio estimado/u. (${sym})`,
    addToEstimateBtn: 'Añadir al Presupuesto',
  },
  de: {
    trialPrefix: 'Probe Nr. ',
    defaultEthanolName: 'Parfümerie-Ethanol 96%',
    autoCalculatedNote: (conc, pct) => `Automatisch berechnet für ${conc} (${pct}%)`,
    snapshotSummary: (grams, pct, count) => `${grams} · ${pct} reine Konz. · ${count} Komp.`,
    macConcentrateDefault: 'Reifung Konzentrat',
    macPerfumeDefault: (conc) => `Mazeration Parfüm (${conc})`,
    macCheckConcentrate: 'Konzentrat-Prüfung',
    macCheckPerfume: 'Parfüm-Prüfung',
    fromFormula: 'Aus Formel',
    importedFromFormula: 'Aus Formel importiert',
    notSpecified: 'Nicht angegeben',
    allProjectsBack: 'Alle Projekte',
    updatedLabel: 'Aktualisiert',
    saveAsPdf: 'Als PDF speichern',
    historyBtn: (n) => (n > 0 ? `Verlauf (${n})` : 'Verlauf'),
    deleteCurrentProjectTitle: 'Aktuelles Projekt löschen',
    deleteProjectBtn: 'Projekt löschen',
    projectCodeAria: 'Projektcode',
    projectStatusAria: 'Projektstatus',
    targetConcAria: 'Zielkonzentration',
    bottleLabel: 'Flakon:',
    fragranceTitlePlaceholder: 'Duftname...',
    projectTitleAria: 'Projekttitel',
    batchWeightLabel: 'Chargengewicht',
    pureConcentrateLabel: 'Reines Konzentrat',
    materialCostLabel: 'Materialkosten',
    tabFormula: 'Idee & Formel',
    tabIngredients: (n) => `Rohstoffe (${n})`,
    tabOlfactory: 'Duftkarte',
    tabJournal: (n) => `Notizen (${n})`,
    tabCost: (n) => `Projektbudget (${n})`,
    tabDilution: 'Verdünnung',
    macerationFinishedAlert: (n) => `Mazeration beendet (${n}) — zum Prüfen klicken`,
    macerationTimersCount: (n) => `Mazerations-Timer: ${n}`,
    ideaConceptLabel: 'Duftidee & Konzept',
    ideaPlaceholder: 'Beschreiben Sie Bildsprache, Charakter und Ziel der Komposition...',
    inspirationLabel: 'Inspiration, Saison & Referenzen',
    inspirationPlaceholder: 'Assoziationen, Materialien, Wetter, Stimmung...',
    formulaSectionTitle: 'Formelzusammensetzung & Anteile',
    pureAromaticBaseLabel: 'Reine Duftbasis:',
    solventLabel: 'Lösungsmittel:',
    pyramidBalanceLabel: 'Pyramiden-Balance (K/H/B):',
    targetMassAria: 'Zielmasse in Gramm',
    scaleBtn: 'Skalieren',
    matchAlcoholTitle: (pct) => `Alkoholgewicht für ${pct}% Konzentration berechnen`,
    matchAlcoholBtn: (conc, pct) => `Alkohol auf ${conc} (${pct}%) abstimmen`,
    topLabel: 'Kopf:',
    heartLabel: 'Herz:',
    baseLabel: 'Basis:',
    colComponent: 'Komponente',
    colTier: 'Note',
    colFamily: 'Familie',
    colDilution: 'Verd. %',
    colMassG: (unit) => `Masse (${unit})`,
    colPureMat: 'Reinstoff',
    colPctFormula: '% Formel',
    colPctConc: '% Konz.',
    colCost: 'Kosten',
    exceedsIfra: (limit) => `Überschreitet IFRA-Limit (${limit}%)`,
    deleteComponentAria: (name) => `Komponente ${name} löschen`,
    emptyFormula: 'Formel ist leer. Unten erste Zutat hinzufügen.',
    addComponentTitle: 'Komponente zur Formel hinzufügen',
    chooseFromCatalogAria: 'Aus Zutatenkatalog wählen',
    chooseFromCatalogOption: 'Aus Zutatenkatalog wählen...',
    manualNamePlaceholder: 'Oder Namen manuell eingeben...',
    massGLabel: (unit) => `Masse (${unit})`,
    dilutionPctLabel: 'Verdünnung (%)',
    pricePerGramLabel: (unit, sym) => `Preis pro 1 ${unit} (${sym})`,
    noteLabel: 'Notiz',
    roleInFormulaPlaceholder: 'Rolle in der Formel...',
    addBtn: 'Hinzufügen',
    macSectionTitle: 'Mazerations-Timer für Konzentrat & Parfüm',
    macSectionDesc: 'Wenn ein Timer abläuft, erscheint ein Hinweis unter Datei → Start und in der oberen Leiste.',
    readyForTrial: (n) => `${n} bereit zur Probe`,
    macStageConcentrate: 'Konzentrat',
    macStagePerfume: 'Parfüm',
    daysShort: 'T',
    deleteTimerAria: 'Timer löschen',
    macFinishedToday: 'Heute beendet!',
    macFinishedDaysAgo: (d) => `Vor ${d} T beendet`,
    macCheckedCompleted: 'Geprüft & abgeschlossen',
    macDaysLeft: (rem, el, tot) => `${rem} T übrig (${el}/${tot} T)`,
    logTrialNoteBtn: 'Probe erfassen',
    markCheckedBtn: 'Als geprüft markieren',
    stageLabel: 'Phase',
    finishedPerfumeOption: 'Fertiges Parfüm',
    batchLabel: 'Chargenname',
    batchPlaceholderConcentrate: 'z. B. Reine Basis #2',
    batchPlaceholderPerfume: 'z. B. EDP 15% Flakon',
    startDateLabel: 'Startdatum',
    daysLabel: 'Tage',
    storageNotePlaceholder: 'Lagerhinweis...',
    startTimerBtn: 'Timer starten',
    newNoteTitle: 'Neue Projektnotiz',
    dateLabel: 'Datum',
    verdictLabel: 'Bewertung / Ergebnis',
    trialTitleLabel: 'Proben- / Phasentitel',
    trialPlaceholder: 'z. B. Probe Nr. 2 (Tag 7 Mazeration)',
    observationsLabel: 'Beobachtungen auf Streifen & Haut',
    observationsPlaceholder: 'Auftakt nach 15 Min., Herzbalance, Anpassungen für die nächste Probe...',
    attachSnapshotLabel: (grams) => `Aktuelle Formeldaten anhängen (${grams})`,
    recordEvolutionLabel: 'Duftverlauf über Zeit erfassen (Kopf / Herz / Basis)',
    ptsShort: 'Pkt',
    optionalLabel: 'Optional',
    saveEntryBtn: 'Eintrag speichern',
    labJournalTitle: 'Labor-Probenjournal',
    allFilter: 'Alle',
    noJournalEntries: 'Noch keine Einträge. Links erste Labornotiz hinzufügen.',
    focusChartBtn: 'Im Diagramm',
    addEvolutionBtn: '+ Verlauf',
    deleteEntryAria: (label) => `Eintrag ${label} löschen`,
    batchRawCostLabel: 'Rohstoffkosten Charge',
    perMassPrefix: 'pro',
    oneBottleLabel: (ml, mlUnit) => `1 Flakon (${ml} ${mlUnit} + Verpackung)`,
    packagingLabel: 'Verpackung:',
    plannedEstimateCard: 'Geplantes Budget',
    itemsWord: 'Positionen',
    actuallyPurchasedCard: 'Tatsächlich gekauft',
    variancePrefix: 'Abweichung:',
    procurementTitle: 'Projektbudget & Einkaufsabgleich',
    procurementDesc: 'Benötigte Rohstoffe planen und tatsächliche Einkäufe direkt verbuchen',
    pullFromFormulaBtn: 'Komponenten aus Formel übernehmen',
    colItemIngredient: 'Position / Zutat',
    colCategory: 'Kategorie',
    colRequiredPlan: 'Benötigt (Plan)',
    colUnitPrice: 'Stückpreis',
    colPlanCurrency: (sym) => `Plan (${sym})`,
    colBoughtActual: 'Gekauft (Ist)',
    colStatus: 'Status',
    colActions: 'Aktionen',
    statusCovered: 'Gedeckt',
    statusPartial: 'Teilweise',
    statusNotBought: 'Nicht gekauft',
    buyBtn: 'Kaufen',
    deleteItemAria: (name) => `Position ${name} löschen`,
    emptyProjectEstimate: 'Dieses Projektbudget ist leer. Unten Material hinzufügen oder «Komponenten aus Formel übernehmen» klicken.',
    logActualPurchaseTitle: 'Tatsächlichen Kauf erfassen:',
    cancelBtn: 'Abbrechen',
    qtyWithUnit: (unit) => `Menge (${unit})`,
    pricePerUnit: (unit, sym) => `Preis pro 1 ${unit} (${sym})`,
    supplierLabel: 'Lieferant',
    storeNamePlaceholder: 'Shopname...',
    savePurchaseBtn: 'Kauf speichern',
    addEstimateItemTitle: 'Position zum Projektbudget hinzufügen',
    ingOrBottlePlaceholder: 'Name der Zutat oder des Flakons...',
    noteShortPlaceholder: 'Notiz...',
    requiredLabel: 'Benötigt',
    unitLabel: 'Einheit',
    estPricePerUnit: (sym) => `Geschätzter Preis/Einh. (${sym})`,
    addToEstimateBtn: 'Zum Budget hinzufügen',
  },
};

export function ProjectDetail({
  project,
  allProjects,
  onSwitchProject,
  activeTab,
  onChangeTab,
  onUpdateProject,
  ingredients,
  library = [],
  estimates,
  purchases,
  onAddEstimateItem,
  onDeleteEstimateItem,
  onAddPurchaseRecord,
  onSaveDilutedIngredient,
  onToast,
  onUpdateIngredient,
  onAddToCart,
  viewSettings = DEFAULT_VIEW_SETTINGS,
  language = 'ru',
  currency = 'RUB',
  defaultConcentrateGrams = 10,
  selectedVariantId: controlledVariantId,
  onSelectVariantId,
}: ProjectDetailProps) {
  const t = PROJECT_DETAIL_TEXT[language];
  const currencySymbol = getCurrencySymbol(currency);
  const summary = useMemo(() => calculateFormulaSummary(project.components), [project.components]);
  const effectiveConcentrateGrams = useMemo(
    () => getEffectiveConcentrateGrams(project, defaultConcentrateGrams),
    [project.components, project.targetConcentrateGrams, defaultConcentrateGrams]
  );
  const perceivedFormula = useMemo(
    () => calculatePerceivedFormulaImpact(project.components, ingredients, library),
    [project.components, ingredients, library]
  );

  // Project Ingredients Tab State (supports main formula and variants + Состав/Склад switcher)
  const [uncontrolledVariantId, setUncontrolledVariantId] = useState<string | null>(null);
  const selectedVariantId =
    controlledVariantId !== undefined ? controlledVariantId : uncontrolledVariantId;
  const setSelectedVariantId = onSelectVariantId || setUncontrolledVariantId;
  const [ingredientsViewMode, setIngredientsViewMode] = useState<'composition' | 'stock'>('composition');
  const [projIngSearch, setProjIngSearch] = useState('');
  const [projIngTierFilter, setProjIngTierFilter] = useState<'all' | NoteTier>('all');
  const [estPickerSearch, setEstPickerSearch] = useState('');

  const studioIngredientNamesSet = useMemo(
    () => new Set(ingredients.map((ing) => ing.name.trim().toLowerCase())),
    [ingredients]
  );

  const estSelectOptions = useMemo(() => {
    const q = estPickerSearch.trim().toLowerCase();
    const ingList = !q
      ? ingredients
      : ingredients.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.bottleLabel || '').toLowerCase().includes(q) ||
            (i.inciOrCas || '').toLowerCase().includes(q)
        );
    const libList = library
      .filter((l) => {
        if (studioIngredientNamesSet.has(l.name.trim().toLowerCase())) return false;
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          (l.inciOrCas || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 60);
    return { ingList, libList };
  }, [estPickerSearch, ingredients, library, studioIngredientNamesSet]);

  // Journal Form State
  const [journalDate, setJournalDate] = useState(todayIsoDate());
  const [journalTrial, setJournalTrial] = useState(`${t.trialPrefix}${project.journal.length + 1}`);
  const [journalVerdict, setJournalVerdict] = useState<JournalVerdict>('promising');
  const [journalContent, setJournalContent] = useState('');
  const [attachSnapshot, setAttachSnapshot] = useState(true);
  const [recordEvolution, setRecordEvolution] = useState(false);
  const [evolutionPoints, setEvolutionPoints] = useState<ScentEvolutionPoint[]>(() =>
    createDefaultEvolutionCheckpoints(language)
  );
  const [selectedEvolutionEntryId, setSelectedEvolutionEntryId] = useState<string | null>(
    () => project.journal.find((j) => j.scentEvolution && j.scentEvolution.length > 0)?.id || null
  );
  const [verdictFilter, setVerdictFilter] = useState<'all' | JournalVerdict>('all');

  // Maceration Timer State
  const [macStage, setMacStage] = useState<MacerationStage>('concentrate');
  const [macLabel, setMacLabel] = useState('');
  const [macStartDate, setMacStartDate] = useState(todayIsoDate());
  const [macDurationDays, setMacDurationDays] = useState('14');
  const [macNotes, setMacNotes] = useState('');

  useEffect(() => {
    setJournalTrial((prev) => {
      const m = prev.match(/^(?:Проба №|Trial #|Prova n\.|Prueba n\.º |Probe Nr\. )(\d+)$/);
      if (!m) return prev;
      return `${t.trialPrefix}${m[1]}`;
    });
  }, [t.trialPrefix]);

  useEffect(() => {
    const firstWithCurve =
      project.journal.find((j) => j.scentEvolution && j.scentEvolution.length > 0)?.id ||
      project.journal[0]?.id ||
      null;
    setSelectedEvolutionEntryId(firstWithCurve);
  }, [project.id]);

  // Project Estimate Form State
  const [estIngredientId, setEstIngredientId] = useState('');
  const [estName, setEstName] = useState('');
  const [estCategory, setEstCategory] = useState<BudgetCategory>('raw_materials');
  const [estQty, setEstQty] = useState('10');
  const [estUnit, setEstUnit] = useState<MeasurementUnit>('г');
  const [estUnitPrice, setEstUnitPrice] = useState('0');
  const [estNotes, setEstNotes] = useState('');

  // Quick Purchase Log Modal/Inline State for an Estimate Item
  const [quickPurchaseEstimateId, setQuickPurchaseEstimateId] = useState<string | null>(null);
  const [qpQty, setQpQty] = useState('');
  const [qpUnitPrice, setQpUnitPrice] = useState('');
  const [qpSupplier, setQpSupplier] = useState('');
  const [qpDate, setQpDate] = useState(todayIsoDate());

  const patchProject = (patch: Partial<PerfumeProject>) => {
    onUpdateProject({
      ...project,
      ...patch,
      updatedAt: todayIsoDate(),
    });
  };

  const currentVariant = selectedVariantId
    ? (project.variants || []).find((v) => v.id === selectedVariantId) || null
    : null;
  const activeComponents = currentVariant ? currentVariant.components : project.components;
  const activeSummary = useMemo(
    () => calculateFormulaSummary(activeComponents),
    [activeComponents]
  );
  const activeConcentrateGrams = useMemo(
    () =>
      getEffectiveConcentrateGrams(
        {
          components: activeComponents,
          targetConcentrateGrams: project.targetConcentrateGrams,
        },
        defaultConcentrateGrams
      ),
    [activeComponents, project.targetConcentrateGrams, defaultConcentrateGrams]
  );
  const activeConcPct =
    activeConcentrateGrams > 0
      ? (activeSummary.aromaticMixtureGrams / activeConcentrateGrams) * 100
      : 0;
  const activePerceivedFormula = useMemo(
    () => calculatePerceivedFormulaImpact(activeComponents, ingredients, library),
    [activeComponents, ingredients, library]
  );

  const updateActiveComponents = (
    nextComponents: FormulaComponent[],
    extraPatch?: Partial<PerfumeProject>
  ) => {
    if (currentVariant) {
      patchProject({
        ...extraPatch,
        variants: (project.variants || []).map((v) =>
          v.id === currentVariant.id ? { ...v, components: nextComponents } : v
        ),
      });
    } else {
      patchProject({
        ...extraPatch,
        components: nextComponents,
      });
    }
  };

  const handleNormalizeConcentrateToTarget = () => {
    if (activeSummary.aromaticMixtureGrams <= 0 || activeConcentrateGrams <= 0) return;
    const ratio = activeConcentrateGrams / activeSummary.aromaticMixtureGrams;
    updateActiveComponents(
      activeComponents.map((c) => {
        if (c.tier === 'solvent') return c;
        return {
          ...c,
          weightGrams: Number((Math.max(0, c.weightGrams) * ratio).toFixed(3)),
        };
      }),
      { targetConcentrateGrams: Number(activeConcentrateGrams.toFixed(2)) }
    );
  };

  const handleUpdateComponent = (id: string, patch: Partial<FormulaComponent>) => {
    updateActiveComponents(
      activeComponents.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const handleDeleteComponent = (id: string) => {
    updateActiveComponents(activeComponents.filter((c) => c.id !== id));
  };

  const handleAdjustSolventToTargetConcentration = () => {
    const targetPct = CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct;
    if (activeSummary.pureAromaticGrams <= 0 || targetPct <= 0 || targetPct >= 100) return;

    const requiredTotalMass = activeSummary.pureAromaticGrams / (targetPct / 100);
    // Non-solvent diluted components already carry (aromaticMixtureGrams - pureAromaticGrams) of carrier
    const neededSolventWeight = Math.max(
      0,
      Number((requiredTotalMass - activeSummary.aromaticMixtureGrams).toFixed(2))
    );

    const existingSolventIdx = activeComponents.findIndex((c) => c.tier === 'solvent');
    if (existingSolventIdx >= 0) {
      const updated = activeComponents.map((c, idx) =>
        idx === existingSolventIdx ? { ...c, weightGrams: neededSolventWeight } : c
      );
      updateActiveComponents(updated);
    } else {
      const ethanolIng = ingredients.find((i) => i.tier === 'solvent');
      const costPerG =
        ethanolIng && ethanolIng.quantityGrams > 0
          ? ethanolIng.priceTotal / ethanolIng.quantityGrams
          : 3;
      const solventComp: FormulaComponent = {
        id: generateId('fc'),
        ingredientId: ethanolIng?.id,
        name: ethanolIng?.name || t.defaultEthanolName,
        tier: 'solvent',
        family: 'aquatic',
        dilutionPercent: 100,
        weightGrams: neededSolventWeight,
        costPerGram: Number(costPerG.toFixed(2)),
        note: t.autoCalculatedNote(project.targetConcentration, targetPct),
      };
      updateActiveComponents([...activeComponents, solventComp]);
    }
    onToast?.(
      tr(language, {
        ru: `Спирт подобран: ${formatGrams(neededSolventWeight, 2, language)} под ${project.targetConcentration} (${targetPct}%)`,
        en: `Alcohol matched: ${formatGrams(neededSolventWeight, 2, language)} for ${project.targetConcentration} (${targetPct}%)`,
        it: `Alcol adattato: ${formatGrams(neededSolventWeight, 2, language)} per ${project.targetConcentration} (${targetPct}%)`,
        es: `Alcohol ajustado: ${formatGrams(neededSolventWeight, 2, language)} para ${project.targetConcentration} (${targetPct}%)`,
        de: `Alkohol angepasst: ${formatGrams(neededSolventWeight, 2, language)} für ${project.targetConcentration} (${targetPct}%)`,
      })
    );
  };

  const handleAddJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    const entryId = generateId('j');
    const entry: JournalEntry = {
      id: entryId,
      date: journalDate || todayIsoDate(),
      trialLabel: journalTrial.trim() || `${t.trialPrefix}${project.journal.length + 1}`,
      verdict: journalVerdict,
      content: journalContent.trim(),
      formulaSnapshotSummary: attachSnapshot
        ? t.snapshotSummary(
            formatGrams(summary.totalWeightGrams, 2, language),
            formatPercent(summary.pureConcentrationPercent, 1),
            project.components.length
          )
        : undefined,
      scentEvolution:
        recordEvolution && evolutionPoints.length > 0
          ? [...evolutionPoints].sort(
              (a, b) => a.minutesFromApplication - b.minutesFromApplication
            )
          : undefined,
    };
    patchProject({
      journal: [entry, ...project.journal],
    });
    if (entry.scentEvolution) {
      setSelectedEvolutionEntryId(entryId);
    }
    setJournalTrial(`${t.trialPrefix}${project.journal.length + 2}`);
    setJournalContent('');
    setRecordEvolution(false);
    setEvolutionPoints(createDefaultEvolutionCheckpoints(language));
  };

  const handleUpdateJournalEntryEvolution = (
    entryId: string,
    points: ScentEvolutionPoint[] | undefined
  ) => {
    patchProject({
      journal: project.journal.map((j) =>
        j.id === entryId ? { ...j, scentEvolution: points } : j
      ),
    });
    setSelectedEvolutionEntryId(entryId);
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    patchProject({
      journal: project.journal.filter((j) => j.id !== entryId),
    });
    if (selectedEvolutionEntryId === entryId) {
      const next = project.journal.find((j) => j.id !== entryId);
      setSelectedEvolutionEntryId(next?.id || null);
    }
  };

  const todayIso = todayIsoDate();
  const projectMacerations = project.macerations || [];
  const readyMacerationCount = useMemo(
    () =>
      projectMacerations.filter(
        (m) => getMacerationStatus(m, todayIso).isComplete && !m.acknowledged
      ).length,
    [projectMacerations, todayIso]
  );

  const handleAddMacerationBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultLabel =
      macStage === 'concentrate'
        ? t.macConcentrateDefault
        : t.macPerfumeDefault(project.targetConcentration);

    const newBatch: MacerationBatch = {
      id: generateId('mac'),
      stage: macStage,
      label: macLabel.trim() || defaultLabel,
      startDate: macStartDate || todayIsoDate(),
      durationDays: Math.max(1, Math.min(365, Math.round(Number(macDurationDays) || 14))),
      notes: macNotes.trim() || undefined,
      acknowledged: false,
    };

    patchProject({
      macerations: [newBatch, ...projectMacerations],
    });
    setMacLabel('');
    setMacNotes('');
  };

  const handleAcknowledgeMacerationBatch = (batchId: string) => {
    patchProject({
      macerations: projectMacerations.map((m) =>
        m.id === batchId ? { ...m, acknowledged: true } : m
      ),
    });
  };

  const handleDeleteMacerationBatch = (batchId: string) => {
    patchProject({
      macerations: projectMacerations.filter((m) => m.id !== batchId),
    });
  };

  const handlePrepareTrialFromMaceration = (batch: MacerationBatch) => {
    const stageText =
      batch.stage === 'concentrate' ? t.macCheckConcentrate : t.macCheckPerfume;
    setJournalTrial(`${stageText}: ${batch.label}`);
    setJournalDate(todayIsoDate());
    handleAcknowledgeMacerationBatch(batch.id);
  };

  // Project Estimates & Matched Purchases
  const projectEstimates = useMemo(
    () => estimates.filter((e) => e.projectId === project.id),
    [estimates, project.id]
  );

  const projectPurchases = useMemo(
    () => purchases.filter((p) => p.projectId === project.id),
    [purchases, project.id]
  );

  const handleSelectEstIngredient = (ingId: string) => {
    setEstIngredientId(ingId);
    if (ingId.startsWith('lib:')) {
      const libId = ingId.slice(4);
      const libItem = library.find((l) => l.id === libId);
      if (!libItem) return;
      setEstName(libItem.name);
      setEstCategory(libItem.tier === 'solvent' ? 'solvent' : 'raw_materials');
      setEstUnit('г');
      setEstQty('10');
      setEstUnitPrice('0');
      return;
    }
    const ing = ingredients.find((i) => i.id === ingId);
    if (!ing) return;
    setEstName(ing.name);
    setEstCategory(ing.tier === 'solvent' ? 'solvent' : 'raw_materials');
    setEstUnit(ing.unit);
    setEstQty(String(ing.quantityGrams));
    const unitPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setEstUnitPrice(unitPrice.toFixed(2));
  };

  const handleCreateEstimateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estName.trim()) return;
    const resolvedIngId =
      estIngredientId && !estIngredientId.startsWith('lib:') ? estIngredientId : undefined;
    onAddEstimateItem({
      id: generateId('est'),
      projectId: project.id,
      ingredientId: resolvedIngId,
      ingredientName: estName.trim(),
      category: estCategory,
      requiredQuantity: Math.max(0, Number(estQty) || 0),
      unit: estUnit,
      estimatedUnitPrice: Math.max(0, Number(estUnitPrice) || 0),
      notes: estNotes.trim() || undefined,
    });
    setEstIngredientId('');
    setEstPickerSearch('');
    setEstName('');
    setEstQty('10');
    setEstUnitPrice('0');
    setEstNotes('');
  };

  const handleImportMissingFromFormula = () => {
    let added = 0;
    for (const comp of project.components) {
      const alreadyInEstimate = projectEstimates.some(
        (e) =>
          (comp.ingredientId && e.ingredientId === comp.ingredientId) ||
          e.ingredientName.toLowerCase() === comp.name.toLowerCase()
      );
      if (alreadyInEstimate) continue;

      const linkedIng = ingredients.find((i) => i.id === comp.ingredientId);
      // Only suggest adding if it's missing or not yet in estimate
      const unitPrice =
        linkedIng && linkedIng.quantityGrams > 0
          ? linkedIng.priceTotal / linkedIng.quantityGrams
          : comp.costPerGram || 0;

      onAddEstimateItem({
        id: generateId('est'),
        projectId: project.id,
        ingredientId: comp.ingredientId,
        ingredientName: comp.name,
        category: comp.tier === 'solvent' ? 'solvent' : 'raw_materials',
        requiredQuantity: Math.max(comp.weightGrams, linkedIng?.quantityGrams || comp.weightGrams),
        unit: linkedIng?.unit || 'г',
        estimatedUnitPrice: Number(unitPrice.toFixed(2)),
        notes: linkedIng
          ? `${t.fromFormula} (${getIngredientStatusLabel(linkedIng.status, language)})`
          : t.importedFromFormula,
      });
      added++;
    }
    return added;
  };

  const openQuickPurchase = (item: ProjectEstimateItem) => {
    setQuickPurchaseEstimateId(item.id);
    setQpQty(String(item.requiredQuantity));
    setQpUnitPrice(String(item.estimatedUnitPrice));
    const linked = ingredients.find((i) => i.id === item.ingredientId);
    setQpSupplier(linked?.supplier || '');
    setQpDate(todayIsoDate());
  };

  const submitQuickPurchase = (item: ProjectEstimateItem) => {
    const qty = Math.max(0, Number(qpQty) || 0);
    const uPrice = Math.max(0, Number(qpUnitPrice) || 0);
    if (qty <= 0) return;

    onAddPurchaseRecord({
      id: generateId('pur'),
      date: qpDate || todayIsoDate(),
      ingredientName: item.ingredientName,
      ingredientId: item.ingredientId,
      projectId: project.id,
      estimateItemId: item.id,
      quantity: qty,
      unit: item.unit,
      unitPrice: uPrice,
      totalCost: Number((qty * uPrice).toFixed(2)),
      supplier: qpSupplier.trim() || t.notSpecified,
    });
    setQuickPurchaseEstimateId(null);
  };

  const estimateTotals = useMemo(() => {
    let plannedCost = 0;
    let matchedPurchaseCost = 0;
    for (const est of projectEstimates) {
      plannedCost += est.requiredQuantity * est.estimatedUnitPrice;
    }
    for (const p of projectPurchases) {
      matchedPurchaseCost += p.totalCost;
    }
    return {
      plannedCost,
      matchedPurchaseCost,
      diff: matchedPurchaseCost - plannedCost,
    };
  }, [projectEstimates, projectPurchases]);

  const filteredJournal = useMemo(() => {
    if (verdictFilter === 'all') return project.journal;
    return project.journal.filter((j) => j.verdict === verdictFilter);
  }, [project.journal, verdictFilter]);

  const homeOverview = useMemo(() => {
    const ingById = new Map<string, Ingredient>();
    const ingByName = new Map<string, Ingredient>();
    for (const ing of ingredients) {
      ingById.set(ing.id, ing);
      ingByName.set(ing.name.trim().toLowerCase(), ing);
    }

    type CompactTierItem = {
      id: string;
      name: string;
      family: OlfactoryFamilyKey;
      pctConcentrate: number;
      perceivedPct: number;
      inStock: boolean;
    };

    const tiers: Record<'top' | 'heart' | 'base', CompactTierItem[]> = {
      top: [],
      heart: [],
      base: [],
    };

    let ifraWarnings = 0;
    let inStockComponents = 0;
    let missingComponents = 0;

    for (const comp of project.components) {
      const matched =
        (comp.ingredientId ? ingById.get(comp.ingredientId) : undefined) ||
        ingByName.get(comp.name.trim().toLowerCase());
      const compPerceived = perceivedFormula.byComponentId[comp.id];

      if (matched) {
        if (matched.status === 'in_stock') inStockComponents += 1;
        else missingComponents += 1;
      }

      if (comp.tier !== 'solvent') {
        const pureMass =
          Math.max(0, comp.weightGrams) *
          (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
        const pctConcentrate =
          summary.pureAromaticGrams > 0 ? (pureMass / summary.pureAromaticGrams) * 100 : 0;
        const pctPureTotal =
          summary.totalWeightGrams > 0 ? (pureMass / summary.totalWeightGrams) * 100 : 0;
        const ifraStd = resolveIfraStandard({
          name: comp.name,
          inciOrCas: matched?.inciOrCas || compPerceived?.passport?.inciOrCas,
        });
        const ifraLimit =
          ifraStd !== undefined
            ? ifraStd.category4LimitPercent
            : (matched?.ifraLimitPercent ?? compPerceived?.passport?.ifraLimitPercent);
        const isBanned =
          ifraStd?.status === 'prohibited' ||
          ifraStd?.status === 'eu_banned' ||
          ifraLimit === 0;
        if (isBanned ? comp.weightGrams > 0 : ifraLimit !== undefined && pctPureTotal > ifraLimit) {
          ifraWarnings += 1;
        }
        tiers[comp.tier].push({
          id: comp.id,
          name: comp.name,
          family: comp.family,
          pctConcentrate,
          perceivedPct: compPerceived?.perceivedImpactPercent ?? 0,
          inStock: matched ? matched.status === 'in_stock' : true,
        });
      }
    }

    let topImpactPercent = 0;
    let heartImpactPercent = 0;
    let baseImpactPercent = 0;
    const facetAcc = new Map<string, { facet: string; family: OlfactoryFamilyKey; percent: number }>();

    for (const metric of perceivedFormula.metrics) {
      const compTier = project.components.find((c) => c.id === metric.componentId)?.tier;
      if (compTier === 'top') topImpactPercent += metric.perceivedImpactPercent;
      else if (compTier === 'heart') heartImpactPercent += metric.perceivedImpactPercent;
      else if (compTier === 'base') baseImpactPercent += metric.perceivedImpactPercent;

      const breakdown = metric.passport.scentBreakdown;
      if (breakdown && breakdown.length > 0) {
        const sumFacetPct = breakdown.reduce((acc, f) => acc + f.percent, 0) || 100;
        for (const facet of breakdown) {
          const share = metric.perceivedImpactPercent * (facet.percent / sumFacetPct);
          const key = facet.facet.trim().toLowerCase();
          const prev = facetAcc.get(key);
          if (prev) {
            prev.percent += share;
          } else {
            facetAcc.set(key, {
              facet: facet.facet,
              family: facet.family,
              percent: share,
            });
          }
        }
      }
    }

    const topFacets = Array.from(facetAcc.values()).sort((a, b) => b.percent - a.percent);

    (['top', 'heart', 'base'] as const).forEach((tk) => {
      tiers[tk].sort((a, b) => b.perceivedPct - a.perceivedPct || b.pctConcentrate - a.pctConcentrate);
    });

    const concRule = CONCENTRATION_TARGET_PERCENT[project.targetConcentration];
    const rangeNums = concRule.range.match(/\d+(?:\.\d+)?/g);
    const concMin = rangeNums && rangeNums[0] ? Number(rangeNums[0]) : concRule.defaultPct - 3;
    const concMax = rangeNums && rangeNums[1] ? Number(rangeNums[1]) : concRule.defaultPct + 5;
    const concOk =
      summary.totalWeightGrams > 0 &&
      summary.pureConcentrationPercent >= concMin &&
      summary.pureConcentrationPercent <= concMax;

    const formulaSearchTokens = [
      ...project.components.filter((c) => c.tier !== 'solvent').map((c) => c.name.toLowerCase()),
      ...topFacets.map((f) => f.facet.toLowerCase()),
      ...project.olfactoryMap.topNotes.map((n) => n.name.toLowerCase()),
      ...project.olfactoryMap.heartNotes.map((n) => n.name.toLowerCase()),
      ...project.olfactoryMap.baseNotes.map((n) => n.name.toLowerCase()),
    ];

    const parseDesired = (raw?: string) =>
      (raw || '')
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((label) => {
          const lower = label.toLowerCase();
          const matched = formulaSearchTokens.some(
            (tok) => tok.includes(lower) || lower.includes(tok)
          );
          return { label, matched };
        });

    const desiredParsed = {
      top: parseDesired(project.desiredNotes?.top),
      heart: parseDesired(project.desiredNotes?.heart),
      base: parseDesired(project.desiredNotes?.base),
    };

    const solventSharePercent =
      summary.totalWeightGrams > 0
        ? (summary.solventCarrierGrams / summary.totalWeightGrams) * 100
        : 0;

    return {
      tiers,
      tierImpactPercent: {
        top: topImpactPercent,
        heart: heartImpactPercent,
        base: baseImpactPercent,
      },
      topFacets,
      ifraWarnings,
      inStockComponents,
      missingComponents,
      concRule,
      concOk,
      desiredParsed,
      solventSharePercent,
    };
  }, [
    ingredients,
    perceivedFormula,
    project.components,
    project.desiredNotes,
    project.olfactoryMap,
    project.targetConcentration,
    summary,
  ]);

  const handleUpdateDesiredNotes = (tier: 'top' | 'heart' | 'base', value: string) => {
    patchProject({
      desiredNotes: {
        top: project.desiredNotes?.top || '',
        heart: project.desiredNotes?.heart || '',
        base: project.desiredNotes?.base || '',
        [tier]: value,
      },
    });
  };

  const handleImportDesiredFromOlfactoryMap = () => {
    const mapTop = project.olfactoryMap.topNotes.map((n) => n.name.trim()).filter(Boolean).join(', ');
    const mapHeart = project.olfactoryMap.heartNotes.map((n) => n.name.trim()).filter(Boolean).join(', ');
    const mapBase = project.olfactoryMap.baseNotes.map((n) => n.name.trim()).filter(Boolean).join(', ');
    if (!mapTop && !mapHeart && !mapBase) return;
    patchProject({
      desiredNotes: {
        top: mapTop || project.desiredNotes?.top || '',
        heart: mapHeart || project.desiredNotes?.heart || '',
        base: mapBase || project.desiredNotes?.base || '',
      },
    });
    onToast?.(
      tr(language, {
        ru: 'Желаемые ноты заполнены из ольфакторной карты',
        en: 'Desired notes imported from Olfactory Map',
        it: 'Note desiderate importate dalla mappa olfattiva',
        es: 'Notas deseadas importadas del mapa olfativo',
        de: 'Wunschnoten aus der Duftpyramide übernommen',
      })
    );
  };

  const goToFormulaInput = () => {
    onChangeTab('ingredients');
    window.setTimeout(() => {
      const el = document.getElementById('ribbon-quick-add-input');
      if (el instanceof HTMLInputElement) {
        el.focus();
      }
    }, 60);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & KPI Strip (shown ONLY when Level-2 tab «Главное» is open; Code/Status/Conc/Bottle live in Level-3 Ribbon) */}
      {activeTab === 'formula' && (
        <div className="space-y-4 border-b border-[#E4E4E0] pb-5">
          {/* Quiet unboxed metadata line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6D68]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
              <span className="font-mono font-semibold text-[#181917]">{project.code}</span>
              <span aria-hidden="true">·</span>
              <span>{getProjectStatusLabel(project.status, language)}</span>
              <span aria-hidden="true">·</span>
              <span>{project.targetConcentration}</span>
              <span aria-hidden="true">·</span>
              <span>
                {project.targetBottleMl} {formatUnit('мл', language)}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.updatedLabel} {project.updatedAt}
              </span>
            </div>

            {projectMacerations.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeTab('journal')}
                className={`inline-flex items-center gap-1.5 text-xs font-medium hover:underline transition-colors ${
                  readyMacerationCount > 0 ? 'text-[#15803D]' : 'text-[var(--theme-accent)]'
                }`}
              >
                {readyMacerationCount > 0 ? (
                  <BellRing className="h-3.5 w-3.5" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
                <span>
                  {readyMacerationCount > 0
                    ? t.macerationFinishedAlert(readyMacerationCount)
                    : t.macerationTimersCount(projectMacerations.length)}
                </span>
              </button>
            )}
          </div>

          {/* Editorial Title */}
          <input
            type="text"
            value={project.title}
            onChange={(e) => patchProject({ title: e.target.value })}
            placeholder={t.fragranceTitlePlaceholder}
            aria-label={t.projectTitleAria}
            className="w-full bg-transparent font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#181917] focus:outline-none focus:ring-0 border-b border-transparent focus:border-[var(--theme-accent)]"
          />

          {/* Unboxed 4-column KPI Strip */}
          {viewSettings.showProjectMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#EAEAE6] sm:divide-x sm:divide-[#EAEAE6]">
              <div className="sm:pr-4">
                <div className="text-[11px] text-[#6B6D68]">{t.batchWeightLabel}</div>
                <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-[#181917]">
                  {formatGrams(summary.totalWeightGrams, 2, language)}
                </div>
              </div>
              <div className="sm:px-4">
                <div className="text-[11px] text-[#6B6D68]">{t.pureConcentrateLabel}</div>
                <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-[var(--theme-accent)]">
                  {formatPercent(summary.pureConcentrationPercent, 1)}
                </div>
              </div>
              <div className="sm:px-4">
                <div className="text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Концентрат (план)',
                    en: 'Concentrate (target)',
                    it: 'Concentrato (target)',
                    es: 'Concentrado (objetivo)',
                    de: 'Konzentrat (Ziel)',
                  })}
                </div>
                <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-[#181917]">
                  {formatGrams(summary.aromaticMixtureGrams, 2, language)}
                  <span className="text-xs font-normal text-[#6B6D68]">
                    {' '}
                    / {formatGrams(effectiveConcentrateGrams, 2, language)}
                  </span>
                </div>
              </div>
              <div className="sm:pl-4">
                <div className="text-[11px] text-[#6B6D68]">{t.materialCostLabel}</div>
                <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-[#181917]">
                  {formatCurrencyRub(summary.totalFormulaCost, language, currency)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: ГЛАВНОЕ (EDITORIAL BRIEF & CLEAN LIVE PYRAMID) */}
      {activeTab === 'formula' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT (7 cols): Idea, Concept, Inspiration & Desired Notes */}
          <section className="xl:col-span-7 rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAEAE6] pb-3.5">
              <h2 className="font-serif text-xl font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Идея, концепция и желаемые ноты',
                  en: 'Idea, Concept & Desired Notes',
                  it: 'Idea, Concetto e Note Desiderate',
                  es: 'Idea, Concepto y Notas Deseadas',
                  de: 'Idee, Konzept & Wunschnoten',
                })}
              </h2>
              {(project.olfactoryMap.topNotes.length > 0 ||
                project.olfactoryMap.heartNotes.length > 0 ||
                project.olfactoryMap.baseNotes.length > 0) && (
                <button
                  type="button"
                  onClick={handleImportDesiredFromOlfactoryMap}
                  className="text-xs font-medium text-[var(--theme-accent)] hover:underline transition-colors whitespace-nowrap"
                >
                  {tr(language, {
                    ru: 'Подтянуть ноты из карты',
                    en: 'Import from Olfactory Map',
                    it: 'Importa dalla mappa',
                    es: 'Importar del mapa',
                    de: 'Aus Duftkarte laden',
                  })}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="project-idea" className="block text-xs font-semibold text-[#181917]">
                  {t.ideaConceptLabel}
                </label>
                <textarea
                  id="project-idea"
                  rows={4}
                  value={project.idea}
                  onChange={(e) => patchProject({ idea: e.target.value })}
                  placeholder={t.ideaPlaceholder}
                  className="mt-1.5 w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3.5 py-2.5 text-sm leading-relaxed text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="project-inspiration"
                  className="block text-xs font-semibold text-[#181917]"
                >
                  {t.inspirationLabel}
                </label>
                <textarea
                  id="project-inspiration"
                  rows={4}
                  value={project.inspiration}
                  onChange={(e) => patchProject({ inspiration: e.target.value })}
                  placeholder={t.inspirationPlaceholder}
                  className="mt-1.5 w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3.5 py-2.5 text-sm leading-relaxed text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Desired Notes Brief — Clean Hairline Rows (No Nested Cards, No Pill Clutter) */}
            <div className="border-t border-[#EAEAE6] pt-5 space-y-2">
              <div>
                <div className="text-xs font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Желаемые ноты композиции',
                    en: 'Desired Notes (Target Brief)',
                    it: 'Note desiderate (Brief)',
                    es: 'Notas deseadas (Brief)',
                    de: 'Gewünschte Duftnoten',
                  })}
                </div>
                <p className="text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Укажите ноты через запятую — совпадения с формулой и картой отметятся автоматически.',
                    en: 'List target notes separated by commas — matches with your formula are highlighted automatically.',
                    it: 'Elenca le note separate da virgola — le corrispondenze nella formula si evidenziano automaticamente.',
                    es: 'Enumera notas separadas por comas — las coincidencias con la fórmula se marcan automáticamente.',
                    de: 'Noten kommagetrennt angeben — Treffer in der Formel werden automatisch markiert.',
                  })}
                </p>
              </div>

              <div className="divide-y divide-[#EAEAE6]">
                {(
                  [
                    {
                      key: 'top' as const,
                      label: tr(language, {
                        ru: 'Верхние ноты',
                        en: 'Top Notes',
                        it: 'Note di Testa',
                        es: 'Notas de Salida',
                        de: 'Kopfnoten',
                      }),
                      role: tr(language, {
                        ru: 'Старт',
                        en: 'Opening',
                        it: 'Apertura',
                        es: 'Salida',
                        de: 'Auftakt',
                      }),
                      placeholder: tr(language, {
                        ru: 'Бергамот, розовый перец, петитгрейн, юзу...',
                        en: 'Bergamot, pink pepper, petitgrain, yuzu...',
                        it: 'Bergamotto, pepe rosa, petitgrain...',
                        es: 'Bergamota, pimienta rosa, petitgrain...',
                        de: 'Bergamotte, rosa Pfeffer, Petitgrain...',
                      }),
                    },
                    {
                      key: 'heart' as const,
                      label: tr(language, {
                        ru: 'Ноты сердца',
                        en: 'Heart Notes',
                        it: 'Note di Cuore',
                        es: 'Notas de Corazón',
                        de: 'Herznoten',
                      }),
                      role: tr(language, {
                        ru: 'Характер',
                        en: 'Core',
                        it: 'Cuore',
                        es: 'Cuerpo',
                        de: 'Herz',
                      }),
                      placeholder: tr(language, {
                        ru: 'Дамасская роза, инжир, чёрный чай, ирис...',
                        en: 'Damask rose, fig, black tea, iris...',
                        it: 'Rosa damascena, fico, tè nero, iris...',
                        es: 'Rosa de Damasco, higo, té negro, iris...',
                        de: 'Damaszener-Rose, Feige, Schwarztee, Iris...',
                      }),
                    },
                    {
                      key: 'base' as const,
                      label: tr(language, {
                        ru: 'Базовые ноты',
                        en: 'Base Notes',
                        it: 'Note di Fondo',
                        es: 'Notas de Fondo',
                        de: 'Basisnoten',
                      }),
                      role: tr(language, {
                        ru: 'Шлейф',
                        en: 'Drydown',
                        it: 'Fondo',
                        es: 'Fondo',
                        de: 'Basis',
                      }),
                      placeholder: tr(language, {
                        ru: 'Сандал, ветивер, амброксан, белый мускус...',
                        en: 'Sandalwood, vetiver, ambroxan, white musk...',
                        it: 'Sandalo, vetiver, ambroxan, muschio bianco...',
                        es: 'Sándalo, vetiver, ambroxan, almizcle blanco...',
                        de: 'Sandelholz, Vetiver, Ambroxan, weißer Moschus...',
                      }),
                    },
                  ] as const
                ).map((tierCfg) => {
                  const rawVal = project.desiredNotes?.[tierCfg.key] || '';
                  const parsedTags = homeOverview.desiredParsed[tierCfg.key];
                  return (
                    <div key={tierCfg.key} className="py-3 first:pt-2 last:pb-0 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="sm:w-40 shrink-0 flex items-baseline gap-1.5">
                          <span className="text-xs font-semibold text-[#181917]">{tierCfg.label}</span>
                          <span className="text-[11px] text-[#6B6D68]">· {tierCfg.role}</span>
                        </div>
                        <input
                          type="text"
                          value={rawVal}
                          onChange={(e) => handleUpdateDesiredNotes(tierCfg.key, e.target.value)}
                          placeholder={tierCfg.placeholder}
                          className="flex-1 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                        />
                      </div>
                      {parsedTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 sm:pl-42 text-[11px]">
                          {parsedTags.map((tag, idx) => (
                            <span key={`${tierCfg.key}-des-${idx}`} className="inline-flex items-center gap-1">
                              {idx > 0 && (
                                <span className="text-[#D2D0CE] mr-1" aria-hidden="true">
                                  ·
                                </span>
                              )}
                              {tag.matched && (
                                <Check className="h-3 w-3 text-[#15803D] shrink-0" />
                              )}
                              <span
                                className={
                                  tag.matched ? 'font-medium text-[#15803D]' : 'text-[#6B6D68]'
                                }
                                title={
                                  tag.matched
                                    ? tr(language, {
                                        ru: 'Уже присутствует в формуле или карте',
                                        en: 'Present in formula or map',
                                        it: 'Presente nella formula o mappa',
                                        es: 'Presente en la fórmula o mapa',
                                        de: 'In Formel oder Duftkarte enthalten',
                                      })
                                    : undefined
                                }
                              >
                                {tag.label}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT (5 cols): Clean Live Formula Pyramid & Facets */}
          <section className="xl:col-span-5 rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
            <div className="flex items-start justify-between gap-2 border-b border-[#EAEAE6] pb-3.5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Пирамида состава',
                    en: 'Formula Pyramid',
                    it: 'Piramide della Formula',
                    es: 'Pirámide de Fórmula',
                    de: 'Formel-Pyramide',
                  })}
                </h2>
                <p className="mt-0.5 text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Расчёт по компонентам формулы',
                    en: 'Live breakdown from active formula',
                    it: 'Calcolo automatico dai componenti',
                    es: 'Desglose en vivo desde la fórmula',
                    de: 'Live-Aufteilung aus den Komponenten',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => onChangeTab('ingredients')}
                  className="text-[#575955] hover:text-[#181917] transition-colors whitespace-nowrap"
                >
                  {tr(language, {
                    ru: 'Состав',
                    en: 'Formula',
                    it: 'Formula',
                    es: 'Fórmula',
                    de: 'Formel',
                  })}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTab('olfactory')}
                  className="inline-flex items-center gap-1 text-[var(--theme-accent)] hover:underline whitespace-nowrap"
                >
                  <span>
                    {tr(language, {
                      ru: 'Карта',
                      en: 'Map',
                      it: 'Mappa',
                      es: 'Mapa',
                      de: 'Karte',
                    })}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {summary.pureAromaticGrams <= 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Добавьте ароматические компоненты во вкладке «Ингредиенты» — пирамида построится автоматически.',
                    en: 'Add aromatic components in the Ingredients tab to build the live pyramid automatically.',
                    it: 'Aggiungi componenti aromatici nella scheda Ingredienti per generare la piramide.',
                    es: 'Añade componentes aromáticos en la pestaña Ingredientes para generar la pirámide.',
                    de: 'Füge Duftkomponenten im Tab „Rohstoffe“ hinzu, um die Pyramide automatisch zu erzeugen.',
                  })}
                </p>
                <button
                  type="button"
                  onClick={goToFormulaInput}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {tr(language, {
                      ru: 'Добавить компонент',
                      en: 'Add component',
                      it: 'Aggiungi componente',
                      es: 'Añadir componente',
                      de: 'Komponente hinzufügen',
                    })}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Single Clean Balance Strip */}
                <div className="space-y-1.5">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EEEEEC]">
                    <div
                      style={{ width: `${summary.tierPercentOfPure.top}%` }}
                      className="bg-[#D97706]"
                    />
                    <div
                      style={{ width: `${summary.tierPercentOfPure.heart}%` }}
                      className="bg-[var(--theme-accent)]"
                    />
                    <div
                      style={{ width: `${summary.tierPercentOfPure.base}%` }}
                      className="bg-[#78350F]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#575955] tabular-nums">
                    <span>
                      {t.topLabel} {Math.round(summary.tierPercentOfPure.top)}%
                    </span>
                    <span>
                      {t.heartLabel} {Math.round(summary.tierPercentOfPure.heart)}%
                    </span>
                    <span>
                      {t.baseLabel} {Math.round(summary.tierPercentOfPure.base)}%
                    </span>
                  </div>
                </div>

                {/* Hairline-Separated Pyramid Tiers (No Nested Cards, No Pill Scatter) */}
                <div className="divide-y divide-[#EAEAE6] border-t border-[#EAEAE6]">
                  {(
                    [
                      {
                        key: 'top' as const,
                        label: tr(language, {
                          ru: 'Верхние ноты',
                          en: 'Top Notes',
                          it: 'Note di Testa',
                          es: 'Notas de Salida',
                          de: 'Kopfnoten',
                        }),
                        massPct: summary.tierPercentOfPure.top,
                        impactPct: homeOverview.tierImpactPercent.top,
                      },
                      {
                        key: 'heart' as const,
                        label: tr(language, {
                          ru: 'Ноты сердца',
                          en: 'Heart Notes',
                          it: 'Note di Cuore',
                          es: 'Notas de Corazón',
                          de: 'Herznoten',
                        }),
                        massPct: summary.tierPercentOfPure.heart,
                        impactPct: homeOverview.tierImpactPercent.heart,
                      },
                      {
                        key: 'base' as const,
                        label: tr(language, {
                          ru: 'Базовые ноты',
                          en: 'Base Notes',
                          it: 'Note di Fondo',
                          es: 'Notas de Fondo',
                          de: 'Basisnoten',
                        }),
                        massPct: summary.tierPercentOfPure.base,
                        impactPct: homeOverview.tierImpactPercent.base,
                      },
                    ] as const
                  ).map((tierRow) => {
                    const items = homeOverview.tiers[tierRow.key];
                    const visibleItems = items.slice(0, 5);
                    const hiddenCount = Math.max(0, items.length - visibleItems.length);
                    return (
                      <div key={tierRow.key} className="py-3 first:pt-3 space-y-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-semibold text-[#181917]">
                            {tierRow.label}
                          </span>
                          <span className="font-mono text-[11px] text-[#6B6D68] tabular-nums">
                            {tr(language, { ru: 'Масса', en: 'Mass', it: 'Massa', es: 'Masa', de: 'Masse' })}{' '}
                            {Math.round(tierRow.massPct)}% ·{' '}
                            {tr(language, { ru: 'Звуч.', en: 'Imp.', it: 'Imp.', es: 'Imp.', de: 'Wirk.' })}{' '}
                            <strong className="text-[#181917] font-semibold">
                              {Math.round(tierRow.impactPct)}%
                            </strong>
                          </span>
                        </div>

                        {items.length === 0 ? (
                          <div className="text-xs text-[#8B8D87]">
                            {tr(language, {
                              ru: 'Нет компонентов этого яруса',
                              en: 'No components in this tier',
                              it: 'Nessun componente',
                              es: 'Sin componentes',
                              de: 'Keine Komponenten',
                            })}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {visibleItems.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center justify-between gap-3 text-xs"
                                title={`${it.name} · ${formatPercent(it.pctConcentrate, 1)}`}
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="h-2 w-2 rounded-xs shrink-0"
                                    style={{ backgroundColor: FAMILY_HEX_MAP[it.family] }}
                                  />
                                  <span className="truncate text-[#3F413D]">{it.name}</span>
                                </span>
                                <span className="font-mono text-[11px] text-[#575955] tabular-nums shrink-0">
                                  {Math.round(it.perceivedPct > 0 ? it.perceivedPct : it.pctConcentrate)}%
                                </span>
                              </div>
                            ))}
                            {hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={() => onChangeTab('ingredients')}
                                className="pt-0.5 text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                              >
                                +{hiddenCount}{' '}
                                {tr(language, {
                                  ru: 'ещё в составе',
                                  en: 'more in formula',
                                  it: 'altri nella formula',
                                  es: 'más en fórmula',
                                  de: 'weitere in Formel',
                                })}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Leading Scent Facets — Clean Proportional Lines */}
                {homeOverview.topFacets.length > 0 && (
                  <div className="border-t border-[#EAEAE6] pt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#181917]">
                        {tr(language, {
                          ru: 'Главные грани звучания',
                          en: 'Leading Scent Facets',
                          it: 'Sfaccettature principali',
                          es: 'Facetas principales',
                          de: 'Haupt-Duftfacetten',
                        })}
                      </span>
                      <span className="font-mono text-[11px] text-[#6B6D68] tabular-nums">
                        {tr(language, {
                          ru: `Растворитель: ${Math.round(homeOverview.solventSharePercent)}%`,
                          en: `Solvent: ${Math.round(homeOverview.solventSharePercent)}%`,
                          it: `Solvente: ${Math.round(homeOverview.solventSharePercent)}%`,
                          es: `Disolvente: ${Math.round(homeOverview.solventSharePercent)}%`,
                          de: `Lösungsm.: ${Math.round(homeOverview.solventSharePercent)}%`,
                        })}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {homeOverview.topFacets.slice(0, 4).map((f) => (
                        <div key={f.facet} className="flex items-center gap-3 text-xs">
                          <span className="w-28 truncate text-[#3F413D] shrink-0">{getLocalizedFacetName(f.facet, language)}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-[#F1F1EE] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round(f.percent))}%`,
                                backgroundColor: FAMILY_HEX_MAP[f.family],
                              }}
                            />
                          </div>
                          <span className="w-9 text-right font-mono text-[11px] font-medium text-[#181917] tabular-nums shrink-0">
                            {Math.round(f.percent)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB: УПРАВЛЕНИЕ ПРОЕКТОМ И ГОТОВНОСТЬ */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#EAEAE6] pb-3.5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Управление проектом и готовность',
                    en: 'Project Stage & Diagnostics',
                    it: 'Gestione Progetto e Stato',
                    es: 'Gestión y Estado del Proyecto',
                    de: 'Projektsteuerung & Status',
                  })}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Стадия разработки, контроль концентрации, IFRA-ограничения и обеспеченность сырьём',
                    en: 'Development stage, concentration check, IFRA compliance and stock readiness',
                    it: 'Fase di sviluppo, controllo concentrazione, conformità IFRA e disponibilità scorte',
                    es: 'Etapa de desarrollo, control de concentración, límites IFRA y disponibilidad de stock',
                    de: 'Entwicklungsphase, Konzentrationsprüfung, IFRA-Konformität und Lagerbestand',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onChangeTab('ingredients')}
                className="inline-flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 text-xs font-medium text-[var(--theme-accent)] hover:bg-white hover:border-[var(--theme-accent)] transition-colors shrink-0"
              >
                <span>
                  {tr(language, {
                    ru: 'К составу формулы',
                    en: 'To Formula Composition',
                    it: 'Alla composizione',
                    es: 'A la composición',
                    de: 'Zur Formel',
                  })}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

                {/* Quick Stage Pipeline */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-[#6B6D68]">
                    {tr(language, {
                      ru: 'Стадия проекта',
                      en: 'Project stage',
                      it: 'Fase progetto',
                      es: 'Etapa del proyecto',
                      de: 'Projektphase',
                    })}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                    {(['idea', 'formulating', 'macerating', 'completed', 'archived'] as ProjectStatus[]).map(
                      (st) => {
                        const active = project.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => patchProject({ status: st })}
                            className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors truncate ${
                              active
                                ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] font-semibold'
                                : 'border-[#E4E4E0] bg-[#FAFBF9] text-[#575955] hover:bg-white'
                            }`}
                          >
                            {getProjectStatusLabel(st, language)}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Diagnostics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-xs">
                  <div
                    className={`rounded-lg border px-3 py-2 ${
                      homeOverview.concOk
                        ? 'border-[#A7F3D0] bg-[#ECFDF5]/60'
                        : 'border-[#EAEAE6] bg-[#FAFBF9]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B6D68]">
                      {project.targetConcentration} ({homeOverview.concRule.range})
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold tabular-nums text-[#181917]">
                        {formatPercent(summary.pureConcentrationPercent, 1)}
                      </span>
                      {!homeOverview.concOk && summary.pureAromaticGrams > 0 && (
                        <button
                          type="button"
                          onClick={handleAdjustSolventToTargetConcentration}
                          className="text-[10px] font-semibold text-[var(--theme-accent)] hover:underline whitespace-nowrap"
                        >
                          {tr(language, {
                            ru: 'Выровнять',
                            en: 'Match',
                            it: 'Allinea',
                            es: 'Ajustar',
                            de: 'Anpassen',
                          })}
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className={`rounded-lg border px-3 py-2 ${
                      homeOverview.ifraWarnings > 0
                        ? 'border-[#FECACA] bg-[#FEF2F2]/80'
                        : 'border-[#EAEAE6] bg-[#FAFBF9]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B6D68]">
                      IFRA
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 font-mono text-xs font-bold">
                      {homeOverview.ifraWarnings > 0 ? (
                        <span className="text-[#B91C1C]">
                          {tr(language, {
                            ru: `Риск: ${homeOverview.ifraWarnings}`,
                            en: `Over: ${homeOverview.ifraWarnings}`,
                            it: `Oltre: ${homeOverview.ifraWarnings}`,
                            es: `Exceso: ${homeOverview.ifraWarnings}`,
                            de: `Über: ${homeOverview.ifraWarnings}`,
                          })}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#15803D]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>OK</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onChangeTab('ingredients')}
                    className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] px-3 py-2 text-left hover:border-[var(--theme-accent)] hover:bg-white transition-colors"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B6D68]">
                      {tr(language, {
                        ru: 'Сырьё в наличии',
                        en: 'Stock Ready',
                        it: 'Scorte Pronte',
                        es: 'Stock Listo',
                        de: 'Lagerstatus',
                      })}
                    </div>
                    <div className="mt-0.5 font-mono text-xs font-bold tabular-nums text-[#181917]">
                      {homeOverview.inStockComponents} /{' '}
                      {homeOverview.inStockComponents + homeOverview.missingComponents}
                    </div>
                  </button>
                </div>

                {/* Quick Jump Links to Other Project Tabs */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#EAEAE6]">
                  <button
                    type="button"
                    onClick={() => onChangeTab('formula')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: 'Главное и пирамида',
                      en: 'Brief & Pyramid',
                      it: 'Principale & Piramide',
                      es: 'Principal y Pirámide',
                      de: 'Start & Pyramide',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('ingredients')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: `Ингредиенты и состав (${project.components.length})`,
                      en: `Ingredients & Formula (${project.components.length})`,
                      it: `Ingredienti e Formula (${project.components.length})`,
                      es: `Ingredientes y Fórmula (${project.components.length})`,
                      de: `Rohstoffe & Formel (${project.components.length})`,
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('olfactory')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: 'Ольфакторная карта',
                      en: 'Olfactory Map',
                      it: 'Mappa Olfattiva',
                      es: 'Mapa Olfativo',
                      de: 'Duftpyramide',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('journal')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: `Записи (${project.journal.length})`,
                      en: `Notes (${project.journal.length})`,
                      it: `Note (${project.journal.length})`,
                      es: `Notas (${project.journal.length})`,
                      de: `Notizen (${project.journal.length})`,
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('cost')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: `Смета (${projectEstimates.length})`,
                      en: `Budget (${projectEstimates.length})`,
                      it: `Budget (${projectEstimates.length})`,
                      es: `Presupuesto (${projectEstimates.length})`,
                      de: `Budget (${projectEstimates.length})`,
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('dilution')}
                    className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3F413D] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    {tr(language, {
                      ru: 'Разбавление',
                      en: 'Dilution',
                      it: 'Diluizione',
                      es: 'Dilución',
                      de: 'Verdünnung',
                    })}
                  </button>
                </div>
          </section>
        </div>
      )}

      {/* TAB 1.5: UNIFIED COMPACT INGREDIENTS WORKSPACE */}
      {activeTab === 'ingredients' && (() => {
        const q = projIngSearch.trim().toLowerCase();
        const findLinkedIng = (comp: FormulaComponent) =>
          ingredients.find(
            (i) =>
              (comp.ingredientId && i.id === comp.ingredientId) ||
              i.name.trim().toLowerCase() === comp.name.trim().toLowerCase()
          );

        const displayComponents = activeComponents.filter((comp) => {
          if (projIngTierFilter !== 'all' && comp.tier !== projIngTierFilter) return false;
          if (!q) return true;
          const matched = findLinkedIng(comp);
          return (
            comp.name.toLowerCase().includes(q) ||
            (comp.note || '').toLowerCase().includes(q) ||
            (matched?.bottleLabel || '').toLowerCase().includes(q) ||
            (matched?.inciOrCas || '').toLowerCase().includes(q)
          );
        });

        let stockAlertCount = 0;
        for (const comp of activeComponents) {
          const matched = findLinkedIng(comp);
          if (!matched) continue;
          const stockVal = getIngredientStockGrams(matched);
          const isWishlist = matched.status === 'wishlist';
          const isShortage = stockVal !== null && comp.weightGrams > stockVal + 0.001;
          const isLow = stockVal !== null && stockVal <= 15;
          if (isWishlist || isShortage || isLow) {
            stockAlertCount += 1;
          }
        }

        const isFiltered = projIngTierFilter !== 'all' || q.length > 0;

        return (
          <div id="formula-composition-section" className="space-y-3">
            {/* Optional thin Variant Selector Strip (shown only if project has variants) */}
            {(project.variants || []).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] px-3 py-1.5 text-xs">
                <span className="inline-flex items-center gap-1 font-medium text-[#605E5C] mr-1">
                  <Layers className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>
                    {tr(language, {
                      ru: 'Вариант:',
                      en: 'Variant:',
                      it: 'Variante:',
                      es: 'Variante:',
                      de: 'Variante:',
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedVariantId(null)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedVariantId === null
                      ? 'bg-[var(--theme-accent)] text-white'
                      : 'bg-white border border-[#E4E4E0] text-[#575955] hover:text-[#181917]'
                  }`}
                >
                  {tr(language, {
                    ru: `Основная (${project.components.length})`,
                    en: `Main (${project.components.length})`,
                    it: `Principale (${project.components.length})`,
                    es: `Principal (${project.components.length})`,
                    de: `Hauptformel (${project.components.length})`,
                  })}
                </button>
                {project.variants?.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedVariantId === v.id
                        ? 'bg-[var(--theme-accent)] text-white'
                        : 'bg-white border border-[#E4E4E0] text-[#575955] hover:text-[#181917]'
                    }`}
                  >
                    {v.name} ({v.components.length})
                  </button>
                ))}
              </div>
            )}

            {/* Single Compact Control Toolbar */}
            <div className="rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] px-3 py-2 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
              {/* Left: View Switcher (Состав | Склад) + Search + Tier Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Segmented Switcher */}
                <div
                  className="inline-flex rounded-md border border-[#D2D0CE] bg-[#EDEBE9] p-0.5 shrink-0"
                  role="tablist"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={ingredientsViewMode === 'composition'}
                    onClick={() => setIngredientsViewMode('composition')}
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                      ingredientsViewMode === 'composition'
                        ? 'bg-white font-semibold text-[#181917] shadow-xs'
                        : 'font-medium text-[#605E5C] hover:text-[#181917]'
                    }`}
                  >
                    <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    <span>
                      {tr(language, {
                        ru: 'Состав',
                        en: 'Formula',
                        it: 'Formula',
                        es: 'Fórmula',
                        de: 'Formel',
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={ingredientsViewMode === 'stock'}
                    onClick={() => setIngredientsViewMode('stock')}
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                      ingredientsViewMode === 'stock'
                        ? 'bg-white font-semibold text-[#181917] shadow-xs'
                        : 'font-medium text-[#605E5C] hover:text-[#181917]'
                    }`}
                  >
                    <span>
                      {tr(language, {
                        ru: 'Склад',
                        en: 'Stock',
                        it: 'Magazzino',
                        es: 'Stock',
                        de: 'Lager',
                      })}
                    </span>
                    {stockAlertCount > 0 && (
                      <span className="rounded bg-[#FEF3C7] px-1 font-mono text-[10px] font-semibold text-[#B45309] tabular-nums">
                        {stockAlertCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Inline Search */}
                <div className="relative w-48 sm:w-56">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#797775]" />
                  <input
                    type="text"
                    value={projIngSearch}
                    onChange={(e) => setProjIngSearch(e.target.value)}
                    placeholder={tr(language, {
                      ru: 'Поиск по составу...',
                      en: 'Filter formula...',
                      it: 'Filtra formula...',
                      es: 'Filtrar fórmula...',
                      de: 'Formel filtern...',
                    })}
                    className="w-full rounded border border-[#D2D0CE] bg-white py-1 pl-8 pr-6 text-xs text-[#181917] placeholder:text-[#8A8886] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                  {projIngSearch && (
                    <button
                      type="button"
                      onClick={() => setProjIngSearch('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8A8886] hover:text-[#181917]"
                      aria-label="Clear filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Compact Tier Filter */}
                <div className="flex flex-wrap items-center gap-1">
                  {(['all', 'top', 'heart', 'base', 'solvent'] as const).map((tierKey) => (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setProjIngTierFilter(tierKey)}
                      className={`rounded px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                        projIngTierFilter === tierKey
                          ? 'bg-[var(--theme-accent)] text-white'
                          : 'bg-white border border-[#E4E4E0] text-[#575955] hover:border-[#D2D0CE] hover:text-[#181917]'
                      }`}
                    >
                      {tierKey === 'all'
                        ? tr(language, { ru: 'Все', en: 'All', it: 'Tutti', es: 'Todos', de: 'Alle' })
                        : getNoteTierShort(tierKey, language)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Compact Metrics */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-[#575955] tabular-nums pr-1">
                  <span>
                    {tr(language, {
                      ru: 'Конц.:',
                      en: 'Conc.:',
                      it: 'Conc.:',
                      es: 'Conc.:',
                      de: 'Konz.:',
                    })}{' '}
                    <strong className="font-mono text-[#181917]">
                      {formatGrams(activeSummary.aromaticMixtureGrams, 2, language)}
                    </strong>{' '}
                    / {formatGrams(activeConcentrateGrams, 1, language)} (
                    <span
                      className={`font-mono font-semibold ${
                        Math.abs(activeConcPct - 100) <= 0.5
                          ? 'text-[#15803D]'
                          : activeConcPct > 100.5
                            ? 'text-[#B45309]'
                            : 'text-[var(--theme-accent)]'
                      }`}
                    >
                      {formatPercent(activeConcPct, 1)}
                    </span>
                    )
                  </span>
                  {activeSummary.aromaticMixtureGrams > 0 &&
                    Math.abs(activeSummary.aromaticMixtureGrams - activeConcentrateGrams) > 0.05 && (
                      <button
                        type="button"
                        onClick={handleNormalizeConcentrateToTarget}
                        className="rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1] transition-colors whitespace-nowrap"
                      >
                        {tr(language, {
                          ru: `Подогнать к ${activeConcentrateGrams} г`,
                          en: `Fit ${activeConcentrateGrams} g`,
                          it: `Adatta ${activeConcentrateGrams} g`,
                          es: `Ajustar ${activeConcentrateGrams} g`,
                          de: `Auf ${activeConcentrateGrams} g`,
                        })}
                      </button>
                    )}
                  <span aria-hidden="true">·</span>
                  <span>
                    {tr(language, { ru: 'Всего:', en: 'Total:', it: 'Tot.:', es: 'Total:', de: 'Ges.:' })}{' '}
                    <strong className="font-mono text-[#181917]">
                      {formatGrams(activeSummary.totalWeightGrams, 2, language)}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span title={t.pureAromaticBaseLabel}>
                    {formatPercent(activeSummary.pureConcentrationPercent, 1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Slim 3px Pyramid Balance Hairline */}
            {activeSummary.pureAromaticGrams > 0 && (
              <div className="flex items-center gap-3 px-0.5">
                <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEEEEC]">
                  <div
                    style={{ width: `${activeSummary.tierPercentOfPure.top}%` }}
                    className="bg-[#D97706]"
                    title={`${t.topLabel} ${activeSummary.tierPercentOfPure.top.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${activeSummary.tierPercentOfPure.heart}%` }}
                    className="bg-[var(--theme-accent)]"
                    title={`${t.heartLabel} ${activeSummary.tierPercentOfPure.heart.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${activeSummary.tierPercentOfPure.base}%` }}
                    className="bg-[#78350F]"
                    title={`${t.baseLabel} ${activeSummary.tierPercentOfPure.base.toFixed(1)}%`}
                  />
                </div>
                <div className="shrink-0 text-[10.5px] font-mono text-[#6B6D68] tabular-nums">
                  {getNoteTierShort('top', language)} {Math.round(activeSummary.tierPercentOfPure.top)}% ·{' '}
                  {getNoteTierShort('heart', language)} {Math.round(activeSummary.tierPercentOfPure.heart)}% ·{' '}
                  {getNoteTierShort('base', language)} {Math.round(activeSummary.tierPercentOfPure.base)}%
                </div>
              </div>
            )}

            {/* Single Unified Table Surface */}
            <div className="rounded-lg border border-[#E4E4E0] bg-white overflow-hidden">
              {ingredientsViewMode === 'composition' ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#E4E4E0] bg-[#FAF9F8] text-[11px] font-semibold text-[#605E5C]">
                        <th className="py-2 pl-3 pr-2">{t.colComponent}</th>
                        <th className="py-2 px-2">{t.colTier}</th>
                        <th className="py-2 px-2">{t.colFamily}</th>
                        <th className="py-2 px-2 text-right">{t.colDilution}</th>
                        <th className="py-2 px-2 text-right">{t.colMassG(formatUnit('г', language))}</th>
                        <th className="py-2 px-2 text-right">{t.colPureMat}</th>
                        <th className="py-2 px-2 text-right">{t.colPctFormula}</th>
                        <th className="py-2 px-2 text-right">{t.colPctConc}</th>
                        <th
                          className="py-2 px-2 text-right text-[var(--theme-accent)]"
                          title={tr(language, {
                            ru: 'Реальное ощущаемое звучание в формуле (с учетом Odor Impact и летучести)',
                            en: 'Actual perceived scent impact in the formula (weighted by Odor Impact)',
                            it: 'Impatto olfattivo percepito reale nella formula (ponderato per Odor Impact)',
                            es: 'Impacto olfativo percibido real en la fórmula (ponderado por Odor Impact)',
                            de: 'Tatsächliche Duftwirkung in der Formel (gewichtet nach Odor Impact)',
                          })}
                        >
                          {tr(language, {
                            ru: 'Звучание %',
                            en: 'Scent Impact %',
                            it: 'Impatto %',
                            es: 'Impacto %',
                            de: 'Duftwirkung %',
                          })}
                        </th>
                        <th className="py-2 px-2 text-right">{t.colCost}</th>
                        <th className="py-2 pl-1 pr-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEBE9]">
                      {displayComponents.map((comp) => {
                        const pureMass =
                          comp.tier === 'solvent'
                            ? 0
                            : Math.max(0, comp.weightGrams) *
                              (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
                        const pctFormula =
                          activeSummary.totalWeightGrams > 0
                            ? (comp.weightGrams / activeSummary.totalWeightGrams) * 100
                            : 0;
                        const pctPureTotal =
                          activeSummary.totalWeightGrams > 0
                            ? (pureMass / activeSummary.totalWeightGrams) * 100
                            : 0;
                        const pctConcentratePure =
                          comp.tier !== 'solvent' && activeSummary.pureAromaticGrams > 0
                            ? (pureMass / activeSummary.pureAromaticGrams) * 100
                            : 0;
                        const pctInTargetConcentrate =
                          comp.tier !== 'solvent' && activeConcentrateGrams > 0
                            ? (comp.weightGrams / activeConcentrateGrams) * 100
                            : 0;

                        const linkedIng = findLinkedIng(comp);
                        const unitCost =
                          comp.costPerGram && comp.costPerGram > 0
                            ? comp.costPerGram
                            : linkedIng && linkedIng.quantityGrams > 0 && linkedIng.priceTotal > 0
                              ? linkedIng.priceTotal / linkedIng.quantityGrams
                              : 0;
                        const lineCost = (comp.weightGrams || 0) * unitCost;

                        const linkedStockVal = linkedIng ? getIngredientStockGrams(linkedIng) : null;
                        const isMissingFromStock =
                          comp.tier !== 'solvent' &&
                          (!linkedIng ||
                            linkedIng.status !== 'in_stock' ||
                            (linkedStockVal !== null && comp.weightGrams > linkedStockVal + 0.001));
                        const deficitGrams =
                          linkedStockVal !== null
                            ? Math.max(1, Number((comp.weightGrams - linkedStockVal).toFixed(2)))
                            : Math.max(1, Number(comp.weightGrams.toFixed(2)));
                        const isCompInCart = projectEstimates.some(
                          (e) =>
                            (comp.ingredientId && e.ingredientId === comp.ingredientId) ||
                            e.ingredientName.trim().toLowerCase() === comp.name.trim().toLowerCase()
                        );
                        const compPerceived = activePerceivedFormula.byComponentId[comp.id];
                        const passport = compPerceived?.passport;
                        const ifraStd = resolveIfraStandard({
                          name: comp.name,
                          inciOrCas: linkedIng?.inciOrCas || passport?.inciOrCas,
                        });
                        const ifraLimit =
                          ifraStd !== undefined
                            ? ifraStd.category4LimitPercent
                            : (linkedIng?.ifraLimitPercent ?? passport?.ifraLimitPercent);
                        const isBanned =
                          ifraStd?.status === 'prohibited' ||
                          ifraStd?.status === 'eu_banned' ||
                          ifraLimit === 0;
                        const exceedsIfra =
                          comp.tier !== 'solvent' &&
                          (isBanned
                            ? comp.weightGrams > 0
                            : ifraLimit !== undefined && pctPureTotal > ifraLimit);

                        return (
                          <tr key={comp.id} className="hover:bg-[#FAFBF9]">
                            <td className="py-2 pl-3 pr-2">
                              <div className="flex flex-col gap-0.5">
                                <input
                                  type="text"
                                  value={comp.name}
                                  onChange={(e) =>
                                    handleUpdateComponent(comp.id, { name: e.target.value })
                                  }
                                  className="w-full bg-transparent text-xs font-semibold text-[#181917] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] rounded px-1 -mx-1"
                                />
                                {comp.tier !== 'solvent' && passport && (
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#6B6D68]">
                                    <div className="flex h-1 w-16 overflow-hidden rounded-full bg-[#EAEAE6]">
                                      {passport.scentBreakdown.map((facet, fIdx) => (
                                        <div
                                          key={`${comp.id}-f-${fIdx}`}
                                          style={{
                                            width: `${facet.percent}%`,
                                            backgroundColor: FAMILY_HEX_MAP[facet.family],
                                          }}
                                          title={`${getLocalizedFacetName(facet.facet, language)}: ${facet.percent}%`}
                                          className="h-full"
                                        />
                                      ))}
                                    </div>
                                    <span title="Fraterworks Scent Breakdown">
                                      {passport.scentBreakdown
                                        .slice(0, 2)
                                        .map((b) => `${getLocalizedFacetName(b.facet, language)} ${b.percent}%`)
                                        .join(' · ')}
                                    </span>
                                    <span className="font-mono text-[#575955]">
                                      · {tr(language, { ru: 'Импакт', en: 'Impact', it: 'Impatto', es: 'Impacto', de: 'Impact' })} {passport.odorImpact} · ~{passport.substantivityHours}{tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })}
                                    </span>
                                  </div>
                                )}
                                {(linkedIng?.bottleLabel || comp.note || exceedsIfra) && (
                                  <div className="flex flex-wrap items-center gap-x-2 text-[10.5px] text-[#6B6D68]">
                                    {linkedIng?.bottleLabel && (
                                      <span className="font-mono font-medium text-[var(--theme-accent)]">
                                        [{linkedIng.bottleLabel}]
                                      </span>
                                    )}
                                    {comp.note && <span className="truncate max-w-[260px]">{comp.note}</span>}
                                    {exceedsIfra && (
                                      <span className="inline-flex items-center gap-1 font-medium text-[#B91C1C]">
                                        <AlertTriangle className="h-3 w-3 shrink-0" />
                                        <span>
                                          {isBanned
                                            ? tr(language, {
                                                ru: 'Запрещено IFRA / ЕС (0%)',
                                                en: 'Prohibited IFRA / EU (0%)',
                                                it: 'Vietato IFRA / UE (0%)',
                                                es: 'Prohibido IFRA / UE (0%)',
                                                de: 'Verboten IFRA / EU (0%)',
                                              })
                                            : t.exceedsIfra(ifraLimit)}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={comp.tier}
                                onChange={(e) =>
                                  handleUpdateComponent(comp.id, { tier: e.target.value as NoteTier })
                                }
                                className="rounded border border-[#E4E4E0] bg-white px-1.5 py-1 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                              >
                                {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((tierKey) => (
                                  <option key={tierKey} value={tierKey}>
                                    {getNoteTierShort(tierKey, language)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={comp.family}
                                onChange={(e) =>
                                  handleUpdateComponent(comp.id, {
                                    family: e.target.value as OlfactoryFamilyKey,
                                  })
                                }
                                className="rounded border border-[#E4E4E0] bg-white px-1.5 py-1 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                              >
                                {OLFACTORY_FAMILIES.map((f) => (
                                  <option key={f.key} value={f.key}>
                                    {getOlfactoryFamilyShort(f.key, language)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2 text-right">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step="any"
                                value={comp.dilutionPercent}
                                onChange={(e) =>
                                  handleUpdateComponent(comp.id, {
                                    dilutionPercent: Math.min(
                                      100,
                                      Math.max(0.01, Number(e.target.value) || 0)
                                    ),
                                  })
                                }
                                className="w-14 rounded border border-[#E4E4E0] bg-white px-1.5 py-1 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                              />
                            </td>
                            <td className="py-2 px-2 text-right">
                              <div className="inline-flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  value={comp.weightGrams}
                                  onChange={(e) =>
                                    handleUpdateComponent(comp.id, {
                                      weightGrams: Math.max(0, Number(e.target.value) || 0),
                                    })
                                  }
                                  className="w-18 rounded border border-[#E4E4E0] bg-white px-1.5 py-1 text-right font-mono text-xs font-medium tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                                />
                                {comp.tier !== 'solvent' && (() => {
                                  const concentrateDeficit = Math.max(
                                    0,
                                    Number((activeConcentrateGrams - activeSummary.aromaticMixtureGrams).toFixed(3))
                                  );
                                  const canTopUp = concentrateDeficit > 0.001;
                                  const nextMass = Number(
                                    (Math.max(0, comp.weightGrams) + concentrateDeficit).toFixed(3)
                                  );
                                  return (
                                    <button
                                      type="button"
                                      disabled={!canTopUp}
                                      onClick={() => {
                                        if (!canTopUp) return;
                                        handleUpdateComponent(comp.id, { weightGrams: nextMass });
                                        onToast?.(
                                          tr(language, {
                                            ru: `${comp.name}: +${formatGrams(concentrateDeficit, 3, language)} → концентрат ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                            en: `${comp.name}: +${formatGrams(concentrateDeficit, 3, language)} → concentrate ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                            it: `${comp.name}: +${formatGrams(concentrateDeficit, 3, language)} → concentrato ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                            es: `${comp.name}: +${formatGrams(concentrateDeficit, 3, language)} → concentrado ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                            de: `${comp.name}: +${formatGrams(concentrateDeficit, 3, language)} → Konzentrat ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                          })
                                        );
                                      }}
                                      title={
                                        canTopUp
                                          ? tr(language, {
                                              ru: `Довести до максимума концентрата (${formatGrams(activeConcentrateGrams, 2, language)}): +${formatGrams(concentrateDeficit, 3, language)} → ${formatGrams(nextMass, 3, language)}`,
                                              en: `Top up concentrate to ${formatGrams(activeConcentrateGrams, 2, language)}: +${formatGrams(concentrateDeficit, 3, language)} → ${formatGrams(nextMass, 3, language)}`,
                                              it: `Porta il concentrato a ${formatGrams(activeConcentrateGrams, 2, language)}: +${formatGrams(concentrateDeficit, 3, language)} → ${formatGrams(nextMass, 3, language)}`,
                                              es: `Completar concentrado a ${formatGrams(activeConcentrateGrams, 2, language)}: +${formatGrams(concentrateDeficit, 3, language)} → ${formatGrams(nextMass, 3, language)}`,
                                              de: `Konzentrat auf ${formatGrams(activeConcentrateGrams, 2, language)} auffüllen: +${formatGrams(concentrateDeficit, 3, language)} → ${formatGrams(nextMass, 3, language)}`,
                                            })
                                          : tr(language, {
                                              ru: `Концентрат уже составляет ${formatGrams(activeSummary.aromaticMixtureGrams, 2, language)} / ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                              en: `Concentrate is already at ${formatGrams(activeSummary.aromaticMixtureGrams, 2, language)} / ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                              it: `Il concentrato è già a ${formatGrams(activeSummary.aromaticMixtureGrams, 2, language)} / ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                              es: `El concentrado ya está en ${formatGrams(activeSummary.aromaticMixtureGrams, 2, language)} / ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                              de: `Konzentrat liegt bereits bei ${formatGrams(activeSummary.aromaticMixtureGrams, 2, language)} / ${formatGrams(activeConcentrateGrams, 2, language)}`,
                                            })
                                      }
                                      aria-label={tr(language, {
                                        ru: `Довести ${comp.name} до максимума концентрата`,
                                        en: `Top up ${comp.name} to target concentrate`,
                                        it: `Completa ${comp.name} fino al concentrato`,
                                        es: `Completar ${comp.name} hasta concentrado`,
                                        de: `${comp.name} auf Konzentrat auffüllen`,
                                      })}
                                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ${
                                        canTopUp
                                          ? 'border-[#D2D0CE] bg-white text-[var(--theme-accent)] hover:bg-[#F3F2F1] hover:border-[var(--theme-accent)]'
                                          : 'border-[#EAEAE6] bg-[#FAF9F8] text-[#B8B8B2] cursor-not-allowed'
                                      }`}
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                    </button>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                              {comp.tier === 'solvent' ? '—' : formatGrams(pureMass, 3, language)}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-xs tabular-nums text-[#181917]">
                              {formatPercent(pctFormula, 1)}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                              {comp.tier === 'solvent' ? (
                                '—'
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <div className="inline-flex items-center gap-0.5">
                                    <input
                                      type="number"
                                      min={0}
                                      max={1000}
                                      step="0.1"
                                      value={Number(pctInTargetConcentrate.toFixed(2))}
                                      onChange={(e) => {
                                        const pctVal = Math.max(0, Number(e.target.value) || 0);
                                        handleUpdateComponent(comp.id, {
                                          weightGrams: Number(
                                            ((activeConcentrateGrams * pctVal) / 100).toFixed(3)
                                          ),
                                        });
                                      }}
                                      aria-label={`${comp.name} ${t.colPctConc}`}
                                      className="w-14 rounded border border-[#E4E4E0] bg-white px-1 py-1 text-right font-mono text-xs font-medium tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                                    />
                                    <span className="text-[11px] text-[#6B6D68]">%</span>
                                  </div>
                                  {comp.dilutionPercent < 100 && (
                                    <span className="text-[10px] text-[#787A74]">
                                      {tr(language, {
                                        ru: `чист. ${formatPercent(pctConcentratePure, 1)}`,
                                        en: `pure ${formatPercent(pctConcentratePure, 1)}`,
                                        it: `puro ${formatPercent(pctConcentratePure, 1)}`,
                                        es: `puro ${formatPercent(pctConcentratePure, 1)}`,
                                        de: `rein ${formatPercent(pctConcentratePure, 1)}`,
                                      })}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-xs tabular-nums">
                              {comp.tier === 'solvent' || !compPerceived ? (
                                <span className="text-[#8B8D87]">—</span>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold text-[var(--theme-accent)]">
                                      {formatPercent(compPerceived.perceivedImpactPercent, 1)}
                                    </span>
                                    {compPerceived.impactRatio >= 1.5 && (
                                      <span
                                        className="rounded bg-[#FEF3C7] px-1 py-0.2 text-[10px] font-semibold text-[#B45309]"
                                        title={tr(language, {
                                          ru: 'Высокоимпактный материал: звучит заметно громче своей доли по массе',
                                          en: 'High-impact material: smells significantly stronger than its mass share',
                                          it: 'Materiale ad alto impatto: odora più forte della sua quota in massa',
                                          es: 'Material de alto impacto: huele más fuerte que su porcentaje en masa',
                                          de: 'High-Impact-Material: riecht deutlich stärker als sein Masseanteil',
                                        })}
                                      >
                                        {compPerceived.impactRatio.toFixed(1)}×
                                      </span>
                                    )}
                                  </div>
                                  <div className="h-1 w-14 overflow-hidden rounded-full bg-[#EAEAE6]">
                                    <div
                                      style={{
                                        width: `${Math.min(100, compPerceived.perceivedImpactPercent)}%`,
                                      }}
                                      className="h-full bg-[var(--theme-accent)]"
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                              <div className="font-medium text-[#181917]">
                                {formatCurrencyDecimal(lineCost, language, currency)}
                              </div>
                              {unitCost > 0 && (
                                <div className="text-[10px] text-[#787A74]">
                                  {formatCurrencyDecimal(unitCost, language, currency)}/{formatUnit('г', language)}
                                </div>
                              )}
                            </td>
                            <td className="py-2 pl-1 pr-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center justify-end gap-1">
                                {isMissingFromStock && onAddToCart && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onAddToCart(
                                        {
                                          name: comp.name,
                                          ingredientId: linkedIng?.id,
                                          inciOrCas: linkedIng?.inciOrCas,
                                          family: comp.family,
                                          tier: comp.tier,
                                          origin: linkedIng?.origin || 'synthetic',
                                          dilutionPercent: comp.dilutionPercent,
                                          requiredGrams: deficitGrams,
                                          costPerGram: comp.costPerGram,
                                          olfactoryNotes: linkedIng?.olfactoryNotes || comp.note,
                                          odorImpact: comp.odorImpact,
                                          substantivityHours: comp.substantivityHours,
                                          scentBreakdown: comp.scentBreakdown,
                                        },
                                        project.id
                                      )
                                    }
                                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-1 text-[10.5px] font-medium transition-colors ${
                                      isCompInCart
                                        ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#15803D]'
                                        : 'border-[#E4E4E0] bg-white text-[#B45309] hover:bg-[#FFFBEB] hover:border-[#F59E0B]'
                                    }`}
                                    title={tr(language, {
                                      ru: 'Нет на складе — добавить ингредиент в корзину (список покупок и смета)',
                                      en: 'Missing from stock — add to cart (shopping list & budget)',
                                      it: 'Non in magazzino — aggiungi al carrello',
                                      es: 'Sin stock — añadir al carrito',
                                      de: 'Nicht auf Lager — in den Warenkorb',
                                    })}
                                    aria-label={tr(language, {
                                      ru: `Добавить ${comp.name} в корзину`,
                                      en: `Add ${comp.name} to cart`,
                                      it: `Aggiungi ${comp.name} al carrello`,
                                      es: `Añadir ${comp.name} al carrito`,
                                      de: `${comp.name} in den Warenkorb`,
                                    })}
                                  >
                                    {isCompInCart ? (
                                      <Check className="h-3 w-3 shrink-0" />
                                    ) : (
                                      <ShoppingCart className="h-3 w-3 shrink-0" />
                                    )}
                                    <span className="hidden 2xl:inline">
                                      {isCompInCart
                                        ? tr(language, {
                                            ru: 'В корзине',
                                            en: 'In cart',
                                            it: 'Nel carrello',
                                            es: 'En carrito',
                                            de: 'Im Korb',
                                          })
                                        : tr(language, {
                                            ru: 'В корзину',
                                            en: 'To cart',
                                            it: 'Carrello',
                                            es: 'Carrito',
                                            de: 'Warenkorb',
                                          })}
                                    </span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComponent(comp.id)}
                                  className="rounded p-1 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                                  aria-label={t.deleteComponentAria(comp.name)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {displayComponents.length === 0 && (
                        <tr>
                          <td colSpan={11} className="py-10 text-center text-xs text-[#787A74]">
                            {activeComponents.length === 0
                              ? tr(language, {
                                  ru: 'В формуле пока нет компонентов — нажмите «+» на верхней ленте, чтобы добавить аромат из библиотеки или склада.',
                                  en: 'No components yet — use "+" on the top ribbon to search and add materials.',
                                  it: 'Nessun componente ancora — usa "+" sulla barra in alto per aggiungere essenze.',
                                  es: 'Sin componentes aún — usa "+" en la cinta superior para añadir aromas.',
                                  de: 'Noch keine Rohstoffe — oben im Menüband über "+" suchen und hinzufügen.',
                                })
                              : tr(language, {
                                  ru: 'По заданному фильтру ничего не найдено.',
                                  en: 'No matching components for current filters.',
                                  it: 'Nessun componente corrispondente ai filtri.',
                                  es: 'Ningún componente coincide con el filtro.',
                                  de: 'Keine passenden Rohstoffe gefunden.',
                                })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {activeComponents.length > 0 && (
                      <tfoot>
                        <tr className="border-t border-[#E4E4E0] bg-[#FAF9F8] text-xs font-semibold text-[#181917] tabular-nums">
                          <td colSpan={4} className="py-2.5 pl-3 pr-2 text-[#575955]">
                            {tr(language, {
                              ru: `Итого (${activeComponents.length} комп.${isFiltered ? `, показано ${displayComponents.length}` : ''} · концентрат ${formatGrams(activeConcentrateGrams, 2, language)})`,
                              en: `Total (${activeComponents.length} items${isFiltered ? `, ${displayComponents.length} shown` : ''} · concentrate ${formatGrams(activeConcentrateGrams, 2, language)})`,
                              it: `Totale (${activeComponents.length} comp.${isFiltered ? `, mostrati ${displayComponents.length}` : ''} · concentrato ${formatGrams(activeConcentrateGrams, 2, language)})`,
                              es: `Total (${activeComponents.length} comp.${isFiltered ? `, ${displayComponents.length} vis.` : ''} · concentrado ${formatGrams(activeConcentrateGrams, 2, language)})`,
                              de: `Gesamt (${activeComponents.length} Pos.${isFiltered ? `, ${displayComponents.length} gefiltert` : ''} · Konzentrat ${formatGrams(activeConcentrateGrams, 2, language)})`,
                            })}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {formatGrams(activeSummary.totalWeightGrams, 2, language)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-[#575955]">
                            {formatGrams(activeSummary.pureAromaticGrams, 3, language)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-[#575955]">
                            100%
                          </td>
                          <td
                            className={`py-2.5 px-2 text-right font-mono ${
                              Math.abs(activeConcPct - 100) <= 0.5
                                ? 'text-[#15803D]'
                                : activeConcPct > 100.5
                                  ? 'text-[#B45309]'
                                  : 'text-[var(--theme-accent)]'
                            }`}
                          >
                            {formatPercent(activeConcPct, 1)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-[#575955]">
                            {activeSummary.aromaticMixtureGrams > 0 ? '100%' : '—'}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {formatCurrencyDecimal(activeSummary.totalFormulaCost, language, currency)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left border-collapse text-xs">
                    <thead className="bg-[#FAF9F8] border-b border-[#E4E4E0] text-[11px] font-semibold text-[#605E5C]">
                      <tr>
                        <th className="py-2 pl-3 pr-2">
                          {tr(language, { ru: 'Компонент', en: 'Component', it: 'Componente', es: 'Componente', de: 'Rohstoff' })}
                        </th>
                        <th className="py-2 px-2 min-w-[200px]">
                          {tr(language, { ru: 'Подпись на бутылке', en: 'Bottle Label', it: 'Etichetta flacone', es: 'Etiqueta frasco', de: 'Flaschenbeschriftung' })}
                        </th>
                        <th className="py-2 px-2">
                          {tr(language, { ru: 'Ярус · Семейство', en: 'Tier · Family', it: 'Nota · Famiglia', es: 'Nota · Familia', de: 'Note · Familie' })}
                        </th>
                        <th className="py-2 px-2 text-right">
                          {tr(language, { ru: 'Развед.', en: 'Dilution', it: 'Diluizione', es: 'Dilución', de: 'Verdünn.' })}
                        </th>
                        <th className="py-2 px-2 text-right">
                          {tr(language, { ru: 'Нужно в формуле', en: 'Required', it: 'Richiesto', es: 'Requerido', de: 'Benötigt' })}
                        </th>
                        <th className="py-2 px-2 text-right">
                          {tr(language, { ru: 'Остаток на складе', en: 'In Stock', it: 'In magazzino', es: 'En stock', de: 'Lagerbestand' })}
                        </th>
                        <th className="py-2 px-2 text-right">
                          {tr(language, { ru: 'Достаточность', en: 'Availability', it: 'Disponibilità', es: 'Disponibilidad', de: 'Verfügbarkeit' })}
                        </th>
                        <th className="py-2 pl-2 pr-3 text-right">
                          {tr(language, { ru: 'Стоимость', en: 'Cost', it: 'Costo', es: 'Coste', de: 'Kosten' })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEBE9]">
                      {displayComponents.map((comp) => {
                        const matched = findLinkedIng(comp);
                        const stockVal = matched ? getIngredientStockGrams(matched) : null;
                        const isLow = stockVal !== null && stockVal <= 15;
                        const isWishlist = matched?.status === 'wishlist';
                        const isShortage = stockVal !== null && comp.weightGrams > stockVal + 0.001;
                        const deficit = stockVal !== null ? Math.max(0, comp.weightGrams - stockVal) : 0;
                        const remainingAfter = stockVal !== null ? Math.max(0, stockVal - comp.weightGrams) : 0;
                        const pctFormula =
                          activeSummary.totalWeightGrams > 0
                            ? (comp.weightGrams / activeSummary.totalWeightGrams) * 100
                            : 0;
                        const compCost = comp.weightGrams * (comp.costPerGram || 0);

                        return (
                          <tr key={comp.id} className="hover:bg-[#FAFBF9] transition-colors">
                            <td className="py-2 pl-3 pr-2 min-w-[160px]">
                              <div className="font-semibold text-[#181917]">{comp.name}</div>
                              {(matched?.inciOrCas || comp.note) && (
                                <div className="text-[10.5px] text-[#605E5C] truncate max-w-[240px]">
                                  {matched?.inciOrCas ? `${matched.inciOrCas} · ` : ''}
                                  {comp.note || ''}
                                </div>
                              )}
                            </td>

                            <td className="py-2 px-2 min-w-[200px]">
                              <input
                                type="text"
                                value={matched?.bottleLabel || ''}
                                onChange={(e) => {
                                  if (matched && onUpdateIngredient) {
                                    onUpdateIngredient({
                                      ...matched,
                                      bottleLabel: e.target.value,
                                    });
                                  }
                                }}
                                disabled={!matched}
                                placeholder={
                                  matched
                                    ? tr(language, {
                                        ru: 'Подпись на флаконе...',
                                        en: 'Bottle signature...',
                                        it: 'Firma sul flacone...',
                                        es: 'Firma en frasco...',
                                        de: 'Flaschenbeschriftung...',
                                      })
                                    : tr(language, {
                                        ru: 'Не привязан к складу',
                                        en: 'Not in catalog',
                                        it: 'Non nel catalogo',
                                        es: 'No vinculado',
                                        de: 'Nicht verknüpft',
                                      })
                                }
                                className="w-full rounded border border-[#E1DFDD] bg-white px-2 py-1 text-xs text-[#181917] placeholder:text-[#8A8886] focus:border-[var(--theme-accent)] focus:outline-none disabled:bg-[#F3F2F1] disabled:text-[#8A8886]"
                              />
                            </td>

                            <td className="py-2 px-2 text-[#575955] whitespace-nowrap">
                              <span className="font-medium text-[#181917]">
                                {getNoteTierShort(comp.tier, language)}
                              </span>{' '}
                              · {getOlfactoryFamilyShort(comp.family, language)}
                            </td>

                            <td className="py-2 px-2 text-right font-mono tabular-nums text-[#181917]">
                              {comp.dilutionPercent}%
                            </td>

                            <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                              <span className="font-semibold text-[#181917]">
                                {formatGrams(comp.weightGrams, 2, language)}
                              </span>{' '}
                              <span className="text-[10px] text-[#797775]">
                                ({formatPercent(pctFormula, 1)})
                              </span>
                            </td>

                            <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                              {matched ? (
                                isWishlist ? (
                                  <span className="text-[#605E5C]">
                                    {getIngredientStatusLabel('wishlist', language)}
                                  </span>
                                ) : stockVal !== null ? (
                                  <span
                                    className={
                                      isLow
                                        ? 'font-semibold text-[#B45309]'
                                        : 'font-medium text-[#15803D]'
                                    }
                                  >
                                    {stockVal} {formatUnit(matched.unit, language)}
                                  </span>
                                ) : (
                                  <span className="text-[#605E5C]">
                                    {getIngredientStatusLabel(matched.status, language)}
                                  </span>
                                )
                              ) : (
                                <span className="text-[#8A8886] text-[10.5px]">
                                  {tr(language, { ru: 'ручной', en: 'manual', it: 'manuale', es: 'manual', de: 'manuell' })}
                                </span>
                              )}
                            </td>

                            <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                              {(() => {
                                const needsCart =
                                  !matched ||
                                  matched.status !== 'in_stock' ||
                                  isShortage;
                                const isStockCompInCart = projectEstimates.some(
                                  (e) =>
                                    (comp.ingredientId && e.ingredientId === comp.ingredientId) ||
                                    e.ingredientName.trim().toLowerCase() === comp.name.trim().toLowerCase()
                                );
                                const cartQty = isShortage
                                  ? Math.max(1, Number(deficit.toFixed(2)))
                                  : Math.max(1, Number(comp.weightGrams.toFixed(2)));

                                const statusBadge = !matched ? (
                                  <span className="text-[#8A8886]">
                                    {tr(language, {
                                      ru: 'Нет на складе',
                                      en: 'Not in stock',
                                      it: 'Non in stock',
                                      es: 'Sin stock',
                                      de: 'Nicht vorrätig',
                                    })}
                                  </span>
                                ) : isWishlist ? (
                                  <span className="text-[#B45309] font-medium">
                                    {tr(language, { ru: 'Нужно купить', en: 'To buy', it: 'Da comprare', es: 'Por comprar', de: 'Kaufen' })}
                                  </span>
                                ) : isShortage ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-[#FEF2F2] px-1.5 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
                                    <AlertTriangle className="h-3 w-3 shrink-0" />
                                    <span>
                                      {tr(language, { ru: 'Не хватает', en: 'Short', it: 'Mancano', es: 'Falta', de: 'Fehlt' })}{' '}
                                      {formatGrams(deficit, 2, language)}
                                    </span>
                                  </span>
                                ) : stockVal !== null ? (
                                  <span className="inline-flex items-center gap-1 text-[#15803D]">
                                    <Check className="h-3 w-3 shrink-0" />
                                    <span>
                                      {tr(language, { ru: 'Ост.', en: 'Left', it: 'Res.', es: 'Rest.', de: 'Rest' })}{' '}
                                      {formatGrams(remainingAfter, 1, language)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-[#797775]">—</span>
                                );

                                return (
                                  <div className="inline-flex items-center justify-end gap-2">
                                    {statusBadge}
                                    {needsCart && onAddToCart && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onAddToCart(
                                            {
                                              name: comp.name,
                                              ingredientId: matched?.id,
                                              inciOrCas: matched?.inciOrCas,
                                              family: comp.family,
                                              tier: comp.tier,
                                              origin: matched?.origin || 'synthetic',
                                              dilutionPercent: comp.dilutionPercent,
                                              requiredGrams: cartQty,
                                              costPerGram: comp.costPerGram,
                                              olfactoryNotes: matched?.olfactoryNotes || comp.note,
                                              odorImpact: comp.odorImpact,
                                              substantivityHours: comp.substantivityHours,
                                              scentBreakdown: comp.scentBreakdown,
                                            },
                                            project.id
                                          )
                                        }
                                        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-sans text-[11px] font-medium transition-colors ${
                                          isStockCompInCart
                                            ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#15803D]'
                                            : 'border-[#D2D0CE] bg-white text-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)]'
                                        }`}
                                      >
                                        {isStockCompInCart ? (
                                          <Check className="h-3 w-3 shrink-0" />
                                        ) : (
                                          <ShoppingCart className="h-3 w-3 shrink-0" />
                                        )}
                                        <span>
                                          {isStockCompInCart
                                            ? tr(language, {
                                                ru: 'В корзине',
                                                en: 'In cart',
                                                it: 'Nel carrello',
                                                es: 'En carrito',
                                                de: 'Im Korb',
                                              })
                                            : tr(language, {
                                                ru: 'В корзину',
                                                en: 'Add to cart',
                                                it: 'Al carrello',
                                                es: 'Al carrito',
                                                de: 'In Warenkorb',
                                              })}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>

                            <td className="py-2 pl-2 pr-3 text-right font-mono tabular-nums text-[#181917] whitespace-nowrap">
                              {formatCurrencyDecimal(compCost, language, currency)}
                            </td>
                          </tr>
                        );
                      })}

                      {displayComponents.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-xs text-[#787A74]">
                            {activeComponents.length === 0
                              ? tr(language, {
                                  ru: 'В формуле пока нет компонентов — добавьте их через «+» на верхней ленте.',
                                  en: 'No components yet — use "+" on the top ribbon to add materials.',
                                  it: 'Nessun componente ancora — usa "+" sulla barra in alto.',
                                  es: 'Sin componentes aún — usa "+" en la cinta superior.',
                                  de: 'Noch keine Rohstoffe — über "+" im Menüband hinzufügen.',
                                })
                              : tr(language, {
                                  ru: 'По заданному фильтру ничего не найдено.',
                                  en: 'No matching components for current filters.',
                                  it: 'Nessun componente corrispondente.',
                                  es: 'Ningún componente coincide.',
                                  de: 'Keine passenden Rohstoffe.',
                                })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {activeComponents.length > 0 && (
                      <tfoot>
                        <tr className="border-t border-[#E4E4E0] bg-[#FAF9F8] text-xs font-semibold text-[#181917] tabular-nums">
                          <td colSpan={4} className="py-2.5 pl-3 pr-2 text-[#575955]">
                            {stockAlertCount === 0
                              ? tr(language, {
                                  ru: 'Наличие проверено — все привязанные материалы готовы',
                                  en: 'Stock verified — all linked materials ready',
                                  it: 'Scorte verificate — materiali pronti',
                                  es: 'Stock verificado — materiales listos',
                                  de: 'Bestand geprüft — alle verknüpften Rohstoffe bereit',
                                })
                              : tr(language, {
                                  ru: `Требуют внимания (нехватка / малый остаток / к покупке): ${stockAlertCount}`,
                                  en: `Attention needed (shortage / low stock / wishlist): ${stockAlertCount}`,
                                  it: `Richiedono attenzione: ${stockAlertCount}`,
                                  es: `Requieren atención: ${stockAlertCount}`,
                                  de: `Aufmerksamkeit erforderlich: ${stockAlertCount}`,
                                })}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono">
                            {formatGrams(activeSummary.totalWeightGrams, 2, language)}
                          </td>
                          <td colSpan={2} />
                          <td className="py-2.5 pl-2 pr-3 text-right font-mono">
                            {formatCurrencyDecimal(activeSummary.totalFormulaCost, language, currency)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 2: OLFACTORY MAP & PROFILE */}
      {activeTab === 'olfactory' && (
        <div className="space-y-6">
          <OlfactoryMapBuilder
            project={project}
            allProjects={allProjects}
            onSwitchProject={onSwitchProject}
            ingredients={ingredients}
            library={library}
            onUpdateMap={(nextMap) => patchProject({ olfactoryMap: nextMap })}
            language={language}
            activeComponents={activeComponents}
            selectedVariantId={selectedVariantId}
            onSelectVariantId={setSelectedVariantId}
            onGoToFormulaInput={goToFormulaInput}
          />
        </div>
      )}

      {/* TAB 3: PROJECT JOURNAL / NOTES */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          {/* Maceration Timers Section */}
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-3.5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#181917] flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[var(--theme-accent)]" />
                  <span>{t.macSectionTitle}</span>
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68]">{t.macSectionDesc}</p>
              </div>
              {readyMacerationCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#A7F3D0] dark:border-[#107C41]/50 bg-[#ECFDF5] px-2.5 py-1 text-xs font-medium text-[#15803D] tabular-nums">
                  <BellRing className="h-3.5 w-3.5" />
                  {t.readyForTrial(readyMacerationCount)}
                </span>
              )}
            </div>

            {projectMacerations.length > 0 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {projectMacerations.map((batch) => {
                  const status = getMacerationStatus(batch, todayIso);
                  const isReadyAlert = status.isComplete && !batch.acknowledged;
                  const stageTitle =
                    batch.stage === 'concentrate' ? t.macStageConcentrate : t.macStagePerfume;

                  return (
                    <div
                      key={batch.id}
                      className={`rounded-lg border p-4 space-y-2.5 ${
                        isReadyAlert
                          ? 'border-[#A7F3D0] dark:border-[#107C41]/50 bg-[#ECFDF5]'
                          : 'border-[#E4E4E0] bg-[#FAFBF9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#6B6D68]">
                            <span className="text-[var(--theme-accent)] font-semibold">
                              {stageTitle}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {batch.startDate} → {status.endDate} ({status.totalDays}{' '}
                              {t.daysShort})
                            </span>
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-[#181917]">
                            {batch.label}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteMacerationBatch(batch.id)}
                          className="rounded p-1 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                          aria-label={t.deleteTimerAria}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {batch.notes && (
                        <p className="text-xs text-[#575955] leading-relaxed">{batch.notes}</p>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                          <span
                            className={
                              isReadyAlert
                                ? 'font-semibold text-[#15803D]'
                                : status.isComplete
                                  ? 'text-[#6B6D68]'
                                  : 'text-[#3F413D]'
                            }
                          >
                            {isReadyAlert
                              ? status.overdueDays === 0
                                ? t.macFinishedToday
                                : t.macFinishedDaysAgo(status.overdueDays)
                              : status.isComplete
                                ? t.macCheckedCompleted
                                : t.macDaysLeft(
                                    status.remainingDays,
                                    status.elapsedDays,
                                    status.totalDays
                                  )}
                          </span>
                          <span className="text-[#6B6D68]">{status.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E0]">
                          <div
                            style={{ width: `${status.progressPercent}%` }}
                            className={
                              isReadyAlert
                                ? 'h-full bg-[#15803D]'
                                : 'h-full bg-[var(--theme-accent)]'
                            }
                          />
                        </div>
                      </div>

                      {isReadyAlert && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handlePrepareTrialFromMaceration(batch)}
                            className="inline-flex items-center gap-1 rounded-md bg-[var(--theme-accent)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                          >
                            <Plus className="h-3 w-3" />
                            <span>{t.logTrialNoteBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcknowledgeMacerationBatch(batch.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#3F413D] hover:bg-[#F3F2F1]"
                          >
                            <Check className="h-3 w-3" />
                            <span>{t.markCheckedBtn}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <form
              onSubmit={handleAddMacerationBatch}
              className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end"
            >
              <div className="lg:col-span-2">
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.stageLabel}
                </label>
                <select
                  value={macStage}
                  onChange={(e) => setMacStage(e.target.value as MacerationStage)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  <option value="concentrate">{t.macStageConcentrate}</option>
                  <option value="perfume">{t.finishedPerfumeOption}</option>
                </select>
              </div>
              <div className="lg:col-span-3">
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.batchLabel}
                </label>
                <input
                  type="text"
                  value={macLabel}
                  onChange={(e) => setMacLabel(e.target.value)}
                  placeholder={
                    macStage === 'concentrate'
                      ? t.batchPlaceholderConcentrate
                      : t.batchPlaceholderPerfume
                  }
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.startDateLabel}
                </label>
                <input
                  type="date"
                  value={macStartDate}
                  onChange={(e) => setMacStartDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-2 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.daysLabel}
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={macDurationDays}
                  onChange={(e) => setMacDurationDays(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-2 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
              <div className="lg:col-span-3 flex items-center gap-2">
                <input
                  type="text"
                  value={macNotes}
                  onChange={(e) => setMacNotes(e.target.value)}
                  placeholder={t.storageNotePlaceholder}
                  className="flex-1 min-w-0 rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.startTimerBtn}</span>
                </button>
              </div>
            </form>
          </section>

          <ScentEvolutionVisualizer
            journal={project.journal}
            selectedEntryId={selectedEvolutionEntryId}
            onSelectEntry={(id) => setSelectedEvolutionEntryId(id)}
            onSaveEntryEvolution={handleUpdateJournalEntryEvolution}
            language={language}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Add Note Form */}
          <form
            onSubmit={handleAddJournalEntry}
            className="lg:col-span-5 rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#181917]">
              {t.newNoteTitle}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="j-date" className="block text-xs font-medium text-[#575955] mb-1">
                  {t.dateLabel}
                </label>
                <input
                  id="j-date"
                  type="date"
                  value={journalDate}
                  onChange={(e) => setJournalDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs font-mono text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="j-verdict" className="block text-xs font-medium text-[#575955] mb-1">
                  {t.verdictLabel}
                </label>
                <select
                  id="j-verdict"
                  value={journalVerdict}
                  onChange={(e) => setJournalVerdict(e.target.value as JournalVerdict)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  {(Object.keys(JOURNAL_VERDICT_LABELS) as JournalVerdict[]).map((v) => (
                    <option key={v} value={v}>
                      {getJournalVerdictLabel(v, language)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="j-trial" className="block text-xs font-medium text-[#575955] mb-1">
                {t.trialTitleLabel}
              </label>
              <input
                id="j-trial"
                type="text"
                value={journalTrial}
                onChange={(e) => setJournalTrial(e.target.value)}
                placeholder={t.trialPlaceholder}
                className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-sm text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="j-content" className="block text-xs font-medium text-[#575955] mb-1">
                {t.observationsLabel}
              </label>
              <textarea
                id="j-content"
                rows={5}
                required
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder={t.observationsPlaceholder}
                className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-sm leading-relaxed text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-[#575955]">
              <input
                type="checkbox"
                checked={attachSnapshot}
                onChange={(e) => setAttachSnapshot(e.target.checked)}
                className="rounded border-[#D4D4CE] accent-[var(--theme-accent)]"
              />
              <span>
                {t.attachSnapshotLabel(formatGrams(summary.totalWeightGrams, 1, language))}
              </span>
            </label>

            <div className="space-y-3 border-t border-[#EAEAE6] pt-3">
              <label className="flex items-center justify-between gap-2 text-xs font-medium text-[#181917] cursor-pointer">
                <span className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={recordEvolution}
                    onChange={(e) => setRecordEvolution(e.target.checked)}
                    className="rounded border-[#D4D4CE] accent-[var(--theme-accent)]"
                  />
                  <Activity className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>{t.recordEvolutionLabel}</span>
                </span>
                <span className="font-mono text-[11px] text-[#6B6D68]">
                  {recordEvolution
                    ? `${evolutionPoints.length} ${t.ptsShort}`
                    : t.optionalLabel}
                </span>
              </label>

              {recordEvolution && (
                <ScentEvolutionEditor
                  points={evolutionPoints}
                  onChange={setEvolutionPoints}
                  language={language}
                  compact
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)]"
            >
              <Plus className="h-4 w-4" />
              <span>{t.saveEntryBtn}</span>
            </button>
          </form>

          {/* Journal Timeline */}
          <div className="lg:col-span-7 rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-4">
              <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                {t.labJournalTitle}
              </h2>
              <div className="flex flex-wrap gap-1 rounded-lg bg-[#EEEEEC] p-1">
                <button
                  type="button"
                  onClick={() => setVerdictFilter('all')}
                  className={`rounded px-2.5 py-1 text-xs font-medium ${
                    verdictFilter === 'all' ? 'bg-white text-[#181917]' : 'text-[#575955]'
                  }`}
                >
                  {t.allFilter}
                </button>
                {(Object.keys(JOURNAL_VERDICT_LABELS) as JournalVerdict[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVerdictFilter(v)}
                    className={`rounded px-2.5 py-1 text-xs font-medium ${
                      verdictFilter === v ? 'bg-white text-[#181917]' : 'text-[#575955]'
                    }`}
                  >
                    {getJournalVerdictLabel(v, language)}
                  </button>
                ))}
              </div>
            </div>

            {filteredJournal.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#787A74]">
                {t.noJournalEntries}
              </p>
            ) : (
              <div className="divide-y divide-[#EAEAE6]">
                {filteredJournal.map((entry) => (
                  <article key={entry.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6D68]">
                          <span className="font-mono tabular-nums">{entry.date}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-medium ${
                              entry.verdict === 'approved'
                                ? 'text-[#15803D]'
                                : entry.verdict === 'rejected'
                                  ? 'text-[#B91C1C]'
                                  : entry.verdict === 'needs_work'
                                    ? 'text-[#B45309]'
                                    : 'text-[var(--theme-accent)]'
                            }`}
                          >
                            {getJournalVerdictLabel(entry.verdict, language)}
                          </span>
                          {entry.formulaSnapshotSummary && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{entry.formulaSnapshotSummary}</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-1 text-base font-semibold text-[#181917]">
                          {entry.trialLabel}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedEvolutionEntryId(entry.id)}
                          className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                            selectedEvolutionEntryId === entry.id
                              ? 'bg-[#EAF1FB] text-[var(--theme-accent)]'
                              : 'text-[#6B6D68] hover:bg-[#FAFBF9] hover:text-[#181917]'
                          }`}
                        >
                          {entry.scentEvolution?.length
                            ? t.focusChartBtn
                            : t.addEvolutionBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJournalEntry(entry.id)}
                          className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                          aria-label={t.deleteEntryAria(entry.trialLabel)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#3F413D]">
                      {entry.content}
                    </p>
                    {entry.scentEvolution && entry.scentEvolution.length > 0 && (
                      <ScentEvolutionMiniPreview
                        points={entry.scentEvolution}
                        language={language}
                      />
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {/* TAB 4: PROJECT ESTIMATE & COST MATCHING */}
      {activeTab === 'cost' && (
        <div className="space-y-6">
          {/* Unit Economics Strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.batchRawCostLabel}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyDecimal(summary.totalFormulaCost, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {t.perMassPrefix} {formatGrams(summary.totalWeightGrams, 1, language)}
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.oneBottleLabel(project.targetBottleMl, formatUnit('мл', language))}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyRub(
                  summary.costPerGram * project.targetBottleMl * 0.85 + project.packagingCostPerUnit,
                  language,
                  currency
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B6D68]">
                <span>{t.packagingLabel}</span>
                <input
                  type="number"
                  min={0}
                  value={project.packagingCostPerUnit}
                  onChange={(e) =>
                    patchProject({ packagingCostPerUnit: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-16 rounded border border-[#E4E4E0] px-1.5 py-0.5 text-right font-mono text-xs tabular-nums text-[#181917]"
                />
                <span>{currencySymbol}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.plannedEstimateCard}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyRub(estimateTotals.plannedCost, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {projectEstimates.length} {t.itemsWord}
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.actuallyPurchasedCard}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-[var(--theme-accent)]">
                {formatCurrencyRub(estimateTotals.matchedPurchaseCost, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {t.variancePrefix} {estimateTotals.diff >= 0 ? '+' : ''}
                {formatCurrencyRub(estimateTotals.diff, language, currency)}
              </div>
            </div>
          </div>

          {/* Interactive Bottle Cost Calculator */}
          <BottleCostCalculator
            projects={allProjects}
            ingredients={ingredients}
            language={language}
            currency={currency}
            lockedProjectId={project.id}
            onUpdateProject={onUpdateProject}
          />

          {/* Project Estimate Table with Purchase Reconciliation */}
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                  {t.procurementTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68]">
                  {t.procurementDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={handleImportMissingFromFormula}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3.5 py-2 text-xs font-medium text-[#181917] hover:bg-[#F7F7F5] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                <span>{t.pullFromFormulaBtn}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                    <th className="py-2.5 pr-3">{t.colItemIngredient}</th>
                    <th className="py-2.5 px-2">{t.colCategory}</th>
                    <th className="py-2.5 px-2 text-right">{t.colRequiredPlan}</th>
                    <th className="py-2.5 px-2 text-right">{t.colUnitPrice}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPlanCurrency(currencySymbol)}</th>
                    <th className="py-2.5 px-2 text-right">{t.colBoughtActual}</th>
                    <th className="py-2.5 px-2">{t.colStatus}</th>
                    <th className="py-2.5 pl-2 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE6]">
                  {projectEstimates.map((item) => {
                    const matched = purchases.filter(
                      (p) =>
                        p.estimateItemId === item.id ||
                        (p.projectId === project.id &&
                          item.ingredientId &&
                          p.ingredientId === item.ingredientId)
                    );
                    const boughtQty = matched.reduce((s, p) => s + p.quantity, 0);
                    const boughtSum = matched.reduce((s, p) => s + p.totalCost, 0);
                    const linkedStockIng = ingredients.find(
                      (i) =>
                        (item.ingredientId && i.id === item.ingredientId) ||
                        i.name.trim().toLowerCase() === item.ingredientName.trim().toLowerCase()
                    );
                    const effectiveUnitPrice =
                      item.estimatedUnitPrice > 0
                        ? item.estimatedUnitPrice
                        : linkedStockIng && linkedStockIng.quantityGrams > 0 && linkedStockIng.priceTotal > 0
                          ? Number((linkedStockIng.priceTotal / linkedStockIng.quantityGrams).toFixed(2))
                          : 0;
                    const plannedSum = item.requiredQuantity * effectiveUnitPrice;
                    const isCovered = boughtQty >= item.requiredQuantity && item.requiredQuantity > 0;
                    const isPartial = boughtQty > 0 && !isCovered;
                    const unitLabel = formatUnit(item.unit, language);

                    return (
                      <tr key={item.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-3 pr-3">
                          <div className="font-medium text-[#181917]">{item.ingredientName}</div>
                          {item.notes && (
                            <div className="text-xs text-[#6B6D68]">{item.notes}</div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-xs text-[#575955]">
                          {getBudgetCategoryLabel(item.category, language)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums">
                          {item.requiredQuantity} {unitLabel}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {formatCurrencyDecimal(effectiveUnitPrice, language, currency)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs font-medium tabular-nums">
                          {formatCurrencyRub(plannedSum, language, currency)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums">
                          <div className="font-medium text-[#181917]">
                            {formatCurrencyRub(boughtSum, language, currency)}
                          </div>
                          <div className="text-[11px] text-[#6B6D68]">
                            {boughtQty} {unitLabel}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs">
                          {isCovered ? (
                            <span className="inline-flex items-center gap-1 font-medium text-[#15803D]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {t.statusCovered}
                            </span>
                          ) : isPartial ? (
                            <span className="font-medium text-[#B45309]">
                              {t.statusPartial}
                            </span>
                          ) : (
                            <span className="text-[#6B6D68]">
                              {t.statusNotBought}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openQuickPurchase(item)}
                              className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F7F7F5] whitespace-nowrap"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>{t.buyBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteEstimateItem(item.id)}
                              className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                              aria-label={t.deleteItemAria(item.ingredientName)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {projectEstimates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-[#787A74]">
                        {t.emptyProjectEstimate}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Purchase Inline Bar */}
            {quickPurchaseEstimateId && (
              <div className="rounded-lg border border-[var(--theme-accent)]/30 bg-[var(--theme-accent)]/5 p-4 space-y-3">
                {(() => {
                  const target = projectEstimates.find((e) => e.id === quickPurchaseEstimateId);
                  if (!target) return null;
                  const targetUnit = formatUnit(target.unit, language);
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#181917]">
                          {t.logActualPurchaseTitle} {target.ingredientName}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuickPurchaseEstimateId(null)}
                          className="text-xs text-[#575955] hover:text-[#181917]"
                        >
                          {t.cancelBtn}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 items-end">
                        <div>
                          <label className="block text-[11px] text-[#575955] mb-1">
                            {t.qtyWithUnit(targetUnit)}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step="0.1"
                            value={qpQty}
                            onChange={(e) => setQpQty(e.target.value)}
                            className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#575955] mb-1">
                            {t.pricePerUnit(targetUnit, currencySymbol)}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step="0.1"
                            value={qpUnitPrice}
                            onChange={(e) => setQpUnitPrice(e.target.value)}
                            className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#575955] mb-1">
                            {t.supplierLabel}
                          </label>
                          <input
                            type="text"
                            value={qpSupplier}
                            onChange={(e) => setQpSupplier(e.target.value)}
                            placeholder={t.storeNamePlaceholder}
                            className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#575955] mb-1">
                            {t.dateLabel}
                          </label>
                          <input
                            type="date"
                            value={qpDate}
                            onChange={(e) => setQpDate(e.target.value)}
                            className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => submitQuickPurchase(target)}
                          className="rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                        >
                          {t.savePurchaseBtn}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Add Estimate Item Form */}
            <form
              onSubmit={handleCreateEstimateItem}
              className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs font-semibold text-[#181917]">
                  {t.addEstimateItemTitle}
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                  <input
                    type="text"
                    value={estPickerSearch}
                    onChange={(e) => setEstPickerSearch(e.target.value)}
                    placeholder={
                      language === 'ru'
                        ? 'Поиск в базе и библиотеке ингредиентов...'
                        : 'Search catalog & ingredient library...'
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white py-1.5 pl-8 pr-2.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={estIngredientId}
                  onChange={(e) => handleSelectEstIngredient(e.target.value)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  <option value="">{t.chooseFromCatalogOption}</option>
                  {estSelectOptions.ingList.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                  {estSelectOptions.libList.map((l) => (
                    <option key={`est-lib-${l.id}`} value={`lib:${l.id}`}>
                      [{language === 'ru' ? 'Библиотека' : 'Library'}] {l.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={estName}
                  onChange={(e) => setEstName(e.target.value)}
                  placeholder={t.ingOrBottlePlaceholder}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value as BudgetCategory)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  {(Object.keys(BUDGET_CATEGORY_LABELS) as BudgetCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {getBudgetCategoryLabel(cat, language)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={estNotes}
                  onChange={(e) => setEstNotes(e.target.value)}
                  placeholder={t.noteShortPlaceholder}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 items-end">
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.requiredLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={estQty}
                    onChange={(e) => setEstQty(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.unitLabel}
                  </label>
                  <select
                    value={estUnit}
                    onChange={(e) => setEstUnit(e.target.value as MeasurementUnit)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                  >
                    {(['г', 'мл', 'кг', 'шт'] as MeasurementUnit[]).map((u) => (
                      <option key={u} value={u}>
                        {formatUnit(u, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.estPricePerUnit(currencySymbol)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={estUnitPrice}
                    onChange={(e) => setEstUnitPrice(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.addToEstimateBtn}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* TAB: DILUTION CALCULATORS */}
      {activeTab === 'dilution' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E4E0] bg-white px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#575955] tabular-nums">
              <span>
                {tr(language, {
                  ru: 'Концентрат:',
                  en: 'Concentrate:',
                  it: 'Concentrato:',
                  es: 'Concentrado:',
                  de: 'Konzentrat:',
                })}{' '}
                <strong className="font-mono text-[#181917]">
                  {formatGrams(activeSummary.aromaticMixtureGrams, 2, language)}
                </strong>
              </span>
              <span>
                {tr(language, {
                  ru: 'Растворитель / спирт:',
                  en: 'Solvent / alcohol:',
                  it: 'Solvente / alcol:',
                  es: 'Disolvente / alcohol:',
                  de: 'Lösungsmittel / Alkohol:',
                })}{' '}
                <strong className="font-mono text-[#181917]">
                  {formatGrams(
                    Math.max(0, activeSummary.totalWeightGrams - activeSummary.aromaticMixtureGrams),
                    2,
                    language
                  )}
                </strong>
              </span>
              <span>
                {tr(language, {
                  ru: 'Текущая концентрация:',
                  en: 'Current concentration:',
                  it: 'Concentrazione attuale:',
                  es: 'Concentración actual:',
                  de: 'Aktuelle Konzentration:',
                })}{' '}
                <strong className="font-mono text-[var(--theme-accent)]">
                  {formatPercent(activeSummary.pureConcentrationPercent, 1)}
                </strong>
              </span>
            </div>

            <button
              type="button"
              disabled={activeSummary.pureAromaticGrams <= 0}
              onClick={handleAdjustSolventToTargetConcentration}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs font-semibold text-[#181917] hover:bg-[#F3F2F1] hover:border-[var(--theme-accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              title={t.matchAlcoholTitle(
                CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct
              )}
            >
              <Droplets className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
              <span>
                {t.matchAlcoholBtn(
                  project.targetConcentration,
                  CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct
                )}
              </span>
            </button>
          </div>

          <SolventDilutionCalculator
            projects={allProjects}
            ingredients={ingredients}
            language={language}
            lockedProjectId={project.id}
            onUpdateProject={onUpdateProject}
          />
          <IngredientDilutionCalculator
            ingredients={ingredients}
            projects={allProjects}
            language={language}
            currency={currency}
            activeProject={project}
            onAddToProjectFormula={(_, comp) => {
              patchProject({
                components: [...project.components, comp],
              });
            }}
            onSaveDilutedIngredient={onSaveDilutedIngredient}
            onToast={onToast}
          />
        </div>
      )}
    </div>
  );
}
