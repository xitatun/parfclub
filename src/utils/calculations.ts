import { EMPTY_PROFILE } from '../data/constants';
import type {
  AppCurrency,
  AppLanguage,
  FormulaComponent,
  Ingredient,
  MacerationBatch,
  MeasurementUnit,
  OlfactoryFamilyKey,
  PurchaseRecord,
} from '../types/perfume';

export interface FormulaSummary {
  totalWeightGrams: number;
  aromaticMixtureGrams: number;
  solventCarrierGrams: number;
  pureAromaticGrams: number;
  pureConcentrationPercent: number;
  totalFormulaCost: number;
  costPerGram: number;
  tierPureGrams: {
    top: number;
    heart: number;
    base: number;
  };
  tierPercentOfPure: {
    top: number;
    heart: number;
    base: number;
  };
}

export function calculateFormulaSummary(components: FormulaComponent[]): FormulaSummary {
  let totalWeightGrams = 0;
  let aromaticMixtureGrams = 0;
  let solventCarrierGrams = 0;
  let pureAromaticGrams = 0;
  let totalFormulaCost = 0;

  const tierPureGrams = {
    top: 0,
    heart: 0,
    base: 0,
  };

  for (const comp of components) {
    const w = Math.max(0, Number(comp.weightGrams) || 0);
    const dil = Math.min(100, Math.max(0, Number(comp.dilutionPercent) || 0));
    const costPerG = Math.max(0, Number(comp.costPerGram) || 0);

    totalWeightGrams += w;
    totalFormulaCost += w * costPerG;

    if (comp.tier === 'solvent') {
      solventCarrierGrams += w;
    } else {
      aromaticMixtureGrams += w;
      const pureMass = w * (dil / 100);
      pureAromaticGrams += pureMass;
      solventCarrierGrams += w - pureMass;
      if (comp.tier === 'top') tierPureGrams.top += pureMass;
      if (comp.tier === 'heart') tierPureGrams.heart += pureMass;
      if (comp.tier === 'base') tierPureGrams.base += pureMass;
    }
  }

  const pureConcentrationPercent =
    totalWeightGrams > 0 ? (pureAromaticGrams / totalWeightGrams) * 100 : 0;

  const tierTotal = tierPureGrams.top + tierPureGrams.heart + tierPureGrams.base;
  const tierPercentOfPure = {
    top: tierTotal > 0 ? (tierPureGrams.top / tierTotal) * 100 : 0,
    heart: tierTotal > 0 ? (tierPureGrams.heart / tierTotal) * 100 : 0,
    base: tierTotal > 0 ? (tierPureGrams.base / tierTotal) * 100 : 0,
  };

  return {
    totalWeightGrams,
    aromaticMixtureGrams,
    solventCarrierGrams,
    pureAromaticGrams,
    pureConcentrationPercent,
    totalFormulaCost,
    costPerGram: totalWeightGrams > 0 ? totalFormulaCost / totalWeightGrams : 0,
    tierPureGrams,
    tierPercentOfPure,
  };
}

