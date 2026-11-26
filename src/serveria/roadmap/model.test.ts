import { describe, expect, it } from 'vitest';
import { depthOf, detailsFor, entityExists, historyFor, maturity, nodeById, priorityMeta, relations, relationsFor, sourceCounts, toMarkdown, tree, visibleTree, workPath } from './model';
import baseline from './cora-v2-source';

const stars = tree.filter(n => n.kind === 'star');
const allPlanets = stars.flatMap(n => n.planets);
const allMoons = allPlanets.flatMap(p => p.moons);

describe('Serveria roadmap schema (CORA-V2 canonical source)', () => {
  it('has 6 root groups, 14 root stars, 14 free trunk stars and 18 branch stars', () => {
    expect(tree.filter(n => n.layer === 'root' && n.kind === 'group')).toHaveLength(6);
    expect(tree.filter(n => n.layer === 'root' && n.kind === 'star')).toHaveLength(14);
    expect(tree.filter(n => n.layer === 'trunk')).toHaveLength(14);
    expect(tree.filter(n => n.layer === 'branch' && n.kind === 'group')).toHaveLength(7);
    expect(tree.filter(n => n.layer === 'branch' && n.kind === 'star')).toHaveLength(18);
    expect(stars).toHaveLength(46);
  });
  it('carries 160 planets and 329 moons with unique ids and no dangling parents', () => {
    expect(allPlanets).toHaveLength(160);
    expect(allMoons).toHaveLength(329);
    const ids = [...tree.map(n => n.id), ...allPlanets.map(p => p.id), ...allMoons.map(m => m.id)];
    expect(new Set(ids).size).toBe(ids.length);
    const starIds = new Set(stars.map(n => n.id));
    for (const s of stars) if (s.layer !== 'trunk') expect(s.parent && nodeById(s.parent)).toBeTruthy();
    for (const p of allPlanets) expect(starIds.has(stars.find(s => s.planets.includes(p))?.id ?? '')).toBe(true);
    for (const p of allPlanets) for (const m of p.moons) expect(p.moons).toContain(m);
  });
  it('keeps stable identities: C1 planets C1a–C1e and F1 planets installare/assegnare', () => {
    expect(nodeById('C1')?.planets.map(p => p.id)).toEqual(expect.arrayContaining(['C1a', 'C1b', 'C1c', 'C1d', 'C1e']));
    expect(nodeById('worker')?.planets.map(p => p.id)).toEqual(expect.arrayContaining(['installare', 'assegnare']));
    expect(nodeById('immich')?.code).toBe('D1');
    expect(nodeById('nextcloud')?.code).toBe('D2');
    expect(nodeById('magazzino')?.code).toBe('D3');
    expect(nodeById('worker')?.code).toBe('F1');
  });
  it('keeps implementation status separate from health priority', () => {
    for (const n of tree) expect(n.priority).toBe('unknown');
    expect(new Set(stars.map(n => n.status))).toEqual(new Set(['ready', 'v1', 'placeholder']));
    expect(nodeById('C1')?.planets.find(p => p.id === 'C1d')?.status).toBe('future');
    expect(nodeById('C1')?.planets.find(p => p.id === 'C1e')?.status).toBe('future');
    expect(Object.keys(priorityMeta)).not.toEqual(Object.keys(maturity));
    for (const n of tree) expect(n.position[2]).toBe(depthOf(n.status));
  });
  it('exposes 55 conceptual relations including precise planet/moon endpoints', () => {
    expect(relations).toHaveLength(55);
    for (const r of relations) { expect(entityExists(r.fromId)).toBe(true); expect(entityExists(r.toId)).toBe(true); }
    const c1 = relationsFor('C1').map(x => x.otherId);
    expect(c1).toEqual(expect.arrayContaining(['C3', 'E1', 'T2']));
  });
  it('feeds the inspector with problems/future without inventing history', () => {
    expect(detailsFor('C1').problems.length).toBeGreaterThan(0);
    expect(detailsFor('C1').future.length).toBeGreaterThan(0);
    expect(detailsFor('R3.1').problems).toEqual([]);
    expect(detailsFor('worker').problems.length).toBeGreaterThan(0);
    for (const n of stars) expect(n.details).not.toHaveProperty('history');
    expect(detailsFor('immich').ownerReports.length).toBeGreaterThan(0);
  });
  it('offers the W1 → W2 → W3 path without duplicating stars', () => {
    expect(workPath.map(w => w.code)).toEqual(['W1', 'W2', 'W3']);
    for (const w of workPath) for (const id of w.starIds) expect(nodeById(id)).toBeTruthy();
  });
  it('keeps the trunk when focusing a branch', () => {
    const nodes = visibleTree('C', 'all');
    expect(nodes.filter(n => n.layer === 'trunk')).toHaveLength(14);
    expect(nodes.some(n => n.group === 'programmi')).toBe(false);
  });
  it('exports every star to text', () => {
    const md = toMarkdown();
    for (const n of tree) expect(md).toContain(`${n.code} — ${n.title}`);
  });
});
describe('trunk constellation', () => {
  it('does not chain trunk stars in sequence', () => {
    expect(tree.filter(n => n.layer === 'trunk' && n.parent)).toHaveLength(0);
    expect(nodeById('T6')?.flows).toEqual(['T7']);
  });
  it('keeps approvals planned without chaining them to memory', () => {
    expect(nodeById('T14')?.status).toBe('placeholder');
    expect(nodeById('T14')?.parent).toBeUndefined();
    expect(nodeById('T14')?.flows).toBeUndefined();
    expect(relationsFor('T14').map(r => r.otherId)).toEqual(expect.arrayContaining(['R6.2', 'T2', 'T4']));
  });
});
describe('repository reconciliation', () => {
  it('preserves every original canonical identity', () => {
    const original = baseline as unknown as { nodes: string[][] };
    for (const row of original.nodes) expect(entityExists(row[0] ?? '')).toBe(true);
    expect(sourceCounts.nodes).toBe(550);
  });
  it('records only real attributed commits and keeps unknown health', () => {
    expect(historyFor('C2').map(c => c.sha)).toContain('114830c51c6b7f13aab24a1dd9c07cefa0885081');
    expect(historyFor('T14')).toEqual([]);
    for (const star of stars) expect(star.priority).toBe('unknown');
  });
  it('separates W1 repository completion from live certification', () => {
    expect(workPath[0]?.code).toBe('W1');
    expect(nodeById('T1')?.status).toBe('v1');
    expect(nodeById('T9')?.status).toBe('v1');
    expect(nodeById('nextcloud')?.details.problems).toContain('Restore non collaudato; dati e backup iniziali sullo stesso disco fisico.');
  });
});
