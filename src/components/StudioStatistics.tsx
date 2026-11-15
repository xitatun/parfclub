import { ArrowRight, BarChart3, FlaskConical, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  getIngredientStatusLabel,
  getJournalVerdictLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  getProjectStatusLabel,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  JournalVerdict,
  NoteTier,
  OlfactoryFamilyKey,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectStatus,
  ProjectTab,
  PurchaseRecord,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
  getMacerationStatus,
} from '../utils/calculations';
import { todayIsoDate } from '../utils/storage';

interface StudioStatisticsProps {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  language: AppLanguage;
  currency: AppCurrency;
  showDescription?: boolean;
  onOpenProject: (projectId: string, tab?: ProjectTab) => void;
  onOpenIngredients: () => void;
  onOpenBudget: () => void;
  onOpenProjectsOverview: () => void;
}

type UsageFilter = 'all' | 'aromatics' | 'top' | 'heart' | 'base';
type UsageSort = 'projects' | 'weight';

interface IngredientUsageEntry {
  key: string;
  name: string;
  tier: NoteTier;
  family: OlfactoryFamilyKey;
  ingredient?: Ingredient;
  projectsCount: number;
  occurrences: number;
  totalWeightGrams: number;
  totalPureGrams: number;
  projectsList: { id: string; code: string; title: string }[];
}

const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  'formulating',
  'macerating',
  'completed',
  'idea',
  'archived',
];

const VERDICT_ORDER: JournalVerdict[] = [
  'approved',
  'promising',
  'needs_work',
  'rejected',
];

