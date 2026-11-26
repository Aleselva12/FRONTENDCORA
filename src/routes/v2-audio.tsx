import { createFileRoute } from '@tanstack/react-router';
import V2Files from '@/serveria/components/V2Files';
export const Route = createFileRoute('/v2-audio')({
 head:()=>({meta:[{title:'Audio e trascrizioni · Serveria V2'},{name:'description',content:'Registrazioni, trascrizioni e classificazione appunti in Serveria V2.'},{property:'og:title',content:'Audio e trascrizioni · Serveria V2'},{property:'og:description',content:'Registrazioni, trascrizioni e classificazione appunti in Serveria V2.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
 component:()=><V2Files initialMode="audio"/>,
});
