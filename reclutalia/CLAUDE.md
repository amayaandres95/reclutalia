# CLAUDE.md — Reclutalia

Guía para trabajar en este proyecto. Léela al inicio de cada sesión antes de editar.

## Qué es

**Reclutalia** es un **prototipo semifuncional navegable** de una plataforma de cobertura
de vacantes ("TO BE — Formador de Equipo"). Se usa para **pruebas de validación con usuarios**
y como **referencia visual/funcional para el desarrollo final** (aún no es el producto real).

- Usuario principal: **Formador de Equipo** (jefe directo que cubre la vacante; auto-gestionable).
- Roles secundarios: **Administrador** (RH) y **Candidato** (interno/externo).
- Todo lo de "IA" e integraciones (Outlook/Teams, SAP, buró de crédito, video-entrevista, LMS)
  está **SIMULADO** con UI convincente — no hay servicios reales conectados.
- Tono: **institucional, español de México, sin texto en inglés en la UI.**

El documento fuente con el alcance completo (contexto, journey de 10 pasos / 5 fases,
los 10 requisitos funcionales, criterios de aceptación) es el **prompt maestro**
(`prompt-maestro-reclutalia.md`, en Descargas del usuario). Si hay duda sobre la intención
de una función, esa es la fuente de verdad.

## Ubicación de las carpetas (IMPORTANTE)

Existen carpetas duplicadas con nombres parecidos. **Trabajar SIEMPRE aquí:**

```
E:\Desarrollos\Reclutalia\proyecto-andres\reclutalia\    ← raíz del repo Git (.git, remote a GitHub)
└── reclutalia\                                          ← LA APP (esta carpeta; Vercel construye desde aquí)
    ├── package.json
    └── src\App.jsx
```

⚠️ Existe una copia suelta en `...\proyecto-andres\proyecto-andres\reclutalia\` que **NO está en Git
y NO se despliega**. Ignorarla / no editarla.

## Git y despliegue

- Repo: `https://github.com/amayaandres95/reclutalia.git`, rama `main`.
- Vercel despliega automáticamente en cada `push` a `main` (Root Directory de Vercel = la subcarpeta `reclutalia/`).
- Sitio en vivo: `https://reclutalia.vercel.app/`
- Flujo para publicar cambios (Claude no hace push sin que el usuario lo pida):
  ```bash
  git add .
  git commit -m "Descripción del cambio"
  git push origin main        # Vercel despliega solo tras el push
  ```

## Stack

- **React 19.2.7** + **Vite 8** (nota: el prompt maestro pedía React 18; la implementación usa 19).
- **lucide-react** para íconos.
- CSS propio con variables (sin Tailwind), embebido como string en `App.jsx`.
- **Sin backend, sin base de datos, sin localStorage.** El estado vive solo en memoria de la
  sesión del navegador y **se reinicia al recargar**. (Conectar a BD es una etapa futura.)

## Arquitectura actual (importante)

⚠️ **El prompt maestro pedía una estructura modular** (`src/data/`, `src/logic/`,
`src/components/`, `src/panels/formador|admin|candidato/`). **Esa estructura NO se implementó:
toda la app está en un solo archivo `src/App.jsx` (~1700 líneas).** Tenerlo presente al planear
refactors o al escalar hacia el producto real.

### Mapa interno de `src/App.jsx`

Organizado por secciones con banners de comentario. **Para ubicar código, busca el banner**
(los números de línea cambian al editar; los banners son estables):

