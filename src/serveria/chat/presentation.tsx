import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type ComponentProps } from 'react';
import { ArrowDown, ArrowUp, Square } from 'lucide-react';
import { Button } from '@/components/ui/source-button';
import type { FileUIPart } from 'ai';

export function Conversation({children, ...props}: ComponentProps<'div'>) { const ref = useRef<HTMLDivElement>(null); useEffect(() => { ref.current?.scrollTo({top: ref.current.scrollHeight, behavior: 'smooth'}); }, [children]); return <div ref={ref} {...props}>{children}</div>; }
export function ConversationContent(props: ComponentProps<'div'>) { return <div {...props}/>; }
export function ConversationScrollButton(props: ComponentProps<typeof Button>) { return <Button {...props} className="vc-scroll" onClick={e => e.currentTarget.parentElement?.scrollTo({top: e.currentTarget.parentElement.scrollHeight, behavior: 'smooth'})}><ArrowDown size={15}/></Button>; }
export function Message({from, className = '', ...props}: ComponentProps<'article'> & {from: string}) { return <article className={`${className} is-${from}`} {...props}/>; }
export function MessageContent(props: ComponentProps<'div'>) { return <div className="vc-message-content" {...props}/>; }
export function MessageActions(props: ComponentProps<'div'>) { return <div className="vc-message-actions" {...props}/>; }
export function MessageResponse({children}: {children: string}) { return <div className="vc-response">{children.split('\n').map((line,i) => { const content = line.replace(/^###? /,'').split(/(\*\*.*?\*\*)/g).map((s,j) => s.startsWith('**') ? <strong key={j}>{s.slice(2,-2)}</strong> : s); return line.startsWith('#') ? <h3 key={i}>{content}</h3> : <p key={i}>{content || <br/>}</p>; })}</div>; }
export function Shimmer({children}: {children: ReactNode}) { return <p className="vc-pending" role="status">{children}</p>; }
export function Tool({defaultOpen, ...props}: ComponentProps<'details'> & {defaultOpen?: boolean}) { return <details open={defaultOpen} {...props}/>; }
export function ToolHeader({title}: {title: string; type: string; toolName: string; state: string}) { return <summary>{title}</summary>; }
export function ToolContent(props: ComponentProps<'div'>) { return <div {...props}/>; }
export function ToolInput({input}: {input: unknown}) { return <pre>{JSON.stringify(input,null,2)}</pre>; }
export function ToolOutput({output, errorText}: {output: unknown; errorText?: string | undefined}) { return <pre>{errorText || JSON.stringify(output,null,2)}</pre>; }
export type PromptInputMessage = {text: string; files: FileUIPart[]};
type Attachment = FileUIPart & {id: string};
const AttachContext = createContext<{files: Attachment[]; remove: (id: string) => void; openFileDialog: () => void}>({files: [], remove: () => {}, openFileDialog: () => {}});
export const usePromptInputAttachments = () => useContext(AttachContext);
export function PromptInput({children, onSubmit, multiple, className}: {children: ReactNode; onSubmit: (message: PromptInputMessage) => void; multiple?: boolean; className?: string}) {
 const [files,setFiles] = useState<Attachment[]>([]); const chooser = useRef<HTMLInputElement>(null);
 return <AttachContext.Provider value={{files, remove: id => setFiles(prev => prev.filter(f => f.id !== id)), openFileDialog: () => chooser.current?.click()}}><form className={className} onSubmit={e => { e.preventDefault(); const text = e.currentTarget.querySelector('textarea')?.value ?? ''; if (!text.trim() && !files.length) return; onSubmit({text,files: files.map(({id,...file}) => file)}); setFiles([]); }}><input ref={chooser} type="file" hidden multiple={multiple} onChange={e => { const selected = Array.from(e.target.files ?? []).map(f => ({id: crypto.randomUUID(), type: 'file' as const, filename: f.name, mediaType: f.type || 'application/octet-stream', url: ''})); setFiles(prev => [...prev,...selected]); e.target.value = ''; }}/>{children}</form></AttachContext.Provider>;
}
export function PromptInputTextarea(props: ComponentProps<'textarea'>) { return <textarea rows={2} {...props} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}/>; }
export function PromptInputFooter(props: ComponentProps<'div'>) { return <div className="vc-composer-footer" {...props}/>; }
export function PromptInputSubmit({status,onStop,...props}: ComponentProps<typeof Button> & {status: string; onStop: () => void}) { const stopping = status === 'submitted'; return <Button {...props} className="vc-submit" type={stopping ? 'button' : 'submit'} onClick={stopping ? onStop : undefined}>{stopping ? <Square size={16}/> : <ArrowUp size={18}/>}</Button>; }
