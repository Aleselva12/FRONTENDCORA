export type ServiceState = 'running' | 'stopped' | 'restarting' | 'unhealthy';
export type ServiceGroup = 'core' | 'apps' | 'ai' | 'infra';
export interface ServiceItem { id: string; name: string; image: string; group: ServiceGroup; state: ServiceState; machine: string; ports: string; cpu: number; ram: number; uptime: string; stack: string; volumes: string[]; logs: string[]; note: string }
export const groupLabels: Record<ServiceGroup, string> = { core: 'Nucleo Cora', apps: 'Programmi', ai: 'Modelli IA', infra: 'Infrastruttura' };
export const stateLabels: Record<ServiceState, string> = { running: 'Attivo', stopped: 'Fermo', restarting: 'Riavvio', unhealthy: 'Non sano' };
export const services: ServiceItem[] = [
  { id: 'cora-api', name: 'Cora API', image: 'serveria/cora:0.9-demo', group: 'core', state: 'running', machine: 'Server Debian', ports: '8000→8000', cpu: 12, ram: 640, uptime: '6g 4h', stack: 'serveria-core', volumes: ['/srv/cora/data', '/srv/cora/config'], logs: ['21:02 richiesta /chat completata', '21:05 context manager aggiornato'], note: 'Coordinatore principale. Valori di esempio.' },
  { id: 'context-manager', name: 'Context manager', image: 'serveria/context:0.4-demo', group: 'core', state: 'running', machine: 'Server Debian', ports: 'interno', cpu: 4, ram: 310, uptime: '6g 4h', stack: 'serveria-core', volumes: ['/srv/cora/memory'], logs: ['20:58 snapshot memoria di lavoro'], note: 'Gestisce la memoria di lavoro.' },
  { id: 'postgres', name: 'PostgreSQL', image: 'postgres:16', group: 'infra', state: 'running', machine: 'Server Debian', ports: '5432', cpu: 3, ram: 420, uptime: '12g', stack: 'serveria-core', volumes: ['/srv/db/pg'], logs: ['21:00 checkpoint completato'], note: 'Database principale.' },
  { id: 'immich', name: 'Immich', image: 'ghcr.io/immich-app/immich-server', group: 'apps', state: 'unhealthy', machine: 'Server Debian', ports: '2283', cpu: 28, ram: 1450, uptime: '2h', stack: 'immich', volumes: ['/mnt/nas/foto'], logs: ['20:41 controllo salute fallito', '20:43 nuovo tentativo'], note: 'Aggiornamento previsto in W2.' },
  { id: 'nextcloud', name: 'Nextcloud', image: 'nextcloud:29', group: 'apps', state: 'running', machine: 'NAS', ports: '8080', cpu: 6, ram: 520, uptime: '3g', stack: 'nextcloud', volumes: ['/mnt/nas/cloud'], logs: ['19:30 sincronizzazione file'], note: 'Aggiornamento previsto in W2.' },
  { id: 'magazzino', name: 'Magazzino Tele', image: 'serveria/magazzino:demo', group: 'apps', state: 'stopped', machine: 'Server Debian', ports: '3010', cpu: 0, ram: 0, uptime: '—', stack: 'gestionali', volumes: ['/srv/magazzino'], logs: ['ieri 18:00 arresto manuale'], note: 'Fermo nella demo.' },
  { id: 'ollama', name: 'Ollama', image: 'ollama/ollama', group: 'ai', state: 'running', machine: 'Server Debian', ports: '11434', cpu: 35, ram: 6200, uptime: '1g', stack: 'ai', volumes: ['/srv/models'], logs: ['21:06 modello caricato in GPU'], note: 'Modelli locali.' },
  { id: 'whisper', name: 'Whisper', image: 'serveria/whisper:demo', group: 'ai', state: 'restarting', machine: 'Worker F1', ports: '9000', cpu: 0, ram: 900, uptime: '0m', stack: 'ai', volumes: ['/data/audio'], logs: ['21:07 riavvio in corso'], note: 'Trascrizioni audio.' },
  { id: 'caddy', name: 'Reverse proxy', image: 'caddy:2', group: 'infra', state: 'running', machine: 'Server Debian', ports: '80, 443', cpu: 1, ram: 60, uptime: '12g', stack: 'rete', volumes: ['/srv/caddy'], logs: ['20:00 certificati validi'], note: 'Ingresso web.' },
];
export function filterServices(list: ServiceItem[], f: { query: string; group: ServiceGroup | 'all'; state: ServiceState | 'all' }) {
  const q = f.query.trim().toLowerCase();
  return list.filter(s => (f.group === 'all' || s.group === f.group) && (f.state === 'all' || s.state === f.state) && (!q || `${s.name} ${s.image} ${s.stack} ${s.machine}`.toLowerCase().includes(q)));
}
export function applyAction(s: ServiceItem, action: 'start' | 'stop' | 'restart'): ServiceItem {
  if (action === 'stop') return { ...s, state: 'stopped', cpu: 0, ram: 0, uptime: '—' };
  return { ...s, state: 'running', uptime: '0m', cpu: s.cpu || 2, ram: s.ram || 120 };
}
