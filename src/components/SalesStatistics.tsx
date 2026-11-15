import { FileSpreadsheet, Plus, Search, Trash2, TrendingUp, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  formatUnit,
  getCurrencySymbol,
  getSaleChannelLabel,
  SALE_CHANNEL_LABELS,
} from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  PerfumeProject,
  ProjectTab,
  SaleChannel,
  SaleRecord,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  formatCurrencyDecimal,
  formatCurrencyRub,
  formatPercent,
} from '../utils/calculations';
import { exportSalesToExcel } from '../utils/salesExcel';
import { generateId, todayIsoDate } from '../utils/storage';
import { SalesExcelImportModal } from './SalesExcelImportModal';
import {
  formatSalesMonthLabels,
  type MonthlySalesTrendPoint,
  SalesMonthlyTrendChart,
} from './SalesMonthlyTrendChart';

interface SalesStatisticsProps {
  projects: PerfumeProject[];
  sales: SaleRecord[];
  language: AppLanguage;
  currency: AppCurrency;
  showDescription?: boolean;
  onAddSale: (sale: SaleRecord) => void;
  onImportSales: (records: SaleRecord[], mode: 'append' | 'replace') => void;
  onDeleteSale: (id: string) => void;
  onOpenProject: (projectId: string, tab?: ProjectTab) => void;
}

const CHANNEL_ORDER: SaleChannel[] = [
  'direct',
  'boutique',
  'marketplace',
  'fair',
  'gift',
];

interface SalesText {
  title: string;
  subtitle: string;
  importBtn: string;
  exportBtn: string;
  logSaleBtn: string;
  newSaleTitle: string;
  cancel: string;
  linkedProject: string;
  customOption: string;
  itemNameLabel: string;
  itemNamePlaceholder: string;
  salesChannel: string;
  bottleMl: string;
  qtyPcs: string;
  pricePerPc: (sym: string) => string;
  costPerPc: (sym: string) => string;
  saleDate: string;
  customerOrder: string;
  orderPlaceholder: string;
  notesPlaceholder: string;
  saveSale: string;
  totalRevenue: string;
  saleRecordsCount: string;
  bottlesSold: string;
  totalVolume: string;
  avgOrderBottle: string;
  avgPerBottle: string;
  grossProfitMargin: string;
  margin: string;
  cogs: string;
  searchPlaceholder: string;
  filterByProjectAria: string;
  allProjects: string;
  filterByChannelAria: string;
  allChannels: string;
  from: string;
  to: string;
  resetFilters: string;
  revByMonthFragrance: string;
  monthlyRevenue: string;
  noDataPeriod: string;
  salesByFragrance: string;
  noFragranceSales: string;
  channelsBottleFormats: string;
  revByChannel: string;
  noChannelData: string;
  bestSellingVolumes: string;
  noVolumeData: string;
  pcsSold: string;
  salesJournal: string;
  showingCount: (shown: number, total: number) => string;
  noSalesTitle: string;
  noMatchTitle: string;
  noSalesDesc: string;
  noMatchDesc: string;
  logFirstSale: string;
  thDate: string;
  thFragrance: string;
  thChannel: string;
  thFormat: string;
  thQty: string;
  thPrice: string;
  thRevenue: string;
  thProfit: string;
  deleteSaleAria: (name: string) => string;
}

