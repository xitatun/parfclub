import { Activity, Clock, Flame, Layers, Radar as RadarIcon, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  FAMILY_HEX_MAP,
  OLFACTORY_FAMILIES,
  getNoteTierLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  getOlfactoryFamilyShort,
} from '../data/constants';
import { resolveComponentPassport } from '../data/fraterworksProfiles';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  ConcentrationType,
  FormulaComponent,
  Ingredient,
  LibraryIngredient,
  NoteTier,
  OlfactoryFamilyKey,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  calculatePerceivedFormulaImpact,
  formatGrams,
  formatPercent,
} from '../utils/calculations';

type MetricMode = 'perceived' | 'percent' | 'grams';
type AxisScope = 'all' | 'active';
type BenchmarkKey = 'classic' | 'fresh' | 'oriental' | 'soliflore';
type EvolutionStageKey = 'opening' | 'heart' | 'drydown';

interface FormulaOlfactoryProfileRadarProps {
  components: FormulaComponent[];
  targetConcentration: ConcentrationType;
  ingredients?: Ingredient[];
  library?: LibraryIngredient[];
  language?: AppLanguage;
  onAddFirstComponent?: () => void;
}

interface TierFamilyEntry {
  family: OlfactoryFamilyKey;
  label: string;
  shortLabel: string;
  top: number;
  heart: number;
  base: number;
  total: number;
  topGrams: number;
  heartGrams: number;
  baseGrams: number;
  topPct: number;
  heartPct: number;
  basePct: number;
  totalPct: number;
  contributors: string[];
}

interface PyramidAxisEntry {
  tier: 'top' | 'heart' | 'base';
  axisLabel: string;
  actual: number;
  benchmark: number;
  grams: number;
}

const TIER_STROKE_COLORS: Record<'top' | 'heart' | 'base', string> = {
  top: '#D97706',
  heart: 'var(--theme-accent-ink)',
  base: '#8B5E3C',
};

const BENCHMARKS: Record<
  BenchmarkKey,
  {
    top: number;
    heart: number;
    base: number;
    labels: Record<AppLanguage, string>;
  }
> = {
  classic: {
    top: 20,
    heart: 50,
    base: 30,
    labels: {
      ru: 'Классика (20 / 50 / 30)',
      en: 'Classic (20 / 50 / 30)',
      it: 'Classica (20 / 50 / 30)',
      es: 'Clásica (20 / 50 / 30)',
      de: 'Klassik (20 / 50 / 30)',
    },
  },
  fresh: {
    top: 40,
    heart: 40,
    base: 20,
    labels: {
      ru: 'Свежий / Цитрус (40 / 40 / 20)',
      en: 'Fresh / Citrus (40 / 40 / 20)',
      it: 'Fresco / Agrumato (40 / 40 / 20)',
      es: 'Fresco / Cítrico (40 / 40 / 20)',
      de: 'Frisch / Zitrus (40 / 40 / 20)',
    },
  },
  oriental: {
    top: 15,
    heart: 35,
    base: 50,
    labels: {
      ru: 'Восточный / Древесный (15 / 35 / 50)',
      en: 'Oriental / Woody (15 / 35 / 50)',
      it: 'Orientale / Legnoso (15 / 35 / 50)',
      es: 'Oriental / Amaderado (15 / 35 / 50)',
      de: 'Orientalisch / Holzig (15 / 35 / 50)',
    },
  },
  soliflore: {
    top: 15,
    heart: 65,
    base: 20,
    labels: {
      ru: 'Сердечный фокус (15 / 65 / 20)',
      en: 'Heart Focus (15 / 65 / 20)',
      it: 'Focus Cuore (15 / 65 / 20)',
      es: 'Enfoque Corazón (15 / 65 / 20)',
      de: 'Herzfokus (15 / 65 / 20)',
    },
  },
};

function getDefaultBenchmarkForConcentration(conc: ConcentrationType): BenchmarkKey {
  if (conc === 'Cologne') return 'fresh';
  if (conc === 'Extrait' || conc === 'Oil') return 'oriental';
  return 'classic';
}

interface FamilyTooltipPayload {
  payload?: TierFamilyEntry;
}

