import { createFileRoute } from '@tanstack/react-router';
import V2Activity from '@/serveria/components/V2Activity';
export const Route = createFileRoute('/v2-activity')({
  validateSearch: (search: Record<string, unknown>): { run?: string | undefined } => ({ run: typeof search['run'] === 'string' ? search['run'] : undefined }),
  head: () => ({ meta: [
    { title: 'Attività · Cora Explorer · Serveria V2' },
    { name: 'description', content: 'Esplora richieste, agenti, modelli e strumenti di Cora con mappa, sequenza e diagnostica dimostrativa.' },
    { property: 'og:title', content: 'Attività · Cora Explorer · Serveria V2' },
    { property: 'og:description', content: 'Il percorso delle richieste di Cora nel design lab Serveria. Dati illustrativi, nessuna esecuzione reale.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Activity,
});