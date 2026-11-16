import {
  AlertTriangle,
  BookMarked,
  Check,
  ExternalLink,
  FilePlus2,
  FlaskConical,
  Layers,
  Plus,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  CONCENTRATION_TARGET_PERCENT,
  formatUnit,
  getNoteTierShort,
  getOlfactoryFamilyShort,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import { resolveIfraStandard } from '../data/ifraStandards';
import {
  buildScaledFormulaComponents,
  matchStarterComponentToStock,
  STARTER_FORMULAS,
  STARTER_SOURCE_LINKS,
  type StarterFormulaDifficulty,
  type StarterFormulaKind,
  type StarterFormulaSource,
  type StarterFormulaSpec,
} from '../data/starterFormulasData';
import type {
  AppLanguage,
  Ingredient,
  OlfactoryFamilyKey,
  PerfumeProject,
} from '../types/perfume';
import { formatGrams, formatPercent, getIngredientStockGrams } from '../utils/calculations';

interface StarterFormulasCatalogProps {
  language: AppLanguage;
  ingredients: Ingredient[];
  projects?: PerfumeProject[];
  selectedProject: PerfumeProject | null;
  defaultConcentrateGrams: number;
  initialSelectedFormulaId?: string | null;
  onCreateProjectFromFormula: (
    formula: StarterFormulaSpec,
    targetConcentrateGrams: number,
    includeSolvent: boolean
  ) => void;
  onAppendFormulaToProject: (
    formula: StarterFormulaSpec,
    targetConcentrateGrams: number,
    includeSolvent: boolean,
    targetProjectId?: string
  ) => void;
  onAddIngredientToCart?: (
    spec: StarterFormulaSpec['components'][number],
    neededGrams: number
  ) => void;
}

const SOURCES: ('all' | StarterFormulaSource)[] = [
  'all',
  'Fraterworks',
  'TGSC',
  'Jean Carles',
  'Givaudan / IFF',
  'Basenotes / Reddit',
];

export function StarterFormulasCatalog({
  language,
  ingredients,
  projects = [],
  selectedProject,
  defaultConcentrateGrams,
  initialSelectedFormulaId,
  onCreateProjectFromFormula,
  onAppendFormulaToProject,
  onAddIngredientToCart,
}: StarterFormulasCatalogProps) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | StarterFormulaSource>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | StarterFormulaDifficulty>('all');
  const [kindFilter, setKindFilter] = useState<'all' | StarterFormulaKind>('all');
  const [familyFilter, setFamilyFilter] = useState<'all' | OlfactoryFamilyKey>('all');
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedFormulaId || STARTER_FORMULAS[0]?.id || ''
  );
  const [visibleCount, setVisibleCount] = useState<number>(40);
  const [targetProjectId, setTargetProjectId] = useState<string>(
    selectedProject?.id || projects[0]?.id || ''
  );
  const [concentrateDraft, setConcentrateDraft] = useState<string>(
    String(defaultConcentrateGrams > 0 ? defaultConcentrateGrams : 10)
  );
  const [includeSolvent, setIncludeSolvent] = useState(true);
  const [addedCartKeys, setAddedCartKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSelectedFormulaId) {
      setSelectedId(initialSelectedFormulaId);
    }
  }, [initialSelectedFormulaId]);

  useEffect(() => {
    if (selectedProject?.id) {
      setTargetProjectId(selectedProject.id);
    } else if (!targetProjectId && projects[0]?.id) {
      setTargetProjectId(projects[0].id);
    }
  }, [selectedProject?.id, projects, targetProjectId]);

  useEffect(() => {
    setVisibleCount(40);
  }, [search, sourceFilter, difficultyFilter, kindFilter, familyFilter]);

  const effectiveTargetProject = useMemo(
    () =>
      projects.find((p) => p.id === targetProjectId) ||
      selectedProject ||
      projects[0] ||
      null,
    [projects, targetProjectId, selectedProject]
  );

  const filteredFormulas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STARTER_FORMULAS.filter((f) => {
      if (sourceFilter !== 'all' && f.source !== sourceFilter) return false;
      if (difficultyFilter !== 'all' && f.difficulty !== difficultyFilter) return false;
      if (kindFilter !== 'all' && f.kind !== kindFilter) return false;
      if (familyFilter !== 'all' && f.family !== familyFilter) return false;
      if (!q) return true;
      return (
        f.title[language].toLowerCase().includes(q) ||
        f.title.en.toLowerCase().includes(q) ||
        f.source.toLowerCase().includes(q) ||
        f.sourceDetail.toLowerCase().includes(q) ||
        f.description[language].toLowerCase().includes(q) ||
        f.description.en.toLowerCase().includes(q) ||
        f.components.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.aliases || []).some((a) => a.toLowerCase().includes(q))
        )
      );
    });
  }, [search, sourceFilter, difficultyFilter, kindFilter, familyFilter, language]);

  const visibleFormulas = useMemo(
    () => filteredFormulas.slice(0, visibleCount),
    [filteredFormulas, visibleCount]
  );

  const activeFormula = useMemo(
    () =>
      filteredFormulas.find((f) => f.id === selectedId) ||
      filteredFormulas[0] ||
      STARTER_FORMULAS[0],
    [filteredFormulas, selectedId]
  );

  const parsedConcentrateGrams = useMemo(() => {
    const val = Number(concentrateDraft);
    return Number.isFinite(val) && val > 0 ? val : 10;
  }, [concentrateDraft]);

  const previewRows = useMemo(() => {
    if (!activeFormula) return [];
    const totalParts =
      activeFormula.components.reduce((sum, c) => sum + Math.max(0, c.partsPerThousand), 0) || 1000;
    const targetPct =
      (
        CONCENTRATION_TARGET_PERCENT[activeFormula.targetConcentration] ??
        CONCENTRATION_TARGET_PERCENT.EDP
      ).defaultPct || 15;
    const finishedBatchGrams = parsedConcentrateGrams / (targetPct / 100);

    return activeFormula.components.map((spec) => {
      const matched = matchStarterComponentToStock(spec, ingredients);
      const stockGrams = matched ? getIngredientStockGrams(matched) : null;
      const massGrams = Number(
        ((spec.partsPerThousand / totalParts) * parsedConcentrateGrams).toFixed(3)
      );
      const pctOfConc = (spec.partsPerThousand / totalParts) * 100;
      const effectiveDilution = matched ? matched.dilutionPercent : spec.dilutionPercent;
      const pureMassGrams = massGrams * (Math.min(100, Math.max(0, effectiveDilution)) / 100);
      const pctInFinished =
        finishedBatchGrams > 0 ? (pureMassGrams / finishedBatchGrams) * 100 : 0;

      const ifraStd = resolveIfraStandard({
        name: spec.name,
        inciOrCas: matched?.inciOrCas,
        aliases: spec.aliases,
      });
      const ifraLimit =
        ifraStd !== undefined ? ifraStd.category4LimitPercent : matched?.ifraLimitPercent;
      const isBanned =
        ifraStd?.status === 'prohibited' ||
        ifraStd?.status === 'eu_banned' ||
        ifraLimit === 0;
      const exceedsIfra = isBanned
        ? massGrams > 0
        : ifraLimit !== undefined && pctInFinished > ifraLimit;

      const inStockEnough =
        Boolean(matched) &&
        matched?.status === 'in_stock' &&
        (stockGrams === null || stockGrams >= massGrams - 0.001);

      return {
        spec,
        matched,
        stockGrams,
        massGrams,
        pctOfConc,
        pctInFinished,
        ifraStd,
        ifraLimit,
        isBanned,
        exceedsIfra,
        inStockEnough,
      };
    });
  }, [activeFormula, ingredients, parsedConcentrateGrams]);

  const previewSolventInfo = useMemo(() => {
    if (!activeFormula) return { solventGrams: 0, totalGrams: parsedConcentrateGrams, targetPct: 15 };
    const scaled = buildScaledFormulaComponents(
      activeFormula,
      parsedConcentrateGrams,
      includeSolvent,
      ingredients,
      language
    );
    const solventLine = scaled.find((c) => c.tier === 'solvent');
    const totalGrams = scaled.reduce((s, c) => s + c.weightGrams, 0);
    return {
      solventGrams: solventLine?.weightGrams || 0,
      totalGrams,
      targetPct: (CONCENTRATION_TARGET_PERCENT[activeFormula.targetConcentration] ?? CONCENTRATION_TARGET_PERCENT.EDP).defaultPct,
    };
  }, [activeFormula, parsedConcentrateGrams, includeSolvent, ingredients, language]);

  const formulaMetaMap = useMemo(() => {
    const map = new Map<string, { available: number; total: number; ifraAlerts: number }>();
    for (const f of STARTER_FORMULAS) {
      let available = 0;
      let ifraAlerts = 0;
      const totalParts =
        f.components.reduce((sum, c) => sum + Math.max(0, c.partsPerThousand), 0) || 1000;
      const targetPct =
        (CONCENTRATION_TARGET_PERCENT[f.targetConcentration] ?? CONCENTRATION_TARGET_PERCENT.EDP)
          .defaultPct || 15;

      for (const c of f.components) {
        const m = matchStarterComponentToStock(c, ingredients);
        if (m && m.status === 'in_stock') available += 1;
        const dil = m ? m.dilutionPercent : c.dilutionPercent;
        const pctInFinished = (c.partsPerThousand / totalParts) * (dil / 100) * targetPct;
        const std = resolveIfraStandard({
          name: c.name,
          inciOrCas: m?.inciOrCas,
          aliases: c.aliases,
        });
        const limit = std !== undefined ? std.category4LimitPercent : m?.ifraLimitPercent;
        const banned = std?.status === 'prohibited' || std?.status === 'eu_banned' || limit === 0;
        if (banned ? c.partsPerThousand > 0 : limit !== undefined && pctInFinished > limit) {
          ifraAlerts += 1;
        }
      }
      map.set(f.id, { available, total: f.components.length, ifraAlerts });
    }
    return map;
  }, [ingredients]);

  const getFormulaMetaSummary = (f: StarterFormulaSpec) =>
    formulaMetaMap.get(f.id) || { available: 0, total: f.components.length, ifraAlerts: 0 };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E1DFDD] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">
            {tr(language, {
              ru: 'Готовые формулы и аккорды для старта',
              en: 'Starter Formulas & Community Accords',
              it: 'Formule Pronte e Accordi Base',
              es: 'Fórmulas Listas y Acordes Base',
              de: 'Einsteiger-Formeln & Basis-Akkorde',
            })}
          </h1>
          <p className="mt-1 text-sm text-[#605E5C]">
            {tr(language, {
              ru: '124 демо-формулы Fraterworks, учебные скелеты Жана Карля, TGSC, Basenotes и парфюмерных домов — выберите рецепт, чтобы открыть состав и добавить его в проект.',
              en: '124 Fraterworks demo formulas, Jean Carles textbook structures, TGSC, Basenotes, and major house accords — select a formula to inspect and add it to your project.',
              it: 'Formule didattiche e accordi da Fraterworks, Jean Carles, TGSC e Basenotes.',
              es: 'Fórmulas didácticas y acordes de Fraterworks, Jean Carles, TGSC y Basenotes.',
              de: 'Lehrformeln und Akkorde von Fraterworks, Jean Carles, TGSC und Basenotes.',
            })}
          </p>
        </div>

        <div className="text-xs text-[#605E5C] tabular-nums">
          {tr(language, {
            ru: `Показано ${filteredFormulas.length} из ${STARTER_FORMULAS.length}`,
            en: `Showing ${filteredFormulas.length} of ${STARTER_FORMULAS.length}`,
            it: `${filteredFormulas.length} di ${STARTER_FORMULAS.length}`,
            es: `${filteredFormulas.length} de ${STARTER_FORMULAS.length}`,
            de: `${filteredFormulas.length} von ${STARTER_FORMULAS.length}`,
          })}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E1DFDD] bg-white p-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#605E5C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr(language, {
                ru: 'Поиск по формуле, источнику или компоненту (Iso E, Роза, Фужер...)...',
                en: 'Search formula, source, or material (Iso E, Rose, Fougere...)...',
                it: 'Cerca formula, fonte o materiale...',
                es: 'Buscar fórmula, fuente o ingrediente...',
                de: 'Suche nach Formel, Quelle oder Rohstoff...',
              })}
              className="w-full rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] py-1.5 pl-9 pr-3 text-xs text-[#181917] placeholder:text-[#8A8886] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 rounded-lg bg-[#F3F2F1] p-0.5">
            {(
              [
                ['all', { ru: 'Любой уровень', en: 'All levels', it: 'Tutti', es: 'Todos', de: 'Alle' }],
                ['beginner', { ru: 'Новичкам', en: 'Beginner', it: 'Base', es: 'Principiante', de: 'Einsteiger' }],
                ['intermediate', { ru: 'Средний', en: 'Intermediate', it: 'Intermedio', es: 'Intermedio', de: 'Mittel' }],
              ] as const
            ).map(([key, labels]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDifficultyFilter(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  difficultyFilter === key
                    ? 'bg-white text-[#181917] shadow-sm'
                    : 'text-[#605E5C] hover:text-[#181917]'
                }`}
              >
                {labels[language]}
              </button>
            ))}
          </div>

          {/* Kind Filter */}
          <div className="flex items-center gap-1 rounded-lg bg-[#F3F2F1] p-0.5">
            {(
              [
                ['all', { ru: 'Всё', en: 'All', it: 'Tutto', es: 'Todo', de: 'Alle' }],
                ['accord', { ru: 'Аккорды', en: 'Accords', it: 'Accordi', es: 'Acordes', de: 'Akkorde' }],
                ['perfume', { ru: 'Композиции', en: 'Perfumes', it: 'Profumi', es: 'Perfumes', de: 'Parfüms' }],
              ] as const
            ).map(([key, labels]) => (
              <button
                key={key}
                type="button"
                onClick={() => setKindFilter(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  kindFilter === key
                    ? 'bg-white text-[#181917] shadow-sm'
                    : 'text-[#605E5C] hover:text-[#181917]'
                }`}
              >
                {labels[language]}
              </button>
            ))}
          </div>

          {/* Family Filter */}
          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value as 'all' | OlfactoryFamilyKey)}
            className="rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
            aria-label={tr(language, {
              ru: 'Ольфакторное семейство',
              en: 'Olfactory family',
              it: 'Famiglia olfattiva',
              es: 'Familia olfativa',
              de: 'Duftfamilie',
            })}
          >
            <option value="all">
              {tr(language, {
                ru: 'Все семейства',
                en: 'All families',
                it: 'Tutte le famiglie',
                es: 'Todas las familias',
                de: 'Alle Familien',
              })}
            </option>
            {OLFACTORY_FAMILIES.map((fam) => (
              <option key={fam.key} value={fam.key}>
                {getOlfactoryFamilyShort(fam.key, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter Row + External Portal Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EDEBE9] pt-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-[#605E5C] mr-1">
              {tr(language, {
                ru: 'Источник:',
                en: 'Source:',
                it: 'Fonte:',
                es: 'Fuente:',
                de: 'Quelle:',
              })}
            </span>
            {SOURCES.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSourceFilter(src)}
                className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap transition-colors ${
                  sourceFilter === src
                    ? 'bg-[var(--theme-accent)] text-white'
                    : 'bg-[#FAF9F8] text-[#4B4E49] hover:bg-[#EDEBE9]'
                }`}
              >
                {src === 'all'
                  ? tr(language, { ru: 'Все базы', en: 'All sources', it: 'Tutte', es: 'Todas', de: 'Alle' })
                  : src}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#605E5C]">
            {STARTER_SOURCE_LINKS.map((link) => (
              <a
                key={link.source}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded border border-[#E1DFDD] bg-[#FAF9F8] px-2 py-0.5 font-medium text-[#323130] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] transition-colors whitespace-nowrap"
                title={`${link.labels?.[language] || link.label} — ${link.url}`}
              >
                <span>{link.source}</span>
                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split View: Formula Directory (Left) + Inspector (Right) */}
      {filteredFormulas.length === 0 ? (
        <div className="rounded-xl border border-[#E1DFDD] bg-white px-6 py-12 text-center">
          <BookMarked className="mx-auto h-7 w-7 text-[#8A8886]" />
          <div className="mt-2 text-sm font-semibold text-[#181917]">
            {tr(language, {
              ru: 'По фильтрам формулы не найдены',
              en: 'No formulas match your filters',
              it: 'Nessuna formula trovata',
              es: 'No se encontraron fórmulas',
              de: 'Keine passenden Formeln gefunden',
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSourceFilter('all');
              setDifficultyFilter('all');
              setKindFilter('all');
              setFamilyFilter('all');
            }}
            className="mt-3 rounded-lg border border-[#D2D0CE] bg-white px-3.5 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
          >
            {tr(language, {
              ru: 'Сбросить фильтры',
              en: 'Reset filters',
              it: 'Reimposta filtri',
              es: 'Restablecer filtros',
              de: 'Filter zurücksetzen',
            })}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Directory List */}
          <div className="lg:col-span-5 rounded-xl border border-[#E1DFDD] bg-white overflow-hidden divide-y divide-[#EDEBE9] lg:max-h-[760px] lg:overflow-y-auto">
            {visibleFormulas.map((f) => {
              const isSelected = activeFormula?.id === f.id;
              const stockInfo = getFormulaMetaSummary(f);
              return (
                <div
                  key={f.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(f.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(f.id);
                    }
                  }}
                  className={`w-full px-4 py-3 text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--theme-accent)] ${
                    isSelected
                      ? 'bg-[var(--theme-accent-soft)]/70'
                      : 'bg-white hover:bg-[#FAF9F8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`text-sm font-semibold leading-snug ${
                        isSelected ? 'text-[var(--theme-accent)]' : 'text-[#181917]'
                      }`}
                    >
                      {f.title[language]}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[11px] text-[#605E5C] tabular-nums">
                        {f.targetConcentration}
                      </span>
                    </div>
                  </div>

                  {/* Clean unboxed inline metadata with middot separators */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-[#605E5C]">
                    <span className="font-medium text-[#323130]">{f.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {f.kind === 'accord'
                        ? tr(language, {
                            ru: 'Аккорд',
                            en: 'Accord',
                            it: 'Accordo',
                            es: 'Acorde',
                            de: 'Akkord',
                          })
                        : tr(language, {
                            ru: 'Композиция',
                            en: 'Perfume',
                            it: 'Profumo',
                            es: 'Perfume',
                            de: 'Parfüm',
                          })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {f.difficulty === 'beginner'
                        ? tr(language, {
                            ru: 'Новичкам',
                            en: 'Beginner',
                            it: 'Base',
                            es: 'Principiante',
                            de: 'Einsteiger',
                          })
                        : tr(language, {
                            ru: 'Средний',
                            en: 'Intermediate',
                            it: 'Intermedio',
                            es: 'Intermedio',
                            de: 'Mittel',
                          })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{getOlfactoryFamilyShort(f.family, language)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {f.components.length}{' '}
                      {tr(language, {
                        ru: 'комп.',
                        en: 'mat.',
                        it: 'mat.',
                        es: 'comp.',
                        de: 'Komp.',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`tabular-nums font-medium ${
                        stockInfo.available === stockInfo.total
                          ? 'text-[#15803D]'
                          : stockInfo.available > 0
                            ? 'text-[#B45309]'
                            : 'text-[#605E5C]'
                      }`}
                    >
                      {tr(language, {
                        ru: `На складе ${stockInfo.available}/${stockInfo.total}`,
                        en: `In stock ${stockInfo.available}/${stockInfo.total}`,
                        it: `In stock ${stockInfo.available}/${stockInfo.total}`,
                        es: `En stock ${stockInfo.available}/${stockInfo.total}`,
                        de: `Auf Lager ${stockInfo.available}/${stockInfo.total}`,
                      })}
                    </span>
                    {stockInfo.ifraAlerts > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-0.5 font-medium text-[#B91C1C] tabular-nums">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          IFRA {stockInfo.ifraAlerts}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-[#605E5C] line-clamp-2 leading-relaxed">
                    {f.description[language]}
                  </p>
                </div>
              );
            })}

            {filteredFormulas.length > visibleCount && (
              <div className="flex items-center justify-between gap-2 bg-[#FAF9F8] px-4 py-3 text-xs">
                <span className="text-[#605E5C]">
                  {tr(language, {
                    ru: `Показано ${visibleFormulas.length} из ${filteredFormulas.length}`,
                    en: `Showing ${visibleFormulas.length} of ${filteredFormulas.length}`,
                    it: `${visibleFormulas.length} di ${filteredFormulas.length}`,
                    es: `${visibleFormulas.length} de ${filteredFormulas.length}`,
                    de: `${visibleFormulas.length} von ${filteredFormulas.length}`,
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 40)}
                    className="rounded-lg border border-[#D2D0CE] bg-white px-3 py-1 font-semibold text-[#181917] hover:bg-[#F3F2F1]"
                  >
                    {tr(language, {
                      ru: 'Показать ещё 40',
                      en: 'Show 40 more',
                      it: 'Mostra altri 40',
                      es: 'Mostrar 40 más',
                      de: '40 weitere zeigen',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredFormulas.length)}
                    className="rounded-lg border border-[#D2D0CE] bg-white px-3 py-1 font-medium text-[#605E5C] hover:text-[#181917]"
                  >
                    {tr(language, {
                      ru: 'Показать все',
                      en: 'Show all',
                      it: 'Mostra tutte',
                      es: 'Mostrar todas',
                      de: 'Alle zeigen',
                    })}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Formula Inspector */}
          {activeFormula && (
            <div className="lg:col-span-7 lg:sticky lg:top-4 rounded-xl border border-[#E1DFDD] bg-white overflow-hidden">
              {/* Inspector Header */}
              <div className="border-b border-[#EDEBE9] px-5 py-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#605E5C]">
                      <span className="font-semibold text-[var(--theme-accent)]">
                        {activeFormula.sourceDetail}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {activeFormula.kind === 'accord'
                          ? tr(language, {
                              ru: 'Базовый аккорд',
                              en: 'Base Accord',
                              it: 'Accordo Base',
                              es: 'Acorde Base',
                              de: 'Basis-Akkord',
                            })
                          : tr(language, {
                              ru: 'Готовая композиция',
                              en: 'Complete Fragrance',
                              it: 'Composizione Completa',
                              es: 'Fragancia Completa',
                              de: 'Komplette Komposition',
                            })}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{getOlfactoryFamilyShort(activeFormula.family, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {activeFormula.targetConcentration} ({previewSolventInfo.targetPct}%)
                      </span>
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-[#181917] leading-snug">
                      {activeFormula.title[language]}
                    </h2>
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {projects.length > 1 && (
                      <select
                        value={effectiveTargetProject?.id || ''}
                        onChange={(e) => setTargetProjectId(e.target.value)}
                        className="rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-2 text-xs font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none max-w-[190px] truncate"
                        aria-label={tr(language, {
                          ru: 'Целевой проект для добавления',
                          en: 'Target project',
                          it: 'Progetto di destinazione',
                          es: 'Proyecto de destino',
                          de: 'Zielprojekt',
                        })}
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
                      onClick={() =>
                        onAppendFormulaToProject(
                          activeFormula,
                          parsedConcentrateGrams,
                          activeFormula.kind === 'accord' ? false : includeSolvent,
                          effectiveTargetProject?.id
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--theme-accent)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft)] transition-colors whitespace-nowrap shrink-0"
                      title={
                        effectiveTargetProject
                          ? tr(language, {
                              ru: `Добавить компоненты в проект «${effectiveTargetProject.title}» (${effectiveTargetProject.code})`,
                              en: `Add components into project "${effectiveTargetProject.title}" (${effectiveTargetProject.code})`,
                              it: `Aggiungi componenti al progetto "${effectiveTargetProject.title}"`,
                              es: `Añadir componentes al proyecto "${effectiveTargetProject.title}"`,
                              de: `Rohstoffe zum Projekt "${effectiveTargetProject.title}" hinzufügen`,
                            })
                          : tr(language, {
                              ru: 'Добавить компоненты аккорда или формулы в проект',
                              en: 'Add accord or formula components to project',
                              it: 'Aggiungi al progetto',
                              es: 'Añadir al proyecto',
                              de: 'Zum Projekt hinzufügen',
                            })
                      }
                    >
                      <Layers className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {effectiveTargetProject
                          ? tr(language, {
                              ru: `Добавить в проект (${effectiveTargetProject.code})`,
                              en: `Add to project (${effectiveTargetProject.code})`,
                              it: `Aggiungi a ${effectiveTargetProject.code}`,
                              es: `Añadir a ${effectiveTargetProject.code}`,
                              de: `Zu ${effectiveTargetProject.code} hinzufügen`,
                            })
                          : tr(language, {
                              ru: 'Добавить в проект',
                              en: 'Add to project',
                              it: 'Aggiungi al progetto',
                              es: 'Añadir al proyecto',
                              de: 'Zum Projekt hinzufügen',
                            })}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onCreateProjectFromFormula(
                          activeFormula,
                          parsedConcentrateGrams,
                          includeSolvent
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--theme-accent-hover)] transition-colors whitespace-nowrap shrink-0"
                    >
                      <FilePlus2 className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {tr(language, {
                          ru: 'Создать новый проект',
                          en: 'Create New Project',
                          it: 'Crea Nuovo Progetto',
                          es: 'Crear Nuevo Proyecto',
                          de: 'Neues Projekt erstellen',
                        })}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#4B4E49]">
                  {activeFormula.description[language]}
                </p>

                <div className="rounded-lg bg-[#FAF9F8] px-3.5 py-2.5 text-xs text-[#3F413D]">
                  <span className="font-semibold text-[#181917]">
                    {tr(language, {
                      ru: 'Совет для практики: ',
                      en: 'Bench tip: ',
                      it: 'Consiglio pratico: ',
                      es: 'Consejo de práctica: ',
                      de: 'Praxis-Tipp: ',
                    })}
                  </span>
                  {activeFormula.studyTip[language]}
                </div>
              </div>

              {/* Concentrate Target Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEBE9] bg-[#FAF9F8] px-5 py-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-[#323130] font-medium">
                    <FlaskConical className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
                    <span>
                      {tr(language, {
                        ru: 'Вес концентрата:',
                        en: 'Concentrate mass:',
                        it: 'Peso concentrato:',
                        es: 'Peso concentrado:',
                        de: 'Konzentratgewicht:',
                      })}
                    </span>
                    <input
                      type="number"
                      min={0.5}
                      max={1000}
                      step="0.5"
                      value={concentrateDraft}
                      onChange={(e) => setConcentrateDraft(e.target.value)}
                      className="w-16 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-right font-mono text-xs font-semibold tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                    />
                    <span className="text-[#605E5C]">{formatUnit('г', language)}</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[#323130]">
                    <input
                      type="checkbox"
                      checked={includeSolvent}
                      onChange={(e) => setIncludeSolvent(e.target.checked)}
                      className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
                    />
                    <span>
                      {tr(language, {
                        ru: `Добавить расчёт спирта под ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                        en: `Include ethanol for ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                        it: `Includi alcol per ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                        es: `Incluir alcohol para ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                        de: `Ethanol für ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%) ergänzen`,
                      })}
                    </span>
                  </label>
                </div>

                <div className="text-[11.5px] text-[#605E5C] tabular-nums">
                  {includeSolvent && previewSolventInfo.solventGrams > 0 ? (
                    <span>
                      {tr(language, {
                        ru: 'Спирт:',
                        en: 'Ethanol:',
                        it: 'Alcol:',
                        es: 'Alcohol:',
                        de: 'Ethanol:',
                      })}{' '}
                      <strong className="font-mono text-[#181917]">
                        {formatGrams(previewSolventInfo.solventGrams, 2, language)}
                      </strong>{' '}
                      ·{' '}
                      {tr(language, {
                        ru: 'Итого с разбавлением:',
                        en: 'Total batch:',
                        it: 'Totale lotto:',
                        es: 'Total lote:',
                        de: 'Gesamtansatz:',
                      })}{' '}
                      <strong className="font-mono text-[var(--theme-accent)]">
                        {formatGrams(previewSolventInfo.totalGrams, 2, language)}
                      </strong>
                    </span>
                  ) : (
                    <span>
                      {tr(language, {
                        ru: 'Только концентрат:',
                        en: 'Concentrate only:',
                        it: 'Solo concentrato:',
                        es: 'Solo concentrado:',
                        de: 'Nur Konzentrat:',
                      })}{' '}
                      <strong className="font-mono text-[#181917]">
                        {formatGrams(parsedConcentrateGrams, 2, language)}
                      </strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Formula Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDEBE9] bg-[#FAF9F8] text-[11px] font-semibold text-[#605E5C]">
                      <th className="py-2.5 pl-5 pr-2">
                        {tr(language, {
                          ru: 'Компонент',
                          en: 'Material',
                          it: 'Materiale',
                          es: 'Ingrediente',
                          de: 'Rohstoff',
                        })}
                      </th>
                      <th className="py-2.5 px-2">
                        {tr(language, {
                          ru: 'Нота',
                          en: 'Tier',
                          it: 'Nota',
                          es: 'Nota',
                          de: 'Note',
                        })}
                      </th>
                      <th className="py-2.5 px-2 text-right">
                        {tr(language, {
                          ru: 'Развед.',
                          en: 'Dil. %',
                          it: 'Dil. %',
                          es: 'Dil. %',
                          de: 'Verd. %',
                        })}
                      </th>
                      <th className="py-2.5 px-2 text-right">
                        {tr(language, {
                          ru: 'Части / 1000',
                          en: 'Parts / 1000',
                          it: 'Parti / 1000',
                          es: 'Partes / 1000',
                          de: 'Teile / 1000',
                        })}
                      </th>
                      <th className="py-2.5 px-2 text-right">%</th>
                      <th className="py-2.5 px-2 text-right">
                        {tr(language, {
                          ru: `Вес (${formatUnit('г', language)})`,
                          en: `Mass (${formatUnit('г', language)})`,
                          it: `Peso (${formatUnit('г', language)})`,
                          es: `Peso (${formatUnit('г', language)})`,
                          de: `Masse (${formatUnit('г', language)})`,
                        })}
                      </th>
                      <th className="py-2.5 px-2 text-right">IFRA Cat. 4</th>
                      <th className="py-2.5 pl-2 pr-5 text-right">
                        {tr(language, {
                          ru: 'Склад',
                          en: 'Stock',
                          it: 'Stock',
                          es: 'Stock',
                          de: 'Lager',
                        })}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {previewRows.map(
                      (
                        {
                          spec,
                          matched,
                          stockGrams,
                          massGrams,
                          pctOfConc,
                          pctInFinished,
                          ifraStd,
                          ifraLimit,
                          isBanned,
                          exceedsIfra,
                          inStockEnough,
                        },
                        idx
                      ) => {
                      const cartKey = `${activeFormula.id}:${spec.name}`;
                      const wasAdded = Boolean(addedCartKeys[cartKey]);
                      return (
                        <tr key={`${activeFormula.id}-${idx}`} className="hover:bg-[#FAFBF9]">
                          <td className="py-2.5 pl-5 pr-2">
                            <div className="font-semibold text-[#181917]">
                              {matched ? matched.name : spec.name}
                            </div>
                            <div className="text-[11px] text-[#605E5C]">{spec.note[language]}</div>
                          </td>
                          <td className="py-2.5 px-2 text-[#4B4E49] whitespace-nowrap">
                            {getNoteTierShort(spec.tier, language)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#4B4E49]">
                            {matched ? matched.dilutionPercent : spec.dilutionPercent}%
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#4B4E49]">
                            {spec.partsPerThousand}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#4B4E49]">
                            {formatPercent(pctOfConc, 1)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono font-semibold tabular-nums text-[#181917]">
                            {formatGrams(massGrams, 3, language)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                            {isBanned ? (
                              <span className="font-semibold text-[#B91C1C]">
                                {tr(language, {
                                  ru: 'Запрет 0%',
                                  en: 'Ban 0%',
                                  it: 'Viet. 0%',
                                  es: 'Proh. 0%',
                                  de: 'Verb. 0%',
                                })}
                              </span>
                            ) : ifraStd?.status === 'exempt_fcf' ? (
                              <span className="font-medium text-[#15803D]">FCF</span>
                            ) : ifraLimit !== undefined ? (
                              <span
                                className={
                                  exceedsIfra ? 'font-semibold text-[#B91C1C]' : 'text-[#4B4E49]'
                                }
                              >
                                {exceedsIfra
                                  ? `${pctInFinished.toFixed(2)}% > ${ifraLimit}%`
                                  : `≤ ${ifraLimit}%`}
                              </span>
                            ) : ifraStd?.status === 'unrestricted' ? (
                              <span className="text-[#6B6D68]">
                                {tr(language, {
                                  ru: 'Своб.',
                                  en: 'Free',
                                  it: 'Lib.',
                                  es: 'Libre',
                                  de: 'Frei',
                                })}
                              </span>
                            ) : (
                              <span className="text-[#8A8886]">—</span>
                            )}
                          </td>
                          <td className="py-2.5 pl-2 pr-5 text-right whitespace-nowrap">
                            {inStockEnough ? (
                              <span className="font-mono text-[11px] font-medium text-[#15803D] tabular-nums">
                                {stockGrams !== null
                                  ? formatGrams(stockGrams, 1, language)
                                  : tr(language, {
                                      ru: 'В наличии',
                                      en: 'In stock',
                                      it: 'Disponibile',
                                      es: 'En stock',
                                      de: 'Auf Lager',
                                    })}
                              </span>
                            ) : onAddIngredientToCart ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const orderQty = Math.max(5, Math.ceil(massGrams * 5));
                                  onAddIngredientToCart(
                                    { ...spec, name: matched?.name || spec.name },
                                    orderQty
                                  );
                                  setAddedCartKeys((prev) => ({ ...prev, [cartKey]: true }));
                                }}
                                className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                  wasAdded
                                    ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                                    : 'border-[#D2D0CE] bg-white text-[#181917] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]'
                                }`}
                                title={tr(language, {
                                  ru: 'Добавить отсутствующий материал в корзину закупок',
                                  en: 'Add missing material to shopping cart',
                                  it: 'Aggiungi al carrello acquisti',
                                  es: 'Añadir material al carrito',
                                  de: 'Fehlenden Rohstoff in den Einkaufskorb legen',
                                })}
                              >
                                {wasAdded ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    <span>
                                      {tr(language, {
                                        ru: 'В корзине',
                                        en: 'In cart',
                                        it: 'Nel carrello',
                                        es: 'En carrito',
                                        de: 'Im Korb',
                                      })}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3" />
                                    <span>
                                      {tr(language, {
                                        ru: 'В корзину',
                                        en: 'To cart',
                                        it: 'Carrello',
                                        es: 'Al carrito',
                                        de: 'Korb',
                                      })}
                                    </span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#8A8886]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {includeSolvent && previewSolventInfo.solventGrams > 0 && (
                      <tr className="bg-[#FAF9F8]/60">
                        <td className="py-2.5 pl-5 pr-2">
                          <div className="font-semibold text-[#181917]">
                            {tr(language, {
                              ru: 'Этанол парфюмерный 96%',
                              en: "Perfumer's Alcohol 96%",
                              it: 'Alcol da Profumeria 96%',
                              es: 'Alcohol de Perfumería 96%',
                              de: 'Parfümerie-Ethanol 96%',
                            })}
                          </div>
                          <div className="text-[11px] text-[#605E5C]">
                            {tr(language, {
                              ru: `Авторасчёт растворителя под ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                              en: `Auto-matched solvent for ${activeFormula.targetConcentration} (${previewSolventInfo.targetPct}%)`,
                              it: `Solvente calcolato per ${activeFormula.targetConcentration}`,
                              es: `Disolvente calculado para ${activeFormula.targetConcentration}`,
                              de: `Lösungsmittel für ${activeFormula.targetConcentration}`,
                            })}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-[#605E5C]">
                          {getNoteTierShort('solvent', language)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C]">
                          100%
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C]">
                          —
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C]">
                          —
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-semibold tabular-nums text-[var(--theme-accent)]">
                          {formatGrams(previewSolventInfo.solventGrams, 2, language)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#605E5C]">
                          —
                        </td>
                        <td className="py-2.5 pl-2 pr-5 text-right text-[11px] text-[#605E5C]">
                          <Plus className="inline h-3 w-3 mr-0.5 text-[var(--theme-accent)]" />
                          {tr(language, {
                            ru: 'Авто',
                            en: 'Auto',
                            it: 'Auto',
                            es: 'Auto',
                            de: 'Auto',
                          })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
