import { History, Layers, Minus, Plus, Redo2, Undo2, X } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BudgetEstimate } from './components/BudgetEstimate';
import { ConfirmModal } from './components/ConfirmModal';
import { IngredientDilutionCalculator } from './components/IngredientDilutionCalculator';
import { IngredientQuickSearchModal } from './components/IngredientQuickSearchModal';
import { IngredientsCatalog } from './components/IngredientsCatalog';
import { IngredientsFilterPane } from './components/IngredientsFilterPane';
import type {
  PdfExportJob,
  ProjectPdfSectionKey,
} from './components/PdfDocumentSheets';
import { OfflineIndicator } from './components/PWAInstallButton';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectHistoryPane } from './components/ProjectHistoryPane';
import { ProjectsOverview } from './components/ProjectsOverview';
import { ProjectTabsBar } from './components/ProjectTabsBar';
import { SalesStatistics } from './components/SalesStatistics';
import { StudioStatistics } from './components/StudioStatistics';
import type { CartAddPayload } from './components/SuggestedComponentsModal';
import { type BackstageTab, WordFileBackstage } from './components/WordFileBackstage';
import { WordRibbon } from './components/WordRibbon';

const PdfDocumentSheets = lazy(() =>
  import('./components/PdfDocumentSheets').then((m) => ({ default: m.PdfDocumentSheets }))
);
const PdfProjectPagesModal = lazy(() =>
  import('./components/PdfProjectPagesModal').then((m) => ({ default: m.PdfProjectPagesModal }))
);
import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_BOTTLE_VOLUMES_ML,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_INGREDIENT_FILTERS,
  DEFAULT_VIEW_SETTINGS,
  EMPTY_PROFILE,
} from './data/constants';
import { tr, UI_TEXT } from './data/i18n';
import { resolveIfraStandard } from './data/ifraStandards';
import {
  buildScaledFormulaComponents,
  type StarterFormulaSpec,
} from './data/starterFormulasData';
import { useUndoRedo } from './hooks/useUndoRedo';
import type {
  AppLanguage,
  AppSection,
  AppSettings,
  FormulaComponent,
  Ingredient,
  IngredientFilters,
  LibraryIngredient,
  MacerationBatch,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectTab,
  PurchaseRecord,
  SaleRecord,
  ViewSettings,
} from './types/perfume';
import {
  getIngredientStockGrams,
  getIntlLocale,
  getMacerationStatus,
  isIngredientRunningLow,
} from './utils/calculations';
import {
  buildBackupPayload,
  buildProjectWordHtml,
  buildSingleProjectPayload,
  generateId,
  loadInitialData,
  loadSeedStudioSnapshot,
  localizeSeedSnapshot,
  parseImportedFile,
  saveEstimates,
  saveIngredients,
  saveLibrary,
  saveProjects,
  savePurchases,
  saveSales,
  todayIsoDate,
} from './utils/storage';

interface StudioSnapshot {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  library: LibraryIngredient[];
}

type ConfirmState =
  | { type: 'project'; id: string; label: string }
  | { type: 'ingredient'; id: string; label: string }
  | { type: 'estimate'; id: string; label: string }
  | { type: 'purchase'; id: string; label: string }
  | { type: 'sale'; id: string; label: string }
  | { type: 'library'; id: string; label: string }
  | { type: 'reset_demo'; label: string }
  | { type: 'clear_formula'; projectId: string; variantId: string | null; label: string }
  | null;

interface AppText {
  gUnit: string;
  standardViewRestored: string;
  focusModeEnabled: string;
  viewSettingsReset: string;
  changeUndone: string;
  changeRestored: string;
  macerationChecked: string;
  macerationStarted: string;
  macerationRemoved: string;
  newFragranceTitle: (n: number) => string;
  createdProject: (code: string) => string;
  version2: string;
  duplicatedProject: (title: string) => string;
  savedProjectFile: (title: string) => string;
  savedWordDoc: (title: string) => string;
  savedPdfBrief: (title: string) => string;
  savedScreenshotPdf: string;
  screenshotFailed: string;
  exportedIngredientsExcel: string;
  exportedSalesExcel: string;
  savedBackup: string;
  unsupportedFileFormat: string;
  openedProject: (title: string) => string;
  backupRestored: string;
  failedReadJson: string;
  fallbackThisProject: string;
  projectDeleted: string;
  ingredientDeleted: string;
  estimateDeleted: string;
  purchaseDeleted: string;
  saleDeleted: string;
  libraryDeleted: string;
  demoResetDone: string;
  darkModeEnabled: string;
  lightModeEnabled: string;
  saleRecorded: string;
  importedSalesCount: (count: number) => string;
  fallbackSaleRecord: string;
  libraryAdded: (name: string) => string;
  fallbackLibraryItem: string;
  addedToWishlist: (name: string) => string;
  selectedIngredient: (name: string) => string;
  addedIngredientToFormula: (name: string, code: string) => string;
  estimateItemAddedToProject: string;
  fallbackBudgetItem: string;
  purchaseSaved: string;
  ingredientAdded: (name: string) => string;
  ingredientUpdated: string;
  fallbackIngredient: string;
  movedToStockAndLogged: string;
  ingredientAddedToBudget: string;
  budgetItemAdded: string;
  purchaseLogged: string;
  fallbackPurchaseRecord: string;
  zoomOutAria: string;
  zoomSliderAria: string;
  zoomInAria: string;
  languageSelected: string;
  currencyUpdated: (cur: string) => string;
  themeColorUpdated: string;
  resetDemoLabel: string;
  confirmResetTitle: string;
  confirmDeleteTitle: string;
  confirmResetDesc: string;
  confirmDeleteDesc: (label: string) => string;
  resetBtn: string;
  deleteBtn: string;
  cancelBtn: string;
}

