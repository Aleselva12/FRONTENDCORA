export type Severity = 'info' | 'warning' | 'error';
export type EventKind = 'service' | 'pipeline' | 'security' | 'task';
export type RunState = 'completed' | 'failed' | 'waiting' | 'unknown';
export type TriggerKind = 'manual' | 'schedule' | 'agent';
export type OperationState = RunState | 'skipped';
export interface OperationStep {
  id: string; parent?: string; title: string; time: string; duration?: number;
  state: OperationState; source: string; machine: string; input: string; output: string;
  evidence: string; issue?: string; next?: string;
}
export interface OperationRun {
  id: string; title: string; kind: EventKind; trigger: TriggerKind; actor: string;
  time: string; state: RunState; expected: string; actual: string;
  activityId?: string; steps: OperationStep[];
}
export interface AuditEvent {
  id: string; time: string; severity: Severity; kind: EventKind; source: string;
  title: string; summary: string; actor: string; machine: string; trace: string;
  outcome: string; reason: string; steps: string[]; raw: string; runId?: string; stepId?: string;
}
export const severityLabels: Record<Severity, string> = { info: 'Info', warning: 'Avviso', error: 'Errore' };
export const kindLabels: Record<EventKind, string> = { service: 'Servizi', pipeline: 'Collaudi & pipeline', security: 'Sicurezza', task: 'Backup & routine' };
export const runStateLabels: Record<OperationState, string> = { completed: 'Concluso', failed: 'Interrotto', waiting: 'In attesa', unknown: 'Esito non documentato', skipped: 'Non eseguito' };
export const triggerLabels: Record<TriggerKind, string> = { manual: 'Manuale', schedule: 'Pianificato', agent: 'Delegato dall’IA' };
const operation = (id: string, title: string, state: OperationState, time: string, fields: Partial<OperationStep> = {}): OperationStep => ({ id, title, state, time, source: 'Runner collaudi', machine: 'Server Debian', input: 'Parametri del processo di esempio', output: 'Risultato illustrativo', evidence: 'Scenario inventato; nessun log raccolto dal server.', ...fields });
export const operationRuns: OperationRun[] = [
  { id: 'OPS-TEST-01', title: 'Collaudo applicazioni → aggiorna albero', kind: 'pipeline', trigger: 'manual', actor: 'Alessandro · esempio', time: '10:25:00', state: 'failed', expected: 'Collaudare Immich e Nextcloud; proporre lo stato aggiornato nella Roadmap.', actual: 'Controlli conclusi nello scenario. Scrittura metadati bloccata; albero invariato.', steps: [
    operation('test-trigger', 'Pulsante collaudo ricevuto', 'completed', '10:25:00', { duration: 20, source: 'Interfaccia', input: 'Collauda applicazioni · richiesta TEST-DEMO-01', output: 'Run OPS-TEST-01 associata al clic, una sola volta.' }),
    operation('test-apps', 'Verifica Immich e Nextcloud', 'completed', '10:25:01', { parent: 'test-trigger', duration: 620, input: 'Servizi Immich, Nextcloud', output: 'Controlli di disponibilità: 2/2 nello scenario · exit 0.' }),
    operation('test-api', 'Verifica risposte applicazioni', 'completed', '10:25:02', { parent: 'test-apps', duration: 140, input: 'Endpoint di controllo di esempio', output: 'Risposte illustrative 200; nessuna richiesta HTTP inviata.' }),
    operation('test-tree', 'Scrivi metadati Roadmap', 'failed', '10:25:03', { parent: 'test-api', duration: 40, source: 'Generatore albero', input: 'Rapporto collaudo → file di metadati', output: 'Scrittura rifiutata · EACCES (scenario).', issue: 'Il file di metadati è in sola lettura nello scenario. Non è una diagnosi del problema reale.', next: 'Confrontare permessi, percorso e log del generatore nel sistema reale. Conservare il rapporto di collaudo.' }),
    operation('test-refresh', 'Conferma aggiornamento albero', 'skipped', '10:25:03', { parent: 'test-tree', source: 'Roadmap', input: 'Metadati validati', output: 'Non avviato: dipendenza fallita. Nessuna stella o priorità modificata.' }),
  ] },
  { id: 'OPS-BACKUP-01', title: 'Backup notturno → verifica archivio', kind: 'task', trigger: 'schedule', actor: 'Pianificatore · esempio', time: '02:00:00', state: 'completed', expected: 'Creare una copia e verificarne l’integrità.', actual: 'Copia e verifica concluse nello scenario; nessun archivio reale creato.', steps: [
    operation('backup-start', 'Avvio pianificato', 'completed', '02:00:00', { source: 'Pianificatore', duration: 12, output: 'Archivio Cora & database selezionato.' }),
    operation('backup-copy', 'Copia su NAS', 'completed', '02:00:01', { parent: 'backup-start', source: 'Backup', machine: 'NAS', duration: 34000, output: 'Snapshot DEMO-S01 rappresentato.' }),
    operation('backup-check', 'Verifica integrità', 'completed', '02:00:35', { parent: 'backup-copy', source: 'Verificatore', machine: 'NAS', duration: 1800, output: 'Checksum concordanti nello scenario; ripristino non collaudato.' }),
  ] },
  { id: 'OPS-WORKER-01', title: 'Connessione Worker F1 → consegna lavoro', kind: 'service', trigger: 'agent', actor: 'Programmatore · esempio', activityId: 'DEMO-W01', time: '08:56:00', state: 'waiting', expected: 'Ricevere una conferma di presa in carico del lavoro delegato.', actual: 'Connessione illustrata; nessun lavoro consegnato. Autorizzazione in attesa.', steps: [
    operation('worker-connect', 'Canale worker disponibile', 'completed', '08:56:00', { source: 'Trasporto worker', machine: 'Worker F1', duration: 210, input: 'Richiesta di connessione F1', output: 'Canale aperto nello scenario, non prova l’esecuzione.' }),
    operation('worker-delivery', 'Attesa autorizzazione alla consegna', 'waiting', '08:56:01', { parent: 'worker-connect', source: 'Coda lavori', machine: 'Worker F1', input: 'Compito di analisi proposto dall’IA', output: 'Nessun job avviato.', issue: 'Manca l’autorizzazione al compito; una connessione non equivale a un lavoro assegnato.', next: 'Rivedere ambito e permessi nella richiesta IA collegata.' }),
  ] },
  { id: 'OPS-ACCESS-01', title: 'Accesso remoto → verifica permessi', kind: 'security', trigger: 'manual', actor: 'Sessione remota · esempio', time: '08:40:00', state: 'failed', expected: 'Accedere al servizio solo con permessi validi.', actual: 'Accesso rifiutato nello scenario; nessuna modifica.', steps: [
    operation('access-request', 'Richiesta di accesso', 'completed', '08:40:00', { source: 'Gateway', duration: 10, input: 'Profilo remoto di sola lettura', output: 'Richiesta identificata nello scenario.' }),
    operation('access-policy', 'Controllo autorizzazione', 'failed', '08:40:01', { parent: 'access-request', source: 'Permessi', duration: 8, input: 'Operazione che richiede scrittura', output: 'Accesso negato · 403 illustrativo.', issue: 'Il profilo non autorizza la scrittura richiesta.', next: 'Verificare il profilo senza ampliare automaticamente i permessi.' }),
  ] },
];
function severityFor(state: OperationState): Severity { return state === 'failed' ? 'error' : state === 'completed' ? 'info' : 'warning'; }
export const auditEvents: AuditEvent[] = operationRuns.flatMap(run => run.steps.map((s): AuditEvent => {
  const id = `EVT-${s.id}`;
  return { id, time: s.time, severity: severityFor(s.state), kind: run.kind, source: s.source, title: s.title, summary: s.output, actor: run.actor, machine: s.machine, trace: run.id, runId: run.id, stepId: s.id, outcome: runStateLabels[s.state], reason: s.issue ?? run.expected, steps: [s.input, s.output], raw: JSON.stringify({ demo: true, domain: 'system', runId: run.id, trigger: run.trigger, activityId: run.activityId, ...s }, null, 2) };
})).concat([{ id: 'EVT-unlinked', time: '08:30:00', severity: 'warning', kind: 'service', source: 'Indice documentale', title: 'Indicizzazione senza correlazione', summary: 'Un risultato di controllo è presente, senza identificativo di esecuzione.', actor: 'Verificatore · esempio', machine: 'Server Debian', trace: '', outcome: 'Origine non attribuibile', reason: 'Manca un runId: non è possibile ricostruire una catena affidabile.', steps: [], raw: JSON.stringify({ demo: true, domain: 'system', runId: null, evidence: 'Scenario non correlato' }, null, 2) }]).sort((a, b) => b.time.localeCompare(a.time));
export interface EventFilter { query: string; severity: Severity | 'all'; kind: EventKind | 'all'; machine: string; trace: string | null }
export function filterEvents(events: AuditEvent[], filter: EventFilter) {
  const query = filter.query.trim().toLocaleLowerCase('it');
  return events.filter(event => (filter.severity === 'all' || event.severity === filter.severity)
    && (filter.kind === 'all' || event.kind === filter.kind)
    && (filter.machine === 'all' || event.machine === filter.machine)
    && (!filter.trace || event.trace === filter.trace)
    && `${event.id} ${event.title} ${event.summary} ${event.actor} ${event.source} ${event.trace}`.toLocaleLowerCase('it').includes(query));
}
export interface RunFilter { query: string; kind: EventKind | 'all'; machine: string; state: RunState | 'all'; trigger: TriggerKind | 'all'; trace: string | null }
export function filterRuns(runs: OperationRun[], filter: RunFilter) {
  const q = filter.query.trim().toLocaleLowerCase('it');
  return runs.filter(r => (filter.kind === 'all' || r.kind === filter.kind) && (filter.state === 'all' || r.state === filter.state)
    && (filter.trigger === 'all' || r.trigger === filter.trigger) && (!filter.trace || r.id === filter.trace)
    && (filter.machine === 'all' || r.steps.some(s => s.machine === filter.machine))
    && `${r.id} ${r.title} ${r.actor} ${r.actual} ${r.steps.map(s => `${s.title} ${s.input} ${s.output} ${s.issue ?? ''}`).join(' ')}`.toLocaleLowerCase('it').includes(q));
}
export function runBlocker(run: OperationRun) { return run.steps.find(s => s.state === 'failed' || s.state === 'waiting' || s.state === 'unknown'); }
