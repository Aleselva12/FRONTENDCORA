import { createFileRoute } from '@tanstack/react-router';
import V2Temporary from '@/serveria/components/V2Temporary';
export const Route = createFileRoute('/v2-notifications')({
 head:()=>({meta:[{title:'Notifiche · Serveria V2'},{name:'description',content:'Pagina temporanea Notifiche e decisioni di Serveria V2.'},{property:'og:title',content:'Notifiche · Serveria V2'},{property:'og:description',content:'Pagina temporanea Notifiche e decisioni di Serveria V2.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:()=><V2Temporary kind="notifications"/>,
});
