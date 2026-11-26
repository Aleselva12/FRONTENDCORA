import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Command, MessageSquare, Network, Folder, Plus, Sparkles, Check, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/source-button";
import sculpture from "@/assets/serveria-v2-sculpture.jpg";

const concepts = [
  { id: "chat", label: "Conversazioni", icon: MessageSquare, title: "Dalle idee, alle cose fatte.", prompt: "Cora, organizziamo il prossimo progetto.", response: "Partiamo da ciò che conta. Ho preparato uno spazio per le tue idee, i documenti e i prossimi passi.", items: ["Definire la direzione", "Raccogliere i materiali", "Costruire il primo prototipo"] },
  { id: "agents", label: "Agenti", icon: Network, title: "Un'intelligenza. Più prospettive.", prompt: "Mettiamo al lavoro il team.", response: "Ogni agente ha un ruolo preciso. Cora mantiene il contesto e coordina il lavoro in un unico spazio.", items: ["Cora · Coordinamento", "Developer · Codice", "Researcher · Ricerca"] },
  { id: "files", label: "Libreria", icon: Folder, title: "Il tuo contesto, sempre vicino.", prompt: "Ritroviamo le idee del progetto.", response: "Documenti, appunti e riferimenti, riuniti intorno al tuo lavoro. Meno ricerca, più continuità.", items: ["Visione del progetto.md", "Identità visiva.fig", "Appunti e riferimenti"] },
] as const;

export default function ComingSoon() {
  const preview = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof concepts)[number]["id"]>("chat");
  const concept = concepts.find(item => item.id === active) ?? concepts[0];
  function explore() {
    preview.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return (
    <div className="v2-page">
      <header className="v2-header">
        <Link to="/coming-soon" className="v2-wordmark" aria-label="Serveria Versione 2">serveria<span>®</span></Link>
        <span className="v2-header-edition">THE NEXT CHAPTER / V.02</span>
        <Link to="/v2-home" className="v2-return">Home V2 <ArrowUpRight size={16} /></Link>
      </header>

      <main>
        <section className="v2-hero" aria-labelledby="v2-title">
          <img className="v2-hero-image" src={sculpture} width={1920} height={1088} alt="Scultura in titanio intrecciato, illuminata da riflessi verde menta" fetchPriority="high" />
          <div className="v2-hero-content">
            <div className="v2-kicker"><span className="v2-status-dot" /> VERSIONE 2 · COMING SOON</div>
            <h1 id="v2-title">Serveria<span className="v2-title-version">2.0<span className="v2-title-arrow" aria-hidden="true">↗</span></span></h1>
            <p className="v2-hero-lead">Più spazio alle idee.<br />Una nuova forma di intelligenza.</p>
            <p className="v2-hero-description">Il prossimo capitolo del tuo workspace.<br />Ripensato intorno a te, insieme a Cora.</p>
            <Button className="v2-cta" onClick={explore}>Esplora la V2 <ArrowDown size={17} /></Button>
          </div>
          <div className="v2-hero-foot"><span>IN EVOLUZIONE. NON PER CASO.</span><span>01 — UN NUOVO INIZIO <ArrowDown size={13} /></span></div>
          <span className="v2-object-caption">FIG. 02 / CONTINUOUS INTELLIGENCE</span>
        </section>

        <div className="v2-manifesto-strip"><span>IL TUO SPAZIO.</span><Sparkles size={22} /><span>LA TUA INTELLIGENZA.</span><Sparkles size={22} /><span>NESSUN RUMORE.</span><ArrowUpRight size={30} /></div>

        <section className="v2-vision">
          <div className="v2-section-label">02 / LA DIREZIONE</div>
          <div className="v2-vision-main"><h2>Meno distrazioni.<br />Più <em>possibilità.</em></h2><p>Non un altro strumento da gestire.<br />Un luogo in cui pensare, creare e portare avanti ciò che conta. La nuova Serveria parte da qui.</p></div>
          <div className="v2-principles">
            <article><span>01</span><h3>Chiarezza radicale.</h3><p>Solo ciò che serve, quando serve. Il tuo lavoro torna al centro.</p></article>
            <article><span>02</span><h3>Intelligenza connessa.</h3><p>Cora, agenti e strumenti. Un'unica esperienza, un filo continuo.</p></article>
            <article><span>03</span><h3>Il tuo ritmo.</h3><p>Dall'intuizione al progetto. Uno spazio che segue il tuo modo di creare.</p></article>
          </div>
        </section>

        <section className="v2-experience" ref={preview} aria-labelledby="v2-experience-title">
          <div className="v2-preview-heading"><div><div className="v2-section-label">03 / UNO SGUARDO AL FUTURO</div><h2 id="v2-experience-title">Dentro la nuova Serveria.</h2></div><Link to="/v2-home" className="v2-concept-tag">ESPLORA LA HOME V2 ↗</Link></div>
          <div className="v2-workspace">
            <aside className="v2-workspace-side">
              <div className="v2-mini-brand">serveria <span>2</span></div>
              <div className="v2-mini-user"><span>AS</span><div>Il tuo spazio<small>Personal workspace</small></div></div>
              <span className="v2-side-label">WORKSPACE</span>
              <div role="tablist" aria-label="Anteprima Versione 2" className="v2-preview-tabs">{concepts.map(item => <Button key={item.id} id={`v2-tab-${item.id}`} role="tab" aria-selected={active === item.id} aria-controls="v2-concept-panel" className={active === item.id ? "is-selected" : ""} onClick={() => setActive(item.id)}><item.icon size={16} />{item.label}</Button>)}</div>
              <div className="v2-side-bottom"><span className="v2-status-dot" /> Cora <span>Al tuo fianco</span></div>
            </aside>
            <div className="v2-workspace-main" role="tabpanel" id="v2-concept-panel" aria-labelledby={`v2-tab-${active}`}>
              <div className="v2-workspace-toolbar"><span><Command size={14} /> Il tuo prossimo progetto</span><span>V.02 / PREVIEW</span></div>
              <div className="v2-conversation" key={active}><span className="v2-cora-mark"><Sparkles size={25} /></span><h3>{concept.title}</h3><p className="v2-sample-prompt">{concept.prompt}</p><div className="v2-sample-answer"><span>CORA <Sparkles size={12} /></span><p>{concept.response}</p></div><div className="v2-sample-items">{concept.items.map(item => <div key={item}><Check size={14} /><span>{item}</span><ArrowUpRight size={13} /></div>)}</div></div>
              <div className="v2-composer-preview" aria-hidden="true"><Plus size={18} /><span>Da dove iniziamo?</span><AudioLines size={18} /><span className="v2-composer-arrow"><ArrowRight size={17} /></span></div>
            </div>
          </div>
          <div className="v2-preview-note"><span>UN'ANTEPRIMA DELLA DIREZIONE, NON IL PUNTO DI ARRIVO.</span><span>PROGETTATA PER EVOLVERE ↗</span></div>
        </section>

        <section className="v2-closing"><span className="v2-section-label">IL MEGLIO È ANCORA DA CREARE.</span><h2>Ci vediamo<br />nel <span>prossimo capitolo.</span></h2><div><span className="v2-kicker"><span className="v2-status-dot" /> COMING SOON</span><Link to="/v2-home" className="v2-back-link"><ArrowLeft size={16} /> Vai alla Home V2</Link></div></section>
      </main>
      <footer className="v2-footer"><span className="v2-wordmark">serveria<span>®</span></span><span>VERSIONE 2 / IN DIVENIRE</span><span>FATTO DI IDEE. COSTRUITO INSIEME.</span></footer>
    </div>
  );
}