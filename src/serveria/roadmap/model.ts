// Schema Serveria / Cora: radici (requisiti), tronco (stelle condivise), rami funzionali.
// Sorgente dati canonica: cora-v2-source.json (CORA-V2-2026-11-03). Non analizza il codice
// e non attesta il funzionamento live: realizzazione e verifica sono due misure separate.
import rawSource from './reconciled-source';
export { repositoryReview, sourceCounts, historyFor } from './reconciled-source';

export type Maturity = 'ready' | 'v1' | 'placeholder' | 'future';
export type Priority = 'unknown' | 'ok' | 'plan' | 'minor' | 'problem';
export type Layer = 'root' | 'trunk' | 'branch';
export type Moon = { id: string; name: string; status: Maturity; note?: string | undefined };
export type Planet = { id: string; name: string; status: Maturity; note?: string | undefined; moons: Moon[] };
export type OwnerReport = { text: string; type: string; commit: string | null; observedAt: string | null };
export type StarDetails = { problems: string[]; future: string[]; ownerReports: OwnerReport[]; roadmapRefs: string[]; trunkLinks: string[] };
export type RelationKind = 'depends_on' | 'uses' | 'communicates_with' | 'produces_for' | 'verified_by' | 'shares_evidence_with';
export type Relation = { fromId: string; toId: string; kind: RelationKind; explanation: string };
export type TreeNode = {
  id: string; code: string; title: string; layer: Layer; group: string; kind: 'group' | 'star';
  status: Maturity; priority: Priority; statusNote: string; milestone?: string | undefined;
  parent?: string | undefined; flows?: string[] | undefined; links?: string[] | undefined;
  planets: Planet[]; details: StarDetails; note?: string | undefined;
  position: [number, number, number];
};

export const maturity: Record<Maturity, { label: string; token: string }> = {
  ready: { label: 'Presente', token: '--ops-cyan' },
  v1: { label: 'Versione 1 / parziale', token: '--ops-accent' },
  placeholder: { label: 'Placeholder', token: '--rm-placeholder' },
  future: { label: 'Futuro', token: '--rm-future' },
};
// Salute (verifica sul campo) separata dalla realizzazione: nel dataset è tutta 'unknown'.
export const priorityMeta: Record<Priority, { label: string; token: string }> = {
  unknown: { label: 'Salute da verificare', token: '--ops-muted' },
  ok: { label: 'In salute', token: '--ops-cyan' },
  plan: { label: 'Verifica pianificata', token: '--rm-placeholder' },
  minor: { label: 'Problema minore', token: '--rm-minor' },
  problem: { label: 'Problema', token: '--rm-problem' },
};
export const relationKindLabel: Record<RelationKind, string> = {
  depends_on: 'Dipende da', uses: 'Usa', communicates_with: 'Comunica con', produces_for: 'Produce per', verified_by: 'Verificato da (proposta)', shares_evidence_with: 'Condivide evidenze con',
};
export const layerLabel: Record<Layer, string> = { root: 'Radici', trunk: 'Tronco', branch: 'Rami funzionali' };
export const depthOf = (s: Maturity) => (s === 'placeholder' ? 2.1 : s === 'future' ? 4.2 : 0);

// ---- parsing della sorgente canonica ----
type Row = [id: string, parentId: string, title: string, implementationStatus: string, priority: string, displayCode: string, note: string];
type Source = {
  version: string; nodes: Row[];
  starDetails: Array<{ id: string } & StarDetails>;
  relations: Array<[fromId: string, toId: string, kind: RelationKind, explanation: string]>;
};
const src = rawSource as unknown as Source;
export const sourceVersion = src.version;

const rows = src.nodes;
const byId = new Map(rows.map(r => [r[0], r]));
const groupIds = new Set(rows.filter(r => r[1] === 'radici' || (r[1] === '' && r[0] !== 'radici' && r[0] !== 'tronco')).map(r => r[0]));
const starRows = rows.filter(r => r[1] === 'tronco' || groupIds.has(r[1]));
const starIds = new Set(starRows.map(r => r[0]));
const planetRows = rows.filter(r => starIds.has(r[1]));
const planetIds = new Set(planetRows.map(r => r[0]));
const moonRows = rows.filter(r => planetIds.has(r[1]));

const statusMap: Record<string, Maturity> = { present: 'ready', partial: 'v1', planned: 'placeholder', idea: 'future' };
const toStatus = (raw: string): Maturity => statusMap[raw] ?? 'v1';
const emptyDetails: StarDetails = { problems: [], future: [], ownerReports: [], roadmapRefs: [], trunkLinks: [] };
const detailsById = new Map(src.starDetails.map(d => [d.id, d] as const));
export const detailsFor = (id: string): StarDetails => detailsById.get(id) ?? emptyDetails;

