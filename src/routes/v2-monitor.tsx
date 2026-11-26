import { createFileRoute } from '@tanstack/react-router';
import V2Monitor from '@/serveria/components/V2Monitor';
export const Route = createFileRoute('/v2-monitor')({
 head: () => ({ meta: [
  { title: 'Monitor · Serveria V2' },
  { name: 'description', content: 'Salute di server, NAS, worker remoti e Agent Zero: CPU, memoria, dischi e avvisi.' },
  { property: 'og:title', content: 'Monitor · Serveria V2' },
  { property: 'og:description', content: 'Salute delle macchine e dei worker di Serveria.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Monitor,
});
