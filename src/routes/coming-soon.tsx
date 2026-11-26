import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/serveria/components/ComingSoon";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Coming Soon · Serveria 2.0" },
      { name: "description", content: "Serveria Versione 2. Un nuovo capitolo per il tuo workspace, insieme a Cora. Scopri la nuova direzione." },
      { property: "og:title", content: "Serveria 2.0 · Il prossimo capitolo" },
      { property: "og:description", content: "Più spazio alle idee. Una nuova forma di intelligenza. Scopri la direzione di Serveria Versione 2." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" }],
  }),
  component: ComingSoon,
});