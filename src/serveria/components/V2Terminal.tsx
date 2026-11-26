import V2RepositoryStatus from "./V2RepositoryStatus";
import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Box, Circle, RotateCcw, ScrollText, ShieldAlert, SquareTerminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Simulated console: commands are answered from canned text, nothing runs on a server.
const services = [
  { name: 'cora-api', kind: 'docker', state: 'up', info: '8000 · 2 g' },
  { name: 'postgres', kind: 'docker', state: 'up', info: '5432 · 14 g' },
  { name: 'ollama', kind: 'docker', state: 'up', info: '11434 · 6 g' },
  { name: 'immich', kind: 'docker', state: 'up', info: '2283 · 9 g' },
  { name: 'nextcloud', kind: 'docker', state: 'warn', info: 'aggiornamento disponibile' },
  { name: 'cora-updater', kind: 'systemd', state: 'up', info: 'timer attivo' },
  { name: 'worker-laptop', kind: 'remoto', state: 'down', info: 'offline' },
];
const answers: Record<string, string[]> = {
  help: ['Comandi demo: status, docker ps, df -h, uptime, logs cora-api, clear'],
  status: ['cora-api      up    2 giorni', 'postgres      up    14 giorni', 'nextcloud     warn  aggiornamento disponibile', 'worker-laptop down'],
  'docker ps': ['CONTAINER      IMAGE                 STATUS', 'cora-api       serveria/api:2.0      Up 2 days', 'postgres       pgvector/pg16         Up 14 days', 'ollama         ollama/ollama         Up 6 days', 'immich         immich-server         Up 9 days'],
  'df -h': ['Filesystem   Size  Used Avail Use%', '/dev/nvme0    1T   428G  572G  43%', '/mnt/nas      4T   2,1T  1,9T  53%'],
  uptime: ['17:42 up 14 days, load average: 0.42, 0.38, 0.31'],
  'logs cora-api': ['INFO  supervisor  richiesta ricevuta · thread quick', 'INFO  registry    agente scelto: audio', 'WARN  worker      laptop non raggiungibile, uso server', 'INFO  supervisor  risposta inviata in 1,8 s'],
};
const blocked = ['rm ', 'shutdown', 'reboot', 'sudo ', 'mkfs', 'dd '];
const logs = ['17:40 INFO  updater   nessun aggiornamento Cora', '17:38 WARN  nextcloud versione 29.0.4 disponibile', '17:31 INFO  immich    indicizzazione completata', '17:12 INFO  backup    copia database ok', '16:55 ERROR worker    timeout connessione laptop'];

interface Line { kind: 'in' | 'out' | 'warn'; text: string }

export default function V2Terminal() {
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: 'Serveria console · simulazione. Scrivi "help".' }]);
  const [cmd, setCmd] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const run = (raw: string) => {
    const c = raw.trim(); if (!c) return;
    setHistory(h => [c, ...h].slice(0, 8)); setCmd('');
    if (c === 'clear') return setLines([]);
    const out: Line[] = blocked.some(b => c.startsWith(b.trim()) || c.includes(b))
      ? [{ kind: 'warn', text: 'Comando bloccato: richiede approvazione nel Permission Engine.' }]
      : (answers[c] ?? [`${c}: comando non disponibile nella demo`]).map(text => ({ kind: 'out' as const, text }));
    setLines(l => [...l, { kind: 'in', text: c }, ...out]);
  };

  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · SIMULAZIONE</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <div className="tm-layout">
        <aside className="tm-services" aria-label="Servizi">
          <span className="fs-caption">SERVIZI · DEBIAN</span>
          {services.map(s => <div key={s.name} className={`tm-service is-${s.state}`}><Circle size={8} /><span>{s.name}<small>{s.kind} · {s.info}</small></span><Button aria-label={`Riavvia ${s.name}`} title="Riavvio richiede approvazione" onClick={() => run(`sudo restart ${s.name}`)}><RotateCcw size={12} /></Button></div>)}
          <span className="fs-caption">COMANDI RAPIDI</span>
          <div className="au-quick">{['status', 'docker ps', 'df -h', 'logs cora-api'].map(q => <Button key={q} onClick={() => run(q)}><Box size={11} />{q}</Button>)}</div>
        </aside>
        <main className="tm-main">
          <div className="pg-title"><div><span className="ops-overline">SERVER / CONSOLE</span><h1>Terminale<span>.</span></h1></div><Button className="tm-clear" onClick={() => setLines([])}><Trash2 size={13} />Pulisci</Button></div>
          <div className="tm-screen" onClick={() => document.getElementById('tm-input')?.focus()}>
            {lines.map((l, i) => <div key={i} className={`tm-line is-${l.kind}`}>{l.kind === 'in' && <b>alessandro@serveria:~$ </b>}{l.text}</div>)}
            <form className="tm-prompt" onSubmit={e => { e.preventDefault(); run(cmd); }}><b>alessandro@serveria:~$</b><input id="tm-input" aria-label="Comando" autoComplete="off" spellCheck={false} value={cmd} onChange={e => setCmd(e.target.value)} /></form>
            <div ref={end} />
          </div>
          <p className="tm-note"><ShieldAlert size={12} />Comandi distruttivi bloccati: ogni azione con effetti passa da un’approvazione.</p>
        </main>
        <aside className="tm-logs" aria-label="Log">
          <span className="fs-caption"><ScrollText size={11} /> LOG DI SISTEMA</span>
          {logs.map(l => <div key={l} className={`tm-log ${l.includes('ERROR') ? 'is-err' : l.includes('WARN') ? 'is-warn' : ''}`}>{l}</div>)}
          <span className="fs-caption"><SquareTerminal size={11} /> CRONOLOGIA</span>
          {history.length ? history.map((h, i) => <Button key={i} className="tm-hist" onClick={() => setCmd(h)}>{h}</Button>) : <small className="au-empty">Nessun comando.</small>}
        </aside>
      </div>
    </div>
  );
}
