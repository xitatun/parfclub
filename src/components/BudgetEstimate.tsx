import { CheckCircle2, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  BUDGET_CATEGORY_LABELS,
  DEFAULT_VIEW_SETTINGS,
  EQUIPMENT_BOTTLE_CATEGORIES,
  formatUnit,
  getBudgetCategoryLabel,
  getCurrencySymbol,
} from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  BudgetCategory,
  Ingredient,
  MeasurementUnit,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
  ViewSettings,
} from '../types/perfume';
import { formatCurrencyDecimal, formatCurrencyRub } from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';
import { BottleCostCalculator } from './BottleCostCalculator';
import { BudgetCostCharts } from './BudgetCostCharts';
import { SolventDilutionCalculator } from './SolventDilutionCalculator';

interface BudgetEstimateProps {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  viewSettings?: ViewSettings;
  language?: AppLanguage;
  currency?: AppCurrency;
  onAddEstimateItem: (item: ProjectEstimateItem) => void;
  onDeleteEstimateItem: (id: string) => void;
  onAddPurchaseRecord: (record: PurchaseRecord) => void;
  onDeletePurchaseRecord: (id: string) => void;
  onUpdateProject?: (updated: PerfumeProject) => void;
  onToast?: (message: string) => void;
}

type BudgetSubTab = 'estimates' | 'purchases' | 'equipment_bottles' | 'calculator' | 'dilution';

interface BudgetText {
  notSpecified: string;
  pageTitle: string;
  pageDescription: string;
  tabEstimates: (n: number) => string;
  tabPurchases: (n: number) => string;
  tabEquipmentBottles: (n: number) => string;
  tabCalculator: string;
  tabDilution: string;
  kpiPlannedTitle: string;
  kpiEstimateItems: string;
  kpiActualTitle: string;
  kpiJournalRecords: string;
  kpiVarianceTitle: string;
  withinBudget: string;
  overBudget: string;
  reconciliationTitle: string;
  filterEstimatesByProject: string;
  allProjects: string;
  colProject: string;
  colIngredientItem: string;
  colPlanQty: string;
  colPlanTotal: string;
  colBoughtActual: string;
  colRemainingDiff: string;
  colStatus: string;
  colActions: string;
  atPricePrefix: string;
  needPrefix: string;
  completeStatus: string;
  coveredStatus: string;
  partialStatus: string;
  pendingStatus: string;
  logPurchaseBtn: string;
  deleteItemAria: (name: string) => string;
  noEstimateItems: string;
  quickPurchaseTitle: (name: string) => string;
  cancel: string;
  qtyWithUnit: (unit: string) => string;
  pricePerUnit: (unit: string, sym: string) => string;
  supplier: string;
  storeNamePlaceholder: string;
  purchaseDate: string;
  recordPurchaseBtn: string;
  addEstimateTitle: string;
  selectProject: string;
  chooseFromCatalog: string;
  ingOrPackPlaceholder: string;
  requiredLabel: string;
  unitLabel: string;
  planPricePerUnit: (sym: string) => string;
  commentLabel: string;
  notePlaceholder: string;
  addBtn: string;
  recordActualTitle: string;
  purchasedItemPlaceholder: string;
  purchaseCategoryAria: string;
  noProjectLink: string;
  linkToEstimate: string;
  quantityLabel: string;
  pricePerUnitShort: (sym: string) => string;
  storePlaceholder: string;
  saveBtn: string;
  masterJournalTitle: string;
  showingPurchases: (shown: number, total: number) => string;
  ingredientSearchPlaceholder: string;
  filterBySupplierAria: string;
  allSuppliers: string;
  filterByProjectAria: string;
  fromLabel: string;
  toLabel: string;
  colDate: string;
  colIngredient: string;
  colSupplier: string;
  colQty: string;
  colPriceUnit: string;
  colTotal: string;
  generalStock: string;
  deletePurchaseAria: (name: string) => string;
  noPurchasesMatch: string;
  bottlesVialsTitle: string;
  scalesEquipmentTitle: string;
  packagingCapsTitle: string;
  purchasesCountWord: string;
  logEqBottleTitle: string;
  categoryAria: string;
  eqNamePlaceholder: string;
  generalStudioOption: string;
  pricePerPiece: (sym: string) => string;
  supplierStoreLabel: string;
  supplierPlaceholder: string;
  eqNotesPlaceholder: string;
  plannedEqTitle: string;
  planWord: string;
  boughtWord: string;
  fillFormBtn: string;
  eqJournalTitle: string;
  showingRecords: (shown: number, total: number) => string;
  filterAll: string;
  filterBottles: string;
  filterEquipment: string;
  filterPackaging: string;
  searchEqPlaceholder: string;
  colItemCategory: string;
  generalStudioShort: string;
  noEqPurchases: string;
}

