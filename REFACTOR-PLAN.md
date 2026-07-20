# REFACTOR-PLAN.md — Reclutalia → arquitectura frontend/backend

> **Documento de handoff.** El refactor se ejecuta en fases; este archivo es la fuente de verdad
> para el modelo/dev que lo continúe. Léelo completo antes de tocar código. El comportamiento
> funcional actual está documentado en `reclutalia/CLAUDE.md` (léelo también — es exhaustivo).

## 0. Estado del refactor (checklist maestro)

- [x] Decisiones críticas tomadas (ver §1)
- [x] Estructura de carpetas `frontend/` y `backend/` creada
- [x] Backend: config, errores, middlewares de seguridad, catálogos, tipos, seed, repositorios
- [x] Backend: **slice vertical de referencia** `Vacantes` (route → controller → service → repository) + `matchService`
- [x] Frontend: config (Vite+TS), `apiClient`, tipos base, un `service` de ejemplo, un `hook` de ejemplo
- [ ] Backend: portar el resto de acciones `ACT` (pipeline, pool, candidato) — ver §6 tabla
- [ ] Frontend: migrar todos los componentes de `App.jsx` a `.tsx` por páginas (ver §7)
- [ ] Frontend: extraer CSS-in-JS (`CSS`, `THEMES`) a `styles/` (ver §8)
- [ ] Frontend: react-router con rutas por rol (ver §9)
- [ ] Sustituir el estado en memoria del frontend por llamadas HTTP a los services
- [ ] Eliminar la carpeta `reclutalia/` original una vez validada la paridad funcional
- [ ] Verificar paridad: cada flujo del CLAUDE.md funciona igual

## 1. Decisiones críticas (confirmadas con el usuario)

| Decisión | Elección | Implicación |
|---|---|---|
| Dónde vive la lógica | **Backend autoritativo** | `db`, `ACT`, `matchScore` van al backend. Frontend solo consume HTTP. El estado ahora **persiste entre recargas del navegador** (hasta reiniciar el server) y las acciones son **asíncronas**. |
| Ruteo | **react-router** | URLs reales por rol/vista (`/formador`, `/candidato/buscar`, `/admin/nueva`, …). |
| Alcance de esta entrega | **Scaffold + slice + plan** | No es la migración total; es la base + una rebanada vertical completa como plantilla + este checklist. |
| Estilos | **CSS propio extraído a archivos** | Se conservan los tokens `:root` y los 11 `THEMES` intactos. **NO** se migra a Tailwind. |

**Restricciones del prompt (respetar):** sin base de datos / ORM (repositorios con arrays en memoria);
sin auth/JWT/OAuth; TypeScript sin `any` salvo imposible; componentes < ~200 líneas; nada de
`fetch()` dentro de componentes (todo por services); SOLID/DRY/KISS **sin** sobre-ingeniería
(nada de hexagonal completa, CQRS, event sourcing, DDD, IoC containers). Debe ser legible para un
dev junior/semi-senior.

> ⚠️ El prompt original era una plantilla genérica de una app de chat (`useChat`, `ChatRepository`,
> `MessageRepository`, `chatService`). **Esos ejemplos NO aplican.** El dominio real es
> **reclutamiento**: `Vacante`, `Candidato`, `Formador`, `Notificacion`, `Pipeline`.

## 2. Dominio (glosario para nombres en el código)

- **Formador** — jefe directo que cubre la vacante (usuario principal). Ids `F1`, `F2`.
- **Administrador (RH)** — crea/edita vacantes. Id `A1`.
- **Candidato** — interno o externo. Ids numéricos `1..32`.
- **Vacante** — puesto a cubrir. Ids `V-1035`… Contiene `req` (descriptivo) + `pipeline` (candidatos).
- **Pipeline** — estado de cada candidato dentro de una vacante (`v.pipeline[cid]`).
- **Pool** — candidatos rankeados por `matchScore` al aprobar la vacante (`v.pool`).
- **Fases** — proceso en 3 fases con sub-pasos (`FASES`). Deriva del pipeline.

