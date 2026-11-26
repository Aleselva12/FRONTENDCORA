import { createFileRoute } from '@tanstack/react-router';
import V2Events from '@/serveria/components/V2Events';
export const Route = createFileRoute('/v2-events')({
  validateSearch: (search: Record<string, unknown>): { run?: string | undefined } => ({ run: typeof search['run'] === 'string' ? search['run'] : undefined }),
  head: () => ({ meta: [
    { title: 'Eventi · Processi operativi · Serveria V2' },
    { name: 'description', content: 'Catene operative dimostrative di collaudi, aggiornamento albero, servizi e backup con passaggi, esiti e correlazioni.' },
    { property: 'og:title', content: 'Eventi · Processi operativi · Serveria V2' },
    { property: 'og:description', content: 'Collaudi e processi del sistema nel design lab Serveria, senza telemetria o esecuzioni reali.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Events,
});