import type { LogEntry, Incident } from '@/types/log.types'

/**
 * Detector 2: Inicios de Sesión Sospechosos / RDP / Horas Inusuales (T1078, T1021.001)
 */
export function detectSuspiciousLogins(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  // Logs de sesión exitosa (4624) o privilegios asignados (4672)
  const loginLogs = logs.filter(
    (l) => String(l.eventId) === '4624' || String(l.eventId) === '4672'
  )

  for (const log of loginLogs) {
    const desc = (log.eventDescription || '').toLowerCase()
    const ip = log.sourceIp?.trim() || ''
    const isInternalIp = ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.') || ip === '127.0.0.1' || ip === '::1' || ip === 'N/A' || ip === '-'
    const isExternal = !isInternalIp

    // Caso 1: RDP (LogonType=10 o Remote Desktop) desde IP externa
    const isRdp = desc.includes('logontype 10') || desc.includes('logontype=10') || desc.includes('remoteinteractive') || desc.includes('rdp')
    if (isRdp && isExternal) {
      incidents.push({
        id: `INC-RDP-${log.logId}`,
        category: 'SUSPICIOUS_LOGIN',
        risk: 'HIGH',
        title: `Sesión RDP Remota Directa desde IP Externa (${ip})`,
        justification: `Se estableció una conexión de Escritorio Remoto (RDP LogonType 10) desde la dirección externa ${ip} hacia el equipo ${log.hostname} con la cuenta ${log.user}.`,
        technicalDetail: `Evento 4624 LogonType 10 detectado. Host objetivo: ${log.hostname}, Usuario: ${log.user}, IP Externa: ${ip}.`,
        impact: 'Acceso directo a la consola gráfica de servidores internos evadiendo potencialmente controles de VPN o MFA.',
        affectedUsers: [log.user],
        affectedHosts: [log.hostname],
        relatedLogs: [log],
        timestamp: log.timestamp,
      })
    }

    // Caso 2: Asignación de privilegios 4672 fuera de horas laborales o en usuarios no habituales
    if (String(log.eventId) === '4672') {
      const hours = log.timestamp.getUTCHours()
      const isNight = hours >= 0 && hours <= 5 // 00:00 a 05:00 UTC
      if (isNight && log.user && !log.user.includes('SYSTEM') && !log.user.includes('LOCAL SERVICE')) {
        incidents.push({
          id: `INC-PRIV-${log.logId}`,
          category: 'SUSPICIOUS_LOGIN',
          risk: 'MEDIUM',
          title: `Asignación de Privilegios Administrativos en Horario No Laboral (${log.user})`,
          justification: `El usuario ${log.user} obtuvo privilegios especiales de sistema (Evento 4672) a las ${log.timestamp.toISOString().substring(11, 19)} UTC en ${log.hostname}.`,
          technicalDetail: `Evento 4672 Special Privileges Assigned detectado fuera de ventana operativa estándar. Host: ${log.hostname}.`,
          impact: 'Posible escalada o actividad oculta nocturna con privilegios elevados.',
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