## 3. Estructura de carpetas

```
backend/
  src/
    config/        env.ts, constants.ts (puerto, límites, rate-limit)
    constants/     catalogs.ts (AREAS, NIVELES, ESPECIALIDADES, FASES, PIPE, PIPE_IDX, CAMPOS_DESC, …)
    types/         domain.ts (entidades), api.ts (Request/Response genéricos)
    interfaces/    repositorios (contratos) — opcional, KISS: tipos en repos
    dto/           create-vacante.dto.ts, etc. (entrada/salida validadas)
    errors/        AppError.ts (AppError, ValidationError, NotFoundError, InternalError)
    middlewares/   errorHandler.ts, notFound.ts, sanitize.ts, promptInjectionGuard.ts, validate.ts
    validators/    esquemas zod por recurso
    utils/         format.ts (money/hoy/hora/fechaVal), deterministic.ts (correoFormador/telFormador/…)
    data/          seed.ts (semilla), store.ts (arrays en memoria = "la BD")
    repositories/  candidatoRepository, vacanteRepository, formadorRepository, notificacionRepository
    services/      matchService, notificacionService, vacanteService, pipelineService, poolService, candidatoService
    controllers/   vacanteController, candidatoController, formadorController, notificacionController
    routes/        index.ts + *Routes.ts
    mappers/       entity ↔ dto (solo si hace falta; KISS)
    app.ts         crea el Express app (middlewares, rutas)
    server.ts      arranca el server (listen)

frontend/
  src/
    assets/ components/{common,layout,ui} pages/ hooks/ services/{,api}
    types/{interfaces,models} utils/{,helpers} constants/ contexts/ providers/
    config/ styles/ routes/ guards/ validators/ lib/ store/
    App.tsx main.tsx
```

## 4. El "store" en memoria (reemplaza al `db` de React)

Hoy el frontend tiene `db = { candidatos, vacantes, formadores, notifs }` en `useState` y muta con
`run(fn)` = `structuredClone(db)` + `fn(nd)`. En el backend:

- `data/store.ts` mantiene **4 arrays** vivos (candidatos, vacantes, formadores, notifs), sembrados
  desde `seed.ts` al arrancar. **Esta es la "BD".** Fácil de sustituir luego por Postgres/Mongo:
  solo cambia la implementación de los repositorios.
- Los **repositorios** son la única capa que toca los arrays (find/push/update). Devuelven copias
  cuando conviene, pero como es mock in-memory, mutar la entidad encontrada y no re-clonar es
  aceptable (equivale al `structuredClone` actual, que existía solo para provocar re-render en React;
  en el backend no hace falta).
- Los **services** contienen la lógica de negocio (lo que hoy es `ACT`), llamando a repositorios.
- Cada acción que hoy hace `notify(...)` → llama a `notificacionService.emitir(...)`.

## 5. Motor de match (crítico — determinístico)

`matchService.matchScore(candidato, req)` debe portarse **carácter por carácter** desde
`App.jsx` (`function matchScore`). Pesos: esp req ~34, hard ~24, nivel ~12, soft ~8, exp ~8,
opcionales ~6, ubicación ~7, modalidad ~3, jitter determinístico `((c.id*37)%7)-3`, tope 98.
`buildPool` filtra `>=28` y ordena desc. **No introducir aleatoriedad real.** Hay una prueba de
oro recomendada: capturar los scores actuales de la semilla y compararlos tras el port.

## 6. Mapeo `ACT` (frontend actual) → endpoints backend

Todas mutan estado y emiten notificaciones. Convención REST propuesta (ajustable):

