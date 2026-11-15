import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  GitCompareArrows,
  History,
  Layers,
  NotebookPen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { getNoteTierShort } from '../data/constants';
import { tr } from '../data/i18n';
import type {
  AppCurrency,
  AppLanguage,
  FormulaComponent,
  PerfumeProject,
  ProjectFormulaVariant,
  ProjectRevision,
} from '../types/perfume';
import {
  calculateFormulaSummary,
  formatCurrencyRub,
  formatGrams,
  formatPercent,
} from '../utils/calculations';
import {
  compareFormulaComponents,
  formatCurrentTimeHHMM,
  getNextRevisionVersionCode,
} from '../utils/revisions';
import { generateId, todayIsoDate } from '../utils/storage';

interface ProjectHistoryPaneProps {
  open: boolean;
  onClose: () => void;
  project: PerfumeProject;
  onUpdateProject: (updated: PerfumeProject) => void;
  onToast?: (msg: string) => void;
  language?: AppLanguage;
  currency?: AppCurrency;
  activePaneTab?: 'history' | 'variants';
  onChangePaneTab?: (tab: 'history' | 'variants') => void;
}

interface HistoryPaneText {
  title: string;
  closeAria: string;
  variationsCount: (n: number) => string;
  unsavedChangesTitle: (ver: string) => string;
  matchesLatestTitle: (ver: string) => string;
  noBaselineYet: string;
  showLiveDiff: string;
  hideLiveDiff: string;
  newVariationHeading: string;
  titlePlaceholder: (ver: string) => string;
  notesPlaceholder: string;
  saveVariationBtn: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDesc: string;
  createBaselineBtn: string;
  noSearchMatches: string;
  baselineTag: string;
  componentsShort: (n: number) => string;
  changesVsPrev: (ver: string) => string;
  noDiffVsPrev: string;
  compareWithCurrentBtn: string;
  comparingWithCurrent: string;
  identicalToCurrent: string;
  compositionBtn: string;
  restoreBtn: string;
  restoreConfirmPrompt: string;
  saveAndRestoreBtn: string;
  restoreOnlyBtn: string;
  cancelBtn: string;
  deleteAria: string;
  deleteConfirmBtn: string;
  notesHeading: string;
  addNoteBtn: string;
  editNoteBtn: string;
  saveNoteBtn: string;
  emptyNoteText: string;
  editTitleAria: string;
  saveTitleBtn: string;
  addedLabel: string;
  removedLabel: string;
  modifiedLabel: string;
  savedToast: (ver: string) => string;
  restoredToast: (ver: string) => string;
  noteSavedToast: (ver: string) => string;
  baselineDefaultTitle: string;
  variationDefaultTitle: (ver: string) => string;
  autoSavedBeforeRestore: (ver: string) => string;
}

