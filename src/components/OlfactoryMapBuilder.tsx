import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  Plus,
  Trash2,
  Wind,
  Heart,
  Anchor,
  Clock,
  RefreshCw,
  FolderOpen,
  Layers,
  Compass,
  Activity,
  Scale,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
} from 'lucide-react';
import type {
  PerfumeProject,
  Ingredient,
  LibraryIngredient,
  OlfactoryMapData,
  OlfactoryMapNote,
  OlfactoryFamilyKey,
  SillageLevel,
  AppLanguage,
  FormulaComponent,
} from '../types/perfume';
import {
  FAMILY_HEX_MAP,
  OLFACTORY_FAMILIES,
  EMPTY_PROFILE,
  getOlfactoryFamilyLabel,
  getOlfactoryFamilyShort,
  getSillageLabel,
} from '../data/constants';
import { tr } from '../data/i18n';
import { getLocalizedFacetName } from '../data/fraterworksProfiles';
import {
  calculateFormulaSummary,
  calculatePerceivedFormulaImpact,
} from '../utils/calculations';
import { generateId } from '../utils/storage';

interface OlfactoryMapBuilderProps {
  project: PerfumeProject;
  allProjects?: PerfumeProject[];
  onSwitchProject?: (projectId: string) => void;
  ingredients: Ingredient[];
  library?: LibraryIngredient[];
  onUpdateMap: (nextMap: OlfactoryMapData) => void;
  language?: AppLanguage;
  activeComponents?: FormulaComponent[];
  selectedVariantId?: string | null;
  onSelectVariantId?: (variantId: string | null) => void;
  onGoToFormulaInput?: () => void;
}

type PyramidTier = 'top' | 'heart' | 'base';
type MapSectionFilter = 'all' | 'pyramid' | 'radar' | 'volatility';
type RadarDataSource = 'perceived' | 'mass' | 'overlay' | 'manual';

interface JeanCarlesBenchmark {
  id: string;
  label: Record<AppLanguage, string>;
  ratios: { top: number; heart: number; base: number };
  desc: Record<AppLanguage, string>;
}

const JEAN_CARLES_BENCHMARKS: JeanCarlesBenchmark[] = [
  {
    id: 'classic',
    label: {
      ru: 'Классический баланс (20 / 30 / 50)',
      en: 'Classic Balance (20 / 30 / 50)',
      it: 'Equilibrio Classico (20 / 30 / 50)',
      es: 'Equilibrio Clásico (20 / 30 / 50)',
      de: 'Klassische Balance (20 / 30 / 50)',
    },
    ratios: { top: 20, heart: 30, base: 50 },
    desc: {
      ru: 'Универсальная пропорция Жан Карля для EDP: 20% стартовых нот, 30% модификаторов сердца и 50% базовых фиксаторов.',
      en: 'Universal Jean Carles proportion for EDP: 20% top notes, 30% heart modifiers, 50% base fixatives.',
      it: 'Proporzione universale Jean Carles per EDP: 20% testa, 30% cuore, 50% fondo.',
      es: 'Proporción universal Jean Carles para EDP: 20% salida, 30% corazón, 50% fondo.',
      de: 'Universelle Jean-Carles-Proportion für EDP: 20% Kopf, 30% Herz, 50% Basis.',
    },
  },
  {
    id: 'chypre_woody',
    label: {
      ru: 'Шипр / Древесный (25 / 20 / 55)',
      en: 'Chypre / Woody (25 / 20 / 55)',
      it: 'Chypre / Legnoso (25 / 20 / 55)',
      es: 'Chipre / Amaderado (25 / 20 / 55)',
      de: 'Chypre / Holzig (25 / 20 / 55)',
    },
    ratios: { top: 25, heart: 20, base: 55 },
    desc: {
      ru: 'Яркий бергамотовый старт и фундаментальная древесно-мшистая или амбровая база.',
      en: 'Bright bergamot opening supported by a deep mossy, woody, or amber foundation.',
      it: 'Apertura brillante al bergamotto su una profonda base legnosa o ambrata.',
      es: 'Salida brillante de bergamota sobre una base profunda amaderada o ambarada.',
      de: 'Strahlender Bergamotte-Auftakt auf tiefer holzig-moosiger Basis.',
    },
  },
  {
    id: 'floral',
    label: {
      ru: 'Цветочный букет (20 / 45 / 35)',
      en: 'Floral Bouquet (20 / 45 / 35)',
      it: 'Bouquet Floreale (20 / 45 / 35)',
      es: 'Bouquet Floral (20 / 45 / 35)',
      de: 'Blumenbouquet (20 / 45 / 35)',
    },
    ratios: { top: 20, heart: 45, base: 35 },
    desc: {
      ru: 'Доминирующее цветочное сердце (роза, жасмин, ирис, гедион) на мягкой мускусно-древесной подушке.',
      en: 'Dominant floral heart (rose, jasmine, iris, hedione) resting on a soft musky-woody cushion.',
      it: 'Cuore floreale dominante su un morbido cuscino muschiato e legnoso.',
      es: 'Corazón floral dominante sobre un suave cojín almizclado y amaderado.',
      de: 'Dominantes Blütenherz auf einem weichen moschusartig-holzigen Fundament.',
    },
  },
  {
    id: 'cologne',
    label: {
      ru: 'Одеколон / Цитрус (45 / 30 / 25)',
      en: 'Cologne / Citrus (45 / 30 / 25)',
      it: 'Colonia / Agrumato (45 / 30 / 25)',
      es: 'Colonia / Cítrico (45 / 30 / 25)',
      de: 'Cologne / Zitrisch (45 / 30 / 25)',
    },
    ratios: { top: 45, heart: 30, base: 25 },
    desc: {
      ru: 'Взрывной цитрусово-травяной старт с петитгрейном, нероли и прозрачной базой.',
      en: 'Explosive citrus-herbal opening with petitgrain, neroli, and a transparent base.',
      it: 'Apertura esplosiva agrumata-erbacea con petitgrain, neroli e fondo trasparente.',
      es: 'Salida explosiva cítrica-herbal con petitgrain, neroli y fondo transparente.',
      de: 'Explosiver zitrisch-kräuteriger Auftakt mit Petitgrain, Neroli und transparenter Basis.',
    },
  },
  {
    id: 'oriental',
    label: {
      ru: 'Восточный / Гурманский (15 / 30 / 55)',
      en: 'Amber / Gourmand (15 / 30 / 55)',
      it: 'Orientale / Gourmand (15 / 30 / 55)',
      es: 'Oriental / Gourmand (15 / 30 / 55)',
      de: 'Orientalisch / Gourmand (15 / 30 / 55)',
    },
    ratios: { top: 15, heart: 30, base: 55 },
    desc: {
      ru: 'Плотный бальзамический, ванильный, смолистый или удовый шлейф с высокой стойкостью.',
      en: 'Dense balsamic, vanilla, resinous, or oud trail with extended longevity.',
      it: 'Scia densa balsamica, vanigliata o resinosa con lunga persistenza.',
      es: 'Estela densa balsámica, avainillada o resinosa con gran fijación.',
      de: 'Dichte balsamische, vanillige oder harzige Basis mit hoher Haltbarkeit.',
    },
  },
];

interface TimeCheckpoint {
  id: string;
  hours: number;
  label: Record<AppLanguage, string>;
  phase: Record<AppLanguage, string>;
}

const VOLATILITY_CHECKPOINTS: TimeCheckpoint[] = [
  {
    id: 't_10m',
    hours: 0.2,
    label: { ru: '10 мин', en: '10 min', it: '10 min', es: '10 min', de: '10 Min' },
    phase: { ru: 'Вспышка старта', en: 'Initial Flash', it: 'Flash Iniziale', es: 'Flash Inicial', de: 'Kopf-Flash' },
  },
  {
    id: 't_30m',
    hours: 0.5,
    label: { ru: '30 мин', en: '30 min', it: '30 min', es: '30 min', de: '30 Min' },
    phase: { ru: 'Верхние ноты', en: 'Top Notes', it: 'Note di Testa', es: 'Notas de Salida', de: 'Kopfnoten' },
  },
  {
    id: 't_1h',
    hours: 1,
    label: { ru: '1 час', en: '1 hr', it: '1 ora', es: '1 h', de: '1 Std' },
    phase: { ru: 'Переход к сердцу', en: 'Heart Bridge', it: 'Ponte al Cuore', es: 'Puente al Corazón', de: 'Herz-Übergang' },
  },
  {
    id: 't_3h',
    hours: 3,
    label: { ru: '3 часа', en: '3 hrs', it: '3 ore', es: '3 h', de: '3 Std' },
    phase: { ru: 'Раскрытие сердца', en: 'Full Heart', it: 'Pieno Cuore', es: 'Pleno Corazón', de: 'Volles Herz' },
  },
  {
    id: 't_6h',
    hours: 6,
    label: { ru: '6 часов', en: '6 hrs', it: '6 ore', es: '6 h', de: '6 Std' },
    phase: { ru: 'Ранний шлейф', en: 'Early Drydown', it: 'Fondo Iniziale', es: 'Secado Temprano', de: 'Früher Drydown' },
  },
  {
    id: 't_12h',
    hours: 12,
    label: { ru: '12 часов', en: '12 hrs', it: '12 ore', es: '12 h', de: '12 Std' },
    phase: { ru: 'Глубокая база', en: 'Deep Drydown', it: 'Fondo Profondo', es: 'Fondo Profundo', de: 'Tiefe Basis' },
  },
  {
    id: 't_24h',
    hours: 24,
    label: { ru: '24+ часа', en: '24h+', it: '24h+', es: '24h+', de: '24h+' },
    phase: { ru: 'След на коже / ткани', en: 'Skin / Fabric Trace', it: 'Traccia su Pelle', es: 'Rastro en Piel', de: 'Haut-/Stoffspur' },
  },
];

const DEFAULT_MAP: OlfactoryMapData = {
  topNotes: [],
  heartNotes: [],
  baseNotes: [],
  profile: { ...EMPTY_PROFILE },
  longevityHours: 8,
  sillageLevel: 'moderate',
  evaporationNotes: '',
};

