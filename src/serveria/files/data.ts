// Illustrative, in-memory file tree. No real server, NAS or Drive is contacted.
export type SourceId = 'drive' | 'server' | 'nas';
export type FileKind = 'folder' | 'doc' | 'sheet' | 'pdf' | 'image' | 'video' | 'audio' | 'code' | 'archive';
export interface FsItem { id: string; name: string; kind: FileKind; size?: string; modified: string; owner?: string; starred?: boolean; children?: FsItem[] }

const f = (id: string, name: string, children: FsItem[], modified = '2 nov 2026'): FsItem => ({ id, name, kind: 'folder', modified, children });
const x = (id: string, name: string, kind: FileKind, size: string, modified: string, starred = false): FsItem => ({ id, name, kind, size, modified, starred });

export const sources: Record<SourceId, { label: string; caption: string; used: number; total: number; root: FsItem }> = {
  drive: { label: 'Il mio Drive', caption: 'Libreria personale', used: 71.9, total: 100, root: f('drive', 'Il mio Drive', [
    f('d-mag', 'Magazzino Tele', [x('d-mag-1', '0001 Magazzino tele.xlsx', 'sheet', '412 KB', 'oggi'), x('d-mag-2', 'Inventario ottobre.pdf', 'pdf', '1,2 MB', '31 ott')]),
    f('d-cam', 'Camion', [x('d-cam-1', 'Manutenzione 2026.doc', 'doc', '88 KB', '12 ott')]),
    f('d-app', 'Appunti vocali', [x('d-app-1', 'Riunione fornitori.md', 'doc', '6 KB', 'ieri', true), x('d-app-2', 'Idee Serveria V2.md', 'doc', '9 KB', 'oggi')]),
    f('d-foto', 'Foto', [x('d-foto-1', 'IMG_3375.MOV', 'video', '214 MB', '28 ott'), x('d-foto-2', 'Japan Tour.jpg', 'image', '4,8 MB', '3 set')]),
    x('d-1', 'Energia immessa · ottobre.csv', 'sheet', '64 KB', 'oggi'),
    x('d-2', 'Delibera giunta comunale.pdf', 'pdf', '2,1 MB', 'ieri', true),
    x('d-3', 'Piano costi 2027.xlsx', 'sheet', '220 KB', '30 ott'),
    x('d-4', 'Fotovoltaico 2023.xlsx', 'sheet', '310 KB', '22 ott'),
    x('d-5', 'Japp appunti Ale.doc', 'doc', '41 KB', '19 ott'),
    x('d-6', 'Nota vocale 02-11.m4a', 'audio', '3,4 MB', '2 nov'),
  ]) },
  server: { label: 'Server', caption: 'serveria-01 · /srv', used: 412, total: 1000, root: f('server', '/srv', [
    f('s-apps', 'apps', [f('s-immich', 'immich', [x('s-im-1', 'docker-compose.yml', 'code', '3 KB', '1 nov')]), f('s-next', 'nextcloud', [x('s-nx-1', 'config.php', 'code', '5 KB', '27 ott')])]),
    f('s-logs', 'logs', [x('s-log-1', 'serveria-runtime.log', 'code', '18 MB', 'oggi'), x('s-log-2', 'backup-nightly.log', 'code', '2 MB', 'oggi')]),
    f('s-models', 'models', [x('s-mod-1', 'whisper-large.bin', 'archive', '2,9 GB', '14 ott')]),
    x('s-1', 'README.md', 'doc', '4 KB', '10 ott'),
  ]) },
  nas: { label: 'NAS', caption: 'nas-casa · RAID 1', used: 2.6, total: 8, root: f('nas', 'nas-casa', [
    f('n-backup', 'Backup', [x('n-b-1', 'serveria-2026-11-02.tar.gz', 'archive', '38 GB', 'oggi'), x('n-b-2', 'serveria-2026-11-01.tar.gz', 'archive', '38 GB', 'ieri')]),
    f('n-media', 'Media', [f('n-film', 'Film', []), x('n-m-1', 'Concerto.mp4', 'video', '1,4 GB', 'ago')]),
    f('n-audio', 'Registrazioni', [x('n-a-1', 'Cantiere via Roma.wav', 'audio', '48 MB', '1 nov'), x('n-a-2', 'Chiamata cliente.m4a', 'audio', '6 MB', '29 ott')]),
    x('n-1', 'Documenti scansionati.zip', 'archive', '640 MB', 'set'),
  ]) },
};

