# PLAN DE CAMBIOS — Formador y Administrador

Plan por batches, **modo ejecución directa optimizada en tokens**. Un batch por turno, en orden.
Marcar ✅ al terminar cada batch (editar este archivo).

**Estado:** Batch 1 ✅ · Batch 2 ✅ · Batch 3 ⬜ · Batch 4 ⬜ · Batch 5 ⬜ · Batch 6 ⬜

---

## Reglas generales (modo optimizado — aplican a TODOS los batches)

1. Leer `CLAUDE.md`. Ubicar código con **Grep por banners** `/* ===== ... ===== */` y leer SOLO
   las secciones necesarias — no releer el archivo completo.
2. **Ejecutar directo**: sin modo plan, sin `npm run dev`, sin pruebas en navegador.
3. **Auto-checklist antes de terminar** (revisión propia del código, sin correr nada):
   - Mutaciones solo vía `run(...)`; acciones nuevas dentro de `ACT`.
   - Campos nuevos con **defaults en datos semilla / `mkReq`** para que nada existente truene.
   - Arrays del candidato (`esp/hard/soft`) y estados `PIPE_IDX` intactos; match determinista.
   - Íconos lucide usados = importados. Textos 100% español MX. Sin variables muertas.
   - Verificar que cada componente/función referenciada exista (cuidado con renombres).
4. **Gate de errores único y barato**: al final correr `npx vite build --logLevel error`
   (segundos, salida mínima). Si falla, corregir y repetir. NO levantar servidor dev.
5. Actualizar `CLAUDE.md` (solo lo esencial: componentes/campos/acciones nuevas) y marcar ✅ aquí.
6. **Cierre ultra breve**: máximo ~8 líneas de resumen (qué cambió, sin código) + la pregunta
   "¿Commit y push?" con el mensaje sugerido del batch. Nada más.
7. Si un punto es ambiguo, aplicar el criterio más simple consistente con el prototipo y
   anotarlo en 1 línea del resumen — no preguntar a mitad de batch.

### Decisiones ya tomadas (no re-decidir)

- **Archivar candidato** = por vacante (`v.archivados[]` de cids; se oculta del pool de esa
  vacante; agregar toggle discreto "Ver archivados (n)" para restaurar).
- **Favoritos y categorías de candidatos** = globales por formador
  (`f.favoritosCands[]`, `f.categorias = [{nombre, cids:[]}]`).
- **"Candidato elegido" (F10)** = se deriva del pipeline (existe candidato en
  `seleccionado`/`docs_completos`/`oferta_enviada` y la vacante no está `cerrada`), sin crear
  un nuevo `v.estado`.
- **Barra de 3 fases (F13)** reemplaza a `JourneyBar` en las vistas del formador; el candidato
  conserva `MiniPipe`; el admin usa la versión compacta de 3 fases (A1). Si `JourneyBar` queda
  sin uso, eliminarla junto con `JOURNEY`/`etapaVacante` si ya nadie los usa.
- **Textos con título de vacante** (F12): siempre dinámicos (`v.req.titulo`), nunca hardcodear
  "Ejecutivo de Ventas Digitales".
- **Nuevos campos de vacante NO afectan `matchScore`**, con una excepción: si
  `ubicacionNoRelevante` está activo, el componente de distancia otorga puntaje completo
  (determinista).

---

## BATCH 1 — Pool de talento del formador ✅

(Puntos F1, F2, F3, F14.) Todo en la tab "Pool de talento" de `VacanteDetail` + flujo de aprobación.

**1.1 Acciones por candidato (F1.1–F1.4).** En cada tarjeta (`.trow`) del pool, botones de icono
pequeños (estilo consistente con los existentes):
- **Archivar** (icono Archive o similar): oculta al candidato del pool de esta vacante
  (`v.archivados[]`). Toggle "Ver archivados (n)" para listarlos y restaurar.
- **Categorizar** (icono FolderPlus/Bookmark): popover o modal con las categorías del formador
  (checklist para agregar/quitar) + input "Crear nueva categoría". Persistir en `f.categorias`.
