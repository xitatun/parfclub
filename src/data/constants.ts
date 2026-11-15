import type {
  AppCurrency,
  AppLanguage,
  AppSettings,
  BudgetCategory,
  ConcentrationType,
  HomeSectionsSettings,
  IngredientFilters,
  IngredientOrigin,
  IngredientStatus,
  JournalVerdict,
  MeasurementUnit,
  NoteTier,
  OlfactoryFamilyKey,
  ProjectStatus,
  SaleChannel,
  SillageLevel,
  ViewSettings,
} from '../types/perfume';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Идея',
  formulating: 'В разработке',
  macerating: 'Мацерация',
  completed: 'Готово',
  archived: 'Архив',
};

export const PROJECT_STATUS_LABELS_EN: Record<ProjectStatus, string> = {
  idea: 'Idea',
  formulating: 'Formulating',
  macerating: 'Macerating',
  completed: 'Completed',
  archived: 'Archived',
};

const PROJECT_STATUS_LABELS_BY_LANG: Record<AppLanguage, Record<ProjectStatus, string>> = {
  ru: PROJECT_STATUS_LABELS,
  en: PROJECT_STATUS_LABELS_EN,
  it: {
    idea: 'Idea',
    formulating: 'In formulazione',
    macerating: 'Macerazione',
    completed: 'Completato',
    archived: 'Archiviato',
  },
  es: {
    idea: 'Idea',
    formulating: 'En formulación',
    macerating: 'Maceración',
    completed: 'Completado',
    archived: 'Archivado',
  },
  de: {
    idea: 'Idee',
    formulating: 'In Entwicklung',
    macerating: 'Reifung',
    completed: 'Fertig',
    archived: 'Archiviert',
  },
};

export function getProjectStatusLabel(status: ProjectStatus, lang: AppLanguage = 'ru'): string {
  return PROJECT_STATUS_LABELS_BY_LANG[lang][status];
}

export const CONCENTRATION_TARGET_PERCENT: Record<
  ConcentrationType,
  { label: string; defaultPct: number; range: string }
> = {
  Extrait: { label: 'Extrait de Parfum', defaultPct: 25, range: '20–35%' },
  EDP: { label: 'Eau de Parfum', defaultPct: 18, range: '15–20%' },
  EDT: { label: 'Eau de Toilette', defaultPct: 12, range: '8–14%' },
  Cologne: { label: 'Eau de Cologne', defaultPct: 5, range: '3–7%' },
  Oil: { label: 'Масляные духи', defaultPct: 20, range: '15–30%' },
};

const OIL_CONCENTRATION_LABEL: Record<AppLanguage, string> = {
  ru: 'Масляные духи',
  en: 'Perfume Oil',
  it: 'Profumo in Olio',
  es: 'Perfume en Aceite',
  de: 'Parfümöl',
};

export function getConcentrationLabel(type: ConcentrationType, lang: AppLanguage = 'ru'): string {
  if (type === 'Oil') return OIL_CONCENTRATION_LABEL[lang];
  return CONCENTRATION_TARGET_PERCENT[type].label;
}

export const NOTE_TIER_LABELS: Record<NoteTier, string> = {
  top: 'Верхние ноты',
  heart: 'Ноты сердца',
  base: 'Базовые ноты',
  solvent: 'Растворитель / база',
};

export const NOTE_TIER_LABELS_EN: Record<NoteTier, string> = {
  top: 'Top Notes',
  heart: 'Heart Notes',
  base: 'Base Notes',
  solvent: 'Solvent / Carrier',
};

const NOTE_TIER_LABELS_BY_LANG: Record<AppLanguage, Record<NoteTier, string>> = {
  ru: NOTE_TIER_LABELS,
  en: NOTE_TIER_LABELS_EN,
  it: {
    top: 'Note di Testa',
    heart: 'Note di Cuore',
    base: 'Note di Fondo',
    solvent: 'Solvente / Base',
  },
  es: {
    top: 'Notas de Salida',
    heart: 'Notas de Corazón',
    base: 'Notas de Fondo',
    solvent: 'Disolvente / Base',
  },
  de: {
    top: 'Kopfnoten',
    heart: 'Herznoten',
    base: 'Basisnoten',
    solvent: 'Lösungsmittel / Träger',
  },
};

