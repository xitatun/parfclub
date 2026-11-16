import {
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ClipboardCopy,
  ClipboardPaste,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  ListPlus,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Store,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  DEFAULT_VIEW_SETTINGS,
  FAMILY_HEX_MAP,
  formatUnit,
  getCurrencySymbol,
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getOlfactoryFamilyLabel,
  getSillageLabel,
  OLFACTORY_FAMILIES,
  STARTER_INGREDIENT_TAGS,
} from '../data/constants';
import { tr } from '../data/i18n';
import { resolveIfraStandard } from '../data/ifraStandards';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  IngredientFilters,
  IngredientOrigin,
  IngredientStatus,
  LibraryIngredient,
  MeasurementUnit,
  NoteTier,
  OlfactoryFamilyKey,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
  SillageLevel,
  ViewSettings,
} from '../types/perfume';
import {
  formatCurrencyDecimal,
  formatCurrencyRub,
  isIngredientRunningLow,
} from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';

interface IngredientsCatalogProps {
  ingredients: Ingredient[];
  filteredIngredients: Ingredient[];
  library?: LibraryIngredient[];
  projects: PerfumeProject[];
  purchases?: PurchaseRecord[];
  priceFluctuationThreshold?: number;
  onChangePriceFluctuationThreshold?: (pct: number) => void;
  viewSettings?: ViewSettings;
  language?: AppLanguage;
  currency?: AppCurrency;
  filters: IngredientFilters;
  onChangeFilters: (patch: Partial<IngredientFilters>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  statusCounts: {
    all: number;
    in_stock: number;
    wishlist: number;
    ordered: number;
  };
  filterPaneOpen: boolean;
  onToggleFilterPane: () => void;
  onAddIngredient: (ing: Ingredient) => void;
  onUpdateIngredient: (ing: Ingredient) => void;
  onDeleteIngredient: (id: string) => void;
  onAddPurchaseRecord: (record: PurchaseRecord) => void;
  onAddEstimateItem: (item: ProjectEstimateItem) => void;
  estimates?: ProjectEstimateItem[];
  availableTags?: string[];
  tagCounts?: Record<string, number>;
  onCreateTag?: (tag: string) => void;
  onDeleteTag?: (tag: string) => void;
  criticalStockGrams?: number;
  onChangeCriticalStockGrams?: (grams: number) => void;
}

const STATUS_TAB_KEYS: ('all' | IngredientStatus)[] = ['all', 'in_stock', 'wishlist', 'ordered'];

const EMPTY_FORM: Omit<Ingredient, 'id' | 'createdAt'> = {
  name: '',
  inciOrCas: '',
  family: 'woody',
  tier: 'heart',
  origin: 'natural',
  status: 'wishlist',
  dilutionPercent: 100,
  solventNote: '',
  unit: 'г',
  quantityGrams: 10,
  remainingGrams: undefined,
  priceTotal: 0,
  longevityLabel: '',
  sillage: 'moderate',
  ifraLimitPercent: undefined,
  supplier: '',
  purchaseUrl: '',
  purchaseDate: '',
  storageLocation: '',
  bottleLabel: '',
  olfactoryNotes: '',
  tags: [],
};

interface IngredientsCatalogText {
  gUnit: string;
  defaultSolventNote: string;
  defaultLongevityLabel: string;
  supplierNotSet: string;
  movedFromWishlistNote: string;
  storePrefix: string;
  copyManualHint: string;
  clipboardEmptyHint: string;
  clipboardBlockedHint: string;
  pasteFieldHint: string;
  title: string;
  subtitle: string;
  exportExcelTitle: string;
  exportExcelAria: string;
  exportExcelBtn: string;
  addToWishlistBtn: string;
  addToStockBtn: string;
  allTab: string;
  filtersTitle: string;
  filtersBtn: string;
  resetBtn: string;
  wishlistLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptySubtitle: string;
  resetAllFiltersBtn: string;
  colIngredient: string;
  colFamilyTier: string;
  colLongevitySillage: string;
  colMaxPct: string;
  colUnitPrice: string;
  colStorePurchased: string;
  colStorage: string;
  colStatus: string;
  colActions: string;
  dilShort: string;
  leftShort: string;
  belowGrams: (g: number) => string;
  sillagePrefix: string;
  packShort: string;
  storeNotSet: string;
  notPurchased: string;
  boughtTitle: string;
  boughtBtn: string;
  addToEstimateTitle: string;
  addToEstimateAria: (name: string) => string;
  editTitle: string;
  editAria: (name: string) => string;
  deleteTitle: string;
  deleteAria: (name: string) => string;
  scentProfileLabel: string;
  noDescriptionYet: string;
  storeColon: string;
  storeNamePlaceholder: string;
  storeForAria: (name: string) => string;
  urlColon: string;
  urlPlaceholder: string;
  urlForAria: (name: string) => string;
  pasteUrlTitle: string;
  pasteBtn: string;
  copyUrlTitle: string;
  copiedBtn: string;
  copyBtn: string;
  estModalTitle: string;
  estModalIngLabel: string;
  estModalProjectLabel: string;
  estModalReqQty: (unit: string) => string;
  cancelBtn: string;
  addToEstSubmit: string;
  editIngTitle: string;
  newIngTitle: string;
  closeFormAria: string;
  ingNameLabel: string;
  ingNamePlaceholder: string;
  statusLabel: string;
  familyLabel: string;
  tierLabel: string;
  originLabel: string;
  longevityLabel: string;
  longevityPlaceholder: string;
  sillageLabel: string;
  packSizeLabel: string;
  unitLabel: string;
  packPriceLabel: (sym: string) => string;
  dilutionPctLabel: string;
  remainingLabel: (unit: string) => string;
  maxIfraLabel: string;
  ifraPlaceholder: string;
  supplierFieldLabel: string;
  supplierPlaceholder: string;
  lastPurchaseDateLabel: string;
  purchaseUrlLabel: string;
  storageLocationLabel: string;
  storagePlaceholder: string;
  scentNotesLabel: string;
  scentNotesPlaceholder: string;
  saveChangesBtn: string;
  addIngBtn: string;
  priceMonitorTitle: string;
  priceMonitorHikes: (count: number) => string;
  priceMonitorDrops: (count: number) => string;
  priceThresholdLabel: string;
  filterPriceAlertsBtn: (count: number) => string;
  showAllItemsBtn: string;
  priceUpAlert: (pct: string) => string;
  priceDownAlert: (pct: string) => string;
  prevPriceShort: string;
  priceAlertBannerUp: (pct: string, prev: string, curr: string, meta: string) => string;
  priceAlertBannerDown: (pct: string, prev: string, curr: string, meta: string) => string;
  priceHistoryBtn: (count: number) => string;
  priceHistoryColDate: string;
  priceHistoryColStore: string;
  priceHistoryColQty: string;
  priceHistoryColUnitPrice: string;
  priceHistoryColTotal: string;
  priceHistoryDirectEditNote: string;
  priceHistoryCatalogNow: string;
  tagsBarTitle: string;
  tagsAllBtn: string;
  newTagPlaceholder: string;
  createTagBtn: string;
  manageTagsBtn: string;
  doneManageTagsBtn: string;
  deleteTagAria: (tag: string) => string;
  tagMatchAny: string;
  tagMatchAll: string;
  cardTagsBtn: string;
  cardTagInputPlaceholder: string;
  cardTagAssignLabel: string;
  modalTagsLabel: string;
  modalTagAddBtn: string;
  modalTagPlaceholder: string;
  starterSuggestionsLabel: string;
  criticalMonitorTitle: string;
  criticalMonitorCount: (count: number) => string;
  criticalMonitorAllOk: (grams: number) => string;
  criticalThresholdLabel: string;
  filterCriticalBtn: (count: number) => string;
  showAllStockBtn: string;
  detailsBtn: string;
  hideDetailsBtn: string;
  expandAllBtn: string;
  collapseAllBtn: string;
  colStockVolume: string;
  runningLowBadge: string;
  bottleLabelInputLabel: string;
  bottleLabelPlaceholder: string;
  openUrlTitle: string;
}

const ING_CATALOG_TEXT: Record<AppLanguage, IngredientsCatalogText> = {
  ru: {
    gUnit: 'г',
    defaultSolventNote: 'Чистый 100%',
    defaultLongevityLabel: '4–8 ч (средняя)',
    supplierNotSet: 'Не указан',
    movedFromWishlistNote: 'Переведено из списка покупок в наличие',
    storePrefix: 'Магазин',
    copyManualHint: 'Скопируйте ссылку вручную из поля ввода.',
    clipboardEmptyHint: 'Буфер обмена пуст — вставьте ссылку через Ctrl+V в поле.',
    clipboardBlockedHint: 'Браузер ограничил доступ к буферу — вставьте ссылку через Ctrl+V прямо в поле.',
    pasteFieldHint: 'Вставьте ссылку в поле с помощью Ctrl+V.',
    title: 'База ингредиентов',
    subtitle: 'Учёт купленного сырья, вишлиста покупок, магазинов, ссылок, IFRA-лимитов и мест хранения.',
    exportExcelTitle: 'Скачать таблицу ингредиентов в формате Excel (.xlsx)',
    exportExcelAria: 'Экспорт в Excel (.xlsx)',
    exportExcelBtn: 'Экспорт в Excel (.xlsx)',
    addToWishlistBtn: 'В список покупок',
    addToStockBtn: 'Добавить в наличие',
    allTab: 'Все',
    filtersTitle: 'Показать или скрыть боковую панель фильтров',
    filtersBtn: 'Фильтры',
    resetBtn: 'Сбросить',
    wishlistLabel: 'Вишлист:',
    searchPlaceholder: 'Название, магазин, CAS...',
    emptyTitle: 'Ингредиенты не найдены',
    emptySubtitle: 'Попробуйте сбросить фильтры или добавьте новый материал в базу.',
    resetAllFiltersBtn: 'Сбросить все фильтры',
    colIngredient: 'Ингредиент',
    colFamilyTier: 'Категория · Нота',
    colLongevitySillage: 'Стойкость · Шлейф',
    colMaxPct: 'Макс. %',
    colUnitPrice: 'Цена / ед.',
    colStorePurchased: 'Магазин · Закупка',
    colStorage: 'Хранение',
    colStatus: 'Статус',
    colActions: 'Действия',
    dilShort: 'Развед.',
    leftShort: 'ост.',
    belowGrams: (g) => ` · ниже ${g} г`,
    sillagePrefix: 'Шлейф:',
    packShort: 'уп.',
    storeNotSet: 'Магазин не указан',
    notPurchased: 'Не куплен',
    boughtTitle: 'Отметить как купленное и записать в журнал покупок',
    boughtBtn: 'Куплено',
    addToEstimateTitle: 'Добавить в смету проекта',
    addToEstimateAria: (name) => `Добавить ${name} в смету`,
    editTitle: 'Редактировать',
    editAria: (name) => `Редактировать ${name}`,
    deleteTitle: 'Удалить',
    deleteAria: (name) => `Удалить ${name}`,
    scentProfileLabel: 'Описание аромата: ',
    noDescriptionYet: 'Описание пока не добавлено.',
    storeColon: 'Магазин:',
    storeNamePlaceholder: 'Имя магазина...',
    storeForAria: (name) => `Магазин для ${name}`,
    urlColon: 'Ссылка:',
    urlPlaceholder: 'Вставьте URL товара (Ctrl+V)...',
    urlForAria: (name) => `Ссылка на покупку ${name}`,
    pasteUrlTitle: 'Вставить ссылку из буфера обмена',
    pasteBtn: 'Вставить',
    copyUrlTitle: 'Скопировать ссылку в буфер обмена',
    copiedBtn: 'Скопировано',
    copyBtn: 'Копировать',
    estModalTitle: 'Добавить в смету проекта',
    estModalIngLabel: 'Ингредиент:',
    estModalProjectLabel: 'Проект',
    estModalReqQty: (unit) => `Требуемое количество (${unit})`,
    cancelBtn: 'Отмена',
    addToEstSubmit: 'Добавить в смету',
    editIngTitle: 'Редактировать ингредиент',
    newIngTitle: 'Новый ингредиент',
    closeFormAria: 'Закрыть форму',
    ingNameLabel: 'Название ингредиента *',
    ingNamePlaceholder: 'Напр.: Ветивер Гаити ЭМ',
    statusLabel: 'Статус',
    familyLabel: 'Категория аромата',
    tierLabel: 'Уровень пирамиды',
    originLabel: 'Происхождение',
    longevityLabel: 'Стойкость',
    longevityPlaceholder: 'Напр.: 12–24 ч (высокая)',
    sillageLabel: 'Шлейф',
    packSizeLabel: 'Фасовка',
    unitLabel: 'Ед. изм.',
    packPriceLabel: (sym) => `Цена уп. (${sym})`,
    dilutionPctLabel: 'Разведение (%)',
    remainingLabel: (unit) => `Остаток (${unit})`,
    maxIfraLabel: 'Макс. % (IFRA)',
    ifraPlaceholder: 'Напр.: 0.4',
    supplierFieldLabel: 'Название магазина (поставщик)',
    supplierPlaceholder: 'Напр.: AromaLab / PerfumeSupplies',
    lastPurchaseDateLabel: 'Дата последней закупки',
    purchaseUrlLabel: 'Ссылка на покупку (URL)',
    storageLocationLabel: 'Место хранения',
    storagePlaceholder: 'Напр.: Холодильник +4°C, полка 2 / Шкаф B1, тёмное стекло',
    scentNotesLabel: 'Описание аромата и личные заметки (во всю ширину)',
    scentNotesPlaceholder: 'Какие грани раскрываются на блоттере, с чем хорошо сочетается...',
    saveChangesBtn: 'Сохранить изменения',
    addIngBtn: 'Добавить ингредиент',
    priceMonitorTitle: 'Динамика закупочных цен с прошлой записи',
    priceMonitorHikes: (count) => `рост: ${count}`,
    priceMonitorDrops: (count) => `снижение: ${count}`,
    priceThresholdLabel: 'Порог:',
    filterPriceAlertsBtn: (count) => `Только с изменением цены (${count})`,
    showAllItemsBtn: 'Снять фильтр',
    priceUpAlert: (pct) => `+${pct}% к прошлой`,
    priceDownAlert: (pct) => `-${pct}% к прошлой`,
    prevPriceShort: 'было',
    priceAlertBannerUp: (pct, prev, curr, meta) =>
      `Цена закупки выросла на +${pct}% с прошлой записи (${prev} → ${curr}${meta ? ` · ${meta}` : ''}). Проверьте маржинальность формул и альтернативных поставщиков.`,
    priceAlertBannerDown: (pct, prev, curr, meta) =>
      `Цена закупки снизилась на −${pct}% с прошлой записи (${prev} → ${curr}${meta ? ` · ${meta}` : ''}) — выгоднее для себестоимости.`,
    priceHistoryBtn: (count) => `История цен (${count})`,
    priceHistoryColDate: 'Дата',
    priceHistoryColStore: 'Поставщик',
    priceHistoryColQty: 'Объём',
    priceHistoryColUnitPrice: 'Цена / ед.',
    priceHistoryColTotal: 'Сумма',
    priceHistoryDirectEditNote: 'Обновлено напрямую в карточке каталога',
    priceHistoryCatalogNow: 'Текущая цена в каталоге',
    tagsBarTitle: 'Категории и теги',
    tagsAllBtn: 'Все',
    newTagPlaceholder: 'Новая категория (напр. ретро)...',
    createTagBtn: 'Создать тег',
    manageTagsBtn: 'Удалить теги',
    doneManageTagsBtn: 'Готово',
    deleteTagAria: (tag) => `Удалить категорию «${tag}»`,
    tagMatchAny: 'Любой тег',
    tagMatchAll: 'Все теги',
    cardTagsBtn: 'Теги',
    cardTagInputPlaceholder: 'Новый тег и Enter...',
    cardTagAssignLabel: 'Назначить категории:',
    modalTagsLabel: 'Пользовательские теги / категории',
    modalTagAddBtn: 'Добавить',
    modalTagPlaceholder: 'Например: ретро, синтетика, натуральное...',
    starterSuggestionsLabel: 'Быстрые идеи:',
    criticalMonitorTitle: 'Критический запас ингредиентов',
    criticalMonitorCount: (count) => `ниже порога: ${count}`,
    criticalMonitorAllOk: (grams) => `Все ингредиенты в наличии ≥ ${grams} г`,
    criticalThresholdLabel: 'Порог:',
    filterCriticalBtn: (count) => `Показать критические (${count})`,
    showAllStockBtn: 'Показать все',
    detailsBtn: 'Дополнительно',
    hideDetailsBtn: 'Свернуть',
    expandAllBtn: 'Развернуть все',
    collapseAllBtn: 'Свернуть все',
    colStockVolume: 'Остаток и объём',
    runningLowBadge: 'Заканчивается',
    bottleLabelInputLabel: 'Подпись на бутылке:',
    bottleLabelPlaceholder: 'Как подписано на бутылке...',
    openUrlTitle: 'Открыть ссылку в новой вкладке',
  },
  en: {
    gUnit: 'g',
    defaultSolventNote: 'Pure 100%',
    defaultLongevityLabel: '4–8 h (moderate)',
    supplierNotSet: 'Not specified',
    movedFromWishlistNote: 'Moved from wishlist to stock',
    storePrefix: 'Store',
    copyManualHint: 'Copy the URL manually from the input field.',
    clipboardEmptyHint: 'Clipboard is empty — paste the URL with Ctrl+V into the field.',
    clipboardBlockedHint: 'Browser restricted clipboard access — paste the URL directly with Ctrl+V.',
    pasteFieldHint: 'Paste the URL into the field using Ctrl+V.',
    title: 'Ingredients Catalog',
    subtitle: 'Inventory of stocked materials, wishlist, stores, purchase URLs, IFRA limits, and storage spots.',
    exportExcelTitle: 'Download ingredients table in Excel (.xlsx)',
    exportExcelAria: 'Export to Excel (.xlsx)',
    exportExcelBtn: 'Export Excel (.xlsx)',
    addToWishlistBtn: 'Add to Wishlist',
    addToStockBtn: 'Add to Stock',
    allTab: 'All',
    filtersTitle: 'Show or hide the filters task pane',
    filtersBtn: 'Filters',
    resetBtn: 'Reset',
    wishlistLabel: 'Wishlist:',
    searchPlaceholder: 'Name, store, CAS...',
    emptyTitle: 'No ingredients found',
    emptySubtitle: 'Try resetting filters or add a new material to the catalog.',
    resetAllFiltersBtn: 'Reset all filters',
    colIngredient: 'Ingredient',
    colFamilyTier: 'Family · Tier',
    colLongevitySillage: 'Longevity · Sillage',
    colMaxPct: 'Max %',
    colUnitPrice: 'Unit price',
    colStorePurchased: 'Store · Purchased',
    colStorage: 'Storage',
    colStatus: 'Status',
    colActions: 'Actions',
    dilShort: 'Dil.',
    leftShort: 'left',
    belowGrams: (g) => ` · below ${g} g`,
    sillagePrefix: 'Sillage:',
    packShort: 'pack',
    storeNotSet: 'Store not set',
    notPurchased: 'Not purchased',
    boughtTitle: 'Mark as purchased and record in purchase journal',
    boughtBtn: 'Bought',
    addToEstimateTitle: 'Add to project estimate',
    addToEstimateAria: (name) => `Add ${name} to estimate`,
    editTitle: 'Edit',
    editAria: (name) => `Edit ${name}`,
    deleteTitle: 'Delete',
    deleteAria: (name) => `Delete ${name}`,
    scentProfileLabel: 'Scent profile: ',
    noDescriptionYet: 'No description added yet.',
    storeColon: 'Store:',
    storeNamePlaceholder: 'Store name...',
    storeForAria: (name) => `Store for ${name}`,
    urlColon: 'URL:',
    urlPlaceholder: 'Paste product URL (Ctrl+V)...',
    urlForAria: (name) => `Purchase URL for ${name}`,
    pasteUrlTitle: 'Paste URL from clipboard',
    pasteBtn: 'Paste',
    copyUrlTitle: 'Copy URL to clipboard',
    copiedBtn: 'Copied',
    copyBtn: 'Copy',
    estModalTitle: 'Add to Project Estimate',
    estModalIngLabel: 'Ingredient:',
    estModalProjectLabel: 'Project',
    estModalReqQty: (unit) => `Required quantity (${unit})`,
    cancelBtn: 'Cancel',
    addToEstSubmit: 'Add to Estimate',
    editIngTitle: 'Edit Ingredient',
    newIngTitle: 'New Ingredient',
    closeFormAria: 'Close form',
    ingNameLabel: 'Ingredient name *',
    ingNamePlaceholder: 'e.g., Haiti Vetiver EO',
    statusLabel: 'Status',
    familyLabel: 'Olfactory family',
    tierLabel: 'Pyramid tier',
    originLabel: 'Origin',
    longevityLabel: 'Longevity',
    longevityPlaceholder: 'e.g., 12–24 h (high)',
    sillageLabel: 'Sillage',
    packSizeLabel: 'Pack size',
    unitLabel: 'Unit',
    packPriceLabel: (sym) => `Pack price (${sym})`,
    dilutionPctLabel: 'Dilution (%)',
    remainingLabel: (unit) => `Remaining (${unit})`,
    maxIfraLabel: 'Max % (IFRA)',
    ifraPlaceholder: 'e.g., 0.4',
    supplierFieldLabel: 'Store name (supplier)',
    supplierPlaceholder: 'e.g., AromaLab / PerfumeSupplies',
    lastPurchaseDateLabel: 'Last purchase date',
    purchaseUrlLabel: 'Purchase URL',
    storageLocationLabel: 'Storage location',
    storagePlaceholder: 'e.g., Fridge +4°C, shelf 2 / Cabinet B1, amber glass',
    scentNotesLabel: 'Scent description and personal notes (full width)',
    scentNotesPlaceholder: 'How it unfolds on blotter, best pairings and accords...',
    saveChangesBtn: 'Save Changes',
    addIngBtn: 'Add Ingredient',
    priceMonitorTitle: 'Purchase price fluctuations since last entry',
    priceMonitorHikes: (count) => `up: ${count}`,
    priceMonitorDrops: (count) => `down: ${count}`,
    priceThresholdLabel: 'Threshold:',
    filterPriceAlertsBtn: (count) => `Fluctuations only (${count})`,
    showAllItemsBtn: 'Show all',
    priceUpAlert: (pct) => `+${pct}% vs last`,
    priceDownAlert: (pct) => `-${pct}% vs last`,
    prevPriceShort: 'was',
    priceAlertBannerUp: (pct, prev, curr, meta) =>
      `Purchase price surged +${pct}% since the last entry (${prev} → ${curr}${meta ? ` · ${meta}` : ''}). Review formula margins or compare suppliers.`,
    priceAlertBannerDown: (pct, prev, curr, meta) =>
      `Purchase price dropped −${pct}% since the last entry (${prev} → ${curr}${meta ? ` · ${meta}` : ''}) — improved unit cost efficiency.`,
    priceHistoryBtn: (count) => `Price history (${count})`,
    priceHistoryColDate: 'Date',
    priceHistoryColStore: 'Supplier',
    priceHistoryColQty: 'Qty',
    priceHistoryColUnitPrice: 'Unit price',
    priceHistoryColTotal: 'Total',
    priceHistoryDirectEditNote: 'Updated directly in catalog card',
    priceHistoryCatalogNow: 'Current catalog price',
    tagsBarTitle: 'Categories & Tags',
    tagsAllBtn: 'All',
    newTagPlaceholder: 'New category (e.g. retro)...',
    createTagBtn: 'Create Tag',
    manageTagsBtn: 'Manage',
    doneManageTagsBtn: 'Done',
    deleteTagAria: (tag) => `Delete tag "${tag}"`,
    tagMatchAny: 'Match any',
    tagMatchAll: 'Match all',
    cardTagsBtn: 'Tags',
    cardTagInputPlaceholder: 'New tag + Enter...',
    cardTagAssignLabel: 'Assign tags:',
    modalTagsLabel: 'Custom Categories / Tags',
    modalTagAddBtn: 'Add',
    modalTagPlaceholder: 'e.g. retro, synthetic, natural...',
    starterSuggestionsLabel: 'Quick ideas:',
    criticalMonitorTitle: 'Critical ingredient stock',
    criticalMonitorCount: (count) => `below threshold: ${count}`,
    criticalMonitorAllOk: (grams) => `All stocked ingredients ≥ ${grams} g`,
    criticalThresholdLabel: 'Threshold:',
    filterCriticalBtn: (count) => `Critical only (${count})`,
    showAllStockBtn: 'Show all',
    detailsBtn: 'Details',
    hideDetailsBtn: 'Collapse',
    expandAllBtn: 'Expand all',
    collapseAllBtn: 'Collapse all',
    colStockVolume: 'Stock & volume',
    runningLowBadge: 'Running low',
    bottleLabelInputLabel: 'Bottle label:',
    bottleLabelPlaceholder: 'How the bottle is labeled...',
    openUrlTitle: 'Open link in new tab',
  },
  it: {
    gUnit: 'g',
    defaultSolventNote: 'Puro 100%',
    defaultLongevityLabel: '4–8 h (media)',
    supplierNotSet: 'Non specificato',
    movedFromWishlistNote: 'Spostato dalla lista desideri al magazzino',
    storePrefix: 'Negozio',
    copyManualHint: 'Copia manualmente il link dal campo.',
    clipboardEmptyHint: 'Appunti vuoti — incolla il link con Ctrl+V nel campo.',
    clipboardBlockedHint: 'Il browser limita l’accesso agli appunti — incolla il link con Ctrl+V nel campo.',
    pasteFieldHint: 'Incolla il link nel campo usando Ctrl+V.',
    title: 'Catalogo ingredienti',
    subtitle: 'Inventario delle materie prime, lista desideri, fornitori, link d’acquisto, limiti IFRA e conservazione.',
    exportExcelTitle: 'Scarica la tabella ingredienti in Excel (.xlsx)',
    exportExcelAria: 'Esporta in Excel (.xlsx)',
    exportExcelBtn: 'Esporta Excel (.xlsx)',
    addToWishlistBtn: 'In lista desideri',
    addToStockBtn: 'Aggiungi a magazzino',
    allTab: 'Tutti',
    filtersTitle: 'Mostra o nascondi il pannello filtri',
    filtersBtn: 'Filtri',
    resetBtn: 'Ripristina',
    wishlistLabel: 'Lista desideri:',
    searchPlaceholder: 'Nome, negozio, CAS...',
    emptyTitle: 'Nessun ingrediente trovato',
    emptySubtitle: 'Prova a reimpostare i filtri o aggiungi una nuova materia prima.',
    resetAllFiltersBtn: 'Ripristina tutti i filtri',
    colIngredient: 'Ingrediente',
    colFamilyTier: 'Famiglia · Nota',
    colLongevitySillage: 'Persistenza · Scia',
    colMaxPct: 'Max %',
    colUnitPrice: 'Prezzo / u.',
    colStorePurchased: 'Negozio · Acquisto',
    colStorage: 'Posizione',
    colStatus: 'Stato',
    colActions: 'Azioni',
    dilShort: 'Diluiz.',
    leftShort: 'rim.',
    belowGrams: (g) => ` · sotto ${g} g`,
    sillagePrefix: 'Scia:',
    packShort: 'conf.',
    storeNotSet: 'Negozio non impostato',
    notPurchased: 'Non acquistato',
    boughtTitle: 'Segna come acquistato e registra negli acquisti',
    boughtBtn: 'Acquistato',
    addToEstimateTitle: 'Aggiungi al preventivo del progetto',
    addToEstimateAria: (name) => `Aggiungi ${name} al preventivo`,
    editTitle: 'Modifica',
    editAria: (name) => `Modifica ${name}`,
    deleteTitle: 'Elimina',
    deleteAria: (name) => `Elimina ${name}`,
    scentProfileLabel: 'Profilo olfattivo: ',
    noDescriptionYet: 'Nessuna descrizione inserita.',
    storeColon: 'Negozio:',
    storeNamePlaceholder: 'Nome negozio...',
    storeForAria: (name) => `Negozio per ${name}`,
    urlColon: 'URL:',
    urlPlaceholder: 'Incolla URL prodotto (Ctrl+V)...',
    urlForAria: (name) => `Link d’acquisto per ${name}`,
    pasteUrlTitle: 'Incolla URL dagli appunti',
    pasteBtn: 'Incolla',
    copyUrlTitle: 'Copia URL negli appunti',
    copiedBtn: 'Copiato',
    copyBtn: 'Copia',
    estModalTitle: 'Aggiungi al preventivo',
    estModalIngLabel: 'Ingrediente:',
    estModalProjectLabel: 'Progetto',
    estModalReqQty: (unit) => `Quantità richiesta (${unit})`,
    cancelBtn: 'Annulla',
    addToEstSubmit: 'Aggiungi al preventivo',
    editIngTitle: 'Modifica ingrediente',
    newIngTitle: 'Nuovo ingrediente',
    closeFormAria: 'Chiudi modulo',
    ingNameLabel: 'Nome ingrediente *',
    ingNamePlaceholder: 'es. OE Vetiver Haiti',
    statusLabel: 'Stato',
    familyLabel: 'Famiglia olfattiva',
    tierLabel: 'Livello piramide',
    originLabel: 'Origine',
    longevityLabel: 'Persistenza',
    longevityPlaceholder: 'es. 12–24 h (alta)',
    sillageLabel: 'Scia',
    packSizeLabel: 'Formato',
    unitLabel: 'Unità',
    packPriceLabel: (sym) => `Prezzo conf. (${sym})`,
    dilutionPctLabel: 'Diluizione (%)',
    remainingLabel: (unit) => `Residuo (${unit})`,
    maxIfraLabel: 'Max % (IFRA)',
    ifraPlaceholder: 'es. 0.4',
    supplierFieldLabel: 'Nome negozio (fornitore)',
    supplierPlaceholder: 'es. AromaLab / PerfumeSupplies',
    lastPurchaseDateLabel: 'Data ultimo acquisto',
    purchaseUrlLabel: 'URL di acquisto',
    storageLocationLabel: 'Luogo di conservazione',
    storagePlaceholder: 'es. Frigo +4°C, ripiano 2 / Armadio B1, vetro ambrato',
    scentNotesLabel: 'Descrizione olfattiva e appunti personali (a tutta larghezza)',
    scentNotesPlaceholder: 'Evoluzione su mouillette, migliori abbinamenti e accordi...',
    saveChangesBtn: 'Salva modifiche',
    addIngBtn: 'Aggiungi ingrediente',
    priceMonitorTitle: 'Variazioni dei prezzi d’acquisto dall’ultima voce',
    priceMonitorHikes: (count) => `rialzi: ${count}`,
    priceMonitorDrops: (count) => `ribassi: ${count}`,
    priceThresholdLabel: 'Soglia:',
    filterPriceAlertsBtn: (count) => `Solo variazioni (${count})`,
    showAllItemsBtn: 'Mostra tutti',
    priceUpAlert: (pct) => `+${pct}% prec.`,
    priceDownAlert: (pct) => `-${pct}% prec.`,
    prevPriceShort: 'era',
    priceAlertBannerUp: (pct, prev, curr, meta) =>
      `Prezzo d’acquisto aumentato del +${pct}% dall’ultima voce (${prev} → ${curr}${meta ? ` · ${meta}` : ''}). Verifica i margini o confronta i fornitori.`,
    priceAlertBannerDown: (pct, prev, curr, meta) =>
      `Prezzo d’acquisto sceso del −${pct}% dall’ultima voce (${prev} → ${curr}${meta ? ` · ${meta}` : ''}) — maggiore efficienza sul budget.`,
    priceHistoryBtn: (count) => `Storico prezzi (${count})`,
    priceHistoryColDate: 'Data',
    priceHistoryColStore: 'Fornitore',
    priceHistoryColQty: 'Quantità',
    priceHistoryColUnitPrice: 'Prezzo / u.',
    priceHistoryColTotal: 'Totale',
    priceHistoryDirectEditNote: 'Aggiornato direttamente nel catalogo',
    priceHistoryCatalogNow: 'Prezzo attuale in catalogo',
    tagsBarTitle: 'Categorie e Tag',
    tagsAllBtn: 'Tutti',
    newTagPlaceholder: 'Nuova categoria (es. retrò)...',
    createTagBtn: 'Crea Tag',
    manageTagsBtn: 'Gestisci',
    doneManageTagsBtn: 'Fatto',
    deleteTagAria: (tag) => `Elimina tag "${tag}"`,
    tagMatchAny: 'Almeno uno',
    tagMatchAll: 'Tutti',
    cardTagsBtn: 'Tag',
    cardTagInputPlaceholder: 'Nuovo tag + Invio...',
    cardTagAssignLabel: 'Assegna tag:',
    modalTagsLabel: 'Categorie / Tag personalizzati',
    modalTagAddBtn: 'Aggiungi',
    modalTagPlaceholder: 'es. retrò, sintetico, naturale...',
    starterSuggestionsLabel: 'Idee rapide:',
    criticalMonitorTitle: 'Scorta critica ingredienti',
    criticalMonitorCount: (count) => `sotto soglia: ${count}`,
    criticalMonitorAllOk: (grams) => `Tutti gli ingredienti disponibili ≥ ${grams} g`,
    criticalThresholdLabel: 'Soglia:',
    filterCriticalBtn: (count) => `Solo scorte critiche (${count})`,
    showAllStockBtn: 'Mostra tutti',
    detailsBtn: 'Dettagli',
    hideDetailsBtn: 'Comprimi',
    expandAllBtn: 'Espandi tutto',
    collapseAllBtn: 'Comprimi tutto',
    colStockVolume: 'Giacenza e volume',
    runningLowBadge: 'In esaurimento',
    bottleLabelInputLabel: 'Etichetta flacone:',
    bottleLabelPlaceholder: 'Firma sul flacone...',
    openUrlTitle: 'Apri link in una nuova scheda',
  },
  es: {
    gUnit: 'g',
    defaultSolventNote: 'Puro 100%',
    defaultLongevityLabel: '4–8 h (media)',
    supplierNotSet: 'No especificado',
    movedFromWishlistNote: 'Movido de la lista de deseos al inventario',
    storePrefix: 'Tienda',
    copyManualHint: 'Copia manualmente el enlace desde el campo.',
    clipboardEmptyHint: 'El portapapeles está vacío — pega la URL con Ctrl+V.',
    clipboardBlockedHint: 'El navegador restringió el acceso al portapapeles — pega la URL con Ctrl+V.',
    pasteFieldHint: 'Pega la URL en el campo usando Ctrl+V.',
    title: 'Catálogo de ingredientes',
    subtitle: 'Inventario de materias primas, lista de deseos, tiendas, enlaces, límites IFRA y almacenamiento.',
    exportExcelTitle: 'Descargar tabla de ingredientes en Excel (.xlsx)',
    exportExcelAria: 'Exportar a Excel (.xlsx)',
    exportExcelBtn: 'Exportar Excel (.xlsx)',
    addToWishlistBtn: 'A lista de deseos',
    addToStockBtn: 'Añadir a inventario',
    allTab: 'Todos',
    filtersTitle: 'Mostrar u ocultar el panel de filtros',
    filtersBtn: 'Filtros',
    resetBtn: 'Restablecer',
    wishlistLabel: 'Lista de deseos:',
    searchPlaceholder: 'Nombre, tienda, CAS...',
    emptyTitle: 'No se encontraron ingredientes',
    emptySubtitle: 'Prueba a restablecer los filtros o añade un nuevo material.',
    resetAllFiltersBtn: 'Restablecer todos los filtros',
    colIngredient: 'Ingrediente',
    colFamilyTier: 'Familia · Nota',
    colLongevitySillage: 'Duración · Estela',
    colMaxPct: 'Máx. %',
    colUnitPrice: 'Precio / u.',
    colStorePurchased: 'Tienda · Compra',
    colStorage: 'Ubicación',
    colStatus: 'Estado',
    colActions: 'Acciones',
    dilShort: 'Diluc.',
    leftShort: 'rest.',
    belowGrams: (g) => ` · bajo ${g} g`,
    sillagePrefix: 'Estela:',
    packShort: 'env.',
    storeNotSet: 'Tienda sin definir',
    notPurchased: 'Sin comprar',
    boughtTitle: 'Marcar como comprado y registrar en el diario de compras',
    boughtBtn: 'Comprado',
    addToEstimateTitle: 'Añadir al presupuesto del proyecto',
    addToEstimateAria: (name) => `Añadir ${name} al presupuesto`,
    editTitle: 'Editar',
    editAria: (name) => `Editar ${name}`,
    deleteTitle: 'Eliminar',
    deleteAria: (name) => `Eliminar ${name}`,
    scentProfileLabel: 'Perfil olfativo: ',
    noDescriptionYet: 'Aún no hay descripción.',
    storeColon: 'Tienda:',
    storeNamePlaceholder: 'Nombre de tienda...',
    storeForAria: (name) => `Tienda para ${name}`,
    urlColon: 'URL:',
    urlPlaceholder: 'Pega la URL del producto (Ctrl+V)...',
    urlForAria: (name) => `URL de compra para ${name}`,
    pasteUrlTitle: 'Pegar URL del portapapeles',
    pasteBtn: 'Pegar',
    copyUrlTitle: 'Copiar URL al portapapeles',
    copiedBtn: 'Copiado',
    copyBtn: 'Copiar',
    estModalTitle: 'Añadir al presupuesto',
    estModalIngLabel: 'Ingrediente:',
    estModalProjectLabel: 'Proyecto',
    estModalReqQty: (unit) => `Cantidad requerida (${unit})`,
    cancelBtn: 'Cancelar',
    addToEstSubmit: 'Añadir al presupuesto',
    editIngTitle: 'Editar ingrediente',
    newIngTitle: 'Nuevo ingrediente',
    closeFormAria: 'Cerrar formulario',
    ingNameLabel: 'Nombre del ingrediente *',
    ingNamePlaceholder: 'ej. AE Vetiver Haití',
    statusLabel: 'Estado',
    familyLabel: 'Familia olfativa',
    tierLabel: 'Nivel de pirámide',
    originLabel: 'Origen',
    longevityLabel: 'Duración',
    longevityPlaceholder: 'ej. 12–24 h (alta)',
    sillageLabel: 'Estela',
    packSizeLabel: 'Formato',
    unitLabel: 'Unidad',
    packPriceLabel: (sym) => `Precio env. (${sym})`,
    dilutionPctLabel: 'Dilución (%)',
    remainingLabel: (unit) => `Restante (${unit})`,
    maxIfraLabel: 'Máx. % (IFRA)',
    ifraPlaceholder: 'ej. 0.4',
    supplierFieldLabel: 'Nombre de tienda (proveedor)',
    supplierPlaceholder: 'ej. AromaLab / PerfumeSupplies',
    lastPurchaseDateLabel: 'Fecha de última compra',
    purchaseUrlLabel: 'URL de compra',
    storageLocationLabel: 'Lugar de almacenamiento',
    storagePlaceholder: 'ej. Nevera +4°C, estante 2 / Armario B1, vidrio ámbar',
    scentNotesLabel: 'Descripción olfativa y notas personales (ancho completo)',
    scentNotesPlaceholder: 'Cómo evoluciona en tira olfativa, mejores combinaciones...',
    saveChangesBtn: 'Guardar cambios',
    addIngBtn: 'Añadir ingrediente',
    priceMonitorTitle: 'Fluctuaciones del precio de compra desde el último registro',
    priceMonitorHikes: (count) => `subidas: ${count}`,
    priceMonitorDrops: (count) => `bajadas: ${count}`,
    priceThresholdLabel: 'Umbral:',
    filterPriceAlertsBtn: (count) => `Solo fluctuaciones (${count})`,
    showAllItemsBtn: 'Mostrar todos',
    priceUpAlert: (pct) => `+${pct}% ant.`,
    priceDownAlert: (pct) => `-${pct}% ant.`,
    prevPriceShort: 'antes',
    priceAlertBannerUp: (pct, prev, curr, meta) =>
      `El precio de compra subió un +${pct}% desde el último registro (${prev} → ${curr}${meta ? ` · ${meta}` : ''}). Revisa los márgenes o compara proveedores.`,
    priceAlertBannerDown: (pct, prev, curr, meta) =>
      `El precio de compra bajó un −${pct}% desde el último registro (${prev} → ${curr}${meta ? ` · ${meta}` : ''}) — mejora la eficiencia del presupuesto.`,
    priceHistoryBtn: (count) => `Historial de precios (${count})`,
    priceHistoryColDate: 'Fecha',
    priceHistoryColStore: 'Proveedor',
    priceHistoryColQty: 'Cant.',
    priceHistoryColUnitPrice: 'Precio / u.',
    priceHistoryColTotal: 'Total',
    priceHistoryDirectEditNote: 'Actualizado directamente en el catálogo',
    priceHistoryCatalogNow: 'Precio actual en catálogo',
    tagsBarTitle: 'Categorías y Etiquetas',
    tagsAllBtn: 'Todas',
    newTagPlaceholder: 'Nueva categoría (ej. retro)...',
    createTagBtn: 'Crear etiqueta',
    manageTagsBtn: 'Gestionar',
    doneManageTagsBtn: 'Listo',
    deleteTagAria: (tag) => `Eliminar etiqueta "${tag}"`,
    tagMatchAny: 'Cualquiera',
    tagMatchAll: 'Todas',
    cardTagsBtn: 'Etiquetas',
    cardTagInputPlaceholder: 'Nueva etiqueta + Enter...',
    cardTagAssignLabel: 'Asignar etiquetas:',
    modalTagsLabel: 'Categorías / Etiquetas personalizadas',
    modalTagAddBtn: 'Añadir',
    modalTagPlaceholder: 'ej. retro, sintético, natural...',
    starterSuggestionsLabel: 'Ideas rápidas:',
    criticalMonitorTitle: 'Stock crítico de ingredientes',
    criticalMonitorCount: (count) => `bajo umbral: ${count}`,
    criticalMonitorAllOk: (grams) => `Todos los ingredientes en stock ≥ ${grams} g`,
    criticalThresholdLabel: 'Umbral:',
    filterCriticalBtn: (count) => `Solo críticos (${count})`,
    showAllStockBtn: 'Mostrar todos',
    detailsBtn: 'Detalles',
    hideDetailsBtn: 'Plegar',
    expandAllBtn: 'Desplegar todo',
    collapseAllBtn: 'Plegar todo',
    colStockVolume: 'Stock y volumen',
    runningLowBadge: 'Agotándose',
    bottleLabelInputLabel: 'Etiqueta frasco:',
    bottleLabelPlaceholder: 'Firma en el frasco...',
    openUrlTitle: 'Abrir enlace en nueva pestaña',
  },
  de: {
    gUnit: 'g',
    defaultSolventNote: 'Rein 100%',
    defaultLongevityLabel: '4–8 Std. (mittel)',
    supplierNotSet: 'Nicht angegeben',
    movedFromWishlistNote: 'Von der Wunschliste in den Bestand übernommen',
    storePrefix: 'Shop',
    copyManualHint: 'Kopieren Sie die URL manuell aus dem Eingabefeld.',
    clipboardEmptyHint: 'Zwischenablage leer — fügen Sie die URL mit Strg+V ein.',
    clipboardBlockedHint: 'Browser blockiert die Zwischenablage — fügen Sie die URL direkt mit Strg+V ein.',
    pasteFieldHint: 'Fügen Sie die URL mit Strg+V in das Feld ein.',
    title: 'Rohstoffkatalog',
    subtitle: 'Bestand an Rohstoffen, Wunschliste, Lieferanten, Kauflinks, IFRA-Grenzwerten und Lagerorten.',
    exportExcelTitle: 'Rohstofftabelle als Excel (.xlsx) herunterladen',
    exportExcelAria: 'Nach Excel (.xlsx) exportieren',
    exportExcelBtn: 'Excel-Export (.xlsx)',
    addToWishlistBtn: 'Auf Wunschliste',
    addToStockBtn: 'Zum Bestand',
    allTab: 'Alle',
    filtersTitle: 'Filterbereich ein- oder ausblenden',
    filtersBtn: 'Filter',
    resetBtn: 'Zurücksetzen',
    wishlistLabel: 'Wunschliste:',
    searchPlaceholder: 'Name, Shop, CAS...',
    emptyTitle: 'Keine Rohstoffe gefunden',
    emptySubtitle: 'Setzen Sie die Filter zurück oder fügen Sie einen neuen Rohstoff hinzu.',
    resetAllFiltersBtn: 'Alle Filter zurücksetzen',
    colIngredient: 'Rohstoff',
    colFamilyTier: 'Familie · Ebene',
    colLongevitySillage: 'Haltbarkeit · Sillage',
    colMaxPct: 'Max %',
    colUnitPrice: 'Preis / Einh.',
    colStorePurchased: 'Shop · Kaufdatum',
    colStorage: 'Lagerort',
    colStatus: 'Status',
    colActions: 'Aktionen',
    dilShort: 'Verd.',
    leftShort: 'übrig',
    belowGrams: (g) => ` · unter ${g} g`,
    sillagePrefix: 'Sillage:',
    packShort: 'Geb.',
    storeNotSet: 'Shop nicht angegeben',
    notPurchased: 'Nicht gekauft',
    boughtTitle: 'Als gekauft markieren und im Einkaufsjournal erfassen',
    boughtBtn: 'Gekauft',
    addToEstimateTitle: 'Zum Projektbudget hinzufügen',
    addToEstimateAria: (name) => `${name} zum Budget hinzufügen`,
    editTitle: 'Bearbeiten',
    editAria: (name) => `${name} bearbeiten`,
    deleteTitle: 'Löschen',
    deleteAria: (name) => `${name} löschen`,
    scentProfileLabel: 'Duftprofil: ',
    noDescriptionYet: 'Noch keine Beschreibung hinzugefügt.',
    storeColon: 'Shop:',
    storeNamePlaceholder: 'Shopname...',
    storeForAria: (name) => `Shop für ${name}`,
    urlColon: 'URL:',
    urlPlaceholder: 'Produkt-URL einfügen (Strg+V)...',
    urlForAria: (name) => `Kauf-URL für ${name}`,
    pasteUrlTitle: 'URL aus Zwischenablage einfügen',
    pasteBtn: 'Einfügen',
    copyUrlTitle: 'URL in Zwischenablage kopieren',
    copiedBtn: 'Kopiert',
    copyBtn: 'Kopieren',
    estModalTitle: 'Zum Projektbudget hinzufügen',
    estModalIngLabel: 'Rohstoff:',
    estModalProjectLabel: 'Projekt',
    estModalReqQty: (unit) => `Benötigte Menge (${unit})`,
    cancelBtn: 'Abbrechen',
    addToEstSubmit: 'Zum Budget hinzufügen',
    editIngTitle: 'Rohstoff bearbeiten',
    newIngTitle: 'Neuer Rohstoff',
    closeFormAria: 'Formular schließen',
    ingNameLabel: 'Rohstoffname *',
    ingNamePlaceholder: 'z. B. Vetiver Haiti ÄÖ',
    statusLabel: 'Status',
    familyLabel: 'Duftfamilie',
    tierLabel: 'Pyramidenebene',
    originLabel: 'Herkunft',
    longevityLabel: 'Haltbarkeit',
    longevityPlaceholder: 'z. B. 12–24 Std. (hoch)',
    sillageLabel: 'Sillage',
    packSizeLabel: 'Gebindegröße',
    unitLabel: 'Einheit',
    packPriceLabel: (sym) => `Gebindepreis (${sym})`,
    dilutionPctLabel: 'Verdünnung (%)',
    remainingLabel: (unit) => `Restbestand (${unit})`,
    maxIfraLabel: 'Max % (IFRA)',
    ifraPlaceholder: 'z. B. 0.4',
    supplierFieldLabel: 'Shopname (Lieferant)',
    supplierPlaceholder: 'z. B. AromaLab / PerfumeSupplies',
    lastPurchaseDateLabel: 'Letztes Kaufdatum',
    purchaseUrlLabel: 'Kauf-URL',
    storageLocationLabel: 'Lagerort',
    storagePlaceholder: 'z. B. Kühlschrank +4°C, Fach 2 / Schrank B1, Braunglas',
    scentNotesLabel: 'Duftbeschreibung & persönliche Notizen (volle Breite)',
    scentNotesPlaceholder: 'Verlauf auf dem Riechstreifen, beste Kombinationen...',
    saveChangesBtn: 'Änderungen speichern',
    addIngBtn: 'Rohstoff hinzufügen',
    priceMonitorTitle: 'Einkaufspreis-Schwankungen seit letztem Eintrag',
    priceMonitorHikes: (count) => `gestiegen: ${count}`,
    priceMonitorDrops: (count) => `gesunken: ${count}`,
    priceThresholdLabel: 'Schwelle:',
    filterPriceAlertsBtn: (count) => `Nur Preisänderungen (${count})`,
    showAllItemsBtn: 'Alle anzeigen',
    priceUpAlert: (pct) => `+${pct}% z. letzten`,
    priceDownAlert: (pct) => `-${pct}% z. letzten`,
    prevPriceShort: 'zuvor',
    priceAlertBannerUp: (pct, prev, curr, meta) =>
      `Einkaufspreis um +${pct}% seit dem letzten Eintrag gestiegen (${prev} → ${curr}${meta ? ` · ${meta}` : ''}). Formelkosten oder Lieferanten prüfen.`,
    priceAlertBannerDown: (pct, prev, curr, meta) =>
      `Einkaufspreis um −${pct}% seit dem letzten Eintrag gesunken (${prev} → ${curr}${meta ? ` · ${meta}` : ''}) — günstiger für das Budget.`,
    priceHistoryBtn: (count) => `Preishistorie (${count})`,
    priceHistoryColDate: 'Datum',
    priceHistoryColStore: 'Lieferant',
    priceHistoryColQty: 'Menge',
    priceHistoryColUnitPrice: 'Preis / Einh.',
    priceHistoryColTotal: 'Gesamt',
    priceHistoryDirectEditNote: 'Direkt im Katalog aktualisiert',
    priceHistoryCatalogNow: 'Aktueller Katalogpreis',
    tagsBarTitle: 'Kategorien & Tags',
    tagsAllBtn: 'Alle',
    newTagPlaceholder: 'Neue Kategorie (z. B. retro)...',
    createTagBtn: 'Tag erstellen',
    manageTagsBtn: 'Verwalten',
    doneManageTagsBtn: 'Fertig',
    deleteTagAria: (tag) => `Tag "${tag}" löschen`,
    tagMatchAny: 'Beliebiges',
    tagMatchAll: 'Alle',
    cardTagsBtn: 'Tags',
    cardTagInputPlaceholder: 'Neues Tag + Enter...',
    cardTagAssignLabel: 'Tags zuweisen:',
    modalTagsLabel: 'Benutzerdefinierte Kategorien / Tags',
    modalTagAddBtn: 'Hinzufügen',
    modalTagPlaceholder: 'z. B. retro, synthetisch, natürlich...',
    starterSuggestionsLabel: 'Schnellideen:',
    criticalMonitorTitle: 'Kritischer Rohstoffbestand',
    criticalMonitorCount: (count) => `unter Schwellenwert: ${count}`,
    criticalMonitorAllOk: (grams) => `Alle vorrätigen Rohstoffe ≥ ${grams} g`,
    criticalThresholdLabel: 'Schwelle:',
    filterCriticalBtn: (count) => `Nur kritische (${count})`,
    showAllStockBtn: 'Alle anzeigen',
    detailsBtn: 'Details',
    hideDetailsBtn: 'Einklappen',
    expandAllBtn: 'Alle ausklappen',
    collapseAllBtn: 'Alle einklappen',
    colStockVolume: 'Bestand & Menge',
    runningLowBadge: 'Wird knapp',
    bottleLabelInputLabel: 'Flaschenetikett:',
    bottleLabelPlaceholder: 'Flaschenbeschriftung...',
    openUrlTitle: 'Link in neuem Tab öffnen',
  },
};

export function IngredientsCatalog({
  ingredients,
  filteredIngredients,
  library = [],
  projects,
  estimates = [],
  viewSettings = DEFAULT_VIEW_SETTINGS,
  language = 'ru',
  currency = 'RUB',
  filters,
  onChangeFilters,
  onResetFilters,
  activeFiltersCount,
  statusCounts,
  filterPaneOpen,
  onToggleFilterPane,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
  onAddPurchaseRecord,
  onAddEstimateItem,
  availableTags: propAvailableTags,
  tagCounts: propTagCounts,
  onCreateTag,
  onDeleteTag,
}: IngredientsCatalogProps) {
  const t = ING_CATALOG_TEXT[language];
  const currencySymbol = getCurrencySymbol(currency);
  // Tag management & inline picker state
  const [newTagName, setNewTagName] = useState('');
  const [manageTagsMode, setManageTagsMode] = useState(false);
  const [tagPickerIngId, setTagPickerIngId] = useState<string | null>(null);
  const [cardTagDraft, setCardTagDraft] = useState('');
  const [modalTagDraft, setModalTagDraft] = useState('');
  const [modalLibrarySearch, setModalLibrarySearch] = useState('');
  // Clipboard feedback per ingredient ID or modal
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clipboardHint, setClipboardHint] = useState<string | null>(null);

