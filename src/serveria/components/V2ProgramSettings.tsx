import V2RepositoryStatus from "./V2RepositoryStatus";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Archive, Check, Cpu, Globe, HardDrive, Play, RotateCcw, ScrollText, ShieldCheck, Square, Users } from "lucide-react";
import { Button } from "@/components/ui/source-button";
import { healthLabel, type Program } from "../programs/data";
import V2Nav from "./V2Nav";

const toggles = [
  { key: "autostart", label: "Avvio automatico", text: "Riparte da solo quando il server si accende." },
  { key: "autoupdate", label: "Aggiornamenti automatici", text: "Installa le versioni stabili di notte." },
  { key: "backup", label: "Includi nel backup", text: "Copia notturna di dati e configurazione." },
  { key: "remote", label: "Accesso da fuori casa", text: "Raggiungibile tramite indirizzo protetto." },
  { key: "cora", label: "Visibile a Cora", text: "Gli agenti possono leggere i riepiloghi." },
];
const logs = ["03:00 Backup completato", "02:14 Controllo integrità ok", "Ieri 19:02 Riavvio programmato", "Ieri 08:30 Accesso di Alessandro"];

export default function V2ProgramSettings({ program: p }: { program: Program }) {
  const [on, setOn] = useState<Record<string, boolean>>({ autostart: true, autoupdate: false, backup: true, remote: false, cora: true });
  const [running, setRunning] = useState(p.health !== "down");
  const [updated, setUpdated] = useState(false);
  const [notice, setNotice] = useState("");
  const say = (t: string) => setNotice(`${t} · simulazione, nessun servizio contattato.`);
  return (
    <div className="ops-page">
      <header className="ops-header">
        <Link to="/coming-soon" className="ops-brand">serveria<span>2.0</span></Link>
        <V2Nav />
        <div className="ops-header-right"><span className="ops-demo">ANTEPRIMA · DATI DEMO</span><Link to="/v2-programs" title="Torna ai programmi" aria-label="Torna ai programmi"><ArrowLeft size={17} /></Link><span className="ops-avatar">AS</span></div>
      </header>
      <V2RepositoryStatus />
      <main className="arc-main">
        <section className="arc-hero">
          <div><Link to="/v2-programs" className="ops-overline prg-back"><ArrowLeft size={12} /> PROGRAMMI / {p.category.toUpperCase()}</Link><h1>{p.name}<span className="prg-dot">.</span></h1><p>{p.description}</p></div>
          <div className="prg-actions">
            <span className={`prg-health is-${running ? p.health === "down" ? "ok" : p.health : "down"}`}><i />{p.future ? "Previsto" : running ? (p.health === "down" ? "In salute" : healthLabel[p.health]) : "Fermo"}</span>
            <Button onClick={() => { setRunning(!running); say(running ? "Programma arrestato" : "Programma avviato"); }} disabled={p.future}>{running ? <Square size={13} /> : <Play size={13} />}{running ? "Arresta" : "Avvia"}</Button>
            <Button onClick={() => say("Riavvio eseguito")} disabled={!running}><RotateCcw size={13} />Riavvia</Button>
          </div>
        </section>
        {notice && <div className="prg-notice" role="status">{notice}</div>}
        <div className="prg-settings">
          <div className="prg-col">
            <section className="ops-section">
              <div className="ops-section-head"><h2><Archive size={14} /> RIEPILOGO</h2><span>v{updated && p.latest ? p.latest : p.version}</span></div>
              <div className="prg-stats prg-stats-lg">{p.stats.map(s => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>
              <p className="prg-note">{p.healthNote}</p>
            </section>
            <section className="ops-section">
              <div className="ops-section-head"><h2><Cpu size={14} /> RISORSE</h2><span>UPTIME {running ? p.uptime : "—"}</span></div>
              <div className="ops-resource"><span>CPU</span><div className="prg-bar"><i style={{ width: `${running ? Math.max(p.cpu, 2) : 0}%` }} /></div><strong>{running ? p.cpu : 0}%</strong></div>
              <div className="ops-storage"><HardDrive size={13} /><span>Memoria RAM</span><strong>{running ? p.ram : "0 MB"}</strong></div>
              <div className="ops-storage"><Globe size={13} /><span>Porta</span><strong>{p.port}</strong></div>
            </section>
            <section className="ops-section">
              <div className="ops-section-head"><h2><ShieldCheck size={14} /> AGGIORNAMENTI</h2></div>
              {p.latest && !updated ? <><p className="prg-note">Nuova versione <strong>{p.latest}</strong> disponibile (attuale {p.version}).</p><Button className="prg-primary" onClick={() => { setUpdated(true); say(`Aggiornato a ${p.latest}`); }}>Aggiorna ora</Button></> : <p className="prg-note"><Check size={13} /> Nessun altro aggiornamento nella demo; versione reale non letta.</p>}
            </section>
          </div>
          <div className="prg-col">
            <section className="ops-section">
              <div className="ops-section-head"><h2>IMPOSTAZIONI</h2><span>PROPOSTE V2 · DA INTEGRARE</span></div>
              {toggles.map(t => <div className="prg-toggle" key={t.key}><span><strong>{t.label}</strong><small>{t.text}</small></span><Button role="switch" aria-checked={on[t.key]} aria-label={t.label} className={`prg-switch${on[t.key] ? " is-on" : ""}`} onClick={() => setOn({ ...on, [t.key]: !on[t.key] })}><i /></Button></div>)}
            </section>
            <section className="ops-section">
              <div className="ops-section-head"><h2><Users size={14} /> ACCESSI</h2><span>PROSSIMAMENTE</span></div>
              <p className="prg-note">Chi può usare {p.name}, con quali permessi e da quali dispositivi.</p>
            </section>
          </div>
          <div className="prg-col">
            <section className="ops-section">
              <div className="ops-section-head"><h2><ScrollText size={14} /> ATTIVITÀ</h2><span>DEMO</span></div>
              <div className="prg-log">{logs.map(l => <p key={l}><i />{l}</p>)}</div>
            </section>
            <section className="ops-section prg-danger">
              <div className="ops-section-head"><h2>ZONA DELICATA</h2></div>
              <Button onClick={() => say("Cache svuotata")}>Svuota cache</Button>
              <Button onClick={() => say("Disinstallazione non disponibile in anteprima")}>Disinstalla</Button>
            </section>
          </div>
        </div>
      </main>
      <footer className="ops-footer"><span><span className="ops-live-dot" /> IMPOSTAZIONI DEL PROGRAMMA</span><Link to="/v2-programs">Tutti i programmi</Link><span>SERVERIA / {p.name.toUpperCase()}</span></footer>
    </div>
  );
}