export function getNoteTierLabel(tier: NoteTier, lang: AppLanguage = 'ru'): string {
  return NOTE_TIER_LABELS_BY_LANG[lang][tier];
}

export const NOTE_TIER_SHORT: Record<NoteTier, string> = {
  top: 'Верх',
  heart: 'Сердце',
  base: 'База',
  solvent: 'Спирт/база',
};

export const NOTE_TIER_SHORT_EN: Record<NoteTier, string> = {
  top: 'Top',
  heart: 'Heart',
  base: 'Base',
  solvent: 'Carrier',
};

const NOTE_TIER_SHORT_BY_LANG: Record<AppLanguage, Record<NoteTier, string>> = {
  ru: NOTE_TIER_SHORT,
  en: NOTE_TIER_SHORT_EN,
  it: {
    top: 'Testa',
    heart: 'Cuore',
    base: 'Fondo',
    solvent: 'Base',
  },
  es: {
    top: 'Salida',
    heart: 'Corazón',
    base: 'Fondo',
    solvent: 'Base',
  },
  de: {
    top: 'Kopf',
    heart: 'Herz',
    base: 'Basis',
    solvent: 'Träger',
  },
};

export function getNoteTierShort(tier: NoteTier, lang: AppLanguage = 'ru'): string {
  return NOTE_TIER_SHORT_BY_LANG[lang][tier];
}