- **Favorito** (icono corazón, estado activado/desactivado): toggle en `f.favoritosCands[]`.
- **Compartir** (icono Share2): modal con input "Nombre o número de empleado del formador" →
  al enviar solo toast de confirmación (SIMULADO, sin funcionalidad real).

**1.2 Filtros del pool (F1.5).** Botón "Filtrar" que despliega panel con:
- Checklist de **habilidades y herramientas de la vacante visible** (`req.hardSkills` +
  `req.softSkills`): activar/desactivar; el pool se filtra a candidatos que tengan las activas.
- **Años de experiencia** (mínimo, select numérico), **nivel de estudios** (select sobre
  `EDUCACION`), y **tipo**: Internos / Externos / Ambos (default Ambos).
- Contador de resultados y botón "Limpiar filtros".

**1.3 "Solicitar más candidatos" (F2).** Botón visible en el pool; cuando el pool tiene 0
compatibles, mostrarlo GRANDE como CTA central del estado vacío. Al click → popup de
confirmación: al continuar, un grupo de reclutadores iniciará la búsqueda de talento para
proponer candidatos viables en un plazo de **5 a 10 días hábiles**. Incluir checkbox
**"Habilitar Multiposting"** (publica automáticamente la vacante en plataformas de terceros —
SIMULADO). Al confirmar: registrar en `v.historial` + toast. Sin lógica real.

**1.4 Animación de búsqueda IA al aprobar (F3).** Al aprobar el descriptivo: overlay de
**5 segundos** simulando que la IA busca en el pool (spinner/pulso en índigo `--ai`, 2–3
mensajes rotando tipo "Analizando el marketplace…", "Comparando habilidades y experiencia…",
"Generando ranking…"). Al terminar, ejecutar `ACT.aprobarVacante` y aterrizar en la tab Pool.

**1.5 Divisores por banda de ranking (F14).** Pool ordenado por match, con divisores:
- **≥ 90%** → "Candidatos ideales" — divisor verde fuerte (`--ok`).
- **70–89%** → "Candidatos adecuados" — divisor verde claro; el `MatchRing` de esta banda
  (borde + número) en verde claro.
- **< 70%** → "Candidatos adicionales" — divisor café; `MatchRing` café para 50–69% y gris
  para < 50%.
Ajustar la lógica de color de `MatchRing` a estas bandas (definir tonos armónicos con los
tokens; café puede ser un marrón tipo `#8B5E34`). Solo mostrar divisores con candidatos en la banda.

**Commit:** `Formador: acciones y filtros en pool, solicitar más candidatos, animación IA y bandas de ranking`

---

## BATCH 2 — Ficha de candidato enriquecida ✅

(Punto F9.) Requiere Batch 1 (reusa archivar/categorizar/favorito).

**2.1 `PerfilModal` enriquecido.** Agregar:
- **Título** del candidato (el que él mismo puso, `c.puesto`) destacado bajo el nombre.
- **Descripción** = `c.resumen` (la de su perfil).
- **Interés actual** (`c.intereses`) como chip(s).
- **Experiencia** (`c.experiencia[]`): bullets "Puesto — Empresa (mes/año inicio – fin)",
  máximo 3 visibles + botón "Ver más" si hay más registros.
- **Educación** (`c.educacion[]`): mismo patrón, máximo 3 + "Ver más".

**2.2 Acciones en el modal.** Cuando lo abre el formador: botones Archivar / Categorizar /
Favorito (reusar exactamente las acciones y estado del Batch 1).

**2.3 Datos semilla.** Llenar por completo los perfiles de **Valeria Ortiz Camacho (id 1)** y
**Jorge Luis Peña Ríos (id 2)** con `experiencia[]`, `educacion[]` e `intereses[]` simulados y
creíbles (si id 1 ya tiene datos de un batch anterior, completarlos/asegurarlos).

**Commit:** `Formador: ficha de candidato con experiencia, educación, título e intereses + semilla`

---

## BATCH 3 — Entrevistas, selección y oferta ⬜

(Puntos F4, F5, F6, F7, F8, F10, F11, F12.)

