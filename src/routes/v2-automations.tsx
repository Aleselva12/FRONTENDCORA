import { createFileRoute } from '@tanstack/react-router';
import V2Automations from '@/serveria/components/V2Automations';
export const Route = createFileRoute('/v2-automations')({
  head: () => ({ meta: [
    { title: 'Automazioni & Tool V2 · Serveria' },
    { name: 'description', content: 'Il laboratorio di automazioni Serveria V2: flussi visuali, tool, simulazioni locali e visioni multi-agente.' },
    { property: 'og:title', content: 'Serveria V2 · Automazioni & Tool' },
    { property: 'og:description', content: 'Un editor visuale per esplorare il futuro delle automazioni di Serveria.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: V2Automations,
});
