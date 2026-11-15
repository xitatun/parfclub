import * as XLSX from 'xlsx';
import { getSaleChannelLabel } from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  PerfumeProject,
  SaleChannel,
  SaleRecord,
} from '../types/perfume';
import { calculateFormulaSummary } from './calculations';
import { generateId, todayIsoDate } from './storage';

export interface SalesImportSkippedRow {
  rowNumber: number;
  reason: string;
}

export interface SalesImportParseResult {
  records: SaleRecord[];
  matchedProjectCount: number;
  skippedRows: SalesImportSkippedRow[];
  sheetName: string;
  totalRowsRead: number;
}

function estimateBottleCost(project: PerfumeProject, bottleMl: number): number {
  const summary = calculateFormulaSummary(project.components);
  const ratio =
    summary.totalWeightGrams > 0 && bottleMl > 0 ? bottleMl / summary.totalWeightGrams : 1;
  const liquidCost = summary.totalFormulaCost * ratio;
  const packaging = Math.max(0, Number(project.packagingCostPerUnit) || 0);
  return Math.round(liquidCost + packaging);
}

interface SalesExcelText {
  colDate: string;
  colProjectCode: string;
  colFragrance: string;
  colChannel: string;
  colBottleMl: string;
  colQtyPcs: string;
  colUnitPrice: (cur: AppCurrency) => string;
  colRevenue: (cur: AppCurrency) => string;
  colUnitCost: (cur: AppCurrency) => string;
  colProfit: (cur: AppCurrency) => string;
  colCustomer: string;
  colNotes: string;
  sheetJournal: string;
  sheetSummary: string;
  sheetGuide: string;
  exportFilename: (date: string) => string;
  templateFilename: string;
  reportTitle: string;
  exportDate: string;
  currency: string;
  keyMetrics: string;
  value: string;
  totalSalesRecords: string;
  bottlesSoldPcs: string;
  totalVolumeSoldMl: string;
  totalRevenueMetric: (cur: AppCurrency) => string;
  totalCogsMetric: (cur: AppCurrency) => string;
  grossProfitMetric: (cur: AppCurrency) => string;
  grossMarginPct: string;
  salesByFragrance: string;
  bottlesCol: string;
  volumeCol: string;
  monthlyBreakdown: string;
  mlUnit: string;
  guideTitle: string;
  guideSteps: [string, string, string, string];
  guideHeaders: [string, string, string, string];
  guideRows: [string, string, string, string][];
  studioCodesTitle: string;
  studioCodesHeaders: [string, string, string];
  sampleFallbackTitle: string;
  sampleOrder1: string;
  sampleNotes1: string;
  sampleItem2: string;
  sampleOrder2: string;
  sampleNotes2: string;
  noSheetsError: string;
  missingNameAndCode: string;
  missingPriceAndRevenue: string;
}

