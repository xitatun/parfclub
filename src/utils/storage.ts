import {
  formatUnit,
  getBudgetCategoryLabel,
  getJournalVerdictLabel,
  getNoteTierShort,
  getOlfactoryFamilyLabel,
  getProjectStatusLabel,
  getSillageLabel,
} from '../data/constants';
import { FRATERWORKS_REFERENCE_MATERIALS } from '../data/fraterworksProfiles';
import { resolveIfraStandard } from '../data/ifraStandards';
import { tr } from '../data/i18n';
import { getSeedSnapshotForLanguage } from '../data/seedTranslations';
import type {
  AppCurrency,
  AppLanguage,
  Ingredient,
  LibraryIngredient,
  PerfumeProject,
  ProjectEstimateItem,
  PurchaseRecord,
  SaleRecord,
} from '../types/perfume';
import { calculateFormulaSummary, formatCurrencyDecimal, formatCurrencyRub, formatGrams, formatPercent } from './calculations';

const STORAGE_KEYS = {
  projects: 'atelier_essences_projects_v2',
  ingredients: 'atelier_essences_ingredients_v2',
  estimates: 'atelier_essences_estimates_v2',
  purchases: 'atelier_essences_purchases_v2',
  sales: 'atelier_essences_sales_v1',
  library: 'atelier_essences_library_v1',
};

export interface StudioBackupPayload {
  type?: 'atelier_studio';
  version: number;
  exportedAt: string;
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales?: SaleRecord[];
  library?: LibraryIngredient[];
}

export interface SingleProjectPayload {
  type: 'atelier_project';
  version: 1;
  exportedAt: string;
  project: PerfumeProject;
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales?: SaleRecord[];
}

export type ParsedImportFile =
  | { kind: 'studio'; data: StudioBackupPayload }
  | { kind: 'project'; data: SingleProjectPayload };

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const STALE_SEED_IFRA_VALUES: Record<string, number> = {
  'ing-bergamot': 0.4,
  'ing-iso-e': 21.4,
  'ing-ambroxan': 15.0,
  'ing-cedar-atlas': 25.0,
  'ing-galaxolide': 30.0,
  'ing-pink-pepper': 6.0,
  'ing-jasmine-sambac': 4.0,
  'ing-galbanum': 5.0,
};

