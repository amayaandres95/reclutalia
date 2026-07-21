# PLAN DE CAMBIOS — "Radar de Candidatos" (Formador v2)

Plan por batches, **modo ejecución directa optimizada en tokens**. Un batch por turno, en orden.
Marcar ✅ al terminar cada batch (editar este archivo).

**Estado:** Batch 1 ⬜ · Batch 2 ⬜ · Batch 3 ⬜ · Batch 4 ⬜ · Batch 5 ⬜ · Batch 6 ⬜

---

## Reglas generales (idénticas a los planes anteriores — modo optimizado)

1. Leer `CLAUDE.md`. Grep por banners; leer SOLO las secciones necesarias.
2. Ejecutar directo: sin modo plan, sin `npm run dev`, sin navegador.
3. Auto-checklist: `run(...)`/`ACT`; defaults en semilla/`mkReq`; arrays y `PIPE_IDX` sanos;
   íconos lucide importados; español MX; referencias existentes.
4. Gate único: `npx vite build --logLevel error` al final. Corregir y repetir si falla.
5. Actualizar `CLAUDE.md` (breve) y marcar ✅ aquí.
6. Cierre ultra breve (~8 líneas) + "¿Commit y push?" con el mensaje sugerido.
7. Ambigüedades menores: criterio más simple + 1 línea de nota.
8. Skill `ui-ux-pro-max` disponible para decisiones visuales (batches 1, 4, 5 y 6).
9. **RESPONSIVE OBLIGATORIO:** todo elemento nuevo o modificado debe adaptarse al breakpoint
   móvil existente (≤900px) en el MISMO batch — no dejarlo para después. Criterios: nada de
   scroll horizontal; grids de 2+ columnas colapsan a 1 (o 2x2 en métricas); chips y filas de
   botones hacen wrap; modales a ancho completo con scroll interno; touch targets ≥44px;
   textos legibles ≥14px. Al cerrar cada batch, confirmar en 1 línea del resumen que se
   revisó móvil.

### Decisiones ya tomadas (no re-decidir)

- **Rebranding (P1):** "Radar de Candidatos" aplica a TODO el texto visible de la app
  (sidebar, títulos, topbar, notificaciones, bot, landing). El logo: mismo cuadro dorado pero
  con el icono `Radar` de lucide (o un radar SVG propio con barrido animado sutil) en lugar de
  la "R". El wordmark del sidebar: **Radar** / subtítulo "DE CANDIDATOS". NO renombrar
  archivos, repo, ni identificadores internos del código.
- **Vacantes semilla (P4):** V-1042 → **Cajero Supervisor** (la vacante demo asignada) y
  V-1035 → **Desarrollador Frontend**. La tercera (V-1038) se conserva.
- **Sueldo único (P6):** nuevo `req.sueldo` (valor mensual único que se MUESTRA en el
  descriptivo). `salarioMin/Max` se conservan internamente para la banda de la carta oferta.
  Default semilla: punto medio del rango redondeado.
- **Días activa (P2):** agregar `v.creadaTs` (timestamp) a las semillas para calcular
  "X días activa"; `v.creada` (string) puede conservarse donde no estorbe.
- **Killer questions (P6h):** se eliminan COMPLETAS del sistema — descriptivo del formador,
  wizard del admin, postulación del candidato (`KillerPreguntas`/su uso en `PostulacionForm` y
  `AplicarModal`) y datos semilla. `ACT.aplicar`/`postularDirecto` quedan sin el parámetro de
  killers (postulación siempre procede).
- **Nuevo flujo de contratación (P18):** `ACT.aceptarOferta` YA NO cierra la vacante ni asigna
  número de empleado → deja al candidato en `oferta_aceptada` (paso "Apertura de cuenta").
  Nueva acción **`ACT.firmarContrato(db, vacId, cid)`** (la ejecuta el formador) → `contratado`,
  genera número de empleado, correo corporativo `{numEmpleado}@elektra.com.mx`, accesos Okta,
  cierra la vacante y notifica a ambos. Ajustar `ACT.simular` y las etiquetas de `PIPE` a los
  nuevos pasos.

---

