import V2RepositoryStatus from "./V2RepositoryStatus";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Archive, Boxes, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Bell, Bot, Brain, CalendarDays, Check, ChevronRight, Code2, Cpu, FileText, Folder, GitBranch, Images, SquareTerminal, HardDrive, Layers, Mail, MessageSquare, Network, Pause, Play, Plus, Radio, LayoutGrid, Search, Settings2, ShieldCheck, Sparkles, Terminal, Workflow, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/source-button";
import V2NeuralMap from "./V2NeuralMap";
import { useV2Chat } from "../chat/ChatProvider";
import { textOf } from "../chat/model";

const agents = [
  { name: "Cora", role: "Coordinamento", icon: Brain, to: "/v2-chat", detail: "Orchestratore e diagnostica (W1): capisce la richiesta, sceglie lo strumento e ti chiede conferma prima di agire." },
  { name: "Programmatore", role: "Codice", icon: Code2, to: "/v2-programmer", detail: "Legge il codice di ServerIa e propone modifiche con diff da approvare (W3)." },
  { name: "Worker F1", role: "GPU remota", icon: Cpu, to: "/v2-monitor", detail: "Il laptop worker: da connettere e poi assegnargli davvero lavoro (trascrizioni, modelli)." },
  { name: "Agent Zero", role: "Agente remoto", icon: Bot, to: "/v2-monitor", detail: "Agente su un'altra macchina, visibile nel Monitor. Permessi da definire." },
] as const;
const apps = [
  { name: "Conversazioni", caption: "Dialogo e richieste a Cora", icon: MessageSquare, to: "/v2-chat" },
  { name: "File e audio", caption: "Drive, server, NAS e trascrizioni", icon: Folder, to: "/v2-files" },
  { name: "Attività IA", caption: "Cosa sta facendo Cora, passo per passo", icon: Activity, to: "/v2-activity" },
  { name: "Eventi", caption: "Collaudi, processi e registro operativo", icon: FileText, to: "/v2-events" },
  { name: "Programmi", caption: "Immich, Nextcloud, Magazzino Tele…", icon: LayoutGrid, to: "/v2-programs" },
  { name: "Roadmap", caption: "Albero di Cora: stato e prossimi passi", icon: GitBranch, to: "/v2-roadmap" },
  { name: "Foto · Immich", caption: "Schermata dedicata da costruire", icon: Images, to: "/v2-photos" },
  { name: "Aggiornamenti Cora", caption: "Preparazione, verifiche e rollback", icon: GitBranch, to: "/v2-updates" },
] as const;
const initialTasks = ["W1 · Orchestratore e diagnostica", "W2 · Aggiornare Immich e Nextcloud", "W3 · Attivare il Programmatore"];

