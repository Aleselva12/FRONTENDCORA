export type Health = "ok" | "warn" | "down";
export type Program = {
  id: string; name: string; category: string; description: string; version: string;
  latest: string | null; health: Health; healthNote: string; uptime: string; port: string;
  cpu: number; ram: string; stats: { label: string; value: string }[]; future?: boolean;
};

export const programs: Program[] = [
  { id: "serveria", name: "ServerIa", category: "Intelligenza", description: "Cora, agenti e workspace personale.", version: "2.0.0-beta", latest: null, health: "ok", healthNote: "Tutti i servizi rispondono", uptime: "14 g", port: "8000", cpu: 18, ram: "6.2 GB", stats: [{ label: "Agenti", value: "6" }, { label: "Conversazioni", value: "312" }, { label: "Modello", value: "qwen3:8b" }] },
  { id: "immich", name: "Immich", category: "Foto e video", description: "Archivio foto e video con riconoscimento volti.", version: "1.118.2", latest: "1.119.0", health: "ok", healthNote: "Indicizzazione completata", uptime: "32 g", port: "2283", cpu: 6, ram: "2.1 GB", stats: [{ label: "Foto", value: "48.213" }, { label: "Video", value: "1.904" }, { label: "Spazio", value: "312 GB" }] },
  { id: "nextcloud", name: "Nextcloud", category: "File e collaborazione", description: "File, condivisioni e sincronizzazione dispositivi.", version: "29.0.7", latest: "30.0.1", health: "warn", healthNote: "Cron in ritardo di 2 ore", uptime: "32 g", port: "443", cpu: 4, ram: "1.4 GB", stats: [{ label: "File", value: "86.420" }, { label: "Utenti", value: "4" }, { label: "Spazio", value: "184 GB" }] },
  { id: "magazzino-tele", name: "Magazzino Tele", category: "Gestionale", description: "Inventario tele, rotoli e movimenti di magazzino.", version: "1.4.0", latest: null, health: "ok", healthNote: "Database sincronizzato", uptime: "9 g", port: "5100", cpu: 2, ram: "380 MB", stats: [{ label: "Articoli", value: "1.284" }, { label: "Sotto scorta", value: "12" }, { label: "Movimenti/mese", value: "430" }] },
  { id: "preventivi", name: "Preventivi", category: "Gestionale", description: "Preventivi, clienti e invio via mail.", version: "0.9.3", latest: "1.0.0", health: "ok", healthNote: "Ultimo invio riuscito oggi", uptime: "9 g", port: "5200", cpu: 1, ram: "240 MB", stats: [{ label: "Aperti", value: "23" }, { label: "Accettati", value: "71%" }, { label: "Clienti", value: "186" }] },
  { id: "ollama", name: "Ollama", category: "Modelli AI", description: "Motore locale per i modelli linguistici.", version: "0.4.2", latest: "0.4.5", health: "ok", healthNote: "GPU disponibile", uptime: "14 g", port: "11434", cpu: 12, ram: "7.8 GB", stats: [{ label: "Modelli", value: "5" }, { label: "In memoria", value: "1" }, { label: "Spazio", value: "38 GB" }] },
  { id: "jellyfin", name: "Jellyfin", category: "Media", description: "Film, serie e musica in streaming in casa.", version: "10.9.11", latest: null, health: "down", healthNote: "Servizio arrestato", uptime: "—", port: "8096", cpu: 0, ram: "0 MB", stats: [{ label: "Film", value: "412" }, { label: "Serie", value: "38" }, { label: "Spazio", value: "1.6 TB" }] },
  { id: "backup", name: "Backup", category: "Sicurezza", description: "Copie notturne cifrate dei dati importanti.", version: "2.1.0", latest: null, health: "ok", healthNote: "Ultima copia: stanotte 03:00", uptime: "32 g", port: "—", cpu: 0, ram: "90 MB", stats: [{ label: "Copie", value: "30" }, { label: "Dimensione", value: "96 GB" }, { label: "Prossima", value: "03:00" }] },
  { id: "home-assistant", name: "Home Assistant", category: "Domotica", description: "Luci, sensori e automazioni di casa.", version: "—", latest: null, health: "down", healthNote: "Non ancora installato", uptime: "—", port: "8123", cpu: 0, ram: "—", stats: [{ label: "Dispositivi", value: "—" }, { label: "Scene", value: "—" }, { label: "Stato", value: "Previsto" }], future: true },
];

export const healthLabel: Record<Health, string> = { ok: "In salute", warn: "Attenzione", down: "Fermo" };
export const findProgram = (id: string) => programs.find(p => p.id === id);
