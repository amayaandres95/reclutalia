# PLAN DE CAMBIOS — Header móvil, Chatbot 2.0 y Landing Page

Plan por batches, **modo ejecución directa optimizada en tokens**. Un batch por turno, en orden.
Marcar ✅ al terminar cada batch (editar este archivo).

**Estado:** Batch 1 ✅ · Batch 2 ✅ · Batch 3 ⬜

> Ejecutar DESPUÉS de terminar `PLAN-CAMBIOS-FORMADOR-ADMIN.md` (el Batch 2 de este plan
> referencia las 3 fases del proceso que introduce aquel plan en su Batch 4).

---

## Reglas generales (modo optimizado — aplican a TODOS los batches)

1. Leer `CLAUDE.md`. Ubicar código con **Grep por banners** y leer SOLO las secciones necesarias.
2. **Ejecutar directo**: sin modo plan, sin `npm run dev`, sin pruebas en navegador.
3. **Auto-checklist**: mutaciones vía `run(...)`; acciones nuevas en `ACT`; defaults en semilla
   para campos nuevos; íconos lucide importados; textos 100% español MX; referencias existentes.
4. **Gate de errores único**: `npx vite build --logLevel error` al final (en el Batch 3 este
   comando valida también la configuración multi-página). Si falla, corregir y repetir.
5. Actualizar `CLAUDE.md` (breve) y marcar ✅ aquí.
6. **Cierre ultra breve** (máx ~8 líneas) + pregunta única "¿Commit y push?" con mensaje sugerido.
7. Ambigüedades menores: aplicar el criterio más simple y anotarlo en 1 línea, sin preguntar.
8. **Skill de diseño disponible:** `ui-ux-pro-max` (en `.claude/skills/`). Consultarla en los
   batches con trabajo visual (1 y 3 sobre todo; 2 para el UI del chat). Usar solo la guía del
   documento — sus scripts Python NO están instalados.

---

## BATCH 1 — Header móvil con menú hamburguesa ✅

(Punto 1.) Solo aplica en viewport móvil (usar el breakpoint existente ~900px).

**1.1 Header compacto.** En móvil, ocultar el nombre y puesto del usuario en el `topbar`;
dejar solo el círculo con iniciales/foto (`Avatar`). En desktop no cambia nada.

**1.2 Avatar clickeable (candidato).** Si el rol es candidato, tocar el avatar abre su
`PerfilEditor` (ya existe ese comportamiento en desktop — asegurarlo en móvil).

**1.3 Menú hamburguesa.** Botón hamburguesa (icono Menu) visible solo en móvil (donde hoy el
sidebar está oculto con `display:none`). Abre un **drawer lateral** (panel deslizante con
overlay oscuro, cierre con ✕ o tocando fuera) que replica el contenido del sidebar:
- Logo Reclutalia.
- Los `NavItem` del rol activo (navegan y cierran el drawer).
- El bloque "VISTA DEMO — CAMBIAR ROL" completo (selector de rol + selector de persona).
- Contador de notificaciones visible en su item.
Transición CSS suave (translateX). No duplicar lógica: reutilizar los mismos NavItem/selects
del sidebar (extraer a un componente compartido si simplifica).

**Commit:** `Móvil: header compacto con avatar y menú hamburguesa tipo drawer`

---

## BATCH 2 — Chatbot 2.0: FAQ contextual + chat directo ✅

(Puntos 2.1 y 2.2.) Todo sobre el componente existente `BotSoporte`.

**2.1 Preguntas predefinidas contextuales.**
- Reemplazar el `BOT_FAQ` fijo por un catálogo **por rol y por paso** del proceso. El bot
  recibe el contexto actual (rol + vista/estado) y muestra las preguntas de ese momento.
- **Candidato:** un set por estado de su pipeline (sin proceso/buscando vacantes, invitado,
  postulado/docs de filtros, video-IA, esperando horario, entrevista agendada, seleccionado/
  documentación, oferta recibida, contratado, descartado). **Formador:** un set por fase/tab
  (descriptivo, pool de talento, ranking y terna, entrevistas, selección y documentos, carta
  oferta, contratación, home/notificaciones). **Admin:** por vista (vacantes, nueva vacante,
  pool de candidatos, cambios solicitados).
