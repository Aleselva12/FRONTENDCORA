import { createFileRoute } from '@tanstack/react-router';
import V2Updates from '@/serveria/components/V2Updates';
export const Route = createFileRoute('/v2-updates')({
 head:()=>({meta:[{title:'Aggiornamenti Cora · Serveria V2'},{name:'description',content:'Preparazione, verifica e applicazione controllata dei rilasci Cora in anteprima.'},{property:'og:title',content:'Aggiornamenti Cora · Serveria V2'},{property:'og:description',content:'Preparazione, verifica e applicazione controllata dei rilasci Cora in anteprima.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:()=><V2Updates/>,
});