export function StudioStatistics({
  projects,
  ingredients,
  estimates,
  purchases,
  language,
  currency,
  showDescription = true,
  onOpenProject,
  onOpenIngredients,
  onOpenBudget,
  onOpenProjectsOverview,
}: StudioStatisticsProps) {
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all');
  const [usageSort, setUsageSort] = useState<UsageSort>('projects');
  const [usageQuery, setUsageQuery] = useState('');
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showUnusedStock, setShowUnusedStock] = useState(false);

  const todayIso = todayIsoDate();

  const analytics = useMemo(() => {
    const ingredientById = new Map(ingredients.map((i) => [i.id, i]));
    const ingredientByName = new Map(
      ingredients.map((i) => [i.name.trim().toLowerCase(), i])
    );

    const usageMap = new Map<
      string,
      IngredientUsageEntry & { projectIds: Set<string> }
    >();

    const statusCounts: Record<ProjectStatus, number> = {
      idea: 0,
      formulating: 0,
      macerating: 0,
      completed: 0,
      archived: 0,
    };

    const verdictCounts: Record<JournalVerdict, number> = {
      promising: 0,
      needs_work: 0,
      approved: 0,
      rejected: 0,
    };

    const familyStats: Record<
      OlfactoryFamilyKey,
      { count: number; pureGrams: number }
    > = {
      citrus: { count: 0, pureGrams: 0 },
      floral: { count: 0, pureGrams: 0 },
      woody: { count: 0, pureGrams: 0 },
      spicy: { count: 0, pureGrams: 0 },
      amber: { count: 0, pureGrams: 0 },
      green: { count: 0, pureGrams: 0 },
      musk: { count: 0, pureGrams: 0 },
      gourmand: { count: 0, pureGrams: 0 },
      aquatic: { count: 0, pureGrams: 0 },
      leathery: { count: 0, pureGrams: 0 },
    };

    const tierPureGrams = { top: 0, heart: 0, base: 0 };
    let totalFormulaLines = 0;
    let totalPureGramsAll = 0;
    let totalFormulaWeightAll = 0;
    let totalFormulaCostAll = 0;
    let totalJournalEntries = 0;
    let totalMacerations = 0;
    let activeMacerations = 0;
    let completedMacerations = 0;
    let unacknowledgedMacerations = 0;

    const usedIngredientIds = new Set<string>();
    const usedIngredientNames = new Set<string>();

    for (const proj of projects) {
      statusCounts[proj.status] = (statusCounts[proj.status] || 0) + 1;

      const summary = calculateFormulaSummary(proj.components);
      totalFormulaWeightAll += summary.totalWeightGrams;
      totalFormulaCostAll += summary.totalFormulaCost;
      totalPureGramsAll += summary.pureAromaticGrams;
      tierPureGrams.top += summary.tierPureGrams.top;
      tierPureGrams.heart += summary.tierPureGrams.heart;
      tierPureGrams.base += summary.tierPureGrams.base;

      for (const comp of proj.components) {
        totalFormulaLines++;
        const normName = comp.name.trim().toLowerCase();
        const linked =
          (comp.ingredientId ? ingredientById.get(comp.ingredientId) : undefined) ||
          ingredientByName.get(normName);

        if (linked) {
          usedIngredientIds.add(linked.id);
        }
        if (normName) {
          usedIngredientNames.add(normName);
        }

        const key = linked ? `id:${linked.id}` : `name:${normName || comp.id}`;
        const pureMass =
          comp.tier === 'solvent'
            ? 0
            : Math.max(0, Number(comp.weightGrams) || 0) *
              (Math.min(100, Math.max(0, Number(comp.dilutionPercent) || 0)) / 100);
        const weight = Math.max(0, Number(comp.weightGrams) || 0);

        if (comp.tier !== 'solvent') {
          const fam = linked?.family || comp.family;
          familyStats[fam].count += 1;
          familyStats[fam].pureGrams += pureMass;
        }

        const existing = usageMap.get(key);
        if (existing) {
          existing.occurrences += 1;
          existing.totalWeightGrams += weight;
          existing.totalPureGrams += pureMass;
          if (!existing.projectIds.has(proj.id)) {
            existing.projectIds.add(proj.id);
            existing.projectsCount += 1;
            existing.projectsList.push({
              id: proj.id,
              code: proj.code,
              title: proj.title,
            });
          }
        } else {
          usageMap.set(key, {
            key,
            name: linked?.name || comp.name,
            tier: linked?.tier || comp.tier,
            family: linked?.family || comp.family,
            ingredient: linked,
            projectsCount: 1,
            occurrences: 1,
            totalWeightGrams: weight,
            totalPureGrams: pureMass,
            projectIds: new Set([proj.id]),
            projectsList: [
              {
                id: proj.id,
                code: proj.code,
                title: proj.title,
              },
            ],
          });
        }
      }

      for (const entry of proj.journal) {
        totalJournalEntries++;
        verdictCounts[entry.verdict] = (verdictCounts[entry.verdict] || 0) + 1;
      }

      for (const batch of proj.macerations || []) {
        totalMacerations++;
        const st = getMacerationStatus(batch, todayIso);
        if (st.isComplete) {
          completedMacerations++;
          if (!batch.acknowledged) unacknowledgedMacerations++;
        } else {
          activeMacerations++;
        }
      }
    }

    const usageEntries: IngredientUsageEntry[] = Array.from(usageMap.values()).map(
      ({ projectIds: _ignored, ...rest }) => rest
    );

    const unusedInStock = ingredients.filter(
      (ing) =>
        ing.status === 'in_stock' &&
        !usedIngredientIds.has(ing.id) &&
        !usedIngredientNames.has(ing.name.trim().toLowerCase())
    );

    const inStockIngredients = ingredients.filter((i) => i.status === 'in_stock');
    const wishlistIngredients = ingredients.filter((i) => i.status === 'wishlist');
    const orderedIngredients = ingredients.filter((i) => i.status === 'ordered');
    const inventoryValue = inStockIngredients.reduce(
      (sum, ing) => sum + Math.max(0, Number(ing.priceTotal) || 0),
      0
    );

    const plannedBudget = estimates.reduce(
      (s, e) => s + e.requiredQuantity * e.estimatedUnitPrice,
      0
    );
    const actualSpent = purchases.reduce((s, p) => s + p.totalCost, 0);

    const unspecifiedSupplierLabel = tr(language, {
      ru: 'Поставщик не указан',
      en: 'Unspecified supplier',
      it: 'Fornitore non specificato',
      es: 'Proveedor no especificado',
      de: 'Lieferant nicht angegeben',
    });

    const supplierMap = new Map<
      string,
      { supplier: string; ordersCount: number; totalSpent: number }
    >();
    for (const p of purchases) {
      const label = (p.supplier || '').trim() || unspecifiedSupplierLabel;
      const cur = supplierMap.get(label);
      if (cur) {
        cur.ordersCount += 1;
        cur.totalSpent += p.totalCost;
      } else {
        supplierMap.set(label, {
          supplier: label,
          ordersCount: 1,
          totalSpent: p.totalCost,
        });
      }
    }
    const topSuppliers = Array.from(supplierMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    const familyList = OLFACTORY_FAMILIES.map((f) => ({
      ...f,
      count: familyStats[f.key].count,
      pureGrams: familyStats[f.key].pureGrams,
    }))
      .filter((f) => f.count > 0)
      .sort((a, b) => b.count - a.count || b.pureGrams - a.pureGrams);

    const tierSum = tierPureGrams.top + tierPureGrams.heart + tierPureGrams.base;
    const tierShare = {
      top: tierSum > 0 ? (tierPureGrams.top / tierSum) * 100 : 0,
      heart: tierSum > 0 ? (tierPureGrams.heart / tierSum) * 100 : 0,
      base: tierSum > 0 ? (tierPureGrams.base / tierSum) * 100 : 0,
    };

    return {
      usageEntries,
      unusedInStock,
      statusCounts,
      verdictCounts,
      familyList,
      tierShare,
      totalFormulaLines,
      totalPureGramsAll,
      totalFormulaWeightAll,
      totalFormulaCostAll,
      totalJournalEntries,
      totalMacerations,
      activeMacerations,
      completedMacerations,
      unacknowledgedMacerations,
      inStockCount: inStockIngredients.length,
      wishlistCount: wishlistIngredients.length,
      orderedCount: orderedIngredients.length,
      inventoryValue,
      plannedBudget,
      actualSpent,
      topSuppliers,
    };
  }, [projects, ingredients, estimates, purchases, todayIso, language]);

  const filteredUsage = useMemo(() => {
    const q = usageQuery.trim().toLowerCase();
    const list = analytics.usageEntries.filter((item) => {
      if (usageFilter === 'aromatics' && item.tier === 'solvent') return false;
      if (
        (usageFilter === 'top' ||
          usageFilter === 'heart' ||
          usageFilter === 'base') &&
        item.tier !== usageFilter
      ) {
        return false;
      }
      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (usageSort === 'weight') {
        return (
          b.totalWeightGrams - a.totalWeightGrams ||
          b.projectsCount - a.projectsCount
        );
      }
      return (
        b.projectsCount - a.projectsCount ||
        b.occurrences - a.occurrences ||
        b.totalWeightGrams - a.totalWeightGrams
      );
    });
  }, [analytics.usageEntries, usageFilter, usageSort, usageQuery]);

  const maxUsageMetric = useMemo(() => {
    if (filteredUsage.length === 0) return 1;
    if (usageSort === 'weight') {
      return Math.max(
        0.01,
        ...filteredUsage.map((item) => item.totalWeightGrams)
      );
    }
    return Math.max(1, ...filteredUsage.map((item) => item.projectsCount));
  }, [filteredUsage, usageSort]);

  const visibleUsage = showAllIngredients
    ? filteredUsage
    : filteredUsage.slice(0, 12);

  const projectsWithFormulas = projects.filter(
    (p) => p.components.length > 0
  ).length;
  const activeProjectsCount =
    analytics.statusCounts.idea +
    analytics.statusCounts.formulating +
    analytics.statusCounts.macerating;

  const avgComponentsPerProject =
    projectsWithFormulas > 0
      ? (analytics.totalFormulaLines / projectsWithFormulas).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DFDD] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">
            {tr(language, {
              ru: 'Статистика мастерской',
              en: 'Studio Statistics',
              it: 'Statistiche dello Studio',
              es: 'Estadísticas del Taller',
              de: 'Atelier-Statistik',
            })}
          </h1>
          {showDescription && (
            <p className="mt-1 text-sm text-[#605E5C] max-w-2xl">
              {tr(language, {
                ru: 'Сводка вашей работы в мастерской: активность по проектам и пробам, расходы и рейтинг самых часто используемых ингредиентов.',
                en: 'Overview of your formulation work, trial activity, budgets, and most frequently used ingredients across all projects.',
                it: 'Panoramica del lavoro di formulazione, attività di prova, budget e ingredienti più utilizzati nei progetti.',
                es: 'Resumen de tu trabajo de formulación, actividad de pruebas, presupuestos e ingredientes más usados.',
                de: 'Überblick über Rezepturarbeit, Testaktivität, Budgets und die am häufigsten verwendeten Rohstoffe.',
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenProjectsOverview}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
          >
            <span>
              {tr(language, {
                ru: 'Проекты',
                en: 'Projects',
                it: 'Progetti',
                es: 'Proyectos',
                de: 'Projekte',
              })}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
          </button>
          <button
            type="button"
            onClick={onOpenIngredients}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1DFDD] bg-white px-3 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] whitespace-nowrap"
          >
            <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
            <span>
              {tr(language, {
                ru: 'Ингредиенты',
                en: 'Ingredients',
                it: 'Ingredienti',
                es: 'Ingredientes',
                de: 'Rohstoffe',
              })}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Проекты духов',
              en: 'Perfume projects',
              it: 'Progetti di profumo',
              es: 'Proyectos de perfume',
              de: 'Parfümprojekte',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {projects.length}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {tr(language, {
              ru: 'В работе',
              en: 'Active',
              it: 'Attivi',
              es: 'Activos',
              de: 'Aktiv',
            })}
            : {activeProjectsCount} ·{' '}
            {tr(language, {
              ru: 'Готово',
              en: 'Completed',
              it: 'Completati',
              es: 'Completados',
              de: 'Fertig',
            })}
            : {analytics.statusCounts.completed}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Формулы и пробы',
              en: 'Formulas & trial logs',
              it: 'Formule e note di prova',
              es: 'Fórmulas y pruebas',
              de: 'Rezepturen & Testnotizen',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {analytics.totalJournalEntries}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {tr(language, {
              ru: 'Утверждено',
              en: 'Approved',
              it: 'Approvate',
              es: 'Aprobadas',
              de: 'Freigegeben',
            })}
            : {analytics.verdictCounts.approved} ·{' '}
            {tr(language, {
              ru: 'Ср. комп.',
              en: 'Avg comp.',
              it: 'Media comp.',
              es: 'Prom. comp.',
              de: 'Ø Komp.',
            })}
            : {avgComponentsPerProject}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Сырьевая база',
              en: 'Raw materials stock',
              it: 'Archivio materie prime',
              es: 'Base de materias primas',
              de: 'Rohstoffbestand',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {ingredients.length}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {tr(language, {
              ru: 'В наличии',
              en: 'In stock',
              it: 'Disponibili',
              es: 'En stock',
              de: 'Auf Lager',
            })}
            : {analytics.inStockCount} ·{' '}
            {formatCurrencyRub(analytics.inventoryValue, language, currency)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Закупки и мацерация',
              en: 'Actual purchases & aging',
              it: 'Acquisti e macerazione',
              es: 'Compras y maceración',
              de: 'Einkäufe & Mazeration',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {formatCurrencyRub(analytics.actualSpent, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#797775] tabular-nums">
            {tr(language, {
              ru: 'Таймеров',
              en: 'Timers',
              it: 'Timer',
              es: 'Temporizadores',
              de: 'Timer',
            })}
            : {analytics.totalMacerations} ({analytics.activeMacerations}{' '}
            {tr(language, {
              ru: 'акт.',
              en: 'active',
              it: 'attivi',
              es: 'activos',
              de: 'aktiv',
            })}
            )
          </div>
        </div>
      </div>

      {/* Frequently Used Ingredients Section */}
      <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EDEBE9] pb-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] shrink-0">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Часто используемые ингредиенты',
                  en: 'Most Frequently Used Ingredients',
                  it: 'Ingredienti Più Utilizzati',
                  es: 'Ingredientes Más Utilizados',
                  de: 'Am häufigsten verwendete Rohstoffe',
                })}
              </h2>
              <p className="text-xs text-[#605E5C] tabular-nums">
                {tr(language, {
                  ru: `Уникальных материалов в формулах: ${analytics.usageEntries.length} · Проектов с формулой: ${projectsWithFormulas} (${analytics.totalFormulaLines} строк)`,
                  en: `${analytics.usageEntries.length} unique materials used across ${projectsWithFormulas} formulas (${analytics.totalFormulaLines} formula lines)`,
                  it: `${analytics.usageEntries.length} materie uniche usate in ${projectsWithFormulas} formule (${analytics.totalFormulaLines} righe)`,
                  es: `${analytics.usageEntries.length} materias únicas usadas en ${projectsWithFormulas} fórmulas (${analytics.totalFormulaLines} líneas)`,
                  de: `${analytics.usageEntries.length} verschiedene Rohstoffe in ${projectsWithFormulas} Rezepturen (${analytics.totalFormulaLines} Zeilen)`,
                })}
              </p>
            </div>
          </div>

          {/* Controls: Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-0.5">
              {(
                [
                  {
                    id: 'all',
                    label: tr(language, {
                      ru: 'Все',
                      en: 'All',
                      it: 'Tutti',
                      es: 'Todos',
                      de: 'Alle',
                    }),
                  },
                  {
                    id: 'aromatics',
                    label: tr(language, {
                      ru: 'Без растворителей',
                      en: 'No solvents',
                      it: 'Senza solventi',
                      es: 'Sin disolventes',
                      de: 'Ohne Lösungsmittel',
                    }),
                  },
                  {
                    id: 'top',
                    label: tr(language, {
                      ru: 'Верх',
                      en: 'Top',
                      it: 'Testa',
                      es: 'Salida',
                      de: 'Kopf',
                    }),
                  },
                  {
                    id: 'heart',
                    label: tr(language, {
                      ru: 'Сердце',
                      en: 'Heart',
                      it: 'Cuore',
                      es: 'Corazón',
                      de: 'Herz',
                    }),
                  },
                  {
                    id: 'base',
                    label: tr(language, {
                      ru: 'База',
                      en: 'Base',
                      it: 'Fondo',
                      es: 'Fondo',
                      de: 'Basis',
                    }),
                  },
                ] as { id: UsageFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setUsageFilter(tab.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    usageFilter === tab.id
                      ? 'bg-white text-[var(--theme-accent)] shadow-xs'
                      : 'text-[#605E5C] hover:text-[#181917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-0.5 rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-0.5">
              <button
                type="button"
                onClick={() => setUsageSort('projects')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  usageSort === 'projects'
                    ? 'bg-white text-[var(--theme-accent)] shadow-xs'
                    : 'text-[#605E5C] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'По проектам',
                  en: 'By projects',
                  it: 'Per progetti',
                  es: 'Por proyectos',
                  de: 'Nach Projekten',
                })}
              </button>
              <button
                type="button"
                onClick={() => setUsageSort('weight')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  usageSort === 'weight'
                    ? 'bg-white text-[var(--theme-accent)] shadow-xs'
                    : 'text-[#605E5C] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'По весу',
                  en: 'By weight',
                  it: 'Per peso',
                  es: 'Por peso',
                  de: 'Nach Gewicht',
                })}
              </button>
            </div>
          </div>
        </div>

        {/* Search row */}
        {analytics.usageEntries.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#797775]" />
              <input
                type="text"
                value={usageQuery}
                onChange={(e) => setUsageQuery(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Поиск по названию ингредиента...',
                  en: 'Filter ingredients by name...',
                  it: 'Filtra ingredienti per nome...',
                  es: 'Filtrar ingredientes por nombre...',
                  de: 'Rohstoffe nach Namen filtern...',
                })}
                className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] py-1.5 pl-8 pr-3 text-xs text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="text-[11px] text-[#797775] tabular-nums">
              {tr(language, {
                ru: `Показано ${visibleUsage.length} из ${filteredUsage.length}`,
                en: `Showing ${visibleUsage.length} of ${filteredUsage.length}`,
                it: `Mostrati ${visibleUsage.length} di ${filteredUsage.length}`,
                es: `Mostrando ${visibleUsage.length} de ${filteredUsage.length}`,
                de: `Angezeigt: ${visibleUsage.length} von ${filteredUsage.length}`,
              })}
            </div>
          </div>
        )}

        {/* Usage Ranking Table */}
        {filteredUsage.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-6 text-center space-y-2">
            <div className="text-xs font-medium text-[#181917]">
              {analytics.usageEntries.length === 0
                ? tr(language, {
                    ru: 'В формулах проектов пока нет компонентов',
                    en: 'No formula components recorded yet',
                    it: 'Nessun componente nelle formule',
                    es: 'Aún no hay componentes en fórmulas',
                    de: 'Noch keine Rezepturkomponenten erfasst',
                  })
                : tr(language, {
                    ru: 'Нет ингредиентов по выбранному фильтру',
                    en: 'No ingredients match the current filter',
                    it: 'Nessun ingrediente corrisponde al filtro',
                    es: 'Ningún ingrediente coincide con el filtro',
                    de: 'Keine Rohstoffe für den aktuellen Filter',
                  })}
            </div>
            <p className="text-xs text-[#605E5C]">
              {analytics.usageEntries.length === 0
                ? tr(language, {
                    ru: 'Добавьте компоненты в формулу любого проекта, чтобы увидеть рейтинг самых часто используемых материалов.',
                    en: 'Add ingredients to your fragrance formulas to see usage frequency and total weight rankings.',
                    it: 'Aggiungi ingredienti alle formule per vedere frequenza d’uso e classifiche per peso.',
                    es: 'Añade ingredientes a tus fórmulas para ver su frecuencia de uso y ranking por peso.',
                    de: 'Fügen Sie Rohstoffe zu Ihren Rezepturen hinzu, um Nutzungshäufigkeit und Gesamtgewicht zu sehen.',
                  })
                : tr(language, {
                    ru: 'Попробуйте выбрать другой фильтр нот или очистить строку поиска.',
                    en: 'Try switching the tier filter or clearing the search query.',
                    it: 'Prova a cambiare il filtro delle note o a svuotare la ricerca.',
                    es: 'Prueba a cambiar el filtro de notas o limpiar la búsqueda.',
                    de: 'Wechseln Sie den Ebenenfilter oder leeren Sie das Suchfeld.',
                  })}
            </p>
            {analytics.usageEntries.length === 0 && (
              <button
                type="button"
                onClick={onOpenProjectsOverview}
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                <span>
                  {tr(language, {
                    ru: 'Перейти к проектам',
                    en: 'Open Projects',
                    it: 'Apri Progetti',
                    es: 'Ir a Proyectos',
                    de: 'Zu den Projekten',
                  })}
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E1DFDD] text-[11px] font-medium text-[#605E5C]">
                  <th className="py-2 pr-3 w-8 font-mono">#</th>
                  <th className="py-2 pr-3">
                    {tr(language, {
                      ru: 'Ингредиент и профиль',
                      en: 'Ingredient & profile',
                      it: 'Ingrediente e profilo',
                      es: 'Ingrediente y perfil',
                      de: 'Rohstoff & Profil',
                    })}
                  </th>
                  <th className="py-2 px-3 w-44 hidden md:table-cell">
                    {tr(language, {
                      ru: 'Доля использования',
                      en: 'Relative share',
                      it: 'Quota relativa',
                      es: 'Cuota relativa',
                      de: 'Anteil',
                    })}
                  </th>
                  <th className="py-2 px-3 text-right whitespace-nowrap">
                    {tr(language, {
                      ru: 'Проектов',
                      en: 'Projects',
                      it: 'Progetti',
                      es: 'Proyectos',
                      de: 'Projekte',
                    })}
                  </th>
                  <th className="py-2 px-3 text-right whitespace-nowrap">
                    {tr(language, {
                      ru: 'Вес в формулах',
                      en: 'Total weight',
                      it: 'Peso totale',
                      es: 'Peso total',
                      de: 'Gesamtgewicht',
                    })}
                  </th>
                  <th className="py-2 pl-3 hidden sm:table-cell">
                    {tr(language, {
                      ru: 'Используется в',
                      en: 'Used in',
                      it: 'Usato in',
                      es: 'Usado en',
                      de: 'Verwendet in',
                    })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE9]">
                {visibleUsage.map((item, idx) => {
                  const metricVal =
                    usageSort === 'weight'
                      ? item.totalWeightGrams
                      : item.projectsCount;
                  const barPct = Math.max(
                    4,
                    Math.min(100, Math.round((metricVal / maxUsageMetric) * 100))
                  );
                  return (
                    <tr
                      key={item.key}
                      className="hover:bg-[#FAF9F8] transition-colors"
                    >
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-[#797775] tabular-nums align-top">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 pr-3 align-top">
                        <div className="font-medium text-[#181917]">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#605E5C]">
                          <span>{getNoteTierShort(item.tier, language)}</span>
                          <span aria-hidden="true"> · </span>
                          <span>
                            {getOlfactoryFamilyLabel(item.family, language)}
                          </span>
                          {item.ingredient && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span>
                                {getIngredientStatusLabel(
                                  item.ingredient.status,
                                  language
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 align-middle hidden md:table-cell">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                          <div
                            style={{ width: `${barPct}%` }}
                            className="h-full rounded-full bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-ink)]"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums align-top whitespace-nowrap">
                        <span className="font-semibold text-[#181917]">
                          {item.projectsCount}
                        </span>
                        <span className="text-[#797775]">
                          /{projects.length || 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#181917] align-top whitespace-nowrap">
                        {formatGrams(item.totalWeightGrams, 2, language)}
                      </td>
                      <td className="py-2.5 pl-3 align-top hidden sm:table-cell">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {item.projectsList.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => onOpenProject(p.id, 'formula')}
                              title={`${p.code} — ${p.title}`}
                              className="font-mono text-[11px] font-semibold text-[var(--theme-accent)] hover:underline"
                            >
                              {p.code}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Show More + Unused In-Stock Insight */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-[#EDEBE9] pt-3">
          {filteredUsage.length > 12 ? (
            <button
              type="button"
              onClick={() => setShowAllIngredients((v) => !v)}
              className="text-xs font-medium text-[var(--theme-accent)] hover:underline text-left"
            >
              {showAllIngredients
                ? tr(language, {
                    ru: 'Показать только топ-12',
                    en: 'Show top 12 only',
                    it: 'Mostra solo i primi 12',
                    es: 'Mostrar solo los 12 primeros',
                    de: 'Nur Top 12 anzeigen',
                  })
                : tr(language, {
                    ru: `Показать все (${filteredUsage.length})`,
                    en: `Show all ${filteredUsage.length} ingredients`,
                    it: `Mostra tutti i ${filteredUsage.length} ingredienti`,
                    es: `Mostrar los ${filteredUsage.length} ingredientes`,
                    de: `Alle ${filteredUsage.length} Rohstoffe anzeigen`,
                  })}
            </button>
          ) : (
            <span />
          )}

          {analytics.unusedInStock.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#605E5C]">
              <span className="tabular-nums">
                {tr(language, {
                  ru: `В наличии, но ещё не использовано в формулах: ${analytics.unusedInStock.length}`,
                  en: `In stock, not yet used in formulas: ${analytics.unusedInStock.length}`,
                  it: `Disponibili, non ancora usati nelle formule: ${analytics.unusedInStock.length}`,
                  es: `En stock, aún sin usar en fórmulas: ${analytics.unusedInStock.length}`,
                  de: `Auf Lager, noch ungenutzt in Rezepturen: ${analytics.unusedInStock.length}`,
                })}
              </span>
              <button
                type="button"
                onClick={() => setShowUnusedStock((v) => !v)}
                className="font-medium text-[var(--theme-accent)] hover:underline"
              >
                {showUnusedStock
                  ? tr(language, {
                      ru: 'Скрыть список',
                      en: 'Hide list',
                      it: 'Nascondi elenco',
                      es: 'Ocultar lista',
                      de: 'Liste ausblenden',
                    })
                  : tr(language, {
                      ru: 'Показать список',
                      en: 'View list',
                      it: 'Mostra elenco',
                      es: 'Ver lista',
                      de: 'Liste anzeigen',
                    })}
              </button>
            </div>
          )}
        </div>

        {showUnusedStock && analytics.unusedInStock.length > 0 && (
          <div className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Неиспользованное сырьё в наличии',
                  en: 'Unused in-stock raw materials',
                  it: 'Materie prime disponibili non utilizzate',
                  es: 'Materias primas en stock sin usar',
                  de: 'Ungenutzte vorrätige Rohstoffe',
                })}
              </span>
              <button
                type="button"
                onClick={onOpenIngredients}
                className="text-xs font-medium text-[var(--theme-accent)] hover:underline"
              >
                {tr(language, {
                  ru: 'Открыть базу сырья',
                  en: 'Open Ingredients Database',
                  it: 'Apri Database Ingredienti',
                  es: 'Abrir Base de Ingredientes',
                  de: 'Rohstoffdatenbank öffnen',
                })}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs">
              {analytics.unusedInStock.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between gap-2 py-0.5 text-[#323130] min-w-0"
                >
                  <span className="truncate">{ing.name}</span>
                  <span className="shrink-0 text-[11px] text-[#797775]">
                    {getNoteTierShort(ing.tier, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Two-Column Work Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Column 1: Project Statuses, Pyramid Balance, Trials */}
        <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Ход работы и пробы',
                en: 'Workflow & Trial Progress',
                it: 'Flusso di Lavoro e Prove',
                es: 'Progreso de Trabajo y Pruebas',
                de: 'Arbeitsfortschritt & Tests',
              })}
            </h2>
            <p className="text-xs text-[#605E5C]">
              {tr(language, {
                ru: 'Статусы проектов, баланс пирамиды по всем формулам и итоги лабораторных проб.',
                en: 'Distribution by project stage, average pyramid balance, and trial verdicts.',
                it: 'Distribuzione per stato, equilibrio medio della piramide ed esiti delle prove.',
                es: 'Distribución por etapa, equilibrio medio de pirámide y resultados de pruebas.',
                de: 'Projektphasen, durchschnittliche Pyramiden-Balance und Laborergebnisse.',
              })}
            </p>
          </div>

          {/* Project statuses */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#323130]">
              {tr(language, {
                ru: 'Проекты по этапам',
                en: 'Projects by stage',
                it: 'Progetti per fase',
                es: 'Proyectos por etapa',
                de: 'Projekte nach Phase',
              })}
            </div>
            {projects.length === 0 ? (
              <p className="text-xs text-[#797775]">
                {tr(language, {
                  ru: 'Проектов пока нет.',
                  en: 'No projects yet.',
                  it: 'Nessun progetto presente.',
                  es: 'Aún no hay proyectos.',
                  de: 'Noch keine Projekte.',
                })}
              </p>
            ) : (
              <div className="space-y-2">
                {PROJECT_STATUS_ORDER.map((status) => {
                  const count = analytics.statusCounts[status] || 0;
                  const pct =
                    projects.length > 0 ? (count / projects.length) * 100 : 0;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#323130]">
                          {getProjectStatusLabel(status, language)}
                        </span>
                        <span className="font-mono tabular-nums text-[#605E5C]">
                          {count} ({formatPercent(pct, 0)})
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-ink)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Aggregate Pyramid Balance */}
          <div className="border-t border-[#EDEBE9] pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#323130]">
                {tr(language, {
                  ru: 'Средний баланс пирамиды формул',
                  en: 'Studio aromatic pyramid balance',
                  it: 'Equilibrio piramide olfattiva dello studio',
                  es: 'Equilibrio de pirámide aromática',
                  de: 'Duftpyramiden-Balance im Atelier',
                })}
              </span>
              <span className="font-mono text-[11px] text-[#797775] tabular-nums">
                {formatGrams(analytics.totalPureGramsAll, 2, language)}
              </span>
            </div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
              <div
                style={{ width: `${analytics.tierShare.top}%` }}
                className="bg-[#D97706]"
                title={tr(language, {
                  ru: 'Верхние ноты',
                  en: 'Top notes',
                  it: 'Note di testa',
                  es: 'Notas de salida',
                  de: 'Kopfnoten',
                })}
              />
              <div
                style={{ width: `${analytics.tierShare.heart}%` }}
                className="bg-[#BE185D]"
                title={tr(language, {
                  ru: 'Ноты сердца',
                  en: 'Heart notes',
                  it: 'Note di cuore',
                  es: 'Notas de corazón',
                  de: 'Herznoten',
                })}
              />
              <div
                style={{ width: `${analytics.tierShare.base}%` }}
                className="bg-[#78350F]"
                title={tr(language, {
                  ru: 'Базовые ноты',
                  en: 'Base notes',
                  it: 'Note di fondo',
                  es: 'Notas de fondo',
                  de: 'Basisnoten',
                })}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#605E5C] font-mono tabular-nums">
              <span>
                {tr(language, {
                  ru: 'Верх',
                  en: 'Top',
                  it: 'Testa',
                  es: 'Salida',
                  de: 'Kopf',
                })}
                : {formatPercent(analytics.tierShare.top, 1)}
              </span>
              <span>
                {tr(language, {
                  ru: 'Сердце',
                  en: 'Heart',
                  it: 'Cuore',
                  es: 'Corazón',
                  de: 'Herz',
                })}
                : {formatPercent(analytics.tierShare.heart, 1)}
              </span>
              <span>
                {tr(language, {
                  ru: 'База',
                  en: 'Base',
                  it: 'Fondo',
                  es: 'Fondo',
                  de: 'Basis',
                })}
                : {formatPercent(analytics.tierShare.base, 1)}
              </span>
            </div>
          </div>

          {/* Trial Verdicts */}
          <div className="border-t border-[#EDEBE9] pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#323130]">
                {tr(language, {
                  ru: 'Итоги лабораторных проб',
                  en: 'Trial journal verdicts',
                  it: 'Esiti del diario prove',
                  es: 'Resultados de pruebas',
                  de: 'Bewertung der Laborproben',
                })}
              </span>
              <span className="font-mono text-[11px] text-[#797775] tabular-nums">
                {analytics.totalJournalEntries}{' '}
                {tr(language, {
                  ru: 'записей',
                  en: 'entries',
                  it: 'voci',
                  es: 'registros',
                  de: 'Einträge',
                })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VERDICT_ORDER.map((v) => (
                <div
                  key={v}
                  className="flex items-center justify-between rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] px-3 py-2 text-xs"
                >
                  <span className="text-[#323130]">
                    {getJournalVerdictLabel(v, language)}
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-[#181917]">
                    {analytics.verdictCounts[v]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Column 2: Olfactory Families & Budget / Suppliers */}
        <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Ольфакторная палитра и закупки',
                en: 'Olfactory Palette & Purchasing',
                it: 'Tavolozza Olfattiva e Acquisti',
                es: 'Paleta Olfativa y Compras',
                de: 'Duftpalette & Einkauf',
              })}
            </h2>
            <p className="text-xs text-[#605E5C]">
              {tr(language, {
                ru: 'Частота семейств ароматов в ваших формулах, смета и статистика по поставщикам.',
                en: 'Dominant scent families across formulas and studio spending by supplier.',
                it: 'Famiglie olfattive dominanti nelle formule e spesa dello studio per fornitore.',
                es: 'Familias olfativas predominantes en las fórmulas y gasto por proveedor.',
                de: 'Dominierende Duftfamilien in Rezepturen und Ausgaben nach Lieferanten.',
              })}
            </p>
          </div>

          {/* Olfactory Families in Formulas */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#323130]">
              {tr(language, {
                ru: 'Ольфакторные семейства в формулах',
                en: 'Olfactory families in formulas',
                it: 'Famiglie olfattive nelle formule',
                es: 'Familias olfativas en fórmulas',
                de: 'Duftfamilien in Rezepturen',
              })}
            </div>
            {analytics.familyList.length === 0 ? (
              <p className="text-xs text-[#797775]">
                {tr(language, {
                  ru: 'Добавьте душистые вещества в формулы, чтобы увидеть распределение по семействам.',
                  en: 'Add aromatic components to formulas to see your olfactory signature.',
                  it: 'Aggiungi componenti aromatici alle formule per visualizzare la firma olfattiva.',
                  es: 'Añade componentes aromáticos a las fórmulas para ver tu firma olfativa.',
                  de: 'Fügen Sie Duftstoffe zu Rezepturen hinzu, um Ihre Duftsignatur zu sehen.',
                })}
              </p>
            ) : (
              <div className="space-y-2">
                {analytics.familyList.slice(0, 7).map((fam) => {
                  const maxCount = Math.max(1, analytics.familyList[0].count);
                  const pct = Math.round((fam.count / maxCount) * 100);
                  return (
                    <div key={fam.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#323130]">
                          {getOlfactoryFamilyLabel(fam.key, language)}
                        </span>
                        <span className="font-mono tabular-nums text-[#605E5C]">
                          {fam.count}{' '}
                          {tr(language, {
                            ru: 'раз',
                            en: 'uses',
                            it: 'usi',
                            es: 'usos',
                            de: 'Mal',
                          })}{' '}
                          · {formatGrams(fam.pureGrams, 2, language)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE9]">
                        <div
                          style={{
                            width: `${pct}%`,
                            backgroundColor: fam.color,
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Budget & Suppliers */}
          <div className="border-t border-[#EDEBE9] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#323130]">
                {tr(language, {
                  ru: 'Смета и закупки по поставщикам',
                  en: 'Budget & supplier spend',
                  it: 'Preventivo e spese per fornitore',
                  es: 'Presupuesto y gasto por proveedor',
                  de: 'Budget & Lieferantenausgaben',
                })}
              </span>
              <button
                type="button"
                onClick={onOpenBudget}
                className="text-xs font-medium text-[var(--theme-accent)] hover:underline"
              >
                {tr(language, {
                  ru: 'Открыть смету',
                  en: 'Open Budget',
                  it: 'Apri Preventivo',
                  es: 'Abrir Presupuesto',
                  de: 'Budget öffnen',
                })}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                <div className="text-[11px] text-[#605E5C]">
                  {tr(language, {
                    ru: 'По смете (план)',
                    en: 'Planned estimates',
                    it: 'Preventivo stimato',
                    es: 'Estimación planificada',
                    de: 'Geplantes Budget',
                  })}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#181917]">
                  {formatCurrencyRub(analytics.plannedBudget, language, currency)}
                </div>
              </div>
              <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
                <div className="text-[11px] text-[#605E5C]">
                  {tr(language, {
                    ru: 'Сумма формул (сырьё)',
                    en: 'Formulas raw value',
                    it: 'Valore materie nelle formule',
                    es: 'Valor bruto de fórmulas',
                    de: 'Rohstoffwert der Rezepturen',
                  })}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#181917]">
                  {formatCurrencyRub(
                    analytics.totalFormulaCostAll,
                    language,
                    currency
                  )}
                </div>
              </div>
            </div>

            {analytics.topSuppliers.length === 0 ? (
              <p className="text-xs text-[#797775]">
                {tr(language, {
                  ru: 'Записей о покупках пока нет.',
                  en: 'No purchases logged yet.',
                  it: 'Nessun acquisto registrato.',
                  es: 'Aún no hay compras registradas.',
                  de: 'Noch keine Einkäufe erfasst.',
                })}
              </p>
            ) : (
              <div className="divide-y divide-[#EDEBE9] border-t border-[#EDEBE9]">
                {analytics.topSuppliers.slice(0, 5).map((sup) => (
                  <div
                    key={sup.supplier}
                    className="flex items-center justify-between gap-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-[#181917]">
                        {sup.supplier}
                      </div>
                      <div className="text-[11px] text-[#797775] tabular-nums">
                        {sup.ordersCount}{' '}
                        {tr(language, {
                          ru: 'покупок',
                          en: 'purchases',
                          it: 'acquisti',
                          es: 'compras',
                          de: 'Einkäufe',
                        })}
                      </div>
                    </div>
                    <div className="font-mono font-semibold tabular-nums text-[#181917] shrink-0">
                      {formatCurrencyRub(sup.totalSpent, language, currency)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