export const OLFACTORY_FAMILIES: {
  key: OlfactoryFamilyKey;
  label: string;
  labelEn: string;
  shortLabel: string;
  shortLabelEn: string;
  labels: Record<AppLanguage, string>;
  shortLabels: Record<AppLanguage, string>;
  color: string;
}[] = [
  {
    key: 'citrus',
    label: 'Цитрусовые',
    labelEn: 'Citrus',
    shortLabel: 'Цитрус',
    shortLabelEn: 'Citrus',
    labels: {
      ru: 'Цитрусовые',
      en: 'Citrus',
      it: 'Agrumata',
      es: 'Cítrica',
      de: 'Zitrisch',
    },
    shortLabels: {
      ru: 'Цитрус',
      en: 'Citrus',
      it: 'Agrumi',
      es: 'Cítrico',
      de: 'Zitrus',
    },
    color: '#D97706',
  },
  {
    key: 'floral',
    label: 'Цветочные',
    labelEn: 'Floral',
    shortLabel: 'Цветы',
    shortLabelEn: 'Floral',
    labels: {
      ru: 'Цветочные',
      en: 'Floral',
      it: 'Floreale',
      es: 'Floral',
      de: 'Blumig',
    },
    shortLabels: {
      ru: 'Цветы',
      en: 'Floral',
      it: 'Fiori',
      es: 'Floral',
      de: 'Blumig',
    },
    color: '#BE185D',
  },
  {
    key: 'woody',
    label: 'Древесные',
    labelEn: 'Woody',
    shortLabel: 'Дерево',
    shortLabelEn: 'Woody',
    labels: {
      ru: 'Древесные',
      en: 'Woody',
      it: 'Legnosa',
      es: 'Amaderada',
      de: 'Holzig',
    },
    shortLabels: {
      ru: 'Дерево',
      en: 'Woody',
      it: 'Legno',
      es: 'Madera',
      de: 'Holz',
    },
    color: '#78350F',
  },
  {
    key: 'spicy',
    label: 'Пряные',
    labelEn: 'Spicy',
    shortLabel: 'Пряности',
    shortLabelEn: 'Spicy',
    labels: {
      ru: 'Пряные',
      en: 'Spicy',
      it: 'Speziata',
      es: 'Especiada',
      de: 'Würzig',
    },
    shortLabels: {
      ru: 'Пряности',
      en: 'Spicy',
      it: 'Spezie',
      es: 'Especias',
      de: 'Würzig',
    },
    color: '#B91C1C',
  },
  {
    key: 'amber',
    label: 'Амбровые / Бальзам',
    labelEn: 'Amber / Balsamic',
    shortLabel: 'Амбра',
    shortLabelEn: 'Amber',
    labels: {
      ru: 'Амбровые / Бальзам',
      en: 'Amber / Balsamic',
      it: 'Ambrata / Balsamica',
      es: 'Ámbar / Balsámica',
      de: 'Amber / Balsamisch',
    },
    shortLabels: {
      ru: 'Амбра',
      en: 'Amber',
      it: 'Ambra',
      es: 'Ámbar',
      de: 'Amber',
    },
    color: '#B45309',
  },
  {
    key: 'green',
    label: 'Зелёные / Травы',
    labelEn: 'Green / Herbal',
    shortLabel: 'Зелень',
    shortLabelEn: 'Green',
    labels: {
      ru: 'Зелёные / Травы',
      en: 'Green / Herbal',
      it: 'Verde / Erbacea',
      es: 'Verde / Herbal',
      de: 'Grün / Krautig',
    },
    shortLabels: {
      ru: 'Зелень',
      en: 'Green',
      it: 'Verde',
      es: 'Verde',
      de: 'Grün',
    },
    color: '#15803D',
  },
  {
    key: 'musk',
    label: 'Мускусные',
    labelEn: 'Musky',
    shortLabel: 'Мускус',
    shortLabelEn: 'Musk',
    labels: {
      ru: 'Мускусные',
      en: 'Musky',
      it: 'Muschiata',
      es: 'Almizclada',
      de: 'Moschus',
    },
    shortLabels: {
      ru: 'Мускус',
      en: 'Musk',
      it: 'Muschio',
      es: 'Almizcle',
      de: 'Moschus',
    },
    color: '#57534E',
  },
  {
    key: 'gourmand',
    label: 'Гурманские',
    labelEn: 'Gourmand',
    shortLabel: 'Гурмэ',
    shortLabelEn: 'Gourmand',
    labels: {
      ru: 'Гурманские',
      en: 'Gourmand',
      it: 'Gourmand',
      es: 'Gourmand',
      de: 'Gourmand',
    },
    shortLabels: {
      ru: 'Гурмэ',
      en: 'Gourmand',
      it: 'Gourmand',
      es: 'Gourmand',
      de: 'Gourmand',
    },
    color: '#9A3412',
  },
  {
    key: 'aquatic',
    label: 'Свежие / Акватика',
    labelEn: 'Fresh / Aquatic',
    shortLabel: 'Свежие',
    shortLabelEn: 'Aquatic',
    labels: {
      ru: 'Свежие / Акватика',
      en: 'Fresh / Aquatic',
      it: 'Fresca / Acquatica',
      es: 'Fresca / Acuática',
      de: 'Frisch / Aquatisch',
    },
    shortLabels: {
      ru: 'Свежие',
      en: 'Aquatic',
      it: 'Acquatica',
      es: 'Acuática',
      de: 'Aquatisch',
    },
    color: '#0369A1',
  },
  {
    key: 'leathery',
    label: 'Кожаные / Дымные',
    labelEn: 'Leather / Smoky',
    shortLabel: 'Кожа',
    shortLabelEn: 'Leather',
    labels: {
      ru: 'Кожаные / Дымные',
      en: 'Leather / Smoky',
      it: 'Cuoiata / Fumosa',
      es: 'Cuero / Ahumada',
      de: 'Leder / Rauchig',
    },
    shortLabels: {
      ru: 'Кожа',
      en: 'Leather',
      it: 'Cuoio',
      es: 'Cuero',
      de: 'Leder',
    },
    color: '#3F3F46',
  },
];

export const OLFACTORY_FAMILY_MAP: Record<
  OlfactoryFamilyKey,
  {
    label: string;
    labelEn: string;
    shortLabel: string;
    shortLabelEn: string;
    labels: Record<AppLanguage, string>;
    shortLabels: Record<AppLanguage, string>;
    color: string;
  }
