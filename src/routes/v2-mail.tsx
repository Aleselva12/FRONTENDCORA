import { createFileRoute } from '@tanstack/react-router';
import V2Temporary from '@/serveria/components/V2Temporary';
export const Route = createFileRoute('/v2-mail')({
 head:()=>({meta:[{title:'Mail · Serveria V2'},{name:'description',content:'Pagina temporanea Mail di Serveria V2, da costruire.'},{property:'og:title',content:'Mail · Serveria V2'},{property:'og:description',content:'Pagina temporanea Mail di Serveria V2, da costruire.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:()=><V2Temporary kind="mail"/>,
});