const APP_TEXT: Record<AppLanguage, AppText> = {
  ru: {
    gUnit: 'г',
    standardViewRestored: 'Стандартный вид восстановлен',
    focusModeEnabled: 'Включён режим «Чистый лист»',
    viewSettingsReset: 'Настройки вида сброшены',
    changeUndone: 'Изменение отменено',
    changeRestored: 'Изменение возвращено',
    macerationChecked: 'Уведомление о мацерации отмечено проверенным',
    macerationStarted: 'Таймер мацерации запущен',
    macerationRemoved: 'Таймер мацерации удалён',
    newFragranceTitle: (n) => `Новый аромат ${n}`,
    createdProject: (code) => `Создан проект ${code}`,
    version2: 'Версия 2',
    duplicatedProject: (title) => `Создана копия проекта «${title}»`,
    savedProjectFile: (title) => `Файл проекта «${title}» сохранён`,
    savedWordDoc: (title) => `Документ Word «${title}.doc» сохранён`,
    savedPdfBrief: (title) => `PDF-документ «${title}» сохранён`,
    savedScreenshotPdf: 'Многолистовой PDF-документ без интерфейса сохранён',
    screenshotFailed: 'Не удалось сформировать PDF — попробуйте системную печать',
    exportedIngredientsExcel: 'Список ингредиентов сохранён в Excel (.xlsx)',
    exportedSalesExcel: 'Статистика продаж сохранена в Excel (.xlsx)',
    savedBackup: 'Резервная копия всей мастерской (.json) сохранена',
    unsupportedFileFormat: 'Неподдерживаемый формат файла. Нужен .json из «Ателье Эссенций»',
    openedProject: (title) => `Открыт проект «${title}»`,
    backupRestored: 'Данные мастерской восстановлены из файла',
    failedReadJson: 'Не удалось прочитать JSON-файл',
    fallbackThisProject: 'этот проект',
    projectDeleted: 'Проект удалён (можно отменить)',
    ingredientDeleted: 'Ингредиент удалён (можно отменить)',
    estimateDeleted: 'Позиция сметы удалена (можно отменить)',
    purchaseDeleted: 'Запись покупки удалена (можно отменить)',
    saleDeleted: 'Запись продажи удалена (можно отменить)',
    libraryDeleted: 'Ингредиент удалён из библиотеки (можно отменить)',
    demoResetDone: 'Мастерская сброшена к демо-данным',
    darkModeEnabled: 'Включена тёмная тема',
    lightModeEnabled: 'Включена светлая тема',
    saleRecorded: 'Продажа записана в журнал',
    importedSalesCount: (count) => `Импортировано продаж из Excel: ${count}`,
    fallbackSaleRecord: 'запись о продаже',
    libraryAdded: (name) => `Ингредиент «${name}» добавлен в библиотеку`,
    fallbackLibraryItem: 'ингредиент из библиотеки',
    addedToWishlist: (name) => `Ингредиент «${name}» добавлен в список покупок`,
    selectedIngredient: (name) => `Выбран ингредиент: ${name}`,
    addedIngredientToFormula: (name, code) => `Ингредиент «${name}» добавлен в формулу ${code}`,
    estimateItemAddedToProject: 'Позиция добавлена в смету проекта',
    fallbackBudgetItem: 'позицию сметы',
    purchaseSaved: 'Закупка сохранена в журнал',
    ingredientAdded: (name) => `Ингредиент «${name}» добавлен`,
    ingredientUpdated: 'Карточка ингредиента обновлена',
    fallbackIngredient: 'ингредиент',
    movedToStockAndLogged: 'Ингредиент перенесён в наличие и записан в журнал покупок',
    ingredientAddedToBudget: 'Ингредиент добавлен в смету проекта',
    budgetItemAdded: 'Позиция добавлена в смету',
    purchaseLogged: 'Покупка записана в журнал',
    fallbackPurchaseRecord: 'запись о покупке',
    zoomOutAria: 'Уменьшить масштаб страницы',
    zoomSliderAria: 'Ползунок масштаба страницы',
    zoomInAria: 'Увеличить масштаб страницы',
    languageSelected: 'Язык: Русский',
    currencyUpdated: (cur) => `Валюта: ${cur}`,
    themeColorUpdated: 'Цвет темы обновлён',
    resetDemoLabel: 'Сброс к демонстрационным данным',
    confirmResetTitle: 'Сбросить данные мастерской?',
    confirmDeleteTitle: 'Подтвердите удаление',
    confirmResetDesc:
      'Все текущие изменения будут заменены стартовыми примерами проектов и ингредиентов. При необходимости сначала сохраните резервную копию.',
    confirmDeleteDesc: (label) =>
      `Вы действительно хотите удалить «${label}»? После удаления действие можно отменить кнопкой «Отменить».`,
    resetBtn: 'Сбросить',
    deleteBtn: 'Удалить',
    cancelBtn: 'Отмена',
  },
  en: {
    gUnit: 'g',
    standardViewRestored: 'Standard view restored',
    focusModeEnabled: 'Focus mode enabled',
    viewSettingsReset: 'View settings reset',
    changeUndone: 'Change undone',
    changeRestored: 'Change restored',
    macerationChecked: 'Maceration marked as checked',
    macerationStarted: 'Maceration timer started',
    macerationRemoved: 'Maceration timer removed',
    newFragranceTitle: (n) => `New Fragrance ${n}`,
    createdProject: (code) => `Created project ${code}`,
    version2: 'Version 2',
    duplicatedProject: (title) => `Created copy of "${title}"`,
    savedProjectFile: (title) => `Project file "${title}" saved`,
    savedWordDoc: (title) => `Word document "${title}.doc" saved`,
    savedPdfBrief: (title) => `PDF dossier "${title}" saved`,
    savedScreenshotPdf: 'Clean multi-sheet PDF document saved',
    screenshotFailed: 'Could not generate PDF — try system print',
    exportedIngredientsExcel: 'Ingredients list exported to Excel (.xlsx)',
    exportedSalesExcel: 'Sales statistics exported to Excel (.xlsx)',
    savedBackup: 'Full studio backup (.json) saved',
    unsupportedFileFormat: 'Unsupported file format. Expected an Atelier Essences .json file',
    openedProject: (title) => `Opened project "${title}"`,
    backupRestored: 'Studio backup restored from file',
    failedReadJson: 'Failed to read JSON file',
    fallbackThisProject: 'this project',
    projectDeleted: 'Project deleted (undo available)',
    ingredientDeleted: 'Ingredient deleted (undo available)',
    estimateDeleted: 'Budget item deleted (undo available)',
    purchaseDeleted: 'Purchase log deleted (undo available)',
    saleDeleted: 'Sale record deleted (undo available)',
    libraryDeleted: 'Library ingredient deleted (undo available)',
    demoResetDone: 'Studio reset to demo data',
    darkModeEnabled: 'Dark mode enabled',
    lightModeEnabled: 'Light mode enabled',
    saleRecorded: 'Sale recorded',
    importedSalesCount: (count) => `Imported ${count} sales from Excel`,
    fallbackSaleRecord: 'sale record',
    libraryAdded: (name) => `Added "${name}" to Library`,
    fallbackLibraryItem: 'library ingredient',
    addedToWishlist: (name) => `Added "${name}" to Studio Wishlist`,
    selectedIngredient: (name) => `Selected ingredient: ${name}`,
    addedIngredientToFormula: (name, code) => `Added "${name}" to ${code}`,
    estimateItemAddedToProject: 'Item added to project budget',
    fallbackBudgetItem: 'budget item',
    purchaseSaved: 'Purchase saved to journal',
    ingredientAdded: (name) => `Ingredient "${name}" added`,
    ingredientUpdated: 'Ingredient updated',
    fallbackIngredient: 'ingredient',
    movedToStockAndLogged: 'Ingredient moved to stock and logged in purchases',
    ingredientAddedToBudget: 'Ingredient added to project budget',
    budgetItemAdded: 'Item added to budget',
    purchaseLogged: 'Purchase logged in journal',
    fallbackPurchaseRecord: 'purchase record',
    zoomOutAria: 'Zoom out page',
    zoomSliderAria: 'Page zoom slider',
    zoomInAria: 'Zoom in page',
    languageSelected: 'Interface language: English',
    currencyUpdated: (cur) => `Currency: ${cur}`,
    themeColorUpdated: 'Theme color updated',
    resetDemoLabel: 'Demo studio reset',
    confirmResetTitle: 'Reset studio to demo data?',
    confirmDeleteTitle: 'Confirm deletion',
    confirmResetDesc:
      'All local edits will be replaced with the initial sample projects and raw materials. Consider creating a backup first.',
    confirmDeleteDesc: (label) =>
      `Are you sure you want to delete "${label}"? You can undo this action later with the Undo button.`,
    resetBtn: 'Reset',
    deleteBtn: 'Delete',
    cancelBtn: 'Cancel',
  },
  it: {
    gUnit: 'g',
    standardViewRestored: 'Vista standard ripristinata',
    focusModeEnabled: 'Modalità lettura attivata',
    viewSettingsReset: 'Impostazioni vista ripristinate',
    changeUndone: 'Modifica annullata',
    changeRestored: 'Modifica ripristinata',
    macerationChecked: 'Avviso di macerazione segnato come verificato',
    macerationStarted: 'Timer di macerazione avviato',
    macerationRemoved: 'Timer di macerazione rimosso',
    newFragranceTitle: (n) => `Nuova fragranza ${n}`,
    createdProject: (code) => `Creato progetto ${code}`,
    version2: 'Versione 2',
    duplicatedProject: (title) => `Creata copia di "${title}"`,
    savedProjectFile: (title) => `File progetto "${title}" salvato`,
    savedWordDoc: (title) => `Documento Word "${title}.doc" salvato`,
    savedPdfBrief: (title) => `Documento PDF "${title}" salvato`,
    savedScreenshotPdf: 'Documento PDF multipagina senza interfaccia salvato',
    screenshotFailed: 'Impossibile generare il PDF — prova stampa di sistema',
    exportedIngredientsExcel: 'Elenco ingredienti esportato in Excel (.xlsx)',
    exportedSalesExcel: 'Statistiche vendite esportate in Excel (.xlsx)',
    savedBackup: 'Backup completo dell’atelier (.json) salvato',
    unsupportedFileFormat: 'Formato file non supportato. È richiesto un file .json di Atelier Essences',
    openedProject: (title) => `Aperto progetto "${title}"`,
    backupRestored: 'Dati dell’atelier ripristinati dal file',
    failedReadJson: 'Impossibile leggere il file JSON',
    fallbackThisProject: 'questo progetto',
    projectDeleted: 'Progetto eliminato (annullabile)',
    ingredientDeleted: 'Ingrediente eliminato (annullabile)',
    estimateDeleted: 'Voce di preventivo eliminata (annullabile)',
    purchaseDeleted: 'Acquisto eliminato (annullabile)',
    saleDeleted: 'Vendita eliminata (annullabile)',
    libraryDeleted: 'Ingrediente rimosso dalla libreria (annullabile)',
    demoResetDone: 'Atelier ripristinato ai dati demo',
    darkModeEnabled: 'Tema scuro attivato',
    lightModeEnabled: 'Tema chiaro attivato',
    saleRecorded: 'Vendita registrata nel giornale',
    importedSalesCount: (count) => `Importate ${count} vendite da Excel`,
    fallbackSaleRecord: 'registrazione vendita',
    libraryAdded: (name) => `"${name}" aggiunto alla libreria`,
    fallbackLibraryItem: 'ingrediente della libreria',
    addedToWishlist: (name) => `"${name}" aggiunto alla lista desideri`,
    selectedIngredient: (name) => `Ingrediente selezionato: ${name}`,
    addedIngredientToFormula: (name, code) => `"${name}" aggiunto alla formula ${code}`,
    estimateItemAddedToProject: 'Voce aggiunta al preventivo del progetto',
    fallbackBudgetItem: 'voce di preventivo',
    purchaseSaved: 'Acquisto salvato nel giornale',
    ingredientAdded: (name) => `Ingrediente "${name}" aggiunto`,
    ingredientUpdated: 'Scheda ingrediente aggiornata',
    fallbackIngredient: 'ingrediente',
    movedToStockAndLogged: 'Ingrediente spostato in magazzino e registrato negli acquisti',
    ingredientAddedToBudget: 'Ingrediente aggiunto al preventivo del progetto',
    budgetItemAdded: 'Voce aggiunta al preventivo',
    purchaseLogged: 'Acquisto registrato nel giornale',
    fallbackPurchaseRecord: 'registrazione acquisto',
    zoomOutAria: 'Riduci zoom pagina',
    zoomSliderAria: 'Cursore zoom pagina',
    zoomInAria: 'Aumenta zoom pagina',
    languageSelected: 'Lingua interfaccia: Italiano',
    currencyUpdated: (cur) => `Valuta: ${cur}`,
    themeColorUpdated: 'Colore tema aggiornato',
    resetDemoLabel: 'Ripristino dati demo atelier',
    confirmResetTitle: 'Ripristinare i dati demo?',
    confirmDeleteTitle: 'Conferma eliminazione',
    confirmResetDesc:
      'Tutte le modifiche locali saranno sostituite dai progetti e materiali di esempio iniziali. Valuta di salvare prima un backup.',
    confirmDeleteDesc: (label) =>
      `Vuoi davvero eliminare "${label}"? Potrai annullare in seguito con il pulsante Annulla.`,
    resetBtn: 'Ripristina',
    deleteBtn: 'Elimina',
    cancelBtn: 'Annulla',
  },
  es: {
    gUnit: 'g',
    standardViewRestored: 'Vista estándar restaurada',
    focusModeEnabled: 'Modo lectura activado',
    viewSettingsReset: 'Ajustes de vista restablecidos',
    changeUndone: 'Cambio deshecho',
    changeRestored: 'Cambio rehecho',
    macerationChecked: 'Maceración marcada como revisada',
    macerationStarted: 'Temporizador de maceración iniciado',
    macerationRemoved: 'Temporizador de maceración eliminado',
    newFragranceTitle: (n) => `Nueva fragancia ${n}`,
    createdProject: (code) => `Proyecto ${code} creado`,
    version2: 'Versión 2',
    duplicatedProject: (title) => `Copia creada de "${title}"`,
    savedProjectFile: (title) => `Archivo de proyecto "${title}" guardado`,
    savedWordDoc: (title) => `Documento Word "${title}.doc" guardado`,
    savedPdfBrief: (title) => `Documento PDF "${title}" guardado`,
    savedScreenshotPdf: 'Documento PDF multipágina sin interfaz guardado',
    screenshotFailed: 'No se pudo generar el PDF — prueba impresión del sistema',
    exportedIngredientsExcel: 'Lista de ingredientes exportada a Excel (.xlsx)',
    exportedSalesExcel: 'Estadísticas de ventas exportadas a Excel (.xlsx)',
    savedBackup: 'Copia de seguridad del taller (.json) guardada',
    unsupportedFileFormat: 'Formato no compatible. Se esperaba un archivo .json de Atelier Essences',
    openedProject: (title) => `Proyecto "${title}" abierto`,
    backupRestored: 'Datos del taller restaurados desde el archivo',
    failedReadJson: 'No se pudo leer el archivo JSON',
    fallbackThisProject: 'este proyecto',
    projectDeleted: 'Proyecto eliminado (se puede deshacer)',
    ingredientDeleted: 'Ingrediente eliminado (se puede deshacer)',
    estimateDeleted: 'Elemento del presupuesto eliminado (se puede deshacer)',
    purchaseDeleted: 'Compra eliminada (se puede deshacer)',
    saleDeleted: 'Venta eliminada (se puede deshacer)',
    libraryDeleted: 'Ingrediente eliminado de la biblioteca (se puede deshacer)',
    demoResetDone: 'Taller restablecido a los datos de demostración',
    darkModeEnabled: 'Modo oscuro activado',
    lightModeEnabled: 'Modo claro activado',
    saleRecorded: 'Venta registrada en el diario',
    importedSalesCount: (count) => `${count} ventas importadas desde Excel`,
    fallbackSaleRecord: 'registro de venta',
    libraryAdded: (name) => `"${name}" añadido a la biblioteca`,
    fallbackLibraryItem: 'ingrediente de la biblioteca',
    addedToWishlist: (name) => `"${name}" añadido a la lista de deseos`,
    selectedIngredient: (name) => `Ingrediente seleccionado: ${name}`,
    addedIngredientToFormula: (name, code) => `"${name}" añadido a la fórmula ${code}`,
    estimateItemAddedToProject: 'Elemento añadido al presupuesto del proyecto',
    fallbackBudgetItem: 'elemento del presupuesto',
    purchaseSaved: 'Compra guardada en el diario',
    ingredientAdded: (name) => `Ingrediente "${name}" añadido`,
    ingredientUpdated: 'Ficha de ingrediente actualizada',
    fallbackIngredient: 'ingrediente',
    movedToStockAndLogged: 'Ingrediente movido a inventario y registrado en compras',
    ingredientAddedToBudget: 'Ingrediente añadido al presupuesto del proyecto',
    budgetItemAdded: 'Elemento añadido al presupuesto',
    purchaseLogged: 'Compra registrada en el diario',
    fallbackPurchaseRecord: 'registro de compra',
    zoomOutAria: 'Alejar página',
    zoomSliderAria: 'Control deslizante de zoom',
    zoomInAria: 'Acercar página',
    languageSelected: 'Idioma de la interfaz: Español',
    currencyUpdated: (cur) => `Moneda: ${cur}`,
    themeColorUpdated: 'Color del tema actualizado',
    resetDemoLabel: 'Restablecimiento a datos demo',
    confirmResetTitle: '¿Restablecer datos de demostración?',
    confirmDeleteTitle: 'Confirmar eliminación',
    confirmResetDesc:
      'Todos los cambios locales se reemplazarán por los proyectos y materias primas de ejemplo iniciales. Considera crear primero una copia de seguridad.',
    confirmDeleteDesc: (label) =>
      `¿Seguro que deseas eliminar "${label}"? Podrás deshacerlo después con el botón Deshacer.`,
    resetBtn: 'Restablecer',
    deleteBtn: 'Eliminar',
    cancelBtn: 'Cancelar',
  },
  de: {
    gUnit: 'g',
    standardViewRestored: 'Standardansicht wiederhergestellt',
    focusModeEnabled: 'Fokusmodus aktiviert',
    viewSettingsReset: 'Ansichtseinstellungen zurückgesetzt',
    changeUndone: 'Änderung rückgängig gemacht',
    changeRestored: 'Änderung wiederhergestellt',
    macerationChecked: 'Mazeration als geprüft markiert',
    macerationStarted: 'Mazerationstimer gestartet',
    macerationRemoved: 'Mazerationstimer entfernt',
    newFragranceTitle: (n) => `Neuer Duft ${n}`,
    createdProject: (code) => `Projekt ${code} erstellt`,
    version2: 'Version 2',
    duplicatedProject: (title) => `Kopie von "${title}" erstellt`,
    savedProjectFile: (title) => `Projektdatei "${title}" gespeichert`,
    savedWordDoc: (title) => `Word-Dokument "${title}.doc" gespeichert`,
    savedPdfBrief: (title) => `PDF-Dokument "${title}" gespeichert`,
    savedScreenshotPdf: 'Sauberes mehrseitiges PDF-Dokument gespeichert',
    screenshotFailed: 'PDF-Erstellung fehlgeschlagen — Systemdruck verwenden',
    exportedIngredientsExcel: 'Rohstoffliste nach Excel (.xlsx) exportiert',
    exportedSalesExcel: 'Verkaufsstatistik nach Excel (.xlsx) exportiert',
    savedBackup: 'Vollständiges Atelier-Backup (.json) gespeichert',
    unsupportedFileFormat: 'Nicht unterstütztes Dateiformat. Erwartet wird eine Atelier-Essences-.json-Datei',
    openedProject: (title) => `Projekt "${title}" geöffnet`,
    backupRestored: 'Atelierdaten aus Datei wiederhergestellt',
    failedReadJson: 'JSON-Datei konnte nicht gelesen werden',
    fallbackThisProject: 'dieses Projekt',
    projectDeleted: 'Projekt gelöscht (Rückgängig verfügbar)',
    ingredientDeleted: 'Rohstoff gelöscht (Rückgängig verfügbar)',
    estimateDeleted: 'Budgetposten gelöscht (Rückgängig verfügbar)',
    purchaseDeleted: 'Einkaufseintrag gelöscht (Rückgängig verfügbar)',
    saleDeleted: 'Verkaufseintrag gelöscht (Rückgängig verfügbar)',
    libraryDeleted: 'Bibliotheks-Rohstoff gelöscht (Rückgängig verfügbar)',
    demoResetDone: 'Atelier auf Demodaten zurückgesetzt',
    darkModeEnabled: 'Dunkler Modus aktiviert',
    lightModeEnabled: 'Heller Modus aktiviert',
    saleRecorded: 'Verkauf im Journal erfasst',
    importedSalesCount: (count) => `${count} Verkäufe aus Excel importiert`,
    fallbackSaleRecord: 'Verkaufseintrag',
    libraryAdded: (name) => `"${name}" zur Bibliothek hinzugefügt`,
    fallbackLibraryItem: 'Bibliotheks-Rohstoff',
    addedToWishlist: (name) => `"${name}" zur Wunschliste hinzugefügt`,
    selectedIngredient: (name) => `Ausgewählter Rohstoff: ${name}`,
    addedIngredientToFormula: (name, code) => `"${name}" zur Formel ${code} hinzugefügt`,
    estimateItemAddedToProject: 'Posten zum Projektbudget hinzugefügt',
    fallbackBudgetItem: 'Budgetposten',
    purchaseSaved: 'Einkauf im Journal gespeichert',
    ingredientAdded: (name) => `Rohstoff "${name}" hinzugefügt`,
    ingredientUpdated: 'Rohstoffkarte aktualisiert',
    fallbackIngredient: 'Rohstoff',
    movedToStockAndLogged: 'Rohstoff in Bestand übernommen und im Einkauf erfasst',
    ingredientAddedToBudget: 'Rohstoff zum Projektbudget hinzugefügt',
    budgetItemAdded: 'Posten zum Budget hinzugefügt',
    purchaseLogged: 'Einkauf im Journal erfasst',
    fallbackPurchaseRecord: 'Einkaufseintrag',
    zoomOutAria: 'Seite verkleinern',
    zoomSliderAria: 'Seitenzoom-Regler',
    zoomInAria: 'Seite vergrößern',
    languageSelected: 'Oberflächensprache: Deutsch',
    currencyUpdated: (cur) => `Währung: ${cur}`,
    themeColorUpdated: 'Akzentfarbe aktualisiert',
    resetDemoLabel: 'Auf Demodaten zurücksetzen',
    confirmResetTitle: 'Auf Demodaten zurücksetzen?',
    confirmDeleteTitle: 'Löschen bestätigen',
    confirmResetDesc:
      'Alle lokalen Änderungen werden durch die anfänglichen Beispielprojekte und Rohstoffe ersetzt. Erstellen Sie ggf. vorher ein Backup.',
    confirmDeleteDesc: (label) =>
      `Möchten Sie "${label}" wirklich löschen? Sie können dies später mit Rückgängig widerrufen.`,
    resetBtn: 'Zurücksetzen',
    deleteBtn: 'Löschen',
    cancelBtn: 'Abbrechen',
  },
};

function readInitialAppSettings(): AppSettings {
  try {
    const saved = localStorage.getItem('atelier_essences_app_settings_v1');
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AppSettings>;
      return {
        ...DEFAULT_APP_SETTINGS,
        ...parsed,
        criticalStockGrams:
          typeof parsed.criticalStockGrams === 'number' && parsed.criticalStockGrams > 0
            ? parsed.criticalStockGrams
            : DEFAULT_APP_SETTINGS.criticalStockGrams,
        defaultConcentrateGrams:
          typeof parsed.defaultConcentrateGrams === 'number' && parsed.defaultConcentrateGrams > 0
            ? parsed.defaultConcentrateGrams
            : DEFAULT_APP_SETTINGS.defaultConcentrateGrams,
        bottleVolumesMl:
          Array.isArray(parsed.bottleVolumesMl) &&
          parsed.bottleVolumesMl.some((v) => typeof v === 'number' && Number.isFinite(v) && v > 0)
            ? Array.from(
                new Set(
                  parsed.bottleVolumesMl
                    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0)
                    .map((v) => Math.round(v))
                )
              ).sort((a, b) => a - b)
            : DEFAULT_BOTTLE_VOLUMES_ML,
        homeSections: {
          ...DEFAULT_HOME_SECTIONS,
          ...(parsed.homeSections || {}),
        },
      };
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_APP_SETTINGS;
}

function ensureIngredientsInLibrary(
  ings: Ingredient[],
  currentLibrary: LibraryIngredient[]
): LibraryIngredient[] {
  const existingNames = new Set(
    currentLibrary.map((l) => (l.name || '').trim().toLowerCase())
  );
  const toAdd: LibraryIngredient[] = [];
  for (const ing of ings) {
    const normalized = (ing.name || '').trim().toLowerCase();
    if (!normalized || existingNames.has(normalized)) continue;
    existingNames.add(normalized);
    const createdDate = ing.createdAt || todayIsoDate();
    toAdd.push({
      id: `lib-auto-${ing.id}`,
      name: ing.name.trim(),
      inciOrCas: ing.inciOrCas || '',
      family: ing.family,
      tier: ing.tier,
      origin: ing.origin,
      blotterLongevity: ing.longevityLabel || undefined,
      scentDescription: ing.olfactoryNotes || '',
      properties: ing.bottleLabel
        ? `Подпись на бутылке: ${ing.bottleLabel}`
        : ing.longevityLabel
          ? `Стойкость: ${ing.longevityLabel}`
          : '',
      scentRating: 4,
      futureIdeasRating: 4,
      notes: [],
      createdAt: createdDate,
      updatedAt: createdDate,
    });
  }
  return toAdd.length > 0 ? [...toAdd, ...currentLibrary] : currentLibrary;
}

