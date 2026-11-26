import V2MemoryRecords from "./V2MemoryRecords";
import V2RepositoryStatus from "./V2RepositoryStatus";
import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Database, Layers, Link2, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Illustrative memory map "inside the sphere". All counts and links are demo data, not read from Cora or the server.
type Area = 'serveria' | 'business' | 'clienti' | 'personale' | 'contenuti' | 'sistema';
type Kind = 'context' | 'working' | 'symbolic' | 'sql' | 'vector' | 'app';
type View = 'anelli' | 'aree';
const C = 500, CY = 420;
const areas: Record<Area, { label: string; a0: number; a1: number; count: number; note: string }> = {
  serveria: { label: 'Serveria', a0: -150, a1: -95, count: 64, note: 'Progetto, architettura, roadmap e decisioni di design.' },
  business: { label: 'Magazzino Tele', a0: -85, a1: -25, count: 48, note: 'Ordini, inventario, fornitori.' },
  clienti: { label: 'Clienti', a0: -15, a1: 35, count: 30, note: 'Anagrafiche, preventivi, appuntamenti.' },
  contenuti: { label: 'Contenuti', a0: 45, a1: 100, count: 36, note: 'Foto, file, note vocali e trascrizioni.' },
  personale: { label: 'Personale', a0: 110, a1: 150, count: 14, note: 'Preferenze, calendario, abitudini.' },
  sistema: { label: 'Sistema', a0: 160, a1: 205, count: 70, note: 'Log, salute servizi, configurazioni.' },
};
const kinds: Record<Kind, { label: string; r: number; desc: string }> = {
  context: { label: 'Context manager', r: 70, desc: 'Cosa Cora ha davanti adesso' },
  working: { label: 'Memoria di lavoro', r: 125, desc: 'Compiti in corso, scade' },
  symbolic: { label: 'Memoria simbolica', r: 215, desc: 'Concetti e relazioni stabili' },
  sql: { label: 'Database SQL', r: 300, desc: 'Dati strutturati dei programmi' },
  vector: { label: 'Vettoriale / altri', r: 300, desc: 'Ricerca semantica e cache' },
  app: { label: 'Applicazioni', r: 355, desc: 'Programmi che scrivono memoria' },
};
interface Store { id: string; label: string; kind: Kind; angle: number; areas: Area[]; note: string; size: string }
const stores: Store[] = [
  { id: 'ctx-sess', label: 'Sessione attiva', kind: 'context', angle: -90, areas: ['serveria'], note: 'Finestra di contesto della conversazione corrente.', size: '18k token' },
  { id: 'ctx-comp', label: 'Compressione', kind: 'context', angle: 30, areas: ['sistema'], note: 'Riassume il contesto quando supera il limite.', size: '3 riassunti' },
  { id: 'ctx-route', label: 'Router contesto', kind: 'context', angle: 150, areas: ['personale', 'clienti'], note: 'Sceglie quali memorie caricare per la richiesta.', size: '6 fonti' },
  { id: 'wk-order', label: 'Ordine 40 rotoli', kind: 'working', angle: -55, areas: ['business'], note: 'Da creare entro venerdì.', size: '1 compito' },
  { id: 'wk-w2', label: 'W2 · Aggiorna Immich', kind: 'working', angle: 70, areas: ['contenuti', 'sistema'], note: 'Prossimo lavoro operativo.', size: '1 compito' },
  { id: 'wk-cal', label: 'Appuntamento Rossi', kind: 'working', angle: 5, areas: ['clienti', 'personale'], note: 'Proposto, da confermare.', size: '1 evento' },
  { id: 'sql-core', label: 'PostgreSQL Serveria', kind: 'sql', angle: -125, areas: ['serveria', 'sistema'], note: 'Utenti, impostazioni, cronologia chat.', size: '1.2 GB' },
  { id: 'sql-mag', label: 'SQL Magazzino', kind: 'sql', angle: -60, areas: ['business'], note: 'Articoli, movimenti, fornitori.', size: '340 MB' },
  { id: 'sql-prev', label: 'SQL Preventivi / CRM', kind: 'sql', angle: 10, areas: ['clienti'], note: 'Preventivi e clienti. Riuso futuro, i Word restano.', size: '86 MB' },
  { id: 'sql-imm', label: 'DB Immich', kind: 'sql', angle: 70, areas: ['contenuti'], note: 'Metadati foto e video.', size: '2.4 GB' },
  { id: 'vec', label: 'Indice vettoriale', kind: 'vector', angle: 120, areas: ['contenuti', 'personale', 'serveria'], note: 'Embedding di note, trascrizioni e documenti.', size: '18.400 vettori' },
  { id: 'redis', label: 'Cache / code', kind: 'vector', angle: 180, areas: ['sistema'], note: 'Code dei worker e cache temporanee.', size: '64 MB' },
  { id: 'logs', label: 'Archivio log', kind: 'vector', angle: -170, areas: ['sistema'], note: 'Log dei servizi e diagnostica.', size: '5.1 GB' },
];
const apps = ['Cora', 'Immich', 'Nextcloud', 'Magazzino', 'Preventivi', 'Drive', 'Audio', 'Calendario', 'Terminale', 'Programmatore', 'Automazioni', 'Worker'];
const appArea: Area[] = ['serveria', 'contenuti', 'contenuti', 'business', 'clienti', 'contenuti', 'contenuti', 'personale', 'sistema', 'serveria', 'sistema', 'sistema'];

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, d: number) => ({ x: C + r * Math.cos(rad(d)), y: CY + r * Math.sin(rad(d)) });
function rand(seed: number) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const dots = (Object.keys(areas) as Area[]).flatMap((a, ai) => {
  const A = areas[a], r = rand(ai * 97 + 13);
  return Array.from({ length: A.count }, (_, i) => { const rows = 6, row = i % rows; return { area: a, i, ...pt(160 + row * 18 + r() * 5, A.a0 + 3 + (Math.floor(i / rows) / Math.ceil(A.count / rows)) * (A.a1 - A.a0 - 6)), big: r() > 0.9 }; });
});
const areaCenter = (a: Area, view: View) => view === 'aree' ? pt(205, (areas[a].a0 + areas[a].a1) / 2) : pt(205, (areas[a].a0 + areas[a].a1) / 2);

