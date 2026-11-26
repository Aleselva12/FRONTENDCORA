import { describe, expect, it } from 'vitest';
import { makeFlow, simulationOrder } from './model';
describe('Local workflow simulation', () => {
  it('visits all connected branches of the briefing', () => {
    const flow = makeFlow(0); expect(simulationOrder(flow.nodes, flow.edges)).toEqual(['step-0','step-1','step-2','step-3','step-4','step-5','step-6']);
  });
  it('excludes disconnected steps', () => {
    const flow = makeFlow(1); expect(simulationOrder(flow.nodes, flow.edges.filter(e => e.source !== 'step-1'))).toEqual(['step-0','step-1']);
  });
  it('terminates when a user connects a cycle', () => {
    const flow = makeFlow(1); expect(simulationOrder(flow.nodes, [...flow.edges, { id: 'cycle', source: 'step-4', target: 'step-0' }])).toHaveLength(5);
  });
});
