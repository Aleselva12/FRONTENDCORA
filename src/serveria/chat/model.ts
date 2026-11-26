import type { UIMessage } from "ai";

export type ChatThread = { id: string; title: string; project: string; agent: string; messages: UIMessage[] };
export const projects = ["Personale", "Serveria V2", "Server domestico", "Magazzino Tele"];
export const chatTools = [
  { id: "library", name: "Libreria", detail: "Documenti e contesto", icon: "folder" },
  { id: "server", name: "Stato del server", detail: "Risorse e programmi", icon: "server" },
  { id: "web", name: "Ricerca web", detail: "Fonti e approfondimenti", icon: "globe" },
  { id: "code", name: "Code workspace", detail: "Codice e prototipi", icon: "code" },
  { id: "automation", name: "Automazioni", detail: "Flussi e compiti", icon: "workflow" },
  { id: "image", name: "Crea immagine", detail: "Idee visive", icon: "image" },
];
export function textOf(message: UIMessage) {
  return message.parts.filter(p => p.type === "text").map(p => p.text).join("\n");
}
export function makeThread(id: string, project = "Personale"): ChatThread {
  return { id, title: "Nuova conversazione", project, agent: "Cora", messages: [] };
}
export function seedThreads(): ChatThread[] {
  return [
    { ...makeThread("serveria-design", "Serveria V2"), title: "Il prossimo capitolo di Serveria", messages: [
      { id: "design-user", role: "user", parts: [{ type: "text", text: "Raccogliamo la direzione della nuova Serveria." }] },
      { id: "design-cora", role: "assistant", parts: [{ type: "text", text: "### Un sistema, il tuo spazio\n\nLa direzione di **Serveria V2** parte da Cora e dal tuo contesto.\n\n- Un centro operativo con agenti e risorse del server.\n- Automazioni visuali, con controllo e approvazioni.\n- Programmi come Immich e Nextcloud, raccolti in un unico spazio.\n\nQuesta conversazione è un **esempio di anteprima**: nessun servizio è collegato." }] },
    ] },
    { ...makeThread("server-overview", "Server domestico"), title: "Risorse e programmi del server", messages: [] },
    { ...makeThread("quick"), title: "Richieste veloci", messages: [] },
  ];
}
export function demoAnswer(text: string, tool: string, agent: string): UIMessage["parts"] {
  const selected = chatTools.find(t => t.id === tool);
  const parts: UIMessage["parts"] = [];
  if (selected) parts.push({ type: "dynamic-tool", toolName: selected.name, toolCallId: `demo-${tool}`, state: "output-available", input: { richiesta: text }, output: { modalità: "Anteprima", esito: "Nessun servizio contattato", strumento: selected.name } });
  parts.push({ type: "text", text: `**${agent} · risposta dimostrativa**\n\nHo raccolto la tua richiesta${selected ? ` con lo strumento **${selected.name}**` : ""}. Possiamo organizzarla in tre passaggi:\n\n1. Definire il risultato desiderato e il contesto.\n2. Scegliere i documenti, gli agenti o i programmi coinvolti.\n3. Verificare il risultato prima di qualsiasi azione.\n\nIn questa anteprima non analizzo file, non accedo al server e non eseguo compiti reali.` });
  return parts;
}