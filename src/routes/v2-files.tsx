import { createFileRoute } from '@tanstack/react-router';
import V2Files from '@/serveria/components/V2Files';
export const Route = createFileRoute('/v2-files')({
 head: () => ({ meta: [
  { title: 'File · Serveria V2 | Drive, server e NAS' },
  { name: 'description', content: 'Naviga e carica file tra Drive, server e NAS in un unico spazio. Anteprima grafica dimostrativa.' },
  { property: 'og:title', content: 'File · Serveria V2 | Drive, server e NAS' },
  { property: 'og:description', content: 'Un unico spazio per i file di Drive, server e NAS.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Files,
});