- **Generar tanto preguntas como respuestas** (mín 1, máx 5 por paso), coherentes con cómo
  funciona realmente el prototipo (usar el conocimiento de CLAUDE.md; tono institucional MX).
- Opción extra SIEMPRE disponible al final: **"Conectar con soporte"** → respuesta simulada:
  están transfiriéndolo con un representante de soporte especializado (+ mensaje de espera).

**2.2 Pestaña de chat directo (persona a persona).**
- El panel del bot ahora tiene 2 pestañas: **"Asistente"** (lo anterior) y **"Mensajes"**
  (chat abierto entre participantes del proceso).
- Reglas de disponibilidad de contactos:
  - **Candidato → Formador**: disponible desde que el candidato es invitado a entrevista
    (estados `slots_enviados` en adelante), un hilo por vacante con ese formador.
  - **Formador → Candidato**: disponible desde que invita al candidato a entrevistar.
  - **Admin → Formador**: solo formadores relacionados a las vacantes que administra/ve.
- Si no hay contactos disponibles aún, estado vacío explicando cuándo se habilitará.
- **Chat abierto real dentro del demo**: los mensajes se guardan en `db.chats`
  (`[{id, vacId, participantes:[{tipo,id}], mensajes:[{de, texto, fecha}]}]`) vía `run(...)`.
  Como el demo permite cambiar de rol, al cambiar de rol se puede responder de verdad —
  esto hace la simulación creíble sin backend. Burbujas estilo chat (mías a la derecha),
  input + botón enviar, y contador de no leídos opcional (simple).
- Sin IA aquí: es texto libre entre personas, sin respuestas automáticas.

**Commit:** `Chatbot: FAQ contextual por rol y paso, conectar con soporte y chat directo entre participantes`

---

## BATCH 3 — Landing page promocional ⬜

(Punto 3.) **Página NUEVA, separada de la plataforma** — no tocar `App.jsx` salvo nada.

### 3.A Infraestructura (multi-página Vite)

- Crear `landing.html` en la raíz de la app (junto a `index.html`) → monta `src/landing/main.jsx`
  → componente `src/landing/Landing.jsx` (+ CSS propio, mismo patrón de CSS-en-string o archivo
  `.css` importado — decidir lo más limpio).
- Crear `vite.config.js` con `build.rollupOptions.input` incluyendo ambos HTML
  (`index.html` y `landing.html`). Ojo: el proyecto es ESM — usar
  `fileURLToPath(new URL(...))` para las rutas, no `__dirname`.
- Crear `vercel.json` (en esta carpeta, que es el Root Directory de Vercel) con
  `{ "cleanUrls": true }` para que la página viva en **`/landing`**.
- URL final: `reclutalia.vercel.app/landing`. La plataforma queda intacta en `/`.
- El gate `npx vite build --logLevel error` debe compilar AMBAS entradas sin error.

### 3.B Contenido y secciones (en este orden)

1. **Header** fijo: logo Reclutalia (cuadro dorado "R" + wordmark) + menú hamburguesa con
   anclas a las secciones y un CTA "Ingresar a la plataforma".
2. **Hero**: el nuevo proceso de reclutamiento **autónomo y auto-gestionable** — headline
   potente, subtítulo, CTA primario (abre el login simulado) y CTA secundario (scroll a
   beneficios). Elemento visual dinámico (composición CSS/SVG animada, no imágenes externas).
3. **Beneficios principales**: las **3 etapas para cubrir tus vacantes — Búsqueda, Selección
   y Contratación** (cards con textos descriptivos resumidos generados del conocimiento real
   del proceso) + el **chatbot transversal de soporte** que guía todo el proceso y la facilidad
   de **contactar directamente a los involucrados** para resolver dudas y coordinarse.
4. **Paso 1 · Búsqueda**: revisar y solicitar cambios al descriptivo con facilidad; el nuevo
   **pool de talento tipo marketplace** de candidatos rankeados, fáciles de explorar, filtrar
   y organizar (mencionar las herramientas del formador: filtros por habilidades, favoritos,
   categorías, archivado, revisión rápida de perfiles e invitación directa); la **IA que
   filtra por historiales y realiza entrevistas autónomas** para validar perfiles; y cómo
   funcionan los **rankings** (bandas: ideales ≥90%, adecuados 70–89%, adicionales <70%).
