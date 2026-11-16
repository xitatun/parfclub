export type ProjectStatus = 'idea' | 'formulating' | 'macerating' | 'completed' | 'archived';

export type ConcentrationType = 'Extrait' | 'EDP' | 'EDT' | 'Cologne' | 'Oil';

export type NoteTier = 'top' | 'heart' | 'base' | 'solvent';

export type OlfactoryFamilyKey =
  | 'citrus'
  | 'floral'
  | 'woody'
  | 'spicy'
  | 'amber'
  | 'green'
  | 'musk'
  | 'gourmand'
  | 'aquatic'
  | 'leathery';

export type IngredientStatus = 'in_stock' | 'wishlist' | 'ordered';

export type IngredientOrigin = 'natural' | 'synthetic' | 'base' | 'solvent';

export type MeasurementUnit = 'г' | 'мл' | 'кг' | 'шт';

export type SillageLevel = 'intimate' | 'moderate' | 'strong';

export interface ScentFacetBreakdown {
  facet: string;
  family: OlfactoryFamilyKey;
  percent: number;
}

export interface Ingredient {
  id: string;
  name: string;
  inciOrCas?: string;
  synonyms?: string[];
  family: OlfactoryFamilyKey;
  tier: NoteTier;
  origin: IngredientOrigin;
  status: IngredientStatus;
  dilutionPercent: number;
  solventNote?: string;
  unit: MeasurementUnit;
  quantityGrams: number;
  remainingGrams?: number;
  priceTotal: number;
  previousUnitPrice?: number;
  previousPriceDate?: string;
  longevityLabel: string;
  sillage: SillageLevel;
  odorImpact?: number;
  substantivityHours?: number;
  averageUsePercent?: string;
  scentBreakdown?: ScentFacetBreakdown[];
  ifraLimitPercent?: number;
  supplier?: string;
  purchaseUrl?: string;
  purchaseDate?: string;
  storageLocation?: string;
  bottleLabel?: string;
  olfactoryNotes: string;
  tags?: string[];
  createdAt: string;
}

export interface FormulaComponent {
  id: string;
  ingredientId?: string;
  name: string;
  tier: NoteTier;
  family: OlfactoryFamilyKey;
  dilutionPercent: number;
  weightGrams: number;
  costPerGram?: number;
  odorImpact?: number;
  substantivityHours?: number;
  scentBreakdown?: ScentFacetBreakdown[];
  note?: string;
}

export interface OlfactoryMapNote {
  id: string;
  name: string;
  ingredientId?: string;
  percentage: number;
  description: string;
}

export interface OlfactoryMapData {
  topNotes: OlfactoryMapNote[];
  heartNotes: OlfactoryMapNote[];
  baseNotes: OlfactoryMapNote[];
  profile: Record<OlfactoryFamilyKey, number>;
  longevityHours: number;
  sillageLevel: SillageLevel;
  evaporationNotes?: string;
}

export type JournalVerdict = 'promising' | 'needs_work' | 'approved' | 'rejected';

export interface ScentEvolutionPoint {
  id: string;
  minutesFromApplication: number;
  timeLabel: string;
  topIntensity: number;
  heartIntensity: number;
  baseIntensity: number;
  impression?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  trialLabel: string;
  verdict: JournalVerdict;
  content: string;
  formulaSnapshotSummary?: string;
  scentEvolution?: ScentEvolutionPoint[];
}

export interface LibraryNote {
  id: string;
  date: string;
  text: string;
}

