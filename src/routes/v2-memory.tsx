import { createFileRoute } from '@tanstack/react-router';
import V2Memory from '@/serveria/components/V2Memory';
export const Route = createFileRoute('/v2-memory')({
 head: () => ({ meta: [
  { title: 'Memoria simbolica · Serveria V2' },
  { name: 'description', content: 'Schema a nodi della memoria di Cora: livelli permanente, semantico, episodico e di lavoro. Anteprima grafica.' },
  { property: 'og:title', content: 'Memoria simbolica · Serveria V2' },
  { property: 'og:description', content: 'La memoria di Cora come rete di concetti.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Memory,
});
