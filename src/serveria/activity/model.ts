export type StepState = 'completed' | 'failed' | 'uncertain' | 'waiting';
export type StepKind = 'agent' | 'model' | 'tool' | 'event';
export interface ExplorerStep {
  id: string; parent?: string; name: string; kind: StepKind; state: StepState;
  time: number; duration?: number; machine: string; input: string; output: string;
  evidence: string; issue?: string; next?: string; x: number; y: number;
}
export interface ExplorerRun { domain: 'ai'; operationId?: string; model: string; context: string; expected: string; actual: string; authorization: string; id: string; title: string; time: string; state: StepState; request: string; steps: ExplorerStep[] }
export const stateLabels: Record<StepState, string> = { completed: 'Concluso', failed: 'Interrotto', uncertain: 'Esito incerto', waiting: 'In attesa' };
export const kindLabels: Record<StepKind, string> = { agent: 'Agente', model: 'Modello', tool: 'Strumento', event: 'Evento' };
const step = (id: string, name: string, kind: StepKind, state: StepState, time: number, x: number, y: number, fields: Partial<ExplorerStep> = {}): ExplorerStep => ({ id, name, kind, state, time, x, y, machine: 'Server Debian · esempio', input: 'Richiesta del passaggio precedente', output: 'Risultato illustrativo disponibile', evidence: 'Traccia dimostrativa, non osservata sul server.', ...fields });
export const explorerRuns: ExplorerRun[] = [
  { domain: 'ai', model: 'Whisper + classificatore · esempio', context: 'Progetto Serveria; esclusi documenti personali.', expected: 'Trascrizione classificata e salvata nel Drive.', actual: 'Trascrizione pronta; scrittura negata. Notifica non attribuibile.', authorization: 'Scrittura Drive non concessa nello scenario.', id: 'DEMO-A01', title: 'Trascrivi e archivia un appunto', time: '09:24', state: 'failed', request: 'Trascrivi la riunione e salva gli appunti nel Drive, divisi per argomento.', steps: [
    step('a-cora', 'Cora', 'agent', 'completed', 0, 12, 50, { duration: 120, input: 'Audio: riunione-progetto.m4a', output: 'Richiesta assegnata al percorso audio.' }),
    step('a-context', 'Context Manager', 'agent', 'completed', 120, 36, 50, { parent: 'a-cora', duration: 80, output: 'Contesto: progetto Serveria, appunti in italiano.' }),
    step('a-whisper', 'Whisper', 'model', 'completed', 200, 61, 25, { parent: 'a-context', duration: 4200, input: 'Audio · 12 minuti', output: 'Trascrizione disponibile · 2 interlocutori.' }),
    step('a-classify', 'Classifica appunti', 'model', 'completed', 4400, 85, 25, { parent: 'a-whisper', duration: 860, output: '3 argomenti: roadmap, worker, calendario.' }),
    step('a-memory', 'Memoria simbolica', 'tool', 'completed', 240, 61, 75, { parent: 'a-context', duration: 160, output: 'Concetti di progetto recuperati in parallelo.' }),
    step('a-drive', 'Scrittura Drive', 'tool', 'failed', 5260, 85, 75, { parent: 'a-classify', duration: 240, input: 'Drive / Serveria / Appunti', output: 'Nessun file salvato nello scenario.', issue: 'La destinazione non concede la scrittura.', next: 'Verificare il percorso e i permessi prima di riprovare. La trascrizione resta disponibile.' }),
    step('a-event', 'Notifica telefono', 'event', 'uncertain', 5500, 50, 50, { output: 'Ricezione non documentata.', evidence: 'Evento di esempio senza identificativo del passaggio padre.', issue: 'Manca una correlazione: non è possibile attribuire la notifica a una chiamata.', next: 'Registrare un identificativo comune e una conferma di consegna.' }),
  ] },
  { domain: 'ai', model: 'Interprete calendario · esempio', context: 'Calendario C1; chiave anti-duplicazione.', expected: 'Un evento e una notifica sul telefono.', actual: 'Un evento e consegna illustrati; nessuna operazione reale.', authorization: 'Creazione rappresentata come autorizzata nello scenario.', id: 'DEMO-C01', title: 'Crea un appuntamento', time: '09:10', state: 'completed', request: 'Aggiungi la revisione Serveria di lunedì e avvisami sul telefono.', steps: [
    step('c-cora', 'Cora', 'agent', 'completed', 0, 12, 50, { input: 'Richiesta calendario', duration: 100 }),
    step('c-model', 'Interpreta richiesta', 'model', 'completed', 100, 37, 50, { parent: 'c-cora', duration: 650, output: 'Lunedì · revisione Serveria · 10:00.' }),
    step('c-create', 'Crea evento una volta', 'tool', 'completed', 750, 63, 50, { parent: 'c-model', duration: 130, input: 'Chiave univoca: revisione-lunedi-demo', output: 'Un solo evento nello scenario dimostrativo.' }),
    step('c-phone', 'Notifica telefono', 'tool', 'completed', 880, 88, 50, { parent: 'c-create', duration: 90, output: 'Consegna illustrativa, non inviata.' }),
  ] },
  { domain: 'ai', operationId: 'OPS-WORKER-01', model: 'Modello codice · esempio', context: 'Analisi Serveria, sola lettura; nessuna modifica ai file.', expected: 'Delegare analisi al Worker F1 con conferma.', actual: 'Proposta pronta; consegna in attesa di autorizzazione.', authorization: 'Delega non autorizzata; nessun compito avviato.', id: 'DEMO-W01', title: 'Assegna lavoro al Worker F1', time: '08:56', state: 'waiting', request: 'Delega l’analisi del progetto al computer worker.', steps: [
    step('w-cora', 'Cora', 'agent', 'completed', 0, 12, 50, { duration: 140 }),
    step('w-plan', 'Programmatore', 'agent', 'completed', 140, 37, 50, { parent: 'w-cora', duration: 420, output: 'Proposta di analisi preparata. Nessuna modifica ai file.' }),
    step('w-connect', 'Connetti Worker F1', 'tool', 'completed', 560, 63, 50, { parent: 'w-plan', duration: 210, machine: 'Worker F1 · esempio', output: 'Connessione illustrata: non prova l’esecuzione di un lavoro.' }),
    step('w-assign', 'Assegna lavoro', 'tool', 'waiting', 770, 88, 50, { parent: 'w-connect', machine: 'Worker F1 · esempio', output: 'Nessun lavoro assegnato.', issue: 'L’autorizzazione al lavoro è ancora in attesa.', next: 'Rivedere ambito e permessi del compito prima della delega.' }),
  ] },
];
export function stepsAt(run: ExplorerRun, cursor: number | null): ExplorerStep[] {
  const chronological = [...run.steps].sort((a, b) => a.time - b.time);
  return cursor === null ? chronological : chronological.slice(0, cursor + 1);
}
export function graphSteps(steps: ExplorerStep[]): ExplorerStep[] {
  return steps.filter(s => s.kind !== 'event');
}
export function runIssues(run: ExplorerRun) { return run.steps.filter(s => s.issue); }
export function filterActivitySteps(steps: ExplorerStep[], kind: StepKind | 'all', onlyIssues: boolean) {
  return steps.filter(s => (kind === 'all' || s.kind === kind) && (!onlyIssues || Boolean(s.issue)));
}
export function activitySummary(run: ExplorerRun) {
  return { duration: Math.max(...run.steps.map(s => s.time + (s.duration ?? 0))), uncorrelated: run.steps.filter(s => s.kind === 'event' && !s.parent), problems: runIssues(run), history: [] };
}