| Banner `/* ===== ... ===== */` | Contenido |
|---|---|
| `ESTILOS` | Todo el CSS. Los **tokens de diseño (colores/marca) están en `:root`** |
| `CATÁLOGOS` | Áreas, niveles, skills, aptitudes, `JOURNEY` (10 pasos), `PIPE` (pipeline candidato) |
| `DATOS SEMILLA` | 32 candidatos, 3 vacantes, 2 formadores, 1 admin |
| `UTILIDADES` | `matchScore`/`buildPool` (motor de match simulado), `descargarCV`, helpers de fecha/dinero |
| `COMPONENTES BASE` | `Modal`, `Chip`, `MatchRing`, `Avatar` (acepta prop `foto`), `JourneyBar`, `MiniPipe`, `EstadoChip`, `QRDemo` (QR decorativo estático, Batch 5) |
| `BOT DE APOYO` | Bot flotante FAQ (transversal) |
| `PERFIL DE CANDIDATO` | `PerfilModal` (solo lectura, lo ve el formador; prop opcional `req` → resalta en verde esp/hard/soft coincidentes; **Batch 2:** muestra título destacado, resumen, intereses, experiencia y educación —bullets con `rangoFechas`/`fmtMes`, máx 3 + "Ver más"—; props opcionales `fav/enCat/archivado/onFav/onCat/onArchivar` → acciones favorito/categorizar/archivar cuando lo abre el formador) · `PerfilEditor` (editor del propio candidato: modal `wide` con pestañas *Mi perfil* / *Mis documentos*) |
| `SUBIDA DE ARCHIVO` | `UploadPDF` (solo PDF, máx 1 MB; prop opcional `onDelete`), `UploadFoto` (imagen JPG/PNG ≤ 2 MB → data URL), `TagPicker`, `TagInput` (chips de texto libre con ✕ al hover, máx N) |
| `FORMULARIO ESTANDARIZADO DE VACANTE` | `VacanteForm` (wizard de 4 pasos) |
| `PANEL DEL FORMADOR` | `VacanteDetail`, `FormadorHome`, `NotifList`, modales invitar/agendar/entrevista/oferta, `Celebracion` · **Batch 1 (pool):** `BusquedaIAOverlay` (animación IA 5 s al aprobar), `CategorizarModal`, `CompartirModal`, `SolicitarMasModal`; helper de módulo `bandCol(v)` (color por banda de ranking) |
| `PANEL DEL CANDIDATO` | `CandidatoHome`, `VideoIAModal`, `KillerPreguntas` (killer questions compartidas), `PostulacionForm`, `CuentaBancoModal` (captura de número de cuenta/CLABE, Batch 5) · `MedicoAgendar` (Batch 6: captura
ubicación + elige entre 5 sucursales simuladas + fecha de la próxima semana para el examen médico) · **Buscar Vacantes (Batch 3):** `BuscarVacantes` (tarjetas con filtros, orden y favoritos), `DetalleVacanteModal` (resalta en verde lo que coincide con el perfil del candidato), `AplicarModal` |
| `PANEL DE ADMIN` | `AdminPanel`, `CandidatoForm` |
| `APP` | Componente raíz: shell, sidebar, cambio de rol demo, ruteo por estado |

## Conceptos clave

- **Estado global:** un objeto `db` (`{ candidatos, vacantes, formadores, notifs }`) en `useState`
  dentro de `App`. **Toda mutación pasa por `run(fn)`**, que hace `structuredClone(db)`, aplica
  `fn(nuevaDb)` y re-renderiza. Nunca mutar `db` directamente.
- **Lógica de negocio:** el objeto **`ACT`** concentra todas las acciones (crear/editar/aprobar
  vacante, invitar, postular, video-IA, agendar, entrevistar, seleccionar, oferta, contratar).
  Cada acción también emite notificaciones vía `notify(...)`. `ACT.guardarCandidato` **reemplaza el
  objeto candidato completo** (no hace merge): quien lo llame debe pasar TODOS los campos.
  **`ACT.postularDirecto(db, vacId, cid, killersOk, mensaje)`** (Batch 3): postulación por iniciativa
  del candidato desde "Buscar vacantes" — crea la entrada de `v.pipeline` sin invitación previa ni
  `v.pool` (calcula el match con `matchScore`); queda `postulado` (notifica al formador) o
  `filtrado` si falló killers (notifica al candidato).
  **`ACT.completarPsicometrico(db, cid)`** (Batch 4): registra `c.psicometrico={fecha,ts}` a nivel
  candidato (vigencia 6 meses, helpers `psicoVigente`/`psicoVigenteHasta`).
  **`ACT.enviarOferta(db, vacId, cid, monto, fecha, ubicacion)`** (Batch 5): ahora recibe `ubicacion`
  (dirección de presentación) y la guarda en `p.oferta.ubicacion` (default `DIRECCION_CORP`).
  **`ACT.agendarMedico(db, vacId, cid, datos)`** y **`ACT.validarMedico(db, vacId, cid)`** (Batch 6):
  examen médico condicional. El candidato agenda (`p.medico={estado,ciudad,municipio,sucursal,fecha,validado:false}`,
  notifica al formador) y el formador valida el resultado (`p.medico.validado=true`, notifica al candidato).
