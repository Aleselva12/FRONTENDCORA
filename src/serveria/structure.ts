/** Page structure mirrored from the repository (frontend/src/App.tsx, systemTabs.ts, settingsTabs.ts). */
export type SectionLink = { to: string; label: string };
export type Section = { id: string; title: string; tabs: SectionLink[] };

export const sections: Section[] = [
  { id: 'architecture', title: 'Architettura', tabs: [
    { to: '/v2-architecture', label: 'Architettura' }, { to: '/v2-automations', label: 'Automazioni e tool' },
    { to: '/v2-programs', label: 'Programmi' }, { to: '/v2-activity', label: 'Attività IA' } ] },
  { id: 'code', title: 'Programma', tabs: [
    { to: '/v2-programmer', label: 'Programmatore' }, { to: '/v2-programmer-next', label: 'Programmatore W3' } ] },
  { id: 'files', title: 'File', tabs: [ { to: '/v2-files', label: 'File' }, { to: '/v2-backups', label: 'Backup' } ] },
  { id: 'system', title: 'Sistema', tabs: [
    { to: '/v2-monitor', label: 'Salute e macchine' }, { to: '/v2-updates', label: 'Aggiornamenti' },
    { to: '/v2-events', label: 'Attività tecnica' }, { to: '/v2-services', label: 'Servizi' },
    { to: '/v2-network', label: 'Rete' }, { to: '/v2-terminal', label: 'Terminale' } ] },
  { id: 'settings', title: 'Impostazioni', tabs: [
    { to: '/v2-settings', label: 'Generale' }, { to: '/v2-models', label: 'Modelli IA' },
    { to: '/v2-memory', label: 'Memoria' }, { to: '/v2-alignment', label: 'Corrispondenze' } ] },
];

/** Top-level pages: only these get an icon on the Home ring. */
export const topLevel = ['/v2-chat', '/v2-photos', '/v2-programmer', '/v2-calendar', '/v2-mail', '/v2-files', '/v2-audio', '/v2-notifications', '/v2-monitor', '/v2-roadmap'] as const;

export function sectionForPath(path: string): Section | undefined {
  return sections.find(s => s.tabs.some(t => path === t.to || path.startsWith(t.to + '/')));
}
