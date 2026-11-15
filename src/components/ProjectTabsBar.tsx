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

  if (openProjects.length === 0) {
    return null;
  }

  return (
    <div className="print:hidden relative z-20 flex items-end gap-1 bg-[#F3F2F1] border-b border-[#D2D0CE] px-3 pt-1.5 select-none">
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
              className={`group relative flex items-center shrink-0 rounded-t border transition-colors ${
                isActive
                  ? 'bg-white text-[#181917] border-[#D2D0CE] border-b-0 z-10'
                  : 'bg-[#FAF9F8] text-[#605E5C] border-transparent hover:bg-white hover:text-[#181917] hover:border-[#E1DFDD]'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-ink)]"
                />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(proj.id)}
                title={`${proj.code} — ${proj.title}`}
                className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 text-[12px] text-left min-w-0"
              >
                <span
                  className={`font-mono text-[10.5px] font-semibold shrink-0 tabular-nums ${
                    isActive ? 'text-[var(--theme-accent)]' : 'text-[#797775]'
                  }`}
                >
                  {proj.code}
                </span>
                <span className={`truncate max-w-[165px] ${isActive ? 'font-medium' : ''}`}>
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
                    ? 'text-[#605E5C] hover:bg-[#EDEBE9] hover:text-[#181917]'
                    : 'text-[#797775] opacity-70 group-hover:opacity-100 hover:bg-[#EDEBE9] hover:text-[#181917]'
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
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            menuOpen
              ? 'bg-[#E1DFDD] text-[#181917]'
              : 'text-[#605E5C] hover:bg-[#E1DFDD] hover:text-[#181917]'
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-full mt-1 w-64 rounded border border-[#D2D0CE] bg-white shadow-lg py-1 z-40">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCreateProject();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-[var(--theme-accent)] hover:bg-[#FAF9F8]"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span>{t.newProjectInTab}</span>
            </button>

            {unopenedProjects.length > 0 && (
              <>
                <div className="my-1 border-t border-[#E1DFDD]" />
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#797775]">
                  {t.openProject}
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {unopenedProjects.map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenProjectInTab(proj.id);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-[#181917] hover:bg-[#FAF9F8]"
                    >
                      <span className="font-mono text-[10.5px] font-semibold text-[var(--theme-accent)] shrink-0 tabular-nums">
                        {proj.code}
                      </span>
                      <span className="truncate">{proj.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {unopenedProjects.length === 0 && projects.length > 0 && (
              <div className="border-t border-[#E1DFDD] px-3 py-2 text-[11px] text-[#797775]">
                {t.allAlreadyOpen}
              </div>
            )}
          </div>
        )}
      </div>

      {openProjects.length >= 2 && (
        <button
          type="button"
          onClick={onCloseAllTabs}
          className="ml-auto shrink-0 mb-1 rounded px-2 py-0.5 text-[11px] text-[#605E5C] hover:bg-[#E1DFDD] hover:text-[#181917] transition-colors"
          title={t.closeAllTitle}
        >
          {t.closeTabs}
        </button>
      )}
    </div>
  );
}
