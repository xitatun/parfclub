import {
  Activity,
  BookOpen,
  Check,
  Clock,
  Flame,
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
  FAMILY_HEX_MAP,
  getIngredientOriginLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  INGREDIENT_ORIGIN_LABELS,
  NOTE_TIER_LABELS,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import {
  FRATERWORKS_REFERENCE_MATERIALS,
  getLocalizedFacetName,
  getLocalizedVolatilityLabel,
  getMaterialScentPassport,
} from '../data/fraterworksProfiles';
import { tr } from '../data/i18n';
import { resolveIfraStandard } from '../data/ifraStandards';
import type {
  AppLanguage,
  Ingredient,
  IngredientOrigin,
  LibraryIngredient,
  LibraryNote,
  NoteTier,
  OlfactoryFamilyKey,
  PerfumeProject,
  ScentFacetBreakdown,
} from '../types/perfume';
import { generateId, todayIsoDate } from '../utils/storage';

interface IngredientLibraryProps {
  library: LibraryIngredient[];
  studioIngredients: Ingredient[];
  projects?: PerfumeProject[];
  selectedProjectId?: string | null;
  language: AppLanguage;
  onAddLibraryItem: (item: LibraryIngredient) => void;
  onUpdateLibraryItem: (item: LibraryIngredient) => void;
  onDeleteLibraryItem: (id: string) => void;
  onAddToStudioWishlist: (item: LibraryIngredient) => void;
  onAddToProjectFormula?: (
    item: LibraryIngredient,
    projectId: string,
    weightGrams: number
  ) => void;
}

type LibrarySortBy =
  | 'updated'
  | 'scent_desc'
  | 'ideas_desc'
  | 'impact_desc'
  | 'substantivity_desc'
  | 'name_asc';
type LibraryRatingFilter = 'all' | 'scent_8' | 'ideas_8';
type LibraryImpactFilter =
  | 'all'
  | 'high_impact'
  | 'ultra_booster'
  | 'blender'
  | 'fixative';

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
  projects = [],
  selectedProjectId = null,
  language,
  onAddLibraryItem,
  onUpdateLibraryItem,
  onDeleteLibraryItem,
  onAddToStudioWishlist,
  onAddToProjectFormula,
}: IngredientLibraryProps) {
  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | NoteTier>('all');
  const [familyFilter, setFamilyFilter] = useState<'all' | OlfactoryFamilyKey>('all');
  const [originFilter, setOriginFilter] = useState<'all' | IngredientOrigin>('all');
  const [ratingFilter, setRatingFilter] = useState<LibraryRatingFilter>('all');
  const [impactFilter, setImpactFilter] = useState<LibraryImpactFilter>('all');
  const [sortBy, setSortBy] = useState<LibrarySortBy>('updated');
  const [visibleCount, setVisibleCount] = useState<number>(40);

  // Selection & editor state
  const [selectedId, setSelectedId] = useState<string | null>(library[0]?.id || null);
  const [formMode, setFormMode] = useState<'closed' | 'create' | 'edit'>('closed');

  // Formula quick-add state inside Library Inspector
  const [targetProjectId, setTargetProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );
  const [addWeight, setAddWeight] = useState('0.50');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCas, setFormCas] = useState('');
  const [formFamily, setFormFamily] = useState<OlfactoryFamilyKey>('citrus');
  const [formTier, setFormTier] = useState<NoteTier>('heart');
  const [formOrigin, setFormOrigin] = useState<IngredientOrigin>('natural');
  const [formBlotterLongevity, setFormBlotterLongevity] = useState('');
  const [formOdorImpact, setFormOdorImpact] = useState('100');
  const [formSubstantivityHours, setFormSubstantivityHours] = useState('48');
  const [formAverageUse, setFormAverageUse] = useState('1% – 15%');
  const [formFacets, setFormFacets] = useState<ScentFacetBreakdown[]>([
    { facet: 'Primary Accord', family: 'citrus', percent: 75 },
    { facet: 'Secondary Nuance', family: 'green', percent: 25 },
  ]);
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
    if (selectedProjectId) {
      setTargetProjectId(selectedProjectId);
    } else if (!targetProjectId && projects[0]?.id) {
      setTargetProjectId(projects[0].id);
    }
  }, [selectedProjectId, projects, targetProjectId]);

  useEffect(() => {
    setVisibleCount(40);
  }, [
    searchQuery,
    tierFilter,
    familyFilter,
    originFilter,
    ratingFilter,
    impactFilter,
    sortBy,
  ]);

  // Pre-compute Fraterworks passports for all library items
  const passportById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getMaterialScentPassport>>();
    for (const item of library) {
      map.set(item.id, getMaterialScentPassport(item));
    }
    return map;
  }, [library]);

  const filteredLibrary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = library.filter((item) => {
      if (tierFilter !== 'all' && item.tier !== tierFilter) return false;
      if (familyFilter !== 'all' && item.family !== familyFilter) return false;
      if (originFilter !== 'all' && item.origin !== originFilter) return false;
      if (ratingFilter === 'scent_8' && item.scentRating < 8) return false;
      if (ratingFilter === 'ideas_8' && item.futureIdeasRating < 8) return false;

      const passport = passportById.get(item.id) || getMaterialScentPassport(item);
      if (impactFilter === 'high_impact' && passport.odorImpact < 200) return false;
      if (impactFilter === 'ultra_booster' && passport.odorImpact < 450) return false;
      if (impactFilter === 'blender' && passport.odorImpact > 85) return false;
      if (impactFilter === 'fixative' && passport.substantivityHours < 168) return false;

      if (q) {
        const hay = [
          item.name,
          item.inciOrCas || '',
          item.blotterLongevity || '',
          item.properties,
          item.scentDescription,
          ...passport.synonyms,
          ...passport.scentBreakdown.map((f) => f.facet),
          ...item.notes.map((n) => n.text),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'scent_desc')
        return b.scentRating - a.scentRating || a.name.localeCompare(b.name);
      if (sortBy === 'ideas_desc')
        return b.futureIdeasRating - a.futureIdeasRating || a.name.localeCompare(b.name);
      if (sortBy === 'impact_desc') {
        const pA = passportById.get(a.id)?.odorImpact || 100;
        const pB = passportById.get(b.id)?.odorImpact || 100;
        return pB - pA || a.name.localeCompare(b.name);
      }
      if (sortBy === 'substantivity_desc') {
        const sA = passportById.get(a.id)?.substantivityHours || 12;
        const sB = passportById.get(b.id)?.substantivityHours || 12;
        return sB - sA || a.name.localeCompare(b.name);
      }
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [
    library,
    passportById,
    searchQuery,
    tierFilter,
    familyFilter,
    originFilter,
    ratingFilter,
    impactFilter,
    sortBy,
  ]);

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

  const selectedPassport = useMemo(
    () =>
      selectedItem
        ? passportById.get(selectedItem.id) || getMaterialScentPassport(selectedItem)
        : null,
    [selectedItem, passportById]
  );

  const stats = useMemo(() => {
    const count = library.length;
    const avgScent =
      count > 0 ? library.reduce((s, i) => s + i.scentRating, 0) / count : 0;
    const highIdeasCount = library.filter((i) => i.futureIdeasRating >= 8).length;
    const highImpactCount = library.filter(
      (i) => (passportById.get(i.id)?.odorImpact || 100) >= 200
    ).length;
    return { count, avgScent, highIdeasCount, highImpactCount };
  }, [library, passportById]);

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
    setFormOdorImpact('100');
    setFormSubstantivityHours('48');
    setFormAverageUse('1% – 15%');
    setFormFacets([
      { facet: 'Primary Citrus / Floral', family: 'citrus', percent: 75 },
      { facet: 'Secondary Nuance', family: 'green', percent: 25 },
    ]);
    setFormProperties('');
    setFormScentDesc('');
    setFormScentRating(8);
    setFormIdeasRating(8);
    setFormInitialNote('');
  };

  const openEditForm = (item: LibraryIngredient) => {
    const p = passportById.get(item.id) || getMaterialScentPassport(item);
    setFormMode('edit');
    setFormName(item.name);
    setFormCas(item.inciOrCas || p.inciOrCas || '');
    setFormFamily(item.family);
    setFormTier(item.tier);
    setFormOrigin(item.origin);
    setFormBlotterLongevity(item.blotterLongevity || `${p.substantivityHours} ч`);
    setFormOdorImpact(String(p.odorImpact));
    setFormSubstantivityHours(String(p.substantivityHours));
    setFormAverageUse(p.averageUsePercent);
    setFormFacets(
      p.scentBreakdown.map((f) => ({
        facet: f.facet,
        family: f.family,
        percent: f.percent,
      }))
    );
    setFormProperties(item.properties);
    setFormScentDesc(item.scentDescription);
    setFormScentRating(item.scentRating);
    setFormIdeasRating(item.futureIdeasRating);
    setFormInitialNote('');
  };

  const handlePrefillFromStudio = (ingId: string) => {
    const ing = studioIngredients.find((i) => i.id === ingId);
    if (!ing) return;
    const p = getMaterialScentPassport(ing);
    setFormName(ing.name);
    setFormCas(ing.inciOrCas || '');
    setFormFamily(ing.family);
    setFormTier(ing.tier);
    setFormOrigin(ing.origin);
    setFormBlotterLongevity(
      ing.longevityLabel && ing.longevityLabel !== '—' ? ing.longevityLabel : `${p.substantivityHours} ч`
    );
    setFormOdorImpact(String(p.odorImpact));
    setFormSubstantivityHours(String(p.substantivityHours));
    setFormAverageUse(p.averageUsePercent);
    setFormFacets(p.scentBreakdown);
    const propsParts = [
      ing.ifraLimitPercent !== undefined ? `IFRA: ${ing.ifraLimitPercent}%` : '',
      ing.solventNote || '',
    ].filter(Boolean);
    setFormProperties(propsParts.join('. '));
    setFormScentDesc(ing.olfactoryNotes || '');
  };

  const handlePrefillFromFraterworks = (fwId: string) => {
    const fw = FRATERWORKS_REFERENCE_MATERIALS.find((f) => f.id === fwId);
    if (!fw) return;
    const ifraStd = resolveIfraStandard({
      name: fw.name,
      inciOrCas: fw.inciOrCas,
    });
    const ifraSummary = ifraStd
      ? ifraStd.category4LimitPercent !== undefined
        ? ` IFRA 51 Cat. 4: до ${ifraStd.category4LimitPercent}%.`
        : ifraStd.status === 'exempt_fcf'
          ? ' IFRA 51 Cat. 4: FCF (не ограничен).'
          : ' IFRA 51 Cat. 4: не ограничен.'
      : fw.ifraLimitPercent !== undefined
        ? ` IFRA 51 Cat. 4: до ${fw.ifraLimitPercent}%.`
        : '';
    setFormName(fw.name);
    setFormCas(fw.inciOrCas || '');
    setFormFamily(fw.family);
    setFormTier(fw.tier);
    setFormOrigin(fw.origin);
    setFormBlotterLongevity(`${fw.substantivityHours} ч`);
    setFormOdorImpact(String(fw.odorImpact));
    setFormSubstantivityHours(String(fw.substantivityHours));
    setFormAverageUse(fw.averageUsePercent);
    setFormFacets(fw.scentBreakdown.map((b) => ({ ...b })));
    setFormProperties(`Летучесть: ${fw.volatilityLabel}.${ifraSummary}`);
    setFormScentDesc(fw.scentDescription);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const today = todayIsoDate();
    const cleanFacets = formFacets
      .filter((f) => f.facet.trim().length > 0 && f.percent > 0)
      .map((f) => ({
        facet: f.facet.trim(),
        family: f.family,
        percent: Math.max(1, Math.min(100, Math.round(Number(f.percent) || 10))),
      }));

    if (formMode === 'edit' && selectedItem) {
      const updated: LibraryIngredient = {
        ...selectedItem,
        name: formName.trim(),
        inciOrCas: formCas.trim() || undefined,
        family: formFamily,
        tier: formTier,
        origin: formOrigin,
        blotterLongevity: formBlotterLongevity.trim() || undefined,
        odorImpact: Math.max(10, Math.min(1000, Math.round(Number(formOdorImpact) || 100))),
        substantivityHours: Math.max(
          1,
          Math.min(400, Math.round(Number(formSubstantivityHours) || 24))
        ),
        averageUsePercent: formAverageUse.trim() || undefined,
        scentBreakdown: cleanFacets.length > 0 ? cleanFacets : undefined,
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
      odorImpact: Math.max(10, Math.min(1000, Math.round(Number(formOdorImpact) || 100))),
      substantivityHours: Math.max(
        1,
        Math.min(400, Math.round(Number(formSubstantivityHours) || 24))
      ),
      averageUsePercent: formAverageUse.trim() || undefined,
      scentBreakdown: cleanFacets.length > 0 ? cleanFacets : undefined,
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

  const gUnit = language === 'ru' ? 'г' : 'g';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DFDD] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181917]">
            {tr(language, {
              ru: 'Библиотека ингредиентов и паспорта Fraterworks',
              en: 'Ingredient Library & Fraterworks Scent Passports',
              it: 'Libreria Ingredienti e Passaporti Fraterworks',
              es: 'Biblioteca de Ingredientes y Pasaportes Fraterworks',
              de: 'Rohstoff-Bibliothek & Fraterworks-Passports',
            })}
          </h1>
          <p className="mt-1 text-sm text-[#605E5C] max-w-3xl">
            {tr(language, {
              ru: 'Энциклопедия парфюмерных веществ со шкалой Scent Breakdown (разбор граней аромата), относительной силой звучания (Odor Impact), летучестью и вашими личными заметками.',
              en: 'Comprehensive perfumery material reference with Fraterworks-style Scent Breakdown bars, Odor Impact strength, volatility hours, ratings, and personal lab notes.',
              it: 'Enciclopedia delle materie prime con barre Scent Breakdown in stile Fraterworks, Odor Impact, volatilità, valutazioni e note personali.',
              es: 'Enciclopedia de materiales con barras Scent Breakdown al estilo Fraterworks, fuerza (Odor Impact), volatilidad, valoraciones y notas.',
              de: 'Umfassendes Nachschlagewerk mit Fraterworks Scent Breakdown, Duftstärke (Odor Impact), Flüchtigkeit, Bewertungen und Labornotizen.',
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
              ru: 'Добавить вещество',
              en: 'Add Material',
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
              ru: 'Веществ в энциклопедии',
              en: 'Materials in Library',
              it: 'Materie in libreria',
              es: 'Materias en biblioteca',
              de: 'Rohstoffe in Bibliothek',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#181917]">
            {stats.count}
          </div>
        </div>
        <div className="rounded-xl border border-[#E1DFDD] bg-white p-4">
          <div className="text-xs text-[#605E5C]">
            {tr(language, {
              ru: 'Высокий импакт (Impact ≥ 200)',
              en: 'High Impact (≥ 200)',
              it: 'Alto Impatto (≥ 200)',
              es: 'Alto Impacto (≥ 200)',
              de: 'Hoher Impact (≥ 200)',
            })}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#D97706]">
            {stats.highImpactCount}
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
                      ru: 'Редактирование паспорта вещества',
                      en: 'Edit Material & Scent Passport',
                      it: 'Modifica Passaporto Ingrediente',
                      es: 'Editar Pasaporte del Material',
                      de: 'Rohstoff-Passport bearbeiten',
                    })
                  : tr(language, {
                      ru: 'Новое вещество в библиотеке',
                      en: 'New Library Material',
                      it: 'Nuovo Ingrediente in Libreria',
                      es: 'Nuevo Material en Biblioteca',
                      de: 'Neuer Bibliotheks-Rohstoff',
                    })}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) handlePrefillFromFraterworks(e.target.value);
                }}
                className="max-w-[230px] rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                <option value="">
                  {tr(language, {
                    ru: 'Заполнить из эталонов Fraterworks...',
                    en: 'Pre-fill from Fraterworks reference...',
                    it: 'Compila da riferimento Fraterworks...',
                    es: 'Rellenar desde referencia Fraterworks...',
                    de: 'Aus Fraterworks-Referenz füllen...',
                  })}
                </option>
                {FRATERWORKS_REFERENCE_MATERIALS.map((fw) => (
                  <option key={fw.id} value={fw.id}>
                    {fw.name} (Impact {fw.odorImpact})
                  </option>
                ))}
              </select>

              {formMode === 'create' && studioIngredients.length > 0 && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handlePrefillFromStudio(e.target.value);
                  }}
                  className="max-w-[220px] rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                >
                  <option value="">
                    {tr(language, {
                      ru: 'Подставить со склада...',
                      en: 'Pre-fill from studio stock...',
                      it: 'Precompila dallo studio...',
                      es: 'Rellenar desde el taller...',
                      de: 'Aus Bestand vorbefüllen...',
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
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Название вещества *',
                  en: 'Material Name *',
                  it: 'Nome Ingrediente *',
                  es: 'Nombre del Material *',
                  de: 'Rohstoffname *',
                })}
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Hedione HC, Javanol, Iso E Super..."
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-3 py-2 text-sm text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                CAS / INCI
              </label>
              <input
                type="text"
                value={formCas}
                onChange={(e) => setFormCas(e.target.value)}
                placeholder="24851-98-7"
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

          {/* Fraterworks Metrics Row: Origin, Odor Impact, Substantivity Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3">
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
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(Object.keys(INGREDIENT_ORIGIN_LABELS) as IngredientOrigin[]).map((o) => (
                  <option key={o} value={o}>
                    {getIngredientOriginLabel(o, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Сила (Odor Impact, 10–1000)',
                  en: 'Odor Impact (10–1000)',
                  it: 'Odor Impact (10–1000)',
                  es: 'Odor Impact (10–1000)',
                  de: 'Odor Impact (10–1000)',
                })}
              </label>
              <input
                type="number"
                min={10}
                max={1000}
                value={formOdorImpact}
                onChange={(e) => setFormOdorImpact(e.target.value)}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-[#605E5C] mb-1">
                {tr(language, {
                  ru: 'Субстантивность (часов, 1–400)',
                  en: 'Substantivity (hours, 1–400)',
                  it: 'Sostantività (ore, 1–400)',
                  es: 'Sustantividad (horas, 1–400)',
                  de: 'Substantivität (Std., 1–400)',
                })}
              </label>
              <input
                type="number"
                min={1}
                max={400}
                value={formSubstantivityHours}
                onChange={(e) => {
                  setFormSubstantivityHours(e.target.value);
                  setFormBlotterLongevity(`${e.target.value} ч`);
                }}
                className="w-full rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 font-mono text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Fraterworks Scent Breakdown Facets Editor */}
          <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#181917] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                {tr(language, {
                  ru: 'Fraterworks Scent Breakdown (Грани и фасеты аромата в %)',
                  en: 'Fraterworks Scent Breakdown (Olfactory Facets in %)',
                  it: 'Fraterworks Scent Breakdown (Sfaccettature in %)',
                  es: 'Fraterworks Scent Breakdown (Facetas en %)',
                  de: 'Fraterworks Scent Breakdown (Duftfacetten in %)',
                })}
              </label>
              {formFacets.length < 4 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormFacets([
                      ...formFacets,
                      { facet: 'Nuance', family: formFamily, percent: 15 },
                    ])
                  }
                  className="text-xs font-medium text-[var(--theme-accent)] hover:underline"
                >
                  + {tr(language, { ru: 'Добавить грань', en: 'Add facet', it: 'Aggiungi', es: 'Añadir', de: 'Facette' })}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {formFacets.map((fc, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={fc.facet}
                    onChange={(e) =>
                      setFormFacets(
                        formFacets.map((item, i) =>
                          i === idx ? { ...item, facet: e.target.value } : item
                        )
                      )
                    }
                    placeholder="Velvety Cedarwood, Sparkling Bergamot..."
                    className="col-span-6 rounded border border-[#D2D0CE] bg-white px-2.5 py-1 text-xs text-[#181917]"
                  />
                  <select
                    value={fc.family}
                    onChange={(e) =>
                      setFormFacets(
                        formFacets.map((item, i) =>
                          i === idx
                            ? { ...item, family: e.target.value as OlfactoryFamilyKey }
                            : item
                        )
                      )
                    }
                    className="col-span-3 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-xs text-[#181917]"
                  >
                    {OLFACTORY_FAMILIES.map((f) => (
                      <option key={f.key} value={f.key}>
                        {getOlfactoryFamilyLabel(f.key, language)}
                      </option>
                    ))}
                  </select>
                  <div className="col-span-2 flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={fc.percent}
                      onChange={(e) =>
                        setFormFacets(
                          formFacets.map((item, i) =>
                            i === idx ? { ...item, percent: Number(e.target.value) || 0 } : item
                          )
                        )
                      }
                      className="w-full rounded border border-[#D2D0CE] bg-white px-2 py-1 text-right font-mono text-xs text-[#181917]"
                    />
                    <span className="text-xs text-[#605E5C]">%</span>
                  </div>
                  <div className="col-span-1 text-right">
                    {formFacets.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormFacets(formFacets.filter((_, i) => i !== idx))
                        }
                        className="rounded p-1 text-[#797775] hover:text-[#B91C1C]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
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
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#797775]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tr(language, {
              ru: 'Поиск по названию, CAS, граням Scent Breakdown, запаху или заметкам...',
              en: 'Search name, CAS, Scent Breakdown facets, smell, or notes...',
              it: 'Cerca per nome, CAS, sfaccettature Scent Breakdown, odore o note...',
              es: 'Buscar por nombre, CAS, facetas Scent Breakdown, aroma o notas...',
              de: 'Suche nach Name, CAS, Scent-Breakdown-Facetten, Duft oder Notizen...',
            })}
            className="w-full rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] pl-8 pr-3 py-1.5 text-xs text-[#181917] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as 'all' | NoteTier)}
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
          value={impactFilter}
          onChange={(e) => setImpactFilter(e.target.value as LibraryImpactFilter)}
          className="rounded-lg border border-[#E1DFDD] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
        >
          <option value="all">
            {tr(language, {
              ru: 'Любая сила / стойкость',
              en: 'Any strength / volatility',
              it: 'Qualsiasi impatto / volatilità',
              es: 'Cualquier fuerza / volatilidad',
              de: 'Alle Stärken / Haltbarkeiten',
            })}
          </option>
          <option value="high_impact">
            {tr(language, {
              ru: 'Высокий импакт (Impact ≥ 200)',
              en: 'High Impact (≥ 200)',
              it: 'Alto Impatto (≥ 200)',
              es: 'Alto Impacto (≥ 200)',
              de: 'Hoher Impact (≥ 200)',
            })}
          </option>
          <option value="ultra_booster">
            {tr(language, {
              ru: 'Ультра-бустеры (Impact ≥ 450)',
              en: 'Ultra Boosters (≥ 450)',
              it: 'Ultra Booster (≥ 450)',
              es: 'Ultra Boosters (≥ 450)',
              de: 'Ultra-Booster (≥ 450)',
            })}
          </option>
          <option value="blender">
            {tr(language, {
              ru: 'Прозрачные блендеры (Impact ≤ 85)',
              en: 'Transparent Blenders (≤ 85)',
              it: 'Blender Trasparenti (≤ 85)',
              es: 'Mezcladores Transparentes (≤ 85)',
              de: 'Transparente Blender (≤ 85)',
            })}
          </option>
          <option value="fixative">
            {tr(language, {
              ru: 'Фиксаторы (≥ 168 ч на блоттере)',
              en: 'Fixatives (≥ 168h on blotter)',
              it: 'Fissativi (≥ 168h su mouillette)',
              es: 'Fijadores (≥ 168h en secante)',
              de: 'Fixateure (≥ 168 Std.)',
            })}
          </option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value as LibraryRatingFilter)}
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
          <option value="impact_desc">
            {tr(language, {
              ru: 'Сила звучания (Odor Impact ↓)',
              en: 'Odor Impact (High → Low)',
              it: 'Odor Impact (Alto → Basso)',
              es: 'Odor Impact (Mayor → Menor)',
              de: 'Duftstärke (Odor Impact ↓)',
            })}
          </option>
          <option value="substantivity_desc">
            {tr(language, {
              ru: 'Стойкость на блоттере (часы ↓)',
              en: 'Substantivity (Hours ↓)',
              it: 'Sostantività (Ore ↓)',
              es: 'Sustantividad (Horas ↓)',
              de: 'Haltbarkeit (Stunden ↓)',
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
                {tr(language, {
                  ru: 'Ничего не найдено по фильтрам',
                  en: 'No matching materials',
                  it: 'Nessun ingrediente trovato',
                  es: 'Sin materiales coincidentes',
                  de: 'Keine passenden Rohstoffe',
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
                  Fraterworks · IFF · Symrise · Givaudan
                </span>
              </div>
              {visibleLibrary.map((item) => {
                const active = selectedItem?.id === item.id;
                const passport = passportById.get(item.id) || getMaterialScentPassport(item);

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
                          {(item.inciOrCas || passport.inciOrCas) && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">
                                {item.inciOrCas || passport.inciOrCas}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="rounded bg-[#FAF9F8] border border-[#E1DFDD] px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[#181917] shrink-0">
                        {tr(language, { ru: 'Импакт', en: 'Impact', it: 'Impatto', es: 'Impacto', de: 'Impact' })} {passport.odorImpact}
                      </span>
                    </div>

                    {/* Fraterworks Scent Breakdown Mini Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                        {passport.scentBreakdown.map((facet, fIdx) => (
                          <div
                            key={`${item.id}-f-${fIdx}`}
                            style={{
                              width: `${facet.percent}%`,
                              backgroundColor: FAMILY_HEX_MAP[facet.family],
                            }}
                            title={`${getLocalizedFacetName(facet.facet, language)}: ${facet.percent}%`}
                            className="h-full"
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[#575955] truncate">
                        {passport.scentBreakdown.slice(0, 3).map((b, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: FAMILY_HEX_MAP[b.family] }}
                            />
                            <span>
                              {getLocalizedFacetName(b.facet, language)} <strong>{b.percent}%</strong>
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {item.scentDescription && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#575955]">
                        {item.scentDescription}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#EDEBE9] pt-2.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                        <span className="font-mono font-semibold tabular-nums text-[#181917]">
                          {item.scentRating}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                        <span className="font-mono font-semibold tabular-nums text-[#181917]">
                          {item.futureIdeasRating}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#575955] ml-auto">
                        <Clock className="h-3 w-3 text-[#797775] shrink-0" />
                        <span className="font-mono text-[11px] tabular-nums">
                          ~{passport.substantivityHours}{tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })} · {getLocalizedVolatilityLabel(passport.volatilityLabel, language).split(' ')[0]}
                        </span>
                      </div>
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

        {/* Right Detail & Fraterworks Passport Inspector */}
        <div className="lg:col-span-7 lg:sticky lg:top-4 lg:self-start">
          {selectedItem && selectedPassport ? (
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
                    {(selectedItem.inciOrCas || selectedPassport.inciOrCas) && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">
                          CAS {selectedItem.inciOrCas || selectedPassport.inciOrCas}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-[#181917]">
                    {selectedItem.name}
                  </h2>
                  {selectedPassport.synonyms.length > 0 && (
                    <p className="mt-0.5 text-xs text-[#797775]">
                      {selectedPassport.synonyms.join(' · ')}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {!studioNamesLower.has(selectedItem.name.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => onAddToStudioWishlist(selectedItem)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D2D0CE] bg-[#FAF9F8] px-2.5 py-1.5 text-xs font-medium text-[#181917] hover:bg-white"
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
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* FRATERWORKS SCENT PASSPORT: Scent Breakdown + Odor Impact + Volatility */}
              <div className="rounded-xl border border-[#E1DFDD] bg-[#FAF9F8] p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#181917] flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-[var(--theme-accent)]" />
                    <span>
                      {tr(language, {
                        ru: 'Fraterworks Scent Passport: Разбор профиля, Сила и Летучесть',
                        en: 'Fraterworks Scent Passport: Breakdown, Strength & Volatility',
                        it: 'Passaporto Olfattivo Fraterworks: Profilo, Forza e Volatilità',
                        es: 'Pasaporte Olfativo Fraterworks: Desglose, Fuerza y Volatilidad',
                        de: 'Fraterworks Scent Passport: Profil, Duftstärke & Flüchtigkeit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Multi-Facet Scent Breakdown Bar & Legend */}
                <div className="rounded-lg border border-[#E1DFDD] bg-white p-3.5 space-y-2.5">
                  <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-[#EAEAE6]">
                    {selectedPassport.scentBreakdown.map((facet, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `${facet.percent}%`,
                          backgroundColor: FAMILY_HEX_MAP[facet.family],
                        }}
                        title={`${getLocalizedFacetName(facet.facet, language)}: ${facet.percent}%`}
                        className="h-full first:rounded-l-md last:rounded-r-md transition-all"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {selectedPassport.scentBreakdown.map((facet, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border border-[#EDEBE9] bg-[#FAF9F8] px-2.5 py-1.5 text-xs"
                      >
                        <span className="inline-flex items-center gap-2 truncate text-[#181917]">
                          <span
                            className="h-2.5 w-2.5 rounded-xs shrink-0"
                            style={{ backgroundColor: FAMILY_HEX_MAP[facet.family] }}
                          />
                          <span className="truncate font-medium">{getLocalizedFacetName(facet.facet, language)}</span>
                        </span>
                        <span className="font-mono font-bold tabular-nums text-[#181917] ml-2">
                          {facet.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Odor Impact & Volatility / Substantivity Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#E1DFDD] bg-white p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#323130]">
                        <Flame className="h-3.5 w-3.5 text-[#D97706]" />
                        {tr(language, {
                          ru: 'Сила запаха (Odor Impact)',
                          en: 'Scent Strength (Odor Impact)',
                          it: 'Forza Odore (Odor Impact)',
                          es: 'Fuerza (Odor Impact)',
                          de: 'Duftstärke (Odor Impact)',
                        })}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#181917]">
                        {selectedPassport.odorImpact}
                        <span className="text-[11px] font-normal text-[#797775]">/1000</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(8, (selectedPassport.odorImpact / 600) * 100))}%`,
                        }}
                        className="h-full bg-[#D97706]"
                      />
                    </div>
                    <p className="text-[11px] text-[#605E5C]">
                      {selectedPassport.odorImpact >= 450
                        ? tr(language, {
                            ru: 'Ультра-мощный бустер (доминирует даже в следовых дозах)',
                            en: 'Ultra-potent booster (dominates even in trace amounts)',
                            it: 'Booster ultra-potente (domina anche in tracce)',
                            es: 'Booster ultra-potente (domina incluso en trazas)',
                            de: 'Ultra-starker Booster (dominiert schon in Spuren)',
                          })
                        : selectedPassport.odorImpact >= 180
                          ? tr(language, {
                              ru: 'Высокая ударная сила (выше средней по массе)',
                              en: 'High odor impact (stronger than its weight %)',
                              it: 'Alto impatto olfattivo',
                              es: 'Alto impacto olfativo',
                              de: 'Hohe Duftstärke',
                            })
                          : selectedPassport.odorImpact <= 80
                            ? tr(language, {
                                ru: 'Прозрачный / мягкий блендер (можно вводить большими дозами)',
                                en: 'Transparent / soft blender (suitable for high dosages)',
                                it: 'Blender trasparente e morbido',
                                es: 'Mezclador suave y transparente',
                                de: 'Transparenter, weicher Blender',
                              })
                            : tr(language, {
                                ru: 'Стандартная интенсивность (100 = уровень бергамота)',
                                en: 'Standard aromatic strength (100 = Bergamot baseline)',
                                it: 'Intensità standard (100 = Bergamotto)',
                                es: 'Intensidad estándar (100 = Bergamota)',
                                de: 'Standard-Intensität (100 = Bergamotte)',
                              })}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#E1DFDD] bg-white p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#323130]">
                        <Clock className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                        {tr(language, {
                          ru: 'Летучесть / Субстантивность',
                          en: 'Volatility & Substantivity',
                          it: 'Volatilità e Sostantività',
                          es: 'Volatilidad y Sustantividad',
                          de: 'Flüchtigkeit & Substantivität',
                        })}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#181917]">
                        ~{selectedPassport.substantivityHours}{' '}
                        {tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std.' })}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAEAE6]">
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(8, (selectedPassport.substantivityHours / 400) * 100))}%`,
                        }}
                        className="h-full bg-[var(--theme-accent)]"
                      />
                    </div>
                    <p className="text-[11px] text-[#605E5C]">
                      {getLocalizedVolatilityLabel(selectedPassport.volatilityLabel, language)}
                      {selectedItem.blotterLongevity
                        ? ` · ${selectedItem.blotterLongevity}`
                        : ''}
                    </p>
                  </div>
                </div>

                {/* Quick Add to Project Formula directly from Library */}
                {projects.length > 0 && onAddToProjectFormula && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E1DFDD]">
                    <span className="text-xs font-medium text-[#323130]">
                      {tr(language, {
                        ru: 'В формулу проекта:',
                        en: 'Add to formula:',
                        it: 'Alla formula:',
                        es: 'A la fórmula:',
                        de: 'Zur Formel:',
                      })}
                    </span>
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      className="min-w-[160px] flex-1 rounded-lg border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
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
                      className="w-20 rounded-lg border border-[#D2D0CE] bg-white px-2 py-1.5 text-right font-mono text-xs tabular-nums text-[#181917]"
                    />
                    <span className="text-xs text-[#605E5C]">{gUnit}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const pid = targetProjectId || projects[0]?.id;
                        if (!pid) return;
                        onAddToProjectFormula(
                          selectedItem,
                          pid,
                          Math.max(0.01, Number(addWeight) || 0.5)
                        );
                        setAddedFeedback(true);
                        window.setTimeout(() => setAddedFeedback(false), 1600);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                    >
                      {addedFeedback ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {addedFeedback
                          ? tr(language, {
                              ru: 'Добавлено!',
                              en: 'Added!',
                              it: 'Aggiunto!',
                              es: '¡Añadido!',
                              de: 'Hinzugefügt!',
                            })
                          : tr(language, {
                              ru: 'Добавить в формулу',
                              en: 'Add to Formula',
                              it: 'Aggiungi',
                              es: 'Añadir',
                              de: 'Hinzufügen',
                            })}
                      </span>
                    </button>
                  </div>
                )}
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
                    {selectedItem.scentDescription || selectedPassport.scentDescription || (
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
                  {(() => {
                    const ifraStd = resolveIfraStandard({
                      name: selectedItem.name,
                      inciOrCas: selectedItem.inciOrCas || selectedPassport.inciOrCas,
                    });
                    const limitVal = ifraStd
                      ? ifraStd.category4LimitPercent
                      : selectedItem.ifraLimitPercent ?? selectedPassport.ifraLimitPercent;
                    if (!ifraStd && limitVal === undefined) return null;
                    const isBanned =
                      ifraStd?.status === 'prohibited' ||
                      ifraStd?.status === 'eu_banned' ||
                      limitVal === 0;
                    const isExempt =
                      ifraStd?.status === 'exempt_fcf' || ifraStd?.status === 'unrestricted';
                    return (
                      <div
                        className={`mt-2.5 rounded-md border px-3 py-2 text-xs leading-relaxed ${
                          isBanned
                            ? 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]'
                            : isExempt
                              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                              : 'border-[#E1DFDD] bg-white text-[#323130]'
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between gap-2">
                          <span>IFRA 51 (Cat. 4)</span>
                          <span className="font-mono tabular-nums">
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
                                    ru: 'FCF — без лимита 0.4%',
                                    en: 'FCF — exempt',
                                    it: 'FCF — esente',
                                    es: 'FCF — exento',
                                    de: 'FCF — befreit',
                                  })
                                : ifraStd?.status === 'unrestricted'
                                  ? tr(language, {
                                      ru: 'Не ограничен',
                                      en: 'Unrestricted',
                                      it: 'Non limitato',
                                      es: 'Sin límite',
                                      de: 'Nicht beschränkt',
                                    })
                                  : limitVal !== undefined
                                    ? `≤ ${limitVal}%`
                                    : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
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
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="rounded p-1 text-[#797775] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
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
                  ru: 'Выберите или добавьте вещество',
                  en: 'Select or add a material',
                  it: 'Seleziona o aggiungi un ingrediente',
                  es: 'Selecciona o añade un ingrediente',
                  de: 'Rohstoff auswählen oder hinzufügen',
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