> = OLFACTORY_FAMILIES.reduce(
  (acc, item) => {
    acc[item.key] = {
      label: item.label,
      labelEn: item.labelEn,
      shortLabel: item.shortLabel,
      shortLabelEn: item.shortLabelEn,
      labels: item.labels,
      shortLabels: item.shortLabels,
      color: item.color,
    };
    return acc;
  },
  {} as Record<
    OlfactoryFamilyKey,
    {
      label: string;
      labelEn: string;
      shortLabel: string;
      shortLabelEn: string;
      labels: Record<AppLanguage, string>;
      shortLabels: Record<AppLanguage, string>;
      color: string;
    }
  >
);

export function getOlfactoryFamilyLabel(
  key: OlfactoryFamilyKey,
  lang: AppLanguage = 'ru'
): string {
  return OLFACTORY_FAMILY_MAP[key].labels[lang];
}

export function getOlfactoryFamilyShort(
  key: OlfactoryFamilyKey,
  lang: AppLanguage = 'ru'
): string {
  return OLFACTORY_FAMILY_MAP[key].shortLabels[lang];
}

export const INGREDIENT_STATUS_LABELS: Record<IngredientStatus, string> = {
  in_stock: 'В наличии',
  wishlist: 'Хочу купить',
  ordered: 'Заказано',
};

export const INGREDIENT_STATUS_LABELS_EN: Record<IngredientStatus, string> = {
  in_stock: 'In Stock',
  wishlist: 'Wishlist',
  ordered: 'Ordered',
};

const INGREDIENT_STATUS_LABELS_BY_LANG: Record<AppLanguage, Record<IngredientStatus, string>> = {
  ru: INGREDIENT_STATUS_LABELS,
  en: INGREDIENT_STATUS_LABELS_EN,
  it: {
    in_stock: 'Disponibile',
    wishlist: 'Da acquistare',
    ordered: 'Ordinato',
  },
  es: {
    in_stock: 'En stock',
    wishlist: 'Lista de deseos',
    ordered: 'Pedido',
  },
  de: {
    in_stock: 'Auf Lager',
    wishlist: 'Wunschliste',
    ordered: 'Bestellt',
  },
};

export function getIngredientStatusLabel(
  status: IngredientStatus,
  lang: AppLanguage = 'ru'
): string {
  return INGREDIENT_STATUS_LABELS_BY_LANG[lang][status];
}

export const INGREDIENT_ORIGIN_LABELS: Record<IngredientOrigin, string> = {
  natural: 'Натуральное (ЭМ/Абсолют)',
  synthetic: 'Душистое вещество',
  base: 'Парфюмерная база',
  solvent: 'Растворитель',
};

export const INGREDIENT_ORIGIN_LABELS_EN: Record<IngredientOrigin, string> = {
  natural: 'Natural (EO / Absolute)',
  synthetic: 'Aroma Chemical',
  base: 'Perfumery Base',
  solvent: 'Solvent',
};

const INGREDIENT_ORIGIN_LABELS_BY_LANG: Record<AppLanguage, Record<IngredientOrigin, string>> = {
  ru: INGREDIENT_ORIGIN_LABELS,
  en: INGREDIENT_ORIGIN_LABELS_EN,
  it: {
    natural: 'Naturale (OE / Assoluta)',
    synthetic: 'Molecola Aromatica',
    base: 'Base di Profumeria',
    solvent: 'Solvente',
  },
  es: {
    natural: 'Natural (AE / Absoluto)',
    synthetic: 'Molécula Aromática',
    base: 'Base de Perfumería',
    solvent: 'Disolvente',
  },
  de: {
    natural: 'Natürlich (ÄÖ / Absolue)',
    synthetic: 'Aromachemikalie',
    base: 'Parfümeriebasis',
    solvent: 'Lösungsmittel',
  },
};

export function getIngredientOriginLabel(
  origin: IngredientOrigin,
  lang: AppLanguage = 'ru'
): string {
  return INGREDIENT_ORIGIN_LABELS_BY_LANG[lang][origin];
}

