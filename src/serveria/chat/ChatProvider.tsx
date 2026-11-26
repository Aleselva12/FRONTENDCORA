import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { UIMessage, FileUIPart } from "ai";
import { demoAnswer, makeThread, seedThreads, type ChatThread } from "./model";

type Running = { threadId: string; messageId: string } | null;
type ChatContextValue = {
  threads: ChatThread[]; running: Running;
  create: (project?: string) => string;
  ensure: (id: string) => void;
  update: (id: string, changes: Partial<Pick<ChatThread, "title" | "project" | "agent">>) => void;
  remove: (id: string) => void;
  send: (id: string, text: string, files?: FileUIPart[], tool?: string) => void;
  stop: () => void;
};
const ChatContext = createContext<ChatContextValue | null>(null);
export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState(seedThreads);
  const [running, setRunning] = useState<Running>(null);
  const active = useRef<Running>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function ensure(id: string) { setThreads(prev => prev.some(t => t.id === id) ? prev : [...prev, makeThread(id)]); }
  function create(project?: string) { const id = crypto.randomUUID(); setThreads(prev => [makeThread(id, project), ...prev]); return id; }
  function update(id: string, changes: Partial<Pick<ChatThread, "title" | "project" | "agent">>) { setThreads(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t)); }
  function stop() {
    if (timer.current) clearTimeout(timer.current);
    const pending = active.current;
    if (pending) setThreads(prev => prev.map(t => t.id !== pending.threadId ? t : { ...t, messages: t.messages.map(m => m.id === pending.messageId ? { ...m, parts: [{ type: "text", text: "Simulation interrompue.".replace("Simulation interrompue.", "Simulazione interrotta. Nessuna azione eseguita.") }] } : m) }));
    active.current = null; setRunning(null);
  }
  function send(id: string, text: string, files: FileUIPart[] = [], tool = "") {
    if (active.current || (!text.trim() && !files.length)) return;
    const user: UIMessage = { id: crypto.randomUUID(), role: "user", parts: [...files, { type: "text", text: text.trim() || "Allegati" }] };
    const assistantId = crypto.randomUUID();
    const thread = threads.find(t => t.id === id) ?? makeThread(id);
    setThreads(prev => {
      const list = prev.some(t => t.id === id) ? prev : [...prev, thread];
      return list.map(t => t.id === id ? { ...t, title: t.messages.length ? t.title : text.trim().slice(0, 48) || "Allegati", messages: [...t.messages, user, { id: assistantId, role: "assistant", parts: [] }] } : t);
    });
    active.current = { threadId: id, messageId: assistantId }; setRunning(active.current);
    timer.current = setTimeout(() => {
      setThreads(prev => prev.map(t => t.id !== id ? t : { ...t, messages: t.messages.map(m => m.id === assistantId ? { ...m, parts: demoAnswer(text, tool, thread.agent) } : m) }));
      active.current = null; setRunning(null);
    }, 1100);
  }
  return <ChatContext.Provider value={{ threads, running, create, ensure, update, remove: id => setThreads(prev => prev.filter(t => t.id !== id)), send, stop }}>{children}</ChatContext.Provider>;
}
export function useV2Chat() { const context = useContext(ChatContext); if (!context) throw new Error("ChatProvider missing"); return context; }