const SALES_EXCEL_TEXT: Record<AppLanguage, SalesExcelText> = {
  ru: {
    colDate: 'Дата',
    colProjectCode: 'Код проекта',
    colFragrance: 'Аромат / Позиция',
    colChannel: 'Канал продаж',
    colBottleMl: 'Объём (мл)',
    colQtyPcs: 'Кол-во (шт)',
    colUnitPrice: (cur) => `Цена за шт. (${cur})`,
    colRevenue: (cur) => `Выручка (${cur})`,
    colUnitCost: (cur) => `Себестоимость за шт. (${cur})`,
    colProfit: (cur) => `Прибыль (${cur})`,
    colCustomer: 'Клиент / Заказ',
    colNotes: 'Комментарий',
    sheetJournal: 'Журнал продаж',
    sheetSummary: 'Сводка',
    sheetGuide: 'Инструкция',
    exportFilename: (date) => `Статистика-продаж-Ателье-Эссенций-${date}.xlsx`,
    templateFilename: 'Шаблон-импорта-продаж-Ателье-Эссенций.xlsx',
    reportTitle: 'Ателье Эссенций — Отчёт по продажам',
    exportDate: 'Дата выгрузки',
    currency: 'Валюта',
    keyMetrics: 'Ключевой показатель',
    value: 'Значение',
    totalSalesRecords: 'Количество сделок',
    bottlesSoldPcs: 'Продано флаконов (шт.)',
    totalVolumeSoldMl: 'Суммарный объём (мл)',
    totalRevenueMetric: (cur) => `Общая выручка (${cur})`,
    totalCogsMetric: (cur) => `Себестоимость (${cur})`,
    grossProfitMetric: (cur) => `Валовая прибыль (${cur})`,
    grossMarginPct: 'Маржинальность (%)',
    salesByFragrance: 'Аромат',
    bottlesCol: 'Флаконов (шт.)',
    volumeCol: 'Объём (мл)',
    monthlyBreakdown: 'Месяц',
    mlUnit: 'мл',
    guideTitle: 'Как подготовить личную таблицу Excel для импорта продаж',
    guideSteps: [
      '1. Названия столбцов должны быть в 1-й строке первого листа (или листа «Журнал продаж»).',
      '2. Поддерживаются файлы .xlsx, .xls и .csv (UTF-8). Лишние столбцы в вашей таблице не мешают импорту.',
      '3. Если указать Код проекта (например, AE-01) и оставить Себестоимость пустой — программа сама рассчитает её по формуле и упаковке проекта.',
      '4. Достаточно указать либо «Цена за шт.», либо общую «Выручку» — второе значение посчитается автоматически.',
    ],
    guideHeaders: ['Название столбца (RU/EN/IT/ES/DE)', 'Обязательность', 'Формат и пример', 'Пояснение'],
    guideRows: [
      ['Дата / Date', 'Желательно', '2026-11-10 или 10.11.2026', 'Если пусто — подставится сегодняшняя дата'],
      ['Код проекта / Project Code', 'Необязательно', 'AE-01', 'Привязывает продажу к проекту и считает себестоимость'],
      ['Аромат / Позиция / Название', 'Обязательно*', 'Утренний кедр EDP 30 мл', '*Обязательно, если не указан Код проекта'],
      ['Канал продаж / Канал', 'Необязательно', 'Прямой заказ, Бутик, Маркетплейс, Ярмарка, Подарок', 'По умолчанию ставится «Прямой заказ»'],
      ['Объём (мл) / Формат', 'Необязательно', '30', 'По умолчанию берётся объём проекта или 30 мл'],
      ['Кол-во (шт) / Количество', 'Необязательно', '2', 'По умолчанию 1 шт.'],
      ['Цена за шт. / Цена', 'Желательно', '4500', 'Либо заполните столбец «Выручка»'],
      ['Выручка / Сумма', 'Необязательно', '9000', 'Если пусто — считается как Кол-во × Цена'],
      ['Себестоимость за шт. / Себест.', 'Необязательно', '980', 'Если пусто и указан проект — берётся из формулы'],
      ['Клиент / Заказ', 'Необязательно', 'Заказ №1084', 'Номер заказа, имя клиента или площадка'],
      ['Комментарий / Примечание', 'Необязательно', 'С подарочным атомайзером', 'Любая текстовая заметка'],
    ],
    studioCodesTitle: 'Коды ваших проектов в мастерской (для столбца «Код проекта»)',
    studioCodesHeaders: ['Код проекта', 'Название аромата', 'Базовый объём (мл)'],
    sampleFallbackTitle: 'Пример аромата EDP 30 мл',
    sampleOrder1: 'Заказ №101',
    sampleNotes1: 'Пример строки — замените на свои продажи',
    sampleItem2: 'Набор сэмплов 5×2 мл',
    sampleOrder2: 'Осенний маркет',
    sampleNotes2: 'Выручка посчитается автоматически, если оставить пустой',
    noSheetsError: 'В файле нет ни одного листа.',
    missingNameAndCode: 'Не указано название аромата и код проекта',
    missingPriceAndRevenue: 'Не указана ни цена за шт., ни выручка',
  },
  en: {
    colDate: 'Date',
    colProjectCode: 'Project Code',
    colFragrance: 'Fragrance / Item',
    colChannel: 'Sales Channel',
    colBottleMl: 'Bottle (ml)',
    colQtyPcs: 'Qty (pcs)',
    colUnitPrice: (cur) => `Unit Price (${cur})`,
    colRevenue: (cur) => `Revenue (${cur})`,
    colUnitCost: (cur) => `Unit Cost (${cur})`,
    colProfit: (cur) => `Profit (${cur})`,
    colCustomer: 'Customer / Order',
    colNotes: 'Notes',
    sheetJournal: 'Sales Journal',
    sheetSummary: 'Summary',
    sheetGuide: 'Guide',
    exportFilename: (date) => `Sales-Statistics-Atelier-Essences-${date}.xlsx`,
    templateFilename: 'Sales-Import-Template-Atelier-Essences.xlsx',
    reportTitle: 'Atelier Essences — Sales Statistics Report',
    exportDate: 'Export Date',
    currency: 'Currency',
    keyMetrics: 'Key Metrics',
    value: 'Value',
    totalSalesRecords: 'Total Sales Records',
    bottlesSoldPcs: 'Bottles Sold (pcs)',
    totalVolumeSoldMl: 'Total Volume Sold (ml)',
    totalRevenueMetric: (cur) => `Total Revenue (${cur})`,
    totalCogsMetric: (cur) => `Total COGS (${cur})`,
    grossProfitMetric: (cur) => `Gross Profit (${cur})`,
    grossMarginPct: 'Gross Margin (%)',
    salesByFragrance: 'Sales by Fragrance',
    bottlesCol: 'Bottles (pcs)',
    volumeCol: 'Volume (ml)',
    monthlyBreakdown: 'Monthly Breakdown',
    mlUnit: 'ml',
    guideTitle: 'How to Prepare Your Personal Sales Table for Import',
    guideSteps: [
      '1. Keep the header row in row 1 on the first sheet (or "Sales Journal" sheet).',
      '2. Supported file formats: .xlsx, .xls, and .csv (UTF-8).',
      '3. If you specify Project Code (e.g. AE-01) and leave Unit Cost blank, the app will auto-calculate bottle cost from your project formula + packaging.',
      '4. You can fill either Unit Price OR total Revenue — the missing value will be calculated automatically.',
    ],
    guideHeaders: ['Column Header (EN/RU/IT/ES/DE accepted)', 'Required?', 'Format / Example', 'Notes'],
    guideRows: [
      ['Date / Дата', 'Recommended', '2026-11-10 or 10.11.2026', 'If empty, today is used'],
      ['Project Code / Код проекта', 'Optional', 'AE-01', 'Links sale to project & auto-calculates cost'],
      ['Fragrance / Аромат / Позиция', 'Required*', 'Morning Cedar EDP 30 ml', '*Required unless Project Code is provided'],
      ['Sales Channel / Канал продаж', 'Optional', 'Direct / Boutique / Marketplace / Fair / Gift', 'Defaults to Direct order if omitted'],
      ['Bottle (ml) / Объём (мл)', 'Optional', '30', 'Defaults to project bottle size or 30 ml'],
      ['Qty (pcs) / Кол-во (шт)', 'Optional', '2', 'Defaults to 1'],
      ['Unit Price / Цена за шт.', 'Recommended', '4500', 'Or provide total Revenue instead'],
      ['Revenue / Выручка', 'Optional', '9000', 'Auto-calculated as Qty × Unit Price if blank'],
      ['Unit Cost / Себестоимость за шт.', 'Optional', '980', 'Auto-estimated if linked to project and left blank'],
      ['Customer / Order / Клиент / Заказ', 'Optional', 'Order #1084', 'Order number or buyer name'],
      ['Notes / Комментарий', 'Optional', 'Gift wrap included', 'Any comment'],
    ],
    studioCodesTitle: 'Your Current Studio Project Codes (for Project Code column)',
    studioCodesHeaders: ['Project Code', 'Fragrance Title', 'Default Bottle (ml)'],
    sampleFallbackTitle: 'Sample Fragrance EDP 30 ml',
    sampleOrder1: 'Order #101',
    sampleNotes1: 'Example row — replace or delete before importing',
    sampleItem2: 'Discovery Sample Set 5×2 ml',
    sampleOrder2: 'Weekend Market',
    sampleNotes2: 'Revenue will be calculated automatically',
    noSheetsError: 'The spreadsheet has no worksheets.',
    missingNameAndCode: 'Missing fragrance name and project code',
    missingPriceAndRevenue: 'Missing both Unit Price and Revenue',
  },
  it: {
    colDate: 'Data',
    colProjectCode: 'Codice progetto',
    colFragrance: 'Fragranza / Articolo',
    colChannel: 'Canale di vendita',
    colBottleMl: 'Flacone (ml)',
    colQtyPcs: 'Qtà (pz)',
    colUnitPrice: (cur) => `Prezzo unit. (${cur})`,
    colRevenue: (cur) => `Ricavo (${cur})`,
    colUnitCost: (cur) => `Costo unit. (${cur})`,
    colProfit: (cur) => `Profitto (${cur})`,
    colCustomer: 'Cliente / Ordine',
    colNotes: 'Note',
    sheetJournal: 'Registro vendite',
    sheetSummary: 'Riepilogo',
    sheetGuide: 'Guida',
    exportFilename: (date) => `Statistiche-vendite-Atelier-Essences-${date}.xlsx`,
    templateFilename: 'Modello-importazione-vendite-Atelier-Essences.xlsx',
    reportTitle: 'Atelier Essences — Rapporto vendite',
    exportDate: 'Data esportazione',
    currency: 'Valuta',
    keyMetrics: 'Indicatori chiave',
    value: 'Valore',
    totalSalesRecords: 'Totale vendite',
    bottlesSoldPcs: 'Flaconi venduti (pz)',
    totalVolumeSoldMl: 'Volume totale (ml)',
    totalRevenueMetric: (cur) => `Ricavi totali (${cur})`,
    totalCogsMetric: (cur) => `Costo del venduto (${cur})`,
    grossProfitMetric: (cur) => `Utile lordo (${cur})`,
    grossMarginPct: 'Margine lordo (%)',
    salesByFragrance: 'Vendite per fragranza',
    bottlesCol: 'Flaconi (pz)',
    volumeCol: 'Volume (ml)',
    monthlyBreakdown: 'Riepilogo mensile',
    mlUnit: 'ml',
    guideTitle: 'Come preparare la tabella Excel per importare le vendite',
    guideSteps: [
      '1. Mantieni le intestazioni nella riga 1 del primo foglio (o del foglio "Registro vendite").',
      '2. Formati supportati: .xlsx, .xls e .csv (UTF-8).',
      '3. Se indichi il Codice progetto (es. AE-01) e lasci vuoto il Costo unit., il programma lo calcola dalla formula e dal confezionamento.',
      '4. Basta compilare Prezzo unit. OPPURE Ricavo totale — il valore mancante verrà calcolato automaticamente.',
    ],
    guideHeaders: ['Intestazione colonna (IT/EN/RU/ES/DE)', 'Obbligatoria?', 'Formato / Esempio', 'Note'],
    guideRows: [
      ['Data / Date', 'Consigliata', '2026-11-10 o 10.11.2026', 'Se vuoto, usa la data odierna'],
      ['Codice progetto / Project Code', 'Facoltativa', 'AE-01', 'Collega la vendita al progetto e calcola il costo'],
      ['Fragranza / Articolo', 'Obbligatoria*', 'Cedro del Mattino EDP 30 ml', '*Obbligatoria se manca il Codice progetto'],
      ['Canale di vendita', 'Facoltativa', 'Diretto, Boutique, Marketplace, Fiera, Omaggio', 'Predefinito: Ordine diretto'],
      ['Flacone (ml)', 'Facoltativa', '30', 'Predefinito: formato del progetto o 30 ml'],
      ['Qtà (pz)', 'Facoltativa', '2', 'Predefinito: 1'],
      ['Prezzo unit.', 'Consigliata', '4500', 'Oppure indica il Ricavo totale'],
      ['Ricavo', 'Facoltativa', '9000', 'Calcolato come Qtà × Prezzo se vuoto'],
      ['Costo unit.', 'Facoltativa', '980', 'Stimato dal progetto se collegato e lasciato vuoto'],
      ['Cliente / Ordine', 'Facoltativa', 'Ordine #1084', 'Numero ordine o nome cliente'],
      ['Note', 'Facoltativa', 'Confezione regalo', 'Qualsiasi annotazione'],
    ],
    studioCodesTitle: 'Codici dei progetti nel tuo atelier (per la colonna Codice progetto)',
    studioCodesHeaders: ['Codice progetto', 'Nome fragranza', 'Formato base (ml)'],
    sampleFallbackTitle: 'Fragranza esempio EDP 30 ml',
    sampleOrder1: 'Ordine #101',
    sampleNotes1: 'Riga di esempio — sostituisci o elimina prima di importare',
    sampleItem2: 'Set campioncini 5×2 ml',
    sampleOrder2: 'Mercatino weekend',
    sampleNotes2: 'Il ricavo viene calcolato automaticamente',
    noSheetsError: 'Il file non contiene alcun foglio di lavoro.',
    missingNameAndCode: 'Mancano il nome della fragranza e il codice progetto',
    missingPriceAndRevenue: 'Mancano sia il prezzo unitario che il ricavo',
  },
  es: {
    colDate: 'Fecha',
    colProjectCode: 'Código de proyecto',
    colFragrance: 'Fragancia / Artículo',
    colChannel: 'Canal de venta',
    colBottleMl: 'Frasco (ml)',
    colQtyPcs: 'Cant. (uds)',
    colUnitPrice: (cur) => `Precio unit. (${cur})`,
    colRevenue: (cur) => `Ingresos (${cur})`,
    colUnitCost: (cur) => `Coste unit. (${cur})`,
    colProfit: (cur) => `Beneficio (${cur})`,
    colCustomer: 'Cliente / Pedido',
    colNotes: 'Notas',
    sheetJournal: 'Registro de ventas',
    sheetSummary: 'Resumen',
    sheetGuide: 'Guía',
    exportFilename: (date) => `Estadisticas-ventas-Atelier-Essences-${date}.xlsx`,
    templateFilename: 'Plantilla-importacion-ventas-Atelier-Essences.xlsx',
    reportTitle: 'Atelier Essences — Informe de ventas',
    exportDate: 'Fecha de exportación',
    currency: 'Moneda',
    keyMetrics: 'Métricas clave',
    value: 'Valor',
    totalSalesRecords: 'Total de ventas',
    bottlesSoldPcs: 'Frascos vendidos (uds)',
    totalVolumeSoldMl: 'Volumen total (ml)',
    totalRevenueMetric: (cur) => `Ingresos totales (${cur})`,
    totalCogsMetric: (cur) => `Coste de ventas (${cur})`,
    grossProfitMetric: (cur) => `Beneficio bruto (${cur})`,
    grossMarginPct: 'Margen bruto (%)',
    salesByFragrance: 'Ventas por fragancia',
    bottlesCol: 'Frascos (uds)',
    volumeCol: 'Volumen (ml)',
    monthlyBreakdown: 'Desglose mensual',
    mlUnit: 'ml',
    guideTitle: 'Cómo preparar tu tabla Excel para importar ventas',
    guideSteps: [
      '1. Mantén los encabezados en la fila 1 de la primera hoja (o la hoja "Registro de ventas").',
      '2. Formatos admitidos: .xlsx, .xls y .csv (UTF-8).',
      '3. Si indicas el Código de proyecto (ej. AE-01) y dejas vacío el Coste unit., la app lo calcula con tu fórmula y envase.',
      '4. Puedes rellenar Precio unit. O Ingresos totales — el valor faltante se calculará automáticamente.',
    ],
    guideHeaders: ['Encabezado (ES/EN/RU/IT/DE)', '¿Obligatorio?', 'Formato / Ejemplo', 'Notas'],
    guideRows: [
      ['Fecha / Date', 'Recomendado', '2026-11-10 o 10.11.2026', 'Si está vacío, se usa la fecha de hoy'],
      ['Código de proyecto / Project Code', 'Opcional', 'AE-01', 'Vincula la venta al proyecto y calcula el coste'],
      ['Fragancia / Artículo', 'Obligatorio*', 'Cedro de Mañana EDP 30 ml', '*Obligatorio si no hay Código de proyecto'],
      ['Canal de venta', 'Opcional', 'Directo, Boutique, Marketplace, Feria, Regalo', 'Por defecto: Pedido directo'],
      ['Frasco (ml)', 'Opcional', '30', 'Por defecto: tamaño del proyecto o 30 ml'],
      ['Cant. (uds)', 'Opcional', '2', 'Por defecto: 1'],
      ['Precio unit.', 'Recomendado', '4500', 'O indica los Ingresos totales'],
      ['Ingresos', 'Opcional', '9000', 'Calculado como Cant. × Precio si está vacío'],
      ['Coste unit.', 'Opcional', '980', 'Estimado desde el proyecto si se deja vacío'],
      ['Cliente / Pedido', 'Opcional', 'Pedido #1084', 'Número de pedido o nombre del cliente'],
      ['Notas', 'Opcional', 'Con envoltorio de regalo', 'Cualquier comentario'],
    ],
    studioCodesTitle: 'Códigos de tus proyectos del taller (para Código de proyecto)',
    studioCodesHeaders: ['Código de proyecto', 'Nombre de la fragancia', 'Frasco base (ml)'],
    sampleFallbackTitle: 'Fragancia de ejemplo EDP 30 ml',
    sampleOrder1: 'Pedido #101',
    sampleNotes1: 'Fila de ejemplo — reemplaza o elimina antes de importar',
    sampleItem2: 'Set de muestras 5×2 ml',
    sampleOrder2: 'Mercado de fin de semana',
    sampleNotes2: 'Los ingresos se calcularán automáticamente',
    noSheetsError: 'El archivo no contiene ninguna hoja.',
    missingNameAndCode: 'Falta el nombre de la fragancia y el código de proyecto',
    missingPriceAndRevenue: 'Faltan tanto el precio unitario como los ingresos',
  },
  de: {
    colDate: 'Datum',
    colProjectCode: 'Projektcode',
    colFragrance: 'Duft / Artikel',
    colChannel: 'Vertriebskanal',
    colBottleMl: 'Flakon (ml)',
    colQtyPcs: 'Menge (Stk)',
    colUnitPrice: (cur) => `Stückpreis (${cur})`,
    colRevenue: (cur) => `Umsatz (${cur})`,
    colUnitCost: (cur) => `Stückkosten (${cur})`,
    colProfit: (cur) => `Gewinn (${cur})`,
    colCustomer: 'Kunde / Bestellung',
    colNotes: 'Notizen',
    sheetJournal: 'Verkaufsjournal',
    sheetSummary: 'Zusammenfassung',
    sheetGuide: 'Anleitung',
    exportFilename: (date) => `Verkaufsstatistik-Atelier-Essences-${date}.xlsx`,
    templateFilename: 'Verkaufsimport-Vorlage-Atelier-Essences.xlsx',
    reportTitle: 'Atelier Essences — Verkaufsbericht',
    exportDate: 'Exportdatum',
    currency: 'Währung',
    keyMetrics: 'Kennzahlen',
    value: 'Wert',
    totalSalesRecords: 'Anzahl Verkäufe',
    bottlesSoldPcs: 'Verkaufte Flakons (Stk)',
    totalVolumeSoldMl: 'Gesamtvolumen (ml)',
    totalRevenueMetric: (cur) => `Gesamtumsatz (${cur})`,
    totalCogsMetric: (cur) => `Wareneinsatz (${cur})`,
    grossProfitMetric: (cur) => `Bruttogewinn (${cur})`,
    grossMarginPct: 'Bruttomarge (%)',
    salesByFragrance: 'Umsatz nach Duft',
    bottlesCol: 'Flakons (Stk)',
    volumeCol: 'Volumen (ml)',
    monthlyBreakdown: 'Monatsübersicht',
    mlUnit: 'ml',
    guideTitle: 'So bereiten Sie Ihre Excel-Tabelle für den Verkaufsimport vor',
    guideSteps: [
      '1. Belassen Sie die Spaltenüberschriften in Zeile 1 des ersten Blatts (oder im Blatt „Verkaufsjournal“).',
      '2. Unterstützte Formate: .xlsx, .xls und .csv (UTF-8).',
      '3. Wenn Sie den Projektcode (z. B. AE-01) angeben und Stückkosten leer lassen, berechnet die App diese aus Formel + Verpackung.',
      '4. Sie können entweder Stückpreis ODER Umsatz ausfüllen — der fehlende Wert wird automatisch berechnet.',
    ],
    guideHeaders: ['Spaltenname (DE/EN/RU/IT/ES)', 'Erforderlich?', 'Format / Beispiel', 'Hinweise'],
    guideRows: [
      ['Datum / Date', 'Empfohlen', '2026-11-10 oder 10.11.2026', 'Wenn leer, wird das heutige Datum verwendet'],
      ['Projektcode / Project Code', 'Optional', 'AE-01', 'Verknüpft den Verkauf mit dem Projekt'],
      ['Duft / Artikel', 'Erforderlich*', 'Morgenzeder EDP 30 ml', '*Erforderlich, falls kein Projektcode angegeben'],
      ['Vertriebskanal', 'Optional', 'Direkt, Boutique, Marktplatz, Messe, Geschenk', 'Standard: Direktbestellung'],
      ['Flakon (ml)', 'Optional', '30', 'Standard: Projektgröße oder 30 ml'],
      ['Menge (Stk)', 'Optional', '2', 'Standard: 1'],
      ['Stückpreis', 'Empfohlen', '4500', 'Oder stattdessen Gesamtumsatz angeben'],
      ['Umsatz', 'Optional', '9000', 'Wird als Menge × Preis berechnet, falls leer'],
      ['Stückkosten', 'Optional', '980', 'Automatisch geschätzt bei Projektverknüpfung'],
      ['Kunde / Bestellung', 'Optional', 'Bestellung #1084', 'Bestellnummer oder Kundenname'],
      ['Notizen', 'Optional', 'Mit Geschenkverpackung', 'Beliebiger Kommentar'],
    ],
    studioCodesTitle: 'Ihre Projektcodes im Atelier (für Spalte Projektcode)',
    studioCodesHeaders: ['Projektcode', 'Duftname', 'Standard-Flakon (ml)'],
    sampleFallbackTitle: 'Beispiel-Duft EDP 30 ml',
    sampleOrder1: 'Bestellung #101',
    sampleNotes1: 'Beispielzeile — vor dem Import ersetzen oder löschen',
    sampleItem2: 'Probenset 5×2 ml',
    sampleOrder2: 'Wochenendmarkt',
    sampleNotes2: 'Der Umsatz wird automatisch berechnet',
    noSheetsError: 'Die Tabelle enthält keine Arbeitsblätter.',
    missingNameAndCode: 'Duftname und Projektcode fehlen',
    missingPriceAndRevenue: 'Stückpreis und Umsatz fehlen beide',
  },
};

