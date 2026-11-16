import { Plus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { tr } from '../data/i18n';
import type { AppLanguage, AppSection, PerfumeProject } from '../types/perfume';

interface ProjectTabsBarProps {
  language: AppLanguage;
  projects: PerfumeProject[];
  openTabIds: string[];
  activeSection: AppSection;
  selectedProjectId: string | null;
  onSelectOverview?: () => void;
  onSelectTab: (projectId: string) => void;
  onCloseTab: (projectId: string) => void;
  onCloseAllTabs: () => void;
  onCreateProject: () => void;
  onOpenProjectInTab: (projectId: string) => void;
}

const TABS_TEXT: Record<
  AppLanguage,
  {
    openTabsAria: string;
    allProjects: string;
    untitled: string;
    closeTabLabel: string;
    closeTab: string;
    openOrCreateAria: string;
    openInNewTab: string;
    newProjectInTab: string;
    openProject: string;
    allAlreadyOpen: string;
    closeAllTitle: string;
    closeTabs: string;
  }
> = {
  ru: {
    openTabsAria: 'Вкладки открытых проектов',
    allProjects: 'Все проекты',
    untitled: 'Без названия',
    closeTabLabel: 'Закрыть вкладку',
    closeTab: 'Закрыть вкладку',
    openOrCreateAria: 'Открыть или создать вкладку проекта',
    openInNewTab: 'Открыть проект в новой вкладке',
    newProjectInTab: 'Новый проект во вкладке',
    openProject: 'Открыть проект',
    allAlreadyOpen: 'Все проекты уже открыты во вкладках',
    closeAllTitle: 'Закрыть все открытые вкладки',
    closeTabs: 'Закрыть вкладки',
  },
  en: {
    openTabsAria: 'Open project tabs',
    allProjects: 'All Projects',
    untitled: 'Untitled',
    closeTabLabel: 'Close tab',
    closeTab: 'Close tab',
    openOrCreateAria: 'Open or create project tab',
    openInNewTab: 'Open project in new tab',
    newProjectInTab: 'New project in tab',
    openProject: 'Open project',
    allAlreadyOpen: 'All projects are already open in tabs',
    closeAllTitle: 'Close all open project tabs',
    closeTabs: 'Close tabs',
  },
  it: {
    openTabsAria: 'Schede dei progetti aperti',
    allProjects: 'Tutti i progetti',
    untitled: 'Senza titolo',
    closeTabLabel: 'Chiudi scheda',
    closeTab: 'Chiudi scheda',
    openOrCreateAria: 'Apri o crea scheda progetto',
    openInNewTab: 'Apri progetto in una nuova scheda',
    newProjectInTab: 'Nuovo progetto nella scheda',
    openProject: 'Apri progetto',
    allAlreadyOpen: 'Tutti i progetti sono già aperti nelle schede',
    closeAllTitle: 'Chiudi tutte le schede aperte',
    closeTabs: 'Chiudi schede',
  },
  es: {
    openTabsAria: 'Pestañas de proyectos abiertos',
    allProjects: 'Todos los proyectos',
    untitled: 'Sin título',
    closeTabLabel: 'Cerrar pestaña',
    closeTab: 'Cerrar pestaña',
    openOrCreateAria: 'Abrir o crear pestaña de proyecto',
    openInNewTab: 'Abrir proyecto en nueva pestaña',
    newProjectInTab: 'Nuevo proyecto en pestaña',
    openProject: 'Abrir proyecto',
    allAlreadyOpen: 'Todos los proyectos ya están abiertos en pestañas',
    closeAllTitle: 'Cerrar todas las pestañas abiertas',
    closeTabs: 'Cerrar pestañas',
  },
  de: {
    openTabsAria: 'Geöffnete Projekt-Tabs',
    allProjects: 'Alle Projekte',
    untitled: 'Ohne Titel',
    closeTabLabel: 'Tab schließen',
    closeTab: 'Tab schließen',
    openOrCreateAria: 'Projekt-Tab öffnen oder erstellen',
    openInNewTab: 'Projekt in neuem Tab öffnen',
    newProjectInTab: 'Neues Projekt im Tab',
    openProject: 'Projekt öffnen',
    allAlreadyOpen: 'Alle Projekte sind bereits in Tabs geöffnet',
    closeAllTitle: 'Alle offenen Projekt-Tabs schließen',
    closeTabs: 'Tabs schließen',
  },
};

export function ProjectTabsBar({
  language,
  projects,
  openTabIds,
  activeSection,
  selectedProjectId,
  onSelectOverview,
  onSelectTab,
  onCloseTab,
  onCloseAllTabs,
  onCreateProject,
  onOpenProjectInTab,
}: ProjectTabsBarProps) {
  const t = tr(language, TABS_TEXT);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const openProjects = useMemo(() => {
    const map = new Map(projects.map((p) => [p.id, p]));
    return openTabIds
      .map((id) => map.get(id))
      .filter((p): p is PerfumeProject => Boolean(p));
  }, [projects, openTabIds]);

  const unopenedProjects = useMemo(() => {
    const openSet = new Set(openTabIds);
    return projects.filter((p) => !openSet.has(p.id));
  }, [projects, openTabIds]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const getStatusDotColor = (status: PerfumeProject['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#107C41]';
      case 'macerating':
        return 'bg-[#D97706]';
      case 'formulating':
        return 'bg-[var(--theme-accent)]';
      default:
        return 'bg-[#8A8886]';
    }
  };

  if (openProjects.length === 0) {
    return null;
  }

  return (
    <div className="print:hidden relative z-20 flex items-end gap-1.5 bg-[#FAF9F8] border-t border-b border-[#E1DFDD] px-4 pt-1.5 select-none">
      <div
        role="tablist"
        aria-label={t.openTabsAria}
        className="flex items-end gap-1 overflow-x-auto overflow-y-hidden no-scrollbar min-w-0"
      >
        {openProjects.map((proj) => {
          const isActive = activeSection === 'projects' && selectedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              onAuxClick={(e) => {
                if (e.button === 1) {
                  e.preventDefault();
                  onCloseTab(proj.id);
                }
              }}
              className={`group relative flex items-center shrink-0 rounded-t-md border-t-2 border-x transition-colors ${
                isActive
                  ? 'border-t-[var(--theme-accent)] border-x-[#E1DFDD] bg-white text-[#181917] -mb-px pb-[1px] z-10'
                  : 'border-t-transparent border-x-transparent text-[#575955] hover:bg-white dark:hover:bg-[#2A2A27] hover:text-[#181917]'
              }`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(proj.id)}
                title={`${proj.code} — ${proj.title}`}
                className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 text-xs text-left min-w-0"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${getStatusDotColor(proj.status)}`}
                />
                <span
                  className={`font-mono text-[10.5px] font-semibold shrink-0 tabular-nums ${
                    isActive ? 'text-[var(--theme-accent)]' : 'text-[#787A74]'
                  }`}
                >
                  {proj.code}
                </span>
                <span
                  className={`truncate max-w-[170px] ${
                    isActive ? 'font-semibold text-[#181917]' : 'font-medium'
                  }`}
                >
                  {proj.title || t.untitled}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onCloseTab(proj.id)}
                aria-label={`${t.closeTabLabel} ${proj.title}`}
                title={t.closeTab}
                className={`mr-1.5 rounded p-0.5 transition-colors ${
                  isActive
                    ? 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]'
                    : 'text-[#8A8886] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[#EDEBE9] hover:text-[#181917]'
                }`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="relative shrink-0 pb-1" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={t.openOrCreateAria}
          title={t.openInNewTab}
          className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
            menuOpen
              ? 'border-[#D2D0CE] bg-white text-[var(--theme-accent)] shadow-xs'
              : 'border-transparent text-[#605E5C] hover:border-[#E1DFDD] hover:bg-white hover:text-[#181917]'
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {menuOpen && (
          <div
            data-capture-ignore="true"
            className="absolute left-0 top-full mt-1.5 w-72 rounded-lg border border-[#D2D0CE] bg-white shadow-xl py-1.5 z-40 text-[#252423]"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCreateProject();
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-[var(--theme-accent)] hover:bg-[#F3F2F1] transition-colors"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span>{t.newProjectInTab}</span>
            </button>

            {unopenedProjects.length > 0 && (
              <>
                <div className="my-1 border-t border-[#EDEBE9]" />
                <div className="px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#787A74]">
                  {t.openProject}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {unopenedProjects.map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenProjectInTab(proj.id);
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-1.5 text-left text-xs text-[#181917] hover:bg-[#F3F2F1] transition-colors"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${getStatusDotColor(proj.status)}`}
                      />
                      <span className="font-mono text-[10.5px] font-semibold text-[var(--theme-accent)] shrink-0 tabular-nums">
                        {proj.code}
                      </span>
                      <span className="truncate">{proj.title || t.untitled}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {unopenedProjects.length === 0 && projects.length > 0 && (
              <div className="border-t border-[#EDEBE9] px-3.5 py-2 text-[11px] text-[#787A74]">
                {t.allAlreadyOpen}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 pb-1 shrink-0">
        {onSelectOverview && (
          <button
            type="button"
            onClick={onSelectOverview}
            className="hidden sm:inline-flex items-center rounded-md border border-transparent px-2.5 py-1 text-[11px] font-medium text-[#605E5C] hover:border-[#E1DFDD] hover:bg-white hover:text-[#181917] transition-colors whitespace-nowrap"
          >
            {t.allProjects}
          </button>
        )}

        {openProjects.length >= 2 && (
          <button
            type="button"
            onClick={onCloseAllTabs}
            className="rounded-md border border-transparent px-2.5 py-1 text-[11px] font-medium text-[#605E5C] hover:border-[#E1DFDD] hover:bg-white hover:text-[#B91C1C] transition-colors whitespace-nowrap"
            title={t.closeAllTitle}
          >
            {t.closeTabs}
          </button>
        )}
      </div>
    </div>
  );
}
