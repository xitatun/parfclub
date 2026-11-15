import type { AppLanguage, ThemeColorKey } from '../types/perfume';

export function tr<T>(lang: AppLanguage, dict: Record<AppLanguage, T>): T {
  return dict[lang];
}

export const LANGUAGE_OPTIONS: {
  key: AppLanguage;
  title: string;
  sub: Record<AppLanguage, string>;
}[] = [
  {
    key: 'ru',
    title: 'Русский',
    sub: {
      ru: 'Основной язык мастерской',
      en: 'Russian interface',
      it: 'Interfaccia in russo',
      es: 'Interfaz en ruso',
      de: 'Russische Oberfläche',
    },
  },
  {
    key: 'en',
    title: 'English',
    sub: {
      ru: 'Международный интерфейс',
      en: 'International UI shell',
      it: 'Interfaccia internazionale',
      es: 'Interfaz internacional',
      de: 'Internationale Oberfläche',
    },
  },
  {
    key: 'it',
    title: 'Italiano',
    sub: {
      ru: 'Итальянский интерфейс',
      en: 'Italian interface',
      it: 'Interfaccia in italiano',
      es: 'Interfaz en italiano',
      de: 'Italienische Oberfläche',
    },
  },
  {
    key: 'es',
    title: 'Español',
    sub: {
      ru: 'Испанский интерфейс',
      en: 'Spanish interface',
      it: 'Interfaccia in spagnolo',
      es: 'Interfaz en español',
      de: 'Spanische Oberfläche',
    },
  },
  {
    key: 'de',
    title: 'Deutsch',
    sub: {
      ru: 'Немецкий интерфейс',
      en: 'German interface',
      it: 'Interfaccia in tedesco',
      es: 'Interfaz en alemán',
      de: 'Deutsche Oberfläche',
    },
  },
];

export const THEME_COLOR_OPTIONS: {
  key: ThemeColorKey;
  labelRu: string;
  labelEn: string;
  labels: Record<AppLanguage, string>;
  swatchClass: string;
  hex: string;
}[] = [
  {
    key: 'cobalt',
    labelRu: 'Классический синий (Word)',
    labelEn: 'Classic Blue (Word)',
    labels: {
      ru: 'Классический синий (Word)',
      en: 'Classic Blue (Word)',
      it: 'Blu Classico (Word)',
      es: 'Azul Clásico (Word)',
      de: 'Klassisches Blau (Word)',
    },
    swatchClass: 'bg-[#185ABD]',
    hex: '#185ABD',
  },
  {
    key: 'emerald',
    labelRu: 'Ботанический изумрудный',
    labelEn: 'Botanical Emerald',
    labels: {
      ru: 'Ботанический изумрудный',
      en: 'Botanical Emerald',
      it: 'Smeraldo Botanico',
      es: 'Esmeralda Botánica',
      de: 'Botanisches Smaragdgrün',
    },
    swatchClass: 'bg-[#107C41]',
    hex: '#107C41',
  },
  {
    key: 'plum',
    labelRu: 'Ирисовый сливовый',
    labelEn: 'Iris Plum',
    labels: {
      ru: 'Ирисовый сливовый',
      en: 'Iris Plum',
      it: 'Prugna Iris',
      es: 'Ciruela Iris',
      de: 'Iris-Pflaume',
    },
    swatchClass: 'bg-[#6B21A8]',
    hex: '#6B21A8',
  },
  {
    key: 'terracotta',
    labelRu: 'Смолистый янтарный',
    labelEn: 'Resin Amber',
    labels: {
      ru: 'Смолистый янтарный',
      en: 'Resin Amber',
      it: 'Ambra Resinosa',
      es: 'Ámbar Resinoso',
      de: 'Harz-Bernstein',
    },
    swatchClass: 'bg-[#B45309]',
    hex: '#B45309',
  },
  {
    key: 'slate',
    labelRu: 'Графитовый минимализм',
    labelEn: 'Graphite Minimal',
    labels: {
      ru: 'Графитовый минимализм',
      en: 'Graphite Minimal',
      it: 'Grafite Minimale',
      es: 'Grafito Minimal',
      de: 'Graphit Minimal',
    },
    swatchClass: 'bg-[#323130]',
    hex: '#323130',
  },
];