## BATCH 1 — Rebranding y home del formador ⬜

(Puntos 1, 2, 3, 5.)

**1.1 Rebranding (P1).** Renombrar "Reclutalia" → **"Radar de Candidatos"** en todo texto
visible (app y landing). Logo: cuadro dorado con icono de radar (ver Decisiones). Actualizar
`<title>` de ambos html y el texto del bot ("Asistente Radar" o similar).

**1.2 Días activa (P2).** En las tarjetas de vacante del home: reemplazar "Creada {fecha}" por
un chip redondeado con icono `Clock`: **"{n} días activa"** (calculado desde `v.creadaTs`;
0 días = "Hoy"). Agregar el MISMO chip a la caja de resumen de la vacante en `VacanteDetail`,
lado superior derecho.

**1.3 Histórico de completadas (P3).** En los stats del home del formador: sustituir la caja
"Notificaciones sin leer" por **"Vacantes completadas"** (conteo de `cerrada` del formador).
Al hacer clic, hace scroll/filtra para ver sus vacantes cerradas (histórico).

**1.4 Timeline de 3 fases en tarjetas (P5).** En las tarjetas del home, las 3 fases se ven
como **línea de tiempo conectada** (nodos unidos por línea continua, la completada en verde,
la actual resaltada) ocupando el ancho completo de la tarjeta. **Eliminar el texto de etapa**
(ej. "Etapa 1 – Descriptivo") de las tarjetas. *Móvil:* la timeline se mantiene horizontal a
ancho completo con etiquetas compactas (o solo nodos + etiqueta de la fase actual si no cabe).

**Commit:** `Radar de Candidatos: rebranding, días activa, histórico de completadas y timeline de fases`

---

## BATCH 2 — Vacantes semilla nuevas + pool y perfil ⬜

(Puntos 4, 7, 8, 9.)

**2.1 Nuevas vacantes semilla (P4).**
- **V-1042 → "Cajero Supervisor"** (área Operaciones o Atención a Clientes): descripción,
  especialidades, habilidades, aptitudes, sueldo y condiciones coherentes con el puesto.
- **V-1035 → "Desarrollador Frontend"** (área Tecnología): ídem (React, JS, CSS, etc.).
- **Garantizar candidatos MUY aptos** para ambas: ajustar/crear perfiles semilla para que cada
  vacante tenga al menos 2–3 candidatos en banda ≥90% y varios en 70–89% (verificar contra
  `matchScore` mentalmente: especialidades requeridas + hard skills alineadas + nivel + ciudad).
  Reutilizar candidatos existentes ajustando sus datos (ej. Lucía Herrera para Frontend;
  perfiles retail/caja para Cajero Supervisor — Valeria y Jorge Luis deben seguir siendo aptos
  para la vacante demo principal, que ahora es Cajero Supervisor).

**2.2 Texto y color de "Solicitar más candidatos" (P7).** Nuevo texto del popup: "Al
continuar, el **Centro Nacional de Atracción** iniciará la búsqueda de candidatos para
"{título}" y te propondrá perfiles viables en un plazo de 5 a 10 días hábiles." El botón
"Solicitar más candidatos" pasa a color principal (dorado `btn gold`).

**2.3 Mensaje de invitación con IA (P8).** En `InvitarModal`: eliminar las tabs
predefinido/personalizar. El textarea siempre editable, precargado con el mensaje predefinido.
Agregar botón estilo IA (índigo, icono `Sparkles`) **"Generar mensaje"**: simula generar un
mensaje para ese perfil (breve delay + reemplaza el texto con una variante que mencione
nombre, puesto y 1–2 skills del candidato; SIMULADO, plantilla determinista).

**2.4 Acciones en la ficha del candidato (P9).** En `PerfilModal`: subir "Descargar CV" a la
misma fila que favorito/categorizar/archivar; esos 3 quedan SOLO icono (sin texto, con
tooltip); agregar el botón **Compartir** (icono, reusa `CompartirModal`); "Descargar CV"
destacado en color principal (`btn gold`).

**Commit:** `Semilla Cajero Supervisor y Dev Frontend, CNA en popup, mensaje IA y ficha con acciones compactas`