function FamilyLayerTooltip({
  active,
  payload,
  language,
  metricMode,
}: {
  active?: boolean;
  payload?: FamilyTooltipPayload[];
  language: AppLanguage;
  metricMode: MetricMode;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;

  return (
    <div className="rounded-lg border border-[#E4E4E0] bg-white px-3.5 py-2.5 shadow-md text-xs space-y-1.5 max-w-[260px]">
      <div className="font-semibold text-[#181917] flex items-center justify-between gap-4 border-b border-[#EAEAE6] pb-1">
        <span>{entry.label}</span>
        <span className="font-mono tabular-nums text-[var(--theme-accent)]">
          {formatPercent(entry.totalPct, 1)}
        </span>
      </div>

      <div className="space-y-1">
        {(
          [
            {
              key: 'top' as const,
              pct: entry.topPct,
              grams: entry.topGrams,
              color: TIER_STROKE_COLORS.top,
            },
            {
              key: 'heart' as const,
              pct: entry.heartPct,
              grams: entry.heartGrams,
              color: TIER_STROKE_COLORS.heart,
            },
            {
              key: 'base' as const,
              pct: entry.basePct,
              grams: entry.baseGrams,
              color: TIER_STROKE_COLORS.base,
            },
          ] as const
        ).map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#575955]">
              <span
                className="inline-block h-2 w-2 rounded-xs shrink-0"
                style={{ backgroundColor: row.color }}
              />
              {getNoteTierShort(row.key, language)}
            </span>
            <span className="font-mono tabular-nums text-[#181917]">
              {metricMode === 'grams'
                ? `${formatGrams(row.grams, 3, language)} · ${formatPercent(row.pct, 1)}`
                : `${formatPercent(row.pct, 1)} · ${formatGrams(row.grams, 2, language)}`}
            </span>
          </div>
        ))}
      </div>

      {entry.contributors.length > 0 && (
        <div className="border-t border-[#EAEAE6] pt-1 text-[11px] text-[#6B6D68]">
          {entry.contributors.slice(0, 3).join(' · ')}
        </div>
      )}
    </div>
  );
}

interface PyramidTooltipPayload {
  payload?: PyramidAxisEntry;
}

