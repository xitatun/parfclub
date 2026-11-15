import { Calculator, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getCurrencySymbol, getNoteTierShort } from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  FormulaComponent,
  Ingredient,
  NoteTier,
  PerfumeProject,
} from '../types/perfume';
import { formatCurrencyDecimal, formatCurrencyRub, formatPercent } from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';

interface CalcRow {
  id: string;
  ingredientId?: string;
  name: string;
  tier: NoteTier;
  volumeOrGrams: number;
  unitPrice: number;
  dilutionPercent: number;
}

type CalcMode = 'proportional' | 'direct';

interface BottleCostCalculatorProps {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  language: AppLanguage;
  currency: AppCurrency;
  lockedProjectId?: string;
  onUpdateProject?: (updated: PerfumeProject) => void;
  onAppliedToast?: (message: string) => void;
}

const BOTTLE_PRESETS_ML = [10, 15, 30, 50, 100];

function buildRowsFromProject(project: PerfumeProject | undefined): CalcRow[] {
  if (!project) return [];
  return project.components.map((c) => ({
    id: c.id,
    ingredientId: c.ingredientId,
    name: c.name,
    tier: c.tier,
    volumeOrGrams: Number(c.weightGrams) || 0,
    unitPrice: Number(c.costPerGram) || 0,
    dilutionPercent: Number(c.dilutionPercent) || 100,
  }));
}