export const relations: Relation[] = src.relations.map(([fromId, toId, kind, explanation]) => ({ fromId, toId, kind, explanation }));
/** Relazioni concettuali che toccano una stella, in entrambe le direzioni. Sono proposte, non prove runtime. */
export const relationsFor = (id: string) =>
  relations.filter(r => owningStarId(r.fromId) === id || owningStarId(r.toId) === id).map(r => ({ relation: r, otherId: owningStarId(r.fromId) === id ? owningStarId(r.toId) : owningStarId(r.fromId), outgoing: owningStarId(r.fromId) === id }));
export function owningStarId(id: string): string {
  let current = byId.get(id);
  const visited = new Set<string>();
  while (current && !starIds.has(current[0]) && !visited.has(current[0])) { visited.add(current[0]); current = byId.get(current[1]); }
  return current?.[0] ?? id;
}
export const entityTitle = (id: string) => byId.get(id)?.[2] ?? id;
export const entityExists = (id: string) => byId.has(id);

const stripCode = (title: string, code: string) => (title.startsWith(`${code} · `) ? title.slice(code.length + 3) : title);
const milestones: Record<string, string> = { E1: 'M3', E2: 'M4', F2: 'M4', G1: 'W3' };

const planetsOf = (starId: string): Planet[] =>
  planetRows.filter(r => r[1] === starId).map(pr => ({
    id: pr[0], name: pr[2], status: toStatus(pr[3]), note: pr[6] || undefined,
    moons: moonRows.filter(mr => mr[1] === pr[0]).map(mr => ({ id: mr[0], name: mr[2], status: toStatus(mr[3]), note: mr[6] || undefined })),
  }));

// Tronco come costellazione: posizioni libere, stelle anche parallele; nessun ordine implicito.
// Le uniche connessioni sono quelle dichiarate in trunkFlows (chi usa chi).
export const trunkLayout: Record<string, [number, number]> = {
  T1: [0, 2.9], T2: [-1.7, 2.3], T8: [1.7, 2.3], T9: [0.7, 1.4], T12: [-0.9, 1.2],
  T6: [-2.1, 0.6], T7: [-2.0, -0.5], T4: [1.9, 0.5], T5: [0.4, -0.1], T13: [2.1, -0.8],
  T10: [-1.2, -1.4], T11: [0.4, -1.6], T3: [0, -2.7],
  T14: [3.5, -1.7],
};
export const trunkFlows: Record<string, string[]> = {
  T1: ['T2', 'T8', 'T9'], T9: ['T4'], T4: ['T5'], T13: ['T4'], T6: ['T7'], T10: ['T11'], T3: ['T5', 'T11'],
};

export const diagnostics = [
  { symptom: 'Un agente usa il modello sbagliato', look: ['T8', 'worker'] },
  { symptom: 'La richiesta non arriva all’agente', look: ['T1', 'T2'] },
  { symptom: 'Un task rimane bloccato', look: ['T4', 'T9'] },
  { symptom: 'Non si capisce quale passaggio è fallito', look: ['T10'] },
];

/** Prossimo ordine operativo dichiarato dal progetto: non duplica stelle, le rimanda. */
export const workPath = [
  { code: 'W1', title: 'Base V1 completata in repository', note: 'Base architetturale chiusa; collaudo della versione Debian e diagnostica avanzata restano separati.', starIds: ['T1', 'T10', 'T11'] },
  { code: 'W2', title: 'Manutenzione e servizi esterni', note: 'Nextcloud AIO implementato, da collaudare; Immich e restore rimangono aperti.', starIds: ['immich', 'nextcloud', 'R5.2'] },
  { code: 'W3', title: 'Agente programmatore', note: 'Ripresa del Programmatore dopo aggiornamenti e hardware.', starIds: ['G1'] },
];

const best = (list: Maturity[]): Maturity => (['ready', 'v1', 'placeholder', 'future'] as Maturity[]).find(m => list.includes(m)) ?? 'future';