---

## BATCH 3 — Descriptivo rediseñado (2 secciones) y adiós killers ⬜

(Punto 6 completo, a–k.)

**3.1 Estructura en 2 secciones (`VistaDescriptivo`).**
- **Sección 1 — El puesto:** Título, Descripción, Tipo de vacante, **Sueldo** (valor único
  `req.sueldo`, ver Decisiones) y Área. Botón propio de edición (icono lápiz) que abre un
  mini-formulario (reusar los campos de la sección 1 del wizard del admin) editando SOLO
  Título, Descripción y Tipo de vacante — **Sueldo y Área NO editables**.
- **Sección 2 — Perfil del candidato:** todos los demás campos. Botón propio de edición que
  abre los campos estilo sección 2 del wizard del admin, donde SOLO son editables:
  - **Nivel escolar (b):** dropdown del catálogo `EDUCACION` MODIFICADO: fusionar
    "Licenciatura trunca"/"Licenciatura titulado" en una sola opción **"Licenciatura"** y
    agregar **"Secundaria"** antes de Bachillerato. (Actualizar catálogo global + semillas de
    candidatos que usaban las opciones viejas, sin romper `matchScore`.)
  - **Área de conocimiento (c):** campo NUEVO `req.areasConocimiento` — selector de chips
    (mismo sistema que habilidades) sobre un catálogo NUEVO `PROFESIONES` (~25 profesiones
    comunes de plataformas de empleo: Ingeniería de Software, Administración de Empresas,
    Contaduría, Derecho, Psicología, Mercadotecnia, Ingeniería Industrial, Medicina,
    Enfermería, Arquitectura, Diseño Gráfico, Comunicación, Economía, Finanzas, Recursos
    Humanos, Comercio Internacional, Sistemas Computacionales, Gastronomía, Turismo,
    Educación, Ventas, Logística, Actuaría, Ingeniería Civil, Química…). **Máx 3.**
  - **Especialidades (c):** fusionar `espRequeridas` + `espOpcionales` en UN solo campo
    `espRequeridas` (mismo selector de chips, **máx 5**). Migrar semillas (concatenar y
    recortar a 5); `matchScore` deja de usar `espOpcionales` (re-repartir su peso en el de
    requeridas para mantener escala ~100, determinista).
  - **Habilidades duras y blandas (d):** editables con el selector de chips.
  - **Ubicación (e):** input de texto simple.
  - **Turno (f):** campo NUEVO `req.turno` — 3 opciones: Turno Matutino / Turno Vespertino /
    Turno Mixto (sustituye visualmente a horario/días en el descriptivo; mantener
    horario/días internos si algo los usa).
  - **Experiencia (g):** años editables (input numérico como en el wizard).
  - **Los demás campos NO editables (i).**
- El flujo de "solicitar cambios por campo" al admin (plan anterior) se conserva para lo
  no editable; la edición directa del formador YA NO pasa por el admin (guarda directo con
  registro en `v.historial`).

**3.2 Botón "Simular con IA" (j).** En la sección 2: botón estilo IA "Simular con IA" →
pequeña animación (2–3 s, spinner índigo + mensajes) y al terminar los campos de la sección
quedan establecidos con valores precargados coherentes con la vacante (SIMULADO: set
determinista por vacante, no implementar IA real).

**3.3 Eliminar killer questions (h).** Quitar por completo: sección 3 del wizard del admin,
render en descriptivos, `KillerPreguntas` y su uso en la postulación del candidato
(`PostulacionForm`/`AplicarModal` → postularse directo), datos `killer` en semillas, y
parámetros `killersOk` de `ACT.aplicar`/`ACT.postularDirecto`. Renumerar las secciones del
wizard del admin (quedan 3).

**Commit:** `Descriptivo en 2 secciones con edición directa, nuevos catálogos, turno, simular con IA y sin killer questions`

---

## BATCH 4 — Ranking, terna y entrevistas ⬜

(Puntos 10, 11, 12, 13, 14, 15.)

