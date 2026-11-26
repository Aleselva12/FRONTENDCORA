import { describe, expect, it } from 'vitest';
import { explorerRuns, activitySummary, filterActivitySteps, graphSteps, runIssues, stepsAt } from './model';
describe('Activity Explorer design transport', () => {
  it('keeps unique identities and valid explicit parent relationships', () => {
    const ids = explorerRuns.flatMap(r => r.steps.map(s => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const run of explorerRuns) for (const s of run.steps) if (s.parent) expect(run.steps.some(p => p.id === s.parent)).toBe(true);
  });
  it('does not draw uncorrelated notifications as network calls', () => {
    const run = explorerRuns[0]; if (!run) throw new Error('Missing example');
    expect(graphSteps(run.steps).map(s => s.id)).not.toContain('a-event');
    expect(runIssues(run).map(s => s.id)).toEqual(['a-drive', 'a-event']);
  });
  it('keeps filtered tool nodes without inventing parent edges', () => {
    const run = explorerRuns[0]; if (!run) throw new Error('Missing example');
    expect(graphSteps(filterActivitySteps(run.steps, 'tool', false)).map(s => s.id)).toEqual(['a-memory', 'a-drive']);
    expect(filterActivitySteps(run.steps, 'all', true).map(s => s.id)).toEqual(['a-drive', 'a-event']);
  });
  it('does not fabricate history or missing notification correlation', () => {
    const run = explorerRuns[0]; if (!run) throw new Error('Missing example');
    expect(activitySummary(run).history).toEqual([]);
    expect(activitySummary(run).uncorrelated.map(s => s.id)).toEqual(['a-event']);
    expect(activitySummary(run).duration).toBe(5500);
  });
  it('reveals only the selected playback prefix', () => {
    const run = explorerRuns[0]; if (!run) throw new Error('Missing example');
    expect(stepsAt(run, 0).map(s => s.id)).toEqual(['a-cora']);
    expect(stepsAt(run, null)).toHaveLength(7);
    expect(stepsAt(run, 3).map(s => s.id)).toEqual(['a-cora', 'a-context', 'a-whisper', 'a-memory']);
  });
  it('distinguishes worker connectivity from actual assignment', () => {
    const run = explorerRuns.find(r => r.id === 'DEMO-W01'); if (!run) throw new Error('Missing worker');
    expect(run.steps.find(s => s.id === 'w-connect')?.state).toBe('completed');
    expect(run.steps.find(s => s.id === 'w-assign')?.state).toBe('waiting');
  });
});