- **Modelo del candidato:** campos que lee el match (`esp`, `hard`, `soft`, `nivel`, `exp`,
  `ciudad`, `modalidad`) + descriptivos (`salario`, `edu`, `tipo`, `area`, `puesto`, `resumen`,
  `email`, `tel`) + **campos de perfil editable (Batch 2):** `experiencia[]`, `educacion[]`,
  `intereses[]`, `foto` (data URL) y `docsPerfil` (INE/CURP/RFC/domicilio/estudios/`certificaciones[]`/cv)
  + **`favoritos[]`** (Batch 3: ids de vacantes guardadas con el corazón en "Buscar vacantes")
  + **`psicometrico`** (Batch 4: `{fecha,ts}` o `null`; examen a NIVEL candidato, vigente 6 meses,
  se reutiliza en todas las vacantes).
  El candidato los edita en `PerfilEditor` (se abre desde el topbar); en la UI *Habilidades*↔`soft`
  y *Herramientas*↔`hard`. Los arrays `esp/hard/soft` **nunca** deben quedar `undefined` (rompen `matchScore`).
  **Campos por vacante en `v.pipeline[cid]`:** `docsFiltro.constancias[]` (Batch 4: constancias de
  empleos previos, múltiples), `autorizaFiltros` (bool del checkbox de autorización, Batch 4),
  `docsContrato{}`, `cuentaBanco` (string cuenta/CLABE, Batch 5), `oferta{monto,fecha,ubicacion}`,
  `medico{estado,ciudad,municipio,sucursal,fecha,validado}` (Batch 6: examen médico agendado por el
  candidato y validado por el formador; solo si `v.req.examenMedico`).
  **Campo en `v.req`:** `examenMedico` (bool, default false; Batch 6): si es true, el candidato
  seleccionado debe agendar y aprobar un examen médico antes de completar su documentación.
  Semilla: activo en la vacante **V-1038**. Catálogo `SUCURSALES_MEDICAS` (5 sucursales simuladas)
  y helper `proximosDias(n)` (fechas para agendar dentro de la próxima semana).
- **Motor de match (`matchScore`):** determinístico (misma entrada → mismo score). Pesos aprox:
  especialidades req ~34, hard skills ~24, nivel ~12, soft ~8, experiencia ~8, opcionales ~6,
  ubicación/radio ~7, modalidad ~3; jitter determinístico; tope 98; **umbral de descarte ~28**.
- **Journey:** `JOURNEY` = 10 etapas en 5 fases; `JourneyBar` lo dibuja. `etapaVacante(v)` calcula
  la etapa actual a partir del pipeline.
- **Pipeline del candidato:** estados en `PIPE` / `PIPE_IDX`
  (invitado → postulado → filtros_ok → evaluado → slots_enviados → agendado → entrevistado →
  seleccionado → docs_completos → oferta_enviada → contratado; terminales: filtrado, descartado).
- **Modo demo:** selector de rol en el sidebar (Formador/Admin/Candidato) + botones
  **"⚡ Simular respuesta del candidato"** (`ACT.simular`) para avanzar el flujo sin cambiar de rol.
- **Buscar Vacantes (Batch 3):** vista `buscar` del sidebar del candidato. Tarjetas de vacantes
  `abiertas` (máx 3 por fila, grid `.vac-grid`) con `MatchRing` en vivo, **sin mostrar el código
  V-xxxx**; filtros por ubicación/nivel/área/sueldo, ordenamiento (compatibilidad, publicación —
  helper `fechaVal` sobre `v.creada` —, título, sueldo), favoritos (corazón `.heart`) y aplicación
  directa (`DetalleVacanteModal` → `AplicarModal` → `ACT.postularDirecto`). Si el candidato ya está
  en el pipeline, la tarjeta y el detalle muestran su `EstadoChip` en lugar de aplicar.
- **Cierre amable (Batch 3):** en "Mis procesos", los estados `descartado`/`filtrado` ya no muestran
  chip rojo ni MiniPipe: muestran "La vacante concluyó, gracias por aplicar." + botones
  **Ver mi feedback** (modal con `p.entrevista.feedback` o mensaje genérico) y **Ver más vacantes**
  (navega a `buscar` vía prop `onBuscar` de `CandidatoHome`).