export const JOURNAL_VERDICT_LABELS: Record<JournalVerdict, string> = {
  promising: 'Перспективно',
  needs_work: 'Нужна правка',
  approved: 'Утверждено',
  rejected: 'Отклонено',
};

export const JOURNAL_VERDICT_LABELS_EN: Record<JournalVerdict, string> = {
  promising: 'Promising',
  needs_work: 'Needs Work',
  approved: 'Approved',
  rejected: 'Rejected',
};

const JOURNAL_VERDICT_LABELS_BY_LANG: Record<AppLanguage, Record<JournalVerdict, string>> = {
  ru: JOURNAL_VERDICT_LABELS,
  en: JOURNAL_VERDICT_LABELS_EN,
  it: {
    promising: 'Promettente',
    needs_work: 'Da rifinire',
    approved: 'Approvato',
    rejected: 'Scartato',
  },
  es: {
    promising: 'Prometedor',
    needs_work: 'Por ajustar',
    approved: 'Aprobado',
    rejected: 'Descartado',
  },
  de: {
    promising: 'Vielversprechend',
    needs_work: 'Überarbeiten',
    approved: 'Freigegeben',
    rejected: 'Verworfen',
  },
};

export function getJournalVerdictLabel(
  verdict: JournalVerdict,
  lang: AppLanguage = 'ru'
): string {
  return JOURNAL_VERDICT_LABELS_BY_LANG[lang][verdict];
}

export const SILLAGE_LABELS: Record<SillageLevel, string> = {
  intimate: 'Интимный (близко к коже)',
  moderate: 'Средний (комфортный шлейф)',
  strong: 'Выраженный (диффузный)',
};

export const SILLAGE_LABELS_EN: Record<SillageLevel, string> = {
  intimate: 'Intimate (close to skin)',
  moderate: 'Moderate (balanced trail)',
  strong: 'Strong (radiant & diffusive)',
};

const SILLAGE_LABELS_BY_LANG: Record<AppLanguage, Record<SillageLevel, string>> = {
  ru: SILLAGE_LABELS,
  en: SILLAGE_LABELS_EN,
  it: {
    intimate: 'Intimo (vicino alla pelle)',
    moderate: 'Moderato (scia equilibrata)',
    strong: 'Intenso (radioso e diffusivo)',
  },
  es: {
    intimate: 'Íntimo (cerca de la piel)',
    moderate: 'Moderado (estela equilibrada)',
    strong: 'Intenso (radiante y difusivo)',
  },
  de: {
    intimate: 'Intim (hautnah)',
    moderate: 'Mittel (ausgewogene Sillage)',
    strong: 'Stark (strahlend & diffusiv)',
  },
};

export function getSillageLabel(level: SillageLevel, lang: AppLanguage = 'ru'): string {
  return SILLAGE_LABELS_BY_LANG[lang][level];
}

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  raw_materials: 'Душистые вещества и ЭМ',
  solvent: 'Спирт и растворители',
  glassware: 'Флаконы и фиолки',
  equipment: 'Весы и инструменты',
  packaging: 'Упаковка и этикетки',
  other: 'Прочее',
};

export const BUDGET_CATEGORY_LABELS_EN: Record<BudgetCategory, string> = {
  raw_materials: 'Aroma Materials & EOs',
  solvent: 'Alcohol & Solvents',
  glassware: 'Bottles & Vials',
  equipment: 'Scales & Tools',
  packaging: 'Packaging & Labels',
  other: 'Other',
};