export const UI_TEXT: Record<
  AppLanguage,
  {
    brand: string;
    untitled: string;
    homeProjectsTitle: string;
    ingredientsTitle: string;
    budgetTitle: string;
    statisticsTitle: string;
    salesTitle: string;
    dilutionTitle: string;
    save: string;
    open: string;
    print: string;
    undo: string;
    redo: string;
    fileTab: string;
    ribbonHome: string;
    ribbonOlfactory: string;
    ribbonJournal: string;
    ribbonDilution: string;
    ribbonIngredients: string;
    ribbonBudget: string;
    ribbonStatistics: string;
    ribbonSales: string;
    ribbonView: string;
    newProject: string;
    copyProject: string;
    deleteProject: string;
    navPane: string;
    zoom: string;
    projectsCount: string;
    ingredientsCount: string;
    historyLabel: string;
    undos: string;
    redos: string;
    navTitle: string;
    navSearchPlaceholder: string;
    navSections: string;
    navAllProjects: string;
    navIngredients: string;
    navDilution: string;
    navBudget: string;
    navStatistics: string;
    navSales: string;
    navProjectsList: string;
    navNoMatches: string;
    viewCleanSheet: string;
    viewFullWidth: string;
    viewReset: string;
    viewShowNav: string;
    viewShowStatus: string;
    viewShowDescriptions: string;
    viewShowMetrics: string;
    viewShowExtraCols: string;
    viewShowUrlBar: string;
    lightMode: string;
    darkMode: string;
    toggleColorMode: string;
    quickSearchIngredients: string;
    projectHistoryPane: string;
  }