| Acción `ACT` | Método + endpoint | Service | Estado |
|---|---|---|---|
| `crearVacante(req,formadorId)` | `POST /vacantes` | vacanteService | ✅ slice |
| `editarVacante(vacId,req,rechazados,nota)` | `PATCH /vacantes/:id` | vacanteService | ✅ slice |
| `solicitarCambios(vacId,cambios)` | `POST /vacantes/:id/cambios` | vacanteService | ✅ slice |
| `aprobarVacante(vacId)` | `POST /vacantes/:id/aprobar` | vacanteService | ✅ slice |
| `solicitarMasCandidatos(vacId,multiposting)` | `POST /vacantes/:id/solicitar-mas` | vacanteService | ⬜ |
| `invitar(vacId,cid,mensaje)` | `POST /vacantes/:id/pipeline/:cid/invitar` | pipelineService | ⬜ |
| `aplicar(vacId,cid,killersOk)` | `POST /vacantes/:id/pipeline/:cid/aplicar` | pipelineService | ⬜ |
| `rechazarInvitacion(vacId,cid,motivo)` | `POST …/:cid/rechazar` | pipelineService | ⬜ |
| `postularDirecto(vacId,cid,killersOk,mensaje)` | `POST /vacantes/:id/postular` | pipelineService | ⬜ |
| `docsFiltroListos(vacId,cid)` | `POST …/:cid/filtros` | pipelineService | ⬜ |
| `completarPsicometrico(cid)` | `POST /candidatos/:cid/psicometrico` | candidatoService | ⬜ |
| `videoIA(vacId,cid)` | `POST …/:cid/video-ia` | pipelineService | ⬜ |
| `enviarSlots(vacId,cids,slots,modalidad)` | `POST …/slots` | pipelineService | ⬜ |
| `confirmarSlot(vacId,cid,slot)` | `POST …/:cid/confirmar-slot` | pipelineService | ⬜ |
| `registrarEntrevista(vacId,cid,payload)` | `POST …/:cid/entrevista` | pipelineService | ⬜ |
| `seleccionar(vacId,cid)` | `POST …/:cid/seleccionar` | pipelineService | ⬜ |
| `agendarMedico(vacId,cid,datos)` | `POST …/:cid/medico` | pipelineService | ⬜ |
| `validarMedico(vacId,cid)` | `POST …/:cid/medico/validar` | pipelineService | ⬜ |
| `recordarDocs(vacId,cid)` | `POST …/:cid/recordar-docs` | pipelineService | ⬜ |
| `docsContratoListos(vacId,cid)` | `POST …/:cid/docs-contrato` | pipelineService | ⬜ |
| `enviarOferta(vacId,cid,monto,fecha,ubicacion)` | `POST …/:cid/oferta` | pipelineService | ⬜ |
| `aceptarOferta(vacId,cid)` | `POST …/:cid/oferta/aceptar` | pipelineService | ⬜ |
| `simular(vacId,cid)` | `POST …/:cid/simular` | pipelineService | ⬜ |
| `archivarCand(vacId,cid)` | `POST /vacantes/:id/archivar/:cid` | poolService | ⬜ |
| `toggleFavCand(formadorId,cid)` | `POST /formadores/:id/favoritos/:cid` | poolService | ⬜ |
| `crearCategoria(formadorId,nombre)` | `POST /formadores/:id/categorias` | poolService | ⬜ |
| `toggleCategoria(formadorId,nombre,cid)` | `POST /formadores/:id/categorias/:n/:cid` | poolService | ⬜ |
| `guardarCandidato(cand)` | `PUT /candidatos/:id` | candidatoService | ⬜ |
| lectura de `db` completo | `GET /vacantes`, `GET /candidatos`, `GET /formadores`, `GET /notificaciones?para=` | cada controller | ⬜ (patrón en vacanteController) |

