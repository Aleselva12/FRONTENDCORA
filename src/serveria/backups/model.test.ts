import { describe, expect, it } from 'vitest';
import { backupSets, recoveryPreview } from './model';
describe('Backup design preview', () => {
  it('never executes a restore or overwrites the source', () => {
    const set = backupSets[0];
    if (!set || !set.snapshots[0]) throw new Error('Missing demo backup');
    const result = recoveryPreview(set, set.snapshots[0], 'all');
    expect(result.executed).toBe(false);
    expect(result.overwritesOriginal).toBe(false);
    expect(result.files).toEqual(set.contents);
  });
  it('restricts single-file recovery to the selected file', () => {
    const set = backupSets[0];
    if (!set || !set.snapshots[0]) throw new Error('Missing demo backup');
    expect(recoveryPreview(set, set.snapshots[0], 'memoria-simbolica.sql').files).toEqual(['memoria-simbolica.sql']);
    expect(recoveryPreview(set, set.snapshots[0], 'missing.sql').files).toEqual([]);
  });
});