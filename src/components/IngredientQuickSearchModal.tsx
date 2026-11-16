import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Copy,
  Flame,
  FlaskConical,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FAMILY_HEX_MAP,
  formatUnit,
  getCurrencySymbol,
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getOlfactoryFamilyLabel,
} from '../data/constants';
import {
  FRATERWORKS_REFERENCE_MATERIALS,
  FraterworksMaterialPassport,
  getLocalizedFacetName,
  getLocalizedVolatilityLabel,
  getMaterialScentPassport,
} from '../data/fraterworksProfiles';
import { tr } from '../data/i18n';
import { resolveIfraStandard } from '../data/ifraStandards';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  LibraryIngredient,
  PerfumeProject,
} from '../types/perfume';
import { formatCurrencyDecimal } from '../utils/calculations';
import { generateId, todayIsoDate } from '../utils/storage';

interface IngredientQuickSearchModalProps {
  open: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  library?: LibraryIngredient[];
  projects: PerfumeProject[];
  selectedProjectId: string | null;
  language: AppLanguage;
  currency: AppCurrency;
  onSelectOpenInCatalog: (ingredient: Ingredient) => void;
  onAddToProjectFormula: (
    ingredient: Ingredient,
    projectId: string,
    weightGrams: number
  ) => void;
  onAddMaterialToCatalog?: (ingredient: Ingredient) => void;
}

type QuickSourceFilter = 'all' | 'in_stock' | 'studio' | 'fraterworks' | 'library';

interface UnifiedSearchMaterial {
  uid: string;
  source: 'studio' | 'fraterworks' | 'library';
  name: string;
  inciOrCas?: string;
  passport: FraterworksMaterialPassport;
  studioIngredient?: Ingredient;
  libraryItem?: LibraryIngredient;
}