const HISTORY_TEXT: Record<AppLanguage, HistoryPaneText> = {
  ru: {
    title: 'История правок',
    closeAria: 'Закрыть историю правок',
    variationsCount: (n) => `${n} вар.`,
    unsavedChangesTitle: (ver) => `Текущий состав отличается от ${ver}`,
    matchesLatestTitle: (ver) => `Текущий состав совпадает с ${ver}`,
    noBaselineYet: 'Вариации ещё не зафиксированы — сохраните текущую формулу как базу.',
    showLiveDiff: 'Что изменилось',
    hideLiveDiff: 'Скрыть отличия',
    newVariationHeading: 'Зафиксировать вариацию состава',
    titlePlaceholder: (ver) => `Название правки (напр. ${ver} — мягче кедр)`,
    notesPlaceholder: 'Запись по вариации: что изменили, зачем и как звучит на блоттере...',
    saveVariationBtn: 'Сохранить вариацию',
    searchPlaceholder: 'Поиск по заметкам, версиям, компонентам...',
    emptyTitle: 'Вариаций состава пока нет',
    emptyDesc: 'Сохраняйте снимки формулы при каждой доработке, чтобы сравнивать пропорции и вести записи по каждой версии.',
    createBaselineBtn: 'Зафиксировать текущую (v1.0)',
    noSearchMatches: 'Нет вариаций по вашему запросу.',
    baselineTag: 'База',
    componentsShort: (n) => `${n} комп.`,
    changesVsPrev: (ver) => `Отличия от ${ver}`,
    noDiffVsPrev: 'Состав идентичен предыдущей версии',
    compareWithCurrentBtn: 'Сравнить с текущей',
    comparingWithCurrent: 'Сравнение с текущей формулой',
    identicalToCurrent: 'Полностью совпадает с текущей формулой',
    compositionBtn: 'Состав',
    restoreBtn: 'Применить',
    restoreConfirmPrompt: 'Текущая формула не зафиксирована. Сохранить её перед применением?',
    saveAndRestoreBtn: 'Сохранить и применить',
    restoreOnlyBtn: 'Только применить',
    cancelBtn: 'Отмена',
    deleteAria: 'Удалить вариацию',
    deleteConfirmBtn: 'Удалить',
    notesHeading: 'Запись по вариации',
    addNoteBtn: 'Добавить запись',
    editNoteBtn: 'Изменить',
    saveNoteBtn: 'Сохранить запись',
    emptyNoteText: 'Записи пока нет — добавьте заметку о балансе и пробах этой вариации.',
    editTitleAria: 'Переименовать вариацию',
    saveTitleBtn: 'Ок',
    addedLabel: 'добавл.',
    removedLabel: 'удал.',
    modifiedLabel: 'измен.',
    savedToast: (ver) => `Вариация ${ver} сохранена в историю`,
    restoredToast: (ver) => `Состав вариации ${ver} применён к проекту`,
    noteSavedToast: (ver) => `Запись для ${ver} сохранена`,
    baselineDefaultTitle: 'Исходная формула',
    variationDefaultTitle: (ver) => `Вариация ${ver}`,
    autoSavedBeforeRestore: (ver) => `Автосохранение перед переходом на ${ver}`,
  },
  en: {
    title: 'Revision History',
    closeAria: 'Close revision history',
    variationsCount: (n) => `${n} var.`,
    unsavedChangesTitle: (ver) => `Active formula differs from ${ver}`,
    matchesLatestTitle: (ver) => `Active formula matches ${ver}`,
    noBaselineYet: 'No formula variations saved yet — capture the active formula as a baseline.',
    showLiveDiff: 'Show changes',
    hideLiveDiff: 'Hide changes',
    newVariationHeading: 'Capture Formula Variation',
    titlePlaceholder: (ver) => `Revision title (e.g. ${ver} — softer cedar)`,
    notesPlaceholder: 'Variation notes: what changed, why, and blotter evaluation...',
    saveVariationBtn: 'Save Variation',
    searchPlaceholder: 'Search notes, versions, ingredients...',
    emptyTitle: 'No formula variations yet',
    emptyDesc: 'Save formula snapshots as you iterate to compare ingredient weights and keep notes for each variation.',
    createBaselineBtn: 'Capture Current (v1.0)',
    noSearchMatches: 'No variations match your search.',
    baselineTag: 'Base',
    componentsShort: (n) => `${n} ingr.`,
    changesVsPrev: (ver) => `Changes vs ${ver}`,
    noDiffVsPrev: 'Same composition as previous variation',
    compareWithCurrentBtn: 'Compare to live',
    comparingWithCurrent: 'Comparison with active formula',
    identicalToCurrent: 'Identical to the active formula',
    compositionBtn: 'Formula',
    restoreBtn: 'Apply',
    restoreConfirmPrompt: 'Active formula has unsaved changes. Snapshot it before applying?',
    saveAndRestoreBtn: 'Snapshot & Apply',
    restoreOnlyBtn: 'Apply Only',
    cancelBtn: 'Cancel',
    deleteAria: 'Delete variation',
    deleteConfirmBtn: 'Delete',
    notesHeading: 'Variation Notes',
    addNoteBtn: 'Add note',
    editNoteBtn: 'Edit',
    saveNoteBtn: 'Save note',
    emptyNoteText: 'No notes yet — record balance observations or blotter trials for this variation.',
    editTitleAria: 'Rename variation',
    saveTitleBtn: 'Save',
    addedLabel: 'added',
    removedLabel: 'removed',
    modifiedLabel: 'changed',
    savedToast: (ver) => `Variation ${ver} saved to history`,
    restoredToast: (ver) => `Applied variation ${ver} composition to project`,
    noteSavedToast: (ver) => `Saved notes for ${ver}`,
    baselineDefaultTitle: 'Initial Formula',
    variationDefaultTitle: (ver) => `Variation ${ver}`,
    autoSavedBeforeRestore: (ver) => `Auto-saved before switching to ${ver}`,
  },
  it: {
    title: 'Cronologia Varianti',
    closeAria: 'Chiudi cronologia varianti',
    variationsCount: (n) => `${n} var.`,
    unsavedChangesTitle: (ver) => `La formula attiva differisce da ${ver}`,
    matchesLatestTitle: (ver) => `La formula attiva corrisponde a ${ver}`,
    noBaselineYet: 'Nessuna variante salvata — registra la formula attuale come base.',
    showLiveDiff: 'Mostra modifiche',
    hideLiveDiff: 'Nascondi modifiche',
    newVariationHeading: 'Salva Variante Formula',
    titlePlaceholder: (ver) => `Titolo variante (es. ${ver} — cedro più morbido)`,
    notesPlaceholder: 'Note sulla variante: cosa è cambiato, perché e prova su mouillette...',
    saveVariationBtn: 'Salva Variante',
    searchPlaceholder: 'Cerca note, versioni, ingredienti...',
    emptyTitle: 'Nessuna variante registrata',
    emptyDesc: 'Salva istantanee della formula durante le modifiche per confrontare le dosi e annotare ogni variante.',
    createBaselineBtn: 'Registra Attuale (v1.0)',
    noSearchMatches: 'Nessuna variante trovata.',
    baselineTag: 'Base',
    componentsShort: (n) => `${n} ingr.`,
    changesVsPrev: (ver) => `Differenze rispetto a ${ver}`,
    noDiffVsPrev: 'Composizione identica alla variante precedente',
    compareWithCurrentBtn: 'Confronta con attiva',
    comparingWithCurrent: 'Confronto con formula attiva',
    identicalToCurrent: 'Identica alla formula attiva',
    compositionBtn: 'Composizione',
    restoreBtn: 'Applica',
    restoreConfirmPrompt: 'La formula attiva ha modifiche non salvate. Salvarla prima di applicare?',
    saveAndRestoreBtn: 'Salva e Applica',
    restoreOnlyBtn: 'Solo Applica',
    cancelBtn: 'Annulla',
    deleteAria: 'Elimina variante',
    deleteConfirmBtn: 'Elimina',
    notesHeading: 'Note sulla Variante',
    addNoteBtn: 'Aggiungi nota',
    editNoteBtn: 'Modifica',
    saveNoteBtn: 'Salva nota',
    emptyNoteText: 'Nessuna nota — aggiungi osservazioni su equilibrio e prove per questa variante.',
    editTitleAria: 'Rinomina variante',
    saveTitleBtn: 'Ok',
    addedLabel: 'agg.',
    removedLabel: 'rim.',
    modifiedLabel: 'mod.',
    savedToast: (ver) => `Variante ${ver} salvata nella cronologia`,
    restoredToast: (ver) => `Composizione della variante ${ver} applicata al progetto`,
    noteSavedToast: (ver) => `Nota per ${ver} salvata`,
    baselineDefaultTitle: 'Formula Iniziale',
    variationDefaultTitle: (ver) => `Variante ${ver}`,
    autoSavedBeforeRestore: (ver) => `Salvataggio automatico prima di passare a ${ver}`,
  },
  es: {
    title: 'Historial de Cambios',
    closeAria: 'Cerrar historial de cambios',
    variationsCount: (n) => `${n} var.`,
    unsavedChangesTitle: (ver) => `La fórmula actual difiere de ${ver}`,
    matchesLatestTitle: (ver) => `La fórmula actual coincide con ${ver}`,
    noBaselineYet: 'Aún no hay variaciones guardadas — registra la fórmula actual como base.',
    showLiveDiff: 'Ver cambios',
    hideLiveDiff: 'Ocultar cambios',
    newVariationHeading: 'Guardar Variación de Fórmula',
    titlePlaceholder: (ver) => `Título (ej. ${ver} — cedro más suave)`,
    notesPlaceholder: 'Notas de la variación: qué cambió, motivo y prueba en secante...',
    saveVariationBtn: 'Guardar Variación',
    searchPlaceholder: 'Buscar notas, versiones, ingredientes...',
    emptyTitle: 'Sin variaciones de fórmula',
    emptyDesc: 'Guarda instantáneas de la fórmula en cada ajuste para comparar dosis y llevar notas por cada versión.',
    createBaselineBtn: 'Guardar Actual (v1.0)',
    noSearchMatches: 'No hay variaciones que coincidan.',
    baselineTag: 'Base',
    componentsShort: (n) => `${n} ingr.`,
    changesVsPrev: (ver) => `Cambios respecto a ${ver}`,
    noDiffVsPrev: 'Misma composición que la variación anterior',
    compareWithCurrentBtn: 'Comparar con actual',
    comparingWithCurrent: 'Comparación con la fórmula actual',
    identicalToCurrent: 'Idéntica a la fórmula actual',
    compositionBtn: 'Composición',
    restoreBtn: 'Aplicar',
    restoreConfirmPrompt: 'La fórmula actual tiene cambios sin guardar. ¿Guardarla antes de aplicar?',
    saveAndRestoreBtn: 'Guardar y Aplicar',
    restoreOnlyBtn: 'Solo Aplicar',
    cancelBtn: 'Cancelar',
    deleteAria: 'Eliminar variación',
    deleteConfirmBtn: 'Eliminar',
    notesHeading: 'Notas de la Variación',
    addNoteBtn: 'Añadir nota',
    editNoteBtn: 'Editar',
    saveNoteBtn: 'Guardar nota',
    emptyNoteText: 'Sin notas aún — registra impresiones y ajustes sobre esta variación.',
    editTitleAria: 'Renombrar variación',
    saveTitleBtn: 'Ok',
    addedLabel: 'añad.',
    removedLabel: 'elim.',
    modifiedLabel: 'mod.',
    savedToast: (ver) => `Variación ${ver} guardada en el historial`,
    restoredToast: (ver) => `Composición de la variación ${ver} aplicada al proyecto`,
    noteSavedToast: (ver) => `Nota guardada para ${ver}`,
    baselineDefaultTitle: 'Fórmula Inicial',
    variationDefaultTitle: (ver) => `Variación ${ver}`,
    autoSavedBeforeRestore: (ver) => `Guardado automático antes de cambiar a ${ver}`,
  },
  de: {
    title: 'Änderungsverlauf',
    closeAria: 'Änderungsverlauf schließen',
    variationsCount: (n) => `${n} Var.`,
    unsavedChangesTitle: (ver) => `Aktuelle Formel weicht von ${ver} ab`,
    matchesLatestTitle: (ver) => `Aktuelle Formel entspricht ${ver}`,
    noBaselineYet: 'Noch keine Varianten gespeichert — sichern Sie die aktuelle Formel als Basis.',
    showLiveDiff: 'Änderungen zeigen',
    hideLiveDiff: 'Änderungen verbergen',
    newVariationHeading: 'Formelvariante erfassen',
    titlePlaceholder: (ver) => `Variantenname (z. B. ${ver} — weichere Zeder)`,
    notesPlaceholder: 'Notizen zu dieser Variante: Was wurde geändert, warum, Streifentest...',
    saveVariationBtn: 'Variante speichern',
    searchPlaceholder: 'Notizen, Versionen, Rohstoffe suchen...',
    emptyTitle: 'Noch keine Formelvarianten',
    emptyDesc: 'Speichern Sie bei jeder Anpassung einen Formelstand, um Mischungen zu vergleichen und Notizen pro Variante zu führen.',
    createBaselineBtn: 'Aktuelle sichern (v1.0)',
    noSearchMatches: 'Keine passenden Varianten gefunden.',
    baselineTag: 'Basis',
    componentsShort: (n) => `${n} Komp.`,
    changesVsPrev: (ver) => `Änderungen zu ${ver}`,
    noDiffVsPrev: 'Zusammensetzung identisch zur vorherigen Variante',
    compareWithCurrentBtn: 'Mit aktueller vergleichen',
    comparingWithCurrent: 'Vergleich mit aktueller Formel',
    identicalToCurrent: 'Identisch mit der aktuellen Formel',
    compositionBtn: 'Zusammensetzung',
    restoreBtn: 'Übernehmen',
    restoreConfirmPrompt: 'Aktuelle Formel hat ungesicherte Änderungen. Vorher als Variante speichern?',
    saveAndRestoreBtn: 'Sichern & Übernehmen',
    restoreOnlyBtn: 'Nur übernehmen',
    cancelBtn: 'Abbrechen',
    deleteAria: 'Variante löschen',
    deleteConfirmBtn: 'Löschen',
    notesHeading: 'Notiz zur Variante',
    addNoteBtn: 'Notiz hinzufügen',
    editNoteBtn: 'Bearbeiten',
    saveNoteBtn: 'Notiz speichern',
    emptyNoteText: 'Noch keine Notiz — halten Sie Eindrücke und Test-Ergebnisse zu dieser Variante fest.',
    editTitleAria: 'Variante umbenennen',
    saveTitleBtn: 'Ok',
    addedLabel: 'neu',
    removedLabel: 'entf.',
    modifiedLabel: 'geänd.',
    savedToast: (ver) => `Variante ${ver} im Verlauf gespeichert`,
    restoredToast: (ver) => `Zusammensetzung von ${ver} auf das Projekt angewendet`,
    noteSavedToast: (ver) => `Notiz für ${ver} gespeichert`,
    baselineDefaultTitle: 'Ausgangsformel',
    variationDefaultTitle: (ver) => `Variante ${ver}`,
    autoSavedBeforeRestore: (ver) => `Automatisch vor Wechsel zu ${ver} gesichert`,
  },
};

