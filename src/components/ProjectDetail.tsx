import {
  Activity,
  AlertTriangle,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Droplets,
  FlaskConical,
  Layers,
  Plus,
  Scale,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
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
  getNoteTierLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
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
  calculateFormulaSummary,
  formatCurrencyDecimal,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
  getIngredientStockGrams,
  getMacerationStatus,
} from '../utils/calculations';
import { tr } from '../data/i18n';
import { generateId, todayIsoDate } from '../utils/storage';
import { BottleCostCalculator } from './BottleCostCalculator';
import { FormulaOlfactoryProfileRadar } from './FormulaOlfactoryProfileRadar';
import { IngredientDilutionCalculator } from './IngredientDilutionCalculator';
import { OlfactoryMapBuilder } from './OlfactoryMapBuilder';
import {
  createDefaultEvolutionCheckpoints,
  ScentEvolutionEditor,
  ScentEvolutionMiniPreview,
  ScentEvolutionVisualizer,
} from './ScentEvolutionPanel';
import { SolventDilutionCalculator } from './SolventDilutionCalculator';

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
  onToast?: (message: string) => void;
  viewSettings?: ViewSettings;
  language?: AppLanguage;
  currency?: AppCurrency;
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
  viewSettings = DEFAULT_VIEW_SETTINGS,
  language = 'ru',
  currency = 'RUB',
}: ProjectDetailProps) {
  const t = PROJECT_DETAIL_TEXT[language];
  const currencySymbol = getCurrencySymbol(currency);
  const summary = useMemo(() => calculateFormulaSummary(project.components), [project.components]);

  // Project Ingredients Tab State (supports main formula and variants)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [projIngSearch, setProjIngSearch] = useState('');
  const [projIngTierFilter, setProjIngTierFilter] = useState<'all' | NoteTier>('all');

  // Formula Add Component State
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [formulaPickerSearch, setFormulaPickerSearch] = useState('');
  const [compName, setCompName] = useState('');
  const [compTier, setCompTier] = useState<NoteTier>('heart');
  const [compFamily, setCompFamily] = useState<OlfactoryFamilyKey>('woody');
  const [compDilution, setCompDilution] = useState('100');
  const [compWeight, setCompWeight] = useState('0.50');
  const [compCostPerGram, setCompCostPerGram] = useState('0');
  const [compNote, setCompNote] = useState('');
  const [estPickerSearch, setEstPickerSearch] = useState('');

  // Batch Scale State
  const [targetScaleGrams, setTargetScaleGrams] = useState(String(project.targetBottleMl || 30));

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

  const handleSelectIngredientForFormula = (ingId: string) => {
    setSelectedIngredientId(ingId);
    if (ingId.startsWith('lib:')) {
      const libId = ingId.slice(4);
      const libItem = library.find((l) => l.id === libId);
      if (!libItem) return;
      setCompName(libItem.name);
      setCompTier(libItem.tier);
      setCompFamily(libItem.family);
      setCompDilution('100');
      setCompCostPerGram('0');
      if (libItem.scentDescription && !compNote) {
        setCompNote(libItem.scentDescription.slice(0, 70));
      }
      return;
    }
    const ing = ingredients.find((i) => i.id === ingId);
    if (!ing) return;
    setCompName(ing.name);
    setCompTier(ing.tier);
    setCompFamily(ing.family);
    setCompDilution(String(ing.dilutionPercent));
    const unitCost = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setCompCostPerGram(unitCost.toFixed(2));
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    const resolvedIngId =
      selectedIngredientId && !selectedIngredientId.startsWith('lib:')
        ? selectedIngredientId
        : undefined;
    const newComp: FormulaComponent = {
      id: generateId('fc'),
      ingredientId: resolvedIngId,
      name: compName.trim(),
      tier: compTier,
      family: compFamily,
      dilutionPercent: Math.min(100, Math.max(0.01, Number(compDilution) || 100)),
      weightGrams: Math.max(0, Number(compWeight) || 0),
      costPerGram: Math.max(0, Number(compCostPerGram) || 0),
      note: compNote.trim() || undefined,
    };
    patchProject({
      components: [...project.components, newComp],
    });
    setSelectedIngredientId('');
    setFormulaPickerSearch('');
    setCompName('');
    setCompWeight('0.50');
    setCompCostPerGram('0');
    setCompNote('');
  };

  const handleUpdateComponent = (id: string, patch: Partial<FormulaComponent>) => {
    patchProject({
      components: project.components.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const handleDeleteComponent = (id: string) => {
    patchProject({
      components: project.components.filter((c) => c.id !== id),
    });
  };

  const handleScaleFormula = () => {
    const target = Number(targetScaleGrams);
    if (!Number.isFinite(target) || target <= 0 || summary.totalWeightGrams <= 0) return;
    const ratio = target / summary.totalWeightGrams;
    patchProject({
      components: project.components.map((c) => ({
        ...c,
        weightGrams: Number((c.weightGrams * ratio).toFixed(3)),
      })),
    });
  };

  const handleAdjustSolventToTargetConcentration = () => {
    const targetPct = CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct;
    if (summary.pureAromaticGrams <= 0 || targetPct <= 0 || targetPct >= 100) return;

    const requiredTotalMass = summary.pureAromaticGrams / (targetPct / 100);
    // Non-solvent diluted components already carry (aromaticMixtureGrams - pureAromaticGrams) of carrier
    const neededSolventWeight = Math.max(
      0,
      Number((requiredTotalMass - summary.aromaticMixtureGrams).toFixed(2))
    );

    const existingSolventIdx = project.components.findIndex((c) => c.tier === 'solvent');
    if (existingSolventIdx >= 0) {
      const updated = project.components.map((c, idx) =>
        idx === existingSolventIdx ? { ...c, weightGrams: neededSolventWeight } : c
      );
      patchProject({ components: updated });
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
      patchProject({ components: [...project.components, solventComp] });
    }
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[#E4E4E0] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={project.code}
                onChange={(e) => patchProject({ code: e.target.value })}
                aria-label={t.projectCodeAria}
                className="w-20 rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 font-mono text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
              <select
                value={project.status}
                onChange={(e) => patchProject({ status: e.target.value as ProjectStatus })}
                aria-label={t.projectStatusAria}
                className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {getProjectStatusLabel(st, language)}
                  </option>
                ))}
              </select>
              <select
                value={project.targetConcentration}
                onChange={(e) =>
                  patchProject({ targetConcentration: e.target.value as ConcentrationType })
                }
                aria-label={t.targetConcAria}
                className="rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(CONCENTRATION_TARGET_PERCENT) as ConcentrationType[]).map((c) => (
                  <option key={c} value={c}>
                    {c} ({CONCENTRATION_TARGET_PERCENT[c].range})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs">
                <span className="text-[#6B6D68]">{t.bottleLabel}</span>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={project.targetBottleMl}
                  onChange={(e) =>
                    patchProject({ targetBottleMl: Math.max(1, Number(e.target.value) || 30) })
                  }
                  className="w-12 bg-transparent text-right font-mono tabular-nums text-[#181917] focus:outline-none"
                />
                <span className="text-[#6B6D68]">{formatUnit('мл', language)}</span>
              </div>
              <span className="text-xs text-[#6B6D68] tabular-nums">
                {t.updatedLabel} {project.updatedAt}
              </span>
            </div>

            <input
              type="text"
              value={project.title}
              onChange={(e) => patchProject({ title: e.target.value })}
              placeholder={t.fragranceTitlePlaceholder}
              aria-label={t.projectTitleAria}
              className="w-full bg-transparent font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#181917] focus:outline-none focus:ring-0 border-b border-transparent focus:border-[var(--theme-accent)]"
            />
          </div>

          {/* Key Live Metrics Strip */}
          {viewSettings.showProjectMetrics && (
            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[#E4E4E0] bg-white px-5 py-3 shrink-0">
              <div>
                <div className="text-[11px] text-[#6B6D68]">
                  {t.batchWeightLabel}
                </div>
                <div className="font-mono text-base font-semibold tabular-nums text-[#181917]">
                  {formatGrams(summary.totalWeightGrams, 2, language)}
                </div>
              </div>
              <div className="h-7 w-px bg-[#EAEAE6]" />
              <div>
                <div className="text-[11px] text-[#6B6D68]">
                  {t.pureConcentrateLabel}
                </div>
                <div className="font-mono text-base font-semibold tabular-nums text-[var(--theme-accent)]">
                  {formatPercent(summary.pureConcentrationPercent, 1)}
                </div>
              </div>
              <div className="h-7 w-px bg-[#EAEAE6]" />
              <div>
                <div className="text-[11px] text-[#6B6D68]">
                  {t.materialCostLabel}
                </div>
                <div className="font-mono text-base font-semibold tabular-nums text-[#181917]">
                  {formatCurrencyRub(summary.totalFormulaCost, language, currency)}
                </div>
              </div>
            </div>
          )}
        </div>

        {projectMacerations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onChangeTab('journal')}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors ${
                readyMacerationCount > 0
                  ? 'border-[#A7F3D0] dark:border-[#107C41]/50 bg-[#ECFDF5] text-[#15803D] hover:bg-[#D1FAE5] dark:hover:bg-[#107C41]/30'
                  : 'border-[#E4E4E0] bg-[#FAFBF9] text-[#575955] hover:bg-[#F3F2F1]'
              }`}
            >
              {readyMacerationCount > 0 ? (
                <BellRing className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
              )}
              <span>
                {readyMacerationCount > 0
                  ? t.macerationFinishedAlert(readyMacerationCount)
                  : t.macerationTimersCount(projectMacerations.length)}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: IDEA & FORMULA */}
      {activeTab === 'formula' && (
        <div className="space-y-6">
          {/* Idea & Inspiration */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 rounded-xl border border-[#E4E4E0] bg-white p-6">
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
                className="mt-2 w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3.5 py-2.5 text-sm leading-relaxed text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
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
                className="mt-2 w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3.5 py-2.5 text-sm leading-relaxed text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
              />
            </div>
          </section>

          {/* Formula Table & Batch Tools */}
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                  {t.formulaSectionTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68] tabular-nums">
                  {t.pureAromaticBaseLabel}{' '}
                  {formatGrams(summary.pureAromaticGrams, 3, language)} ·{' '}
                  {t.solventLabel}{' '}
                  {formatGrams(summary.solventCarrierGrams, 2, language)} ·{' '}
                  {t.pyramidBalanceLabel}{' '}
                  {Math.round(summary.tierPercentOfPure.top)}% /{' '}
                  {Math.round(summary.tierPercentOfPure.heart)}% /{' '}
                  {Math.round(summary.tierPercentOfPure.base)}%
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5">
                  <Scale className="h-3.5 w-3.5 text-[#575955]" />
                  <input
                    type="number"
                    min={1}
                    step="0.5"
                    value={targetScaleGrams}
                    onChange={(e) => setTargetScaleGrams(e.target.value)}
                    className="w-16 bg-transparent text-right font-mono text-xs tabular-nums text-[#181917] focus:outline-none"
                    aria-label={t.targetMassAria}
                  />
                  <span className="text-xs text-[#6B6D68]">{formatUnit('г', language)}</span>
                  <button
                    type="button"
                    onClick={handleScaleFormula}
                    className="ml-1 rounded bg-white px-2 py-1 text-xs font-medium text-[#181917] border border-[#E4E4E0] hover:bg-[#F1F1EE] whitespace-nowrap"
                  >
                    {t.scaleBtn}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdjustSolventToTargetConcentration}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs font-medium text-[#181917] hover:bg-[#F7F7F5] whitespace-nowrap"
                  title={t.matchAlcoholTitle(
                    CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct
                  )}
                >
                  <Droplets className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>
                    {t.matchAlcoholBtn(
                      project.targetConcentration,
                      CONCENTRATION_TARGET_PERCENT[project.targetConcentration].defaultPct
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Tier visual bar */}
            {summary.pureAromaticGrams > 0 && (
              <div className="space-y-1.5">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EEEEEC]">
                  <div
                    style={{ width: `${summary.tierPercentOfPure.top}%` }}
                    className="bg-[#D97706]"
                    title={`${t.topLabel} ${summary.tierPercentOfPure.top.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${summary.tierPercentOfPure.heart}%` }}
                    className="bg-[var(--theme-accent)]"
                    title={`${t.heartLabel} ${summary.tierPercentOfPure.heart.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${summary.tierPercentOfPure.base}%` }}
                    className="bg-[#78350F]"
                    title={`${t.baseLabel} ${summary.tierPercentOfPure.base.toFixed(1)}%`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#575955] tabular-nums">
                  <span>
                    {t.topLabel} {formatPercent(summary.tierPercentOfPure.top, 1)}
                  </span>
                  <span>
                    {t.heartLabel} {formatPercent(summary.tierPercentOfPure.heart, 1)}
                  </span>
                  <span>
                    {t.baseLabel} {formatPercent(summary.tierPercentOfPure.base, 1)}
                  </span>
                </div>
              </div>
            )}

            {/* Formula Spreadsheet Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                    <th className="py-2.5 pr-3">{t.colComponent}</th>
                    <th className="py-2.5 px-2">{t.colTier}</th>
                    <th className="py-2.5 px-2">{t.colFamily}</th>
                    <th className="py-2.5 px-2 text-right">{t.colDilution}</th>
                    <th className="py-2.5 px-2 text-right">{t.colMassG(formatUnit('г', language))}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPureMat}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPctFormula}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPctConc}</th>
                    <th className="py-2.5 px-2 text-right">{t.colCost}</th>
                    <th className="py-2.5 pl-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE6]">
                  {project.components.map((comp) => {
                    const pureMass =
                      comp.tier === 'solvent'
                        ? 0
                        : Math.max(0, comp.weightGrams) *
                          (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
                    const pctFormula =
                      summary.totalWeightGrams > 0
                        ? (comp.weightGrams / summary.totalWeightGrams) * 100
                        : 0;
                    const pctPureTotal =
                      summary.totalWeightGrams > 0
                        ? (pureMass / summary.totalWeightGrams) * 100
                        : 0;
                    const pctConcentrate =
                      comp.tier !== 'solvent' && summary.pureAromaticGrams > 0
                        ? (pureMass / summary.pureAromaticGrams) * 100
                        : 0;
                    const lineCost = (comp.weightGrams || 0) * (comp.costPerGram || 0);

                    const linkedIng = ingredients.find((i) => i.id === comp.ingredientId);
                    const exceedsIfra =
                      linkedIng?.ifraLimitPercent !== undefined &&
                      pctPureTotal > linkedIng.ifraLimitPercent;

                    return (
                      <tr key={comp.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-2.5 pr-3">
                          <div className="flex flex-col gap-0.5">
                            <input
                              type="text"
                              value={comp.name}
                              onChange={(e) =>
                                handleUpdateComponent(comp.id, { name: e.target.value })
                              }
                              className="w-full bg-transparent font-medium text-[#181917] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)] rounded px-1 -mx-1"
                            />
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B6D68]">
                              {linkedIng && (
                                <span>{getIngredientStatusLabel(linkedIng.status, language)}</span>
                              )}
                              {linkedIng?.bottleLabel && (
                                <span className="font-mono font-medium text-[var(--theme-accent)]">
                                  ·{' '}
                                  {language === 'ru'
                                    ? `На бутылке: «${linkedIng.bottleLabel}»`
                                    : `Bottle: "${linkedIng.bottleLabel}"`}
                                </span>
                              )}
                              {comp.note && <span>· {comp.note}</span>}
                              {exceedsIfra && (
                                <span className="inline-flex items-center gap-1 font-medium text-[#B91C1C]">
                                  <AlertTriangle className="h-3 w-3" />
                                  {t.exceedsIfra(linkedIng?.ifraLimitPercent)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={comp.tier}
                            onChange={(e) =>
                              handleUpdateComponent(comp.id, { tier: e.target.value as NoteTier })
                            }
                            className="rounded border border-[#E4E4E0] bg-white px-2 py-1 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                          >
                            {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((tierKey) => (
                              <option key={tierKey} value={tierKey}>
                                {getNoteTierShort(tierKey, language)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <select
                            value={comp.family}
                            onChange={(e) =>
                              handleUpdateComponent(comp.id, {
                                family: e.target.value as OlfactoryFamilyKey,
                              })
                            }
                            className="rounded border border-[#E4E4E0] bg-white px-2 py-1 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                          >
                            {OLFACTORY_FAMILIES.map((f) => (
                              <option key={f.key} value={f.key}>
                                {getOlfactoryFamilyShort(f.key, language)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            min={0.01}
                            max={100}
                            step="0.5"
                            value={comp.dilutionPercent}
                            onChange={(e) =>
                              handleUpdateComponent(comp.id, {
                                dilutionPercent: Math.min(
                                  100,
                                  Math.max(0.01, Number(e.target.value) || 0)
                                ),
                              })
                            }
                            className="w-16 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
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
                            className="w-20 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-right font-mono text-xs font-medium tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {comp.tier === 'solvent' ? '—' : formatGrams(pureMass, 3, language)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs tabular-nums text-[#181917]">
                          {formatPercent(pctFormula, 1)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs tabular-nums text-[var(--theme-accent)]">
                          {comp.tier === 'solvent' ? '—' : formatPercent(pctConcentrate, 1)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {formatCurrencyDecimal(lineCost, language, currency)}
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteComponent(comp.id)}
                            className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                            aria-label={t.deleteComponentAria(comp.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {project.components.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-sm text-[#787A74]">
                        {t.emptyFormula}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Component Form */}
            <form
              onSubmit={handleAddComponent}
              className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs font-semibold text-[#181917]">
                  {t.addComponentTitle}
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                  <input
                    type="text"
                    value={formulaPickerSearch}
                    onChange={(e) => setFormulaPickerSearch(e.target.value)}
                    placeholder={
                      language === 'ru'
                        ? 'Поиск в ингредиентах и библиотеке (1300+ эссенций)...'
                        : 'Search studio ingredients & library...'
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white py-1.5 pl-8 pr-2.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
              </div>

              {formulaPickerSearch.trim().length > 0 && (
                <div className="max-h-44 overflow-y-auto divide-y divide-[#EAEAE6] rounded-lg border border-[#E4E4E0] bg-white">
                  {ingredients
                    .filter((ing) => {
                      const q = formulaPickerSearch.trim().toLowerCase();
                      return (
                        ing.name.toLowerCase().includes(q) ||
                        (ing.bottleLabel || '').toLowerCase().includes(q) ||
                        (ing.inciOrCas || '').toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 12)
                    .map((ing) => (
                      <button
                        key={`ing-pick-${ing.id}`}
                        type="button"
                        onClick={() => {
                          handleSelectIngredientForFormula(ing.id);
                          setFormulaPickerSearch('');
                        }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1]"
                      >
                        <span className="font-medium text-[#181917] truncate">
                          {ing.name}
                          {ing.bottleLabel ? (
                            <span className="ml-1.5 font-mono text-[11px] text-[var(--theme-accent)]">
                              [{ing.bottleLabel}]
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-[11px] text-[#6B6D68]">
                          {getIngredientStatusLabel(ing.status, language)} · {ing.dilutionPercent}%
                        </span>
                      </button>
                    ))}
                  {library
                    .filter((libItem) => {
                      const q = formulaPickerSearch.trim().toLowerCase();
                      if (
                        ingredients.some(
                          (ing) => ing.name.trim().toLowerCase() === libItem.name.trim().toLowerCase()
                        )
                      ) {
                        return false;
                      }
                      return (
                        libItem.name.toLowerCase().includes(q) ||
                        (libItem.inciOrCas || '').toLowerCase().includes(q) ||
                        libItem.scentDescription.toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 15)
                    .map((libItem) => (
                      <button
                        key={`lib-pick-${libItem.id}`}
                        type="button"
                        onClick={() => {
                          handleSelectIngredientForFormula(`lib:${libItem.id}`);
                          setFormulaPickerSearch('');
                        }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1]"
                      >
                        <span className="font-medium text-[#181917] truncate">
                          {libItem.name}
                          {libItem.inciOrCas ? (
                            <span className="ml-1.5 font-mono text-[11px] text-[#6B6D68]">
                              ({libItem.inciOrCas})
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-[11px] text-[var(--theme-accent)]">
                          {language === 'ru' ? 'Библиотека' : 'Library'} ·{' '}
                          {getNoteTierShort(libItem.tier, language)}
                        </span>
                      </button>
                    ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <div className="lg:col-span-2">
                  <select
                    value={selectedIngredientId}
                    onChange={(e) => handleSelectIngredientForFormula(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                    aria-label={t.chooseFromCatalogAria}
                  >
                    <option value="">
                      {t.chooseFromCatalogOption}
                    </option>
                    {ingredients
                      .filter((ing) => {
                        const q = formulaPickerSearch.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          ing.name.toLowerCase().includes(q) ||
                          (ing.bottleLabel || '').toLowerCase().includes(q) ||
                          (ing.inciOrCas || '').toLowerCase().includes(q)
                        );
                      })
                      .map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name}
                          {ing.bottleLabel ? ` [${ing.bottleLabel}]` : ''} (
                          {getIngredientStatusLabel(ing.status, language)} · {ing.dilutionPercent}%)
                        </option>
                      ))}
                    {library
                      .filter((libItem) => {
                        if (
                          ingredients.some(
                            (ing) =>
                              ing.name.trim().toLowerCase() === libItem.name.trim().toLowerCase()
                          )
                        ) {
                          return false;
                        }
                        const q = formulaPickerSearch.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          libItem.name.toLowerCase().includes(q) ||
                          (libItem.inciOrCas || '').toLowerCase().includes(q) ||
                          libItem.scentDescription.toLowerCase().includes(q)
                        );
                      })
                      .slice(0, 80)
                      .map((libItem) => (
                        <option key={`lib-${libItem.id}`} value={`lib:${libItem.id}`}>
                          [{language === 'ru' ? 'Библиотека' : 'Library'}] {libItem.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <input
                    id="formula-add-component-input"
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder={t.manualNamePlaceholder}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>

                <select
                  value={compTier}
                  onChange={(e) => setCompTier(e.target.value as NoteTier)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((tierKey) => (
                    <option key={tierKey} value={tierKey}>
                      {getNoteTierLabel(tierKey, language)}
                    </option>
                  ))}
                </select>

                <select
                  value={compFamily}
                  onChange={(e) => setCompFamily(e.target.value as OlfactoryFamilyKey)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  {OLFACTORY_FAMILIES.map((f) => (
                    <option key={f.key} value={f.key}>
                      {getOlfactoryFamilyLabel(f.key, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 items-end">
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.massGLabel(formatUnit('г', language))}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={compWeight}
                    onChange={(e) => setCompWeight(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.dilutionPctLabel}
                  </label>
                  <input
                    type="number"
                    min={0.01}
                    max={100}
                    step="0.1"
                    value={compDilution}
                    onChange={(e) => setCompDilution(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.pricePerGramLabel(formatUnit('г', language), currencySymbol)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={compCostPerGram}
                    onChange={(e) => setCompCostPerGram(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.noteLabel}
                  </label>
                  <input
                    type="text"
                    value={compNote}
                    onChange={(e) => setCompNote(e.target.value)}
                    placeholder={t.roleInFormulaPlaceholder}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.addBtn}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Olfactory Profile & Note Distribution Radar */}
          <FormulaOlfactoryProfileRadar
            components={project.components}
            targetConcentration={project.targetConcentration}
            language={language}
            onAddFirstComponent={() => {
              const el = document.getElementById('formula-add-component-input');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              if (el instanceof HTMLInputElement) {
                el.focus();
              }
            }}
          />

          {/* Solvent & Concentration Dilution Calculator */}
          <SolventDilutionCalculator
            projects={allProjects}
            ingredients={ingredients}
            language={language}
            lockedProjectId={project.id}
            onUpdateProject={onUpdateProject}
          />
        </div>
      )}

      {/* TAB 1.5: PROJECT INGREDIENTS (ONLY FOR CURRENT ACTIVE PROJECT & VARIANTS) */}
      {activeTab === 'ingredients' && (() => {
        const currentVariant = selectedVariantId
          ? (project.variants || []).find((v) => v.id === selectedVariantId)
          : null;
        const activeComponents = currentVariant ? currentVariant.components : project.components;
        const activeSummary = calculateFormulaSummary(activeComponents);

        const q = projIngSearch.trim().toLowerCase();
        const displayComponents = activeComponents.filter((comp) => {
          if (projIngTierFilter !== 'all' && comp.tier !== projIngTierFilter) return false;
          if (!q) return true;
          const matched = ingredients.find(
            (i) =>
              (comp.ingredientId && i.id === comp.ingredientId) ||
              i.name.trim().toLowerCase() === comp.name.trim().toLowerCase()
          );
          return (
            comp.name.toLowerCase().includes(q) ||
            (comp.note || '').toLowerCase().includes(q) ||
            (matched?.bottleLabel || '').toLowerCase().includes(q) ||
            (matched?.inciOrCas || '').toLowerCase().includes(q)
          );
        });

        const projectStockStats = activeComponents.map((comp) => {
          const matched = ingredients.find(
            (i) =>
              (comp.ingredientId && i.id === comp.ingredientId) ||
              i.name.trim().toLowerCase() === comp.name.trim().toLowerCase()
          );
          const stock = matched ? getIngredientStockGrams(matched) : null;
          const isLow = stock !== null && stock <= 15;
          const isWishlist = matched?.status === 'wishlist';
          return { comp, matched, stock, isLow, isWishlist };
        });

        const lowStockCount = projectStockStats.filter((s) => s.isLow).length;
        const wishlistCount = projectStockStats.filter((s) => s.isWishlist).length;

        return (
          <div className="space-y-6">
            {/* Header with Title & Variants Switcher */}
            <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-[#EDEBE9] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[var(--theme-accent-soft)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--theme-accent)]">
                      {project.code}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-[#181917]">
                      {tr(language, {
                        ru: `Ингредиенты проекта: ${project.title || 'Без названия'}`,
                        en: `Project Ingredients: ${project.title || 'Untitled'}`,
                        it: `Ingredienti del Progetto: ${project.title || 'Senza titolo'}`,
                        es: `Ingredientes del Proyecto: ${project.title || 'Sin título'}`,
                        de: `Projekt-Rohstoffe: ${project.title || 'Ohne Titel'}`,
                      })}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-[#575955]">
                    {tr(language, {
                      ru: 'Спецификация сырья только для данного проекта: подписи на флаконах, расход массы, концентрация и фактические остатки в мастерской.',
                      en: 'Ingredient specifications strictly for this project: bottle signatures, usage weight, pure concentration, and workshop stock levels.',
                      it: 'Specifiche delle materie prime solo per questo проект: firme sui flaconi, consumo, concentrazione e scorte in laboratorio.',
                      es: 'Especificación de materias primas solo para este proyecto: firmas en frascos, consumo, concentración y stock en taller.',
                      de: 'Rohstoffspezifikation nur für dieses Projekt: Flaschensignaturen, Verbrauch, Konzentration und Atelierbestand.',
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onChangeTab('formula')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] px-3.5 py-2 text-xs font-medium text-[#181917] hover:bg-white hover:border-[var(--theme-accent)] shrink-0 transition-colors"
                >
                  <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>
                    {tr(language, {
                      ru: 'Перейти к формуле',
                      en: 'Open in Formula',
                      it: 'Apri nella Formula',
                      es: 'Abrir en la Fórmula',
                      de: 'In Formel bearbeiten',
                    })}
                  </span>
                </button>
              </div>

              {/* Variants / Branches Switcher (if variants exist) */}
              {(project.variants || []).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-[#575955] flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    <span>
                      {tr(language, {
                        ru: 'Варианты формулы:',
                        en: 'Formula variants:',
                        it: 'Varianti della formula:',
                        es: 'Variantes de fórmula:',
                        de: 'Formel-Varianten:',
                      })}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedVariantId(null)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedVariantId === null
                        ? 'bg-[var(--theme-accent)] text-white shadow-xs'
                        : 'border border-[#E4E4E0] bg-[#FAF9F8] text-[#575955] hover:bg-white'
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedVariantId === v.id
                          ? 'bg-[var(--theme-accent)] text-white shadow-xs'
                          : 'border border-[#E4E4E0] bg-[#FAF9F8] text-[#575955] hover:bg-white'
                      }`}
                    >
                      {v.name} ({v.components.length})
                    </button>
                  ))}
                </div>
              )}

              {/* Key Metrics Grid for Project Ingredients */}
              <div id="project-ingredients-metrics" className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#797775]">
                    {tr(language, { ru: 'Компонентов', en: 'Components', it: 'Componenti', es: 'Componentes', de: 'Komponenten' })}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#181917] tabular-nums">
                    {activeComponents.length}
                  </div>
                  <div className="text-xs text-[#575955]">
                    {activeComponents.filter((c) => c.tier !== 'solvent').length}{' '}
                    {tr(language, { ru: 'ароматич.', en: 'aromatic', it: 'aromatici', es: 'aromáticos', de: 'aromatisch' })}
                  </div>
                </div>

                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#797775]">
                    {tr(language, { ru: 'Чистая эссенция', en: 'Pure Essence', it: 'Essenza pura', es: 'Esencia pura', de: 'Reine Essenz' })}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#181917] tabular-nums">
                    {formatGrams(activeSummary.pureAromaticGrams, 2, language)}
                  </div>
                  <div className="text-xs text-[#575955]">
                    {formatPercent(activeSummary.pureConcentrationPercent, 1)}{' '}
                    {tr(language, { ru: 'концентрация', en: 'concentration', it: 'concentrazione', es: 'concentración', de: 'Konzentration' })}
                  </div>
                </div>

                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#797775]">
                    {tr(language, { ru: 'Общая масса', en: 'Total Weight', it: 'Peso totale', es: 'Masa total', de: 'Gesamtmasse' })}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#181917] tabular-nums">
                    {formatGrams(activeSummary.totalWeightGrams, 2, language)}
                  </div>
                  <div className="text-xs text-[#575955]">
                    {tr(language, { ru: 'флакон', en: 'bottle', it: 'flacone', es: 'frasco', de: 'Flakon' })}: {project.targetBottleMl} мл
                  </div>
                </div>

                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#797775]">
                    {tr(language, { ru: 'Наличие сырья', en: 'Stock Status', it: 'Stato scorte', es: 'Estado stock', de: 'Lagerstatus' })}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[#181917] tabular-nums">
                    {activeComponents.length - lowStockCount - wishlistCount} / {activeComponents.length}
                  </div>
                  <div className="text-xs text-[#575955]">
                    {lowStockCount > 0 ? (
                      <span className="text-amber-600 font-medium">
                        {lowStockCount} {tr(language, { ru: 'заканчивается', en: 'running low', it: 'in esaurimento', es: 'agotándose', de: 'wird knapp' })}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">
                        {tr(language, { ru: 'все в норме', en: 'all in stock', it: 'tutte disponibili', es: 'todo en orden', de: 'alles vorrätig' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Project Ingredients Table */}
            <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDEBE9] pb-4">
                <div className="relative w-full sm:w-80">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#797775]" />
                  <input
                    type="text"
                    value={projIngSearch}
                    onChange={(e) => setProjIngSearch(e.target.value)}
                    placeholder={tr(language, {
                      ru: 'Поиск по компонентам и подписям...',
                      en: 'Search components and bottle labels...',
                      it: 'Cerca per componenti ed etichette...',
                      es: 'Buscar componentes y firmas...',
                      de: 'Nach Komponenten & Etiketten suchen...',
                    })}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] py-2 pl-9 pr-3 text-xs text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-xs text-[#575955] mr-1">
                    {tr(language, { ru: 'Ярус:', en: 'Tier:', it: 'Nota:', es: 'Nota:', de: 'Note:' })}
                  </span>
                  {(['all', 'top', 'heart', 'base', 'solvent'] as const).map((tierKey) => (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setProjIngTierFilter(tierKey)}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                        projIngTierFilter === tierKey
                          ? 'bg-[var(--theme-accent)] text-white'
                          : 'bg-[#FAF9F8] border border-[#E4E4E0] text-[#575955] hover:bg-white'
                      }`}
                    >
                      {tierKey === 'all'
                        ? tr(language, { ru: 'Все', en: 'All', it: 'Tutti', es: 'Todos', de: 'Alle' })
                        : getNoteTierLabel(tierKey, language)}
                    </button>
                  ))}
                </div>
              </div>

              {displayComponents.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#797775]">
                  {activeComponents.length === 0
                    ? tr(language, {
                        ru: 'В этой формуле пока нет компонентов. Добавьте их во вкладке «Формула».',
                        en: 'No components in this formula yet. Add them in the Formula tab.',
                        it: 'Nessun componente in questa formula. Aggiungili nella scheda Formula.',
                        es: 'Aún no hay componentes en esta fórmula. Añádelos en la pestaña Fórmula.',
                        de: 'Noch keine Komponenten in dieser Formel vorhanden.',
                      })
                    : tr(language, {
                        ru: 'Ничего не найдено по фильтрам.',
                        en: 'No matching components.',
                        it: 'Nessun componente corrispondente.',
                        es: 'No hay componentes coincidentes.',
                        de: 'Keine passenden Komponenten.',
                      })}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[#EDEBE9]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#FAF9F8] border-b border-[#EDEBE9] text-[11px] font-semibold uppercase tracking-wider text-[#605E5C]">
                      <tr>
                        <th className="py-2.5 px-3">
                          {tr(language, { ru: 'Компонент', en: 'Component', it: 'Componente', es: 'Componente', de: 'Rohstoff' })}
                        </th>
                        <th className="py-2.5 px-3 min-w-[200px]">
                          {tr(language, { ru: 'Как подписано на бутылке', en: 'Bottle Label / Signature', it: 'Etichetta flacone', es: 'Firma en frasco', de: 'Flaschenbeschriftung' })}
                        </th>
                        <th className="py-2.5 px-3">
                          {tr(language, { ru: 'Ярус · Семейство', en: 'Tier · Family', it: 'Nota · Famiglia', es: 'Nota · Familia', de: 'Note · Familie' })}
                        </th>
                        <th className="py-2.5 px-3 text-right">
                          {tr(language, { ru: 'Разведение', en: 'Dilution', it: 'Diluizione', es: 'Dilución', de: 'Verdünnung' })}
                        </th>
                        <th className="py-2.5 px-3 text-right">
                          {tr(language, { ru: 'В проекте', en: 'In Formula', it: 'Nella formula', es: 'En fórmula', de: 'In Formel' })}
                        </th>
                        <th className="py-2.5 px-3 text-right">
                          {tr(language, { ru: 'Запас на складе', en: 'Stock Remaining', it: 'Scorta residua', es: 'Stock restante', de: 'Lagerbestand' })}
                        </th>
                        <th className="py-2.5 px-3 text-right">
                          {tr(language, { ru: 'Стоимость', en: 'Cost', it: 'Costo', es: 'Coste', de: 'Kosten' })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEBE9]">
                      {displayComponents.map((comp) => {
                        const matched = ingredients.find(
                          (i) =>
                            (comp.ingredientId && i.id === comp.ingredientId) ||
                            i.name.trim().toLowerCase() === comp.name.trim().toLowerCase()
                        );
                        const stockVal = matched ? getIngredientStockGrams(matched) : null;
                        const isLow = stockVal !== null && stockVal <= 15;
                        const isWishlist = matched?.status === 'wishlist';
                        const pctFormula =
                          activeSummary.totalWeightGrams > 0
                            ? (comp.weightGrams / activeSummary.totalWeightGrams) * 100
                            : 0;
                        const compCost = comp.weightGrams * (comp.costPerGram || 0);

                        return (
                          <tr key={comp.id} className="hover:bg-[#FAF9F8] transition-colors">
                            {/* Component Name & Note */}
                            <td className="py-2.5 px-3 min-w-[160px]">
                              <div className="font-semibold text-[#181917]">{comp.name}</div>
                              {comp.note && (
                                <div className="text-[11px] text-[#605E5C] line-clamp-1">
                                  {comp.note}
                                </div>
                              )}
                              {matched?.inciOrCas && (
                                <div className="font-mono text-[10px] text-[#797775]">
                                  {matched.inciOrCas}
                                </div>
                              )}
                            </td>

                            {/* Inline Editable Bottle Label */}
                            <td className="py-2.5 px-3 min-w-[220px]">
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
                                        es: 'Firma en el frasco...',
                                        de: 'Flaschenbeschriftung...',
                                      })
                                    : tr(language, {
                                        ru: 'Не привязан к базе',
                                        en: 'Not linked to catalog',
                                        it: 'Non collegato al catalogo',
                                        es: 'No vinculado',
                                        de: 'Nicht verknüpft',
                                      })
                                }
                                className="w-full rounded border border-[#E1DFDD] bg-white px-2.5 py-1 text-xs text-[#181917] placeholder:text-[#8A8886] focus:border-[var(--theme-accent)] focus:outline-none disabled:bg-[#F3F2F1] disabled:text-[#8A8886]"
                              />
                            </td>

                            {/* Tier & Family */}
                            <td className="py-2.5 px-3 text-[#575955] whitespace-nowrap">
                              <span className="font-medium text-[#181917]">
                                {getNoteTierShort(comp.tier, language)}
                              </span>{' '}
                              · {getOlfactoryFamilyShort(comp.family, language)}
                            </td>

                            {/* Dilution */}
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#181917]">
                              {comp.dilutionPercent}%
                            </td>

                            {/* Weight in Project & % */}
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                              <div className="font-semibold text-[#181917]">
                                {comp.weightGrams} г
                              </div>
                              <div className="text-[10px] text-[#797775]">
                                {formatPercent(pctFormula, 1)}
                              </div>
                            </td>

                            {/* Stock in Workshop */}
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                              {matched ? (
                                isWishlist ? (
                                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                                    {getIngredientStatusLabel('wishlist', language)}
                                  </span>
                                ) : isLow ? (
                                  <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-semibold inline-flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>{stockVal} {formatUnit(matched.unit, language)}</span>
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-medium">
                                    {stockVal} {formatUnit(matched.unit, language)}
                                  </span>
                                )
                              ) : (
                                <span className="text-[#8A8886] text-[10px]">
                                  {tr(language, { ru: 'ручной ввод', en: 'manual', it: 'manuale', es: 'manual', de: 'manuell' })}
                                </span>
                              )}
                            </td>

                            {/* Formula Cost */}
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#181917] whitespace-nowrap">
                              {formatCurrencyRub(compCost, language, currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        );
      })()}

      {/* TAB 2: OLFACTORY MAP */}
      {activeTab === 'olfactory' && (
        <OlfactoryMapBuilder
          project={project}
          allProjects={allProjects}
          onSwitchProject={onSwitchProject}
          ingredients={ingredients}
          library={library}
          onUpdateMap={(nextMap) => patchProject({ olfactoryMap: nextMap })}
          language={language}
        />
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
                    const plannedSum = item.requiredQuantity * item.estimatedUnitPrice;
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
                          {formatCurrencyDecimal(item.estimatedUnitPrice, language, currency)}
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
                  {ingredients
                    .filter((i) => {
                      const q = estPickerSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        i.name.toLowerCase().includes(q) ||
                        (i.bottleLabel || '').toLowerCase().includes(q) ||
                        (i.inciOrCas || '').toLowerCase().includes(q)
                      );
                    })
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  {library
                    .filter((l) => {
                      if (
                        ingredients.some(
                          (ing) => ing.name.trim().toLowerCase() === l.name.trim().toLowerCase()
                        )
                      ) {
                        return false;
                      }
                      const q = estPickerSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        l.name.toLowerCase().includes(q) ||
                        (l.inciOrCas || '').toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 60)
                    .map((l) => (
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

      {activeTab === 'dilution' && (
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
      )}
    </div>
  );
}
