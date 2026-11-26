import V2RepositoryStatus from "./V2RepositoryStatus";
import { useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Archive, ArrowLeft, AudioLines, ChevronRight, Clock, Cloud, Code2, Download, FileImage, FileSpreadsheet, FileText, FileVideo, Folder, FolderPlus, Grid2x2, HardDrive, Info, List, MoreVertical, Plus, Search, Server, Sparkles, Star, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';
import V2AudioPanel from './V2AudioPanel';
import { findPath, formatSize, kindFromName, sources, units, type FileKind, type FsItem, type SourceId } from '../files/data';

const kindIcon: Record<FileKind, typeof Folder> = { folder: Folder, doc: FileText, sheet: FileSpreadsheet, pdf: FileText, image: FileImage, video: FileVideo, audio: AudioLines, code: Code2, archive: Archive };
const kindLabel: Record<FileKind, string> = { folder: 'Cartella', doc: 'Documento', sheet: 'Foglio', pdf: 'PDF', image: 'Immagine', video: 'Video', audio: 'Audio', code: 'Codice / config', archive: 'Archivio' };
const sourceIcon: Record<SourceId, typeof Folder> = { drive: Cloud, server: Server, nas: HardDrive };

export default function V2Files({ initialMode = 'files' }: { initialMode?: 'files' | 'audio' } = {}) {
  const [tree, setTree] = useState(sources);
  const [source, setSource] = useState<SourceId>('drive');
  const [folderId, setFolderId] = useState('drive');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | FileKind>('all');
  const [selected, setSelected] = useState<FsItem | null>(null);
  const [menu, setMenu] = useState(false);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState('');
  const [mode, setMode] = useState<'files' | 'audio'>(initialMode);
  const input = useRef<HTMLInputElement>(null);

  const root = tree[source].root;
  const path = findPath(root, folderId) ?? [root];
  const folder = path[path.length - 1] ?? root;
  const items = useMemo(() => (folder.children ?? []).filter(i => i.name.toLowerCase().includes(query.toLowerCase()) && (kind === 'all' || i.kind === kind || i.kind === 'folder')), [folder, query, kind]);
  const folders = items.filter(i => i.kind === 'folder');
  const files = items.filter(i => i.kind !== 'folder');

  const notify = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2600); };
  const mutate = (fn: (children: FsItem[]) => FsItem[]) => {
    const walk = (n: FsItem): FsItem => n.id === folder.id ? { ...n, children: fn(n.children ?? []) } : n.children ? { ...n, children: n.children.map(walk) } : n;
    setTree(t => ({ ...t, [source]: { ...t[source], root: walk(t[source].root) } }));
  };
  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const added = Array.from(list).map((file, i) => ({ id: `up-${Date.now()}-${i}`, name: file.name, kind: kindFromName(file.name), size: formatSize(file.size), modified: 'adesso', owner: 'Tu' } satisfies FsItem));
    mutate(c => [...added, ...c]);
    notify(`${added.length} file aggiunti a “${folder.name}” · solo anteprima`);
  };
  const open = (s: SourceId, id?: string) => { setSource(s); setFolderId(id ?? tree[s].root.id); setSelected(null); setQuery(''); };
  const toggleStar = (item: FsItem) => { mutate(c => c.map(i => i.id === item.id ? { ...i, starred: !i.starred } : i)); setSelected(s => s && s.id === item.id ? { ...s, starred: !s.starred } : s); };
  const remove = (item: FsItem) => { mutate(c => c.filter(i => i.id !== item.id)); setSelected(null); notify(`“${item.name}” spostato nel cestino · demo`); };
  const enter = (item: FsItem) => item.kind === 'folder' ? (setFolderId(item.id), setSelected(null)) : setSelected(item);

  const s = tree[source];
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" title="Torna alla Home V2" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus key={mode} moduleId={mode === 'audio' ? 'audio' : 'files'} />
      <div className={`fs-layout ${mode === 'audio' ? 'is-audio' : ''}`}>
        <aside className="fs-side">
          <div className="fs-new">
            <Button className="fs-new-btn" onClick={() => setMenu(m => !m)}><Plus size={16} />Nuovo</Button>
            {menu && <div className="fs-menu" role="menu">
              <Button role="menuitem" onClick={() => { setMenu(false); input.current?.click(); }}><Upload size={14} />Carica file</Button>
              <Button role="menuitem" onClick={() => { setMenu(false); mutate(c => [{ id: `nf-${Date.now()}`, name: 'Nuova cartella', kind: 'folder', modified: 'adesso', children: [] }, ...c]); notify('Cartella creata · demo'); }}><FolderPlus size={14} />Nuova cartella</Button>
              <Button role="menuitem" onClick={() => { setMenu(false); setMode('audio'); }}><AudioLines size={14} />Audio e trascrizioni</Button>
            </div>}
            <input ref={input} type="file" multiple hidden onChange={e => { addFiles(e.target.files); e.target.value = ''; }} aria-label="Carica file" />
          </div>
          <span className="fs-caption">SORGENTI</span>
          {(Object.keys(tree) as SourceId[]).map(id => { const Icon = sourceIcon[id]; return <Button key={id} className={`fs-nav ${mode === 'files' && source === id ? 'is-active' : ''}`} onClick={() => { setMode('files'); open(id); }}><Icon size={15} /><span>{tree[id].label}<small>{tree[id].caption}</small></span></Button>; })}
          <span className="fs-caption">VISTE</span>
          <Button className="fs-nav" onClick={() => { setKind('all'); notify('Recenti · demo'); }}><Clock size={15} /><span>Recenti</span></Button>
          <Button className="fs-nav" onClick={() => notify('Speciali · usa la stella sui file')}><Star size={15} /><span>Speciali</span></Button>
          <Button className={`fs-nav fs-audio-link ${mode === 'audio' ? 'is-active' : ''}`} onClick={() => setMode('audio')}><AudioLines size={15} /><span>Audio & trascrizioni<small>Note vocali → appunti</small></span><ChevronRight size={13} /></Button>
          <Button className="fs-nav" onClick={() => notify('Cestino vuoto · demo')}><Trash2 size={15} /><span>Cestino</span></Button>
          <div className="fs-storage"><span className="fs-caption">SPAZIO · {s.label.toUpperCase()}</span><div className="fs-bar"><i style={{ width: `${(s.used / s.total) * 100}%` }} /></div><small>{s.used} {units[source]} di {s.total} {units[source]} utilizzati</small></div>
        </aside>

        {mode === 'audio' ? <V2AudioPanel notify={notify} /> : <>
        <main className={`fs-main ${drag ? 'is-drag' : ''}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}>
          <div className="fs-top">
            <label className="fs-search"><Search size={15} /><input aria-label="Cerca file" value={query} onChange={e => setQuery(e.target.value)} placeholder={`Cerca in ${s.label}…`} />{query && <Button onClick={() => setQuery('')} aria-label="Pulisci ricerca"><X size={13} /></Button>}</label>
            <div className="fs-view"><Button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="Vista elenco"><List size={15} /></Button><Button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Vista griglia"><Grid2x2 size={15} /></Button></div>
          </div>
          <nav className="fs-crumbs" aria-label="Percorso">{path.map((p, i) => <span key={p.id}>{i > 0 && <ChevronRight size={14} />}<Button className={i === path.length - 1 ? 'is-current' : ''} onClick={() => { setFolderId(p.id); setSelected(null); }}>{p.name}</Button></span>)}</nav>
          <div className="fs-chips">
            <Button className="fs-chip fs-chip-ai" onClick={() => notify('Chiedi a Cora · disponibile nella versione finale')}><Sparkles size={13} />Chiedi a Cora</Button>
            {(['all', 'doc', 'sheet', 'pdf', 'audio', 'image', 'video'] as const).map(k => <Button key={k} className={`fs-chip ${kind === k ? 'is-active' : ''}`} onClick={() => setKind(k)}>{k === 'all' ? 'Tutti i tipi' : kindLabel[k]}</Button>)}
          </div>

          {folders.length > 0 && <><span className="fs-caption">CARTELLE</span><div className="fs-folders">{folders.map(i => <Button key={i.id} className={`fs-folder ${selected?.id === i.id ? 'is-selected' : ''}`} onClick={() => setSelected(i)} onDoubleClick={() => enter(i)}><Folder size={16} /><span>{i.name}</span><small>{i.children?.length ?? 0}</small><ChevronRight size={13} onClick={e => { e.stopPropagation(); enter(i); }} /></Button>)}</div></>}
          {files.length > 0 && <span className="fs-caption">FILE</span>}
          {view === 'grid' ? <div className="fs-grid">{files.map(i => { const Icon = kindIcon[i.kind]; return <Button key={i.id} className={`fs-card fs-k-${i.kind} ${selected?.id === i.id ? 'is-selected' : ''}`} onClick={() => setSelected(i)}><div className="fs-card-head"><Icon size={14} /><span>{i.name}</span>{i.starred && <Star size={12} className="fs-star" />}<MoreVertical size={14} /></div><div className="fs-thumb"><Icon size={34} />{i.kind === 'audio' && <div className="fs-wave">{Array.from({ length: 22 }, (_, n) => <i key={n} style={{ height: `${20 + ((n * 37) % 70)}%` }} />)}</div>}<em>{i.name.split('.').pop()?.toUpperCase()}</em></div></Button>; })}</div>
            : <div className="fs-list" role="table"><div className="fs-row fs-row-head" role="row"><span>Nome</span><span>Tipo</span><span>Modifica</span><span>Dimensione</span></div>{files.map(i => { const Icon = kindIcon[i.kind]; return <Button key={i.id} role="row" className={`fs-row fs-k-${i.kind} ${selected?.id === i.id ? 'is-selected' : ''}`} onClick={() => setSelected(i)}><span><Icon size={15} />{i.name}</span><span>{kindLabel[i.kind]}</span><span>{i.modified}</span><span>{i.size}</span></Button>; })}</div>}
          {!items.length && <div className="fs-empty"><Upload size={28} /><strong>Cartella vuota</strong><span>Trascina qui i file o usa “Nuovo”.</span></div>}
          <div className="fs-drop-hint"><Upload size={14} />Trascina i file qui per caricarli in “{folder.name}” · nessun file lascia il browser</div>
        </main>

        <aside className="fs-details">
          {selected ? (() => { const Icon = kindIcon[selected.kind]; return <>
            <div className="fs-caption">DETTAGLI <Button onClick={() => setSelected(null)} aria-label="Chiudi dettagli"><X size={13} /></Button></div>
            <div className={`fs-detail-icon fs-k-${selected.kind}`}><Icon size={32} /></div>
            <h2>{selected.name}</h2>
            <dl><div><dt>TIPO</dt><dd>{kindLabel[selected.kind]}</dd></div><div><dt>SORGENTE</dt><dd>{s.label}</dd></div><div><dt>PERCORSO</dt><dd>{path.map(p => p.name).join(' / ')}</dd></div><div><dt>MODIFICATO</dt><dd>{selected.modified}</dd></div><div><dt>DIMENSIONE</dt><dd>{selected.size ?? `${selected.children?.length ?? 0} elementi`}</dd></div></dl>
            <div className="fs-actions">
              {selected.kind === 'folder' && <Button onClick={() => enter(selected)}><Folder size={14} />Apri</Button>}
              {selected.kind === 'audio' && <Button onClick={() => setMode('audio')}><AudioLines size={14} />Trascrivi e classifica</Button>}
              <Button onClick={() => toggleStar(selected)}><Star size={14} />{selected.starred ? 'Rimuovi da speciali' : 'Aggiungi a speciali'}</Button>
              <Button onClick={() => notify('Download simulato · demo')}><Download size={14} />Scarica</Button>
              <Button onClick={() => remove(selected)}><Trash2 size={14} />Sposta nel cestino</Button>
            </div>
          </>; })() : <div className="fs-details-empty"><Info size={22} /><strong>{folder.name}</strong><span>{folder.children?.length ?? 0} elementi · seleziona un file per vederne i dettagli.</span><div className="fs-placeholder"><span className="fs-caption">IN ARRIVO</span><p>Ricerca semantica nei contenuti</p><p>Versioni e cronologia file</p><p>Condivisione con link sicuri</p><p>Sincronizzazione Drive ⇄ NAS</p></div></div>}
        </aside>
        </>}
      </div>
      {toast && <div className="fs-toast" role="status">{toast}</div>}
    </div>
  );
}
