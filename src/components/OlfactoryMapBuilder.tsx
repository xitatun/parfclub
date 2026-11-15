import { Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  EMPTY_PROFILE,
  getOlfactoryFamilyLabel,
  getSillageLabel,
  OLFACTORY_FAMILIES,
} from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppLanguage,
  Ingredient,
  LibraryIngredient,
  OlfactoryFamilyKey,
  OlfactoryMapData,
  OlfactoryMapNote,
  PerfumeProject,
  SillageLevel,
} from '../types/perfume';
import { deriveOlfactoryProfileFromFormula } from '../utils/calculations';
import { generateId } from '../utils/storage';
import { OlfactoryRadarChart } from './OlfactoryRadarChart';

interface OlfactoryMapBuilderProps {
  project: PerfumeProject;
  allProjects: PerfumeProject[];
  onSwitchProject: (projectId: string) => void;
  ingredients: Ingredient[];
  library?: LibraryIngredient[];
  onUpdateMap: (nextMap: OlfactoryMapData) => void;
  language?: AppLanguage;
}

type PyramidSectionKey = 'topNotes' | 'heartNotes' | 'baseNotes';

const SECTION_META: {
  key: PyramidSectionKey;
  titles: Record<AppLanguage, string>;
  subtitles: Record<AppLanguage, string>;
  tierMatch: 'top' | 'heart' | 'base';
}[] = [
  {
    key: 'topNotes',
    titles: {
      ru: 'Верхние ноты (Старт)',
      en: 'Top Notes (Opening)',
      it: 'Note di Testa (Apertura)',
      es: 'Notas de Salida (Inicio)',
      de: 'Kopfnoten (Auftakt)',
    },
    subtitles: {
      ru: 'Первые 5–30 минут звучания, летучие акценты',
      en: 'First 5–30 minutes, volatile sparkling accents',
      it: 'Primi 5–30 minuti, accenti freschi e volatili',
      es: 'Primeros 5–30 minutos, acentos volátiles y brillantes',
      de: 'Erste 5–30 Minuten, flüchtige spritzige Akzente',
    },
    tierMatch: 'top',
  },
  {
    key: 'heartNotes',
    titles: {
      ru: 'Ноты сердца (Ядро)',
      en: 'Heart Notes (Core)',
      it: 'Note di Cuore (Nucleo)',
      es: 'Notas de Corazón (Núcleo)',
      de: 'Herznoten (Kern)',
    },
    subtitles: {
      ru: 'Основной характер композиции, 1–5 часов',
      en: 'Main character of the fragrance, 1–5 hours',
      it: 'Carattere principale della fragranza, 1–5 ore',
      es: 'Carácter principal de la fragancia, 1–5 horas',
      de: 'Hauptcharakter des Duftes, 1–5 Stunden',
    },
    tierMatch: 'heart',
  },
  {
    key: 'baseNotes',
    titles: {
      ru: 'Базовые ноты (Шлейф)',
      en: 'Base Notes (Drydown)',
      it: 'Note di Fondo (Scia)',
      es: 'Notas de Fondo (Estela)',
      de: 'Basisnoten (Fond)',
    },
    subtitles: {
      ru: 'Фиксация, глубина и остаточный след, 6–24 часа',
      en: 'Fixation, depth, and lasting trail, 6–24 hours',
      it: 'Fissazione, profondità e scia persistente, 6–24 ore',
      es: 'Fijación, profundidad y estela duradera, 6–24 horas',
      de: 'Fixierung, Tiefe und Nachhall, 6–24 Stunden',
    },
    tierMatch: 'base',
  },
];

function normalizeNotesList(raw: unknown): OlfactoryMapNote[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === 'string') {
      return { id: generateId('on'), name: item, percentage: 100, description: '' };
    }
    const obj = item as Partial<OlfactoryMapNote>;
    return {
      id: obj.id || generateId('on'),
      name: obj.name || '',
      ingredientId: obj.ingredientId,
      percentage: typeof obj.percentage === 'number' ? obj.percentage : 0,
      description: obj.description || '',
    };
  });
}

