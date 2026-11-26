import { createFileRoute } from "@tanstack/react-router";
import V2Chat from "@/serveria/components/V2Chat";
export const Route = createFileRoute("/v2-chat/$threadId")({
  head: () => ({ meta: [
    { title: "Dialogo con Cora · Serveria V2" },
    { name: "description", content: "Una conversazione di Serveria V2 con messaggi, contesto del progetto e strumenti dimostrativi." },
    { property: "og:title", content: "Dialogo con Cora · Serveria V2" },
    { property: "og:description", content: "Lo spazio di lavoro di una conversazione con Cora in Serveria V2." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ThreadPage,
});
function ThreadPage() { const { threadId } = Route.useParams(); return <V2Chat key={threadId} threadId={threadId} />; }