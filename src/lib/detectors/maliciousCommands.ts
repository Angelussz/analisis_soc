import type { LogEntry, Incident } from '@/types/log.types'

interface CommandRule {
  pattern: RegExp
  risk: Incident['risk']
  category: Incident['category']
  title: string
  justification: string
  impact: string
}

const COMMAND_RULES: CommandRule[] = [
  {
    pattern: /vssadmin(\.exe)?\s+delete\s+shadows/i,
    risk: 'CRITICAL',
    category: 'MALICIOUS_COMMAND',
    title: 'Destrucción de Copias de Seguridad VSS (Precursor Ransomware)',
    justification: 'Se detectó el comando "vssadmin delete shadows" ejecutado para eliminar todas las instantáneas de volumen (Shadow Copies) del sistema operativo.',
    impact: 'Inhibición de recuperación del sistema (MITRE T1490). Comportamiento característico previo al despliegue y cifrado masivo de un Ransomware.',
  },
  {
    pattern: /cmd(\.exe)?\s+\/c\s+whoami/i,
    risk: 'CRITICAL',
    category: 'MALICIOUS_COMMAND',
    title: 'Ejecución Remota de Comandos (RCE) / Descubrimiento Whoami',
    justification: 'Invocación de intérprete de comandos con "cmd.exe /c whoami" típicamente engendrado por servidores web o servicios explotados.',
    impact: 'Validación de privilegios tras acceso no autorizado / RCE por parte de actor hostil.',
  },
  {
    pattern: /powershell(\.exe)?.*(-enc|-encodedcommand)/i,
    risk: 'HIGH',
    category: 'MALICIOUS_COMMAND',
    title: 'Ejecución de PowerShell con Comando Codificado en Base64',
    justification: 'Uso del parámetro -EncodedCommand en PowerShell para evadir firmas y sistemas de detección basados en texto plano.',
    impact: 'Evasión de defensas (MITRE T1027). Carga de payloads o scripts maliciosos ofuscados en memoria.',
  },
  {
    pattern: /7z(\.exe)?\s+a\s+/i,
    risk: 'HIGH',
    category: 'MALICIOUS_COMMAND',
    title: 'Empaquetado y Compresión de Archivos para Exfiltración (Data Staging)',
    justification: 'Uso de la utilidad 7-Zip en línea de comandos para comprimir lotes de documentos confidenciales en un único archivo comprimido en rutas públicas.',
    impact: 'Preparación de datos sensibles para robo o exfiltración masiva (MITRE T1074).',
  },
  {
    pattern: /net(\.exe)?\s+view/i,
    risk: 'HIGH',
    category: 'LATERAL_MOVEMENT',
    title: 'Reconocimiento de Recursos de Red con Net View',
    justification: 'Ejecución de "net.exe view" para listar servidores, estaciones de trabajo y recursos compartidos de dominio.',
    impact: 'Descubrimiento de infraestructura interna (MITRE T1135) previo al movimiento lateral.',
  },
  {
    pattern: /c:\\programdata\\.*\.exe/i,
    risk: 'CRITICAL',
    category: 'MALICIOUS_COMMAND',
    title: 'Ejecución de Binario en Directorio Sospechoso C:\\ProgramData',
    justification: 'Lanzamiento de un ejecutable alojado en C:\\ProgramData, una carpeta comúnmente aprovechada por malware para esquivar listas de control de acceso.',
    impact: 'Ejecución de software no autorizado o troyano fuera de directorios protegidos del sistema.',
  },
]

/**
 * Detector 4: Comandos y Procesos Maliciosos (T1059, T1490, T1027, T1074)
 */
export function detectMaliciousCommands(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  for (const log of logs) {
    const cmdLine = log.processCommandLine || ''
    const desc = log.eventDescription || ''
    const fullText = `${cmdLine} ${desc}`

    if (!fullText) continue

    for (const rule of COMMAND_RULES) {
      if (rule.pattern.test(fullText)) {
        incidents.push({
          id: `INC-CMD-${log.logId}`,
          category: rule.category,
          risk: rule.risk,
          title: `${rule.title} (${log.hostname})`,
          justification: `${rule.justification} Comando exacto: "${cmdLine || desc}".`,
          technicalDetail: `Host: ${log.hostname}, Usuario: ${log.user}, EventID: ${log.eventId}, Proceso: ${cmdLine || desc}.`,
          impact: rule.impact,
          affectedUsers: [log.user],
          affectedHosts: [log.hostname],
          relatedLogs: [log],
          timestamp: log.timestamp,
        })
        break // Una coincidencia por log
      }
    }
  }

  return incidents
}