- **Filtros iniciales (Batch 4):** estados `postulado`/`filtros_ok` en `CandidatoHome`. Ya NO se pide
  buró de crédito. Se pide: **constancias de empleos previos** (múltiples PDFs vía `UploadPDF`,
  guardadas en `p.docsFiltro.constancias[]`), **examen psicométrico** (botón que simula completarlo →
  `ACT.completarPsicometrico`; a nivel candidato, vigente 6 meses, pre-completado en otras vacantes)
  y un **checkbox de autorización** obligatorio (`p.autorizaFiltros`). El botón "Enviar a validación
  automática" se habilita solo con ≥1 constancia + psicométrico vigente + checkbox marcado. Nota fija:
  los datos/documentos del perfil (INE/RFC/constancias educativas) se reutilizan al aplicar.
- **Contratación (Batch 5):** en el checklist del candidato (`seleccionado`) además de los 5 PDFs se pide
  **"Cuenta bancaria para nómina"** con 3 acciones: abrir apertura de cuenta (`abrirAperturaCuenta`,
  página blob simulada), **Ver QR** (`QRDemo`) e **Ingresar/editar número de cuenta** (`CuentaBancoModal`
  → `p.cuentaBanco`). La documentación no está completa sin `cuentaBanco`. El formador lo ve en su
  checklist de solo lectura. **Ubicación de presentación:** `OfertaTool` captura la dirección →
  `p.oferta.ubicacion` (default `DIRECCION_CORP`); se muestra en la carta oferta del candidato, en la
  bienvenida (`contratado`) y en la `Celebracion` del formador, con botón **Ver en Google Maps**
  (helper `mapsUrl`).
- **Examen médico condicional (Batch 6):** checkbox `req.examenMedico` en `VacanteForm` (paso "4 · Condiciones");
  visible en ambos descriptivos (`VistaDescriptivo` y `DetalleVacanteModal`). Si está activo, en el checklist
  de contratación del candidato (`seleccionado`) aparece el requisito **Examen médico**: captura estado/ciudad/
  municipio, "Buscar sucursales" (5 fijas de `SUCURSALES_MEDICAS`), elige sucursal + fecha (`proximosDias(7)`) y
  agenda (`ACT.agendarMedico`). Queda en **pendiente ámbar** (`--warn`/`--gold-soft`) hasta que el formador lo valide
  desde su tab "Selección y documentos" con **Validar resultado positivo del examen** (`ACT.validarMedico`) → verde.
  La documentación NO se considera completa (`medicoOk` en `contratoOk`) hasta la validación. `ACT.simular`
  fast-forwardea agendado+validado. Cierre amable / status del candidato: `EstadoChip` acepta prop `candView`
  que muestra "Cerrada" en lugar de "Descartado" en vistas del candidato.
- **Pool de talento del formador (Batch 1 · plan FORMADOR-ADMIN):** en la tab "Pool de talento" de
  `VacanteDetail`. Acciones por tarjeta: favorito (`ACT.toggleFavCand(db,formadorId,cid)` → `f.favoritosCands[]`,
  global), categorizar (`ACT.crearCategoria`/`ACT.toggleCategoria` → `f.categorias=[{nombre,cids[]}]`, global),
  compartir (solo toast, simulado) y **archivar por vacante** (`ACT.archivarCand(db,vacId,cid)` → `v.archivados[]`;
  toggle "Ver archivados"). Filtros (`fVals`: skills de la vacante, exp mín, estudios mín sobre `EDUCACION`,
  tipo interno/externo/ambos). **"Solicitar más candidatos"** (`ACT.solicitarMasCandidatos(db,vacId,multiposting)`
  → `v.historial`+notifica; checkbox Multiposting; CTA grande si el pool queda vacío). **Bandas de ranking**
  (`bandCol` + divisores): ≥90 ideales (verde `--ok`), 70–89 adecuados (verde claro `#3E9B5F`), <70 adicionales
  (café `#8B5E34`/gris). Defaults: `f.favoritosCands/categorias=[]`, `v.archivados=[]`.
