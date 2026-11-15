import {
  Activity,
  Clock,
  GitCompareArrows,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { tr } from '../data/i18n';
import type { AppLanguage, JournalEntry, ScentEvolutionPoint } from '../types/perfume';
import { generateId } from '../utils/storage';

export const NOTE_EVOLUTION_COLORS = {
  top: '#D97706',
  heart: '#2563EB',
  base: '#7C3AED',
} as const;

type SeriesFilter = 'all' | 'top' | 'heart' | 'base';

export function formatMinutesLabel(minutes: number, language: AppLanguage): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) {
    return `${safe} ${tr(language, { ru: 'мин', en: 'm', it: 'min', es: 'min', de: 'Min' })}`.replace(
      /(\d+) m$/,
      '$1m'
    );
  }
  const hours = safe / 60;
  const formatted = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  if (language === 'ru') return `${formatted} ч`;
  if (language === 'de') return `${formatted} Std`;
  return `${formatted}h`;
}

export function createDefaultEvolutionCheckpoints(
  language: AppLanguage
): ScentEvolutionPoint[] {
  const presets = [
    { minutes: 0, top: 8, heart: 3, base: 1 },
    { minutes: 15, top: 6, heart: 6, base: 3 },
    { minutes: 60, top: 2, heart: 8, base: 5 },
    { minutes: 180, top: 0, heart: 6, base: 8 },
    { minutes: 360, top: 0, heart: 2, base: 6 },
  ];
  return presets.map((p) => ({
    id: generateId('ev'),
    minutesFromApplication: p.minutes,
    timeLabel: formatMinutesLabel(p.minutes, language),
    topIntensity: p.top,
    heartIntensity: p.heart,
    baseIntensity: p.base,
    impression: '',
  }));
}

function sortEvolutionPoints(points: ScentEvolutionPoint[]): ScentEvolutionPoint[] {
  return [...points].sort((a, b) => a.minutesFromApplication - b.minutesFromApplication);
}

interface EvolutionTooltipRow {
  minutes: number;
  timeLabel: string;
  top: number | null;
  heart: number | null;
  base: number | null;
  impression?: string;
  compareTop?: number | null;
  compareHeart?: number | null;
  compareBase?: number | null;
  compareImpression?: string;
}