export function ProjectHistoryPane({
  open,
  onClose,
  project,
  onUpdateProject,
  onToast,
  language = 'ru',
  currency = 'RUB',
  activePaneTab,
  onChangePaneTab,
}: ProjectHistoryPaneProps) {
  const t = HISTORY_TEXT[language];
  const gUnit = language === 'ru' ? 'г' : 'g';

  const [internalTab, setInternalTab] = useState<'history' | 'variants'>('history');
  const currentTab = activePaneTab ?? internalTab;
  const setCurrentTab = (tab: 'history' | 'variants') => {
    setInternalTab(tab);
    onChangePaneTab?.(tab);
  };

  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveDiff, setShowLiveDiff] = useState(false);

  const [expandedCompositionIds, setExpandedCompositionIds] = useState<Record<string, boolean>>({});
  const [comparingRevisionId, setComparingRevisionId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Variants tab state
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantNotes, setNewVariantNotes] = useState('');
  const [editingVariantTitleId, setEditingVariantTitleId] = useState<string | null>(null);
  const [variantTitleDraft, setVariantTitleDraft] = useState('');
  const [editingVariantNoteId, setEditingVariantNoteId] = useState<string | null>(null);
  const [variantNoteDraft, setVariantNoteDraft] = useState('');
  const [showVariantsComparison, setShowVariantsComparison] = useState(true);

  const revisions = useMemo(() => project.revisions || [], [project.revisions]);
  const variants = useMemo(() => project.variants || [], [project.variants]);
  const latestRevision = revisions[0] || null;
  const nextVersionCode = useMemo(() => getNextRevisionVersionCode(revisions), [revisions]);

  const nextVariantDefaultLabel = useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const idx = variants.length;
    const letter = idx < alphabet.length ? alphabet[idx] : `${idx + 1}`;
    return tr(language, {
      ru: `Вариант ${letter}`,
      en: `Variant ${letter}`,
      it: `Variante ${letter}`,
      es: `Variante ${letter}`,
      de: `Variante ${letter}`,
    });
  }, [variants.length, language]);

  const liveDiff = useMemo(() => {
    if (!latestRevision) return null;
    return compareFormulaComponents(latestRevision.components, project.components);
  }, [latestRevision, project.components]);

  const hasUnsavedChanges = useMemo(() => {
    if (!latestRevision) return project.components.length > 0;
    return Boolean(liveDiff?.hasChanges);
  }, [latestRevision, liveDiff, project.components.length]);

  const filteredRevisions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return revisions;
    return revisions.filter(
      (rev) =>
        rev.versionCode.toLowerCase().includes(q) ||
        rev.title.toLowerCase().includes(q) ||
        rev.notes.toLowerCase().includes(q) ||
        rev.components.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [revisions, searchQuery]);

  const handleCreateVariant = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newVariantName.trim() || nextVariantDefaultLabel;
    const created: ProjectFormulaVariant = {
      id: generateId('var'),
      name,
      createdAt: `${todayIsoDate()} ${formatCurrentTimeHHMM()}`,
      targetConcentration: project.targetConcentration,
      targetBottleMl: project.targetBottleMl,
      components: structuredClone(project.components),
      notes: newVariantNotes.trim(),
    };
    onUpdateProject({
      ...project,
      variants: [...variants, created],
    });
    setNewVariantName('');
    setNewVariantNotes('');
    onToast?.(
      tr(language, {
        ru: `Создан «${name}»`,
        en: `Created "${name}"`,
        it: `Creato "${name}"`,
        es: `Creado "${name}"`,
        de: `„${name}“ erstellt`,
      })
    );
  };

  const handleDuplicateVariant = (source: ProjectFormulaVariant) => {
    const copyName = `${source.name} (${tr(language, {
      ru: 'копия',
      en: 'copy',
      it: 'copia',
      es: 'copia',
      de: 'Kopie',
    })})`;
    const copy: ProjectFormulaVariant = {
      ...structuredClone(source),
      id: generateId('var'),
      name: copyName,
      createdAt: `${todayIsoDate()} ${formatCurrentTimeHHMM()}`,
    };
    onUpdateProject({
      ...project,
      variants: [...variants, copy],
    });
    onToast?.(
      tr(language, {
        ru: `Скопирован вариант «${copyName}»`,
        en: `Duplicated variant "${copyName}"`,
        it: `Duplicata variante "${copyName}"`,
        es: `Variante duplicada "${copyName}"`,
        de: `Variante „${copyName}“ dupliziert`,
      })
    );
  };

  const handleDeleteVariant = (variantId: string) => {
    onUpdateProject({
      ...project,
      variants: variants.filter((v) => v.id !== variantId),
    });
  };

  const handleSaveVariantTitle = (variantId: string) => {
    const clean = variantTitleDraft.trim();
    if (!clean) {
      setEditingVariantTitleId(null);
      return;
    }
    onUpdateProject({
      ...project,
      variants: variants.map((v) => (v.id === variantId ? { ...v, name: clean } : v)),
    });
    setEditingVariantTitleId(null);
  };

  const handleSaveVariantNote = (variantId: string) => {
    onUpdateProject({
      ...project,
      variants: variants.map((v) =>
        v.id === variantId ? { ...v, notes: variantNoteDraft.trim() } : v
      ),
    });
    setEditingVariantNoteId(null);
  };

  const handleApplyVariantToFormula = (variant: ProjectFormulaVariant) => {
    onUpdateProject({
      ...project,
      targetConcentration: variant.targetConcentration,
      targetBottleMl: variant.targetBottleMl,
      components: structuredClone(variant.components),
    });
    onToast?.(
      tr(language, {
        ru: `Вариант «${variant.name}» загружен в рабочую формулу`,
        en: `Loaded "${variant.name}" into active formula`,
        it: `Variante "${variant.name}" caricata nella formula attiva`,
        es: `Variante "${variant.name}" cargada en la fórmula activa`,
        de: `Variante „${variant.name}“ in aktive Formel geladen`,
      })
    );
  };

  const handleSyncVariantFromActive = (variantId: string) => {
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;
    onUpdateProject({
      ...project,
      variants: variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              targetConcentration: project.targetConcentration,
              targetBottleMl: project.targetBottleMl,
              components: structuredClone(project.components),
            }
          : v
      ),
    });
    onToast?.(
      tr(language, {
        ru: `Состав «${target.name}» обновлён из текущей формулы`,
        en: `Updated "${target.name}" from active formula`,
        it: `Aggiornato "${target.name}" dalla formula attiva`,
        es: `Actualizado "${target.name}" desde la fórmula activa`,
        de: `„${target.name}“ aus aktiver Formel aktualisiert`,
      })
    );
  };

  const handleUpdateVariantComponentWeight = (
    variantId: string,
    componentId: string,
    newWeightGrams: number
  ) => {
    const safeWeight = Math.max(0, Number.isFinite(newWeightGrams) ? newWeightGrams : 0);
    onUpdateProject({
      ...project,
      variants: variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              components: v.components.map((c) =>
                c.id === componentId ? { ...c, weightGrams: Number(safeWeight.toFixed(3)) } : c
              ),
            }
          : v
      ),
    });
  };

  const handleUpdateVariantComponentPercent = (
    variantId: string,
    componentId: string,
    newPercent: number
  ) => {
    const clampedPct = Math.max(0, Math.min(100, Number.isFinite(newPercent) ? newPercent : 0));
    onUpdateProject({
      ...project,
      variants: variants.map((v) => {
        if (v.id !== variantId) return v;
        const totalWeight = v.components.reduce((s, c) => s + c.weightGrams, 0);
        const baseTotal = totalWeight > 0 ? totalWeight : 10;
        const targetComp = v.components.find((c) => c.id === componentId);
        if (!targetComp) return v;

        const othersWeight = totalWeight - targetComp.weightGrams;
        const newTargetWeight = Number(((clampedPct / 100) * baseTotal).toFixed(3));
        const remainingWeight = Math.max(0, baseTotal - newTargetWeight);

        const nextComponents = v.components.map((c) => {
          if (c.id === componentId) {
            return { ...c, weightGrams: newTargetWeight };
          }
          if (v.components.length === 1) return c;
          if (othersWeight > 0) {
            const scaled = (c.weightGrams / othersWeight) * remainingWeight;
            return { ...c, weightGrams: Number(scaled.toFixed(3)) };
          }
          const evenShare = remainingWeight / Math.max(1, v.components.length - 1);
          return { ...c, weightGrams: Number(evenShare.toFixed(3)) };
        });

        return {
          ...v,
          components: nextComponents,
        };
      }),
    });
  };

  const createRevisionObject = (
    versionCode: string,
    title: string,
    notes: string,
    isBaseline: boolean
  ): ProjectRevision => ({
    id: generateId('rev'),
    versionCode,
    title: title.trim() || (isBaseline ? t.baselineDefaultTitle : t.variationDefaultTitle(versionCode)),
    date: todayIsoDate(),
    createdAtTime: formatCurrentTimeHHMM(),
    targetConcentration: project.targetConcentration,
    targetBottleMl: project.targetBottleMl,
    components: structuredClone(project.components),
    notes: notes.trim(),
    isBaseline,
  });

  const handleSaveVariation = (e: React.FormEvent) => {
    e.preventDefault();
    const isBaseline = revisions.length === 0;
    const rev = createRevisionObject(nextVersionCode, newTitle, newNotes, isBaseline);
    onUpdateProject({
      ...project,
      revisions: [rev, ...revisions],
    });
    setNewTitle('');
    setNewNotes('');
    setShowLiveDiff(false);
    onToast?.(t.savedToast(rev.versionCode));
  };

  const handleQuickCreateBaseline = () => {
    const rev = createRevisionObject('v1.0', t.baselineDefaultTitle, '', true);
    onUpdateProject({
      ...project,
      revisions: [rev, ...revisions],
    });
    onToast?.(t.savedToast('v1.0'));
  };

  const handleSaveNote = (revisionId: string) => {
    const target = revisions.find((r) => r.id === revisionId);
    if (!target) return;
    const updatedRevs = revisions.map((r) =>
      r.id === revisionId ? { ...r, notes: noteDraft.trim() } : r
    );
    onUpdateProject({
      ...project,
      revisions: updatedRevs,
    });
    setEditingNoteId(null);
    onToast?.(t.noteSavedToast(target.versionCode));
  };

  const handleSaveTitle = (revisionId: string) => {
    const clean = titleDraft.trim();
    if (!clean) {
      setEditingTitleId(null);
      return;
    }
    const updatedRevs = revisions.map((r) =>
      r.id === revisionId ? { ...r, title: clean } : r
    );
    onUpdateProject({
      ...project,
      revisions: updatedRevs,
    });
    setEditingTitleId(null);
  };

  const applyRevisionComposition = (rev: ProjectRevision, saveCurrentFirst: boolean) => {
    let nextRevisions = [...revisions];
    if (saveCurrentFirst && hasUnsavedChanges) {
      const autoCode = getNextRevisionVersionCode(nextRevisions);
      const snapshot = createRevisionObject(
        autoCode,
        t.autoSavedBeforeRestore(rev.versionCode),
        '',
        nextRevisions.length === 0
      );
      nextRevisions = [snapshot, ...nextRevisions];
    }

    onUpdateProject({
      ...project,
      targetConcentration: rev.targetConcentration,
      targetBottleMl: rev.targetBottleMl,
      components: structuredClone(rev.components),
      revisions: nextRevisions,
    });
    setRestoreConfirmId(null);
    onToast?.(t.restoredToast(rev.versionCode));
  };

  const handleRequestRestore = (rev: ProjectRevision) => {
    if (hasUnsavedChanges) {
      setRestoreConfirmId(rev.id);
      return;
    }
    applyRevisionComposition(rev, false);
  };

  const handleDeleteRevision = (revisionId: string) => {
    onUpdateProject({
      ...project,
      revisions: revisions.filter((r) => r.id !== revisionId),
    });
    if (comparingRevisionId === revisionId) setComparingRevisionId(null);
    if (editingNoteId === revisionId) setEditingNoteId(null);
    setDeleteConfirmId(null);
  };

  const renderDiffItems = (
    items: ReturnType<typeof compareFormulaComponents>['items'],
    onlyChanged = true
  ) => {
    const list = onlyChanged ? items.filter((i) => i.kind !== 'unchanged') : items;
    if (list.length === 0) return null;

    return (
      <div className="space-y-1">
        {list.map((d) => {
          if (d.kind === 'added') {
            return (
              <div
                key={d.key}
                className="flex items-center justify-between gap-2 rounded bg-[#ECFDF5] px-2 py-1 text-[11px]"
              >
                <span className="truncate font-medium text-[#15803D]">+ {d.name}</span>
                <span className="font-mono text-[#15803D] tabular-nums shrink-0">
                  {d.toWeight.toFixed(2)} {gUnit}
                </span>
              </div>
            );
          }
          if (d.kind === 'removed') {
            return (
              <div
                key={d.key}
                className="flex items-center justify-between gap-2 rounded bg-[#FEF2F2] px-2 py-1 text-[11px]"
              >
                <span className="truncate font-medium text-[#B91C1C] line-through">- {d.name}</span>
                <span className="font-mono text-[#B91C1C] tabular-nums shrink-0">
                  −{d.fromWeight.toFixed(2)} {gUnit}
                </span>
              </div>
            );
          }
          if (d.kind === 'modified') {
            const sign = d.weightDelta > 0 ? '+' : '';
            return (
              <div
                key={d.key}
                className="flex items-center justify-between gap-2 rounded bg-[#FFFBEB] px-2 py-1 text-[11px]"
              >
                <span className="truncate text-[#181917]">{d.name}</span>
                <span className="font-mono text-[#B45309] tabular-nums shrink-0">
                  {d.fromWeight.toFixed(2)} → {d.toWeight.toFixed(2)} {gUnit} ({sign}
                  {d.weightDelta.toFixed(2)})
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderCompositionSummary = (components: FormulaComponent[]) => {
    const sum = calculateFormulaSummary(components);
    return `${formatGrams(sum.totalWeightGrams, 2, language)} · ${formatPercent(
      sum.pureConcentrationPercent,
      1
    )} · ${formatCurrencyRub(sum.totalFormulaCost, language, currency)}`;
  };

  // Build unified component names list for side-by-side variants comparison
  const comparisonRows = useMemo(() => {
    const map = new Map<string, { name: string; tier: FormulaComponent['tier'] }>();
    for (const c of project.components) {
      map.set(c.name.toLowerCase().trim(), { name: c.name, tier: c.tier });
    }
    for (const v of variants) {
      for (const c of v.components) {
        const k = c.name.toLowerCase().trim();
        if (!map.has(k)) {
          map.set(k, { name: c.name, tier: c.tier });
        }
      }
    }
    return Array.from(map.entries()).map(([key, info]) => {
      const activeTotal = project.components.reduce((s, c) => s + c.weightGrams, 0);
      const activeComp = project.components.find((c) => c.name.toLowerCase().trim() === key);
      const activePct =
        activeComp && activeTotal > 0 ? (activeComp.weightGrams / activeTotal) * 100 : 0;

      const byVariantId: Record<string, number> = {};
      for (const v of variants) {
        const vTotal = v.components.reduce((s, c) => s + c.weightGrams, 0);
        const vComp = v.components.find((c) => c.name.toLowerCase().trim() === key);
        byVariantId[v.id] = vComp && vTotal > 0 ? (vComp.weightGrams / vTotal) * 100 : 0;
      }

      return {
        key,
        name: info.name,
        tier: info.tier,
        activePct,
        byVariantId,
      };
    });
  }, [project.components, variants]);

  const paneBody = (
    <div className="flex h-full flex-col bg-white border-l border-[#D2D0CE] text-[#323130]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDEBE9]">
        <div className="flex items-center gap-2 min-w-0">
          {currentTab === 'history' ? (
            <History className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
          ) : (
            <Layers className="h-4 w-4 text-[var(--theme-accent)] shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--theme-accent)] truncate">
              {currentTab === 'history'
                ? t.title
                : tr(language, {
                    ru: 'Варианты формулы',
                    en: 'Formula Variants',
                    it: 'Varianti Formula',
                    es: 'Variantes de Fórmula',
                    de: 'Formelvarianten',
                  })}
            </div>
            <div className="text-[11px] text-[#605E5C] font-mono truncate tabular-nums">
              {project.code} · {t.variationsCount(revisions.length)} ·{' '}
              {tr(language, {
                ru: `${variants.length} пар. вар.`,
                en: `${variants.length} variants`,
                it: `${variants.length} varianti`,
                es: `${variants.length} variantes`,
                de: `${variants.length} Varianten`,
              })}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#252423]"
          title={t.closeAria}
          aria-label={t.closeAria}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tab Switcher: История правок | Варианты */}
      <div className="grid grid-cols-2 gap-1 bg-[#F3F2F1] p-1.5 border-b border-[#EDEBE9]">
        <button
          type="button"
          onClick={() => setCurrentTab('history')}
          className={`inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
            currentTab === 'history'
              ? 'bg-white text-[var(--theme-accent)] shadow-xs'
              : 'text-[#605E5C] hover:text-[#252423] hover:bg-white/50'
          }`}
        >
          <History className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.title}</span>
          <span className="rounded bg-[#EDEBE9] px-1.5 py-0.2 font-mono text-[10px] tabular-nums">
            {revisions.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentTab('variants')}
          className={`inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
            currentTab === 'variants'
              ? 'bg-white text-[var(--theme-accent)] shadow-xs'
              : 'text-[#605E5C] hover:text-[#252423] hover:bg-white/50'
          }`}
        >
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {tr(language, {
              ru: 'Варианты',
              en: 'Variants',
              it: 'Varianti',
              es: 'Variantes',
              de: 'Varianten',
            })}
          </span>
          <span className="rounded bg-[#EDEBE9] px-1.5 py-0.2 font-mono text-[10px] tabular-nums">
            {variants.length}
          </span>
        </button>
      </div>

      {currentTab === 'variants' ? (
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
          {/* Create Parallel Variant Form */}
          <form
            onSubmit={handleCreateVariant}
            className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Параллельный вариант состава',
                  en: 'Parallel Formula Variant',
                  it: 'Variante Parallela della Formula',
                  es: 'Variante Paralela de Fórmula',
                  de: 'Parallele Formelvariante',
                })}
              </span>
              <span className="rounded bg-[#EDEBE9] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--theme-accent)]">
                {nextVariantDefaultLabel}
              </span>
            </div>
            <p className="text-[11px] text-[#605E5C] leading-relaxed">
              {tr(language, {
                ru: 'Создайте несколько вариантов одновременно и меняйте % содержания компонентов в каждом из них для параллельных проб.',
                en: 'Create multiple variants simultaneously and adjust component % in each for side-by-side trials.',
                it: 'Crea più varianti contemporaneamente e regola la % dei componenti in ciascuna per prove parallele.',
                es: 'Crea varias variantes simultáneamente y ajusta el % de componentes en cada una para pruebas paralelas.',
                de: 'Erstellen Sie mehrere Varianten gleichzeitig und passen Sie die %-Anteile der Komponenten für parallele Tests an.',
              })}
            </p>
            <input
              type="text"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              placeholder={tr(language, {
                ru: `Название (напр. ${nextVariantDefaultLabel} — больше бергамота 25%)`,
                en: `Variant name (e.g. ${nextVariantDefaultLabel} — higher bergamot 25%)`,
                it: `Nome variante (es. ${nextVariantDefaultLabel} — più bergamotto 25%)`,
                es: `Nombre de variante (ej. ${nextVariantDefaultLabel} — más bergamota 25%)`,
                de: `Variantenname (z. B. ${nextVariantDefaultLabel} — mehr Bergamotte 25%)`,
              })}
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:outline-none"
            />
            <textarea
              rows={2}
              value={newVariantNotes}
              onChange={(e) => setNewVariantNotes(e.target.value)}
              placeholder={tr(language, {
                ru: 'Заметка по варианту (пропорции, отличие на блоттере)...',
                en: 'Variant notes (proportions, blotter evaluation)...',
                it: 'Note variante (proporzioni, valutazione su mouillette)...',
                es: 'Notas de variante (proporciones, prueba en secante)...',
                de: 'Variantennotizen (Proportionen, Teststreifen)...',
              })}
              className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:outline-none resize-y"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {tr(language, {
                  ru: 'Создать вариант из текущей формулы',
                  en: 'Create Variant from Active Formula',
                  it: 'Crea Variante dalla Formula Attiva',
                  es: 'Crear Variante de la Fórmula Activa',
                  de: 'Variante aus aktiver Formel erstellen',
                })}
              </span>
            </button>
          </form>

          {/* Side-by-Side Component % Matrix */}
          {variants.length > 0 && comparisonRows.length > 0 && (
            <div className="rounded-lg border border-[#E1DFDD] bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowVariantsComparison((v) => !v)}
                className="w-full flex items-center justify-between gap-2 bg-[#FAF9F8] px-3 py-2 text-left text-xs font-semibold text-[#181917] border-b border-[#EDEBE9] hover:bg-[#F3F2F1]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <GitCompareArrows className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>
                    {tr(language, {
                      ru: 'Сравнение % компонентов по вариантам',
                      en: 'Component % Comparison Across Variants',
                      it: 'Confronto % Componenti tra Varianti',
                      es: 'Comparación de % por Variante',
                      de: '%-Vergleich der Komponenten',
                    })}
                  </span>
                </span>
                {showVariantsComparison ? (
                  <ChevronDown className="h-3.5 w-3.5 text-[#605E5C]" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-[#605E5C]" />
                )}
              </button>

              {showVariantsComparison && (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F8] border-b border-[#EDEBE9] text-[#605E5C]">
                        <th className="py-1.5 px-2 text-left font-medium">
                          {tr(language, {
                            ru: 'Компонент',
                            en: 'Component',
                            it: 'Componente',
                            es: 'Componente',
                            de: 'Komponente',
                          })}
                        </th>
                        <th className="py-1.5 px-2 text-right font-mono font-semibold text-[#181917]">
                          {tr(language, {
                            ru: 'Текущ.',
                            en: 'Active',
                            it: 'Attiva',
                            es: 'Actual',
                            de: 'Aktiv',
                          })}
                        </th>
                        {variants.map((v, idx) => (
                          <th
                            key={v.id}
                            className="py-1.5 px-2 text-right font-mono font-semibold text-[var(--theme-accent)] truncate max-w-[72px]"
                            title={v.name}
                          >
                            #{idx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row.key} className="border-b border-[#EDEBE9] last:border-none">
                          <td className="py-1 px-2 truncate max-w-[120px] text-[#181917]" title={row.name}>
                            <span className="font-mono text-[10px] text-[#605E5C] mr-1">
                              {getNoteTierShort(row.tier, language)}
                            </span>
                            {row.name}
                          </td>
                          <td className="py-1 px-2 text-right font-mono tabular-nums text-[#605E5C]">
                            {row.activePct.toFixed(1)}%
                          </td>
                          {variants.map((v) => {
                            const pct = row.byVariantId[v.id] ?? 0;
                            const diff = Math.abs(pct - row.activePct) >= 0.05;
                            return (
                              <td
                                key={v.id}
                                className={`py-1 px-2 text-right font-mono tabular-nums ${
                                  diff
                                    ? 'font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/50'
                                    : 'text-[#323130]'
                                }`}
                              >
                                {pct.toFixed(1)}%
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Variants Cards List */}
          {variants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-4 text-center space-y-2">
              <div className="text-xs font-semibold text-[#181917]">
                {tr(language, {
                  ru: 'Параллельных вариантов пока нет',
                  en: 'No parallel variants yet',
                  it: 'Nessuna variante parallela',
                  es: 'Aún no hay variantes paralelas',
                  de: 'Noch keine parallelen Varianten',
                })}
              </div>
              <p className="text-[11px] text-[#605E5C] leading-relaxed">
                {tr(language, {
                  ru: 'Создайте Вариант A и Вариант B, чтобы тестировать разные проценты содержания компонентов и мгновенно переключаться между ними.',
                  en: 'Create Variant A and Variant B to test different component percentages and switch between them at any time.',
                  it: 'Crea Variante A e Variante B per testare diverse percentuali dei componenti e passare da una all’altra.',
                  es: 'Crea Variante A y Variante B para probar distintos porcentajes de componentes y alternar entre ellos.',
                  de: 'Erstellen Sie Variante A und Variante B, um unterschiedliche Komponenten-Prozentsätze zu testen.',
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((variant, vIdx) => {
                const isEditingTitle = editingVariantTitleId === variant.id;
                const isEditingNote = editingVariantNoteId === variant.id;
                const totalWeight = variant.components.reduce((s, c) => s + c.weightGrams, 0);

                return (
                  <article
                    key={variant.id}
                    className="rounded-lg border border-[#E1DFDD] bg-white p-3 space-y-2.5"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#605E5C]">
                          <span className="rounded bg-[var(--theme-accent-soft)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--theme-accent)]">
                            #{vIdx + 1}
                          </span>
                          <span className="font-mono text-[10px] tabular-nums">
                            {variant.createdAt}
                          </span>
                        </div>

                        {isEditingTitle ? (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="text"
                              value={variantTitleDraft}
                              onChange={(e) => setVariantTitleDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveVariantTitle(variant.id);
                                } else if (e.key === 'Escape') {
                                  setEditingVariantTitleId(null);
                                }
                              }}
                              autoFocus
                              className="flex-1 min-w-0 rounded border border-[var(--theme-accent)] bg-white px-2 py-0.5 text-xs font-semibold text-[#181917] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveVariantTitle(variant.id)}
                              className="rounded bg-[var(--theme-accent)] px-2 py-0.5 text-[11px] font-medium text-white"
                            >
                              {t.saveTitleBtn}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <h3 className="text-xs font-semibold text-[#181917] truncate">
                              {variant.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVariantTitleId(variant.id);
                                setVariantTitleDraft(variant.name);
                              }}
                              className="rounded p-0.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917] shrink-0"
                              title={t.editTitleAria}
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDuplicateVariant(variant)}
                          className="rounded p-1 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917]"
                          title={tr(language, {
                            ru: 'Дублировать вариант',
                            en: 'Duplicate variant',
                            it: 'Duplica variante',
                            es: 'Duplicar variante',
                            de: 'Variante duplizieren',
                          })}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(variant.id)}
                          className="rounded p-1 text-[#605E5C] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                          title={t.deleteAria}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="text-[11px] font-mono text-[#605E5C] tabular-nums">
                      {variant.targetConcentration} · {t.componentsShort(variant.components.length)} ·{' '}
                      {renderCompositionSummary(variant.components)}
                    </div>

                    {/* Editable Component Percentages & Weights Table */}
                    <div className="rounded border border-[#EDEBE9] bg-[#FAF9F8] p-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#605E5C] pb-1 border-b border-[#EDEBE9]">
                        <span>
                          {tr(language, {
                            ru: 'Компонент',
                            en: 'Component',
                            it: 'Componente',
                            es: 'Componente',
                            de: 'Komponente',
                          })}
                        </span>
                        <span>
                          {tr(language, {
                            ru: `Вес (${gUnit}) / Доля (%)`,
                            en: `Weight (${gUnit}) / Share (%)`,
                            it: `Peso (${gUnit}) / Quota (%)`,
                            es: `Peso (${gUnit}) / %`,
                            de: `Gewicht (${gUnit}) / Anteil (%)`,
                          })}
                        </span>
                      </div>

                      {variant.components.length === 0 ? (
                        <div className="py-2 text-center text-[11px] text-[#797775]">
                          {tr(language, {
                            ru: 'Нет компонентов в этом варианте',
                            en: 'No components in this variant',
                            it: 'Nessun componente in questa variante',
                            es: 'Sin componentes en esta variante',
                            de: 'Keine Komponenten in dieser Variante',
                          })}
                        </div>
                      ) : (
                        variant.components.map((comp) => {
                          const pct =
                            totalWeight > 0 ? (comp.weightGrams / totalWeight) * 100 : 0;
                          return (
                            <div
                              key={comp.id}
                              className="flex items-center justify-between gap-2 py-1 text-[11px] border-b border-[#EDEBE9] last:border-none"
                            >
                              <div className="min-w-0 flex-1 truncate" title={comp.name}>
                                <span className="font-mono text-[10px] text-[#605E5C] mr-1">
                                  {getNoteTierShort(comp.tier, language)}
                                </span>
                                <span className="font-medium text-[#181917]">{comp.name}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 font-mono tabular-nums">
                                <label className="inline-flex items-center gap-0.5">
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.05}
                                    value={Number(comp.weightGrams.toFixed(3))}
                                    onChange={(e) =>
                                      handleUpdateVariantComponentWeight(
                                        variant.id,
                                        comp.id,
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="w-14 rounded border border-[#D2D0CE] bg-white px-1 py-0.5 text-right text-[11px] text-[#181917] focus:border-[var(--theme-accent)] focus:outline-none"
                                    title={tr(language, {
                                      ru: 'Вес в граммах',
                                      en: 'Weight in grams',
                                      it: 'Peso in grammi',
                                      es: 'Peso en gramos',
                                      de: 'Gewicht in Gramm',
                                    })}
                                  />
                                  <span className="text-[10px] text-[#605E5C]">{gUnit}</span>
                                </label>

                                <label className="inline-flex items-center gap-0.5">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    value={Number(pct.toFixed(1))}
                                    onChange={(e) =>
                                      handleUpdateVariantComponentPercent(
                                        variant.id,
                                        comp.id,
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="w-13 rounded border border-[var(--theme-accent)]/50 bg-white px-1 py-0.5 text-right text-[11px] font-semibold text-[var(--theme-accent)] focus:border-[var(--theme-accent)] focus:outline-none"
                                    title={tr(language, {
                                      ru: 'Процент содержания в варианте (%)',
                                      en: 'Component percentage in variant (%)',
                                      it: 'Percentuale componente nella variante (%)',
                                      es: 'Porcentaje del componente en la variante (%)',
                                      de: 'Prozentanteil in der Variante (%)',
                                    })}
                                  />
                                  <span className="text-[10px] font-semibold text-[var(--theme-accent)]">
                                    %
                                  </span>
                                </label>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Variant Notes */}
                    <div className="border-t border-[#EDEBE9] pt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#605E5C]">
                          <NotebookPen className="h-3 w-3 text-[var(--theme-accent)]" />
                          <span>{t.notesHeading}</span>
                        </span>
                        {!isEditingNote && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVariantNoteId(variant.id);
                              setVariantNoteDraft(variant.notes || '');
                            }}
                            className="text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                          >
                            {variant.notes ? t.editNoteBtn : t.addNoteBtn}
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={variantNoteDraft}
                            onChange={(e) => setVariantNoteDraft(e.target.value)}
                            className="w-full rounded border border-[var(--theme-accent)] bg-[#FAF9F8] px-2 py-1 text-xs text-[#252423] focus:bg-white focus:outline-none"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingVariantNoteId(null)}
                              className="rounded border border-[#D2D0CE] bg-white px-2 py-0.5 text-[11px] text-[#605E5C]"
                            >
                              {t.cancelBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveVariantNote(variant.id)}
                              className="rounded bg-[var(--theme-accent)] px-2 py-0.5 text-[11px] font-medium text-white"
                            >
                              {t.saveNoteBtn}
                            </button>
                          </div>
                        </div>
                      ) : variant.notes ? (
                        <p className="rounded bg-[#FAF9F8] px-2 py-1 text-xs text-[#323130] whitespace-pre-wrap">
                          {variant.notes}
                        </p>
                      ) : null}
                    </div>

                    {/* Variant Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-[#EDEBE9] pt-2">
                      <button
                        type="button"
                        onClick={() => handleSyncVariantFromActive(variant.id)}
                        className="inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-[#FAF9F8] px-2 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1] transition-colors"
                      >
                        <span>
                          {tr(language, {
                            ru: 'Записать текущую сюда',
                            en: 'Overwrite with active',
                            it: 'Sovrascrivi con attiva',
                            es: 'Sobrescribir con activa',
                            de: 'Mit aktiver überschreiben',
                          })}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyVariantToFormula(variant)}
                        className="inline-flex items-center gap-1 rounded bg-[var(--theme-accent)] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>
                          {tr(language, {
                            ru: 'В рабочую формулу',
                            en: 'Load into Formula',
                            it: 'Carica nella Formula',
                            es: 'Cargar en Fórmula',
                            de: 'In Formel laden',
                          })}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
      <>
      {/* Live Formula Sync Status Bar */}
      <div className="px-3.5 py-2.5 bg-[#FAF9F8] border-b border-[#EDEBE9] space-y-2">
        {latestRevision ? (
          <>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span
                className={`font-medium truncate ${
                  liveDiff?.hasChanges ? 'text-[#B45309]' : 'text-[#15803D]'
                }`}
              >
                {liveDiff?.hasChanges
                  ? t.unsavedChangesTitle(latestRevision.versionCode)
                  : t.matchesLatestTitle(latestRevision.versionCode)}
              </span>
              {liveDiff?.hasChanges && (
                <button
                  type="button"
                  onClick={() => setShowLiveDiff((v) => !v)}
                  className="text-[var(--theme-accent)] font-medium hover:underline shrink-0"
                >
                  {showLiveDiff ? t.hideLiveDiff : t.showLiveDiff}
                </button>
              )}
            </div>

            {liveDiff?.hasChanges && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] font-mono text-[#605E5C] tabular-nums">
                {liveDiff.addedCount > 0 && (
                  <span className="text-[#15803D]">
                    +{liveDiff.addedCount} {t.addedLabel}
                  </span>
                )}
                {liveDiff.modifiedCount > 0 && (
                  <span className="text-[#B45309]">
                    ~{liveDiff.modifiedCount} {t.modifiedLabel}
                  </span>
                )}
                {liveDiff.removedCount > 0 && (
                  <span className="text-[#B91C1C]">
                    −{liveDiff.removedCount} {t.removedLabel}
                  </span>
                )}
                <span>
                  Δ {liveDiff.totalDeltaGrams > 0 ? '+' : ''}
                  {liveDiff.totalDeltaGrams.toFixed(2)} {gUnit}
                </span>
              </div>
            )}

            {showLiveDiff && liveDiff?.hasChanges && (
              <div className="pt-1 border-t border-[#EDEBE9]">
                {renderDiffItems(liveDiff.items)}
              </div>
            )}
          </>
        ) : (
          <div className="text-[11px] text-[#605E5C] leading-relaxed">{t.noBaselineYet}</div>
        )}
      </div>

      {/* Scrollable Body: Capture Form + Search + Revisions Timeline */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
        {/* Save New Variation Form */}
        <form
          onSubmit={handleSaveVariation}
          className="rounded-lg border border-[#E1DFDD] bg-[#FAF9F8] p-3 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#181917]">{t.newVariationHeading}</span>
            <span className="rounded bg-[#EDEBE9] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--theme-accent)] tabular-nums">
              {nextVersionCode}
            </span>
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t.titlePlaceholder(nextVersionCode)}
            className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:outline-none"
          />
          <textarea
            rows={2}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full rounded border border-[#D2D0CE] bg-white px-2.5 py-1.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:outline-none resize-y"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--theme-accent-hover)] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.saveVariationBtn}</span>
          </button>
        </form>

        {/* Search Revisions */}
        {revisions.length > 0 && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#605E5C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded border border-[#D2D0CE] bg-[#FAF9F8] py-1.5 pl-8 pr-2.5 text-xs text-[#252423] placeholder:text-[#797775] focus:border-[var(--theme-accent)] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        {/* Variations Timeline */}
        {revisions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D2D0CE] bg-[#FAF9F8] p-4 text-center space-y-2.5">
            <div className="text-xs font-semibold text-[#181917]">{t.emptyTitle}</div>
            <p className="text-[11px] text-[#605E5C] leading-relaxed">{t.emptyDesc}</p>
            <button
              type="button"
              onClick={handleQuickCreateBaseline}
              className="inline-flex items-center gap-1.5 rounded border border-[#D2D0CE] bg-white px-3 py-1.5 text-xs font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.createBaselineBtn}</span>
            </button>
          </div>
        ) : filteredRevisions.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#605E5C]">{t.noSearchMatches}</div>
        ) : (
          <div className="space-y-3">
            {filteredRevisions.map((rev) => {
              const originalIndex = revisions.findIndex((r) => r.id === rev.id);
              const prevRev =
                originalIndex >= 0 && originalIndex < revisions.length - 1
                  ? revisions[originalIndex + 1]
                  : null;
              const diffVsPrev = prevRev
                ? compareFormulaComponents(prevRev.components, rev.components)
                : null;
              const diffVsCurrent =
                comparingRevisionId === rev.id
                  ? compareFormulaComponents(rev.components, project.components)
                  : null;

              const isExpanded = Boolean(expandedCompositionIds[rev.id]);
              const isComparing = comparingRevisionId === rev.id;
              const isEditingNote = editingNoteId === rev.id;
              const isEditingTitle = editingTitleId === rev.id;
              const isConfirmingRestore = restoreConfirmId === rev.id;
              const isConfirmingDelete = deleteConfirmId === rev.id;

              return (
                <article
                  key={rev.id}
                  className="rounded-lg border border-[#E1DFDD] bg-white p-3 space-y-2.5"
                >
                  {/* Top Row: Version Code + Date/Time + Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#605E5C] tabular-nums">
                        <span className="rounded bg-[var(--theme-accent-soft)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--theme-accent)]">
                          {rev.versionCode}
                        </span>
                        {rev.isBaseline && (
                          <span className="font-medium text-[#605E5C]">· {t.baselineTag}</span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>
                            {rev.date}
                            {rev.createdAtTime ? ` ${rev.createdAtTime}` : ''}
                          </span>
                        </span>
                      </div>

                      {isEditingTitle ? (
                        <div className="flex items-center gap-1 pt-1">
                          <input
                            type="text"
                            value={titleDraft}
                            onChange={(e) => setTitleDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveTitle(rev.id);
                              } else if (e.key === 'Escape') {
                                setEditingTitleId(null);
                              }
                            }}
                            autoFocus
                            className="flex-1 min-w-0 rounded border border-[var(--theme-accent)] bg-white px-2 py-0.5 text-xs font-semibold text-[#181917] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveTitle(rev.id)}
                            className="rounded bg-[var(--theme-accent)] px-2 py-0.5 text-[11px] font-medium text-white"
                          >
                            {t.saveTitleBtn}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <h3 className="text-xs font-semibold text-[#181917] truncate">
                            {rev.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTitleId(rev.id);
                              setTitleDraft(rev.title);
                            }}
                            className="rounded p-0.5 text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#181917] shrink-0"
                            title={t.editTitleAria}
                            aria-label={t.editTitleAria}
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteRevision(rev.id)}
                          className="rounded bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 text-[10px] font-semibold text-[#B91C1C]"
                        >
                          {t.deleteConfirmBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded px-1.5 py-0.5 text-[10px] text-[#605E5C] hover:bg-[#F3F2F1]"
                        >
                          {t.cancelBtn}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(rev.id)}
                        className="rounded p-1 text-[#605E5C] hover:bg-[#FEF2F2] hover:text-[#B91C1C] shrink-0"
                        title={t.deleteAria}
                        aria-label={t.deleteAria}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Metrics line */}
                  <div className="text-[11px] font-mono text-[#605E5C] tabular-nums">
                    {rev.targetConcentration} · {t.componentsShort(rev.components.length)} ·{' '}
                    {renderCompositionSummary(rev.components)}
                  </div>

                  {/* Diff against chronologically previous revision */}
                  {prevRev && diffVsPrev && (
                    <div className="border-t border-[#EDEBE9] pt-2 space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#605E5C]">
                        {t.changesVsPrev(prevRev.versionCode)}
                      </div>
                      {diffVsPrev.hasChanges ? (
                        renderDiffItems(diffVsPrev.items)
                      ) : (
                        <div className="text-[11px] text-[#605E5C]">{t.noDiffVsPrev}</div>
                      )}
                    </div>
                  )}

                  {/* Dedicated Notes Block per Variation */}
                  <div className="border-t border-[#EDEBE9] pt-2 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#605E5C]">
                        <NotebookPen className="h-3 w-3 text-[var(--theme-accent)]" />
                        <span>{t.notesHeading}</span>
                      </span>
                      {!isEditingNote && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(rev.id);
                            setNoteDraft(rev.notes);
                          }}
                          className="text-[11px] font-medium text-[var(--theme-accent)] hover:underline"
                        >
                          {rev.notes ? t.editNoteBtn : t.addNoteBtn}
                        </button>
                      )}
                    </div>

                    {isEditingNote ? (
                      <div className="space-y-1.5">
                        <textarea
                          rows={3}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveNote(rev.id);
                            } else if (e.key === 'Escape') {
                              setEditingNoteId(null);
                            }
                          }}
                          placeholder={t.notesPlaceholder}
                          autoFocus
                          className="w-full rounded border border-[var(--theme-accent)] bg-[#FAF9F8] px-2.5 py-1.5 text-xs text-[#252423] focus:bg-white focus:outline-none resize-y"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[#605E5C] hover:bg-[#F3F2F1]"
                          >
                            {t.cancelBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(rev.id)}
                            className="inline-flex items-center gap-1 rounded bg-[var(--theme-accent)] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                          >
                            <Check className="h-3 w-3" />
                            <span>{t.saveNoteBtn}</span>
                          </button>
                        </div>
                      </div>
                    ) : rev.notes ? (
                      <p className="rounded bg-[#FAF9F8] px-2.5 py-1.5 text-xs text-[#323130] leading-relaxed whitespace-pre-wrap">
                        {rev.notes}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#797775] leading-relaxed">
                        {t.emptyNoteText}
                      </p>
                    )}
                  </div>

                  {/* Action Row: Composition, Compare with Live, Apply */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-[#EDEBE9] pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCompositionIds((prev) => ({
                          ...prev,
                          [rev.id]: !prev[rev.id],
                        }))
                      }
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                        isExpanded
                          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                          : 'border-[#D2D0CE] bg-[#FAF9F8] text-[#323130] hover:bg-[#F3F2F1]'
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <span>{t.compositionBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setComparingRevisionId((prev) => (prev === rev.id ? null : rev.id))
                      }
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                        isComparing
                          ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                          : 'border-[#D2D0CE] bg-[#FAF9F8] text-[#323130] hover:bg-[#F3F2F1]'
                      }`}
                    >
                      <GitCompareArrows className="h-3 w-3" />
                      <span>{t.compareWithCurrentBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestRestore(rev)}
                      className="ml-auto inline-flex items-center gap-1 rounded border border-[#D2D0CE] bg-white px-2 py-1 text-[11px] font-medium text-[var(--theme-accent)] hover:bg-[#F3F2F1] transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{t.restoreBtn}</span>
                    </button>
                  </div>

                  {/* Unsaved Changes Confirmation Before Restoring */}
                  {isConfirmingRestore && (
                    <div className="rounded-lg border border-[#F59E0B]/40 bg-[#FFFBEB] p-2.5 space-y-2">
                      <div className="text-[11px] font-medium text-[#181917]">
                        {t.restoreConfirmPrompt}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => applyRevisionComposition(rev, true)}
                          className="rounded bg-[var(--theme-accent)] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[var(--theme-accent-hover)]"
                        >
                          {t.saveAndRestoreBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => applyRevisionComposition(rev, false)}
                          className="rounded border border-[#D2D0CE] bg-white px-2.5 py-1 text-[11px] font-medium text-[#323130] hover:bg-[#F3F2F1]"
                        >
                          {t.restoreOnlyBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRestoreConfirmId(null)}
                          className="rounded px-2 py-1 text-[11px] text-[#605E5C] hover:bg-white/60"
                        >
                          {t.cancelBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Compare with Active Formula */}
                  {isComparing && diffVsCurrent && (
                    <div className="rounded-lg border border-[#C8D7EC] bg-[#F5F9FF] p-2.5 space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#185ABD]">
                        {t.comparingWithCurrent}
                      </div>
                      {diffVsCurrent.hasChanges ? (
                        renderDiffItems(diffVsCurrent.items)
                      ) : (
                        <div className="text-[11px] text-[#15803D] font-medium">
                          {t.identicalToCurrent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expanded Full Composition of Variation */}
                  {isExpanded && (
                    <div className="rounded border border-[#EDEBE9] bg-[#FAF9F8] p-2 space-y-1">
                      {(() => {
                        const revTotal = rev.components.reduce((s, c) => s + c.weightGrams, 0);
                        return rev.components.map((c) => {
                          const pct = revTotal > 0 ? (c.weightGrams / revTotal) * 100 : 0;
                          return (
                            <div
                              key={c.id}
                              className="flex items-center justify-between gap-2 py-0.5 text-[11px] border-b border-[#EDEBE9] last:border-none"
                            >
                              <div className="min-w-0 truncate">
                                <span className="font-mono text-[10px] text-[#605E5C] mr-1.5">
                                  {getNoteTierShort(c.tier, language)}
                                </span>
                                <span className="text-[#181917]">{c.name}</span>
                                {c.dilutionPercent < 100 && (
                                  <span className="ml-1 text-[10px] text-[#605E5C] tabular-nums">
                                    ({c.dilutionPercent}%)
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[#323130] tabular-nums shrink-0">
                                {c.weightGrams.toFixed(2)} {gUnit} ({pct.toFixed(1)}%)
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );

  if (!open) {
    return null;
  }

  return (
    <>
      <aside className="print:hidden hidden lg:block w-80 xl:w-96 shrink-0">{paneBody}</aside>
      <div className="print:hidden lg:hidden fixed inset-0 z-40 flex justify-end">
        <div className="fixed inset-0 bg-[#252423]/30" onClick={onClose} />
        <aside className="relative z-10 w-80 sm:w-96 max-w-[90vw] h-full shadow-xl">{paneBody}</aside>
      </div>
    </>
  );
}
