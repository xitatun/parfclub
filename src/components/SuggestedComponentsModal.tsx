import {
  Check,
  FlaskConical,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  FAMILY_HEX_MAP,
  formatUnit,
  getNoteTierShort,
  getOlfactoryFamilyShort,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  FormulaComponent,
  Ingredient,
  LibraryIngredient,
  PerfumeProject,
  ProjectEstimateItem,
  ProjectTab,
} from '../types/perfume';
import { formatGrams } from '../utils/calculations';
import {
  buildAdHocNoteSuggestions,
  buildProjectSuggestedNoteGroups,
  ExtractedNoteGroup,
  isSuggestionInFormula,
  SuggestedIngredientItem,
} from '../utils/noteSuggestions';
import { generateId } from '../utils/storage';

export interface CartAddPayload {
  name: string;
  ingredientId?: string;
  inciOrCas?: string;
  family: SuggestedIngredientItem['family'];
  tier: SuggestedIngredientItem['tier'];
  origin: SuggestedIngredientItem['origin'];
  dilutionPercent?: number;
  requiredGrams?: number;
  costPerGram?: number;
  olfactoryNotes?: string;
  odorImpact?: number;
  substantivityHours?: number;
  scentBreakdown?: SuggestedIngredientItem['scentBreakdown'];
}

interface SuggestedComponentsModalProps {
  open: boolean;
  onClose: () => void;
  language: AppLanguage;
  project: PerfumeProject;
  activeComponents: FormulaComponent[];
  effectiveConcGrams: number;
  ingredients: Ingredient[];
  library: LibraryIngredient[];
  estimates: ProjectEstimateItem[];
  onAddComponentToFormula: (comp: FormulaComponent) => void;
  onApplyComponentDosage?: (componentId: string, weightGrams: number) => void;
  onApplyAllDosages?: (updates: Array<{ id: string; weightGrams: number }>) => void;
  onAddToCart?: (payload: CartAddPayload) => void;
  onOpenProjectTab?: (tab: ProjectTab) => void;
}

