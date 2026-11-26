import { useState } from 'react';
import { AudioLines, Check, Database, Mic, Pause, Play, Send, Sparkles, Tag, Upload, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import { audioNotes, audioStatus, destinations, type AudioNote } from '../files/audio';

interface Request { id: number; text: string; state: 'pending' | 'applied' }

export default function V2AudioPanel({ notify }: { notify: (m: string) => void }) {
  const [notes, setNotes] = useState(audioNotes);
  const [activeId, setActiveId] = useState(audioNotes[0]?.id ?? '');
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<'transcript' | 'summary'>('transcript');
  const [draft, setDraft] = useState('');
  const [requests, setRequests] = useState<Record<string, Request[]>>({});
  const note = notes.find(n => n.id === activeId) ?? notes[0];
  if (!note) return <div className="au-empty">Nessuna registrazione nella demo.</div>;
  const list = requests[note.id] ?? [];
  const update = (patch: Partial<AudioNote>) => setNotes(ns => ns.map(n => n.id === note.id ? { ...n, ...patch } : n));

  const ask = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now();
    setRequests(r => ({ ...r, [note.id]: [...(r[note.id] ?? []), { id, text, state: 'pending' }] }));
    setDraft('');
    window.setTimeout(() => setRequests(r => ({ ...r, [note.id]: (r[note.id] ?? []).map(q => q.id === id ? { ...q, state: 'applied' } : q) })), 1400);
  };

  return (
    <div className="au-layout">
      <aside className="au-history" aria-label="Cronologia audio">
        <span className="fs-caption">REGISTRAZIONI GIÀ SALVATE</span>
        <Button className="au-upload" onClick={() => notify('Caricamento audio simulato · demo')}><Upload size={14} />Carica audio</Button>
        <span className="fs-caption">CRONOLOGIA</span>
        {notes.map(n => <Button key={n.id} className={`au-item ${n.id === note.id ? 'is-active' : ''}`} onClick={() => { setActiveId(n.id); setPlaying(false); }}>
          <span className="au-item-top"><strong>{n.title}</strong><em className={`au-st au-st-${n.status}`}>{audioStatus[n.status]}</em></span>
          <small>{n.date} · {n.duration}</small>
        </Button>)}
      </aside>

      <section className="au-main" aria-label="Trascrizione">
        <div className="au-head">
          <div><span className="ops-overline">AUDIO / {note.date.toUpperCase()}</span><h2>{note.title}</h2><p>{note.speakers.join(' · ')} · {note.size}</p></div>
        </div>
        <div className="au-player">
          <Button className="au-play" aria-label={playing ? 'Pausa' : 'Riproduci'} onClick={() => setPlaying(p => !p)}>{playing ? <Pause size={16} /> : <Play size={16} />}</Button>
          <div className={`au-wave ${playing ? 'is-playing' : ''}`}>{Array.from({ length: 64 }, (_, i) => <i key={i} style={{ height: `${18 + ((i * 53) % 78)}%` }} />)}</div>
          <span>{note.duration}</span>
        </div>
        {note.status === 'running' || note.status === 'queued' ? (
          <div className="au-pending"><AudioLines size={26} /><strong>{audioStatus[note.status]}</strong><span>{note.status === 'running' ? 'Whisper sta elaborando la registrazione · simulazione' : 'In attesa del motore di trascrizione'}</span><div className="au-progress"><i className={note.status === 'running' ? 'is-running' : ''} /></div></div>
        ) : <>
          <div className="au-tabs" role="tablist">
            <Button role="tab" aria-selected={view === 'transcript'} onClick={() => setView('transcript')}>Trascrizione</Button>
            <Button role="tab" aria-selected={view === 'summary'} onClick={() => setView('summary')}>Riepilogo e azioni</Button>
          </div>
          {view === 'transcript' ? <ol className="au-segments">{note.segments.map(s => <li key={s.t}><time>{s.t}</time><strong>{s.speaker}</strong><p>{s.text}</p></li>)}</ol>
            : <div className="au-summary"><p>{note.summary}</p><span className="fs-caption">AZIONI PROPOSTE</span>{note.actions.map(a => <div key={a} className="au-action"><Check size={13} />{a}</div>)}</div>}
        </>}
      </section>

      <aside className="au-side" aria-label="Classificazione e modifiche">
        <span className="fs-caption">CLASSIFICA E SALVA</span>
        <label className="au-field"><Database size={13} /><select aria-label="Destinazione" value={note.destination} onChange={e => update({ destination: e.target.value })}>{destinations.map(d => <option key={d}>{d}</option>)}</select></label>
        <div className="au-tags">{note.tags.map(t => <span key={t}><Tag size={10} />{t}</span>)}</div>
        <Button className="au-save" onClick={() => { update({ status: 'done' }); notify(`Appunto salvato in “${note.destination}” · demo`); }}><Check size={14} />Salva appunto</Button>

        <span className="fs-caption">RICHIEDI MODIFICHE A CORA</span>
        <div className="au-quick">{['Correggi i nomi', 'Riassunto più breve', 'Estrai le date', 'Formato verbale'].map(q => <Button key={q} onClick={() => ask(q)}><Wand2 size={11} />{q}</Button>)}</div>
        <div className="au-requests">{list.length ? list.map(r => <div key={r.id} className={`au-req is-${r.state}`}><Sparkles size={12} /><span>{r.text}<small>{r.state === 'pending' ? 'Cora sta preparando la modifica…' : 'Proposta pronta · anteprima demo'}</small></span></div>) : <small className="au-empty">Nessuna richiesta per questo audio.</small>}</div>
        <form className="au-ask" onSubmit={e => { e.preventDefault(); ask(draft); }}><input aria-label="Richiesta di modifica" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Es. separa per argomento…" /><Button type="submit" aria-label="Invia richiesta" disabled={!draft.trim()}><Send size={14} /></Button></form>
      </aside>
    </div>
  );
}
