import { createFileRoute } from "@tanstack/react-router";
import V2Chat from "@/serveria/components/V2Chat";
export const Route = createFileRoute("/v2-chat/")({
  head: () => ({ meta: [
    { title: "Conversazioni V2 · Cora | Serveria" },
    { name: "description", content: "Conversazioni con Cora, progetti e strumenti nel nuovo spazio Serveria V2. Anteprima grafica senza servizi collegati." },
    { property: "og:title", content: "Conversazioni V2 · Cora | Serveria" },
    { property: "og:description", content: "Il tuo dialogo con Cora: idee, contesto e compiti in Serveria V2." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: () => <V2Chat />,
});