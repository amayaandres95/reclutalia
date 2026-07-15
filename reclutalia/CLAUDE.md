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
| `COMPONENTES BASE` | `Modal`, `Chip`, `MatchRing`, `Avatar`, `JourneyBar`, `MiniPipe`, `EstadoChip` |
| `BOT DE APOYO` | Bot flotante FAQ (transversal) |
| `PERFIL DE CANDIDATO` | `PerfilModal` |
| `SUBIDA DE ARCHIVO` | `UploadPDF` (valida solo PDF, máx 1 MB) |
| `FORMULARIO ESTANDARIZADO DE VACANTE` | `VacanteForm` (wizard de 4 pasos) |
| `PANEL DEL FORMADOR` | `VacanteDetail`, `FormadorHome`, `NotifList`, modales invitar/agendar/entrevista/oferta, `Celebracion` |
| `PANEL DEL CANDIDATO` | `CandidatoHome`, `VideoIAModal`, `PostulacionForm` |
| `PANEL DE ADMIN` | `AdminPanel`, `CandidatoForm` |
| `APP` | Componente raíz: shell, sidebar, cambio de rol demo, ruteo por estado |

## Conceptos clave

- **Estado global:** un objeto `db` (`{ candidatos, vacantes, formadores, notifs }`) en `useState`
  dentro de `App`. **Toda mutación pasa por `run(fn)`**, que hace `structuredClone(db)`, aplica
  `fn(nuevaDb)` y re-renderiza. Nunca mutar `db` directamente.
- **Lógica de negocio:** el objeto **`ACT`** concentra todas las acciones (crear/editar/aprobar
  vacante, invitar, postular, video-IA, agendar, entrevistar, seleccionar, oferta, contratar).
  Cada acción también emite notificaciones vía `notify(...)`.
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
