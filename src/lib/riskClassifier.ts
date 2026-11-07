import type { RiskLevel, Incident } from '@/types/log.types'

export interface RiskEvaluation {
  score: number
  level: RiskLevel
  color: string
  badgeClass: string
  priorityLabel: string
  slaResponseMinutes: number
}

/**
 * Evalúa y enriquece la clasificación de riesgo de un incidente.
 */
export function evaluateIncidentRisk(incident: Incident): RiskEvaluation {
  switch (incident.risk) {
    case 'CRITICAL':
      return {
        score: 95,
        level: 'CRITICAL',
        color: '#EF4444',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        priorityLabel: 'P1 - Inmediata (Contención Activa)',
        slaResponseMinutes: 15,
      }
    case 'HIGH':
      return {
        score: 75,
        level: 'HIGH',
        color: '#F97316',
        badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        priorityLabel: 'P2 - Alta (Investigación Prioritaria)',
        slaResponseMinutes: 60,
      }
    case 'MEDIUM':
      return {
        score: 50,
        level: 'MEDIUM',
        color: '#F59E0B',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        priorityLabel: 'P3 - Media (Revisión Forense en Turno)',
        slaResponseMinutes: 240,
      }
    case 'LOW':
    default:
      return {
        score: 25,
        level: 'LOW',
        color: '#06B6D4',
        badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        priorityLabel: 'P4 - Baja (Registro Informativo)',
        slaResponseMinutes: 1440,
      }
  }
}

/**
 * Ordena una lista de incidentes por orden estricto de severidad: CRITICAL > HIGH > MEDIUM > LOW
 */
export function sortIncidentsByRisk(incidents: Incident[]): Incident[] {
  const priorityOrder: Record<RiskLevel, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  }

  return [...incidents].sort((a, b) => {
    const diff = priorityOrder[b.risk] - priorityOrder[a.risk]
    if (diff !== 0) return diff
    return b.timestamp.getTime() - a.timestamp.getTime()
  })
}
