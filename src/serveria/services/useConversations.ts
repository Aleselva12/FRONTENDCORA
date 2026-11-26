import { useState } from "react";
import type { Message } from "../types/contracts";
export type Chat = { id: string; threadId: string; title: string; messages: (Message & { failed?: boolean })[]; persisted: boolean };
function makeChat(id = "draft"): Chat { return { id, threadId: id, title: "Nuova chat", messages: [], persisted: false }; }
/** Chat state belongs only to this design preview, never to remote services. */
export function useConversations(_connected: boolean, _sending: boolean) {
 const [chats, setChats] = useState<Chat[]>(() => [makeChat()]);
 const [activeChat, setActiveChat] = useState("draft");
 const currentChat = chats.find(chat => chat.id === activeChat) ?? chats[0] ?? makeChat();
 function newChat() { const chat = makeChat(crypto.randomUUID()); setChats(previous => [chat, ...previous]); setActiveChat(chat.id); }
 return { chats, setChats, currentChat, selectChat: setActiveChat, newChat, refreshHistory: async () => {}, historyLoading: false, historyError: "", messagesLoading: false, messagesError: "" };
}
