import { describe, expect, it } from "vitest";
import { nodes, views, nodeById, needsApproval } from "./model";

describe("architecture plan", () => {
  it("has three views whose edges and positions reference real nodes", () => {
    expect(views.map(v => v.id)).toEqual(["flow", "cluster", "security"]);
    for (const v of views) {
      for (const id of Object.keys(v.positions)) expect(nodeById(id)).toBeDefined();
      for (const e of v.edges) { expect(v.positions[e.source]).toBeDefined(); expect(v.positions[e.target]).toBeDefined(); }
    }
  });
  it("terminal and external email always require approval", () => {
    expect(needsApproval(nodeById("terminal")!)).toBe(true);
    expect(needsApproval(nodeById("email")!)).toBe(true);
    expect(needsApproval(nodeById("docs")!)).toBe(false);
  });
  it("ids are unique", () => { expect(new Set(nodes.map(n => n.id)).size).toBe(nodes.length); });
});