export function OlfactoryMapBuilder({
  project,
  allProjects,
  onSwitchProject,
  ingredients,
  library = [],
  onUpdateMap,
  language = 'ru',
}: OlfactoryMapBuilderProps) {
  const map: OlfactoryMapData = useMemo(() => {
    const raw = project.olfactoryMap;
    return {
      topNotes: normalizeNotesList(raw?.topNotes),
      heartNotes: normalizeNotesList(raw?.heartNotes),
      baseNotes: normalizeNotesList(raw?.baseNotes),
      profile: { ...EMPTY_PROFILE, ...(raw?.profile || {}) },
      longevityHours: typeof raw?.longevityHours === 'number' ? raw.longevityHours : 6,
      sillageLevel: raw?.sillageLevel || 'moderate',
      evaporationNotes: raw?.evaporationNotes || '',
    };
  }, [project.olfactoryMap]);

  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [sectionSearch, setSectionSearch] = useState<Record<PyramidSectionKey, string>>({
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
  });

  const [newNoteForms, setNewNoteForms] = useState<
    Record<PyramidSectionKey, { ingredientId: string; name: string; percentage: string; description: string }>
  >({
    topNotes: { ingredientId: '', name: '', percentage: '50', description: '' },
    heartNotes: { ingredientId: '', name: '', percentage: '50', description: '' },
    baseNotes: { ingredientId: '', name: '', percentage: '50', description: '' },
  });

  const handleSelectIngredientForNote = (section: PyramidSectionKey, val: string) => {
    if (val.startsWith('lib:')) {
      const libId = val.slice(4);
      const libItem = library.find((l) => l.id === libId);
      setNewNoteForms((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          ingredientId: '',
          name: libItem ? libItem.name : '',
          description: libItem ? libItem.scentDescription || libItem.properties : '',
        },
      }));
      return;
    }
    const ing = ingredients.find((i) => i.id === val);
    setNewNoteForms((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ingredientId: val,
        name: ing ? ing.name : '',
        description: ing ? ing.olfactoryNotes : '',
      },
    }));
  };

  const handleAddNote = (section: PyramidSectionKey) => {
    const form = newNoteForms[section];
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    const pct = Math.min(100, Math.max(0, Number(form.percentage) || 0));
    const nextNote: OlfactoryMapNote = {
      id: generateId('on'),
      name: trimmedName,
      ingredientId: form.ingredientId || undefined,
      percentage: pct,
      description: form.description.trim(),
    };

    onUpdateMap({
      ...map,
      [section]: [...map[section], nextNote],
    });

    setNewNoteForms((prev) => ({
      ...prev,
      [section]: { ingredientId: '', name: '', percentage: '50', description: '' },
    }));
  };

  const handleUpdateNote = (section: PyramidSectionKey, noteId: string, patch: Partial<OlfactoryMapNote>) => {
    onUpdateMap({
      ...map,
      [section]: map[section].map((n) => (n.id === noteId ? { ...n, ...patch } : n)),
    });
  };

  const handleDeleteNote = (section: PyramidSectionKey, noteId: string) => {
    onUpdateMap({
      ...map,
      [section]: map[section].filter((n) => n.id !== noteId),
    });
  };

  const handleNormalizeSection = (section: PyramidSectionKey) => {
    const items = map[section];
    if (items.length === 0) return;
    const sum = items.reduce((acc, n) => acc + Math.max(0, n.percentage), 0);
    if (sum <= 0) {
      const equal = Math.round(100 / items.length);
      onUpdateMap({
        ...map,
        [section]: items.map((n, idx) => ({
          ...n,
          percentage: idx === items.length - 1 ? 100 - equal * (items.length - 1) : equal,
        })),
      });
      return;
    }

    let running = 0;
    const normalized = items.map((n, idx) => {
      if (idx === items.length - 1) {
        return { ...n, percentage: Math.max(0, 100 - running) };
      }
      const val = Math.round((Math.max(0, n.percentage) / sum) * 100);
      running += val;
      return { ...n, percentage: val };
    });

    onUpdateMap({
      ...map,
      [section]: normalized,
    });
  };

  const handlePopulateFromFormula = () => {
    const aromaticComps = project.components.filter((c) => c.tier !== 'solvent');
    if (aromaticComps.length === 0) {
      setSyncStatus(
        tr(language, {
          ru: 'В формуле этого проекта пока нет ароматических компонентов. Добавьте их во вкладке «Главное» или «Ингредиенты», либо внесите ноты вручную ниже.',
          en: 'This project formula has no aromatic components yet. Add them in the «Home» or «Ingredients» tab, or enter notes manually below.',
          it: 'Questa formula non ha ancora componenti aromatici. Aggiungili nella scheda «Principale» o «Ingredienti», oppure inserisci le note manualmente qui sotto.',
          es: 'La fórmula de este proyecto aún no tiene componentes aromáticos. Añádelos en «Principal» o «Ingredientes», o ingresa las notas abajo.',
          de: 'Diese Projektformel enthält noch keine Duftstoffe. Füge sie im Tab «Start» oder «Rohstoffe» hinzu oder trage die Noten unten ein.',
        })
      );
      return;
    }

    const buildTier = (tier: 'top' | 'heart' | 'base'): OlfactoryMapNote[] => {
      const tierComps = project.components.filter((c) => c.tier === tier);
      if (tierComps.length === 0) return [];
      const totalPure = tierComps.reduce(
        (acc, c) =>
          acc + Math.max(0, c.weightGrams) * (Math.min(100, Math.max(0, c.dilutionPercent)) / 100),
        0
      );

      let running = 0;
      return tierComps.map((c, idx) => {
        const pure =
          Math.max(0, c.weightGrams) * (Math.min(100, Math.max(0, c.dilutionPercent)) / 100);
        let pct = 0;
        if (idx === tierComps.length - 1) {
          pct = totalPure > 0 ? Math.max(0, 100 - running) : Math.round(100 / tierComps.length);
        } else {
          pct =
            totalPure > 0
              ? Math.round((pure / totalPure) * 100)
              : Math.round(100 / tierComps.length);
          running += pct;
        }
        const linkedIng = ingredients.find((i) => i.id === c.ingredientId);
        return {
          id: generateId('on'),
          ingredientId: c.ingredientId,
          name: c.name,
          percentage: pct,
          description: c.note || linkedIng?.olfactoryNotes || '',
        };
      });
    };

    const nextProfile = deriveOlfactoryProfileFromFormula(project.components);

    onUpdateMap({
      ...map,
      topNotes: buildTier('top'),
      heartNotes: buildTier('heart'),
      baseNotes: buildTier('base'),
      profile: nextProfile,
    });
    setSyncStatus(
      tr(language, {
        ru: 'Пирамида и профиль аккордов успешно обновлены по формуле проекта.',
        en: 'Pyramid and accord profile updated from the project formula.',
        it: 'Piramide e profilo accordi aggiornati dalla formula del progetto.',
        es: 'Pirámide y perfil de acordes actualizados desde la fórmula del proyecto.',
        de: 'Duftpyramide und Akkordprofil aus der Projektformel aktualisiert.',
      })
    );
  };

  const handleSyncRadarOnly = () => {
    const aromaticComps = project.components.filter((c) => c.tier !== 'solvent');
    if (aromaticComps.length === 0) {
      setSyncStatus(
        tr(language, {
          ru: 'Нет ароматических компонентов в формуле для расчёта профиля.',
          en: 'No aromatic components in the formula to calculate the profile.',
          it: 'Nessun componente aromatico nella formula per calcolare il profilo.',
          es: 'No hay componentes aromáticos en la fórmula para calcular el perfil.',
          de: 'Keine Duftstoffe in der Formel zur Profilberechnung.',
        })
      );
      return;
    }
    onUpdateMap({
      ...map,
      profile: deriveOlfactoryProfileFromFormula(project.components),
    });
    setSyncStatus(
      tr(language, {
        ru: 'Профиль аккордов пересчитан по формуле.',
        en: 'Accord profile recalculated from the formula.',
        it: 'Profilo accordi ricalcolato dalla formula.',
        es: 'Perfil de acordes recalculado desde la fórmula.',
        de: 'Akkordprofil anhand der Formel neu berechnet.',
      })
    );
  };

  const handleSliderChange = (key: OlfactoryFamilyKey, value: number) => {
    onUpdateMap({
      ...map,
      profile: {
        ...map.profile,
        [key]: value,
      },
    });
  };

  const sumPct = (notes: OlfactoryMapNote[]) =>
    notes.reduce((s, n) => s + (Number(n.percentage) || 0), 0);

  const emptySectionMsg = tr(language, {
    ru: 'Ноты не указаны — добавьте в редакторе ниже',
    en: 'No notes specified — add in editor below',
    it: 'Nessuna nota indicata — aggiungi nell’editor qui sotto',
    es: 'Sin notas especificadas — añade en el editor inferior',
    de: 'Keine Noten angegeben — unten im Editor hinzufügen',
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E4E4E0] bg-white px-5 py-4 space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="olfactory-project-select" className="text-xs font-medium text-[#575955]">
              {tr(language, {
                ru: 'Проект карты:',
                en: 'Map project:',
                it: 'Progetto mappa:',
                es: 'Proyecto del mapa:',
                de: 'Kartenprojekt:',
              })}
            </label>
            <select
              id="olfactory-project-select"
              value={project.id}
              onChange={(e) => {
                setSyncStatus(null);
                onSwitchProject(e.target.value);
              }}
              className="rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] px-3 py-1.5 text-sm font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handlePopulateFromFormula}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E4E4E0] bg-white px-3.5 py-2 text-xs font-medium text-[#181917] transition-colors hover:bg-[#F3F2F1] whitespace-nowrap shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
            <span>
              {tr(language, {
                ru: 'Заполнить пирамиду и профиль из формулы',
                en: 'Populate pyramid & profile from formula',
                it: 'Compila piramide e profilo dalla formula',
                es: 'Rellenar pirámide y perfil desde la fórmula',
                de: 'Pyramide & Profil aus Formel füllen',
              })}
            </span>
          </button>
        </div>

        {syncStatus && <p className="text-xs text-[var(--theme-accent)]">{syncStatus}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        <section className="xl:col-span-7 rounded-xl border border-[#E4E4E0] bg-white p-6">
          <div className="flex items-baseline justify-between border-b border-[#EAEAE6] pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Ольфакторная пирамида',
                  en: 'Olfactory Pyramid',
                  it: 'Piramide Olfattiva',
                  es: 'Pirámide Olfativa',
                  de: 'Duftpyramide',
                })}
              </h2>
              <p className="text-xs text-[#6B6D68] mt-0.5">
                {tr(language, {
                  ru: 'Наглядное распределение нот от быстро летучих к стойкой базе',
                  en: 'Visual progression from volatile top notes to lasting base',
                  it: 'Distribuzione visiva delle note dalle più volatili al fondo persistente',
                  es: 'Distribución visual desde notas de salida volátiles hasta un fondo duradero',
                  de: 'Visuelle Verteilung von flüchtigen Kopfnoten bis zur langanhaltenden Basis',
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2.5">
            <div className="w-full max-w-[380px] rounded-t-xl border border-[#C8D7EC] bg-[#F5F9FF] px-5 py-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--theme-accent)]">
                <span>1. {SECTION_META[0].titles[language]}</span>
                <span className="font-mono tabular-nums text-[#575955]">
                  {sumPct(map.topNotes)}%
                </span>
              </div>
              {map.topNotes.length === 0 ? (
                <p className="mt-2 text-xs text-[#797775]">{emptySectionMsg}</p>
              ) : (
                <div className="mt-2.5 space-y-1.5">
                  {map.topNotes.map((note) => (
                    <div key={note.id} className="text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#181917]">{note.name}</span>
                        <span className="font-mono tabular-nums text-[var(--theme-accent)] shrink-0">
                          {note.percentage}%
                        </span>
                      </div>
                      {note.description && (
                        <p className="text-[11px] text-[#575955] leading-snug">{note.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full max-w-[500px] border border-[#D2D0CE] bg-[#F8F8F7] px-6 py-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--theme-accent)]">
                <span>2. {SECTION_META[1].titles[language]}</span>
                <span className="font-mono tabular-nums text-[#575955]">
                  {sumPct(map.heartNotes)}%
                </span>
              </div>
              {map.heartNotes.length === 0 ? (
                <p className="mt-2 text-xs text-[#797775]">{emptySectionMsg}</p>
              ) : (
                <div className="mt-2.5 space-y-1.5">
                  {map.heartNotes.map((note) => (
                    <div key={note.id} className="text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#181917]">{note.name}</span>
                        <span className="font-mono tabular-nums text-[var(--theme-accent)] shrink-0">
                          {note.percentage}%
                        </span>
                      </div>
                      {note.description && (
                        <p className="text-[11px] text-[#575955] leading-snug">{note.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full max-w-[620px] rounded-b-xl border border-[#D2D0CE] bg-[#F1F0EE] px-7 py-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--theme-accent)]">
                <span>3. {SECTION_META[2].titles[language]}</span>
                <span className="font-mono tabular-nums text-[#575955]">
                  {sumPct(map.baseNotes)}%
                </span>
              </div>
              {map.baseNotes.length === 0 ? (
                <p className="mt-2 text-xs text-[#797775]">{emptySectionMsg}</p>
              ) : (
                <div className="mt-2.5 space-y-1.5">
                  {map.baseNotes.map((note) => (
                    <div key={note.id} className="text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#181917]">{note.name}</span>
                        <span className="font-mono tabular-nums text-[var(--theme-accent)] shrink-0">
                          {note.percentage}%
                        </span>
                      </div>
                      {note.description && (
                        <p className="text-[11px] text-[#575955] leading-snug">{note.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#EAEAE6] pt-5 sm:grid-cols-2">
            <div>
              <label htmlFor="map-longevity" className="block text-xs font-medium text-[#575955]">
                {tr(language, {
                  ru: 'Ожидаемая стойкость (часов):',
                  en: 'Expected longevity (hours):',
                  it: 'Persistenza attesa (ore):',
                  es: 'Duración esperada (horas):',
                  de: 'Erwartete Haltbarkeit (Std.):',
                })}{' '}
                <span className="font-mono font-semibold text-[#181917] tabular-nums">
                  {map.longevityHours}{' '}
                  {tr(language, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std' })}
                </span>
              </label>
              <input
                id="map-longevity"
                type="range"
                min={1}
                max={24}
                value={map.longevityHours}
                onChange={(e) => onUpdateMap({ ...map, longevityHours: Number(e.target.value) })}
                className="mt-2 w-full accent-[var(--theme-accent)]"
              />
            </div>

            <div>
              <label htmlFor="map-sillage" className="block text-xs font-medium text-[#575955]">
                {tr(language, {
                  ru: 'Шлейф композиции',
                  en: 'Fragrance sillage',
                  it: 'Scia della composizione',
                  es: 'Estela de la fragancia',
                  de: 'Sillage der Komposition',
                })}
              </label>
              <select
                id="map-sillage"
                value={map.sillageLevel}
                onChange={(e) => onUpdateMap({ ...map, sillageLevel: e.target.value as SillageLevel })}
                className="mt-1.5 w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-sm text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
              >
                {(['intimate', 'moderate', 'strong'] as SillageLevel[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {getSillageLabel(lvl, language)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="map-evaporation" className="block text-xs font-medium text-[#575955]">
              {tr(language, {
                ru: 'Общее описание раскрытия и сочетаний нот',
                en: 'Evolution & note blending overview',
                it: 'Descrizione generale di evoluzione e accordi',
                es: 'Descripción general de evolución y armonías',
                de: 'Überblick über Duftverlauf und Akkord-Harmonie',
              })}
            </label>
            <textarea
              id="map-evaporation"
              rows={3}
              value={map.evaporationNotes || ''}
              onChange={(e) => onUpdateMap({ ...map, evaporationNotes: e.target.value })}
              placeholder={tr(language, {
                ru: 'Как ноты сменяют друг друга во времени, какие аккорды возникают на стыке...',
                en: 'How notes evolve over time, what accords emerge in transition...',
                it: 'Come le note evolvono nel tempo e quali accordi emergono nella transizione...',
                es: 'Cómo evolucionan las notas con el tiempo y qué acordes surgen en la transición...',
                de: 'Wie sich die Noten über die Zeit entfalten und welche Akkorde entstehen...',
              })}
              className="mt-1.5 w-full rounded-lg border border-[#E4E4E0] bg-white px-3 py-2 text-sm text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
            />
          </div>
        </section>

        <section className="xl:col-span-5 rounded-xl border border-[#E4E4E0] bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#EAEAE6] pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#181917]">
                {tr(language, {
                  ru: 'Профиль аккордов',
                  en: 'Accord Profile',
                  it: 'Profilo Accordi',
                  es: 'Perfil de Acordes',
                  de: 'Akkordprofil',
                })}
              </h2>
              <p className="text-xs text-[#6B6D68] mt-0.5">
                {tr(language, {
                  ru: 'Баланс ольфакторных семейств (0–10)',
                  en: 'Olfactory family balance (0–10)',
                  it: 'Equilibrio delle famiglie olfattive (0–10)',
                  es: 'Equilibrio de familias olfativas (0–10)',
                  de: 'Balance der Duftfamilien (0–10)',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncRadarOnly}
              className="rounded-lg border border-[#E4E4E0] px-2.5 py-1.5 text-xs font-medium text-[#3F413D] hover:bg-[#F3F2F1] whitespace-nowrap"
            >
              {tr(language, {
                ru: 'Из формулы',
                en: 'From formula',
                it: 'Dalla formula',
                es: 'Desde fórmula',
                de: 'Aus Formel',
              })}
            </button>
          </div>

          <div className="mt-3">
            <OlfactoryRadarChart profile={map.profile} language={language} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 border-t border-[#EAEAE6] pt-4">
            {OLFACTORY_FAMILIES.map((fam) => {
              const famLabel = getOlfactoryFamilyLabel(fam.key, language);
              return (
                <div key={fam.key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#3F413D] font-medium">{famLabel}</span>
                    <span className="font-mono tabular-nums text-[#181917]">
                      {map.profile[fam.key] ?? 0}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={map.profile[fam.key] ?? 0}
                    onChange={(e) => handleSliderChange(fam.key, Number(e.target.value))}
                    className="w-full accent-[var(--theme-accent)]"
                    aria-label={famLabel}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {SECTION_META.map((sec) => {
          const notes = map[sec.key];
          const sectionTotal = sumPct(notes);
          const form = newNoteForms[sec.key];

          return (
            <section
              key={sec.key}
              className="flex flex-col justify-between rounded-xl border border-[#E4E4E0] bg-white p-5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-[#EAEAE6] pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#181917]">
                      {sec.titles[language]}
                    </h3>
                    <p className="text-xs text-[#6B6D68]">{sec.subtitles[language]}</p>
                  </div>
                  {notes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleNormalizeSection(sec.key)}
                      className={`rounded border px-2 py-1 text-[11px] font-medium whitespace-nowrap shrink-0 ${
                        sectionTotal === 100
                          ? 'border-[#15803D]/30 bg-[#F0FDF4] text-[#15803D]'
                          : 'border-[#E4E4E0] text-[#575955] hover:bg-[#F3F2F1] hover:text-[#181917]'
                      }`}
                      title={tr(language, {
                        ru: 'Привести сумму долей в секции к 100%',
                        en: 'Normalize section shares to 100%',
                        it: 'Normalizza le quote della sezione al 100%',
                        es: 'Normalizar proporciones de la sección al 100%',
                        de: 'Abschnittsanteile auf 100% normieren',
                      })}
                    >
                      {tr(language, {
                        ru: `К 100% (${sectionTotal}%)`,
                        en: `To 100% (${sectionTotal}%)`,
                        it: `Al 100% (${sectionTotal}%)`,
                        es: `Al 100% (${sectionTotal}%)`,
                        de: `Auf 100% (${sectionTotal}%)`,
                      })}
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  {notes.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#8B8D87]">
                      {tr(language, {
                        ru: 'Добавьте первую ноту в эту секцию',
                        en: 'Add the first note to this section',
                        it: 'Aggiungi la prima nota a questa sezione',
                        es: 'Añade la primera nota a esta sección',
                        de: 'Erste Note zu diesem Abschnitt hinzufügen',
                      })}
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-[#EAEAE6] bg-[#FAF9F8] p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={note.name}
                            onChange={(e) =>
                              handleUpdateNote(sec.key, note.id, { name: e.target.value })
                            }
                            aria-label={tr(language, {
                              ru: 'Название ноты',
                              en: 'Note name',
                              it: 'Nome della nota',
                              es: 'Nombre de la nota',
                              de: 'Notenname',
                            })}
                            className="min-w-0 flex-1 rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-sm font-medium text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={note.percentage}
                              onChange={(e) =>
                                handleUpdateNote(sec.key, note.id, {
                                  percentage: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                                })
                              }
                              aria-label={tr(language, {
                                ru: 'Процент ноты',
                                en: 'Note percentage',
                                it: 'Percentuale della nota',
                                es: 'Porcentaje de la nota',
                                de: 'Notenanteil (%)',
                              })}
                              className="w-16 rounded border border-[#E4E4E0] bg-white px-2 py-1 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                            />
                            <span className="text-xs text-[#6B6D68]">%</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(sec.key, note.id)}
                            className="rounded p-1 text-[#787A74] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                            aria-label={`${tr(language, {
                              ru: 'Удалить ноту',
                              en: 'Delete note',
                              it: 'Elimina nota',
                              es: 'Eliminar nota',
                              de: 'Note löschen',
                            })} ${note.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={note.description}
                          onChange={(e) =>
                            handleUpdateNote(sec.key, note.id, { description: e.target.value })
                          }
                          placeholder={tr(language, {
                            ru: 'Краткое описание ноты или сочетания...',
                            en: 'Brief note or blending description...',
                            it: 'Breve descrizione della nota o dell’abbinamento...',
                            es: 'Breve descripción de la nota o combinación...',
                            de: 'Kurze Beschreibung der Note oder Kombination...',
                          })}
                          className="w-full rounded border border-[#E4E4E0] bg-white px-2.5 py-1 text-xs text-[#3F413D] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNote(sec.key);
                }}
                className="mt-4 border-t border-[#EAEAE6] pt-4 space-y-2.5"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787A74]" />
                  <input
                    type="text"
                    value={sectionSearch[sec.key]}
                    onChange={(e) =>
                      setSectionSearch((prev) => ({ ...prev, [sec.key]: e.target.value }))
                    }
                    placeholder={tr(language, {
                      ru: 'Поиск в базе и библиотеке ингредиентов...',
                      en: 'Search catalog & ingredient library...',
                      it: 'Cerca nel catalogo e nella libreria...',
                      es: 'Buscar en catálogo y biblioteca...',
                      de: 'In Katalog & Bibliothek suchen...',
                    })}
                    className="w-full rounded-lg border border-[#E4E4E0] bg-[#FAF9F8] py-1.5 pl-8 pr-2.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
                  />
                </div>

                <select
                  value={form.ingredientId}
                  onChange={(e) => handleSelectIngredientForNote(sec.key, e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#3F413D] focus:border-[var(--theme-accent)] focus:outline-none"
                  aria-label={tr(language, {
                    ru: 'Выбрать ингредиент из базы или библиотеки',
                    en: 'Select ingredient from catalog or library',
                    it: 'Seleziona ingrediente dal catalogo o libreria',
                    es: 'Seleccionar ingrediente del catálogo o biblioteca',
                    de: 'Rohstoff aus Katalog oder Bibliothek wählen',
                  })}
                >
                  <option value="">
                    {tr(language, {
                      ru: '— Выбрать из базы или библиотеки ингредиентов —',
                      en: '— Choose from catalog or ingredient library —',
                      it: '— Scegli dal catalogo o libreria ingredienti —',
                      es: '— Elegir del catálogo o biblioteca de ingredientes —',
                      de: '— Aus Katalog oder Rohstoffbibliothek wählen —',
                    })}
                  </option>
                  {ingredients
                    .filter((i) => {
                      if (i.tier === 'solvent') return false;
                      const q = sectionSearch[sec.key].trim().toLowerCase();
                      if (!q) return true;
                      return (
                        i.name.toLowerCase().includes(q) ||
                        (i.bottleLabel || '').toLowerCase().includes(q) ||
                        (i.inciOrCas || '').toLowerCase().includes(q)
                      );
                    })
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                        {i.bottleLabel ? ` [${i.bottleLabel}]` : ''}
                      </option>
                    ))}
                  {library
                    .filter((l) => {
                      if (l.tier === 'solvent') return false;
                      if (
                        ingredients.some(
                          (ing) => ing.name.trim().toLowerCase() === l.name.trim().toLowerCase()
                        )
                      ) {
                        return false;
                      }
                      const q = sectionSearch[sec.key].trim().toLowerCase();
                      if (!q) return l.tier === sec.tierMatch;
                      return (
                        l.name.toLowerCase().includes(q) ||
                        (l.inciOrCas || '').toLowerCase().includes(q) ||
                        l.scentDescription.toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 60)
                    .map((l) => (
                      <option key={`lib-${l.id}`} value={`lib:${l.id}`}>
                        [Библиотека] {l.name}
                      </option>
                    ))}
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setNewNoteForms((prev) => ({
                        ...prev,
                        [sec.key]: { ...prev[sec.key], name: e.target.value },
                      }))
                    }
                    placeholder={tr(language, {
                      ru: 'Название ноты...',
                      en: 'Note name...',
                      it: 'Nome della nota...',
                      es: 'Nombre de la nota...',
                      de: 'Name der Note...',
                    })}
                    className="min-w-0 flex-1 rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.percentage}
                      onChange={(e) =>
                        setNewNoteForms((prev) => ({
                          ...prev,
                          [sec.key]: { ...prev[sec.key], percentage: e.target.value },
                        }))
                      }
                      className="w-16 rounded-lg border border-[#E4E4E0] bg-white px-2 py-1.5 text-right font-mono text-xs tabular-nums text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                    />
                    <span className="text-xs text-[#6B6D68]">%</span>
                  </div>
                </div>

                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setNewNoteForms((prev) => ({
                      ...prev,
                      [sec.key]: { ...prev[sec.key], description: e.target.value },
                    }))
                  }
                  placeholder={tr(language, {
                    ru: 'Описание роли или сочетания ноты...',
                    en: 'Role or pairing description...',
                    it: 'Descrizione del ruolo o abbinamento...',
                    es: 'Descripción de la función o combinación...',
                    de: 'Beschreibung von Funktion oder Kombination...',
                  })}
                  className="w-full rounded-lg border border-[#E4E4E0] bg-white px-2.5 py-1.5 text-xs text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!form.name.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)] disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {tr(language, {
                      ru: 'Добавить ноту',
                      en: 'Add Note',
                      it: 'Aggiungi nota',
                      es: 'Añadir nota',
                      de: 'Note hinzufügen',
                    })}
                  </span>
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
}
