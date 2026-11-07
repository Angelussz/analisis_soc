import type { LogEntry, Incident } from '@/types/log.types'

/**
 * Detector 3: Escalamiento de Privilegios y Persistencia (T1543.003, T1053.005, T1059.001)
 * Detecta:
 * - 7045: Instalación de nuevos servicios con binarios en rutas anómalas (ProgramData, Temp, etc.)
 * - 4698: Creación de tareas programadas persistentes
 * - 4104: Script blocks de PowerShell auditando grupos locales o elevación
 */
export function detectPrivilegeEscalation(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  for (const log of logs) {
    const eventIdStr = String(log.eventId)
    const cmd = (log.processCommandLine || '').toLowerCase()
    const desc = (log.eventDescription || '').toLowerCase()
    const content = `${cmd} ${desc}`

    // 1. Evento 7045: Servicio nuevo instalado
    if (eventIdStr === '7045' || desc.includes('service was installed') || desc.includes('servicename=')) {
      const isSuspiciousPath =
        content.includes('programdata') ||
        content.includes('users\\public') ||
        content.includes('appdata') ||
        content.includes('temp') ||
        content.includes('.exe')

      const isHelpdeskOrNonAdmin = log.user.toLowerCase().includes('helpdesk') || (!log.user.toLowerCase().includes('system') && !log.user.toLowerCase().includes('admin'))

      const risk = (isSuspiciousPath || isHelpdeskOrNonAdmin) ? 'CRITICAL' : 'HIGH'

      incidents.push({
        id: `INC-SVC-${log.logId}`,
        category: 'PERSISTENCE',
        risk,
        title: `Instalación de Servicio Anómalo / Persistencia (${log.hostname})`,
        justification: `Se instaló un nuevo servicio en el sistema mediante la cuenta ${log.user}. El binario o configuración se aloja en una ruta no estándar de usuario/datos: ${log.processCommandLine || log.eventDescription}.`,
        technicalDetail: `Evento 7045 detectado en ${log.hostname}. Usuario: ${log.user}. Detalle: ${log.processCommandLine || log.eventDescription}. Vector común de persistencia y ejecución con privilegios SYSTEM.`,
        impact: 'Persistencia persistente a nivel de sistema operativo y evasión de privilegios con elevación a NT AUTHORITY\\SYSTEM.',
        affectedUsers: [log.user],
        affectedHosts: [log.hostname],
        relatedLogs: [log],
        timestamp: log.timestamp,
      })
    }

    // 2. Evento 4698: Tarea programada creada
    if (eventIdStr === '4698' || desc.includes('scheduled task was created') || content.includes('taskname=')) {
      const isSuspiciousAction =
        content.includes('programdata') ||
        content.includes('powershell') ||
        content.includes('.ps1') ||
        content.includes('users\\public')

      incidents.push({
        id: `INC-TASK-${log.logId}`,
        category: 'PERSISTENCE',
        risk: isSuspiciousAction ? 'CRITICAL' : 'HIGH',
        title: `Creación de Tarea Programada Sospechosa (${log.hostname})`,
        justification: `Se configuró una tarea programada para ejecución automática invocando scripts o ejecutables en directorios no convencionales: ${log.processCommandLine || log.eventDescription}.`,
        technicalDetail: `Evento 4698 detectado en ${log.hostname}. Creador: ${log.user}. Comando: ${log.processCommandLine || log.eventDescription}.`,
        impact: 'Mecanismo de persistencia automática y mantenimiento de acceso tras reinicios del sistema.',
        affectedUsers: [log.user],
        affectedHosts: [log.hostname],
        relatedLogs: [log],
        timestamp: log.timestamp,
      })
    }

    // 3. Evento 4104: Script Block de PowerShell sospechoso (Reconocimiento de Privilegios)
    if (eventIdStr === '4104' || desc.includes('powershell script block')) {
      if (
        content.includes('get-localgroupmember') ||
        content.includes('administrators') ||
        content.includes('get-adprincipalgroupmembership')
      ) {
        incidents.push({
          id: `INC-PS-ENUM-${log.logId}`,
          category: 'ESCALATION',
          risk: 'HIGH',
          title: `Enumeración de Grupos de Administradores Locales vía PowerShell`,
          justification: `Se interceptó un bloque de script PowerShell (Evento 4104) ejecutando comandos de reconocimiento de miembros del grupo Administradores: ${log.eventDescription}.`,
          technicalDetail: `Evento 4104 en ${log.hostname}. Usuario: ${log.user}. Script: ${log.eventDescription}.`,
          impact: 'Fase de descubrimiento interno previa a la elevación de privilegios o movimiento lateral hacia cuentas clave.',
          affectedUsers: [log.user],
          affectedHosts: [log.hostname],
          relatedLogs: [log],
          timestamp: log.timestamp,
        })
      }
    }
  }

  return incidents
}
