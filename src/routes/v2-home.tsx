import { createFileRoute } from "@tanstack/react-router";
import V2Home from "@/serveria/components/V2Home";

export const Route = createFileRoute("/v2-home")({
  head: () => ({ meta: [
    { title: "Home V2 · Serveria | Il tuo centro operativo" },
    { name: "description", content: "La nuova Home di Serveria: Cora, agenti, risorse del server e progetti in un unico centro operativo personale. Anteprima di design della Versione 2." },
    { property: "og:title", content: "Serveria Home V2 · Personal command center" },
    { property: "og:description", content: "Il tuo spazio, la tua intelligenza. Esplora la nuova Home di Serveria Versione 2." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: V2Home,
});