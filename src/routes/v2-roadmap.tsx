import { createFileRoute } from '@tanstack/react-router';
import V2Roadmap from '@/serveria/components/V2Roadmap';
export const Route = createFileRoute('/v2-roadmap')({
 head: () => ({meta: [
 {title:'Roadmap · Serveria V2 | Albero di evoluzione'},
 {name:'description',content:'Un albero tridimensionale per esplorare requisiti, maturità, placeholder e obiettivi futuri di Serveria. Anteprima grafica illustrativa.'},
 {property:'og:title',content:'Roadmap · Serveria V2 | Albero di evoluzione'},
 {property:'og:description',content:'Le radici di oggi e i rami di domani: la mappa di evoluzione illustrativa di Serveria.'},
 {property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},
 ]}),component:V2Roadmap,
});
