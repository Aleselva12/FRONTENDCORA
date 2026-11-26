import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import V2ProgramSettings from "@/serveria/components/V2ProgramSettings";
import { findProgram } from "@/serveria/programs/data";

export const Route = createFileRoute("/v2-programs/$programId")({
  loader: ({ params }) => { const program = findProgram(params.programId); if (!program) throw notFound(); return { program }; },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.program.name} · Impostazioni · Serveria V2` },
    { name: "description", content: `Stato, risorse, aggiornamenti e impostazioni di ${loaderData.program.name} sul server Serveria.` },
    { property: "og:title", content: `Serveria V2 · ${loaderData.program.name}` },
    { property: "og:description", content: loaderData.program.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] : [{ title: "Programma non trovato · Serveria V2" }, { name: "robots", content: "noindex" }] }),
  component: Page,
  notFoundComponent: () => <div className="ops-page"><main className="arc-main"><h1>Programma non trovato</h1><Link to="/v2-programs">Torna ai programmi</Link></main></div>,
});

function Page() {
  const { program } = Route.useLoaderData();
  return <V2ProgramSettings key={program.id} program={program} />;
}
