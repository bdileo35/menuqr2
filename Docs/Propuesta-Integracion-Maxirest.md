# Propuesta de Integración “Works with MaxiRest”

**Para:** Lucía de      n  MaxiRest  
**De:** Equipo MenuQR (Contacto: Juan Carlos Dileo · tu_email@tudominio.com · +54 9 11 xxx xxxx)  
**Fecha:** {{ completar }}

---

## 1) Resumen ejecutivo
- Integramos MenuQR (cartas digitales con OCR y módulo Pro de pedidos) con los datos del POS MaxiRest en **modo solo lectura**.
- Objetivo: sincronizar automáticamente productos, precios, categorías y modificadores desde MaxiRest hacia MenuQR, evitando cargas manuales y errores.
- **Sin impacto operativo**: no escribimos en la base del POS, no alteramos procesos de caja ni facturación.
- **Propuesta Win‑Win**: desarrollamos y mantenemos el conector sin costo para MaxiRest; a cambio, solicitamos acceso de lectura (API/Vistas/Export) y proponemos co‑branding “Works with MaxiRest”.

---

## 2) Beneficios para MaxiRest
- Valor agregado inmediato para sus clientes: catálogo web/QR, pedidos online (Pro), sincronía de precios y fotos.
- **Sin esfuerzo de soporte**: el conector es mantenido por MenuQR (N2/N3). No altera el flujo de venta ni la base de datos.
- **Co‑marketing**: material “Funciona con MaxiRest”, casos de éxito, presencia cruzada en web y eventos.
- **Opción de revenue share** (opcional): participación sobre las suscripciones activadas vía canal MaxiRest.

---

## 3) Alcance del conector (Solo Lectura)
Sincronización de estas entidades (mínimo viable):

| Entidad                      | Campos mínimos (ejemplo)                                                             |
|------------------------------|--------------------------------------------------------------------------------------|
| Categorías/Rubros            | `id`, `nombre`, `descripcion`, `orden`, `activo`, `updated_at`                       |
| Productos/Platos (PLU)       | `id`, `codigo`, `nombre`, `descripcion`, `id_categoria`, `precio_vigente`, `impuesto`|
| Modificadores/Opciones       | `id`, `nombre`, `precio_adicional`, `id_producto`                                    |
| Listas de precios (opcional) | `id_lista`, `nombre`, `vigencia_desde/hasta`, `precio_lista`                         |
| Imágenes (opcional)          | `id_producto`, `url_imagen` o `blob` + `mime_type`                                   |
| Disponibilidad (opcional)    | `id_producto`, `stock` o `flag_disponible`, `horarios`                               |

> Si no hay API, podemos leer **vistas SQL read‑only** (Firebird/SQL Server/SQLite) o consumir **exports** CSV/JSON.

---

## 4) Modos de integración (a elección de MaxiRest)
1. **API REST/GraphQL (preferido)**  
   • Endpoints de solo lectura (token/API key).  
   • Rango típico: `/categories`, `/items`, `/prices`, `/modifiers`, `/images`.
2. **Vistas SQL Read‑Only**  
   • Usuario con permisos `SELECT` sobre *views* dedicadas (sin acceso a tablas críticas).  
   • Soporte Firebird/SQL Server/SQLite (ODBC/JDBC).
3. **Export programado (CSV/JSON)**  
   • Tarea programada en el POS que genera archivos por entidad.  
   • Entrega por SFTP/HTTPS/Blob Storage; opcional **webhook** de “cambio detectado”.

> Elegimos juntos la modalidad más simple y segura para su arquitectura.

---

## 5) Seguridad y cumplimiento
- Acceso **estrictamente de lectura**; sin escrituras ni borrados en sistemas de MaxiRest.
- Autenticación por token/usuario dedicado; **principio de menor privilegio**.
- Tráfico cifrado (TLS 1.2+), rotación de credenciales y **IP allow‑list** opcional.
- Logs de acceso y trazabilidad de sincronizaciones.
- Posibilidad de **NDA** y anexos de seguridad si se requieren.

