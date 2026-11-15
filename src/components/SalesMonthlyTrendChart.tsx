import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUnit } from '../data/constants';
import type { AppCurrency, AppLanguage } from '../types/perfume';
import {
  formatCurrencyRub,
  formatPercent,
  getIntlLocale,
} from '../utils/calculations';

export interface MonthlySalesTrendPoint {
  month: string;
  monthLabel: string;
  fullMonthLabel: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
  units: number;
  volumeMl: number;
  orders: number;
  avgOrder: number;
}

type TrendMetricMode = 'financial' | 'volume' | 'efficiency';
type TrendVisualStyle = 'trend' | 'bars';

interface SalesMonthlyTrendChartProps {
  monthlySeries: MonthlySalesTrendPoint[];
  language: AppLanguage;
  currency: AppCurrency;
}

interface TrendText {
  title: string;
  subtitle: string;
  tabFinancial: string;
  tabVolume: string;
  tabEfficiency: string;
  styleTrend: string;
  styleBars: string;
  revenue: string;
  profit: string;
  cogs: string;
  bottles: string;
  volume: string;
  avgOrder: string;
  margin: string;
  orders: string;
  momRevenue: string;
  momProfit: string;
  peakMonth: string;
  activeMonths: (count: number) => string;
  noData: string;
  singleMonthNote: string;
}

const TREND_TEXT: Record<AppLanguage, TrendText> = {
  ru: {
    title: 'Тренды продаж по месяцам',
    subtitle: 'Динамика выручки, валовой прибыли, отгрузок и среднего чека для оценки роста бизнеса.',
    tabFinancial: 'Выручка и прибыль',
    tabVolume: 'Флаконы и объём',
    tabEfficiency: 'Ср. чек и маржа',
    styleTrend: 'Тренд',
    styleBars: 'Столбцы',
    revenue: 'Выручка',
    profit: 'Валовая прибыль',
    cogs: 'Себестоимость',
    bottles: 'Продано флаконов',
    volume: 'Общий объём',
    avgOrder: 'Средний чек',
    margin: 'Маржа',
    orders: 'Сделок',
    momRevenue: 'Выручка м/м',
    momProfit: 'Прибыль м/м',
    peakMonth: 'Пиковый месяц',
    activeMonths: (count) => `Период: ${count} мес.`,
    noData: 'Нет продаж за выбранный период для построения графика.',
    singleMonthNote: 'Для отображения линии тренда добавьте продажи за 2 и более месяцев.',
  },
  en: {
    title: 'Monthly Sales Trends',
    subtitle: 'Track monthly revenue, gross profit, bottle volume, and average order dynamics.',
    tabFinancial: 'Revenue & Profit',
    tabVolume: 'Units & Volume',
    tabEfficiency: 'Avg. Order & Margin',
    styleTrend: 'Trend',
    styleBars: 'Bars',
    revenue: 'Revenue',
    profit: 'Gross Profit',
    cogs: 'COGS',
    bottles: 'Bottles Sold',
    volume: 'Total Volume',
    avgOrder: 'Avg. Order',
    margin: 'Margin',
    orders: 'Orders',
    momRevenue: 'MoM Revenue',
    momProfit: 'MoM Profit',
    peakMonth: 'Peak Month',
    activeMonths: (count) => `${count} mo. shown`,
    noData: 'No sales in the selected period to plot monthly trends.',
    singleMonthNote: 'Log sales across 2 or more months to reveal the multi-month trend curve.',
  },
  it: {
    title: 'Andamento Mensile Vendite',
    subtitle: 'Dinamica di ricavi, utile lordo, flaconi venduti e ordine medio nel tempo.',
    tabFinancial: 'Ricavi e Utile',
    tabVolume: 'Flaconi e Volume',
    tabEfficiency: 'Ordine Medio e Margine',
    styleTrend: 'Trend',
    styleBars: 'Barre',
    revenue: 'Ricavo',
    profit: 'Utile Lordo',
    cogs: 'Costi',
    bottles: 'Flaconi Venduti',
    volume: 'Volume Totale',
    avgOrder: 'Ordine Medio',
    margin: 'Margine',
    orders: 'Ordini',
    momRevenue: 'Ricavi m/m',
    momProfit: 'Utile m/m',
    peakMonth: 'Mese di picco',
    activeMonths: (count) => `Periodo: ${count} mesi`,
    noData: 'Nessuna vendita nel periodo selezionato per il grafico.',
    singleMonthNote: 'Registra vendite in 2 o più mesi per visualizzare la curva di tendenza.',
  },
  es: {
    title: 'Tendencias Mensuales de Ventas',
    subtitle: 'Evolución mensual de ingresos, beneficio bruto, unidades y pedido medio.',
    tabFinancial: 'Ingresos y Beneficio',
    tabVolume: 'Frascos y Volumen',
    tabEfficiency: 'Pedido Medio y Margen',
    styleTrend: 'Tendencia',
    styleBars: 'Barras',
    revenue: 'Ingresos',
    profit: 'Beneficio Bruto',
    cogs: 'Costo',
    bottles: 'Frascos Vendidos',
    volume: 'Volumen Total',
    avgOrder: 'Pedido Medio',
    margin: 'Margen',
    orders: 'Pedidos',
    momRevenue: 'Ingresos m/m',
    momProfit: 'Beneficio m/m',
    peakMonth: 'Mes pico',
    activeMonths: (count) => `Período: ${count} m.`,
    noData: 'No hay ventas en el período seleccionado para graficar.',
    singleMonthNote: 'Registra ventas en 2 o más meses para ver la curva de tendencia.',
  },
  de: {
    title: 'Monatliche Verkaufstrends',
    subtitle: 'Entwicklung von Umsatz, Rohertrag, Absatzmenge und durchschnittlichem Auftragswert.',
    tabFinancial: 'Umsatz & Gewinn',
    tabVolume: 'Flakons & Volumen',
    tabEfficiency: 'Ø Auftrag & Marge',
    styleTrend: 'Trend',
    styleBars: 'Balken',
    revenue: 'Umsatz',
    profit: 'Rohertrag',
    cogs: 'Selbstkosten',
    bottles: 'Verkaufte Flakons',
    volume: 'Gesamtvolumen',
    avgOrder: 'Ø Auftrag',
    margin: 'Marge',
    orders: 'Aufträge',
    momRevenue: 'Umsatz Vm.',
    momProfit: 'Gewinn Vm.',
    peakMonth: 'Spitzenmonat',
    activeMonths: (count) => `Zeitraum: ${count} Mon.`,
    noData: 'Keine Verkäufe im ausgewählten Zeitraum für das Diagramm.',
    singleMonthNote: 'Erfassen Sie Verkäufe über mindestens 2 Monate für eine Trendkurve.',
  },
};