export function loadInitialData(language: AppLanguage = 'ru'): {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  library: LibraryIngredient[];
} {
  const seed = loadSeedStudioSnapshot(language);
  const projects = safeParse<PerfumeProject[]>(localStorage.getItem(STORAGE_KEYS.projects), seed.projects);
  const ingredients = safeParse<Ingredient[]>(localStorage.getItem(STORAGE_KEYS.ingredients), seed.ingredients);
  const estimates = safeParse<ProjectEstimateItem[]>(
    localStorage.getItem(STORAGE_KEYS.estimates),
    seed.estimates
  );
  const purchases = safeParse<PurchaseRecord[]>(localStorage.getItem(STORAGE_KEYS.purchases), seed.purchases);
  const sales = safeParse<SaleRecord[]>(localStorage.getItem(STORAGE_KEYS.sales), seed.sales);
  const library = safeParse<LibraryIngredient[]>(localStorage.getItem(STORAGE_KEYS.library), seed.library);

  const loadedProjects = Array.isArray(projects) ? projects : seed.projects;
  const normalizedProjects = loadedProjects.map((p) => {
    const seedMatch = seed.projects.find((sp) => sp.id === p.id);
    return {
      ...p,
      macerations:
        p.macerations !== undefined
          ? p.macerations
          : seedMatch?.macerations
            ? structuredClone(seedMatch.macerations)
            : [],
      revisions:
        p.revisions !== undefined
          ? p.revisions
          : seedMatch?.revisions
            ? structuredClone(seedMatch.revisions)
            : [],
    };
  });

  const OLD_REMOVED_LIB_IDS = new Set([
    'lib-bergamot',
    'lib-iso-e',
    'lib-ambroxan',
    'lib-osmanthus',
    'lib-vetiver',
  ]);
  const seedLibraryById = new Map(seed.library.map((sl) => [sl.id, sl]));
  const loadedLibrary = (Array.isArray(library) ? library : seed.library).filter(
    (item) => !item.id.startsWith('fc-') && !OLD_REMOVED_LIB_IDS.has(item.id)
  );
  const normalizedLibrary = loadedLibrary.map((item) => {
    const seedMatch = seedLibraryById.get(item.id);
    const std = resolveIfraStandard({
      name: item.name,
      inciOrCas: item.inciOrCas,
      synonyms: item.synonyms,
    });

    if (seedMatch && item.id.startsWith('src3-')) {
      const hasStaleRecText =
        typeof item.properties === 'string' &&
        (/\. Рекомендация:/i.test(item.properties) ||
          /IFRA 51 Cat\. 4: не ограничен \(/i.test(item.properties) ||
          /Рекомендуемый\s+ввод\s*:/i.test(item.properties));
      return {
        ...item,
        tier: seedMatch.tier,
        blotterLongevity: item.blotterLongevity ?? seedMatch.blotterLongevity,
        ifraLimitPercent: seedMatch.ifraLimitPercent,
        ifraNote: undefined,
        properties:
          hasStaleRecText || item.updatedAt === '2026-11-14' || !item.updatedAt
            ? seedMatch.properties
            : item.properties,
      };
    }

    if (std) {
      const cleanedProps =
        typeof item.properties === 'string'
          ? item.properties.replace(/\s*Рекомендуемый\s+ввод\s*:[^.]*(?:\.|$)/gi, '').trim()
          : item.properties;
      return {
        ...item,
        tier: std.id === 'ifra-unres-dpg' ? 'solvent' : item.tier,
        blotterLongevity: item.blotterLongevity ?? seedMatch?.blotterLongevity,
        ifraLimitPercent:
          std.status === 'exempt_fcf' || std.status === 'unrestricted'
            ? undefined
            : std.category4LimitPercent,
        ifraNote: undefined,
        properties: cleanedProps,
      };
    }

    const cleanedItem = item.ifraNote ? { ...item, ifraNote: undefined } : item;
    return cleanedItem.blotterLongevity === undefined && seedMatch?.blotterLongevity
      ? { ...cleanedItem, blotterLongevity: seedMatch.blotterLongevity }
      : cleanedItem;
  });
  const existingLibIds = new Set(normalizedLibrary.map((item) => item.id));
  const missingSeedLib = seed.library.filter((sl) => !existingLibIds.has(sl.id));
  const baseMergedLibrary =
    missingSeedLib.length > 0 ? [...normalizedLibrary, ...missingSeedLib] : normalizedLibrary;

  const existingCasSet = new Set(
    baseMergedLibrary.map((item) => (item.inciOrCas || '').trim().toLowerCase()).filter(Boolean)
  );
  const existingIdSet = new Set(baseMergedLibrary.map((item) => item.id));
  const fraterworksLibItems: LibraryIngredient[] = FRATERWORKS_REFERENCE_MATERIALS.filter(
    (fw) =>
      !existingIdSet.has(fw.id) &&
      (!fw.inciOrCas || !existingCasSet.has(fw.inciOrCas.trim().toLowerCase()))
  ).map((fw) => {
    const std = resolveIfraStandard({
      name: fw.name,
      inciOrCas: fw.inciOrCas,
      synonyms: fw.synonyms,
    });
    const ifraLimit =
      std
        ? std.status === 'exempt_fcf' || std.status === 'unrestricted'
          ? undefined
          : std.category4LimitPercent
        : fw.ifraLimitPercent;
    const ifraSuffix =
      ifraLimit !== undefined
        ? ` IFRA 51 Cat. 4: до ${ifraLimit}%.`
        : std?.status === 'exempt_fcf'
          ? ' IFRA 51 Cat. 4: FCF (не ограничен).'
          : std?.status === 'unrestricted'
            ? ' IFRA 51 Cat. 4: не ограничен.'
            : '';
    return {
      id: fw.id,
      name: fw.name,
      inciOrCas: fw.inciOrCas,
      synonyms: fw.synonyms,
      family: fw.family,
      tier: fw.tier,
      origin: fw.origin,
      blotterLongevity: `${fw.substantivityHours} ч`,
      odorImpact: fw.odorImpact,
      substantivityHours: fw.substantivityHours,
      averageUsePercent: fw.averageUsePercent,
      scentBreakdown: fw.scentBreakdown,
      ifraLimitPercent: ifraLimit,
      properties: `Летучесть: ${fw.volatilityLabel}.${ifraSuffix}`,
      scentDescription: fw.scentDescription,
      scentRating: 9,
      futureIdeasRating: 9,
      notes: [],
      createdAt: '2026-01-15',
      updatedAt: '2026-01-15',
    };
  });
  const mergedLibrary =
    fraterworksLibItems.length > 0
      ? [...fraterworksLibItems, ...baseMergedLibrary]
      : baseMergedLibrary;

  const loadedIngredients = Array.isArray(ingredients) ? ingredients : seed.ingredients;
  const normalizedIngredients = loadedIngredients.map((ing) => {
    const seedMatch = seed.ingredients.find((si) => si.id === ing.id);
    const std = resolveIfraStandard({
      name: ing.name,
      inciOrCas: ing.inciOrCas,
      synonyms: ing.synonyms,
    });

    let nextIfra = ing.ifraLimitPercent;
    const staleVal = STALE_SEED_IFRA_VALUES[ing.id];
    if (staleVal !== undefined && ing.ifraLimitPercent === staleVal) {
      nextIfra = seedMatch?.ifraLimitPercent;
    } else if (std) {
      if (std.status === 'exempt_fcf' || std.status === 'unrestricted') {
        if (
          ing.ifraLimitPercent === 0.4 ||
          ing.ifraLimitPercent === 15 ||
          ing.ifraLimitPercent === 25 ||
          ing.ifraLimitPercent === 30 ||
          ing.ifraLimitPercent === 5 ||
          ing.ifraLimitPercent === 0.2 ||
          ing.ifraLimitPercent === 4.295
        ) {
          nextIfra = undefined;
        }
      } else if (std.category4LimitPercent !== undefined) {
        if (
          ing.ifraLimitPercent === undefined ||
          ing.ifraLimitPercent === 21.4 ||
          ing.ifraLimitPercent === 0.02
        ) {
          nextIfra = std.category4LimitPercent;
        }
      }
    }

    return {
      ...ing,
      tags: ing.tags !== undefined ? ing.tags : seedMatch?.tags ? [...seedMatch.tags] : ing.tags,
      ifraLimitPercent: nextIfra,
    };
  });

  return {
    projects: normalizedProjects,
    ingredients: normalizedIngredients,
    estimates: Array.isArray(estimates) ? estimates : seed.estimates,
    purchases: Array.isArray(purchases) ? purchases : seed.purchases,
    sales: Array.isArray(sales) ? sales : seed.sales,
    library: mergedLibrary,
  };
}

export function loadSeedStudioSnapshot(language: AppLanguage = 'ru'): {
  projects: PerfumeProject[];
  ingredients: Ingredient[];
  estimates: ProjectEstimateItem[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  library: LibraryIngredient[];
} {
  return getSeedSnapshotForLanguage(language);
}

const ALL_LANGUAGES: AppLanguage[] = ['ru', 'en', 'it', 'es', 'de'];

export function localizeSeedSnapshot(
  current: {
    projects: PerfumeProject[];
    ingredients: Ingredient[];
    estimates: ProjectEstimateItem[];
    purchases: PurchaseRecord[];
    sales: SaleRecord[];
    library: LibraryIngredient[];
  },
  targetLang: AppLanguage
) {
  const snapshots: Record<AppLanguage, ReturnType<typeof getSeedSnapshotForLanguage>> = {
    ru: getSeedSnapshotForLanguage('ru'),
    en: getSeedSnapshotForLanguage('en'),
    it: getSeedSnapshotForLanguage('it'),
    es: getSeedSnapshotForLanguage('es'),
    de: getSeedSnapshotForLanguage('de'),
  };
  const dstSnap = snapshots[targetLang];

  const projects = current.projects.map((p) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].projects.find((s) => s.id === p.id)).find(
      (s): s is PerfumeProject => Boolean(s && p.title === s.title)
    );
    const dst = dstSnap.projects.find((s) => s.id === p.id);
    if (!src || !dst) return p;
    return {
      ...p,
      title: dst.title,
      idea: p.idea === src.idea ? dst.idea : p.idea,
      inspiration: p.inspiration === src.inspiration ? dst.inspiration : p.inspiration,
      components: p.components.map((c) => {
        const srcC = src.components.find((sc) => sc.id === c.id);
        const dstC = dst.components.find((dc) => dc.id === c.id);
        if (!srcC || !dstC) return c;
        return {
          ...c,
          name: c.name === srcC.name ? dstC.name : c.name,
          note: c.note === srcC.note ? dstC.note : c.note,
        };
      }),
      olfactoryMap: {
        ...p.olfactoryMap,
        evaporationNotes:
          p.olfactoryMap.evaporationNotes === src.olfactoryMap.evaporationNotes
            ? dst.olfactoryMap.evaporationNotes
            : p.olfactoryMap.evaporationNotes,
        topNotes: p.olfactoryMap.topNotes.map((n) => {
          const sn = src.olfactoryMap.topNotes.find((x) => x.id === n.id);
          const dn = dst.olfactoryMap.topNotes.find((x) => x.id === n.id);
          if (!sn || !dn) return n;
          return {
            ...n,
            name: n.name === sn.name ? dn.name : n.name,
            description: n.description === sn.description ? dn.description : n.description,
          };
        }),
        heartNotes: p.olfactoryMap.heartNotes.map((n) => {
          const sn = src.olfactoryMap.heartNotes.find((x) => x.id === n.id);
          const dn = dst.olfactoryMap.heartNotes.find((x) => x.id === n.id);
          if (!sn || !dn) return n;
          return {
            ...n,
            name: n.name === sn.name ? dn.name : n.name,
            description: n.description === sn.description ? dn.description : n.description,
          };
        }),
        baseNotes: p.olfactoryMap.baseNotes.map((n) => {
          const sn = src.olfactoryMap.baseNotes.find((x) => x.id === n.id);
          const dn = dst.olfactoryMap.baseNotes.find((x) => x.id === n.id);
          if (!sn || !dn) return n;
          return {
            ...n,
            name: n.name === sn.name ? dn.name : n.name,
            description: n.description === sn.description ? dn.description : n.description,
          };
        }),
      },
      journal: p.journal.map((j) => {
        const sj = src.journal.find((x) => x.id === j.id);
        const dj = dst.journal.find((x) => x.id === j.id);
        if (!sj || !dj) return j;
        return {
          ...j,
          trialLabel: j.trialLabel === sj.trialLabel ? dj.trialLabel : j.trialLabel,
          content: j.content === sj.content ? dj.content : j.content,
          formulaSnapshotSummary:
            j.formulaSnapshotSummary === sj.formulaSnapshotSummary
              ? dj.formulaSnapshotSummary
              : j.formulaSnapshotSummary,
          scentEvolution: j.scentEvolution?.map((pt) => {
            const spt = sj.scentEvolution?.find((x) => x.id === pt.id);
            const dpt = dj.scentEvolution?.find((x) => x.id === pt.id);
            if (!spt || !dpt) return pt;
            return {
              ...pt,
              timeLabel: pt.timeLabel === spt.timeLabel ? dpt.timeLabel : pt.timeLabel,
              impression: pt.impression === spt.impression ? dpt.impression : pt.impression,
            };
          }),
        };
      }),
      macerations: (p.macerations || []).map((m) => {
        const sm = (src.macerations || []).find((x) => x.id === m.id);
        const dm = (dst.macerations || []).find((x) => x.id === m.id);
        if (!sm || !dm) return m;
        return {
          ...m,
          label: m.label === sm.label ? dm.label : m.label,
          notes: m.notes === sm.notes ? dm.notes : m.notes,
        };
      }),
      revisions: (p.revisions || []).map((r) => {
        const sr = (src.revisions || []).find((x) => x.id === r.id);
        const dr = (dst.revisions || []).find((x) => x.id === r.id);
        return {
          ...r,
          title: sr && dr && r.title === sr.title ? dr.title : r.title,
          notes: sr && dr && r.notes === sr.notes ? dr.notes : r.notes,
          components: r.components.map((c) => {
            const srcC = src.components.find((sc) => sc.id === c.id);
            const dstC = dst.components.find((dc) => dc.id === c.id);
            if (!srcC || !dstC) return c;
            return {
              ...c,
              name: c.name === srcC.name ? dstC.name : c.name,
              note: c.note === srcC.note ? dstC.note : c.note,
            };
          }),
        };
      }),
    };
  });

  const ingredients = current.ingredients.map((ing) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].ingredients.find((s) => s.id === ing.id)).find(
      (s): s is Ingredient => Boolean(s && ing.name === s.name)
    );
    const dst = dstSnap.ingredients.find((s) => s.id === ing.id);
    if (!src || !dst) return ing;
    const sameTags =
      JSON.stringify(ing.tags || []) === JSON.stringify(src.tags || []);
    return {
      ...ing,
      name: dst.name,
      solventNote: ing.solventNote === src.solventNote ? dst.solventNote : ing.solventNote,
      longevityLabel:
        ing.longevityLabel === src.longevityLabel ? dst.longevityLabel : ing.longevityLabel,
      supplier: ing.supplier === src.supplier ? dst.supplier : ing.supplier,
      storageLocation:
        ing.storageLocation === src.storageLocation ? dst.storageLocation : ing.storageLocation,
      olfactoryNotes:
        ing.olfactoryNotes === src.olfactoryNotes ? dst.olfactoryNotes : ing.olfactoryNotes,
      tags: sameTags ? (dst.tags ? [...dst.tags] : undefined) : ing.tags,
    };
  });

  const estimates = current.estimates.map((est) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].estimates.find((s) => s.id === est.id)).find(
      (s): s is ProjectEstimateItem => Boolean(s && est.ingredientName === s.ingredientName)
    );
    const dst = dstSnap.estimates.find((s) => s.id === est.id);
    if (!src || !dst) return est;
    return {
      ...est,
      ingredientName: dst.ingredientName,
      notes: est.notes === src.notes ? dst.notes : est.notes,
    };
  });

  const purchases = current.purchases.map((pur) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].purchases.find((s) => s.id === pur.id)).find(
      (s): s is PurchaseRecord => Boolean(s && pur.ingredientName === s.ingredientName)
    );
    const dst = dstSnap.purchases.find((s) => s.id === pur.id);
    if (!src || !dst) return pur;
    return {
      ...pur,
      ingredientName: dst.ingredientName,
      supplier: pur.supplier === src.supplier ? dst.supplier : pur.supplier,
      notes: pur.notes === src.notes ? dst.notes : pur.notes,
    };
  });

  const sales = current.sales.map((sale) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].sales.find((s) => s.id === sale.id)).find(
      (s): s is SaleRecord => Boolean(s && sale.fragranceName === s.fragranceName)
    );
    const dst = dstSnap.sales.find((s) => s.id === sale.id);
    if (!src || !dst) return sale;
    return {
      ...sale,
      fragranceName: dst.fragranceName,
      customerOrOrder:
        sale.customerOrOrder === src.customerOrOrder
          ? dst.customerOrOrder
          : sale.customerOrOrder,
      notes: sale.notes === src.notes ? dst.notes : sale.notes,
    };
  });

  const library = (current.library || []).map((item) => {
    const src = ALL_LANGUAGES.map((l) => snapshots[l].library.find((s) => s.id === item.id)).find(
      (s): s is LibraryIngredient => Boolean(s && item.name === s.name)
    );
    const dst = dstSnap.library.find((s) => s.id === item.id);
    if (!src || !dst) return item;
    return {
      ...item,
      name: dst.name,
      blotterLongevity:
        item.blotterLongevity === src.blotterLongevity
          ? dst.blotterLongevity
          : item.blotterLongevity,
      properties: item.properties === src.properties ? dst.properties : item.properties,
      scentDescription:
        item.scentDescription === src.scentDescription ? dst.scentDescription : item.scentDescription,
      notes: item.notes.map((n) => {
        const sn = src.notes.find((x) => x.id === n.id);
        const dn = dst.notes.find((x) => x.id === n.id);
        if (!sn || !dn) return n;
        return {
          ...n,
          text: n.text === sn.text ? dn.text : n.text,
        };
      }),
    };
  });

  return { projects, ingredients, estimates, purchases, sales, library };
}