type Sel = { type: 'area'; id: Area } | { type: 'store'; id: string } | { type: 'core' };

export default function V2Memory() {
  const [view, setView] = useState<View>('anelli');
  const [sel, setSel] = useState<Sel>({ type: 'core' });
  const [offArea, setOffArea] = useState<Area[]>([]);
  const [offKind, setOffKind] = useState<Kind[]>([]);
  const [q, setQ] = useState('');
  const storeById = (id: string) => stores.find(s => s.id === id)!;
  const activeAreas: Area[] = sel.type === 'area' ? [sel.id] : sel.type === 'store' ? storeById(sel.id).areas : [];
  const shownStores = stores.filter(s => !offKind.includes(s.kind));
  const hit = (t: string) => q && t.toLowerCase().includes(q.toLowerCase());
  const total = useMemo(() => dots.length + stores.length + apps.length, []);
  const toggle = <T,>(set: (f: (x: T[]) => T[]) => void, v: T) => set(o => o.includes(v) ? o.filter(x => x !== v) : [...o, v]);

  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <div className="pg-layout">
        <aside className="pg-tree">
          <label className="fs-search"><Search size={14} /><input aria-label="Cerca nella memoria" value={q} onChange={e => setQ(e.target.value)} placeholder="Cerca memoria o database…" /></label>
          <span className="fs-caption">AREE</span>
          {(Object.keys(areas) as Area[]).map(a => <Button key={a} className="cal-cat" aria-pressed={!offArea.includes(a)} onClick={() => toggle(setOffArea, a)}><i className={`mx-a-${a} ${offArea.includes(a) ? 'is-off' : ''}`} /><span>{areas[a].label}<small>{areas[a].count} concetti</small></span></Button>)}
          <span className="fs-caption">TIPI DI MEMORIA</span>
          {(Object.keys(kinds) as Kind[]).map(k => <Button key={k} className="cal-cat" aria-pressed={!offKind.includes(k)} onClick={() => toggle(setOffKind, k)}><i className={`mx-k mx-k-${k} ${offKind.includes(k) ? 'is-off' : ''}`} /><span>{kinds[k].label}<small>{kinds[k].desc}</small></span></Button>)}
          <div className="fs-placeholder"><span className="fs-caption">IN ARRIVO</span><p><Sparkles size={11} /> Timeline della memoria</p><p><Sparkles size={11} /> Vista orbita 3D</p><p><Sparkles size={11} /> Custode e scadenze</p></div>
        </aside>

        <main className="pg-main">
          <div className="pg-title"><div><span className="ops-overline">DENTRO LA SFERA / CORA</span><h1>Memoria<span>.</span></h1></div>
            <div className="mx-views" role="tablist" aria-label="Vista">{(['anelli', 'aree'] as View[]).map(v => <Button key={v} role="tab" aria-selected={view === v} className={view === v ? 'is-active' : ''} onClick={() => setView(v)}>{v.toUpperCase()}</Button>)}<span className="ops-overline">{total} ELEMENTI · {stores.length} ARCHIVI</span></div>
          </div>
          <div className="mem-canvas mx-canvas">
            <svg viewBox="0 0 1000 840" role="img" aria-label="Mappa della memoria dentro la sfera di Cora">
              <defs><radialGradient id="mxglow"><stop offset="0" stopColor="var(--ops-accent)" stopOpacity="0.18" /><stop offset="1" stopColor="var(--ops-accent)" stopOpacity="0" /></radialGradient></defs>
              <circle cx={C} cy={CY} r={380} fill="url(#mxglow)" />
              {view === 'anelli' && (Object.keys(kinds) as Kind[]).filter(k => k !== 'vector').map(k => <g key={k} className="mx-ring"><circle cx={C} cy={CY} r={kinds[k].r} /><text x={C} y={CY - kinds[k].r - 8}>{kinds[k].label.toUpperCase()}</text></g>)}
              {view === 'aree' && (Object.keys(areas) as Area[]).map(a => { const p0 = pt(380, areas[a].a0), p1 = pt(380, areas[a].a1); return <path key={a} className={`mx-sector mx-a-${a}`} d={`M${C} ${CY} L${p0.x} ${p0.y} A380 380 0 0 1 ${p1.x} ${p1.y}Z`} />; })}
              {/* links from selection */}
              {sel.type === 'store' && storeById(sel.id).areas.map(a => { const s = storeById(sel.id), p = pt(kinds[s.kind].r, s.angle), c = areaCenter(a, view); return <line key={a} className="mx-link" x1={p.x} y1={p.y} x2={c.x} y2={c.y} />; })}
              {sel.type === 'area' && stores.filter(s => s.areas.includes(sel.id) && !offKind.includes(s.kind)).map(s => { const p = pt(kinds[s.kind].r, s.angle), c = areaCenter(sel.id, view); return <line key={s.id} className="mx-link" x1={p.x} y1={p.y} x2={c.x} y2={c.y} />; })}
              {/* symbolic concept dots */}
              {!offKind.includes('symbolic') && dots.filter(d => !offArea.includes(d.area)).map(d => <circle key={d.area + d.i} className={`mx-dot mx-a-${d.area} ${activeAreas.length && !activeAreas.includes(d.area) ? 'is-dim' : ''}`} cx={d.x} cy={d.y} r={d.big ? 4.2 : 2.6} />)}
              {(Object.keys(areas) as Area[]).filter(a => !offArea.includes(a)).map(a => { const c = areaCenter(a, view); return <g key={a} className={`mx-area mx-a-${a} ${hit(areas[a].label) ? 'is-match' : ''} ${sel.type === 'area' && sel.id === a ? 'is-sel' : ''}`} transform={`translate(${c.x} ${c.y})`} role="button" tabIndex={0} aria-label={areas[a].label} onClick={() => setSel({ type: 'area', id: a })} onKeyDown={e => e.key === 'Enter' && setSel({ type: 'area', id: a })}><circle r="11" /><text y="4">{areas[a].label[0]}</text><text className="mx-area-label" x="16" y="-2">{areas[a].label.toUpperCase()}</text><text className="mx-area-count" x="16" y="11">{areas[a].count}</text></g>; })}
              {/* stores */}
              {shownStores.map(s => { const p = pt(kinds[s.kind].r, s.angle); const on = sel.type === 'store' && sel.id === s.id; return <g key={s.id} className={`mx-store mx-k-${s.kind} ${on ? 'is-sel' : ''} ${hit(s.label) ? 'is-match' : ''}`} transform={`translate(${p.x} ${p.y})`} role="button" tabIndex={0} aria-label={s.label} onClick={() => setSel({ type: 'store', id: s.id })} onKeyDown={e => e.key === 'Enter' && setSel({ type: 'store', id: s.id })}>{s.kind === 'sql' || s.kind === 'vector' ? <rect x="-7" y="-7" width="14" height="14" rx="3" transform="rotate(45)" /> : <circle r="7" />}<text y="21">{s.label}</text></g>; })}
              {/* applications on outer ring */}
              {!offKind.includes('app') && apps.map((a, i) => { const p = pt(kinds.app.r, -90 + i * 30); const dim = activeAreas.length && !activeAreas.includes(appArea[i]!); return <g key={a} className={`mx-app ${dim ? 'is-dim' : ''} ${hit(a) ? 'is-match' : ''}`} transform={`translate(${p.x} ${p.y})`}><polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" /><text y={p.y > CY ? 26 : -17}>{a}</text></g>; })}
              {/* core */}
              <g className="mx-core" transform={`translate(${C} ${CY})`} role="button" tabIndex={0} aria-label="Nucleo di Cora" onClick={() => setSel({ type: 'core' })}><polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" /><text y="40">CORA.CORE</text></g>
            </svg>
          </div>
        </main>

        <aside className="pg-side">
          <span className="fs-caption">{sel.type === 'core' ? 'NUCLEO' : sel.type === 'area' ? 'AREA' : 'ARCHIVIO'} <Button onClick={() => setSel({ type: 'core' })} aria-label="Torna al nucleo"><X size={12} /></Button></span>
          {sel.type === 'core' && <><h2 className="cal-title">Cora · nucleo</h2><p className="mem-note">Dal centro verso l’esterno: cosa Cora ha in mente adesso, i compiti in corso, i concetti stabili, i database del server e infine i programmi che li alimentano.</p>
            {(Object.keys(kinds) as Kind[]).map(k => <div key={k} className="pg-rule"><i className={`mx-k mx-k-${k}`} />{kinds[k].label} · {k === 'symbolic' ? dots.length : k === 'app' ? apps.length : stores.filter(s => s.kind === k).length}</div>)}</>}
          {sel.type === 'area' && <><h2 className="cal-title"><i className={`mx-a-${sel.id}`} />{areas[sel.id].label}</h2><p className="mem-note">{areas[sel.id].note}</p><div className="pg-rule"><Layers size={13} />{areas[sel.id].count} concetti simbolici</div>
            <span className="fs-caption">ARCHIVI COLLEGATI</span>{stores.filter(s => s.areas.includes(sel.id)).map(s => <Button key={s.id} className="mem-rel" onClick={() => setSel({ type: 'store', id: s.id })}><Database size={12} /><span>{kinds[s.kind].label}<strong>{s.label}</strong></span></Button>)}</>}
          {sel.type === 'store' && (() => { const s = storeById(sel.id); return <><h2 className="cal-title"><i className={`mx-k mx-k-${s.kind}`} />{s.label}</h2><div className="pg-rule"><Database size={13} />{kinds[s.kind].label} · {s.size}</div><p className="mem-note">{s.note}</p>
            <span className="fs-caption">AREE SERVITE · {s.areas.length}</span>{s.areas.map(a => <Button key={a} className="mem-rel" onClick={() => setSel({ type: 'area', id: a })}><Link2 size={12} /><span>alimenta<strong>{areas[a].label}</strong></span></Button>)}</>; })()}
          <p className="au-empty">Mappa dimostrativa: numeri, archivi e collegamenti sono esempi, non letti dal server.</p>
        </aside>
      </div>
      <V2MemoryRecords />
    </div>
  );
}
