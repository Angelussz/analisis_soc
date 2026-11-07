import type { LogEntry, Incident } from '@/types/log.types'

/**
 * Detector 6: Anomalías de Red, Webshells y Exfiltración de Datos (T1048, T1505.003, T1595)
 */
export function detectAnomalies(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []

  // 1. Detección de Webshell (/uploads/*.aspx?cmd= o extensiones ejecutables web)
  const webshellLogs = logs.filter((l) => {
    const uri = (l.processCommandLine || l.eventDescription || '').toLowerCase()
    return uri.includes('aspx?cmd=') || uri.includes('php?cmd=') || uri.includes('/uploads/')
  })

  if (webshellLogs.length > 0) {
    const attackers = Array.from(new Set(webshellLogs.map((l) => l.sourceIp)))
    const targets = Array.from(new Set(webshellLogs.map((l) => l.hostname || l.destination)))

    incidents.push({
      id: `INC-WEBSHELL-${webshellLogs[0].logId}`,
      category: 'WEBSHELL',
      risk: 'CRITICAL',
      title: `Interacción con Webshell Detectada (${targets.join(', ')})`,
      justification: `Se detectaron ${webshellLogs.length} solicitudes HTTP con parámetros de ejecución remota de comandos hacia un archivo sospechoso en la ruta de subidas (ej. /uploads/test.aspx?cmd=whoami) desde la IP externa ${attackers.join(', ')}.`,
      technicalDetail: `Explotación de Webshell activa. URI solicitada: ${webshellLogs[0].processCommandLine || webshellLogs[0].eventDescription}. Destino: ${targets.join(', ')}.`,
      impact: 'Control y ejecución remota de código en el servidor web (RCE). Posible puerta trasera persistente en el servidor expuesto a Internet.',
      affectedUsers: ['IIS APPPOOL\\DefaultAppPool'],
      affectedHosts: targets,
      relatedLogs: webshellLogs,
      timestamp: webshellLogs[0].timestamp,
    })
  }

  // 2. Detección de Exfiltración Masiva de Datos por HTTPS (Proxy)
  const exfilLogs = logs.filter((l) => {
    const ev = String(l.eventId)
    const desc = (l.eventDescription || '').toLowerCase()
    const isProxy = l.logSource?.toLowerCase().includes('proxy') || ev === 'PROXY_ACCESS'
    return isProxy && desc.includes('post outbound')
  })

  if (exfilLogs.length >= 3) {
    // Calcular volumen total transferido
    let totalBytes = 0
    for (const log of exfilLogs) {
      const fullText = `${log.processCommandLine || ''} ${log.eventDescription || ''}`
      const match = fullText.match(/bytes_out=(\d+)/i)
      if (match) {
        totalBytes += parseInt(match[1], 10)
      }
    }

    const totalMb = (totalBytes / (1024 * 1024)).toFixed(1)
    const user = exfilLogs[0].user
    const dest = exfilLogs[0].destination
    const srcHost = exfilLogs[0].hostname

    incidents.push({
      id: `INC-EXFIL-${exfilLogs[0].logId}`,
      category: 'EXFILTRATION',
      risk: 'CRITICAL',
      title: `Exfiltración Masiva de Datos por HTTPS POST (${totalMb} MB)`,
      justification: `Se registraron ${exfilLogs.length} transferencias continuas HTTP POST hacia el servidor externo no corporativo ${dest} con un volumen acumulado de ${totalMb} MB realizado bajo la cuenta ${user}.`,
      technicalDetail: `Evento PROXY_ACCESS repetitivo: ${exfilLogs.length} sesiones. Destino: ${dest}, Usuario: ${user}, Equipo: ${srcHost}, Tamaño acumulado: ${totalMb} MB (${totalBytes.toLocaleString()} bytes).`,
      impact: 'Fuga masiva y robo de información corporativa y confidencial (MITRE T1048) evadiendo filtros de inspección SSL/TLS.',
      affectedUsers: [user],
      affectedHosts: [srcHost],
      relatedLogs: exfilLogs,
      timestamp: exfilLogs[0].timestamp,
    })
  }

  // 3. Reconocimiento de Aplicaciones Web y Endpoints Administrativos
  const reconLogs = logs.filter((l) => {
    const uri = (l.processCommandLine || '').toLowerCase()
    return (
      uri.includes('/admin/') ||
      uri.includes('/api/v1/export') ||
      uri.includes('/login?user=admin')
    )
  })

  if (reconLogs.length >= 5) {
    const attacker = reconLogs[0].sourceIp
    const target = reconLogs[0].hostname

    incidents.push({
      id: `INC-WEB-RECON-${reconLogs[0].logId}`,
      category: 'ANOMALY',
      risk: 'HIGH',
      title: `Escaneo y Reconocimiento de Endpoints Web Sensibles (${attacker})`,
      justification: `La IP externa ${attacker} ejecutó ${reconLogs.length} solicitudes automatizadas explorando paneles administrativos (/admin/), APIs de exportación y formulación de login administrativo.`,
      technicalDetail: `Filtro HTTP_ACCESS: ráfaga de sondeo de directorios protegidos y rutas de administración en ${target}.`,
      impact: 'Descubrimiento de vectores de ataque perimetrales y preparación de intrusión.',
      affectedUsers: ['-'],
      affectedHosts: [target],
      relatedLogs: reconLogs,
      timestamp: reconLogs[0].timestamp,
    })
  }

  return incidents
}