> = {
  ru: {
    brand: 'Ателье Эссенций',
    untitled: 'Без названия',
    homeProjectsTitle: 'Проекты мастерской',
    ingredientsTitle: 'База ингредиентов',
    budgetTitle: 'Смета и журнал закупок',
    statisticsTitle: 'Статистика мастерской',
    salesTitle: 'Статистика продаж',
    dilutionTitle: 'Калькулятор разбавления ингредиентов',
    save: 'Сохранить',
    open: 'Открыть',
    print: 'Печать',
    undo: 'Отменить',
    redo: 'Вернуть',
    fileTab: 'Файл',
    ribbonHome: 'Проекты',
    ribbonOlfactory: 'Ольфакторная карта',
    ribbonJournal: 'Записи и пробы',
    ribbonDilution: 'Разбавление',
    ribbonIngredients: 'Ингредиенты',
    ribbonBudget: 'Смета и закупки',
    ribbonStatistics: 'Статистика',
    ribbonSales: 'Статистика продаж',
    ribbonView: 'Вид',
    newProject: 'Новый проект',
    copyProject: 'Копия',
    deleteProject: 'Удалить',
    navPane: 'Навигация',
    zoom: 'Масштаб:',
    projectsCount: 'Проектов',
    ingredientsCount: 'Ингредиентов',
    historyLabel: 'История правок',
    undos: 'отмен',
    redos: 'возвратов',
    navTitle: 'Навигация',
    navSearchPlaceholder: 'Поиск в документе...',
    navSections: 'Разделы мастерской',
    navAllProjects: 'Все проекты',
    navIngredients: 'База ингредиентов',
    navDilution: 'Калькулятор разбавления',
    navBudget: 'Смета и закупки',
    navStatistics: 'Статистика',
    navSales: 'Статистика продаж',
    navProjectsList: 'Проекты (заголовки)',
    navNoMatches: 'Совпадений нет',
    viewCleanSheet: 'Чистый лист',
    viewFullWidth: 'Во всю ширину',
    viewReset: 'Сбросить вид',
    viewShowNav: 'Панель навигации слева',
    viewShowStatus: 'Нижняя строка состояния',
    viewShowDescriptions: 'Подзаголовки разделов',
    viewShowMetrics: 'Сводка метрик в проекте',
    viewShowExtraCols: 'Доп. колонки сырья (CAS, IFRA, полка)',
    viewShowUrlBar: 'Панель магазина и ссылки в сырье',
    lightMode: 'Светлая тема',
    darkMode: 'Тёмная тема',
    toggleColorMode: 'Переключить светлую/тёмную тему',
    quickSearchIngredients: 'Поиск ингредиентов',
    projectHistoryPane: 'История правок',
  },
  en: {
    brand: 'Atelier Essences',
    untitled: 'Untitled',
    homeProjectsTitle: 'Studio Projects',
    ingredientsTitle: 'Ingredients Database',
    budgetTitle: 'Budgets & Purchases',
    statisticsTitle: 'Studio Statistics',
    salesTitle: 'Sales Statistics',
    dilutionTitle: 'Ingredient Dilution Calculator',
    save: 'Save',
    open: 'Open',
    print: 'Print',
    undo: 'Undo',
    redo: 'Redo',
    fileTab: 'File',
    ribbonHome: 'Projects',
    ribbonOlfactory: 'Olfactory Map',
    ribbonJournal: 'Trials & Notes',
    ribbonDilution: 'Dilution',
    ribbonIngredients: 'Ingredients',
    ribbonBudget: 'Budgets & Orders',
    ribbonStatistics: 'Statistics',
    ribbonSales: 'Sales Stats',
    ribbonView: 'View',
    newProject: 'New Project',
    copyProject: 'Duplicate',
    deleteProject: 'Delete',
    navPane: 'Navigation',
    zoom: 'Zoom:',
    projectsCount: 'Projects',
    ingredientsCount: 'Ingredients',
    historyLabel: 'History',
    undos: 'undo',
    redos: 'redo',
    navTitle: 'Navigation',
    navSearchPlaceholder: 'Search document...',
    navSections: 'Studio Sections',
    navAllProjects: 'All Projects',
    navIngredients: 'Ingredients Database',
    navDilution: 'Dilution Calculator',
    navBudget: 'Budgets & Purchases',
    navStatistics: 'Statistics',
    navSales: 'Sales Statistics',
    navProjectsList: 'Projects (Headings)',
    navNoMatches: 'No matches',
    viewCleanSheet: 'Focus Mode',
    viewFullWidth: 'Full Width',
    viewReset: 'Reset View',
    viewShowNav: 'Left Navigation Pane',
    viewShowStatus: 'Bottom Status Bar',
    viewShowDescriptions: 'Section Subtitles',
    viewShowMetrics: 'Project Metrics Card',
    viewShowExtraCols: 'Extra Raw Material Columns',
    viewShowUrlBar: 'Store & URL Purchase Bar',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    toggleColorMode: 'Toggle light/dark theme',
    quickSearchIngredients: 'Search Ingredients',
    projectHistoryPane: 'Revision History',
  },
  it: {
    brand: 'Atelier Essences',
    untitled: 'Senza titolo',
    homeProjectsTitle: 'Progetti dello Studio',
    ingredientsTitle: 'Database Ingredienti',
    budgetTitle: 'Preventivi e Acquisti',
    statisticsTitle: 'Statistiche Studio',
    salesTitle: 'Statistiche Vendite',
    dilutionTitle: 'Calcolatore Diluizione Ingredienti',
    save: 'Salva',
    open: 'Apri',
    print: 'Stampa',
    undo: 'Annulla',
    redo: 'Ripristina',
    fileTab: 'File',
    ribbonHome: 'Progetti',
    ribbonOlfactory: 'Mappa Olfattiva',
    ribbonJournal: 'Prove e Note',
    ribbonDilution: 'Diluizione',
    ribbonIngredients: 'Ingredienti',
    ribbonBudget: 'Budget e Ordini',
    ribbonStatistics: 'Statistiche',
    ribbonSales: 'Vendite',
    ribbonView: 'Visualizza',
    newProject: 'Nuovo Progetto',
    copyProject: 'Duplica',
    deleteProject: 'Elimina',
    navPane: 'Navigazione',
    zoom: 'Zoom:',
    projectsCount: 'Progetti',
    ingredientsCount: 'Ingredienti',
    historyLabel: 'Cronologia',
    undos: 'annulla',
    redos: 'ripristina',
    navTitle: 'Navigazione',
    navSearchPlaceholder: 'Cerca nel documento...',
    navSections: 'Sezioni dello Studio',
    navAllProjects: 'Tutti i Progetti',
    navIngredients: 'Database Ingredienti',
    navDilution: 'Calcolatore Diluizione',
    navBudget: 'Preventivi e Acquisti',
    navStatistics: 'Statistiche',
    navSales: 'Statistiche Vendite',
    navProjectsList: 'Progetti (Titoli)',
    navNoMatches: 'Nessun risultato',
    viewCleanSheet: 'Modalità Focus',
    viewFullWidth: 'Larghezza Piena',
    viewReset: 'Ripristina Vista',
    viewShowNav: 'Pannello di navigazione a sinistra',
    viewShowStatus: 'Barra di stato in basso',
    viewShowDescriptions: 'Sottotitoli delle sezioni',
    viewShowMetrics: 'Riepilogo metriche progetto',
    viewShowExtraCols: 'Colonne extra materie prime (CAS, IFRA)',
    viewShowUrlBar: 'Barra negozio e link d’acquisto',
    lightMode: 'Tema Chiaro',
    darkMode: 'Tema Scuro',
    toggleColorMode: 'Cambia tema chiaro/scuro',
    quickSearchIngredients: 'Cerca Ingredienti',
    projectHistoryPane: 'Cronologia Varianti',
  },
  es: {
    brand: 'Atelier Essences',
    untitled: 'Sin título',
    homeProjectsTitle: 'Proyectos del Taller',
    ingredientsTitle: 'Base de Ingredientes',
    budgetTitle: 'Presupuestos y Compras',
    statisticsTitle: 'Estadísticas del Taller',
    salesTitle: 'Estadísticas de Ventas',
    dilutionTitle: 'Calculadora de Dilución',
    save: 'Guardar',
    open: 'Abrir',
    print: 'Imprimir',
    undo: 'Deshacer',
    redo: 'Rehacer',
    fileTab: 'Archivo',
    ribbonHome: 'Proyectos',
    ribbonOlfactory: 'Mapa Olfativo',
    ribbonJournal: 'Pruebas y Notas',
    ribbonDilution: 'Dilución',
    ribbonIngredients: 'Ingredientes',
    ribbonBudget: 'Presupuesto y Pedidos',
    ribbonStatistics: 'Estadísticas',
    ribbonSales: 'Ventas',
    ribbonView: 'Vista',
    newProject: 'Nuevo Proyecto',
    copyProject: 'Duplicar',
    deleteProject: 'Eliminar',
    navPane: 'Navegación',
    zoom: 'Zoom:',
    projectsCount: 'Proyectos',
    ingredientsCount: 'Ingredientes',
    historyLabel: 'Historial',
    undos: 'deshacer',
    redos: 'rehacer',
    navTitle: 'Navegación',
    navSearchPlaceholder: 'Buscar en el documento...',
    navSections: 'Secciones del Taller',
    navAllProjects: 'Todos los Proyectos',
    navIngredients: 'Base de Ingredientes',
    navDilution: 'Calculadora Dilución',
    navBudget: 'Presupuestos y Compras',
    navStatistics: 'Estadísticas',
    navSales: 'Estadísticas de Ventas',
    navProjectsList: 'Proyectos (Títulos)',
    navNoMatches: 'Sin coincidencias',
    viewCleanSheet: 'Modo Enfoque',
    viewFullWidth: 'Ancho Completo',
    viewReset: 'Restablecer Vista',
    viewShowNav: 'Panel de navegación izquierdo',
    viewShowStatus: 'Barra de estado inferior',
    viewShowDescriptions: 'Subtítulos de sección',
    viewShowMetrics: 'Resumen de métricas del proyecto',
    viewShowExtraCols: 'Columnas extra de materias primas (CAS, IFRA)',
    viewShowUrlBar: 'Barra de tienda y enlace de compra',
    lightMode: 'Tema Claro',
    darkMode: 'Tema Oscuro',
    toggleColorMode: 'Cambiar tema claro/oscuro',
    quickSearchIngredients: 'Buscar Ingredientes',
    projectHistoryPane: 'Historial de Cambios',
  },
  de: {
    brand: 'Atelier Essences',
    untitled: 'Ohne Titel',
    homeProjectsTitle: 'Atelier-Projekte',
    ingredientsTitle: 'Rohstoffdatenbank',
    budgetTitle: 'Budget & Einkäufe',
    statisticsTitle: 'Atelier-Statistik',
    salesTitle: 'Verkaufsstatistik',
    dilutionTitle: 'Verdünnungsrechner',
    save: 'Speichern',
    open: 'Öffnen',
    print: 'Drucken',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    fileTab: 'Datei',
    ribbonHome: 'Projekte',
    ribbonOlfactory: 'Duftpyramide',
    ribbonJournal: 'Notizen & Tests',
    ribbonDilution: 'Verdünnung',
    ribbonIngredients: 'Rohstoffe',
    ribbonBudget: 'Budget & Bestellungen',
    ribbonStatistics: 'Statistik',
    ribbonSales: 'Verkaufszahlen',
    ribbonView: 'Ansicht',
    newProject: 'Neues Projekt',
    copyProject: 'Duplizieren',
    deleteProject: 'Löschen',
    navPane: 'Navigation',
    zoom: 'Zoom:',
    projectsCount: 'Projekte',
    ingredientsCount: 'Rohstoffe',
    historyLabel: 'Verlauf',
    undos: 'rückgängig',
    redos: 'wiederholen',
    navTitle: 'Navigation',
    navSearchPlaceholder: 'Im Dokument suchen...',
    navSections: 'Atelier-Bereiche',
    navAllProjects: 'Alle Projekte',
    navIngredients: 'Rohstoffdatenbank',
    navDilution: 'Verdünnungsrechner',
    navBudget: 'Budget & Einkäufe',
    navStatistics: 'Statistik',
    navSales: 'Verkaufsstatistik',
    navProjectsList: 'Projekte (Titel)',
    navNoMatches: 'Keine Treffer',
    viewCleanSheet: 'Fokusmodus',
    viewFullWidth: 'Volle Breite',
    viewReset: 'Ansicht zurücksetzen',
    viewShowNav: 'Navigationsleiste links',
    viewShowStatus: 'Statusleiste unten',
    viewShowDescriptions: 'Untertitel der Bereiche',
    viewShowMetrics: 'Projektkennzahlen-Leiste',
    viewShowExtraCols: 'Zusatzspalten für Rohstoffe (CAS, IFRA)',
    viewShowUrlBar: 'Shop- & Bestelllink-Leiste',
    lightMode: 'Helles Design',
    darkMode: 'Dunkles Design',
    toggleColorMode: 'Helles/Dunkles Design umschalten',
    quickSearchIngredients: 'Rohstoffe suchen',
    projectHistoryPane: 'Änderungsverlauf',
  },
};
