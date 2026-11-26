import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Send, Smartphone, Sparkles, User, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2Nav from './V2Nav';

// Illustrative calendar: no Google Calendar, phone or server is contacted.
type Cat = 'work' | 'client' | 'personal' | 'cora';
interface Ev { id: string; day: number; start: number; end: number; title: string; cat: Cat; place?: string; who?: string; notify?: boolean }
const catLabel: Record<Cat, string> = { work: 'Lavoro', client: 'Clienti', personal: 'Personale', cora: 'Routine Cora' };
const days = ['Lun 10', 'Mar 11', 'Mer 12', 'Gio 13', 'Ven 14', 'Sab 15', 'Dom 16'];
const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
const initial: Ev[] = [
  { id: 'e1', day: 0, start: 9, end: 9.5, title: 'Briefing del mattino', cat: 'cora', notify: true },
  { id: 'e2', day: 0, start: 10, end: 12, title: 'Ordine tele fornitore', cat: 'work', place: 'Magazzino' },
  { id: 'e3', day: 1, start: 14, end: 15, title: 'Sig. Rossi · preventivo', cat: 'client', place: 'Ufficio', who: 'Sig. Rossi', notify: true },
  { id: 'e4', day: 2, start: 15, end: 16, title: 'Design review V2', cat: 'work', who: 'Cora' },
  { id: 'e5', day: 2, start: 17.5, end: 18.5, title: 'Sprint Serveria V2', cat: 'work' },
  { id: 'e6', day: 3, start: 8.5, end: 9.5, title: 'Manutenzione camion', cat: 'personal', place: 'Officina' },
  { id: 'e7', day: 4, start: 11, end: 12.5, title: 'Consegna 40 rotoli', cat: 'client', place: 'Cliente Bianchi', notify: true },
  { id: 'e8', day: 4, start: 19, end: 19.5, title: 'Riepilogo della giornata', cat: 'cora' },
  { id: 'e9', day: 5, start: 10, end: 12, title: 'Backup NAS', cat: 'cora' },
];
const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;