---

## 6) Arquitectura de alto nivel (descripción)
1. MaxiRest expone datos (API / Vista SQL / Export).  
2. El **Conector MenuQR** lee cambios (delta por `updated_at`/versionado).  
3. Normaliza y publica en la **API de sincronización MenuQR** (Supabase/PostgreSQL).  
4. El **Front de MenuQR** (Next.js + CDN) refleja el nuevo catálogo y precios en minutos.  
5. Si está activo **MenuQR Pro**, los pedidos/confirmaciones (Efectivo/MP) no impactan el POS salvo que se acuerde una segunda etapa de “push‑back”.

---

## 7) Cronograma propuesto
- **Semana 0–1**: Alineación técnica, acceso a entorno de prueba, definición de esquema mínimo.  
- **Semana 1–2**: Desarrollo del conector (MVP) + pruebas con dataset de ejemplo.  
- **Semana 3**: Piloto en un restaurante de referencia.  
- **Semana 4**: Ajustes finales, entrega de documentación y sello “Works with MaxiRest”.

> Compromiso: **MVP funcional en 2–3 semanas** desde la habilitación de acceso.

---

## 8) Responsabilidades
**MenuQR**  
• Diseño, desarrollo y mantenimiento del conector.  
• Operación (nube), monitoreo y soporte N2/N3.  
• Documentación para clientes y equipo técnico de MaxiRest.

**MaxiRest**  
• Proveer acceso de lectura (API/Views/Export) a las entidades acordadas.  
• Acompañamiento técnico (1–2 reuniones de 30’).  
• Validación funcional con un cliente piloto.

---

## 9) Modelo comercial (opcional, a conversar)
- **Conector sin costo** para MaxiRest.  
- **Revenue share** sobre suscripciones activadas por el canal MaxiRest (p. ej., 10–15% de la cuota neta).  
- Alternativa: **licencia OEM** si desean incluir MenuQR Pro como módulo propio.

---

## 10) Próximos pasos
1. Confirmar interés y modalidad (API / Vistas / Export).  
2. Compartir esquema de datos o CSV/JSON de ejemplo.  
3. Agendar **reunión técnica (30’)** para validar campos y seguridad.  
4. Definir cliente piloto y calendario del MVP.

**¿Coordinamos una call esta semana, Lucía?**

---

## Anexo A — Campos sugeridos (detalle)

```text
Categorías
- id (string/int)
- nombre (string)
- descripcion (string?)
- orden (int?)
- activo (bool)
- updated_at (timestamp)

Productos/PLU
- id (string/int)
- codigo (string)
- nombre (string)
- descripcion (string?)
- id_categoria (string/int)
- precio_vigente (decimal)
- impuesto (decimal?)
- activo / disponible (bool)
- updated_at (timestamp)

Modificadores (opcional)
- id (string/int)
- id_producto (string/int)
- nombre (string)
- precio_adicional (decimal?)
- obligatorio (bool?)

Imágenes (opcional)
- id_producto (string/int)
- url_imagen (string) o blob + mime_type
```

---

## Anexo B — Comparativa de planes (referencia MenuQR)

| Función / Módulo                | MenuQR | Pro |
|---------------------------------|:------:|:---:|
| Catálogo desde MaxiRest         |   ✔️    |  ✔️  |
| Cartas digitales responsivas    |   ✔️    |  ✔️  |
| OCR (importación rápida)        |   ✔️    |  ✔️  |
| Pedidos por WhatsApp            |   ✔️    |  ✔️  |
| Carrito (salón/retiro/delivery) |   —    |  ✔️  |
| Pago con Mercado Pago           |   —    |  ✔️  |
| Ticket/Comanda automática       |   ✔️    |  ✔️  |

> La integración propuesta con MaxiRest es independiente del plan comercial del restaurante; la tabla es ilustrativa del front de MenuQR.




