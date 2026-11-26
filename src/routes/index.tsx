import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/v2-home" }); },
  head: () => ({ meta: [{ title: "Serveria V2 · Cora" }, { name: "description", content: "Serveria V2, il nuovo frontend di Cora." }, { property: "og:title", content: "Serveria V2 · Cora" }, { property: "og:description", content: "Il nuovo frontend di Cora." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
});