**3.1 Límite y exclusividad de horarios (F4).** En "Ranking y terna": máximo **3 candidatos**
seleccionables a la vez para invitar a entrevista (bloquear el 4º con ayuda visual). Cuando un
candidato confirma un horario, ese slot queda **tomado para esa vacante**: en la pantalla del
candidato los slots ya confirmados por otros aparecen deshabilitados con leyenda
"No disponible" (validar también en `ACT.confirmarSlot`).

**3.2 Texto de entrevista en curso (F5).** Cambiar "La IA está tomando notas… agrega las
tuyas" → **"La IA resumirá la reunión, agrega tus propias notas aquí:"**.

**3.3 Calificación con estrellas (F6).** En la pantalla de feedback (fase resumen de
`EntrevistaModal`): selector de **1 a 10 estrellas** (`p.entrevista.calificacion`). Se muestra
en la caja de resumen de la entrevista del candidato, arriba a la derecha, formato `8/10 ⭐`.
NO visible para el candidato.

**3.4 Conservar historial de entrevistas (F7).** Al seleccionar al candidato ideal, los demás
entrevistados pasan a `descartado` pero su entrevista (resumen, feedback, calificación) **sigue
visible** en la tab Entrevistas (con su chip de estado). Ajustar los filtros de listado para
incluir descartados que tengan `p.entrevista`.

**3.5 Texto del popup de selección (F8).** "Estás por elegir al candidato **{nombre}**, con
ranking **#{posición}**, como candidato ideal…" — posición = lugar (1-based) en la lista de
evaluados ordenada por match final. El resto del texto igual.

**3.6 Chip "Candidato elegido" (F10).** Cuando la vacante tiene candidato en
`seleccionado`/`docs_completos`/`oferta_enviada` (y no está `cerrada`), el chip de estado dice
**"Candidato elegido"** en vez de "Búsqueda activa" — en `FormadorHome`, `VacanteDetail` y el
listado del Admin.

**3.7 "Otra fecha" en carta oferta (F11).** En `OfertaTool`, además de las fechas de quincena,
opción **"Otra fecha"** que muestra un `input type="date"` para elegir la fecha de ingreso libre.

**3.8 Textos de aceptación del candidato (F12).**
- Botón: "Aceptar oferta y firmar" → **"Aceptar oferta y fecha de ingreso"**.
- Título del popup: **"Aceptar oferta y fecha de contratación"**.
- Cuerpo: "Al confirmar, aceptas la carta oferta de "{título de la vacante}", generando tu
  contrato para firmar el mismo día de tu fecha de ingreso. El formador recibirá tu
  confirmación con la fecha de ingreso." (título SIEMPRE dinámico).
- Botón de confirmación: **"Acepto mi oferta y fecha de ingreso"**.
- En la pantalla de bienvenida del candidato (contratado): mostrar **nombre del formador, su
  correo y teléfono** simulados — correo `nombre.apellido@elektra.com.mx` derivado del nombre,
  teléfono `+52 55 ...` determinista.

**Commit:** `Formador: límites de entrevista, estrellas, historial, candidato elegido, otra fecha y textos de oferta`

---

## BATCH 4 — Barra de proceso de 3 fases ⬜

(Punto F13 + Admin A1.)

**4.1 Nuevo componente `FasesBar`.** 3 fases con sub-pasos que se palomean en verde (✓) al
completarse:

| Fase | Sub-pasos (tabs existentes) |
|---|---|
| **1 · Búsqueda** | Descriptivo · Pool de talento |
| **2 · Selección** | Ranking y terna · Entrevistas · Selección y documentos |
| **3 · Contratación** | Carta oferta · Contratación |

- Crear `faseVacante(v)` → `{fase, subpaso, completados[]}` derivado del pipeline/estado
  (criterios: descriptivo completo al aprobar; pool al haber invitados; ranking al haber
  evaluados; entrevistas al haber entrevistados; selección al elegir ideal + docs; oferta al
  enviarse/aceptarse; contratación al firmar).
- UI muy intuitiva: fase actual resaltada, sub-pasos con ✓ verde al completarse, versión
  completa (detalle) y compacta (listados).