export function exportSalesToExcel(
  sales: SaleRecord[],
  projects: PerfumeProject[],
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
): void {
  const t = SALES_EXCEL_TEXT[lang];
  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const sorted = [...sales].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  // Sheet 1: Sales Journal
  const journalRows = sorted.map((s) => {
    const proj = s.projectId ? projectMap.get(s.projectId) : undefined;
    const unitCost = Number(s.unitCost) || 0;
    const totalCost = Number((unitCost * s.quantity).toFixed(2));
    const profit = Number((s.totalRevenue - totalCost).toFixed(2));

    return {
      [t.colDate]: s.date,
      [t.colProjectCode]: proj?.code || '',
      [t.colFragrance]: s.fragranceName,
      [t.colChannel]: getSaleChannelLabel(s.channel, lang),
      [t.colBottleMl]: s.bottleMl,
      [t.colQtyPcs]: s.quantity,
      [t.colUnitPrice(currency)]: s.unitPrice,
      [t.colRevenue(currency)]: s.totalRevenue,
      [t.colUnitCost(currency)]: unitCost,
      [t.colProfit(currency)]: profit,
      [t.colCustomer]: s.customerOrOrder || '',
      [t.colNotes]: s.notes || '',
    };
  });

  const journalSheet = XLSX.utils.json_to_sheet(
    journalRows.length > 0
      ? journalRows
      : [
          {
            [t.colDate]: '',
            [t.colProjectCode]: '',
            [t.colFragrance]: '',
            [t.colChannel]: '',
            [t.colBottleMl]: '',
            [t.colQtyPcs]: '',
            [t.colUnitPrice(currency)]: '',
            [t.colRevenue(currency)]: '',
            [t.colUnitCost(currency)]: '',
            [t.colProfit(currency)]: '',
            [t.colCustomer]: '',
            [t.colNotes]: '',
          },
        ]
  );

  journalSheet['!cols'] = [
    { wch: 13 },
    { wch: 14 },
    { wch: 36 },
    { wch: 22 },
    { wch: 13 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 24 },
    { wch: 36 },
  ];

  // Sheet 2: Summary Analytics
  let totalRevenue = 0;
  let totalCost = 0;
  let totalUnits = 0;
  let totalVolumeMl = 0;
  const byFragrance = new Map<
    string,
    { name: string; code: string; units: number; volumeMl: number; revenue: number; cost: number }
  >();
  const byMonth = new Map<string, { month: string; units: number; revenue: number; cost: number }>();

  for (const s of sorted) {
    const qty = Math.max(0, Number(s.quantity) || 0);
    const rev = Math.max(0, Number(s.totalRevenue) || 0);
    const cost = Math.max(0, Number(s.unitCost) || 0) * qty;
    const ml = Math.max(0, Number(s.bottleMl) || 0);
    totalRevenue += rev;
    totalCost += cost;
    totalUnits += qty;
    totalVolumeMl += ml * qty;

    const proj = s.projectId ? projectMap.get(s.projectId) : undefined;
    const fKey = proj ? proj.id : s.fragranceName.trim().toLowerCase();
    const fEntry = byFragrance.get(fKey);
    if (fEntry) {
      fEntry.units += qty;
      fEntry.volumeMl += ml * qty;
      fEntry.revenue += rev;
      fEntry.cost += cost;
    } else {
      byFragrance.set(fKey, {
        name: proj ? proj.title : s.fragranceName,
        code: proj ? proj.code : '—',
        units: qty,
        volumeMl: ml * qty,
        revenue: rev,
        cost,
      });
    }

    const monthKey = (s.date || '').slice(0, 7) || '—';
    const mEntry = byMonth.get(monthKey);
    if (mEntry) {
      mEntry.units += qty;
      mEntry.revenue += rev;
      mEntry.cost += cost;
    } else {
      byMonth.set(monthKey, { month: monthKey, units: qty, revenue: rev, cost });
    }
  }

  const grossProfit = totalRevenue - totalCost;
  const marginPct = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;

  const summaryAoa: (string | number)[][] = [
    [t.reportTitle, '', '', '', ''],
    [t.exportDate, todayIsoDate(), t.currency, currency, ''],
    [],
    [t.keyMetrics, t.value],
    [t.totalSalesRecords, sorted.length],
    [t.bottlesSoldPcs, totalUnits],
    [t.totalVolumeSoldMl, totalVolumeMl],
    [t.totalRevenueMetric(currency), Number(totalRevenue.toFixed(2))],
    [t.totalCogsMetric(currency), Number(totalCost.toFixed(2))],
    [t.grossProfitMetric(currency), Number(grossProfit.toFixed(2))],
    [t.grossMarginPct, marginPct],
    [],
    [
      t.salesByFragrance,
      t.colProjectCode,
      t.bottlesCol,
      t.volumeCol,
      t.colRevenue(currency),
      t.colProfit(currency),
    ],
    ...Array.from(byFragrance.values())
      .sort((a, b) => b.revenue - a.revenue)
      .map((f) => [
        f.name,
        f.code,
        f.units,
        f.volumeMl,
        Number(f.revenue.toFixed(2)),
        Number((f.revenue - f.cost).toFixed(2)),
      ]),
    [],
    [t.monthlyBreakdown, t.bottlesCol, t.colRevenue(currency), t.colProfit(currency)],
    ...Array.from(byMonth.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => [
        m.month,
        m.units,
        Number(m.revenue.toFixed(2)),
        Number((m.revenue - m.cost).toFixed(2)),
      ]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryAoa);
  summarySheet['!cols'] = [
    { wch: 36 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 18 },
    { wch: 18 },
  ];

  // Sheet 3: Guide
  const guideSheet = buildGuideWorksheet(projects, lang);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, journalSheet, t.sheetJournal);
  XLSX.utils.book_append_sheet(workbook, summarySheet, t.sheetSummary);
  XLSX.utils.book_append_sheet(workbook, guideSheet, t.sheetGuide);

  XLSX.writeFile(workbook, t.exportFilename(todayIsoDate()));
}

