import type { ReactNode } from 'react';
import {
  formatUnit,
  getBudgetCategoryLabel,
  getConcentrationLabel,
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getJournalVerdictLabel,
  getNoteTierLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  getOlfactoryFamilyShort,
  getProjectStatusLabel,
  getSaleChannelLabel,
  getSillageLabel,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  LibraryIngredient,
  OlfactoryFamilyKey,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
  SaleChannel,
  SaleRecord,
  ScentEvolutionPoint,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  deriveOlfactoryProfileFromFormula,
  formatCurrencyDecimal,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
  getIngredientStockGrams,
  getIntlLocale,
  getMacerationStatus,
} from '../utils/calculations';
import { compareFormulaComponents } from '../utils/revisions';
import { todayIsoDate } from '../utils/storage';

export type ProjectPdfSectionKey =
  | 'passport'
  | 'formula'
  | 'olfactory'
  | 'notes'
  | 'journal'
  | 'revisions'
  | 'budget';

export const ALL_PROJECT_PDF_SECTIONS: ProjectPdfSectionKey[] = [
  'passport',
  'formula',
  'olfactory',
  'notes',
  'journal',
  'revisions',
  'budget',
];

export type PdfExportJob =
  | {
      kind: 'project';
      project: PerfumeProject;
      estimates: ProjectEstimateItem[];
      purchases: PurchaseRecord[];
      selectedSections?: ProjectPdfSectionKey[];
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'projects_overview';
      projects: PerfumeProject[];
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'ingredients';
      ingredients: Ingredient[];
      purchases: PurchaseRecord[];
      criticalStockGrams: number;
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'budget';
      projects: PerfumeProject[];
      estimates: ProjectEstimateItem[];
      purchases: PurchaseRecord[];
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'statistics';
      projects: PerfumeProject[];
      ingredients: Ingredient[];
      estimates: ProjectEstimateItem[];
      purchases: PurchaseRecord[];
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'sales';
      projects: PerfumeProject[];
      sales: SaleRecord[];
      language: AppLanguage;
      currency: AppCurrency;
    }
  | {
      kind: 'library';
      library: LibraryIngredient[];
      language: AppLanguage;
    };

interface SheetDescriptor {
  id: string;
  sectionTitle: string;
  docTitle: string;
  docSubtitle?: string;
  content: ReactNode;
}