- **Entrevistas, selección y oferta (Batch 3 · plan FORMADOR-ADMIN):** máximo **3 candidatos** a la vez
  en "Ranking y terna" para invitar a entrevista (botón deshabilitado + chip de límite). **Exclusividad de
  horarios**: helper `slotTomado(v,slot,cid)`; `ACT.confirmarSlot` rechaza slots tomados (notifica al candidato)
  y en la pantalla del candidato los slots confirmados por otros aparecen deshabilitados con "No disponible"
  (`ACT.simular` elige el primer slot libre). `ACT.registrarEntrevista` guarda **`p.entrevista.calificacion`**
  (1–10 estrellas, obligatoria en `EntrevistaModal`, formato `8/10 ⭐` arriba a la derecha del resumen; NO
  visible para el candidato). La tab Entrevistas usa `entrevistasHist` (incluye `descartado` con `p.entrevista`
  → historial conservado con su chip). Popup de selección: "Estás por elegir al candidato {nombre}, con ranking
  #{posición}…" (posición por `matchFinal`). Helper **`candidatoElegido(v)`** (seleccionado/docs_completos/
  oferta_enviada y no cerrada) → chip **"Candidato elegido"** en vez de "Búsqueda activa" en `FormadorHome`,
  `VacanteDetail` y listado del Admin. `OfertaTool` acepta **"Otra fecha"** (`input type="date"` libre) además
  de las quincenas. Textos de aceptación del candidato actualizados (título dinámico) y la bienvenida del
  contratado muestra **nombre, correo y teléfono del formador** (`correoFormador`/`telFormador`, deterministas,
  dominio `@elektra.com.mx`).
- **Resaltado de coincidencias:** el candidato ve en verde (chip `ok` con ✓) sus habilidades/herramientas/
  especialidades que coinciden con el descriptivo en `DetalleVacanteModal`; el formador ve en verde las
  del candidato que coinciden con la vacante en `PerfilModal` (prop `req`).

## Sistema de diseño (tokens)

Toda la identidad visual está en variables CSS dentro del banner `ESTILOS`, bloque `:root`.
Cambiar un token afecta toda la app. Principales:

- `--ink #1A1A1A`, sidebar `#161616` (carbón/negro)
- `--gold #FFB81C` + `--gold-dark #8A6400` (dorado de marca / acciones principales)
- `--bg #F6F5F1` (fondo hueso), `--paper #FFFFFF`, `--line`, `--gray`
- `--ai #4338CA` (índigo) — **reservado EXCLUSIVAMENTE para elementos de IA**
- `--ok #1E7A3C` (éxito), `--bad #B3261E` (error/descarte)

> Futuro: se explorarán **variantes de diseño** (moderno, minimalista, oscuro, ultracorporativo…)
> que el cliente pueda visualizar en vivo. La base ideal para ello son estos tokens.

## Comandos

```bash
npm install       # instalar dependencias (solo la primera vez)
npm run dev       # servidor de desarrollo con recarga en vivo (usar al trabajar)
npm run build     # compilar versión de producción
npm run preview   # previsualizar la versión compilada
```

## Convenciones y reglas

- **UI 100% en español de México**, tono institucional. Nada de texto en inglés visible al usuario.
- Mantener el **índigo `--ai` solo para IA**; dorado para acciones/marca; verde/rojo para estados.
- Mantener el **determinismo** del motor de match (no usar aleatoriedad real en scoring).
- Mutar estado **solo vía `run(...)`**; agregar acciones nuevas dentro del objeto `ACT`.
- Al agregar componentes, seguir el estilo existente (clases CSS ya definidas, íconos lucide).
- Después de un cambio no trivial, verificar que `npm run dev` corra **sin errores ni warnings**.

## Estado y limitaciones actuales

- No hay persistencia: al recargar se pierden los cambios de datos (es esperado en esta fase).
- No hay pruebas automatizadas ni backend.
- Todo en un solo archivo (ver "Arquitectura actual").

## Roadmap (etapas futuras acordadas)

1. **Prototipo funcional** para validación (etapa actual: cambios de función y diseño).
2. **Variantes de diseño en vivo** para presentar al cliente (definir + implementar).
3. **Conexión a base de datos** (sustituir el estado en memoria por una API/BD real).
4. **Claude Design** (posible sistema de diseño sincronizado) — a evaluar más adelante.

## Cómo pedir cambios (para máxima precisión)

Al solicitar un ajuste, indicar: **(1) dónde** (rol + pantalla/tab), **(2) qué hace hoy vs. qué se
quiere**, **(3) tipo** (diseño / lógica / ambos), **(4) referencia** opcional (color, captura).
Los cambios grandes se planifican **por batches** antes de aplicarlos.
