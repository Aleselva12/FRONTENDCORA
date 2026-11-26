import { createFileRoute } from "@tanstack/react-router";
import V2Architecture from "@/serveria/components/V2Architecture";

export const Route = createFileRoute("/v2-architecture")({
  head: () => ({ meta: [
    { title: "Architettura V2 · Serveria | Mappa del sistema" },
    { name: "description", content: "La nuova Architettura di Serveria V2: mappa interattiva di Cora, agenti, componenti e percorsi diretti." },
    { property: "og:title", content: "Serveria V2 · Architettura" },
    { property: "og:description", content: "Esplora la mappa del sistema di Serveria Versione 2." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: V2Architecture,
});
