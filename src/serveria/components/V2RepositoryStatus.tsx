import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, ChevronDown, ClipboardList, FileCode2, Save, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import V2SectionTabs from './V2SectionTabs';
import { controls } from '../alignment/control-schema';
import { emptyPreview, moduleById, moduleForPath, previewAction, sourceRevision, statusLabels, type Module, type PreviewState } from '../alignment/model';

export function RepositoryControlPanel({ module, embedded = false }: { module:Module; embedded?:boolean }) {
 const [featureId,setFeatureId]=useState(module.features[0]?.id ?? '');
 const [values,setValues]=useState<Record<string,Record<string,string>>>({});
 const [preview,setPreview]=useState<PreviewState>(emptyPreview);
 const [notice,setNotice]=useState('');
 const feature=module.features.find(f=>f.id===featureId) ?? module.features[0];
 if(!feature) return null;
 const schema=controls[feature.id];
 const read=(key:string, initial='')=>values[feature.id]?.[key] ?? initial;
 const change=(key:string,value:string)=>setValues(v=>({...v,[feature.id]:{...v[feature.id],[key]:value}}));
 const act=(action:string)=>{
  if(action==='Esporta testo della bozza') {
   const content=Object.entries(values[feature.id] ?? {}).map(([key,value])=>`${key}: ${value}`).join('\n');
   if(!content.trim()){setNotice('Inserisci il contenuto della bozza prima di esportarla.');return;}
   const url=URL.createObjectURL(new Blob([content],{type:'text/plain'})); const a=document.createElement('a');a.href=url;a.download='serveria-bozza.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  setPreview(state=>previewAction(state,feature.id,action));
  setNotice(`${action}: anteprima registrata nella sessione. Nessun servizio eseguito o dato reale modificato.`);
 };
 const destination=(action:string)=>action==='Apri aggiornamenti'?'/v2-updates':action==='Apri programmi'?'/v2-programs':action==='Apri modelli della macchina'?'/v2-monitor':undefined;
 return <section className={`repo-controls ${embedded?'is-embedded':''}`} aria-label={`Controlli originali · ${module.title}`}>
  <div className="repo-controls-nav" role="tablist" aria-label={`Funzioni ${module.title}`}>{module.features.map(f=><Button key={f.id} role="tab" aria-selected={f.id===feature.id} onClick={()=>{setFeatureId(f.id);setNotice('');}}><span className={f.coverage==='missing'?'repo-dot is-missing':'repo-dot'}/>{f.title}</Button>)}</div>
  <div className="repo-controls-main"><span className="ops-overline">{feature.coverage==='missing'?'COSTRUZIONE DA COMPLETARE':'CONTROLLI DELLA REPOSITORY / ANTEPRIMA'}</span><h2>{feature.title}</h2>
   {feature.source && <p className="repo-source"><FileCode2 size={13}/>{feature.source}<small>{sourceRevision.slice(0,12)} · solo lettura</small></p>}
   {feature.note && <p>{feature.note}</p>}
   {schema ? <><div className="repo-fields">{schema.fields.map(field=><label key={field.key} className={field.type==='textarea'?'is-wide':field.type==='checkbox'?'is-check':''}><span>{field.label}</span>{field.type==='select'?<select aria-label={field.label} value={read(field.key,field.initial)} onChange={e=>change(field.key,e.target.value)}>{field.options?.map(o=><option key={o}>{o}</option>)}</select>:field.type==='textarea'?<textarea aria-label={field.label} rows={4} value={read(field.key,field.initial)} onChange={e=>change(field.key,e.target.value)}/>:field.type==='checkbox'?<input type="checkbox" aria-label={field.label} checked={read(field.key,field.initial)==='true'} onChange={e=>change(field.key,String(e.target.checked))}/>:field.type==='file'?<input type="file" aria-label={field.label} onChange={e=>change(field.key,e.target.files?.[0]?.name??'')}/>:<input aria-label={field.label} type={field.type??'text'} readOnly={field.readOnly} value={read(field.key,field.initial)} step={field.type==='number'?'any':undefined} onChange={e=>change(field.key,e.target.value)}/>}</label>)}</div>
   {schema.note && <p className="repo-boundary">{schema.note}</p>}
   <div className="repo-actions">{schema.actions.map(action=>{const to=destination(action);return to?<Link key={action} to={to}>{action}<ArrowUpRight size={14}/></Link>:<Button key={action} onClick={()=>act(action)}><Save size={13}/>{action}</Button>;})}</div></>:<div className="repo-missing"><Wrench size={24}/><strong>{feature.coverage==='missing'?'Backend / integrazione da completare':'Schermata V2 da completare'}</strong><p>Nessun controllo operativo attivato.</p></div>}
   {notice&&<p className="repo-notice" role="status">{notice}</p>}
   <details className="repo-local-history"><summary>Azioni di questa anteprima · {preview.history.length}</summary>{preview.history.length?<ol>{preview.history.map((row,i)=><li key={i}>{row.action} · simulata</li>)}</ol>:<p>Nessuna azione nella sessione. Non è lo storico del server.</p>}</details>
  </div>
 </section>;
}
export default function V2RepositoryStatus({ moduleId }: {moduleId?:string}) {
 const location=useLocation();const module=moduleId?moduleById(moduleId):moduleForPath(location.pathname);
 const [open,setOpen]=useState(false);
 if(!module)return <V2SectionTabs/>;
 return <><V2SectionTabs/><div className={`repo-status repo-status-${module.backend}`}>
  <div className="repo-status-line"><Wrench size={14}/><span><strong>{statusLabels[module.backend]}</strong><small>{module.note}</small></span><Button aria-expanded={open} onClick={()=>setOpen(v=>!v)}><ClipboardList size={14}/><span>Controlli originali</span>{open?<X size={13}/>:<ChevronDown size={13}/>}</Button><Link to="/v2-alignment" title="Confronto completo" aria-label="Confronto completo"><ArrowUpRight size={16}/></Link></div>
  {open&&<RepositoryControlPanel key={module.id} module={module}/>}
 </div></>;
}
