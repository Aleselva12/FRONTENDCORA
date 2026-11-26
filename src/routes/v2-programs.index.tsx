import { createFileRoute } from "@tanstack/react-router";
import V2Programs from "@/serveria/components/V2Programs";

export const Route = createFileRoute("/v2-programs/")({
  head: () => ({ meta: [
    { title: "Programmi V2 · Serveria | App installate sul server" },
    { name: "description", content: "Elenco dei programmi installati sul server Serveria con stato di salute, aggiornamenti e riepiloghi." },
    { property: "og:title", content: "Serveria V2 · Programmi" },
    { property: "og:description", content: "Tutti i programmi del tuo server, in un unico elenco." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: V2Programs,
});
