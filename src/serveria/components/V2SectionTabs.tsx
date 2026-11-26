import { Link, useLocation } from '@tanstack/react-router';
import { sectionForPath } from '../structure';
export default function V2SectionTabs() {
  const { pathname } = useLocation();
  const section = sectionForPath(pathname);
  if (!section) return null;
  return <nav className="v2-subtabs" aria-label={`Sottopagine di ${section.title}`}>
    <strong>{section.title}</strong>
    {section.tabs.map(t => { const active = pathname === t.to || pathname.startsWith(t.to + '/'); return <Link key={t.to} to={t.to} aria-current={active ? 'page' : undefined} className={active ? 'is-active' : ''}>{t.label}</Link>; })}
  </nav>;
}