export function saveProjects(projects: PerfumeProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  } catch {
    // Ignore storage quota errors
  }
}

export function saveIngredients(ingredients: Ingredient[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ingredients, JSON.stringify(ingredients));
  } catch {
    // Ignore storage quota errors
  }
}

export function saveEstimates(estimates: ProjectEstimateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.estimates, JSON.stringify(estimates));
  } catch {
    // Ignore storage quota errors
  }
}

export function savePurchases(purchases: PurchaseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
  } catch {
    // Ignore storage quota errors
  }
}

export function saveSales(sales: SaleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  } catch {
    // Ignore storage quota errors
  }
}

export function saveLibrary(library: LibraryIngredient[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(library));
  } catch {
    // Ignore storage quota errors
  }
}

export function buildBackupPayload(
  projects: PerfumeProject[],
  ingredients: Ingredient[],
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  sales: SaleRecord[] = [],
  library: LibraryIngredient[] = []
): StudioBackupPayload {
  return {
    type: 'atelier_studio',
    version: 4,
    exportedAt: new Date().toISOString(),
    projects,
    ingredients,
    estimates,
    purchases,
    sales,
    library,
  };
}

export function buildSingleProjectPayload(
  project: PerfumeProject,
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  sales: SaleRecord[] = []
): SingleProjectPayload {
  return {
    type: 'atelier_project',
    version: 1,
    exportedAt: new Date().toISOString(),
    project,
    estimates: estimates.filter((e) => e.projectId === project.id),
    purchases: purchases.filter((p) => p.projectId === project.id),
    sales: sales.filter((s) => s.projectId === project.id),
  };
}