export const units: Record<SourceId, string> = { drive: 'GB', server: 'GB', nas: 'TB' };

export function findPath(root: FsItem, id: string, trail: FsItem[] = []): FsItem[] | null {
  const next = [...trail, root];
  if (root.id === id) return next;
  for (const c of root.children ?? []) { const r = findPath(c, id, next); if (r) return r; }
  return null;
}

export function kindFromName(name: string): FileKind {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['mp3','wav','m4a','ogg','flac','webm'].includes(ext)) return 'audio';
  if (['png','jpg','jpeg','gif','webp','heic'].includes(ext)) return 'image';
  if (['mp4','mov','mkv'].includes(ext)) return 'video';
  if (['csv','xlsx','xls'].includes(ext)) return 'sheet';
  if (ext === 'pdf') return 'pdf';
  if (['zip','gz','tar','bin'].includes(ext)) return 'archive';
  if (['js','ts','tsx','json','yml','yaml','php','log','py'].includes(ext)) return 'code';
  return 'doc';
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export interface AudioNote { id: string; title: string; date: string; duration: number; source: string; status: 'pronto' | 'in trascrizione' | 'classificato'; category: string; tags: string[]; destination: string; segments: { t: number; speaker: string; text: string }[] }

export const audioNotes: AudioNote[] = [
  { id: 'a1', title: 'Riunione fornitori', date: 'Oggi · 09:42', duration: 412, source: 'Drive / Appunti vocali', status: 'classificato', category: 'Lavoro · Fornitori', tags: ['ordini', 'tele', 'scadenze'], destination: 'Drive › Appunti vocali › Riunione fornitori.md', segments: [
    { t: 0, speaker: 'Alessandro', text: 'Partiamo dal riordino delle tele: il magazzino segna meno di venti rotoli per il modello lino naturale.' },
    { t: 38, speaker: 'Fornitore', text: 'Possiamo consegnare entro dieci giorni se confermate l’ordine questa settimana.' },
    { t: 81, speaker: 'Alessandro', text: 'Va bene, confermiamo cinquanta rotoli. Mandami il preventivo aggiornato entro venerdì.' },
    { t: 140, speaker: 'Fornitore', text: 'Perfetto, aggiungo anche lo sconto del cinque per cento sul trasporto.' },
  ] },
  { id: 'a2', title: 'Idee Serveria V2', date: 'Ieri · 22:15', duration: 268, source: 'Registrazione rapida', status: 'pronto', category: 'Progetto · Serveria', tags: ['design', 'roadmap'], destination: 'Database › appunti_progetto', segments: [
    { t: 0, speaker: 'Alessandro', text: 'Nota per la pagina file: deve sembrare Drive ma con lo stile scuro della home.' },
    { t: 46, speaker: 'Alessandro', text: 'Gli audio vanno trascritti e poi classificati automaticamente negli appunti giusti.' },
    { t: 102, speaker: 'Alessandro', text: 'Mi serve anche poter chiedere modifiche alla trascrizione, tipo riassumi o correggi i nomi.' },
  ] },
  { id: 'a3', title: 'Cantiere via Roma', date: '1 nov · 16:03', duration: 731, source: 'NAS / Registrazioni', status: 'classificato', category: 'Cantieri', tags: ['fotovoltaico', 'sopralluogo'], destination: 'Drive › Cantieri › via Roma.md', segments: [
    { t: 0, speaker: 'Tecnico', text: 'Il tetto è orientato a sud-ovest, ci stanno circa diciotto pannelli.' },
    { t: 55, speaker: 'Alessandro', text: 'Segniamo che serve un secondo inverter per la parte del garage.' },
  ] },
  { id: 'a4', title: 'Chiamata cliente', date: '29 ott · 11:20', duration: 189, source: 'NAS / Registrazioni', status: 'in trascrizione', category: 'Da classificare', tags: [], destination: 'In attesa', segments: [] },
];

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
