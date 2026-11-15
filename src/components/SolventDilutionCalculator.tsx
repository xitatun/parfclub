import { Check, Droplets, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CONCENTRATION_TARGET_PERCENT, getConcentrationLabel } from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  ConcentrationType,
  FormulaComponent,
  Ingredient,
  PerfumeProject,
} from '../types/perfume';
import { calculateFormulaSummary, formatPercent } from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';

type DilutionCalcMode = 'from_concentrate' | 'to_bottle';
type SolventPresetKey = 'ethanol96' | 'perfume_base' | 'carrier_oil' | 'dpg' | 'custom';
type ConcentrationChoice = ConcentrationType | 'custom';

interface SolventPreset {
  key: SolventPresetKey;
  labels: Record<AppLanguage, string>;
  density: number;
  finishDensity: number;
}

const SOLVENT_PRESETS: SolventPreset[] = [
  {
    key: 'ethanol96',
    labels: {
      ru: 'Спирт 96%',
      en: 'Ethanol 96%',
      it: 'Alcol etilico 96%',
      es: 'Alcohol 96%',
      de: 'Ethanol 96%',
    },
    density: 0.805,
    finishDensity: 0.83,
  },
  {
    key: 'perfume_base',
    labels: {
      ru: 'Парфюмерная база',
      en: 'Perfume Base',
      it: 'Base profumo',
      es: 'Base de perfume',
      de: 'Parfümbasis',
    },
    density: 0.84,
    finishDensity: 0.86,
  },
  {
    key: 'carrier_oil',
    labels: {
      ru: 'Масло-носитель',
      en: 'Carrier Oil',
      it: 'Olio vettore',
      es: 'Aceite portador',
      de: 'Trägeröl',
    },
    density: 0.87,
    finishDensity: 0.89,
  },
  {
    key: 'dpg',
    labels: {
      ru: 'ДПГ (DPG)',
      en: 'DPG',
      it: 'DPG',
      es: 'DPG',
      de: 'DPG',
    },
    density: 1.023,
    finishDensity: 1.0,
  },
  {
    key: 'custom',
    labels: {
      ru: 'Своя плотность',
      en: 'Custom Density',
      it: 'Densità personalizzata',
      es: 'Densidad propia',
      de: 'Eigene Dichte',
    },
    density: 0.82,
    finishDensity: 0.85,
  },
];

const CONCENTRATION_PRESETS: {
  key: ConcentrationType;
  labels: Record<AppLanguage, string>;
}[] = [
  {
    key: 'Extrait',
    labels: {
      ru: 'Parfum (Extrait)',
      en: 'Parfum (Extrait)',
      it: 'Parfum (Extrait)',
      es: 'Parfum (Extrait)',
      de: 'Parfum (Extrait)',
    },
  },
  {
    key: 'EDP',
    labels: { ru: 'EDP', en: 'EDP', it: 'EDP', es: 'EDP', de: 'EDP' },
  },
  {
    key: 'EDT',
    labels: { ru: 'EDT', en: 'EDT', it: 'EDT', es: 'EDT', de: 'EDT' },
  },
  {
    key: 'Cologne',
    labels: { ru: 'Cologne', en: 'Cologne', it: 'Colonia', es: 'Colonia', de: 'Cologne' },
  },
  {
    key: 'Oil',
    labels: {
      ru: 'Масло (Oil)',
      en: 'Perfume Oil',
      it: 'Olio profumato',
      es: 'Aceite (Oil)',
      de: 'Parfümöl',
    },
  },
];

const CONCENTRATE_DEFAULT_DENSITY = 0.95;

interface SolventDilutionCalculatorProps {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  language: AppLanguage;
  lockedProjectId?: string;
  onUpdateProject?: (updated: PerfumeProject) => void;
  onAppliedToast?: (message: string) => void;
}