5. **Paso 2 · Selección**: visualiza a tus **top candidatos** según entrevistas con IA, CV y
   filtros de buró/empleos previos; **entrevistas agendadas en la plataforma** vinculadas a
   Outlook/Teams con IA que toma notas y facilita feedback y decisión; selección sencilla del
   ideal con **recordatorios automáticos** al candidato para subir documentos.
6. **Paso 3 · Contratación**: **cartas oferta** generadas desde el tabulador de la vacante,
   agendando día de entrada y ubicación de presentación del primer día; confirmación con
   correos habilitados, **kit de inducción y guía de bienvenida**; la firma del contrato es
   directa en la ubicación el primer día de trabajo.
7. **Chatbot transversal**: te guía paso a paso, resuelve dudas generales al momento, te
   vincula con personal de soporte, **mantiene historial** de conversaciones y solicitudes; y
   permite **contactar directamente a las personas del proceso**, eliminando la triangulación
   y agilizando respuestas.
8. **CTA final**: mensaje inspirador + botón para ingresar → abre **login simulado** (modal o
   pantalla): campos número de empleado y contraseña (NO validan nada, cualquier valor
   redirige a `/`) + botón **"Ingresar con cuenta Microsoft"** (redirige directo a `/` sin
   simular login). Footer simple con logo y nota de prototipo.

### 3.C Dirección de diseño (mejores prácticas — aplicar TODAS)

> **Skill obligatoria:** antes de escribir la landing, invocar la skill **`ui-ux-pro-max`**
> (instalada en `.claude/skills/ui-ux-pro-max/SKILL.md`). Usar SOLO las secciones de guía del
> documento (Quick Reference §1–§10, Common Rules, Pre-Delivery Checklist) — los scripts
> Python/CSV NO están instalados, no intentar ejecutarlos. Aplicar en especial: §1
> Accesibilidad, §4 Style Selection, §5 Layout & Responsive, §6 Tipografía/Color y §7
> Animación (duraciones 150–300ms, ease-out al entrar, reveal con stagger 30–50ms,
> `prefers-reduced-motion`). Al final, pasar el Pre-Delivery Checklist adaptado a web.

- **Menos corporativo, más dinámico**: mantener el ADN de marca (dorado `#FFB81C`, carbón
  `#1A1A1A`, índigo `#4338CA` solo para lo de IA) pero con libertad: fondos oscuros dramáticos
  alternados con claros, gradientes sutiles del dorado, tipografía display grande y con
  carácter para headlines (puede ser una serif/display vía system stack o Google Fonts
  autoalojada NO — usar stacks del sistema con peso/tracking bien trabajados para no depender
  de red), jerarquía tipográfica clara (headline → sub → cuerpo).
- **Anti "estética genérica de IA"**: nada de gradientes morados sobre blanco, ni layouts de
  plantilla; composición propia, acentos asimétricos, detalles de marca (la "R" dorada como
  motivo gráfico).
- **Movimiento**: micro-animaciones CSS (hover en cards/CTAs), reveal-on-scroll con
  `IntersectionObserver` (fade/slide sutiles), algún elemento flotante/parallax ligero en el
  hero. Todo CSS/JS propio, sin librerías nuevas.
- **Responsive impecable**: mobile-first, secciones que apilan bien, CTA siempre alcanzable,
  hamburguesa funcional en móvil.
- **Accesibilidad y pulido**: contraste AA, estados focus visibles, `alt`/aria en lo
  interactivo, espaciado generoso y consistente (escala de spacing), sin scroll horizontal.
- Íconos: lucide-react (ya disponible). Ilustraciones: composiciones CSS/SVG inline (mockups
  estilizados de la UI real — cards de candidatos con rings de ranking, barra de 3 fases,
  burbuja del chatbot — dibujados como elementos decorativos, no screenshots).

**Commit:** `Landing page promocional en /landing con login simulado (entrada Vite separada)`
