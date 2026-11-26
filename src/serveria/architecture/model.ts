// Illustrative AI control plan. Browser-only demo data: nothing here reflects or controls live services.
export type ViewId = "flow" | "cluster" | "security";
export type Autonomy = 1 | 2 | 3;
export type NodeKind = "input" | "core" | "memory" | "agent" | "tool" | "machine" | "output";

export interface PlanNode {
  id: string; name: string; kind: NodeKind; description: string;
  autonomy: Autonomy; machine: string; model?: string; engine?: string;
  vramGb?: number; permissions: string[]; trace?: string[];
}
export interface PlanEdge { source: string; target: string; label: string }
export interface PlanView { id: ViewId; label: string; hint: string; positions: Record<string, { x: number; y: number }>; edges: PlanEdge[] }

export const nodes: PlanNode[] = [
  { id: "chat", name: "Chat", kind: "input", description: "Conversazioni e richieste veloci dalla Home.", autonomy: 1, machine: "debian", permissions: ["lettura"] },
  { id: "audio_in", name: "Audio", kind: "input", description: "Note vocali e registrazioni da trascrivere.", autonomy: 1, machine: "debian", permissions: ["lettura"] },
  { id: "routine", name: "Routine", kind: "input", description: "Lavori pianificati: backup notturno, controllo aggiornamenti.", autonomy: 2, machine: "debian", permissions: ["lettura", "scrittura"] },
  { id: "cora", name: "Cora", kind: "core", description: "Supervisore: capisce la richiesta, sceglie l'agente e controlla i permessi.", autonomy: 2, machine: "debian", model: "Qwen 2.5 14B", engine: "Ollama", vramGb: 9.2, permissions: ["lettura", "delega"], trace: ["Riceve la richiesta", "Legge il contesto", "Sceglie l'agente", "Verifica il livello di autonomia", "Restituisce la risposta"] },
  { id: "context", name: "Context manager", kind: "memory", description: "Prepara il contesto giusto per ogni richiesta.", autonomy: 1, machine: "debian", permissions: ["lettura"] },
  { id: "memory", name: "Memoria", kind: "memory", description: "Memoria simbolica, database e indice vettoriale.", autonomy: 1, machine: "debian", engine: "PostgreSQL · indice vettoriale", permissions: ["lettura", "scrittura"] },
  { id: "programmer", name: "Programmatore", kind: "agent", description: "Legge il codice, propone modifiche e prepara commit di prova.", autonomy: 2, machine: "f1", model: "Qwen 2.5 Coder 14B", engine: "Ollama", vramGb: 9.8, permissions: ["lettura", "scrittura su branch"], trace: ["Riceve il compito", "Apre i file", "Scrive la proposta", "Mostra la differenza", "Aspetta il tuo OK per unire"] },
  { id: "audio_agent", name: "Audio", kind: "agent", description: "Trascrive e classifica gli appunti in Drive o nel database.", autonomy: 1, machine: "debian", model: "Whisper large-v3", engine: "faster-whisper", vramGb: 3.1, permissions: ["lettura", "scrittura appunti"], trace: ["Nuovo audio", "Trascrizione", "Riassunto e azioni", "Classificazione", "Salvataggio in Drive"] },
  { id: "docs", name: "Documenti", kind: "agent", description: "Cerca nei file del NAS e nei preventivi storici.", autonomy: 1, machine: "debian", model: "BGE-M3", engine: "Ollama", vramGb: 1.2, permissions: ["lettura"] },
  { id: "quotes", name: "Preventivi", kind: "agent", description: "Bozze di preventivo e controllo scorte di Magazzino Tele.", autonomy: 2, machine: "debian", model: "Qwen 2.5 14B", engine: "Ollama", permissions: ["lettura", "bozze"] },
  { id: "agent_zero", name: "Agent Zero", kind: "agent", description: "Agente remoto per compiti lunghi, con ripiego se offline.", autonomy: 3, machine: "f1", model: "DeepSeek R1 14B", engine: "Ollama", vramGb: 9.0, permissions: ["lettura", "shell in sandbox"] },
  { id: "terminal", name: "Terminale", kind: "tool", description: "Comandi sul server: sempre con la tua approvazione.", autonomy: 3, machine: "debian", permissions: ["shell"] },
  { id: "apps", name: "Programmi", kind: "tool", description: "Immich, Nextcloud, Magazzino Tele.", autonomy: 2, machine: "debian", permissions: ["api interne"] },
  { id: "email", name: "Email esterne", kind: "tool", description: "Invio a clienti e fornitori: richiede conferma.", autonomy: 3, machine: "debian", permissions: ["rete esterna"] },
  { id: "notify", name: "Notifiche", kind: "output", description: "Avvisi sul telefono e riepiloghi.", autonomy: 1, machine: "debian", permissions: ["rete esterna"] },
  { id: "debian", name: "Server Debian", kind: "machine", description: "Orchestratore, container, database e GPU principale (12 GB).", autonomy: 2, machine: "debian", permissions: [] },
  { id: "f1", name: "Worker F1", kind: "machine", description: "Laptop con GPU per codice e compiti pesanti.", autonomy: 2, machine: "f1", permissions: [] },
  { id: "nas", name: "NAS", kind: "machine", description: "Archivio file, foto e backup.", autonomy: 1, machine: "nas", permissions: [] },
];

