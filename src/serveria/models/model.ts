export type ModelKind = 'chat' | 'code' | 'audio' | 'embedding';
export interface LocalModel { id: string; name: string; family: string; kind: ModelKind; parameters: string; size: string; vram: number; context: string; engine: string; description: string; installed: boolean }
// All names are catalog examples; memory figures are illustrative estimates, not benchmarks.
export const modelCatalog: LocalModel[] = [
  { id: 'qwen-chat', name: 'Qwen 2.5', family: 'Dialogo', kind: 'chat', parameters: '7B · Q4', size: '4.7 GB', vram: 5.2, context: '32K', engine: 'Ollama', description: 'Conversazioni con Cora, sintesi e ragionamento sul contesto.', installed: true },
  { id: 'qwen-code', name: 'Qwen 2.5 Coder', family: 'Programmazione', kind: 'code', parameters: '7B · Q4', size: '4.7 GB', vram: 5.4, context: '32K', engine: 'Ollama', description: 'Proposte di codice, lettura dei file e revisione delle modifiche.', installed: true },
  { id: 'whisper', name: 'Whisper', family: 'Trascrizione', kind: 'audio', parameters: 'large-v3', size: '3.1 GB', vram: 3.4, context: 'Audio', engine: 'faster-whisper', description: 'Trascrizione degli appunti vocali prima della classificazione nel Drive.', installed: true },
  { id: 'bge', name: 'BGE-M3', family: 'Ricerca semantica', kind: 'embedding', parameters: '567M', size: '1.2 GB', vram: 1.4, context: '8K', engine: 'Ollama', description: 'Vettori per cercare documenti e ritrovare concetti nella memoria.', installed: true },
  { id: 'llama', name: 'Llama 3.1', family: 'Dialogo', kind: 'chat', parameters: '8B · Q4', size: '4.9 GB', vram: 5.8, context: '128K', engine: 'Ollama', description: 'Alternativa da confrontare per il dialogo e i riepiloghi.', installed: false },
  { id: 'deepseek', name: 'DeepSeek R1', family: 'Ragionamento', kind: 'chat', parameters: 'Distill 14B · Q4', size: '9 GB', vram: 10.2, context: '32K', engine: 'Ollama', description: 'Ipotesi per compiti più lunghi, da valutare sul worker GPU.', installed: false },
];
export const demoGpuCapacity = 12;
export function memoryEstimate(ids: string[]) {
  return modelCatalog.filter(model => ids.includes(model.id)).reduce((sum, model) => sum + model.vram, 0);
}
export function previewLoad(ids: string[], id: string, capacity = demoGpuCapacity) {
  const next = [...new Set([...ids, id])];
  return { ids: memoryEstimate(next) <= capacity ? next : ids, fits: memoryEstimate(next) <= capacity, executed: false };
}