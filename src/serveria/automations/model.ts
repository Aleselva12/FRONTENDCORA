import type { Node, Edge } from '@xyflow/react';
export type StepData = { label: string; kind: string; subtitle: string; complete?: boolean; [key: string]: unknown };
export type FlowNode = Node<StepData>;
export const tools = [
  { kind: 'trigger', label: 'Evento / Webhook', subtitle: 'Ingresso nel flusso', category: 'Trigger' },
  { kind: 'schedule', label: 'Pianificazione', subtitle: 'Orari e ricorrenze', category: 'Trigger' },
  { kind: 'brain', label: 'Cora · AI Agent', subtitle: 'Ragionamento e contesto', category: 'Intelligenza' },
  { kind: 'search', label: 'Ricerca semantica', subtitle: 'Memoria e documenti', category: 'Intelligenza' },
  { kind: 'branch', label: 'Condizione', subtitle: 'Decisione e instradamento', category: 'Logica' },
  { kind: 'code', label: 'Code sandbox', subtitle: 'Trasformazione isolata', category: 'Logica' },
  { kind: 'http', label: 'Richiesta HTTP', subtitle: 'Servizi e API', category: 'Azioni' },
  { kind: 'archive', label: 'Archivio Serveria', subtitle: 'File e conoscenza', category: 'Azioni' },
  { kind: 'approval', label: 'Approvazione umana', subtitle: 'Supervisione e consenso', category: 'Controllo' },
  { kind: 'shield', label: 'Policy guard', subtitle: 'Permessi e sicurezza', category: 'Controllo' },
  { kind: 'message', label: 'Notifica workspace', subtitle: 'Risultato della routine', category: 'Azioni' },
  { kind: 'agent', label: 'Agent swarm', subtitle: 'Squadra multi-agente · concept', category: 'Intelligenza' },
];
export const templates = [
  { name: 'Briefing intelligente', description: 'Il contesto giusto, prima di iniziare.', category: 'PERSONAL INTELLIGENCE', kinds: ['schedule', 'search', 'brain', 'branch', 'message', 'approval', 'archive'] },
  { name: 'Documenti → conoscenza', description: 'Dal nuovo file alla memoria condivisa.', category: 'KNOWLEDGE PIPELINE', kinds: ['trigger', 'code', 'brain', 'shield', 'archive'] },
  { name: 'Server sentinella', description: 'Osserva, interpreta, prepara un intervento.', category: 'SYSTEM OPERATIONS', kinds: ['schedule', 'http', 'brain', 'approval', 'message'] },
  { name: 'Missione multi-agente', description: 'Una missione, più intelligenze coordinate.', category: 'FUTURE LAB', kinds: ['trigger', 'agent', 'brain', 'approval', 'archive'] },
];
export function makeFlow(index: number): { nodes: FlowNode[]; edges: Edge[] } {
  const template = templates[index] ?? templates[0];
  if (!template) return { nodes: [], edges: [] };
  const nodes = template.kinds.map((kind, i) => {
    const tool = tools.find(t => t.kind === kind);
    return { id: `step-${i}`, type: 'serveria', position: { x: i < 4 ? i * 220 : i === 4 ? 880 : (i - 2) * 220, y: i < 5 ? 80 : 290 }, data: { label: tool?.label ?? kind, kind, subtitle: tool?.subtitle ?? '' } };
  });
  const pairs = index === 0 ? [[0,1],[1,2],[2,3],[3,4],[3,5],[5,6]] : nodes.slice(1).map((_,i) => [i,i+1]);
  const edges = pairs.map(([a,b]) => ({ id: `edge-${a}-${b}`, source: `step-${a}`, target: `step-${b}`, type: 'smoothstep', label: index === 0 && a === 3 ? b === 4 ? 'pronto' : 'da approvare' : undefined }));
  return { nodes, edges };
}
// A local preview only: reachable steps, not an execution engine or external call.
export function simulationOrder(nodes: FlowNode[], edges: Edge[]): string[] {
  const root = nodes.find(n => ['trigger', 'schedule'].includes(n.data.kind));
  if (!root) return [];
  const valid = new Set(nodes.map(n => n.id));
  const visited = new Set<string>(); const queue = [root.id];
  while (queue.length) {
    const id = queue.shift(); if (!id || visited.has(id) || !valid.has(id)) continue;
    visited.add(id); edges.filter(e => e.source === id).forEach(e => queue.push(e.target));
  }
  return [...visited];
}
