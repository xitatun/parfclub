import {
  ArrowRight,
  Clock,
  Coins,
  Copy,
  Droplet,
  FlaskConical,
  Layers,
  Percent,
  Plus,
  Scale,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DEFAULT_VIEW_SETTINGS, getProjectStatusLabel } from '../data/constants';
import { tr } from '../data/i18n';
import type { AppCurrency, AppLanguage, PerfumeProject, ProjectStatus, ViewSettings } from '../types/perfume';
import {
  calculateFormulaReadiness,
  calculateFormulaSummary,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
} from '../utils/calculations';

interface ProjectsOverviewProps {
  projects: PerfumeProject[];
  viewSettings?: ViewSettings;
  language?: AppLanguage;
  currency?: AppCurrency;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const STATUS_FILTER_KEYS: ('all' | ProjectStatus)[] = [
  'all',
  'idea',
  'formulating',
  'macerating',
  'completed',
  'archived',
];

export function ProjectsOverview({
  projects,
  viewSettings = DEFAULT_VIEW_SETTINGS,
  language = 'ru',
  currency = 'RUB',
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.idea.toLowerCase().includes(q) ||
        p.olfactoryMap.topNotes.some((n) => n.name.toLowerCase().includes(q)) ||
        p.olfactoryMap.heartNotes.some((n) => n.name.toLowerCase().includes(q)) ||
        p.olfactoryMap.baseNotes.some((n) => n.name.toLowerCase().includes(q))
      );
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header summary & controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#181917]">
            {tr(language, {
              ru: 'Парфюмерные проекты',
              en: 'Perfume Projects',
              it: 'Progetti di Profumeria',
              es: 'Proyectos de Perfumería',
              de: 'Parfümprojekte',
            })}
          </h1>
          {viewSettings.showPageDescriptions && (
            <p className="mt-1 text-sm text-[#575955]">
              {tr(language, {
                ru: 'Идеи композиций, формулы, ольфакторные карты и журнал проб.',
                en: 'Fragrance concepts, formulas, olfactory maps, and trial notes.',
                it: 'Idee olfattive, formule, mappe olfattive e diario delle prove.',
                es: 'Conceptos de fragancias, fórmulas, mapas olfativos y diario de pruebas.',
                de: 'Duftkonzepte, Rezepturen, Duftpyramiden und Labornotizen.',
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--theme-accent-hover)] whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>
              {tr(language, {
                ru: 'Новый проект',
                en: 'New Project',
                it: 'Nuovo Progetto',
                es: 'Nuevo Proyecto',
                de: 'Neues Projekt',
              })}
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-[#E4E4E0] pb-4">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#EEEEEC] p-1">
          {STATUS_FILTER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === key
                  ? 'bg-white text-[#181917] shadow-xs'
                  : 'text-[#575955] hover:text-[#181917]'
              }`}
            >
              {key === 'all'
                ? tr(language, {
                    ru: 'Все',
                    en: 'All',
                    it: 'Tutti',
                    es: 'Todos',
                    de: 'Alle',
                  })
                : getProjectStatusLabel(key, language)}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787A74]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tr(language, {
              ru: 'Поиск по названию, нотам, коду...',
              en: 'Search by title, notes, code...',
              it: 'Cerca per titolo, note, codice...',
              es: 'Buscar por título, notas, código...',
              de: 'Suche nach Titel, Noten, Code...',
            })}
            className="w-full rounded-lg border border-[#E4E4E0] bg-white py-2 pl-9 pr-3 text-sm text-[#181917] placeholder:text-[#8B8D87] focus:border-[var(--theme-accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-[#E4E4E0] bg-white p-12 text-center">
          <p className="text-base font-medium text-[#181917]">
            {projects.length === 0
              ? tr(language, {
                  ru: 'У вас пока нет проектов',
                  en: 'No projects yet',
                  it: 'Nessun progetto presente',
                  es: 'Aún no tienes proyectos',
                  de: 'Noch keine Projekte vorhanden',
                })
              : tr(language, {
                  ru: 'Ничего не найдено по фильтрам',
                  en: 'No matching projects',
                  it: 'Nessun progetto trovato',
                  es: 'No hay proyectos coincidentes',
                  de: 'Keine passenden Projekte',
                })}
          </p>
          <p className="mt-1 text-sm text-[#575955]">
            {projects.length === 0
              ? tr(language, {
                  ru: 'Создайте первый парфюмерный проект, чтобы записать идею, формулу и ольфакторную карту.',
                  en: 'Create your first perfume project to record a formula and olfactory map.',
                  it: 'Crea il tuo primo progetto per registrare idea, formula e mappa olfattiva.',
                  es: 'Crea tu primer proyecto para registrar la idea, fórmula y mapa olfativo.',
                  de: 'Erstellen Sie Ihr erstes Parfümprojekt für Konzept, Rezeptur und Duftpyramide.',
                })
              : tr(language, {
                  ru: 'Попробуйте изменить поисковый запрос или выбрать другой статус.',
                  en: 'Try changing your search query or selecting another status.',
                  it: 'Prova a modificare la ricerca o a selezionare un altro stato.',
                  es: 'Prueba a cambiar la búsqueda o seleccionar otro estado.',
                  de: 'Ändern Sie die Suchanfrage oder wählen Sie einen anderen Status.',
                })}
          </p>
          {projects.length === 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={onCreateProject}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)]"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {tr(language, {
                    ru: 'Создать первый проект',
                    en: 'Create First Project',
                    it: 'Crea il Primo Progetto',
                    es: 'Crear Primer Proyecto',
                    de: 'Erstes Projekt erstellen',
                  })}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const summary = calculateFormulaSummary(project.components);
            const readiness = calculateFormulaReadiness(project.components, language);
            const topCount = project.components.filter((c) => c.tier === 'top').length;
            const heartCount = project.components.filter((c) => c.tier === 'heart').length;
            const baseCount = project.components.filter((c) => c.tier === 'base').length;
            const variantsCount = (project.variants || []).length;
            const notesCount = project.journal.length;
            const activeMaceration = (project.macerations || []).find((m) => !m.acknowledged);
            const allNotes = [
              ...project.olfactoryMap.topNotes.slice(0, 2).map((n) => n.name),
              ...project.olfactoryMap.heartNotes.slice(0, 2).map((n) => n.name),
              ...project.olfactoryMap.baseNotes.slice(0, 2).map((n) => n.name),
            ];

            return (
              <article
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectProject(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(project.id);
                  }
                }}
                className="group flex flex-col justify-between rounded-xl border border-[#E4E4E0] bg-white p-6 text-left cursor-pointer transition-colors hover:border-[var(--theme-accent)] focus-visible:outline-2 focus-visible:outline-[var(--theme-accent)]"
              >
                <div>
                  {/* Quiet 1-line unboxed metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6B6D68]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-medium text-[#181917]">{project.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getProjectStatusLabel(project.status, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.targetConcentration}</span>
                    </div>
                    <span className="shrink-0 tabular-nums">{project.updatedAt}</span>
                  </div>

                  {/* Title & Idea */}
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-[#181917] group-hover:text-[var(--theme-accent)] transition-colors">
                    {project.title ||
                      tr(language, {
                        ru: 'Без названия',
                        en: 'Untitled',
                        it: 'Senza titolo',
                        es: 'Sin título',
                        de: 'Ohne Titel',
                      })}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#575955]">
                    {project.idea ||
                      tr(language, {
                        ru: 'Описание идеи пока не заполнено.',
                        en: 'No idea description yet.',
                        it: 'Nessuna descrizione ancora inserita.',
                        es: 'Aún sin descripción de la idea.',
                        de: 'Noch keine Konzeptbeschreibung.',
                      })}
                  </p>

                  {allNotes.length > 0 && (
                    <p className="mt-3 text-xs leading-relaxed text-[#6B6D68]">
                      {tr(language, {
                        ru: 'Ноты:',
                        en: 'Notes:',
                        it: 'Note:',
                        es: 'Notas:',
                        de: 'Noten:',
                      })}{' '}
                      {allNotes.join(' · ')}
                    </p>
                  )}
                </div>

                {/* Visual Formula Readiness Progress Bar */}
                <div
                  className="mt-3.5 pt-3 border-t border-[#EDEBE9] dark:border-[#383735]/60 space-y-1.5"
                  title={tr(language, {
                    ru: `Готовность: ${readiness.percent}% (${readiness.stageLabel}). Верхние: ${topCount} · Сердце: ${heartCount} · База: ${baseCount} · Всего: ${readiness.aromaticCount} нот`,
                    en: `Readiness: ${readiness.percent}% (${readiness.stageLabel}). Top: ${topCount} · Heart: ${heartCount} · Base: ${baseCount} · Total: ${readiness.aromaticCount} notes`,
                    it: `Prontezza: ${readiness.percent}% (${readiness.stageLabel}). Testa: ${topCount} · Cuore: ${heartCount} · Fondo: ${baseCount} · Totale: ${readiness.aromaticCount} note`,
                    es: `Madurez: ${readiness.percent}% (${readiness.stageLabel}). Salida: ${topCount} · Corazón: ${heartCount} · Fondo: ${baseCount} · Total: ${readiness.aromaticCount} notas`,
                    de: `Formelreife: ${readiness.percent}% (${readiness.stageLabel}). Kopf: ${topCount} · Herz: ${heartCount} · Basis: ${baseCount} · Gesamt: ${readiness.aromaticCount} Noten`,
                  })}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FlaskConical
                        className={`h-3.5 w-3.5 shrink-0 ${
                          readiness.isComplete
                            ? 'text-[#107C41]'
                            : 'text-[var(--theme-accent)]'
                        }`}
                      />
                      <span className="text-[11px] font-medium text-[#797775] dark:text-[#979593] truncate">
                        {tr(language, {
                          ru: 'Готовность формулы:',
                          en: 'Formula readiness:',
                          it: 'Maturità formula:',
                          es: 'Madurez de fórmula:',
                          de: 'Formelreife:',
                        })}
                      </span>
                      <span
                        className={`text-[11px] font-semibold truncate ${
                          readiness.isComplete
                            ? 'text-[#107C41]'
                            : 'text-[#181917] dark:text-[#F3F2F1]'
                        }`}
                      >
                        {readiness.stageLabel}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-xs font-bold tabular-nums shrink-0 ml-2 ${
                        readiness.isComplete
                          ? 'text-[#107C41]'
                          : 'text-[var(--theme-accent)]'
                      }`}
                    >
                      {readiness.percent}%
                    </span>
                  </div>

                  {/* Horizontal Progress Bar Track */}
                  <div
                    role="progressbar"
                    aria-valuenow={readiness.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${tr(language, {
                      ru: 'Готовность формулы',
                      en: 'Formula readiness',
                      it: 'Maturità formula',
                      es: 'Madurez de fórmula',
                      de: 'Formelreife',
                    })}: ${readiness.percent}%`}
                    className="h-1.5 w-full rounded-full bg-[#EAE8E6] dark:bg-[#383735] overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        readiness.isComplete
                          ? 'bg-[#107C41]'
                          : 'bg-[var(--theme-accent)]'
                      }`}
                      style={{
                        width: `${Math.max(readiness.percent > 0 ? 5 : 0, readiness.percent)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* MODERN VISUAL KEY INDICATORS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {/* Key Indicator 1: Concentration */}
                  <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-2.5 transition-colors group-hover:bg-[#F5F4F2]">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#797775]">
                      <Percent className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                      <span className="whitespace-nowrap">
                        {tr(language, { ru: 'Концентрация', en: 'Concentration', it: 'Concentrazione', es: 'Concentración', de: 'Konzentration' })}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-base font-bold text-[#181917] tabular-nums">
                      {project.targetConcentration}
                    </div>
                    <div className="text-[11px] text-[#605E5C] tabular-nums whitespace-nowrap">
                      {formatPercent(summary.pureConcentrationPercent, 1)}{' '}
                      {tr(language, { ru: 'факт.', en: 'actual', it: 'eff.', es: 'real', de: 'ist' })}
                    </div>
                  </div>

                  {/* Key Indicator 2: Components Count */}
                  <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-2.5 transition-colors group-hover:bg-[#F5F4F2]">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#797775]">
                      <FlaskConical className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                      <span className="whitespace-nowrap">
                        {tr(language, { ru: 'Компоненты', en: 'Components', it: 'Componenti', es: 'Componentes', de: 'Komponenten' })}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-base font-bold text-[#181917] tabular-nums">
                      {project.components.length}
                    </div>
                    <div className="text-[11px] text-[#605E5C] tabular-nums whitespace-nowrap">
                      {topCount}в · {heartCount}с · {baseCount}б
                    </div>
                  </div>

                  {/* Key Indicator 3: Bottle & Batch Mass */}
                  <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-2.5 transition-colors group-hover:bg-[#F5F4F2]">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#797775]">
                      <Scale className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                      <span className="whitespace-nowrap">
                        {tr(language, { ru: 'Флакон / Вес', en: 'Bottle / Mass', it: 'Flacone / Peso', es: 'Frasco / Masa', de: 'Flasche / Masse' })}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-base font-bold text-[#181917] tabular-nums">
                      {project.targetBottleMl} {tr(language, { ru: 'мл', en: 'ml', it: 'ml', es: 'ml', de: 'ml' })}
                    </div>
                    <div className="text-[11px] text-[#605E5C] tabular-nums whitespace-nowrap">
                      {formatGrams(summary.totalWeightGrams, 1, language)}
                    </div>
                  </div>

                  {/* Key Indicator 4: Cost */}
                  <div className="rounded-lg border border-[#EDEBE9] bg-[#FAF9F8] p-2.5 transition-colors group-hover:bg-[#F5F4F2]">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#797775]">
                      <Coins className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                      <span className="whitespace-nowrap">
                        {tr(language, { ru: 'Себестоимость', en: 'Unit Cost', it: 'Costo unit.', es: 'Coste', de: 'Selbstkosten' })}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#181917] tabular-nums">
                      {formatCurrencyRub(summary.totalFormulaCost, language, currency)}
                    </div>
                    <div className="text-[11px] text-[#605E5C] tabular-nums whitespace-nowrap">
                      {tr(language, { ru: 'сырьё / флакон', en: 'materials/bottle', it: 'materiali/flac.', es: 'materias/frasco', de: 'Rohstoffe/Fl.' })}
                    </div>
                  </div>
                </div>

                  {/* Active Maceration Notice if present */}
                  {activeMaceration && (
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1.5 text-xs text-[#92400E]">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#D97706]" />
                        <span className="font-medium">
                          {activeMaceration.stage === 'concentrate'
                            ? tr(language, { ru: 'Мацерация концентрата', en: 'Concentrate maturation', it: 'Macerazione concentrato', es: 'Maceración de concentrado', de: 'Konzentrat-Reifung' })
                            : tr(language, { ru: 'Мацерация парфюма', en: 'Perfume maceration', it: 'Macerazione profumo', es: 'Maceración de perfume', de: 'Parfüm-Reifung' })}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] tabular-nums">
                        {activeMaceration.durationDays}{' '}
                        {tr(language, { ru: 'дн.', en: 'days', it: 'gg.', es: 'días', de: 'Tage' })}
                      </span>
                    </div>
                  )}

                  {/* Card Actions & Open Link */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#EDEBE9] pt-3 text-xs text-[#797775]">
                    <div className="flex items-center gap-2">
                      {notesCount > 0 && (
                        <span className="tabular-nums">
                          {notesCount}{' '}
                          {tr(language, { ru: 'проб в дневнике', en: 'journal trials', it: 'prove nel diario', es: 'pruebas en diario', de: 'Proben im Tagebuch' })}
                        </span>
                      )}
                      {variantsCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#F3F2F1] px-1.5 py-0.5 text-[10px] font-medium text-[#605E5C]">
                          <Layers className="h-3 w-3" />
                          <span>{variantsCount + 1} вар.</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(project.id);
                      }}
                      className="rounded-lg p-1.5 text-[#6B6D68] transition-colors hover:bg-[#F1F1EE] hover:text-[#181917]"
                      title={tr(language, {
                        ru: 'Дублировать проект (создать новую версию)',
                        en: 'Duplicate project (create new version)',
                        it: 'Duplica progetto (crea nuova versione)',
                        es: 'Duplicar proyecto (crear nueva versión)',
                        de: 'Projekt duplizieren (neue Version)',
                      })}
                      aria-label={`${tr(language, {
                        ru: 'Дублировать проект',
                        en: 'Duplicate project',
                        it: 'Duplica progetto',
                        es: 'Duplicar proyecto',
                        de: 'Projekt duplizieren',
                      })} ${project.title}`}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="rounded-lg p-1.5 text-[#6B6D68] transition-colors hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                      title={tr(language, {
                        ru: 'Удалить проект',
                        en: 'Delete project',
                        it: 'Elimina progetto',
                        es: 'Eliminar progetto',
                        de: 'Projekt löschen',
                      })}
                      aria-label={`${tr(language, {
                        ru: 'Удалить проект',
                        en: 'Delete project',
                        it: 'Elimina progetto',
                        es: 'Eliminar proyecto',
                        de: 'Projekt löschen',
                      })} ${project.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-1 font-medium text-[var(--theme-accent)] group-hover:translate-x-0.5 transition-transform">
                    <span>
                      {tr(language, { ru: 'Открыть проект', en: 'Open Project', it: 'Apri Progetto', es: 'Abrir Proyecto', de: 'Projekt öffnen' })}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
