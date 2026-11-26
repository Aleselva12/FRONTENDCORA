<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the imported Serveria frontend in `src/serveria` and expose each screen through TanStack leaf routes; this preserves source layouts without replacing the project's router.
- Route all imported service calls through the in-memory design transport; this preview must never connect to the original backend.
- Keep imported visual values centralized in the global design system and use the shared native-sized source Button; this preserves source appearance while allowing future style changes.
- Use one shared workspace sidebar and centralized semantic style overrides for all Serveria screens; this prevents page-specific navigation and control styles from drifting apart.
- Keep the V2 promotional concept as a standalone leaf route with globally defined, namespace-scoped tokens and styles; experimental art direction must not alter the existing workspace screens.
- Keep the V2 operational Home in its own leaf route, with scoped global tokens and a browser-rendered canvas network; the interactive design preview must remain isolated from existing screens and backend services.
- Keep V2 automation graph state and simulated execution in the browser using React Flow and a separate pure model; this provides editable workflows without contacting services or implying real execution.
- Keep V2 conversations in a root-scoped in-memory provider with route-derived thread IDs and lightweight native presentation; Home quick tasks share the same messages without persistence or model calls.

- Keep Roadmap browser-only with an immutable canonical baseline, a revision-pinned repository snapshot and attributed review overlays; stable IDs and separate implementation/health prevent static code inspection from implying live verification.
- Keep V2 backup data and recovery previews in a browser-safe model with no execution or source overwrites; recovery controls illustrate the design without touching server archives.
- Keep V2 model catalog and GPU allocation estimates browser-only with a pure model; installs, loading and settings illustrate local AI management without downloading or invoking models.
- Keep V2 operational runs and audit events in one browser-safe illustrative model, deriving event rows from run steps; shared IDs prevent conflicting duplicate records and never imply real telemetry or execute approvals.
- Keep V2 Activity Explorer in a browser-safe AI scenario model with optional reciprocal run-ID links to operational Events; explicit call parents, uncorrelated signals and local replay remain distinct without contacting runtime services.
- Keep repository-to-V2 coverage and supplemental controls in a browser-safe alignment manifest pinned to the inspected source revision; code presence, missing UI and live verification must remain separate, and all actions stay simulated.