**Helpers que también migran** (a `utils/`): `matchScore`, `buildPool`, `faseVacante`, `slotTomado`,
`psicoVigente`/`psicoVigenteHasta`, `correoFormador`/`telFormador`, `numEmpleado`, `mapsUrl`,
`proximosDias`, `fechasQuincena`, `fechaVal`, `money`/`hoy`/`hora`, `distKm`/`KM`. Helpers de UI que
generan HTML de blob (`descargarCV`, `abrirAperturaCuenta`) **se quedan en el frontend** (son
descargas del navegador, no lógica de servidor).

## 7. Migración del frontend por páginas

`App.jsx` (~3428 líneas) se corta por sus banners (ver tabla en `CLAUDE.md`). Sugerencia de páginas
(react-router) y a qué componentes corresponden:

- `pages/formador/MisVacantesPage` ← `FormadorHome`
- `pages/formador/VacanteDetailPage` ← `VacanteDetail` (+ modales invitar/agendar/entrevista/oferta, `VideoIAResumenModal`, overlays de pool)
- `pages/admin/VacantesPage`, `pages/admin/NuevaVacantePage`, `pages/admin/PoolPage` ← `AdminPanel`, `VacanteForm`, `CandidatoForm`
- `pages/candidato/MisProcesosPage`, `pages/candidato/BuscarVacantesPage` ← `CandidatoHome`, `BuscarVacantes`
- `pages/NotificacionesPage` ← `NotifList`
- `components/common`: `Modal`, `Chip`, `MatchRing`, `Avatar`, `FasesBar`, `MiniPipe`, `EstadoChip`, `QRDemo`
- `components/ui` de subida: `UploadPDF`, `UploadFoto`, `TagPicker`, `TagInput`
- `components/candidato`: `PerfilModal`, `PerfilEditor`, `KillerPreguntas`, `PostulacionForm`, modales de banco/médico
- `BotSoporte` → `components/layout/BotSoporte`

**Regla:** todo componente > ~200 líneas se divide. Toda lógica de estado/side-effect reutilizable
→ custom hook (`useVacantes`, `useCandidato`, `useNotificaciones`, `usePipeline`, `useToast`,
`useTema`). Cero `fetch` en componentes: se llama a `services/*` que usan `apiClient`.

## 8. Estilos

- Mover la constante `CSS_BASE` a `styles/base.css` (CSS plano, mismos selectores).
- Mover `THEMES` + `THEME_CSS` a `styles/themes.css` (o `styles/themes.ts` si se quiere generar el
  CSS por data-theme desde el objeto — pero preferir CSS estático). Mantener `--ai` solo para IA.
- `FONT_IMPORT` → `<link>` en `index.html` o `@import` en `base.css`.
- El `<div className="rk" data-theme={tema}>` se mantiene; `tema` vive en un `ThemeProvider`/context.

## 9. Ruteo (react-router)

Rutas por rol; el "cambiar rol/estilo" del sidebar es una utilidad **demo** que se conserva (un
`DemoContext` con `rol`, `formadorId`, `candId`, `tema`). Guards en `guards/` son ligeros (no hay
auth): p.ej. `RoleRoute` que redirige si el rol demo no corresponde. No implementar autenticación.

## 10. Seguridad backend (básica, del prompt)

Implementado en el scaffold: `helmet`, `cors`, `express-rate-limit`, límite de body (`express.json({limit})`),
sanitización básica + strip de campos inesperados (via validación zod `.strict()`), manejo global de
errores. **Prompt-injection guard** (`middlewares/promptInjectionGuard.ts`): aunque hoy **no hay LLM
real** (todo "IA" es simulado), se deja el middleware listo para cualquier endpoint futuro que reciba
prompts — trata el input como datos, detecta patrones ("ignora instrucciones", "actúa como system"),
limita tamaño, quita caracteres de control, y **loguea** sin bloquear salvo contenido claramente
malicioso. Nunca `eval`/`Function()`.

## 11. Cómo correr (una vez completo)

```bash
# backend
cd backend && npm install && npm run dev      # Express en :4000
# frontend
cd frontend && npm install && npm run dev     # Vite en :5173, proxy /api → :4000
```