function build(): TreeNode[] {
  const out: TreeNode[] = [];
  const mkStar = (id: string, layer: Layer, group: string, x: number, y: number, parent?: string): TreeNode => {
    const r = byId.get(id);
    if (!r) throw new Error(`Missing star ${id}`);
    const code = r[5] || id;
    const details = detailsFor(id);
    const relLinks = relations.filter(x => x.fromId === id || x.toId === id).map(x => (x.fromId === id ? x.toId : x.fromId));
    const links = [...new Set([...relLinks, ...details.trunkLinks])];
    const status = toStatus(r[3]);
    return {
      id, code, title: stripCode(r[2], code), layer, group, kind: 'star',
      status, priority: (r[4] || 'unknown') as Priority, statusNote: r[6],
      milestone: milestones[id], parent,
      flows: layer === 'trunk' ? trunkFlows[id] : undefined,
      links: links.length ? links : undefined,
      planets: planetsOf(id), details,
      position: [x, y, depthOf(status)],
    };
  };
  const mkGroup = (id: string, layer: Layer, x: number, y: number, attach: string): TreeNode => {
    const r = byId.get(id);
    if (!r) throw new Error(`Missing group ${id}`);
    const code = r[5] || id;
    const stars = starRows.filter(s => s[1] === id);
    const status = best(stars.map(s => toStatus(s[3])));
    return {
      id, code, title: stripCode(r[2], code), layer, group: id, kind: 'group',
      status, priority: 'unknown',
      statusNote: `${stars.length} stelle`, parent: attach, planets: [], details: emptyDetails,
      note: r[6] || undefined, position: [x, y, depthOf(status)],
    };
  };
  starRows.filter(r => r[1] === 'tronco').forEach(r => { const [x, y] = trunkLayout[r[0]] ?? [0, 0]; out.push(mkStar(r[0], 'trunk', 'T', x, y)); });
  const fan = (layer: Layer, ids: string[], spacing: number, gy: number, dir: 1 | -1, attach: string) => ids.forEach((gid, gi) => {
    const gx = (gi - (ids.length - 1) / 2) * spacing;
    out.push(mkGroup(gid, layer, gx, gy, attach));
    const stars = starRows.filter(s => s[1] === gid);
    stars.forEach((sr, si) => out.push(mkStar(sr[0], layer, gid, gx + (si % 2 ? 0.65 : -0.65) * (stars.length > 1 ? 1 : 0), gy + dir * (1.3 + si * 1.25), gid)));
  });
  fan('root', ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'], 3.1, -4.1, -1, 'T3');
  fan('branch', ['A', 'B', 'C', 'programmi', 'E', 'macchine', 'G'], 2.75, 4.2, 1, 'T1');
  return out;
}
export const tree: TreeNode[] = build();

const branchGroupOrder: Array<[id: string, code: string]> = [['A', 'A'], ['B', 'B'], ['C', 'C'], ['programmi', 'D'], ['E', 'E'], ['macchine', 'F'], ['G', 'G']];
export const groups = [
  { key: 'all', label: 'Tutto lo schema', layer: null },
  ...branchGroupOrder.map(([id, code]) => ({ key: id, label: `${code} · ${nodeTitle(id)}`, layer: 'branch' as Layer })),
  { key: 'T', label: 'T · Tronco condiviso', layer: 'trunk' as Layer },
  ...['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(id => ({ key: id, label: `${id} · ${nodeTitle(id)}`, layer: 'root' as Layer })),
];
function nodeTitle(id: string): string { const r = byId.get(id); return r ? stripCode(r[2], r[5] || id) : id; }

export const nodeById = (id: string) => tree.find(n => n.id === id);
export function visibleTree(group: string, status: string) {
  return tree.filter(n => (group === 'all' || n.group === group || n.layer === 'trunk') && (status === 'all' || n.status === status || n.kind === 'group' || n.layer === 'trunk'));
}
export function toMarkdown(): string {
  const line = (n: TreeNode) => {
    const head = `${n.kind === 'group' ? '##' : '###'} ${n.code} — ${n.title}${n.kind === 'star' ? ` · ${maturity[n.status].label}${n.milestone ? ` (${n.milestone})` : ''} · ${priorityMeta[n.priority].label}` : ''}`;
    const d = n.details;
    const body = [
      n.kind === 'star' && n.statusNote ? `Stato: ${n.statusNote}` : '',
      n.planets.length ? `Pianeti: ${n.planets.map(x => `${x.name}${x.moons.length ? ` [${x.moons.map(m => m.name).join('; ')}]` : ''}`).join(', ')}` : '',
      d.problems.length ? `Problemi: ${d.problems.join(' | ')}` : '',
      d.future.length ? `Futuro: ${d.future.join(' | ')}` : '',
      d.ownerReports.length ? `Confermato dall’utente: ${d.ownerReports.map(r => r.text).join(' | ')}` : '',
      d.roadmapRefs.length ? `Riferimenti: ${d.roadmapRefs.join(', ')}` : '',
      n.note ? `Nota: ${n.note}` : '',
    ].filter(Boolean);
    return [head, ...body].join('\n');
  };
  const sec = (l: Layer) => `# ${layerLabel[l]}\n\n` + tree.filter(n => n.layer === l).map(line).join('\n\n');
  const rel = '# Relazioni concettuali (proposte)\n' + relations.map(r => `- ${r.fromId} ${relationKindLabel[r.kind].toLowerCase()} ${r.toId}: ${r.explanation}`).join('\n');
  const work = '# Prossimo ordine operativo\n' + workPath.map(w => `- ${w.code} ${w.title}: ${w.starIds.join(', ')}`).join('\n');
  return [`# Serveria / Cora — schema ad albero (${sourceVersion})`, sec('root'), sec('trunk'), sec('branch'), rel, work, '# Dove guardare se…\n' + diagnostics.map(d => `- ${d.symptom}: ${d.look.join(', ')}`).join('\n')].join('\n\n');
}
/** Kept for older imports: list of filter labels. */
export const branches = groups.map(g => g.label);