export function SuggestedComponentsModal({
  open,
  onClose,
  language,
  project,
  activeComponents,
  effectiveConcGrams,
  ingredients,
  library,
  estimates,
  onAddComponentToFormula,
  onAddToCart,
  onOpenProjectTab,
}: SuggestedComponentsModalProps) {
  const [customNoteQuery, setCustomNoteQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const noteGroups = useMemo<ExtractedNoteGroup[]>(() => {
    const baseGroups = buildProjectSuggestedNoteGroups(project, ingredients, library, language);
    const adHoc = buildAdHocNoteSuggestions(customNoteQuery, ingredients, library, language);
    if (adHoc) {
      return [adHoc, ...baseGroups.filter((g) => g.label.toLowerCase() !== adHoc.label.toLowerCase())];
    }
    return baseGroups;
  }, [project, ingredients, library, language, customNoteQuery]);

  useEffect(() => {
    if (!open) return;
    if (noteGroups.length > 0 && (!selectedNoteId || !noteGroups.some((g) => g.id === selectedNoteId))) {
      setSelectedNoteId(noteGroups[0].id);
    } else if (noteGroups.length === 0) {
      setSelectedNoteId(null);
    }
  }, [open, noteGroups, selectedNoteId]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const activeGroup = noteGroups.find((g) => g.id === selectedNoteId) || noteGroups[0] || null;

  const isInCart = (item: SuggestedIngredientItem): boolean => {
    const nameLower = item.name.trim().toLowerCase();
    const inEstimates = estimates.some(
      (e) =>
        e.projectId === project.id &&
        ((item.stockIngredient && e.ingredientId === item.stockIngredient.id) ||
          e.ingredientName.trim().toLowerCase() === nameLower)
    );
    const isWishlist = item.stockIngredient?.status === 'wishlist';
    return inEstimates || Boolean(isWishlist);
  };

  const handleAddSuggestionToFormula = (item: SuggestedIngredientItem) => {
    const unitCost =
      item.stockIngredient && item.stockIngredient.quantityGrams > 0
        ? item.stockIngredient.priceTotal / item.stockIngredient.quantityGrams
        : 0;

    onAddComponentToFormula({
      id: generateId('fc'),
      ingredientId: item.stockIngredient?.id,
      name: item.name,
      tier: item.tier,
      family: item.family,
      dilutionPercent: item.stockIngredient
        ? Math.min(100, Math.max(0.01, item.stockIngredient.dilutionPercent || 100))
        : 100,
      weightGrams: 0.5,
      costPerGram: Number(unitCost.toFixed(2)),
      odorImpact: item.odorImpact,
      substantivityHours: item.substantivityHours,
      scentBreakdown: item.scentBreakdown,
      note: item.reason ? item.reason.slice(0, 80) : undefined,
    });
  };

  const handleAddSuggestionToCart = (item: SuggestedIngredientItem) => {
    if (!onAddToCart) return;
    const unitCost =
      item.stockIngredient && item.stockIngredient.quantityGrams > 0
        ? item.stockIngredient.priceTotal / item.stockIngredient.quantityGrams
        : 0;

    onAddToCart({
      name: item.name,
      ingredientId: item.stockIngredient?.id,
      inciOrCas: item.inciOrCas,
      family: item.family,
      tier: item.tier,
      origin: item.origin,
      dilutionPercent: item.stockIngredient?.dilutionPercent ?? 100,
      requiredGrams: 5,
      costPerGram: unitCost,
      olfactoryNotes: item.reason,
      odorImpact: item.odorImpact,
      substantivityHours: item.substantivityHours,
      scentBreakdown: item.scentBreakdown,
    });
  };

  const getSourceLabel = (source: ExtractedNoteGroup['source']) => {
    if (source === 'desired_top') {
      return tr(language, { ru: 'Верхние ноты', en: 'Top notes', it: 'Testa', es: 'Salida', de: 'Kopfnote' });
    }
    if (source === 'desired_heart') {
      return tr(language, { ru: 'Ноты сердца', en: 'Heart notes', it: 'Cuore', es: 'Corazón', de: 'Herznote' });
    }
    if (source === 'desired_base') {
      return tr(language, { ru: 'Базовые ноты', en: 'Base notes', it: 'Fondo', es: 'Fondo', de: 'Basisnote' });
    }
    return tr(language, { ru: 'Из идеи', en: 'From concept', it: 'Dall’idea', es: 'De la idea', de: 'Aus Idee' });
  };

  return (
    <div
      data-capture-ignore="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggested-components-title"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[min(84vh,680px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#D2D0CE] bg-white shadow-2xl text-[#252423]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E4E0] bg-[#FAF9F8] px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="suggested-components-title"
                className="text-sm font-semibold text-[#181917] truncate"
              >
                {tr(language, {
                  ru: 'Предлагаемые компоненты по идее проекта',
                  en: 'Suggested Components by Project Concept',
                  it: 'Componenti suggeriti dal concept',
                  es: 'Componentes sugeridos según la idea',
                  de: 'Vorgeschlagene Rohstoffe zur Projektidee',
                })}
              </h2>
              <p className="text-[11px] text-[#605E5C] truncate">
                {project.code} · {project.title} —{' '}
                {tr(language, {
                  ru: `подбор для концентрата ${formatGrams(effectiveConcGrams, 1, language)}`,
                  en: `calculated for ${formatGrams(effectiveConcGrams, 1, language)} concentrate`,
                  it: `calcolato per ${formatGrams(effectiveConcGrams, 1, language)} di concentrato`,
                  es: `calculado para ${formatGrams(effectiveConcGrams, 1, language)} de concentrado`,
                  de: `berechnet für ${formatGrams(effectiveConcGrams, 1, language)} Konzentrat`,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#797775] hover:bg-[#EDEBE9] hover:text-[#181917] transition-colors shrink-0"
              aria-label={tr(language, {
                ru: 'Закрыть',
                en: 'Close',
                it: 'Chiudi',
                es: 'Cerrar',
                de: 'Schließen',
              })}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body: Two-Column Left = Нота, Right = Ингредиенты */}
        <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E4E4E0]">
          {/* LEFT COLUMN: Нота */}
          <div className="md:col-span-4 flex flex-col min-h-0 bg-[#FAF9F8]/60">
            <div className="border-b border-[#E4E4E0] px-4 py-2.5 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#605E5C]">
                <span>
                  {tr(language, {
                    ru: 'Нота',
                    en: 'Note',
                    it: 'Nota',
                    es: 'Nota',
                    de: 'Duftnote',
                  })}
                </span>
                <span className="font-mono tabular-nums text-[#787A74]">{noteGroups.length}</span>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8886]" />
                <input
                  type="text"
                  value={customNoteQuery}
                  onChange={(e) => setCustomNoteQuery(e.target.value)}
                  placeholder={tr(language, {
                    ru: 'Проверить ноту (напр. порох)...',
                    en: 'Lookup note (e.g. gunpowder)...',
                    it: 'Cerca nota (es. polvere)...',
                    es: 'Buscar nota (ej. pólvora)...',
                    de: 'Note prüfen (z.B. Pulver)...',
                  })}
                  className="w-full rounded border border-[#D2D0CE] bg-white py-1.5 pl-8 pr-7 text-xs text-[#181917] placeholder:text-[#8A8886] focus:border-[var(--theme-accent)] focus:outline-none"
                />
                {customNoteQuery && (
                  <button
                    type="button"
                    onClick={() => setCustomNoteQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A8886] hover:text-[#181917]"
                    aria-label="Clear note lookup"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EDEBE9]">
              {noteGroups.map((group) => {
                const isSelected = activeGroup?.id === group.id;
                const inStockCount = group.suggestions.filter((s) => s.isInStock).length;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedNoteId(group.id)}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-white border-l-2 border-l-[var(--theme-accent)]'
                        : 'hover:bg-white/70 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-xs truncate ${
                          isSelected ? 'font-semibold text-[var(--theme-accent)]' : 'font-medium text-[#181917]'
                        }`}
                      >
                        {group.label}
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-[#787A74] truncate">
                        {getSourceLabel(group.source)}
                        {inStockCount > 0 && (
                          <span className="ml-1.5 text-[#15803D]">
                            · {inStockCount}{' '}
                            {tr(language, {
                              ru: 'на складе',
                              en: 'in stock',
                              it: 'in magazzino',
                              es: 'en stock',
                              de: 'auf Lager',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10.5px] tabular-nums ${
                        isSelected
                          ? 'bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                          : 'bg-[#EDEBE9] text-[#605E5C]'
                      }`}
                    >
                      {group.suggestions.length}
                    </span>
                  </button>
                );
              })}

              {noteGroups.length === 0 && (
                <div className="px-4 py-8 text-center space-y-3">
                  <p className="text-xs text-[#605E5C] leading-relaxed">
                    {tr(language, {
                      ru: 'На вкладке «Главное» пока не расписаны идея или желаемые ноты (например: порох, гранат, кедр).',
                      en: 'No idea or desired notes are listed on the Home tab yet (e.g. gunpowder, pomegranate, cedar).',
                      it: 'Nessuna idea o nota desiderata inserita nella scheda Principale.',
                      es: 'Aún no hay idea ni notas deseadas en la pestaña Principal.',
                      de: 'Im Tab „Start“ wurden noch keine Idee oder Wunsch-Noten eingetragen.',
                    })}
                  </p>
                  {onOpenProjectTab && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProjectTab('formula');
                      }}
                      className="inline-flex items-center gap-1.5 rounded border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1] transition-colors"
                    >
                      <span>
                        {tr(language, {
                          ru: 'Заполнить на «Главное»',
                          en: 'Fill in on Home tab',
                          it: 'Compila su Principale',
                          es: 'Completar en Principal',
                          de: 'Auf Startseite ausfüllen',
                        })}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Ингредиенты */}
          <div className="md:col-span-8 flex flex-col min-h-0 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E0] px-5 py-2.5 bg-[#FAF9F8]/40 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#605E5C]">
                  {tr(language, {
                    ru: 'Ингредиенты',
                    en: 'Ingredients',
                    it: 'Ingredienti',
                    es: 'Ingredientes',
                    de: 'Rohstoffe',
                  })}
                </span>
                {activeGroup && (
                  <>
                    <span className="text-[#C8C8C2]">·</span>
                    <span className="text-xs font-semibold text-[#181917] truncate">
                      {activeGroup.label}
                    </span>
                  </>
                )}
              </div>
              {activeGroup && (
                <span className="text-[11px] font-mono text-[#787A74] tabular-nums shrink-0">
                  {activeGroup.suggestions.length}{' '}
                  {tr(language, {
                    ru: 'позиций',
                    en: 'matches',
                    it: 'risultati',
                    es: 'resultados',
                    de: 'Treffer',
                  })}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EDEBE9]">
              {activeGroup && activeGroup.suggestions.length > 0 ? (
                activeGroup.suggestions.map((item) => {
                  const alreadyInFormula = isSuggestionInFormula(item, activeComponents);
                  const addedToCart = isInCart(item);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2.5 px-5 py-3 hover:bg-[#FAFBF9] transition-colors sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span
                            className="h-2.5 w-2.5 rounded-xs shrink-0"
                            style={{ backgroundColor: FAMILY_HEX_MAP[item.family] }}
                          />
                          <span className="text-xs font-semibold text-[#181917]">
                            {item.name}
                          </span>
                          {item.inciOrCas && (
                            <span className="font-mono text-[10.5px] text-[#787A74]">
                              {item.inciOrCas}
                            </span>
                          )}
                          {item.stockIngredient?.bottleLabel && (
                            <span className="font-mono text-[10.5px] font-medium text-[var(--theme-accent)]">
                              [{item.stockIngredient.bottleLabel}]
                            </span>
                          )}
                        </div>

                        <p className="text-[11.5px] text-[#575955] leading-snug">
                          {item.reason}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] text-[#6B6D68] tabular-nums">
                          <span>
                            {getNoteTierShort(item.tier, language)} ·{' '}
                            {getOlfactoryFamilyShort(item.family, language)}
                          </span>
                          {item.odorImpact !== undefined && (
                            <span className="font-mono">
                              · {tr(language, { ru: 'Сила', en: 'Impact', it: 'Imp.', es: 'Imp.', de: 'Kraft' })}{' '}
                              {item.odorImpact}
                            </span>
                          )}
                          {item.substantivityHours !== undefined && (
                            <span className="font-mono">· ~{item.substantivityHours}ч</span>
                          )}
                          <span>·</span>
                          {item.isInStock ? (
                            <span className="font-medium text-[#15803D]">
                              {tr(language, {
                                ru:
                                  item.inStockGrams !== null
                                    ? `На складе ${item.inStockGrams} ${formatUnit(item.stockIngredient?.unit || 'г', language)}`
                                    : 'На складе',
                                en:
                                  item.inStockGrams !== null
                                    ? `In stock ${item.inStockGrams} ${formatUnit(item.stockIngredient?.unit || 'г', language)}`
                                    : 'In stock',
                                it: 'In magazzino',
                                es: 'En stock',
                                de: 'Auf Lager',
                              })}
                            </span>
                          ) : (
                            <span className="font-medium text-[#B45309]">
                              {tr(language, {
                                ru: 'Нет на складе',
                                en: 'Out of stock',
                                it: 'Non disponibile',
                                es: 'Sin stock',
                                de: 'Nicht auf Lager',
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controls: + В формулу, В корзину */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 sm:pl-3">
                        <div className="flex items-center gap-2">

                        {!item.isInStock && onAddToCart && (
                          <button
                            type="button"
                            onClick={() => handleAddSuggestionToCart(item)}
                            className={`inline-flex items-center gap-1 rounded border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                              addedToCart
                                ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#15803D]'
                                : 'border-[#D2D0CE] bg-white text-[#B45309] hover:bg-[#FFFBEB] hover:border-[#F59E0B]'
                            }`}
                            title={tr(language, {
                              ru: 'Добавить отсутствующий компонент в корзину (список покупок и смета)',
                              en: 'Add missing material to cart (shopping list & budget)',
                              it: 'Aggiungi al carrello (lista acquisti e budget)',
                              es: 'Añadir al carrito (lista de compra y presupuesto)',
                              de: 'Fehlenden Rohstoff in den Warenkorb (Einkaufsliste & Budget)',
                            })}
                          >
                            {addedToCart ? (
                              <Check className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span>
                              {addedToCart
                                ? tr(language, {
                                    ru: 'В корзине',
                                    en: 'In cart',
                                    it: 'Nel carrello',
                                    es: 'En carrito',
                                    de: 'Im Korb',
                                  })
                                : tr(language, {
                                    ru: 'В корзину',
                                    en: 'To cart',
                                    it: 'Al carrello',
                                    es: 'Al carrito',
                                    de: 'In Korb',
                                  })}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddSuggestionToFormula(item)}
                          className={`inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                            alreadyInFormula
                              ? 'border border-[#D2D0CE] bg-[#FAF9F8] text-[#15803D] hover:bg-[#F3F2F1]'
                              : 'bg-[var(--theme-accent)] text-white hover:bg-[var(--theme-accent-hover)]'
                          }`}
                        >
                          {alreadyInFormula ? (
                            <Check className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span>
                            {alreadyInFormula
                              ? tr(language, {
                                  ru: 'В формуле',
                                  en: 'In formula',
                                  it: 'In formula',
                                  es: 'En fórmula',
                                  de: 'In Formel',
                                })
                              : tr(language, {
                                  ru: 'В формулу',
                                  en: 'Add',
                                  it: 'Aggiungi',
                                  es: 'Añadir',
                                  de: 'Hinzufügen',
                                })}
                          </span>
                        </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-2">
                  <FlaskConical className="h-6 w-6 text-[#8B8D87]" />
                  <p className="text-xs font-medium text-[#3F413D]">
                    {activeGroup
                      ? tr(language, {
                          ru: `Для ноты «${activeGroup.label}» пока не найдено точных совпадений — попробуйте уточнить запрос слева.`,
                          en: `No exact matches found for "${activeGroup.label}" — try refining the note keyword on the left.`,
                          it: `Nessuna corrispondenza trovata per "${activeGroup.label}".`,
                          es: `No se encontraron coincidencias para "${activeGroup.label}".`,
                          de: `Keine direkten Treffer für „${activeGroup.label}“.`,
                        })
                      : tr(language, {
                          ru: 'Выберите ноту слева или введите название желаемого аккорда.',
                          en: 'Select a note on the left or enter a scent keyword.',
                          it: 'Seleziona una nota a sinistra o cerca un accordo.',
                          es: 'Selecciona una nota a la izquierda o escribe un acorde.',
                          de: 'Wähle links eine Duftnote oder gib ein Stichwort ein.',
                        })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
