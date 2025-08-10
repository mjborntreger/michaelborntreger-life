'use client';

import { useState } from 'react';
import type { TechNode } from '@/lib/techTree';

export default function TechStackTree({ tree }: { tree: TechNode[] }) {
  return (
    <ul role="tree" className="tech-tree">
      {tree.map(n => <Item key={n.term.dbId} node={n} />)}
    </ul>
  );
}

function Item({ node }: { node: TechNode }) {
  const [open, setOpen] = useState(true);
  const hasKids = node.children.length > 0;

  return (
    <li role="treeitem" aria-expanded={hasKids ? open : undefined} className="relative pl-4 my-1">
      {hasKids ? (
        <button type="button" onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-1 text-sm hover:underline">
          <span className="w-4">{open ? '▾' : '▸'}</span>
          <span className="font-medium">{node.term.name}</span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm">
          <span className="w-4" />
          {node.term.name}
        </span>
      )}

      {hasKids && open && (
        <ul role="group" className="ml-2">
          {node.children.map(c => <Item key={c.term.dbId} node={c} />)}
        </ul>
      )}
    </li>
  );
}
