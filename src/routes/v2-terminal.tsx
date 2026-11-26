import { createFileRoute } from '@tanstack/react-router';
import V2Terminal from '@/serveria/components/V2Terminal';
export const Route = createFileRoute('/v2-terminal')({
 head: () => ({ meta: [
  { title: 'Terminale · Serveria V2' },
  { name: 'description', content: 'Console simulata del server: servizi, log e comandi rapidi con blocco delle azioni pericolose.' },
  { property: 'og:title', content: 'Terminale · Serveria V2' },
  { property: 'og:description', content: 'Servizi, log e console del server Serveria.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Terminal,
});
