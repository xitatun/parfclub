import { Filter, Plus, RotateCcw, Search, Tag, X } from 'lucide-react';
import { useState } from 'react';
import {
  getIngredientOriginLabel,
  getIngredientStatusLabel,
  getNoteTierLabel,
  getOlfactoryFamilyLabel,
  getSillageLabel,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  IngredientFilters,
  IngredientOrigin,
  IngredientSortBy,
  IngredientStatus,
  NoteTier,
  OlfactoryFamilyKey,
  SillageLevel,
} from '../types/perfume';

interface IngredientsFilterPaneProps {
  open: boolean;
  onClose: () => void;
  filters: IngredientFilters;
  onChangeFilters: (patch: Partial<IngredientFilters>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  totalCount: number;
  filteredCount: number;
  statusCounts: {
    all: number;
    in_stock: number;
    wishlist: number;
    ordered: number;
  };
  uniqueSuppliers: string[];
  availableTags?: string[];
  tagCounts?: Record<string, number>;
  onCreateTag?: (tag: string) => void;
  criticalStockGrams?: number;
  language?: AppLanguage;
}

const STATUS_KEYS: ('all' | IngredientStatus)[] = ['all', 'in_stock', 'wishlist', 'ordered'];

export function IngredientsFilterPane({
  open,
  onClose,
  filters,
  onChangeFilters,
  onResetFilters,
  activeFiltersCount,
  totalCount,
  filteredCount,
  statusCounts,
  uniqueSuppliers,
  availableTags = [],
  tagCounts = {},
  onCreateTag,
  language = 'ru',
}: IngredientsFilterPaneProps) {
  const [newTagInput, setNewTagInput] = useState('');
  if (!open) return null;
  const selectedTags = filters.tags || [];
  const selectedLower = new Set(selectedTags.map((t) => t.toLowerCase()));
  const matchMode = filters.tagMatchMode || 'any';

  const handleToggleTag = (tag: string) => {
    const low = tag.toLowerCase();
    const exists = selectedTags.some((t) => t.toLowerCase() === low);
    const nextTags = exists
      ? selectedTags.filter((t) => t.toLowerCase() !== low)
      : [...selectedTags, tag];
    onChangeFilters({ tags: nextTags });
  };

  const handleCreatePaneTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim().replace(/^#+/, '');
    if (!clean) return;
    onCreateTag?.(clean);
    setNewTagInput('');
  };

  const paneBody = (
    <div className="flex h-full flex-col bg-white text-[#323130] min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEBE9]">
        <div className="flex items-center gap-2 min-w-0">
          <Filter className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
          <span className="text-sm font-semibold text-[var(--theme-accent)] truncate">
            {tr(language, {
              ru: 'Фильтры сырья',
              en: 'Material Filters',
              it: 'Filtri materie prime',
              es: 'Filtros de materias primas',
              de: 'Rohstofffilter',
            })}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#252423]"
          title={tr(language, {
            ru: 'Закрыть панель фильтров',
            en: 'Close filters pane',
            it: 'Chiudi pannello filtri',
            es: 'Cerrar panel de filtros',
            de: 'Filterleiste schließen',
          })}
          aria-label={tr(language, {
            ru: 'Закрыть панель фильтров',
            en: 'Close filters pane',
            it: 'Chiudi pannello filtri',
            es: 'Cerrar panel de filtros',
            de: 'Filterleiste schließen',
          })}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-[#FAF9F8] border-b border-[#EDEBE9] text-[11px]">
        <span className="text-[#605E5C] tabular-nums">
          {tr(language, {
            ru: 'Показано',
            en: 'Showing',
            it: 'Mostrati',
            es: 'Mostrando',
            de: 'Angezeigt',
          })}{' '}
          <strong className="text-[#181917]">{filteredCount}</strong>{' '}
          {tr(language, { ru: 'из', en: 'of', it: 'su', es: 'de', de: 'von' })} {totalCount}
        </span>
        {(activeFiltersCount > 0 || filters.sortBy !== 'default') && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 font-medium text-[var(--theme-accent)] hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
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
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-[#605E5C] mb-1.5">
            {tr(language, {
              ru: 'Быстрый поиск',
              en: 'Quick search',
              it: 'Ricerca rapida',
              es: 'Búsqueda rápida',
              de: 'Schnellsuche',
            })}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#605E5C]" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ searchQuery: e.target.value })}
              placeholder={tr(language, {
                ru: 'Название, CAS, полка...',
                en: 'Name, CAS, shelf...',
                it: 'Nome, CAS, scaffale...',
                es: 'Nombre, CAS, estante...',
                de: 'Name, CAS, Regal...',
              })}
              className="w-full rounded border border-[#D2D0CE] bg-[#FAF9F8] py-1.5 pl-8 pr-2.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-[#EDEBE9] pt-3">
          <div className="text-[11px] font-semibold text-[#605E5C] mb-1.5">
            {tr(language, { ru: 'Статус', en: 'Status', it: 'Stato', es: 'Estado', de: 'Status' })}
          </div>
          <div className="space-y-0.5">
            {STATUS_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onChangeFilters({ status: key })}
                className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors ${
                  filters.status === key
                    ? 'bg-[#EDEBE9] font-semibold text-[var(--theme-accent)]'
                    : 'text-[#323130] hover:bg-[#F3F2F1]'
                }`}
              >
                <span>
                  {key === 'all'
                    ? tr(language, {
                        ru: 'Все позиции',
                        en: 'All items',
                        it: 'Tutte le voci',
                        es: 'Todos los artículos',
                        de: 'Alle Positionen',
                      })
                    : getIngredientStatusLabel(key, language)}
                </span>
                <span className="font-mono text-[11px] text-[#605E5C] tabular-nums">
                  {statusCounts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#EDEBE9] pt-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#605E5C]">
              <Tag className="h-3 w-3 text-[var(--theme-accent)]" />
              <span>
                {tr(language, {
                  ru: 'Пользовательские теги',
                  en: 'Custom tags',
                  it: 'Tag personalizzati',
                  es: 'Etiquetas personalizadas',
                  de: 'Benutzer-Tags',
                })}
              </span>
            </span>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => onChangeFilters({ tags: [] })}
                className="text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
              >
                {tr(language, {
                  ru: 'Снять',
                  en: 'Clear',
                  it: 'Cancella',
                  es: 'Limpiar',
                  de: 'Leeren',
                })}
              </button>
            )}
          </div>

          {selectedTags.length >= 2 && (
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#605E5C]">
              <span>
                {tr(language, {
                  ru: 'Совпадение:',
                  en: 'Match:',
                  it: 'Corrispondenza:',
                  es: 'Coincidencia:',
                  de: 'Abgleich:',
                })}
              </span>
              <div className="inline-flex rounded bg-[#EEEEEC] p-0.5">
                <button
                  type="button"
                  onClick={() => onChangeFilters({ tagMatchMode: 'any' })}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                    matchMode === 'any' ? 'bg-white text-[#181917] shadow-xs' : 'text-[#605E5C]'
                  }`}
                >
                  {tr(language, { ru: 'Любой', en: 'Any', it: 'Almeno 1', es: 'Cualquiera', de: 'Mind. 1' })}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFilters({ tagMatchMode: 'all' })}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                    matchMode === 'all' ? 'bg-white text-[#181917] shadow-xs' : 'text-[#605E5C]'
                  }`}
                >
                  {tr(language, { ru: 'Все', en: 'All', it: 'Tutti', es: 'Todas', de: 'Alle' })}
                </button>
              </div>
            </div>
          )}

          {availableTags.length > 0 ? (
            <div className="space-y-0.5 max-h-40 overflow-y-auto pr-0.5">
              {availableTags.map((tag) => {
                const isSelected = selectedLower.has(tag.toLowerCase());
                const count = tagCounts[tag.toLowerCase()] || 0;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#EDEBE9] font-semibold text-[var(--theme-accent)]'
                        : 'text-[#323130] hover:bg-[#F3F2F1]'
                    }`}
                  >
                    <span className="truncate">#{tag}</span>
                    <span className="font-mono text-[11px] text-[#605E5C] tabular-nums shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-[#797775]">
              {tr(language, {
                ru: 'Создайте теги ниже или в каталоге.',
                en: 'Create tags below or in catalog.',
                it: 'Crea tag qui sotto o nel catalogo.',
                es: 'Crea etiquetas abajo o en el catálogo.',
                de: 'Erstellen Sie Tags unten oder im Katalog.',
              })}
            </p>
          )}

          {onCreateTag && (
            <form onSubmit={handleCreatePaneTag} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Новый тег...',
                  en: 'New tag...',
                  it: 'Nuovo tag...',
                  es: 'Nueva etiqueta...',
                  de: 'Neues Tag...',
                })}
                className="min-w-0 flex-1 rounded border border-[#D2D0CE] bg-[#FAF9F8] px-2 py-1 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newTagInput.trim()}
                className="inline-flex items-center justify-center rounded border border-[#D2D0CE] bg-white p-1.5 text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-40"
                aria-label={tr(language, {
                  ru: 'Создать тег',
                  en: 'Create tag',
                  it: 'Crea tag',
                  es: 'Crear etiqueta',
                  de: 'Tag erstellen',
                })}
              >
                <Plus className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-[#EDEBE9] pt-3 space-y-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Категория аромата',
                en: 'Olfactory family',
                it: 'Famiglia olfattiva',
                es: 'Familia olfativa',
                de: 'Duftfamilie',
              })}
            </label>
            <select
              value={filters.family}
              onChange={(e) =>
                onChangeFilters({ family: e.target.value as 'all' | OlfactoryFamilyKey })
              }
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Все категории',
                  en: 'All families',
                  it: 'Tutte le famiglie',
                  es: 'Todas las familias',
                  de: 'Alle Familien',
                })}
              </option>
              {OLFACTORY_FAMILIES.map((f) => (
                <option key={f.key} value={f.key}>
                  {getOlfactoryFamilyLabel(f.key, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Уровень пирамиды',
                en: 'Pyramid tier',
                it: 'Livello piramide',
                es: 'Nivel de pirámide',
                de: 'Pyramidenebene',
              })}
            </label>
            <select
              value={filters.tier}
              onChange={(e) => onChangeFilters({ tier: e.target.value as 'all' | NoteTier })}
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Любой уровень',
                  en: 'Any tier',
                  it: 'Qualsiasi livello',
                  es: 'Cualquier nivel',
                  de: 'Jede Ebene',
                })}
              </option>
              {(['top', 'heart', 'base', 'solvent'] as NoteTier[]).map((t) => (
                <option key={t} value={t}>
                  {getNoteTierLabel(t, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Происхождение',
                en: 'Origin',
                it: 'Origine',
                es: 'Origen',
                de: 'Herkunft',
              })}
            </label>
            <select
              value={filters.origin}
              onChange={(e) =>
                onChangeFilters({ origin: e.target.value as 'all' | IngredientOrigin })
              }
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Любое сырьё',
                  en: 'Any origin',
                  it: 'Qualsiasi origine',
                  es: 'Cualquier origen',
                  de: 'Jede Herkunft',
                })}
              </option>
              {(['natural', 'synthetic', 'base', 'solvent'] as IngredientOrigin[]).map((o) => (
                <option key={o} value={o}>
                  {getIngredientOriginLabel(o, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Шлейф',
                en: 'Sillage',
                it: 'Scia',
                es: 'Estela',
                de: 'Sillage',
              })}
            </label>
            <select
              value={filters.sillage}
              onChange={(e) =>
                onChangeFilters({ sillage: e.target.value as 'all' | SillageLevel })
              }
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Любой шлейф',
                  en: 'Any sillage',
                  it: 'Qualsiasi scia',
                  es: 'Cualquier estela',
                  de: 'Jede Sillage',
                })}
              </option>
              {(['intimate', 'moderate', 'strong'] as SillageLevel[]).map((s) => (
                <option key={s} value={s}>
                  {getSillageLabel(s, language).split(' (')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-[#EDEBE9] pt-3 space-y-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Магазин / поставщик',
                en: 'Store / supplier',
                it: 'Negozio / fornitore',
                es: 'Tienda / proveedor',
                de: 'Shop / Lieferant',
              })}
            </label>
            <select
              value={filters.supplier}
              onChange={(e) => onChangeFilters({ supplier: e.target.value })}
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Все магазины',
                  en: 'All stores',
                  it: 'Tutti i negozi',
                  es: 'Todas las tiendas',
                  de: 'Alle Shops',
                })}
              </option>
              {uniqueSuppliers.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
              {tr(language, {
                ru: 'Ссылка на товар',
                en: 'Product link',
                it: 'Link prodotto',
                es: 'Enlace del producto',
                de: 'Produktlink',
              })}
            </label>
            <select
              value={filters.url}
              onChange={(e) =>
                onChangeFilters({ url: e.target.value as 'all' | 'with_url' | 'without_url' })
              }
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              <option value="all">
                {tr(language, {
                  ru: 'Любые позиции',
                  en: 'Any items',
                  it: 'Tutte le voci',
                  es: 'Cualquier artículo',
                  de: 'Alle Positionen',
                })}
              </option>
              <option value="with_url">
                {tr(language, {
                  ru: 'Только со ссылкой',
                  en: 'With link only',
                  it: 'Solo con link',
                  es: 'Solo con enlace',
                  de: 'Nur mit Link',
                })}
              </option>
              <option value="without_url">
                {tr(language, {
                  ru: 'Без ссылки',
                  en: 'Without link',
                  it: 'Senza link',
                  es: 'Sin enlace',
                  de: 'Ohne Link',
                })}
              </option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 pt-0.5 text-xs text-[#323130] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.ifraOnly}
              onChange={(e) => onChangeFilters({ ifraOnly: e.target.checked })}
              className="rounded border-[#D2D0CE] accent-[var(--theme-accent)]"
            />
            <span>
              {tr(language, {
                ru: 'Только с лимитом IFRA',
                en: 'With IFRA limit only',
                it: 'Solo con limite IFRA',
                es: 'Solo con límite IFRA',
                de: 'Nur mit IFRA-Limit',
              })}
            </span>
          </label>

          <label className="inline-flex items-center gap-2 pt-0.5 text-xs text-[#B45309] font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.lowStockOnly}
              onChange={(e) =>
                onChangeFilters({
                  lowStockOnly: e.target.checked,
                  status: e.target.checked ? 'in_stock' : filters.status,
                })
              }
              className="rounded border-[#D2D0CE] accent-[#B45309]"
            />
            <span>
              {tr(language, {
                ru: 'Заканчивается',
                en: 'Running low',
                it: 'In esaurimento',
                es: 'Agotándose',
                de: 'Wird knapp',
              })}
            </span>
          </label>
        </div>

        <div className="border-t border-[#EDEBE9] pt-3">
          <label className="block text-[11px] font-semibold text-[#605E5C] mb-1">
            {tr(language, {
              ru: 'Сортировка списка',
              en: 'Sort list',
              it: 'Ordina elenco',
              es: 'Ordenar lista',
              de: 'Liste sortieren',
            })}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onChangeFilters({ sortBy: e.target.value as IngredientSortBy })}
            className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] focus:border-[var(--theme-accent)] focus:outline-none"
          >
            <option value="default">
              {tr(language, {
                ru: 'По умолчанию',
                en: 'Default',
                it: 'Predefinito',
                es: 'Predeterminado',
                de: 'Standard',
              })}
            </option>
            <option value="name_asc">
              {tr(language, {
                ru: 'По названию (А–Я)',
                en: 'Name (A–Z)',
                it: 'Nome (A–Z)',
                es: 'Nombre (A–Z)',
                de: 'Name (A–Z)',
              })}
            </option>
            <option value="unit_price_asc">
              {tr(language, {
                ru: 'Сначала дешевле (за ед.)',
                en: 'Lowest unit price',
                it: 'Prezzo unitario crescente',
                es: 'Menor precio por unidad',
                de: 'Günstigste pro Einheit',
              })}
            </option>
            <option value="unit_price_desc">
              {tr(language, {
                ru: 'Сначала дороже (за ед.)',
                en: 'Highest unit price',
                it: 'Prezzo unitario decrescente',
                es: 'Mayor precio por unidad',
                de: 'Teuerste pro Einheit',
              })}
            </option>
            <option value="total_price_desc">
              {tr(language, {
                ru: 'Дорогие упаковки сверху',
                en: 'Most expensive packs first',
                it: 'Confezioni più costose prima',
                es: 'Envases más caros primero',
                de: 'Teuerste Gebinde zuerst',
              })}
            </option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="print:hidden hidden lg:block w-72 xl:w-80 shrink-0 sticky top-4">
        <div className="flex flex-col bg-white rounded-xl border border-[#D2D0CE] shadow-xs overflow-hidden max-h-[calc(100vh-120px)]">
          {paneBody}
        </div>
      </aside>
      <div className="print:hidden lg:hidden fixed inset-0 z-50 flex justify-end">
        <div className="fixed inset-0 bg-[#252423]/40" onClick={onClose} />
        <aside className="relative z-10 w-80 max-w-[85vw] h-full bg-white shadow-xl flex flex-col border-l border-[#D2D0CE]">
          {paneBody}
        </aside>
      </div>
    </>
  );
}