**4.1 Checks de filtros aprobados (P10).** En las tarjetas de "Ranking y terna", parte
superior derecha (arriba de los botones), mini-chips de requisitos según tipo:
- **Interno:** Comportamiento ejemplar ✓ · Antigüedad ✓ · Desempeño ✓
- **Externo:** PLD ✓ · Listas azules ✓ · Círculo de crédito ✓/⚠ · Reingreso ✓
- **Jorge Luis Peña Ríos (id 2)**: Círculo de crédito en ⚠ (ámbar); los demás todo ✓ (verde).
- Si hay un ⚠: botón **"Pedir liberación"** (al clic → toast "Solicitud de liberación
  enviada" + registro en historial del pipeline; simulado).
- **Quitar** los chips de habilidades/herramientas (CRM, Negociación…) de las tarjetas en
  esta vista.

**4.2 Botones en selección (P11).** En la etapa "Selección y documentos", a la izquierda del
botón de elegir candidato: **"Ver perfil"** (abre `PerfilModal`) y **"Ver entrevista"** (popup
con resumen, feedback, calificación y "grabación" de la entrevista — reproductor simulado).

**4.3 Ficha de Resumen de Entrevista IA (P12).** Rediseñar el modal de resumen IA (el de
"Ranking y terna") replicando EXACTAMENTE esta estructura (transcrita de la imagen de
referencia; generar los datos simulados por candidato):
1. **Header:** avatar + nombre + chip Interno/Externo; subtítulo "Ficha de candidato ·
   generada por IA". A la derecha: **score grande "{n}%"** con leyenda "score IA · etapa
   actual" y botón ✕.
2. Chip verde suave **"Viabilidad: Alta"** (Alta/Media según score) + botón outline
   **"↓ Descargar PDF"** (simulado, puede reusar `descargarCV` estilizado).
3. Línea de veredicto: ej. "Viable para entrevista; perfil fuerte en {especialidad}."
4. **RESUMEN GENERAL** (label gris uppercase): párrafo generado del perfil.
5. Dos columnas: **HABILIDADES TÉCNICAS** y **HABILIDADES BLANDAS** — 3 ítems por columna:
   nombre + número (0–100) a la derecha + **barra de progreso dorada**.
6. **FORTALEZAS**: 3 bullets. **ÁREAS DE MEJORA**: 2 bullets.
7. **RESUMEN ANTIFRAUDE · APLICACIÓN DE LA PRUEBA**: 4 filas con chip verde "Verificado ✓":
   Identidad verificada por biometría facial · Sin suplantación durante la video-entrevista ·
   Cambios de ventana durante la prueba: 0 · Consistencia de respuestas cuestionario vs.
   entrevista.
8. Footer gris pequeño: "Generado por IA a partir del cuestionario de skills, la
   video-entrevista y los filtros automáticos. Apoya la decisión del formador; no la
   sustituye."
Todo determinista por candidato (derivar números del id/match). *Móvil:* las 2 columnas de
habilidades colapsan a 1; el modal ocupa el ancho completo con scroll interno; el score y el
header se reacomodan sin encimarse.

**4.4 Estrellas 5 (P13).** La calificación de entrevista pasa de 10 a **5 estrellas** (ajustar
captura y todos los displays `n/5 ⭐`; datos previos se muestran convertidos si existieran).

**4.5 Botones según modalidad (P14).** En entrevistas agendadas: si la entrevista es
**Presencial** → solo botón "Registrar entrevista presencial"; si es **Virtual (Teams)** →
solo botón "Iniciar entrevista".

**4.6 Grabar notas por voz (P15).** En el área de notas de la entrevista: botón con icono
`Mic` **"Grabar notas"** → simula dictado (animación "escuchando…" 2 s y aparece texto de
notas de ejemplo en el campo; SIMULADO).

**Commit:** `Ranking y entrevistas: checks de filtros, ficha IA rediseñada, 5 estrellas, botones por modalidad y dictado`

---

## BATCH 5 — Carta oferta y documentación ⬜

(Puntos 16, 17, 20.)

**5.1 Sueldo no editable + Compensalia (P16).** En `OfertaTool`:
- Eliminar el input editable de monto. El monto queda fijo (el sugerido/`req.sueldo`).
- La caja de sugerencia deja el estilo IA (índigo) → estilo básico (card blanca), título
  **"Información de Compensalia"**.
- Se sigue viendo la banda salarial; a la izquierda, botón **"Solicitar ajuste a sueldo"**
  (al clic → toast "Solicitud de ajuste enviada a Compensaciones" + historial; simulado).

**5.2 Calculadora de compensación (P17).** Dentro de esa vista, replicar EXACTAMENTE esta
estructura (transcrita de la imagen de referencia):
- Card blanca de bordes redondeados, título **"Calculadora de compensación"**.
- Chip dorado suave: **"Salario fijo · tabulador autorizado"**.
- Filas label-izquierda / monto-derecha:
  - Sueldo base — ${base}
  - Bono variable est. — ${bono} (≈18% del base)
  - Prestaciones grupo — ${prestaciones} (≈12% del base)
- Separador y fila total en negritas: **"Valor total mensual" — ${total}** (dorado oscuro,
  tamaño mayor). Ej. de la referencia: 17,000 + 3,060 + 2,100 = **$22,160**.
- Derivar montos de `req.sueldo` de forma determinista. Este desglose es lo que el candidato
  ve en su carta oferta y en el resumen post-aceptación (Batch 6).
- Integrar aquí la "Información de Compensalia" y el botón "Solicitar ajuste a sueldo" (5.1).

**5.3 Auto recordatorios (P20).** En la vista de documentación post-selección (formador):
mensaje/chip informativo **"Auto recordatorios cada 24 horas — activado"** (icono campana o
reloj, tono ok).

**Commit:** `Carta oferta: calculadora de compensación, Compensalia, solicitar ajuste y auto recordatorios`

---

## BATCH 6 — Contratación extendida y cierre ⬜

(Puntos 18 y 19.) Ver Decisiones (nuevo flujo `ACT.firmarContrato`).

**6.1 Nuevo paso del candidato: apertura de cuenta (P18).** Al aceptar la oferta, el
candidato queda en `oferta_aceptada` y ve (penúltimo paso):
- **QR y link para abrir su cuenta** (mover aquí el bloque de cuenta bancaria: `QRDemo`,
  link y captura de número — se ELIMINA del checklist de documentos del paso de selección,
  ajustando la validación de docs completos).
- **Resumen de lo aceptado:** desglose de sueldo (calculadora del Batch 5), fecha de ingreso
  y ubicación de presentación.

**6.2 Firma y accesos (P18).** Formador, tab Contratación (antes de la felicitación):
- Botón **"Descargar kit de contratación"** (descarga simulada).
- **"Ingresar firma del candidato"**: campo/área para capturar la firma (input de nombre
  completo como firma o canvas simple — lo más sencillo) y botón "Firmar contrato" →
  `ACT.firmarContrato`.
- Al firmar se muestra: **número de empleado**, **correo corporativo**
  `{numEmpleado}@elektra.com.mx` y **accesos lógicos (Okta) ✓ confirmados**.
- **Último paso del candidato:** pantalla (habilitada al firmar) con su número de empleado,
  correo corporativo y accesos Okta confirmados.

**6.3 Cierre del formador: inducción + métricas + rating (P19).** Reemplazar la caja final
de celebración (nombre/número/fecha) por:
- **Inducción al puesto:** lista de videos (ej. "Inducción al área", "Inducción al puesto")
  con barras de avance y checks que simulan completarse (animación progresiva).
- Sección **"Proceso completado"** con 4 métricas en números GRANDES sobre su descripción:
  **10** días de cobertura · **3** decisiones del formador · **100%** digital y trazado ·
  **{n}** candidatos que regresan al pool (conteo real de descartados de la vacante).
  *Móvil:* las 4 métricas en grid 2x2.
- Debajo: **"Califica tu experiencia"** — 5 estrellas grandes; al elegir una → mensaje de
  confirmación y agradecimiento por la retroalimentación.
- Mantener el confetti/tono celebratorio como marco si queda bien.

**Commit:** `Contratación extendida: apertura de cuenta, firma con accesos Okta, inducción, métricas y rating`
