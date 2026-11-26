import V2RepositoryStatus from "./V2RepositoryStatus";
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Bot, Circle, Cpu, HardDrive, Laptop, MemoryStick, Server, Thermometer, TriangleAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Demo monitor: every value is invented and animated in the browser; no machine is contacted.
type State = 'up' | 'warn' | 'down';
interface Machine { id: string; name: string; kind: string; icon: typeof Server; state: State; role: string; cpu: number; ram: number; disk: number; temp: number; gpu?: number; jobs: string[]; uptime: string }
const machines: Machine[] = [
  { id: 'server', name: 'Serveria · Debian', kind: 'Server principale', icon: Server, state: 'up', role: 'Cora, database, Ollama, programmi', cpu: 34, ram: 61, disk: 43, temp: 52, gpu: 28, jobs: ['trascrizione nota 17:20', 'indicizzazione Immich'], uptime: '14 g' },
  { id: 'nas', name: 'NAS', kind: 'Archivio', icon: HardDrive, state: 'warn', role: 'Foto, backup, file condivisi', cpu: 12, ram: 38, disk: 81, temp: 44, jobs: ['backup notturno'], uptime: '41 g' },
  { id: 'laptop', name: 'Laptop · worker F1', kind: 'Worker remoto', icon: Laptop, state: 'down', role: 'Calcolo extra, SQL in sola lettura', cpu: 0, ram: 0, disk: 57, temp: 0, gpu: 0, jobs: [], uptime: 'offline da 2 h' },
  { id: 'agent0', name: 'Agent Zero', kind: 'Agente remoto F2', icon: Bot, state: 'up', role: 'Compiti in staging, con approvazione', cpu: 22, ram: 47, disk: 29, temp: 48, jobs: ['ricerca documenti preventivi'], uptime: '3 g' },
];
const alerts = [
  { lvl: 'warn', text: 'NAS: disco all’81%', time: '17:40' },
  { lvl: 'err', text: 'Laptop worker non raggiungibile', time: '16:55' },
  { lvl: 'info', text: 'Agent Zero: compito in attesa di approvazione', time: '16:30' },
  { lvl: 'info', text: 'Backup database completato', time: '17:12' },
];
const jitter = (v: number) => v === 0 ? 0 : Math.max(2, Math.min(98, v + Math.round((Math.random() - 0.5) * 8)));

export default function V2Monitor() {
  const [sel, setSel] = useState('server');
  const [hist, setHist] = useState<Record<string, number[]>>(() => Object.fromEntries(machines.map(m => [m.id, Array(30).fill(m.cpu)])));
  useEffect(() => {
    const t = setInterval(() => setHist(h => Object.fromEntries(machines.map(m => [m.id, [...(h[m.id] ?? []).slice(1), jitter(m.cpu)]]))), 1500);
    return () => clearInterval(t);
  }, []);
  const m = machines.find(x => x.id === sel)!;
  const series = hist[m.id] ?? [];
  const cur = series[29] ?? m.cpu;
  const gauges = [
    { label: 'CPU', icon: Cpu, v: cur },
    { label: 'RAM', icon: MemoryStick, v: m.ram },
    { label: 'Disco', icon: HardDrive, v: m.disk },
    ...(m.gpu !== undefined ? [{ label: 'GPU', icon: Zap, v: m.gpu ?? 0 }] : []),
  ];

  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <div className="tm-layout">
        <aside className="tm-services" aria-label="Macchine">
          <span className="fs-caption">MACCHINE E WORKER</span>
          {machines.map(x => { const I = x.icon; return (
            <Button key={x.id} className={`mn-machine is-${x.state} ${x.id === sel ? 'is-active' : ''}`} onClick={() => setSel(x.id)}>
              <I size={15} /><span>{x.name}<small>{x.kind} · {x.uptime}</small></span><Circle size={8} />
            </Button>); })}
          <span className="fs-caption">RIEPILOGO</span>
          <div className="mn-sum"><b>{machines.filter(x => x.state === 'up').length}</b> online · <b>{machines.filter(x => x.state === 'warn').length}</b> attenzione · <b>{machines.filter(x => x.state === 'down').length}</b> offline</div>
        </aside>
        <main className="tm-main">
          <div className="pg-title"><div><span className="ops-overline">MONITOR / {m.kind.toUpperCase()}</span><h1>{m.name}<span>.</span></h1></div><span className={`mn-badge is-${m.state}`}>{m.state === 'up' ? 'online' : m.state === 'warn' ? 'attenzione' : 'offline'}</span></div>
          <p className="mn-role">{m.role}</p>
          <div className="mn-gauges">
            {gauges.map(g => { const I = g.icon; return (
              <div key={g.label} className={`mn-gauge ${g.v > 75 ? 'is-high' : ''}`}>
                <div className="mn-ring" style={{ ['--v' as string]: g.v }}><span>{m.state === 'down' ? '—' : `${g.v}%`}</span></div>
                <small><I size={11} /> {g.label}</small>
              </div>); })}
            <div className="mn-gauge"><div className="mn-ring is-temp" style={{ ['--v' as string]: m.temp }}><span>{m.temp ? `${m.temp}°` : '—'}</span></div><small><Thermometer size={11} /> Temp.</small></div>
          </div>
          <span className="fs-caption">CPU · ULTIMI 45 SECONDI</span>
          <div className="mn-spark" aria-label="Andamento CPU">{series.map((v, i) => <i key={i} style={{ height: `${Math.max(v, 1)}%` }} />)}</div>
          <span className="fs-caption">LAVORI IN CORSO</span>
          {m.jobs.length ? m.jobs.map(j => <div key={j} className="tm-log">▸ {j}</div>) : <small className="au-empty">{m.state === 'down' ? 'Worker offline: i lavori tornano al server.' : 'Nessun lavoro.'}</small>}
        </main>
        <aside className="tm-logs" aria-label="Avvisi">
          <span className="fs-caption"><TriangleAlert size={11} /> AVVISI</span>
          {alerts.map(a => <div key={a.text} className={`tm-log ${a.lvl === 'err' ? 'is-err' : a.lvl === 'warn' ? 'is-warn' : ''}`}>{a.time} {a.text}</div>)}
          <span className="fs-caption">PROSSIMI PASSI</span>
          <div className="tm-log">Collegare davvero il worker F1 e assegnargli lavoro</div>
          <div className="tm-log">Agenti remoti F2: SQL laptop in sola lettura, staging, approvazioni</div>
          <div className="tm-log">Soglie di avviso e notifiche sul telefono</div>
        </aside>
      </div>
    </div>
  );
}