const BUDGET_CATEGORY_LABELS_BY_LANG: Record<AppLanguage, Record<BudgetCategory, string>> = {
  ru: BUDGET_CATEGORY_LABELS,
  en: BUDGET_CATEGORY_LABELS_EN,
  it: {
    raw_materials: 'Materie Prime e Oli Essenziali',
    solvent: 'Alcol e Solventi',
    glassware: 'Flaconi e Fiale',
    equipment: 'Bilance e Strumenti',
    packaging: 'Confezionamento ed Etichette',
    other: 'Altro',
  },
  es: {
    raw_materials: 'Materias Aromáticas y AAEE',
    solvent: 'Alcohol y Disolventes',
    glassware: 'Frascos y Viales',
    equipment: 'Básculas y Herramientas',
    packaging: 'Embalaje y Etiquetas',
    other: 'Otros',
  },
  de: {
    raw_materials: 'Duftstoffe & Ätherische Öle',
    solvent: 'Alkohol & Lösungsmittel',
    glassware: 'Flakons & Phiolen',
    equipment: 'Waagen & Werkzeuge',
    packaging: 'Verpackung & Etiketten',
    other: 'Sonstiges',
  },
};

export function getBudgetCategoryLabel(
  category: BudgetCategory,
  lang: AppLanguage = 'ru'
): string {
  return BUDGET_CATEGORY_LABELS_BY_LANG[lang][category];
}

export const EQUIPMENT_BOTTLE_CATEGORIES: BudgetCategory[] = [
  'glassware',
  'equipment',
  'packaging',
];

export const SALE_CHANNEL_LABELS: Record<SaleChannel, string> = {
  direct: 'Прямые продажи',
  marketplace: 'Маркетплейс / Онлайн',
  boutique: 'Бутик / Партнёр',
  fair: 'Ярмарка / Маркет',
  gift: 'Подарок / Промо',
};

export const SALE_CHANNEL_LABELS_EN: Record<SaleChannel, string> = {
  direct: 'Direct Sales',
  marketplace: 'Online / Marketplace',
  boutique: 'Boutique / Retail',
  fair: 'Fair / Pop-up',
  gift: 'Gift / Promo',
};

const SALE_CHANNEL_LABELS_BY_LANG: Record<AppLanguage, Record<SaleChannel, string>> = {
  ru: SALE_CHANNEL_LABELS,
  en: SALE_CHANNEL_LABELS_EN,
  it: {
    direct: 'Vendita Diretta',
    marketplace: 'Online / Marketplace',
    boutique: 'Boutique / Retail',
    fair: 'Fiera / Pop-up',
    gift: 'Omaggio / Promo',
  },
  es: {
    direct: 'Venta Directa',
    marketplace: 'Online / Marketplace',
    boutique: 'Boutique / Tienda',
    fair: 'Feria / Pop-up',
    gift: 'Regalo / Promo',
  },
  de: {
    direct: 'Direktverkauf',
    marketplace: 'Online / Marktplatz',
    boutique: 'Boutique / Einzelhandel',
    fair: 'Messe / Pop-up',
    gift: 'Geschenk / Promo',
  },
};

export function getSaleChannelLabel(
  channel: SaleChannel,
  lang: AppLanguage = 'ru'
): string {
  return SALE_CHANNEL_LABELS_BY_LANG[lang][channel];
}

export function formatUnit(unit: MeasurementUnit, lang: AppLanguage = 'ru'): string {
  if (lang === 'ru') return unit;
  switch (unit) {
    case 'г':
      return 'g';
    case 'мл':
      return 'ml';
    case 'кг':
      return 'kg';
    case 'шт':
      if (lang === 'it') return 'pz';
      if (lang === 'es') return 'uds';
      if (lang === 'de') return 'Stk';
      return 'pcs';
  }
}

export const EMPTY_PROFILE: Record<OlfactoryFamilyKey, number> = {
  citrus: 0,
  floral: 0,
  woody: 0,
  spicy: 0,
  amber: 0,
  green: 0,
  musk: 0,
  gourmand: 0,
  aquatic: 0,
  leathery: 0,
};

export const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  showStatusBar: true,
  showPageDescriptions: true,
  showProjectMetrics: true,
  showIngredientSpecsExtra: true,
  showIngredientPurchaseBar: true,
  widePageLayout: true,
};

