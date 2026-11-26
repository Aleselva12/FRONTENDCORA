import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, Boxes, Check, ChevronRight, Play, RotateCw, Search, Square, Container } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import { applyAction, filterServices, groupLabels, services as initial, stateLabels, type ServiceGroup, type ServiceState } from '../services/model';
import V2Nav from './V2Nav';
const sev: Record<ServiceState, string> = { running: 'info', stopped: 'warning', restarting: 'warning', unhealthy: 'error' };
export default function V2Services() {
  const [list, setList] = useState(initial);
  const [group, setGroup] = useState<ServiceGroup | 'all'>('all');
  const [state, setState] = useState<ServiceState | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('immich');
  const [notice, setNotice] = useState('');
  const visible = filterServices(list, { query, group, state });
  const s = visible.find(x => x.id === selected) ?? visible[0];
  function act(action: 'start' | 'stop' | 'restart') { if (!s) return; setList(l => l.map(x => x.id === s.id ? applyAction(x, action) : x)); setNotice(`${s.name}: ${action === 'stop' ? 'arresto' : action === 'start' ? 'avvio' : 'riavvio'} simulato. Nessun comando inviato.`); }
  return <div className="ops-page ev-page">
    <header className="ops-header"><Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link><V2Nav /><div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div></header>
      <V2RepositoryStatus />
    <div className="ev-layout">
      <aside className="ev-sidebar" aria-label="Gruppi servizi"><span className="fs-caption">STACK / 06</span>
        <Button className={`ev-category ${group === 'all' ? 'is-active' : ''}`} aria-pressed={group === 'all'} onClick={() => setGroup('all')}><Boxes size={16} /><span>Tutti i servizi</span><small>{list.length}</small></Button>
        {(Object.keys(groupLabels) as ServiceGroup[]).map(id => <Button key={id} className={`ev-category ${group === id ? 'is-active' : ''}`} aria-pressed={group === id} onClick={() => setGroup(id)}><Container size={16} /><span>{groupLabels[id]}</span><small>{list.filter(x => x.group === id).length}</small></Button>)}
        <div className="ev-side-section ev-side-note"><Boxes size={23} /><h3>Ogni programma, un container.</h3><p>Stato, porte, volumi e log in un unico posto.</p><small>Dati inventati, nessun Docker reale.</small></div>
        <div className="ev-side-links"><Link to="/v2-programs">Programmi <ArrowUpRight size={13} /></Link><Link to="/v2-events">Registro eventi <ArrowUpRight size={13} /></Link></div>
      </aside>
      <main className="ev-main">
        <div className="pg-title"><div><span className="ops-overline">SISTEMA / SERVIZI & CONTAINER</span><h1>Servizi<span>.</span></h1></div><Boxes size={28} /></div>
        <section className="ev-summary" aria-label="Riepilogo">{(['all', 'running', 'stopped', 'unhealthy'] as const).map(id => <Button key={id} className={`ev-stat ${id !== 'all' ? `ev-${sev[id]}` : ''} ${state === id ? 'is-active' : ''}`} aria-pressed={state === id} onClick={() => setState(id)}><span>{id === 'all' ? 'CONTAINER · DEMO' : stateLabels[id]}</span><strong>{list.filter(x => id === 'all' || x.state === id).length.toString().padStart(2, '0')}</strong><small>{id === 'all' ? 'Totale' : id === 'running' ? 'In funzione' : id === 'stopped' ? 'Spenti' : 'Da controllare'}</small></Button>)}</section>
        <div className="ev-toolbar"><label className="ev-search"><Search size={16} /><input aria-label="Cerca servizi" placeholder="Cerca servizio, immagine, stack…" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
        <div className="ev-stream-head"><span>CONTAINER</span><span>{visible.length} SERVIZI · DEMO</span></div>
        <section className="ev-stream" aria-label="Elenco servizi">{visible.map(x => <Button key={x.id} className={`ev-row ev-${sev[x.state]} ${s?.id === x.id ? 'is-selected' : ''}`} aria-pressed={s?.id === x.id} onClick={() => setSelected(x.id)}><time>{x.uptime}<small>UPTIME</small></time><span className="ev-marker"><Container size={15} /></span><span className="ev-row-content"><span className="ev-row-meta">{x.machine}<small>{stateLabels[x.state]}</small></span><strong>{x.name}</strong><span>{x.image}</span><small>CPU {x.cpu}% · RAM {x.ram} MB · {x.ports}</small></span><ChevronRight size={15} /></Button>)}{!visible.length && <div className="ev-empty"><Search size={28} /><h2>Nessun servizio trovato</h2></div>}</section>
        {notice && <p className="ev-notice" role="status"><Check size={14} />{notice}</p>}
      </main>
      <aside className="ev-inspector" aria-label="Dettagli servizio">{s ? <>
        <span className="fs-caption">SERVICE INSPECTOR</span><div className={`ev-inspector-status ev-${sev[s.state]}`}><Container size={26} /><span>{stateLabels[s.state]} · DEMO</span></div><small className="ev-event-id">{s.id} / {s.stack}</small><h2>{s.name}</h2><p>{s.note}</p>
        <dl>{[['Immagine', s.image], ['Macchina', s.machine], ['Porte', s.ports], ['CPU', `${s.cpu}%`], ['RAM', `${s.ram} MB`], ['Uptime', s.uptime]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <section className="ev-detail-section"><span className="fs-caption">VOLUMI</span><ol>{s.volumes.map(v => <li key={v}>{v}</li>)}</ol></section>
        <section className="ev-detail-section"><span className="fs-caption">ULTIMI LOG · ESEMPIO</span><pre className="ev-raw">{s.logs.join('\n')}</pre></section>
        {s.state === 'stopped' ? <Button className="ev-action" onClick={() => act('start')}><Play size={14} />Avvia · demo</Button> : <><Button className="ev-action" onClick={() => act('restart')}><RotateCw size={14} />Riavvia · demo</Button><Button className="ev-action" onClick={() => act('stop')}><Square size={14} />Ferma · demo</Button></>}
        <p className="ev-provenance">Esempio di design: nessun container viene davvero avviato o fermato.</p>
      </> : <p>Nessun servizio nei filtri.</p>}</aside>
    </div>
  </div>;
}
