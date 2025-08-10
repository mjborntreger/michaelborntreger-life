import type { TechTerm } from '@/lib/wp';

export type TechNode = {
  term: TechTerm;
  children: TechNode[];
};

/**
 * Build a full forest from a flat list of taxonomy terms.
 * Parents must come from TechTerm.parentDbId.
 */
export function buildTechTree(all: TechTerm[]): TechNode[] {
  // De-dupe in case upstream sends duplicates
  const seen = new Set<number>();
  const unique = all.filter(t => {
    if (seen.has(t.dbId)) return false;
    seen.add(t.dbId);
    return true;
  });

  const byId = new Map<number, TechNode>();
  unique.forEach(t => byId.set(t.dbId, { term: t, children: [] }));

  const roots: TechNode[] = [];
  unique.forEach(t => {
    const node = byId.get(t.dbId)!;
    const parentId = t.parentDbId ?? 0;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort siblings for stable UI
  const sortRec = (nodes: TechNode[]) => {
    nodes.sort((a, b) => a.term.name.localeCompare(b.term.name));
    nodes.forEach(n => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}

/**
 * Keep only branches that contain at least one selected term.
 */
export function pruneTreeToSelection(roots: TechNode[], selectedDbIds: number[]): TechNode[] {
  const sel = new Set(selectedDbIds);
  const prune = (node: TechNode): TechNode | null => {
    const keptChildren = node.children.map(prune).filter(Boolean) as TechNode[];
    const isSelected = sel.has(node.term.dbId);
    if (isSelected || keptChildren.length) {
      return { term: node.term, children: keptChildren };
    }
    return null;
  };
  return roots.map(prune).filter(Boolean) as TechNode[];
}

/**
 * Convenience: go straight from flat terms + selected IDs to a pruned tree.
 */
export function makeTechTree(allTerms: TechTerm[], selectedDbIds: number[]): TechNode[] {
  if (!allTerms.length || !selectedDbIds.length) return [];
  const forest = buildTechTree(allTerms);
  return pruneTreeToSelection(forest, selectedDbIds);
}
