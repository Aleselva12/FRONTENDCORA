import V2RepositoryStatus from "./V2RepositoryStatus";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Brain, Cpu, Lock, Network, Play, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/source-button";
import V2Nav from "./V2Nav";
import { agents, autonomyLevels, nodeById, nodes, views, vramOn, type Autonomy, type ViewId } from "../architecture/model";

const W = 1000, H = 520;
const kindLabel: Record<string, string> = { input: "INGRESSO", core: "SUPERVISORE", memory: "MEMORIA", agent: "AGENTE", tool: "STRUMENTO", machine: "MACCHINA", output: "USCITA" };
const machineName: Record<string, string> = { debian: "Server Debian", f1: "Worker F1", nas: "NAS" };

export default function V2Architecture() {
  const [viewId, setViewId] = useState<ViewId>("flow");
  const [selectedId, setSelectedId] = useState("cora");
  const [levels, setLevels] = useState<Record<string, Autonomy>>({});
  const [step, setStep] = useState(-1);
  const view = views.find(v => v.id === viewId)!;
  const selected = nodeById(selectedId) ?? nodeById("cora")!;
  const levelOf = (id: string) => levels[id] ?? nodeById(id)!.autonomy;
  const linked = useMemo(() => new Set(view.edges.flatMap(e => e.source === selectedId || e.target === selectedId ? [e.source, e.target] : [])), [view, selectedId]);
  const approvals = nodes.filter(n => levelOf(n.id) === 3).length;

  const select = (id: string) => { setSelectedId(id); setStep(-1); };
  const runTrace = () => {
    const t = selected.trace; if (!t) return;
    t.forEach((_, i) => setTimeout(() => setStep(i), i * 600));
  };

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
          <div>
            <span className="ops-overline"><span className="ops-live-dot" /> PIANO DI GESTIONE IA</span>
            <h1>Architettura</h1>
            <p>Chi fa cosa, dove gira e fin dove può spingersi da solo. Cambia vista, seleziona un nodo e decidi il suo livello di autonomia.</p>
          </div>
          <div className="arc-stats">
            <div><strong>{agents.length}</strong><span>AGENTI</span></div>
            <div><strong>3</strong><span>MACCHINE</span></div>
            <div><strong>{vramOn("debian").toFixed(1)}</strong><span>GB GPU SERVER</span></div>
            <div><strong className="arc-warn">{approvals}</strong><span>CHIEDONO OK</span></div>
          </div>
        </section>

        <div className="arc-grid">
          <section className="arc-map-panel" aria-label="Mappa del sistema">
            <div className="arc-panel-head">
              <h2><Network size={14} /> MAPPA <em>{view.hint}</em></h2>
              <div className="arcx-tabs" role="tablist">
                {views.map(v => <Button key={v.id} role="tab" aria-selected={v.id === viewId} className={v.id === viewId ? "on" : ""} onClick={() => setViewId(v.id)}>{v.label}</Button>)}
              </div>
            </div>
            <div className="arc-map-scroll"><div className="arc-map">
              <svg viewBox={`0 0 ${W} ${H}`} className="arc-lines" aria-hidden="true">
                <defs><pattern id="arc-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" /></pattern></defs>
                <rect width={W} height={H} fill="url(#arc-grid)" className="arc-gridbg" />
                {viewId === "security" && [130, 230, 330].map(r => <circle key={r} cx={500} cy={260} r={r} className="arc-ring dashed" />)}
                {view.edges.map((e, i) => {
                  const a = view.positions[e.source], b = view.positions[e.target];
                  if (!a || !b) return null;
                  const hot = e.source === selectedId || e.target === selectedId;
                  const lvl = viewId === "security" ? `lvl${levelOf(e.target)}` : "";
                  return <path key={i} d={`M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`} className={`arc-edge ${lvl} ${hot ? "hot" : ""}`}><title>{e.label}</title></path>;
                })}
              </svg>
              {Object.entries(view.positions).map(([id, p]) => {
                const n = nodeById(id)!;
                const cls = ["arc-node", n.kind === "core" ? "central" : "", `arcx-${n.kind}`, viewId === "security" ? `lvl${levelOf(id)}` : "", selectedId === id ? "selected" : "", linked.has(id) ? "linked" : ""].join(" ");
                return <Button key={id} className={cls} style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }} aria-pressed={selectedId === id} onClick={() => select(id)}>
                  {n.kind === "core" ? <Brain size={18} /> : n.kind === "machine" ? <Cpu size={14} /> : <span className="arc-dot" />}
                  <strong>{n.name}</strong>
                  <small>{viewId === "security" ? `LIVELLO ${levelOf(id)}` : kindLabel[n.kind]}</small>
                </Button>;
              })}
            </div></div>
            <div className="arc-legend">
              {viewId === "security"
                ? <><span><i className="arcx-sw lvl1" /> Autonomo</span><span><i className="arcx-sw lvl2" /> Con avviso</span><span><i className="arcx-sw lvl3" /> Serve il tuo OK</span></>
                : <><span><i className="arc-key hot" /> Collegato al nodo scelto</span><span><i className="arc-key" /> Collegamento</span></>}
              <span>SIMULAZIONE</span>
            </div>
          </section>

          <aside className="arc-inspector">
            <span className="ops-overline">{kindLabel[selected.kind]}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <dl>
              <div><dt>Gira su</dt><dd>{machineName[selected.machine]}</dd></div>
              {selected.model && <div><dt>Modello</dt><dd>{selected.model}</dd></div>}
              {selected.engine && <div><dt>Motore</dt><dd>{selected.engine}</dd></div>}
              {selected.vramGb && <div><dt>Memoria GPU</dt><dd>{selected.vramGb} GB</dd></div>}
              {selected.kind === "machine" && <div><dt>GPU occupata</dt><dd>{vramOn(selected.id).toFixed(1)} GB</dd></div>}
            </dl>
            {selected.permissions.length > 0 && <><span className="ops-overline"><Lock size={11} /> PERMESSI</span>
              <div className="arc-chips">{selected.permissions.map(p => <span key={p}>{p}</span>)}</div></>}
            {selected.kind !== "machine" && <>
              <span className="ops-overline"><ShieldCheck size={11} /> AUTONOMIA</span>
              <div className="arcx-levels">
                {([1, 2, 3] as Autonomy[]).map(l => <Button key={l} className={`lvl${l} ${levelOf(selected.id) === l ? "on" : ""}`} aria-pressed={levelOf(selected.id) === l} onClick={() => setLevels(s => ({ ...s, [selected.id]: l }))}>{l} · {autonomyLevels[l - 1]?.title}</Button>)}
              </div>
            </>}
            {selected.trace && <div className="arc-placeholder-box">
              <span className="ops-overline"><Play size={11} /> PROVA UN PERCORSO</span>
              <ol className="arcx-trace">{selected.trace.map((t, i) => <li key={t} className={i <= step ? "done" : ""}>{t}{i === selected.trace!.length - 1 && levelOf(selected.id) === 3 && i <= step ? " · in attesa del tuo OK" : ""}</li>)}</ol>
              <Button className="arc-toggle" onClick={runTrace}>AVVIA SIMULAZIONE</Button>
            </div>}
          </aside>
        </div>

        <section className="arc-support">
          <div className="ops-section-head"><h2><ShieldCheck size={14} /> LIVELLI DI AUTONOMIA · TU DECIDI</h2><span>{approvals} NODI CHIEDONO OK</span></div>
          <div className="arcx-hitl">
            {autonomyLevels.map(l => <article key={l.level} className={`lvl${l.level}`}>
              <small>LIVELLO {l.level}</small><strong>{l.title}</strong><p>{l.text}</p>
              <ul>{l.examples.map(e => <li key={e}>{e}</li>)}</ul>
              <div className="arc-chips">{nodes.filter(n => n.kind !== "machine" && levelOf(n.id) === l.level).map(n => <span key={n.id} onClick={() => select(n.id)}>{n.name}</span>)}</div>
            </article>)}
          </div>
        </section>

        <section className="arc-support">
          <div className="ops-section-head"><h2><Users size={14} /> AGENTI E RISORSE</h2><span>{String(agents.length).padStart(2, "0")}</span></div>
          <div className="arcx-matrix">
            {agents.map(a => <Button key={a.id} className={`arcx-card ${selectedId === a.id ? "selected" : ""}`} onClick={() => select(a.id)}>
              <span className="arcx-card-head"><strong>{a.name}</strong><i className={`arcx-sw lvl${levelOf(a.id)}`} /></span>
              <small>{a.model ?? "—"} · {a.engine ?? ""}</small>
              <span className="arcx-bar"><i style={{ width: `${Math.min(((a.vramGb ?? 0) / 12) * 100, 100)}%` }} /></span>
              <small>{a.vramGb ? `${a.vramGb} GB GPU` : "senza GPU dedicata"} · {machineName[a.machine]}</small>
            </Button>)}
          </div>
        </section>
      </main>

      <footer className="ops-footer"><span><span className="ops-live-dot" /> UN SISTEMA. INFINITE POSSIBILITÀ.</span><Link to="/v2-alignment">Corrispondenze <ArrowUpRight size={12} /></Link><span>DATI DIMOSTRATIVI</span></footer>
    </div>
  );
}
