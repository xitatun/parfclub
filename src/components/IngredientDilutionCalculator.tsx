import {
  Beaker,
  Check,
  Droplets,
  FlaskConical,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  formatUnit,
  getNoteTierShort,
  getOlfactoryFamilyShort,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  FormulaComponent,
  Ingredient,
  PerfumeProject,
} from '../types/perfume';
import { formatCurrencyDecimal, formatPercent } from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';

type CalcMode = 'target_total' | 'from_source';
type TargetUnit = 'g' | 'ml';
type SolventKey = 'ethanol96' | 'dpg' | 'ipm' | 'jojoba' | 'benzyl_benzoate' | 'custom';

interface SolventOption {
  key: SolventKey;
  density: number;
  labels: Record<AppLanguage, string>;
}

const SOLVENT_OPTIONS: SolventOption[] = [
  {
    key: 'ethanol96',
    density: 0.805,
    labels: {
      ru: 'Спирт 96% (Ethanol)',
      en: 'Ethanol 96%',
      it: 'Alcol etilico 96%',
      es: 'Alcohol 96%',
      de: 'Ethanol 96%',
    },
  },
  {
    key: 'dpg',
    density: 1.023,
    labels: {
      ru: 'ДПГ (DPG)',
      en: 'DPG (Dipropylene Glycol)',
      it: 'DPG (Dipropilenglicole)',
      es: 'DPG (Dipropilenglicol)',
      de: 'DPG (Dipropylenglycol)',
    },
  },
  {
    key: 'ipm',
    density: 0.853,
    labels: {
      ru: 'ИПМ (IPM)',
      en: 'IPM (Isopropyl Myristate)',
      it: 'IPM (Isopropil Miristato)',
      es: 'IPM (Miristato de Isopropilo)',
      de: 'IPM (Isopropylmyristat)',
    },
  },
  {
    key: 'jojoba',
    density: 0.87,
    labels: {
      ru: 'Масло жожоба / ФКМ',
      en: 'Jojoba / Fractionated Oil',
      it: 'Olio di Jojoba / Frazionato',
      es: 'Aceite de Jojoba / MCT',
      de: 'Jojoba- / Fraktioniertes Öl',
    },
  },
  {
    key: 'benzyl_benzoate',
    density: 1.118,
    labels: {
      ru: 'Бензилбензоат',
      en: 'Benzyl Benzoate',
      it: 'Benzil Benzoato',
      es: 'Benzoato de Bencilo',
      de: 'Benzylbenzoat',
    },
  },
  {
    key: 'custom',
    density: 0.85,
    labels: {
      ru: 'Свой растворитель',
      en: 'Custom Solvent',
      it: 'Solvente personalizzato',
      es: 'Disolvente propio',
      de: 'Eigenes Lösungsmittel',
    },
  },
];

const QUICK_SCENARIOS = [
  { label: '100% → 10%', from: 100, to: 10 },
  { label: '100% → 1%', from: 100, to: 1 },
  { label: '100% → 20%', from: 100, to: 20 },
  { label: '100% → 50%', from: 100, to: 50 },
  { label: '50% → 10%', from: 50, to: 10 },
  { label: '10% → 1%', from: 10, to: 1 },
];

const REFERENCE_CONCENTRATIONS = [50, 20, 10, 5, 1, 0.5, 0.1];

interface IngredientDilutionCalculatorProps {
  ingredients: Ingredient[];
  projects: PerfumeProject[];
  language: AppLanguage;
  currency: AppCurrency;
  activeProject?: PerfumeProject | null;
  onAddToProjectFormula?: (projectId: string, component: FormulaComponent) => void;
  onSaveDilutedIngredient?: (ingredient: Ingredient) => void;
  onToast?: (message: string) => void;
}

