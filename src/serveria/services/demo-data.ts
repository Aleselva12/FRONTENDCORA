const now = "2026-10-12T14:14:00Z";
const capabilities = [{ id: "consultazione", description: "Consultazione dei documenti" }];
const names = [["react_ui", "Interfaccia", "interface"], ["fastapi_backend", "API · FastAPI", "interface"], ["supervisor", "Cora · Agente centrale", "agent"], ["structure_agent", "Struttura", "agent"], ["local_research_agent", "Documenti", "agent"], ["audio_agent", "Audio", "agent"], ["email_quotes_agent", "Mail e preventivi", "agent"], ["programmer_agent", "Programmatore", "agent"]];
const nodes = names.map(([id, name, kind]) => ({ id, name, kind, available: true, module_available: true, dependency_status: {}, description: name, capabilities, model: kind === "agent" ? "qwen3:8b" : null }));
let context = { id: 1, content: "", version: 1, updated_at: now, metadata: {} };
const events: Record<string, unknown>[] = [];
let activeModel = "qwen3:8b";
export function demoData(path: string, method: string, body: Record<string, unknown>, query: URLSearchParams): unknown {
  if (path === "/health") return { status: "ok", ollama_online: true, model: activeModel, agents: names.slice(2).map(n => n[0]), memory: { total: 0, by_type: {}, available: true } };
  if (path === "/capabilities") return { project: "Cora", component_count: nodes.length, components: nodes };
  if (path.endsWith("/server/telemetry")) return { sampledAt: now, cpu: { label: "CPU", percent: 24, detail: "Dati dimostrativi" }, ram: { label: "RAM", percent: 42, detail: "Dati dimostrativi" }, gpu: { label: "GPU", percent: 12, detail: "Dati dimostrativi" }, disks: [{ id: "disk", label: "Disco principale", usedBytes: 240 * 1024 ** 3, totalBytes: 1024 ** 4 }], network: { receiveBitsPerSecond: 2400000, transmitBitsPerSecond: 800000, interfaceName: "Dati dimostrativi" }, power: { kind: "mains", detail: "Dati dimostrativi" }, cpuHistory: Array.from({ length: 24 }, (_, i) => ({ at: new Date(Date.parse(now) - (24 - i) * 5000).toISOString(), percent: 15 + ((i * 17) % 30) })) };
  if (path.endsWith("/system/status")) return { checkedAt: now, services: ["Cora", "Ollama", "Memoria"].map(label => ({ id: label, label, status: "ready", detail: "Dati dimostrativi", checkedAt: now })) };
  if (path.endsWith("/architecture/overview")) return { version: "1", framework: "Cora", nodes, edges: [{ source: "react_ui", target: "fastapi_backend", label: "Richiesta", kind: "request" }, { source: "fastapi_backend", target: "supervisor", label: "Chat", kind: "request" }, ...nodes.slice(3).map(n => ({ source: "supervisor", target: n.id, label: "Delega", kind: "delegation" }))], components: [], direct_paths: [], automations: [] };
  if (path.endsWith("/architecture/graph")) return { version: "1", graphs: [], delegations: [], errors: [] };
  if (path === "/memory/context") { if (method === "PUT") context = { ...context, content: String(body["content"] ?? ""), version: context.version + 1 }; return context; }
  if (path.startsWith("/memory")) return [];
  if (path === "/conversations" || path.includes("/messages")) return [];
  if (path.endsWith("/chat/tools")) return { tools: [] };
  if (path === "/tools/inventory") return { entries: [], errors: [], scope: "Anteprima grafica" };
  if (path.includes("/drafts")) return [];
  if (path === "/runtime/models" || path === "/runtime/model") { if (body["model"]) activeModel = String(body["model"]); return { active: activeModel, models: ["qwen3:8b", "llama3.2:3b"].map(name => ({ name, size: 5 * 1024 ** 3, running: name === activeModel })) }; }
  if (path.endsWith("/calendar/events") && method === "GET") return events;
  if (path.endsWith("/calendar/events") && method === "POST") { const event = { ...body, id: crypto.randomUUID(), version: 1, created_by: "Alessandro", updated_by: "Alessandro", created_at: now, updated_at: now, deleted_at: null }; events.push(event); return event; }
  if (path.includes("/calendar/events/")) { const id = path.split("/")[6]; const event = events.find(e => e["id"] === id); if (event) { if (method === "PATCH") Object.assign(event, body); if (method === "DELETE") event["deleted_at"] = now; if (path.endsWith("/restore")) event["deleted_at"] = null; return event; } return []; }
  if (path.endsWith("/proposals") || path.endsWith("/history")) return [];
  if (path.endsWith("/files/roots")) return { roots: [{ id: "demo", label: "Archivio", path: ".", available: true, writable: false, storage: { usedBytes: 0, totalBytes: 1024 ** 4, freeBytes: 1024 ** 4 } }] };
  if (path.endsWith("/files/children") || path.endsWith("/files/search")) return { rootId: query.get("root_id"), path: query.get("path"), parentPath: null, writable: false, total: 0, items: [] };
  if (path.endsWith("/trash") || path.endsWith("/shares") || path === "/api/v1/media/audio") return { items: [] };
  if (path.endsWith("/programmer/status")) return { model: "qwen3:8b", skills: {}, checks: { docker_cli: false } };
  if (path.endsWith("/releases/status")) return { available: false, reason: "Anteprima grafica", jobs: [] };
  if (path.endsWith("/programmer/workspaces")) return [];
  if (path === "/api/v1/runtime") return { runs: [], pool: {}, accepting_runs: true };
  if (path.endsWith("/approvals")) return { generic: [], calendar: [], history: [] };
  if (path.endsWith("/permissions")) return { rules: [] };
  if (path.includes("/runs") || path.includes("/operations")) return [];
  return { items: [], events: [], components: [], checks: [], files: [], tools: [] };
}
