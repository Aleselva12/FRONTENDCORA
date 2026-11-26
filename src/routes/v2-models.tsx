import { createFileRoute } from '@tanstack/react-router';
import V2Models from '@/serveria/components/V2Models';
export const Route = createFileRoute('/v2-models')({
  head: () => ({ meta: [
    { title: 'Modelli IA e GPU · Serveria V2' },
    { name: 'description', content: 'Catalogo dimostrativo dei modelli locali per Cora, trascrizioni e memoria, con gestione visuale della GPU.' },
    { property: 'og:title', content: 'Modelli IA e GPU · Serveria V2' },
    { property: 'og:description', content: 'Libreria modelli, risorse GPU e profili di prova nel design lab di Serveria.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }), component: V2Models,
});