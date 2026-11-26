import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, LayoutGrid, Plus, RefreshCw, Search } from "lucide-react";
import { programs, healthLabel } from "../programs/data";
import V2Nav from "./V2Nav";

export default function V2Programs() {
  const [query, setQuery] = useState("");
  const list = programs.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  const installed = programs.filter(p => !p.future);
  const updates = installed.filter(p => p.latest).length;
  const issues = installed.filter(p => p.health !== "ok").length;
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-home" title="Torna alla Home V2" aria-label="Torna alla Home V2"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <main className="arc-main">
        <section className="arc-hero">
          <div><span className="ops-overline"><LayoutGrid size={13} /> SERVER / PROGRAMMI</span><h1>Programmi<span className="prg-dot">.</span></h1><p>Tutto ciò che vive sul tuo server, in un unico elenco. Apri un programma per vederne lo stato e le impostazioni.</p></div>
          <div className="prg-summary">
            <div><strong>{installed.length}</strong><span>INSTALLATI</span></div>
            <div><strong className="prg-accent">{updates}</strong><span>AGGIORNAMENTI</span></div>
            <div><strong className={issues ? "prg-warn" : ""}>{issues}</strong><span>DA CONTROLLARE</span></div>
          </div>
        </section>
        <div className="prg-toolbar">
          <label className="prg-search"><Search size={14} /><input aria-label="Cerca programma" placeholder="Cerca un programma…" value={query} onChange={e => setQuery(e.target.value)} /></label>
          <span className="prg-hint"><RefreshCw size={12} /> Controllo aggiornamenti · demo</span>
        </div>
        <div className="prg-grid">
          {list.map(p => (
            <Link key={p.id} to="/v2-programs/$programId" params={{ programId: p.id }} className={`prg-card${p.future ? " is-future" : ""}`}>
              <div className="prg-card-head">
                <span className="prg-mono">{p.name.slice(0, 2).toUpperCase()}</span>
                <div><strong>{p.name}</strong><small>{p.category}</small></div>
                <ArrowUpRight size={15} />
              </div>
              <p>{p.description}</p>
              <div className="prg-stats">{p.stats.map(s => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>
              <div className="prg-card-foot">
                <span className={`prg-health is-${p.health}`}><i />{p.future ? "Previsto" : healthLabel[p.health]}</span>
                {p.latest ? <span className="prg-update">↑ {p.latest} disponibile</span> : <span className="prg-version">v{p.version}</span>}
              </div>
            </Link>
          ))}
          <div className="prg-card prg-add"><Plus size={22} /><strong>Aggiungi programma</strong><small>Catalogo app · prossimamente</small></div>
        </div>
      </main>
      <footer className="ops-footer"><span><span className="ops-live-dot" /> IL TUO SERVER, IN ORDINE.</span><Link to="/v2-home">Home V2 <ArrowUpRight size={12} /></Link><span>SERVERIA / PROGRAMMI</span></footer>
    </div>
  );
}
