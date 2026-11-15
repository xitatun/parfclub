import { PieChart as PieChartIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getBudgetCategoryLabel } from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  BudgetCategory,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
} from '../types/perfume';
import { formatCurrencyRub, formatPercent } from '../utils/calculations';

type CostSourceMode = 'actual' | 'planned' | 'compare';
type CostGroupingMode = 'category' | 'item';

interface BreakdownEntry {
  key: string;
  name: string;
  shortName: string;
  amount: number;
  sharePct: number;
  count: number;
  color: string;
}

interface CompareEntry {
  key: string;
  name: string;
  planned: number;
  actual: number;
}

interface BudgetCostChartsProps {
  projects: PerfumeProject[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  selectedProjectId: string;
  onChangeProjectFilter: (projectId: string) => void;
  language: AppLanguage;
  currency: AppCurrency;
}

const CHART_PALETTE = [
  '#185ABD',
  '#107C41',
  '#D97706',
  '#6B21A8',
  '#0284C7',
  '#B45309',
  '#0D9488',
  '#64748B',
];

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  raw_materials: '#185ABD',
  solvent: '#0284C7',
  glassware: '#107C41',
  equipment: '#6B21A8',
  packaging: '#D97706',
  other: '#64748B',
};

function truncateLabel(text: string, maxLen = 24): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

interface CustomTooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string;
  payload?: BreakdownEntry & CompareEntry;
}

