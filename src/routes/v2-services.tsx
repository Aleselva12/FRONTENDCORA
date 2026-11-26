import { createFileRoute } from '@tanstack/react-router';
import V2Services from '@/serveria/components/V2Services';
export const Route = createFileRoute('/v2-services')({
  head: () => ({ meta: [
    { title: 'Servizi e container · Serveria V2' },
    { name: 'description', content: 'Gestione dimostrativa di servizi e container del server Serveria: stato, risorse, log e azioni simulate.' },
    { property: 'og:title', content: 'Servizi e container · Serveria V2' },
    { property: 'og:description', content: 'Container e servizi del design lab Serveria, senza comandi reali.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Services,
});