export default function V2Calendar() {
  const [events, setEvents] = useState(initial);
  const [sel, setSel] = useState<Ev | null>(initial[2]!);
  const [hidden, setHidden] = useState<Cat[]>([]);
  const [text, setText] = useState('');
  const [proposal, setProposal] = useState<Ev | null>(null);

  const interpret = () => { if (!text.trim()) return; setProposal({ id: `n${Date.now()}`, day: 3, start: 16, end: 17, title: text.trim(), cat: 'client', notify: true }); };
  const confirm = () => { if (!proposal) return; setEvents(e => e.some(x => x.title === proposal.title && x.day === proposal.day) ? e : [...e, proposal]); setSel(proposal); setProposal(null); setText(''); };

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
          <Button className="au-record" onClick={() => document.getElementById('cal-ask')?.focus()}><Plus size={15} />Nuovo evento</Button>
          <span className="fs-caption">NOVEMBRE 2026</span>
          <div className="cal-mini">{['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => <b key={i}>{d}</b>)}{Array.from({ length: 30 }, (_, i) => <span key={i} className={i + 1 === 12 ? 'is-today' : i + 1 >= 10 && i + 1 <= 16 ? 'is-week' : ''}>{i + 1}</span>)}</div>
          <span className="fs-caption">CALENDARI</span>
          {(Object.keys(catLabel) as Cat[]).map(c => <Button key={c} className="cal-cat" aria-pressed={!hidden.includes(c)} onClick={() => setHidden(h => h.includes(c) ? h.filter(x => x !== c) : [...h, c])}><i className={`cal-c-${c} ${hidden.includes(c) ? 'is-off' : ''}`} />{catLabel[c]}</Button>)}
          <div className="fs-placeholder"><span className="fs-caption">IN ARRIVO</span><p><Sparkles size={11} /> Riorganizza la settimana con Cora</p><p><Sparkles size={11} /> Calendario digitale in camera</p><p><Sparkles size={11} /> Sincronizzazione Google</p></div>
        </aside>

        <main className="pg-main">
          <div className="pg-title"><div><span className="ops-overline">IL TUO TEMPO / SETTIMANA 46</span><h1>Calendario<span>.</span></h1></div>
            <div className="cal-nav"><Button aria-label="Settimana precedente"><ChevronLeft size={15} /></Button><span>10 – 16 novembre</span><Button aria-label="Settimana successiva"><ChevronRight size={15} /></Button></div></div>
          <form className="au-ask" onSubmit={e => { e.preventDefault(); interpret(); }}><Sparkles size={15} className="cal-spark" /><input id="cal-ask" aria-label="Descrivi un appuntamento" value={text} onChange={e => setText(e.target.value)} placeholder="Es. giovedì alle 16 appuntamento con Verdi per le tende…" /><Button type="submit" aria-label="Interpreta" disabled={!text.trim()}><Send size={14} /></Button></form>
          {proposal && <div className="cal-proposal"><Sparkles size={14} /><span><strong>{proposal.title}</strong><small>Cora propone: {days[proposal.day]} · {fmt(proposal.start)}–{fmt(proposal.end)} · notifica sul telefono</small></span><Button onClick={confirm}><Check size={13} />Crea una volta</Button><Button onClick={() => setProposal(null)} aria-label="Annulla"><X size={13} /></Button></div>}
          <div className="cal-grid">
            <div className="cal-hours">{hours.map(h => <span key={h}>{fmt(h)}</span>)}</div>
            {days.map((d, di) => <div key={d} className={`cal-day ${di === 2 ? 'is-today' : ''}`}><div className="cal-day-head">{d}</div><div className="cal-day-body">
              {events.filter(e => e.day === di && !hidden.includes(e.cat)).map(e => <Button key={e.id} className={`cal-ev cal-c-${e.cat} ${sel?.id === e.id ? 'is-sel' : ''}`} style={{ top: `${(e.start - 8) * 52}px`, height: `${Math.max((e.end - e.start) * 52 - 3, 22)}px` }} onClick={() => setSel(e)}><strong>{e.title}</strong><small>{fmt(e.start)}</small></Button>)}
            </div></div>)}
          </div>
        </main>

        <aside className="pg-side">
          {sel ? <>
            <span className="fs-caption">EVENTO <Button onClick={() => setSel(null)} aria-label="Chiudi"><X size={12} /></Button></span>
            <h2 className="cal-title"><i className={`cal-c-${sel.cat}`} />{sel.title}</h2>
            <div className="pg-rule"><Clock size={13} />{days[sel.day]} · {fmt(sel.start)}–{fmt(sel.end)}</div>
            {sel.place && <div className="pg-rule"><MapPin size={13} />{sel.place}</div>}
            {sel.who && <div className="pg-rule"><User size={13} />{sel.who}</div>}
            <div className="pg-rule"><CalendarDays size={13} />{catLabel[sel.cat]}</div>
            <div className="pg-rule"><Bell size={13} />{sel.notify ? 'Notifica 30 min prima' : 'Nessuna notifica'}</div>
            <span className="fs-caption">CONSEGNA</span>
            <div className="cal-phone"><Smartphone size={18} /><span>{sel.notify ? 'Notifica programmata sul telefono' : 'Attiva per ricevere sul telefono'}<small>PWA · simulazione</small></span></div>
            <div className="fs-actions"><Button onClick={() => { setEvents(e => e.map(x => x.id === sel.id ? { ...x, notify: !x.notify } : x)); setSel({ ...sel, notify: !sel.notify }); }}><Bell size={13} />{sel.notify ? 'Disattiva notifica' : 'Attiva notifica'}</Button><Button onClick={() => { setEvents(e => e.filter(x => x.id !== sel.id)); setSel(null); }}><X size={13} />Elimina evento</Button></div>
          </> : <div className="fs-details-empty"><CalendarDays size={22} /><strong>Settimana 46</strong><span>{events.length} eventi · seleziona un evento per i dettagli.</span></div>}
        </aside>
      </div>
    </div>
  );
}
