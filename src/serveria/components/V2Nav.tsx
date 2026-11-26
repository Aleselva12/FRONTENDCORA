import { Link } from "@tanstack/react-router";

const items = [
  ["/v2-home", "Home"], ["/v2-chat", "Chat"], ["/v2-photos", "Foto"], ["/v2-architecture", "Architettura"],
  ["/v2-programmer", "Programma"], ["/v2-calendar", "Calendario"], ["/v2-mail", "Mail"], ["/v2-files", "File"],
  ["/v2-audio", "Audio"], ["/v2-notifications", "Notifiche"], ["/v2-monitor", "Sistema"], ["/v2-roadmap", "Roadmap"],
  ["/v2-settings", "Impostazioni"],
] as const;

export default function V2Nav() {
  return (
    <nav className="ops-nav" aria-label="Sezioni Versione 2">
      {items.map(([to, label]) => <Link key={to} to={to} activeProps={{ "aria-current": "page" }}>{label}</Link>)}
    </nav>
  );
}
