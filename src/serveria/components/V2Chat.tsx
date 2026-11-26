import V2RepositoryStatus from "./V2RepositoryStatus";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, AudioLines, Brain, Check, Code2, Copy, Download, Folder, Globe, Image, Info, Menu, MessageSquare, PanelRightClose, Paperclip, Plus, Search, Server, Settings2, ShieldCheck, SquarePen, ThumbsDown, ThumbsUp, Trash2, Workflow, X } from "lucide-react";
import { Button } from "@/components/ui/source-button";
import { Conversation, ConversationContent, ConversationScrollButton, Message, MessageContent, MessageResponse, MessageActions, PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit, usePromptInputAttachments, type PromptInputMessage, Tool, ToolHeader, ToolContent, ToolInput, ToolOutput, Shimmer } from "../chat/presentation";
import { useV2Chat } from "../chat/ChatProvider";
import { chatTools, projects, textOf } from "../chat/model";

const toolIcons = [Folder, Server, Globe, Code2, Workflow, Image];
const suggestions = [
  { icon: Server, title: "Il mio server", text: "Prepara un riepilogo delle risorse e dei programmi del server", tool: "server" },
  { icon: Workflow, title: "Un nuovo flusso", text: "Progettiamo un’automazione per il briefing del mattino", tool: "automation" },
  { icon: Folder, title: "Il mio contesto", text: "Organizziamo i documenti del progetto Serveria V2", tool: "library" },
  { icon: Code2, title: "Dall’idea al codice", text: "Definiamo il prossimo prototipo per Serveria", tool: "code" },
];

function Attachments() {
  const attachments = usePromptInputAttachments();
  return <>{attachments.files.length > 0 && <div className="vc-attachments">{attachments.files.map(file => <span key={file.id}><Paperclip size={13} />{file.filename}<Button title="Rimuovi allegato" aria-label={`Rimuovi ${file.filename}`} onClick={() => attachments.remove(file.id)}><X size={12} /></Button></span>)}</div>}</>;
}
function AttachButton() {
  const attachments = usePromptInputAttachments();
  return <Button aria-label="Aggiungi foto e file" title="Aggiungi foto e file" onClick={() => attachments.openFileDialog()}><Paperclip size={17} /></Button>;
}
function CoraMark({ small = false }: { small?: boolean }) {
  return <div className={`vc-cora-mark ${small ? "is-small" : ""}`} aria-label="Cora"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="27" /><ellipse cx="40" cy="40" rx="15" ry="27" /><ellipse cx="40" cy="40" rx="27" ry="12" /><path d="M18 22 62 58M18 58 62 22" /><circle cx="40" cy="40" r="5" /><circle cx="13" cy="40" r="3" /><circle cx="67" cy="40" r="3" /><circle cx="40" cy="13" r="3" /><circle cx="40" cy="67" r="3" /></svg></div>;
}