function PyramidTooltip({
  active,
  payload,
  language,
}: {
  active?: boolean;
  payload?: PyramidTooltipPayload[];
  language: AppLanguage;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;
  const delta = entry.actual - entry.benchmark;

  return (
    <div className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 shadow-md text-xs space-y-1">
      <div className="font-semibold text-[#181917]">{entry.axisLabel}</div>
      <div className="flex items-center justify-between gap-4 text-[#575955]">
        <span>
          {tr(language, {
            ru: 'Формула:',
            en: 'Formula:',
            it: 'Formula:',
            es: 'Fórmula:',
            de: 'Formel:',
          })}
        </span>
        <span className="font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
          {formatPercent(entry.actual, 1)} ({formatGrams(entry.grams, 2, language)})
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 text-[#575955]">
        <span>
          {tr(language, {
            ru: 'Ориентир:',
            en: 'Target:',
            it: 'Riferimento:',
            es: 'Referencia:',
            de: 'Richtwert:',
          })}
        </span>
        <span className="font-mono tabular-nums text-[#181917]">
          {formatPercent(entry.benchmark, 0)} ({delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

export function FormulaOlfactoryProfileRadar({
  components,
  targetConcentration,
  ingredients = [],
  library = [],
  language = 'ru',
  onAddFirstComponent,
}: FormulaOlfactoryProfileRadarProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>('perceived');
  const [axisScope, setAxisScope] = useState<AxisScope>('all');
  const [evolutionStage, setEvolutionStage] = useState<EvolutionStageKey>('heart');
  const [benchmarkKey, setBenchmarkKey] = useState<BenchmarkKey>(() =>
    getDefaultBenchmarkForConcentration(targetConcentration)
  );
  const [visibleTiers, setVisibleTiers] = useState<Record<'top' | 'heart' | 'base', boolean>>({
    top: true,
    heart: true,
    base: true,
  });

  const summary = useMemo(() => calculateFormulaSummary(components), [components]);
  const perceivedAnalysis = useMemo(
    () => calculatePerceivedFormulaImpact(components, ingredients, library),
    [components, ingredients, library]
  );

  const { familyEntries, activeCount, dominantByTier, topFamilies } = useMemo(() => {
    const map: Record<
      OlfactoryFamilyKey,
      {
        topGrams: number;
        heartGrams: number;
        baseGrams: number;
        topImpact: number;
        heartImpact: number;
        baseImpact: number;
        contributors: { name: string; weight: number }[];
      }
    > = {} as Record<
      OlfactoryFamilyKey,
      {
        topGrams: number;
        heartGrams: number;
        baseGrams: number;
        topImpact: number;
        heartImpact: number;
        baseImpact: number;
        contributors: { name: string; weight: number }[];
      }
    >;

    for (const fam of OLFACTORY_FAMILIES) {
      map[fam.key] = {
        topGrams: 0,
        heartGrams: 0,
        baseGrams: 0,
        topImpact: 0,
        heartImpact: 0,
        baseImpact: 0,
        contributors: [],
      };
    }

    let totalImpactUnits = 0;

    for (const comp of components) {
      if (comp.tier === 'solvent') continue;
      const w = Math.max(0, Number(comp.weightGrams) || 0);
      const dil = Math.min(100, Math.max(0, Number(comp.dilutionPercent) || 0));
      const pureMass = w * (dil / 100);
      if (pureMass <= 0) continue;

      const passport = resolveComponentPassport(comp, ingredients, library);
      const compImpact = pureMass * Math.max(10, passport.odorImpact);
      totalImpactUnits += compImpact;

      // Mass bucket goes to primary family
      const primaryBucket = map[comp.family];
      if (primaryBucket) {
        if (comp.tier === 'top') primaryBucket.topGrams += pureMass;
        if (comp.tier === 'heart') primaryBucket.heartGrams += pureMass;
        if (comp.tier === 'base') primaryBucket.baseGrams += pureMass;
      }

      // Perceived impact distributes across Fraterworks multi-facet scentBreakdown
      const breakdown = passport.scentBreakdown;
      if (breakdown && breakdown.length > 0) {
        const sumPct = breakdown.reduce((acc, f) => acc + f.percent, 0) || 100;
        for (const facet of breakdown) {
          const facetBucket = map[facet.family];
          if (!facetBucket) continue;
          const shareImpact = compImpact * (facet.percent / sumPct);
          if (comp.tier === 'top') facetBucket.topImpact += shareImpact;
          if (comp.tier === 'heart') facetBucket.heartImpact += shareImpact;
          if (comp.tier === 'base') facetBucket.baseImpact += shareImpact;
          facetBucket.contributors.push({
            name: comp.name,
            weight: metricMode === 'perceived' ? shareImpact : pureMass * (facet.percent / sumPct),
          });
        }
      } else if (primaryBucket) {
        if (comp.tier === 'top') primaryBucket.topImpact += compImpact;
        if (comp.tier === 'heart') primaryBucket.heartImpact += compImpact;
        if (comp.tier === 'base') primaryBucket.baseImpact += compImpact;
        primaryBucket.contributors.push({ name: comp.name, weight: pureMass });
      }
    }

    const totalPure = summary.pureAromaticGrams;
    const allEntries: TierFamilyEntry[] = OLFACTORY_FAMILIES.map((fam) => {
      const b = map[fam.key];
      const topPct =
        metricMode === 'perceived'
          ? totalImpactUnits > 0
            ? (b.topImpact / totalImpactUnits) * 100
            : 0
          : totalPure > 0
            ? (b.topGrams / totalPure) * 100
            : 0;
      const heartPct =
        metricMode === 'perceived'
          ? totalImpactUnits > 0
            ? (b.heartImpact / totalImpactUnits) * 100
            : 0
          : totalPure > 0
            ? (b.heartGrams / totalPure) * 100
            : 0;
      const basePct =
        metricMode === 'perceived'
          ? totalImpactUnits > 0
            ? (b.baseImpact / totalImpactUnits) * 100
            : 0
          : totalPure > 0
            ? (b.baseGrams / totalPure) * 100
            : 0;
      const totalGrams = b.topGrams + b.heartGrams + b.baseGrams;
      const totalPct = topPct + heartPct + basePct;

      const sortedNames = [...b.contributors]
        .sort((a, c) => c.weight - a.weight)
        .map((c) => c.name);

      return {
        family: fam.key,
        label: getOlfactoryFamilyLabel(fam.key, language),
        shortLabel: getOlfactoryFamilyShort(fam.key, language),
        top: metricMode === 'grams' ? Number(b.topGrams.toFixed(3)) : Number(topPct.toFixed(2)),
        heart:
          metricMode === 'grams' ? Number(b.heartGrams.toFixed(3)) : Number(heartPct.toFixed(2)),
        base: metricMode === 'grams' ? Number(b.baseGrams.toFixed(3)) : Number(basePct.toFixed(2)),
        total:
          metricMode === 'grams' ? Number(totalGrams.toFixed(3)) : Number(totalPct.toFixed(2)),
        topGrams: b.topGrams,
        heartGrams: b.heartGrams,
        baseGrams: b.baseGrams,
        topPct,
        heartPct,
        basePct,
        totalPct,
        contributors: Array.from(new Set(sortedNames)),
      };
    });

    const active = allEntries.filter((e) => e.totalPct > 0);
    const topFamiliesList = [...active].sort((a, b) => b.totalPct - a.totalPct);

    const findDominant = (tier: 'top' | 'heart' | 'base'): TierFamilyEntry | null => {
      const key = tier === 'top' ? 'topPct' : tier === 'heart' ? 'heartPct' : 'basePct';
      const sorted = [...active].filter((e) => e[key] > 0).sort((a, b) => b[key] - a[key]);
      return sorted[0] ?? null;
    };

    return {
      familyEntries: allEntries,
      activeCount: active.length,
      dominantByTier: {
        top: findDominant('top'),
        heart: findDominant('heart'),
        base: findDominant('base'),
      },
      topFamilies: topFamiliesList,
    };
  }, [components, ingredients, library, language, metricMode, summary.pureAromaticGrams]);

  const displayedFamilyData = useMemo(() => {
    if (axisScope === 'active' && activeCount >= 3) {
      return familyEntries.filter((e) => e.totalPct > 0);
    }
    return familyEntries;
  }, [activeCount, axisScope, familyEntries]);

  const pyramidData: PyramidAxisEntry[] = useMemo(() => {
    const bench = BENCHMARKS[benchmarkKey];
    return [
      {
        tier: 'top',
        axisLabel: getNoteTierLabel('top', language),
        actual: Number(summary.tierPercentOfPure.top.toFixed(1)),
        benchmark: bench.top,
        grams: summary.tierPureGrams.top,
      },
      {
        tier: 'heart',
        axisLabel: getNoteTierLabel('heart', language),
        actual: Number(summary.tierPercentOfPure.heart.toFixed(1)),
        benchmark: bench.heart,
        grams: summary.tierPureGrams.heart,
      },
      {
        tier: 'base',
        axisLabel: getNoteTierLabel('base', language),
        actual: Number(summary.tierPercentOfPure.base.toFixed(1)),
        benchmark: bench.base,
        grams: summary.tierPureGrams.base,
      },
    ];
  }, [benchmarkKey, language, summary.tierPercentOfPure, summary.tierPureGrams]);

  const toggleTier = (tier: 'top' | 'heart' | 'base') => {
    setVisibleTiers((prev) => {
      const next = { ...prev, [tier]: !prev[tier] };
      if (!next.top && !next.heart && !next.base) {
        return prev;
      }
      return next;
    });
  };

  const characterAssessment = useMemo(() => {
    if (summary.pureAromaticGrams <= 0) return '';
    const { top, heart, base } = summary.tierPercentOfPure;
    const bench = BENCHMARKS[benchmarkKey];
    const leadFamily = topFamilies[0]?.label ?? '';
    const secondFamily = topFamilies[1]?.label ?? '';

    const dominantTier: NoteTier =
      top >= heart && top >= base ? 'top' : heart >= base ? 'heart' : 'base';

    const familyChord = secondFamily ? `${leadFamily} · ${secondFamily}` : leadFamily;

    const tierBalanceNote =
      Math.abs(top - bench.top) <= 8 &&
      Math.abs(heart - bench.heart) <= 10 &&
      Math.abs(base - bench.base) <= 8
        ? tr(language, {
            ru: 'пропорции близки к выбранному ориентиру пирамиды',
            en: 'proportions closely match the selected pyramid benchmark',
            it: 'le proporzioni sono vicine al riferimento selezionato',
            es: 'las proporciones se acercan a la referencia seleccionada',
            de: 'die Proportionen liegen nahe am gewählten Pyramiden-Richtwert',
          })
        : dominantTier === 'top'
          ? tr(language, {
              ru: 'акцент на ярком старте и летучих верхних нотах',
              en: 'emphasis on a bright opening and volatile top notes',
              it: 'accento su un’apertura brillante e note di testa volatili',
              es: 'énfasis en una salida luminosa y notas altas volátiles',
              de: 'Fokus auf einer strahlenden Kopfnote mit hoher Strahlkraft',
            })
          : dominantTier === 'base'
            ? tr(language, {
                ru: 'плотный, стойкий фундамент с фокусом на шлейфе и базе',
                en: 'dense, long-lasting foundation focused on base and trail',
                it: 'struttura densa e persistente focalizzata su fondo e scia',
                es: 'estructura densa y duradera centrada en el fondo y la estela',
                de: 'dichte, langanhaltende Basisstruktur mit Fokus auf Sillage',
              })
            : tr(language, {
                ru: 'выраженное ядро композиции в нотах сердца',
                en: 'expressive composition core anchored in the heart notes',
                it: 'nucleo espressivo ancorato nelle note di cuore',
                es: 'núcleo expresivo anclado en las notas de corazón',
                de: 'ausdrucksstarker Kompositionskern in den Herznoten',
              });

    return familyChord ? `${familyChord} — ${tierBalanceNote}` : tierBalanceNote;
  }, [benchmarkKey, language, summary.pureAromaticGrams, summary.tierPercentOfPure, topFamilies]);

  const hasAromaticData = summary.pureAromaticGrams > 0;

  return (
    <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
      {/* Header & Interactive Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#181917] flex items-center gap-2">
            <RadarIcon className="h-5 w-5 text-[var(--theme-accent)] shrink-0" />
            <span>
              {tr(language, {
                ru: 'Ольфакторный профиль и распределение нот',
                en: 'Olfactory Profile & Note Distribution',
                it: 'Profilo Olfattivo e Distribuzione delle Note',
                es: 'Perfil Olfativo y Distribución de Notas',
                de: 'Olfaktorisches Profil & Notenverteilung',
              })}
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-[#6B6D68]">
            {metricMode === 'perceived'
              ? tr(language, {
                  ru: 'Реальное ольфакторное звучание (Fraterworks-метод): учитывает ударную силу молекул (Odor Impact), их фасеты и летучесть, а не только процент по массе.',
                  en: 'Perceived Scent Impact (Fraterworks method): weights materials by Odor Impact, multi-facet breakdown, and volatility rather than raw mass %.',
                  it: 'Impatto olfattivo percepito (metodo Fraterworks): pondera per Odor Impact, sfaccettature e volatilità invece della sola massa.',
                  es: 'Impacto olfativo percibido (método Fraterworks): pondera por Odor Impact, facetas y volatilidad en lugar del % en masa.',
                  de: 'Wahrgenommener Duft-Impact (Fraterworks-Methode): gewichtet nach Odor Impact, Facetten und Flüchtigkeit statt reiner Masse.',
                })
              : tr(language, {
                  ru: 'Автоматический радар по чистой массе ароматических компонентов формулы (верхние, средние и базовые ноты).',
                  en: 'Live radar derived from pure aromatic mass across top, heart, and base notes in the formula.',
                  it: 'Radar dinamico calcolato sulla massa aromatica pura tra note di testa, cuore e fondo.',
                  es: 'Radar dinámico basado en la masa aromática pura entre notas de salida, corazón y fondo.',
                  de: 'Live-Radar auf Basis der reinen Duftmasse über Kopf-, Herz- und Basisnoten.',
                })}
          </p>
        </div>

        {hasAromaticData && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Mode Segmented Control */}
            <div className="inline-flex items-center rounded-lg bg-[#EEEEEC] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMetricMode('perceived')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                  metricMode === 'perceived'
                    ? 'bg-white text-[var(--theme-accent)] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                {tr(language, {
                  ru: 'Реальное звучание %',
                  en: 'Perceived Scent %',
                  it: 'Odore percepito %',
                  es: 'Olor percibido %',
                  de: 'Duftwirkung %',
                })}
              </button>
              <button
                type="button"
                onClick={() => setMetricMode('percent')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                  metricMode === 'percent'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: '% по массе',
                  en: '% by Mass',
                  it: '% in massa',
                  es: '% en masa',
                  de: '% Masse',
                })}
              </button>
              <button
                type="button"
                onClick={() => setMetricMode('grams')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                  metricMode === 'grams'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'Чистая масса (г)',
                  en: 'Pure Mass (g)',
                  it: 'Massa pura (g)',
                  es: 'Masa pura (g)',
                  de: 'Reinmasse (g)',
                })}
              </button>
            </div>

            {/* Axis Scope Segmented Control */}
            {activeCount >= 3 && (
              <div className="inline-flex items-center rounded-lg bg-[#EEEEEC] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setAxisScope('all')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                    axisScope === 'all'
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#575955] hover:text-[#181917]'
                  }`}
                >
                  {tr(language, {
                    ru: 'Все 10 семейств',
                    en: 'All 10 Families',
                    it: 'Tutte le 10',
                    es: 'Las 10 familias',
                    de: 'Alle 10',
                  })}
                </button>
                <button
                  type="button"
                  onClick={() => setAxisScope('active')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                    axisScope === 'active'
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#575955] hover:text-[#181917]'
                  }`}
                >
                  {tr(language, {
                    ru: `Активные (${activeCount})`,
                    en: `Active (${activeCount})`,
                    it: `Attive (${activeCount})`,
                    es: `Activas (${activeCount})`,
                    de: `Aktiv (${activeCount})`,
                  })}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!hasAromaticData ? (
        <div className="rounded-lg border border-dashed border-[#D4D4CE] bg-[#FAFBF9] px-6 py-10 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEEEEC] text-[#575955]">
            <Layers className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#181917]">
              {tr(language, {
                ru: 'Добавьте душистые компоненты, чтобы построить ольфакторный радар',
                en: 'Add aromatic components to render the olfactory radar',
                it: 'Aggiungi componenti aromatici per generare il radar olfattivo',
                es: 'Añade componentes aromáticos para generar el radar olfativo',
                de: 'Füge Duftkomponenten hinzu, um das olfaktorische Radar darzustellen',
              })}
            </p>
            <p className="text-xs text-[#6B6D68]">
              {tr(language, {
                ru: 'Растворитель исключается из расчёта — профиль строится только по чистым нотам верхнего, среднего и базового ярусов.',
                en: 'Solvents are excluded — the profile reflects pure aromatic mass across top, heart, and base tiers.',
                it: 'I solventi sono esclusi: il profilo mostra solo la massa aromatica pura di testa, cuore e fondo.',
                es: 'Los disolventes se excluyen: el perfil refleja la masa aromática pura de salida, corazón y fondo.',
                de: 'Lösungsmittel werden ausgeschlossen — das Profil basiert rein auf Kopf-, Herz- und Basisnoten.',
              })}
            </p>
          </div>
          {onAddFirstComponent && (
            <button
              type="button"
              onClick={onAddFirstComponent}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)]"
            >
              {tr(language, {
                ru: 'Добавить первый компонент',
                en: 'Add First Component',
                it: 'Aggiungi primo componente',
                es: 'Añadir primer componente',
                de: 'Erste Komponente hinzufügen',
              })}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left 7 cols: Multi-tier Olfactory Family Radar */}
          <div className="xl:col-span-7 flex flex-col space-y-3 xl:border-r xl:border-[#EAEAE6] xl:pr-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Семейства по ярусам пирамиды',
                  en: 'Olfactory Families by Note Layer',
                  it: 'Famiglie Olfattive per Livello di Nota',
                  es: 'Familias Olfativas por Nivel de Nota',
                  de: 'Duftfamilien nach Notenebene',
                })}
              </div>

              {/* Interactive Tier Toggles */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['top', 'heart', 'base'] as const).map((tierKey) => {
                  const active = visibleTiers[tierKey];
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => toggleTier(tierKey)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        active
                          ? 'border-[#D4D4CE] bg-[#FAFBF9] text-[#181917]'
                          : 'border-[#EAEAE6] bg-white text-[#8B8D87] opacity-65 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: TIER_STROKE_COLORS[tierKey] }}
                      />
                      <span>{getNoteTierShort(tierKey, language)}</span>
                      <span className="font-mono text-[11px] tabular-nums text-[#6B6D68]">
                        {formatPercent(summary.tierPercentOfPure[tierKey], 0)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={displayedFamilyData}>
                  <PolarGrid stroke="var(--radar-ring-inner)" />
                  <PolarAngleAxis
                    dataKey="shortLabel"
                    tick={{ fill: 'var(--radar-label)', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    tick={{ fill: '#787A74', fontSize: 10 }}
                    tickFormatter={(val: number) =>
                      metricMode === 'grams' ? `${val}` : `${Math.round(val)}%`
                    }
                    axisLine={false}
                  />
                  {visibleTiers.base && (
                    <Radar
                      name={getNoteTierLabel('base', language)}
                      dataKey="base"
                      stroke={TIER_STROKE_COLORS.base}
                      fill={TIER_STROKE_COLORS.base}
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ r: 3, fill: TIER_STROKE_COLORS.base }}
                    />
                  )}
                  {visibleTiers.heart && (
                    <Radar
                      name={getNoteTierLabel('heart', language)}
                      dataKey="heart"
                      stroke={TIER_STROKE_COLORS.heart}
                      fill={TIER_STROKE_COLORS.heart}
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ r: 3, fill: TIER_STROKE_COLORS.heart }}
                    />
                  )}
                  {visibleTiers.top && (
                    <Radar
                      name={getNoteTierLabel('top', language)}
                      dataKey="top"
                      stroke={TIER_STROKE_COLORS.top}
                      fill={TIER_STROKE_COLORS.top}
                      fillOpacity={0.22}
                      strokeWidth={2}
                      dot={{ r: 3, fill: TIER_STROKE_COLORS.top }}
                    />
                  )}
                  <Tooltip
                    content={<FamilyLayerTooltip language={language} metricMode={metricMode} />}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Top dominant family accents summary line */}
            {topFamilies.length > 0 && (
              <div className="border-t border-[#EAEAE6] pt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#575955] tabular-nums">
                <span className="font-medium text-[#181917]">
                  {tr(language, {
                    ru: 'Ведущие аккорды:',
                    en: 'Leading chords:',
                    it: 'Accordi principali:',
                    es: 'Acordes principales:',
                    de: 'Leitakkorde:',
                  })}
                </span>
                {topFamilies.slice(0, 4).map((fam) => (
                  <span key={fam.family}>
                    {fam.shortLabel}{' '}
                    <span className="font-mono font-medium text-[#181917]">
                      {formatPercent(fam.totalPct, 1)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right 5 cols: 3-Axis Pyramid Balance Radar & Note Tier Breakdown */}
          <div className="xl:col-span-5 flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Баланс пирамиды (В / С / Б)',
                  en: 'Pyramid Balance (T / H / B)',
                  it: 'Bilancio Piramide (T / C / F)',
                  es: 'Equilibrio Pirámide (S / C / F)',
                  de: 'Pyramiden-Balance (K / H / B)',
                })}
              </div>

              <select
                value={benchmarkKey}
                onChange={(e) => setBenchmarkKey(e.target.value as BenchmarkKey)}
                aria-label={tr(language, {
                  ru: 'Эталон пирамиды',
                  en: 'Pyramid benchmark',
                  it: 'Riferimento piramide',
                  es: 'Referencia pirámide',
                  de: 'Pyramiden-Richtwert',
                })}
                className="rounded-md border border-[#E4E4E0] bg-[#FAFBF9] px-2 py-1 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(BENCHMARKS) as BenchmarkKey[]).map((key) => (
                  <option key={key} value={key}>
                    {BENCHMARKS[key].labels[language]}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="54%" outerRadius="70%" data={pyramidData}>
                  <PolarGrid stroke="var(--radar-ring-inner)" />
                  <PolarAngleAxis
                    dataKey="axisLabel"
                    tick={{ fill: 'var(--radar-label)', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 70]}
                    tick={{ fill: '#787A74', fontSize: 10 }}
                    tickFormatter={(val: number) => `${Math.round(val)}%`}
                    axisLine={false}
                  />
                  <Radar
                    name={tr(language, {
                      ru: 'Ориентир',
                      en: 'Target',
                      it: 'Riferimento',
                      es: 'Referencia',
                      de: 'Richtwert',
                    })}
                    dataKey="benchmark"
                    stroke="#8B8D87"
                    fill="#8B8D87"
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Radar
                    name={tr(language, {
                      ru: 'Текущая формула',
                      en: 'Current Formula',
                      it: 'Formula Attuale',
                      es: 'Fórmula Actual',
                      de: 'Aktuelle Formel',
                    })}
                    dataKey="actual"
                    stroke="var(--theme-accent-ink)"
                    fill="var(--theme-accent-ink)"
                    fillOpacity={0.22}
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: 'var(--theme-accent-ink)' }}
                  />
                  <Tooltip content={<PyramidTooltip language={language} />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Tier Distribution Table */}
            <div className="border-t border-[#EAEAE6] pt-3 space-y-2">
              <div className="divide-y divide-[#EAEAE6] text-xs">
                {(['top', 'heart', 'base'] as const).map((tierKey) => {
                  const pct = summary.tierPercentOfPure[tierKey];
                  const grams = summary.tierPureGrams[tierKey];
                  const benchPct = BENCHMARKS[benchmarkKey][tierKey];
                  const delta = pct - benchPct;
                  const dom = dominantByTier[tierKey];

                  return (
                    <div
                      key={tierKey}
                      className="py-2 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-medium text-[#181917]">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-xs shrink-0"
                            style={{ backgroundColor: TIER_STROKE_COLORS[tierKey] }}
                          />
                          <span>{getNoteTierLabel(tierKey, language)}</span>
                        </div>
                        <div className="pl-4.5 text-[11px] text-[#6B6D68] truncate">
                          {dom
                            ? `${dom.shortLabel} (${dom.contributors.slice(0, 2).join(', ')})`
                            : tr(language, {
                                ru: 'Нет компонентов яруса',
                                en: 'No notes in this layer',
                                it: 'Nessuna nota in questo livello',
                                es: 'Sin notas en este nivel',
                                de: 'Keine Noten in dieser Ebene',
                              })}
                        </div>
                      </div>

                      <div className="text-right font-mono tabular-nums shrink-0">
                        <div className="font-semibold text-[#181917]">
                          {formatPercent(pct, 1)}
                          <span className="ml-1.5 text-[11px] font-normal text-[#6B6D68]">
                            ({delta >= 0 ? '+' : ''}
                            {delta.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6B6D68]">
                          {formatGrams(grams, 2, language)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {characterAssessment && (
                <div className="border-t border-[#EAEAE6] pt-2.5 flex items-start gap-2 text-xs text-[#3F413D]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <span>{characterAssessment}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Full-Width: Fraterworks-Style Perceived Scent Breakdown & Volatility Evolution */}
          <div className="xl:col-span-12 border-t border-[#EAEAE6] pt-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#181917] flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  {tr(language, {
                    ru: 'Fraterworks Scent Breakdown: Как формула пахнет на самом деле vs. По массе',
                    en: 'Fraterworks Scent Breakdown: Actual Perceived Scent vs. Formula Mass %',
                    it: 'Fraterworks Scent Breakdown: Odore Reale Percepito vs. % in Massa',
                    es: 'Fraterworks Scent Breakdown: Olor Real Percibido vs. % en Masa',
                    de: 'Fraterworks Scent Breakdown: Tatsächlicher Duft vs. Masse-%',
                  })}
                </h3>
                <p className="text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Сравнение физической доли веществ в стакане и реального ольфакторного баланса с учетом Odor Impact и летучести.',
                    en: 'Compares physical weight in the beaker against actual perceived scent balance weighted by Odor Impact and volatility.',
                    it: 'Confronta il peso fisico nel becher con il reale equilibrio olfattivo ponderato per Odor Impact e volatilità.',
                    es: 'Compara el peso físico en el vaso con el equilibrio olfativo real ponderado por Odor Impact y volatilidad.',
                    de: 'Vergleicht das physische Gewicht im Becherglas mit der tatsächlichen Duftwahrnehmung nach Odor Impact und Flüchtigkeit.',
                  })}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 text-xs text-[#575955]">
                <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                <span>
                  {tr(language, {
                    ru: 'Ср. субстантивность на блоттере:',
                    en: 'Avg. blotter substantivity:',
                    it: 'Sostantività media su mouillette:',
                    es: 'Sustantividad media en secante:',
                    de: 'Mittlere Substantivität auf dem Riechstreifen:',
                  })}
                </span>
                <strong className="font-mono text-[#181917]">
                  ~{perceivedAnalysis.averageSubstantivityHours}{' '}
                  {tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })}
                </strong>
              </div>
            </div>

            {/* Dual Comparison Bars: Perceived Scent vs Mass % */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#181917]">
                    {tr(language, {
                      ru: 'Реальное звучание (Perceived Scent Impact)',
                      en: 'Actual Perceived Scent (Impact-Weighted)',
                      it: 'Odore Percepito Reale (Impact-Weighted)',
                      es: 'Olor Percibido Real (Impact-Weighted)',
                      de: 'Tatsächliche Duftwahrnehmung (Impact)',
                    })}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--theme-accent)]">100%</span>
                </div>
                <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-[#EAEAE6]">
                  {OLFACTORY_FAMILIES.map((fam) => {
                    const pct = perceivedAnalysis.perceivedFamilyProfile[fam.key] || 0;
                    if (pct <= 0.5) return null;
                    return (
                      <div
                        key={fam.key}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: FAMILY_HEX_MAP[fam.key],
                        }}
                        title={`${getOlfactoryFamilyLabel(fam.key, language)}: ${pct.toFixed(1)}%`}
                        className="h-full transition-all first:rounded-l-md last:rounded-r-md"
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-[#3F413D]">
                  {OLFACTORY_FAMILIES.filter(
                    (f) => (perceivedAnalysis.perceivedFamilyProfile[f.key] || 0) >= 2
                  )
                    .sort(
                      (a, b) =>
                        (perceivedAnalysis.perceivedFamilyProfile[b.key] || 0) -
                        (perceivedAnalysis.perceivedFamilyProfile[a.key] || 0)
                    )
                    .slice(0, 5)
                    .map((fam) => (
                      <span key={fam.key} className="inline-flex items-center gap-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: FAMILY_HEX_MAP[fam.key] }}
                        />
                        <span>{getOlfactoryFamilyShort(fam.key, language)}</span>
                        <strong className="font-mono">
                          {perceivedAnalysis.perceivedFamilyProfile[fam.key].toFixed(0)}%
                        </strong>
                      </span>
                    ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#575955]">
                    {tr(language, {
                      ru: 'Состав по массе в формуле (Raw Mass %)',
                      en: 'Formula Composition by Weight (Raw Mass %)',
                      it: 'Composizione in Peso nella Formula (Massa %)',
                      es: 'Composición por Peso en Fórmula (Masa %)',
                      de: 'Zusammensetzung nach Gewicht (Masse %)',
                    })}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B6D68]">100%</span>
                </div>
                <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-[#EAEAE6] opacity-80">
                  {OLFACTORY_FAMILIES.map((fam) => {
                    const pct = perceivedAnalysis.massFamilyProfile[fam.key] || 0;
                    if (pct <= 0.5) return null;
                    return (
                      <div
                        key={fam.key}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: FAMILY_HEX_MAP[fam.key],
                        }}
                        title={`${getOlfactoryFamilyLabel(fam.key, language)}: ${pct.toFixed(1)}%`}
                        className="h-full transition-all first:rounded-l-md last:rounded-r-md"
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-[#575955]">
                  {OLFACTORY_FAMILIES.filter(
                    (f) => (perceivedAnalysis.massFamilyProfile[f.key] || 0) >= 2
                  )
                    .sort(
                      (a, b) =>
                        (perceivedAnalysis.massFamilyProfile[b.key] || 0) -
                        (perceivedAnalysis.massFamilyProfile[a.key] || 0)
                    )
                    .slice(0, 5)
                    .map((fam) => (
                      <span key={fam.key} className="inline-flex items-center gap-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: FAMILY_HEX_MAP[fam.key] }}
                        />
                        <span>{getOlfactoryFamilyShort(fam.key, language)}</span>
                        <strong className="font-mono">
                          {perceivedAnalysis.massFamilyProfile[fam.key].toFixed(0)}%
                        </strong>
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Time-Stage Volatility Evolution (Opening / Heart / Drydown) */}
            <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Прогноз раскрытия по фазам испарения (Volatility & Substantivity)',
                    en: 'Evaporation Stage Projection (Volatility & Substantivity)',
                    it: 'Proiezione Fasi di Evaporazione (Volatilità e Sostantività)',
                    es: 'Proyección por Fases de Evaporación (Volatilidad y Sustantividad)',
                    de: 'Duftverlauf nach Abdampfphasen (Flüchtigkeit & Substantivität)',
                  })}
                </div>
                <div className="inline-flex items-center rounded-lg bg-[#EEEEEC] p-0.5 text-xs">
                  {(
                    [
                      {
                        key: 'opening' as const,
                        label: tr(language, {
                          ru: 'Старт (0–30 мин)',
                          en: 'Opening (0–30m)',
                          it: 'Apertura (0–30m)',
                          es: 'Salida (0–30m)',
                          de: 'Auftakt (0–30m)',
                        }),
                      },
                      {
                        key: 'heart' as const,
                        label: tr(language, {
                          ru: 'Сердце (2–6 ч)',
                          en: 'Heart (2–6h)',
                          it: 'Cuore (2–6h)',
                          es: 'Corazón (2–6h)',
                          de: 'Herz (2–6h)',
                        }),
                      },
                      {
                        key: 'drydown' as const,
                        label: tr(language, {
                          ru: 'Шлейф / База (12+ ч)',
                          en: 'Drydown (12h+)',
                          it: 'Fondo (12h+)',
                          es: 'Secado (12h+)',
                          de: 'Drydown (12h+)',
                        }),
                      },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setEvolutionStage(st.key)}
                      className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                        evolutionStage === st.key
                          ? 'bg-white text-[#181917] shadow-xs'
                          : 'text-[#575955] hover:text-[#181917]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                {OLFACTORY_FAMILIES.map((fam) => {
                  const pct = perceivedAnalysis.stageProfiles[evolutionStage][fam.key] || 0;
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

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#575955]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#181917]">
                    {tr(language, {
                      ru: 'Доминируют в этой фазе:',
                      en: 'Dominant in this phase:',
                      it: 'Dominanti in questa fase:',
                      es: 'Dominantes en esta fase:',
                      de: 'Dominant in dieser Phase:',
                    })}
                  </span>
                  {perceivedAnalysis.stageDominantMaterials[evolutionStage].map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-1 rounded-md border border-[#E4E4E0] bg-[#FAFBF9] px-2 py-0.5 text-[11px] font-medium text-[#181917]"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: FAMILY_HEX_MAP[item.family] }}
                      />
                      <span>{item.name}</span>
                      <span className="font-mono text-[var(--theme-accent)]">
                        {item.sharePercent}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
