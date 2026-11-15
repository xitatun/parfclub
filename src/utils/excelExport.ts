import * as XLSX from 'xlsx';
import {
  formatUnit,
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getOlfactoryFamilyLabel,
  getSillageLabel,
} from '../data/constants';
import type { AppCurrency, AppLanguage, Ingredient } from '../types/perfume';
import { todayIsoDate } from './storage';

interface ExcelHeaders {
  name: string;
  cas: string;
  status: string;
  family: string;
  tier: string;
  origin: string;
  dilution: string;
  solvent: string;
  packSize: string;
  unit: string;
  remaining: string;
  packPrice: string;
  unitPrice: string;
  longevity: string;
  sillage: string;
  ifra: string;
  supplier: string;
  url: string;
  purchaseDate: string;
  storage: string;
  tags: string;
  notes: string;
  sheetName: string;
  filePrefix: string;
}

const EXCEL_HEADERS: Record<AppLanguage, ExcelHeaders> = {
  ru: {
    name: 'Название',
    cas: 'CAS / INCI',
    status: 'Статус',
    family: 'Категория аромата',
    tier: 'Уровень пирамиды',
    origin: 'Происхождение',
    dilution: 'Разведение (%)',
    solvent: 'Растворитель',
    packSize: 'Фасовка',
    unit: 'Ед. изм.',
    remaining: 'Остаток',
    packPrice: 'Цена упаковки',
    unitPrice: 'Цена за единицу',
    longevity: 'Стойкость',
    sillage: 'Шлейф',
    ifra: 'Макс. % (IFRA)',
    supplier: 'Магазин / Поставщик',
    url: 'Ссылка на покупку',
    purchaseDate: 'Дата последней закупки',
    storage: 'Место хранения',
    tags: 'Теги / Категории',
    notes: 'Описание аромата',
    sheetName: 'Ингредиенты',
    filePrefix: 'Ингредиенты-Ателье-Эссенций',
  },
  en: {
    name: 'Name',
    cas: 'CAS / INCI',
    status: 'Status',
    family: 'Olfactory Family',
    tier: 'Pyramid Tier',
    origin: 'Origin',
    dilution: 'Dilution (%)',
    solvent: 'Solvent',
    packSize: 'Pack Size',
    unit: 'Unit',
    remaining: 'Remaining',
    packPrice: 'Pack Price',
    unitPrice: 'Unit Price',
    longevity: 'Longevity',
    sillage: 'Sillage',
    ifra: 'IFRA Max %',
    supplier: 'Store / Supplier',
    url: 'Purchase URL',
    purchaseDate: 'Last Purchase Date',
    storage: 'Storage Location',
    tags: 'Tags / Categories',
    notes: 'Olfactory Notes',
    sheetName: 'Ingredients',
    filePrefix: 'Ingredients-Atelier-Essences',
  },
  it: {
    name: 'Nome',
    cas: 'CAS / INCI',
    status: 'Stato',
    family: 'Famiglia Olfattiva',
    tier: 'Livello Piramide',
    origin: 'Origine',
    dilution: 'Diluizione (%)',
    solvent: 'Solvente',
    packSize: 'Confezione',
    unit: 'Unità',
    remaining: 'Rimanente',
    packPrice: 'Prezzo Confezione',
    unitPrice: 'Prezzo Unitario',
    longevity: 'Persistenza',
    sillage: 'Scia',
    ifra: 'Limite IFRA %',
    supplier: 'Negozio / Fornitore',
    url: 'Link Acquisto',
    purchaseDate: 'Data Ultimo Acquisto',
    storage: 'Posizione',
    tags: 'Tag / Categorie',
    notes: 'Note Olfattive',
    sheetName: 'Ingredienti',
    filePrefix: 'Ingredienti-Atelier-Essences',
  },
  es: {
    name: 'Nombre',
    cas: 'CAS / INCI',
    status: 'Estado',
    family: 'Familia Olfativa',
    tier: 'Nivel Pirámide',
    origin: 'Origen',
    dilution: 'Dilución (%)',
    solvent: 'Disolvente',
    packSize: 'Envase',
    unit: 'Unidad',
    remaining: 'Restante',
    packPrice: 'Precio Envase',
    unitPrice: 'Precio Unitario',
    longevity: 'Duración',
    sillage: 'Estela',
    ifra: 'Límite IFRA %',
    supplier: 'Tienda / Proveedor',
    url: 'Enlace de Compra',
    purchaseDate: 'Fecha Última Compra',
    storage: 'Ubicación',
    tags: 'Etiquetas / Categorías',
    notes: 'Notas Olfativas',
    sheetName: 'Ingredientes',
    filePrefix: 'Ingredientes-Atelier-Essences',
  },
  de: {
    name: 'Bezeichnung',
    cas: 'CAS / INCI',
    status: 'Status',
    family: 'Duftfamilie',
    tier: 'Pyramiden-Stufe',
    origin: 'Herkunft',
    dilution: 'Verdünnung (%)',
    solvent: 'Lösungsmittel',
    packSize: 'Gebindegröße',
    unit: 'Einheit',
    remaining: 'Restbestand',
    packPrice: 'Gebindepreis',
    unitPrice: 'Einheitspreis',
    longevity: 'Haltbarkeit',
    sillage: 'Sillage',
    ifra: 'IFRA Max %',
    supplier: 'Shop / Lieferant',
    url: 'Bestell-Link',
    purchaseDate: 'Letztes Kaufdatum',
    storage: 'Lagerort',
    tags: 'Tags / Kategorien',
    notes: 'Duftbeschreibung',
    sheetName: 'Rohstoffe',
    filePrefix: 'Rohstoffe-Atelier-Essences',
  },
};