- **Reemplaza `JourneyBar`** en `FormadorHome` y `VacanteDetail`. Integrar las tabs de
  `VacanteDetail` visualmente agrupadas bajo las 3 fases. El candidato conserva `MiniPipe`.
  Si `JourneyBar`/`JOURNEY`/`etapaVacante` quedan sin uso, eliminarlos.

**4.2 Admin (A1).** En su listado de vacantes mostrar en qué paso va cada vacante:
"Etapa {1-3} · {sub-paso actual}" usando la `FasesBar` compacta o texto + chip.

**Commit:** `Proceso en 3 fases con sub-pasos palomeados para formador y admin`

---

## BATCH 5 — Formulario de vacante del admin ⬜

(Puntos A2, A3, A4, A5, A6, A7.) Todo en `VacanteForm` (+ `mkReq` + `VistaDescriptivo`).

**5.1 Nuevos campos (A2–A5).** Agregar a `mkReq` con defaults y al wizard:
- **Tipo de sede** (tras Ubicación del trabajo): select Corporativo / Sucursal → al elegir,
  select **"Sede"** con 5 opciones fijas simuladas (mismas siempre).
- **Unidad de Negocio**: texto abierto.
- **Tipo de vacante**: una sola opción entre **Estándar / Preventiva / Proactiva /
  Confidencial** (select o tags de opción única).
- Checkbox **"Puede ser superior"** debajo de Nivel de estudios.
- Checkbox **"Ubicación no relevante"** en Radio de búsqueda (deshabilita ciudad/radio; ver
  regla de match en Decisiones).
- Checkbox **"No relevante"** en Años de experiencia mínimos (deshabilita el número).
- **Rango de edad preferida**: campos mínimo y máximo + checkbox **"Edad no relevante"**
  (la edad NO entra al matchScore).
- Mostrar todos los campos nuevos en `VistaDescriptivo` (y en el detalle que ve el candidato
  solo si aplica; el tipo Confidencial puede indicarse con un chip al admin/formador).

**5.2 Agregar nuevas opciones (A6).** Verificar que TODOS los multi-selects (especialidades,
hard skills, soft skills, aptitudes) tengan habilitado `addNew` para simular agregar opciones.

**5.3 Validación por sección (A7).** En el wizard, el botón "Siguiente" queda deshabilitado
hasta completar los campos obligatorios de la sección actual, mostrando qué falta. Definir
obligatorios razonables por sección; los checkboxes "no relevante" cuentan como campo
satisfecho. La validación final del guardado se mantiene.

**Commit:** `Admin: nuevos campos de vacante (sede, unidad, tipo, edad, no-relevantes) y validación por sección`

---

## BATCH 6 — Solicitud de cambios por campo ⬜

(Punto F15 + Admin A8.) Requiere Batch 5 (los campos nuevos también deben soportar esto).

**6.1 Lado formador.** En `VistaDescriptivo`, "Solicitar cambios" ya no es un textarea general:
cada campo del descriptivo (incluidos TODOS los del Batch 5) tiene una acción (icono lápiz)
para anotar el cambio solicitado en ese campo. Se acumulan y se envían juntos.
`v.cambios` pasa de string a objeto `{campo: anotación}` (mantener compatibilidad si hay
datos viejos: string → mostrar como anotación general).

**6.2 Lado admin.** Al editar un descriptivo con cambios solicitados: cada campo con solicitud
se resalta (color de alerta + icono AlertCircle) con la anotación visible junto al campo. Por
cada campo el admin puede **aplicar el cambio** (editando el campo) o **"Rechazar cambio"**
(botón que lo marca rechazado sin editar).

**6.3 Historial y notificaciones.** Al guardar y reenviar: `v.historial` registra qué campos
se cambiaron y cuáles se rechazaron (ej. "Cambios aplicados: salario, horario · Rechazados:
radio de búsqueda"). Notificación al formador con ese resumen. Los estados de vacante
(`asignada`/`cambios`) y el flujo `ACT.solicitarCambios`/`ACT.editarVacante` se adaptan sin
romper el resto del proceso.

**Commit:** `Solicitud de cambios por campo con aceptar/rechazar del admin e historial detallado`