export function OlfactoryMapBuilder({
  project,
  allProjects = [],
  onSwitchProject,
  ingredients,
  library = [],
  onUpdateMap,
  language = 'ru',
  activeComponents: propActiveComponents,
  selectedVariantId,
  onSelectVariantId,
  onGoToFormulaInput,
}: OlfactoryMapBuilderProps) {
  const map: OlfactoryMapData = project.olfactoryMap || {
    ...DEFAULT_MAP,
    profile: { ...EMPTY_PROFILE },
  };

  const formulaComponents = propActiveComponents || project.components;
  const aromaticComponents = useMemo(
    () => formulaComponents.filter((c) => c.tier !== 'solvent' && c.weightGrams > 0),
    [formulaComponents]
  );
  const hasFormula = aromaticComponents.length > 0;

  // UI View States
  const [sectionFilter, setSectionFilter] = useState<MapSectionFilter>('all');
  const [radarSource, setRadarSource] = useState<RadarDataSource>('perceived');
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('classic');
  const [selectedFamilyKey, setSelectedFamilyKey] = useState<OlfactoryFamilyKey | null>(null);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string>('t_3h');
  const [selectedTierFocus, setSelectedTierFocus] = useState<PyramidTier | null>(null);
  const [showCustomNoteDrawer, setShowCustomNoteDrawer] = useState<boolean>(false);

  // Custom Note Quick-Add State
  const [customTier, setCustomTier] = useState<PyramidTier>('top');
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPercentage, setCustomPercentage] = useState<string>('25');

  // Formula Summary & Perceived Impact Analysis
  const summary = useMemo(
    () => calculateFormulaSummary(formulaComponents),
    [formulaComponents]
  );
  const perceivedAnalysis = useMemo(
    () => calculatePerceivedFormulaImpact(formulaComponents, ingredients, library),
    [formulaComponents, ingredients, library]
  );

  // Enriched formula items per tier
  const enrichedFormulaItems = useMemo(() => {
    const items = aromaticComponents.map((comp) => {
      const pureGrams = comp.weightGrams * (Math.max(0, Math.min(100, comp.dilutionPercent)) / 100);
      const massPct =
        summary.pureAromaticGrams > 0 ? (pureGrams / summary.pureAromaticGrams) * 100 : 0;
      const perceivedInfo = perceivedAnalysis.byComponentId[comp.id];
      const impactPct = perceivedInfo?.perceivedImpactPercent || 0;
      const passport = perceivedInfo?.passport;

      return {
        comp,
        pureGrams,
        massPct,
        impactPct,
        passport,
        substantivityHours:
          passport?.substantivityHours ??
          (comp.tier === 'top' ? 2 : comp.tier === 'heart' ? 12 : 72),
        odorImpact: passport?.odorImpact ?? 100,
      };
    });

    return {
      all: items,
      top: items.filter((i) => i.comp.tier === 'top').sort((a, b) => b.impactPct - a.impactPct),
      heart: items.filter((i) => i.comp.tier === 'heart').sort((a, b) => b.impactPct - a.impactPct),
      base: items.filter((i) => i.comp.tier === 'base').sort((a, b) => b.impactPct - a.impactPct),
    };
  }, [aromaticComponents, summary.pureAromaticGrams, perceivedAnalysis]);

  const topFacets = useMemo(() => {
    const mapFacets = new Map<string, { facet: string; family: OlfactoryFamilyKey; sharePercent: number }>();
    for (const item of enrichedFormulaItems.all) {
      const breakdown = item.passport?.scentBreakdown;
      if (breakdown && breakdown.length > 0) {
        const sumPct = breakdown.reduce((acc, b) => acc + b.percent, 0) || 100;
        for (const b of breakdown) {
          const share = item.impactPct * (b.percent / sumPct);
          const existing = mapFacets.get(b.facet);
          if (existing) {
            existing.sharePercent += share;
          } else {
            mapFacets.set(b.facet, { facet: b.facet, family: b.family, sharePercent: share });
          }
        }
      }
    }
    return Array.from(mapFacets.values())
      .filter((f) => f.sharePercent >= 1)
      .sort((a, b) => b.sharePercent - a.sharePercent)
      .slice(0, 6);
  }, [enrichedFormulaItems.all]);

  // Tier Impact % vs Mass %
  const tierMetrics = useMemo(() => {
    const topImpact = enrichedFormulaItems.top.reduce((acc, i) => acc + i.impactPct, 0);
    const heartImpact = enrichedFormulaItems.heart.reduce((acc, i) => acc + i.impactPct, 0);
    const baseImpact = enrichedFormulaItems.base.reduce((acc, i) => acc + i.impactPct, 0);
    const totalImpact = topImpact + heartImpact + baseImpact;

    return {
      top: {
        massPct: summary.tierPercentOfPure.top || 0,
        impactPct: totalImpact > 0 ? (topImpact / totalImpact) * 100 : 0,
        pureGrams: summary.tierPureGrams.top || 0,
        count: enrichedFormulaItems.top.length,
        customNotes: map.topNotes,
      },
      heart: {
        massPct: summary.tierPercentOfPure.heart || 0,
        impactPct: totalImpact > 0 ? (heartImpact / totalImpact) * 100 : 0,
        pureGrams: summary.tierPureGrams.heart || 0,
        count: enrichedFormulaItems.heart.length,
        customNotes: map.heartNotes,
      },
      base: {
        massPct: summary.tierPercentOfPure.base || 0,
        impactPct: totalImpact > 0 ? (baseImpact / totalImpact) * 100 : 0,
        pureGrams: summary.tierPureGrams.base || 0,
        count: enrichedFormulaItems.base.length,
        customNotes: map.baseNotes,
      },
    };
  }, [enrichedFormulaItems, summary, map]);

  // Active Jean Carles Benchmark & Diagnostic
  const activeBenchmark = useMemo(
    () =>
      JEAN_CARLES_BENCHMARKS.find((b) => b.id === selectedBenchmarkId) ||
      JEAN_CARLES_BENCHMARKS[0],
    [selectedBenchmarkId]
  );

  const jeanCarlesDiagnostic = useMemo(() => {
    if (!hasFormula) return null;
    const mTop = tierMetrics.top.massPct;
    const mHeart = tierMetrics.heart.massPct;
    const mBase = tierMetrics.base.massPct;

    const topDiff = mTop - activeBenchmark.ratios.top;
    const heartDiff = mHeart - activeBenchmark.ratios.heart;
    const baseDiff = mBase - activeBenchmark.ratios.base;

    const warnings: string[] = [];
    if (mTop > activeBenchmark.ratios.top + 15) {
      warnings.push(
        tr(language, {
          ru: 'Избыток верхних нот: яркий взрывной старт, но композиция может быстро «провалиться» через 20–30 минут.',
          en: 'Top-heavy balance: explosive opening, but the scent may drop off after 20–30 minutes.',
          it: 'Eccesso di note di testa: apertura esplosiva ma possibile calo dopo 20-30 minuti.',
          es: 'Exceso de salida: apertura explosiva pero puede caer tras 20-30 minutos.',
          de: 'Kopfnoten-Übergewicht: starker Auftakt, fällt nach 20–30 Min. eventuell ab.',
        })
      );
    }
    if (mHeart < 12) {
      warnings.push(
        tr(language, {
          ru: 'Дефицит модификаторов сердца: между цитрусовым стартом и базовым шлейфом возможен «разрыв» в раскрытии.',
          en: 'Low heart modifiers: a gap may appear between the opening and the base drydown.',
          it: 'Pochi modificatori di cuore: possibile vuoto tra apertura e fondo.',
          es: 'Pocos modificadores de corazón: posible vacío entre salida y fondo.',
          de: 'Wenig Herz-Modifikatoren: mögliche Lücke zwischen Kopf und Basis.',
        })
      );
    }
    if (mBase < 20) {
      warnings.push(
        tr(language, {
          ru: 'Слабая база (<20%): рекомендуем усилить фиксаторы (мускусы, амбру, древесные смолы) для удержания шлейфа.',
          en: 'Light base (<20%): consider adding fixatives (musks, amber, woods) to anchor longevity.',
          it: 'Base leggera (<20%): aggiungi fissativi per migliorare la persistenza.',
          es: 'Base ligera (<20%): añade fijadores para sostener la longevidad.',
          de: 'Leichte Basis (<20%): Fixateure (Moschus, Amber, Hölzer) für längere Haltbarkeit erhöhen.',
        })
      );
    }

    return {
      topDiff,
      heartDiff,
      baseDiff,
      warnings,
      isBalanced: warnings.length === 0,
    };
  }, [hasFormula, tierMetrics, activeBenchmark, language]);

  // Unified 10-Family Radar Data
  const radarChartData = useMemo(() => {
    const perceivedMax = Math.max(
      1,
      ...OLFACTORY_FAMILIES.map((f) => perceivedAnalysis.perceivedFamilyProfile[f.key] || 0)
    );
    const massMax = Math.max(
      1,
      ...OLFACTORY_FAMILIES.map((f) => perceivedAnalysis.massFamilyProfile[f.key] || 0)
    );

    return OLFACTORY_FAMILIES.map((fam) => {
      const perceivedPct = Number((perceivedAnalysis.perceivedFamilyProfile[fam.key] || 0).toFixed(1));
      const massPct = Number((perceivedAnalysis.massFamilyProfile[fam.key] || 0).toFixed(1));
      const manualScore = Number((map.profile[fam.key] ?? 0).toFixed(1));

      // Normalized 0..10 scale so all modes can be plotted or overlaid cleanly
      const perceivedScore10 = hasFormula
        ? Number(Math.min(10, (perceivedPct / perceivedMax) * 9.5).toFixed(1))
        : manualScore;
      const massScore10 = hasFormula
        ? Number(Math.min(10, (massPct / massMax) * 9.5).toFixed(1))
        : manualScore;

      return {
        key: fam.key,
        family: getOlfactoryFamilyShort(fam.key, language),
        fullLabel: getOlfactoryFamilyLabel(fam.key, language),
        color: FAMILY_HEX_MAP[fam.key],
        perceivedPct,
        massPct,
        manualScore,
        perceivedScore10,
        massScore10,
        primaryValue:
          radarSource === 'manual'
            ? manualScore
            : radarSource === 'mass'
            ? massPct
            : perceivedPct,
      };
    });
  }, [perceivedAnalysis, map.profile, hasFormula, radarSource, language]);

  // High-Impact Outliers & Volume Builders (Perceived % vs Mass %)
  const impactVsMassInsights = useMemo(() => {
    if (!hasFormula) return { highImpactDrivers: [], volumeBuilders: [] };
    const highImpactDrivers = enrichedFormulaItems.all
      .filter((item) => item.impactPct >= 4 && item.impactPct - item.massPct >= 3.5)
      .sort((a, b) => b.impactPct - a.impactPct - (a.impactPct - a.massPct))
      .slice(0, 4);

    const volumeBuilders = enrichedFormulaItems.all
      .filter((item) => item.massPct >= 5 && item.massPct - item.impactPct >= 3)
      .sort((a, b) => b.massPct - b.impactPct - (a.massPct - a.impactPct))
      .slice(0, 4);

    return { highImpactDrivers, volumeBuilders };
  }, [hasFormula, enrichedFormulaItems]);

  // Hourly Volatility Simulation across VOLATILITY_CHECKPOINTS
  const volatilitySimulation = useMemo(() => {
    return VOLATILITY_CHECKPOINTS.map((cp) => {
      const familyTotals: Record<OlfactoryFamilyKey, number> = {
        citrus: 0,
        floral: 0,
        woody: 0,
        amber: 0,
        musk: 0,
        spicy: 0,
        green: 0,
        gourmand: 0,
        leathery: 0,
        aquatic: 0,
      };

      const activeMaterials: Array<{
        id: string;
        name: string;
        tier: PyramidTier;
        family: OlfactoryFamilyKey;
        sharePct: number;
        substantivityHours: number;
      }> = [];

      let totalWeightAtHour = 0;

      for (const item of enrichedFormulaItems.all) {
        const subHours = Math.max(0.5, item.substantivityHours);
        let tierEnvelope = 1;
        if (item.comp.tier === 'top') {
          tierEnvelope = Math.exp(-cp.hours / Math.max(0.6, subHours * 0.35));
        } else if (item.comp.tier === 'heart') {
          const bloom = cp.hours < 0.5 ? 0.65 + 0.35 * (cp.hours / 0.5) : 1;
          tierEnvelope =
            bloom * Math.exp(-Math.max(0, cp.hours - 0.5) / Math.max(2.5, subHours * 0.45));
        } else {
          const bloom = cp.hours < 1 ? 0.45 + 0.55 * Math.min(1, cp.hours / 1) : 1;
          tierEnvelope =
            bloom * Math.exp(-Math.max(0, cp.hours - 1) / Math.max(8, subHours * 0.6));
        }

        const effectiveStrength = item.pureGrams * (item.odorImpact / 100) * tierEnvelope;
        if (effectiveStrength <= 0.00001) continue;

        totalWeightAtHour += effectiveStrength;
        activeMaterials.push({
          id: item.comp.id,
          name: item.comp.name,
          tier: item.comp.tier as PyramidTier,
          family: item.comp.family,
          sharePct: effectiveStrength,
          substantivityHours: item.substantivityHours,
        });

        const facets = item.passport?.scentBreakdown;
        if (facets && facets.length > 0) {
          for (const facet of facets) {
            familyTotals[facet.family] =
              (familyTotals[facet.family] || 0) + effectiveStrength * (facet.percent / 100);
          }
        } else {
          familyTotals[item.comp.family] =
            (familyTotals[item.comp.family] || 0) + effectiveStrength;
        }
      }

      const normalizedFamilies: Record<OlfactoryFamilyKey, number> = { ...familyTotals };
      if (totalWeightAtHour > 0) {
        for (const fam of OLFACTORY_FAMILIES) {
          normalizedFamilies[fam.key] = Number(
            ((familyTotals[fam.key] / totalWeightAtHour) * 100).toFixed(1)
          );
        }
      }

      const topMaterials = activeMaterials
        .map((m) => ({
          ...m,
          sharePct:
            totalWeightAtHour > 0
              ? Number(((m.sharePct / totalWeightAtHour) * 100).toFixed(1))
              : 0,
        }))
        .filter((m) => m.sharePct >= 1)
        .sort((a, b) => b.sharePct - a.sharePct)
        .slice(0, 6);

      return {
        checkpoint: cp,
        familyProfile: normalizedFamilies,
        topMaterials,
        relativeTotalIntensity: totalWeightAtHour,
      };
    });
  }, [enrichedFormulaItems]);

  const activeCheckpointSim = useMemo(
    () =>
      volatilitySimulation.find((s) => s.checkpoint.id === selectedCheckpointId) ||
      volatilitySimulation[3],
    [volatilitySimulation, selectedCheckpointId]
  );

  // Estimated Formula Longevity (from weighted substantivity of base + heart)
  const estimatedFormulaLongevityHours = useMemo(() => {
    if (!hasFormula) return map.longevityHours;
    let weightedHours = 0;
    let totalPure = 0;
    for (const item of enrichedFormulaItems.all) {
      weightedHours += item.pureGrams * Math.min(36, item.substantivityHours);
      totalPure += item.pureGrams;
    }
    if (totalPure <= 0) return map.longevityHours;
    return Math.max(2, Math.min(24, Math.round((weightedHours / totalPure) * 0.45)));
  }, [hasFormula, enrichedFormulaItems, map.longevityHours]);

  // Handlers for updating project.olfactoryMap
  const patchMap = (patch: Partial<OlfactoryMapData>) => {
    onUpdateMap({
      ...map,
      ...patch,
    });
  };

  const handleSyncMapFromFormula = () => {
    if (!hasFormula) return;

    const toNoteItems = (
      list: typeof enrichedFormulaItems.top,
      tierTotalGrams: number
    ): OlfactoryMapNote[] =>
      list.map((item) => {
        const sharePct =
          tierTotalGrams > 0
            ? Math.max(1, Math.min(100, Math.round((item.pureGrams / tierTotalGrams) * 100)))
            : 25;
        return {
          id: generateId('note'),
          name: item.comp.name,
          ingredientId: item.comp.ingredientId,
          percentage: sharePct,
          description:
            item.comp.note ||
            (item.passport?.scentBreakdown
              ? item.passport.scentBreakdown.map((b) => `${getLocalizedFacetName(b.facet, language)} ${b.percent}%`).join(' · ')
              : getOlfactoryFamilyLabel(item.comp.family, language)),
        };
      });

    const maxPerceived = Math.max(
      1,
      ...OLFACTORY_FAMILIES.map((f) => perceivedAnalysis.perceivedFamilyProfile[f.key] || 0)
    );
    const nextProfile: Record<OlfactoryFamilyKey, number> = { ...EMPTY_PROFILE };
    for (const fam of OLFACTORY_FAMILIES) {
      const pct = perceivedAnalysis.perceivedFamilyProfile[fam.key] || 0;
      nextProfile[fam.key] =
        pct > 0 ? Math.max(1, Math.min(10, Number(((pct / maxPerceived) * 9.5).toFixed(1)))) : 0;
    }

    patchMap({
      topNotes: toNoteItems(enrichedFormulaItems.top, summary.tierPureGrams.top),
      heartNotes: toNoteItems(enrichedFormulaItems.heart, summary.tierPureGrams.heart),
      baseNotes: toNoteItems(enrichedFormulaItems.base, summary.tierPureGrams.base),
      profile: nextProfile,
      longevityHours: estimatedFormulaLongevityHours,
    });
  };

  const handleManualSliderChange = (key: OlfactoryFamilyKey, value: number) => {
    patchMap({
      profile: {
        ...map.profile,
        [key]: value,
      },
    });
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    if (!trimmed) return;

    const matchedIng = ingredients.find(
      (i) => i.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    const pct = Math.max(1, Math.min(100, parseInt(customPercentage, 10) || 25));

    const newItem: OlfactoryMapNote = {
      id: generateId('note'),
      name: trimmed,
      ingredientId: matchedIng?.id,
      percentage: pct,
      description:
        customDescription.trim() ||
        matchedIng?.olfactoryNotes ||
        (matchedIng ? getOlfactoryFamilyLabel(matchedIng.family, language) : ''),
    };

    if (customTier === 'top') {
      patchMap({ topNotes: [...map.topNotes, newItem] });
    } else if (customTier === 'heart') {
      patchMap({ heartNotes: [...map.heartNotes, newItem] });
    } else {
      patchMap({ baseNotes: [...map.baseNotes, newItem] });
    }

    setCustomName('');
    setCustomDescription('');
  };

  const handleRemoveCustomNote = (tier: PyramidTier, noteId: string) => {
    if (tier === 'top') {
      patchMap({ topNotes: map.topNotes.filter((n) => n.id !== noteId) });
    } else if (tier === 'heart') {
      patchMap({ heartNotes: map.heartNotes.filter((n) => n.id !== noteId) });
    } else {
      patchMap({ baseNotes: map.baseNotes.filter((n) => n.id !== noteId) });
    }
  };

  // Filtered components when user clicks a family on the radar
  const selectedFamilyComponents = useMemo(() => {
    if (!selectedFamilyKey) return [];
    return enrichedFormulaItems.all
      .map((item) => {
        const facetMatch = item.passport?.scentBreakdown.find(
          (b) => b.family === selectedFamilyKey
        );
        const directMatch = item.comp.family === selectedFamilyKey;
        const weightInFamily = facetMatch
          ? (item.impactPct * facetMatch.percent) / 100
          : directMatch
          ? item.impactPct
          : 0;
        return {
          ...item,
          facetName: facetMatch?.facet,
          facetPercent: facetMatch?.percent,
          weightInFamily,
        };
      })
      .filter((x) => x.weightInFamily > 0.2)
      .sort((a, b) => b.weightInFamily - a.weightInFamily);
  }, [selectedFamilyKey, enrichedFormulaItems]);

  const showPyramid = sectionFilter === 'all' || sectionFilter === 'pyramid';
  const showRadar = sectionFilter === 'all' || sectionFilter === 'radar';
  const showVolatility = sectionFilter === 'all' || sectionFilter === 'volatility';

  return (
    <div className="space-y-6">
      {/* 1. UNIFIED WORKSPACE HEADER & NAVIGATION BAR */}
      <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Compass className="h-4 w-4 text-[var(--theme-accent)]" />
              <h2 className="font-serif text-xl font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Ольфакторная карта и архитектура композиции',
                  en: 'Olfactory Map & Fragrance Architecture',
                  it: 'Mappa Olfattiva e Architettura della Fragranza',
                  es: 'Mapa Olfativo y Arquitectura de la Fragancia',
                  de: 'Duftkarte & Kompositionsarchitektur',
                })}
              </h2>
              <span className="text-xs text-[#6B6D68]">
                · {project.code} · {project.targetConcentration}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B6D68]">
              {tr(language, {
                ru: 'Единое рабочее пространство: интерактивная пирамида, баланс по Жан Карлю, 10-осевой радар реального звучания (Fraterworks Odor Impact) и почасовая кривая испарения.',
                en: 'Unified workbench: interactive pyramid, Jean Carles structural balance, 10-axis perceived scent radar, and hourly volatility curve.',
                it: 'Spazio unificato: piramide interattiva, bilanciamento Jean Carles, radar a 10 assi e curva di evaporazione oraria.',
                es: 'Espacio unificado: pirámide interactiva, balance Jean Carles, radar de 10 ejes y curva de evaporación por horas.',
                de: 'Einheitlicher Arbeitsbereich: interaktive Pyramide, Jean-Carles-Balance, 10-Achsen-Radar und stündliche Abdampfkurve.',
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Project Switcher */}
            {allProjects.length > 1 && onSwitchProject && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5">
                <FolderOpen className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
                <select
                  value={project.id}
                  onChange={(e) => onSwitchProject(e.target.value)}
                  aria-label="Project Switcher"
                  className="bg-transparent text-xs font-semibold text-[#181917] focus:outline-none max-w-[180px] truncate"
                >
                  {allProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Variant Selector (if project has variants) */}
            {(project.variants || []).length > 0 && onSelectVariantId && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5">
                <Layers className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
                <select
                  value={selectedVariantId || ''}
                  onChange={(e) => onSelectVariantId(e.target.value || null)}
                  aria-label="Formula Variant"
                  className="bg-transparent text-xs font-semibold text-[#181917] focus:outline-none max-w-[170px] truncate"
                >
                  <option value="">
                    {tr(language, {
                      ru: 'Основная формула',
                      en: 'Main Formula',
                      it: 'Formula Principale',
                      es: 'Fórmula Principal',
                      de: 'Hauptformel',
                    })}
                  </option>
                  {(project.variants || []).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.components.length})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sync Map with Formula Button */}
            {hasFormula && (
              <button
                type="button"
                onClick={handleSyncMapFromFormula}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 text-xs font-medium text-[#181917] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] transition-colors"
                title={tr(language, {
                  ru: 'Обновить кастомные ноты и оценки радара из текущих компонентов формулы',
                  en: 'Sync custom notes and radar scores from active formula components',
                  it: 'Sincronizza note e punteggi radar dai componenti attivi',
                  es: 'Sincronizar notas y puntuaciones del radar desde la fórmula activa',
                  de: 'Noten und Radarwerte aus aktiven Formelkomponenten synchronisieren',
                })}
              >
                <RefreshCw className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                <span>
                  {tr(language, {
                    ru: 'Синхронизировать с формулой',
                    en: 'Sync with Formula',
                    it: 'Sincronizza con Formula',
                    es: 'Sincronizar con Fórmula',
                    de: 'Mit Formel synchronisieren',
                  })}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-navigation & Summary Metrics Strip */}
        <div className="flex flex-col gap-3 border-t border-[#EAEAE6] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex flex-wrap items-center rounded-lg bg-[#EEEEEC] p-0.5 text-xs">
            {(
              [
                {
                  id: 'all' as const,
                  label: tr(language, {
                    ru: 'Полная карта',
                    en: 'Full Workbench',
                    it: 'Vista Completa',
                    es: 'Vista Completa',
                    de: 'Gesamtansicht',
                  }),
                },
                {
                  id: 'pyramid' as const,
                  label: tr(language, {
                    ru: '1. Пирамида и Жан Карль',
                    en: '1. Pyramid & Jean Carles',
                    it: '1. Piramide & Jean Carles',
                    es: '1. Pirámide y Jean Carles',
                    de: '1. Pyramide & Jean Carles',
                  }),
                },
                {
                  id: 'radar' as const,
                  label: tr(language, {
                    ru: '2. Ольфакторный радар (10 осей)',
                    en: '2. Olfactory Radar (10 Axes)',
                    it: '2. Radar Olfattivo (10 Assi)',
                    es: '2. Radar Olfativo (10 Ejes)',
                    de: '2. Duftradar (10 Achsen)',
                  }),
                },
                {
                  id: 'volatility' as const,
                  label: tr(language, {
                    ru: '3. Кривая испарения (0–24ч)',
                    en: '3. Volatility Curve (0–24h)',
                    it: '3. Curva di Evaporazione (0–24h)',
                    es: '3. Curva de Evaporación (0–24h)',
                    de: '3. Abdampfkurve (0–24h)',
                  }),
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSectionFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                  sectionFilter === tab.id
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#575955] font-mono tabular-nums">
            <span>
              {tr(language, { ru: 'Веществ:', en: 'Materials:', it: 'Materie:', es: 'Materias:', de: 'Rohstoffe:' })}{' '}
              <strong className="text-[#181917]">{aromaticComponents.length}</strong>
            </span>
            <span>·</span>
            <span>
              {tr(language, { ru: 'Баланс В/С/Б:', en: 'T/H/B Mass:', it: 'T/C/F:', es: 'S/C/F:', de: 'K/H/B:' })}{' '}
              <strong className="text-[#181917]">
                {Math.round(tierMetrics.top.massPct)} / {Math.round(tierMetrics.heart.massPct)} /{' '}
                {Math.round(tierMetrics.base.massPct)}%
              </strong>
            </span>
            <span>·</span>
            <span>
              {tr(language, { ru: 'Стойкость:', en: 'Longevity:', it: 'Durata:', es: 'Duración:', de: 'Haltbarkeit:' })}{' '}
              <strong className="text-[var(--theme-accent)]">
                ~{hasFormula ? estimatedFormulaLongevityHours : map.longevityHours} ч
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* EMPTY STATE PROMO IF NO FORMULA YET */}
      {!hasFormula && (
        <section className="rounded-xl border border-dashed border-[#D2D4CE] bg-[#FAFBF9] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#181917] flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[var(--theme-accent)]" />
              <span>
                {tr(language, {
                  ru: 'В формуле пока нет ароматических компонентов — активен режим эскиза (Концепт)',
                  en: 'No aromatic components in formula yet — Concept Sketch Mode is active',
                  it: 'Nessun componente aromatico nella formula — Modalità Bozza attiva',
                  es: 'Aún no hay componentes aromáticos — Modo Boceto Conceptual activo',
                  de: 'Noch keine Duftstoffe in der Formel — Konzept-Skizzenmodus aktiv',
                })}
              </span>
            </div>
            <p className="text-xs text-[#6B6D68]">
              {tr(language, {
                ru: 'Вы можете вручную задать желаемые ноты пирамиды и профиль на радаре ниже или перейти во вкладку «Ингредиенты», чтобы собрать реальную формулу.',
                en: 'You can sketch custom pyramid notes and radar scores below, or open the Ingredients tab to build a live formula.',
                it: 'Puoi definire manualmente le note e il radar qui sotto oppure aggiungere ingredienti reali.',
                es: 'Puedes definir notas y radar manualmente abajo o añadir ingredientes reales a la fórmula.',
                de: 'Du kannst unten Pyramidennoten und Radarwerte skizzieren oder im Tab „Rohstoffe“ Komponenten hinzufügen.',
              })}
            </p>
          </div>
          {onGoToFormulaInput && (
            <button
              type="button"
              onClick={onGoToFormulaInput}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Добавить ингредиенты в формулу',
                  en: 'Add Formula Ingredients',
                  it: 'Aggiungi Ingredienti',
                  es: 'Añadir Ingredientes',
                  de: 'Rohstoffe hinzufügen',
                })}
              </span>
            </button>
          )}
        </section>
      )}

      {/* 2. MODULE 1: INTERACTIVE TAPERED OLFACTORY PYRAMID & JEAN CARLES ARCHITECTURE */}
      {showPyramid && (
        <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#181917] flex items-center gap-2">
                <Scale className="h-4 w-4 text-[var(--theme-accent)]" />
                <span>
                  {tr(language, {
                    ru: '1. Интерактивная Ольфакторная Пирамида и Баланс Жан Карля',
                    en: '1. Interactive Olfactory Pyramid & Jean Carles Architecture',
                    it: '1. Piramide Olfattiva Interattiva e Architettura Jean Carles',
                    es: '1. Pirámide Olfativa Interactiva y Arquitectura Jean Carles',
                    de: '1. Interaktive Duftpyramide & Jean-Carles-Architektur',
                  })}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-[#6B6D68]">
                {tr(language, {
                  ru: 'Сравнение физического веса в формуле (% массы) с реальным ольфакторным давлением в воздухе (% звучания с учётом Odor Impact)',
                  en: 'Compares physical formula weight (Mass %) with real airborne scent projection (Perceived Impact %)',
                  it: 'Confronta il peso fisico nella formula (% Massa) con la proiezione olfattiva reale (% Impatto)',
                  es: 'Compara el peso físico en la fórmula (% Masa) con la proyección olfativa real (% Impacto)',
                  de: 'Vergleicht das physische Formelgewicht (Masse %) mit der tatsächlichen Duftwahrnehmung (Impact %)',
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomNoteDrawer((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  showCustomNoteDrawer
                    ? 'border-[var(--theme-accent)] bg-[#EEF4EE] text-[var(--theme-accent)]'
                    : 'border-[#E4E4E0] bg-[#FAFBF9] text-[#3F413D] hover:border-[var(--theme-accent)]'
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  {tr(language, {
                    ru: 'Концептуальные ноты пирамиды',
                    en: 'Conceptual Pyramid Notes',
                    it: 'Note Concettuali Piramide',
                    es: 'Notas Conceptuales',
                    de: 'Konzept-Pyramidennoten',
                  })}
                </span>
              </button>
            </div>
          </div>

          {/* Optional Drawer for Adding Custom / Marketing Notes to Pyramid */}
          {showCustomNoteDrawer && (
            <form
              onSubmit={handleAddCustomNote}
              className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Добавить концептуальную ноту в пирамиду (для брифа или маркетингового описания)',
                    en: 'Add conceptual note to pyramid (for fragrance brief or marketing description)',
                    it: 'Aggiungi nota concettuale alla piramide',
                    es: 'Añadir nota conceptual a la pirámide',
                    de: 'Konzeptnote zur Pyramide hinzufügen',
                  })}
                </div>
                <span className="text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Отображается вместе с реальными веществами формулы',
                    en: 'Displayed alongside live formula ingredients',
                    it: 'Mostrata insieme agli ingredienti reali',
                    es: 'Se muestra junto a los ingredientes reales',
                    de: 'Wird neben den echten Formelrohstoffen angezeigt',
                  })}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <select
                    value={customTier}
                    onChange={(e) => setCustomTier(e.target.value as PyramidTier)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  >
                    <option value="top">
                      {tr(language, { ru: 'Верхние ноты (Старт)', en: 'Top Notes (Opening)', it: 'Note di Testa', es: 'Notas de Salida', de: 'Kopfnoten' })}
                    </option>
                    <option value="heart">
                      {tr(language, { ru: 'Ноты сердца (Модификаторы)', en: 'Heart Notes (Modifiers)', it: 'Note di Cuore', es: 'Notas de Corazón', de: 'Herznoten' })}
                    </option>
                    <option value="base">
                      {tr(language, { ru: 'Базовые ноты (Фиксаторы)', en: 'Base Notes (Fixatives)', it: 'Note di Fondo', es: 'Notas de Fondo', de: 'Basisnoten' })}
                    </option>
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={tr(language, {
                      ru: 'Например: Калабрийский бергамот, Чёрный инжир...',
                      en: 'e.g. Calabrian Bergamot, Black Fig...',
                      it: 'es. Bergamotto di Calabria, Fico nero...',
                      es: 'ej. Bergamota de Calabria, Higo negro...',
                      de: 'z. B. Kalabrische Bergamotte, Schwarze Feige...',
                    })}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={tr(language, {
                      ru: 'Нюанс / роль (искристый, пудровый)...',
                      en: 'Nuance / role (sparkling, powdery)...',
                      it: 'Sfumatura / ruolo...',
                      es: 'Matiz / rol...',
                      de: 'Nuance / Rolle...',
                    })}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(e.target.value)}
                    title="Share %"
                    className="w-14 rounded-lg border border-[#E4E4E0] bg-white px-2 py-1.5 text-xs font-mono text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--theme-accent)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>
                      {tr(language, { ru: 'Ок', en: 'Add', it: 'Add', es: 'Add', de: 'Add' })}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Main Grid: Left = Architectural Tapered Pyramid (7 cols), Right = Jean Carles Diagnostic (5 cols) */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
            {/* Left 7 cols: Tapered 3-Tier Interactive Pyramid */}
            <div className="xl:col-span-7 space-y-3">
              {(
                [
                  {
                    tier: 'top' as const,
                    title: tr(language, {
                      ru: 'ВЕРХНИЕ НОТЫ · ГОЛОВА АРОМАТА',
                      en: 'TOP NOTES · OPENING IMPRESSION',
                      it: 'NOTE DI TESTA · APERTURA',
                      es: 'NOTAS DE SALIDA · APERTURA',
                      de: 'KOPFNOTEN · AUFTAKT',
                    }),
                    evapWindow: tr(language, {
                      ru: 'Испарение: 0 – 30 мин · Высокая летучесть',
                      en: 'Evaporation: 0 – 30 min · High volatility',
                      it: 'Evaporazione: 0 – 30 min · Alta volatilità',
                      es: 'Evaporación: 0 – 30 min · Alta volatilidad',
                      de: 'Abdampfung: 0 – 30 Min · Hohe Flüchtigkeit',
                    }),
                    icon: <Wind className="h-4 w-4 text-[#D97706]" />,
                    accentHex: '#D97706',
                    bgTint: 'bg-[#FFFBEB]/70',
                    borderTint: 'border-[#FDE68A]',
                    widthClass: 'w-full sm:w-[82%] mx-auto',
                    items: enrichedFormulaItems.top,
                    metrics: tierMetrics.top,
                  },
                  {
                    tier: 'heart' as const,
                    title: tr(language, {
                      ru: 'НОТЫ СЕРДЦА · МОДИФИКАТОРЫ (ЖАН КАРЛЬ)',
                      en: 'HEART NOTES · MODIFIERS (JEAN CARLES)',
                      it: 'NOTE DI CUORE · MODIFICATORI',
                      es: 'NOTAS DE CORAZÓN · MODIFICADORES',
                      de: 'HERZNOTEN · MODIFIKATOREN',
                    }),
                    evapWindow: tr(language, {
                      ru: 'Испарение: 30 мин – 4 ч · Тело и характер композиции',
                      en: 'Evaporation: 30 min – 4 hrs · Core character & bridge',
                      it: 'Evaporazione: 30 min – 4 ore · Carattere centrale',
                      es: 'Evaporación: 30 min – 4 h · Carácter central',
                      de: 'Abdampfung: 30 Min – 4 Std · Charakter & Brücke',
                    }),
                    icon: <Heart className="h-4 w-4 text-[var(--theme-accent)]" />,
                    accentHex: '#2E6F40',
                    bgTint: 'bg-[#F3F8F4]/80',
                    borderTint: 'border-[#BBF7D0]',
                    widthClass: 'w-full sm:w-[91%] mx-auto',
                    items: enrichedFormulaItems.heart,
                    metrics: tierMetrics.heart,
                  },
                  {
                    tier: 'base' as const,
                    title: tr(language, {
                      ru: 'БАЗОВЫЕ НОТЫ · ФИКСАТОРЫ И ФУНДАМЕНТ',
                      en: 'BASE NOTES · FIXATIVES & FOUNDATION',
                      it: 'NOTE DI FONDO · FISSATIVI E STRUTTURA',
                      es: 'NOTAS DE FONDO · FIJADORES Y ESTRUCTURA',
                      de: 'BASISNOTEN · FIXATEURE & FUNDAMENT',
                    }),
                    evapWindow: tr(language, {
                      ru: 'Испарение: 4 – 24+ ч · Стойкость, глубина и шлейф',
                      en: 'Evaporation: 4 – 24+ hrs · Longevity, depth & trail',
                      it: 'Evaporazione: 4 – 24+ ore · Persistenza e scia',
                      es: 'Evaporación: 4 – 24+ h · Fijación y estela',
                      de: 'Abdampfung: 4 – 24+ Std · Haltbarkeit & Sillage',
                    }),
                    icon: <Anchor className="h-4 w-4 text-[#78350F]" />,
                    accentHex: '#78350F',
                    bgTint: 'bg-[#FAF6F0]/90',
                    borderTint: 'border-[#E6D5B8]',
                    widthClass: 'w-full',
                    items: enrichedFormulaItems.base,
                    metrics: tierMetrics.base,
                  },
                ] as const
              ).map((stage) => {
                const isFocused = selectedTierFocus === stage.tier;
                return (
                  <div
                    key={stage.tier}
                    onClick={() =>
                      setSelectedTierFocus((prev) => (prev === stage.tier ? null : stage.tier))
                    }
                    className={`${stage.widthClass} cursor-pointer rounded-xl border p-4 transition-all ${
                      stage.bgTint
                    } ${
                      isFocused
                        ? 'border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]'
                        : stage.borderTint
                    }`}
                  >
                    {/* Tier Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {stage.icon}
                        <div>
                          <div className="text-xs font-bold tracking-wide text-[#181917]">
                            {stage.title}
                          </div>
                          <div className="text-[11px] text-[#6B6D68]">{stage.evapWindow}</div>
                        </div>
                      </div>

                      {hasFormula && (
                        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                          <div className="text-right">
                            <span className="text-[10px] uppercase text-[#6B6D68] block">
                              {tr(language, { ru: 'Звучание', en: 'Impact', it: 'Impatto', es: 'Impacto', de: 'Impact' })}
                            </span>
                            <strong className="text-[#181917]">
                              {stage.metrics.impactPct.toFixed(0)}%
                            </strong>
                          </div>
                          <div className="h-6 w-px bg-[#E4E4E0]" />
                          <div className="text-right">
                            <span className="text-[10px] uppercase text-[#6B6D68] block">
                              {tr(language, { ru: 'По массе', en: 'Mass', it: 'Massa', es: 'Masa', de: 'Masse' })}
                            </span>
                            <strong className="text-[#575955]">
                              {stage.metrics.massPct.toFixed(0)}%
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dual Progress Bar: Perceived Impact vs Mass */}
                    {hasFormula && (
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                          <div
                            style={{
                              width: `${Math.min(100, stage.metrics.impactPct)}%`,
                              backgroundColor: stage.accentHex,
                            }}
                            className="h-full rounded-full transition-all"
                          />
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                          <div
                            style={{
                              width: `${Math.min(100, stage.metrics.massPct)}%`,
                              backgroundColor: stage.accentHex,
                              opacity: 0.45,
                            }}
                            className="h-full rounded-full transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Formula Materials in this Tier */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {stage.items.map((item) => (
                        <div
                          key={item.comp.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFamilyKey(item.comp.family);
                          }}
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs shadow-2xs hover:border-[var(--theme-accent)] transition-colors"
                          title={
                            item.passport
                              ? `${item.comp.name} · ${tr(language, { ru: 'Сила', en: 'Impact', it: 'Forza', es: 'Fuerza', de: 'Stärke' })}: ${item.odorImpact} · ${tr(language, { ru: 'Стойкость', en: 'Longevity', it: 'Persistenza', es: 'Persistencia', de: 'Haltbarkeit' })}: ~${item.substantivityHours}${tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })} · ${tr(language, { ru: 'Грани', en: 'Facets', it: 'Sfaccettature', es: 'Facetas', de: 'Facetten' })}: ${item.passport.scentBreakdown
                                  .map((b) => `${getLocalizedFacetName(b.facet, language)} ${b.percent}%`)
                                  .join(', ')}`
                              : item.comp.name
                          }
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: FAMILY_HEX_MAP[item.comp.family] }}
                          />
                          <span className="font-semibold text-[#181917]">{item.comp.name}</span>
                          {item.comp.dilutionPercent < 100 && (
                            <span className="font-mono text-[10px] text-[#6B6D68]">
                              {item.comp.dilutionPercent}%
                            </span>
                          )}
                          <span className="font-mono text-[11px] font-semibold text-[var(--theme-accent)] tabular-nums">
                            {radarSource === 'mass'
                              ? `${item.massPct.toFixed(1)}%`
                              : `${item.impactPct.toFixed(1)}%`}
                          </span>
                          <span className="text-[10px] font-mono text-[#8B8D87]">
                            ~{item.substantivityHours}ч
                          </span>
                        </div>
                      ))}

                      {/* Custom / Conceptual Notes in this Tier (shown if not already identical to a formula item) */}
                      {stage.metrics.customNotes
                        .filter(
                          (note) =>
                            !stage.items.some(
                              (fi) =>
                                fi.comp.name.trim().toLowerCase() ===
                                note.name.trim().toLowerCase()
                            )
                        )
                        .map((note) => (
                          <div
                            key={note.id}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#C7C8C3] bg-white/80 px-2.5 py-1 text-xs text-[#3F413D]"
                            title={note.description}
                          >
                            <span className="font-medium">{note.name}</span>
                            <span className="font-mono text-[10px] text-[#6B6D68]">
                              {note.percentage}%
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomNote(stage.tier, note.id)}
                              className="text-[#8B8D87] hover:text-[#B91C1C] transition-colors ml-0.5"
                              aria-label={`Remove ${note.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                      {stage.items.length === 0 && stage.metrics.customNotes.length === 0 && (
                        <span className="text-xs italic text-[#8B8D87]">
                          {tr(language, {
                            ru: 'В этом ярусе пока нет компонентов',
                            en: 'No notes in this tier yet',
                            it: 'Nessuna nota in questo livello',
                            es: 'Aún no hay notas en este nivel',
                            de: 'Noch keine Noten in dieser Stufe',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 cols: Jean Carles Structural Benchmark & Architecture Analysis */}
            <div className="xl:col-span-5 rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6D68]">
                    {tr(language, {
                      ru: 'Эталон структуры по Жан Карлю',
                      en: 'Jean Carles Structural Benchmark',
                      it: 'Benchmark Strutturale Jean Carles',
                      es: 'Referencia Estructural Jean Carles',
                      de: 'Jean-Carles-Strukturreferenz',
                    })}
                  </span>
                </div>
                <select
                  value={selectedBenchmarkId}
                  onChange={(e) => setSelectedBenchmarkId(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs font-semibold text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  {JEAN_CARLES_BENCHMARKS.map((bm) => (
                    <option key={bm.id} value={bm.id}>
                      {bm.label[language]}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6B6D68] leading-relaxed pt-0.5">
                  {activeBenchmark.desc[language]}
                </p>
              </div>

              {/* Side-by-Side Comparison Bars: Actual Formula vs Benchmark */}
              <div className="space-y-3 border-t border-[#EAEAE6] pt-3">
                {(
                  [
                    {
                      key: 'top' as const,
                      label: tr(language, {
                        ru: 'Верхние ноты (Старт)',
                        en: 'Top Notes (Opening)',
                        it: 'Note di Testa',
                        es: 'Notas de Salida',
                        de: 'Kopfnoten',
                      }),
                      actualMass: tierMetrics.top.massPct,
                      actualImpact: tierMetrics.top.impactPct,
                      target: activeBenchmark.ratios.top,
                      color: '#D97706',
                    },
                    {
                      key: 'heart' as const,
                      label: tr(language, {
                        ru: 'Сердце (Модификаторы)',
                        en: 'Heart (Modifiers)',
                        it: 'Cuore (Modificatori)',
                        es: 'Corazón (Modificadores)',
                        de: 'Herz (Modifikatoren)',
                      }),
                      actualMass: tierMetrics.heart.massPct,
                      actualImpact: tierMetrics.heart.impactPct,
                      target: activeBenchmark.ratios.heart,
                      color: '#2E6F40',
                    },
                    {
                      key: 'base' as const,
                      label: tr(language, {
                        ru: 'База (Фиксаторы)',
                        en: 'Base (Fixatives)',
                        it: 'Fondo (Fissativi)',
                        es: 'Fondo (Fijadores)',
                        de: 'Basis (Fixateure)',
                      }),
                      actualMass: tierMetrics.base.massPct,
                      actualImpact: tierMetrics.base.impactPct,
                      target: activeBenchmark.ratios.base,
                      color: '#78350F',
                    },
                  ] as const
                ).map((row) => {
                  const diff = Math.round(row.actualMass - row.target);
                  return (
                    <div key={row.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#181917]">{row.label}</span>
                        <span className="font-mono tabular-nums text-[11px] text-[#575955]">
                          <strong className="text-[#181917]">{Math.round(row.actualMass)}%</strong>{' '}
                          {tr(language, { ru: 'масса', en: 'mass', it: 'massa', es: 'masa', de: 'Masse' })} ·{' '}
                          <span className="text-[#6B6D68]">
                            {tr(language, { ru: 'эталон', en: 'target', it: 'target', es: 'meta', de: 'Ziel' })}{' '}
                            {row.target}%
                          </span>{' '}
                          {hasFormula && (
                            <span
                              className={
                                Math.abs(diff) <= 8
                                  ? 'text-[#15803D]'
                                  : 'text-[#B45309]'
                              }
                            >
                              ({diff > 0 ? `+${diff}%` : `${diff}%`})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                        <div
                          style={{
                            width: `${Math.min(100, row.actualMass)}%`,
                            backgroundColor: row.color,
                          }}
                          className="h-full rounded-full transition-all"
                        />
                        {/* Benchmark marker line */}
                        <div
                          style={{ left: `${row.target}%` }}
                          title={`Target: ${row.target}%`}
                          className="absolute top-0 bottom-0 w-0.5 bg-[#181917]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Diagnostic Verdict */}
              {jeanCarlesDiagnostic && (
                <div className="border-t border-[#EAEAE6] pt-3 space-y-2">
                  {jeanCarlesDiagnostic.isBalanced ? (
                    <div className="flex items-start gap-2 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5]/70 p-2.5 text-xs text-[#15803D]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        {tr(language, {
                          ru: 'Пропорции ярусов сбалансированы относительно выбранного эталона Жан Карля. Переход от старта к сердцу и базе плавный.',
                          en: 'Tier proportions are well balanced against the selected Jean Carles benchmark. Smooth transition from opening to drydown.',
                          it: 'Le proporzioni sono ben bilanciate rispetto al riferimento Jean Carles.',
                          es: 'Las proporciones están bien equilibradas respecto a la referencia Jean Carles.',
                          de: 'Die Stufenproportionen sind im Vergleich zur Jean-Carles-Referenz ausgewogen.',
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {jeanCarlesDiagnostic.warnings.map((w, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-2.5 text-xs text-[#92400E]"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#D97706]" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. MODULE 2: UNIFIED 10-AXIS OLFACTORY RADAR & FRATERWORKS PERCEIVED BREAKDOWN */}
      {showRadar && (
        <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#181917] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--theme-accent)]" />
                <span>
                  {tr(language, {
                    ru: '2. Единый 10-осевой Ольфакторный Радар и Фасетный Профиль',
                    en: '2. Unified 10-Axis Olfactory Radar & Facet Profile',
                    it: '2. Radar Olfattivo Unificato a 10 Assi e Profilo Facet',
                    es: '2. Radar Olfativo Unificado de 10 Ejes y Perfil de Facetas',
                    de: '2. Einheitliches 10-Achsen-Duftradar & Facettenprofil',
                  })}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-[#6B6D68]">
                {tr(language, {
                  ru: 'Нажмите на любое ольфакторное семейство справа, чтобы увидеть какие именно ингредиенты и фасеты формируют эту грань аромата.',
                  en: 'Click any olfactory family on the right to inspect the exact ingredients and facets driving that note.',
                  it: 'Clicca su una famiglia olfattiva a destra per vedere gli ingredienti che la compongono.',
                  es: 'Haz clic en cualquier familia olfativa a la derecha para ver qué ingredientes la forman.',
                  de: 'Klicke rechts auf eine Duftfamilie, um zu sehen, welche Rohstoffe und Facetten diese Note prägen.',
                })}
              </p>
            </div>

            {/* Radar Source Mode Switcher */}
            <div className="inline-flex flex-wrap items-center rounded-lg bg-[#EEEEEC] p-0.5 text-xs">
              {(
                [
                  {
                    id: 'perceived' as const,
                    label: tr(language, {
                      ru: 'Реальное звучание (Impact %)',
                      en: 'Perceived Scent (Impact %)',
                      it: 'Odore Percepito (Impact %)',
                      es: 'Olor Percibido (Impact %)',
                      de: 'Wahrnehmung (Impact %)',
                    }),
                  },
                  {
                    id: 'mass' as const,
                    label: tr(language, {
                      ru: 'По массе (Mass %)',
                      en: 'By Weight (Mass %)',
                      it: 'In Peso (Massa %)',
                      es: 'Por Peso (Masa %)',
                      de: 'Nach Gewicht (Masse %)',
                    }),
                  },
                  {
                    id: 'overlay' as const,
                    label: tr(language, {
                      ru: 'Наложение (Звучание vs Масса)',
                      en: 'Overlay (Impact vs Mass)',
                      it: 'Sovrapposizione',
                      es: 'Superposición',
                      de: 'Überlagerung',
                    }),
                  },
                  {
                    id: 'manual' as const,
                    label: tr(language, {
                      ru: 'Ручной профиль (0–10)',
                      en: 'Manual Profile (0–10)',
                      it: 'Profilo Manuale (0–10)',
                      es: 'Perfil Manual (0–10)',
                      de: 'Manuelles Profil (0–10)',
                    }),
                  },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setRadarSource(m.id)}
                  className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                    radarSource === m.id
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#575955] hover:text-[#181917]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
            {/* Radar Chart Column (5 cols) */}
            <div className="xl:col-span-5 rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#575955] mb-1">
                <span className="font-semibold text-[#181917]">
                  {radarSource === 'perceived'
                    ? tr(language, {
                        ru: 'Карта ощущаемого профиля (Fraterworks Impact)',
                        en: 'Perceived Scent Profile (Fraterworks Impact)',
                        it: 'Profilo Olfattivo Percepito',
                        es: 'Perfil Olfativo Percibido',
                        de: 'Wahrgenommenes Duftprofil',
                      })
                    : radarSource === 'mass'
                    ? tr(language, {
                        ru: 'Физическая доля семейств по чистой массе',
                        en: 'Physical Family Share by Pure Mass',
                        it: 'Quota Fisica per Massa Pura',
                        es: 'Proporción Física por Masa Pura',
                        de: 'Physischer Anteil nach reiner Masse',
                      })
                    : radarSource === 'overlay'
                    ? tr(language, {
                        ru: 'Зелёный = Звучание · Терракотовый = Масса',
                        en: 'Green = Perceived Impact · Terracotta = Mass',
                        it: 'Verde = Impatto · Terracotta = Massa',
                        es: 'Verde = Impacto · Terracota = Masa',
                        de: 'Grün = Impact · Terrakotta = Masse',
                      })
                    : tr(language, {
                        ru: 'Ручная калибровка ольфакторного профиля (0–10)',
                        en: 'Manual Olfactory Profile Calibration (0–10)',
                        it: 'Calibrazione Manuale Profilo (0–10)',
                        es: 'Calibración Manual del Perfil (0–10)',
                        de: 'Manuelle Profilkalibrierung (0–10)',
                      })}
                </span>
              </div>

              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={radarChartData}
                    margin={{ top: 16, right: 28, bottom: 16, left: 28 }}
                  >
                    <PolarGrid stroke="#D8D9D4" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="family"
                      tick={{ fill: '#3F413D', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={radarSource === 'manual' || radarSource === 'overlay' ? [0, 10] : [0, 'auto']}
                      tick={{ fill: '#8B8D87', fontSize: 9 }}
                      axisLine={false}
                    />
                    {radarSource === 'overlay' ? (
                      <>
                        <Radar
                          name={tr(language, {
                            ru: 'Звучание (0–10)',
                            en: 'Perceived Impact (0–10)',
                            it: 'Impatto (0–10)',
                            es: 'Impacto (0–10)',
                            de: 'Impact (0–10)',
                          })}
                          dataKey="perceivedScore10"
                          stroke="#2E6F40"
                          strokeWidth={2.2}
                          fill="#2E6F40"
                          fillOpacity={0.28}
                        />
                        <Radar
                          name={tr(language, {
                            ru: 'Масса в формуле (0–10)',
                            en: 'Formula Mass (0–10)',
                            it: 'Massa (0–10)',
                            es: 'Masa (0–10)',
                            de: 'Masse (0–10)',
                          })}
                          dataKey="massScore10"
                          stroke="#C86D51"
                          strokeWidth={2}
                          strokeDasharray="4 3"
                          fill="#C86D51"
                          fillOpacity={0.15}
                        />
                      </>
                    ) : (
                      <Radar
                        name={
                          radarSource === 'manual'
                            ? tr(language, { ru: 'Оценка (0–10)', en: 'Score (0–10)', it: 'Punteggio', es: 'Puntuación', de: 'Wert' })
                            : radarSource === 'mass'
                            ? tr(language, { ru: 'Доля массы %', en: 'Mass %', it: 'Massa %', es: 'Masa %', de: 'Masse %' })
                            : tr(language, { ru: 'Доля звучания %', en: 'Perceived %', it: 'Impatto %', es: 'Impacto %', de: 'Impact %' })
                        }
                        dataKey="primaryValue"
                        stroke="#2E6F40"
                        strokeWidth={2.2}
                        fill="#2E6F40"
                        fillOpacity={0.28}
                        dot={{ r: 3.5, fill: '#2E6F40', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E4E4E0',
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Dominant Facets Footer */}
              {hasFormula && topFacets.length > 0 && (
                <div className="border-t border-[#EAEAE6] pt-3 space-y-1.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6D68]">
                    {tr(language, {
                      ru: 'Ведущие ольфакторные грани (Fraterworks Facets)',
                      en: 'Leading Olfactory Facets (Fraterworks Breakdown)',
                      it: 'Sfaccettature Olfattive Dominanti',
                      es: 'Facetas Olfativas Dominantes',
                      de: 'Dominante Duftfacetten',
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {topFacets.map((f) => (
                      <span
                        key={f.facet}
                        className="inline-flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#181917]"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: FAMILY_HEX_MAP[f.family] }}
                        />
                        <span>{getLocalizedFacetName(f.facet, language)}</span>
                        <strong className="font-mono text-[var(--theme-accent)]">
                          {f.sharePercent.toFixed(1)}%
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 7 cols: Interactive 10-Family Breakdown Table / Manual Sliders + Selected Family Drilldown */}
            <div className="xl:col-span-7 space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {radarChartData.map((row) => {
                  const isSelected = selectedFamilyKey === row.key;
                  const diff = row.perceivedPct - row.massPct;
                  return (
                    <div
                      key={row.key}
                      onClick={() =>
                        setSelectedFamilyKey((prev) => (prev === row.key ? null : row.key))
                      }
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? 'border-[var(--theme-accent)] bg-[#F3F8F4] ring-1 ring-[var(--theme-accent)]'
                          : 'border-[#E4E4E0] bg-[#FAFBF9] hover:border-[#C7C8C3] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          <span className="text-xs font-semibold text-[#181917] truncate">
                            {row.fullLabel}
                          </span>
                        </div>

                        {radarSource === 'manual' ? (
                          <span className="font-mono text-xs font-bold text-[var(--theme-accent)] tabular-nums">
                            {row.manualScore.toFixed(1)} / 10
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 font-mono text-xs tabular-nums shrink-0">
                            <strong className="text-[#181917]" title="Perceived Scent Impact">
                              {row.perceivedPct.toFixed(1)}%
                            </strong>
                            <span className="text-[11px] text-[#6B6D68]" title="Raw Pure Mass %">
                              ({row.massPct.toFixed(1)}% м)
                            </span>
                          </div>
                        )}
                      </div>

                      {radarSource === 'manual' ? (
                        <div
                          className="mt-2 flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="range"
                            min={0}
                            max={10}
                            step={0.5}
                            value={row.manualScore}
                            onChange={(e) =>
                              handleManualSliderChange(row.key, parseFloat(e.target.value))
                            }
                            className="h-1.5 w-full cursor-pointer accent-[var(--theme-accent)]"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 space-y-1">
                          {/* Perceived Impact bar */}
                          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                            <div
                              style={{
                                width: `${Math.min(100, row.perceivedPct)}%`,
                                backgroundColor: row.color,
                              }}
                              className="h-full rounded-full transition-all"
                            />
                          </div>
                          {hasFormula && Math.abs(diff) >= 3 && (
                            <div className="text-[10px] text-[#6B6D68] flex items-center justify-between">
                              <span>
                                {diff > 0
                                  ? tr(language, {
                                      ru: 'Звучит ярче своей массы',
                                      en: 'Projects stronger than mass',
                                      it: 'Proietta più della massa',
                                      es: 'Proyecta más que su masa',
                                      de: 'Stärker als Masseanteil',
                                    })
                                  : tr(language, {
                                      ru: 'Мягкий объём / база',
                                      en: 'Soft volume / fixative',
                                      it: 'Volume morbido / fissativo',
                                      es: 'Volumen suave / fijador',
                                      de: 'Weiches Volumen / Fixateur',
                                    })}
                              </span>
                              <span
                                className={`font-mono font-semibold ${
                                  diff > 0 ? 'text-[var(--theme-accent)]' : 'text-[#6B6D68]'
                                }`}
                              >
                                {diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drilldown Panel when a Family is clicked */}
              {selectedFamilyKey && (
                <div className="rounded-xl border border-[var(--theme-accent)] bg-[#F3F8F4]/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#181917]">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: FAMILY_HEX_MAP[selectedFamilyKey] }}
                      />
                      <span>
                        {tr(language, {
                          ru: `Компоненты формулы, формирующие грань «${getOlfactoryFamilyLabel(
                            selectedFamilyKey,
                            language
                          )}»`,
                          en: `Formula components driving "${getOlfactoryFamilyLabel(
                            selectedFamilyKey,
                            language
                          )}"`,
                          it: `Componenti che formano "${getOlfactoryFamilyLabel(
                            selectedFamilyKey,
                            language
                          )}"`,
                          es: `Componentes que forman "${getOlfactoryFamilyLabel(
                            selectedFamilyKey,
                            language
                          )}"`,
                          de: `Formelkomponenten für „${getOlfactoryFamilyLabel(
                            selectedFamilyKey,
                            language
                          )}“`,
                        })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFamilyKey(null)}
                      className="text-xs font-medium text-[#575955] hover:text-[#181917]"
                    >
                      {tr(language, { ru: 'Скрыть', en: 'Close', it: 'Chiudi', es: 'Cerrar', de: 'Schließen' })}
                    </button>
                  </div>

                  {selectedFamilyComponents.length === 0 ? (
                    <p className="text-xs text-[#6B6D68]">
                      {tr(language, {
                        ru: 'В текущей формуле нет веществ с выраженным вкладом в это семейство.',
                        en: 'No ingredients in the active formula contribute significantly to this family.',
                        it: 'Nessun ingrediente attivo contribuisce a questa famiglia.',
                        es: 'Ningún ingrediente activo contribuye a esta familia.',
                        de: 'Keine Rohstoffe in der aktiven Formel tragen wesentlich zu dieser Familie bei.',
                      })}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selectedFamilyComponents.map((item) => (
                        <div
                          key={item.comp.id}
                          className="flex items-center justify-between rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-[#181917] truncate">
                              {item.comp.name}
                            </div>
                            <div className="text-[11px] text-[#6B6D68]">
                              {item.facetName
                                ? `${item.facetName} (${item.facetPercent}% грани)`
                                : getOlfactoryFamilyShort(item.comp.family, language)}{' '}
                              · Сила {item.odorImpact}
                            </div>
                          </div>
                          <div className="text-right font-mono tabular-nums shrink-0">
                            <div className="font-bold text-[var(--theme-accent)]">
                              {item.weightInFamily.toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-[#6B6D68]">
                              масса {item.massPct.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* High-Impact Drivers vs Volume Builders Diagnostic */}
              {hasFormula &&
                (impactVsMassInsights.highImpactDrivers.length > 0 ||
                  impactVsMassInsights.volumeBuilders.length > 0) && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                    <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-3.5 space-y-2">
                      <div className="text-xs font-semibold text-[#181917] flex items-center gap-1.5">
                        <ArrowUpRight className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                        <span>
                          {tr(language, {
                            ru: 'Сверхмощные акценты (Звучание > Массы)',
                            en: 'High-Impact Drivers (Scent > Mass)',
                            it: 'Accenti ad Alto Impatto',
                            es: 'Acentos de Alto Impacto',
                            de: 'Hochwirksame Akzente (Impact > Masse)',
                          })}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {impactVsMassInsights.highImpactDrivers.map((item) => (
                          <div
                            key={item.comp.id}
                            className="flex items-center justify-between text-xs border-b border-[#EAEAE6] last:border-b-0 pb-1 last:pb-0"
                          >
                            <span className="font-medium text-[#181917] truncate pr-2">
                              {item.comp.name}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums shrink-0">
                              <strong className="text-[var(--theme-accent)]">
                                {item.impactPct.toFixed(1)}%
                              </strong>{' '}
                              <span className="text-[#6B6D68]">при {item.massPct.toFixed(1)}% м</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-3.5 space-y-2">
                      <div className="text-xs font-semibold text-[#181917] flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-[#78350F]" />
                        <span>
                          {tr(language, {
                            ru: 'Прозрачный объём и база (Масса > Звучания)',
                            en: 'Transparent Volume & Fixatives (Mass > Scent)',
                            it: 'Volume Trasparente e Fissativi',
                            es: 'Volumen Transparente y Fijadores',
                            de: 'Transparentes Volumen & Fixateure',
                          })}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {impactVsMassInsights.volumeBuilders.map((item) => (
                          <div
                            key={item.comp.id}
                            className="flex items-center justify-between text-xs border-b border-[#EAEAE6] last:border-b-0 pb-1 last:pb-0"
                          >
                            <span className="font-medium text-[#181917] truncate pr-2">
                              {item.comp.name}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums shrink-0">
                              <strong className="text-[#575955]">{item.massPct.toFixed(1)}% м</strong>{' '}
                              <span className="text-[#6B6D68]">→ {item.impactPct.toFixed(1)}% зв</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}

      {/* 4. MODULE 3: HOURLY VOLATILITY TIMELINE (0m -> 24h) & LONGEVITY / SILLAGE PASSPORT */}
      {showVolatility && (
        <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EAEAE6] pb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#181917] flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--theme-accent)]" />
                <span>
                  {tr(language, {
                    ru: '3. Кривая испарения во времени (0 мин → 24+ ч) и Паспорт стойкости',
                    en: '3. Hourly Volatility Timeline (0 min → 24h+) & Longevity Passport',
                    it: '3. Curva di Evaporazione Oraria (0 min → 24h+) e Persistenza',
                    es: '3. Curva de Evaporación por Horas (0 min → 24h+) y Fijación',
                    de: '3. Stündliche Abdampfkurve (0 Min → 24h+) & Haltbarkeitspass',
                  })}
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-[#6B6D68]">
                {tr(language, {
                  ru: 'Моделирование раскрытия аромата на коже на основе индивидуальной субстантивности (часов жизни на блоттере) и Odor Impact каждого вещества.',
                  en: 'Simulates skin evolution based on each ingredient’s substantivity hours and Odor Impact.',
                  it: 'Simula l’evoluzione sulla pelle in base alla sostantività e all’Odor Impact di ogni materia prima.',
                  es: 'Simula la evolución en piel según la sustantividad y el Odor Impact de cada ingrediente.',
                  de: 'Simuliert den Duftverlauf auf der Haut anhand der Substantivität und des Odor Impact jedes Rohstoffs.',
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
            {/* Left 8 cols: Interactive 7-Checkpoint Volatility Timeline */}
            <div className="xl:col-span-8 space-y-4">
              {/* Checkpoint Selector Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
                {volatilitySimulation.map((sim) => {
                  const isSelected = sim.checkpoint.id === selectedCheckpointId;
                  return (
                    <button
                      key={sim.checkpoint.id}
                      type="button"
                      onClick={() => setSelectedCheckpointId(sim.checkpoint.id)}
                      className={`rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-[var(--theme-accent)] bg-[#F3F8F4] ring-1 ring-[var(--theme-accent)]'
                          : 'border-[#E4E4E0] bg-[#FAFBF9] hover:border-[#C7C8C3] hover:bg-white'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold text-[#181917]">
                        {sim.checkpoint.label[language]}
                      </div>
                      <div className="text-[10px] text-[#6B6D68] truncate mt-0.5">
                        {sim.checkpoint.phase[language]}
                      </div>
                      {/* Mini Family Color Bar at this hour */}
                      <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                        {OLFACTORY_FAMILIES.map((fam) => {
                          const pct = sim.familyProfile[fam.key] || 0;
                          if (pct <= 1) return null;
                          return (
                            <div
                              key={fam.key}
                              style={{
                                width: `${pct}%`,
                                backgroundColor: FAMILY_HEX_MAP[fam.key],
                              }}
                              className="h-full"
                            />
                          );
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Checkpoint Detailed Breakdown */}
              {activeCheckpointSim && (
                <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                        {activeCheckpointSim.checkpoint.label[language]} —{' '}
                        {activeCheckpointSim.checkpoint.phase[language]}
                      </span>
                      <p className="text-xs text-[#6B6D68] mt-0.5">
                        {tr(language, {
                          ru: 'Распределение ольфакторных семейств и активные молекулы на этом этапе раскрытия:',
                          en: 'Olfactory family distribution and active molecules evaporating at this stage:',
                          it: 'Distribuzione delle famiglie olfattive e molecole attive in questa fase:',
                          es: 'Distribución de familias olfativas y moléculas activas en esta etapa:',
                          de: 'Verteilung der Duftfamilien und aktive Moleküle in dieser Phase:',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Full-width Family Distribution Strip at Selected Hour */}
                  <div className="space-y-2">
                    <div className="flex h-3.5 w-full overflow-hidden rounded-lg bg-[#EAEAE6]">
                      {OLFACTORY_FAMILIES.map((fam) => {
                        const pct = activeCheckpointSim.familyProfile[fam.key] || 0;
                        if (pct <= 0.5) return null;
                        return (
                          <div
                            key={fam.key}
                            style={{
                              width: `${pct}%`,
                              backgroundColor: FAMILY_HEX_MAP[fam.key],
                            }}
                            title={`${getOlfactoryFamilyLabel(fam.key, language)}: ${pct.toFixed(1)}%`}
                            className="h-full transition-all"
                          />
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      {OLFACTORY_FAMILIES.filter(
                        (f) => (activeCheckpointSim.familyProfile[f.key] || 0) >= 2
                      )
                        .sort(
                          (a, b) =>
                            (activeCheckpointSim.familyProfile[b.key] || 0) -
                            (activeCheckpointSim.familyProfile[a.key] || 0)
                        )
                        .map((fam) => (
                          <span key={fam.key} className="inline-flex items-center gap-1">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: FAMILY_HEX_MAP[fam.key] }}
                            />
                            <span className="text-[#3F413D]">
                              {getOlfactoryFamilyShort(fam.key, language)}
                            </span>
                            <strong className="font-mono text-[#181917]">
                              {activeCheckpointSim.familyProfile[fam.key].toFixed(0)}%
                            </strong>
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Dominant Ingredients at this Checkpoint */}
                  <div className="border-t border-[#EAEAE6] pt-3 space-y-2">
                    <div className="text-xs font-semibold text-[#181917]">
                      {tr(language, {
                        ru: 'Ведущие слышимые компоненты на этом часу:',
                        en: 'Dominant audible materials at this hour:',
                        it: 'Materiali dominanti percepibili in quest’ora:',
                        es: 'Materiales dominantes perceptibles en esta hora:',
                        de: 'Dominante wahrnehmbare Rohstoffe zu dieser Stunde:',
                      })}
                    </div>
                    {activeCheckpointSim.topMaterials.length === 0 ? (
                      <p className="text-xs text-[#6B6D68]">
                        {tr(language, {
                          ru: 'Добавьте компоненты в формулу для расчёта почасового испарения.',
                          en: 'Add formula components to calculate hourly volatility.',
                          it: 'Aggiungi componenti per calcolare l’evaporazione oraria.',
                          es: 'Añade componentes para calcular la evaporación por horas.',
                          de: 'Formelkomponenten hinzufügen, um die stündliche Abdampfung zu berechnen.',
                        })}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {activeCheckpointSim.topMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            className="flex items-center justify-between rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: FAMILY_HEX_MAP[mat.family] }}
                                />
                                <span className="font-semibold text-[#181917] truncate">
                                  {mat.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#6B6D68] font-mono mt-0.5">
                                {tr(language, { ru: 'Субстантивность:', en: 'Substantivity:', it: 'Sostantività:', es: 'Sustantividad:', de: 'Substantivität:' })}{' '}
                                ~{mat.substantivityHours}ч
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-[var(--theme-accent)] tabular-nums shrink-0">
                              {mat.sharePct.toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 cols: Longevity, Sillage & Perfumer Disclosure Notes */}
            <div className="xl:col-span-4 rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6D68] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>
                    {tr(language, {
                      ru: 'Паспорт стойкости и шлейфа',
                      en: 'Longevity & Sillage Passport',
                      it: 'Passaporto Persistenza e Scia',
                      es: 'Pasaporte de Duración y Estela',
                      de: 'Haltbarkeits- & Sillage-Pass',
                    })}
                  </span>
                </span>
              </div>

              {/* Longevity Slider + Formula Estimate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#181917]">
                    {tr(language, {
                      ru: 'Целевая стойкость на коже',
                      en: 'Target Skin Longevity',
                      it: 'Persistenza su Pelle',
                      es: 'Duración en Piel',
                      de: 'Ziel-Haltbarkeit auf Haut',
                    })}
                  </span>
                  <span className="font-mono font-bold text-[var(--theme-accent)]">
                    {map.longevityHours} ч
                    {hasFormula && (
                      <span className="text-[11px] font-normal text-[#6B6D68]">
                        {' '}
                        (расчёт ~{estimatedFormulaLongevityHours} ч)
                      </span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={map.longevityHours}
                  onChange={(e) => patchMap({ longevityHours: parseInt(e.target.value, 10) })}
                  className="h-1.5 w-full cursor-pointer accent-[var(--theme-accent)]"
                />
              </div>

              {/* Sillage Selector */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-[#181917]">
                  {tr(language, {
                    ru: 'Диффузность и шлейф (Sillage)',
                    en: 'Projection & Sillage',
                    it: 'Proiezione e Scia (Sillage)',
                    es: 'Proyección y Estela (Sillage)',
                    de: 'Projektion & Sillage',
                  })}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {(['intimate', 'moderate', 'strong'] as SillageLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => patchMap({ sillageLevel: lvl })}
                      className={`rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                        map.sillageLevel === lvl
                          ? 'border-[var(--theme-accent)] bg-[#EEF4EE] text-[var(--theme-accent)]'
                          : 'border-[#E4E4E0] bg-white text-[#575955] hover:border-[#C7C8C3]'
                      }`}
                    >
                      {getSillageLabel(lvl, language)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perfumer's Evaporation & Evolution Notes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-medium text-[#181917]">
                  {tr(language, {
                    ru: 'Заметки парфюмера о динамике раскрытия',
                    en: 'Perfumer Notes on Scent Evolution',
                    it: 'Note del Profumiere sull’Evoluzione',
                    es: 'Notas del Perfumista sobre la Evolución',
                    de: 'Parfümeur-Notizen zum Duftverlauf',
                  })}
                </label>
                <textarea
                  rows={3}
                  value={map.evaporationNotes || ''}
                  onChange={(e) => patchMap({ evaporationNotes: e.target.value })}
                  placeholder={tr(language, {
                    ru: 'Как ведёт себя старт через 15 минут, когда вступает сердце, какие мускусы остаются через 12 часов...',
                    en: 'How the opening behaves after 15 min, when the heart blooms, what remains after 12 hours...',
                    it: 'Come si comporta l’apertura dopo 15 min, quando fiorisce il cuore...',
                    es: 'Cómo se comporta la salida tras 15 min, cuándo florece el corazón...',
                    de: 'Wie sich der Auftakt nach 15 Min. verhält, wann das Herz aufblüht...',
                  })}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