  // Expanded state for compact view accordion
  const [expandedIngIds, setExpandedIngIds] = useState<Set<string>>(new Set());

  const toggleExpandIngredient = (id: string) => {
    setExpandedIngIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIngIds(new Set(filteredIngredients.map((i) => i.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIngIds(new Set());
  };

  // Modal Editor State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Ingredient, 'id' | 'createdAt'>>(EMPTY_FORM);

  // Quick Add-to-Estimate popover state
  const [estimateTargetIng, setEstimateTargetIng] = useState<Ingredient | null>(null);
  const [estimateProjectId, setEstimateProjectId] = useState(projects[0]?.id || '');
  const [estimateQty, setEstimateQty] = useState('10');

  const { mergedTags, computedTagCounts } = useMemo(() => {
    const labelByLower = new Map<string, string>();
    const counts: Record<string, number> = { ...(propTagCounts || {}) };

    for (const raw of propAvailableTags || []) {
      const clean = raw.trim().replace(/^#+/, '');
      if (!clean) continue;
      const low = clean.toLowerCase();
      if (!labelByLower.has(low)) labelByLower.set(low, clean);
    }

    if (!propTagCounts) {
      for (const ing of ingredients) {
        const seen = new Set<string>();
        for (const raw of ing.tags || []) {
          const clean = raw.trim().replace(/^#+/, '');
          if (!clean) continue;
          const low = clean.toLowerCase();
          if (!labelByLower.has(low)) labelByLower.set(low, clean);
          if (!seen.has(low)) {
            seen.add(low);
            counts[low] = (counts[low] || 0) + 1;
          }
        }
      }
    } else {
      for (const ing of ingredients) {
        for (const raw of ing.tags || []) {
          const clean = raw.trim().replace(/^#+/, '');
          if (!clean) continue;
          const low = clean.toLowerCase();
          if (!labelByLower.has(low)) labelByLower.set(low, clean);
        }
      }
    }

    const sorted = Array.from(labelByLower.values()).sort((a, b) =>
      a.localeCompare(b, language)
    );
    return { mergedTags: sorted, computedTagCounts: counts };
  }, [propAvailableTags, propTagCounts, ingredients, language]);

  const unusedStarterTags = useMemo(() => {
    const existingLower = new Set(mergedTags.map((tg) => tg.toLowerCase()));
    return STARTER_INGREDIENT_TAGS[language].filter(
      (preset) => !existingLower.has(preset.toLowerCase())
    );
  }, [mergedTags, language]);

  const selectedFilterTags = filters.tags || [];
  const selectedFilterTagsLower = useMemo(
    () => new Set(selectedFilterTags.map((tg) => tg.toLowerCase())),
    [selectedFilterTags]
  );

  const handleToggleFilterTag = (tag: string) => {
    const low = tag.toLowerCase();
    const exists = selectedFilterTags.some((tg) => tg.toLowerCase() === low);
    const next = exists
      ? selectedFilterTags.filter((tg) => tg.toLowerCase() !== low)
      : [...selectedFilterTags, tag];
    onChangeFilters({ tags: next });
  };

  const handleCreateStripTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagName.trim().replace(/^#+/, '');
    if (!clean) return;
    onCreateTag?.(clean);
    setNewTagName('');
  };

  const handleToggleTagOnIngredient = (ing: Ingredient, tag: string) => {
    const current = ing.tags || [];
    const low = tag.toLowerCase();
    const has = current.some((tg) => tg.toLowerCase() === low);
    const nextTags = has
      ? current.filter((tg) => tg.toLowerCase() !== low)
      : [...current, tag];
    onUpdateIngredient({ ...ing, tags: nextTags });
  };

  const handleAddCardTagSubmit = (e: React.FormEvent, ing: Ingredient) => {
    e.preventDefault();
    const clean = cardTagDraft.trim().replace(/^#+/, '');
    if (!clean) return;
    onCreateTag?.(clean);
    const current = ing.tags || [];
    if (!current.some((tg) => tg.toLowerCase() === clean.toLowerCase())) {
      onUpdateIngredient({ ...ing, tags: [...current, clean] });
    }
    setCardTagDraft('');
  };

  const handleToggleFormTag = (tag: string) => {
    const current = form.tags || [];
    const low = tag.toLowerCase();
    const has = current.some((tg) => tg.toLowerCase() === low);
    setForm((prev) => ({
      ...prev,
      tags: has
        ? (prev.tags || []).filter((tg) => tg.toLowerCase() !== low)
        : [...(prev.tags || []), tag],
    }));
  };

  const handleAddModalTag = () => {
    const clean = modalTagDraft.trim().replace(/^#+/, '');
    if (!clean) return;
    onCreateTag?.(clean);
    setForm((prev) => {
      const current = prev.tags || [];
      if (current.some((tg) => tg.toLowerCase() === clean.toLowerCase())) return prev;
      return { ...prev, tags: [...current, clean] };
    });
    setModalTagDraft('');
  };

  const openCreateModal = (defaultStatus: IngredientStatus = 'wishlist') => {
    setEditingId(null);
    setModalTagDraft('');
    setModalLibrarySearch('');
    setForm({
      ...EMPTY_FORM,
      solventNote: t.defaultSolventNote,
      longevityLabel: t.defaultLongevityLabel,
      status: defaultStatus,
      purchaseDate: defaultStatus === 'in_stock' ? todayIsoDate() : '',
      tags: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (ing: Ingredient) => {
    setEditingId(ing.id);
    setModalTagDraft('');
    setModalLibrarySearch('');
    setForm({
      name: ing.name,
      inciOrCas: ing.inciOrCas || '',
      family: ing.family,
      tier: ing.tier,
      origin: ing.origin,
      status: ing.status,
      dilutionPercent: ing.dilutionPercent,
      solventNote: ing.solventNote || '',
      unit: ing.unit,
      quantityGrams: ing.quantityGrams,
      remainingGrams: ing.remainingGrams,
      priceTotal: ing.priceTotal,
      longevityLabel: ing.longevityLabel,
      sillage: ing.sillage,
      ifraLimitPercent: ing.ifraLimitPercent,
      supplier: ing.supplier || '',
      purchaseUrl: ing.purchaseUrl || '',
      purchaseDate: ing.purchaseDate || '',
      storageLocation: ing.storageLocation || '',
      bottleLabel: ing.bottleLabel || '',
      olfactoryNotes: ing.olfactoryNotes,
      tags: ing.tags ? [...ing.tags] : [],
    });
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const normalizedTags: string[] = [];
    const seenTags = new Set<string>();
    for (const raw of form.tags || []) {
      const clean = raw.trim().replace(/^#+/, '');
      if (!clean) continue;
      const low = clean.toLowerCase();
      if (!seenTags.has(low)) {
        seenTags.add(low);
        normalizedTags.push(clean);
        onCreateTag?.(clean);
      }
    }

    if (editingId) {
      const existing = ingredients.find((i) => i.id === editingId);
      const oldUnitPrice =
        existing && existing.quantityGrams > 0 && existing.priceTotal > 0
          ? existing.priceTotal / existing.quantityGrams
          : 0;
      const newUnitPrice =
        form.quantityGrams > 0 && form.priceTotal > 0 ? form.priceTotal / form.quantityGrams : 0;
      const priceChangedSignificantly =
        oldUnitPrice > 0 &&
        newUnitPrice > 0 &&
        Math.abs(newUnitPrice - oldUnitPrice) / oldUnitPrice >= 0.005;

      onUpdateIngredient({
        ...(existing || { id: editingId, createdAt: todayIsoDate() }),
        ...form,
        name: form.name.trim(),
        tags: normalizedTags,
        ...(priceChangedSignificantly
          ? {
              previousUnitPrice: Number(oldUnitPrice.toFixed(4)),
              previousPriceDate: existing?.purchaseDate || existing?.createdAt || todayIsoDate(),
            }
          : {}),
      });
    } else {
      onAddIngredient({
        id: generateId('ing'),
        ...form,
        name: form.name.trim(),
        tags: normalizedTags,
        createdAt: todayIsoDate(),
      });
    }
    setModalOpen(false);
  };

  const handleMarkAsPurchased = (ing: Ingredient) => {
    const today = todayIsoDate();
    onUpdateIngredient({
      ...ing,
      status: 'in_stock',
      purchaseDate: today,
      remainingGrams: ing.remainingGrams ?? ing.quantityGrams,
    });
    if (ing.priceTotal > 0 && ing.quantityGrams > 0) {
      onAddPurchaseRecord({
        id: generateId('pur'),
        date: today,
        ingredientName: ing.name,
        ingredientId: ing.id,
        quantity: ing.quantityGrams,
        unit: ing.unit,
        unitPrice: Number((ing.priceTotal / ing.quantityGrams).toFixed(2)),
        totalCost: ing.priceTotal,
        supplier: ing.supplier || t.supplierNotSet,
        notes: t.movedFromWishlistNote,
      });
    }
  };

  const handleQuickStatusChange = (ing: Ingredient, newStatus: IngredientStatus) => {
    if (ing.status === newStatus) return;
    if (newStatus === 'in_stock') {
      handleMarkAsPurchased(ing);
      return;
    }
    onUpdateIngredient({
      ...ing,
      status: newStatus,
    });
  };

  const handleConfirmAddToEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimateTargetIng || !estimateProjectId) return;
    const qty = Math.max(0.1, Number(estimateQty) || estimateTargetIng.quantityGrams);
    const unitPrice =
      estimateTargetIng.quantityGrams > 0
        ? estimateTargetIng.priceTotal / estimateTargetIng.quantityGrams
        : 0;

    onAddEstimateItem({
      id: generateId('est'),
      projectId: estimateProjectId,
      ingredientId: estimateTargetIng.id,
      ingredientName: estimateTargetIng.name,
      category: estimateTargetIng.tier === 'solvent' ? 'solvent' : 'raw_materials',
      requiredQuantity: qty,
      unit: estimateTargetIng.unit,
      estimatedUnitPrice: Number(unitPrice.toFixed(2)),
      notes: estimateTargetIng.supplier
        ? `${t.storePrefix}: ${estimateTargetIng.supplier}`
        : undefined,
    });
    setEstimateTargetIng(null);
  };

  const handleCopyUrl = async (url: string, targetId: string) => {
    if (!url.trim()) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(targetId);
      setClipboardHint(null);
      window.setTimeout(() => setCopiedId((prev) => (prev === targetId ? null : prev)), 2000);
    } catch {
      setClipboardHint(t.copyManualHint);
    }
  };

  const handlePasteUrlToRow = async (ing: Ingredient) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        onUpdateIngredient({ ...ing, purchaseUrl: text.trim() });
        setClipboardHint(null);
      } else {
        setClipboardHint(t.clipboardEmptyHint);
      }
    } catch {
      setClipboardHint(t.clipboardBlockedHint);
    }
  };

  const handlePasteUrlToModal = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setForm((prev) => ({ ...prev, purchaseUrl: text.trim() }));
        setClipboardHint(null);
      }
    } catch {
      setClipboardHint(t.pasteFieldHint);
    }
  };

  const wishlistTotalValue = useMemo(
    () =>
      ingredients
        .filter((i) => i.status === 'wishlist')
        .reduce((acc, i) => acc + (i.priceTotal || 0), 0),
    [ingredients]
  );

  const runningLowCount = useMemo(
    () => ingredients.filter((i) => isIngredientRunningLow(i)).length,
    [ingredients]
  );

  return (
    <div className="@container space-y-6">
      {/* Header — action buttons automatically collapse to icon-only below @800px container width */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#181917]">{t.title}</h1>
          {viewSettings.showPageDescriptions && (
            <p className="mt-1 text-sm text-[#575955]">{t.subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              void import('../utils/excelExport').then(({ exportIngredientsToExcel }) => {
                exportIngredientsToExcel(filteredIngredients, language, currency);
              });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E4E0] bg-white px-2.5 @[800px]:px-3.5 py-2 text-sm font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1] whitespace-nowrap"
            title={t.exportExcelTitle}
            aria-label={t.exportExcelAria}
          >
            <FileSpreadsheet className="h-4 w-4 text-[#15803D] shrink-0" />
            <span className="hidden @[800px]:inline">{t.exportExcelBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('wishlist')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E4E0] bg-white px-2.5 @[800px]:px-3.5 py-2 text-sm font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1] whitespace-nowrap"
            title={t.addToWishlistBtn}
            aria-label={t.addToWishlistBtn}
          >
            <ListPlus className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
            <span className="hidden @[800px]:inline">{t.addToWishlistBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateModal('in_stock')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--theme-accent)] px-2.5 @[800px]:px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
            title={t.addToStockBtn}
            aria-label={t.addToStockBtn}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden @[800px]:inline">{t.addToStockBtn}</span>
          </button>
        </div>
      </div>

      {/* Compact Top Bar: Status Tabs, Search, and Side-Pane Filter Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#E4E4E0] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
            {STATUS_TAB_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onChangeFilters({ status: key })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filters.status === key && !filters.lowStockOnly
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {key === 'all' ? t.allTab : getIngredientStatusLabel(key, language)} ({statusCounts[key]})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onChangeFilters({
                lowStockOnly: !filters.lowStockOnly,
                status: !filters.lowStockOnly ? 'in_stock' : filters.status,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              filters.lowStockOnly
                ? 'border-[#B45309] bg-[#FFFBEB] text-[#B45309] font-semibold'
                : 'border-[#E4E4E0] bg-white text-[#3F413D] hover:bg-[#F3F2F1]'
            }`}
          >
            <span>
              {tr(language, {
                ru: 'Заканчивается',
                en: 'Running low',
                it: 'In esaurimento',
                es: 'Agotándose',
                de: 'Wird knapp',
              })}{' '}
              ({runningLowCount})
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleFilterPane}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              filterPaneOpen || activeFiltersCount > 0
                ? 'border-[var(--theme-accent)]/40 bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                : 'border-[#E4E4E0] bg-white text-[#3F413D] hover:bg-[#F3F2F1]'
            }`}
            title={t.filtersTitle}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>
              {t.filtersBtn}
              {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </span>
          </button>

          {(activeFiltersCount > 0 || filters.sortBy !== 'default') && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1] whitespace-nowrap"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t.resetBtn}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {wishlistTotalValue > 0 && (
            <span className="hidden xl:inline text-xs text-[#6B6D68] tabular-nums whitespace-nowrap">
              {t.wishlistLabel}{' '}
              <strong className="text-[#181917]">
                {formatCurrencyRub(wishlistTotalValue, language, currency)}
              </strong>
            </span>
          )}
          <div className="relative w-full lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787A74]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ searchQuery: e.target.value })}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white py-2 pl-9 pr-3 text-sm text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {clipboardHint && <p className="text-xs text-[#B45309]">{clipboardHint}</p>}

      {/* Custom Categories & Tags Filter + Creation Strip */}
      <div className="rounded-xl border border-[#E4E4E0] bg-[#FAF9F8] px-4 py-3 space-y-2.5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181917]">
              <Tag className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
              <span>{t.tagsBarTitle}</span>
            </span>

            {selectedFilterTags.length >= 2 && (
              <div className="inline-flex items-center rounded-md bg-[#EEEEEC] p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChangeFilters({ tagMatchMode: 'any' })}
                  className={`rounded px-2 py-0.5 font-medium transition-colors whitespace-nowrap ${
                    (filters.tagMatchMode || 'any') === 'any'
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#605E5C] hover:text-[#181917]'
                  }`}
                >
                  {t.tagMatchAny}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFilters({ tagMatchMode: 'all' })}
                  className={`rounded px-2 py-0.5 font-medium transition-colors whitespace-nowrap ${
                    filters.tagMatchMode === 'all'
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#605E5C] hover:text-[#181917]'
                  }`}
                >
                  {t.tagMatchAll}
                </button>
              </div>
            )}

            {mergedTags.length > 0 && onDeleteTag && (
              <button
                type="button"
                onClick={() => setManageTagsMode((v) => !v)}
                className={`text-[11px] font-medium hover:underline ${
                  manageTagsMode ? 'text-[#B91C1C]' : 'text-[#605E5C]'
                }`}
              >
                {manageTagsMode ? t.doneManageTagsBtn : t.manageTagsBtn}
              </button>
            )}
          </div>

          <form onSubmit={handleCreateStripTag} className="flex items-center gap-1.5">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={t.newTagPlaceholder}
              className="w-full sm:w-56 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTagName.trim()}
              className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
              <span>{t.createTagBtn}</span>
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChangeFilters({ tags: [] })}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedFilterTags.length === 0
                ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                : 'border-[#E4E4E0] bg-white text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tagsAllBtn}
          </button>

          {mergedTags.map((tag) => {
            const isSelected = selectedFilterTagsLower.has(tag.toLowerCase());
            const count = computedTagCounts[tag.toLowerCase()] || 0;
            return (
              <div key={tag} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggleFilterTag(tag)}
                  className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    manageTagsMode && onDeleteTag ? 'rounded-l-lg border-r-0' : 'rounded-lg'
                  } ${
                    isSelected
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                      : 'border-[#E4E4E0] bg-white text-[#3F413D] hover:bg-[#F3F2F1]'
                  }`}
                >
                  <span>#{tag}</span>
                  <span className="font-mono text-[11px] opacity-75 tabular-nums">{count}</span>
                </button>
                {manageTagsMode && onDeleteTag && (
                  <button
                    type="button"
                    onClick={() => onDeleteTag(tag)}
                    aria-label={t.deleteTagAria(tag)}
                    title={t.deleteTagAria(tag)}
                    className="inline-flex items-center justify-center rounded-r-lg border border-[#E4E4E0] bg-white px-1.5 py-1 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {unusedStarterTags.length > 0 && onCreateTag && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1">
              <span className="text-[11px] text-[#797775]">{t.starterSuggestionsLabel}</span>
              {unusedStarterTags.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onCreateTag(preset)}
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-[#D2D0CE] bg-transparent px-2 py-0.5 text-[11px] text-[#605E5C] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] whitespace-nowrap"
                >
                  <Plus className="h-3 w-3" />
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ingredients List */}
      {filteredIngredients.length === 0 ? (
        <div className="rounded-xl border border-[#E4E4E0] bg-white p-12 text-center space-y-3">
          <p className="text-base font-medium text-[#181917]">{t.emptyTitle}</p>
          <p className="text-sm text-[#575955]">{t.emptySubtitle}</p>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.resetAllFiltersBtn}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* List Header Bar with Count and Expand / Collapse All */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#6B6D68]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#181917]">
                {tr(language, {
                  ru: `Ингредиенты: ${filteredIngredients.length}`,
                  en: `Ingredients: ${filteredIngredients.length}`,
                  it: `Ingredienti: ${filteredIngredients.length}`,
                  es: `Ingredientes: ${filteredIngredients.length}`,
                  de: `Rohstoffe: ${filteredIngredients.length}`,
                })}
              </span>
              {filteredIngredients.length !== ingredients.length && (
                <span className="text-[11px] text-[#8B8D87]">
                  {tr(language, {
                    ru: `(из ${ingredients.length})`,
                    en: `(of ${ingredients.length})`,
                    it: `(su ${ingredients.length})`,
                    es: `(de ${ingredients.length})`,
                    de: `(von ${ingredients.length})`,
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {expandedIngIds.size > 0 ? (
                <button
                  type="button"
                  onClick={handleCollapseAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#4B4D48] hover:bg-[#F3F2F1] transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>{t.collapseAllBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[#4B4D48] hover:bg-[#F3F2F1] transition-colors"
                >
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                  <span>{t.expandAllBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Column Header */}
          <div className="hidden lg:flex items-center justify-between gap-3 px-4 py-2 rounded-lg bg-[#FAF9F8] border border-[#EAEAE6] text-[11px] font-semibold text-[#6B6D68]">
            <div className="flex-1 min-w-0">{t.colIngredient}</div>
            <div className="flex items-center justify-end gap-4 shrink-0">
              <div className="w-[130px] text-right">{t.colStockVolume}</div>
              <div className="w-[120px] text-right">{t.colUnitPrice}</div>
              <div className="w-[110px] text-left pl-1">{t.colStatus}</div>
              <div className="w-[160px] text-right pr-1">{t.colActions}</div>
            </div>
          </div>

          {filteredIngredients.map((ing) => {
            const unitPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
            const unitLabel = formatUnit(ing.unit, language);
            const isExpanded = expandedIngIds.has(ing.id);
            const runningLow = isIngredientRunningLow(ing);

            return (
              <article
                key={ing.id}
                className="rounded-xl border border-[#E4E4E0] hover:border-[#C8C8C2] bg-white overflow-hidden transition-all shadow-xs"
              >
                {/* Primary Compact Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 py-2.5">
                  {/* 1. Name & Primary Badges */}
                  <div className="flex items-start lg:items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className="mt-1 lg:mt-0 h-3 w-3 shrink-0 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: FAMILY_HEX_MAP[ing.family] || '#6B6D68' }}
                      title={`${getOlfactoryFamilyLabel(ing.family, language)} · ${getNoteTierLabel(ing.tier, language)}`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-sm text-[#181917] leading-snug">
                          {ing.name}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-[#F3F2F1] px-1.5 py-0.5 text-[10px] font-medium text-[#4B4D48] whitespace-nowrap">
                          {ing.dilutionPercent}%{ing.solventNote ? ` ${ing.solventNote}` : ''}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-[#FAF9F8] border border-[#EAEAE6] px-1.5 py-0.5 text-[10px] text-[#6B6D68] whitespace-nowrap">
                          {getIngredientOriginLabel(ing.origin, language)}
                        </span>
                        {ing.bottleLabel && (
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-amber-50/80 border border-amber-200/70 px-1.5 py-0.5 text-[10px] text-amber-800 font-medium truncate max-w-[200px]"
                            title={`${t.bottleLabelInputLabel} ${ing.bottleLabel}`}
                          >
                            <span>🏷️</span>
                            <span className="truncate">{ing.bottleLabel}</span>
                          </span>
                        )}
                      </div>

                      {/* Subline: CAS / INCI + Category / Tier + Tags preview */}
                      <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[#787A74] mt-0.5">
                        {ing.inciOrCas && (
                          <span className="font-mono">CAS: {ing.inciOrCas}</span>
                        )}
                        <span className="text-[#6B6D68]">
                          {getOlfactoryFamilyLabel(ing.family, language)} · {getNoteTierLabel(ing.tier, language)}
                        </span>
                        {(ing.tags || []).slice(0, 3).map((tg) => (
                          <span key={tg} className="text-[#8B8D87] font-medium">
                            #{tg}
                          </span>
                        ))}
                        {(ing.tags || []).length > 3 && (
                          <span className="text-[#8B8D87]">
                            +{(ing.tags || []).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: 2. Stock, 3. Price, 4. Status, 5. Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0 border-[#F3F2F1]">
                    {/* 2. Stock & Volume */}
                    <div className="text-left lg:text-right min-w-[125px]">
                      <div className="text-xs font-mono font-semibold tabular-nums text-[#181917]">
                        {ing.quantityGrams} {unitLabel}
                        {ing.remainingGrams !== undefined && (
                          <span className="text-[#575955] font-normal ml-1">
                            ({t.leftShort} {ing.remainingGrams} {unitLabel})
                          </span>
                        )}
                      </div>
                      {runningLow ? (
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#B45309]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] animate-pulse" />
                          <span>{t.runningLowBadge}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#787A74] truncate max-w-[140px]">
                          {ing.storageLocation ? `📍 ${ing.storageLocation}` : '—'}
                        </div>
                      )}
                    </div>

                    {/* 3. Price */}
                    <div className="text-left lg:text-right min-w-[110px]">
                      <div className="text-xs font-mono font-semibold tabular-nums text-[#181917]">
                        {formatCurrencyDecimal(unitPrice, language, currency)}/{unitLabel}
                      </div>
                      <div className="text-[10px] text-[#6B6D68] tabular-nums">
                        {t.packShort} {formatCurrencyRub(ing.priceTotal, language, currency)}
                      </div>
                    </div>

                    {/* 4. Status Quick Selector */}
                    <div className="relative min-w-[110px]">
                      <select
                        value={ing.status}
                        onChange={(e) => handleQuickStatusChange(ing, e.target.value as IngredientStatus)}
                        className={`w-full appearance-none cursor-pointer rounded-lg border pl-2.5 pr-6 py-1 text-xs font-medium transition-colors focus:outline-none ${
                          ing.status === 'in_stock'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'
                            : ing.status === 'ordered'
                              ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100/70'
                              : 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100/70'
                        }`}
                        title={getIngredientStatusLabel(ing.status, language)}
                      >
                        <option value="in_stock">{getIngredientStatusLabel('in_stock', language)}</option>
                        <option value="ordered">{getIngredientStatusLabel('ordered', language)}</option>
                        <option value="wishlist">{getIngredientStatusLabel('wishlist', language)}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
                    </div>

                    {/* 5. Actions & Details Toggle Button */}
                    <div className="flex items-center gap-1">
                      {ing.status !== 'in_stock' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsPurchased(ing)}
                          className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title={t.boughtTitle}
                        >
                          <Check className="h-3 w-3" />
                          <span className="hidden sm:inline">{t.boughtBtn}</span>
                        </button>
                      )}

                      {projects.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEstimateTargetIng(ing);
                            setEstimateProjectId(projects[0].id);
                            setEstimateQty(String(ing.quantityGrams || 10));
                          }}
                          className="rounded-md p-1.5 text-[#575955] hover:bg-[#F1F1EE] hover:text-[#181917] transition-colors"
                          title={t.addToEstimateTitle}
                          aria-label={t.addToEstimateAria(ing.name)}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditModal(ing)}
                        className="rounded-md p-1.5 text-[#575955] hover:bg-[#F1F1EE] hover:text-[#181917] transition-colors"
                        title={t.editTitle}
                        aria-label={t.editAria(ing.name)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteIngredient(ing.id)}
                        className="rounded-md p-1.5 text-[#787A74] hover:bg-red-50 hover:text-red-700 transition-colors"
                        title={t.deleteTitle}
                        aria-label={t.deleteAria(ing.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Дополнительно / Скрыть button */}
                      <button
                        type="button"
                        onClick={() => toggleExpandIngredient(ing.id)}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                          isExpanded
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                            : 'border-[#E4E4E0] bg-[#FAF9F8] text-[#4B4D48] hover:bg-[#EAEAE6]'
                        }`}
                        title={isExpanded ? t.hideDetailsBtn : t.detailsBtn}
                      >
                        <span>{isExpanded ? t.hideDetailsBtn : t.detailsBtn}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion: «Дополнительно» */}
                {isExpanded && (
                  <div className="border-t border-[#EAEAE6] bg-[#FAF9F8] px-4 py-3.5 text-xs space-y-3">
                    {/* Row 1: Scent Profile & Bottle Label editable input */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-semibold text-[#575955]">{t.scentProfileLabel}</span>
                        <span className="text-[#181917] leading-relaxed ml-1">
                          {ing.olfactoryNotes || <span className="text-[#8B8D87] italic">{t.noDescriptionYet}</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 bg-white border border-[#E4E4E0] rounded-lg px-2.5 py-1 shadow-2xs">
                        <span className="text-[#605E5C] font-medium whitespace-nowrap text-[11px]">
                          🏷️ {t.bottleLabelInputLabel}
                        </span>
                        <input
                          type="text"
                          value={ing.bottleLabel || ''}
                          onChange={(e) => onUpdateIngredient({ ...ing, bottleLabel: e.target.value })}
                          placeholder={t.bottleLabelPlaceholder}
                          className="w-48 sm:w-56 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 2: Secondary Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-[#EAEAE6]">
                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.colFamilyTier}</div>
                        <div className="font-medium text-[#181917] mt-0.5 truncate">
                          {getOlfactoryFamilyLabel(ing.family, language)} · {getNoteTierLabel(ing.tier, language)}
                        </div>
                      </div>

                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.colLongevitySillage}</div>
                        <div className="font-medium text-[#181917] mt-0.5 truncate">
                          {ing.longevityLabel || '—'} · {getSillageLabel(ing.sillage, language).split(' ')[0]}
                        </div>
                      </div>

                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.colMaxPct} (IFRA 51)</div>
                        <div className="font-medium font-mono text-[#181917] mt-0.5">
                          {(() => {
                            const ifraStd = resolveIfraStandard(ing);
                            const displayLimit =
                              ifraStd !== undefined
                                ? ifraStd.category4LimitPercent
                                : ing.ifraLimitPercent;

                            if (
                              ifraStd?.status === 'prohibited' ||
                              ifraStd?.status === 'eu_banned' ||
                              displayLimit === 0
                            ) {
                              return <span className="font-semibold text-[#B91C1C]">0% (Ban)</span>;
                            }
                            if (ifraStd?.status === 'exempt_fcf') {
                              return <span className="font-medium text-[#15803D]">FCF</span>;
                            }
                            if (displayLimit !== undefined) {
                              return <span>{displayLimit}%</span>;
                            }
                            if (ifraStd?.status === 'unrestricted') {
                              return <span className="text-[#15803D]">Свободно</span>;
                            }
                            return '—';
                          })()}
                        </div>
                      </div>

                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.colStorage}</div>
                        <div className="font-medium text-[#181917] mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#787A74] shrink-0" />
                          <span>{ing.storageLocation || '—'}</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.colStorePurchased}</div>
                        <div className="font-medium text-[#181917] mt-0.5 truncate">
                          {ing.supplier || t.storeNotSet}
                        </div>
                      </div>

                      <div className="rounded-lg bg-white border border-[#EAEAE6] p-2">
                        <div className="text-[10px] text-[#787A74] uppercase tracking-wider">{t.lastPurchaseDateLabel}</div>
                        <div className="font-medium font-mono text-[#181917] mt-0.5">
                          {ing.purchaseDate || t.notPurchased}
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Store & Purchase URL */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-[#EAEAE6]">
                      <div className="flex items-center gap-2 text-xs text-[#323130] shrink-0">
                        <Store className="h-3.5 w-3.5 text-[#605E5C]" />
                        <span className="text-[#605E5C] font-medium">{t.storeColon}</span>
                        <input
                          type="text"
                          value={ing.supplier || ''}
                          onChange={(e) => onUpdateIngredient({ ...ing, supplier: e.target.value })}
                          placeholder={t.storeNamePlaceholder}
                          aria-label={t.storeForAria(ing.name)}
                          className="w-40 sm:w-48 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-1 items-center gap-1.5 min-w-0">
                        <span className="text-xs text-[#605E5C] shrink-0 font-medium">{t.urlColon}</span>
                        <input
                          type="url"
                          value={ing.purchaseUrl || ''}
                          onChange={(e) => onUpdateIngredient({ ...ing, purchaseUrl: e.target.value })}
                          placeholder={t.urlPlaceholder}
                          aria-label={t.urlForAria(ing.name)}
                          className="min-w-0 flex-1 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 font-mono text-xs text-[var(--theme-accent)] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handlePasteUrlToRow(ing)}
                          className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1] whitespace-nowrap shrink-0"
                          title={t.pasteUrlTitle}
                        >
                          <ClipboardPaste className="h-3 w-3 text-[var(--theme-accent)]" />
                          <span>{t.pasteBtn}</span>
                        </button>
                        <button
                          type="button"
                          disabled={!ing.purchaseUrl?.trim()}
                          onClick={() => handleCopyUrl(ing.purchaseUrl || '', ing.id)}
                          className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-40 whitespace-nowrap shrink-0"
                          title={t.copyUrlTitle}
                        >
                          <ClipboardCopy className="h-3 w-3 text-[#605E5C]" />
                          <span>{copiedId === ing.id ? t.copiedBtn : t.copyBtn}</span>
                        </button>
                        {ing.purchaseUrl?.trim() && (
                          <a
                            href={ing.purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-[11px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1] whitespace-nowrap shrink-0"
                            title={t.openUrlTitle}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Tags bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAEAE6]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                        <span className="text-[11px] font-medium text-[#605E5C]">{t.cardTagAssignLabel}</span>
                        {(ing.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-md bg-white border border-[#E4E4E0] px-2 py-0.5 text-[11px] text-[#4B4D48]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCardTagDraft('');
                          setTagPickerIngId((prev) => (prev === ing.id ? null : ing.id));
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4B4D48] hover:bg-[#F3F2F1] transition-colors"
                      >
                        <Tag className="h-3 w-3 text-[var(--theme-accent)]" />
                        <span>{tagPickerIngId === ing.id ? t.closeFormAria : t.cardTagsBtn}</span>
                      </button>
                    </div>

                    {/* Inline Card Tag Picker if open */}
                    {tagPickerIngId === ing.id && (
                      <div className="rounded-lg border border-[#EAEAE6] bg-white p-3 space-y-2 mt-2">
                        <form
                          onSubmit={(e) => handleAddCardTagSubmit(e, ing)}
                          className="flex items-center gap-1.5"
                        >
                          <input
                            type="text"
                            value={cardTagDraft}
                            onChange={(e) => setCardTagDraft(e.target.value)}
                            placeholder={t.cardTagInputPlaceholder}
                            className="w-48 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!cardTagDraft.trim()}
                            className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#181917] hover:bg-[#F3F2F1] disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3 text-[var(--theme-accent)]" />
                            <span>{t.modalTagAddBtn}</span>
                          </button>
                        </form>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {Array.from(new Set([...mergedTags, ...(ing.tags || [])])).map((tag) => {
                            const assigned = (ing.tags || []).some(
                              (tg) => tg.toLowerCase() === tag.toLowerCase()
                            );
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleToggleTagOnIngredient(ing, tag)}
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                  assigned
                                    ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                                    : 'border-[#E4E4E0] bg-white text-[#575955] hover:text-[#181917]'
                                }`}
                              >
                                {assigned && <Check className="h-3 w-3 shrink-0" />}
                                <span>#{tag}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Quick Add-to-Project-Estimate Modal */}
      {estimateTargetIng && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181917]/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setEstimateTargetIng(null)}
        >
          <form
            onSubmit={handleConfirmAddToEstimate}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-[#E4E4E0] bg-white p-6 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#181917]">{t.estModalTitle}</h3>
              <button
                type="button"
                onClick={() => setEstimateTargetIng(null)}
                className="rounded p-1 text-[#575955] hover:bg-[#F1F1EE]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[#575955]">
              {t.estModalIngLabel}{' '}
              <strong className="text-[#181917]">{estimateTargetIng.name}</strong>
            </p>
            <div>
              <label className="block text-xs font-medium text-[#575955] mb-1">
                {t.estModalProjectLabel}
              </label>
              <select
                value={estimateProjectId}
                onChange={(e) => setEstimateProjectId(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#575955] mb-1">
                {t.estModalReqQty(formatUnit(estimateTargetIng.unit, language))}
              </label>
              <input
                type="number"
                min={0.1}
                step="0.1"
                value={estimateQty}
                onChange={(e) => setEstimateQty(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 font-mono text-sm tabular-nums"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEstimateTargetIng(null)}
                className="rounded-lg border border-[#E4E4E0] px-4 py-2 text-xs font-medium text-[#181917]"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                {t.addToEstSubmit}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create / Edit Ingredient Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181917]/40 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <form
            onSubmit={handleSaveModal}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-xl border border-[#E4E4E0] bg-white p-6 shadow-xl space-y-5 my-8"
          >
            <div className="flex items-center justify-between border-b border-[#EAEAE6] pb-3">
              <h2 className="text-2xl font-bold text-[#181917]">
                {editingId ? t.editIngTitle : t.newIngTitle}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-[#575955] hover:bg-[#F1F1EE]"
                aria-label={t.closeFormAria}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {library.length > 0 && (
                <div className="sm:col-span-2 rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] p-3 space-y-2">
                  <label className="block text-xs font-semibold text-[#181917]">
                    {tr(language, {
                      ru: 'Поиск в библиотеке ингредиентов (автозаполнение)',
                      en: 'Search Ingredient Library (auto-fill)',
                      it: 'Cerca nella libreria ingredienti (autocompilazione)',
                      es: 'Buscar en la biblioteca de ingredientes (autorrelleno)',
                      de: 'In der Rohstoffbibliothek suchen (automatisch ausfüllen)',
                    })}
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                    <input
                      type="text"
                      value={modalLibrarySearch}
                      onChange={(e) => setModalLibrarySearch(e.target.value)}
                      placeholder={tr(language, {
                        ru: 'Введите название или CAS из библиотеки для быстрого заполнения...',
                        en: 'Type name or CAS from library to auto-fill...',
                        it: 'Digita nome o CAS dalla libreria...',
                        es: 'Escribe nombre o CAS de la biblioteca...',
                        de: 'Name oder CAS aus Bibliothek eingeben...',
                      })}
                      className="w-full rounded-lg border border-[#E4E4E0] bg-white py-1.5 pl-8 pr-3 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                    />
                  </div>
                  {modalLibrarySearch.trim().length > 0 && (
                    <div className="max-h-40 overflow-y-auto divide-y divide-[#EAEAE6] rounded-lg border border-[#E4E4E0] bg-white">
                      {library
                        .filter((item) => {
                          const q = modalLibrarySearch.trim().toLowerCase();
                          return (
                            item.name.toLowerCase().includes(q) ||
                            (item.inciOrCas || '').toLowerCase().includes(q) ||
                            item.scentDescription.toLowerCase().includes(q)
                          );
                        })
                        .slice(0, 15)
                        .map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              const resolvedStd = resolveIfraStandard({
                                name: item.name,
                                inciOrCas: item.inciOrCas,
                              });
                              const resolvedIfraLimit = resolvedStd
                                ? resolvedStd.category4LimitPercent
                                : item.ifraLimitPercent;
                              setForm((prev) => ({
                                ...prev,
                                name: item.name,
                                inciOrCas: item.inciOrCas || prev.inciOrCas,
                                family: item.family,
                                tier: item.tier,
                                origin: item.origin,
                                ifraLimitPercent: resolvedIfraLimit,
                                longevityLabel: item.blotterLongevity || prev.longevityLabel,
                                olfactoryNotes:
                                  item.scentDescription || item.properties || prev.olfactoryNotes,
                              }));
                              setModalLibrarySearch('');
                            }}
                            className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-[#F3F2F1]"
                          >
                            <span className="font-medium text-[#181917] truncate">
                              {item.name}
                              {item.inciOrCas ? (
                                <span className="ml-1.5 font-mono text-[11px] text-[#6B6D68]">
                                  ({item.inciOrCas})
                                </span>
                              ) : null}
                            </span>
                            <span className="shrink-0 text-[11px] text-[var(--theme-accent)]">
                              {getOlfactoryFamilyLabel(item.family, language)} ·{' '}
                              {getNoteTierLabel(item.tier, language)}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.ingNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.ingNamePlaceholder}
                    className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    CAS / INCI
                  </label>
                  <input
                    type="text"
                    value={form.inciOrCas || ''}
                    onChange={(e) => setForm({ ...form, inciOrCas: e.target.value })}
                    placeholder="CAS 8016-96-4"
                    className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.statusLabel}
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as IngredientStatus })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                >
                  {(['in_stock', 'wishlist', 'ordered'] as IngredientStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {getIngredientStatusLabel(s, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.familyLabel}
                </label>
                <select
                  value={form.family}
                  onChange={(e) => setForm({ ...form, family: e.target.value as OlfactoryFamilyKey })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                >
                  {OLFACTORY_FAMILIES.map((f) => (
                    <option key={f.key} value={f.key}>
                      {getOlfactoryFamilyLabel(f.key, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.tierLabel}
                </label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value as NoteTier })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                >
                  {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((tier) => (
                    <option key={tier} value={tier}>
                      {getNoteTierLabel(tier, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.originLabel}
                </label>
                <select
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value as IngredientOrigin })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                >
                  {(['natural', 'synthetic', 'base', 'solvent'] as IngredientOrigin[]).map((o) => (
                    <option key={o} value={o}>
                      {getIngredientOriginLabel(o, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.longevityLabel}
                </label>
                <input
                  type="text"
                  value={form.longevityLabel}
                  onChange={(e) => setForm({ ...form, longevityLabel: e.target.value })}
                  placeholder={t.longevityPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.sillageLabel}
                </label>
                <select
                  value={form.sillage}
                  onChange={(e) => setForm({ ...form, sillage: e.target.value as SillageLevel })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                >
                  {(['intimate', 'moderate', 'strong'] as SillageLevel[]).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {getSillageLabel(lvl, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.packSizeLabel}
                  </label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.1"
                    value={form.quantityGrams}
                    onChange={(e) =>
                      setForm({ ...form, quantityGrams: Math.max(0.1, Number(e.target.value) || 0) })
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] px-2.5 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.unitLabel}
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value as MeasurementUnit })}
                    className="w-full rounded-lg border border-[#E4E4E0] px-2 py-2 text-xs"
                  >
                    {(['г', 'мл', 'кг', 'шт'] as MeasurementUnit[]).map((u) => (
                      <option key={u} value={u}>
                        {formatUnit(u, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.packPriceLabel(currencySymbol)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={form.priceTotal}
                    onChange={(e) =>
                      setForm({ ...form, priceTotal: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] px-2.5 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.dilutionPctLabel}
                  </label>
                  <input
                    type="number"
                    min={0.01}
                    max={100}
                    step="0.1"
                    value={form.dilutionPercent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dilutionPercent: Math.min(100, Math.max(0.01, Number(e.target.value) || 100)),
                      })
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] px-2.5 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.remainingLabel(formatUnit(form.unit, language))}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.remainingGrams ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        remainingGrams:
                          e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)),
                      })
                    }
                    placeholder={String(form.quantityGrams)}
                    className="w-full rounded-lg border border-[#E4E4E0] px-2.5 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#575955] mb-1">
                    {t.maxIfraLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.001"
                    value={form.ifraLimitPercent ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ifraLimitPercent: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    placeholder={t.ifraPlaceholder}
                    className="w-full rounded-lg border border-[#E4E4E0] px-2.5 py-2 font-mono text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.supplierFieldLabel}
                </label>
                <input
                  type="text"
                  value={form.supplier || ''}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  placeholder={t.supplierPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.lastPurchaseDateLabel}
                </label>
                <input
                  type="date"
                  value={form.purchaseDate || ''}
                  onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.purchaseUrlLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={form.purchaseUrl || ''}
                    onChange={(e) => setForm({ ...form, purchaseUrl: e.target.value })}
                    placeholder="https://..."
                    className="min-w-0 flex-1 rounded-lg border border-[#E4E4E0] px-3 py-2 font-mono text-xs text-[var(--theme-accent)]"
                  />
                  <button
                    type="button"
                    onClick={handlePasteUrlToModal}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E0] px-3 py-2 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1] whitespace-nowrap"
                  >
                    <ClipboardPaste className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    <span>{t.pasteBtn}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!form.purchaseUrl?.trim()}
                    onClick={() => handleCopyUrl(form.purchaseUrl || '', 'modal-url')}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E0] px-3 py-2 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-40 whitespace-nowrap"
                  >
                    <ClipboardCopy className="h-3.5 w-3.5 text-[#605E5C]" />
                    <span>{copiedId === 'modal-url' ? t.copiedBtn : t.copyBtn}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.storageLocationLabel}
                </label>
                <input
                  type="text"
                  value={form.storageLocation || ''}
                  onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
                  placeholder={t.storagePlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {tr(language, {
                    ru: 'Как подписано на бутылке',
                    en: 'Bottle Label / Signature',
                    it: 'Etichetta sul flacone',
                    es: 'Firma en el frasco',
                    de: 'Flaschenbeschriftung',
                  })}
                </label>
                <input
                  type="text"
                  value={form.bottleLabel || ''}
                  onChange={(e) => setForm({ ...form, bottleLabel: e.target.value })}
                  placeholder={tr(language, {
                    ru: 'Напр.: Бергамот 10% DPG (Флакон №12)...',
                    en: 'e.g. Bergamot 10% DPG (Bottle #12)...',
                    it: 'Es.: Bergamotto 10% DPG (Flacone n.12)...',
                    es: 'Ej.: Bergamota 10% DPG (Frasco n.º 12)...',
                    de: 'z. B. Bergamotte 10% DPG (Flasche Nr. 12)...',
                  })}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-medium text-[#575955]">
                  {t.modalTagsLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={modalTagDraft}
                    onChange={(e) => setModalTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddModalTag();
                      }
                    }}
                    placeholder={t.modalTagPlaceholder}
                    className="min-w-0 flex-1 rounded-lg border border-[#E4E4E0] px-3 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!modalTagDraft.trim()}
                    onClick={handleAddModalTag}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] disabled:opacity-40 whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    <span>{t.modalTagAddBtn}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from(
                    new Set([
                      ...mergedTags,
                      ...(form.tags || []),
                      ...STARTER_INGREDIENT_TAGS[language],
                    ])
                  ).map((tag) => {
                    const active = (form.tags || []).some(
                      (tg) => tg.toLowerCase() === tag.toLowerCase()
                    );
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleFormTag(tag)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                            : 'border-[#E4E4E0] bg-[#FAF9F8] text-[#575955] hover:text-[#181917]'
                        }`}
                      >
                        {active && <Check className="h-3 w-3 shrink-0" />}
                        <span>#{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#575955] mb-1">
                  {t.scentNotesLabel}
                </label>
                <textarea
                  rows={3}
                  value={form.olfactoryNotes}
                  onChange={(e) => setForm({ ...form, olfactoryNotes: e.target.value })}
                  placeholder={t.scentNotesPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#EAEAE6] pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#E4E4E0] px-4 py-2 text-sm font-medium text-[#181917]"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[var(--theme-accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                {editingId ? t.saveChangesBtn : t.addIngBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
