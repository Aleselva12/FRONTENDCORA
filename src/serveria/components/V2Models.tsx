import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, AudioLines, BrainCircuit, Check, Code2, Cpu, Download, HardDrive, Layers, Search, SlidersHorizontal, Unplug, Zap } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import { demoGpuCapacity, memoryEstimate, modelCatalog, previewLoad, type ModelKind } from '../models/model';
import V2Nav from './V2Nav';
const types: { id: ModelKind | 'all'; name: string; icon: typeof Cpu }[] = [{ id: 'all', name: 'Tutti i modelli', icon: Layers }, { id: 'chat', name: 'Dialogo', icon: BrainCircuit }, { id: 'code', name: 'Codice', icon: Code2 }, { id: 'audio', name: 'Audio', icon: AudioLines }, { id: 'embedding', name: 'Ricerca', icon: Search }];
const kindIcons = { chat: BrainCircuit, code: Code2, audio: AudioLines, embedding: Search };
export default function V2Models() {
  const [filter, setFilter] = useState<ModelKind | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('qwen-chat');
  const [loaded, setLoaded] = useState(['qwen-chat', 'bge']);
  const [installed, setInstalled] = useState(modelCatalog.filter(model => model.installed).map(model => model.id));
  const [view, setView] = useState<'installed' | 'catalog'>('installed');
  const [machine, setMachine] = useState('server');
  const [notice, setNotice] = useState('');
  const [temperature, setTemperature] = useState('0.7');
  const [context, setContext] = useState('8192');
  const model = modelCatalog.find(item => item.id === selected);
  if (!model) return null;
  const used = memoryEstimate(loaded);
  const visible = modelCatalog.filter(item => (view === 'catalog' || installed.includes(item.id)) && (filter === 'all' || item.kind === filter) && `${item.name} ${item.engine} ${item.family}`.toLowerCase().includes(query.toLowerCase()));
  const Icon = kindIcons[model.kind];
  const load = () => {
    const result = previewLoad(loaded, model.id);
    setLoaded(result.ids);
    setNotice(result.fits ? `${model.name} caricato nella GPU di esempio. Nessun modello avviato davvero.` : 'Memoria di esempio insufficiente. Scarica un modello dalla GPU prima di continuare.');
  };
  return <div className="ops-page lm-page">
    <header className="ops-header"><Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link><V2Nav /><div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div></header>
      <V2RepositoryStatus />
    <div className="lm-layout">
      <aside className="lm-sidebar" aria-label="Categorie modelli"><span className="fs-caption">MODEL LIBRARY</span>{types.map(type => <Button key={type.id} className={`mn-machine ${filter === type.id ? 'is-active' : ''}`} aria-pressed={filter === type.id} onClick={() => setFilter(type.id)}><type.icon size={16} /><span>{type.name}</span></Button>)}
        <div className="lm-engine"><span className="fs-caption">MOTORI / PROPOSTE</span><p>Ollama <span>Chat e vettori</span></p><p>faster-whisper <span>Trascrizioni</span></p><p>vLLM <span>Servizio futuro</span></p><Link to="/v2-monitor">Worker e hardware <ArrowLeft size={12} /></Link></div>
      </aside>
      <main className="lm-main">
        <div className="pg-title"><div><span className="ops-overline">INTELLIGENZA / LOCAL FIRST</span><h1>Modelli IA<span>.</span></h1></div><BrainCircuit size={28} /></div>
        <section className="lm-gpu" aria-label="Memoria GPU dimostrativa"><div className="lm-gpu-head"><span><Cpu size={17} /> MEMORIA GPU</span><select aria-label="Macchina GPU" value={machine} onChange={e => { setMachine(e.target.value); setLoaded([]); setNotice('Macchina di esempio cambiata. Nessun computer contattato.'); }}><option value="server">Server Debian · demo</option><option value="worker">Worker F1 · demo</option></select></div><div className="lm-capacity"><strong>{used.toFixed(1)}<small> / {demoGpuCapacity} GB</small></strong><span>STIMA ILLUSTRATIVA</span></div><progress aria-label="VRAM utilizzata" value={used} max={demoGpuCapacity} /><div className="lm-resident">{loaded.length ? loaded.map(id => { const item = modelCatalog.find(m => m.id === id); return item ? <Button key={id} onClick={() => setSelected(id)}><span className={`lm-dot is-${item.kind}`} />{item.name}<small>{item.vram} GB</small></Button> : null; }) : <span>Nessun modello nella GPU di esempio</span>}</div><div className="lm-gpu-foot"><span><Zap size={12} /> {(demoGpuCapacity - used).toFixed(1)} GB disponibili</span><span>Prestazioni reali da misurare</span></div></section>
        <div className="lm-tools"><div role="tablist" aria-label="Libreria modelli"><Button role="tab" aria-selected={view === 'installed'} className={view === 'installed' ? 'is-active' : ''} onClick={() => setView('installed')}>Installati · demo <small>{installed.length}</small></Button><Button role="tab" aria-selected={view === 'catalog'} className={view === 'catalog' ? 'is-active' : ''} onClick={() => setView('catalog')}>Catalogo</Button></div><label className="lm-search"><Search size={15} /><input aria-label="Cerca modelli" placeholder="Cerca un modello…" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
        <section className="lm-catalog" aria-label="Modelli disponibili">{visible.map(item => { const ItemIcon = kindIcons[item.kind]; return <Button key={item.id} className={`lm-model is-${item.kind} ${selected === item.id ? 'is-selected' : ''}`} aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setNotice(''); }}><div className="lm-model-top"><ItemIcon size={22} /><span>{loaded.includes(item.id) ? 'IN GPU · DEMO' : installed.includes(item.id) ? 'SU DISCO · DEMO' : 'DA SCARICARE'}</span></div><strong>{item.name}</strong><small>{item.family} / {item.engine}</small><p>{item.description}</p><div className="lm-model-bottom"><span>{item.parameters}</span><span><HardDrive size={12} />{item.size}</span></div></Button>; })}{!visible.length && <p className="mn-role">Nessun modello corrispondente.</p>}</section>
        {notice && <div className="lm-notice" role="status"><Check size={16} />{notice}</div>}
      </main>
      <aside className="lm-inspector" aria-label="Dettagli modello"><span className="fs-caption">MODEL INSPECTOR</span><Icon size={30} /><h2>{model.name}</h2><p>{model.description}</p><dl><div><dt>Formato</dt><dd>{model.parameters}</dd></div><div><dt>Spazio su disco</dt><dd>{model.size}</dd></div><div><dt>VRAM stimata</dt><dd>{model.vram} GB</dd></div><div><dt>Contesto catalogo</dt><dd>{model.context}</dd></div><div><dt>Motore proposto</dt><dd>{model.engine}</dd></div></dl>
        {!installed.includes(model.id) ? <Button className="lm-action" onClick={() => { setInstalled(ids => [...ids, model.id]); setNotice(`Download di ${model.name} simulato. Nessun file scaricato.`); }}><Download size={15} /> Simula download</Button> : loaded.includes(model.id) ? <Button className="lm-action" onClick={() => { setLoaded(ids => ids.filter(id => id !== model.id)); setNotice(`${model.name} rimosso dalla GPU di esempio.`); }}><Unplug size={15} /> Libera GPU · demo</Button> : <Button className="lm-action" onClick={load}><Cpu size={15} /> Carica in GPU · demo</Button>}
        <section className="lm-settings"><span className="fs-caption"><SlidersHorizontal size={12} /> PROFILO DI PROVA</span>{model.kind === 'chat' || model.kind === 'code' ? <><label>Temperatura <output>{temperature}</output><input aria-label="Temperatura" type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} /></label><label>Finestra di contesto<select aria-label="Finestra di contesto" value={context} onChange={e => setContext(e.target.value)}><option value="4096">4.096 token</option><option value="8192">8.192 token</option><option value="16384">16.384 token</option></select></label></> : <p>{model.kind === 'audio' ? 'Lingua: italiano · rilevamento automatico proposto. Trascrizione e classificazione restano separate.' : 'Indice vettoriale della memoria e dei documenti. Nessuna indicizzazione reale.'}</p>}<Button className="lm-action" onClick={() => setNotice('Profilo di prova aggiornato solo in questa anteprima. Nessuna configurazione reale modificata.')}><Check size={14} /> Applica alla demo</Button></section>
        <div className="lm-assignment"><span className="fs-caption">DESTINAZIONE</span>{model.kind === 'audio' ? <Link to="/v2-files">Audio e trascrizioni <AudioLines size={14} /></Link> : model.kind === 'code' ? <Link to="/v2-programmer">Programmatore <Code2 size={14} /></Link> : model.kind === 'embedding' ? <Link to="/v2-memory">Memoria di Cora <Search size={14} /></Link> : <Link to="/v2-chat">Conversazioni <BrainCircuit size={14} /></Link>}<p>Catalogo, installazioni e risorse d’esempio. Nessun modello o servizio collegato.</p></div>
      </aside>
    </div>
  </div>;
}