function buildGuideWorksheet(projects: PerfumeProject[], lang: AppLanguage): XLSX.WorkSheet {
  const t = SALES_EXCEL_TEXT[lang];
  const rows: (string | number)[][] = [
    [t.guideTitle],
    ...t.guideSteps.map((step) => [step]),
    [],
    t.guideHeaders,
    ...t.guideRows,
    [],
    [t.studioCodesTitle],
    t.studioCodesHeaders,
    ...projects.map((p) => [p.code, p.title, p.targetBottleMl]),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = [{ wch: 36 }, { wch: 20 }, { wch: 44 }, { wch: 52 }];
  return sheet;
}

export function downloadSalesTemplateExcel(
  projects: PerfumeProject[],
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
): void {
  const t = SALES_EXCEL_TEXT[lang];
  const firstProj = projects[0];
  const today = todayIsoDate();

  const sampleRows = [
    {
      [t.colDate]: today,
      [t.colProjectCode]: firstProj?.code || 'AE-01',
      [t.colFragrance]: firstProj
        ? `${firstProj.title} (${firstProj.targetConcentration} ${firstProj.targetBottleMl} ${t.mlUnit})`
        : t.sampleFallbackTitle,
      [t.colChannel]: getSaleChannelLabel('direct', lang),
      [t.colBottleMl]: firstProj?.targetBottleMl || 30,
      [t.colQtyPcs]: 2,
      [t.colUnitPrice(currency)]: 4500,
      [t.colRevenue(currency)]: 9000,
      [t.colUnitCost(currency)]: firstProj
        ? estimateBottleCost(firstProj, firstProj.targetBottleMl || 30)
        : 950,
      [t.colCustomer]: t.sampleOrder1,
      [t.colNotes]: t.sampleNotes1,
    },
    {
      [t.colDate]: today,
      [t.colProjectCode]: '',
      [t.colFragrance]: t.sampleItem2,
      [t.colChannel]: getSaleChannelLabel('fair', lang),
      [t.colBottleMl]: 10,
      [t.colQtyPcs]: 1,
      [t.colUnitPrice(currency)]: 1800,
      [t.colRevenue(currency)]: '',
      [t.colUnitCost(currency)]: 420,
      [t.colCustomer]: t.sampleOrder2,
      [t.colNotes]: t.sampleNotes2,
    },
  ];

  const dataSheet = XLSX.utils.json_to_sheet(sampleRows);
  dataSheet['!cols'] = [
    { wch: 13 },
    { wch: 14 },
    { wch: 36 },
    { wch: 20 },
    { wch: 13 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 24 },
    { wch: 22 },
    { wch: 40 },
  ];

  const guideSheet = buildGuideWorksheet(projects, lang);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, dataSheet, t.sheetJournal);
  XLSX.utils.book_append_sheet(workbook, guideSheet, t.sheetGuide);

  XLSX.writeFile(workbook, t.templateFilename);
}

