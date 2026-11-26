import { describe, expect, it } from 'vitest';
import { auditEvents, operationRuns, filterEvents, filterRuns, runBlocker, type EventFilter, type RunFilter } from './model';
import { explorerRuns } from '../activity/model';
const base: EventFilter = { query: '', severity: 'all', kind: 'all', machine: 'all', trace: null };
const runBase: RunFilter = { query: '', kind: 'all', machine: 'all', state: 'all', trigger: 'all', trace: null };
describe('Operational event classification', () => {
  it('keeps deterministic test steps and blocked roadmap refresh together', () => {
    const run = operationRuns.find(r => r.id === 'OPS-TEST-01');
    if (!run) throw new Error('Missing test run');
    expect(run.trigger).toBe('manual');
    expect(runBlocker(run)?.id).toBe('test-tree');
    expect(run.steps.find(s => s.id === 'test-refresh')?.state).toBe('skipped');
    expect(filterEvents(auditEvents, { ...base, trace: run.id })).toHaveLength(5);
  });
  it('does not mix AI reasoning into system events', () => {
    expect(auditEvents.some(e => String(e.kind) === 'decision')).toBe(false);
    expect(auditEvents.every(e => JSON.parse(e.raw).domain === 'system')).toBe(true);
    expect(explorerRuns.every(r => r.domain === 'ai')).toBe(true);
  });
  it('preserves unique IDs, valid parents and exactly one event per step', () => {
    expect(new Set(auditEvents.map(e => e.id)).size).toBe(auditEvents.length);
    for (const r of operationRuns) for (const s of r.steps) {
      if (s.parent) expect(r.steps.some(p => p.id === s.parent)).toBe(true);
      expect(auditEvents.filter(e => e.runId === r.id && e.stepId === s.id)).toHaveLength(1);
    }
    expect(auditEvents.every(e => JSON.parse(e.raw).demo)).toBe(true);
  });
  it('links mixed runs reciprocally without inventing AI runs for manual tests', () => {
    const op = operationRuns.find(r => r.id === 'OPS-WORKER-01');
    expect(op?.activityId).toBe('DEMO-W01');
    expect(explorerRuns.find(r => r.id === op?.activityId)?.operationId).toBe(op?.id);
    expect(operationRuns.find(r => r.id === 'OPS-TEST-01')?.activityId).toBeUndefined();
  });
  it('filters operational runs by trigger, state, machine and step contents', () => {
    expect(filterRuns(operationRuns, { ...runBase, trigger: 'manual', state: 'failed', query: 'metadati' }).map(r => r.id)).toEqual(['OPS-TEST-01']);
    expect(filterRuns(operationRuns, { ...runBase, machine: 'NAS' }).map(r => r.id)).toEqual(['OPS-BACKUP-01']);
    expect(filterEvents(auditEvents, { ...base, severity: 'error', kind: 'pipeline' }).map(e => e.stepId)).toEqual(['test-tree']);
  });
  it('keeps uncorrelated evidence explicitly outside any run', () => {
    const orphan = auditEvents.find(e => e.id === 'EVT-unlinked');
    expect(orphan?.runId).toBeUndefined();
    expect(orphan?.trace).toBe('');
  });
});
