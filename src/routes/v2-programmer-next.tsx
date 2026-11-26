import { createFileRoute } from '@tanstack/react-router';
import V2Temporary from '@/serveria/components/V2Temporary';
export const Route = createFileRoute('/v2-programmer-next')({
 head:()=>({meta:[{title:'Programmatore W3 · Serveria V2'},{name:'description',content:'Pagina temporanea del futuro agente programmatore W3 in Serveria V2.'},{property:'og:title',content:'Programmatore W3 · Serveria V2'},{property:'og:description',content:'Pagina temporanea del futuro agente programmatore W3 in Serveria V2.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:()=><V2Temporary kind="programmer-next"/>,
});