export function IngredientDilutionCalculator({
  ingredients,
  projects,
  language,
  currency,
  activeProject = null,
  onAddToProjectFormula,
  onSaveDilutedIngredient,
  onToast,
}: IngredientDilutionCalculatorProps) {
  const gUnit = formatUnit('г', language);
  const mlUnit = formatUnit('мл', language);

  const aromaticIngredients = useMemo(
    () =>
      ingredients
        .filter((i) => i.tier !== 'solvent')
        .sort((a, b) => a.name.localeCompare(b.name, language)),
    [ingredients, language]
  );

  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [mode, setMode] = useState<CalcMode>('target_total');
  const [targetUnit, setTargetUnit] = useState<TargetUnit>('g');

  const [sourceConc, setSourceConc] = useState<number>(100);
  const [targetConc, setTargetConc] = useState<number>(10);
  const [targetTotalInput, setTargetTotalInput] = useState<number>(10);
  const [sourceMassInput, setSourceMassInput] = useState<number>(1);

  const [solventKey, setSolventKey] = useState<SolventKey>('ethanol96');
  const [solventDensity, setSolventDensity] = useState<number>(0.805);
  const [substanceDensity, setSubstanceDensity] = useState<number>(0.96);
  const [solventCostPerGram, setSolventCostPerGram] = useState<number>(3);
  const [sourceCostPerGram, setSourceCostPerGram] = useState<number>(0);

  const [targetProjectId, setTargetProjectId] = useState<string>(
    activeProject?.id || projects[0]?.id || ''
  );
  const [savedFlag, setSavedFlag] = useState<'catalog' | 'formula' | null>(null);

  const selectedIngredient = useMemo(
    () => aromaticIngredients.find((i) => i.id === selectedIngredientId) || null,
    [aromaticIngredients, selectedIngredientId]
  );

  const handleSelectIngredient = (ingId: string) => {
    setSelectedIngredientId(ingId);
    setSavedFlag(null);
    const ing = aromaticIngredients.find((i) => i.id === ingId);
    if (!ing) return;
    setCustomName(ing.name);
    const c1 = Math.max(0.01, Math.min(100, ing.dilutionPercent || 100));
    setSourceConc(c1);
    if (c1 > 10) {
      setTargetConc(10);
    } else if (c1 > 1) {
      setTargetConc(1);
    } else {
      setTargetConc(Number((c1 / 10).toFixed(3)));
    }
    const unitPrice = ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
    setSourceCostPerGram(Number(unitPrice.toFixed(2)));
  };

  const handleSelectSolvent = (key: SolventKey) => {
    setSolventKey(key);
    const found = SOLVENT_OPTIONS.find((s) => s.key === key);
    if (found && key !== 'custom') {
      setSolventDensity(found.density);
    }
    setSavedFlag(null);
  };

  const handleReset = () => {
    setSelectedIngredientId('');
    setCustomName('');
    setMode('target_total');
    setTargetUnit('g');
    setSourceConc(100);
    setTargetConc(10);
    setTargetTotalInput(10);
    setSourceMassInput(1);
    setSolventKey('ethanol96');
    setSolventDensity(0.805);
    setSubstanceDensity(0.96);
    setSourceCostPerGram(0);
    setSavedFlag(null);
  };

  const safeC1 = Math.max(0.01, Math.min(100, Number(sourceConc) || 100));
  const safeC2 = Math.max(0.001, Math.min(safeC1, Number(targetConc) || 10));
  const safeSolventDens = Math.max(0.5, Math.min(1.8, Number(solventDensity) || 0.805));
  const safeSubstDens = Math.max(0.5, Math.min(1.8, Number(substanceDensity) || 0.96));

  const computeDilution = (c2Input: number) => {
    const c2 = Math.max(0.001, Math.min(safeC1, c2Input));
    const ratio = c2 / safeC1; // fraction of starting stock in final solution (by mass)

    let totalMass = 0;
    let sourceMass = 0;
    let solventMass = 0;

    if (mode === 'target_total') {
      const entered = Math.max(0.01, Number(targetTotalInput) || 10);
      if (targetUnit === 'g') {
        totalMass = entered;
      } else {
        // Convert target volume (ml) into mass using harmonic mixture density
        const invDens = ratio / safeSubstDens + (1 - ratio) / safeSolventDens;
        const mixDens = invDens > 0 ? 1 / invDens : safeSolventDens;
        totalMass = entered * mixDens;
      }
      sourceMass = totalMass * ratio;
      solventMass = Math.max(0, totalMass - sourceMass);
    } else {
      sourceMass = Math.max(0.001, Number(sourceMassInput) || 1);
      totalMass = ratio > 0 ? sourceMass / ratio : sourceMass;
      solventMass = Math.max(0, totalMass - sourceMass);
    }

    const pureActiveMass = sourceMass * (safeC1 / 100);
    const sourceMl = sourceMass / safeSubstDens;
    const solventMl = solventMass / safeSolventDens;
    const totalMl = sourceMl + solventMl;
    const dilutionFactor = c2 > 0 ? safeC1 / c2 : 1;
    const solventParts = Math.max(0, dilutionFactor - 1);

    const batchCost =
      sourceMass * Math.max(0, sourceCostPerGram) +
      solventMass * Math.max(0, solventCostPerGram);
    const costPerGram = totalMass > 0 ? batchCost / totalMass : 0;

    return {
      c2,
      sourceMass,
      pureActiveMass,
      solventMass,
      totalMass,
      sourceMl,
      solventMl,
      totalMl,
      sourceSharePct: totalMass > 0 ? (sourceMass / totalMass) * 100 : 0,
      solventSharePct: totalMass > 0 ? (solventMass / totalMass) * 100 : 0,
      dilutionFactor,
      solventParts,
      batchCost,
      costPerGram,
    };
  };

  const result = useMemo(
    () => computeDilution(safeC2),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mode,
      targetUnit,
      targetTotalInput,
      sourceMassInput,
      safeC1,
      safeC2,
      safeSolventDens,
      safeSubstDens,
      sourceCostPerGram,
      solventCostPerGram,
    ]
  );

  const referenceRows = useMemo(
    () =>
      REFERENCE_CONCENTRATIONS.filter((pct) => pct <= safeC1).map((pct) => ({
        pct,
        ...computeDilution(pct),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mode,
      targetUnit,
      targetTotalInput,
      sourceMassInput,
      safeC1,
      safeSolventDens,
      safeSubstDens,
      sourceCostPerGram,
      solventCostPerGram,
    ]
  );

  const activeSolvent = SOLVENT_OPTIONS.find((s) => s.key === solventKey)!;
  const resolvedBaseName =
    customName.trim() ||
    selectedIngredient?.name ||
    tr(language, {
      ru: 'Ароматическое вещество',
      en: 'Aromatic Material',
      it: 'Sostanza aromatica',
      es: 'Sustancia aromática',
      de: 'Duftstoff',
    });

  const formattedC2 = Number.isInteger(safeC2) ? String(safeC2) : safeC2.toFixed(1);
  const resolvedProjectId = activeProject?.id || targetProjectId;
  const resolvedProject = projects.find((p) => p.id === resolvedProjectId) || null;

  const handleSaveToCatalog = () => {
    if (!onSaveDilutedIngredient) return;
    const newIng: Ingredient = {
      id: generateId('ing'),
      name: `${resolvedBaseName} (${formattedC2}%)`,
      inciOrCas: selectedIngredient?.inciOrCas,
      family: selectedIngredient?.family || 'amber',
      tier: selectedIngredient?.tier || 'heart',
      origin: selectedIngredient?.origin || 'synthetic',
      status: 'in_stock',
      dilutionPercent: Number(safeC2.toFixed(2)),
      solventNote: `${formattedC2}% (${activeSolvent.labels[language]})`,
      unit: 'г',
      quantityGrams: Number(result.totalMass.toFixed(2)),
      remainingGrams: Number(result.totalMass.toFixed(2)),
      priceTotal: Number(result.batchCost.toFixed(2)),
      longevityLabel: selectedIngredient?.longevityLabel || '—',
      sillage: selectedIngredient?.sillage || 'moderate',
      ifraLimitPercent: selectedIngredient?.ifraLimitPercent,
      supplier: selectedIngredient?.supplier,
      olfactoryNotes:
        selectedIngredient?.olfactoryNotes ||
        tr(language, {
          ru: `Разведение ${safeC1}% → ${formattedC2}% в ${activeSolvent.labels[language]}`,
          en: `Dilution ${safeC1}% → ${formattedC2}% in ${activeSolvent.labels[language]}`,
          it: `Diluizione ${safeC1}% → ${formattedC2}% in ${activeSolvent.labels[language]}`,
          es: `Dilución ${safeC1}% → ${formattedC2}% en ${activeSolvent.labels[language]}`,
          de: `Verdünnung ${safeC1}% → ${formattedC2}% in ${activeSolvent.labels[language]}`,
        }),
      tags: selectedIngredient?.tags,
      createdAt: todayIsoDate(),
    };
    onSaveDilutedIngredient(newIng);
    setSavedFlag('catalog');
    onToast?.(
      tr(language, {
        ru: `Разведение «${newIng.name}» сохранено в базу ингредиентов`,
        en: `Saved "${newIng.name}" to Ingredients Database`,
        it: `Diluizione "${newIng.name}" salvata nel database`,
        es: `Dilución "${newIng.name}" guardada en la base`,
        de: `Verdünnung „${newIng.name}“ in der Rohstoffdatenbank gespeichert`,
      })
    );
  };

  const handleAddDilutionToFormula = () => {
    if (!onAddToProjectFormula || !resolvedProject) return;
    const component: FormulaComponent = {
      id: generateId('fc'),
      ingredientId: selectedIngredient?.id,
      name: `${resolvedBaseName} ${formattedC2}%`,
      tier: selectedIngredient?.tier === 'solvent' ? 'heart' : selectedIngredient?.tier || 'heart',
      family: selectedIngredient?.family || 'amber',
      dilutionPercent: Number(safeC2.toFixed(2)),
      weightGrams: Number(result.totalMass.toFixed(2)),
      costPerGram: Number(result.costPerGram.toFixed(2)),
      note: `${safeC1}% → ${formattedC2}% (${activeSolvent.labels[language]})`,
    };
    onAddToProjectFormula(resolvedProject.id, component);
    setSavedFlag('formula');
    onToast?.(
      tr(language, {
        ru: `Разведение «${component.name}» (${component.weightGrams} ${gUnit}) добавлено в формулу ${resolvedProject.code}`,
        en: `Added "${component.name}" (${component.weightGrams} ${gUnit}) to ${resolvedProject.code}`,
        it: `"${component.name}" (${component.weightGrams} ${gUnit}) aggiunto a ${resolvedProject.code}`,
        es: `"${component.name}" (${component.weightGrams} ${gUnit}) añadido a ${resolvedProject.code}`,
        de: `„${component.name}“ (${component.weightGrams} ${gUnit}) zu ${resolvedProject.code} hinzugefügt`,
      })
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
          <div className="flex items-start gap-2.5">
            <Beaker className="h-5 w-5 text-[var(--theme-accent)] mt-0.5 shrink-0" />
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Калькулятор разбавления ингредиентов',
                  en: 'Ingredient Dilution Calculator',
                  it: 'Calcolatore di Diluizione Ingredienti',
                  es: 'Calculadora de Dilución de Ingredientes',
                  de: 'Rohstoff-Verdünnungsrechner',
                })}
              </h2>
              <p className="mt-0.5 text-xs text-[#6B6D68]">
                {tr(language, {
                  ru: 'Точный расчёт массы чистого/исходного вещества и растворителя для перевода ингредиента в нужную концентрацию (например, 100% → 10% или 1%).',
                  en: 'Calculate exact pure/starting material and solvent quantities to dilute an aromatic ingredient to any target strength (e.g. 100% → 10% or 1%).',
                  it: 'Calcola le quantità esatte di sostanza pura e solvente per diluire un ingrediente alla concentrazione desiderata (es. 100% → 10%).',
                  es: 'Calcula las cantidades exactas de sustancia pura y disolvente para diluir un ingrediente a la concentración deseada (p. ej. 100% → 10%).',
                  de: 'Berechne exakte Mengen an Reinsubstanz und Lösungsmittel zur Verdünnung eines Rohstoffs auf die gewünschte Stärke (z. B. 100% → 10%).',
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#3F413D] hover:bg-[#F7F7F5]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Сбросить',
                  en: 'Reset',
                  it: 'Ripristina',
                  es: 'Restablecer',
                  de: 'Zurücksetzen',
                })}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Dilution Scenario Chips & Mode Selector */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-[#575955]">
              {tr(language, {
                ru: 'Способ расчёта',
                en: 'Calculation approach',
                it: 'Metodo di calcolo',
                es: 'Método de cálculo',
                de: 'Berechnungsart',
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('target_total');
                  setSavedFlag(null);
                }}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  mode === 'target_total'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'Нужно получить (итого г / мл)',
                  en: 'Target final batch (g / ml)',
                  it: 'Quantità finale desiderata (g / ml)',
                  es: 'Cantidad final deseada (g / ml)',
                  de: 'Zielmenge Endlösung (g / ml)',
                })}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('from_source');
                  setSavedFlag(null);
                }}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  mode === 'from_source'
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {tr(language, {
                  ru: 'От имеющейся массы вещества (г)',
                  en: 'From available substance mass (g)',
                  it: 'Da massa di sostanza disponibile (g)',
                  es: 'Desde masa de sustancia disponible (g)',
                  de: 'Aus vorhandener Substanzmasse (g)',
                })}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-medium text-[#575955]">
              {tr(language, {
                ru: 'Быстрые сценарии разведения',
                en: 'Quick dilution presets',
                it: 'Scenari rapidi di diluizione',
                es: 'Ajustes rápidos de dilución',
                de: 'Schnellvorlagen',
              })}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SCENARIOS.map((sc) => {
                const active =
                  Math.abs(safeC1 - sc.from) < 0.01 && Math.abs(safeC2 - sc.to) < 0.001;
                return (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => {
                      setSourceConc(sc.from);
                      setTargetConc(sc.to);
                      setSavedFlag(null);
                    }}
                    className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                        : 'border-[#E4E4E0] bg-[#FAFBF9] text-[#3F413D] hover:bg-[#F3F2F1]'
                    }`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inputs + Results Split Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left 7 Cols: Ingredient, C1 -> C2, Amount, Solvent */}
          <div className="lg:col-span-7 space-y-4">
            {/* Ingredient Picker */}
            <div className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ing-dil-select"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Выбрать из базы ингредиентов (необязательно)',
                      en: 'Pick from Ingredients Catalog (optional)',
                      it: 'Scegli dal catalogo ingredienti (opzionale)',
                      es: 'Elegir del catálogo (opcional)',
                      de: 'Aus Rohstoffdatenbank wählen (optional)',
                    })}
                  </label>
                  <select
                    id="ing-dil-select"
                    value={selectedIngredientId}
                    onChange={(e) => handleSelectIngredient(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  >
                    <option value="">
                      {tr(language, {
                        ru: '— Произвольное вещество —',
                        en: '— Custom substance —',
                        it: '— Sostanza personalizzata —',
                        es: '— Sustancia personalizada —',
                        de: '— Benutzerdefinierte Substanz —',
                      })}
                    </option>
                    {aromaticIngredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.dilutionPercent}% ·{' '}
                        {getNoteTierShort(ing.tier, language)} /{' '}
                        {getOlfactoryFamilyShort(ing.family, language)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ing-dil-name"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Название вещества',
                      en: 'Substance name',
                      it: 'Nome della sostanza',
                      es: 'Nombre de la sustancia',
                      de: 'Name der Substanz',
                    })}
                  </label>
                  <input
                    id="ing-dil-name"
                    type="text"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value);
                      setSavedFlag(null);
                    }}
                    placeholder={tr(language, {
                      ru: 'Напр.: Амброксан, Роза дамасская...',
                      en: 'e.g. Ambroxan, Rose Otto...',
                      it: 'es. Ambroxan, Rosa Damascena...',
                      es: 'ej. Ambroxan, Rosa Damascena...',
                      de: 'z. B. Ambroxan, Rose Otto...',
                    })}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Concentrations Row C1 -> C2 */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                <div className="rounded-lg border border-[#E4E4E0] bg-white p-3">
                  <label
                    htmlFor="ing-dil-c1"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Исходная концентрация вещества (C₁ %)',
                      en: 'Starting concentration (C₁ %)',
                      it: 'Concentrazione iniziale (C₁ %)',
                      es: 'Concentración inicial (C₁ %)',
                      de: 'Ausgangskonzentration (C₁ %)',
                    })}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="ing-dil-c1"
                      type="number"
                      min={0.01}
                      max={100}
                      step="any"
                      value={sourceConc}
                      onChange={(e) => {
                        const nextC1 = Math.max(
                          0.01,
                          Math.min(100, Number(e.target.value) || 100)
                        );
                        setSourceConc(nextC1);
                        if (targetConc > nextC1) setTargetConc(nextC1);
                        setSavedFlag(null);
                      }}
                      className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[#181917]"
                    />
                    <span className="text-xs font-semibold text-[#575955]">%</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[100, 50, 20, 10].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setSourceConc(v);
                          if (targetConc > v) setTargetConc(v);
                          setSavedFlag(null);
                        }}
                        className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                          safeC1 === v
                            ? 'bg-[var(--theme-accent)] text-white'
                            : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                        }`}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-[#E4E4E0] bg-white p-3">
                  <label
                    htmlFor="ing-dil-c2"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Целевая концентрация (C₂ %)',
                      en: 'Target concentration (C₂ %)',
                      it: 'Concentrazione target (C₂ %)',
                      es: 'Concentración objetivo (C₂ %)',
                      de: 'Zielkonzentration (C₂ %)',
                    })}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="ing-dil-c2"
                      type="number"
                      min={0.001}
                      max={safeC1}
                      step="any"
                      value={targetConc}
                      onChange={(e) => {
                        const nextC2 = Math.max(
                          0.001,
                          Math.min(safeC1, Number(e.target.value) || 0.1)
                        );
                        setTargetConc(nextC2);
                        setSavedFlag(null);
                      }}
                      className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[var(--theme-accent)]"
                    />
                    <span className="text-xs font-semibold text-[#575955]">%</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[50, 20, 10, 5, 1, 0.1]
                      .filter((v) => v <= safeC1)
                      .map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setTargetConc(v);
                            setSavedFlag(null);
                          }}
                          className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                            Math.abs(safeC2 - v) < 0.0001
                              ? 'bg-[var(--theme-accent)] text-white'
                              : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                          }`}
                        >
                          {v}%
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Size & Solvent Selection */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {mode === 'target_total' ? (
                <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="ing-dil-total"
                      className="text-[11px] font-medium text-[#6B6D68]"
                    >
                      {tr(language, {
                        ru: 'Итоговый объём / масса раствора',
                        en: 'Final diluted solution amount',
                        it: 'Quantità finale di soluzione',
                        es: 'Cantidad final de solución',
                        de: 'Endmenge der Lösung',
                      })}
                    </label>
                    <div className="inline-flex rounded bg-[#EEEEEC] p-0.5 text-[10px]">
                      {(['g', 'ml'] as TargetUnit[]).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setTargetUnit(u)}
                          className={`rounded px-2 py-0.5 font-semibold ${
                            targetUnit === u
                              ? 'bg-white text-[#181917] shadow-xs'
                              : 'text-[#6B6D68]'
                          }`}
                        >
                          {u === 'g' ? gUnit : mlUnit}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="ing-dil-total"
                      type="number"
                      min={0.1}
                      step="any"
                      value={targetTotalInput}
                      onChange={(e) => {
                        setTargetTotalInput(Math.max(0.1, Number(e.target.value) || 0.1));
                        setSavedFlag(null);
                      }}
                      className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[#181917]"
                    />
                    <span className="text-xs text-[#6B6D68] shrink-0">
                      {targetUnit === 'g' ? gUnit : mlUnit}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[5, 10, 15, 20, 30, 50, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setTargetTotalInput(v);
                          setSavedFlag(null);
                        }}
                        className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                          targetTotalInput === v
                            ? 'bg-[var(--theme-accent)] text-white'
                            : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                        }`}
                      >
                        {v} {targetUnit === 'g' ? gUnit : mlUnit}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
                  <label
                    htmlFor="ing-dil-source-mass"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1.5"
                  >
                    {tr(language, {
                      ru: 'Масса исходного вещества (г)',
                      en: 'Available starting material mass (g)',
                      it: 'Massa sostanza iniziale (g)',
                      es: 'Masa de sustancia inicial (g)',
                      de: 'Masse der Ausgangssubstanz (g)',
                    })}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="ing-dil-source-mass"
                      type="number"
                      min={0.01}
                      step="any"
                      value={sourceMassInput}
                      onChange={(e) => {
                        setSourceMassInput(Math.max(0.01, Number(e.target.value) || 0.01));
                        setSavedFlag(null);
                      }}
                      className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[#181917]"
                    />
                    <span className="text-xs text-[#6B6D68] shrink-0">{gUnit}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[0.1, 0.25, 0.5, 1, 2, 5, 10].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setSourceMassInput(v);
                          setSavedFlag(null);
                        }}
                        className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                          sourceMassInput === v
                            ? 'bg-[var(--theme-accent)] text-white'
                            : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                        }`}
                      >
                        {v} {gUnit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Solvent Selector & Density */}
              <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5 space-y-2.5">
                <div>
                  <label
                    htmlFor="ing-dil-solvent"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Растворитель',
                      en: 'Solvent',
                      it: 'Solvente',
                      es: 'Disolvente',
                      de: 'Lösungsmittel',
                    })}
                  </label>
                  <select
                    id="ing-dil-solvent"
                    value={solventKey}
                    onChange={(e) => handleSelectSolvent(e.target.value as SolventKey)}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5 text-xs font-medium text-[#181917]"
                  >
                    {SOLVENT_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.labels[language]} ({opt.density} {gUnit}/{mlUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="ing-dil-solv-dens"
                      className="block text-[10px] text-[#6B6D68] mb-0.5"
                    >
                      {tr(language, {
                        ru: 'Плотн. раствор.',
                        en: 'Solv. density',
                        it: 'Dens. solv.',
                        es: 'Dens. disolv.',
                        de: 'Lösungsm.-Dichte',
                      })}
                    </label>
                    <input
                      id="ing-dil-solv-dens"
                      type="number"
                      min={0.5}
                      max={1.8}
                      step="0.005"
                      value={solventDensity}
                      onChange={(e) => {
                        setSolventKey('custom');
                        setSolventDensity(
                          Math.max(0.5, Math.min(1.8, Number(e.target.value) || 0.805))
                        );
                      }}
                      className="w-full rounded border border-[#E4E4E0] bg-[#FAFBF9] px-2 py-1 font-mono text-xs text-[#181917]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ing-dil-subst-dens"
                      className="block text-[10px] text-[#6B6D68] mb-0.5"
                    >
                      {tr(language, {
                        ru: 'Плотн. вещества',
                        en: 'Subst. density',
                        it: 'Dens. sost.',
                        es: 'Dens. sust.',
                        de: 'Stoffdichte',
                      })}
                    </label>
                    <input
                      id="ing-dil-subst-dens"
                      type="number"
                      min={0.5}
                      max={1.8}
                      step="0.01"
                      value={substanceDensity}
                      onChange={(e) =>
                        setSubstanceDensity(
                          Math.max(0.5, Math.min(1.8, Number(e.target.value) || 0.96))
                        )
                      }
                      className="w-full rounded border border-[#E4E4E0] bg-[#FAFBF9] px-2 py-1 font-mono text-xs text-[#181917]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Cost Parameters */}
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] p-3">
              <div>
                <label
                  htmlFor="ing-dil-src-cost"
                  className="block text-[11px] text-[#6B6D68] mb-1"
                >
                  {tr(language, {
                    ru: 'Цена исходного сырья / г',
                    en: 'Starting material cost / g',
                    it: 'Costo materia prima / g',
                    es: 'Costo materia inicial / g',
                    de: 'Ausgangsmaterial Preis / g',
                  })}
                </label>
                <input
                  id="ing-dil-src-cost"
                  type="number"
                  min={0}
                  step="0.1"
                  value={sourceCostPerGram}
                  onChange={(e) =>
                    setSourceCostPerGram(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1 font-mono text-xs text-[#181917]"
                />
              </div>
              <div>
                <label
                  htmlFor="ing-dil-solv-cost"
                  className="block text-[11px] text-[#6B6D68] mb-1"
                >
                  {tr(language, {
                    ru: 'Цена растворителя / г',
                    en: 'Solvent cost / g',
                    it: 'Costo solvente / g',
                    es: 'Costo disolvente / g',
                    de: 'Lösungsmittel Preis / g',
                  })}
                </label>
                <input
                  id="ing-dil-solv-cost"
                  type="number"
                  min={0}
                  step="0.1"
                  value={solventCostPerGram}
                  onChange={(e) =>
                    setSolventCostPerGram(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1 font-mono text-xs text-[#181917]"
                />
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Calculation Result Card */}
          <div className="lg:col-span-5 rounded-xl border border-[#D2D0CE] bg-[#FAFBF9] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E4E0] pb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6D68]">
                  {resolvedBaseName}
                </div>
                <div className="mt-0.5 font-mono text-sm font-bold text-[#181917]">
                  {safeC1}% → {formattedC2}%{' '}
                  <span className="font-normal text-[#6B6D68]">
                    (1 : {result.solventParts.toFixed(result.solventParts >= 10 ? 0 : 1)})
                  </span>
                </div>
              </div>
              <span className="rounded-lg bg-[var(--theme-accent-soft)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--theme-accent)]">
                ×{result.dilutionFactor.toFixed(result.dilutionFactor >= 10 ? 0 : 1)}
              </span>
            </div>

            {/* Two Primary Output Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#E4E4E0] bg-white p-3">
                <div className="text-[11px] font-medium text-[#6B6D68]">
                  {safeC1 === 100
                    ? tr(language, {
                        ru: 'Чистое вещество (100%)',
                        en: 'Pure substance (100%)',
                        it: 'Sostanza pura (100%)',
                        es: 'Sustancia pura (100%)',
                        de: 'Reinsubstanz (100%)',
                      })
                    : tr(language, {
                        ru: `Вещество (${safeC1}%)`,
                        en: `Material (${safeC1}%)`,
                        it: `Sostanza (${safeC1}%)`,
                        es: `Sustancia (${safeC1}%)`,
                        de: `Substanz (${safeC1}%)`,
                      })}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-[var(--theme-accent)] tabular-nums">
                  {result.sourceMass.toFixed(2)} {gUnit}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[#6B6D68] tabular-nums">
                  ≈ {result.sourceMl.toFixed(2)} {mlUnit}
                </div>
              </div>

              <div className="rounded-lg border border-[#E4E4E0] bg-white p-3">
                <div className="text-[11px] font-medium text-[#6B6D68]">
                  {activeSolvent.labels[language]}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#181917] tabular-nums">
                  {result.solventMass.toFixed(2)} {gUnit}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[#6B6D68] tabular-nums">
                  ≈ {result.solventMl.toFixed(2)} {mlUnit}
                </div>
              </div>
            </div>

            {/* SVG Ratio Bar (no inline CSS styles) */}
            <div className="space-y-1.5">
              <svg
                viewBox="0 0 100 8"
                className="h-2.5 w-full rounded-full overflow-hidden block"
                preserveAspectRatio="none"
              >
                <rect x={0} y={0} width={100} height={8} rx={4} fill="#CBD5E1" />
                {result.sourceSharePct > 0 && (
                  <rect
                    x={0}
                    y={0}
                    width={Math.min(100, result.sourceSharePct)}
                    height={8}
                    rx={4}
                    fill="#185ABD"
                  />
                )}
              </svg>
              <div className="flex items-center justify-between text-[11px] text-[#575955] tabular-nums">
                <span>
                  {tr(language, {
                    ru: 'Вещество:',
                    en: 'Material:',
                    it: 'Sostanza:',
                    es: 'Sustancia:',
                    de: 'Substanz:',
                  })}{' '}
                  {formatPercent(result.sourceSharePct, 1)}
                </span>
                <span>
                  {tr(language, {
                    ru: 'Растворитель:',
                    en: 'Solvent:',
                    it: 'Solvente:',
                    es: 'Disolvente:',
                    de: 'Lösungsmittel:',
                  })}{' '}
                  {formatPercent(result.solventSharePct, 1)}
                </span>
              </div>
            </div>

            {/* Breakdown Details */}
            <dl className="divide-y divide-[#EAEAE6] text-xs">
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Итоговый вес раствора',
                    en: 'Total finished solution weight',
                    it: 'Peso totale soluzione',
                    es: 'Peso total solución',
                    de: 'Gesamtgewicht Lösung',
                  })}
                </dt>
                <dd className="font-mono font-semibold text-[#181917] tabular-nums">
                  {result.totalMass.toFixed(2)} {gUnit}{' '}
                  <span className="font-normal text-[#6B6D68]">
                    (≈ {result.totalMl.toFixed(2)} {mlUnit})
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Чистого (100%) вещества внутри',
                    en: 'Pure 100% active substance',
                    it: 'Sostanza attiva pura (100%)',
                    es: 'Sustancia activa pura (100%)',
                    de: 'Reiner Wirkstoffanteil (100%)',
                  })}
                </dt>
                <dd className="font-mono font-semibold text-[#181917] tabular-nums">
                  {result.pureActiveMass.toFixed(3)} {gUnit}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#6B6D68]">
                  {tr(language, {
                    ru: 'Себестоимость разведения',
                    en: 'Diluted batch cost / unit',
                    it: 'Costo lotto / grammo',
                    es: 'Costo lote / gramo',
                    de: 'Ansatzkosten / Gramm',
                  })}
                </dt>
                <dd className="font-mono font-semibold text-[#181917] tabular-nums">
                  {formatCurrencyDecimal(result.batchCost, language, currency)}{' '}
                  <span className="font-normal text-[#6B6D68]">
                    ({formatCurrencyDecimal(result.costPerGram, language, currency)}/{gUnit})
                  </span>
                </dd>
              </div>
            </dl>

            {/* Actions: Save to Catalog / Add to Project Formula */}
            <div className="space-y-2 border-t border-[#E4E4E0] pt-3">
              {onSaveDilutedIngredient && (
                <button
                  type="button"
                  onClick={handleSaveToCatalog}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3.5 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1] transition-colors"
                >
                  {savedFlag === 'catalog' ? (
                    <Check className="h-3.5 w-3.5 text-[#15803D]" />
                  ) : (
                    <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  )}
                  <span>
                    {tr(language, {
                      ru: `Сохранить «${formattedC2}%» в базу ингредиентов`,
                      en: `Save "${formattedC2}%" dilution to Ingredients`,
                      it: `Salva diluizione "${formattedC2}%" nel database`,
                      es: `Guardar dilución "${formattedC2}%" en ingredientes`,
                      de: `„${formattedC2}%“-Verdünnung in Rohstoffe speichern`,
                    })}
                  </span>
                </button>
              )}

              {onAddToProjectFormula && projects.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {!activeProject && (
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      aria-label={tr(language, {
                        ru: 'Проект для добавления',
                        en: 'Target project',
                        it: 'Progetto di destinazione',
                        es: 'Proyecto de destino',
                        de: 'Zielprojekt',
                      })}
                      className="sm:w-44 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-2 text-xs text-[#181917]"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} · {p.title}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={handleAddDilutionToFormula}
                    disabled={!resolvedProject}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] disabled:opacity-45 transition-colors"
                  >
                    {savedFlag === 'formula' ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {resolvedProject
                        ? tr(language, {
                            ru: `Добавить в формулу (${resolvedProject.code})`,
                            en: `Add to Formula (${resolvedProject.code})`,
                            it: `Aggiungi a formula (${resolvedProject.code})`,
                            es: `Añadir a fórmula (${resolvedProject.code})`,
                            de: `Zur Formel hinzufügen (${resolvedProject.code})`,
                          })
                        : tr(language, {
                            ru: 'Добавить в формулу',
                            en: 'Add to Formula',
                            it: 'Aggiungi alla formula',
                            es: 'Añadir a la fórmula',
                            de: 'Zur Formel hinzufügen',
                          })}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reference Dilution Matrix Table */}
      <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#181917] flex items-center gap-2">
            <Droplets className="h-4 w-4 text-[var(--theme-accent)]" />
            <span>
              {tr(language, {
                ru: `Таблица стандартных разведений для ${safeC1}% сырья`,
                en: `Standard Dilution Reference Table (from ${safeC1}%)`,
                it: `Tabella diluizioni standard (da ${safeC1}%)`,
                es: `Tabla de diluciones estándar (desde ${safeC1}%)`,
                de: `Standard-Verdünnungstabelle (ab ${safeC1}%)`,
              })}
            </span>
          </h3>
          <span className="text-[11px] text-[#6B6D68]">
            {tr(language, {
              ru: 'Нажмите строку, чтобы выбрать концентрацию',
              en: 'Click any row to select concentration',
              it: 'Clicca su una riga per selezionare',
              es: 'Haz clic en una fila para elegir',
              de: 'Zeile anklicken zum Auswählen',
            })}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E4E4E0]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBF9] border-b border-[#E4E4E0] text-[11px] font-semibold text-[#575955]">
                <th className="py-2.5 px-3">
                  {tr(language, {
                    ru: 'Целевая конц.',
                    en: 'Target %',
                    it: 'Target %',
                    es: 'Objetivo %',
                    de: 'Ziel %',
                  })}
                </th>
                <th className="py-2.5 px-3">
                  {tr(language, {
                    ru: 'Пропорция',
                    en: 'Ratio',
                    it: 'Rapporto',
                    es: 'Proporción',
                    de: 'Verhältnis',
                  })}
                </th>
                <th className="py-2.5 px-3 text-right">
                  {tr(language, {
                    ru: `Вещество (${safeC1}%)`,
                    en: `Material (${safeC1}%)`,
                    it: `Sostanza (${safeC1}%)`,
                    es: `Sustancia (${safeC1}%)`,
                    de: `Substanz (${safeC1}%)`,
                  })}
                </th>
                <th className="py-2.5 px-3 text-right">
                  {tr(language, {
                    ru: 'Растворитель',
                    en: 'Solvent',
                    it: 'Solvente',
                    es: 'Disolvente',
                    de: 'Lösungsmittel',
                  })}
                </th>
                <th className="py-2.5 px-3 text-right">
                  {tr(language, {
                    ru: 'Итого раствора',
                    en: 'Total',
                    it: 'Totale',
                    es: 'Total',
                    de: 'Gesamt',
                  })}
                </th>
                <th className="py-2.5 px-3 text-right">
                  {tr(language, {
                    ru: 'Цена / г',
                    en: 'Cost / g',
                    it: 'Costo / g',
                    es: 'Costo / g',
                    de: 'Preis / g',
                  })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAE6]">
              {referenceRows.map((row) => {
                const isSelected = Math.abs(row.pct - safeC2) < 0.001;
                return (
                  <tr
                    key={row.pct}
                    onClick={() => {
                      setTargetConc(row.pct);
                      setSavedFlag(null);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[var(--theme-accent-soft)] font-semibold'
                        : 'hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[var(--theme-accent)] font-bold">
                      {row.pct}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#6B6D68]">
                      1 : {row.solventParts.toFixed(row.solventParts >= 10 ? 0 : 1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#181917] tabular-nums">
                      {row.sourceMass.toFixed(2)} {gUnit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#181917] tabular-nums">
                      {row.solventMass.toFixed(2)} {gUnit}{' '}
                      <span className="text-[10.5px] text-[#6B6D68]">
                        ({row.solventMl.toFixed(1)} {mlUnit})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#181917] tabular-nums">
                      {row.totalMass.toFixed(2)} {gUnit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#575955] tabular-nums">
                      {formatCurrencyDecimal(row.costPerGram, language, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