const SALES_TEXT: Record<AppLanguage, SalesText> = {
  ru: {
    title: 'Статистика продаж',
    subtitle: 'Учёт продаж флаконов и сэмплов, выручка, маржинальность, популярные объёмы и каналы сбыта.',
    importBtn: 'Импорт Excel и инструкция',
    exportBtn: 'Экспорт в Excel',
    logSaleBtn: 'Записать продажу',
    newSaleTitle: 'Новая запись о продаже',
    cancel: 'Отмена',
    linkedProject: 'Проект аромата',
    customOption: 'Свой вариант (без проекта)',
    itemNameLabel: 'Наименование позиции / аромата *',
    itemNamePlaceholder: 'Напр.: Утренний кедр EDP 30 мл',
    salesChannel: 'Канал продаж',
    bottleMl: 'Объём (мл)',
    qtyPcs: 'Кол-во (шт)',
    pricePerPc: (sym) => `Цена за шт. (${sym})`,
    costPerPc: (sym) => `Себест. / шт. (${sym})`,
    saleDate: 'Дата продажи',
    customerOrder: 'Клиент / Заказ',
    orderPlaceholder: 'Заказ №...',
    notesPlaceholder: 'Комментарий к продаже (необязательно)...',
    saveSale: 'Сохранить',
    totalRevenue: 'Общая выручка',
    saleRecordsCount: 'сделок',
    bottlesSold: 'Продано флаконов',
    totalVolume: 'Общий объём',
    avgOrderBottle: 'Средний чек и флакон',
    avgPerBottle: 'Ср. цена флакона',
    grossProfitMargin: 'Валовая прибыль и маржа',
    margin: 'Маржа',
    cogs: 'Себест.',
    searchPlaceholder: 'Поиск аромата или заказа...',
    filterByProjectAria: 'Фильтр продаж по проекту',
    allProjects: 'Все проекты',
    filterByChannelAria: 'Фильтр по каналу продаж',
    allChannels: 'Все каналы',
    from: 'От',
    to: 'До',
    resetFilters: 'Сбросить фильтры',
    revByMonthFragrance: 'Динамика и лидеры по ароматам',
    monthlyRevenue: 'Выручка по месяцам',
    noDataPeriod: 'Нет продаж за выбранный период.',
    salesByFragrance: 'Выручка по ароматам',
    noFragranceSales: 'Данных по ароматам пока нет.',
    channelsBottleFormats: 'Каналы сбыта и форматы флаконов',
    revByChannel: 'Распределение по каналам',
    noChannelData: 'Данных по каналам пока нет.',
    bestSellingVolumes: 'Популярные объёмы флаконов',
    noVolumeData: 'Данных по объёмам пока нет.',
    pcsSold: 'шт. продано',
    salesJournal: 'Журнал продаж',
    showingCount: (shown, total) => `Показано ${shown} из ${total} записей`,
    noSalesTitle: 'Продаж пока не зафиксировано',
    noMatchTitle: 'По выбранным фильтрам продаж не найдено',
    noSalesDesc: 'Добавьте первую продажу флакона или сэмпла, чтобы отслеживать выручку и прибыль.',
    noMatchDesc: 'Попробуйте сбросить фильтры или изменить период.',
    logFirstSale: 'Записать первую продажу',
    thDate: 'Дата',
    thFragrance: 'Аромат / Позиция',
    thChannel: 'Канал',
    thFormat: 'Формат',
    thQty: 'Кол-во',
    thPrice: 'Цена',
    thRevenue: 'Выручка',
    thProfit: 'Прибыль',
    deleteSaleAria: (name) => `Удалить продажу ${name}`,
  },
  en: {
    title: 'Sales Statistics',
    subtitle: 'Track revenue, bottle volume sold, profit margin, top-performing fragrances, and sales channels.',
    importBtn: 'Import Excel & Guide',
    exportBtn: 'Export Excel (.xlsx)',
    logSaleBtn: 'Log Sale',
    newSaleTitle: 'New Sale Record',
    cancel: 'Cancel',
    linkedProject: 'Linked Project',
    customOption: 'Custom / Other fragrance',
    itemNameLabel: 'Item / Fragrance Name *',
    itemNamePlaceholder: 'e.g., Morning Cedar EDP 30 ml',
    salesChannel: 'Sales Channel',
    bottleMl: 'Bottle (ml)',
    qtyPcs: 'Qty (pcs)',
    pricePerPc: (sym) => `Price / pc (${sym})`,
    costPerPc: (sym) => `Cost / pc (${sym})`,
    saleDate: 'Sale Date',
    customerOrder: 'Customer / Order',
    orderPlaceholder: 'Order #...',
    notesPlaceholder: 'Notes (optional)...',
    saveSale: 'Save Sale',
    totalRevenue: 'Total Revenue',
    saleRecordsCount: 'sale records',
    bottlesSold: 'Bottles Sold',
    totalVolume: 'Total volume',
    avgOrderBottle: 'Avg. Order / Bottle',
    avgPerBottle: 'Avg/bottle',
    grossProfitMargin: 'Gross Profit & Margin',
    margin: 'Margin',
    cogs: 'COGS',
    searchPlaceholder: 'Search fragrance or order...',
    filterByProjectAria: 'Filter sales by project',
    allProjects: 'All projects',
    filterByChannelAria: 'Filter sales by channel',
    allChannels: 'All channels',
    from: 'From',
    to: 'To',
    resetFilters: 'Reset filters',
    revByMonthFragrance: 'Revenue by Month & Fragrance',
    monthlyRevenue: 'Monthly Revenue',
    noDataPeriod: 'No sales data for period.',
    salesByFragrance: 'Sales by Fragrance',
    noFragranceSales: 'No fragrance sales yet.',
    channelsBottleFormats: 'Channels & Bottle Formats',
    revByChannel: 'Revenue by Channel',
    noChannelData: 'No channel data yet.',
    bestSellingVolumes: 'Best-Selling Bottle Volumes',
    noVolumeData: 'No bottle volume data yet.',
    pcsSold: 'pcs sold',
    salesJournal: 'Sales Journal',
    showingCount: (shown, total) => `Showing ${shown} of ${total} records`,
    noSalesTitle: 'No sales recorded yet',
    noMatchTitle: 'No sales match the selected filters',
    noSalesDesc: 'Record your first bottle or sample sale to track revenue and margins.',
    noMatchDesc: 'Try clearing or adjusting the date range, project, or channel filter.',
    logFirstSale: 'Log First Sale',
    thDate: 'Date',
    thFragrance: 'Fragrance / Item',
    thChannel: 'Channel',
    thFormat: 'Format',
    thQty: 'Qty',
    thPrice: 'Price',
    thRevenue: 'Revenue',
    thProfit: 'Profit',
    deleteSaleAria: (name) => `Delete sale ${name}`,
  },
  it: {
    title: 'Statistiche Vendite',
    subtitle: 'Monitoraggio di ricavi, volumi venduti, marginalità, fragranze più richieste e canali di vendita.',
    importBtn: 'Importa Excel e Guida',
    exportBtn: 'Esporta Excel (.xlsx)',
    logSaleBtn: 'Registra Vendita',
    newSaleTitle: 'Nuova Registrazione Vendita',
    cancel: 'Annulla',
    linkedProject: 'Progetto Collegato',
    customOption: 'Altro / Fragranza personalizzata',
    itemNameLabel: 'Nome Articolo / Fragranza *',
    itemNamePlaceholder: 'es., Cedro del Mattino EDP 30 ml',
    salesChannel: 'Canale di Vendita',
    bottleMl: 'Flacone (ml)',
    qtyPcs: 'Qtà (pz)',
    pricePerPc: (sym) => `Prezzo / pz (${sym})`,
    costPerPc: (sym) => `Costo / pz (${sym})`,
    saleDate: 'Data Vendita',
    customerOrder: 'Cliente / Ordine',
    orderPlaceholder: 'Ordine n....',
    notesPlaceholder: 'Note sulla vendita (opzionale)...',
    saveSale: 'Salva Vendita',
    totalRevenue: 'Ricavi Totali',
    saleRecordsCount: 'vendite',
    bottlesSold: 'Flaconi Venduti',
    totalVolume: 'Volume totale',
    avgOrderBottle: 'Ordine Medio / Flacone',
    avgPerBottle: 'Media/flacone',
    grossProfitMargin: 'Utile Lordo e Margine',
    margin: 'Margine',
    cogs: 'Costo',
    searchPlaceholder: 'Cerca fragranza o ordine...',
    filterByProjectAria: 'Filtra vendite per progetto',
    allProjects: 'Tutti i progetti',
    filterByChannelAria: 'Filtra vendite per canale',
    allChannels: 'Tutti i canali',
    from: 'Da',
    to: 'A',
    resetFilters: 'Ripristina filtri',
    revByMonthFragrance: 'Ricavi per Mese e Fragranza',
    monthlyRevenue: 'Ricavi Mensili',
    noDataPeriod: 'Nessuna vendita nel periodo.',
    salesByFragrance: 'Vendite per Fragranza',
    noFragranceSales: 'Nessuna vendita per fragranza.',
    channelsBottleFormats: 'Canali e Formati Flaconi',
    revByChannel: 'Ricavi per Canale',
    noChannelData: 'Nessun dato per canale.',
    bestSellingVolumes: 'Formati più Venduti',
    noVolumeData: 'Nessun dato sui formati.',
    pcsSold: 'pz venduti',
    salesJournal: 'Registro Vendite',
    showingCount: (shown, total) => `${shown} di ${total} registrazioni`,
    noSalesTitle: 'Nessuna vendita registrata',
    noMatchTitle: 'Nessuna vendita corrisponde ai filtri',
    noSalesDesc: 'Registra la prima vendita di flaconi o campioncini per monitorare ricavi e margini.',
    noMatchDesc: 'Prova a modificare l’intervallo di date, il progetto o il canale.',
    logFirstSale: 'Registra Prima Vendita',
    thDate: 'Data',
    thFragrance: 'Fragranza / Articolo',
    thChannel: 'Canale',
    thFormat: 'Formato',
    thQty: 'Qtà',
    thPrice: 'Prezzo',
    thRevenue: 'Ricavo',
    thProfit: 'Utile',
    deleteSaleAria: (name) => `Elimina vendita ${name}`,
  },
  es: {
    title: 'Estadísticas de Ventas',
    subtitle: 'Control de ingresos, volumen vendido, margen de beneficio, fragancias destacadas y canales de venta.',
    importBtn: 'Importar Excel y Guía',
    exportBtn: 'Exportar Excel (.xlsx)',
    logSaleBtn: 'Registrar Venta',
    newSaleTitle: 'Nuevo Registro de Venta',
    cancel: 'Cancelar',
    linkedProject: 'Proyecto Vinculado',
    customOption: 'Personalizado / Otra fragancia',
    itemNameLabel: 'Nombre del Artículo / Fragancia *',
    itemNamePlaceholder: 'ej., Cedro de Mañana EDP 30 ml',
    salesChannel: 'Canal de Venta',
    bottleMl: 'Frasco (ml)',
    qtyPcs: 'Cant. (uds)',
    pricePerPc: (sym) => `Precio / ud. (${sym})`,
    costPerPc: (sym) => `Costo / ud. (${sym})`,
    saleDate: 'Fecha de Venta',
    customerOrder: 'Cliente / Pedido',
    orderPlaceholder: 'Pedido n.º...',
    notesPlaceholder: 'Notas (opcional)...',
    saveSale: 'Guardar Venta',
    totalRevenue: 'Ingresos Totales',
    saleRecordsCount: 'ventas',
    bottlesSold: 'Frascos Vendidos',
    totalVolume: 'Volumen total',
    avgOrderBottle: 'Pedido Medio / Frasco',
    avgPerBottle: 'Media/frasco',
    grossProfitMargin: 'Beneficio Bruto y Margen',
    margin: 'Margen',
    cogs: 'Costo',
    searchPlaceholder: 'Buscar fragancia o pedido...',
    filterByProjectAria: 'Filtrar ventas por proyecto',
    allProjects: 'Todos los proyectos',
    filterByChannelAria: 'Filtrar ventas por canal',
    allChannels: 'Todos los canales',
    from: 'Desde',
    to: 'Hasta',
    resetFilters: 'Restablecer filtros',
    revByMonthFragrance: 'Ingresos por Mes y Fragancia',
    monthlyRevenue: 'Ingresos Mensuales',
    noDataPeriod: 'Sin ventas en el período.',
    salesByFragrance: 'Ventas por Fragancia',
    noFragranceSales: 'Aún no hay ventas por fragancia.',
    channelsBottleFormats: 'Canales y Formatos de Frasco',
    revByChannel: 'Ingresos por Canal',
    noChannelData: 'Sin datos de canal aún.',
    bestSellingVolumes: 'Formatos más Vendidos',
    noVolumeData: 'Sin datos de volumen aún.',
    pcsSold: 'uds vendidas',
    salesJournal: 'Diario de Ventas',
    showingCount: (shown, total) => `Mostrando ${shown} de ${total} registros`,
    noSalesTitle: 'No hay ventas registradas',
    noMatchTitle: 'Ninguna venta coincide con los filtros',
    noSalesDesc: 'Registra tu primera venta de frasco o muestra para seguir tus ingresos y márgenes.',
    noMatchDesc: 'Intenta limpiar o ajustar el rango de fechas, proyecto o canal.',
    logFirstSale: 'Registrar Primera Venta',
    thDate: 'Fecha',
    thFragrance: 'Fragancia / Artículo',
    thChannel: 'Canal',
    thFormat: 'Formato',
    thQty: 'Cant.',
    thPrice: 'Precio',
    thRevenue: 'Ingresos',
    thProfit: 'Beneficio',
    deleteSaleAria: (name) => `Eliminar venta ${name}`,
  },
  de: {
    title: 'Verkaufsstatistik',
    subtitle: 'Umsatz, verkaufte Flakonmengen, Gewinnspanne, beliebte Düfte und Vertriebskanäle im Blick.',
    importBtn: 'Excel-Import & Anleitung',
    exportBtn: 'Excel-Export (.xlsx)',
    logSaleBtn: 'Verkauf erfassen',
    newSaleTitle: 'Neuer Verkaufseintrag',
    cancel: 'Abbrechen',
    linkedProject: 'Verknüpftes Projekt',
    customOption: 'Eigener Duft (ohne Projekt)',
    itemNameLabel: 'Artikel- / Duftname *',
    itemNamePlaceholder: 'z. B. Morgenzeder EDP 30 ml',
    salesChannel: 'Vertriebskanal',
    bottleMl: 'Flakon (ml)',
    qtyPcs: 'Menge (Stk)',
    pricePerPc: (sym) => `Preis / Stk (${sym})`,
    costPerPc: (sym) => `Kosten / Stk (${sym})`,
    saleDate: 'Verkaufsdatum',
    customerOrder: 'Kunde / Auftrag',
    orderPlaceholder: 'Auftrag Nr....',
    notesPlaceholder: 'Notizen (optional)...',
    saveSale: 'Verkauf speichern',
    totalRevenue: 'Gesamtumsatz',
    saleRecordsCount: 'Verkäufe',
    bottlesSold: 'Verkaufte Flakons',
    totalVolume: 'Gesamtvolumen',
    avgOrderBottle: 'Ø Auftrag / Flakon',
    avgPerBottle: 'Ø Flakonpreis',
    grossProfitMargin: 'Rohertrag & Marge',
    margin: 'Marge',
    cogs: 'Selbstkosten',
    searchPlaceholder: 'Duft oder Auftrag suchen...',
    filterByProjectAria: 'Verkäufe nach Projekt filtern',
    allProjects: 'Alle Projekte',
    filterByChannelAria: 'Verkäufe nach Kanal filtern',
    allChannels: 'Alle Kanäle',
    from: 'Von',
    to: 'Bis',
    resetFilters: 'Filter zurücksetzen',
    revByMonthFragrance: 'Umsatz nach Monat & Duft',
    monthlyRevenue: 'Monatlicher Umsatz',
    noDataPeriod: 'Keine Verkäufe im Zeitraum.',
    salesByFragrance: 'Umsatz nach Duft',
    noFragranceSales: 'Noch keine Duftverkäufe.',
    channelsBottleFormats: 'Vertriebskanäle & Flakongrößen',
    revByChannel: 'Umsatz nach Kanal',
    noChannelData: 'Noch keine Kanaldaten.',
    bestSellingVolumes: 'Beliebteste Flakongrößen',
    noVolumeData: 'Noch keine Größendaten.',
    pcsSold: 'Stk verkauft',
    salesJournal: 'Verkaufsjournal',
    showingCount: (shown, total) => `${shown} von ${total} Einträgen angezeigt`,
    noSalesTitle: 'Noch keine Verkäufe erfasst',
    noMatchTitle: 'Keine Verkäufe entsprechen den Filtern',
    noSalesDesc: 'Erfassen Sie Ihren ersten Flakon- oder Probenverkauf, um Umsatz und Marge zu verfolgen.',
    noMatchDesc: 'Passen Sie Zeitraum, Projekt oder Vertriebskanal an.',
    logFirstSale: 'Ersten Verkauf erfassen',
    thDate: 'Datum',
    thFragrance: 'Duft / Artikel',
    thChannel: 'Kanal',
    thFormat: 'Größe',
    thQty: 'Menge',
    thPrice: 'Preis',
    thRevenue: 'Umsatz',
    thProfit: 'Gewinn',
    deleteSaleAria: (name) => `Verkauf ${name} löschen`,
  },
};

