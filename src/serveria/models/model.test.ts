import { describe, expect, it } from 'vitest';
import { memoryEstimate, previewLoad } from './model';
describe('Local model preview', () => {
  it('does not execute model calls when loading a demo model', () => {
    expect(previewLoad([], 'qwen-chat').executed).toBe(false);
  });
  it('counts a loaded model only once', () => {
    expect(memoryEstimate(previewLoad(['qwen-chat'], 'qwen-chat').ids)).toBe(5.2);
  });
  it('keeps the current selection when the demo memory budget is exceeded', () => {
    const result = previewLoad(['qwen-chat'], 'deepseek');
    expect(result.fits).toBe(false);
    expect(result.ids).toEqual(['qwen-chat']);
  });
});