import { createFileRoute } from '@tanstack/react-router';
import V2Settings from '@/serveria/components/V2Settings';
export const Route = createFileRoute('/v2-settings')({
  head: () => ({ meta: [
    { title: 'Menu, impostazioni e aggiornamenti · Serveria V2' },
    { name: 'description', content: 'Preferenze di Serveria e controllo aggiornamenti in anteprima grafica.' },
    { property: 'og:title', content: 'Menu e impostazioni · Serveria V2' },
    { property: 'og:description', content: 'Impostazioni generali e aggiornamenti di Serveria, solo dimostrativi.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Settings,
});
