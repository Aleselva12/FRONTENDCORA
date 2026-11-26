// Illustrative audio notes. Nothing is recorded, transcribed or saved for real.
export type AudioStatus = 'done' | 'running' | 'queued' | 'review';
export interface Segment { t: string; speaker: string; text: string }
export interface AudioNote {
  id: string; title: string; date: string; duration: string; size: string; status: AudioStatus;
  speakers: string[]; tags: string[]; destination: string; summary: string; actions: string[]; segments: Segment[];
}

export const audioStatus: Record<AudioStatus, string> = { done: 'Trascritto', running: 'In trascrizione', queued: 'In coda', review: 'Da revisionare' };

export const destinations = ['Drive · Appunti vocali', 'Drive · Clienti', 'Database · Note clienti', 'Database · Task', 'NAS · Archivio audio'];

export const audioNotes: AudioNote[] = [
  { id: 'a1', title: 'Riunione fornitori tele', date: 'Oggi · 09:42', duration: '12:48', size: '11,7 MB', status: 'done', speakers: ['Alessandro', 'Fornitore'], tags: ['Magazzino Tele', 'Ordini'], destination: 'Database · Note clienti',
    summary: 'Concordato riordino di 40 rotoli entro venerdì; prezzo invariato. Da verificare la disponibilità del colore grigio antracite.',
    actions: ['Creare ordine 40 rotoli', 'Chiedere conferma grigio antracite', 'Aggiornare Magazzino Tele'],
    segments: [
      { t: '00:04', speaker: 'Alessandro', text: 'Buongiorno, ti chiamo per il riordino delle tele del mese.' },
      { t: '00:11', speaker: 'Fornitore', text: 'Certo, quante ne servono questa volta?' },
      { t: '00:15', speaker: 'Alessandro', text: 'Pensavo a quaranta rotoli, consegna entro venerdì se riesci.' },
      { t: '00:24', speaker: 'Fornitore', text: 'Venerdì va bene. Il prezzo resta quello dell\u2019ultimo ordine.' },
      { t: '00:33', speaker: 'Alessandro', text: 'Perfetto. Il grigio antracite ce l\u2019hai disponibile?' },
      { t: '00:39', speaker: 'Fornitore', text: 'Devo controllare in magazzino, ti richiamo nel pomeriggio.' },
    ] },
  { id: 'a2', title: 'Idee Serveria V2', date: 'Ieri · 22:10', duration: '04:31', size: '4,1 MB', status: 'review', speakers: ['Alessandro'], tags: ['Serveria', 'Design'], destination: 'Drive · Appunti vocali',
    summary: 'Note sul cerchio della Home: aggiungere programmatore, terminale e audio. La pagina file deve restare semplice.',
    actions: ['Aggiungere satelliti mancanti', 'Unire file e audio'],
    segments: [
      { t: '00:02', speaker: 'Alessandro', text: 'Promemoria: nella Home mancano ancora programmatore e terminale.' },
      { t: '00:18', speaker: 'Alessandro', text: 'La pagina file deve contenere anche l\u2019audio, ma senza fare confusione.' },
    ] },
  { id: 'a3', title: 'Cliente Rossi · preventivo', date: '2 nov · 16:05', duration: '08:12', size: '7,5 MB', status: 'running', speakers: ['Alessandro', 'Sig. Rossi'], tags: ['Preventivi'], destination: 'Database · Note clienti', summary: '', actions: [], segments: [] },
  { id: 'a4', title: 'Nota vocale camion', date: '31 ott · 07:50', duration: '01:20', size: '1,2 MB', status: 'queued', speakers: ['Alessandro'], tags: ['Camion'], destination: 'Drive · Appunti vocali', summary: '', actions: [], segments: [] },
];