export function BottleCostCalculator({
  projects,
  ingredients,
  language,
  currency,
  lockedProjectId,
  onUpdateProject,
  onAppliedToast,
}: BottleCostCalculatorProps) {
  const gUnit = language === 'ru' ? 'г' : 'g';
  const mlUnit = language === 'ru' ? 'мл' : 'ml';
  const pcsUnit = tr(language, { ru: 'шт.', en: 'pcs', it: 'pz', es: 'uds', de: 'Stk.' });
  const currencySymbol = getCurrencySymbol(currency);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    lockedProjectId || projects[0]?.id || ''
  );

  const activeProject = useMemo(
    () => projects.find((p) => p.id === (lockedProjectId || selectedProjectId)),
    [projects, lockedProjectId, selectedProjectId]
  );

  const [calcMode, setCalcMode] = useState<CalcMode>('proportional');
  const [bottleMl, setBottleMl] = useState<number>(activeProject?.targetBottleMl || 30);
  const [density, setDensity] = useState<number>(0.85);
  const [bottleVesselCost, setBottleVesselCost] = useState<number>(
    activeProject?.packagingCostPerUnit ?? 250
  );
  const [extraPackagingCost, setExtraPackagingCost] = useState<number>(0);
  const [batchQuantity, setBatchQuantity] = useState<number>(1);
  const [retailPrice, setRetailPrice] = useState<number>(4200);
  const [rows, setRows] = useState<CalcRow[]>(() => buildRowsFromProject(activeProject));
  const [hasUnsavedSimChanges, setHasUnsavedSimChanges] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const [newIngId, setNewIngId] = useState('');
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState<NoteTier>('heart');
  const [newVolume, setNewVolume] = useState('1.5');
  const [newUnitPrice, setNewUnitPrice] = useState('120');

  const syncFromProject = (proj: PerfumeProject | undefined) => {
    if (!proj) {
      setRows([]);
      setBottleMl(30);
      setBottleVesselCost(250);
      setExtraPackagingCost(0);
      setHasUnsavedSimChanges(false);
      return;
    }
    setRows(buildRowsFromProject(proj));
    setBottleMl(proj.targetBottleMl || 30);
    setBottleVesselCost(Math.max(0, Number(proj.packagingCostPerUnit) || 0));
    setExtraPackagingCost(0);
    setHasUnsavedSimChanges(false);
  };

  useEffect(() => {
    if (lockedProjectId) {
      setSelectedProjectId(lockedProjectId);
      const proj = projects.find((p) => p.id === lockedProjectId);
      syncFromProject(proj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedProjectId]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (!projectId) {
      syncFromProject(undefined);
      return;
    }
    const proj = projects.find((p) => p.id === projectId);
    syncFromProject(proj);
  };

  const handleRowChange = (id: string, patch: Partial<CalcRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setHasUnsavedSimChanges(true);
    setJustApplied(false);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setHasUnsavedSimChanges(true);
    setJustApplied(false);
  };

  const handleSelectCatalogIngredient = (ingId: string) => {
    setNewIngId(ingId);
    const ing = ingredients.find((i) => i.id === ingId);
    if (!ing) return;
    setNewName(ing.name);
    setNewTier(ing.tier);
    const unitPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setNewUnitPrice(unitPrice.toFixed(2));
  };

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const ing = ingredients.find((i) => i.id === newIngId);
    setRows((prev) => [
      ...prev,
      {
        id: generateId('calc'),
        ingredientId: newIngId || undefined,
        name: newName.trim(),
        tier: newTier,
        volumeOrGrams: Math.max(0, Number(newVolume) || 0),
        unitPrice: Math.max(0, Number(newUnitPrice) || 0),
        dilutionPercent: ing?.dilutionPercent || 100,
      },
    ]);
    setNewIngId('');
    setNewName('');
    setNewVolume('1.0');
    setHasUnsavedSimChanges(true);
    setJustApplied(false);
  };

  const handleScaleRowsToBottle = () => {
    const totalMass = rows.reduce((s, r) => s + Math.max(0, r.volumeOrGrams), 0);
    const targetMass = Math.max(0.1, bottleMl) * Math.max(0.5, density);
    if (totalMass <= 0) return;
    const ratio = targetMass / totalMass;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        volumeOrGrams: Number((Math.max(0, r.volumeOrGrams) * ratio).toFixed(3)),
      }))
    );
    setHasUnsavedSimChanges(true);
    setJustApplied(false);
  };

  const handleApplyToProject = () => {
    if (!activeProject || !onUpdateProject) return;
    const existingMap = new Map(activeProject.components.map((c) => [c.id, c]));
    const updatedComponents: FormulaComponent[] = rows.map((r) => {
      const prev = existingMap.get(r.id);
      const ing = r.ingredientId ? ingredients.find((i) => i.id === r.ingredientId) : undefined;
      return {
        id: prev ? prev.id : generateId('fc'),
        ingredientId: r.ingredientId || prev?.ingredientId,
        name: r.name,
        tier: r.tier,
        family: prev?.family || ing?.family || 'woody',
        dilutionPercent: prev?.dilutionPercent || r.dilutionPercent || 100,
        weightGrams: Number(Math.max(0, r.volumeOrGrams).toFixed(3)),
        costPerGram: Number(Math.max(0, r.unitPrice).toFixed(2)),
        note: prev?.note,
      };
    });

    onUpdateProject({
      ...activeProject,
      targetBottleMl: Math.max(1, Math.round(bottleMl)),
      packagingCostPerUnit: Math.max(0, Math.round(bottleVesselCost + extraPackagingCost)),
      components: updatedComponents,
      updatedAt: todayIsoDate(),
    });
    setHasUnsavedSimChanges(false);
    setJustApplied(true);
    onAppliedToast?.(
      tr(language, {
        ru: `Данные проекта «${activeProject.title}» обновлены из калькулятора`,
        en: `Updated "${activeProject.title}" formula & packaging from calculator`,
        it: `Formula e confezionamento di "${activeProject.title}" aggiornati dal calcolatore`,
        es: `Fórmula y envase de "${activeProject.title}" actualizados desde la calculadora`,
        de: `Formel & Verpackung von "${activeProject.title}" über den Rechner aktualisiert`,
      })
    );
  };

  const calc = useMemo(() => {
    let formulaMass = 0;
    let formulaRawCost = 0;
    let pureAromaticMass = 0;

    for (const r of rows) {
      const qty = Math.max(0, Number(r.volumeOrGrams) || 0);
      const price = Math.max(0, Number(r.unitPrice) || 0);
      formulaMass += qty;
      formulaRawCost += qty * price;
      if (r.tier !== 'solvent') {
        pureAromaticMass += qty * (Math.min(100, Math.max(0, r.dilutionPercent)) / 100);
      }
    }

    const safeDensity = Math.max(0.5, Math.min(1.5, Number(density) || 0.85));
    const safeBottleMl = Math.max(1, Number(bottleMl) || 30);
    const targetLiquidGrams = safeBottleMl * safeDensity;
    const costPerGram = formulaMass > 0 ? formulaRawCost / formulaMass : 0;

    const scaleFactor =
      calcMode === 'proportional' && formulaMass > 0 ? targetLiquidGrams / formulaMass : 1;

    const bottleLiquidCost =
      calcMode === 'proportional' ? costPerGram * targetLiquidGrams : formulaRawCost;
    const bottleLiquidGrams = calcMode === 'proportional' ? targetLiquidGrams : formulaMass;
    const costPerMl = safeBottleMl > 0 ? bottleLiquidCost / safeBottleMl : 0;

    const packagingTotal =
      Math.max(0, Number(bottleVesselCost) || 0) + Math.max(0, Number(extraPackagingCost) || 0);
    const totalBottleCost = bottleLiquidCost + packagingTotal;

    const safeBatchQty = Math.max(1, Math.round(Number(batchQuantity) || 1));
    const totalBatchCost = totalBottleCost * safeBatchQty;
    const totalBatchLiquidGrams = bottleLiquidGrams * safeBatchQty;

    const safeRetail = Math.max(0, Number(retailPrice) || 0);
    const profitPerBottle = safeRetail - totalBottleCost;
    const marginPercent = safeRetail > 0 ? (profitPerBottle / safeRetail) * 100 : 0;
    const markupPercent = totalBottleCost > 0 ? (profitPerBottle / totalBottleCost) * 100 : 0;
    const concentrationPct = formulaMass > 0 ? (pureAromaticMass / formulaMass) * 100 : 0;

    const liquidSharePct = totalBottleCost > 0 ? (bottleLiquidCost / totalBottleCost) * 100 : 0;
    const packagingSharePct = totalBottleCost > 0 ? (packagingTotal / totalBottleCost) * 100 : 0;

    return {
      formulaMass,
      formulaRawCost,
      costPerGram,
      scaleFactor,
      bottleLiquidCost,
      bottleLiquidGrams,
      costPerMl,
      packagingTotal,
      totalBottleCost,
      totalBatchCost,
      totalBatchLiquidGrams,
      profitPerBottle,
      marginPercent,
      markupPercent,
      concentrationPct,
      liquidSharePct,
      packagingSharePct,
      safeBatchQty,
    };
  }, [
    rows,
    density,
    bottleMl,
    calcMode,
    bottleVesselCost,
    extraPackagingCost,
    batchQuantity,
    retailPrice,
  ]);

  return (
    <section className="rounded-xl border border-[#E4E4E0] bg-white p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-[#EAEAE6] pb-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] shrink-0">
            <Calculator className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Интерактивный калькулятор стоимости флакона',
                en: 'Interactive Bottle Cost Calculator',
                it: 'Calcolatore interattivo costo flacone',
                es: 'Calculadora interactiva de costo por frasco',
                de: 'Interaktiver Flakonkosten-Rechner',
              })}
            </h2>
            <p className="mt-0.5 text-xs text-[#6B6D68]">
              {tr(language, {
                ru: 'Меняйте объёмы ингредиентов, цены компонентов, формат флакона и тару — себестоимость флакона пересчитывается мгновенно.',
                en: 'Adjust component volumes, raw material prices, bottle size, and packaging — bottle cost recalculates instantly.',
                it: 'Modifica quantità, prezzi delle materie prime, formato del flacone e packaging: il costo unitario si aggiorna all’istante.',
                es: 'Ajusta volúmenes, precios de ingredientes, formato del frasco y envase: el costo se recalcula al instante.',
                de: 'Passe Mengen, Rohstoffpreise, Flakongröße und Verpackung an — die Flakonkosten werden sofort neu berechnet.',
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!lockedProjectId && (
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              aria-label={tr(language, {
                ru: 'Выбрать проект для расчёта',
                en: 'Select project for calculation',
                it: 'Seleziona progetto per il calcolo',
                es: 'Seleccionar proyecto para el cálculo',
                de: 'Projekt für Berechnung wählen',
              })}
              className="rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-2 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="">
                {tr(language, {
                  ru: 'Свободный расчёт (с нуля)',
                  en: 'Custom formula (scratch)',
                  it: 'Calcolo libero (da zero)',
                  es: 'Cálculo libre (desde cero)',
                  de: 'Freie Berechnung (von Grund auf)',
                })}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title}
                </option>
              ))}
            </select>
          )}

          {activeProject && hasUnsavedSimChanges && (
            <button
              type="button"
              onClick={() => syncFromProject(activeProject)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-xs font-medium text-[#575955] hover:bg-[#F7F7F5] hover:text-[#181917]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Сбросить',
                  en: 'Reset to project',
                  it: 'Ripristina progetto',
                  es: 'Restablecer',
                  de: 'Zurücksetzen',
                })}
              </span>
            </button>
          )}

          {activeProject && onUpdateProject && hasUnsavedSimChanges && (
            <button
              type="button"
              onClick={handleApplyToProject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Применить к проекту',
                  en: 'Apply to project',
                  it: 'Applica al progetto',
                  es: 'Aplicar al proyecto',
                  de: 'Auf Projekt anwenden',
                })}
              </span>
            </button>
          )}

          {justApplied && !hasUnsavedSimChanges && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
              <Check className="h-3.5 w-3.5" />
              {tr(language, {
                ru: 'Сохранено в проекте',
                en: 'Saved to project',
                it: 'Salvato nel progetto',
                es: 'Guardado en el proyecto',
                de: 'Im Projekt gespeichert',
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] p-4">
          <div className="text-xs font-medium text-[#575955]">
            {tr(language, {
              ru: `Себестоимость 1 флакона (${bottleMl} ${mlUnit})`,
              en: `Total Cost per 1 Bottle (${bottleMl} ${mlUnit})`,
              it: `Costo totale per 1 flacone (${bottleMl} ${mlUnit})`,
              es: `Costo total por 1 frasco (${bottleMl} ${mlUnit})`,
              de: `Gesamtkosten pro Flakon (${bottleMl} ${mlUnit})`,
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[var(--theme-accent)]">
            {formatCurrencyDecimal(calc.totalBottleCost, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#575955] tabular-nums">
            {tr(language, { ru: 'Сырьё', en: 'Liquid', it: 'Liquido', es: 'Líquido', de: 'Flüssigkeit' })}
            : {formatPercent(calc.liquidSharePct, 0)} ·{' '}
            {tr(language, { ru: 'Тара', en: 'Packaging', it: 'Packaging', es: 'Envase', de: 'Verpackung' })}
            : {formatPercent(calc.packagingSharePct, 0)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4">
          <div className="text-xs text-[#6B6D68]">
            {tr(language, {
              ru: 'Ароматическая смесь (жидкость)',
              en: 'Liquid / Fragrance Cost',
              it: 'Miscela aromatica (liquido)',
              es: 'Mezcla aromática (líquido)',
              de: 'Duftmischung (Flüssigkeit)',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
            {formatCurrencyDecimal(calc.bottleLiquidCost, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#6B6D68] tabular-nums">
            {calc.bottleLiquidGrams.toFixed(2)} {gUnit} ·{' '}
            {formatCurrencyDecimal(calc.costPerMl, language, currency)}/{mlUnit} ·{' '}
            {tr(language, { ru: 'конц.', en: 'conc.', it: 'conc.', es: 'conc.', de: 'Konz.' })}{' '}
            {formatPercent(calc.concentrationPct, 1)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4">
          <div className="text-xs text-[#6B6D68]">
            {tr(language, {
              ru: `Себестоимость партии (${calc.safeBatchQty} ${pcsUnit})`,
              en: `Batch Production (${calc.safeBatchQty} ${pcsUnit})`,
              it: `Costo lotto (${calc.safeBatchQty} ${pcsUnit})`,
              es: `Costo del lote (${calc.safeBatchQty} ${pcsUnit})`,
              de: `Chargenkosten (${calc.safeBatchQty} ${pcsUnit})`,
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#181917]">
            {formatCurrencyRub(calc.totalBatchCost, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#6B6D68] tabular-nums">
            {tr(language, {
              ru: 'Всего смеси',
              en: 'Total mixture needed',
              it: 'Miscela totale',
              es: 'Mezcla total',
              de: 'Gesamte Mischung',
            })}
            : {calc.totalBatchLiquidGrams.toFixed(1)} {gUnit}
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E4E0] bg-[#FAFBF9] p-4">
          <div className="text-xs text-[#6B6D68]">
            {tr(language, {
              ru: 'Прибыль и маржа (при рознице)',
              en: 'Net Profit & Margin (at retail)',
              it: 'Utile netto e margine (al dettaglio)',
              es: 'Beneficio neto y margen (venta)',
              de: 'Gewinn & Marge (UVP)',
            })}
          </div>
          <div
            className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${
              calc.profitPerBottle >= 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'
            }`}
          >
            {calc.profitPerBottle >= 0 ? '+' : ''}
            {formatCurrencyRub(calc.profitPerBottle, language, currency)}
          </div>
          <div className="mt-1.5 text-[11px] text-[#6B6D68] tabular-nums">
            {tr(language, { ru: 'Маржа', en: 'Margin', it: 'Margine', es: 'Margen', de: 'Marge' })}:{' '}
            {formatPercent(calc.marginPercent, 1)} ·{' '}
            {tr(language, { ru: 'Наценка', en: 'Markup', it: 'Ricarico', es: 'Recargo', de: 'Aufschlag' })}
            : {formatPercent(calc.markupPercent, 0)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#6B6D68]">
              {tr(language, {
                ru: 'Режим расчёта объёмов',
                en: 'Calculation Mode',
                it: 'Modalità di calcolo',
                es: 'Modo de cálculo',
                de: 'Berechnungsmodus',
              })}
            </div>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
              <button
                type="button"
                onClick={() => setCalcMode('proportional')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  calcMode === 'proportional'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'Пропорционально объёму флакона (мл)',
                  en: 'Scale proportionally to bottle (ml)',
                  it: 'Scala proporzionalmente al flacone (ml)',
                  es: 'Escalar proporcionalmente al frasco (ml)',
                  de: 'Proportional auf Flakonvolumen (ml) skalieren',
                })}
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('direct')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  calcMode === 'direct'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'Прямая сумма строк (введённые граммы)',
                  en: 'Direct row sum (1 batch = 1 bottle)',
                  it: 'Somma diretta righe (1 lotto = 1 flacone)',
                  es: 'Suma directa de filas (1 lote = 1 frasco)',
                  de: 'Direkte Zeilensumme (1 Ansatz = 1 Flakon)',
                })}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#6B6D68]">
              {tr(language, {
                ru: 'Быстрый выбор объёма флакона',
                en: 'Quick Bottle Volume',
                it: 'Formato rapido flacone',
                es: 'Tamaño rápido de frasco',
                de: 'Schnellwahl Flakongröße',
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {BOTTLE_PRESETS_ML.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => {
                    setBottleMl(ml);
                    setHasUnsavedSimChanges(true);
                  }}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs tabular-nums transition-colors ${
                    bottleMl === ml
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                      : 'border-[#E4E4E0] bg-white text-[#181917] hover:bg-[#F3F2F1]'
                  }`}
                >
                  {ml} {mlUnit}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end">
          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Объём флакона (мл)',
                en: 'Bottle Volume (ml)',
                it: 'Volume flacone (ml)',
                es: 'Volumen frasco (ml)',
                de: 'Flakonvolumen (ml)',
              })}
            </label>
            <input
              type="number"
              min={1}
              step="1"
              value={bottleMl}
              onChange={(e) => {
                setBottleMl(Math.max(1, Number(e.target.value) || 1));
                setHasUnsavedSimChanges(true);
              }}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Плотность (г/мл)',
                en: 'Density (g/ml)',
                it: 'Densità (g/ml)',
                es: 'Densidad (g/ml)',
                de: 'Dichte (g/ml)',
              })}
            </label>
            <input
              type="number"
              min={0.5}
              max={1.5}
              step="0.01"
              value={density}
              onChange={(e) => setDensity(Math.max(0.5, Math.min(1.5, Number(e.target.value) || 0.85)))}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: `Флакон и спрей (${currencySymbol})`,
                en: `Bottle & Pump (${currencySymbol})`,
                it: `Flacone e spray (${currencySymbol})`,
                es: `Frasco y atomizador (${currencySymbol})`,
                de: `Flakon & Zerstäuber (${currencySymbol})`,
              })}
            </label>
            <input
              type="number"
              min={0}
              step="5"
              value={bottleVesselCost}
              onChange={(e) => {
                setBottleVesselCost(Math.max(0, Number(e.target.value) || 0));
                setHasUnsavedSimChanges(true);
              }}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: `Коробка и этикетка (${currencySymbol})`,
                en: `Box & Label (${currencySymbol})`,
                it: `Scatola ed etichetta (${currencySymbol})`,
                es: `Caja y etiqueta (${currencySymbol})`,
                de: `Karton & Etikett (${currencySymbol})`,
              })}
            </label>
            <input
              type="number"
              min={0}
              step="5"
              value={extraPackagingCost}
              onChange={(e) => {
                setExtraPackagingCost(Math.max(0, Number(e.target.value) || 0));
                setHasUnsavedSimChanges(true);
              }}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Тираж (флаконов)',
                en: 'Batch Qty (pcs)',
                it: 'Lotto (pz)',
                es: 'Lote (uds)',
                de: 'Auflage (Stk.)',
              })}
            </label>
            <input
              type="number"
              min={1}
              step="1"
              value={batchQuantity}
              onChange={(e) => setBatchQuantity(Math.max(1, Math.round(Number(e.target.value) || 1)))}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: `Цена продажи (${currencySymbol})`,
                en: `Retail Price (${currencySymbol})`,
                it: `Prezzo al pubblico (${currencySymbol})`,
                es: `Precio de venta (${currencySymbol})`,
                de: `Verkaufspreis (${currencySymbol})`,
              })}
            </label>
            <input
              type="number"
              min={0}
              step="50"
              value={retailPrice}
              onChange={(e) => setRetailPrice(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-[#181917]">
            {tr(language, {
              ru: `Компоненты расчёта (${rows.length}) — меняйте объём или цену прямо в таблице`,
              en: `Formula Components (${rows.length}) — edit volumes or prices below`,
              it: `Componenti del calcolo (${rows.length}) — modifica quantità o prezzi nella tabella`,
              es: `Componentes del cálculo (${rows.length}) — edita volúmenes o precios abajo`,
              de: `Berechnungskomponenten (${rows.length}) — Mengen oder Preise direkt bearbeiten`,
            })}
          </div>
          {rows.length > 0 && calc.formulaMass > 0 && (
            <button
              type="button"
              onClick={handleScaleRowsToBottle}
              className="text-xs font-medium text-[var(--theme-accent)] hover:underline"
            >
              {tr(language, {
                ru: `Подогнать граммовки строк под ${(bottleMl * density).toFixed(1)} ${gUnit} (${bottleMl} ${mlUnit})`,
                en: `Normalize row weights to ${(bottleMl * density).toFixed(1)} ${gUnit} (${bottleMl} ${mlUnit})`,
                it: `Adatta i pesi delle righe a ${(bottleMl * density).toFixed(1)} ${gUnit} (${bottleMl} ${mlUnit})`,
                es: `Ajustar pesos de filas a ${(bottleMl * density).toFixed(1)} ${gUnit} (${bottleMl} ${mlUnit})`,
                de: `Zeilengewichte auf ${(bottleMl * density).toFixed(1)} ${gUnit} (${bottleMl} ${mlUnit}) normieren`,
              })}
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E4E4E0]">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4E4E0] bg-[#FAFBF9] text-[11px] font-semibold text-[#6B6D68]">
                <th className="py-2.5 px-3">
                  {tr(language, {
                    ru: 'Компонент',
                    en: 'Component',
                    it: 'Componente',
                    es: 'Componente',
                    de: 'Komponente',
                  })}
                </th>
                <th className="py-2.5 px-2">
                  {tr(language, {
                    ru: 'Уровень',
                    en: 'Tier',
                    it: 'Livello',
                    es: 'Nivel',
                    de: 'Ebene',
                  })}
                </th>
                <th className="py-2.5 px-2 text-right">
                  {tr(language, {
                    ru: 'Объём / вес (г)',
                    en: 'Formula Qty (g / ml)',
                    it: 'Quantità (g / ml)',
                    es: 'Cantidad (g / ml)',
                    de: 'Menge (g / ml)',
                  })}
                </th>
                <th className="py-2.5 px-2 text-right">
                  {tr(language, {
                    ru: `Цена за 1 г (${currencySymbol})`,
                    en: `Price / unit (${currencySymbol})`,
                    it: `Prezzo / g (${currencySymbol})`,
                    es: `Precio / g (${currencySymbol})`,
                    de: `Preis / g (${currencySymbol})`,
                  })}
                </th>
                <th className="py-2.5 px-2 text-right">
                  {tr(language, {
                    ru: 'Доля %',
                    en: 'Share %',
                    it: 'Quota %',
                    es: 'Cuota %',
                    de: 'Anteil %',
                  })}
                </th>
                <th className="py-2.5 px-2 text-right">
                  {calcMode === 'proportional'
                    ? tr(language, {
                        ru: `В 1 флаконе (${bottleMl} ${mlUnit})`,
                        en: `In 1 Bottle (${bottleMl} ${mlUnit})`,
                        it: `In 1 flacone (${bottleMl} ${mlUnit})`,
                        es: `En 1 frasco (${bottleMl} ${mlUnit})`,
                        de: `Pro Flakon (${bottleMl} ${mlUnit})`,
                      })
                    : tr(language, {
                        ru: 'Стоимость',
                        en: 'Line Cost',
                        it: 'Costo riga',
                        es: 'Costo línea',
                        de: 'Zeilenkosten',
                      })}
                </th>
                <th className="py-2.5 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAE6]">
              {rows.map((row) => {
                const sharePct =
                  calc.formulaMass > 0 ? (row.volumeOrGrams / calc.formulaMass) * 100 : 0;
                const effectiveMassInBottle = row.volumeOrGrams * calc.scaleFactor;
                const rowBottleCost = effectiveMassInBottle * row.unitPrice;
                const costShare =
                  calc.bottleLiquidCost > 0 ? (rowBottleCost / calc.bottleLiquidCost) * 100 : 0;

                return (
                  <tr key={row.id} className="hover:bg-[#FAFBF9]">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleRowChange(row.id, { name: e.target.value })}
                        className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        value={row.tier}
                        onChange={(e) =>
                          handleRowChange(row.id, { tier: e.target.value as NoteTier })
                        }
                        className="rounded border border-[#E4E4E0] bg-white px-2 py-1 text-xs text-[#3F413D]"
                      >
                        {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((t) => (
                          <option key={t} value={t}>
                            {getNoteTierShort(t, language)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        min={0}
                        step="0.05"
                        value={row.volumeOrGrams}
                        onChange={(e) =>
                          handleRowChange(row.id, {
                            volumeOrGrams: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        aria-label={`${tr(language, { ru: 'Объём', en: 'Volume of', it: 'Volume di', es: 'Volumen de', de: 'Menge von' })} ${row.name}`}
                        className="w-24 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-right font-mono text-xs font-medium tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        min={0}
                        step="1"
                        value={row.unitPrice}
                        onChange={(e) =>
                          handleRowChange(row.id, {
                            unitPrice: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        aria-label={`${tr(language, { ru: 'Цена', en: 'Price of', it: 'Prezzo di', es: 'Precio de', de: 'Preis von' })} ${row.name}`}
                        className="w-24 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-[#6B6D68]">
                      {formatPercent(sharePct, 1)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums">
                      <div className="font-semibold text-[#181917]">
                        {formatCurrencyDecimal(rowBottleCost, language, currency)}
                      </div>
                      <div className="text-[10px] text-[#797775]">
                        {effectiveMassInBottle.toFixed(2)} {gUnit} · {formatPercent(costShare, 0)}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="rounded p-1.5 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                        aria-label={`${tr(language, { ru: 'Удалить', en: 'Remove', it: 'Rimuovi', es: 'Eliminar', de: 'Entfernen' })} ${row.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-[#787A74]">
                    {tr(language, {
                      ru: 'Добавьте компоненты ниже или выберите проект выше, чтобы рассчитать стоимость флакона.',
                      en: 'Add components below or select a project above to calculate bottle cost.',
                      it: 'Aggiungi componenti qui sotto o seleziona un progetto sopra per calcolare il costo del flacone.',
                      es: 'Añade componentes abajo o selecciona un proyecto arriba para calcular el costo del frasco.',
                      de: 'Füge unten Komponenten hinzu oder wähle oben ein Projekt, um die Flakonkosten zu berechnen.',
                    })}
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t border-[#E4E4E0] bg-[#FAFBF9] font-semibold text-[#181917]">
                  <td colSpan={2} className="py-2.5 px-3">
                    {tr(language, {
                      ru: 'Итого по сырью (жидкость)',
                      en: 'Formula Subtotal (Liquid)',
                      it: 'Subtotale formula (liquido)',
                      es: 'Subtotal fórmula (líquido)',
                      de: 'Zwischensumme Formel (Flüssigkeit)',
                    })}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                    {calc.formulaMass.toFixed(2)} {gUnit}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#6B6D68]">
                    ~{formatCurrencyDecimal(calc.costPerGram, language, currency)}/{gUnit}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums">100%</td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[var(--theme-accent)]">
                    {formatCurrencyDecimal(calc.bottleLiquidCost, language, currency)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <form
          onSubmit={handleAddRow}
          className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-6 items-end"
        >
          <div className="lg:col-span-2">
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Из базы ингредиентов',
                en: 'From catalog (optional)',
                it: 'Dal catalogo (opzionale)',
                es: 'Del catálogo (opcional)',
                de: 'Aus dem Katalog (optional)',
              })}
            </label>
            <select
              value={newIngId}
              onChange={(e) => handleSelectCatalogIngredient(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#3F413D]"
            >
              <option value="">
                {tr(language, {
                  ru: 'Выбрать для подстановки цены...',
                  en: 'Pick ingredient to fill price...',
                  it: 'Scegli ingrediente per inserire il prezzo...',
                  es: 'Elegir ingrediente para rellenar precio...',
                  de: 'Rohstoff wählen, um Preis zu übernehmen...',
                })}
              </option>
              {ingredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Компонент *',
                en: 'Component Name *',
                it: 'Componente *',
                es: 'Componente *',
                de: 'Komponente *',
              })}
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={tr(language, {
                ru: 'Напр.: Бергамот',
                en: 'e.g. Bergamot',
                it: 'es. Bergamotto',
                es: 'ej. Bergamota',
                de: 'z. B. Bergamotte',
              })}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: 'Объём (г)',
                en: 'Volume (g)',
                it: 'Quantità (g)',
                es: 'Volumen (g)',
                de: 'Menge (g)',
              })}
            </label>
            <input
              type="number"
              min={0}
              step="0.05"
              value={newVolume}
              onChange={(e) => setNewVolume(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#6B6D68] mb-1">
              {tr(language, {
                ru: `Цена (${currencySymbol}/${gUnit})`,
                en: `Price (${currencySymbol}/${gUnit})`,
                it: `Prezzo (${currencySymbol}/${gUnit})`,
                es: `Precio (${currencySymbol}/${gUnit})`,
                de: `Preis (${currencySymbol}/${gUnit})`,
              })}
            </label>
            <input
              type="number"
              min={0}
              step="0.5"
              value={newUnitPrice}
              onChange={(e) => setNewUnitPrice(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 font-mono text-xs tabular-nums text-[#181917]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap h-[30px]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {tr(language, {
                ru: 'Добавить',
                en: 'Add row',
                it: 'Aggiungi',
                es: 'Añadir',
                de: 'Hinzufügen',
              })}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
