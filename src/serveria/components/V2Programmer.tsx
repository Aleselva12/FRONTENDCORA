import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Bot, Check, ChevronRight, Code2, FileCode2, Folder, GitBranch, GitCommit, GitPullRequest, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Illustrative repository view: no GitHub, Git or server is contacted.
const tree = [
  { dir: 'core', files: ['supervisor.py', 'capability_registry.py', 'context_manager.py', 'memory.py'] },
  { dir: 'audio_agent', files: ['transcribe.py', 'diarize.py'] },
  { dir: 'email_agent', files: ['gmail_tools.py', 'drafts.py'] },
  { dir: 'programmer_agent', files: ['planner.py', 'patch.py', 'review.py'] },
  { dir: 'terminal_service', files: ['shell.py', 'allowlist.py'] },
  { dir: 'worker', files: ['worker.py', 'profiles.yml'] },
  { dir: 'frontend', files: ['src/App.tsx', 'package.json'] },
];
const code: Record<string, string[]> = {
  'core/supervisor.py': ['from core.capability_registry import registry', 'from core.context_manager import build_packet', '', 'class Supervisor:', '    """Riceve la richiesta e la delega allo specialista."""', '    def route(self, request):', '        packet = build_packet(request)', '        agent = registry.best_for(packet.intent)', '        return agent.run(packet)'],
};
const sample = (path: string) => code[path] ?? [`# ${path}`, '# Anteprima dimostrativa del file', '', 'def main():', '    ...'];
const proposals = [
  { id: 'p1', title: 'Timeout esplicito nel Supervisor', file: 'core/supervisor.py', status: 'Da approvare', diff: [['-', '        return agent.run(packet)'], ['+', '        return agent.run(packet, timeout=30)']] },
  { id: 'p2', title: 'Retry idempotente trascrizione', file: 'audio_agent/transcribe.py', status: 'In revisione', diff: [['+', 'if job.already_done(): return job.result'], ['-', 'run_whisper(job)'], ['+', 'run_whisper(job, resume=True)']] },
];


export default function V2Programmer() {
  const [open, setOpen] = useState<string[]>(['core']);
  const [file, setFile] = useState('core/supervisor.py');
  const [tab, setTab] = useState<'code' | 'changes'>('code');
  const [state, setState] = useState<Record<string, 'ok' | 'no'>>({});
  const [task, setTask] = useState('');
  const [log, setLog] = useState<string[]>(['Pronto. Descrivi una modifica e preparo una proposta da approvare.']);

  const send = () => { if (!task.trim()) return; setLog(l => [...l, `Tu: ${task}`, 'Programmatore: analizzo i file coinvolti e preparo un diff · anteprima demo']); setTask(''); };
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <div className="pg-layout">
        <aside className="pg-tree" aria-label="File del progetto">
          <div className="pg-repo"><GitBranch size={14} /><span>serveria1<small>main · sorgente non caricata</small></span></div>
          <span className="fs-caption">ESPLORA</span>
          {tree.map(d => <div key={d.dir}>
            <Button className="pg-dir" onClick={() => setOpen(o => o.includes(d.dir) ? o.filter(x => x !== d.dir) : [...o, d.dir])}><ChevronRight size={12} className={open.includes(d.dir) ? 'is-open' : ''} /><Folder size={13} />{d.dir}</Button>
            {open.includes(d.dir) && d.files.map(f => { const p = `${d.dir}/${f}`; return <Button key={p} className={`pg-file ${file === p ? 'is-active' : ''}`} onClick={() => { setFile(p); setTab('code'); }}><FileCode2 size={12} />{f}</Button>; })}
          </div>)}
        </aside>

        <main className="pg-main">
          <div className="pg-title"><div><span className="ops-overline">WORKSPACE / PROGRAMMATORE</span><h1>Programmatore<span>.</span></h1></div>
            <div className="au-tabs" role="tablist"><Button role="tab" aria-selected={tab === 'code'} onClick={() => setTab('code')}><Code2 size={13} />Codice</Button><Button role="tab" aria-selected={tab === 'changes'} onClick={() => setTab('changes')}><GitPullRequest size={13} />Proposte · {proposals.length}</Button></div></div>
          {tab === 'code' ? <div className="pg-editor"><div className="pg-editor-head"><FileCode2 size={13} />{file}<em>sola lettura</em></div><pre>{sample(file).map((l, i) => <div key={i}><span>{i + 1}</span><code>{l || ' '}</code></div>)}</pre></div>
            : <div className="pg-proposals">{proposals.map(p => <article key={p.id} className="pg-proposal">
              <div className="pg-proposal-head"><GitPullRequest size={14} /><strong>{p.title}</strong><em>{state[p.id] === 'ok' ? 'Approvata · demo' : state[p.id] === 'no' ? 'Rifiutata' : p.status}</em></div>
              <small>{p.file}</small>
              <pre className="pg-diff">{p.diff.map(([k, l], i) => <div key={i} className={k === '+' ? 'is-add' : 'is-del'}><span>{k}</span><code>{l}</code></div>)}</pre>
              <div className="pg-proposal-actions"><Button onClick={() => setState(s => ({ ...s, [p.id]: 'ok' }))}><Check size={13} />Approva</Button><Button onClick={() => setState(s => ({ ...s, [p.id]: 'no' }))}><X size={13} />Rifiuta</Button></div>
            </article>)}</div>}
          <div className="pg-agent"><div className="pg-agent-log">{log.map((l, i) => <p key={i}>{l}</p>)}</div>
            <form onSubmit={e => { e.preventDefault(); send(); }} className="au-ask"><Bot size={15} /><input aria-label="Compito per il programmatore" value={task} onChange={e => setTask(e.target.value)} placeholder="Es. aggiungi un timeout al Supervisor…" /><Button type="submit" aria-label="Invia compito" disabled={!task.trim()}><Send size={14} /></Button></form></div>
        </main>

        <aside className="pg-side">
          <span className="fs-caption">COMMIT RECENTI</span>
          <p className="repo-boundary">Nessuna cronologia commit collegata. Il codice al centro è illustrativo, non la sorgente della repository.</p>
          <Link className="repo-cross-link" to="/v2-programmer-next">Programmatore W3 · da costruire <ArrowLeft size={13}/></Link>
          <span className="fs-caption">REGOLE</span>
          <div className="pg-rule"><ShieldCheck size={13} />Ogni modifica passa da una proposta approvata</div>
          <div className="pg-rule"><ShieldCheck size={13} />Test prima del rilascio sul server</div>
          <div className="fs-placeholder"><span className="fs-caption">IN ARRIVO</span><p><Sparkles size={11} /> CodeAtlas: mappa del codice</p><p><Sparkles size={11} /> Test automatici per proposta</p><p><Sparkles size={11} /> Rilascio con rollback</p></div>
        </aside>
      </div>
    </div>
  );
}
