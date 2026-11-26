import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Circle, Globe, Lock, Network, Router, Shield, ShieldCheck, Smartphone, TriangleAlert, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Demo network page: all devices, tunnels and domains are invented; nothing is contacted or changed.
type State = 'up' | 'warn' | 'down';
interface Item { id: string; name: string; kind: string; icon: typeof Globe; state: State; detail: string; rows: [string, string][]; note: string }
const groups: { label: string; items: Item[] }[] = [
  { label: 'ACCESSO REMOTO', items: [
    { id: 'tailscale', name: 'Tailscale', kind: 'VPN privata', icon: Shield, state: 'up', detail: '4 dispositivi nella rete privata', rows: [['Server', '100.64.0.1'], ['Laptop', '100.64.0.7'], ['Telefono', '100.64.0.9'], ['NAS', '100.64.0.3']], note: 'Accesso da fuori casa senza aprire porte sul router.' },
    { id: 'cloudflare', name: 'Cloudflare Tunnel', kind: 'Tunnel pubblico', icon: Globe, state: 'up', detail: '3 indirizzi pubblici attivi', rows: [['foto.serveria.it', 'Immich'], ['cloud.serveria.it', 'Nextcloud'], ['cora.serveria.it', 'Cora (con login)']], note: 'Solo i programmi elencati sono raggiungibili da internet.' },
    { id: 'wireguard', name: 'WireGuard', kind: 'VPN di riserva', icon: Lock, state: 'down', detail: 'Spenta, da usare se Tailscale non risponde', rows: [['Porta', '51820'], ['Profili', '2']], note: 'Idea: accenderla automaticamente in caso di guasto.' },
  ] },
  { label: 'CASA E LAN', items: [
    { id: 'router', name: 'Router di casa', kind: 'Rete locale', icon: Router, state: 'up', detail: '12 dispositivi collegati', rows: [['Server Debian', '192.168.1.10'], ['NAS', '192.168.1.20'], ['Laptop worker', '192.168.1.34'], ['Telefono', '192.168.1.51'], ['Sconosciuto', '192.168.1.77']], note: 'Un dispositivo non è riconosciuto: da verificare.' },
    { id: 'proxy', name: 'Proxy e certificati', kind: 'Nginx Proxy', icon: ShieldCheck, state: 'warn', detail: '1 certificato scade presto', rows: [['foto.serveria.it', 'scade tra 62 g'], ['cloud.serveria.it', 'scade tra 58 g'], ['cora.serveria.it', 'scade tra 9 g']], note: 'Il rinnovo è automatico, ma conviene controllarlo.' },
  ] },
];
const all = groups.flatMap(g => g.items);
const events = [
  { lvl: 'warn', text: 'Certificato cora.serveria.it in scadenza', time: '18:02' },
  { lvl: 'warn', text: 'Nuovo dispositivo sconosciuto in LAN', time: '17:31' },
  { lvl: 'info', text: 'Telefono collegato via Tailscale', time: '16:48' },
  { lvl: 'info', text: 'Tunnel Cloudflare riconnesso', time: '15:10' },
];
const label = (s: State) => s === 'up' ? 'attivo' : s === 'warn' ? 'attenzione' : 'spento';

export default function V2Network() {
  const [sel, setSel] = useState('tailscale');
  const [on, setOn] = useState<Record<string, boolean>>({});
  const it = all.find(x => x.id === sel)!;
  const state: State = on[it.id] === undefined ? it.state : on[it.id] ? 'up' : 'down';
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <div className="tm-layout">
        <aside className="tm-services" aria-label="Collegamenti">
          {groups.map(g => <div key={g.label}>
            <span className="fs-caption">{g.label}</span>
            {g.items.map(x => { const I = x.icon; const s = on[x.id] === undefined ? x.state : on[x.id] ? 'up' : 'down'; return (
              <Button key={x.id} className={`mn-machine is-${s} ${x.id === sel ? 'is-active' : ''}`} onClick={() => setSel(x.id)}>
                <I size={15} /><span>{x.name}<small>{x.kind}</small></span><Circle size={8} />
              </Button>); })}
          </div>)}
        </aside>
        <main className="tm-main">
          <div className="pg-title"><div><span className="ops-overline">RETE / {it.kind.toUpperCase()}</span><h1>{it.name}<span>.</span></h1></div><span className={`mn-badge is-${state}`}>{label(state)}</span></div>
          <p className="mn-role">{it.detail}</p>
          <span className="fs-caption">DETTAGLI</span>
          {it.rows.map(([a, b]) => <div key={a} className={`tm-log ${a === 'Sconosciuto' || b.includes(' 9 g') ? 'is-warn' : ''}`}>▸ {a} <span style={{ float: 'right' }}>{b}</span></div>)}
          <p className="mn-role">{it.note}</p>
          <Button onClick={() => setOn(o => ({ ...o, [it.id]: state !== 'up' }))}>{state === 'up' ? <Wifi size={14} /> : <Network size={14} />} {state === 'up' ? 'Spegni (simulato)' : 'Accendi (simulato)'}</Button>
        </main>
        <aside className="tm-logs" aria-label="Eventi di rete">
          <span className="fs-caption"><TriangleAlert size={11} /> EVENTI DI RETE</span>
          {events.map(e => <div key={e.text} className={`tm-log ${e.lvl === 'warn' ? 'is-warn' : ''}`}>{e.time} {e.text}</div>)}
          <span className="fs-caption"><Smartphone size={11} /> PROSSIMI PASSI</span>
          <div className="tm-log">Dare un nome al dispositivo sconosciuto o bloccarlo</div>
          <div className="tm-log">Notifica sul telefono quando un certificato scade</div>
          <div className="tm-log">Collegare il worker F1 tramite Tailscale</div>
        </aside>
      </div>
    </div>
  );
}
