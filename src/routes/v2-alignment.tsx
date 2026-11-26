import { createFileRoute } from '@tanstack/react-router';
import V2Alignment from '@/serveria/components/V2Alignment';
export const Route = createFileRoute('/v2-alignment')({
 head:()=>({meta:[{title:'Schermate e corrispondenze · Serveria V2'},{name:'description',content:'Confronto tra le schermate della repository Serveria e la versione V2, con controlli e parti mancanti distinti.'},{property:'og:title',content:'Schermate e corrispondenze · Serveria V2'},{property:'og:description',content:'Confronto tra le schermate della repository Serveria e la versione V2, con controlli e parti mancanti distinti.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:()=><V2Alignment/>,
});