export function parseImportedFile(raw: unknown): ParsedImportFile | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // Single project file ({ type: 'atelier_project', project: { ... } })
  if (obj.type === 'atelier_project' && obj.project && typeof obj.project === 'object') {
    const proj = obj.project as PerfumeProject;
    if (!proj.id || !Array.isArray(proj.components)) return null;
    return {
      kind: 'project',
      data: {
        type: 'atelier_project',
        version: 1,
        exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
        project: proj,
        estimates: Array.isArray(obj.estimates) ? (obj.estimates as ProjectEstimateItem[]) : [],
        purchases: Array.isArray(obj.purchases) ? (obj.purchases as PurchaseRecord[]) : [],
        sales: Array.isArray(obj.sales) ? (obj.sales as SaleRecord[]) : [],
      },
    };
  }

  // Direct PerfumeProject object ({ id, title, components: [...] })
  if (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.components) &&
    obj.olfactoryMap &&
    typeof obj.olfactoryMap === 'object'
  ) {
    const proj = obj as unknown as PerfumeProject;
    return {
      kind: 'project',
      data: {
        type: 'atelier_project',
        version: 1,
        exportedAt: new Date().toISOString(),
        project: proj,
        estimates: [],
        purchases: [],
        sales: [],
      },
    };
  }

  // Full studio file
  if (Array.isArray(obj.projects) && Array.isArray(obj.ingredients)) {
    return {
      kind: 'studio',
      data: {
        type: 'atelier_studio',
        version: typeof obj.version === 'number' ? obj.version : 2,
        exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
        projects: obj.projects as PerfumeProject[],
        ingredients: obj.ingredients as Ingredient[],
        estimates: Array.isArray(obj.estimates) ? (obj.estimates as ProjectEstimateItem[]) : [],
        purchases: Array.isArray(obj.purchases) ? (obj.purchases as PurchaseRecord[]) : [],
        sales: Array.isArray(obj.sales) ? (obj.sales as SaleRecord[]) : [],
        library: Array.isArray(obj.library) ? (obj.library as LibraryIngredient[]) : undefined,
      },
    };
  }

  return null;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function buildProjectWordHtml(
  project: PerfumeProject,
  estimates: ProjectEstimateItem[],
  purchases: PurchaseRecord[],
  lang: AppLanguage = 'ru',
  currency: AppCurrency = 'RUB'
): string {
  const gUnit = lang === 'ru' ? 'г' : 'g';
  const mlUnit = lang === 'ru' ? 'мл' : 'ml';
  const hUnit = tr(lang, { ru: 'ч', en: 'h', it: 'h', es: 'h', de: 'Std' });
  const notSpecified = tr(lang, {
    ru: 'Не указаны',
    en: 'Not specified',
    it: 'Non specificate',
    es: 'No especificadas',
    de: 'Nicht angegeben',
  });
  const summary = calculateFormulaSummary(project.components);
  const projectEstimates = estimates.filter((e) => e.projectId === project.id);

  const componentRows = project.components
    .map((comp) => {
      const pureMass =
        comp.tier === 'solvent'
          ? 0
          : comp.weightGrams * (Math.min(100, Math.max(0, comp.dilutionPercent)) / 100);
      const pctFormula =
        summary.totalWeightGrams > 0 ? (comp.weightGrams / summary.totalWeightGrams) * 100 : 0;
      const pctConc =
        comp.tier !== 'solvent' && summary.pureAromaticGrams > 0
          ? (pureMass / summary.pureAromaticGrams) * 100
          : 0;
      const lineCost = (comp.weightGrams || 0) * (comp.costPerGram || 0);
      return `<tr>
        <td>${escapeHtml(comp.name)}</td>
        <td>${escapeHtml(getNoteTierShort(comp.tier, lang))}</td>
        <td style="text-align:right">${comp.dilutionPercent}%</td>
        <td style="text-align:right">${comp.weightGrams.toFixed(2)} ${gUnit}</td>
        <td style="text-align:right">${formatPercent(pctFormula, 1)}</td>
        <td style="text-align:right">${comp.tier === 'solvent' ? '—' : formatPercent(pctConc, 1)}</td>
        <td style="text-align:right">${escapeHtml(formatCurrencyDecimal(lineCost, lang, currency))}</td>
      </tr>`;
    })
    .join('');

  const renderTierNotes = (title: string, notes: { name: string; percentage: number; description: string }[]) => {
    const items = notes.length
      ? notes
          .map(
            (n) =>
              `<li><b>${escapeHtml(n.name)} (${n.percentage}%)</b>${n.description ? ` — ${escapeHtml(n.description)}` : ''}</li>`
          )
          .join('')
      : `<li>${notSpecified}</li>`;
    return `<p><b>${escapeHtml(title)}:</b></p><ul>${items}</ul>`;
  };

  const journalRows = project.journal.length
    ? project.journal
        .map(
          (j) =>
            `<p><b>${escapeHtml(j.date)} · ${escapeHtml(j.trialLabel)}</b> (${escapeHtml(getJournalVerdictLabel(j.verdict, lang))})<br/>${escapeHtml(j.content)}</p>`
        )
        .join('')
    : `<p>${tr(lang, {
        ru: 'Записей пока нет.',
        en: 'No entries yet.',
        it: 'Nessuna nota ancora.',
        es: 'Aún no hay entradas.',
        de: 'Noch keine Einträge.',
      })}</p>`;

  const estimateRows = projectEstimates
    .map((item) => {
      const matched = purchases.filter(
        (p) =>
          p.estimateItemId === item.id ||
          (p.projectId === project.id && item.ingredientId && p.ingredientId === item.ingredientId)
      );
      const boughtSum = matched.reduce((s, p) => s + p.totalCost, 0);
      const plannedSum = item.requiredQuantity * item.estimatedUnitPrice;
      return `<tr>
        <td>${escapeHtml(item.ingredientName)}</td>
        <td>${escapeHtml(getBudgetCategoryLabel(item.category, lang))}</td>
        <td style="text-align:right">${item.requiredQuantity} ${escapeHtml(formatUnit(item.unit, lang))}</td>
        <td style="text-align:right">${escapeHtml(formatCurrencyRub(plannedSum, lang, currency))}</td>
        <td style="text-align:right">${escapeHtml(formatCurrencyRub(boughtSum, lang, currency))}</td>
      </tr>`;
    })
    .join('');

  const profileList = (
    ['citrus', 'floral', 'woody', 'spicy', 'amber', 'green', 'musk', 'gourmand', 'aquatic', 'leathery'] as const
  )
    .filter((key) => (project.olfactoryMap.profile[key] || 0) > 0)
    .map((key) => `${getOlfactoryFamilyLabel(key, lang)}: ${project.olfactoryMap.profile[key]}/10`)
    .join(' · ');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(project.code)} — ${escapeHtml(project.title)}</title>
  <style>
    body { font-family: Roboto, Calibri, Arial, sans-serif; color: #252423; line-height: 1.5; }
    h1 { color: #185ABD; font-size: 20pt; margin-bottom: 4pt; }
    h2 { color: #185ABD; font-size: 13pt; border-bottom: 1px solid #D2D0CE; padding-bottom: 3pt; margin-top: 16pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 8pt; font-size: 10pt; }
    th, td { border: 1px solid #D2D0CE; padding: 5pt 7pt; text-align: left; }
    th { background: #F3F2F1; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${escapeHtml(project.code)} · ${escapeHtml(project.title)}</h1>
  <p>${tr(lang, { ru: 'Статус', en: 'Status', it: 'Stato', es: 'Estado', de: 'Status' })}: <b>${escapeHtml(getProjectStatusLabel(project.status, lang))}</b> · ${tr(lang, { ru: 'Концентрация', en: 'Concentration', it: 'Concentrazione', es: 'Concentración', de: 'Konzentration' })}: <b>${escapeHtml(project.targetConcentration)}</b> · ${tr(lang, { ru: 'Флакон', en: 'Bottle', it: 'Flacone', es: 'Frasco', de: 'Flakon' })}: <b>${project.targetBottleMl} ${mlUnit}</b> · ${tr(lang, { ru: 'Дата обновления', en: 'Updated', it: 'Aggiornato', es: 'Actualizado', de: 'Aktualisiert' })}: ${escapeHtml(project.updatedAt)}</p>

  <h2>${tr(lang, { ru: 'Идея и вдохновение', en: 'Idea & Inspiration', it: 'Idea e ispirazione', es: 'Idea e inspiración', de: 'Idee & Inspiration' })}</h2>
  <p>${escapeHtml(project.idea || notSpecified)}</p>
  ${project.inspiration ? `<p><i>${tr(lang, { ru: 'Вдохновение', en: 'Inspiration', it: 'Ispirazione', es: 'Inspiración', de: 'Inspiration' })}: ${escapeHtml(project.inspiration)}</i></p>` : ''}

  <h2>${tr(lang, { ru: 'Формула', en: 'Formula', it: 'Formula', es: 'Fórmula', de: 'Formel' })} (${formatGrams(summary.totalWeightGrams, 2, lang)} · ${tr(lang, { ru: 'конц.', en: 'conc.', it: 'conc.', es: 'conc.', de: 'Konz.' })} ${formatPercent(summary.pureConcentrationPercent, 1)} · ${tr(lang, { ru: 'стоимость', en: 'cost', it: 'costo', es: 'costo', de: 'Kosten' })} ${escapeHtml(formatCurrencyDecimal(summary.totalFormulaCost, lang, currency))})</h2>
  <table>
    <thead>
      <tr>
        <th>${tr(lang, { ru: 'Компонент', en: 'Component', it: 'Componente', es: 'Componente', de: 'Komponente' })}</th>
        <th>${tr(lang, { ru: 'Уровень', en: 'Tier', it: 'Livello', es: 'Nivel', de: 'Ebene' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'Развед.', en: 'Dilut.', it: 'Diluiz.', es: 'Diluc.', de: 'Verdünn.' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'Масса', en: 'Mass', it: 'Massa', es: 'Masa', de: 'Masse' })}</th>
        <th style="text-align:right">${tr(lang, { ru: '% формулы', en: '% formula', it: '% formula', es: '% fórmula', de: '% Formel' })}</th>
        <th style="text-align:right">${tr(lang, { ru: '% конц.', en: '% conc.', it: '% conc.', es: '% conc.', de: '% Konz.' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'Стоим.', en: 'Cost', it: 'Costo', es: 'Costo', de: 'Kosten' })}</th>
      </tr>
    </thead>
    <tbody>${componentRows || `<tr><td colspan="7">${tr(lang, { ru: 'Компоненты не добавлены', en: 'No components added', it: 'Nessun componente aggiunto', es: 'Sin componentes añadidos', de: 'Keine Komponenten hinzugefügt' })}</td></tr>`}</tbody>
  </table>

  <h2>${tr(lang, { ru: 'Ольфакторная карта', en: 'Olfactory Map', it: 'Mappa olfattiva', es: 'Mapa olfativo', de: 'Duftkarte' })}</h2>
  ${renderTierNotes(tr(lang, { ru: 'Верхние ноты', en: 'Top Notes', it: 'Note di Testa', es: 'Notas de Salida', de: 'Kopfnoten' }), project.olfactoryMap.topNotes)}
  ${renderTierNotes(tr(lang, { ru: 'Ноты сердца', en: 'Heart Notes', it: 'Note di Cuore', es: 'Notas de Corazón', de: 'Herznoten' }), project.olfactoryMap.heartNotes)}
  ${renderTierNotes(tr(lang, { ru: 'Базовые ноты', en: 'Base Notes', it: 'Note di Fondo', es: 'Notas de Fondo', de: 'Basisnoten' }), project.olfactoryMap.baseNotes)}
  <p><b>${tr(lang, { ru: 'Стойкость', en: 'Longevity', it: 'Persistenza', es: 'Duración', de: 'Haltbarkeit' })}:</b> ${project.olfactoryMap.longevityHours} ${hUnit} · <b>${tr(lang, { ru: 'Шлейф', en: 'Sillage', it: 'Scia', es: 'Estela', de: 'Sillage' })}:</b> ${escapeHtml(getSillageLabel(project.olfactoryMap.sillageLevel, lang))}</p>
  ${profileList ? `<p><b>${tr(lang, { ru: 'Профиль', en: 'Profile', it: 'Profilo', es: 'Perfil', de: 'Profil' })}:</b> ${escapeHtml(profileList)}</p>` : ''}
  ${project.olfactoryMap.evaporationNotes ? `<p>${escapeHtml(project.olfactoryMap.evaporationNotes)}</p>` : ''}

  <h2>${tr(lang, { ru: 'Записи и пробы', en: 'Trials & Notes', it: 'Prove e note', es: 'Pruebas y notas', de: 'Tests & Notizen' })}</h2>
  ${journalRows}

  <h2>${tr(lang, { ru: 'Смета проекта', en: 'Project Budget', it: 'Preventivo progetto', es: 'Presupuesto del proyecto', de: 'Projektbudget' })}</h2>
  <table>
    <thead>
      <tr>
        <th>${tr(lang, { ru: 'Позиция', en: 'Item', it: 'Voce', es: 'Concepto', de: 'Position' })}</th>
        <th>${tr(lang, { ru: 'Категория', en: 'Category', it: 'Categoria', es: 'Categoría', de: 'Kategorie' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'Требуется', en: 'Required', it: 'Richiesto', es: 'Requerido', de: 'Benötigt' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'План', en: 'Planned', it: 'Previsto', es: 'Planificado', de: 'Geplant' })}</th>
        <th style="text-align:right">${tr(lang, { ru: 'Факт', en: 'Actual', it: 'Effettivo', es: 'Real', de: 'Tatsächlich' })}</th>
      </tr>
    </thead>
    <tbody>${estimateRows || `<tr><td colspan="5">${tr(lang, { ru: 'Позиций в смете нет', en: 'No budget items', it: 'Nessuna voce di budget', es: 'Sin partidas presupuestarias', de: 'Keine Budgetpositionen' })}</td></tr>`}</tbody>
  </table>
</body>
</html>`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
