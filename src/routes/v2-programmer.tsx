import { createFileRoute } from '@tanstack/react-router';
import V2Programmer from '@/serveria/components/V2Programmer';
export const Route = createFileRoute('/v2-programmer')({
 head: () => ({ meta: [
  { title: 'Programmatore · Serveria V2' },
  { name: 'description', content: 'Esplora il codice di Serveria, rivedi le proposte di modifica e assegna compiti al programmatore. Anteprima grafica.' },
  { property: 'og:title', content: 'Programmatore · Serveria V2' },
  { property: 'og:description', content: 'Codice, proposte e commit di Serveria in un unico spazio.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Programmer,
});
