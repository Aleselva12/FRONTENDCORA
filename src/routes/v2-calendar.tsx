import { createFileRoute } from '@tanstack/react-router';
import V2Calendar from '@/serveria/components/V2Calendar';
export const Route = createFileRoute('/v2-calendar')({
 head: () => ({ meta: [
  { title: 'Calendario · Serveria V2' },
  { name: 'description', content: 'Settimana, appuntamenti e notifiche sul telefono, con eventi creati da una frase. Anteprima grafica.' },
  { property: 'og:title', content: 'Calendario · Serveria V2' },
  { property: 'og:description', content: 'Il tuo tempo organizzato con Cora.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Calendar,
});