export const DEFAULT_INGREDIENT_FILTERS: IngredientFilters = {
  status: 'all',
  family: 'all',
  tier: 'all',
  origin: 'all',
  sillage: 'all',
  supplier: 'all',
  url: 'all',
  ifraOnly: false,
  lowStockOnly: false,
  priceFluctuationOnly: false,
  tags: [],
  tagMatchMode: 'any',
  sortBy: 'default',
  searchQuery: '',
};

export const STARTER_INGREDIENT_TAGS: Record<AppLanguage, string[]> = {
  ru: ['натуральное', 'синтетика', 'ретро', 'фиксатор'],
  en: ['natural', 'synthetic', 'retro', 'fixative'],
  it: ['naturale', 'sintetico', 'retrò', 'fissativo'],
  es: ['natural', 'sintético', 'retro', 'fijador'],
  de: ['natürlich', 'synthetisch', 'retro', 'Fixateur'],
};

export const CURRENCY_OPTIONS: {
  code: AppCurrency;
  symbol: string;
  labelRu: string;
  labelEn: string;
  labels: Record<AppLanguage, string>;
}[] = [
  {
    code: 'RUB',
    symbol: '₽',
    labelRu: 'Российский рубль (₽)',
    labelEn: 'Russian Ruble (₽)',
    labels: {
      ru: 'Российский рубль (₽)',
      en: 'Russian Ruble (₽)',
      it: 'Rublo russo (₽)',
      es: 'Rublo ruso (₽)',
      de: 'Russischer Rubel (₽)',
    },
  },
  {
    code: 'USD',
    symbol: '$',
    labelRu: 'Доллар США ($)',
    labelEn: 'US Dollar ($)',
    labels: {
      ru: 'Доллар США ($)',
      en: 'US Dollar ($)',
      it: 'Dollaro USA ($)',
      es: 'Dólar estadounidense ($)',
      de: 'US-Dollar ($)',
    },
  },
  {
    code: 'EUR',
    symbol: '€',
    labelRu: 'Евро (€)',
    labelEn: 'Euro (€)',
    labels: {
      ru: 'Евро (€)',
      en: 'Euro (€)',
      it: 'Euro (€)',
      es: 'Euro (€)',
      de: 'Euro (€)',
    },
  },
  {
    code: 'GBP',
    symbol: '£',
    labelRu: 'Фунт стерлингов (£)',
    labelEn: 'British Pound (£)',
    labels: {
      ru: 'Фунт стерлингов (£)',
      en: 'British Pound (£)',
      it: 'Sterlina britannica (£)',
      es: 'Libra esterlina (£)',
      de: 'Britisches Pfund (£)',
    },
  },
  {
    code: 'KZT',
    symbol: '₸',
    labelRu: 'Казахстанский тенге (₸)',
    labelEn: 'Kazakhstani Tenge (₸)',
    labels: {
      ru: 'Казахстанский тенге (₸)',
      en: 'Kazakhstani Tenge (₸)',
      it: 'Tenge kazako (₸)',
      es: 'Tenge kazajo (₸)',
      de: 'Kasachischer Tenge (₸)',
    },
  },
  {
    code: 'BYN',
    symbol: 'Br',
    labelRu: 'Белорусский рубль (Br)',
    labelEn: 'Belarusian Ruble (Br)',
    labels: {
      ru: 'Белорусский рубль (Br)',
      en: 'Belarusian Ruble (Br)',
      it: 'Rublo bielorusso (Br)',
      es: 'Rublo bielorruso (Br)',
      de: 'Belarussischer Rubel (Br)',
    },
  },
];

export function getCurrencySymbol(currency: AppCurrency = 'RUB'): string {
  return CURRENCY_OPTIONS.find((c) => c.code === currency)?.symbol ?? '₽';
}

export const DEFAULT_HOME_SECTIONS: HomeSectionsSettings = {
  showMacerationNotifications: true,
  showLowStockIngredients: true,
  showQuickAccess: true,
  showRecentProjects: true,
  showRecentNotes: true,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  language: 'ru',
  currency: 'RUB',
  themeColor: 'cobalt',
  colorMode: 'light',
  homeSections: DEFAULT_HOME_SECTIONS,
  criticalStockGrams: 10,
};