export function SolventDilutionCalculator({
  projects,
  ingredients,
  language,
  lockedProjectId,
  onUpdateProject,
  onAppliedToast,
}: SolventDilutionCalculatorProps) {
  const gUnit = language === 'ru' ? 'г' : 'g';
  const mlUnit = language === 'ru' ? 'мл' : 'ml';
  const pcsUnit = tr(language, { ru: 'шт.', en: 'pcs', it: 'pz', es: 'uds', de: 'Stk.' });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    lockedProjectId || ''
  );

  const activeProject = useMemo(
    () => projects.find((p) => p.id === (lockedProjectId || selectedProjectId)),
    [projects, lockedProjectId, selectedProjectId]
  );

  const [mode, setMode] = useState<DilutionCalcMode>('from_concentrate');
  const [solventKey, setSolventKey] = useState<SolventPresetKey>('ethanol96');
  const [solventDensity, setSolventDensity] = useState<number>(0.805);
  const [concentrateDensity, setConcentrateDensity] = useState<number>(
    CONCENTRATE_DEFAULT_DENSITY
  );

  const [concentrationChoice, setConcentrationChoice] = useState<ConcentrationChoice>('EDP');
  const [targetPercent, setTargetPercent] = useState<number>(
    CONCENTRATION_TARGET_PERCENT.EDP.defaultPct
  );

  const [concentrateMass, setConcentrateMass] = useState<number>(5.0);
  const [sourcePurityPercent, setSourcePurityPercent] = useState<number>(100);
  const [targetBottleMl, setTargetBottleMl] = useState<number>(30);
  const [bottleCount, setBottleCount] = useState<number>(1);
  const [justApplied, setJustApplied] = useState(false);

  const loadFromProject = (proj: PerfumeProject | undefined) => {
    setJustApplied(false);
    if (!proj) return;
    const summary = calculateFormulaSummary(proj.components);
    const nonSolventMass = summary.aromaticMixtureGrams;
    const pureMass = summary.pureAromaticGrams;
    if (nonSolventMass > 0) {
      setConcentrateMass(Number(nonSolventMass.toFixed(2)));
      const effectivePurity = Math.min(
        100,
        Math.max(1, Number(((pureMass / nonSolventMass) * 100).toFixed(1)))
      );
      setSourcePurityPercent(effectivePurity);
    } else {
      setConcentrateMass(5.0);
      setSourcePurityPercent(100);
    }
    setTargetBottleMl(proj.targetBottleMl || 30);
    setConcentrationChoice(proj.targetConcentration);
    setTargetPercent(CONCENTRATION_TARGET_PERCENT[proj.targetConcentration].defaultPct);

    if (proj.targetConcentration === 'Oil') {
      setSolventKey('carrier_oil');
      setSolventDensity(0.87);
    } else {
      setSolventKey('ethanol96');
      setSolventDensity(0.805);
    }
  };

  useEffect(() => {
    if (lockedProjectId) {
      setSelectedProjectId(lockedProjectId);
      const proj = projects.find((p) => p.id === lockedProjectId);
      loadFromProject(proj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedProjectId]);

  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projects.find((p) => p.id === projId);
    loadFromProject(proj);
  };

  const handleSelectSolvent = (key: SolventPresetKey) => {
    setSolventKey(key);
    const preset = SOLVENT_PRESETS.find((p) => p.key === key);
    if (preset && key !== 'custom') {
      setSolventDensity(preset.density);
    }
    setJustApplied(false);
  };

  const handleSelectConcentration = (choice: ConcentrationChoice) => {
    setConcentrationChoice(choice);
    if (choice !== 'custom') {
      const def = CONCENTRATION_TARGET_PERCENT[choice].defaultPct;
      setTargetPercent(Math.min(sourcePurityPercent, def));
      if (choice === 'Oil' && solventKey === 'ethanol96') {
        setSolventKey('carrier_oil');
        setSolventDensity(0.87);
      } else if (choice !== 'Oil' && solventKey === 'carrier_oil') {
        setSolventKey('ethanol96');
        setSolventDensity(0.805);
      }
    }
    setJustApplied(false);
  };

  const handleReset = () => {
    if (activeProject) {
      loadFromProject(activeProject);
      return;
    }
    setMode('from_concentrate');
    setSolventKey('ethanol96');
    setSolventDensity(0.805);
    setConcentrateDensity(CONCENTRATE_DEFAULT_DENSITY);
    setConcentrationChoice('EDP');
    setTargetPercent(CONCENTRATION_TARGET_PERCENT.EDP.defaultPct);
    setConcentrateMass(5.0);
    setSourcePurityPercent(100);
    setTargetBottleMl(30);
    setBottleCount(1);
    setJustApplied(false);
  };

  const safeSolventDensity = Math.max(0.5, Math.min(1.5, Number(solventDensity) || 0.805));
  const safeConcDensity = Math.max(0.5, Math.min(1.5, Number(concentrateDensity) || 0.95));
  const safeSourcePurity = Math.max(0.5, Math.min(100, Number(sourcePurityPercent) || 100));
  const safeTargetPct = Math.max(
    0.5,
    Math.min(safeSourcePurity, Number(targetPercent) || 18)
  );
  const safeBatchCount = Math.max(1, Math.round(Number(bottleCount) || 1));

  const computeForTargetPct = (pct: number) => {
    const clampedPct = Math.max(0.5, Math.min(safeSourcePurity, pct));
    const ratioTarget = clampedPct / 100;
    const ratioSource = safeSourcePurity / 100;

    if (mode === 'from_concentrate') {
      const compMass = Math.max(0, Number(concentrateMass) || 0);
      const pureAromaMass = compMass * ratioSource;
      const totalMass = ratioTarget > 0 ? pureAromaMass / ratioTarget : 0;
      const solventMass = Math.max(0, totalMass - compMass);
      const solventMl = solventMass / safeSolventDensity;
      const compMl = compMass / safeConcDensity;
      const totalMl = compMl + solventMl;
      return {
        compMass,
        compMl,
        pureAromaMass,
        solventMass,
        solventMl,
        totalMass,
        totalMl,
        achievedPct: totalMass > 0 ? (pureAromaMass / totalMass) * 100 : 0,
      };
    }

    const desiredMl = Math.max(1, Number(targetBottleMl) || 30);
    const compFractionOfTotal = Math.min(1, ratioTarget / ratioSource);
    const solventFractionOfTotal = 1 - compFractionOfTotal;
    const invMixedDensity =
      compFractionOfTotal / safeConcDensity + solventFractionOfTotal / safeSolventDensity;
    const effectiveMixDensity = invMixedDensity > 0 ? 1 / invMixedDensity : safeSolventDensity;

    const totalMass = desiredMl * effectiveMixDensity;
    const compMass = totalMass * compFractionOfTotal;
    const pureAromaMass = compMass * ratioSource;
    const solventMass = Math.max(0, totalMass - compMass);
    const solventMl = solventMass / safeSolventDensity;
    const compMl = compMass / safeConcDensity;

    return {
      compMass,
      compMl,
      pureAromaMass,
      solventMass,
      solventMl,
      totalMass,
      totalMl: compMl + solventMl,
      achievedPct: totalMass > 0 ? (pureAromaMass / totalMass) * 100 : 0,
    };
  };

  const result = useMemo(
    () => computeForTargetPct(safeTargetPct),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mode,
      concentrateMass,
      targetBottleMl,
      safeTargetPct,
      safeSourcePurity,
      safeSolventDensity,
      safeConcDensity,
    ]
  );

  const comparisonRows = useMemo(
    () =>
      CONCENTRATION_PRESETS.map((preset) => {
        const defaultPct = CONCENTRATION_TARGET_PERCENT[preset.key].defaultPct;
        const feasible = defaultPct <= safeSourcePurity;
        const calcRow = computeForTargetPct(defaultPct);
        return {
          ...preset,
          defaultPct,
          range: CONCENTRATION_TARGET_PERCENT[preset.key].range,
          feasible,
          ...calcRow,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      mode,
      concentrateMass,
      targetBottleMl,
      safeSourcePurity,
      safeSolventDensity,
      safeConcDensity,
    ]
  );

  const compSharePct =
    result.totalMass > 0 ? Math.min(100, (result.compMass / result.totalMass) * 100) : 0;
  const solventSharePct = Math.max(0, 100 - compSharePct);

  const activeSolventPreset = SOLVENT_PRESETS.find((s) => s.key === solventKey)!;

  const handleApplySolventToProject = () => {
    if (!activeProject || !onUpdateProject) return;
    const nextSolventGrams = Number(result.solventMass.toFixed(2));
    const existingSolventIdx = activeProject.components.findIndex((c) => c.tier === 'solvent');
    const resolvedTargetConc: ConcentrationType =
      concentrationChoice !== 'custom'
        ? concentrationChoice
        : activeProject.targetConcentration;

    const solventLabel = activeSolventPreset.labels[language];
    const dilutedNotePrefix = tr(language, {
      ru: `Разведение до ${safeTargetPct.toFixed(1)}%`,
      en: `Diluted to ${safeTargetPct.toFixed(1)}%`,
      it: `Diluito al ${safeTargetPct.toFixed(1)}%`,
      es: `Diluido al ${safeTargetPct.toFixed(1)}%`,
      de: `Verdünnt auf ${safeTargetPct.toFixed(1)}%`,
    });
    let nextComponents: FormulaComponent[];

    if (existingSolventIdx >= 0) {
      nextComponents = activeProject.components.map((c, idx) =>
        idx === existingSolventIdx
          ? {
              ...c,
              weightGrams: nextSolventGrams,
              note: `${dilutedNotePrefix} (${solventLabel})`,
            }
          : c
      );
    } else {
      const solventIng = ingredients.find((i) => i.tier === 'solvent');
      const unitCost =
        solventIng && solventIng.quantityGrams > 0
          ? solventIng.priceTotal / solventIng.quantityGrams
          : 3;
      nextComponents = [
        ...activeProject.components,
        {
          id: generateId('fc'),
          ingredientId: solventIng?.id,
          name: solventIng?.name || solventLabel,
          tier: 'solvent',
          family: 'aquatic',
          dilutionPercent: 100,
          weightGrams: nextSolventGrams,
          costPerGram: Number(unitCost.toFixed(2)),
          note: dilutedNotePrefix,
        },
      ];
    }

    onUpdateProject({
      ...activeProject,
      targetConcentration: resolvedTargetConc,
      targetBottleMl: Math.max(1, Math.round(result.totalMl)),
      components: nextComponents,
      updatedAt: todayIsoDate(),
    });
    setJustApplied(true);
    onAppliedToast?.(
      tr(language, {
        ru: `В формуле ${activeProject.code} обновлена масса растворителя (${nextSolventGrams} ${gUnit})`,
        en: `Updated solvent (${nextSolventGrams} ${gUnit}) in "${activeProject.code}"`,
        it: `Solvente aggiornato (${nextSolventGrams} ${gUnit}) in "${activeProject.code}"`,
        es: `Disolvente actualizado (${nextSolventGrams} ${gUnit}) en "${activeProject.code}"`,
        de: `Lösungsmittel (${nextSolventGrams} ${gUnit}) in "${activeProject.code}" aktualisiert`,
      })
    );
  };

  return (
    <section className="rounded-xl border border-[#E4E4E0] bg-white p-5 sm:p-6 space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#EAEAE6] pb-4">
        <div className="flex items-start gap-2.5">
          <Droplets className="h-5 w-5 text-[var(--theme-accent)] mt-0.5 shrink-0" />
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#181917]">
              {tr(language, {
                ru: 'Калькулятор разведения и расчёта растворителя',
                en: 'Solvent & Concentration Dilution Calculator',
                it: 'Calcolatore di diluizione e solvente',
                es: 'Calculadora de dilución y disolvente',
                de: 'Lösungsmittel- & Konzentrationsrechner',
              })}
            </h2>
            <p className="mt-0.5 text-xs text-[#6B6D68]">
              {tr(language, {
                ru: 'Точный расчёт массы и объёма спирта или масла-носителя для получения нужной концентрации (Parfum, EDP, EDT, Cologne, Oil)',
                en: 'Calculate exact alcohol or carrier oil weight and volume to reach EDP, EDT, Parfum, Cologne, or Oil concentration',
                it: 'Calcola peso e volume esatti di alcol o olio vettore per ottenere la concentrazione desiderata (Parfum, EDP, EDT, Colonia, Olio)',
                es: 'Calcula el peso y volumen exactos de alcohol o aceite portador para lograr EDP, EDT, Parfum, Colonia o Aceite',
                de: 'Berechne exakte Masse und Volumen von Alkohol oder Trägeröl für die gewünschte Konzentration (Parfum, EDP, EDT, Cologne, Öl)',
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!lockedProjectId && projects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              aria-label={tr(language, {
                ru: 'Загрузить композицию из проекта',
                en: 'Load composition from project',
                it: 'Carica composizione dal progetto',
                es: 'Cargar composición del proyecto',
                de: 'Komposition aus Projekt laden',
              })}
              className="rounded-lg border border-[#E4E4E0] bg-white px-3 py-1.5 text-xs font-medium text-[#181917] max-w-[240px]"
            >
              <option value="">
                {tr(language, {
                  ru: 'Свободный расчёт (вручную)',
                  en: 'Manual composition input',
                  it: 'Inserimento manuale',
                  es: 'Cálculo manual',
                  de: 'Manuelle Eingabe',
                })}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.title}
                </option>
              ))}
            </select>
          )}
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
          {activeProject && onUpdateProject && (
            <button
              type="button"
              onClick={handleApplySolventToProject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
            >
              {justApplied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Droplets className="h-3.5 w-3.5" />
              )}
              <span>
                {justApplied
                  ? tr(language, {
                      ru: 'Применено в формулу',
                      en: 'Applied to Formula',
                      it: 'Applicato alla formula',
                      es: 'Aplicado a la fórmula',
                      de: 'In Formel übernommen',
                    })
                  : tr(language, {
                      ru: 'Записать растворитель в формулу',
                      en: 'Apply Solvent to Formula',
                      it: 'Applica solvente alla formula',
                      es: 'Aplicar disolvente a la fórmula',
                      de: 'Lösungsmittel in Formel übernehmen',
                    })}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-[#575955]">
            {tr(language, {
              ru: 'Режим расчёта',
              en: 'Calculation mode',
              it: 'Modalità di calcolo',
              es: 'Modo de cálculo',
              de: 'Berechnungsmodus',
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
            <button
              type="button"
              onClick={() => {
                setMode('from_concentrate');
                setJustApplied(false);
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mode === 'from_concentrate'
                  ? 'bg-white text-[#181917] shadow-xs'
                  : 'text-[#575955] hover:text-[#181917]'
              }`}
            >
              {tr(language, {
                ru: 'От массы готовой композиции',
                en: 'From concentrate mass (g)',
                it: 'Da massa del concentrato (g)',
                es: 'Desde masa de concentrado (g)',
                de: 'Aus Konzentratmasse (g)',
              })}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('to_bottle');
                setJustApplied(false);
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mode === 'to_bottle'
                  ? 'bg-white text-[#181917] shadow-xs'
                  : 'text-[#575955] hover:text-[#181917]'
              }`}
            >
              {tr(language, {
                ru: 'Под целевой объём флакона (мл)',
                en: 'To target bottle volume (ml)',
                it: 'Per volume flacone target (ml)',
                es: 'Para volumen de frasco objetivo (ml)',
                de: 'Auf Ziel-Flakonvolumen (ml)',
              })}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-medium text-[#575955]">
            {tr(language, {
              ru: 'Тип растворителя (основа)',
              en: 'Solvent / carrier type',
              it: 'Tipo di solvente / base',
              es: 'Tipo de disolvente / base',
              de: 'Lösungsmittel / Träger',
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
            {SOLVENT_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleSelectSolvent(preset.key)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  solventKey === preset.key
                    ? 'bg-white text-[#181917] shadow-xs'
                    : 'text-[#575955] hover:text-[#181917]'
                }`}
              >
                {preset.labels[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-lg border border-[#EAEAE6] bg-[#FAFBF9] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Целевая концентрация композиции',
                  en: 'Target Concentration',
                  it: 'Concentrazione desiderata',
                  es: 'Concentración objetivo',
                  de: 'Zielkonzentration',
                })}
              </span>
              <span className="font-mono text-xs text-[#6B6D68] tabular-nums">
                {concentrationChoice !== 'custom'
                  ? `${getConcentrationLabel(concentrationChoice, language)} (${CONCENTRATION_TARGET_PERCENT[concentrationChoice].range})`
                  : tr(language, {
                      ru: 'Пользовательская концентрация',
                      en: 'Custom strength',
                      it: 'Concentrazione personalizzata',
                      es: 'Concentración personalizada',
                      de: 'Benutzerdefinierte Stärke',
                    })}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CONCENTRATION_PRESETS.map((p) => {
                const defaultPct = CONCENTRATION_TARGET_PERCENT[p.key].defaultPct;
                const isSelected = concentrationChoice === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleSelectConcentration(p.key)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                      isSelected
                        ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                        : 'border-[#E4E4E0] bg-white text-[#3F413D] hover:bg-[#F3F2F1]'
                    }`}
                  >
                    {p.labels[language]} · {defaultPct}%
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleSelectConcentration('custom')}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  concentrationChoice === 'custom'
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                    : 'border-[#E4E4E0] bg-white text-[#3F413D] hover:bg-[#F3F2F1]'
                }`}
              >
                {tr(language, {
                  ru: 'Своя %',
                  en: 'Custom %',
                  it: 'Pers. %',
                  es: 'Propia %',
                  de: 'Eigene %',
                })}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min={1}
                max={Math.max(5, Math.min(50, Math.floor(safeSourcePurity)))}
                step={0.5}
                value={Math.min(50, safeTargetPct)}
                onChange={(e) => {
                  setConcentrationChoice('custom');
                  setTargetPercent(Number(e.target.value));
                  setJustApplied(false);
                }}
                aria-label={tr(language, {
                  ru: 'Ползунок целевой концентрации',
                  en: 'Target concentration slider',
                  it: 'Cursore concentrazione desiderata',
                  es: 'Control de concentración objetivo',
                  de: 'Schieberegler Zielkonzentration',
                })}
                className="flex-1 accent-[var(--theme-accent)]"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0.5}
                  max={safeSourcePurity}
                  step="0.5"
                  value={targetPercent}
                  onChange={(e) => {
                    setConcentrationChoice('custom');
                    setTargetPercent(
                      Math.max(0.5, Math.min(safeSourcePurity, Number(e.target.value) || 1))
                    );
                    setJustApplied(false);
                  }}
                  aria-label={tr(language, {
                    ru: 'Целевая концентрация в процентах',
                    en: 'Target concentration percent',
                    it: 'Percentuale concentrazione desiderata',
                    es: 'Porcentaje de concentración objetivo',
                    de: 'Zielkonzentration in Prozent',
                  })}
                  className="w-20 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-right font-mono text-sm font-semibold tabular-nums text-[#181917]"
                />
                <span className="text-xs font-medium text-[#575955]">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mode === 'from_concentrate' ? (
              <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
                <label
                  htmlFor="dil-comp-mass"
                  className="block text-[11px] font-medium text-[#6B6D68] mb-1.5"
                >
                  {tr(language, {
                    ru: 'Масса готовой композиции (г)',
                    en: 'Ready composition mass (g)',
                    it: 'Massa composizione pronta (g)',
                    es: 'Masa de composición lista (g)',
                    de: 'Masse der fertigen Komposition (g)',
                  })}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="dil-comp-mass"
                    type="number"
                    min={0.05}
                    step="0.1"
                    value={concentrateMass}
                    onChange={(e) => {
                      setConcentrateMass(Math.max(0, Number(e.target.value) || 0));
                      setJustApplied(false);
                    }}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                  <span className="text-xs text-[#6B6D68] shrink-0">{gUnit}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[1, 2, 5, 10, 15, 25].map((presetG) => (
                    <button
                      key={presetG}
                      type="button"
                      onClick={() => {
                        setConcentrateMass(presetG);
                        setJustApplied(false);
                      }}
                      className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums transition-colors ${
                        concentrateMass === presetG
                          ? 'bg-[var(--theme-accent)] text-white'
                          : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                      }`}
                    >
                      {presetG} {gUnit}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
                <label
                  htmlFor="dil-bottle-ml"
                  className="block text-[11px] font-medium text-[#6B6D68] mb-1.5"
                >
                  {tr(language, {
                    ru: 'Целевой объём флакона (мл)',
                    en: 'Target finished bottle volume (ml)',
                    it: 'Volume finale flacone target (ml)',
                    es: 'Volumen final frasco objetivo (ml)',
                    de: 'Zielvolumen des fertigen Flakons (ml)',
                  })}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="dil-bottle-ml"
                    type="number"
                    min={1}
                    step="1"
                    value={targetBottleMl}
                    onChange={(e) => {
                      setTargetBottleMl(Math.max(1, Number(e.target.value) || 1));
                      setJustApplied(false);
                    }}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                  <span className="text-xs text-[#6B6D68] shrink-0">{mlUnit}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[5, 10, 15, 30, 50, 100].map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => {
                        setTargetBottleMl(ml);
                        setJustApplied(false);
                      }}
                      className={`rounded px-2 py-0.5 font-mono text-[11px] tabular-nums transition-colors ${
                        targetBottleMl === ml
                          ? 'bg-[var(--theme-accent)] text-white'
                          : 'bg-[#F3F2F1] text-[#575955] hover:bg-[#E4E4E0]'
                      }`}
                    >
                      {ml} {mlUnit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5 space-y-2.5">
              <div>
                <label
                  htmlFor="dil-source-purity"
                  className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                >
                  {tr(language, {
                    ru: 'Чистота исходной композиции (%)',
                    en: 'Starting composition purity (%)',
                    it: 'Purezza composizione iniziale (%)',
                    es: 'Pureza de composición inicial (%)',
                    de: 'Reinheit der Ausgangskomposition (%)',
                  })}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="dil-source-purity"
                    type="number"
                    min={1}
                    max={100}
                    step="1"
                    value={sourcePurityPercent}
                    onChange={(e) => {
                      const nextPurity = Math.max(1, Math.min(100, Number(e.target.value) || 100));
                      setSourcePurityPercent(nextPurity);
                      if (targetPercent > nextPurity) setTargetPercent(nextPurity);
                      setJustApplied(false);
                    }}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                  <span className="text-xs text-[#6B6D68]">%</span>
                </div>
              </div>
              <p className="text-[11px] text-[#787A74]">
                {tr(language, {
                  ru: '100% для чистого концентрата; ниже — если база уже частично разведена.',
                  en: 'Use 100% for neat concentrate, or lower if already pre-diluted.',
                  it: '100% per concentrato puro; più basso se già pre-diluito.',
                  es: '100% para concentrado puro; menor si ya está prediluido.',
                  de: '100% für reines Konzentrat; niedriger bei vorverdünnter Basis.',
                })}
              </p>
            </div>

            <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
              <label
                htmlFor="dil-solvent-density"
                className="block text-[11px] font-medium text-[#6B6D68] mb-1"
              >
                {tr(language, {
                  ru: 'Плотность растворителя (г/мл)',
                  en: 'Solvent density (g/ml)',
                  it: 'Densità solvente (g/ml)',
                  es: 'Densidad del disolvente (g/ml)',
                  de: 'Lösungsmitteldichte (g/ml)',
                })}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="dil-solvent-density"
                  type="number"
                  min={0.5}
                  max={1.5}
                  step="0.005"
                  value={solventDensity}
                  onChange={(e) => {
                    setSolventKey('custom');
                    setSolventDensity(Math.max(0.5, Math.min(1.5, Number(e.target.value) || 0.805)));
                    setJustApplied(false);
                  }}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-3 py-1.5 font-mono text-sm tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                />
                <span className="text-xs text-[#6B6D68] shrink-0">
                  {gUnit}/{mlUnit}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-[#E4E4E0] bg-white p-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="dil-conc-density"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Плотн. конц.',
                      en: 'Conc. density',
                      it: 'Dens. conc.',
                      es: 'Dens. conc.',
                      de: 'Konz.-Dichte',
                    })}
                  </label>
                  <input
                    id="dil-conc-density"
                    type="number"
                    min={0.5}
                    max={1.5}
                    step="0.01"
                    value={concentrateDensity}
                    onChange={(e) => {
                      setConcentrateDensity(
                        Math.max(0.5, Math.min(1.5, Number(e.target.value) || 0.95))
                      );
                    }}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5 font-mono text-sm tabular-nums text-[#181917]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dil-batch-count"
                    className="block text-[11px] font-medium text-[#6B6D68] mb-1"
                  >
                    {tr(language, {
                      ru: 'Партия (шт.)',
                      en: 'Batch (pcs)',
                      it: 'Lotto (pz)',
                      es: 'Lote (uds)',
                      de: 'Charge (Stk.)',
                    })}
                  </label>
                  <input
                    id="dil-batch-count"
                    type="number"
                    min={1}
                    max={1000}
                    step="1"
                    value={bottleCount}
                    onChange={(e) =>
                      setBottleCount(Math.max(1, Math.round(Number(e.target.value) || 1)))
                    }
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAFBF9] px-2.5 py-1.5 font-mono text-sm tabular-nums text-[#181917]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-[#D2D0CE] bg-[#FAFBF9] p-5 space-y-4">
          <div className="flex items-baseline justify-between gap-2 border-b border-[#E4E4E0] pb-3">
            <div>
              <div className="text-xs font-medium text-[#6B6D68]">
                {tr(language, {
                  ru: 'Необходимо растворителя',
                  en: 'Required Solvent',
                  it: 'Solvente necessario',
                  es: 'Disolvente necesario',
                  de: 'Benötigtes Lösungsmittel',
                })}{' '}
                ({activeSolventPreset.labels[language]})
              </div>
              <div className="mt-1 flex items-baseline gap-2.5 font-mono tabular-nums">
                <span className="text-3xl font-bold text-[var(--theme-accent)]">
                  {result.solventMass.toFixed(2)} {gUnit}
                </span>
                <span className="text-base font-semibold text-[#575955]">
                  ≈ {result.solventMl.toFixed(2)} {mlUnit}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#E4E4E0]">
              <div
                style={{ width: `${compSharePct}%` }}
                className="bg-[var(--theme-accent)] transition-all duration-200"
              />
              <div
                style={{ width: `${solventSharePct}%` }}
                className="bg-[#94A3B8] transition-all duration-200"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#575955] tabular-nums">
              <span>
                {tr(language, {
                  ru: 'Композиция:',
                  en: 'Composition:',
                  it: 'Composizione:',
                  es: 'Composición:',
                  de: 'Komposition:',
                })}{' '}
                {formatPercent(compSharePct, 1)}
              </span>
              <span>
                {tr(language, {
                  ru: 'Растворитель:',
                  en: 'Solvent:',
                  it: 'Solvente:',
                  es: 'Disolvente:',
                  de: 'Lösungsmittel:',
                })}{' '}
                {formatPercent(solventSharePct, 1)}
              </span>
            </div>
          </div>

          <dl className="divide-y divide-[#EAEAE6] text-xs">
            <div className="flex items-center justify-between py-2">
              <dt className="text-[#6B6D68]">
                {tr(language, {
                  ru: 'Парфюмерная композиция',
                  en: 'Perfume composition',
                  it: 'Composizione profumata',
                  es: 'Composición aromática',
                  de: 'Parfümkomposition',
                })}
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-[#181917]">
                {result.compMass.toFixed(2)} {gUnit}{' '}
                <span className="font-normal text-[#6B6D68]">
                  ({result.compMl.toFixed(2)} {mlUnit})
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[#6B6D68]">
                {tr(language, {
                  ru: 'Чистое ароматическое вещество',
                  en: 'Pure aromatic substance',
                  it: 'Sostanza aromatica pura',
                  es: 'Sustancia aromática pura',
                  de: 'Reiner Duftstoffanteil',
                })}
              </dt>
              <dd className="font-mono font-medium tabular-nums text-[#181917]">
                {result.pureAromaMass.toFixed(2)} {gUnit}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[#6B6D68]">
                {tr(language, {
                  ru: 'Итого готового парфюма',
                  en: 'Total finished perfume',
                  it: 'Totale profumo finito',
                  es: 'Total de perfume terminado',
                  de: 'Fertiges Parfüm gesamt',
                })}
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-[#181917]">
                {result.totalMass.toFixed(2)} {gUnit}{' '}
                <span className="font-normal text-[#6B6D68]">
                  (≈ {result.totalMl.toFixed(1)} {mlUnit})
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[#6B6D68]">
                {tr(language, {
                  ru: 'Итоговая концентрация (по массе)',
                  en: 'Achieved concentration (w/w)',
                  it: 'Concentrazione ottenuta (p/p)',
                  es: 'Concentración alcanzada (p/p)',
                  de: 'Erreichte Konzentration (m/m)',
                })}
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
                {formatPercent(result.achievedPct, 1)}
              </dd>
            </div>
          </dl>

          {safeBatchCount > 1 && (
            <div className="rounded-lg border border-[#E4E4E0] bg-white p-3 space-y-1">
              <div className="text-[11px] font-semibold text-[#181917]">
                {tr(language, {
                  ru: `Итого на партию (${safeBatchCount} ${pcsUnit}):`,
                  en: `Batch total for ${safeBatchCount} bottles:`,
                  it: `Totale lotto per ${safeBatchCount} flaconi:`,
                  es: `Total del lote para ${safeBatchCount} frascos:`,
                  de: `Chargensumme für ${safeBatchCount} Flakons:`,
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-[#3F413D]">
                <span>
                  {tr(language, { ru: 'Композ.:', en: 'Conc.:', it: 'Comp.:', es: 'Comp.:', de: 'Komp.:' })}{' '}
                  {(result.compMass * safeBatchCount).toFixed(1)} {gUnit}
                </span>
                <span>
                  {tr(language, {
                    ru: 'Растворитель:',
                    en: 'Solvent:',
                    it: 'Solvente:',
                    es: 'Disolvente:',
                    de: 'Lösungsmittel:',
                  })}{' '}
                  {(result.solventMass * safeBatchCount).toFixed(1)} {gUnit} (
                  {(result.solventMl * safeBatchCount).toFixed(1)} {mlUnit})
                </span>
                <span>
                  {tr(language, { ru: 'Выход:', en: 'Total:', it: 'Resa:', es: 'Total:', de: 'Gesamt:' })}{' '}
                  {(result.totalMl * safeBatchCount).toFixed(0)} {mlUnit}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-[#EAEAE6]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xs font-semibold text-[#181917]">
            {tr(language, {
              ru: 'Сравнение расхода растворителя для разных концентраций (нажмите на строку для выбора)',
              en: 'Quick comparison across standard concentrations (click a row to select)',
              it: 'Confronto rapido tra concentrazioni standard (clicca una riga per selezionare)',
              es: 'Comparación rápida entre concentraciones estándar (haz clic para seleccionar)',
              de: 'Schnellvergleich gängiger Konzentrationen (Zeile zum Auswählen anklicken)',
            })}
          </h3>
          <span className="text-[11px] text-[#787A74] tabular-nums">
            {mode === 'from_concentrate'
              ? tr(language, {
                  ru: `База: ${concentrateMass} ${gUnit} (${safeSourcePurity}%)`,
                  en: `Base: ${concentrateMass} ${gUnit} (${safeSourcePurity}%)`,
                  it: `Base: ${concentrateMass} ${gUnit} (${safeSourcePurity}%)`,
                  es: `Base: ${concentrateMass} ${gUnit} (${safeSourcePurity}%)`,
                  de: `Basis: ${concentrateMass} ${gUnit} (${safeSourcePurity}%)`,
                })
              : tr(language, {
                  ru: `Целевой флакон: ${targetBottleMl} ${mlUnit}`,
                  en: `Target bottle: ${targetBottleMl} ${mlUnit}`,
                  it: `Flacone target: ${targetBottleMl} ${mlUnit}`,
                  es: `Frasco objetivo: ${targetBottleMl} ${mlUnit}`,
                  de: `Zielflakon: ${targetBottleMl} ${mlUnit}`,
                })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4E4E0] text-[11px] font-semibold text-[#6B6D68]">
                <th className="py-2 pr-3">
                  {tr(language, {
                    ru: 'Концентрация',
                    en: 'Concentration',
                    it: 'Concentrazione',
                    es: 'Concentración',
                    de: 'Konzentration',
                  })}
                </th>
                <th className="py-2 px-2 text-right">
                  {tr(language, { ru: 'Доля', en: 'Strength', it: 'Forza', es: 'Fuerza', de: 'Stärke' })}
                </th>
                <th className="py-2 px-2 text-right">
                  {tr(language, {
                    ru: 'Композиция',
                    en: 'Composition',
                    it: 'Composizione',
                    es: 'Composición',
                    de: 'Komposition',
                  })}
                </th>
                <th className="py-2 px-2 text-right">
                  {tr(language, {
                    ru: `Растворитель (${gUnit})`,
                    en: `Solvent (${gUnit})`,
                    it: `Solvente (${gUnit})`,
                    es: `Disolvente (${gUnit})`,
                    de: `Lösungsmittel (${gUnit})`,
                  })}
                </th>
                <th className="py-2 px-2 text-right">
                  {tr(language, {
                    ru: `Растворитель (${mlUnit})`,
                    en: `Solvent (${mlUnit})`,
                    it: `Solvente (${mlUnit})`,
                    es: `Disolvente (${mlUnit})`,
                    de: `Lösungsmittel (${mlUnit})`,
                  })}
                </th>
                <th className="py-2 pl-2 text-right">
                  {tr(language, {
                    ru: 'Готовый объём',
                    en: 'Total Yield',
                    it: 'Resa totale',
                    es: 'Rendimiento total',
                    de: 'Gesamtausbeute',
                  })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAE6]">
              {comparisonRows.map((row) => {
                const isSelected =
                  concentrationChoice === row.key ||
                  Math.abs(safeTargetPct - row.defaultPct) < 0.05;
                return (
                  <tr
                    key={row.key}
                    onClick={() => row.feasible && handleSelectConcentration(row.key)}
                    className={`transition-colors ${
                      row.feasible ? 'cursor-pointer' : 'opacity-50'
                    } ${
                      isSelected
                        ? 'bg-[var(--theme-accent-soft)] font-medium'
                        : 'hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <td className="py-2 pr-3">
                      <span className="font-medium text-[#181917]">{row.labels[language]}</span>{' '}
                      <span className="text-[11px] text-[#787A74]">({row.range})</span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-[var(--theme-accent)]">
                      {row.defaultPct}%
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-[#3F413D]">
                      {row.compMass.toFixed(2)} {gUnit}
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-semibold tabular-nums text-[#181917]">
                      {row.solventMass.toFixed(2)} {gUnit}
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-[#575955]">
                      {row.solventMl.toFixed(2)} {mlUnit}
                    </td>
                    <td className="py-2 pl-2 text-right font-mono tabular-nums text-[#3F413D]">
                      {row.totalMass.toFixed(1)} {gUnit} · ~{row.totalMl.toFixed(1)} {mlUnit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