const BUDGET_TEXT: Record<AppLanguage, BudgetText> = {
  ru: {
    notSpecified: 'Не указан',
    pageTitle: 'Смета и журнал закупок',
    pageDescription: 'Планирование бюджета проектов, фиксация фактических покупок и сопоставление план/факт.',
    tabEstimates: (n) => `Сметы проектов (${n})`,
    tabPurchases: (n) => `Журнал покупок (${n})`,
    tabEquipmentBottles: (n) => `Оборудование и флаконы (${n})`,
    tabCalculator: 'Калькулятор флакона',
    tabDilution: 'Калькулятор растворителя',
    kpiPlannedTitle: 'План по сметам',
    kpiEstimateItems: 'позиций в смете',
    kpiActualTitle: 'Фактические закупки',
    kpiJournalRecords: 'записей в журнале',
    kpiVarianceTitle: 'Отклонение от сметы',
    withinBudget: 'В рамках сметы',
    overBudget: 'Превышение плана',
    reconciliationTitle: 'Смета и сверка закупок',
    filterEstimatesByProject: 'Фильтр сметы по проекту',
    allProjects: 'Все проекты',
    colProject: 'Проект',
    colIngredientItem: 'Ингредиент / Позиция',
    colPlanQty: 'План кол-во',
    colPlanTotal: 'План сумма',
    colBoughtActual: 'Куплено (Факт)',
    colRemainingDiff: 'Остаток / Разница',
    colStatus: 'Статус',
    colActions: 'Действия',
    atPricePrefix: 'по',
    needPrefix: 'Ещё',
    completeStatus: 'Укомплектовано',
    coveredStatus: 'Закрыто',
    partialStatus: 'Частично',
    pendingStatus: 'Ожидает закупки',
    logPurchaseBtn: 'Внести покупку',
    deleteItemAria: (name) => `Удалить позицию ${name}`,
    noEstimateItems: 'Позиций в смете пока нет. Добавьте первый пункт ниже.',
    quickPurchaseTitle: (name) => `Фиксация фактической закупки для сметы: ${name}`,
    cancel: 'Отмена',
    qtyWithUnit: (unit) => `Количество (${unit})`,
    pricePerUnit: (unit, sym) => `Цена за 1 ${unit} (${sym})`,
    supplier: 'Поставщик',
    storeNamePlaceholder: 'Название...',
    purchaseDate: 'Дата покупки',
    recordPurchaseBtn: 'Записать покупку',
    addEstimateTitle: 'Добавить позицию в смету проекта',
    selectProject: 'Выберите проект...',
    chooseFromCatalog: 'Выбрать из базы ингредиентов...',
    ingOrPackPlaceholder: 'Название ингредиента / тары...',
    requiredLabel: 'Требуется',
    unitLabel: 'Ед. изм.',
    planPricePerUnit: (sym) => `План цена/ед. (${sym})`,
    commentLabel: 'Комментарий',
    notePlaceholder: 'Пояснение...',
    addBtn: 'Добавить',
    recordActualTitle: 'Зафиксировать фактическую закупку',
    purchasedItemPlaceholder: 'Название купленной позиции *',
    purchaseCategoryAria: 'Категория закупки',
    noProjectLink: 'Без привязки к проекту (общий запас)',
    linkToEstimate: 'Связать с позицией сметы...',
    quantityLabel: 'Количество',
    pricePerUnitShort: (sym) => `Цена за ед. (${sym})`,
    storePlaceholder: 'Магазин...',
    saveBtn: 'Сохранить',
    masterJournalTitle: 'Общий журнал покупок',
    showingPurchases: (shown, total) => `Показано ${shown} из ${total} покупок · Сумма выборки: `,
    ingredientSearchPlaceholder: 'Ингредиент...',
    filterBySupplierAria: 'Фильтр по поставщику',
    allSuppliers: 'Все поставщики',
    filterByProjectAria: 'Фильтр по проекту',
    fromLabel: 'От',
    toLabel: 'До',
    colDate: 'Дата',
    colIngredient: 'Ингредиент',
    colSupplier: 'Поставщик',
    colQty: 'Кол-во',
    colPriceUnit: 'Цена/ед.',
    colTotal: 'Итого',
    generalStock: 'Общий запас',
    deletePurchaseAria: (name) => `Удалить запись о покупке ${name}`,
    noPurchasesMatch: 'По выбранным фильтрам закупок не найдено.',
    bottlesVialsTitle: 'Флаконы и фиолки',
    scalesEquipmentTitle: 'Весы и оборудование',
    packagingCapsTitle: 'Упаковка и этикетки',
    purchasesCountWord: 'закупок',
    logEqBottleTitle: 'Закупка оборудования, флаконов или упаковки',
    categoryAria: 'Категория',
    eqNamePlaceholder: 'Напр.: Флаконы 30 мл, весы 0.001 г, пипетки *',
    generalStudioOption: 'Общее для мастерской (без проекта)',
    pricePerPiece: (sym) => `Цена за шт. (${sym})`,
    supplierStoreLabel: 'Магазин / Поставщик',
    supplierPlaceholder: 'Поставщик...',
    eqNotesPlaceholder: 'Примечание (горлышко 18/415, цвет спрея, калибровка и т.п.)...',
    plannedEqTitle: 'Запланировано в сметах проектов (флаконы и оснащение)',
    planWord: 'План',
    boughtWord: 'куплено',
    fillFormBtn: 'Подставить в форму',
    eqJournalTitle: 'Закупки оборудования, флаконов и упаковки',
    showingRecords: (shown, total) => `Показано ${shown} из ${total} записей · Итого: `,
    filterAll: 'Все',
    filterBottles: 'Флаконы',
    filterEquipment: 'Оборудование',
    filterPackaging: 'Упаковка',
    searchEqPlaceholder: 'Поиск флаконов, весов, коробок...',
    colItemCategory: 'Позиция и категория',
    generalStudioShort: 'Общее оснащение',
    noEqPurchases: 'Закупок оборудования, флаконов или упаковки пока нет.',
  },
  en: {
    notSpecified: 'Not specified',
    pageTitle: 'Estimates & Purchase Journal',
    pageDescription: 'Project budget planning, actual purchase tracking, and plan vs. actual reconciliation.',
    tabEstimates: (n) => `Project Estimates (${n})`,
    tabPurchases: (n) => `Purchase Journal (${n})`,
    tabEquipmentBottles: (n) => `Equipment & Bottles (${n})`,
    tabCalculator: 'Bottle Calculator',
    tabDilution: 'Solvent Dilution',
    kpiPlannedTitle: 'Planned estimates',
    kpiEstimateItems: 'estimate items',
    kpiActualTitle: 'Actual purchases',
    kpiJournalRecords: 'journal records',
    kpiVarianceTitle: 'Budget variance',
    withinBudget: 'Within budget',
    overBudget: 'Over planned budget',
    reconciliationTitle: 'Estimates & Procurement Reconciliation',
    filterEstimatesByProject: 'Filter estimates by project',
    allProjects: 'All projects',
    colProject: 'Project',
    colIngredientItem: 'Ingredient / Item',
    colPlanQty: 'Plan qty',
    colPlanTotal: 'Plan total',
    colBoughtActual: 'Bought (Actual)',
    colRemainingDiff: 'Remaining / Diff',
    colStatus: 'Status',
    colActions: 'Actions',
    atPricePrefix: '@',
    needPrefix: 'Need',
    completeStatus: 'Complete',
    coveredStatus: 'Covered',
    partialStatus: 'Partial',
    pendingStatus: 'Pending',
    logPurchaseBtn: 'Log purchase',
    deleteItemAria: (name) => `Delete item ${name}`,
    noEstimateItems: 'No estimate items yet. Add the first item below.',
    quickPurchaseTitle: (name) => `Record actual purchase for estimate: ${name}`,
    cancel: 'Cancel',
    qtyWithUnit: (unit) => `Quantity (${unit})`,
    pricePerUnit: (unit, sym) => `Price per 1 ${unit} (${sym})`,
    supplier: 'Supplier',
    storeNamePlaceholder: 'Store name...',
    purchaseDate: 'Purchase date',
    recordPurchaseBtn: 'Record purchase',
    addEstimateTitle: 'Add item to project estimate',
    selectProject: 'Select project...',
    chooseFromCatalog: 'Choose from ingredient catalog...',
    ingOrPackPlaceholder: 'Ingredient or packaging name...',
    requiredLabel: 'Required',
    unitLabel: 'Unit',
    planPricePerUnit: (sym) => `Plan price/unit (${sym})`,
    commentLabel: 'Comment',
    notePlaceholder: 'Note...',
    addBtn: 'Add',
    recordActualTitle: 'Record Actual Purchase',
    purchasedItemPlaceholder: 'Purchased item name *',
    purchaseCategoryAria: 'Purchase category',
    noProjectLink: 'No project link (general stock)',
    linkToEstimate: 'Link to estimate item...',
    quantityLabel: 'Quantity',
    pricePerUnitShort: (sym) => `Price/unit (${sym})`,
    storePlaceholder: 'Store...',
    saveBtn: 'Save',
    masterJournalTitle: 'Master Purchase Journal',
    showingPurchases: (shown, total) => `Showing ${shown} of ${total} purchases · Filtered total: `,
    ingredientSearchPlaceholder: 'Ingredient...',
    filterBySupplierAria: 'Filter by supplier',
    allSuppliers: 'All suppliers',
    filterByProjectAria: 'Filter by project',
    fromLabel: 'From',
    toLabel: 'To',
    colDate: 'Date',
    colIngredient: 'Ingredient',
    colSupplier: 'Supplier',
    colQty: 'Qty',
    colPriceUnit: 'Price/unit',
    colTotal: 'Total',
    generalStock: 'General stock',
    deletePurchaseAria: (name) => `Delete purchase record ${name}`,
    noPurchasesMatch: 'No purchases match the selected filters.',
    bottlesVialsTitle: 'Bottles & Vials',
    scalesEquipmentTitle: 'Scales & Lab Equipment',
    packagingCapsTitle: 'Packaging, Caps & Labels',
    purchasesCountWord: 'purchases',
    logEqBottleTitle: 'Log Equipment or Bottle Purchase',
    categoryAria: 'Category',
    eqNamePlaceholder: 'e.g., 30 ml spray bottles, 0.001 g scale *',
    generalStudioOption: 'General studio / All projects',
    pricePerPiece: (sym) => `Price/unit (${sym})`,
    supplierStoreLabel: 'Supplier',
    supplierPlaceholder: 'Store...',
    eqNotesPlaceholder: 'Details (neck size 18/415, atomizer color, scale precision...)',
    plannedEqTitle: 'Planned Bottles & Equipment in Estimates',
    planWord: 'Plan',
    boughtWord: 'bought',
    fillFormBtn: 'Fill form',
    eqJournalTitle: 'Equipment, Bottles & Packaging Journal',
    showingRecords: (shown, total) => `Showing ${shown} of ${total} records · Total: `,
    filterAll: 'All',
    filterBottles: 'Bottles',
    filterEquipment: 'Equipment',
    filterPackaging: 'Packaging',
    searchEqPlaceholder: 'Search bottles, scales, boxes...',
    colItemCategory: 'Item & Category',
    generalStudioShort: 'General studio',
    noEqPurchases: 'No equipment or bottle purchases recorded yet.',
  },
  it: {
    notSpecified: 'Non specificato',
    pageTitle: 'Preventivi e Registro Acquisti',
    pageDescription: 'Pianificazione del budget dei progetti, tracciamento acquisti e confronto previsto/effettivo.',
    tabEstimates: (n) => `Preventivi progetti (${n})`,
    tabPurchases: (n) => `Registro acquisti (${n})`,
    tabEquipmentBottles: (n) => `Attrezzature e Flaconi (${n})`,
    tabCalculator: 'Calcolatore Flacone',
    tabDilution: 'Diluizione Solvente',
    kpiPlannedTitle: 'Preventivo pianificato',
    kpiEstimateItems: 'voci in preventivo',
    kpiActualTitle: 'Acquisti effettivi',
    kpiJournalRecords: 'voci a registro',
    kpiVarianceTitle: 'Scostamento budget',
    withinBudget: 'Entro il budget',
    overBudget: 'Oltre il preventivo',
    reconciliationTitle: 'Preventivi e Riconciliazione Acquisti',
    filterEstimatesByProject: 'Filtra preventivi per progetto',
    allProjects: 'Tutti i progetti',
    colProject: 'Progetto',
    colIngredientItem: 'Ingrediente / Voce',
    colPlanQty: 'Qtà prevista',
    colPlanTotal: 'Totale previsto',
    colBoughtActual: 'Acquistato (Reale)',
    colRemainingDiff: 'Residuo / Diff.',
    colStatus: 'Stato',
    colActions: 'Azioni',
    atPricePrefix: 'a',
    needPrefix: 'Mancano',
    completeStatus: 'Completo',
    coveredStatus: 'Coperto',
    partialStatus: 'Parziale',
    pendingStatus: 'In attesa',
    logPurchaseBtn: 'Registra acquisto',
    deleteItemAria: (name) => `Elimina voce ${name}`,
    noEstimateItems: 'Nessuna voce in preventivo. Aggiungi la prima voce qui sotto.',
    quickPurchaseTitle: (name) => `Registra acquisto effettivo per preventivo: ${name}`,
    cancel: 'Annulla',
    qtyWithUnit: (unit) => `Quantità (${unit})`,
    pricePerUnit: (unit, sym) => `Prezzo per 1 ${unit} (${sym})`,
    supplier: 'Fornitore',
    storeNamePlaceholder: 'Nome negozio...',
    purchaseDate: 'Data acquisto',
    recordPurchaseBtn: 'Salva acquisto',
    addEstimateTitle: 'Aggiungi voce al preventivo del progetto',
    selectProject: 'Seleziona progetto...',
    chooseFromCatalog: 'Scegli dal catalogo ingredienti...',
    ingOrPackPlaceholder: 'Nome ingrediente o flacone...',
    requiredLabel: 'Richiesto',
    unitLabel: 'Unità',
    planPricePerUnit: (sym) => `Prezzo prev./unità (${sym})`,
    commentLabel: 'Commento',
    notePlaceholder: 'Nota...',
    addBtn: 'Aggiungi',
    recordActualTitle: 'Registra Acquisto Effettivo',
    purchasedItemPlaceholder: 'Nome articolo acquistato *',
    purchaseCategoryAria: 'Categoria acquisto',
    noProjectLink: 'Nessun progetto (scorta generale)',
    linkToEstimate: 'Collega a voce di preventivo...',
    quantityLabel: 'Quantità',
    pricePerUnitShort: (sym) => `Prezzo/unità (${sym})`,
    storePlaceholder: 'Negozio...',
    saveBtn: 'Salva',
    masterJournalTitle: 'Registro Generale Acquisti',
    showingPurchases: (shown, total) => `Mostrati ${shown} di ${total} acquisti · Totale filtro: `,
    ingredientSearchPlaceholder: 'Ingrediente...',
    filterBySupplierAria: 'Filtra per fornitore',
    allSuppliers: 'Tutti i fornitori',
    filterByProjectAria: 'Filtra per progetto',
    fromLabel: 'Da',
    toLabel: 'A',
    colDate: 'Data',
    colIngredient: 'Ingrediente',
    colSupplier: 'Fornitore',
    colQty: 'Qtà',
    colPriceUnit: 'Prezzo/u.',
    colTotal: 'Totale',
    generalStock: 'Scorta generale',
    deletePurchaseAria: (name) => `Elimina acquisto ${name}`,
    noPurchasesMatch: 'Nessun acquisto corrisponde ai filtri selezionati.',
    bottlesVialsTitle: 'Flaconi e Fiale',
    scalesEquipmentTitle: 'Bilance e Attrezzature',
    packagingCapsTitle: 'Packaging, Tappi ed Etichette',
    purchasesCountWord: 'acquisti',
    logEqBottleTitle: 'Registra Acquisto Attrezzature o Flaconi',
    categoryAria: 'Categoria',
    eqNamePlaceholder: 'Es. Flaconi spray 30 ml, bilancia 0.001 g *',
    generalStudioOption: 'Generale laboratorio / Tutti i progetti',
    pricePerPiece: (sym) => `Prezzo/unità (${sym})`,
    supplierStoreLabel: 'Fornitore',
    supplierPlaceholder: 'Negozio...',
    eqNotesPlaceholder: 'Dettagli (collo 18/415, colore spray, calibrazione...)',
    plannedEqTitle: 'Flaconi e Attrezzature Pianificati nei Preventivi',
    planWord: 'Piano',
    boughtWord: 'acquistato',
    fillFormBtn: 'Compila modulo',
    eqJournalTitle: 'Registro Attrezzature, Flaconi e Packaging',
    showingRecords: (shown, total) => `Mostrate ${shown} di ${total} voci · Totale: `,
    filterAll: 'Tutti',
    filterBottles: 'Flaconi',
    filterEquipment: 'Attrezzature',
    filterPackaging: 'Packaging',
    searchEqPlaceholder: 'Cerca flaconi, bilance, scatole...',
    colItemCategory: 'Voce e Categoria',
    generalStudioShort: 'Laboratorio generale',
    noEqPurchases: 'Nessun acquisto di attrezzature o flaconi registrato.',
  },
  es: {
    notSpecified: 'No especificado',
    pageTitle: 'Presupuestos y Registro de Compras',
    pageDescription: 'Planificación del presupuesto del proyecto, seguimiento de compras reales y conciliación plan/real.',
    tabEstimates: (n) => `Presupuestos (${n})`,
    tabPurchases: (n) => `Registro de compras (${n})`,
    tabEquipmentBottles: (n) => `Equipos y Frascos (${n})`,
    tabCalculator: 'Calculadora de Frasco',
    tabDilution: 'Dilución de Solvente',
    kpiPlannedTitle: 'Presupuesto planificado',
    kpiEstimateItems: 'partidas en presupuesto',
    kpiActualTitle: 'Compras reales',
    kpiJournalRecords: 'registros en diario',
    kpiVarianceTitle: 'Desviación presupuestaria',
    withinBudget: 'Dentro del presupuesto',
    overBudget: 'Por encima del plan',
    reconciliationTitle: 'Presupuestos y Conciliación de Compras',
    filterEstimatesByProject: 'Filtrar presupuestos por proyecto',
    allProjects: 'Todos los proyectos',
    colProject: 'Proyecto',
    colIngredientItem: 'Ingrediente / Artículo',
    colPlanQty: 'Cant. plan',
    colPlanTotal: 'Total plan',
    colBoughtActual: 'Comprado (Real)',
    colRemainingDiff: 'Restante / Dif.',
    colStatus: 'Estado',
    colActions: 'Acciones',
    atPricePrefix: 'a',
    needPrefix: 'Faltan',
    completeStatus: 'Completo',
    coveredStatus: 'Cubierto',
    partialStatus: 'Parcial',
    pendingStatus: 'Pendiente',
    logPurchaseBtn: 'Registrar compra',
    deleteItemAria: (name) => `Eliminar partida ${name}`,
    noEstimateItems: 'Aún no hay partidas en el presupuesto. Añade la primera abajo.',
    quickPurchaseTitle: (name) => `Registrar compra real para presupuesto: ${name}`,
    cancel: 'Cancelar',
    qtyWithUnit: (unit) => `Cantidad (${unit})`,
    pricePerUnit: (unit, sym) => `Precio por 1 ${unit} (${sym})`,
    supplier: 'Proveedor',
    storeNamePlaceholder: 'Nombre de tienda...',
    purchaseDate: 'Fecha de compra',
    recordPurchaseBtn: 'Guardar compra',
    addEstimateTitle: 'Añadir partida al presupuesto del proyecto',
    selectProject: 'Seleccionar proyecto...',
    chooseFromCatalog: 'Elegir del catálogo de ingredientes...',
    ingOrPackPlaceholder: 'Nombre de ingrediente o envase...',
    requiredLabel: 'Requerido',
    unitLabel: 'Unidad',
    planPricePerUnit: (sym) => `Precio plan/u. (${sym})`,
    commentLabel: 'Comentario',
    notePlaceholder: 'Nota...',
    addBtn: 'Añadir',
    recordActualTitle: 'Registrar Compra Real',
    purchasedItemPlaceholder: 'Nombre del artículo comprado *',
    purchaseCategoryAria: 'Categoría de compra',
    noProjectLink: 'Sin proyecto (stock general)',
    linkToEstimate: 'Vincular a partida del presupuesto...',
    quantityLabel: 'Cantidad',
    pricePerUnitShort: (sym) => `Precio/u. (${sym})`,
    storePlaceholder: 'Tienda...',
    saveBtn: 'Guardar',
    masterJournalTitle: 'Registro General de Compras',
    showingPurchases: (shown, total) => `Mostrando ${shown} de ${total} compras · Total filtrado: `,
    ingredientSearchPlaceholder: 'Ingrediente...',
    filterBySupplierAria: 'Filtrar por proveedor',
    allSuppliers: 'Todos los proveedores',
    filterByProjectAria: 'Filtrar por proyecto',
    fromLabel: 'Desde',
    toLabel: 'Hasta',
    colDate: 'Fecha',
    colIngredient: 'Ingrediente',
    colSupplier: 'Proveedor',
    colQty: 'Cant.',
    colPriceUnit: 'Precio/u.',
    colTotal: 'Total',
    generalStock: 'Stock general',
    deletePurchaseAria: (name) => `Eliminar compra ${name}`,
    noPurchasesMatch: 'Ninguna compra coincide con los filtros.',
    bottlesVialsTitle: 'Frascos y Viales',
    scalesEquipmentTitle: 'Básculas y Equipos',
    packagingCapsTitle: 'Packaging, Tapones y Etiquetas',
    purchasesCountWord: 'compras',
    logEqBottleTitle: 'Registrar Compra de Equipo o Frascos',
    categoryAria: 'Categoría',
    eqNamePlaceholder: 'Ej.: Frascos spray 30 ml, báscula 0.001 g *',
    generalStudioOption: 'Estudio general / Todos los proyectos',
    pricePerPiece: (sym) => `Precio/u. (${sym})`,
    supplierStoreLabel: 'Proveedor',
    supplierPlaceholder: 'Tienda...',
    eqNotesPlaceholder: 'Detalles (rosca 18/415, color spray, precisión...)',
    plannedEqTitle: 'Frascos y Equipos Planificados en Presupuestos',
    planWord: 'Plan',
    boughtWord: 'comprado',
    fillFormBtn: 'Rellenar formulario',
    eqJournalTitle: 'Registro de Equipos, Frascos y Packaging',
    showingRecords: (shown, total) => `Mostrando ${shown} de ${total} registros · Total: `,
    filterAll: 'Todos',
    filterBottles: 'Frascos',
    filterEquipment: 'Equipos',
    filterPackaging: 'Packaging',
    searchEqPlaceholder: 'Buscar frascos, básculas, cajas...',
    colItemCategory: 'Artículo y Categoría',
    generalStudioShort: 'Estudio general',
    noEqPurchases: 'Aún no hay compras de equipos o frascos.',
  },
  de: {
    notSpecified: 'Nicht angegeben',
    pageTitle: 'Budget & Einkaufsjournal',
    pageDescription: 'Projektbudgetplanung, Erfassung tatsächlicher Einkäufe und Soll-Ist-Abgleich.',
    tabEstimates: (n) => `Projektbudgets (${n})`,
    tabPurchases: (n) => `Einkaufsjournal (${n})`,
    tabEquipmentBottles: (n) => `Ausrüstung & Flakons (${n})`,
    tabCalculator: 'Flakon-Rechner',
    tabDilution: 'Lösungsmittel-Rechner',
    kpiPlannedTitle: 'Geplantes Budget',
    kpiEstimateItems: 'Budgetpositionen',
    kpiActualTitle: 'Tatsächliche Einkäufe',
    kpiJournalRecords: 'Journaleinträge',
    kpiVarianceTitle: 'Budgetabweichung',
    withinBudget: 'Im Budgetrahmen',
    overBudget: 'Über dem Budget',
    reconciliationTitle: 'Budgets & Einkaufsabgleich',
    filterEstimatesByProject: 'Budgets nach Projekt filtern',
    allProjects: 'Alle Projekte',
    colProject: 'Projekt',
    colIngredientItem: 'Inhaltsstoff / Position',
    colPlanQty: 'Soll-Menge',
    colPlanTotal: 'Soll-Summe',
    colBoughtActual: 'Gekauft (Ist)',
    colRemainingDiff: 'Rest / Diff.',
    colStatus: 'Status',
    colActions: 'Aktionen',
    atPricePrefix: 'à',
    needPrefix: 'Noch',
    completeStatus: 'Vollständig',
    coveredStatus: 'Gedeckt',
    partialStatus: 'Teilweise',
    pendingStatus: 'Ausstehend',
    logPurchaseBtn: 'Kauf erfassen',
    deleteItemAria: (name) => `Position ${name} löschen`,
    noEstimateItems: 'Noch keine Budgetpositionen. Unten erste Position hinzufügen.',
    quickPurchaseTitle: (name) => `Tatsächlichen Kauf für Budget erfassen: ${name}`,
    cancel: 'Abbrechen',
    qtyWithUnit: (unit) => `Menge (${unit})`,
    pricePerUnit: (unit, sym) => `Preis pro 1 ${unit} (${sym})`,
    supplier: 'Lieferant',
    storeNamePlaceholder: 'Shopname...',
    purchaseDate: 'Kaufdatum',
    recordPurchaseBtn: 'Kauf speichern',
    addEstimateTitle: 'Position zum Projektbudget hinzufügen',
    selectProject: 'Projekt wählen...',
    chooseFromCatalog: 'Aus Zutatenkatalog wählen...',
    ingOrPackPlaceholder: 'Name der Zutat / Verpackung...',
    requiredLabel: 'Benötigt',
    unitLabel: 'Einheit',
    planPricePerUnit: (sym) => `Soll-Preis/Einh. (${sym})`,
    commentLabel: 'Kommentar',
    notePlaceholder: 'Notiz...',
    addBtn: 'Hinzufügen',
    recordActualTitle: 'Tatsächlichen Kauf erfassen',
    purchasedItemPlaceholder: 'Name des gekauften Artikels *',
    purchaseCategoryAria: 'Einkaufskategorie',
    noProjectLink: 'Kein Projektbezug (Allg. Bestand)',
    linkToEstimate: 'Mit Budgetposition verknüpfen...',
    quantityLabel: 'Menge',
    pricePerUnitShort: (sym) => `Preis/Einh. (${sym})`,
    storePlaceholder: 'Shop...',
    saveBtn: 'Speichern',
    masterJournalTitle: 'Gesamtes Einkaufsjournal',
    showingPurchases: (shown, total) => `${shown} von ${total} Einkäufen angezeigt · Filter-Summe: `,
    ingredientSearchPlaceholder: 'Inhaltsstoff...',
    filterBySupplierAria: 'Nach Lieferant filtern',
    allSuppliers: 'Alle Lieferanten',
    filterByProjectAria: 'Nach Projekt filtern',
    fromLabel: 'Von',
    toLabel: 'Bis',
    colDate: 'Datum',
    colIngredient: 'Inhaltsstoff',
    colSupplier: 'Lieferant',
    colQty: 'Menge',
    colPriceUnit: 'Preis/Einh.',
    colTotal: 'Gesamt',
    generalStock: 'Allgemeiner Bestand',
    deletePurchaseAria: (name) => `Kaufeintrag ${name} löschen`,
    noPurchasesMatch: 'Keine Einkäufe entsprechen den Filtern.',
    bottlesVialsTitle: 'Flakons & Phiolen',
    scalesEquipmentTitle: 'Waagen & Laborausrüstung',
    packagingCapsTitle: 'Verpackung, Kappen & Etiketten',
    purchasesCountWord: 'Einkäufe',
    logEqBottleTitle: 'Ausrüstung oder Flakons erfassen',
    categoryAria: 'Kategorie',
    eqNamePlaceholder: 'z. B. 30 ml Sprühflakons, 0,001 g Waage *',
    generalStudioOption: 'Allgemeines Studio / Alle Projekte',
    pricePerPiece: (sym) => `Preis/Stk. (${sym})`,
    supplierStoreLabel: 'Lieferant / Shop',
    supplierPlaceholder: 'Shop...',
    eqNotesPlaceholder: 'Details (Gewinde 18/415, Zerstäuberfarbe, Kalibrierung...)',
    plannedEqTitle: 'Geplante Flakons & Ausrüstung in Budgets',
    planWord: 'Plan',
    boughtWord: 'gekauft',
    fillFormBtn: 'Formular füllen',
    eqJournalTitle: 'Journal für Ausrüstung, Flakons & Verpackung',
    showingRecords: (shown, total) => `${shown} von ${total} Einträgen · Gesamt: `,
    filterAll: 'Alle',
    filterBottles: 'Flakons',
    filterEquipment: 'Ausrüstung',
    filterPackaging: 'Verpackung',
    searchEqPlaceholder: 'Flakons, Waagen, Schachteln suchen...',
    colItemCategory: 'Artikel & Kategorie',
    generalStudioShort: 'Allgemeines Studio',
    noEqPurchases: 'Noch keine Käufe von Ausrüstung oder Flakons erfasst.',
  },
};