const col = (ids: string[], x: number) => Object.fromEntries(ids.map((id, i) => [id, { x, y: 70 + (i * 380) / Math.max(ids.length - 1, 1) }]));

export const views: PlanView[] = [
  { id: "flow", label: "Flusso", hint: "Come una richiesta attraversa Cora fino agli strumenti.",
    positions: { ...col(["chat", "audio_in", "routine"], 80), cora: { x: 340, y: 260 }, context: { x: 340, y: 90 }, memory: { x: 340, y: 430 },
      ...col(["programmer", "audio_agent", "docs", "quotes", "agent_zero"], 610), ...col(["terminal", "apps", "email", "notify"], 880) },
    edges: [
      { source: "chat", target: "cora", label: "richiesta" }, { source: "audio_in", target: "audio_agent", label: "file audio" }, { source: "routine", target: "cora", label: "pianificato" },
      { source: "context", target: "cora", label: "contesto" }, { source: "memory", target: "context", label: "ricordi" },
      ...["programmer", "audio_agent", "docs", "quotes", "agent_zero"].map(t => ({ source: "cora", target: t, label: "delega" })),
      { source: "programmer", target: "terminal", label: "comando" }, { source: "agent_zero", target: "terminal", label: "comando" },
      { source: "quotes", target: "apps", label: "Magazzino" }, { source: "quotes", target: "email", label: "invio" },
      { source: "audio_agent", target: "memory", label: "appunti" }, { source: "docs", target: "apps", label: "Nextcloud" }, { source: "cora", target: "notify", label: "avviso" },
    ] },
  { id: "cluster", label: "Macchine", hint: "Dove gira ogni parte: server, worker e archivio.",
    positions: { debian: { x: 340, y: 260 }, f1: { x: 780, y: 140 }, nas: { x: 780, y: 400 },
      ...col(["cora", "audio_agent", "docs", "quotes", "memory"], 120), programmer: { x: 600, y: 70 }, agent_zero: { x: 600, y: 210 } },
    edges: [
      ...["cora", "audio_agent", "docs", "quotes", "memory"].map(s => ({ source: s, target: "debian", label: "gira su" })),
      { source: "programmer", target: "f1", label: "gira su" }, { source: "agent_zero", target: "f1", label: "gira su" },
      { source: "debian", target: "f1", label: "delega GPU" }, { source: "debian", target: "nas", label: "backup e file" },
    ] },
  { id: "security", label: "Permessi", hint: "Cosa Cora fa da sola, cosa ti avvisa e cosa chiede il tuo OK.",
    positions: { cora: { x: 500, y: 260 },
      ...col(["docs", "audio_agent", "context", "notify"], 120),
      programmer: { x: 330, y: 450 }, quotes: { x: 500, y: 470 }, apps: { x: 670, y: 450 }, routine: { x: 500, y: 60 },
      ...col(["terminal", "email", "agent_zero"], 880) },
    edges: [
      ...["docs", "audio_agent", "context", "notify", "programmer", "quotes", "apps", "routine", "terminal", "email", "agent_zero"].map(t => ({ source: "cora", target: t, label: "" })),
    ] },
];

export const autonomyLevels: { level: Autonomy; title: string; text: string; examples: string[] }[] = [
  { level: 1, title: "Autonomo", text: "Cora agisce da sola.", examples: ["Leggere documenti", "Trascrivere audio", "Classificare file", "Consultare la memoria"] },
  { level: 2, title: "Con avviso", text: "Cora agisce e ti avvisa.", examples: ["Bozze di preventivo", "Commit su branch di prova", "Creare un appuntamento", "Aggiornare l'indice"] },
  { level: 3, title: "Serve il tuo OK", text: "Cora si ferma e aspetta.", examples: ["Comandi nel terminale", "Modifiche al sistema", "Email esterne", "Eliminare o ripristinare"] },
];

export const nodeById = (id: string) => nodes.find(n => n.id === id);
export const agents = nodes.filter(n => n.kind === "agent" || n.kind === "core");
export const needsApproval = (n: PlanNode, override?: Autonomy) => (override ?? n.autonomy) === 3;
export const vramOn = (machine: string) => nodes.filter(n => n.machine === machine && n.vramGb).reduce((s, n) => s + (n.vramGb ?? 0), 0);