function estimateProjectBottleCost(project: PerfumeProject, bottleMl: number): number {
  const summary = calculateFormulaSummary(project.components);
  const ratio =
    summary.totalWeightGrams > 0 && bottleMl > 0
      ? bottleMl / summary.totalWeightGrams
      : 1;
  const liquidCost = summary.totalFormulaCost * ratio;
  const packaging = Math.max(0, Number(project.packagingCostPerUnit) || 0);
  return Math.round(liquidCost + packaging);
}

export function SalesStatistics({
  projects,
  sales,
  language,
  currency,
  showDescription = true,
  onAddSale,
  onImportSales,
  onDeleteSale,
  onOpenProject,
}: SalesStatisticsProps) {
  const t = SALES_TEXT[language];
  const mlUnit = formatUnit('мл', language);
  const pcsUnit = formatUnit('шт', language);
  const currencySymbol = getCurrencySymbol(currency);

  const [showAddForm, setShowAddForm] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<SaleChannel | 'all'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // New Sale Form
  const [saleProjectId, setSaleProjectId] = useState<string>(projects[0]?.id || '');
  const [saleName, setSaleName] = useState<string>(() => {
    const p = projects[0];
    return p ? `${p.title} (${p.targetConcentration} ${p.targetBottleMl} ${mlUnit})` : '';
  });
  const [saleBottleMl, setSaleBottleMl] = useState<string>(
    String(projects[0]?.targetBottleMl || 30)
  );
  const [saleQty, setSaleQty] = useState<string>('1');
  const [saleUnitPrice, setSaleUnitPrice] = useState<string>('4200');
  const [saleUnitCost, setSaleUnitCost] = useState<string>(() => {
    const p = projects[0];
    return p ? String(estimateProjectBottleCost(p, p.targetBottleMl || 30)) : '0';
  });
  const [saleChannel, setSaleChannel] = useState<SaleChannel>('direct');
  const [saleDate, setSaleDate] = useState<string>(todayIsoDate());
  const [saleCustomer, setSaleCustomer] = useState<string>('');
  const [saleNotes, setSaleNotes] = useState<string>('');

  const projectMap = useMemo(() => {
    const map: Record<string, PerfumeProject> = {};
    for (const p of projects) map[p.id] = p;
    return map;
  }, [projects]);

  const handleSelectSaleProject = (projectId: string) => {
    setSaleProjectId(projectId);
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    const ml = proj.targetBottleMl || 30;
    setSaleBottleMl(String(ml));
    setSaleName(`${proj.title} (${proj.targetConcentration} ${ml} ${mlUnit})`);
    setSaleUnitCost(String(estimateProjectBottleCost(proj, ml)));
  };

  const handleChangeSaleMl = (mlText: string) => {
    setSaleBottleMl(mlText);
    const proj = projects.find((p) => p.id === saleProjectId);
    const ml = Math.max(0, Number(mlText) || 0);
    if (proj && ml > 0) {
      setSaleUnitCost(String(estimateProjectBottleCost(proj, ml)));
    }
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleName.trim()) return;
    const quantity = Math.max(1, Math.round(Number(saleQty) || 1));
    const unitPrice = Math.max(0, Number(saleUnitPrice) || 0);
    const bottleMl = Math.max(1, Number(saleBottleMl) || 30);
    const unitCost = Math.max(0, Number(saleUnitCost) || 0);

    onAddSale({
      id: generateId('sale'),
      date: saleDate || todayIsoDate(),
      projectId: saleProjectId || undefined,
      fragranceName: saleName.trim(),
      bottleMl,
      quantity,
      unitPrice,
      totalRevenue: Number((quantity * unitPrice).toFixed(2)),
      unitCost,
      channel: saleChannel,
      customerOrOrder: saleCustomer.trim() || undefined,
      notes: saleNotes.trim() || undefined,
    });

    setSaleCustomer('');
    setSaleNotes('');
    setShowAddForm(false);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    filterProjectId !== 'all' ||
    filterChannel !== 'all' ||
    Boolean(filterDateFrom) ||
    Boolean(filterDateTo);

  const filteredSales = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sales
      .filter((s) => {
        if (filterProjectId !== 'all' && s.projectId !== filterProjectId) return false;
        if (filterChannel !== 'all' && s.channel !== filterChannel) return false;
        if (filterDateFrom && s.date < filterDateFrom) return false;
        if (filterDateTo && s.date > filterDateTo) return false;
        if (q) {
          const matchName = s.fragranceName.toLowerCase().includes(q);
          const matchCust = (s.customerOrOrder || '').toLowerCase().includes(q);
          const matchNote = (s.notes || '').toLowerCase().includes(q);
          if (!matchName && !matchCust && !matchNote) return false;
        }
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [sales, searchQuery, filterProjectId, filterChannel, filterDateFrom, filterDateTo]);

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalUnits = 0;
    let totalVolumeMl = 0;

    const byMonth = new Map<
      string,
      {
        month: string;
        revenue: number;
        cost: number;
        units: number;
        volumeMl: number;
        orders: number;
      }
    >();
    const byFragrance = new Map<
      string,
      {
        key: string;
        name: string;
        projectId?: string;
        units: number;
        volumeMl: number;
        revenue: number;
        cost: number;
      }
    >();
    const byChannel: Record<SaleChannel, { revenue: number; units: number; orders: number }> = {
      direct: { revenue: 0, units: 0, orders: 0 },
      marketplace: { revenue: 0, units: 0, orders: 0 },
      boutique: { revenue: 0, units: 0, orders: 0 },
      fair: { revenue: 0, units: 0, orders: 0 },
      gift: { revenue: 0, units: 0, orders: 0 },
    };
    const byFormat = new Map<number, { ml: number; units: number; revenue: number }>();

    for (const s of filteredSales) {
      const qty = Math.max(0, Number(s.quantity) || 0);
      const rev = Math.max(0, Number(s.totalRevenue) || 0);
      const cogs = Math.max(0, Number(s.unitCost) || 0) * qty;
      const ml = Math.max(0, Number(s.bottleMl) || 0);

      totalRevenue += rev;
      totalCost += cogs;
      totalUnits += qty;
      totalVolumeMl += ml * qty;

      const monthKey = (s.date || '').slice(0, 7) || '—';
      const mEntry = byMonth.get(monthKey);
      if (mEntry) {
        mEntry.revenue += rev;
        mEntry.cost += cogs;
        mEntry.units += qty;
        mEntry.volumeMl += ml * qty;
        mEntry.orders += 1;
      } else {
        byMonth.set(monthKey, {
          month: monthKey,
          revenue: rev,
          cost: cogs,
          units: qty,
          volumeMl: ml * qty,
          orders: 1,
        });
      }

      const fKey = s.projectId ? `proj:${s.projectId}` : `name:${s.fragranceName.trim().toLowerCase()}`;
      const linkedProj = s.projectId ? projectMap[s.projectId] : undefined;
      const fEntry = byFragrance.get(fKey);
      if (fEntry) {
        fEntry.units += qty;
        fEntry.volumeMl += ml * qty;
        fEntry.revenue += rev;
        fEntry.cost += cogs;
      } else {
        byFragrance.set(fKey, {
          key: fKey,
          name: linkedProj ? `${linkedProj.code} · ${linkedProj.title}` : s.fragranceName,
          projectId: s.projectId,
          units: qty,
          volumeMl: ml * qty,
          revenue: rev,
          cost: cogs,
        });
      }

      byChannel[s.channel].revenue += rev;
      byChannel[s.channel].units += qty;
      byChannel[s.channel].orders += 1;

      const fmtEntry = byFormat.get(ml);
      if (fmtEntry) {
        fmtEntry.units += qty;
        fmtEntry.revenue += rev;
      } else {
        byFormat.set(ml, { ml, units: qty, revenue: rev });
      }
    }

    const grossProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const avgOrderRevenue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
    const avgBottlePrice = totalUnits > 0 ? totalRevenue / totalUnits : 0;

    const monthlySeries: MonthlySalesTrendPoint[] = Array.from(byMonth.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => {
        const profit = m.revenue - m.cost;
        const mMargin = m.revenue > 0 ? (profit / m.revenue) * 100 : 0;
        const avgOrder = m.orders > 0 ? m.revenue / m.orders : 0;
        const { monthLabel, fullMonthLabel } = formatSalesMonthLabels(m.month, language);
        return {
          month: m.month,
          monthLabel,
          fullMonthLabel,
          revenue: m.revenue,
          cost: m.cost,
          profit,
          marginPercent: mMargin,
          units: m.units,
          volumeMl: m.volumeMl,
          orders: m.orders,
          avgOrder,
        };
      });

    const fragranceRanking = Array.from(byFragrance.values()).sort(
      (a, b) => b.revenue - a.revenue || b.units - a.units
    );

    const channelList = CHANNEL_ORDER.map((ch) => ({
      channel: ch,
      ...byChannel[ch],
    }))
      .filter((c) => c.orders > 0)
      .sort((a, b) => b.revenue - a.revenue);

    const formatList = Array.from(byFormat.values()).sort(
      (a, b) => b.units - a.units || b.revenue - a.revenue
    );

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      marginPercent,
      totalUnits,
      totalVolumeMl,
      avgOrderRevenue,
      avgBottlePrice,
      monthlySeries,
      fragranceRanking,
      channelList,
      formatList,
    };
  }, [filteredSales, projectMap, language]);

  const previewRevenue =
    Math.max(1, Math.round(Number(saleQty) || 1)) * Math.max(0, Number(saleUnitPrice) || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DFDD] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">{t.title}</h1>
          {showDescription && (
            <p className="mt-1 text-sm text-[#605E5C] max-w-2xl">{t.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
          >
            <Upload className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
            <span>{t.importBtn}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              exportSalesToExcel(
                hasActiveFilters ? filteredSales : sales,
                projects,
                language,
                currency
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#107C41]/30 bg-[#ECFDF5] px-3 py-2 text-xs font-medium text-[#15803D] hover:bg-[#D1FAE5] whitespace-nowrap"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>{t.exportBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.logSaleBtn}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Log Sale Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmitSale}
          className="rounded-xl border border-[#E1DFDD] bg-[#FAF9F8] p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E1DFDD] pb-3">
            <h2 className="text-sm font-semibold text-[#181917]">{t.newSaleTitle}</h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#605E5C] hover:text-[#181917]"
            >
              {t.cancel}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.linkedProject}</label>
              <select
                value={saleProjectId}
                onChange={(e) => handleSelectSaleProject(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                <option value="">{t.customOption}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.itemNameLabel}</label>
              <input
                type="text"
                required
                value={saleName}
                onChange={(e) => setSaleName(e.target.value)}
                placeholder={t.itemNamePlaceholder}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.salesChannel}</label>
              <select
                value={saleChannel}
                onChange={(e) => setSaleChannel(e.target.value as SaleChannel)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {CHANNEL_ORDER.map((ch) => (
                  <option key={ch} value={ch}>
                    {getSaleChannelLabel(ch, language)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end">
            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.bottleMl}</label>
              <input
                type="number"
                min={1}
                step="1"
                value={saleBottleMl}
                onChange={(e) => handleChangeSaleMl(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.qtyPcs}</label>
              <input
                type="number"
                min={1}
                step="1"
                required
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">
                {t.pricePerPc(currencySymbol)}
              </label>
              <input
                type="number"
                min={0}
                step="1"
                required
                value={saleUnitPrice}
                onChange={(e) => setSaleUnitPrice(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">
                {t.costPerPc(currencySymbol)}
              </label>
              <input
                type="number"
                min={0}
                step="1"
                value={saleUnitCost}
                onChange={(e) => setSaleUnitCost(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 font-mono text-xs tabular-nums text-[#181917]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.saleDate}</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-2 font-mono text-xs text-[#181917]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#605E5C] mb-1">{t.customerOrder}</label>
              <input
                type="text"
                value={saleCustomer}
                onChange={(e) => setSaleCustomer(e.target.value)}
                placeholder={t.orderPlaceholder}
                className="w-full rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={saleNotes}
              onChange={(e) => setSaleNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="flex-1 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs text-[#181917]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {t.saveSale} ({formatCurrencyRub(previewRevenue, language, currency)})
              </span>
            </button>
          </div>
        </form>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">{t.totalRevenue}</div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[var(--theme-accent)]">
            {formatCurrencyRub(metrics.totalRevenue, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {filteredSales.length} {t.saleRecordsCount}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">{t.bottlesSold}</div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {metrics.totalUnits} {pcsUnit}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {t.totalVolume}: {metrics.totalVolumeMl} {mlUnit}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">{t.avgOrderBottle}</div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {formatCurrencyRub(metrics.avgOrderRevenue, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {t.avgPerBottle}: {formatCurrencyRub(metrics.avgBottlePrice, language, currency)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">{t.grossProfitMargin}</div>
          <div
            className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
              metrics.grossProfit >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
            }`}
          >
            {formatCurrencyRub(metrics.grossProfit, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {t.margin}: {formatPercent(metrics.marginPercent, 1)} · {t.cogs}:{' '}
            {formatCurrencyRub(metrics.totalCost, language, currency)}
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#797775]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] py-1.5 pl-8 pr-3 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            aria-label={t.filterByProjectAria}
            className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-3 py-1.5 text-xs text-[#181917]"
          >
            <option value="all">{t.allProjects}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.title}
              </option>
            ))}
          </select>

          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value as SaleChannel | 'all')}
            aria-label={t.filterByChannelAria}
            className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-3 py-1.5 text-xs text-[#181917]"
          >
            <option value="all">{t.allChannels}</option>
            {CHANNEL_ORDER.map((ch) => (
              <option key={ch} value={ch}>
                {getSaleChannelLabel(ch, language)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#605E5C] shrink-0">{t.from}</span>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-2.5 py-1.5 font-mono text-xs text-[#181917]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#605E5C] shrink-0">{t.to}</span>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-2.5 py-1.5 font-mono text-xs text-[#181917]"
            />
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterProjectId('all');
                setFilterChannel('all');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="text-xs font-medium text-[var(--theme-accent)] hover:underline"
            >
              {t.resetFilters}
            </button>
          </div>
        )}
      </div>

      {/* Monthly Sales Trends Recharts Visualization */}
      <SalesMonthlyTrendChart
        monthlySeries={metrics.monthlySeries}
        language={language}
        currency={currency}
      />

      {/* 2-Column Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Fragrances */}
        <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#EDEBE9] pb-3">
            <TrendingUp className="h-4 w-4 text-[var(--theme-accent)]" />
            <h2 className="text-base font-semibold text-[#181917]">{t.salesByFragrance}</h2>
          </div>

          {metrics.fragranceRanking.length === 0 ? (
            <p className="text-xs text-[#797775]">{t.noFragranceSales}</p>
          ) : (
            <div className="divide-y divide-[#EDEBE9]">
              {metrics.fragranceRanking.map((item) => {
                const profit = item.revenue - item.cost;
                const share =
                  metrics.totalRevenue > 0
                    ? (item.revenue / metrics.totalRevenue) * 100
                    : 0;
                return (
                  <div
                    key={item.key}
                    className="py-2.5 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        {item.projectId && projectMap[item.projectId] ? (
                          <button
                            type="button"
                            onClick={() => onOpenProject(item.projectId!, 'cost')}
                            className="truncate font-medium text-[#181917] hover:text-[var(--theme-accent)] text-left block max-w-full"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <div className="truncate font-medium text-[#181917]">{item.name}</div>
                        )}
                        <div className="text-[11px] text-[#797775] tabular-nums">
                          {item.units} {pcsUnit} · {item.volumeMl} {mlUnit} · {formatPercent(share, 0)}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums shrink-0">
                        <div className="font-semibold text-[#181917]">
                          {formatCurrencyRub(item.revenue, language, currency)}
                        </div>
                        <div
                          className={`text-[11px] ${
                            profit >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                          }`}
                        >
                          {profit >= 0 ? '+' : ''}
                          {formatCurrencyRub(profit, language, currency)}
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                      <div
                        style={{ width: `${Math.max(4, Math.round(share))}%` }}
                        className="h-full bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-ink)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sales Channels & Bottle Formats */}
        <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div className="border-b border-[#EDEBE9] pb-3">
            <h2 className="text-base font-semibold text-[#181917]">{t.channelsBottleFormats}</h2>
          </div>

          {/* Channels */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#323130]">{t.revByChannel}</div>
            {metrics.channelList.length === 0 ? (
              <p className="text-xs text-[#797775]">{t.noChannelData}</p>
            ) : (
              <div className="space-y-2">
                {metrics.channelList.map((c) => {
                  const pct =
                    metrics.totalRevenue > 0
                      ? Math.round((c.revenue / metrics.totalRevenue) * 100)
                      : 0;
                  return (
                    <div key={c.channel} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#323130]">
                          {getSaleChannelLabel(c.channel, language)}
                        </span>
                        <span className="font-mono tabular-nums text-[#605E5C]">
                          {formatCurrencyRub(c.revenue, language, currency)} ({pct}%) · {c.units}{' '}
                          {pcsUnit}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                        <div
                          style={{ width: `${Math.max(4, pct)}%` }}
                          className="h-full bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-ink)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottle Sizes */}
          <div className="border-t border-[#EDEBE9] pt-4 space-y-2.5">
            <div className="text-xs font-semibold text-[#323130]">{t.bestSellingVolumes}</div>
            {metrics.formatList.length === 0 ? (
              <p className="text-xs text-[#797775]">{t.noVolumeData}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {metrics.formatList.map((fmt) => (
                  <div
                    key={fmt.ml}
                    className="flex items-center justify-between rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] px-3 py-2 text-xs"
                  >
                    <div>
                      <div className="font-mono font-semibold text-[#181917] tabular-nums">
                        {fmt.ml} {mlUnit}
                      </div>
                      <div className="text-[11px] text-[#797775] tabular-nums">
                        {fmt.units} {t.pcsSold}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-[#181917] tabular-nums">
                      {formatCurrencyRub(fmt.revenue, language, currency)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sales Ledger Table */}
      <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#EDEBE9] pb-3">
          <h2 className="text-base font-semibold text-[#181917]">{t.salesJournal}</h2>
          <span className="text-xs text-[#605E5C] tabular-nums">
            {t.showingCount(filteredSales.length, sales.length)}
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-8 text-center space-y-2.5">
            <div className="text-sm font-medium text-[#181917]">
              {sales.length === 0 ? t.noSalesTitle : t.noMatchTitle}
            </div>
            <p className="text-xs text-[#605E5C]">
              {sales.length === 0 ? t.noSalesDesc : t.noMatchDesc}
            </p>
            {sales.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.logFirstSale}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E1DFDD] text-[11px] font-semibold text-[#605E5C]">
                  <th className="py-2.5 pr-3">{t.thDate}</th>
                  <th className="py-2.5 px-2">{t.thFragrance}</th>
                  <th className="py-2.5 px-2">{t.thChannel}</th>
                  <th className="py-2.5 px-2 text-right">{t.thFormat}</th>
                  <th className="py-2.5 px-2 text-right">{t.thQty}</th>
                  <th className="py-2.5 px-2 text-right">{t.thPrice}</th>
                  <th className="py-2.5 px-2 text-right">{t.thRevenue}</th>
                  <th className="py-2.5 px-2 text-right">{t.thProfit}</th>
                  <th className="py-2.5 pl-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                {filteredSales.map((sale) => {
                  const proj = sale.projectId ? projectMap[sale.projectId] : undefined;
                  const cogs = (sale.unitCost || 0) * sale.quantity;
                  const profit = sale.totalRevenue - cogs;
                  return (
                    <tr key={sale.id} className="hover:bg-[#FAF9F8]">
                      <td className="py-2.5 pr-3 font-mono tabular-nums text-[#605E5C] whitespace-nowrap">
                        {sale.date}
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-medium text-[#181917]">{sale.fragranceName}</div>
                        <div className="text-[11px] text-[#797775]">
                          {proj && (
                            <button
                              type="button"
                              onClick={() => onOpenProject(proj.id, 'cost')}
                              className="font-mono font-semibold text-[var(--theme-accent)] hover:underline mr-1.5"
                            >
                              {proj.code}
                            </button>
                          )}
                          {sale.customerOrOrder && <span>{sale.customerOrOrder}</span>}
                          {sale.customerOrOrder && sale.notes && <span> · </span>}
                          {sale.notes && <span>{sale.notes}</span>}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[#323130] whitespace-nowrap">
                        {getSaleChannelLabel(sale.channel, language) ||
                          SALE_CHANNEL_LABELS[sale.channel]}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C] whitespace-nowrap">
                        {sale.bottleMl} {mlUnit}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#181917] whitespace-nowrap">
                        {sale.quantity} {pcsUnit}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C] whitespace-nowrap">
                        {formatCurrencyDecimal(sale.unitPrice, language, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-semibold tabular-nums text-[#181917] whitespace-nowrap">
                        {formatCurrencyRub(sale.totalRevenue, language, currency)}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                          profit >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                        }`}
                      >
                        {profit >= 0 ? '+' : ''}
                        {formatCurrencyRub(profit, language, currency)}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteSale(sale.id)}
                          aria-label={t.deleteSaleAria(sale.fragranceName)}
                          className="rounded p-1.5 text-[#797775] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <SalesExcelImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        projects={projects}
        language={language}
        currency={currency}
        existingSalesCount={sales.length}
        onImportSales={onImportSales}
      />
    </div>
  );
}