export default function App() {
  const initialAppSettings = useMemo(() => readInitialAppSettings(), []);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const initialData = useMemo(() => {
    const loaded = loadInitialData(initialAppSettings.language);
    return {
      ...loaded,
      library: ensureIngredientsInLibrary(loaded.ingredients, loaded.library),
    };
  }, [initialAppSettings.language]);

  const {
    state: studio,
    setState: commitStudio,
    undo,
    redo,
    jumpToPast,
    jumpToFuture,
    resetHistory,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    pastStates,
    futureStates,
  } = useUndoRedo<StudioSnapshot>(initialData, 60);

  const { projects, ingredients, estimates, purchases, sales, library } = studio;

  const [activeSection, setActiveSection] = useState<AppSection>('projects');
  // Start on File -> Home backstage page
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<ProjectTab>('formula');
  const [openProjectTabs, setOpenProjectTabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_essences_open_tabs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = new Set(initialData.projects.map((p) => p.id));
          return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
        }
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });
  const [projectTabById, setProjectTabById] = useState<Record<string, ProjectTab>>({});
  const [fileBackstageOpen, setFileBackstageOpen] = useState(true);
  const [fileBackstageTab, setFileBackstageTab] = useState<BackstageTab>('home');

  const t = APP_TEXT[appSettings.language];

  const [viewSettings, setViewSettings] = useState<ViewSettings>(() => {
    try {
      const saved = localStorage.getItem('atelier_essences_view_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ViewSettings>;
        return { ...DEFAULT_VIEW_SETTINGS, ...parsed, widePageLayout: parsed.widePageLayout ?? true };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_VIEW_SETTINGS;
  });
  const [zoomPercent, setZoomPercent] = useState(100);

  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const workspaceCaptureRef = useRef<HTMLDivElement>(null);
  const pdfHostRef = useRef<HTMLDivElement>(null);
  const [printScreenshotPages, setPrintScreenshotPages] = useState<string[] | null>(null);
  const [activePdfRequest, setActivePdfRequest] = useState<{
    job: PdfExportJob;
    filename: string;
  } | null>(null);
  const [pendingProjectPdf, setPendingProjectPdf] = useState<{
    job: Extract<PdfExportJob, { kind: 'project' }>;
    filename: string;
  } | null>(null);
  const [isCapturingExport, setIsCapturingExport] = useState(false);

  // Sync to localStorage (debounced to avoid blocking typing/interactions) & flush on tab close
  const latestStorageRef = useRef({
    projects,
    ingredients,
    estimates,
    purchases,
    sales,
    library,
  });
  latestStorageRef.current = {
    projects,
    ingredients,
    estimates,
    purchases,
    sales,
    library,
  };
  const dirtyStorageKeysRef = useRef<Set<keyof StudioSnapshot>>(new Set());

  useEffect(() => {
    dirtyStorageKeysRef.current.add('projects');
    const timer = window.setTimeout(() => {
      saveProjects(projects);
      dirtyStorageKeysRef.current.delete('projects');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [projects]);

  useEffect(() => {
    dirtyStorageKeysRef.current.add('ingredients');
    const timer = window.setTimeout(() => {
      saveIngredients(ingredients);
      dirtyStorageKeysRef.current.delete('ingredients');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [ingredients]);

  useEffect(() => {
    dirtyStorageKeysRef.current.add('estimates');
    const timer = window.setTimeout(() => {
      saveEstimates(estimates);
      dirtyStorageKeysRef.current.delete('estimates');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [estimates]);

  useEffect(() => {
    dirtyStorageKeysRef.current.add('purchases');
    const timer = window.setTimeout(() => {
      savePurchases(purchases);
      dirtyStorageKeysRef.current.delete('purchases');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [purchases]);

  useEffect(() => {
    dirtyStorageKeysRef.current.add('sales');
    const timer = window.setTimeout(() => {
      saveSales(sales);
      dirtyStorageKeysRef.current.delete('sales');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [sales]);

  useEffect(() => {
    dirtyStorageKeysRef.current.add('library');
    const timer = window.setTimeout(() => {
      saveLibrary(library);
      dirtyStorageKeysRef.current.delete('library');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [library]);

  useEffect(() => {
    const flushDirtyStorage = () => {
      const dirty = dirtyStorageKeysRef.current;
      if (dirty.size === 0) return;
      const snap = latestStorageRef.current;
      if (dirty.has('projects')) saveProjects(snap.projects);
      if (dirty.has('ingredients')) saveIngredients(snap.ingredients);
      if (dirty.has('estimates')) saveEstimates(snap.estimates);
      if (dirty.has('purchases')) savePurchases(snap.purchases);
      if (dirty.has('sales')) saveSales(snap.sales);
      if (dirty.has('library')) saveLibrary(snap.library);
      dirty.clear();
    };
    window.addEventListener('pagehide', flushDirtyStorage);
    window.addEventListener('beforeunload', flushDirtyStorage);
    return () => {
      window.removeEventListener('pagehide', flushDirtyStorage);
      window.removeEventListener('beforeunload', flushDirtyStorage);
      flushDirtyStorage();
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = appSettings.themeColor;
    document.documentElement.dataset.colorMode = appSettings.colorMode;
    document.documentElement.lang = appSettings.language;
    document.documentElement.classList.toggle('dark', appSettings.colorMode === 'dark');
    document.title = appSettings.studioName?.trim() || UI_TEXT[appSettings.language].brand;
    try {
      localStorage.setItem('atelier_essences_app_settings_v1', JSON.stringify(appSettings));
    } catch {
      // ignore storage errors
    }
  }, [appSettings]);
  useEffect(() => {
    try {
      localStorage.setItem('atelier_essences_view_settings_v1', JSON.stringify(viewSettings));
    } catch {
      // ignore storage errors
    }
  }, [viewSettings]);
  useEffect(() => {
    try {
      localStorage.setItem('atelier_essences_open_tabs_v1', JSON.stringify(openProjectTabs));
    } catch {
      // ignore storage errors
    }
  }, [openProjectTabs]);
  useEffect(() => {
    const validIds = new Set(projects.map((p) => p.id));
    setOpenProjectTabs((prev) => {
      const filtered = prev.filter((id) => validIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [projects]);

  const isFocusMode =
    !viewSettings.showStatusBar &&
    !viewSettings.showPageDescriptions &&
    !viewSettings.showProjectMetrics;

  const handleChangeViewSettings = (patch: Partial<ViewSettings>) => {
    setViewSettings((prev) => ({ ...prev, ...patch }));
  };

  const [ingredientFilters, setIngredientFilters] =
    useState<IngredientFilters>(DEFAULT_INGREDIENT_FILTERS);
  const [ingredientFilterPaneOpen, setIngredientFilterPaneOpen] = useState(true);
  const [projectHistoryPaneOpen, setProjectHistoryPaneOpen] = useState(true);
  const [projectHistoryPaneTab, setProjectHistoryPaneTab] = useState<'history' | 'variants'>('history');
  const [statusHistoryPopoverOpen, setStatusHistoryPopoverOpen] = useState(false);
  const [priceFluctuationThreshold, setPriceFluctuationThreshold] = useState<number>(10);
  const [customIngredientTags, setCustomIngredientTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_essences_ingredient_tags_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
        }
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'atelier_essences_ingredient_tags_v1',
        JSON.stringify(customIngredientTags)
      );
    } catch {
      // ignore storage errors
    }
  }, [customIngredientTags]);

  const handleChangeIngredientFilters = (patch: Partial<IngredientFilters>) => {
    setIngredientFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetIngredientFilters = () => {
    setIngredientFilters(DEFAULT_INGREDIENT_FILTERS);
  };

  const handleToggleFocusMode = () => {
    if (isFocusMode) {
      setViewSettings(DEFAULT_VIEW_SETTINGS);
      setIngredientFilterPaneOpen(true);
      setProjectHistoryPaneOpen(true);
      setToastMessage(t.standardViewRestored);
    } else {
      setViewSettings({
        showStatusBar: false,
        showPageDescriptions: false,
        showProjectMetrics: false,
        showIngredientSpecsExtra: false,
        showIngredientPurchaseBar: false,
        widePageLayout: true,
      });
      setIngredientFilterPaneOpen(false);
      setProjectHistoryPaneOpen(false);
      setToastMessage(t.focusModeEnabled);
    }
  };

  const handleResetViewSettings = () => {
    setViewSettings(DEFAULT_VIEW_SETTINGS);
    setIngredientFilterPaneOpen(true);
    setProjectHistoryPaneOpen(true);
    setZoomPercent(100);
    setToastMessage(t.viewSettingsReset);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    undo();
    setToastMessage(t.changeUndone);
  }, [canUndo, undo, t]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    redo();
    setToastMessage(t.changeRestored);
  }, [canRedo, redo, t]);

  // Global Ctrl+K (Quick Ingredient Search) & Ctrl+Z / Ctrl+Y shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const keyLower = e.key.toLowerCase();
      if ((keyLower === 'k' || e.code === 'KeyK') && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setQuickSearchOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      const isTextField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isTextField) return;

      if (keyLower === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (keyLower === 'y' || (keyLower === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  useEffect(() => {
    setSelectedVariantId(null);
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedVariantId || !selectedProject) return;
    if (!(selectedProject.variants || []).some((v) => v.id === selectedVariantId)) {
      setSelectedVariantId(null);
    }
  }, [selectedProject, selectedVariantId]);

  const wishlistCount = useMemo(
    () => ingredients.filter((i) => i.status === 'wishlist').length,
    [ingredients]
  );

  const ingredientStatusCounts = useMemo(
    () => ({
      all: ingredients.length,
      in_stock: ingredients.filter((i) => i.status === 'in_stock').length,
      wishlist: wishlistCount,
      ordered: ingredients.filter((i) => i.status === 'ordered').length,
    }),
    [ingredients, wishlistCount]
  );

  const uniqueIngredientSuppliers = useMemo(() => {
    const set = new Set<string>();
    for (const ing of ingredients) {
      if (ing.supplier && ing.supplier.trim()) {
        set.add(ing.supplier.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, appSettings.language));
  }, [ingredients, appSettings.language]);

  const { availableIngredientTags, ingredientTagCounts } = useMemo(() => {
    const labelByLower = new Map<string, string>();
    const counts: Record<string, number> = {};

    for (const tag of customIngredientTags) {
      const clean = tag.trim().replace(/^#+/, '');
      if (!clean) continue;
      const low = clean.toLowerCase();
      if (!labelByLower.has(low)) labelByLower.set(low, clean);
    }

    for (const ing of ingredients) {
      const seenOnIng = new Set<string>();
      for (const raw of ing.tags || []) {
        const clean = raw.trim().replace(/^#+/, '');
        if (!clean) continue;
        const low = clean.toLowerCase();
        if (!labelByLower.has(low)) labelByLower.set(low, clean);
        if (!seenOnIng.has(low)) {
          seenOnIng.add(low);
          counts[low] = (counts[low] || 0) + 1;
        }
      }
    }

    const sorted = Array.from(labelByLower.values()).sort((a, b) =>
      a.localeCompare(b, appSettings.language)
    );
    return { availableIngredientTags: sorted, ingredientTagCounts: counts };
  }, [customIngredientTags, ingredients, appSettings.language]);

  const handleCreateIngredientTag = useCallback((rawTag: string) => {
    const clean = rawTag.trim().replace(/^#+/, '');
    if (!clean) return;
    setCustomIngredientTags((prev) => {
      if (prev.some((t) => t.toLowerCase() === clean.toLowerCase())) return prev;
      return [...prev, clean];
    });
  }, []);

  const handleDeleteIngredientTag = useCallback(
    (tagToDelete: string) => {
      const targetLower = tagToDelete.trim().toLowerCase();
      if (!targetLower) return;

      setCustomIngredientTags((prev) =>
        prev.filter((t) => t.toLowerCase() !== targetLower)
      );

      setIngredientFilters((prev) => ({
        ...prev,
        tags: (prev.tags || []).filter((t) => t.toLowerCase() !== targetLower),
      }));

      const usedAnywhere = ingredients.some((ing) =>
        (ing.tags || []).some((t) => t.toLowerCase() === targetLower)
      );
      if (usedAnywhere) {
        commitStudio((prev) => ({
          ...prev,
          ingredients: prev.ingredients.map((ing) =>
            ing.tags?.some((t) => t.toLowerCase() === targetLower)
              ? {
                  ...ing,
                  tags: ing.tags.filter((t) => t.toLowerCase() !== targetLower),
                }
              : ing
          ),
        }));
      }
    },
    [ingredients, commitStudio]
  );

  const activeIngredientFiltersCount = useMemo(() => {
    let count = 0;
    if (ingredientFilters.status !== 'all') count++;
    if (ingredientFilters.family !== 'all') count++;
    if (ingredientFilters.tier !== 'all') count++;
    if (ingredientFilters.origin !== 'all') count++;
    if (ingredientFilters.sillage !== 'all') count++;
    if (ingredientFilters.supplier !== 'all') count++;
    if (ingredientFilters.url !== 'all') count++;
    if (ingredientFilters.ifraOnly) count++;
    if (ingredientFilters.lowStockOnly) count++;
    if ((ingredientFilters.tags || []).length > 0) count += ingredientFilters.tags.length;
    if (ingredientFilters.searchQuery.trim()) count++;
    return count;
  }, [ingredientFilters]);

  const projectEstimatesCount = useMemo(() => {
    if (!selectedProject) return 0;
    return estimates.filter((e) => e.projectId === selectedProject.id).length;
  }, [estimates, selectedProject]);

  const criticalStockItems = useMemo(() => {
    return ingredients
      .filter((ing) => isIngredientRunningLow(ing))
      .sort((a, b) => (getIngredientStockGrams(a) ?? 0) - (getIngredientStockGrams(b) ?? 0));
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const q = ingredientFilters.searchQuery.trim().toLowerCase();
    const selectedTagsLower = (ingredientFilters.tags || []).map((t) => t.toLowerCase());
    const tagMatchMode = ingredientFilters.tagMatchMode || 'any';

    const list = ingredients.filter((ing) => {
      if (ingredientFilters.status !== 'all' && ing.status !== ingredientFilters.status) {
        return false;
      }
      if (ingredientFilters.family !== 'all' && ing.family !== ingredientFilters.family) {
        return false;
      }
      if (ingredientFilters.tier !== 'all' && ing.tier !== ingredientFilters.tier) return false;
      if (ingredientFilters.origin !== 'all' && ing.origin !== ingredientFilters.origin) {
        return false;
      }
      if (ingredientFilters.sillage !== 'all' && ing.sillage !== ingredientFilters.sillage) {
        return false;
      }
      if (
        ingredientFilters.supplier !== 'all' &&
        (ing.supplier || '').trim() !== ingredientFilters.supplier
      ) {
        return false;
      }
      if (ingredientFilters.url === 'with_url' && !(ing.purchaseUrl || '').trim()) return false;
      if (ingredientFilters.url === 'without_url' && (ing.purchaseUrl || '').trim()) return false;
      if (ingredientFilters.ifraOnly && ing.ifraLimitPercent === undefined) return false;
      if (ingredientFilters.lowStockOnly && !isIngredientRunningLow(ing)) return false;
      if (selectedTagsLower.length > 0) {
        const ingTagsLower = (ing.tags || []).map((t) => t.toLowerCase());
        const matched =
          tagMatchMode === 'all'
            ? selectedTagsLower.every((st) => ingTagsLower.includes(st))
            : selectedTagsLower.some((st) => ingTagsLower.includes(st));
        if (!matched) return false;
      }
      if (!q) return true;
      return (
        ing.name.toLowerCase().includes(q) ||
        (ing.inciOrCas || '').toLowerCase().includes(q) ||
        (ing.supplier || '').toLowerCase().includes(q) ||
        (ing.purchaseUrl || '').toLowerCase().includes(q) ||
        (ing.storageLocation || '').toLowerCase().includes(q) ||
        ing.olfactoryNotes.toLowerCase().includes(q) ||
        (ing.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    });

    if (ingredientFilters.sortBy === 'default') return list;
    return [...list].sort((a, b) => {
      const unitA = a.quantityGrams > 0 ? a.priceTotal / a.quantityGrams : 0;
      const unitB = b.quantityGrams > 0 ? b.priceTotal / b.quantityGrams : 0;
      switch (ingredientFilters.sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name, appSettings.language);
        case 'unit_price_asc':
          return unitA - unitB;
        case 'unit_price_desc':
          return unitB - unitA;
        case 'total_price_desc':
          return (b.priceTotal || 0) - (a.priceTotal || 0);
        default:
          return 0;
      }
    });
  }, [
    ingredients,
    purchases,
    priceFluctuationThreshold,
    ingredientFilters,
    appSettings.language,
    appSettings.criticalStockGrams,
  ]);

  const plannedEstimateCount = useMemo(() => {
    return estimates.filter((est) => {
      const bought = purchases
        .filter((p) => p.estimateItemId === est.id)
        .reduce((s, p) => s + p.quantity, 0);
      return bought < est.requiredQuantity;
    }).length;
  }, [estimates, purchases]);

  const readyMacerations = useMemo(() => {
    const todayIso = todayIsoDate();
    const list: {
      project: PerfumeProject;
      batch: MacerationBatch;
      status: ReturnType<typeof getMacerationStatus>;
    }[] = [];
    for (const proj of projects) {
      for (const batch of proj.macerations || []) {
        const status = getMacerationStatus(batch, todayIso);
        if (status.isComplete && !batch.acknowledged) {
          list.push({ project: proj, batch, status });
        }
      }
    }
    list.sort((a, b) => b.status.overdueDays - a.status.overdueDays);
    return list;
  }, [projects]);

  const macerationReadyCount = readyMacerations.length;

  const handleAcknowledgeMaceration = (projectId: string, batchId: string) => {
    commitStudio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              macerations: (p.macerations || []).map((m) =>
                m.id === batchId ? { ...m, acknowledged: true } : m
              ),
            }
          : p
      ),
    }));
    setToastMessage(t.macerationChecked);
  };

  const handleAddMaceration = (projectId: string, batch: MacerationBatch) => {
    commitStudio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              macerations: [batch, ...(p.macerations || [])],
              updatedAt: todayIsoDate(),
            }
          : p
      ),
    }));
    setToastMessage(t.macerationStarted);
  };

  const handleDeleteMaceration = (projectId: string, batchId: string) => {
    commitStudio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              macerations: (p.macerations || []).filter((m) => m.id !== batchId),
            }
          : p
      ),
    }));
    setToastMessage(t.macerationRemoved);
  };

  const openProjectInTab = useCallback(
    (projectId: string, subTab?: ProjectTab) => {
      setOpenProjectTabs((prev) => (prev.includes(projectId) ? prev : [...prev, projectId]));
      const resolvedTab = subTab ?? projectTabById[projectId] ?? 'formula';
      if (subTab) {
        setProjectTabById((prev) => ({ ...prev, [projectId]: subTab }));
      }
      setActiveSection('projects');
      setSelectedProjectId(projectId);
      setActiveProjectTab(resolvedTab);
    },
    [projectTabById]
  );

  const handleSelectProjectSubTab = useCallback(
    (tab: ProjectTab) => {
      setActiveProjectTab(tab);
      if (selectedProjectId) {
        setProjectTabById((prev) => ({ ...prev, [selectedProjectId]: tab }));
      }
    },
    [selectedProjectId]
  );

  const closeProjectTab = useCallback(
    (projectId: string) => {
      const idx = openProjectTabs.indexOf(projectId);
      const next = openProjectTabs.filter((id) => id !== projectId);
      setOpenProjectTabs(next);
      if (selectedProjectId === projectId) {
        const fallbackId = next[idx] ?? next[idx - 1] ?? null;
        setSelectedProjectId(fallbackId);
        if (fallbackId) {
          setActiveProjectTab(projectTabById[fallbackId] ?? 'formula');
        }
      }
    },
    [openProjectTabs, selectedProjectId, projectTabById]
  );

  const closeAllProjectTabs = useCallback(() => {
    setOpenProjectTabs([]);
    if (activeSection === 'projects') {
      setSelectedProjectId(null);
    }
  }, [activeSection]);

  const handleCreateProject = () => {
    const nextNumber = projects.length + 1;
    const code = `AE-${String(nextNumber).padStart(2, '0')}`;
    const today = todayIsoDate();
    const newProj: PerfumeProject = {
      id: generateId('proj'),
      title: t.newFragranceTitle(nextNumber),
      code,
      status: 'idea',
      targetConcentration: 'EDP',
      targetBottleMl:
        appSettings.bottleVolumesMl?.includes(30)
          ? 30
          : appSettings.bottleVolumesMl?.[0] ?? 30,
      targetConcentrateGrams: appSettings.defaultConcentrateGrams ?? 10,
      idea: '',
      inspiration: '',
      components: [],
      olfactoryMap: {
        topNotes: [],
        heartNotes: [],
        baseNotes: [],
        profile: { ...EMPTY_PROFILE },
        longevityHours: 6,
        sillageLevel: 'moderate',
        evaporationNotes: '',
      },
      journal: [],
      macerations: [],
      revisions: [],
      packagingCostPerUnit: 300,
      createdAt: today,
      updatedAt: today,
    };
    commitStudio((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    openProjectInTab(newProj.id, 'formula');
    setToastMessage(t.createdProject(code));
  };

  const handleCreateProjectFromFormula = (
    formula: StarterFormulaSpec,
    targetConcentrateGrams: number,
    includeSolvent: boolean
  ) => {
    const nextNumber = projects.length + 1;
    const code = `AE-${String(nextNumber).padStart(2, '0')}`;
    const today = todayIsoDate();
    const lang = appSettings.language;
    const components = buildScaledFormulaComponents(
      formula,
      targetConcentrateGrams,
      includeSolvent,
      ingredients,
      lang
    );

    const buildMapNotes = (tier: 'top' | 'heart' | 'base') =>
      components
        .filter((c) => c.tier === tier)
        .map((c) => ({
          id: generateId('omn'),
          name: c.name,
          ingredientId: c.ingredientId,
          percentage: Number(
            (
              (c.weightGrams /
                Math.max(
                  0.001,
                  components.filter((x) => x.tier !== 'solvent').reduce((s, x) => s + x.weightGrams, 0)
                )) *
              100
            ).toFixed(1)
          ),
          description: c.note || '',
        }));

    const newProj: PerfumeProject = {
      id: generateId('proj'),
      title: formula.title[lang],
      code,
      status: 'formulating',
      targetConcentration: formula.targetConcentration,
      targetBottleMl:
        appSettings.bottleVolumesMl?.includes(30)
          ? 30
          : appSettings.bottleVolumesMl?.[0] ?? 30,
      targetConcentrateGrams: Number(targetConcentrateGrams.toFixed(2)),
      idea: formula.description[lang],
      inspiration: `${formula.sourceDetail} · ${formula.studyTip[lang]}`,
      components,
      olfactoryMap: {
        topNotes: buildMapNotes('top'),
        heartNotes: buildMapNotes('heart'),
        baseNotes: buildMapNotes('base'),
        profile: { ...formula.profile },
        longevityHours: formula.longevityHours,
        sillageLevel: formula.sillageLevel,
        evaporationNotes: formula.studyTip[lang],
      },
      journal: [],
      macerations: [],
      revisions: [],
      packagingCostPerUnit: 300,
      createdAt: today,
      updatedAt: today,
    };

    commitStudio((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    openProjectInTab(newProj.id, 'ingredients');
    setToastMessage(
      tr(lang, {
        ru: `Создан проект ${code} из формулы «${formula.title[lang]}»`,
        en: `Created project ${code} from "${formula.title[lang]}"`,
        it: `Creato progetto ${code} da "${formula.title[lang]}"`,
        es: `Creado proyecto ${code} desde "${formula.title[lang]}"`,
        de: `Projekt ${code} aus „${formula.title[lang]}“ erstellt`,
      })
    );
  };

  const handleAppendFormulaToProject = (
    formula: StarterFormulaSpec,
    targetConcentrateGrams: number,
    includeSolvent: boolean,
    targetProjectId?: string
  ) => {
    const targetProject =
      (targetProjectId ? projects.find((p) => p.id === targetProjectId) : null) ||
      selectedProject ||
      projects[0] ||
      null;

    if (!targetProject) {
      handleCreateProjectFromFormula(formula, targetConcentrateGrams, includeSolvent);
      return;
    }

    const lang = appSettings.language;
    const isTargetSelected = selectedProject?.id === targetProject.id;
    const activeVarId = isTargetSelected ? selectedVariantId : null;

    const hasExistingSolvent = (
      activeVarId
        ? (targetProject.variants || []).find((v) => v.id === activeVarId)?.components ||
          targetProject.components
        : targetProject.components
    ).some((c) => c.tier === 'solvent');

    const scaled = buildScaledFormulaComponents(
      formula,
      targetConcentrateGrams,
      includeSolvent && !hasExistingSolvent,
      ingredients,
      lang
    );

    commitStudio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== targetProject.id) return p;
        if (activeVarId && (p.variants || []).some((v) => v.id === activeVarId)) {
          return {
            ...p,
            variants: (p.variants || []).map((v) =>
              v.id === activeVarId
                ? { ...v, components: [...v.components, ...scaled] }
                : v
            ),
            updatedAt: todayIsoDate(),
          };
        }
        return {
          ...p,
          components: [...p.components, ...scaled],
          updatedAt: todayIsoDate(),
        };
      }),
    }));
    openProjectInTab(targetProject.id, 'ingredients');
    setToastMessage(
      tr(lang, {
        ru: `«${formula.title[lang]}» добавлено в проект ${targetProject.code}`,
        en: `Added "${formula.title[lang]}" to ${targetProject.code}`,
        it: `Aggiunto "${formula.title[lang]}" a ${targetProject.code}`,
        es: `Añadido "${formula.title[lang]}" a ${targetProject.code}`,
        de: `„${formula.title[lang]}“ zu ${targetProject.code} hinzugefügt`,
      })
    );
  };

  const handleDuplicateProject = (projectId: string) => {
    const source = projects.find((p) => p.id === projectId);
    if (!source) return;
    const today = todayIsoDate();
    const copy: PerfumeProject = {
      ...structuredClone(source),
      id: generateId('proj'),
      title: `${source.title} (${t.version2})`,
      code: `${source.code}-v2`,
      status: 'formulating',
      createdAt: today,
      updatedAt: today,
    };
    commitStudio((prev) => ({
      ...prev,
      projects: [copy, ...prev.projects],
    }));
    openProjectInTab(copy.id, 'formula');
    setToastMessage(t.duplicatedProject(source.title));
  };

  const handleUpdateProject = (updated: PerfumeProject) => {
    commitStudio(
      (prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === updated.id ? updated : p)),
      }),
      `proj-edit-${updated.id}`
    );
  };

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveCurrentProjectFile = () => {
    if (!selectedProject) return;
    const safeName = (selectedProject.title || 'project').replace(/[^\p{L}\p{N}_-]+/gu, '-');
    const payload = buildSingleProjectPayload(selectedProject, estimates, purchases, sales);
    downloadBlob(
      JSON.stringify(payload, null, 2),
      `${selectedProject.code}-${safeName}.json`,
      'application/json'
    );
    setToastMessage(t.savedProjectFile(selectedProject.title));
  };

  const handleExportProjectWordDoc = () => {
    if (!selectedProject) return;
    const safeName = (selectedProject.title || 'project').replace(/[^\p{L}\p{N}_-]+/gu, '-');
    const html = buildProjectWordHtml(
      selectedProject,
      estimates,
      purchases,
      appSettings.language,
      appSettings.currency
    );
    downloadBlob(html, `${selectedProject.code}-${safeName}.doc`, 'application/msword;charset=utf-8');
    setToastMessage(t.savedWordDoc(selectedProject.title));
  };

  const getActiveCaptureElement = useCallback((): HTMLElement | null => {
    if (fileBackstageOpen) {
      return document.getElementById('backstage-capture-root');
    }
    return workspaceCaptureRef.current;
  }, [fileBackstageOpen]);

  const getActivePdfFilename = useCallback(() => {
    const sanitize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_-]+/gu, '-')
        .replace(/^-+|-+$/g, '') || 'atelier';

    if (fileBackstageOpen) {
      return `atelier-${fileBackstageTab}-${todayIsoDate()}.pdf`;
    }
    if (activeSection === 'projects' && selectedProject) {
      const code = sanitize(selectedProject.code || 'project');
      const title = sanitize(selectedProject.title || 'formula');
      return `${code}-${title}-${activeProjectTab}-${todayIsoDate()}.pdf`;
    }
    return `atelier-${activeSection}-${todayIsoDate()}.pdf`;
  }, [
    fileBackstageOpen,
    fileBackstageTab,
    activeSection,
    selectedProject,
    activeProjectTab,
  ]);

  const buildCurrentPdfJob = useCallback((): PdfExportJob => {
    if (fileBackstageOpen) {
      if (fileBackstageTab === 'library') {
        return { kind: 'library', library, language: appSettings.language };
      }
      if (fileBackstageTab === 'statistics') {
        return {
          kind: 'statistics',
          projects,
          ingredients,
          estimates,
          purchases,
          language: appSettings.language,
          currency: appSettings.currency,
        };
      }
      if (fileBackstageTab === 'sales') {
        return {
          kind: 'sales',
          projects,
          sales,
          language: appSettings.language,
          currency: appSettings.currency,
        };
      }
      if (selectedProject) {
        return {
          kind: 'project',
          project: selectedProject,
          estimates,
          purchases,
          language: appSettings.language,
          currency: appSettings.currency,
        };
      }
      return {
        kind: 'projects_overview',
        projects,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }

    if (activeSection === 'projects' && selectedProject) {
      return {
        kind: 'project',
        project: selectedProject,
        estimates,
        purchases,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    if (activeSection === 'projects') {
      return {
        kind: 'projects_overview',
        projects,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    if (activeSection === 'ingredients') {
      return {
        kind: 'ingredients',
        ingredients,
        purchases,
        criticalStockGrams: appSettings.criticalStockGrams,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    if (activeSection === 'budget') {
      return {
        kind: 'budget',
        projects,
        estimates,
        purchases,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    if (activeSection === 'statistics') {
      return {
        kind: 'statistics',
        projects,
        ingredients,
        estimates,
        purchases,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    if (activeSection === 'dilution') {
      if (selectedProject) {
        return {
          kind: 'project',
          project: selectedProject,
          estimates,
          purchases,
          language: appSettings.language,
          currency: appSettings.currency,
        };
      }
      return {
        kind: 'ingredients',
        ingredients,
        purchases,
        criticalStockGrams: appSettings.criticalStockGrams,
        language: appSettings.language,
        currency: appSettings.currency,
      };
    }
    return {
      kind: 'sales',
      projects,
      sales,
      language: appSettings.language,
      currency: appSettings.currency,
    };
  }, [
    fileBackstageOpen,
    fileBackstageTab,
    activeSection,
    selectedProject,
    projects,
    ingredients,
    estimates,
    purchases,
    sales,
    library,
    appSettings.language,
    appSettings.currency,
    appSettings.criticalStockGrams,
  ]);

  const handleExportCurrentViewPdf = useCallback(() => {
    if (isCapturingExport) return;
    const job = buildCurrentPdfJob();
    const filename = getActivePdfFilename();
    if (job.kind === 'project') {
      setPendingProjectPdf({ job, filename });
      return;
    }
    setIsCapturingExport(true);
    setActivePdfRequest({ job, filename });
  }, [isCapturingExport, buildCurrentPdfJob, getActivePdfFilename]);

  const handleConfirmProjectPdfPages = useCallback(
    (selectedSections: ProjectPdfSectionKey[]) => {
      if (!pendingProjectPdf || isCapturingExport || selectedSections.length === 0) return;
      const { job, filename } = pendingProjectPdf;
      setPendingProjectPdf(null);
      setIsCapturingExport(true);
      setActivePdfRequest({
        job: { ...job, selectedSections },
        filename,
      });
    },
    [pendingProjectPdf, isCapturingExport]
  );

  useEffect(() => {
    if (!activePdfRequest) return;
    let cancelled = false;

    const runExport = async () => {
      try {
        const [, { exportPdfHostSheets }] = await Promise.all([
          import('./components/PdfDocumentSheets'),
          import('./utils/pdfDocumentExport'),
        ]);
        if (cancelled) return;
        for (let attempt = 0; attempt < 30; attempt++) {
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          );
          if (cancelled) return;
          if (pdfHostRef.current && pdfHostRef.current.childElementCount > 0) {
            break;
          }
        }
        if (cancelled || !pdfHostRef.current) return;
        await exportPdfHostSheets(pdfHostRef.current, activePdfRequest.filename);
        if (!cancelled) {
          setToastMessage(t.savedScreenshotPdf);
        }
      } catch {
        if (!cancelled) {
          setToastMessage(t.screenshotFailed);
        }
      } finally {
        if (!cancelled) {
          setActivePdfRequest(null);
          setIsCapturingExport(false);
        }
      }
    };

    void runExport();
    return () => {
      cancelled = true;
    };
  }, [activePdfRequest, t]);

  const handlePrintCurrentView = useCallback(async () => {
    const target = getActiveCaptureElement();
    if (!target || isCapturingExport) {
      window.print();
      return;
    }
    setIsCapturingExport(true);
    try {
      const { createPrintScreenshotPages } = await import('./utils/screenshotExport');
      const { pages } = await createPrintScreenshotPages(target);
      if (pages.length === 0) {
        window.print();
        return;
      }
      setPrintScreenshotPages(pages);
    } catch {
      setToastMessage(t.screenshotFailed);
      window.print();
    } finally {
      setIsCapturingExport(false);
    }
  }, [getActiveCaptureElement, isCapturingExport, t]);

  useEffect(() => {
    if (!printScreenshotPages || printScreenshotPages.length === 0) return;

    let cancelled = false;
    let fallbackTimer = 0;
    const clearPages = () => {
      if (!cancelled) {
        setPrintScreenshotPages(null);
      }
    };

    window.addEventListener('afterprint', clearPages);

    const waitAndPrint = async () => {
      const root = document.getElementById('print-screenshot-root');
      const imgs = root ? Array.from(root.querySelectorAll('img')) : [];
      await Promise.race([
        Promise.all(
          imgs.map(async (img) => {
            try {
              if (!img.complete) {
                await new Promise<void>((resolve) => {
                  img.addEventListener('load', () => resolve(), { once: true });
                  img.addEventListener('error', () => resolve(), { once: true });
                });
              }
              if (typeof img.decode === 'function') {
                await img.decode();
              }
            } catch {
              // ignore decode errors and print anyway
            }
          })
        ),
        new Promise<void>((resolve) => {
          fallbackTimer = window.setTimeout(resolve, 1500);
        }),
      ]);

      if (!cancelled) {
        window.print();
      }
    };

    const rafId = window.requestAnimationFrame(() => {
      void waitAndPrint();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('afterprint', clearPages);
    };
  }, [printScreenshotPages]);

  const handleExportProjectPdf = () => {
    void handleExportCurrentViewPdf();
  };

  const handleExportIngredientsExcel = async () => {
    const { exportIngredientsToExcel } = await import('./utils/excelExport');
    exportIngredientsToExcel(ingredients, appSettings.language, appSettings.currency);
    setToastMessage(t.exportedIngredientsExcel);
  };

  const handleExportSalesExcel = async () => {
    const { exportSalesToExcel } = await import('./utils/salesExcel');
    exportSalesToExcel(sales, projects, appSettings.language, appSettings.currency);
    setToastMessage(t.exportedSalesExcel);
  };

  const handleOpenProjectSectionTab = (tab: ProjectTab) => {
    const targetId = selectedProjectId || openProjectTabs[0] || projects[0]?.id || null;
    if (!targetId) return;
    openProjectInTab(targetId, tab);
  };

  const handleExportStudioBackup = () => {
    const payload = buildBackupPayload(projects, ingredients, estimates, purchases, sales, library);
    downloadBlob(
      JSON.stringify(payload, null, 2),
      `atelier-essences-backup-${todayIsoDate()}.json`,
      'application/json'
    );
    const stamp = new Date().toLocaleString(getIntlLocale(appSettings.language), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setAppSettings((prev) => ({ ...prev, lastBackupAt: stamp }));
    setToastMessage(t.savedBackup);
  };

  const handleOpenFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedJson = JSON.parse(String(reader.result));
        const parsed = parseImportedFile(parsedJson);
        if (!parsed) {
          setToastMessage(t.unsupportedFileFormat);
          return;
        }
        if (parsed.kind === 'project') {
          const importedProj = parsed.data.project;
          commitStudio((prev) => {
            const exists = prev.projects.some((p) => p.id === importedProj.id);
            const nextProjects = exists
              ? prev.projects.map((p) => (p.id === importedProj.id ? importedProj : p))
              : [importedProj, ...prev.projects];
            const nextEstimates = [
              ...prev.estimates.filter((e) => e.projectId !== importedProj.id),
              ...parsed.data.estimates,
            ];
            const existingPurIds = new Set(prev.purchases.map((p) => p.id));
            const newPurchases = parsed.data.purchases.filter((p) => !existingPurIds.has(p.id));
            const existingSaleIds = new Set(prev.sales.map((s) => s.id));
            const newSales = (parsed.data.sales || []).filter((s) => !existingSaleIds.has(s.id));
            return {
              ...prev,
              projects: nextProjects,
              estimates: nextEstimates,
              purchases: [...newPurchases, ...prev.purchases],
              sales: [...newSales, ...prev.sales],
            };
          });
          openProjectInTab(importedProj.id, 'formula');
          setToastMessage(t.openedProject(importedProj.title));
          return;
        }

        resetHistory({
          projects: parsed.data.projects,
          ingredients: parsed.data.ingredients,
          estimates: parsed.data.estimates,
          purchases: parsed.data.purchases,
          sales: parsed.data.sales || [],
          library: parsed.data.library || studio.library,
        });
        setOpenProjectTabs([]);
        setActiveSection('projects');
        setSelectedProjectId(null);
        setToastMessage(t.backupRestored);
      } catch {
        setToastMessage(t.failedReadJson);
      }
    };
    reader.readAsText(file);
  };

  const handleImportProjectFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedJson = JSON.parse(String(reader.result));
        const parsed = parseImportedFile(parsedJson);
        if (!parsed) {
          setToastMessage(t.unsupportedFileFormat);
          return;
        }
        if (parsed.kind === 'project') {
          const rawProj = parsed.data.project;
          const idCollision = projects.some((p) => p.id === rawProj.id);
          const finalProjId = idCollision ? generateId('proj') : rawProj.id;
          const importedProj: PerfumeProject = {
            ...rawProj,
            id: finalProjId,
            updatedAt: rawProj.updatedAt || todayIsoDate(),
          };
          const mappedEstimates = parsed.data.estimates.map((e) => ({
            ...e,
            id: idCollision ? generateId('est') : e.id,
            projectId: finalProjId,
          }));
          const mappedPurchases = parsed.data.purchases.map((p) => ({
            ...p,
            id: idCollision ? generateId('pur') : p.id,
            projectId: finalProjId,
          }));
          const mappedSales = (parsed.data.sales || []).map((s) => ({
            ...s,
            id: idCollision ? generateId('sale') : s.id,
            projectId: finalProjId,
          }));

          commitStudio((prev) => {
            const existingPurIds = new Set(prev.purchases.map((p) => p.id));
            const newPurchases = mappedPurchases.filter((p) => !existingPurIds.has(p.id));
            const existingSaleIds = new Set(prev.sales.map((s) => s.id));
            const newSales = mappedSales.filter((s) => !existingSaleIds.has(s.id));
            return {
              ...prev,
              projects: [importedProj, ...prev.projects],
              estimates: [
                ...prev.estimates.filter((e) => e.projectId !== finalProjId),
                ...mappedEstimates,
              ],
              purchases: [...newPurchases, ...prev.purchases],
              sales: [...newSales, ...prev.sales],
            };
          });
          openProjectInTab(importedProj.id, 'formula');
          setToastMessage(t.openedProject(importedProj.title));
          return;
        }

        // If a full studio JSON was selected, append its projects into the existing list
        if (parsed.kind === 'studio' && parsed.data.projects.length > 0) {
          let firstImportedTitle = parsed.data.projects[0].title;
          let firstImportedId = parsed.data.projects[0].id;
          commitStudio((prev) => {
            const existingIds = new Set(prev.projects.map((p) => p.id));
            const addedProjects: PerfumeProject[] = [];
            for (const p of parsed.data.projects) {
              const newId = existingIds.has(p.id) ? generateId('proj') : p.id;
              existingIds.add(newId);
              if (addedProjects.length === 0) {
                firstImportedId = newId;
                firstImportedTitle = p.title;
              }
              addedProjects.push({ ...p, id: newId });
            }
            return {
              ...prev,
              projects: [...addedProjects, ...prev.projects],
            };
          });
          openProjectInTab(firstImportedId, 'formula');
          setToastMessage(t.openedProject(firstImportedTitle));
        }
      } catch {
        setToastMessage(t.failedReadJson);
      }
    };
    reader.readAsText(file);
  };

  const requestDeleteProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    setConfirmState({
      type: 'project',
      id: projectId,
      label: proj.title || t.fallbackThisProject,
    });
  };

  const handleExecuteConfirm = () => {
    if (!confirmState) return;
    if (confirmState.type === 'project') {
      commitStudio((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== confirmState.id),
        estimates: prev.estimates.filter((e) => e.projectId !== confirmState.id),
      }));
      closeProjectTab(confirmState.id);
      setToastMessage(t.projectDeleted);
    } else if (confirmState.type === 'ingredient') {
      commitStudio((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((i) => i.id !== confirmState.id),
      }));
      setToastMessage(t.ingredientDeleted);
    } else if (confirmState.type === 'estimate') {
      commitStudio((prev) => ({
        ...prev,
        estimates: prev.estimates.filter((e) => e.id !== confirmState.id),
      }));
      setToastMessage(t.estimateDeleted);
    } else if (confirmState.type === 'purchase') {
      commitStudio((prev) => ({
        ...prev,
        purchases: prev.purchases.filter((p) => p.id !== confirmState.id),
      }));
      setToastMessage(t.purchaseDeleted);
    } else if (confirmState.type === 'sale') {
      commitStudio((prev) => ({
        ...prev,
        sales: prev.sales.filter((s) => s.id !== confirmState.id),
      }));
      setToastMessage(t.saleDeleted);
    } else if (confirmState.type === 'library') {
      commitStudio((prev) => ({
        ...prev,
        library: prev.library.filter((l) => l.id !== confirmState.id),
      }));
      setToastMessage(t.libraryDeleted);
    } else if (confirmState.type === 'reset_demo') {
      resetHistory(loadSeedStudioSnapshot(appSettings.language));
      setOpenProjectTabs([]);
      setActiveSection('projects');
      setSelectedProjectId(null);
      setToastMessage(t.demoResetDone);
    } else if (confirmState.type === 'clear_formula') {
      commitStudio((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== confirmState.projectId) return p;
          if (confirmState.variantId) {
            return {
              ...p,
              variants: (p.variants || []).map((v) =>
                v.id === confirmState.variantId ? { ...v, components: [] } : v
              ),
              updatedAt: todayIsoDate(),
            };
          }
          return {
            ...p,
            components: [],
            updatedAt: todayIsoDate(),
          };
        }),
      }));
      setToastMessage(
        tr(appSettings.language, {
          ru: 'Все ингредиенты удалены из формулы (Ctrl+Z — отменить)',
          en: 'All ingredients removed from formula (Ctrl+Z to undo)',
          it: 'Tutti gli ingredienti rimossi dalla formula (Ctrl+Z per annullare)',
          es: 'Todos los ingredientes eliminados (Ctrl+Z para deshacer)',
          de: 'Alle Rohstoffe entfernt (Ctrl+Z zum Rückgängigmachen)',
        })
      );
    }
    setConfirmState(null);
  };

  const ZOOM_CLASS_MAP: Record<number, string> = {
    50: '[zoom:0.5]',
    60: '[zoom:0.6]',
    70: '[zoom:0.7]',
    80: '[zoom:0.8]',
    90: '[zoom:0.9]',
    100: '[zoom:1]',
    110: '[zoom:1.1]',
    120: '[zoom:1.2]',
    130: '[zoom:1.3]',
    140: '[zoom:1.4]',
    150: '[zoom:1.5]',
  };
  const zoomClass = ZOOM_CLASS_MAP[zoomPercent] || '[zoom:1]';

  const uiText = UI_TEXT[appSettings.language];

  const handleChangeColorMode = (colorMode: AppSettings['colorMode']) => {
    setAppSettings((prev) => ({ ...prev, colorMode }));
    setToastMessage(colorMode === 'dark' ? t.darkModeEnabled : t.lightModeEnabled);
  };

  const handleAddSale = (sale: SaleRecord) => {
    commitStudio((prev) => ({
      ...prev,
      sales: [sale, ...prev.sales],
    }));
    setToastMessage(t.saleRecorded);
  };

  const handleImportSales = (records: SaleRecord[], mode: 'append' | 'replace') => {
    commitStudio((prev) => ({
      ...prev,
      sales: mode === 'replace' ? records : [...records, ...prev.sales],
    }));
    setToastMessage(t.importedSalesCount(records.length));
  };

  const handleDeleteSale = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    setConfirmState({
      type: 'sale',
      id,
      label: sale?.fragranceName || t.fallbackSaleRecord,
    });
  };

  const handleAddLibraryItem = (item: LibraryIngredient) => {
    commitStudio((prev) => ({
      ...prev,
      library: [item, ...prev.library],
    }));
    setToastMessage(t.libraryAdded(item.name));
  };

  const handleUpdateLibraryItem = (item: LibraryIngredient) => {
    commitStudio((prev) => ({
      ...prev,
      library: prev.library.map((l) => (l.id === item.id ? item : l)),
    }));
  };

  const handleDeleteLibraryItem = (id: string) => {
    const item = library.find((l) => l.id === id);
    setConfirmState({
      type: 'library',
      id,
      label: item?.name || t.fallbackLibraryItem,
    });
  };

  const handleAddLibraryItemToWishlist = (item: LibraryIngredient) => {
    const resolvedIfra = resolveIfraStandard({
      name: item.name,
      inciOrCas: item.inciOrCas,
    });
    const resolvedLimit = resolvedIfra
      ? resolvedIfra.category4LimitPercent
      : item.ifraLimitPercent;
    const newIng: Ingredient = {
      id: generateId('ing'),
      name: item.name,
      inciOrCas: item.inciOrCas,
      family: item.family,
      tier: item.tier,
      origin: item.origin,
      status: 'wishlist',
      dilutionPercent: 100,
      unit: 'г',
      quantityGrams: 10,
      priceTotal: 0,
      ifraLimitPercent: resolvedLimit,
      longevityLabel: item.blotterLongevity || '—',
      sillage: 'moderate',
      olfactoryNotes: item.scentDescription || item.properties || '',
      createdAt: todayIsoDate(),
    };
    commitStudio((prev) => ({
      ...prev,
      ingredients: [newIng, ...prev.ingredients],
    }));
    setToastMessage(t.addedToWishlist(item.name));
  };

  const syncOrderedToEstimates = useCallback(
    (
      targetIng: Ingredient,
      currentEstimates: ProjectEstimateItem[]
    ): { nextEstimates: ProjectEstimateItem[]; added: boolean } => {
      if (targetIng.status !== 'ordered') return { nextEstimates: currentEstimates, added: false };
      const targetName = targetIng.name.trim().toLowerCase();
      const alreadyExists = currentEstimates.some(
        (e) =>
          (targetIng.id && e.ingredientId === targetIng.id) ||
          e.ingredientName.trim().toLowerCase() === targetName
      );
      if (alreadyExists) return { nextEstimates: currentEstimates, added: false };

      const unitPrice =
        targetIng.quantityGrams > 0
          ? Number((targetIng.priceTotal / targetIng.quantityGrams).toFixed(2))
          : (targetIng.priceTotal || 0);

      const newEstItem: ProjectEstimateItem = {
        id: generateId('est'),
        projectId: projects[0]?.id || 'general',
        ingredientId: targetIng.id,
        ingredientName: targetIng.name.trim(),
        category: targetIng.tier === 'solvent' ? 'solvent' : 'raw_materials',
        requiredQuantity: Math.max(1, targetIng.quantityGrams || 10),
        unit: targetIng.unit || 'г',
        estimatedUnitPrice: unitPrice,
        notes: tr(appSettings.language, {
          ru: 'Автоматически добавлено из статуса «Заказано»',
          en: 'Automatically added from "Ordered" status',
          it: 'Aggiunto automaticamente dallo stato "Ordinato"',
          es: 'Añadido automáticamente desde el estado "Pedido"',
          de: 'Automatisch aus dem Status „Bestellt“ hinzugefügt',
        }),
      };

      return { nextEstimates: [...currentEstimates, newEstItem], added: true };
    },
    [projects, appSettings.language]
  );

  const handleAddToShoppingCart = useCallback(
    (payload: CartAddPayload, projectId?: string) => {
      const targetName = payload.name.trim();
      if (!targetName) return;
      const nameLower = targetName.toLowerCase();

      commitStudio((prev) => {
        const existingIng = prev.ingredients.find(
          (i) =>
            (payload.ingredientId && i.id === payload.ingredientId) ||
            i.name.trim().toLowerCase() === nameLower
        );

        let nextIngredients = prev.ingredients;
        let linkedIngId = existingIng?.id;

        if (!existingIng) {
          const newIngId = generateId('ing');
          linkedIngId = newIngId;
          const resolvedIfra = resolveIfraStandard({
            name: targetName,
            inciOrCas: payload.inciOrCas,
          });
          const wishlistIng: Ingredient = {
            id: newIngId,
            name: targetName,
            inciOrCas: payload.inciOrCas,
            family: payload.family,
            tier: payload.tier,
            origin: payload.origin,
            status: 'wishlist',
            dilutionPercent: payload.dilutionPercent ?? 100,
            unit: 'г',
            quantityGrams: Math.max(10, Math.ceil(payload.requiredGrams || 10)),
            priceTotal: 0,
            ifraLimitPercent: resolvedIfra?.category4LimitPercent,
            longevityLabel: '—',
            sillage: 'moderate',
            odorImpact: payload.odorImpact,
            substantivityHours: payload.substantivityHours,
            scentBreakdown: payload.scentBreakdown,
            olfactoryNotes: payload.olfactoryNotes || '',
            createdAt: todayIsoDate(),
          };
          nextIngredients = [wishlistIng, ...prev.ingredients];
        }

        let nextEstimates = prev.estimates;
        if (projectId) {
          const qtyToBuy = Math.max(1, Number((payload.requiredGrams || 10).toFixed(2)));
          const existingEst = prev.estimates.find(
            (e) =>
              e.projectId === projectId &&
              ((linkedIngId && e.ingredientId === linkedIngId) ||
                e.ingredientName.trim().toLowerCase() === nameLower)
          );
          if (!existingEst) {
            const newEst: ProjectEstimateItem = {
              id: generateId('est'),
              projectId,
              ingredientId: linkedIngId,
              ingredientName: targetName,
              category: payload.tier === 'solvent' ? 'solvent' : 'raw_materials',
              requiredQuantity: qtyToBuy,
              unit: 'г',
              estimatedUnitPrice: Number((payload.costPerGram || 0).toFixed(2)),
              notes: payload.inciOrCas || undefined,
            };
            nextEstimates = [...prev.estimates, newEst];
          }
        }

        return {
          ...prev,
          ingredients: nextIngredients,
          estimates: nextEstimates,
        };
      });

      setToastMessage(
        tr(appSettings.language, {
          ru: `«${targetName}» добавлен в корзину`,
          en: `"${targetName}" added to cart`,
          it: `"${targetName}" aggiunto al carrello`,
          es: `"${targetName}" añadido al carrito`,
          de: `„${targetName}“ in den Warenkorb gelegt`,
        })
      );
    },
    [commitStudio, appSettings.language]
  );

  const handleOpenIngredientFromQuickSearch = useCallback(
    (ing: Ingredient) => {
      setIngredientFilters({
        ...DEFAULT_INGREDIENT_FILTERS,
        searchQuery: ing.name,
      });
      setActiveSection('ingredients');
      setFileBackstageTab('ingredients');
      setFileBackstageOpen(true);
      setQuickSearchOpen(false);
      setToastMessage(t.selectedIngredient(ing.name));
    },
    [t]
  );

  const handleAddIngredientToFormulaFromQuickSearch = useCallback(
    (ing: Ingredient, projectId: string, weightGrams: number) => {
      const targetProject = projects.find((p) => p.id === projectId);
      if (!targetProject) return;
      const unitCost = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
      const newComp = {
        id: generateId('fc'),
        ingredientId: ingredients.some((i) => i.id === ing.id) ? ing.id : undefined,
        name: ing.name,
        tier: ing.tier,
        family: ing.family,
        dilutionPercent: ing.dilutionPercent,
        weightGrams: Math.max(0.01, Number(weightGrams) || 0.5),
        costPerGram: Number(unitCost.toFixed(2)),
        odorImpact: ing.odorImpact,
        substantivityHours: ing.substantivityHours,
        scentBreakdown: ing.scentBreakdown,
        note: ing.olfactoryNotes ? ing.olfactoryNotes.slice(0, 80) : undefined,
      };
      commitStudio((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                components: [...p.components, newComp],
                updatedAt: todayIsoDate(),
              }
            : p
        ),
      }));
      openProjectInTab(projectId, 'formula');
      setFileBackstageOpen(false);
      setQuickSearchOpen(false);
      setToastMessage(t.addedIngredientToFormula(ing.name, targetProject.code));
    },
    [projects, ingredients, commitStudio, openProjectInTab, t]
  );

  const handleOpenCriticalStock = useCallback(
    (ing?: Ingredient) => {
      setIngredientFilters({
        ...DEFAULT_INGREDIENT_FILTERS,
        status: 'in_stock',
        lowStockOnly: !ing,
        searchQuery: ing ? ing.name : '',
      });
      setActiveSection('ingredients');
      setFileBackstageTab('ingredients');
      setFileBackstageOpen(true);
    },
    []
  );

  return (
    <div
      data-theme={appSettings.themeColor}
      data-color-mode={appSettings.colorMode}
      className="h-screen overflow-hidden flex flex-col bg-[#EAE9E7] text-[#252423] print:h-auto print:overflow-visible"
    >
      <div
        ref={workspaceCaptureRef}
        id="workspace-capture-root"
        className={`${
          fileBackstageOpen && !isCapturingExport
            ? 'hidden'
            : 'flex-1 flex flex-col min-h-0 overflow-hidden'
        } ${printScreenshotPages ? 'print:hidden' : ''}`}
      >
      {/* Word Top Title Bar + Ribbon */}
      <WordRibbon
        activeSection={activeSection}
        activeProjectTab={activeProjectTab}
        selectedProject={selectedProject}
        hasProjects={projects.length > 0}
        appSettings={appSettings}
        onToggleColorMode={() =>
          handleChangeColorMode(appSettings.colorMode === 'dark' ? 'light' : 'dark')
        }
        onOpenFileBackstage={() => {
          setFileBackstageTab('home');
          setFileBackstageOpen(true);
        }}
        onOpenFileHome={() => {
          setFileBackstageTab('home');
          setFileBackstageOpen(true);
        }}
        onOpenBottleSettings={() => {
          setFileBackstageTab('settings');
          setFileBackstageOpen(true);
        }}
        macerationReadyCount={macerationReadyCount}
        readyMacerations={readyMacerations}
        criticalStockItems={criticalStockItems}
        criticalStockGrams={appSettings.criticalStockGrams}
        onOpenCriticalStock={handleOpenCriticalStock}
        onOpenProject={(projectId, tab = 'formula') => openProjectInTab(projectId, tab)}
        onAcknowledgeMaceration={handleAcknowledgeMaceration}
        onSelectSection={(section) => {
          if (section === 'ingredients') {
            setFileBackstageTab('ingredients');
            setFileBackstageOpen(true);
            return;
          }
          setActiveSection(section);
          if (section === 'projects') {
            setSelectedProjectId(null);
          }
        }}
        onSelectProjectTab={handleSelectProjectSubTab}
        onOpenProjectSectionTab={handleOpenProjectSectionTab}
        onCreateProject={handleCreateProject}
        onDuplicateActiveProject={() => {
          if (selectedProject) handleDuplicateProject(selectedProject.id);
        }}
        onDeleteActiveProject={() => {
          if (selectedProject) requestDeleteProject(selectedProject.id);
        }}
        onUpdateProject={handleUpdateProject}
        canUndo={canUndo}
        canRedo={canRedo}
        undoCount={undoCount}
        redoCount={redoCount}
        onUndo={handleUndo}
        onRedo={handleRedo}
        historyPaneOpen={projectHistoryPaneOpen}
        onToggleHistoryPane={() => setProjectHistoryPaneOpen((v) => !v)}
        onOpenHistoryTab={(tab) => {
          setProjectHistoryPaneTab(tab);
          setProjectHistoryPaneOpen(true);
        }}
        viewSettings={viewSettings}
        onChangeViewSettings={handleChangeViewSettings}
        onResetViewSettings={handleResetViewSettings}
        isFocusMode={isFocusMode}
        onToggleFocusMode={handleToggleFocusMode}
        zoomPercent={zoomPercent}
        onChangeZoom={setZoomPercent}
        onSaveCurrentProjectFile={handleSaveCurrentProjectFile}
        onExportProjectPdf={handleExportProjectPdf}
        onExportCurrentViewPdf={() => void handleExportCurrentViewPdf()}
        onPrintCurrentView={() => void handlePrintCurrentView()}
        isCapturingExport={isCapturingExport}
        onExportProjectWordDoc={handleExportProjectWordDoc}
        onExportIngredientsExcel={handleExportIngredientsExcel}
        onExportSalesExcel={handleExportSalesExcel}
        onExportStudioBackup={handleExportStudioBackup}
        onOpenFile={handleOpenFile}
        toastMessage={toastMessage}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
        projectEstimatesCount={projectEstimatesCount}
        ingredients={ingredients}
        library={library}
        estimates={estimates}
        selectedVariantId={selectedVariantId}
        onAddToCart={handleAddToShoppingCart}
        onAddComponentToFormula={(comp: FormulaComponent) => {
          if (!selectedProject) return;
          commitStudio((prev) => ({
            ...prev,
            projects: prev.projects.map((p) => {
              if (p.id !== selectedProject.id) return p;
              if (selectedVariantId && (p.variants || []).some((v) => v.id === selectedVariantId)) {
                return {
                  ...p,
                  variants: (p.variants || []).map((v) =>
                    v.id === selectedVariantId
                      ? { ...v, components: [...v.components, comp] }
                      : v
                  ),
                  updatedAt: todayIsoDate(),
                };
              }
              return {
                ...p,
                components: [...p.components, comp],
                updatedAt: todayIsoDate(),
              };
            }),
          }));
          setToastMessage(t.addedIngredientToFormula(comp.name, selectedProject.code));
        }}
        onRequestClearAllComponents={() => {
          if (!selectedProject) return;
          const activeVar = selectedVariantId
            ? (selectedProject.variants || []).find((v) => v.id === selectedVariantId)
            : null;
          const label = activeVar
            ? `${selectedProject.title} (${activeVar.name})`
            : selectedProject.title || t.fallbackThisProject;
          setConfirmState({
            type: 'clear_formula',
            projectId: selectedProject.id,
            variantId: activeVar ? activeVar.id : null,
            label,
          });
        }}
      />

      {/* Browser-style Project Tabs Strip */}
      <ProjectTabsBar
        language={appSettings.language}
        projects={projects}
        openTabIds={openProjectTabs}
        activeSection={activeSection}
        selectedProjectId={selectedProjectId}
        onSelectOverview={() => {
          setActiveSection('projects');
          setSelectedProjectId(null);
        }}
        onSelectTab={(id) => openProjectInTab(id)}
        onCloseTab={closeProjectTab}
        onCloseAllTabs={closeAllProjectTabs}
        onCreateProject={handleCreateProject}
        onOpenProjectInTab={(id) => openProjectInTab(id)}
      />



        {/* Desk Canvas with Centered White Document Page */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          <main
            data-capture-scroll="true"
            className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain p-0 bg-white print:p-0"
          >
          <div
            className={`${zoomClass} w-full max-w-none border-0 shadow-none px-4 py-5 sm:px-8 sm:py-6 lg:px-10 xl:px-12 bg-white min-h-full print:border-none print:shadow-none print:px-0 print:py-0 print:[zoom:1]`}
          >
            {activeSection === 'projects' && !selectedProject && (
              <ProjectsOverview
                projects={projects}
                viewSettings={viewSettings}
                language={appSettings.language}
                currency={appSettings.currency}
                onSelectProject={(id) => openProjectInTab(id, 'formula')}
                onCreateProject={handleCreateProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={(id) => {
                  const proj = projects.find((p) => p.id === id);
                  setConfirmState({
                    type: 'project',
                    id,
                    label: proj?.title || t.fallbackThisProject,
                  });
                }}
              />
            )}

              {activeSection === 'projects' && selectedProject && (
                <ProjectDetail
                  project={selectedProject}
                  allProjects={projects}
                  viewSettings={viewSettings}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  defaultConcentrateGrams={appSettings.defaultConcentrateGrams ?? 10}
                  onSwitchProject={(id) => openProjectInTab(id)}
                  activeTab={activeProjectTab}
                  onChangeTab={handleSelectProjectSubTab}
                  onUpdateProject={handleUpdateProject}
                  selectedVariantId={selectedVariantId}
                  onSelectVariantId={setSelectedVariantId}
                  ingredients={ingredients}
                  library={library}
                  estimates={estimates}
                  purchases={purchases}
                  onAddEstimateItem={(item) => {
                    commitStudio((prev) => ({
                      ...prev,
                      estimates: [...prev.estimates, item],
                    }));
                    setToastMessage(t.estimateItemAddedToProject);
                  }}
                  onDeleteEstimateItem={(id) => {
                    const est = estimates.find((e) => e.id === id);
                    setConfirmState({
                      type: 'estimate',
                      id,
                      label: est?.ingredientName || t.fallbackBudgetItem,
                    });
                  }}
                  onAddPurchaseRecord={(record) => {
                    commitStudio((prev) => ({
                      ...prev,
                      purchases: [record, ...prev.purchases],
                    }));
                    setToastMessage(t.purchaseSaved);
                  }}
                  onSaveDilutedIngredient={(ing) => {
                    commitStudio((prev) => ({
                      ...prev,
                      ingredients: [ing, ...prev.ingredients],
                      library: ensureIngredientsInLibrary([ing], prev.library),
                    }));
                  }}
                  onToast={setToastMessage}
                  onAddToCart={handleAddToShoppingCart}
                  onUpdateIngredient={(ing) => {
                    commitStudio((prev) => ({
                      ...prev,
                      ingredients: prev.ingredients.map((i) => (i.id === ing.id ? ing : i)),
                      library: ensureIngredientsInLibrary([ing], prev.library),
                    }));
                    setToastMessage(t.ingredientUpdated);
                  }}
                />
              )}

              {activeSection === 'ingredients' && (
                <IngredientsCatalog
                  ingredients={ingredients}
                  filteredIngredients={filteredIngredients}
                  library={library}
                  projects={projects}
                  viewSettings={viewSettings}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  filters={ingredientFilters}
                  onChangeFilters={handleChangeIngredientFilters}
                  onResetFilters={handleResetIngredientFilters}
                  activeFiltersCount={activeIngredientFiltersCount}
                  statusCounts={ingredientStatusCounts}
                  filterPaneOpen={ingredientFilterPaneOpen}
                  onToggleFilterPane={() => setIngredientFilterPaneOpen((v) => !v)}
                  estimates={estimates}
                  onAddIngredient={(ing) => {
                    let wasAddedToEstimates = false;
                    commitStudio((prev) => {
                      const { nextEstimates, added } = syncOrderedToEstimates(ing, prev.estimates);
                      wasAddedToEstimates = added;
                      return {
                        ...prev,
                        ingredients: [ing, ...prev.ingredients],
                        library: ensureIngredientsInLibrary([ing], prev.library),
                        estimates: nextEstimates,
                      };
                    });
                    if (wasAddedToEstimates) {
                      setToastMessage(
                        tr(appSettings.language, {
                          ru: `«${ing.name}» заказан и автоматически добавлен в смету закупок`,
                          en: `"${ing.name}" marked as ordered and added to procurement budget`,
                          it: `"${ing.name}" ordinato e aggiunto automaticamente al budget`,
                          es: `"${ing.name}" pedido y añadido automáticamente al presupuesto`,
                          de: `„${ing.name}“ bestellt und automatisch zum Budget hinzugefügt`,
                        })
                      );
                    } else {
                      setToastMessage(t.ingredientAdded(ing.name));
                    }
                  }}
                  onUpdateIngredient={(ing) => {
                    let wasAddedToEstimates = false;
                    commitStudio((prev) => {
                      const { nextEstimates, added } = syncOrderedToEstimates(ing, prev.estimates);
                      wasAddedToEstimates = added;
                      return {
                        ...prev,
                        ingredients: prev.ingredients.map((i) => (i.id === ing.id ? ing : i)),
                        library: ensureIngredientsInLibrary([ing], prev.library),
                        estimates: nextEstimates,
                      };
                    });
                    if (wasAddedToEstimates) {
                      setToastMessage(
                        tr(appSettings.language, {
                          ru: `«${ing.name}» заказан и автоматически добавлен в смету закупок`,
                          en: `"${ing.name}" marked as ordered and added to procurement budget`,
                          it: `"${ing.name}" ordinato e aggiunto automaticamente al budget`,
                          es: `"${ing.name}" pedido y añadido automáticamente al presupuesto`,
                          de: `„${ing.name}“ bestellt und automatisch zum Budget hinzugefügt`,
                        })
                      );
                    } else {
                      setToastMessage(t.ingredientUpdated);
                    }
                  }}
                  onDeleteIngredient={(id) => {
                    const ing = ingredients.find((i) => i.id === id);
                    setConfirmState({
                      type: 'ingredient',
                      id,
                      label: ing?.name || t.fallbackIngredient,
                    });
                  }}
                  onAddPurchaseRecord={(record) => {
                    commitStudio((prev) => ({
                      ...prev,
                      purchases: [record, ...prev.purchases],
                    }));
                    setToastMessage(t.movedToStockAndLogged);
                  }}
                  onAddEstimateItem={(item) => {
                    commitStudio((prev) => ({
                      ...prev,
                      estimates: [...prev.estimates, item],
                    }));
                    setToastMessage(t.ingredientAddedToBudget);
                  }}
                  purchases={purchases}
                  priceFluctuationThreshold={priceFluctuationThreshold}
                  onChangePriceFluctuationThreshold={setPriceFluctuationThreshold}
                  availableTags={availableIngredientTags}
                  tagCounts={ingredientTagCounts}
                  onCreateTag={handleCreateIngredientTag}
                  onDeleteTag={handleDeleteIngredientTag}
                  criticalStockGrams={appSettings.criticalStockGrams}
                  onChangeCriticalStockGrams={(grams) =>
                    setAppSettings((prev) => ({ ...prev, criticalStockGrams: grams }))
                  }
                />
              )}

              {activeSection === 'budget' && (
                <BudgetEstimate
                  projects={projects}
                  ingredients={ingredients}
                  estimates={estimates}
                  purchases={purchases}
                  viewSettings={viewSettings}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  onAddEstimateItem={(item) => {
                    commitStudio((prev) => ({
                      ...prev,
                      estimates: [...prev.estimates, item],
                    }));
                    setToastMessage(t.budgetItemAdded);
                  }}
                  onDeleteEstimateItem={(id) => {
                    const est = estimates.find((e) => e.id === id);
                    setConfirmState({
                      type: 'estimate',
                      id,
                      label: est?.ingredientName || t.fallbackBudgetItem,
                    });
                  }}
                  onAddPurchaseRecord={(record) => {
                    commitStudio((prev) => ({
                      ...prev,
                      purchases: [record, ...prev.purchases],
                    }));
                    setToastMessage(t.purchaseLogged);
                  }}
                  onDeletePurchaseRecord={(id) => {
                    const pur = purchases.find((p) => p.id === id);
                    setConfirmState({
                      type: 'purchase',
                      id,
                      label: pur?.ingredientName || t.fallbackPurchaseRecord,
                    });
                  }}
                  onUpdateProject={handleUpdateProject}
                  onToast={setToastMessage}
                />
              )}

              {activeSection === 'statistics' && (
                <StudioStatistics
                  projects={projects}
                  ingredients={ingredients}
                  estimates={estimates}
                  purchases={purchases}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  showDescription={viewSettings.showPageDescriptions}
                  onOpenProject={(projectId, tab = 'formula') => openProjectInTab(projectId, tab)}
                  onOpenIngredients={() => setActiveSection('ingredients')}
                  onOpenBudget={() => setActiveSection('budget')}
                  onOpenProjectsOverview={() => {
                    setActiveSection('projects');
                    setSelectedProjectId(null);
                  }}
                />
              )}

              {activeSection === 'sales' && (
                <SalesStatistics
                  projects={projects}
                  sales={sales}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  showDescription={viewSettings.showPageDescriptions}
                  onAddSale={handleAddSale}
                  onImportSales={handleImportSales}
                  onDeleteSale={handleDeleteSale}
                  onOpenProject={(projectId, tab = 'formula') => openProjectInTab(projectId, tab)}
                />
              )}

              {activeSection === 'dilution' && (
                <IngredientDilutionCalculator
                  ingredients={ingredients}
                  projects={projects}
                  language={appSettings.language}
                  currency={appSettings.currency}
                  activeProject={selectedProject}
                  onAddToProjectFormula={(projectId, comp) => {
                    commitStudio((prev) => ({
                      ...prev,
                      projects: prev.projects.map((p) =>
                        p.id === projectId
                          ? {
                              ...p,
                              components: [...p.components, comp],
                              updatedAt: todayIsoDate(),
                            }
                          : p
                      ),
                    }));
                  }}
                  onSaveDilutedIngredient={(ing) => {
                    commitStudio((prev) => ({
                      ...prev,
                      ingredients: [ing, ...prev.ingredients],
                      library: ensureIngredientsInLibrary([ing], prev.library),
                    }));
                  }}
                  onToast={setToastMessage}
                />
              )}
          </div>
        </main>

        {activeSection === 'ingredients' && (
          <IngredientsFilterPane
            open={ingredientFilterPaneOpen}
            onClose={() => setIngredientFilterPaneOpen(false)}
            filters={ingredientFilters}
            onChangeFilters={handleChangeIngredientFilters}
            onResetFilters={handleResetIngredientFilters}
            activeFiltersCount={activeIngredientFiltersCount}
            totalCount={ingredients.length}
            filteredCount={filteredIngredients.length}
            statusCounts={ingredientStatusCounts}
            uniqueSuppliers={uniqueIngredientSuppliers}
            availableTags={availableIngredientTags}
            tagCounts={ingredientTagCounts}
            onCreateTag={handleCreateIngredientTag}
            criticalStockGrams={appSettings.criticalStockGrams}
            language={appSettings.language}
          />
        )}

        {activeSection === 'projects' && selectedProject && projectHistoryPaneOpen && (
          <ProjectHistoryPane
            open={projectHistoryPaneOpen}
            onClose={() => setProjectHistoryPaneOpen(false)}
            project={selectedProject}
            onUpdateProject={handleUpdateProject}
            onToast={setToastMessage}
            language={appSettings.language}
            currency={appSettings.currency}
            activePaneTab={projectHistoryPaneTab}
            onChangePaneTab={setProjectHistoryPaneTab}
          />
        )}
        </div>
      </div>

      {/* Word Bottom Status Bar */}
      {viewSettings.showStatusBar && (
        <footer className="print:hidden relative z-20 shrink-0 flex items-center justify-between gap-4 border-t border-[#D2D0CE] bg-[#F3F2F1] px-4 py-1 text-[11px] text-[#605E5C] select-none">
          {statusHistoryPopoverOpen && (
            <div className="absolute bottom-full left-4 mb-1.5 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-[#D2D0CE] bg-white shadow-xl text-[#323130] overflow-hidden">
              <div className="flex items-center justify-between gap-2 bg-[#FAF9F8] px-3 py-2 border-b border-[#EDEBE9]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <History className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
                  <span className="text-xs font-semibold text-[#181917] truncate">
                    {tr(appSettings.language, {
                      ru: 'История правок и варианты',
                      en: 'Edit History & Variants',
                      it: 'Cronologia Modifiche e Varianti',
                      es: 'Historial de Cambios y Variantes',
                      de: 'Änderungsverlauf & Varianten',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-0.5 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-40"
                    title={`${uiText.undos} (Ctrl+Z)`}
                  >
                    <Undo2 className="h-3 w-3" />
                    <span>{uiText.undos}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-0.5 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-40"
                    title={`${uiText.redos} (Ctrl+Y)`}
                  >
                    <Redo2 className="h-3 w-3" />
                    <span>{uiText.redos}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusHistoryPopoverOpen(false)}
                    className="rounded p-1 text-[#605E5C] hover:bg-[#EDEBE9] hover:text-[#181917]"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto p-3 space-y-3">
                {/* Active Project Quick Open Buttons */}
                {selectedProject && (
                  <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-2.5 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-[#181917] truncate">
                        {selectedProject.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#605E5C] shrink-0">
                        {(selectedProject.revisions || []).length} верс. ·{' '}
                        {(selectedProject.variants || []).length} вар.
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('projects');
                          setProjectHistoryPaneTab('history');
                          setProjectHistoryPaneOpen(true);
                          setStatusHistoryPopoverOpen(false);
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1]"
                      >
                        <History className="h-3 w-3" />
                        <span>
                          {tr(appSettings.language, {
                            ru: 'История формулы',
                            en: 'Formula History',
                            it: 'Cronologia Formula',
                            es: 'Historial Fórmula',
                            de: 'Formelverlauf',
                          })}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('projects');
                          setProjectHistoryPaneTab('variants');
                          setProjectHistoryPaneOpen(true);
                          setStatusHistoryPopoverOpen(false);
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1]"
                      >
                        <Layers className="h-3 w-3" />
                        <span>
                          {tr(appSettings.language, {
                            ru: 'Варианты (%)',
                            en: 'Variants (%)',
                            it: 'Varianti (%)',
                            es: 'Variantes (%)',
                            de: 'Varianten (%)',
                          })}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Session Undo / Redo Timeline */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#605E5C]">
                    {tr(appSettings.language, {
                      ru: `Действия в текущей сессии (отмена: ${undoCount}, возврат: ${redoCount})`,
                      en: `Session edits (undo: ${undoCount}, redo: ${redoCount})`,
                      it: `Modifiche sessione (annulla: ${undoCount}, ripeti: ${redoCount})`,
                      es: `Cambios de sesión (deshacer: ${undoCount}, rehacer: ${redoCount})`,
                      de: `Sitzungsschritte (Rückgängig: ${undoCount}, Wiederholen: ${redoCount})`,
                    })}
                  </div>

                  {pastStates.length === 0 && futureStates.length === 0 ? (
                    <div className="rounded border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-2.5 text-center text-[11px] text-[#605E5C]">
                      {tr(appSettings.language, {
                        ru: 'В текущей сессии правок пока не было. Любые изменения формул, вариантов или сырья появятся здесь.',
                        en: 'No session edits yet. Any changes to formulas, variants, or ingredients will appear here.',
                        it: 'Nessuna modifica nella sessione corrente.',
                        es: 'Aún no hay cambios en la sesión actual.',
                        de: 'Noch keine Änderungen in dieser Sitzung.',
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {futureStates.map((snap, fIdx) => {
                        const prevSnap = fIdx === 0 ? studio : futureStates[fIdx - 1];
                        const changedProj = snap.projects.find((p) => {
                          const oldP = prevSnap.projects.find((op) => op.id === p.id);
                          return !oldP || JSON.stringify(oldP) !== JSON.stringify(p);
                        });
                        const label = changedProj
                          ? `${tr(appSettings.language, {
                              ru: 'Правка проекта',
                              en: 'Project edit',
                              it: 'Modifica progetto',
                              es: 'Cambio en proyecto',
                              de: 'Projektänderung',
                            })}: «${changedProj.title}»`
                          : snap.ingredients.length !== prevSnap.ingredients.length ||
                            JSON.stringify(snap.ingredients) !== JSON.stringify(prevSnap.ingredients)
                          ? tr(appSettings.language, {
                              ru: 'Изменение в каталоге ингредиентов',
                              en: 'Ingredient catalog change',
                              it: 'Modifica catalogo ingredienti',
                              es: 'Cambio en catálogo de ingredientes',
                              de: 'Änderung im Rohstoffkatalog',
                            })
                          : tr(appSettings.language, {
                              ru: 'Изменение данных студии',
                              en: 'Studio data edit',
                              it: 'Modifica dati studio',
                              es: 'Cambio de datos',
                              de: 'Datenänderung',
                            });

                        return (
                          <button
                            key={`future-${fIdx}`}
                            type="button"
                            onClick={() => {
                              jumpToFuture(fIdx);
                              setToastMessage(t.changeRestored);
                            }}
                            className="w-full flex items-center justify-between gap-2 rounded border border-[#E1DFDD] bg-[#FAF9F8] px-2.5 py-1.5 text-left text-[11px] text-[#605E5C] hover:border-[var(--theme-accent)] hover:bg-white hover:text-[#181917] transition-colors"
                          >
                            <span className="truncate">↪ {label}</span>
                            <span className="shrink-0 font-mono text-[10px] text-[var(--theme-accent)]">
                              {tr(appSettings.language, {
                                ru: 'Вернуть',
                                en: 'Redo',
                                it: 'Ripeti',
                                es: 'Rehacer',
                                de: 'Wiederholen',
                              })}
                            </span>
                          </button>
                        );
                      })}

                      <div className="flex items-center justify-between rounded bg-[var(--theme-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--theme-accent)]">
                        <span>
                          ●{' '}
                          {tr(appSettings.language, {
                            ru: 'Текущее состояние',
                            en: 'Current state',
                            it: 'Stato attuale',
                            es: 'Estado actual',
                            de: 'Aktueller Stand',
                          })}
                        </span>
                        <span className="font-mono text-[10px]">Active</span>
                      </div>

                      {[...pastStates].reverse().map((snap, revIdx) => {
                        const actualPastIdx = pastStates.length - 1 - revIdx;
                        const nextSnap =
                          actualPastIdx === pastStates.length - 1
                            ? studio
                            : pastStates[actualPastIdx + 1];
                        const changedProj = nextSnap.projects.find((p) => {
                          const oldP = snap.projects.find((op) => op.id === p.id);
                          return !oldP || JSON.stringify(oldP) !== JSON.stringify(p);
                        });
                        const label = changedProj
                          ? `${tr(appSettings.language, {
                              ru: 'Правка проекта',
                              en: 'Project edit',
                              it: 'Modifica progetto',
                              es: 'Cambio en proyecto',
                              de: 'Projektänderung',
                            })}: «${changedProj.title}» (${changedProj.components.length} комп.)`
                          : nextSnap.ingredients.length !== snap.ingredients.length ||
                            JSON.stringify(nextSnap.ingredients) !== JSON.stringify(snap.ingredients)
                          ? tr(appSettings.language, {
                              ru: 'Изменение в каталоге ингредиентов',
                              en: 'Ingredient catalog change',
                              it: 'Modifica catalogo ingredienti',
                              es: 'Cambio en catálogo de ingredientes',
                              de: 'Änderung im Rohstoffkatalog',
                            })
                          : tr(appSettings.language, {
                              ru: 'Изменение данных студии',
                              en: 'Studio data edit',
                              it: 'Modifica dati studio',
                              es: 'Cambio de datos',
                              de: 'Datenänderung',
                            });

                        return (
                          <button
                            key={`past-${actualPastIdx}`}
                            type="button"
                            onClick={() => {
                              jumpToPast(actualPastIdx);
                              setToastMessage(t.changeUndone);
                            }}
                            className="w-full flex items-center justify-between gap-2 rounded border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-left text-[11px] text-[#323130] hover:border-[var(--theme-accent)] hover:bg-[#FAF9F8] transition-colors"
                          >
                            <span className="truncate">
                              #{actualPastIdx + 1} · {label}
                            </span>
                            <span className="shrink-0 font-mono text-[10px] text-[var(--theme-accent)]">
                              {tr(appSettings.language, {
                                ru: 'Откатить сюда',
                                en: 'Revert here',
                                it: 'Ripristina',
                                es: 'Revertir aquí',
                                de: 'Hierhin zurück',
                              })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Saved Project Revisions Across Projects */}
                <div className="space-y-1.5 pt-1 border-t border-[#EDEBE9]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#605E5C]">
                    {tr(appSettings.language, {
                      ru: 'Сохранённые версии и варианты проектов',
                      en: 'Saved Project Revisions & Variants',
                      it: 'Versioni e Varianti Salvate',
                      es: 'Versiones y Variantes Guardadas',
                      de: 'Gespeicherte Projektversionen & Varianten',
                    })}
                  </div>
                  <div className="space-y-1">
                    {projects.map((proj) => {
                      const revCount = (proj.revisions || []).length;
                      const varCount = (proj.variants || []).length;
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            openProjectInTab(proj.id, 'formula');
                            setProjectHistoryPaneTab(varCount > 0 && revCount === 0 ? 'variants' : 'history');
                            setProjectHistoryPaneOpen(true);
                            setStatusHistoryPopoverOpen(false);
                          }}
                          className="w-full flex items-center justify-between gap-2 rounded border border-[#E1DFDD] bg-[#FAF9F8] px-2.5 py-1.5 text-left text-[11px] hover:border-[var(--theme-accent)] hover:bg-white transition-colors"
                        >
                          <span className="font-medium text-[#181917] truncate">{proj.title}</span>
                          <span className="shrink-0 font-mono text-[10px] text-[#605E5C] tabular-nums">
                            {revCount} верс. · {varCount} вар.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 tabular-nums">
            <span>
              {uiText.projectsCount}: {projects.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {uiText.ingredientsCount}: {ingredients.length}
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setStatusHistoryPopoverOpen((v) => !v)}
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors cursor-pointer ${
                statusHistoryPopoverOpen
                  ? 'bg-[var(--theme-accent)] text-white'
                  : 'hover:bg-[#E1DFDD] text-[#323130]'
              }`}
              title={tr(appSettings.language, {
                ru: 'Нажмите, чтобы посмотреть историю правок и варианты',
                en: 'Click to view edit history and formula variants',
                it: 'Clicca per vedere la cronologia modifiche e le varianti',
                es: 'Haz clic para ver el historial de cambios y variantes',
                de: 'Klicken, um Änderungsverlauf und Varianten anzuzeigen',
              })}
            >
              <History className="h-3 w-3" />
              <span>
                {uiText.historyLabel}: {uiText.undos} {undoCount} / {uiText.redos} {redoCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1 pr-2 border-r border-[#D2D0CE]">
              <span className="px-1 text-[#605E5C]">
                {tr(appSettings.language, {
                  ru: 'Масштаб:',
                  en: 'Zoom:',
                  it: 'Zoom:',
                  es: 'Zoom:',
                  de: 'Zoom:',
                })}
              </span>
              {[80, 100, 120, 140].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoomPercent(z)}
                  className={`rounded px-1.5 py-0.5 font-mono tabular-nums transition-colors ${
                    zoomPercent === z
                      ? 'bg-[var(--theme-accent)] text-white'
                      : 'hover:bg-[#E1DFDD] text-[#323130]'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.max(50, z - 10))}
                disabled={zoomPercent <= 50}
                className="rounded p-1 hover:bg-[#E1DFDD] disabled:opacity-35"
                aria-label={t.zoomOutAria}
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="range"
                min={50}
                max={150}
                step={10}
                value={zoomPercent}
                onChange={(e) => setZoomPercent(Number(e.target.value))}
                aria-label={t.zoomSliderAria}
                className="hidden sm:block w-24 accent-[var(--theme-accent)]"
              />
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.min(150, z + 10))}
                disabled={zoomPercent >= 150}
                className="rounded p-1 hover:bg-[#E1DFDD] disabled:opacity-35"
                aria-label={t.zoomInAria}
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setZoomPercent(100)}
                className="w-11 rounded px-1 py-0.5 text-center font-mono tabular-nums hover:bg-[#E1DFDD]"
                title="100%"
              >
                {zoomPercent}%
              </button>
            </div>
          </div>
        </footer>
      )}

      {fileBackstageOpen && (
        <WordFileBackstage
            open={fileBackstageOpen}
            initialTab={fileBackstageTab}
            onClose={() => setFileBackstageOpen(false)}
            language={appSettings.language}
            onChangeLanguage={(language) => {
              setAppSettings((prev) => ({ ...prev, language }));
              commitStudio((prev) => localizeSeedSnapshot(prev, language));
              setToastMessage(APP_TEXT[language].languageSelected);
            }}
            currency={appSettings.currency}
            onChangeCurrency={(currency) => {
              setAppSettings((prev) => ({ ...prev, currency }));
              setToastMessage(t.currencyUpdated(currency));
            }}
            themeColor={appSettings.themeColor}
            onChangeThemeColor={(themeColor) => {
              setAppSettings((prev) => ({ ...prev, themeColor }));
              setToastMessage(t.themeColorUpdated);
            }}
            colorMode={appSettings.colorMode}
            onChangeColorMode={handleChangeColorMode}
            homeSections={appSettings.homeSections}
            onChangeHomeSections={(patch) => {
              setAppSettings((prev) => ({
                ...prev,
                homeSections: { ...prev.homeSections, ...patch },
              }));
            }}
            criticalStockGrams={appSettings.criticalStockGrams}
            onChangeCriticalStockGrams={(grams) =>
              setAppSettings((prev) => ({ ...prev, criticalStockGrams: grams }))
            }
            defaultConcentrateGrams={appSettings.defaultConcentrateGrams ?? 10}
            onChangeDefaultConcentrateGrams={(grams) =>
              setAppSettings((prev) => ({ ...prev, defaultConcentrateGrams: grams }))
            }
            bottleVolumesMl={appSettings.bottleVolumesMl ?? DEFAULT_BOTTLE_VOLUMES_ML}
            onChangeBottleVolumesMl={(volumes) =>
              setAppSettings((prev) => ({ ...prev, bottleVolumesMl: volumes }))
            }
            lastBackupAt={appSettings.lastBackupAt}
            selectedProject={selectedProject}
            projects={projects}
            ingredients={ingredients}
            estimates={estimates}
            purchases={purchases}
            sales={sales}
            library={library}
            counts={{
              projects: projects.length,
              ingredients: ingredients.length,
              estimates: estimates.length,
              purchases: purchases.length,
            }}
            onAddLibraryItem={handleAddLibraryItem}
            onUpdateLibraryItem={handleUpdateLibraryItem}
            onDeleteLibraryItem={handleDeleteLibraryItem}
            onAddLibraryItemToWishlist={handleAddLibraryItemToWishlist}
            onAddSale={handleAddSale}
            onImportSales={handleImportSales}
            onDeleteSale={handleDeleteSale}
            onOpenProjectsOverview={() => {
              setActiveSection('projects');
              setSelectedProjectId(null);
            }}
            onOpenProject={(projectId, tab = 'formula') => openProjectInTab(projectId, tab)}
            onOpenIngredients={() => setActiveSection('ingredients')}
            onOpenBudget={() => setActiveSection('budget')}
            onAcknowledgeMaceration={handleAcknowledgeMaceration}
            onAddMaceration={handleAddMaceration}
            onDeleteMaceration={handleDeleteMaceration}
            onCreateProject={handleCreateProject}
            onDuplicateProject={() => {
              if (selectedProject) handleDuplicateProject(selectedProject.id);
            }}
            onDeleteProject={() => {
              if (selectedProject) requestDeleteProject(selectedProject.id);
            }}
            onOpenFile={handleOpenFile}
            onSaveProjectJson={handleSaveCurrentProjectFile}
            onExportProjectPdf={handleExportProjectPdf}
            onExportProjectWordDoc={handleExportProjectWordDoc}
            onExportIngredientsExcel={() => void handleExportIngredientsExcel()}
            onExportSalesExcel={() => void handleExportSalesExcel()}
            onCreateBackup={handleExportStudioBackup}
            onRequestResetDemo={() =>
              setConfirmState({
                type: 'reset_demo',
                label: t.resetDemoLabel,
              })
            }
            onPrint={() => void handlePrintCurrentView()}
            onExportCurrentViewPdf={() => handleExportCurrentViewPdf()}
            isCapturingExport={isCapturingExport}
            onOpenCriticalStock={handleOpenCriticalStock}
            onOpenQuickSearch={() => setQuickSearchOpen(true)}
            onTabChange={setFileBackstageTab}
            onUpdateIngredient={(ing) => {
              commitStudio((prev) => ({
                ...prev,
                ingredients: prev.ingredients.map((i) => (i.id === ing.id ? ing : i)),
                library: ensureIngredientsInLibrary([ing], prev.library),
              }));
            }}
            onAddEstimateItem={(item) => {
              commitStudio((prev) => ({
                ...prev,
                estimates: [...prev.estimates, item],
              }));
              setToastMessage(t.budgetItemAdded);
            }}
            onDeleteEstimateItem={(id) => {
              const est = estimates.find((e) => e.id === id);
              setConfirmState({
                type: 'estimate',
                id,
                label: est?.ingredientName || t.fallbackBudgetItem,
              });
            }}
            onAddPurchaseRecord={(record) => {
              commitStudio((prev) => ({
                ...prev,
                purchases: [record, ...prev.purchases],
              }));
              setToastMessage(t.purchaseLogged);
            }}
            onDeletePurchaseRecord={(id) => {
              const pur = purchases.find((p) => p.id === id);
              setConfirmState({
                type: 'purchase',
                id,
                label: pur?.ingredientName || t.fallbackPurchaseRecord,
              });
            }}
            onUpdateProject={handleUpdateProject}
            onToast={setToastMessage}
            onCreateProjectFromFormula={handleCreateProjectFromFormula}
            onAppendFormulaToProject={handleAppendFormulaToProject}
            onAddStarterIngredientToCart={(spec, neededGrams) => {
              handleAddToShoppingCart(
                {
                  name: spec.name,
                  family: spec.family,
                  tier: spec.tier,
                  origin: 'synthetic',
                  dilutionPercent: spec.dilutionPercent,
                  olfactoryNotes: spec.note[appSettings.language],
                  requiredGrams: neededGrams,
                },
                selectedProject?.id
              );
            }}
            studioName={appSettings.studioName}
            onChangeStudioName={(studioName) =>
              setAppSettings((prev) => ({ ...prev, studioName }))
            }
            renderIngredientsCatalog={() => (
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                <div className="flex-1 min-w-0 w-full rounded-xl border border-[#E1DFDD] bg-white p-5 sm:p-6">
                  <IngredientsCatalog
                      ingredients={ingredients}
                      filteredIngredients={filteredIngredients}
                      library={library}
                      projects={projects}
                      viewSettings={viewSettings}
                      language={appSettings.language}
                      currency={appSettings.currency}
                      filters={ingredientFilters}
                      onChangeFilters={handleChangeIngredientFilters}
                      onResetFilters={handleResetIngredientFilters}
                      activeFiltersCount={activeIngredientFiltersCount}
                      statusCounts={ingredientStatusCounts}
                      filterPaneOpen={ingredientFilterPaneOpen}
                      onToggleFilterPane={() => setIngredientFilterPaneOpen((v) => !v)}
                      estimates={estimates}
                      onAddIngredient={(ing) => {
                        let wasAddedToEstimates = false;
                        commitStudio((prev) => {
                          const { nextEstimates, added } = syncOrderedToEstimates(ing, prev.estimates);
                          wasAddedToEstimates = added;
                          return {
                            ...prev,
                            ingredients: [ing, ...prev.ingredients],
                            library: ensureIngredientsInLibrary([ing], prev.library),
                            estimates: nextEstimates,
                          };
                        });
                        if (wasAddedToEstimates) {
                          setToastMessage(
                            tr(appSettings.language, {
                              ru: `«${ing.name}» заказан и автоматически добавлен в смету закупок`,
                              en: `"${ing.name}" marked as ordered and added to procurement budget`,
                              it: `"${ing.name}" ordinato e aggiunto automaticamente al budget`,
                              es: `"${ing.name}" pedido y añadido automáticamente al presupuesto`,
                              de: `„${ing.name}“ bestellt und automatisch zum Budget hinzugefügt`,
                            })
                          );
                        } else {
                          setToastMessage(t.ingredientAdded(ing.name));
                        }
                      }}
                      onUpdateIngredient={(ing) => {
                        let wasAddedToEstimates = false;
                        commitStudio((prev) => {
                          const { nextEstimates, added } = syncOrderedToEstimates(ing, prev.estimates);
                          wasAddedToEstimates = added;
                          return {
                            ...prev,
                            ingredients: prev.ingredients.map((i) => (i.id === ing.id ? ing : i)),
                            library: ensureIngredientsInLibrary([ing], prev.library),
                            estimates: nextEstimates,
                          };
                        });
                        if (wasAddedToEstimates) {
                          setToastMessage(
                            tr(appSettings.language, {
                              ru: `«${ing.name}» заказан и автоматически добавлен в смету закупок`,
                              en: `"${ing.name}" marked as ordered and added to procurement budget`,
                              it: `"${ing.name}" ordinato e aggiunto автоматически al budget`,
                              es: `"${ing.name}" pedido y añadido automáticamente al presupuesto`,
                              de: `„${ing.name}“ bestellt und автоматически zum Budget hinzugefügt`,
                            })
                          );
                        } else {
                          setToastMessage(t.ingredientUpdated);
                        }
                      }}
                      onDeleteIngredient={(id) => {
                        const ing = ingredients.find((i) => i.id === id);
                        setConfirmState({
                          type: 'ingredient',
                          id,
                          label: ing?.name || t.fallbackIngredient,
                        });
                      }}
                      onAddPurchaseRecord={(record) => {
                        commitStudio((prev) => ({
                          ...prev,
                          purchases: [record, ...prev.purchases],
                        }));
                        setToastMessage(t.movedToStockAndLogged);
                      }}
                      onAddEstimateItem={(item) => {
                        commitStudio((prev) => ({
                          ...prev,
                          estimates: [...prev.estimates, item],
                        }));
                        setToastMessage(t.ingredientAddedToBudget);
                      }}
                      purchases={purchases}
                      priceFluctuationThreshold={priceFluctuationThreshold}
                      onChangePriceFluctuationThreshold={setPriceFluctuationThreshold}
                      availableTags={availableIngredientTags}
                      tagCounts={ingredientTagCounts}
                      onCreateTag={handleCreateIngredientTag}
                      onDeleteTag={handleDeleteIngredientTag}
                      criticalStockGrams={appSettings.criticalStockGrams}
                      onChangeCriticalStockGrams={(grams) =>
                        setAppSettings((prev) => ({ ...prev, criticalStockGrams: grams }))
                      }
                    />
                </div>
                <IngredientsFilterPane
                  open={ingredientFilterPaneOpen}
                  onClose={() => setIngredientFilterPaneOpen(false)}
                  filters={ingredientFilters}
                  onChangeFilters={handleChangeIngredientFilters}
                  onResetFilters={handleResetIngredientFilters}
                  activeFiltersCount={activeIngredientFiltersCount}
                  totalCount={ingredients.length}
                  filteredCount={filteredIngredients.length}
                  statusCounts={ingredientStatusCounts}
                  uniqueSuppliers={uniqueIngredientSuppliers}
                  availableTags={availableIngredientTags}
                  tagCounts={ingredientTagCounts}
                  onCreateTag={handleCreateIngredientTag}
                  criticalStockGrams={appSettings.criticalStockGrams}
                  language={appSettings.language}
                />
              </div>
            )}
          />
      )}

      <ConfirmModal
        open={confirmState !== null}
        language={appSettings.language}
        title={
          confirmState?.type === 'reset_demo'
            ? t.confirmResetTitle
            : t.confirmDeleteTitle
        }
        description={
          confirmState?.type === 'reset_demo'
            ? t.confirmResetDesc
            : confirmState?.type === 'clear_formula'
              ? tr(appSettings.language, {
                  ru: `Удалить все ингредиенты из формулы «${confirmState.label}»? Действие можно отменить кнопкой «Отменить» (Ctrl+Z).`,
                  en: `Remove all ingredients from formula "${confirmState.label}"? You can undo this with Undo (Ctrl+Z).`,
                  it: `Rimuovere tutti gli ingredienti dalla formula "${confirmState.label}"? Puoi annullare con Ctrl+Z.`,
                  es: `¿Eliminar todos los ingredientes de la fórmula "${confirmState.label}"? Puedes deshacer con Ctrl+Z.`,
                  de: `Alle Rohstoffe aus der Formel „${confirmState.label}“ entfernen? Kann mit Strg+Z rückgängig gemacht werden.`,
                })
              : t.confirmDeleteDesc(confirmState?.label || '')
        }
        confirmLabel={
          confirmState?.type === 'reset_demo' ? t.resetBtn : t.deleteBtn
        }
        cancelLabel={t.cancelBtn}
        destructive
        onConfirm={handleExecuteConfirm}
        onCancel={() => setConfirmState(null)}
      />
      {pendingProjectPdf !== null && (
        <Suspense fallback={null}>
          <PdfProjectPagesModal
            open={pendingProjectPdf !== null}
            project={pendingProjectPdf?.job.project ?? null}
            estimates={estimates}
            language={appSettings.language}
            onConfirm={handleConfirmProjectPdfPages}
            onCancel={() => setPendingProjectPdf(null)}
          />
        </Suspense>
      )}
      {quickSearchOpen && (
        <IngredientQuickSearchModal
          open={quickSearchOpen}
          onClose={() => setQuickSearchOpen(false)}
          ingredients={ingredients}
          library={library}
          projects={projects}
          selectedProjectId={selectedProjectId}
          language={appSettings.language}
          currency={appSettings.currency}
          onSelectOpenInCatalog={handleOpenIngredientFromQuickSearch}
          onAddToProjectFormula={handleAddIngredientToFormulaFromQuickSearch}
          onAddMaterialToCatalog={(ing) => {
            commitStudio((prev) => ({
              ...prev,
              ingredients: [ing, ...prev.ingredients],
              library: ensureIngredientsInLibrary([ing], prev.library),
            }));
            setToastMessage(t.selectedIngredient(ing.name));
          }}
        />
      )}
      <OfflineIndicator language={appSettings.language} />

      {/* Print-Only Screenshot Pages */}
      {printScreenshotPages && printScreenshotPages.length > 0 && (
        <div id="print-screenshot-root" className="hidden print:block bg-white">
          {printScreenshotPages.map((src, idx) => (
            <div
              key={idx}
              className={idx < printScreenshotPages.length - 1 ? 'break-after-page' : ''}
            >
              <img
                src={src}
                alt={`Page ${idx + 1}`}
                className="block w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}

      {/* Off-Screen Interface-Free Multi-Sheet PDF Render Host */}
      {activePdfRequest && (
        <div
          ref={pdfHostRef}
          aria-hidden="true"
          className="fixed -left-[99999px] top-0 pointer-events-none select-none bg-[#FFFFFF]"
        >
          <Suspense fallback={null}>
            <PdfDocumentSheets job={activePdfRequest.job} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
