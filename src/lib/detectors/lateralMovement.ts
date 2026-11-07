import type { LogEntry, Incident } from '@/types/log.types'

/**
 * Detector 5: Movimiento Lateral y Acceso a Recursos Compartidos (T1021.002, T1135)
 * Detecta acceso anómalo o masivo a recursos compartidos críticos (\Finance, \Legal, \Admin$, \C$).
 */
export function detectLateralMovement(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  // 1. Filtrar accesos a shares (Event 5140 o descripciones con shares críticos)
  const shareLogs = logs.filter((l) => {
    const ev = String(l.eventId)
    const desc = (l.eventDescription || '').toLowerCase()
    const cmd = (l.processCommandLine || '').toLowerCase()
    return (
      ev === '5140' ||
      ev === '5145' ||
      desc.includes('share') ||
      desc.includes('recurso compartido') ||
      cmd.includes('\\\\')
    )
  })

  // Agrupar por Host de Destino + Usuario
  const shareAccessGroups = new Map<string, LogEntry[]>()
  for (const log of shareLogs) {
    const desc = (log.eventDescription || '').toLowerCase()
    const isSensitiveShare =
      desc.includes('finance') ||
      desc.includes('legal') ||
      desc.includes('admin$') ||
      desc.includes('c$') ||
      log.destination?.includes('FS-SRV01')

    if (isSensitiveShare) {
      const key = `${log.user}->${log.destination || log.hostname}`
      if (!shareAccessGroups.has(key)) {
        shareAccessGroups.set(key, [])
      }
      shareAccessGroups.get(key)!.push(log)
    }
  }

  for (const [key, groupLogs] of shareAccessGroups.entries()) {
    if (groupLogs.length >= 3) {
      const [user, target] = key.split('->')
      const sourceHosts = Array.from(new Set(groupLogs.map((l) => l.hostname)))

      incidents.push({
        id: `INC-LAT-${user.replace(/[^a-zA-Z0-9]/g, '_')}-${target.replace(/[^a-zA-Z0-9]/g, '_')}`,
        category: 'LATERAL_MOVEMENT',
        risk: 'HIGH',
        title: `Movimiento Lateral y Acceso Masivo a Recursos Compartidos (${target})`,
        justification: `Se detectaron ${groupLogs.length} accesos a recursos compartidos de red en ${target} (carpetas sensibles como Finance/Legal) originados por ${user} desde equipos intermedios (${sourceHosts.join(', ')}).`,
        technicalDetail: `Cadena de eventos 5140/5145 de acceso a shares. Origen: ${sourceHosts.join(', ')}, Destino: ${target}, Usuario: ${user}. Total accesos registrados: ${groupLogs.length}.`,
        impact: 'Exposición y recolección no autorizada de información corporativa clasificada mediante credenciales comprometidas.',
        affectedUsers: [user],
        affectedHosts: Array.from(new Set([...sourceHosts, target])),
        relatedLogs: groupLogs,
        timestamp: groupLogs[0].timestamp,
      })
    }
  }

  return incidents
}
