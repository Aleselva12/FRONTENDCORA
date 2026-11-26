import { demoData } from "./demo-data";
/** Design-only transport: never sends a request to a backend. */
export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
 const url = new URL(String(input), "https://demo.invalid");
 const path = url.pathname.replace(/^\/backend/, "");
 const body = typeof init.body === "string" ? JSON.parse(init.body) : {};
 const data = demoData(path, init.method || "GET", body, url.searchParams);
 return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}