export function BudgetEstimate({
  projects,
  ingredients,
  estimates,
  purchases,
  viewSettings = DEFAULT_VIEW_SETTINGS,
  language = 'ru',
  currency = 'RUB',
  onAddEstimateItem,
  onDeleteEstimateItem,
  onAddPurchaseRecord,
  onDeletePurchaseRecord,
  onUpdateProject,
  onToast,
}: BudgetEstimateProps) {
  const t = BUDGET_TEXT[language];
  const currencySymbol = getCurrencySymbol(currency);
  const [subTab, setSubTab] = useState<BudgetSubTab>('estimates');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Add Estimate Item Form
  const [estProjId, setEstProjId] = useState(projects[0]?.id || '');
  const [estIngId, setEstIngId] = useState('');
  const [estName, setEstName] = useState('');
  const [estCategory, setEstCategory] = useState<BudgetCategory>('raw_materials');
  const [estQty, setEstQty] = useState('10');
  const [estUnit, setEstUnit] = useState<MeasurementUnit>('г');
  const [estUnitPrice, setEstUnitPrice] = useState('0');
  const [estNotes, setEstNotes] = useState('');

  // Quick Purchase against Estimate
  const [quickEstimateId, setQuickEstimateId] = useState<string | null>(null);
  const [qpQty, setQpQty] = useState('');
  const [qpUnitPrice, setQpUnitPrice] = useState('');
  const [qpSupplier, setQpSupplier] = useState('');
  const [qpDate, setQpDate] = useState(todayIsoDate());

  // Purchase Journal Filters
  const [filterIngredient, setFilterIngredient] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // New Purchase Journal Form
  const [purIngId, setPurIngId] = useState('');
  const [purName, setPurName] = useState('');
  const [purCategory, setPurCategory] = useState<BudgetCategory>('raw_materials');
  const [purProjectId, setPurProjectId] = useState('');
  const [purEstimateId, setPurEstimateId] = useState('');
  const [purQty, setPurQty] = useState('10');
  const [purUnit, setPurUnit] = useState<MeasurementUnit>('г');
  const [purUnitPrice, setPurUnitPrice] = useState('0');
  const [purSupplier, setPurSupplier] = useState('');
  const [purDate, setPurDate] = useState(todayIsoDate());
  const [purNotes, setPurNotes] = useState('');

  // Equipment & Bottles Tab State
  const [eqCategoryFilter, setEqCategoryFilter] = useState<'all' | 'glassware' | 'equipment' | 'packaging'>('all');
  const [eqSearch, setEqSearch] = useState('');
  const [eqSupplierFilter, setEqSupplierFilter] = useState('all');
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState<'glassware' | 'equipment' | 'packaging'>('glassware');
  const [eqProjectId, setEqProjectId] = useState('');
  const [eqQty, setEqQty] = useState('10');
  const [eqUnit, setEqUnit] = useState<MeasurementUnit>('шт');
  const [eqUnitPrice, setEqUnitPrice] = useState('0');
  const [eqSupplier, setEqSupplier] = useState('');
  const [eqDate, setEqDate] = useState(todayIsoDate());
  const [eqNotes, setEqNotes] = useState('');

  const projectMap = useMemo(() => {
    const map: Record<string, PerfumeProject> = {};
    for (const p of projects) map[p.id] = p;
    return map;
  }, [projects]);

  const estimateMap = useMemo(() => {
    const map: Record<string, ProjectEstimateItem> = {};
    for (const e of estimates) map[e.id] = e;
    return map;
  }, [estimates]);

  const resolvePurchaseCategory = (rec: PurchaseRecord): BudgetCategory => {
    if (rec.category) return rec.category;
    if (rec.estimateItemId && estimateMap[rec.estimateItemId]) {
      return estimateMap[rec.estimateItemId].category;
    }
    return 'raw_materials';
  };

  const filteredEstimates = useMemo(() => {
    if (selectedProjectId === 'all') return estimates;
    return estimates.filter((e) => e.projectId === selectedProjectId);
  }, [estimates, selectedProjectId]);

  const uniqueSuppliers = useMemo(() => {
    const set = new Set<string>();
    for (const p of purchases) {
      if (p.supplier.trim()) set.add(p.supplier.trim());
    }
    return Array.from(set).sort();
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    const qIng = filterIngredient.trim().toLowerCase();
    return purchases
      .filter((p) => {
        if (qIng && !p.ingredientName.toLowerCase().includes(qIng)) return false;
        if (filterSupplier !== 'all' && p.supplier !== filterSupplier) return false;
        if (filterProject !== 'all' && p.projectId !== filterProject) return false;
        if (filterDateFrom && p.date < filterDateFrom) return false;
        if (filterDateTo && p.date > filterDateTo) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [purchases, filterIngredient, filterSupplier, filterProject, filterDateFrom, filterDateTo]);

  const equipmentBottlePurchasesAll = useMemo(() => {
    return purchases.filter((p) => {
      const cat = p.category || (p.estimateItemId ? estimateMap[p.estimateItemId]?.category : undefined);
      return cat ? EQUIPMENT_BOTTLE_CATEGORIES.includes(cat) : false;
    });
  }, [purchases, estimateMap]);

  const filteredEquipmentBottlePurchases = useMemo(() => {
    const q = eqSearch.trim().toLowerCase();
    return equipmentBottlePurchasesAll
      .filter((p) => {
        const cat = p.category || (p.estimateItemId ? estimateMap[p.estimateItemId]?.category : undefined);
        if (eqCategoryFilter !== 'all' && cat !== eqCategoryFilter) return false;
        if (eqSupplierFilter !== 'all' && p.supplier !== eqSupplierFilter) return false;
        if (q && !p.ingredientName.toLowerCase().includes(q) && !(p.notes || '').toLowerCase().includes(q)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [equipmentBottlePurchasesAll, estimateMap, eqCategoryFilter, eqSupplierFilter, eqSearch]);

  const equipmentSummary = useMemo(() => {
    let glasswareSum = 0;
    let glasswareCount = 0;
    let equipmentSum = 0;
    let equipmentCount = 0;
    let packagingSum = 0;
    let packagingCount = 0;

    for (const p of equipmentBottlePurchasesAll) {
      const cat = p.category || (p.estimateItemId ? estimateMap[p.estimateItemId]?.category : undefined);
      if (cat === 'glassware') {
        glasswareSum += p.totalCost;
        glasswareCount++;
      } else if (cat === 'equipment') {
        equipmentSum += p.totalCost;
        equipmentCount++;
      } else if (cat === 'packaging') {
        packagingSum += p.totalCost;
        packagingCount++;
      }
    }

    const suppliers = Array.from(
      new Set(equipmentBottlePurchasesAll.map((p) => p.supplier.trim()).filter(Boolean))
    ).sort();

    return {
      glasswareSum,
      glasswareCount,
      equipmentSum,
      equipmentCount,
      packagingSum,
      packagingCount,
      totalSum: glasswareSum + equipmentSum + packagingSum,
      suppliers,
    };
  }, [equipmentBottlePurchasesAll, estimateMap]);

  const equipmentEstimates = useMemo(
    () => estimates.filter((e) => EQUIPMENT_BOTTLE_CATEGORIES.includes(e.category)),
    [estimates]
  );

  const overviewMetrics = useMemo(() => {
    const relevantEstimates =
      selectedProjectId === 'all'
        ? estimates
        : estimates.filter((e) => e.projectId === selectedProjectId);
    const relevantPurchases =
      selectedProjectId === 'all'
        ? purchases
        : purchases.filter((p) => p.projectId === selectedProjectId);

    const plannedSum = relevantEstimates.reduce(
      (s, e) => s + e.requiredQuantity * e.estimatedUnitPrice,
      0
    );
    const actualSum = relevantPurchases.reduce((s, p) => s + p.totalCost, 0);
    const filteredPurchasesSum = filteredPurchases.reduce((s, p) => s + p.totalCost, 0);

    return {
      plannedSum,
      actualSum,
      variance: actualSum - plannedSum,
      filteredPurchasesSum,
    };
  }, [estimates, purchases, selectedProjectId, filteredPurchases]);

  const handleSelectEstIng = (ingId: string) => {
    setEstIngId(ingId);
    const ing = ingredients.find((i) => i.id === ingId);
    if (!ing) return;
    setEstName(ing.name);
    setEstCategory(ing.tier === 'solvent' ? 'solvent' : 'raw_materials');
    setEstQty(String(ing.quantityGrams));
    setEstUnit(ing.unit);
    const uPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setEstUnitPrice(uPrice.toFixed(2));
  };

  const handleAddEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estName.trim() || !estProjId) return;
    onAddEstimateItem({
      id: generateId('est'),
      projectId: estProjId,
      ingredientId: estIngId || undefined,
      ingredientName: estName.trim(),
      category: estCategory,
      requiredQuantity: Math.max(0, Number(estQty) || 0),
      unit: estUnit,
      estimatedUnitPrice: Math.max(0, Number(estUnitPrice) || 0),
      notes: estNotes.trim() || undefined,
    });
    setEstIngId('');
    setEstName('');
    setEstNotes('');
  };

  const handleSelectPurIng = (ingId: string) => {
    setPurIngId(ingId);
    const ing = ingredients.find((i) => i.id === ingId);
    if (!ing) return;
    setPurName(ing.name);
    setPurCategory(ing.tier === 'solvent' ? 'solvent' : 'raw_materials');
    setPurQty(String(ing.quantityGrams));
    setPurUnit(ing.unit);
    const uPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setPurUnitPrice(uPrice.toFixed(2));
    setPurSupplier(ing.supplier || '');
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purName.trim()) return;
    const qty = Math.max(0, Number(purQty) || 0);
    const unitPrice = Math.max(0, Number(purUnitPrice) || 0);
    const linkedEst = purEstimateId ? estimateMap[purEstimateId] : undefined;
    onAddPurchaseRecord({
      id: generateId('pur'),
      date: purDate || todayIsoDate(),
      ingredientName: purName.trim(),
      category: linkedEst?.category || purCategory,
      ingredientId: purIngId || undefined,
      projectId: purProjectId || undefined,
      estimateItemId: purEstimateId || undefined,
      quantity: qty,
      unit: purUnit,
      unitPrice,
      totalCost: Number((qty * unitPrice).toFixed(2)),
      supplier: purSupplier.trim() || t.notSpecified,
      notes: purNotes.trim() || undefined,
    });
    setPurIngId('');
    setPurName('');
    setPurEstimateId('');
    setPurNotes('');
  };

  const handleAddEquipmentBottlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName.trim()) return;
    const qty = Math.max(0, Number(eqQty) || 0);
    const unitPrice = Math.max(0, Number(eqUnitPrice) || 0);
    onAddPurchaseRecord({
      id: generateId('pur'),
      date: eqDate || todayIsoDate(),
      ingredientName: eqName.trim(),
      category: eqCategory,
      projectId: eqProjectId || undefined,
      quantity: qty,
      unit: eqUnit,
      unitPrice,
      totalCost: Number((qty * unitPrice).toFixed(2)),
      supplier: eqSupplier.trim() || t.notSpecified,
      notes: eqNotes.trim() || undefined,
    });
    setEqName('');
    setEqNotes('');
  };

  const openQuickPurchase = (item: ProjectEstimateItem) => {
    setQuickEstimateId(item.id);
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
      category: item.category,
      ingredientId: item.ingredientId,
      projectId: item.projectId,
      estimateItemId: item.id,
      quantity: qty,
      unit: item.unit,
      unitPrice: uPrice,
      totalCost: Number((qty * uPrice).toFixed(2)),
      supplier: qpSupplier.trim() || t.notSpecified,
    });
    setQuickEstimateId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#181917] whitespace-nowrap">
            {t.pageTitle}
          </h1>
          {viewSettings.showPageDescriptions && (
            <p className="mt-1 text-sm text-[#575955] whitespace-nowrap">
              {t.pageDescription}
            </p>
          )}
        </div>

        {/* Sub-view Switcher */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1 w-fit">
          <button
            type="button"
            onClick={() => setSubTab('estimates')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'estimates'
                ? 'bg-white text-[#181917] shadow-xs'
                : 'text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tabEstimates(estimates.length)}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('purchases')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'purchases'
                ? 'bg-white text-[#181917] shadow-xs'
                : 'text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tabPurchases(purchases.length)}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('equipment_bottles')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'equipment_bottles'
                ? 'bg-white text-[#181917] shadow-xs'
                : 'text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tabEquipmentBottles(equipmentBottlePurchasesAll.length)}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('calculator')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'calculator'
                ? 'bg-white text-[#181917] shadow-xs'
                : 'text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tabCalculator}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('dilution')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'dilution'
                ? 'bg-white text-[#181917] shadow-xs'
                : 'text-[#575955] hover:text-[#181917]'
            }`}
          >
            {t.tabDilution}
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
          <div className="text-xs text-[#6B6D68]">
            {t.kpiPlannedTitle}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
            {formatCurrencyRub(overviewMetrics.plannedSum, language, currency)}
          </div>
          <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
            {filteredEstimates.length} {t.kpiEstimateItems}
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
          <div className="text-xs text-[#6B6D68]">
            {t.kpiActualTitle}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--theme-accent)]">
            {formatCurrencyRub(overviewMetrics.actualSum, language, currency)}
          </div>
          <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
            {purchases.length} {t.kpiJournalRecords}
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
          <div className="text-xs text-[#6B6D68]">
            {t.kpiVarianceTitle}
          </div>
          <div
            className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${
              overviewMetrics.variance > 0 ? 'text-[#B91C1C]' : 'text-[#15803D]'
            }`}
          >
            {overviewMetrics.variance > 0 ? '+' : ''}
            {formatCurrencyRub(overviewMetrics.variance, language, currency)}
          </div>
          <div className="mt-1 text-xs text-[#6B6D68]">
            {overviewMetrics.variance <= 0 ? t.withinBudget : t.overBudget}
          </div>
        </div>
      </div>

      {/* Recharts Cost Distribution Visualization */}
      {subTab !== 'calculator' && subTab !== 'dilution' && (
        <BudgetCostCharts
          projects={projects}
          estimates={estimates}
          purchases={purchases}
          selectedProjectId={selectedProjectId}
          onChangeProjectFilter={setSelectedProjectId}
          language={language}
          currency={currency}
        />
      )}

      {/* SUB-TAB 1: PROJECT ESTIMATES & RECONCILIATION */}
      {subTab === 'estimates' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                  {t.reconciliationTitle}
                </h2>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  aria-label={t.filterEstimatesByProject}
                  className="rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  <option value="all">{t.allProjects}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                    <th className="py-2.5 pr-3">{t.colProject}</th>
                    <th className="py-2.5 px-2">{t.colIngredientItem}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPlanQty}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPlanTotal}</th>
                    <th className="py-2.5 px-2 text-right">
                      {t.colBoughtActual}
                    </th>
                    <th className="py-2.5 px-2 text-right">
                      {t.colRemainingDiff}
                    </th>
                    <th className="py-2.5 px-2">{t.colStatus}</th>
                    <th className="py-2.5 pl-2 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE6]">
                  {filteredEstimates.map((item) => {
                    const proj = projectMap[item.projectId];
                    const matched = purchases.filter(
                      (p) =>
                        p.estimateItemId === item.id ||
                        (p.projectId === item.projectId &&
                          item.ingredientId &&
                          p.ingredientId === item.ingredientId)
                    );
                    const boughtQty = matched.reduce((s, p) => s + p.quantity, 0);
                    const boughtSum = matched.reduce((s, p) => s + p.totalCost, 0);
                    const plannedSum = item.requiredQuantity * item.estimatedUnitPrice;
                    const remainingQty = Math.max(0, item.requiredQuantity - boughtQty);
                    const isCovered = boughtQty >= item.requiredQuantity && item.requiredQuantity > 0;
                    const isPartial = boughtQty > 0 && !isCovered;
                    const unitLabel = formatUnit(item.unit, language);

                    return (
                      <tr key={item.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-3 pr-3 text-xs">
                          <span className="font-mono font-medium text-[#181917]">
                            {proj?.code || '—'}
                          </span>
                          <div className="text-[11px] text-[#6B6D68] truncate max-w-[140px]">
                            {proj?.title}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-[#181917]">{item.ingredientName}</div>
                          <div className="text-[11px] text-[#6B6D68]">
                            {getBudgetCategoryLabel(item.category, language)}
                            {item.notes ? ` · ${item.notes}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums">
                          {item.requiredQuantity} {unitLabel}
                          <div className="text-[11px] text-[#6B6D68]">
                            {t.atPricePrefix}{' '}
                            {formatCurrencyDecimal(item.estimatedUnitPrice, language, currency)}
                          </div>
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
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {remainingQty > 0
                            ? `${t.needPrefix} ${remainingQty} ${unitLabel}`
                            : boughtSum > plannedSum
                              ? `+${formatCurrencyRub(boughtSum - plannedSum, language, currency)}`
                              : t.completeStatus}
                        </td>
                        <td className="py-3 px-2 text-xs whitespace-nowrap">
                          {isCovered ? (
                            <span className="inline-flex items-center gap-1 font-medium text-[#15803D]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {t.coveredStatus}
                            </span>
                          ) : isPartial ? (
                            <span className="font-medium text-[#B45309]">
                              {t.partialStatus}
                            </span>
                          ) : (
                            <span className="text-[#6B6D68]">
                              {t.pendingStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-2 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openQuickPurchase(item)}
                              className="inline-flex items-center gap-1 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F7F7F5]"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>{t.logPurchaseBtn}</span>
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

                  {filteredEstimates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-[#787A74]">
                        {t.noEstimateItems}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Purchase Inline Drawer */}
            {quickEstimateId && (
              <div className="rounded-lg border border-[var(--theme-accent)]/30 bg-[var(--theme-accent)]/5 p-4 space-y-3">
                {(() => {
                  const target = estimates.find((e) => e.id === quickEstimateId);
                  if (!target) return null;
                  const targetUnit = formatUnit(target.unit, language);
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#181917]">
                          {t.quickPurchaseTitle(target.ingredientName)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuickEstimateId(null)}
                          className="text-xs text-[#575955] hover:text-[#181917]"
                        >
                          {t.cancel}
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
                            {t.supplier}
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
                            {t.purchaseDate}
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
                          {t.recordPurchaseBtn}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Add Estimate Line Form */}
            <form
              onSubmit={handleAddEstimate}
              className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-3"
            >
              <div className="text-xs font-semibold text-[#181917]">
                {t.addEstimateTitle}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={estProjId}
                  onChange={(e) => setEstProjId(e.target.value)}
                  required
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
                >
                  <option value="">{t.selectProject}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.title}
                    </option>
                  ))}
                </select>
                <select
                  value={estIngId}
                  onChange={(e) => handleSelectEstIng(e.target.value)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#3F413D]"
                >
                  <option value="">
                    {t.chooseFromCatalog}
                  </option>
                  {ingredients.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={estName}
                  onChange={(e) => setEstName(e.target.value)}
                  placeholder={t.ingOrPackPlaceholder}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
                />
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value as BudgetCategory)}
                  className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
                >
                  {(Object.keys(BUDGET_CATEGORY_LABELS) as BudgetCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {getBudgetCategoryLabel(cat, language)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 items-end">
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
                    {t.planPricePerUnit(currencySymbol)}
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
                <div>
                  <label className="block text-[11px] text-[#6B6D68] mb-1">
                    {t.commentLabel}
                  </label>
                  <input
                    type="text"
                    value={estNotes}
                    onChange={(e) => setEstNotes(e.target.value)}
                    placeholder={t.notePlaceholder}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.addBtn}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* SUB-TAB 2: MASTER PURCHASE JOURNAL */}
      {subTab === 'purchases' && (
        <div className="space-y-6">
          {/* Add Purchase Form */}
          <form
            onSubmit={handleAddPurchase}
            className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#181917]">
              {t.recordActualTitle}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <select
                value={purIngId}
                onChange={(e) => handleSelectPurIng(e.target.value)}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#3F413D]"
              >
                <option value="">
                  {t.chooseFromCatalog}
                </option>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={purName}
                onChange={(e) => setPurName(e.target.value)}
                placeholder={t.purchasedItemPlaceholder}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              />
              <select
                value={purCategory}
                onChange={(e) => setPurCategory(e.target.value as BudgetCategory)}
                aria-label={t.purchaseCategoryAria}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              >
                {(Object.keys(BUDGET_CATEGORY_LABELS) as BudgetCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {getBudgetCategoryLabel(cat, language)}
                  </option>
                ))}
              </select>
              <select
                value={purProjectId}
                onChange={(e) => {
                  setPurProjectId(e.target.value);
                  setPurEstimateId('');
                }}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              >
                <option value="">
                  {t.noProjectLink}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
              <select
                value={purEstimateId}
                onChange={(e) => {
                  const eid = e.target.value;
                  setPurEstimateId(eid);
                  const est = estimateMap[eid];
                  if (est) setPurCategory(est.category);
                }}
                disabled={!purProjectId}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] disabled:bg-[#F7F7F5] disabled:text-[#8B8D87]"
              >
                <option value="">
                  {t.linkToEstimate}
                </option>
                {estimates
                  .filter((e) => e.projectId === purProjectId)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.ingredientName} ({e.requiredQuantity} {formatUnit(e.unit, language)})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end">
              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.quantityLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  required
                  value={purQty}
                  onChange={(e) => setPurQty(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.unitLabel}
                </label>
                <select
                  value={purUnit}
                  onChange={(e) => setPurUnit(e.target.value as MeasurementUnit)}
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
                  {t.pricePerUnitShort(currencySymbol)}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  required
                  value={purUnitPrice}
                  onChange={(e) => setPurUnitPrice(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.supplier}
                </label>
                <input
                  type="text"
                  required
                  value={purSupplier}
                  onChange={(e) => setPurSupplier(e.target.value)}
                  placeholder={t.storePlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.purchaseDate}
                </label>
                <input
                  type="date"
                  value={purDate}
                  onChange={(e) => setPurDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  {t.saveBtn} (
                  {formatCurrencyRub(
                    (Number(purQty) || 0) * (Number(purUnitPrice) || 0),
                    language,
                    currency
                  )})
                </span>
              </button>
            </div>
          </form>

          {/* Master Purchase Journal with Multi-Filter */}
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                  {t.masterJournalTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68] tabular-nums">
                  {t.showingPurchases(filteredPurchases.length, purchases.length)}
                  <strong className="text-[#181917]">
                    {formatCurrencyRub(overviewMetrics.filteredPurchasesSum, language, currency)}
                  </strong>
                </p>
              </div>
            </div>

            {/* Filter Bar: Date Range, Supplier, Ingredient, Project */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                <input
                  type="text"
                  value={filterIngredient}
                  onChange={(e) => setFilterIngredient(e.target.value)}
                  placeholder={t.ingredientSearchPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white py-1.5 pl-8 pr-3 text-xs"
                />
              </div>

              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                aria-label={t.filterBySupplierAria}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917]"
              >
                <option value="all">{t.allSuppliers}</option>
                {uniqueSuppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>

              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                aria-label={t.filterByProjectAria}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917]"
              >
                <option value="all">{t.allProjects}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#6B6D68] shrink-0">
                  {t.fromLabel}
                </span>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#6B6D68] shrink-0">
                  {t.toLabel}
                </span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                    <th className="py-2.5 pr-3">{t.colDate}</th>
                    <th className="py-2.5 px-2">{t.colIngredient}</th>
                    <th className="py-2.5 px-2">{t.colSupplier}</th>
                    <th className="py-2.5 px-2">{t.colProject}</th>
                    <th className="py-2.5 px-2 text-right">{t.colQty}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPriceUnit}</th>
                    <th className="py-2.5 px-2 text-right">{t.colTotal}</th>
                    <th className="py-2.5 pl-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE6]">
                  {filteredPurchases.map((rec) => {
                    const proj = rec.projectId ? projectMap[rec.projectId] : undefined;
                    return (
                      <tr key={rec.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-3 pr-3 font-mono text-xs tabular-nums text-[#575955]">
                          {rec.date}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-[#181917]">{rec.ingredientName}</div>
                          <div className="text-[11px] text-[#6B6D68]">
                            {getBudgetCategoryLabel(resolvePurchaseCategory(rec), language)}
                            {rec.notes ? ` · ${rec.notes}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-[#3F413D]">{rec.supplier}</td>
                        <td className="py-3 px-2 text-xs text-[#575955]">
                          {proj ? `${proj.code} · ${proj.title}` : t.generalStock}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums">
                          {rec.quantity} {formatUnit(rec.unit, language)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {formatCurrencyDecimal(rec.unitPrice, language, currency)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs font-semibold tabular-nums text-[#181917]">
                          {formatCurrencyRub(rec.totalCost, language, currency)}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => onDeletePurchaseRecord(rec.id)}
                            className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                            aria-label={t.deletePurchaseAria(rec.ingredientName)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredPurchases.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-[#787A74]">
                        {t.noPurchasesMatch}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* SUB-TAB 3: EQUIPMENT & BOTTLES PURCHASES */}
      {subTab === 'equipment_bottles' && (
        <div className="space-y-6">
          {/* Category Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.bottlesVialsTitle}
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyRub(equipmentSummary.glasswareSum, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {equipmentSummary.glasswareCount} {t.purchasesCountWord}
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.scalesEquipmentTitle}
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyRub(equipmentSummary.equipmentSum, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {equipmentSummary.equipmentCount} {t.purchasesCountWord}
              </div>
            </div>

            <div className="rounded-xl border border-[#E4E4E0] bg-white p-5">
              <div className="text-xs text-[#6B6D68]">
                {t.packagingCapsTitle}
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
                {formatCurrencyRub(equipmentSummary.packagingSum, language, currency)}
              </div>
              <div className="mt-1 text-xs text-[#6B6D68] tabular-nums">
                {equipmentSummary.packagingCount} {t.purchasesCountWord}
              </div>
            </div>
          </div>

          {/* Add Equipment / Bottle Purchase Form */}
          <form
            onSubmit={handleAddEquipmentBottlePurchase}
            className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#181917]">
              {t.logEqBottleTitle}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={eqCategory}
                onChange={(e) =>
                  setEqCategory(e.target.value as 'glassware' | 'equipment' | 'packaging')
                }
                aria-label={t.categoryAria}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              >
                <option value="glassware">{getBudgetCategoryLabel('glassware', language)}</option>
                <option value="equipment">{getBudgetCategoryLabel('equipment', language)}</option>
                <option value="packaging">{getBudgetCategoryLabel('packaging', language)}</option>
              </select>

              <input
                type="text"
                required
                value={eqName}
                onChange={(e) => setEqName(e.target.value)}
                placeholder={t.eqNamePlaceholder}
                className="lg:col-span-2 rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              />

              <select
                value={eqProjectId}
                onChange={(e) => setEqProjectId(e.target.value)}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917]"
              >
                <option value="">
                  {t.generalStudioOption}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end">
              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.quantityLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  required
                  value={eqQty}
                  onChange={(e) => setEqQty(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.unitLabel}
                </label>
                <select
                  value={eqUnit}
                  onChange={(e) => setEqUnit(e.target.value as MeasurementUnit)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                >
                  {(['шт', 'мл', 'г', 'кг'] as MeasurementUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {formatUnit(u, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.pricePerPiece(currencySymbol)}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  required
                  value={eqUnitPrice}
                  onChange={(e) => setEqUnitPrice(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 font-mono text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.supplierStoreLabel}
                </label>
                <input
                  type="text"
                  required
                  value={eqSupplier}
                  onChange={(e) => setEqSupplier(e.target.value)}
                  placeholder={t.supplierPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#6B6D68] mb-1">
                  {t.purchaseDate}
                </label>
                <input
                  type="date"
                  value={eqDate}
                  onChange={(e) => setEqDate(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-2 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  {t.addBtn} (
                  {formatCurrencyRub(
                    (Number(eqQty) || 0) * (Number(eqUnitPrice) || 0),
                    language,
                    currency
                  )})
                </span>
              </button>
            </div>

            <input
              type="text"
              value={eqNotes}
              onChange={(e) => setEqNotes(e.target.value)}
              placeholder={t.eqNotesPlaceholder}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
            />
          </form>

          {/* Planned Equipment & Bottle Estimates */}
          {equipmentEstimates.length > 0 && (
            <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAEAE6] pb-3">
                <h3 className="text-sm font-semibold text-[#181917]">
                  {t.plannedEqTitle}
                </h3>
              </div>
              <div className="divide-y divide-[#EAEAE6]">
                {equipmentEstimates.map((est) => {
                  const proj = projectMap[est.projectId];
                  const boughtQty = purchases
                    .filter((p) => p.estimateItemId === est.id)
                    .reduce((s, p) => s + p.quantity, 0);
                  const covered = boughtQty >= est.requiredQuantity && est.requiredQuantity > 0;
                  return (
                    <div
                      key={est.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-2.5 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-[#181917]">{est.ingredientName}</div>
                        <div className="text-[11px] text-[#6B6D68] tabular-nums">
                          {proj ? `${proj.code} · ${proj.title}` : '—'} ·{' '}
                          {getBudgetCategoryLabel(est.category, language)} · {t.planWord}:{' '}
                          {est.requiredQuantity} {formatUnit(est.unit, language)} ({t.boughtWord}:{' '}
                          {boughtQty})
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-medium ${
                            covered ? 'text-[#15803D]' : 'text-[#6B6D68]'
                          }`}
                        >
                          {covered ? t.coveredStatus : t.pendingStatus}
                        </span>
                        {!covered && (
                          <button
                            type="button"
                            onClick={() => {
                              setEqName(est.ingredientName);
                              setEqCategory(
                                est.category === 'equipment' || est.category === 'packaging'
                                  ? est.category
                                  : 'glassware'
                              );
                              setEqProjectId(est.projectId);
                              setEqQty(String(Math.max(1, est.requiredQuantity - boughtQty)));
                              setEqUnit(est.unit);
                              setEqUnitPrice(String(est.estimatedUnitPrice));
                            }}
                            className="rounded border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1 text-xs font-medium text-[var(--theme-accent)] hover:bg-white"
                          >
                            {t.fillFormBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Equipment & Bottles Purchases Table */}
          <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#181917]">
                  {t.eqJournalTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[#6B6D68] tabular-nums">
                  {t.showingRecords(filteredEquipmentBottlePurchases.length, equipmentBottlePurchasesAll.length)}
                  <strong className="text-[#181917]">
                    {formatCurrencyRub(
                      filteredEquipmentBottlePurchases.reduce((s, p) => s + p.totalCost, 0),
                      language,
                      currency
                    )}
                  </strong>
                </p>
              </div>

              {/* Filter by subtype */}
              <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1 w-fit">
                {(
                  [
                    { id: 'all', label: t.filterAll },
                    { id: 'glassware', label: t.filterBottles },
                    { id: 'equipment', label: t.filterEquipment },
                    { id: 'packaging', label: t.filterPackaging },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEqCategoryFilter(tab.id)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                      eqCategoryFilter === tab.id
                        ? 'bg-white text-[#181917] shadow-xs'
                        : 'text-[#575955] hover:text-[#181917]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Supplier Filter */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                <input
                  type="text"
                  value={eqSearch}
                  onChange={(e) => setEqSearch(e.target.value)}
                  placeholder={t.searchEqPlaceholder}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white py-1.5 pl-8 pr-3 text-xs"
                />
              </div>

              <select
                value={eqSupplierFilter}
                onChange={(e) => setEqSupplierFilter(e.target.value)}
                aria-label={t.filterBySupplierAria}
                className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917]"
              >
                <option value="all">{t.allSuppliers}</option>
                {equipmentSummary.suppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                    <th className="py-2.5 pr-3">{t.colDate}</th>
                    <th className="py-2.5 px-2">{t.colItemCategory}</th>
                    <th className="py-2.5 px-2">{t.colSupplier}</th>
                    <th className="py-2.5 px-2">{t.colProject}</th>
                    <th className="py-2.5 px-2 text-right">{t.colQty}</th>
                    <th className="py-2.5 px-2 text-right">{t.colPriceUnit}</th>
                    <th className="py-2.5 px-2 text-right">{t.colTotal}</th>
                    <th className="py-2.5 pl-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE6]">
                  {filteredEquipmentBottlePurchases.map((rec) => {
                    const proj = rec.projectId ? projectMap[rec.projectId] : undefined;
                    const cat = resolvePurchaseCategory(rec);
                    return (
                      <tr key={rec.id} className="hover:bg-[#FAFBF9]">
                        <td className="py-3 pr-3 font-mono text-xs tabular-nums text-[#575955]">
                          {rec.date}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-[#181917]">{rec.ingredientName}</div>
                          <div className="text-[11px] text-[#6B6D68]">
                            {getBudgetCategoryLabel(cat, language)}
                            {rec.notes ? ` · ${rec.notes}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-[#3F413D]">{rec.supplier}</td>
                        <td className="py-3 px-2 text-xs text-[#575955]">
                          {proj ? `${proj.code} · ${proj.title}` : t.generalStudioShort}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums">
                          {rec.quantity} {formatUnit(rec.unit, language)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs tabular-nums text-[#575955]">
                          {formatCurrencyDecimal(rec.unitPrice, language, currency)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs font-semibold tabular-nums text-[#181917]">
                          {formatCurrencyRub(rec.totalCost, language, currency)}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => onDeletePurchaseRecord(rec.id)}
                            className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                            aria-label={t.deletePurchaseAria(rec.ingredientName)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEquipmentBottlePurchases.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-sm text-[#787A74]">
                        {t.noEqPurchases}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* SUB-TAB 4: INTERACTIVE BOTTLE COST CALCULATOR */}
      {subTab === 'calculator' && (
        <BottleCostCalculator
          projects={projects}
          ingredients={ingredients}
          language={language}
          currency={currency}
          onUpdateProject={onUpdateProject}
          onAppliedToast={onToast}
        />
      )}

      {/* SUB-TAB 5: SOLVENT & CONCENTRATION DILUTION CALCULATOR */}
      {subTab === 'dilution' && (
        <SolventDilutionCalculator
          projects={projects}
          ingredients={ingredients}
          language={language}
          onUpdateProject={onUpdateProject}
          onAppliedToast={onToast}
        />
      )}
    </div>
  );
}
