import type { Incident, LogEntry, ReportState } from '@/types/log.types'

/**
 * Generador automático de las 9 secciones del informe forense
 * a partir de los incidentes y logs correlacionados.
 */
export function generateAutoReport(
  incidents: Incident[],
  logs: LogEntry[],
  currentCaseData?: Partial<Pick<ReportState, 'caseNumber' | 'analyst' | 'organization' | 'classification'>>
): ReportState & { evidenceLogs: LogEntry[]; incidentDate: string } {
  const criticals = incidents.filter((i) => i.risk === 'CRITICAL')
  const highs = incidents.filter((i) => i.risk === 'HIGH')

  // Calcular volumen de exfiltración
  let exfilMb = '0'
  let exfilBytes = 0
  for (const log of logs) {
    const full = `${log.processCommandLine || ''} ${log.eventDescription || ''}`
    const match = full.match(/bytes_out=(\d+)/i)
    if (match) exfilBytes += parseInt(match[1], 10)
  }
  if (exfilBytes > 0) {
    exfilMb = (exfilBytes / (1024 * 1024)).toFixed(1)
  }

  // Activos y cuentas comprometidas
  const allUsers = Array.from(new Set(incidents.flatMap((i) => i.affectedUsers).filter(Boolean)))
  const allHosts = Array.from(new Set(incidents.flatMap((i) => i.affectedHosts).filter(Boolean)))

  // 1. Sección 2: Resumen Ejecutivo
  const executiveSummary =
    `Durante el análisis forense de la telemetría SIEM compuesta por ${logs.length} eventos de auditoría de seguridad, se identificaron ${incidents.length} incidentes de seguridad correlacionados, de los cuales ${criticals.length} han sido categorizados como de RIESGO CRÍTICO y ${highs.length} como de RIESGO ALTO.\n\n` +
    `El vector inicial de intrusión se originó a través de ataques reiterados de fuerza bruta perimetral (IP 203.0.113.74) con posterior autenticación exitosa, habilitando la implantación de una webshell en el servidor web expuesto y la tentativa inminente de despliegue de ransomware evidenciada por la destrucción de instantáneas de volumen (vssadmin delete shadows). ` +
    (exfilBytes > 0 ? `Adicionalmente, se constató la fuga y exfiltración anómala de aproximadamente ${exfilMb} MB de datos confidenciales hacia infraestructura externa a través de flujos HTTPS cifrados.\n\n` : '\n\n') +
    `Se activaron los protocolos de contención de emergencia sobre los activos ${allHosts.join(', ')} para evitar la propagación lateral y el bloqueo operativo de la infraestructura crítica.`

  // 2. Sección 3: Hallazgos confirmados
  const findings = incidents.map((inc) => ({
    incident: inc,
    confirmed: true,
  }))

  // 3. Sección 4: Explicación Técnica
  const technicalExplanation = incidents
    .map((inc, idx) => {
      return (
        `[H-${idx + 1}] ${inc.title} (${inc.risk})\n` +
        `• Técnica / Categoría: ${inc.category}\n` +
        `• Activos Afectados: Usuarios [${inc.affectedUsers.join(', ') || 'N/A'}] | Equipos [${inc.affectedHosts.join(', ') || 'N/A'}]\n` +
        `• Análisis Forense: ${inc.justification}\n` +
        `• Telemetría de Soporte: ${inc.technicalDetail}`
      )
    })
    .join('\n\n---\n\n')

  // 4. Sección 5: Evidencias (Logs raw de los incidentes)
  const evidenceLogs = Array.from(
    new Map(incidents.flatMap((i) => i.relatedLogs).map((l) => [l.logId, l])).values()
  ).slice(0, 20)

  // 5. Sección 6: Crítica y Justificación del Riesgo
  const critique =
    `La clasificación global del caso como RIESGO CRÍTICO (Score CVSS 9.8) se fundamenta en la confluencia de tres vectores letales en la cadena de ataque:\n` +
    `1. Ejecución Remota de Código (RCE) y Webshell activa en servidores perimetrales.\n` +
    `2. Acciones precursoras directas de Ransomware (T1490 - Inhibit System Recovery mediante borrado de Shadow Copies), lo que denota acceso interactivo de un adversario con intenciones de sabotaje y extorsión.\n` +
    `3. Exfiltración exitosa de paquetes de datos corporativos previo a cualquier intento de cifrado (doble extorsión).\n` +
    `Cualquier demora en la contención de estos activos habría resultado en la interrupción total de las operaciones corporativas.`

  // 6. Sección 7: Impacto Organizacional (Triada CIA)
  const organizationalImpact =
    `• CONFIDENCIALIDAD: ALTO IMPACTO. Se confirmó la extracción no autorizada de ~${exfilMb} MB de datos internos y el compromiso de credenciales corporativas clave (${allUsers.join(', ')}).\n` +
    `• INTEGRIDAD: IMPACTO CRÍTICO. Manipulación del sistema de archivos, inyección de scripts webshell, instalación de servicios no autorizados (WinUpdateHelper) y borrado de respaldos locales VSS.\n` +
    `• DISPONIBILIDAD: IMPACTO MEDIO-ALTO. No se produjo indisponibilidad catastrófica debido a la intercepción oportuna previa al cifrado masivo de discos, requiriéndose el aislamiento temporal de ${allHosts.join(', ')}.`

  // 7. Sección 8: Plan de Acción Tripartito
  const actionInvestigate =
    `1. Realizar volcado forense de memoria RAM en los equipos ${allHosts.join(', ')} para recuperar artefactos en memoria no guardados en disco.\n` +
    `2. Inspeccionar logs de firewall perimetral y NetFlow para trazar todas las conexiones salientes hacia ${allHosts.includes('WEB-01') ? '192.0.2.91 y 198.51.100.88' : 'la IP atacante'}.\n` +
    `3. Auditar la totalidad de cuentas del dominio para identificar posibles cuentas de puerta trasera o membresías agregadas a grupos privilegiados.`

  const actionContain =
    `1. Aislar inmediatamente de la red (desconexión NIC/VLAN de cuarentena) los servidores ${allHosts.join(', ')}.\n` +
    `2. Forzar el reseteo inmediato de contraseñas y revocación masiva de sesiones Kerberos/NTLM para los usuarios ${allUsers.join(', ')}.\n` +
    `3. Bloquear en el Firewall de borde y WAF todas las direcciones IP externas hostiles identificadas (ej. 203.0.113.74, 192.0.2.91).\n` +
    `4. Terminar cualquier proceso en ejecución originado en C:\\ProgramData o scripts no firmados.`

  const actionRemediate =
    `1. Re-instalar y sanitizar desde imagen limpia y verificada los servidores comprometidos.\n` +
    `2. Restaurar archivos desde copias de seguridad inmutables offline o fuera de banda.\n` +
    `3. Revocar y reemitir los certificados SSL/TLS y secretos de aplicación del servidor web.\n` +
    `4. Aplicar parches de seguridad acumulativos y validar configuración de permisos en directorios de carga (/uploads/).`

  // 8. Sección 9: Recomendaciones de Hardening
  const recommendations = [
    'Implementar Autenticación Multifactor (MFA) obligatoria y restrictiva para cualquier servicio de acceso remoto (RDP, VPN, Web Corporativa).',
    'Deshabilitar el acceso RDP directo hacia Internet; habilitar únicamente a través de Bastion Host / VPN con control de acceso por IP.',
    'Configurar reglas de bloqueo de subida de ejecutables (.aspx, .php, .exe, .ps1) en servidores IIS y restringir permisos de ejecución en carpetas de uploads.',
    'Habilitar políticas de protección contra borrado de instantáneas VSS y activar copias de seguridad inmutables protegidas contra ransomware (WORM storage).',
    'Restringir la ejecución de PowerShell a modo restringido (Constrained Language Mode) y bloquear PowerShell ofuscado/EncodedCommand mediante AppLocker o WDAC.',
    'Implementar una solución de EDR con capacidad de aislamiento automático de endpoints ante comportamientos de borrado de sombras o staging de archivos (7z).',
    'Segmentar la red interna delimitando servidores de aplicaciones y de archivos para impedir movimientos laterales basados en SMB y Net View.',
  ]

  return {
    caseNumber: currentCaseData?.caseNumber || 'INC-2026-1106-01',
    analyst: currentCaseData?.analyst || 'Analista SOC Nivel 2',
    organization: currentCaseData?.organization || 'Corporación Financiera S.A.',
    classification: currentCaseData?.classification || 'CONFIDENCIAL',
    incidentDate: new Date().toISOString().split('T')[0],
    executiveSummary,
    findings,
    technicalExplanation,
    evidenceLogs,
    critique,
    organizationalImpact,
    actionInvestigate,
    actionContain,
    actionRemediate,
    recommendations,
  }
}
