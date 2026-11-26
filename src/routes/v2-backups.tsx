import { createFileRoute } from '@tanstack/react-router';
import V2Backups from '@/serveria/components/V2Backups';
export const Route = createFileRoute('/v2-backups')({
  head: () => ({ meta: [
    { title: 'Backup e ripristino · Serveria V2' },
    { name: 'description', content: 'Archivi, snapshot, pianificazione e recupero dei dati nella preview grafica Serveria.' },
    { property: 'og:title', content: 'Backup e ripristino · Serveria V2' },
    { property: 'og:description', content: 'La continuità di Cora: copie e punti di ripristino in un ambiente dimostrativo.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Backups,
});