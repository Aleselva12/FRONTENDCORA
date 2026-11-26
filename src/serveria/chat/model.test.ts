import { describe, expect, it } from "vitest";
import { demoAnswer, makeThread, seedThreads } from "./model";
describe("V2 session conversations", () => {
  it("keeps separate messages for each conversation", () => {
    const first = makeThread("first"); const second = makeThread("second");
    first.messages.push({ id: "one", role: "user", parts: [{ type: "text", text: "Primo progetto" }] });
    expect(second.messages).toHaveLength(0);
    expect(first.id).toBe("first"); expect(second.id).toBe("second");
  });
  it("starts a fresh session without retaining previous messages", () => {
    const session = seedThreads();
    session.find(t => t.id === "quick")?.messages.push({ id: "quick-message", role: "user", parts: [{ type: "text", text: "Compito veloce" }] });
    expect(seedThreads().find(t => t.id === "quick")?.messages).toHaveLength(0);
  });
  it("marks tool results as simulations without contacting services", () => {
    const part = demoAnswer("Stato server", "server", "Cora")[0];
    expect(part?.type).toBe("dynamic-tool");
    if (part?.type !== "dynamic-tool") throw new Error("Missing tool");
    expect(part.output).toMatchObject({ modalità: "Anteprima", esito: "Nessun servizio contattato" });
  });
});