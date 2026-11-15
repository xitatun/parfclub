import {
  BookOpen,
  Clock,
  Lightbulb,
  NotebookPen,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  getIngredientOriginLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  INGREDIENT_ORIGIN_LABELS,
  NOTE_TIER_LABELS,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  Ingredient,
  IngredientOrigin,
  LibraryIngredient,
  LibraryNote,
  NoteTier,
  OlfactoryFamilyKey,
} from '../types/perfume';
import { generateId, todayIsoDate } from '../utils/storage';

interface IngredientLibraryProps {
  library: LibraryIngredient[];
  studioIngredients: Ingredient[];
  language: AppLanguage;
  onAddLibraryItem: (item: LibraryIngredient) => void;
  onUpdateLibraryItem: (item: LibraryIngredient) => void;
  onDeleteLibraryItem: (id: string) => void;
  onAddToStudioWishlist: (item: LibraryIngredient) => void;
}

type LibrarySortBy = 'updated' | 'scent_desc' | 'ideas_desc' | 'name_asc';
type LibraryRatingFilter = 'all' | 'scent_8' | 'ideas_8';

const BLOTTER_PRESETS: Record<AppLanguage, string[]> = {
  ru: ['1–2 часа', '6–8 часов', '24 часа', '48+ часов', '5–7 дней'],
  en: ['1–2 hours', '6–8 hours', '24 hours', '48+ hours', '5–7 days'],
  it: ['1–2 ore', '6–8 ore', '24 ore', '48+ ore', '5–7 giorni'],
  es: ['1–2 horas', '6–8 horas', '24 horas', '48+ horas', '5–7 días'],
  de: ['1–2 Std.', '6–8 Std.', '24 Std.', '48+ Std.', '5–7 Tage'],
};