export default function V2Home() {
  const chat = useV2Chat();
  const [activeAgent, setActiveAgent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [diving, setDiving] = useState(false);
  const navigate = useNavigate();
  const [clock, setClock] = useState("--:--:--");
  const [done, setDone] = useState<string[]>([]);
  const [routines, setRoutines] = useState([true, true, false]);
  const [prompt, setPrompt] = useState("");
  const quickThread = chat.threads.find(thread => thread.id === "quick");
  const quickRequest = quickThread?.messages.filter(message => message.role === "user").at(-1);
  const quickReply = quickThread?.messages.filter(message => message.role === "assistant").at(-1);
  const agent = agents[activeAgent] ?? agents[0];
  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString("it-IT", { timeZone: "Europe/Rome" }));
    update(); const timer = setInterval(update, 1000); return () => clearInterval(timer);
  }, []);
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/coming-soon" title="Torna al Coming Soon" aria-label="Torna al Coming Soon"><ArrowLeft size={17} /></Link><Link to="/v2-alignment" title="Schermate e corrispondenze" aria-label="Schermate e corrispondenze"><Layers size={17} /></Link><Link to="/v2-settings" title="Menu e impostazioni" aria-label="Menu e impostazioni"><Settings2 size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />

      <main className="ops-layout">
        <aside className="ops-column ops-left">
          <section className="ops-section">
            <div className="ops-section-head"><h2><Layers size={14} /> IL TUO WORKSPACE</h2><span>08</span></div>
            <div className="ops-app-list">{apps.map(item => <Link key={item.name} to={item.to} className="ops-conversations-link"><item.icon size={18} /><span><strong>{item.name}</strong><small>{item.caption}</small></span><ArrowUpRight size={13} /></Link>)}</div>
          </section>
          <section className="ops-section ops-calendar">
            <div className="ops-section-head"><h2><CalendarDays size={14} /> IL TUO TEMPO</h2><Link to="/v2-calendar" aria-label="Apri il calendario" title="Apri il calendario"><ArrowUpRight size={14} /></Link></div>
            <span className="ops-overline">EUROPE / ROME</span><div className="ops-clock">{clock}<small>ORA LOCALE</small></div>
            <div className="ops-week">{["L", "M", "M", "G", "V", "S", "D"].map((d, i) => <div key={i}><span>{d}</span><strong className={i === 2 ? "is-today" : ""}>{12 + i}</strong></div>)}</div>
            <div className="ops-agenda"><span>IN PROGRAMMA · DEMO</span><p><i />Controllo backup notturno <time>09:30</time></p><p><i />Sessione design Serveria V2 <time>21:00</time></p></div>
          </section>
          <section className="ops-section ops-server">
            <div className="ops-section-head"><h2><Cpu size={14} /> IL TUO SERVER</h2><Link to="/v2-monitor" aria-label="Apri il Monitor" title="Apri il Monitor"><ArrowUpRight size={14} /></Link></div>
            <div className="ops-server-summary"><strong>24<span>%</span></strong><div>CARICO CPU<small>Server Debian · demo</small></div><Activity size={32} /></div>
            {[{ label: "CPU", value: "24%", key: "cpu" }, { label: "RAM", value: "12.8 / 32 GB", key: "ram" }, { label: "GPU", value: "38%", key: "gpu" }].map(metric => <div className="ops-resource" key={metric.key}><span>{metric.label}</span><div className={`ops-bar ops-bar-${metric.key}`}><i /></div><strong>{metric.value}</strong></div>)}
            <div className="ops-storage"><HardDrive size={13} /><span>NAS · archivio</span><strong>428 GB / 1 TB</strong></div>
            <div className="ops-server-footer"><span><Radio size={11} /> RETE LOCALE</span><span>↓ 12.4 Mb/s</span></div>
          </section>
        </aside>

        <section className="ops-center" aria-labelledby="ops-title">
          <div className="ops-welcome"><span className="ops-overline">IL TUO SPAZIO. LA TUA INTELLIGENZA.</span><h1 id="ops-title">Ciao, Alessandro<span>.</span></h1><p>Il tuo server, i tuoi programmi e Cora, in un unico posto.</p></div>
          <div className={diving ? "ops-map is-diving" : "ops-map"}>
            <div className="ops-orbit" /><div className="ops-orbit ops-orbit-inner" />
            <V2NeuralMap paused={paused} />
            <Link to="/v2-architecture" className="ops-ring-btn ops-ring-btn-arch" aria-label="Apri la pagina Architettura"><Network size={13} /> Architettura</Link>
            <div className="ops-map-label"><span className="ops-live-dot" /> CORA WORKSPACE <span>10 PAGINE · 5 POSTI LIBERI</span></div>
            {Array.from({ length: 16 }, (_, i) => { const position = { left: `${50 + 45 * Math.cos(i * Math.PI / 8)}%`, top: `${50 + 45 * Math.sin(i * Math.PI / 8)}%` }; const links: Record<number, { to: "/v2-chat" | "/v2-notifications" | "/v2-mail" | "/v2-calendar" | "/v2-photos" | "/v2-files" | "/v2-audio" | "/v2-programmer" | "/v2-monitor" | "/v2-roadmap"; title: string; icon: typeof Bot }> = { 0: { to: "/v2-chat", title: "Chat", icon: MessageSquare }, 1: { to: "/v2-notifications", title: "Notifiche", icon: Bell }, 2: { to: "/v2-mail", title: "Mail", icon: Mail }, 3: { to: "/v2-calendar", title: "Calendario", icon: CalendarDays }, 4: { to: "/v2-photos", title: "Foto", icon: Images }, 5: { to: "/v2-files", title: "File", icon: Folder }, 6: { to: "/v2-audio", title: "Audio", icon: AudioLines }, 7: { to: "/v2-programmer", title: "Programma", icon: Code2 }, 8: { to: "/v2-monitor", title: "Sistema", icon: Zap }, 14: { to: "/v2-roadmap", title: "Roadmap", icon: GitBranch } }; if (i === 12) return null; const l = links[i]; if (l) { const L = l.icon; return <Link key={i} to={l.to} className="ops-satellite ops-satellite-link" style={position} title={l.title} aria-label={`Apri ${l.title}`}><L size={15} /></Link>; } return <span key={i} className="ops-satellite ops-satellite-free" style={position} title="Posto libero"><Plus size={13} /></span>; })}
            <Link to="/v2-memory" className="ops-core-link" aria-label="Entra nella memoria di Cora" title="Entra nella memoria" onClick={e => { e.preventDefault(); setDiving(true); setTimeout(() => navigate({ to: "/v2-memory" }), 650); }} />
            <div className="ops-core-label"><span>CORA</span><small>CONTEXT · CONNECT · CREATE</small></div>
            <Button className="ops-map-control" title={paused ? "Riprendi animazione" : "Pausa animazione"} aria-label={paused ? "Riprendi animazione" : "Pausa animazione"} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</Button>
            <span className="ops-map-coordinates">SYS.02 / CORA CORE</span>
          </div>
          <div className="ops-agent-selector" role="tablist" aria-label="Agenti">{agents.map((item, i) => <Button key={item.name} role="tab" aria-selected={activeAgent === i} aria-controls="ops-agent-detail" id={`ops-agent-${i}`} onClick={() => setActiveAgent(i)} className={activeAgent === i ? "is-active" : ""}><item.icon size={14} /><span>{item.name}</span></Button>)}</div>
          <div id="ops-agent-detail" role="tabpanel" aria-labelledby={`ops-agent-${activeAgent}`} className="ops-agent-detail"><span>{agent.role}</span><p>{agent.detail}</p></div>
          <form className="ops-command" onSubmit={e => { e.preventDefault(); if (prompt.trim() && !chat.running) { chat.send("quick", prompt); setPrompt(""); } }}><MessageSquare size={17} /><input aria-label="Messaggio per Cora" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Cora, da dove iniziamo?" /><Link to="/v2-chat/$threadId" params={{ threadId: "quick" }} aria-label="Apri le richieste veloci in Conversazioni" title="Apri in Conversazioni"><ArrowUpRight size={17} /></Link><Button type="submit" title="Invia messaggio" aria-label="Invia messaggio" disabled={!prompt.trim() || Boolean(chat.running)}><ArrowRight size={17} /></Button></form>
          {quickRequest ? <div className="ops-demo-answer" role="status"><strong>CORA / ANTEPRIMA</strong><p>«{textOf(quickRequest)}»</p><span>{chat.running?.threadId === "quick" ? "Preparazione della risposta demo…" : quickReply?.parts.length ? "Richiesta raccolta · nessuna azione reale eseguita." : ""}</span><Link className="ops-quick-open" to="/v2-chat/$threadId" params={{ threadId: "quick" }}>Continua in Conversazioni <ArrowUpRight size={13} /></Link></div> : <div className="ops-center-footer"><span><ShieldCheck size={12} /> IL TUO CONTESTO, AL CENTRO.</span><Link to="/v2-chat/$threadId" params={{ threadId: "quick" }}>RICHIESTE VELOCI <ArrowUpRight size={12} /></Link></div>}
        </section>

        <aside className="ops-column ops-right">
          <section className="ops-section ops-focus">
            <div className="ops-section-head"><h2><Zap size={14} /> FOCUS DI OGGI</h2><span>01 / 03</span></div>
            <span className="ops-overline">ORDINE OPERATIVO · ROADMAP</span><h3>Prossimi passi<br />di Cora<span>↗</span></h3><p>Dal percorso W1 → W2 → W3.<br /><Link to="/v2-roadmap">Apri la Roadmap</Link></p>
            <div className="ops-project-progress"><span>AVANZAMENTO · DEMO</span><strong>{Math.round(done.length / 3 * 100)}%</strong><div><i className={`ops-progress-${done.length}`} /></div></div>
            <div className="ops-checklist">{initialTasks.map(task => <Button key={task} onClick={() => setDone(done.includes(task) ? done.filter(t => t !== task) : [...done, task])} role="checkbox" aria-checked={done.includes(task)} className={done.includes(task) ? "is-done" : ""}><span className="ops-checkbox">{done.includes(task) && <Check size={11} />}</span>{task}</Button>)}</div>
          </section>
          <section className="ops-section ops-agents">
            <div className="ops-section-head"><h2><Network size={14} /> AGENTI</h2><span>IL TUO TEAM</span></div>
            <div className="ops-agent-grid">{agents.map((item, i) => <Button key={item.name} onClick={() => activeAgent === i ? navigate({ to: item.to }) : setActiveAgent(i)} title={activeAgent === i ? `Apri ${item.name}` : item.name} className={activeAgent === i ? "is-active" : ""}><item.icon size={17} /><strong>{item.name}</strong><span>{item.role}</span><small><i />{["IN ASCOLTO", "IN ATTESA W3", "DA CONNETTERE", "REMOTO"][i]}<ChevronRight size={11} /></small></Button>)}</div>
          </section>
          <section className="ops-section ops-routines">
            <div className="ops-section-head"><h2><Workflow size={14} /> ROUTINE</h2><Settings2 size={13} /></div>
            <div className="ops-routine-label"><span>FLUSSO</span><span>STATO</span></div>
            {["Backup notturno sul NAS", "Trascrizione esplicita degli audio", "Controllo aggiornamenti programmi"].map((name, i) => <div className="ops-routine" key={name}><span><small>{["03:00", "MANUALE", "08:00"][i]}</small>{name}</span><Button role="switch" aria-checked={routines[i]} aria-label={name} title={routines[i] ? "Disattiva routine" : "Attiva routine"} className={routines[i] ? "is-on" : ""} onClick={() => setRoutines(routines.map((value, index) => index === i ? !value : value))}><i /></Button></div>)}
            <Link to="/v2-updates" className="repo-cross-link">Aggiorna Cora <ArrowUpRight size={13}/></Link><Link to="/v2-events" className="ops-event ops-event-link" title="Apri il registro eventi"><span className="ops-live-dot" /><span>Contesto aggiornato<small>Ultima attività · pochi istanti fa · demo</small></span><ArrowUpRight size={12} /></Link>
          </section>
        </aside>
      </main>
      <footer className="ops-footer"><span><span className="ops-live-dot" /> UN SISTEMA. INFINITE POSSIBILITÀ.</span><Link to="/v2-alignment">Corrispondenze <ArrowUpRight size={12} /></Link><span>SERVERIA / PERSONAL INTELLIGENCE</span></footer>
    </div>
  );
}