import type { LogEntry, Incident } from '@/types/log.types'
import { detectBruteForce } from './detectors/bruteForce'
import { detectSuspiciousLogins } from './detectors/suspiciousLogin'
import { detectPrivilegeEscalation } from './detectors/escalation'
import { detectMaliciousCommands } from './detectors/maliciousCommands'
import { detectLateralMovement } from './detectors/lateralMovement'
import { detectAnomalies } from './detectors/anomalies'
import { sortIncidentsByRisk } from './riskClassifier'

/**
 * Orquestador y Correlador de Amenazas Forenses.
 * Ejecuta los 6 detectores heurísticos sobre la colección de logs
 * y enlaza incidentes que comparten usuarios, hosts o vectores de ataque comunes.
 */
export function runCorrelationPipeline(logs: LogEntry[]): Incident[] {
  // 1. Ejecutar cada uno de los 6 detectores heurísticos
  const rawIncidents: Incident[] = [
    ...detectBruteForce(logs),
    ...detectSuspiciousLogins(logs),
    ...detectPrivilegeEscalation(logs),
    ...detectMaliciousCommands(logs),
    ...detectLateralMovement(logs),
    ...detectAnomalies(logs),
  ]

  // 2. Correlación cruzada de entidades (Usuarios, Hosts)
  const correlatedIncidents = rawIncidents.map((incident, index, arr) => {
    const correlatedWith: string[] = []

    for (let i = 0; i < arr.length; i++) {
      if (i === index) continue
      const other = arr[i]

      // Comprobar si comparten usuarios afectados
      const shareUser = incident.affectedUsers.some(
        (u) => u && u !== '-' && u !== 'N/A' && other.affectedUsers.includes(u)
      )

      // Comprobar si comparten hosts afectados
      const shareHost = incident.affectedHosts.some(
        (h) => h && h !== '-' && other.affectedHosts.includes(h)
      )

      if (shareUser || shareHost) {
        correlatedWith.push(other.id)
      }
    }

    return {
      ...incident,
      correlatedWith: Array.from(new Set(correlatedWith)),
    }
  })

  // 3. Ordenar por criticidad (CRITICAL primero, luego HIGH, etc.)
  return sortIncidentsByRisk(correlatedIncidents)
}