export function IngredientQuickSearchModal({
  open,
  onClose,
  ingredients,
  library = [],
  projects,
  selectedProjectId,
  language,
  currency,
  onSelectOpenInCatalog,
  onAddToProjectFormula,
  onAddMaterialToCatalog,
}: IngredientQuickSearchModalProps) {
  const gUnit = language === 'ru' ? 'г' : 'g';
  const currencySymbol = getCurrencySymbol(currency);

  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<QuickSourceFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetProjectId, setTargetProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );
  const [addWeight, setAddWeight] = useState('0.50');
  const [copiedName, setCopiedName] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setSourceFilter('all');
    setActiveIndex(0);
    setTargetProjectId(selectedProjectId || projects[0]?.id || '');
    setAddWeight('0.50');
    setCopiedName(false);
    setAddedFeedback(false);
    const raf = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open, selectedProjectId, projects]);

  // Build unified material encyclopedia (Studio + Fraterworks Reference + 1300+ Library)
  const allUnifiedMaterials = useMemo<UnifiedSearchMaterial[]>(() => {
    const items: UnifiedSearchMaterial[] = [];
    const seenNames = new Set<string>();

    // 1. Studio Stock Ingredients
    for (const ing of ingredients) {
      const passport = getMaterialScentPassport(ing);
      items.push({
        uid: `studio:${ing.id}`,
        source: 'studio',
        name: ing.name,
        inciOrCas: ing.inciOrCas || passport.inciOrCas,
        passport,
        studioIngredient: ing,
      });
      seenNames.add(ing.name.trim().toLowerCase());
    }

    // 2. Curated Fraterworks Reference Materials
    for (const fw of FRATERWORKS_REFERENCE_MATERIALS) {
      const lower = fw.name.trim().toLowerCase();
      if (seenNames.has(lower)) continue;
      items.push({
        uid: `fw:${fw.id}`,
        source: 'fraterworks',
        name: fw.name,
        inciOrCas: fw.inciOrCas,
        passport: fw,
      });
      seenNames.add(lower);
    }

    // 3. 1300+ Perfumery Library Materials
    for (const lib of library) {
      const lower = lib.name.trim().toLowerCase();
      if (seenNames.has(lower)) continue;
      const passport = getMaterialScentPassport(lib);
      items.push({
        uid: `lib:${lib.id}`,
        source: 'library',
        name: lib.name,
        inciOrCas: lib.inciOrCas,
        passport,
        libraryItem: lib,
      });
      seenNames.add(lower);
    }

    return items;
  }, [ingredients, library]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches: UnifiedSearchMaterial[] = [];

    for (const item of allUnifiedMaterials) {
      if (sourceFilter === 'in_stock') {
        if (item.source !== 'studio' || item.studioIngredient?.status !== 'in_stock') continue;
      } else if (sourceFilter === 'studio') {
        if (item.source !== 'studio') continue;
      } else if (sourceFilter === 'fraterworks') {
        if (item.source !== 'fraterworks') continue;
      } else if (sourceFilter === 'library') {
        if (item.source !== 'library') continue;
      }

      if (!q) {
        matches.push(item);
        if (matches.length >= 160) break;
        continue;
      }

      const tierLabel = getNoteTierLabel(item.passport.tier, language).toLowerCase();
      const familyLabel = getOlfactoryFamilyLabel(item.passport.family, language).toLowerCase();
      const facetsMatch = item.passport.scentBreakdown.some((b) =>
        b.facet.toLowerCase().includes(q)
      );
      const synMatch = item.passport.synonyms.some((s) => s.toLowerCase().includes(q));

      if (
        item.name.toLowerCase().includes(q) ||
        (item.inciOrCas || '').toLowerCase().includes(q) ||
        item.passport.scentDescription.toLowerCase().includes(q) ||
        (item.studioIngredient?.supplier || '').toLowerCase().includes(q) ||
        (item.studioIngredient?.storageLocation || '').toLowerCase().includes(q) ||
        tierLabel.includes(q) ||
        familyLabel.includes(q) ||
        facetsMatch ||
        synMatch
      ) {
        matches.push(item);
        if (matches.length >= 160) break;
      }
    }

    return matches;
  }, [allUnifiedMaterials, query, sourceFilter, language]);

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= filtered.length) {
      setActiveIndex(0);
    }
  }, [filtered.length, activeIndex]);

  const activeItem = filtered[activeIndex] || null;

  useEffect(() => {
    if (!open) return;
    const el = rowRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  const toIngredientObject = (item: UnifiedSearchMaterial): Ingredient => {
    if (item.studioIngredient) return item.studioIngredient;
    const p = item.passport;
    return {
      id: generateId('ing'),
      name: item.name,
      inciOrCas: item.inciOrCas,
      synonyms: p.synonyms,
      family: p.family,
      tier: p.tier,
      origin: p.origin,
      status: 'wishlist',
      dilutionPercent: 100,
      unit: 'г',
      quantityGrams: 10,
      remainingGrams: 10,
      priceTotal: 0,
      longevityLabel: `${p.substantivityHours} ч`,
      sillage: p.odorImpact >= 220 ? 'strong' : p.odorImpact <= 80 ? 'intimate' : 'moderate',
      odorImpact: p.odorImpact,
      substantivityHours: p.substantivityHours,
      averageUsePercent: p.averageUsePercent,
      scentBreakdown: p.scentBreakdown,
      ifraLimitPercent: p.ifraLimitPercent,
      olfactoryNotes:
        p.scentDescription ||
        p.scentBreakdown.map((f) => `${f.facet} (${f.percent}%)`).join(', '),
      createdAt: todayIsoDate(),
    };
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        if (filtered.length === 0) return;
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        if (filtered.length === 0) return;
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          target !== inputRef.current &&
          (target.tagName === 'BUTTON' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'INPUT')
        ) {
          return;
        }
        if (activeItem?.studioIngredient) {
          e.preventDefault();
          onSelectOpenInCatalog(activeItem.studioIngredient);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open, filtered.length, activeItem, onClose, onSelectOpenInCatalog]);

  if (!open) return null;

  const filterTabs: { key: QuickSourceFilter; label: string }[] = [
    {
      key: 'all',
      label: tr(language, {
        ru: `Все материалы (${allUnifiedMaterials.length})`,
        en: `All Materials (${allUnifiedMaterials.length})`,
        it: `Tutti (${allUnifiedMaterials.length})`,
        es: `Todos (${allUnifiedMaterials.length})`,
        de: `Alle (${allUnifiedMaterials.length})`,
      }),
    },
    {
      key: 'in_stock',
      label: getIngredientStatusLabel('in_stock', language),
    },
    {
      key: 'studio',
      label: tr(language, {
        ru: `Палитра (${ingredients.length})`,
        en: `Studio (${ingredients.length})`,
        it: `Studio (${ingredients.length})`,
        es: `Estudio (${ingredients.length})`,
        de: `Studio (${ingredients.length})`,
      }),
    },
    {
      key: 'fraterworks',
      label: 'Fraterworks Passports',
    },
    {
      key: 'library',
      label: tr(language, {
        ru: `Энциклопедия (${library.length})`,
        en: `Library (${library.length})`,
        it: `Enciclopedia (${library.length})`,
        es: `Biblioteca (${library.length})`,
        de: `Bibliothek (${library.length})`,
      }),
    },
  ];

  const handleCopyMaterialInfo = async (item: UnifiedSearchMaterial) => {
    const text = item.inciOrCas ? `${item.name} (${item.inciOrCas})` : item.name;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedName(true);
      window.setTimeout(() => setCopiedName(false), 1800);
    } catch {
      // ignore clipboard restrictions
    }
  };

  return (
    <div
      className="print:hidden fixed inset-0 z-[70] flex items-start justify-center bg-[#181917]/40 p-3 pt-8 sm:p-6 sm:pt-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-search-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-xl border border-[#D2D0CE] bg-white text-[#252423] shadow-2xl flex flex-col max-h-[86vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#E1DFDD] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--theme-accent)]" />
          <div className="min-w-0 flex-1">
            <h2 id="quick-search-modal-title" className="sr-only">
              {tr(language, {
                ru: 'Поиск парфюмерных материалов и паспортов Fraterworks',
                en: 'Perfumery Material Search & Fraterworks Passports',
                it: 'Ricerca Materie Prime e Passaporti Fraterworks',
                es: 'Búsqueda de Materiales y Pasaportes Fraterworks',
                de: 'Rohstoffsuche & Fraterworks-Passports',
              })}
            </h2>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder={tr(language, {
                ru: 'Поиск по всем парфюмерным веществам (название, CAS, фасеты аромата, Iso E, Ambroxan, Javanol...)',
                en: 'Search any perfumery material by name, CAS, scent facet, volatility, or supplier...',
                it: 'Cerca qualsiasi materia prima per nome, CAS, sfaccettatura olfattiva o volatilità...',
                es: 'Buscar cualquier material por nombre, CAS, faceta olfativa o volatilidad...',
                de: 'Alle Parfümerie-Rohstoffe nach Name, CAS, Duftfacette oder Flüchtigkeit durchsuchen...',
              })}
              className="w-full bg-transparent text-sm text-[#181917] placeholder:text-[#797775] focus:outline-none"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
              className="rounded px-2 py-1 text-[11px] font-medium text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
            >
              {tr(language, {
                ru: 'Сбросить',
                en: 'Clear',
                it: 'Pulisci',
                es: 'Limpiar',
                de: 'Leeren',
              })}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#605E5C] transition-colors hover:bg-[#F3F2F1] hover:text-[#181917]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDEBE9] bg-[#FAF9F8] px-4 py-2">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EDEBE9] p-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSourceFilter(tab.key);
                  setActiveIndex(0);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  sourceFilter === tab.key
                    ? 'bg-white text-[#181917] shadow-sm'
                    : 'text-[#605E5C] hover:text-[#181917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#605E5C] tabular-nums">
            {tr(language, {
              ru: `Показано: ${filtered.length} (всего в базе: ${allUnifiedMaterials.length})`,
              en: `Showing ${filtered.length} of ${allUnifiedMaterials.length} materials`,
              it: `Mostrati ${filtered.length} di ${allUnifiedMaterials.length} materiali`,
              es: `Mostrando ${filtered.length} de ${allUnifiedMaterials.length} materiales`,
              de: `${filtered.length} von ${allUnifiedMaterials.length} Rohstoffen`,
            })}
          </span>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E1DFDD]">
          {/* Left 7 cols: Results List with Mini Scent Breakdown Bars */}
          <div className="md:col-span-7 overflow-y-auto max-h-[44vh] md:max-h-[60vh] divide-y divide-[#EDEBE9]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <FlaskConical className="h-7 w-7 text-[#8A8886]" />
                <p className="mt-3 text-sm font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Подходящие материалы не найдены',
                    en: 'No matching perfumery materials',
                    it: 'Nessun materiale corrispondente',
                    es: 'No hay materiales coincidentes',
                    de: 'Keine passenden Rohstoffe gefunden',
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSourceFilter('all');
                    inputRef.current?.focus();
                  }}
                  className="mt-4 rounded-lg border border-[#D2D0CE] bg-white px-3.5 py-1.5 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
                >
                  {tr(language, {
                    ru: 'Сбросить поиск',
                    en: 'Reset search',
                    it: 'Ripristina ricerca',
                    es: 'Restablecer búsqueda',
                    de: 'Suche zurücksetzen',
                  })}
                </button>
              </div>
            ) : (
              filtered.map((item, index) => {
                const isActive = index === activeIndex;
                const ing = item.studioIngredient;
                const p = item.passport;
                const unitPrice =
                  ing && ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;

                return (
                  <button
                    key={item.uid}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    onDoubleClick={() => {
                      if (ing) onSelectOpenInCatalog(ing);
                    }}
                    className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                      isActive ? 'bg-[var(--theme-accent-soft)]' : 'hover:bg-[#FAF9F8]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate text-sm font-medium ${
                            isActive ? 'text-[var(--theme-accent)]' : 'text-[#181917]'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.inciOrCas && (
                          <span className="shrink-0 font-mono text-[11px] text-[#797775]">
                            {item.inciOrCas}
                          </span>
                        )}
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            item.source === 'studio'
                              ? 'bg-[#E6F4EA] text-[#137333]'
                              : item.source === 'fraterworks'
                                ? 'bg-[#FEF3C7] text-[#B45309]'
                                : 'bg-[#F1F1EE] text-[#575955]'
                          }`}
                        >
                          {item.source === 'studio'
                            ? ing
                              ? getIngredientStatusLabel(ing.status, language)
                              : 'Studio'
                            : item.source === 'fraterworks'
                              ? 'Fraterworks'
                              : tr(language, {
                                  ru: 'Библиотека',
                                  en: 'Library',
                                  it: 'Libreria',
                                  es: 'Biblioteca',
                                  de: 'Bibliothek',
                                })}
                        </span>
                      </div>

                      {/* Fraterworks Mini Scent Breakdown Bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-[#EAEAE6]">
                          {p.scentBreakdown.map((facet, fIdx) => (
                            <div
                              key={`${item.uid}-f-${fIdx}`}
                              style={{
                                width: `${facet.percent}%`,
                                backgroundColor: FAMILY_HEX_MAP[facet.family],
                              }}
                              className="h-full"
                            />
                          ))}
                        </div>
                        <span className="truncate text-[11px] text-[#605E5C]">
                          {p.scentBreakdown
                            .slice(0, 2)
                            .map((b) => `${getLocalizedFacetName(b.facet, language)} ${b.percent}%`)
                            .join(' · ')}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono tabular-nums">
                      <div className="text-xs font-semibold text-[#181917]">
                        {tr(language, { ru: 'Импакт', en: 'Impact', it: 'Impatto', es: 'Impacto', de: 'Impact' })} {p.odorImpact}
                      </div>
                      <div className="text-[11px] text-[#605E5C]">
                        ~{p.substantivityHours}h ·{' '}
                        {ing && unitPrice > 0
                          ? `${formatCurrencyDecimal(unitPrice, language, currency)}/${formatUnit(ing.unit, language)}`
                          : getNoteTierLabel(p.tier, language)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right 5 cols: Fraterworks Material Passport & Quick Actions */}
          <div className="md:col-span-5 bg-[#FAF9F8] p-4 flex flex-col justify-between gap-4 overflow-y-auto max-h-[42vh] md:max-h-[60vh]">
            {activeItem ? (
              <>
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[#181917] leading-snug">
                        {activeItem.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#605E5C]">
                        {getIngredientOriginLabel(activeItem.passport.origin, language)}
                        {' · '}
                        {getNoteTierLabel(activeItem.passport.tier, language)}
                        {' · '}
                        {getOlfactoryFamilyLabel(activeItem.passport.family, language)}
                      </p>
                      {activeItem.passport.synonyms.length > 0 && (
                        <p className="mt-0.5 text-[11px] text-[#797775] truncate">
                          {activeItem.passport.synonyms.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyMaterialInfo(activeItem)}
                      className="shrink-0 inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1]"
                    >
                      {copiedName ? (
                        <Check className="h-3 w-3 text-[#107C41]" />
                      ) : (
                        <Copy className="h-3 w-3 text-[#605E5C]" />
                      )}
                      <span>{copiedName ? 'OK' : activeItem.inciOrCas || 'CAS'}</span>
                    </button>
                  </div>

                  {/* Fraterworks Scent Breakdown Visual Card */}
                  <div className="rounded-lg border border-[#E1DFDD] bg-white p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#575955]">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[var(--theme-accent)]" />
                        {tr(language, {
                          ru: 'Разбор профиля (Scent Breakdown)',
                          en: 'Scent Breakdown (Fraterworks)',
                          it: 'Scent Breakdown (Fraterworks)',
                          es: 'Desglose Olfativo (Fraterworks)',
                          de: 'Duftprofil (Scent Breakdown)',
                        })}
                      </span>
                    </div>

                    <div className="flex h-3 w-full overflow-hidden rounded-md bg-[#EAEAE6]">
                      {activeItem.passport.scentBreakdown.map((facet, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: `${facet.percent}%`,
                            backgroundColor: FAMILY_HEX_MAP[facet.family],
                          }}
                          title={`${getLocalizedFacetName(facet.facet, language)}: ${facet.percent}%`}
                          className="h-full first:rounded-l-md last:rounded-r-md"
                        />
                      ))}
                    </div>

                    <div className="space-y-1 pt-0.5">
                      {activeItem.passport.scentBreakdown.map((facet, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-[#252423]"
                        >
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <span
                              className="h-2.5 w-2.5 rounded-xs shrink-0"
                              style={{ backgroundColor: FAMILY_HEX_MAP[facet.family] }}
                            />
                            <span className="truncate">{getLocalizedFacetName(facet.facet, language)}</span>
                          </span>
                          <span className="font-mono font-semibold tabular-nums text-[#181917]">
                            {facet.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scent Strength / Odor Impact & Volatility Meters */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-lg border border-[#E1DFDD] bg-white p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#605E5C]">
                        <span className="inline-flex items-center gap-1">
                          <Flame className="h-3 w-3 text-[#D97706]" />
                          {tr(language, {
                            ru: 'Сила (Impact)',
                            en: 'Scent Strength',
                            it: 'Forza odore',
                            es: 'Fuerza (Impact)',
                            de: 'Duftstärke',
                          })}
                        </span>
                        <strong className="font-mono text-[#181917]">
                          {activeItem.passport.odorImpact}
                        </strong>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(8, (activeItem.passport.odorImpact / 600) * 100))}%`,
                          }}
                          className="h-full bg-[#D97706]"
                        />
                      </div>
                      <div className="text-[10px] text-[#797775]">
                        {activeItem.passport.odorImpact >= 450
                          ? tr(language, {
                              ru: 'Ультра-мощный бустер',
                              en: 'Ultra-high impact',
                              it: 'Impatto estremo',
                              es: 'Impacto extremo',
                              de: 'Extrem stark',
                            })
                          : activeItem.passport.odorImpact >= 180
                            ? tr(language, {
                                ru: 'Высокая интенсивность',
                                en: 'High odor strength',
                                it: 'Alta intensità',
                                es: 'Alta intensidad',
                                de: 'Hohe Intensität',
                              })
                            : activeItem.passport.odorImpact <= 80
                              ? tr(language, {
                                  ru: 'Прозрачный / блендер',
                                  en: 'Transparent blender',
                                  it: 'Blender trasparente',
                                  es: 'Mezclador transparente',
                                  de: 'Transparenter Blender',
                                })
                              : tr(language, {
                                  ru: 'Средняя сила (100 = норма)',
                                  en: 'Medium strength (100 = std)',
                                  it: 'Forza media (100 = std)',
                                  es: 'Fuerza media (100 = est.)',
                                  de: 'Mittlere Stärke',
                                })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E1DFDD] bg-white p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#605E5C]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[var(--theme-accent)]" />
                          {tr(language, {
                            ru: 'Субстантивность',
                            en: 'Substantivity',
                            it: 'Sostantività',
                            es: 'Sustantividad',
                            de: 'Haltbarkeit',
                          })}
                        </span>
                        <strong className="font-mono text-[#181917]">
                          ~{activeItem.passport.substantivityHours}h
                        </strong>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(8, (activeItem.passport.substantivityHours / 400) * 100))}%`,
                          }}
                          className="h-full bg-[var(--theme-accent)]"
                        />
                      </div>
                      <div className="text-[10px] text-[#797775] truncate">
                        {getLocalizedVolatilityLabel(activeItem.passport.volatilityLabel, language)}
                      </div>
                    </div>
                  </div>

                  {activeItem.passport.scentDescription && (
                    <p className="text-xs leading-relaxed text-[#323130]">
                      {activeItem.passport.scentDescription}
                    </p>
                  )}

                  {(() => {
                    const ifraStd = resolveIfraStandard({
                      name: activeItem.name,
                      inciOrCas: activeItem.inciOrCas || activeItem.passport.inciOrCas,
                    });
                    const limitVal = ifraStd
                      ? ifraStd.category4LimitPercent
                      : activeItem.passport.ifraLimitPercent;
                    const isBanned =
                      ifraStd?.status === 'prohibited' ||
                      ifraStd?.status === 'eu_banned' ||
                      limitVal === 0;
                    return (
                      <div className="border-t border-b border-[#E1DFDD] py-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#797775]">
                            {tr(language, {
                              ru: 'IFRA 51 (Cat. 4)',
                              en: 'IFRA 51 (Cat. 4)',
                              it: 'IFRA 51 (Cat. 4)',
                              es: 'IFRA 51 (Cat. 4)',
                              de: 'IFRA 51 (Cat. 4)',
                            })}
                          </span>
                          <span
                            className={`font-mono font-medium tabular-nums ${
                              isBanned
                                ? 'text-[#B91C1C]'
                                : ifraStd?.status === 'exempt_fcf' ||
                                    ifraStd?.status === 'unrestricted'
                                  ? 'text-[#15803D]'
                                  : 'text-[#181917]'
                            }`}
                          >
                            {isBanned
                              ? tr(language, {
                                  ru: 'Запрещён (0%)',
                                  en: 'Prohibited (0%)',
                                  it: 'Vietato (0%)',
                                  es: 'Prohibido (0%)',
                                  de: 'Verboten (0%)',
                                })
                              : ifraStd?.status === 'exempt_fcf'
                                ? tr(language, {
                                    ru: 'FCF (без лимита)',
                                    en: 'FCF (exempt)',
                                    it: 'FCF (esente)',
                                    es: 'FCF (exento)',
                                    de: 'FCF (befreit)',
                                  })
                                : limitVal !== undefined
                                  ? `≤ ${limitVal}%`
                                  : tr(language, {
                                      ru: 'Не ограничен / не задан',
                                      en: 'Not restricted / unset',
                                      it: 'Non limitato',
                                      es: 'Sin límite',
                                      de: 'Nicht beschränkt',
                                    })}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {activeItem.studioIngredient &&
                    (activeItem.studioIngredient.supplier ||
                      activeItem.studioIngredient.storageLocation) && (
                      <div className="space-y-1 text-xs text-[#605E5C]">
                        {activeItem.studioIngredient.supplier && (
                          <div className="flex items-center gap-1.5">
                            <Store className="h-3.5 w-3.5 shrink-0 text-[#797775]" />
                            <span className="truncate">{activeItem.studioIngredient.supplier}</span>
                          </div>
                        )}
                        {activeItem.studioIngredient.storageLocation && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#797775]" />
                            <span className="truncate">
                              {activeItem.studioIngredient.storageLocation}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-[#E1DFDD]">
                  {projects.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-medium text-[#605E5C]">
                        {tr(language, {
                          ru: 'Добавить вещество в формулу проекта',
                          en: 'Add material to project formula',
                          it: 'Aggiungi alla formula del progetto',
                          es: 'Añadir a la fórmula del proyecto',
                          de: 'Zur Projektformel hinzufügen',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={targetProjectId}
                          onChange={(e) => setTargetProjectId(e.target.value)}
                          className="min-w-0 flex-1 rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                        >
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.code} · {p.title}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={addWeight}
                          onChange={(e) => setAddWeight(e.target.value)}
                          className="w-20 rounded-lg border border-[#D2D0CE] bg-white px-2 py-1.5 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                        />
                        <span className="text-xs text-[#605E5C]">{gUnit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const resolvedId = targetProjectId || projects[0]?.id;
                          if (!resolvedId) return;
                          const w = Math.max(0.01, Number(addWeight) || 0.5);
                          const ingObj = toIngredientObject(activeItem);
                          onAddToProjectFormula(ingObj, resolvedId, w);
                          setAddedFeedback(true);
                          window.setTimeout(() => setAddedFeedback(false), 1600);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)]"
                      >
                        {addedFeedback ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {addedFeedback
                            ? tr(language, {
                                ru: 'Добавлено в формулу!',
                                en: 'Added to formula!',
                                it: 'Aggiunto alla formula!',
                                es: '¡Añadido a la fórmula!',
                                de: 'Zur Formel hinzugefügt!',
                              })
                            : tr(language, {
                                ru: 'Добавить в формулу проекта',
                                en: 'Add to Formula',
                                it: 'Aggiungi alla formula',
                                es: 'Añadir a la fórmula',
                                de: 'Zur Formel hinzufügen',
                              })}
                        </span>
                      </button>
                    </div>
                  )}

                  {activeItem.studioIngredient ? (
                    <button
                      type="button"
                      onClick={() => onSelectOpenInCatalog(activeItem.studioIngredient!)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1]"
                    >
                      <span>
                        {tr(language, {
                          ru: 'Открыть карточку на складе',
                          en: 'Open in Studio Stock',
                          it: 'Apri nel catalogo studio',
                          es: 'Abrir en catálogo',
                          de: 'Im Studiobestand öffnen',
                        })}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                    </button>
                  ) : (
                    onAddMaterialToCatalog && (
                      <button
                        type="button"
                        onClick={() => {
                          const newIng = toIngredientObject(activeItem);
                          onAddMaterialToCatalog(newIng);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1]"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                        <span>
                          {tr(language, {
                            ru: 'Сохранить в палитру ингредиентов студии',
                            en: 'Save to Studio Ingredients Catalog',
                            it: 'Salva nel catalogo ingredienti',
                            es: 'Guardar en catálogo de ingredientes',
                            de: 'In Studio-Rohstoffkatalog speichern',
                          })}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs text-[#797775] text-center py-6">
                {tr(language, {
                  ru: 'Выберите парфюмерный материал из списка, чтобы увидеть Fraterworks Scent Breakdown, силу и субстантивность.',
                  en: 'Select a material to inspect its Fraterworks Scent Breakdown, odor impact, and substantivity.',
                  it: 'Seleziona un materiale per vedere Scent Breakdown, impatto e sostantività.',
                  es: 'Selecciona un material para ver su Scent Breakdown, impacto y sustantividad.',
                  de: 'Wähle einen Rohstoff aus, um Scent Breakdown, Duftstärke und Haltbarkeit zu sehen.',
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E1DFDD] bg-[#F3F2F1] px-4 py-2 text-[11px] text-[#605E5C]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[#181917] font-medium">
              <Activity className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
              {tr(language, {
                ru: 'База: Склад + Библиотека 1300+ эссенций + Паспорта Fraterworks',
                en: 'Unified Search: Studio Stock + 1300+ Library + Fraterworks Passports',
                it: 'Ricerca Unificata: Studio + 1300+ Libreria + Fraterworks',
                es: 'Búsqueda Unificada: Estudio + 1300+ Biblioteca + Fraterworks',
                de: 'Suche: Studiobestand + 1300+ Bibliothek + Fraterworks',
              })}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#797775]">Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