export function deriveOlfactoryProfileFromFormula(
  components: FormulaComponent[]
): Record<OlfactoryFamilyKey, number> {
  const weights: Record<OlfactoryFamilyKey, number> = { ...EMPTY_PROFILE };

  let maxWeight = 0;
  for (const comp of components) {
    if (comp.tier === 'solvent') continue;
    const pureMass = Math.max(0, comp.weightGrams) * (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
    weights[comp.family] = (weights[comp.family] || 0) + pureMass;
    if (weights[comp.family] > maxWeight) {
      maxWeight = weights[comp.family];
    }
  }

  const result: Record<OlfactoryFamilyKey, number> = { ...EMPTY_PROFILE };
  if (maxWeight <= 0) return result;

  (Object.keys(weights) as OlfactoryFamilyKey[]).forEach((key) => {
    const val = weights[key];
    result[key] = val > 0 ? Math.max(1, Math.min(10, Math.round((val / maxWeight) * 9))) : 0;
  });

  return result;
}

export function getIntlLocale(lang: AppLanguage = 'ru'): string {
  switch (lang) {
    case 'en':
      return 'en-US';
    case 'it':
      return 'it-IT';
    case 'es':
      return 'es-ES';
    case 'de':
      return 'de-DE';
    default:
      return 'ru-RU';
  }
}

export function formatCurrencyRub(
  amount: number,
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
): string {
  return new Intl.NumberFormat(getIntlLocale(lang), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCurrencyDecimal(
  amount: number,
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
): string {
  return new Intl.NumberFormat(getIntlLocale(lang), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatGrams(grams: number, decimals = 2, lang: AppLanguage = 'ru'): string {
  const num = Number.isFinite(grams) ? grams : 0;
  return `${num.toFixed(decimals)} ${lang === 'ru' ? 'г' : 'g'}`;
}

export function formatPercent(pct: number, decimals = 1): string {
  const num = Number.isFinite(pct) ? pct : 0;
  return `${num.toFixed(decimals)}%`;
}

function parseIsoUtcDay(isoDate: string): number {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    const now = new Date();
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  }
  return Date.UTC(parts[0], parts[1] - 1, parts[2]);
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const utc = parseIsoUtcDay(isoDate) + Math.round(days) * 86_400_000;
  return new Date(utc).toISOString().slice(0, 10);
}

export function diffDaysBetweenIsoDates(fromIso: string, toIso: string): number {
  return Math.round((parseIsoUtcDay(toIso) - parseIsoUtcDay(fromIso)) / 86_400_000);
}

export interface MacerationProgress {
  endDate: string;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  overdueDays: number;
  isComplete: boolean;
  progressPercent: number;
}

export function getMacerationStatus(
  batch: MacerationBatch,
  todayIso: string
): MacerationProgress {
  const totalDays = Math.max(1, Math.round(batch.durationDays || 1));
  const endDate = addDaysToIsoDate(batch.startDate, totalDays);
  const elapsedRaw = diffDaysBetweenIsoDates(batch.startDate, todayIso);
  const elapsedDays = Math.max(0, elapsedRaw);
  const remainingDays = Math.max(0, diffDaysBetweenIsoDates(todayIso, endDate));
  const overdueDays = Math.max(0, diffDaysBetweenIsoDates(endDate, todayIso));
  const isComplete = todayIso >= endDate;
  const progressPercent = isComplete
    ? 100
    : Math.min(99, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  return {
    endDate,
    totalDays,
    elapsedDays,
    remainingDays,
    overdueDays,
    isComplete,
    progressPercent,
  };
}

export function getIngredientStockGrams(ing: Ingredient): number | null {
  if (ing.status !== 'in_stock') return null;
  const raw = Math.max(0, Number(ing.remainingGrams ?? ing.quantityGrams) || 0);
  if (ing.unit === 'г') return raw;
  if (ing.unit === 'кг') return raw * 1000;
  if (ing.unit === 'мл') return raw;
  return null;
}

export function isIngredientCriticalStock(
  ing: Ingredient,
  minThresholdGrams: number
): boolean {
  if (!Number.isFinite(minThresholdGrams) || minThresholdGrams <= 0) return false;
  const grams = getIngredientStockGrams(ing);
  if (grams === null) return false;
  return grams < minThresholdGrams;
}

export function isIngredientRunningLow(ing: Ingredient): boolean {
  if (ing.status !== 'in_stock') return false;
  const remaining = getIngredientStockGrams(ing);
  if (remaining === null) return false;
  const total = ing.quantityGrams > 0 ? ing.quantityGrams : remaining || 1;
  const ratio = Math.max(0, Math.min(1, remaining / total));
  return remaining <= 15 || ratio <= 0.35;
}

export interface IngredientPriceHistoryPoint {
  id: string;
  date: string;
  supplier: string;
  quantity: number;
  unit: MeasurementUnit;
  unitPrice: number;
  normalizedUnitPrice: number;
  totalCost: number;
  notes?: string;
}

export interface IngredientPriceFluctuation {
  direction: 'up' | 'down';
  percentChange: number;
  absPercentChange: number;
  previousUnitPrice: number;
  currentUnitPrice: number;
  previousDate?: string;
  currentDate?: string;
  previousSupplier?: string;
  currentSupplier?: string;
  source: 'catalog_vs_last_purchase' | 'purchase_history' | 'catalog_edit';
  history: IngredientPriceHistoryPoint[];
}

function normalizePriceToTargetUnit(
  unitPrice: number,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit
): number | null {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return null;
  if (fromUnit === toUnit) return unitPrice;
  if (fromUnit === 'кг' && toUnit === 'г') return unitPrice / 1000;
  if (fromUnit === 'г' && toUnit === 'кг') return unitPrice * 1000;
  return null;
}

export function getIngredientPurchaseHistory(
  ing: Ingredient,
  purchases: PurchaseRecord[]
): IngredientPriceHistoryPoint[] {
  const normalizedName = ing.name.trim().toLowerCase();
  const matched: (IngredientPriceHistoryPoint & { originalIndex: number })[] = [];

  purchases.forEach((p, originalIndex) => {
    const isMatch =
      p.ingredientId === ing.id ||
      (normalizedName.length > 0 && p.ingredientName.trim().toLowerCase() === normalizedName);
    if (!isMatch) return;

    const rawUnitPrice =
      p.unitPrice > 0
        ? p.unitPrice
        : p.quantity > 0 && p.totalCost > 0
          ? p.totalCost / p.quantity
          : 0;
    const normalizedUnitPrice = normalizePriceToTargetUnit(rawUnitPrice, p.unit, ing.unit);
    if (normalizedUnitPrice === null || normalizedUnitPrice <= 0) return;

    matched.push({
      id: p.id,
      date: p.date,
      supplier: p.supplier,
      quantity: p.quantity,
      unit: p.unit,
      unitPrice: rawUnitPrice,
      normalizedUnitPrice,
      totalCost: p.totalCost,
      notes: p.notes,
      originalIndex,
    });
  });

  // Sort chronologically ascending; purchases array keeps newest items prepended at lower indices
  matched.sort((a, b) => a.date.localeCompare(b.date) || b.originalIndex - a.originalIndex);
  return matched.map(({ originalIndex: _idx, ...rest }) => rest);
}

export function getIngredientPriceFluctuation(
  ing: Ingredient,
  purchases: PurchaseRecord[],
  thresholdPercent = 10
): IngredientPriceFluctuation | null {
  const history = getIngredientPurchaseHistory(ing, purchases);
  const catalogUnitPrice =
    ing.quantityGrams > 0 && ing.priceTotal > 0 ? ing.priceTotal / ing.quantityGrams : 0;

  let previousUnitPrice: number | null = null;
  let currentUnitPrice: number | null = null;
  let previousDate: string | undefined;
  let currentDate: string | undefined;
  let previousSupplier: string | undefined;
  let currentSupplier: string | undefined;
  let source: IngredientPriceFluctuation['source'] = 'purchase_history';

  if (history.length >= 1 && catalogUnitPrice > 0) {
    const latest = history[history.length - 1];
    const diffFromLastPurchase =
      Math.abs(catalogUnitPrice - latest.normalizedUnitPrice) / latest.normalizedUnitPrice;
    if (diffFromLastPurchase >= 0.005) {
      previousUnitPrice = latest.normalizedUnitPrice;
      currentUnitPrice = catalogUnitPrice;
      previousDate = latest.date;
      currentDate = ing.purchaseDate || undefined;
      previousSupplier = latest.supplier;
      currentSupplier = ing.supplier || undefined;
      source = 'catalog_vs_last_purchase';
    }
  }

  if (previousUnitPrice === null && history.length >= 2) {
    const prev = history[history.length - 2];
    const latest = history[history.length - 1];
    previousUnitPrice = prev.normalizedUnitPrice;
    currentUnitPrice = latest.normalizedUnitPrice;
    previousDate = prev.date;
    currentDate = latest.date;
    previousSupplier = prev.supplier;
    currentSupplier = latest.supplier;
    source = 'purchase_history';
  }

  if (
    previousUnitPrice === null &&
    history.length === 0 &&
    ing.previousUnitPrice !== undefined &&
    ing.previousUnitPrice > 0 &&
    catalogUnitPrice > 0
  ) {
    previousUnitPrice = ing.previousUnitPrice;
    currentUnitPrice = catalogUnitPrice;
    previousDate = ing.previousPriceDate;
    currentDate = ing.purchaseDate || undefined;
    currentSupplier = ing.supplier || undefined;
    source = 'catalog_edit';
  }

  if (
    previousUnitPrice === null ||
    currentUnitPrice === null ||
    previousUnitPrice <= 0 ||
    currentUnitPrice <= 0
  ) {
    return null;
  }

  const percentChange = ((currentUnitPrice - previousUnitPrice) / previousUnitPrice) * 100;
  const absPercentChange = Math.abs(percentChange);

  if (!Number.isFinite(percentChange) || absPercentChange < thresholdPercent) {
    return null;
  }

  return {
    direction: percentChange >= 0 ? 'up' : 'down',
    percentChange,
    absPercentChange,
    previousUnitPrice,
    currentUnitPrice,
    previousDate,
    currentDate,
    previousSupplier,
    currentSupplier,
    source,
    history,
  };
}

export interface FormulaReadiness {
  percent: number;
  stageKey: 'draft' | 'sketch' | 'pyramid' | 'tuning' | 'complete';
  stageLabel: string;
  tierCounts: {
    top: number;
    heart: number;
    base: number;
    solvent: number;
  };
  aromaticCount: number;
  hasAllTiers: boolean;
  isComplete: boolean;
}

export function calculateFormulaReadiness(
  components: FormulaComponent[],
  language: AppLanguage = 'ru'
): FormulaReadiness {
  const topCount = components.filter((c) => c.tier === 'top').length;
  const heartCount = components.filter((c) => c.tier === 'heart').length;
  const baseCount = components.filter((c) => c.tier === 'base').length;
  const solventCount = components.filter((c) => c.tier === 'solvent').length;
  const aromaticCount = topCount + heartCount + baseCount;

  if (components.length === 0 || aromaticCount === 0) {
    const labels: Record<AppLanguage, string> = {
      ru: 'Черновик (нет нот)',
      en: 'Draft (no notes)',
      it: 'Bozza (nessuna nota)',
      es: 'Borrador (sin notas)',
      de: 'Entwurf (keine Noten)',
    };
    return {
      percent: 0,
      stageKey: 'draft',
      stageLabel: labels[language] || labels.ru,
      tierCounts: { top: 0, heart: 0, base: 0, solvent: solventCount },
      aromaticCount: 0,
      hasAllTiers: false,
      isComplete: false,
    };
  }

  // 1. Pyramid tier presence (up to 60%)
  let tierScore = 0;
  if (topCount > 0) tierScore += 20;
  if (heartCount > 0) tierScore += 20;
  if (baseCount > 0) tierScore += 20;

  // 2. Chord depth & complexity (up to 40%)
  let depthScore = 0;
  if (aromaticCount >= 8) {
    depthScore = 40;
  } else if (aromaticCount >= 5) {
    depthScore = 30;
  } else if (aromaticCount >= 3) {
    depthScore = 20;
  } else if (aromaticCount >= 1) {
    depthScore = 10;
  }

  const rawPercent = Math.min(100, Math.max(5, tierScore + depthScore));
  const hasAllTiers = topCount > 0 && heartCount > 0 && baseCount > 0;
  const isComplete = rawPercent === 100;

  let stageKey: FormulaReadiness['stageKey'] = 'sketch';
  if (isComplete) {
    stageKey = 'complete';
  } else if (hasAllTiers && rawPercent >= 70) {
    stageKey = 'tuning';
  } else if (tierScore >= 40 || rawPercent >= 40) {
    stageKey = 'pyramid';
  } else {
    stageKey = 'sketch';
  }

  const stageLabels: Record<FormulaReadiness['stageKey'], Record<AppLanguage, string>> = {
    draft: {
      ru: 'Черновик',
      en: 'Draft',
      it: 'Bozza',
      es: 'Borrador',
      de: 'Entwurf',
    },
    sketch: {
      ru: 'Начальный аккорд',
      en: 'Initial Chord',
      it: 'Accordo iniziale',
      es: 'Acorde inicial',
      de: 'Erster Akkord',
    },
    pyramid: {
      ru: 'Формирование пирамиды',
      en: 'Pyramid In Progress',
      it: 'Piramide in sviluppo',
      es: 'Pirámide en proceso',
      de: 'Duftpyramide im Aufbau',
    },
    tuning: {
      ru: 'Сбалансированная база',
      en: 'Balanced Pyramid',
      it: 'Piramide bilanciata',
      es: 'Pirámide equilibrada',
      de: 'Ausgewogene Pyramide',
    },
    complete: {
      ru: 'Гармоничная формула',
      en: 'Harmonized Formula',
      it: 'Formula armonizzata',
      es: 'Fórmula armonizada',
      de: 'Harmonisierte Formel',
    },
  };

  return {
    percent: rawPercent,
    stageKey,
    stageLabel: stageLabels[stageKey][language] || stageLabels[stageKey].ru,
    tierCounts: { top: topCount, heart: heartCount, base: baseCount, solvent: solventCount },
    aromaticCount,
    hasAllTiers,
    isComplete,
  };
}
