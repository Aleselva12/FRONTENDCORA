import { createFileRoute } from '@tanstack/react-router';
import V2Network from '@/serveria/components/V2Network';
export const Route = createFileRoute('/v2-network')({
 head: () => ({ meta: [
  { title: 'Rete e accesso remoto · Serveria V2' },
  { name: 'description', content: 'VPN, tunnel, dispositivi di casa, domini e certificati di Serveria.' },
  { property: 'og:title', content: 'Rete e accesso remoto · Serveria V2' },
  { property: 'og:description', content: 'VPN, tunnel, rete locale e certificati di Serveria.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
 ] }), component: V2Network,
});
