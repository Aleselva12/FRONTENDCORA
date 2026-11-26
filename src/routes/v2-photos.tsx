import { createFileRoute } from '@tanstack/react-router';
import V2Temporary from '@/serveria/components/V2Temporary';
export const Route = createFileRoute('/v2-photos')({
 head:()=>({meta:[{title:'Foto · Immich · Serveria V2'},{name:'description',content:'Pagina temporanea per la schermata Foto di Serveria V2, ancora da costruire.'},{property:'og:title',content:'Foto · Immich · Serveria V2'},{property:'og:description',content:'Pagina temporanea per la schermata Foto di Serveria V2, ancora da costruire.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:()=><V2Temporary kind="photos"/>,
});
