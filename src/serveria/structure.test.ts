import { describe, expect, it } from 'vitest';
import { sections, sectionForPath, topLevel } from './structure';
describe('struttura pagine', () => {
  it('Sistema contiene aggiornamenti, macchine e attività tecnica come sottopagine', () => {
    const labels = sections.find(s => s.id === 'system')!.tabs.map(t => t.label);
    expect(labels).toEqual(expect.arrayContaining(['Salute e macchine', 'Aggiornamenti', 'Attività tecnica']));
  });
  it('le sottopagine non hanno icona sul cerchio', () => {
    expect(topLevel).not.toContain('/v2-updates');
    expect(topLevel).not.toContain('/v2-models');
    expect(topLevel).toHaveLength(10);
  });
  it('ogni sottopagina appartiene a una sola sezione', () => {
    const all = sections.flatMap(s => s.tabs.map(t => t.to));
    expect(new Set(all).size).toBe(all.length);
    expect(sectionForPath('/v2-programs/immich')?.id).toBe('architecture');
  });
});