export interface LibraryIngredient {
  id: string;
  name: string;
  inciOrCas?: string;
  synonyms?: string[];
  family: OlfactoryFamilyKey;
  tier: NoteTier;
  origin: IngredientOrigin;
  blotterLongevity?: string;
  odorImpact?: number;
  substantivityHours?: number;
  averageUsePercent?: string;
  scentBreakdown?: ScentFacetBreakdown[];
  ifraLimitPercent?: number;
  ifraNote?: string;
  properties: string;
  scentDescription: string;
  scentRating: number;
  futureIdeasRating: number;
  notes: LibraryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEstimateItem {
  id: string;
  projectId: string;
  ingredientId?: string;
  ingredientName: string;
  category: BudgetCategory;
  requiredQuantity: number;
  unit: MeasurementUnit;
  estimatedUnitPrice: number;
  notes?: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  ingredientName: string;
  category?: BudgetCategory;
  ingredientId?: string;
  projectId?: string;
  estimateItemId?: string;
  quantity: number;
  unit: MeasurementUnit;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  notes?: string;
}

export type SaleChannel = 'direct' | 'marketplace' | 'boutique' | 'fair' | 'gift';

export interface SaleRecord {
  id: string;
  date: string;
  projectId?: string;
  fragranceName: string;
  bottleMl: number;
  quantity: number;
  unitPrice: number;
  totalRevenue: number;
  unitCost?: number;
  channel: SaleChannel;
  customerOrOrder?: string;
  notes?: string;
}

export type MacerationStage = 'concentrate' | 'perfume';

export interface MacerationBatch {
  id: string;
  stage: MacerationStage;
  label: string;
  startDate: string;
  durationDays: number;
  notes?: string;
  acknowledged?: boolean;
}

export interface ProjectRevision {
  id: string;
  versionCode: string;
  title: string;
  date: string;
  createdAtTime?: string;
  targetConcentration: ConcentrationType;
  targetBottleMl: number;
  components: FormulaComponent[];
  notes: string;
  isBaseline?: boolean;
}

export interface ProjectFormulaVariant {
  id: string;
  name: string;
  createdAt: string;
  targetConcentration: ConcentrationType;
  targetBottleMl: number;
  components: FormulaComponent[];
  notes?: string;
}

export interface PerfumeProject {
  id: string;
  title: string;
  code: string;
  status: ProjectStatus;
  targetConcentration: ConcentrationType;
  targetBottleMl: number;
  targetConcentrateGrams?: number;
  idea: string;
  inspiration: string;
  desiredNotes?: {
    top: string;
    heart: string;
    base: string;
  };
  components: FormulaComponent[];
  olfactoryMap: OlfactoryMapData;
  journal: JournalEntry[];
  macerations?: MacerationBatch[];
  revisions?: ProjectRevision[];
  variants?: ProjectFormulaVariant[];
  packagingCostPerUnit: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetCategory =
  | 'raw_materials'
  | 'solvent'
  | 'glassware'
  | 'equipment'
  | 'packaging'
  | 'other';

export type AppSection =
  | 'projects'
  | 'ingredients'
  | 'library'
  | 'budget'
  | 'statistics'
  | 'sales'
  | 'dilution';
export type ProjectTab =
  | 'formula'
  | 'ingredients'
  | 'olfactory'
  | 'journal'
  | 'cost'
  | 'dilution'
  | 'management';

export interface ViewSettings {
  showStatusBar: boolean;
  showPageDescriptions: boolean;
  showProjectMetrics: boolean;
  showIngredientSpecsExtra: boolean;
  showIngredientPurchaseBar: boolean;
  widePageLayout: boolean;
}

export type IngredientSortBy =
  | 'default'
  | 'name_asc'
  | 'unit_price_asc'
  | 'unit_price_desc'
  | 'total_price_desc';

export interface IngredientFilters {
  status: 'all' | IngredientStatus;
  family: 'all' | OlfactoryFamilyKey;
  tier: 'all' | NoteTier;
  origin: 'all' | IngredientOrigin;
  sillage: 'all' | SillageLevel;
  supplier: string;
  url: 'all' | 'with_url' | 'without_url';
  ifraOnly: boolean;
  lowStockOnly: boolean;
  priceFluctuationOnly?: boolean;
  tags: string[];
  tagMatchMode?: 'any' | 'all';
  sortBy: IngredientSortBy;
  searchQuery: string;
}

export type AppLanguage = 'ru' | 'en' | 'it' | 'es' | 'de';

export type AppCurrency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'KZT' | 'BYN';

export type ThemeColorKey = 'cobalt' | 'emerald' | 'plum' | 'slate' | 'terracotta';

export type ColorMode = 'light' | 'dark';

export interface HomeSectionsSettings {
  showMacerationNotifications: boolean;
  showLowStockIngredients: boolean;
  showQuickAccess: boolean;
  showRecentProjects: boolean;
  showRecentNotes: boolean;
}

export interface AppSettings {
  studioName?: string;
  language: AppLanguage;
  currency: AppCurrency;
  themeColor: ThemeColorKey;
  colorMode: ColorMode;
  homeSections: HomeSectionsSettings;
  criticalStockGrams: number;
  defaultConcentrateGrams?: number;
  bottleVolumesMl?: number[];
  lastBackupAt?: string;
}



