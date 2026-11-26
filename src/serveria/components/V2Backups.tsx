import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Archive, ArrowLeft, ArrowRight, Check, CheckCheck, Clock3, Database, File, HardDrive, History, LockKeyhole, RotateCcw, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import { backupSets, recoveryPreview } from '../backups/model';
import V2Nav from './V2Nav';

export default function V2Backups() {
  const [selected, setSelected] = useState('cora');
  const [snapshotId, setSnapshotId] = useState('cora-04');
  const [tab, setTab] = useState<'copies' | 'policy'>('copies');
  const [checks, setChecks] = useState<string[]>([]);
  const [target, setTarget] = useState('all');
  const [recovering, setRecovering] = useState(false);
  const [notice, setNotice] = useState('');
  const set = backupSets.find(item => item.id === selected) ?? backupSets[0];
  if (!set) return null;
  const snapshot = set.snapshots.find(item => item.id === snapshotId) ?? set.snapshots[0];
  if (!snapshot) return null;
  const verified = snapshot.verified || checks.includes(snapshot.id);
  const preview = recoveryPreview(set, snapshot, target);
  return <div className="ops-page bk-page">
    <header className="ops-header"><Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link><V2Nav /><div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div></header>
      <V2RepositoryStatus />
    <div className="tm-layout">
      <aside className="tm-services" aria-label="Archivi di backup"><span className="fs-caption">ARCHIVI / 04</span>
        {backupSets.map(item => <Button key={item.id} className={`mn-machine ${item.id === selected ? 'is-active' : ''}`} aria-pressed={item.id === selected} onClick={() => { setSelected(item.id); setSnapshotId(item.snapshots[0]?.id ?? ''); setTarget('all'); setRecovering(false); setNotice(''); }}><Database size={17} /><span>{item.name}<small>{item.subtitle}</small></span>{item.warning ? <TriangleAlert size={13} /> : <Archive size={13} />}</Button>)}
        <div className="bk-side-note"><LockKeyhole size={20} /><h3>Una copia non basta.</h3><p>Originale, seconda copia e una destinazione fuori casa.</p><span>STRATEGIA 3–2–1 / PROPOSTA</span></div>
      </aside>
      <main className="tm-main">
        <div className="pg-title"><div><span className="ops-overline">CONTINUITÀ / RECOVERY</span><h1>Backup e ripristino<span>.</span></h1></div><ShieldCheck size={26} /></div>
        <div className="bk-summary"><div><small>ARCHIVIO SELEZIONATO</small><strong>{set.name}</strong></div><div><small>PUNTI DI RIPRISTINO</small><strong>{set.snapshots.length.toString().padStart(2, '0')}</strong></div><div><small>ULTIMA COPIA · DEMO</small><strong>{set.snapshots[0]?.size}</strong></div></div>
        <section className="bk-route" aria-label="Percorso della copia"><div><Database size={20} /><small>ORIGINE</small><strong>{set.source}</strong></div><ArrowRight size={20} /><div><HardDrive size={20} /><small>DESTINAZIONE</small><strong>{set.destination}</strong></div></section>
        <div className="bk-toolbar"><div role="tablist" aria-label="Backup"><Button role="tab" aria-selected={tab === 'copies'} onClick={() => setTab('copies')} className={tab === 'copies' ? 'is-active' : ''}><History size={14} /> Copie e snapshot</Button><Button role="tab" aria-selected={tab === 'policy'} onClick={() => setTab('policy')} className={tab === 'policy' ? 'is-active' : ''}><Clock3 size={14} /> Pianificazione</Button></div><Button className="bk-action" onClick={() => setNotice(`Anteprima nuova copia di ${set.name} preparata. Nessun file copiato.`)}><Archive size={14} /> Simula copia</Button></div>
        {tab === 'copies' ? <section aria-label="Punti di ripristino" className="bk-snapshots">{set.snapshots.map(item => <Button key={item.id} aria-pressed={snapshot.id === item.id} className={`bk-snapshot ${snapshot.id === item.id ? 'is-active' : ''}`} onClick={() => { setSnapshotId(item.id); setRecovering(false); setNotice(''); }}><span className="bk-timeline-dot" /><span><strong>{item.date}</strong><small>{item.id} · {item.files.toLocaleString('it-IT')} file</small></span><span>{item.size}<small>{item.verified || checks.includes(item.id) ? 'Verificata · demo' : 'Da verificare'}</small></span><ArrowRight size={14} /></Button>)}</section> : <section className="bk-policy" aria-label="Pianificazione"><div><span>Frequenza proposta</span><strong>{set.schedule}</strong></div><div><span>Conservazione proposta</span><strong>{set.retention}</strong></div><div><span>Motore proposto</span><strong>{set.engine}</strong></div><div><span>Crittografia</span><strong>Da configurare · chiave custodita separatamente</strong></div></section>}
        <section className="bk-contents"><span className="fs-caption">CONTENUTO / {snapshot.id}</span>{set.contents.map(file => <div key={file}><File size={14} /><span>{file}</span><Button title={`Prepara recupero ${file}`} aria-label={`Prepara recupero ${file}`} onClick={() => { setTarget(file); setRecovering(true); setNotice(''); }}><RotateCcw size={14} /></Button></div>)}</section>
        {notice && <div className="bk-notice" role="status"><Check size={16} />{notice}</div>}
      </main>
      <aside className="tm-logs" aria-label="Dettagli e recupero"><span className="fs-caption"><ShieldCheck size={13} /> PUNTO DI RIPRISTINO</span><h2 className="bk-detail-title">{snapshot.date}</h2><span className={`mn-badge ${verified ? '' : 'is-warn'}`}>{verified ? 'Verificata · demo' : 'Da verificare'}</span><p className="mn-role">{snapshot.size} · {snapshot.files.toLocaleString('it-IT')} file<br />{snapshot.id}</p>
        <div className="bk-detail-actions"><Button className="bk-action" onClick={() => { setChecks(values => [...values, snapshot.id]); setNotice('Verifica simulata completata. Integrità reale non controllata.'); }}><CheckCheck size={14} /> Simula verifica</Button><Button className="bk-action" onClick={() => { setTarget('all'); setRecovering(true); setNotice(''); }}><RotateCcw size={14} /> Prepara recupero</Button></div>
        {recovering && <section className="bk-recovery" aria-label="Anteprima recupero"><div className="bk-recovery-head"><strong>Recupero separato</strong><Button aria-label="Chiudi recupero" onClick={() => setRecovering(false)}><X size={15} /></Button></div><p>{target === 'all' ? 'Intero archivio' : target}</p><dl><dt>Destinazione</dt><dd>{preview.destination}</dd><dt>Elementi</dt><dd>{preview.files.length}</dd><dt>Originali</dt><dd>Non sovrascritti</dd></dl><Button className="bk-action is-primary" onClick={() => { setRecovering(false); setNotice(`Recupero simulato: ${preview.files.length} elementi nell’area separata. Nessun dato reale modificato.`); }}><RotateCcw size={14} /> Simula recupero</Button></section>}
        <span className="fs-caption"><TriangleAlert size={13} /> DA TENERE D’OCCHIO</span><div className="tm-log is-warn">{set.warning ?? 'Il ripristino completo deve ancora essere provato su dati reali.'}</div><div className="tm-log">Copia fuori casa e notifiche: da definire.</div><div className="tm-log">Dati, date e verifiche illustrativi. Nessun archivio reale collegato.</div>
      </aside>
    </div>
  </div>;
}