function chunkArray<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function PdfBar({
  percent,
  fillHex,
}: {
  percent: number;
  fillHex: string;
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  return (
    <svg
      viewBox="0 0 100 8"
      className="h-2 w-full rounded-full overflow-hidden block"
      preserveAspectRatio="none"
    >
      <rect x={0} y={0} width={100} height={8} rx={4} fill="#E2E8F0" />
      {clamped > 0 && (
        <rect x={0} y={0} width={clamped} height={8} rx={4} fill={fillHex} />
      )}
    </svg>
  );
}

function PdfSheetFrame({
  language,
  sectionTitle,
  docTitle,
  docSubtitle,
  pageNumber,
  totalPages,
  children,
}: {
  language: AppLanguage;
  sectionTitle: string;
  docTitle: string;
  docSubtitle?: string;
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
}) {
  const brand = tr(language, {
    ru: 'Ателье Эссенций',
    en: 'Atelier Essences',
    it: 'Atelier Essences',
    es: 'Atelier Essences',
    de: 'Atelier Essences',
  });
  const dateText = new Date().toLocaleDateString(getIntlLocale(language), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const pageLabel = tr(language, {
    ru: `Лист ${pageNumber} из ${totalPages}`,
    en: `Sheet ${pageNumber} of ${totalPages}`,
    it: `Foglio ${pageNumber} di ${totalPages}`,
    es: `Hoja ${pageNumber} de ${totalPages}`,
    de: `Blatt ${pageNumber} von ${totalPages}`,
  });

  return (
    <article
      data-pdf-sheet="true"
      className="w-[794px] h-[1123px] overflow-hidden bg-[#FFFFFF] text-[#0F172A] px-[44px] py-[36px] flex flex-col justify-between box-border"
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Clean Editorial Header */}
        <header className="border-b-2 border-[#0F172A] pb-3.5 mb-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] leading-[1.4] text-[#1D4ED8] whitespace-nowrap truncate">
              {brand} · {sectionTitle}
            </div>
            <h1 className="mt-2 font-serif text-[20px] font-bold leading-[1.25] text-[#0F172A] truncate">
              {docTitle}
            </h1>
            {docSubtitle && (
              <p className="mt-1 text-[11px] leading-[1.35] text-[#475569] truncate">
                {docSubtitle}
              </p>
            )}
          </div>
          <div className="text-right shrink-0 pt-0.5">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B] leading-[1.4]">
              {tr(language, {
                ru: 'Дата выпуска',
                en: 'Issued',
                it: 'Emesso',
                es: 'Fecha',
                de: 'Datum',
              })}
            </div>
            <div className="mt-0.5 font-mono text-[11px] font-semibold text-[#1E293B] leading-[1.3]">
              {dateText}
            </div>
          </div>
        </header>

        {/* Sheet Body */}
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">{children}</div>
      </div>

      {/* Clean Footer */}
      <footer className="border-t border-[#CBD5E1] pt-2.5 mt-4 flex items-center justify-between text-[10px] text-[#64748B] shrink-0">
        <span className="font-medium text-[#475569] truncate max-w-[520px]">
          {brand} — {docTitle}
        </span>
        <span className="font-mono font-semibold text-[#334155] tabular-nums">{pageLabel}</span>
      </footer>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* PURE SVG CHARTS FOR PDF SHEETS                                              */
/* -------------------------------------------------------------------------- */

function OlfactoryPyramidSvg({
  topPct,
  heartPct,
  basePct,
  topGrams,
  heartGrams,
  baseGrams,
  topNames,
  heartNames,
  baseNames,
  language,
}: {
  topPct: number;
  heartPct: number;
  basePct: number;
  topGrams: number;
  heartGrams: number;
  baseGrams: number;
  topNames: string;
  heartNames: string;
  baseNames: string;
  language: AppLanguage;
}) {
  return (
    <svg viewBox="0 0 680 265" className="w-full h-[250px] block">
      {/* Top Tier Triangle */}
      <polygon
        points="160,12 96,92 224,92"
        fill="#FEF3C7"
        stroke="#D97706"
        strokeWidth="2"
      />
      <text
        x="160"
        y="62"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#92400E"
      >
        {formatPercent(topPct, 0)}
      </text>
      <text
        x="160"
        y="78"
        textAnchor="middle"
        fontSize="10"
        fill="#B45309"
      >
        {getNoteTierShort('top', language)}
      </text>

      {/* Heart Tier Trapezoid */}
      <polygon
        points="92,98 228,98 266,174 54,174"
        fill="#DBEAFE"
        stroke="#185ABD"
        strokeWidth="2"
      />
      <text
        x="160"
        y="134"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#1E3A8A"
      >
        {formatPercent(heartPct, 0)}
      </text>
      <text
        x="160"
        y="152"
        textAnchor="middle"
        fontSize="10.5"
        fill="#1D4ED8"
      >
        {getNoteTierShort('heart', language)}
      </text>

      {/* Base Tier Trapezoid */}
      <polygon
        points="50,180 270,180 310,254 10,254"
        fill="#F3E8DF"
        stroke="#8B5E3C"
        strokeWidth="2"
      />
      <text
        x="160"
        y="214"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#5C3A21"
      >
        {formatPercent(basePct, 0)}
      </text>
      <text
        x="160"
        y="232"
        textAnchor="middle"
        fontSize="10.5"
        fill="#784C2B"
      >
        {getNoteTierShort('base', language)}
      </text>

      {/* Leader lines and right-hand descriptions */}
      <line x1="210" y1="58" x2="340" y2="58" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="210" cy="58" r="3" fill="#D97706" />
      <rect x="342" y="20" width="330" height="68" rx="8" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
      <text x="356" y="40" fontSize="11.5" fontWeight="700" fill="#92400E">
        {getNoteTierLabel('top', language)} — {formatPercent(topPct, 1)} ({formatGrams(topGrams, 2, language)})
      </text>
      <text x="356" y="58" fontSize="10.5" fill="#475569">
        {topNames || '—'}
      </text>
      <text x="356" y="75" fontSize="9.5" fill="#64748B">
        {tr(language, {
          ru: 'Первое впечатление · 5–30 минут',
          en: 'Initial opening · 5–30 min',
          it: 'Apertura iniziale · 5–30 min',
          es: 'Salida inicial · 5–30 min',
          de: 'Erster Eindruck · 5–30 Min.',
        })}
      </text>

      <line x1="252" y1="136" x2="340" y2="136" stroke="#185ABD" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="252" cy="136" r="3" fill="#185ABD" />
      <rect x="342" y="100" width="330" height="70" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
      <text x="356" y="120" fontSize="11.5" fontWeight="700" fill="#1E3A8A">
        {getNoteTierLabel('heart', language)} — {formatPercent(heartPct, 1)} ({formatGrams(heartGrams, 2, language)})
      </text>
      <text x="356" y="138" fontSize="10.5" fill="#475569">
        {heartNames || '—'}
      </text>
      <text x="356" y="156" fontSize="9.5" fill="#64748B">
        {tr(language, {
          ru: 'Ядро характера аромата · 1–5 часов',
          en: 'Core character · 1–5 hours',
          it: 'Nucleo della fragranza · 1–5 ore',
          es: 'Núcleo del aroma · 1–5 horas',
          de: 'Charakterkern · 1–5 Std.',
        })}
      </text>

      <line x1="295" y1="218" x2="340" y2="218" stroke="#8B5E3C" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="295" cy="218" r="3" fill="#8B5E3C" />
      <rect x="342" y="182" width="330" height="72" rx="8" fill="#FAF6F2" stroke="#DECBB9" strokeWidth="1" />
      <text x="356" y="202" fontSize="11.5" fontWeight="700" fill="#5C3A21">
        {getNoteTierLabel('base', language)} — {formatPercent(basePct, 1)} ({formatGrams(baseGrams, 2, language)})
      </text>
      <text x="356" y="220" fontSize="10.5" fill="#475569">
        {baseNames || '—'}
      </text>
      <text x="356" y="238" fontSize="9.5" fill="#64748B">
        {tr(language, {
          ru: 'Шлейф, фиксация и глубина · 6–24 ч',
          en: 'Fixation, trail & depth · 6–24h',
          it: 'Fissazione e scia · 6–24 ore',
          es: 'Fijación y estela · 6–24 h',
          de: 'Fixierung & Fond · 6–24 Std.',
        })}
      </text>
    </svg>
  );
}

function AccordRadarSvg({
  profileScores,
  formulaFamilyPercents,
  language,
}: {
  profileScores: Record<OlfactoryFamilyKey, number>;
  formulaFamilyPercents: Record<OlfactoryFamilyKey, number>;
  language: AppLanguage;
}) {
  const cx = 190;
  const cy = 165;
  const radius = 108;
  const count = OLFACTORY_FAMILIES.length;

  const maxFormulaPct = Math.max(
    1,
    ...OLFACTORY_FAMILIES.map((f) => formulaFamilyPercents[f.key] || 0)
  );

  const getCoord = (idx: number, ratio: number) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / count;
    return {
      x: cx + Math.cos(angle) * radius * ratio,
      y: cy + Math.sin(angle) * radius * ratio,
      angle,
    };
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const profilePoints = OLFACTORY_FAMILIES.map((fam, idx) => {
    const score = Math.max(0, Math.min(10, profileScores[fam.key] || 0));
    const pt = getCoord(idx, score / 10);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  const formulaPoints = OLFACTORY_FAMILIES.map((fam, idx) => {
    const pct = Math.max(0, formulaFamilyPercents[fam.key] || 0);
    const pt = getCoord(idx, Math.min(1, pct / maxFormulaPct));
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 380 330" className="w-full h-[305px] block">
      {/* Grid Polygons */}
      {rings.map((r) => {
        const pts = OLFACTORY_FAMILIES.map((_, idx) => {
          const p = getCoord(idx, r);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');
        return (
          <polygon
            key={r}
            points={pts}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={r === 1 ? '1.3' : '0.8'}
          />
        );
      })}

      {/* Axes */}
      {OLFACTORY_FAMILIES.map((fam, idx) => {
        const outer = getCoord(idx, 1);
        const labelPt = getCoord(idx, 1.2);
        const cos = Math.cos(labelPt.angle);
        const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
        return (
          <g key={fam.key}>
            <line
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            <text
              x={labelPt.x}
              y={labelPt.y + 3}
              textAnchor={anchor}
              fontSize="10"
              fontWeight="600"
              fill="#334155"
            >
              {getOlfactoryFamilyShort(fam.key, language)}
            </text>
          </g>
        );
      })}

      {/* Formula Mass Polygon (Secondary) */}
      <polygon
        points={formulaPoints}
        fill="#D97706"
        fillOpacity="0.16"
        stroke="#D97706"
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />

      {/* Accord Profile Polygon (Primary) */}
      <polygon
        points={profilePoints}
        fill="#185ABD"
        fillOpacity="0.22"
        stroke="#185ABD"
        strokeWidth="2.2"
      />

      {OLFACTORY_FAMILIES.map((fam, idx) => {
        const score = Math.max(0, Math.min(10, profileScores[fam.key] || 0));
        if (score <= 0) return null;
        const pt = getCoord(idx, score / 10);
        return (
          <circle
            key={fam.key}
            cx={pt.x}
            cy={pt.y}
            r="3.2"
            fill="#185ABD"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        );
      })}

      {/* Scale Ticks */}
      {[5, 10].map((val) => (
        <text
          key={val}
          x={cx + 4}
          y={cy - (radius * val) / 10 + 3}
          fontSize="8.5"
          fill="#64748B"
        >
          {val}
        </text>
      ))}
    </svg>
  );
}

function ScentEvolutionSvg({
  points,
  language,
}: {
  points: ScentEvolutionPoint[];
  language: AppLanguage;
}) {
  const sorted = [...points].sort(
    (a, b) => a.minutesFromApplication - b.minutesFromApplication
  );
  const w = 680;
  const h = 210;
  const padL = 38;
  const padR = 24;
  const padT = 18;
  const padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const getX = (idx: number) =>
    sorted.length <= 1 ? padL + plotW / 2 : padL + (idx / (sorted.length - 1)) * plotW;
  const getY = (val: number) =>
    padT + plotH - (Math.max(0, Math.min(10, val)) / 10) * plotH;

  const buildPolyline = (pick: (p: ScentEvolutionPoint) => number) =>
    sorted.map((pt, idx) => `${getX(idx).toFixed(1)},${getY(pick(pt)).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[205px] block">
      {/* Y Gridlines */}
      {[0, 2, 4, 6, 8, 10].map((tick) => {
        const y = getY(tick);
        return (
          <g key={tick}>
            <line
              x1={padL}
              y1={y}
              x2={w - padR}
              y2={y}
              stroke={tick === 0 ? '#94A3B8' : '#E2E8F0'}
              strokeWidth="1"
              strokeDasharray={tick === 0 ? undefined : '3 3'}
            />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9.5" fill="#64748B">
              {tick}
            </text>
          </g>
        );
      })}

      {/* X Ticks */}
      {sorted.map((pt, idx) => {
        const x = getX(idx);
        return (
          <g key={pt.id}>
            <line
              x1={x}
              y1={padT}
              x2={x}
              y2={padT + plotH}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
            <text
              x={x}
              y={h - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#334155"
            >
              {pt.timeLabel || `${pt.minutesFromApplication}m`}
            </text>
          </g>
        );
      })}

      {/* Series Lines */}
      {sorted.length > 0 && (
        <>
          <polyline
            fill="none"
            stroke="#D97706"
            strokeWidth="2.4"
            points={buildPolyline((p) => p.topIntensity)}
          />
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.4"
            points={buildPolyline((p) => p.heartIntensity)}
          />
          <polyline
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2.4"
            points={buildPolyline((p) => p.baseIntensity)}
          />
          {sorted.map((pt, idx) => {
            const x = getX(idx);
            return (
              <g key={pt.id}>
                <circle cx={x} cy={getY(pt.topIntensity)} r="3.4" fill="#D97706" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx={x} cy={getY(pt.heartIntensity)} r="3.4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx={x} cy={getY(pt.baseIntensity)} r="3.4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            );
          })}
        </>
      )}

      {/* Legend */}
      <g transform={`translate(${padL}, 8)`}>
        <circle cx="6" cy="0" r="4" fill="#D97706" />
        <text x="15" y="3.5" fontSize="10" fontWeight="600" fill="#334155">
          {getNoteTierShort('top', language)}
        </text>
        <circle cx="96" cy="0" r="4" fill="#2563EB" />
        <text x="105" y="3.5" fontSize="10" fontWeight="600" fill="#334155">
          {getNoteTierShort('heart', language)}
        </text>
        <circle cx="196" cy="0" r="4" fill="#7C3AED" />
        <text x="205" y="3.5" fontSize="10" fontWeight="600" fill="#334155">
          {getNoteTierShort('base', language)}
        </text>
      </g>
    </svg>
  );
}

function SalesMonthlyTrendSvg({
  months,
  language,
  currency,
}: {
  months: { month: string; label: string; revenue: number; profit: number }[];
  language: AppLanguage;
  currency: AppCurrency;
}) {
  const w = 680;
  const h = 215;
  const padL = 68;
  const padR = 20;
  const padT = 22;
  const padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const maxVal = Math.max(
    1,
    ...months.map((m) => Math.max(m.revenue, m.profit))
  );

  const slotW = months.length > 0 ? plotW / months.length : plotW;
  const barW = Math.min(28, Math.max(8, slotW * 0.34));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[210px] block">
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padT + plotH - ratio * plotH;
        const val = maxVal * ratio;
        return (
          <g key={ratio}>
            <line
              x1={padL}
              y1={y}
              x2={w - padR}
              y2={y}
              stroke={ratio === 0 ? '#94A3B8' : '#E2E8F0'}
              strokeWidth="1"
              strokeDasharray={ratio === 0 ? undefined : '3 3'}
            />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#64748B">
              {formatCurrencyRub(val, language, currency)}
            </text>
          </g>
        );
      })}

      {months.map((m, idx) => {
        const cx = padL + idx * slotW + slotW / 2;
        const revH = (m.revenue / maxVal) * plotH;
        const profH = Math.max(0, (m.profit / maxVal) * plotH);
        return (
          <g key={m.month}>
            <rect
              x={cx - barW - 1.5}
              y={padT + plotH - revH}
              width={barW}
              height={revH}
              rx={3}
              fill="#185ABD"
            />
            <rect
              x={cx + 1.5}
              y={padT + plotH - profH}
              width={barW}
              height={profH}
              rx={3}
              fill="#059669"
            />
            <text
              x={cx}
              y={h - 10}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="600"
              fill="#334155"
            >
              {m.label}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${padL}, 8)`}>
        <rect x="0" y="-4" width="10" height="8" rx="2" fill="#185ABD" />
        <text x="14" y="3" fontSize="10" fontWeight="600" fill="#334155">
          {tr(language, {
            ru: 'Выручка',
            en: 'Revenue',
            it: 'Ricavi',
            es: 'Ingresos',
            de: 'Umsatz',
          })}
        </text>
        <rect x="112" y="-4" width="10" height="8" rx="2" fill="#059669" />
        <text x="126" y="3" fontSize="10" fontWeight="600" fill="#334155">
          {tr(language, {
            ru: 'Валовая прибыль',
            en: 'Gross Profit',
            it: 'Utile Lordo',
            es: 'Beneficio Bruto',
            de: 'Rohertrag',
          })}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* BUILDERS FOR EACH SECTION / ENTITY                                          */
/* -------------------------------------------------------------------------- */

function buildProjectSheets(
  project: PerfumeProject,
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  language: AppLanguage,
  currency: AppCurrency,
  selectedSections?: ProjectPdfSectionKey[]
): SheetDescriptor[] {
  const allowedSet = new Set<ProjectPdfSectionKey>(
    selectedSections && selectedSections.length > 0 ? selectedSections : ALL_PROJECT_PDF_SECTIONS
  );
  const summary = calculateFormulaSummary(project.components);
  const derivedProfile = deriveOlfactoryProfileFromFormula(project.components);
  const manualProfile = project.olfactoryMap?.profile || {};
  const hasManualScores = (Object.values(manualProfile) as number[]).some((v) => v > 0);
  const effectiveProfile = { ...derivedProfile } as Record<OlfactoryFamilyKey, number>;
  if (hasManualScores) {
    for (const fam of OLFACTORY_FAMILIES) {
      if ((manualProfile[fam.key] || 0) > 0) {
        effectiveProfile[fam.key] = manualProfile[fam.key];
      }
    }
  }

  const familyGrams: Record<OlfactoryFamilyKey, number> = {
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
  for (const c of project.components) {
    if (c.tier === 'solvent') continue;
    const pureMass =
      Math.max(0, c.weightGrams) * (Math.min(100, Math.max(0, c.dilutionPercent)) / 100);
    familyGrams[c.family] = (familyGrams[c.family] || 0) + pureMass;
  }
  const familyPercents = {} as Record<OlfactoryFamilyKey, number>;
  for (const fam of OLFACTORY_FAMILIES) {
    familyPercents[fam.key] =
      summary.pureAromaticGrams > 0
        ? (familyGrams[fam.key] / summary.pureAromaticGrams) * 100
        : 0;
  }

  const docTitle = `${project.code} · ${project.title || '—'}`;
  const docSubtitle = `${getConcentrationLabel(project.targetConcentration, language)} · ${
    project.targetBottleMl
  } ${formatUnit('мл', language)} · ${getProjectStatusLabel(project.status, language)}`;

  const sheets: SheetDescriptor[] = [];

  // Cost calculation for 1 bottle & batch
  const concentrateShare =
    project.targetConcentration === 'Extrait'
      ? 0.25
      : project.targetConcentration === 'EDP'
        ? 0.18
        : project.targetConcentration === 'EDT'
          ? 0.12
          : project.targetConcentration === 'Cologne'
            ? 0.05
            : 0.2;
  const effectiveConcPct =
    summary.pureConcentrationPercent > 0 ? summary.pureConcentrationPercent / 100 : concentrateShare;
  const unitLiquidGrams = Math.max(1, project.targetBottleMl || 30) * 0.85;
  const liquidCostPerBottle =
    summary.costPerGram > 0
      ? summary.costPerGram * unitLiquidGrams
      : effectiveConcPct * unitLiquidGrams * 85;
  const totalUnitCost = liquidCostPerBottle + (project.packagingCostPerUnit || 0);

  // SHEET 1: Project Passport, Metrics, Concept & Maceration
  const macerations = project.macerations || [];
  const todayIso = todayIsoDate();

  if (allowedSet.has('passport')) {
    sheets.push({
    id: 'project-passport',
    sectionTitle: tr(language, {
      ru: 'Паспорт проекта и концепция',
      en: 'Project Passport & Concept',
      it: 'Passaporto Progetto e Concetto',
      es: 'Ficha de Proyecto y Concepto',
      de: 'Projektpass & Konzept',
    }),
    docTitle,
    docSubtitle,
    content: (
      <>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              {tr(language, {
                ru: 'Масса замеса',
                en: 'Batch Mass',
                it: 'Massa Totale',
                es: 'Masa Total',
                de: 'Ansatzmasse',
              })}
            </div>
            <div className="mt-1 font-mono text-[17px] font-bold text-[#0F172A] tabular-nums">
              {formatGrams(summary.totalWeightGrams, 2, language)}
            </div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">
              {project.components.length}{' '}
              {tr(language, {
                ru: 'компонентов',
                en: 'components',
                it: 'componenti',
                es: 'componentes',
                de: 'Komponenten',
              })}
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              {tr(language, {
                ru: 'Концентрация',
                en: 'Concentration',
                it: 'Concentrazione',
                es: 'Concentración',
                de: 'Konzentration',
              })}
            </div>
            <div className="mt-1 font-mono text-[17px] font-bold text-[#185ABD] tabular-nums">
              {formatPercent(summary.pureConcentrationPercent, 1)}
            </div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">
              {tr(language, {
                ru: 'Чистых душистых:',
                en: 'Pure aromatics:',
                it: 'Aromatici puri:',
                es: 'Aromáticos puros:',
                de: 'Reine Duftstoffe:',
              })}{' '}
              {formatGrams(summary.pureAromaticGrams, 2, language)}
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              {tr(language, {
                ru: 'Стойкость / Шлейф',
                en: 'Longevity / Sillage',
                it: 'Durata / Scia',
                es: 'Duración / Estela',
                de: 'Haltbarkeit / Sillage',
              })}
            </div>
            <div className="mt-1 font-mono text-[17px] font-bold text-[#0F172A] tabular-nums">
              {project.olfactoryMap.longevityHours || 6}{' '}
              {tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std' })}
            </div>
            <div className="mt-0.5 text-[10px] text-[#64748B] truncate">
              {getSillageLabel(project.olfactoryMap.sillageLevel, language)}
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              {tr(language, {
                ru: 'Себест. флакона',
                en: 'Bottle COGS',
                it: 'Costo Flacone',
                es: 'Costo Frasco',
                de: 'Flakonkosten',
              })}
            </div>
            <div className="mt-1 font-mono text-[17px] font-bold text-[#059669] tabular-nums">
              {formatCurrencyRub(totalUnitCost, language, currency)}
            </div>
            <div className="mt-0.5 text-[10px] text-[#64748B]">
              {project.targetBottleMl} {formatUnit('мл', language)} · {formatCurrencyDecimal(summary.costPerGram, language, currency)}/
              {formatUnit('г', language)}
            </div>
          </div>
        </div>

        {/* Metadata Table */}
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <div className="bg-[#F1F5F9] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1E293B] border-b border-[#CBD5E1]">
            {tr(language, {
              ru: 'Технические параметры композиции',
              en: 'Technical Composition Parameters',
              it: 'Parametri Tecnici della Composizione',
              es: 'Parámetros Técnicos de Composición',
              de: 'Technische Kompositionsparameter',
            })}
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] text-xs">
            <div className="p-3 space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Код проекта:', en: 'Code:', it: 'Codice:', es: 'Código:', de: 'Code:' })}</span>
                <span className="font-mono font-semibold text-[#0F172A]">{project.code}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Статус:', en: 'Status:', it: 'Stato:', es: 'Estado:', de: 'Status:' })}</span>
                <span className="font-semibold text-[#0F172A]">{getProjectStatusLabel(project.status, language)}</span>
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Формат:', en: 'Format:', it: 'Formato:', es: 'Formato:', de: 'Format:' })}</span>
                <span className="font-semibold text-[#0F172A]">{project.targetConcentration} · {project.targetBottleMl} {formatUnit('мл', language)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Создан:', en: 'Created:', it: 'Creato:', es: 'Creado:', de: 'Erstellt:' })}</span>
                <span className="font-mono text-[#0F172A]">{project.createdAt}</span>
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Упаковка / тара:', en: 'Packaging:', it: 'Confezione:', es: 'Envase:', de: 'Verpackung:' })}</span>
                <span className="font-mono font-semibold text-[#0F172A]">{formatCurrencyRub(project.packagingCostPerUnit || 0, language, currency)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64748B]">{tr(language, { ru: 'Обновлён:', en: 'Updated:', it: 'Aggiornato:', es: 'Actualizado:', de: 'Aktualisiert:' })}</span>
                <span className="font-mono text-[#0F172A]">{project.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Concept & Inspiration */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#FFFFFF]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#185ABD] mb-1.5">
              {tr(language, {
                ru: 'Идея и ольфакторный бриф',
                en: 'Concept & Olfactory Brief',
                it: 'Concetto e Brief Olfattivo',
                es: 'Concepto y Brief Olfativo',
                de: 'Idee & Duftkonzept',
              })}
            </div>
            <p className="text-xs leading-relaxed text-[#1E293B] whitespace-pre-line">
              {project.idea?.trim() ||
                tr(language, {
                  ru: 'Описание концепции не указано.',
                  en: 'No concept description provided.',
                  it: 'Nessuna descrizione del concetto.',
                  es: 'Sin descripción del concepto.',
                  de: 'Keine Konzeptbeschreibung vorhanden.',
                })}
            </p>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#F8FAFC]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              {tr(language, {
                ru: 'Источники вдохновения и референсы',
                en: 'Inspiration & References',
                it: 'Ispirazione e Riferimenti',
                es: 'Inspiración y Referencias',
                de: 'Inspiration & Referenzen',
              })}
            </div>
            <p className="text-xs leading-relaxed text-[#334155] whitespace-pre-line">
              {project.inspiration?.trim() ||
                tr(language, {
                  ru: 'Заметки о вдохновении отсутствуют.',
                  en: 'No inspiration notes recorded.',
                  it: 'Nessuna nota di ispirazione registrata.',
                  es: 'Sin notas de inspiración registradas.',
                  de: 'Keine Inspirationsnotizen erfasst.',
                })}
            </p>
          </div>
        </div>

        {/* Maceration Batches */}
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <div className="bg-[#F1F5F9] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1E293B] border-b border-[#CBD5E1] flex items-center justify-between">
            <span>
              {tr(language, {
                ru: 'Партии мацерации и созревания',
                en: 'Maceration & Maturation Batches',
                it: 'Lotti di Macerazione',
                es: 'Lotes de Maceración',
                de: 'Mazerations-Chargen',
              })}
            </span>
            <span className="font-mono text-[#475569]">{macerations.length}</span>
          </div>
          {macerations.length === 0 ? (
            <div className="p-3.5 text-xs text-[#64748B]">
              {tr(language, {
                ru: 'Таймеры мацерации для данного проекта пока не запущены.',
                en: 'No maceration timers started for this project yet.',
                it: 'Nessun timer di macerazione avviato per questo progetto.',
                es: 'No hay temporizadores de maceración activos.',
                de: 'Keine Mazerationstimer gestartet.',
              })}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] uppercase tracking-wider text-[#475569]">
                  <th className="py-2 px-3">{tr(language, { ru: 'Партия', en: 'Batch', it: 'Lotto', es: 'Lote', de: 'Charge' })}</th>
                  <th className="py-2 px-3">{tr(language, { ru: 'Этап', en: 'Stage', it: 'Fase', es: 'Etapa', de: 'Phase' })}</th>
                  <th className="py-2 px-3">{tr(language, { ru: 'Старт', en: 'Start', it: 'Inizio', es: 'Inicio', de: 'Start' })}</th>
                  <th className="py-2 px-3">{tr(language, { ru: 'Готовность', en: 'Ready Date', it: 'Pronto', es: 'Fecha fin', de: 'Bereit am' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'Прогресс', en: 'Progress', it: 'Avanzamento', es: 'Progreso', de: 'Fortschritt' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {macerations.slice(0, 6).map((batch) => {
                  const st = getMacerationStatus(batch, todayIso);
                  return (
                    <tr key={batch.id}>
                      <td className="py-2 px-3 font-medium text-[#0F172A]">{batch.label}</td>
                      <td className="py-2 px-3 text-[#475569]">
                        {batch.stage === 'concentrate'
                          ? tr(language, { ru: 'Концентрат', en: 'Concentrate', it: 'Concentrato', es: 'Concentrado', de: 'Konzentrat' })
                          : tr(language, { ru: 'Парфюм', en: 'Finished Perfume', it: 'Profumo', es: 'Perfume', de: 'Parfüm' })}
                      </td>
                      <td className="py-2 px-3 font-mono text-[#475569]">{batch.startDate}</td>
                      <td className="py-2 px-3 font-mono text-[#0F172A]">{st.endDate}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-[#185ABD]">
                        {st.isComplete
                          ? tr(language, { ru: 'Готово (100%)', en: 'Ready (100%)', it: 'Pronto (100%)', es: 'Listo (100%)', de: 'Fertig (100%)' })
                          : `${st.progressPercent}% (${st.remainingDays}d)`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    ),
    });
  }

  // SHEET 2+: Formula Components Table (chunked by 14 rows)
  const componentChunks = chunkArray(project.components, 14);
  if (allowedSet.has('formula') && componentChunks.length === 0) {
    sheets.push({
      id: 'formula-empty',
      sectionTitle: tr(language, {
        ru: 'Состав формулы',
        en: 'Formula Composition',
        it: 'Composizione Formula',
        es: 'Composición de Fórmula',
        de: 'Formelzusammensetzung',
      }),
      docTitle,
      docSubtitle,
      content: (
        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-10 text-center text-sm text-[#64748B]">
          {tr(language, {
            ru: 'В формулу пока не добавлено ни одного компонента.',
            en: 'No components have been added to this formula yet.',
            it: 'Nessun componente ancora aggiunto alla formula.',
            es: 'Aún no se han añadido componentes a esta fórmula.',
            de: 'Dieser Formel wurden noch keine Komponenten hinzugefügt.',
          })}
        </div>
      ),
    });
  } else if (allowedSet.has('formula')) {
    componentChunks.forEach((chunk, chunkIdx) => {
      const startIndex = chunkIdx * 14;
      sheets.push({
        id: `formula-table-${chunkIdx}`,
        sectionTitle:
          chunkIdx === 0
            ? tr(language, {
                ru: 'Состав формулы и весовые пропорции',
                en: 'Formula Composition & Proportions',
                it: 'Composizione e Proporzioni della Formula',
                es: 'Composición y Proporciones de la Fórmula',
                de: 'Formelzusammensetzung & Anteile',
              })
            : tr(language, {
                ru: 'Состав формулы (продолжение)',
                en: 'Formula Composition (Continued)',
                it: 'Composizione Formula (segue)',
                es: 'Composición de Fórmula (continuación)',
                de: 'Formelzusammensetzung (Fortsetzung)',
              }),
        docTitle,
        docSubtitle,
        content: (
          <>
            {chunkIdx === 0 && (
              <div className="grid grid-cols-4 gap-2.5 shrink-0">
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    {tr(language, { ru: 'Всего компонентов', en: 'Total Lines', it: 'Totale Voci', es: 'Total Líneas', de: 'Positionen' })}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0F172A]">
                    {project.components.length}
                  </div>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    {tr(language, { ru: 'Ароматич. смесь', en: 'Aromatic Blend', it: 'Miscela Aromatica', es: 'Mezcla Aromática', de: 'Duftmischung' })}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0F172A]">
                    {formatGrams(summary.aromaticMixtureGrams, 2, language)}
                  </div>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    {tr(language, { ru: 'Растворитель', en: 'Carrier / Solvent', it: 'Solvente', es: 'Disolvente', de: 'Trägerstoff' })}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0F172A]">
                    {formatGrams(summary.solventCarrierGrams, 2, language)}
                  </div>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                    {tr(language, { ru: 'Стоимость замеса', en: 'Batch Cost', it: 'Costo Lotto', es: 'Costo Lote', de: 'Ansatzkosten' })}
                  </div>
                  <div className="font-mono text-sm font-bold text-[#059669]">
                    {formatCurrencyRub(summary.totalFormulaCost, language, currency)}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[10px] font-bold uppercase tracking-wider text-[#334155]">
                    <th className="py-2.5 px-2.5 w-8">#</th>
                    <th className="py-2.5 px-2.5">{tr(language, { ru: 'Компонент', en: 'Component', it: 'Componente', es: 'Componente', de: 'Komponente' })}</th>
                    <th className="py-2.5 px-2">{tr(language, { ru: 'Ярус', en: 'Tier', it: 'Livello', es: 'Nivel', de: 'Ebene' })}</th>
                    <th className="py-2.5 px-2">{tr(language, { ru: 'Семейство', en: 'Family', it: 'Famiglia', es: 'Familia', de: 'Familie' })}</th>
                    <th className="py-2.5 px-2 text-right">{tr(language, { ru: 'Разб.', en: 'Dil.', it: 'Dil.', es: 'Dil.', de: 'Verd.' })}</th>
                    <th className="py-2.5 px-2 text-right">{tr(language, { ru: 'Масса', en: 'Mass', it: 'Massa', es: 'Masa', de: 'Masse' })}</th>
                    <th className="py-2.5 px-2 text-right">{tr(language, { ru: '% формулы', en: '% Form.', it: '% Form.', es: '% Fórm.', de: '% Form.' })}</th>
                    <th className="py-2.5 px-2 text-right">{tr(language, { ru: '% конц.', en: '% Conc.', it: '% Conc.', es: '% Conc.', de: '% Konz.' })}</th>
                    <th className="py-2.5 px-2.5 text-right">{tr(language, { ru: 'Сумма', en: 'Cost', it: 'Costo', es: 'Costo', de: 'Kosten' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {chunk.map((comp, idx) => {
                    const pctTotal =
                      summary.totalWeightGrams > 0
                        ? (comp.weightGrams / summary.totalWeightGrams) * 100
                        : 0;
                    const pureMass =
                      comp.tier === 'solvent'
                        ? 0
                        : Math.max(0, comp.weightGrams) *
                          (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
                    const pctPure =
                      summary.pureAromaticGrams > 0 && comp.tier !== 'solvent'
                        ? (pureMass / summary.pureAromaticGrams) * 100
                        : 0;
                    const lineCost = (comp.weightGrams || 0) * (comp.costPerGram || 0);
                    return (
                      <tr key={comp.id} className={idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'}>
                        <td className="py-2.5 px-2.5 font-mono text-[#64748B]">{startIndex + idx + 1}</td>
                        <td className="py-2.5 px-2.5">
                          <div className="font-semibold text-[#0F172A]">{comp.name}</div>
                          {comp.note && (
                            <div className="text-[10px] text-[#64748B] truncate max-w-[205px]">
                              {comp.note}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              comp.tier === 'top'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : comp.tier === 'heart'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : comp.tier === 'base'
                                    ? 'bg-orange-50 text-orange-900 border border-orange-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {getNoteTierShort(comp.tier, language)}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-[#475569]">
                          {getOlfactoryFamilyShort(comp.family, language)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-[#475569]">
                          {comp.dilutionPercent}%
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#0F172A]">
                          {formatGrams(comp.weightGrams, 2, language)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-[#334155]">
                          {formatPercent(pctTotal, 1)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-[#185ABD] font-semibold">
                          {comp.tier === 'solvent' ? '—' : formatPercent(pctPure, 1)}
                        </td>
                        <td className="py-2.5 px-2.5 text-right font-mono text-[#0F172A]">
                          {formatCurrencyDecimal(lineCost, language, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ),
      });
    });
  }

  // SHEET 3: Olfactory Pyramid + Accord Radar Profile (Together on One Dedicated Sheet)
  const topNames = (
    project.olfactoryMap.topNotes.length > 0
      ? project.olfactoryMap.topNotes.map((n) => n.name)
      : project.components.filter((c) => c.tier === 'top').map((c) => c.name)
  )
    .slice(0, 4)
    .join(', ');
  const heartNames = (
    project.olfactoryMap.heartNotes.length > 0
      ? project.olfactoryMap.heartNotes.map((n) => n.name)
      : project.components.filter((c) => c.tier === 'heart').map((c) => c.name)
  )
    .slice(0, 4)
    .join(', ');
  const baseNames = (
    project.olfactoryMap.baseNotes.length > 0
      ? project.olfactoryMap.baseNotes.map((n) => n.name)
      : project.components.filter((c) => c.tier === 'base').map((c) => c.name)
  )
    .slice(0, 4)
    .join(', ');

  const sortedFamilies = [...OLFACTORY_FAMILIES]
    .map((f) => ({
      ...f,
      score: effectiveProfile[f.key] || 0,
      pct: familyPercents[f.key] || 0,
    }))
    .sort((a, b) => b.score - a.score || b.pct - a.pct);

  if (allowedSet.has('olfactory')) {
    sheets.push({
    id: 'olfactory-pyramid-and-profile',
    sectionTitle: tr(language, {
      ru: 'Ольфакторная пирамида и профиль аккордов',
      en: 'Olfactory Pyramid & Accord Profile',
      it: 'Piramide Olfattiva e Profilo Accordi',
      es: 'Pirámide Olfativa y Perfil de Acordes',
      de: 'Duftpyramide & Akkordprofil',
    }),
    docTitle,
    docSubtitle,
    content: (
      <>
        {/* Top Block: Geometric Olfactory Pyramid */}
        <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {tr(language, {
                ru: 'Структура ольфакторной пирамиды (по чистой массе ароматических нот)',
                en: 'Olfactory Pyramid Structure (by Pure Aromatic Mass)',
                it: 'Struttura Piramide Olfattiva (per massa aromatica pura)',
                es: 'Estructura Pirámide Olfativa (por masa aromática pura)',
                de: 'Duftpyramiden-Struktur (nach reiner Duftmasse)',
              })}
            </h2>
            <span className="font-mono text-[11px] font-semibold text-[#185ABD]">
              {formatGrams(summary.pureAromaticGrams, 2, language)} (100%)
            </span>
          </div>
          <OlfactoryPyramidSvg
            topPct={summary.tierPercentOfPure.top}
            heartPct={summary.tierPercentOfPure.heart}
            basePct={summary.tierPercentOfPure.base}
            topGrams={summary.tierPureGrams.top}
            heartGrams={summary.tierPureGrams.heart}
            baseGrams={summary.tierPureGrams.base}
            topNames={topNames}
            heartNames={heartNames}
            baseNames={baseNames}
            language={language}
          />
        </div>

        {/* Bottom Block: Accord Radar + 10-Family Accord Scores */}
        <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#F8FAFC] flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-2 mb-3 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {tr(language, {
                ru: 'Профиль аккордов и радар ольфакторных семейств',
                en: 'Accord Profile & Olfactory Family Radar',
                it: 'Profilo Accordi e Radar Famiglie Olfattive',
                es: 'Perfil de Acordes y Radar de Familias Olfativas',
                de: 'Akkordprofil & Duftfamilien-Radar',
              })}
            </h2>
            <div className="flex items-center gap-4 text-[10px] text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#185ABD]" />
                {tr(language, {
                  ru: 'Профиль аккордов (0–10)',
                  en: 'Accord Profile (0–10)',
                  it: 'Profilo Accordi (0–10)',
                  es: 'Perfil Acordes (0–10)',
                  de: 'Akkordprofil (0–10)',
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#D97706]" />
                {tr(language, {
                  ru: 'Вес в формуле (%)',
                  en: 'Formula Weight (%)',
                  it: 'Peso Formula (%)',
                  es: 'Peso Fórmula (%)',
                  de: 'Formelanteil (%)',
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center flex-1 min-h-0">
            <div className="col-span-6 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] p-2">
              <AccordRadarSvg
                profileScores={effectiveProfile}
                formulaFamilyPercents={familyPercents}
                language={language}
              />
            </div>

            <div className="col-span-6 space-y-2">
              {sortedFamilies.map((fam) => (
                <div key={fam.key} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#1E293B]">
                      {getOlfactoryFamilyLabel(fam.key, language)}
                    </span>
                    <span className="font-mono text-[#475569] tabular-nums">
                      <strong className="text-[#0F172A]">{fam.score}/10</strong> ·{' '}
                      {formatPercent(fam.pct, 1)}
                    </span>
                  </div>
                  <PdfBar percent={fam.score * 10} fillHex={fam.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    ),
    });
  }

  // SHEET 4: Composition Notes & Scent Evolution Over Time
  const latestEvolution =
    project.journal.find((j) => j.scentEvolution && j.scentEvolution.length > 0)?.scentEvolution ||
    [];

  const renderTierNotesCard = (
    tier: 'top' | 'heart' | 'base',
    notes: { id: string; name: string; percentage: number; description: string }[],
    accentBorder: string,
    accentBg: string,
    accentText: string
  ) => {
    const fallbackComponents = project.components
      .filter((c) => c.tier === tier)
      .map((c) => ({
        id: c.id,
        name: c.name,
        percentage:
          summary.tierPureGrams[tier] > 0
            ? Math.round(
                ((c.weightGrams * (c.dilutionPercent / 100)) / summary.tierPureGrams[tier]) * 100
              )
            : 0,
        description: c.note || getOlfactoryFamilyLabel(c.family, language),
      }));
    const list = notes.length > 0 ? notes : fallbackComponents;

    return (
      <div className={`rounded-lg border ${accentBorder} overflow-hidden bg-[#FFFFFF]`}>
        <div
          className={`${accentBg} px-3.5 py-2 border-b ${accentBorder} flex items-center justify-between`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider ${accentText}`}>
            {getNoteTierLabel(tier, language)}
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#334155]">
            {formatPercent(summary.tierPercentOfPure[tier], 1)}
          </span>
        </div>
        {list.length === 0 ? (
          <div className="p-3 text-[11px] text-[#64748B]">—</div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {list.slice(0, 6).map((n) => (
              <div key={n.id} className="px-3.5 py-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#0F172A]">{n.name}</div>
                  {n.description && (
                    <div className="text-[10.5px] text-[#475569] leading-snug">
                      {n.description}
                    </div>
                  )}
                </div>
                {n.percentage > 0 && (
                  <span className="font-mono text-[11px] font-semibold text-[#1E293B] shrink-0">
                    {n.percentage}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (allowedSet.has('notes')) {
    sheets.push({
    id: 'notes-and-evolution',
    sectionTitle: tr(language, {
      ru: 'Ноты композиции и раскрытие во времени',
      en: 'Composition Notes & Scent Evolution',
      it: 'Note della Composizione ed Evoluzione',
      es: 'Notas de Composición y Evolución',
      de: 'Duftnoten & Duftverlauf',
    }),
    docTitle,
    docSubtitle,
    content: (
      <>
        {/* 3 Tier Notes Cards */}
        <div className="grid grid-cols-3 gap-3">
          {renderTierNotesCard(
            'top',
            project.olfactoryMap.topNotes,
            'border-amber-200',
            'bg-amber-50',
            'text-amber-800'
          )}
          {renderTierNotesCard(
            'heart',
            project.olfactoryMap.heartNotes,
            'border-blue-200',
            'bg-blue-50',
            'text-blue-800'
          )}
          {renderTierNotesCard(
            'base',
            project.olfactoryMap.baseNotes,
            'border-orange-200',
            'bg-orange-50',
            'text-orange-900'
          )}
        </div>

        {/* Evaporation & Drydown Notes */}
        <div className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#334155] mb-1">
            {tr(language, {
              ru: 'Характер раскрытия и летучесть (Evaporation Notes)',
              en: 'Drydown Character & Volatility Notes',
              it: 'Carattere di Evoluzione e Volatilità',
              es: 'Carácter de Evolución y Volatilidad',
              de: 'Duftentwicklung & Flüchtigkeitsnotizen',
            })}
          </div>
          <p className="text-xs leading-relaxed text-[#1E293B] whitespace-pre-line">
            {project.olfactoryMap.evaporationNotes?.trim() ||
              tr(language, {
                ru: 'Заметки о раскрытии аромата по фазам испарения не заполнены.',
                en: 'No evaporation or drydown notes recorded yet.',
                it: 'Nessuna nota sull’evoluzione registrata.',
                es: 'Sin notas de evolución registradas.',
                de: 'Keine Notizen zum Duftverlauf erfasst.',
              })}
          </p>
        </div>

        {/* Scent Evolution Curve */}
        <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#FFFFFF] flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {tr(language, {
                ru: 'Кривая раскрытия нот во времени (Scent Evolution)',
                en: 'Note Intensity Evolution Curve Over Time',
                it: 'Curva di Evoluzione Olfattiva nel Tempo',
                es: 'Curva de Evolución Olfativa en el Tiempo',
                de: 'Duftverlaufs-Kurve über Zeit',
              })}
            </h2>
            <span className="text-[10.5px] text-[#64748B]">
              {tr(language, {
                ru: 'Интенсивность 0–10',
                en: 'Intensity 0–10',
                it: 'Intensità 0–10',
                es: 'Intensidad 0–10',
                de: 'Intensität 0–10',
              })}
            </span>
          </div>

          {latestEvolution.length > 0 ? (
            <>
              <ScentEvolutionSvg points={latestEvolution} language={language} />
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10.5px]">
                {latestEvolution.slice(0, 6).map((pt) => (
                  <div
                    key={pt.id}
                    className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-[#0F172A]">{pt.timeLabel}: </span>
                      <span className="text-[#475569]">{pt.impression || '—'}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#334155] shrink-0">
                      {pt.topIntensity}/{pt.heartIntensity}/{pt.baseIntensity}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center rounded border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-xs text-[#64748B]">
              {tr(language, {
                ru: 'Данные кривой раскрытия появятся после фиксации контрольных точек в журнале испытаний.',
                en: 'Evolution curve data will appear once checkpoints are logged in the trials journal.',
                it: 'I dati della curva appariranno dopo aver registrato i checkpoint nel giornale.',
                es: 'Los datos de la curva aparecerán al registrar puntos de control en el diario.',
                de: 'Verlaufsdaten erscheinen nach Erfassung von Messpunkten im Laborjournal.',
              })}
            </div>
          )}
        </div>
      </>
    ),
    });
  }

  // SHEET 5+: Lab Trials Journal
  const journalChunks = allowedSet.has('journal') ? chunkArray(project.journal, 4) : [];
  journalChunks.forEach((chunk, chunkIdx) => {
    sheets.push({
      id: `journal-${chunkIdx}`,
      sectionTitle:
        chunkIdx === 0
          ? tr(language, {
              ru: 'Лабораторный журнал испытаний',
              en: 'Laboratory Trials Journal',
              it: 'Giornale delle Prove di Laboratorio',
              es: 'Diario de Pruebas de Laboratorio',
              de: 'Labor-Versuchsjournal',
            })
          : tr(language, {
              ru: 'Журнал испытаний (продолжение)',
              en: 'Trials Journal (Continued)',
              it: 'Giornale Prove (segue)',
              es: 'Diario de Pruebas (continuación)',
              de: 'Versuchsjournal (Fortsetzung)',
            }),
      docTitle,
      docSubtitle,
      content: (
        <div className="space-y-3">
          {chunk.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#185ABD]">
                    {entry.date}
                  </span>
                  <span className="text-sm font-bold text-[#0F172A]">{entry.trialLabel}</span>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10.5px] font-bold border ${
                    entry.verdict === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : entry.verdict === 'promising'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : entry.verdict === 'needs_work'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {getJournalVerdictLabel(entry.verdict, language)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#1E293B] whitespace-pre-line">
                {entry.content}
              </p>
              {entry.formulaSnapshotSummary && (
                <div className="rounded bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 font-mono text-[10.5px] text-[#475569]">
                  {entry.formulaSnapshotSummary}
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    });
  });

  // SHEET 6+: Formula Revision History & Variations
  const revisions = project.revisions || [];
  const revChunks = allowedSet.has('revisions') ? chunkArray(revisions, 4) : [];
  revChunks.forEach((chunk, chunkIdx) => {
    sheets.push({
      id: `revisions-${chunkIdx}`,
      sectionTitle:
        chunkIdx === 0
          ? tr(language, {
              ru: 'История правок и вариации состава',
              en: 'Formula Revision History & Variations',
              it: 'Cronologia Revisioni e Varianti Formula',
              es: 'Historial de Revisiones y Variaciones',
              de: 'Revisionsverlauf & Formelvariationen',
            })
          : tr(language, {
              ru: 'История правок (продолжение)',
              en: 'Revision History (Continued)',
              it: 'Cronologia Revisioni (segue)',
              es: 'Historial de Revisiones (continuación)',
              de: 'Revisionsverlauf (Fortsetzung)',
            }),
      docTitle,
      docSubtitle,
      content: (
        <div className="space-y-3">
          {chunk.map((rev) => {
            const revIndex = revisions.findIndex((r) => r.id === rev.id);
            const prevRev =
              revIndex >= 0 && revIndex + 1 < revisions.length ? revisions[revIndex + 1] : null;
            const revSummary = calculateFormulaSummary(rev.components);
            const diffs = prevRev
              ? compareFormulaComponents(prevRev.components, rev.components).items.filter(
                  (d) => d.kind !== 'unchanged'
                )
              : [];

            return (
              <div
                key={rev.id}
                className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#185ABD] px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#FFFFFF]">
                      {rev.versionCode}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">{rev.title}</span>
                  </div>
                  <div className="font-mono text-[10.5px] text-[#64748B]">
                    {rev.date}
                    {rev.createdAtTime ? ` · ${rev.createdAtTime}` : ''} ·{' '}
                    {formatGrams(revSummary.totalWeightGrams, 2, language)} ·{' '}
                    {formatPercent(revSummary.pureConcentrationPercent, 1)}
                  </div>
                </div>

                {rev.notes && (
                  <p className="text-xs leading-relaxed text-[#334155] whitespace-pre-line">
                    {rev.notes}
                  </p>
                )}

                {diffs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {diffs.slice(0, 8).map((d, i) => (
                      <span
                        key={i}
                        className={`rounded px-2 py-0.5 font-mono text-[10px] border ${
                          d.kind === 'added'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : d.kind === 'removed'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {d.kind === 'added' ? '+' : d.kind === 'removed' ? '−' : 'Δ'} {d.name} (
                        {d.weightDelta >= 0 ? '+' : ''}
                        {d.weightDelta.toFixed(2)} {formatUnit('г', language)})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    });
  });

  // SHEET 7: Unit Economics, Budget Estimates & Purchases
  const projEstimates = estimates.filter((e) => e.projectId === project.id);
  const projPurchases = purchases.filter((p) => p.projectId === project.id);
  const totalPlannedBudget = projEstimates.reduce(
    (s, e) => s + e.requiredQuantity * e.estimatedUnitPrice,
    0
  );
  const totalActualSpent = projPurchases.reduce((s, p) => s + p.totalCost, 0);

  if (allowedSet.has('budget')) {
    sheets.push({
    id: 'project-economics-budget',
    sectionTitle: tr(language, {
      ru: 'Себестоимость флакона и бюджет проекта',
      en: 'Unit Economics & Project Budget',
      it: 'Costi per Flacone e Budget Progetto',
      es: 'Costos por Frasco y Presupuesto',
      de: 'Flakonkalkulation & Projektbudget',
    }),
    docTitle,
    docSubtitle,
    content: (
      <>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
              {tr(language, { ru: 'Жидкость на 1 фл.', en: 'Liquid / Bottle', it: 'Liquido / Flacone', es: 'Líquido / Frasco', de: 'Flüssigkeit / Fl.' })}
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#0F172A]">
              {formatCurrencyRub(liquidCostPerBottle, language, currency)}
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
              {tr(language, { ru: 'Тара и упаковка', en: 'Bottle & Box', it: 'Flacone e Scatola', es: 'Frasco y Caja', de: 'Flakon & Etikett' })}
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#0F172A]">
              {formatCurrencyRub(project.packagingCostPerUnit || 0, language, currency)}
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
              {tr(language, { ru: 'Итого себест. / шт', en: 'Total COGS / Bottle', it: 'Costo Totale / pz', es: 'Costo Total / ud', de: 'Gesamtkosten / Stk' })}
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#185ABD]">
              {formatCurrencyRub(totalUnitCost, language, currency)}
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
              {tr(language, { ru: 'Рек. розница (×3.5)', en: 'Retail Target (×3.5)', it: 'Prezzo Cons. (×3.5)', es: 'PVP Rec. (×3.5)', de: 'UVP Ziel (×3.5)' })}
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#059669]">
              {formatCurrencyRub(totalUnitCost * 3.5, language, currency)}
            </div>
          </div>
        </div>

        {/* Estimates Table */}
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <div className="bg-[#F1F5F9] px-3.5 py-2 border-b border-[#CBD5E1] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#1E293B]">
            <span>
              {tr(language, {
                ru: 'Смета закупок по проекту',
                en: 'Project Procurement Estimate',
                it: 'Preventivo Acquisti del Progetto',
                es: 'Presupuesto de Compras del Proyecto',
                de: 'Projekt-Einkaufsbudget',
              })}
            </span>
            <span className="font-mono text-[#0F172A]">
              {tr(language, { ru: 'План:', en: 'Plan:', it: 'Prev.:', es: 'Plan:', de: 'Plan:' })}{' '}
              {formatCurrencyRub(totalPlannedBudget, language, currency)} ·{' '}
              {tr(language, { ru: 'Факт:', en: 'Actual:', it: 'Speso:', es: 'Real:', de: 'Ist:' })}{' '}
              {formatCurrencyRub(totalActualSpent, language, currency)}
            </span>
          </div>
          {projEstimates.length === 0 ? (
            <div className="p-4 text-xs text-[#64748B]">
              {tr(language, {
                ru: 'Позиции сметы к этому проекту ещё не привязаны.',
                en: 'No budget estimate items linked to this project yet.',
                it: 'Nessuna voce di preventivo collegata a questo progetto.',
                es: 'No hay partidas de presupuesto vinculadas a este proyecto.',
                de: 'Noch keine Budgetposten mit diesem Projekt verknüpft.',
              })}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] uppercase tracking-wider text-[#475569]">
                  <th className="py-2 px-3">{tr(language, { ru: 'Позиция', en: 'Item', it: 'Voce', es: 'Artículo', de: 'Position' })}</th>
                  <th className="py-2 px-3">{tr(language, { ru: 'Категория', en: 'Category', it: 'Categoria', es: 'Categoría', de: 'Kategorie' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'План кол-во', en: 'Planned Qty', it: 'Qtà Prev.', es: 'Cant. Plan', de: 'Planmenge' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'Закуплено', en: 'Purchased', it: 'Acquistato', es: 'Comprado', de: 'Eingekauft' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'План сумма', en: 'Planned', it: 'Previsto', es: 'Planificado', de: 'Planwert' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {projEstimates.slice(0, 13).map((est) => {
                  const boughtQty = purchases
                    .filter((p) => p.estimateItemId === est.id)
                    .reduce((s, p) => s + p.quantity, 0);
                  return (
                    <tr key={est.id}>
                      <td className="py-2 px-3 font-medium text-[#0F172A]">{est.ingredientName}</td>
                      <td className="py-2 px-3 text-[#475569]">{getBudgetCategoryLabel(est.category, language)}</td>
                      <td className="py-2 px-3 text-right font-mono text-[#334155]">
                        {est.requiredQuantity} {formatUnit(est.unit, language)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[#059669]">
                        {boughtQty} {formatUnit(est.unit, language)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-[#0F172A]">
                        {formatCurrencyRub(est.requiredQuantity * est.estimatedUnitPrice, language, currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    ),
    });
  }

  return sheets;
}

function buildProjectsOverviewSheets(
  projects: PerfumeProject[],
  language: AppLanguage,
  currency: AppCurrency
): SheetDescriptor[] {
  const sectionTitle = tr(language, {
    ru: 'Портфель проектов',
    en: 'Projects Portfolio',
    it: 'Portafoglio Progetti',
    es: 'Cartera de Proyectos',
    de: 'Projektportfolio',
  });
  const docTitle = tr(language, {
    ru: 'Реестр парфюмерных проектов мастерской',
    en: 'Studio Fragrance Projects Registry',
    it: 'Registro Progetti dell’Atelier',
    es: 'Registro de Proyectos del Taller',
    de: 'Atelier-Projektregister',
  });

  const chunks = chunkArray(projects, 8);
  if (chunks.length === 0) {
    return [
      {
        id: 'overview-empty',
        sectionTitle,
        docTitle,
        content: (
          <div className="rounded-lg border border-dashed border-[#CBD5E1] p-10 text-center text-sm text-[#64748B]">
            —
          </div>
        ),
      },
    ];
  }

  return chunks.map((chunk, idx) => ({
    id: `overview-${idx}`,
    sectionTitle,
    docTitle,
    docSubtitle: `${projects.length} ${tr(language, {
      ru: 'проектов в мастерской',
      en: 'projects in studio',
      it: 'progetti in atelier',
      es: 'proyectos en el taller',
      de: 'Projekte im Atelier',
    })}`,
    content: (
      <>
        {idx === 0 && (
          <div className="grid grid-cols-4 gap-3 shrink-0">
            {(
              [
                ['idea', projects.filter((p) => p.status === 'idea').length],
                ['formulating', projects.filter((p) => p.status === 'formulating').length],
                ['macerating', projects.filter((p) => p.status === 'macerating').length],
                ['completed', projects.filter((p) => p.status === 'completed').length],
              ] as const
            ).map(([status, count]) => (
              <div key={status} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                  {getProjectStatusLabel(status, language)}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#0F172A]">{count}</div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2.5">
          {chunk.map((p) => {
            const sum = calculateFormulaSummary(p.components);
            return (
              <div
                key={p.id}
                className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#185ABD]">{p.code}</span>
                    <span className="text-sm font-bold text-[#0F172A] truncate">{p.title}</span>
                    <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-semibold text-[#334155]">
                      {getProjectStatusLabel(p.status, language)}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#475569] truncate">
                    {p.idea || '—'}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] shrink-0 space-y-0.5">
                  <div className="font-bold text-[#0F172A]">
                    {p.targetConcentration} · {p.targetBottleMl} {formatUnit('мл', language)} ·{' '}
                    {formatPercent(sum.pureConcentrationPercent, 1)}
                  </div>
                  <div className="text-[#64748B]">
                    {p.components.length}{' '}
                    {tr(language, { ru: 'комп.', en: 'comp.', it: 'comp.', es: 'comp.', de: 'Komp.' })}{' '}
                    · {formatCurrencyRub(sum.totalFormulaCost, language, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ),
  }));
}

function buildIngredientsSheets(
  ingredients: Ingredient[],
  _purchases: PurchaseRecord[],
  _criticalStockGrams: number,
  language: AppLanguage,
  currency: AppCurrency
): SheetDescriptor[] {
  const docTitle = tr(language, {
    ru: 'Склад душистых веществ и масел',
    en: 'Aroma Chemicals & Oils Inventory',
    it: 'Inventario Materie Prime e Oli',
    es: 'Inventario de Materias Primas',
    de: 'Rohstoff- & Duftölbestand',
  });

  const sheets: SheetDescriptor[] = [];

  chunkArray(ingredients, 14).forEach((chunk, idx) => {
    sheets.push({
      id: `ingredients-list-${idx}`,
      sectionTitle: tr(language, {
        ru: `Каталог сырья (лист ${idx + 1})`,
        en: `Raw Materials Catalog (Sheet ${idx + 1})`,
        it: `Catalogo Materie Prime (${idx + 1})`,
        es: `Catálogo de Materias Primas (${idx + 1})`,
        de: `Rohstoffkatalog (Blatt ${idx + 1})`,
      }),
      docTitle,
      content: (
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <table className="w-full text-left border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[10px] font-bold uppercase tracking-wider text-[#334155]">
                <th className="py-2 px-2.5">{tr(language, { ru: 'Название / CAS', en: 'Name / CAS', it: 'Nome / CAS', es: 'Nombre / CAS', de: 'Name / CAS' })}</th>
                <th className="py-2 px-2">{tr(language, { ru: 'Ярус / Сем.', en: 'Tier / Fam.', it: 'Liv. / Fam.', es: 'Niv. / Fam.', de: 'Eb. / Fam.' })}</th>
                <th className="py-2 px-2">{tr(language, { ru: 'Тип', en: 'Origin', it: 'Origine', es: 'Origen', de: 'Herkunft' })}</th>
                <th className="py-2 px-2">{tr(language, { ru: 'Статус', en: 'Status', it: 'Stato', es: 'Estado', de: 'Status' })}</th>
                <th className="py-2 px-2 text-right">{tr(language, { ru: 'Остаток', en: 'Stock', it: 'Scorta', es: 'Stock', de: 'Bestand' })}</th>
                <th className="py-2 px-2.5 text-right">{tr(language, { ru: 'Цена / ед.', en: 'Unit Price', it: 'Prezzo / u.', es: 'Precio / u.', de: 'Einzelpreis' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {chunk.map((ing, i) => {
                const unitPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
                const stock = ing.remainingGrams ?? ing.quantityGrams;
                return (
                  <tr key={ing.id} className={i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'}>
                    <td className="py-2 px-2.5">
                      <div className="font-semibold text-[#0F172A]">{ing.name}</div>
                      <div className="text-[9.5px] text-[#64748B] truncate max-w-[200px]">
                        {[ing.inciOrCas, ing.supplier].filter(Boolean).join(' · ') || ing.olfactoryNotes}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-[#334155]">
                      {getNoteTierShort(ing.tier, language)} · {getOlfactoryFamilyShort(ing.family, language)}
                    </td>
                    <td className="py-2 px-2 text-[#475569] truncate max-w-[115px]">
                      {getIngredientOriginLabel(ing.origin, language)}
                    </td>
                    <td className="py-2 px-2">
                      <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#334155]">
                        {getIngredientStatusLabel(ing.status, language)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-[#0F172A]">
                      {stock} {formatUnit(ing.unit, language)}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-semibold text-[#0F172A]">
                      {formatCurrencyDecimal(unitPrice, language, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    });
  });

  return sheets;
}

function buildBudgetSheets(
  projects: PerfumeProject[],
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  language: AppLanguage,
  currency: AppCurrency
): SheetDescriptor[] {
  const sectionTitle = tr(language, {
    ru: 'Бюджет и закупки',
    en: 'Budget & Purchases',
    it: 'Budget e Acquisti',
    es: 'Presupuesto y Compras',
    de: 'Budget & Einkäufe',
  });
  const docTitle = tr(language, {
    ru: 'Сметы проектов и журнал закупок',
    en: 'Project Estimates & Procurement Ledger',
    it: 'Preventivi e Registro Acquisti',
    es: 'Presupuestos y Diario de Compras',
    de: 'Projektbudgets & Einkaufsjournal',
  });

  const projMap = new Map(projects.map((p) => [p.id, `${p.code} ${p.title}`]));
  const totalPlanned = estimates.reduce((s, e) => s + e.requiredQuantity * e.estimatedUnitPrice, 0);
  const totalSpent = purchases.reduce((s, p) => s + p.totalCost, 0);

  const sheets: SheetDescriptor[] = [
    {
      id: 'budget-overview',
      sectionTitle,
      docTitle,
      content: (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'План по сметам', en: 'Total Planned', it: 'Totale Previsto', es: 'Total Planificado', de: 'Gesamtbudget' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0F172A]">
                {formatCurrencyRub(totalPlanned, language, currency)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Фактически закуплено', en: 'Actual Spent', it: 'Totale Speso', es: 'Total Gastado', de: 'Tatsächlich Ausgegeben' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#185ABD]">
                {formatCurrencyRub(totalSpent, language, currency)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Остаток бюджета', en: 'Remaining Variance', it: 'Residuo', es: 'Saldo Restante', de: 'Restbudget' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#059669]">
                {formatCurrencyRub(totalPlanned - totalSpent, language, currency)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
            <div className="bg-[#F1F5F9] px-3.5 py-2 border-b border-[#CBD5E1] text-[11px] font-bold uppercase tracking-wider text-[#1E293B]">
              {tr(language, { ru: 'Смета закупок (план)', en: 'Planned Procurement Items', it: 'Voci di Preventivo', es: 'Partidas Planificadas', de: 'Geplante Beschaffungsposten' })}
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] uppercase text-[#475569]">
                  <th className="py-2 px-3">{tr(language, { ru: 'Позиция', en: 'Item', it: 'Voce', es: 'Artículo', de: 'Position' })}</th>
                  <th className="py-2 px-3">{tr(language, { ru: 'Проект', en: 'Project', it: 'Progetto', es: 'Proyecto', de: 'Projekt' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'Кол-во', en: 'Qty', it: 'Qtà', es: 'Cant.', de: 'Menge' })}</th>
                  <th className="py-2 px-3 text-right">{tr(language, { ru: 'Сумма', en: 'Total', it: 'Totale', es: 'Total', de: 'Summe' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {estimates.slice(0, 12).map((est) => (
                  <tr key={est.id}>
                    <td className="py-2 px-3 font-medium text-[#0F172A]">{est.ingredientName}</td>
                    <td className="py-2 px-3 text-[#475569] truncate max-w-[180px]">
                      {projMap.get(est.projectId) || '—'}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {est.requiredQuantity} {formatUnit(est.unit, language)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-[#0F172A]">
                      {formatCurrencyRub(est.requiredQuantity * est.estimatedUnitPrice, language, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];

  chunkArray(purchases, 14).forEach((chunk, idx) => {
    sheets.push({
      id: `purchases-${idx}`,
      sectionTitle: tr(language, {
        ru: `Журнал фактических закупок (${idx + 1})`,
        en: `Purchase Ledger (${idx + 1})`,
        it: `Registro Acquisti (${idx + 1})`,
        es: `Diario de Compras (${idx + 1})`,
        de: `Einkaufsjournal (${idx + 1})`,
      }),
      docTitle,
      content: (
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[10px] font-bold uppercase text-[#334155]">
                <th className="py-2 px-3">{tr(language, { ru: 'Дата', en: 'Date', it: 'Data', es: 'Fecha', de: 'Datum' })}</th>
                <th className="py-2 px-3">{tr(language, { ru: 'Материал', en: 'Material', it: 'Materiale', es: 'Material', de: 'Material' })}</th>
                <th className="py-2 px-3">{tr(language, { ru: 'Поставщик', en: 'Supplier', it: 'Fornitore', es: 'Proveedor', de: 'Lieferant' })}</th>
                <th className="py-2 px-3 text-right">{tr(language, { ru: 'Кол-во', en: 'Qty', it: 'Qtà', es: 'Cant.', de: 'Menge' })}</th>
                <th className="py-2 px-3 text-right">{tr(language, { ru: 'Итого', en: 'Total', it: 'Totale', es: 'Total', de: 'Summe' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {chunk.map((pur, i) => (
                <tr key={pur.id} className={i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'}>
                  <td className="py-2 px-3 font-mono text-[#475569]">{pur.date}</td>
                  <td className="py-2 px-3 font-semibold text-[#0F172A]">{pur.ingredientName}</td>
                  <td className="py-2 px-3 text-[#475569]">{pur.supplier || '—'}</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {pur.quantity} {formatUnit(pur.unit, language)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#0F172A]">
                    {formatCurrencyRub(pur.totalCost, language, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  });

  return sheets;
}

function buildStatisticsSheets(
  projects: PerfumeProject[],
  ingredients: Ingredient[],
  _estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  language: AppLanguage,
  currency: AppCurrency
): SheetDescriptor[] {
  const sectionTitle = tr(language, {
    ru: 'Статистика мастерской',
    en: 'Studio Statistics',
    it: 'Statistiche Atelier',
    es: 'Estadísticas del Taller',
    de: 'Atelier-Statistik',
  });
  const docTitle = tr(language, {
    ru: 'Аналитический отчёт мастерской',
    en: 'Studio Analytics Report',
    it: 'Report Analitico dell’Atelier',
    es: 'Informe Analítico del Taller',
    de: 'Atelier-Analysebericht',
  });

  const familyCounts = OLFACTORY_FAMILIES.map((f) => ({
    ...f,
    count: ingredients.filter((i) => i.family === f.key).length,
  }));
  const maxFamilyCount = Math.max(1, ...familyCounts.map((f) => f.count));

  const usageMap = new Map<string, { name: string; count: number; totalGrams: number }>();
  for (const p of projects) {
    for (const c of p.components) {
      if (c.tier === 'solvent') continue;
      const key = c.name.trim().toLowerCase();
      const prev = usageMap.get(key) || { name: c.name, count: 0, totalGrams: 0 };
      prev.count += 1;
      prev.totalGrams += c.weightGrams || 0;
      usageMap.set(key, prev);
    }
  }
  const topUsed = Array.from(usageMap.values())
    .sort((a, b) => b.count - a.count || b.totalGrams - a.totalGrams)
    .slice(0, 14);

  const totalSpent = purchases.reduce((s, p) => s + p.totalCost, 0);

  return [
    {
      id: 'studio-stats-overview',
      sectionTitle,
      docTitle,
      content: (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Проектов', en: 'Projects', it: 'Progetti', es: 'Proyectos', de: 'Projekte' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0F172A]">{projects.length}</div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Ингредиентов', en: 'Materials', it: 'Materie', es: 'Materiales', de: 'Rohstoffe' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#185ABD]">{ingredients.length}</div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Записей журнала', en: 'Lab Trials', it: 'Prove Lab', es: 'Pruebas Lab', de: 'Labortests' })}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0F172A]">
                {projects.reduce((s, p) => s + p.journal.length, 0)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Затраты на закупки', en: 'Purchases Total', it: 'Totale Acquisti', es: 'Total Compras', de: 'Einkaufsvolumen' })}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-[#059669]">
                {formatCurrencyRub(totalSpent, language, currency)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#FFFFFF] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-2">
              {tr(language, {
                ru: 'Распределение базы сырья по ольфакторным семействам',
                en: 'Raw Material Inventory by Olfactory Family',
                it: 'Distribuzione Materie Prime per Famiglia',
                es: 'Distribución de Materias por Familia',
                de: 'Rohstoffverteilung nach Duftfamilie',
              })}
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {familyCounts.map((fam) => (
                <div key={fam.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[#1E293B]">{getOlfactoryFamilyLabel(fam.key, language)}</span>
                    <span className="font-mono font-bold text-[#0F172A]">{fam.count}</span>
                  </div>
                  <PdfBar percent={(fam.count / maxFamilyCount) * 100} fillHex={fam.color} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
            <div className="bg-[#F1F5F9] px-3.5 py-2 border-b border-[#CBD5E1] text-[11px] font-bold uppercase tracking-wider text-[#1E293B]">
              {tr(language, {
                ru: 'Самые востребованные компоненты в формулах',
                en: 'Most Used Aromatic Components Across Formulas',
                it: 'Componenti Più Utilizzati nelle Formule',
                es: 'Componentes Más Usados en Fórmulas',
                de: 'Meistgenutzte Duftkomponenten',
              })}
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <tbody className="divide-y divide-[#E2E8F0]">
                {topUsed.slice(0, 10).map((item, idx) => (
                  <tr key={item.name} className={idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'}>
                    <td className="py-1.5 px-3 font-mono text-[#64748B] w-8">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-semibold text-[#0F172A]">{item.name}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-[#185ABD] font-semibold">
                      {item.count}×
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-[#334155]">
                      {formatGrams(item.totalGrams, 2, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];
}

function buildSalesSheets(
  sales: SaleRecord[],
  language: AppLanguage,
  currency: AppCurrency
): SheetDescriptor[] {
  const sectionTitle = tr(language, {
    ru: 'Статистика продаж',
    en: 'Sales Statistics',
    it: 'Statistiche Vendite',
    es: 'Estadísticas de Ventas',
    de: 'Verkaufsstatistik',
  });
  const docTitle = tr(language, {
    ru: 'Коммерческий отчёт по продажам',
    en: 'Commercial Sales & Margin Report',
    it: 'Report Commerciale Vendite',
    es: 'Informe Comercial de Ventas',
    de: 'Umsatz- & Margenbericht',
  });

  const totalRevenue = sales.reduce((s, r) => s + (r.totalRevenue || 0), 0);
  const totalCost = sales.reduce((s, r) => s + (r.unitCost || 0) * (r.quantity || 0), 0);
  const grossProfit = totalRevenue - totalCost;
  const marginPct = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const totalUnits = sales.reduce((s, r) => s + (r.quantity || 0), 0);

  const monthMap = new Map<string, { month: string; revenue: number; profit: number }>();
  for (const s of sales) {
    const key = (s.date || '').slice(0, 7) || '—';
    const cur = monthMap.get(key) || { month: key, revenue: 0, profit: 0 };
    const rev = s.totalRevenue || 0;
    const cost = (s.unitCost || 0) * (s.quantity || 0);
    cur.revenue += rev;
    cur.profit += rev - cost;
    monthMap.set(key, cur);
  }
  const months = Array.from(monthMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-10)
    .map((m) => ({
      ...m,
      label: m.month.slice(2),
    }));

  const channels: SaleChannel[] = ['direct', 'boutique', 'marketplace', 'fair', 'gift'];
  const channelRows = channels.map((ch) => {
    const list = sales.filter((s) => s.channel === ch);
    const rev = list.reduce((acc, s) => acc + (s.totalRevenue || 0), 0);
    return {
      ch,
      rev,
      pct: totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0,
      units: list.reduce((acc, s) => acc + (s.quantity || 0), 0),
    };
  });

  const sheets: SheetDescriptor[] = [
    {
      id: 'sales-analytics',
      sectionTitle,
      docTitle,
      content: (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Общая выручка', en: 'Total Revenue', it: 'Ricavi Totali', es: 'Ingresos Totales', de: 'Gesamtumsatz' })}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-[#185ABD]">
                {formatCurrencyRub(totalRevenue, language, currency)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Валовая прибыль', en: 'Gross Profit', it: 'Utile Lordo', es: 'Beneficio Bruto', de: 'Rohertrag' })}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-[#059669]">
                {formatCurrencyRub(grossProfit, language, currency)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Маржинальность', en: 'Gross Margin', it: 'Margine Lordo', es: 'Margen Bruto', de: 'Rohertragsmarge' })}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-[#0F172A]">
                {formatPercent(marginPct, 1)}
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#64748B]">
                {tr(language, { ru: 'Продано флаконов', en: 'Bottles Sold', it: 'Flaconi Venduti', es: 'Frascos Vendidos', de: 'Verkaufte Flakons' })}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-[#0F172A]">
                {totalUnits} {formatUnit('шт', language)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#FFFFFF]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-2 mb-3">
              {tr(language, {
                ru: 'Динамика выручки и прибыли по месяцам',
                en: 'Monthly Revenue & Gross Profit Trend',
                it: 'Andamento Mensile Ricavi e Utili',
                es: 'Tendencia Mensual de Ingresos y Beneficio',
                de: 'Monatliche Umsatz- & Ertragsentwicklung',
              })}
            </div>
            {months.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B]">—</div>
            ) : (
              <SalesMonthlyTrendSvg months={months} language={language} currency={currency} />
            )}
          </div>

          <div className="rounded-lg border border-[#CBD5E1] p-4 bg-[#F8FAFC] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {tr(language, {
                ru: 'Структура продаж по каналам сбыта',
                en: 'Revenue Breakdown by Sales Channel',
                it: 'Ripartizione per Canale di Vendita',
                es: 'Desglose por Canal de Venta',
                de: 'Umsatz nach Vertriebskanal',
              })}
            </div>
            <div className="space-y-2">
              {channelRows.map((row) => (
                <div key={row.ch} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[#1E293B]">
                      {getSaleChannelLabel(row.ch, language)}
                    </span>
                    <span className="font-mono text-[#0F172A]">
                      {formatCurrencyRub(row.rev, language, currency)} ({formatPercent(row.pct, 1)} · {row.units}{' '}
                      {formatUnit('шт', language)})
                    </span>
                  </div>
                  <PdfBar percent={row.pct} fillHex="#185ABD" />
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];

  chunkArray(sales, 14).forEach((chunk, idx) => {
    sheets.push({
      id: `sales-ledger-${idx}`,
      sectionTitle: tr(language, {
        ru: `Журнал продаж (лист ${idx + 1})`,
        en: `Sales Ledger (Sheet ${idx + 1})`,
        it: `Registro Vendite (${idx + 1})`,
        es: `Diario de Ventas (${idx + 1})`,
        de: `Verkaufsjournal (Blatt ${idx + 1})`,
      }),
      docTitle,
      content: (
        <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[10px] font-bold uppercase text-[#334155]">
                <th className="py-2 px-2.5">{tr(language, { ru: 'Дата', en: 'Date', it: 'Data', es: 'Fecha', de: 'Datum' })}</th>
                <th className="py-2 px-2.5">{tr(language, { ru: 'Позиция', en: 'Fragrance', it: 'Fragranza', es: 'Fragancia', de: 'Duft' })}</th>
                <th className="py-2 px-2">{tr(language, { ru: 'Канал', en: 'Channel', it: 'Canale', es: 'Canal', de: 'Kanal' })}</th>
                <th className="py-2 px-2 text-right">{tr(language, { ru: 'Кол-во', en: 'Qty', it: 'Qtà', es: 'Cant.', de: 'Menge' })}</th>
                <th className="py-2 px-2.5 text-right">{tr(language, { ru: 'Выручка', en: 'Revenue', it: 'Ricavo', es: 'Ingreso', de: 'Umsatz' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {chunk.map((s, i) => (
                <tr key={s.id} className={i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'}>
                  <td className="py-2 px-2.5 font-mono text-[#475569]">{s.date}</td>
                  <td className="py-2 px-2.5 font-semibold text-[#0F172A]">
                    {s.fragranceName} ({s.bottleMl} {formatUnit('мл', language)})
                  </td>
                  <td className="py-2 px-2 text-[#475569]">{getSaleChannelLabel(s.channel, language)}</td>
                  <td className="py-2 px-2 text-right font-mono">{s.quantity}</td>
                  <td className="py-2 px-2.5 text-right font-mono font-bold text-[#185ABD]">
                    {formatCurrencyRub(s.totalRevenue, language, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  });

  return sheets;
}

function buildLibrarySheets(
  library: LibraryIngredient[],
  language: AppLanguage
): SheetDescriptor[] {
  const sectionTitle = tr(language, {
    ru: 'Библиотека ингредиентов',
    en: 'Ingredient Reference Library',
    it: 'Libreria Ingredienti',
    es: 'Biblioteca de Ingredientes',
    de: 'Rohstoff-Bibliothek',
  });
  const docTitle = tr(language, {
    ru: 'Личный справочник парфюмера',
    en: 'Perfumer Sensory Reference Book',
    it: 'Archivio Olfattivo Personale',
    es: 'Archivo Olfativo Personal',
    de: 'Persönliches Duftstoff-Kompendium',
  });

  const chunks = chunkArray(library, 4);
  if (chunks.length === 0) {
    return [
      {
        id: 'library-empty',
        sectionTitle,
        docTitle,
        content: (
          <div className="rounded-lg border border-dashed border-[#CBD5E1] p-10 text-center text-sm text-[#64748B]">
            —
          </div>
        ),
      },
    ];
  }

  return chunks.map((chunk, idx) => ({
    id: `library-sheet-${idx}`,
    sectionTitle,
    docTitle,
    content: (
      <div className="space-y-3">
        {chunk.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-2">
              <div>
                <div className="text-sm font-bold text-[#0F172A]">{item.name}</div>
                <div className="text-[11px] text-[#475569]">
                  {[
                    item.inciOrCas,
                    getNoteTierShort(item.tier, language),
                    getOlfactoryFamilyLabel(item.family, language),
                    getIngredientOriginLabel(item.origin, language),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
              <div className="text-right font-mono text-[11px] shrink-0 space-y-0.5">
                <div className="font-bold text-[#185ABD]">
                  {tr(language, { ru: 'Запах:', en: 'Scent:', it: 'Odore:', es: 'Aroma:', de: 'Duft:' })}{' '}
                  {item.scentRating}/5 ·{' '}
                  {tr(language, { ru: 'Идеи:', en: 'Ideas:', it: 'Idee:', es: 'Ideas:', de: 'Ideen:' })}{' '}
                  {item.futureIdeasRating}/5
                </div>
                {item.blotterLongevity && (
                  <div className="text-[#475569]">
                    {tr(language, { ru: 'На блоттере:', en: 'Blotter:', it: 'Mouillette:', es: 'Secante:', de: 'Riechstreifen:' })}{' '}
                    {item.blotterLongevity}
                  </div>
                )}
              </div>
            </div>

            {item.scentDescription && (
              <div className="text-xs text-[#1E293B]">
                <span className="font-bold text-[#334155]">
                  {tr(language, { ru: 'Чем пахнет: ', en: 'Scent profile: ', it: 'Profilo: ', es: 'Aroma: ', de: 'Duftprofil: ' })}
                </span>
                {item.scentDescription}
              </div>
            )}
            {item.properties && (
              <div className="text-[11px] text-[#475569]">
                <span className="font-semibold text-[#334155]">
                  {tr(language, { ru: 'Свойства: ', en: 'Properties: ', it: 'Proprietà: ', es: 'Propiedades: ', de: 'Eigenschaften: ' })}
                </span>
                {item.properties}
              </div>
            )}
            {item.notes.length > 0 && (
              <div className="rounded bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 text-[10.5px] text-[#334155]">
                {item.notes
                  .slice(0, 2)
                  .map((n) => `${n.date}: ${n.text}`)
                  .join(' | ')}
              </div>
            )}
          </div>
        ))}
      </div>
    ),
  }));
}

export function PdfDocumentSheets({ job }: { job: PdfExportJob | null }) {
  if (!job) return null;

  let sheets: SheetDescriptor[] = [];
  if (job.kind === 'project') {
    sheets = buildProjectSheets(
      job.project,
      job.estimates,
      job.purchases,
      job.language,
      job.currency,
      job.selectedSections
    );
  } else if (job.kind === 'projects_overview') {
    sheets = buildProjectsOverviewSheets(job.projects, job.language, job.currency);
  } else if (job.kind === 'ingredients') {
    sheets = buildIngredientsSheets(
      job.ingredients,
      job.purchases,
      job.criticalStockGrams,
      job.language,
      job.currency
    );
  } else if (job.kind === 'budget') {
    sheets = buildBudgetSheets(
      job.projects,
      job.estimates,
      job.purchases,
      job.language,
      job.currency
    );
  } else if (job.kind === 'statistics') {
    sheets = buildStatisticsSheets(
      job.projects,
      job.ingredients,
      job.estimates,
      job.purchases,
      job.language,
      job.currency
    );
  } else if (job.kind === 'sales') {
    sheets = buildSalesSheets(job.sales, job.language, job.currency);
  } else if (job.kind === 'library') {
    sheets = buildLibrarySheets(job.library, job.language);
  }

  return (
    <div className="flex flex-col gap-6 bg-[#FFFFFF]">
      {sheets.map((sheet, idx) => (
        <PdfSheetFrame
          key={sheet.id}
          language={job.language}
          sectionTitle={sheet.sectionTitle}
          docTitle={sheet.docTitle}
          docSubtitle={sheet.docSubtitle}
          pageNumber={idx + 1}
          totalPages={sheets.length}
        >
          {sheet.content}
        </PdfSheetFrame>
      ))}
    </div>
  );
}
