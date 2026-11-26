# Cora / ServerIa V2 frontend

Frontend grafico (design lab). Tutti i dati sono dimostrativi: nessun collegamento backend.

## Avvio sul server

```bash
curl -fsSL https://bun.sh/install | bash   # se bun non e' installato
bun install
bun run build
bun run preview -- --host 0.0.0.0 --port 8080
```

Per lo sviluppo: `bun run dev -- --host 0.0.0.0`.
