import type { FormulaComponent, NoteTier, ProjectRevision } from '../types/perfume';

export type RevisionDiffKind = 'added' | 'removed' | 'modified' | 'unchanged';

export interface RevisionComponentDiff {
  key: string;
  kind: RevisionDiffKind;
  name: string;
  tier: NoteTier;
  fromWeight: number;
  toWeight: number;
  weightDelta: number;
  fromDilution: number;
  toDilution: number;
  dilutionDelta: number;
}

export interface FormulaDiffSummary {
  items: RevisionComponentDiff[];
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  totalFromGrams: number;
  totalToGrams: number;
  totalDeltaGrams: number;
  hasChanges: boolean;
}

export function formatCurrentTimeHHMM(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function getNextRevisionVersionCode(revisions: ProjectRevision[]): string {
  if (!revisions || revisions.length === 0) return 'v1.0';
  let maxMajor = 1;
  let maxMinor = -1;
  for (const rev of revisions) {
    const match = rev.versionCode.match(/(\d+)\.(\d+)/);
    if (match) {
      const maj = Number(match[1]);
      const min = Number(match[2]);
      if (maj > maxMajor || (maj === maxMajor && min > maxMinor)) {
        maxMajor = maj;
        maxMinor = min;
      }
    }
  }
  if (maxMinor >= 0) {
    return `v${maxMajor}.${maxMinor + 1}`;
  }
  return `v1.${revisions.length}`;
}

function getComponentMatchKey(c: FormulaComponent): string {
  if (c.ingredientId) return `ing:${c.ingredientId}:${c.tier}`;
  return `name:${c.name.trim().toLowerCase()}:${c.tier}`;
}

export function compareFormulaComponents(
  fromComponents: FormulaComponent[],
  toComponents: FormulaComponent[]
): FormulaDiffSummary {
  const fromMap = new Map<string, FormulaComponent>();
  for (const c of fromComponents) {
    const key = getComponentMatchKey(c);
    const prev = fromMap.get(key);
    if (prev) {
      fromMap.set(key, { ...prev, weightGrams: prev.weightGrams + c.weightGrams });
    } else {
      fromMap.set(key, c);
    }
  }

  const toMap = new Map<string, FormulaComponent>();
  for (const c of toComponents) {
    const key = getComponentMatchKey(c);
    const prev = toMap.get(key);
    if (prev) {
      toMap.set(key, { ...prev, weightGrams: prev.weightGrams + c.weightGrams });
    } else {
      toMap.set(key, c);
    }
  }

  const items: RevisionComponentDiff[] = [];
  const seenKeys = new Set<string>();

  for (const [key, toComp] of toMap.entries()) {
    seenKeys.add(key);
    const fromComp = fromMap.get(key);
    if (!fromComp) {
      items.push({
        key,
        kind: 'added',
        name: toComp.name,
        tier: toComp.tier,
        fromWeight: 0,
        toWeight: toComp.weightGrams,
        weightDelta: toComp.weightGrams,
        fromDilution: toComp.dilutionPercent,
        toDilution: toComp.dilutionPercent,
        dilutionDelta: 0,
      });
      continue;
    }

    const weightDelta = Number((toComp.weightGrams - fromComp.weightGrams).toFixed(3));
    const dilutionDelta = Number((toComp.dilutionPercent - fromComp.dilutionPercent).toFixed(2));
    const isModified = Math.abs(weightDelta) >= 0.001 || Math.abs(dilutionDelta) >= 0.01;

    items.push({
      key,
      kind: isModified ? 'modified' : 'unchanged',
      name: toComp.name,
      tier: toComp.tier,
      fromWeight: fromComp.weightGrams,
      toWeight: toComp.weightGrams,
      weightDelta,
      fromDilution: fromComp.dilutionPercent,
      toDilution: toComp.dilutionPercent,
      dilutionDelta,
    });
  }

  for (const [key, fromComp] of fromMap.entries()) {
    if (seenKeys.has(key)) continue;
    items.push({
      key,
      kind: 'removed',
      name: fromComp.name,
      tier: fromComp.tier,
      fromWeight: fromComp.weightGrams,
      toWeight: 0,
      weightDelta: -fromComp.weightGrams,
      fromDilution: fromComp.dilutionPercent,
      toDilution: fromComp.dilutionPercent,
      dilutionDelta: 0,
    });
  }

  const kindOrder: Record<RevisionDiffKind, number> = {
    added: 0,
    modified: 1,
    removed: 2,
    unchanged: 3,
  };
  items.sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]);

  const totalFromGrams = fromComponents.reduce((s, c) => s + c.weightGrams, 0);
  const totalToGrams = toComponents.reduce((s, c) => s + c.weightGrams, 0);
  const addedCount = items.filter((i) => i.kind === 'added').length;
  const removedCount = items.filter((i) => i.kind === 'removed').length;
  const modifiedCount = items.filter((i) => i.kind === 'modified').length;

  return {
    items,
    addedCount,
    removedCount,
    modifiedCount,
    totalFromGrams,
    totalToGrams,
    totalDeltaGrams: Number((totalToGrams - totalFromGrams).toFixed(3)),
    hasChanges: addedCount > 0 || removedCount > 0 || modifiedCount > 0,
  };
}