export function formatSalesMonthLabels(
  monthKey: string,
  language: AppLanguage
): { monthLabel: string; fullMonthLabel: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey);
  if (!match) {
    return { monthLabel: monthKey, fullMonthLabel: monthKey };
  }
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  if (!Number.isFinite(year) || monthIdx < 0 || monthIdx > 11) {
    return { monthLabel: monthKey, fullMonthLabel: monthKey };
  }

  const date = new Date(Date.UTC(year, monthIdx, 1));
  const locale = getIntlLocale(language);

  const shortFormatter = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
  const fullFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return {
    monthLabel: shortFormatter.format(date),
    fullMonthLabel: fullFormatter.format(date),
  };
}

interface CustomTooltipPayload {
  payload?: MonthlySalesTrendPoint;
}

function MonthlyTrendTooltip({
  active,
  payload,
  language,
  currency,
  t,
  pcsUnit,
  mlUnit,
}: {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  language: AppLanguage;
  currency: AppCurrency;
  t: TrendText;
  pcsUnit: string;
  mlUnit: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="rounded-lg border border-[#E4E4E0] bg-white px-3.5 py-2.5 shadow-md text-xs space-y-1.5 min-w-[210px]">
      <div className="flex items-center justify-between gap-4 border-b border-[#EDEBE9] pb-1.5">
        <span className="font-semibold capitalize text-[#181917]">{row.fullMonthLabel}</span>
        <span className="font-mono text-[11px] tabular-nums text-[#797775]">
          {row.orders} {t.orders.toLowerCase()}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#605E5C]">
            <span
              className="inline-block h-2 w-2 rounded-xs shrink-0"
              style={{ backgroundColor: 'var(--theme-accent-ink)' }}
            />
            <span>{t.revenue}</span>
          </span>
          <span className="font-mono font-semibold tabular-nums text-[#181917]">
            {formatCurrencyRub(row.revenue, language, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#605E5C]">
            <span className="inline-block h-2 w-2 rounded-xs bg-[#107C41] shrink-0" />
            <span>{t.profit}</span>
          </span>
          <span
            className={`font-mono font-semibold tabular-nums ${
              row.profit >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
            }`}
          >
            {row.profit >= 0 ? '+' : ''}
            {formatCurrencyRub(row.profit, language, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#605E5C]">
            <span className="inline-block h-2 w-2 rounded-xs bg-[#94A3B8] shrink-0" />
            <span>{t.cogs}</span>
          </span>
          <span className="font-mono tabular-nums text-[#605E5C]">
            {formatCurrencyRub(row.cost, language, currency)}
          </span>
        </div>
      </div>

      <div className="border-t border-[#EDEBE9] pt-1.5 space-y-1 text-[11px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#797775]">{t.bottles}</span>
          <span className="font-mono tabular-nums text-[#181917]">
            {row.units} {pcsUnit} · {row.volumeMl} {mlUnit}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#797775]">
            {t.avgOrder} · {t.margin}
          </span>
          <span className="font-mono tabular-nums text-[#181917]">
            {formatCurrencyRub(row.avgOrder, language, currency)} · {formatPercent(row.marginPercent, 1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SalesMonthlyTrendChart({
  monthlySeries,
  language,
  currency,
}: SalesMonthlyTrendChartProps) {
  const [metricMode, setMetricMode] = useState<TrendMetricMode>('financial');
  const [visualStyle, setVisualStyle] = useState<TrendVisualStyle>('trend');

  const t = TREND_TEXT[language];
  const pcsUnit = formatUnit('шт', language);
  const mlUnit = formatUnit('мл', language);
  const locale = getIntlLocale(language);

  const compactCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    [locale, currency]
  );

  const compactNumberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    [locale]
  );

  const insights = useMemo(() => {
    if (monthlySeries.length === 0) return null;

    const peak = monthlySeries.reduce((best, cur) =>
      cur.revenue > best.revenue ? cur : best
    );

    if (monthlySeries.length < 2) {
      return {
        peak,
        revDeltaPct: null as number | null,
        profitDeltaPct: null as number | null,
        latest: monthlySeries[0],
        prev: null as MonthlySalesTrendPoint | null,
      };
    }

    const latest = monthlySeries[monthlySeries.length - 1];
    const prev = monthlySeries[monthlySeries.length - 2];

    const revDeltaPct =
      prev.revenue > 0 ? ((latest.revenue - prev.revenue) / prev.revenue) * 100 : null;
    const profitDeltaPct =
      prev.profit > 0 ? ((latest.profit - prev.profit) / prev.profit) * 100 : null;

    return { peak, revDeltaPct, profitDeltaPct, latest, prev };
  }, [monthlySeries]);

  const effectiveBarFallback = monthlySeries.length === 1 && visualStyle === 'trend';

  return (
    <section className="rounded-xl border border-[#E1DFDD] bg-white p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between border-b border-[#EDEBE9] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
            <h2 className="text-base font-semibold text-[#181917]">{t.title}</h2>
          </div>
          <p className="mt-0.5 text-xs text-[#605E5C]">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Metric Lens Segmented Control */}
          <div
            role="tablist"
            aria-label={t.title}
            className="inline-flex rounded-lg bg-[#EEEEEC] p-0.5"
          >
            {(
              [
                { id: 'financial', label: t.tabFinancial },
                { id: 'volume', label: t.tabVolume },
                { id: 'efficiency', label: t.tabEfficiency },
              ] as const
            ).map((tab) => {
              const active = metricMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMetricMode(tab.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#181917] shadow-xs'
                      : 'text-[#605E5C] hover:text-[#181917]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg bg-[#EEEEEC] p-0.5">
            <button
              type="button"
              onClick={() => setVisualStyle('trend')}
              aria-pressed={visualStyle === 'trend'}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                visualStyle === 'trend'
                  ? 'bg-white text-[#181917] shadow-xs'
                  : 'text-[#605E5C] hover:text-[#181917]'
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              <span>{t.styleTrend}</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualStyle('bars')}
              aria-pressed={visualStyle === 'bars'}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                visualStyle === 'bars'
                  ? 'bg-white text-[#181917] shadow-xs'
                  : 'text-[#605E5C] hover:text-[#181917]'
              }`}
            >
              <BarChart3 className="h-3 w-3" />
              <span>{t.styleBars}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Period Insights Strip */}
      {insights && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#605E5C] tabular-nums">
            <span>{t.activeMonths(monthlySeries.length)}</span>
            <span className="text-[#D2D0CE]">·</span>
            <span>
              {t.peakMonth}:{' '}
              <span className="font-medium text-[#181917]">{insights.peak.monthLabel}</span> (
              <span className="font-mono font-semibold text-[#181917]">
                {formatCurrencyRub(insights.peak.revenue, language, currency)}
              </span>
              )
            </span>
            {insights.revDeltaPct !== null && (
              <>
                <span className="text-[#D2D0CE]">·</span>
                <span className="inline-flex items-center gap-1">
                  <span>{t.momRevenue}:</span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
                      insights.revDeltaPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {insights.revDeltaPct >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {insights.revDeltaPct >= 0 ? '+' : ''}
                    {formatPercent(insights.revDeltaPct, 1)}
                  </span>
                </span>
              </>
            )}
            {insights.profitDeltaPct !== null && (
              <>
                <span className="text-[#D2D0CE]">·</span>
                <span className="inline-flex items-center gap-1">
                  <span>{t.momProfit}:</span>
                  <span
                    className={`font-mono font-semibold ${
                      insights.profitDeltaPct >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {insights.profitDeltaPct >= 0 ? '+' : ''}
                    {formatPercent(insights.profitDeltaPct, 1)}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Series Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#605E5C]">
            {metricMode === 'financial' && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-xs"
                    style={{ backgroundColor: 'var(--theme-accent-ink)' }}
                  />
                  <span>{t.revenue}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#107C41]" />
                  <span>{t.profit}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-3.5 border-t-2 border-dashed border-[#94A3B8]" />
                  <span>{t.cogs}</span>
                </span>
              </>
            )}
            {metricMode === 'volume' && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-xs"
                    style={{ backgroundColor: 'var(--theme-accent-ink)' }}
                  />
                  <span>
                    {t.bottles} ({pcsUnit})
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#0284C7]" />
                  <span>
                    {t.volume} ({mlUnit})
                  </span>
                </span>
              </>
            )}
            {metricMode === 'efficiency' && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-xs"
                    style={{ backgroundColor: 'var(--theme-accent-ink)' }}
                  />
                  <span>{t.avgOrder}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#D97706]" />
                  <span>{t.margin} (%)</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      {monthlySeries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] px-4 py-10 text-center text-xs text-[#797775]">
          {t.noData}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {metricMode === 'financial' ? (
                <ComposedChart
                  data={monthlySeries}
                  margin={{ top: 10, right: 12, left: 4, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="salesRevAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent-ink)" stopOpacity={0.26} />
                      <stop offset="95%" stopColor="var(--theme-accent-ink)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--radar-axis)" vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={{ stroke: 'var(--radar-axis)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => compactCurrencyFormatter.format(v)}
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={false}
                    tickLine={false}
                    width={62}
                  />
                  <Tooltip
                    content={
                      <MonthlyTrendTooltip
                        language={language}
                        currency={currency}
                        t={t}
                        pcsUnit={pcsUnit}
                        mlUnit={mlUnit}
                      />
                    }
                  />

                  {visualStyle === 'bars' || effectiveBarFallback ? (
                    <>
                      <Bar
                        dataKey="revenue"
                        name={t.revenue}
                        fill="var(--theme-accent-ink)"
                        fillOpacity={0.85}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={38}
                      />
                      <Bar
                        dataKey="profit"
                        name={t.profit}
                        fill="#107C41"
                        fillOpacity={0.88}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={38}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        name={t.cogs}
                        stroke="#94A3B8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3.5, fill: '#94A3B8', stroke: 'var(--radar-dot-stroke)', strokeWidth: 1.5 }}
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name={t.revenue}
                        stroke="var(--theme-accent-ink)"
                        strokeWidth={2.5}
                        fill="url(#salesRevAreaGrad)"
                        dot={{ r: 4, fill: 'var(--theme-accent-ink)', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name={t.profit}
                        stroke="#107C41"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#107C41', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        name={t.cogs}
                        stroke="#94A3B8"
                        strokeWidth={1.75}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: '#94A3B8', stroke: 'var(--radar-dot-stroke)', strokeWidth: 1.5 }}
                      />
                    </>
                  )}
                </ComposedChart>
              ) : metricMode === 'volume' ? (
                <ComposedChart
                  data={monthlySeries}
                  margin={{ top: 10, right: 12, left: 4, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="salesUnitsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent-ink)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="var(--theme-accent-ink)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--radar-axis)" vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={{ stroke: 'var(--radar-axis)' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    allowDecimals={false}
                    tickFormatter={(v: number) => `${compactNumberFormatter.format(v)} ${pcsUnit}`}
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={false}
                    tickLine={false}
                    width={54}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(v: number) => `${compactNumberFormatter.format(v)} ${mlUnit}`}
                    tick={{ fontSize: 11, fill: '#0284C7' }}
                    axisLine={false}
                    tickLine={false}
                    width={58}
                  />
                  <Tooltip
                    content={
                      <MonthlyTrendTooltip
                        language={language}
                        currency={currency}
                        t={t}
                        pcsUnit={pcsUnit}
                        mlUnit={mlUnit}
                      />
                    }
                  />

                  {visualStyle === 'bars' || effectiveBarFallback ? (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="units"
                        name={t.bottles}
                        fill="var(--theme-accent-ink)"
                        fillOpacity={0.85}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={38}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="volumeMl"
                        name={t.volume}
                        fill="#0284C7"
                        fillOpacity={0.85}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={38}
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="units"
                        name={t.bottles}
                        stroke="var(--theme-accent-ink)"
                        strokeWidth={2.5}
                        fill="url(#salesUnitsAreaGrad)"
                        dot={{ r: 4, fill: 'var(--theme-accent-ink)', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volumeMl"
                        name={t.volume}
                        stroke="#0284C7"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#0284C7', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </>
                  )}
                </ComposedChart>
              ) : (
                <ComposedChart
                  data={monthlySeries}
                  margin={{ top: 10, right: 12, left: 4, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="salesAvgOrderAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent-ink)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="var(--theme-accent-ink)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--radar-axis)" vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={{ stroke: 'var(--radar-axis)' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v: number) => compactCurrencyFormatter.format(v)}
                    tick={{ fontSize: 11, fill: '#797775' }}
                    axisLine={false}
                    tickLine={false}
                    width={62}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${Math.round(v)}%`}
                    tick={{ fontSize: 11, fill: '#D97706' }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip
                    content={
                      <MonthlyTrendTooltip
                        language={language}
                        currency={currency}
                        t={t}
                        pcsUnit={pcsUnit}
                        mlUnit={mlUnit}
                      />
                    }
                  />

                  {visualStyle === 'bars' || effectiveBarFallback ? (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="avgOrder"
                        name={t.avgOrder}
                        fill="var(--theme-accent-ink)"
                        fillOpacity={0.85}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={42}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="marginPercent"
                        name={t.margin}
                        stroke="#D97706"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#D97706', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgOrder"
                        name={t.avgOrder}
                        stroke="var(--theme-accent-ink)"
                        strokeWidth={2.5}
                        fill="url(#salesAvgOrderAreaGrad)"
                        dot={{ r: 4, fill: 'var(--theme-accent-ink)', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="marginPercent"
                        name={t.margin}
                        stroke="#D97706"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#D97706', stroke: 'var(--radar-dot-stroke)', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </>
                  )}
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          {monthlySeries.length === 1 && (
            <p className="text-[11px] text-[#797775] text-center">{t.singleMonthNote}</p>
          )}
        </div>
      )}
    </section>
  );
}