function ScentEvolutionTooltip({
  active,
  payload,
  language,
  primaryLabel,
  compareLabel,
}: {
  active?: boolean;
  payload?: Array<{ payload?: EvolutionTooltipRow }>;
  language: AppLanguage;
  primaryLabel: string;
  compareLabel?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const vsLabel = tr(language, { ru: 'сравн.', en: 'vs', it: 'vs', es: 'vs', de: 'vs' });

  return (
    <div className="max-w-xs rounded-lg border border-[#E4E4E0] bg-white px-3 py-2.5 shadow-md text-xs space-y-1.5">
      <div className="flex items-center justify-between gap-4 border-b border-[#EAEAE6] pb-1">
        <span className="font-mono font-semibold text-[#181917]">{row.timeLabel}</span>
        <span className="text-[11px] text-[#6B6D68] truncate">{primaryLabel}</span>
      </div>

      <div className="space-y-1">
        {row.top !== null && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#575955]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NOTE_EVOLUTION_COLORS.top }}
              />
              {tr(language, {
                ru: 'Верхние ноты',
                en: 'Top notes',
                it: 'Note di testa',
                es: 'Notas de salida',
                de: 'Kopfnoten',
              })}
            </span>
            <span className="font-mono font-semibold tabular-nums text-[#181917]">
              {row.top}/10
              {compareLabel && row.compareTop !== undefined && row.compareTop !== null && (
                <span className="ml-1.5 font-normal text-[#6B6D68]">
                  ({vsLabel} {row.compareTop})
                </span>
              )}
            </span>
          </div>
        )}
        {row.heart !== null && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#575955]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NOTE_EVOLUTION_COLORS.heart }}
              />
              {tr(language, {
                ru: 'Ноты сердца',
                en: 'Heart notes',
                it: 'Note di cuore',
                es: 'Notas de corazón',
                de: 'Herznoten',
              })}
            </span>
            <span className="font-mono font-semibold tabular-nums text-[#181917]">
              {row.heart}/10
              {compareLabel && row.compareHeart !== undefined && row.compareHeart !== null && (
                <span className="ml-1.5 font-normal text-[#6B6D68]">
                  ({vsLabel} {row.compareHeart})
                </span>
              )}
            </span>
          </div>
        )}
        {row.base !== null && (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#575955]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NOTE_EVOLUTION_COLORS.base }}
              />
              {tr(language, {
                ru: 'Базовые ноты',
                en: 'Base notes',
                it: 'Note di fondo',
                es: 'Notas de fondo',
                de: 'Basisnoten',
              })}
            </span>
            <span className="font-mono font-semibold tabular-nums text-[#181917]">
              {row.base}/10
              {compareLabel && row.compareBase !== undefined && row.compareBase !== null && (
                <span className="ml-1.5 font-normal text-[#6B6D68]">
                  ({vsLabel} {row.compareBase})
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {row.impression && (
        <p className="border-t border-[#EAEAE6] pt-1.5 text-[11px] leading-snug text-[#3F413D]">
          {row.impression}
        </p>
      )}
      {compareLabel && row.compareImpression && (
        <p className="text-[11px] leading-snug text-[#6B6D68] italic">
          {compareLabel}: {row.compareImpression}
        </p>
      )}
    </div>
  );
}

interface ScentEvolutionEditorProps {
  points: ScentEvolutionPoint[];
  onChange: (next: ScentEvolutionPoint[]) => void;
  language: AppLanguage;
  compact?: boolean;
}

export function ScentEvolutionEditor({
  points,
  onChange,
  language,
  compact = false,
}: ScentEvolutionEditorProps) {
  const [newMinutes, setNewMinutes] = useState('30');
  const sorted = useMemo(() => sortEvolutionPoints(points), [points]);

  const topShort = tr(language, { ru: 'Верх', en: 'Top', it: 'Testa', es: 'Salida', de: 'Kopf' });
  const heartShort = tr(language, { ru: 'Сердце', en: 'Heart', it: 'Cuore', es: 'Corazón', de: 'Herz' });
  const baseShort = tr(language, { ru: 'База', en: 'Base', it: 'Fondo', es: 'Fondo', de: 'Basis' });
  const minUnit = tr(language, { ru: 'мин', en: 'min', it: 'min', es: 'min', de: 'Min' });

  const previewData = useMemo(
    () =>
      sorted.map((pt) => ({
        timeLabel: pt.timeLabel || formatMinutesLabel(pt.minutesFromApplication, language),
        top: pt.topIntensity,
        heart: pt.heartIntensity,
        base: pt.baseIntensity,
      })),
    [sorted, language]
  );

  const handleUpdatePoint = (id: string, patch: Partial<ScentEvolutionPoint>) => {
    const updated = points.map((pt) => {
      if (pt.id !== id) return pt;
      const merged = { ...pt, ...patch };
      if (patch.minutesFromApplication !== undefined) {
        merged.timeLabel = formatMinutesLabel(patch.minutesFromApplication, language);
      }
      return merged;
    });
    onChange(sortEvolutionPoints(updated));
  };

  const handleAddCheckpoint = () => {
    const mins = Math.max(0, Math.min(2880, Math.round(Number(newMinutes) || 0)));
    const existing = new Set(points.map((p) => p.minutesFromApplication));
    let finalMins = mins;
    while (existing.has(finalMins)) {
      finalMins += 15;
    }

    const prev = sorted.filter((p) => p.minutesFromApplication <= finalMins).slice(-1)[0];
    const newPt: ScentEvolutionPoint = {
      id: generateId('ev'),
      minutesFromApplication: finalMins,
      timeLabel: formatMinutesLabel(finalMins, language),
      topIntensity: prev ? Math.max(0, prev.topIntensity - 2) : 4,
      heartIntensity: prev ? prev.heartIntensity : 6,
      baseIntensity: prev ? Math.min(10, prev.baseIntensity + 1) : 5,
      impression: '',
    };
    onChange(sortEvolutionPoints([...points, newPt]));
  };

  const handleRemovePoint = (id: string) => {
    if (points.length <= 1) return;
    onChange(points.filter((p) => p.id !== id));
  };

  const handleResetStandard = () => {
    onChange(createDefaultEvolutionCheckpoints(language));
  };

  return (
    <div className="space-y-3 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#575955]">
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NOTE_EVOLUTION_COLORS.top }}
            />
            {topShort}
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NOTE_EVOLUTION_COLORS.heart }}
            />
            {heartShort}
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NOTE_EVOLUTION_COLORS.base }}
            />
            {baseShort}
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetStandard}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B6D68] hover:text-[#181917]"
        >
          <RotateCcw className="h-3 w-3" />
          <span>
            {tr(language, {
              ru: 'Сброс 0м–6ч',
              en: 'Reset 0m–6h',
              it: 'Reset 0m–6h',
              es: 'Reset 0m–6h',
              de: 'Reset 0m–6h',
            })}
          </span>
        </button>
      </div>

      {previewData.length > 0 && (
        <div className="rounded-md border border-[#EAEAE6] bg-white px-2 pt-2 pb-1">
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={previewData} margin={{ top: 4, right: 6, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" vertical={false} />
                <XAxis
                  dataKey="timeLabel"
                  tick={{ fontSize: 10, fill: '#6B6D68' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 5, 10]}
                  tick={{ fontSize: 10, fill: '#8B8D87' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Area
                  type="monotone"
                  dataKey="top"
                  stroke={NOTE_EVOLUTION_COLORS.top}
                  strokeWidth={2}
                  fill={NOTE_EVOLUTION_COLORS.top}
                  fillOpacity={0.14}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="heart"
                  stroke={NOTE_EVOLUTION_COLORS.heart}
                  strokeWidth={2}
                  fill={NOTE_EVOLUTION_COLORS.heart}
                  fillOpacity={0.12}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="base"
                  stroke={NOTE_EVOLUTION_COLORS.base}
                  strokeWidth={2}
                  fill={NOTE_EVOLUTION_COLORS.base}
                  fillOpacity={0.12}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
        {sorted.map((pt) => (
          <div
            key={pt.id}
            className="rounded-md border border-[#E4E4E0] bg-white p-2.5 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#6B6D68]" />
                <label className="inline-flex items-center gap-1 text-xs font-medium text-[#181917]">
                  <input
                    type="number"
                    min={0}
                    max={2880}
                    step={5}
                    value={pt.minutesFromApplication}
                    onChange={(e) =>
                      handleUpdatePoint(pt.id, {
                        minutesFromApplication: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-16 rounded border border-[#E4E4E0] bg-[#FAFBF9] px-1.5 py-0.5 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#6B6D68]">
                    {minUnit} · {pt.timeLabel}
                  </span>
                </label>
              </div>
              {points.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePoint(pt.id)}
                  className="rounded p-1 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                  aria-label={tr(language, {
                    ru: 'Удалить точку',
                    en: 'Remove checkpoint',
                    it: 'Rimuovi punto',
                    es: 'Eliminar punto',
                    de: 'Messpunkt entfernen',
                  })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}`}>
              <label className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#B45309]">{topShort}</span>
                  <span className="font-mono tabular-nums text-[#181917]">{pt.topIntensity}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={pt.topIntensity}
                  onChange={(e) =>
                    handleUpdatePoint(pt.id, { topIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-[#D97706]"
                />
              </label>

              <label className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#1D4ED8]">{heartShort}</span>
                  <span className="font-mono tabular-nums text-[#181917]">
                    {pt.heartIntensity}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={pt.heartIntensity}
                  onChange={(e) =>
                    handleUpdatePoint(pt.id, { heartIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-[#2563EB]"
                />
              </label>

              <label className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#6D28D9]">{baseShort}</span>
                  <span className="font-mono tabular-nums text-[#181917]">{pt.baseIntensity}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={pt.baseIntensity}
                  onChange={(e) =>
                    handleUpdatePoint(pt.id, { baseIntensity: Number(e.target.value) })
                  }
                  className="w-full accent-[#7C3AED]"
                />
              </label>
            </div>

            <input
              type="text"
              value={pt.impression || ''}
              onChange={(e) => handleUpdatePoint(pt.id, { impression: e.target.value })}
              placeholder={tr(language, {
                ru: `Ощущения на отметке ${pt.timeLabel} (необязательно)...`,
                en: `Impression at ${pt.timeLabel} (optional)...`,
                it: `Impressioni a ${pt.timeLabel} (opzionale)...`,
                es: `Impresión a los ${pt.timeLabel} (opcional)...`,
                de: `Eindruck nach ${pt.timeLabel} (optional)...`,
              })}
              className="w-full rounded border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="number"
          min={0}
          max={2880}
          step={5}
          value={newMinutes}
          onChange={(e) => setNewMinutes(e.target.value)}
          className="w-20 rounded-md border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
          aria-label={tr(language, {
            ru: 'Минуты после нанесения',
            en: 'Minutes from application',
            it: 'Minuti dall’applicazione',
            es: 'Minutos tras la aplicación',
            de: 'Minuten nach dem Auftragen',
          })}
        />
        <span className="text-xs text-[#6B6D68]">
          {minUnit} ({formatMinutesLabel(Number(newMinutes) || 0, language)})
        </span>
        <button
          type="button"
          onClick={handleAddCheckpoint}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-[#D4D4CE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#FAFBF9]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>
            {tr(language, {
              ru: 'Добавить точку',
              en: 'Add checkpoint',
              it: 'Aggiungi punto',
              es: 'Añadir punto',
              de: 'Messpunkt hinzufügen',
            })}
          </span>
        </button>
      </div>
    </div>
  );
}

interface ScentEvolutionVisualizerProps {
  journal: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onSaveEntryEvolution: (entryId: string, points: ScentEvolutionPoint[] | undefined) => void;
  language: AppLanguage;
}

export function ScentEvolutionVisualizer({
  journal,
  selectedEntryId,
  onSelectEntry,
  onSaveEntryEvolution,
  language,
}: ScentEvolutionVisualizerProps) {
  const [compareEntryId, setCompareEntryId] = useState<string>('');
  const [seriesFilter, setSeriesFilter] = useState<SeriesFilter>('all');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [draftPoints, setDraftPoints] = useState<ScentEvolutionPoint[]>([]);

  const topLabel = tr(language, { ru: 'Верхние ноты', en: 'Top notes', it: 'Note di testa', es: 'Notas de salida', de: 'Kopfnoten' });
  const heartLabel = tr(language, { ru: 'Ноты сердца', en: 'Heart notes', it: 'Note di cuore', es: 'Notas de corazón', de: 'Herznoten' });
  const baseLabel = tr(language, { ru: 'Базовые ноты', en: 'Base notes', it: 'Note di fondo', es: 'Notas de fondo', de: 'Basisnoten' });
  const topShort = tr(language, { ru: 'Верх', en: 'Top', it: 'Testa', es: 'Salida', de: 'Kopf' });
  const heartShort = tr(language, { ru: 'Сердце', en: 'Heart', it: 'Cuore', es: 'Corazón', de: 'Herz' });
  const baseShort = tr(language, { ru: 'База', en: 'Base', it: 'Fondo', es: 'Fondo', de: 'Basis' });
  const atWord = tr(language, { ru: 'на', en: 'at', it: 'a', es: 'a los', de: 'bei' });

  const entriesWithEvolution = useMemo(
    () => journal.filter((e) => e.scentEvolution && e.scentEvolution.length > 0),
    [journal]
  );

  const activeEntry = useMemo(() => {
    if (selectedEntryId) {
      const exact = journal.find((e) => e.id === selectedEntryId);
      if (exact) return exact;
    }
    return entriesWithEvolution[0] || journal[0] || null;
  }, [journal, selectedEntryId, entriesWithEvolution]);

  const compareEntry = useMemo(() => {
    if (!compareEntryId || !activeEntry || compareEntryId === activeEntry.id) return null;
    const found = entriesWithEvolution.find((e) => e.id === compareEntryId);
    return found || null;
  }, [compareEntryId, activeEntry, entriesWithEvolution]);

  const chartData = useMemo((): EvolutionTooltipRow[] => {
    if (!activeEntry?.scentEvolution || activeEntry.scentEvolution.length === 0) return [];
    const primarySorted = sortEvolutionPoints(activeEntry.scentEvolution);
    const compareSorted = compareEntry?.scentEvolution
      ? sortEvolutionPoints(compareEntry.scentEvolution)
      : [];

    const minuteSet = new Set<number>();
    primarySorted.forEach((p) => minuteSet.add(p.minutesFromApplication));
    compareSorted.forEach((p) => minuteSet.add(p.minutesFromApplication));

    const allMinutes = Array.from(minuteSet).sort((a, b) => a - b);
    const primaryByMin = new Map(primarySorted.map((p) => [p.minutesFromApplication, p]));
    const compareByMin = new Map(compareSorted.map((p) => [p.minutesFromApplication, p]));

    return allMinutes.map((mins) => {
      const p = primaryByMin.get(mins);
      const c = compareByMin.get(mins);
      return {
        minutes: mins,
        timeLabel: p?.timeLabel || c?.timeLabel || formatMinutesLabel(mins, language),
        top: p ? p.topIntensity : null,
        heart: p ? p.heartIntensity : null,
        base: p ? p.baseIntensity : null,
        impression: p?.impression,
        compareTop: c ? c.topIntensity : null,
        compareHeart: c ? c.heartIntensity : null,
        compareBase: c ? c.baseIntensity : null,
        compareImpression: c?.impression,
      };
    });
  }, [activeEntry, compareEntry, language]);

  const phaseInsights = useMemo(() => {
    const pts = activeEntry?.scentEvolution
      ? sortEvolutionPoints(activeEntry.scentEvolution)
      : [];
    if (pts.length === 0) return null;

    const peakTop = pts.reduce((best, p) => (p.topIntensity > best.topIntensity ? p : best), pts[0]);
    const peakHeart = pts.reduce(
      (best, p) => (p.heartIntensity > best.heartIntensity ? p : best),
      pts[0]
    );
    const peakBase = pts.reduce(
      (best, p) => (p.baseIntensity > best.baseIntensity ? p : best),
      pts[0]
    );
    const lastPoint = pts[pts.length - 1];
    const drydownRetention = Math.max(
      lastPoint.topIntensity,
      lastPoint.heartIntensity,
      lastPoint.baseIntensity
    );

    return { peakTop, peakHeart, peakBase, lastPoint, drydownRetention };
  }, [activeEntry]);

  const startEditing = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setDraftPoints(
      entry.scentEvolution && entry.scentEvolution.length > 0
        ? sortEvolutionPoints(entry.scentEvolution)
        : createDefaultEvolutionCheckpoints(language)
    );
  };

  const handleSaveDraft = () => {
    if (!editingEntryId) return;
    onSaveEntryEvolution(editingEntryId, sortEvolutionPoints(draftPoints));
    setEditingEntryId(null);
  };

  if (journal.length === 0) {
    return null;
  }

  const isEditingCurrent = Boolean(activeEntry && editingEntryId === activeEntry.id);
  const showTop = seriesFilter === 'all' || seriesFilter === 'top';
  const showHeart = seriesFilter === 'all' || seriesFilter === 'heart';
  const showBase = seriesFilter === 'all' || seriesFilter === 'base';

  return (
    <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[var(--theme-accent)]" />
            <h2 className="font-serif text-2xl font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Раскрытие аромата во времени',
                en: 'Scent Evolution Over Time',
                it: 'Evoluzione del profumo nel tempo',
                es: 'Evolución del aroma en el tiempo',
                de: 'Duftverlauf über die Zeit',
              })}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-[#6B6D68]">
            {tr(language, {
              ru: 'Динамика верхних, сердечных и базовых нот от старта до шлейфа по данным лабораторных проб.',
              en: 'Track how top, heart, and base notes shift from initial spray through the dry-down across lab trials.',
              it: 'Analizza come note di testa, cuore e fondo evolvono dallo spruzzo iniziale alla scia nelle prove di laboratorio.',
              es: 'Sigue cómo cambian las notas de salida, corazón y fondo desde la aplicación hasta el secado en cada prueba.',
              de: 'Verfolge die Entwicklung von Kopf-, Herz- und Basisnoten vom ersten Sprühstoß bis zum Fond.',
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeEntry?.id || ''}
            onChange={(e) => {
              onSelectEntry(e.target.value);
              setEditingEntryId(null);
            }}
            aria-label={tr(language, {
              ru: 'Выбрать пробу из журнала',
              en: 'Select journal trial',
              it: 'Seleziona prova dal diario',
              es: 'Seleccionar prueba del diario',
              de: 'Test aus dem Journal wählen',
            })}
            className="max-w-xs rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
          >
            {journal.map((entry) => {
              const hasCurve = Boolean(entry.scentEvolution && entry.scentEvolution.length > 0);
              return (
                <option key={entry.id} value={entry.id}>
                  {entry.date} · {entry.trialLabel}
                  {hasCurve
                    ? ''
                    : tr(language, {
                        ru: ' (нет графика)',
                        en: ' (no curve)',
                        it: ' (nessun grafico)',
                        es: ' (sin curva)',
                        de: ' (keine Kurve)',
                      })}
                </option>
              );
            })}
          </select>

          {entriesWithEvolution.length > 1 && activeEntry?.scentEvolution?.length ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2 py-1">
              <GitCompareArrows className="h-3.5 w-3.5 text-[#6B6D68]" />
              <select
                value={compareEntryId}
                onChange={(e) => setCompareEntryId(e.target.value)}
                aria-label={tr(language, {
                  ru: 'Сравнить с другой пробой',
                  en: 'Compare with another trial',
                  it: 'Confronta con un’altra prova',
                  es: 'Comparar con otra prueba',
                  de: 'Mit anderem Test vergleichen',
                })}
                className="bg-transparent text-xs text-[#181917] focus:outline-none max-w-[180px]"
              >
                <option value="">
                  {tr(language, {
                    ru: 'Сравнение: не выбрано',
                    en: 'Compare trial: None',
                    it: 'Confronta prova: Nessuna',
                    es: 'Comparar prueba: Ninguna',
                    de: 'Vergleich: Keiner',
                  })}
                </option>
                {entriesWithEvolution
                  .filter((e) => e.id !== activeEntry.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.date} · {e.trialLabel}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}

          {activeEntry && !isEditingCurrent && (
            <button
              type="button"
              onClick={() => startEditing(activeEntry)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4D4CE] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#FAFBF9]"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>
                {activeEntry.scentEvolution?.length
                  ? tr(language, {
                      ru: 'Редактировать кривую',
                      en: 'Edit checkpoints',
                      it: 'Modifica punti',
                      es: 'Editar puntos',
                      de: 'Kurve bearbeiten',
                    })
                  : tr(language, {
                      ru: 'Записать раскрытие',
                      en: 'Record evolution',
                      it: 'Registra evoluzione',
                      es: 'Registrar evolución',
                      de: 'Verlauf erfassen',
                    })}
              </span>
            </button>
          )}
        </div>
      </div>

      {activeEntry && isEditingCurrent && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Редактирование кривой раскрытия:',
                en: 'Editing scent evolution:',
                it: 'Modifica evoluzione olfattiva:',
                es: 'Editando evolución olfativa:',
                de: 'Duftverlauf bearbeiten:',
              })}{' '}
              {activeEntry.trialLabel}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingEntryId(null)}
                className="rounded-md border border-[#D4D4CE] bg-white px-3 py-1 text-xs font-medium text-[#575955] hover:bg-[#FAFBF9]"
              >
                {tr(language, {
                  ru: 'Отмена',
                  en: 'Cancel',
                  it: 'Annulla',
                  es: 'Cancelar',
                  de: 'Abbrechen',
                })}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-md bg-[var(--theme-accent)] px-3 py-1 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                {tr(language, {
                  ru: 'Сохранить кривую',
                  en: 'Save Curve',
                  it: 'Salva curva',
                  es: 'Guardar curva',
                  de: 'Kurve speichern',
                })}
              </button>
            </div>
          </div>
          <ScentEvolutionEditor
            points={draftPoints}
            onChange={setDraftPoints}
            language={language}
          />
        </div>
      )}

      {!isEditingCurrent && activeEntry && chartData.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#575955]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NOTE_EVOLUTION_COLORS.top }}
                />
                <span>{topLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NOTE_EVOLUTION_COLORS.heart }}
                />
                <span>{heartLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: NOTE_EVOLUTION_COLORS.base }}
                />
                <span>{baseLabel}</span>
              </span>
              {compareEntry && (
                <span className="text-[11px] text-[#6B6D68]">
                  {tr(language, {
                    ru: `Пунктир = ${compareEntry.trialLabel}`,
                    en: `Dashed lines = ${compareEntry.trialLabel}`,
                    it: `Tratteggiato = ${compareEntry.trialLabel}`,
                    es: `Línea discontinua = ${compareEntry.trialLabel}`,
                    de: `Gestrichelt = ${compareEntry.trialLabel}`,
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
              {(
                [
                  {
                    id: 'all',
                    label: tr(language, {
                      ru: 'Все',
                      en: 'All',
                      it: 'Tutte',
                      es: 'Todas',
                      de: 'Alle',
                    }),
                  },
                  { id: 'top', label: topShort },
                  { id: 'heart', label: heartShort },
                  { id: 'base', label: baseShort },
                ] as { id: SeriesFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSeriesFilter(tab.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium ${
                    seriesFilter === tab.id ? 'bg-white text-[#181917]' : 'text-[#575955]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {compareEntry ? (
                <LineChart data={chartData} margin={{ top: 10, right: 16, left: -14, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fontSize: 12, fill: '#575955' }}
                    axisLine={{ stroke: '#E4E4E0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fontSize: 11, fill: '#6B6D68' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <ScentEvolutionTooltip
                        language={language}
                        primaryLabel={activeEntry.trialLabel}
                        compareLabel={compareEntry.trialLabel}
                      />
                    }
                  />
                  {showTop && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="top"
                        name={topShort}
                        stroke={NOTE_EVOLUTION_COLORS.top}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.top }}
                        activeDot={{ r: 5 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="compareTop"
                        stroke={NOTE_EVOLUTION_COLORS.top}
                        strokeWidth={1.75}
                        strokeDasharray="5 4"
                        strokeOpacity={0.65}
                        dot={{ r: 2.5 }}
                        connectNulls
                      />
                    </>
                  )}
                  {showHeart && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="heart"
                        name={heartShort}
                        stroke={NOTE_EVOLUTION_COLORS.heart}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.heart }}
                        activeDot={{ r: 5 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="compareHeart"
                        stroke={NOTE_EVOLUTION_COLORS.heart}
                        strokeWidth={1.75}
                        strokeDasharray="5 4"
                        strokeOpacity={0.65}
                        dot={{ r: 2.5 }}
                        connectNulls
                      />
                    </>
                  )}
                  {showBase && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="base"
                        name={baseShort}
                        stroke={NOTE_EVOLUTION_COLORS.base}
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.base }}
                        activeDot={{ r: 5 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="compareBase"
                        stroke={NOTE_EVOLUTION_COLORS.base}
                        strokeWidth={1.75}
                        strokeDasharray="5 4"
                        strokeOpacity={0.65}
                        dot={{ r: 2.5 }}
                        connectNulls
                      />
                    </>
                  )}
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -14, bottom: 4 }}>
                  <defs>
                    <linearGradient id="evoTopGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NOTE_EVOLUTION_COLORS.top} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={NOTE_EVOLUTION_COLORS.top} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="evoHeartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NOTE_EVOLUTION_COLORS.heart} stopOpacity={0.26} />
                      <stop offset="95%" stopColor={NOTE_EVOLUTION_COLORS.heart} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="evoBaseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NOTE_EVOLUTION_COLORS.base} stopOpacity={0.26} />
                      <stop offset="95%" stopColor={NOTE_EVOLUTION_COLORS.base} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fontSize: 12, fill: '#575955' }}
                    axisLine={{ stroke: '#E4E4E0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fontSize: 11, fill: '#6B6D68' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <ScentEvolutionTooltip
                        language={language}
                        primaryLabel={activeEntry.trialLabel}
                      />
                    }
                  />
                  {showTop && (
                    <Area
                      type="monotone"
                      dataKey="top"
                      name={topShort}
                      stroke={NOTE_EVOLUTION_COLORS.top}
                      strokeWidth={2.5}
                      fill="url(#evoTopGrad)"
                      dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.top }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  )}
                  {showHeart && (
                    <Area
                      type="monotone"
                      dataKey="heart"
                      name={heartShort}
                      stroke={NOTE_EVOLUTION_COLORS.heart}
                      strokeWidth={2.5}
                      fill="url(#evoHeartGrad)"
                      dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.heart }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  )}
                  {showBase && (
                    <Area
                      type="monotone"
                      dataKey="base"
                      name={baseShort}
                      stroke={NOTE_EVOLUTION_COLORS.base}
                      strokeWidth={2.5}
                      fill="url(#evoBaseGrad)"
                      dot={{ r: 3.5, fill: NOTE_EVOLUTION_COLORS.base }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {phaseInsights && (
            <div className="grid grid-cols-2 gap-4 border-t border-[#EAEAE6] pt-4 sm:grid-cols-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Пик верха',
                    en: 'Opening Peak',
                    it: 'Picco testa',
                    es: 'Pico de salida',
                    de: 'Kopf-Peak',
                  })}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#B45309]">
                    {phaseInsights.peakTop.topIntensity}/10
                  </span>
                  <span className="text-xs text-[#6B6D68]">
                    {atWord} {phaseInsights.peakTop.timeLabel}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Пик сердца',
                    en: 'Heart Peak',
                    it: 'Picco cuore',
                    es: 'Pico de corazón',
                    de: 'Herz-Peak',
                  })}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#1D4ED8]">
                    {phaseInsights.peakHeart.heartIntensity}/10
                  </span>
                  <span className="text-xs text-[#6B6D68]">
                    {atWord} {phaseInsights.peakHeart.timeLabel}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Пик базы',
                    en: 'Base Peak',
                    it: 'Picco fondo',
                    es: 'Pico de fondo',
                    de: 'Basis-Peak',
                  })}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#6D28D9]">
                    {phaseInsights.peakBase.baseIntensity}/10
                  </span>
                  <span className="text-xs text-[#6B6D68]">
                    {atWord} {phaseInsights.peakBase.timeLabel}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Финиш шлейфа',
                    en: 'Dry-down Horizon',
                    it: 'Orizzonte scia',
                    es: 'Horizonte de secado',
                    de: 'Fond-Horizont',
                  })}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#181917]">
                    {phaseInsights.lastPoint.timeLabel}
                  </span>
                  <span className="text-xs text-[#6B6D68]">
                    ({phaseInsights.drydownRetention}/10)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeEntry.scentEvolution && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {sortEvolutionPoints(activeEntry.scentEvolution).map((pt) => (
                <div
                  key={pt.id}
                  className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#181917]">
                      {pt.timeLabel}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#6B6D68]">
                      {pt.topIntensity}/{pt.heartIntensity}/{pt.baseIntensity}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pt.topIntensity * 10}%`,
                          backgroundColor: NOTE_EVOLUTION_COLORS.top,
                        }}
                      />
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pt.heartIntensity * 10}%`,
                          backgroundColor: NOTE_EVOLUTION_COLORS.heart,
                        }}
                      />
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pt.baseIntensity * 10}%`,
                          backgroundColor: NOTE_EVOLUTION_COLORS.base,
                        }}
                      />
                    </div>
                  </div>
                  {pt.impression && (
                    <p className="text-[11px] leading-snug text-[#575955]">{pt.impression}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : !isEditingCurrent && activeEntry ? (
        <div className="rounded-lg border border-dashed border-[#D4D4CE] bg-[#FAFBF9] py-8 px-4 text-center space-y-3">
          <p className="text-sm text-[#575955]">
            {tr(language, {
              ru: `Для записи «${activeEntry.trialLabel}» ещё не записаны точки раскрытия аромата.`,
              en: `Trial “${activeEntry.trialLabel}” does not have scent evolution checkpoints yet.`,
              it: `La prova “${activeEntry.trialLabel}” non ha ancora punti di evoluzione registrati.`,
              es: `La prueba “${activeEntry.trialLabel}” aún no tiene puntos de evolución registrados.`,
              de: `Für den Test „${activeEntry.trialLabel}“ wurden noch keine Verlaufspunkte erfasst.`,
            })}
          </p>
          <button
            type="button"
            onClick={() => startEditing(activeEntry)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {tr(language, {
                ru: 'Записать кривую раскрытия',
                en: 'Record Evolution Checkpoints',
                it: 'Registra punti di evoluzione',
                es: 'Registrar puntos de evolución',
                de: 'Verlaufspunkte erfassen',
              })}
            </span>
          </button>
        </div>
      ) : null}
    </section>
  );
}

interface ScentEvolutionMiniPreviewProps {
  points: ScentEvolutionPoint[];
  language: AppLanguage;
}

export function ScentEvolutionMiniPreview({
  points,
  language,
}: ScentEvolutionMiniPreviewProps) {
  const sorted = useMemo(() => sortEvolutionPoints(points), [points]);

  const data = useMemo(
    () =>
      sorted.map((pt) => ({
        timeLabel: pt.timeLabel || formatMinutesLabel(pt.minutesFromApplication, language),
        top: pt.topIntensity,
        heart: pt.heartIntensity,
        base: pt.baseIntensity,
      })),
    [sorted, language]
  );

  if (data.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B6D68]">
        <span className="font-medium text-[#3F413D]">
          {tr(language, {
            ru: 'Динамика раскрытия',
            en: 'Scent Evolution Curve',
            it: 'Curva di evoluzione',
            es: 'Curva de evolución',
            de: 'Duftverlaufskurve',
          })}
        </span>
        <span className="font-mono tabular-nums">
          {sorted
            .map((p) => `${p.timeLabel}: ${p.topIntensity}/${p.heartIntensity}/${p.baseIntensity}`)
            .join(' · ')}
        </span>
      </div>
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 6, left: -26, bottom: 0 }}>
            <XAxis
              dataKey="timeLabel"
              tick={{ fontSize: 10, fill: '#6B6D68' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 5, 10]}
              tick={{ fontSize: 9, fill: '#8B8D87' }}
              axisLine={false}
              tickLine={false}
            />
            <Area
              type="monotone"
              dataKey="top"
              stroke={NOTE_EVOLUTION_COLORS.top}
              strokeWidth={1.75}
              fill={NOTE_EVOLUTION_COLORS.top}
              fillOpacity={0.12}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="heart"
              stroke={NOTE_EVOLUTION_COLORS.heart}
              strokeWidth={1.75}
              fill={NOTE_EVOLUTION_COLORS.heart}
              fillOpacity={0.1}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="base"
              stroke={NOTE_EVOLUTION_COLORS.base}
              strokeWidth={1.75}
              fill={NOTE_EVOLUTION_COLORS.base}
              fillOpacity={0.1}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
