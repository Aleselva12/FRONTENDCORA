import { describe, expect, it } from 'vitest';
import { applyAction, filterServices, services } from './model';
describe('services model', () => {
  it('filters by state', () => { expect(filterServices(services, { query: '', group: 'all', state: 'stopped' }).map(s => s.id)).toEqual(['magazzino']); });
  it('stop clears usage', () => { const s = applyAction(services[0]!, 'stop'); expect(s.state).toBe('stopped'); expect(s.cpu).toBe(0); });
  it('ids unique', () => { expect(new Set(services.map(s => s.id)).size).toBe(services.length); });
});