function RatingScaleInput({
  label,
  value,
  onChange,
  accentClass,
  icon,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  accentClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#323130]">
          {icon}
          <span>{label}</span>
        </span>
        <span className="font-mono text-xs font-bold tabular-nums text-[#181917]">
          {value}/10
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const active = value === num;
          const filled = num <= value;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`h-7 rounded border font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                active
                  ? `${accentClass} border-transparent text-white`
                  : filled
                    ? 'border-[#D2D0CE] bg-[#FAF9F8] text-[#181917] hover:border-[#8A8886]'
                    : 'border-[#E1DFDD] bg-white text-[#797775] hover:bg-[#FAF9F8]'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function IngredientLibrary({
  library,
  studioIngredients,
  language,
  onAddLibraryItem,
  onUpdateLibraryItem,
  onDeleteLibraryItem,
  onAddToStudioWishlist,
}: IngredientLibraryProps) {
  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | NoteTier>('all');
  const [familyFilter, setFamilyFilter] = useState<'all' | OlfactoryFamilyKey>('all');
  const [originFilter, setOriginFilter] = useState<'all' | IngredientOrigin>('all');
  const [ratingFilter, setRatingFilter] = useState<LibraryRatingFilter>('all');
  const [sortBy, setSortBy] = useState<LibrarySortBy>('updated');
  const [visibleCount, setVisibleCount] = useState<number>(40);

  // Selection & editor state
  const [selectedId, setSelectedId] = useState<string | null>(library[0]?.id || null);
  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit'>('closed');

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCas, setFormCas] = useState('');
  const [formFamily, setFormFamily] = useState<OlfactoryFamilyKey>('citrus');
  const [formTier, setFormTier] = useState<NoteTier>('heart');
  const [formOrigin, setFormOrigin] = useState<IngredientOrigin>('natural');
  const [formBlotterLongevity, setFormBlotterLongevity] = useState('');
  const [formProperties, setFormProperties] = useState('');
  const [formScentDesc, setFormScentDesc] = useState('');
  const [formScentRating, setFormScentRating] = useState(8);
  const [formIdeasRating, setFormIdeasRating] = useState(8);
  const [formInitialNote, setFormInitialNote] = useState('');

  // Quick note state on selected item
  const [newNoteDate, setNewNoteDate] = useState(todayIsoDate());
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  useEffect(() => {
    setVisibleCount(40);
  }, [searchQuery, tierFilter, familyFilter, originFilter, ratingFilter, sortBy]);

  const filteredLibrary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = library.filter((item) => {
      if (tierFilter !== 'all' && item.tier !== tierFilter) return false;
      if (familyFilter !== 'all' && item.family !== familyFilter) return false;
      if (originFilter !== 'all' && item.origin !== originFilter) return false;
      if (ratingFilter === 'scent_8' && item.scentRating < 8) return false;
      if (ratingFilter === 'ideas_8' && item.futureIdeasRating < 8) return false;
      if (q) {
        const hay = [
          item.name,
          item.inciOrCas || '',
          item.blotterLongevity || '',
          item.properties,
          item.scentDescription,
          ...item.notes.map((n) => n.text),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'scent_desc') return b.scentRating - a.scentRating || a.name.localeCompare(b.name);
      if (sortBy === 'ideas_desc')
        return b.futureIdeasRating - a.futureIdeasRating || a.name.localeCompare(b.name);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [library, searchQuery, tierFilter, familyFilter, originFilter, ratingFilter, sortBy]);

  const visibleLibrary = useMemo(
    () => filteredLibrary.slice(0, visibleCount),
    [filteredLibrary, visibleCount]
  );

  useEffect(() => {
    if (selectedId && library.some((item) => item.id === selectedId)) return;
    setSelectedId(filteredLibrary[0]?.id || library[0]?.id || null);
  }, [library, filteredLibrary, selectedId]);

  const selectedItem = useMemo(
    () => library.find((item) => item.id === selectedId) || null,
    [library, selectedId]
  );

  const stats = useMemo(() => {
    const count = library.length;
    const avgScent =
      count > 0 ? library.reduce((s, i) => s + i.scentRating, 0) / count : 0;
    const highIdeasCount = library.filter((i) => i.futureIdeasRating >= 8).length;
    const totalNotes = library.reduce((s, i) => s + i.notes.length, 0);
    return { count, avgScent, highIdeasCount, totalNotes };
  }, [library]);

  const studioNamesLower = useMemo(
    () => new Set(studioIngredients.map((i) => i.name.trim().toLowerCase())),
    [studioIngredients]
  );

  const openCreateForm = () => {
    setFormMode('create');
    setFormName('');
    setFormCas('');
    setFormFamily('citrus');
    setFormTier('heart');
    setFormOrigin('natural');
    setFormBlotterLongevity('');
    setFormProperties('');
    setFormScentDesc('');
    setFormScentRating(8);
    setFormIdeasRating(8);
    setFormInitialNote('');
  };

  const openEditForm = (item: LibraryIngredient) => {
    setFormMode('edit');
    setFormName(item.name);
    setFormCas(item.inciOrCas || '');
    setFormFamily(item.family);
    setFormTier(item.tier);
    setFormOrigin(item.origin);
    setFormBlotterLongevity(item.blotterLongevity || '');
    setFormProperties(item.properties);
    setFormScentDesc(item.scentDescription);
    setFormScentRating(item.scentRating);
    setFormIdeasRating(item.futureIdeasRating);
    setFormInitialNote('');
  };

  const handlePrefillFromStudio = (ingId: string) => {
    const ing = studioIngredients.find((i) => i.id === ingId);
    if (!ing) return;
    setFormName(ing.name);
    setFormCas(ing.inciOrCas || '');
    setFormFamily(ing.family);
    setFormTier(ing.tier);
    setFormOrigin(ing.origin);
    setFormBlotterLongevity(ing.longevityLabel && ing.longevityLabel !== '—' ? ing.longevityLabel : '');
    const propsParts = [
      ing.ifraLimitPercent !== undefined
        ? `IFRA: ${ing.ifraLimitPercent}%`
        : '',
      ing.solventNote || '',
    ].filter(Boolean);
    setFormProperties(propsParts.join('. '));
    setFormScentDesc(ing.olfactoryNotes || '');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const today = todayIsoDate();

    if (formMode === 'edit' && selectedItem) {
      const updated: LibraryIngredient = {
        ...selectedItem,
        name: formName.trim(),
        inciOrCas: formCas.trim() || undefined,
        family: formFamily,
        tier: formTier,
        origin: formOrigin,
        blotterLongevity: formBlotterLongevity.trim() || undefined,
        properties: formProperties.trim(),
        scentDescription: formScentDesc.trim(),
        scentRating: formScentRating,
        futureIdeasRating: formIdeasRating,
        updatedAt: today,
      };
      onUpdateLibraryItem(updated);
      setFormMode('closed');
      return;
    }

    const newId = generateId('lib');
    const initialNotes: LibraryNote[] = formInitialNote.trim()
      ? [{ id: generateId('libn'), date: today, text: formInitialNote.trim() }]
      : [];

    const created: LibraryIngredient = {
      id: newId,
      name: formName.trim(),
      inciOrCas: formCas.trim() || undefined,
      family: formFamily,
      tier: formTier,
      origin: formOrigin,
      blotterLongevity: formBlotterLongevity.trim() || undefined,
      properties: formProperties.trim(),
      scentDescription: formScentDesc.trim(),
      scentRating: formScentRating,
      futureIdeasRating: formIdeasRating,
      notes: initialNotes,
      createdAt: today,
      updatedAt: today,
    };
    onAddLibraryItem(created);
    setSelectedId(newId);
    setFormMode('closed');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !newNoteText.trim()) return;
    const note: LibraryNote = {
      id: generateId('libn'),
      date: newNoteDate || todayIsoDate(),
      text: newNoteText.trim(),
    };
    onUpdateLibraryItem({
      ...selectedItem,
      notes: [note, ...selectedItem.notes],
      updatedAt: todayIsoDate(),
    });
    setNewNoteText('');
  };

  const handleSaveEditedNote = (noteId: string) => {
    if (!selectedItem || !editingNoteText.trim()) return;
    onUpdateLibraryItem({
      ...selectedItem,
      notes: selectedItem.notes.map((n) =>
        n.id === noteId ? { ...n, text: editingNoteText.trim() } : n
      ),
      updatedAt: todayIsoDate(),
    });
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedItem) return;
    onUpdateLibraryItem({
      ...selectedItem,
      notes: selectedItem.notes.filter((n) => n.id !== noteId),
      updatedAt: todayIsoDate(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DFDD] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">
            {tr(language, {
              ru: 'Библиотека ингредиентов',
              en: 'Ingredient Library',
              it: 'Libreria Ingredienti',
              es: 'Biblioteca de Ingredientes',
              de: 'Rohstoff-Bibliothek',
            })}
          </h1>
          <p className="mt-1 text-sm text-[#605E5C] max-w-2xl">
            {tr(language, {
              ru: 'Личный справочник известных душистых веществ и масел: свойства, чем пахнет, две оценки (как пахнет и потенциал для будущих идей) и ваши заметки.',
              en: 'Personal reference database of known aroma materials: physical properties, scent impressions, dual ratings (scent & future ideas), and study notes.',
              it: 'Archivio personale delle materie aromatiche conosciute: proprietà fisiche, impressioni olfattive, doppia valutazione (odore e idee future) e note di studio.',
              es: 'Referencia personal de materias aromáticas conocidas: propiedades físicas, perfil olfativo, doble valoración (aroma e ideas futuras) y notas propias.',
              de: 'Persönliches Nachschlagewerk bekannter Duftstoffe: Eigenschaften, Geruchsprofil, zwei Bewertungen (Duft & Potenzial für Ideen) sowie Studiennotizen.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>
            {tr(language, {
              ru: 'Добавить ингредиент',
              en: 'Add Known Ingredient',
              it: 'Aggiungi Ingrediente',
              es: 'Añadir Ingrediente',
              de: 'Rohstoff hinzufügen',
            })}
          </span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Ингредиентов в библиотеке',
              en: 'Known Materials',
              it: 'Materie conosciute',
              es: 'Materias conocidas',
              de: 'Bekannte Rohstoffe',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {stats.count}
          </div>
        </div>
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Средняя оценка аромата',
              en: 'Avg. Scent Rating',
              it: 'Valutazione media odore',
              es: 'Valoración media aroma',
              de: 'Ø Duftbewertung',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#B45309]">
            {stats.avgScent.toFixed(1)}
            <span className="text-sm font-normal text-[#797775]">/10</span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Для будущих идей (8+)',
              en: 'Top for Future Ideas (8+)',
              it: 'Top per idee future (8+)',
              es: 'Top para ideas futuras (8+)',
              de: 'Top für künftige Ideen (8+)',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[var(--theme-accent)]">
            {stats.highIdeasCount}
          </div>
        </div>
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Всего заметок',
              en: 'Personal Notes',
              it: 'Note personali',
              es: 'Notas personales',
              de: 'Eigene Notizen',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {stats.totalNotes}
          </div>
        </div>
      </div>

      {/* Create / Edit Form Panel */}
      {formMode !== 'closed' && (
        <form
          onSubmit={handleSubmitForm}
          className="rounded-xl border border-[var(--theme-accent)] bg-white p-5 space-y-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEBE9] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--theme-accent)]" />
              <h2 className="text-base font-semibold text-[#181917]">
                {formMode === 'edit'
                  ? tr(language, {
                      ru: 'Редактирование ингредиента',
                      en: 'Edit Library Ingredient',
                      it: 'Modifica Ingrediente',
                      es: 'Editar Ingrediente',
                      de: 'Rohstoff bearbeiten',
                    })
                  : tr(language, {
                      ru: 'Новый известный ингредиент',
                      en: 'New Library Ingredient',
                      it: 'Nuovo Ingrediente in Libreria',
                      es: 'Nuevo Ingrediente en Biblioteca',
                      de: 'Neuer Bibliotheks-Rohstoff',
                    })}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {formMode === 'create' && studioIngredients.length > 0 && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handlePrefillFromStudio(e.target.value);
                  }}
                  aria-label={tr(language, {
                    ru: 'Заполнить из базы склада',
                    en: 'Pre-fill from studio stock',
                    it: 'Compila dall’archivio studio',
                    es: 'Rellenar desde el stock del taller',
                    de: 'Aus Atelier-Bestand übernehmen',
                  })}
                  className="max-w-[230px] rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  <option value="">
                    {tr(language, {
                      ru: 'Подставить из каталога склада...',
                      en: 'Pre-fill from studio catalog...',
                      it: 'Precompila dal catalogo...',
                      es: 'Rellenar desde el catálogo...',
                      de: 'Aus Katalog vorbefüllen...',
                    })}
                  </option>
                  {studioIngredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => setFormMode('closed')}
                className="rounded-lg p-1.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                aria-label={tr(language, {
                  ru: 'Закрыть форму',
                  en: 'Close form',
                  it: 'Chiudi modulo',
                  es: 'Cerrar formulario',
                  de: 'Formular schließen',
                })}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Название ингредиента *',
                  en: 'Ingredient Name *',
                  it: 'Nome Ingrediente *',
                  es: 'Nombre del Ingrediente *',
                  de: 'Rohstoffname *',
                })}
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Напр.: Гедион HC, Роза Отто, Почки чёрной смородины...',
                  en: 'e.g., Hedione HC, Rose Otto, Blackcurrant Bud...',
                  it: 'Es.: Hedione HC, Rosa Otto, Gemme di Ribes Nero...',
                  es: 'Ej.: Hedione HC, Rosa Otto, Yemas de Grosella Negra...',
                  de: 'Z. B.: Hedione HC, Rosenöl Otto, Schwarze Johannisbeere...',
                })}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-sm text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'CAS / INCI / синоним',
                  en: 'CAS / INCI / Synonym',
                  it: 'CAS / INCI / Sinonimo',
                  es: 'CAS / INCI / Sinónimo',
                  de: 'CAS / INCI / Synonym',
                })}
              </label>
              <input
                type="text"
                value={formCas}
                onChange={(e) => setFormCas(e.target.value)}
                placeholder="CAS 24851-98-7"
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Ярус ноты',
                  en: 'Note Tier',
                  it: 'Livello Nota',
                  es: 'Nivel de Nota',
                  de: 'Duftebene',
                })}
              </label>
              <select
                value={formTier}
                onChange={(e) => setFormTier(e.target.value as NoteTier)}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(NOTE_TIER_LABELS) as NoteTier[]).map((t) => (
                  <option key={t} value={t}>
                    {getNoteTierShort(t, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Семейство',
                  en: 'Family',
                  it: 'Famiglia',
                  es: 'Familia',
                  de: 'Duftfamilie',
                })}
              </label>
              <select
                value={formFamily}
                onChange={(e) => setFormFamily(e.target.value as OlfactoryFamilyKey)}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {OLFACTORY_FAMILIES.map((f) => (
                  <option key={f.key} value={f.key}>
                    {getOlfactoryFamilyLabel(f.key, language)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Происхождение',
                  en: 'Origin',
                  it: 'Origine',
                  es: 'Origen',
                  de: 'Herkunft',
                })}
              </label>
              <select
                value={formOrigin}
                onChange={(e) => setFormOrigin(e.target.value as IngredientOrigin)}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(INGREDIENT_ORIGIN_LABELS) as IngredientOrigin[]).map((o) => (
                  <option key={o} value={o}>
                    {getIngredientOriginLabel(o, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-8">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Время на блоттере (сколько держится на блоттере)',
                  en: 'Time on Blotter (how long it lasts on paper strip)',
                  it: 'Durata su mouillette (quanto persiste sulla striscia)',
                  es: 'Duración en secante (cuánto perdura en tira olfativa)',
                  de: 'Haltbarkeit auf dem Riechstreifen (Duftdauer)',
                })}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formBlotterLongevity}
                  onChange={(e) => setFormBlotterLongevity(e.target.value)}
                  placeholder={tr(language, {
                    ru: 'Напр.: 1–2 часа, 24 часа, 5–7 дней...',
                    en: 'e.g., 1–2 hours, 24 hours, 5–7 days...',
                    it: 'Es.: 1–2 ore, 24 ore, 5–7 giorni...',
                    es: 'Ej.: 1–2 horas, 24 horas, 5–7 días...',
                    de: 'Z. B.: 1–2 Std., 24 Std., 5–7 Tage...',
                  })}
                  className="flex-1 rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-1">
                  {BLOTTER_PRESETS[language].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormBlotterLongevity(preset)}
                      className={`rounded border px-2 py-1.5 font-mono text-[11px] transition-colors ${
                        formBlotterLongevity === preset
                          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white'
                          : 'border-[#E1DFDD] bg-[#FAF9F8] text-[#575955] hover:bg-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Свойства (стойкость, диффузия, дозировка, растворимость, IFRA)',
                  en: 'Properties (tenacity, diffusion, dosage, IFRA, solubility)',
                  it: 'Proprietà (tenacia, diffusione, dosaggio, IFRA, solubilità)',
                  es: 'Propiedades (tenacidad, difusión, dosificación, IFRA, solubilidad)',
                  de: 'Eigenschaften (Haltbarkeit, Diffusion, Dosierung, IFRA, Löslichkeit)',
                })}
              </label>
              <textarea
                rows={3}
                value={formProperties}
                onChange={(e) => setFormProperties(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Летучесть, стойкость на блоттере/коже, рабочая концентрация, лимит IFRA, в чём растворяется...',
                  en: 'Volatility, tenacity in hours, recommended dilution, IFRA limit, blending behavior...',
                  it: 'Volatilità, persistenza su pelle/mouillette, diluizione consigliata, limite IFRA...',
                  es: 'Volatilidad, fijación en horas, dilución recomendada, límite IFRA, solubilidad...',
                  de: 'Flüchtigkeit, Haftung, empfohlene Verdünnung, IFRA-Limit, Mischverhalten...',
                })}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs leading-relaxed text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Чем пахнет (ольфакторный профиль)',
                  en: 'What it smells like (olfactory impression)',
                  it: 'Che odore ha (profilo olfattivo)',
                  es: 'A qué huele (perfil olfativo)',
                  de: 'Wonach es riecht (Duftprofil)',
                })}
              </label>
              <textarea
                rows={3}
                value={formScentDesc}
                onChange={(e) => setFormScentDesc(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Опишите старт, грани, текстуру, теплоту/свежесть и базу раскрытия...',
                  en: 'Describe the opening, facets, texture, warmth, and dry-down...',
                  it: 'Descrivi apertura, sfaccettature, texture, calore e fondo...',
                  es: 'Describe la salida, facetas, textura, calidez y secado...',
                  de: 'Beschreiben Sie Kopfnote, Facetten, Textur, Wärme und Ausklang...',
                })}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs leading-relaxed text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3.5">
            <RatingScaleInput
              label={tr(language, {
                ru: 'Оценка: как пахнет',
                en: 'Rating: How it smells',
                it: 'Valutazione: odore',
                es: 'Valoración: cómo huele',
                de: 'Bewertung: Dufteindruck',
              })}
              value={formScentRating}
              onChange={setFormScentRating}
              accentClass="bg-[#D97706]"
              icon={<Sparkles className="h-3.5 w-3.5 text-[#D97706]" />}
            />
            <RatingScaleInput
              label={tr(language, {
                ru: 'Оценка: для будущих идей',
                en: 'Rating: Potential for future ideas',
                it: 'Valutazione: per idee future',
                es: 'Valoración: para ideas futuras',
                de: 'Bewertung: für künftige Ideen',
              })}
              value={formIdeasRating}
              onChange={setFormIdeasRating}
              accentClass="bg-[var(--theme-accent)]"
              icon={<Lightbulb className="h-3.5 w-3.5 text-[var(--theme-accent)]" />}
            />
          </div>

          {formMode === 'create' && (
            <div>
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Первая личная заметка (необязательно)',
                  en: 'Initial personal note (optional)',
                  it: 'Prima nota personale (facoltativa)',
                  es: 'Primera nota personal (opcional)',
                  de: 'Erste persönliche Notiz (optional)',
                })}
              </label>
              <input
                type="text"
                value={formInitialNote}
                onChange={(e) => setFormInitialNote(e.target.value)}
                placeholder={tr(language, {
                  ru: 'Идеи сочетаний, впечатления с блоттера, особенности пробника...',
                  en: 'Pairing ideas, blotter impressions, supplier sample quality...',
                  it: 'Idee di abbinamento, impressioni su mouillette, qualità del campione...',
                  es: 'Ideas de mezcla, impresiones en secante, calidad de la muestra...',
                  de: 'Kombinationsideen, Riechstreifen-Eindrücke, Probenqualität...',
                })}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFormMode('closed')}
              className="rounded-lg border border-[#D2D0CE] bg-white px-4 py-2 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1]"
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
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
            >
              <span>
                {formMode === 'edit'
                  ? tr(language, {
                      ru: 'Сохранить изменения',
                      en: 'Save Changes',
                      it: 'Salva Modifiche',
                      es: 'Guardar Cambios',
                      de: 'Änderungen speichern',
                    })
                  : tr(language, {
                      ru: 'Добавить в библиотеку',
                      en: 'Add to Library',
                      it: 'Aggiungi alla Libreria',
                      es: 'Añadir a la Biblioteca',
                      de: 'Zur Bibliothek hinzufügen',
                    })}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Filters Bar */}
      <div className="rounded-xl border border-[#E1DFDD] bg-white p-3.5 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[210px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#797775]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tr(language, {
              ru: 'Поиск по названию, CAS, запаху, свойствам и заметкам...',
              en: 'Search name, CAS, scent, properties, or notes...',
              it: 'Cerca per nome, CAS, odore, proprietà o note...',
              es: 'Buscar por nombre, CAS, aroma, propiedades o notas...',
              de: 'Suche nach Name, CAS, Duft, Eigenschaften oder Notizen...',
            })}
            className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] pl-8 pr-3 py-1.5 text-xs text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as 'all' | NoteTier)}
          aria-label={tr(language, {
            ru: 'Фильтр по ярусу ноты',
            en: 'Filter by note tier',
            it: 'Filtra per livello nota',
            es: 'Filtrar por nivel de nota',
            de: 'Nach Duftebene filtern',
          })}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
        >
          <option value="all">
            {tr(language, {
              ru: 'Все ноты',
              en: 'All tiers',
              it: 'Tutti i livelli',
              es: 'Todas las notas',
              de: 'Alle Ebenen',
            })}
          </option>
          {(Object.keys(NOTE_TIER_LABELS) as NoteTier[]).map((t) => (
            <option key={t} value={t}>
              {getNoteTierShort(t, language)}
            </option>
          ))}
        </select>

        <select
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value as 'all' | OlfactoryFamilyKey)}
          aria-label={tr(language, {
            ru: 'Фильтр по семейству',
            en: 'Filter by olfactory family',
            it: 'Filtra per famiglia olfattiva',
            es: 'Filtrar por familia olfativa',
            de: 'Nach Duftfamilie filtern',
          })}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
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
          {OLFACTORY_FAMILIES.map((f) => (
            <option key={f.key} value={f.key}>
              {getOlfactoryFamilyLabel(f.key, language)}
            </option>
          ))}
        </select>

        <select
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value as 'all' | IngredientOrigin)}
          aria-label={tr(language, {
            ru: 'Фильтр по происхождению',
            en: 'Filter by origin',
            it: 'Filtra per origine',
            es: 'Filtrar por origen',
            de: 'Nach Herkunft filtern',
          })}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
        >
          <option value="all">
            {tr(language, {
              ru: 'Все типы сырья',
              en: 'All origins',
              it: 'Tutte le origini',
              es: 'Todos los orígenes',
              de: 'Alle Herkünfte',
            })}
          </option>
          {(Object.keys(INGREDIENT_ORIGIN_LABELS) as IngredientOrigin[]).map((o) => (
            <option key={o} value={o}>
              {getIngredientOriginLabel(o, language)}
            </option>
          ))}
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value as LibraryRatingFilter)}
          aria-label={tr(language, {
            ru: 'Фильтр по оценке',
            en: 'Filter by rating',
            it: 'Filtra per valutazione',
            es: 'Filtrar por valoración',
            de: 'Nach Bewertung filtern',
          })}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
        >
          <option value="all">
            {tr(language, {
              ru: 'Любая оценка',
              en: 'Any rating',
              it: 'Qualsiasi voto',
              es: 'Cualquier nota',
              de: 'Alle Bewertungen',
            })}
          </option>
          <option value="scent_8">
            {tr(language, {
              ru: 'Как пахнет ≥ 8',
              en: 'How it smells ≥ 8',
              it: 'Odore ≥ 8',
              es: 'Cómo huele ≥ 8',
              de: 'Dufteindruck ≥ 8',
            })}
          </option>
          <option value="ideas_8">
            {tr(language, {
              ru: 'Для будущих идей ≥ 8',
              en: 'Future ideas ≥ 8',
              it: 'Idee future ≥ 8',
              es: 'Ideas futuras ≥ 8',
              de: 'Für Ideen ≥ 8',
            })}
          </option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as LibrarySortBy)}
          aria-label={tr(language, {
            ru: 'Сортировка библиотеки',
            en: 'Sort library',
            it: 'Ordina libreria',
            es: 'Ordenar biblioteca',
            de: 'Bibliothek sortieren',
          })}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
        >
          <option value="updated">
            {tr(language, {
              ru: 'Сначала обновлённые',
              en: 'Recently updated',
              it: 'Aggiornati di recente',
              es: 'Actualizados recientemente',
              de: 'Zuletzt aktualisiert',
            })}
          </option>
          <option value="scent_desc">
            {tr(language, {
              ru: 'Выше оценка аромата',
              en: 'Best aroma rating',
              it: 'Miglior voto odore',
              es: 'Mejor puntuación de aroma',
              de: 'Beste Duftbewertung',
            })}
          </option>
          <option value="ideas_desc">
            {tr(language, {
              ru: 'Выше для будущих идей',
              en: 'Best for future ideas',
              it: 'Migliore per idee future',
              es: 'Mejor para ideas futuras',
              de: 'Bestes Ideenpotenzial',
            })}
          </option>
          <option value="name_asc">
            {tr(language, {
              ru: 'По алфавиту',
              en: 'Name A–Z',
              it: 'Nome A–Z',
              es: 'Nombre A–Z',
              de: 'Name A–Z',
            })}
          </option>
        </select>
      </div>

      {/* Master-Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredLibrary.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D2D0CE] bg-white p-8 text-center space-y-2">
              <p className="text-sm font-medium text-[#181917]">
                {library.length === 0
                  ? tr(language, {
                      ru: 'В библиотеке пока нет ингредиентов',
                      en: 'Your library is empty',
                      it: 'La tua libreria è vuota',
                      es: 'Tu biblioteca está vacía',
                      de: 'Ihre Bibliothek ist leer',
                    })
                  : tr(language, {
                      ru: 'Ничего не найдено по фильтрам',
                      en: 'No matching ingredients',
                      it: 'Nessun ingrediente trovato',
                      es: 'Sin ingredientes coincidentes',
                      de: 'Keine passenden Rohstoffe',
                    })}
              </p>
              <p className="text-xs text-[#605E5C]">
                {library.length === 0
                  ? tr(language, {
                      ru: 'Добавляйте известные материалы, чтобы сохранять свойства, запах, оценки и заметки.',
                      en: 'Add known aroma materials to record their properties, scent, ratings, and notes.',
                      it: 'Aggiungi materie aromatiche per salvarne proprietà, odore, valutazioni e note.',
                      es: 'Añade materias aromáticas para guardar propiedades, aroma, valoraciones y notas.',
                      de: 'Fügen Sie bekannte Rohstoffe hinzu, um Eigenschaften, Duft, Bewertungen und Notizen zu speichern.',
                    })
                  : tr(language, {
                      ru: 'Попробуйте сбросить строку поиска или фильтры.',
                      en: 'Try clearing search or filter criteria.',
                      it: 'Prova a reimpostare la ricerca o i filtri.',
                      es: 'Prueba a limpiar la búsqueda o los filtros.',
                      de: 'Setzen Sie die Suche oder Filter zurück.',
                    })}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 text-xs text-[#605E5C]">
                <span>
                  {tr(language, {
                    ru: `Найдено: ${filteredLibrary.length} (показано ${visibleLibrary.length})`,
                    en: `Found: ${filteredLibrary.length} (showing ${visibleLibrary.length})`,
                    it: `Trovati: ${filteredLibrary.length} (mostrati ${visibleLibrary.length})`,
                    es: `Encontrados: ${filteredLibrary.length} (mostrando ${visibleLibrary.length})`,
                    de: `Gefunden: ${filteredLibrary.length} (angezeigt ${visibleLibrary.length})`,
                  })}
                </span>
                <span className="font-mono text-[11px] text-[#797775]">
                  IFF · ParfClub · PerfumeRawMaterial
                </span>
              </div>
              {visibleLibrary.map((item) => {
                const active = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      if (formMode === 'edit') setFormMode('closed');
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/50'
                        : 'border-[#E1DFDD] bg-white hover:border-[#8A8886]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#181917] truncate">
                          {item.name}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#605E5C]">
                          <span>{getNoteTierShort(item.tier, language)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{getOlfactoryFamilyLabel(item.family, language)}</span>
                          {item.inciOrCas && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{item.inciOrCas}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-[#797775] shrink-0">
                        {item.notes.length}{' '}
                        {tr(language, { ru: 'зам.', en: 'notes', it: 'note', es: 'notas', de: 'Not.' })}
                      </span>
                    </div>

                    {item.scentDescription && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#575955]">
                        {item.scentDescription}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#EDEBE9] pt-2.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                        <span className="text-[#605E5C]">
                          {tr(language, {
                            ru: 'Запах:',
                            en: 'Smell:',
                            it: 'Odore:',
                            es: 'Aroma:',
                            de: 'Duft:',
                          })}
                        </span>
                        <span className="font-mono font-semibold tabular-nums text-[#181917]">
                          {item.scentRating}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                        <span className="text-[#605E5C]">
                          {tr(language, {
                            ru: 'Идеи:',
                            en: 'Ideas:',
                            it: 'Idee:',
                            es: 'Ideas:',
                            de: 'Ideen:',
                          })}
                        </span>
                        <span className="font-mono font-semibold tabular-nums text-[#181917]">
                          {item.futureIdeasRating}/10
                        </span>
                      </div>
                      {item.blotterLongevity && (
                        <div className="flex items-center gap-1 text-[#575955] ml-auto">
                          <Clock className="h-3 w-3 text-[#797775] shrink-0" />
                          <span className="font-mono text-[11px] tabular-nums">
                            {item.blotterLongevity}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {visibleLibrary.length < filteredLibrary.length && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 60)}
                    className="rounded-lg border border-[#D2D0CE] bg-white px-4 py-2 text-xs font-medium text-[#181917] hover:bg-[#F3F2F1]"
                  >
                    {tr(language, {
                      ru: `Показать ещё 60 (осталось ${filteredLibrary.length - visibleLibrary.length})`,
                      en: `Show 60 more (${filteredLibrary.length - visibleLibrary.length} left)`,
                      it: `Mostra altri 60 (${filteredLibrary.length - visibleLibrary.length} rimanenti)`,
                      es: `Mostrar 60 más (${filteredLibrary.length - visibleLibrary.length} restantes)`,
                      de: `60 weitere anzeigen (${filteredLibrary.length - visibleLibrary.length} übrig)`,
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredLibrary.length)}
                    className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] px-3.5 py-2 text-xs text-[#605E5C] hover:bg-white hover:text-[#181917]"
                  >
                    {tr(language, {
                      ru: 'Показать все',
                      en: 'Show all',
                      it: 'Mostra tutti',
                      es: 'Mostrar todos',
                      de: 'Alle anzeigen',
                    })}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Detail & Notes Inspector */}
        <div className="lg:col-span-7 lg:sticky lg:top-4 lg:self-start">
          {selectedItem ? (
            <div className="rounded-xl border border-[#E1DFDD] bg-white p-6 space-y-5">
              {/* Item Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-[#EDEBE9] pb-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#605E5C]">
                    <span className="font-medium text-[var(--theme-accent)]">
                      {getNoteTierShort(selectedItem.tier, language)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{getOlfactoryFamilyLabel(selectedItem.family, language)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getIngredientOriginLabel(selectedItem.origin, language)}</span>
                    {selectedItem.inciOrCas && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{selectedItem.inciOrCas}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-[#181917]">
                    {selectedItem.name}
                  </h2>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-[#EDEBE9] bg-[#FAF9F8] px-2.5 py-1 text-xs text-[#323130]">
                    <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0" />
                    <span className="text-[#605E5C]">
                      {tr(language, {
                        ru: 'На блоттере:',
                        en: 'Time on blotter:',
                        it: 'Su mouillette:',
                        es: 'En secante:',
                        de: 'Auf Riechstreifen:',
                      })}
                    </span>
                    <span className="font-mono font-semibold text-[#181917]">
                      {selectedItem.blotterLongevity ||
                        tr(language, {
                          ru: 'Не указано',
                          en: 'Not specified',
                          it: 'Non specificato',
                          es: 'No especificado',
                          de: 'Nicht angegeben',
                        })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {!studioNamesLower.has(selectedItem.name.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => onAddToStudioWishlist(selectedItem)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs font-medium text-[#181917] hover:bg-white"
                      title={tr(language, {
                        ru: 'Добавить в каталог склада со статусом «Хочу купить»',
                        en: 'Add to studio Ingredients catalog as Wishlist',
                        it: 'Aggiungi al catalogo studio come Da acquistare',
                        es: 'Añadir al catálogo del taller como Por comprar',
                        de: 'Als Wunschliste zum Atelier-Katalog hinzufügen',
                      })}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                      <span>
                        {tr(language, {
                          ru: 'В список покупок',
                          en: 'To Wishlist',
                          it: 'Da acquistare',
                          es: 'A la lista',
                          de: 'Wunschliste',
                        })}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditForm(selectedItem)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#323130] hover:bg-[#F3F2F1]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>
                      {tr(language, {
                        ru: 'Изменить',
                        en: 'Edit',
                        it: 'Modifica',
                        es: 'Editar',
                        de: 'Bearbeiten',
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteLibraryItem(selectedItem.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2]"
                    aria-label={`${tr(language, {
                      ru: 'Удалить',
                      en: 'Delete',
                      it: 'Elimina',
                      es: 'Eliminar',
                      de: 'Löschen',
                    })} ${selectedItem.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Dual Personal Ratings (Live Editable) */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#EDEBE9] bg-[#FAF9F8] p-4">
                <RatingScaleInput
                  label={tr(language, {
                    ru: 'Моя оценка: как пахнет',
                    en: 'My rating: How it smells',
                    it: 'La mia valutazione: odore',
                    es: 'Mi valoración: cómo huele',
                    de: 'Meine Bewertung: Dufteindruck',
                  })}
                  value={selectedItem.scentRating}
                  onChange={(val) =>
                    onUpdateLibraryItem({
                      ...selectedItem,
                      scentRating: val,
                      updatedAt: todayIsoDate(),
                    })
                  }
                  accentClass="bg-[#D97706]"
                  icon={<Sparkles className="h-3.5 w-3.5 text-[#D97706]" />}
                />
                <RatingScaleInput
                  label={tr(language, {
                    ru: 'Моя оценка: для будущих идей',
                    en: 'My rating: For future ideas & formulas',
                    it: 'La mia valutazione: per idee future',
                    es: 'Mi valoración: para ideas futuras',
                    de: 'Meine Bewertung: für künftige Ideen',
                  })}
                  value={selectedItem.futureIdeasRating}
                  onChange={(val) =>
                    onUpdateLibraryItem({
                      ...selectedItem,
                      futureIdeasRating: val,
                      updatedAt: todayIsoDate(),
                    })
                  }
                  accentClass="bg-[var(--theme-accent)]"
                  icon={<Lightbulb className="h-3.5 w-3.5 text-[var(--theme-accent)]" />}
                />
              </div>

              {/* Scent Description & Properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-4 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                    {tr(language, {
                      ru: 'Чем пахнет',
                      en: 'What It Smells Like',
                      it: 'Che Odore Ha',
                      es: 'A Qué Huele',
                      de: 'Duftbeschreibung',
                    })}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#181917]">
                    {selectedItem.scentDescription || (
                      <span className="text-[#8A8886]">
                        {tr(language, {
                          ru: 'Описание запаха не заполнено. Нажмите «Изменить».',
                          en: 'No scent description yet. Click Edit to add.',
                          it: 'Descrizione olfattiva mancante. Premi Modifica per aggiungerla.',
                          es: 'Sin descripción olfativa aún. Pulsa Editar para añadirla.',
                          de: 'Noch keine Duftbeschreibung. Zum Ergänzen auf Bearbeiten klicken.',
                        })}
                      </span>
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-4 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#605E5C]">
                    {tr(language, {
                      ru: 'Свойства и поведение',
                      en: 'Properties & Behavior',
                      it: 'Proprietà e Comportamento',
                      es: 'Propiedades y Comportamiento',
                      de: 'Eigenschaften & Verhalten',
                    })}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#181917]">
                    {selectedItem.properties || (
                      <span className="text-[#8A8886]">
                        {tr(language, {
                          ru: 'Свойства не заполнены. Нажмите «Изменить».',
                          en: 'No properties recorded yet. Click Edit to add.',
                          it: 'Nessuna proprietà registrata. Premi Modifica.',
                          es: 'Sin propiedades registradas. Pulsa Editar.',
                          de: 'Noch keine Eigenschaften hinterlegt. Auf Bearbeiten klicken.',
                        })}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Personal Notes Section */}
              <div className="border-t border-[#EDEBE9] pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NotebookPen className="h-4 w-4 text-[var(--theme-accent)]" />
                    <h3 className="text-base font-semibold text-[#181917]">
                      {tr(language, {
                        ru: 'Мои заметки по ингредиенту',
                        en: 'My Notes & Observations',
                        it: 'Le Mie Note sull’Ingrediente',
                        es: 'Mis Notas y Observaciones',
                        de: 'Meine Notizen zum Rohstoff',
                      })}
                    </h3>
                    <span className="font-mono text-xs tabular-nums text-[#605E5C]">
                      ({selectedItem.notes.length})
                    </span>
                  </div>
                </div>

                {/* Add Note Form */}
                <form
                  onSubmit={handleAddNote}
                  className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      value={newNoteDate}
                      onChange={(e) => setNewNoteDate(e.target.value)}
                      className="rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none sm:w-36 shrink-0"
                    />
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder={tr(language, {
                        ru: 'Запишите заметку, идею сочетания, результат теста разведения...',
                        en: 'Write a personal note, pairing idea, dilution test...',
                        it: 'Scrivi una nota personale, un’idea di accordo, un test di diluizione...',
                        es: 'Escribe una nota personal, idea de acorde, prueba de dilución...',
                        de: 'Persönliche Notiz, Akkord-Idee oder Verdünnungstest festhalten...',
                      })}
                      className="flex-1 rounded-lg border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--theme-accent)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] disabled:opacity-40 shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {tr(language, {
                          ru: 'Добавить',
                          en: 'Add Note',
                          it: 'Aggiungi',
                          es: 'Añadir',
                          de: 'Hinzufügen',
                        })}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                {selectedItem.notes.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#797775]">
                    {tr(language, {
                      ru: 'Заметок пока нет. Добавьте первую запись выше.',
                      en: 'No personal notes yet. Add your first observation above.',
                      it: 'Nessuna nota ancora. Aggiungi la prima osservazione sopra.',
                      es: 'Aún no hay notas personales. Añade tu primera observación arriba.',
                      de: 'Noch keine Notizen vorhanden. Fügen Sie oben die erste hinzu.',
                    })}
                  </p>
                ) : (
                  <div className="divide-y divide-[#EDEBE9]">
                    {selectedItem.notes.map((note) => {
                      const isEditing = editingNoteId === note.id;
                      return (
                        <div key={note.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] tabular-nums text-[#605E5C]">
                              {note.date}
                            </span>
                            <div className="flex items-center gap-1">
                              {!isEditing && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteId(note.id);
                                    setEditingNoteText(note.text);
                                  }}
                                  className="rounded p-1 text-[#797775] hover:bg-[#F3F2F1] hover:text-[#181917]"
                                  aria-label={tr(language, {
                                    ru: 'Редактировать заметку',
                                    en: 'Edit note',
                                    it: 'Modifica nota',
                                    es: 'Editar nota',
                                    de: 'Notiz bearbeiten',
                                  })}
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="rounded p-1 text-[#797775] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                                aria-label={tr(language, {
                                  ru: 'Удалить заметку',
                                  en: 'Delete note',
                                  it: 'Elimina nota',
                                  es: 'Eliminar nota',
                                  de: 'Notiz löschen',
                                })}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                className="flex-1 rounded-lg border border-[var(--theme-accent)] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditedNote(note.id)}
                                className="rounded-lg bg-[var(--theme-accent)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                              >
                                {tr(language, {
                                  ru: 'Сохранить',
                                  en: 'Save',
                                  it: 'Salva',
                                  es: 'Guardar',
                                  de: 'Speichern',
                                })}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="rounded-lg border border-[#D2D0CE] px-2.5 py-1.5 text-xs text-[#605E5C] hover:bg-[#F3F2F1]"
                              >
                                {tr(language, {
                                  ru: 'Отмена',
                                  en: 'Cancel',
                                  it: 'Annulla',
                                  es: 'Cancelar',
                                  de: 'Abbrechen',
                                })}
                              </button>
                            </div>
                          ) : (
                            <p className="whitespace-pre-line text-sm leading-relaxed text-[#323130]">
                              {note.text}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D2D0CE] bg-white p-10 text-center space-y-3">
              <BookOpen className="h-8 w-8 mx-auto text-[#8A8886]" />
              <div className="text-sm font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Выберите или добавьте ингредиент',
                  en: 'Select or add an ingredient',
                  it: 'Seleziona o aggiungi un ingrediente',
                  es: 'Selecciona o añade un ingrediente',
                  de: 'Rohstoff auswählen oder hinzufügen',
                })}
              </div>
              <p className="text-xs text-[#605E5C] max-w-md mx-auto">
                {tr(language, {
                  ru: 'Нажмите на любой ингредиент слева, чтобы открыть свойства, описание аромата, оценки и заметки.',
                  en: 'Click any material on the left to inspect its properties, scent profile, ratings, and personal notes.',
                  it: 'Fai clic su un materiale a sinistra per vederne proprietà, profilo olfattivo, valutazioni e note.',
                  es: 'Haz clic en cualquier material a la izquierda para ver sus propiedades, perfil, valoraciones y notas.',
                  de: 'Wählen Sie links einen Rohstoff aus, um Eigenschaften, Duftprofil, Bewertungen und Notizen anzuzeigen.',
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
