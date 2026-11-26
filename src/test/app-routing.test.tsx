import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches V2 conversations and dedicated thread pages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/v2-chat").at(-1)?.routeId).toBe("/v2-chat/");
    expect(router.matchRoutes("/v2-chat/quick").at(-1)?.routeId).toBe("/v2-chat/$threadId");
  });
  it("matches the standalone V2 Automations page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/v2-automations").at(-1)?.routeId).toBe("/v2-automations");
  });
  it("matches the standalone V2 Home page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/v2-home").at(-1)?.routeId).toBe("/v2-home");
  });
  it("matches the standalone V2 Architecture page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/v2-architecture").at(-1)?.routeId).toBe("/v2-architecture");
  });
  it("matches the standalone Coming Soon page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/coming-soon").at(-1)?.routeId).toBe("/coming-soon");
  });

  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
