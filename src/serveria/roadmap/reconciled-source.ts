import baseline from './cora-v2-source';
import snapshot from './repository-snapshot.json';
import review from './repository-review.json';

type Row = [string, string, string, string, string, string, string];
type Observation = { text: string; type: string; commit: string | null; observedAt: string | null };
type Detail = { id: string; problems: string[]; future: string[]; ownerReports: Observation[]; roadmapRefs: string[]; trunkLinks: string[] };
export const repositoryReview = review;
export const historyFor = (id: string) => review.updates.find(u => u.id === id)?.history ?? [];
const original = baseline as unknown as { nodes: Row[]; starDetails: Detail[] };
const oldDetails = new Map(original.starDetails.map(d => [d.id, d]));
const rows: Row[] = snapshot.nodes.map(n => {
  const observations = 'observations' in n ? n.observations : [];
  const issues = snapshot.v3.issues.filter(i => i.ownerNodeId === n.id);
  const note = [ 'note' in n ? n.note : '', ...observations.filter(o => o.type !== 'owner_report').map(o => `${'observedAt' in o ? o.observedAt ?? '' : ''} · ${o.type}: ${o.text}`), ...issues.map(i => `Problema documentato (${i.kind}): ${i.title}`) ].filter(Boolean).join('\n');
  return [n.id, 'parent' in n ? n.parent : '', n.title, 'status' in n ? n.status : 'partial', 'unknown', 'code' in n ? n.code : '', note];
});
const unique = (values: string[]) => [...new Set(values)];
const starDetails: Detail[] = snapshot.nodes.filter(n => n.classification === 'star').map(n => {
  const old = oldDetails.get(n.id);
  const update = review.updates.find(u => u.id === n.id);
  const timeline = 'timeline' in n ? n.timeline : undefined;
  const observations = 'observations' in n ? n.observations : [];
  const row = rows.find(r => r[0] === n.id);
  if (row) row[6] = update?.present ?? timeline?.present.statement ?? row[6];
  // Old notes remain in the baseline and repository snapshot, not as contradictory current claims.
  const snapshotProblems = 'problems' in n && Array.isArray(n.problems) ? n.problems.filter((p): p is string => typeof p === 'string') : undefined;
  const problems = update?.problems ?? snapshotProblems ?? old?.problems ?? [];
  return {
    id: n.id, problems: unique(problems),
    future: unique([...(timeline?.future ?? old?.future ?? []), ...(update?.future ?? [])]),
    ownerReports: observations.filter(o => o.type === 'owner_report').map(o => ({ text: o.text, type: o.type, commit: 'commit' in o ? o.commit : null, observedAt: 'observedAt' in o ? o.observedAt : null })),
    roadmapRefs: unique([...(('roadmapRefs' in n ? n.roadmapRefs : undefined) ?? old?.roadmapRefs ?? []), ...(update?.refs ?? [])]),
    trunkLinks: ('trunkLinks' in n ? n.trunkLinks : undefined) ?? old?.trunkLinks ?? [],
  };
});
for (const update of review.updates) for (const planet of update.planets) {
  rows.push([planet.id, update.id, planet.name, 'partial', 'unknown', '', planet.note]);
  for (const moon of planet.moons) rows.push([moon.id, planet.id, moon.name, 'partial', 'unknown', '', '']);
}
export const sourceCounts = { stars: starDetails.length, planets: snapshot.nodes.filter(n => n.classification === 'planet').length + review.updates.flatMap(u => u.planets).length, moons: snapshot.nodes.filter(n => n.classification === 'moon').length + review.updates.flatMap(u => u.planets.flatMap(p => p.moons)).length, nodes: rows.length };
export default { version: `CORA · main ${review.revision.slice(0, 8)} · ${review.inspectedAt}`, nodes: rows, starDetails, relations: snapshot.relations.map(r => [r.from, r.to, r.kind, r.note]) };