// --- Parsing helpers ---

function normalizeHeader(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // strip units like (₽), (мл), (pcs)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

type CanonicalField =
  | 'date'
  | 'projectCode'
  | 'fragranceName'
  | 'channel'
  | 'bottleMl'
  | 'quantity'
  | 'unitPrice'
  | 'totalRevenue'
  | 'unitCost'
  | 'customerOrOrder'
  | 'notes';

function mapHeaderToField(header: string): CanonicalField | null {
  const h = normalizeHeader(header);
  if (!h) return null;

  if (
    h === 'дата' ||
    h === 'дата продажи' ||
    h === 'date' ||
    h === 'sale date' ||
    h === 'дата заказа' ||
    h === 'data' ||
    h === 'fecha' ||
    h === 'datum'
  ) {
    return 'date';
  }
  if (
    h === 'код проекта' ||
    h === 'проект' ||
    h === 'код' ||
    h === 'project code' ||
    h === 'project' ||
    h === 'sku' ||
    h === 'артикул' ||
    h === 'codice progetto' ||
    h === 'código de proyecto' ||
    h === 'codigo de proyecto' ||
    h === 'projektcode'
  ) {
    return 'projectCode';
  }
  if (
    h.includes('аромат') ||
    h.includes('позиц') ||
    h.includes('назван') ||
    h.includes('наимен') ||
    h.includes('товар') ||
    h.includes('парфюм') ||
    h.includes('fragrance') ||
    h.includes('perfume') ||
    h.includes('item') ||
    h.includes('product') ||
    h.includes('fragranz') ||
    h.includes('articol') ||
    h.includes('fraganc') ||
    h.includes('artícul') ||
    h.includes('articul') ||
    h.includes('duft') ||
    h.includes('artikel') ||
    h === 'name'
  ) {
    return 'fragranceName';
  }
  if (
    h.includes('канал') ||
    h.includes('площад') ||
    h.includes('источн') ||
    h.includes('channel') ||
    h.includes('source') ||
    h.includes('platform') ||
    h.includes('canal') ||
    h.includes('kanal')
  ) {
    return 'channel';
  }
  if (
    h.includes('объём') ||
    h.includes('объем') ||
    h.includes('формат') ||
    h === 'мл' ||
    h.includes('bottle') ||
    h.includes('volume') ||
    h.includes('flacon') ||
    h.includes('frasco') ||
    h.includes('flakon') ||
    h.includes('volumen') ||
    h === 'ml' ||
    h === 'size'
  ) {
    return 'bottleMl';
  }
  if (
    h.includes('кол во') ||
    h.includes('количество') ||
    h === 'шт' ||
    h.includes('qty') ||
    h.includes('quantity') ||
    h.includes('units') ||
    h.includes('quantit') ||
    h.includes('qtà') ||
    h.includes('qta') ||
    h.includes('cant') ||
    h.includes('menge') ||
    h.includes('anzahl') ||
    h === 'pcs' ||
    h === 'pz' ||
    h === 'uds' ||
    h === 'stk'
  ) {
    return 'quantity';
  }
  if (
    h.includes('себест') ||
    h.includes('затрат') ||
    h.includes('расход') ||
    h.includes('cost') ||
    h.includes('kosten') ||
    h === 'cogs'
  ) {
    return 'unitCost';
  }
  if (
    h.includes('выручк') ||
    h.includes('сумм') ||
    h.includes('итог') ||
    h.includes('revenue') ||
    h.includes('total') ||
    h.includes('amount') ||
    h.includes('ricav') ||
    h.includes('ingres') ||
    h.includes('umsatz')
  ) {
    return 'totalRevenue';
  }
  if (
    h.includes('цен') ||
    h.includes('прайс') ||
    h.includes('price') ||
    h.includes('prezz') ||
    h.includes('preci') ||
    h.includes('preis')
  ) {
    return 'unitPrice';
  }
  if (
    h.includes('клиент') ||
    h.includes('покупат') ||
    h.includes('заказ') ||
    h.includes('customer') ||
    h.includes('client') ||
    h.includes('buyer') ||
    h.includes('order') ||
    h.includes('ordin') ||
    h.includes('pedid') ||
    h.includes('kund') ||
    h.includes('bestell')
  ) {
    return 'customerOrOrder';
  }
  if (
    h.includes('коммент') ||
    h.includes('примеч') ||
    h.includes('замет') ||
    h.includes('описан') ||
    h.includes('note') ||
    h.includes('nota') ||
    h.includes('notiz') ||
    h.includes('kommentar') ||
    h.includes('comment')
  ) {
    return 'notes';
  }
  return null;
}

function parseExcelNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string') return null;
  const cleaned = value
    .replace(/\u00A0/g, ' ')
    .replace(/[^\d.,-]+/g, '')
    .replace(',', '.');
  if (!cleaned || cleaned === '-' || cleaned === '.') return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseExcelDate(value: unknown, fallbackDate: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof value === 'number' && Number.isFinite(value) && value > 20000 && value < 80000) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed && parsed.y && parsed.m && parsed.d) {
      return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }
  }
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return fallbackDate;
    // ISO YYYY-MM-DD or YYYY/MM/DD
    const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
    if (iso) {
      return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
    }
    // DD.MM.YYYY or DD/MM/YYYY or DD-MM-YYYY
    const dmy = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/.exec(s);
    if (dmy) {
      const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
      return `${year}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
    }
  }
  return fallbackDate;
}

function parseSaleChannel(raw: unknown): SaleChannel {
  const s = String(raw || '').trim().toLowerCase();
  if (!s) return 'direct';
  if (
    s.includes('маркетплейс') ||
    s.includes('marketplace') ||
    s.includes('marktplatz') ||
    s.includes('ozon') ||
    s.includes('озон') ||
    s.includes('wildberries') ||
    s.includes('wb') ||
    s.includes('яндекс') ||
    s.includes('etsy') ||
    s.includes('amazon') ||
    s.includes('авито')
  ) {
    return 'marketplace';
  }
  if (
    s.includes('бутик') ||
    s.includes('шоурум') ||
    s.includes('магазин') ||
    s.includes('корнер') ||
    s.includes('boutique') ||
    s.includes('showroom') ||
    s.includes('retail') ||
    s.includes('store') ||
    s.includes('negozi') ||
    s.includes('tienda') ||
    s.includes('laden') ||
    s.includes('geschäft')
  ) {
    return 'boutique';
  }
  if (
    s.includes('ярмар') ||
    s.includes('маркет') ||
    s.includes('выстав') ||
    s.includes('фестивал') ||
    s.includes('fair') ||
    s.includes('fiera') ||
    s.includes('mercatin') ||
    s.includes('feria') ||
    s.includes('mercado') ||
    s.includes('messe') ||
    s.includes('markt') ||
    s.includes('pop-up') ||
    s.includes('popup')
  ) {
    return 'fair';
  }
  if (
    s.includes('подар') ||
    s.includes('промо') ||
    s.includes('блог') ||
    s.includes('бесплат') ||
    s.includes('gift') ||
    s.includes('promo') ||
    s.includes('omaggi') ||
    s.includes('regal') ||
    s.includes('muestr') ||
    s.includes('geschenk') ||
    s.includes('pr')
  ) {
    return 'gift';
  }
  return 'direct';
}

export async function parseSalesExcelFile(
  file: File,
  projects: PerfumeProject[],
  lang: AppLanguage = 'ru'
): Promise<SalesImportParseResult> {
  const t = SALES_EXCEL_TEXT[lang];
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    throw new Error(t.noSheetsError);
  }

  // Prefer Journal sheet if present, otherwise first non-guide sheet
  const chosenSheetName =
    sheetNames.find((n) => {
      const l = n.toLowerCase();
      return (
        l.includes('продаж') ||
        l.includes('sales') ||
        l.includes('journal') ||
        l.includes('vendite') ||
        l.includes('ventas') ||
        l.includes('verkauf') ||
        l.includes('registro')
      );
    }) ||
    sheetNames.find((n) => {
      const l = n.toLowerCase();
      return (
        !l.includes('инструкц') &&
        !l.includes('guide') &&
        !l.includes('guida') &&
        !l.includes('guía') &&
        !l.includes('anleitung')
      );
    }) ||
    sheetNames[0];

  const sheet = workbook.Sheets[chosenSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
  });

  const projectByCode = new Map<string, PerfumeProject>();
  const projectByTitle = new Map<string, PerfumeProject>();
  for (const p of projects) {
    if (p.code) projectByCode.set(p.code.trim().toLowerCase(), p);
    if (p.title) projectByTitle.set(p.title.trim().toLowerCase(), p);
  }

  const today = todayIsoDate();
  const records: SaleRecord[] = [];
  const skippedRows: SalesImportSkippedRow[] = [];
  let matchedProjectCount = 0;

  rawRows.forEach((rawRow, index) => {
    const rowNumber = index + 2; // header is row 1
    const extracted: Partial<Record<CanonicalField, unknown>> = {};

    for (const [colKey, val] of Object.entries(rawRow)) {
      const field = mapHeaderToField(colKey);
      if (field && extracted[field] === undefined) {
        extracted[field] = val;
      }
    }

    // Skip completely empty rows silently
    const hasAnyValue = Object.values(rawRow).some((v) => String(v ?? '').trim() !== '');
    if (!hasAnyValue) return;

    const codeStr = String(extracted.projectCode ?? '').trim();
    const rawName = String(extracted.fragranceName ?? '').trim();

    let matchedProj: PerfumeProject | undefined;
    if (codeStr) {
      matchedProj = projectByCode.get(codeStr.toLowerCase());
    }
    if (!matchedProj && rawName) {
      const lowerName = rawName.toLowerCase();
      matchedProj =
        projectByTitle.get(lowerName) ||
        projects.find(
          (p) =>
            lowerName.includes(p.code.toLowerCase()) ||
            (p.title.length >= 4 && lowerName.includes(p.title.toLowerCase()))
        );
    }

    const fragranceName =
      rawName ||
      (matchedProj
        ? `${matchedProj.title} (${matchedProj.targetConcentration} ${matchedProj.targetBottleMl} ${t.mlUnit})`
        : '');

    if (!fragranceName) {
      skippedRows.push({
        rowNumber,
        reason: t.missingNameAndCode,
      });
      return;
    }

    const quantityRaw = parseExcelNumber(extracted.quantity);
    const quantity = quantityRaw !== null && quantityRaw > 0 ? Math.round(quantityRaw) : 1;

    const bottleMlRaw = parseExcelNumber(extracted.bottleMl);
    const bottleMl =
      bottleMlRaw !== null && bottleMlRaw > 0
        ? Math.round(bottleMlRaw)
        : matchedProj?.targetBottleMl || 30;

    const unitPriceParsed = parseExcelNumber(extracted.unitPrice);
    const revenueParsed = parseExcelNumber(extracted.totalRevenue);

    let unitPrice = 0;
    let totalRevenue = 0;

    if (unitPriceParsed !== null && revenueParsed !== null) {
      unitPrice = Math.max(0, unitPriceParsed);
      totalRevenue = Math.max(0, revenueParsed);
    } else if (unitPriceParsed !== null) {
      unitPrice = Math.max(0, unitPriceParsed);
      totalRevenue = Number((unitPrice * quantity).toFixed(2));
    } else if (revenueParsed !== null) {
      totalRevenue = Math.max(0, revenueParsed);
      unitPrice = quantity > 0 ? Number((totalRevenue / quantity).toFixed(2)) : 0;
    } else {
      const channelCheck = parseSaleChannel(extracted.channel);
      if (channelCheck !== 'gift') {
        skippedRows.push({
          rowNumber,
          reason: t.missingPriceAndRevenue,
        });
        return;
      }
    }

    const unitCostParsed = parseExcelNumber(extracted.unitCost);
    const unitCost =
      unitCostParsed !== null && unitCostParsed >= 0
        ? unitCostParsed
        : matchedProj
          ? estimateBottleCost(matchedProj, bottleMl)
          : 0;

    if (matchedProj) {
      matchedProjectCount++;
    }

    const date = parseExcelDate(extracted.date, today);
    const channel = parseSaleChannel(extracted.channel);
    const customerOrOrder = String(extracted.customerOrOrder ?? '').trim() || undefined;
    const notes = String(extracted.notes ?? '').trim() || undefined;

    records.push({
      id: generateId('sale'),
      date,
      projectId: matchedProj?.id,
      fragranceName,
      bottleMl,
      quantity,
      unitPrice: Number(unitPrice.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      unitCost: Number(unitCost.toFixed(2)),
      channel,
      customerOrOrder,
      notes,
    });
  });

  return {
    records,
    matchedProjectCount,
    skippedRows,
    sheetName: chosenSheetName,
    totalRowsRead: rawRows.length,
  };
}