function CostTooltip({
  active,
  payload,
  language,
  currency,
  isCompare,
}: {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  language: AppLanguage;
  currency: AppCurrency;
  isCompare: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;

  if (isCompare) {
    const row = payload[0]?.payload;
    if (!row) return null;
    return (
      <div className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 shadow-md text-xs space-y-1">
        <div className="font-semibold text-[#181917]">{row.name}</div>
        <div className="flex items-center justify-between gap-4 text-[#6B6D68]">
          <span>
            {tr(language, { ru: 'План:', en: 'Planned:', it: 'Previsto:', es: 'Plan:', de: 'Plan:' })}
          </span>
          <span className="font-mono font-medium tabular-nums text-[#181917]">
            {formatCurrencyRub(row.planned, language, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#6B6D68]">
          <span>
            {tr(language, { ru: 'Факт:', en: 'Actual:', it: 'Effettivo:', es: 'Real:', de: 'Ist:' })}
          </span>
          <span className="font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
            {formatCurrencyRub(row.actual, language, currency)}
          </span>
        </div>
      </div>
    );
  }

  const entry = payload[0]?.payload;
  if (!entry) return null;

  return (
    <div className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 shadow-md text-xs space-y-0.5">
      <div className="flex items-center gap-2 font-semibold text-[#181917]">
        <span
          className="inline-block h-2.5 w-2.5 rounded-xs shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span>{entry.name}</span>
      </div>
      <div className="font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
        {formatCurrencyRub(entry.amount, language, currency)} ({formatPercent(entry.sharePct, 1)})
      </div>
      <div className="text-[11px] text-[#787A74] tabular-nums">
        {entry.count}{' '}
        {tr(language, { ru: 'поз.', en: 'items', it: 'voci', es: 'elem.', de: 'Pos.' })}
      </div>
    </div>
  );
}

export function BudgetCostCharts({
  projects,
  estimates,
  purchases,
  selectedProjectId,
  onChangeProjectFilter,
  language,
  currency,
}: BudgetCostChartsProps) {
  const [sourceMode, setSourceMode] = useState<CostSourceMode>('actual');
  const [groupingMode, setGroupingMode] = useState<CostGroupingMode>('category');

  const estimateMap = useMemo(() => {
    const map: Record<string, ProjectEstimateItem> = {};
    for (const e of estimates) map[e.id] = e;
    return map;
  }, [estimates]);

  const scopedEstimates = useMemo(
    () =>
      selectedProjectId === 'all'
        ? estimates
        : estimates.filter((e) => e.projectId === selectedProjectId),
    [estimates, selectedProjectId]
  );

  const scopedPurchases = useMemo(
    () =>
      selectedProjectId === 'all'
        ? purchases
        : purchases.filter((p) => p.projectId === selectedProjectId),
    [purchases, selectedProjectId]
  );

  const resolvePurchaseCategory = (rec: PurchaseRecord): BudgetCategory => {
    if (rec.category) return rec.category;
    if (rec.estimateItemId && estimateMap[rec.estimateItemId]) {
      return estimateMap[rec.estimateItemId].category;
    }
    return 'raw_materials';
  };

  const { entries, totalAmount, compareData } = useMemo(() => {
    const catKeys: BudgetCategory[] = [
      'raw_materials',
      'solvent',
      'glassware',
      'equipment',
      'packaging',
      'other',
    ];
    const compareMap = new Map<BudgetCategory, { planned: number; actual: number }>();
    for (const k of catKeys) compareMap.set(k, { planned: 0, actual: 0 });

    for (const est of scopedEstimates) {
      const slot = compareMap.get(est.category);
      if (slot) slot.planned += Math.max(0, est.requiredQuantity * est.estimatedUnitPrice);
    }
    for (const pur of scopedPurchases) {
      const cat = resolvePurchaseCategory(pur);
      const slot = compareMap.get(cat);
      if (slot) slot.actual += Math.max(0, pur.totalCost);
    }

    const compRows: CompareEntry[] = catKeys
      .map((cat) => {
        const vals = compareMap.get(cat)!;
        return {
          key: cat,
          name: getBudgetCategoryLabel(cat, language),
          planned: Number(vals.planned.toFixed(2)),
          actual: Number(vals.actual.toFixed(2)),
        };
      })
      .filter((r) => r.planned > 0 || r.actual > 0)
      .sort((a, b) => Math.max(b.actual, b.planned) - Math.max(a.actual, a.planned));

    if (sourceMode === 'compare') {
      const sumActual = compRows.reduce((s, r) => s + r.actual, 0);
      return { entries: [] as BreakdownEntry[], totalAmount: sumActual, compareData: compRows };
    }

    const agg = new Map<string, { name: string; amount: number; count: number; color?: string }>();

    if (sourceMode === 'actual') {
      for (const p of scopedPurchases) {
        const amount = Math.max(0, Number(p.totalCost) || 0);
        if (amount <= 0) continue;
        if (groupingMode === 'category') {
          const cat = resolvePurchaseCategory(p);
          const existing = agg.get(cat);
          if (existing) {
            existing.amount += amount;
            existing.count += 1;
          } else {
            agg.set(cat, {
              name: getBudgetCategoryLabel(cat, language),
              amount,
              count: 1,
              color: CATEGORY_COLORS[cat],
            });
          }
        } else {
          const itemKey = p.ingredientName.trim().toLowerCase() || p.id;
          const existing = agg.get(itemKey);
          if (existing) {
            existing.amount += amount;
            existing.count += 1;
          } else {
            agg.set(itemKey, {
              name: p.ingredientName.trim(),
              amount,
              count: 1,
            });
          }
        }
      }
    } else {
      for (const e of scopedEstimates) {
        const amount = Math.max(0, (Number(e.requiredQuantity) || 0) * (Number(e.estimatedUnitPrice) || 0));
        if (amount <= 0) continue;
        if (groupingMode === 'category') {
          const cat = e.category;
          const existing = agg.get(cat);
          if (existing) {
            existing.amount += amount;
            existing.count += 1;
          } else {
            agg.set(cat, {
              name: getBudgetCategoryLabel(cat, language),
              amount,
              count: 1,
              color: CATEGORY_COLORS[cat],
            });
          }
        } else {
          const itemKey = e.ingredientName.trim().toLowerCase() || e.id;
          const existing = agg.get(itemKey);
          if (existing) {
            existing.amount += amount;
            existing.count += 1;
          } else {
            agg.set(itemKey, {
              name: e.ingredientName.trim(),
              amount,
              count: 1,
            });
          }
        }
      }
    }

    const sorted = Array.from(agg.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.amount - a.amount);

    const total = sorted.reduce((s, r) => s + r.amount, 0);

    let finalGroups = sorted;
    if (groupingMode === 'item' && sorted.length > 7) {
      const top7 = sorted.slice(0, 7);
      const rest = sorted.slice(7);
      const restSum = rest.reduce((s, r) => s + r.amount, 0);
      const restCount = rest.reduce((s, r) => s + r.count, 0);
      finalGroups = [
        ...top7,
        {
          key: 'other_tail',
          name: tr(language, {
            ru: `Прочее (${rest.length})`,
            en: `Other (${rest.length})`,
            it: `Altro (${rest.length})`,
            es: `Otros (${rest.length})`,
            de: `Sonstiges (${rest.length})`,
          }),
          amount: restSum,
          count: restCount,
          color: '#64748B',
        },
      ];
    }

    const resultEntries: BreakdownEntry[] = finalGroups.map((item, idx) => ({
      key: item.key,
      name: item.name,
      shortName: truncateLabel(item.name, 22),
      amount: Number(item.amount.toFixed(2)),
      sharePct: total > 0 ? (item.amount / total) * 100 : 0,
      count: item.count,
      color: item.color || CHART_PALETTE[idx % CHART_PALETTE.length],
    }));

    return { entries: resultEntries, totalAmount: total, compareData: compRows };
  }, [scopedEstimates, scopedPurchases, sourceMode, groupingMode, language, estimateMap]);

  const topDriver = entries[0];

  return (
    <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] shrink-0">
            <PieChartIcon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Распределение затрат по статьям и компонентам',
                en: 'Cost Breakdown & Top Spending Drivers',
                it: 'Ripartizione dei costi per categoria e voce',
                es: 'Desglose de costos por categoría e ingrediente',
                de: 'Kostenverteilung nach Kategorien & Komponenten',
              })}
            </h2>
            <p className="mt-0.5 text-xs text-[#6B6D68]">
              {sourceMode !== 'compare' && topDriver ? (
                <>
                  {tr(language, {
                    ru: 'Больше всего средств уходит на:',
                    en: 'Largest share:',
                    it: 'Quota maggiore:',
                    es: 'Mayor gasto:',
                    de: 'Größter Kostenanteil:',
                  })}{' '}
                  <strong className="text-[#181917]">{topDriver.name}</strong> —{' '}
                  <span className="font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
                    {formatCurrencyRub(topDriver.amount, language, currency)} (
                    {formatPercent(topDriver.sharePct, 1)})
                  </span>
                </>
              ) : (
                tr(language, {
                  ru: 'Сравнение плановой сметы и фактических закупок по категориям расходов.',
                  en: 'Compare planned estimates vs. actual purchases across component categories.',
                  it: 'Confronta i costi previsti con gli acquisti reali per categoria.',
                  es: 'Compara el presupuesto planificado con las compras reales por categoría.',
                  de: 'Vergleiche geplante Budgets mit tatsächlichen Einkäufen nach Kategorien.',
                })
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={selectedProjectId}
            onChange={(e) => onChangeProjectFilter(e.target.value)}
            aria-label={tr(language, {
              ru: 'Фильтр графика по проекту',
              en: 'Filter chart by project',
              it: 'Filtra grafico per progetto',
              es: 'Filtrar gráfico por proyecto',
              de: 'Diagramm nach Projekt filtern',
            })}
            className="rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
          >
            <option value="all">
              {tr(language, {
                ru: 'Все проекты',
                en: 'All projects',
                it: 'Tutti i progetti',
                es: 'Todos los proyectos',
                de: 'Alle Projekte',
              })}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.title}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center gap-0.5 rounded-lg bg-[#EEEEEC] p-0.5">
            {(
              [
                {
                  id: 'actual',
                  label: tr(language, {
                    ru: 'Факт',
                    en: 'Actual',
                    it: 'Effettivo',
                    es: 'Real',
                    de: 'Ist',
                  }),
                },
                {
                  id: 'planned',
                  label: tr(language, {
                    ru: 'План',
                    en: 'Planned',
                    it: 'Previsto',
                    es: 'Plan',
                    de: 'Plan',
                  }),
                },
                {
                  id: 'compare',
                  label: tr(language, {
                    ru: 'План / Факт',
                    en: 'Plan vs Actual',
                    it: 'Piano / Reale',
                    es: 'Plan / Real',
                    de: 'Plan / Ist',
                  }),
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSourceMode(opt.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  sourceMode === opt.id
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {sourceMode !== 'compare' && (
            <div className="inline-flex items-center gap-0.5 rounded-lg bg-[#EEEEEC] p-0.5">
              <button
                type="button"
                onClick={() => setGroupingMode('category')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  groupingMode === 'category'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'По типам',
                  en: 'By type',
                  it: 'Per tipo',
                  es: 'Por tipo',
                  de: 'Nach Typ',
                })}
              </button>
              <button
                type="button"
                onClick={() => setGroupingMode('item')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  groupingMode === 'item'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'По позициям',
                  en: 'By ingredient',
                  it: 'Per ingrediente',
                  es: 'Por ingrediente',
                  de: 'Nach Rohstoff',
                })}
              </button>
            </div>
          )}
        </div>
      </div>

      {sourceMode === 'compare' ? (
        compareData.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-8 text-center text-xs text-[#787A74]">
            {tr(language, {
              ru: 'Нет данных сметы или закупок для выбранного проекта.',
              en: 'No estimate or purchase data for the selected project.',
              it: 'Nessun dato di preventivo o acquisto per il progetto selezionato.',
              es: 'Sin datos de presupuesto o compras para el proyecto seleccionado.',
              de: 'Keine Budget- oder Einkaufsdaten für das ausgewählte Projekt.',
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-[270px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData} margin={{ top: 10, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6B6D68' }}
                    axisLine={{ stroke: '#E4E4E0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B6D68' }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                    content={<CostTooltip language={language} currency={currency} isCompare />}
                  />
                  <Bar
                    dataKey="planned"
                    name={tr(language, { ru: 'План', en: 'Planned', it: 'Previsto', es: 'Plan', de: 'Plan' })}
                    fill="#94A3B8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="actual"
                    name={tr(language, { ru: 'Факт', en: 'Actual', it: 'Effettivo', es: 'Real', de: 'Ist' })}
                    fill="#185ABD"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#575955]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#94A3B8]" />
                {tr(language, {
                  ru: 'План по смете',
                  en: 'Planned Estimate',
                  it: 'Preventivo pianificato',
                  es: 'Presupuesto planificado',
                  de: 'Geplantes Budget',
                })}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#185ABD]" />
                {tr(language, {
                  ru: 'Фактические закупки',
                  en: 'Actual Purchases',
                  it: 'Acquisti effettivi',
                  es: 'Compras reales',
                  de: 'Tatsächliche Einkäufe',
                })}
              </span>
            </div>
          </div>
        )
      ) : entries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-8 text-center text-xs text-[#787A74]">
          {sourceMode === 'actual'
            ? tr(language, {
                ru: 'По выбранному фильтру пока нет фактических закупок.',
                en: 'No purchase records yet for this selection.',
                it: 'Nessun acquisto registrato per questa selezione.',
                es: 'Aún no hay compras registradas para esta selección.',
                de: 'Noch keine Einkäufe für diese Auswahl.',
              })
            : tr(language, {
                ru: 'По выбранному фильтру пока нет позиций в смете.',
                en: 'No planned estimate items yet for this selection.',
                it: 'Nessuna voce di preventivo per questa selezione.',
                es: 'Aún no hay partidas de presupuesto para esta selección.',
                de: 'Noch keine Budgetpositionen für diese Auswahl.',
              })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative h-[240px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={entries}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {entries.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CostTooltip language={language} currency={currency} isCompare={false} />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#787A74]">
                  {sourceMode === 'actual'
                    ? tr(language, {
                        ru: 'Всего затрат',
                        en: 'Total spent',
                        it: 'Totale speso',
                        es: 'Total gastado',
                        de: 'Gesamtausgaben',
                      })
                    : tr(language, {
                        ru: 'Всего план',
                        en: 'Total plan',
                        it: 'Totale piano',
                        es: 'Total plan',
                        de: 'Gesamtplan',
                      })}
                </span>
                <span className="mt-0.5 font-mono text-sm font-bold tabular-nums text-[#181917]">
                  {formatCurrencyRub(totalAmount, language, currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="h-[220px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={entries}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#6B6D68' }}
                    axisLine={{ stroke: '#E4E4E0' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    width={135}
                    tick={{ fontSize: 11, fill: '#3F413D' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                    content={
                      <CostTooltip language={language} currency={currency} isCompare={false} />
                    }
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={22}>
                    {entries.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border-t border-[#EAEAE6] pt-3 text-xs">
              {entries.map((entry) => (
                <div key={entry.key} className="flex items-center justify-between gap-2 min-w-0">
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate text-[#3F413D]">{entry.name}</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#181917] shrink-0">
                    {formatCurrencyRub(entry.amount, language, currency)}{' '}
                    <span className="text-[#787A74]">({formatPercent(entry.sharePct, 0)})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