export default function V2Chat({ threadId }: { threadId?: string }) {
  const chat = useV2Chat();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [toolMenu, setToolMenu] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [mode, setMode] = useState("Dialogo");
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const textarea = useRef<HTMLTextAreaElement>(null);
  const current = chat.threads.find(t => t.id === threadId);
  const busy = Boolean(chat.running);
  const runningHere = Boolean(chat.running && chat.running.threadId === threadId);
  const filtered = chat.threads.filter(t => (!projectFilter || t.project === projectFilter) && t.title.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (threadId) chat.ensure(threadId); }, [threadId]);
  useEffect(() => { textarea.current?.focus(); }, [threadId, runningHere]);
  function go(id: string) { setSidebar(false); setInput(""); setNotice(""); void navigate({ to: "/v2-chat/$threadId", params: { threadId: id } }); }
  function newChat(project?: string) { go(chat.create(project)); }
  function send(message: PromptInputMessage) {
    if (busy || (!message.text.trim() && !message.files.length)) return;
    const id = threadId ?? chat.create(projectFilter || undefined);
    chat.send(id, message.text, message.files, selectedTool);
    setInput(""); setToolMenu(false); setNotice("");
    if (!threadId) go(id);
    textarea.current?.focus();
  }
  function exportChat() {
    if (!current) return;
    const url = URL.createObjectURL(new Blob([current.messages.map(m => `## ${m.role === "user" ? "Tu" : current.agent}\n\n${textOf(m)}`).join("\n\n")], { type: "text/markdown" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "serveria-conversazione.md"; anchor.click(); URL.revokeObjectURL(url);
  }
  return <div className="ops-page vc-page">
    <header className="ops-header vc-header"><Link className="ops-brand" to="/v2-home">serveria<span>2.0</span></Link><div className="vc-header-label"><MessageSquare size={13} /> CONVERSAZIONI</div><div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" title="Torna alla Home V2" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div></header>
      <V2RepositoryStatus />
    <div className={`vc-layout ${contextOpen ? "has-context" : ""}`}>
      {sidebar && <div className="vc-mobile-backdrop" onClick={() => setSidebar(false)} />}
      <aside className={`vc-sidebar ${sidebar ? "is-open" : ""}`} aria-label="Conversazioni">
        <div className="vc-sidebar-top"><span className="ops-overline">IL TUO DIALOGO</span><Button className="vc-mobile-close" aria-label="Chiudi menu" onClick={() => setSidebar(false)}><X size={16} /></Button></div>
        <Button className="vc-new" onClick={() => newChat()}><SquarePen size={16} />Nuova conversazione<Plus size={14} /></Button>
        <label className="vc-search"><Search size={14} /><input placeholder="Cerca conversazioni" aria-label="Cerca conversazioni" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <div className="vc-section-label">PROGETTI<Button aria-label="Nuova chat in Serveria V2" title="Nuova chat in Serveria V2" onClick={() => newChat("Serveria V2")}><Plus size={13} /></Button></div>
        <div className="vc-projects">{projects.slice(1).map(project => <Button key={project} className={projectFilter === project ? "is-active" : ""} onClick={() => setProjectFilter(projectFilter === project ? "" : project)}><Folder size={14} /><span>{project}</span><small>{chat.threads.filter(t => t.project === project).length}</small></Button>)}</div>
        <div className="vc-section-label">{projectFilter || "CONVERSAZIONI"}{projectFilter && <Button aria-label="Tutti i progetti" onClick={() => setProjectFilter("")}><X size={13} /></Button>}</div>
        <div className="vc-thread-list">{filtered.map(thread => <div key={thread.id} className={`vc-thread ${thread.id === threadId ? "is-active" : ""}`}><Button onClick={() => go(thread.id)}><MessageSquare size={13} /><span>{thread.title}<small>{thread.project}</small></span></Button><Button aria-label={`Elimina ${thread.title}`} title="Elimina conversazione" disabled={busy} onClick={() => { if (!window.confirm("Eliminare questa conversazione dall’anteprima?")) return; chat.remove(thread.id); if (thread.id === threadId) void navigate({ to: "/v2-chat" }); }}><Trash2 size={12} /></Button></div>)}{!filtered.length && <p className="vc-muted">Nessuna conversazione trovata.</p>}</div>
        <div className="vc-sidebar-bottom"><Link to="/v2-automations"><Workflow size={15} />Automazioni e tool<ArrowUpRight size={12} /></Link><Link to="/v2-programs"><Server size={15} />Programmi<ArrowUpRight size={12} /></Link><span><ShieldCheck size={13} />SOLO QUESTA SESSIONE</span></div>
      </aside>
      <main className="vc-main">
        <div className="vc-toolbar"><Button className="vc-menu-button" aria-label="Apri menu conversazioni" title="Conversazioni" onClick={() => setSidebar(true)}><Menu size={19} /></Button><label className="vc-agent"><CoraMark small /><select aria-label="Agente" value={current?.agent ?? "Cora"} onChange={e => { const id = threadId ?? chat.create(); chat.update(id, { agent: e.target.value }); if (!threadId) go(id); }}><option>Cora</option><option>Developer</option><option>Researcher</option><option>Archivist</option></select></label><div className="vc-modes" role="tablist" aria-label="Modalità">{["Dialogo", "Compito"].map(item => <Button role="tab" aria-selected={mode === item} className={mode === item ? "is-active" : ""} key={item} onClick={() => setMode(item)}>{item === "Dialogo" ? <MessageSquare size={13} /> : <Workflow size={13} />}{item}</Button>)}</div><div className="vc-toolbar-right"><Button aria-label="Esporta conversazione" title="Esporta conversazione" onClick={exportChat} disabled={!current?.messages.length}><Download size={16} /></Button><Button aria-label="Contesto e impostazioni" title="Contesto e impostazioni" aria-expanded={contextOpen} onClick={() => setContextOpen(!contextOpen)}><Settings2 size={17} /></Button></div></div>
        {current?.messages.length ? <Conversation key={threadId} className="vc-conversation"><ConversationContent className="vc-transcript"><div className="vc-conversation-title"><span className="ops-overline">{current.project}</span><h1>{current.title}</h1></div>{current.messages.map(message => <Message key={message.id} from={message.role} className="vc-message">{message.role === "assistant" && <div className="vc-message-agent"><CoraMark small /><span>{current.agent.toUpperCase()}</span><small>ANTEPRIMA</small></div>}<MessageContent>{message.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i}>{part.text}</MessageResponse> : part.type === "file" ? <span className="vc-file" key={i}><Paperclip size={15} />{part.filename ?? "Allegato"}</span> : part.type === "dynamic-tool" ? <Tool key={i} defaultOpen={false} className="vc-tool-result"><ToolHeader type="dynamic-tool" toolName={part.toolName} state={part.state} title={`${part.toolName} · simulazione`} /><ToolContent><ToolInput input={part.input} /><ToolOutput output={part.output} errorText={part.errorText} /></ToolContent></Tool> : null)}{chat.running?.messageId === message.id && <Shimmer>Preparazione della risposta demo…</Shimmer>}</MessageContent>{message.role === "assistant" && message.parts.length > 0 && <MessageActions><Button title="Copia risposta" aria-label="Copia risposta" onClick={async () => { try { await navigator.clipboard.writeText(textOf(message)); setCopied(message.id); } catch { setNotice("Copia non disponibile in questo browser."); } }}>{copied === message.id ? <Check size={14} /> : <Copy size={14} />}</Button>{["utile", "da migliorare"].map((vote, i) => <Button key={vote} title={vote} aria-label={`Risposta ${vote}`} aria-pressed={votes[message.id] === vote} onClick={() => setVotes(prev => ({ ...prev, [message.id]: prev[message.id] === vote ? "" : vote }))}>{i === 0 ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}</Button>)}</MessageActions>}</Message>)}</ConversationContent><ConversationScrollButton aria-label="Vai agli ultimi messaggi" /></Conversation> : <div className="vc-empty"><div className="vc-empty-brand"><CoraMark /><span className="ops-overline">CONTEXT · CONNECT · CREATE</span><h1>Da dove iniziamo,<br />Alessandro<span>?</span></h1><p>Uno spazio per le idee. Un filo per tenerle insieme.</p></div><div className="vc-suggestions">{suggestions.map(s => <Button key={s.title} onClick={() => { setInput(s.text); setSelectedTool(s.tool); textarea.current?.focus(); }}><s.icon size={18} /><strong>{s.title}</strong><ArrowUpRight size={13} /><span>{s.text}</span></Button>)}</div></div>}
        <div className="vc-compose-wrap">{notice && <div className="vc-notice" role="status"><Info size={14} />{notice}<Button aria-label="Chiudi avviso" onClick={() => setNotice("")}><X size={13} /></Button></div>}{toolMenu && <div className="vc-tool-menu"><div className="vc-section-label">STRUMENTI / ANTEPRIMA<Button aria-label="Chiudi strumenti" onClick={() => setToolMenu(false)}><X size={15} /></Button></div>{chatTools.map((tool, i) => { const Icon = toolIcons[i] ?? Folder; return <Button key={tool.id} onClick={() => { setSelectedTool(selectedTool === tool.id ? "" : tool.id); setToolMenu(false); textarea.current?.focus(); }}><Icon size={17} /><span><strong>{tool.name}</strong><small>{tool.detail}</small></span>{selectedTool === tool.id ? <Check size={14} /> : <Plus size={14} />}</Button>; })}</div>}
          <PromptInput key={threadId ?? "new"} className="vc-composer" multiple onSubmit={send}><Attachments /><PromptInputTextarea ref={textarea} autoFocus aria-label="Messaggio per Cora" placeholder={mode === "Compito" ? "Cora, ecco il compito che vorrei affidarti…" : "Chiedi a Cora, o condividi un’idea…"} value={input} onChange={e => setInput(e.target.value)} /><PromptInputFooter><div className="vc-composer-tools"><Button aria-label="Apri strumenti" title="Strumenti" aria-expanded={toolMenu} onClick={() => setToolMenu(!toolMenu)}><Plus size={18} /></Button><AttachButton /><Button className={mode === "Compito" ? "is-active" : ""} title="Ragionamento approfondito" aria-label="Ragionamento approfondito" onClick={() => { setMode(mode === "Compito" ? "Dialogo" : "Compito"); }}><Brain size={17} /></Button>{selectedTool && <Button className="vc-selected-tool" onClick={() => setSelectedTool("")} title="Rimuovi strumento">{chatTools.find(t => t.id === selectedTool)?.name}<X size={12} /></Button>}</div><div className="vc-composer-tools"><Button aria-label="Modalità voce" title="Modalità voce" onClick={() => setNotice("La modalità voce è un obiettivo futuro; nessun microfono viene attivato nell’anteprima.")}><AudioLines size={18} /></Button><PromptInputSubmit status={runningHere ? "submitted" : "ready"} disabled={busy && !runningHere} onStop={chat.stop} aria-label={runningHere ? "Interrompi risposta" : "Invia messaggio"} title={runningHere ? "Interrompi risposta" : "Invia messaggio"} /></div></PromptInputFooter></PromptInput>
          <div className="vc-compose-note"><span><ShieldCheck size={11} />ANTEPRIMA · NESSUN COMPITO REALE</span><span>CRONOLOGIA NON SALVATA</span></div>
        </div>
      </main>
      {contextOpen && <aside className="vc-context" aria-label="Contesto della conversazione"><div className="vc-section-label">CONTESTO<Button aria-label="Chiudi contesto" onClick={() => setContextOpen(false)}><PanelRightClose size={17} /></Button></div><CoraMark small /><h2>{current?.agent ?? "Cora"}</h2><p>Il tuo contesto, al centro.</p><label>TITOLO<input aria-label="Titolo conversazione" value={current?.title ?? "Nuova conversazione"} disabled={!current} onChange={e => { if (threadId) chat.update(threadId, { title: e.target.value }); }} /></label><label>PROGETTO<select aria-label="Progetto conversazione" value={current?.project ?? "Personale"} onChange={e => { const id = threadId ?? chat.create(e.target.value); chat.update(id, { project: e.target.value }); if (!threadId) go(id); }}>{projects.map(p => <option key={p}>{p}</option>)}</select></label><div className="vc-context-block"><span className="ops-overline">MEMORIA DI LAVORO</span><p>{current?.messages.filter(m => m.role === "user").length ?? 0} richieste in questa chat</p><p><ShieldCheck size={12} /> Solo questa sessione</p></div><div className="vc-context-block"><span className="ops-overline">CONFINI E PERMESSI</span><p>Server e programmi <small>Non collegati</small></p><p>Azioni con effetti <small>Non eseguite</small></p><p>Memoria persistente <small>Disattivata</small></p></div><Link to="/v2-architecture" className="vc-context-link">Architettura di Cora<ArrowUpRight size={13} /></Link><Link to="/v2-automations" className="vc-context-link">Automazioni e tool<ArrowUpRight size={13} /></Link></aside>}
    </div>
  </div>;
}