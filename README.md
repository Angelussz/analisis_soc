# SOC L2 Sentinel — Analizador Forense de Logs SIEM & Incident Responder

![Versión](https://img.shields.io/badge/versión-2.4-blue.svg)
![Arquitectura](<https://img.shields.io/badge/arquitectura-100%25%20Client--Side%20(No%20Backend)-emerald.svg>)
![Worker](https://img.shields.io/badge/Web%20Worker-Vite%20Off--Thread-cyan.svg)
![Framework](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3%20Cyber%20Dark-purple)

Plataforma forense moderna y de alto rendimiento diseñada para analistas de ciberseguridad en **Centros de Operaciones de Seguridad (SOC Nivel 2)**.

Permite la ingesta pericial de registros SIEM exportados en hojas de cálculo Excel (`.xlsx`), parseo multi-hilo en segundo plano mediante **Web Workers**, detección heurística de amenazas mapeadas a la matriz **MITRE ATT&CK**, correlación cruzada de vectores de ataque y la redacción/exportación automática de informes forenses de **9 secciones estructuradas** con previsualización en hoja A4 en tiempo real y exportación formal a PDF.

---

## 🚀 Características Principales

### 1. Ingesta y Procesamiento 100% Client-Side (Zero-Backend)

- **Privacidad y Seguridad Total:** Los logs y credenciales de la empresa nunca abandonan el navegador ni viajan a servidores externos.
- **Web Worker Dedicado:** El parseo de archivos Excel (SheetJS) y la ejecución de los 6 motores heurísticos se procesan en un hilo secundario sin congelar el renderizado ni degradar los 60 FPS de la interfaz.

### 2. Motor Heurístico de Detección (MITRE ATT&CK)

Incluye 6 detectores especializados calibrados para logs de seguridad de Windows y telemetría de red:

1. **Fuerza Bruta & Password Spraying ([T1110](https://attack.mitre.org/techniques/T1110/)):** Clústering temporal de eventos `4625` y escalamiento a CRÍTICO al detectar compromiso posterior (`4624`).
2. **Inicios de Sesión Sospechosos ([T1078](https://attack.mitre.org/techniques/T1078/), [T1021.001](https://attack.mitre.org/techniques/T1021/001/)):** Accesos RDP interactivo (LogonType 10) desde IPs externas y asignación de privilegios `4672` fuera de horario laboral.
3. **Escalamiento de Privilegios & Persistencia ([T1543.003](https://attack.mitre.org/techniques/T1543/003/), [T1053.005](https://attack.mitre.org/techniques/T1053/005/)):** Detección de nuevos servicios (`7045`) en directorios de usuario (`C:\ProgramData`), tareas programadas (`4698`) y PowerShell `4104` auditando grupos de administradores.
4. **Comandos Maliciosos & Pre-Ransomware ([T1059](https://attack.mitre.org/techniques/T1059/), [T1490](https://attack.mitre.org/techniques/T1490/)):** Inspección de líneas de comandos para detectar destrucción de copias de seguridad (`vssadmin delete shadows`), comandos PowerShell ofuscados (`-EncodedCommand`), empaquetado de datos (`7z.exe a`) y ejecución remota de comandos (`cmd.exe /c whoami`).
5. **Movimiento Lateral & Reconocimiento ([T1021.002](https://attack.mitre.org/techniques/T1021/002/), [T1135](https://attack.mitre.org/techniques/T1135/)):** Detección de saltos SMB (`5140`/`5145`), reconocimiento de red (`net.exe view`) y accesos masivos a carpetas compartidas críticas (`\Finance`, `\Legal`, `\Admin$`).
6. **Anomalías, Webshells & Exfiltración HTTPS ([T1048](https://attack.mitre.org/techniques/T1048/), [T1505.003](https://attack.mitre.org/techniques/T1505/003/)):** Detección de interacción con webshells (`/uploads/*.aspx?cmd=`) y cálculo acumulado de exfiltración de datos masiva por túneles HTTPS salientes (`PROXY_ACCESS`).

### 3. Dashboard Interactivo y Telemetría SOC

- **Banner Táctico de Acción Rápida:** Alerta de máxima severidad con botón de simulación interactivo `Aislar Host (NIC OFF)` y panel desplegable de TTPs.
- **4 Tarjetas KPI Forenses:** Conteo total de eventos procesados, incidentes críticos activos (SEV-1), relación de altos/medios con SLA y volumen acumulado de exfiltración estimada.
- **4 Gráficas Analíticas (Recharts):**
  - Donut de distribución porcentual por nivel de riesgo.
  - Histograma temporal (Killchain Timeline) con volumen horario y eventos anómalos.
  - Top 5 de IPs atacantes/sospechosas con etiquetado GeoIP/Segmento.
  - Activos y cuentas comprometidas con etiquetas periciales (`COMPROMETIDA`, `LOCKOUT`, `ISOLATE REQ`).

### 4. Visor Forense de Logs SIEM con TanStack Virtual

- **Virtual Scrolling a 60 FPS:** Capaz de navegar miles de registros sin consumo excesivo de memoria DOM.
- **Terminal de Búsqueda KQL:** Consola interactiva tipo línea de comandos `sentinel@soc-l2:~/kql-parser $` con filtrado en tiempo real.
- **Filtros rápidos por Event ID:** Acceso inmediato con un clic a eventos clave (`4625`, `4624`, `7045`, `4688`, `PROXY_ACCESS`, `HTTP_ACCESS`) y selector de severidad.
- **Modal de Detalle Forense:** Inspección completa de las 12 columnas, comando exacto y botón para copiar el registro como objeto JSON.

### 5. Centro de Incidentes

- Tarjetas con códigos de color de severidad e indicador pulsante para incidentes críticos.
- Modal de investigación con análisis pericial, justificación, impacto y tabla de logs de evidencia vinculados.
- Acción directa para confirmar o descartar incidentes en el informe oficial.

### 6. Generador de Informes Forenses & Exportación PDF A4

- **Auto-Síntesis Heurística:** Redacta automáticamente el informe a partir de los datos procesados.
- **9 Secciones Estructuradas:**
  1. _Datos Generales del Caso_ (Expediente, analista, organización, clasificación TLP).
  2. _Resumen Ejecutivo Forense_.
  3. _Matriz de Hallazgos Confirmados_.
  4. _Explicación Técnica y TTPs Adversarios_.
  5. _Evidencias y Registros SIEM Clave_.
  6. _Justificación y Evaluación Crítica (CVSS v3.1)_.
  7. _Impacto Organizacional (Triada CIA)_.
  8. _Plan de Acción Tripartito (Investigación, Contención y Remediación)_.
  9. _Recomendaciones Estratégicas de Hardening_.
- **Canvas A4 Live:** Previsualización formal en tiempo real con marca de agua de confidencialidad, certificación con hash SHA-256 y firma del analista.
- **Exportación Pericial a PDF:** Integrado con `jsPDF` y `html2canvas` con soporte para abrir en nueva pestaña (`Ver PDF`) o descargar con nomenclatura estandarizada (`Informe_SOC_L2_[Caso]_[Fecha].pdf`).

---

## 🛠️ Stack Tecnológico

| Componente                     | Tecnología                                   |     Versión     |
| ------------------------------ | -------------------------------------------- | :-------------: |
| **Bundler & Dev Server**       | Vite                                         |     `^5.4`      |
| **Framework UI**               | React                                        |     `^18.3`     |
| **Lenguaje**                   | TypeScript                                   |     `^5.5`      |
| **Estilos & Design System**    | Tailwind CSS v3 + PostCSS                    |     `^3.4`      |
| **Gestor de Estado Global**    | Zustand                                      |     `^5.1`      |
| **Gráficos Analíticos**        | Recharts                                     |     `^3.10`     |
| **Virtualización de Tablas**   | TanStack Virtual (`@tanstack/react-virtual`) |     `^3.14`     |
| **Parseo de Hojas de Cálculo** | SheetJS (`xlsx`)                             |     `^0.18`     |
| **Generación de PDF**          | jsPDF + html2canvas                          | `^4.2` / `^1.4` |
| **Iconografía**                | Lucide React                                 |     `^1.70`     |
| **Procesamiento Asíncrono**    | Vite Web Workers (ES Modules)                |     Nativo      |

---

## 📋 Formato de Logs SIEM Soportado

La aplicación procesa hojas de cálculo Excel (`.xlsx` o `.xls`) estructuradas con las **12 columnas SIEM estándar**:

| Columna               | Tipo          | Descripción                                                            |
| --------------------- | ------------- | ---------------------------------------------------------------------- |
| `Log_ID`              | String        | Identificador único del evento (ej. `EVT-00001`).                      |
| `Timestamp`           | DateTime      | Fecha y hora UTC del registro.                                         |
| `Hostname`            | String        | Nombre del equipo origen/afectado (ej. `APP-SRV01`, `DC-01`).          |
| `Event_ID`            | Number/String | Código de evento Windows/Servicio (ej. `4625`, `7045`, `HTTP_ACCESS`). |
| `User`                | String        | Cuenta de usuario asociada (ej. `CORP\mgarcia`, `SYSTEM`).             |
| `Source_IP`           | String        | Dirección IP origen de la conexión.                                    |
| `Destination`         | String        | Dirección IP o recurso de destino.                                     |
| `Log_Source`          | String        | Canal o fuente de auditoría (`Security`, `System`, `IIS`, `Proxy`).    |
| `Event_Description`   | String        | Descripción del evento registrado.                                     |
| `Process_CommandLine` | String        | Línea de comando ejecutada o URI HTTP (opcional).                      |
| `Result`              | String        | Resultado del evento (`Success`, `Failure`, `200`, `404`).             |
| `Severity`            | String        | Nivel de severidad (`Informational`, `Warning`, `Medium`, `High`).     |

---

## ⚙️ Requisitos Previos

- **Node.js:** Versión `18.0.0` o superior (probado y verificado en Node `v26.11.0`).
- **NPM:** Versión `9.0.0` o superior.
- **Navegador Web Moderno:** Google Chrome, Brave, Edge, Firefox o Safari con soporte para Web Workers.

---

## 📥 Instalación y Puesta en Marcha

### 1. Ubicarse en el directorio del proyecto

```bash
cd /analisis_soc
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación se levantará localmente en:

```text
http://localhost:5173
```

### 4. Compilar para producción (Build estático)

```bash
npm run build
```

Esto generará los archivos estáticos optimizados en la carpeta `dist/` con code-splitting automático (`charts`, `pdf`, `vendor`, `web worker`).

### 5. Previsualizar el build de producción

```bash
npm run preview
```

---

## 📁 Estructura del Código Fuente

```text
analisis_soc/
├── public/                     # Favicon y assets públicos directos
├── src/
│   ├── components/
│   │   ├── dashboard/          # KPICards, Banner Táctico y Gráficos Recharts
│   │   │   ├── KPICards.tsx
│   │   │   ├── SeverityPieChart.tsx
│   │   │   ├── TacticalBanner.tsx
│   │   │   ├── TimelineChart.tsx
│   │   │   ├── TopIPsChart.tsx
│   │   │   └── TopUsersChart.tsx
│   │   ├── incidents/          # Gestión de Incidentes
│   │   │   ├── IncidentCard.tsx
│   │   │   ├── IncidentDetailModal.tsx
│   │   │   └── IncidentList.tsx
│   │   ├── layout/             # Layout adaptable, Header y Sidebar
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── logs/               # Visor virtualizado TanStack
│   │   │   ├── LogDetailModal.tsx
│   │   │   └── LogTable.tsx
│   │   ├── report/             # Editor de Informe y Preview A4
│   │   │   ├── pdf/
│   │   │   │   └── PDFTemplate.tsx
│   │   │   ├── sections/       # Las 9 secciones editables (S1 a S9)
│   │   │   │   ├── S1_CaseData.tsx
│   │   │   │   ├── S2_ExecutiveSummary.tsx
│   │   │   │   ├── S3_Findings.tsx
│   │   │   │   ├── S4_TechnicalExplanation.tsx
│   │   │   │   ├── S5_Evidence.tsx
│   │   │   │   ├── S6_Critique.tsx
│   │   │   │   ├── S7_Impact.tsx
│   │   │   │   ├── S8_ActionPlan.tsx
│   │   │   │   └── S9_Recommendations.tsx
│   │   │   ├── ReportEditor.tsx
│   │   │   └── ReportPreview.tsx
│   │   └── upload/             # Componente Drag & Drop
│   │       └── FileUploader.tsx
│   ├── lib/
│   │   ├── detectors/          # Los 6 Detectores Heurísticos MITRE
│   │   │   ├── anomalies.ts
│   │   │   ├── bruteForce.ts
│   │   │   ├── escalation.ts
│   │   │   ├── lateralMovement.ts
│   │   │   ├── maliciousCommands.ts
│   │   │   └── suspiciousLogin.ts
│   │   ├── correlator.ts       # Pipeline de correlación cruzada
│   │   ├── parser.ts           # Mapeo y validación de 12 columnas (SheetJS)
│   │   ├── pdfExporter.ts      # Motor de exportación a PDF A4 (jsPDF)
│   │   ├── reportAutoGenerator.ts # Síntesis automática de informe
│   │   └── riskClassifier.ts   # Puntuación y matrices de severidad
│   ├── pages/                  # Vistas principales
│   │   ├── DashboardPage.tsx
│   │   ├── IncidentsPage.tsx
│   │   ├── LogsPage.tsx
│   │   └── ReportPage.tsx
│   ├── store/                  # Almacenes globales reactivos (Zustand)
│   │   ├── logStore.ts
│   │   └── reportStore.ts
│   ├── types/                  # Definiciones estrictas de TypeScript
│   │   └── log.types.ts
│   ├── workers/                # Hilo secundario Web Worker
│   │   └── logAnalyzer.worker.ts
│   ├── App.tsx                 # Enrutador principal de vistas
│   ├── index.css               # Estilos globales y Tailwind Cyber Dark
│   └── main.tsx                # Entrada React DOM
├── index.html                  # Plantilla HTML con tipografías Geist y JetBrains Mono
├── package.json                # Manifiesto de dependencias y scripts
├── tailwind.config.js          # Configuración del Design System SOC Dark
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración de Vite (alias, workers, chunks)
```

---

## 🔒 Licencia y Confidencialidad

Este software ha sido diseñado con fines forenses y defensivos para entornos de SOC Nivel 2 y respuesta ante incidentes. Todos los datos analizados permanecen estrictamente confinados en la memoria local del navegador web del analista.
