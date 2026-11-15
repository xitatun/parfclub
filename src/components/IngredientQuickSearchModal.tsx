import {
  ArrowRight,
  Check,
  Copy,
  FlaskConical,
  MapPin,
  Plus,
  Search,
  Store,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  formatUnit,
  getCurrencySymbol,
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getOlfactoryFamilyLabel,
  getSillageLabel,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  IngredientStatus,
  PerfumeProject,
} from '../types/perfume';
import { formatCurrencyDecimal } from '../utils/calculations';

interface IngredientQuickSearchModalProps {
  open: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
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
}

type QuickStatusFilter = 'all' | IngredientStatus;

export function IngredientQuickSearchModal({
  open,
  onClose,
  ingredients,
  projects,
  selectedProjectId,
  language,
  currency,
  onSelectOpenInCatalog,
  onAddToProjectFormula,
}: IngredientQuickSearchModalProps) {
  const gUnit = language === 'ru' ? 'г' : 'g';
  const currencySymbol = getCurrencySymbol(currency);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuickStatusFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetProjectId, setTargetProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );
  const [addWeight, setAddWeight] = useState('0.50');
  const [copiedName, setCopiedName] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setStatusFilter('all');
    setActiveIndex(0);
    setTargetProjectId(selectedProjectId || projects[0]?.id || '');
    setAddWeight('0.50');
    setCopiedName(false);
    const raf = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open, selectedProjectId, projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ingredients.filter((ing) => {
      if (statusFilter !== 'all' && ing.status !== statusFilter) return false;
      if (!q) return true;
      const tierLabel = getNoteTierLabel(ing.tier, language).toLowerCase();
      const familyLabel = getOlfactoryFamilyLabel(ing.family, language).toLowerCase();
      return (
        ing.name.toLowerCase().includes(q) ||
        (ing.inciOrCas || '').toLowerCase().includes(q) ||
        ing.olfactoryNotes.toLowerCase().includes(q) ||
        (ing.supplier || '').toLowerCase().includes(q) ||
        (ing.storageLocation || '').toLowerCase().includes(q) ||
        tierLabel.includes(q) ||
        familyLabel.includes(q)
      );
    });
  }, [ingredients, query, statusFilter, language]);

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= filtered.length) {
      setActiveIndex(0);
    }
  }, [filtered.length, activeIndex]);

  const activeIngredient = filtered[activeIndex] || null;

  useEffect(() => {
    if (!open) return;
    const el = rowRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

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
        if (activeIngredient) {
          e.preventDefault();
          onSelectOpenInCatalog(activeIngredient);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [open, filtered.length, activeIngredient, onClose, onSelectOpenInCatalog]);

  if (!open) return null;

  const statusTabs: { key: QuickStatusFilter; label: string }[] = [
    {
      key: 'all',
      label: tr(language, {
        ru: 'Все',
        en: 'All',
        it: 'Tutti',
        es: 'Todos',
        de: 'Alle',
      }),
    },
    { key: 'in_stock', label: getIngredientStatusLabel('in_stock', language) },
    { key: 'wishlist', label: getIngredientStatusLabel('wishlist', language) },
    { key: 'ordered', label: getIngredientStatusLabel('ordered', language) },
  ];

  const handleCopyIngredientName = async (ing: Ingredient) => {
    const text = ing.inciOrCas ? `${ing.name} (${ing.inciOrCas})` : ing.name;
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
      className="print:hidden fixed inset-0 z-[70] flex items-start justify-center bg-[#181917]/40 p-3 pt-10 sm:p-6 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-search-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-xl border border-[#D2D0CE] bg-white text-[#252423] shadow-2xl flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#E1DFDD] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--theme-accent)]" />
          <div className="min-w-0 flex-1">
            <h2 id="quick-search-modal-title" className="sr-only">
              {tr(language, {
                ru: 'Быстрый поиск ингредиентов',
                en: 'Quick Ingredient Search',
                it: 'Ricerca rapida ingredienti',
                es: 'Búsqueda rápida de ingredientes',
                de: 'Schnellsuche nach Rohstoffen',
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
                ru: 'Поиск ингредиента по названию, CAS, нотам, поставщику или полке...',
                en: 'Search ingredients by name, CAS, scent profile, supplier, or shelf...',
                it: 'Cerca ingredienti per nome, CAS, note olfattive, fornitore o scaffale...',
                es: 'Buscar ingredientes por nombre, CAS, perfil olfativo, proveedor o estante...',
                de: 'Rohstoffe nach Name, CAS, Duftprofil, Lieferant oder Regal suchen...',
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
            aria-label={tr(language, {
              ru: 'Закрыть поиск',
              en: 'Close search',
              it: 'Chiudi ricerca',
              es: 'Cerrar búsqueda',
              de: 'Suche schließen',
            })}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDEBE9] bg-[#FAF9F8] px-4 py-2">
          <div className="flex items-center gap-1 rounded-lg bg-[#EDEBE9] p-0.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setActiveIndex(0);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === tab.key
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
              ru: `Найдено: ${filtered.length} из ${ingredients.length}`,
              en: `${filtered.length} of ${ingredients.length} components`,
              it: `${filtered.length} di ${ingredients.length} componenti`,
              es: `${filtered.length} de ${ingredients.length} componentes`,
              de: `${filtered.length} von ${ingredients.length} Rohstoffen`,
            })}
          </span>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E1DFDD]">
          <div className="md:col-span-7 overflow-y-auto max-h-[42vh] md:max-h-[54vh] divide-y divide-[#EDEBE9]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <FlaskConical className="h-7 w-7 text-[#8A8886]" />
                <p className="mt-3 text-sm font-semibold text-[#181917]">
                  {tr(language, {
                    ru: 'Подходящие ингредиенты не найдены',
                    en: 'No matching ingredients',
                    it: 'Nessun ingrediente corrispondente',
                    es: 'No hay ingredientes coincidentes',
                    de: 'Keine passenden Rohstoffe',
                  })}
                </p>
                <p className="mt-1 text-xs text-[#605E5C] max-w-sm">
                  {tr(language, {
                    ru: 'Попробуйте изменить запрос, указать CAS, ноту или сбросить фильтр статуса.',
                    en: 'Try another name, CAS number, note, or reset the status filter.',
                    it: 'Prova un altro nome, numero CAS, nota o ripristina il filtro di stato.',
                    es: 'Prueba otro nombre, número CAS, nota o restablece el filtro de estado.',
                    de: 'Versuche einen anderen Namen, CAS-Nummer, Note oder setze den Statusfilter zurück.',
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setStatusFilter('all');
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
              filtered.map((ing, index) => {
                const isActive = index === activeIndex;
                const unitPrice =
                  ing.quantityGrams > 0 ? ing.priceTotal / ing.quantityGrams : 0;
                const stockDisplay = ing.remainingGrams ?? ing.quantityGrams;

                return (
                  <button
                    key={ing.id}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    onDoubleClick={() => onSelectOpenInCatalog(ing)}
                    className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                      isActive ? 'bg-[var(--theme-accent-soft)]' : 'hover:bg-[#FAF9F8]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`truncate text-sm font-medium ${
                            isActive ? 'text-[var(--theme-accent)]' : 'text-[#181917]'
                          }`}
                        >
                          {ing.name}
                        </span>
                        {ing.inciOrCas && (
                          <span className="shrink-0 font-mono text-[11px] text-[#797775]">
                            {ing.inciOrCas}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#605E5C]">
                        <span>{getNoteTierLabel(ing.tier, language)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{getOlfactoryFamilyLabel(ing.family, language)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{ing.dilutionPercent}%</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            ing.status === 'in_stock'
                              ? 'text-[#107C41] font-medium'
                              : ing.status === 'wishlist'
                                ? 'text-[#B45309] font-medium'
                                : 'text-[var(--theme-accent)] font-medium'
                          }
                        >
                          {getIngredientStatusLabel(ing.status, language)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono tabular-nums">
                      <div className="text-xs font-semibold text-[#181917]">
                        {unitPrice > 0
                          ? `${formatCurrencyDecimal(unitPrice, language, currency)}/${formatUnit(ing.unit, language)}`
                          : `— ${currencySymbol}`}
                      </div>
                      <div className="text-[11px] text-[#605E5C]">
                        {stockDisplay} {formatUnit(ing.unit, language)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="md:col-span-5 bg-[#FAF9F8] p-4 flex flex-col justify-between gap-4 overflow-y-auto max-h-[38vh] md:max-h-[54vh]">
            {activeIngredient ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[#181917] leading-snug">
                        {activeIngredient.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#605E5C]">
                        {getIngredientOriginLabel(activeIngredient.origin, language)}
                        {' · '}
                        {getNoteTierLabel(activeIngredient.tier, language)}
                        {' · '}
                        {getOlfactoryFamilyLabel(activeIngredient.family, language)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyIngredientName(activeIngredient)}
                      className="shrink-0 inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1]"
                      title={tr(language, {
                        ru: 'Скопировать название и CAS',
                        en: 'Copy name & CAS',
                        it: 'Copia nome e CAS',
                        es: 'Copiar nombre y CAS',
                        de: 'Name & CAS kopieren',
                      })}
                    >
                      {copiedName ? (
                        <Check className="h-3 w-3 text-[#107C41]" />
                      ) : (
                        <Copy className="h-3 w-3 text-[#605E5C]" />
                      )}
                      <span>
                        {copiedName
                          ? tr(language, {
                              ru: 'Скопировано',
                              en: 'Copied',
                              it: 'Copiato',
                              es: 'Copiado',
                              de: 'Kopiert',
                            })
                          : 'CAS'}
                      </span>
                    </button>
                  </div>

                  {activeIngredient.olfactoryNotes && (
                    <p className="text-xs leading-relaxed text-[#323130]">
                      {activeIngredient.olfactoryNotes}
                    </p>
                  )}

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-b border-[#E1DFDD] py-2.5 text-xs">
                    <div>
                      <dt className="text-[11px] text-[#797775]">
                        {tr(language, {
                          ru: 'Разведение',
                          en: 'Concentration',
                          it: 'Diluizione',
                          es: 'Dilución',
                          de: 'Verdünnung',
                        })}
                      </dt>
                      <dd className="font-mono font-medium tabular-nums text-[#181917]">
                        {activeIngredient.dilutionPercent}%
                        {activeIngredient.solventNote ? ` (${activeIngredient.solventNote})` : ''}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#797775]">
                        {tr(language, {
                          ru: 'Фасовка / Остаток',
                          en: 'Pack / Stock',
                          it: 'Confezione / Scorta',
                          es: 'Envase / Stock',
                          de: 'Gebinde / Bestand',
                        })}
                      </dt>
                      <dd className="font-mono font-medium tabular-nums text-[#181917]">
                        {activeIngredient.remainingGrams ?? activeIngredient.quantityGrams} /{' '}
                        {activeIngredient.quantityGrams} {formatUnit(activeIngredient.unit, language)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#797775]">
                        {tr(language, {
                          ru: 'Стойкость / Шлейф',
                          en: 'Longevity / Sillage',
                          it: 'Persistenza / Scia',
                          es: 'Duración / Estela',
                          de: 'Haltbarkeit / Sillage',
                        })}
                      </dt>
                      <dd className="font-medium text-[#181917] truncate">
                        {activeIngredient.longevityLabel || '—'} ·{' '}
                        {getSillageLabel(activeIngredient.sillage, language)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#797775]">
                        {tr(language, {
                          ru: 'Лимит IFRA',
                          en: 'IFRA limit',
                          it: 'Limite IFRA',
                          es: 'Límite IFRA',
                          de: 'IFRA-Limit',
                        })}
                      </dt>
                      <dd className="font-mono font-medium tabular-nums text-[#181917]">
                        {activeIngredient.ifraLimitPercent !== undefined
                          ? `${activeIngredient.ifraLimitPercent}%`
                          : tr(language, {
                              ru: 'Не задан',
                              en: 'Not set',
                              it: 'Non impostato',
                              es: 'No definido',
                              de: 'Nicht festgelegt',
                            })}
                      </dd>
                    </div>
                  </dl>

                  {(activeIngredient.supplier || activeIngredient.storageLocation) && (
                    <div className="space-y-1 text-xs text-[#605E5C]">
                      {activeIngredient.supplier && (
                        <div className="flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 shrink-0 text-[#797775]" />
                          <span className="truncate">{activeIngredient.supplier}</span>
                        </div>
                      )}
                      {activeIngredient.storageLocation && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#797775]" />
                          <span className="truncate">{activeIngredient.storageLocation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#E1DFDD]">
                  {projects.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-medium text-[#605E5C]">
                        {tr(language, {
                          ru: 'Добавить компонент в формулу',
                          en: 'Add component to project formula',
                          it: 'Aggiungi componente alla formula',
                          es: 'Añadir componente a la fórmula',
                          de: 'Komponente zur Formel hinzufügen',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={targetProjectId}
                          onChange={(e) => setTargetProjectId(e.target.value)}
                          aria-label={tr(language, {
                            ru: 'Целевой проект',
                            en: 'Target project',
                            it: 'Progetto di destinazione',
                            es: 'Proyecto de destino',
                            de: 'Zielprojekt',
                          })}
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
                          min={0.01}
                          step="0.05"
                          value={addWeight}
                          onChange={(e) => setAddWeight(e.target.value)}
                          aria-label={tr(language, {
                            ru: 'Вес в граммах',
                            en: 'Weight in grams',
                            it: 'Peso in grammi',
                            es: 'Peso en gramos',
                            de: 'Gewicht in Gramm',
                          })}
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
                          onAddToProjectFormula(activeIngredient, resolvedId, w);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>
                          {tr(language, {
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

                  <button
                    type="button"
                    onClick={() => onSelectOpenInCatalog(activeIngredient)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1]"
                  >
                    <span>
                      {tr(language, {
                        ru: 'Открыть в базе ингредиентов',
                        en: 'Open in Ingredients Database',
                        it: 'Apri nel database ingredienti',
                        es: 'Abrir en base de ingredientes',
                        de: 'Im Rohstoffkatalog öffnen',
                      })}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs text-[#797775] text-center py-6">
                {tr(language, {
                  ru: 'Выберите компонент из списка, чтобы увидеть характеристики и действия.',
                  en: 'Select a component from the list to preview specs and actions.',
                  it: 'Seleziona un componente dalla lista per visualizzare specifiche e azioni.',
                  es: 'Selecciona un componente de la lista para ver detalles y acciones.',
                  de: 'Wähle einen Rohstoff aus der Liste, um Details und Aktionen anzuzeigen.',
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E1DFDD] bg-[#F3F2F1] px-4 py-2 text-[11px] text-[#605E5C]">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              <kbd className="rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#323130]">
                ↑
              </kbd>{' '}
              <kbd className="rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#323130]">
                ↓
              </kbd>{' '}
              {tr(language, {
                ru: 'Выбор',
                en: 'Navigate',
                it: 'Naviga',
                es: 'Navegar',
                de: 'Auswählen',
              })}
            </span>
            <span>
              <kbd className="rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#323130]">
                Enter
              </kbd>{' '}
              {tr(language, {
                ru: 'Открыть в базе',
                en: 'Open in catalog',
                it: 'Apri in catalogo',
                es: 'Abrir en catálogo',
                de: 'Im Katalog öffnen',
              })}
            </span>
            <span>
              <kbd className="rounded border border-[#D2D0CE] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#323130]">
                Esc
              </kbd>{' '}
              {tr(language, {
                ru: 'Закрыть',
                en: 'Close',
                it: 'Chiudi',
                es: 'Cerrar',
                de: 'Schließen',
              })}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#797775]">Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
