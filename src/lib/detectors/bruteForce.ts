import type { LogEntry, Incident } from '@/types/log.types'

/**
 * Detector 1: Fuerza Bruta / Password Spraying (T1110)
 * Analiza ráfagas de eventos 4625 (Logon Failure) por IP en ventanas de tiempo.
 * Si detecta un 4624 posterior desde la misma IP o para el mismo usuario, escala a CRÍTICO.
 */
export function detectBruteForce(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  // Filtrar eventos relevantes (4625 y 4624)
  const failedLogons = logs.filter((l) => String(l.eventId) === '4625' || l.result?.toLowerCase() === 'failure')
  const successfulLogons = logs.filter((l) => String(l.eventId) === '4624' || l.result?.toLowerCase() === 'success')

  // Agrupar fallos por Source_IP
  const failuresByIp = new Map<string, LogEntry[]>()
  for (const log of failedLogons) {
    const ip = log.sourceIp?.trim()
    if (!ip || ip === 'N/A' || ip === '-') continue
    if (!failuresByIp.has(ip)) {
      failuresByIp.set(ip, [])
    }
    failuresByIp.get(ip)!.push(log)
  }

  // Analizar cada IP con fallas acumuladas
  for (const [ip, ipLogs] of failuresByIp.entries()) {
    // Si tiene 3 o más fallas
    if (ipLogs.length >= 3) {
      // Ordenar cronológicamente
      ipLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      const affectedUsers = Array.from(new Set(ipLogs.map((l) => l.user).filter((u) => u && u !== 'N/A' && u !== '-')))
      const affectedHosts = Array.from(new Set(ipLogs.map((l) => l.hostname).filter(Boolean)))

      // Comprobar si es IP pública/externa (no RFC1918)
      const isInternalIp = ip.startsWith('10.') || ip.startsWith('192.168.') || (ip.startsWith('172.') && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31)
      const isExternal = !isInternalIp && ip !== '127.0.0.1' && ip !== '::1'

      // Buscar si hubo login exitoso posterior desde esta IP
      const firstFailureTime = ipLogs[0].timestamp.getTime()
      const successfulAfter = successfulLogons.filter(
        (succ) => succ.sourceIp === ip && succ.timestamp.getTime() >= firstFailureTime
      )

      let risk: Incident['risk'] = 'MEDIUM'
      let title = `Ráfaga de Inicios de Sesión Fallidos (${ip})`
      let justification = `Se registraron ${ipLogs.length} eventos 4625 consecutivos desde la IP interna ${ip}.`

      if (successfulAfter.length > 0) {
        risk = 'CRITICAL'
        const compromisedUser = successfulAfter[0].user
        title = `Ataque de Fuerza Bruta Exitoso / Compromiso de Cuenta (${compromisedUser})`
        justification = `IP ${ip} (${isExternal ? 'EXTERNA' : 'INTERNA'}) ejecutó ${ipLogs.length} intentos fallidos contra ${affectedUsers.length} cuentas y posteriormente logró una autenticación exitosa (Evento 4624) en ${successfulAfter[0].hostname} con el usuario ${compromisedUser}.`
      } else if (isExternal || affectedUsers.length >= 3 || ipLogs.length >= 5) {
        risk = 'HIGH'
        title = `Ataque de Password Spraying / Fuerza Bruta desde IP Externa (${ip})`
        justification = `La IP externa no autorizada ${ip} ejecutó ${ipLogs.length} intentos de autenticación fallidos distribuidos sobre ${affectedUsers.length} cuentas corporativas en un corto período de tiempo.`
      }

      // Añadir los logs relevantes (fallos + login exitoso si existe)
      const relatedLogs = [...ipLogs, ...successfulAfter].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      )

      incidents.push({
        id: `INC-BF-${ip.replace(/[^a-zA-Z0-9]/g, '_')}`,
        category: 'BRUTE_FORCE',
        risk,
        title,
        justification,
        technicalDetail: `Análisis de correlación Event 4625: Total fallas=${ipLogs.length}, Usuarios objetivo=${affectedUsers.join(', ')}. Vector: ${isExternal ? 'Acceso Perimetral Externo' : 'Red Interna'}. Éxito posterior=${successfulAfter.length > 0 ? 'SÍ (' + successfulAfter[0].user + ')' : 'NO'}.`,
        impact: successfulAfter.length > 0
          ? 'Compromiso de credenciales activas en el Dominio. Posible movimiento lateral e infiltración de actor malicioso.'
          : 'Degradación potencial de servicios de autenticación y riesgo inminente de compromiso de contraseñas débiles.',
        affectedUsers: successfulAfter.length > 0
          ? Array.from(new Set([...affectedUsers, successfulAfter[0].user]))
          : affectedUsers,
        affectedHosts,
        relatedLogs,
        timestamp: ipLogs[0].timestamp,
      })
    }
  }

  return incidents
}