export function exportIngredientsToExcel(
  ingredients: Ingredient[],
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
) {
  const h = EXCEL_HEADERS[lang];
  const rows = ingredients.map((ing) => {
    const unitPrice = ing.quantityGrams > 0 ? Number((ing.priceTotal / ing.quantityGrams).toFixed(2)) : 0;
    return {
      [h.name]: ing.name,
      [h.cas]: ing.inciOrCas || '',
      [h.status]: getIngredientStatusLabel(ing.status, lang),
      [h.family]: getOlfactoryFamilyLabel(ing.family, lang),
      [h.tier]: getNoteTierLabel(ing.tier, lang),
      [h.origin]: getIngredientOriginLabel(ing.origin, lang),
      [h.dilution]: ing.dilutionPercent,
      [h.solvent]: ing.solventNote || '',
      [h.packSize]: ing.quantityGrams,
      [h.unit]: formatUnit(ing.unit, lang),
      [h.remaining]: ing.remainingGrams ?? '',
      [`${h.packPrice} (${currency})`]: ing.priceTotal,
      [`${h.unitPrice} (${currency})`]: unitPrice,
      [h.longevity]: ing.longevityLabel || '',
      [h.sillage]: getSillageLabel(ing.sillage, lang),
      [h.ifra]: ing.ifraLimitPercent ?? '',
      [h.supplier]: ing.supplier || '',
      [h.url]: ing.purchaseUrl || '',
      [h.purchaseDate]: ing.purchaseDate || '',
      [h.storage]: ing.storageLocation || '',
      [h.tags]: (ing.tags || []).join(', '),
      [h.notes]: ing.olfactoryNotes || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 34 },
    { wch: 16 },
    { wch: 14 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 14 },
    { wch: 24 },
    { wch: 10 },
    { wch: 9 },
    { wch: 10 },
    { wch: 16 },
    { wch: 16 },
    { wch: 22 },
    { wch: 24 },
    { wch: 14 },
    { wch: 22 },
    { wch: 36 },
    { wch: 18 },
    { wch: 28 },
    { wch: 28 },
    { wch: 52 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, h.sheetName);
  XLSX.writeFile(workbook, `${h.filePrefix}-${todayIsoDate()}.xlsx`);
}
